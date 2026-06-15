import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Merge Tailwind classes safely
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format price to BRL
export function formatPrice(value: number | string | null | undefined): string {
  const num = typeof value === 'string' ? parseFloat(value) : (value ?? 0);
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(num);
}

// Generate slug from string
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Format CEP
export function formatCEP(cep: string): string {
  return cep.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2');
}

// Format CPF
export function formatCPF(cpf: string): string {
  return cpf
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// Format phone
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 11) {
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
}

// Calculate discount percentage
export function discountPercent(
  price: number,
  comparePrice: number | null | undefined
): number | null {
  if (!comparePrice || comparePrice <= price) return null;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
}

// Truncate text
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

// Stock badge label
export function stockLabel(stock: number): {
  label: string;
  variant: 'success' | 'warning' | 'danger';
} {
  if (stock === 0) return { label: 'Sem estoque', variant: 'danger' };
  if (stock <= 5) return { label: 'Últimas unidades', variant: 'warning' };
  return { label: 'Em estoque', variant: 'success' };
}

// Order status labels
export const orderStatusLabels: Record<string, { label: string; color: string }> = {
  PENDING:    { label: 'Aguardando',   color: '#D97706' },
  PAID:       { label: 'Pago',         color: '#16A34A' },
  PROCESSING: { label: 'Processando',  color: '#0284C7' },
  SHIPPED:    { label: 'Enviado',      color: '#9333EA' },
  DELIVERED:  { label: 'Entregue',     color: '#16A34A' },
  CANCELLED:  { label: 'Cancelado',    color: '#DC2626' },
  REFUNDED:   { label: 'Reembolsado',  color: '#6B7280' },
};

// Relative date
export function relativeDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'agora mesmo';
  if (minutes < 60) return `${minutes}min atrás`;
  if (hours < 24) return `${hours}h atrás`;
  if (days < 7) return `${days}d atrás`;
  return d.toLocaleDateString('pt-BR');
}

// Format date
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
