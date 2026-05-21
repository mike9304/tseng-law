'use client';

import { useCallback, useEffect, useState } from 'react';
import { formatDateTimeInTimezone } from '@/lib/builder/bookings/timezone';
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
    refundDecision: 'full' | 'partial' | 'none';
    cancelBlockedReason?: string;
    rescheduleBlockedReason?: string;
  };
};

function toLocalInputValue(iso: string): string {
  const date = new Date(iso);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function localInputToIso(value: string): string {
  return new Date(value).toISOString();
}

function displayDate(iso: string, timezone?: string): string {
  return formatDateTimeInTimezone(iso, [], timezone || Intl.DateTimeFormat().resolvedOptions().timeZone);
}

function refundLabel(policy: ManagePayload['policy']): string {
  if (policy.refundDecision === 'full') return 'Full refund available if you cancel now.';
  if (policy.refundDecision === 'partial') return `${policy.partialRefundPercent}% refund available if you cancel now.`;
  return 'No automatic refund is available if you cancel now.';
}

export default function BookingManageClient({ token }: { token: string }) {
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
      setError('This booking link is invalid or expired.');
      return;
    }
    const data = (await response.json()) as ManagePayload;
    setPayload(data);
    setStartAt(toLocalInputValue(data.booking.startAt));
  }, [token]);

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
      if (!response.ok || !data?.booking) throw new Error(data?.error || 'Booking update failed');
      setPayload((current) => current ? { ...current, booking: data.booking! } : null);
      setStartAt(toLocalInputValue(data.booking.startAt));
      setMessage(successMessage);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className={styles.shell} data-booking-manage="true">
      <div className={styles.content}>
        <div className={styles.panel}>
          <p className={styles.eyebrow}>Hojeong Bookings</p>
          <h1 className={styles.title}>Manage your consultation</h1>
          {error ? <p className={styles.error}>{error}</p> : null}
          {message ? <p className={styles.notice}>{message}</p> : null}
          {!payload && !error ? <p className={styles.muted}>Loading booking...</p> : null}
          {payload ? (
            <div className={styles.detailGrid}>
              <div className={styles.panelCompact}>
                <h2 className={styles.cardTitle}>{payload.service?.name || 'Consultation'}</h2>
                <div className={styles.metaRow}>
                  <span className={styles.statusPill} data-booking-status={payload.booking.status}>{payload.booking.status}</span>
                  <span className={styles.chip}>{payload.service?.meetingMode || 'in-person'}</span>
                </div>
                <p data-booking-manage-timezone-summary="true"><strong>Time:</strong> <span data-booking-manage-customer-time="true">{displayDate(payload.booking.startAt, payload.booking.customerTimezone)}</span></p>
                {payload.booking.customerTimezone ? <p><strong>Timezone:</strong> {payload.booking.customerTimezone}</p> : null}
                <p><strong>Staff:</strong> {payload.staff?.name || '-'}</p>
                <p><strong>Name:</strong> {payload.booking.customer.name}</p>
                <p><strong>Email:</strong> {payload.booking.customer.email}</p>
                {payload.booking.cancellationReason ? <p><strong>Reason:</strong> {payload.booking.cancellationReason}</p> : null}
              </div>
              <div className={`${styles.panelCompact} ${styles.fieldFull}`} data-booking-manage-policy="true">
                <h2 className={styles.cardTitle}>Policy</h2>
                <div className={styles.metaRow}>
                  <span className={styles.chip}>{payload.policy.name}</span>
                  <span className={styles.chip}>{payload.policy.hoursUntilStart}h until start</span>
                  <span className={styles.chip} data-booking-policy-cancel={payload.policy.canCancel ? 'allowed' : 'blocked'}>
                    {payload.policy.canCancel ? 'Cancel allowed' : 'Cancel blocked'}
                  </span>
                  <span className={styles.chip} data-booking-policy-reschedule={payload.policy.canReschedule ? 'allowed' : 'blocked'}>
                    {payload.policy.canReschedule ? 'Reschedule allowed' : 'Reschedule blocked'}
                  </span>
                </div>
                {payload.policy.description ? <p className={styles.muted}>{payload.policy.description}</p> : null}
                <p className={styles.notice} data-booking-policy-refund={payload.policy.refundDecision}>{refundLabel(payload.policy)}</p>
                {payload.policy.rescheduleBlockedReason ? <p className={styles.muted}>{payload.policy.rescheduleBlockedReason}</p> : null}
                {payload.policy.cancelBlockedReason ? <p className={styles.muted}>{payload.policy.cancelBlockedReason}</p> : null}
              </div>
              <div className={styles.panelCompact}>
                <h2 className={styles.cardTitle}>Reschedule</h2>
                <label className={styles.field}>
                  <span className={styles.label}>New start time</span>
                  <input className={styles.input} disabled={payload.booking.status === 'cancelled' || !payload.policy.canReschedule} type="datetime-local" value={startAt} onChange={(event) => setStartAt(event.target.value)} />
                </label>
                <button
                  className={styles.button}
                  disabled={saving || payload.booking.status === 'cancelled' || !payload.policy.canReschedule || !startAt}
                  data-booking-manage-reschedule={payload.policy.canReschedule ? 'enabled' : 'disabled'}
                  onClick={() => updateBooking({ action: 'reschedule', startAt: localInputToIso(startAt) }, 'Booking rescheduled.')}
                  type="button"
                >
                  {saving ? 'Saving...' : 'Save new time'}
                </button>
              </div>
              <div className={`${styles.panelCompact} ${styles.fieldFull}`}>
                <h2 className={styles.cardTitle}>Cancel booking</h2>
                <label className={styles.field}>
                  <span className={styles.label}>Reason</span>
                  <textarea className={styles.textarea} disabled={payload.booking.status === 'cancelled' || !payload.policy.canCancel} value={reason} onChange={(event) => setReason(event.target.value)} />
                </label>
                <button
                  className={styles.buttonSecondary}
                  disabled={saving || payload.booking.status === 'cancelled' || !payload.policy.canCancel}
                  data-booking-manage-cancel={payload.policy.canCancel ? 'enabled' : 'disabled'}
                  onClick={() => updateBooking({ action: 'cancel', reason }, 'Booking cancelled.')}
                  type="button"
                >
                  Cancel booking
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
