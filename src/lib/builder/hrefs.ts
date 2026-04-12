import type { BuilderCollectionId } from '@/lib/builder/cms';
import type { BuilderDynamicRouteId } from '@/lib/builder/dynamic-routes';
import type { BuilderDynamicTemplateId } from '@/lib/builder/dynamic-templates';
import type { BuilderStarterTemplateId } from '@/lib/builder/starter-templates';
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

export function buildBuilderDynamicTemplateHref(locale: Locale, templateId: BuilderDynamicTemplateId) {
  return `/${locale}/builder/dynamic-templates/${encodeURIComponent(templateId)}`;
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
