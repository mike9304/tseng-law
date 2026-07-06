'use client';

import { useState } from 'react';
import type { AvailabilityBlock, BlockedDate, BookingResource, DayOfWeek } from '@/lib/builder/bookings/types';
import { dayOfWeeks, textForLocale } from '@/lib/builder/bookings/types';
import {
  recurringAvailabilityTemplates,
  type RecurringAvailabilityTemplateId,
} from '@/lib/builder/bookings/availability-templates';
import type { Locale } from '@/lib/locales';
import { formatDateTime } from '@/lib/builder/format/datetime';
import styles from './BookingsAdmin.module.css';

type ResourceDraft = {
  resourceId?: string;
  nameKo: string;
  nameZh: string;
  nameEn: string;
  descriptionKo: string;
  descriptionZh: string;
  descriptionEn: string;
  location: string;
  capacity: number;
  bufferBeforeMinutes: number;
  bufferAfterMinutes: number;
  timezone: string;
  recurringTemplateId: string;
  weekly: Record<DayOfWeek, AvailabilityBlock[]>;
  blockedDates: BlockedDate[];
  blockedStart: string;
  blockedEnd: string;
  blockedReason: string;
  isActive: boolean;
};

function datetimeLocalValue(iso?: string): string {
  if (!iso) return '';
  const date = new Date(iso);
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

function datetimeLocalToIso(value: string): string {
  return new Date(value).toISOString();
}

function cloneWeekly(weekly: Record<DayOfWeek, AvailabilityBlock[]>): Record<DayOfWeek, AvailabilityBlock[]> {
  return Object.fromEntries(
    dayOfWeeks.map((day) => [day, (weekly[day] ?? []).map((block) => ({ ...block }))]),
  ) as Record<DayOfWeek, AvailabilityBlock[]>;
}

function weeklyFromTemplate(templateId: RecurringAvailabilityTemplateId): Record<DayOfWeek, AvailabilityBlock[]> {
  const template = recurringAvailabilityTemplates.find((item) => item.templateId === templateId)
    ?? recurringAvailabilityTemplates.find((item) => item.templateId === 'weekdays-09-18')
    ?? recurringAvailabilityTemplates[0];
  return Object.fromEntries(
    dayOfWeeks.map((day) => [day, template.weekly[day].map((block) => ({ ...block }))]),
  ) as Record<DayOfWeek, AvailabilityBlock[]>;
}

function recurringSummary(resource: BookingResource, locale: Locale): string {
  if (resource.recurringTemplateId) {
    const label = recurringAvailabilityTemplates.find((template) => template.templateId === resource.recurringTemplateId)?.label;
    if (label) return locale === 'ko' ? `반복 ${label}` : locale === 'zh-hant' ? `重複 ${label}` : `Recurring ${label}`;
  }
  const enabledDays = dayOfWeeks.filter((day) => (resource.weekly?.[day] ?? []).length > 0);
  if (enabledDays.length === 0) return locale === 'ko' ? '주간 닫힘' : locale === 'zh-hant' ? '每週關閉' : 'Closed weekly';
  return locale === 'ko' ? '사용자 지정 주간 캘린더' : locale === 'zh-hant' ? '自訂每週行事曆' : 'Custom weekly calendar';
}

function draftFromResource(resource?: BookingResource): ResourceDraft {
  const templateId = resource?.recurringTemplateId || (resource?.weekly ? '' : 'weekdays-09-18');
  return {
    resourceId: resource?.resourceId,
    nameKo: resource?.name.ko || '',
    nameZh: resource?.name['zh-hant'] || '',
    nameEn: resource?.name.en || '',
    descriptionKo: resource?.description?.ko || '',
    descriptionZh: resource?.description?.['zh-hant'] || '',
    descriptionEn: resource?.description?.en || '',
    location: resource?.location || '',
    capacity: resource?.capacity ?? 1,
    bufferBeforeMinutes: resource?.bufferBeforeMinutes ?? 0,
    bufferAfterMinutes: resource?.bufferAfterMinutes ?? 0,
    timezone: resource?.timezone || 'Asia/Taipei',
    recurringTemplateId: templateId,
    weekly: resource?.weekly ? cloneWeekly(resource.weekly) : weeklyFromTemplate('weekdays-09-18'),
    blockedDates: resource?.blockedDates || [],
    blockedStart: '',
    blockedEnd: '',
    blockedReason: '',
    isActive: resource?.isActive ?? true,
  };
}

function resourcePayload(draft: ResourceDraft) {
  const fallback = draft.nameKo || draft.nameEn || 'Booking resource';
  return {
    name: {
      ko: draft.nameKo || fallback,
      'zh-hant': draft.nameZh || fallback,
      en: draft.nameEn || fallback,
    },
    description: {
      ko: draft.descriptionKo,
      'zh-hant': draft.descriptionZh || draft.descriptionKo,
      en: draft.descriptionEn || draft.descriptionKo,
    },
    location: draft.location,
    capacity: draft.capacity,
    bufferBeforeMinutes: draft.bufferBeforeMinutes,
    bufferAfterMinutes: draft.bufferAfterMinutes,
    timezone: draft.timezone,
    recurringTemplateId: draft.recurringTemplateId,
    weekly: draft.weekly,
    blockedDates: draft.blockedDates,
    isActive: draft.isActive,
  };
}

function bufferSummary(resource: BookingResource, locale: Locale): string | null {
  const before = resource.bufferBeforeMinutes ?? 0;
  const after = resource.bufferAfterMinutes ?? 0;
  if (before === 0 && after === 0) return null;
  return locale === 'ko'
    ? `버퍼 시작 전 ${before}분 / 종료 후 ${after}분`
    : locale === 'zh-hant'
      ? `前置緩衝 ${before} 分鐘 / 後置緩衝 ${after} 分鐘`
      : `Buffers ${before}m before / ${after}m after`;
}

function timezoneSummary(resource: BookingResource, locale: Locale): string {
  return locale === 'ko'
    ? `시간대 ${resource.timezone || 'Asia/Taipei'}`
    : locale === 'zh-hant'
      ? `時區 ${resource.timezone || 'Asia/Taipei'}`
      : `TZ ${resource.timezone || 'Asia/Taipei'}`;
}

function nextBlockedLabel(resource: BookingResource, locale: Locale): string {
  const now = new Date().toISOString();
  const next = (resource.blockedDates ?? [])
    .filter((blocked) => blocked.end >= now)
    .sort((a, b) => a.start.localeCompare(b.start))[0];
  if (!next) return locale === 'ko' ? '예정된 차단 없음' : locale === 'zh-hant' ? '沒有即將到來的封鎖' : 'No upcoming blocks';
  const formatted = formatDateTime(next.start, locale);
  return locale === 'ko'
    ? `다음 차단 ${formatted}`
    : locale === 'zh-hant'
      ? `下一個封鎖 ${formatted}`
      : `Next blocked ${formatted}`;
}

export default function BookingResourcesAdmin({
  locale,
  initialResources,
}: {
  locale: Locale;
  initialResources: BookingResource[];
}) {
  const [resources, setResources] = useState(initialResources);
  const [draft, setDraft] = useState<ResourceDraft | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const copy = {
    ko: {
      toolbar: (count: number) => `${count}개의 객실 및 공유 예약 자원`,
      newResource: '새 자원',
      resourceNotes: '자원 메모 없음.',
      noLocation: '위치 없음',
      capacity: '수용 인원',
      recurringWeeklyHours: '반복 주간 시간',
      recurringWeeklyHint: '템플릿을 선택하거나 자원 일정을 세부 조정하세요. 공개 슬롯은 이 시간대 안에서만 표시됩니다.',
      recurringTemplate: '반복 템플릿',
      customWeeklyCalendar: '사용자 정의 주간 캘린더',
      addTimeRange: '시간 범위 추가',
      remove: '제거',
      active: '활성',
      inactive: '비활성',
      edit: '편집',
      deactivate: '비활성화',
      editResource: '자원 편집',
      newResourceTitle: '새 자원',
      close: '닫기',
      nameKo: '이름 KO',
      nameEn: '이름 EN',
      nameZh: '이름 ZH',
      location: '위치',
      timezone: '시간대',
      bufferBefore: '버퍼 시작 전 분',
      bufferAfter: '버퍼 종료 후 분',
      activeLabel: '활성',
      descriptionKo: '설명 KO',
      descriptionEn: '설명 EN',
      descriptionZh: '설명 ZH',
      blockedTime: '차단 시간',
      blockedHint: '회의실 정비나 외부 사용을 차단하세요. 이 자원이 필요한 서비스는 겹치는 슬롯을 숨깁니다.',
      start: '시작',
      end: '종료',
      reason: '사유',
      add: '추가',
      addBlock: '차단 추가',
      noBlockedTimes: '차단된 시간이 없습니다.',
      saveResource: '자원 저장',
      saving: '저장 중...',
      cancel: '취소',
      nextBlocked: (value: string) => `다음 차단 ${value}`,
      noUpcomingBlocks: '예정된 차단 없음',
      recurring: (label: string) => `반복 ${label}`,
      closedWeekly: '주간 닫힘',
      customCalendar: '사용자 지정 주간 캘린더',
      buffers: (before: number, after: number) => `버퍼 시작 전 ${before}분 / 종료 후 ${after}분`,
      blockedCount: (count: number) => `${count}개 차단됨`,
      dayLabels: { monday: '월요일', tuesday: '화요일', wednesday: '수요일', thursday: '목요일', friday: '금요일', saturday: '토요일', sunday: '일요일' },
    },
    'zh-hant': {
      toolbar: (count: number) => `${count} 間房間與共享預約資源`,
      newResource: '新增資源',
      resourceNotes: '沒有資源備註。',
      noLocation: '沒有地點',
      capacity: '容量',
      recurringWeeklyHours: '重複每週時段',
      recurringWeeklyHint: '可選擇範本或微調資源排程。公開時段只會出現在這些時間窗內。',
      recurringTemplate: '重複範本',
      customWeeklyCalendar: '自訂每週行事曆',
      addTimeRange: '新增時段',
      remove: '移除',
      active: '啟用',
      inactive: '停用',
      edit: '編輯',
      deactivate: '停用',
      editResource: '編輯資源',
      newResourceTitle: '新增資源',
      close: '關閉',
      nameKo: '名稱 KO',
      nameEn: '名稱 EN',
      nameZh: '名稱 ZH',
      location: '地點',
      timezone: '時區',
      bufferBefore: '前置緩衝分鐘',
      bufferAfter: '後置緩衝分鐘',
      activeLabel: '啟用',
      descriptionKo: '說明 KO',
      descriptionEn: '說明 EN',
      descriptionZh: '說明 ZH',
      blockedTime: '封鎖時段',
      blockedHint: '可封鎖房間維護或外部使用。需要此資源的服務會隱藏重疊時段。',
      start: '開始',
      end: '結束',
      reason: '原因',
      add: '新增',
      addBlock: '新增封鎖',
      noBlockedTimes: '沒有被封鎖的時段。',
      saveResource: '儲存資源',
      saving: '儲存中...',
      cancel: '取消',
      nextBlocked: (value: string) => `下一個封鎖 ${value}`,
      noUpcomingBlocks: '沒有即將到來的封鎖',
      recurring: (label: string) => `重複 ${label}`,
      closedWeekly: '每週關閉',
      customCalendar: '自訂每週行事曆',
      buffers: (before: number, after: number) => `前置緩衝 ${before} 分鐘 / 後置緩衝 ${after} 分鐘`,
      blockedCount: (count: number) => `${count} 個封鎖`,
      dayLabels: { monday: '星期一', tuesday: '星期二', wednesday: '星期三', thursday: '星期四', friday: '星期五', saturday: '星期六', sunday: '星期日' },
    },
    en: {
      toolbar: (count: number) => `${count} rooms and shared booking resources.`,
      newResource: 'New resource',
      resourceNotes: 'No resource notes.',
      noLocation: 'No location',
      capacity: 'Capacity',
      recurringWeeklyHours: 'Recurring weekly hours',
      recurringWeeklyHint: 'Choose a template or fine-tune the resource schedule. Public slots only appear inside these windows.',
      recurringTemplate: 'Recurring template',
      customWeeklyCalendar: 'Custom weekly calendar',
      addTimeRange: 'Add time range',
      remove: 'Remove',
      active: 'Active',
      inactive: 'Inactive',
      edit: 'Edit',
      deactivate: 'Deactivate',
      editResource: 'Edit resource',
      newResourceTitle: 'New resource',
      close: 'Close',
      nameKo: 'Name KO',
      nameEn: 'Name EN',
      nameZh: 'Name ZH',
      location: 'Location',
      timezone: 'Timezone',
      bufferBefore: 'Buffer before minutes',
      bufferAfter: 'Buffer after minutes',
      activeLabel: 'Active',
      descriptionKo: 'Description KO',
      descriptionEn: 'Description EN',
      descriptionZh: 'Description ZH',
      blockedTime: 'Blocked time',
      blockedHint: 'Block room maintenance or outside use. Services requiring this resource will hide overlapping slots.',
      start: 'Start',
      end: 'End',
      reason: 'Reason',
      add: 'Add',
      addBlock: 'Add block',
      noBlockedTimes: 'No blocked times.',
      saveResource: 'Save resource',
      saving: 'Saving...',
      cancel: 'Cancel',
      nextBlocked: (value: string) => `Next blocked ${value}`,
      noUpcomingBlocks: 'No upcoming blocks',
      recurring: (label: string) => `Recurring ${label}`,
      closedWeekly: 'Closed weekly',
      customCalendar: 'Custom weekly calendar',
      buffers: (before: number, after: number) => `Buffers ${before}m before / ${after}m after`,
      blockedCount: (count: number) => `${count} blocked`,
      dayLabels: { monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday', thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday' },
    },
  } as const;
  const c = copy[locale];

  const save = async () => {
    if (!draft || saving) return;
    setSaving(true);
    setError(null);
    try {
      const params = new URLSearchParams({ locale });
      const url = draft.resourceId
        ? `/api/builder/bookings/resources/${draft.resourceId}?${params.toString()}`
        : `/api/builder/bookings/resources?${params.toString()}`;
      const res = await fetch(url, {
        method: draft.resourceId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(resourcePayload(draft)),
      });
      const data = (await res.json().catch(() => null)) as { resource?: BookingResource; error?: string } | null;
      if (!res.ok || !data?.resource) throw new Error(data?.error || 'save failed');
      setResources((current) => {
        const without = current.filter((item) => item.resourceId !== data.resource!.resourceId);
        return [...without, data.resource!].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      });
      setDraft(null);
    } catch (err) {
      setError(
        err instanceof Error && err.message !== 'save failed'
          ? err.message
          : locale === 'ko'
            ? '리소스를 저장하지 못했습니다.'
            : locale === 'zh-hant'
              ? '無法儲存資源。'
              : 'Unable to save resource.',
      );
    } finally {
      setSaving(false);
    }
  };

  const deactivate = async (resource: BookingResource) => {
    const params = new URLSearchParams({ locale });
    const res = await fetch(`/api/builder/bookings/resources/${resource.resourceId}?${params.toString()}`, {
      method: 'DELETE',
      credentials: 'same-origin',
    });
    if (res.ok) {
      const data = (await res.json()) as { resource: BookingResource };
      setResources((current) => current.map((item) => item.resourceId === resource.resourceId ? data.resource : item));
    }
  };

  return (
    <>
      <div className={styles.toolbar}>
        <div className={styles.muted}>{c.toolbar(resources.length)}</div>
        <button className={styles.button} type="button" onClick={() => setDraft(draftFromResource())}>
          {c.newResource}
        </button>
      </div>
      <div className={styles.grid} data-booking-resources-admin="true">
        {resources.map((resource) => (
          <article className={styles.card} key={resource.resourceId} data-booking-resource-card={resource.resourceId}>
            <div className={styles.cardBody}>
              <h2 className={styles.cardTitle}>{textForLocale(resource.name, locale)}</h2>
              <p className={styles.muted}>{textForLocale(resource.description, locale) || c.resourceNotes}</p>
              <div className={styles.metaRow}>
                <span className={styles.chip}>{resource.location || c.noLocation}</span>
                <span className={styles.chip}>{resource.capacity ?? 1} {c.capacity}</span>
                <span className={styles.chip} data-booking-resource-timezone-summary={resource.resourceId}>{timezoneSummary(resource, locale)}</span>
                <span className={styles.chip} data-booking-resource-recurring-summary={resource.resourceId}>{recurringSummary(resource, locale)}</span>
                {bufferSummary(resource, locale) ? <span className={styles.chip} data-booking-resource-buffer-summary={resource.resourceId}>{bufferSummary(resource, locale)}</span> : null}
                <span className={styles.chip} data-booking-resource-blocked-count={resource.resourceId}>{c.blockedCount(resource.blockedDates?.length ?? 0)}</span>
                <span className={styles.chip}>{resource.isActive ? c.active : c.inactive}</span>
              </div>
              <p className={styles.muted} data-booking-resource-next-blocked={resource.resourceId}>{nextBlockedLabel(resource, locale)}</p>
              <div className={styles.actions}>
                <button className={styles.buttonSecondary} type="button" onClick={() => setDraft(draftFromResource(resource))}>{c.edit}</button>
                {resource.isActive ? (
                  <button className={styles.buttonSecondary} type="button" onClick={() => deactivate(resource)}>{c.deactivate}</button>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>

      {draft ? (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{draft.resourceId ? c.editResource : c.newResourceTitle}</h2>
              <button className={styles.buttonSecondary} type="button" onClick={() => setDraft(null)}>{c.close}</button>
            </div>
            {error ? <p className={styles.error}>{error}</p> : null}
            <div className={styles.formGrid}>
              <label className={styles.field}>
                <span className={styles.label}>{c.nameKo}</span>
                <input className={styles.input} value={draft.nameKo} onChange={(event) => setDraft({ ...draft, nameKo: event.target.value })} />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>{c.nameEn}</span>
                <input className={styles.input} value={draft.nameEn} onChange={(event) => setDraft({ ...draft, nameEn: event.target.value })} />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>{c.nameZh}</span>
                <input className={styles.input} value={draft.nameZh} onChange={(event) => setDraft({ ...draft, nameZh: event.target.value })} />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>{c.location}</span>
                <input className={styles.input} value={draft.location} onChange={(event) => setDraft({ ...draft, location: event.target.value })} />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>{c.capacity}</span>
                <input className={styles.input} type="number" min={1} max={500} value={draft.capacity} onChange={(event) => setDraft({ ...draft, capacity: Number(event.target.value) })} />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>{c.timezone}</span>
                <select
                  className={styles.select}
                  data-booking-resource-timezone="true"
                  value={draft.timezone}
                  onChange={(event) => setDraft({
                    ...draft,
                    timezone: event.target.value,
                    recurringTemplateId: '',
                  })}
                >
                  <option value="Asia/Taipei">Asia/Taipei</option>
                  <option value="Asia/Seoul">Asia/Seoul</option>
                  <option value="America/New_York">America/New_York</option>
                </select>
              </label>
              <label className={styles.field}>
                <span className={styles.label}>{c.bufferBefore}</span>
                <input
                  className={styles.input}
                  data-booking-resource-buffer-before="true"
                  type="number"
                  min={0}
                  max={240}
                  value={draft.bufferBeforeMinutes}
                  onChange={(event) => setDraft({ ...draft, bufferBeforeMinutes: Number(event.target.value) })}
                />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>{c.bufferAfter}</span>
                <input
                  className={styles.input}
                  data-booking-resource-buffer-after="true"
                  type="number"
                  min={0}
                  max={240}
                  value={draft.bufferAfterMinutes}
                  onChange={(event) => setDraft({ ...draft, bufferAfterMinutes: Number(event.target.value) })}
                />
              </label>
              <fieldset className={`${styles.field} ${styles.fieldFull}`} data-booking-resource-weekly-editor="true">
                <legend className={styles.label}>{c.recurringWeeklyHours}</legend>
                <p className={styles.muted}>{c.recurringWeeklyHint}</p>
                <div className={styles.toolbar} style={{ marginBottom: 16 }}>
                  <label className={styles.field} style={{ minWidth: 260 }}>
                    <span className={styles.label}>{c.recurringTemplate}</span>
                    <select
                      className={styles.select}
                      data-booking-resource-recurring-template="true"
                      value={draft.recurringTemplateId || 'custom'}
                      onChange={(event) => {
                        const value = event.target.value;
                        if (value === 'custom') {
                          setDraft({
                            ...draft,
                            recurringTemplateId: '',
                          });
                          return;
                        }
                        const templateId = value as RecurringAvailabilityTemplateId;
                        setDraft({
                          ...draft,
                          recurringTemplateId: templateId,
                          weekly: weeklyFromTemplate(templateId),
                        });
                      }}
                    >
                      <option value="custom">{c.customWeeklyCalendar}</option>
                      {recurringAvailabilityTemplates.map((template) => (
                        <option key={template.templateId} value={template.templateId}>{template.label}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className={styles.availabilityGrid} data-booking-resource-weekly-grid="true">
                  {dayOfWeeks.map((day) => {
                    const blocks = draft.weekly[day];
                    const enabled = blocks.length > 0;
                    const fallbackBlock = blocks[0] || { start: '09:00', end: '18:00' };
                    return (
                      <div className={styles.availabilityDay} key={day} data-booking-resource-weekly-day={day}>
                        <div className={styles.dayRow}>
                          <label className={styles.label}>
                            <input
                              type="checkbox"
                              checked={enabled}
                              onChange={(event) => setDraft({
                                ...draft,
                                recurringTemplateId: '',
                                weekly: {
                                  ...draft.weekly,
                                  [day]: event.target.checked ? [fallbackBlock] : [],
                                },
                              })}
                            />{' '}
                            {c.dayLabels[day]}
                          </label>
                          <button
                            className={styles.buttonSecondary}
                            type="button"
                            disabled={!enabled}
                            onClick={() => setDraft({
                              ...draft,
                              recurringTemplateId: '',
                              weekly: {
                                ...draft.weekly,
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
                              aria-label={`${c.dayLabels[day]} ${c.start} ${blockIndex + 1}`}
                              type="time"
                              value={block.start}
                              onChange={(event) => {
                                const nextBlocks = blocks.map((item, index) => index === blockIndex ? { ...item, start: event.target.value } : item);
                                setDraft({
                                  ...draft,
                                  recurringTemplateId: '',
                                  weekly: { ...draft.weekly, [day]: nextBlocks },
                                });
                              }}
                            />
                            <input
                              className={styles.input}
                              aria-label={`${c.dayLabels[day]} ${c.end} ${blockIndex + 1}`}
                              type="time"
                              value={block.end}
                              onChange={(event) => {
                                const nextBlocks = blocks.map((item, index) => index === blockIndex ? { ...item, end: event.target.value } : item);
                                setDraft({
                                  ...draft,
                                  recurringTemplateId: '',
                                  weekly: { ...draft.weekly, [day]: nextBlocks },
                                });
                              }}
                            />
                            <button
                              className={styles.buttonSecondary}
                              type="button"
                              onClick={() => setDraft({
                                ...draft,
                                recurringTemplateId: '',
                                weekly: {
                                  ...draft.weekly,
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
              </fieldset>
              <label className={styles.field}>
                <span className={styles.label}>
                  <input type="checkbox" checked={draft.isActive} onChange={(event) => setDraft({ ...draft, isActive: event.target.checked })} /> {c.activeLabel}
                </span>
              </label>
              <label className={`${styles.field} ${styles.fieldFull}`}>
                <span className={styles.label}>{c.descriptionKo}</span>
                <textarea className={styles.textarea} value={draft.descriptionKo} onChange={(event) => setDraft({ ...draft, descriptionKo: event.target.value })} />
              </label>
              <label className={`${styles.field} ${styles.fieldFull}`}>
                <span className={styles.label}>{c.descriptionEn}</span>
                <textarea className={styles.textarea} value={draft.descriptionEn} onChange={(event) => setDraft({ ...draft, descriptionEn: event.target.value })} />
              </label>
              <label className={`${styles.field} ${styles.fieldFull}`}>
                <span className={styles.label}>{c.descriptionZh}</span>
                <textarea className={styles.textarea} value={draft.descriptionZh} onChange={(event) => setDraft({ ...draft, descriptionZh: event.target.value })} />
              </label>
              <fieldset
                className={`${styles.field} ${styles.fieldFull}`}
                data-booking-resource-blocked-editor="true"
                data-resource-blocked-times="true"
              >
                <legend className={styles.label}>{c.blockedTime}</legend>
                <p className={styles.muted}>{c.blockedHint}</p>
                <div className={styles.formGrid}>
                  <label className={styles.field}>
                    <span className={styles.label}>{c.start}</span>
                    <input
                      className={styles.input}
                      type="datetime-local"
                      value={draft.blockedStart}
                      onChange={(event) => setDraft({ ...draft, blockedStart: event.target.value })}
                    />
                  </label>
                  <label className={styles.field}>
                    <span className={styles.label}>{c.end}</span>
                    <input
                      className={styles.input}
                      type="datetime-local"
                      value={draft.blockedEnd}
                      onChange={(event) => setDraft({ ...draft, blockedEnd: event.target.value })}
                    />
                  </label>
                  <label className={styles.field}>
                    <span className={styles.label}>{c.reason}</span>
                    <input
                      className={styles.input}
                      placeholder={locale === 'ko' ? '정비, 비공개 행사, 사용 불가' : locale === 'zh-hant' ? '維護、私人活動、不可用' : 'Maintenance, private event, unavailable'}
                      value={draft.blockedReason}
                      onChange={(event) => setDraft({ ...draft, blockedReason: event.target.value })}
                    />
                  </label>
                  <div className={styles.field}>
                    <span className={styles.label}>{c.add}</span>
                    <button
                      className={styles.buttonSecondary}
                      type="button"
                      data-booking-resource-blocked-add="true"
                      data-resource-blocked-add="true"
                      disabled={!draft.blockedStart || !draft.blockedEnd || draft.blockedStart >= draft.blockedEnd}
                      onClick={() => {
                        const blockedDates = [
                          ...draft.blockedDates,
                          {
                            start: datetimeLocalToIso(draft.blockedStart),
                            end: datetimeLocalToIso(draft.blockedEnd),
                            ...(draft.blockedReason ? { reason: draft.blockedReason } : {}),
                          },
                        ].sort((a, b) => a.start.localeCompare(b.start));
                        setDraft({
                          ...draft,
                          blockedDates,
                          blockedStart: '',
                          blockedEnd: '',
                          blockedReason: '',
                        });
                      }}
                    >
                      {c.addBlock}
                    </button>
                  </div>
                </div>
                <div className={styles.metaRow}>
                  {draft.blockedDates.length === 0 ? <span className={styles.muted}>{c.noBlockedTimes}</span> : null}
                  {draft.blockedDates.map((blocked, index) => (
                    <span
                      className={styles.chip}
                      key={`${blocked.start}-${blocked.end}`}
                      data-booking-resource-blocked-row={index}
                      data-resource-blocked-row={index}
                    >
                      {datetimeLocalValue(blocked.start).replace('T', ' ')} - {datetimeLocalValue(blocked.end).replace('T', ' ')}
                      {blocked.reason ? ` · ${blocked.reason}` : ''}
                      {' '}
                      <button
                        className={styles.buttonSecondary}
                        type="button"
                        data-resource-blocked-remove={index}
                        onClick={() => setDraft({
                          ...draft,
                          blockedDates: draft.blockedDates.filter((_, currentIndex) => currentIndex !== index),
                        })}
                      >
                        {c.remove}
                      </button>
                    </span>
                  ))}
                </div>
              </fieldset>
            </div>
            <div className={styles.actions}>
              <button className={styles.button} type="button" onClick={save} disabled={saving}>{saving ? c.saving : c.saveResource}</button>
              <button className={styles.buttonSecondary} type="button" onClick={() => setDraft(null)}>{c.cancel}</button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
