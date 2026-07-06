import type { StaffAvailability, AvailabilityBlock } from './types';
import type { Locale } from '@/lib/locales';
import { isHolidayDate } from './availability-templates';

function dayOfWeekForDate(date: string): keyof StaffAvailability['weekly'] {
  const dayIndex = new Date(`${date}T12:00:00.000Z`).getUTCDay();
  return ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'][(dayIndex + 6) % 7] as keyof StaffAvailability['weekly'];
}

export interface StaffAvailabilityPreview {
  date: string;
  status: 'open' | 'closed';
  blocks: Array<{ start: string; end: string }>;
  reason: string;
  warnings: string[];
  override: boolean;
}

function previewCopy(locale: Locale) {
  return {
    overrideClosed: locale === 'ko'
      ? '날짜 예외가 이 날짜를 닫습니다.'
      : locale === 'zh-hant'
        ? '日期覆寫會關閉這一天。'
        : 'Date override closes this day.',
    overrideOpen: (blocks: string) => (locale === 'ko'
      ? `날짜 예외가 이 날짜를 ${blocks}로 다시 엽니다.`
      : locale === 'zh-hant'
        ? `日期覆寫會以 ${blocks} 重新開放這一天。`
        : `Date override reopens this day with ${blocks}.`),
    overrideWarning: locale === 'ko'
      ? '휴일 캘린더는 이 예외가 존재하는 동안 무시됩니다.'
      : locale === 'zh-hant'
        ? '在此覆寫存在期間，假期行事曆會被忽略。'
        : 'Holiday calendar is ignored while this override exists.',
    holidayBlocked: locale === 'ko'
      ? '휴일 캘린더가 이 날짜를 차단합니다.'
      : locale === 'zh-hant'
        ? '假期行事曆會封鎖這一天。'
        : 'Holiday calendar blocks this date.',
    noWeeklyHours: locale === 'ko'
      ? '이 날짜에는 주간 시간이 설정되어 있지 않습니다.'
      : locale === 'zh-hant'
        ? '此日期未設定每週時段。'
        : 'No weekly hours configured for this date.',
    weeklyHours: (blocks: string) => (locale === 'ko'
      ? `주간 시간: ${blocks}.`
      : locale === 'zh-hant'
        ? `每週時段：${blocks}。`
        : `Weekly hours: ${blocks}.`),
  } as const;
}

export function describeStaffAvailabilityForDate(
  availability: StaffAvailability,
  date: string,
  locale: Locale = 'en',
): StaffAvailabilityPreview {
  const copy = previewCopy(locale);
  const override = availability.dateOverrides?.find((item) => item.date === date);
  const blocks: AvailabilityBlock[] = override?.blocks ?? availability.weekly[dayOfWeekForDate(date)] ?? [];
  if (override) {
    if (override.blocks.length === 0) {
      return {
        date,
        status: 'closed',
        blocks: [],
        reason: copy.overrideClosed,
        warnings: [copy.overrideWarning],
        override: true,
      };
    }
    return {
      date,
      status: 'open',
      blocks: override.blocks,
      reason: copy.overrideOpen(override.blocks.map((block) => `${block.start}-${block.end}`).join(', ')),
      warnings: [copy.overrideWarning],
      override: true,
    };
  }
  if (isHolidayDate(date, availability.holidayCalendar)) {
    return {
      date,
      status: 'closed',
      blocks: [],
      reason: copy.holidayBlocked,
      warnings: [],
      override: false,
    };
  }
  if (blocks.length === 0) {
    return {
      date,
      status: 'closed',
      blocks: [],
      reason: copy.noWeeklyHours,
      warnings: [],
      override: false,
    };
  }
  return {
    date,
    status: 'open',
    blocks,
    reason: copy.weeklyHours(blocks.map((block) => `${block.start}-${block.end}`).join(', ')),
    warnings: [],
    override: false,
  };
}
