import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Row,
  Column,
  Text,
  Img,
  Hr,
  Link,
} from '@react-email/components';

interface OrderItem {
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
  image?: string;
}

interface OrderConfirmationEmailProps {
  orderNumber: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  shippingAddress: {
    street: string;
    number: string;
    complement?: string;
    district: string;
    city: string;
    state: string;
    zipCode: string;
  };
  orderUrl: string;
}

function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function OrderConfirmationEmail({
  orderNumber,
  customerName,
  items,
  subtotal,
  shippingCost,
  discount,
  total,
  shippingAddress,
  orderUrl,
}: OrderConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Seu pedido #{orderNumber} foi confirmado na Revizzi!</Preview>
      <Body style={{ backgroundColor: '#F7F7F7', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <Container style={{ maxWidth: '580px', margin: '0 auto', padding: '24px 0' }}>
          {/* Header */}
          <Section
            style={{
              background: 'linear-gradient(135deg, #0A0A0A, #1a1a1a)',
              borderRadius: '16px 16px 0 0',
              padding: '32px 40px',
              textAlign: 'center',
            }}
          >
            <Text
              style={{
                fontSize: '28px',
                fontWeight: '700',
                color: 'white',
                letterSpacing: '2px',
                margin: '0',
              }}
            >
              REVIZZI
            </Text>
            <Text style={{ fontSize: '11px', color: '#6B6B6B', letterSpacing: '3px', margin: '4px 0 0' }}>
              CENTRO AUTOMOTIVO
            </Text>
          </Section>

          {/* Body */}
          <Section
            style={{
              backgroundColor: 'white',
              padding: '40px',
              borderLeft: '1px solid #E4E4E4',
              borderRight: '1px solid #E4E4E4',
            }}
          >
            {/* Confirmation */}
            <Text style={{ textAlign: 'center', margin: '0 0 8px' }}>
              <span style={{ fontSize: '48px' }}>✅</span>
            </Text>
            <Text
              style={{
                fontSize: '22px',
                fontWeight: '700',
                color: '#0A0A0A',
                textAlign: 'center',
                margin: '0 0 8px',
              }}
            >
              Pedido Confirmado!
            </Text>
            <Text
              style={{
                fontSize: '14px',
                color: '#5C5C5C',
                textAlign: 'center',
                margin: '0 0 24px',
              }}
            >
              Olá, {customerName}! Seu pedido foi recebido e está sendo processado.
            </Text>

            <Section
              style={{
                background: 'linear-gradient(135deg, #9333EA15, #D9770615)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '24px',
                textAlign: 'center',
              }}
            >
              <Text style={{ margin: '0', fontSize: '12px', color: '#9C9C9C' }}>Número do Pedido</Text>
              <Text style={{ margin: '4px 0 0', fontSize: '20px', fontWeight: '700', color: '#9333EA' }}>
                #{orderNumber}
              </Text>
            </Section>

            {/* Items */}
            <Text style={{ fontSize: '16px', fontWeight: '700', color: '#0A0A0A', margin: '0 0 12px' }}>
              Itens do Pedido
            </Text>
            {items.map((item, i) => (
              <Section
                key={i}
                style={{
                  borderBottom: '1px solid #F0F0F0',
                  paddingBottom: '12px',
                  marginBottom: '12px',
                }}
              >
                <Text style={{ margin: '0', fontSize: '14px', fontWeight: '500', color: '#0A0A0A' }}>
                  {item.name}
                </Text>
                <Text style={{ margin: '4px 0 0', fontSize: '12px', color: '#9C9C9C' }}>
                  x{item.quantity} × {formatBRL(item.unitPrice)}
                </Text>
                <Text style={{ margin: '4px 0 0', fontSize: '14px', fontWeight: '700', color: '#0A0A0A', float: 'right' }}>
                  {formatBRL(item.total)}
                </Text>
              </Section>
            ))}

            {/* Totals */}
            <Hr style={{ borderColor: '#E4E4E4', margin: '20px 0' }} />
            <Row>
              <Column><Text style={{ margin: '0', fontSize: '13px', color: '#5C5C5C' }}>Subtotal</Text></Column>
              <Column style={{ textAlign: 'right' }}><Text style={{ margin: '0', fontSize: '13px', color: '#5C5C5C' }}>{formatBRL(subtotal)}</Text></Column>
            </Row>
            {discount > 0 && (
              <Row>
                <Column><Text style={{ margin: '4px 0 0', fontSize: '13px', color: '#16A34A' }}>Desconto</Text></Column>
                <Column style={{ textAlign: 'right' }}><Text style={{ margin: '4px 0 0', fontSize: '13px', color: '#16A34A' }}>-{formatBRL(discount)}</Text></Column>
              </Row>
            )}
            <Row>
              <Column><Text style={{ margin: '4px 0 0', fontSize: '13px', color: '#5C5C5C' }}>Frete</Text></Column>
              <Column style={{ textAlign: 'right' }}><Text style={{ margin: '4px 0 0', fontSize: '13px', color: '#5C5C5C' }}>{shippingCost === 0 ? 'Grátis' : formatBRL(shippingCost)}</Text></Column>
            </Row>
            <Hr style={{ borderColor: '#E4E4E4', margin: '12px 0' }} />
            <Row>
              <Column><Text style={{ margin: '0', fontSize: '16px', fontWeight: '700', color: '#0A0A0A' }}>Total</Text></Column>
              <Column style={{ textAlign: 'right' }}><Text style={{ margin: '0', fontSize: '16px', fontWeight: '700', color: '#0A0A0A' }}>{formatBRL(total)}</Text></Column>
            </Row>

            {/* Shipping */}
            <Hr style={{ borderColor: '#E4E4E4', margin: '24px 0 16px' }} />
            <Text style={{ fontSize: '14px', fontWeight: '700', color: '#0A0A0A', margin: '0 0 8px' }}>
              📦 Endereço de Entrega
            </Text>
            <Text style={{ fontSize: '13px', color: '#5C5C5C', margin: '0', lineHeight: '1.6' }}>
              {shippingAddress.street}, {shippingAddress.number}
              {shippingAddress.complement ? `, ${shippingAddress.complement}` : ''}<br />
              {shippingAddress.district} — {shippingAddress.city}/{shippingAddress.state}<br />
              CEP: {shippingAddress.zipCode}
            </Text>

            {/* CTA */}
            <Section style={{ textAlign: 'center', marginTop: '32px' }}>
              <Link
                href={orderUrl}
                style={{
                  display: 'inline-block',
                  padding: '14px 32px',
                  background: 'linear-gradient(135deg, #9333EA, #D97706)',
                  color: 'white',
                  fontWeight: '700',
                  fontSize: '14px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                }}
              >
                Ver Status do Pedido
              </Link>
            </Section>
          </Section>

          {/* Footer */}
          <Section
            style={{
              background: '#0A0A0A',
              borderRadius: '0 0 16px 16px',
              padding: '24px 40px',
              textAlign: 'center',
            }}
          >
            <Text style={{ fontSize: '12px', color: '#6B6B6B', margin: '0' }}>
              Revizzi Centro Automotivo<br />
              Av. Genecy Mendonça, 10 — Bairro de Fátima, São João da Barra – RJ
            </Text>
            <Text style={{ fontSize: '11px', color: '#4B4B4B', margin: '8px 0 0' }}>
              Você recebeu este email porque realizou uma compra na Revizzi.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
