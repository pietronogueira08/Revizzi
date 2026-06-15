'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/cart';
import { ShoppingCart, Zap, Minus, Plus } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  stock: number;
}

export default function AddToCartSection({ product }: { product: Product }) {
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({ ...product });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (product.stock === 0) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-[#DC2626] font-500">
          ⚠️ Produto sem estoque no momento.
        </p>
        <a
          href={`https://wa.me/5522999999999?text=Olá! Quero ser avisado quando o produto "${product.name}" estiver disponível.`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary w-full justify-center"
        >
          Avisar quando disponível
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Quantity */}
      <div className="flex items-center gap-4">
        <span className="label mb-0">Quantidade</span>
        <div className="flex items-center border border-[#E4E4E4] rounded-lg overflow-hidden">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 flex items-center justify-center hover:bg-[#F7F7F7] transition-colors"
          >
            <Minus size={14} />
          </button>
          <span className="w-12 text-center font-600 text-sm">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            className="w-10 h-10 flex items-center justify-center hover:bg-[#F7F7F7] transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleAddToCart}
          className={`btn-primary flex-1 justify-center ${added ? 'opacity-80' : ''}`}
        >
          <ShoppingCart size={16} />
          {added ? '✓ Adicionado!' : 'Adicionar ao carrinho'}
        </button>
        <Link
          href="/checkout"
          onClick={handleAddToCart}
          className="btn-secondary flex-1 justify-center text-center text-sm"
        >
          <Zap size={16} />
          Comprar agora
        </Link>
      </div>
    </div>
  );
}
