import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCustomerBookingPortal, type CustomerPortalBooking } from '@/lib/builder/bookings/customer-portal';
import { formatDateTimeInTimezone } from '@/lib/builder/bookings/timezone';
import { getCurrentSiteMember } from '@/lib/builder/members/current-member';
import { normalizeLocale, type Locale } from '@/lib/locales';
import styles from '@/components/members/MembersArea.module.css';

export const dynamic = 'force-dynamic';

const copy = {
  ko: {
    eyebrow: 'Bookings',
    title: '내 예약',
    subtitle: '회원 이메일과 일치하는 상담 예약만 표시됩니다.',
    upcoming: '다가오는 예약',
    past: '지난 예약',
    emptyUpcoming: '예정된 예약이 없습니다.',
    emptyPast: '지난 예약 내역이 없습니다.',
    manage: '예약 관리',
    bookingId: '예약 ID',
    back: '계정으로 돌아가기',
    staff: '담당',
    payment: '결제',
    timezone: '시간대',
  },
  'zh-hant': {
    eyebrow: 'Bookings',
    title: '我的預約',
    subtitle: '僅顯示與會員信箱相符的諮詢預約。',
    upcoming: '即將到來',
    past: '過去預約',
    emptyUpcoming: '目前沒有即將到來的預約。',
    emptyPast: '目前沒有過去預約。',
    manage: '管理預約',
    bookingId: '預約 ID',
    back: '返回帳戶',
    staff: '負責人',
    payment: '付款',
    timezone: '時區',
  },
  en: {
    eyebrow: 'Bookings',
    title: 'My bookings',
    subtitle: 'Only consultations matching your member email are shown.',
    upcoming: 'Upcoming',
    past: 'Past',
    emptyUpcoming: 'No upcoming bookings.',
    emptyPast: 'No past bookings yet.',
    manage: 'Manage booking',
    bookingId: 'Booking ID',
    back: 'Back to account',
    staff: 'Staff',
    payment: 'Payment',
    timezone: 'Timezone',
  },
} satisfies Record<Locale, Record<string, string>>;

function BookingList({
  bookings,
  empty,
  locale,
}: {
  bookings: CustomerPortalBooking[];
  empty: string;
  locale: Locale;
}) {
  const labels = copy[locale];
  if (bookings.length === 0) {
    return <p className={styles.emptyState} data-member-booking-empty="true">{empty}</p>;
  }

  return (
    <div className={styles.bookingList}>
      {bookings.map((booking) => (
        <article className={styles.bookingRow} key={booking.bookingId} data-member-booking-row={booking.bookingId}>
          <div className={styles.bookingMain}>
            <strong>{booking.serviceName}</strong>
            <time dateTime={booking.startAt}>{formatDateTimeInTimezone(booking.startAt, locale, booking.customerTimezone)}</time>
            <div className={styles.bookingMeta}>
              <span className={styles.bookingStatus} data-member-booking-status={booking.status}>{booking.status}</span>
              <span>{labels.staff}: {booking.staffName}</span>
              {booking.paymentStatus ? <span>{labels.payment}: {booking.paymentStatus}</span> : null}
              {booking.customerTimezone ? <span data-member-booking-timezone="true">{labels.timezone}: {booking.customerTimezone}</span> : null}
            </div>
          </div>
          <div className={styles.bookingActions}>
            <span className={styles.bookingCode} data-member-booking-id={booking.bookingId}>
              {labels.bookingId}: {booking.bookingId}
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}

export default async function MemberBookingsPage({ params }: { params: { locale: Locale } }) {
  const locale = normalizeLocale(params.locale);
  const member = await getCurrentSiteMember();
  if (!member) redirect(`/${locale}/login?next=${encodeURIComponent(`/${locale}/account/bookings`)}`);

  const portal = await getCustomerBookingPortal(member.email, locale);
  const labels = copy[locale];

  return (
    <main className={styles.accountPage} data-member-bookings-page="true">
      <section className={styles.accountShell}>
        <div className={styles.accountHero}>
          <p>{labels.eyebrow}</p>
          <h1>{labels.title}</h1>
          <span>{labels.subtitle} {portal.email}</span>
        </div>

        <section className={styles.bookingsPanel} data-member-bookings-upcoming="true">
          <div className={styles.bookingsHeader}>
            <div>
              <p>{labels.eyebrow}</p>
              <h2>{labels.upcoming}</h2>
            </div>
            <span>{portal.upcoming.length}</span>
          </div>
          <BookingList bookings={portal.upcoming} empty={labels.emptyUpcoming} locale={locale} />
        </section>

        <section className={styles.bookingsPanel} data-member-bookings-past="true">
          <div className={styles.bookingsHeader}>
            <div>
              <p>{labels.eyebrow}</p>
              <h2>{labels.past}</h2>
            </div>
            <span>{portal.past.length}</span>
          </div>
          <BookingList bookings={portal.past} empty={labels.emptyPast} locale={locale} />
        </section>

        <Link className={styles.accountLink} href={`/${locale}/account`}>
          {labels.back}
        </Link>
      </section>
    </main>
  );
}
