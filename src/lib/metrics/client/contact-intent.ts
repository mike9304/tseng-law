import { CONSULTATION_EMAIL } from '@/lib/consultation/public-contact';
import { isContactIntentPath } from '@/lib/metrics/visit-schema';

const MAILTO_SCHEME = /^mailto:/i;
const ALLOWED_MAILTO_QUERY_KEYS = new Set(['subject', 'body']);

type ElementLike = {
  nodeType?: number;
  tagName?: string;
  nodeName?: string;
  href?: unknown;
  parentElement?: ElementLike | null;
  parentNode?: ElementLike | null;
  closest?: (selector: string) => ElementLike | null;
  getAttribute?: (name: string) => string | null;
};

function safeDecodeURIComponent(value: string): string | null {
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}

function readHref(element: ElementLike): string | null {
  if (typeof element.getAttribute === 'function') {
    const attr = element.getAttribute('href') ?? element.getAttribute('xlink:href');
    if (typeof attr === 'string' && attr !== '') return attr;
  }

  const href = element.href;
  if (typeof href === 'string' && href !== '') return href;
  if (href && typeof href === 'object' && 'baseVal' in (href as { baseVal?: unknown })) {
    const baseVal = (href as { baseVal?: unknown }).baseVal;
    if (typeof baseVal === 'string' && baseVal !== '') return baseVal;
  }
  return null;
}

function asElementLike(target: unknown): ElementLike | null {
  if (target == null || typeof target !== 'object') return null;
  const node = target as ElementLike;
  if (node.nodeType === 3) {
    return asElementLike(node.parentElement ?? node.parentNode ?? null);
  }
  return node;
}

function findClosestAnchor(target: unknown): ElementLike | null {
  const element = asElementLike(target);
  if (!element) return null;

  if (typeof element.closest === 'function') {
    try {
      const closest = element.closest('a');
      if (closest) return closest;
    } catch {
      // Fall through to a parent walk when closest() is unavailable or throws.
    }
  }

  let current: ElementLike | null = element;
  while (current) {
    const name = (current.tagName ?? current.nodeName ?? '').toLowerCase();
    if (name === 'a') return current;
    current = current.parentElement ?? null;
  }
  return null;
}

/** Strip query/hash from a runtime path. Does not invent a session identifier. */
export function sanitizePublicPath(path: string): string {
  const cut = path.search(/[?#]/);
  const stripped = (cut === -1 ? path : path.slice(0, cut)).trim();
  return stripped.length > 0 ? stripped : '/';
}

export function toContactIntentPath(path: string | null | undefined): string | null {
  if (typeof path !== 'string' || path.length === 0) return null;
  const sanitized = sanitizePublicPath(path);
  return isContactIntentPath(sanitized) ? sanitized : null;
}

/**
 * True only when href is a mailto: to the official consultation mailbox.
 * Subject/body query keys are allowed; the mailbox itself is never returned.
 */
export function isOfficialConsultationMailtoHref(href: string | null | undefined): boolean {
  if (typeof href !== 'string') return false;

  const trimmed = href.trim();
  const scheme = MAILTO_SCHEME.exec(trimmed);
  if (!scheme) return false;

  const rest = trimmed.slice(scheme[0].length);
  if (rest.startsWith('//')) return false;
  if (rest.includes('#')) return false;

  const queryStart = rest.indexOf('?');
  const toRaw = queryStart === -1 ? rest : rest.slice(0, queryStart);
  const queryRaw = queryStart === -1 ? '' : rest.slice(queryStart + 1);

  const mailbox = safeDecodeURIComponent(toRaw);
  if (mailbox === null) return false;

  const normalized = mailbox.trim().toLowerCase();
  if (normalized === '' || /[,;]/.test(normalized) || /[\s<>]/.test(normalized)) return false;
  if (normalized !== CONSULTATION_EMAIL.toLowerCase()) return false;

  if (queryRaw !== '') {
    const params = new URLSearchParams(queryRaw);
    for (const key of params.keys()) {
      if (!ALLOWED_MAILTO_QUERY_KEYS.has(key.toLowerCase())) return false;
    }
  }

  return true;
}

export function shouldTrackOfficialConsultationMailtoClick(target: unknown): boolean {
  const anchor = findClosestAnchor(target);
  if (!anchor) return false;
  return isOfficialConsultationMailtoHref(readHref(anchor));
}
