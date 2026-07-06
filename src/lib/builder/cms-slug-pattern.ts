import { BuilderCmsValidationError } from '@/lib/builder/cms-validation-error';
import type { BuilderCmsCollection, BuilderCmsRecord } from '@/lib/builder/cms-types';
import { listBuilderCmsSlugSourceFields } from '@/lib/builder/cms-slug-source-fields';

const SLUG_PATTERN_TOKEN = /\{\{\s*([A-Za-z][A-Za-z0-9_]{0,62})\s*\}\}/g;
const MAX_SLUG_PATTERN_LENGTH = 160;

export function normalizeOptionalSlugPattern(
  input: unknown,
  collection: Pick<BuilderCmsCollection, 'fields'>,
  slugFieldKey: string,
): string | undefined {
  if (input === undefined || input === null || input === '') return undefined;
  if (typeof input !== 'string') {
    throw new BuilderCmsValidationError('slugPattern must be a string.');
  }
  const pattern = input.trim();
  if (!pattern) return undefined;
  if (pattern.length > MAX_SLUG_PATTERN_LENGTH) {
    throw new BuilderCmsValidationError(`slugPattern must be ${MAX_SLUG_PATTERN_LENGTH} characters or less.`);
  }
  const sourceFieldKeys = new Set(
    listBuilderCmsSlugSourceFields(collection, slugFieldKey).map((field) => field.key),
  );
  let hasToken = false;
  const normalized = pattern.replace(SLUG_PATTERN_TOKEN, (...matches: string[]) => {
    const fieldKey = matches[1] ?? '';
    hasToken = true;
    if (!sourceFieldKeys.has(fieldKey)) {
      throw new BuilderCmsValidationError(`Unknown slug pattern field: ${fieldKey}`);
    }
    return `{{${fieldKey}}}`;
  });
  if (!hasToken) {
    throw new BuilderCmsValidationError('slugPattern must include at least one {{fieldKey}} token.');
  }
  if (normalized.replace(SLUG_PATTERN_TOKEN, '').includes('{')
    || normalized.replace(SLUG_PATTERN_TOKEN, '').includes('}')) {
    throw new BuilderCmsValidationError('slugPattern tokens must use {{fieldKey}} syntax.');
  }
  return normalized;
}

export function resolveSlugPatternBase(record: BuilderCmsRecord, pattern: string): string {
  return resolveSlugPatternPreview(record.fields, pattern) ?? '';
}

export function resolveSlugPatternPreview(
  fields: Readonly<Record<string, unknown>>,
  pattern: string,
): string | null {
  if (!hasSlugPatternToken(pattern)) return null;
  const chunks: string[] = [];
  let cursor = 0;
  for (const match of pattern.matchAll(SLUG_PATTERN_TOKEN)) {
    const token = match[0];
    const fieldKey = match[1];
    if (fieldKey === undefined) continue;
    chunks.push(pattern.slice(cursor, match.index));
    chunks.push(String(fields[fieldKey] ?? ''));
    cursor = match.index + token.length;
  }
  chunks.push(pattern.slice(cursor));
  const slug = slugifyCmsSlugBase(chunks.join(''));
  return slug || null;
}

export function appendSlugPatternToken(pattern: string, fieldKey: string): string {
  const token = `{{${fieldKey}}}`;
  const currentPattern = pattern.trim();
  if (!currentPattern) return token;
  if (currentPattern.includes(token)) return currentPattern;
  return `${currentPattern.replace(/-+$/g, '')}-${token}`;
}

export function slugifyCmsSlugBase(input: unknown): string {
  const slug = String(input ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return isValidCmsRouteSlug(slug) ? slug : '';
}

export function isValidCmsRouteSlug(input: string): boolean {
  return /^[a-z][a-z0-9-]{1,62}$/.test(input);
}

function hasSlugPatternToken(pattern: string): boolean {
  for (const _match of pattern.matchAll(SLUG_PATTERN_TOKEN)) {
    return true;
  }
  return false;
}
