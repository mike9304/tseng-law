import { withSeoPageCopy } from '@/lib/seo-page-copy';
import SeaBusinessLanding, { seaBusinessMetadata } from '@/components/SeaBusinessLanding';
import { SEA_BUSINESS_LOCALES } from '@/lib/sea-business-routes';
export const dynamic = 'force-static';
export const dynamicParams = false;
export function generateStaticParams() { return SEA_BUSINESS_LOCALES.map(locale => ({ locale })); }
type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return withSeoPageCopy(await seaBusinessMetadata(locale, 'debt-collection'), `/${locale}/debt-collection`);
}
export default async function Page({ params }: Props) {
  return <SeaBusinessLanding locale={(await params).locale} pageKey="debt-collection" />;
}
