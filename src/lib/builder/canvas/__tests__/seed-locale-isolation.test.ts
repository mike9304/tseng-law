import { afterEach, describe, expect, it } from 'vitest';
import { mkdtemp, rm } from 'fs/promises';
import os from 'os';
import path from 'path';
import { seedSitePages } from '../seed-pages';
import { readSiteDocument } from '@/lib/builder/site/persistence';
import { matchesStandardPageSlugForLocale } from '@/lib/builder/site/standard-pages';
import { locales } from '@/lib/locales';

describe('seedSitePages locale isolation', () => {
  const previousRoot = process.env.BUILDER_SITE_ROOT;
  const previousBackend = process.env.BUILDER_SITE_BACKEND;
  let tempRoot = '';

  afterEach(async () => {
    if (previousRoot === undefined) delete process.env.BUILDER_SITE_ROOT;
    else process.env.BUILDER_SITE_ROOT = previousRoot;
    if (previousBackend === undefined) delete process.env.BUILDER_SITE_BACKEND;
    else process.env.BUILDER_SITE_BACKEND = previousBackend;
    if (tempRoot) await rm(tempRoot, { recursive: true, force: true });
  });

  it('seeds ko, zh-hant, and en homes into one isolated site without clobbering each other', async () => {
    // Full per-locale page seed writes many canvases; keep this above the default 5s.
    tempRoot = await mkdtemp(path.join(os.tmpdir(), 'builder-locale-seed-'));
    process.env.BUILDER_SITE_ROOT = tempRoot;
    process.env.BUILDER_SITE_BACKEND = 'local';
    const siteId = 'locale-isolation-site';

    for (const locale of locales) {
      await seedSitePages(siteId, locale);
    }

    const site = await readSiteDocument(siteId, 'ko');
    const homes = locales.map((locale) => {
      const page = site.pages.find((candidate) => (
        matchesStandardPageSlugForLocale(candidate, locale, '')
      ));
      return { locale, pageId: page?.pageId, pageLocale: page?.locale };
    });

    expect(homes.every((home) => Boolean(home.pageId))).toBe(true);
    expect(new Set(homes.map((home) => home.pageId)).size).toBe(3);
    expect(homes.map((home) => home.pageLocale)).toEqual(['ko', 'zh-hant', 'en']);
  }, 60_000);
});
