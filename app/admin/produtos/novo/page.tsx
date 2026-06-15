import { prisma } from '@/lib/prisma';
import ProductForm from '@/components/admin/ProductForm';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default async function AdminNovoProdutoPage() {
  let categories: any[] = [];
  try {
    categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  } catch {}

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/admin/produtos" className="btn-secondary h-8 px-3 text-xs">
          <ChevronLeft size={14} /> Voltar
        </Link>
        <h1 className="text-2xl font-700 text-[#0A0A0A]">Novo Produto</h1>
      </div>
      <ProductForm categories={categories} mode="create" />
    </div>
  );
}
