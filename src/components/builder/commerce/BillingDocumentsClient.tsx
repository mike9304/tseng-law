'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Locale } from '@/lib/locales';
import type {
  BillingDocumentSource,
  BillingDocumentStatus,
  BillingDocumentType,
  BuilderBillingDocumentRow,
} from '@/lib/builder/billing-documents';
import type { BillingDocumentAutomationSettings } from '@/lib/builder/billing-document-automation';
import type { BillingDocumentWebhookEvent } from '@/lib/builder/billing-document-webhooks';
import styles from './BillingDocuments.module.css';

type SourceFilter = BillingDocumentSource | 'all';
type TypeFilter = BillingDocumentType | 'all';
type StatusFilter = BillingDocumentStatus | 'all';
type ManualPaymentMethod = 'cash' | 'bank_transfer' | 'check' | 'other';
type ManualPaymentStatus = 'pending' | 'succeeded' | 'failed' | 'canceled';

interface BillingDocumentsClientProps {
  locale: Locale;
  siteTitle: string;
  initialDocuments: BuilderBillingDocumentRow[];
  initialAutomationSettings: BillingDocumentAutomationSettings;
  initialWebhookEvents?: BillingDocumentWebhookEvent[];
  initialSource?: SourceFilter;
}

type AutomationTarget = 'orders' | 'bookings';
type AutomationRule = 'invoiceOnCreate' | 'receiptOnPaid';
type ManualInstructionField = 'enabled' | 'title' | 'instructions';
type ManualPaymentDraft = {
  amount: string;
  idempotencyKey: string;
  method: ManualPaymentMethod;
  status: ManualPaymentStatus;
  reference: string;
  note: string;
};
type BillingPaymentAnalyticsBucket = {
  currency: string;
  collected: number;
  balanceDue: number;
  refunded: number;
};
type BillingPaymentAnalytics = {
  buckets: BillingPaymentAnalyticsBucket[];
  collectedLabel: string;
  balanceDueLabel: string;
  refundedLabel: string;
  activePayLinks: number;
  manualPending: number;
  needsReview: number;
  failedWebhooks: number;
  attentionRows: Array<{ key: string; label: string; detail: string }>;
};
const manualPaymentMethods: ManualPaymentMethod[] = ['bank_transfer', 'cash', 'check', 'other'];

const COPY = {
  ko: {
    title: '청구서 문서',
    subtitle: '주문과 예약의 청구서, 영수증, 결제 링크, 수동 결제 기록을 한곳에서 관리합니다.',
    products: '제품',
    orders: '주문',
    payments: '결제',
    currency: '통화',
    bookings: '예약',
    refunded: '환불됨',
    stalePayLink: '오래된 결제 링크',
    failedPayment: '실패한 결제',
    failedWebhook: '실패한 웹훅',
    exportCsv: 'CSV 내보내기',
    refresh: '새로고침',
    automaticPolicy: '자동 발행 정책',
    automaticPolicyReady: '자동 발행 정책 준비 완료',
    automaticPolicySaved: '자동 발행 정책이 저장되었습니다.',
    automaticPolicySave: '저장 중...',
    searchPlaceholder: '문서, 고객, 이메일 검색',
    allSources: '모든 출처',
    allTypes: '모든 문서 유형',
    allStatus: '모든 상태',
    invoices: '청구서',
    receipts: '영수증',
    issued: '발행됨',
    emailed: '이메일 발송됨',
    voided: '무효',
    superseded: '대체됨',
    notFoundTitle: '청구서 문서를 찾을 수 없습니다',
    notFoundBody: '주문 또는 예약 문서 작업 후 여기에 표시됩니다.',
    webhookExceptionsTitle: '청구 웹훅 예외',
    webhookExceptionsBody: '화면에 보이는 청구 문서와 일치하지 않는 호스팅 결제 웹훅입니다.',
    webhookExceptionsCount: (shown: number, total: number) => `최신 ${shown}개 / 전체 ${total}개`,
    replay: '다시 재시도',
    replaying: '재시도 중...',
    webhookProcessed: '웹훅 처리됨',
    webhookIgnored: '웹훅 무시됨',
    webhookFailed: '웹훅 실패',
    paymentAnalytics: '결제 분석',
    openAnalytics: '전체 분석 열기',
    hostedLinks: '호스팅 링크',
    paymentLinkActive: '결제 링크 활성',
    paymentLinkClosed: '결제 링크 닫힘',
    paymentLinkStale: '결제 링크 갱신 필요',
    documentActivity: '문서 활동',
    documentActivityBody: '이 문서의 결제 링크 이력과 호스팅 결제 웹훅 이력입니다.',
    hostedWebhooks: '호스팅 결제 웹훅',
    renewalNeeded: '갱신 필요',
    openSource: '원본 열기',
    downloadPdf: 'PDF 다운로드',
    openPay: '결제 열기',
    copyPay: '결제 링크 복사',
    renewPay: '결제 링크 갱신',
    revokePay: '결제 링크 취소',
    createPay: '결제 링크 생성',
    hidePayment: '결제 숨기기',
    recordPayment: '결제 기록',
    viewLink: '링크 열기',
    copyLink: '링크 복사',
    revokeLink: '링크 취소',
    createLink: '링크 생성',
    void: '무효 처리',
    supersede: '대체 문서 발행',
    activity: '활동',
    hideActivity: '활동 숨기기',
    recordOfflinePayment: '오프라인 결제 기록',
    onlySucceeded: '성공한 결제만 잔액을 줄입니다.',
    recordCurrency: '문서 통화로 기록:',
    savePaymentRecord: '결제 기록 저장',
    status: '상태',
    amount: '금액',
    method: '방법',
    reference: '참조',
    note: '메모',
    saving: '저장 중...',
    manualPaymentFailed: '수동 결제 실패',
    payLinkFailed: '결제 링크 실패',
    payLinkCopied: '결제 링크가 복사되었습니다',
    shareLinkCopied: '공유 링크가 복사되었습니다',
  },
  'zh-hant': {
    title: '帳單文件',
    subtitle: '在同一處管理訂單與預約的發票、收據、付款連結與手動付款紀錄。',
    products: '產品',
    orders: '訂單',
    payments: '付款',
    currency: '幣別',
    bookings: '預約',
    refunded: '已退款',
    stalePayLink: '過期付款連結',
    failedPayment: '失敗付款',
    failedWebhook: '失敗的 webhook',
    exportCsv: '匯出 CSV',
    refresh: '重新整理',
    automaticPolicy: '自動開立政策',
    automaticPolicyReady: '自動開立政策已就緒',
    automaticPolicySaved: '自動開立政策已儲存。',
    automaticPolicySave: '儲存中...',
    searchPlaceholder: '搜尋文件、客戶、電子郵件',
    allSources: '所有來源',
    allTypes: '所有文件類型',
    allStatus: '所有狀態',
    invoices: '發票',
    receipts: '收據',
    issued: '已開立',
    emailed: '已寄送',
    voided: '已作廢',
    superseded: '已取代',
    notFoundTitle: '找不到帳單文件',
    notFoundBody: '在訂單或預約文件操作後會顯示於此。',
    webhookExceptionsTitle: '帳單 Webhook 異常',
    webhookExceptionsBody: '與畫面上可見的帳單文件不符的託管付款 Webhook。',
    webhookExceptionsCount: (shown: number, total: number) => `最新 ${shown} 筆 / 共 ${total} 筆`,
    replay: '再次重試',
    replaying: '重試中...',
    webhookProcessed: 'Webhook 已處理',
    webhookIgnored: 'Webhook 已忽略',
    webhookFailed: 'Webhook 失敗',
    paymentAnalytics: '付款分析',
    openAnalytics: '開啟完整分析',
    hostedLinks: '託管連結',
    paymentLinkActive: '付款連結啟用',
    paymentLinkClosed: '付款連結已關閉',
    paymentLinkStale: '付款連結需要更新',
    documentActivity: '文件活動',
    documentActivityBody: '此文件的付款連結歷程與託管付款 webhook 歷程。',
    hostedWebhooks: '託管付款 Webhook',
    renewalNeeded: '需要更新',
    openSource: '開啟來源',
    downloadPdf: '下載 PDF',
    openPay: '開啟付款',
    copyPay: '複製付款連結',
    renewPay: '更新付款連結',
    revokePay: '撤銷付款連結',
    createPay: '建立付款連結',
    hidePayment: '隱藏付款',
    recordPayment: '記錄付款',
    viewLink: '開啟連結',
    copyLink: '複製連結',
    revokeLink: '撤銷連結',
    createLink: '建立連結',
    void: '作廢',
    supersede: '建立取代文件',
    activity: '活動',
    hideActivity: '隱藏活動',
    recordOfflinePayment: '記錄離線付款',
    onlySucceeded: '只有成功的付款才會減少餘額。',
    recordCurrency: '以文件幣別記錄：',
    savePaymentRecord: '儲存付款記錄',
    status: '狀態',
    amount: '金額',
    method: '方式',
    reference: '參考',
    note: '備註',
    saving: '儲存中...',
    manualPaymentFailed: '手動付款失敗',
    payLinkFailed: '付款連結失敗',
    payLinkCopied: '已複製付款連結',
    shareLinkCopied: '已複製分享連結',
  },
  en: {
    title: 'Billing documents',
    subtitle: 'Central invoice and receipt archive for commerce orders and paid booking flows.',
    products: 'Products',
    orders: 'Orders',
    payments: 'Payments',
    currency: 'Currency',
    bookings: 'Bookings',
    refunded: 'Refunded',
    stalePayLink: 'Stale pay link',
    failedPayment: 'Failed payment',
    failedWebhook: 'Failed webhook',
    exportCsv: 'Export CSV',
    refresh: 'Refresh',
    automaticPolicy: 'Automatic issuance policy',
    automaticPolicyReady: 'Automatic issuance policy ready',
    automaticPolicySaved: 'Automatic issuance policy saved.',
    automaticPolicySave: 'Saving policy...',
    searchPlaceholder: 'Search document, customer, email',
    allSources: 'All sources',
    allTypes: 'All document types',
    allStatus: 'All status',
    invoices: 'Invoices',
    receipts: 'Receipts',
    issued: 'Issued',
    emailed: 'Emailed',
    voided: 'Voided',
    superseded: 'Superseded',
    notFoundTitle: 'No billing documents found',
    notFoundBody: 'Issued invoices and receipts will appear here after order or booking document actions.',
    webhookExceptionsTitle: 'Billing webhook exceptions',
    webhookExceptionsBody: 'Hosted payment webhooks that do not match a visible billing document row.',
    webhookExceptionsCount: (shown: number, total: number) => `Showing latest ${shown} of ${total}`,
    replay: 'Replay',
    replaying: 'Replaying...',
    webhookProcessed: 'Webhook processed',
    webhookIgnored: 'Webhook ignored',
    webhookFailed: 'Webhook failed',
    paymentAnalytics: 'Payment analytics',
    openAnalytics: 'Open full analytics',
    hostedLinks: 'Hosted links',
    paymentLinkActive: 'Pay link active',
    paymentLinkClosed: 'Pay link closed',
    paymentLinkStale: 'Pay link needs renewal',
    documentActivity: 'Document activity',
    documentActivityBody: 'Payment link lifecycle and hosted payment webhook history for this document.',
    hostedWebhooks: 'Hosted payment webhooks',
    renewalNeeded: 'Renewal needed',
    openSource: 'Open source',
    downloadPdf: 'Download PDF',
    openPay: 'Open pay',
    copyPay: 'Copy pay',
    renewPay: 'Renew pay',
    revokePay: 'Revoke pay',
    createPay: 'Create pay',
    hidePayment: 'Hide payment',
    recordPayment: 'Record payment',
    viewLink: 'View link',
    copyLink: 'Copy link',
    revokeLink: 'Revoke link',
    createLink: 'Create link',
    void: 'Void',
    supersede: 'Supersede',
    activity: 'Activity',
    hideActivity: 'Hide activity',
    recordOfflinePayment: 'Record offline payment',
    onlySucceeded: 'Only succeeded payments reduce balance.',
    recordCurrency: 'Record in invoice currency:',
    savePaymentRecord: 'Save payment record',
    status: 'Status',
    amount: 'Amount',
    method: 'Method',
    reference: 'Reference',
    note: 'Note',
    saving: 'Saving...',
    manualPaymentFailed: 'Manual payment failed',
    payLinkFailed: 'Pay link failed',
    payLinkCopied: 'Pay link copied',
    shareLinkCopied: 'Share link copied',
  },
} satisfies Record<Locale, Record<string, string | ((shown: number, total: number) => string)>>;

function documentKey(document: Pick<BuilderBillingDocumentRow, 'documentId' | 'source'>): string {
  return `${document.source}:${document.documentId}`;
}

function documentWebhookKey(document: Pick<BuilderBillingDocumentRow, 'documentId' | 'ownerId' | 'source'>): string {
  return `${document.source}:${document.ownerId}:${document.documentId}`;
}

function amountInputDivisor(currency: string): number {
  return currency === 'KRW' || currency === 'JPY' ? 1 : 100;
}

function defaultManualPaymentDraft(document: BuilderBillingDocumentRow): ManualPaymentDraft {
  const divisor = amountInputDivisor(document.currency);
  const idempotencyKey = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${document.source}-${document.documentId}-${Date.now()}`;
  return {
    amount: document.balanceDue > 0 ? (document.balanceDue / divisor).toFixed(divisor === 1 ? 0 : 2) : '',
    idempotencyKey,
    method: 'bank_transfer',
    status: 'succeeded',
    reference: '',
    note: '',
  };
}

function manualPaymentMethodLabel(locale: Locale, method: ManualPaymentMethod): string {
  if (locale === 'ko') {
    switch (method) {
      case 'bank_transfer':
        return '계좌이체';
      case 'cash':
        return '현금';
      case 'check':
        return '수표';
      case 'other':
      default:
        return '기타';
    }
  }
  if (locale === 'zh-hant') {
    switch (method) {
      case 'bank_transfer':
        return '銀行轉帳';
      case 'cash':
        return '現金';
      case 'check':
        return '支票';
      case 'other':
      default:
        return '其他';
    }
  }
  switch (method) {
    case 'bank_transfer':
      return 'Bank transfer';
    case 'cash':
      return 'Cash';
    case 'check':
      return 'Check';
    case 'other':
    default:
      return 'Other';
  }
}

function manualPaymentStatusLabel(locale: Locale, status: ManualPaymentStatus): string {
  if (locale === 'ko') {
    switch (status) {
      case 'succeeded':
        return '성공 - 결제 완료로 계산';
      case 'pending':
        return '대기 - 확인 필요';
      case 'failed':
        return '실패 - 미결제';
      case 'canceled':
      default:
        return '취소 - 미결제';
    }
  }
  if (locale === 'zh-hant') {
    switch (status) {
      case 'succeeded':
        return '成功 - 計入已付款';
      case 'pending':
        return '待處理 - 等待確認';
      case 'failed':
        return '失敗 - 未付款';
      case 'canceled':
      default:
        return '已取消 - 未付款';
    }
  }
  switch (status) {
    case 'succeeded':
      return 'Succeeded - counts as paid';
    case 'pending':
      return 'Pending - awaiting confirmation';
    case 'failed':
      return 'Failed - not paid';
    case 'canceled':
    default:
      return 'Canceled - not paid';
  }
}

function manualPaymentAmountCents(currency: string, amount: string): number {
  return Math.round(Number(amount) * amountInputDivisor(currency));
}

function formatMinorMoney(locale: Locale, currency: string, amount: number): string {
  return new Intl.NumberFormat(locale === 'ko' ? 'ko-KR' : locale === 'zh-hant' ? 'zh-TW' : 'en-US', {
    currency,
    maximumFractionDigits: amountInputDivisor(currency) === 1 ? 0 : 2,
    style: 'currency',
  }).format(amount / amountInputDivisor(currency));
}

function bucketLabel(locale: Locale, buckets: BillingPaymentAnalyticsBucket[], field: keyof Omit<BillingPaymentAnalyticsBucket, 'currency'>): string {
  if (!buckets.length) return '-';
  const primary = buckets[0];
  const suffix = buckets.length > 1 ? ` +${buckets.length - 1}` : '';
  return `${formatMinorMoney(locale, primary.currency, primary[field])}${suffix}`;
}

function canRecordManualPayment(document: BuilderBillingDocumentRow): boolean {
  const isCurrent = document.status === 'issued' || document.status === 'emailed_stub';
  if (!isCurrent || document.type !== 'invoice' || document.balanceDue <= 0) return false;
  if (document.source === 'order') {
    return document.paymentStatus === 'requires_manual_payment' || document.paymentStatus === 'partially_paid';
  }
  return document.paymentStatus !== 'paid'
    && document.paymentStatus !== 'refunded'
    && document.paymentStatus !== 'partial-refund';
}

type PaymentLinkDisplayState = BuilderBillingDocumentRow['paymentLinkStatus'] | 'stale' | 'closed';

function paymentLinkDisplayState(document: BuilderBillingDocumentRow): PaymentLinkDisplayState {
  if (document.paymentReconciliationStatus === 'renew_required') return 'stale';
  if (document.paymentReconciliationStatus === 'settled' && (document.paymentLinkCreatedAt || document.paymentLinkRevokedAt)) return 'closed';
  return document.paymentLinkStatus;
}

function paymentLinkDisplayLabel(locale: Locale, document: BuilderBillingDocumentRow, state: PaymentLinkDisplayState): string {
  if (locale === 'ko') {
    if (state === 'stale') return '결제 링크 갱신 필요 · 잔액 변경';
    if (state === 'closed') return '결제 링크 닫힘 · 잔액 결제됨';
    return `${document.paymentLinkStatusLabel}${document.paymentLinkExpiresAt ? ` · 만료 ${new Date(document.paymentLinkExpiresAt).toLocaleDateString()}` : ''}`;
  }
  if (locale === 'zh-hant') {
    if (state === 'stale') return '付款連結需要更新 · 餘額已變更';
    if (state === 'closed') return '付款連結已關閉 · 餘額已結清';
    return `${document.paymentLinkStatusLabel}${document.paymentLinkExpiresAt ? ` · 到期 ${new Date(document.paymentLinkExpiresAt).toLocaleDateString()}` : ''}`;
  }
  if (state === 'stale') return 'Pay link needs renewal · balance changed';
  if (state === 'closed') return 'Pay link closed · balance paid';
  return `${document.paymentLinkStatusLabel}${document.paymentLinkExpiresAt ? ` · expires ${new Date(document.paymentLinkExpiresAt).toLocaleDateString()}` : ''}`;
}

function paymentLinkEventLabel(locale: Locale, event: BuilderBillingDocumentRow['paymentLinkEvents'][number]): string {
  if (locale === 'ko') {
    if (event.type === 'created') return '결제 링크 생성';
    if (event.type === 'renewed') return '결제 링크 갱신';
    if (event.reason === 'balance_changed') return '결제 후 링크 갱신 필요';
    if (event.reason === 'document_voided') return '무효 처리로 링크 닫힘';
    if (event.reason === 'document_superseded') return '대체 문서로 링크 닫힘';
    return '결제 링크 취소';
  }
  if (locale === 'zh-hant') {
    if (event.type === 'created') return '付款連結已建立';
    if (event.type === 'renewed') return '付款連結已更新';
    if (event.reason === 'balance_changed') return '付款後連結已過期';
    if (event.reason === 'document_voided') return '因作廢而關閉連結';
    if (event.reason === 'document_superseded') return '因取代而關閉連結';
    return '付款連結已撤銷';
  }
  if (event.type === 'created') return 'Pay link created';
  if (event.type === 'renewed') return 'Pay link renewed';
  if (event.reason === 'balance_changed') return 'Pay link stale after payment';
  if (event.reason === 'document_voided') return 'Pay link closed by void';
  if (event.reason === 'document_superseded') return 'Pay link closed by supersede';
  return 'Pay link revoked';
}

function paymentLinkEventDetail(locale: Locale, event: BuilderBillingDocumentRow['paymentLinkEvents'][number]): string {
  const parts = [new Date(event.createdAt).toLocaleString()];
  if (event.expiresAt) parts.push(locale === 'ko' ? `만료 ${new Date(event.expiresAt).toLocaleDateString()}` : locale === 'zh-hant' ? `到期 ${new Date(event.expiresAt).toLocaleDateString()}` : `expires ${new Date(event.expiresAt).toLocaleDateString()}`);
  if (event.balanceDueLabel) parts.push(locale === 'ko' ? `미지급 ${event.balanceDueLabel}` : locale === 'zh-hant' ? `應付 ${event.balanceDueLabel}` : `due ${event.balanceDueLabel}`);
  if (event.paymentId) parts.push(locale === 'ko' ? `결제 ${event.paymentId}` : locale === 'zh-hant' ? `付款 ${event.paymentId}` : `payment ${event.paymentId}`);
  if (event.actor === 'system') parts.push(locale === 'ko' ? '시스템' : locale === 'zh-hant' ? '系統' : 'system');
  return parts.join(' · ');
}

function webhookStatusLabel(locale: Locale, event: BillingDocumentWebhookEvent): string {
  if (locale === 'ko') {
    if (event.status === 'processed') return event.changed ? '웹훅 처리됨' : '웹훅 처리됨 · 변경 없음';
    if (event.status === 'ignored') return '웹훅 무시됨';
    return '웹훅 실패';
  }
  if (locale === 'zh-hant') {
    if (event.status === 'processed') return event.changed ? 'Webhook 已處理' : 'Webhook 已處理 · 無變更';
    if (event.status === 'ignored') return 'Webhook 已忽略';
    return 'Webhook 失敗';
  }
  if (event.status === 'processed') return event.changed ? 'Webhook processed' : 'Webhook processed · no change';
  if (event.status === 'ignored') return 'Webhook ignored';
  return 'Webhook failed';
}

function compactWebhookId(id: string): string {
  return id.length <= 20 ? id : `${id.slice(0, 10)}...${id.slice(-6)}`;
}

function webhookEventDetail(locale: Locale, event: BillingDocumentWebhookEvent): string {
  const divisor = amountInputDivisor(event.currency);
  const amount = (event.amount / divisor).toLocaleString(undefined, {
    maximumFractionDigits: divisor === 1 ? 0 : 2,
    minimumFractionDigits: divisor === 1 ? 0 : 2,
  });
  const parts = [
    new Date(event.receivedAt).toLocaleString(),
    event.eventType,
    event.paymentStatus,
    compactWebhookId(event.providerEventId),
    `${event.currency} ${amount}`,
  ];
  if (event.providerPaymentId) parts.push(event.providerPaymentId);
  if (event.paymentLinkId) parts.push(locale === 'ko' ? `링크 ${compactWebhookId(event.paymentLinkId)}` : locale === 'zh-hant' ? `連結 ${compactWebhookId(event.paymentLinkId)}` : `link ${compactWebhookId(event.paymentLinkId)}`);
  if (event.replayCount > 0) parts.push(locale === 'ko' ? `다시 재생 ${event.replayCount}` : locale === 'zh-hant' ? `已重播 ${event.replayCount}` : `replayed ${event.replayCount}`);
  if (event.error) parts.push(event.error);
  return parts.map((part) => (part.startsWith('pi_') || part.startsWith('cs_') ? compactWebhookId(part) : part)).join(' · ');
}

function webhookSummaryLabel(locale: Locale, events: BillingDocumentWebhookEvent[]): string {
  if (!events.length) return locale === 'ko' ? '호스팅 웹훅 없음' : locale === 'zh-hant' ? '無託管 Webhook' : 'No hosted webhooks';
  const failed = events.filter((event) => event.status === 'failed').length;
  const ignored = events.filter((event) => event.status === 'ignored').length;
  const processed = events.filter((event) => event.status === 'processed').length;
  if (failed) return locale === 'ko' ? `웹훅 실패 · ${failed}/${events.length}` : locale === 'zh-hant' ? `Webhook 失敗 · ${failed}/${events.length}` : `Webhook failed · ${failed}/${events.length}`;
  if (ignored) return locale === 'ko' ? `웹훅 무시됨 · ${ignored}/${events.length}` : locale === 'zh-hant' ? `Webhook 已忽略 · ${ignored}/${events.length}` : `Webhook ignored · ${ignored}/${events.length}`;
  return locale === 'ko' ? `웹훅 처리됨 · ${processed}/${events.length}` : locale === 'zh-hant' ? `Webhook 已處理 · ${processed}/${events.length}` : `Webhook processed · ${processed}/${events.length}`;
}

function documentCsv(documents: BuilderBillingDocumentRow[]): string {
  const rows = [
    ['source', 'sourceId', 'documentNumber', 'type', 'status', 'paymentStatus', 'paymentLinkStatus', 'paymentReconciliationStatus', 'customer', 'email', 'total', 'refunded', 'balanceDue', 'currency', 'issuedAt', 'shareStatus', 'shareExpiresAt', 'voidedAt', 'voidReason', 'supersedesDocumentId', 'supersededByDocumentId', 'viewCount', 'downloadCount'],
    ...documents.map((document) => [
      document.source,
      document.ownerId,
      document.number,
      document.type,
      document.status,
      document.paymentStatus ?? '',
      document.paymentLinkStatus,
      document.paymentReconciliationStatus,
      document.customerLabel,
      document.recipientEmail,
      document.totalLabel,
      document.refundedLabel,
      document.balanceDueLabel,
      document.currency,
      document.issuedAt,
      document.shareStatus,
      document.shareLinkExpiresAt ?? '',
      document.voidedAt ?? '',
      document.voidReason ?? '',
      document.supersedesDocumentId ?? '',
      document.supersededByDocumentId ?? '',
      document.viewCount,
      document.downloadCount,
    ]),
  ];
  return rows.map((row) => row.map((value) => {
    const text = String(value ?? '');
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  }).join(',')).join('\n');
}

export default function BillingDocumentsClient({
  locale,
  siteTitle,
  initialDocuments,
  initialAutomationSettings,
  initialWebhookEvents = [],
  initialSource = 'all',
}: BillingDocumentsClientProps) {
  const c = COPY[locale];
  const [documents, setDocuments] = useState(initialDocuments);
  const [webhookEvents, setWebhookEvents] = useState(initialWebhookEvents);
  const [automationSettings, setAutomationSettings] = useState(initialAutomationSettings);
  const [automationDraft, setAutomationDraft] = useState(initialAutomationSettings);
  const [automationNotice, setAutomationNotice] = useState(String(c.automaticPolicyReady));
  const [savingAutomation, setSavingAutomation] = useState(false);
  const [query, setQuery] = useState('');
  const [source, setSource] = useState<SourceFilter>(initialSource);
  const [type, setType] = useState<TypeFilter>('all');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [notice, setNotice] = useState(locale === 'ko' ? '준비됨' : locale === 'zh-hant' ? '已就緒' : 'Ready');
  const [exportText, setExportText] = useState('');
  const [manualPaymentOpenKey, setManualPaymentOpenKey] = useState('');
  const [manualPaymentBusyKey, setManualPaymentBusyKey] = useState('');
  const [manualPaymentDrafts, setManualPaymentDrafts] = useState<Record<string, ManualPaymentDraft>>({});
  const [activityOpenKey, setActivityOpenKey] = useState('');
  const [webhookBusyId, setWebhookBusyId] = useState('');

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return documents
      .filter((document) => source === 'all' || document.source === source)
      .filter((document) => type === 'all' || document.type === type)
      .filter((document) => status === 'all' || document.status === status)
      .filter((document) => {
        if (!search) return true;
        return [
          document.source,
          document.sourceLabel,
          document.ownerId,
          document.ownerLabel,
          document.documentId,
          document.number,
          document.type,
          document.status,
          document.paymentStatus ?? '',
          document.paymentStatusLabel,
          document.paymentLinkStatus,
          document.paymentLinkStatusLabel,
          document.customerLabel,
          document.recipientEmail,
          document.contextLabel,
          document.notes ?? '',
        ].some((value) => value.toLowerCase().includes(search));
      });
  }, [documents, query, source, status, type]);

  const counts = useMemo(() => ({
    total: documents.length,
    invoices: documents.filter((document) => document.type === 'invoice').length,
    receipts: documents.filter((document) => document.type === 'receipt').length,
    orders: documents.filter((document) => document.source === 'order').length,
    bookings: documents.filter((document) => document.source === 'booking').length,
    emailed: documents.filter((document) => document.status === 'emailed_stub').length,
    shared: documents.filter((document) => document.shareStatus === 'active').length,
  }), [documents]);

  const webhookEventsByDocument = useMemo(() => {
    const map = new Map<string, BillingDocumentWebhookEvent[]>();
    webhookEvents.forEach((event) => {
      const key = `${event.source}:${event.ownerId}:${event.documentId}`;
      map.set(key, [...(map.get(key) ?? []), event]);
    });
    map.forEach((events, key) => {
      map.set(key, events.sort((left, right) => right.receivedAt.localeCompare(left.receivedAt)));
    });
    return map;
  }, [webhookEvents]);

  const unmatchedWebhookEvents = useMemo(() => {
    const documentKeys = new Set(documents.map((document) => documentWebhookKey(document)));
    return webhookEvents
      .filter((event) => !documentKeys.has(`${event.source}:${event.ownerId}:${event.documentId}`))
      .filter((event) => event.status !== 'processed')
      .sort((left, right) => right.receivedAt.localeCompare(left.receivedAt));
  }, [documents, webhookEvents]);

  const paymentAnalytics = useMemo<BillingPaymentAnalytics>(() => {
    const buckets = new Map<string, BillingPaymentAnalyticsBucket>();
    const attentionRows: BillingPaymentAnalytics['attentionRows'] = [];
    let manualPending = 0;
    let activePayLinks = 0;
    let needsReview = unmatchedWebhookEvents.length;
    const failedWebhooks = webhookEvents.filter((event) => event.status === 'failed').length;

    const bucketFor = (currency: string): BillingPaymentAnalyticsBucket => {
      const normalized = currency.trim().toUpperCase() || 'TWD';
      const existing = buckets.get(normalized);
      if (existing) return existing;
      const next = { currency: normalized, collected: 0, balanceDue: 0, refunded: 0 };
      buckets.set(normalized, next);
      return next;
    };

    for (const document of filtered) {
      if (document.status === 'voided' || document.status === 'superseded') continue;
      const bucket = bucketFor(document.currency);
      bucket.refunded += Math.max(0, document.refundedAmount);
      bucket.balanceDue += Math.max(0, document.balanceDue);
      bucket.collected += Math.max(0, document.totalAmount - document.refundedAmount - document.balanceDue);
      if (document.paymentLinkStatus === 'active') activePayLinks += 1;
      if (document.balanceDue > 0 && document.paymentStatus !== 'failed') manualPending += 1;
      const stale = document.paymentReconciliationStatus === 'renew_required' || document.paymentLinkRenewalNeeded;
      const failedPayment = document.paymentStatus === 'failed';
      const documentEvents = webhookEventsByDocument.get(documentWebhookKey(document)) ?? [];
      const documentFailedWebhooks = documentEvents.filter((event) => event.status === 'failed');
      if (stale || failedPayment || documentFailedWebhooks.length > 0) {
        needsReview += 1;
        attentionRows.push({
          key: documentWebhookKey(document),
          label: stale ? c.stalePayLink : failedPayment ? c.failedPayment : c.failedWebhook,
          detail: `${document.number} · ${document.sourceLabel} · ${document.paymentReconciliationStatusLabel}`,
        });
      }
    }

    for (const event of unmatchedWebhookEvents.slice(0, 3)) {
      attentionRows.push({
        key: event.eventId,
        label: webhookStatusLabel(locale, event),
        detail: `${event.source} · ${event.paymentStatus} · ${compactWebhookId(event.providerEventId)}`,
      });
    }

    const sortedBuckets = Array.from(buckets.values())
      .sort((left, right) => (right.collected - left.collected) || left.currency.localeCompare(right.currency));

    return {
      buckets: sortedBuckets,
      collectedLabel: bucketLabel(locale, sortedBuckets, 'collected'),
      balanceDueLabel: bucketLabel(locale, sortedBuckets, 'balanceDue'),
      refundedLabel: bucketLabel(locale, sortedBuckets, 'refunded'),
      activePayLinks,
      manualPending,
      needsReview,
      failedWebhooks,
      attentionRows: attentionRows.slice(0, 5),
    };
  }, [filtered, locale, unmatchedWebhookEvents, webhookEvents, webhookEventsByDocument]);

  const automationDirty = useMemo(
    () => JSON.stringify(automationDraft) !== JSON.stringify(automationSettings),
    [automationDraft, automationSettings],
  );

  function replaceDocument(document: BuilderBillingDocumentRow) {
    setDocuments((current) => {
      const exists = current.some((entry) => (
        entry.source === document.source && entry.documentId === document.documentId
      ));
      if (!exists) return [document, ...current];
      return current.map((entry) => (
        entry.source === document.source && entry.documentId === document.documentId ? document : entry
      ));
    });
  }

  async function refreshDocuments() {
    const [response, webhookResponse] = await Promise.all([
      fetch(`/api/builder/billing-documents?locale=${encodeURIComponent(locale)}&source=all`, {
        cache: 'no-store',
      }),
      fetch(`/api/builder/billing-documents/webhooks?locale=${encodeURIComponent(locale)}`, {
        cache: 'no-store',
      }),
    ]);
    const payload = await response.json().catch(() => ({})) as {
      ok?: boolean;
      documents?: BuilderBillingDocumentRow[];
      error?: string;
    };
    if (!response.ok || !payload.ok || !Array.isArray(payload.documents)) {
      setNotice(payload.error ?? (locale === 'ko' ? '문서 새로고침에 실패했습니다.' : locale === 'zh-hant' ? '文件重新整理失敗。' : 'Document refresh failed'));
      return;
    }
    setDocuments(payload.documents);
    const webhookPayload = await webhookResponse.json().catch(() => ({})) as {
      ok?: boolean;
      events?: BillingDocumentWebhookEvent[];
      error?: string;
    };
    if (webhookResponse.ok && webhookPayload.ok && Array.isArray(webhookPayload.events)) {
      setWebhookEvents(webhookPayload.events);
    }
  }

  async function replayWebhookEvent(event: BillingDocumentWebhookEvent) {
    setWebhookBusyId(event.eventId);
    setNotice(locale === 'ko' ? '호스팅 웹훅 다시 재생 중...' : locale === 'zh-hant' ? '重播託管 Webhook 中...' : 'Replaying hosted webhook...');
    try {
      const response = await fetch(`/api/builder/billing-documents/webhooks/events/${encodeURIComponent(event.eventId)}/replay?locale=${encodeURIComponent(locale)}`, {
        method: 'POST',
      });
      const payload = await response.json().catch(() => ({})) as {
        ok?: boolean;
        event?: BillingDocumentWebhookEvent;
        changed?: boolean;
        reason?: string;
        error?: string;
      };
      if (!response.ok || !payload.ok || !payload.event) {
        setNotice(payload.error ?? payload.reason ?? (locale === 'ko' ? '웹훅 다시 재생에 실패했습니다.' : locale === 'zh-hant' ? 'Webhook 重播失敗。' : 'Webhook replay failed'));
        return;
      }
      setWebhookEvents((current) => current.map((entry) => (
        entry.eventId === payload.event?.eventId ? payload.event : entry
      )));
      await refreshDocuments();
      setNotice(payload.changed
        ? (locale === 'ko' ? '웹훅 다시 재생으로 변경사항이 적용되었습니다.' : locale === 'zh-hant' ? 'Webhook 重播已套用變更。' : 'Webhook replay applied changes')
        : (locale === 'ko' ? '웹훅 다시 재생이 완료되었지만 문서 변경은 없었습니다.' : locale === 'zh-hant' ? 'Webhook 重播完成，但文件未變更。' : 'Webhook replay completed with no document change'));
    } finally {
      setWebhookBusyId('');
    }
  }

  function updateAutomationRule(
    target: AutomationTarget,
    rule: AutomationRule,
    field: 'enabled' | 'email',
    value: boolean,
  ) {
    setAutomationDraft((current) => {
      const nextRule = {
        ...current[target][rule],
        [field]: value,
      };
      if (field === 'enabled' && !value) nextRule.email = false;
      return {
        ...current,
        [target]: {
          ...current[target],
          [rule]: nextRule,
        },
      };
    });
  }

  function updateManualInstruction(
    target: AutomationTarget,
    method: ManualPaymentMethod,
    field: ManualInstructionField,
    value: boolean | string,
  ) {
    setAutomationDraft((current) => ({
      ...current,
      manualPayments: {
        ...current.manualPayments,
        [target]: {
          ...current.manualPayments[target],
          [method]: {
            ...current.manualPayments[target][method],
            [field]: value,
          },
        },
      },
    }));
  }

  async function saveAutomationPolicy() {
    setSavingAutomation(true);
    setAutomationNotice(String(c.automaticPolicySave));
    try {
      const response = await fetch(`/api/builder/billing-documents/settings?locale=${encodeURIComponent(locale)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: automationDraft }),
      });
      const payload = await response.json().catch(() => ({})) as {
        ok?: boolean;
        settings?: BillingDocumentAutomationSettings;
        error?: string;
      };
      if (!response.ok || !payload.ok || !payload.settings) {
        setAutomationNotice(payload.error ?? (locale === 'ko' ? '자동 발행 정책을 저장하지 못했습니다.' : locale === 'zh-hant' ? '無法儲存自動開立政策。' : 'Could not save automatic issuance policy.'));
        return;
      }
      setAutomationSettings(payload.settings);
      setAutomationDraft(payload.settings);
      setAutomationNotice(String(c.automaticPolicySaved));
    } catch {
      setAutomationNotice(locale === 'ko' ? '자동 발행 정책을 저장하지 못했습니다.' : locale === 'zh-hant' ? '無法儲存自動開立政策。' : 'Could not save automatic issuance policy.');
    } finally {
      setSavingAutomation(false);
    }
  }

  async function copyShareLink(path: string) {
    if (!path) {
      setNotice(locale === 'ko' ? '먼저 공유 링크를 생성하세요.' : locale === 'zh-hant' ? '請先建立分享連結。' : 'Create a share link first');
      return;
    }
    const url = new URL(path, window.location.origin).toString();
    try {
      await navigator.clipboard.writeText(url);
      setNotice(String(c.shareLinkCopied));
    } catch {
      setNotice(locale === 'ko' ? '복사 실패. 링크를 열고 주소 표시줄에서 복사하세요.' : locale === 'zh-hant' ? '複製失敗。請開啟連結並從網址列複製。' : 'Copy failed. Open link and copy from the address bar.');
    }
  }

  async function copyPaymentLink(path: string) {
    if (!path) {
      setNotice(locale === 'ko' ? '사용 가능한 결제 링크가 없습니다.' : locale === 'zh-hant' ? '沒有可用的付款連結。' : 'No payment link available');
      return;
    }
    const url = new URL(path, window.location.origin).toString();
    try {
      await navigator.clipboard.writeText(url);
      setNotice(String(c.payLinkCopied));
    } catch {
      setNotice(locale === 'ko' ? '복사 실패. 결제 링크를 열고 주소 표시줄에서 복사하세요.' : locale === 'zh-hant' ? '複製失敗。請開啟付款連結並從網址列複製。' : 'Copy failed. Open payment link and copy from the address bar.');
    }
  }

  async function createPaymentLink(document: BuilderBillingDocumentRow) {
    const renew = document.paymentLinkStatus !== 'not_created';
    setNotice(renew ? (locale === 'ko' ? '결제 링크 갱신 중...' : locale === 'zh-hant' ? '更新付款連結中...' : 'Renewing pay link...') : (locale === 'ko' ? '결제 링크 생성 중...' : locale === 'zh-hant' ? '建立付款連結中...' : 'Creating pay link...'));
    const response = await fetch(`/api/builder/billing-documents/${encodeURIComponent(document.source)}/${encodeURIComponent(document.ownerId)}/${encodeURIComponent(document.documentId)}/payment-link?locale=${encodeURIComponent(locale)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ renew }),
    });
    const payload = await response.json().catch(() => ({})) as { ok?: boolean; document?: BuilderBillingDocumentRow; error?: string };
    if (!response.ok || !payload.ok || !payload.document) {
      setNotice(payload.error ?? (locale === 'ko' ? '결제 링크 생성에 실패했습니다.' : locale === 'zh-hant' ? '付款連結失敗。' : 'Pay link failed'));
      return;
    }
    replaceDocument(payload.document);
    await copyPaymentLink(payload.document.paymentLinkPath);
    if (renew) setNotice(locale === 'ko' ? '새 결제 링크가 복사되었습니다.' : locale === 'zh-hant' ? '新的付款連結已複製。' : 'New pay link copied');
  }

  async function revokePaymentLink(document: BuilderBillingDocumentRow) {
    setNotice(locale === 'ko' ? '결제 링크 취소 중...' : locale === 'zh-hant' ? '撤銷付款連結中...' : 'Revoking pay link...');
    const response = await fetch(`/api/builder/billing-documents/${encodeURIComponent(document.source)}/${encodeURIComponent(document.ownerId)}/${encodeURIComponent(document.documentId)}/payment-link?locale=${encodeURIComponent(locale)}`, {
      method: 'DELETE',
    });
    const payload = await response.json().catch(() => ({})) as { ok?: boolean; document?: BuilderBillingDocumentRow; error?: string };
    if (!response.ok || !payload.ok || !payload.document) {
      setNotice(payload.error ?? (locale === 'ko' ? '결제 링크 취소에 실패했습니다.' : locale === 'zh-hant' ? '撤銷付款連結失敗。' : 'Pay link revoke failed'));
      return;
    }
    replaceDocument(payload.document);
    setNotice(locale === 'ko' ? '결제 링크가 취소되었습니다.' : locale === 'zh-hant' ? '付款連結已撤銷。' : 'Pay link revoked');
  }

  async function updateLifecycle(document: BuilderBillingDocumentRow, action: 'void' | 'supersede') {
    setNotice(action === 'void' ? (locale === 'ko' ? '문서 무효 처리 중...' : locale === 'zh-hant' ? '文件作廢中...' : 'Voiding document...') : (locale === 'ko' ? '대체 문서 발행 중...' : locale === 'zh-hant' ? '建立取代文件中...' : 'Creating superseding document...'));
    const reason = action === 'void'
      ? (locale === 'ko' ? '중앙 청구서 관리자에서 무효 처리됨' : locale === 'zh-hant' ? '已由中央帳單管理員作廢' : 'Voided in central billing manager')
      : (locale === 'ko' ? '중앙 청구서 관리자에서 대체됨' : locale === 'zh-hant' ? '已由中央帳單管理員取代' : 'Superseded in central billing manager');
    const response = await fetch(`/api/builder/billing-documents/${encodeURIComponent(document.source)}/${encodeURIComponent(document.ownerId)}/${encodeURIComponent(document.documentId)}/lifecycle?locale=${encodeURIComponent(locale)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action,
        reason,
      }),
    });
    const payload = await response.json().catch(() => ({})) as {
      ok?: boolean;
      document?: BuilderBillingDocumentRow;
      supersededDocument?: BuilderBillingDocumentRow;
      error?: string;
    };
    if (!response.ok || !payload.ok || !payload.document) {
      setNotice(payload.error ?? (locale === 'ko' ? '문서 상태 변경에 실패했습니다.' : locale === 'zh-hant' ? '文件生命週期更新失敗。' : 'Lifecycle update failed'));
      return;
    }
    if (payload.supersededDocument) replaceDocument(payload.supersededDocument);
    replaceDocument(payload.document);
    setNotice(action === 'void' ? (locale === 'ko' ? '문서가 무효 처리되었습니다.' : locale === 'zh-hant' ? '文件已作廢。' : 'Document voided') : (locale === 'ko' ? '대체 문서가 발행되었습니다.' : locale === 'zh-hant' ? '已發出取代文件。' : 'Superseding document issued'));
  }

  async function createShareLink(document: BuilderBillingDocumentRow) {
    setNotice(locale === 'ko' ? '공유 링크 생성 중...' : locale === 'zh-hant' ? '建立分享連結中...' : 'Creating share link...');
    const response = await fetch(`/api/builder/billing-documents/${encodeURIComponent(document.source)}/${encodeURIComponent(document.ownerId)}/${encodeURIComponent(document.documentId)}/share-link?locale=${encodeURIComponent(locale)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    const payload = await response.json().catch(() => ({})) as { ok?: boolean; document?: BuilderBillingDocumentRow; error?: string };
    if (!response.ok || !payload.ok || !payload.document) {
      setNotice(payload.error ?? (locale === 'ko' ? '공유 링크 생성에 실패했습니다.' : locale === 'zh-hant' ? '分享連結失敗。' : 'Share link failed'));
      return;
    }
    replaceDocument(payload.document);
    await copyShareLink(payload.document.sharePath);
  }

  async function revokeShareLink(document: BuilderBillingDocumentRow) {
    setNotice(locale === 'ko' ? '공유 링크 취소 중...' : locale === 'zh-hant' ? '撤銷分享連結中...' : 'Revoking share link...');
    const response = await fetch(`/api/builder/billing-documents/${encodeURIComponent(document.source)}/${encodeURIComponent(document.ownerId)}/${encodeURIComponent(document.documentId)}/share-link?locale=${encodeURIComponent(locale)}`, {
      method: 'DELETE',
    });
    const payload = await response.json().catch(() => ({})) as { ok?: boolean; document?: BuilderBillingDocumentRow; error?: string };
    if (!response.ok || !payload.ok || !payload.document) {
      setNotice(payload.error ?? (locale === 'ko' ? '공유 링크 취소에 실패했습니다.' : locale === 'zh-hant' ? '撤銷分享連結失敗。' : 'Revoke failed'));
      return;
    }
    replaceDocument(payload.document);
    setNotice(locale === 'ko' ? '공유 링크가 취소되었습니다.' : locale === 'zh-hant' ? '分享連結已撤銷。' : 'Share link revoked');
  }

  async function recordManualPayment(document: BuilderBillingDocumentRow) {
    const key = documentKey(document);
    const draft = manualPaymentDrafts[key] ?? defaultManualPaymentDraft(document);
    const amountCents = manualPaymentAmountCents(document.currency, draft.amount);
    if (!Number.isFinite(amountCents) || amountCents <= 0) {
      setNotice(locale === 'ko' ? '유효한 수동 결제 금액을 입력하세요.' : locale === 'zh-hant' ? '請輸入有效的手動付款金額。' : 'Enter a valid manual payment amount');
      return;
    }
    if (amountCents > document.balanceDue) {
      setNotice(locale === 'ko' ? '수동 결제 금액이 미지급 잔액을 초과합니다.' : locale === 'zh-hant' ? '手動付款金額超過應付餘額。' : 'Manual payment exceeds balance due');
      return;
    }

    setManualPaymentBusyKey(key);
    setNotice(locale === 'ko' ? '중앙 수동 결제 기록 중...' : locale === 'zh-hant' ? '記錄中央手動付款中...' : 'Recording central manual payment...');
    try {
      const response = await fetch(`/api/builder/billing-documents/${encodeURIComponent(document.source)}/${encodeURIComponent(document.ownerId)}/${encodeURIComponent(document.documentId)}/manual-payments?locale=${encodeURIComponent(locale)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountCents,
          idempotencyKey: draft.idempotencyKey,
          method: draft.method,
          status: draft.status,
          reference: draft.reference,
          note: draft.note,
        }),
      });
      const payload = await response.json().catch(() => ({})) as {
        ok?: boolean;
        document?: BuilderBillingDocumentRow;
        error?: string;
      };
      if (!response.ok || !payload.ok || !payload.document) {
        setNotice(payload.error ?? (locale === 'ko' ? '수동 결제 기록에 실패했습니다.' : locale === 'zh-hant' ? '手動付款失敗。' : 'Manual payment failed'));
        return;
      }

      replaceDocument(payload.document);
      await refreshDocuments();
      const nextDraft = defaultManualPaymentDraft(payload.document);
      setManualPaymentDrafts((current) => ({
        ...current,
        [key]: nextDraft,
      }));
      if (payload.document.balanceDue <= 0) setManualPaymentOpenKey('');
      setNotice(payload.document.balanceDue <= 0 ? (locale === 'ko' ? '수동 결제로 잔액이 정리되었습니다.' : locale === 'zh-hant' ? '手動付款已結清餘額。' : 'Manual payment completed balance') : (locale === 'ko' ? '수동 결제가 기록되었습니다.' : locale === 'zh-hant' ? '手動付款已記錄。' : 'Manual payment recorded'));
    } finally {
      setManualPaymentBusyKey('');
    }
  }

  return (
    <section className={styles.manager} data-billing-documents-admin>
      <header className={styles.header}>
        <div>
          <span>{siteTitle}</span>
          <h1>{c.title}</h1>
          <p>{c.subtitle}</p>
        </div>
        <div className={styles.headerActions}>
          <Link href={`/${locale}/admin-builder/commerce/products`}>{c.products}</Link>
          <Link href={`/${locale}/admin-builder/commerce/orders`}>{c.orders}</Link>
          <Link href={`/${locale}/admin-builder/commerce/payments`}>{c.payments}</Link>
          <Link href={`/${locale}/admin-builder/commerce/currency`}>{c.currency}</Link>
          <Link href={`/${locale}/admin-builder/bookings/dashboard`}>{c.bookings}</Link>
          <button
            type="button"
            onClick={() => {
              setExportText(documentCsv(filtered));
              setNotice(locale === 'ko' ? 'CSV 내보내기 준비됨' : locale === 'zh-hant' ? 'CSV 匯出已就緒' : 'Export ready');
            }}
            data-billing-documents-export
          >
            {c.exportCsv}
          </button>
          <button type="button" onClick={() => void refreshDocuments()} data-billing-documents-refresh>
            {c.refresh}
          </button>
        </div>
      </header>

      <section className={styles.kpis} aria-label={locale === 'ko' ? '청구서 문서 통계' : locale === 'zh-hant' ? '帳單文件統計' : 'Billing document stats'}>
        {Object.entries(counts).map(([key, value]) => (
          <article key={key} data-billing-documents-kpi={key}>
            <strong>{value}</strong>
            <span>
              {key === 'total'
                ? (locale === 'ko' ? '총계' : locale === 'zh-hant' ? '總計' : 'Total')
                : key === 'invoices'
                  ? c.invoices
                  : key === 'receipts'
                    ? c.receipts
                    : key === 'orders'
                      ? c.orders
                      : key === 'bookings'
                        ? c.bookings
                        : key === 'emailed'
                          ? c.emailed
                          : locale === 'ko'
                            ? '공유됨'
                            : locale === 'zh-hant'
                              ? '已分享'
                              : 'Shared'}
            </span>
          </article>
        ))}
      </section>

      <section className={styles.paymentAnalytics} data-payment-analytics>
        <div className={styles.paymentAnalyticsHeader}>
          <div>
            <span>{c.paymentAnalytics}</span>
            <h2>{locale === 'ko' ? '현재 문서 범위' : locale === 'zh-hant' ? '目前文件範圍' : 'Current document scope'}</h2>
          </div>
          <Link href={`/${locale}/admin-builder/commerce/payments`}>{c.openAnalytics}</Link>
        </div>
        <div className={styles.paymentAnalyticsCards}>
          <article data-payment-analytics-kpi="collected">
            <strong>{paymentAnalytics.collectedLabel}</strong>
            <span>{locale === 'ko' ? '수금됨' : locale === 'zh-hant' ? '已收款' : 'Collected'}</span>
          </article>
          <article data-payment-analytics-kpi="balance-due">
            <strong>{paymentAnalytics.balanceDueLabel}</strong>
            <span>{locale === 'ko' ? '미지급 잔액' : locale === 'zh-hant' ? '應付餘額' : 'Balance due'}</span>
          </article>
          <article data-payment-analytics-kpi="manual-pending">
            <strong>{paymentAnalytics.manualPending}</strong>
            <span>{locale === 'ko' ? '수동 대기' : locale === 'zh-hant' ? '手動待處理' : 'Manual pending'}</span>
          </article>
          <article data-payment-analytics-kpi="refunded">
            <strong>{paymentAnalytics.refundedLabel}</strong>
            <span>{c.refunded}</span>
          </article>
          <article data-payment-analytics-kpi="needs-review">
            <strong>{paymentAnalytics.needsReview}</strong>
            <span>{locale === 'ko' ? '검토 필요' : locale === 'zh-hant' ? '需要檢視' : 'Needs review'}</span>
          </article>
        </div>
        <div className={styles.paymentMix} data-payment-analytics-mix>
          <span data-payment-analytics-segment style={{ flexGrow: Math.max(1, paymentAnalytics.activePayLinks) }} />
          <span data-payment-analytics-segment style={{ flexGrow: Math.max(1, paymentAnalytics.manualPending) }} />
          <span data-payment-analytics-segment style={{ flexGrow: Math.max(1, paymentAnalytics.failedWebhooks) }} />
        </div>
        <div className={styles.paymentMixLegend}>
          <span>{c.hostedLinks} {paymentAnalytics.activePayLinks}</span>
          <span>{locale === 'ko' ? '수동 미결제' : locale === 'zh-hant' ? '手動應付' : 'Manual due'} {paymentAnalytics.manualPending}</span>
          <span>{locale === 'ko' ? '웹훅 실패' : locale === 'zh-hant' ? 'Webhook 失敗' : 'Webhook failures'} {paymentAnalytics.failedWebhooks}</span>
        </div>
        <div className={styles.paymentAttention} data-payment-analytics-attention>
          {paymentAnalytics.attentionRows.length > 0 ? paymentAnalytics.attentionRows.map((row) => (
            <article key={row.key} data-payment-analytics-attention-row>
              <strong>{row.label}</strong>
              <span>{row.detail}</span>
            </article>
          )) : (
            <article data-payment-analytics-empty>
              <strong>{locale === 'ko' ? '결제 예외 없음' : locale === 'zh-hant' ? '沒有付款異常' : 'No payment exceptions'}</strong>
              <span>{locale === 'ko' ? '실패한 웹훅, 오래된 결제 링크, 실패한 결제 행이 여기에 표시됩니다.' : locale === 'zh-hant' ? '失敗的 webhook、過期的付款連結與失敗付款列會顯示於此。' : 'Failed webhooks, stale pay links, and failed payment rows will appear here.'}</span>
            </article>
          )}
        </div>
      </section>

      <section className={styles.automationPanel} data-billing-auto-policy>
        <div className={styles.automationHeader}>
          <div>
            <h2>{c.automaticPolicy}</h2>
            <p>{locale === 'ko' ? '청구서와 영수증이 자동 생성되는 시점을 선택합니다. 수동 작업은 계속 가능합니다.' : locale === 'zh-hant' ? '選擇發票與收據自動建立的時機。仍可使用手動操作。' : 'Choose when invoices and receipts are created automatically. Manual actions remain available.'}</p>
          </div>
          <button
            type="button"
            onClick={() => void saveAutomationPolicy()}
            disabled={savingAutomation || !automationDirty}
            data-billing-auto-policy-save
          >
            {savingAutomation ? c.automaticPolicySave : (locale === 'ko' ? '정책 저장' : locale === 'zh-hant' ? '儲存政策' : 'Save policy')}
          </button>
        </div>
        <div className={styles.automationGroups}>
          <div className={styles.automationGroup} data-billing-auto-policy-group="orders">
            <strong>{locale === 'ko' ? '커머스 주문' : locale === 'zh-hant' ? '商務訂單' : 'Commerce orders'}</strong>
            <label>
              <input
                type="checkbox"
                checked={automationDraft.orders.invoiceOnCreate.enabled}
                onChange={(event) => updateAutomationRule('orders', 'invoiceOnCreate', 'enabled', event.target.checked)}
                data-billing-auto-order-invoice
              />
              <span>{locale === 'ko' ? '새 주문에 대해 청구서를 자동 발행' : locale === 'zh-hant' ? '新訂單自動開立發票' : 'Auto-issue invoices for new orders'}</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={automationDraft.orders.invoiceOnCreate.email}
                disabled={!automationDraft.orders.invoiceOnCreate.enabled}
                onChange={(event) => updateAutomationRule('orders', 'invoiceOnCreate', 'email', event.target.checked)}
                data-billing-auto-order-invoice-email
              />
              <span>{locale === 'ko' ? '주문 청구서를 자동 이메일' : locale === 'zh-hant' ? '自動寄送訂單發票' : 'Auto-email order invoices'}</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={automationDraft.orders.receiptOnPaid.enabled}
                onChange={(event) => updateAutomationRule('orders', 'receiptOnPaid', 'enabled', event.target.checked)}
                data-billing-auto-order-receipt
              />
              <span>{locale === 'ko' ? '주문 결제 시 영수증 자동 발행' : locale === 'zh-hant' ? '訂單付款後自動開立收據' : 'Auto-issue receipts when orders are paid'}</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={automationDraft.orders.receiptOnPaid.email}
                disabled={!automationDraft.orders.receiptOnPaid.enabled}
                onChange={(event) => updateAutomationRule('orders', 'receiptOnPaid', 'email', event.target.checked)}
                data-billing-auto-order-receipt-email
              />
              <span>{locale === 'ko' ? '주문 영수증을 자동 이메일' : locale === 'zh-hant' ? '自動寄送訂單收據' : 'Auto-email order receipts'}</span>
            </label>
          </div>
          <div className={styles.automationGroup} data-billing-auto-policy-group="bookings">
            <strong>{c.bookings}</strong>
            <label>
              <input
                type="checkbox"
                checked={automationDraft.bookings.invoiceOnCreate.enabled}
                onChange={(event) => updateAutomationRule('bookings', 'invoiceOnCreate', 'enabled', event.target.checked)}
                data-billing-auto-booking-invoice
              />
              <span>{locale === 'ko' ? '새 예약에 대해 청구서를 자동 발행' : locale === 'zh-hant' ? '新預約自動開立發票' : 'Auto-issue invoices for new bookings'}</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={automationDraft.bookings.invoiceOnCreate.email}
                disabled={!automationDraft.bookings.invoiceOnCreate.enabled}
                onChange={(event) => updateAutomationRule('bookings', 'invoiceOnCreate', 'email', event.target.checked)}
                data-billing-auto-booking-invoice-email
              />
              <span>{locale === 'ko' ? '예약 청구서를 자동 이메일' : locale === 'zh-hant' ? '自動寄送預約發票' : 'Auto-email booking invoices'}</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={automationDraft.bookings.receiptOnPaid.enabled}
                onChange={(event) => updateAutomationRule('bookings', 'receiptOnPaid', 'enabled', event.target.checked)}
                data-billing-auto-booking-receipt
              />
              <span>{locale === 'ko' ? '예약 결제 시 영수증 자동 발행' : locale === 'zh-hant' ? '預約付款後自動開立收據' : 'Auto-issue receipts when bookings are paid'}</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={automationDraft.bookings.receiptOnPaid.email}
                disabled={!automationDraft.bookings.receiptOnPaid.enabled}
                onChange={(event) => updateAutomationRule('bookings', 'receiptOnPaid', 'email', event.target.checked)}
                data-billing-auto-booking-receipt-email
              />
              <span>{locale === 'ko' ? '예약 영수증을 자동 이메일' : locale === 'zh-hant' ? '自動寄送預約收據' : 'Auto-email booking receipts'}</span>
            </label>
          </div>
        </div>
        <div className={styles.instructionHeader}>
          <strong>{locale === 'ko' ? '오프라인 결제 안내' : locale === 'zh-hant' ? '離線付款說明' : 'Offline payment instructions'}</strong>
          <span>{locale === 'ko' ? '청구서 결제 링크에 표시됩니다. 은행 정보는 짧고 운영 중심으로 유지하세요.' : locale === 'zh-hant' ? '顯示於發票付款連結。請保持銀行資訊簡短且具操作性。' : 'Shown on invoice payment links. Keep banking details short and operational.'}</span>
        </div>
        <div className={styles.instructionGroups} data-billing-manual-instructions>
          {(['orders', 'bookings'] as AutomationTarget[]).map((target) => (
            <div key={target} className={styles.instructionGroup} data-billing-manual-instructions-group={target}>
              <strong>{target === 'orders' ? (locale === 'ko' ? '주문 청구서' : locale === 'zh-hant' ? '訂單發票' : 'Order invoices') : (locale === 'ko' ? '예약 청구서' : locale === 'zh-hant' ? '預約發票' : 'Booking invoices')}</strong>
              {manualPaymentMethods.map((method) => {
                const instruction = automationDraft.manualPayments[target][method];
                const fieldKey = `${target}-${method}`;
                return (
                  <div key={method} className={styles.instructionRow} data-billing-manual-instruction-row={fieldKey}>
                    <label className={styles.instructionToggle}>
                      <input
                        type="checkbox"
                        checked={instruction.enabled}
                        onChange={(event) => updateManualInstruction(target, method, 'enabled', event.target.checked)}
                        data-billing-manual-instruction-enabled={fieldKey}
                      />
                      <span>{manualPaymentMethodLabel(locale, method)}</span>
                    </label>
                    <input
                      value={instruction.title}
                      maxLength={80}
                      aria-label={`${manualPaymentMethodLabel(locale, method)} ${locale === 'ko' ? '제목' : locale === 'zh-hant' ? '標題' : 'title'}`}
                      onChange={(event) => updateManualInstruction(target, method, 'title', event.target.value)}
                      data-billing-manual-instruction-title={fieldKey}
                    />
                    <textarea
                      value={instruction.instructions}
                      rows={3}
                      maxLength={900}
                      aria-label={`${manualPaymentMethodLabel(locale, method)} ${locale === 'ko' ? '안내' : locale === 'zh-hant' ? '說明' : 'instructions'}`}
                      placeholder={locale === 'ko' ? '계좌, 라우팅 정보, 지점 메모 또는 사무실 안내' : locale === 'zh-hant' ? '帳號、轉帳資訊、分行備註或辦公室說明' : 'Account, routing details, branch notes, or office instructions'}
                      onChange={(event) => updateManualInstruction(target, method, 'instructions', event.target.value)}
                      data-billing-manual-instruction-body={fieldKey}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <p className={styles.automationNotice} role="status" data-billing-auto-policy-notice>
          {automationNotice}
        </p>
      </section>

      <section className={styles.toolbar}>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={c.searchPlaceholder}
          data-billing-documents-search
        />
        <select value={source} onChange={(event) => setSource(event.target.value as SourceFilter)} data-billing-documents-source>
          <option value="all">{c.allSources}</option>
          <option value="order">{c.orders}</option>
          <option value="booking">{c.bookings}</option>
        </select>
        <select value={type} onChange={(event) => setType(event.target.value as TypeFilter)} data-billing-documents-type>
          <option value="all">{c.allTypes}</option>
          <option value="invoice">{c.invoices}</option>
          <option value="receipt">{c.receipts}</option>
        </select>
        <select value={status} onChange={(event) => setStatus(event.target.value as StatusFilter)} data-billing-documents-status>
          <option value="all">{c.allStatus}</option>
          <option value="issued">{c.issued}</option>
          <option value="emailed_stub">{c.emailed}</option>
          <option value="voided">{c.voided}</option>
          <option value="superseded">{c.superseded}</option>
        </select>
      </section>

      <p className={styles.notice} role="status">{notice}</p>

      {unmatchedWebhookEvents.length ? (
        <section className={styles.webhookExceptions} data-billing-document-webhook-exceptions>
          <div>
            <strong>{c.webhookExceptionsTitle}</strong>
            <span>{c.webhookExceptionsBody}</span>
            <span data-billing-document-webhook-exception-count>
              {c.webhookExceptionsCount(Math.min(3, unmatchedWebhookEvents.length), unmatchedWebhookEvents.length)}
            </span>
          </div>
          <ol>
            {unmatchedWebhookEvents.slice(0, 3).map((event) => (
              <li
                key={event.eventId}
                data-billing-document-webhook-exception={event.eventId}
                data-billing-document-webhook-exception-status={event.status}
                data-billing-document-webhook-exception-reason={event.error ?? event.paymentStatus}
              >
                <span>{webhookStatusLabel(locale, event)}</span>
                <small>
                  {event.source} {event.ownerId} / {event.documentId} · {webhookEventDetail(locale, event)}
                </small>
                <button
                  type="button"
                  disabled={webhookBusyId === event.eventId}
                  onClick={() => void replayWebhookEvent(event)}
                  data-billing-document-webhook-exception-replay={event.eventId}
                >
                  {webhookBusyId === event.eventId ? c.replaying : c.replay}
                </button>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <section className={styles.list} aria-label={locale === 'ko' ? '청구서 문서 목록' : locale === 'zh-hant' ? '帳單文件列表' : 'Billing documents list'}>
        {filtered.length === 0 ? (
          <article className={styles.empty} data-billing-documents-empty>
            <strong>{c.notFoundTitle}</strong>
            <span>{c.notFoundBody}</span>
          </article>
        ) : filtered.map((document) => {
          const isCurrent = document.status === 'issued' || document.status === 'emailed_stub';
          const rowKey = documentKey(document);
          const downloadHref = `${document.downloadPath}${document.downloadPath.includes('?') ? '&' : '?'}locale=${encodeURIComponent(locale)}`;
          const manualPaymentAllowed = canRecordManualPayment(document);
          const manualPaymentOpen = manualPaymentOpenKey === rowKey;
          const activityOpen = activityOpenKey === rowKey;
          const manualPaymentDraft = manualPaymentDrafts[rowKey] ?? defaultManualPaymentDraft(document);
          const manualPaymentBusy = manualPaymentBusyKey === rowKey;
          const payLinkState = paymentLinkDisplayState(document);
          const payLinkLabel = paymentLinkDisplayLabel(locale, document, payLinkState);
          const rowWebhookEvents = webhookEventsByDocument.get(documentWebhookKey(document)) ?? [];
          const hasActivity = document.paymentLinkEvents.length > 0 || rowWebhookEvents.length > 0 || document.paymentLinkRenewalNeeded;
          return (
          <article
            key={rowKey}
            className={styles.document}
            data-billing-document-row={rowKey}
            data-billing-document-source={document.source}
            data-billing-document-type={document.type}
            data-billing-document-status={document.status}
            data-billing-document-currency-code={document.currency}
          >
            <div className={styles.identity}>
              <span>{document.sourceLabel}</span>
              <strong>{document.typeLabel} {document.number}</strong>
              <small>{document.ownerLabel}</small>
              {document.status === 'emailed_stub' ? (
                <span role="status" data-billing-demo-disclosure="email" aria-label="STUB DATA">STUB DATA · {locale === 'ko' ? '개발용 이메일 발송 기록입니다.' : locale === 'zh-hant' ? '這是開發用寄信記錄。' : 'Development email record; no live email was sent.'}</span>
              ) : null}
            </div>
            <div className={styles.customer}>
              <strong>{document.customerLabel}</strong>
              <span>{document.recipientEmail}</span>
              <span>{document.contextLabel}</span>
            </div>
            <div className={styles.amounts}>
              <strong>{document.totalLabel}</strong>
              <span className={styles.currencyChip} data-billing-document-currency={rowKey}>
                {c.currency} {document.currency}
              </span>
              <span>{locale === 'ko' ? '미지급' : locale === 'zh-hant' ? '應付' : 'Due'} {document.balanceDueLabel}</span>
              <span>{c.refunded} {document.refundedLabel}</span>
            </div>
            <div className={styles.state}>
              <strong>{document.statusLabel}</strong>
              <span>{new Date(document.issuedAt).toLocaleString()}</span>
              {document.emailedAt ? <span>{c.emailed} {new Date(document.emailedAt).toLocaleString()}</span> : null}
              <span>{document.shareStatusLabel}{document.shareLinkExpiresAt ? ` · ${locale === 'ko' ? '만료' : locale === 'zh-hant' ? '到期' : 'expires'} ${new Date(document.shareLinkExpiresAt).toLocaleDateString()}` : ''}</span>
              <span data-billing-document-payment-status={rowKey}>{locale === 'ko' ? '결제' : locale === 'zh-hant' ? '付款' : 'Payment'} {document.paymentStatusLabel}</span>
              <span
                data-billing-document-payment-link-status={rowKey}
                data-billing-document-payment-link-state={payLinkState}
                data-billing-document-payment-link-reconcile={payLinkState === 'stale' ? rowKey : undefined}
              >
                {payLinkLabel}
              </span>
              <span data-billing-document-reconciliation-status={rowKey}>{document.paymentReconciliationStatusLabel}</span>
              {rowWebhookEvents.length ? (
                <span
                  data-billing-document-webhook-status={rowKey}
                  data-billing-document-webhook-state={rowWebhookEvents.some((event) => event.status === 'failed') ? 'failed' : rowWebhookEvents.some((event) => event.status === 'ignored') ? 'ignored' : 'processed'}
                >
                  {webhookSummaryLabel(locale, rowWebhookEvents)}
                </span>
              ) : null}
              {document.voidedAt ? <span>{c.voided} {new Date(document.voidedAt).toLocaleString()}</span> : null}
              {document.voidReason ? <span>{document.voidReason}</span> : null}
              {document.supersedesDocumentId ? <span>{locale === 'ko' ? '대체함' : locale === 'zh-hant' ? '取代文件' : 'Supersedes'} {document.supersedesDocumentId}</span> : null}
              {document.supersededByDocumentId ? <span>{locale === 'ko' ? '대체됨' : locale === 'zh-hant' ? '被取代' : 'Superseded by'} {document.supersededByDocumentId}</span> : null}
              <span>{document.viewCount} {locale === 'ko' ? '조회' : locale === 'zh-hant' ? '檢視' : 'views'} · {document.downloadCount} {locale === 'ko' ? '다운로드' : locale === 'zh-hant' ? '下載' : 'downloads'}</span>
            </div>
            <div className={styles.actions}>
              <a href={downloadHref} data-billing-document-download={rowKey}>
                {c.downloadPdf}
              </a>
              {isCurrent && document.paymentLinkPath ? (
                <>
                  <a href={document.paymentLinkPath} target="_blank" rel="noreferrer" data-billing-document-payment={rowKey}>
                    {c.openPay}
                  </a>
                  <button type="button" onClick={() => void copyPaymentLink(document.paymentLinkPath)} data-billing-document-copy-payment={rowKey}>
                    {c.copyPay}
                  </button>
                  <button type="button" onClick={() => void createPaymentLink(document)} data-billing-document-renew-payment={rowKey}>
                    {c.renewPay}
                  </button>
                  <button type="button" onClick={() => void revokePaymentLink(document)} data-billing-document-revoke-payment={rowKey}>
                    {c.revokePay}
                  </button>
                </>
              ) : isCurrent && (document.paymentLinkStatus === 'not_created' || document.paymentLinkStatus === 'expired' || document.paymentLinkStatus === 'revoked') ? (
                <button type="button" onClick={() => void createPaymentLink(document)} data-billing-document-create-payment={rowKey}>
                  {document.paymentLinkStatus === 'not_created' ? c.createPay : c.renewPay}
                </button>
              ) : null}
              {manualPaymentAllowed ? (
                <button
                  type="button"
                  onClick={() => {
                    setManualPaymentOpenKey((current) => (current === rowKey ? '' : rowKey));
                    setManualPaymentDrafts((current) => ({
                      ...current,
                      [rowKey]: current[rowKey] ?? defaultManualPaymentDraft(document),
                    }));
                  }}
                  data-billing-document-manual-payment-toggle={rowKey}
                >
                  {manualPaymentOpen ? c.hidePayment : c.recordPayment}
                </button>
              ) : null}
              {isCurrent && document.shareStatus === 'active' ? (
                <>
                  <a href={document.sharePath} target="_blank" rel="noreferrer" data-billing-document-share={rowKey}>
                    {c.viewLink}
                  </a>
                  <button type="button" onClick={() => void copyShareLink(document.sharePath)} data-billing-document-copy={rowKey}>
                    {c.copyLink}
                  </button>
                  <button type="button" onClick={() => void revokeShareLink(document)} data-billing-document-revoke={rowKey}>
                    {c.revokeLink}
                  </button>
                </>
              ) : isCurrent ? (
                <button type="button" onClick={() => void createShareLink(document)} data-billing-document-create-share={rowKey}>
                  {c.createLink}
                </button>
              ) : null}
              {isCurrent ? (
                <>
                  <button type="button" onClick={() => void updateLifecycle(document, 'void')} data-billing-document-void={rowKey}>
                    {c.void}
                  </button>
                  <button type="button" onClick={() => void updateLifecycle(document, 'supersede')} data-billing-document-supersede={rowKey}>
                    {c.supersede}
                  </button>
                </>
              ) : null}
              {hasActivity ? (
                <button
                  type="button"
                  onClick={() => setActivityOpenKey((current) => (current === rowKey ? '' : rowKey))}
                  data-billing-document-activity-toggle={rowKey}
                >
                  {activityOpen ? c.hideActivity : c.activity}
                </button>
              ) : null}
              <Link href={document.detailHref}>{c.openSource}</Link>
            </div>
            {activityOpen && hasActivity ? (
              <div
                className={styles.paymentLinkHistory}
                data-billing-document-activity-panel={rowKey}
                data-billing-document-payment-link-history={rowKey}
              >
                <div>
                  <strong>{c.documentActivity}</strong>
                  <span>{c.documentActivityBody}</span>
                </div>
                {rowWebhookEvents.length ? (
                  <section
                    className={styles.webhookHistory}
                    data-billing-document-webhook-history={rowKey}
                    data-billing-document-webhook-ledger={rowKey}
                  >
                    <strong>{c.hostedWebhooks}</strong>
                    <ol>
                      {rowWebhookEvents.slice(0, 5).map((event) => (
                        <li
                          key={event.eventId}
                          data-billing-document-webhook-event={event.eventId}
                          data-billing-document-webhook-event-status={event.status}
                        >
                          <span>{webhookStatusLabel(locale, event)}</span>
                          <small>{webhookEventDetail(locale, event)}</small>
                          {event.status !== 'processed' ? (
                            <button
                              type="button"
                              disabled={webhookBusyId === event.eventId}
                              onClick={() => void replayWebhookEvent(event)}
                              data-billing-document-webhook-replay={event.eventId}
                            >
                              {webhookBusyId === event.eventId ? c.replaying : c.replay}
                            </button>
                          ) : null}
                        </li>
                      ))}
                    </ol>
                  </section>
                ) : null}
                <ol>
                  {document.paymentLinkRenewalNeeded ? (
                    <li data-billing-document-activity-item="renewal_needed">
                      <span>{c.renewalNeeded}</span>
                      <small>{payLinkLabel}</small>
                    </li>
                  ) : null}
                  {document.paymentLinkEvents.slice(-5).reverse().map((event) => (
                    <li
                      key={event.eventId}
                      data-billing-document-activity-item={event.type}
                      data-billing-document-activity-reason={event.reason}
                      data-billing-document-activity-reference={event.paymentId ?? event.paymentLinkId ?? event.eventId}
                    >
                      <span>{paymentLinkEventLabel(locale, event)}</span>
                      <small>{paymentLinkEventDetail(locale, event)}</small>
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}
            {manualPaymentOpen ? (
              <div className={styles.manualPaymentPanel} data-billing-document-manual-payment-form={rowKey}>
                <div className={styles.manualPaymentHeader}>
                  <div>
                    <strong>{c.recordOfflinePayment}</strong>
                    <span data-billing-document-manual-payment-helper={rowKey}>{c.onlySucceeded}</span>
                    <span data-billing-document-manual-payment-currency={rowKey}>{c.recordCurrency} {document.currency}</span>
                  </div>
                  <em>{locale === 'ko' ? '미지급 잔액' : locale === 'zh-hant' ? '應付餘額' : 'Balance due'} {document.balanceDueLabel}</em>
                </div>
                <label>
                  <span>{c.status}</span>
                  <select
                    value={manualPaymentDraft.status}
                    disabled={manualPaymentBusy}
                    onChange={(event) => setManualPaymentDrafts((current) => ({
                      ...current,
                      [rowKey]: { ...manualPaymentDraft, status: event.target.value as ManualPaymentStatus },
                    }))}
                    data-billing-document-manual-payment-status={rowKey}
                  >
                    {(['succeeded', 'pending', 'failed', 'canceled'] as ManualPaymentStatus[]).map((statusOption) => (
                      <option key={statusOption} value={statusOption}>{manualPaymentStatusLabel(locale, statusOption)}</option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>{c.amount}</span>
                  <input
                    value={manualPaymentDraft.amount}
                    inputMode="decimal"
                    disabled={manualPaymentBusy}
                    onChange={(event) => setManualPaymentDrafts((current) => ({
                      ...current,
                      [rowKey]: { ...manualPaymentDraft, amount: event.target.value },
                    }))}
                    data-billing-document-manual-payment-amount={rowKey}
                  />
                </label>
                <label>
                  <span>{c.method}</span>
                  <select
                    value={manualPaymentDraft.method}
                    disabled={manualPaymentBusy}
                    onChange={(event) => setManualPaymentDrafts((current) => ({
                      ...current,
                      [rowKey]: { ...manualPaymentDraft, method: event.target.value as ManualPaymentMethod },
                    }))}
                    data-billing-document-manual-payment-method={rowKey}
                  >
                    {(['bank_transfer', 'cash', 'check', 'other'] as ManualPaymentMethod[]).map((method) => (
                      <option key={method} value={method}>{manualPaymentMethodLabel(locale, method)}</option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>{c.reference}</span>
                  <input
                    value={manualPaymentDraft.reference}
                    disabled={manualPaymentBusy}
                    onChange={(event) => setManualPaymentDrafts((current) => ({
                      ...current,
                      [rowKey]: { ...manualPaymentDraft, reference: event.target.value },
                    }))}
                    data-billing-document-manual-payment-reference={rowKey}
                  />
                </label>
                <label>
                  <span>{c.note}</span>
                  <textarea
                    value={manualPaymentDraft.note}
                    rows={2}
                    maxLength={500}
                    disabled={manualPaymentBusy}
                    onChange={(event) => setManualPaymentDrafts((current) => ({
                      ...current,
                      [rowKey]: { ...manualPaymentDraft, note: event.target.value },
                    }))}
                    data-billing-document-manual-payment-note={rowKey}
                  />
                </label>
                <button
                  type="button"
                  disabled={manualPaymentBusy || !manualPaymentAllowed}
                  onClick={() => void recordManualPayment(document)}
                  data-billing-document-manual-payment-submit={rowKey}
                >
                  {manualPaymentBusy ? c.saving : c.savePaymentRecord}
                </button>
              </div>
            ) : null}
          </article>
          );
        })}
      </section>

      {exportText ? (
        <section className={styles.exportPanel} data-billing-documents-export-panel>
          <h2>{c.exportCsv}</h2>
          <textarea readOnly rows={8} value={exportText} />
        </section>
      ) : null}
    </section>
  );
}
