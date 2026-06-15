import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import HomePageClient from '@/components/store/HomePageClient';

export const metadata: Metadata = {
  title: 'Revizzi Centro Automotivo — Autopeças e Estética Premium',
  description: 'Loja especializada em peças de alta performance e estética automotiva. Frete grátis acima de R$ 199. Enviamos para todo o Brasil.',
};

async function getFeaturedProducts() {
  try {
    return await prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      include: { category: { select: { name: true, slug: true } } },
      take: 8,
      orderBy: { createdAt: 'desc' },
    });
  } catch {
    return [];
  }
}

async function getBestSellers() {
  try {
    return await prisma.product.findMany({
      where: { isActive: true },
      include: { category: { select: { name: true, slug: true } } },
      take: 4,
      orderBy: { createdAt: 'desc' },
    });
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [featuredProducts, bestSellers] = await Promise.all([
    getFeaturedProducts(),
    getBestSellers(),
  ]);

  return <HomePageClient featuredProducts={featuredProducts} bestSellers={bestSellers} />;
}
