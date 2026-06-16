import Link from 'next/link';
import RevizziLogo from '@/components/RevizziLogo';
import {
  MapPin, Phone, Mail, Share2, Rss,
  PlayCircle, MessageCircle
} from 'lucide-react';

const footerLinks = {
  loja: [
    { href: '/produtos', label: 'Todos os Produtos' },
    { href: '/categoria/polimento', label: 'Polimento' },
    { href: '/categoria/lavagem', label: 'Lavagem' },
    { href: '/categoria/protecao', label: 'Proteção & Vitrificação' },
    { href: '/categoria/detalhamento', label: 'Detalhamento' },
    { href: '/categoria/ferramentas', label: 'Ferramentas' },
  ],
  conta: [
    { href: '/login', label: 'Fazer Login' },
    { href: '/cadastro', label: 'Criar Conta' },
    { href: '/conta/pedidos', label: 'Meus Pedidos' },
    { href: '/conta/perfil', label: 'Meu Perfil' },
  ],
  empresa: [
    { href: '/sobre', label: 'Sobre Nós' },
    { href: '/contato', label: 'Contato' },
  ],
};

export default function Footer() {
  return (
    <footer>
      <div className="section-inner py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <RevizziLogo width={140} height={44} variant="full" color="white" />
            </div>
            <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-8 max-w-sm">
              Sua loja especializada em estética automotiva premium.
              Polimentos, vitrificações e detalhamento para seu veículo.
            </p>

            {/* Address */}
            <div className="space-y-4 text-sm mb-8">
              <div className="flex items-start gap-3 text-[var(--text-secondary)]">
                <MapPin size={16} className="flex-shrink-0 mt-0.5" />
                <span>Avenida Genecy Mendonça, 10<br />Bairro de Fátima, São João da Barra – RJ</span>
              </div>
              <a
                href="tel:+5522999999999"
                className="flex items-center gap-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <Phone size={16} />
                (22) 99999-9999
              </a>
              <a
                href="mailto:contato@revizzi.com.br"
                className="flex items-center gap-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <Mail size={16} />
                contato@revizzi.com.br
              </a>
            </div>

            {/* Social */}
            <div className="flex items-center gap-3">
              {[
                { icon: Share2, href: 'https://instagram.com/revizzi', label: 'Instagram' },
                { icon: Rss, href: 'https://facebook.com/revizzi', label: 'Facebook' },
                { icon: PlayCircle, href: 'https://youtube.com/@revizzi', label: 'YouTube' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-[2px] border border-[var(--border-default)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] bg-[var(--bg-elevated)] transition-all"
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/5522999999999?text=Olá! Vim pelo site da Revizzi."
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-[2px] text-xs font-600 uppercase tracking-widest text-black bg-white transition-all hover:bg-[var(--accent)]"
            >
              <MessageCircle size={16} />
              Chamar no WhatsApp
            </a>
          </div>

          {/* Links */}
          <div>
            <h4>Loja</h4>
            <ul className="space-y-3">
              {footerLinks.loja.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Minha Conta</h4>
            <ul className="space-y-3">
              {footerLinks.conta.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Empresa</h4>
            <ul className="space-y-3">
              {footerLinks.empresa.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Payments */}
            <div className="mt-10">
              <h4 className="mb-4">Pagamentos</h4>
              <div className="flex flex-wrap gap-2">
                {['PIX', 'Visa', 'Master', 'Amex', 'Elo', 'Boleto'].map((p) => (
                  <span
                    key={p}
                    className="px-2.5 py-1.5 rounded-[2px] text-[10px] font-600 text-[var(--text-secondary)] border border-[var(--border-default)] bg-[var(--bg-elevated)] uppercase tracking-widest"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-[var(--bg-base)] border-t border-[var(--border-subtle)]">
        <div className="section-inner py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[var(--text-muted)] text-xs">
            © {new Date().getFullYear()} Revizzi Centro Automotivo. Todos os direitos reservados.
          </p>
          <p className="text-[var(--text-muted)] text-xs">
            CNPJ: 00.000.000/0001-00 — São João da Barra, RJ
          </p>
        </div>
      </div>
    </footer>
  );
}
