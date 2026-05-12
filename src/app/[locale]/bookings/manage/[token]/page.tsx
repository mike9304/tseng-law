import type { Metadata } from 'next';
import { normalizeLocale } from '@/lib/locales';
import BookingManageClient from '@/components/builder/bookings/BookingManageClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Manage booking',
  robots: { index: false, follow: false },
};

export default function BookingManagePage({
  params,
}: {
  params: { locale: string; token: string };
}) {
  normalizeLocale(params.locale);
  return <BookingManageClient token={params.token} />;
}
