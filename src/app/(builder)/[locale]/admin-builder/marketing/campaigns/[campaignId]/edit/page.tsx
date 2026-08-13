import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { normalizeLocale } from '@/lib/locales';
import { getCampaign } from '@/lib/builder/marketing/campaign-storage';
import MarketingNav from '@/components/builder/marketing/MarketingNav';
import CampaignEditor from '@/components/builder/marketing/CampaignEditor';

export const dynamic = 'force-dynamic';

const copy = {
  ko: { title: '캠페인 편집' },
  'zh-hant': { title: '編輯活動' },
  en: { title: 'Edit Campaign' },
} as const;

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  return {
    title: copy[locale].title,
    robots: { index: false, follow: false },
  };
};

export default async function CampaignEditPage(
  props: {
    params: Promise<{ locale: string; campaignId: string }>;
  }
) {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  const campaign = await getCampaign(params.campaignId);
  if (!campaign) {
    notFound();
  }
  return (
    <main>
      <MarketingNav locale={locale} active="campaigns" />
      <CampaignEditor campaign={campaign} locale={locale} />
    </main>
  );
}
