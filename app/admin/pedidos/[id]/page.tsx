import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { formatPrice, formatDate, orderStatusLabels } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Package, MapPin, User, CreditCard } from 'lucide-react';
import OrderStatusUpdate from './OrderStatusUpdate';

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let order: any = null;
  try {
    order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: { select: { name: true, images: true, slug: true } },
          },
        },
        user: { select: { name: true, email: true } },
        coupon: { select: { code: true } },
      },
    });
  } catch {
    order = null;
  }

  if (!order) notFound();

  const statusInfo = orderStatusLabels[order.status] || {
    label: order.status,
    color: '#9C9C9C',
  };
  const address = order.shippingAddress as any;

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/pedidos" className="btn-secondary h-8 px-3 text-xs">
          <ChevronLeft size={14} /> Voltar
        </Link>
        <h1 className="text-xl font-bold text-[#0A0A0A]">
          Pedido #{id.slice(-8).toUpperCase()}
        </h1>
        <span
          className="badge text-xs"
          style={{
            background: `${statusInfo.color}20`,
            color: statusInfo.color,
          }}
        >
          {statusInfo.label}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Items + status update */}
        <div className="lg:col-span-2 space-y-5">
          {/* Order items */}
          <div className="bg-white rounded-xl border border-[#E4E4E4] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E4E4E4] flex items-center gap-2">
              <Package size={16} />
              <h2 className="font-bold">Itens do Pedido</h2>
            </div>
            <div className="divide-y divide-[#F0F0F0]">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-[#F7F7F7] flex-shrink-0">
                    {item.product.images[0] && (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-contain p-1"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.product.name}</p>
                    <p className="text-xs text-[#9C9C9C]">
                      x{item.quantity} × {formatPrice(Number(item.unitPrice))}
                    </p>
                  </div>
                  <p className="font-bold text-sm">
                    {formatPrice(Number(item.total))}
                  </p>
                </div>
              ))}
            </div>
            {/* Totals */}
            <div className="px-5 py-4 border-t border-[#E4E4E4] space-y-1.5 text-sm">
              <div className="flex justify-between text-[#5C5C5C]">
                <span>Subtotal</span>
                <span>{formatPrice(Number(order.subtotal))}</span>
              </div>
              {Number(order.discount) > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>
                    Desconto{' '}
                    {order.coupon && `(${order.coupon.code})`}
                  </span>
                  <span>-{formatPrice(Number(order.discount))}</span>
                </div>
              )}
              <div className="flex justify-between text-[#5C5C5C]">
                <span>Frete</span>
                <span>
                  {Number(order.shippingCost) === 0
                    ? 'Grátis'
                    : formatPrice(Number(order.shippingCost))}
                </span>
              </div>
              <div className="flex justify-between font-bold text-base text-[#0A0A0A] pt-2 border-t border-[#E4E4E4]">
                <span>Total</span>
                <span>{formatPrice(Number(order.total))}</span>
              </div>
            </div>
          </div>

          {/* Status update form */}
          <OrderStatusUpdate
            orderId={order.id}
            currentStatus={order.status}
            currentTracking={order.trackingCode || ''}
          />
        </div>

        {/* Info sidebar */}
        <div className="space-y-4">
          {/* Customer */}
          <div className="bg-white rounded-xl border border-[#E4E4E4] p-5">
            <div className="flex items-center gap-2 mb-3">
              <User size={14} />
              <h3 className="font-bold text-sm">Cliente</h3>
            </div>
            <p className="text-sm font-medium">
              {order.user?.name || 'Convidado'}
            </p>
            <p className="text-sm text-[#5C5C5C]">
              {order.user?.email || order.guestEmail}
            </p>
          </div>

          {/* Shipping address */}
          <div className="bg-white rounded-xl border border-[#E4E4E4] p-5">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={14} />
              <h3 className="font-bold text-sm">Entrega</h3>
            </div>
            <div className="text-sm text-[#5C5C5C] space-y-0.5">
              <p>
                {address?.street}, {address?.number}
                {address?.complement ? `, ${address.complement}` : ''}
              </p>
              <p>{address?.district}</p>
              <p>
                {address?.city}/{address?.state}
              </p>
              <p className="font-medium">{address?.zipCode}</p>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-xl border border-[#E4E4E4] p-5">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard size={14} />
              <h3 className="font-bold text-sm">Pagamento</h3>
            </div>
            <p className="text-sm text-[#5C5C5C]">{order.paymentMethod}</p>
            {order.mpPaymentId && (
              <p className="text-xs text-[#9C9C9C] mt-1">
                ID: {order.mpPaymentId}
              </p>
            )}
            <p className="text-xs text-[#9C9C9C] mt-1">
              {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
