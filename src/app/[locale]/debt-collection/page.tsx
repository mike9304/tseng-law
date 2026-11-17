import SeaBusinessLanding, { seaBusinessMetadata } from '@/components/SeaBusinessLanding';
import { SEA_BUSINESS_LOCALES } from '@/lib/sea-business-routes';
export const dynamic = 'force-static';
export const dynamicParams = false;
export function generateStaticParams() { return SEA_BUSINESS_LOCALES.map(locale => ({ locale })); }
type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props) { return seaBusinessMetadata((await params).locale, 'debt-collection'); }
export default async function Page({ params }: Props) {
  return <SeaBusinessLanding locale={(await params).locale} pageKey="debt-collection" />;
}
