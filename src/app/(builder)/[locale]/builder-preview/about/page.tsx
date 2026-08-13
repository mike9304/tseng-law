import { redirect } from 'next/navigation';
import { normalizeLocale, type Locale } from '@/lib/locales';

export default async function LegacyAboutBuilderPreviewRedirect(
  props: {
    params: Promise<{ locale: Locale }>;
  }
) {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  redirect(`/${locale}/builder/about?mode=preview`);
}
