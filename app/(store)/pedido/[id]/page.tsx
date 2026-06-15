import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Check, X, Clock, Package, ChevronRight } from 'lucide-react';
import { formatPrice, formatDate, orderStatusLabels } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Status do Pedido',
};

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string }>;
}

export default async function PedidoPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { status: urlStatus } = await searchParams;

  let order;
  try {
    order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: { select: { name: true, images: true, slug: true } },
          },
        },
        coupon: { select: { code: true } },
      },
    });
  } catch {
    order = null;
  }

  if (!order) notFound();

  const statusInfo = orderStatusLabels[order.status] || { label: order.status, color: '#9C9C9C' };
  const isSuccess = urlStatus === 'success' || order.status === 'PAID';
  const isPending = urlStatus === 'pending' || order.status === 'PENDING';
  const isFailed = urlStatus === 'failure' || order.status === 'CANCELLED';

  const address = order.shippingAddress as any;

  return (
    <div className="section-inner py-12 max-w-2xl mx-auto">
      {/* Status banner */}
      <div
        className="rounded-2xl p-8 text-center mb-8"
        style={{
          background: isSuccess
            ? 'linear-gradient(135deg, #dcfce7, #f0fdf4)'
            : isFailed
            ? 'linear-gradient(135deg, #fee2e2, #fff5f5)'
            : 'linear-gradient(135deg, #fef9c3, #fefce8)',
        }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{
            background: isSuccess ? '#16A34A' : isFailed ? '#DC2626' : '#D97706',
          }}
        >
          {isSuccess ? (
            <Check size={28} className="text-white" strokeWidth={3} />
          ) : isFailed ? (
            <X size={28} className="text-white" strokeWidth={3} />
          ) : (
            <Clock size={28} className="text-white" />
          )}
        </div>
        <h1 className="text-2xl font-700 mb-2">
          {isSuccess
            ? 'Pedido Confirmado! 🎉'
            : isFailed
            ? 'Pagamento não aprovado'
            : 'Aguardando pagamento'}
        </h1>
        <p className="text-[#5C5C5C] text-sm">
          {isSuccess
            ? 'Seu pedido foi recebido e está sendo processado. Você receberá um email de confirmação em breve.'
            : isFailed
            ? 'Houve um problema com o pagamento. Tente novamente ou use outro método.'
            : 'Seu pedido foi criado. Complete o pagamento para confirmar.'}
        </p>
      </div>

      {/* Order info */}
      <div className="bg-white rounded-2xl border border-[#E4E4E4] overflow-hidden mb-5">
        <div className="px-6 py-4 border-b border-[#E4E4E4] flex items-center justify-between">
          <div>
            <h2 className="font-700 text-[#0A0A0A]">
              Pedido #{id.slice(-8).toUpperCase()}
            </h2>
            <p className="text-xs text-[#9C9C9C] mt-0.5">{formatDate(order.createdAt)}</p>
          </div>
          <span
            className="badge"
            style={{ background: `${statusInfo.color}20`, color: statusInfo.color }}
          >
            {statusInfo.label}
          </span>
        </div>

        {/* Items */}
        <div className="divide-y divide-[#F0F0F0]">
          {order.items.map((item: any) => (
            <div key={item.id} className="flex items-center gap-4 px-6 py-4">
              <div className="flex-1">
                <p className="font-500 text-sm text-[#0A0A0A]">{item.product.name}</p>
                <p className="text-xs text-[#9C9C9C]">x{item.quantity} × {formatPrice(Number(item.unitPrice))}</p>
              </div>
              <p className="font-700 text-sm">{formatPrice(Number(item.total))}</p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="px-6 py-4 border-t border-[#E4E4E4] space-y-1.5 text-sm">
          <div className="flex justify-between text-[#5C5C5C]">
            <span>Subtotal</span>
            <span>{formatPrice(Number(order.subtotal))}</span>
          </div>
          {Number(order.discount) > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Desconto {order.coupon && `(${order.coupon.code})`}</span>
              <span>-{formatPrice(Number(order.discount))}</span>
            </div>
          )}
          <div className="flex justify-between text-[#5C5C5C]">
            <span>Frete</span>
            <span>{Number(order.shippingCost) === 0 ? 'Grátis' : formatPrice(Number(order.shippingCost))}</span>
          </div>
          <div className="flex justify-between font-700 text-base text-[#0A0A0A] pt-2 border-t border-[#E4E4E4]">
            <span>Total</span>
            <span>{formatPrice(Number(order.total))}</span>
          </div>
        </div>
      </div>

      {/* Shipping address */}
      {address && (
        <div className="bg-white rounded-2xl border border-[#E4E4E4] p-6 mb-6">
          <h3 className="font-700 text-[#0A0A0A] mb-3 flex items-center gap-2">
            <Package size={16} /> Endereço de Entrega
          </h3>
          <div className="text-sm text-[#5C5C5C] space-y-0.5">
            <p>{address.street}, {address.number}{address.complement ? `, ${address.complement}` : ''}</p>
            <p>{address.district} — {address.city}/{address.state}</p>
            <p>CEP: {address.zipCode}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/" className="btn-primary justify-center">
          Continuar comprando
        </Link>
        <Link href="/conta/pedidos" className="btn-secondary justify-center">
          Ver meus pedidos <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
}
