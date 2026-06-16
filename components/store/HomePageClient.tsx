'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Droplets, Shield, Package, Truck, BadgeCheck, Timer, Settings, ChevronRight, ShieldCheck, Brush, Sun, Wind } from 'lucide-react';
import HeroBanner from '@/components/store/HeroBanner';
import ProductCard from '@/components/store/ProductCard';

const categories = [
  { name: 'Polimento', slug: 'polimento', icon: Sparkles },
  { name: 'Lavagem', slug: 'lavagem', icon: Droplets },
  { name: 'Proteção', slug: 'protecao', icon: Shield },
  { name: 'Vitrificação', slug: 'vitrificacao', icon: Sun },
  { name: 'Detalhamento', slug: 'detalhamento', icon: Brush },
  { name: 'Acessórios', slug: 'acessorios', icon: Package },
  { name: 'Ferramentas', slug: 'ferramentas', icon: Settings },
  { name: 'Ar & Cabine', slug: 'ar-cabine', icon: Wind },
];

const brands = [
  'Meguiar\'s', 'Vonixx', '3M', 'Sonax', 'Autoglym', 'Koch-Chemie', 'Turtle Wax', 'Wurth', 'Finishkare'
];

interface HomePageClientProps {
  featuredProducts: any[];
  bestSellers: any[];
}

export default function HomePageClient({ featuredProducts, bestSellers }: HomePageClientProps) {

  useEffect(() => {
    // Scroll Reveal Global Setup
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <HeroBanner />

      {/* Categories */}
      <section className="reveal">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Categorias</h2>
              <p className="section-subtitle">Escolha por tipo de serviço</p>
            </div>
            <Link href="/produtos" className="section-link">
              Ver Catálogo <ChevronRight size={14} />
            </Link>
          </div>
          <div className="categories-grid reveal reveal-stagger">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categoria/${cat.slug}`}
                className="category-card"
              >
                <cat.icon className="category-card__icon" strokeWidth={1.5} />
                <span className="category-card__name">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="reveal">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Em Destaque</h2>
              <p className="section-subtitle">Produtos premium de estética automotiva</p>
            </div>
            <Link href="/produtos?featured=true" className="section-link">
              Ver Todos <ChevronRight size={14} />
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="products-grid reveal reveal-stagger">
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

      {/* Premium Banner (Shipping) */}
      <section className="shipping-banner reveal">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="text-center md:text-left max-w-lg">
              <h2 className="font-['Bebas_Neue'] text-[clamp(2.5rem,4vw,3.5rem)] leading-none text-[var(--text-primary)] mb-4 uppercase tracking-wide">
                Frete Grátis acima de <span className="text-[var(--text-secondary)]">R$ 199</span>
              </h2>
              <p className="text-[var(--text-muted)] text-sm font-400">
                Enviamos para todo o Brasil com máxima agilidade e segurança garantida.
              </p>
            </div>
            <div className="flex items-stretch justify-center gap-8 md:gap-12">
              <div className="shipping-stat">
                <div className="shipping-stat__value">24h</div>
                <div className="shipping-stat__label">Despacho</div>
              </div>
              <div className="shipping-divider" />
              <div className="shipping-stat">
                <div className="shipping-stat__value">12x</div>
                <div className="shipping-stat__label">Sem Juros*</div>
              </div>
              <div className="shipping-divider" />
              <div className="shipping-stat">
                <div className="shipping-stat__value">PIX</div>
                <div className="shipping-stat__label">Aprovação</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="reveal">
          <div className="container">
            <div className="section-header">
              <div>
                <h2 className="section-title">Mais Vendidos</h2>
                <p className="section-subtitle">Os preferidos dos profissionais</p>
              </div>
              <Link href="/produtos?sort=popular" className="section-link">
                Explorar <ChevronRight size={14} />
              </Link>
            </div>
            <div className="products-grid reveal reveal-stagger">
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
      <section className="reveal">
        <div className="container">
          <div className="section-header justify-center text-center">
            <div>
              <h2 className="section-title justify-center after:hidden">A Diferença Revizzi</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 reveal reveal-stagger">
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
                desc: 'Pagamento processado com criptografia.',
              },
              {
                icon: Timer,
                title: 'Atendimento',
                desc: 'Suporte especializado via WhatsApp.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-[var(--bg-surface)] p-8 border border-[var(--border-subtle)] hover:border-[var(--border-hover)] transition-colors text-center"
              >
                <item.icon size={28} strokeWidth={1.5} className="text-[var(--text-muted)] mb-5 mx-auto" />
                <h3 className="font-600 text-[var(--text-primary)] mb-2 text-sm uppercase tracking-wide">{item.title}</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="pb-24 pt-12 reveal">
        <div className="container">
          <p className="text-center text-[10px] font-600 uppercase tracking-widest text-[var(--text-muted)] mb-8">
            Marcas Parceiras
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10">
            {brands.map((brand) => (
              <div key={brand} className="text-xl font-700 text-[var(--border-active)] hover:text-[var(--text-primary)] transition-colors cursor-pointer">
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
    <div className="text-center py-20 border border-[var(--border-default)]">
      <Package size={48} strokeWidth={1} className="mx-auto text-[var(--text-muted)] mb-6" />
      <h3 className="font-600 text-[var(--text-primary)] text-xl mb-2">Catálogo Vazio</h3>
      <p className="text-[var(--text-muted)] mb-8 max-w-sm mx-auto text-sm">
        Configure o banco de dados e adicione produtos para visualizá-los aqui.
      </p>
      <Link href="/admin/produtos/novo" className="btn-primary">
        Adicionar Primeiro Produto
      </Link>
    </div>
  );
}
