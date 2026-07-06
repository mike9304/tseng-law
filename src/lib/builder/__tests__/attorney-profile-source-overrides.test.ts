import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { BuilderSiteDocument } from '@/lib/builder/site/types';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import {
  mergeAttorneyProfileSourceRecords,
  readAttorneyProfileSourceRecordBySlug,
  resetAttorneyProfileSourceRecordOverride,
  updateAttorneyProfileSourceRecord,
} from '@/lib/builder/lawyers/source';

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

describe('attorney profile source overrides', () => {
  beforeEach(() => {
    vi.mocked(readSiteDocument).mockReset();
    vi.mocked(writeSiteDocument).mockReset();
  });

  it('merges attorney slug and localized profile overrides onto source records', () => {
    const records = mergeAttorneyProfileSourceRecords([
      {
        sourceSlug: 'wei-tseng',
        slug: 'wei-tseng-profile',
        imageAltText: '테스트 변호사 프로필 사진',
        imageFocalPoint: { x: 0.25, y: 0.75 },
        localized: {
          ko: {
            name: '테스트 변호사',
            summary: ['새 요약'],
            languages: ['한국어', '영어'],
            practiceAreas: ['대만 투자', '상표 출원'],
            internalLinks: [{ label: '상담 문의', href: '/ko/contact' }],
          },
        },
      },
    ], 'ko');

    expect(records[0]).toMatchObject({
      sourceSlug: 'wei-tseng',
      slug: 'wei-tseng-profile',
      imageAltText: '테스트 변호사 프로필 사진',
      imageFocalPoint: { x: 0.25, y: 0.75 },
      name: '테스트 변호사',
      summary: ['새 요약'],
      languages: ['한국어', '영어'],
      practiceAreas: ['대만 투자', '상표 출원'],
      internalLinks: [{ label: '상담 문의', href: '/ko/contact' }],
    });
  });

  it('writes a site-level override for attorney profile edits', async () => {
    vi.mocked(readSiteDocument).mockResolvedValue(baseSite());

    const record = await updateAttorneyProfileSourceRecord('test-site', 'ko', 'wei-tseng', {
      slug: 'wei tseng profile',
      localized: {
        ko: {
          role: '테스트 역할',
          languages: ['한국어', '영어'],
          practiceAreas: ['대만 투자', '상표 출원'],
          internalLinks: [{ label: '상담 문의', href: '/ko/contact' }],
        },
      },
      email: 'test@example.com',
      image: '/images/team/test-profile.png',
      imageAltText: '테스트 변호사 프로필 사진',
      imageFocalPoint: { x: 0.18, y: 0.66 },
    });

    expect(record).toMatchObject({
      sourceSlug: 'wei-tseng',
      slug: 'wei-tseng-profile',
      role: '테스트 역할',
      languages: ['한국어', '영어'],
      practiceAreas: ['대만 투자', '상표 출원'],
      internalLinks: [{ label: '상담 문의', href: '/ko/contact' }],
      email: 'test@example.com',
      image: '/images/team/test-profile.png',
      imageAltText: '테스트 변호사 프로필 사진',
      imageFocalPoint: { x: 0.18, y: 0.66 },
    });
    const written = vi.mocked(writeSiteDocument).mock.calls[0]?.[0] as BuilderSiteDocument | undefined;
    expect(written?.sourceCollectionOverrides?.attorneyProfiles).toEqual([
      expect.objectContaining({
        sourceSlug: 'wei-tseng',
        slug: 'wei-tseng-profile',
        localized: {
          ko: {
            role: '테스트 역할',
            languages: ['한국어', '영어'],
            practiceAreas: ['대만 투자', '상표 출원'],
            internalLinks: [{ label: '상담 문의', href: '/ko/contact' }],
          },
        },
        email: 'test@example.com',
        image: '/images/team/test-profile.png',
        imageAltText: '테스트 변호사 프로필 사진',
        imageFocalPoint: { x: 0.18, y: 0.66 },
        updatedBy: 'builder-lawyers-api',
      }),
    ]);
  });

  it('normalizes invalid attorney profile image focal metadata', async () => {
    vi.mocked(readSiteDocument).mockResolvedValue(baseSite());

    const record = await updateAttorneyProfileSourceRecord('test-site', 'ko', 'wei-tseng', {
      imageFocalPoint: { x: -1, y: 2 },
    });

    expect(record).toMatchObject({
      sourceSlug: 'wei-tseng',
      imageFocalPoint: { x: 0, y: 1 },
    });
    const written = vi.mocked(writeSiteDocument).mock.calls[0]?.[0] as BuilderSiteDocument | undefined;
    expect(written?.sourceCollectionOverrides?.attorneyProfiles).toEqual([
      expect.objectContaining({
        sourceSlug: 'wei-tseng',
        imageFocalPoint: { x: 0, y: 1 },
      }),
    ]);
  });

  it('resolves attorney records by current slug or source slug', async () => {
    vi.mocked(readSiteDocument).mockResolvedValue({
      ...baseSite(),
      sourceCollectionOverrides: {
        attorneyProfiles: [{ sourceSlug: 'wei-tseng', slug: 'wei-tseng-profile' }],
      },
    });

    await expect(readAttorneyProfileSourceRecordBySlug('test-site', 'ko', 'wei-tseng')).resolves.toMatchObject({
      sourceSlug: 'wei-tseng',
      slug: 'wei-tseng-profile',
    });
    await expect(readAttorneyProfileSourceRecordBySlug('test-site', 'ko', 'wei-tseng-profile')).resolves.toMatchObject({
      sourceSlug: 'wei-tseng',
      slug: 'wei-tseng-profile',
    });
  });

  it('removes an attorney profile override and returns the code-backed record', async () => {
    vi.mocked(readSiteDocument).mockResolvedValue({
      ...baseSite(),
      sourceCollectionOverrides: {
        attorneyProfiles: [
          {
            sourceSlug: 'wei-tseng',
            slug: 'wei-tseng-profile',
            localized: { ko: { name: '테스트 변호사' } },
          },
        ],
      },
    });

    const record = await resetAttorneyProfileSourceRecordOverride('test-site', 'ko', 'wei-tseng-profile');

    expect(record).toMatchObject({
      sourceSlug: 'wei-tseng',
      slug: 'wei-tseng',
      name: '증준외 변호사',
    });
    const written = vi.mocked(writeSiteDocument).mock.calls[0]?.[0] as BuilderSiteDocument | undefined;
    expect(written?.sourceCollectionOverrides?.attorneyProfiles).toEqual([]);
  });
});
