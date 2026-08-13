import { redirect } from 'next/navigation';
import { normalizeLocale } from '@/lib/locales';

export default async function BookingsIndexPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  redirect(`/${locale}/admin-builder/bookings/dashboard`);
}
