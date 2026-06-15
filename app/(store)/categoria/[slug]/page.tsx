import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/store/ProductCard';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const category = await prisma.category.findUnique({
      where: { slug },
      select: { name: true },
    });
    return { title: category?.name || 'Categoria' };
  } catch {
    return {};
  }
}

export default async function CategoriaPage({ params }: Props) {
  const { slug } = await params;

  let category, products;
  try {
    [category, products] = await Promise.all([
      prisma.category.findUnique({ where: { slug } }),
      prisma.product.findMany({
        where: { category: { slug }, isActive: true },
        include: { category: { select: { name: true, slug: true } } },
        orderBy: { createdAt: 'desc' },
      }),
    ]);
  } catch {
    notFound();
  }

  if (!category) notFound();

  return (
    <div className="section-inner py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[#9C9C9C] mb-6">
        <Link href="/" className="hover:text-[#0A0A0A] transition-colors">Início</Link>
        <ChevronRight size={14} />
        <Link href="/produtos" className="hover:text-[#0A0A0A] transition-colors">Produtos</Link>
        <ChevronRight size={14} />
        <span className="text-[#0A0A0A] font-500">{category.name}</span>
      </nav>

      <div className="mb-8">
        <div className="gradient-divider mb-3" />
        <h1 className="section-title">{category.name}</h1>
        <p className="text-sm text-[#9C9C9C] mt-1">
          {products?.length || 0} {products?.length === 1 ? 'produto' : 'produtos'} encontrados
        </p>
      </div>

      {products && products.length > 0 ? (
        <div className="product-grid">
          {products.map((product: any) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              price={Number(product.price)}
              comparePrice={product.comparePrice ? Number(product.comparePrice) : null}
              images={product.images}
              stock={product.stock}
              isFeatured={product.isFeatured}
              category={product.category}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#F7F7F7] rounded-2xl border border-dashed border-[#E4E4E4]">
          <p className="font-600 text-[#0A0A0A] mb-2">Nenhum produto nesta categoria ainda</p>
          <Link href="/produtos" className="text-[#9333EA] hover:underline text-sm">
            Ver todos os produtos
          </Link>
        </div>
      )}
    </div>
  );
}
