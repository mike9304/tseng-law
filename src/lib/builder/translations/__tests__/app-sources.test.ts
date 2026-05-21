import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createDefaultSiteDocument, type BuilderSiteDocument } from '@/lib/builder/site/types';
import { readPageCanvas, readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import { listColumnBundles, readColumnBundle, writeDraftColumn } from '@/lib/builder/columns/storage';
import { listFaqItems, loadFaqItem, saveFaqItem } from '@/lib/builder/faq/faq-engine';
import type { BuilderFaqItem } from '@/lib/builder/faq/faq-shared';
import { listEvents, loadEvent, saveEvent } from '@/lib/builder/events/events-engine';
import type { BuilderEvent } from '@/lib/builder/events/events-shared';
import { listProjects, loadProject, saveProject } from '@/lib/builder/portfolio/portfolio-engine';
import type { PortfolioProject } from '@/lib/builder/portfolio/portfolio-shared';
import { listBuilderAppCatalogEntries } from '@/lib/builder/apps/installed';
import { resolveLiveChatSettings } from '@/lib/builder/live-chat/app-settings';
import { saveTranslationValue, syncTranslationsForSite } from '@/lib/builder/translations/sync';

vi.mock('@/lib/builder/site/persistence', () => ({
  readSiteDocument: vi.fn(),
  writeSiteDocument: vi.fn(),
  readPageCanvas: vi.fn(async () => null),
  writePageCanvas: vi.fn(),
}));

vi.mock('@/lib/builder/columns/storage', () => ({
  listColumnBundles: vi.fn(async () => []),
  readColumnBundle: vi.fn(),
  writeDraftColumn: vi.fn(),
}));

vi.mock('@/lib/builder/faq/faq-engine', () => ({
  listFaqItems: vi.fn(),
  loadFaqItem: vi.fn(),
  saveFaqItem: vi.fn(),
}));

vi.mock('@/lib/builder/events/events-engine', () => ({
  listEvents: vi.fn(),
  loadEvent: vi.fn(),
  saveEvent: vi.fn(),
}));

vi.mock('@/lib/builder/portfolio/portfolio-engine', () => ({
  listProjects: vi.fn(),
  loadProject: vi.fn(),
  saveProject: vi.fn(),
}));

const mockedReadSiteDocument = vi.mocked(readSiteDocument);
const mockedWriteSiteDocument = vi.mocked(writeSiteDocument);
const mockedReadPageCanvas = vi.mocked(readPageCanvas);
const mockedListColumnBundles = vi.mocked(listColumnBundles);
const mockedReadColumnBundle = vi.mocked(readColumnBundle);
const mockedWriteDraftColumn = vi.mocked(writeDraftColumn);
const mockedListFaqItems = vi.mocked(listFaqItems);
const mockedLoadFaqItem = vi.mocked(loadFaqItem);
const mockedSaveFaqItem = vi.mocked(saveFaqItem);
const mockedListEvents = vi.mocked(listEvents);
const mockedLoadEvent = vi.mocked(loadEvent);
const mockedSaveEvent = vi.mocked(saveEvent);
const mockedListProjects = vi.mocked(listProjects);
const mockedLoadProject = vi.mocked(loadProject);
const mockedSaveProject = vi.mocked(saveProject);

const now = '2026-05-20T00:00:00.000Z';

function makeFaq(overrides: Partial<BuilderFaqItem> = {}): BuilderFaqItem {
  return {
    faqId: 'faq-source-ko',
    slug: 'faq-source',
    locale: 'ko',
    question: '앱 번역 FAQ 질문',
    answer: '앱 번역 FAQ 답변',
    categoryId: 'company-setup',
    tags: ['앱태그'],
    status: 'published',
    sortOrder: 10,
    schemaEnabled: true,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

function makeEvent(overrides: Partial<BuilderEvent> = {}): BuilderEvent {
  return {
    eventId: 'evt-source-ko',
    slug: 'event-source',
    title: '앱 번역 세미나',
    description: '앱 번역 이벤트 설명',
    date: '2026-06-01',
    time: '10:00',
    location: '타이베이',
    capacity: 80,
    registeredCount: 0,
    category: 'seminar',
    locale: 'ko',
    status: 'published',
    rsvpEnabled: true,
    ticketType: 'free',
    ticketPriceTwd: 0,
    ticketCurrency: 'TWD',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

function makeProject(overrides: Partial<PortfolioProject> = {}): PortfolioProject {
  return {
    projectId: 'pf-source-ko',
    slug: 'portfolio-source',
    title: '앱 번역 포트폴리오',
    summary: '앱 번역 포트폴리오 요약',
    description: '앱 번역 포트폴리오 설명',
    body: '앱 번역 포트폴리오 본문',
    category: 'company-setup',
    client: '익명 고객',
    completedAt: '2026-05-20',
    tags: ['앱포트폴리오'],
    locale: 'ko',
    status: 'published',
    featured: true,
    order: 1,
    gallery: [{
      imageId: 'gallery-1',
      url: '/images/test.jpg',
      alt: '앱 번역 이미지 대체 텍스트',
      caption: '앱 번역 이미지 캡션',
    }],
    seoTitle: '앱 번역 SEO 제목',
    seoDescription: '앱 번역 SEO 설명',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

describe('app translation hooks', () => {
  let site: BuilderSiteDocument;
  let faqRecords: Map<string, BuilderFaqItem>;
  let eventRecords: Map<string, BuilderEvent>;
  let projectRecords: Map<string, PortfolioProject>;

  beforeEach(() => {
    site = createDefaultSiteDocument('ko', 'test-site');
    site.pages = [];
    site.navigation = [];
    site.installedApps = [{
      appId: 'live-chat',
      version: '1.0.0',
      status: 'enabled',
      installedAt: now,
      updatedAt: now,
      settings: {
        'launcher-enabled': true,
        'launcher-label': '실시간 상담',
        title: '호정국제 상담',
        'intro-text': '이름과 이메일은 선택 사항입니다.',
        'offline-message': '지금은 답변이 지연될 수 있습니다.',
        'accent-color': '#0f172a',
      },
      audit: [],
    }];

    faqRecords = new Map([[makeFaq().faqId, makeFaq()]]);
    eventRecords = new Map([[makeEvent().eventId, makeEvent()]]);
    projectRecords = new Map([[makeProject().projectId, makeProject()]]);

    mockedReadSiteDocument.mockResolvedValue(site);
    mockedWriteSiteDocument.mockImplementation(async (nextSite) => {
      site = nextSite;
      mockedReadSiteDocument.mockResolvedValue(site);
    });
    mockedReadPageCanvas.mockResolvedValue(null);
    mockedListColumnBundles.mockResolvedValue([]);
    mockedReadColumnBundle.mockResolvedValue({
      slug: 'none',
      locale: 'ko',
      draft: null,
      published: null,
      preferred: null,
      backend: 'file',
    });
    mockedWriteDraftColumn.mockImplementation(async (doc) => doc);

    mockedListFaqItems.mockImplementation(async ({ locale } = {}) => (
      [...faqRecords.values()].filter((item) => !locale || item.locale === locale)
    ));
    mockedLoadFaqItem.mockImplementation(async (faqId) => faqRecords.get(faqId) ?? null);
    mockedSaveFaqItem.mockImplementation(async (item) => {
      faqRecords.set(item.faqId, item);
      return item;
    });

    mockedListEvents.mockImplementation(async () => [...eventRecords.values()]);
    mockedLoadEvent.mockImplementation(async (eventId) => eventRecords.get(eventId) ?? null);
    mockedSaveEvent.mockImplementation(async (event) => {
      eventRecords.set(event.eventId, event);
      return event;
    });

    mockedListProjects.mockImplementation(async () => [...projectRecords.values()]);
    mockedLoadProject.mockImplementation(async (projectId) => projectRecords.get(projectId) ?? null);
    mockedSaveProject.mockImplementation(async (project) => {
      projectRecords.set(project.projectId, project);
      return project;
    });
  });

  it('collects first-party app manifests, settings, and native app records', async () => {
    const payload = await syncTranslationsForSite('test-site', 'ko');
    const appCategory = payload.categories.find((category) => category.key === 'apps');
    const keys = new Set(payload.entries.map((entry) => entry.key));

    expect(appCategory?.total).toBeGreaterThan(20);
    expect(keys).toContain('app:site-search:manifest:name');
    expect(keys).toContain('app:live-chat:setting:title:value');
    expect(keys).toContain('app:faq-manager:content:faq:faq-source-ko:question');
    expect(keys).toContain('app:native-events:content:events:evt-source-ko:title');
    expect(keys).toContain('app:native-portfolio:content:portfolio:pf-source-ko:title');
    expect(payload.entries.find((entry) => entry.key === 'app:live-chat:setting:title:value')?.sourceText)
      .toBe('호정국제 상담');
  });

  it('stores locale-specific app settings without overwriting source settings', async () => {
    const result = await saveTranslationValue({
      siteId: 'test-site',
      sourceLocale: 'ko',
      key: 'app:live-chat:setting:title:value',
      targetLocale: 'en',
      text: 'Tseng Law Consultation',
      status: 'manual',
      provider: 'manual',
    });

    expect(result.applied).toBe(true);
    expect(site.installedApps?.[0]?.settings?.title).toBe('호정국제 상담');
    expect(site.installedApps?.[0]?.localizedSettings?.en?.title).toBe('Tseng Law Consultation');
    expect(resolveLiveChatSettings(site.installedApps, false, 'en')?.title).toBe('Tseng Law Consultation');
  });

  it('applies native app content translations to deterministic target-locale records', async () => {
    const faqResult = await saveTranslationValue({
      siteId: 'test-site',
      sourceLocale: 'ko',
      key: 'app:faq-manager:content:faq:faq-source-ko:question',
      targetLocale: 'en',
      text: 'Translated FAQ question',
      status: 'manual',
      provider: 'manual',
    });
    const eventResult = await saveTranslationValue({
      siteId: 'test-site',
      sourceLocale: 'ko',
      key: 'app:native-events:content:events:evt-source-ko:title',
      targetLocale: 'en',
      text: 'Translated event',
      status: 'manual',
      provider: 'manual',
    });
    const portfolioResult = await saveTranslationValue({
      siteId: 'test-site',
      sourceLocale: 'ko',
      key: 'app:native-portfolio:content:portfolio:pf-source-ko:title',
      targetLocale: 'en',
      text: 'Translated portfolio',
      status: 'manual',
      provider: 'manual',
    });

    expect(faqResult.applied).toBe(true);
    expect(eventResult.applied).toBe(true);
    expect(portfolioResult.applied).toBe(true);
    expect(faqRecords.get('faq-source-ko--en')).toMatchObject({
      locale: 'en',
      question: 'Translated FAQ question',
    });
    expect(eventRecords.get('evt-source-ko--en')).toMatchObject({
      locale: 'en',
      title: 'Translated event',
    });
    expect(projectRecords.get('pf-source-ko--en')).toMatchObject({
      locale: 'en',
      title: 'Translated portfolio',
    });
  });

  it('uses saved app manifest translations in the app catalog for target locales', async () => {
    const result = await saveTranslationValue({
      siteId: 'test-site',
      sourceLocale: 'ko',
      key: 'app:site-search:manifest:name',
      targetLocale: 'en',
      text: 'Site Finder',
      status: 'manual',
      provider: 'manual',
    });

    expect(result.applied).toBe(false);
    const entries = await listBuilderAppCatalogEntries('test-site', 'en');
    expect(entries.find((entry) => entry.manifest.appId === 'site-search')?.manifest.name).toBe('Site Finder');
  });
});
