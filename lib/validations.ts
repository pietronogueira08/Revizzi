import { z } from 'zod';

// ========================
// PRODUTO
// ========================

export const productSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, 'Slug inválido'),
  description: z.string().min(10, 'Descrição muito curta'),
  price: z.number().positive('Preço deve ser positivo'),
  comparePrice: z.number().positive().optional().nullable(),
  stock: z.number().int().min(0, 'Estoque não pode ser negativo'),
  sku: z.string().optional().nullable(),
  images: z.array(z.string().url()).min(1, 'Adicione ao menos uma imagem'),
  categoryId: z.string().min(1, 'Selecione uma categoria'),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

export type ProductInput = z.infer<typeof productSchema>;

// ========================
// CATEGORIA
// ========================

export const categorySchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, 'Slug inválido'),
  imageUrl: z.string().url().optional().nullable(),
});

// ========================
// ENDEREÇO
// ========================

export const addressSchema = z.object({
  label: z.string().min(1, 'Identificação obrigatória'),
  street: z.string().min(3, 'Rua obrigatória'),
  number: z.string().min(1, 'Número obrigatório'),
  complement: z.string().optional(),
  district: z.string().min(2, 'Bairro obrigatório'),
  city: z.string().min(2, 'Cidade obrigatória'),
  state: z.string().length(2, 'Use a sigla do estado (ex: RJ)'),
  zipCode: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido'),
});

export type AddressInput = z.infer<typeof addressSchema>;

// ========================
// CHECKOUT
// ========================

export const checkoutPersonalSchema = z.object({
  name: z.string().min(3, 'Nome completo obrigatório'),
  email: z.string().email('Email inválido'),
  cpf: z
    .string()
    .regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, 'CPF inválido'),
  phone: z
    .string()
    .regex(/^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/, 'Telefone inválido'),
});

export const checkoutAddressSchema = addressSchema.omit({ label: true });

export type CheckoutPersonalInput = z.infer<typeof checkoutPersonalSchema>;
export type CheckoutAddressInput = z.infer<typeof checkoutAddressSchema>;

// ========================
// CUPOM
// ========================

export const couponSchema = z.object({
  code: z
    .string()
    .min(3)
    .max(20)
    .toUpperCase()
    .regex(/^[A-Z0-9]+$/, 'Apenas letras e números'),
  type: z.enum(['PERCENTAGE', 'FIXED']),
  value: z.number().positive('Valor deve ser positivo'),
  minOrderValue: z.number().positive().optional().nullable(),
  usageLimit: z.number().int().positive().optional().nullable(),
  expiresAt: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type CouponInput = z.infer<typeof couponSchema>;

// ========================
// AUTENTICAÇÃO
// ========================

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export const registerSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não conferem',
  path: ['confirmPassword'],
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
