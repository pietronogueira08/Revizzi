'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Loader2 } from 'lucide-react';

export default function CouponCreateForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: (fd.get('code') as string).toUpperCase(),
          type: fd.get('type'),
          value: parseFloat(fd.get('value') as string),
          minOrderValue: fd.get('minOrderValue')
            ? parseFloat(fd.get('minOrderValue') as string)
            : null,
          usageLimit: fd.get('usageLimit')
            ? parseInt(fd.get('usageLimit') as string)
            : null,
          expiresAt: fd.get('expiresAt') || null,
          isActive: true,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || 'Erro ao criar cupão');
        return;
      }
      (e.target as HTMLFormElement).reset();
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#E4E4E4] p-5">
      <h2 className="font-bold mb-4">Criar Cupão</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="label">Código *</label>
          <input
            name="code"
            required
            className="input uppercase"
            placeholder="VERAO20"
          />
        </div>
        <div>
          <label className="label">Tipo *</label>
          <select name="type" required className="input">
            <option value="PERCENTAGE">Porcentagem (%)</option>
            <option value="FIXED">Valor fixo (R$)</option>
          </select>
        </div>
        <div>
          <label className="label">Valor *</label>
          <input
            name="value"
            type="number"
            step="0.01"
            min="0"
            required
            className="input"
            placeholder="20"
          />
        </div>
        <div>
          <label className="label">Pedido mínimo</label>
          <input
            name="minOrderValue"
            type="number"
            step="0.01"
            className="input"
            placeholder="100"
          />
        </div>
        <div>
          <label className="label">Limite de usos</label>
          <input
            name="usageLimit"
            type="number"
            className="input"
            placeholder="Ilimitado"
          />
        </div>
        <div>
          <label className="label">Validade</label>
          <input name="expiresAt" type="date" className="input" />
        </div>
        {error && <p className="text-xs text-[#DC2626]">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center"
        >
          {loading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Plus size={14} />
          )}
          Criar Cupão
        </button>
      </form>
    </div>
  );
}
