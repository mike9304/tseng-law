import type { SiteLocale } from '@/lib/locales';

const SAFE_REDIRECT_ORIGIN = 'https://safe-next.invalid';
const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f-\u009f\u2028\u2029]/u;

function hasMalformedUnicode(value: string): boolean {
  try {
    encodeURI(value);
    return false;
  } catch {
    return true;
  }
}

function inspectedRepresentations(value: string): string[] | null {
  const representations = [value];
  let current = value;

  try {
    for (let pass = 0; pass < 2; pass += 1) {
      current = decodeURIComponent(current);
      representations.push(current);
    }
  } catch {
    return null;
  }

  return representations;
}

export function resolveSafeNextPath(locale: SiteLocale, value?: string | string[]): string {
  const fallback = `/${locale}`;
  if (typeof value !== 'string' || value.length === 0) return fallback;

  const representations = inspectedRepresentations(value);
  if (!representations) return fallback;

  for (const representation of representations) {
    const path = representation.split(/[?#]/u, 1)[0];
    if (
      CONTROL_CHARACTERS.test(representation)
      || representation.includes('\uFFFD')
      || hasMalformedUnicode(representation)
      || representation.includes('\\')
      || path.includes('//')
    ) {
      return fallback;
    }
  }

  // Only root-relative paths are accepted. The URL parser below is still the
  // authority for normalization and the final origin/path checks.
  if (!value.startsWith('/') || value.startsWith('//')) return fallback;

  try {
    const parsed = new URL(value, SAFE_REDIRECT_ORIGIN);
    if (parsed.origin !== SAFE_REDIRECT_ORIGIN) return fallback;

    const localeRoot = `/${locale}`;
    if (parsed.pathname !== localeRoot && !parsed.pathname.startsWith(`${localeRoot}/`)) {
      return fallback;
    }

    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return fallback;
  }
}
