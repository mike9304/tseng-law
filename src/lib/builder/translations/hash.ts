import { createHash } from 'crypto';

export function normalizeTranslationSourceText(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

export function createTranslationSourceHash(value: string): string {
  return createHash('sha256').update(normalizeTranslationSourceText(value)).digest('hex');
}
