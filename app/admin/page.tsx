import { prisma } from '@/lib/prisma';
import { formatPrice, orderStatusLabels, formatDate } from '@/lib/utils';
import Link from 'next/link';
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  AlertTriangle,
  Package,
  ArrowUpRight,
  ChevronRight,
} from 'lucide-react';
import AdminRevenueChart from '@/components/admin/RevenueChart';

async function getDashboardData() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  try {
    const [
      monthOrders,
      todayOrders,
      allPaid,
      lowStockProducts,
      lastOrders,
      recentOrders,
    ] = await Promise.all([
      prisma.order.findMany({
        where: { createdAt: { gte: startOfMonth }, status: 'PAID' },
        select: { total: true },
      }),
      prisma.order.count({ where: { createdAt: { gte: startOfDay } } }),
      prisma.order.findMany({
        where: { status: 'PAID' },
        select: { total: true },
      }),
      prisma.product.findMany({
        where: { isActive: true, stock: { lt: 5 } },
        select: { id: true, name: true, stock: true },
        take: 5,
      }),
      prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { user: { select: { name: true, email: true } } },
      }),
      prisma.order.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        select: { createdAt: true, total: true, status: true },
      }),
    ]);

    const monthRevenue = monthOrders.reduce((s: number, o: any) => s + Number(o.total), 0);
    const avgTicket =
      allPaid.length > 0
        ? allPaid.reduce((s: number, o: any) => s + Number(o.total), 0) / allPaid.length
        : 0;

    // Revenue by day (last 30 days)
    const revenueByDay: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().slice(0, 10);
      revenueByDay[key] = 0;
    }
    recentOrders.forEach((o: any) => {
      if (o.status === 'PAID') {
        const key = o.createdAt.toISOString().slice(0, 10);
        if (key in revenueByDay) revenueByDay[key] += Number(o.total);
      }
    });
    const chartData = Object.entries(revenueByDay).map(([date, revenue]) => ({
      date: new Date(date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
      }),
      revenue,
    }));

    // Orders by status
    const statusCounts: Record<string, number> = {};
    recentOrders.forEach((o: any) => {
      statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
    });

    return {
      monthRevenue,
      todayOrders,
      avgTicket,
      lowStockProducts,
      lastOrders,
      chartData,
      statusCounts,
    };
  } catch {
    return {
      monthRevenue: 0,
      todayOrders: 0,
      avgTicket: 0,
      lowStockProducts: [],
      lastOrders: [],
      chartData: [],
      statusCounts: {},
    };
  }
}

export default async function AdminDashboard() {
  const {
    monthRevenue,
    todayOrders,
    avgTicket,
    lowStockProducts,
    lastOrders,
    chartData,
    statusCounts,
  } = await getDashboardData();

  const metrics = [
    {
      label: 'Receita do Mês',
      value: formatPrice(monthRevenue),
      icon: DollarSign,
      color: '#9333EA',
      change: '+12%',
    },
    {
      label: 'Pedidos Hoje',
      value: String(todayOrders),
      icon: ShoppingBag,
      color: '#EA580C',
      change: 'hoje',
    },
    {
      label: 'Ticket Médio',
      value: formatPrice(avgTicket),
      icon: TrendingUp,
      color: '#16A34A',
      change: 'geral',
    },
    {
      label: 'Estoque Baixo',
      value: String(lowStockProducts.length),
      icon: AlertTriangle,
      color: '#D97706',
      change: 'produtos',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#0A0A0A]">Dashboard</h1>
        <span className="text-sm text-[#9C9C9C]">
          {new Date().toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </span>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m: any) => (
          <div
            key={m.label}
            className="bg-white rounded-xl p-5 border border-[#E4E4E4] hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: `${m.color}15`,
                  border: `1.5px solid ${m.color}30`,
                }}
              >
                <m.icon size={18} style={{ color: m.color }} strokeWidth={1.5} />
              </div>
              <span className="text-xs font-semibold" style={{ color: m.color }}>
                {m.change}
              </span>
            </div>
            <p className="text-xs text-[#9C9C9C] mb-1">{m.label}</p>
            <p className="text-2xl font-bold text-[#0A0A0A]">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-[#E4E4E4]">
          <h2 className="font-bold text-[#0A0A0A] mb-4">
            Receita — Últimos 30 Dias
          </h2>
          <AdminRevenueChart data={chartData} />
        </div>
        <div className="bg-white rounded-xl p-6 border border-[#E4E4E4]">
          <h2 className="font-bold text-[#0A0A0A] mb-4">Pedidos por Status</h2>
          <div className="space-y-3">
            {Object.entries(statusCounts).map(([status, count]) => {
              const info = orderStatusLabels[status] || {
                label: status,
                color: '#9C9C9C',
              };
              return (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: info.color }}
                    />
                    <span className="text-sm text-[#5C5C5C]">{info.label}</span>
                  </div>
                  <span className="text-sm font-bold text-[#0A0A0A]">{count}</span>
                </div>
              );
            })}
            {Object.keys(statusCounts).length === 0 && (
              <p className="text-sm text-[#9C9C9C] text-center py-4">
                Nenhum pedido ainda
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Low stock alerts */}
      {lowStockProducts.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} className="text-yellow-600" />
            <h3 className="font-bold text-yellow-800 text-sm">
              Estoque Baixo — Atenção Necessária
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStockProducts.map((p: any) => (
              <Link
                key={p.id}
                href={`/admin/produtos/${p.id}/editar`}
                className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-yellow-200 text-xs hover:border-yellow-400 transition-colors"
              >
                <Package size={12} className="text-yellow-600" />
                <span className="font-medium text-[#0A0A0A]">{p.name}</span>
                <span className="text-yellow-600 font-bold">{p.stock} un.</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Last orders */}
      <div className="bg-white rounded-xl border border-[#E4E4E4] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E4E4E4]">
          <h2 className="font-bold text-[#0A0A0A]">Últimos Pedidos</h2>
          <Link
            href="/admin/pedidos"
            className="flex items-center gap-1 text-sm text-[#9333EA] hover:underline"
          >
            Ver todos <ChevronRight size={13} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Status</th>
                <th>Total</th>
                <th>Data</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {lastOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-[#9C9C9C] text-sm">
                    Nenhum pedido ainda
                  </td>
                </tr>
              ) : (
                lastOrders.map((order: any) => {
                  const statusInfo = orderStatusLabels[order.status] || {
                    label: order.status,
                    color: '#9C9C9C',
                  };
                  return (
                    <tr key={order.id}>
                      <td>
                        <span className="font-semibold text-xs text-[#9333EA]">
                          #{order.id.slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <span className="text-sm">
                          {(order.user as any)?.name ||
                            (order as any).guestEmail ||
                            'Convidado'}
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
                        <span className="text-sm text-[#9C9C9C]">
                          {formatDate(order.createdAt)}
                        </span>
                      </td>
                      <td>
                        <Link
                          href={`/admin/pedidos/${order.id}`}
                          className="text-[#9333EA] hover:underline text-xs"
                        >
                          Ver <ArrowUpRight size={12} className="inline" />
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
    </div>
  );
}
