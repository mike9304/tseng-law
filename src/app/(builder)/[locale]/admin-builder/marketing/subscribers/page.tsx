import type { Metadata } from 'next';
import { normalizeLocale } from '@/lib/locales';
import { listSubscribers } from '@/lib/builder/marketing/subscriber-storage';
import MarketingNav from '@/components/builder/marketing/MarketingNav';
import SubscribersAdmin from '@/components/builder/marketing/SubscribersAdmin';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Email Subscribers',
  robots: { index: false, follow: false },
};

export default async function MarketingSubscribersPage({ params }: { params: { locale: string } }) {
  const locale = normalizeLocale(params.locale);
  const subscribers = await listSubscribers();
  return (
    <main>
      <MarketingNav locale={locale} active="subscribers" />
      <SubscribersAdmin initialSubscribers={subscribers} />
    </main>
  );
}
