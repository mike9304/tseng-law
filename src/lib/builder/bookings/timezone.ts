const DEFAULT_BOOKING_TIMEZONE = 'Asia/Taipei';

function partsFor(instantMs: number, timezone: string) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  });
  const parts = Object.fromEntries(
    formatter.formatToParts(new Date(instantMs)).map((part) => [part.type, part.value]),
  );
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    second: Number(parts.second),
  };
}

export function isValidBookingTimezone(timezone: string | undefined | null): timezone is string {
  if (!timezone) return false;
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: timezone }).format(new Date());
    return true;
  } catch {
    return false;
  }
}

export function normalizeBookingTimezone(timezone: string | undefined | null): string {
  return isValidBookingTimezone(timezone) ? timezone : DEFAULT_BOOKING_TIMEZONE;
}

export function localDateTimeToUtcIso(date: string, time: string, timezone: string): string {
  const safeTimezone = normalizeBookingTimezone(timezone);
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  const targetLocalMs = Date.UTC(year, (month || 1) - 1, day || 1, hour || 0, minute || 0, 0);
  let utcMs = targetLocalMs;

  for (let index = 0; index < 4; index += 1) {
    const localParts = partsFor(utcMs, safeTimezone);
    const representedLocalMs = Date.UTC(
      localParts.year,
      localParts.month - 1,
      localParts.day,
      localParts.hour,
      localParts.minute,
      localParts.second,
    );
    const delta = representedLocalMs - targetLocalMs;
    if (delta === 0) break;
    utcMs -= delta;
  }

  return new Date(utcMs).toISOString();
}

export function dateInTimezone(iso: string, timezone: string): string {
  const safeTimezone = normalizeBookingTimezone(timezone);
  const parts = partsFor(Date.parse(iso), safeTimezone);
  return [
    String(parts.year).padStart(4, '0'),
    String(parts.month).padStart(2, '0'),
    String(parts.day).padStart(2, '0'),
  ].join('-');
}

export function formatDateTimeInTimezone(
  iso: string,
  locale: Intl.LocalesArgument,
  timezone: string | undefined | null,
): string {
  return new Intl.DateTimeFormat(locale, {
    timeZone: normalizeBookingTimezone(timezone),
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso));
}

export function formatTimeInTimezone(
  iso: string,
  locale: Intl.LocalesArgument,
  timezone: string | undefined | null,
): string {
  return new Intl.DateTimeFormat(locale, {
    timeZone: normalizeBookingTimezone(timezone),
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}
