import { Suspense } from 'react';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/store/ProductCard';
import FilterSidebar from '@/components/store/FilterSidebar';
import { Package, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Produtos',
  description: 'Catálogo completo de autopeças, estética automotiva e acessórios da Revizzi Centro Automotivo.',
};

const ITEMS_PER_PAGE = 16;

interface SearchParams {
  search?: string;
  category?: string;
  sort?: string;
  minPrice?: string;
  maxPrice?: string;
  inStock?: string;
  featured?: string;
  page?: string;
}

async function getProducts(params: SearchParams) {
  const page = parseInt(params.page || '1');
  const skip = (page - 1) * ITEMS_PER_PAGE;

  const where: any = { isActive: true };

  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: 'insensitive' } },
      { description: { contains: params.search, mode: 'insensitive' } },
      { sku: { contains: params.search, mode: 'insensitive' } },
    ];
  }

  if (params.category) {
    where.category = { slug: params.category };
  }

  if (params.featured === 'true') {
    where.isFeatured = true;
  }

  if (params.inStock === 'true') {
    where.stock = { gt: 0 };
  }

  if (params.minPrice || params.maxPrice) {
    where.price = {};
    if (params.minPrice) where.price.gte = parseFloat(params.minPrice);
    if (params.maxPrice) where.price.lte = parseFloat(params.maxPrice);
  }

  const orderBy: any =
    params.sort === 'price_asc'
      ? { price: 'asc' }
      : params.sort === 'price_desc'
      ? { price: 'desc' }
      : { createdAt: 'desc' };

  try {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: ITEMS_PER_PAGE,
        include: { category: { select: { name: true, slug: true } } },
      }),
      prisma.product.count({ where }),
    ]);

    return { products, total, totalPages: Math.ceil(total / ITEMS_PER_PAGE), page };
  } catch {
    return { products: [], total: 0, totalPages: 0, page: 1 };
  }
}

async function getCategories() {
  try {
    return await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { products: { where: { isActive: true } } } } },
    });
  } catch {
    return [];
  }
}

export default async function ProdutosPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const [{ products, total, totalPages, page }, categories] = await Promise.all([
    getProducts(params),
    getCategories(),
  ]);

  const sortOptions = [
    { value: 'newest', label: 'Mais recentes' },
    { value: 'price_asc', label: 'Menor preço' },
    { value: 'price_desc', label: 'Maior preço' },
    { value: 'popular', label: 'Mais vendidos' },
  ];

  return (
    <div className="section-inner py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[#9C9C9C] mb-6">
        <Link href="/" className="hover:text-[#0A0A0A] transition-colors">Início</Link>
        <span>/</span>
        <span className="text-[#0A0A0A] font-500">Produtos</span>
      </nav>

      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 hidden lg:block">
          <FilterSidebar
            categories={categories.map((c: any) => ({
              name: c.name,
              slug: c.slug,
              count: c._count?.products || 0,
            }))}
            currentParams={params as Record<string, string | undefined>}
          />
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <h1 className="text-xl font-700 text-[#0A0A0A]">
                {params.search ? `Busca: "${params.search}"` : 'Todos os Produtos'}
              </h1>
              <p className="text-sm text-[#9C9C9C] mt-0.5">
                {total} {total === 1 ? 'produto encontrado' : 'produtos encontrados'}
              </p>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-[#5C5C5C]">
                Ordenar:
              </label>
              <select
                id="sort"
                defaultValue={params.sort || 'newest'}
                className="input w-auto text-sm h-9 px-3 pr-8"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {products.length > 0 ? (
            <>
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  {page > 1 && (
                    <Link
                      href={{ query: { ...params, page: page - 1 } }}
                      className="btn-secondary h-9 px-3"
                    >
                      <ChevronLeft size={16} /> Anterior
                    </Link>
                  )}

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                      const p = i + 1;
                      return (
                        <Link
                          key={p}
                          href={{ query: { ...params, page: p } }}
                          className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-500 transition-colors ${
                            p === page
                              ? 'text-white'
                              : 'text-[#5C5C5C] hover:bg-[#F7F7F7]'
                          }`}
                          style={p === page ? { background: 'linear-gradient(135deg, #9333EA, #D97706)' } : {}}
                        >
                          {p}
                        </Link>
                      );
                    })}
                  </div>

                  {page < totalPages && (
                    <Link
                      href={{ query: { ...params, page: page + 1 } }}
                      className="btn-secondary h-9 px-3"
                    >
                      Próxima <ChevronRight size={16} />
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 bg-[#F7F7F7] rounded-2xl border border-dashed border-[#E4E4E4]">
              <Package size={40} className="mx-auto text-[#E4E4E4] mb-4" />
              <h3 className="font-600 text-[#0A0A0A] mb-2">Nenhum produto encontrado</h3>
              <p className="text-sm text-[#9C9C9C]">
                Tente outros filtros ou{' '}
                <Link href="/produtos" className="text-[#9333EA] hover:underline">
                  ver todos os produtos
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
