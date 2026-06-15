import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { formatPrice, formatDate, orderStatusLabels } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';

const STATUS_OPTIONS = [
  'PENDING',
  'PAID',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
  'REFUNDED',
];

async function getOrders(status?: string, search?: string, page = 1) {
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
  try {
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: { select: { name: true, email: true } },
          items: { select: { quantity: true } },
        },
      }),
      prisma.order.count({ where }),
    ]);
    return { orders, total, totalPages: Math.ceil(total / limit) };
  } catch {
    return { orders: [], total: 0, totalPages: 0 };
  }
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const { orders, total, totalPages } = await getOrders(
    params.status,
    params.search,
    page,
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#0A0A0A]">
          Pedidos{' '}
          <span className="text-sm font-normal text-[#9C9C9C] ml-2">
            {total} total
          </span>
        </h1>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap">
        <Link
          href="/admin/pedidos"
          className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
            !params.status
              ? 'text-white border-[#9333EA]'
              : 'text-[#5C5C5C] border-[#E4E4E4] hover:bg-[#F7F7F7]'
          }`}
          style={
            !params.status
              ? { background: 'linear-gradient(135deg, #9333EA, #D97706)' }
              : {}
          }
        >
          Todos
        </Link>
        {STATUS_OPTIONS.map((s) => {
          const info = orderStatusLabels[s];
          return (
            <Link
              key={s}
              href={`/admin/pedidos?status=${s}`}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                params.status === s
                  ? 'text-white border-transparent'
                  : 'text-[#5C5C5C] border-[#E4E4E4] hover:bg-[#F7F7F7]'
              }`}
              style={
                params.status === s
                  ? { background: info?.color || '#9333EA' }
                  : {}
              }
            >
              {info?.label || s}
            </Link>
          );
        })}
      </div>

      {/* Search */}
      <form className="bg-white rounded-xl p-4 border border-[#E4E4E4]">
        <input
          name="search"
          defaultValue={params.search}
          placeholder="Buscar por email, ID do pedido..."
          className="input h-9 text-sm"
        />
        {params.status && (
          <input type="hidden" name="status" value={params.status} />
        )}
      </form>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E4E4E4] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Itens</th>
                <th>Status</th>
                <th>Total</th>
                <th>Data</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-12 text-[#9C9C9C] text-sm"
                  >
                    Nenhum pedido encontrado
                  </td>
                </tr>
              ) : (
                orders.map((order: any) => {
                  const statusInfo = orderStatusLabels[order.status] || {
                    label: order.status,
                    color: '#9C9C9C',
                  };
                  const totalItems = order.items.reduce(
                    (s: number, i: any) => s + i.quantity,
                    0,
                  );
                  return (
                    <tr key={order.id}>
                      <td>
                        <span className="font-semibold text-xs text-[#9333EA]">
                          #{order.id.slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <span className="text-sm">
                          {order.user?.name ||
                            (order as any).guestEmail ||
                            'Convidado'}
                        </span>
                      </td>
                      <td>
                        <span className="text-sm text-[#5C5C5C]">
                          {totalItems} {totalItems === 1 ? 'item' : 'itens'}
                        </span>
                      </td>
                      <td>
                        <span
                          className="badge text-[10px]"
                          style={{
                            background: `${statusInfo.color}20`,
                            color: statusInfo.color,
                          }}
                        >
                          {statusInfo.label}
                        </span>
                      </td>
                      <td>
                        <span className="font-semibold text-sm">
                          {formatPrice(Number(order.total))}
                        </span>
                      </td>
                      <td>
                        <span className="text-xs text-[#9C9C9C]">
                          {formatDate(order.createdAt)}
                        </span>
                      </td>
                      <td>
                        <Link
                          href={`/admin/pedidos/${order.id}`}
                          className="flex items-center gap-1 text-xs text-[#9333EA] hover:underline"
                        >
                          Ver <ArrowUpRight size={12} />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/pedidos?page=${p}${params.status ? `&status=${params.status}` : ''}${params.search ? `&search=${params.search}` : ''}`}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm border transition-all ${
                p === page
                  ? 'text-white border-[#9333EA]'
                  : 'text-[#5C5C5C] border-[#E4E4E4] hover:bg-[#F7F7F7]'
              }`}
              style={p === page ? { background: '#9333EA' } : {}}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
