import {
  readBuilderCollectionSummaries,
  type BuilderCollectionId,
} from '@/lib/builder/cms';
import { normalizeLocale } from '@/lib/locales';

export const builderDynamicTemplateIds = [
  'columns.list-template',
  'columns.item-template',
  'service-areas.list-template',
  'service-areas.item-template',
  'attorney-profiles.list-template',
  'attorney-profiles.item-template',
] as const;

export type BuilderDynamicTemplateId = (typeof builderDynamicTemplateIds)[number];
export type BuilderDynamicTemplateKind = 'list' | 'item';
export type BuilderDynamicTemplateOwnerType = 'code-route';
export type BuilderDynamicTemplateBuilderSupport = 'read-only-ownership';
export type BuilderDynamicTemplateEditorStatus = 'deferred';
export type BuilderDynamicTemplatePreviewStatus = 'route-context-only';

export interface BuilderDynamicTemplateSummary {
  templateId: BuilderDynamicTemplateId;
  routeId: `${BuilderCollectionId}.${BuilderDynamicTemplateKind}`;
  collectionId: BuilderCollectionId;
  collectionTitle: string;
  kind: BuilderDynamicTemplateKind;
  title: string;
  notes: string;
  publicPathPattern: string;
  ownerType: BuilderDynamicTemplateOwnerType;
  runtimeOwner: 'next-app-router';
  runtimeModulePath: string;
  builderSupport: BuilderDynamicTemplateBuilderSupport;
  editorStatus: BuilderDynamicTemplateEditorStatus;
  previewStatus: BuilderDynamicTemplatePreviewStatus;
  localized: boolean;
}

export interface BuilderDynamicTemplateDetail extends BuilderDynamicTemplateSummary {
  exclusions: string[];
}

export interface BuilderSiteDynamicTemplateEntry {
  templateId: BuilderDynamicTemplateId;
  routeId: `${BuilderCollectionId}.${BuilderDynamicTemplateKind}`;
  collectionId: BuilderCollectionId;
  kind: BuilderDynamicTemplateKind;
  publicPathPattern: string;
  ownerType: BuilderDynamicTemplateOwnerType;
  builderSupport: BuilderDynamicTemplateBuilderSupport;
  editorStatus: BuilderDynamicTemplateEditorStatus;
  previewStatus: BuilderDynamicTemplatePreviewStatus;
}

type BuilderDynamicTemplateDefinition = {
  templateId: BuilderDynamicTemplateId;
  collectionId: BuilderCollectionId;
  kind: BuilderDynamicTemplateKind;
  runtimeModulePath: string;
};

const builderDynamicTemplateDefinitions: readonly BuilderDynamicTemplateDefinition[] = [
  {
    templateId: 'columns.list-template',
    collectionId: 'columns',
    kind: 'list',
    runtimeModulePath: 'src/app/[locale]/columns/page.tsx',
  },
  {
    templateId: 'columns.item-template',
    collectionId: 'columns',
    kind: 'item',
    runtimeModulePath: 'src/app/[locale]/columns/[slug]/page.tsx',
  },
  {
    templateId: 'service-areas.list-template',
    collectionId: 'service-areas',
    kind: 'list',
    runtimeModulePath: 'src/app/[locale]/services/page.tsx',
  },
  {
    templateId: 'service-areas.item-template',
    collectionId: 'service-areas',
    kind: 'item',
    runtimeModulePath: 'src/app/[locale]/services/[slug]/page.tsx',
  },
  {
    templateId: 'attorney-profiles.list-template',
    collectionId: 'attorney-profiles',
    kind: 'list',
    runtimeModulePath: 'src/app/[locale]/lawyers/page.tsx',
  },
  {
    templateId: 'attorney-profiles.item-template',
    collectionId: 'attorney-profiles',
    kind: 'item',
    runtimeModulePath: 'src/app/[locale]/lawyers/[slug]/page.tsx',
  },
];

export function isBuilderDynamicTemplateId(
  value: string | null | undefined
): value is BuilderDynamicTemplateId {
  return builderDynamicTemplateIds.includes(value as BuilderDynamicTemplateId);
}

export function decodeBuilderDynamicTemplateParam(
  value: string
): BuilderDynamicTemplateId | null {
  try {
    const decoded = decodeURIComponent(value);
    return isBuilderDynamicTemplateId(decoded) ? decoded : null;
  } catch {
    return null;
  }
}

export function buildBuilderDynamicTemplateId(
  collectionId: BuilderCollectionId,
  kind: BuilderDynamicTemplateKind
) {
  const templateId = `${collectionId}.${kind}-template`;
  if (!isBuilderDynamicTemplateId(templateId)) {
    throw new Error(`Unknown builder dynamic template id: ${templateId}`);
  }

  return templateId;
}

export function readBuilderDynamicTemplateSummaries(
  localeInput: string | null | undefined
): BuilderDynamicTemplateSummary[] {
  const locale = normalizeLocale(localeInput ?? undefined);
  const collectionSummaries = new Map(
    readBuilderCollectionSummaries(locale).map((summary) => [summary.id, summary] as const)
  );

  return builderDynamicTemplateDefinitions.map((definition) => {
    const collection = collectionSummaries.get(definition.collectionId);
    if (!collection) {
      throw new Error(`Missing collection summary for dynamic template ${definition.templateId}`);
    }

    const routeBinding = collection.routeBindings.find((binding) => binding.kind === definition.kind);
    if (!routeBinding) {
      throw new Error(`Missing route binding for dynamic template ${definition.templateId}`);
    }

    return {
      templateId: definition.templateId,
      routeId: `${definition.collectionId}.${definition.kind}`,
      collectionId: definition.collectionId,
      collectionTitle: collection.title,
      kind: definition.kind,
      title: `${collection.title} ${definition.kind === 'list' ? 'list template' : 'item template'}`,
      notes: routeBinding.notes,
      publicPathPattern: routeBinding.pathPattern,
      ownerType: 'code-route',
      runtimeOwner: 'next-app-router',
      runtimeModulePath: definition.runtimeModulePath,
      builderSupport: 'read-only-ownership',
      editorStatus: 'deferred',
      previewStatus: 'route-context-only',
      localized: collection.localized,
    };
  });
}

export function readBuilderDynamicTemplateDetail(
  templateId: BuilderDynamicTemplateId,
  localeInput: string | null | undefined
): BuilderDynamicTemplateDetail {
  const summary = readBuilderDynamicTemplateSummaries(localeInput).find(
    (candidate) => candidate.templateId === templateId
  );

  if (!summary) {
    throw new Error(`Unknown builder dynamic template detail: ${templateId}`);
  }

  return {
    ...summary,
    exclusions: [
      'No dynamic template editor is available in this batch.',
      'No record-scoped builder canvas preview is available in this batch.',
      'No dynamic page draft/publish lifecycle exists for this template yet.',
      'No manage/edit dynamic pages or dynamic SEO mapping are implied here.',
    ],
  };
}

export function readBuilderDynamicTemplateEntries(
  localeInput: string | null | undefined
): BuilderSiteDynamicTemplateEntry[] {
  return readBuilderDynamicTemplateSummaries(localeInput).map((template) => ({
    templateId: template.templateId,
    routeId: template.routeId,
    collectionId: template.collectionId,
    kind: template.kind,
    publicPathPattern: template.publicPathPattern,
    ownerType: template.ownerType,
    builderSupport: template.builderSupport,
    editorStatus: template.editorStatus,
    previewStatus: template.previewStatus,
  }));
}
