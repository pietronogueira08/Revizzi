import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductForm from '@/components/admin/ProductForm';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default async function AdminEditarProdutoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let product, categories;
  try {
    [product, categories] = await Promise.all([
      prisma.product.findUnique({ where: { id }, include: { category: true } }),
      prisma.category.findMany({ orderBy: { name: 'asc' } }),
    ]);
  } catch {
    notFound();
  }

  if (!product) notFound();

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/admin/produtos" className="btn-secondary h-8 px-3 text-xs">
          <ChevronLeft size={14} /> Voltar
        </Link>
        <h1 className="text-2xl font-700 text-[#0A0A0A]">Editar Produto</h1>
      </div>
      <ProductForm
        categories={categories || []}
        mode="edit"
        defaultValues={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: Number(product.price),
          comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
          stock: product.stock,
          sku: product.sku,
          images: product.images,
          categoryId: product.categoryId,
          isActive: product.isActive,
          isFeatured: product.isFeatured,
        }}
      />
    </div>
  );
}
