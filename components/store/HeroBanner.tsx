'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, Zap, Truck } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function HeroBanner() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // A animação principal via CSS já está sendo chamada pelos data-animate="1", "2", etc.
    // gsap fica apenas para o parallax sutil do background se quisermos.
    gsap.fromTo('.hero-bg', 
      { scale: 1.1, opacity: 0 }, 
      { scale: 1, opacity: 1, duration: 2, ease: 'power2.out' }
    );
  }, { scope: container });

  return (
    <section ref={container} className="hero">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.png"
          alt="Revizzi Premium Automotive"
          fill
          priority
          className="hero-bg object-cover object-center"
          quality={100}
        />
        {/* O overlay gradiente é aplicado pelo ::before da classe .hero no globals.css */}
      </div>

      {/* Content */}
      <div className="section-inner relative z-10 w-full">
        <div className="max-w-2xl">
          {/* Badge */}
          <div data-animate="1">
            <span className="hero-badge">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              Nova Coleção 2025
            </span>
          </div>

          {/* Headline */}
          <h1 data-animate="2">
            Estética<br />
            automotiva<br />
            <em>de alto nível.</em>
          </h1>

          {/* Subtitle */}
          <p data-animate="3">
            Polimentos, proteções, vitrificações e produtos premium de detalhamento para deixar seu carro impecável.
          </p>

          {/* CTAs */}
          <div data-animate="4" className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link href="/produtos" className="btn-primary">
              Explorar Catálogo
              <ArrowRight size={18} strokeWidth={2} />
            </Link>
            <Link href="/categoria/polimento" className="btn-outline">
              Ver Polimentos
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center gap-6 pt-8 border-t border-[var(--border-default)]">
            {[
              { icon: Truck, label: 'Frete Grátis > R$199' },
              { icon: ShieldCheck, label: 'Compra 100% Segura' },
              { icon: Zap, label: 'Despacho em 24h' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-xs font-500 text-[var(--text-secondary)] uppercase tracking-wider">
                <item.icon size={16} className="text-[var(--text-primary)]" />
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
