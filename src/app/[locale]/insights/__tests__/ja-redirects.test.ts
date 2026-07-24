import { beforeEach, describe, expect, it, vi } from 'vitest';

const navigationMocks = vi.hoisted(() => ({
  notFound: vi.fn((): never => {
    throw new Error('not-found');
  }),
  permanentRedirect: vi.fn((path: string): never => {
    throw new Error(`permanent-redirect:${path}`);
  }),
}));

vi.mock('next/navigation', () => ({
  notFound: navigationMocks.notFound,
  permanentRedirect: navigationMocks.permanentRedirect,
}));

import InsightDetailRedirect, { generateStaticParams } from '../[slug]/page';
import InsightsPage from '../page';

describe('insights locale redirects', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each([
    ['ko', '/ko/columns'],
    ['zh-hant', '/zh-hant/columns'],
    ['en', '/en/columns'],
    ['ja', '/ja/columns'],
  ] as const)('permanently redirects the %s list alias', (locale, destination) => {
    expect(() => InsightsPage({ params: { locale } })).toThrow(
      `permanent-redirect:${destination}`,
    );
    expect(navigationMocks.permanentRedirect).toHaveBeenCalledWith(destination);
  });

  it('permanently redirects a Japanese canonical detail path', () => {
    const slug = 'taiwan-gym-injury-lawsuit';

    expect(() => InsightDetailRedirect({ params: { locale: 'ja', slug } })).toThrow(
      `permanent-redirect:/ja/columns/${slug}`,
    );
    expect(navigationMocks.permanentRedirect).toHaveBeenCalledWith(
      `/ja/columns/${slug}`,
    );
  });

  it('preserves alias-to-canonical slug resolution for Japanese details', () => {
    expect(() =>
      InsightDetailRedirect({ params: { locale: 'ja', slug: 'gym-injury-lawsuit' } }),
    ).toThrow('permanent-redirect:/ja/columns/taiwan-gym-injury-lawsuit');
    expect(navigationMocks.permanentRedirect).toHaveBeenCalledWith(
      '/ja/columns/taiwan-gym-injury-lawsuit',
    );
  });

  it('generates Japanese detail params while retaining the existing locales', () => {
    const params = generateStaticParams();
    const canonicalSlug = 'taiwan-gym-injury-lawsuit';

    expect(params).toEqual(
      expect.arrayContaining(
        ['ko', 'zh-hant', 'en', 'ja'].map((locale) => ({
          locale,
          slug: canonicalSlug,
        })),
      ),
    );
  });

  it('returns not found for a slug absent from the Japanese corpus', () => {
    expect(() =>
      InsightDetailRedirect({ params: { locale: 'ja', slug: 'missing-ja-post' } }),
    ).toThrow('not-found');
    expect(navigationMocks.notFound).toHaveBeenCalledOnce();
    expect(navigationMocks.permanentRedirect).not.toHaveBeenCalled();
  });
});
