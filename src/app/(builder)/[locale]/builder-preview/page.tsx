import { redirect } from 'next/navigation';
import { normalizeLocale, type Locale } from '@/lib/locales';

export default function LegacyHomeBuilderPreviewRedirect({
  params,
}: {
  params: { locale: Locale };
}) {
  const locale = normalizeLocale(params.locale);
  redirect(`/${locale}/builder/home`);
}
