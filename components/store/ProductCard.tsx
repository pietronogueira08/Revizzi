'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Star } from 'lucide-react';
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
    <Link href={`/produtos/${slug}`} className="product-card reveal">
      {/* Image container */}
      <div className="product-card__image-wrap">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="product-card__image"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <ShoppingCart size={40} className="text-[var(--text-muted)]" />
          </div>
        )}

        {/* Badges */}
        {isFeatured && !discount && (
          <div className="product-card__badge">
            <span className="flex items-center gap-1">
              <Star size={10} fill="currentColor" /> Destaque
            </span>
          </div>
        )}
        {discount && (
          <div className="product-card__badge product-card__badge--sale">
            -{discount}%
          </div>
        )}

        {/* Action Overlay */}
        <div className="product-card__overlay">
          <button
            onClick={handleAddToCart}
            disabled={stock === 0}
            className="product-card__add-btn"
          >
            <ShoppingCart size={14} strokeWidth={2.5} />
            {stock === 0 ? 'Esgotado' : 'Adicionar'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="product-card__body">
        {category && (
          <div className="product-card__category">
            {category.name}
          </div>
        )}

        <div className="product-card__name">
          {name}
        </div>

        {/* Price */}
        <div className="product-card__prices">
          <span className="product-card__price">{formatPrice(price)}</span>
          {comparePrice && comparePrice > price && (
            <span className="product-card__price-original">{formatPrice(comparePrice)}</span>
          )}
        </div>

        {/* Stock badge */}
        <div className={`product-card__stock ${stockVariant === 'success' ? '' : stockVariant}`}>
          {stockLbl}
        </div>
      </div>
    </Link>
  );
}
