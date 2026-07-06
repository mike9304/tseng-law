import { createHash, randomUUID, timingSafeEqual } from 'node:crypto';
import type { Locale } from '@/lib/locales';
import {
  applyOrderPaymentWebhook,
  listOrders,
  loadOrder,
  saveOrder,
  supersedeOrderDocument,
  type CommerceOrder,
  type CommerceOrderDocument,
  type CommerceOrderPaymentStatus,
  voidOrderDocument,
} from '@/lib/builder/commerce/orders-engine';
import {
  getBooking,
  getService,
  getStaff,
  listBookings,
  listServices,
  listStaff,
  saveBooking,
} from '@/lib/builder/bookings/storage';
import type {
  Booking,
  BookingBillingDocument,
  BookingService,
  Staff,
} from '@/lib/builder/bookings/types';
import {
  BookingBillingDocumentError,
  supersedeBookingBillingDocument,
  voidBookingBillingDocument,
} from '@/lib/builder/bookings/billing-documents';
import type { BillingManualPaymentInstructionEntry } from '@/lib/builder/billing-document-automation';
import {
  appendPaymentLinkHistory,
  type BillingPaymentLinkHistoryEntry,
  type BillingPaymentLinkHistoryType,
} from '@/lib/builder/billing-payment-link-history';
import { queueBillingPaymentReceivedNotification } from '@/lib/builder/commerce/notifications-engine';

export type BillingDocumentSource = 'order' | 'booking';
export type BillingDocumentType = 'invoice' | 'receipt';
export type BillingDocumentStatus = 'issued' | 'emailed_stub' | 'voided' | 'superseded';
export type BillingDocumentShareStatus = 'not_created' | 'active' | 'expired' | 'revoked';
export type BillingDocumentPaymentLinkStatus = 'unavailable' | 'not_created' | 'active' | 'expired' | 'revoked';
export type BillingDocumentPaymentLinkRevokedReason = 'admin_revoked' | 'balance_changed' | 'document_voided' | 'document_superseded';
export type BillingDocumentPaymentReconciliationStatus = 'current' | 'not_created' | 'renew_required' | 'settled' | 'unavailable';
export type BillingDocumentAccessKind = 'viewed' | 'downloaded';
export type BillingDocumentPaymentLinkHistoryType = BillingPaymentLinkHistoryType;

export interface BillingDocumentLine {
  label: string;
  quantity?: number;
  amountLabel?: string;
}

export interface BillingDocumentDetail {
  label: string;
  value: string;
}

export interface BuilderBillingDocumentPaymentLinkEvent extends BillingPaymentLinkHistoryEntry {
  balanceDueLabel?: string;
}

export interface BuilderBillingDocumentRow {
  source: BillingDocumentSource;
  sourceLabel: string;
  ownerId: string;
  ownerLabel: string;
  documentId: string;
  number: string;
  type: BillingDocumentType;
  typeLabel: string;
  status: BillingDocumentStatus;
  statusLabel: string;
  locale: Locale;
  currency: string;
  totalAmount: number;
  refundedAmount: number;
  balanceDue: number;
  totalLabel: string;
  refundedLabel: string;
  balanceDueLabel: string;
  recipientEmail: string;
  recipientName?: string;
  customerLabel: string;
  contextLabel: string;
  issuedAt: string;
  emailedAt?: string;
  notes?: string;
  voidedAt?: string;
  voidReason?: string;
  supersedesDocumentId?: string;
  supersededByDocumentId?: string;
  shareStatus: BillingDocumentShareStatus;
  shareStatusLabel: string;
  shareLinkCreatedAt?: string;
  shareLinkExpiresAt?: string;
  shareLinkRevokedAt?: string;
  viewedAt?: string;
  viewCount: number;
  downloadedAt?: string;
  downloadCount: number;
  detailHref: string;
  downloadPath: string;
  sharePath: string;
  paymentStatus?: CommerceOrderPaymentStatus | Booking['paymentStatus'];
  paymentStatusLabel: string;
  paymentReferenceId?: string;
  paymentLinkId?: string;
  paymentLinkStatus: BillingDocumentPaymentLinkStatus;
  paymentLinkStatusLabel: string;
  paymentReconciliationStatus: BillingDocumentPaymentReconciliationStatus;
  paymentReconciliationStatusLabel: string;
  paymentLinkRenewalNeeded: boolean;
  paymentLinkRenewalReason?: string;
  paymentLinkCreatedAt?: string;
  paymentLinkExpiresAt?: string;
  paymentLinkRevokedAt?: string;
  paymentLinkRevokedReason?: BillingDocumentPaymentLinkRevokedReason;
  paymentLinkRevokedBalanceDue?: number;
  paymentLinkRevokedByPaymentId?: string;
  paymentLinkEvents: BuilderBillingDocumentPaymentLinkEvent[];
  paymentLinkPath: string;
  lines: BillingDocumentLine[];
  details: BillingDocumentDetail[];
}

export interface BillingDocumentRenderOptions {
  manualInstructions?: BillingManualPaymentInstructionEntry[];
}

export function parseBillingDocumentSource(value: string | null | undefined): BillingDocumentSource | null {
  if (value === 'order' || value === 'booking') return value;
  return null;
}

function intlLocale(locale: Locale): string {
  if (locale === 'ko') return 'ko-KR';
  if (locale === 'zh-hant') return 'zh-TW';
  return 'en-US';
}

function formatMoneyFromMinor(locale: Locale, currency: string, amount: number): string {
  return new Intl.NumberFormat(intlLocale(locale), {
    currency,
    maximumFractionDigits: currency === 'TWD' || currency === 'KRW' || currency === 'JPY' ? 0 : 2,
    style: 'currency',
  }).format(amount / 100);
}

function formatBookingMoney(locale: Locale, currency: string, amount: number): string {
  const divisor = currency === 'KRW' || currency === 'JPY' ? 1 : 100;
  return new Intl.NumberFormat(intlLocale(locale), {
    currency,
    maximumFractionDigits: currency === 'KRW' || currency === 'JPY' ? 0 : 2,
    style: 'currency',
  }).format(amount / divisor);
}

function documentTypeLabel(type: BillingDocumentType): string {
  return type === 'invoice' ? 'Invoice' : 'Receipt';
}

function documentStatusLabel(locale: Locale, status: BillingDocumentStatus): string {
  if (locale === 'ko') {
    switch (status) {
      case 'emailed_stub':
        return '이메일 발송됨';
      case 'voided':
        return '무효';
      case 'superseded':
        return '대체됨';
      default:
        return '발행됨';
    }
  }
  if (locale === 'zh-hant') {
    switch (status) {
      case 'emailed_stub':
        return '已寄送';
      case 'voided':
        return '已作廢';
      case 'superseded':
        return '已取代';
      default:
        return '已開立';
    }
  }
  switch (status) {
    case 'emailed_stub':
      return 'Email queued';
    case 'voided':
      return 'Voided';
    case 'superseded':
      return 'Superseded';
    default:
      return 'Issued';
  }
}

function shareStatusLabel(locale: Locale, status: BillingDocumentShareStatus): string {
  if (locale === 'ko') {
    switch (status) {
      case 'active':
        return '공유 활성';
      case 'expired':
        return '공유 만료';
      case 'revoked':
        return '공유 취소';
      default:
        return '공유 링크 없음';
    }
  }
  if (locale === 'zh-hant') {
    switch (status) {
      case 'active':
        return '分享啟用';
      case 'expired':
        return '分享過期';
      case 'revoked':
        return '分享撤銷';
      default:
        return '無分享連結';
    }
  }
  switch (status) {
    case 'active':
      return 'Share active';
    case 'expired':
      return 'Share expired';
    case 'revoked':
      return 'Share revoked';
    default:
      return 'No share link';
  }
}

function shareStatusFor(document: Pick<CommerceOrderDocument | BookingBillingDocument, 'shareLinkCreatedAt' | 'shareLinkExpiresAt' | 'shareLinkRevokedAt'>): BillingDocumentShareStatus {
  if (!document.shareLinkCreatedAt || !document.shareLinkExpiresAt) return 'not_created';
  if (document.shareLinkRevokedAt) return 'revoked';
  const expiresAt = Date.parse(document.shareLinkExpiresAt);
  if (Number.isFinite(expiresAt) && expiresAt <= Date.now()) return 'expired';
  return 'active';
}

function isPaidStatus(status: CommerceOrderPaymentStatus | Booking['paymentStatus']): boolean {
  return status === 'paid' || status === 'partially_refunded' || status === 'partial-refund' || status === 'refunded';
}

function paymentStatusLabel(locale: Locale, status: string | null | undefined): string {
  if (!status) return locale === 'ko' ? '결제 없음' : locale === 'zh-hant' ? '無付款' : 'No payment';
  if (locale === 'ko') {
    switch (status) {
      case 'requires_manual_payment':
        return '수동 결제 필요';
      case 'partially_paid':
        return '부분 결제됨';
      case 'authorized_stub':
        return '승인됨';
      case 'paid':
        return '결제 완료';
      case 'failed':
        return '결제 실패';
      case 'partially_refunded':
      case 'partial-refund':
        return '부분 환불됨';
      case 'refunded':
        return '환불됨';
      case 'unpaid':
        return '미결제';
      case 'pending':
        return '대기';
      case 'succeeded':
        return '성공';
      case 'canceled':
        return '취소됨';
      default:
        return status;
    }
  }
  if (locale === 'zh-hant') {
    switch (status) {
      case 'requires_manual_payment':
        return '需要手動付款';
      case 'partially_paid':
        return '部分付款';
      case 'authorized_stub':
        return '已授權';
      case 'paid':
        return '已付款';
      case 'failed':
        return '付款失敗';
      case 'partially_refunded':
      case 'partial-refund':
        return '部分退款';
      case 'refunded':
        return '已退款';
      case 'unpaid':
        return '未付款';
      case 'pending':
        return '待處理';
      case 'succeeded':
        return '成功';
      case 'canceled':
        return '已取消';
      default:
        return status;
    }
  }
  return status.replace(/_/g, ' ');
}

function paymentLinkStatusLabel(locale: Locale, status: BillingDocumentPaymentLinkStatus): string {
  if (locale === 'ko') {
    switch (status) {
      case 'active':
        return '결제 링크 활성';
      case 'expired':
        return '결제 링크 만료';
      case 'revoked':
        return '결제 링크 취소';
      case 'not_created':
        return '결제 링크 없음';
      default:
        return '사용 불가';
    }
  }
  if (locale === 'zh-hant') {
    switch (status) {
      case 'active':
        return '付款連結啟用';
      case 'expired':
        return '付款連結過期';
      case 'revoked':
        return '付款連結撤銷';
      case 'not_created':
        return '無付款連結';
      default:
        return '不可用';
    }
  }
  switch (status) {
    case 'active':
      return 'Pay link active';
    case 'expired':
      return 'Pay link expired';
    case 'revoked':
      return 'Pay link revoked';
    case 'not_created':
      return 'No pay link';
    default:
      return 'Pay link unavailable';
  }
}

function paymentReconciliationStatusLabel(status: BillingDocumentPaymentReconciliationStatus): string {
  switch (status) {
    case 'current':
      return 'Pay link matches current balance';
    case 'not_created':
      return 'Create pay link for current balance';
    case 'renew_required':
      return 'Balance changed; renew pay link';
    case 'settled':
      return 'Invoice is settled';
    default:
      return 'No payment reconciliation needed';
  }
}

function paymentReconciliationStatusFor(
  row: Pick<BuilderBillingDocumentRow, 'balanceDue' | 'paymentLinkRevokedReason' | 'paymentLinkStatus' | 'paymentStatus' | 'status' | 'type'>,
): BillingDocumentPaymentReconciliationStatus {
  if (row.type !== 'invoice' || (row.status !== 'issued' && row.status !== 'emailed_stub')) return 'unavailable';
  if (row.balanceDue <= 0 || isPaidStatus(row.paymentStatus)) return 'settled';
  if (row.paymentLinkStatus === 'active') return 'current';
  if (row.paymentLinkStatus === 'revoked' && row.paymentLinkRevokedReason === 'balance_changed') return 'renew_required';
  if (row.paymentLinkStatus === 'not_created') return 'not_created';
  return 'unavailable';
}

function orderPaymentLinkStatus(order: CommerceOrder, document: CommerceOrderDocument): BillingDocumentPaymentLinkStatus {
  if (
    document.type !== 'invoice'
    || (document.status !== 'issued' && document.status !== 'emailed_stub')
    || document.balanceDueCents <= 0
    || !order.payment.referenceId
    || isPaidStatus(order.payment.status)
  ) {
    return 'unavailable';
  }
  if (!document.paymentLinkId || !document.paymentLinkCreatedAt || !document.paymentLinkExpiresAt) return 'not_created';
  if (document.paymentLinkRevokedAt) return 'revoked';
  const expiresAt = Date.parse(document.paymentLinkExpiresAt);
  if (Number.isFinite(expiresAt) && expiresAt <= Date.now()) return 'expired';
  return 'active';
}

function bookingPaymentReference(booking: Booking): string {
  return booking.paymentIntentId?.trim() || `booking:${booking.bookingId}`;
}

function bookingPaymentLinkStatus(booking: Booking, document: BookingBillingDocument): BillingDocumentPaymentLinkStatus {
  if (
    document.type !== 'invoice'
    || (document.status !== 'issued' && document.status !== 'emailed_stub')
    || document.balanceDue <= 0
    || isPaidStatus(booking.paymentStatus)
  ) {
    return 'unavailable';
  }
  if (!document.paymentLinkId || !document.paymentLinkCreatedAt || !document.paymentLinkExpiresAt) return 'not_created';
  if (document.paymentLinkRevokedAt) return 'revoked';
  const expiresAt = Date.parse(document.paymentLinkExpiresAt);
  if (Number.isFinite(expiresAt) && expiresAt <= Date.now()) return 'expired';
  return 'active';
}

function localizedServiceName(service: BookingService | null | undefined, locale: Locale): string {
  if (!service) return 'Deleted service';
  return service.name[locale] || service.name.en || service.name.ko || service.serviceId;
}

function staffName(staff: Staff | null | undefined, locale: Locale): string {
  if (!staff) return 'Unassigned staff';
  return staff.name[locale] || staff.name.en || staff.name.ko || staff.staffId;
}

function tokenSecret(): string | null {
  const configured = process.env.BILLING_DOCUMENT_SHARE_SECRET?.trim()
    || process.env.NEXTAUTH_SECRET?.trim()
    || '';
  if (configured) return configured;
  if (process.env.NODE_ENV === 'production') return null;
  return process.env.CMS_ADMIN_PASSWORD?.trim() || 'local-builder-billing-documents';
}

export function billingDocumentTokenSecretConfigured(): boolean {
  return Boolean(tokenSecret());
}

function tokenMaterial(row: Pick<BuilderBillingDocumentRow, 'documentId' | 'issuedAt' | 'number' | 'ownerId' | 'source' | 'shareLinkCreatedAt' | 'shareLinkExpiresAt'>): string {
  const secret = tokenSecret();
  if (!secret) return '';
  return [
    row.source,
    row.ownerId,
    row.documentId,
    row.number,
    row.issuedAt,
    row.shareLinkCreatedAt ?? '',
    row.shareLinkExpiresAt ?? '',
    secret,
  ].join('\n');
}

export function billingDocumentShareToken(
  row: Pick<BuilderBillingDocumentRow, 'documentId' | 'issuedAt' | 'number' | 'ownerId' | 'source' | 'shareLinkCreatedAt' | 'shareLinkExpiresAt'>,
): string {
  const material = tokenMaterial(row);
  return material ? createHash('sha256').update(material).digest('base64url') : '';
}

export function validateBillingDocumentShareToken(row: BuilderBillingDocumentRow, token: string | null | undefined): boolean {
  if (row.shareStatus !== 'active') return false;
  if (!token) return false;
  const expected = billingDocumentShareToken(row);
  const left = Buffer.from(token);
  const right = Buffer.from(expected);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

function paymentTokenMaterial(row: Pick<BuilderBillingDocumentRow, 'balanceDue' | 'currency' | 'documentId' | 'issuedAt' | 'number' | 'ownerId' | 'paymentLinkCreatedAt' | 'paymentLinkExpiresAt' | 'paymentLinkId' | 'paymentReferenceId' | 'source' | 'type'>): string {
  const secret = tokenSecret();
  if (!secret) return '';
  return [
    'payment',
    row.source,
    row.ownerId,
    row.documentId,
    row.number,
    row.type,
    row.issuedAt,
    row.currency,
    row.balanceDue,
    row.paymentReferenceId ?? '',
    row.paymentLinkId ?? '',
    row.paymentLinkCreatedAt ?? '',
    row.paymentLinkExpiresAt ?? '',
    secret,
  ].join('\n');
}

export function billingDocumentPaymentToken(
  row: Pick<BuilderBillingDocumentRow, 'balanceDue' | 'currency' | 'documentId' | 'issuedAt' | 'number' | 'ownerId' | 'paymentLinkCreatedAt' | 'paymentLinkExpiresAt' | 'paymentLinkId' | 'paymentReferenceId' | 'source' | 'type'>,
): string {
  const material = paymentTokenMaterial(row);
  return material ? createHash('sha256').update(material).digest('base64url') : '';
}

export function billingDocumentCanPay(row: Pick<BuilderBillingDocumentRow, 'balanceDue' | 'paymentLinkId' | 'paymentLinkStatus' | 'paymentReferenceId' | 'source' | 'type' | 'paymentStatus'>): boolean {
  return (row.source === 'order' || row.source === 'booking')
    && row.type === 'invoice'
    && row.balanceDue > 0
    && row.paymentLinkStatus === 'active'
    && Boolean(row.paymentLinkId)
    && Boolean(row.paymentReferenceId)
    && !isPaidStatus(row.paymentStatus);
}

export function validateBillingDocumentPaymentToken(row: BuilderBillingDocumentRow, token: string | null | undefined): boolean {
  if (!billingDocumentCanPay(row)) return false;
  return billingDocumentPaymentTokenMatches(row, token);
}

export function billingDocumentPaymentTokenMatches(row: BuilderBillingDocumentRow, token: string | null | undefined): boolean {
  if (!row.paymentLinkId || !row.paymentLinkCreatedAt || !row.paymentLinkExpiresAt) return false;
  if (!token) return false;
  const expected = billingDocumentPaymentToken(row);
  const left = Buffer.from(token);
  const right = Buffer.from(expected);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

function withLinks(row: Omit<BuilderBillingDocumentRow, 'downloadPath' | 'paymentLinkPath' | 'sharePath'>): BuilderBillingDocumentRow {
  const encodedSource = encodeURIComponent(row.source);
  const encodedOwner = encodeURIComponent(row.ownerId);
  const encodedDocument = encodeURIComponent(row.documentId);
  const token = row.shareStatus === 'active' ? billingDocumentShareToken(row) : '';
  const paymentToken = billingDocumentCanPay(row) ? billingDocumentPaymentToken(row) : '';
  return {
    ...row,
    downloadPath: `/api/builder/billing-documents/${encodedSource}/${encodedOwner}/${encodedDocument}/download`,
    sharePath: token
      ? `/api/billing-documents/${encodedSource}/${encodedOwner}/${encodedDocument}?token=${encodeURIComponent(token)}`
      : '',
    paymentLinkPath: paymentToken
      ? `/api/billing-documents/${encodedSource}/${encodedOwner}/${encodedDocument}/pay?token=${encodeURIComponent(paymentToken)}`
      : '',
  };
}

function paymentLinkEventsFor(
  locale: Locale,
  currency: string,
  events: BillingPaymentLinkHistoryEntry[] | undefined,
): BuilderBillingDocumentPaymentLinkEvent[] {
  return (events ?? []).map((event) => ({
    ...event,
    balanceDueLabel: typeof event.balanceDue === 'number'
      ? formatMoneyFromMinor(locale, currency, event.balanceDue)
      : undefined,
  }));
}

function orderRow(order: CommerceOrder, document: CommerceOrderDocument): BuilderBillingDocumentRow {
  const locale = order.locale;
  const shareStatus = shareStatusFor(document);
  const payLinkStatus = orderPaymentLinkStatus(order, document);
  const reconciliationStatus = paymentReconciliationStatusFor({
    balanceDue: document.balanceDueCents,
    paymentLinkRevokedReason: document.paymentLinkRevokedReason,
    paymentLinkStatus: payLinkStatus,
    paymentStatus: order.payment.status,
    status: document.status,
    type: document.type,
  });
  const lines = order.lineItems.map((item) => ({
    amountLabel: formatMoneyFromMinor(locale, document.currency, item.priceCents * item.quantity),
    label: `${item.sku} · ${item.title}${item.variantTitle ? ` · ${item.variantTitle}` : ''}`,
    quantity: item.quantity,
  }));
  return withLinks({
    source: 'order',
    sourceLabel: 'Order',
    ownerId: order.orderId,
    ownerLabel: order.confirmationNumber,
    documentId: document.documentId,
    number: document.number,
    type: document.type,
    typeLabel: documentTypeLabel(document.type),
    status: document.status,
    statusLabel: documentStatusLabel(locale, document.status),
    locale,
    currency: document.currency,
    totalAmount: document.totalCents,
    refundedAmount: document.refundedCents,
    balanceDue: document.balanceDueCents,
    totalLabel: formatMoneyFromMinor(locale, document.currency, document.totalCents),
    refundedLabel: formatMoneyFromMinor(locale, document.currency, document.refundedCents),
    balanceDueLabel: formatMoneyFromMinor(locale, document.currency, document.balanceDueCents),
    recipientEmail: document.recipientEmail,
    recipientName: document.recipientName,
    customerLabel: document.recipientName || order.customer.name || document.recipientEmail,
    contextLabel: `${order.lineItems.length} line items · ${order.payment.status}`,
    issuedAt: document.issuedAt,
    emailedAt: document.emailedAt,
    notes: document.notes,
    voidedAt: document.voidedAt,
    voidReason: document.voidReason,
    supersedesDocumentId: document.supersedesDocumentId,
    supersededByDocumentId: document.supersededByDocumentId,
    shareStatus,
    shareStatusLabel: shareStatusLabel(locale, shareStatus),
    shareLinkCreatedAt: document.shareLinkCreatedAt,
    shareLinkExpiresAt: document.shareLinkExpiresAt,
    shareLinkRevokedAt: document.shareLinkRevokedAt,
    viewedAt: document.viewedAt,
    viewCount: document.viewCount ?? 0,
    downloadedAt: document.downloadedAt,
    downloadCount: document.downloadCount ?? 0,
    detailHref: `/${locale}/admin-builder/commerce/orders`,
    paymentStatus: order.payment.status,
    paymentStatusLabel: paymentStatusLabel(locale, order.payment.status),
    paymentReferenceId: order.payment.referenceId,
    paymentLinkId: document.paymentLinkId,
    paymentLinkStatus: payLinkStatus,
    paymentLinkStatusLabel: paymentLinkStatusLabel(locale, payLinkStatus),
    paymentReconciliationStatus: reconciliationStatus,
    paymentReconciliationStatusLabel: paymentReconciliationStatusLabel(reconciliationStatus),
    paymentLinkRenewalNeeded: reconciliationStatus === 'renew_required',
    paymentLinkRenewalReason: reconciliationStatus === 'renew_required' ? 'balance_changed' : undefined,
    paymentLinkCreatedAt: document.paymentLinkCreatedAt,
    paymentLinkExpiresAt: document.paymentLinkExpiresAt,
    paymentLinkRevokedAt: document.paymentLinkRevokedAt,
    paymentLinkRevokedReason: document.paymentLinkRevokedReason,
    paymentLinkRevokedBalanceDue: document.paymentLinkRevokedBalanceDue,
    paymentLinkRevokedByPaymentId: document.paymentLinkRevokedByPaymentId,
    paymentLinkEvents: paymentLinkEventsFor(locale, document.currency, document.paymentLinkEvents),
    lines,
    details: [
      { label: 'Order', value: order.confirmationNumber },
      { label: 'Payment', value: paymentStatusLabel(locale, order.payment.status) },
      ...(document.voidReason ? [{ label: 'Lifecycle note', value: document.voidReason }] : []),
      ...(document.supersedesDocumentId ? [{ label: 'Supersedes', value: document.supersedesDocumentId }] : []),
      ...(document.supersededByDocumentId ? [{ label: 'Superseded by', value: document.supersededByDocumentId }] : []),
      { label: 'Fulfillment', value: order.fulfillment.status },
      { label: 'Shipping', value: `${order.shipping.label} · ${formatMoneyFromMinor(locale, order.currency, order.shipping.amountCents)}` },
      { label: 'Tax', value: `${order.tax.label} · ${formatMoneyFromMinor(locale, order.currency, order.tax.amountCents)}` },
    ],
  });
}

function bookingRow(
  booking: Booking,
  document: BookingBillingDocument,
  service: BookingService | null | undefined,
  staff: Staff | null | undefined,
): BuilderBillingDocumentRow {
  const locale = booking.customer.locale;
  const serviceLabel = localizedServiceName(service, locale);
  const shareStatus = shareStatusFor(document);
  const payLinkStatus = bookingPaymentLinkStatus(booking, document);
  const reconciliationStatus = paymentReconciliationStatusFor({
    balanceDue: document.balanceDue,
    paymentLinkRevokedReason: document.paymentLinkRevokedReason,
    paymentLinkStatus: payLinkStatus,
    paymentStatus: booking.paymentStatus,
    status: document.status,
    type: document.type,
  });
  return withLinks({
    source: 'booking',
    sourceLabel: 'Booking',
    ownerId: booking.bookingId,
    ownerLabel: booking.bookingId,
    documentId: document.documentId,
    number: document.number,
    type: document.type,
    typeLabel: documentTypeLabel(document.type),
    status: document.status,
    statusLabel: documentStatusLabel(locale, document.status),
    locale,
    currency: document.currency,
    totalAmount: document.amount,
    refundedAmount: document.refundedAmount,
    balanceDue: document.balanceDue,
    totalLabel: formatBookingMoney(locale, document.currency, document.amount),
    refundedLabel: formatBookingMoney(locale, document.currency, document.refundedAmount),
    balanceDueLabel: formatBookingMoney(locale, document.currency, document.balanceDue),
    recipientEmail: document.recipientEmail,
    recipientName: document.recipientName,
    customerLabel: document.recipientName || booking.customer.name || document.recipientEmail,
    contextLabel: `${serviceLabel} · ${booking.paymentStatus ?? 'unpaid'}`,
    issuedAt: document.issuedAt,
    emailedAt: document.emailedAt,
    notes: document.notes,
    voidedAt: document.voidedAt,
    voidReason: document.voidReason,
    supersedesDocumentId: document.supersedesDocumentId,
    supersededByDocumentId: document.supersededByDocumentId,
    shareStatus,
    shareStatusLabel: shareStatusLabel(locale, shareStatus),
    shareLinkCreatedAt: document.shareLinkCreatedAt,
    shareLinkExpiresAt: document.shareLinkExpiresAt,
    shareLinkRevokedAt: document.shareLinkRevokedAt,
    viewedAt: document.viewedAt,
    viewCount: document.viewCount ?? 0,
    downloadedAt: document.downloadedAt,
    downloadCount: document.downloadCount ?? 0,
    detailHref: `/${locale}/admin-builder/bookings/dashboard`,
    paymentStatus: booking.paymentStatus,
    paymentStatusLabel: paymentStatusLabel(locale, booking.paymentStatus),
    paymentReferenceId: bookingPaymentReference(booking),
    paymentLinkId: document.paymentLinkId,
    paymentLinkStatus: payLinkStatus,
    paymentLinkStatusLabel: paymentLinkStatusLabel(locale, payLinkStatus),
    paymentReconciliationStatus: reconciliationStatus,
    paymentReconciliationStatusLabel: paymentReconciliationStatusLabel(reconciliationStatus),
    paymentLinkRenewalNeeded: reconciliationStatus === 'renew_required',
    paymentLinkRenewalReason: reconciliationStatus === 'renew_required' ? 'balance_changed' : undefined,
    paymentLinkCreatedAt: document.paymentLinkCreatedAt,
    paymentLinkExpiresAt: document.paymentLinkExpiresAt,
    paymentLinkRevokedAt: document.paymentLinkRevokedAt,
    paymentLinkRevokedReason: document.paymentLinkRevokedReason,
    paymentLinkRevokedBalanceDue: document.paymentLinkRevokedBalanceDue,
    paymentLinkRevokedByPaymentId: document.paymentLinkRevokedByPaymentId,
    paymentLinkEvents: paymentLinkEventsFor(locale, document.currency, document.paymentLinkEvents),
    lines: [
      {
        amountLabel: formatBookingMoney(locale, document.currency, document.amount),
        label: serviceLabel,
        quantity: 1,
      },
    ],
    details: [
      { label: 'Booking', value: booking.bookingId },
      { label: 'Service', value: serviceLabel },
      { label: 'Staff', value: staffName(staff, locale) },
      ...(document.voidReason ? [{ label: 'Lifecycle note', value: document.voidReason }] : []),
      ...(document.supersedesDocumentId ? [{ label: 'Supersedes', value: document.supersedesDocumentId }] : []),
      ...(document.supersededByDocumentId ? [{ label: 'Superseded by', value: document.supersededByDocumentId }] : []),
      { label: 'Start', value: booking.startAt },
      { label: 'Payment', value: paymentStatusLabel(locale, booking.paymentStatus) },
    ],
  });
}

function matchesSearch(row: BuilderBillingDocumentRow, query: string): boolean {
  if (!query) return true;
  const haystack = [
    row.source,
    row.sourceLabel,
    row.ownerId,
    row.ownerLabel,
    row.documentId,
    row.number,
    row.type,
    row.status,
    row.statusLabel,
    row.customerLabel,
    row.recipientEmail,
    row.contextLabel,
    row.notes ?? '',
  ].join(' ').toLowerCase();
  return haystack.includes(query);
}

export async function listBillingDocuments(options: {
  locale?: Locale;
  source?: BillingDocumentSource | 'all';
  q?: string;
} = {}): Promise<BuilderBillingDocumentRow[]> {
  const source = options.source ?? 'all';
  const q = options.q?.trim().toLowerCase() ?? '';
  const rows: BuilderBillingDocumentRow[] = [];

  if (source === 'all' || source === 'order') {
    const orders = await listOrders({ locale: options.locale });
    rows.push(...orders.flatMap((order) => order.documents.map((document) => orderRow(order, document))));
  }

  if (source === 'all' || source === 'booking') {
    const [bookings, services, staff] = await Promise.all([
      listBookings({ includeCancelled: true }),
      listServices(true),
      listStaff(true),
    ]);
    const servicesById = new Map(services.map((service) => [service.serviceId, service]));
    const staffById = new Map(staff.map((member) => [member.staffId, member]));
    rows.push(...bookings
      .filter((booking) => !options.locale || booking.customer.locale === options.locale)
      .flatMap((booking) => (booking.billingDocuments ?? []).map((document) => bookingRow(
        booking,
        document,
        servicesById.get(booking.serviceId),
        staffById.get(booking.staffId),
      ))));
  }

  return rows
    .filter((row) => matchesSearch(row, q))
    .sort((left, right) => right.issuedAt.localeCompare(left.issuedAt));
}

export async function getBillingDocument(
  source: BillingDocumentSource,
  ownerId: string,
  documentId: string,
): Promise<BuilderBillingDocumentRow | null> {
  if (source === 'order') {
    const order = await loadOrder(ownerId);
    const document = order?.documents.find((entry) => entry.documentId === documentId);
    return order && document ? orderRow(order, document) : null;
  }

  const booking = await getBooking(ownerId);
  const document = booking?.billingDocuments?.find((entry) => entry.documentId === documentId);
  if (!booking || !document) return null;
  const [service, staff] = await Promise.all([
    getService(booking.serviceId),
    getStaff(booking.staffId),
  ]);
  return bookingRow(booking, document, service, staff);
}

export async function getCurrentBillingInvoice(
  source: BillingDocumentSource,
  ownerId: string,
): Promise<BuilderBillingDocumentRow | null> {
  if (source === 'order') {
    const order = await loadOrder(ownerId);
    const document = [...(order?.documents ?? [])].reverse().find((entry) =>
      entry.type === 'invoice' && (entry.status === 'issued' || entry.status === 'emailed_stub')
    );
    return order && document ? orderRow(order, document) : null;
  }

  const booking = await getBooking(ownerId);
  const document = [...(booking?.billingDocuments ?? [])].reverse().find((entry) =>
    entry.type === 'invoice' && (entry.status === 'issued' || entry.status === 'emailed_stub')
  );
  if (!booking || !document) return null;
  const [service, staff] = await Promise.all([
    getService(booking.serviceId),
    getStaff(booking.staffId),
  ]);
  return bookingRow(booking, document, service, staff);
}

function defaultShareExpiry(now: Date): string {
  const expires = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  return expires.toISOString();
}

function sanitizeFutureExpiry(value: string | undefined, now: Date): string {
  if (!value) return defaultShareExpiry(now);
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed) || parsed <= now.getTime()) return defaultShareExpiry(now);
  return new Date(parsed).toISOString();
}

function applyShareLink<T extends CommerceOrderDocument | BookingBillingDocument>(
  document: T,
  expiresAt: string,
  now: string,
): T {
  return {
    ...document,
    shareLinkCreatedAt: now,
    shareLinkExpiresAt: expiresAt,
    shareLinkRevokedAt: undefined,
  };
}

function paymentLinkId(documentId: string, now: string): string {
  return `pay_${createHash('sha256').update(`${documentId}:${now}:${randomUUID()}`).digest('hex').slice(0, 24)}`;
}

function documentPaymentBalanceDue(document: CommerceOrderDocument | BookingBillingDocument): number {
  return 'balanceDueCents' in document ? document.balanceDueCents : document.balanceDue;
}

function applyPaymentLink<T extends CommerceOrderDocument | BookingBillingDocument>(
  document: T,
  expiresAt: string,
  now: string,
): T {
  const nextPaymentLinkId = paymentLinkId(document.documentId, now);
  const nextDocument = {
    ...document,
    paymentLinkId: nextPaymentLinkId,
    paymentLinkCreatedAt: now,
    paymentLinkExpiresAt: expiresAt,
    paymentLinkRevokedAt: undefined,
    paymentLinkRevokedReason: undefined,
    paymentLinkRevokedBalanceDue: undefined,
    paymentLinkRevokedByPaymentId: undefined,
  };
  return appendPaymentLinkHistory(nextDocument, {
    type: document.paymentLinkCreatedAt ? 'renewed' : 'created',
    actor: 'admin',
    createdAt: now,
    paymentLinkId: nextPaymentLinkId,
    expiresAt,
    balanceDue: documentPaymentBalanceDue(document),
  });
}

function revokeShareLink<T extends CommerceOrderDocument | BookingBillingDocument>(
  document: T,
  now: string,
): T {
  return {
    ...document,
    shareLinkRevokedAt: now,
  };
}

function revokePaymentLink<T extends CommerceOrderDocument | BookingBillingDocument>(
  document: T,
  now: string,
  reason: BillingDocumentPaymentLinkRevokedReason = 'admin_revoked',
): T {
  const balanceDue = documentPaymentBalanceDue(document);
  const nextDocument = {
    ...document,
    paymentLinkRevokedAt: now,
    paymentLinkRevokedReason: reason,
    paymentLinkRevokedBalanceDue: balanceDue,
    paymentLinkRevokedByPaymentId: undefined,
  };
  if (!document.paymentLinkCreatedAt) return nextDocument;
  return appendPaymentLinkHistory(nextDocument, {
    type: 'revoked',
    actor: reason === 'admin_revoked' ? 'admin' : 'system',
    createdAt: now,
    paymentLinkId: document.paymentLinkId,
    reason,
    balanceDue,
  });
}

function trackAccess<T extends CommerceOrderDocument | BookingBillingDocument>(
  document: T,
  kind: BillingDocumentAccessKind,
  now: string,
): T {
  if (kind === 'downloaded') {
    return {
      ...document,
      downloadedAt: now,
      downloadCount: (document.downloadCount ?? 0) + 1,
    };
  }
  return {
    ...document,
    viewedAt: now,
    viewCount: (document.viewCount ?? 0) + 1,
  };
}

export async function createBillingDocumentPaymentLink(
  source: BillingDocumentSource,
  ownerId: string,
  documentId: string,
  input: { expiresAt?: string; renew?: boolean } = {},
): Promise<BuilderBillingDocumentRow | null> {
  if (!billingDocumentTokenSecretConfigured()) return null;
  const nowDate = new Date();
  const now = nowDate.toISOString();
  const expiresAt = sanitizeFutureExpiry(input.expiresAt, nowDate);

  if (source === 'order') {
    const order = await loadOrder(ownerId);
    const document = order?.documents.find((entry) => entry.documentId === documentId);
    if (!order || !document) return null;
    if (
      document.type !== 'invoice'
      || document.balanceDueCents <= 0
      || !order.payment.referenceId
      || isPaidStatus(order.payment.status)
    ) {
      return null;
    }
    if (orderPaymentLinkStatus(order, document) === 'active' && !input.renew) {
      return orderRow(order, document);
    }

    const wasCreated = Boolean(document.paymentLinkCreatedAt);
    const updated = await saveOrder({
      ...order,
      documents: order.documents.map((entry) => (
        entry.documentId === documentId ? applyPaymentLink(entry, expiresAt, now) : entry
      )),
      updatedAt: now,
      audit: [...order.audit, {
        eventId: `evt_${createHash('sha256').update(`${documentId}:${now}:payment-link`).digest('hex').slice(0, 24)}`,
        type: wasCreated ? 'order.document.payment_link.renewed' : 'order.document.payment_link.created',
        actor: 'admin',
        message: wasCreated ? 'Document payment link renewed.' : 'Document payment link created.',
        createdAt: now,
        data: { documentId, documentNumber: document.number, expiresAt },
      }],
    });
    const nextDocument = updated.documents.find((entry) => entry.documentId === documentId);
    return nextDocument ? orderRow(updated, nextDocument) : null;
  }

  const booking = await getBooking(ownerId);
  const document = booking?.billingDocuments?.find((entry) => entry.documentId === documentId);
  if (!booking || !document) return null;
  if (bookingPaymentLinkStatus(booking, document) === 'unavailable') return null;
  if (bookingPaymentLinkStatus(booking, document) === 'active' && !input.renew) {
    const [service, staff] = await Promise.all([
      getService(booking.serviceId),
      getStaff(booking.staffId),
    ]);
    return bookingRow(booking, document, service, staff);
  }

  const nextBooking = {
    ...booking,
    billingDocuments: (booking.billingDocuments ?? []).map((entry) => (
      entry.documentId === documentId ? applyPaymentLink(entry, expiresAt, now) : entry
    )),
    updatedAt: now,
  };
  await saveBooking(nextBooking);
  const [service, staff] = await Promise.all([
    getService(nextBooking.serviceId),
    getStaff(nextBooking.staffId),
  ]);
  const nextDocument = nextBooking.billingDocuments?.find((entry) => entry.documentId === documentId);
  return nextDocument ? bookingRow(nextBooking, nextDocument, service, staff) : null;
}

export async function revokeBillingDocumentPaymentLink(
  source: BillingDocumentSource,
  ownerId: string,
  documentId: string,
): Promise<BuilderBillingDocumentRow | null> {
  const now = new Date().toISOString();

  if (source === 'order') {
    const order = await loadOrder(ownerId);
    const document = order?.documents.find((entry) => entry.documentId === documentId);
    if (!order || !document) return null;
    if (document.status !== 'issued' && document.status !== 'emailed_stub') return null;
    if (document.paymentLinkRevokedAt) return orderRow(order, document);
    const updated = await saveOrder({
      ...order,
      documents: order.documents.map((entry) => (
        entry.documentId === documentId ? revokePaymentLink(entry, now) : entry
      )),
      updatedAt: now,
      audit: [...order.audit, {
        eventId: `evt_${createHash('sha256').update(`${documentId}:${now}:payment-link-revoke`).digest('hex').slice(0, 24)}`,
        type: 'order.document.payment_link.revoked',
        actor: 'admin',
        message: 'Document payment link revoked.',
        createdAt: now,
        data: { documentId, documentNumber: document.number },
      }],
    });
    const nextDocument = updated.documents.find((entry) => entry.documentId === documentId);
    return nextDocument ? orderRow(updated, nextDocument) : null;
  }

  const booking = await getBooking(ownerId);
  const document = booking?.billingDocuments?.find((entry) => entry.documentId === documentId);
  if (!booking || !document) return null;
  if (document.status !== 'issued' && document.status !== 'emailed_stub') return null;
  if (document.paymentLinkRevokedAt) {
    const [service, staff] = await Promise.all([
      getService(booking.serviceId),
      getStaff(booking.staffId),
    ]);
    return bookingRow(booking, document, service, staff);
  }
  const nextBooking = {
    ...booking,
    billingDocuments: (booking.billingDocuments ?? []).map((entry) => (
      entry.documentId === documentId ? revokePaymentLink(entry, now) : entry
    )),
    updatedAt: now,
  };
  await saveBooking(nextBooking);
  const [service, staff] = await Promise.all([
    getService(nextBooking.serviceId),
    getStaff(nextBooking.staffId),
  ]);
  const nextDocument = nextBooking.billingDocuments?.find((entry) => entry.documentId === documentId);
  return nextDocument ? bookingRow(nextBooking, nextDocument, service, staff) : null;
}

export async function voidBuilderBillingDocument(
  source: BillingDocumentSource,
  ownerId: string,
  documentId: string,
  input: { reason?: string } = {},
): Promise<BuilderBillingDocumentRow | null> {
  if (source === 'order') {
    const result = await voidOrderDocument(ownerId, documentId, { reason: input.reason, actor: 'admin' });
    if (!result.order || !result.document || result.error) return null;
    return orderRow(result.order, result.document);
  }

  try {
    const result = await voidBookingBillingDocument(ownerId, documentId, { reason: input.reason });
    const [service, staff] = await Promise.all([
      getService(result.booking.serviceId),
      getStaff(result.booking.staffId),
    ]);
    return bookingRow(result.booking, result.document, service, staff);
  } catch (error) {
    if (error instanceof BookingBillingDocumentError) return null;
    throw error;
  }
}

export async function supersedeBuilderBillingDocument(
  source: BillingDocumentSource,
  ownerId: string,
  documentId: string,
  input: { reason?: string; notes?: string } = {},
): Promise<{
  document: BuilderBillingDocumentRow | null;
  supersededDocument: BuilderBillingDocumentRow | null;
}> {
  if (source === 'order') {
    const result = await supersedeOrderDocument(ownerId, documentId, {
      reason: input.reason,
      notes: input.notes,
      actor: 'admin',
    });
    if (!result.order || !result.document || !result.supersededDocument || result.error) {
      return { document: null, supersededDocument: null };
    }
    return {
      document: orderRow(result.order, result.document),
      supersededDocument: orderRow(result.order, result.supersededDocument),
    };
  }

  try {
    const result = await supersedeBookingBillingDocument(ownerId, documentId, {
      reason: input.reason,
      notes: input.notes,
    });
    const staff = await getStaff(result.booking.staffId);
    return {
      document: bookingRow(result.booking, result.document, result.service, staff),
      supersededDocument: bookingRow(result.booking, result.supersededDocument, result.service, staff),
    };
  } catch (error) {
    if (error instanceof BookingBillingDocumentError) {
      return { document: null, supersededDocument: null };
    }
    throw error;
  }
}

export async function createBillingDocumentShareLink(
  source: BillingDocumentSource,
  ownerId: string,
  documentId: string,
  input: { expiresAt?: string } = {},
): Promise<BuilderBillingDocumentRow | null> {
  if (!billingDocumentTokenSecretConfigured()) return null;
  const nowDate = new Date();
  const now = nowDate.toISOString();
  const expiresAt = sanitizeFutureExpiry(input.expiresAt, nowDate);

  if (source === 'order') {
    const order = await loadOrder(ownerId);
    const document = order?.documents.find((entry) => entry.documentId === documentId);
    if (!order || !document) return null;
    const updated = await saveOrder({
      ...order,
      documents: order.documents.map((entry) => (
        entry.documentId === documentId ? applyShareLink(entry, expiresAt, now) : entry
      )),
      updatedAt: now,
      audit: [...order.audit, {
        eventId: `evt_${createHash('sha256').update(`${documentId}:${now}:share`).digest('hex').slice(0, 24)}`,
        type: 'order.document.share_link.created',
        actor: 'admin',
        message: 'Document share link created.',
        createdAt: now,
        data: { documentId, documentNumber: document.number, expiresAt },
      }],
    });
    const nextDocument = updated.documents.find((entry) => entry.documentId === documentId);
    return nextDocument ? orderRow(updated, nextDocument) : null;
  }

  const booking = await getBooking(ownerId);
  const document = booking?.billingDocuments?.find((entry) => entry.documentId === documentId);
  if (!booking || !document) return null;
  const nextBooking = {
    ...booking,
    billingDocuments: (booking.billingDocuments ?? []).map((entry) => (
      entry.documentId === documentId ? applyShareLink(entry, expiresAt, now) : entry
    )),
    updatedAt: now,
  };
  await saveBooking(nextBooking);
  const [service, staff] = await Promise.all([
    getService(nextBooking.serviceId),
    getStaff(nextBooking.staffId),
  ]);
  const nextDocument = nextBooking.billingDocuments?.find((entry) => entry.documentId === documentId);
  return nextDocument ? bookingRow(nextBooking, nextDocument, service, staff) : null;
}

export async function revokeBillingDocumentShareLink(
  source: BillingDocumentSource,
  ownerId: string,
  documentId: string,
): Promise<BuilderBillingDocumentRow | null> {
  const now = new Date().toISOString();

  if (source === 'order') {
    const order = await loadOrder(ownerId);
    const document = order?.documents.find((entry) => entry.documentId === documentId);
    if (!order || !document) return null;
    const updated = await saveOrder({
      ...order,
      documents: order.documents.map((entry) => (
        entry.documentId === documentId ? revokeShareLink(entry, now) : entry
      )),
      updatedAt: now,
      audit: [...order.audit, {
        eventId: `evt_${createHash('sha256').update(`${documentId}:${now}:revoke`).digest('hex').slice(0, 24)}`,
        type: 'order.document.share_link.revoked',
        actor: 'admin',
        message: 'Document share link revoked.',
        createdAt: now,
        data: { documentId, documentNumber: document.number },
      }],
    });
    const nextDocument = updated.documents.find((entry) => entry.documentId === documentId);
    return nextDocument ? orderRow(updated, nextDocument) : null;
  }

  const booking = await getBooking(ownerId);
  const document = booking?.billingDocuments?.find((entry) => entry.documentId === documentId);
  if (!booking || !document) return null;
  const nextBooking = {
    ...booking,
    billingDocuments: (booking.billingDocuments ?? []).map((entry) => (
      entry.documentId === documentId ? revokeShareLink(entry, now) : entry
    )),
    updatedAt: now,
  };
  await saveBooking(nextBooking);
  const [service, staff] = await Promise.all([
    getService(nextBooking.serviceId),
    getStaff(nextBooking.staffId),
  ]);
  const nextDocument = nextBooking.billingDocuments?.find((entry) => entry.documentId === documentId);
  return nextDocument ? bookingRow(nextBooking, nextDocument, service, staff) : null;
}

export async function trackBillingDocumentAccess(
  source: BillingDocumentSource,
  ownerId: string,
  documentId: string,
  kind: BillingDocumentAccessKind,
): Promise<void> {
  const now = new Date().toISOString();
  if (source === 'order') {
    const order = await loadOrder(ownerId);
    if (!order?.documents.some((entry) => entry.documentId === documentId)) return;
    await saveOrder({
      ...order,
      documents: order.documents.map((entry) => (
        entry.documentId === documentId ? trackAccess(entry, kind, now) : entry
      )),
      updatedAt: now,
    });
    return;
  }

  const booking = await getBooking(ownerId);
  if (!booking?.billingDocuments?.some((entry) => entry.documentId === documentId)) return;
  await saveBooking({
    ...booking,
    billingDocuments: booking.billingDocuments.map((entry) => (
      entry.documentId === documentId ? trackAccess(entry, kind, now) : entry
    )),
    updatedAt: now,
  });
}

export async function settleBillingDocumentPaymentLink(
  source: BillingDocumentSource,
  ownerId: string,
  documentId: string,
  token: string | null | undefined,
): Promise<{
  row: BuilderBillingDocumentRow | null;
  order: CommerceOrder | null;
  booking: Booking | null;
  changed: boolean;
  error?: string;
}> {
  const row = await getBillingDocument(source, ownerId, documentId);
  if (!row) return { row: null, order: null, booking: null, changed: false, error: 'document_not_found' };
  if (!validateBillingDocumentPaymentToken(row, token)) {
    return { row, order: null, booking: null, changed: false, error: 'payment_link_invalid' };
  }

  if (source === 'booking') {
    const booking = await getBooking(ownerId);
    if (!booking) return { row, order: null, booking: null, changed: false, error: 'booking_not_found' };
    if (isPaidStatus(booking.paymentStatus)) return { row, order: null, booking, changed: false };
    const now = new Date().toISOString();
    const nextBooking: Booking = {
      ...booking,
      paymentStatus: 'paid',
      updatedAt: now,
    };
    await saveBooking(nextBooking);
    const nextRow = await getBillingDocument(source, ownerId, documentId);
    if (nextRow && row.paymentLinkId) {
      await queueBillingPaymentReceivedNotification(nextRow, {
        amount: row.balanceDue,
        method: 'hosted',
        paymentId: row.paymentLinkId,
        provider: 'local-payment-link',
        now,
      }).catch((error) => console.error('[billing-documents] payment notification failed:', error));
    }
    return {
      row: nextRow ?? row,
      order: null,
      booking: nextBooking,
      changed: true,
    };
  }

  const order = await loadOrder(ownerId);
  if (!order) return { row, order: null, booking: null, changed: false, error: 'order_not_found' };
  if (isPaidStatus(order.payment.status)) return { row, order, booking: null, changed: false };
  if (!order.payment.referenceId) return { row, order, booking: null, changed: false, error: 'payment_reference_missing' };

  const now = new Date().toISOString();
  const eventId = `pay_${createHash('sha256').update(`${ownerId}:${documentId}:${now}`).digest('hex').slice(0, 24)}`;
  const result = await applyOrderPaymentWebhook({
    referenceId: order.payment.referenceId,
    paymentStatus: 'paid',
    eventId,
    eventType: 'manual_invoice.paid',
    provider: order.payment.adapter,
  });
  const nextRow = await getBillingDocument(source, ownerId, documentId);
  if (result.changed) {
    await queueBillingPaymentReceivedNotification(nextRow ?? row, {
      amount: row.balanceDue,
      method: 'hosted',
      paymentId: row.paymentLinkId ?? eventId,
      provider: order.payment.adapter,
      now,
    }).catch((error) => console.error('[billing-documents] payment notification failed:', error));
  }
  return {
    row: nextRow ?? row,
    order: result.order ?? order,
    booking: null,
    changed: result.changed,
    error: result.reason && result.reason !== 'payment_status_unchanged' ? result.reason : undefined,
  };
}

export async function settleBillingDocumentHostedPayment(input: {
  source: BillingDocumentSource;
  ownerId: string;
  documentId: string;
  paymentLinkId: string;
  amount: number;
  currency: string;
  provider: string;
  providerEventId: string;
  providerPaymentId?: string;
  providerSessionId?: string;
  eventType?: string;
}): Promise<{
  row: BuilderBillingDocumentRow | null;
  order: CommerceOrder | null;
  booking: Booking | null;
  changed: boolean;
  error?: string;
}> {
  const row = await getBillingDocument(input.source, input.ownerId, input.documentId);
  if (!row) return { row: null, order: null, booking: null, changed: false, error: 'document_not_found' };
  if (!row.paymentLinkId || row.paymentLinkId !== input.paymentLinkId) {
    return { row, order: null, booking: null, changed: false, error: 'payment_link_mismatch' };
  }
  if (row.currency.toUpperCase() !== input.currency.toUpperCase()) {
    return { row, order: null, booking: null, changed: false, error: 'currency_mismatch' };
  }
  if (row.balanceDue !== input.amount) {
    return { row, order: null, booking: null, changed: false, error: 'amount_mismatch' };
  }
  if (isPaidStatus(row.paymentStatus)) {
    const order = input.source === 'order' ? await loadOrder(input.ownerId) : null;
    const booking = input.source === 'booking' ? await getBooking(input.ownerId) : null;
    return { row, order, booking, changed: false };
  }
  if (!billingDocumentCanPay(row)) {
    return { row, order: null, booking: null, changed: false, error: 'payment_link_not_payable' };
  }

  const now = new Date().toISOString();
  if (input.source === 'booking') {
    const booking = await getBooking(input.ownerId);
    if (!booking) return { row, order: null, booking: null, changed: false, error: 'booking_not_found' };
    if (isPaidStatus(booking.paymentStatus)) return { row, order: null, booking, changed: false };
    const nextBooking: Booking = {
      ...booking,
      paymentStatus: 'paid',
      paymentIntentId: input.providerPaymentId ?? booking.paymentIntentId,
      updatedAt: now,
    };
    await saveBooking(nextBooking);
    const nextRow = await getBillingDocument(input.source, input.ownerId, input.documentId);
    await queueBillingPaymentReceivedNotification(nextRow ?? row, {
      amount: input.amount,
      method: 'hosted',
      paymentId: input.providerEventId,
      provider: input.provider,
      reference: input.providerPaymentId ?? input.providerSessionId,
      now,
    }).catch((error) => console.error('[billing-documents] payment notification failed:', error));
    return {
      row: nextRow ?? row,
      order: null,
      booking: nextBooking,
      changed: true,
    };
  }

  const order = await loadOrder(input.ownerId);
  const document = order?.documents.find((entry) => entry.documentId === input.documentId);
  if (!order || !document) return { row, order: null, booking: null, changed: false, error: 'order_not_found' };
  if (isPaidStatus(order.payment.status)) return { row, order, booking: null, changed: false };
  const updated = await saveOrder({
    ...order,
    payment: {
      ...order.payment,
      status: 'paid',
      label: input.provider === 'stripe' ? 'Stripe Checkout' : order.payment.label,
      stub: false,
      referenceId: input.providerPaymentId ?? order.payment.referenceId,
    },
    updatedAt: now,
    audit: [...order.audit, {
      eventId: `evt_${createHash('sha256').update(`${input.provider}:${input.providerEventId}:${input.documentId}`).digest('hex').slice(0, 24)}`,
      type: 'order.document.hosted_payment.paid',
      actor: 'system',
      message: 'Hosted invoice payment marked the order paid.',
      createdAt: now,
      data: {
        provider: input.provider,
        providerEventId: input.providerEventId,
        providerPaymentId: input.providerPaymentId,
        providerSessionId: input.providerSessionId,
        eventType: input.eventType,
        documentId: document.documentId,
        documentNumber: document.number,
        paymentLinkId: input.paymentLinkId,
        amount: input.amount,
        currency: input.currency,
      },
    }],
  });
  const nextRow = await getBillingDocument(input.source, input.ownerId, input.documentId);
  await queueBillingPaymentReceivedNotification(nextRow ?? row, {
    amount: input.amount,
    method: 'hosted',
    paymentId: input.providerEventId,
    provider: input.provider,
    reference: input.providerPaymentId ?? input.providerSessionId,
    now,
  }).catch((error) => console.error('[billing-documents] payment notification failed:', error));
  return {
    row: nextRow ?? row,
    order: updated,
    booking: null,
    changed: true,
  };
}

function escapeHtml(value: string | number | undefined): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeHtmlMultiline(value: string): string {
  return escapeHtml(value).replace(/\r?\n/g, '<br />');
}

function shouldRenderManualInstructions(
  row: BuilderBillingDocumentRow,
  instructions: BillingManualPaymentInstructionEntry[] | undefined,
): instructions is BillingManualPaymentInstructionEntry[] {
  return row.type === 'invoice'
    && row.balanceDue > 0
    && !isPaidStatus(row.paymentStatus ?? 'requires_manual_payment')
    && Array.isArray(instructions)
    && instructions.length > 0;
}

export function billingDocumentFileName(row: BuilderBillingDocumentRow, extension = 'html'): string {
  const safe = row.number.replace(/[^a-z0-9._-]+/gi, '-').replace(/^-+|-+$/g, '') || row.documentId;
  return `${safe}.${extension}`;
}

export function renderBillingDocumentHtml(row: BuilderBillingDocumentRow, options: BillingDocumentRenderOptions = {}): string {
  const issued = new Date(row.issuedAt).toLocaleString(intlLocale(row.locale));
  const emailed = row.emailedAt ? new Date(row.emailedAt).toLocaleString(intlLocale(row.locale)) : 'Not emailed';
  const lines = row.lines.map((line) => `
      <tr>
        <td>${escapeHtml(line.label)}</td>
        <td>${escapeHtml(line.quantity ?? '')}</td>
        <td>${escapeHtml(line.amountLabel ?? '')}</td>
      </tr>`).join('');
  const details = row.details.map((detail) => `
      <tr>
        <th>${escapeHtml(detail.label)}</th>
        <td>${escapeHtml(detail.value)}</td>
      </tr>`).join('');
  const paymentBlock = row.paymentLinkPath ? `
      <section class="pay">
        <div>
          <h2>Payment</h2>
          <p>Balance due: <strong>${escapeHtml(row.balanceDueLabel)}</strong></p>
        </div>
        <a href="${escapeHtml(row.paymentLinkPath)}">Pay invoice</a>
      </section>` : '';
  const manualInstructionBlock = shouldRenderManualInstructions(row, options.manualInstructions) ? `
      <section class="manual">
        <h2>Manual payment instructions</h2>
        ${options.manualInstructions.map((instruction) => `
        <article>
          <strong>${escapeHtml(instruction.title)}</strong>
          <p>${escapeHtmlMultiline(instruction.instructions)}</p>
        </article>`).join('')}
      </section>` : '';

  return `<!doctype html>
<html lang="${escapeHtml(row.locale)}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(row.typeLabel)} ${escapeHtml(row.number)}</title>
  <style>
    :root { color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    * { box-sizing: border-box; }
    body { margin: 0; background: #f8fafc; overflow-wrap: anywhere; }
    main { max-width: 820px; margin: 0 auto; padding: 36px 20px; }
    .sheet { background: #fff; border: 1px solid #dbe4ee; border-radius: 10px; padding: 32px; }
    header { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 20px; border-bottom: 2px solid #0f172a; padding-bottom: 18px; }
    h1 { margin: 0; font-size: 30px; }
    h2 { margin: 28px 0 10px; font-size: 16px; }
    p { margin: 4px 0; color: #475569; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th, td { border-bottom: 1px solid #e2e8f0; padding: 10px 8px; text-align: left; vertical-align: top; }
    th { color: #334155; width: 170px; }
	    .totals { margin-left: auto; max-width: 320px; }
	    .totals td:last-child { text-align: right; font-weight: 800; }
	    .pay { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 14px; margin: 22px 0; border: 1px solid #bfdbfe; border-radius: 10px; background: #eff6ff; padding: 16px; }
	    .pay h2 { margin: 0 0 4px; }
	    .pay a { display: inline-flex; align-items: center; justify-content: center; min-height: 40px; border-radius: 8px; background: #1d4ed8; color: #fff; padding: 0 16px; font-weight: 800; text-decoration: none; }
	    .manual { display: grid; gap: 10px; margin: 22px 0; border: 1px solid #dbeafe; border-radius: 10px; background: #f8fbff; padding: 16px; }
	    .manual h2 { margin: 0; }
	    .manual article { border-top: 1px solid #dbeafe; padding-top: 10px; }
	    .manual article:first-of-type { border-top: 0; padding-top: 0; }
	    .manual strong { display: block; margin-bottom: 4px; }
	    .manual p { margin: 0; }
	    .muted { color: #64748b; font-size: 13px; }
    @media (max-width: 560px) { main { padding: 18px 10px; } .sheet { padding: 20px 14px; } th { width: auto; } }
    @media print { body { background: #fff; } main { padding: 0; } .sheet { border: 0; border-radius: 0; } }
  </style>
</head>
<body>
  <main>
    <section class="sheet">
      <header>
        <div>
          <p class="muted">${escapeHtml(row.sourceLabel)}</p>
          <h1>${escapeHtml(row.typeLabel)}</h1>
          <p>${escapeHtml(row.number)}</p>
        </div>
        <div>
          <p><strong>Status:</strong> ${escapeHtml(row.statusLabel)}</p>
          <p><strong>Issued:</strong> ${escapeHtml(issued)}</p>
          <p><strong>Email:</strong> ${escapeHtml(emailed)}</p>
        </div>
      </header>

	      <h2>Recipient</h2>
	      <p><strong>${escapeHtml(row.customerLabel)}</strong></p>
	      <p>${escapeHtml(row.recipientEmail)}</p>

	      ${paymentBlock}
	      ${manualInstructionBlock}

	      <h2>Source</h2>
      <table><tbody>${details}</tbody></table>

      <h2>Items</h2>
      <table>
        <thead><tr><th>Item</th><th>Qty</th><th>Amount</th></tr></thead>
        <tbody>${lines}</tbody>
      </table>

      <table class="totals">
        <tbody>
          <tr><td>Total</td><td>${escapeHtml(row.totalLabel)}</td></tr>
          <tr><td>Refunded</td><td>${escapeHtml(row.refundedLabel)}</td></tr>
          <tr><td>Balance due</td><td>${escapeHtml(row.balanceDueLabel)}</td></tr>
        </tbody>
      </table>

      ${row.notes ? `<h2>Notes</h2><p>${escapeHtml(row.notes)}</p>` : ''}
    </section>
  </main>
</body>
</html>`;
}

function pdfText(value: string | number | undefined): string {
  return String(value ?? '')
    .replace(/[^\x20-\x7e]/g, '?')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

function wrapPdfLine(value: string, maxLength = 92): string[] {
  const words = value.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [''];
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxLength && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export function renderBillingDocumentPdf(row: BuilderBillingDocumentRow, options: BillingDocumentRenderOptions = {}): Buffer {
  const issued = new Date(row.issuedAt).toLocaleString(intlLocale(row.locale));
  const manualInstructionLines = shouldRenderManualInstructions(row, options.manualInstructions)
    ? [
      'Manual payment instructions',
      ...options.manualInstructions.flatMap((instruction) => [
        instruction.title,
        ...wrapPdfLine(instruction.instructions),
      ]),
      '',
    ]
    : [];
  const lines = [
    `${row.typeLabel.toUpperCase()} ${row.number}`,
    `${row.sourceLabel}: ${row.ownerLabel}`,
    `Status: ${row.statusLabel}`,
    `Issued: ${issued}`,
    '',
    `Recipient: ${row.customerLabel}`,
    `Email: ${row.recipientEmail}`,
    '',
    ...row.details.map((detail) => `${detail.label}: ${detail.value}`),
    '',
    'Items',
    ...row.lines.flatMap((line) => wrapPdfLine(`- ${line.label} ${line.quantity ? `x${line.quantity}` : ''} ${line.amountLabel ?? ''}`)),
    '',
    `Total: ${row.totalLabel}`,
    `Refunded: ${row.refundedLabel}`,
    `Balance due: ${row.balanceDueLabel}`,
    '',
    ...manualInstructionLines,
    row.notes ? `Notes: ${row.notes}` : '',
  ].filter((line, index, source) => line || source[index - 1] !== '');

  const contentLines = lines.slice(0, 42).map((line, index) => {
    const fontSize = index === 0 ? 18 : 10;
    const y = index === 0 ? 760 : 728 - (index - 1) * 16;
    return `BT /F1 ${fontSize} Tf 50 ${y} Td (${pdfText(line)}) Tj ET`;
  }).join('\n');
  const contentLength = Buffer.byteLength(contentLines, 'utf8');
  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n',
    '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
    `5 0 obj\n<< /Length ${contentLength} >>\nstream\n${contentLines}\nendstream\nendobj\n`,
  ];
  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  for (const object of objects) {
    offsets.push(Buffer.byteLength(pdf, 'utf8'));
    pdf += object;
  }
  const xrefOffset = Buffer.byteLength(pdf, 'utf8');
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (let index = 1; index <= objects.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  return Buffer.from(pdf, 'utf8');
}
