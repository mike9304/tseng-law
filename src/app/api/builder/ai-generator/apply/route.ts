import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import { siteSpecSchema } from '@/lib/builder/ai-generator/site-spec';
import { generateSiteDraft, type GeneratedSiteDraft, type GeneratedSitePlanPage } from '@/lib/builder/ai-generator/orchestrator';
import {
  draftToCanvasNodes,
  draftToSitemapPageCanvasNodes,
} from '@/lib/builder/ai-generator/canvas-import';
import { CANVAS_SANDBOX_UPDATED_BY, normalizeCanvasDocument } from '@/lib/builder/canvas/types';
import {
  createPage,
  deletePage,
  readSiteDocument,
  writeSiteDocument,
  writePageCanvas,
} from '@/lib/builder/site/persistence';
import type { BuilderNavItem, BuilderPageMeta, BuilderSeoMetadata } from '@/lib/builder/site/types';
import { buildSitePagePath } from '@/lib/builder/site/paths';
import { normalizeLocale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const payloadSchema = z.object({
  spec: siteSpecSchema,
  slug: z.string().trim().max(120).optional(),
  title: z.string().trim().min(1).max(200).optional(),
  scope: z.enum(['single', 'sitemap']).optional().default('single'),
  pageSlugs: z.array(z.string().trim().max(120)).max(10).optional(),
  addToNavigation: z.boolean().optional().default(false),
});

const PAGE_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const RESERVED_SLUGS = new Set(['admin', 'admin-builder', 'api', 'builder', 'home']);

function normalizeDraftSlug(slug: string): string {
  return slug.trim().replace(/^\/+|\/+$/g, '');
}

function sitemapSlugToDraftSlug(slug: string): string {
  return normalizeDraftSlug(slug);
}

function compactSeoText(value: string, maxLength: number): string {
  const compact = value.replace(/\s+/g, ' ').trim();
  if (compact.length <= maxLength) return compact;
  const clipped = compact.slice(0, Math.max(0, maxLength - 1)).trim();
  const lastSpace = clipped.lastIndexOf(' ');
  return `${(lastSpace > 80 ? clipped.slice(0, lastSpace) : clipped).trim()}…`;
}

function buildDraftSeoMetadata(
  draft: GeneratedSiteDraft,
  fallbackTitle: string,
  page?: GeneratedSitePlanPage,
): BuilderSeoMetadata {
  const heroTitle = (page?.title ?? draft.content.hero.headline).trim() || fallbackTitle;
  const company = draft.spec.companyName.trim();
  const rawTitle = heroTitle.includes(company) ? heroTitle : `${heroTitle} | ${company}`;
  const title = compactSeoText(rawTitle, 70);
  const description = compactSeoText([
    page?.purpose,
    draft.content.hero.body,
    draft.plan.brandBrief.goals[0],
  ].filter(Boolean).join(' '), 155);
  const focusKeyword = draft.spec.brandKeywords?.[0] ?? draft.plan.brandBrief.keywords[0];

  return {
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    focusKeyword,
  };
}

async function writeCreatedPageSeo(pageId: string, locale: ReturnType<typeof normalizeLocale>, seo: BuilderSeoMetadata) {
  const site = await readSiteDocument('default', locale);
  const page = site.pages.find((entry) => entry.pageId === pageId);
  if (!page) throw new Error(`Created page ${pageId} was not found for SEO seed`);
  page.seo = seo;
  page.updatedAt = new Date().toISOString();
  site.updatedAt = page.updatedAt;
  await writeSiteDocument(site);
}

function hasNavigationItem(items: BuilderNavItem[], page: BuilderPageMeta, href: string): boolean {
  return items.some((item) => (
    item.pageId === page.pageId
    || item.href === href
    || Boolean(item.children?.length && hasNavigationItem(item.children, page, href))
  ));
}

async function addCreatedPageToNavigation(pageId: string, locale: ReturnType<typeof normalizeLocale>): Promise<boolean> {
  const site = await readSiteDocument('default', locale);
  const page = site.pages.find((entry) => entry.pageId === pageId);
  if (!page) throw new Error(`Created page ${pageId} was not found for navigation`);
  const href = buildSitePagePath(locale, page.slug || '');
  if (hasNavigationItem(site.navigation ?? [], page, href)) return false;
  site.navigation = [
    ...(site.navigation ?? []),
    {
      id: `nav-${page.pageId}`,
      label: page.title,
      pageId: page.pageId,
      href,
    },
  ];
  site.updatedAt = new Date().toISOString();
  await writeSiteDocument(site);
  return true;
}

type ApplyTarget = {
  slug: string;
  title: string;
  planPage?: GeneratedSitePlanPage;
};

type SkippedSitemapPage = {
  title: string;
  slug: string;
  reason: 'home_page' | 'invalid_slug' | 'reserved_slug' | 'duplicate_slug';
};

function collectSitemapTargets(
  draft: GeneratedSiteDraft,
  existingSlugs: Set<string>,
  selectedSlugs?: Set<string>,
): { targets: ApplyTarget[]; skipped: SkippedSitemapPage[] } {
  const targets: ApplyTarget[] = [];
  const skipped: SkippedSitemapPage[] = [];
  const plannedSlugs = new Set<string>();

  for (const page of draft.plan.sitemap.slice(0, 10)) {
    const slug = sitemapSlugToDraftSlug(page.slug);
    if (selectedSlugs && !selectedSlugs.has(slug)) continue;
    if (!slug) {
      skipped.push({ title: page.title, slug: page.slug, reason: 'home_page' });
      continue;
    }
    if (!PAGE_SLUG_PATTERN.test(slug)) {
      skipped.push({ title: page.title, slug, reason: 'invalid_slug' });
      continue;
    }
    if (RESERVED_SLUGS.has(slug)) {
      skipped.push({ title: page.title, slug, reason: 'reserved_slug' });
      continue;
    }
    if (existingSlugs.has(slug) || plannedSlugs.has(slug)) {
      skipped.push({ title: page.title, slug, reason: 'duplicate_slug' });
      continue;
    }
    plannedSlugs.add(slug);
    targets.push({ slug, title: page.title, planPage: page });
  }

  return { targets, skipped };
}

function buildCanvasForTarget(draft: GeneratedSiteDraft, locale: ReturnType<typeof normalizeLocale>, pageId: string, target: ApplyTarget) {
  return target.planPage
    ? draftToSitemapPageCanvasNodes({ draft, locale, pageId, page: target.planPage })
    : draftToCanvasNodes({ draft, locale, pageId });
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const parsed = payloadSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload', details: parsed.error.issues.slice(0, 3) }, { status: 400 });
  }

  const locale = normalizeLocale(parsed.data.spec.locale);
  const scope = parsed.data.scope ?? 'single';

  const site = await readSiteDocument('default', locale);
  const existingSlugs = new Set(site.pages.filter((entry) => entry.locale === locale).map((entry) => entry.slug));
  let targets: ApplyTarget[] = [];
  let skippedPages: SkippedSitemapPage[] = [];
  let draft: GeneratedSiteDraft | null = null;

  if (scope === 'single') {
    const slug = normalizeDraftSlug(parsed.data.slug ?? '');
    if (!slug || !PAGE_SLUG_PATTERN.test(slug) || RESERVED_SLUGS.has(slug)) {
      return NextResponse.json(
        {
          ok: false,
          error: 'invalid_slug',
          message: 'Slug must use lowercase letters, numbers, and single hyphens only.',
        },
        { status: 400 },
      );
    }
    const duplicate = site.pages.find((entry) => entry.locale === locale && entry.slug === slug);
    if (duplicate) {
      return NextResponse.json(
        {
          ok: false,
          error: 'duplicate_slug',
          message: 'A page with this slug already exists.',
          pageId: duplicate.pageId,
          slug,
        },
        { status: 409 },
      );
    }
    targets = [{ slug, title: parsed.data.title ?? parsed.data.spec.companyName }];
  } else {
    draft = await generateSiteDraft(parsed.data.spec);
    const selectedSlugs = parsed.data.pageSlugs
      ? new Set(parsed.data.pageSlugs.map(sitemapSlugToDraftSlug).filter(Boolean))
      : undefined;
    if (selectedSlugs && selectedSlugs.size === 0) {
      return NextResponse.json(
        {
          ok: false,
          error: 'no_selected_sitemap_pages',
          message: 'Select at least one sitemap page to create.',
          skippedPages: [],
        },
        { status: 400 },
      );
    }
    const collected = collectSitemapTargets(draft, existingSlugs, selectedSlugs);
    targets = collected.targets;
    skippedPages = collected.skipped;
    if (targets.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          error: 'no_sitemap_pages_created',
          message: 'No sitemap draft pages could be created. Existing or invalid slugs were skipped.',
          skippedPages,
        },
        { status: 409 },
      );
    }
  }

  draft ??= await generateSiteDraft(parsed.data.spec);
  let totalNodeCount = 0;
  const createdPageIds: string[] = [];
  const createdPages: Array<{ pageId: string; slug: string; title: string; nodeCount: number }> = [];
  const navigationAdded: string[] = [];

  try {
    for (const target of targets) {
      const meta = await createPage(
        'default',
        locale,
        target.slug,
        target.title,
      );
      createdPageIds.push(meta.pageId);
      const seo = buildDraftSeoMetadata(draft, target.title, target.planPage);
      await writeCreatedPageSeo(meta.pageId, locale, seo);
      const nodes = buildCanvasForTarget(draft, locale, meta.pageId, target);
      const nodeCount = nodes.length;
      totalNodeCount += nodeCount;
      const stageHeight = Math.max(
        880,
        nodes.reduce((height, node) => Math.max(height, node.rect.y + node.rect.height), 0),
      );

      await writePageCanvas('default', meta.pageId, 'draft', normalizeCanvasDocument({
        version: 1,
        locale,
        updatedAt: new Date().toISOString(),
        updatedBy: CANVAS_SANDBOX_UPDATED_BY,
        stageWidth: 1280,
        stageHeight,
        title: meta.title[locale] || meta.title.ko,
        nodes,
      }, locale));
      if (parsed.data.addToNavigation) {
        const added = await addCreatedPageToNavigation(meta.pageId, locale);
        if (added) navigationAdded.push(meta.slug);
      }
      createdPages.push({
        pageId: meta.pageId,
        slug: meta.slug,
        title: meta.title[locale] || meta.title.ko,
        nodeCount,
      });
    }
  } catch {
    await Promise.all(createdPageIds.map((pageId) =>
      deletePage('default', pageId, locale).catch(() => undefined),
    ));
    return NextResponse.json(
      {
        ok: false,
        error: 'apply_failed',
        message: scope === 'sitemap'
          ? 'Sitemap draft creation failed and all created pages were rolled back.'
          : 'Draft page creation failed and was rolled back.',
      },
      { status: 500 },
    );
  }

  const firstPage = createdPages[0];

  return NextResponse.json({
    ok: true,
    scope,
    pageId: firstPage?.pageId,
    slug: firstPage?.slug,
    pages: createdPages,
    skippedPages,
    navigationAdded,
    nodeCount: totalNodeCount,
    locale,
    seoSeeded: true,
  });
}
