import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getServiceArea } from '@/data/service-details';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { PREVIOUS_EN_SERVICE_DEFAULTS } from '@/lib/services/international-public-copy';
import ServiceDetailPage, { generateMetadata } from '../page';

const SITE_URL = 'https://tseng-law.com';

const navigationMocks = vi.hoisted(() => ({
  notFound: vi.fn((): never => {
    throw new Error('NEXT_NOT_FOUND');
  }),
  permanentRedirect: vi.fn((destination: string): never => {
    throw new Error(`NEXT_REDIRECT:${destination}`);
  }),
}));

const sourceMocks = vi.hoisted(() => ({
  readBySlug: vi.fn(),
  readRecords: vi.fn(),
  update: vi.fn(),
}));

const visibilityMock = vi.hoisted(() => ({
  read: vi.fn(async () => ({
    persisted: true,
    revision: 1,
    savedAt: '2026-07-25T00:00:00.000Z',
    visibleBlockIds: [
      'service-areas.item.hero',
      'service-areas.item.body',
      'service-areas.item.seo',
    ],
  })),
}));

vi.mock('next/navigation', () => ({
  notFound: navigationMocks.notFound,
  permanentRedirect: navigationMocks.permanentRedirect,
}));

vi.mock('@/lib/builder/services/source', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/builder/services/source')>();
  return {
    ...actual,
    readServiceAreaSourceRecordBySlug: sourceMocks.readBySlug,
    readServiceAreaSourceRecords: sourceMocks.readRecords,
    updateServiceAreaSourceRecord: sourceMocks.update,
  };
});

vi.mock('@/lib/builder/dynamic-template-drafts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/builder/dynamic-template-drafts')>();
  return {
    ...actual,
    readBuilderDynamicTemplatePublishedBlockVisibility: visibilityMock.read,
  };
});

function htmlText(value: string): string {
  return value.replace(/&/g, '&amp;');
}

function summarize(text: string, maxLength = 160) {
  return text.length > maxLength ? `${text.slice(0, maxLength - 1).trimEnd()}…` : text;
}

function makeSourceArea(
  slug: string,
  enOverrides: Partial<{
    subtitle: string;
    intro: string;
    keyPoints: string[];
  }> = {},
) {
  const area = getServiceArea(slug);
  if (!area) throw new Error(`Missing service fixture: ${slug}`);
  return {
    ...area,
    sourceSlug: area.slug,
    subtitle: enOverrides.subtitle === undefined
      ? area.subtitle
      : { ...area.subtitle, en: enOverrides.subtitle },
    intro: enOverrides.intro === undefined
      ? area.intro
      : { ...area.intro, en: enOverrides.intro },
    keyPoints: enOverrides.keyPoints === undefined
      ? area.keyPoints
      : { ...area.keyPoints, en: enOverrides.keyPoints },
  };
}

function previousEnglishInvestmentArea() {
  return makeSourceArea('investment', {
    subtitle: PREVIOUS_EN_SERVICE_DEFAULTS.investment.subtitle,
    intro: PREVIOUS_EN_SERVICE_DEFAULTS.investment.intro,
    keyPoints: [...PREVIOUS_EN_SERVICE_DEFAULTS.investment.keyPoints],
  });
}

describe('English international service-detail copy', () => {
  beforeEach(() => {
    navigationMocks.notFound.mockClear();
    navigationMocks.permanentRedirect.mockClear();
    sourceMocks.readBySlug.mockReset();
    sourceMocks.readRecords.mockReset();
    sourceMocks.update.mockReset();
    visibilityMock.read.mockClear();
  });

  it('projects previous EN investment source defaults to current public copy in body and metadata', async () => {
    const current = getServiceArea('investment');
    expect(current).toBeDefined();
    sourceMocks.readBySlug.mockResolvedValue(previousEnglishInvestmentArea());

    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: 'en', slug: 'investment' }),
    });
    const page = await ServiceDetailPage({
      params: Promise.resolve({ locale: 'en', slug: 'investment' }),
    });
    const html = renderToStaticMarkup(page);

    expect(metadata.title).toBe(current!.title.en);
    expect(metadata.description).toBe(summarize(current!.intro.en));
    expect(metadata.alternates?.canonical).toBe(`${SITE_URL}/en/services/investment`);
    expect(html).toContain(htmlText(current!.title.en));
    expect(html).toContain(current!.subtitle.en);
    expect(html).toContain(current!.intro.en);
    for (const point of current!.keyPoints.en) {
      expect(html).toContain(point);
    }
    expect(html).not.toContain(PREVIOUS_EN_SERVICE_DEFAULTS.investment.subtitle);
    expect(html).not.toContain(PREVIOUS_EN_SERVICE_DEFAULTS.investment.intro);
    expect(html).not.toContain('Korean companies expanding into Taiwan');
    expect(sourceMocks.readBySlug).toHaveBeenCalledWith(
      DEFAULT_BUILDER_SITE_ID,
      'en',
      'investment',
    );
    expect(sourceMocks.update).not.toHaveBeenCalled();
    expect(visibilityMock.read).toHaveBeenCalledWith(
      'service-areas.item-template',
      'en',
    );
  });

  it('preserves custom EN subtitle, intro, and key points without writing source records', async () => {
    const current = getServiceArea('investment');
    expect(current).toBeDefined();
    const custom = {
      subtitle: 'Custom overseas investment subtitle',
      intro: 'Custom overseas investment intro for a specific matter.',
      keyPoints: ['Custom investment point one', 'Custom investment point two'],
    };
    sourceMocks.readBySlug.mockResolvedValue(makeSourceArea('investment', custom));

    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: 'en', slug: 'investment' }),
    });
    const page = await ServiceDetailPage({
      params: Promise.resolve({ locale: 'en', slug: 'investment' }),
    });
    const html = renderToStaticMarkup(page);

    expect(metadata.title).toBe(current!.title.en);
    expect(metadata.description).toBe(summarize(custom.intro));
    expect(html).toContain(custom.subtitle);
    expect(html).toContain(custom.intro);
    for (const point of custom.keyPoints) {
      expect(html).toContain(point);
    }
    expect(html).not.toContain(current!.subtitle.en);
    expect(html).not.toContain(current!.intro.en);
    expect(html).not.toContain(PREVIOUS_EN_SERVICE_DEFAULTS.investment.intro);
    expect(sourceMocks.update).not.toHaveBeenCalled();
    expect(sourceMocks.readRecords).not.toHaveBeenCalled();
  });
});
