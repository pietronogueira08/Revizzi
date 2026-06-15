import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { createPreference } from '@/lib/mercadopago';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customer, address, items, subtotal, shippingCost, discount, total, couponCode } =
      body;

    if (!items?.length)
      return NextResponse.json({ error: 'Carrinho vazio' }, { status: 400 });

    // Find user session (optional)
    const session = await auth();
    const userId = session?.user ? (session.user as any).id : null;

    // Validate coupon
    let couponId: string | null = null;
    if (couponCode) {
      const coupon = await prisma.coupon.findFirst({
        where: { code: couponCode, isActive: true },
      });
      if (coupon) couponId = coupon.id;
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId,
        guestEmail: userId ? null : customer.email,
        status: 'PENDING',
        subtotal,
        shippingCost,
        discount,
        total,
        couponId,
        shippingAddress: address,
        paymentMethod: 'mercadopago',
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.unitPrice * item.quantity,
          })),
        },
      },
    });

    // Create MP preference
    let checkoutUrl = null;
    try {
      const preference = await createPreference({
        id: order.id,
        customerName: customer.name,
        customerEmail: customer.email,
        items: items.map((i: any) => ({
          productId: i.productId,
          name: i.name,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
        })),
        shippingCost,
        discount,
      });
      checkoutUrl = preference.init_point;
    } catch (mpError) {
      console.error('MP error:', mpError);
      // Return order ID without checkout URL if MP fails
      return NextResponse.json(
        {
          orderId: order.id,
          error: 'Erro no gateway de pagamento. Configure as credenciais do Mercado Pago.',
        },
        { status: 201 }
      );
    }

    return NextResponse.json({ orderId: order.id, checkoutUrl }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao criar pedido' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    const { searchParams } = request.nextUrl;
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (search)
      where.OR = [
        { id: { contains: search } },
        { guestEmail: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ];

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: { select: { name: true, email: true } },
          items: {
            include: { product: { select: { name: true, images: true } } },
          },
          coupon: { select: { code: true } },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      orders,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar pedidos' }, { status: 500 });
  }
}
