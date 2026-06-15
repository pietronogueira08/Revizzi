'use client';

import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';

interface Category {
  name: string;
  slug: string;
  count: number;
}

interface FilterSidebarProps {
  categories: Category[];
  currentParams: Record<string, string | undefined>;
}

export default function FilterSidebar({ categories, currentParams }: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [minPrice, setMinPrice] = useState(currentParams.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(currentParams.maxPrice || '');

  const applyFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams();
    Object.entries(currentParams).forEach(([k, v]) => {
      if (v && k !== key && k !== 'page') params.set(k, v);
    });
    if (value) params.set(key, value);
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAll = () => {
    router.push(pathname);
    setMinPrice('');
    setMaxPrice('');
  };

  const hasFilters = Object.values(currentParams).some(Boolean);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-700 text-[#0A0A0A]">
          <SlidersHorizontal size={16} />
          Filtros
        </div>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-[#DC2626] hover:underline flex items-center gap-1"
          >
            <X size={12} /> Limpar
          </button>
        )}
      </div>

      {/* Categories */}
      <div>
        <h3 className="label mb-3">Categorias</h3>
        <div className="space-y-1">
          <button
            onClick={() => applyFilter('category', null)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between ${
              !currentParams.category
                ? 'bg-[#9333EA] text-white font-600'
                : 'text-[#5C5C5C] hover:bg-[#F7F7F7] hover:text-[#0A0A0A]'
            }`}
          >
            <span>Todas</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => applyFilter('category', cat.slug)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between ${
                currentParams.category === cat.slug
                  ? 'bg-[#9333EA] text-white font-600'
                  : 'text-[#5C5C5C] hover:bg-[#F7F7F7] hover:text-[#0A0A0A]'
              }`}
            >
              <span>{cat.name}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                currentParams.category === cat.slug
                  ? 'bg-white/20 text-white'
                  : 'bg-[#F0F0F0] text-[#9C9C9C]'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <h3 className="label mb-3">Faixa de Preço</h3>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <input
              type="number"
              placeholder="Mín"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="input h-9 text-sm"
            />
          </div>
          <span className="text-[#9C9C9C] text-sm">—</span>
          <div className="flex-1">
            <input
              type="number"
              placeholder="Máx"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="input h-9 text-sm"
            />
          </div>
        </div>
        <button
          onClick={() => {
            if (minPrice || maxPrice) {
              const params = new URLSearchParams();
              Object.entries(currentParams).forEach(([k, v]) => {
                if (v && k !== 'minPrice' && k !== 'maxPrice' && k !== 'page')
                  params.set(k, v);
              });
              if (minPrice) params.set('minPrice', minPrice);
              if (maxPrice) params.set('maxPrice', maxPrice);
              router.push(`${pathname}?${params.toString()}`);
            }
          }}
          className="btn-primary w-full justify-center text-xs h-9 mt-2"
        >
          Aplicar
        </button>
      </div>

      {/* In stock only */}
      <div>
        <h3 className="label mb-3">Disponibilidade</h3>
        <label className="flex items-center gap-2.5 cursor-pointer">
          <div
            onClick={() => applyFilter('inStock', currentParams.inStock === 'true' ? null : 'true')}
            className={`w-10 h-5 rounded-full transition-all relative ${
              currentParams.inStock === 'true' ? 'bg-[#9333EA]' : 'bg-[#E4E4E4]'
            }`}
          >
            <div
              className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${
                currentParams.inStock === 'true' ? 'left-5.5 translate-x-0.5' : 'left-0.5'
              }`}
            />
          </div>
          <span className="text-sm text-[#5C5C5C]">Apenas em estoque</span>
        </label>
      </div>
    </div>
  );
}
