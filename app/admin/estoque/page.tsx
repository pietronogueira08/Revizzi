import { prisma } from '@/lib/prisma';
import StockEditor from './StockEditor';
import { Package } from 'lucide-react';
import Image from 'next/image';

export default async function AdminEstoquePage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const params = await searchParams;
  const filter = params.filter;

  let products: any[] = [];
  try {
    const where: any = { isActive: true };
    if (filter === 'low') where.stock = { gt: 0, lt: 10 };
    else if (filter === 'zero') where.stock = 0;
    products = await prisma.product.findMany({
      where,
      orderBy: { stock: 'asc' },
      include: { category: { select: { name: true } } },
    });
  } catch {}

  const filterOptions = [
    { label: 'Todos', value: '' },
    { label: 'Estoque Baixo', value: 'low' },
    { label: 'Zerado', value: 'zero' },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#0A0A0A]">
          Controle de Estoque
        </h1>
        <span className="text-sm text-[#9C9C9C]">
          {products.length} produto{products.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {filterOptions.map((f) => {
          const isActive =
            filter === f.value || (!filter && f.value === '');
          return (
            <a
              key={f.value}
              href={
                f.value
                  ? `/admin/estoque?filter=${f.value}`
                  : '/admin/estoque'
              }
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                isActive
                  ? 'text-white border-[#9333EA]'
                  : 'text-[#5C5C5C] border-[#E4E4E4] hover:bg-[#F7F7F7]'
              }`}
              style={
                isActive
                  ? { background: 'linear-gradient(135deg, #9333EA, #D97706)' }
                  : {}
              }
            >
              {f.label}
            </a>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E4E4E4] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Categoria</th>
                <th>SKU</th>
                <th>Estoque Atual</th>
                <th>Status</th>
                <th>Ajustar</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[#9C9C9C]">
                    <Package size={32} className="mx-auto mb-2 text-[#E4E4E4]" />
                    Nenhum produto encontrado
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[#F7F7F7] flex-shrink-0">
                          {p.images[0] ? (
                            <Image
                              src={p.images[0]}
                              alt={p.name}
                              fill
                              className="object-contain p-1"
                            />
                          ) : (
                            <Package
                              size={14}
                              className="absolute inset-0 m-auto text-[#E4E4E4]"
                            />
                          )}
                        </div>
                        <span className="font-medium text-sm line-clamp-1">
                          {p.name}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="text-sm text-[#5C5C5C]">
                        {p.category.name}
                      </span>
                    </td>
                    <td>
                      <span className="text-xs text-[#9C9C9C]">
                        {p.sku || '—'}
                      </span>
                    </td>
                    <td>
                      <span className="font-bold text-sm">{p.stock} un.</span>
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
                        {p.stock === 0
                          ? 'Zerado'
                          : p.stock < 5
                          ? 'Baixo'
                          : 'OK'}
                      </span>
                    </td>
                    <td>
                      <StockEditor productId={p.id} currentStock={p.stock} />
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
