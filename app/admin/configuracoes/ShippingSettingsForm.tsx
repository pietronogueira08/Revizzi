'use client';
import { useState } from 'react';
import { Save, Loader2, Truck } from 'lucide-react';

interface Props {
  currentFreeFrom: number;
  currentFlatRate: number;
  settingsId?: string;
}

export default function ShippingSettingsForm({
  currentFreeFrom,
  currentFlatRate,
  settingsId,
}: Props) {
  const [freeFrom, setFreeFrom] = useState(currentFreeFrom);
  const [flatRate, setFlatRate] = useState(currentFlatRate);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      const method = settingsId ? 'PATCH' : 'POST';
      const url = settingsId ? `/api/shipping/${settingsId}` : '/api/shipping';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ freeShippingFrom: freeFrom, flatRate }),
      });
      if (!res.ok) {
        setError('Erro ao salvar configurações');
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#E4E4E4] p-6">
      <div className="flex items-center gap-2 mb-6">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: '#9333EA15', border: '1.5px solid #9333EA30' }}
        >
          <Truck size={16} style={{ color: '#9333EA' }} strokeWidth={1.5} />
        </div>
        <h2 className="font-bold text-[#0A0A0A]">Configurações de Frete</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="label">
            Frete grátis a partir de (R$)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={freeFrom}
            onChange={(e) => setFreeFrom(parseFloat(e.target.value) || 0)}
            className="input"
            placeholder="199.00"
          />
          <p className="text-xs text-[#9C9C9C] mt-1">
            Pedidos acima deste valor terão frete grátis
          </p>
        </div>

        <div>
          <label className="label">Tarifa fixa de frete (R$)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={flatRate}
            onChange={(e) => setFlatRate(parseFloat(e.target.value) || 0)}
            className="input"
            placeholder="25.00"
          />
          <p className="text-xs text-[#9C9C9C] mt-1">
            Valor cobrado quando o pedido não atingir o mínimo para frete grátis
          </p>
        </div>

        {/* Preview */}
        <div className="bg-[#F7F7F7] rounded-lg p-4 text-sm space-y-1">
          <p className="font-medium text-[#0A0A0A] mb-2">Prévia</p>
          <p className="text-[#5C5C5C]">
            • Pedidos abaixo de{' '}
            <strong>
              R${' '}
              {freeFrom.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
              })}
            </strong>
            : frete de{' '}
            <strong>
              R${' '}
              {flatRate.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
              })}
            </strong>
          </p>
          <p className="text-[#5C5C5C]">
            • Pedidos acima de{' '}
            <strong>
              R${' '}
              {freeFrom.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
              })}
            </strong>
            : <strong className="text-green-600">frete grátis</strong>
          </p>
        </div>

        {error && <p className="text-xs text-[#DC2626]">{error}</p>}

        <button
          onClick={handleSave}
          disabled={loading}
          className="btn-primary w-full justify-center"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {saved ? '✓ Configurações Salvas!' : 'Salvar Configurações'}
        </button>
      </div>
    </div>
  );
}
