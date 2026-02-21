import { normalizeLocale, type Locale } from '@/lib/locales';
import PageHeader from '@/components/PageHeader';
import ServicesBento from '@/components/ServicesBento';
import { pageCopy } from '@/data/page-copy';

export default function ServicesPage({ params }: { params: { locale: Locale } }) {
  const locale = normalizeLocale(params.locale);
  const copy = pageCopy[locale].services;
  return (
    <>
      <PageHeader locale={locale} label={copy.label} title={copy.title} description={copy.description} />
      <ServicesBento locale={locale} />
    </>
  );
}
