'use client';

import { useState } from 'react';
import type { Staff, StaffAvailability } from '@/lib/builder/bookings/types';
import { dayOfWeeks, textForLocale } from '@/lib/builder/bookings/types';
import type { Locale } from '@/lib/locales';
import styles from './BookingsAdmin.module.css';

const dayLabels = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

function localInputValue(iso: string): string {
  if (!iso) return '';
  const date = new Date(iso);
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 16);
}

function isoFromLocal(value: string): string {
  return value ? new Date(value).toISOString() : '';
}

export default function BookingAvailabilityAdmin({
  locale,
  staff,
  initialAvailability,
}: {
  locale: Locale;
  staff: Staff;
  initialAvailability: StaffAvailability;
}) {
  const [availability, setAvailability] = useState(initialAvailability);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      const res = await fetch(`/api/builder/bookings/staff/${staff.staffId}/availability`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(availability),
      });
      if (!res.ok) throw new Error('save failed');
      const data = (await res.json()) as { availability: StaffAvailability };
      setAvailability(data.availability);
      setSaved(true);
    } catch {
      setError('가능 시간을 저장하지 못했습니다.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.split}>
      <aside className={styles.panel}>
        <div className={styles.cardImage} style={{ height: 160, borderRadius: 8, marginBottom: 16 }}>
          {staff.photo ? <img src={staff.photo} alt="" style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover' }} /> : textForLocale(staff.name, locale).slice(0, 2)}
        </div>
        <h2 className={styles.cardTitle}>{textForLocale(staff.name, locale)}</h2>
        <p className={styles.muted}>{textForLocale(staff.title, locale)}</p>
        <p className={styles.muted}>Set weekly hours, buffers, and blocked dates for public booking slots.</p>
      </aside>

      <section className={styles.panel}>
        {saved ? <p className={styles.notice}>Availability saved.</p> : null}
        {error ? <p className={styles.error}>{error}</p> : null}
        <div className={styles.toolbar}>
          <div>
            <h2 className={styles.cardTitle}>Working hours</h2>
            <p className={styles.muted}>One time range per day for the MVP foundation.</p>
          </div>
          <label className={styles.field} style={{ minWidth: 180 }}>
            <span className={styles.label}>Timezone</span>
            <select
              className={styles.select}
              value={availability.timezone}
              onChange={(event) => setAvailability({ ...availability, timezone: event.target.value })}
            >
              <option value="Asia/Taipei">Asia/Taipei</option>
              <option value="Asia/Seoul">Asia/Seoul</option>
            </select>
          </label>
        </div>
        <div className={styles.availabilityGrid}>
          {dayOfWeeks.map((day) => {
            const blocks = availability.weekly[day];
            const enabled = blocks.length > 0;
            const fallbackBlock = blocks[0] || { start: '09:00', end: '18:00' };
            return (
              <div className={styles.availabilityDay} key={day}>
                <div className={styles.dayRow}>
                  <label className={styles.label}>
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={(event) => setAvailability({
                        ...availability,
                        weekly: {
                          ...availability.weekly,
                          [day]: event.target.checked ? [fallbackBlock] : [],
                        },
                      })}
                    />{' '}
                    {dayLabels[day]}
                  </label>
                  <button
                    className={styles.buttonSecondary}
                    type="button"
                    disabled={!enabled}
                    onClick={() => setAvailability({
                      ...availability,
                      weekly: {
                        ...availability.weekly,
                        [day]: [...blocks, { start: '13:00', end: '17:00' }],
                      },
                    })}
                  >
                    Add time range
                  </button>
                </div>
                {blocks.map((block, blockIndex) => (
                  <div className={styles.timeRangeRow} key={`${day}-${blockIndex}`}>
                    <input
                      className={styles.input}
                      aria-label={`${dayLabels[day]} start ${blockIndex + 1}`}
                      type="time"
                      value={block.start}
                      onChange={(event) => {
                        const nextBlocks = blocks.map((item, index) => index === blockIndex ? { ...item, start: event.target.value } : item);
                        setAvailability({
                          ...availability,
                          weekly: { ...availability.weekly, [day]: nextBlocks },
                        });
                      }}
                    />
                    <input
                      className={styles.input}
                      aria-label={`${dayLabels[day]} end ${blockIndex + 1}`}
                      type="time"
                      value={block.end}
                      onChange={(event) => {
                        const nextBlocks = blocks.map((item, index) => index === blockIndex ? { ...item, end: event.target.value } : item);
                        setAvailability({
                          ...availability,
                          weekly: { ...availability.weekly, [day]: nextBlocks },
                        });
                      }}
                    />
                    <button
                      className={styles.buttonSecondary}
                      type="button"
                      onClick={() => setAvailability({
                        ...availability,
                        weekly: {
                          ...availability.weekly,
                          [day]: blocks.filter((_, index) => index !== blockIndex),
                        },
                      })}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        <div className={styles.toolbar} style={{ marginTop: 24 }}>
          <div>
            <h2 className={styles.cardTitle}>Blocked dates</h2>
            <p className={styles.muted}>Use these for holidays, court days, or internal meetings.</p>
          </div>
          <button
            className={styles.buttonSecondary}
            type="button"
            onClick={() => setAvailability({
              ...availability,
              blockedDates: [
                ...availability.blockedDates,
                {
                  start: new Date().toISOString(),
                  end: new Date(Date.now() + 60 * 60_000).toISOString(),
                  reason: 'Blocked',
                },
              ],
            })}
          >
            Add blocked time
          </button>
        </div>
        <div className={styles.availabilityGrid}>
          {availability.blockedDates.map((blocked, index) => (
            <div className={styles.dayRow} key={`${blocked.start}-${index}`} style={{ gridTemplateColumns: '1fr 1fr 1fr auto' }}>
              <input
                className={styles.input}
                type="datetime-local"
                value={localInputValue(blocked.start)}
                onChange={(event) => {
                  const next = [...availability.blockedDates];
                  next[index] = { ...blocked, start: isoFromLocal(event.target.value) };
                  setAvailability({ ...availability, blockedDates: next });
                }}
              />
              <input
                className={styles.input}
                type="datetime-local"
                value={localInputValue(blocked.end)}
                onChange={(event) => {
                  const next = [...availability.blockedDates];
                  next[index] = { ...blocked, end: isoFromLocal(event.target.value) };
                  setAvailability({ ...availability, blockedDates: next });
                }}
              />
              <input
                className={styles.input}
                value={blocked.reason || ''}
                onChange={(event) => {
                  const next = [...availability.blockedDates];
                  next[index] = { ...blocked, reason: event.target.value };
                  setAvailability({ ...availability, blockedDates: next });
                }}
              />
              <button
                className={styles.buttonSecondary}
                type="button"
                onClick={() => setAvailability({
                  ...availability,
                  blockedDates: availability.blockedDates.filter((_, itemIndex) => itemIndex !== index),
                })}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className={styles.actions}>
          <button className={styles.button} type="button" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save availability'}</button>
        </div>
      </section>
    </div>
  );
}
