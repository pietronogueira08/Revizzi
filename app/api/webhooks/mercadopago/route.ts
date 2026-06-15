import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getPayment } from '@/lib/mercadopago';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();

    // Validate HMAC signature
    const xSignature = request.headers.get('x-signature');
    const xRequestId = request.headers.get('x-request-id');
    if (xSignature && xRequestId && process.env.MP_WEBHOOK_SECRET) {
      const dataId = new URL(request.url).searchParams.get('data.id') || '';
      const ts =
        xSignature
          .split(',')
          .find((s) => s.startsWith('ts='))
          ?.split('=')[1] || '';
      const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
      const hmac = crypto
        .createHmac('sha256', process.env.MP_WEBHOOK_SECRET)
        .update(manifest)
        .digest('hex');
      const v1 = xSignature
        .split(',')
        .find((s) => s.startsWith('v1='))
        ?.split('=')[1];
      if (v1 && hmac !== v1) {
        return NextResponse.json({ error: 'Assinatura inválida' }, { status: 401 });
      }
    }

    const data = JSON.parse(body);
    if (
      data.type !== 'payment' &&
      data.action !== 'payment.updated' &&
      data.action !== 'payment.created'
    ) {
      return NextResponse.json({ ok: true });
    }

    const paymentId = data.data?.id;
    if (!paymentId) return NextResponse.json({ ok: true });

    const payment = await getPayment(String(paymentId));
    const orderId = payment.external_reference;
    if (!orderId) return NextResponse.json({ ok: true });

    const mpStatus = payment.status;
    let orderStatus: string = 'PENDING';
    if (mpStatus === 'approved') orderStatus = 'PAID';
    else if (mpStatus === 'cancelled' || mpStatus === 'refunded') orderStatus = 'CANCELLED';
    else if (mpStatus === 'in_process' || mpStatus === 'pending') orderStatus = 'PENDING';

    // Update order
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: orderStatus as any,
        mpPaymentId: String(paymentId),
        mpStatus,
      },
      include: { items: true, coupon: true },
    });

    // Decrement stock on payment approved
    if (mpStatus === 'approved') {
      for (const item of order.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
        await prisma.stockMovement.create({
          data: {
            productId: item.productId,
            type: 'OUT',
            quantity: item.quantity,
            reason: `Pedido #${order.id}`,
          },
        });
      }
      // Update coupon usage
      if (order.couponId) {
        await prisma.coupon.update({
          where: { id: order.couponId },
          data: { usedCount: { increment: 1 } },
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
  }
}
