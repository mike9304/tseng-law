import type { Metadata } from 'next';
import type { Locale } from '@/lib/locales';
import SdkDocsPageContent from '@/components/builder/dev/SdkDocsPageContent';
import { getSdkCopy } from '@/components/builder/dev/sdk-copy';

export const dynamic = 'force-static';

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const copy = getSdkCopy(params.locale);
  return {
    title: copy.title,
    description: copy.intro,
    robots: { index: false, follow: false },
  };
}

export default function BuilderSdkDocsPage({ params }: { params: { locale: Locale } }) {
  return <SdkDocsPageContent locale={params.locale} />;
}
