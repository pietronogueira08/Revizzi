'use client';

import { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Car, Wrench, Shield, Zap, Package, Truck, Star, BadgeCheck, Timer, Settings, ArrowRight, ChevronRight, ShieldCheck } from 'lucide-react';
import HeroBanner from '@/components/store/HeroBanner';
import ProductCard from '@/components/store/ProductCard';

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const categories = [
  { name: 'Peças', slug: 'pecas', icon: Wrench },
  { name: 'Estética', slug: 'estetica', icon: Star },
  { name: 'Acessórios', slug: 'acessorios', icon: Package },
  { name: 'Ferramentas', slug: 'ferramentas', icon: Settings },
  { name: 'Pneus', slug: 'pneus', icon: Car },
  { name: 'Segurança', slug: 'seguranca', icon: Shield },
  { name: 'Performance', slug: 'performance', icon: Zap },
  { name: 'Entrega', slug: 'envios', icon: Truck },
];

const brands = [
  'Bosch', 'Monroe', 'NGK', 'Mahle', 'Cofap', 'Gates', '3M', 'Meguiar\'s', 'Vonixx'
];

interface HomePageClientProps {
  featuredProducts: any[];
  bestSellers: any[];
}

export default function HomePageClient({ featuredProducts, bestSellers }: HomePageClientProps) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Animate standard sections fading up
    const sections = gsap.utils.toArray('.animate-section');
    sections.forEach((sec: any) => {
      gsap.fromTo(sec, 
        { opacity: 0, y: 40 },
        {
          scrollTrigger: {
            trigger: sec,
            start: 'top 85%',
            toggleActions: 'play none none none', // Play once
          },
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
        }
      );
    });

    // Staggered animation for categories
    gsap.fromTo('.category-card',
      { opacity: 0, y: 30 },
      {
        scrollTrigger: {
          trigger: '.categories-grid',
          start: 'top 85%',
        },
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.05,
        ease: 'power2.out',
      }
    );

    // Staggered animation for trust badges
    gsap.fromTo('.trust-badge',
      { opacity: 0, scale: 0.9 },
      {
        scrollTrigger: {
          trigger: '.trust-badges-grid',
          start: 'top 85%',
        },
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.5)',
      }
    );

    // Parallax effect on the premium banner
    gsap.to('.premium-banner-bg', {
      scrollTrigger: {
        trigger: '.premium-banner',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
      y: 100,
      ease: 'none',
    });

  }, { scope: container });

  return (
    <div ref={container}>
      <HeroBanner />

      {/* Categories */}
      <section className="section bg-white border-b border-[#E4E4E7] animate-section">
        <div className="section-inner">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="gradient-divider mb-4" />
              <h2 className="section-title">Categorias</h2>
            </div>
            <Link href="/produtos" className="flex items-center gap-2 text-sm text-[#09090B] font-600 hover:text-[#E60000] transition-colors uppercase tracking-wider">
              Ver Catálogo <ChevronRight size={16} />
            </Link>
          </div>
          <div className="categories-grid grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categoria/${cat.slug}`}
                className="category-card group flex flex-col items-center gap-4 p-6 border border-[#E4E4E7] bg-white hover:border-[#09090B] transition-all"
              >
                <div className="w-14 h-14 rounded-none bg-[#F4F4F5] flex items-center justify-center transition-transform group-hover:bg-[#09090B] group-hover:text-white text-[#52525B]">
                  <cat.icon size={24} strokeWidth={1.5} />
                </div>
                <span className="text-xs font-600 text-[#09090B] uppercase tracking-wider transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section bg-[#F4F4F5] animate-section">
        <div className="section-inner">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="gradient-divider mb-4" />
              <h2 className="section-title">Em Destaque</h2>
              <p className="text-[#52525B] mt-2">Seleção premium para o seu veículo</p>
            </div>
            <Link href="/produtos?featured=true" className="flex items-center gap-2 text-sm text-[#09090B] font-600 hover:text-[#E60000] transition-colors uppercase tracking-wider">
              Ver Todos <ChevronRight size={16} />
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="product-grid">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  price={Number(product.price)}
                  comparePrice={product.comparePrice ? Number(product.comparePrice) : null}
                  images={product.images}
                  stock={product.stock}
                  isFeatured={product.isFeatured}
                  category={product.category}
                />
              ))}
            </div>
          ) : (
            <EmptyProductsState />
          )}
        </div>
      </section>

      {/* Premium Banner */}
      <section className="premium-banner relative overflow-hidden bg-[#050505]">
        <div 
          className="premium-banner-bg absolute inset-0 opacity-20 -top-[100px] h-[calc(100%+200px)]" 
          style={{ backgroundImage: 'radial-gradient(#E60000 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
        />
        <div className="section-inner relative z-10 py-20 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="text-center md:text-left max-w-lg">
            <h2 className="text-3xl font-700 text-white mb-4 tracking-tight">
              Frete Grátis em Pedidos Acima de <span className="text-[#E60000]">R$ 199,00</span>
            </h2>
            <p className="text-[#A1A1AA] text-lg">Enviamos para todo o Brasil com máxima agilidade e segurança garantida.</p>
          </div>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <div className="text-center px-8 py-6 border border-[#27272A] bg-[#050505] shadow-2xl">
              <p className="text-white text-3xl font-700 mb-1">24h</p>
              <p className="text-[#A1A1AA] text-xs uppercase tracking-widest">Despacho</p>
            </div>
            <div className="text-center px-8 py-6 border border-[#27272A] bg-[#050505] shadow-2xl">
              <p className="text-white text-3xl font-700 mb-1">12x</p>
              <p className="text-[#A1A1AA] text-xs uppercase tracking-widest">Sem Juros*</p>
            </div>
            <div className="text-center px-8 py-6 border border-[#27272A] bg-[#050505] shadow-2xl">
              <p className="text-white text-3xl font-700 mb-1">PIX</p>
              <p className="text-[#A1A1AA] text-xs uppercase tracking-widest">Aprovação</p>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="section bg-white border-b border-[#E4E4E7] animate-section">
          <div className="section-inner">
            <div className="flex items-center justify-between mb-10">
              <div>
                <div className="gradient-divider mb-4" />
                <h2 className="section-title">Mais Vendidos</h2>
              </div>
              <Link href="/produtos?sort=popular" className="flex items-center gap-2 text-sm text-[#09090B] font-600 hover:text-[#E60000] transition-colors uppercase tracking-wider">
                Explorar <ChevronRight size={16} />
              </Link>
            </div>
            <div className="product-grid">
              {bestSellers.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  price={Number(product.price)}
                  comparePrice={product.comparePrice ? Number(product.comparePrice) : null}
                  images={product.images}
                  stock={product.stock}
                  category={product.category}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trust badges */}
      <section className="section bg-[#F4F4F5] animate-section">
        <div className="section-inner">
          <div className="text-center mb-16">
            <div className="gradient-divider mb-4 mx-auto" />
            <h2 className="section-title">A Diferença Revizzi</h2>
          </div>
          <div className="trust-badges-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: 'Qualidade Garantida',
                desc: 'Produtos originais com garantia de fábrica.',
              },
              {
                icon: Truck,
                title: 'Logística Ágil',
                desc: 'Pedidos despachados em até 24 horas úteis.',
              },
              {
                icon: BadgeCheck,
                title: 'Compra Segura',
                desc: 'Pagamento processado com criptografia militar.',
              },
              {
                icon: Timer,
                title: 'Atendimento Especializado',
                desc: 'Suporte técnico via WhatsApp em até 2h.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="trust-badge bg-white p-8 border border-[#E4E4E7] hover:border-[#09090B] transition-colors"
              >
                <item.icon size={32} strokeWidth={1.5} className="text-[#09090B] mb-6" />
                <h3 className="font-600 text-[#09090B] mb-3 text-lg">{item.title}</h3>
                <p className="text-sm text-[#52525B] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="py-12 bg-white animate-section">
        <div className="section-inner">
          <p className="text-center text-xs font-600 uppercase tracking-widest text-[#A1A1AA] mb-8">
            Marcas Parceiras
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10">
            {brands.map((brand) => (
              <div key={brand} className="text-xl font-700 text-[#E4E4E7] hover:text-[#09090B] transition-colors cursor-pointer">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function EmptyProductsState() {
  return (
    <div className="text-center py-20 bg-white border border-dashed border-[#D4D4D8]">
      <Package size={48} strokeWidth={1} className="mx-auto text-[#D4D4D8] mb-6" />
      <h3 className="font-600 text-[#09090B] text-xl mb-2">Catálogo Vazio</h3>
      <p className="text-[#52525B] mb-8 max-w-sm mx-auto">
        Configure o banco de dados e adicione produtos para visualizá-los aqui.
      </p>
      <Link href="/admin/produtos/novo" className="btn-primary">
        Adicionar Primeiro Produto
      </Link>
    </div>
  );
}
