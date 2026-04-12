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
  BuilderSectionLayout,
  BuilderSectionKey,
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
  return {
    version: 1,
    pageKey,
    locale,
    datasets: createDefaultBuilderPageDatasets(pageKey),
    updatedAt: DEFAULT_UPDATED_AT,
    updatedBy: DEFAULT_UPDATED_BY,
    root: {
      id: `page-${pageKey}`,
      type: 'page',
      name,
      pageKey,
      children: getBuilderSectionDefinitions(pageKey).map((definition) => ({
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
      })),
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
      resize: 'none' as const,
    },
  }));

  return groups.length
    ? {
        version: 1,
        groups,
      }
    : undefined;
}
