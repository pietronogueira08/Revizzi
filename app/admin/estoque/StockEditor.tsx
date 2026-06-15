'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2 } from 'lucide-react';

interface Props {
  productId: string;
  currentStock: number;
}

export default function StockEditor({ productId, currentStock }: Props) {
  const [stock, setStock] = useState(currentStock);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    setLoading(true);
    try {
      await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        value={stock}
        min={0}
        onChange={(e) => setStock(parseInt(e.target.value) || 0)}
        className="input h-8 w-20 text-sm text-center"
      />
      <button
        onClick={handleSave}
        disabled={loading || stock === currentStock}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E4E4E4] hover:bg-[#F7F7F7] transition-colors disabled:opacity-40"
        title="Salvar estoque"
      >
        {loading ? (
          <Loader2 size={13} className="animate-spin" />
        ) : (
          <Save size={13} className={saved ? 'text-green-600' : ''} />
        )}
      </button>
    </div>
  );
}
