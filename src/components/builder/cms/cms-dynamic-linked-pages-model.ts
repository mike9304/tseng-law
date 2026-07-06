import { z } from 'zod';
import { buildBuilderCmsRecordHref } from '@/lib/builder/hrefs';
import { isPublishCandidateStatus } from '@/lib/builder/cms-publish-readiness';
import { buildSitePagePath } from '@/lib/builder/site/paths';
import type { BuilderCmsCollectionDetail } from '@/lib/builder/cms-types';
import type { Locale } from '@/lib/locales';

export const linkedPagesResponseSchema = z.object({
  pages: z.array(z.object({
    pageId: z.string(),
    slug: z.string().optional(),
    title: z.record(z.string(), z.string()).optional(),
    publishedAt: z.string().optional(),
    dynamicList: z.object({
      cmsCollectionId: z.string().optional(),
      limit: z.number().optional(),
    }).optional(),
    dynamicItem: z.object({
      cmsCollectionId: z.string().optional(),
      slugField: z.string(),
      defaultRecordSlug: z.string(),
    }).optional(),
  })).optional(),
});

type LinkedPagesPayload = z.infer<typeof linkedPagesResponseSchema>['pages'];

export type LinkedDynamicListPage = {
  readonly pageId: string;
  readonly slug: string;
  readonly title: string;
  readonly editorHref: string;
  readonly publicHref: string;
  readonly published: boolean;
  readonly limit?: number;
};

export type LinkedDynamicItemPage = {
  readonly pageId: string;
  readonly slug: string;
  readonly title: string;
  readonly editorHref: string;
  readonly publicHref: string;
  readonly published: boolean;
  readonly recordSlug: string;
  readonly slugField: string;
};

export type LinkedDynamicItemRecordRoute = {
  readonly recordId: string;
  readonly slug: string;
  readonly publicHref: string;
};

export type LinkedDynamicItemRouteRepairLink = {
  readonly recordId: string;
  readonly href: string;
};

export type LinkedDynamicItemRouteCoverage = {
  readonly pageId: string;
  readonly slugField: string;
  readonly totalRecordCount: number;
  readonly publishedRouteCount: number;
  readonly draftRecordCount: number;
  readonly archivedRecordCount: number;
  readonly missingSlugCount: number;
  readonly slugConflictCount: number;
  readonly sampleRoutes: readonly LinkedDynamicItemRecordRoute[];
  readonly publishableHeldBackRecordIds: readonly string[];
  readonly archivableHeldBackRecordIds: readonly string[];
  readonly restorableArchivedRecordIds: readonly string[];
  readonly deletableArchivedRecordIds: readonly string[];
  readonly missingSlugRecordIds: readonly string[];
  readonly slugConflictRecordIds: readonly string[];
  readonly draftReviewLink?: LinkedDynamicItemRouteRepairLink;
  readonly missingSlugReviewLink?: LinkedDynamicItemRouteRepairLink;
  readonly slugConflictReviewLink?: LinkedDynamicItemRouteRepairLink;
};

export function resolveLinkedListPages({
  pages,
  locale,
  collectionId,
}: {
  readonly pages: LinkedPagesPayload;
  readonly locale: Locale;
  readonly collectionId: string;
}): readonly LinkedDynamicListPage[] {
  return (pages ?? [])
    .filter((page) => page.dynamicList?.cmsCollectionId === collectionId)
    .map((page) => {
      const slug = page.slug ?? page.pageId;
      return {
        pageId: page.pageId,
        slug,
        title: page.title?.[locale] ?? page.title?.['ko'] ?? slug,
        editorHref: `/${locale}/admin-builder?pageId=${encodeURIComponent(page.pageId)}`,
        publicHref: buildSitePagePath(locale, slug),
        published: Boolean(page.publishedAt),
        ...(page.dynamicList?.limit === undefined ? {} : { limit: page.dynamicList.limit }),
      };
    });
}

export function resolveLinkedItemRouteCoverage({
  page,
  collection,
  locale,
  maxRoutes = 3,
}: {
  readonly page: LinkedDynamicItemPage;
  readonly collection: BuilderCmsCollectionDetail;
  readonly locale: Locale;
  readonly maxRoutes?: number;
}): LinkedDynamicItemRouteCoverage {
  let draftRecordCount = 0;
  let archivedRecordCount = 0;
  let missingSlugCount = 0;
  let slugConflictCount = 0;
  let draftReviewLink: LinkedDynamicItemRouteRepairLink | undefined;
  let missingSlugReviewLink: LinkedDynamicItemRouteRepairLink | undefined;
  let slugConflictReviewLink: LinkedDynamicItemRouteRepairLink | undefined;
  const sampleRoutes: LinkedDynamicItemRecordRoute[] = [];
  const publishableHeldBackRecordIds: string[] = [];
  const archivableHeldBackRecordIds: string[] = [];
  const restorableArchivedRecordIds: string[] = [];
  const deletableArchivedRecordIds: string[] = [];
  const missingSlugRecordIds: string[] = [];
  const slugConflictRecordIds: string[] = [];
  const seenSlugs = new Set<string>();

  for (const record of collection.records) {
    if (record.status === 'archived') {
      archivedRecordCount += 1;
      restorableArchivedRecordIds.push(record.recordId);
      deletableArchivedRecordIds.push(record.recordId);
      continue;
    }
    const slug = resolveRecordSlug(record.fields[page.slugField]);
    if (!slug) {
      missingSlugCount += 1;
      missingSlugRecordIds.push(record.recordId);
      missingSlugReviewLink ??= {
        recordId: record.recordId,
        href: buildBuilderCmsRecordHref(locale, collection.collectionId, record.recordId),
      };
      continue;
    }
    if (seenSlugs.has(slug)) {
      slugConflictCount += 1;
      slugConflictRecordIds.push(record.recordId);
      slugConflictReviewLink ??= {
        recordId: record.recordId,
        href: buildBuilderCmsRecordHref(locale, collection.collectionId, record.recordId),
      };
      if (record.status !== 'published') {
        draftRecordCount += 1;
        draftReviewLink ??= {
          recordId: record.recordId,
          href: buildBuilderCmsRecordHref(locale, collection.collectionId, record.recordId),
        };
      }
      continue;
    }
    seenSlugs.add(slug);
    if (record.status !== 'published') {
      draftRecordCount += 1;
      if (isPublishCandidateStatus(record.status)) {
        publishableHeldBackRecordIds.push(record.recordId);
        archivableHeldBackRecordIds.push(record.recordId);
      }
      draftReviewLink ??= {
        recordId: record.recordId,
        href: buildBuilderCmsRecordHref(locale, collection.collectionId, record.recordId),
      };
      continue;
    }
    sampleRoutes.push({
      recordId: record.recordId,
      slug,
      publicHref: buildSitePagePath(locale, `${page.slug}/${slug}`),
    });
  }

  return {
    pageId: page.pageId,
    slugField: page.slugField,
    totalRecordCount: collection.records.length,
    publishedRouteCount: sampleRoutes.length,
    draftRecordCount,
    archivedRecordCount,
    missingSlugCount,
    slugConflictCount,
    sampleRoutes: sampleRoutes.slice(0, Math.max(0, Math.floor(maxRoutes))),
    publishableHeldBackRecordIds,
    archivableHeldBackRecordIds,
    restorableArchivedRecordIds,
    deletableArchivedRecordIds,
    missingSlugRecordIds,
    slugConflictRecordIds,
    ...(draftReviewLink === undefined ? {} : { draftReviewLink }),
    ...(missingSlugReviewLink === undefined ? {} : { missingSlugReviewLink }),
    ...(slugConflictReviewLink === undefined ? {} : { slugConflictReviewLink }),
  };
}

function resolveRecordSlug(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function resolveLinkedItemPages({
  pages,
  locale,
  collectionId,
}: {
  readonly pages: LinkedPagesPayload;
  readonly locale: Locale;
  readonly collectionId: string;
}): readonly LinkedDynamicItemPage[] {
  return (pages ?? [])
    .filter((page) => page.dynamicItem?.cmsCollectionId === collectionId)
    .map((page) => {
      const slug = page.slug ?? page.pageId;
      const recordSlug = page.dynamicItem?.defaultRecordSlug ?? '';
      return {
        pageId: page.pageId,
        slug,
        title: page.title?.[locale] ?? page.title?.['ko'] ?? slug,
        editorHref: `/${locale}/admin-builder?pageId=${encodeURIComponent(page.pageId)}`,
        publicHref: buildSitePagePath(locale, `${slug}/${recordSlug}`),
        published: Boolean(page.publishedAt),
        recordSlug,
        slugField: page.dynamicItem?.slugField ?? 'slug',
      };
    });
}
