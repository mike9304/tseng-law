import type { Metadata } from 'next';
import { normalizeLocale } from '@/lib/locales';
import { listSubscribers } from '@/lib/builder/marketing/subscriber-storage';
import MarketingNav from '@/components/builder/marketing/MarketingNav';
import SubscribersAdmin from '@/components/builder/marketing/SubscribersAdmin';

export const dynamic = 'force-dynamic';

const copy = {
  ko: { title: '이메일 구독자' },
  'zh-hant': { title: '電子郵件訂閱者' },
  en: { title: 'Email Subscribers' },
} as const;

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  return {
    title: copy[locale].title,
    robots: { index: false, follow: false },
  };
};

export default async function MarketingSubscribersPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  const subscribers = await listSubscribers();
  return (
    <main>
      <MarketingNav locale={locale} active="subscribers" />
      <SubscribersAdmin initialSubscribers={subscribers} locale={locale} />
    </main>
  );
}
