import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { uploadImage } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'ADMIN')
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file)
      return NextResponse.json({ error: 'Arquivo obrigatório' }, { status: 400 });

    if (!file.type.startsWith('image/'))
      return NextResponse.json(
        { error: 'Apenas imagens são permitidas' },
        { status: 400 }
      );

    if (file.size > 10 * 1024 * 1024)
      return NextResponse.json(
        { error: 'Arquivo muito grande (máx. 10MB)' },
        { status: 400 }
      );

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const result = await uploadImage(buffer);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao fazer upload' }, { status: 500 });
  }
}
