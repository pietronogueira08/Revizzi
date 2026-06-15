const mockCategories = [
  { id: '1', name: 'Estética', slug: 'estetica' },
  { id: '2', name: 'Performance', slug: 'performance' },
  { id: '3', name: 'Peças', slug: 'pecas' },
  { id: '4', name: 'Ferramentas', slug: 'ferramentas' },
];

const mockProducts = [
  {
    id: 'p1',
    name: 'Kit de Freio Carbono-Cerâmica High Performance',
    slug: 'kit-freio-carbono-ceramica',
    description: 'Pinças vermelhas de corrida com discos ranhurados de carbono-cerâmica. Frenagem extrema para carros esportivos e superesportivos. Alta dissipação de calor.',
    price: 12500.00,
    comparePrice: 15000.00,
    stock: 5,
    sku: 'BRK-CC-001',
    images: ["/products/brake-kit.png"],
    categoryId: '2',
    category: mockCategories[1],
    isFeatured: true,
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: 'p2',
    name: 'Suspensão Coilover Pro Ajustável',
    slug: 'suspensao-coilover-pro',
    description: 'Sistema de suspensão coilover premium, amortecedores com regulagem de altura e rigidez. Construído em alumínio anodizado vermelho.',
    price: 8900.00,
    comparePrice: null,
    stock: 12,
    sku: 'COIL-PRO-002',
    images: ["/products/coilover.png"],
    categoryId: '2',
    category: mockCategories[1],
    isFeatured: true,
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: 'p3',
    name: 'Sistema de Escapamento em Titânio Sport',
    slug: 'escapamento-titanium-sport',
    description: 'Escapamento esportivo completo em titânio com ponteiras burnt blue. Redução de peso significativa e som extremamente agressivo.',
    price: 18000.00,
    comparePrice: 20000.00,
    stock: 2,
    sku: 'EXH-TIT-003',
    images: ["/products/exhaust.png"],
    categoryId: '3',
    category: mockCategories[2],
    isFeatured: true,
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: 'p4',
    name: 'Vitrificador Ceramic Coating 9H Pro',
    slug: 'vitrificador-ceramic-coating',
    description: 'Proteção extrema para a pintura do seu carro. Dureza 9H real com durabilidade de até 3 anos. Brilho espelhado e hidrofobia avançada.',
    price: 350.00,
    comparePrice: 420.00,
    stock: 50,
    sku: 'CER-COAT-004',
    images: ["/products/ceramic-coating.png"],
    categoryId: '1',
    category: mockCategories[0],
    isFeatured: true,
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: 'p5',
    name: 'Politriz Roto-Orbital Dupla Ação Premium',
    slug: 'politriz-dupla-acao-premium',
    description: 'Máquina de polir profissional com design ergonômico. Controle de velocidade suave, ideal para polimento técnico e acabamento perfeito.',
    price: 1250.00,
    comparePrice: null,
    stock: 15,
    sku: 'POL-DA-005',
    images: ["/products/polisher.png"],
    categoryId: '4',
    category: mockCategories[3],
    isFeatured: true,
    isActive: true,
    createdAt: new Date(),
  }
];

declare global {
  // eslint-disable-next-line no-var
  var _mockDb: any;
}

if (!globalThis._mockDb) {
  globalThis._mockDb = {
    products: [...mockProducts],
    categories: [...mockCategories]
  };
}

export const prisma = {
  product: {
    findMany: async (options?: any) => {
      let result = [...globalThis._mockDb.products];
      if (options?.where?.isFeatured) {
        result = result.filter(p => p.isFeatured);
      }
      return result;
    },
    findUnique: async (options: any) => {
      if (options?.where?.slug) {
        return globalThis._mockDb.products.find((p: any) => p.slug === options.where.slug) || null;
      }
      if (options?.where?.id) {
        return globalThis._mockDb.products.find((p: any) => p.id === options.where.id) || null;
      }
      return null;
    },
    create: async (options: any) => {
      const newProduct = {
        ...options.data,
        id: 'p' + Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
        category: globalThis._mockDb.categories.find((c: any) => c.id === options.data.categoryId)
      };
      globalThis._mockDb.products.unshift(newProduct);
      return newProduct;
    },
    update: async (options: any) => {
      const idx = globalThis._mockDb.products.findIndex((p: any) => p.id === options.where.id);
      if (idx > -1) {
        globalThis._mockDb.products[idx] = { ...globalThis._mockDb.products[idx], ...options.data };
        return globalThis._mockDb.products[idx];
      }
      throw new Error("Not found");
    },
    delete: async (options: any) => {
      const idx = globalThis._mockDb.products.findIndex((p: any) => p.id === options.where.id);
      if (idx > -1) {
        const deleted = globalThis._mockDb.products[idx];
        globalThis._mockDb.products.splice(idx, 1);
        return deleted;
      }
      throw new Error("Not found");
    },
    count: async () => globalThis._mockDb.products.length,
  },
  category: {
    findMany: async () => globalThis._mockDb.categories,
  },
  user: {
    findUnique: async () => null,
  }
} as any;
