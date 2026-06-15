import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { couponSchema } from '@/lib/validations';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'ADMIN')
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' } as any,
      include: { _count: { select: { orders: true } } },
    });
    return NextResponse.json(coupons);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar cupons' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'ADMIN')
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    const body = await request.json();
    const data = couponSchema.parse(body);
    const coupon = await prisma.coupon.create({
      data: {
        code: data.code.toUpperCase(),
        type: data.type,
        value: data.value,
        minOrderValue: data.minOrderValue || null,
        usageLimit: data.usageLimit || null,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        isActive: data.isActive,
      },
    });
    return NextResponse.json(coupon, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError')
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    if (error.code === 'P2002')
      return NextResponse.json({ error: 'Código de cupom já existe' }, { status: 409 });
    return NextResponse.json({ error: 'Erro ao criar cupom' }, { status: 500 });
  }
}
