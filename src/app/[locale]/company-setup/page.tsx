import { withSeoPageCopy } from '@/lib/seo-page-copy';
import SeaBusinessLanding, { seaBusinessMetadata } from '@/components/SeaBusinessLanding';
import { SEA_BUSINESS_LOCALES } from '@/lib/sea-business-routes';
export const dynamic = 'force-static';
export const dynamicParams = false;
export function generateStaticParams() { return SEA_BUSINESS_LOCALES.map(locale => ({ locale })); }
type Props = { params: Promise<{ locale: string }> };
async function buildPageMetadata({ params }: Props) { return seaBusinessMetadata((await params).locale, 'company-setup'); }
export async function generateMetadata(props: Parameters<typeof buildPageMetadata>[0]) {
  const params = await props.params;
  return withSeoPageCopy(await buildPageMetadata(props), `/${params.locale}/company-setup`);
}

export default async function Page({ params }: Props) {
  return <SeaBusinessLanding locale={(await params).locale} pageKey="company-setup" />;
}
