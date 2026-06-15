import Link from 'next/link';
import RevizziLogo from '@/components/RevizziLogo';
import {
  MapPin, Phone, Mail, Share2, Rss,
  PlayCircle, Truck, Shield, CreditCard, Clock,
  MessageCircle
} from 'lucide-react';


const footerLinks = {
  loja: [
    { href: '/produtos', label: 'Todos os Produtos' },
    { href: '/categoria/pecas', label: 'Peças Automotivas' },
    { href: '/categoria/estetica', label: 'Estética Automotiva' },
    { href: '/categoria/acessorios', label: 'Acessórios' },
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

const benefits = [
  { icon: Truck, label: 'Frete Grátis', desc: 'acima de R$ 199' },
  { icon: Shield, label: 'Compra Segura', desc: 'dados protegidos' },
  { icon: CreditCard, label: 'Parcelamento', desc: 'em até 12x' },
  { icon: Clock, label: 'Envio Rápido', desc: 'em até 24h úteis' },
];

export default function Footer() {
  return (
    <footer>
      {/* Benefits bar */}
      <div className="bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="section-inner py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {benefits.map((b) => (
              <div key={b.label} className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #9333EA22, #D9770622)', border: '1px solid #9333EA33' }}
                >
                  <b.icon size={18} style={{ color: '#D97706' }} />
                </div>
                <div>
                  <p className="text-white text-sm font-600">{b.label}</p>
                  <p className="text-[#6B6B6B] text-xs">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="bg-[#0A0A0A] border-t border-[#1C1C1C]">
        <div className="section-inner py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand column */}
            <div className="lg:col-span-2">
              <div
                className="inline-block p-[2px] rounded-xl mb-4"
                style={{ background: 'linear-gradient(135deg, #9333EA, #D97706)' }}
              >
                <div className="bg-[#0A0A0A] rounded-xl px-3 py-2">
                  <RevizziLogo width={140} height={44} variant="full" color="white" />
                </div>
              </div>
              <p className="text-[#6B6B6B] text-sm leading-relaxed mb-5 max-w-xs">
                Sua loja especializada em autopeças e produtos de estética automotiva.
                Qualidade e confiança para o seu veículo.
              </p>

              {/* Address */}
              <div className="space-y-2.5 text-sm">
                <div className="flex items-start gap-2.5 text-[#A3A3A3]">
                  <MapPin size={15} className="flex-shrink-0 mt-0.5" style={{ color: '#9333EA' }} />
                  <span>Avenida Genecy Mendonça, 10<br />Bairro de Fátima, São João da Barra – RJ</span>
                </div>
                <a
                  href="tel:+5522999999999"
                  className="flex items-center gap-2.5 text-[#A3A3A3] hover:text-white transition-colors"
                >
                  <Phone size={15} style={{ color: '#9333EA' }} />
                  (22) 99999-9999
                </a>
                <a
                  href="mailto:contato@revizzi.com.br"
                  className="flex items-center gap-2.5 text-[#A3A3A3] hover:text-white transition-colors"
                >
                  <Mail size={15} style={{ color: '#9333EA' }} />
                  contato@revizzi.com.br
                </a>
              </div>

              {/* Social */}
              <div className="flex items-center gap-3 mt-5">
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
                    className="w-9 h-9 rounded-lg border border-[#2A2A2A] flex items-center justify-center text-[#6B6B6B] hover:text-white hover:border-[#9333EA] transition-all"
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
                className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-600 text-white transition-all hover:opacity-90"
                style={{ background: '#25D366' }}
              >
                <MessageCircle size={16} />
                Chamar no WhatsApp
              </a>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white text-sm font-700 mb-4">Loja</h4>
              <ul className="space-y-2.5">
                {footerLinks.loja.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[#6B6B6B] text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white text-sm font-700 mb-4">Minha Conta</h4>
              <ul className="space-y-2.5">
                {footerLinks.conta.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[#6B6B6B] text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white text-sm font-700 mb-4">Empresa</h4>
              <ul className="space-y-2.5">
                {footerLinks.empresa.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[#6B6B6B] text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Payments */}
              <div className="mt-6">
                <h4 className="text-white text-sm font-700 mb-3">Pagamentos</h4>
                <div className="flex flex-wrap gap-2">
                  {['PIX', 'Visa', 'Master', 'Amex', 'Elo', 'Boleto'].map((p) => (
                    <span
                      key={p}
                      className="px-2 py-1 rounded text-[10px] font-600 text-[#9C9C9C] border border-[#2A2A2A] bg-[#111111]"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-[#050505] border-t border-[#1C1C1C]">
        <div className="section-inner py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[#6B6B6B] text-xs">
            © {new Date().getFullYear()} Revizzi Centro Automotivo. Todos os direitos reservados.
          </p>
          <p className="text-[#6B6B6B] text-xs">
            CNPJ: 00.000.000/0001-00 — São João da Barra, RJ
          </p>
        </div>
      </div>
    </footer>
  );
}
