import type { Metadata } from 'next';
import { normalizeLocale } from '@/lib/locales';
import BookingManageClient from '@/components/builder/bookings/BookingManageClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const params = await props.params;
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

export default async function BookingManagePage(
  props: {
    params: Promise<{ locale: string; token: string }>;
  }
) {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  return <BookingManageClient token={params.token} locale={locale} />;
}
