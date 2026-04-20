import type { FAQItem } from '@/data/faq-content';
import type { Locale } from '@/lib/locales';
import {
  createAboutBuilderDocument,
  createContactBuilderDocument,
  createHomeBuilderDocument,
  DEFAULT_BUILDER_SECTION_LAYOUT,
} from '@/lib/builder/defaults';
import {
  cloneBuilderPageDatasetBinding,
  normalizeBuilderPageDatasets,
  replaceBuilderPageDatasetLimit,
  resetBuilderPageDatasetBinding,
} from '@/lib/builder/datasets';
import type {
  BuilderDatasetTargetId,
  BuilderResponsiveBreakpoint,
  BuilderDraftSnapshot,
  BuilderHomeDocumentState,
  BuilderPageScene,
  BuilderPersistedSceneNode,
  BuilderSceneNodeBounds,
  BuilderPageDocument,
  BuilderPageKey,
  BuilderPageState,
  BuilderSectionContentGroupNode,
  BuilderPublishedSnapshot,
  BuilderSectionLayout,
  BuilderSectionLayoutOverride,
  BuilderSectionResolvedLayout,
  BuilderSectionResolvedVisibility,
  BuilderSectionKey,
  BuilderSectionNode,
  BuilderSectionProps,
  BuilderSectionScene,
  BuilderSectionVisibility,
  BuilderServiceItem,
  BuilderStaticDocumentState,
  BuilderSurfaceOverride,
} from '@/lib/builder/types';

const LOCAL_STORAGE_PREFIX = 'builder-preview';
type BuilderLocalSnapshot = BuilderDraftSnapshot | BuilderPublishedSnapshot;
type BuilderLocalSnapshotKind = BuilderLocalSnapshot['kind'];
type BuilderLocalSnapshotForKind<TKind extends BuilderLocalSnapshotKind> = Extract<
  BuilderLocalSnapshot,
  { kind: TKind }
>;

export function getDefaultBuilderDocument(
  pageKey: BuilderPageKey,
  locale: Locale
): BuilderPageDocument {
  switch (pageKey) {
    case 'home':
      return createHomeBuilderDocument(locale);
    case 'about':
      return createAboutBuilderDocument(locale);
    case 'contact':
      return createContactBuilderDocument(locale);
    default:
      return assertNever(pageKey);
  }
}

export function getDocumentSectionKeys(document: BuilderPageDocument): BuilderSectionKey[] {
  return document.root.children.map((section) => section.sectionKey);
}

export function cloneBuilderDocument(document: BuilderPageDocument): BuilderPageDocument {
  const clonedChildren = document.root.children.map(cloneBuilderSectionNode);
  return {
    version: document.version,
    pageKey: document.pageKey,
    locale: document.locale,
    datasets: document.datasets.map(cloneBuilderPageDatasetBinding),
    scene: syncBuilderPageSceneBridge(
      document.pageKey,
      cloneBuilderPageScene(document.scene, document.pageKey, document.version),
      clonedChildren,
      document.version
    ),
    updatedAt: document.updatedAt,
    updatedBy: document.updatedBy,
    root: {
      id: document.root.id,
      type: document.root.type,
      name: document.root.name,
      pageKey: document.root.pageKey,
      children: clonedChildren,
    },
  };
}

export function normalizeBuilderDocument(
  nextDocument: Partial<BuilderPageDocument> | null | undefined,
  fallbackDocument: BuilderPageDocument
): BuilderPageDocument {
  if (!isBuilderDocument(nextDocument, fallbackDocument.pageKey, fallbackDocument.locale)) {
    return cloneBuilderDocument(fallbackDocument);
  }

  const normalizedChildren = normalizeBuilderSectionNodes(
    nextDocument.root.children,
    fallbackDocument.root.children
  );

  return {
    version: 1,
    pageKey: fallbackDocument.pageKey,
    locale: fallbackDocument.locale,
    datasets: normalizeBuilderPageDatasets(
      fallbackDocument.pageKey,
      nextDocument.datasets,
      fallbackDocument.datasets
    ),
    scene: normalizeBuilderPageScene(
      nextDocument.scene,
      fallbackDocument.scene,
      fallbackDocument.pageKey,
      normalizedChildren
    ),
    updatedAt:
      typeof nextDocument.updatedAt === 'string' && nextDocument.updatedAt
        ? nextDocument.updatedAt
        : fallbackDocument.updatedAt,
    updatedBy:
      typeof nextDocument.updatedBy === 'string' && nextDocument.updatedBy
        ? nextDocument.updatedBy
        : fallbackDocument.updatedBy,
    root: {
      id:
        typeof nextDocument.root.id === 'string' && nextDocument.root.id
          ? nextDocument.root.id
          : fallbackDocument.root.id,
      type: 'page',
      name:
        typeof nextDocument.root.name === 'string' && nextDocument.root.name
          ? nextDocument.root.name
          : fallbackDocument.root.name,
      pageKey: fallbackDocument.root.pageKey,
      children: normalizedChildren,
    },
  };
}

export function moveBuilderDocumentSection(
  document: BuilderPageDocument,
  sectionKey: BuilderSectionKey,
  offset: -1 | 1
): BuilderPageDocument {
  const currentIndex = document.root.children.findIndex((section) => section.sectionKey === sectionKey);
  if (currentIndex < 0) return cloneBuilderDocument(document);

  const nextIndex = currentIndex + offset;
  if (nextIndex < 0 || nextIndex >= document.root.children.length) {
    return cloneBuilderDocument(document);
  }

  const nextChildren = [...document.root.children];
  const [removed] = nextChildren.splice(currentIndex, 1);
  nextChildren.splice(nextIndex, 0, removed);

  return touchBuilderDocument({
    ...cloneBuilderDocument(document),
    root: {
      ...document.root,
      children: nextChildren.map(cloneBuilderSectionNode),
    },
  });
}

export function moveBuilderDocumentSectionToIndex(
  document: BuilderPageDocument,
  sectionKey: BuilderSectionKey,
  targetIndex: number
): BuilderPageDocument {
  const currentIndex = document.root.children.findIndex((section) => section.sectionKey === sectionKey);
  if (currentIndex < 0) return cloneBuilderDocument(document);

  const boundedTargetIndex = Math.max(0, Math.min(document.root.children.length - 1, targetIndex));
  if (boundedTargetIndex === currentIndex) {
    return cloneBuilderDocument(document);
  }

  const nextChildren = [...document.root.children];
  const [removed] = nextChildren.splice(currentIndex, 1);
  nextChildren.splice(boundedTargetIndex, 0, removed);

  return touchBuilderDocument({
    ...cloneBuilderDocument(document),
    root: {
      ...document.root,
      children: nextChildren.map(cloneBuilderSectionNode),
    },
  });
}

export function setBuilderDocumentSectionHidden(
  document: BuilderPageDocument,
  sectionKey: BuilderSectionKey,
  hidden: boolean
): BuilderPageDocument {
  const nextChildren = document.root.children.map((section) =>
    section.sectionKey === sectionKey ? { ...section, hidden } : section
  );

  return touchBuilderDocument({
    ...cloneBuilderDocument(document),
    root: {
      ...document.root,
      children: nextChildren.map(cloneBuilderSectionNode),
    },
  });
}

export function updateBuilderDocumentSectionVisibility(
  document: BuilderPageDocument,
  sectionKey: BuilderSectionKey,
  hidden: boolean,
  viewport: BuilderResponsiveBreakpoint | 'desktop' = 'desktop'
): BuilderPageDocument {
  const nextChildren = document.root.children.map((section) =>
    section.sectionKey === sectionKey
      ? {
          ...section,
          hidden: viewport === 'desktop' ? hidden : section.hidden ?? false,
          props: applyBuilderSectionVisibilityPropsOverride(
            section.hidden ?? false,
            section.props,
            hidden,
            viewport
          ),
        }
      : cloneBuilderSectionNode(section)
  );

  return touchBuilderDocument({
    ...cloneBuilderDocument(document),
    root: {
      ...document.root,
      children: nextChildren.map(cloneBuilderSectionNode),
    },
  });
}

export function clearBuilderDocumentSectionVisibilityOverride(
  document: BuilderPageDocument,
  sectionKey: BuilderSectionKey,
  viewport: BuilderResponsiveBreakpoint
): BuilderPageDocument {
  const nextChildren = document.root.children.map((section) =>
    section.sectionKey === sectionKey
      ? {
          ...section,
          props: clearBuilderSectionVisibilityPropsOverride(section.props, viewport),
        }
      : cloneBuilderSectionNode(section)
  );

  return touchBuilderDocument({
    ...cloneBuilderDocument(document),
    root: {
      ...document.root,
      children: nextChildren.map(cloneBuilderSectionNode),
    },
  });
}

export function setBuilderDocumentSectionLocked(
  document: BuilderPageDocument,
  sectionKey: BuilderSectionKey,
  locked: boolean
): BuilderPageDocument {
  const nextChildren = document.root.children.map((section) =>
    section.sectionKey === sectionKey ? { ...section, locked } : section
  );

  return touchBuilderDocument({
    ...cloneBuilderDocument(document),
    root: {
      ...document.root,
      children: nextChildren.map(cloneBuilderSectionNode),
    },
  });
}

export function updateBuilderDocumentSectionLayout(
  document: BuilderPageDocument,
  sectionKey: BuilderSectionKey,
  layout: BuilderSectionLayoutOverride,
  viewport: BuilderResponsiveBreakpoint | 'desktop' = 'desktop'
): BuilderPageDocument {
  const nextChildren = document.root.children.map((section) =>
    section.sectionKey === sectionKey
      ? {
          ...section,
          props: {
            ...cloneBuilderSectionProps(section.props),
            layout: applyBuilderSectionLayoutOverride(
              normalizeBuilderSectionProps(section.props).layout,
              layout,
              viewport
            ),
          },
        }
      : cloneBuilderSectionNode(section)
  );

  return touchBuilderDocument({
    ...cloneBuilderDocument(document),
    root: {
      ...document.root,
      children: nextChildren,
    },
  });
}

export function resetBuilderDocumentSectionLayout(
  document: BuilderPageDocument,
  fallbackDocument: BuilderPageDocument,
  sectionKey: BuilderSectionKey,
  viewport: BuilderResponsiveBreakpoint | 'desktop' = 'desktop'
): BuilderPageDocument {
  const fallbackSection = fallbackDocument.root.children.find(
    (section) => section.sectionKey === sectionKey
  );
  if (!fallbackSection) return cloneBuilderDocument(document);

  const nextChildren = document.root.children.map((section) =>
    section.sectionKey === sectionKey
      ? {
          ...section,
          props:
            viewport === 'desktop'
              ? cloneBuilderSectionProps(fallbackSection.props)
              : {
                  ...cloneBuilderSectionProps(section.props),
                  layout: applyBuilderSectionLayoutResetForViewport(
                    normalizeBuilderSectionProps(section.props).layout,
                    normalizeBuilderSectionProps(fallbackSection.props).layout,
                    viewport
                  ),
                },
        }
      : cloneBuilderSectionNode(section)
  );

  return touchBuilderDocument({
    ...cloneBuilderDocument(document),
    root: {
      ...document.root,
      children: nextChildren,
    },
  });
}

export function resetBuilderDocumentSection(
  document: BuilderPageDocument,
  fallbackDocument: BuilderPageDocument,
  sectionKey: BuilderSectionKey
): BuilderPageDocument {
  const currentSection = document.root.children.find((section) => section.sectionKey === sectionKey);
  const fallbackSection = fallbackDocument.root.children.find((section) => section.sectionKey === sectionKey);
  const fallbackIndex = fallbackDocument.root.children.findIndex((section) => section.sectionKey === sectionKey);

  if (!currentSection || !fallbackSection || fallbackIndex < 0) {
    return cloneBuilderDocument(document);
  }

  const nextChildren = document.root.children
    .filter((section) => section.sectionKey !== sectionKey)
    .map(cloneBuilderSectionNode);
  const nextIndex = getResetSectionInsertIndex(nextChildren, fallbackDocument.root.children, fallbackIndex);

  nextChildren.splice(nextIndex, 0, {
    ...cloneBuilderSectionNode(fallbackSection),
    id: currentSection.id,
  });

  return touchBuilderDocument({
    ...cloneBuilderDocument(document),
    root: {
      ...document.root,
      children: nextChildren,
    },
  });
}

export function createDefaultHomeDocumentState({
  faqItems,
  serviceItems,
}: {
  faqItems: FAQItem[];
  serviceItems: BuilderServiceItem[];
}): BuilderHomeDocumentState {
  return {
    version: 1,
    faqItems: cloneFaqItems(faqItems),
    serviceItems: cloneServiceItems(serviceItems),
    overrides: {},
    activeCollectionIndex: {
      'home.faq': clampCollectionIndex(0, faqItems.length),
      'home.services': clampCollectionIndex(0, serviceItems.length),
    },
  };
}

export function createDefaultStaticDocumentState(): BuilderStaticDocumentState {
  return {
    version: 1,
    overrides: {},
  };
}

export function normalizeStaticDocumentState(
  nextState: Partial<BuilderStaticDocumentState> | null | undefined,
  fallbackState: BuilderStaticDocumentState
): BuilderStaticDocumentState {
  return {
    version: 1,
    overrides:
      nextState?.overrides && typeof nextState.overrides === 'object'
        ? sanitizeOverrides(nextState.overrides)
        : { ...fallbackState.overrides },
  };
}

export function resolveBuilderSectionLayout(
  section: Pick<BuilderSectionNode, 'props'> | null | undefined,
  viewport: BuilderResponsiveBreakpoint | 'desktop' = 'desktop'
): BuilderSectionResolvedLayout {
  return resolveBuilderSectionLayoutForViewport(normalizeBuilderSectionProps(section?.props).layout, viewport);
}

export function resolveBuilderSectionHidden(
  section: Pick<BuilderSectionNode, 'hidden' | 'props'> | null | undefined,
  viewport: BuilderResponsiveBreakpoint | 'desktop' = 'desktop'
) {
  const baseHidden = Boolean(section?.hidden);
  const visibility = normalizeBuilderSectionProps(section?.props).visibility;
  return resolveBuilderSectionVisibilityForViewport(baseHidden, visibility, viewport);
}

export function resolveBuilderSectionHiddenStates(
  section: Pick<BuilderSectionNode, 'hidden' | 'props'> | null | undefined
): BuilderSectionResolvedVisibility {
  const baseHidden = Boolean(section?.hidden);
  const visibility = normalizeBuilderSectionProps(section?.props).visibility;
  return {
    desktop: resolveBuilderSectionVisibilityForViewport(baseHidden, visibility, 'desktop'),
    tablet: resolveBuilderSectionVisibilityForViewport(baseHidden, visibility, 'tablet'),
    mobile: resolveBuilderSectionVisibilityForViewport(baseHidden, visibility, 'mobile'),
  };
}

export function resolveBuilderSectionLayouts(
  section: Pick<BuilderSectionNode, 'props'> | null | undefined
): Record<'desktop' | BuilderResponsiveBreakpoint, BuilderSectionResolvedLayout> {
  const layout = normalizeBuilderSectionProps(section?.props).layout;

  return {
    desktop: resolveBuilderSectionLayoutForViewport(layout, 'desktop'),
    tablet: resolveBuilderSectionLayoutForViewport(layout, 'tablet'),
    mobile: resolveBuilderSectionLayoutForViewport(layout, 'mobile'),
  };
}

export function getStoredBuilderSectionLayout(
  section: Pick<BuilderSectionNode, 'props'> | null | undefined
): BuilderSectionLayout {
  return cloneStoredBuilderSectionLayout(normalizeBuilderSectionProps(section?.props).layout);
}

export function getStoredBuilderSectionVisibility(
  section: Pick<BuilderSectionNode, 'props'> | null | undefined
): BuilderSectionVisibility | undefined {
  return cloneBuilderSectionVisibility(normalizeBuilderSectionProps(section?.props).visibility);
}

export function replaceBuilderDocumentSectionVisibility(
  document: BuilderPageDocument,
  sectionKey: BuilderSectionKey,
  hidden: boolean,
  visibility: BuilderSectionVisibility | null | undefined
): BuilderPageDocument {
  const normalizedVisibility = cloneBuilderSectionVisibility(visibility);
  const nextChildren = document.root.children.map((section) =>
    section.sectionKey === sectionKey
      ? {
          ...section,
          hidden,
          props: {
            layout: cloneStoredBuilderSectionLayout(normalizeBuilderSectionProps(section.props).layout),
            visibility: normalizedVisibility,
          },
        }
      : cloneBuilderSectionNode(section)
  );

  return touchBuilderDocument({
    ...cloneBuilderDocument(document),
    root: {
      ...document.root,
      children: nextChildren,
    },
  });
}

export function replaceBuilderDocumentSectionLayout(
  document: BuilderPageDocument,
  sectionKey: BuilderSectionKey,
  layout: BuilderSectionLayout
): BuilderPageDocument {
  const normalizedLayout = cloneStoredBuilderSectionLayout(layout);
  const nextChildren = document.root.children.map((section) =>
    section.sectionKey === sectionKey
      ? {
          ...section,
          props: {
            ...cloneBuilderSectionProps(section.props),
            layout: normalizedLayout,
          },
        }
      : cloneBuilderSectionNode(section)
  );

  return touchBuilderDocument({
    ...cloneBuilderDocument(document),
    root: {
      ...document.root,
      children: nextChildren,
    },
  });
}

export function updateBuilderDocumentSectionContentGroupBounds(
  document: BuilderPageDocument,
  sectionKey: BuilderSectionKey,
  groupId: string,
  bounds: BuilderSceneNodeBounds,
  viewport: BuilderResponsiveBreakpoint | 'desktop' = 'desktop'
): BuilderPageDocument {
  const nextChildren = document.root.children.map((section) =>
    section.sectionKey === sectionKey
      ? {
          ...section,
          props: updateBuilderSectionContentGroupSceneProps(section.props, groupId, bounds, viewport),
        }
      : cloneBuilderSectionNode(section)
  );

  const nextDocument = updateBuilderPageSceneContentGroupBounds(
    {
      ...cloneBuilderDocument(document),
      root: {
        ...document.root,
        children: nextChildren,
      },
    },
    sectionKey,
    groupId,
    bounds,
    viewport
  );

  return touchBuilderDocument({
    ...nextDocument,
  });
}

export function syncBuilderDocumentSectionContentGroupMeasuredBounds(
  document: BuilderPageDocument,
  sectionKey: BuilderSectionKey,
  groupId: string,
  bounds: BuilderSceneNodeBounds,
  viewport: BuilderResponsiveBreakpoint | 'desktop' = 'desktop'
): BuilderPageDocument {
  return touchBuilderDocument(
    updateBuilderPageSceneContentGroupMeasuredBounds(
      cloneBuilderDocument(document),
      sectionKey,
      groupId,
      bounds,
      viewport
    )
  );
}

export function setBuilderDocumentDatasetLimit(
  document: BuilderPageDocument,
  targetId: BuilderDatasetTargetId,
  limit: number
): BuilderPageDocument {
  return touchBuilderDocument({
    ...cloneBuilderDocument(document),
    datasets: replaceBuilderPageDatasetLimit(document.datasets, document.pageKey, targetId, limit),
  });
}

export function resetBuilderDocumentDataset(
  document: BuilderPageDocument,
  targetId: BuilderDatasetTargetId
): BuilderPageDocument {
  return touchBuilderDocument({
    ...cloneBuilderDocument(document),
    datasets: resetBuilderPageDatasetBinding(document.datasets, document.pageKey, targetId),
  });
}

export function normalizeHomeDocumentState(
  nextState: Partial<BuilderHomeDocumentState> | null | undefined,
  fallbackState: BuilderHomeDocumentState
): BuilderHomeDocumentState {
  const faqItems = normalizeFaqItems(nextState?.faqItems, fallbackState.faqItems);
  const serviceItems = normalizeServiceItems(nextState?.serviceItems, fallbackState.serviceItems);
  const overrides =
    nextState?.overrides && typeof nextState.overrides === 'object'
      ? sanitizeOverrides(nextState.overrides)
      : { ...fallbackState.overrides };
  const activeCollectionIndex =
    nextState?.activeCollectionIndex && typeof nextState.activeCollectionIndex === 'object'
      ? {
          'home.faq': clampCollectionIndex(
            nextState.activeCollectionIndex['home.faq'],
            faqItems.length
          ),
          'home.services': clampCollectionIndex(
            nextState.activeCollectionIndex['home.services'],
            serviceItems.length
          ),
        }
      : {
          'home.faq': clampCollectionIndex(
            fallbackState.activeCollectionIndex['home.faq'],
            faqItems.length
          ),
          'home.services': clampCollectionIndex(
            fallbackState.activeCollectionIndex['home.services'],
            serviceItems.length
          ),
        };

  return {
    version: 1,
    faqItems,
    serviceItems,
    overrides,
    activeCollectionIndex,
  };
}

export function normalizeBuilderPageState(
  pageKey: BuilderPageKey,
  nextState: Partial<BuilderPageState> | null | undefined,
  fallbackState: BuilderPageState
): BuilderPageState {
  switch (pageKey) {
    case 'home':
      return normalizeHomeDocumentState(
        nextState as Partial<BuilderHomeDocumentState> | null | undefined,
        fallbackState as BuilderHomeDocumentState
      );
    case 'about':
    case 'contact':
      return normalizeStaticDocumentState(
        nextState as Partial<BuilderStaticDocumentState> | null | undefined,
        fallbackState as BuilderStaticDocumentState
      );
    default:
      return assertNever(pageKey);
  }
}

export function readLocalBuilderDraftSnapshot({
  pageKey,
  locale,
  fallbackDocument,
  fallbackState,
}: {
  pageKey: BuilderPageKey;
  locale: Locale;
  fallbackDocument: BuilderPageDocument;
  fallbackState: BuilderHomeDocumentState;
}): BuilderDraftSnapshot | null {
  return readLocalBuilderSnapshot({
    kind: 'draft',
    pageKey,
    locale,
    fallbackDocument,
    fallbackState,
  });
}

export function writeLocalBuilderDraftSnapshot({
  pageKey,
  locale,
  document,
  state,
}: {
  pageKey: BuilderPageKey;
  locale: Locale;
  document: BuilderPageDocument;
  state: BuilderHomeDocumentState;
}): BuilderDraftSnapshot {
  return writeLocalBuilderSnapshot({
    kind: 'draft',
    pageKey,
    locale,
    document,
    state,
  });
}

export function clearLocalBuilderDraftSnapshot(pageKey: BuilderPageKey, locale: Locale) {
  clearLocalBuilderSnapshot('draft', pageKey, locale);
}

export function readLocalBuilderPublishedSnapshot({
  pageKey,
  locale,
  fallbackDocument,
  fallbackState,
}: {
  pageKey: BuilderPageKey;
  locale: Locale;
  fallbackDocument: BuilderPageDocument;
  fallbackState: BuilderHomeDocumentState;
}): BuilderPublishedSnapshot | null {
  return readLocalBuilderSnapshot({
    kind: 'published',
    pageKey,
    locale,
    fallbackDocument,
    fallbackState,
  });
}

export function writeLocalBuilderPublishedSnapshot({
  pageKey,
  locale,
  document,
  state,
}: {
  pageKey: BuilderPageKey;
  locale: Locale;
  document: BuilderPageDocument;
  state: BuilderHomeDocumentState;
}): BuilderPublishedSnapshot {
  return writeLocalBuilderSnapshot({
    kind: 'published',
    pageKey,
    locale,
    document,
    state,
  });
}

export function clearLocalBuilderPublishedSnapshot(pageKey: BuilderPageKey, locale: Locale) {
  clearLocalBuilderSnapshot('published', pageKey, locale);
}

function assertNever(value: never): never {
  throw new Error(`Unsupported builder page key: ${value}`);
}

function readLocalBuilderSnapshot<TKind extends BuilderLocalSnapshotKind>({
  kind,
  pageKey,
  locale,
  fallbackDocument,
  fallbackState,
}: {
  kind: TKind;
  pageKey: BuilderPageKey;
  locale: Locale;
  fallbackDocument: BuilderPageDocument;
  fallbackState: BuilderHomeDocumentState;
}): BuilderLocalSnapshotForKind<TKind> | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(getBuilderSnapshotStorageKey(kind, pageKey, locale));
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<BuilderLocalSnapshot>;
    if (parsed.version !== 1 || parsed.kind !== kind || parsed.pageKey !== pageKey || parsed.locale !== locale) {
      return null;
    }

    return {
      version: 1 as const,
      kind,
      pageKey,
      locale,
      savedAt: typeof parsed.savedAt === 'string' ? parsed.savedAt : '',
      document: normalizeBuilderDocument(parsed.document, fallbackDocument),
      state: normalizeHomeDocumentState(
        parsed.state as Partial<BuilderHomeDocumentState> | null | undefined,
        fallbackState
      ),
    } as BuilderLocalSnapshotForKind<TKind>;
  } catch {
    window.localStorage.removeItem(getBuilderSnapshotStorageKey(kind, pageKey, locale));
    return null;
  }
}

function writeLocalBuilderSnapshot<TKind extends BuilderLocalSnapshotKind>({
  kind,
  pageKey,
  locale,
  document,
  state,
}: {
  kind: TKind;
  pageKey: BuilderPageKey;
  locale: Locale;
  document: BuilderPageDocument;
  state: BuilderHomeDocumentState;
}): BuilderLocalSnapshotForKind<TKind> {
  const snapshot = {
    version: 1 as const,
    kind,
    pageKey,
    locale,
    savedAt: new Date().toISOString(),
    document: normalizeBuilderDocument(document, document),
    state: normalizeHomeDocumentState(state, state),
  };

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(
      getBuilderSnapshotStorageKey(kind, pageKey, locale),
      JSON.stringify(snapshot)
    );
  }

  return snapshot as BuilderLocalSnapshotForKind<TKind>;
}

function clearLocalBuilderSnapshot(
  kind: BuilderLocalSnapshotKind,
  pageKey: BuilderPageKey,
  locale: Locale
) {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(getBuilderSnapshotStorageKey(kind, pageKey, locale));
}

function getBuilderSnapshotStorageKey(
  kind: BuilderLocalSnapshotKind,
  pageKey: BuilderPageKey,
  locale: Locale
) {
  return `${LOCAL_STORAGE_PREFIX}:${kind}:${pageKey}:${locale}`;
}

function isBuilderDocument(
  value: unknown,
  pageKey: BuilderPageKey,
  locale: Locale
): value is BuilderPageDocument {
  if (!value || typeof value !== 'object') return false;
  const document = value as Partial<BuilderPageDocument>;
  return (
    document.version === 1 &&
    document.pageKey === pageKey &&
    document.locale === locale &&
    Boolean(document.root) &&
    typeof document.updatedAt === 'string' &&
    typeof document.updatedBy === 'string'
  );
}

function cloneBuilderSectionNode(section: BuilderSectionNode): BuilderSectionNode {
  return {
    id: section.id,
    type: 'section',
    name: section.name,
    sectionKey: section.sectionKey,
    hidden: section.hidden ?? false,
    locked: section.locked ?? false,
    props: cloneBuilderSectionProps(section.props),
  };
}

function normalizeBuilderSectionNodes(
  nextChildren: Partial<BuilderSectionNode>[] | undefined,
  fallbackChildren: BuilderSectionNode[]
): BuilderSectionNode[] {
  if (!Array.isArray(nextChildren) || nextChildren.length === 0) {
    return fallbackChildren.map(cloneBuilderSectionNode);
  }

  const fallbackByKey = new Map(
    fallbackChildren.map((section) => [section.sectionKey, section] as const)
  );

  const normalized = nextChildren.reduce<BuilderSectionNode[]>((acc, section, index) => {
      if (!section || section.type !== 'section' || typeof section.sectionKey !== 'string') {
        return acc;
      }

      const fallbackSection =
        fallbackByKey.get(section.sectionKey) ??
        fallbackChildren[index] ??
        fallbackChildren.find((current) => current.sectionKey === section.sectionKey);

      if (!fallbackSection) return acc;

      acc.push({
        id: typeof section.id === 'string' && section.id ? section.id : fallbackSection.id,
        type: 'section',
        name: typeof section.name === 'string' && section.name ? section.name : fallbackSection.name,
        sectionKey: fallbackSection.sectionKey,
        hidden: typeof section.hidden === 'boolean' ? section.hidden : (fallbackSection.hidden ?? false),
        locked: typeof section.locked === 'boolean' ? section.locked : (fallbackSection.locked ?? false),
        props: normalizeBuilderSectionProps(
          section.props,
          fallbackSection.props
        ),
      });

      return acc;
    }, []);

  return normalized.length > 0 ? normalized : fallbackChildren.map(cloneBuilderSectionNode);
}

function getResetSectionInsertIndex(
  currentChildren: BuilderSectionNode[],
  fallbackChildren: BuilderSectionNode[],
  fallbackIndex: number
) {
  if (currentChildren.length === 0) return 0;

  const nextSibling = fallbackChildren
    .slice(fallbackIndex + 1)
    .find((section) => currentChildren.some((current) => current.sectionKey === section.sectionKey));

  if (!nextSibling) return currentChildren.length;

  const nextSiblingIndex = currentChildren.findIndex(
    (section) => section.sectionKey === nextSibling.sectionKey
  );

  return nextSiblingIndex >= 0 ? nextSiblingIndex : currentChildren.length;
}

function cloneBuilderSectionProps(
  props: BuilderSectionProps | null | undefined
): BuilderSectionProps {
  const normalized = normalizeBuilderSectionProps(props);
  return {
    layout: cloneStoredBuilderSectionLayout(normalized.layout),
    visibility: cloneBuilderSectionVisibility(normalized.visibility),
    scene: cloneBuilderSectionScene(normalized.scene),
  };
}

function normalizeBuilderSectionProps(
  nextProps: Partial<BuilderSectionProps> | null | undefined,
  fallbackProps?: BuilderSectionProps | null
): BuilderSectionProps {
  const fallbackLayout = fallbackProps?.layout ?? DEFAULT_BUILDER_SECTION_LAYOUT;
  const fallbackVisibility = fallbackProps?.visibility;
  const nextLayout =
    nextProps?.layout && typeof nextProps.layout === 'object'
      ? nextProps.layout
      : null;

  return {
    layout: {
      width: isSectionWidthPreset(nextLayout?.width)
        ? nextLayout.width
        : fallbackLayout.width,
      alignment: isSectionAlignmentPreset(nextLayout?.alignment)
        ? nextLayout.alignment
        : fallbackLayout.alignment,
      spacingTop: isSectionSpacingPreset(nextLayout?.spacingTop)
        ? nextLayout.spacingTop
        : fallbackLayout.spacingTop,
      spacingBottom: isSectionSpacingPreset(nextLayout?.spacingBottom)
        ? nextLayout.spacingBottom
        : fallbackLayout.spacingBottom,
      paddingInline: isSectionSpacingPreset(nextLayout?.paddingInline)
        ? nextLayout.paddingInline
        : fallbackLayout.paddingInline,
      paddingBlock: isSectionSpacingPreset(nextLayout?.paddingBlock)
        ? nextLayout.paddingBlock
        : fallbackLayout.paddingBlock,
      overrides: normalizeBuilderSectionLayoutOverrides(
        nextLayout?.overrides,
        fallbackLayout.overrides
      ),
    },
    visibility: normalizeBuilderSectionVisibility(
      nextProps?.visibility,
      fallbackVisibility
    ),
    scene: normalizeBuilderSectionScene(
      nextProps?.scene,
      fallbackProps?.scene
    ),
  };
}

function cloneBuilderSectionScene(
  scene: BuilderSectionScene | null | undefined
): BuilderSectionScene | undefined {
  if (!scene?.groups?.length) {
    return undefined;
  }

  return {
    version: 1,
    groups: scene.groups.map(cloneBuilderSectionContentGroupNode),
  };
}

function normalizeBuilderSectionScene(
  nextScene: Partial<BuilderSectionScene> | null | undefined,
  fallbackScene: BuilderSectionScene | null | undefined
): BuilderSectionScene | undefined {
  const fallbackGroups = fallbackScene?.groups ?? [];
  const nextGroups = Array.isArray(nextScene?.groups) ? nextScene.groups : [];

  if (!nextGroups.length && !fallbackGroups.length) {
    return undefined;
  }

  const fallbackByNodeId = new Map(fallbackGroups.map((group) => [group.nodeId, group] as const));
  const mergedGroups = (nextGroups.length ? nextGroups : fallbackGroups).reduce<BuilderSectionContentGroupNode[]>(
    (acc, group) => {
      if (!group || typeof group.nodeId !== 'string' || !group.nodeId) {
        return acc;
      }

      const fallbackGroup = fallbackByNodeId.get(group.nodeId);
      acc.push(
        normalizeBuilderSectionContentGroupNode(
          group,
          fallbackGroup
        )
      );
      return acc;
    },
    []
  );

  if (!mergedGroups.length) {
    return undefined;
  }

  return {
    version: 1,
    groups: mergedGroups,
  };
}

function cloneBuilderSectionContentGroupNode(
  group: BuilderSectionContentGroupNode
): BuilderSectionContentGroupNode {
  return {
    version: 1,
    nodeId: group.nodeId,
    groupKey: group.groupKey,
    label: group.label,
    surfaceIds: [...group.surfaceIds],
    datasetTargetIds: group.datasetTargetIds ? [...group.datasetTargetIds] : undefined,
    bounds: cloneBuilderSceneNodeBounds(group.bounds),
    overrides: cloneBuilderSceneNodeBoundsOverrides(group.overrides),
    measuredBounds: cloneBuilderSceneNodeBounds(group.measuredBounds),
    measuredOverrides: cloneBuilderSceneNodeBoundsOverrides(group.measuredOverrides),
    constraints: {
      movement: group.constraints.movement,
      resize: group.constraints.resize,
    },
    measuredAt: group.measuredAt,
  };
}

function cloneBuilderPageScene(
  scene: Partial<BuilderPageScene> | BuilderPageScene | null | undefined,
  pageKey: BuilderPageKey,
  sourceDocumentVersion = 1
): BuilderPageScene | undefined {
  if (!scene || !Array.isArray(scene.nodes)) {
    return undefined;
  }

  const nodes = scene.nodes
    .map((node) => cloneBuilderPersistedSceneNode(node, pageKey))
    .filter((node): node is BuilderPersistedSceneNode => Boolean(node));

  if (!nodes.length) {
    return undefined;
  }

  return {
    version: 1,
    adapterMode: 'section-scene-bridge-v1',
    sourceDocumentVersion:
      typeof scene.sourceDocumentVersion === 'number' && Number.isFinite(scene.sourceDocumentVersion)
        ? scene.sourceDocumentVersion
        : sourceDocumentVersion,
    rootNodeId:
      typeof scene.rootNodeId === 'string' && scene.rootNodeId
        ? scene.rootNodeId
        : buildBuilderPageSceneRootNodeId(pageKey),
    nodes,
  };
}

function cloneBuilderPersistedSceneNode(
  node: Partial<BuilderPersistedSceneNode> | null | undefined,
  pageKey: BuilderPageKey
): BuilderPersistedSceneNode | undefined {
  if (
    !node ||
    typeof node.nodeId !== 'string' ||
    !node.nodeId ||
    node.nodeKind !== 'content-group' ||
    typeof node.sectionKey !== 'string' ||
    !node.sectionKey ||
    typeof node.groupKey !== 'string' ||
    !node.groupKey ||
    typeof node.label !== 'string' ||
    !node.label
  ) {
    return undefined;
  }

  const sectionFrameNodeId =
    typeof node.sectionFrameNodeId === 'string' && node.sectionFrameNodeId
      ? node.sectionFrameNodeId
      : buildBuilderSectionFrameSceneNodeId(pageKey, node.sectionKey);

  return {
    version: 1,
    nodeId: node.nodeId,
    nodeKind: 'content-group',
    source: node.source === 'section-scene-bridge' ? 'section-scene-bridge' : 'page-scene',
    parentNodeId:
      typeof node.parentNodeId === 'string' && node.parentNodeId ? node.parentNodeId : sectionFrameNodeId,
    sectionFrameNodeId,
    childNodeIds: Array.isArray(node.childNodeIds)
      ? node.childNodeIds.filter((childNodeId): childNodeId is string => typeof childNodeId === 'string')
      : [],
    sectionKey: node.sectionKey,
    groupKey: node.groupKey,
    label: node.label,
    surfaceIds: Array.isArray(node.surfaceIds)
      ? node.surfaceIds.filter((surfaceId): surfaceId is string => typeof surfaceId === 'string')
      : [],
    datasetTargetIds: Array.isArray(node.datasetTargetIds)
      ? node.datasetTargetIds.filter(
          (targetId): targetId is BuilderDatasetTargetId => typeof targetId === 'string'
        )
      : undefined,
    bounds: cloneBuilderSceneNodeBounds(node.bounds),
    overrides: cloneBuilderSceneNodeBoundsOverrides(node.overrides),
    measuredBounds: cloneBuilderSceneNodeBounds(node.measuredBounds),
    measuredOverrides: cloneBuilderSceneNodeBoundsOverrides(node.measuredOverrides),
    constraints: {
      movement: node.constraints?.movement === 'section-flow' ? 'section-flow' : 'section-flow',
      resize: node.constraints?.resize === 'bounds-box' ? 'bounds-box' : 'none',
    },
    measuredAt: typeof node.measuredAt === 'string' && node.measuredAt ? node.measuredAt : undefined,
  };
}

function normalizeBuilderPageScene(
  nextScene: Partial<BuilderPageScene> | BuilderPageScene | null | undefined,
  fallbackScene: BuilderPageScene | null | undefined,
  pageKey: BuilderPageKey,
  sections: BuilderSectionNode[]
): BuilderPageScene | undefined {
  const baseScene =
    cloneBuilderPageScene(nextScene, pageKey, 1) ??
    cloneBuilderPageScene(fallbackScene, pageKey, 1) ??
    buildBuilderPageSceneFromSections(pageKey, sections, 1);

  return syncBuilderPageSceneBridge(pageKey, baseScene, sections, 1);
}

function syncBuilderPageSceneBridge(
  pageKey: BuilderPageKey,
  pageScene: BuilderPageScene | undefined,
  sections: BuilderSectionNode[],
  sourceDocumentVersion: number
): BuilderPageScene | undefined {
  const baseScene =
    cloneBuilderPageScene(pageScene, pageKey, sourceDocumentVersion) ??
    buildBuilderPageSceneFromSections(pageKey, sections, sourceDocumentVersion);

  if (!baseScene) {
    return undefined;
  }

  const bridgeNodes = sections.flatMap((section) => {
    const groups = normalizeBuilderSectionProps(section.props).scene?.groups ?? [];

    return groups.map<BuilderPersistedSceneNode>((group) => {
      const sectionFrameNodeId = buildBuilderSectionFrameSceneNodeId(pageKey, section.sectionKey);
      const existingNode = baseScene.nodes.find((candidate) => candidate.nodeId === group.nodeId);
      const promotedAuthority = existingNode?.source === 'page-scene';

      return {
        version: 1,
        nodeId: group.nodeId,
        nodeKind: 'content-group',
        source: promotedAuthority ? 'page-scene' : 'section-scene-bridge',
        parentNodeId: sectionFrameNodeId,
        sectionFrameNodeId,
        childNodeIds: existingNode ? [...existingNode.childNodeIds] : [],
        sectionKey: section.sectionKey,
        groupKey: group.groupKey,
        label: group.label,
        surfaceIds: [...group.surfaceIds],
        datasetTargetIds: group.datasetTargetIds ? [...group.datasetTargetIds] : undefined,
        bounds: promotedAuthority
          ? cloneBuilderSceneNodeBounds(existingNode.bounds ?? group.bounds)
          : cloneBuilderSceneNodeBounds(group.bounds),
        overrides: promotedAuthority
          ? cloneBuilderSceneNodeBoundsOverrides(existingNode.overrides ?? group.overrides)
          : cloneBuilderSceneNodeBoundsOverrides(group.overrides),
        measuredBounds: cloneBuilderSceneNodeBounds(
          existingNode?.measuredBounds ?? group.measuredBounds ?? group.bounds
        ),
        measuredOverrides: cloneBuilderSceneNodeBoundsOverrides(
          existingNode?.measuredOverrides ?? group.measuredOverrides ?? group.overrides
        ),
        constraints: {
          movement: group.constraints.movement,
          resize: group.constraints.resize,
        },
        measuredAt: promotedAuthority ? existingNode.measuredAt ?? group.measuredAt : group.measuredAt,
      };
    });
  });

  const bridgeNodeIds = new Set(bridgeNodes.map((node) => node.nodeId));
  const preservedNodes = baseScene.nodes.filter((node) => !bridgeNodeIds.has(node.nodeId));
  const nextNodes = [...preservedNodes, ...bridgeNodes];

  if (!nextNodes.length) {
    return undefined;
  }

  return {
    version: 1,
    adapterMode: 'section-scene-bridge-v1',
    sourceDocumentVersion,
    rootNodeId: baseScene.rootNodeId,
    nodes: nextNodes,
  };
}

function normalizeBuilderSectionContentGroupNode(
  nextGroup: Partial<BuilderSectionContentGroupNode>,
  fallbackGroup?: BuilderSectionContentGroupNode
): BuilderSectionContentGroupNode {
  return {
    version: 1,
    nodeId:
      typeof nextGroup.nodeId === 'string' && nextGroup.nodeId
        ? nextGroup.nodeId
        : fallbackGroup?.nodeId ?? '',
    groupKey:
      typeof nextGroup.groupKey === 'string' && nextGroup.groupKey
        ? nextGroup.groupKey
        : fallbackGroup?.groupKey ?? '',
    label:
      typeof nextGroup.label === 'string' && nextGroup.label
        ? nextGroup.label
        : fallbackGroup?.label ?? '',
    surfaceIds: Array.isArray(nextGroup.surfaceIds)
      ? nextGroup.surfaceIds.filter((surfaceId): surfaceId is string => typeof surfaceId === 'string')
      : [...(fallbackGroup?.surfaceIds ?? [])],
    datasetTargetIds: Array.isArray(nextGroup.datasetTargetIds)
      ? nextGroup.datasetTargetIds.filter(
          (targetId): targetId is BuilderDatasetTargetId => typeof targetId === 'string'
        )
      : fallbackGroup?.datasetTargetIds
        ? [...fallbackGroup.datasetTargetIds]
        : undefined,
    bounds: normalizeBuilderSceneNodeBounds(nextGroup.bounds, fallbackGroup?.bounds),
    overrides: normalizeBuilderSceneNodeBoundsOverrides(nextGroup.overrides, fallbackGroup?.overrides),
    measuredBounds: normalizeBuilderSceneNodeBounds(
      nextGroup.measuredBounds,
      fallbackGroup?.measuredBounds
    ),
    measuredOverrides: normalizeBuilderSceneNodeBoundsOverrides(
      nextGroup.measuredOverrides,
      fallbackGroup?.measuredOverrides
    ),
    constraints: {
      movement: 'section-flow',
      resize: 'bounds-box',
    },
    measuredAt:
      typeof nextGroup.measuredAt === 'string' && nextGroup.measuredAt
        ? nextGroup.measuredAt
        : fallbackGroup?.measuredAt,
  };
}

function cloneBuilderSceneNodeBounds(
  bounds: BuilderSceneNodeBounds | null | undefined
): BuilderSceneNodeBounds | undefined {
  if (!bounds) {
    return undefined;
  }

  return {
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
  };
}

function normalizeBuilderSceneNodeBounds(
  nextBounds: Partial<BuilderSceneNodeBounds> | null | undefined,
  fallbackBounds?: Partial<BuilderSceneNodeBounds> | null
): BuilderSceneNodeBounds | undefined {
  const x = coerceFiniteNumber(nextBounds?.x, fallbackBounds?.x);
  const y = coerceFiniteNumber(nextBounds?.y, fallbackBounds?.y);
  const width = coerceFiniteNumber(nextBounds?.width, fallbackBounds?.width);
  const height = coerceFiniteNumber(nextBounds?.height, fallbackBounds?.height);

  if (
    typeof x !== 'number' ||
    typeof y !== 'number' ||
    typeof width !== 'number' ||
    typeof height !== 'number'
  ) {
    return undefined;
  }

  return { x, y, width, height };
}

function cloneBuilderSceneNodeBoundsOverrides(
  overrides: BuilderSectionContentGroupNode['overrides']
): BuilderSectionContentGroupNode['overrides'] {
  if (!overrides) {
    return undefined;
  }

  const nextOverrides = (['tablet', 'mobile'] as const).reduce<
    NonNullable<BuilderSectionContentGroupNode['overrides']>
  >((acc, viewport) => {
    const currentBounds = overrides[viewport];
    const nextBounds = currentBounds
      ? {
          ...(typeof currentBounds.x === 'number' ? { x: currentBounds.x } : {}),
          ...(typeof currentBounds.y === 'number' ? { y: currentBounds.y } : {}),
          ...(typeof currentBounds.width === 'number' ? { width: currentBounds.width } : {}),
          ...(typeof currentBounds.height === 'number' ? { height: currentBounds.height } : {}),
        }
      : undefined;
    if (nextBounds) {
      acc[viewport] = nextBounds;
    }
    return acc;
  }, {});

  return Object.keys(nextOverrides).length ? nextOverrides : undefined;
}

function normalizeBuilderSceneNodeBoundsOverrides(
  nextOverrides: BuilderSectionContentGroupNode['overrides'] | null | undefined,
  fallbackOverrides: BuilderSectionContentGroupNode['overrides'] | null | undefined
): BuilderSectionContentGroupNode['overrides'] {
  const normalizedEntries = (['tablet', 'mobile'] as const).reduce<
    NonNullable<BuilderSectionContentGroupNode['overrides']>
  >((acc, viewport) => {
    const normalizedBounds = normalizeBuilderSceneNodeBounds(
      nextOverrides?.[viewport],
      fallbackOverrides?.[viewport]
    );
    if (normalizedBounds) {
      acc[viewport] = normalizedBounds;
    }
    return acc;
  }, {});

  return Object.keys(normalizedEntries).length ? normalizedEntries : undefined;
}

function updateBuilderSectionContentGroupSceneProps(
  props: BuilderSectionProps | null | undefined,
  groupId: string,
  bounds: BuilderSceneNodeBounds,
  viewport: BuilderResponsiveBreakpoint | 'desktop'
): BuilderSectionProps {
  const normalized = normalizeBuilderSectionProps(props);
  const scene = cloneBuilderSectionScene(normalized.scene);
  if (!scene) {
    return normalized;
  }

  const nextGroups = scene.groups.map((group) =>
    group.nodeId === groupId
      ? {
          ...group,
          bounds: viewport === 'desktop' ? cloneBuilderSceneNodeBounds(bounds) : group.bounds,
          overrides:
            viewport === 'desktop'
              ? group.overrides
              : {
                  ...cloneBuilderSceneNodeBoundsOverrides(group.overrides),
                  [viewport]: cloneBuilderSceneNodeBounds(bounds),
                },
          measuredAt: new Date().toISOString(),
        }
      : cloneBuilderSectionContentGroupNode(group)
  );

  return {
    ...normalized,
    scene: {
      version: 1,
      groups: nextGroups,
    },
  };
}

function updateBuilderPageSceneContentGroupBounds(
  document: BuilderPageDocument,
  sectionKey: BuilderSectionKey,
  groupId: string,
  bounds: BuilderSceneNodeBounds,
  viewport: BuilderResponsiveBreakpoint | 'desktop'
): BuilderPageDocument {
  const baseScene =
    cloneBuilderPageScene(document.scene, document.pageKey, document.version) ??
    buildBuilderPageSceneFromSections(document.pageKey, document.root.children, document.version);

  if (!baseScene) {
    return document;
  }

  const nextNodes = baseScene.nodes.map((node) => {
    if (node.nodeId !== groupId || node.sectionKey !== sectionKey) {
      return cloneBuilderPersistedSceneNode(node, document.pageKey) ?? node;
    }

    return {
      ...node,
      source: 'page-scene' as const,
      bounds: viewport === 'desktop' ? cloneBuilderSceneNodeBounds(bounds) : node.bounds,
      overrides:
        viewport === 'desktop'
          ? cloneBuilderSceneNodeBoundsOverrides(node.overrides)
          : {
              ...cloneBuilderSceneNodeBoundsOverrides(node.overrides),
              [viewport]: cloneBuilderSceneNodeBounds(bounds),
            },
      measuredAt: new Date().toISOString(),
    };
  });

  return {
    ...document,
    scene: {
      ...baseScene,
      sourceDocumentVersion: document.version,
      nodes: nextNodes,
    },
  };
}

function updateBuilderPageSceneContentGroupMeasuredBounds(
  document: BuilderPageDocument,
  sectionKey: BuilderSectionKey,
  groupId: string,
  bounds: BuilderSceneNodeBounds,
  viewport: BuilderResponsiveBreakpoint | 'desktop'
): BuilderPageDocument {
  const baseScene =
    cloneBuilderPageScene(document.scene, document.pageKey, document.version) ??
    buildBuilderPageSceneFromSections(document.pageKey, document.root.children, document.version);

  if (!baseScene) {
    return document;
  }

  const nextNodes = baseScene.nodes.map((node) => {
    if (node.nodeId !== groupId || node.sectionKey !== sectionKey) {
      return cloneBuilderPersistedSceneNode(node, document.pageKey) ?? node;
    }

    return {
      ...node,
      measuredBounds:
        viewport === 'desktop' ? cloneBuilderSceneNodeBounds(bounds) : node.measuredBounds,
      measuredOverrides:
        viewport === 'desktop'
          ? cloneBuilderSceneNodeBoundsOverrides(node.measuredOverrides)
          : {
              ...cloneBuilderSceneNodeBoundsOverrides(node.measuredOverrides),
              [viewport]: cloneBuilderSceneNodeBounds(bounds),
            },
      measuredAt: new Date().toISOString(),
    };
  });

  return {
    ...document,
    scene: {
      ...baseScene,
      sourceDocumentVersion: document.version,
      nodes: nextNodes,
    },
  };
}

function coerceFiniteNumber(value: unknown, fallback?: number | null) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof fallback === 'number' && Number.isFinite(fallback)) {
    return fallback;
  }

  return undefined;
}

function cloneBuilderSectionVisibility(
  visibility: BuilderSectionVisibility | null | undefined
): BuilderSectionVisibility | undefined {
  if (!visibility?.overrides) {
    return undefined;
  }

  const nextOverrides = Object.fromEntries(
    Object.entries(visibility.overrides).map(([viewport, hidden]) => [viewport, hidden])
  ) as NonNullable<BuilderSectionVisibility['overrides']>;

  return Object.keys(nextOverrides).length ? { overrides: nextOverrides } : undefined;
}

function normalizeBuilderSectionVisibility(
  nextVisibility: BuilderSectionVisibility | null | undefined,
  fallbackVisibility: BuilderSectionVisibility | null | undefined
): BuilderSectionVisibility | undefined {
  const normalizedEntries = (['tablet', 'mobile'] as const).reduce<
    Partial<Record<BuilderResponsiveBreakpoint, boolean>>
  >((acc, viewport) => {
    const nextHidden = nextVisibility?.overrides?.[viewport];
    const fallbackHidden = fallbackVisibility?.overrides?.[viewport];
    const hidden =
      typeof nextHidden === 'boolean'
        ? nextHidden
        : typeof fallbackHidden === 'boolean'
          ? fallbackHidden
          : undefined;

    if (typeof hidden === 'boolean') {
      acc[viewport] = hidden;
    }

    return acc;
  }, {});

  return Object.keys(normalizedEntries).length
    ? { overrides: normalizedEntries as BuilderSectionVisibility['overrides'] }
    : undefined;
}

function cloneStoredBuilderSectionLayout(layout: BuilderSectionLayout): BuilderSectionLayout {
  return {
    width: layout.width,
    alignment: layout.alignment,
    spacingTop: layout.spacingTop,
    spacingBottom: layout.spacingBottom,
    paddingInline: layout.paddingInline,
    paddingBlock: layout.paddingBlock,
    overrides: cloneBuilderSectionLayoutOverrides(layout.overrides),
  };
}

function cloneBuilderSectionLayoutOverrides(
  overrides: BuilderSectionLayout['overrides'] | null | undefined
): BuilderSectionLayout['overrides'] {
  if (!overrides) {
    return undefined;
  }

  const nextOverrides = Object.fromEntries(
    Object.entries(overrides).map(([viewport, override]) => [
      viewport,
      override ? { ...override } : undefined,
    ])
  ) as NonNullable<BuilderSectionLayout['overrides']>;

  return Object.keys(nextOverrides).length ? nextOverrides : undefined;
}

function normalizeBuilderSectionLayoutOverrides(
  nextOverrides: BuilderSectionLayout['overrides'] | null | undefined,
  fallbackOverrides: BuilderSectionLayout['overrides'] | null | undefined
): BuilderSectionLayout['overrides'] {
  const normalizedEntries = (['tablet', 'mobile'] as const).reduce<
    Partial<Record<BuilderResponsiveBreakpoint, BuilderSectionLayoutOverride>>
  >((acc, viewport) => {
    const normalizedOverride = normalizeBuilderSectionLayoutOverride(
      nextOverrides?.[viewport],
      fallbackOverrides?.[viewport]
    );

    if (normalizedOverride) {
      acc[viewport] = normalizedOverride;
    }

    return acc;
  }, {});

  return Object.keys(normalizedEntries).length
    ? (normalizedEntries as BuilderSectionLayout['overrides'])
    : undefined;
}

function normalizeBuilderSectionLayoutOverride(
  override: BuilderSectionLayoutOverride | null | undefined,
  fallback: BuilderSectionLayoutOverride | null | undefined
) {
  const next: BuilderSectionLayoutOverride = {};
  const source = override && typeof override === 'object' ? override : fallback;
  if (!source) {
    return undefined;
  }

  if (isSectionWidthPreset(source.width)) {
    next.width = source.width;
  }
  if (isSectionAlignmentPreset(source.alignment)) {
    next.alignment = source.alignment;
  }
  if (isSectionSpacingPreset(source.spacingTop)) {
    next.spacingTop = source.spacingTop;
  }
  if (isSectionSpacingPreset(source.spacingBottom)) {
    next.spacingBottom = source.spacingBottom;
  }
  if (isSectionSpacingPreset(source.paddingInline)) {
    next.paddingInline = source.paddingInline;
  }
  if (isSectionSpacingPreset(source.paddingBlock)) {
    next.paddingBlock = source.paddingBlock;
  }

  return Object.keys(next).length ? next : undefined;
}

function resolveBuilderSectionLayoutForViewport(
  layout: BuilderSectionLayout,
  viewport: BuilderResponsiveBreakpoint | 'desktop'
): BuilderSectionResolvedLayout {
  const base: BuilderSectionResolvedLayout = {
    width: layout.width,
    alignment: layout.alignment,
    spacingTop: layout.spacingTop,
    spacingBottom: layout.spacingBottom,
    paddingInline: layout.paddingInline,
    paddingBlock: layout.paddingBlock,
  };

  if (viewport === 'desktop') {
    return base;
  }

  const tablet = {
    ...base,
    ...layout.overrides?.tablet,
  };

  if (viewport === 'tablet') {
    return tablet;
  }

  return {
    ...tablet,
    ...layout.overrides?.mobile,
  };
}

function resolveBuilderSectionVisibilityForViewport(
  baseHidden: boolean,
  visibility: BuilderSectionVisibility | undefined,
  viewport: BuilderResponsiveBreakpoint | 'desktop'
) {
  if (viewport === 'desktop') {
    return baseHidden;
  }

  const tabletHidden =
    typeof visibility?.overrides?.tablet === 'boolean' ? visibility.overrides.tablet : baseHidden;
  if (viewport === 'tablet') {
    return tabletHidden;
  }

  return typeof visibility?.overrides?.mobile === 'boolean'
    ? visibility.overrides.mobile
    : tabletHidden;
}

function applyBuilderSectionVisibilityPropsOverride(
  baseHidden: boolean,
  props: BuilderSectionProps | null | undefined,
  hidden: boolean,
  viewport: BuilderResponsiveBreakpoint | 'desktop'
): BuilderSectionProps {
  const normalized = normalizeBuilderSectionProps(props);

  if (viewport === 'desktop') {
    return {
      layout: cloneStoredBuilderSectionLayout(normalized.layout),
      visibility: cloneBuilderSectionVisibility(normalized.visibility),
    };
  }

  const inheritedHidden =
    viewport === 'tablet'
      ? baseHidden
      : resolveBuilderSectionVisibilityForViewport(baseHidden, normalized.visibility, 'tablet');
  const nextOverrides = {
    ...(normalized.visibility?.overrides ?? {}),
  };

  if (hidden === inheritedHidden) {
    delete nextOverrides[viewport];
  } else {
    nextOverrides[viewport] = hidden;
  }

  return {
    layout: cloneStoredBuilderSectionLayout(normalized.layout),
    visibility: Object.keys(nextOverrides).length
      ? { overrides: nextOverrides }
      : undefined,
  };
}

function clearBuilderSectionVisibilityPropsOverride(
  props: BuilderSectionProps | null | undefined,
  viewport: BuilderResponsiveBreakpoint
): BuilderSectionProps {
  const normalized = normalizeBuilderSectionProps(props);
  const nextOverrides = {
    ...(normalized.visibility?.overrides ?? {}),
  };

  delete nextOverrides[viewport];

  return {
    layout: cloneStoredBuilderSectionLayout(normalized.layout),
    visibility: Object.keys(nextOverrides).length
      ? { overrides: nextOverrides }
      : undefined,
  };
}

function applyBuilderSectionLayoutOverride(
  currentLayout: BuilderSectionLayout,
  partial: BuilderSectionLayoutOverride,
  viewport: BuilderResponsiveBreakpoint | 'desktop'
): BuilderSectionLayout {
  if (viewport === 'desktop') {
    return {
      width: partial.width ?? currentLayout.width,
      alignment: partial.alignment ?? currentLayout.alignment,
      spacingTop: partial.spacingTop ?? currentLayout.spacingTop,
      spacingBottom: partial.spacingBottom ?? currentLayout.spacingBottom,
      paddingInline: partial.paddingInline ?? currentLayout.paddingInline,
      paddingBlock: partial.paddingBlock ?? currentLayout.paddingBlock,
      overrides: cloneBuilderSectionLayoutOverrides(currentLayout.overrides),
    };
  }

  const inheritedLayout = viewport === 'tablet'
    ? resolveBuilderSectionLayoutForViewport(currentLayout, 'desktop')
    : resolveBuilderSectionLayoutForViewport(currentLayout, 'tablet');
  const resolvedLayout = resolveBuilderSectionLayoutForViewport(currentLayout, viewport);
  const nextResolvedLayout = {
    ...resolvedLayout,
    ...partial,
  };
  const nextOverride: BuilderSectionLayoutOverride = {};

  if (nextResolvedLayout.width !== inheritedLayout.width) {
    nextOverride.width = nextResolvedLayout.width;
  }
  if (nextResolvedLayout.alignment !== inheritedLayout.alignment) {
    nextOverride.alignment = nextResolvedLayout.alignment;
  }
  if (nextResolvedLayout.spacingTop !== inheritedLayout.spacingTop) {
    nextOverride.spacingTop = nextResolvedLayout.spacingTop;
  }
  if (nextResolvedLayout.spacingBottom !== inheritedLayout.spacingBottom) {
    nextOverride.spacingBottom = nextResolvedLayout.spacingBottom;
  }
  if (nextResolvedLayout.paddingInline !== inheritedLayout.paddingInline) {
    nextOverride.paddingInline = nextResolvedLayout.paddingInline;
  }
  if (nextResolvedLayout.paddingBlock !== inheritedLayout.paddingBlock) {
    nextOverride.paddingBlock = nextResolvedLayout.paddingBlock;
  }

  const nextOverrides = {
    ...cloneBuilderSectionLayoutOverrides(currentLayout.overrides),
  };

  if (Object.keys(nextOverride).length) {
    nextOverrides[viewport] = nextOverride;
  } else {
    delete nextOverrides[viewport];
  }

  return {
    width: currentLayout.width,
    alignment: currentLayout.alignment,
    spacingTop: currentLayout.spacingTop,
    spacingBottom: currentLayout.spacingBottom,
    paddingInline: currentLayout.paddingInline,
    paddingBlock: currentLayout.paddingBlock,
    overrides: Object.keys(nextOverrides).length ? nextOverrides : undefined,
  };
}

function applyBuilderSectionLayoutResetForViewport(
  currentLayout: BuilderSectionLayout,
  fallbackLayout: BuilderSectionLayout,
  viewport: BuilderResponsiveBreakpoint
): BuilderSectionLayout {
  const nextOverrides = {
    ...cloneBuilderSectionLayoutOverrides(currentLayout.overrides),
  };
  const fallbackOverride = fallbackLayout.overrides?.[viewport];

  if (fallbackOverride) {
    nextOverrides[viewport] = { ...fallbackOverride };
  } else {
    delete nextOverrides[viewport];
  }

  return {
    width: currentLayout.width,
    alignment: currentLayout.alignment,
    spacingTop: currentLayout.spacingTop,
    spacingBottom: currentLayout.spacingBottom,
    paddingInline: currentLayout.paddingInline,
    paddingBlock: currentLayout.paddingBlock,
    overrides: Object.keys(nextOverrides).length ? nextOverrides : undefined,
  };
}

function touchBuilderDocument(document: BuilderPageDocument): BuilderPageDocument {
  const clonedChildren = document.root.children.map(cloneBuilderSectionNode);
  return {
    ...document,
    datasets: document.datasets.map(cloneBuilderPageDatasetBinding),
    scene: syncBuilderPageSceneBridge(
      document.pageKey,
      cloneBuilderPageScene(document.scene, document.pageKey, document.version),
      clonedChildren,
      document.version
    ),
    updatedAt: new Date().toISOString(),
    updatedBy: 'builder-preview-local',
    root: {
      ...document.root,
      children: clonedChildren,
    },
  };
}

function buildBuilderPageSceneFromSections(
  pageKey: BuilderPageKey,
  sections: BuilderSectionNode[],
  sourceDocumentVersion = 1
): BuilderPageScene | undefined {
  const nodes = sections.flatMap((section) => {
    const groups = normalizeBuilderSectionProps(section.props).scene?.groups ?? [];
    const parentNodeId = buildBuilderSectionFrameSceneNodeId(pageKey, section.sectionKey);

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
      bounds: cloneBuilderSceneNodeBounds(group.bounds),
      overrides: cloneBuilderSceneNodeBoundsOverrides(group.overrides),
      measuredBounds: cloneBuilderSceneNodeBounds(group.measuredBounds),
      measuredOverrides: cloneBuilderSceneNodeBoundsOverrides(group.measuredOverrides),
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
    sourceDocumentVersion,
    rootNodeId: buildBuilderPageSceneRootNodeId(pageKey),
    nodes,
  };
}

function buildBuilderPageSceneRootNodeId(pageKey: BuilderPageKey) {
  return `scene:${sanitizeBuilderSceneToken(pageKey)}:page`;
}

function buildBuilderSectionFrameSceneNodeId(
  pageKey: BuilderPageKey,
  sectionKey: BuilderSectionKey
) {
  return `scene:${sanitizeBuilderSceneToken(pageKey)}:${sanitizeBuilderSceneToken(sectionKey)}:frame`;
}

function sanitizeBuilderSceneToken(value: string) {
  return value.replace(/[^a-z0-9-_:.]+/gi, '-');
}

function cloneFaqItem(item: FAQItem): FAQItem {
  return {
    question: item.question,
    answer: item.answer,
  };
}

function cloneFaqItems(items: FAQItem[]) {
  return items.map(cloneFaqItem);
}

function cloneServiceItem(item: BuilderServiceItem): BuilderServiceItem {
  return {
    ...item,
    details: item.details ? [...item.details] : undefined,
    relatedColumns: item.relatedColumns
      ? item.relatedColumns.map((column) => ({ ...column }))
      : undefined,
  };
}

function cloneServiceItems(items: BuilderServiceItem[]) {
  return items.map(cloneServiceItem);
}

function normalizeFaqItems(nextItems: FAQItem[] | undefined, fallback: FAQItem[]) {
  if (!nextItems) return cloneFaqItems(fallback);
  return nextItems
    .filter(
      (item): item is FAQItem =>
        Boolean(item) && typeof item.question === 'string' && typeof item.answer === 'string'
    )
    .map(cloneFaqItem);
}

function normalizeServiceItems(
  nextItems: BuilderServiceItem[] | undefined,
  fallback: BuilderServiceItem[]
) {
  if (!nextItems) return cloneServiceItems(fallback);
  return nextItems
    .filter(
      (item): item is BuilderServiceItem =>
        Boolean(item) &&
        typeof item.title === 'string' &&
        typeof item.description === 'string' &&
        typeof item.href === 'string'
    )
    .map(cloneServiceItem);
}

function sanitizeOverrides(overrides: Record<string, BuilderSurfaceOverride>) {
  return Object.fromEntries(
    Object.entries(overrides).filter(
      ([key, override]) =>
        typeof key === 'string' &&
        Boolean(key) &&
        Boolean(override) &&
        typeof override === 'object' &&
        (override.kind === 'text' || override.kind === 'button' || override.kind === 'image')
    )
  ) as Record<string, BuilderSurfaceOverride>;
}

function clampCollectionIndex(index: number | null | undefined, length: number) {
  if (length <= 0) return 0;
  if (typeof index !== 'number' || Number.isNaN(index)) return 0;
  return Math.min(Math.max(index, 0), length - 1);
}

function isSectionWidthPreset(value: unknown): value is BuilderSectionLayout['width'] {
  return value === 'full' || value === 'wide' || value === 'narrow';
}

function isSectionAlignmentPreset(value: unknown): value is BuilderSectionLayout['alignment'] {
  return value === 'left' || value === 'center' || value === 'right';
}

function isSectionSpacingPreset(value: unknown): value is BuilderSectionLayout['spacingTop'] {
  return value === 'none' || value === 'tight' || value === 'normal' || value === 'relaxed';
}
