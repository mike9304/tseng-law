import { describe, expect, it } from 'vitest';
import { isValidBuilderSlug, normalizeSeoSlugInput } from '@/lib/builder/seo/validation';

describe('builder SEO slug validation', () => {
  it('accepts slash-separated nested page slugs', () => {
    expect(isValidBuilderSlug('services/investment')).toBe(true);
    expect(isValidBuilderSlug('services/investment-guides')).toBe(true);
    expect(isValidBuilderSlug('columns/2026-updates')).toBe(true);
    expect(isValidBuilderSlug('columns/taiwan-company-establishment-basics')).toBe(true);
  });

  it('rejects unsafe nested slug shapes', () => {
    expect(isValidBuilderSlug('')).toBe(false);
    expect(isValidBuilderSlug('Services/Investment')).toBe(false);
    expect(isValidBuilderSlug('services//investment')).toBe(false);
    expect(isValidBuilderSlug('services/investment_guide')).toBe(false);
    expect(isValidBuilderSlug('services/.well-known')).toBe(false);
    expect(isValidBuilderSlug('services/investment/')).toBe(false);
  });

  it('normalizes leading and trailing slashes without hiding empty segments', () => {
    expect(normalizeSeoSlugInput('/services/investment/')).toBe('services/investment');
    expect(normalizeSeoSlugInput(' /columns/taiwan-guide/ ')).toBe('columns/taiwan-guide');
    expect(normalizeSeoSlugInput('services//investment')).toBe('services//investment');
  });
});
