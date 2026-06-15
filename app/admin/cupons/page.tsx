import { prisma } from '@/lib/prisma';
import { formatPrice, formatDate } from '@/lib/utils';
import CouponCreateForm from './CouponCreateForm';
import CouponToggle from './CouponToggle';

export default async function AdminCuponsPage() {
  let coupons: any[] = [];
  try {
    coupons = await (prisma as any).coupon.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { orders: true } } },
    });
  } catch {}

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-[#0A0A0A]">Cupões e Promoções</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create form */}
        <div className="lg:col-span-1">
          <CouponCreateForm />
        </div>

        {/* List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-[#E4E4E4] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E4E4E4]">
              <h2 className="font-bold">Cupões Cadastrados</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Tipo</th>
                    <th>Valor</th>
                    <th>Usos</th>
                    <th>Validade</th>
                    <th>Status</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-8 text-sm text-[#9C9C9C]"
                      >
                        Nenhum cupão cadastrado
                      </td>
                    </tr>
                  ) : (
                    coupons.map((c: any) => {
                      const expired =
                        c.expiresAt && new Date(c.expiresAt) < new Date();
                      const exhausted =
                        c.usageLimit && c.usedCount >= c.usageLimit;
                      return (
                        <tr key={c.id}>
                          <td>
                            <span
                              className="font-bold text-sm tracking-wider"
                              style={{ color: '#9333EA' }}
                            >
                              {c.code}
                            </span>
                          </td>
                          <td>
                            <span className="text-sm text-[#5C5C5C]">
                              {c.type === 'PERCENTAGE'
                                ? 'Porcentagem'
                                : 'Fixo'}
                            </span>
                          </td>
                          <td>
                            <span className="font-semibold text-sm">
                              {c.type === 'PERCENTAGE'
                                ? `${c.value}%`
                                : formatPrice(Number(c.value))}
                            </span>
                          </td>
                          <td>
                            <span className="text-sm text-[#5C5C5C]">
                              {c.usedCount}
                              {c.usageLimit ? `/${c.usageLimit}` : ''}
                            </span>
                          </td>
                          <td>
                            <span className="text-xs text-[#9C9C9C]">
                              {c.expiresAt ? formatDate(c.expiresAt) : '—'}
                            </span>
                          </td>
                          <td>
                            {expired ? (
                              <span className="badge badge-danger text-[10px]">
                                Expirado
                              </span>
                            ) : exhausted ? (
                              <span className="badge badge-neutral text-[10px]">
                                Esgotado
                              </span>
                            ) : c.isActive ? (
                              <span className="badge badge-success text-[10px]">
                                Ativo
                              </span>
                            ) : (
                              <span className="badge badge-neutral text-[10px]">
                                Inativo
                              </span>
                            )}
                          </td>
                          <td>
                            <CouponToggle
                              couponId={c.id}
                              isActive={c.isActive}
                            />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
