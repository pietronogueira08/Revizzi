'use client';
import { useRouter } from 'next/navigation';

interface Props {
  couponId: string;
  isActive: boolean;
}

export default function CouponToggle({ couponId, isActive }: Props) {
  const router = useRouter();

  const toggle = async () => {
    await fetch(`/api/coupons/${couponId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !isActive }),
    });
    router.refresh();
  };

  return (
    <button
      onClick={toggle}
      className={`badge text-[10px] cursor-pointer transition-opacity hover:opacity-80 ${
        isActive ? 'badge-danger' : 'badge-success'
      }`}
    >
      {isActive ? 'Desativar' : 'Ativar'}
    </button>
  );
}
