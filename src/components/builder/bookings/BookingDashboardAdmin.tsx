'use client';

import { useMemo, useState } from 'react';
import type { Booking, BookingService, BookingStatus, Staff } from '@/lib/builder/bookings/types';
import { textForLocale } from '@/lib/builder/bookings/types';
import type { Locale } from '@/lib/locales';
import styles from './BookingsAdmin.module.css';

const statusOptions: Array<{ value: '' | BookingStatus; label: string }> = [
  { value: '', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'no-show', label: 'No-show' },
  { value: 'cancelled', label: 'Cancelled' },
];

const statusActions: Array<{ value: BookingStatus; label: string }> = [
  { value: 'confirmed', label: 'Confirm' },
  { value: 'completed', label: 'Complete' },
  { value: 'no-show', label: 'Mark no-show' },
  { value: 'cancelled', label: 'Cancel' },
];

function toLocalInputValue(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function localInputToIso(value: string): string {
  return new Date(value).toISOString();
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
}

export default function BookingDashboardAdmin({
  locale,
  initialBookings,
  services,
  staff,
}: {
  locale: Locale;
  initialBookings: Booking[];
  services: BookingService[];
  staff: Staff[];
}) {
  const [bookings, setBookings] = useState(initialBookings);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'' | BookingStatus>('');
  const [staffFilter, setStaffFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selected, setSelected] = useState<Booking | null>(null);
  const [draftStaffId, setDraftStaffId] = useState('');
  const [draftStartAt, setDraftStartAt] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const serviceById = useMemo(() => new Map(services.map((service) => [service.serviceId, service])), [services]);
  const staffById = useMemo(() => new Map(staff.map((member) => [member.staffId, member])), [staff]);

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
      ].join(' ').toLowerCase();
      return (!needle || haystack.includes(needle))
        && (!statusFilter || booking.status === statusFilter)
        && (!staffFilter || booking.staffId === staffFilter)
        && (!serviceFilter || booking.serviceId === serviceFilter)
        && startMs >= fromMs
        && startMs <= toMs;
    });
  }, [bookings, fromDate, locale, query, serviceById, serviceFilter, staffById, staffFilter, statusFilter, toDate]);

  const stats = useMemo(() => ({
    total: bookings.length,
    upcoming: bookings.filter((booking) => booking.status !== 'cancelled' && Date.parse(booking.startAt) >= Date.now()).length,
    pending: bookings.filter((booking) => booking.status === 'pending').length,
    noShow: bookings.filter((booking) => booking.status === 'no-show').length,
  }), [bookings]);

  const openBooking = (booking: Booking) => {
    setSelected(booking);
    setDraftStaffId(booking.staffId);
    setDraftStartAt(toLocalInputValue(booking.startAt));
    setError(null);
  };

  const patchBooking = async (booking: Booking, payload: Record<string, unknown>) => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/builder/bookings/${booking.bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error || 'Booking update failed');
      }
      const data = (await res.json()) as { booking: Booking };
      setBookings((current) => current.map((item) => item.bookingId === data.booking.bookingId ? data.booking : item));
      setSelected(data.booking);
      setDraftStaffId(data.booking.staffId);
      setDraftStartAt(toLocalInputValue(data.booking.startAt));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking update failed');
    } finally {
      setSaving(false);
    }
  };

  const selectedService = selected ? serviceById.get(selected.serviceId) : undefined;
  const selectedStaff = selected ? staffById.get(selected.staffId) : undefined;

  return (
    <>
      <section className={styles.dashboardGrid} data-booking-dashboard="true">
        <div className={styles.statCard}>
          <span>Total</span>
          <strong>{stats.total}</strong>
        </div>
        <div className={styles.statCard}>
          <span>Upcoming</span>
          <strong>{stats.upcoming}</strong>
        </div>
        <div className={styles.statCard}>
          <span>Pending</span>
          <strong>{stats.pending}</strong>
        </div>
        <div className={styles.statCard}>
          <span>No-show</span>
          <strong>{stats.noShow}</strong>
        </div>
      </section>

      <section className={styles.panel}>
        <div className={styles.filterBar}>
          <label className={styles.field}>
            <span className={styles.label}>Search</span>
            <input className={styles.input} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, email, notes, service" />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Status</span>
            <select className={styles.select} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as '' | BookingStatus)}>
              {statusOptions.map((option) => <option key={option.value || 'all'} value={option.value}>{option.label}</option>)}
            </select>
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Staff</span>
            <select className={styles.select} value={staffFilter} onChange={(event) => setStaffFilter(event.target.value)}>
              <option value="">All staff</option>
              {staff.map((member) => <option key={member.staffId} value={member.staffId}>{textForLocale(member.name, locale)}</option>)}
            </select>
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Service</span>
            <select className={styles.select} value={serviceFilter} onChange={(event) => setServiceFilter(event.target.value)}>
              <option value="">All services</option>
              {services.map((service) => <option key={service.serviceId} value={service.serviceId}>{textForLocale(service.name, locale)}</option>)}
            </select>
          </label>
          <label className={styles.field}>
            <span className={styles.label}>From</span>
            <input className={styles.input} type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>To</span>
            <input className={styles.input} type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} />
          </label>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Time</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Staff</th>
                <th>Status</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((booking) => {
                const service = serviceById.get(booking.serviceId);
                const member = staffById.get(booking.staffId);
                return (
                  <tr key={booking.bookingId} data-booking-row={booking.bookingId} onClick={() => openBooking(booking)}>
                    <td>{formatDateTime(booking.startAt)}</td>
                    <td>
                      <strong>{booking.customer.name}</strong>
                      <span>{booking.customer.email}</span>
                    </td>
                    <td>{textForLocale(service?.name, locale) || booking.serviceId}</td>
                    <td>{textForLocale(member?.name, locale) || booking.staffId}</td>
                    <td><span className={styles.statusPill} data-booking-status={booking.status}>{booking.status}</span></td>
                    <td>{booking.paymentStatus || (service?.paymentMode === 'paid' ? 'unpaid' : 'free')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 ? <p className={styles.muted}>No bookings match these filters.</p> : null}
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
              <button className={styles.buttonSecondary} type="button" onClick={() => setSelected(null)}>Close</button>
            </div>
            {error ? <p className={styles.error}>{error}</p> : null}
            <div className={styles.metaRow}>
              <span className={styles.statusPill} data-booking-status={selected.status}>{selected.status}</span>
              <span className={styles.chip}>{selected.paymentStatus || 'no payment'}</span>
              {selected.meetingLink ? <a className={styles.chip} href={selected.meetingLink} target="_blank" rel="noreferrer">Meeting link</a> : null}
            </div>
            <div className={styles.detailGrid}>
              <div className={styles.panelCompact}>
                <h3 className={styles.cardTitle}>Customer</h3>
                <p><strong>Email:</strong> {selected.customer.email}</p>
                <p><strong>Phone:</strong> {selected.customer.phone || '-'}</p>
                <p><strong>Timezone:</strong> {selected.customerTimezone || '-'}</p>
                <p><strong>Case:</strong> {selected.customer.caseSummary || selected.customer.notes || '-'}</p>
              </div>
              <div className={styles.panelCompact}>
                <h3 className={styles.cardTitle}>Reschedule</h3>
                <label className={styles.field}>
                  <span className={styles.label}>Staff</span>
                  <select className={styles.select} value={draftStaffId} onChange={(event) => setDraftStaffId(event.target.value)}>
                    {staff.map((member) => <option key={member.staffId} value={member.staffId}>{textForLocale(member.name, locale)}</option>)}
                  </select>
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>Start time</span>
                  <input className={styles.input} type="datetime-local" value={draftStartAt} onChange={(event) => setDraftStartAt(event.target.value)} />
                </label>
                <button
                  className={styles.button}
                  type="button"
                  disabled={saving || !draftStartAt || !draftStaffId}
                  onClick={() => patchBooking(selected, { staffId: draftStaffId, startAt: localInputToIso(draftStartAt) })}
                >
                  {saving ? 'Saving...' : 'Save reschedule'}
                </button>
              </div>
            </div>
            <div className={styles.timeline} data-booking-timeline="true">
              <div className={styles.timelineItem}>
                <span />
                <strong>Created</strong>
                <p>{formatDateTime(selected.createdAt)}</p>
              </div>
              <div className={styles.timelineItem}>
                <span />
                <strong>Current status</strong>
                <p>{selected.status}</p>
              </div>
              <div className={styles.timelineItem}>
                <span />
                <strong>Scheduled</strong>
                <p>{formatDateTime(selected.startAt)}</p>
              </div>
              <div className={styles.timelineItem}>
                <span />
                <strong>Last updated</strong>
                <p>{formatDateTime(selected.updatedAt)}</p>
              </div>
              {selected.cancelledAt ? (
                <div className={styles.timelineItem}>
                  <span />
                  <strong>Cancelled</strong>
                  <p>{formatDateTime(selected.cancelledAt)} {selected.cancellationReason ? `· ${selected.cancellationReason}` : ''}</p>
                </div>
              ) : null}
            </div>
            <div className={styles.actions}>
              {statusActions.map((action) => (
                <button
                  className={action.value === selected.status ? styles.button : styles.buttonSecondary}
                  disabled={saving || action.value === selected.status}
                  key={action.value}
                  type="button"
                  onClick={() => patchBooking(selected, { status: action.value })}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
