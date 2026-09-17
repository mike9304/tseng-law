// Local binding of existing source-native fixture constructors; no persistence.
import type { Locale } from '@/lib/locales';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import type { BuilderCmsCollection } from '@/lib/builder/cms-types';
import type { ResolvedPublishedSitePage } from '@/lib/builder/site/public-page';
import { DEFAULT_THEME } from '@/lib/builder/site/types';
import { createBuilderCmsDynamicListPageMeta, createBuilderCmsDynamicListCanvasDocument, buildBuilderDynamicListDatasetDocument } from '@/lib/builder/dynamic-list-pages';
const now = '2026-09-14T00:00:00.000Z';

function makeRecipeCollection(locale: Locale): BuilderCmsCollection {
  return {
    collectionId: 'recipes-runtime',
    name: 'Recipes Runtime',
    slug: 'recipes-runtime',
    description: 'Custom recipe records for dynamic item runtime binding.',
    localized: false,
    fields: [
      { fieldId: 'f-title', key: 'title', label: 'Title', type: 'text', localized: false, repeated: false, required: true },
      { fieldId: 'f-slug', key: 'slug', label: 'Slug', type: 'slug', localized: false, repeated: false, required: true },
      { fieldId: 'f-content', key: 'content', label: 'Content', type: 'rich-text', localized: false, repeated: false, required: false },
    ],
    indexes: [],
    records: [
      {
        recordId: 'alpha-runtime-id',
        status: 'published',
        locale,
        fields: {
          title: 'Alpha Runtime',
          slug: 'alpha-runtime',
          content: 'Alpha runtime body.',
        },
        createdAt: now,
        updatedAt: now,
      },
      {
        recordId: 'beta-runtime-id',
        status: 'published',
        locale,
        fields: {
          title: 'Beta Runtime',
          slug: 'beta-runtime',
          content: 'Beta runtime body.',
        },
        createdAt: now,
        updatedAt: now,
      },
      {
        recordId: 'draft-sentinel-id',
        status: 'draft',
        locale,
        fields: {
          title: 'DRAFT QA MUST NOT RENDER',
          slug: 'draft-sentinel',
          content: 'Alpha runtime body.',
        },
        createdAt: now,
        updatedAt: now,
      },
    ],
    permissions: { read: ['public'], create: ['admin'], update: ['admin'], delete: ['admin'] },
    createdAt: now,
    updatedAt: now,
  };
}

function baseResolved(
  locale: Locale,
  canvas: BuilderCanvasDocument,
): ResolvedPublishedSitePage {
  const now = '2026-09-07T00:00:00.000Z';
  return {
    locale,
    slugPath: '',
    canvas,
    site: {
      version: 1,
      siteId: `${locale}-home-editorial-fixture`,
      name: `${locale} Home Editorial Fixture`,
      locale,
      navigation: [],
      theme: DEFAULT_THEME,
      settings: { firmName: `${locale} Home Editorial Fixture` },
      pages: [],
      createdAt: now,
      updatedAt: now,
    },
    pageMeta: {
      pageId: `${locale}-home-editorial-fixture`,
      slug: '',
      title: { ko: '홈', 'zh-hant': '首頁', en: 'Home' },
      locale,
      createdAt: now,
      updatedAt: now,
      publishedAt: now,
      noIndex: true,
    },
    lightboxes: [],
    popups: [],
    cookieConsent: null,
    headerCanvas: null,
    footerCanvas: null,
    datasetPreviewTargets: [],
    columnPosts: [],
    faqCategories: [],
    faqItems: [],
  };
}

export function publicListFixture(locale: Locale, state: 'empty' | 'filtered-empty' | 'populated'): ResolvedPublishedSitePage {
  const sample = makeRecipeCollection(locale);
  const collection = { ...sample, records: state === 'empty' ? [] : sample.records };
  const dynamicList = createBuilderCmsDynamicListPageMeta({ collection });
  const base = baseResolved(locale, createBuilderCmsDynamicListCanvasDocument({ collection, locale }));
  return {
    ...base,
    slugPath: 'design-fixtures/public-list',
    site: { ...base.site, cmsCollections: [collection] },
    pageMeta: { ...base.pageMeta, slug: 'design-fixtures/public-list', dynamicList },
    datasetDocument: buildBuilderDynamicListDatasetDocument(dynamicList),
  };
}
