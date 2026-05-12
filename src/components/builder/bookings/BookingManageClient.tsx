'use client';

import { useCallback, useEffect, useState } from 'react';
import styles from './BookingsAdmin.module.css';

type ManagePayload = {
  booking: {
    bookingId: string;
    startAt: string;
    endAt: string;
    status: string;
    customer: { name: string; email: string; phone?: string; notes?: string };
    cancellationReason?: string;
  };
  service: { name: string; durationMinutes: number; meetingMode?: string } | null;
  staff: { name: string; staffId: string } | null;
};

function toLocalInputValue(iso: string): string {
  const date = new Date(iso);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function localInputToIso(value: string): string {
  return new Date(value).toISOString();
}

function displayDate(iso: string): string {
  return new Date(iso).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
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
                <p><strong>Time:</strong> {displayDate(payload.booking.startAt)}</p>
                <p><strong>Staff:</strong> {payload.staff?.name || '-'}</p>
                <p><strong>Name:</strong> {payload.booking.customer.name}</p>
                <p><strong>Email:</strong> {payload.booking.customer.email}</p>
                {payload.booking.cancellationReason ? <p><strong>Reason:</strong> {payload.booking.cancellationReason}</p> : null}
              </div>
              <div className={styles.panelCompact}>
                <h2 className={styles.cardTitle}>Reschedule</h2>
                <label className={styles.field}>
                  <span className={styles.label}>New start time</span>
                  <input className={styles.input} disabled={payload.booking.status === 'cancelled'} type="datetime-local" value={startAt} onChange={(event) => setStartAt(event.target.value)} />
                </label>
                <button
                  className={styles.button}
                  disabled={saving || payload.booking.status === 'cancelled' || !startAt}
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
                  <textarea className={styles.textarea} disabled={payload.booking.status === 'cancelled'} value={reason} onChange={(event) => setReason(event.target.value)} />
                </label>
                <button
                  className={styles.buttonSecondary}
                  disabled={saving || payload.booking.status === 'cancelled'}
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
