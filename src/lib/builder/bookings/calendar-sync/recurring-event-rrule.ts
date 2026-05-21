/**
 * F77 Booking calendar sync depth — recurring event RRULE builder.
 *
 * Translates a Bookings-flavored recurrence configuration into an
 * RFC 5545 RRULE string suitable for Google/Outlook calendar export.
 *
 * Intentionally narrow: supports weekly (incl. biweekly), monthly by
 * day-of-month, and monthly by ordinal weekday — the shapes actually
 * exposed by the Bookings admin/public APIs. No EXDATE/BYSETPOS.
 *
 * Pure functions only. No I/O. No external deps.
 */

import type { DayOfWeek } from '../types';

export type RecurringFrequency = 'weekly' | 'biweekly' | 'monthly';

export interface MonthlyByDayOfMonth {
  kind: 'byDayOfMonth';
  /** 1..31 — day-of-month. */
  dayOfMonth: number;
}

export interface MonthlyByOrdinalWeekday {
  kind: 'byOrdinalWeekday';
  /** 1..5 or -1 for last. */
  ordinal: number;
  weekday: DayOfWeek;
}

export type MonthlyPattern = MonthlyByDayOfMonth | MonthlyByOrdinalWeekday;

export interface RecurringEventConfig {
  frequency: RecurringFrequency;
  /** Weekly/biweekly only — at least one weekday must be present. */
  weekdays?: DayOfWeek[];
  /** Monthly only. */
  monthly?: MonthlyPattern;
  /** Inclusive end-date in ISO 8601 (timestamped). Mutually exclusive with `count`. */
  until?: string;
  /** Total number of occurrences. Mutually exclusive with `until`. */
  count?: number;
  /** Optional first-day-of-week, defaults to MO per RFC 5545. */
  weekStart?: DayOfWeek;
}

export interface RruleBuildResult {
  ok: true;
  rrule: string;
}

export interface RruleBuildError {
  ok: false;
  error: string;
}

export type RruleResult = RruleBuildResult | RruleBuildError;

const DAY_CODES: Record<DayOfWeek, string> = {
  monday: 'MO',
  tuesday: 'TU',
  wednesday: 'WE',
  thursday: 'TH',
  friday: 'FR',
  saturday: 'SA',
  sunday: 'SU',
};

const DAY_ORDER: DayOfWeek[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

/**
 * Format an ISO timestamp into RFC 5545 UTC form: `YYYYMMDDTHHMMSSZ`.
 * Throws on invalid input — caller should guard.
 */
export function formatRruleUntil(iso: string): string {
  const ms = Date.parse(iso);
  if (!Number.isFinite(ms)) {
    throw new Error('Invalid until timestamp');
  }
  const date = new Date(ms);
  const yyyy = date.getUTCFullYear().toString().padStart(4, '0');
  const mm = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const dd = date.getUTCDate().toString().padStart(2, '0');
  const hh = date.getUTCHours().toString().padStart(2, '0');
  const mi = date.getUTCMinutes().toString().padStart(2, '0');
  const ss = date.getUTCSeconds().toString().padStart(2, '0');
  return `${yyyy}${mm}${dd}T${hh}${mi}${ss}Z`;
}

function sortedWeekdayCodes(days: DayOfWeek[]): string {
  const seen = new Set<DayOfWeek>();
  const ordered: DayOfWeek[] = [];
  for (const day of DAY_ORDER) {
    if (days.includes(day) && !seen.has(day)) {
      seen.add(day);
      ordered.push(day);
    }
  }
  return ordered.map((day) => DAY_CODES[day]).join(',');
}

function appendBound(parts: string[], config: RecurringEventConfig): RruleResult | null {
  if (config.until && config.count !== undefined) {
    return { ok: false, error: 'until and count are mutually exclusive' };
  }
  if (config.until) {
    try {
      parts.push(`UNTIL=${formatRruleUntil(config.until)}`);
    } catch {
      return { ok: false, error: 'Invalid until timestamp' };
    }
  } else if (config.count !== undefined) {
    if (!Number.isInteger(config.count) || config.count < 1 || config.count > 999) {
      return { ok: false, error: 'count must be an integer between 1 and 999' };
    }
    parts.push(`COUNT=${config.count}`);
  }
  return null;
}

function buildWeekly(config: RecurringEventConfig): RruleResult {
  const interval = config.frequency === 'biweekly' ? 2 : 1;
  const weekdays = config.weekdays ?? [];
  if (weekdays.length === 0) {
    return { ok: false, error: 'weekly/biweekly recurrence requires at least one weekday' };
  }
  const parts = ['FREQ=WEEKLY', `INTERVAL=${interval}`, `BYDAY=${sortedWeekdayCodes(weekdays)}`];
  if (config.weekStart) {
    parts.push(`WKST=${DAY_CODES[config.weekStart]}`);
  }
  const bound = appendBound(parts, config);
  if (bound) return bound;
  return { ok: true, rrule: `RRULE:${parts.join(';')}` };
}

function buildMonthly(config: RecurringEventConfig): RruleResult {
  if (!config.monthly) {
    return { ok: false, error: 'monthly recurrence requires a monthly pattern' };
  }
  const parts = ['FREQ=MONTHLY', 'INTERVAL=1'];

  if (config.monthly.kind === 'byDayOfMonth') {
    const day = config.monthly.dayOfMonth;
    if (!Number.isInteger(day) || day < 1 || day > 31) {
      return { ok: false, error: 'dayOfMonth must be an integer between 1 and 31' };
    }
    parts.push(`BYMONTHDAY=${day}`);
  } else {
    const { ordinal, weekday } = config.monthly;
    if (!Number.isInteger(ordinal) || (ordinal !== -1 && (ordinal < 1 || ordinal > 5))) {
      return { ok: false, error: 'ordinal must be 1..5 or -1' };
    }
    parts.push(`BYDAY=${ordinal}${DAY_CODES[weekday]}`);
  }

  if (config.weekStart) {
    parts.push(`WKST=${DAY_CODES[config.weekStart]}`);
  }
  const bound = appendBound(parts, config);
  if (bound) return bound;
  return { ok: true, rrule: `RRULE:${parts.join(';')}` };
}

/**
 * Translate a recurrence configuration into an RFC 5545 RRULE string.
 * Returns `{ ok: false, error }` on invalid input — never throws.
 */
export function buildRecurringEventRrule(config: RecurringEventConfig): RruleResult {
  switch (config.frequency) {
    case 'weekly':
    case 'biweekly':
      return buildWeekly(config);
    case 'monthly':
      return buildMonthly(config);
    default: {
      const never: never = config.frequency;
      return { ok: false, error: `Unsupported frequency: ${String(never)}` };
    }
  }
}

/**
 * Parse a partial JSON-shaped payload into a `RecurringEventConfig`,
 * validating the limited surface we support. Used by the admin route
 * so callers can pass loose JSON. Returns `null` on bad shape.
 */
export function parseRecurringEventConfig(input: unknown): RecurringEventConfig | null {
  if (!input || typeof input !== 'object') return null;
  const raw = input as Record<string, unknown>;

  const frequency = raw.frequency;
  if (frequency !== 'weekly' && frequency !== 'biweekly' && frequency !== 'monthly') {
    return null;
  }

  const config: RecurringEventConfig = { frequency };

  if (Array.isArray(raw.weekdays)) {
    const weekdays = raw.weekdays.filter((day): day is DayOfWeek => (
      typeof day === 'string' && (DAY_ORDER as readonly string[]).includes(day)
    ));
    if (weekdays.length > 0) config.weekdays = weekdays;
  }

  if (raw.monthly && typeof raw.monthly === 'object') {
    const m = raw.monthly as Record<string, unknown>;
    if (m.kind === 'byDayOfMonth' && typeof m.dayOfMonth === 'number') {
      config.monthly = { kind: 'byDayOfMonth', dayOfMonth: m.dayOfMonth };
    } else if (
      m.kind === 'byOrdinalWeekday'
      && typeof m.ordinal === 'number'
      && typeof m.weekday === 'string'
      && (DAY_ORDER as readonly string[]).includes(m.weekday)
    ) {
      config.monthly = {
        kind: 'byOrdinalWeekday',
        ordinal: m.ordinal,
        weekday: m.weekday as DayOfWeek,
      };
    }
  }

  if (typeof raw.until === 'string' && raw.until.length > 0) config.until = raw.until;
  if (typeof raw.count === 'number') config.count = raw.count;
  if (typeof raw.weekStart === 'string' && (DAY_ORDER as readonly string[]).includes(raw.weekStart)) {
    config.weekStart = raw.weekStart as DayOfWeek;
  }

  return config;
}