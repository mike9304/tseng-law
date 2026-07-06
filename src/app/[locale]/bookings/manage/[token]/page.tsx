import type { Metadata } from 'next';
import { normalizeLocale } from '@/lib/locales';
import BookingManageClient from '@/components/builder/bookings/BookingManageClient';

export const dynamic = 'force-dynamic';

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = normalizeLocale(params.locale);
  const title = locale === 'ko'
    ? '예약 관리'
    : locale === 'zh-hant'
      ? '管理預約'
      : 'Manage booking';
  return {
    title,
    robots: { index: false, follow: false },
  };
}

export default function BookingManagePage({
  params,
}: {
  params: { locale: string; token: string };
}) {
  const locale = normalizeLocale(params.locale);
  return <BookingManageClient token={params.token} locale={locale} />;
}
