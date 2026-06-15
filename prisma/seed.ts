import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Categorias
  const catEstetica = await prisma.category.upsert({
    where: { slug: 'estetica' },
    update: {},
    create: { name: 'Estética', slug: 'estetica' },
  });

  const catPerformance = await prisma.category.upsert({
    where: { slug: 'performance' },
    update: {},
    create: { name: 'Performance', slug: 'performance' },
  });

  const catPecas = await prisma.category.upsert({
    where: { slug: 'pecas' },
    update: {},
    create: { name: 'Peças', slug: 'pecas' },
  });

  const catFerramentas = await prisma.category.upsert({
    where: { slug: 'ferramentas' },
    update: {},
    create: { name: 'Ferramentas', slug: 'ferramentas' },
  });

  // Produtos
  await prisma.product.upsert({
    where: { slug: 'kit-freio-carbono-ceramica' },
    update: {},
    create: {
      name: 'Kit de Freio Carbono-Cerâmica High Performance',
      slug: 'kit-freio-carbono-ceramica',
      description: 'Pinças vermelhas de corrida com discos ranhurados de carbono-cerâmica. Frenagem extrema para carros esportivos e superesportivos. Alta dissipação de calor.',
      price: 12500.00,
      comparePrice: 15000.00,
      stock: 5,
      sku: 'BRK-CC-001',
      images: JSON.stringify(['/products/brake-kit.png']),
      categoryId: catPerformance.id,
      isFeatured: true,
      isActive: true,
    },
  });

  await prisma.product.upsert({
    where: { slug: 'suspensao-coilover-pro' },
    update: {},
    create: {
      name: 'Suspensão Coilover Pro Ajustável',
      slug: 'suspensao-coilover-pro',
      description: 'Sistema de suspensão coilover premium, amortecedores com regulagem de altura e rigidez. Construído em alumínio anodizado vermelho.',
      price: 8900.00,
      comparePrice: null,
      stock: 12,
      sku: 'COIL-PRO-002',
      images: JSON.stringify(['/products/coilover.png']),
      categoryId: catPerformance.id,
      isFeatured: true,
      isActive: true,
    },
  });

  await prisma.product.upsert({
    where: { slug: 'escapamento-titanium-sport' },
    update: {},
    create: {
      name: 'Sistema de Escapamento em Titânio Sport',
      slug: 'escapamento-titanium-sport',
      description: 'Escapamento esportivo completo em titânio com ponteiras burnt blue. Redução de peso significativa e som extremamente agressivo.',
      price: 18000.00,
      comparePrice: 20000.00,
      stock: 2,
      sku: 'EXH-TIT-003',
      images: JSON.stringify(['/products/exhaust.png']),
      categoryId: catPecas.id,
      isFeatured: true,
      isActive: true,
    },
  });

  await prisma.product.upsert({
    where: { slug: 'vitrificador-ceramic-coating' },
    update: {},
    create: {
      name: 'Vitrificador Ceramic Coating 9H Pro',
      slug: 'vitrificador-ceramic-coating',
      description: 'Proteção extrema para a pintura do seu carro. Dureza 9H real com durabilidade de até 3 anos. Brilho espelhado e hidrofobia avançada.',
      price: 350.00,
      comparePrice: 420.00,
      stock: 50,
      sku: 'CER-COAT-004',
      images: JSON.stringify(['/products/ceramic-coating.png']),
      categoryId: catEstetica.id,
      isFeatured: true,
      isActive: true,
    },
  });

  await prisma.product.upsert({
    where: { slug: 'politriz-dupla-acao-premium' },
    update: {},
    create: {
      name: 'Politriz Roto-Orbital Dupla Ação Premium',
      slug: 'politriz-dupla-acao-premium',
      description: 'Máquina de polir profissional com design ergonômico. Controle de velocidade suave, ideal para polimento técnico e acabamento perfeito.',
      price: 1250.00,
      comparePrice: null,
      stock: 15,
      sku: 'POL-DA-005',
      images: JSON.stringify(['/products/polisher.png']),
      categoryId: catFerramentas.id,
      isFeatured: true,
      isActive: true,
    },
  });

  console.log('Seed completado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
