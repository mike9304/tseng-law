import type { Locale } from '@/lib/locales';
import {
  type BuilderCanvasNode,
  type BuilderCanvasDocument,
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

const STAGE_WIDTH = 1280;
const SITE_PAGE_SEED_VERSION = 'site-page-seed-v3';
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
}> = [
  {
    id: 'nav-columns',
    pageId: 'external-columns',
    href: '/columns',
    label: { ko: '칼럼', 'zh-hant': '專欄', en: 'Columns' },
  },
];

function findSeedPage(site: BuilderSiteDocument, seed: PageSeedDefinition): BuilderPageMeta | undefined {
  const candidates = seed.isHomePage
    ? site.pages.filter((page) => page.isHomePage || page.slug === '')
    : site.pages.filter((page) => page.slug === seed.slug);

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
      if (seed.isHomePage) return page.isHomePage || page.slug === '';
      return page.slug === seed.slug;
    })
    .map((page) => page.pageId);

  if (duplicateIds.length === 0) return;

  site.pages = site.pages.filter((page) => !duplicateIds.includes(page.pageId));
  site.navigation = site.navigation.filter((item) => !duplicateIds.includes(item.pageId));
  site.updatedAt = new Date().toISOString();
  await writeSiteDocument(site);
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
  const existing = findSeedPage(await readSiteDocument(siteId, locale), seed);
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

    const page = findSeedPage(site, seed);
    if (!page) continue;

    const href = seed.slug ? `/${seed.slug}` : '/';
    const existing = site.navigation.find((item) => item.pageId === page.pageId || item.href === href);
    if (existing) continue;

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
    const existing = findSeedPage(site, seed);
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
    const created = findSeedPage(refreshedSite, seed);
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
