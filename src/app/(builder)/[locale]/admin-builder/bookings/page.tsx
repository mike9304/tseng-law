import { redirect } from 'next/navigation';
import { normalizeLocale } from '@/lib/locales';

export default function BookingsIndexPage({ params }: { params: { locale: string } }) {
  const locale = normalizeLocale(params.locale);
  redirect(`/${locale}/admin-builder/bookings/dashboard`);
}
