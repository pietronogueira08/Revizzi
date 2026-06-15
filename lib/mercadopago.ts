import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export const mpClient = client;

export interface OrderPayload {
  id: string;
  customerName: string;
  customerEmail: string;
  items: {
    productId: string;
    name: string;
    quantity: number;
    unitPrice: number;
  }[];
  shippingCost: number;
  discount: number;
}

export async function createPreference(order: OrderPayload) {
  const preference = new Preference(client);

  const allItems = [
    ...order.items.map((item) => ({
      id: item.productId,
      title: item.name,
      quantity: item.quantity,
      unit_price: Number(item.unitPrice),
      currency_id: 'BRL',
    })),
  ];

  if (order.shippingCost > 0) {
    allItems.push({
      id: 'frete',
      title: 'Frete',
      quantity: 1,
      unit_price: order.shippingCost,
      currency_id: 'BRL',
    });
  }

  return await preference.create({
    body: {
      items: allItems,
      payer: {
        name: order.customerName,
        email: order.customerEmail,
      },
      payment_methods: {
        installments: 12,
        default_payment_method_id: 'pix',
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_URL}/pedido/${order.id}?status=success`,
        failure: `${process.env.NEXT_PUBLIC_URL}/pedido/${order.id}?status=failure`,
        pending: `${process.env.NEXT_PUBLIC_URL}/pedido/${order.id}?status=pending`,
      },
      auto_return: 'approved',
      notification_url: `${process.env.NEXT_PUBLIC_URL}/api/webhooks/mercadopago`,
      external_reference: order.id,
    },
  });
}

export async function getPayment(paymentId: string) {
  const payment = new Payment(client);
  return await payment.get({ id: paymentId });
}
