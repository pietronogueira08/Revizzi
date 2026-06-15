'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/cart';
import { ShoppingCart, Search, User, Menu, X, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';
import RevizziLogo from '@/components/RevizziLogo';
import CartDrawer from './CartDrawer';

const navLinks = [
  { href: '/produtos', label: 'Produtos' },
  { href: '/categoria/pecas', label: 'Peças' },
  { href: '/categoria/estetica', label: 'Estética' },
  { href: '/categoria/acessorios', label: 'Acessórios' },
  { href: '/sobre', label: 'A Revizzi' },
  { href: '/contato', label: 'Contato' },
];

export default function Header() {
  const { getItemCount, toggleCart } = useCartStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const itemCount = getItemCount();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top bar — Dark, sleek */}
      <div className="bg-[#050505] text-[#A1A1AA] py-2.5 hidden md:block relative z-50">
        <div className="section-inner flex items-center justify-between text-xs tracking-wide">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
              <Phone size={12} />
              (22) 99999-9999
            </span>
            <span>SÃO JOÃO DA BARRA – RJ • ENVIAMOS PARA TODO O BRASIL</span>
          </div>
          <div className="flex items-center gap-6 font-500">
            <Link href="/conta/pedidos" className="hover:text-white transition-colors">
              MEUS PEDIDOS
            </Link>
            <Link href="/login" className="hover:text-white transition-colors">
              ENTRAR
            </Link>
          </div>
        </div>
      </div>

      {/* Main header — Sticky, minimal border */}
      <header 
        className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
          scrolled ? 'border-b border-[#E4E4E7] shadow-[0_4px_20px_rgba(0,0,0,0.03)]' : 'border-b border-[#E4E4E7]'
        }`}
      >
        <div className="section-inner flex items-center justify-between h-20 gap-8">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <RevizziLogo width={150} height={40} variant="full" color="black" />
          </Link>

          {/* Navigation - desktop */}
          <nav className="hidden lg:flex items-center gap-8 h-full">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-600 text-[#09090B] hover:text-[#E60000] transition-colors uppercase tracking-wider relative group py-2"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E60000] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-10 h-10 flex items-center justify-center text-[#09090B] hover:text-[#E60000] transition-colors"
              aria-label="Buscar"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>

            <Link
              href="/conta/pedidos"
              className="hidden sm:flex w-10 h-10 items-center justify-center text-[#09090B] hover:text-[#E60000] transition-colors"
              aria-label="Minha conta"
            >
              <User size={20} strokeWidth={1.5} />
            </Link>

            <button
              onClick={toggleCart}
              className="relative flex w-10 h-10 items-center justify-center text-[#09090B] hover:text-[#E60000] transition-colors"
              aria-label={`Carrinho com ${itemCount} itens`}
            >
              <ShoppingCart size={20} strokeWidth={1.5} />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-[#E60000] text-[10px] font-700 text-white flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center text-[#09090B]"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {/* Search Bar Dropdown */}
        {searchOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-b border-[#E4E4E7] shadow-lg animate-fade-in">
            <div className="section-inner py-6">
              <div className="relative max-w-3xl mx-auto">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A1A1AA]" />
                <input
                  autoFocus
                  type="search"
                  placeholder="Buscar peças, acessórios, marcas..."
                  className="w-full bg-[#F4F4F5] border-none text-base pl-12 pr-4 py-4 focus:ring-2 focus:ring-[#09090B] outline-none transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-[#E4E4E7] shadow-lg animate-slide-up">
            <div className="flex flex-col py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-6 py-4 text-sm font-600 text-[#09090B] hover:bg-[#F4F4F5] hover:text-[#E60000] transition-colors uppercase tracking-wider border-b border-[#F4F4F5]"
                >
                  {link.label}
                </Link>
              ))}
              <div className="px-6 pt-6 pb-2">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary w-full text-center"
                >
                  Entrar / Cadastrar
                </Link>
              </div>
            </div>
          </nav>
        )}
      </header>

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}
