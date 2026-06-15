import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus, Search, Package } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import Image from 'next/image';
import ProductActions from './ProductActions';

async function getProducts(search?: string, category?: string) {
  try {
    const where: any = {};
    if (search)
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    if (category) where.category = { slug: category };
    return await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  } catch {
    return [];
  }
}

async function getCategories() {
  try {
    return await prisma.category.findMany({ orderBy: { name: 'asc' } });
  } catch {
    return [];
  }
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts(params.search, params.category),
    getCategories(),
  ]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#0A0A0A]">Produtos</h1>
        <Link href="/admin/produtos/novo" className="btn-primary text-sm px-4 py-2">
          <Plus size={16} /> Novo Produto
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-[#E4E4E4] flex gap-3 flex-wrap">
        <form className="flex gap-3 flex-1 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9C9C9C]"
            />
            <input
              name="search"
              defaultValue={params.search}
              placeholder="Buscar produto ou SKU..."
              className="input pl-9 h-9 text-sm"
            />
          </div>
          <select
            name="category"
            defaultValue={params.category}
            className="input w-auto h-9 text-sm px-3"
          >
            <option value="">Todas as categorias</option>
            {categories.map((c: any) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <button type="submit" className="btn-primary h-9 px-4 text-sm">
            Filtrar
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E4E4E4] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Preço</th>
                <th>Estoque</th>
                <th>Status</th>
                <th>Criado</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-[#9C9C9C]">
                    <Package size={32} className="mx-auto mb-2 text-[#E4E4E4]" />
                    Nenhum produto
                  </td>
                </tr>
              ) : (
                products.map((p: any) => (
                  <tr key={p.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 overflow-hidden bg-[#F4F4F5] border border-[#E4E4E7] flex-shrink-0">
                          {p.images[0] ? (
                            <Image
                              src={p.images[0]}
                              alt={p.name}
                              fill
                              className="object-contain p-1"
                            />
                          ) : (
                            <Package
                              size={16}
                              className="absolute inset-0 m-auto text-[#A1A1AA]"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-600 text-sm text-[#09090B] line-clamp-1">
                            {p.name}
                          </p>
                          {p.sku && (
                            <p className="text-xs text-[#52525B]">SKU: {p.sku}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="text-sm font-500 text-[#52525B] uppercase tracking-wider text-[10px]">{p.category.name}</span>
                    </td>
                    <td>
                      <div>
                        <p className="font-700 text-sm text-[#09090B]">
                          {formatPrice(Number(p.price))}
                        </p>
                        {p.comparePrice && (
                          <p className="text-xs text-[#A1A1AA] line-through">
                            {formatPrice(Number(p.comparePrice))}
                          </p>
                        )}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge text-[10px] ${
                          p.stock === 0
                            ? 'badge-danger'
                            : p.stock < 5
                            ? 'badge-warning'
                            : 'badge-success'
                        }`}
                      >
                        {p.stock} un.
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-1.5">
                        {p.isActive ? (
                          <span className="badge badge-success text-[10px]">Ativo</span>
                        ) : (
                          <span className="badge badge-danger text-[10px]">Inativo</span>
                        )}
                        {p.isFeatured && (
                          <span className="badge badge-brand text-[10px]">Destaque</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="text-xs text-[#9C9C9C]">
                        {formatDate(p.createdAt)}
                      </span>
                    </td>
                    <td>
                      <ProductActions productId={p.id} isActive={p.isActive} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
