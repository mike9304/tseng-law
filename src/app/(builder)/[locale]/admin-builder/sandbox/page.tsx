import { redirect } from 'next/navigation';
import { normalizeLocale } from '@/lib/locales';

export const dynamic = 'force-dynamic';

export default function BuilderSandboxRedirect({
  params,
}: {
  params: { locale: string };
}) {
  const locale = normalizeLocale(params.locale);
  redirect(`/${locale}/admin-builder`);
}
