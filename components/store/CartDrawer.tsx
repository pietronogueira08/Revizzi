'use client';

import { useCartStore } from '@/store/cart';
import { X, ShoppingBag, Trash2, Plus, Minus, Tag, Truck, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { formatPrice } from '@/lib/utils';

const FREE_SHIPPING_THRESHOLD = 199;

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    getSubtotal,
    getDiscount,
    getItemCount,
    coupon,
    removeCoupon,
  } = useCartStore();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const shippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const missingForFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    try {
      const res = await fetch(`/api/coupons/validate?code=${couponCode.toUpperCase()}&subtotal=${subtotal}`);
      const data = await res.json();
      if (!res.ok) {
        setCouponError(data.error || 'Cupom inválido');
      } else {
        useCartStore.getState().applyCoupon(data);
        setCouponCode('');
      }
    } catch {
      setCouponError('Erro ao validar cupom');
    } finally {
      setCouponLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40 animate-fade-in"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E4E4E4]">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} />
            <h2 className="font-700 text-lg">Carrinho</h2>
            {getItemCount() > 0 && (
              <span className="badge badge-neutral">{getItemCount()} {getItemCount() === 1 ? 'item' : 'itens'}</span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F7F7F7] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Free shipping progress */}
        {subtotal > 0 && (
          <div className="px-5 py-3 bg-[#F7F7F7] border-b border-[#E4E4E4]">
            <div className="flex items-center justify-between text-xs text-[#5C5C5C] mb-2">
              <span className="flex items-center gap-1">
                <Truck size={12} />
                {missingForFreeShipping > 0
                  ? `Falta ${formatPrice(missingForFreeShipping)} para frete grátis`
                  : '🎉 Você ganhou frete grátis!'}
              </span>
              <span className="font-600 text-[#0A0A0A]">{Math.round(shippingProgress)}%</span>
            </div>
            <div className="h-1.5 bg-[#E4E4E4] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${shippingProgress}%`,
                  background: 'linear-gradient(to right, #9333EA, #D97706)',
                }}
              />
            </div>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16 gap-4">
              <div className="w-20 h-20 rounded-full bg-[#F7F7F7] flex items-center justify-center">
                <ShoppingBag size={32} className="text-[#9C9C9C]" />
              </div>
              <div>
                <p className="font-600 text-[#0A0A0A] mb-1">Carrinho vazio</p>
                <p className="text-sm text-[#9C9C9C]">Adicione produtos para continuar</p>
              </div>
              <button onClick={closeCart} className="btn-primary text-sm px-6 py-2.5">
                Explorar produtos
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 animate-slide-up">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#E4E4E4] flex-shrink-0 bg-[#F7F7F7]">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#9C9C9C]">
                      <ShoppingBag size={20} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/produtos/${item.slug}`}
                    onClick={closeCart}
                    className="text-sm font-500 text-[#0A0A0A] line-clamp-2 hover:text-[#9333EA] transition-colors"
                  >
                    {item.name}
                  </Link>
                  <p className="text-base font-700 text-[#0A0A0A] mt-1">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-[#E4E4E4] rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center hover:bg-[#F7F7F7] transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-sm font-600">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="w-7 h-7 flex items-center justify-center hover:bg-[#F7F7F7] transition-colors disabled:opacity-40"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-[#9C9C9C] hover:text-[#DC2626] transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#E4E4E4] px-5 py-4 space-y-3">
            {/* Coupon */}
            {coupon ? (
              <div className="flex items-center justify-between bg-green-50 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2 text-sm">
                  <Tag size={14} className="text-green-600" />
                  <span className="font-600 text-green-700">{coupon.code}</span>
                  <span className="text-green-600">-{formatPrice(discount)}</span>
                </div>
                <button onClick={removeCoupon} className="text-green-500 hover:text-green-700">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Código do cupom"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                  className="input flex-1 h-9 text-sm uppercase"
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={couponLoading || !couponCode}
                  className="btn-secondary h-9 px-4 text-sm disabled:opacity-50"
                >
                  {couponLoading ? '...' : 'Aplicar'}
                </button>
              </div>
            )}
            {couponError && <p className="text-xs text-[#DC2626]">{couponError}</p>}

            {/* Totals */}
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-[#5C5C5C]">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Desconto</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#5C5C5C]">
                <span>Frete</span>
                <span>{subtotal >= FREE_SHIPPING_THRESHOLD ? 'Grátis' : 'Calc. no checkout'}</span>
              </div>
              <div className="flex justify-between font-700 text-base text-[#0A0A0A] pt-2 border-t border-[#E4E4E4]">
                <span>Total</span>
                <span>{formatPrice(getSubtotal() - discount)}</span>
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-primary w-full justify-center text-sm"
            >
              Finalizar compra
              <ArrowRight size={16} />
            </Link>
            <button
              onClick={closeCart}
              className="w-full text-center text-sm text-[#9C9C9C] hover:text-[#0A0A0A] transition-colors py-1"
            >
              Continuar comprando
            </button>
          </div>
        )}
      </div>
    </>
  );
}
