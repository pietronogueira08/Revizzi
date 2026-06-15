import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductPageClient from './ProductPageClient';

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { category: true }
  });

  if (!product) {
    notFound();
  }

  // Fetch some related products (just picking a few from the same category or all)
  const allProducts = await prisma.product.findMany();
  const relatedProducts = allProducts.filter((p: any) => p.id !== product.id).slice(0, 4);

  return (
    <ProductPageClient product={product} relatedProducts={relatedProducts} />
  );
}
