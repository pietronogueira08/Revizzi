import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { productSchema } from '@/lib/validations';
import { generateSlug } from '@/lib/utils';

const ITEMS_PER_PAGE = 16;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const inStock = searchParams.get('inStock');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sort = searchParams.get('sort') || 'newest';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || String(ITEMS_PER_PAGE));
    const skip = (page - 1) * limit;

    const where: any = { isActive: true };
    if (search) where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { sku: { contains: search, mode: 'insensitive' } },
    ];
    if (category) where.category = { slug: category };
    if (featured === 'true') where.isFeatured = true;
    if (inStock === 'true') where.stock = { gt: 0 };
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    const orderBy: any =
      sort === 'price_asc'
        ? { price: 'asc' }
        : sort === 'price_desc'
        ? { price: 'desc' }
        : { createdAt: 'desc' };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: { category: true },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao buscar produtos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    const body = await request.json();
    const data = productSchema.parse(body);
    const slug = data.slug || generateSlug(data.name);
    const product = await prisma.product.create({
      data: {
        ...data,
        slug,
        price: data.price,
        comparePrice: data.comparePrice || null,
      },
      include: { category: true },
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError')
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    if (error.code === 'P2002')
      return NextResponse.json({ error: 'SKU ou slug já existente' }, { status: 409 });
    console.error(error);
    return NextResponse.json({ error: 'Erro ao criar produto' }, { status: 500 });
  }
}
