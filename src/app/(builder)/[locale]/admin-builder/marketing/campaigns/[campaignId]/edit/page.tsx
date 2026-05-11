import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { normalizeLocale } from '@/lib/locales';
import { getCampaign } from '@/lib/builder/marketing/campaign-storage';
import MarketingNav from '@/components/builder/marketing/MarketingNav';
import CampaignEditor from '@/components/builder/marketing/CampaignEditor';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Edit Campaign',
  robots: { index: false, follow: false },
};

export default async function CampaignEditPage({
  params,
}: {
  params: { locale: string; campaignId: string };
}) {
  const locale = normalizeLocale(params.locale);
  const campaign = await getCampaign(params.campaignId);
  if (!campaign) {
    notFound();
  }
  return (
    <main>
      <MarketingNav locale={locale} active="campaigns" />
      <CampaignEditor campaign={campaign} />
    </main>
  );
}
