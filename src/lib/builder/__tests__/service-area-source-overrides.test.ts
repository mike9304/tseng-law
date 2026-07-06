import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { BuilderSiteDocument } from '@/lib/builder/site/types';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import {
  BuilderServiceAreaSourceError,
  mergeServiceAreaSourceRecords,
  readServiceAreaSourceRecordBySlug,
  resetServiceAreaSourceRecordOverride,
  updateServiceAreaSourceRecord,
} from '@/lib/builder/services/source';

vi.mock('@/lib/builder/site/persistence', () => ({
  readSiteDocument: vi.fn(),
  writeSiteDocument: vi.fn(),
}));

const baseSite = (): BuilderSiteDocument => ({
  version: 1,
  siteId: 'test-site',
  name: 'Test',
  locale: 'ko',
  navigation: [],
  theme: {} as BuilderSiteDocument['theme'],
  pages: [],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
});

describe('service area source overrides', () => {
  beforeEach(() => {
    vi.mocked(readSiteDocument).mockReset();
    vi.mocked(writeSiteDocument).mockReset();
  });

  it('merges service-area slug and localized text overrides onto static records', () => {
    const records = mergeServiceAreaSourceRecords([
      {
        sourceSlug: 'civil',
        slug: 'civil-litigation',
        title: { ko: '민사 테스트' },
      },
    ]);

    const civil = records.find((record) => record.sourceSlug === 'civil');
    expect(civil?.slug).toBe('civil-litigation');
    expect(civil?.title.ko).toBe('민사 테스트');
    expect(civil?.title.en).toBe('Civil Litigation & Damages');
  });

  it('writes a site-level override for service source record edits', async () => {
    const site = baseSite();
    vi.mocked(readSiteDocument).mockResolvedValue(site);

    const record = await updateServiceAreaSourceRecord('test-site', 'ko', 'civil', {
      slug: 'civil litigation',
      subtitle: { en: 'Updated civil services' },
    });

    expect(record?.sourceSlug).toBe('civil');
    expect(record?.slug).toBe('civil-litigation');
    expect(record?.subtitle.en).toBe('Updated civil services');

    const written = vi.mocked(writeSiteDocument).mock.calls[0]?.[0] as BuilderSiteDocument | undefined;
    expect(written?.sourceCollectionOverrides?.serviceAreas).toEqual([
      expect.objectContaining({
        sourceSlug: 'civil',
        slug: 'civil-litigation',
        subtitle: { en: 'Updated civil services' },
        updatedBy: 'builder-services-api',
      }),
    ]);
  });

  it('resolves a service record by current slug or source slug', async () => {
    vi.mocked(readSiteDocument).mockResolvedValue({
      ...baseSite(),
      sourceCollectionOverrides: {
        serviceAreas: [{ sourceSlug: 'civil', slug: 'civil-litigation' }],
      },
    });

    await expect(readServiceAreaSourceRecordBySlug('test-site', 'ko', 'civil')).resolves.toMatchObject({
      sourceSlug: 'civil',
      slug: 'civil-litigation',
    });
    await expect(readServiceAreaSourceRecordBySlug('test-site', 'ko', 'civil-litigation')).resolves.toMatchObject({
      sourceSlug: 'civil',
      slug: 'civil-litigation',
    });
  });

  it('blocks duplicate live service slugs', async () => {
    vi.mocked(readSiteDocument).mockResolvedValue(baseSite());

    await expect(
      updateServiceAreaSourceRecord('test-site', 'ko', 'family', { slug: 'civil' }),
    ).rejects.toBeInstanceOf(BuilderServiceAreaSourceError);
    expect(writeSiteDocument).not.toHaveBeenCalled();
  });

  it('removes a service source override and returns the code-backed record', async () => {
    vi.mocked(readSiteDocument).mockResolvedValue({
      ...baseSite(),
      sourceCollectionOverrides: {
        serviceAreas: [{ sourceSlug: 'civil', slug: 'civil-litigation', title: { ko: '민사 테스트' } }],
      },
    });

    const record = await resetServiceAreaSourceRecordOverride('test-site', 'ko', 'civil-litigation');

    expect(record).toMatchObject({
      sourceSlug: 'civil',
      slug: 'civil',
    });
    expect(record?.title.ko).not.toBe('민사 테스트');
    const written = vi.mocked(writeSiteDocument).mock.calls[0]?.[0] as BuilderSiteDocument | undefined;
    expect(written?.sourceCollectionOverrides?.serviceAreas).toEqual([]);
  });

  it('ignores persisted overrides that collide with another source slug', () => {
    const records = mergeServiceAreaSourceRecords([
      { sourceSlug: 'family', slug: 'civil' },
    ]);

    const family = records.find((record) => record.sourceSlug === 'family');
    expect(family?.slug).toBe('family');
  });
});
