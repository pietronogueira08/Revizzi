import { prisma } from '@/lib/prisma';
import ShippingSettingsForm from './ShippingSettingsForm';

export default async function AdminConfiguracoesPage() {
  let settings: any = null;
  try {
    settings = await (prisma as any).shippingSettings.findFirst();
  } catch {}

  return (
    <div className="space-y-5 max-w-lg">
      <div>
        <h1 className="text-2xl font-bold text-[#0A0A0A]">
          Configurações da Loja
        </h1>
        <p className="text-sm text-[#9C9C9C] mt-1">
          Gerencie frete e outras configurações gerais
        </p>
      </div>

      <ShippingSettingsForm
        currentFreeFrom={
          settings?.freeShippingFrom ? Number(settings.freeShippingFrom) : 199
        }
        currentFlatRate={
          settings?.flatRate ? Number(settings.flatRate) : 25
        }
        settingsId={settings?.id}
      />
    </div>
  );
}
