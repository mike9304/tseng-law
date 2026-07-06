import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCustomerBookingPortal, type CustomerPortalBooking } from '@/lib/builder/bookings/customer-portal';
import {
  filterMemberBookingsHistory,
  normalizeBookingHistoryDate,
  normalizeBookingHistoryService,
  normalizeBookingHistoryStaff,
  normalizeBookingHistoryTimezone,
  normalizeBookingHistoryPayment,
  normalizeBookingHistorySort,
  normalizeBookingHistoryStatus,
  sortMemberBookingsHistory,
} from '@/lib/builder/bookings/member-portal-history';
import { formatDateTimeInTimezone } from '@/lib/builder/bookings/timezone';
import { getCurrentSiteMember } from '@/lib/builder/members/current-member';
import { getMemberPortalEmails } from '@/lib/builder/members/members-engine';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { CopyLinkButton } from '@/components/members/CopyLinkButton';
import { MemberBookingsSearchForm } from '@/components/members/MemberBookingsSearchForm';
import styles from '@/components/members/MembersArea.module.css';

export const dynamic = 'force-dynamic';

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const locale = normalizeLocale(params.locale);
  const title = locale === 'ko' ? '내 예약' : locale === 'zh-hant' ? '我的預約' : 'My bookings';
  return {
    title,
    robots: { index: false, follow: false },
  };
}

type BookingFilterParams = {
  q?: string;
  status?: string;
  service?: string;
  staff?: string;
  timezone?: string;
  dateFrom?: string;
  dateTo?: string;
  payment?: string;
  sort?: string;
};

const copy = {
  ko: {
    eyebrow: 'Bookings',
    title: '내 예약',
    subtitle: '회원 이메일과 일치하는 상담 예약만 표시됩니다.',
    activeFilters: '적용된 필터',
    noResultsEyebrow: '결과 없음',
    noResultsTitle: '현재 필터와 일치하는 예약이 없습니다.',
    noResultsBody: '아래 필터를 초기화하면 기본 예약 내역으로 돌아갑니다.',
    upcoming: '다가오는 예약',
    past: '지난 예약',
    emptyUpcoming: '예정된 예약이 없습니다.',
    emptyPast: '지난 예약 내역이 없습니다.',
    details: '예약 상세',
    manage: '예약 관리',
    calendar: '캘린더에 추가',
    bookingId: '예약 ID',
    back: '계정으로 돌아가기',
    staff: '담당',
    payment: '결제',
    timezone: '시간대',
    searchLabel: '예약 검색',
    searchPlaceholder: '예약 ID, 상담명, 담당자 또는 결제 상태로 검색',
    searchHint: '검색어는 현재 예약과 지난 예약 전체에 적용됩니다.',
    clearSearch: '검색 초기화',
    resetFilters: '필터 초기화',
    statusFilterLabel: '상태',
    serviceFilterLabel: '상담',
    staffFilterLabel: '담당',
    timezoneFilterLabel: '시간대',
    dateRangeFilterLabel: '날짜',
    paymentFilterLabel: '결제',
    sortFilterLabel: '정렬',
    serviceAll: '모든 상담',
    staffAll: '모든 담당',
    timezoneAll: '모든 시간대',
    dateRange: '날짜 범위',
    dateFrom: '시작일',
    dateTo: '종료일',
    dateRangeHint: '예약 시작일의 현지 날짜를 기준으로 필터링합니다.',
    statusAll: '전체',
    statusUpcoming: '예정',
    statusPast: '지난 예약',
    statusCancelled: '취소됨',
    paymentAll: '모든 결제',
    paymentUnpaid: '미결제',
    paymentPartiallyPaid: '부분 결제',
    paymentPaid: '결제 완료',
    paymentRefunded: '환불됨',
    paymentPartialRefund: '부분 환불',
    copyManage: '예약 링크 복사',
    copiedManage: '복사됨',
    sortLatest: '최신순',
    sortEarliest: '오래된순',
    exportHistory: 'CSV 내보내기',
  },
  'zh-hant': {
    eyebrow: 'Bookings',
    title: '我的預約',
    subtitle: '僅顯示與會員信箱相符的諮詢預約。',
    activeFilters: '已套用篩選',
    noResultsEyebrow: '沒有結果',
    noResultsTitle: '目前篩選條件沒有符合的預約。',
    noResultsBody: '清除下方篩選條件即可回到預設的預約歷史。',
    upcoming: '即將到來',
    past: '過去預約',
    emptyUpcoming: '目前沒有即將到來的預約。',
    emptyPast: '目前沒有過去預約。',
    details: '預約詳情',
    manage: '管理預約',
    calendar: '加入行事曆',
    bookingId: '預約 ID',
    back: '返回帳戶',
    staff: '負責人',
    payment: '付款',
    timezone: '時區',
    searchLabel: '搜尋預約',
    searchPlaceholder: '以預約 ID、服務名稱、負責人或付款狀態搜尋',
    searchHint: '搜尋會套用到即將到來與過去預約。',
    clearSearch: '清除搜尋',
    resetFilters: '重設篩選',
    statusFilterLabel: '狀態',
    serviceFilterLabel: '服務',
    staffFilterLabel: '負責人',
    timezoneFilterLabel: '時區',
    dateRangeFilterLabel: '日期',
    paymentFilterLabel: '付款',
    sortFilterLabel: '排序',
    serviceAll: '所有服務',
    staffAll: '所有負責人',
    timezoneAll: '所有時區',
    dateRange: '日期範圍',
    dateFrom: '起始日',
    dateTo: '結束日',
    dateRangeHint: '以預約開始時的當地日期篩選。',
    statusAll: '全部',
    statusUpcoming: '即將到來',
    statusPast: '過去預約',
    statusCancelled: '已取消',
    paymentAll: '所有付款',
    paymentUnpaid: '未付款',
    paymentPartiallyPaid: '部分付款',
    paymentPaid: '已付款',
    paymentRefunded: '已退款',
    paymentPartialRefund: '部分退款',
    copyManage: '複製預約連結',
    copiedManage: '已複製',
    sortLatest: '最新優先',
    sortEarliest: '最舊優先',
    exportHistory: '匯出 CSV',
  },
  en: {
    eyebrow: 'Bookings',
    title: 'My bookings',
    subtitle: 'Only consultations matching your member email are shown.',
    activeFilters: 'Active filters',
    noResultsEyebrow: 'No results',
    noResultsTitle: 'No bookings match the current filters.',
    noResultsBody: 'Clear the filters below to return to the default bookings history.',
    upcoming: 'Upcoming',
    past: 'Past',
    emptyUpcoming: 'No upcoming bookings.',
    emptyPast: 'No past bookings yet.',
    details: 'View details',
    manage: 'Manage booking',
    calendar: 'Add to calendar',
    bookingId: 'Booking ID',
    back: 'Back to account',
    staff: 'Staff',
    payment: 'Payment',
    timezone: 'Timezone',
    searchLabel: 'Search bookings',
    searchPlaceholder: 'Search by booking ID, service, staff, or payment status',
    searchHint: 'Search applies across upcoming and past bookings.',
    clearSearch: 'Clear search',
    resetFilters: 'Reset filters',
    statusFilterLabel: 'Status',
    serviceFilterLabel: 'Service',
    staffFilterLabel: 'Staff',
    timezoneFilterLabel: 'Timezone',
    dateRangeFilterLabel: 'Date range',
    paymentFilterLabel: 'Payment',
    sortFilterLabel: 'Sort',
    serviceAll: 'All services',
    staffAll: 'All staff',
    timezoneAll: 'All timezones',
    dateRange: 'Date range',
    dateFrom: 'From date',
    dateTo: 'To date',
    dateRangeHint: 'Filter by the booking start date in the booking’s local timezone.',
    statusAll: 'All',
    statusUpcoming: 'Upcoming',
    statusPast: 'Past',
    statusCancelled: 'Cancelled',
    paymentAll: 'All payments',
    paymentUnpaid: 'Unpaid',
    paymentPartiallyPaid: 'Partially paid',
    paymentPaid: 'Paid',
    paymentRefunded: 'Refunded',
    paymentPartialRefund: 'Partial refund',
    copyManage: 'Copy booking link',
    copiedManage: 'Copied',
    sortLatest: 'Newest first',
    sortEarliest: 'Oldest first',
    exportHistory: 'Export CSV',
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
            <Link className={styles.accountLink} href={`/${locale}/account/bookings/${booking.bookingId}`} data-member-booking-detail={booking.bookingId}>
              {labels.details}
            </Link>
            {booking.managePath ? (
              <Link className={styles.accountLink} href={booking.managePath} data-member-booking-manage={booking.bookingId}>
                {labels.manage}
              </Link>
            ) : null}
            {booking.calendarPath ? (
              <Link className={styles.accountLink} href={booking.calendarPath} download data-member-booking-calendar={booking.bookingId}>
                {labels.calendar}
              </Link>
            ) : null}
            {booking.managePath ? (
              <CopyLinkButton
                className={styles.accountLink}
                copiedLabel={labels.copiedManage}
                dataCopyLink={`list-manage-${booking.bookingId}`}
                href={booking.managePath}
                label={labels.copyManage}
              />
            ) : null}
            <span className={styles.bookingCode} data-member-booking-id={booking.bookingId}>
              {labels.bookingId}: {booking.bookingId}
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}

type BookingFilterSummaryItem = {
  label: string;
  value: string;
};

export default async function MemberBookingsPage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams?: BookingFilterParams;
}) {
  const locale = normalizeLocale(params.locale);
  const member = await getCurrentSiteMember();
  if (!member) redirect(`/${locale}/login?next=${encodeURIComponent(`/${locale}/account/bookings`)}`);

  const nowIso = new Date().toISOString();
  const portal = await getCustomerBookingPortal(member.email, locale, nowIso, getMemberPortalEmails(member));
  const filters = {
    q: searchParams?.q?.trim().toLowerCase() ?? '',
    status: normalizeBookingHistoryStatus(searchParams?.status),
    service: normalizeBookingHistoryService(searchParams?.service),
    staff: normalizeBookingHistoryStaff(searchParams?.staff),
    timezone: normalizeBookingHistoryTimezone(searchParams?.timezone),
    dateFrom: normalizeBookingHistoryDate(searchParams?.dateFrom),
    dateTo: normalizeBookingHistoryDate(searchParams?.dateTo),
    payment: normalizeBookingHistoryPayment(searchParams?.payment),
    sort: normalizeBookingHistorySort(searchParams?.sort),
  };
  const upcoming = sortMemberBookingsHistory(filterMemberBookingsHistory(portal.upcoming, filters, nowIso), filters.sort);
  const past = sortMemberBookingsHistory(filterMemberBookingsHistory(portal.past, filters, nowIso), filters.sort);
  const labels = copy[locale];
  const serviceOptions = buildBookingsHistoryServiceOptions([...portal.upcoming, ...portal.past], locale);
  const staffOptions = buildBookingsHistoryStaffOptions([...portal.upcoming, ...portal.past], locale);
  const timezoneOptions = buildBookingsHistoryTimezoneOptions([...portal.upcoming, ...portal.past]);
  const activeFilterSummary = buildBookingsHistoryActiveFilterSummary(locale, labels, filters, serviceOptions, staffOptions, timezoneOptions);
  const showNoResults = activeFilterSummary.length > 0 && upcoming.length + past.length === 0;
  const exportPath = buildBookingsHistoryExportHref(locale, searchParams);

  return (
    <main className={styles.accountPage} data-member-bookings-page="true">
      <section className={styles.accountShell}>
        <div className={styles.accountHero}>
          <p>{labels.eyebrow}</p>
          <h1>{labels.title}</h1>
          <span>{labels.subtitle} {portal.email}</span>
        </div>

        <MemberBookingsSearchForm
          labels={labels}
          locale={locale}
          payment={filters.payment}
          query={filters.q}
          service={filters.service}
          serviceOptions={serviceOptions}
          staff={filters.staff}
          staffOptions={staffOptions}
          timezone={filters.timezone}
          timezoneOptions={timezoneOptions}
          dateFrom={filters.dateFrom}
          dateTo={filters.dateTo}
          sort={filters.sort}
          status={filters.status}
        />
        {showNoResults ? (
          <section className={styles.bookingsPanel} data-member-bookings-no-results="true">
            <div className={styles.bookingNoResultsCard}>
              <p className={styles.bookingNoResultsEyebrow}>{labels.noResultsEyebrow}</p>
              <h2>{labels.noResultsTitle}</h2>
              <p className={styles.bookingNoResultsBody}>{labels.noResultsBody}</p>
              <div className={styles.bookingNoResultsFilters}>
                <p>{labels.activeFilters}</p>
                <ul className={styles.bookingNoResultsList} data-member-bookings-no-results-filters="true">
                  {activeFilterSummary.map((item) => (
                    <li key={`${item.label}-${item.value}`}>
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles.bookingActions}>
                <Link className={styles.accountLink} href={exportPath} data-member-bookings-export="true">
                  {labels.exportHistory}
                </Link>
                <Link
                  className={styles.accountLink}
                  href={`/${locale}/account/bookings`}
                  data-member-bookings-no-results-reset="true"
                  data-member-bookings-reset="true"
                >
                  {labels.resetFilters}
                </Link>
              </div>
            </div>
          </section>
        ) : (
          <>
            <Link className={styles.accountLink} href={exportPath} data-member-bookings-export="true">
              {labels.exportHistory}
            </Link>

            <section className={styles.bookingsPanel} data-member-bookings-upcoming="true">
              <div className={styles.bookingsHeader}>
                <div>
                  <p>{labels.eyebrow}</p>
                  <h2>{labels.upcoming}</h2>
                </div>
                <span>{upcoming.length}</span>
              </div>
              <BookingList bookings={upcoming} empty={labels.emptyUpcoming} locale={locale} />
            </section>

            <section className={styles.bookingsPanel} data-member-bookings-past="true">
              <div className={styles.bookingsHeader}>
                <div>
                  <p>{labels.eyebrow}</p>
                  <h2>{labels.past}</h2>
                </div>
                <span>{past.length}</span>
              </div>
              <BookingList bookings={past} empty={labels.emptyPast} locale={locale} />
            </section>
          </>
        )}

        <Link className={styles.accountLink} href={`/${locale}/account`}>
          {labels.back}
        </Link>
      </section>
    </main>
  );
}

function buildBookingsHistoryExportHref(locale: Locale, searchParams?: BookingFilterParams): string {
  const params = new URLSearchParams();
  const q = searchParams?.q?.trim();
  const status = normalizeBookingHistoryStatus(searchParams?.status);
  const service = normalizeBookingHistoryService(searchParams?.service);
  const staff = normalizeBookingHistoryStaff(searchParams?.staff);
  const timezone = normalizeBookingHistoryTimezone(searchParams?.timezone);
  const dateFrom = normalizeBookingHistoryDate(searchParams?.dateFrom);
  const dateTo = normalizeBookingHistoryDate(searchParams?.dateTo);
  const payment = normalizeBookingHistoryPayment(searchParams?.payment);
  const sort = normalizeBookingHistorySort(searchParams?.sort);
  if (q) params.set('q', q);
  if (status !== 'all') params.set('status', status);
  if (service) params.set('service', service);
  if (staff) params.set('staff', staff);
  if (timezone) params.set('timezone', timezone);
  if (dateFrom) params.set('dateFrom', dateFrom);
  if (dateTo) params.set('dateTo', dateTo);
  if (payment !== 'all') params.set('payment', payment);
  if (sort !== 'latest') params.set('sort', sort);
  const search = params.toString();
  return search ? `/${locale}/account/bookings/export?${search}` : `/${locale}/account/bookings/export`;
}

function buildBookingsHistoryServiceOptions(
  bookings: Array<{ serviceId: string; serviceName: string }>,
  locale: Locale,
): Array<{ key: string; label: string }> {
  const serviceMap = new Map<string, string>();
  for (const booking of bookings) {
    if (!serviceMap.has(booking.serviceId)) {
      serviceMap.set(booking.serviceId, booking.serviceName);
    }
  }
  return [...serviceMap.entries()]
    .map(([key, label]) => ({ key, label }))
    .sort((left, right) => left.label.localeCompare(right.label, locale, { sensitivity: 'base' }));
}

function buildBookingsHistoryStaffOptions(
  bookings: Array<{ staffId: string; staffName: string }>,
  locale: Locale,
): Array<{ key: string; label: string }> {
  const staffMap = new Map<string, string>();
  for (const booking of bookings) {
    if (!staffMap.has(booking.staffId)) {
      staffMap.set(booking.staffId, booking.staffName);
    }
  }
  return [...staffMap.entries()]
    .map(([key, label]) => ({ key, label }))
    .sort((left, right) => left.label.localeCompare(right.label, locale, { sensitivity: 'base' }));
}

function buildBookingsHistoryTimezoneOptions(bookings: Array<{ customerTimezone?: string }>): Array<{ key: string; label: string }> {
  const timezoneSet = new Set<string>();
  for (const booking of bookings) {
    if (booking.customerTimezone?.trim()) {
      timezoneSet.add(booking.customerTimezone.trim());
    }
  }
  return [...timezoneSet.values()]
    .map((key) => ({ key, label: key }))
    .sort((left, right) => left.label.localeCompare(right.label, 'en', { sensitivity: 'base' }));
}

function buildBookingsHistoryActiveFilterSummary(
  locale: Locale,
  labels: Record<string, string>,
  filters: {
    q: string;
    status: string;
    service: string;
    staff: string;
    timezone: string;
    dateFrom: string;
    dateTo: string;
    payment: string;
    sort: string;
  },
  serviceOptions: Array<{ key: string; label: string }>,
  staffOptions: Array<{ key: string; label: string }>,
  timezoneOptions: Array<{ key: string; label: string }>,
): BookingFilterSummaryItem[] {
  const summary: BookingFilterSummaryItem[] = [];
  const findOptionLabel = (options: Array<{ key: string; label: string }>, key: string): string | undefined =>
    options.find((option) => option.key === key)?.label;

  if (filters.q) summary.push({ label: labels.searchLabel, value: filters.q });
  if (filters.status !== 'all') {
    summary.push({
      label: labels.statusFilterLabel,
      value: {
        upcoming: labels.statusUpcoming,
        past: labels.statusPast,
        cancelled: labels.statusCancelled,
      }[filters.status] ?? filters.status,
    });
  }
  if (filters.service) summary.push({ label: labels.serviceFilterLabel, value: findOptionLabel(serviceOptions, filters.service) ?? filters.service });
  if (filters.staff) summary.push({ label: labels.staffFilterLabel, value: findOptionLabel(staffOptions, filters.staff) ?? filters.staff });
  if (filters.timezone) summary.push({ label: labels.timezoneFilterLabel, value: findOptionLabel(timezoneOptions, filters.timezone) ?? filters.timezone });
  if (filters.dateFrom || filters.dateTo) {
    summary.push({
      label: labels.dateRangeFilterLabel,
      value: filters.dateFrom && filters.dateTo ? `${filters.dateFrom} ~ ${filters.dateTo}` : filters.dateFrom || filters.dateTo,
    });
  }
  if (filters.payment !== 'all') {
    summary.push({
      label: labels.paymentFilterLabel,
      value: {
        unpaid: labels.paymentUnpaid,
        partially_paid: labels.paymentPartiallyPaid,
        paid: labels.paymentPaid,
        refunded: labels.paymentRefunded,
        'partial-refund': labels.paymentPartialRefund,
      }[filters.payment] ?? filters.payment,
    });
  }
  if (filters.sort !== 'latest') summary.push({ label: labels.sortFilterLabel, value: labels.sortEarliest });
  return summary;
}
