'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Eye, Star } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { formatPrice, discountPercent, stockLabel } from '@/lib/utils';

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number | null;
  images: string[];
  stock: number;
  isFeatured?: boolean;
  category?: { name: string; slug: string };
}

export default function ProductCard({
  id,
  name,
  slug,
  price,
  comparePrice,
  images,
  stock,
  isFeatured,
  category,
}: ProductCardProps) {
  const { addItem } = useCartStore();
  const discount = discountPercent(price, comparePrice);
  const { label: stockLbl, variant: stockVariant } = stockLabel(stock);
  const image = images?.[0] || '';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (stock === 0) return;
    addItem({ id, name, slug, price, image, stock });
  };

  return (
    <Link href={`/produtos/${slug}`} className="product-card group">
      {/* Image container */}
      <div className="relative aspect-square bg-[#F4F4F5] overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <ShoppingCart size={40} className="text-[#D4D4D8]" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {isFeatured && (
            <span className="badge bg-[#050505] text-white">
              <Star size={10} fill="white" /> Destaque
            </span>
          )}
          {discount && (
            <span className="badge bg-[#E60000] text-white">
              -{discount}%
            </span>
          )}
        </div>

        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-[#050505]/0 group-hover:bg-[#050505]/5 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <span className="flex items-center gap-1.5 bg-white text-[#09090B] px-4 py-2 rounded-sm text-xs font-600 shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <Eye size={14} /> Detalhes
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {category && (
          <p className="text-[10px] font-600 text-[#A1A1AA] uppercase tracking-wider mb-2">
            {category.name}
          </p>
        )}

        <h3 className="text-sm font-600 text-[#09090B] line-clamp-2 leading-snug mb-3 group-hover:text-[#E60000] transition-colors">
          {name}
        </h3>

        {/* Price */}
        <div className="mb-4">
          {comparePrice && comparePrice > price && (
            <p className="price-compare mb-0.5">{formatPrice(comparePrice)}</p>
          )}
          <p className="price-current text-xl">{formatPrice(price)}</p>
          <p className="text-[11px] text-[#A1A1AA] mt-1 uppercase tracking-wider">
            em 12x de {formatPrice(price / 12)}
          </p>
        </div>

        {/* Stock badge */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span
            className={`badge ${
              stockVariant === 'success'
                ? 'bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20'
                : stockVariant === 'warning'
                ? 'bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20'
                : 'bg-[#E60000]/10 text-[#E60000] border border-[#E60000]/20'
            }`}
          >
            {stockLbl}
          </span>
        </div>

        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          disabled={stock === 0}
          className="btn-primary w-full justify-center text-xs py-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none"
        >
          <ShoppingCart size={16} strokeWidth={2} />
          {stock === 0 ? 'Sem estoque' : 'Adicionar ao Carrinho'}
        </button>
      </div>
    </Link>
  );
}
