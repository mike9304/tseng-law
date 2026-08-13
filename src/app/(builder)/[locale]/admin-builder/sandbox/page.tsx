import { redirect } from 'next/navigation';
import { normalizeLocale } from '@/lib/locales';

export const dynamic = 'force-dynamic';

export default async function BuilderSandboxRedirect(
  props: {
    params: Promise<{ locale: string }>;
  }
) {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  redirect(`/${locale}/admin-builder`);
}
