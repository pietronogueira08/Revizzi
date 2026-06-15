import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: { product: { select: { name: true, images: true, slug: true } } },
        },
        coupon: { select: { code: true } },
        user: { select: { name: true, email: true } },
      },
    });
    if (!order)
      return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 });

    const userId = (session?.user as any)?.id;
    const role = (session?.user as any)?.role;
    if (
      role !== 'ADMIN' &&
      order.userId !== userId &&
      order.guestEmail !== session?.user?.email
    ) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
    }
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar pedido' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'ADMIN')
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    const { id } = await params;
    const body = await request.json();
    const { status, trackingCode, notes } = body;
    const order = await prisma.order.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(trackingCode !== undefined && { trackingCode }),
        ...(notes !== undefined && { notes }),
      },
    });
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar pedido' }, { status: 500 });
  }
}
