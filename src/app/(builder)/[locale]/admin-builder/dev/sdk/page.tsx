import type { Metadata } from 'next';
import type { Locale } from '@/lib/locales';
import SdkDocsPageContent from '@/components/builder/dev/SdkDocsPageContent';
import { getSdkCopy } from '@/components/builder/dev/sdk-copy';

export const dynamic = 'force-static';

export async function generateMetadata(props: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const params = await props.params;
  const copy = getSdkCopy(params.locale);
  return {
    title: copy.title,
    description: copy.intro,
    robots: { index: false, follow: false },
  };
}

export default async function BuilderSdkDocsPage(props: { params: Promise<{ locale: Locale }> }) {
  const params = await props.params;
  return <SdkDocsPageContent locale={params.locale} />;
}
