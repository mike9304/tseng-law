import { isStandalonePublishParityAnchor } from '../decomposable-slugs';
import { afterAll, describe, expect, it } from 'vitest';
import { rm } from 'fs/promises';
import path from 'path';
import {
  isLegacyReviewLayoutClassName,
  STANDARD_PAGE_DECOMPOSERS,
  seedSitePages,
} from '../seed-pages';
import {
  publishPage,
  readPageCanvas,
  readSiteDocument,
  writePageCanvas,
} from '@/lib/builder/site/persistence';
import type { BuilderCanvasNode } from '../types';
import { normalizeBuilderSiteId } from '@/lib/builder/site/identity';
import { matchesStandardPageSlugForLocale } from '@/lib/builder/site/standard-pages';

const SITE_ID = normalizeBuilderSiteId('composite-verify-it');
const POISONED_SITE_ID = normalizeBuilderSiteId('composite-poisoned-current-version-it');
const SERVICES_SITE_ID = normalizeBuilderSiteId('services-canonical-draft-it');
const POISONED_SERVICES_SITE_ID = normalizeBuilderSiteId('services-poisoned-draft-it');
const POISONED_REVIEWS_SITE_ID = normalizeBuilderSiteId('reviews-poisoned-class-it');
const LOCALE = 'ko' as const;

const LEGACY_COMPOSITE_NODE_COUNT = 2;

afterAll(async () => {
  for (const siteId of [SITE_ID, POISONED_SITE_ID, SERVICES_SITE_ID, POISONED_SERVICES_SITE_ID, POISONED_REVIEWS_SITE_ID]) {
    await rm(path.join(process.cwd(), 'runtime-data', 'builder-site', siteId), {
      recursive: true,
      force: true,
    }).catch(() => {});
  }
});

describe('seedSitePages end-to-end publishes live-reflecting standard page composites', () => {
  it('seeds + publishes the about page as the live legacy composite', async () => {
    await seedSitePages(SITE_ID, LOCALE);

    const site = await readSiteDocument(SITE_ID, LOCALE);
    const aboutMeta = site.pages.find((page) =>
      matchesStandardPageSlugForLocale(page, LOCALE, 'about'),
    );
    expect(aboutMeta, 'about page must be seeded into the site').toBeDefined();
    if (!aboutMeta) return;

    const published = await readPageCanvas(SITE_ID, aboutMeta.pageId, 'published');
    expect(published, 'about page must be published').toBeDefined();
    if (!published) return;

    const composite = published.nodes.find((node) => node.kind === 'composite');
    expect(published.nodes).toHaveLength(LEGACY_COMPOSITE_NODE_COUNT);
    expect(composite?.content.componentKey).toBe('legacy-page-about');
  }, 30_000);

  it('seeds services with a live published composite and editable decomposed draft', async () => {
    await seedSitePages(SERVICES_SITE_ID, LOCALE);

    const site = await readSiteDocument(SERVICES_SITE_ID, LOCALE);
    const servicesMeta = site.pages.find((page) =>
      matchesStandardPageSlugForLocale(page, LOCALE, 'services'),
    );
    expect(servicesMeta, 'services page must be seeded into the site').toBeDefined();
    if (!servicesMeta) return;

    const draft = await readPageCanvas(SERVICES_SITE_ID, servicesMeta.pageId, 'draft');
    const published = await readPageCanvas(SERVICES_SITE_ID, servicesMeta.pageId, 'published');
    expect(draft, 'services draft must be editable decomposed').toBeDefined();
    expect(published, 'services page must be published').toBeDefined();
    if (!draft || !published) return;

    const publishedComposite = published.nodes.find((node) => node.kind === 'composite');
    expect(published.nodes).toHaveLength(LEGACY_COMPOSITE_NODE_COUNT);
    expect(publishedComposite?.content.componentKey).toBe('legacy-page-services');
    expect(draft.nodes.some((node) => node.id === 'page-services-page-header-root')).toBe(true);
    expect(draft.nodes.some((node) => node.id === 'home-services-root')).toBe(true);
    // Standalone publish-parity overlays are the only composites allowed in
    // the editable draft (hidden in the editor, shown on publish).
    expect(draft.nodes.some((node) => node.kind === 'composite'
      && node.content.componentKey === 'legacy-page-services'
      && !isStandalonePublishParityAnchor(node.anchorName))).toBe(false);
  }, 30_000);

  it('repairs a composite services draft back to the editable decomposed services draft', async () => {
    await seedSitePages(POISONED_SERVICES_SITE_ID, LOCALE);

    const initialSite = await readSiteDocument(POISONED_SERVICES_SITE_ID, LOCALE);
    const servicesMeta = initialSite.pages.find((page) =>
      matchesStandardPageSlugForLocale(page, LOCALE, 'services'),
    );
    expect(servicesMeta, 'services page must be seeded before poisoning').toBeDefined();
    if (!servicesMeta) return;

    const compositeServices = await readPageCanvas(POISONED_SERVICES_SITE_ID, servicesMeta.pageId, 'published');
    expect(compositeServices, 'services page must be published before poisoning').toBeDefined();
    if (!compositeServices) return;

    await writePageCanvas(POISONED_SERVICES_SITE_ID, servicesMeta.pageId, 'draft', compositeServices);

    await seedSitePages(POISONED_SERVICES_SITE_ID, LOCALE);

    const repairedDraft = await readPageCanvas(POISONED_SERVICES_SITE_ID, servicesMeta.pageId, 'draft');
    const repairedPublished = await readPageCanvas(POISONED_SERVICES_SITE_ID, servicesMeta.pageId, 'published');
    expect(repairedDraft, 'services draft must be repaired to decomposed').toBeDefined();
    expect(repairedPublished, 'services published page must remain live composite').toBeDefined();
    if (!repairedDraft || !repairedPublished) return;

    const publishedComposite = repairedPublished.nodes.find((node) => node.kind === 'composite');
    expect(publishedComposite?.content.componentKey).toBe('legacy-page-services');
    expect(repairedDraft.nodes.some((node) => node.id === 'page-services-page-header-root')).toBe(true);
    expect(repairedDraft.nodes.some((node) => node.id === 'home-services-root')).toBe(true);
  }, 30_000);

  it('repairs current-version decomposed standard pages back to live composites', async () => {
    await seedSitePages(POISONED_SITE_ID, LOCALE);

    const initialSite = await readSiteDocument(POISONED_SITE_ID, LOCALE);
    const aboutMeta = initialSite.pages.find((page) =>
      matchesStandardPageSlugForLocale(page, LOCALE, 'about'),
    );
    expect(aboutMeta, 'about page must be seeded before poisoning').toBeDefined();
    if (!aboutMeta) return;

    const poisoned = STANDARD_PAGE_DECOMPOSERS.about(LOCALE);
    await writePageCanvas(POISONED_SITE_ID, aboutMeta.pageId, 'draft', poisoned);
    await publishPage(POISONED_SITE_ID, aboutMeta.pageId, LOCALE);

    const poisonedPublished = await readPageCanvas(POISONED_SITE_ID, aboutMeta.pageId, 'published');
    expect(poisonedPublished?.nodes.length).toBeGreaterThan(LEGACY_COMPOSITE_NODE_COUNT);
    expect(poisonedPublished?.nodes.some((node) => node.kind === 'composite' && !isStandalonePublishParityAnchor(node.anchorName))).toBe(false);
    expect(poisonedPublished?.updatedBy).toBe(poisoned.updatedBy);

    await seedSitePages(POISONED_SITE_ID, LOCALE);

    const repaired = await readPageCanvas(POISONED_SITE_ID, aboutMeta.pageId, 'published');
    expect(repaired, 'poisoned page must remain published after repair').toBeDefined();
    if (!repaired) return;

    const composite = repaired.nodes.find((node) => node.kind === 'composite');
    expect(repaired.nodes).toHaveLength(LEGACY_COMPOSITE_NODE_COUNT);
    expect(composite?.content.componentKey).toBe('legacy-page-about');
  }, 30_000);

  it('repairs current-version decomposed reviews pages to the live composite', async () => {
    await seedSitePages(POISONED_REVIEWS_SITE_ID, LOCALE);

    const initialSite = await readSiteDocument(POISONED_REVIEWS_SITE_ID, LOCALE);
    const reviewsMeta = initialSite.pages.find((page) =>
      matchesStandardPageSlugForLocale(page, LOCALE, 'reviews'),
    );
    expect(reviewsMeta, 'reviews page must be seeded before poisoning').toBeDefined();
    if (!reviewsMeta) return;

    const published = await readPageCanvas(POISONED_REVIEWS_SITE_ID, reviewsMeta.pageId, 'published');
    expect(published, 'reviews page must be published before poisoning').toBeDefined();
    if (!published) return;

    const decomposedReviews = STANDARD_PAGE_DECOMPOSERS.reviews(LOCALE);
    const poisoned = {
      ...decomposedReviews,
      nodes: decomposedReviews.nodes.map((node): BuilderCanvasNode => {
        if (node.kind !== 'container' || node.id !== 'page-reviews-form-wrap') return node;
        return {
          ...node,
          content: {
            ...node.content,
            className: 'review-form-wrap',
          },
        };
      }),
    };
    await writePageCanvas(POISONED_REVIEWS_SITE_ID, reviewsMeta.pageId, 'draft', poisoned);
    await publishPage(POISONED_REVIEWS_SITE_ID, reviewsMeta.pageId, LOCALE);

    await seedSitePages(POISONED_REVIEWS_SITE_ID, LOCALE);

    const repaired = await readPageCanvas(POISONED_REVIEWS_SITE_ID, reviewsMeta.pageId, 'published');
    expect(repaired, 'poisoned reviews page must remain published after repair').toBeDefined();
    if (!repaired) return;

    const composite = repaired.nodes.find((node) => node.kind === 'composite');
    expect(repaired.nodes).toHaveLength(LEGACY_COMPOSITE_NODE_COUNT);
    expect(composite?.content.componentKey).toBe('legacy-page-reviews');
    expect(repaired.nodes.some((node) => node.id === 'page-reviews-form-wrap')).toBe(false);
    expect(repaired.nodes.some((node) => hasLegacyReviewClass(node))).toBe(false);
  }, 30_000);
});

function hasLegacyReviewClass(node: BuilderCanvasNode): boolean {
  if (!node.id.startsWith('page-reviews-')) return false;
  if (!('className' in node.content) || typeof node.content.className !== 'string') return false;
  return isLegacyReviewLayoutClassName(node.content.className);
}
