import { normalizeLocale, type Locale } from '@/lib/locales';
import PageHeader from '@/components/PageHeader';
import { pageCopy } from '@/data/page-copy';
import ReviewBoard from '@/components/ReviewBoard';

export default function ReviewsPage({ params }: { params: { locale: Locale } }) {
  const locale = normalizeLocale(params.locale);
  const copy = pageCopy[locale].reviews;

  return (
    <>
      <PageHeader locale={locale} label={copy.label} title={copy.title} description={copy.description} />
      <ReviewBoard locale={locale} />
    </>
  );
}
