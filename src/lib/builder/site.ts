import {
  readBuilderCollectionSummaries,
  type BuilderCollectionSummary,
} from '@/lib/builder/cms';
import { listBuilderImageAssets, type BuilderAssetListItem } from '@/lib/builder/assets';
import {
  readBuilderDynamicRouteSummaries,
  type BuilderDynamicRouteId,
  type BuilderDynamicRouteSummary,
} from '@/lib/builder/dynamic-routes';
import {
  readBuilderDynamicTemplateSummaries,
  type BuilderDynamicTemplateId,
  type BuilderDynamicTemplateSummary,
  type BuilderSiteDynamicTemplateEntry,
} from '@/lib/builder/dynamic-templates';
import {
  readBuilderStarterTemplateSummaries,
  type BuilderSiteStarterTemplateEntry,
  type BuilderStarterTemplateId,
  type BuilderStarterTemplateSummary,
} from '@/lib/builder/starter-templates';
import type { BuilderCollectionId } from '@/lib/builder/cms';
import {
  BUILDER_SCHEMA_VERSION,
  BUILDER_SITE_VERSION,
  DEFAULT_BUILDER_SITE_ID,
  DEFAULT_BUILDER_WORKSPACE_ID,
} from '@/lib/builder/constants';
import { getDefaultBuilderDocument } from '@/lib/builder/content';
import { readBuilderPageSnapshot } from '@/lib/builder/persistence';
import { builderPageKeys, type BuilderPageKey } from '@/lib/builder/types';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const builderEditorModes = ['edit', 'preview', 'publish-review'] as const;
export type BuilderEditorMode = (typeof builderEditorModes)[number];

export interface BuilderWorkspaceSummary {
  id: string;
  name: string;
  ownerLabel: string;
  description: string;
}

export interface BuilderSiteSummary {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  locale: Locale;
}

export interface BuilderSiteSchemaPageEntry {
  pageId: string;
  pageKey: BuilderPageKey;
  pageType: 'static';
  routeType: 'static';
  routeSegment: string;
  parentPageKey: BuilderPageKey | null;
  specialRole: 'homepage' | null;
  documentVersion: number;
  sectionCount: number;
  datasetCount: number;
  supportsEditMode: boolean;
  availableModes: BuilderEditorMode[];
  publicPath: string;
}

export interface BuilderSiteSchemaDynamicRouteEntry {
  routeId: BuilderDynamicRouteId;
  templateId: BuilderDynamicTemplateId;
  collectionId: BuilderCollectionId;
  kind: 'list' | 'item';
  pathPattern: string;
  recordCount: number;
  previewContextMode: 'collection-only' | 'record-required';
  templateOwnerType: 'code-route';
  templateStatus: 'code-owned-read-only';
}

export interface BuilderSiteRouteIssue {
  code: 'duplicate_public_path' | 'missing_homepage' | 'multiple_homepages';
  message: string;
  pageKeys: BuilderPageKey[];
}

export interface BuilderSiteRouteValidation {
  valid: boolean;
  issues: BuilderSiteRouteIssue[];
}

export interface BuilderSiteSchemaEnvelope {
  version: 1;
  schemaVersion: number;
  siteVersion: number;
  workspaceId: string;
  siteId: string;
  locale: Locale;
  pageOrder: BuilderPageKey[];
  dynamicRouteOrder: BuilderDynamicRouteId[];
  dynamicTemplateOrder: BuilderDynamicTemplateId[];
  starterTemplateOrder: BuilderStarterTemplateId[];
  pages: Record<BuilderPageKey, BuilderSiteSchemaPageEntry>;
  dynamicRoutes: Record<BuilderDynamicRouteId, BuilderSiteSchemaDynamicRouteEntry>;
  dynamicTemplates: Record<BuilderDynamicTemplateId, BuilderSiteDynamicTemplateEntry>;
  starterTemplates: Record<BuilderStarterTemplateId, BuilderSiteStarterTemplateEntry>;
}

export interface BuilderSiteAssetSummary {
  locale: Locale;
  url: string;
  filename: string;
  contentType: string;
  size: number;
  uploadedAt: string;
}

export interface BuilderSitePageSummary {
  pageId: string;
  pageKey: BuilderPageKey;
  pageType: 'static';
  routeType: 'static';
  routeSegment: string;
  parentPageKey: BuilderPageKey | null;
  specialRole: 'homepage' | null;
  title: string;
  description: string;
  editable: boolean;
  availableModes: BuilderEditorMode[];
  publicPath: string;
  builderPath: string;
  draftPersisted: boolean;
  publishedPersisted: boolean;
  draftRevision: number;
  publishedRevision: number;
  draftSavedAt: string | null;
  publishedSavedAt: string | null;
  sectionCount: number;
  datasetCount: number;
}

export interface BuilderPageSnapshotSummary {
  kind: 'draft' | 'published';
  persisted: boolean;
  revision: number;
  savedAt: string | null;
  updatedBy: string | null;
  snapshot: Awaited<ReturnType<typeof readBuilderPageSnapshot>>['snapshot'];
}

export interface BuilderPageSnapshotOverview {
  workspace: BuilderWorkspaceSummary;
  site: BuilderSiteSummary;
  page: BuilderSitePageSummary;
  draft: BuilderPageSnapshotSummary;
  published: BuilderPageSnapshotSummary;
  preferred: {
    source: 'draft' | 'published' | 'default';
    snapshot: BuilderPageSnapshotSummary;
  };
}

export interface BuilderSiteOverview {
  workspace: BuilderWorkspaceSummary;
  site: BuilderSiteSummary;
  schema: BuilderSiteSchemaEnvelope;
  routing: BuilderSiteRouteValidation;
  pages: BuilderSitePageSummary[];
  collections: BuilderCollectionSummary[];
  dynamicRoutes: BuilderDynamicRouteSummary[];
  dynamicTemplates: BuilderDynamicTemplateSummary[];
  starterTemplates: BuilderStarterTemplateSummary[];
  assets: BuilderSiteAssetSummary[];
}

type BuilderPageConfig = {
  title: string;
  description: string;
  editable: boolean;
  availableModes: BuilderEditorMode[];
  publicPath: string;
  routeSegment: string;
  specialRole: 'homepage' | null;
};

const builderPageConfigs: Record<BuilderPageKey, BuilderPageConfig> = {
  home: {
    title: 'Home',
    description: '현재 실제 편집이 가능한 메인 페이지 editor입니다.',
    editable: true,
    availableModes: ['edit', 'preview'],
    publicPath: '/',
    routeSegment: '',
    specialRole: 'homepage',
  },
  about: {
    title: 'About',
    description: 'foundation + public parity 상태의 소개 페이지입니다.',
    editable: false,
    availableModes: ['preview'],
    publicPath: '/about',
    routeSegment: 'about',
    specialRole: null,
  },
  contact: {
    title: 'Contact',
    description: 'foundation + public parity 상태의 연락처 페이지입니다.',
    editable: false,
    availableModes: ['preview'],
    publicPath: '/contact',
    routeSegment: 'contact',
    specialRole: null,
  },
};

export function isBuilderPageKey(value: string | null | undefined): value is BuilderPageKey {
  return builderPageKeys.includes(value as BuilderPageKey);
}

export function isBuilderEditorMode(value: string | null | undefined): value is BuilderEditorMode {
  return builderEditorModes.includes(value as BuilderEditorMode);
}

export function resolveBuilderEditorMode(
  value: string | null | undefined,
  options?: { fallback?: BuilderEditorMode }
): BuilderEditorMode {
  if (isBuilderEditorMode(value)) return value;
  return options?.fallback ?? 'edit';
}

export function isDefaultBuilderSiteId(value: string | null | undefined) {
  return value === DEFAULT_BUILDER_SITE_ID;
}

export function getBuilderPageConfig(pageKey: BuilderPageKey) {
  return builderPageConfigs[pageKey];
}

export function getBuilderWorkspaceSummary(): BuilderWorkspaceSummary {
  return {
    id: DEFAULT_BUILDER_WORKSPACE_ID,
    name: 'Hojeong Internal Workspace',
    ownerLabel: 'son7 / internal owner',
    description: '단일 내부 workspace에서 호정 사이트 builder를 운영합니다.',
  };
}

export function getBuilderSiteSummary(locale: Locale): BuilderSiteSummary {
  return {
    id: DEFAULT_BUILDER_SITE_ID,
    workspaceId: DEFAULT_BUILDER_WORKSPACE_ID,
    name: 'Tseng Law Main Site',
    description: '호정국제 법률 사이트의 canonical builder 대상입니다.',
    locale,
  };
}

export function buildBuilderPageHref(
  locale: Locale,
  pageKey: BuilderPageKey,
  mode: BuilderEditorMode = 'edit'
) {
  const normalizedMode = mode === 'edit' ? '' : `?mode=${mode}`;
  return `/${locale}/builder/${pageKey}${normalizedMode}`;
}

export function buildLegacyBuilderPreviewHref(locale: Locale, pageKey: BuilderPageKey) {
  switch (pageKey) {
    case 'home':
      return `/${locale}/builder-preview`;
    case 'about':
      return `/${locale}/builder-preview/about`;
    case 'contact':
      return `/${locale}/builder-preview/contact`;
    default:
      return assertNever(pageKey);
  }
}

export function createBuilderSiteSchemaEnvelope(locale: Locale): BuilderSiteSchemaEnvelope {
  const dynamicRoutes = readBuilderDynamicRouteSummaries(locale);
  const dynamicTemplates = readBuilderDynamicTemplateSummaries(locale);
  const starterTemplates = readBuilderStarterTemplateSummaries(locale);

  return {
    version: 1,
    schemaVersion: BUILDER_SCHEMA_VERSION,
    siteVersion: BUILDER_SITE_VERSION,
    workspaceId: DEFAULT_BUILDER_WORKSPACE_ID,
    siteId: DEFAULT_BUILDER_SITE_ID,
    locale,
    pageOrder: [...builderPageKeys],
    dynamicRouteOrder: dynamicRoutes.map((route) => route.routeId),
    dynamicTemplateOrder: dynamicTemplates.map((template) => template.templateId),
    starterTemplateOrder: starterTemplates.map((template) => template.templateId),
    pages: Object.fromEntries(
      builderPageKeys.map((pageKey) => {
        const document = getDefaultBuilderDocument(pageKey, locale);
        const config = getBuilderPageConfig(pageKey);

        return [
          pageKey,
          {
            pageId: `${DEFAULT_BUILDER_SITE_ID}:${pageKey}`,
            pageKey,
            pageType: 'static',
            routeType: 'static',
            routeSegment: config.routeSegment,
            parentPageKey: null,
            specialRole: config.specialRole,
            documentVersion: document.version,
            sectionCount: document.root.children.length,
            datasetCount: document.datasets.length,
            supportsEditMode: config.editable,
            availableModes: [...config.availableModes],
            publicPath: config.publicPath,
          },
        ];
      })
    ) as Record<BuilderPageKey, BuilderSiteSchemaPageEntry>,
    dynamicRoutes: Object.fromEntries(
      dynamicRoutes.map((route) => [
        route.routeId,
        {
          routeId: route.routeId,
          templateId: route.templateId,
          collectionId: route.collectionId,
          kind: route.kind,
          pathPattern: route.pathPattern,
          recordCount: route.recordCount,
          previewContextMode: route.previewContextMode,
          templateOwnerType: route.templateOwnerType,
          templateStatus: route.templateStatus,
        } satisfies BuilderSiteSchemaDynamicRouteEntry,
      ])
    ) as Record<BuilderDynamicRouteId, BuilderSiteSchemaDynamicRouteEntry>,
    dynamicTemplates: Object.fromEntries(
      dynamicTemplates.map((template) => [
        template.templateId,
        {
          templateId: template.templateId,
          routeId: template.routeId,
          collectionId: template.collectionId,
          kind: template.kind,
          publicPathPattern: template.publicPathPattern,
          ownerType: template.ownerType,
          builderSupport: template.builderSupport,
          editorStatus: template.editorStatus,
          previewStatus: template.previewStatus,
        } satisfies BuilderSiteDynamicTemplateEntry,
      ])
    ) as Record<BuilderDynamicTemplateId, BuilderSiteDynamicTemplateEntry>,
    starterTemplates: Object.fromEntries(
      starterTemplates.map((template) => [
        template.templateId,
        {
          templateId: template.templateId,
          category: template.category,
          support: template.support,
          entryKind: template.entryKind,
          pageKey: template.pageKey,
          dynamicTemplateId: template.dynamicTemplateId,
          livePath: template.livePath,
        } satisfies BuilderSiteStarterTemplateEntry,
      ])
    ) as Record<BuilderStarterTemplateId, BuilderSiteStarterTemplateEntry>,
  };
}

export async function readBuilderSiteOverview(localeInput: string | null | undefined): Promise<BuilderSiteOverview> {
  const locale = normalizeLocale(localeInput ?? undefined);
  const workspace = getBuilderWorkspaceSummary();
  const site = getBuilderSiteSummary(locale);
  const schema = createBuilderSiteSchemaEnvelope(locale);

  const [pages, assets] = await Promise.all([
    Promise.all(
      builderPageKeys.map(async (pageKey) => {
        const config = getBuilderPageConfig(pageKey);
        const [draft, published] = await Promise.all([
          readBuilderPageSnapshot(pageKey, 'draft', locale),
          readBuilderPageSnapshot(pageKey, 'published', locale),
        ]);
        const effectiveDocument = draft.persisted
          ? draft.snapshot.document
          : published.persisted
            ? published.snapshot.document
            : getDefaultBuilderDocument(pageKey, locale);

        return {
          pageId: `${site.id}:${pageKey}`,
          pageKey,
          pageType: 'static',
          routeType: 'static',
          routeSegment: config.routeSegment,
          parentPageKey: null,
          specialRole: config.specialRole,
          title: config.title,
          description: config.description,
          editable: config.editable,
          availableModes: [...config.availableModes],
          publicPath: `/${locale}${config.publicPath === '/' ? '' : config.publicPath}`,
          builderPath: buildBuilderPageHref(locale, pageKey, config.availableModes[0] ?? 'preview'),
          draftPersisted: draft.persisted,
          publishedPersisted: published.persisted,
          draftRevision: draft.snapshot.revision,
          publishedRevision: published.snapshot.revision,
          draftSavedAt: draft.persisted ? draft.snapshot.savedAt : null,
          publishedSavedAt: published.persisted ? published.snapshot.savedAt : null,
          sectionCount: effectiveDocument.root.children.length,
          datasetCount: effectiveDocument.datasets.length,
        } satisfies BuilderSitePageSummary;
      })
    ),
    readBuilderAssetSummaries(locale),
  ]);
  const dynamicRoutes = readBuilderDynamicRouteSummaries(locale);
  const dynamicTemplates = readBuilderDynamicTemplateSummaries(locale);
  const starterTemplates = readBuilderStarterTemplateSummaries(locale);

  return {
    workspace,
    site,
    schema,
    routing: validateBuilderStaticRoutes(pages),
    pages,
    collections: readBuilderCollectionSummaries(locale),
    dynamicRoutes,
    dynamicTemplates,
    starterTemplates,
    assets,
  };
}

export async function readPreferredBuilderPreviewSnapshot(
  pageKey: BuilderPageKey,
  localeInput: string | null | undefined
) {
  const locale = normalizeLocale(localeInput ?? undefined);
  const [draft, published] = await Promise.all([
    readBuilderPageSnapshot(pageKey, 'draft', locale),
    readBuilderPageSnapshot(pageKey, 'published', locale),
  ]);

  if (draft.persisted) {
    return draft;
  }

  return published;
}

export async function readBuilderPageSnapshotOverview(
  pageKey: BuilderPageKey,
  localeInput: string | null | undefined
): Promise<BuilderPageSnapshotOverview> {
  const locale = normalizeLocale(localeInput ?? undefined);
  const workspace = getBuilderWorkspaceSummary();
  const site = getBuilderSiteSummary(locale);
  const config = getBuilderPageConfig(pageKey);
  const [draft, published] = await Promise.all([
    readBuilderPageSnapshot(pageKey, 'draft', locale),
    readBuilderPageSnapshot(pageKey, 'published', locale),
  ]);
  const effectiveDocument = draft.persisted
    ? draft.snapshot.document
    : published.persisted
      ? published.snapshot.document
      : getDefaultBuilderDocument(pageKey, locale);

  const page: BuilderSitePageSummary = {
    pageId: `${site.id}:${pageKey}`,
    pageKey,
    pageType: 'static',
    routeType: 'static',
    routeSegment: config.routeSegment,
    parentPageKey: null,
    specialRole: config.specialRole,
    title: config.title,
    description: config.description,
    editable: config.editable,
    availableModes: [...config.availableModes],
    publicPath: `/${locale}${config.publicPath === '/' ? '' : config.publicPath}`,
    builderPath: buildBuilderPageHref(locale, pageKey, config.availableModes[0] ?? 'preview'),
    draftPersisted: draft.persisted,
    publishedPersisted: published.persisted,
    draftRevision: draft.snapshot.revision,
    publishedRevision: published.snapshot.revision,
    draftSavedAt: draft.persisted ? draft.snapshot.savedAt : null,
    publishedSavedAt: published.persisted ? published.snapshot.savedAt : null,
    sectionCount: effectiveDocument.root.children.length,
    datasetCount: effectiveDocument.datasets.length,
  };

  const draftSummary: BuilderPageSnapshotSummary = {
    kind: 'draft',
    persisted: draft.persisted,
    revision: draft.snapshot.revision,
    savedAt: draft.persisted ? draft.snapshot.savedAt : null,
    updatedBy: draft.persisted ? draft.snapshot.updatedBy : null,
    snapshot: draft.snapshot,
  };

  const publishedSummary: BuilderPageSnapshotSummary = {
    kind: 'published',
    persisted: published.persisted,
    revision: published.snapshot.revision,
    savedAt: published.persisted ? published.snapshot.savedAt : null,
    updatedBy: published.persisted ? published.snapshot.updatedBy : null,
    snapshot: published.snapshot,
  };

  const preferredSource = draft.persisted ? 'draft' : published.persisted ? 'published' : 'default';

  return {
    workspace,
    site,
    page,
    draft: draftSummary,
    published: publishedSummary,
    preferred: {
      source: preferredSource,
      snapshot: preferredSource === 'draft' ? draftSummary : publishedSummary,
    },
  };
}

async function readBuilderAssetSummaries(locale: Locale): Promise<BuilderSiteAssetSummary[]> {
  try {
    const assets = await listBuilderImageAssets({ locale, limit: 6 });
    return assets.map(mapBuilderAssetSummary);
  } catch {
    return [];
  }
}

function mapBuilderAssetSummary(asset: BuilderAssetListItem): BuilderSiteAssetSummary {
  return {
    locale: asset.locale,
    url: asset.url,
    filename: asset.filename,
    contentType: asset.contentType,
    size: asset.size,
    uploadedAt: asset.uploadedAt,
  };
}

function assertNever(value: never): never {
  throw new Error(`Unexpected builder page value: ${String(value)}`);
}

function validateBuilderStaticRoutes(
  pages: BuilderSitePageSummary[]
): BuilderSiteRouteValidation {
  const issues: BuilderSiteRouteIssue[] = [];
  const homepagePages = pages.filter((page) => page.specialRole === 'homepage');

  if (homepagePages.length === 0) {
    issues.push({
      code: 'missing_homepage',
      message: 'Static page registry must contain exactly one homepage.',
      pageKeys: [],
    });
  }

  if (homepagePages.length > 1) {
    issues.push({
      code: 'multiple_homepages',
      message: 'More than one page is marked as homepage in the static page registry.',
      pageKeys: homepagePages.map((page) => page.pageKey),
    });
  }

  const pagesByPublicPath = new Map<string, BuilderPageKey[]>();
  pages.forEach((page) => {
    const candidates = pagesByPublicPath.get(page.publicPath) ?? [];
    candidates.push(page.pageKey);
    pagesByPublicPath.set(page.publicPath, candidates);
  });

  for (const [publicPath, pageKeys] of pagesByPublicPath.entries()) {
    if (pageKeys.length < 2) {
      continue;
    }
    issues.push({
      code: 'duplicate_public_path',
      message: `Static page registry contains a duplicate public path: ${publicPath}`,
      pageKeys,
    });
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}
