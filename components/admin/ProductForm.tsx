'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, type ProductInput } from '@/lib/validations';
import { generateSlug } from '@/lib/utils';
import Image from 'next/image';
import { Upload, X, Loader2, ImagePlus, GripVertical } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductFormProps {
  categories: Category[];
  defaultValues?: Partial<ProductInput> & { id?: string };
  mode?: 'create' | 'edit';
}

export default function ProductForm({ categories, defaultValues, mode = 'create' }: ProductFormProps) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>(defaultValues?.images || []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      ...defaultValues,
      isActive: defaultValues?.isActive ?? true,
      isFeatured: defaultValues?.isFeatured ?? false,
      images: defaultValues?.images || [],
    },
  });

  const name = watch('name');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue('name', val);
    if (mode === 'create') {
      setValue('slug', generateSlug(val));
    }
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      const newUrls: string[] = [];
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        if (res.ok) {
          const data = await res.json();
          newUrls.push(data.url);
        }
      }
      const updated = [...images, ...newUrls];
      setImages(updated);
      setValue('images', updated);
    } catch {
      setError('Erro ao fazer upload das imagens');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    setValue('images', updated);
  };

  const onSubmit = async (data: any) => {
    setSaving(true);
    setError('');
    try {
      const url = mode === 'edit' && defaultValues?.id
        ? `/api/products/${defaultValues.id}`
        : '/api/products';
      const method = mode === 'edit' ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, images }),
      });

      const result = await res.json();
      if (!res.ok) {
        setError(result.error || 'Erro ao salvar produto');
        return;
      }

      router.push('/admin/produtos');
      router.refresh();
    } catch {
      setError('Erro de conexão');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Images */}
      <div className="bg-white rounded-xl border border-[#E4E4E4] p-6">
        <h3 className="font-700 text-[#0A0A0A] mb-4">Imagens do Produto</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-4">
          {images.map((img, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-[#E4E4E4] group">
              <Image src={img} alt={`Imagem ${i + 1}`} fill className="object-contain p-2" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 w-5 h-5 bg-[#DC2626] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={10} />
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 text-[8px] bg-[#0A0A0A] text-white px-1.5 py-0.5 rounded">
                  Principal
                </span>
              )}
            </div>
          ))}

          {/* Upload button */}
          <label className="aspect-square rounded-xl border-2 border-dashed border-[#E4E4E4] flex flex-col items-center justify-center cursor-pointer hover:border-[#9333EA] hover:bg-[#9333EA08] transition-all">
            {uploading ? (
              <Loader2 size={20} className="text-[#9333EA] animate-spin" />
            ) : (
              <>
                <ImagePlus size={20} className="text-[#9C9C9C]" />
                <span className="text-[10px] text-[#9C9C9C] mt-1">Adicionar</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleImageUpload(e.target.files)}
              disabled={uploading}
            />
          </label>
        </div>
        {errors.images && (
          <p className="text-xs text-[#DC2626]">{errors.images.message}</p>
        )}
        <p className="text-xs text-[#9C9C9C]">
          Formatos: JPG, PNG, WebP. Máximo 10MB por imagem. A primeira imagem é a principal.
        </p>
      </div>

      {/* Basic info */}
      <div className="bg-white rounded-xl border border-[#E4E4E4] p-6">
        <h3 className="font-700 text-[#0A0A0A] mb-4">Informações Básicas</h3>
        <div className="space-y-4">
          <div>
            <label className="label">Nome do Produto *</label>
            <input
              {...register('name')}
              onChange={handleNameChange}
              className="input"
              placeholder="Ex: Óleo Motor Bosch 5W30 1L"
            />
            {errors.name && <p className="text-xs text-[#DC2626] mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="label">Slug (URL) *</label>
            <input {...register('slug')} className="input font-mono text-sm" placeholder="oleo-motor-bosch-5w30" />
            {errors.slug && <p className="text-xs text-[#DC2626] mt-1">{errors.slug.message}</p>}
          </div>

          <div>
            <label className="label">Descrição *</label>
            <textarea
              {...register('description')}
              rows={5}
              className="input resize-none"
              placeholder="Descreva o produto detalhadamente..."
            />
            {errors.description && <p className="text-xs text-[#DC2626] mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <label className="label">Categoria *</label>
            <select {...register('categoryId')} className="input">
              <option value="">Selecione uma categoria</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.categoryId && <p className="text-xs text-[#DC2626] mt-1">{errors.categoryId.message}</p>}
          </div>
        </div>
      </div>

      {/* Pricing & Stock */}
      <div className="bg-white rounded-xl border border-[#E4E4E4] p-6">
        <h3 className="font-700 text-[#0A0A0A] mb-4">Preço e Estoque</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Preço de Venda (R$) *</label>
            <input
              {...register('price', { valueAsNumber: true })}
              type="number" step="0.01" min="0"
              className="input"
              placeholder="99.90"
            />
            {errors.price && <p className="text-xs text-[#DC2626] mt-1">{errors.price.message}</p>}
          </div>
          <div>
            <label className="label">Preço Comparativo (R$)</label>
            <input
              {...register('comparePrice', { valueAsNumber: true })}
              type="number" step="0.01" min="0"
              className="input"
              placeholder="129.90 (aparece riscado)"
            />
          </div>
          <div>
            <label className="label">Estoque *</label>
            <input
              {...register('stock', { valueAsNumber: true })}
              type="number" min="0"
              className="input"
              placeholder="0"
            />
            {errors.stock && <p className="text-xs text-[#DC2626] mt-1">{errors.stock.message}</p>}
          </div>
          <div>
            <label className="label">SKU</label>
            <input {...register('sku')} className="input" placeholder="BOX-5W30-1L" />
          </div>
        </div>
      </div>

      {/* Flags */}
      <div className="bg-white rounded-xl border border-[#E4E4E4] p-6">
        <h3 className="font-700 text-[#0A0A0A] mb-4">Configurações</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input {...register('isActive')} type="checkbox" className="w-4 h-4 rounded accent-[#9333EA]" />
            <div>
              <p className="text-sm font-500">Produto Ativo</p>
              <p className="text-xs text-[#9C9C9C]">Produto visível na loja</p>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input {...register('isFeatured')} type="checkbox" className="w-4 h-4 rounded accent-[#9333EA]" />
            <div>
              <p className="text-sm font-500">Produto em Destaque</p>
              <p className="text-xs text-[#9C9C9C]">Aparece na seção de destaques da Home</p>
            </div>
          </label>
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-3">
        <button type="button" onClick={() => router.back()} className="btn-secondary">
          Cancelar
        </button>
        <button type="submit" disabled={saving || uploading} className="btn-primary">
          {saving ? <><Loader2 size={15} className="animate-spin" /> Salvando...</> : mode === 'edit' ? 'Salvar Alterações' : 'Criar Produto'}
        </button>
      </div>
    </form>
  );
}
