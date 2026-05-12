import type { Locale } from '@/lib/locales';
import {
  type BuilderCanvasNode,
  type BuilderCanvasDocument,
  createDefaultCanvasNodeStyle,
} from '@/lib/builder/canvas/types';
import { legalPageContent } from '@/data/legal-pages';
import { pageCopy } from '@/data/page-copy';
import {
  createPage,
  ensureSiteDocument,
  publishPage,
  readPageCanvas,
  readSiteDocument,
  writePageCanvas,
  writeSiteDocument,
} from '@/lib/builder/site/persistence';
import { normalizeBuilderSiteId } from '@/lib/builder/site/identity';
import { matchesStandardPageSlugForLocale } from '@/lib/builder/site/standard-pages';
import type { BuilderPageMeta, BuilderSiteDocument } from '@/lib/builder/site/types';
import { createHomePageCanvasDocument } from './seed-home';
import {
  ABOUT_PAGE_ROOT_HEIGHT,
  createAboutPageDecomposedNodes,
} from './decompose-page-about';
import {
  CONTACT_PAGE_ROOT_HEIGHT,
  createContactPageDecomposedNodes,
} from './decompose-page-contact';
import {
  DISCLAIMER_PAGE_ROOT_HEIGHT,
  createDisclaimerPageDecomposedNodes,
} from './decompose-page-disclaimer';
import {
  FAQ_PAGE_ROOT_HEIGHT,
  createFaqPageDecomposedNodes,
} from './decompose-page-faq';
import {
  LAWYERS_PAGE_ROOT_HEIGHT,
  createLawyersPageDecomposedNodes,
} from './decompose-page-lawyers';
import {
  PRICING_PAGE_ROOT_HEIGHT,
  createPricingPageDecomposedNodes,
} from './decompose-page-pricing';
import {
  PRIVACY_PAGE_ROOT_HEIGHT,
  createPrivacyPageDecomposedNodes,
} from './decompose-page-privacy';
import {
  REVIEWS_PAGE_ROOT_HEIGHT,
  createReviewsPageDecomposedNodes,
} from './decompose-page-reviews';
import {
  createServicesPageDecomposedNodes,
  SERVICES_PAGE_ROOT_HEIGHT,
} from './decompose-page-services';
import {
  createHomeButtonNode,
  createHomeContainerNode,
  createHomeTextNode,
} from './decompose-home-shared';

const STAGE_WIDTH = 1280;
const SITE_PAGE_SEED_VERSION = 'site-page-seed-v3';
const COLUMNS_PAGE_ROOT_HEIGHT = 2660;
const seedSitePagesInFlight = new Map<string, Promise<void>>();

type PageSeedDefinition = {
  slug: string;
  isHomePage?: boolean;
  includeInNavigation?: boolean;
  titles: Record<Locale, string>;
  buildDocument: (locale: Locale) => BuilderCanvasDocument;
};

function createDecomposedPageCanvasDocument(
  locale: Locale,
  nodes: BuilderCanvasNode[],
  height: number,
): BuilderCanvasDocument {
  return {
    version: 1,
    locale,
    updatedAt: new Date().toISOString(),
    updatedBy: SITE_PAGE_SEED_VERSION,
    stageWidth: STAGE_WIDTH,
    stageHeight: height,
    nodes,
  };
}

function buildAboutPageCanvas(locale: Locale): BuilderCanvasDocument {
  return createDecomposedPageCanvasDocument(locale, createAboutPageDecomposedNodes(0, locale, 0), ABOUT_PAGE_ROOT_HEIGHT);
}

function buildServicesPageCanvas(locale: Locale): BuilderCanvasDocument {
  return createDecomposedPageCanvasDocument(locale, createServicesPageDecomposedNodes(0, locale, 0), SERVICES_PAGE_ROOT_HEIGHT);
}

function buildContactPageCanvas(locale: Locale): BuilderCanvasDocument {
  return createDecomposedPageCanvasDocument(locale, createContactPageDecomposedNodes(0, locale, 0), CONTACT_PAGE_ROOT_HEIGHT);
}

function buildLawyersPageCanvas(locale: Locale): BuilderCanvasDocument {
  return createDecomposedPageCanvasDocument(locale, createLawyersPageDecomposedNodes(0, locale, 0), LAWYERS_PAGE_ROOT_HEIGHT);
}

function buildFaqPageCanvas(locale: Locale): BuilderCanvasDocument {
  return createDecomposedPageCanvasDocument(locale, createFaqPageDecomposedNodes(0, locale, 0), FAQ_PAGE_ROOT_HEIGHT);
}

function buildPricingPageCanvas(locale: Locale): BuilderCanvasDocument {
  return createDecomposedPageCanvasDocument(locale, createPricingPageDecomposedNodes(0, locale, 0), PRICING_PAGE_ROOT_HEIGHT);
}

function buildReviewsPageCanvas(locale: Locale): BuilderCanvasDocument {
  return createDecomposedPageCanvasDocument(locale, createReviewsPageDecomposedNodes(0, locale, 0), REVIEWS_PAGE_ROOT_HEIGHT);
}

function buildPrivacyPageCanvas(locale: Locale): BuilderCanvasDocument {
  return createDecomposedPageCanvasDocument(locale, createPrivacyPageDecomposedNodes(0, locale, 0), PRIVACY_PAGE_ROOT_HEIGHT);
}

function buildDisclaimerPageCanvas(locale: Locale): BuilderCanvasDocument {
  return createDecomposedPageCanvasDocument(locale, createDisclaimerPageDecomposedNodes(0, locale, 0), DISCLAIMER_PAGE_ROOT_HEIGHT);
}

function buildColumnsPageCanvas(locale: Locale): BuilderCanvasDocument {
  const copy = pageCopy[locale].insights;
  const adminLabel = locale === 'ko' ? '글 추가/수정' : locale === 'zh-hant' ? '新增/編輯文章' : 'Add / edit posts';
  const publicLabel = locale === 'ko' ? '공개 칼럼 보기' : locale === 'zh-hant' ? '查看公開專欄' : 'View public columns';
  const helperText = locale === 'ko'
    ? '아래 피드는 기존 tseng-law.com 칼럼과 빌더에서 작성한 글을 같은 소스로 불러옵니다.'
    : locale === 'zh-hant'
      ? '下方動態會載入現有 tseng-law.com 專欄與編輯器建立的文章。'
      : 'The feed below loads the existing tseng-law.com columns and posts created in the builder.';

  const nodes: BuilderCanvasNode[] = [
    createHomeContainerNode({
      id: 'columns-page-root',
      rect: { x: 0, y: 0, width: STAGE_WIDTH, height: COLUMNS_PAGE_ROOT_HEIGHT },
      zIndex: 0,
      label: 'columns page root',
      as: 'main',
      background: '#f8fafc',
      borderColor: 'transparent',
    }),
    createHomeContainerNode({
      id: 'columns-hero',
      parentId: 'columns-page-root',
      rect: { x: 0, y: 0, width: STAGE_WIDTH, height: 330 },
      zIndex: 1,
      label: 'columns hero',
      as: 'section',
      background: '#0f172a',
      borderColor: 'transparent',
    }),
    createHomeTextNode({
      id: 'columns-page-eyebrow',
      parentId: 'columns-hero',
      rect: { x: 80, y: 72, width: 260, height: 24 },
      zIndex: 2,
      text: copy.label,
      as: 'p',
      fontSize: 14,
      color: '#bfdbfe',
      fontWeight: 'bold',
    }),
    createHomeTextNode({
      id: 'columns-page-title',
      parentId: 'columns-hero',
      rect: { x: 80, y: 112, width: 700, height: 78 },
      zIndex: 3,
      text: copy.title,
      as: 'h1',
      fontSize: 58,
      color: '#ffffff',
      fontWeight: 'bold',
    }),
    createHomeTextNode({
      id: 'columns-page-description',
      parentId: 'columns-hero',
      rect: { x: 80, y: 206, width: 620, height: 62 },
      zIndex: 4,
      text: copy.description,
      as: 'p',
      fontSize: 18,
      color: '#cbd5e1',
      fontWeight: 'regular',
    }),
    createHomeButtonNode({
      id: 'columns-admin-link',
      parentId: 'columns-hero',
      rect: { x: 820, y: 116, width: 170, height: 46 },
      zIndex: 5,
      label: adminLabel,
      href: `/${locale}/admin-builder/columns`,
      style: 'primary',
    }),
    createHomeButtonNode({
      id: 'columns-public-link',
      parentId: 'columns-hero',
      rect: { x: 1004, y: 116, width: 176, height: 46 },
      zIndex: 6,
      label: publicLabel,
      href: `/${locale}/columns`,
      style: 'outline',
    }),
    createHomeTextNode({
      id: 'columns-page-helper',
      parentId: 'columns-hero',
      rect: { x: 820, y: 184, width: 360, height: 82 },
      zIndex: 7,
      text: helperText,
      as: 'p',
      fontSize: 15,
      color: '#e2e8f0',
      fontWeight: 'regular',
    }),
    createHomeContainerNode({
      id: 'columns-feed-section',
      parentId: 'columns-page-root',
      rect: { x: 0, y: 330, width: STAGE_WIDTH, height: 2330 },
      zIndex: 8,
      label: 'columns feed section',
      as: 'section',
      background: '#ffffff',
      borderColor: 'transparent',
    }),
    createHomeTextNode({
      id: 'columns-feed-title',
      parentId: 'columns-feed-section',
      rect: { x: 80, y: 64, width: 420, height: 46 },
      zIndex: 9,
      text: locale === 'ko' ? '칼럼 목록' : locale === 'zh-hant' ? '專欄列表' : 'Column list',
      as: 'h2',
      fontSize: 34,
      color: '#0f172a',
      fontWeight: 'bold',
    }),
    createHomeTextNode({
      id: 'columns-feed-copy',
      parentId: 'columns-feed-section',
      rect: { x: 80, y: 120, width: 720, height: 44 },
      zIndex: 10,
      text: helperText,
      as: 'p',
      fontSize: 16,
      color: '#475569',
      fontWeight: 'regular',
    }),
    {
      id: 'columns-feed',
      kind: 'blog-feed',
      parentId: 'columns-feed-section',
      rect: { x: 80, y: 198, width: 1120, height: 2020 },
      style: createDefaultCanvasNodeStyle({ borderRadius: 0 }),
      zIndex: 11,
      rotation: 0,
      locked: false,
      visible: true,
      content: {
        layout: 'grid',
        postsPerPage: 50,
        showExcerpt: true,
        showAuthor: true,
        showDate: true,
        showReadingTime: true,
        showCategory: true,
        showTags: false,
        showFeaturedImage: true,
        sortBy: 'newest',
        columns: 3,
        gap: 24,
      },
    } as BuilderCanvasNode,
  ];

  return createDecomposedPageCanvasDocument(locale, nodes, COLUMNS_PAGE_ROOT_HEIGHT);
}

const pageSeeds: PageSeedDefinition[] = [
  {
    slug: '',
    isHomePage: true,
    titles: { ko: '홈', 'zh-hant': '首頁', en: 'Home' },
    buildDocument: createHomePageCanvasDocument,
  },
  {
    slug: 'about',
    titles: {
      ko: pageCopy.ko.about.title,
      'zh-hant': pageCopy['zh-hant'].about.title,
      en: pageCopy.en.about.title,
    },
    buildDocument: buildAboutPageCanvas,
  },
  {
    slug: 'services',
    titles: {
      ko: pageCopy.ko.services.title,
      'zh-hant': pageCopy['zh-hant'].services.title,
      en: pageCopy.en.services.title,
    },
    buildDocument: buildServicesPageCanvas,
  },
  {
    slug: 'contact',
    titles: {
      ko: pageCopy.ko.contact.title,
      'zh-hant': pageCopy['zh-hant'].contact.title,
      en: pageCopy.en.contact.title,
    },
    buildDocument: buildContactPageCanvas,
  },
  {
    slug: 'lawyers',
    titles: {
      ko: pageCopy.ko.lawyers.title,
      'zh-hant': pageCopy['zh-hant'].lawyers.title,
      en: pageCopy.en.lawyers.title,
    },
    buildDocument: buildLawyersPageCanvas,
  },
  {
    slug: 'faq',
    titles: {
      ko: pageCopy.ko.faq.title,
      'zh-hant': pageCopy['zh-hant'].faq.title,
      en: pageCopy.en.faq.title,
    },
    buildDocument: buildFaqPageCanvas,
  },
  {
    slug: 'pricing',
    includeInNavigation: false,
    titles: {
      ko: pageCopy.ko.pricing.title,
      'zh-hant': pageCopy['zh-hant'].pricing.title,
      en: pageCopy.en.pricing.title,
    },
    buildDocument: buildPricingPageCanvas,
  },
  {
    slug: 'reviews',
    includeInNavigation: false,
    titles: {
      ko: pageCopy.ko.reviews.title,
      'zh-hant': pageCopy['zh-hant'].reviews.title,
      en: pageCopy.en.reviews.title,
    },
    buildDocument: buildReviewsPageCanvas,
  },
  {
    slug: 'columns',
    titles: {
      ko: pageCopy.ko.insights.title,
      'zh-hant': pageCopy['zh-hant'].insights.title,
      en: pageCopy.en.insights.title,
    },
    buildDocument: buildColumnsPageCanvas,
  },
  {
    slug: 'privacy',
    includeInNavigation: false,
    titles: {
      ko: legalPageContent.ko.privacy.title,
      'zh-hant': legalPageContent['zh-hant'].privacy.title,
      en: legalPageContent.en.privacy.title,
    },
    buildDocument: buildPrivacyPageCanvas,
  },
  {
    slug: 'disclaimer',
    includeInNavigation: false,
    titles: {
      ko: legalPageContent.ko.disclaimer.title,
      'zh-hant': legalPageContent['zh-hant'].disclaimer.title,
      en: legalPageContent.en.disclaimer.title,
    },
    buildDocument: buildDisclaimerPageCanvas,
  },
];

const extraNavigationItems: Array<{
  id: string;
  pageId: string;
  href: string;
  label: Record<Locale, string>;
}> = [];

function findSeedPage(site: BuilderSiteDocument, locale: Locale, seed: PageSeedDefinition): BuilderPageMeta | undefined {
  const candidates = site.pages.filter((page) => matchesStandardPageSlugForLocale(page, locale, seed.slug));

  return [...candidates].sort((left, right) => {
    const publishedDelta = Number(Boolean(right.publishedAt)) - Number(Boolean(left.publishedAt));
    if (publishedDelta !== 0) return publishedDelta;

    return (right.updatedAt || right.createdAt).localeCompare(left.updatedAt || left.createdAt);
  })[0];
}

async function removeDuplicateSeedPages(
  siteId: string,
  locale: Locale,
  seed: PageSeedDefinition,
  preferredPageId: string,
) {
  const site = await readSiteDocument(siteId, locale);
  const duplicateIds = site.pages
    .filter((page) => {
      if (page.pageId === preferredPageId) return false;
      return matchesStandardPageSlugForLocale(page, locale, seed.slug);
    })
    .map((page) => page.pageId);

  if (duplicateIds.length === 0) return;

  site.pages = site.pages.filter((page) => !duplicateIds.includes(page.pageId));
  site.navigation = site.navigation.filter((item) => !duplicateIds.includes(item.pageId));
  site.updatedAt = new Date().toISOString();
  await writeSiteDocument(site, { preserveMissingPages: false, preserveMissingNavigation: false });
}

async function persistSeededPage(
  siteId: string,
  locale: Locale,
  target: BuilderPageMeta,
  seed: PageSeedDefinition,
) {
  target.slug = seed.slug;
  target.isHomePage = seed.isHomePage || false;
  target.title = seed.titles;
  target.locale = locale;
  target.documentKind = 'canvas-scene-vnext';
  target.lifecycle = {
    activeDocumentFamily: 'canvas-sandbox-v1',
    publishBackend: 'builder-snapshot',
    sceneStatus: 'seeded',
  };
  target.updatedAt = new Date().toISOString();

  const site = await readSiteDocument(siteId, locale);
  const siteTarget = site.pages.find((page) => page.pageId === target.pageId);
  if (!siteTarget) return;

  siteTarget.slug = target.slug;
  siteTarget.isHomePage = target.isHomePage;
  siteTarget.title = target.title;
  siteTarget.locale = target.locale;
  siteTarget.documentKind = target.documentKind;
  siteTarget.lifecycle = target.lifecycle;
  siteTarget.updatedAt = target.updatedAt;
  site.updatedAt = new Date().toISOString();
  await writeSiteDocument(site);

  const document = seed.buildDocument(locale);
  await writePageCanvas(siteId, siteTarget.pageId, 'draft', document);
  await publishPage(siteId, siteTarget.pageId, locale);
}

async function seedExistingHomeIfNeeded(
  siteId: string,
  locale: Locale,
  page: BuilderPageMeta,
  seed: PageSeedDefinition,
) {
  const [draft, published] = await Promise.all([
    readPageCanvas(siteId, page.pageId, 'draft'),
    readPageCanvas(siteId, page.pageId, 'published'),
  ]);
  const hasContent = Boolean((draft?.nodes?.length ?? 0) > 0 || (published?.nodes?.length ?? 0) > 0 || page.publishedAt);
  if (hasContent) return;

  await persistSeededPage(siteId, locale, page, seed);
}

async function seedExistingPageIfNeeded(
  siteId: string,
  locale: Locale,
  page: BuilderPageMeta,
  seed: PageSeedDefinition,
) {
  const [draft, published] = await Promise.all([
    readPageCanvas(siteId, page.pageId, 'draft'),
    readPageCanvas(siteId, page.pageId, 'published'),
  ]);

  const draftVersion = draft?.updatedBy;
  const publishedVersion = published?.updatedBy;
  const needsReseed =
    !page.publishedAt ||
    !draft ||
    !published ||
    (draft.nodes?.length ?? 0) === 0 ||
    (published.nodes?.length ?? 0) === 0 ||
    draftVersion !== SITE_PAGE_SEED_VERSION ||
    publishedVersion !== SITE_PAGE_SEED_VERSION;

  if (!needsReseed) return;
  await persistSeededPage(siteId, locale, page, seed);
}

async function createAndSeedPage(siteId: string, locale: Locale, seed: PageSeedDefinition) {
  const existing = findSeedPage(await readSiteDocument(siteId, locale), locale, seed);
  if (existing) {
    if (seed.isHomePage) {
      await seedExistingHomeIfNeeded(siteId, locale, existing, seed);
    } else {
      await seedExistingPageIfNeeded(siteId, locale, existing, seed);
    }
    return;
  }

  const created = await createPage(siteId, locale, seed.slug, seed.titles[locale]);
  const site = await readSiteDocument(siteId, locale);
  const target = site.pages.find((page) => page.pageId === created.pageId);
  if (!target) return;

  await persistSeededPage(siteId, locale, target, seed);
}

async function ensureStandardNavigation(siteId: string, locale: Locale) {
  const site = await readSiteDocument(siteId, locale);
  let changed = false;

  for (const seed of pageSeeds) {
    if (seed.includeInNavigation === false) continue;

    const page = findSeedPage(site, locale, seed);
    if (!page) continue;

    const href = seed.slug ? `/${seed.slug}` : '/';
    const existing = site.navigation.find((item) => item.pageId === page.pageId || item.href === href);
    if (existing) {
      if (existing.pageId !== page.pageId || existing.href !== href) {
        existing.pageId = page.pageId;
        existing.href = href;
        existing.label = seed.titles;
        changed = true;
      }
      continue;
    }

    site.navigation.push({
      id: `nav-${page.pageId}`,
      label: seed.titles,
      pageId: page.pageId,
      href,
    });
    changed = true;
  }

  for (const item of extraNavigationItems) {
    const existing = site.navigation.find((candidate) => (
      candidate.id === item.id ||
      candidate.pageId === item.pageId ||
      candidate.href === item.href
    ));
    if (existing) continue;
    site.navigation.push(item);
    changed = true;
  }

  if (!changed) return;
  site.updatedAt = new Date().toISOString();
  await writeSiteDocument(site);
}

async function seedSitePagesInternal(siteId: string, locale: Locale): Promise<void> {
  await ensureSiteDocument(siteId, locale);

  for (const seed of pageSeeds) {
    const site = await readSiteDocument(siteId, locale);
    const existing = findSeedPage(site, locale, seed);
    if (existing) {
      if (seed.isHomePage) {
        await seedExistingHomeIfNeeded(siteId, locale, existing, seed);
      } else {
        await seedExistingPageIfNeeded(siteId, locale, existing, seed);
      }
      await removeDuplicateSeedPages(siteId, locale, seed, existing.pageId);
      continue;
    }

    await createAndSeedPage(siteId, locale, seed);

    const refreshedSite = await readSiteDocument(siteId, locale);
    const created = findSeedPage(refreshedSite, locale, seed);
    if (created) {
      await removeDuplicateSeedPages(siteId, locale, seed, created.pageId);
    }
  }

  await ensureStandardNavigation(siteId, locale);
}

export async function seedSitePages(siteId: string, locale: Locale): Promise<void> {
  const normalizedSiteId = normalizeBuilderSiteId(siteId);
  const key = `${normalizedSiteId}:${locale}`;
  const existingTask = seedSitePagesInFlight.get(key);
  if (existingTask) {
    await existingTask;
    return;
  }

  const task = seedSitePagesInternal(normalizedSiteId, locale).finally(() => {
    seedSitePagesInFlight.delete(key);
  });
  seedSitePagesInFlight.set(key, task);
  await task;
}
