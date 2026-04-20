import type { Locale } from '@/lib/locales';
import type { FAQItem } from '@/data/faq-content';
import type { SiteContent } from '@/data/site-content';

export const builderPageKeys = ['home', 'about', 'contact'] as const;
export type BuilderPageKey = (typeof builderPageKeys)[number];
export const builderDatasetCollectionIds = [
  'columns',
  'service-areas',
  'attorney-profiles',
] as const;
export type BuilderDatasetCollectionId = (typeof builderDatasetCollectionIds)[number];
export const builderDatasetTargetIds = ['home.insights.feed'] as const;
export type BuilderDatasetTargetId = (typeof builderDatasetTargetIds)[number];
export const builderDatasetModes = ['list'] as const;
export type BuilderDatasetMode = (typeof builderDatasetModes)[number];

export const builderHomeSectionKeys = [
  'home.hero',
  'home.insights',
  'home.services',
  'home.attorney',
  'home.results',
  'home.stats',
  'home.faq',
  'home.offices',
  'home.contact',
] as const;

export type BuilderHomeSectionKey = (typeof builderHomeSectionKeys)[number];
export const builderAboutSectionKeys = [
  'about.header',
  'about.introduction',
  'about.attorney',
  'about.contact',
] as const;

export type BuilderAboutSectionKey = (typeof builderAboutSectionKeys)[number];

export const builderContactSectionKeys = [
  'contact.hero',
  'contact.consultation-guide',
  'contact.contact-blocks',
  'contact.offices',
] as const;

export type BuilderContactSectionKey = (typeof builderContactSectionKeys)[number];
export type BuilderSectionKey =
  | BuilderHomeSectionKey
  | BuilderAboutSectionKey
  | BuilderContactSectionKey;
export type BuilderCollectionSectionKey = 'home.faq' | 'home.services';
export type BuilderServiceItem = SiteContent['services']['items'][number];
export const builderViewportModes = ['desktop', 'tablet', 'mobile'] as const;
export type BuilderViewportMode = (typeof builderViewportModes)[number];
export const builderResponsiveBreakpoints = ['tablet', 'mobile'] as const;
export type BuilderResponsiveBreakpoint = (typeof builderResponsiveBreakpoints)[number];
export const builderSectionWidthPresets = ['full', 'wide', 'narrow'] as const;
export type BuilderSectionWidthPreset = (typeof builderSectionWidthPresets)[number];
export const builderSectionAlignmentPresets = ['left', 'center', 'right'] as const;
export type BuilderSectionAlignmentPreset = (typeof builderSectionAlignmentPresets)[number];
export const builderSectionSpacingPresets = ['none', 'tight', 'normal', 'relaxed'] as const;
export type BuilderSectionSpacingPreset = (typeof builderSectionSpacingPresets)[number];

export type BuilderNodeType = 'page' | 'section';
export type BuilderSelectableTargetKind = 'section' | 'group' | 'text' | 'button' | 'image' | 'unknown';
export type BuilderEditableTargetKind = Exclude<
  BuilderSelectableTargetKind,
  'section' | 'group' | 'unknown'
>;
export type BuilderSnapshotKind = 'draft' | 'published';

export interface BuilderNodeBase {
  id: string;
  type: BuilderNodeType;
  name: string;
}

export interface BuilderSectionResolvedLayout {
  width: BuilderSectionWidthPreset;
  alignment: BuilderSectionAlignmentPreset;
  spacingTop: BuilderSectionSpacingPreset;
  spacingBottom: BuilderSectionSpacingPreset;
  paddingInline: BuilderSectionSpacingPreset;
  paddingBlock: BuilderSectionSpacingPreset;
}

export type BuilderSectionLayoutOverride = Partial<BuilderSectionResolvedLayout>;

export type BuilderSectionLayoutOverrides = Partial<
  Record<BuilderResponsiveBreakpoint, BuilderSectionLayoutOverride>
>;

export interface BuilderSectionLayout extends BuilderSectionResolvedLayout {
  overrides?: BuilderSectionLayoutOverrides;
}

export type BuilderSectionVisibilityOverrides = Partial<Record<BuilderResponsiveBreakpoint, boolean>>;

export interface BuilderSectionVisibility {
  overrides?: BuilderSectionVisibilityOverrides;
}

export type BuilderSectionResolvedVisibility = Record<'desktop' | BuilderResponsiveBreakpoint, boolean>;

export interface BuilderSceneNodeBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type BuilderSceneNodeBoundsOverride = Partial<BuilderSceneNodeBounds>;

export type BuilderSceneNodeBoundsOverrides = Partial<
  Record<BuilderResponsiveBreakpoint, BuilderSceneNodeBoundsOverride>
>;

export interface BuilderSectionContentGroupConstraints {
  movement: 'section-flow';
  resize: 'none' | 'bounds-box';
}

export interface BuilderSectionContentGroupNode {
  version: 1;
  nodeId: string;
  groupKey: string;
  label: string;
  surfaceIds: string[];
  datasetTargetIds?: BuilderDatasetTargetId[];
  bounds?: BuilderSceneNodeBounds;
  overrides?: BuilderSceneNodeBoundsOverrides;
  measuredBounds?: BuilderSceneNodeBounds;
  measuredOverrides?: BuilderSceneNodeBoundsOverrides;
  constraints: BuilderSectionContentGroupConstraints;
  measuredAt?: string;
}

export interface BuilderSectionScene {
  version: 1;
  groups: BuilderSectionContentGroupNode[];
}

export type BuilderPersistedSceneNodeKind = 'content-group';
export type BuilderPersistedSceneNodeSource = 'section-scene-bridge' | 'page-scene';

export interface BuilderPersistedSceneNode {
  version: 1;
  nodeId: string;
  nodeKind: BuilderPersistedSceneNodeKind;
  source: BuilderPersistedSceneNodeSource;
  parentNodeId: string;
  sectionFrameNodeId: string;
  childNodeIds: string[];
  sectionKey: BuilderSectionKey;
  groupKey: string;
  label: string;
  surfaceIds: string[];
  datasetTargetIds?: BuilderDatasetTargetId[];
  bounds?: BuilderSceneNodeBounds;
  overrides?: BuilderSceneNodeBoundsOverrides;
  measuredBounds?: BuilderSceneNodeBounds;
  measuredOverrides?: BuilderSceneNodeBoundsOverrides;
  constraints: BuilderSectionContentGroupConstraints;
  measuredAt?: string;
}

export interface BuilderPageScene {
  version: 1;
  adapterMode: 'section-scene-bridge-v1';
  sourceDocumentVersion: number;
  rootNodeId: string;
  nodes: BuilderPersistedSceneNode[];
}

export interface BuilderSectionProps {
  layout: BuilderSectionLayout;
  visibility?: BuilderSectionVisibility;
  scene?: BuilderSectionScene;
}

export interface BuilderSectionNode extends BuilderNodeBase {
  type: 'section';
  sectionKey: BuilderSectionKey;
  hidden?: boolean;
  locked?: boolean;
  props?: BuilderSectionProps;
}

export interface BuilderPageNode extends BuilderNodeBase {
  type: 'page';
  pageKey: BuilderPageKey;
  children: BuilderSectionNode[];
}

export interface BuilderPageDatasetBinding {
  version: 1;
  datasetId: string;
  targetId: BuilderDatasetTargetId;
  sectionKey: BuilderSectionKey;
  collectionId: BuilderDatasetCollectionId;
  mode: BuilderDatasetMode;
  limit?: number;
}

export interface BuilderPageDocument {
  version: 1;
  pageKey: BuilderPageKey;
  locale: Locale;
  datasets: BuilderPageDatasetBinding[];
  scene?: BuilderPageScene;
  root: BuilderPageNode;
  updatedAt: string;
  updatedBy: string;
}

export interface BuilderSurfaceOverride {
  kind: BuilderEditableTargetKind;
  text?: string;
  href?: string;
  alt?: string;
  src?: string;
}

export interface BuilderSectionFrameClipboardItem {
  sectionKey: BuilderSectionKey;
  hidden: boolean;
  layout: BuilderSectionLayout;
  visibility?: BuilderSectionVisibility;
}

export interface BuilderSectionFrameClipboardPayload {
  version: 1;
  kind: 'section-frame';
  pageKey: BuilderPageKey;
  copiedAt: string;
  items: BuilderSectionFrameClipboardItem[];
}

export interface BuilderStaticDocumentState {
  version: 1;
  overrides: Record<string, BuilderSurfaceOverride>;
}

export interface BuilderHomeDocumentState {
  version: 1;
  faqItems: FAQItem[];
  serviceItems: BuilderServiceItem[];
  overrides: Record<string, BuilderSurfaceOverride>;
  activeCollectionIndex: Partial<Record<BuilderCollectionSectionKey, number>>;
}

export type BuilderPageState = BuilderHomeDocumentState | BuilderStaticDocumentState;

export interface BuilderPageSnapshot<TState = BuilderPageState> {
  version: 1;
  kind: BuilderSnapshotKind;
  pageKey: BuilderPageKey;
  locale: Locale;
  revision: number;
  savedAt: string;
  updatedBy: string;
  document: BuilderPageDocument;
  state: TState;
}

export interface BuilderSnapshotExpectation {
  revision?: number;
  savedAt?: string;
}

export type BuilderDraftSnapshot = BuilderPageSnapshot<BuilderHomeDocumentState> & {
  kind: 'draft';
};

export type BuilderPublishedSnapshot = BuilderPageSnapshot<BuilderHomeDocumentState> & {
  kind: 'published';
};

export interface BuilderSelectionState {
  sectionId: string;
  sectionKey: BuilderSectionKey;
  targetKind: BuilderSelectableTargetKind;
  targetLabel: string;
  supported: boolean;
  contentGroupId?: string;
  surfaceId?: string;
}
