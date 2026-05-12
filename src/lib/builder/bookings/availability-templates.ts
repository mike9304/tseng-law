import { dayOfWeeks, type AvailabilityBlock, type HolidayCalendar, type StaffAvailability } from './types';

export type RecurringAvailabilityTemplateId =
  | 'weekdays-09-18'
  | 'weekdays-10-18'
  | 'weekdays-split'
  | 'weekends-10-16'
  | 'clear';

export interface RecurringAvailabilityTemplate {
  templateId: RecurringAvailabilityTemplateId;
  label: string;
  description: string;
  weekly: StaffAvailability['weekly'];
}

function emptyWeekly(): StaffAvailability['weekly'] {
  return dayOfWeeks.reduce((weekly, day) => {
    weekly[day] = [];
    return weekly;
  }, {} as StaffAvailability['weekly']);
}

function weekdays(blocks: AvailabilityBlock[]): StaffAvailability['weekly'] {
  return dayOfWeeks.reduce((weekly, day) => {
    weekly[day] = day === 'saturday' || day === 'sunday' ? [] : blocks;
    return weekly;
  }, {} as StaffAvailability['weekly']);
}

function weekend(blocks: AvailabilityBlock[]): StaffAvailability['weekly'] {
  return dayOfWeeks.reduce((weekly, day) => {
    weekly[day] = day === 'saturday' || day === 'sunday' ? blocks : [];
    return weekly;
  }, {} as StaffAvailability['weekly']);
}

export const recurringAvailabilityTemplates: RecurringAvailabilityTemplate[] = [
  {
    templateId: 'weekdays-10-18',
    label: 'Weekdays 10:00-18:00',
    description: 'Monday to Friday, full consultation day.',
    weekly: weekdays([{ start: '10:00', end: '18:00' }]),
  },
  {
    templateId: 'weekdays-09-18',
    label: 'Weekdays 09:00-18:00',
    description: 'Classic office hours.',
    weekly: weekdays([{ start: '09:00', end: '18:00' }]),
  },
  {
    templateId: 'weekdays-split',
    label: 'Weekdays 10:00-12:00 / 14:00-18:00',
    description: 'Lunch break excluded.',
    weekly: weekdays([{ start: '10:00', end: '12:00' }, { start: '14:00', end: '18:00' }]),
  },
  {
    templateId: 'weekends-10-16',
    label: 'Weekends 10:00-16:00',
    description: 'Weekend limited consultation slots.',
    weekly: weekend([{ start: '10:00', end: '16:00' }]),
  },
  {
    templateId: 'clear',
    label: 'Clear all working hours',
    description: 'Use this when temporarily closing booking slots.',
    weekly: emptyWeekly(),
  },
];

const KR_FIXED_HOLIDAYS = new Set(['01-01', '03-01', '05-05', '06-06', '08-15', '10-03', '10-09', '12-25']);
const TW_FIXED_HOLIDAYS = new Set(['01-01', '02-28', '04-04', '05-01', '10-10']);

function calendarParts(calendar: HolidayCalendar | undefined): HolidayCalendar[] {
  if (!calendar || calendar === 'none') return [];
  if (calendar === 'kr-tw') return ['kr', 'tw'];
  return [calendar];
}

export function applyRecurringAvailabilityTemplate(
  availability: StaffAvailability,
  templateId: RecurringAvailabilityTemplateId,
): StaffAvailability {
  const template = recurringAvailabilityTemplates.find((item) => item.templateId === templateId);
  if (!template) return availability;
  return {
    ...availability,
    recurringTemplateId: template.templateId,
    weekly: Object.fromEntries(
      dayOfWeeks.map((day) => [day, template.weekly[day].map((block) => ({ ...block }))]),
    ) as StaffAvailability['weekly'],
  };
}

export function isHolidayDate(date: string, calendar: HolidayCalendar | undefined): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const mmdd = date.slice(5);
  return calendarParts(calendar).some((part) => {
    if (part === 'kr') return KR_FIXED_HOLIDAYS.has(mmdd);
    if (part === 'tw') return TW_FIXED_HOLIDAYS.has(mmdd);
    return false;
  });
}

export function holidayCalendarLabel(calendar: HolidayCalendar | undefined): string {
  if (calendar === 'kr') return 'Korea public holidays';
  if (calendar === 'tw') return 'Taiwan public holidays';
  if (calendar === 'kr-tw') return 'Korea + Taiwan public holidays';
  return 'No automatic holidays';
}
