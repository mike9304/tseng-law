'use client';

import { useEffect, useMemo, useRef, useState, type DragEvent } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { Booking, BookingService, CalendarEntry, Staff } from '@/lib/builder/bookings/types';
import { textForLocale } from '@/lib/builder/bookings/types';
import { normalizeBookingCalendarMonth, normalizeBookingCalendarViewMode, type BookingCalendarViewMode } from '@/lib/builder/bookings/calendar-url';
import { formatDateTimeInTimezone } from '@/lib/builder/bookings/timezone';
import { formatDateTime } from '@/lib/builder/format/datetime';
import type { Locale } from '@/lib/locales';
import styles from './BookingsAdmin.module.css';

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
type CalendarViewMode = 'month' | 'week' | 'list';

function calendarCopy(locale: Locale) {
  if (locale === 'ko') {
    return {
      prev: '이전',
      today: '오늘',
      next: '다음',
      view: '달력 보기',
      month: '월간',
      week: '주간',
      list: '목록',
      allStaff: '전체 담당자',
      loading: '불러오는 중...',
      refresh: '새로고침',
      noEntries: '이 기간에 일정이 없습니다.',
      close: '닫기',
      officeTime: '운영 시간',
      officeTimezone: '운영 시간대',
      customerTime: '고객 시간',
      booking: '예약',
      blocked: '차단',
      conflicts: '충돌',
      conflictTitle: '충돌 시각화',
      noConflicts: '겹치는 예약이나 차단 시간이 없습니다.',
      reschedule: '일정 변경',
      startTime: '시작 시간',
      staff: '담당자',
      selectStaff: '담당자 선택',
      saving: '저장 중...',
      saveReschedule: '일정 변경 저장',
      cancelBooking: '예약 취소',
      startStaffRequired: '시작 시간과 담당자를 선택해 주세요.',
      rescheduleFailed: '일정 변경에 실패했습니다.',
      servicesTitle: '서비스',
      servicesSubtitle: '활성 서비스 템플릿이 공개 예약에 반영됩니다.',
      staffTitle: '담당자',
      staffSubtitle: '활성 담당자 캘린더가 연결되어 있습니다.',
    } as const;
  }
  if (locale === 'zh-hant') {
    return {
      prev: '上一頁',
      today: '今天',
      next: '下一頁',
      view: '行事曆檢視',
      month: '月',
      week: '週',
      list: '清單',
      allStaff: '所有員工',
      loading: '載入中...',
      refresh: '重新整理',
      noEntries: '此區間沒有行程。',
      close: '關閉',
      officeTime: '辦公時間',
      officeTimezone: '辦公時區',
      customerTime: '客戶時間',
      booking: '預約',
      blocked: '封鎖',
      conflicts: '衝突',
      conflictTitle: '衝突視覺化',
      noConflicts: '沒有重疊的預約或封鎖時段。',
      reschedule: '重新排程',
      startTime: '開始時間',
      staff: '人員',
      selectStaff: '選擇人員',
      saving: '儲存中...',
      saveReschedule: '儲存新時間',
      cancelBooking: '取消預約',
      startStaffRequired: '請選擇開始時間與人員。',
      rescheduleFailed: '重新排程失敗。',
      servicesTitle: '服務',
      servicesSubtitle: '啟用中的服務範本會供公開預約使用。',
      staffTitle: '人員',
      staffSubtitle: '已連接啟用中的人員行事曆。',
    } as const;
  }
  return {
    prev: 'Prev',
    today: 'Today',
    next: 'Next',
    view: 'Calendar view',
    month: 'Month',
    week: 'Week',
    list: 'List',
    allStaff: 'All staff',
    loading: 'Loading...',
    refresh: 'Refresh',
    noEntries: 'No calendar entries in this range.',
    close: 'Close',
    officeTime: 'Office time',
    officeTimezone: 'Office timezone',
    customerTime: 'Customer time',
    booking: 'Booking',
    blocked: 'Blocked',
    conflicts: 'conflicts',
    conflictTitle: 'Conflict visualization',
    noConflicts: 'No overlapping bookings or blocked windows.',
    reschedule: 'Reschedule',
    startTime: 'Start time',
    staff: 'Staff',
    selectStaff: 'Select staff',
    saving: 'Saving...',
    saveReschedule: 'Save reschedule',
    cancelBooking: 'Cancel booking',
    startStaffRequired: 'Start time and staff are required.',
    rescheduleFailed: 'Reschedule failed',
    servicesTitle: 'Services',
    servicesSubtitle: 'Active service templates feed public booking.',
    staffTitle: 'Staff',
    staffSubtitle: 'Active staff calendars are connected.',
  } as const;
}

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
  // Grid cells are LOCAL-midnight dates while booking entries are keyed by the
  // first 10 chars of their startAt ISO string. Formatting cells via
  // toISOString() shifts every key by -1 day on UTC+ servers, putting bookings
  // on the wrong visual day — format in local time instead.
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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

function localDateTime(iso: string, locale: Locale): string {
  return formatDateTime(iso, locale);
}

function toLocalInputValue(iso: string): string {
  const date = new Date(iso);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function localInputToIso(value: string): string {
  return new Date(value).toISOString();
}

function combineLocalDateWithTime(dateKey: string, iso: string): string {
  const source = new Date(iso);
  const [year, month, day] = dateKey.split('-').map(Number);
  if (!year || !month || !day) return iso;
  return new Date(year, month - 1, day, source.getHours(), source.getMinutes(), 0, 0).toISOString();
}

function overlaps(left: { startAt: string; endAt: string }, right: { startAt: string; endAt: string }): boolean {
  return left.startAt < right.endAt && left.endAt > right.startAt;
}

export default function BookingCalendarAdmin({
  locale,
  initialEntries,
  services,
  staff,
  availability,
  initialMonth,
  initialViewMode,
  initialStaffId,
}: {
  locale: Locale;
  initialEntries: CalendarEntry[];
  services: BookingService[];
  staff: Staff[];
  availability: Array<{ staffId: string; timezone: string }>;
  initialMonth?: string;
  initialViewMode?: BookingCalendarViewMode;
  initialStaffId?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchKey = searchParams.toString();
  const skipNextUrlPushRef = useRef(false);
  const [entries, setEntries] = useState(initialEntries);
  const [selectedEntry, setSelectedEntry] = useState<CalendarEntry | null>(null);
  const [staffFilter, setStaffFilter] = useState(initialStaffId ?? '');
  const [month, setMonth] = useState(initialMonth ?? monthKey(new Date()));
  const [viewMode, setViewMode] = useState<CalendarViewMode>(initialViewMode ?? 'month');
  const [loading, setLoading] = useState(false);
  const [rescheduleStartAt, setRescheduleStartAt] = useState('');
  const [rescheduleStaffId, setRescheduleStaffId] = useState('');
  const [rescheduleSaving, setRescheduleSaving] = useState(false);
  const [rescheduleError, setRescheduleError] = useState('');
  const draggingBookingIdRef = useRef<string | null>(null);
  const range = useMemo(() => monthRange(month), [month]);
  const weekRange = useMemo(() => weekCells(month), [month]);
  const availabilityByStaffId = useMemo(() => new Map(availability.map((item) => [item.staffId, item])), [availability]);
  const copy = useMemo(() => calendarCopy(locale), [locale]);
  const weekdayLabels = locale === 'ko'
    ? ['일', '월', '화', '수', '목', '금', '토']
    : locale === 'zh-hant'
      ? ['日', '一', '二', '三', '四', '五', '六']
      : weekdays;

  useEffect(() => {
    if (!selectedEntry?.booking) {
      setRescheduleStartAt('');
      setRescheduleStaffId('');
      setRescheduleSaving(false);
      setRescheduleError('');
      return;
    }
    setRescheduleStartAt(toLocalInputValue(selectedEntry.startAt));
    setRescheduleStaffId(selectedEntry.staffId);
    setRescheduleSaving(false);
    setRescheduleError('');
  }, [selectedEntry?.booking?.bookingId, selectedEntry?.staffId, selectedEntry?.startAt]);

  useEffect(() => {
    skipNextUrlPushRef.current = true;
    const nextMonth = normalizeBookingCalendarMonth(searchParams.get('month'));
    const nextViewMode = normalizeBookingCalendarViewMode(searchParams.get('view'));
    const nextStaffFilter = searchParams.get('staffId') ?? '';
    const monthChanged = nextMonth !== month;
    const viewChanged = nextViewMode !== viewMode;
    const staffChanged = nextStaffFilter !== staffFilter;
    if (monthChanged) setMonth(nextMonth);
    if (viewChanged) setViewMode(nextViewMode);
    if (staffChanged) setStaffFilter(nextStaffFilter);
    if (monthChanged || staffChanged) {
      void refresh(nextMonth, nextStaffFilter);
    }
  }, [searchKey]);

  const filteredEntries = entries.filter((entry) => !staffFilter || entry.staffId === staffFilter);
  const entriesByDate = useMemo(() => {
    const map = new Map<string, CalendarEntry[]>();
    for (const entry of filteredEntries) {
      const key = entry.startAt.slice(0, 10);
      map.set(key, [...(map.get(key) || []), entry]);
    }
    return map;
  }, [filteredEntries]);

  const conflictEntries = useMemo(() => {
    if (!selectedEntry) return [];
    return filteredEntries.filter((entry) => {
      if (entry.id === selectedEntry.id) return false;
      if (entry.staffId !== selectedEntry.staffId) return false;
      return overlaps(selectedEntry, entry);
    });
  }, [filteredEntries, selectedEntry]);
  const selectedAvailability = selectedEntry ? availabilityByStaffId.get(selectedEntry.staffId) : undefined;
  const selectedOfficeTime = selectedEntry ? formatDateTimeInTimezone(selectedEntry.startAt, locale, selectedAvailability?.timezone) : '';
  const selectedOfficeEndTime = selectedEntry ? formatDateTimeInTimezone(selectedEntry.endAt, locale, selectedAvailability?.timezone) : '';

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

  useEffect(() => {
    if (skipNextUrlPushRef.current) {
      skipNextUrlPushRef.current = false;
      return;
    }
    const params = new URLSearchParams(searchKey);
    params.set('month', month);
    params.set('view', viewMode);
    if (staffFilter) {
      params.set('staffId', staffFilter);
    } else {
      params.delete('staffId');
    }
    const nextQuery = params.toString();
    if (nextQuery !== searchKey) {
      router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
    }
  }, [month, pathname, router, searchKey, staffFilter, viewMode]);

  const moveMonth = (delta: number) => {
    const [year, monthNumber] = month.split('-').map(Number);
    const next = new Date(year, (monthNumber || 1) - 1 + delta, 1);
    const nextMonth = monthKey(next);
    setMonth(nextMonth);
    refresh(nextMonth);
  };

  const cancelBooking = async (booking: Booking) => {
    const params = new URLSearchParams({ locale });
    const res = await fetch(`/api/builder/bookings/${booking.bookingId}?${params.toString()}`, {
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

  const saveReschedule = async () => {
    if (!selectedEntry?.booking) return;
    if (!rescheduleStartAt || !rescheduleStaffId) {
      setRescheduleError(copy.startStaffRequired);
      return;
    }
    await moveBooking(selectedEntry.booking.bookingId, localInputToIso(rescheduleStartAt), rescheduleStaffId);
  };

  const moveBooking = async (bookingId: string, startAt: string, staffId: string) => {
    setRescheduleSaving(true);
    setRescheduleError('');
    try {
      const params = new URLSearchParams({ locale });
      const res = await fetch(`/api/builder/bookings/${bookingId}?${params.toString()}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ startAt, staffId }),
      });
      const data = await res.json().catch(() => null) as { booking?: Booking; error?: string } | null;
      if (!res.ok || !data?.booking) {
        throw new Error(data?.error || copy.rescheduleFailed);
      }
      setSelectedEntry((current) => current?.booking?.bookingId === bookingId ? {
        ...current,
        startAt: data.booking!.startAt,
        endAt: data.booking!.endAt,
        staffId: data.booking!.staffId,
        booking: { ...current.booking, ...data.booking! },
      } : current);
      await refresh();
      return data.booking;
    } catch (error) {
      setRescheduleError(error instanceof Error ? error.message : copy.rescheduleFailed);
      return null;
    } finally {
      setRescheduleSaving(false);
    }
  };

  const handleEventDragStart = (event: DragEvent<HTMLButtonElement>, entry: CalendarEntry) => {
    if (!entry.booking) return;
    draggingBookingIdRef.current = entry.booking.bookingId;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', entry.booking.bookingId);
    event.dataTransfer.setData('application/x-booking-id', entry.booking.bookingId);
    event.dataTransfer.setData('application/x-booking-start-at', entry.startAt);
    event.dataTransfer.setData('application/x-booking-staff-id', entry.staffId);
  };

  const handleEventDragEnd = () => {
    draggingBookingIdRef.current = null;
  };

  const handleDayDrop = async (event: DragEvent<HTMLDivElement>, dateKey: string) => {
    event.preventDefault();
    const bookingId = event.dataTransfer.getData('application/x-booking-id') || draggingBookingIdRef.current;
    const startAt = event.dataTransfer.getData('application/x-booking-start-at');
    const staffId = event.dataTransfer.getData('application/x-booking-staff-id') || selectedEntry?.staffId || '';
    if (!bookingId || !startAt || !staffId) return;
    await moveBooking(bookingId, combineLocalDateWithTime(dateKey, startAt), staffId);
  };

  return (
    <>
      <section className={styles.panel}>
        <div className={styles.calendarControls}>
          <div className={styles.actions}>
            <button className={styles.buttonSecondary} type="button" onClick={() => moveMonth(-1)}>{copy.prev}</button>
            <button className={styles.buttonSecondary} type="button" onClick={() => {
              const current = monthKey(new Date());
              setMonth(current);
              refresh(current);
            }}>{copy.today}</button>
            <button className={styles.buttonSecondary} type="button" onClick={() => moveMonth(1)}>{copy.next}</button>
          </div>
          <h2 className={styles.cardTitle} data-bookings-calendar-month="true">{month}</h2>
          <div className={styles.actions}>
            <div className={styles.viewSwitch} aria-label={copy.view}>
              {(['month', 'week', 'list'] as CalendarViewMode[]).map((mode) => (
                <button
                  data-active={viewMode === mode}
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  type="button"
                >
                  {mode === 'month' ? copy.month : mode === 'week' ? copy.week : copy.list}
                </button>
              ))}
            </div>
            <select
              className={styles.select}
              data-bookings-calendar-staff-filter="true"
              value={staffFilter}
              onChange={(event) => {
                setStaffFilter(event.target.value);
                refresh(month, event.target.value);
              }}
            >
              <option value="">{copy.allStaff}</option>
              {staff.map((member) => (
                <option key={member.staffId} value={member.staffId}>{textForLocale(member.name, locale)}</option>
              ))}
            </select>
            <button className={styles.buttonSecondary} type="button" onClick={() => refresh()}>{loading ? copy.loading : copy.refresh}</button>
          </div>
        </div>

        {viewMode === 'list' ? (
          <div className={styles.calendarList} data-calendar-view="list">
            {filteredEntries.length > 0 ? filteredEntries.map((entry) => (
              <button
                className={styles.listItem}
                data-calendar-entry-id={entry.id}
                data-calendar-entry-start-at={entry.startAt}
                key={entry.id}
                type="button"
                onClick={() => setSelectedEntry(entry)}
              >
                <span>{localDateTime(entry.startAt, locale)}</span>
                <strong>{entry.title}</strong>
                <em>{entry.status || entry.type}</em>
              </button>
            )) : <p className={styles.muted}>{copy.noEntries}</p>}
          </div>
        ) : (
          <div className={styles.calendarGrid} data-calendar-view={viewMode}>
            {weekdayLabels.map((day) => <div className={styles.weekday} key={day}>{day}</div>)}
            {(viewMode === 'week' ? weekRange : range.cells).map((cell) => {
              const key = dateKey(cell);
              const dayEntries = entriesByDate.get(key) || [];
              return (
                <div
                  className={styles.calendarDay}
                  data-calendar-day={key}
                  key={key}
                  style={{ opacity: viewMode === 'week' || key.startsWith(month) ? 1 : 0.45 }}
                  onDragOver={(event) => {
                    if (draggingBookingIdRef.current) event.preventDefault();
                  }}
                  onDrop={(event) => { void handleDayDrop(event, key); }}
                >
                  <div className={styles.dayNumber}>{cell.getDate()}</div>
                  {dayEntries.map((entry) => (
                    <button
                      className={styles.event}
                      data-calendar-entry-id={entry.id}
                      data-calendar-entry-start-at={entry.startAt}
                      data-status={entry.status}
                      data-type={entry.type}
                      key={entry.id}
                      draggable={Boolean(entry.booking)}
                      type="button"
                      onDragStart={(event) => handleEventDragStart(event, entry)}
                      onDragEnd={handleEventDragEnd}
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
              <button className={styles.buttonSecondary} type="button" onClick={() => setSelectedEntry(null)}>{copy.close}</button>
            </div>
            <div className={styles.metaRow}>
              <span className={styles.chip}>{selectedEntry.type}</span>
              <span className={styles.chip}>{selectedEntry.status || copy.blocked}</span>
              <span className={styles.chip} data-booking-calendar-conflict-count="true">{conflictEntries.length} {copy.conflicts}</span>
            </div>
            <p className={styles.muted}>{localDateTime(selectedEntry.startAt, locale)} - {localDateTime(selectedEntry.endAt, locale)}</p>
            {selectedEntry.booking ? (
              <>
                <div className={styles.panel} style={{ boxShadow: 'none', marginTop: 16 }}>
                  <p data-booking-calendar-office-time="true"><strong>{copy.officeTime}:</strong> {selectedOfficeTime && selectedOfficeEndTime ? `${selectedOfficeTime} - ${selectedOfficeEndTime}` : '-'}</p>
                  <p data-booking-calendar-office-timezone="true"><strong>{copy.officeTimezone}:</strong> {selectedAvailability?.timezone || '-'}</p>
                  <p><strong>{locale === 'ko' ? '이름' : locale === 'zh-hant' ? '姓名' : 'Name'}:</strong> {selectedEntry.booking.customer.name}</p>
                  <p><strong>{locale === 'ko' ? '이메일' : locale === 'zh-hant' ? '電子郵件' : 'Email'}:</strong> {selectedEntry.booking.customer.email}</p>
                  <p><strong>{locale === 'ko' ? '전화' : locale === 'zh-hant' ? '電話' : 'Phone'}:</strong> {selectedEntry.booking.customer.phone || '-'}</p>
                  <p><strong>{locale === 'ko' ? '메모' : locale === 'zh-hant' ? '備註' : 'Notes'}:</strong> {selectedEntry.booking.customer.notes || '-'}</p>
                  <p><strong>{locale === 'ko' ? '시간대' : locale === 'zh-hant' ? '時區' : 'Timezone'}:</strong> {selectedEntry.booking.customerTimezone || '-'}</p>
                  <p><strong>{locale === 'ko' ? '사례 요약' : locale === 'zh-hant' ? '案件摘要' : 'Case summary'}:</strong> {selectedEntry.booking.customer.caseSummary || '-'}</p>
                  <p><strong>{locale === 'ko' ? '첨부파일' : locale === 'zh-hant' ? '附件' : 'Attachments'}:</strong> {(selectedEntry.booking.customer.attachmentUrls ?? []).join(', ') || '-'}</p>
                  {(selectedEntry.booking.customer.customFields ?? []).map((field) => (
                    <p key={field.label}><strong>{field.label}:</strong> {field.value || '-'}</p>
                  ))}
                </div>
                <div className={styles.panel} style={{ boxShadow: 'none', marginTop: 16 }}>
                  <h3 className={styles.cardTitle}>{copy.conflictTitle}</h3>
                  {conflictEntries.length === 0 ? (
                    <p className={styles.muted}>{copy.noConflicts}</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {conflictEntries.map((entry) => (
                        <div key={entry.id} data-booking-calendar-conflict-entry={entry.id} style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 10, background: entry.type === 'blocked' ? '#fff7ed' : '#eff6ff' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                            <span className={styles.chip}>{entry.type === 'booking' ? copy.booking : copy.blocked}</span>
                            <span className={styles.chip}>{entry.status || entry.reason || 'conflict'}</span>
                          </div>
                          <p style={{ margin: '8px 0 0', fontWeight: 600 }}>{entry.title}</p>
                          <p className={styles.muted} style={{ margin: '4px 0 0' }}>
                            {localDateTime(entry.startAt, locale)} - {localDateTime(entry.endAt, locale)}
                          </p>
                          {entry.reason ? <p className={styles.muted} style={{ margin: '4px 0 0' }}>{entry.reason}</p> : null}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className={styles.panel} style={{ boxShadow: 'none', marginTop: 16 }}>
                  <h3 className={styles.cardTitle}>{copy.reschedule}</h3>
                  {rescheduleError ? <p className={styles.error}>{rescheduleError}</p> : null}
                  <div className={styles.formGrid}>
                    <label className={styles.field}>
                      <span className={styles.label}>{copy.startTime}</span>
                      <input
                        className={styles.input}
                        data-booking-calendar-reschedule-start="true"
                        type="datetime-local"
                        value={rescheduleStartAt}
                        onChange={(event) => setRescheduleStartAt(event.target.value)}
                      />
                    </label>
                    <label className={styles.field}>
                      <span className={styles.label}>{copy.staff}</span>
                      <select
                        className={styles.select}
                        data-booking-calendar-reschedule-staff="true"
                        value={rescheduleStaffId}
                        onChange={(event) => setRescheduleStaffId(event.target.value)}
                      >
                        <option value="">{copy.selectStaff}</option>
                        {staff.map((member) => (
                          <option key={member.staffId} value={member.staffId}>{textForLocale(member.name, locale)}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <div className={styles.actions}>
                    <button
                      className={styles.button}
                      data-booking-calendar-reschedule-save="true"
                      disabled={rescheduleSaving || !rescheduleStartAt || !rescheduleStaffId || selectedEntry.booking.status === 'cancelled'}
                      type="button"
                      onClick={() => void saveReschedule()}
                    >
                      {rescheduleSaving ? copy.saving : copy.saveReschedule}
                    </button>
                    {selectedEntry.booking.status !== 'cancelled' ? (
                      <button className={styles.buttonSecondary} type="button" onClick={() => cancelBooking(selectedEntry.booking!)}>{copy.cancelBooking}</button>
                    ) : null}
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      ) : null}

      <section className={styles.grid} style={{ marginTop: 18 }}>
        <div className={styles.panel}>
          <h2 className={styles.cardTitle}>{copy.servicesTitle}</h2>
          <p className={styles.muted}>{services.filter((service) => service.isActive).length} {copy.servicesSubtitle}</p>
        </div>
        <div className={styles.panel}>
          <h2 className={styles.cardTitle}>{copy.staffTitle}</h2>
          <p className={styles.muted}>{staff.filter((member) => member.isActive).length} {copy.staffSubtitle}</p>
        </div>
      </section>
    </>
  );
}
