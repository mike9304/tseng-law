import { beforeEach, describe, expect, it, vi } from 'vitest';
import { generateMetadata } from '../page';
import { resolveLiveRouteSeoDefault } from '@/lib/builder/seo/live-route-defaults';
import { siteContent } from '@/data/site-content';
import type { SiteLocale } from '@/lib/locales';

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

vi.mock('@/components/members/MemberAuthClient', () => ({
  default: () => null,
}));

vi.mock('@/lib/builder/members/current-member', () => ({
  getCurrentSiteMember: vi.fn(),
}));

const locales = ['ko', 'zh-hant', 'en', 'ja'] as const satisfies readonly SiteLocale[];

describe('login generateMetadata (P1-2)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each(locales)(
    'emits noindex,follow robots, a self canonical, and a login-only description for %s',
    async (locale) => {
      const metadata = await generateMetadata({ params: Promise.resolve({ locale }) });
      const robots = metadata.robots;

      expect(robots).toMatchObject({
        index: false,
        follow: true,
        googleBot: {
          index: false,
          follow: true,
        },
      });
      expect(metadata.alternates?.canonical).toBe(`https://tseng-law.com/${locale}/login`);
      expect(typeof metadata.description).toBe('string');
      expect(metadata.description?.trim().length).toBeGreaterThan(0);
      expect(metadata.description).not.toContain('\n');
      expect(metadata.description).not.toBe(siteContent[locale].meta.description);
      if (locale !== 'ja') {
        expect(metadata.description).not.toBe(resolveLiveRouteSeoDefault(locale, '')?.description);
      }
    },
  );

  it('does not reuse the English home description on /en/login', async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ locale: 'en' }) });
    expect(metadata.description).not.toMatch(/expats and foreigners in Taiwan/i);
    expect(metadata.description).not.toMatch(/Taiwan lawyer/i);
    expect(metadata.description).toMatch(/sign in|log in|member/i);
  });
});
