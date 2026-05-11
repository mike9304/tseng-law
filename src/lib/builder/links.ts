import { z } from 'zod';

export interface LinkValue {
  href: string;
  target?: '_self' | '_blank';
  rel?: string;
  title?: string;
  ariaLabel?: string;
}

const ALLOW_SCHEMES = ['https:', 'http:', 'mailto:', 'tel:'];
const ALLOW_PREFIXES = ['/', '#', 'lightbox:', 'popup:', 'cookie-consent:'];
const BLOCK_PATTERNS = [
  /^javascript:/i,
  /^vbscript:/i,
  /^data:/i,
  /^\/\//,
  /[\u0000-\u001f\u007f]/,
];

export const linkValueSchema = z.object({
  href: z.string().min(1).refine(isLinkSafe, 'Unsafe URL scheme'),
  target: z.enum(['_self', '_blank']).optional(),
  rel: z.string().max(120).optional(),
  title: z.string().max(200).optional(),
  ariaLabel: z.string().max(200).optional(),
});

export function isLinkSafe(href: string): boolean {
  const value = href.trim();
  if (!value) return false;
  if (BLOCK_PATTERNS.some((pattern) => pattern.test(value))) return false;
  if (ALLOW_PREFIXES.some((prefix) => value.startsWith(prefix))) return true;

  try {
    const url = new URL(value);
    return ALLOW_SCHEMES.includes(url.protocol);
  } catch {
    return false;
  }
}

export function sanitizeLinkValue(input: Partial<LinkValue> | null | undefined): LinkValue | null {
  if (!input?.href) return null;
  if (!isLinkSafe(input.href)) return null;

  const target = input.target === '_blank' ? '_blank' : '_self';
  const rel = target === '_blank' ? ensureNoopenerRel(input.rel) : trimOptional(input.rel);

  return {
    href: input.href.trim(),
    target,
    rel,
    title: trimOptional(input.title),
    ariaLabel: trimOptional(input.ariaLabel),
  };
}

export function describeLinkScheme(
  href: string,
):
  | 'internal'
  | 'anchor'
  | 'lightbox'
  | 'popup'
  | 'cookie-consent'
  | 'mailto'
  | 'tel'
  | 'http'
  | 'invalid' {
  const value = href.trim();
  if (!isLinkSafe(value)) return 'invalid';
  if (value.startsWith('#')) return 'anchor';
  if (value.startsWith('lightbox:')) return 'lightbox';
  if (value.startsWith('popup:')) return 'popup';
  if (value.startsWith('cookie-consent:')) return 'cookie-consent';
  if (value.startsWith('/')) return 'internal';
  if (/^mailto:/i.test(value)) return 'mailto';
  if (/^tel:/i.test(value)) return 'tel';
  return 'http';
}

export function linkValueFromLegacy(input: {
  href?: unknown;
  target?: unknown;
  rel?: unknown;
  title?: unknown;
  ariaLabel?: unknown;
  link?: Partial<LinkValue> | null;
}): LinkValue | null {
  if (input.link?.href) return input.link as LinkValue;
  if (typeof input.href !== 'string' || !input.href.trim()) return null;
  return {
    href: input.href,
    target: input.target === '_blank' ? '_blank' : '_self',
    rel: typeof input.rel === 'string' ? input.rel : undefined,
    title: typeof input.title === 'string' ? input.title : undefined,
    ariaLabel: typeof input.ariaLabel === 'string' ? input.ariaLabel : undefined,
  };
}

function trimOptional(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

function ensureNoopenerRel(value: string | undefined): string {
  const tokens = new Set((value ?? '').split(/\s+/).map((token) => token.trim()).filter(Boolean));
  tokens.add('noopener');
  tokens.add('noreferrer');
  return Array.from(tokens).join(' ');
}
