'use client';
import Link from 'next/link';
import { Edit, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Props {
  productId: string;
  isActive: boolean;
}

export default function ProductActions({ productId, isActive }: Props) {
  const router = useRouter();

  const toggleActive = async () => {
    await fetch(`/api/products/${productId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !isActive }),
    });
    router.refresh();
  };

  const deleteProduct = async () => {
    if (!confirm('Desativar este produto?')) return;
    await fetch(`/api/products/${productId}`, { method: 'DELETE' });
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/admin/produtos/${productId}/editar`}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E4E4E4] hover:bg-[#F7F7F7] transition-colors"
        title="Editar"
      >
        <Edit size={14} />
      </Link>
      <button
        onClick={toggleActive}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E4E4E4] hover:bg-[#F7F7F7] transition-colors"
        title={isActive ? 'Desativar' : 'Ativar'}
      >
        {isActive ? (
          <ToggleRight size={14} className="text-green-600" />
        ) : (
          <ToggleLeft size={14} className="text-[#9C9C9C]" />
        )}
      </button>
      <button
        onClick={deleteProduct}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E4E4E4] hover:bg-red-50 hover:border-red-200 transition-colors"
        title="Excluir"
      >
        <Trash2 size={14} className="text-[#DC2626]" />
      </button>
    </div>
  );
}
