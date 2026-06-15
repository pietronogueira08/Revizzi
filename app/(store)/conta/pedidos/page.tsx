import type { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { formatPrice, formatDate, orderStatusLabels } from '@/lib/utils';
import { Package, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Meus Pedidos',
};

export default async function MeusPedidosPage() {
  const session = await auth();
  if (!session) redirect('/login?callbackUrl=/conta/pedidos');

  let orders: any[] = [];
  try {
    orders = await prisma.order.findMany({
      where: { userId: (session.user as any).id },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          take: 1,
          include: { product: { select: { name: true, images: true } } },
        },
      },
    });
  } catch {}

  return (
    <div className="section-inner py-8 max-w-3xl">
      <h1 className="text-2xl font-700 text-[#0A0A0A] mb-6">Meus Pedidos</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-[#F7F7F7] rounded-2xl border border-dashed border-[#E4E4E4]">
          <Package size={40} className="mx-auto text-[#E4E4E4] mb-4" />
          <h3 className="font-600 text-[#0A0A0A] mb-2">Nenhum pedido ainda</h3>
          <p className="text-sm text-[#9C9C9C] mb-4">Quando você fizer pedidos, eles aparecerão aqui.</p>
          <Link href="/produtos" className="btn-primary text-sm px-6 py-2.5">
            Explorar produtos
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const statusInfo = orderStatusLabels[order.status] || { label: order.status, color: '#9C9C9C' };
            return (
              <Link
                key={order.id}
                href={`/pedido/${order.id}`}
                className="block bg-white rounded-xl border border-[#E4E4E4] p-5 hover:border-[#9333EA] hover:shadow-card transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-600 text-[#9333EA] text-sm">#{order.id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-[#9C9C9C]">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="badge text-[10px]"
                      style={{ background: `${statusInfo.color}20`, color: statusInfo.color }}
                    >
                      {statusInfo.label}
                    </span>
                    <span className="font-700 text-sm">{formatPrice(Number(order.total))}</span>
                    <ChevronRight size={16} className="text-[#9C9C9C]" />
                  </div>
                </div>
                {order.items[0] && (
                  <p className="text-sm text-[#5C5C5C] line-clamp-1">
                    {order.items[0].product.name}
                    {order.items.length > 1 && ` +${order.items.length - 1} item(s)`}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
