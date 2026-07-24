/**
 * Server-side defense-in-depth sanitizer for column bodyHtml.
 * Idempotent: re-running on its own output yields the same string for
 * normal TipTap fixtures (modulo insignificant whitespace between tags).
 */

const ALLOWED_TAGS = new Set([
  'p',
  'h1',
  'h2',
  'h3',
  'strong',
  'b',
  'em',
  'i',
  'u',
  's',
  'blockquote',
  'pre',
  'code',
  'ul',
  'ol',
  'li',
  'a',
  'img',
  'hr',
  'br',
  'span',
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
]);

const VOID_TAGS = new Set(['br', 'hr', 'img']);

const ALLOWED_CLASS = /^ce-[a-z0-9-]+$/;

const SAFE_REL_PARTS = new Set(['noopener', 'noreferrer', 'nofollow', 'ugc', 'sponsored']);

export interface SanitizeBodyHtmlOptions {
  /** Extra allowed image hostnames (lowercase). */
  imageHosts?: string[];
}

function decodeBasicEntities(value: string): string {
  return value
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/gi, '&');
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeText(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function parseAttrs(raw: string): Array<{ name: string; value: string }> {
  const attrs: Array<{ name: string; value: string }> = [];
  const re = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(raw)) !== null) {
    const name = match[1].toLowerCase();
    if (!name || name === '/') continue;
    const value = match[2] ?? match[3] ?? match[4] ?? '';
    attrs.push({ name, value: decodeBasicEntities(value) });
  }
  return attrs;
}

function isAllowedHref(href: string): boolean {
  const trimmed = href.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith('#') || trimmed.startsWith('/')) return true;
  try {
    const url = new URL(trimmed);
    return url.protocol === 'http:' || url.protocol === 'https:' || url.protocol === 'mailto:';
  } catch {
    return false;
  }
}

function isAllowedImageSrc(src: string, imageHosts: string[]): boolean {
  const trimmed = src.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith('/')) {
    // Block protocol-relative and javascript-like tricks.
    if (trimmed.startsWith('//')) return false;
    return true;
  }
  try {
    const url = new URL(trimmed);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return false;
    const host = url.hostname.toLowerCase();
    if (host.endsWith('.public.blob.vercel-storage.com')) return true;
    if (host === 'localhost' || host === '127.0.0.1') return true;
    if (imageHosts.includes(host)) return true;
    // Same-site-ish public image hosts used by the firm site.
    if (host === 'tseng-law.com' || host.endsWith('.tseng-law.com')) return true;
    return false;
  } catch {
    return false;
  }
}

function sanitizeClass(value: string): string | null {
  const parts = value
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .filter((part) => ALLOWED_CLASS.test(part));
  return parts.length > 0 ? parts.join(' ') : null;
}

function sanitizeRel(value: string): string {
  const parts = value
    .split(/\s+/)
    .map((part) => part.trim().toLowerCase())
    .filter((part) => SAFE_REL_PARTS.has(part));
  if (!parts.includes('noopener')) parts.push('noopener');
  if (!parts.includes('noreferrer')) parts.push('noreferrer');
  return parts.join(' ');
}

function filterAttrs(
  tag: string,
  attrs: Array<{ name: string; value: string }>,
  imageHosts: string[],
): Array<{ name: string; value: string }> {
  const out: Array<{ name: string; value: string }> = [];
  for (const { name, value } of attrs) {
    if (name.startsWith('on')) continue;
    if (name === 'style' || name === 'srcset') continue;
    if (name === 'class') {
      const safe = sanitizeClass(value);
      if (safe) out.push({ name: 'class', value: safe });
      continue;
    }
    if (tag === 'a') {
      if (name === 'href' && isAllowedHref(value)) {
        out.push({ name: 'href', value: value.trim() });
      } else if (name === 'title') {
        out.push({ name: 'title', value });
      } else if (name === 'target' && (value === '_blank' || value === '_self')) {
        out.push({ name: 'target', value });
      } else if (name === 'rel') {
        out.push({ name: 'rel', value: sanitizeRel(value) });
      }
      continue;
    }
    if (tag === 'img') {
      if (name === 'src' && isAllowedImageSrc(value, imageHosts)) {
        out.push({ name: 'src', value: value.trim() });
      } else if (name === 'alt' || name === 'title') {
        out.push({ name, value });
      }
      continue;
    }
    if ((tag === 'th' || tag === 'td') && (name === 'colspan' || name === 'rowspan')) {
      if (/^\d{1,2}$/.test(value)) out.push({ name, value });
      continue;
    }
  }

  if (tag === 'a') {
    const hasHref = out.some((attr) => attr.name === 'href');
    if (!hasHref) return [];
    if (!out.some((attr) => attr.name === 'rel')) {
      out.push({ name: 'rel', value: 'noopener noreferrer nofollow' });
    }
  }
  if (tag === 'img') {
    const hasSrc = out.some((attr) => attr.name === 'src');
    if (!hasSrc) return [];
    if (!out.some((attr) => attr.name === 'alt')) {
      out.push({ name: 'alt', value: '' });
    }
  }
  return out;
}

function serializeOpenTag(tag: string, attrs: Array<{ name: string; value: string }>, selfClosing: boolean): string {
  const attrText = attrs.map((attr) => ` ${attr.name}="${escapeAttr(attr.value)}"`).join('');
  if (selfClosing) return `<${tag}${attrText}>`;
  return `<${tag}${attrText}>`;
}

/**
 * Sanitize HTML by rewriting an allowlisted subset of tags/attrs.
 * Disallowed tags drop their wrappers but keep (recursively sanitized) children,
 * except script/style/iframe/object/form/svg which drop entirely.
 */
export function sanitizeColumnBodyHtml(
  input: string,
  options: SanitizeBodyHtmlOptions = {},
): string {
  if (!input) return '';
  if (input.length > 1_000_000) {
    return sanitizeColumnBodyHtml(input.slice(0, 1_000_000), options);
  }

  const imageHosts = (options.imageHosts ?? []).map((host) => host.toLowerCase());
  const DROP_WITH_CHILDREN = new Set([
    'script',
    'style',
    'iframe',
    'object',
    'embed',
    'form',
    'svg',
    'math',
    'link',
    'meta',
    'base',
    'foreignobject',
  ]);

  let i = 0;
  const html = input;
  let out = '';

  function walkUntil(endTag: string | null): string {
    let local = '';
    while (i < html.length) {
      if (html[i] !== '<') {
        const next = html.indexOf('<', i);
        const chunk = next === -1 ? html.slice(i) : html.slice(i, next);
        local += escapeText(chunk);
        i = next === -1 ? html.length : next;
        continue;
      }

      // Comment
      if (html.startsWith('<!--', i)) {
        const end = html.indexOf('-->', i + 4);
        i = end === -1 ? html.length : end + 3;
        continue;
      }

      // Closing tag
      const closeMatch = /^<\/\s*([a-zA-Z0-9:-]+)\s*>/.exec(html.slice(i));
      if (closeMatch) {
        const name = closeMatch[1].toLowerCase();
        i += closeMatch[0].length;
        if (endTag && name === endTag) {
          return local;
        }
        // Stray closing tags ignored.
        continue;
      }

      // Opening / void tag
      const openMatch = /^<\s*([a-zA-Z0-9:-]+)([^>]*)>/.exec(html.slice(i));
      if (!openMatch) {
        // Malformed residual: escape and advance one char.
        local += escapeText(html[i]);
        i += 1;
        continue;
      }

      const rawTag = openMatch[1].toLowerCase();
      const rawAttrs = openMatch[2] ?? '';
      const selfClosing = /\/\s*$/.test(rawAttrs) || VOID_TAGS.has(rawTag);
      i += openMatch[0].length;

      if (DROP_WITH_CHILDREN.has(rawTag)) {
        if (!selfClosing && !VOID_TAGS.has(rawTag)) {
          // Consume until matching close, discarding content.
          walkUntil(rawTag);
        }
        continue;
      }

      if (!ALLOWED_TAGS.has(rawTag)) {
        if (!selfClosing && !VOID_TAGS.has(rawTag)) {
          local += walkUntil(rawTag);
        }
        continue;
      }

      const attrs = filterAttrs(rawTag, parseAttrs(rawAttrs), imageHosts);
      if (rawTag === 'a' && attrs.length === 0) {
        // Drop dangerous anchors but keep text children.
        if (!selfClosing) local += walkUntil(rawTag);
        continue;
      }
      if (rawTag === 'img' && attrs.length === 0) {
        continue;
      }

      if (VOID_TAGS.has(rawTag) || selfClosing) {
        local += serializeOpenTag(rawTag, attrs, true);
        continue;
      }

      const inner = walkUntil(rawTag);
      local += `${serializeOpenTag(rawTag, attrs, false)}${inner}</${rawTag}>`;
    }
    return local;
  }

  out = walkUntil(null);
  return out;
}
