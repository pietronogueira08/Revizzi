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

const WHATSAPP_NUMBER = '5522999999999';

export default function Header() {
  const { getItemCount, toggleCart } = useCartStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const itemCount = getItemCount();
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

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
      <div className="bg-[var(--bg-elevated)] text-[var(--text-secondary)] py-2.5 hidden md:block relative z-50 border-b border-[var(--border-subtle)]">
        <div className="section-inner flex items-center justify-between text-xs tracking-wide">
          <div className="flex items-center gap-6">
            <button
              onClick={handlePhoneClick}
              className="flex items-center gap-2 hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              aria-label="Abrir WhatsApp"
            >
              <Phone size={12} />
              (22) 99999-9999
            </button>
            <span>SÃO JOÃO DA BARRA – RJ • ENVIAMOS PARA TODO O BRASIL</span>
          </div>
          <div className="flex items-center gap-6 font-500">
            <Link href="/conta/pedidos" className="hover:text-[var(--text-primary)] transition-colors">
              MEUS PEDIDOS
            </Link>
            <Link href="/login" className="hover:text-[var(--text-primary)] transition-colors">
              ENTRAR
            </Link>
          </div>
        </div>
      </div>

      <header className={`fixed top-0 md:top-[38px] w-full z-50 ${scrolled ? 'scrolled' : ''}`}>
        <div className="section-inner flex items-center justify-between h-20 gap-8">
          <Link href="/" className="flex-shrink-0 flex items-center" aria-label="Ir para a página inicial">
            <RevizziLogo width={150} height={40} variant="full" color="white" />
          </Link>

          <nav className="hidden lg:flex items-center gap-8 h-full">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4 text-[var(--text-primary)]">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-10 h-10 flex items-center justify-center hover:text-[var(--accent)] transition-colors"
              aria-label={searchOpen ? 'Fechar busca' : 'Abrir busca'}
            >
              {searchOpen ? <X size={20} strokeWidth={1.5} /> : <Search size={20} strokeWidth={1.5} />}
            </button>

            <Link
              href="/conta/pedidos"
              className="hidden sm:flex w-10 h-10 items-center justify-center hover:text-[var(--accent)] transition-colors"
              aria-label="Minha conta"
            >
              <User size={20} strokeWidth={1.5} />
            </Link>

            <button
              onClick={toggleCart}
              className="relative flex w-10 h-10 items-center justify-center hover:text-[var(--accent)] transition-colors"
              aria-label="Carrinho"
            >
              <ShoppingCart size={20} strokeWidth={1.5} />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[var(--text-primary)] text-[var(--bg-base)] text-[10px] font-700 flex items-center justify-center rounded-sm">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center"
              aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              {mobileOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="absolute top-full left-0 w-full bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] shadow-lg animate-fade-in">
            <div className="section-inner py-6">
              <form onSubmit={handleSearch} className="relative max-w-3xl mx-auto">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar produtos..."
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--border-default)] text-base pl-12 pr-28 py-4 focus:border-[var(--border-active)] outline-none transition-all text-[var(--text-primary)]"
                />
                <button
                  type="submit"
                  disabled={!searchQuery.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-[var(--text-primary)] text-[var(--bg-base)] text-sm font-600 px-4 py-2 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--accent-hover)] transition-colors rounded-[2px]"
                >
                  Buscar
                </button>
              </form>
            </div>
          </div>
        )}

        {mobileOpen && (
          <nav className="lg:hidden absolute top-full left-0 w-full bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] shadow-lg animate-slide-up flex flex-col">
            <div className="flex flex-col py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-6 py-4 text-sm font-600 text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors uppercase tracking-wider border-b border-[var(--border-subtle)]"
                >
                  {link.label}
                </Link>
              ))}
              <form
                onSubmit={(e) => { setMobileOpen(false); handleSearch(e); }}
                className="px-6 py-4 border-b border-[var(--border-subtle)]"
              >
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar produtos..."
                    className="w-full bg-[var(--bg-elevated)] border border-[var(--border-default)] text-sm pl-9 pr-4 py-3 outline-none focus:border-[var(--border-active)] transition-all text-[var(--text-primary)]"
                  />
                </div>
              </form>
              <button
                onClick={() => { setMobileOpen(false); handlePhoneClick(); }}
                className="px-6 py-4 text-sm font-600 text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors uppercase tracking-wider border-b border-[var(--border-subtle)] flex items-center gap-2"
              >
                <Phone size={14} />
                (22) 99999-9999 — WhatsApp
              </button>
              <div className="px-6 pt-6 pb-2">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary w-full"
                >
                  Entrar / Cadastrar
                </Link>
              </div>
            </div>
          </nav>
        )}
      </header>

      <CartDrawer />
    </>
  );
}
