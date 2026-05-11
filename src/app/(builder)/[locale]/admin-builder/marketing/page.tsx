import type { Metadata } from 'next';
import { normalizeLocale } from '@/lib/locales';
import { listCampaigns } from '@/lib/builder/marketing/campaign-storage';
import MarketingNav from '@/components/builder/marketing/MarketingNav';
import CampaignsAdmin from '@/components/builder/marketing/CampaignsAdmin';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Email Marketing',
  robots: { index: false, follow: false },
};

export default async function MarketingCampaignsPage({ params }: { params: { locale: string } }) {
  const locale = normalizeLocale(params.locale);
  const campaigns = await listCampaigns();
  return (
    <main>
      <MarketingNav locale={locale} active="campaigns" />
      <CampaignsAdmin initialCampaigns={campaigns} locale={locale} />
    </main>
  );
}
