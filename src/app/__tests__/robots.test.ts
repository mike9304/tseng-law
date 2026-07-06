import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_BUILDER_SITE_ID, LEGACY_BUILDER_SITE_ID } from '@/lib/builder/constants';
import type { BuilderSiteDocument } from '@/lib/builder/site/types';
import { createDefaultSiteDocument } from '@/lib/builder/site/types';

type ReadSiteDocument = (siteId: string, locale: string) => Promise<BuilderSiteDocument>;
const readSiteDocumentMock = vi.fn<ReadSiteDocument>();

vi.mock('@/lib/builder/site/persistence', () => ({
  readSiteDocument: (siteId: string, locale: string) => readSiteDocumentMock(siteId, locale),
}));

vi.mock('@/lib/seo', () => ({
  getSiteUrl: () => 'https://tseng-law.example',
}));

describe('robots route — main site resolver', () => {
  beforeEach(() => {
    readSiteDocumentMock.mockReset();
    // Production environment: not preview/dev, no force-disallow.
    delete process.env.VERCEL_ENV;
    delete process.env.ROBOTS_DISALLOW_ALL;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('reads the custom robotsTxt from the primary site (tseng-law-main-site), never the legacy default', async () => {
    const customRobots = [
      'User-agent: *',
      'Disallow: /confidential/',
      'Sitemap: https://tseng-law.example/custom-sitemap.xml',
    ].join('\n');

    readSiteDocumentMock.mockImplementation(async (siteId) => {
      // If the route ever passes the legacy 'default' id we'd be reading the
      // wrong doc — assert here that the resolver is the active main site.
      expect(siteId).toBe(DEFAULT_BUILDER_SITE_ID);
      expect(siteId).not.toBe(LEGACY_BUILDER_SITE_ID);
      const doc = createDefaultSiteDocument('ko', siteId);
      doc.settings = { ...doc.settings, robotsTxt: customRobots };
      return doc;
    });

    const { default: robots } = await import('../robots');
    const result = await robots();

    expect(readSiteDocumentMock).toHaveBeenCalled();
    expect(readSiteDocumentMock.mock.calls[0][0]).toBe(DEFAULT_BUILDER_SITE_ID);
    expect(result).toEqual({
      rules: { userAgent: '*', disallow: '/confidential/' },
      sitemap: ['https://tseng-law.example/custom-sitemap.xml'],
    });
  });

  it('falls back to default disallow rules when the main site has no custom robotsTxt', async () => {
    readSiteDocumentMock.mockImplementation(async (siteId) => {
      expect(siteId).toBe(DEFAULT_BUILDER_SITE_ID);
      const doc = createDefaultSiteDocument('ko', siteId);
      // No settings.robotsTxt set.
      return doc;
    });

    const { default: robots } = await import('../robots');
    const result = await robots();

    expect(readSiteDocumentMock).toHaveBeenCalled();
    const rules = result.rules as { userAgent: string; allow: string; disallow: string[] };
    expect(rules.userAgent).toBe('*');
    expect(rules.allow).toBe('/');
    expect(rules.disallow).toEqual(expect.arrayContaining(['/api/', '/admin-builder', '/admin-consultation']));
    expect(result.sitemap).toBe('https://tseng-law.example/sitemap.xml');
  });
});
