import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const code = searchParams.get('code')?.toUpperCase();
    const subtotal = parseFloat(searchParams.get('subtotal') || '0');

    if (!code) return NextResponse.json({ error: 'Código obrigatório' }, { status: 400 });

    const coupon = await prisma.coupon.findFirst({
      where: { code, isActive: true },
    });

    if (!coupon)
      return NextResponse.json(
        { error: 'Cupom não encontrado ou inativo' },
        { status: 404 }
      );

    if (coupon.expiresAt && coupon.expiresAt < new Date())
      return NextResponse.json({ error: 'Cupom expirado' }, { status: 400 });

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit)
      return NextResponse.json({ error: 'Cupom esgotado' }, { status: 400 });

    if (coupon.minOrderValue && subtotal < Number(coupon.minOrderValue)) {
      return NextResponse.json(
        {
          error: `Pedido mínimo de R$ ${Number(coupon.minOrderValue).toFixed(2)} para este cupom`,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      code: coupon.code,
      type: coupon.type,
      value: Number(coupon.value),
      minOrderValue: coupon.minOrderValue ? Number(coupon.minOrderValue) : null,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao validar cupom' }, { status: 500 });
  }
}
