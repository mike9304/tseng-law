import type { Metadata } from 'next';
import { normalizeLocale } from '@/lib/locales';
import { listTemplates } from '@/lib/builder/marketing/templates/storage';
import MarketingNav from '@/components/builder/marketing/MarketingNav';
import TemplatesAdmin from '@/components/builder/marketing/TemplatesAdmin';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Email Templates',
  robots: { index: false, follow: false },
};

export default async function TemplatesPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  const templates = await listTemplates();
  return (
    <main>
      <MarketingNav locale={locale} active="templates" />
      <TemplatesAdmin initialTemplates={templates} locale={locale} />
    </main>
  );
}
