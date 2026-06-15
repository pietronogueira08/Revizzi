import type { Metadata } from 'next';
import Header from '@/components/store/Header';
import Footer from '@/components/store/Footer';

export const metadata: Metadata = {
  title: {
    default: 'Revizzi Centro Automotivo — Autopeças e Estética Automotiva',
    template: '%s | Revizzi Centro Automotivo',
  },
  description:
    'Loja especializada em autopeças, estética automotiva e acessórios. Enviamos para todo o Brasil. São João da Barra – RJ.',
  keywords: ['autopeças', 'estética automotiva', 'acessórios automotivos', 'Revizzi', 'São João da Barra'],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://revizzi.com.br',
    siteName: 'Revizzi Centro Automotivo',
  },
};

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
