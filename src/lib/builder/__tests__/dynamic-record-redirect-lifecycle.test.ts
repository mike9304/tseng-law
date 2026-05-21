import { describe, expect, it } from 'vitest';
import {
  computeRecordSlugRedirectInput,
  getCollectionBasePath,
} from '@/lib/builder/dynamic-record-redirect-lifecycle';

describe('computeRecordSlugRedirectInput', () => {
  it('produces a 301 redirect for a valid columns slug rename', () => {
    const result = computeRecordSlugRedirectInput({
      locale: 'ko',
      collectionId: 'columns',
      oldSlug: 'taiwan-old-basics',
      newSlug: 'taiwan-new-basics',
    });

    expect(result.redirect).toEqual({
      from: '/ko/columns/taiwan-old-basics',
      to: '/ko/columns/taiwan-new-basics',
      type: 301,
      isActive: true,
      note: 'auto:record-slug-rename(columns,taiwan-old-basics→taiwan-new-basics)',
    });
    expect(result.skipReason).toBeUndefined();
  });

  it('maps service-areas to the /services base path', () => {
    const result = computeRecordSlugRedirectInput({
      locale: 'zh-hant',
      collectionId: 'service-areas',
      oldSlug: 'general-counsel',
      newSlug: 'general-counsel-new',
    });

    expect(result.redirect?.from).toBe('/zh-hant/services/general-counsel');
    expect(result.redirect?.to).toBe('/zh-hant/services/general-counsel-new');
  });

  it('maps attorney-profiles to the /lawyers base path', () => {
    const result = computeRecordSlugRedirectInput({
      locale: 'en',
      collectionId: 'attorney-profiles',
      oldSlug: 'old-name',
      newSlug: 'new-name',
    });

    expect(result.redirect?.from).toBe('/en/lawyers/old-name');
    expect(result.redirect?.to).toBe('/en/lawyers/new-name');
  });

  it('skips when old and new slug match', () => {
    const result = computeRecordSlugRedirectInput({
      locale: 'ko',
      collectionId: 'columns',
      oldSlug: 'same',
      newSlug: 'same',
    });

    expect(result.redirect).toBeNull();
    expect(result.skipReason).toBe('same-slug');
  });

  it('skips when either slug is blank', () => {
    const result = computeRecordSlugRedirectInput({
      locale: 'ko',
      collectionId: 'columns',
      oldSlug: '',
      newSlug: 'taiwan-basics',
    });

    expect(result.redirect).toBeNull();
    expect(result.skipReason).toBe('invalid-slug');
  });

  it('rejects slugs that contain a slash', () => {
    const result = computeRecordSlugRedirectInput({
      locale: 'ko',
      collectionId: 'columns',
      oldSlug: 'taiwan/x',
      newSlug: 'taiwan-basics',
    });

    expect(result.redirect).toBeNull();
    expect(result.skipReason).toBe('invalid-slug');
  });

  it('rejects slugs with whitespace', () => {
    const result = computeRecordSlugRedirectInput({
      locale: 'ko',
      collectionId: 'columns',
      oldSlug: 'taiwan basics',
      newSlug: 'taiwan-basics',
    });

    expect(result.redirect).toBeNull();
    expect(result.skipReason).toBe('invalid-slug');
  });

  it('rejects slugs longer than 160 chars', () => {
    const longSlug = 'a'.repeat(161);
    const result = computeRecordSlugRedirectInput({
      locale: 'ko',
      collectionId: 'columns',
      oldSlug: longSlug,
      newSlug: 'short',
    });

    expect(result.redirect).toBeNull();
    expect(result.skipReason).toBe('invalid-slug');
  });

  it('trims leading and trailing slashes before comparing', () => {
    const result = computeRecordSlugRedirectInput({
      locale: 'ko',
      collectionId: 'columns',
      oldSlug: '/old-slug/',
      newSlug: 'new-slug',
    });

    expect(result.redirect?.from).toBe('/ko/columns/old-slug');
    expect(result.redirect?.to).toBe('/ko/columns/new-slug');
  });

  it('rejects unknown collection ids', () => {
    const result = computeRecordSlugRedirectInput({
      locale: 'ko',
      // @ts-expect-error — intentional unknown id to exercise the guard
      collectionId: 'unknown',
      oldSlug: 'a',
      newSlug: 'b',
    });

    expect(result.redirect).toBeNull();
    expect(result.skipReason).toBe('unknown-collection');
  });

  it('rejects unknown locales', () => {
    const result = computeRecordSlugRedirectInput({
      // @ts-expect-error — intentional unknown locale
      locale: 'fr',
      collectionId: 'columns',
      oldSlug: 'a',
      newSlug: 'b',
    });

    expect(result.redirect).toBeNull();
    expect(result.skipReason).toBe('invalid-locale');
  });

  it('produces distinct redirects per locale for the same collection', () => {
    const ko = computeRecordSlugRedirectInput({
      locale: 'ko',
      collectionId: 'columns',
      oldSlug: 'old',
      newSlug: 'new',
    });
    const en = computeRecordSlugRedirectInput({
      locale: 'en',
      collectionId: 'columns',
      oldSlug: 'old',
      newSlug: 'new',
    });

    expect(ko.redirect?.from).toBe('/ko/columns/old');
    expect(en.redirect?.from).toBe('/en/columns/old');
    expect(ko.redirect?.from).not.toBe(en.redirect?.from);
  });

  it('marks the redirect as 301 (permanent)', () => {
    const result = computeRecordSlugRedirectInput({
      locale: 'ko',
      collectionId: 'columns',
      oldSlug: 'old',
      newSlug: 'new',
    });
    expect(result.redirect?.type).toBe(301);
    expect(result.redirect?.isActive).toBe(true);
  });

  it('includes a traceable note for audit logs', () => {
    const result = computeRecordSlugRedirectInput({
      locale: 'ko',
      collectionId: 'columns',
      oldSlug: 'old',
      newSlug: 'new',
    });
    expect(result.redirect?.note).toContain('auto:record-slug-rename');
    expect(result.redirect?.note).toContain('columns');
    expect(result.redirect?.note).toContain('old');
    expect(result.redirect?.note).toContain('new');
  });
});

describe('getCollectionBasePath', () => {
  it('returns the locale-prefix-agnostic base path for each known collection', () => {
    expect(getCollectionBasePath('columns')).toBe('columns');
    expect(getCollectionBasePath('service-areas')).toBe('services');
    expect(getCollectionBasePath('attorney-profiles')).toBe('lawyers');
  });

  it('returns null for unknown collections', () => {
    // @ts-expect-error — unknown collection id
    expect(getCollectionBasePath('not-a-collection')).toBeNull();
  });
});