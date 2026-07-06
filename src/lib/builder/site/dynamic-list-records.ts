import { getAllColumnPosts } from '@/lib/columns';
import {
  findCmsCollection,
  resolveCmsCollectionDataset,
} from '@/lib/builder/cms-collection-datasets';
import {
  getBuilderPageDatasetBinding,
  resolveAttorneyProfileDatasetItems,
  resolveInsightsDatasetPosts,
  resolveServicesDatasetItems,
} from '@/lib/builder/datasets';
import {
  resolvePublishedCmsCollectionRecordPreviews,
} from '@/lib/builder/site/cms-runtime';
import {
  resolvePublishedAttorneyRuntimeItems,
  resolvePublishedServiceRuntimeItems,
} from '@/lib/builder/site/runtime-items';
import type {
  BuilderAttorneyProfileItem,
  BuilderPageDocument,
  BuilderServiceItem,
} from '@/lib/builder/types';
import type {
  BuilderDynamicListPageMeta,
  BuilderSiteDocument,
} from '@/lib/builder/site/types';
import type { Locale } from '@/lib/locales';

export interface DynamicListPublicRecord {
  recordId: string;
  primaryLabel: string;
  secondaryLabel: string;
  routePath: string;
  fieldValues: Record<string, string>;
}

export function resolveDynamicListRecords({
  datasetDocument,
  dynamicList,
  locale,
  posts,
  site,
}: {
  datasetDocument: Pick<BuilderPageDocument, 'pageKey' | 'datasets'>;
  dynamicList: BuilderDynamicListPageMeta;
  locale: Locale;
  posts: ReturnType<typeof getAllColumnPosts>;
  site: BuilderSiteDocument;
}): DynamicListPublicRecord[] {
  const binding = getBuilderPageDatasetBinding(datasetDocument, dynamicList.targetId);
  if (binding?.cmsCollectionId) {
    const collection = findCmsCollection(site, binding.cmsCollectionId);
    if (!collection) return [];
    return resolveCmsCollectionDataset(collection, {
      filters: binding.filters,
      sort: binding.sort,
      limit: binding.limit,
      routeBase: `/${locale}/${collection.slug || collection.collectionId}`,
    }).map((record) => ({
      recordId: record.recordId,
      primaryLabel: record.primaryLabel,
      secondaryLabel: record.secondaryLabel,
      routePath: record.routePath,
      fieldValues: normalizeDynamicListFieldValues(record),
    }));
  }

  const runtimeCollectionRecords = resolvePublishedCmsCollectionRecordPreviews(site, dynamicList.collectionId, locale);
  if (runtimeCollectionRecords) {
    return runtimeCollectionRecords.map((record) => ({
      recordId: record.recordId,
      primaryLabel: record.primaryLabel,
      secondaryLabel: record.secondaryLabel,
      routePath: record.routePath,
      fieldValues: normalizeDynamicListFieldValues(record),
    }));
  }

  switch (dynamicList.collectionId) {
    case 'columns':
      return resolveInsightsDatasetPosts(datasetDocument, posts).map((post) => ({
        recordId: post.slug,
        primaryLabel: post.title,
        secondaryLabel: `${post.categoryLabel} · ${post.dateDisplay || post.date}`,
        routePath: `/${locale}/columns/${post.slug}`,
        fieldValues: {
          title: post.title,
          slug: post.slug,
          summary: post.summary,
          content: post.content,
          category: post.category,
          categoryLabel: post.categoryLabel,
          date: post.date,
          dateDisplay: post.dateDisplay,
          readTime: post.readTime,
          href: `/${locale}/columns/${post.slug}`,
          recordId: post.slug,
        },
      }));
    case 'service-areas':
      return resolveServicesDatasetItems(
        datasetDocument,
        locale,
        posts,
        resolvePublishedServiceRuntimeItems(site, locale, posts) ?? undefined,
      ).map((service) => {
        const slug = service.href.split('/').filter(Boolean).slice(-1)[0] ?? service.href;
        return {
          recordId: slug,
          primaryLabel: service.title,
          secondaryLabel: service.description,
          routePath: service.href,
          fieldValues: {
            title: service.title,
            description: service.description,
            details: service.details?.join(' ') ?? '',
            href: service.href,
            slug,
            recordId: slug,
            relatedColumns: service.relatedColumns?.map((column) => column.title).join(' ') ?? '',
          },
        };
      });
    case 'attorney-profiles':
      return resolveAttorneyProfileDatasetItems(
        datasetDocument,
        locale,
        resolvePublishedAttorneyRuntimeItems(site, locale) ?? undefined,
      ).map((profile) => ({
        recordId: profile.slug,
        primaryLabel: profile.name,
        secondaryLabel: profile.role,
        routePath: profile.href,
        fieldValues: {
          slug: profile.slug,
          name: profile.name,
          role: profile.role,
          title: profile.title,
          description: profile.description,
          summary: profile.summary.join(' '),
          email: profile.email,
          href: profile.href,
          image: profile.image,
          recordId: profile.slug,
        },
      }));
  }
}

export function filterColumnPostsByRecordIds(
  posts: ReturnType<typeof getAllColumnPosts>,
  recordIds: ReadonlySet<string>,
): ReturnType<typeof getAllColumnPosts> {
  if (recordIds.size === 0) return [];
  return posts.filter((post) => recordIds.has(post.slug));
}

export function filterServiceItemsByRecordIds(
  items: readonly BuilderServiceItem[] | undefined,
  recordIds: ReadonlySet<string>,
): BuilderServiceItem[] | undefined {
  if (!items) return undefined;
  if (recordIds.size === 0) return [];
  return items.filter((item) => recordIds.has(item.href.split('/').filter(Boolean).slice(-1)[0] ?? item.href));
}

export function filterAttorneyItemsByRecordIds(
  items: readonly BuilderAttorneyProfileItem[] | undefined,
  recordIds: ReadonlySet<string>,
): BuilderAttorneyProfileItem[] | undefined {
  if (!items) return undefined;
  if (recordIds.size === 0) return [];
  return items.filter((item) => recordIds.has(item.slug));
}

export function extractDynamicListRecordId(record: DynamicListPublicRecord): string {
  return record.recordId;
}

function normalizeDynamicListFieldValues(record: {
  recordId: string;
  primaryLabel: string;
  secondaryLabel: string;
  routePath: string;
  fieldValues: Record<string, string>;
}): Record<string, string> {
  return {
    ...record.fieldValues,
    title: record.fieldValues.title || record.fieldValues.name || record.primaryLabel,
    name: record.fieldValues.name || record.fieldValues.title || record.primaryLabel,
    description: record.fieldValues.description || record.fieldValues.summary || record.secondaryLabel,
    summary: record.fieldValues.summary || record.fieldValues.description || record.secondaryLabel,
    slug: record.fieldValues.slug || record.routePath.split('/').filter(Boolean).slice(-1)[0] || record.recordId,
    href: record.routePath,
    recordId: record.recordId,
  };
}
