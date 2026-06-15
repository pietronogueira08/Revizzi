'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Check, ShieldCheck, Truck, ArrowRight, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/lib/utils';
import ProductCard from '@/components/store/ProductCard';

interface ProductPageClientProps {
  product: any;
  relatedProducts: any[];
}

export default function ProductPageClient({ product, relatedProducts }: ProductPageClientProps) {
  const container = useRef<HTMLDivElement>(null);
  const { addItem } = useCartStore();
  const [added, setAdded] = useState(false);
  const image = product.images?.[0] || '';

  useGSAP(() => {
    const tl = gsap.timeline();
    
    // Animate image gallery
    tl.fromTo('.product-gallery', 
      { opacity: 0, x: -30 }, 
      { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }
    );

    // Stagger text details
    tl.fromTo('.product-detail-item',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' },
      '-=0.6'
    );

  }, { scope: container });

  const handleAddToCart = () => {
    if (product.stock === 0) return;
    addItem({ 
      id: product.id, 
      name: product.name, 
      slug: product.slug, 
      price: Number(product.price), 
      image, 
      stock: product.stock 
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div ref={container} className="bg-white min-h-screen pb-20">
      {/* Breadcrumbs */}
      <div className="border-b border-[#E4E4E7] bg-[#F4F4F5]">
        <div className="section-inner py-4 flex items-center gap-2 text-xs font-500 text-[#52525B] uppercase tracking-wider">
          <Link href="/" className="hover:text-[#09090B] transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link href={`/categoria/${product.category?.slug}`} className="hover:text-[#09090B] transition-colors">
            {product.category?.name || 'Produtos'}
          </Link>
          <ChevronRight size={14} />
          <span className="text-[#09090B] truncate">{product.name}</span>
        </div>
      </div>

      <div className="section-inner pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Gallery */}
          <div className="product-gallery">
            <div className="relative aspect-square bg-[#F4F4F5] border border-[#E4E4E7] overflow-hidden">
              {image ? (
                <Image
                  src={image}
                  alt={product.name}
                  fill
                  className="object-contain p-10"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-[#D4D4D8]">
                  Sem imagem
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <div className="product-detail-item mb-2">
              <span className="inline-block px-3 py-1 bg-[#050505] text-white text-[10px] font-700 tracking-wider uppercase mb-4">
                {product.category?.name}
              </span>
            </div>
            
            <h1 className="product-detail-item text-3xl lg:text-4xl font-700 text-[#09090B] mb-4 tracking-tight leading-tight">
              {product.name}
            </h1>
            
            <div className="product-detail-item flex items-center gap-4 mb-6 pb-6 border-b border-[#E4E4E7]">
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-[#A1A1AA] text-lg line-through">
                  {formatPrice(Number(product.comparePrice))}
                </span>
              )}
              <span className="text-3xl font-700 text-[#E60000]">
                {formatPrice(Number(product.price))}
              </span>
            </div>

            <p className="product-detail-item text-[#52525B] text-base leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="product-detail-item grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-[#F4F4F5] border border-[#E4E4E7]">
                <Truck size={24} className="text-[#09090B]" strokeWidth={1.5} />
                <div>
                  <p className="text-xs font-700 text-[#09090B] uppercase">Pronta Entrega</p>
                  <p className="text-[10px] text-[#52525B] uppercase">Envio em 24h</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-[#F4F4F5] border border-[#E4E4E7]">
                <ShieldCheck size={24} className="text-[#09090B]" strokeWidth={1.5} />
                <div>
                  <p className="text-xs font-700 text-[#09090B] uppercase">Garantia</p>
                  <p className="text-[10px] text-[#52525B] uppercase">100% Original</p>
                </div>
              </div>
            </div>

            <div className="product-detail-item mt-auto">
              {product.stock > 0 ? (
                <button
                  onClick={handleAddToCart}
                  disabled={added}
                  className={`w-full py-4 px-8 text-sm font-700 uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 ${
                    added 
                      ? 'bg-[#16A34A] text-white border border-[#16A34A]' 
                      : 'bg-[#E60000] text-white border border-[#E60000] hover:bg-[#C40000] hover:border-[#C40000] hover:shadow-[0_0_20px_rgba(230,0,0,0.3)]'
                  }`}
                >
                  {added ? (
                    <>
                      <Check size={20} strokeWidth={2.5} /> Adicionado ao Carrinho
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={20} strokeWidth={2} /> Adicionar ao Carrinho
                    </>
                  )}
                </button>
              ) : (
                <button disabled className="w-full py-4 px-8 bg-[#E4E4E7] text-[#A1A1AA] text-sm font-700 uppercase tracking-widest cursor-not-allowed border border-[#D4D4D8]">
                  Esgotado
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-32 pt-16 border-t border-[#E4E4E7] bg-[#F4F4F5]">
          <div className="section-inner">
            <div className="flex items-center justify-between mb-10">
              <div>
                <div className="gradient-divider mb-4" />
                <h2 className="section-title">Produtos Relacionados</h2>
              </div>
              <Link href="/produtos" className="flex items-center gap-2 text-sm text-[#09090B] font-600 hover:text-[#E60000] transition-colors uppercase tracking-wider">
                Ver Mais <ArrowRight size={16} />
              </Link>
            </div>
            <div className="product-grid">
              {relatedProducts.map((relProduct) => (
                <ProductCard
                  key={relProduct.id}
                  id={relProduct.id}
                  name={relProduct.name}
                  slug={relProduct.slug}
                  price={Number(relProduct.price)}
                  comparePrice={relProduct.comparePrice ? Number(relProduct.comparePrice) : null}
                  images={relProduct.images}
                  stock={relProduct.stock}
                  category={relProduct.category}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
