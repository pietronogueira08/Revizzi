import type { Metadata } from 'next';
import { MapPin, Phone, Mail, MessageCircle, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contato',
  description: 'Entre em contato com a Revizzi Centro Automotivo. Estamos em São João da Barra, RJ.',
};

export default function ContatoPage() {
  return (
    <div className="section-inner py-12">
      <div className="text-center mb-10">
        <div className="gradient-divider mb-3 mx-auto" />
        <h1 className="section-title">Entre em Contato</h1>
        <p className="text-[#5C5C5C] text-sm mt-2 max-w-md mx-auto">
          Tem alguma dúvida? Estamos aqui para ajudar!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-4xl mx-auto">
        {/* Contact info */}
        <div className="space-y-6">
          <div className="bg-[#F7F7F7] rounded-2xl p-6 space-y-5">
            {[
              {
                icon: MapPin,
                title: 'Endereço',
                content: 'Avenida Genecy Mendonça, 10\nBairro de Fátima\nSão João da Barra — RJ',
                color: '#9333EA',
              },
              {
                icon: Phone,
                title: 'Telefone',
                content: '(22) 99999-9999',
                href: 'tel:+5522999999999',
                color: '#EA580C',
              },
              {
                icon: Mail,
                title: 'Email',
                content: 'contato@revizzi.com.br',
                href: 'mailto:contato@revizzi.com.br',
                color: '#C026D3',
              },
              {
                icon: Clock,
                title: 'Horário de Atendimento',
                content: 'Seg–Sex: 8h às 18h\nSáb: 8h às 13h',
                color: '#D97706',
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${item.color}15`, border: `1.5px solid ${item.color}30` }}
                >
                  <item.icon size={18} style={{ color: item.color }} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-600 text-sm text-[#0A0A0A] mb-0.5">{item.title}</p>
                  {item.href ? (
                    <a href={item.href} className="text-sm text-[#5C5C5C] hover:text-[#9333EA] transition-colors whitespace-pre-line">
                      {item.content}
                    </a>
                  ) : (
                    <p className="text-sm text-[#5C5C5C] whitespace-pre-line">{item.content}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <a
            href="https://wa.me/5522999999999?text=Olá! Tenho uma dúvida sobre a Revizzi."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-4 rounded-xl font-600 text-white transition-all hover:opacity-90"
            style={{ background: '#25D366' }}
          >
            <MessageCircle size={20} />
            Falar pelo WhatsApp
          </a>
        </div>

        {/* Contact form */}
        <div className="bg-white rounded-2xl border border-[#E4E4E4] p-6">
          <h2 className="font-700 text-[#0A0A0A] mb-5">Enviar Mensagem</h2>
          <form className="space-y-4">
            <div>
              <label className="label">Seu nome</label>
              <input type="text" className="input" placeholder="João Silva" />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" placeholder="joao@email.com" />
            </div>
            <div>
              <label className="label">Assunto</label>
              <select className="input">
                <option>Dúvida sobre produto</option>
                <option>Problema com pedido</option>
                <option>Troca ou devolução</option>
                <option>Parceria comercial</option>
                <option>Outro</option>
              </select>
            </div>
            <div>
              <label className="label">Mensagem</label>
              <textarea
                rows={5}
                className="input resize-none"
                placeholder="Escreva sua mensagem..."
              />
            </div>
            <button type="submit" className="btn-primary w-full justify-center">
              Enviar mensagem
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
