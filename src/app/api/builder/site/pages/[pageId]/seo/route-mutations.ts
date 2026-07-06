import { generateRedirectId, validateRedirectInput } from '@/lib/builder/site/redirects';
import type {
  BuilderNavItem,
  BuilderSeoMetadata,
  BuilderSiteDocument,
} from '@/lib/builder/site/types';
import type { Locale } from '@/lib/locales';

const SEO_TEXT_KEYS = [
  'title',
  'description',
  'ogTitle',
  'ogDescription',
  'ogImage',
  'twitterTitle',
  'twitterDescription',
  'twitterImage',
  'canonical',
  'focusKeyword',
] as const;

const LOCALIZED_SEO_TEXT_KEYS = [
  'title',
  'description',
  'ogTitle',
  'ogDescription',
  'ogImage',
  'twitterTitle',
  'twitterDescription',
  'twitterImage',
  'focusKeyword',
] as const;

type SeoTextKey = (typeof SEO_TEXT_KEYS)[number];

export interface RedirectCreationWarning {
  readonly from: string;
  readonly to: string;
  readonly field: 'from' | 'to' | 'type';
  readonly message: string;
}

function hasOwnKey(input: unknown, key: keyof BuilderSeoMetadata): boolean {
  return typeof input === 'object' && input !== null && Object.prototype.hasOwnProperty.call(input, key);
}

function applyOptionalTextField(
  nextSeo: BuilderSeoMetadata,
  payload: BuilderSeoMetadata,
  rawBody: unknown,
  key: SeoTextKey,
): void {
  if (!hasOwnKey(rawBody, key)) return;
  const value = payload[key];
  if (typeof value === 'string' && value.trim()) nextSeo[key] = value.trim();
  else delete nextSeo[key];
}

export function appendRedirectIfValid(
  site: BuilderSiteDocument,
  input: {
    readonly from: string;
    readonly to: string;
    readonly type: 301;
    readonly isActive: true;
    readonly note: string;
  },
  now: string,
): { readonly created: boolean; readonly warning?: RedirectCreationWarning } {
  const redirectError = validateRedirectInput(input, site.redirects ?? []);
  if (redirectError) {
    return {
      created: false,
      warning: {
        from: input.from,
        to: input.to,
        field: redirectError.field,
        message: redirectError.message,
      },
    };
  }
  site.redirects = [
    ...(site.redirects ?? []),
    {
      redirectId: generateRedirectId(),
      ...input,
      createdAt: now,
      updatedAt: now,
    },
  ];
  return { created: true };
}

export function updateNavigationHref(
  items: BuilderNavItem[],
  pageId: string,
  nextHref: string,
): BuilderNavItem[] {
  return items.map((item) => ({
    ...item,
    href: item.pageId === pageId ? nextHref : item.href,
    children: item.children ? updateNavigationHref(item.children, pageId, nextHref) : item.children,
  }));
}

export function applySeoPatch(
  existingSeo: BuilderSeoMetadata | undefined,
  payload: BuilderSeoMetadata,
  rawBody: unknown,
): BuilderSeoMetadata | undefined {
  const nextSeo: BuilderSeoMetadata = { ...(existingSeo ?? {}) };

  for (const key of SEO_TEXT_KEYS) {
    applyOptionalTextField(nextSeo, payload, rawBody, key);
  }

  if (hasOwnKey(rawBody, 'twitterCard')) {
    if (payload.twitterCard) nextSeo.twitterCard = payload.twitterCard;
    else delete nextSeo.twitterCard;
  }

  if (hasOwnKey(rawBody, 'noIndex')) {
    if (payload.noIndex) nextSeo.noIndex = true;
    else delete nextSeo.noIndex;
  }

  if (hasOwnKey(rawBody, 'noFollow')) {
    if (payload.noFollow) nextSeo.noFollow = true;
    else delete nextSeo.noFollow;
  }

  if (hasOwnKey(rawBody, 'additionalMetaTags')) {
    if (payload.additionalMetaTags && payload.additionalMetaTags.length > 0) {
      nextSeo.additionalMetaTags = payload.additionalMetaTags;
    } else {
      delete nextSeo.additionalMetaTags;
    }
  }

  if (hasOwnKey(rawBody, 'structuredData')) {
    if (payload.structuredData) nextSeo.structuredData = payload.structuredData;
    else delete nextSeo.structuredData;
  }

  if (hasOwnKey(rawBody, 'overrideState')) {
    if (payload.overrideState && Object.keys(payload.overrideState).length > 0) nextSeo.overrideState = payload.overrideState;
    else delete nextSeo.overrideState;
  }

  if (hasOwnKey(rawBody, 'structuredDataBlocks')) {
    if (payload.structuredDataBlocks && payload.structuredDataBlocks.length > 0) {
      nextSeo.structuredDataBlocks = payload.structuredDataBlocks;
    } else {
      delete nextSeo.structuredDataBlocks;
    }
  }

  return Object.keys(nextSeo).length > 0 ? nextSeo : undefined;
}

export function applyLocalizedSeoPatch(
  existingSeo: BuilderSeoMetadata | undefined,
  payload: BuilderSeoMetadata,
  rawBody: unknown,
  locale: Locale,
): BuilderSeoMetadata | undefined {
  const nextSeo: BuilderSeoMetadata = { ...(existingSeo ?? {}) };
  const overrides = { ...(nextSeo.localizedOverrides ?? {}) };
  const currentOverride = { ...(overrides[locale] ?? {}) };

  for (const key of LOCALIZED_SEO_TEXT_KEYS) {
    if (!hasOwnKey(rawBody, key)) continue;
    const value = payload[key];
    if (typeof value === 'string' && value.trim()) {
      currentOverride[key] = value.trim();
    } else {
      delete currentOverride[key];
    }
  }

  if (Object.keys(currentOverride).length > 0) {
    overrides[locale] = currentOverride;
  } else {
    delete overrides[locale];
  }

  if (Object.keys(overrides).length > 0) {
    nextSeo.localizedOverrides = overrides;
  } else {
    delete nextSeo.localizedOverrides;
  }

  return Object.keys(nextSeo).length > 0 ? nextSeo : undefined;
}
