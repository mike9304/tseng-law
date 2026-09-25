import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { attorneyProfiles } from '@/data/attorney-profiles';
import LawyerProfilePage from '../page';

const sourceMocks = vi.hoisted(() => ({
  readBySlug: vi.fn(),
}));

vi.mock('@/lib/builder/lawyers/source', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/builder/lawyers/source')>();
  return {
    ...actual,
    readAttorneyProfileSourceRecordBySlug: sourceMocks.readBySlug,
  };
});

vi.mock('@/lib/builder/dynamic-template-drafts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/builder/dynamic-template-drafts')>();
  return {
    ...actual,
    readBuilderDynamicTemplatePublishedBlockVisibility: vi.fn(async () => null),
  };
});

function makeBuilderProfile(locale: 'ko' | 'zh-hant' | 'en') {
  const profile = attorneyProfiles[locale]['wei-tseng'];
  return {
    ...profile,
    sourceSlug: profile.slug,
    imageAltText: `${profile.name} ${profile.role}`,
    imageFocalPoint: { x: 0.5, y: 0.5 },
  };
}

function parseJsonLd(html: string): Record<string, unknown>[] {
  return [...html.matchAll(/<script type="application\/ld\+json">([^<]+)<\/script>/g)].map(
    (match) => JSON.parse(match[1]) as Record<string, unknown>,
  );
}

async function renderProfile(locale: 'ko' | 'zh-hant' | 'en' | 'ja') {
  const page = await LawyerProfilePage({ params: Promise.resolve({ locale, slug: 'wei-tseng' }) });
  return renderToStaticMarkup(page);
}

describe('attorney profile credential block and Person identity', () => {
  beforeEach(() => {
    sourceMocks.readBySlug.mockReset();
    sourceMocks.readBySlug.mockImplementation(
      async (_siteId: string, locale: 'ko' | 'zh-hant' | 'en') => makeBuilderProfile(locale),
    );
  });

  it('shows the zh-hant credential card linked to the Korean-speaking-lawyer landing', async () => {
    const html = await renderProfile('zh-hant');

    expect(html).toContain('data-attorney-credentials="true"');
    expect(html).toContain('通過最高等級韓國語能力測驗 TOPIK 6');
    expect(html).toContain('駐台北韓國代表部韓文法律服務參考名單律師');
    expect(html).toContain('多次受韓國 SBS 新聞邀請');
    expect(html).toContain('女性台灣執業律師');
    expect(html).toContain('href="/zh-hant/korean-lawyer-in-taiwan"');
    expect(html).toContain('href="https://www.hoveringlaw.com.tw/zh/wei.html"');
  });

  it('publishes the zh-hant ProfilePage Person with gender, BCP-47 languages and credentials', async () => {
    const profilePage = parseJsonLd(await renderProfile('zh-hant')).find(
      (node) => node['@type'] === 'ProfilePage',
    ) as { mainEntity: Record<string, unknown> } | undefined;
    const person = profilePage?.mainEntity;

    expect(person?.['@id']).toBe('https://tseng-law.com/zh-hant/lawyers/wei-tseng#person');
    expect(person?.gender).toBe('Female');
    expect(person?.knowsLanguage).toEqual(['ko', 'zh-Hant', 'ja', 'en']);
    expect((person?.hasCredential as Array<{ name: string }>).map((item) => item.name)).toEqual([
      'TOPIK 6',
      'JLPT N1',
    ]);
    expect(person?.description).toBe(attorneyProfiles['zh-hant']['wei-tseng'].description);
  });

  it.each(['ko', 'en', 'ja'] as const)('keeps the %s profile free of the zh-hant credential card', async (locale) => {
    const html = await renderProfile(locale);
    const profilePage = parseJsonLd(html).find((node) => node['@type'] === 'ProfilePage') as
      | { mainEntity: Record<string, unknown> }
      | undefined;

    expect(html).not.toContain('data-attorney-credentials');
    expect(profilePage?.mainEntity.gender).toBe('Female');
    expect(profilePage?.mainEntity.hasCredential).toBeUndefined();
    expect(profilePage?.mainEntity['@id']).toBe(`https://tseng-law.com/${locale}/lawyers/wei-tseng#person`);
  });
});
