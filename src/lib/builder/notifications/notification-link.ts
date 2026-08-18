const MAX_NOTIFICATION_LINK_LENGTH = 500;
const CONTROL_CHARACTER_PATTERN = /[\u0000-\u001f\u007f-\u009f]/;

function isSafeRootRelativePath(value: string): boolean {
  if (!value.startsWith('/') || value.startsWith('//')) return false;
  if (value.includes('\\') || CONTROL_CHARACTER_PATTERN.test(value)) return false;

  try {
    const base = new URL('https://notification-link.invalid');
    const parsed = new URL(value, base);
    return parsed.origin === base.origin;
  } catch {
    return false;
  }
}

/**
 * Keeps notification navigation on the current site.
 *
 * The original value is returned so legitimate encoded query strings and
 * fragments are preserved. Repeated decoding is validation-only and catches
 * encoded or double-encoded protocol-relative/backslash/control bypasses.
 */
export function sanitizeNotificationLink(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  if (!value || value.length > MAX_NOTIFICATION_LINK_LENGTH || value.trim() !== value) {
    return null;
  }

  let decoded = value;
  for (let pass = 0; pass <= MAX_NOTIFICATION_LINK_LENGTH; pass += 1) {
    if (!isSafeRootRelativePath(decoded)) return null;
    if (!decoded.includes('%')) return value;

    let next: string;
    try {
      next = decodeURIComponent(decoded);
    } catch {
      return null;
    }
    if (next === decoded) return value;
    decoded = next;
  }

  return null;
}
