const mockCategories = [
  { id: '1', name: 'Polimento', slug: 'polimento' },
  { id: '2', name: 'Lavagem', slug: 'lavagem' },
  { id: '3', name: 'Proteção', slug: 'protecao' },
  { id: '4', name: 'Vitrificação', slug: 'vitrificacao' },
  { id: '5', name: 'Detalhamento', slug: 'detalhamento' },
  { id: '6', name: 'Ferramentas', slug: 'ferramentas' },
];

const mockProducts = [
  {
    id: 'p1',
    name: 'Cera de Carnaúba Premium Meguiar\'s Gold Class',
    slug: 'cera-carnauba-meguiars-gold-class',
    description: 'A cera de carnaúba Gold Class da Meguiar\'s oferece proteção duradoura e brilho profundo tipo espelho. Fácil de aplicar e remover, deixa a pintura com acabamento premium e camada protetora contra UV.',
    price: 189.90,
    comparePrice: 229.90,
    stock: 45,
    sku: 'MEG-GC-001',
    images: ['/products/cera-carnauba.png'],
    categoryId: '1',
    category: { id: '1', name: 'Polimento', slug: 'polimento' },
    isFeatured: true,
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: 'p2',
    name: 'Vitrificador Ceramic Coating 9H Pro Vonixx',
    slug: 'vitrificador-ceramic-coating-9h-vonixx',
    description: 'Proteção extrema para a pintura do seu carro. Dureza 9H real com durabilidade de até 3 anos. Brilho espelhado e hidrofobia avançada. Repele sujeira, água e raios UV.',
    price: 349.90,
    comparePrice: 419.90,
    stock: 30,
    sku: 'VON-CC9H-002',
    images: ['/products/ceramic-coating.png'],
    categoryId: '4',
    category: { id: '4', name: 'Vitrificação', slug: 'vitrificacao' },
    isFeatured: true,
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: 'p3',
    name: 'Shampoo Automotivo Neutro 5L Koch-Chemie',
    slug: 'shampoo-automotivo-neutro-5l-koch-chemie',
    description: 'Shampoo neutro concentrado de alta performance. Remove sujeiras sem agredir a pintura ou ceras aplicadas. Produz espuma densa e facilita a lavagem segura do veículo.',
    price: 79.90,
    comparePrice: null,
    stock: 80,
    sku: 'KOC-SH5L-003',
    images: ['/products/shampoo-automotivo.png'],
    categoryId: '2',
    category: { id: '2', name: 'Lavagem', slug: 'lavagem' },
    isFeatured: true,
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: 'p4',
    name: 'Politriz Roto-Orbital Dupla Ação 5" Vonixx',
    slug: 'politriz-roto-orbital-dupla-acao-vonixx',
    description: 'Máquina de polir profissional com dupla ação para polimento sem risco de queimar a pintura. Controle de velocidade variável, design ergonômico e ideal para iniciantes e profissionais.',
    price: 1249.90,
    comparePrice: null,
    stock: 15,
    sku: 'VON-POL-004',
    images: ['/products/polisher.png'],
    categoryId: '6',
    category: { id: '6', name: 'Ferramentas', slug: 'ferramentas' },
    isFeatured: true,
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: 'p5',
    name: 'Kit Descontaminação Ferrosa Sonax',
    slug: 'kit-descontaminacao-ferrosa-sonax',
    description: 'Kit completo com removedor de contaminação ferrosa e clay bar. Elimina partículas metálicas incrustadas na pintura, deixando a superfície suave e preparada para receber proteção.',
    price: 159.90,
    comparePrice: 199.90,
    stock: 25,
    sku: 'SON-KIT-005',
    images: ['/products/descontaminacao.png'],
    categoryId: '5',
    category: { id: '5', name: 'Detalhamento', slug: 'detalhamento' },
    isFeatured: true,
    isActive: true,
    createdAt: new Date(),
  }
];

declare global {
  // eslint-disable-next-line no-var
  var _mockDbV2: any;
}

if (!globalThis._mockDbV2) {
  globalThis._mockDbV2 = {
    products: [...mockProducts],
    categories: [...mockCategories]
  };
}

export const prisma = {
  product: {
    findMany: async (options?: any) => {
      let result = [...globalThis._mockDbV2.products];
      if (options?.where?.isFeatured) {
        result = result.filter(p => p.isFeatured);
      }
      return result;
    },
    findUnique: async (options: any) => {
      if (options?.where?.slug) {
        return globalThis._mockDbV2.products.find((p: any) => p.slug === options.where.slug) || null;
      }
      if (options?.where?.id) {
        return globalThis._mockDbV2.products.find((p: any) => p.id === options.where.id) || null;
      }
      return null;
    },
    create: async (options: any) => {
      const newProduct = {
        ...options.data,
        id: 'p' + Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
        category: globalThis._mockDbV2.categories.find((c: any) => c.id === options.data.categoryId)
      };
      globalThis._mockDbV2.products.unshift(newProduct);
      return newProduct;
    },
    update: async (options: any) => {
      const idx = globalThis._mockDbV2.products.findIndex((p: any) => p.id === options.where.id);
      if (idx > -1) {
        globalThis._mockDbV2.products[idx] = { ...globalThis._mockDbV2.products[idx], ...options.data };
        return globalThis._mockDbV2.products[idx];
      }
      throw new Error("Not found");
    },
    delete: async (options: any) => {
      const idx = globalThis._mockDbV2.products.findIndex((p: any) => p.id === options.where.id);
      if (idx > -1) {
        const deleted = globalThis._mockDbV2.products[idx];
        globalThis._mockDbV2.products.splice(idx, 1);
        return deleted;
      }
      throw new Error("Not found");
    },
    count: async () => globalThis._mockDbV2.products.length,
  },
  category: {
    findMany: async (options?: any) => {
      const categories = [...globalThis._mockDbV2.categories];
      if (options?.include?._count) {
        return categories.map(c => ({
          ...c,
          _count: {
            products: globalThis._mockDbV2.products.filter((p: any) => p.categoryId === c.id).length
          }
        }));
      }
      return categories;
    },
  },
  user: {
    findUnique: async () => null,
  }
} as any;
