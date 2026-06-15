'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cart';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutPersonalSchema, checkoutAddressSchema } from '@/lib/validations';
import { formatPrice, formatCEP } from '@/lib/utils';
import Image from 'next/image';
import { ChevronRight, Check, Loader2, MapPin } from 'lucide-react';
import type { CheckoutPersonalInput, CheckoutAddressInput } from '@/lib/validations';

const STEPS = ['Dados pessoais', 'Endereço', 'Pagamento'];

export default function CheckoutPage() {
  const { items, getSubtotal, getDiscount, coupon, clearCart } = useCartStore();
  const [step, setStep] = useState(0);
  const [personalData, setPersonalData] = useState<CheckoutPersonalInput | null>(null);
  const [addressData, setAddressData] = useState<CheckoutAddressInput | null>(null);
  const [shippingCost, setShippingCost] = useState(0);
  const [loadingCEP, setLoadingCEP] = useState(false);
  const [processing, setProcessing] = useState(false);

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const total = subtotal - discount + shippingCost;

  const personalForm = useForm<CheckoutPersonalInput>({
    resolver: zodResolver(checkoutPersonalSchema),
  });

  const addressForm = useForm<CheckoutAddressInput>({
    resolver: zodResolver(checkoutAddressSchema),
  });

  const handleCEPLookup = async (cep: string) => {
    const clean = cep.replace(/\D/g, '');
    if (clean.length !== 8) return;
    setLoadingCEP(true);
    try {
      const res = await fetch(`/api/cep/${clean}`);
      if (res.ok) {
        const data = await res.json();
        addressForm.setValue('street', data.logradouro || '');
        addressForm.setValue('district', data.bairro || '');
        addressForm.setValue('city', data.localidade || '');
        addressForm.setValue('state', data.uf || '');
      }
    } finally {
      setLoadingCEP(false);
    }
  };

  const handleCheckoutSubmit = async () => {
    if (!personalData || !addressData) return;
    setProcessing(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: personalData,
          address: addressData,
          items: items.map((i) => ({
            productId: i.id,
            name: i.name,
            quantity: i.quantity,
            unitPrice: i.price,
          })),
          subtotal,
          shippingCost,
          discount,
          total,
          couponCode: coupon?.code,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Erro ao criar pedido');
        return;
      }

      // Redirect to Mercado Pago
      if (data.checkoutUrl) {
        clearCart();
        window.location.href = data.checkoutUrl;
      }
    } catch {
      alert('Erro de conexão. Tente novamente.');
    } finally {
      setProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="section-inner py-16 text-center">
        <h1 className="text-2xl font-700 mb-4">Carrinho vazio</h1>
        <p className="text-[#9C9C9C] mb-6">Adicione produtos antes de finalizar a compra.</p>
        <a href="/produtos" className="btn-primary px-6 py-3">Ver produtos</a>
      </div>
    );
  }

  return (
    <div className="section-inner py-8">
      <h1 className="text-2xl font-700 mb-8">Finalizar Compra</h1>

      {/* Progress */}
      <div className="flex items-center gap-0 mb-10">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-700 transition-all ${
                  i < step
                    ? 'text-white'
                    : i === step
                    ? 'text-white'
                    : 'bg-[#F0F0F0] text-[#9C9C9C]'
                }`}
                style={i <= step ? { background: 'linear-gradient(135deg, #9333EA, #D97706)' } : {}}
              >
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              <span
                className={`text-sm font-500 hidden sm:block ${
                  i === step ? 'text-[#0A0A0A]' : 'text-[#9C9C9C]'
                }`}
              >
                {s}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className="flex-1 h-0.5 mx-3"
                style={{
                  background: i < step
                    ? 'linear-gradient(to right, #9333EA, #D97706)'
                    : '#E4E4E4',
                }}
              />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          {/* Step 1: Personal data */}
          {step === 0 && (
            <form
              onSubmit={personalForm.handleSubmit((data) => {
                setPersonalData(data);
                setStep(1);
              })}
              className="space-y-4"
            >
              <h2 className="font-700 text-lg mb-4">Dados Pessoais</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Nome completo *</label>
                  <input {...personalForm.register('name')} className="input" placeholder="João Silva" />
                  {personalForm.formState.errors.name && (
                    <p className="text-xs text-[#DC2626] mt-1">{personalForm.formState.errors.name.message}</p>
                  )}
                </div>
                <div>
                  <label className="label">CPF *</label>
                  <input {...personalForm.register('cpf')} className="input" placeholder="000.000.000-00" />
                  {personalForm.formState.errors.cpf && (
                    <p className="text-xs text-[#DC2626] mt-1">{personalForm.formState.errors.cpf.message}</p>
                  )}
                </div>
                <div>
                  <label className="label">Email *</label>
                  <input {...personalForm.register('email')} type="email" className="input" placeholder="joao@email.com" />
                  {personalForm.formState.errors.email && (
                    <p className="text-xs text-[#DC2626] mt-1">{personalForm.formState.errors.email.message}</p>
                  )}
                </div>
                <div>
                  <label className="label">Telefone / WhatsApp *</label>
                  <input {...personalForm.register('phone')} className="input" placeholder="(22) 99999-9999" />
                  {personalForm.formState.errors.phone && (
                    <p className="text-xs text-[#DC2626] mt-1">{personalForm.formState.errors.phone.message}</p>
                  )}
                </div>
              </div>
              <button type="submit" className="btn-primary mt-2">
                Continuar <ChevronRight size={16} />
              </button>
            </form>
          )}

          {/* Step 2: Address */}
          {step === 1 && (
            <form
              onSubmit={addressForm.handleSubmit((data) => {
                setAddressData(data);
                // Calculate shipping
                const free = subtotal - discount >= 199;
                setShippingCost(free ? 0 : 25);
                setStep(2);
              })}
              className="space-y-4"
            >
              <h2 className="font-700 text-lg mb-4">Endereço de Entrega</h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1">
                  <label className="label flex items-center gap-1.5">
                    CEP *
                    {loadingCEP && <Loader2 size={12} className="animate-spin text-[#9333EA]" />}
                  </label>
                  <input
                    {...addressForm.register('zipCode')}
                    className="input"
                    placeholder="00000-000"
                    onBlur={(e) => handleCEPLookup(e.target.value)}
                    onChange={(e) => {
                      const formatted = formatCEP(e.target.value);
                      e.target.value = formatted;
                      addressForm.setValue('zipCode', formatted);
                    }}
                  />
                  {addressForm.formState.errors.zipCode && (
                    <p className="text-xs text-[#DC2626] mt-1">{addressForm.formState.errors.zipCode.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-3">
                  <label className="label">Rua *</label>
                  <input {...addressForm.register('street')} className="input" placeholder="Nome da rua" />
                </div>
                <div>
                  <label className="label">Número *</label>
                  <input {...addressForm.register('number')} className="input" placeholder="123" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Complemento</label>
                  <input {...addressForm.register('complement')} className="input" placeholder="Apto, bloco, etc." />
                </div>
                <div>
                  <label className="label">Bairro *</label>
                  <input {...addressForm.register('district')} className="input" />
                </div>
                <div>
                  <label className="label">Cidade *</label>
                  <input {...addressForm.register('city')} className="input" />
                </div>
                <div>
                  <label className="label">Estado *</label>
                  <input {...addressForm.register('state')} className="input" placeholder="RJ" maxLength={2} />
                </div>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(0)} className="btn-secondary">
                  Voltar
                </button>
                <button type="submit" className="btn-primary">
                  Continuar <ChevronRight size={16} />
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Payment */}
          {step === 2 && (
            <div>
              <h2 className="font-700 text-lg mb-4">Pagamento</h2>
              <div className="bg-[#F7F7F7] rounded-xl p-6 text-center border border-dashed border-[#E4E4E4] mb-6">
                <div className="w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #009EE3, #00B1D2)' }}>
                  <span className="text-white font-700 text-sm">MP</span>
                </div>
                <h3 className="font-700 text-[#0A0A0A] mb-1">Mercado Pago</h3>
                <p className="text-sm text-[#5C5C5C] mb-1">
                  Pague com PIX, cartão de crédito ou boleto
                </p>
                <p className="text-xs text-[#9C9C9C]">
                  Você será redirecionado para o ambiente seguro do Mercado Pago
                </p>
              </div>

              {/* Review summary */}
              <div className="bg-[#F7F7F7] rounded-xl p-4 mb-6 text-sm space-y-2">
                <div className="flex items-center gap-2 text-[#5C5C5C]">
                  <MapPin size={13} className="text-[#9333EA]" />
                  <span>
                    {addressData?.street}, {addressData?.number}
                    {addressData?.complement ? `, ${addressData.complement}` : ''} —{' '}
                    {addressData?.city}/{addressData?.state}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary">
                  Voltar
                </button>
                <button
                  onClick={handleCheckoutSubmit}
                  disabled={processing}
                  className="btn-primary flex-1 justify-center"
                >
                  {processing ? (
                    <><Loader2 size={16} className="animate-spin" /> Processando...</>
                  ) : (
                    <>Ir para o pagamento — {formatPrice(total)}</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary (sticky) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-2xl border border-[#E4E4E4] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E4E4E4]">
              <h3 className="font-700">Resumo do Pedido</h3>
            </div>
            <div className="px-5 py-4 space-y-3 max-h-72 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#F7F7F7] flex-shrink-0">
                    {item.image && (
                      <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-500 text-[#0A0A0A] line-clamp-2">{item.name}</p>
                    <p className="text-xs text-[#9C9C9C]">x{item.quantity}</p>
                  </div>
                  <p className="text-xs font-700 flex-shrink-0">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 border-t border-[#E4E4E4] space-y-2 text-sm">
              <div className="flex justify-between text-[#5C5C5C]">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Desconto ({coupon?.code})</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#5C5C5C]">
                <span>Frete</span>
                <span>{step >= 2 ? (shippingCost === 0 ? 'Grátis 🎉' : formatPrice(shippingCost)) : 'Calculado no próximo passo'}</span>
              </div>
              <div className="flex justify-between font-700 text-base text-[#0A0A0A] pt-2 border-t border-[#E4E4E4]">
                <span>Total</span>
                <span>{formatPrice(step >= 2 ? total : subtotal - discount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
