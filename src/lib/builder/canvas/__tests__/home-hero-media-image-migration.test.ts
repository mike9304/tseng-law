import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HERO_MEDIA_IMAGE_SOURCES } from '../decompose-hero';
import { createHomePageCanvasDocumentDecomposed } from '../seed-home';
import type { BuilderCanvasDocument, BuilderDataBinding } from '../types';
import { createDefaultSiteDocument, type BuilderSiteDocument } from '@/lib/builder/site/types';

const pageMocks = vi.hoisted(() => ({
  document: null as BuilderCanvasDocument | null,
  site: null as BuilderSiteDocument | null,
  SandboxPage: vi.fn(() => null),
}));

vi.mock('@/components/builder/canvas/SandboxPage', () => ({ default: pageMocks.SandboxPage }));

vi.mock('@/lib/builder/site/persistence', () => ({
  projectPagesForLocale: vi.fn((pages) => pages),
  readSiteDocument: vi.fn(async () => pageMocks.site),
  readPageCanvasRecord: vi.fn(async () => pageMocks.document && ({
    revision: 1,
    savedAt: '2026-01-01T00:00:00.000Z',
    updatedBy: 'admin',
    document: pageMocks.document,
  })),
  writePageCanvas: vi.fn(),
  publishPage: vi.fn(),
}));

vi.mock('@/lib/builder/canvas/home-draft-reseed', () => ({
  SEED_DRAFT_UPDATED_BY: 'seed',
  canPersistHomeDraftRenderMigration: vi.fn(() => false),
  decideHomeDraftReseed: vi.fn(() => ({ reseed: false, reason: null })),
}));

vi.mock('@/lib/builder/canvas/persistence', () => ({
  readCanvasSandboxDraft: vi.fn(),
}));

vi.mock('@/lib/consultation/columns-blob-reader', () => ({
  getAllColumnPostsIncludingBlob: vi.fn(async () => []),
}));

vi.mock('@/lib/builder/persistence', () => ({
  readBuilderPageSnapshot: vi.fn(async () => ({ snapshot: { document: null } })),
}));

vi.mock('@/lib/builder/datasets', () => ({
  createDefaultBuilderPageDatasets: vi.fn(() => []),
  readBuilderPageDatasetOverviews: vi.fn(() => []),
}));

vi.mock('@/lib/builder/canvas/home-hero-search-migration', () => ({
  upgradeHomeHeroSearchForm: vi.fn((document) => document),
}));

vi.mock('@/lib/builder/canvas/decompose-page-services', () => ({
  upgradeStandardServicesPageDesktopParity: vi.fn((document) => document),
}));

vi.mock('@/lib/builder/canvas/home-locale-repair', () => ({
  repairHomeCanvasLocale: vi.fn((document) => document),
}));

vi.mock('@/lib/builder/canvas/home-editor-layout-parity', () => ({
  upgradeHomeEditorLayoutParity: vi.fn((document) => document),
}));

vi.mock('@/lib/builder/canvas/seed-pages', () => ({
  buildFaqCompositePageCanvas: vi.fn(),
  seedSitePages: vi.fn(),
}));

vi.mock('@/lib/builder/site/public-header-navigation', () => ({
  upgradePublicHeaderNavigation: vi.fn((site) => site),
}));

vi.mock('@/lib/builder/site/standard-pages', () => ({
  needsStandardPageSeedForLocale: vi.fn(() => false),
}));

vi.mock('@/lib/builder/apps/widgets', () => ({
  listEnabledBuilderAppWidgetsFromInstalled: vi.fn(() => []),
}));

vi.mock('@/lib/builder/faq/faq-engine', () => ({
  listFaqCategories: vi.fn(() => []),
  listFaqItems: vi.fn(async () => []),
}));

vi.mock('@/lib/builder/site/admin-routing', () => ({
  resolveBuilderSiteIdFromValue: vi.fn(() => 'test-site'),
}));

vi.mock('@/lib/builder/site/site-name', () => ({
  resolveBuilderSiteName: vi.fn(() => 'Test site'),
}));

function withHeroMediaSource(
  source: string,
  dataBinding?: BuilderDataBinding,
): BuilderCanvasDocument {
  const document = createHomePageCanvasDocumentDecomposed('en');

  return {
    ...document,
    nodes: document.nodes.map((node) => (
      node.kind === 'image' && node.id === 'home-hero-media-image'
        ? { ...node, content: { ...node.content, src: source }, dataBinding }
        : node
    )),
  };
}

function heroMediaSource(document: BuilderCanvasDocument): string | undefined {
  const image = document.nodes.find((node) => node.id === 'home-hero-media-image');
  return image?.kind === 'image' ? image.content.src : undefined;
}

async function renderBuilderInitialDocument(document: BuilderCanvasDocument): Promise<BuilderCanvasDocument> {
  pageMocks.document = document;
  pageMocks.SandboxPage.mockClear();
  const { default: BuilderMainPage } = await import('@/app/(builder)/[locale]/admin-builder/page');
  const page = await BuilderMainPage({
    params: Promise.resolve({ locale: 'en' }),
    searchParams: Promise.resolve({}),
  });

  expect(page.type).toBe(pageMocks.SandboxPage);
  return (page as unknown as { props: { initialDocument: BuilderCanvasDocument } }).props.initialDocument;
}

describe('admin builder hero-media image migration', () => {
  beforeEach(() => {
    pageMocks.site = createDefaultSiteDocument('en', 'test-site');
  });

  it('migrates the exact legacy Taiwan modern-city opening source through BuilderMainPage', async () => {
    const result = await renderBuilderInitialDocument(
      withHeroMediaSource('/images/hero-taiwan-modern-city-opening.webp'),
    );

    expect(heroMediaSource(result)).toBe(HERO_MEDIA_IMAGE_SOURCES[0]);
  });

  it('preserves a custom hero image source through BuilderMainPage', async () => {
    const document = withHeroMediaSource('/images/custom-client-hero.webp');
    const result = await renderBuilderInitialDocument(document);

    expect(heroMediaSource(result)).toBe('/images/custom-client-hero.webp');
  });

  it('preserves the exact legacy source when the hero image is dataset-bound', async () => {
    const dataBinding: BuilderDataBinding = {
      targetId: 'home.insights.feed',
      recordIndex: 0,
      fields: { src: 'image' },
    };
    const result = await renderBuilderInitialDocument(
      withHeroMediaSource('/images/hero-taiwan-modern-city-opening.webp', dataBinding),
    );

    expect(heroMediaSource(result)).toBe('/images/hero-taiwan-modern-city-opening.webp');
    expect(result.nodes.find((node) => node.id === 'home-hero-media-image')?.dataBinding).toEqual(dataBinding);
  });
});
