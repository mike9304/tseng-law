import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { normalizeLocale, type Locale } from '@/lib/locales';
import {
  listPages,
  createPage,
  readPageCanvas,
  readPageCanvasRecordState,
  readSiteDocument,
  writePageCanvas,
  writeSiteDocument,
} from '@/lib/builder/site/persistence';
import { normalizeCanvasDocument, createDefaultCanvasDocument, createBlankCanvasDocument } from '@/lib/builder/canvas/types';
import { SEED_DRAFT_UPDATED_BY } from '@/lib/builder/canvas/home-draft-reseed';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';
import type { BuilderNavItem, BuilderPageMeta } from '@/lib/builder/site/types';
import { buildSitePagePath } from '@/lib/builder/site/paths';
import {
  isSupportedDynamicListCollectionId,
} from '@/lib/builder/dynamic-list-pages';
import {
  isSupportedDynamicItemCollectionId,
} from '@/lib/builder/dynamic-item-pages';
import { isValidBuilderSlug, normalizeSeoSlugInput } from '@/lib/builder/seo/validation';
import {
  getBuilderSiteApiErrorPayload,
  type BuilderSiteApiErrorCode,
} from '@/lib/builder/site/site-api-copy';
import {
  resolveBuilderSiteIdForMutationFromRequest,
  resolveBuilderSiteIdFromRequest,
} from '@/lib/builder/site/admin-routing';
import { normalizeMemberAccessInput } from '@/lib/builder/site/member-access-input';
import { SiteInvariantError, type SiteInvariantIssue } from '@/lib/builder/site/site-invariants';
import type { CreatePageRequestBody } from './create-page-request';
import {
  createCreatePageDynamicCanvas,
  resolveCreatePageTitle,
  writeCreatePageDynamicMeta,
} from './dynamic-page-create';

export const runtime = 'nodejs';

type PageListMeta = BuilderPageMeta & {
  draftSavedAt?: string;
  draftRevision?: number;
  hasUnpublishedChanges: boolean;
};

function timestampMs(value: string | undefined): number | null {
  if (!value) return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function pageHasUnpublishedChanges(
  page: BuilderPageMeta,
  draftState: Awaited<ReturnType<typeof readPageCanvasRecordState>>,
): boolean {
  if (!page.publishedAt || !draftState) return false;
  const draftRevision = draftState.record.revision;
  if (typeof page.lastPublishedDraftRevision === 'number') {
    return draftRevision > page.lastPublishedDraftRevision;
  }
  const draftSavedMs = timestampMs(draftState.record.savedAt);
  const publishedSavedMs = timestampMs(page.publishedSavedAt ?? page.publishedAt);
  return draftSavedMs !== null && publishedSavedMs !== null && draftSavedMs > publishedSavedMs;
}

async function withDraftState(siteId: string, page: BuilderPageMeta): Promise<PageListMeta> {
  const draftState = await readPageCanvasRecordState(siteId, page.pageId, 'draft');
  return {
    ...page,
    ...(draftState
      ? {
        draftSavedAt: draftState.record.savedAt,
        draftRevision: draftState.record.revision,
      }
      : {}),
    hasUnpublishedChanges: pageHasUnpublishedChanges(page, draftState),
  };
}

function pageRouteErrorResponse(
  locale: Locale,
  errorCode: BuilderSiteApiErrorCode,
  status: number,
  extra: Record<string, unknown> = {},
): NextResponse {
  return NextResponse.json(
    { ok: false, success: false, ...getBuilderSiteApiErrorPayload(locale, errorCode), ...extra },
    { status },
  );
}

function sanitizeSiteInvariantIssues(issues: readonly SiteInvariantIssue[]) {
  return issues.map((issue) => ({
    code: issue.code,
    ...(issue.pageId !== undefined ? { pageId: issue.pageId } : {}),
    ...(issue.conflictingPageId !== undefined ? { conflictingPageId: issue.conflictingPageId } : {}),
    ...(issue.locale !== undefined ? { locale: issue.locale } : {}),
    ...(issue.slug !== undefined ? { slug: issue.slug } : {}),
    ...(issue.field !== undefined ? { field: issue.field } : {}),
  }));
}

function siteInvariantConflictResponse(
  locale: Locale,
  error: SiteInvariantError,
): NextResponse {
  const copy = getBuilderSiteApiErrorPayload(locale, 'page_create_failed');
  return NextResponse.json(
    {
      ok: false,
      success: false,
      error: copy.error,
      errorCode: 'site_invariant_conflict',
      issues: sanitizeSiteInvariantIssues(error.issues),
    },
    { status: 409 },
  );
}

export async function GET(request: NextRequest) {
  const auth = await guardBuilderReadWithPermission(request, 'edit-pages');
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  const siteId = resolveBuilderSiteIdFromRequest(request);
  try {
    const pages = await listPages(siteId, locale);
    const pagesWithDraftState = await Promise.all(pages.map((page) => withDraftState(siteId, page)));
    return NextResponse.json({ pages: pagesWithDraftState });
  } catch {
    return pageRouteErrorResponse(locale, 'pages_list_failed', 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  let body: CreatePageRequestBody;
  try {
    body = (await request.json()) as CreatePageRequestBody;
  } catch {
    const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
    return pageRouteErrorResponse(locale, 'invalid_json', 400);
  }

  const locale = normalizeLocale(body.locale || request.nextUrl.searchParams.get('locale') || 'ko');
  const siteResolution = resolveBuilderSiteIdForMutationFromRequest(request, body.siteId);
  if (!siteResolution.ok) return siteResolution.response;
  const siteId = siteResolution.siteId;
  const rawDynamicListCollectionId = body.dynamicListCollectionId?.trim();
  const dynamicListCollectionId = isSupportedDynamicListCollectionId(rawDynamicListCollectionId)
    ? rawDynamicListCollectionId
    : null;
  if (rawDynamicListCollectionId && !dynamicListCollectionId) {
    return pageRouteErrorResponse(locale, 'unsupported_dynamic_list_collection', 400);
  }
  const rawDynamicListCmsCollectionId = body.dynamicListCmsCollectionId?.trim();
  const rawDynamicItemCollectionId = body.dynamicItemCollectionId?.trim();
  const dynamicItemCollectionId = isSupportedDynamicItemCollectionId(rawDynamicItemCollectionId)
    ? rawDynamicItemCollectionId
    : null;
  if (rawDynamicItemCollectionId && !dynamicItemCollectionId) {
    return pageRouteErrorResponse(locale, 'unsupported_dynamic_item_collection', 400);
  }
  const rawDynamicItemCmsCollectionId = body.dynamicItemCmsCollectionId?.trim();
  const hasDynamicListSelection = Boolean(dynamicListCollectionId || rawDynamicListCmsCollectionId);
  const hasDynamicItemSelection = Boolean(dynamicItemCollectionId || rawDynamicItemCmsCollectionId);
  if (hasDynamicListSelection && hasDynamicItemSelection) {
    return pageRouteErrorResponse(locale, 'ambiguous_dynamic_page_kind', 400);
  }
  if (dynamicListCollectionId && rawDynamicListCmsCollectionId) {
    return pageRouteErrorResponse(locale, 'ambiguous_dynamic_page_kind', 400);
  }
  if (dynamicItemCollectionId && rawDynamicItemCmsCollectionId) {
    return pageRouteErrorResponse(locale, 'ambiguous_dynamic_page_kind', 400);
  }
  const rawSlug = normalizeSeoSlugInput(body.slug ?? '');
  const slug = rawSlug || `page-${Date.now().toString(36)}`;

  if (slug.length > 200 || (rawSlug && !isValidBuilderSlug(slug))) {
    return pageRouteErrorResponse(locale, 'invalid_slug', 400);
  }

  try {
    const site = await readSiteDocument(siteId, locale);
    const duplicate = site.pages.find((entry) => (
      entry.locale === locale && normalizeSeoSlugInput(entry.slug) === slug
    ));
    if (duplicate) {
      return pageRouteErrorResponse(locale, 'duplicate_slug', 409, { pageId: duplicate.pageId });
    }
    const cmsDynamicListCollection = rawDynamicListCmsCollectionId
      ? site.cmsCollections?.find((collection) => collection.collectionId === rawDynamicListCmsCollectionId) ?? null
      : null;
    if (rawDynamicListCmsCollectionId && !cmsDynamicListCollection) {
      return pageRouteErrorResponse(locale, 'unsupported_dynamic_list_collection', 400);
    }
    const cmsDynamicItemCollection = rawDynamicItemCmsCollectionId
      ? site.cmsCollections?.find((collection) => collection.collectionId === rawDynamicItemCmsCollectionId) ?? null
      : null;
    if (rawDynamicItemCmsCollectionId && !cmsDynamicItemCollection) {
      return pageRouteErrorResponse(locale, 'unsupported_dynamic_item_collection', 400);
    }
    const dynamicSelection = {
      dynamicListCollectionId,
      cmsDynamicListCollection,
      dynamicItemCollectionId,
      cmsDynamicItemCollection,
    };
    const title = resolveCreatePageTitle({ bodyTitle: body.title, locale, selection: dynamicSelection });

    const page = await createPage(siteId, locale, slug, title);
    let createdPage = page;

    createdPage = await writeCreatePageDynamicMeta({
      siteId,
      locale,
      pageId: page.pageId,
      body,
      selection: dynamicSelection,
    }) ?? createdPage;

    if (body.linkedFromPageId) {
      const nextSite = await readSiteDocument(siteId, locale);
      const sourcePage = nextSite.pages.find((entry) => entry.pageId === body.linkedFromPageId);
      const createdPage = nextSite.pages.find((entry) => entry.pageId === page.pageId);
      if (sourcePage && createdPage) {
        sourcePage.linkedPageIds = { ...(sourcePage.linkedPageIds ?? {}), [locale]: page.pageId };
        createdPage.linkedPageIds = {
          ...(createdPage.linkedPageIds ?? {}),
          [sourcePage.locale]: sourcePage.pageId,
        };
        createdPage.title = { ...sourcePage.title, [locale]: title };
        nextSite.updatedAt = new Date().toISOString();
        await writeSiteDocument(nextSite);
      }
    }

    const memberAccess = normalizeMemberAccessInput(body.memberAccess);
    if (memberAccess) {
      const nextSite = await readSiteDocument(siteId, locale);
      const memberPage = nextSite.pages.find((entry) => entry.pageId === page.pageId);
      if (memberPage) {
        memberPage.memberAccess = memberAccess;
        memberPage.updatedAt = new Date().toISOString();
        nextSite.updatedAt = memberPage.updatedAt;
        await writeSiteDocument(nextSite);
        createdPage = memberPage;
      }
    }

    if (body.addToNavigation === true) {
      const nextSite = await readSiteDocument(siteId, locale);
      const createdPage = nextSite.pages.find((entry) => entry.pageId === page.pageId);
      if (createdPage) {
        const href = buildSitePagePath(locale, createdPage.slug || '');
        const hasNavigationItem = (items: BuilderNavItem[]): boolean => items.some((item) => (
          item.pageId === createdPage.pageId
          || item.href === href
          || Boolean(item.children?.length && hasNavigationItem(item.children))
        ));
        if (!hasNavigationItem(nextSite.navigation ?? [])) {
          nextSite.navigation = [
            ...(nextSite.navigation ?? []),
            {
              id: `nav-${createdPage.pageId}`,
              label: createdPage.title,
              pageId: createdPage.pageId,
              href,
            },
          ];
          nextSite.updatedAt = new Date().toISOString();
          await writeSiteDocument(nextSite);
          try {
            revalidatePath(buildSitePagePath(locale, ''));
            revalidatePath(href);
          } catch {
            // Best effort: local dev and tests read the latest site document directly.
          }
        }
      }
    }

    // Save the initial canvas document (template or blank)
    const sourceCanvas = body.linkedFromPageId
      ? await readPageCanvas(siteId, body.linkedFromPageId, 'draft')
      : null;
    const dynamicCanvas = createCreatePageDynamicCanvas({ locale, selection: dynamicSelection });
    const canvasDoc = body.document
      ? normalizeCanvasDocument(body.document, locale)
      : dynamicCanvas
        ? dynamicCanvas
      : body.blank
        ? createBlankCanvasDocument(locale)
      : sourceCanvas
        ? normalizeCanvasDocument({ ...sourceCanvas, locale }, locale)
        : createDefaultCanvasDocument(locale);
    await writePageCanvas(siteId, page.pageId, 'draft', canvasDoc, {
      updatedBy: SEED_DRAFT_UPDATED_BY,
    });

    return NextResponse.json({ success: true, pageId: page.pageId, page: createdPage });
  } catch (error) {
    if (error instanceof SiteInvariantError) {
      return siteInvariantConflictResponse(locale, error);
    }
    return pageRouteErrorResponse(locale, 'page_create_failed', 500);
  }
}
