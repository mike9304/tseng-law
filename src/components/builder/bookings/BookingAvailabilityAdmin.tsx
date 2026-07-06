'use client';

import { useState } from 'react';
import type { Staff, StaffAvailability } from '@/lib/builder/bookings/types';
import { dayOfWeeks, textForLocale } from '@/lib/builder/bookings/types';
import {
  applyRecurringAvailabilityTemplate,
  recurringAvailabilityTemplates,
  type RecurringAvailabilityTemplateId,
} from '@/lib/builder/bookings/availability-templates';
import { describeStaffAvailabilityForDate } from '@/lib/builder/bookings/availability-preview';
import type { Locale } from '@/lib/locales';
import styles from './BookingsAdmin.module.css';

const dayLabels = {
  ko: {
    monday: '월요일',
    tuesday: '화요일',
    wednesday: '수요일',
    thursday: '목요일',
    friday: '금요일',
    saturday: '토요일',
    sunday: '일요일',
  },
  'zh-hant': {
    monday: '週一',
    tuesday: '週二',
    wednesday: '週三',
    thursday: '週四',
    friday: '週五',
    saturday: '週六',
    sunday: '週日',
  },
  en: {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
  },
} as const;

const timeRangeLabels = {
  ko: { start: '시작', end: '끝' },
  'zh-hant': { start: '開始', end: '結束' },
  en: { start: 'start', end: 'end' },
} as const;

const copy = {
  ko: {
    availabilitySaved: '가능 시간을 저장했습니다.',
    pageIntro: '공개 예약 슬롯용 주간 시간, 버퍼, 차단 시간을 설정합니다.',
    workingHours: '근무 시간',
    workingHoursHelp: '반복 템플릿을 적용한 뒤, Wix Bookings처럼 요일별 시간을 미세 조정합니다.',
    recurringTemplate: '반복 템플릿',
    applyTemplate: '템플릿 적용',
    timezone: '시간대',
    holidayCalendar: '휴일 캘린더',
    holidayNone: '자동 휴일 없음',
    holidayKorea: '대한민국 공휴일',
    holidayTaiwan: '대만 공휴일',
    holidayBoth: '대한민국 + 대만 공휴일',
    addTimeRange: '시간 추가',
    remove: '삭제',
    blockedDates: '차단 날짜',
    blockedDatesHelp: '휴일, 법원 일정, 내부 회의에 사용합니다.',
    addBlockedTime: '차단 시간 추가',
    dateOverrides: '날짜 예외',
    dateOverridesHelp: '휴일이나 예외 날짜를 사용자 지정 시간으로 덮어씁니다. 시간을 비우면 해당 날짜는 계속 닫힌 상태로 유지됩니다.',
    addDateOverride: '날짜 예외 추가',
    open: '열림',
    closed: '닫힘',
    saveFailed: '가능 시간을 저장하지 못했습니다.',
    saveAvailability: '가능 시간 저장',
    saving: '저장 중...',
  },
  'zh-hant': {
    availabilitySaved: '已儲存可用時段。',
    pageIntro: '設定公開預約時段的每週時間、緩衝與封鎖時段。',
    workingHours: '工作時間',
    workingHoursHelp: '先套用重複範本，再像 Wix Bookings 一樣微調每一天的時間。',
    recurringTemplate: '重複範本',
    applyTemplate: '套用範本',
    timezone: '時區',
    holidayCalendar: '假期行事曆',
    holidayNone: '不使用自動假期',
    holidayKorea: '韓國國定假日',
    holidayTaiwan: '台灣國定假日',
    holidayBoth: '韓國 + 台灣國定假日',
    addTimeRange: '新增時段',
    remove: '刪除',
    blockedDates: '封鎖日期',
    blockedDatesHelp: '用於假日、法庭日或內部會議。',
    addBlockedTime: '新增封鎖時段',
    dateOverrides: '日期覆寫',
    dateOverridesHelp: '以自訂時段覆寫假日或例外日期。若留空時間，該日仍保持關閉。',
    addDateOverride: '新增日期覆寫',
    open: '開放',
    closed: '關閉',
    saveFailed: '無法儲存可用時段。',
    saveAvailability: '儲存可用時段',
    saving: '儲存中...',
  },
  en: {
    availabilitySaved: 'Availability saved.',
    pageIntro: 'Set weekly hours, buffers, and blocked dates for public booking slots.',
    workingHours: 'Working hours',
    workingHoursHelp: 'Apply a recurring template, then fine-tune individual days like Wix Bookings.',
    recurringTemplate: 'Recurring template',
    applyTemplate: 'Apply template',
    timezone: 'Timezone',
    holidayCalendar: 'Holiday calendar',
    holidayNone: 'No automatic holidays',
    holidayKorea: 'Korea public holidays',
    holidayTaiwan: 'Taiwan public holidays',
    holidayBoth: 'Korea + Taiwan public holidays',
    addTimeRange: 'Add time range',
    remove: 'Remove',
    blockedDates: 'Blocked dates',
    blockedDatesHelp: 'Use these for holidays, court days, or internal meetings.',
    addBlockedTime: 'Add blocked time',
    dateOverrides: 'Date overrides',
    dateOverridesHelp: 'Override a holiday or exception date with custom hours. Leave times blank to keep the day closed.',
    addDateOverride: 'Add date override',
    open: 'Open',
    closed: 'Closed',
    saveFailed: 'Unable to save availability.',
    saveAvailability: 'Save availability',
    saving: 'Saving...',
  },
} as const;

function localInputValue(iso: string): string {
  if (!iso) return '';
  const date = new Date(iso);
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 16);
}

function isoFromLocal(value: string): string {
  return value ? new Date(value).toISOString() : '';
}

function blockedReason(locale: Locale): string {
  if (locale === 'ko') return '차단됨';
  if (locale === 'zh-hant') return '封鎖';
  return 'Blocked';
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
  const [templateId, setTemplateId] = useState<RecurringAvailabilityTemplateId>(
    (initialAvailability.recurringTemplateId as RecurringAvailabilityTemplateId | undefined) ?? 'weekdays-10-18',
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dateOverrides = availability.dateOverrides ?? [];
  const c = copy[locale];
  const dayLabel = (day: keyof typeof dayLabels.en) => dayLabels[locale][day];

  const save = async () => {
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      const params = new URLSearchParams({ locale });
      const res = await fetch(`/api/builder/bookings/staff/${staff.staffId}/availability?${params.toString()}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(availability),
      });
      const data = (await res.json().catch(() => null)) as { availability?: StaffAvailability; error?: string } | null;
      if (!res.ok || !data?.availability) throw new Error(data?.error || 'save failed');
      setAvailability(data.availability);
      setSaved(true);
    } catch (err) {
      const message = err instanceof Error && err.message !== 'save failed' ? err.message : c.saveFailed;
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.split}>
      <aside className={styles.panel}>
        <div className={styles.cardImage} style={{ height: 160, borderRadius: 8, marginBottom: 16 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {staff.photo ? <img src={staff.photo} alt="" style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover' }} /> : textForLocale(staff.name, locale).slice(0, 2)}
        </div>
        <h2 className={styles.cardTitle}>{textForLocale(staff.name, locale)}</h2>
        <p className={styles.muted}>{textForLocale(staff.title, locale)}</p>
        <p className={styles.muted}>{c.pageIntro}</p>
      </aside>

      <section className={styles.panel}>
        {saved ? <p className={styles.notice}>{c.availabilitySaved}</p> : null}
        {error ? <p className={styles.error}>{error}</p> : null}
        <div className={styles.toolbar}>
          <div>
            <h2 className={styles.cardTitle}>{c.workingHours}</h2>
            <p className={styles.muted}>{c.workingHoursHelp}</p>
          </div>
          <label className={styles.field} style={{ minWidth: 240 }}>
            <span className={styles.label}>{c.recurringTemplate}</span>
            <select
              className={styles.select}
              data-availability-template="true"
              value={templateId}
              onChange={(event) => setTemplateId(event.target.value as RecurringAvailabilityTemplateId)}
            >
              {recurringAvailabilityTemplates.map((template) => (
                <option key={template.templateId} value={template.templateId}>{template.label}</option>
              ))}
            </select>
          </label>
          <button
            className={styles.buttonSecondary}
            type="button"
            onClick={() => setAvailability(applyRecurringAvailabilityTemplate(availability, templateId))}
          >
            {c.applyTemplate}
          </button>
          <label className={styles.field} style={{ minWidth: 180 }}>
            <span className={styles.label}>{c.timezone}</span>
            <select
              className={styles.select}
              value={availability.timezone}
              onChange={(event) => setAvailability({ ...availability, timezone: event.target.value })}
            >
              <option value="Asia/Taipei">Asia/Taipei</option>
              <option value="Asia/Seoul">Asia/Seoul</option>
            </select>
          </label>
          <label className={styles.field} style={{ minWidth: 210 }}>
            <span className={styles.label}>{c.holidayCalendar}</span>
            <select
              className={styles.select}
              value={availability.holidayCalendar ?? 'none'}
              onChange={(event) => setAvailability({
                ...availability,
                holidayCalendar: event.target.value as StaffAvailability['holidayCalendar'],
              })}
            >
              <option value="none">{c.holidayNone}</option>
              <option value="kr">{c.holidayKorea}</option>
              <option value="tw">{c.holidayTaiwan}</option>
              <option value="kr-tw">{c.holidayBoth}</option>
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
                    {dayLabel(day)}
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
                    {c.addTimeRange}
                  </button>
                </div>
                {blocks.map((block, blockIndex) => (
                  <div className={styles.timeRangeRow} key={`${day}-${blockIndex}`}>
                    <input
                      className={styles.input}
                      aria-label={`${dayLabel(day)} ${timeRangeLabels[locale].start} ${blockIndex + 1}`}
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
                      aria-label={`${dayLabel(day)} ${timeRangeLabels[locale].end} ${blockIndex + 1}`}
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
                      {c.remove}
                    </button>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        <div className={styles.toolbar} style={{ marginTop: 24 }}>
          <div>
            <h2 className={styles.cardTitle}>{c.blockedDates}</h2>
            <p className={styles.muted}>{c.blockedDatesHelp}</p>
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
                  reason: blockedReason(locale),
                },
              ],
            })}
          >
            {c.addBlockedTime}
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
                {c.remove}
              </button>
            </div>
          ))}
        </div>
        <div className={styles.toolbar} style={{ marginTop: 24 }}>
          <div>
            <h2 className={styles.cardTitle}>{c.dateOverrides}</h2>
            <p className={styles.muted}>{c.dateOverridesHelp}</p>
          </div>
          <button
            className={styles.buttonSecondary}
            type="button"
            onClick={() => setAvailability({
              ...availability,
              dateOverrides: [
                ...dateOverrides,
                {
                  date: new Date().toISOString().slice(0, 10),
                  blocks: [],
                  note: '',
                },
              ],
            })}
          >
            {c.addDateOverride}
          </button>
        </div>
        <div className={styles.availabilityGrid}>
          {dateOverrides.map((override, index) => {
            const block = override.blocks[0];
            const preview = describeStaffAvailabilityForDate(availability, override.date, locale);
            return (
              <div
                className={styles.dayRow}
                key={`${override.date}-${index}`}
                style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr auto' }}
              >
                <input
                  className={styles.input}
                  data-booking-availability-override-date="true"
                  type="date"
                  value={override.date}
                  onChange={(event) => {
                    const next = [...dateOverrides];
                    next[index] = { ...override, date: event.target.value };
                    setAvailability({ ...availability, dateOverrides: next });
                  }}
                />
                <input
                  className={styles.input}
                  data-booking-availability-override-start="true"
                  type="time"
                  value={block?.start ?? ''}
                  onChange={(event) => {
                    const start = event.target.value;
                    const next = [...dateOverrides];
                    next[index] = {
                      ...override,
                      blocks: start ? [{ start, end: block?.end || '18:00' }] : [],
                    };
                    setAvailability({ ...availability, dateOverrides: next });
                  }}
                />
                <input
                  className={styles.input}
                  data-booking-availability-override-end="true"
                  type="time"
                  value={block?.end ?? ''}
                  onChange={(event) => {
                    const end = event.target.value;
                    const next = [...dateOverrides];
                    next[index] = {
                      ...override,
                      blocks: end ? [{ start: block?.start || '09:00', end }] : [],
                    };
                    setAvailability({ ...availability, dateOverrides: next });
                  }}
                />
                <input
                  className={styles.input}
                  data-booking-availability-override-note="true"
                  value={override.note || ''}
                  onChange={(event) => {
                    const next = [...dateOverrides];
                    next[index] = { ...override, note: event.target.value };
                    setAvailability({ ...availability, dateOverrides: next });
                  }}
                />
                <button
                  className={styles.buttonSecondary}
                  type="button"
                  onClick={() => setAvailability({
                    ...availability,
                    dateOverrides: dateOverrides.filter((_, itemIndex) => itemIndex !== index),
                  })}
                >
                  {c.remove}
                </button>
                <div
                  className={styles.preview}
                  data-booking-availability-override-preview="true"
                  style={{ gridColumn: '1 / -1' }}
                >
                  <strong>{preview.status === 'open' ? c.open : c.closed}</strong>
                  <span>{preview.reason}</span>
                  {preview.warnings.length > 0 ? <em>{preview.warnings.join(' · ')}</em> : null}
                </div>
              </div>
            );
          })}
        </div>
        <div className={styles.actions}>
          <button className={styles.button} type="button" onClick={save} disabled={saving}>{saving ? c.saving : c.saveAvailability}</button>
        </div>
      </section>
    </div>
  );
}
