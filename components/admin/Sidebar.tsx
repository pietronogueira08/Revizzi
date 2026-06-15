'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import RevizziLogo from '@/components/RevizziLogo';
import {
  LayoutDashboard, Package, ShoppingBag, Tag,
  Warehouse, Settings, LogOut, ChevronRight,
} from 'lucide-react';

const navItems = [
  { href: '/admin',                label: 'Dashboard',     icon: LayoutDashboard, exact: true },
  { href: '/admin/produtos',       label: 'Produtos',      icon: Package },
  { href: '/admin/pedidos',        label: 'Pedidos',       icon: ShoppingBag },
  { href: '/admin/estoque',        label: 'Estoque',       icon: Warehouse },
  { href: '/admin/cupons',         label: 'Cupões',        icon: Tag },
  { href: '/admin/configuracoes',  label: 'Configurações', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="admin-sidebar"
      style={{ background: '#0A0A0A', borderRight: '1px solid #1C1C1C' }}
    >
      {/* Logo */}
      <div className="p-5 border-b" style={{ borderColor: '#1C1C1C' }}>
        <div
          className="p-[2px] rounded-xl inline-block"
          style={{ background: 'linear-gradient(135deg, #9333EA, #D97706)' }}
        >
          <div className="rounded-xl px-3 py-2" style={{ background: '#0A0A0A' }}>
            <RevizziLogo width={120} height={38} variant="full" color="white" />
          </div>
        </div>
        <p className="text-[10px] mt-2" style={{ color: '#6B6B6B' }}>Painel Administrativo</p>
      </div>

      {/* Nav */}
      <nav className="p-3 flex-1 space-y-0.5">
        {navItems.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-nav-item ${active ? 'active' : ''}`}
              style={active ? { background: 'rgba(147,51,234,0.15)', color: 'white' } : {}}
            >
              <item.icon size={16} strokeWidth={1.5} />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight size={12} style={{ color: '#9333EA' }} />}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="p-3 border-t" style={{ borderColor: '#1C1C1C' }}>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="admin-nav-item w-full"
        >
          <LogOut size={16} strokeWidth={1.5} />
          Sair
        </button>
      </div>
    </aside>
  );
}
