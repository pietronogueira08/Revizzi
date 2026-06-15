import type { Metadata } from 'next';
import { Car, MapPin, Phone, Mail, Users, Award, Truck, Heart } from 'lucide-react';
import RevizziLogo from '@/components/RevizziLogo';

export const metadata: Metadata = {
  title: 'Sobre Nós',
  description: 'Conheça a Revizzi Centro Automotivo, sua loja de autopeças em São João da Barra, RJ.',
};

export default function SobrePage() {
  return (
    <>
      {/* Hero */}
      <section
        className="py-20 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0A0A0A, #1a1a1a)' }}
      >
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, #9333EA 0, #9333EA 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }}
        />
        <div className="section-inner relative z-10 text-center">
          <div className="inline-block p-[2px] rounded-2xl mb-6"
            style={{ background: 'linear-gradient(135deg, #9333EA, #D97706)' }}>
            <div className="bg-[#0A0A0A] rounded-2xl px-8 py-5">
              <RevizziLogo width={200} height={64} variant="full" color="white" />
            </div>
          </div>
          <h1 className="text-4xl font-700 text-white mb-4">
            Sobre a{' '}
            <span style={{ background: 'linear-gradient(135deg, #9333EA, #D97706)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Revizzi
            </span>
          </h1>
          <p className="text-[#A3A3A3] max-w-xl mx-auto">
            Referência em autopeças e estética automotiva no Norte Fluminense
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="section">
        <div className="section-inner max-w-3xl mx-auto text-center">
          <div className="gradient-divider mb-4 mx-auto" />
          <h2 className="section-title mb-5">Nossa História</h2>
          <div className="text-[#5C5C5C] leading-relaxed space-y-4 text-left">
            <p>
              A <strong className="text-[#0A0A0A]">Revizzi Centro Automotivo</strong> nasceu da paixão pelo mundo automotivo e do desejo de oferecer aos motoristas do Norte Fluminense uma solução completa para cuidar dos seus veículos.
            </p>
            <p>
              Localizada em São João da Barra – RJ, expandimos nossa atuação para todo o Brasil através do nosso e-commerce, levando produtos de qualidade com a praticidade que o cliente moderno merece.
            </p>
            <p>
              Nossa missão é simples: <strong className="text-[#0A0A0A]">conectar quem ama carros aos melhores produtos e serviços do mercado</strong>, sempre com honestidade, qualidade e preços justos.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-[#F7F7F7]">
        <div className="section-inner">
          <div className="text-center mb-10">
            <div className="gradient-divider mb-3 mx-auto" />
            <h2 className="section-title">Nossos Valores</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Award, color: '#9333EA', title: 'Qualidade', desc: 'Trabalhamos apenas com marcas reconhecidas e produtos com garantia.' },
              { icon: Heart, color: '#EA580C', title: 'Paixão', desc: 'Somos apaixonados por carros e isso se reflete em cada atendimento.' },
              { icon: Users, color: '#16A34A', title: 'Confiança', desc: 'Transparência em tudo: preços, prazos e políticas claras.' },
              { icon: Truck, color: '#D97706', title: 'Agilidade', desc: 'Envios rápidos para todo o Brasil, direto da nossa central em SJB.' },
            ].map((v) => (
              <div key={v.title} className="bg-white rounded-xl p-5 border border-[#E4E4E4] text-center">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: `${v.color}15`, border: `1.5px solid ${v.color}30` }}>
                  <v.icon size={22} style={{ color: v.color }} strokeWidth={1.5} />
                </div>
                <h3 className="font-700 text-[#0A0A0A] mb-2">{v.title}</h3>
                <p className="text-sm text-[#5C5C5C] leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="section">
        <div className="section-inner max-w-2xl mx-auto text-center">
          <div className="gradient-divider mb-3 mx-auto" />
          <h2 className="section-title mb-6">Onde Estamos</h2>
          <div className="bg-[#0A0A0A] rounded-2xl p-8 text-left">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: '#9333EA20', border: '1.5px solid #9333EA30' }}>
                <MapPin size={18} style={{ color: '#9333EA' }} />
              </div>
              <div>
                <p className="font-600 text-white">Revizzi Centro Automotivo</p>
                <p className="text-[#A3A3A3] text-sm">Avenida Genecy Mendonça, 10<br />Bairro de Fátima, São João da Barra – RJ<br />CEP: 28.200-000</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a href="tel:+5522999999999" className="flex items-center gap-3 text-[#A3A3A3] hover:text-white transition-colors text-sm">
                <Phone size={15} style={{ color: '#D97706' }} /> (22) 99999-9999
              </a>
              <a href="mailto:contato@revizzi.com.br" className="flex items-center gap-3 text-[#A3A3A3] hover:text-white transition-colors text-sm">
                <Mail size={15} style={{ color: '#D97706' }} /> contato@revizzi.com.br
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
