import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { attorneyProfiles } from '@/data/attorney-profiles';
import LawyerProfilePage, { generateMetadata } from '../page';

const SITE_URL = 'https://tseng-law.com';
const EN_SCREEN_HEADING = 'Wei Tseng';
const EN_SCREEN_LEDE =
  'Taiwan attorney advising overseas companies and individuals on company setup, investment, litigation, residence, and IP matters.';
const EN_JOB_TITLE = 'Taiwan Attorney · Managing Attorney';

const sourceMocks = vi.hoisted(() => ({
  readBySlug: vi.fn(),
  readRecords: vi.fn(),
}));

const visibilityMock = vi.hoisted(() => ({
  read: vi.fn(async () => ({
    persisted: true,
    revision: 1,
    savedAt: '2026-07-24T00:00:00.000Z',
    visibleBlockIds: [
      'attorney-profiles.item.hero',
      'attorney-profiles.item.body',
      'attorney-profiles.item.seo',
    ],
  })),
}));

vi.mock('@/lib/builder/lawyers/source', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/builder/lawyers/source')>();
  return {
    ...actual,
    readAttorneyProfileSourceRecordBySlug: sourceMocks.readBySlug,
    readAttorneyProfileSourceRecords: sourceMocks.readRecords,
  };
});

vi.mock('@/lib/builder/dynamic-template-drafts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/builder/dynamic-template-drafts')>();
  return {
    ...actual,
    readBuilderDynamicTemplatePublishedBlockVisibility: visibilityMock.read,
  };
});

function makeBuilderProfile() {
  const profile = attorneyProfiles.en['wei-tseng'];
  return {
    ...profile,
    sourceSlug: profile.slug,
    imageAltText: `${profile.name} ${profile.role}`,
    imageFocalPoint: { x: 0.5, y: 0.5 },
  };
}

function jsonLdNodes(html: string): Record<string, unknown>[] {
  return [...html.matchAll(/<script type="application\/ld\+json">([^<]+)<\/script>/g)].map(
    (match) => JSON.parse(match[1]) as Record<string, unknown>,
  );
}

describe('English lawyer profile screen copy', () => {
  beforeEach(() => {
    sourceMocks.readBySlug.mockReset();
    sourceMocks.readBySlug.mockResolvedValue(makeBuilderProfile());
    sourceMocks.readRecords.mockReset();
    visibilityMock.read.mockClear();
  });

  it('keeps SEO title, meta description, and Person JSON-LD on the existing identity fields', async () => {
    const profile = attorneyProfiles.en['wei-tseng'];
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: 'en', slug: 'wei-tseng' }),
    });
    const page = await LawyerProfilePage({
      params: Promise.resolve({ locale: 'en', slug: 'wei-tseng' }),
    });
    const html = renderToStaticMarkup(page);
    const person = jsonLdNodes(html)
      .map((node) => node.mainEntity as Record<string, unknown> | undefined)
      .find((entity) => entity?.['@type'] === 'Person');

    expect(metadata.title).toBe('Wei Tseng Taiwan Attorney Profile');
    expect(metadata.description).toBe(profile.description);
    expect(person).toMatchObject({
      name: 'Attorney Wei Tseng',
      description: profile.description,
      jobTitle: EN_JOB_TITLE,
    });
    expect(html).toContain(`"${SITE_URL}/en/lawyers/wei-tseng"`);
  });

  it('renders a person-facing H1, job-title eyebrow, lede, and breadcrumb without the SEO title', async () => {
    const page = await LawyerProfilePage({
      params: Promise.resolve({ locale: 'en', slug: 'wei-tseng' }),
    });
    const html = renderToStaticMarkup(page);
    const header = html.match(
      /<section\b[^>]*class="[^"]*\bpage-header\b[^"]*"[^>]*>[\s\S]*?<\/section>/,
    )?.[0];

    expect(header).toBeDefined();
    expect(header).toMatch(
      /<h1 class="hero-title page-header-title"[^>]*>Wei Tseng<\/h1>/,
    );
    expect(header).toMatch(
      /<span aria-current="page"[^>]*>Wei Tseng<\/span>/,
    );
    expect(header).toMatch(
      /<div class="section-label"[^>]*>Taiwan Attorney · Managing Attorney<\/div>/,
    );
    expect(header).toContain(EN_SCREEN_LEDE);
    expect(header).not.toContain('Wei Tseng Taiwan Attorney Profile');
    expect(header).not.toContain('A dedicated profile for Wei Tseng, a Taiwan attorney focusing on');
    expect(EN_SCREEN_HEADING).toBe('Wei Tseng');
  });
});
