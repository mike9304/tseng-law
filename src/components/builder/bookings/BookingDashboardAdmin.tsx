'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type {
  Booking,
  BookingBillingDocumentType,
  BookingBillingDocumentStatus,
  BookingManualPaymentMethod,
  BookingManualPaymentStatus,
  BookingService,
  BookingStatus,
  BookingWaitlistEntry,
  BookingWaitlistStatus,
  StaffAvailability,
  Staff,
} from '@/lib/builder/bookings/types';
import { dayOfWeeks, textForLocale } from '@/lib/builder/bookings/types';
import { formatDateTimeInTimezone } from '@/lib/builder/bookings/timezone';
import { formatDateTime as formatDateTimeLocale } from '@/lib/builder/format/datetime';
import {
  buildBookingAnalytics,
  buildBookingAnalyticsBundle,
  buildBookingDashboardAlerts,
  buildBookingSourceBreakdown,
  buildBookingSourceFunnelBreakdown,
  buildCustomerProfiles,
} from '@/lib/builder/bookings/analytics';
import { buildBookingPaymentAttribution } from '@/lib/builder/bookings/analytics-attribution';
import { normalizeBookingDashboardActionFilter, normalizeBookingDashboardQuery, type BookingDashboardActionFilter } from '@/lib/builder/bookings/dashboard-url';
import {
  buildBookingDashboardReportFile,
  buildBookingDashboardReportFilename,
  buildBookingDashboardVisibleBookingsCsvFilename,
  serializeBookingDashboardReportFile,
  serializeBookingDashboardVisibleBookingsCsv,
} from '@/lib/builder/bookings/dashboard-report';
import type { Locale } from '@/lib/locales';
import { BookingPaymentAttributionPanel } from './BookingPaymentAttributionPanel';
import styles from './BookingsAdmin.module.css';

const statusOptions = ['', 'pending', 'confirmed', 'completed', 'no-show', 'cancelled'] as const;

const statusActions = ['confirmed', 'completed', 'no-show', 'cancelled'] as const;

const actionFilterOptions = ['today', 'pending', 'unpaid', 'waitlist', 'no-show', 'documents'] as const;

type ActionFilter = (typeof actionFilterOptions)[number];

function actionFilterLabel(locale: Locale, value: ActionFilter): string {
  if (locale === 'ko') {
    switch (value) {
      case 'today': return '오늘';
      case 'pending': return '대기';
      case 'unpaid': return '미결제';
      case 'waitlist': return '대기 목록';
      case 'no-show': return '노쇼';
      case 'documents': return '문서 필요';
    }
  }
  if (locale === 'zh-hant') {
    switch (value) {
      case 'today': return '今天';
      case 'pending': return '待處理';
      case 'unpaid': return '未付款';
      case 'waitlist': return '候補名單';
      case 'no-show': return '未到';
      case 'documents': return '需要文件';
    }
  }
  switch (value) {
    case 'today': return 'Today';
    case 'pending': return 'Pending';
    case 'unpaid': return 'Unpaid';
    case 'waitlist': return 'Waitlist';
    case 'no-show': return 'No-show';
    case 'documents': return 'Needs documents';
  }
  return value;
}

function bookingStatusLabel(locale: Locale, status: BookingStatus | ''): string {
  if (locale === 'ko') {
    switch (status) {
      case 'pending': return '대기';
      case 'confirmed': return '확정';
      case 'completed': return '완료';
      case 'no-show': return '노쇼';
      case 'cancelled': return '취소됨';
      default: return '전체 상태';
    }
  }
  if (locale === 'zh-hant') {
    switch (status) {
      case 'pending': return '待處理';
      case 'confirmed': return '已確認';
      case 'completed': return '已完成';
      case 'no-show': return '未到';
      case 'cancelled': return '已取消';
      default: return '全部狀態';
    }
  }
  switch (status) {
    case 'pending': return 'Pending';
    case 'confirmed': return 'Confirmed';
    case 'completed': return 'Completed';
    case 'no-show': return 'No-show';
    case 'cancelled': return 'Cancelled';
    default: return 'All statuses';
  }
}

function bookingPaymentStatusLabel(locale: Locale, paymentStatus: Booking['paymentStatus'], paymentMode?: BookingService['paymentMode']): string {
  if (locale === 'ko') {
    if (!paymentStatus) return paymentMode === 'paid' ? '미결제' : '무료';
    switch (paymentStatus) {
      case 'paid': return '결제 완료';
      case 'unpaid': return '미결제';
      case 'partially_paid': return '부분 결제';
      case 'refunded': return '환불됨';
      case 'partial-refund': return '부분 환불';
      default: return paymentStatus;
    }
  }
  if (locale === 'zh-hant') {
    if (!paymentStatus) return paymentMode === 'paid' ? '未付款' : '免費';
    switch (paymentStatus) {
      case 'paid': return '已付款';
      case 'unpaid': return '未付款';
      case 'partially_paid': return '部分付款';
      case 'refunded': return '已退款';
      case 'partial-refund': return '部分退款';
      default: return paymentStatus;
    }
  }
  if (!paymentStatus) return paymentMode === 'paid' ? 'Unpaid' : 'Free';
  switch (paymentStatus) {
    case 'paid': return 'Paid';
    case 'unpaid': return 'Unpaid';
    case 'partially_paid': return 'Partially paid';
    case 'refunded': return 'Refunded';
    case 'partial-refund': return 'Partial refund';
    default: return paymentStatus;
  }
}

function waitlistStatusLabel(locale: Locale, status: BookingWaitlistStatus): string {
  if (locale === 'ko') {
    switch (status) {
      case 'active': return '활성';
      case 'contacted': return '연락됨';
      case 'closed': return '종료';
      case 'promoted': return '승격됨';
    }
  }
  if (locale === 'zh-hant') {
    switch (status) {
      case 'active': return '啟用中';
      case 'contacted': return '已聯絡';
      case 'closed': return '已關閉';
      case 'promoted': return '已轉為預約';
    }
  }
  switch (status) {
    case 'active': return 'Active';
    case 'contacted': return 'Contacted';
    case 'closed': return 'Closed';
    case 'promoted': return 'Promoted';
  }
  return status;
}

function manualPaymentMethodLabel(locale: Locale, method: BookingManualPaymentMethod): string {
  if (locale === 'ko') {
    switch (method) {
      case 'bank_transfer': return '계좌이체';
      case 'cash': return '현금';
      case 'check': return '수표';
      case 'other': return '기타';
    }
  }
  if (locale === 'zh-hant') {
    switch (method) {
      case 'bank_transfer': return '銀行轉帳';
      case 'cash': return '現金';
      case 'check': return '支票';
      case 'other': return '其他';
    }
  }
  switch (method) {
    case 'bank_transfer': return 'Bank transfer';
    case 'cash': return 'Cash';
    case 'check': return 'Check';
    case 'other': return 'Other';
  }
  return method;
}

function manualPaymentStatusLabel(locale: Locale, status: BookingManualPaymentStatus): string {
  if (locale === 'ko') {
    switch (status) {
      case 'pending': return '대기';
      case 'succeeded': return '성공';
      case 'failed': return '실패';
      case 'canceled': return '취소됨';
    }
  }
  if (locale === 'zh-hant') {
    switch (status) {
      case 'pending': return '待處理';
      case 'succeeded': return '成功';
      case 'failed': return '失敗';
      case 'canceled': return '已取消';
    }
  }
  switch (status) {
    case 'pending': return 'Pending';
    case 'succeeded': return 'Succeeded';
    case 'failed': return 'Failed';
    case 'canceled': return 'Canceled';
  }
  return status;
}

function billingDocumentStatusLabel(locale: Locale, status: BookingBillingDocumentStatus): string {
  if (locale === 'ko') {
    switch (status) {
      case 'issued': return '발행됨';
      case 'emailed_stub': return '이메일 발송됨';
      case 'voided': return '무효';
      case 'superseded': return '대체됨';
    }
  }
  if (locale === 'zh-hant') {
    switch (status) {
      case 'issued': return '已開立';
      case 'emailed_stub': return '已寄送';
      case 'voided': return '已作廢';
      case 'superseded': return '已取代';
    }
  }
  switch (status) {
    case 'issued': return 'Issued';
    case 'emailed_stub': return 'Emailed';
    case 'voided': return 'Voided';
    case 'superseded': return 'Superseded';
  }
  return status;
}

function documentTypeLabel(locale: Locale, type: BookingBillingDocumentType): string {
  if (locale === 'ko') return type === 'invoice' ? '청구서' : '영수증';
  if (locale === 'zh-hant') return type === 'invoice' ? '發票' : '收據';
  return type === 'invoice' ? 'Invoice' : 'Receipt';
}

function bookingMetaCopy(locale: Locale) {
  const ko = locale === 'ko';
  const zh = locale === 'zh-hant';
  return {
    reportTitle: ko ? '예약 리포트' : zh ? '預約報表' : 'Booking report',
    reportSubtitle: ko
      ? '현재 대시보드 필터, 활용도 요약, 표시 중인 큐 행, 표시 중인 예약을 JSON 또는 CSV로 다운로드합니다.'
      : zh
        ? '下載目前儀表板篩選、使用率摘要、顯示中的佇列列與預約清單，輸出為 JSON 或 CSV。'
        : 'Download the current dashboard filters, utilization summary, visible queue rows, or visible bookings as JSON or CSV.',
    actionQueueTitle: ko ? '오늘 처리할 항목' : zh ? '今日待處理' : 'Today needs attention',
    actionQueueSubtitle: ko
      ? '당일 검토가 자주 필요한 예약 작업에 빠르게 접근합니다.'
      : zh
        ? '快速查看當日通常需要審核的預約操作。'
        : 'Fast access to booking operations that usually need same-day review.',
    meetingLink: ko ? '미팅 링크' : zh ? '會議連結' : 'Meeting link',
    sourceAttributionTitle: ko ? '출처 귀속' : zh ? '來源歸因' : 'Source attribution',
    sourceAttributionSubtitle: ko ? '생성 출처별 예약 믹스와 완료/수익 맥락을 보여줍니다.' : zh ? '依建立來源拆分預約組成，並顯示完成率與營收脈絡。' : 'Booking mix by creation source with completion and revenue context.',
    sourceFunnelTitle: ko ? '출처 퍼널' : zh ? '來源漏斗' : 'Source funnel',
    sourceFunnelSubtitle: ko ? '리드에서 확정, 완료까지의 비율을 출처별로 나눕니다.' : zh ? '按來源拆分從潛在客戶到確認與完成的轉換率。' : 'Lead-to-confirm and lead-to-complete rates split by source.',
    paymentAttributionTitle: ko ? '결제 채널 귀속' : zh ? '付款管道歸因' : 'Payment channel attribution',
    paymentAttributionSubtitle: ko ? 'Stripe, 수동 결제, 패키지 크레딧, 후불, 무료 예약의 예약 수와 수익 맥락을 분리합니다.' : zh ? '拆分 Stripe、手動付款、方案點數、稍後付款與免費預約的預約數與營收脈絡。' : 'Splits bookings and revenue context across Stripe, manual payments, package credits, pay-later, and free bookings.',
    alertsTitle: ko ? '알림' : zh ? '警示' : 'Alerts',
    alertsSubtitle: ko ? '현재 예약 구성과 추세 창에서 파생한 신호 배너입니다.' : zh ? '由當前預約組合與趨勢視窗推導出的信號橫幅。' : 'Signal banners derived from the current booking mix and trend window.',
    trendTitle: ko ? '추세' : zh ? '趨勢' : 'Trend',
    trendSubtitle: ko ? '현재 필터 집합의 일별 예약 수와 완료/취소 상태 비중입니다.' : zh ? '目前篩選條件下的每日預約量，以及完成/取消狀態組成。' : 'Daily booking volume for the current filter set, with completed and cancelled state mix.',
    utilizationTitle: ko ? '활용도' : zh ? '使用率' : 'Utilization',
    utilizationSubtitle: ko ? '예약된 분, 담당자 부하, 가장 바쁜 시간대를 보여줍니다.' : zh ? '顯示已預約分鐘數、員工負載與最忙時段。' : 'Booked minutes, staff load, and the busiest time windows for the current filter set.',
    servicesLabel: ko ? '서비스' : zh ? '服務' : 'Services',
    customersLabel: ko ? '고객' : zh ? '客戶' : 'Customers',
    completedSuffix: ko ? ' 완료' : zh ? ' 已完成' : ' completed',
    cancelledSuffix: ko ? ' 취소됨' : zh ? ' 已取消' : ' cancelled',
    noShowSuffix: ko ? ' 노쇼' : zh ? ' 未到' : ' no-shows',
    bookedPaidPayments: ko ? '예약된 유료 결제' : zh ? '已預約的付費款項' : 'Booked paid payments',
    peakBookingsSuffix: ko ? '최대 예약' : zh ? '尖峰預約' : 'peak bookings',
    peakWindowsSuffix: ko ? '피크 창' : zh ? '高峰時段' : 'peak windows',
    minutesLabel: ko ? '분' : zh ? '分鐘' : 'minutes',
    capacityUnknown: ko ? '용량 미확인' : zh ? '容量未知' : 'capacity unknown',
    itemsSuffix: ko ? '개 항목' : zh ? '項目' : 'items',
    actionFiltersLabel: ko ? '예약 작업 필터' : zh ? '預約操作篩選' : 'Booking action filters',
    openLabel: ko ? '열기' : zh ? '開啟' : 'Open',
    reviewLabel: ko ? '검토' : zh ? '查看' : 'Review',
    due: ko ? '미결제' : zh ? '應收' : 'Due',
    docs: ko ? '문서' : zh ? '文件' : 'Docs',
    noBookingActions: ko ? '이 필터에 해당하는 예약 작업이 없습니다.' : zh ? '此篩選條件沒有預約操作。' : 'No booking actions for this filter.',
    searchLabel: ko ? '검색' : zh ? '搜尋' : 'Search',
    searchPlaceholder: ko ? '이름, 이메일, 메모, 서비스' : zh ? '姓名、電子郵件、備註、服務' : 'Name, email, notes, service',
    statusLabel: ko ? '상태' : zh ? '狀態' : 'Status',
    allStaff: ko ? '모든 담당자' : zh ? '所有員工' : 'All staff',
    staffLabel: ko ? '담당자' : zh ? '員工' : 'Staff',
    serviceLabel: ko ? '서비스' : zh ? '服務' : 'Service',
    allServices: ko ? '모든 서비스' : zh ? '所有服務' : 'All services',
    fromLabel: ko ? '시작일' : zh ? '起始日' : 'From',
    toLabel: ko ? '종료일' : zh ? '結束日' : 'To',
    timeLabel: ko ? '시간' : zh ? '時間' : 'Time',
    customerLabel: ko ? '고객' : zh ? '客戶' : 'Customer',
    paymentLabel: ko ? '결제' : zh ? '付款' : 'Payment',
    documentsLabel: ko ? '문서' : zh ? '文件' : 'Documents',
    visitsSuffix: ko ? '회 방문' : zh ? '次拜訪' : 'visits',
    noBookings: ko ? '이 필터에 맞는 예약이 없습니다.' : zh ? '沒有符合此篩選條件的預約。' : 'No bookings match these filters.',
    waitlistTitle: ko ? '대기 목록' : zh ? '候補名單' : 'Waitlist',
    waitlistSubtitle: ko ? '전체 날짜와 시간 미지정 요청입니다. 승격하면 요청 날짜에 가장 가까운 가능한 예약을 만듭니다.' : zh ? '完整日期與無時段需求。轉為預約會建立符合請求日期的下一個可用預約。' : 'Full dates and no-slot requests. Promote creates the next available booking for the requested date.',
    waitlistActiveSuffix: ko ? ' 활성' : zh ? ' 啟用中' : ' active',
    requestedLabel: ko ? '요청일' : zh ? '請求日' : 'Requested',
    actionsLabel: ko ? '작업' : zh ? '操作' : 'Actions',
    promoteLabel: ko ? '승격' : zh ? '轉為預約' : 'Promote',
    markActiveLabel: ko ? '활성으로 표시' : zh ? '標記為啟用' : 'Mark active',
    contactedLabel: ko ? '연락됨' : zh ? '已聯絡' : 'Contacted',
    closeLabel: ko ? '닫기' : zh ? '關閉' : 'Close',
    noWaitlist: ko ? '아직 대기 목록 요청이 없습니다.' : zh ? '尚無候補名單請求。' : 'No waitlist requests yet.',
    customerMetaLabel: ko ? '고객' : zh ? '客戶' : 'Customer',
    emailLabel: ko ? '이메일' : zh ? '電子郵件' : 'Email',
    phoneLabel: ko ? '전화' : zh ? '電話' : 'Phone',
    timezoneLabel: ko ? '시간대' : zh ? '時區' : 'Timezone',
    caseLabel: ko ? '사례' : zh ? '案件' : 'Case',
    scheduleContextLabel: ko ? '일정 맥락' : zh ? '行程脈絡' : 'Schedule context',
    officeTimeLabel: ko ? '오피스 시간' : zh ? '辦公時間' : 'Office time',
    officeTimezoneLabel: ko ? '오피스 시간대' : zh ? '辦公時區' : 'Office timezone',
    customerTimeLabel: ko ? '고객 시간' : zh ? '客戶時間' : 'Customer time',
    customerProfileLabel: ko ? '고객 프로필' : zh ? '客戶檔案' : 'Customer profile',
    totalVisitsLabel: ko ? '총 방문' : zh ? '總拜訪' : 'Total visits',
    upcomingLabel: ko ? '예정' : zh ? '即將到來' : 'Upcoming',
    completedLabel: ko ? '완료' : zh ? '已完成' : 'Completed',
    cancelledLabel: ko ? '취소됨' : zh ? '已取消' : 'Cancelled',
    rescheduleLabel: ko ? '재조정' : zh ? '重新排程' : 'Reschedule',
    startTimeLabel: ko ? '시작 시간' : zh ? '開始時間' : 'Start time',
    saveRescheduleLabel: ko ? '재조정 저장' : zh ? '儲存重新排程' : 'Save reschedule',
    savingLabel: ko ? '저장 중...' : zh ? '儲存中...' : 'Saving...',
    manualPaymentsLabel: ko ? '수동 결제' : zh ? '手動付款' : 'Manual payments',
    manualPaymentsSubtitle: ko ? '오프라인 결제를 기록하고 예약 송장 잔액을 최신으로 유지합니다.' : zh ? '記錄離線付款，並保持預約發票餘額最新。' : 'Record offline payments and keep booking invoice balances current.',
    paymentTotalLabel: ko ? '총액' : zh ? '總額' : 'Total',
    paidLabel: ko ? '결제됨' : zh ? '已付款' : 'Paid',
    dueLabel: ko ? '잔액' : zh ? '應付' : 'Due',
    noReference: ko ? '참조 없음' : zh ? '無參考' : 'No reference',
    noManualPayments: ko ? '기록된 수동 결제가 없습니다.' : zh ? '尚未記錄手動付款。' : 'No manual payments recorded.',
    amountLabel: ko ? '금액' : zh ? '金額' : 'Amount',
    methodLabel: ko ? '방법' : zh ? '方式' : 'Method',
    referenceLabel: ko ? '참조' : zh ? '參考' : 'Reference',
    noteLabel: ko ? '메모' : zh ? '備註' : 'Note',
    recordManualPaymentLabel: ko ? '수동 결제 기록' : zh ? '記錄手動付款' : 'Record manual payment',
    recordingLabel: ko ? '기록 중...' : zh ? '記錄中...' : 'Recording...',
    billingDocumentsLabel: ko ? '결제 문서' : zh ? '帳單文件' : 'Billing documents',
    billingDocumentsSubtitle: ko ? '이 예약에 대한 스냅샷 청구서와 영수증을 발행합니다.' : zh ? '為此預約發出快照發票與收據。' : 'Issue snapshot invoices and receipts for this booking.',
    issueInvoiceLabel: ko ? '청구서 발행' : zh ? '開立發票' : 'Issue invoice',
    emailInvoiceLabel: ko ? '청구서 이메일' : zh ? '寄送發票' : 'Email invoice',
    issueReceiptLabel: ko ? '영수증 발행' : zh ? '開立收據' : 'Issue receipt',
    emailReceiptLabel: ko ? '영수증 이메일' : zh ? '寄送收據' : 'Email receipt',
    allDocumentsLabel: ko ? '모든 문서' : zh ? '所有文件' : 'All documents',
    noBillingDocuments: ko ? '아직 결제 문서가 없습니다.' : zh ? '尚無帳單文件。' : 'No billing documents yet.',
    dueDocLabel: ko ? '잔액' : zh ? '應付' : 'Due',
    refundedLabel: ko ? '환불됨' : zh ? '已退款' : 'Refunded',
    createdLabel: ko ? '생성됨' : zh ? '已建立' : 'Created',
    currentStatusLabel: ko ? '현재 상태' : zh ? '目前狀態' : 'Current status',
    scheduledLabel: ko ? '예약됨' : zh ? '已排程' : 'Scheduled',
    lastUpdatedLabel: ko ? '마지막 업데이트' : zh ? '最後更新' : 'Last updated',
    cancelledAtLabel: ko ? '취소됨' : zh ? '已取消' : 'Cancelled',
    noPaymentLabel: ko ? '결제 없음' : zh ? '無付款' : 'no payment',
    docsSuffix: ko ? '문서' : zh ? '文件' : 'docs',
  } as const;
}

function bookingTrendLabel(locale: Locale, item: { day: string; completed: number; pending: number; cancelled: number; noShow: number; total: number }) {
  if (locale === 'ko') {
    return `완료 ${item.completed} · 대기 ${item.pending} · 취소됨 ${item.cancelled} · 노쇼 ${item.noShow}`;
  }
  if (locale === 'zh-hant') {
    return `已完成 ${item.completed} · 待處理 ${item.pending} · 已取消 ${item.cancelled} · 未到 ${item.noShow}`;
  }
  return `Completed ${item.completed} · Pending ${item.pending} · Cancelled ${item.cancelled} · No-show ${item.noShow}`;
}

function toLocalInputValue(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function localInputToIso(value: string): string {
  return new Date(value).toISOString();
}

function formatDateTime(locale: Locale, iso: string): string {
  return formatDateTimeLocale(iso, locale);
}

function formatMoney(locale: Locale, amount: number, currency: BookingService['priceCurrency'] = 'TWD'): string {
  const divisor = currency === 'KRW' || currency === 'JPY' ? 1 : 100;
  const intlLocale = locale === 'ko' ? 'ko-KR' : locale === 'zh-hant' ? 'zh-TW' : 'en-US';
  return new Intl.NumberFormat(intlLocale, { currency, style: 'currency' }).format(amount / divisor);
}

function successfulManualPaymentTotal(booking: Booking): number {
  return (booking.manualPayments ?? [])
    .filter((payment) => payment.status === 'succeeded')
    .reduce((total, payment) => total + payment.amountCents, 0);
}

function successfulOnlinePaymentTotal(booking: Booking): number {
  return Math.max(0, booking.onlinePaidAmount ?? 0);
}

function bookingPaymentAmount(booking: Booking, service?: BookingService): number {
  return Math.max(0, booking.paymentAmount ?? service?.priceAmount ?? service?.priceTwd ?? 0);
}

function bookingBalanceDue(booking: Booking, service?: BookingService): number {
  if (booking.paymentStatus === 'paid' || booking.paymentStatus === 'refunded' || booking.paymentStatus === 'partial-refund') return 0;
  return Math.max(0, bookingPaymentAmount(booking, service) - successfulOnlinePaymentTotal(booking) - successfulManualPaymentTotal(booking));
}

function canRecordManualPayment(booking: Booking, service?: BookingService): boolean {
  return booking.status !== 'cancelled'
    && booking.paymentStatus !== 'paid'
    && booking.paymentStatus !== 'refunded'
    && booking.paymentStatus !== 'partial-refund'
    && bookingBalanceDue(booking, service) > 0;
}

function localDateKey(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-CA');
}

function isTodayBooking(booking: Booking): boolean {
  return localDateKey(booking.startAt) === localDateKey(new Date().toISOString());
}

function needsBillingDocument(booking: Booking, service?: BookingService): boolean {
  const documents = booking.billingDocuments ?? [];
  const hasInvoice = documents.some((document) => document.type === 'invoice' && document.status !== 'voided');
  const hasReceipt = documents.some((document) => document.type === 'receipt' && document.status !== 'voided');
  const paidLike = booking.paymentStatus === 'paid'
    || booking.paymentStatus === 'refunded'
    || booking.paymentStatus === 'partial-refund';
  return (service?.paymentMode === 'paid' && !hasInvoice) || (paidLike && !hasReceipt);
}

export default function BookingDashboardAdmin({
  locale,
  initialBookings,
  initialWaitlist,
  services,
  staff,
  availability,
  initialActionFilter,
  initialQuery,
}: {
  locale: Locale;
  initialBookings: Booking[];
  initialWaitlist: BookingWaitlistEntry[];
  services: BookingService[];
  staff: Staff[];
  availability: StaffAvailability[];
  initialActionFilter?: BookingDashboardActionFilter;
  initialQuery?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchKey = searchParams.toString();
  const skipNextUrlPushRef = useRef(false);
  const [bookings, setBookings] = useState(initialBookings);
  const [waitlistEntries, setWaitlistEntries] = useState(initialWaitlist);
  const [query, setQuery] = useState(initialQuery ?? normalizeBookingDashboardQuery(searchParams.get('q')));
  const [statusFilter, setStatusFilter] = useState<'' | BookingStatus>('');
  const [staffFilter, setStaffFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [actionFilter, setActionFilter] = useState<ActionFilter>(initialActionFilter ?? normalizeBookingDashboardActionFilter(searchParams.get('action')));
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selected, setSelected] = useState<Booking | null>(null);
  const [draftStaffId, setDraftStaffId] = useState('');
  const [draftStartAt, setDraftStartAt] = useState('');
  const [saving, setSaving] = useState(false);
  const [waitlistActionId, setWaitlistActionId] = useState<string | null>(null);
  const [documentActionId, setDocumentActionId] = useState<string | null>(null);
  const [manualPaymentActionId, setManualPaymentActionId] = useState<string | null>(null);
  const [reporting, setReporting] = useState(false);
  const [csvReporting, setCsvReporting] = useState(false);
  const [manualPaymentDraft, setManualPaymentDraft] = useState<{
    amount: string;
    method: BookingManualPaymentMethod;
    reference: string;
    note: string;
  }>({ amount: '', method: 'bank_transfer', reference: '', note: '' });
  const [error, setError] = useState<string | null>(null);
  const dashboardUrlStateRef = useRef({ actionFilter, query });

  const serviceById = useMemo(() => new Map(services.map((service) => [service.serviceId, service])), [services]);
  const staffById = useMemo(() => new Map(staff.map((member) => [member.staffId, member])), [staff]);
  const availabilityByStaffId = useMemo(() => new Map(availability.map((item) => [item.staffId, item])), [availability]);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const fromMs = fromDate ? Date.parse(`${fromDate}T00:00:00`) : Number.NEGATIVE_INFINITY;
    const toMs = toDate ? Date.parse(`${toDate}T23:59:59`) : Number.POSITIVE_INFINITY;
    return bookings.filter((booking) => {
      const startMs = Date.parse(booking.startAt);
      const service = serviceById.get(booking.serviceId);
      const member = staffById.get(booking.staffId);
      const haystack = [
        booking.customer.name,
        booking.customer.email,
        booking.customer.phone ?? '',
        booking.customer.notes ?? '',
        booking.customer.caseSummary ?? '',
        textForLocale(service?.name, locale),
        textForLocale(member?.name, locale),
        ...(booking.billingDocuments ?? []).map((document) => `${document.type} ${document.number} ${document.status}`),
      ].join(' ').toLowerCase();
      return (!needle || haystack.includes(needle))
        && (!statusFilter || booking.status === statusFilter)
        && (!staffFilter || booking.staffId === staffFilter)
        && (!serviceFilter || booking.serviceId === serviceFilter)
        && startMs >= fromMs
        && startMs <= toMs;
    });
  }, [bookings, fromDate, locale, query, serviceById, serviceFilter, staffById, staffFilter, statusFilter, toDate]);
  const analytics = useMemo(() => buildBookingAnalytics(filtered, services, staff, locale), [filtered, locale, services, staff]);
  const analyticsBundle = useMemo(() => buildBookingAnalyticsBundle(filtered, services, staff, locale), [filtered, locale, services, staff]);
  const sourceBreakdown = useMemo(() => buildBookingSourceBreakdown(filtered, services), [filtered, services]);
  const sourceFunnel = useMemo(() => buildBookingSourceFunnelBreakdown(filtered), [filtered]);
  const paymentAttribution = useMemo(() => buildBookingPaymentAttribution(filtered, services, locale), [filtered, locale, services]);
  const customerProfiles = useMemo(() => buildCustomerProfiles(filtered), [filtered]);
  const copy = useMemo(() => bookingMetaCopy(locale), [locale]);
  const customerProfileByEmail = useMemo(
    () => new Map(customerProfiles.map((profile) => [profile.email, profile])),
    [customerProfiles],
  );
  const hasStubData = useMemo(() => bookings.some((booking) =>
    (booking.billingDocuments ?? []).some((document) => document.status === 'emailed_stub')
    || (booking.paymentIntentId ?? '').startsWith('pi_stub_')
    || (booking.manualPayments ?? []).some((payment) => (payment.reference ?? '').startsWith('pm_stub_')),
  ), [bookings]);

  useEffect(() => {
    dashboardUrlStateRef.current = { actionFilter, query };
  }, [actionFilter, query]);

  useEffect(() => {
    skipNextUrlPushRef.current = true;
    const params = new URLSearchParams(searchKey);
    const nextActionFilter = normalizeBookingDashboardActionFilter(params.get('action'));
    const nextQuery = normalizeBookingDashboardQuery(params.get('q'));
    const current = dashboardUrlStateRef.current;
    if (nextActionFilter !== current.actionFilter) setActionFilter(nextActionFilter);
    if (nextQuery !== current.query) setQuery(nextQuery);
  }, [searchKey]);

  useEffect(() => {
    if (skipNextUrlPushRef.current) {
      skipNextUrlPushRef.current = false;
      return;
    }
    const params = new URLSearchParams(searchKey);
    const trimmedQuery = query.trim();
    if (trimmedQuery) params.set('q', trimmedQuery); else params.delete('q');
    if (actionFilter !== 'today') params.set('action', actionFilter); else params.delete('action');
    const nextQuery = params.toString();
    if (nextQuery !== searchKey) {
      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
    }
  }, [actionFilter, pathname, query, router, searchKey]);
  const activeWaitlist = useMemo(
    () => waitlistEntries.filter((entry) => entry.status === 'active' || entry.status === 'contacted'),
    [waitlistEntries],
  );
  const actionBookings = useMemo(() => {
    const byFilter = {
      today: bookings.filter((booking) => isTodayBooking(booking) && booking.status !== 'cancelled'),
      pending: bookings.filter((booking) => booking.status === 'pending'),
      unpaid: bookings.filter((booking) => canRecordManualPayment(booking, serviceById.get(booking.serviceId))),
      'no-show': bookings.filter((booking) => booking.status === 'no-show'),
      documents: bookings.filter((booking) => needsBillingDocument(booking, serviceById.get(booking.serviceId))),
    } satisfies Record<Exclude<ActionFilter, 'waitlist'>, Booking[]>;
    return byFilter;
  }, [bookings, serviceById]);
  const actionCounts = useMemo(() => ({
    today: actionBookings.today.length,
    pending: actionBookings.pending.length,
    unpaid: actionBookings.unpaid.length,
    waitlist: activeWaitlist.length,
    'no-show': actionBookings['no-show'].length,
    documents: actionBookings.documents.length,
  }), [actionBookings, activeWaitlist.length]);
  const dashboardAlerts = useMemo(() => buildBookingDashboardAlerts({
    analytics,
    pendingBookings: actionCounts.pending,
    waitlistEntries: activeWaitlist.length,
    trend: analyticsBundle.trend,
  }), [activeWaitlist.length, actionCounts.pending, analytics, analyticsBundle.trend]);
  const selectedActionBookings = actionFilter === 'waitlist' ? [] : actionBookings[actionFilter];
  const selectedActionWaitlist = actionFilter === 'waitlist' ? activeWaitlist : [];

  const openBooking = (booking: Booking) => {
    const service = serviceById.get(booking.serviceId);
    const balance = bookingBalanceDue(booking, service);
    setSelected(booking);
    setDraftStaffId(booking.staffId);
    setDraftStartAt(toLocalInputValue(booking.startAt));
    setManualPaymentDraft({
      amount: balance > 0 ? (balance / 100).toFixed(2) : '',
      method: 'bank_transfer',
      reference: '',
      note: '',
    });
    setError(null);
  };

  const patchBooking = async (booking: Booking, payload: Record<string, unknown>) => {
    setSaving(true);
    setError(null);
    try {
      const params = new URLSearchParams({ locale });
      const res = await fetch(`/api/builder/bookings/${booking.bookingId}?${params.toString()}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error || (locale === 'ko' ? '예약을 업데이트하지 못했습니다.' : locale === 'zh-hant' ? '無法更新預約。' : 'Booking update failed'));
      }
      const data = (await res.json()) as { booking: Booking };
      setBookings((current) => current.map((item) => item.bookingId === data.booking.bookingId ? data.booking : item));
      setSelected(data.booking);
      setDraftStaffId(data.booking.staffId);
      setDraftStartAt(toLocalInputValue(data.booking.startAt));
    } catch (err) {
      setError(err instanceof Error ? err.message : (locale === 'ko' ? '예약을 업데이트하지 못했습니다.' : locale === 'zh-hant' ? '無法更新預約。' : 'Booking update failed'));
    } finally {
      setSaving(false);
    }
  };

  const issueDocument = async (booking: Booking, type: BookingBillingDocumentType, email = false) => {
    const actionId = `${booking.bookingId}:${type}:${email ? 'email' : 'issue'}`;
    setDocumentActionId(actionId);
    setError(null);
    try {
      const params = new URLSearchParams({ locale });
      const res = await fetch(`/api/builder/bookings/${booking.bookingId}/documents?${params.toString()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ type, email }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error || (locale === 'ko' ? '문서 작업을 수행하지 못했습니다.' : locale === 'zh-hant' ? '無法執行文件操作。' : 'Document action failed'));
      }
      const data = (await res.json()) as { booking: Booking };
      setBookings((current) => current.map((item) => item.bookingId === data.booking.bookingId ? data.booking : item));
      setSelected(data.booking);
    } catch (err) {
      setError(err instanceof Error ? err.message : (locale === 'ko' ? '문서 작업을 수행하지 못했습니다.' : locale === 'zh-hant' ? '無法執行文件操作。' : 'Document action failed'));
    } finally {
      setDocumentActionId(null);
    }
  };

  const recordManualPayment = async (booking: Booking) => {
    const service = serviceById.get(booking.serviceId);
    const balance = bookingBalanceDue(booking, service);
    const amountCents = Math.round(Number(manualPaymentDraft.amount) * 100);
    if (!Number.isFinite(amountCents) || amountCents <= 0) {
      setError(locale === 'ko' ? '유효한 수동 결제 금액을 입력하세요.' : locale === 'zh-hant' ? '請輸入有效的手動付款金額。' : 'Enter a valid manual payment amount');
      return;
    }
    if (amountCents > balance) {
      setError(locale === 'ko' ? '수동 결제가 잔액을 초과합니다.' : locale === 'zh-hant' ? '手動付款超過應付餘額。' : 'Manual payment exceeds balance due');
      return;
    }

    setManualPaymentActionId(booking.bookingId);
    setError(null);
    try {
      const params = new URLSearchParams({ locale });
      const res = await fetch(`/api/builder/bookings/${booking.bookingId}/manual-payments?${params.toString()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          amountCents,
          method: manualPaymentDraft.method,
          reference: manualPaymentDraft.reference,
          note: manualPaymentDraft.note,
        }),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; booking?: Booking; error?: string } | null;
      if (!res.ok || !data?.ok || !data.booking) {
        throw new Error(data?.error || (locale === 'ko' ? '수동 결제에 실패했습니다.' : locale === 'zh-hant' ? '手動付款失敗。' : 'Manual payment failed'));
      }
      setBookings((current) => current.map((item) => item.bookingId === data.booking!.bookingId ? data.booking! : item));
      setSelected(data.booking);
      const nextBalance = bookingBalanceDue(data.booking, serviceById.get(data.booking.serviceId));
      setManualPaymentDraft({
        amount: nextBalance > 0 ? (nextBalance / 100).toFixed(2) : '',
        method: manualPaymentDraft.method,
        reference: '',
        note: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : (locale === 'ko' ? '수동 결제에 실패했습니다.' : locale === 'zh-hant' ? '手動付款失敗。' : 'Manual payment failed'));
    } finally {
      setManualPaymentActionId(null);
    }
  };

  const updateWaitlistEntry = (entry: BookingWaitlistEntry) => {
    setWaitlistEntries((current) => current.map((item) => item.waitlistId === entry.waitlistId ? entry : item));
  };

  const patchWaitlist = async (entry: BookingWaitlistEntry, status: Exclude<BookingWaitlistStatus, 'promoted'>) => {
    setWaitlistActionId(entry.waitlistId);
    setError(null);
    try {
      const params = new URLSearchParams({ locale });
      const res = await fetch(`/api/builder/bookings/waitlist/${entry.waitlistId}?${params.toString()}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error || (locale === 'ko' ? '대기 목록을 업데이트하지 못했습니다.' : locale === 'zh-hant' ? '無法更新候補名單。' : 'Waitlist update failed'));
      }
      const data = (await res.json()) as { waitlist: BookingWaitlistEntry };
      updateWaitlistEntry(data.waitlist);
    } catch (err) {
      setError(err instanceof Error ? err.message : (locale === 'ko' ? '대기 목록을 업데이트하지 못했습니다.' : locale === 'zh-hant' ? '無法更新候補名單。' : 'Waitlist update failed'));
    } finally {
      setWaitlistActionId(null);
    }
  };

  const promoteWaitlist = async (entry: BookingWaitlistEntry) => {
    setWaitlistActionId(entry.waitlistId);
    setError(null);
    try {
      const params = new URLSearchParams({ locale });
      const res = await fetch(`/api/builder/bookings/waitlist/${entry.waitlistId}/promote?${params.toString()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({}),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error || (locale === 'ko' ? '대기 목록 승격에 실패했습니다.' : locale === 'zh-hant' ? '候補名單轉為預約失敗。' : 'Waitlist promotion failed'));
      }
      const data = (await res.json()) as { booking?: Booking; waitlist: BookingWaitlistEntry };
      if (data.booking) {
        setBookings((current) => current.some((item) => item.bookingId === data.booking!.bookingId)
          ? current
          : [...current, data.booking!].sort((a, b) => a.startAt.localeCompare(b.startAt)));
      }
      updateWaitlistEntry(data.waitlist);
    } catch (err) {
      setError(err instanceof Error ? err.message : (locale === 'ko' ? '대기 목록 승격에 실패했습니다.' : locale === 'zh-hant' ? '候補名單轉為預約失敗。' : 'Waitlist promotion failed'));
    } finally {
      setWaitlistActionId(null);
    }
  };

  const selectedService = selected ? serviceById.get(selected.serviceId) : undefined;
  const selectedStaff = selected ? staffById.get(selected.staffId) : undefined;
  const selectedAvailability = selected ? availabilityByStaffId.get(selected.staffId) : undefined;
  const selectedOfficeTime = selected ? formatDateTimeInTimezone(selected.startAt, locale, selectedAvailability?.timezone) : '';
  const selectedOfficeEndTime = selected ? formatDateTimeInTimezone(selected.endAt, locale, selectedAvailability?.timezone) : '';
  const selectedCustomerProfile = selected
    ? customerProfileByEmail.get(selected.customer.email.trim().toLowerCase())
    : undefined;
  const selectedCustomerBookings = selectedCustomerProfile
    ? bookings
        .filter((booking) => selectedCustomerProfile.bookingIds.includes(booking.bookingId))
        .sort((a, b) => b.startAt.localeCompare(a.startAt))
    : [];
  const selectedDocuments = selected?.billingDocuments ?? [];
  const selectedManualPayments = selected?.manualPayments ?? [];
  const selectedPaymentAmount = selected ? bookingPaymentAmount(selected, selectedService) : 0;
  const selectedPaid = selected ? successfulOnlinePaymentTotal(selected) + successfulManualPaymentTotal(selected) : 0;
  const selectedBalanceDue = selected ? bookingBalanceDue(selected, selectedService) : 0;
  const selectedManualPaymentAllowed = selected ? canRecordManualPayment(selected, selectedService) : false;
  const selectedReceiptAllowed = selected?.paymentStatus === 'paid'
    || selected?.paymentStatus === 'refunded'
    || selected?.paymentStatus === 'partial-refund';

  const exportReport = () => {
    if (reporting) return;
    setReporting(true);
    try {
      const report = buildBookingDashboardReportFile({
        actionFilter,
        bookings,
        filters: {
          query,
          statusFilter,
          staffFilter,
          serviceFilter,
          fromDate,
          toDate,
        },
        locale,
        services,
        staff,
        visibleBookings: filtered,
        actionQueueBookings: actionFilter === 'waitlist' ? [] : selectedActionBookings,
        actionQueueWaitlist: actionFilter === 'waitlist' ? selectedActionWaitlist : activeWaitlist,
      });
      const link = document.createElement('a');
      const url = URL.createObjectURL(new Blob([serializeBookingDashboardReportFile(report)], { type: 'application/json;charset=utf-8' }));
      link.href = url;
      link.download = buildBookingDashboardReportFilename();
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setReporting(false);
    }
  };

  const exportVisibleBookingsCsv = () => {
    if (csvReporting) return;
    setCsvReporting(true);
    try {
      const report = buildBookingDashboardReportFile({
        actionFilter,
        bookings,
        filters: {
          query,
          statusFilter,
          staffFilter,
          serviceFilter,
          fromDate,
          toDate,
        },
        locale,
        services,
        staff,
        visibleBookings: filtered,
        actionQueueBookings: actionFilter === 'waitlist' ? [] : selectedActionBookings,
        actionQueueWaitlist: actionFilter === 'waitlist' ? selectedActionWaitlist : activeWaitlist,
      });
      const link = document.createElement('a');
      const url = URL.createObjectURL(new Blob([serializeBookingDashboardVisibleBookingsCsv(report)], { type: 'text/csv;charset=utf-8' }));
      link.href = url;
      link.download = buildBookingDashboardVisibleBookingsCsvFilename();
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setCsvReporting(false);
    }
  };

  return (
    <>
      {hasStubData ? <p role="status" data-booking-demo-disclosure="dashboard" aria-label="STUB DATA">STUB DATA · {locale === 'ko' ? '개발용 결제·이메일 기록이 포함되어 있습니다.' : locale === 'zh-hant' ? '包含開發用付款與寄信記錄。' : 'Development payment/email records are included; they are not live transactions.'}</p> : null}
      <section className={styles.dashboardGrid} data-booking-dashboard="true">
        <div className={styles.statCard}>
          <span>{locale === 'ko' ? '전체' : locale === 'zh-hant' ? '全部' : 'Total'}</span>
          <strong>{analytics.total}</strong>
        </div>
        <div className={styles.statCard}>
          <span>{locale === 'ko' ? '예정' : locale === 'zh-hant' ? '即將到來' : 'Upcoming'}</span>
          <strong>{analytics.upcoming}</strong>
        </div>
        <div className={styles.statCard}>
          <span>{locale === 'ko' ? '대기' : locale === 'zh-hant' ? '待處理' : 'Pending'}</span>
          <strong>{analytics.pending}</strong>
        </div>
        <div className={styles.statCard}>
          <span>{locale === 'ko' ? '노쇼' : locale === 'zh-hant' ? '未到' : 'No-show'}</span>
          <strong>{analytics.noShow}</strong>
        </div>
        <div className={styles.statCard}>
          <span>{locale === 'ko' ? '대기 목록' : locale === 'zh-hant' ? '候補名單' : 'Waitlist'}</span>
          <strong>{activeWaitlist.length}</strong>
        </div>
      </section>

      <section className={styles.analyticsGrid} data-booking-analytics="true">
        <div className={styles.analyticsCard}>
          <span>{locale === 'ko' ? '완료율' : locale === 'zh-hant' ? '完成率' : 'Completion'}</span>
          <strong>{analytics.completionRate}%</strong>
          <p>{analytics.completed}{copy.completedSuffix}</p>
        </div>
        <div className={styles.analyticsCard}>
          <span>{locale === 'ko' ? '취소율' : locale === 'zh-hant' ? '取消率' : 'Cancellation'}</span>
          <strong>{analytics.cancellationRate}%</strong>
          <p>{analytics.cancelled}{copy.cancelledSuffix}</p>
        </div>
        <div className={styles.analyticsCard}>
          <span>{locale === 'ko' ? '노쇼율' : locale === 'zh-hant' ? '未到率' : 'No-show rate'}</span>
          <strong>{analytics.noShowRate}%</strong>
          <p>{analytics.noShow}{copy.noShowSuffix}</p>
        </div>
        <div className={styles.analyticsCard}>
          <span>{locale === 'ko' ? '유료 수익' : locale === 'zh-hant' ? '付費營收' : 'Paid revenue'}</span>
          <strong>{new Intl.NumberFormat(locale === 'ko' ? 'ko-KR' : locale === 'zh-hant' ? 'zh-TW' : 'en-US').format(analytics.revenueAmount)}</strong>
          <p>{copy.bookedPaidPayments}</p>
        </div>
        <div className={styles.breakdownCard}>
          <div className={styles.breakdownHeader}>
            <strong>{copy.servicesLabel}</strong>
            <span>{analytics.byService.length}</span>
          </div>
          {analytics.byService.slice(0, 4).map((item) => (
            <div className={styles.breakdownRow} key={item.id}>
              <span>{item.label}</span>
              <strong>{item.total}</strong>
            </div>
          ))}
        </div>
        <div className={styles.breakdownCard}>
          <div className={styles.breakdownHeader}>
            <strong>{copy.customersLabel}</strong>
            <span>{customerProfiles.length}</span>
          </div>
          {customerProfiles.slice(0, 4).map((profile) => (
            <div className={styles.breakdownRow} key={profile.email}>
              <span>{profile.name}</span>
              <strong>{profile.totalBookings}</strong>
            </div>
          ))}
        </div>
      </section>

      {sourceBreakdown.length > 0 ? (
        <section className={styles.panel} data-booking-source-attribution="true">
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.cardTitle}>{copy.sourceAttributionTitle}</h2>
              <p className={styles.muted}>{copy.sourceAttributionSubtitle}</p>
            </div>
            <span className={styles.chip}>{sourceBreakdown.length} {locale === 'ko' ? '출처' : locale === 'zh-hant' ? '來源' : 'sources'}</span>
          </div>
          <div className={styles.breakdownCard}>
            {sourceBreakdown.map((item) => (
              <div className={styles.breakdownRow} key={item.source} data-booking-source-breakdown={item.source}>
                <span>{item.label}</span>
                <strong>{item.total}</strong>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {sourceFunnel.length > 0 ? (
        <section className={styles.panel} data-booking-source-funnel="true">
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.cardTitle}>{copy.sourceFunnelTitle}</h2>
              <p className={styles.muted}>{copy.sourceFunnelSubtitle}</p>
            </div>
            <span className={styles.chip}>{sourceFunnel.length} {locale === 'ko' ? '출처' : locale === 'zh-hant' ? '來源' : 'sources'}</span>
          </div>
          <div className={styles.breakdownCard}>
            {sourceFunnel.map((item) => (
              <div className={styles.breakdownRow} key={item.source} data-booking-source-funnel-row={item.source}>
                <span>{item.label}</span>
                <strong>{item.leadToCompletionRate}%</strong>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <BookingPaymentAttributionPanel
        items={paymentAttribution}
        locale={locale}
        title={copy.paymentAttributionTitle}
        subtitle={copy.paymentAttributionSubtitle}
      />

      {dashboardAlerts.length > 0 ? (
        <section className={styles.panel} data-booking-alerts="true">
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.cardTitle}>{copy.alertsTitle}</h2>
              <p className={styles.muted}>{copy.alertsSubtitle}</p>
            </div>
            <span className={styles.chip}>{dashboardAlerts.length} {locale === 'ko' ? '활성' : locale === 'zh-hant' ? '啟用中' : 'active'}</span>
          </div>
          <div className={styles.alertList}>
            {dashboardAlerts.map((alert) => (
              <article className={styles.alertCard} data-booking-alert={alert.id} key={alert.id} data-alert-severity={alert.severity}>
                <strong>{alert.title}</strong>
                <p>{alert.detail}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className={styles.panel} data-booking-trend="true">
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.cardTitle}>{copy.trendTitle}</h2>
            <p className={styles.muted}>{copy.trendSubtitle}</p>
          </div>
          <span className={styles.chip}>{analyticsBundle.trend.reduce((max, item) => Math.max(max, item.total), 0)} {copy.peakBookingsSuffix}</span>
        </div>
        <div className={styles.trendGrid}>
          {analyticsBundle.trend.map((item) => (
            <article className={styles.trendCard} data-booking-trend-day={item.day} key={item.day}>
              <div className={styles.breakdownHeader}>
                <strong>{item.day}</strong>
                <span>{item.total} bookings</span>
              </div>
              <div className={styles.trendBars} aria-label={`${locale === 'ko' ? '예약 추세' : locale === 'zh-hant' ? '預約趨勢' : 'Bookings trend'} ${item.day}`}>
                <div className={styles.trendBar} style={{ width: `${Math.max(item.total, 1) * 18}px` }} />
                <div className={styles.trendBarCompleted} style={{ width: `${Math.max(item.completed, 0) * 18}px` }} />
                <div className={styles.trendBarCancelled} style={{ width: `${Math.max(item.cancelled, 0) * 18}px` }} />
              </div>
              <p className={styles.muted}>{bookingTrendLabel(locale, item)}</p>
              <strong>{formatMoney(locale, item.revenueAmount, 'TWD')}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.panel} data-booking-utilization="true">
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.cardTitle}>{copy.utilizationTitle}</h2>
            <p className={styles.muted}>{copy.utilizationSubtitle}</p>
          </div>
          <span className={styles.chip}>{analyticsBundle.peakHours.cells.length} {copy.peakWindowsSuffix}</span>
        </div>
        <div className={styles.utilizationGrid}>
          <div className={styles.utilizationCard}>
            <div className={styles.breakdownHeader}>
              <strong>{copy.servicesLabel}</strong>
              <span>{copy.minutesLabel}</span>
            </div>
            {analyticsBundle.serviceUtilization.slice(0, 4).map((item) => (
              <div className={styles.utilizationRow} data-booking-service-utilization-row={item.serviceId} key={item.serviceId}>
                <span>{item.label}</span>
                <strong>{item.bookedMinutes}m</strong>
              </div>
            ))}
          </div>
          <div className={styles.utilizationCard}>
            <div className={styles.breakdownHeader}>
              <strong>{copy.staffLabel}</strong>
              <span>{copy.minutesLabel}</span>
            </div>
            {analyticsBundle.staffUtilization.slice(0, 4).map((item) => (
              <div className={styles.utilizationRow} data-booking-staff-utilization-row={item.staffId} key={item.staffId}>
                <span>{item.label}</span>
                <strong>{item.bookedMinutes}m · {item.utilizationPercent > 0 ? `${item.utilizationPercent}%` : copy.capacityUnknown}</strong>
              </div>
            ))}
          </div>
          <div className={styles.utilizationCard}>
            <div className={styles.breakdownHeader}>
              <strong>{locale === 'ko' ? '피크 창' : locale === 'zh-hant' ? '高峰時段' : 'Peak windows'}</strong>
              <span>{locale === 'ko' ? '요일/시' : locale === 'zh-hant' ? '日/時' : 'day/hour'}</span>
            </div>
            {analyticsBundle.peakHours.cells.slice(0, 6).map((cell) => (
              <div className={styles.utilizationRow} data-booking-peak-window={`${cell.dayOfWeek}-${cell.hour}`} key={`${cell.dayOfWeek}-${cell.hour}`}>
                <span>{dayOfWeeks[cell.dayOfWeek]} {String(cell.hour).padStart(2, '0')}:00</span>
                <strong>{cell.count}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className={styles.sectionHeader} style={{ marginBottom: 16 }}>
        <div>
          <h2 className={styles.cardTitle}>{copy.reportTitle}</h2>
          <p className={styles.muted}>{copy.reportSubtitle}</p>
        </div>
        <div className={styles.inlineActions}>
          <button
            className={styles.buttonSecondary}
            type="button"
            data-booking-dashboard-csv-export="true"
            disabled={csvReporting}
            onClick={exportVisibleBookingsCsv}
          >
            {csvReporting ? copy.savingLabel : locale === 'ko' ? '보이는 CSV 내보내기' : locale === 'zh-hant' ? '匯出顯示中的 CSV' : 'Export visible CSV'}
          </button>
          <button
            className={styles.buttonSecondary}
            type="button"
            data-booking-dashboard-export="true"
            disabled={reporting}
            onClick={exportReport}
          >
            {reporting ? copy.savingLabel : locale === 'ko' ? '리포트 JSON 내보내기' : locale === 'zh-hant' ? '匯出報表 JSON' : 'Export report JSON'}
          </button>
        </div>
      </div>

      <section className={styles.actionQueue} data-booking-action-queue="true">
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.cardTitle}>{copy.actionQueueTitle}</h2>
            <p className={styles.muted}>{copy.actionQueueSubtitle}</p>
          </div>
          <span className={styles.chip}>{Object.values(actionCounts).reduce((total, count) => total + count, 0)} {copy.itemsSuffix}</span>
        </div>
        <div className={styles.actionFilters} aria-label={copy.actionFiltersLabel}>
          {actionFilterOptions.map((option) => (
            <button
              key={option}
              type="button"
              data-active={actionFilter === option}
              data-booking-action-filter={option}
              onClick={() => {
                skipNextUrlPushRef.current = true;
                const params = new URLSearchParams(searchKey);
                if (option === 'today') params.delete('action'); else params.set('action', option);
                const nextQuery = params.toString();
                router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
                setActionFilter(option);
              }}
            >
              <span>{actionFilterLabel(locale, option)}</span>
              <strong>{actionCounts[option]}</strong>
            </button>
          ))}
        </div>
        <div className={styles.actionRows}>
          {selectedActionBookings.slice(0, 6).map((booking) => {
            const service = serviceById.get(booking.serviceId);
            const member = staffById.get(booking.staffId);
            const balance = bookingBalanceDue(booking, service);
            return (
              <article className={styles.actionRow} data-booking-action-row={`booking:${booking.bookingId}`} key={booking.bookingId}>
                <time>{formatDateTime(locale, booking.startAt)}</time>
                <div>
                  <strong>{booking.customer.name}</strong>
                  <span>{textForLocale(service?.name, locale) || booking.serviceId} · {textForLocale(member?.name, locale) || booking.staffId}</span>
                </div>
                <div className={styles.actionBadges}>
                  <span className={styles.statusPill} data-booking-status={booking.status}>{bookingStatusLabel(locale, booking.status)}</span>
                  {balance > 0 ? <span className={styles.chip}>{copy.due} {formatMoney(locale, balance, booking.paymentCurrency ?? service?.priceCurrency ?? 'TWD')}</span> : null}
                  {needsBillingDocument(booking, service) ? <span className={styles.chip}>{copy.docs}</span> : null}
                </div>
                <button
                  className={styles.buttonSecondary}
                  type="button"
                  data-booking-action-open={`booking:${booking.bookingId}`}
                  onClick={() => openBooking(booking)}
                >
                  {copy.openLabel}
                </button>
              </article>
            );
          })}
          {selectedActionWaitlist.slice(0, 6).map((entry) => {
            const service = serviceById.get(entry.serviceId);
            const member = staffById.get(entry.staffId);
            return (
              <article className={styles.actionRow} data-booking-action-row={`waitlist:${entry.waitlistId}`} key={entry.waitlistId}>
                <time>{entry.requestedDate}</time>
                <div>
                  <strong>{entry.customer.name}</strong>
                  <span>{textForLocale(service?.name, locale) || entry.serviceId} · {textForLocale(member?.name, locale) || entry.staffId}</span>
                </div>
                <div className={styles.actionBadges}>
                  <span className={styles.statusPill} data-waitlist-status={entry.status}>{waitlistStatusLabel(locale, entry.status)}</span>
                  <span className={styles.chip}>{copy.waitlistTitle}</span>
                </div>
                <a
                  className={styles.buttonSecondary}
                  data-booking-action-open={`waitlist:${entry.waitlistId}`}
                  href="#booking-waitlist-admin"
                >
                  {copy.reviewLabel}
                </a>
              </article>
            );
          })}
          {selectedActionBookings.length === 0 && selectedActionWaitlist.length === 0 ? (
            <p className={styles.muted}>{copy.noBookingActions}</p>
          ) : null}
        </div>
      </section>

      <section className={styles.panel}>
        <div className={styles.filterBar}>
          <label className={styles.field}>
            <span className={styles.label}>{copy.searchLabel}</span>
            <input
              className={styles.input}
              value={query}
              data-booking-dashboard-search="true"
              onChange={(event) => {
                const next = event.target.value;
                setQuery(next);
                const params = new URLSearchParams(searchKey);
                if (next.trim()) params.set('q', next.trim()); else params.delete('q');
                if (actionFilter !== 'today') params.set('action', actionFilter); else params.delete('action');
                const nextQuery = params.toString();
                router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
              }}
              placeholder={copy.searchPlaceholder}
            />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>{copy.statusLabel}</span>
            <select className={styles.select} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as '' | BookingStatus)}>
              {statusOptions.map((option) => <option key={option || 'all'} value={option}>{bookingStatusLabel(locale, option)}</option>)}
            </select>
          </label>
          <label className={styles.field}>
            <span className={styles.label}>{copy.staffLabel}</span>
            <select className={styles.select} value={staffFilter} onChange={(event) => setStaffFilter(event.target.value)}>
              <option value="">{copy.allStaff}</option>
              {staff.map((member) => <option key={member.staffId} value={member.staffId}>{textForLocale(member.name, locale)}</option>)}
            </select>
          </label>
          <label className={styles.field}>
            <span className={styles.label}>{copy.serviceLabel}</span>
            <select
              className={styles.select}
              data-booking-dashboard-service-filter="true"
              value={serviceFilter}
              onChange={(event) => setServiceFilter(event.target.value)}
            >
              <option value="">{copy.allServices}</option>
              {services.map((service) => <option key={service.serviceId} value={service.serviceId}>{textForLocale(service.name, locale)}</option>)}
            </select>
          </label>
          <label className={styles.field}>
            <span className={styles.label}>{copy.fromLabel}</span>
            <input className={styles.input} type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>{copy.toLabel}</span>
            <input className={styles.input} type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} />
          </label>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{copy.timeLabel}</th>
                <th>{copy.customerLabel}</th>
                <th>{copy.serviceLabel}</th>
                <th>{copy.staffLabel}</th>
                <th>{copy.statusLabel}</th>
                <th>{copy.paymentLabel}</th>
                <th>{copy.documentsLabel}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((booking) => {
                const service = serviceById.get(booking.serviceId);
                const member = staffById.get(booking.staffId);
                return (
                  <tr key={booking.bookingId} data-booking-row={booking.bookingId} onClick={() => openBooking(booking)}>
                    <td>{formatDateTime(locale, booking.startAt)}</td>
                    <td>
                      <strong>{booking.customer.name}</strong>
                      <span>{booking.customer.email}</span>
                      {customerProfileByEmail.get(booking.customer.email.trim().toLowerCase())?.totalBookings ? (
                        <em className={styles.inlineMetric}>
                          {customerProfileByEmail.get(booking.customer.email.trim().toLowerCase())?.totalBookings} {copy.visitsSuffix}
                        </em>
                      ) : null}
                    </td>
                    <td>{textForLocale(service?.name, locale) || booking.serviceId}</td>
                    <td>{textForLocale(member?.name, locale) || booking.staffId}</td>
                    <td><span className={styles.statusPill} data-booking-status={booking.status}>{bookingStatusLabel(locale, booking.status)}</span></td>
                    <td>{bookingPaymentStatusLabel(locale, booking.paymentStatus, service?.paymentMode)}</td>
                    <td>{booking.billingDocuments?.length ? `${booking.billingDocuments.length} ${copy.docsSuffix}` : '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 ? <p className={styles.muted}>{copy.noBookings}</p> : null}
        </div>
      </section>

      <section className={styles.panel} data-booking-waitlist-admin="true" id="booking-waitlist-admin">
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.cardTitle}>{copy.waitlistTitle}</h2>
            <p className={styles.muted}>{copy.waitlistSubtitle}</p>
          </div>
          <span className={styles.chip}>{activeWaitlist.length}{copy.waitlistActiveSuffix}</span>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{copy.requestedLabel}</th>
                <th>{copy.customerLabel}</th>
                <th>{copy.serviceLabel}</th>
                <th>{copy.staffLabel}</th>
                <th>{copy.statusLabel}</th>
                <th>{copy.actionsLabel}</th>
              </tr>
            </thead>
            <tbody>
              {waitlistEntries.map((entry) => {
                const service = serviceById.get(entry.serviceId);
                const member = staffById.get(entry.staffId);
                const busy = waitlistActionId === entry.waitlistId;
                return (
                  <tr key={entry.waitlistId} data-waitlist-row={entry.waitlistId}>
                    <td>
                      {entry.requestedDate}
                      <span>{formatDateTime(locale, entry.createdAt)}</span>
                    </td>
                    <td>
                      <strong>{entry.customer.name}</strong>
                      <span>{entry.customer.email}</span>
                    </td>
                    <td>{textForLocale(service?.name, locale) || entry.serviceId}</td>
                    <td>{textForLocale(member?.name, locale) || entry.staffId}</td>
                    <td><span className={styles.statusPill} data-waitlist-status={entry.status}>{waitlistStatusLabel(locale, entry.status)}</span></td>
                    <td>
                      <div className={styles.inlineActions}>
                        <button
                          className={styles.button}
                          type="button"
                          disabled={busy || entry.status === 'promoted' || entry.status === 'closed'}
                          onClick={(event) => {
                            event.stopPropagation();
                            void promoteWaitlist(entry);
                          }}
                        >
                          {copy.promoteLabel}
                        </button>
                        <button
                          className={styles.buttonSecondary}
                          type="button"
                          disabled={busy || entry.status === 'promoted' || entry.status === 'closed'}
                          onClick={(event) => {
                            event.stopPropagation();
                            void patchWaitlist(entry, entry.status === 'contacted' ? 'active' : 'contacted');
                          }}
                        >
                          {entry.status === 'contacted' ? copy.markActiveLabel : copy.contactedLabel}
                        </button>
                        <button
                          className={styles.buttonSecondary}
                          type="button"
                          disabled={busy || entry.status === 'promoted' || entry.status === 'closed'}
                          onClick={(event) => {
                            event.stopPropagation();
                            void patchWaitlist(entry, 'closed');
                          }}
                        >
                          {copy.closeLabel}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {waitlistEntries.length === 0 ? <p className={styles.muted}>{copy.noWaitlist}</p> : null}
        </div>
      </section>

      {selected ? (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle}>{selected.customer.name}</h2>
                <p className={styles.muted}>{textForLocale(selectedService?.name, locale) || selected.serviceId} · {textForLocale(selectedStaff?.name, locale) || selected.staffId}</p>
              </div>
              <button
                className={styles.buttonSecondary}
                type="button"
                data-booking-detail-close={selected.bookingId}
                onClick={() => setSelected(null)}
              >
                {copy.closeLabel}
              </button>
            </div>
            {error ? <p className={styles.error}>{error}</p> : null}
            <div className={styles.metaRow}>
              <span className={styles.statusPill} data-booking-status={selected.status}>{bookingStatusLabel(locale, selected.status)}</span>
              <span className={styles.chip}>{bookingPaymentStatusLabel(locale, selected.paymentStatus, selectedService?.paymentMode)}</span>
              {selected.meetingLink ? <a className={styles.chip} href={selected.meetingLink} target="_blank" rel="noreferrer">{copy.meetingLink}</a> : null}
            </div>
            <div className={styles.detailGrid}>
              <div className={styles.panelCompact}>
                <h3 className={styles.cardTitle}>{copy.customerMetaLabel}</h3>
                <p><strong>{copy.emailLabel}:</strong> {selected.customer.email}</p>
                <p><strong>{copy.phoneLabel}:</strong> {selected.customer.phone || '-'}</p>
                <p><strong>{copy.timezoneLabel}:</strong> {selected.customerTimezone || '-'}</p>
                <p><strong>{copy.caseLabel}:</strong> {selected.customer.caseSummary || selected.customer.notes || '-'}</p>
              </div>
              <div className={styles.panelCompact}>
                <h3 className={styles.cardTitle}>{copy.scheduleContextLabel}</h3>
                <p data-booking-office-time="true"><strong>{copy.officeTimeLabel}:</strong> {selectedOfficeTime && selectedOfficeEndTime ? `${selectedOfficeTime} - ${selectedOfficeEndTime}` : '-'}</p>
                <p data-booking-office-timezone="true"><strong>{copy.officeTimezoneLabel}:</strong> {selectedAvailability?.timezone || '-'}</p>
                <p><strong>{copy.customerTimeLabel}:</strong> {formatDateTime(locale, selected.startAt)} - {formatDateTime(locale, selected.endAt)}</p>
              </div>
              <div className={styles.panelCompact} data-customer-profile="true">
                <h3 className={styles.cardTitle}>{copy.customerProfileLabel}</h3>
                <p><strong>{copy.totalVisitsLabel}:</strong> {selectedCustomerProfile?.totalBookings ?? 1}</p>
                <p><strong>{copy.upcomingLabel}:</strong> {selectedCustomerProfile?.upcomingBookings ?? 0}</p>
                <p><strong>{copy.completedLabel}:</strong> {selectedCustomerProfile?.completedBookings ?? 0}</p>
                <p><strong>{copy.cancelledLabel}:</strong> {selectedCustomerProfile?.cancelledBookings ?? 0}</p>
              </div>
              <div className={styles.panelCompact}>
                <h3 className={styles.cardTitle}>{copy.rescheduleLabel}</h3>
                <label className={styles.field}>
                  <span className={styles.label}>{copy.staffLabel}</span>
                  <select className={styles.select} value={draftStaffId} onChange={(event) => setDraftStaffId(event.target.value)}>
                    {staff.map((member) => <option key={member.staffId} value={member.staffId}>{textForLocale(member.name, locale)}</option>)}
                  </select>
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>{copy.startTimeLabel}</span>
                  <input className={styles.input} type="datetime-local" value={draftStartAt} onChange={(event) => setDraftStartAt(event.target.value)} />
                </label>
                <button
                  className={styles.button}
                  type="button"
                  disabled={saving || !draftStartAt || !draftStaffId}
                  onClick={() => patchBooking(selected, { staffId: draftStaffId, startAt: localInputToIso(draftStartAt) })}
                >
                  {saving ? copy.savingLabel : copy.saveRescheduleLabel}
                </button>
              </div>
            </div>
            <div className={styles.manualPayments} data-booking-manual-payments={selected.bookingId}>
              <div className={styles.documentHead}>
                <div>
                  <h3 className={styles.cardTitle}>{copy.manualPaymentsLabel}</h3>
                  <p className={styles.muted}>{copy.manualPaymentsSubtitle}</p>
                </div>
                <div className={styles.paymentSummary} data-booking-manual-payment-summary={selected.bookingId}>
                  <span>{copy.paymentTotalLabel} {formatMoney(locale, selectedPaymentAmount, selected.paymentCurrency ?? selectedService?.priceCurrency ?? 'TWD')}</span>
                  <span>{copy.paidLabel} {formatMoney(locale, selectedPaid, selected.paymentCurrency ?? selectedService?.priceCurrency ?? 'TWD')}</span>
                  <strong>{copy.dueLabel} {formatMoney(locale, selectedBalanceDue, selected.paymentCurrency ?? selectedService?.priceCurrency ?? 'TWD')}</strong>
                </div>
              </div>
              {selectedManualPayments.length > 0 ? (
                <div className={styles.manualPaymentRows}>
                  {selectedManualPayments.map((payment) => (
                    <article key={payment.paymentId} data-booking-manual-payment-row={payment.paymentId}>
                      <div>
                        <strong>{formatMoney(locale, payment.amountCents, payment.currency)}</strong>
                        <span>{manualPaymentMethodLabel(locale, payment.method)} · {manualPaymentStatusLabel(locale, payment.status)} · {formatDateTime(locale, payment.createdAt)}</span>
                      </div>
                      <div>
                        <span>{payment.reference || copy.noReference}</span>
                        <span>{payment.note || ''}</span>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className={styles.muted}>{copy.noManualPayments}</p>
              )}
              <div className={styles.manualPaymentForm} data-booking-manual-payment-form={selected.bookingId}>
                <label className={styles.field}>
                  <span className={styles.label}>{copy.amountLabel}</span>
                  <input
                    className={styles.input}
                    value={manualPaymentDraft.amount}
                    inputMode="decimal"
                    data-booking-manual-payment-amount={selected.bookingId}
                    disabled={!selectedManualPaymentAllowed || manualPaymentActionId === selected.bookingId}
                    onChange={(event) => setManualPaymentDraft((current) => ({ ...current, amount: event.target.value }))}
                  />
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>{copy.methodLabel}</span>
                  <select
                    className={styles.select}
                    value={manualPaymentDraft.method}
                    data-booking-manual-payment-method={selected.bookingId}
                    disabled={!selectedManualPaymentAllowed || manualPaymentActionId === selected.bookingId}
                    onChange={(event) => setManualPaymentDraft((current) => ({
                      ...current,
                      method: event.target.value as BookingManualPaymentMethod,
                    }))}
                  >
                    <option value="bank_transfer">{manualPaymentMethodLabel(locale, 'bank_transfer')}</option>
                    <option value="cash">{manualPaymentMethodLabel(locale, 'cash')}</option>
                    <option value="check">{manualPaymentMethodLabel(locale, 'check')}</option>
                    <option value="other">{manualPaymentMethodLabel(locale, 'other')}</option>
                  </select>
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>{copy.referenceLabel}</span>
                  <input
                    className={styles.input}
                    value={manualPaymentDraft.reference}
                    data-booking-manual-payment-reference={selected.bookingId}
                    disabled={!selectedManualPaymentAllowed || manualPaymentActionId === selected.bookingId}
                    onChange={(event) => setManualPaymentDraft((current) => ({ ...current, reference: event.target.value }))}
                  />
                </label>
                <label className={`${styles.field} ${styles.fieldFull}`}>
                  <span className={styles.label}>{copy.noteLabel}</span>
                  <textarea
                    className={styles.textarea}
                    value={manualPaymentDraft.note}
                    rows={2}
                    maxLength={500}
                    data-booking-manual-payment-note={selected.bookingId}
                    disabled={!selectedManualPaymentAllowed || manualPaymentActionId === selected.bookingId}
                    onChange={(event) => setManualPaymentDraft((current) => ({ ...current, note: event.target.value }))}
                  />
                </label>
                <button
                  className={styles.button}
                  type="button"
                  disabled={!selectedManualPaymentAllowed || manualPaymentActionId === selected.bookingId}
                  onClick={() => recordManualPayment(selected)}
                  data-booking-manual-payment-submit={selected.bookingId}
                >
                  {manualPaymentActionId === selected.bookingId ? copy.recordingLabel : copy.recordManualPaymentLabel}
                </button>
              </div>
            </div>
            <div className={styles.documents} data-booking-documents={selected.bookingId}>
              <div className={styles.documentHead}>
                <div>
                  <h3 className={styles.cardTitle}>{copy.billingDocumentsLabel}</h3>
                  <p className={styles.muted}>{copy.billingDocumentsSubtitle}</p>
                </div>
                <div className={styles.documentActions}>
                  <button
                    className={styles.buttonSecondary}
                    data-booking-document-issue={`${selected.bookingId}:invoice`}
                    disabled={Boolean(documentActionId)}
                    type="button"
                    onClick={() => issueDocument(selected, 'invoice')}
                  >
                    {copy.issueInvoiceLabel}
                  </button>
                  <button
                    className={styles.buttonSecondary}
                    data-booking-document-email={`${selected.bookingId}:invoice`}
                    disabled={Boolean(documentActionId)}
                    type="button"
                    onClick={() => issueDocument(selected, 'invoice', true)}
                  >
                    {copy.emailInvoiceLabel}
                  </button>
                  <button
                    className={styles.buttonSecondary}
                    data-booking-document-issue={`${selected.bookingId}:receipt`}
                    disabled={Boolean(documentActionId) || !selectedReceiptAllowed}
                    type="button"
                    onClick={() => issueDocument(selected, 'receipt')}
                  >
                    {copy.issueReceiptLabel}
                  </button>
                  <button
                    className={styles.buttonSecondary}
                    data-booking-document-email={`${selected.bookingId}:receipt`}
                    disabled={Boolean(documentActionId) || !selectedReceiptAllowed}
                    type="button"
                    onClick={() => issueDocument(selected, 'receipt', true)}
                  >
                    {copy.emailReceiptLabel}
                  </button>
                  <a className={styles.buttonSecondary} href={`/${locale}/admin-builder/commerce/documents`}>
                    {copy.allDocumentsLabel}
                  </a>
                </div>
              </div>
              <div className={styles.documentList}>
                {selectedDocuments.length === 0 ? <p className={styles.muted}>{copy.noBillingDocuments}</p> : null}
                {selectedDocuments.map((document) => (
                  <div
                    className={styles.documentItem}
                    data-booking-document-row={`${selected.bookingId}:${document.type}`}
                    data-booking-document-status={document.status}
                    key={document.documentId}
                  >
                    <div>
                      <strong>{documentTypeLabel(locale, document.type)} {document.number}</strong>
                      <span>{billingDocumentStatusLabel(locale, document.status)}{document.emailedAt ? ` · ${locale === 'ko' ? '이메일 발송' : locale === 'zh-hant' ? '已寄送' : 'emailed'} ${formatDateTime(locale, document.emailedAt)}` : ''}</span>
                    </div>
                    <div>
                      <span>{formatMoney(locale, document.amount, document.currency)}</span>
                      <span>{copy.dueDocLabel} {formatMoney(locale, document.balanceDue, document.currency)}</span>
                    </div>
                    <div>
                      <span>{copy.refundedLabel} {formatMoney(locale, document.refundedAmount, document.currency)}</span>
                      <span>{document.recipientEmail}</span>
                      <a
                        href={`/api/builder/billing-documents/booking/${encodeURIComponent(selected.bookingId)}/${encodeURIComponent(document.documentId)}/download`}
                        data-booking-document-download={`${selected.bookingId}:${document.documentId}`}
                      >
                        {locale === 'ko' ? 'PDF 다운로드' : locale === 'zh-hant' ? '下載 PDF' : 'Download PDF'}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.timeline} data-booking-timeline="true">
              {selectedCustomerBookings.map((booking) => (
                <div className={styles.timelineItem} data-customer-history-item={booking.bookingId} key={`history-${booking.bookingId}`}>
                  <span />
                  <strong>{bookingStatusLabel(locale, booking.status)}</strong>
                  <p>{formatDateTime(locale, booking.startAt)} · {textForLocale(serviceById.get(booking.serviceId)?.name, locale) || booking.serviceId}</p>
                </div>
              ))}
              <div className={styles.timelineItem}>
                <span />
                <strong>{copy.createdLabel}</strong>
                <p>{formatDateTime(locale, selected.createdAt)}</p>
              </div>
              <div className={styles.timelineItem}>
                <span />
                <strong>{copy.currentStatusLabel}</strong>
                <p>{bookingStatusLabel(locale, selected.status)}</p>
              </div>
              <div className={styles.timelineItem}>
                <span />
                <strong>{copy.scheduledLabel}</strong>
                <p>{formatDateTime(locale, selected.startAt)}</p>
              </div>
              <div className={styles.timelineItem}>
                <span />
                <strong>{copy.lastUpdatedLabel}</strong>
                <p>{formatDateTime(locale, selected.updatedAt)}</p>
              </div>
              {selected.cancelledAt ? (
                <div className={styles.timelineItem}>
                  <span />
                  <strong>{copy.cancelledAtLabel}</strong>
                  <p>{formatDateTime(locale, selected.cancelledAt)} {selected.cancellationReason ? `· ${selected.cancellationReason}` : ''}</p>
                </div>
              ) : null}
            </div>
            <div className={styles.actions}>
              {statusActions.map((action) => (
                <button
                  className={action === selected.status ? styles.button : styles.buttonSecondary}
                  disabled={saving || action === selected.status}
                  key={action}
                  type="button"
                  onClick={() => patchBooking(selected, { status: action })}
                >
                  {bookingStatusLabel(locale, action)}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
