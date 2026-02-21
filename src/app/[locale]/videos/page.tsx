import { normalizeLocale, type Locale } from '@/lib/locales';
import PageHeader from '@/components/PageHeader';
import VideoChannel from '@/components/VideoChannel';
import { pageCopy } from '@/data/page-copy';

export default function VideosPage({ params }: { params: { locale: Locale } }) {
  const locale = normalizeLocale(params.locale);
  const copy = pageCopy[locale].videos;
  return (
    <>
      <PageHeader locale={locale} label={copy.label} title={copy.title} description={copy.description} />
      <VideoChannel locale={locale} />
    </>
  );
}
