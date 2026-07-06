import type { Metadata } from 'next';
import { normalizeLocale } from '@/lib/locales';
import { listCampaigns } from '@/lib/builder/marketing/campaign-storage';
import { buildMarketingDeliverabilityReport } from '@/lib/builder/marketing/deliverability';
import MarketingNav from '@/components/builder/marketing/MarketingNav';
import CampaignsAdmin from '@/components/builder/marketing/CampaignsAdmin';
import DeliverabilityPanel from '@/components/builder/marketing/DeliverabilityPanel';

export const dynamic = 'force-dynamic';

const copy = {
  ko: { title: '이메일 마케팅' },
  'zh-hant': { title: '電子郵件行銷' },
  en: { title: 'Email Marketing' },
} as const;

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = normalizeLocale(params.locale);
  return {
    title: copy[locale].title,
    robots: { index: false, follow: false },
  };
};

export default async function MarketingCampaignsPage({ params }: { params: { locale: string } }) {
  const locale = normalizeLocale(params.locale);
  const campaigns = await listCampaigns();
  const deliverabilityReport = buildMarketingDeliverabilityReport();
  return (
    <main>
      <MarketingNav locale={locale} active="campaigns" />
      <div style={{ padding: '24px 24px 0' }}>
        <DeliverabilityPanel locale={locale} initialReport={deliverabilityReport} />
      </div>
      <CampaignsAdmin initialCampaigns={campaigns} locale={locale} />
    </main>
  );
}
