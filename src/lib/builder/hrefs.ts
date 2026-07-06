import type { BuilderCollectionId } from '@/lib/builder/cms';
import type { BuilderDynamicRouteId } from '@/lib/builder/dynamic-routes';
import type { BuilderDynamicTemplateId } from '@/lib/builder/dynamic-templates';
import type { BuilderStarterTemplateId } from '@/lib/builder/starter-templates';
import type { BuilderDatasetTargetId } from '@/lib/builder/types';
import type { BuilderPageKey } from '@/lib/builder/types';
import type { Locale } from '@/lib/locales';

export function buildBuilderPageHref(
  locale: Locale,
  pageKey: BuilderPageKey,
  mode: 'edit' | 'preview' | 'publish-review'
) {
  const searchParams = new URLSearchParams();
  if (mode !== 'edit') {
    searchParams.set('mode', mode);
  }

  const query = searchParams.toString();

  return `/${locale}/builder/${encodeURIComponent(pageKey)}${query ? `?${query}` : ''}`;
}

export function buildBuilderCollectionHref(locale: Locale, collectionId: BuilderCollectionId) {
  return `/${locale}/builder/collections/${collectionId}`;
}

export function buildBuilderCmsCollectionHref(locale: Locale, collectionId: string) {
  const searchParams = new URLSearchParams({ collectionId });
  return `/${locale}/admin-builder/cms?${searchParams.toString()}`;
}

export function buildBuilderCmsRecordHref(locale: Locale, collectionId: string, recordId: string) {
  const searchParams = new URLSearchParams({ collectionId, recordId });
  return `/${locale}/admin-builder/cms?${searchParams.toString()}`;
}

export function buildBuilderPageDatasetHref(
  locale: Locale,
  pageKey: BuilderPageKey,
  options?: { copyFromTargetId?: BuilderDatasetTargetId; targetId?: BuilderDatasetTargetId },
) {
  const searchParams = new URLSearchParams();
  if (options?.targetId) {
    searchParams.set('targetId', options.targetId);
  }
  if (options?.copyFromTargetId) {
    searchParams.set('copyFromTargetId', options.copyFromTargetId);
  }

  const query = searchParams.toString();
  return `/${locale}/builder/${encodeURIComponent(pageKey)}/datasets${query ? `?${query}` : ''}`;
}

export function buildBuilderDynamicRouteHref(
  locale: Locale,
  routeId: BuilderDynamicRouteId,
  options?: { previewRecordId?: string | null }
) {
  const searchParams = new URLSearchParams();
  if (options?.previewRecordId) {
    searchParams.set('previewRecordId', options.previewRecordId);
  }

  const query = searchParams.toString();
  return `/${locale}/builder/dynamic-routes/${encodeURIComponent(routeId)}${query ? `?${query}` : ''}`;
}

export function buildBuilderDynamicTemplateHref(
  locale: Locale,
  templateId: BuilderDynamicTemplateId,
  options?: { previewRecordId?: string | null }
) {
  const searchParams = new URLSearchParams();
  if (options?.previewRecordId) {
    searchParams.set('previewRecordId', options.previewRecordId);
  }

  const query = searchParams.toString();
  return `/${locale}/builder/dynamic-templates/${encodeURIComponent(templateId)}${query ? `?${query}` : ''}`;
}

export function buildBuilderStarterTemplateHref(
  locale: Locale,
  templateId: BuilderStarterTemplateId
) {
  return `/${locale}/builder/starter-templates/${encodeURIComponent(templateId)}`;
}

export function buildBuilderPageSceneHref(locale: Locale, pageKey: BuilderPageKey) {
  return `/${locale}/builder/${encodeURIComponent(pageKey)}/scene`;
}
