import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createHomePageCanvasDocumentDecomposed } from '../seed-home';
import { normalizeLegacyZhHantHomeRead } from '../home-zh-hant-parity';
import { normalizeCanvasDocument, type BuilderCanvasDocument } from '../types';
import savedHome from './fixtures/legacy-zh-home-july.json';
import { siteContent } from '@/data/site-content';
import { createDefaultSiteDocument, type BuilderSiteDocument } from '@/lib/builder/site/types';

const priorApprovedStatsDescription = '依官方律師簡介整理：4個台灣辦公據點、中文／韓文／日文／英文4種業務溝通語言、7項主要執業領域，以及TOPIK 6級與JLPT N1兩項最高級別語言資格。';
const priorApprovedLanguageCopy = {
  'home-stats-description': priorApprovedStatsDescription,
  'home-stats-number-1': '4',
  'home-attorney-intro-1': '專精企業與個人案件。事務所可提供韓文、中文、日文、英文法律溝通。',
  'home-faq-item-11-answer': '可選擇面談（台北事務所）或視訊諮詢（Zoom/Google Meet）。韓語、中文、日語、英語皆可諮詢，須事先預約，以一小時為單位。若事先提供相關資料，可獲得更具體的建議。',
};

const pageMocks = vi.hoisted(() => ({
  document: null as BuilderCanvasDocument | null,
  site: null as BuilderSiteDocument | null,
  SandboxPage: vi.fn(() => null),
}));

vi.mock('@/components/builder/canvas/SandboxPage', () => ({ default: pageMocks.SandboxPage }));

vi.mock('@/lib/builder/site/persistence', () => ({
  projectPagesForLocale: vi.fn((pages) => pages),
  readSiteDocument: vi.fn(async () => pageMocks.site),
  readPageCanvas: vi.fn(async () => pageMocks.document),
  readPageCanvasRecord: vi.fn(async () => pageMocks.document && ({
    revision: 1,
    savedAt: '2026-01-01T00:00:00.000Z',
    updatedBy: 'admin',
    document: pageMocks.document,
  })),
  writePageCanvas: vi.fn(),
  publishPage: vi.fn(),
}));

vi.mock('@/lib/builder/site/publish', () => ({ readRevisionDocument: vi.fn() }));

vi.mock('@/lib/builder/canvas/home-draft-reseed', () => ({
  SEED_DRAFT_UPDATED_BY: 'seed',
  USER_DRAFT_UPDATED_BY: 'admin',
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

async function initialRead(document: BuilderCanvasDocument): Promise<BuilderCanvasDocument> {
  pageMocks.document = document;
  const { default: BuilderMainPage } = await import('@/app/(builder)/[locale]/admin-builder/page');
  const page = await BuilderMainPage({ params: Promise.resolve({ locale: 'zh-hant' }), searchParams: Promise.resolve({}) });
  return (page as unknown as { props: { initialDocument: BuilderCanvasDocument } }).props.initialDocument;
}

async function savedNormalizedV5(): Promise<BuilderCanvasDocument> {
  const projected = await normalizeLegacyZhHantHomeRead(
    normalizeCanvasDocument(structuredClone(savedHome), 'zh-hant'),
    'zh-hant',
    true,
  );
  const doc = normalizeCanvasDocument(structuredClone(projected), 'zh-hant');
  for (const [id, text] of Object.entries(priorApprovedLanguageCopy)) {
    const node = doc.nodes.find((item) => item.id === id);
    if (node?.kind !== 'text') throw new Error('stock text expected');
    node.content.text = text;
  }
  return doc;
}

describe('authored ZH home initial editor read', () => {
  beforeEach(() => { pageMocks.site = createDefaultSiteDocument('zh-hant', 'test-site'); });
  afterEach(() => vi.unstubAllEnvs());

  it.each(['true', 'false'])('matches the published stock read with discovery flag %s without saving', async (flag) => {
    vi.stubEnv('NEXT_PUBLIC_AI_INTAKE_DISCOVERY_ENABLED', flag);
    const doc = normalizeCanvasDocument(structuredClone(savedHome), 'zh-hant');
    const original = structuredClone(doc);
    const initial = await initialRead(doc);
    const { readPublishedPageCanvas } = await import('@/lib/builder/site/published-canvas');
    const published = await readPublishedPageCanvas({ ...pageMocks.site!.pages[0], locale: 'zh-hant', slug: '', isHomePage: true });
    expect(initial.nodes).toHaveLength(424);
    expect(initial.nodes.find((node) => node.id === 'home-stats-number-1')?.content).toMatchObject({ text: '4' });
    expect(initial.nodes.find((node) => node.id === 'home-stats-description')?.content)
      .toMatchObject({ text: siteContent['zh-hant'].stats.description });
    expect(initial.nodes.find((node) => node.id === 'home-attorney-intro-1')?.content)
      .toMatchObject({ text: '專精企業與個人案件。事務所可提供韓文、中文、日文、英文法律溝通。' });
    expect(initial.nodes.find((node) => node.id === 'home-faq-item-11-answer')?.content)
      .toMatchObject({ text: '可選擇面談（台北事務所）或視訊諮詢（Zoom/Google Meet）。韓語、中文、日語、英語皆可諮詢，須事先預約，以一小時為單位。若事先提供相關資料，可獲得更具體的建議。' });
    expect(initial).toEqual(published);
    expect(await initialRead(initial)).toEqual(initial);
    expect(initial.nodes.find((node) => node.id === 'home-contact-ai-guide')?.visible).toBe(flag === 'true');
    expect(doc).toEqual(original);
    const { writePageCanvas, publishPage } = await import('@/lib/builder/site/persistence');
    expect(writePageCanvas).not.toHaveBeenCalled();
    expect(publishPage).not.toHaveBeenCalled();
  });

  it.each(['true', 'false'])('projects the already saved v5 approved after group with discovery flag %s without saving', async (flag) => {
    vi.stubEnv('NEXT_PUBLIC_AI_INTAKE_DISCOVERY_ENABLED', flag);
    const doc = await savedNormalizedV5();
    const original = structuredClone(doc);
    const initial = await initialRead(doc);
    const { readPublishedPageCanvas } = await import('@/lib/builder/site/published-canvas');
    const published = await readPublishedPageCanvas({ ...pageMocks.site!.pages[0], locale: 'zh-hant', slug: '', isHomePage: true });
    expect(initial.nodes).toHaveLength(424);
    expect(initial.nodes.find((node) => node.id === 'home-stats-number-1')?.content).toMatchObject({ text: '4' });
    expect(initial.nodes.find((node) => node.id === 'home-stats-description')?.content)
      .toMatchObject({ text: siteContent['zh-hant'].stats.description });
    expect(siteContent['zh-hant'].stats.description).not.toBe(priorApprovedStatsDescription);
    expect(initial.nodes.find((node) => node.id === 'home-attorney-intro-1')?.content)
      .toMatchObject({ text: priorApprovedLanguageCopy['home-attorney-intro-1'] });
    expect(initial.nodes.find((node) => node.id === 'home-faq-item-11-answer')?.content)
      .toMatchObject({ text: priorApprovedLanguageCopy['home-faq-item-11-answer'] });
    for (const id of Object.keys(priorApprovedLanguageCopy)) {
      const node = initial.nodes.find((item) => item.id === id);
      const prior = original.nodes.find((item) => item.id === id);
      expect(node && prior ? { ...node, content: undefined } : undefined)
        .toEqual(prior ? { ...prior, content: undefined } : undefined);
      expect(node && prior ? { ...node.content, text: undefined } : undefined)
        .toEqual(prior ? { ...prior.content, text: undefined } : undefined);
    }
    expect(initial).toEqual(published);
    expect(await initialRead(initial)).toEqual(initial);
    expect(initial.nodes.find((node) => node.id === 'home-contact-ai-guide')?.visible).toBe(flag === 'true');
    expect(doc).toEqual(original);
    const { writePageCanvas, publishPage } = await import('@/lib/builder/site/persistence');
    expect(writePageCanvas).not.toHaveBeenCalled();
    expect(publishPage).not.toHaveBeenCalled();
  });

  it.each(['activeIndex-1', 'sticky-true', 'custom-text', 'geometry', 'reorder'] as const)(
    'does not project a normalizeCanvasDocument-saved v5 stock with authored group %s', async (change) => {
      const doc = await savedNormalizedV5();
      const group = doc.nodes.find((node) => node.id === 'home-attorney-detail-flow');
      if (group?.kind !== 'container') throw new Error('inserted group expected');
      if (change === 'activeIndex-1') group.content.activeIndex = 1;
      if (change === 'sticky-true') group.content.sticky = true;
      if (change === 'custom-text') group.content.label = '作者指定的群組標籤';
      if (change === 'geometry') group.rect.width = 551;
      if (change === 'reorder') {
        const index = doc.nodes.findIndex((node) => node.id === group.id);
        const swap = doc.nodes[index + 1];
        if (!swap) throw new Error('reorder neighbor expected');
        doc.nodes[index] = swap;
        doc.nodes[index + 1] = group;
      }
      const original = structuredClone(doc);
      const initial = await initialRead(doc);
      expect(initial.nodes.find((node) => node.id === 'home-stats-description')?.content)
        .toMatchObject({ text: priorApprovedStatsDescription });
      expect(initial).toEqual(original);
      expect(doc).toEqual(original);
      const { writePageCanvas, publishPage } = await import('@/lib/builder/site/persistence');
      expect(writePageCanvas).not.toHaveBeenCalled();
      expect(publishPage).not.toHaveBeenCalled();
    },
  );

  it('does not run forceful legacy layout/content migrations over the saved author document', async () => {
    const doc = createHomePageCanvasDocumentDecomposed('zh-hant');
    doc.updatedAt = '2026-07-28T00:00:00.000Z';
    doc.updatedBy = 'author-kept-document-marker';
    const inner = doc.nodes.find((node) => node.id === 'home-hero-inner')!;
    inner.rect.x = 82; inner.rect.y = 211;
    const title = doc.nodes.find((node) => node.id === 'home-hero-title')!;
    if (title.kind !== 'text') throw new Error('text expected');
    title.content.text = '作者自行編輯的標題';
    const image = doc.nodes.find((node) => node.id === 'home-hero-media-image')!;
    if (image.kind !== 'image') throw new Error('image expected');
    image.content.src = '/images/author-choice.webp';
    const wrongLocaleSentinel = doc.nodes.find((node) => node.id === 'home-insights-title')!;
    const koSentinel = createHomePageCanvasDocumentDecomposed('ko').nodes.find((node) => node.id === 'home-insights-title')!;
    if (wrongLocaleSentinel.kind !== 'text' || koSentinel.kind !== 'text') throw new Error('text expected');
    wrongLocaleSentinel.content.text = koSentinel.content.text;
    const original = structuredClone(doc);
    const result = await initialRead(doc);
    expect(result).toEqual(original);
    expect(doc).toEqual(original);
    const { writePageCanvas, publishPage } = await import('@/lib/builder/site/persistence');
    expect(writePageCanvas).not.toHaveBeenCalled();
    expect(publishPage).not.toHaveBeenCalled();
  });
});
