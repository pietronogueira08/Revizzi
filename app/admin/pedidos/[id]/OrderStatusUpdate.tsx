'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save } from 'lucide-react';
import { orderStatusLabels } from '@/lib/utils';

const STATUS_OPTIONS = [
  'PENDING',
  'PAID',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
  'REFUNDED',
];

interface Props {
  orderId: string;
  currentStatus: string;
  currentTracking: string;
}

export default function OrderStatusUpdate({
  orderId,
  currentStatus,
  currentTracking,
}: Props) {
  const [status, setStatus] = useState(currentStatus);
  const [tracking, setTracking] = useState(currentTracking);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    setLoading(true);
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, trackingCode: tracking }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#E4E4E4] p-5">
      <h2 className="font-bold mb-4">Atualizar Pedido</h2>
      <div className="space-y-3">
        <div>
          <label className="label">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="input"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {orderStatusLabels[s]?.label || s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Código de Rastreamento</label>
          <input
            value={tracking}
            onChange={(e) => setTracking(e.target.value)}
            className="input"
            placeholder="Ex: BR123456789BR"
          />
        </div>
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
          {saved ? '✓ Salvo!' : 'Salvar Alterações'}
        </button>
      </div>
    </div>
  );
}
