import { normalizeLocale, type Locale } from '@/lib/locales';
import PageHeader from '@/components/PageHeader';
import { pageCopy } from '@/data/page-copy';
import PricingCards from '@/components/PricingCards';

export default function PricingPage({ params }: { params: { locale: Locale } }) {
  const locale = normalizeLocale(params.locale);
  const copy = pageCopy[locale].pricing;

  return (
    <>
      <PageHeader locale={locale} label={copy.label} title={copy.title} description={copy.description} />
      <PricingCards locale={locale} />
    </>
  );
}
