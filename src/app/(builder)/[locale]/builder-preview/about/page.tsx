import { redirect } from 'next/navigation';
import { normalizeLocale, type Locale } from '@/lib/locales';

export default function LegacyAboutBuilderPreviewRedirect({
  params,
}: {
  params: { locale: Locale };
}) {
  const locale = normalizeLocale(params.locale);
  redirect(`/${locale}/builder/about?mode=preview`);
}
