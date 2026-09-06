import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ReviewBoard, { loadPublicReviews, reviewLabels, StarRating } from '../ReviewBoard';
import { siteLocales } from '@/lib/locales';

afterEach(() => vi.unstubAllGlobals());

describe('public review list states', () => {
  it.each(siteLocales)('keeps an empty successful %s list distinct from failed loading', async (locale) => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => [] });
    vi.stubGlobal('fetch', fetchMock);
    await expect(loadPublicReviews(locale)).resolves.toEqual([]);
    expect(fetchMock).toHaveBeenCalledWith(`/api/reviews?locale=${locale}`);
    expect(reviewLabels[locale].loadError).not.toBe(reviewLabels[locale].noReviews);
    expect(reviewLabels[locale].retry).toBeTruthy();
  });

  it.each([
    { ok: false, json: async () => [] },
    { ok: true, json: async () => ({ error: 'unavailable' }) },
  ])('rejects failed and malformed GET responses instead of displaying an empty list', async (response) => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));
    await expect(loadPublicReviews('en')).rejects.toThrow();
  });

  it('preserves network failure for the retry state', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    await expect(loadPublicReviews('ja')).rejects.toThrow('Failed to fetch');
  });

  it.each([
    ['ko', '4점'], ['en', '4 stars'], ['ja', '4つ星'], ['zh-hant', '4 星'],
  ] as const)('exposes one selected localized %s rating without submitting the form', (locale, label) => {
    const html = renderToStaticMarkup(<StarRating locale={locale} value={4} onChange={() => {}} />);
    expect(html).toContain(`role="group" aria-label="${reviewLabels[locale].rating}"`);
    expect(html).toContain(`aria-label="${label}"`);
    expect(html.match(/aria-pressed="true"/g)).toHaveLength(1);
    expect(html.match(/aria-pressed="false"/g)).toHaveLength(4);
    expect(html.match(/type="button"/g)).toHaveLength(5);
  });

  it('presents a published rating as text rather than disabled controls', () => {
    const html = renderToStaticMarkup(<StarRating locale="ja" value={4} readonly />);
    expect(html).toContain('role="img" aria-label="4つ星"');
    expect(html).not.toContain('<button');
  });

  it.each(siteLocales)('preserves %s moderation copy, service values, and form constraints', (locale) => {
    const html = renderToStaticMarkup(<ReviewBoard locale={locale} />);
    expect(html).toContain(reviewLabels[locale].moderationNote);
    expect(html).toContain('minLength="20"');
    expect(html).toContain('maxLength="2000"');
    expect(html).toContain('role="status"');
    for (const option of reviewLabels[locale].serviceOptions) expect(html).toContain(`value="${option.value}"`);
  });
});
