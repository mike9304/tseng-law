import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { listCustomerBillingDocuments, partitionCustomerBillingDocuments } from '@/lib/builder/billing-customer-portal';
import { evaluateBookingSelfServicePolicy } from '@/lib/builder/bookings/refund';
import { getCustomerBookingPortal } from '@/lib/builder/bookings/customer-portal';
import BookingFlowSteps from '@/components/builder/bookings/BookingFlowSteps';
import { getPackage, getPackageCredit, getService, getStaffAvailability, listBookings } from '@/lib/builder/bookings/storage';
import { formatDateTimeInTimezone } from '@/lib/builder/bookings/timezone';
import { getCurrentSiteMember } from '@/lib/builder/members/current-member';
import { getMemberPortalEmails } from '@/lib/builder/members/members-engine';
import { textForLocale } from '@/lib/builder/bookings/types';
import { normalizeLocale, type Locale } from '@/lib/locales';
import styles from '@/components/members/MembersArea.module.css';
import { CopyLinkButton } from '@/components/members/CopyLinkButton';
import { CancelBookingButton } from '@/components/members/CancelBookingButton';
import { RenewPaymentLinkButton } from '@/components/members/RenewPaymentLinkButton';
import { RescheduleBookingButton } from '@/components/members/RescheduleBookingButton';
import { SendDocumentEmailButton } from '@/components/members/SendDocumentEmailButton';

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  const title = locale === 'ko' ? '예약 상세' : locale === 'zh-hant' ? '預約詳情' : 'Booking details';
  return {
    title,
    robots: { index: false, follow: false },
  };
}

const copy = {
  ko: {
    eyebrow: 'Bookings',
    title: '예약 상세',
    subtitle: '회원 이메일과 일치하는 예약의 세부 정보와 관리 링크를 확인할 수 있습니다.',
    back: '예약 목록으로 돌아가기',
    manage: '예약 관리',
    calendar: '캘린더에 추가',
    copyManage: '예약 링크 복사',
    copiedManage: '복사됨',
    cancelBooking: '예약 취소',
    cancellingBooking: '취소 중...',
    cancelledBooking: '취소됨',
    cancelBookingFailed: '취소 실패',
    rescheduleBooking: '일정 변경',
    reschedulingBooking: '변경 중...',
    rescheduledBooking: '변경됨',
    rescheduleBookingFailed: '변경 실패',
    rescheduleStart: '새 일정 시작 시간',
    service: '상담',
    staff: '담당',
    status: '상태',
    payment: '결제',
    time: '시간',
    timezone: '시간대',
    officeTime: '사무실 시간',
    officeTimezone: '사무실 시간대',
    meeting: '미팅 링크',
    bookingId: '예약 ID',
    package: '패키지 및 크레딧',
    packageEmpty: '이 예약에 연결된 패키지가 없습니다.',
    packageName: '패키지',
    packageId: '패키지 ID',
    packageCredit: '크레딧',
    packageUsed: '사용',
    packageRemaining: '남은 크레딧',
    packageStatus: '크레딧 상태',
    packageExpires: '만료',
    packageRestored: '복원 시각',
    packageUsage: '사용 이력',
    policy: '예약 정책',
    policyHours: '남은 시간',
    policyCancel: '취소 가능',
    policyReschedule: '일정 변경 가능',
    policyRefund: '환불 기준',
    policyDetail: '예약 관리 페이지에서 취소 또는 일정을 변경할 수 있습니다.',
    allowed: '가능',
    blocked: '불가',
    rebook: '다시 예약',
    rebookSubtitle: '이전 예약의 상담 서비스와 담당자를 미리 넣어둔 예약 흐름입니다.',
    rebookHint: '필요하면 서비스를 바꾸고 다시 예약할 수 있습니다.',
    rebookSuccess: '다시 예약이 완료되었습니다',
    billing: '청구서 및 영수증',
    billingEmpty: '이 예약과 연결된 문서가 없습니다.',
    openDocument: '문서 열기',
    downloadDocument: 'PDF 다운로드',
    copyDocumentLink: 'PDF 링크 복사',
    copiedDocumentLink: '복사됨',
    copyPaymentLink: '결제 링크 복사',
    copiedPaymentLink: '복사됨',
    emailDocument: '이메일로 보내기',
    emailedDocument: '발송됨',
    emailingDocument: '발송 중...',
    emailFailedDocument: '발송 실패',
    payDocument: '결제하기',
    renewDocument: '새 결제 링크 요청',
    renewingDocument: '요청 중...',
    renewedDocument: '요청됨',
    renewFailedDocument: '요청 실패',
    billingPortal: '청구서 포털로 이동',
  },
  'zh-hant': {
    eyebrow: 'Bookings',
    title: '預約詳情',
    subtitle: '可查看與會員信箱相符的預約詳細資料與管理連結。',
    back: '返回預約列表',
    manage: '管理預約',
    calendar: '加入行事曆',
    copyManage: '複製預約連結',
    copiedManage: '已複製',
    cancelBooking: '取消預約',
    cancellingBooking: '取消中...',
    cancelledBooking: '已取消',
    cancelBookingFailed: '取消失敗',
    rescheduleBooking: '更改時間',
    reschedulingBooking: '更改中...',
    rescheduledBooking: '已更改',
    rescheduleBookingFailed: '更改失敗',
    rescheduleStart: '新的開始時間',
    service: '諮詢',
    staff: '負責人',
    status: '狀態',
    payment: '付款',
    time: '時間',
    timezone: '時區',
    officeTime: '辦公時間',
    officeTimezone: '辦公時區',
    meeting: '會議連結',
    bookingId: '預約 ID',
    package: '方案與點數',
    packageEmpty: '尚未找到與此預約相關的方案。',
    packageName: '方案',
    packageId: '方案 ID',
    packageCredit: '點數',
    packageUsed: '已使用',
    packageRemaining: '剩餘點數',
    packageStatus: '點數狀態',
    packageExpires: '到期',
    packageRestored: '恢復時間',
    packageUsage: '使用紀錄',
    policy: '預約政策',
    policyHours: '剩餘時間',
    policyCancel: '可取消',
    policyReschedule: '可改期',
    policyRefund: '退款規則',
    policyDetail: '可在預約管理頁面取消或更改預約時間。',
    allowed: '可用',
    blocked: '不可用',
    rebook: '再次預約',
    rebookSubtitle: '已預先帶入上一筆預約的服務與負責人。',
    rebookHint: '如有需要，仍可修改服務後重新預約。',
    rebookSuccess: '再次預約已完成',
    billing: '帳單與收據',
    billingEmpty: '尚未找到與此預約相關的文件。',
    openDocument: '開啟文件',
    downloadDocument: '下載 PDF',
    copyDocumentLink: '複製 PDF 連結',
    copiedDocumentLink: '已複製',
    copyPaymentLink: '複製付款連結',
    copiedPaymentLink: '已複製',
    emailDocument: '寄送副本',
    emailedDocument: '已寄出',
    emailingDocument: '寄送中...',
    emailFailedDocument: '寄送失敗',
    payDocument: '前往付款',
    renewDocument: '申請新的付款連結',
    renewingDocument: '申請中...',
    renewedDocument: '已申請',
    renewFailedDocument: '申請失敗',
    billingPortal: '前往帳單入口',
  },
  en: {
    eyebrow: 'Bookings',
    title: 'Booking details',
    subtitle: 'View safe details and the management link for a booking tied to your member email.',
    back: 'Back to bookings',
    manage: 'Manage booking',
    calendar: 'Add to calendar',
    copyManage: 'Copy booking link',
    copiedManage: 'Copied',
    cancelBooking: 'Cancel booking',
    cancellingBooking: 'Cancelling...',
    cancelledBooking: 'Cancelled',
    cancelBookingFailed: 'Cancel failed',
    rescheduleBooking: 'Reschedule booking',
    reschedulingBooking: 'Rescheduling...',
    rescheduledBooking: 'Rescheduled',
    rescheduleBookingFailed: 'Reschedule failed',
    rescheduleStart: 'New start time',
    service: 'Consultation',
    staff: 'Staff',
    status: 'Status',
    payment: 'Payment',
    time: 'Time',
    timezone: 'Timezone',
    officeTime: 'Office time',
    officeTimezone: 'Office timezone',
    meeting: 'Meeting link',
    bookingId: 'Booking ID',
    package: 'Package and credits',
    packageEmpty: 'No package is linked to this booking yet.',
    packageName: 'Package',
    packageId: 'Package ID',
    packageCredit: 'Credit',
    packageUsed: 'Used',
    packageRemaining: 'Remaining credits',
    packageStatus: 'Credit status',
    packageExpires: 'Expires',
    packageRestored: 'Restored at',
    packageUsage: 'Usage history',
    policy: 'Booking policy',
    policyHours: 'Hours left',
    policyCancel: 'Cancel allowed',
    policyReschedule: 'Reschedule allowed',
    policyRefund: 'Refund rule',
    policyDetail: 'You can cancel or reschedule from the manage page.',
    allowed: 'Allowed',
    blocked: 'Blocked',
    rebook: 'Book again',
    rebookSubtitle: 'The previous service and staff are prefilled for a faster repeat booking.',
    rebookHint: 'You can still change the service before confirming.',
    rebookSuccess: 'Your repeat booking is complete',
    billing: 'Invoices and receipts',
    billingEmpty: 'No documents are linked to this booking yet.',
    openDocument: 'Open document',
    downloadDocument: 'Download PDF',
    copyDocumentLink: 'Copy PDF link',
    copiedDocumentLink: 'Copied',
    copyPaymentLink: 'Copy payment link',
    copiedPaymentLink: 'Copied',
    emailDocument: 'Email me a copy',
    emailedDocument: 'Sent',
    emailingDocument: 'Sending...',
    emailFailedDocument: 'Send failed',
    payDocument: 'Pay invoice',
    renewDocument: 'Request new payment link',
    renewingDocument: 'Requesting...',
    renewedDocument: 'Requested',
    renewFailedDocument: 'Request failed',
    billingPortal: 'Go to billing portal',
  },
} satisfies Record<Locale, Record<string, string>>;

function packageCreditStatusLabel(locale: Locale, status: string): string {
  if (locale === 'ko') {
    if (status === 'active') return '활성';
    if (status === 'used') return '사용됨';
    if (status === 'expired') return '만료됨';
    if (status === 'revoked') return '회수됨';
    return status;
  }
  if (locale === 'zh-hant') {
    if (status === 'active') return '啟用';
    if (status === 'used') return '已使用';
    if (status === 'expired') return '已過期';
    if (status === 'revoked') return '已撤銷';
    return status;
  }
  if (status === 'active') return 'Active';
  if (status === 'used') return 'Used';
  if (status === 'expired') return 'Expired';
  if (status === 'revoked') return 'Revoked';
  return status;
}

export default async function MemberBookingDetailPage(props: { params: Promise<{ locale: string; bookingId: string }> }) {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  const member = await getCurrentSiteMember();
  if (!member) redirect(`/${locale}/login?next=${encodeURIComponent(`/${locale}/account/bookings/${params.bookingId}`)}`);
  const memberEmails = getMemberPortalEmails(member);

  const [portal, customerDocuments] = await Promise.all([
    getCustomerBookingPortal(member.email, locale, undefined, memberEmails),
    listCustomerBillingDocuments(member.email, { locale }, memberEmails),
  ]);
  const sourceBooking = (await listBookings({ includeCancelled: true }))
    .find((item) => item.bookingId === params.bookingId && memberEmails.includes(item.customer.email.trim().toLowerCase()));
  const booking = [...portal.upcoming, ...portal.past].find((item) => item.bookingId === params.bookingId);
  if (!booking || !sourceBooking) redirect(`/${locale}/account/bookings`);
  const service = await getService(sourceBooking.serviceId);
  const staffAvailability = await getStaffAvailability(sourceBooking.staffId);
  const bookingDocuments = partitionCustomerBillingDocuments(
    customerDocuments.filter((document) => document.source === 'booking' && document.ownerLabel === booking.bookingId),
  );
  const bookingPackage = sourceBooking.packageId ? await getPackage(sourceBooking.packageId) : null;
  const bookingCredit = sourceBooking.packageCreditId ? await getPackageCredit(sourceBooking.packageCreditId) : null;
  const bookingRedemptions = bookingCredit?.redemptions?.filter((redemption) => redemption.bookingId === booking.bookingId) ?? [];
  const bookingPolicy = await evaluateBookingSelfServicePolicy(sourceBooking, service);
  const rebookCustomer = {
    name: sourceBooking.customer.name,
    email: sourceBooking.customer.email,
    phone: sourceBooking.customer.phone ?? member.phone ?? '',
    notes: sourceBooking.customer.notes ?? '',
    caseSummary: sourceBooking.customer.caseSummary ?? '',
    attachmentLinks: sourceBooking.customer.attachmentUrls?.join('\n') ?? '',
    customFieldValues: Object.fromEntries(sourceBooking.customer.customFields?.map((field) => [field.label, field.value]) ?? []) as Record<string, string>,
    company: '',
    consent: false,
  };

  const labels = copy[locale];
  const officeTimezone = staffAvailability.timezone;

  return (
    <main className={styles.accountPage} data-member-booking-detail-page="true">
      <section className={styles.accountShell}>
        <div className={styles.accountHero}>
          <p>{labels.eyebrow}</p>
          <h1>{booking.serviceName}</h1>
          <span>{labels.subtitle} {portal.email}</span>
        </div>

        <section className={styles.bookingsPanel} data-member-booking-detail="true">
          <div className={styles.bookingsHeader}>
            <div>
              <p>{labels.eyebrow}</p>
              <h2>{labels.title}</h2>
            </div>
            <span>{labels.bookingId}: {booking.bookingId}</span>
          </div>

          <article className={styles.bookingRow}>
            <div className={styles.bookingMain}>
              <strong>{booking.serviceName}</strong>
              <time dateTime={booking.startAt}>{formatDateTimeInTimezone(booking.startAt, locale, booking.customerTimezone)}</time>
              <div className={styles.bookingMeta}>
                <span className={styles.bookingStatus} data-member-booking-status={booking.status}>{labels.status}: {booking.status}</span>
                <span>{labels.staff}: {booking.staffName}</span>
                {booking.paymentStatus ? <span>{labels.payment}: {booking.paymentStatus}</span> : null}
                {booking.customerTimezone ? <span data-member-booking-timezone="true">{labels.timezone}: {booking.customerTimezone}</span> : null}
              </div>
            </div>
            <div className={styles.bookingActions}>
              {booking.managePath ? (
                <>
                  <Link className={styles.accountLink} href={booking.managePath} data-member-booking-detail-manage={booking.bookingId}>
                    {labels.manage}
                  </Link>
                  {booking.calendarPath ? (
                    <Link className={styles.accountLink} href={booking.calendarPath} download data-member-booking-detail-calendar={booking.bookingId}>
                      {labels.calendar}
                    </Link>
                  ) : null}
                <CopyLinkButton
                  className={styles.accountLink}
                  copiedLabel={labels.copiedManage}
                  dataCopyLink={`manage-${booking.bookingId}`}
                  href={booking.managePath}
                  label={labels.copyManage}
                />
                  {bookingPolicy.canCancel ? (
                    <CancelBookingButton
                      className={styles.accountLink}
                      dataCancelBooking={booking.bookingId}
                      doneLabel={labels.cancelledBooking}
                      failedLabel={labels.cancelBookingFailed}
                      href={`/${locale}/account/bookings/${booking.bookingId}/cancel`}
                      label={labels.cancelBooking}
                      pendingLabel={labels.cancellingBooking}
                    />
                  ) : null}
                </>
              ) : null}
            </div>
          </article>

          <div className={styles.accountGrid}>
            <article className={styles.accountCard}>
              <div>
                <strong>{labels.time}</strong>
                <p>{formatDateTimeInTimezone(booking.startAt, locale, booking.customerTimezone)} - {formatDateTimeInTimezone(booking.endAt, locale, booking.customerTimezone)}</p>
                <p data-member-booking-office-time="true">
                  {labels.officeTime}: {formatDateTimeInTimezone(booking.startAt, locale, officeTimezone)} - {formatDateTimeInTimezone(booking.endAt, locale, officeTimezone)}
                </p>
                <p data-member-booking-office-timezone="true">{labels.officeTimezone}: {officeTimezone}</p>
              </div>
              {booking.meetingLink ? (
                <a className={styles.accountLink} href={booking.meetingLink} rel="noreferrer" target="_blank" data-member-booking-meeting-link="true">
                  {labels.meeting}
                </a>
              ) : null}
            </article>
            <article className={styles.accountCard}>
              <div>
                <strong>{labels.bookingId}</strong>
                <p data-member-booking-id-detail="true">{booking.bookingId}</p>
              </div>
              <Link className={styles.accountLink} href={`/${locale}/account/bookings`}>
                {labels.back}
              </Link>
            </article>
          </div>

          <section className={styles.bookingsPanel} data-member-booking-policy="true">
            <div className={styles.bookingsHeader}>
              <div>
                <p>{labels.eyebrow}</p>
                <h2>{labels.policy}</h2>
              </div>
              <span>{labels.policyHours}: {bookingPolicy.hoursUntilStart.toFixed(1)}h</span>
            </div>
            <div className={styles.bookingList}>
              <article className={styles.accountCard} data-member-booking-policy-card="summary">
                <div>
                  <strong>{bookingPolicy.name}</strong>
                  {bookingPolicy.description ? <p>{bookingPolicy.description}</p> : null}
                  <p>{labels.policyDetail}</p>
                  <p>{labels.policyRefund}: {bookingPolicy.refundDecision}</p>
                </div>
              </article>
              <article className={styles.accountCard} data-member-booking-policy-card="status">
                <div>
                  <strong>{labels.policyCancel}</strong>
                  <p>{bookingPolicy.canCancel ? labels.allowed : labels.blocked}</p>
                  {bookingPolicy.cancelBlockedReason ? <p>{bookingPolicy.cancelBlockedReason}</p> : null}
                </div>
              </article>
              <article className={styles.accountCard} data-member-booking-policy-card="reschedule">
                <div>
                  <strong>{labels.policyReschedule}</strong>
                  <p>{bookingPolicy.canReschedule ? labels.allowed : labels.blocked}</p>
                  {bookingPolicy.rescheduleBlockedReason ? <p>{bookingPolicy.rescheduleBlockedReason}</p> : null}
                </div>
              </article>
            </div>
          </section>

          {bookingPolicy.canReschedule ? (
            <section className={styles.bookingsPanel} data-member-booking-reschedule-panel="true">
              <div className={styles.bookingsHeader}>
                <div>
                  <p>{labels.eyebrow}</p>
                  <h2>{labels.rescheduleBooking}</h2>
                </div>
                <span>{bookingPolicy.rescheduleHoursBefore}h</span>
              </div>
              <p className={styles.muted}>{labels.policyDetail}</p>
              <RescheduleBookingButton
                className={styles.bookingRescheduleForm}
                dataRescheduleBooking={booking.bookingId}
                doneLabel={labels.rescheduledBooking}
                failedLabel={labels.rescheduleBookingFailed}
                href={`/${locale}/account/bookings/${booking.bookingId}/reschedule`}
                initialStartAt={booking.startAt}
                label={labels.rescheduleBooking}
                startLabel={labels.rescheduleStart}
                pendingLabel={labels.reschedulingBooking}
              />
            </section>
          ) : null}

          <section className={styles.bookingsPanel} data-member-booking-rebook="true">
            <div className={styles.bookingsHeader}>
              <div>
                <p>{labels.eyebrow}</p>
                <h2>{labels.rebook}</h2>
              </div>
              <span>{booking.serviceName} · {booking.staffName}</span>
            </div>
            <p className={styles.muted}>{labels.rebookSubtitle}</p>
            <p className={styles.muted}>{labels.rebookHint}</p>
            <details className={styles.rebookDetails} data-member-booking-rebook-toggle="true">
              <summary className={styles.rebookSummary}>{labels.rebook}</summary>
              <div className={styles.rebookFlow} data-member-booking-rebook-flow="true">
                <BookingFlowSteps
                  locale={locale}
                  serviceId={sourceBooking.serviceId}
                  staffId={sourceBooking.staffId}
                  successMessage={labels.rebookSuccess}
                  initialCustomer={rebookCustomer}
                />
              </div>
            </details>
          </section>

          <section className={styles.bookingsPanel} data-member-booking-documents="true">
            <div className={styles.bookingsHeader}>
              <div>
                <p>{labels.eyebrow}</p>
                <h2>{labels.billing}</h2>
              </div>
              <span>{bookingDocuments.unpaidInvoices.length + bookingDocuments.paidReceipts.length + bookingDocuments.archived.length}</span>
            </div>
            {bookingDocuments.unpaidInvoices.length === 0 && bookingDocuments.paidReceipts.length === 0 && bookingDocuments.archived.length === 0 ? (
              <p className={styles.emptyState}>{labels.billingEmpty}</p>
            ) : (
              <div className={styles.bookingList}>
                {[...bookingDocuments.unpaidInvoices, ...bookingDocuments.paidReceipts, ...bookingDocuments.archived].map((document) => (
                  <article key={document.documentId} className={styles.accountCard} data-member-booking-document-card={document.documentId}>
                    <div>
                      <strong>{document.typeLabel} · {document.number}</strong>
                      <p>{document.statusLabel}</p>
                      <p>{document.contextLabel}</p>
                      <p>{document.totalLabel} · {document.balanceDueLabel}</p>
                    </div>
                    <div className={styles.bookingActions}>
                      {document.sharePath ? (
                        <Link className={styles.accountLink} href={document.sharePath} target="_blank" rel="noreferrer" data-member-booking-document-open={document.documentId}>
                          {labels.openDocument}
                        </Link>
                      ) : null}
                      {document.downloadPath ? (
                        <Link className={styles.accountLink} href={document.downloadPath} download data-member-booking-document-download={document.documentId}>
                          {labels.downloadDocument}
                        </Link>
                      ) : null}
                      {document.downloadPath ? (
                        <CopyLinkButton
                          className={styles.accountLink}
                          copiedLabel={labels.copiedDocumentLink}
                          dataCopyLink={document.documentId}
                          href={document.downloadPath}
                          label={labels.copyDocumentLink}
                        />
                      ) : null}
                      {document.source === 'booking' ? (
                        <SendDocumentEmailButton
                          className={styles.accountLink}
                          dataSendEmail={document.documentId}
                          failedLabel={labels.emailFailedDocument}
                          href={`/${locale}/account/bookings/${document.ownerLabel}/documents/${document.documentId}/email`}
                          label={labels.emailDocument}
                          pendingLabel={labels.emailingDocument}
                          sentLabel={labels.emailedDocument}
                        />
                      ) : null}
                      {document.paymentLinkPath ? (
                        <Link className={styles.accountLink} href={document.paymentLinkPath} data-member-booking-document-pay={document.documentId}>
                          {labels.payDocument}
                        </Link>
                      ) : null}
                      {document.paymentLinkPath ? (
                        <CopyLinkButton
                          className={styles.accountLink}
                          copiedLabel={labels.copiedPaymentLink}
                          dataCopyLink={`payment-${document.documentId}`}
                          href={document.paymentLinkPath}
                          label={labels.copyPaymentLink}
                        />
                      ) : null}
                      {document.type === 'invoice' && document.balanceDue > 0 && (!document.paymentLinkPath || document.paymentLinkRenewalNeeded) ? (
                        <RenewPaymentLinkButton
                          className={styles.accountLink}
                          dataRenewPaymentLink={document.documentId}
                          failedLabel={labels.renewFailedDocument}
                          href={`/${locale}/account/billing/documents/${document.documentId}/payment-link`}
                          label={labels.renewDocument}
                          pendingLabel={labels.renewingDocument}
                          renewedLabel={labels.renewedDocument}
                        />
                      ) : null}
                      {!document.sharePath && !document.paymentLinkPath ? (
                        <Link className={styles.accountLink} href={`/${locale}/account/billing`}>
                          {labels.billingPortal}
                        </Link>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className={styles.bookingsPanel} data-member-booking-package="true">
            <div className={styles.bookingsHeader}>
              <div>
                <p>{labels.eyebrow}</p>
                <h2>{labels.package}</h2>
              </div>
              <span>{sourceBooking.packageId || sourceBooking.packageCreditId ? sourceBooking.packageId ?? sourceBooking.packageCreditId : '—'}</span>
            </div>
            {!sourceBooking.packageId && !sourceBooking.packageCreditId ? (
              <p className={styles.emptyState}>{labels.packageEmpty}</p>
            ) : (
              <div className={styles.bookingList}>
                <article className={styles.accountCard} data-member-booking-package-card="summary">
                  <div>
                    <strong>{labels.packageName}</strong>
                    <p>{bookingPackage ? textForLocale(bookingPackage.name, locale) : sourceBooking.packageId}</p>
                    <p>{labels.packageId}: {sourceBooking.packageId ?? '—'}</p>
                    {bookingPackage?.credits ? <p>{labels.packageCredit}: {bookingPackage.credits}</p> : null}
                    {bookingPackage?.validityDays ? <p>{labels.packageExpires}: {bookingPackage.validityDays} days</p> : null}
                    {sourceBooking.packageCreditsUsed ? <p>{labels.packageUsed}: {sourceBooking.packageCreditsUsed}</p> : null}
                  </div>
                </article>
                {bookingCredit ? (
                  <article className={styles.accountCard} data-member-booking-package-card="credit">
                    <div>
                      <strong>{labels.packageStatus}</strong>
                      <p data-member-booking-package-status="true">{packageCreditStatusLabel(locale, bookingCredit.status)}</p>
                      <p>{labels.packageId}: {bookingCredit.packageId}</p>
                      <p>{labels.packageRemaining}: {bookingCredit.remainingCredits} / {bookingCredit.totalCredits}</p>
                      {bookingCredit.expiresAt ? <p>{labels.packageExpires}: {bookingCredit.expiresAt}</p> : null}
                      {sourceBooking.packageCreditRestoredAt ? <p>{labels.packageRestored}: {sourceBooking.packageCreditRestoredAt}</p> : null}
                    </div>
                  </article>
                ) : null}
                {bookingRedemptions.length > 0 ? (
                  <article className={styles.accountCard} data-member-booking-package-card="usage">
                    <div>
                      <strong>{labels.packageUsage}</strong>
                      {bookingRedemptions.map((redemption) => (
                        <p key={`${redemption.bookingId}-${redemption.usedAt}`}>
                          {redemption.serviceId} · {redemption.credits} · {redemption.usedAt}
                          {redemption.restoredAt ? ` · ${redemption.restoredAt}` : ''}
                        </p>
                      ))}
                    </div>
                  </article>
                ) : null}
              </div>
            )}
          </section>
        </section>
      </section>
    </main>
  );
}
