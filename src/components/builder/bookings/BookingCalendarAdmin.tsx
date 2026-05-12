'use client';

import { useMemo, useState } from 'react';
import type { Booking, BookingService, CalendarEntry, Staff } from '@/lib/builder/bookings/types';
import { textForLocale } from '@/lib/builder/bookings/types';
import type { Locale } from '@/lib/locales';
import styles from './BookingsAdmin.module.css';

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
type CalendarViewMode = 'month' | 'week' | 'list';

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function monthRange(month: string): { from: string; to: string; cells: Date[] } {
  const [year, monthNumber] = month.split('-').map(Number);
  const first = new Date(year, (monthNumber || 1) - 1, 1);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());
  const cells = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
  const from = new Date(year, (monthNumber || 1) - 1, 1).toISOString();
  const to = new Date(year, monthNumber || 1, 0, 23, 59, 59).toISOString();
  return { from, to, cells };
}

function dateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function weekCells(month: string): Date[] {
  const [year, monthNumber] = month.split('-').map(Number);
  const today = new Date();
  const anchor = monthKey(today) === month ? today : new Date(year, (monthNumber || 1) - 1, 1);
  const start = new Date(anchor);
  start.setDate(anchor.getDate() - anchor.getDay());
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
}

function localDateTime(iso: string): string {
  return new Date(iso).toLocaleString();
}

export default function BookingCalendarAdmin({
  locale,
  initialEntries,
  services,
  staff,
}: {
  locale: Locale;
  initialEntries: CalendarEntry[];
  services: BookingService[];
  staff: Staff[];
}) {
  const [entries, setEntries] = useState(initialEntries);
  const [selectedEntry, setSelectedEntry] = useState<CalendarEntry | null>(null);
  const [staffFilter, setStaffFilter] = useState('');
  const [month, setMonth] = useState(monthKey(new Date()));
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');
  const [loading, setLoading] = useState(false);
  const range = useMemo(() => monthRange(month), [month]);
  const weekRange = useMemo(() => weekCells(month), [month]);

  const filteredEntries = entries.filter((entry) => !staffFilter || entry.staffId === staffFilter);
  const entriesByDate = useMemo(() => {
    const map = new Map<string, CalendarEntry[]>();
    for (const entry of filteredEntries) {
      const key = entry.startAt.slice(0, 10);
      map.set(key, [...(map.get(key) || []), entry]);
    }
    return map;
  }, [filteredEntries]);

  const refresh = async (nextMonth = month, nextStaffId = staffFilter) => {
    setLoading(true);
    try {
      const nextRange = monthRange(nextMonth);
      const params = new URLSearchParams({
        from: nextRange.from,
        to: nextRange.to,
        locale,
      });
      if (nextStaffId) params.set('staffId', nextStaffId);
      const res = await fetch(`/api/builder/bookings/calendar?${params.toString()}`, { credentials: 'same-origin' });
      if (res.ok) {
        const data = (await res.json()) as { entries: CalendarEntry[] };
        setEntries(data.entries);
      }
    } finally {
      setLoading(false);
    }
  };

  const moveMonth = (delta: number) => {
    const [year, monthNumber] = month.split('-').map(Number);
    const next = new Date(year, (monthNumber || 1) - 1 + delta, 1);
    const nextMonth = monthKey(next);
    setMonth(nextMonth);
    refresh(nextMonth);
  };

  const cancelBooking = async (booking: Booking) => {
    const res = await fetch(`/api/builder/bookings/${booking.bookingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ status: 'cancelled' }),
    });
    if (res.ok) {
      setSelectedEntry(null);
      await refresh();
    }
  };

  return (
    <>
      <section className={styles.panel}>
        <div className={styles.calendarControls}>
          <div className={styles.actions}>
            <button className={styles.buttonSecondary} type="button" onClick={() => moveMonth(-1)}>Prev</button>
            <button className={styles.buttonSecondary} type="button" onClick={() => {
              const current = monthKey(new Date());
              setMonth(current);
              refresh(current);
            }}>Today</button>
            <button className={styles.buttonSecondary} type="button" onClick={() => moveMonth(1)}>Next</button>
          </div>
          <h2 className={styles.cardTitle}>{month}</h2>
          <div className={styles.actions}>
            <div className={styles.viewSwitch} aria-label="Calendar view">
              {(['month', 'week', 'list'] as CalendarViewMode[]).map((mode) => (
                <button
                  data-active={viewMode === mode}
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  type="button"
                >
                  {mode[0].toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
            <select
              className={styles.select}
              value={staffFilter}
              onChange={(event) => {
                setStaffFilter(event.target.value);
                refresh(month, event.target.value);
              }}
            >
              <option value="">All staff</option>
              {staff.map((member) => (
                <option key={member.staffId} value={member.staffId}>{textForLocale(member.name, locale)}</option>
              ))}
            </select>
            <button className={styles.buttonSecondary} type="button" onClick={() => refresh()}>{loading ? 'Loading...' : 'Refresh'}</button>
          </div>
        </div>

        {viewMode === 'list' ? (
          <div className={styles.calendarList} data-calendar-view="list">
            {filteredEntries.length > 0 ? filteredEntries.map((entry) => (
              <button className={styles.listItem} key={entry.id} type="button" onClick={() => setSelectedEntry(entry)}>
                <span>{localDateTime(entry.startAt)}</span>
                <strong>{entry.title}</strong>
                <em>{entry.status || entry.type}</em>
              </button>
            )) : <p className={styles.muted}>No calendar entries in this range.</p>}
          </div>
        ) : (
          <div className={styles.calendarGrid} data-calendar-view={viewMode}>
            {weekdays.map((day) => <div className={styles.weekday} key={day}>{day}</div>)}
            {(viewMode === 'week' ? weekRange : range.cells).map((cell) => {
              const key = dateKey(cell);
              const dayEntries = entriesByDate.get(key) || [];
              return (
                <div className={styles.calendarDay} key={key} style={{ opacity: viewMode === 'week' || key.startsWith(month) ? 1 : 0.45 }}>
                  <div className={styles.dayNumber}>{cell.getDate()}</div>
                  {dayEntries.map((entry) => (
                    <button
                      className={styles.event}
                      data-status={entry.status}
                      data-type={entry.type}
                      key={entry.id}
                      type="button"
                      onClick={() => setSelectedEntry(entry)}
                    >
                      {new Date(entry.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} {entry.title}
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {selectedEntry ? (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{selectedEntry.title}</h2>
              <button className={styles.buttonSecondary} type="button" onClick={() => setSelectedEntry(null)}>Close</button>
            </div>
            <div className={styles.metaRow}>
              <span className={styles.chip}>{selectedEntry.type}</span>
              <span className={styles.chip}>{selectedEntry.status || 'blocked'}</span>
            </div>
            <p className={styles.muted}>{localDateTime(selectedEntry.startAt)} - {localDateTime(selectedEntry.endAt)}</p>
            {selectedEntry.booking ? (
              <>
                <div className={styles.panel} style={{ boxShadow: 'none', marginTop: 16 }}>
                  <p><strong>Name:</strong> {selectedEntry.booking.customer.name}</p>
                  <p><strong>Email:</strong> {selectedEntry.booking.customer.email}</p>
                  <p><strong>Phone:</strong> {selectedEntry.booking.customer.phone || '-'}</p>
                  <p><strong>Notes:</strong> {selectedEntry.booking.customer.notes || '-'}</p>
                  <p><strong>Timezone:</strong> {selectedEntry.booking.customerTimezone || '-'}</p>
                  <p><strong>Case summary:</strong> {selectedEntry.booking.customer.caseSummary || '-'}</p>
                  <p><strong>Attachments:</strong> {(selectedEntry.booking.customer.attachmentUrls ?? []).join(', ') || '-'}</p>
                  {(selectedEntry.booking.customer.customFields ?? []).map((field) => (
                    <p key={field.label}><strong>{field.label}:</strong> {field.value || '-'}</p>
                  ))}
                </div>
                <div className={styles.actions}>
                  {selectedEntry.booking.status !== 'cancelled' ? (
                    <button className={styles.buttonSecondary} type="button" onClick={() => cancelBooking(selectedEntry.booking!)}>Cancel booking</button>
                  ) : null}
                </div>
              </>
            ) : null}
          </div>
        </div>
      ) : null}

      <section className={styles.grid} style={{ marginTop: 18 }}>
        <div className={styles.panel}>
          <h2 className={styles.cardTitle}>Services</h2>
          <p className={styles.muted}>{services.filter((service) => service.isActive).length} active service templates feed public booking.</p>
        </div>
        <div className={styles.panel}>
          <h2 className={styles.cardTitle}>Staff</h2>
          <p className={styles.muted}>{staff.filter((member) => member.isActive).length} active staff calendars are connected.</p>
        </div>
      </section>
    </>
  );
}
