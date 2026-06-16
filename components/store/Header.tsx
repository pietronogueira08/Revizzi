'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/cart';
import { ShoppingCart, Search, User, Menu, X, Phone } from 'lucide-react';
import { useState, useEffect, useRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import RevizziLogo from '@/components/RevizziLogo';
import CartDrawer from './CartDrawer';

const navLinks = [
  { href: '/produtos', label: 'Produtos' },
  { href: '/categoria/polimento', label: 'Polimento' },
  { href: '/categoria/lavagem', label: 'Lavagem' },
  { href: '/categoria/protecao', label: 'Proteção' },
  { href: '/categoria/acessorios', label: 'Acessórios' },
  { href: '/sobre', label: 'A Revizzi' },
  { href: '/contato', label: 'Contato' },
];

const WHATSAPP_NUMBER = '5522999999999'; // formato internacional sem '+'

export default function Header() {
  const { getItemCount, toggleCart } = useCartStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const itemCount = getItemCount();
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fechar busca com Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focar input ao abrir busca
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  // Fechar menu mobile ao redimensionar para desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSearch = (e?: FormEvent) => {
    e?.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    setSearchOpen(false);
    setSearchQuery('');
    router.push(`/produtos?search=${encodeURIComponent(q)}`);
  };

  const handlePhoneClick = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank');
  };

  return (
    <>
      {/* Top bar */}
      <div className="bg-[#050505] text-[#A1A1AA] py-2.5 hidden md:block relative z-50">
        <div className="section-inner flex items-center justify-between text-xs tracking-wide">
          <div className="flex items-center gap-6">
            <button
              onClick={handlePhoneClick}
              className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
              aria-label="Abrir WhatsApp"
            >
              <Phone size={12} />
              (22) 99999-9999
            </button>
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

      {/* Main header */}
      <header
        className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
          scrolled ? 'border-b border-[#E4E4E7] shadow-[0_4px_20px_rgba(0,0,0,0.03)]' : 'border-b border-[#E4E4E7]'
        }`}
      >
        <div className="section-inner flex items-center justify-between h-20 gap-8">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center" aria-label="Ir para a página inicial">
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
            {/* Busca */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-10 h-10 flex items-center justify-center text-[#09090B] hover:text-[#E60000] transition-colors"
              aria-label={searchOpen ? 'Fechar busca' : 'Abrir busca'}
            >
              {searchOpen ? <X size={20} strokeWidth={1.5} /> : <Search size={20} strokeWidth={1.5} />}
            </button>

            {/* Minha conta */}
            <Link
              href="/conta/pedidos"
              className="hidden sm:flex w-10 h-10 items-center justify-center text-[#09090B] hover:text-[#E60000] transition-colors"
              aria-label="Minha conta"
            >
              <User size={20} strokeWidth={1.5} />
            </Link>

            {/* Carrinho */}
            <button
              onClick={toggleCart}
              className="relative flex w-10 h-10 items-center justify-center text-[#09090B] hover:text-[#E60000] transition-colors"
              aria-label={`Carrinho com ${itemCount} ${itemCount === 1 ? 'item' : 'itens'}`}
            >
              <ShoppingCart size={20} strokeWidth={1.5} />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-[#E60000] text-[10px] font-700 text-white flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>

            {/* Menu mobile */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center text-[#09090B]"
              aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              {mobileOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {/* Search Bar Dropdown */}
        {searchOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-b border-[#E4E4E7] shadow-lg animate-fade-in">
            <div className="section-inner py-6">
              <form onSubmit={handleSearch} className="relative max-w-3xl mx-auto">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A1A1AA] pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar produtos, vitrificadores, marcas..."
                  className="w-full bg-[#F4F4F5] border-none text-base pl-12 pr-28 py-4 focus:ring-2 focus:ring-[#09090B] outline-none transition-all"
                />
                <button
                  type="submit"
                  disabled={!searchQuery.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#09090B] text-white text-sm font-600 px-4 py-2 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#E60000] transition-colors"
                >
                  Buscar
                </button>
              </form>
              <p className="text-center text-xs text-[#A1A1AA] mt-3">
                Pressione <kbd className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[11px] font-mono">Enter</kbd> para buscar
                ou <kbd className="bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[11px] font-mono">Esc</kbd> para fechar
              </p>
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
              {/* Busca mobile */}
              <form
                onSubmit={(e) => { setMobileOpen(false); handleSearch(e); }}
                className="px-6 py-4 border-b border-[#F4F4F5]"
              >
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA] pointer-events-none" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar produtos..."
                    className="w-full bg-[#F4F4F5] text-sm pl-9 pr-4 py-3 outline-none focus:ring-2 focus:ring-[#09090B] transition-all"
                  />
                </div>
              </form>
              {/* WhatsApp mobile */}
              <button
                onClick={() => { setMobileOpen(false); handlePhoneClick(); }}
                className="px-6 py-4 text-sm font-600 text-[#09090B] hover:bg-[#F4F4F5] hover:text-[#25D366] transition-colors uppercase tracking-wider border-b border-[#F4F4F5] flex items-center gap-2"
              >
                <Phone size={14} />
                (22) 99999-9999 — WhatsApp
              </button>
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
