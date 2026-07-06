'use client';

import { useCallback, useEffect, useState } from 'react';
import { formatDateTimeInTimezone } from '@/lib/builder/bookings/timezone';
import { normalizeLocale, type Locale } from '@/lib/locales';
import styles from './BookingsAdmin.module.css';

type ManagePayload = {
  booking: {
    bookingId: string;
    startAt: string;
    endAt: string;
    status: string;
    customer: { name: string; email: string; phone?: string; notes?: string };
    cancellationReason?: string;
    customerTimezone?: string;
  };
  service: { name: string; durationMinutes: number; meetingMode?: string } | null;
  staff: { name: string; staffId: string } | null;
  policy: {
    name: string;
    description?: string;
    hoursUntilStart: number;
    canCancel: boolean;
    canReschedule: boolean;
    cancelHoursBefore: number;
    rescheduleHoursBefore: number;
    fullRefundHoursBefore: number;
    partialRefundHoursBefore: number;
    partialRefundPercent: number;
    cancellationFeePercent: number;
    refundDecision: 'full' | 'partial' | 'none';
    refundAmountCents?: number;
    cancelBlockedReason?: string;
    rescheduleBlockedReason?: string;
  };
};

type ManageCopy = {
  eyebrow: string;
  title: string;
  loading: string;
  invalidLink: string;
  time: string;
  timezone: string;
  staff: string;
  name: string;
  email: string;
  reason: string;
  policy: string;
  hoursLeft: string;
  fee: string;
  cancelAllowed: string;
  cancelBlocked: string;
  rescheduleAllowed: string;
  rescheduleBlocked: string;
  reschedule: string;
  newStartTime: string;
  saveNewTime: string;
  saving: string;
  cancelBooking: string;
  refundNone: string;
  refundFull: string;
  refundPartial: string;
  cancellationFee: string;
  selectedConsultation: string;
  inPerson: string;
  zoom: string;
  rescheduled: string;
  cancelled: string;
  updateFailed: string;
  noAutomaticRefund: string;
  policyDetail: string;
  fullRefundAvailable: string;
  partialRefundAvailable: string;
  feeOnRefundable: string;
};

const COPY: Record<Locale, ManageCopy> = {
  ko: {
    eyebrow: '예약',
    title: '예약 관리',
    loading: '예약을 불러오는 중...',
    invalidLink: '이 예약 링크는 유효하지 않거나 만료되었습니다.',
    time: '시간',
    timezone: '시간대',
    staff: '담당',
    name: '이름',
    email: '이메일',
    reason: '사유',
    policy: '정책',
    hoursLeft: '남은 시간',
    fee: '수수료',
    cancelAllowed: '취소 가능',
    cancelBlocked: '취소 불가',
    rescheduleAllowed: '일정 변경 가능',
    rescheduleBlocked: '일정 변경 불가',
    reschedule: '일정 변경',
    newStartTime: '새 시작 시간',
    saveNewTime: '새 시간 저장',
    saving: '저장 중...',
    cancelBooking: '예약 취소',
    refundNone: '환불 없음',
    refundFull: '전액 환불',
    refundPartial: '부분 환불',
    cancellationFee: '취소 수수료',
    selectedConsultation: '상담',
    inPerson: '현장',
    zoom: '줌',
    rescheduled: '예약 시간이 변경되었습니다.',
    cancelled: '예약이 취소되었습니다.',
    updateFailed: '예약을 수정하지 못했습니다.',
    noAutomaticRefund: '자동 환불이 제공되지 않습니다.',
    policyDetail: '예약 관리 페이지에서 취소 또는 일정을 변경할 수 있습니다.',
    fullRefundAvailable: '지금 취소하면 전액 환불 가능합니다.',
    partialRefundAvailable: '지금 취소하면 부분 환불 가능합니다.',
    feeOnRefundable: '환불 가능 금액 기준 취소 수수료',
  },
  'zh-hant': {
    eyebrow: '預約',
    title: '管理預約',
    loading: '正在載入預約...',
    invalidLink: '此預約連結無效或已過期。',
    time: '時間',
    timezone: '時區',
    staff: '負責人',
    name: '姓名',
    email: '電子郵件',
    reason: '原因',
    policy: '政策',
    hoursLeft: '剩餘時間',
    fee: '手續費',
    cancelAllowed: '可取消',
    cancelBlocked: '不可取消',
    rescheduleAllowed: '可改期',
    rescheduleBlocked: '不可改期',
    reschedule: '重新排程',
    newStartTime: '新的開始時間',
    saveNewTime: '儲存新時間',
    saving: '儲存中...',
    cancelBooking: '取消預約',
    refundNone: '無退款',
    refundFull: '全額退款',
    refundPartial: '部分退款',
    cancellationFee: '取消手續費',
    selectedConsultation: '諮詢',
    inPerson: '現場',
    zoom: 'Zoom',
    rescheduled: '預約時間已更改。',
    cancelled: '預約已取消。',
    updateFailed: '無法更新預約。',
    noAutomaticRefund: '不提供自動退款。',
    policyDetail: '可在預約管理頁面取消或更改預約時間。',
    fullRefundAvailable: '現在取消可獲得全額退款。',
    partialRefundAvailable: '現在取消可獲得部分退款。',
    feeOnRefundable: '以可退款金額計算的取消手續費',
  },
  en: {
    eyebrow: 'Bookings',
    title: 'Manage your consultation',
    loading: 'Loading booking...',
    invalidLink: 'This booking link is invalid or expired.',
    time: 'Time',
    timezone: 'Timezone',
    staff: 'Staff',
    name: 'Name',
    email: 'Email',
    reason: 'Reason',
    policy: 'Policy',
    hoursLeft: 'Hours left',
    fee: 'Fee',
    cancelAllowed: 'Cancel allowed',
    cancelBlocked: 'Cancel blocked',
    rescheduleAllowed: 'Reschedule allowed',
    rescheduleBlocked: 'Reschedule blocked',
    reschedule: 'Reschedule',
    newStartTime: 'New start time',
    saveNewTime: 'Save new time',
    saving: 'Saving...',
    cancelBooking: 'Cancel booking',
    refundNone: 'No refund',
    refundFull: 'Full refund',
    refundPartial: 'Partial refund',
    cancellationFee: 'Cancellation fee',
    selectedConsultation: 'Consultation',
    inPerson: 'In person',
    zoom: 'Zoom',
    rescheduled: 'Booking rescheduled.',
    cancelled: 'Booking cancelled.',
    updateFailed: 'Booking update failed.',
    noAutomaticRefund: 'No automatic refund is available.',
    policyDetail: 'You can cancel or reschedule from the manage page.',
    fullRefundAvailable: 'Full refund available if you cancel now.',
    partialRefundAvailable: 'Partial refund available if you cancel now.',
    feeOnRefundable: 'Cancellation fee on the refundable amount',
  },
};

function bookingStatusLabel(locale: Locale, status: string): string {
  if (locale === 'ko') {
    if (status === 'cancelled') return '취소됨';
    if (status === 'confirmed') return '확정됨';
    if (status === 'completed') return '완료됨';
    if (status === 'no-show') return '노쇼';
    if (status === 'pending') return '대기';
    return status;
  }
  if (locale === 'zh-hant') {
    if (status === 'cancelled') return '已取消';
    if (status === 'confirmed') return '已確認';
    if (status === 'completed') return '已完成';
    if (status === 'no-show') return '未到';
    if (status === 'pending') return '待處理';
    return status;
  }
  if (status === 'cancelled') return 'Cancelled';
  if (status === 'confirmed') return 'Confirmed';
  if (status === 'completed') return 'Completed';
  if (status === 'no-show') return 'No-show';
  if (status === 'pending') return 'Pending';
  return status;
}

function meetingModeLabel(locale: Locale, meetingMode?: string | null): string {
  if (meetingMode === 'zoom') return COPY[locale].zoom;
  if (meetingMode === 'in-person') return COPY[locale].inPerson;
  return meetingMode || COPY[locale].inPerson;
}

function refundLabel(policy: ManagePayload['policy'], labels: ManageCopy): string {
  const feeText = policy.cancellationFeePercent > 0 ? ` ${labels.feeOnRefundable}: ${policy.cancellationFeePercent}%` : '';
  if (policy.refundDecision === 'full') return `${labels.fullRefundAvailable}${feeText}`;
  if (policy.refundDecision === 'partial') return `${labels.partialRefundAvailable}${feeText}`;
  if (policy.cancellationFeePercent > 0) return `${labels.noAutomaticRefund} ${labels.cancellationFee}: ${policy.cancellationFeePercent}%`;
  return labels.noAutomaticRefund;
}

function toLocalInputValue(iso: string): string {
  const date = new Date(iso);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function localInputToIso(value: string): string {
  return new Date(value).toISOString();
}

export default function BookingManageClient({ token, locale: rawLocale = 'en' }: { token: string; locale?: Locale | string }) {
  const locale = normalizeLocale(rawLocale);
  const labels = COPY[locale];
  const [payload, setPayload] = useState<ManagePayload | null>(null);
  const [startAt, setStartAt] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    setError('');
    const response = await fetch(`/api/booking/manage/${encodeURIComponent(token)}`, { credentials: 'same-origin' });
    if (!response.ok) {
      setError(labels.invalidLink);
      return;
    }
    const data = (await response.json()) as ManagePayload;
    setPayload(data);
    setStartAt(toLocalInputValue(data.booking.startAt));
  }, [labels.invalidLink, token]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const updateBooking = async (body: Record<string, unknown>, successMessage: string) => {
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const response = await fetch(`/api/booking/manage/${encodeURIComponent(token)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(body),
      });
      const data = (await response.json().catch(() => null)) as (ManagePayload & { booking?: ManagePayload['booking']; error?: string }) | null;
      if (!response.ok || !data?.booking) throw new Error(data?.error || labels.updateFailed);
      setPayload((current) => current ? { ...current, booking: data.booking! } : null);
      setStartAt(toLocalInputValue(data.booking.startAt));
      setMessage(successMessage);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : labels.updateFailed);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className={styles.shell} data-booking-manage="true">
      <div className={styles.content}>
        <div className={styles.panel}>
          <p className={styles.eyebrow}>{labels.eyebrow}</p>
          <h1 className={styles.title}>{labels.title}</h1>
          {error ? <p className={styles.error}>{error}</p> : null}
          {message ? <p className={styles.notice}>{message}</p> : null}
          {!payload && !error ? <p className={styles.muted}>{labels.loading}</p> : null}
          {payload ? (
            <div className={styles.detailGrid}>
              <div className={styles.panelCompact}>
                <h2 className={styles.cardTitle}>{payload.service?.name || labels.selectedConsultation}</h2>
                <div className={styles.metaRow}>
                  <span className={styles.statusPill} data-booking-status={payload.booking.status}>{bookingStatusLabel(locale, payload.booking.status)}</span>
                  <span className={styles.chip}>{meetingModeLabel(locale, payload.service?.meetingMode)}</span>
                </div>
                <p data-booking-manage-timezone-summary="true">
                  <strong>{labels.time}:</strong>{' '}
                  <span data-booking-manage-customer-time="true">{formatDateTimeInTimezone(payload.booking.startAt, locale, payload.booking.customerTimezone)}</span>
                </p>
                {payload.booking.customerTimezone ? <p><strong>{labels.timezone}:</strong> {payload.booking.customerTimezone}</p> : null}
                <p><strong>{labels.staff}:</strong> {payload.staff?.name || '-'}</p>
                <p><strong>{labels.name}:</strong> {payload.booking.customer.name}</p>
                <p><strong>{labels.email}:</strong> {payload.booking.customer.email}</p>
                {payload.booking.cancellationReason ? <p><strong>{labels.reason}:</strong> {payload.booking.cancellationReason}</p> : null}
              </div>
              <div className={`${styles.panelCompact} ${styles.fieldFull}`} data-booking-manage-policy="true">
                <h2 className={styles.cardTitle}>{labels.policy}</h2>
                <div className={styles.metaRow}>
                  <span className={styles.chip}>{payload.policy.name}</span>
                  <span className={styles.chip}>{payload.policy.hoursUntilStart}h {labels.hoursLeft}</span>
                  {payload.policy.cancellationFeePercent > 0 ? (
                    <span className={styles.chip} data-booking-policy-fee={payload.policy.cancellationFeePercent}>
                      {labels.fee} {payload.policy.cancellationFeePercent}%
                    </span>
                  ) : null}
                  <span className={styles.chip} data-booking-policy-cancel={payload.policy.canCancel ? 'allowed' : 'blocked'}>
                    {payload.policy.canCancel ? labels.cancelAllowed : labels.cancelBlocked}
                  </span>
                  <span className={styles.chip} data-booking-policy-reschedule={payload.policy.canReschedule ? 'allowed' : 'blocked'}>
                    {payload.policy.canReschedule ? labels.rescheduleAllowed : labels.rescheduleBlocked}
                  </span>
                </div>
                {payload.policy.description ? <p className={styles.muted}>{payload.policy.description}</p> : null}
                <p className={styles.notice} data-booking-policy-refund={payload.policy.refundDecision}>{refundLabel(payload.policy, labels)}</p>
                <p className={styles.muted}>{labels.policyDetail}</p>
                {payload.policy.rescheduleBlockedReason ? <p className={styles.muted}>{payload.policy.rescheduleBlockedReason}</p> : null}
                {payload.policy.cancelBlockedReason ? <p className={styles.muted}>{payload.policy.cancelBlockedReason}</p> : null}
              </div>
              <div className={styles.panelCompact}>
                <h2 className={styles.cardTitle}>{labels.reschedule}</h2>
                <label className={styles.field}>
                  <span className={styles.label}>{labels.newStartTime}</span>
                  <input className={styles.input} disabled={payload.booking.status === 'cancelled' || !payload.policy.canReschedule} type="datetime-local" value={startAt} onChange={(event) => setStartAt(event.target.value)} />
                </label>
                <button
                  className={styles.button}
                  disabled={saving || payload.booking.status === 'cancelled' || !payload.policy.canReschedule || !startAt}
                  data-booking-manage-reschedule={payload.policy.canReschedule ? 'enabled' : 'disabled'}
                  onClick={() => updateBooking({ action: 'reschedule', startAt: localInputToIso(startAt) }, labels.rescheduled)}
                  type="button"
                >
                  {saving ? labels.saving : labels.saveNewTime}
                </button>
              </div>
              <div className={`${styles.panelCompact} ${styles.fieldFull}`}>
                <h2 className={styles.cardTitle}>{labels.cancelBooking}</h2>
                <label className={styles.field}>
                  <span className={styles.label}>{labels.reason}</span>
                  <textarea className={styles.textarea} disabled={payload.booking.status === 'cancelled' || !payload.policy.canCancel} value={reason} onChange={(event) => setReason(event.target.value)} />
                </label>
                <button
                  className={styles.buttonSecondary}
                  disabled={saving || payload.booking.status === 'cancelled' || !payload.policy.canCancel}
                  data-booking-manage-cancel={payload.policy.canCancel ? 'enabled' : 'disabled'}
                  onClick={() => updateBooking({ action: 'cancel', reason }, labels.cancelled)}
                  type="button"
                >
                  {labels.cancelBooking}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
