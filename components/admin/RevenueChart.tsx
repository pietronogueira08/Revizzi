'use client';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatPrice } from '@/lib/utils';

interface Props {
  data: { date: string; revenue: number }[];
}

export default function AdminRevenueChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: '#9C9C9C' }}
          tickLine={false}
          axisLine={false}
          interval={4}
        />
        <YAxis
          tick={{ fontSize: 10, fill: '#9C9C9C' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) =>
            `R$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`
          }
        />
        <Tooltip
          formatter={(value: any) => [formatPrice(Number(value)), 'Receita']}
          contentStyle={{
            borderRadius: '8px',
            border: '1px solid #E4E4E4',
            fontSize: '12px',
          }}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#9333EA"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: '#9333EA' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
