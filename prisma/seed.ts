// @ts-nocheck
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Categorias de Estética Automotiva
  const catPolimento = await prisma.category.upsert({
    where: { slug: 'polimento' },
    update: {},
    create: { name: 'Polimento', slug: 'polimento' },
  });

  const catLavagem = await prisma.category.upsert({
    where: { slug: 'lavagem' },
    update: {},
    create: { name: 'Lavagem', slug: 'lavagem' },
  });

  const catProtecao = await prisma.category.upsert({
    where: { slug: 'protecao' },
    update: {},
    create: { name: 'Proteção', slug: 'protecao' },
  });

  const catVitrificacao = await prisma.category.upsert({
    where: { slug: 'vitrificacao' },
    update: {},
    create: { name: 'Vitrificação', slug: 'vitrificacao' },
  });

  const catDetalhamento = await prisma.category.upsert({
    where: { slug: 'detalhamento' },
    update: {},
    create: { name: 'Detalhamento', slug: 'detalhamento' },
  });

  const catFerramentas = await prisma.category.upsert({
    where: { slug: 'ferramentas' },
    update: {},
    create: { name: 'Ferramentas', slug: 'ferramentas' },
  });

  // Produtos de Estética Automotiva
  await prisma.product.upsert({
    where: { slug: 'cera-carnauba-meguiars-gold-class' },
    update: {},
    create: {
      name: "Cera de Carnaúba Premium Meguiar's Gold Class",
      slug: 'cera-carnauba-meguiars-gold-class',
      description: "A cera de carnaúba Gold Class da Meguiar's oferece proteção duradoura e brilho profundo tipo espelho. Fácil de aplicar e remover, deixa a pintura com acabamento premium e camada protetora contra UV.",
      price: 189.90,
      comparePrice: 229.90,
      stock: 45,
      sku: 'MEG-GC-001',
      images: ['/products/cera-carnauba.png'],
      categoryId: catPolimento.id,
      isFeatured: true,
      isActive: true,
    },
  });

  await prisma.product.upsert({
    where: { slug: 'vitrificador-ceramic-coating-9h-vonixx' },
    update: {},
    create: {
      name: 'Vitrificador Ceramic Coating 9H Pro Vonixx',
      slug: 'vitrificador-ceramic-coating-9h-vonixx',
      description: 'Proteção extrema para a pintura do seu carro. Dureza 9H real com durabilidade de até 3 anos. Brilho espelhado e hidrofobia avançada. Repele sujeira, água e raios UV.',
      price: 349.90,
      comparePrice: 419.90,
      stock: 30,
      sku: 'VON-CC9H-002',
      images: ['/products/ceramic-coating.png'],
      categoryId: catVitrificacao.id,
      isFeatured: true,
      isActive: true,
    },
  });

  await prisma.product.upsert({
    where: { slug: 'shampoo-automotivo-neutro-5l-koch-chemie' },
    update: {},
    create: {
      name: 'Shampoo Automotivo Neutro 5L Koch-Chemie',
      slug: 'shampoo-automotivo-neutro-5l-koch-chemie',
      description: 'Shampoo neutro concentrado de alta performance. Remove sujeiras sem agredir a pintura ou ceras aplicadas. Produz espuma densa e facilita a lavagem segura do veículo.',
      price: 79.90,
      comparePrice: null,
      stock: 80,
      sku: 'KOC-SH5L-003',
      images: ['/products/shampoo-automotivo.png'],
      categoryId: catLavagem.id,
      isFeatured: true,
      isActive: true,
    },
  });

  await prisma.product.upsert({
    where: { slug: 'politriz-roto-orbital-dupla-acao-vonixx' },
    update: {},
    create: {
      name: 'Politriz Roto-Orbital Dupla Ação 5" Vonixx',
      slug: 'politriz-roto-orbital-dupla-acao-vonixx',
      description: 'Máquina de polir profissional com dupla ação para polimento sem risco de queimar a pintura. Controle de velocidade variável, design ergonômico e ideal para iniciantes e profissionais.',
      price: 1249.90,
      comparePrice: null,
      stock: 15,
      sku: 'VON-POL-004',
      images: ['/products/polisher.png'],
      categoryId: catFerramentas.id,
      isFeatured: true,
      isActive: true,
    },
  });

  await prisma.product.upsert({
    where: { slug: 'kit-descontaminacao-ferrosa-sonax' },
    update: {},
    create: {
      name: 'Kit Descontaminação Ferrosa Sonax',
      slug: 'kit-descontaminacao-ferrosa-sonax',
      description: 'Kit completo com removedor de contaminação ferrosa e clay bar. Elimina partículas metálicas incrustadas na pintura, deixando a superfície suave e preparada para receber proteção.',
      price: 159.90,
      comparePrice: 199.90,
      stock: 25,
      sku: 'SON-KIT-005',
      images: ['/products/descontaminacao.png'],
      categoryId: catDetalhamento.id,
      isFeatured: true,
      isActive: true,
    },
  });

  console.log('Seed de estética automotiva completado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
