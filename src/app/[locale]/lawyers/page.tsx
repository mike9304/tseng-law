import { normalizeLocale, type Locale } from '@/lib/locales';
import PageHeader from '@/components/PageHeader';
import { pageCopy } from '@/data/page-copy';
import AttorneyProfileSection from '@/components/AttorneyProfileSection';

export default function LawyersPage({ params }: { params: { locale: Locale } }) {
  const locale = normalizeLocale(params.locale);
  const copy = pageCopy[locale].lawyers;
  return (
    <>
      <PageHeader locale={locale} label={copy.label} title={copy.title} description={copy.description} />
      <AttorneyProfileSection locale={locale} />
    </>
  );
}
