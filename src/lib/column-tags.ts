/**
 * Column `tags` (markdown frontmatter or CMS `frontmatter.tags`) as clean,
 * comparable ids. Client-safe (no `fs`).
 *
 * Only arrays count: a bare string, object or number yields `[]` rather than
 * being split or guessed at. Each entry must be a string; it is NFKC-folded,
 * stripped of control characters, whitespace-collapsed, trimmed and lowercased.
 * Overlong entries are dropped, not truncated, so a truncated value can never
 * turn into a recognized tag.
 */
export const COLUMN_TAG_MAX_LENGTH = 64;
export const COLUMN_TAG_MAX_COUNT = 32;

export function normalizeColumnTags(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const tags: string[] = [];
  for (const item of raw.slice(0, COLUMN_TAG_MAX_COUNT * 4)) {
    if (typeof item !== 'string') continue;
    const tag = item.normalize('NFKC').replace(/\p{Cc}+/gu, (match) => (/\s/.test(match) ? ' ' : ''))
      .replace(/\s+/g, ' ').trim().toLowerCase();
    if (!tag || tag.length > COLUMN_TAG_MAX_LENGTH || tags.includes(tag)) continue;
    tags.push(tag);
    if (tags.length >= COLUMN_TAG_MAX_COUNT) break;
  }
  return tags;
}
