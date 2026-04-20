import type { Locale } from '@/lib/locales';
import { createDefaultBuilderPageDatasets } from '@/lib/builder/datasets';
import {
  buildBuilderContentGroupNodeId,
  getBuilderSectionContentGroups,
  getBuilderSectionDefinitions,
} from '@/lib/builder/registry';
import type {
  BuilderPageDocument,
  BuilderPageKey,
  BuilderPageScene,
  BuilderPersistedSceneNode,
  BuilderSectionLayout,
  BuilderSectionKey,
  BuilderSectionNode,
  BuilderSectionScene,
} from '@/lib/builder/types';

const DEFAULT_UPDATED_BY = 'builder-reset-plan';
const DEFAULT_UPDATED_AT = '2026-04-11T00:00:00.000Z';

export const DEFAULT_BUILDER_SECTION_LAYOUT: BuilderSectionLayout = {
  width: 'full',
  alignment: 'center',
  spacingTop: 'none',
  spacingBottom: 'none',
  paddingInline: 'none',
  paddingBlock: 'none',
};

export function createHomeBuilderDocument(locale: Locale): BuilderPageDocument {
  return createBuilderDocument('home', locale, 'Home Page');
}

export function createAboutBuilderDocument(locale: Locale): BuilderPageDocument {
  return createBuilderDocument('about', locale, 'About Page');
}

export function createContactBuilderDocument(locale: Locale): BuilderPageDocument {
  return createBuilderDocument('contact', locale, 'Contact Page');
}

function createBuilderDocument(
  pageKey: BuilderPageKey,
  locale: Locale,
  name: string
): BuilderPageDocument {
  const children = getBuilderSectionDefinitions(pageKey).map((definition) => ({
    id: definition.sectionKey,
    type: 'section' as const,
    name: definition.title,
    sectionKey: definition.sectionKey,
    hidden: false,
    locked: false,
    props: {
      layout: { ...DEFAULT_BUILDER_SECTION_LAYOUT },
      scene: createDefaultSectionScene(definition.sectionKey),
    },
  }));

  return {
    version: 1,
    pageKey,
    locale,
    datasets: createDefaultBuilderPageDatasets(pageKey),
    scene: createDefaultBuilderPageScene(pageKey, children),
    updatedAt: DEFAULT_UPDATED_AT,
    updatedBy: DEFAULT_UPDATED_BY,
    root: {
      id: `page-${pageKey}`,
      type: 'page',
      name,
      pageKey,
      children,
    },
  };
}

function createDefaultSectionScene(sectionKey: BuilderSectionKey): BuilderSectionScene | undefined {
  const groups = getBuilderSectionContentGroups(sectionKey).map((group) => ({
    version: 1 as const,
    nodeId: buildBuilderContentGroupNodeId(sectionKey, group.groupKey),
    groupKey: group.groupKey,
    label: group.label,
    surfaceIds: [...(group.surfaceIds ?? [])],
    datasetTargetIds: group.datasetTargetIds ? [...group.datasetTargetIds] : undefined,
      constraints: {
        movement: 'section-flow' as const,
        resize: 'bounds-box' as const,
      },
  }));

  return groups.length
    ? {
        version: 1,
        groups,
      }
    : undefined;
}

function createDefaultBuilderPageScene(
  pageKey: BuilderPageKey,
  sections: BuilderSectionNode[]
): BuilderPageScene | undefined {
  const nodes = sections.flatMap((section) => {
    const groups = section.props?.scene?.groups ?? [];
    const parentNodeId = buildSectionFrameSceneNodeId(pageKey, section.sectionKey);

    return groups.map<BuilderPersistedSceneNode>((group) => ({
      version: 1,
      nodeId: group.nodeId,
      nodeKind: 'content-group',
      source: 'section-scene-bridge',
      parentNodeId,
      sectionFrameNodeId: parentNodeId,
      childNodeIds: [],
      sectionKey: section.sectionKey,
      groupKey: group.groupKey,
      label: group.label,
      surfaceIds: [...group.surfaceIds],
      datasetTargetIds: group.datasetTargetIds ? [...group.datasetTargetIds] : undefined,
      bounds: group.bounds ? { ...group.bounds } : undefined,
      overrides: group.overrides
        ? Object.fromEntries(
            Object.entries(group.overrides).map(([viewport, bounds]) => [
              viewport,
              bounds ? { ...bounds } : bounds,
            ])
          )
        : undefined,
      measuredBounds: group.measuredBounds ? { ...group.measuredBounds } : undefined,
      measuredOverrides: group.measuredOverrides
        ? Object.fromEntries(
            Object.entries(group.measuredOverrides).map(([viewport, bounds]) => [
              viewport,
              bounds ? { ...bounds } : bounds,
            ])
          )
        : undefined,
      constraints: {
        movement: group.constraints.movement,
        resize: group.constraints.resize,
      },
      measuredAt: group.measuredAt,
    }));
  });

  if (!nodes.length) {
    return undefined;
  }

  return {
    version: 1,
    adapterMode: 'section-scene-bridge-v1',
    sourceDocumentVersion: 1,
    rootNodeId: buildPageSceneRootNodeId(pageKey),
    nodes,
  };
}

function buildPageSceneRootNodeId(pageKey: BuilderPageKey) {
  return `scene:${sanitizeSceneToken(pageKey)}:page`;
}

function buildSectionFrameSceneNodeId(pageKey: BuilderPageKey, sectionKey: BuilderSectionKey) {
  return `scene:${sanitizeSceneToken(pageKey)}:${sanitizeSceneToken(sectionKey)}:frame`;
}

function sanitizeSceneToken(value: string) {
  return value.replace(/[^a-z0-9-_:.]+/gi, '-');
}
