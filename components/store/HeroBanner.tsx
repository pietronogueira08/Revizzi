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
    const tl = gsap.timeline();

    // Background slight zoom in
    tl.fromTo('.hero-bg', 
      { scale: 1.1, opacity: 0 }, 
      { scale: 1, opacity: 0.6, duration: 1.5, ease: 'power2.out' }
    );

    // Staggered text animations
    tl.fromTo('.hero-anim', 
      { y: 30, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out' },
      '-=1'
    );
    
    // Trust badges animation
    tl.fromTo('.hero-badge',
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' },
      '-=0.4'
    );

  }, { scope: container });

  return (
    <section ref={container} className="relative w-full h-[600px] lg:h-[700px] flex items-center overflow-hidden bg-[#050505]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.png"
          alt="Revizzi Premium Automotive"
          fill
          priority
          className="hero-bg object-cover object-center opacity-60"
          quality={100}
        />
        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="section-inner relative z-10 w-full">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="hero-anim mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#E60000] text-white text-xs font-700 tracking-wider uppercase">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              Nova Coleção 2025
            </span>
          </div>

          {/* Headline */}
          <h1
            className="hero-anim text-white font-700 mb-6 tracking-tight leading-[1.1]"
            style={{ fontSize: 'clamp(40px, 6vw, 64px)' }}
          >
            Performance e<br />
            estética em<br />
            <span className="text-[#A1A1AA]">alto nível.</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-anim text-[#D4D4D8] mb-10 text-lg leading-relaxed max-w-lg">
            Peças selecionadas, acessórios de alta performance e produtos de estética premium para entusiastas automotivos.
          </p>

          {/* CTAs */}
          <div className="hero-anim flex flex-col sm:flex-row gap-4">
            <Link href="/produtos" className="btn-primary">
              Explorar Catálogo
              <ArrowRight size={18} strokeWidth={2} />
            </Link>
            <Link href="/categoria/estetica" className="btn-secondary">
              Linha Estética
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center gap-6 mt-12 pt-8 border-t border-white/10">
            {[
              { icon: Truck, label: 'Frete Grátis > R$199' },
              { icon: ShieldCheck, label: 'Compra 100% Segura' },
              { icon: Zap, label: 'Despacho em 24h' },
            ].map((item) => (
              <div key={item.label} className="hero-badge flex items-center gap-2 text-xs font-500 text-[#A1A1AA] uppercase tracking-wider">
                <item.icon size={16} className="text-[#E60000]" />
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
