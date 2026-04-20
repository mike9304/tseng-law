'use client';

import {
  type CSSProperties,
  type ChangeEvent,
  type DragEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type WheelEvent as ReactWheelEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Link from 'next/link';
import type { ColumnPost } from '@/lib/columns';
import type { FAQItem } from '@/data/faq-content';
import { siteContent } from '@/data/site-content';
import type { Locale } from '@/lib/locales';
import {
  clearBuilderDocumentSectionVisibilityOverride,
  cloneBuilderDocument,
  clearLocalBuilderDraftSnapshot,
  createDefaultHomeDocumentState,
  getStoredBuilderSectionLayout,
  getStoredBuilderSectionVisibility,
  moveBuilderDocumentSection,
  moveBuilderDocumentSectionToIndex,
  normalizeBuilderDocument,
  normalizeHomeDocumentState,
  readLocalBuilderDraftSnapshot,
  readLocalBuilderPublishedSnapshot,
  replaceBuilderDocumentSectionLayout,
  replaceBuilderDocumentSectionVisibility,
  resetBuilderDocumentSection,
  resetBuilderDocumentDataset,
  resetBuilderDocumentSectionLayout,
  resolveBuilderSectionHidden,
  resolveBuilderSectionLayout,
  setBuilderDocumentDatasetLimit,
  setBuilderDocumentSectionHidden,
  setBuilderDocumentSectionLocked,
  syncBuilderDocumentSectionContentGroupMeasuredBounds,
  updateBuilderDocumentSectionContentGroupBounds,
  updateBuilderDocumentSectionVisibility,
  updateBuilderDocumentSectionLayout,
  writeLocalBuilderDraftSnapshot,
  writeLocalBuilderPublishedSnapshot,
} from '@/lib/builder/content';
import {
  getBuilderBindableTarget,
  getBuilderPageDatasetBinding,
  resolveInsightsDatasetPosts,
} from '@/lib/builder/datasets';
import { buildBuilderCollectionHref } from '@/lib/builder/hrefs';
import {
  buildBuilderContentGroupNodeId,
  getBuilderSectionContentGroups,
  homeSectionRegistry,
  isDeclaredHomeButtonSurfaceId,
  isDeclaredHomeImageSurfaceId,
  isDeclaredHomeTextSurfaceId,
  type BuilderSectionDefinition,
} from '@/lib/builder/registry';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import type {
  BuilderCollectionSectionKey,
  BuilderDatasetTargetId,
  BuilderEditableTargetKind,
  BuilderSectionFrameClipboardPayload,
  BuilderHomeDocumentState,
  BuilderPersistedSceneNodeSource,
  BuilderSceneNodeBounds,
  BuilderPageDocument,
  BuilderPageSnapshot,
  BuilderSectionAlignmentPreset,
  BuilderSectionKey,
  BuilderSectionNode,
  BuilderSectionLayout,
  BuilderSectionLayoutOverride,
  BuilderSectionResolvedLayout,
  BuilderResponsiveBreakpoint,
  BuilderSectionSpacingPreset,
  BuilderSectionWidthPreset,
  BuilderSelectableTargetKind,
  BuilderSelectionState,
  BuilderServiceItem,
  BuilderSnapshotKind,
  BuilderSurfaceOverride,
  BuilderViewportMode,
} from '@/lib/builder/types';
import BuilderAdvancedDisclosure from '@/components/builder/BuilderAdvancedDisclosure';
import BuilderHomeSectionSurface from '@/components/builder/BuilderHomeSectionSurface';
import BuilderInspectorAssetLibraryPanel from '@/components/builder/BuilderInspectorAssetLibraryPanel';
import BuilderInspectorStatusCard from '@/components/builder/BuilderInspectorStatusCard';

type SectionStats = Record<BuilderEditableTargetKind, number>;

type SurfaceDescriptor = {
  sectionId: string;
  sectionKey: BuilderSectionKey;
  surfaceId: string;
  kind: BuilderEditableTargetKind;
  label: string;
  baseAlt?: string;
  baseSrc?: string;
};

type BuilderContentGroupDescriptor = {
  sectionId: string;
  sectionKey: BuilderSectionKey;
  contentGroupId: string;
  groupKey: string;
  label: string;
  surfaceIds: string[];
  datasetTargetIds: BuilderDatasetTargetId[];
};

type BuilderWorkspaceSnapshot = {
  document: BuilderPageDocument;
  state: BuilderHomeDocumentState;
  selection: BuilderSelectionState;
  label: string;
};

type BuilderHomePageSnapshot = BuilderPageSnapshot<BuilderHomeDocumentState>;

type BuilderCompareSnapshotMeta = {
  label: string;
  revision: number | null;
  savedAt: string | null;
  updatedBy: string | null;
};

type BuilderCompareSource = BuilderCompareSnapshotMeta & {
  document: BuilderPageDocument;
  state: BuilderHomeDocumentState;
};

type BuilderRevisionFieldChange = {
  sectionKey: BuilderSectionKey;
  sectionTitle: string;
  group: 'text' | 'button' | 'image' | 'faq' | 'service';
  label: string;
  leftValue: string;
  rightValue: string;
};

type BuilderRevisionStructuralChange = {
  sectionKey: BuilderSectionKey | null;
  sectionTitle: string;
  group: 'presence' | 'order' | 'visibility' | 'layout' | 'lock' | 'collection' | 'dataset';
  label: string;
  leftValue: string;
  rightValue: string;
};

type BuilderRevisionCompareSummary = {
  leftMeta: BuilderCompareSnapshotMeta;
  rightMeta: BuilderCompareSnapshotMeta;
  sectionOrderChanged: boolean;
  leftOrder: BuilderSectionKey[];
  rightOrder: BuilderSectionKey[];
  visibilityChanges: Array<{
    sectionKey: BuilderSectionKey;
    viewport: BuilderViewportMode;
    leftHidden: boolean;
    rightHidden: boolean;
  }>;
  lockChanges: Array<{
    sectionKey: BuilderSectionKey;
    leftLocked: boolean;
    rightLocked: boolean;
  }>;
  overrideCount: {
    left: number;
    right: number;
  };
  faqCount: {
    left: number;
    right: number;
  };
  serviceCount: {
    left: number;
    right: number;
  };
  structuralChanges: BuilderRevisionStructuralChange[];
  fieldChanges: BuilderRevisionFieldChange[];
};

type BuilderHistoryMeta = {
  cursor: number;
  length: number;
  canUndo: boolean;
  canRedo: boolean;
  label: string | null;
};

type BuilderPublishingReadinessStatus = 'blocked' | 'needs-review' | 'ready';

type BuilderPublishingReadiness = {
  status: BuilderPublishingReadinessStatus;
  title: string;
  summary: string;
  detail: string;
};

type BuilderServerStorage = 'blob' | 'file';

type BuilderServerSnapshotMeta = {
  persisted: boolean;
  revision: number;
  savedAt: string | null;
  updatedBy: string | null;
};

type BuilderServerConflict = {
  kind: BuilderSnapshotKind;
  locale: Locale;
  expectedRevision?: number;
  expectedSavedAt?: string;
  currentSnapshot: BuilderHomePageSnapshot;
};

type BuilderPublishValidationIssue = {
  code:
    | 'invalid_override_key'
    | 'unregistered_image_surface'
    | 'unregistered_text_surface'
    | 'unregistered_button_surface'
    | 'invalid_builder_asset_url'
    | 'builder_asset_locale_mismatch'
    | 'builder_asset_not_found';
  message: string;
  sectionId: string;
  sectionKey: string;
  sectionTitle: string;
  surfaceId: string;
  src: string;
  asset?: {
    locale: string;
    filename: string;
    url: string;
  };
};

type BuilderServerSnapshotResponse = {
  ok: boolean;
  storage?: BuilderServerStorage;
  persisted?: boolean;
  snapshot?: BuilderHomePageSnapshot;
  action?: 'publish' | 'validate' | 'rollback-draft';
  validated?: boolean;
  validatedAt?: string;
  error?: string;
  conflict?: BuilderServerConflict;
  issues?: BuilderPublishValidationIssue[];
  sourceRevisionId?: string;
  sourceRevision?: number;
  sourceSavedAt?: string;
  sourceUpdatedBy?: string;
};

type BuilderPublishChecksResponse = {
  ok: boolean;
  passed?: boolean;
  basis?: 'request' | 'server-draft';
  checkedAt?: string;
  issues?: BuilderPublishValidationIssue[];
  error?: string;
};

type BuilderAssetUploadResponse = {
  ok: boolean;
  asset?: {
    backend: 'blob' | 'file';
    locale: Locale;
    pathname: string;
    url: string;
    filename: string;
    contentType: string;
    size: number;
    uploadedAt: string;
  };
  error?: string;
};

type BuilderAssetLibraryItem = {
  locale: Locale;
  url: string;
  filename: string;
  contentType: string;
  size: number;
  uploadedAt: string;
};

type BuilderAssetListResponse = {
  ok: boolean;
  assets?: BuilderAssetLibraryItem[];
  error?: string;
};

type BuilderPageOverviewResponse = {
  ok: boolean;
  overview?: {
    draft: {
      persisted: boolean;
      revision: number;
      savedAt: string | null;
      updatedBy: string | null;
      snapshot: BuilderHomePageSnapshot;
    };
    published: {
      persisted: boolean;
      revision: number;
      savedAt: string | null;
      updatedBy: string | null;
      snapshot: BuilderHomePageSnapshot;
    };
    preferred: {
      source: 'draft' | 'published' | 'default';
    };
  };
  error?: string;
};

type BuilderSectionDragPlacement = 'before' | 'after';

type BuilderSectionDragState = {
  draggedSectionKey: BuilderSectionKey;
  targetSectionKey: BuilderSectionKey | null;
  placement: BuilderSectionDragPlacement | null;
};

type BuilderCanvasSectionRect = {
  sectionId: string;
  sectionKey: BuilderSectionKey;
  top: number;
  left: number;
  width: number;
  height: number;
  bottom: number;
};

type BuilderCanvasContentGroupRect = BuilderSceneNodeBounds & {
  sectionId: string;
  sectionKey: BuilderSectionKey;
  contentGroupId: string;
  groupKey: string;
  label: string;
};

type BuilderCanvasPointerDragState = {
  draggedSectionId: string;
  draggedSectionKey: BuilderSectionKey;
  originClientY: number;
  originTop: number;
  previewTop: number;
  previewLeft: number;
  previewWidth: number;
  previewHeight: number;
};

type BuilderCanvasContentGroupDragState = {
  sectionId: string;
  sectionKey: BuilderSectionKey;
  contentGroupId: string;
  label: string;
  originClientX: number;
  originClientY: number;
  originBounds: BuilderSceneNodeBounds;
  previewBounds: BuilderSceneNodeBounds;
};

type BuilderCanvasContentGroupResizeState = {
  sectionId: string;
  sectionKey: BuilderSectionKey;
  contentGroupId: string;
  label: string;
  originClientX: number;
  originClientY: number;
  originBounds: BuilderSceneNodeBounds;
  previewBounds: BuilderSceneNodeBounds;
};

type BuilderCanvasPanState = {
  pointerId: number;
  originClientX: number;
  originClientY: number;
  startScrollLeft: number;
  startScrollTop: number;
};

type BuilderResizeDirection = 'narrower' | 'wider';
type BuilderSpacingDirection = 'tighter' | 'looser';
type BuilderSpacingEdge = 'top' | 'bottom';
type BuilderInsetAxis = 'inline' | 'block';

type BuilderRevisionHistoryItem = {
  revisionId: string;
  kind: BuilderSnapshotKind;
  locale: Locale;
  action: 'publish';
  revision: number;
  savedAt: string;
  updatedBy: string;
  sourceDraftRevision?: number;
  sourceDraftSavedAt?: string;
  previousPublishedRevisionId?: string | null;
  sectionCount: number;
  hiddenSectionCount: number;
  overrideCount: number;
  faqCount: number;
  serviceCount: number;
  sceneNodeCount: number;
  sceneAuthorityNodeCount: number;
  sceneSeedNodeCount: number;
};

type BuilderRevisionHistoryResponse = {
  ok: boolean;
  storage?: BuilderServerStorage;
  records?: BuilderRevisionHistoryItem[];
  record?: BuilderRevisionHistoryItem | null;
  snapshot?: BuilderHomePageSnapshot | null;
  error?: string;
};

type BuilderPendingRevisionRestore = {
  record: BuilderRevisionHistoryItem;
  snapshot: BuilderHomePageSnapshot;
};

type EditableValues = {
  text: string;
  href: string;
  alt: string;
  src: string;
};

type BuilderImageWorkflowState = {
  previewAlt: string;
  previewSrc: string;
  currentAlt: string;
  currentSrc: string;
  baseAlt: string;
  baseSrc: string;
  currentSourceSummary: string;
  baseSourceSummary: string;
  sourceSummary: string;
  altSummary: string;
  hasOverride: boolean;
  currentGovernanceSummary: string;
  baseGovernanceSummary: string;
  publishGovernanceSummary: string;
};

type BuilderSceneStatusSummary = {
  sceneNodeCount: number;
  sceneAuthorityNodeCount: number;
  sceneSeedNodeCount: number;
};

const EMPTY_STATS: SectionStats = {
  text: 0,
  button: 0,
  image: 0,
};

const EMPTY_SERVER_SNAPSHOT_META: BuilderServerSnapshotMeta = {
  persisted: false,
  revision: 0,
  savedAt: null,
  updatedBy: null,
};

const VIEWPORT_STORAGE_PREFIX = 'builder-preview-viewport';
const ZOOM_STORAGE_PREFIX = 'builder-preview-zoom';

const VIEWPORT_OPTIONS: Array<{ value: BuilderViewportMode; label: string; hint: string }> = [
  { value: 'desktop', label: 'Desktop', hint: 'Full canvas' },
  { value: 'tablet', label: 'Tablet', hint: 'Balanced width' },
  { value: 'mobile', label: 'Mobile', hint: 'Narrow frame' },
];

const ZOOM_OPTIONS = [75, 90, 100, 115, 130] as const;
type BuilderZoomLevel = (typeof ZOOM_OPTIONS)[number];
const DEFAULT_ZOOM_LEVEL: BuilderZoomLevel = 100;
const MIN_PRECISE_ZOOM_LEVEL: BuilderZoomLevel = 90;

const SECTION_WIDTH_OPTIONS: Array<{ value: BuilderSectionWidthPreset; label: string }> = [
  { value: 'full', label: 'Full' },
  { value: 'wide', label: 'Wide' },
  { value: 'narrow', label: 'Narrow' },
];

const SECTION_ALIGNMENT_OPTIONS: Array<{ value: BuilderSectionAlignmentPreset; label: string }> = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
];

const SECTION_SPACING_OPTIONS: Array<{ value: BuilderSectionSpacingPreset; label: string }> = [
  { value: 'none', label: 'None' },
  { value: 'tight', label: 'Tight' },
  { value: 'normal', label: 'Normal' },
  { value: 'relaxed', label: 'Relaxed' },
];

const TEXT_SELECTOR = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
  'span',
  'li',
  'strong',
  'em',
  'small',
  'label',
  'blockquote',
  'input:not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="image"])',
  'textarea',
  'select',
].join(', ');

const BUTTON_SELECTOR = [
  'button',
  'a[href]',
  '[role="button"]',
  'input[type="button"]',
  'input[type="submit"]',
  'input[type="reset"]',
].join(', ');

const IMAGE_SELECTOR = 'img';
const ANNOTATED_SELECTOR = '[data-builder-surface-id]';
const CONTENT_GROUP_SELECTOR = '[data-builder-content-group-id]';
const UI_SELECTOR =
  '.builder-preview-surface-pill, .builder-preview-dead-zone-banner, .builder-preview-collection-overlay, .builder-preview-resize-scaffold, .builder-preview-spacing-scaffold, .builder-preview-inset-scaffold, .builder-preview-zoom-guard';

const KIND_LABEL: Record<BuilderSelectableTargetKind, string> = {
  section: 'Section',
  group: 'Content group',
  text: 'Text',
  button: 'Button/Link',
  image: 'Image',
  unknown: 'Unsupported surface',
};

function isTypingTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    (target instanceof HTMLElement && target.isContentEditable)
  );
}

export default function BuilderInteractiveHomePreview({
  locale,
  document: initialDocument,
  posts,
  faqItems,
  presentation = 'standalone',
}: {
  locale: Locale;
  document: BuilderPageDocument;
  posts: ColumnPost[];
  faqItems: FAQItem[];
  presentation?: 'standalone' | 'embedded';
}) {
  const canonicalServices = siteContent[locale].services;
  const defaultDocumentState = useMemo(
    () =>
      createDefaultHomeDocumentState({
        faqItems,
        serviceItems: canonicalServices.items,
      }),
    [canonicalServices.items, faqItems]
  );
  const initialSelection = useMemo(
    () => resolveSelectionForDocument(initialDocument),
    [initialDocument]
  );

  const [pageDocument, setPageDocument] = useState<BuilderPageDocument>(() =>
    cloneBuilderDocument(initialDocument)
  );
  const [selection, setSelection] = useState<BuilderSelectionState>(() => initialSelection);
  const [selectedSectionIds, setSelectedSectionIds] = useState<string[]>(() => [initialSelection.sectionId]);
  const [descriptorsBySection, setDescriptorsBySection] = useState<Record<string, SurfaceDescriptor[]>>({});
  const [contentGroupsBySection, setContentGroupsBySection] = useState<
    Record<string, BuilderContentGroupDescriptor[]>
  >({});
  const [statsBySection, setStatsBySection] = useState<Record<string, SectionStats>>({});
  const [overrides, setOverrides] = useState<Record<string, BuilderSurfaceOverride>>(
    defaultDocumentState.overrides
  );
  const [faqDraftItems, setFaqDraftItems] = useState<FAQItem[]>(defaultDocumentState.faqItems);
  const [serviceItems, setServiceItems] = useState<BuilderServiceItem[]>(
    defaultDocumentState.serviceItems
  );
  const [activeCollectionIndex, setActiveCollectionIndex] = useState<
    Partial<Record<BuilderCollectionSectionKey, number>>
  >(defaultDocumentState.activeCollectionIndex);
  const [draftHydrated, setDraftHydrated] = useState(false);
  const [lastDraftSavedAt, setLastDraftSavedAt] = useState<string | null>(null);
  const [lastPublishedAt, setLastPublishedAt] = useState<string | null>(null);
  const [viewportMode, setViewportMode] = useState<BuilderViewportMode>('desktop');
  const [zoomLevel, setZoomLevel] = useState<BuilderZoomLevel>(DEFAULT_ZOOM_LEVEL);
  const [historyMeta, setHistoryMeta] = useState<BuilderHistoryMeta>({
    cursor: -1,
    length: 0,
    canUndo: false,
    canRedo: false,
    label: null,
  });
  const [serverStorage, setServerStorage] = useState<BuilderServerStorage | null>(null);
  const [serverDraftMeta, setServerDraftMeta] = useState<BuilderServerSnapshotMeta>(
    EMPTY_SERVER_SNAPSHOT_META
  );
  const [serverPublishedMeta, setServerPublishedMeta] = useState<BuilderServerSnapshotMeta>(
    EMPTY_SERVER_SNAPSHOT_META
  );
  const [serverDraftSnapshot, setServerDraftSnapshot] = useState<BuilderHomePageSnapshot | null>(null);
  const [serverPublishedSnapshot, setServerPublishedSnapshot] = useState<BuilderHomePageSnapshot | null>(null);
  const [serverPending, setServerPending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverNotice, setServerNotice] = useState<string | null>(null);
  const [serverConflict, setServerConflict] = useState<BuilderServerConflict | null>(null);
  const [serverConflictAction, setServerConflictAction] = useState<'save' | 'publish' | 'validate' | null>(null);
  const [reviewedConflictKey, setReviewedConflictKey] = useState<string | null>(null);
  const [reviewedRollbackPromotionKey, setReviewedRollbackPromotionKey] = useState<string | null>(null);
  const [reviewedSharedRollbackKey, setReviewedSharedRollbackKey] = useState<string | null>(null);
  const [serverValidationIssues, setServerValidationIssues] = useState<BuilderPublishValidationIssue[] | null>(
    null
  );
  const [serverValidationCheckedAt, setServerValidationCheckedAt] = useState<string | null>(null);
  const [serverValidationPassed, setServerValidationPassed] = useState(false);
  const [serverValidationAction, setServerValidationAction] = useState<'publish' | 'validate' | null>(null);
  const [comparePending, setComparePending] = useState(false);
  const [compareError, setCompareError] = useState<string | null>(null);
  const [compareSummary, setCompareSummary] = useState<BuilderRevisionCompareSummary | null>(null);
  const [imageUploadPending, setImageUploadPending] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [imageUploadNotice, setImageUploadNotice] = useState<string | null>(null);
  const [assetLibraryItems, setAssetLibraryItems] = useState<BuilderAssetLibraryItem[]>([]);
  const [assetLibraryPending, setAssetLibraryPending] = useState(false);
  const [assetLibraryError, setAssetLibraryError] = useState<string | null>(null);
  const [assetLibraryHydrated, setAssetLibraryHydrated] = useState(false);
  const [clipboardPayload, setClipboardPayload] = useState<BuilderSectionFrameClipboardPayload | null>(null);
  const [clipboardNotice, setClipboardNotice] = useState<string | null>(null);
  const [editorGuardNotice, setEditorGuardNotice] = useState<string | null>(null);
  const [publishedHistoryItems, setPublishedHistoryItems] = useState<BuilderRevisionHistoryItem[]>([]);
  const [publishedHistoryPending, setPublishedHistoryPending] = useState(false);
  const [publishedHistoryError, setPublishedHistoryError] = useState<string | null>(null);
  const [publishedHistoryHydrated, setPublishedHistoryHydrated] = useState(false);
  const [pendingRevisionRestore, setPendingRevisionRestore] = useState<BuilderPendingRevisionRestore | null>(null);
  const [rollbackPromotionCandidate, setRollbackPromotionCandidate] = useState<BuilderRevisionHistoryItem | null>(null);
  const [sectionDragState, setSectionDragState] = useState<BuilderSectionDragState | null>(null);
  const [sectionCanvasRects, setSectionCanvasRects] = useState<Record<string, BuilderCanvasSectionRect>>({});
  const [contentGroupRects, setContentGroupRects] = useState<Record<string, BuilderCanvasContentGroupRect>>({});
  const [canvasPointerDragState, setCanvasPointerDragState] =
    useState<BuilderCanvasPointerDragState | null>(null);
  const [contentGroupDragState, setContentGroupDragState] =
    useState<BuilderCanvasContentGroupDragState | null>(null);
  const [contentGroupResizeState, setContentGroupResizeState] =
    useState<BuilderCanvasContentGroupResizeState | null>(null);
  const [canvasPanState, setCanvasPanState] = useState<BuilderCanvasPanState | null>(null);
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  const historyRef = useRef<BuilderWorkspaceSnapshot[]>([]);
  const historyCursorRef = useRef(-1);
  const surfaceRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const canvasViewportRef = useRef<HTMLDivElement | null>(null);
  const canvasZoomFrameRef = useRef<HTMLDivElement | null>(null);
  const descriptorsSignatureRef = useRef('');
  const contentGroupSignatureRef = useRef('');
  const skipNextPersistRef = useRef(false);
  const [canvasZoomMetrics, setCanvasZoomMetrics] = useState({ width: 0, height: 0 });

  const currentDocumentState = useMemo<BuilderHomeDocumentState>(
    () => ({
      version: 1,
      faqItems: cloneFaqItems(faqDraftItems),
      serviceItems: cloneServiceItems(serviceItems),
      overrides,
      activeCollectionIndex,
    }),
    [activeCollectionIndex, faqDraftItems, overrides, serviceItems]
  );
  const insightsDatasetTarget = getBuilderBindableTarget('home.insights.feed');
  const insightsDatasetBinding = useMemo(
    () => getBuilderPageDatasetBinding(pageDocument, 'home.insights.feed'),
    [pageDocument]
  );
  const insightsDatasetPosts = useMemo(
    () => resolveInsightsDatasetPosts(pageDocument, posts),
    [pageDocument, posts]
  );
  const pageApiBase = `/api/builder/sites/${DEFAULT_BUILDER_SITE_ID}/pages/home`;
  const publicPageHref = `/${locale}`;

  const activeConflictReviewKey = useMemo(
    () => (serverConflict ? getConflictReviewKey(serverConflict) : null),
    [serverConflict]
  );
  const canReplaceSharedDraftAfterReview =
    Boolean(serverConflict) &&
    serverConflict?.kind === 'draft' &&
    Boolean(activeConflictReviewKey) &&
    reviewedConflictKey === activeConflictReviewKey;
  const activeRollbackPromotionKey = useMemo(
    () =>
      rollbackPromotionCandidate
        ? getRollbackPromotionReviewKey(
            rollbackPromotionCandidate,
            serverDraftMeta.revision,
            serverDraftMeta.savedAt
          )
        : null,
    [rollbackPromotionCandidate, serverDraftMeta.revision, serverDraftMeta.savedAt]
  );
  const canPromoteRollbackRecovery =
    Boolean(rollbackPromotionCandidate) &&
    (!serverDraftMeta.persisted ||
      (Boolean(activeRollbackPromotionKey) &&
        reviewedRollbackPromotionKey === activeRollbackPromotionKey));
  const browserDraftMatchesSharedDraft = useMemo(
    () =>
      serverDraftSnapshot
        ? isSameDocumentStatePair(
            pageDocument,
            currentDocumentState,
            serverDraftSnapshot.document,
            serverDraftSnapshot.state
          )
        : false,
    [currentDocumentState, pageDocument, serverDraftSnapshot]
  );
  const browserSceneSummary = useMemo(() => summarizeBuilderSceneStatus(pageDocument), [pageDocument]);
  const serverDraftSceneSummary = useMemo(
    () => summarizeBuilderSceneStatus(serverDraftSnapshot?.document ?? null),
    [serverDraftSnapshot]
  );
  const serverPublishedSceneSummary = useMemo(
    () => summarizeBuilderSceneStatus(serverPublishedSnapshot?.document ?? null),
    [serverPublishedSnapshot]
  );

  const sectionIdByKey = useMemo(
    () =>
      Object.fromEntries(pageDocument.root.children.map((section) => [section.sectionKey, section.id])) as Partial<
        Record<BuilderSectionKey, string>
      >,
    [pageDocument.root.children]
  );
  const normalizedSelectedSectionIds = useMemo(
    () => normalizeSectionSelectionIds(pageDocument, selectedSectionIds, selection.sectionId),
    [pageDocument, selectedSectionIds, selection.sectionId]
  );
  const selectedSections = useMemo(
    () =>
      pageDocument.root.children.filter((section) => normalizedSelectedSectionIds.includes(section.id)),
    [normalizedSelectedSectionIds, pageDocument.root.children]
  );
  const selectedSectionKeys = useMemo(
    () => selectedSections.map((section) => section.sectionKey),
    [selectedSections]
  );
  const hasMultiSectionSelection =
    selection.targetKind === 'section' && selectedSections.length > 1;
  const sectionByKey = useMemo(
    () => new Map(pageDocument.root.children.map((section) => [section.sectionKey, section] as const)),
    [pageDocument.root.children]
  );
  const primarySelectedSection =
    selectedSections.find((section) => section.id === selection.sectionId) ?? selectedSections[0] ?? null;
  const selectionIncludesLockedSection = selectedSections.some((section) => Boolean(section.locked));
  const selectedLockedSectionCount = selectedSections.filter((section) => Boolean(section.locked)).length;
  const selectedCanvasRects = useMemo(
    () =>
      normalizedSelectedSectionIds
        .map((sectionId) => sectionCanvasRects[sectionId])
        .filter((rect): rect is BuilderCanvasSectionRect => Boolean(rect)),
    [normalizedSelectedSectionIds, sectionCanvasRects]
  );
  const selectedSectionActionKeys = useMemo(
    () => (hasMultiSectionSelection ? selectedSectionKeys : [selection.sectionKey]),
    [hasMultiSectionSelection, selectedSectionKeys, selection.sectionKey]
  );

  const selectedDefinition = homeSectionRegistry[selection.sectionKey];
  const selectedDescriptor = getSelectedDescriptor(descriptorsBySection, selection);
  const selectedContentGroup = getSelectedContentGroup(contentGroupsBySection, selection);
  const selectedElement = getSelectedElement(surfaceRefs.current, selection);
  const selectedValues = useMemo(
    () => getEditableValues(selectedElement, selectedDescriptor, selection, overrides),
    [overrides, selectedDescriptor, selectedElement, selection]
  );
  const selectedImageWorkflow = useMemo(
    () =>
      selectedDescriptor?.kind === 'image'
        ? buildImageWorkflowState(selectedElement, selectedDescriptor, selectedValues)
        : null,
    [selectedDescriptor, selectedElement, selectedValues]
  );
  const selectedSurfaceContract = useMemo(
    () =>
      resolveSurfaceContractState(
        pageDocument,
        selection.sectionKey,
        selection.targetKind,
        selection.surfaceId,
        selection.contentGroupId
      ),
    [pageDocument, selection.contentGroupId, selection.sectionKey, selection.surfaceId, selection.targetKind]
  );
  const selectedStats = statsBySection[selection.sectionId] ?? EMPTY_STATS;
  const selectedSectionIndex = pageDocument.root.children.findIndex(
    (section) => section.id === selection.sectionId
  );
  const selectedSection =
    selectedSectionIndex >= 0 ? pageDocument.root.children[selectedSectionIndex] : null;
  const selectedSectionLocked = Boolean(selectedSection?.locked);
  const selectedSectionStoredLayout = useMemo(
    () => getStoredBuilderSectionLayout(selectedSection),
    [selectedSection]
  );
  const selectedSectionLayout = useMemo(
    () => resolveBuilderSectionLayout(selectedSection, viewportMode),
    [selectedSection, viewportMode]
  );
  const selectedViewportLayoutState = useMemo(
    () => describeViewportLayoutState(selectedSectionStoredLayout, viewportMode),
    [selectedSectionStoredLayout, viewportMode]
  );
  const selectedSectionHiddenInViewport = useMemo(
    () => resolveBuilderSectionHidden(selectedSection, viewportMode),
    [selectedSection, viewportMode]
  );
  const selectedViewportVisibilityState = useMemo(
    () => describeViewportVisibilityState(selectedSection, viewportMode),
    [selectedSection, viewportMode]
  );
  const zoomScale = zoomLevel / 100;
  const zoomTooLowForPrecision = zoomLevel < MIN_PRECISE_ZOOM_LEVEL;
  const canZoomOut = zoomLevel > ZOOM_OPTIONS[0];
  const canZoomIn = zoomLevel < ZOOM_OPTIONS[ZOOM_OPTIONS.length - 1];
  const zoomOptionIndex = Math.max(ZOOM_OPTIONS.indexOf(zoomLevel), 0);
  const canShowDirectManipulationScaffolds = !zoomTooLowForPrecision;
  const canvasZoomStageStyle = useMemo<CSSProperties | undefined>(() => {
    if (canvasZoomMetrics.width <= 0 || canvasZoomMetrics.height <= 0) {
      return undefined;
    }

    return {
      width: `${Math.round(canvasZoomMetrics.width * zoomScale)}px`,
      height: `${Math.round(canvasZoomMetrics.height * zoomScale)}px`,
    };
  }, [canvasZoomMetrics.height, canvasZoomMetrics.width, zoomScale]);
  const canvasZoomShellStyle = useMemo<CSSProperties>(
    () => ({
      transform: `scale(${zoomScale})`,
      transformOrigin: 'top center',
    }),
    [zoomScale]
  );
  const zoomStatusCopy = zoomTooLowForPrecision
    ? `Fine canvas controls unlock again at ${MIN_PRECISE_ZOOM_LEVEL}%.`
    : 'Option/Alt + wheel zooms the stage. Hold Space and drag to pan without touching layout data.';
  const canvasDragGuideRect =
    sectionDragState?.targetSectionKey && sectionDragState.placement
      ? pageDocument.root.children
          .map((section) => sectionCanvasRects[section.id] ?? null)
          .find((rect) => rect?.sectionKey === sectionDragState.targetSectionKey) ?? null
      : null;
  const isSectionLocked = useCallback(
    (sectionKey: BuilderSectionKey) => Boolean(sectionByKey.get(sectionKey)?.locked),
    [sectionByKey]
  );
  const blockLockedSectionAction = useCallback(
    (sectionKeys: BuilderSectionKey[], actionLabel: string) => {
      const lockedSections = Array.from(
        new Set(sectionKeys.filter((sectionKey) => Boolean(sectionByKey.get(sectionKey)?.locked)))
      );

      if (!lockedSections.length) {
        return false;
      }

      const lockedTitles = lockedSections
        .map((sectionKey) => homeSectionRegistry[sectionKey].title)
        .join(', ');
      setEditorGuardNotice(
        `${lockedTitles} ${
          lockedSections.length > 1 ? 'are' : 'is'
        } locked. Unlock ${lockedSections.length > 1 ? 'those sections' : 'this section'} before ${actionLabel}.`
      );
      return true;
    },
    [sectionByKey]
  );
  const getSectionMoveLockBlockMessage = useCallback(
    (sectionKey: BuilderSectionKey, targetIndex: number) => {
      const sourceIndex = pageDocument.root.children.findIndex((section) => section.sectionKey === sectionKey);
      if (sourceIndex < 0) {
        return 'This section is no longer available in the current document.';
      }

      const sourceSection = pageDocument.root.children[sourceIndex];
      if (sourceSection?.locked) {
        return `${homeSectionRegistry[sectionKey].title} is locked. Unlock this section before reordering it.`;
      }

      const boundedTargetIndex = Math.max(
        0,
        Math.min(pageDocument.root.children.length - 1, targetIndex)
      );
      if (boundedTargetIndex === sourceIndex) {
        return null;
      }

      const [start, end] =
        sourceIndex < boundedTargetIndex
          ? [sourceIndex + 1, boundedTargetIndex]
          : [boundedTargetIndex, sourceIndex - 1];
      const blockingSection = pageDocument.root.children
        .slice(start, end + 1)
        .find((section) => Boolean(section.locked));

      if (!blockingSection) {
        return null;
      }

      return `${homeSectionRegistry[blockingSection.sectionKey].title} is locked. Unlock it before moving sections across this position.`;
    },
    [pageDocument.root.children]
  );
  const currentCollectionSection =
    !hasMultiSectionSelection && isCollectionSection(selection.sectionKey) ? selection.sectionKey : null;
  const servicesSection = useMemo(
    () => ({
      label: canonicalServices.label,
      title: canonicalServices.title,
      description: canonicalServices.description,
      items: serviceItems,
    }),
    [canonicalServices.description, canonicalServices.label, canonicalServices.title, serviceItems]
  );
  const publishingReadiness = useMemo(
    () =>
      resolvePublishingReadiness({
        locale,
        rollbackPromotionCandidate,
        serverConflict,
        serverError,
        serverValidationIssues,
        serverValidationPassed,
        serverValidationCheckedAt,
      }),
    [
      locale,
      rollbackPromotionCandidate,
      serverConflict,
      serverError,
      serverValidationCheckedAt,
      serverValidationIssues,
      serverValidationPassed,
    ]
  );
  const selectedTargetSummaryLabel =
    selection.surfaceId || selection.contentGroupId
      ? truncateCopy(selection.targetLabel, 28)
      : 'section frame';
  const selectedSceneEntryLabel =
    selection.targetKind === 'group' && selection.contentGroupId
      ? getPersistedContentGroupSource(pageDocument, selection.sectionKey, selection.contentGroupId) ===
        'page-scene'
        ? 'Scene authority'
        : 'Scene bridge'
      : null;

  const selectSingleTarget = useCallback((nextSelection: BuilderSelectionState) => {
    setSelection(nextSelection);
    setSelectedSectionIds([nextSelection.sectionId]);
  }, []);

  const focusSection = useCallback(
    (sectionKey: BuilderSectionKey, options?: { scroll?: boolean }) => {
      const targetSection = pageDocument.root.children.find((section) => section.sectionKey === sectionKey);
      if (!targetSection) return;

      selectSingleTarget(createSectionSelection(targetSection.sectionKey, targetSection.id));

      if (options?.scroll === false) {
        return;
      }

      surfaceRefs.current[targetSection.id]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    },
    [pageDocument.root.children, selectSingleTarget]
  );

  const focusValidationIssue = useCallback(
    (issue: BuilderPublishValidationIssue) => {
      const targetSection =
        pageDocument.root.children.find((section) => section.id === issue.sectionId) ??
        pageDocument.root.children.find((section) => section.sectionKey === issue.sectionKey);
      if (!targetSection) return;
      selectSingleTarget(createSectionSelection(targetSection.sectionKey, targetSection.id));
      surfaceRefs.current[targetSection.id]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    },
    [pageDocument.root.children, selectSingleTarget]
  );

  const adjustZoomLevel = useCallback((direction: 'out' | 'in') => {
    setZoomLevel((current) => {
      const currentIndex = ZOOM_OPTIONS.indexOf(current);
      if (currentIndex < 0) {
        return DEFAULT_ZOOM_LEVEL;
      }

      const nextIndex =
        direction === 'out'
          ? Math.max(currentIndex - 1, 0)
          : Math.min(currentIndex + 1, ZOOM_OPTIONS.length - 1);
      return ZOOM_OPTIONS[nextIndex] ?? current;
    });
  }, []);

  const setExactZoomLevel = useCallback((nextZoomLevel: BuilderZoomLevel) => {
    setZoomLevel(nextZoomLevel);
  }, []);

  const resetZoomLevel = useCallback(() => {
    setZoomLevel(DEFAULT_ZOOM_LEVEL);
  }, []);

  const fitCanvasZoomLevel = useCallback(() => {
    const viewportNode = canvasViewportRef.current;
    if (!viewportNode || canvasZoomMetrics.width <= 0 || canvasZoomMetrics.height <= 0) {
      return;
    }

    const availableWidth = Math.max(viewportNode.clientWidth - 56, 0);
    const availableHeight = Math.max(viewportNode.clientHeight - 56, 0);
    if (!availableWidth || !availableHeight) {
      return;
    }

    const targetZoom = Math.min(
      (availableWidth / canvasZoomMetrics.width) * 100,
      (availableHeight / canvasZoomMetrics.height) * 100
    );
    setZoomLevel(resolveBestFittingZoomLevel(targetZoom));
  }, [canvasZoomMetrics.height, canvasZoomMetrics.width]);

  const handleSectionSelectionIntent = useCallback(
    (
      sectionKey: BuilderSectionKey,
      sectionId: string,
      options?: {
        extend?: boolean;
      }
    ) => {
      if (!options?.extend) {
        selectSingleTarget(createSectionSelection(sectionKey, sectionId));
        return;
      }

      const toggled = normalizeSectionSelectionIds(
        pageDocument,
        toggleSectionSelectionId(selectedSectionIds, sectionId),
        sectionId
      );
      const primarySection =
        pageDocument.root.children.find((section) => section.id === sectionId) ??
        pageDocument.root.children.find((section) => section.id === toggled[0]);
      if (!primarySection) return;

      setSelectedSectionIds(toggled);
      setSelection(createSectionSelection(primarySection.sectionKey, primarySection.id));
    },
    [pageDocument, selectedSectionIds, selectSingleTarget]
  );

  const selectAllSections = useCallback(() => {
    if (!pageDocument.root.children.length) return;
    const nextSelection =
      pageDocument.root.children.find((section) => section.id === selection.sectionId) ??
      pageDocument.root.children[0];
    if (!nextSelection) return;
    setSelectedSectionIds(pageDocument.root.children.map((section) => section.id));
    setSelection(createSectionSelection(nextSelection.sectionKey, nextSelection.id));
  }, [pageDocument.root.children, selection.sectionId]);

  const startCanvasSectionPointerDrag = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>, section: BuilderSectionNode) => {
      event.preventDefault();
      event.stopPropagation();

      if (section.locked) {
        setEditorGuardNotice(
          `${homeSectionRegistry[section.sectionKey].title} is locked. Unlock this section before dragging it.`
        );
        return;
      }

      const rect = sectionCanvasRects[section.id];
      if (!rect) {
        setEditorGuardNotice('Canvas geometry is still resolving. Try dragging again in a moment.');
        return;
      }

      selectSingleTarget(createSectionSelection(section.sectionKey, section.id));
      setCanvasPointerDragState({
        draggedSectionId: section.id,
        draggedSectionKey: section.sectionKey,
        originClientY: event.clientY,
        originTop: rect.top,
        previewTop: rect.top,
        previewLeft: rect.left,
        previewWidth: rect.width,
        previewHeight: rect.height,
      });
      setSectionDragState({
        draggedSectionKey: section.sectionKey,
        targetSectionKey: null,
        placement: null,
      });
    },
    [sectionCanvasRects, selectSingleTarget]
  );

  const loadAssetLibrary = useCallback(
    async (options?: { force?: boolean }) => {
      if (!options?.force && assetLibraryHydrated) {
        return;
      }

      setAssetLibraryPending(true);
      setAssetLibraryError(null);

      try {
        const response = await fetch(
          `/api/builder/assets?locale=${encodeURIComponent(locale)}&limit=8`,
          {
            method: 'GET',
            cache: 'no-store',
          }
        );
        const payload = (await response.json().catch(() => null)) as BuilderAssetListResponse | null;
        if (!response.ok || !payload?.ok) {
          throw new Error(payload?.error || 'Failed to load recent builder assets.');
        }

        setAssetLibraryItems(payload.assets ?? []);
        setAssetLibraryHydrated(true);
      } catch (error) {
        setAssetLibraryError(
          error instanceof Error ? error.message : 'Failed to load recent builder assets.'
        );
      } finally {
        setAssetLibraryPending(false);
      }
    },
    [assetLibraryHydrated, locale]
  );

  const loadPublishedHistory = useCallback(
    async (options?: { force?: boolean }) => {
      if (!options?.force && publishedHistoryHydrated) {
        return;
      }

      setPublishedHistoryPending(true);
      setPublishedHistoryError(null);

      try {
        const response = await fetch(
          `${pageApiBase}/revisions?locale=${encodeURIComponent(locale)}&kind=published&limit=8`,
          {
            method: 'GET',
            cache: 'no-store',
          }
        );
        const payload = (await response.json().catch(() => null)) as BuilderRevisionHistoryResponse | null;
        if (!response.ok || !payload?.ok) {
          throw new Error(payload?.error || 'Failed to load published revision history.');
        }

        if (payload.storage) {
          setServerStorage(payload.storage);
        }
        setPublishedHistoryItems(payload.records ?? []);
        setPublishedHistoryHydrated(true);
      } catch (error) {
        setPublishedHistoryError(
          error instanceof Error ? error.message : 'Failed to load published revision history.'
        );
      } finally {
        setPublishedHistoryPending(false);
      }
    },
    [locale, pageApiBase, publishedHistoryHydrated]
  );

  const applyDocumentState = useCallback((nextState: BuilderHomeDocumentState) => {
    setOverrides(nextState.overrides);
    setFaqDraftItems(nextState.faqItems);
    setServiceItems(nextState.serviceItems);
    setActiveCollectionIndex(nextState.activeCollectionIndex);
  }, []);

  const buildWorkspaceSnapshot = useCallback(
    (
      nextDocument: BuilderPageDocument,
      nextState: BuilderHomeDocumentState,
      nextSelection: BuilderSelectionState,
      label: string
    ): BuilderWorkspaceSnapshot => ({
      document: cloneBuilderDocument(nextDocument),
      state: normalizeHomeDocumentState(nextState, nextState),
      selection: { ...nextSelection },
      label,
    }),
    []
  );

  const syncHistoryMeta = useCallback((label?: string | null) => {
    const cursor = historyCursorRef.current;
    const length = historyRef.current.length;
    const currentLabel = label ?? historyRef.current[cursor]?.label ?? null;
    setHistoryMeta({
      cursor,
      length,
      canUndo: cursor > 0,
      canRedo: cursor >= 0 && cursor < length - 1,
      label: currentLabel,
    });
  }, []);

  const seedWorkspaceHistory = useCallback(
    (snapshot: BuilderWorkspaceSnapshot) => {
      historyRef.current = [snapshot];
      historyCursorRef.current = 0;
      syncHistoryMeta(snapshot.label);
    },
    [syncHistoryMeta]
  );

  const applyWorkspaceSnapshot = useCallback(
    (snapshot: BuilderWorkspaceSnapshot) => {
      setPageDocument(snapshot.document);
      applyDocumentState(snapshot.state);
      setSelection(snapshot.selection);
      setSelectedSectionIds([snapshot.selection.sectionId]);
      syncHistoryMeta(snapshot.label);
    },
    [applyDocumentState, syncHistoryMeta]
  );

  const recordWorkspaceSnapshot = useCallback(
    (snapshot: BuilderWorkspaceSnapshot) => {
      const current = historyRef.current[historyCursorRef.current];
      if (current && isSameWorkspaceSnapshot(current, snapshot)) {
        setSelection(snapshot.selection);
        return;
      }

      const nextHistory = historyRef.current.slice(0, historyCursorRef.current + 1);
      nextHistory.push(snapshot);
      historyRef.current = nextHistory;
      historyCursorRef.current = nextHistory.length - 1;
      setPageDocument(snapshot.document);
      applyDocumentState(snapshot.state);
      setSelection(snapshot.selection);
      setSelectedSectionIds([snapshot.selection.sectionId]);
      syncHistoryMeta(snapshot.label);
    },
    [applyDocumentState, syncHistoryMeta]
  );

  const commitContentGroupBounds = useCallback(
    (
      sectionKey: BuilderSectionKey,
      contentGroupId: string,
      nextBounds: BuilderSceneNodeBounds,
      label: string
    ) => {
      if (blockLockedSectionAction([sectionKey], 'moving this content group')) {
        return false;
      }

      const nextDocument = updateBuilderDocumentSectionContentGroupBounds(
        pageDocument,
        sectionKey,
        contentGroupId,
        nextBounds,
        viewportMode
      );

      recordWorkspaceSnapshot(
        buildWorkspaceSnapshot(
          nextDocument,
          currentDocumentState,
          createContentGroupSelection(
            sectionKey,
            sectionIdByKey[sectionKey] ?? selection.sectionId,
            contentGroupId,
            selection.targetKind === 'group' && selection.contentGroupId === contentGroupId
              ? selection.targetLabel
              : selectedContentGroup?.label ?? 'Content group'
          ),
          label
        )
      );
      return true;
    },
    [
      blockLockedSectionAction,
      buildWorkspaceSnapshot,
      currentDocumentState,
      pageDocument,
      recordWorkspaceSnapshot,
      sectionIdByKey,
      selectedContentGroup?.label,
      selection.contentGroupId,
      selection.sectionId,
      selection.targetKind,
      selection.targetLabel,
      viewportMode,
    ]
  );

  const nudgeSelectedContentGroup = useCallback(
    (deltaX: number, deltaY: number) => {
      if (selection.targetKind !== 'group' || !selection.contentGroupId) {
        return;
      }

      const section = pageDocument.root.children.find(
        (candidate) => candidate.sectionKey === selection.sectionKey
      );
      if (!section) {
        return;
      }

      const currentBounds = getDisplayContentGroupBounds(
        pageDocument,
        section,
        selection.contentGroupId,
        viewportMode
      );
      if (!currentBounds) {
        setEditorGuardNotice('Content-group geometry is still resolving. Try again in a moment.');
        return;
      }

      const sectionRect = sectionCanvasRects[selection.sectionId];
      const sectionWidth = sectionRect ? sectionRect.width / Math.max(zoomScale, 0.0001) : null;
      const sectionHeight = sectionRect ? sectionRect.height / Math.max(zoomScale, 0.0001) : null;
      const nextBounds = clampContentGroupBoundsToSection(
        {
          ...currentBounds,
          x: roundSceneBoundsValue(currentBounds.x + deltaX),
          y: roundSceneBoundsValue(currentBounds.y + deltaY),
        },
        sectionWidth,
        sectionHeight
      );

      commitContentGroupBounds(
        selection.sectionKey,
        selection.contentGroupId,
        nextBounds,
        deltaX === 0 ? 'Nudge content group vertically' : 'Nudge content group'
      );
    },
    [
      commitContentGroupBounds,
      pageDocument,
      sectionCanvasRects,
      selection.contentGroupId,
      selection.sectionId,
      selection.sectionKey,
      selection.targetKind,
      viewportMode,
      zoomScale,
    ]
  );

  const resizeSelectedContentGroup = useCallback(
    (deltaWidth: number, deltaHeight: number) => {
      if (selection.targetKind !== 'group' || !selection.contentGroupId) {
        return;
      }

      const section = pageDocument.root.children.find(
        (candidate) => candidate.sectionKey === selection.sectionKey
      );
      if (!section) {
        return;
      }

      const currentBounds = getDisplayContentGroupBounds(
        pageDocument,
        section,
        selection.contentGroupId,
        viewportMode
      );
      if (!currentBounds) {
        setEditorGuardNotice('Content-group geometry is still resolving. Try resizing again in a moment.');
        return;
      }

      const sectionRect = sectionCanvasRects[selection.sectionId];
      const sectionWidth = sectionRect ? sectionRect.width / Math.max(zoomScale, 0.0001) : null;
      const sectionHeight = sectionRect ? sectionRect.height / Math.max(zoomScale, 0.0001) : null;
      const nextBounds = clampContentGroupResizeBoundsToSection(
        {
          ...currentBounds,
          width: roundSceneBoundsValue(currentBounds.width + deltaWidth),
          height: roundSceneBoundsValue(currentBounds.height + deltaHeight),
        },
        sectionWidth,
        sectionHeight
      );

      commitContentGroupBounds(
        selection.sectionKey,
        selection.contentGroupId,
        nextBounds,
        deltaWidth === 0 ? 'Resize content group vertically' : 'Resize content group'
      );
    },
    [
      commitContentGroupBounds,
      pageDocument,
      sectionCanvasRects,
      selection.contentGroupId,
      selection.sectionId,
      selection.sectionKey,
      selection.targetKind,
      viewportMode,
      zoomScale,
    ]
  );

  const startCanvasContentGroupPointerDrag = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>, rect: BuilderCanvasContentGroupRect) => {
      event.preventDefault();
      event.stopPropagation();

      if (blockLockedSectionAction([rect.sectionKey], 'moving this content group')) {
        return;
      }

      const section = pageDocument.root.children.find(
        (candidate) => candidate.sectionKey === rect.sectionKey
      );
      if (!section) {
        return;
      }

      const storedBounds =
        getDisplayContentGroupBounds(pageDocument, section, rect.contentGroupId, viewportMode) ?? {
          x: roundSceneBoundsValue(rect.x / Math.max(zoomScale, 0.0001)),
          y: roundSceneBoundsValue(rect.y / Math.max(zoomScale, 0.0001)),
          width: roundSceneBoundsValue(rect.width / Math.max(zoomScale, 0.0001)),
          height: roundSceneBoundsValue(rect.height / Math.max(zoomScale, 0.0001)),
        };

      selectSingleTarget(
        createContentGroupSelection(rect.sectionKey, rect.sectionId, rect.contentGroupId, rect.label)
      );
      setContentGroupResizeState(null);
      setContentGroupDragState({
        sectionId: rect.sectionId,
        sectionKey: rect.sectionKey,
        contentGroupId: rect.contentGroupId,
        label: rect.label,
        originClientX: event.clientX,
        originClientY: event.clientY,
        originBounds: storedBounds,
        previewBounds: storedBounds,
      });
    },
    [blockLockedSectionAction, pageDocument, selectSingleTarget, viewportMode, zoomScale]
  );

  const startCanvasContentGroupPointerResize = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>, rect: BuilderCanvasContentGroupRect) => {
      event.preventDefault();
      event.stopPropagation();

      if (blockLockedSectionAction([rect.sectionKey], 'resizing this content group')) {
        return;
      }

      const section = pageDocument.root.children.find(
        (candidate) => candidate.sectionKey === rect.sectionKey
      );
      if (!section) {
        return;
      }

      const storedBounds =
        getDisplayContentGroupBounds(pageDocument, section, rect.contentGroupId, viewportMode) ?? {
          x: roundSceneBoundsValue(rect.x / Math.max(zoomScale, 0.0001)),
          y: roundSceneBoundsValue(rect.y / Math.max(zoomScale, 0.0001)),
          width: roundSceneBoundsValue(rect.width / Math.max(zoomScale, 0.0001)),
          height: roundSceneBoundsValue(rect.height / Math.max(zoomScale, 0.0001)),
        };

      selectSingleTarget(
        createContentGroupSelection(rect.sectionKey, rect.sectionId, rect.contentGroupId, rect.label)
      );
      setContentGroupDragState(null);
      setContentGroupResizeState({
        sectionId: rect.sectionId,
        sectionKey: rect.sectionKey,
        contentGroupId: rect.contentGroupId,
        label: rect.label,
        originClientX: event.clientX,
        originClientY: event.clientY,
        originBounds: storedBounds,
        previewBounds: storedBounds,
      });
    },
    [blockLockedSectionAction, pageDocument, selectSingleTarget, viewportMode, zoomScale]
  );

  const syncServerSnapshotMeta = useCallback(
    (kind: BuilderSnapshotKind, response: BuilderServerSnapshotResponse | null) => {
      if (!response) return;
      if (response.storage) {
        setServerStorage(response.storage);
      }

      const nextMeta = buildServerSnapshotMeta(response.snapshot, Boolean(response.persisted));
      if (kind === 'draft') {
        setServerDraftMeta(nextMeta);
        setServerDraftSnapshot(response.persisted ? response.snapshot ?? null : null);
        return;
      }

      setServerPublishedMeta(nextMeta);
      setServerPublishedSnapshot(response.persisted ? response.snapshot ?? null : null);
    },
    []
  );

  const syncServerConflictMeta = useCallback((conflict: BuilderServerConflict | null) => {
    if (!conflict) return;
    const nextMeta = buildServerSnapshotMeta(conflict.currentSnapshot, true);
    if (conflict.kind === 'draft') {
      setServerDraftMeta(nextMeta);
      return;
    }

    setServerPublishedMeta(nextMeta);
  }, []);

  const handleServerFailure = useCallback(
    (
      response: Response,
      payload: BuilderServerSnapshotResponse | null,
      fallbackMessage: string,
      action: 'save' | 'publish' | 'validate'
    ) => {
      if (response.status === 409 && payload?.conflict) {
        setServerValidationIssues(null);
        setServerValidationPassed(false);
        setServerValidationAction(null);
        setServerConflict(payload.conflict);
        setServerConflictAction(action);
        setServerNotice(null);
        setReviewedConflictKey(null);
        syncServerConflictMeta(payload.conflict);
        setServerError(null);
        return;
      }

      if (response.status === 422 && payload?.issues?.length) {
        setServerConflict(null);
        setServerConflictAction(null);
        setServerValidationIssues(payload.issues);
        setServerValidationCheckedAt(new Date().toISOString());
        setServerValidationPassed(false);
        setServerValidationAction(action === 'publish' ? 'publish' : 'validate');
        setServerError(payload.error || fallbackMessage);
        return;
      }

      setServerConflict(null);
      setServerConflictAction(null);
      setServerValidationIssues(null);
      setServerValidationPassed(false);
      setServerValidationAction(null);
      setServerNotice(null);
      setServerError(payload?.error || fallbackMessage);
    },
    [syncServerConflictMeta]
  );

  const fetchPageOverview = useCallback(async () => {
    const response = await fetch(`${pageApiBase}?locale=${encodeURIComponent(locale)}`, {
      method: 'GET',
      cache: 'no-store',
    });
    const payload = (await response.json().catch(() => null)) as BuilderPageOverviewResponse | null;
    if (!response.ok || !payload?.ok || !payload.overview) {
      throw new Error(payload?.error || 'Failed to load builder page overview from server.');
    }
    return payload.overview;
  }, [locale, pageApiBase]);

  const fetchServerSnapshot = useCallback(
    async (kind: BuilderSnapshotKind) => {
      const overview = await fetchPageOverview();
      const summary = kind === 'draft' ? overview.draft : overview.published;
      return {
        ok: true,
        persisted: summary.persisted,
        snapshot: summary.snapshot,
      } satisfies BuilderServerSnapshotResponse;
    },
    [fetchPageOverview]
  );

  const fetchHomeRevision = useCallback(
    async (revisionId: string) => {
      const response = await fetch(
        `${pageApiBase}/revisions?locale=${encodeURIComponent(locale)}&kind=published&revisionId=${encodeURIComponent(revisionId)}`,
        {
          method: 'GET',
          cache: 'no-store',
        }
      );
      const payload = (await response.json().catch(() => null)) as BuilderRevisionHistoryResponse | null;
      if (!response.ok || !payload?.ok || !payload.snapshot) {
        throw new Error(payload?.error || 'Failed to load the selected published revision.');
      }
      return payload as BuilderRevisionHistoryResponse & { snapshot: BuilderHomePageSnapshot };
    },
    [locale, pageApiBase]
  );

  const runRevisionCompare = useCallback(async () => {
    setComparePending(true);
    setCompareError(null);

    try {
      if (serverDraftSnapshot && serverPublishedSnapshot) {
        setCompareSummary(
          buildRevisionCompareSummary(
            createCompareSource({
              label: 'Shared draft',
              revision: serverDraftSnapshot.revision,
              savedAt: serverDraftSnapshot.savedAt,
              updatedBy: serverDraftSnapshot.updatedBy,
              document: serverDraftSnapshot.document,
              state: serverDraftSnapshot.state,
            }),
            createCompareSource({
              label: 'Shared published',
              revision: serverPublishedSnapshot.revision,
              savedAt: serverPublishedSnapshot.savedAt,
              updatedBy: serverPublishedSnapshot.updatedBy,
              document: serverPublishedSnapshot.document,
              state: serverPublishedSnapshot.state,
            })
          )
        );
        return;
      }

      const [draftResponse, publishedResponse] = await Promise.all([
        fetchServerSnapshot('draft'),
        fetchServerSnapshot('published'),
      ]);

      if (!draftResponse.persisted || !draftResponse.snapshot) {
        throw new Error('Server draft must exist before revision compare can run.');
      }

      if (!publishedResponse.persisted || !publishedResponse.snapshot) {
        throw new Error('Server published snapshot must exist before revision compare can run.');
      }

      syncServerSnapshotMeta('draft', draftResponse);
      syncServerSnapshotMeta('published', publishedResponse);
      setCompareSummary(
        buildRevisionCompareSummary(
          createCompareSource({
            label: 'Shared draft',
            revision: draftResponse.snapshot.revision,
            savedAt: draftResponse.snapshot.savedAt,
            updatedBy: draftResponse.snapshot.updatedBy,
            document: draftResponse.snapshot.document,
            state: draftResponse.snapshot.state,
          }),
          createCompareSource({
            label: 'Shared published',
            revision: publishedResponse.snapshot.revision,
            savedAt: publishedResponse.snapshot.savedAt,
            updatedBy: publishedResponse.snapshot.updatedBy,
            document: publishedResponse.snapshot.document,
            state: publishedResponse.snapshot.state,
          })
        )
      );
    } catch (error) {
      setCompareSummary(null);
      setCompareError(
        error instanceof Error ? error.message : 'Failed to compare draft and published revisions.'
      );
    } finally {
      setComparePending(false);
    }
  }, [fetchServerSnapshot, serverDraftSnapshot, serverPublishedSnapshot, syncServerSnapshotMeta]);

  const compareBrowserDraftAgainstSnapshot = useCallback(
    async (options?: {
      snapshot?: BuilderHomePageSnapshot;
      label?: string;
      fallbackKind?: BuilderSnapshotKind;
      reviewConflictKey?: string | null;
      reviewRollbackPromotionKey?: string | null;
      throwOnError?: boolean;
    }) => {
      setComparePending(true);
      setCompareError(null);

      try {
        let targetSnapshot = options?.snapshot ?? null;
        const targetLabel =
          options?.label ??
          (options?.fallbackKind === 'published' ? 'Shared published' : 'Shared draft');

        if (!targetSnapshot) {
          const kind = options?.fallbackKind ?? 'draft';
          const response = await fetchServerSnapshot(kind);
          if (!response.persisted || !response.snapshot) {
            throw new Error(
              kind === 'published'
                ? 'Shared published snapshot must exist before compare can run.'
                : 'Shared draft snapshot must exist before compare can run.'
            );
          }
          targetSnapshot = response.snapshot;
          syncServerSnapshotMeta(kind, response);
        }

        setCompareSummary(
          buildRevisionCompareSummary(
            createCompareSource({
              label: 'Browser draft',
              revision: null,
              savedAt: lastDraftSavedAt,
              updatedBy: 'browser recovery',
              document: pageDocument,
              state: currentDocumentState,
            }),
            createCompareSource({
              label: targetLabel,
              revision: targetSnapshot.revision,
              savedAt: targetSnapshot.savedAt,
              updatedBy: targetSnapshot.updatedBy,
              document: targetSnapshot.document,
              state: targetSnapshot.state,
            })
          )
        );
        if (options?.reviewConflictKey) {
          setReviewedConflictKey(options.reviewConflictKey);
        }
        if (options?.reviewRollbackPromotionKey) {
          setReviewedRollbackPromotionKey(options.reviewRollbackPromotionKey);
        }
      } catch (error) {
        setCompareSummary(null);
        const resolvedError =
          error instanceof Error ? error : new Error('Failed to compare browser draft.');
        setCompareError(resolvedError.message);
        if (options?.throwOnError) {
          throw resolvedError;
        }
      } finally {
        setComparePending(false);
      }
    },
    [currentDocumentState, fetchServerSnapshot, lastDraftSavedAt, pageDocument, syncServerSnapshotMeta]
  );

  const reviewPublishedRevisionAgainstSharedDraft = useCallback(
    async (record: BuilderRevisionHistoryItem) => {
      if (!serverDraftMeta.persisted) {
        setPublishedHistoryError('Shared draft must exist before shared rollback review can run.');
        return;
      }

      if (!browserDraftMatchesSharedDraft) {
        setPublishedHistoryError(
          'Load the latest shared draft into this browser before reviewing a shared rollback.'
        );
        return;
      }

      setComparePending(true);
      setCompareError(null);
      setPublishedHistoryPending(true);
      setPublishedHistoryError(null);

      try {
        const payload = await fetchHomeRevision(record.revisionId);

        const sharedDraftResponse = serverDraftSnapshot
          ? null
          : await fetchServerSnapshot('draft');
        const sharedDraftSnapshot =
          serverDraftSnapshot ?? sharedDraftResponse?.snapshot ?? null;

        if (!sharedDraftSnapshot) {
          throw new Error('Shared draft must exist before shared rollback review can run.');
        }

        if (sharedDraftResponse) {
          syncServerSnapshotMeta('draft', sharedDraftResponse);
        }

        setCompareSummary(
          buildRevisionCompareSummary(
            createCompareSource({
              label: `Published v${record.revision}`,
              revision: payload.snapshot.revision,
              savedAt: payload.snapshot.savedAt,
              updatedBy: payload.snapshot.updatedBy,
              document: payload.snapshot.document,
              state: payload.snapshot.state,
            }),
            createCompareSource({
              label: 'Shared draft',
              revision: sharedDraftSnapshot.revision,
              savedAt: sharedDraftSnapshot.savedAt,
              updatedBy: sharedDraftSnapshot.updatedBy,
              document: sharedDraftSnapshot.document,
              state: sharedDraftSnapshot.state,
            })
          )
        );
        setReviewedSharedRollbackKey(
          getSharedRollbackReviewKey(record, sharedDraftSnapshot.revision, sharedDraftSnapshot.savedAt)
        );
      } catch (error) {
        setCompareSummary(null);
        setCompareError(
          error instanceof Error ? error.message : 'Failed to review the selected shared rollback.'
        );
      } finally {
        setComparePending(false);
        setPublishedHistoryPending(false);
      }
    },
    [
      browserDraftMatchesSharedDraft,
      fetchHomeRevision,
      fetchServerSnapshot,
      serverDraftMeta.persisted,
      serverDraftSnapshot,
      syncServerSnapshotMeta,
    ]
  );

  const clearCompareState = useCallback(() => {
    setCompareSummary(null);
    setCompareError(null);
  }, []);

  const rollbackSharedDraftToPublishedRevision = useCallback(
    async (record: BuilderRevisionHistoryItem) => {
      if (!serverDraftMeta.persisted || !serverDraftMeta.savedAt) {
        setPublishedHistoryError('Shared draft must exist before shared rollback can run.');
        return;
      }

      if (!browserDraftMatchesSharedDraft) {
        setPublishedHistoryError(
          'Load the latest shared draft into this browser before changing the team draft from the revision archive.'
        );
        return;
      }

      const reviewKey = getSharedRollbackReviewKey(record, serverDraftMeta.revision, serverDraftMeta.savedAt);
      if (reviewedSharedRollbackKey !== reviewKey) {
        setPublishedHistoryError(
          'Review the selected published revision against the latest shared draft first, then use the explicit rollback action.'
        );
        return;
      }

      setServerPending(true);
      setServerError(null);
      setServerNotice(null);
      setPublishedHistoryError(null);

      try {
        const response = await fetch(
          `${pageApiBase}/revisions/rollback?locale=${encodeURIComponent(locale)}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              revisionId: record.revisionId,
              updatedBy: 'builder-preview-web',
              expectedDraftRevision: serverDraftMeta.revision,
              expectedDraftSavedAt: serverDraftMeta.savedAt,
            }),
          }
        );
        const payload = (await response.json().catch(() => null)) as BuilderServerSnapshotResponse | null;

        if (!response.ok || !payload?.ok || !payload.snapshot) {
          handleServerFailure(
            response,
            payload,
            'Failed to rollback the shared draft from the selected published revision.',
            'save'
          );
          return;
        }

        syncServerSnapshotMeta('draft', payload);
        clearCompareState();
        setReviewedSharedRollbackKey(null);
        setServerNotice(
          `Shared draft now matches published revision v${payload.sourceRevision ?? record.revision}. Browser draft stayed unchanged.`
        );
      } catch (error) {
        setServerError(
          error instanceof Error
            ? error.message
            : 'Failed to rollback the shared draft from the selected published revision.'
        );
      } finally {
        setServerPending(false);
      }
    },
    [
      browserDraftMatchesSharedDraft,
      clearCompareState,
      handleServerFailure,
      locale,
      pageApiBase,
      reviewedSharedRollbackKey,
      serverDraftMeta.persisted,
      serverDraftMeta.revision,
      serverDraftMeta.savedAt,
      syncServerSnapshotMeta,
    ]
  );

  const refreshServerState = useCallback(async () => {
    const conflictToRefresh = serverConflict;
    setServerPending(true);
    setServerError(null);
    setServerNotice(null);
    setServerConflict(null);
    setServerConflictAction(null);
    setReviewedConflictKey(null);
    setReviewedSharedRollbackKey(null);
    setServerValidationPassed(false);
    setServerValidationAction(null);
    clearCompareState();

    try {
      const [draftResponse, publishedResponse] = await Promise.all([
        fetchServerSnapshot('draft'),
        fetchServerSnapshot('published'),
      ]);
      syncServerSnapshotMeta('draft', draftResponse);
      syncServerSnapshotMeta('published', publishedResponse);
      if (conflictToRefresh?.kind === 'draft' && draftResponse.persisted && draftResponse.snapshot) {
        setServerConflict({
          kind: 'draft',
          locale,
          expectedRevision: draftResponse.snapshot.revision,
          expectedSavedAt: draftResponse.snapshot.savedAt,
          currentSnapshot: draftResponse.snapshot,
        });
        setServerConflictAction(serverConflictAction);
      }
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Failed to sync server snapshots.');
    } finally {
      setServerPending(false);
    }
  }, [clearCompareState, fetchServerSnapshot, locale, serverConflict, serverConflictAction, syncServerSnapshotMeta]);

  const applyRemoteSnapshot = useCallback(
    (
      snapshot: BuilderHomePageSnapshot,
      label: string,
      options?: {
        syncLocalPublished?: boolean;
        rollbackPromotionCandidate?: BuilderRevisionHistoryItem | null;
      }
    ) => {
      const nextState = normalizeHomeDocumentState(snapshot.state, defaultDocumentState);
      const nextDocument = normalizeBuilderDocument(snapshot.document, initialDocument);
      const nextSelection = resolveSelectionForDocument(nextDocument, selection.sectionKey);

      const localDraftSnapshot = writeLocalBuilderDraftSnapshot({
        pageKey: 'home',
        locale,
        document: nextDocument,
        state: nextState,
      });

      if (options?.syncLocalPublished) {
        const localPublished = writeLocalBuilderPublishedSnapshot({
          pageKey: 'home',
          locale,
          document: nextDocument,
          state: nextState,
        });
        setLastPublishedAt(localPublished.savedAt);
      }

      skipNextPersistRef.current = true;
      recordWorkspaceSnapshot(
        buildWorkspaceSnapshot(nextDocument, nextState, nextSelection, label)
      );
      setLastDraftSavedAt(localDraftSnapshot.savedAt);
      setPendingRevisionRestore(null);
      setRollbackPromotionCandidate(options?.rollbackPromotionCandidate ?? null);
      setReviewedRollbackPromotionKey(null);
    },
    [
      buildWorkspaceSnapshot,
      defaultDocumentState,
      initialDocument,
      locale,
      recordWorkspaceSnapshot,
      selection.sectionKey,
    ]
  );

  const preparePublishedRevisionRestore = useCallback(
    async (record: BuilderRevisionHistoryItem, options?: { saveCheckpointFirst?: boolean }) => {
      setPublishedHistoryPending(true);
      setPublishedHistoryError(null);
      setServerError(null);
      setPendingRevisionRestore(null);

      try {
        const payload = await fetchHomeRevision(record.revisionId);

        if (options?.saveCheckpointFirst) {
          const localCheckpoint = writeLocalBuilderPublishedSnapshot({
            pageKey: 'home',
            locale,
            document: pageDocument,
            state: currentDocumentState,
          });
          setLastPublishedAt(localCheckpoint.savedAt);
        }

        await compareBrowserDraftAgainstSnapshot({
          snapshot: payload.snapshot,
          label: `Published v${record.revision}`,
          throwOnError: true,
        });
        setPendingRevisionRestore({
          record,
          snapshot: payload.snapshot,
        });
      } catch (error) {
        setPendingRevisionRestore(null);
        setPublishedHistoryError(
          error instanceof Error ? error.message : 'Failed to review the selected published revision.'
        );
      } finally {
        setPublishedHistoryPending(false);
      }
    },
    [compareBrowserDraftAgainstSnapshot, currentDocumentState, fetchHomeRevision, locale, pageDocument]
  );

  const confirmPublishedRevisionRestore = useCallback(() => {
    if (!pendingRevisionRestore) return;
    applyRemoteSnapshot(
      pendingRevisionRestore.snapshot,
      `Loaded published revision ${pendingRevisionRestore.record.revision} into browser draft`,
      {
        rollbackPromotionCandidate: pendingRevisionRestore.record,
      }
    );
    setPendingRevisionRestore(null);
  }, [applyRemoteSnapshot, pendingRevisionRestore]);

  const cancelPublishedRevisionRestore = useCallback(() => {
    setPendingRevisionRestore(null);
  }, []);

  const saveCurrentDraft = useCallback(() => {
    if (!draftHydrated) return;
    const snapshot = writeLocalBuilderDraftSnapshot({
      pageKey: 'home',
      locale,
      document: pageDocument,
      state: currentDocumentState,
    });
    setLastDraftSavedAt(snapshot.savedAt);
  }, [currentDocumentState, draftHydrated, locale, pageDocument]);

  const saveServerDraft = useCallback(
    async (options?: { allowConflictReplace?: boolean; allowRollbackPromotion?: boolean }) => {
    if (serverConflict?.kind === 'draft') {
      const conflictKey = getConflictReviewKey(serverConflict);
      if (!options?.allowConflictReplace || reviewedConflictKey !== conflictKey) {
        setServerError(
          'Review local vs latest shared draft first, then use the explicit replace action if you still want to overwrite the shared draft.'
        );
        return;
      }
    }

      if (rollbackPromotionCandidate) {
        if (serverDraftMeta.persisted) {
          const rollbackPromotionKey = getRollbackPromotionReviewKey(
            rollbackPromotionCandidate,
            serverDraftMeta.revision,
            serverDraftMeta.savedAt
          );
          if (
            !options?.allowRollbackPromotion ||
            reviewedRollbackPromotionKey !== rollbackPromotionKey
          ) {
            setServerError(
              `This browser draft came from published revision v${rollbackPromotionCandidate.revision}. Review it against the latest shared draft first, then use the explicit promote action to replace the shared draft.`
            );
            return;
          }
        } else if (!options?.allowRollbackPromotion) {
          setServerError(
            `This browser draft came from published revision v${rollbackPromotionCandidate.revision}. Use the explicit promote action to create the first shared draft from this recovery draft.`
          );
          return;
        }
      }

    setServerPending(true);
    setServerError(null);
    setServerNotice(null);
    setServerConflict(null);
    setServerConflictAction(null);
    setServerValidationPassed(false);
    setServerValidationAction(null);

    try {
      const response = await fetch(`${pageApiBase}/draft?locale=${encodeURIComponent(locale)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          document: pageDocument,
          state: currentDocumentState,
          updatedBy: 'builder-preview-web',
          expectedRevision: serverDraftMeta.revision,
          expectedSavedAt: serverDraftMeta.persisted ? serverDraftMeta.savedAt : undefined,
        }),
      });
      const payload = (await response.json().catch(() => null)) as BuilderServerSnapshotResponse | null;

      if (!response.ok || !payload?.ok) {
        handleServerFailure(response, payload, 'Failed to save draft to server.', 'save');
        return;
      }

      saveCurrentDraft();
      syncServerSnapshotMeta('draft', payload);
      clearCompareState();
      setReviewedConflictKey(null);
      setReviewedRollbackPromotionKey(null);
      setRollbackPromotionCandidate(null);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Failed to save draft to server.');
    } finally {
      setServerPending(false);
    }
    },
    [
      clearCompareState,
      currentDocumentState,
      handleServerFailure,
      locale,
      pageDocument,
      reviewedConflictKey,
      reviewedRollbackPromotionKey,
      rollbackPromotionCandidate,
      saveCurrentDraft,
      serverConflict,
      serverDraftMeta.persisted,
      serverDraftMeta.revision,
      serverDraftMeta.savedAt,
      pageApiBase,
      syncServerSnapshotMeta,
    ]
  );

  const loadServerDraft = useCallback(async () => {
    setServerPending(true);
    setServerError(null);
    setServerNotice(null);
    setServerConflict(null);
    setServerConflictAction(null);
    setServerValidationPassed(false);

    try {
      const payload = await fetchServerSnapshot('draft');
      if (!payload.persisted || !payload.snapshot) {
        throw new Error('No server draft exists for this locale yet.');
      }
      syncServerSnapshotMeta('draft', payload);
      applyRemoteSnapshot(payload.snapshot, 'Loaded server draft');
      clearCompareState();
      setReviewedConflictKey(null);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Failed to load server draft.');
    } finally {
      setServerPending(false);
    }
  }, [applyRemoteSnapshot, clearCompareState, fetchServerSnapshot, syncServerSnapshotMeta]);

  const publishToLocalSnapshot = useCallback(() => {
    const snapshot = writeLocalBuilderPublishedSnapshot({
      pageKey: 'home',
      locale,
      document: pageDocument,
      state: currentDocumentState,
    });
    setLastPublishedAt(snapshot.savedAt);
  }, [currentDocumentState, locale, pageDocument]);

  const restorePublishedSnapshot = useCallback(() => {
    const publishedSnapshot = readLocalBuilderPublishedSnapshot({
      pageKey: 'home',
      locale,
      fallbackDocument: initialDocument,
      fallbackState: defaultDocumentState,
    });
    if (!publishedSnapshot) return;

    const nextState = normalizeHomeDocumentState(publishedSnapshot.state, defaultDocumentState);
    const nextDocument = normalizeBuilderDocument(publishedSnapshot.document, initialDocument);
    const nextSelection = resolveSelectionForDocument(nextDocument, selection.sectionKey);
    const draftSnapshot = writeLocalBuilderDraftSnapshot({
      pageKey: 'home',
      locale,
      document: nextDocument,
      state: nextState,
    });

    skipNextPersistRef.current = true;
    recordWorkspaceSnapshot(
      buildWorkspaceSnapshot(nextDocument, nextState, nextSelection, 'Restore published snapshot')
    );
    setLastDraftSavedAt(draftSnapshot.savedAt);
    setLastPublishedAt(publishedSnapshot.savedAt);
    setPendingRevisionRestore(null);
    setRollbackPromotionCandidate(null);
    setReviewedRollbackPromotionKey(null);
  }, [
    buildWorkspaceSnapshot,
    defaultDocumentState,
    initialDocument,
    locale,
    recordWorkspaceSnapshot,
    selection.sectionKey,
  ]);

  const publishServerSnapshot = useCallback(async () => {
    if (rollbackPromotionCandidate) {
      setServerError(
        `This browser draft is a local recovery from published revision v${rollbackPromotionCandidate.revision}. Promote it to the shared draft first, then publish from the shared workflow.`
      );
      return;
    }

    setServerPending(true);
    setServerError(null);
    setServerNotice(null);
    setServerConflict(null);
    setServerConflictAction(null);
    setServerValidationIssues(null);
    setServerValidationPassed(false);
    setServerValidationAction(null);

    try {
      const saveResponse = await fetch(`${pageApiBase}/draft?locale=${encodeURIComponent(locale)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          document: pageDocument,
          state: currentDocumentState,
          updatedBy: 'builder-preview-web',
          expectedRevision: serverDraftMeta.revision,
          expectedSavedAt: serverDraftMeta.persisted ? serverDraftMeta.savedAt : undefined,
        }),
      });
      const savePayload = (await saveResponse.json().catch(() => null)) as BuilderServerSnapshotResponse | null;

      if (!saveResponse.ok || !savePayload?.ok) {
        handleServerFailure(saveResponse, savePayload, 'Failed to save draft before publish.', 'publish');
        return;
      }

      syncServerSnapshotMeta('draft', savePayload);
      saveCurrentDraft();

      const publishResponse = await fetch(`${pageApiBase}/publish?locale=${encodeURIComponent(locale)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          updatedBy: 'builder-preview-web',
          expectedDraftRevision: savePayload.snapshot?.revision ?? serverDraftMeta.revision,
          expectedDraftSavedAt:
            savePayload.snapshot?.savedAt ??
            (serverDraftMeta.persisted ? serverDraftMeta.savedAt : undefined),
          expectedPublishedRevision: serverPublishedMeta.revision,
          expectedPublishedSavedAt: serverPublishedMeta.persisted
            ? serverPublishedMeta.savedAt
            : undefined,
        }),
      });
      const publishPayload = (await publishResponse.json().catch(() => null)) as BuilderServerSnapshotResponse | null;

      if (!publishResponse.ok || !publishPayload?.ok || !publishPayload.snapshot) {
        handleServerFailure(
          publishResponse,
          publishPayload,
          'Failed to publish server snapshot.',
          'publish'
        );
        return;
      }

      syncServerSnapshotMeta('published', publishPayload);
      const localPublished = writeLocalBuilderPublishedSnapshot({
        pageKey: 'home',
        locale,
        document: pageDocument,
        state: currentDocumentState,
      });
      setLastPublishedAt(localPublished.savedAt);
      setServerValidationCheckedAt(new Date().toISOString());
      setServerValidationPassed(true);
      setServerValidationAction('publish');
      clearCompareState();
      setReviewedConflictKey(null);
      setReviewedRollbackPromotionKey(null);
      void loadPublishedHistory({ force: true });
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Failed to publish server snapshot.');
    } finally {
      setServerPending(false);
    }
  }, [
    clearCompareState,
    currentDocumentState,
    handleServerFailure,
    locale,
    pageDocument,
    rollbackPromotionCandidate,
    saveCurrentDraft,
    serverDraftMeta.persisted,
    serverDraftMeta.revision,
    serverDraftMeta.savedAt,
    serverPublishedMeta.persisted,
    serverPublishedMeta.revision,
    serverPublishedMeta.savedAt,
    loadPublishedHistory,
    pageApiBase,
    syncServerSnapshotMeta,
  ]);

  const runPublishChecks = useCallback(async () => {
    setServerPending(true);
    setServerError(null);
    setServerNotice(null);
    setServerConflict(null);
    setServerConflictAction(null);
    setServerValidationIssues(null);
    setServerValidationPassed(false);
    setServerValidationAction(null);

    try {
      const response = await fetch(
        `${pageApiBase}/publish-checks?locale=${encodeURIComponent(locale)}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            document: pageDocument,
            state: currentDocumentState,
            updatedBy: 'builder-preview-web',
          }),
        }
      );
      const payload = (await response.json().catch(() => null)) as BuilderPublishChecksResponse | null;

      if (!response.ok || !payload?.ok) {
        setServerValidationIssues(null);
        setServerValidationPassed(false);
        setServerValidationAction(null);
        setServerError(payload?.error || 'Failed to run publish checks.');
        return;
      }

      const checkedAt = payload.checkedAt ?? new Date().toISOString();
      setServerValidationCheckedAt(checkedAt);
      setServerValidationAction('validate');

      if (!payload.passed) {
        setServerValidationIssues(payload.issues ?? []);
        setServerValidationPassed(false);
        setServerError('Publish checks found issues that must be resolved before publish.');
        return;
      }

      setServerValidationIssues(null);
      setServerValidationPassed(true);
      setServerError(null);
    } catch (error) {
      setServerValidationIssues(null);
      setServerValidationPassed(false);
      setServerValidationAction(null);
      setServerError(error instanceof Error ? error.message : 'Failed to run publish checks.');
    } finally {
      setServerPending(false);
    }
  }, [currentDocumentState, locale, pageApiBase, pageDocument]);

  const loadServerPublished = useCallback(async () => {
    setServerPending(true);
    setServerError(null);
    setServerConflict(null);
    setServerConflictAction(null);
    setServerValidationPassed(false);
    setServerValidationAction(null);

    try {
      const payload = await fetchServerSnapshot('published');
      if (!payload.persisted || !payload.snapshot) {
        throw new Error('No server published snapshot exists for this locale yet.');
      }
      syncServerSnapshotMeta('published', payload);
      applyRemoteSnapshot(payload.snapshot, 'Loaded server published', {
        syncLocalPublished: true,
      });
      clearCompareState();
      setReviewedConflictKey(null);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Failed to load server published snapshot.');
    } finally {
      setServerPending(false);
    }
  }, [applyRemoteSnapshot, clearCompareState, fetchServerSnapshot, syncServerSnapshotMeta]);

  const applySelectedSurfaceOverride = useCallback(
    (partial: Partial<BuilderSurfaceOverride>) => {
      if (!selection.surfaceId || !selectedDescriptor) return;
      if (blockLockedSectionAction([selection.sectionKey], 'editing this section')) {
        return;
      }

      const key = getOverrideKey(selection.sectionId, selection.surfaceId);
      const nextState = normalizeHomeDocumentState(
        {
          ...currentDocumentState,
          overrides: {
            ...currentDocumentState.overrides,
            [key]: {
              ...currentDocumentState.overrides[key],
              kind: selectedDescriptor.kind,
              ...partial,
            },
          },
        },
        currentDocumentState
      );
      recordWorkspaceSnapshot(
        buildWorkspaceSnapshot(pageDocument, nextState, selection, `Edit ${selectedDescriptor.kind}`)
      );
    },
    [
      buildWorkspaceSnapshot,
      blockLockedSectionAction,
      currentDocumentState,
      pageDocument,
      recordWorkspaceSnapshot,
      selectedDescriptor,
      selection,
    ]
  );

  const applyAssetLibraryItem = useCallback(
    (asset: BuilderAssetLibraryItem) => {
      applySelectedSurfaceOverride({ src: asset.url });
      setImageUploadError(null);
      setImageUploadNotice(`Using ${asset.filename} from recent builder assets.`);
    },
    [applySelectedSurfaceOverride]
  );

  const handleImageFileSelection = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const input = event.currentTarget;
      const file = input.files?.[0];
      input.value = '';

      if (!file) return;
      if (selection.targetKind !== 'image' || !selection.surfaceId) {
        setImageUploadError('Select an image surface before uploading a replacement file.');
        return;
      }

      setImageUploadPending(true);
      setImageUploadError(null);
      setImageUploadNotice(null);

      try {
        const formData = new FormData();
        formData.set('file', file);

        const response = await fetch(`/api/builder/assets?locale=${encodeURIComponent(locale)}`, {
          method: 'POST',
          body: formData,
        });
        const payload = (await response.json().catch(() => null)) as BuilderAssetUploadResponse | null;

        if (!response.ok || !payload?.ok || !payload.asset) {
          throw new Error(payload?.error || 'Image upload failed.');
        }

        const uploadedAsset = payload.asset;
        applySelectedSurfaceOverride({ src: uploadedAsset.url });
        setAssetLibraryItems((current) =>
          dedupeAssetLibraryItems([
            {
              locale: uploadedAsset.locale,
              url: uploadedAsset.url,
              filename: uploadedAsset.filename,
              contentType: uploadedAsset.contentType,
              size: uploadedAsset.size,
              uploadedAt: uploadedAsset.uploadedAt,
            },
            ...current,
          ])
        );
        setAssetLibraryHydrated(true);
        setImageUploadNotice(
          `Uploaded ${uploadedAsset.filename} · ${formatBytes(uploadedAsset.size)}`
        );
      } catch (error) {
        setImageUploadError(
          error instanceof Error ? error.message : 'Image upload failed. Please try again.'
        );
      } finally {
        setImageUploadPending(false);
      }
    },
    [applySelectedSurfaceOverride, locale, selection.surfaceId, selection.targetKind]
  );

  const handleFaqItemsChange = useCallback(
    (updater: (current: FAQItem[]) => FAQItem[], nextIndex?: number | null) => {
      if (blockLockedSectionAction(['home.faq'], 'editing FAQ items')) {
        return;
      }

      const nextFaqItems = updater(faqDraftItems);
      const nextState = normalizeHomeDocumentState(
        {
          ...currentDocumentState,
          faqItems: nextFaqItems,
          overrides: removeOverridesForSection(
            currentDocumentState.overrides,
            sectionIdByKey['home.faq'] ?? ''
          ),
          activeCollectionIndex: {
            ...activeCollectionIndex,
            'home.faq': clampCollectionIndex(nextIndex ?? activeCollectionIndex['home.faq'], nextFaqItems.length),
          },
        },
        currentDocumentState
      );
      recordWorkspaceSnapshot(
        buildWorkspaceSnapshot(pageDocument, nextState, selection, 'Edit FAQ items')
      );
    },
    [
      activeCollectionIndex,
      blockLockedSectionAction,
      buildWorkspaceSnapshot,
      currentDocumentState,
      faqDraftItems,
      pageDocument,
      recordWorkspaceSnapshot,
      sectionIdByKey,
      selection,
    ]
  );

  const handleServiceItemsChange = useCallback(
    (updater: (current: BuilderServiceItem[]) => BuilderServiceItem[], nextIndex?: number | null) => {
      if (blockLockedSectionAction(['home.services'], 'editing service items')) {
        return;
      }

      const nextServiceItems = updater(serviceItems);
      const nextState = normalizeHomeDocumentState(
        {
          ...currentDocumentState,
          serviceItems: nextServiceItems,
          overrides: removeOverridesForSection(
            currentDocumentState.overrides,
            sectionIdByKey['home.services'] ?? ''
          ),
          activeCollectionIndex: {
            ...activeCollectionIndex,
            'home.services': clampCollectionIndex(
              nextIndex ?? activeCollectionIndex['home.services'],
              nextServiceItems.length
            ),
          },
        },
        currentDocumentState
      );
      recordWorkspaceSnapshot(
        buildWorkspaceSnapshot(pageDocument, nextState, selection, 'Edit service items')
      );
    },
    [
      activeCollectionIndex,
      blockLockedSectionAction,
      buildWorkspaceSnapshot,
      currentDocumentState,
      pageDocument,
      recordWorkspaceSnapshot,
      sectionIdByKey,
      selection,
      serviceItems,
    ]
  );

  const applySectionDocumentChange = useCallback(
    (
      sectionKeys: BuilderSectionKey[],
      reducer: (document: BuilderPageDocument, sectionKey: BuilderSectionKey) => BuilderPageDocument,
      label: string
    ) => {
      const uniqueSectionKeys = Array.from(new Set(sectionKeys));
      if (!uniqueSectionKeys.length) return;

      const nextDocument = uniqueSectionKeys.reduce(
        (currentDocument, sectionKey) => reducer(currentDocument, sectionKey),
        pageDocument
      );

      recordWorkspaceSnapshot(
        buildWorkspaceSnapshot(nextDocument, currentDocumentState, selection, label)
      );
    },
    [buildWorkspaceSnapshot, currentDocumentState, pageDocument, recordWorkspaceSnapshot, selection]
  );

  const moveSection = useCallback(
    (sectionKey: BuilderSectionKey, offset: -1 | 1) => {
      const currentIndex = pageDocument.root.children.findIndex((section) => section.sectionKey === sectionKey);
      if (currentIndex < 0) {
        return;
      }

      const moveBlockMessage = getSectionMoveLockBlockMessage(sectionKey, currentIndex + offset);
      if (moveBlockMessage) {
        setEditorGuardNotice(moveBlockMessage);
        return;
      }

      const nextDocument = moveBuilderDocumentSection(pageDocument, sectionKey, offset);
      recordWorkspaceSnapshot(
        buildWorkspaceSnapshot(nextDocument, currentDocumentState, selection, 'Reorder section')
      );
    },
    [
      buildWorkspaceSnapshot,
      currentDocumentState,
      getSectionMoveLockBlockMessage,
      pageDocument,
      recordWorkspaceSnapshot,
      selection,
    ]
  );

  const moveSectionToIndex = useCallback(
    (sectionKey: BuilderSectionKey, targetIndex: number, label: string) => {
      const moveBlockMessage = getSectionMoveLockBlockMessage(sectionKey, targetIndex);
      if (moveBlockMessage) {
        setEditorGuardNotice(moveBlockMessage);
        return;
      }

      const nextDocument = moveBuilderDocumentSectionToIndex(pageDocument, sectionKey, targetIndex);
      recordWorkspaceSnapshot(
        buildWorkspaceSnapshot(nextDocument, currentDocumentState, selection, label)
      );
    },
    [
      buildWorkspaceSnapshot,
      currentDocumentState,
      getSectionMoveLockBlockMessage,
      pageDocument,
      recordWorkspaceSnapshot,
      selection,
    ]
  );

  const handleSectionDragStart = useCallback(
    (sectionKey: BuilderSectionKey) => {
      if (isSectionLocked(sectionKey)) {
        setEditorGuardNotice(
          `${homeSectionRegistry[sectionKey].title} is locked. Unlock this section before dragging it.`
        );
        return;
      }

      const sectionId = sectionIdByKey[sectionKey];
      setSectionDragState({
        draggedSectionKey: sectionKey,
        targetSectionKey: null,
        placement: null,
      });

      if (sectionId) {
        selectSingleTarget(createSectionSelection(sectionKey, sectionId));
      }
    },
    [isSectionLocked, sectionIdByKey, selectSingleTarget]
  );

  const handleSectionDragOver = useCallback(
    (event: DragEvent<HTMLElement>, targetSectionKey: BuilderSectionKey) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const placement: BuilderSectionDragPlacement =
        event.clientY < rect.top + rect.height / 2 ? 'before' : 'after';

      setSectionDragState((current) => {
        if (!current) return current;
        if (current.draggedSectionKey === targetSectionKey) {
          if (current.targetSectionKey === null && current.placement === null) {
            return current;
          }
          return {
            ...current,
            targetSectionKey: null,
            placement: null,
          };
        }

        const sourceIndex = pageDocument.root.children.findIndex(
          (section) => section.sectionKey === current.draggedSectionKey
        );
        const rawTargetIndex = pageDocument.root.children.findIndex(
          (section) => section.sectionKey === targetSectionKey
        );
        if (sourceIndex < 0 || rawTargetIndex < 0) {
          return {
            ...current,
            targetSectionKey: null,
            placement: null,
          };
        }

        const nextTargetIndex = placement === 'before' ? rawTargetIndex : rawTargetIndex + 1;
        const normalizedTargetIndex =
          sourceIndex < nextTargetIndex ? Math.max(0, nextTargetIndex - 1) : nextTargetIndex;
        if (getSectionMoveLockBlockMessage(current.draggedSectionKey, normalizedTargetIndex)) {
          return {
            ...current,
            targetSectionKey: null,
            placement: null,
          };
        }

        event.preventDefault();

        if (current.targetSectionKey === targetSectionKey && current.placement === placement) {
          return current;
        }

        return {
          ...current,
          targetSectionKey,
          placement,
        };
      });
    },
    [getSectionMoveLockBlockMessage, pageDocument.root.children]
  );

  const clearSectionDragState = useCallback(() => {
    setSectionDragState(null);
  }, []);

  const handleSectionDrop = useCallback(
    (targetSectionKey: BuilderSectionKey) => {
      if (
        !sectionDragState ||
        sectionDragState.draggedSectionKey === targetSectionKey ||
        !sectionDragState.placement
      ) {
        setSectionDragState(null);
        return;
      }

      const sourceIndex = pageDocument.root.children.findIndex(
        (section) => section.sectionKey === sectionDragState.draggedSectionKey
      );
      const rawTargetIndex = pageDocument.root.children.findIndex(
        (section) => section.sectionKey === targetSectionKey
      );
      if (sourceIndex < 0 || rawTargetIndex < 0) {
        setSectionDragState(null);
        return;
      }

      const targetIndex =
        sectionDragState.placement === 'before' ? rawTargetIndex : rawTargetIndex + 1;
      const normalizedTargetIndex =
        sourceIndex < targetIndex ? Math.max(0, targetIndex - 1) : targetIndex;
      const targetDefinition = homeSectionRegistry[targetSectionKey];
      const placementLabel =
        sectionDragState.placement === 'before'
          ? `Move before ${targetDefinition.title}`
          : `Move after ${targetDefinition.title}`;

      moveSectionToIndex(sectionDragState.draggedSectionKey, normalizedTargetIndex, placementLabel);
      setSectionDragState(null);
    },
    [moveSectionToIndex, pageDocument.root.children, sectionDragState]
  );

  const toggleSectionVisibility = useCallback(
    (sectionKey: BuilderSectionKey) => {
      if (blockLockedSectionAction([sectionKey], 'changing visibility')) {
        return;
      }

      const currentSection = pageDocument.root.children.find((section) => section.sectionKey === sectionKey);
      if (!currentSection) return;
      const nextHidden = !resolveBuilderSectionHidden(currentSection, viewportMode);
      const nextDocument =
        viewportMode === 'desktop'
          ? setBuilderDocumentSectionHidden(pageDocument, sectionKey, nextHidden)
          : updateBuilderDocumentSectionVisibility(pageDocument, sectionKey, nextHidden, viewportMode);
      recordWorkspaceSnapshot(
        buildWorkspaceSnapshot(
          nextDocument,
          currentDocumentState,
          selection,
          viewportMode === 'desktop'
            ? 'Toggle section visibility'
            : `Toggle ${getViewportLabel(viewportMode).toLowerCase()} visibility`
        )
      );
    },
    [
      blockLockedSectionAction,
      buildWorkspaceSnapshot,
      currentDocumentState,
      pageDocument,
      recordWorkspaceSnapshot,
      selection,
      viewportMode,
    ]
  );

  const setSelectedSectionsVisibility = useCallback(
    (hidden: boolean) => {
      if (blockLockedSectionAction(selectedSectionActionKeys, hidden ? 'hiding sections' : 'showing sections')) {
        return;
      }

      applySectionDocumentChange(
        selectedSectionActionKeys,
        (document, sectionKey) =>
          viewportMode === 'desktop'
            ? setBuilderDocumentSectionHidden(document, sectionKey, hidden)
            : updateBuilderDocumentSectionVisibility(document, sectionKey, hidden, viewportMode),
        getVisibilityActionVerb(viewportMode, !hidden, selectedSectionActionKeys.length > 1)
      );
    },
    [applySectionDocumentChange, blockLockedSectionAction, selectedSectionActionKeys, viewportMode]
  );

  const resetSelectedSectionsVisibilityOverride = useCallback(
    () => {
      if (viewportMode === 'desktop') {
        return;
      }

      if (blockLockedSectionAction(selectedSectionActionKeys, 'resetting responsive visibility')) {
        return;
      }

      applySectionDocumentChange(
        selectedSectionActionKeys,
        (document, sectionKey) =>
          clearBuilderDocumentSectionVisibilityOverride(document, sectionKey, viewportMode),
        selectedSectionActionKeys.length > 1
          ? `Reset ${getViewportLabel(viewportMode).toLowerCase()} visibility overrides`
          : `Reset ${getViewportLabel(viewportMode).toLowerCase()} visibility override`
      );
    },
    [
      applySectionDocumentChange,
      blockLockedSectionAction,
      selectedSectionActionKeys,
      viewportMode,
    ]
  );

  const setSelectedSectionsLock = useCallback(
    (locked: boolean) => {
      applySectionDocumentChange(
        selectedSectionActionKeys,
        (document, sectionKey) => setBuilderDocumentSectionLocked(document, sectionKey, locked),
        locked
          ? selectedSectionActionKeys.length > 1
            ? 'Lock selected sections'
            : 'Lock section'
          : selectedSectionActionKeys.length > 1
            ? 'Unlock selected sections'
            : 'Unlock section'
      );
    },
    [applySectionDocumentChange, selectedSectionActionKeys]
  );

  const toggleSectionLock = useCallback(
    (sectionKey: BuilderSectionKey) => {
      const currentSection = pageDocument.root.children.find((section) => section.sectionKey === sectionKey);
      if (!currentSection) {
        return;
      }

      const nextLocked = !Boolean(currentSection.locked);
      applySectionDocumentChange(
        [sectionKey],
        (document, nextSectionKey) => setBuilderDocumentSectionLocked(document, nextSectionKey, nextLocked),
        nextLocked ? 'Lock section' : 'Unlock section'
      );
    },
    [applySectionDocumentChange, pageDocument.root.children]
  );

  const resetSectionStructure = useCallback(
    (sectionKey: BuilderSectionKey) => {
      if (blockLockedSectionAction([sectionKey], 'resetting structure')) {
        return;
      }

      const nextDocument = resetBuilderDocumentSection(pageDocument, initialDocument, sectionKey);
      recordWorkspaceSnapshot(
        buildWorkspaceSnapshot(nextDocument, currentDocumentState, selection, 'Reset section structure')
      );
    },
    [
      blockLockedSectionAction,
      buildWorkspaceSnapshot,
      currentDocumentState,
      initialDocument,
      pageDocument,
      recordWorkspaceSnapshot,
      selection,
    ]
  );

  const updateDatasetLimit = useCallback(
    (targetId: BuilderDatasetTargetId, limit: number, label: string) => {
      const target = getBuilderBindableTarget(targetId);
      if (blockLockedSectionAction([target.sectionKey], 'changing dataset binding')) {
        return;
      }

      const nextDocument = setBuilderDocumentDatasetLimit(pageDocument, targetId, limit);
      recordWorkspaceSnapshot(
        buildWorkspaceSnapshot(nextDocument, currentDocumentState, selection, label)
      );
    },
    [
      blockLockedSectionAction,
      buildWorkspaceSnapshot,
      currentDocumentState,
      pageDocument,
      recordWorkspaceSnapshot,
      selection,
    ]
  );

  const resetDatasetBinding = useCallback(
    (targetId: BuilderDatasetTargetId, label: string) => {
      const target = getBuilderBindableTarget(targetId);
      if (blockLockedSectionAction([target.sectionKey], 'resetting dataset binding')) {
        return;
      }

      const nextDocument = resetBuilderDocumentDataset(pageDocument, targetId);
      recordWorkspaceSnapshot(
        buildWorkspaceSnapshot(nextDocument, currentDocumentState, selection, label)
      );
    },
    [
      blockLockedSectionAction,
      buildWorkspaceSnapshot,
      currentDocumentState,
      pageDocument,
      recordWorkspaceSnapshot,
      selection,
    ]
  );

  const updateSelectedSectionLayout = useCallback(
    (partial: BuilderSectionLayoutOverride, label: string) => {
      if (blockLockedSectionAction(selectedSectionActionKeys, 'changing layout')) {
        return;
      }

      applySectionDocumentChange(
        selectedSectionActionKeys,
        (document, sectionKey) =>
          updateBuilderDocumentSectionLayout(document, sectionKey, partial, viewportMode),
        selectedSectionActionKeys.length > 1 ? `${label} (selection)` : label
      );
    },
    [applySectionDocumentChange, blockLockedSectionAction, selectedSectionActionKeys, viewportMode]
  );

  const resetSelectedSectionLayout = useCallback(() => {
    if (blockLockedSectionAction(selectedSectionActionKeys, 'resetting layout')) {
      return;
    }

    applySectionDocumentChange(
      selectedSectionActionKeys,
      (document, sectionKey) =>
        resetBuilderDocumentSectionLayout(document, initialDocument, sectionKey, viewportMode),
      viewportMode === 'desktop'
        ? selectedSectionActionKeys.length > 1
          ? 'Reset selected section layout'
          : 'Reset section layout'
        : selectedSectionActionKeys.length > 1
          ? `Reset ${getViewportLabel(viewportMode).toLowerCase()} overrides`
          : `Reset ${getViewportLabel(viewportMode).toLowerCase()} override`
    );
  }, [
    applySectionDocumentChange,
    blockLockedSectionAction,
    initialDocument,
    selectedSectionActionKeys,
    viewportMode,
  ]);

  const copySelectedSectionFrame = useCallback(() => {
    if (selection.targetKind !== 'section' || !selectedSections.length) {
      setClipboardNotice('Section frame copy is available only when a section frame is selected.');
      return;
    }

    const payload: BuilderSectionFrameClipboardPayload = {
      version: 1,
      kind: 'section-frame',
      pageKey: pageDocument.pageKey,
      copiedAt: new Date().toISOString(),
      items: selectedSections.map((section) => ({
        sectionKey: section.sectionKey,
        hidden: Boolean(section.hidden),
        layout: getStoredBuilderSectionLayout(section),
        visibility: getStoredBuilderSectionVisibility(section),
      })),
    };

    setClipboardPayload(payload);
    setClipboardNotice(
      payload.items.length > 1
        ? `Copied frame settings for ${payload.items.length} sections.`
        : `Copied frame settings for ${homeSectionRegistry[payload.items[0].sectionKey].title}.`
    );
  }, [pageDocument.pageKey, selectedSections, selection.targetKind]);

  const canPasteSectionFrame = useMemo(() => {
    if (selection.targetKind !== 'section' || !clipboardPayload?.items.length || !selectedSections.length) {
      return false;
    }

    return clipboardPayload.items.length === 1 || clipboardPayload.items.length === selectedSections.length;
  }, [clipboardPayload, selectedSections.length, selection.targetKind]);

  const pasteSelectedSectionFrame = useCallback(() => {
    if (selection.targetKind !== 'section') {
      setClipboardNotice('Section frame paste is available only on section selections.');
      return;
    }

    if (!clipboardPayload?.items.length) {
      setClipboardNotice('No builder frame settings are in the clipboard yet.');
      return;
    }

    if (!selectedSections.length) {
      setClipboardNotice('Select at least one section before pasting frame settings.');
      return;
    }

    if (
      blockLockedSectionAction(
        selectedSections.map((section) => section.sectionKey),
        'pasting frame settings'
      )
    ) {
      return;
    }

    if (clipboardPayload.items.length > 1 && clipboardPayload.items.length !== selectedSections.length) {
      setClipboardNotice(
        `Clipboard contains ${clipboardPayload.items.length} section frames, but ${selectedSections.length} sections are selected. Select one section to broadcast, or match the same count.`
      );
      return;
    }

    let nextDocument = pageDocument;

    selectedSections.forEach((section, index) => {
      const source =
        clipboardPayload.items.length === 1 ? clipboardPayload.items[0] : clipboardPayload.items[index];
      nextDocument = replaceBuilderDocumentSectionLayout(nextDocument, section.sectionKey, source.layout);
      nextDocument = replaceBuilderDocumentSectionVisibility(
        nextDocument,
        section.sectionKey,
        source.hidden,
        source.visibility
      );
    });

    recordWorkspaceSnapshot(
      buildWorkspaceSnapshot(
        nextDocument,
        currentDocumentState,
        selection,
        clipboardPayload.items.length > 1
          ? 'Paste section frames'
          : selectedSections.length > 1
            ? 'Paste section frame to selection'
            : 'Paste section frame'
      )
    );
    setClipboardNotice(
      clipboardPayload.items.length > 1
        ? `Pasted ${clipboardPayload.items.length} copied section frames into the current selection.`
        : `Applied copied frame settings to ${selectedSections.length} section${selectedSections.length > 1 ? 's' : ''}.`
    );
  }, [
    blockLockedSectionAction,
    buildWorkspaceSnapshot,
    clipboardPayload,
    currentDocumentState,
    pageDocument,
    recordWorkspaceSnapshot,
    selectedSections,
    selection,
  ]);

  const resizeSelectedSections = useCallback(
    (direction: BuilderResizeDirection) => {
      if (blockLockedSectionAction(selectedSectionActionKeys, 'resizing section width')) {
        return;
      }

      const nextWidth = getNextSectionWidthPreset(selectedSectionLayout.width, direction);
      if (!nextWidth || nextWidth === selectedSectionLayout.width) {
        setClipboardNotice(
          direction === 'narrower'
            ? 'Selection is already at the narrowest width preset.'
            : 'Selection is already at the widest width preset.'
        );
        return;
      }

      updateSelectedSectionLayout(
        { width: nextWidth },
        direction === 'narrower' ? 'Resize section narrower' : 'Resize section wider'
      );
      setClipboardNotice(
        `Applied ${nextWidth} width to ${selectedSectionActionKeys.length} section${selectedSectionActionKeys.length > 1 ? 's' : ''}.`
      );
    },
    [
      blockLockedSectionAction,
      selectedSectionActionKeys,
      selectedSectionLayout.width,
      updateSelectedSectionLayout,
    ]
  );

  const adjustSelectedSectionSpacing = useCallback(
    (edge: BuilderSpacingEdge, direction: BuilderSpacingDirection) => {
      if (blockLockedSectionAction(selectedSectionActionKeys, `adjusting ${edge} spacing`)) {
        return;
      }

      const currentSpacing =
        edge === 'top' ? selectedSectionLayout.spacingTop : selectedSectionLayout.spacingBottom;
      const nextSpacing = getNextSectionSpacingPreset(currentSpacing, direction);
      if (!nextSpacing || nextSpacing === currentSpacing) {
        setClipboardNotice(
          direction === 'tighter'
            ? `${edge === 'top' ? 'Top' : 'Bottom'} spacing is already at the tightest preset.`
            : `${edge === 'top' ? 'Top' : 'Bottom'} spacing is already at the loosest preset.`
        );
        return;
      }

      updateSelectedSectionLayout(
        edge === 'top' ? { spacingTop: nextSpacing } : { spacingBottom: nextSpacing },
        direction === 'tighter' ? `Tighten ${edge} spacing` : `Loosen ${edge} spacing`
      );
      setClipboardNotice(
        `Applied ${formatSpacingLabel(nextSpacing).toLowerCase()} ${edge} spacing to ${selectedSectionActionKeys.length} section${selectedSectionActionKeys.length > 1 ? 's' : ''}.`
      );
    },
    [
      blockLockedSectionAction,
      selectedSectionActionKeys,
      selectedSectionLayout.spacingBottom,
      selectedSectionLayout.spacingTop,
      updateSelectedSectionLayout,
    ]
  );

  const adjustSelectedSectionInset = useCallback(
    (axis: BuilderInsetAxis, direction: BuilderSpacingDirection) => {
      if (blockLockedSectionAction(selectedSectionActionKeys, `adjusting ${axis} inset`)) {
        return;
      }

      const currentInset =
        axis === 'inline' ? selectedSectionLayout.paddingInline : selectedSectionLayout.paddingBlock;
      const nextInset = getNextSectionSpacingPreset(currentInset, direction);
      if (!nextInset || nextInset === currentInset) {
        setClipboardNotice(
          direction === 'tighter'
            ? `${axis === 'inline' ? 'Inline' : 'Block'} inset is already at the tightest preset.`
            : `${axis === 'inline' ? 'Inline' : 'Block'} inset is already at the loosest preset.`
        );
        return;
      }

      updateSelectedSectionLayout(
        axis === 'inline' ? { paddingInline: nextInset } : { paddingBlock: nextInset },
        direction === 'tighter' ? `Tighten ${axis} inset` : `Loosen ${axis} inset`
      );
      setClipboardNotice(
        `Applied ${formatSpacingLabel(nextInset).toLowerCase()} ${axis} inset to ${selectedSectionActionKeys.length} section${selectedSectionActionKeys.length > 1 ? 's' : ''}.`
      );
    },
    [
      blockLockedSectionAction,
      selectedSectionActionKeys,
      selectedSectionLayout.paddingBlock,
      selectedSectionLayout.paddingInline,
      updateSelectedSectionLayout,
    ]
  );

  const resetCurrentSectionDraft = useCallback(() => {
    if (blockLockedSectionAction([selection.sectionKey], 'resetting section content')) {
      return;
    }

    const sectionId = sectionIdByKey[selection.sectionKey] ?? '';
    const nextOverrides = removeOverridesForSection(currentDocumentState.overrides, sectionId);

    if (selection.sectionKey === 'home.faq') {
      const nextItems = cloneFaqItems(defaultDocumentState.faqItems);
      const nextState = normalizeHomeDocumentState(
        {
          ...currentDocumentState,
          faqItems: nextItems,
          overrides: nextOverrides,
          activeCollectionIndex: {
            ...activeCollectionIndex,
            'home.faq': clampCollectionIndex(activeCollectionIndex['home.faq'], nextItems.length),
          },
        },
        currentDocumentState
      );
      recordWorkspaceSnapshot(
        buildWorkspaceSnapshot(pageDocument, nextState, selection, 'Reset FAQ draft')
      );
      return;
    }

    if (selection.sectionKey === 'home.services') {
      const nextItems = cloneServiceItems(defaultDocumentState.serviceItems);
      const nextState = normalizeHomeDocumentState(
        {
          ...currentDocumentState,
          serviceItems: nextItems,
          overrides: nextOverrides,
          activeCollectionIndex: {
            ...activeCollectionIndex,
            'home.services': clampCollectionIndex(activeCollectionIndex['home.services'], nextItems.length),
          },
        },
        currentDocumentState
      );
      recordWorkspaceSnapshot(
        buildWorkspaceSnapshot(pageDocument, nextState, selection, 'Reset service draft')
      );
      return;
    }

    const nextState = normalizeHomeDocumentState(
      {
        ...currentDocumentState,
        overrides: nextOverrides,
      },
      currentDocumentState
    );
    recordWorkspaceSnapshot(
      buildWorkspaceSnapshot(pageDocument, nextState, selection, 'Reset section content')
    );
  }, [
    activeCollectionIndex,
    blockLockedSectionAction,
    buildWorkspaceSnapshot,
    currentDocumentState,
    defaultDocumentState,
    pageDocument,
    recordWorkspaceSnapshot,
    sectionIdByKey,
    selection,
  ]);

  const clearLocalDraft = useCallback(() => {
    skipNextPersistRef.current = true;
    clearLocalBuilderDraftSnapshot('home', locale);
    const nextDocument = cloneBuilderDocument(initialDocument);
    const nextState = normalizeHomeDocumentState(defaultDocumentState, defaultDocumentState);
    const nextSelection = resolveSelectionForDocument(nextDocument);
    setPageDocument(nextDocument);
    applyDocumentState(nextState);
    setSelection(nextSelection);
    setSelectedSectionIds([nextSelection.sectionId]);
    seedWorkspaceHistory(buildWorkspaceSnapshot(nextDocument, nextState, nextSelection, 'Cleared draft'));
    setLastDraftSavedAt(null);
    setRollbackPromotionCandidate(null);
    setReviewedRollbackPromotionKey(null);
  }, [
    applyDocumentState,
    buildWorkspaceSnapshot,
    defaultDocumentState,
    initialDocument,
    locale,
    seedWorkspaceHistory,
  ]);

  const undoWorkspaceChange = useCallback(() => {
    if (historyCursorRef.current <= 0) return;
    historyCursorRef.current -= 1;
    const snapshot = historyRef.current[historyCursorRef.current];
    applyWorkspaceSnapshot(snapshot);
  }, [applyWorkspaceSnapshot]);

  const redoWorkspaceChange = useCallback(() => {
    if (historyCursorRef.current >= historyRef.current.length - 1) return;
    historyCursorRef.current += 1;
    const snapshot = historyRef.current[historyCursorRef.current];
    applyWorkspaceSnapshot(snapshot);
  }, [applyWorkspaceSnapshot]);

  useEffect(() => {
    const draftSnapshot = readLocalBuilderDraftSnapshot({
      pageKey: 'home',
      locale,
      fallbackDocument: initialDocument,
      fallbackState: defaultDocumentState,
    });
    const publishedSnapshot = readLocalBuilderPublishedSnapshot({
      pageKey: 'home',
      locale,
      fallbackDocument: initialDocument,
      fallbackState: defaultDocumentState,
    });
    const nextState = draftSnapshot?.state ?? defaultDocumentState;
    const nextDocument = normalizeBuilderDocument(draftSnapshot?.document ?? initialDocument, initialDocument);
    const nextSelection = resolveSelectionForDocument(nextDocument);

    setPageDocument(nextDocument);
    applyDocumentState(nextState);
    setSelection(nextSelection);
    setSelectedSectionIds([nextSelection.sectionId]);
    setLastDraftSavedAt(draftSnapshot?.savedAt ?? null);
    setLastPublishedAt(publishedSnapshot?.savedAt ?? null);
    setDescriptorsBySection({});
    setContentGroupsBySection({});
    setStatsBySection({});
    descriptorsSignatureRef.current = '';
    contentGroupSignatureRef.current = '';
    setRollbackPromotionCandidate(null);
    setReviewedRollbackPromotionKey(null);
    seedWorkspaceHistory(buildWorkspaceSnapshot(nextDocument, nextState, nextSelection, 'Loaded draft'));
    setDraftHydrated(true);
  }, [
    applyDocumentState,
    buildWorkspaceSnapshot,
    defaultDocumentState,
    initialDocument,
    locale,
    seedWorkspaceHistory,
  ]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedViewport = window.localStorage.getItem(getViewportModeStorageKey(locale));
    if (isBuilderViewportMode(storedViewport)) {
      setViewportMode(storedViewport);
      return;
    }
    setViewportMode('desktop');
  }, [locale]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(getViewportModeStorageKey(locale), viewportMode);
  }, [locale, viewportMode]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedZoom = window.localStorage.getItem(getViewportZoomStorageKey(locale));
    if (isBuilderZoomLevel(storedZoom)) {
      setZoomLevel(Number(storedZoom) as BuilderZoomLevel);
      return;
    }
    setZoomLevel(DEFAULT_ZOOM_LEVEL);
  }, [locale]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(getViewportZoomStorageKey(locale), String(zoomLevel));
  }, [locale, zoomLevel]);

  useEffect(() => {
    const node = canvasZoomFrameRef.current;
    if (!node) return;

    const updateMetrics = () => {
      const nextWidth = Math.round(node.offsetWidth);
      const nextHeight = Math.round(node.offsetHeight);
      setCanvasZoomMetrics((current) =>
        current.width === nextWidth && current.height === nextHeight
          ? current
          : { width: nextWidth, height: nextHeight }
      );
    };

    updateMetrics();

    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver(() => updateMetrics());
    observer.observe(node);
    return () => observer.disconnect();
  }, [pageDocument.root.children, viewportMode]);

  const measureCanvasSectionRects = useCallback(() => {
    const frameNode = canvasZoomFrameRef.current;
    if (!frameNode) {
      setSectionCanvasRects((current) => (Object.keys(current).length ? {} : current));
      return;
    }

    const frameRect = frameNode.getBoundingClientRect();
    const nextRects: Record<string, BuilderCanvasSectionRect> = {};

    pageDocument.root.children.forEach((section) => {
      const surfaceNode = surfaceRefs.current[section.id];
      if (!surfaceNode) {
        return;
      }

      const rect = surfaceNode.getBoundingClientRect();
      nextRects[section.id] = {
        sectionId: section.id,
        sectionKey: section.sectionKey,
        top: rect.top - frameRect.top,
        left: rect.left - frameRect.left,
        width: rect.width,
        height: rect.height,
        bottom: rect.bottom - frameRect.top,
      };
    });

    setSectionCanvasRects((current) => (areCanvasSectionRectMapsEqual(current, nextRects) ? current : nextRects));
  }, [pageDocument.root.children]);

  useEffect(() => {
    const frameNode = canvasZoomFrameRef.current;
    if (!frameNode) {
      return;
    }

    let animationFrame = window.requestAnimationFrame(() => {
      measureCanvasSectionRects();
    });

    const observedNodes = pageDocument.root.children
      .map((section) => surfaceRefs.current[section.id])
      .filter((node): node is HTMLDivElement => Boolean(node));

    if (typeof ResizeObserver === 'undefined') {
      return () => {
        window.cancelAnimationFrame(animationFrame);
      };
    }

    const observer = new ResizeObserver(() => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(() => {
        measureCanvasSectionRects();
      });
    });

    observer.observe(frameNode);
    observedNodes.forEach((node) => observer.observe(node));
    window.addEventListener('resize', measureCanvasSectionRects);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      observer.disconnect();
      window.removeEventListener('resize', measureCanvasSectionRects);
    };
  }, [measureCanvasSectionRects, pageDocument.root.children, viewportMode, zoomLevel]);

  const resolveCanvasSectionDropTarget = useCallback(
    (clientX: number, clientY: number, draggedSectionKey: BuilderSectionKey) => {
      if (typeof document === 'undefined') {
        return null;
      }

      const targetElement = document.elementFromPoint(clientX, clientY);
      const targetSurface = targetElement?.closest<HTMLElement>('.builder-preview-surface[data-section-key]');
      const targetSectionKey = targetSurface?.dataset.sectionKey as BuilderSectionKey | undefined;

      if (!targetSurface) {
        return null;
      }

      if (
        !targetSectionKey ||
        !(targetSectionKey in homeSectionRegistry) ||
        targetSectionKey === draggedSectionKey
      ) {
        return null;
      }

      const targetRect = targetSurface.getBoundingClientRect();
      const placement: BuilderSectionDragPlacement =
        clientY < targetRect.top + targetRect.height / 2 ? 'before' : 'after';
      const sourceIndex = pageDocument.root.children.findIndex(
        (section) => section.sectionKey === draggedSectionKey
      );
      const rawTargetIndex = pageDocument.root.children.findIndex(
        (section) => section.sectionKey === targetSectionKey
      );

      if (sourceIndex < 0 || rawTargetIndex < 0) {
        return null;
      }

      const nextTargetIndex = placement === 'before' ? rawTargetIndex : rawTargetIndex + 1;
      const normalizedTargetIndex =
        sourceIndex < nextTargetIndex ? Math.max(0, nextTargetIndex - 1) : nextTargetIndex;
      const moveBlockMessage = getSectionMoveLockBlockMessage(draggedSectionKey, normalizedTargetIndex);
      if (moveBlockMessage) {
        return {
          blocked: true,
          targetSectionKey,
          placement,
          normalizedTargetIndex,
          moveBlockMessage,
        } as const;
      }

      return {
        blocked: false,
        targetSectionKey,
        placement,
        normalizedTargetIndex,
      } as const;
    },
    [getSectionMoveLockBlockMessage, pageDocument.root.children]
  );

  useEffect(() => {
    if (!canvasPointerDragState) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      const nextTop =
        canvasPointerDragState.originTop + (event.clientY - canvasPointerDragState.originClientY);
      const nextTarget = resolveCanvasSectionDropTarget(
        event.clientX,
        event.clientY,
        canvasPointerDragState.draggedSectionKey
      );

      setCanvasPointerDragState((current) =>
        current
          ? {
              ...current,
              previewTop: nextTop,
            }
          : current
      );
      setSectionDragState({
        draggedSectionKey: canvasPointerDragState.draggedSectionKey,
        targetSectionKey: nextTarget?.blocked ? null : nextTarget?.targetSectionKey ?? null,
        placement: nextTarget?.blocked ? null : nextTarget?.placement ?? null,
      });
    };

    const handlePointerUp = (event: PointerEvent) => {
      const nextTarget = resolveCanvasSectionDropTarget(
        event.clientX,
        event.clientY,
        canvasPointerDragState.draggedSectionKey
      );

      if (nextTarget?.blocked && nextTarget.moveBlockMessage) {
        setEditorGuardNotice(nextTarget.moveBlockMessage);
      } else if (nextTarget && !nextTarget.blocked) {
        const targetDefinition = homeSectionRegistry[nextTarget.targetSectionKey];
        const placementLabel =
          nextTarget.placement === 'before'
            ? `Move before ${targetDefinition.title}`
            : `Move after ${targetDefinition.title}`;
        moveSectionToIndex(
          canvasPointerDragState.draggedSectionKey,
          nextTarget.normalizedTargetIndex,
          placementLabel
        );
      }

      setCanvasPointerDragState(null);
      setSectionDragState(null);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [canvasPointerDragState, moveSectionToIndex, resolveCanvasSectionDropTarget]);

  useEffect(() => {
    if (!contentGroupDragState) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      const sectionRect = sectionCanvasRects[contentGroupDragState.sectionId];
      const sectionWidth = sectionRect ? sectionRect.width / Math.max(zoomScale, 0.0001) : null;
      const sectionHeight = sectionRect ? sectionRect.height / Math.max(zoomScale, 0.0001) : null;
      const deltaX = (event.clientX - contentGroupDragState.originClientX) / Math.max(zoomScale, 0.0001);
      const deltaY = (event.clientY - contentGroupDragState.originClientY) / Math.max(zoomScale, 0.0001);

      const nextBounds = clampContentGroupBoundsToSection(
        {
          ...contentGroupDragState.originBounds,
          x: roundSceneBoundsValue(contentGroupDragState.originBounds.x + deltaX),
          y: roundSceneBoundsValue(contentGroupDragState.originBounds.y + deltaY),
        },
        sectionWidth,
        sectionHeight
      );

      setContentGroupDragState((current) =>
        current
          ? {
              ...current,
              previewBounds: nextBounds,
            }
          : current
      );
    };

    const handlePointerUp = () => {
      const nextBounds = contentGroupDragState.previewBounds;
      if (!areSceneBoundsEqual(contentGroupDragState.originBounds, nextBounds)) {
        commitContentGroupBounds(
          contentGroupDragState.sectionKey,
          contentGroupDragState.contentGroupId,
          nextBounds,
          'Move content group'
        );
      }

      setContentGroupDragState(null);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [commitContentGroupBounds, contentGroupDragState, sectionCanvasRects, zoomScale]);

  useEffect(() => {
    if (!contentGroupResizeState) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      const sectionRect = sectionCanvasRects[contentGroupResizeState.sectionId];
      const sectionWidth = sectionRect ? sectionRect.width / Math.max(zoomScale, 0.0001) : null;
      const sectionHeight = sectionRect ? sectionRect.height / Math.max(zoomScale, 0.0001) : null;
      const deltaX = (event.clientX - contentGroupResizeState.originClientX) / Math.max(zoomScale, 0.0001);
      const deltaY = (event.clientY - contentGroupResizeState.originClientY) / Math.max(zoomScale, 0.0001);

      const nextBounds = clampContentGroupResizeBoundsToSection(
        {
          ...contentGroupResizeState.originBounds,
          width: roundSceneBoundsValue(contentGroupResizeState.originBounds.width + deltaX),
          height: roundSceneBoundsValue(contentGroupResizeState.originBounds.height + deltaY),
        },
        sectionWidth,
        sectionHeight
      );

      setContentGroupResizeState((current) =>
        current
          ? {
              ...current,
              previewBounds: nextBounds,
            }
          : current
      );
    };

    const handlePointerUp = () => {
      const nextBounds = contentGroupResizeState.previewBounds;
      if (!areSceneBoundsEqual(contentGroupResizeState.originBounds, nextBounds)) {
        commitContentGroupBounds(
          contentGroupResizeState.sectionKey,
          contentGroupResizeState.contentGroupId,
          nextBounds,
          'Resize content group'
        );
      }

      setContentGroupResizeState(null);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [commitContentGroupBounds, contentGroupResizeState, sectionCanvasRects, zoomScale]);

  useEffect(() => {
    setImageUploadError(null);
    setImageUploadNotice(null);
  }, [selection.sectionId, selection.surfaceId, selection.targetKind]);

  useEffect(() => {
    setEditorGuardNotice(null);
  }, [pageDocument.updatedAt, selection.sectionId, selection.surfaceId, selection.targetKind]);

  useEffect(() => {
    setAssetLibraryItems([]);
    setAssetLibraryError(null);
    setAssetLibraryHydrated(false);
    setPublishedHistoryItems([]);
    setPublishedHistoryError(null);
    setPublishedHistoryHydrated(false);
    setPendingRevisionRestore(null);
    setRollbackPromotionCandidate(null);
    setReviewedRollbackPromotionKey(null);
    setReviewedSharedRollbackKey(null);
  }, [locale]);

  useEffect(() => {
    if (selection.targetKind !== 'section') {
      if (selectedSectionIds.length !== 1 || selectedSectionIds[0] !== selection.sectionId) {
        setSelectedSectionIds([selection.sectionId]);
      }
      return;
    }

    const normalized = normalizeSectionSelectionIds(pageDocument, selectedSectionIds, selection.sectionId);
    if (!areStringListsEqual(normalized, selectedSectionIds)) {
      setSelectedSectionIds(normalized);
    }
  }, [pageDocument, selectedSectionIds, selection.sectionId, selection.targetKind]);

  useEffect(() => {
    if (!selectedSection?.locked || selection.targetKind === 'section') {
      return;
    }

    selectSingleTarget(createSectionSelection(selectedSection.sectionKey, selectedSection.id));
  }, [selectedSection, selectSingleTarget, selection.targetKind]);

  useEffect(() => {
    if (selection.targetKind !== 'image') return;
    if (assetLibraryHydrated) return;
    void loadAssetLibrary();
  }, [assetLibraryHydrated, loadAssetLibrary, selection.targetKind]);

  useEffect(() => {
    void refreshServerState();
  }, [refreshServerState]);

  useEffect(() => {
    void loadPublishedHistory();
  }, [loadPublishedHistory]);

  useEffect(() => {
    if (!draftHydrated) return;
    if (skipNextPersistRef.current) {
      skipNextPersistRef.current = false;
      return;
    }

    const snapshot = writeLocalBuilderDraftSnapshot({
      pageKey: 'home',
      locale,
      document: pageDocument,
      state: currentDocumentState,
    });
    setLastDraftSavedAt(snapshot.savedAt);
  }, [currentDocumentState, draftHydrated, locale, pageDocument]);

  useEffect(() => {
    if (!draftHydrated) return;
    setServerValidationPassed(false);
  }, [currentDocumentState, draftHydrated, pageDocument]);

  useEffect(() => {
    if (!draftHydrated) return;
    setReviewedConflictKey(null);
    setPendingRevisionRestore(null);
    setReviewedRollbackPromotionKey(null);
    setReviewedSharedRollbackKey(null);
  }, [currentDocumentState, draftHydrated, pageDocument]);

  useEffect(() => {
    const nextDescriptorsBySection = Object.fromEntries(
      pageDocument.root.children.map((section) => {
        const surface = surfaceRefs.current[section.id];
        return [section.id, annotateSurfaceTargets(surface, section.id, section.sectionKey)];
      })
    ) as Record<string, SurfaceDescriptor[]>;
    const nextContentGroupsBySection = Object.fromEntries(
      pageDocument.root.children.map((section) => {
        const surface = surfaceRefs.current[section.id];
        return [section.id, annotateContentGroupTargets(surface, section.id, section.sectionKey)];
      })
    ) as Record<string, BuilderContentGroupDescriptor[]>;

    const nextStatsBySection = Object.fromEntries(
      Object.entries(nextDescriptorsBySection).map(([sectionId, descriptors]) => [
        sectionId,
        descriptors.reduce<SectionStats>(
          (stats, descriptor) => {
            stats[descriptor.kind] += 1;
            return stats;
          },
          { ...EMPTY_STATS }
        ),
      ])
    ) as Record<string, SectionStats>;

    const signature = JSON.stringify(nextDescriptorsBySection);
    if (signature !== descriptorsSignatureRef.current) {
      descriptorsSignatureRef.current = signature;
      setDescriptorsBySection(nextDescriptorsBySection);
      setStatsBySection(nextStatsBySection);
    }
    const nextContentGroupSignature = JSON.stringify(nextContentGroupsBySection);
    if (nextContentGroupSignature !== contentGroupSignatureRef.current) {
      contentGroupSignatureRef.current = nextContentGroupSignature;
      setContentGroupsBySection(nextContentGroupsBySection);
    }

    applyOverridesToSurfaces(surfaceRefs.current, nextDescriptorsBySection, overrides);
    syncSelectedSurface(surfaceRefs.current, selection);
  }, [faqDraftItems, overrides, pageDocument.root.children, selection, serviceItems]);

  useEffect(() => {
    const nextRects: Record<string, BuilderCanvasContentGroupRect> = {};
    let nextDocument = pageDocument;
    let documentChanged = false;

    for (const section of pageDocument.root.children) {
      const surface = surfaceRefs.current[section.id];
      const sectionRect = sectionCanvasRects[section.id];
      const contentGroups = contentGroupsBySection[section.id] ?? [];

      if (!surface || !sectionRect || !contentGroups.length) {
        continue;
      }

      for (const group of contentGroups) {
        const groupElement = surface.querySelector<HTMLElement>(
          `[data-builder-content-group-id="${group.contentGroupId}"]`
        );
        if (!groupElement) {
          continue;
        }

        const measuredBounds = measureContentGroupBounds(surface, groupElement, 1);
        const persistedBounds = measureContentGroupBounds(surface, groupElement, zoomScale);
        nextRects[group.contentGroupId] = {
          ...measuredBounds,
          sectionId: section.id,
          sectionKey: section.sectionKey,
          contentGroupId: group.contentGroupId,
          groupKey: group.groupKey,
          label: group.label,
        };

        const persistedSource = getPersistedContentGroupSource(
          nextDocument,
          section.sectionKey,
          group.contentGroupId
        );
        const storedMeasuredBounds = getMeasuredContentGroupBounds(
          nextDocument,
          section,
          group.contentGroupId,
          viewportMode
        );
        if (
          contentGroupDragState?.contentGroupId === group.contentGroupId ||
          contentGroupResizeState?.contentGroupId === group.contentGroupId ||
          persistedSource === 'page-scene'
        ) {
          continue;
        }
        if (!areSceneBoundsEqual(storedMeasuredBounds, persistedBounds)) {
          nextDocument = syncBuilderDocumentSectionContentGroupMeasuredBounds(
            nextDocument,
            section.sectionKey,
            group.contentGroupId,
            persistedBounds,
            viewportMode
          );
          documentChanged = true;
        }
      }
    }

    if (!areCanvasContentGroupRectMapsEqual(contentGroupRects, nextRects)) {
      setContentGroupRects(nextRects);
    }

    if (documentChanged) {
      setPageDocument(nextDocument);
    }
  }, [
    contentGroupDragState?.contentGroupId,
    contentGroupResizeState?.contentGroupId,
    contentGroupRects,
    contentGroupsBySection,
    pageDocument,
    sectionCanvasRects,
    viewportMode,
    zoomScale,
  ]);

  useLayoutEffect(() => {
    for (const section of pageDocument.root.children) {
      const surface = surfaceRefs.current[section.id];
      const contentGroups = contentGroupsBySection[section.id] ?? [];

      if (!surface || !contentGroups.length) {
        continue;
      }

      for (const group of contentGroups) {
        const groupElement = surface.querySelector<HTMLElement>(
          `[data-builder-content-group-id="${group.contentGroupId}"]`
        );
        if (!groupElement) {
          continue;
        }

        const displayBounds =
          contentGroupDragState?.contentGroupId === group.contentGroupId
            ? contentGroupDragState.previewBounds
            : contentGroupResizeState?.contentGroupId === group.contentGroupId
              ? contentGroupResizeState.previewBounds
              : getDisplayContentGroupBounds(pageDocument, section, group.contentGroupId, viewportMode);

        if (!displayBounds) {
          groupElement.style.translate = '';
          groupElement.style.width = '';
          groupElement.style.height = '';
          delete groupElement.dataset.builderSceneOriginX;
          delete groupElement.dataset.builderSceneOriginY;
          continue;
        }

        const measuredBounds = getMeasuredContentGroupBounds(
          pageDocument,
          section,
          group.contentGroupId,
          viewportMode
        );
        const originBounds =
          measuredBounds ??
          (() => {
            const measuredOrigin = measureContentGroupBounds(surface, groupElement, zoomScale);
            groupElement.dataset.builderSceneOriginX = String(measuredOrigin.x);
            groupElement.dataset.builderSceneOriginY = String(measuredOrigin.y);
            return measuredOrigin;
          })();
        const originX = originBounds.x;
        const originY = originBounds.y;

        const deltaX = roundSceneBoundsValue(displayBounds.x - originX);
        const deltaY = roundSceneBoundsValue(displayBounds.y - originY);
        groupElement.style.translate = `${deltaX}px ${deltaY}px`;
        groupElement.style.width = `${displayBounds.width}px`;
        groupElement.style.height = `${displayBounds.height}px`;
      }
    }
  }, [contentGroupDragState, contentGroupResizeState, contentGroupsBySection, pageDocument, viewportMode, zoomScale]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!draftHydrated) return;

      const modKey = event.metaKey || event.ctrlKey;
      const key = event.key.toLowerCase();
      const target = event.target;
      const typingContext = isTypingTarget(target);

      if (modKey && key === 's') {
        event.preventDefault();
        void saveServerDraft();
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        if (target instanceof HTMLElement && target.blur) {
          target.blur();
        }
        selectSingleTarget(createSectionSelection(selection.sectionKey, selection.sectionId));
        return;
      }

      if (typingContext) return;

      if (modKey && key === 'a') {
        event.preventDefault();
        selectAllSections();
        return;
      }

      if (modKey && key === 'c') {
        event.preventDefault();
        copySelectedSectionFrame();
        return;
      }

      if (modKey && key === 'v') {
        event.preventDefault();
        pasteSelectedSectionFrame();
        return;
      }

      if (modKey && !event.shiftKey && key === 'z') {
        event.preventDefault();
        undoWorkspaceChange();
        return;
      }

      if (modKey && event.shiftKey && key === 'z') {
        event.preventDefault();
        redoWorkspaceChange();
        return;
      }

      if (modKey && (event.key === '=' || event.key === '+')) {
        event.preventDefault();
        adjustZoomLevel('in');
        return;
      }

      if (modKey && (event.key === '-' || event.key === '_')) {
        event.preventDefault();
        adjustZoomLevel('out');
        return;
      }

      if (modKey && key === '0') {
        event.preventDefault();
        resetZoomLevel();
        return;
      }

      if (selection.targetKind === 'group' && selection.contentGroupId) {
        const nudgeAmount = event.shiftKey ? 10 : 1;
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          nudgeSelectedContentGroup(-nudgeAmount, 0);
          return;
        }
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          nudgeSelectedContentGroup(nudgeAmount, 0);
          return;
        }
        if (event.key === 'ArrowUp') {
          event.preventDefault();
          nudgeSelectedContentGroup(0, -nudgeAmount);
          return;
        }
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          nudgeSelectedContentGroup(0, nudgeAmount);
          return;
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    adjustZoomLevel,
    copySelectedSectionFrame,
    draftHydrated,
    pasteSelectedSectionFrame,
    redoWorkspaceChange,
    resetZoomLevel,
    saveServerDraft,
    selectAllSections,
    selectSingleTarget,
    selection.contentGroupId,
    selection.sectionId,
    selection.sectionKey,
    selection.targetKind,
    nudgeSelectedContentGroup,
    undoWorkspaceChange,
  ]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code !== 'Space' || isTypingTarget(event.target)) {
        return;
      }
      event.preventDefault();
      setIsSpacePressed(true);
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code !== 'Space') {
        return;
      }
      setIsSpacePressed(false);
    };

    const onWindowBlur = () => {
      setIsSpacePressed(false);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onWindowBlur);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onWindowBlur);
    };
  }, []);

  useEffect(() => {
    if (!canvasPanState) {
      return undefined;
    }

    const activePanState = canvasPanState;

    const onPointerMove = (event: PointerEvent) => {
      const viewport = canvasViewportRef.current;
      if (!viewport) {
        return;
      }

      const deltaX = event.clientX - activePanState.originClientX;
      const deltaY = event.clientY - activePanState.originClientY;
      viewport.scrollLeft = activePanState.startScrollLeft - deltaX;
      viewport.scrollTop = activePanState.startScrollTop - deltaY;
    };

    const onPointerUp = (event: PointerEvent) => {
      if (event.pointerId !== activePanState.pointerId) {
        return;
      }
      setCanvasPanState(null);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [canvasPanState]);

  const standaloneWorkspaceStatus = (
    <>
      <span className="builder-preview-status-chip builder-preview-status-chip--primary">
        Local recovery {draftHydrated ? (lastDraftSavedAt ? 'saved' : 'empty') : 'loading'}
      </span>
      <span className="builder-preview-status-chip">
        Shared draft {serverDraftMeta.persisted ? `v${serverDraftMeta.revision}` : 'empty'}
      </span>
      <span className="builder-preview-status-chip">
        Shared published {serverPublishedMeta.persisted ? `v${serverPublishedMeta.revision}` : 'empty'}
      </span>
      <span className="builder-preview-status-chip">
        Selection {selectedTargetSummaryLabel}
      </span>
      <span className="builder-preview-status-chip">{selection.sectionKey}</span>
      <span className="builder-preview-status-chip">{selectedSurfaceContract.label}</span>
      {hasMultiSectionSelection ? (
        <span className="builder-preview-status-chip">Sections {selectedSections.length}</span>
      ) : null}
      {clipboardPayload ? (
        <span className="builder-preview-status-chip">
          Clipboard {formatSectionFrameClipboardSummary(clipboardPayload)}
        </span>
      ) : null}
    </>
  );

  const standaloneRuntimeStatus = (
    <>
      <span className="builder-preview-status-chip">
        History {historyMeta.length ? `${historyMeta.cursor + 1}/${historyMeta.length}` : '0/0'}
      </span>
      <span className="builder-preview-status-chip">
        Server {serverStorage ? `${serverStorage} store` : 'sync pending'}
      </span>
      <span className="builder-preview-status-chip">Viewport {getViewportLabel(viewportMode)}</span>
      <span
        className={`builder-preview-status-chip${
          zoomTooLowForPrecision ? ' builder-preview-status-chip--danger' : ''
        }`}
      >
        Zoom {zoomLevel}%
      </span>
      <span className="builder-preview-status-chip">{historyMeta.label ?? 'No workspace changes yet'}</span>
    </>
  );

  const embeddedToolbarStatus = (
    <>
      <span className="builder-preview-status-chip">
        Draft {serverDraftMeta.persisted ? `v${serverDraftMeta.revision}` : 'empty'}
      </span>
      <span
        className={`builder-preview-status-chip${
          publishingReadiness.status === 'blocked'
            ? ' builder-preview-status-chip--danger'
            : publishingReadiness.status === 'ready'
              ? ' builder-preview-status-chip--success'
              : ''
        }`}
      >
        {publishingReadiness.status === 'blocked'
          ? 'Publish blocked'
          : publishingReadiness.status === 'ready'
            ? 'Publish ready'
            : 'Checks needed'}
      </span>
      <span className="builder-preview-status-chip">{historyMeta.label ?? 'No workspace changes yet'}</span>
    </>
  );
  const embeddedSelectionStatus = (
    <>
      <span className="builder-preview-status-chip builder-preview-status-chip--primary">
        Selection {selectedTargetSummaryLabel}
      </span>
      <span className="builder-preview-status-chip">{selection.sectionKey}</span>
      <span className="builder-preview-status-chip">{selectedSurfaceContract.label}</span>
      {selectedSceneEntryLabel ? (
        <span className="builder-preview-status-chip">{selectedSceneEntryLabel}</span>
      ) : null}
      {hasMultiSectionSelection ? (
        <span className="builder-preview-status-chip">Sections {selectedSections.length}</span>
      ) : null}
      {selectionIncludesLockedSection ? (
        <span className="builder-preview-status-chip builder-preview-status-chip--danger">
          Locked {selectedLockedSectionCount}
        </span>
      ) : null}
      <span className="builder-preview-status-chip">Scene {browserSceneSummary.sceneNodeCount}</span>
      <span className="builder-preview-status-chip">
        Authority {browserSceneSummary.sceneAuthorityNodeCount}
      </span>
      <span className="builder-preview-status-chip builder-preview-status-chip--warning">
        Publish truth: section snapshot
      </span>
    </>
  );

  const embeddedPublishingAction =
    publishingReadiness.status === 'ready' ? (
      <button
        type="button"
        className="builder-action-btn builder-action-btn--primary"
        onClick={() => {
          void publishServerSnapshot();
        }}
        disabled={serverPending || !draftHydrated}
      >
        Publish
      </button>
    ) : publishingReadiness.status === 'needs-review' ? (
      <button
        type="button"
        className="builder-action-btn"
        onClick={() => {
          void runPublishChecks();
        }}
        disabled={serverPending || !draftHydrated}
      >
        Run checks
      </button>
    ) : serverConflict ? (
      <button
        type="button"
        className="builder-action-btn"
        onClick={() => {
          if (serverConflict.kind === 'draft') {
            void loadServerDraft();
            return;
          }
          void loadServerPublished();
        }}
        disabled={serverPending}
      >
        Review shared
      </button>
    ) : serverValidationIssues?.length ? (
      <button
        type="button"
        className="builder-action-btn"
        onClick={() => {
          if (serverValidationIssues[0]) {
            focusValidationIssue(serverValidationIssues[0]);
          }
        }}
        disabled={serverPending}
      >
        Review blockers
      </button>
    ) : (
      <button
        type="button"
        className="builder-action-btn"
        onClick={() => {
          void refreshServerState();
        }}
        disabled={serverPending}
      >
        Refresh shared
      </button>
    );

  const sharedRuntimeControls = (
    <>
      <div className="builder-preview-viewport-switch" role="group" aria-label="Preview viewport">
        {VIEWPORT_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`builder-preview-viewport-btn${viewportMode === option.value ? ' is-active' : ''}`}
            onClick={() => setViewportMode(option.value)}
            aria-pressed={viewportMode === option.value}
          >
            <span>{option.label}</span>
            <small>{option.hint}</small>
          </button>
        ))}
      </div>
      <div className="builder-preview-zoom-controls" role="group" aria-label="Preview zoom">
        <button
          type="button"
          className="builder-preview-zoom-btn"
          onClick={() => adjustZoomLevel('out')}
          disabled={!canZoomOut}
        >
          -
        </button>
        <div className="builder-preview-zoom-copy">
          <strong>{zoomLevel}%</strong>
          <small>Alt+wheel · Space+drag · Fit</small>
        </div>
        <input
          className="builder-preview-zoom-slider"
          type="range"
          min={0}
          max={ZOOM_OPTIONS.length - 1}
          step={1}
          value={zoomOptionIndex}
          onChange={(event) => {
            const nextOption = ZOOM_OPTIONS[Number(event.target.value)] ?? DEFAULT_ZOOM_LEVEL;
            setExactZoomLevel(nextOption);
          }}
          aria-label="Canvas zoom preset"
        />
        <button
          type="button"
          className="builder-preview-zoom-btn"
          onClick={() => adjustZoomLevel('in')}
          disabled={!canZoomIn}
        >
          +
        </button>
        <button
          type="button"
          className="builder-action-btn"
          onClick={resetZoomLevel}
          disabled={zoomLevel === DEFAULT_ZOOM_LEVEL}
        >
          100%
        </button>
        <button type="button" className="builder-action-btn" onClick={fitCanvasZoomLevel}>
          Fit
        </button>
      </div>
      <button
        type="button"
        className="builder-action-btn"
        onClick={undoWorkspaceChange}
        disabled={!historyMeta.canUndo}
      >
        Undo
      </button>
      <button
        type="button"
        className="builder-action-btn"
        onClick={redoWorkspaceChange}
        disabled={!historyMeta.canRedo}
      >
        Redo
      </button>
      <button
        type="button"
        className="builder-action-btn builder-action-btn--primary"
        onClick={() => {
          void saveServerDraft(
            rollbackPromotionCandidate ? { allowRollbackPromotion: true } : undefined
          );
        }}
        disabled={
          !draftHydrated ||
          serverPending ||
          serverConflict?.kind === 'draft' ||
          (Boolean(rollbackPromotionCandidate) &&
            serverDraftMeta.persisted &&
            !canPromoteRollbackRecovery)
        }
      >
        {rollbackPromotionCandidate ? 'Promote recovery to shared draft' : 'Save to shared draft'}
      </button>
      <Link href={publicPageHref} className="builder-action-btn">
        Open public page
      </Link>
      {embeddedPublishingAction}
    </>
  );

  return (
    <div
      className={`builder-preview-shell${
        presentation === 'embedded' ? ' builder-preview-shell--embedded' : ''
      }`}
    >
      <section
        className={`section section--light builder-preview-hero${
          presentation === 'embedded' ? ' builder-preview-hero--embedded' : ''
        }`}
        data-tone="light"
      >
        <div className="container">
          {presentation === 'standalone' ? (
            <>
              <div className="section-label">BUILDER INTERACTIVE PREVIEW</div>
              <h1 className="section-title">Home Editability Closure</h1>
              <p className="section-lede">
                현재 공개 홈을 builder 문서 기준으로 다시 그리고, content edit, shared draft/publish,
                viewport preview, section layout control을 한 흐름으로 묶습니다.
              </p>
            </>
          ) : (
            <div className="builder-preview-embedded-heading">
              <span className="builder-stage-pill builder-stage-pill--accent">Home interactive runtime</span>
              <span className="builder-stage-pill">Shared shell mounted</span>
              <span className="builder-stage-pill">No fake edit tabs</span>
            </div>
          )}

          {presentation === 'standalone' ? (
            <div className="builder-preview-workspace-bar">
              <div className="builder-preview-workspace-bar-group">{standaloneWorkspaceStatus}</div>
              <div className="builder-preview-workspace-bar-group">
                {standaloneRuntimeStatus}
                {sharedRuntimeControls}
              </div>
            </div>
          ) : null}

          {presentation === 'embedded' ? (
            <BuilderAdvancedDisclosure
              className="builder-preview-structure-disclosure"
              title="Structure controls"
              summary="Section order, visibility, and lock state stay available here without competing with the stage."
            >
              <div className="builder-preview-section-grid">
                {pageDocument.root.children.map((section, index) => {
                  const definition = homeSectionRegistry[section.sectionKey];
                  const stats = statsBySection[section.id];
                  const selected = normalizedSelectedSectionIds.includes(section.id);
                  const active = section.id === selection.sectionId;
                  const hidden = resolveBuilderSectionHidden(section, viewportMode);
                  const visibilityState = describeViewportVisibilityState(section, viewportMode);
                  const locked = Boolean(section.locked);
                  const layout = resolveBuilderSectionLayout(section, viewportMode);
                  const isDragging = sectionDragState?.draggedSectionKey === section.sectionKey;
                  const isDropBefore =
                    sectionDragState?.draggedSectionKey !== section.sectionKey &&
                    sectionDragState?.targetSectionKey === section.sectionKey &&
                    sectionDragState?.placement === 'before';
                  const isDropAfter =
                    sectionDragState?.draggedSectionKey !== section.sectionKey &&
                    sectionDragState?.targetSectionKey === section.sectionKey &&
                    sectionDragState?.placement === 'after';

                  return (
                    <article
                      key={section.id}
                      className={`builder-preview-section-card${selected ? ' is-selected' : ''}${active ? ' is-active' : ''}${hidden ? ' is-hidden' : ''}${locked ? ' is-locked' : ''}${isDragging ? ' is-dragging' : ''}${isDropBefore ? ' is-drop-before' : ''}${isDropAfter ? ' is-drop-after' : ''}`}
                      draggable={!locked && !canvasPointerDragState}
                      onDragStart={() => handleSectionDragStart(section.sectionKey)}
                      onDragOver={(event) => handleSectionDragOver(event, section.sectionKey)}
                      onDrop={() => handleSectionDrop(section.sectionKey)}
                      onDragEnd={clearSectionDragState}
                    >
                      <button
                        type="button"
                        className="builder-preview-section-card-main"
                        aria-pressed={selected}
                        onClick={(event) =>
                          handleSectionSelectionIntent(section.sectionKey, section.id, {
                            extend: isMultiSelectModifier(event),
                          })
                        }
                      >
                        <div className="builder-preview-section-card-key">
                          {String(index + 1).padStart(2, '0')} · {section.sectionKey}
                        </div>
                        <div className="builder-preview-section-card-title">
                          {definition.title}
                          <div className="builder-preview-section-card-badges">
                            {locked ? (
                              <span className="builder-preview-section-card-badge is-locked">locked</span>
                            ) : null}
                            <span className={`builder-preview-section-card-badge${hidden ? ' is-hidden' : ''}`}>
                              {visibilityState.badge}
                            </span>
                          </div>
                        </div>
                        {selected && hasMultiSectionSelection ? (
                          <div className="builder-preview-section-card-selection">included in batch selection</div>
                        ) : null}
                        <div className="builder-preview-section-card-component">{definition.componentName}</div>
                        <div className="builder-preview-section-card-targets">
                          {definition.supportedTargets.join(' / ')}
                        </div>
                        <div className="builder-preview-section-card-layout">
                          {formatSectionLayoutSummary(layout)}
                        </div>
                        {stats ? (
                          <div className="builder-preview-section-card-stats">
                            {stats.text} text · {stats.button} button · {stats.image} image
                          </div>
                        ) : null}
                      </button>

                      <div className="builder-preview-section-card-actions">
                        <button
                          type="button"
                          className="builder-action-btn"
                          onClick={() => moveSection(section.sectionKey, -1)}
                          disabled={index === 0 || Boolean(getSectionMoveLockBlockMessage(section.sectionKey, index - 1))}
                        >
                          Up
                        </button>
                        <button
                          type="button"
                          className="builder-action-btn"
                          onClick={() => moveSection(section.sectionKey, 1)}
                          disabled={
                            index === pageDocument.root.children.length - 1 ||
                            Boolean(getSectionMoveLockBlockMessage(section.sectionKey, index + 1))
                          }
                        >
                          Down
                        </button>
                        <button
                          type="button"
                          className="builder-action-btn"
                          onClick={() => toggleSectionVisibility(section.sectionKey)}
                          disabled={locked}
                        >
                          {hidden ? 'Show' : getVisibilityActionVerb(viewportMode, false)}
                        </button>
                        <button
                          type="button"
                          className="builder-action-btn"
                          onClick={() => toggleSectionLock(section.sectionKey)}
                        >
                          {locked ? 'Unlock' : 'Lock'}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </BuilderAdvancedDisclosure>
          ) : (
            <div className="builder-preview-section-grid">
              {pageDocument.root.children.map((section, index) => {
                const definition = homeSectionRegistry[section.sectionKey];
                const stats = statsBySection[section.id];
                const selected = normalizedSelectedSectionIds.includes(section.id);
                const active = section.id === selection.sectionId;
                const hidden = resolveBuilderSectionHidden(section, viewportMode);
                const visibilityState = describeViewportVisibilityState(section, viewportMode);
                const locked = Boolean(section.locked);
                const layout = resolveBuilderSectionLayout(section, viewportMode);
                const isDragging = sectionDragState?.draggedSectionKey === section.sectionKey;
                const isDropBefore =
                  sectionDragState?.draggedSectionKey !== section.sectionKey &&
                  sectionDragState?.targetSectionKey === section.sectionKey &&
                  sectionDragState?.placement === 'before';
                const isDropAfter =
                  sectionDragState?.draggedSectionKey !== section.sectionKey &&
                  sectionDragState?.targetSectionKey === section.sectionKey &&
                  sectionDragState?.placement === 'after';

                return (
                  <article
                    key={section.id}
                    className={`builder-preview-section-card${selected ? ' is-selected' : ''}${active ? ' is-active' : ''}${hidden ? ' is-hidden' : ''}${locked ? ' is-locked' : ''}${isDragging ? ' is-dragging' : ''}${isDropBefore ? ' is-drop-before' : ''}${isDropAfter ? ' is-drop-after' : ''}`}
                    draggable={!locked && !canvasPointerDragState}
                    onDragStart={() => handleSectionDragStart(section.sectionKey)}
                    onDragOver={(event) => handleSectionDragOver(event, section.sectionKey)}
                    onDrop={() => handleSectionDrop(section.sectionKey)}
                    onDragEnd={clearSectionDragState}
                  >
                    <button
                      type="button"
                      className="builder-preview-section-card-main"
                      aria-pressed={selected}
                      onClick={(event) =>
                        handleSectionSelectionIntent(section.sectionKey, section.id, {
                          extend: isMultiSelectModifier(event),
                        })
                      }
                    >
                      <div className="builder-preview-section-card-key">
                        {String(index + 1).padStart(2, '0')} · {section.sectionKey}
                      </div>
                      <div className="builder-preview-section-card-title">
                        {definition.title}
                        <div className="builder-preview-section-card-badges">
                          {locked ? (
                            <span className="builder-preview-section-card-badge is-locked">locked</span>
                          ) : null}
                          <span className={`builder-preview-section-card-badge${hidden ? ' is-hidden' : ''}`}>
                            {visibilityState.badge}
                          </span>
                        </div>
                      </div>
                      {selected && hasMultiSectionSelection ? (
                        <div className="builder-preview-section-card-selection">included in batch selection</div>
                      ) : null}
                      <div className="builder-preview-section-card-component">{definition.componentName}</div>
                      <div className="builder-preview-section-card-targets">
                        {definition.supportedTargets.join(' / ')}
                      </div>
                      <div className="builder-preview-section-card-layout">
                        {formatSectionLayoutSummary(layout)}
                      </div>
                      {stats ? (
                        <div className="builder-preview-section-card-stats">
                          {stats.text} text · {stats.button} button · {stats.image} image
                        </div>
                      ) : null}
                    </button>

                    <div className="builder-preview-section-card-actions">
                      <button
                        type="button"
                        className="builder-action-btn"
                        onClick={() => moveSection(section.sectionKey, -1)}
                        disabled={index === 0 || Boolean(getSectionMoveLockBlockMessage(section.sectionKey, index - 1))}
                      >
                        Up
                      </button>
                      <button
                        type="button"
                        className="builder-action-btn"
                        onClick={() => moveSection(section.sectionKey, 1)}
                        disabled={
                          index === pageDocument.root.children.length - 1 ||
                          Boolean(getSectionMoveLockBlockMessage(section.sectionKey, index + 1))
                        }
                      >
                        Down
                      </button>
                      <button
                        type="button"
                        className="builder-action-btn"
                        onClick={() => toggleSectionVisibility(section.sectionKey)}
                        disabled={locked}
                      >
                        {hidden ? 'Show' : getVisibilityActionVerb(viewportMode, false)}
                      </button>
                      <button
                        type="button"
                        className="builder-action-btn"
                        onClick={() => toggleSectionLock(section.sectionKey)}
                      >
                        {locked ? 'Unlock' : 'Lock'}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <div className="builder-preview-workspace">
        <div className="builder-preview-canvas">
          {presentation === 'embedded' ? (
            <div className="builder-preview-canvas-toolbar">
              <div className="builder-preview-canvas-toolbar-group builder-preview-canvas-toolbar-group--selection">
                {embeddedSelectionStatus}
              </div>
              <div className="builder-preview-canvas-toolbar-group builder-preview-canvas-toolbar-group--status">
                {embeddedToolbarStatus}
              </div>
              <div className="builder-preview-canvas-toolbar-group builder-preview-canvas-toolbar-group--controls">
                {sharedRuntimeControls}
              </div>
            </div>
          ) : null}
          <div className="builder-preview-canvas-note">
            <strong>{zoomLevel}% zoom</strong>
            <span>
              {zoomTooLowForPrecision
                ? `Direct width, spacing, and inset scaffolds stay hidden below ${MIN_PRECISE_ZOOM_LEVEL}% so the canvas does not fake precise geometry.`
                : 'Option/Alt + wheel or Cmd/Ctrl + +/- adjusts zoom. Hold Space and drag to pan. Cmd/Ctrl + 0 resets to 100%.'}
            </span>
          </div>
          <div
            ref={canvasViewportRef}
            className={`builder-preview-canvas-viewport${
              isSpacePressed && !canvasPointerDragState ? ' is-pannable' : ''
            }${canvasPanState ? ' is-panning' : ''}`}
            onPointerDownCapture={(event) => {
              if (canvasPointerDragState) {
                return;
              }

              const shouldPan =
                event.button === 1 || (event.button === 0 && isSpacePressed && !isTypingTarget(event.target));
              if (!shouldPan) {
                return;
              }

              event.preventDefault();
              event.stopPropagation();
              setCanvasPanState({
                pointerId: event.pointerId,
                originClientX: event.clientX,
                originClientY: event.clientY,
                startScrollLeft: event.currentTarget.scrollLeft,
                startScrollTop: event.currentTarget.scrollTop,
              });
            }}
            onWheel={(event: ReactWheelEvent<HTMLDivElement>) => {
              if (!event.altKey) {
                return;
              }

              event.preventDefault();
              if (event.deltaY < 0) {
                adjustZoomLevel('in');
                return;
              }
              if (event.deltaY > 0) {
                adjustZoomLevel('out');
              }
            }}
          >
            <div className="builder-preview-canvas-zoom-stage" style={canvasZoomStageStyle}>
              <div className="builder-preview-canvas-zoom-shell" style={canvasZoomShellStyle}>
                <div
                  ref={canvasZoomFrameRef}
                  className={`builder-preview-canvas-frame builder-preview-canvas-frame--${viewportMode}`}
                >
                  {pageDocument.root.children.map((section) => {
              const definition = homeSectionRegistry[section.sectionKey];
              const selected = normalizedSelectedSectionIds.includes(section.id);
              const active = section.id === selection.sectionId;
              const showDeadZone = active && selection.targetKind === 'unknown';
              const hidden = resolveBuilderSectionHidden(section, viewportMode);
              const visibilityState = describeViewportVisibilityState(section, viewportMode);
              const locked = Boolean(section.locked);
              const isDragging = sectionDragState?.draggedSectionKey === section.sectionKey;
              const isDropBefore =
                sectionDragState?.draggedSectionKey !== section.sectionKey &&
                sectionDragState?.targetSectionKey === section.sectionKey &&
                sectionDragState?.placement === 'before';
              const isDropAfter =
                sectionDragState?.draggedSectionKey !== section.sectionKey &&
                sectionDragState?.targetSectionKey === section.sectionKey &&
                sectionDragState?.placement === 'after';
              const canTightenTopSpacing =
                getNextSectionSpacingPreset(selectedSectionLayout.spacingTop, 'tighter') !==
                selectedSectionLayout.spacingTop;
              const canLoosenTopSpacing =
                getNextSectionSpacingPreset(selectedSectionLayout.spacingTop, 'looser') !==
                selectedSectionLayout.spacingTop;
              const canTightenBottomSpacing =
                getNextSectionSpacingPreset(selectedSectionLayout.spacingBottom, 'tighter') !==
                selectedSectionLayout.spacingBottom;
              const canLoosenBottomSpacing =
                getNextSectionSpacingPreset(selectedSectionLayout.spacingBottom, 'looser') !==
                selectedSectionLayout.spacingBottom;
              const canTightenInlineInset =
                getNextSectionSpacingPreset(selectedSectionLayout.paddingInline, 'tighter') !==
                selectedSectionLayout.paddingInline;
              const canLoosenInlineInset =
                getNextSectionSpacingPreset(selectedSectionLayout.paddingInline, 'looser') !==
                selectedSectionLayout.paddingInline;
              const canTightenBlockInset =
                getNextSectionSpacingPreset(selectedSectionLayout.paddingBlock, 'tighter') !==
                selectedSectionLayout.paddingBlock;
              const canLoosenBlockInset =
                getNextSectionSpacingPreset(selectedSectionLayout.paddingBlock, 'looser') !==
                selectedSectionLayout.paddingBlock;

              return (
                <div
                  key={section.id}
                  ref={(node) => {
                    surfaceRefs.current[section.id] = node;
                  }}
                  className={`builder-preview-surface${selected ? ' is-selected' : ''}${active ? ' is-active' : ''}${showDeadZone ? ' is-dead-zone' : ''}${hidden ? ' is-hidden' : ''}${locked ? ' is-locked' : ''}${isDragging ? ' is-dragging' : ''}${isDropBefore ? ' is-drop-before' : ''}${isDropAfter ? ' is-drop-after' : ''}`}
                  data-section-key={section.sectionKey}
                  onDragOver={(event) => handleSectionDragOver(event, section.sectionKey)}
                  onDrop={() => handleSectionDrop(section.sectionKey)}
                  onDragEnd={clearSectionDragState}
                  onClickCapture={(event) => {
                    if (hidden || locked) {
                      handleSectionSelectionIntent(section.sectionKey, section.id, {
                        extend: isMultiSelectModifier(event),
                      });
                      return;
                    }

                    handleSurfaceClick({
                      event,
                      sectionId: section.id,
                      sectionKey: section.sectionKey,
                      definition,
                      onSelect: selectSingleTarget,
                    });
                  }}
                >
                  <button
                    type="button"
                    className={`builder-preview-surface-pill${locked ? ' is-locked' : ''}`}
                    draggable={!locked && !canvasPointerDragState}
                    onDragStart={(event) => {
                      event.stopPropagation();
                      handleSectionDragStart(section.sectionKey);
                    }}
                    onDragEnd={(event) => {
                      event.stopPropagation();
                      clearSectionDragState();
                    }}
                    onClick={(event) => {
                      event.stopPropagation();
                      handleSectionSelectionIntent(section.sectionKey, section.id, {
                        extend: isMultiSelectModifier(event),
                      });
                    }}
                  >
                    {definition.title}
                  </button>
                  {active &&
                  selection.targetKind === 'section' &&
                  !selectionIncludesLockedSection &&
                  canShowDirectManipulationScaffolds ? (
                    <div className="builder-preview-resize-scaffold" onClick={(event) => event.stopPropagation()}>
                      <button
                        type="button"
                        className="builder-preview-resize-handle builder-preview-resize-handle--left"
                        onClick={() => resizeSelectedSections('narrower')}
                        aria-label={
                          hasMultiSectionSelection
                            ? `Make ${selectedSections.length} selected sections narrower`
                            : 'Make section narrower'
                        }
                      >
                        Narrower
                      </button>
                      <div className="builder-preview-resize-label">
                        <strong>{selectedSectionLayout.width}</strong>
                        <span>
                          {hasMultiSectionSelection
                            ? `applies to ${selectedSections.length} selected sections`
                            : 'section width preset'}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="builder-preview-resize-handle builder-preview-resize-handle--right"
                        onClick={() => resizeSelectedSections('wider')}
                        aria-label={
                          hasMultiSectionSelection
                            ? `Make ${selectedSections.length} selected sections wider`
                            : 'Make section wider'
                        }
                      >
                        Wider
                      </button>
                    </div>
                  ) : null}
                  {active &&
                  selection.targetKind === 'section' &&
                  !selectionIncludesLockedSection &&
                  canShowDirectManipulationScaffolds ? (
                    <div
                      className="builder-preview-spacing-scaffold builder-preview-spacing-scaffold--top"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <button
                        type="button"
                        className="builder-preview-spacing-handle"
                        onClick={() => adjustSelectedSectionSpacing('top', 'tighter')}
                        disabled={!canTightenTopSpacing}
                        aria-label={
                          hasMultiSectionSelection
                            ? `Make top spacing tighter for ${selectedSections.length} selected sections`
                            : 'Make top spacing tighter'
                        }
                      >
                        Tighter
                      </button>
                      <div className="builder-preview-spacing-label">
                        <strong>Top {formatSpacingLabel(selectedSectionLayout.spacingTop)}</strong>
                        <span>
                          {hasMultiSectionSelection
                            ? `applies to ${selectedSections.length} selected sections`
                            : 'section top spacing'}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="builder-preview-spacing-handle"
                        onClick={() => adjustSelectedSectionSpacing('top', 'looser')}
                        disabled={!canLoosenTopSpacing}
                        aria-label={
                          hasMultiSectionSelection
                            ? `Make top spacing looser for ${selectedSections.length} selected sections`
                            : 'Make top spacing looser'
                        }
                      >
                        Looser
                      </button>
                    </div>
                  ) : null}
                  {active &&
                  !hidden &&
                  !locked &&
                  selection.targetKind === 'section' &&
                  !selectionIncludesLockedSection &&
                  canShowDirectManipulationScaffolds ? (
                    <div
                      className="builder-preview-inset-scaffold builder-preview-inset-scaffold--inline"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <button
                        type="button"
                        className="builder-preview-inset-handle builder-preview-inset-handle--inline"
                        onClick={() => adjustSelectedSectionInset('inline', 'tighter')}
                        disabled={!canTightenInlineInset}
                        aria-label={
                          hasMultiSectionSelection
                            ? `Make inline inset tighter for ${selectedSections.length} selected sections`
                            : 'Make inline inset tighter'
                        }
                      >
                        Tighter
                      </button>
                      <div className="builder-preview-inset-label">
                        <strong>Inset X {formatSpacingLabel(selectedSectionLayout.paddingInline)}</strong>
                        <span>
                          {hasMultiSectionSelection
                            ? `applies to ${selectedSections.length} selected sections`
                            : 'section inline inset'}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="builder-preview-inset-handle builder-preview-inset-handle--inline"
                        onClick={() => adjustSelectedSectionInset('inline', 'looser')}
                        disabled={!canLoosenInlineInset}
                        aria-label={
                          hasMultiSectionSelection
                            ? `Make inline inset looser for ${selectedSections.length} selected sections`
                            : 'Make inline inset looser'
                        }
                      >
                        Looser
                      </button>
                    </div>
                  ) : null}
                  {hidden ? (
                    <div className="builder-preview-hidden-section">
                      <div className="builder-preview-hidden-section-title">
                        {definition.title} is {visibilityState.badge}
                      </div>
                      <p className="builder-preview-hidden-section-copy">
                        {visibilityState.detail}
                      </p>
                      <div className="builder-preview-hidden-section-actions">
                        <button
                          type="button"
                          className="builder-action-btn builder-action-btn--primary"
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleSectionVisibility(section.sectionKey);
                          }}
                          disabled={locked}
                        >
                          {getVisibilityActionVerb(viewportMode, true)}
                        </button>
                        {viewportMode !== 'desktop' && visibilityState.overrideApplied ? (
                          <button
                            type="button"
                            className="builder-action-btn"
                            onClick={(event) => {
                              event.stopPropagation();
                              selectSingleTarget(createSectionSelection(section.sectionKey, section.id));
                              setSelectedSectionIds([section.id]);
                              resetSelectedSectionsVisibilityOverride();
                            }}
                            disabled={locked}
                          >
                            Reset {getViewportLabel(viewportMode).toLowerCase()} visibility
                          </button>
                        ) : null}
                        {locked ? (
                          <button
                            type="button"
                            className="builder-action-btn"
                            onClick={(event) => {
                              event.stopPropagation();
                              selectSingleTarget(createSectionSelection(section.sectionKey, section.id));
                              setSelectedSectionIds([section.id]);
                              toggleSectionLock(section.sectionKey);
                            }}
                          >
                            Unlock section
                          </button>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                  {!hidden && locked ? (
                    <div className="builder-preview-locked-section" onClick={(event) => event.stopPropagation()}>
                      <div className="builder-preview-locked-section-title">{definition.title} is locked</div>
                      <p className="builder-preview-locked-section-copy">
                        Direct surface editing, visibility changes, resize, and reorder stay blocked until you unlock this
                        section.
                      </p>
                      <div className="builder-preview-locked-section-actions">
                        <button
                          type="button"
                          className="builder-action-btn builder-action-btn--primary"
                          onClick={() => {
                            selectSingleTarget(createSectionSelection(section.sectionKey, section.id));
                            setSelectedSectionIds([section.id]);
                            toggleSectionLock(section.sectionKey);
                          }}
                        >
                          Unlock section
                        </button>
                      </div>
                    </div>
                  ) : null}
                  {active &&
                  !hidden &&
                  !locked &&
                  selection.targetKind === 'section' &&
                  !selectionIncludesLockedSection &&
                  zoomTooLowForPrecision ? (
                    <div className="builder-preview-zoom-guard" onClick={(event) => event.stopPropagation()}>
                      <strong>Increase zoom for direct handles</strong>
                      <span>{zoomStatusCopy}</span>
                    </div>
                  ) : null}
                  {!hidden && showDeadZone ? (
                    <div className="builder-preview-dead-zone-banner">
                      unsupported surface: wrap or map this area before editing
                    </div>
                  ) : null}
                  {!hidden ? (
                    <BuilderHomeSectionSurface
                      locale={locale}
                      section={section}
                      posts={insightsDatasetPosts}
                      faqItems={faqDraftItems}
                      services={servicesSection}
                    />
                  ) : null}
                  {active &&
                  !hidden &&
                  !locked &&
                  selection.targetKind === 'section' &&
                  !selectionIncludesLockedSection &&
                  canShowDirectManipulationScaffolds ? (
                    <div
                      className="builder-preview-inset-scaffold builder-preview-inset-scaffold--block"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <button
                        type="button"
                        className="builder-preview-inset-handle builder-preview-inset-handle--block"
                        onClick={() => adjustSelectedSectionInset('block', 'tighter')}
                        disabled={!canTightenBlockInset}
                        aria-label={
                          hasMultiSectionSelection
                            ? `Make block inset tighter for ${selectedSections.length} selected sections`
                            : 'Make block inset tighter'
                        }
                      >
                        Tighter
                      </button>
                      <div className="builder-preview-inset-label">
                        <strong>Inset Y {formatSpacingLabel(selectedSectionLayout.paddingBlock)}</strong>
                        <span>
                          {hasMultiSectionSelection
                            ? `applies to ${selectedSections.length} selected sections`
                            : 'section block inset'}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="builder-preview-inset-handle builder-preview-inset-handle--block"
                        onClick={() => adjustSelectedSectionInset('block', 'looser')}
                        disabled={!canLoosenBlockInset}
                        aria-label={
                          hasMultiSectionSelection
                            ? `Make block inset looser for ${selectedSections.length} selected sections`
                            : 'Make block inset looser'
                        }
                      >
                        Looser
                      </button>
                    </div>
                  ) : null}
                  {active &&
                  !hidden &&
                  !locked &&
                  selection.targetKind === 'section' &&
                  !selectionIncludesLockedSection &&
                  canShowDirectManipulationScaffolds ? (
                    <div
                      className="builder-preview-spacing-scaffold builder-preview-spacing-scaffold--bottom"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <button
                        type="button"
                        className="builder-preview-spacing-handle"
                        onClick={() => adjustSelectedSectionSpacing('bottom', 'tighter')}
                        disabled={!canTightenBottomSpacing}
                        aria-label={
                          hasMultiSectionSelection
                            ? `Make bottom spacing tighter for ${selectedSections.length} selected sections`
                            : 'Make bottom spacing tighter'
                        }
                      >
                        Tighter
                      </button>
                      <div className="builder-preview-spacing-label">
                        <strong>Bottom {formatSpacingLabel(selectedSectionLayout.spacingBottom)}</strong>
                        <span>
                          {hasMultiSectionSelection
                            ? `applies to ${selectedSections.length} selected sections`
                            : 'section bottom spacing'}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="builder-preview-spacing-handle"
                        onClick={() => adjustSelectedSectionSpacing('bottom', 'looser')}
                        disabled={!canLoosenBottomSpacing}
                        aria-label={
                          hasMultiSectionSelection
                            ? `Make bottom spacing looser for ${selectedSections.length} selected sections`
                            : 'Make bottom spacing looser'
                        }
                      >
                        Looser
                      </button>
                    </div>
                  ) : null}
                </div>
              );
                  })}
                  <div className="builder-preview-canvas-overlay">
                    {selectedCanvasRects.map((rect) => {
                      const selectedSectionNode = pageDocument.root.children.find(
                        (section) => section.id === rect.sectionId
                      );
                      if (!selectedSectionNode) {
                        return null;
                      }

                      const isActiveSection =
                        selection.targetKind === 'section' && selection.sectionId === rect.sectionId;

                      return (
                        <div
                          key={`overlay:${rect.sectionId}`}
                          className={`builder-preview-canvas-selection-box${
                            isActiveSection ? ' is-active' : ''
                          }${selectedSectionNode.locked ? ' is-locked' : ''}`}
                          style={{
                            top: `${rect.top}px`,
                            left: `${rect.left}px`,
                            width: `${rect.width}px`,
                            height: `${rect.height}px`,
                          }}
                        >
                          {isActiveSection ? (
                            <div className="builder-preview-canvas-selection-bar">
                              <button
                                type="button"
                                className="builder-preview-canvas-drag-handle"
                                onPointerDown={(event) => startCanvasSectionPointerDrag(event, selectedSectionNode)}
                                disabled={Boolean(selectedSectionNode.locked) || hasMultiSectionSelection}
                                aria-label={`Drag ${homeSectionRegistry[selectedSectionNode.sectionKey].title}`}
                              >
                                Drag
                              </button>
                              <div className="builder-preview-canvas-selection-meta">
                                <strong>{homeSectionRegistry[selectedSectionNode.sectionKey].title}</strong>
                                <span>
                                  {hasMultiSectionSelection
                                    ? `${selectedSections.length} sections selected`
                                    : 'Section frame canvas'}
                                </span>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                    {Object.values(contentGroupRects).map((rect) => {
                      if (rect.sectionId !== selection.sectionId) {
                        return null;
                      }

                      const parentSectionRect = sectionCanvasRects[rect.sectionId];
                      if (!parentSectionRect) {
                        return null;
                      }

                      const isSelectedGroup = selection.contentGroupId === rect.contentGroupId;
                      const renderedRect =
                        contentGroupDragState?.contentGroupId === rect.contentGroupId
                          ? {
                              ...rect,
                              x: contentGroupDragState.previewBounds.x * zoomScale,
                              y: contentGroupDragState.previewBounds.y * zoomScale,
                              width: contentGroupDragState.previewBounds.width * zoomScale,
                              height: contentGroupDragState.previewBounds.height * zoomScale,
                            }
                          : contentGroupResizeState?.contentGroupId === rect.contentGroupId
                            ? {
                                ...rect,
                                x: contentGroupResizeState.previewBounds.x * zoomScale,
                                y: contentGroupResizeState.previewBounds.y * zoomScale,
                                width: contentGroupResizeState.previewBounds.width * zoomScale,
                                height: contentGroupResizeState.previewBounds.height * zoomScale,
                              }
                          : rect;

                      return (
                        <div
                          key={`group:${rect.contentGroupId}`}
                          className={`builder-preview-content-group-box${
                            isSelectedGroup ? ' is-selected' : ''
                          }`}
                          style={{
                            top: `${parentSectionRect.top + renderedRect.y}px`,
                            left: `${parentSectionRect.left + renderedRect.x}px`,
                            width: `${renderedRect.width}px`,
                            height: `${renderedRect.height}px`,
                          }}
                        >
                          {isSelectedGroup ? (
                            <>
                              <button
                                type="button"
                                className={`builder-preview-content-group-surface${
                                  contentGroupDragState?.contentGroupId === rect.contentGroupId ? ' is-dragging' : ''
                                }`}
                                onPointerDown={(event) => startCanvasContentGroupPointerDrag(event, rect)}
                                aria-label={`Drag ${rect.label} on canvas`}
                              />
                              <div className="builder-preview-canvas-selection-bar builder-preview-canvas-selection-bar--group">
                                <button
                                  type="button"
                                  className="builder-preview-canvas-drag-handle"
                                  onPointerDown={(event) =>
                                    startCanvasContentGroupPointerDrag(event, rect)
                                  }
                                  aria-label={`Drag ${rect.label}`}
                                >
                                  Drag
                                </button>
                                <div className="builder-preview-canvas-selection-meta">
                                  <strong>{rect.label}</strong>
                                  <span>Scene-backed move / size</span>
                                </div>
                                <div className="builder-preview-canvas-group-actions">
                                  <button
                                    type="button"
                                    className="builder-preview-canvas-group-action"
                                    onClick={() => nudgeSelectedContentGroup(-10, 0)}
                                    aria-label={`Nudge ${rect.label} left`}
                                  >
                                    ←
                                  </button>
                                  <button
                                    type="button"
                                    className="builder-preview-canvas-group-action"
                                    onClick={() => nudgeSelectedContentGroup(10, 0)}
                                    aria-label={`Nudge ${rect.label} right`}
                                  >
                                    →
                                  </button>
                                  <button
                                    type="button"
                                    className="builder-preview-canvas-group-action"
                                    onClick={() => resizeSelectedContentGroup(-24, 0)}
                                    aria-label={`Make ${rect.label} narrower`}
                                  >
                                    W-
                                  </button>
                                  <button
                                    type="button"
                                    className="builder-preview-canvas-group-action"
                                    onClick={() => resizeSelectedContentGroup(24, 0)}
                                    aria-label={`Make ${rect.label} wider`}
                                  >
                                    W+
                                  </button>
                                  <button
                                    type="button"
                                    className="builder-preview-canvas-group-action"
                                    onClick={() => resizeSelectedContentGroup(0, -24)}
                                    aria-label={`Make ${rect.label} shorter`}
                                  >
                                    H-
                                  </button>
                                  <button
                                    type="button"
                                    className="builder-preview-canvas-group-action"
                                    onClick={() => resizeSelectedContentGroup(0, 24)}
                                    aria-label={`Make ${rect.label} taller`}
                                  >
                                    H+
                                  </button>
                                </div>
                              </div>
                              <button
                                type="button"
                                className="builder-preview-canvas-resize-handle"
                                onPointerDown={(event) =>
                                  startCanvasContentGroupPointerResize(event, rect)
                                }
                                aria-label={`Resize ${rect.label}`}
                              />
                            </>
                          ) : (
                            <button
                              type="button"
                              className={`builder-preview-content-group-chip${
                                isSelectedGroup ? ' is-selected' : ''
                              }`}
                              onClick={(event) => {
                                event.stopPropagation();
                                selectSingleTarget(
                                  createContentGroupSelection(
                                    rect.sectionKey,
                                    rect.sectionId,
                                    rect.contentGroupId,
                                    rect.label
                                  )
                                );
                              }}
                            >
                              {rect.label}
                            </button>
                          )}
                        </div>
                      );
                    })}
                    {canvasDragGuideRect && sectionDragState?.placement ? (
                      <div
                        className={`builder-preview-canvas-guide builder-preview-canvas-guide--${sectionDragState.placement}`}
                        style={{
                          top: `${
                            sectionDragState.placement === 'before'
                              ? canvasDragGuideRect.top
                              : canvasDragGuideRect.bottom
                          }px`,
                        }}
                      />
                    ) : null}
                    {canvasPointerDragState ? (
                      <div
                        className="builder-preview-canvas-ghost"
                        style={{
                          top: `${canvasPointerDragState.previewTop}px`,
                          left: `${canvasPointerDragState.previewLeft}px`,
                          width: `${canvasPointerDragState.previewWidth}px`,
                          height: `${canvasPointerDragState.previewHeight}px`,
                        }}
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="builder-preview-inspector">
          <div className="builder-preview-inspector-card">
            <div className="builder-preview-inspector-label">INSPECTOR</div>
            <h2>{selectedDefinition.title}</h2>
            <p>{selectedDefinition.description}</p>

            <div className="builder-preview-state-summary">
              <div className="builder-preview-state-summary-row">
                <span className="builder-preview-status-chip builder-preview-status-chip--primary">
                  Local recovery {draftHydrated ? (lastDraftSavedAt ? 'saved' : 'empty') : 'loading'}
                </span>
                <span className="builder-preview-status-chip">
                  Shared draft {serverDraftMeta.persisted ? `v${serverDraftMeta.revision}` : 'empty'}
                </span>
                <span className="builder-preview-status-chip">
                  Shared published {serverPublishedMeta.persisted ? `v${serverPublishedMeta.revision}` : 'empty'}
                </span>
              </div>
              <div className="builder-preview-state-summary-row">
                <span className="builder-preview-status-chip">Viewport {getViewportLabel(viewportMode)}</span>
                <span className="builder-preview-status-chip">
                  History {historyMeta.length ? `${historyMeta.cursor + 1}/${historyMeta.length}` : '0/0'}
                </span>
                <span className="builder-preview-status-chip">
                  Scene {browserSceneSummary.sceneNodeCount}
                </span>
                <span className="builder-preview-status-chip">
                  Authority {browserSceneSummary.sceneAuthorityNodeCount}
                </span>
                <span className="builder-preview-status-chip builder-preview-status-chip--warning">
                  Publish truth: section snapshot
                </span>
                <span
                  className={`builder-preview-status-chip${
                    publishingReadiness.status === 'blocked'
                      ? ' builder-preview-status-chip--danger'
                      : publishingReadiness.status === 'ready'
                        ? ' builder-preview-status-chip--success'
                        : ''
                  }`}
                >
                  {publishingReadiness.status === 'blocked'
                    ? 'Blocked'
                    : publishingReadiness.status === 'ready'
                      ? 'Ready to publish'
                      : 'Needs review'}
                </span>
              </div>
            </div>

            {hasMultiSectionSelection ? (
              <BuilderInspectorStatusCard
                subtitle="Batch section selection"
                tone="needs-review"
                message={`${selectedSections.length} sections are selected. Layout, visibility, copy, paste, and width scaffold actions apply to this batch. Move order and structure reset stay single-section only.`}
                meta={[
                  {
                    label: 'selection',
                    value: selectedSections.map((section) => homeSectionRegistry[section.sectionKey].title).join(' · '),
                  },
                  {
                    label: 'primary section',
                    value: primarySelectedSection
                      ? homeSectionRegistry[primarySelectedSection.sectionKey].title
                      : selectedDefinition.title,
                  },
                  {
                    label: 'clipboard',
                    value: clipboardPayload
                      ? formatSectionFrameClipboardSummary(clipboardPayload)
                      : 'empty',
                  },
                ]}
                note="Shift/Cmd-click section cards or section pills to extend selection. Mixed surface multi-select is still intentionally blocked."
              />
            ) : null}
            {clipboardNotice ? (
              <p className="builder-preview-editor-note">{clipboardNotice}</p>
            ) : null}
            {selectionIncludesLockedSection ? (
              <BuilderInspectorStatusCard
                subtitle="Lock state"
                tone="conflict"
                message={
                  hasMultiSectionSelection
                    ? `${selectedLockedSectionCount} locked sections are in the current batch. Layout, visibility, paste, resize, and collection edits stay blocked until you unlock them.`
                    : `${selectedDefinition.title} is locked. Direct surface editing and structural mutations stay blocked until you unlock it.`
                }
                meta={[
                  {
                    label: 'locked sections',
                    value: hasMultiSectionSelection
                      ? selectedSections
                          .filter((section) => section.locked)
                          .map((section) => homeSectionRegistry[section.sectionKey].title)
                          .join(' · ')
                      : selectedDefinition.title,
                  },
                ]}
                note="Current wave implements section-level lock only. Ancestor inheritance and nested element lock remain deferred."
                actions={
                  <button
                    type="button"
                    className="builder-action-btn builder-action-btn--primary"
                    onClick={() => setSelectedSectionsLock(false)}
                  >
                    {hasMultiSectionSelection ? 'Unlock selected sections' : 'Unlock section'}
                  </button>
                }
              />
            ) : null}
            {editorGuardNotice ? (
              <p className="builder-preview-editor-note">{editorGuardNotice}</p>
            ) : null}

            {!hasMultiSectionSelection && selection.sectionKey === insightsDatasetTarget.sectionKey ? (
              <BuilderInspectorStatusCard
                subtitle="Dataset binding"
                tone="needs-review"
                message={`${insightsDatasetTarget.title} is now backed by a persisted dataset contract. This binding is real and changes how many column records the section receives.`}
                meta={[
                  {
                    label: 'target',
                    value: insightsDatasetBinding.targetId,
                  },
                  {
                    label: 'collection',
                    value: insightsDatasetBinding.collectionId,
                  },
                  {
                    label: 'mode',
                    value: insightsDatasetBinding.mode,
                  },
                  {
                    label: 'record limit',
                    value: String(insightsDatasetBinding.limit ?? insightsDatasetTarget.defaultLimit ?? 0),
                  },
                ]}
                note="WAVE-03-B02 is intentionally narrow: one real bindable target, persisted in the page document, with preview/runtime effect and no fake generic data tab."
                actions={
                  <>
                    {(insightsDatasetTarget.limitOptions ?? []).map((limit) => (
                      <button
                        key={limit}
                        type="button"
                        className={`builder-action-btn${
                          (insightsDatasetBinding.limit ?? insightsDatasetTarget.defaultLimit) === limit
                            ? ' builder-action-btn--primary'
                            : ''
                        }`}
                        onClick={() =>
                          updateDatasetLimit(
                            insightsDatasetTarget.targetId,
                            limit,
                            `Set insights dataset limit to ${limit}`
                          )
                        }
                      >
                        {limit} records
                      </button>
                    ))}
                    <button
                      type="button"
                      className="builder-action-btn"
                      onClick={() =>
                        resetDatasetBinding(
                          insightsDatasetTarget.targetId,
                          'Reset insights dataset binding'
                        )
                      }
                    >
                      Reset binding
                    </button>
                    <Link
                      href={buildBuilderCollectionHref(locale, insightsDatasetBinding.collectionId)}
                      className="builder-action-btn"
                    >
                      Open collection detail
                    </Link>
                  </>
                }
              />
            ) : null}

            <BuilderInspectorStatusCard
              variant="readiness"
              tone={publishingReadiness.status}
              eyebrow="PUBLISHING READINESS"
              title={publishingReadiness.title}
              summary={publishingReadiness.summary}
              statusLabel={
                publishingReadiness.status === 'blocked'
                  ? 'Blocked'
                  : publishingReadiness.status === 'ready'
                    ? 'Ready to publish'
                    : 'Needs review'
              }
              statusTone={
                publishingReadiness.status === 'blocked'
                  ? 'danger'
                  : publishingReadiness.status === 'ready'
                    ? 'success'
                    : 'primary'
              }
              message={publishingReadiness.detail}
              actions={
                <>
                  {publishingReadiness.status === 'blocked' && serverConflict ? (
                    <>
                      {serverConflict.kind === 'draft' ? (
                        <button
                          type="button"
                          className="builder-action-btn builder-action-btn--primary"
                          onClick={() => {
                            void loadServerDraft();
                          }}
                          disabled={serverPending}
                        >
                          Review latest shared draft
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="builder-action-btn builder-action-btn--primary"
                          onClick={() => {
                            void loadServerPublished();
                          }}
                          disabled={serverPending}
                        >
                          Review latest published version
                        </button>
                      )}
                      <button
                        type="button"
                        className="builder-action-btn"
                        onClick={() => {
                          void refreshServerState();
                        }}
                        disabled={serverPending}
                      >
                        Refresh shared state
                      </button>
                    </>
                  ) : null}
                  {publishingReadiness.status === 'blocked' &&
                  !serverConflict &&
                  serverValidationIssues?.length ? (
                    <>
                      <button
                        type="button"
                        className="builder-action-btn builder-action-btn--primary"
                        onClick={() => {
                          if (serverValidationIssues[0]) {
                            focusValidationIssue(serverValidationIssues[0]);
                          }
                        }}
                        disabled={serverPending}
                      >
                        Review blockers
                      </button>
                      <button
                        type="button"
                        className="builder-action-btn"
                        onClick={() => {
                          void runPublishChecks();
                        }}
                        disabled={serverPending}
                      >
                        Run publish checks
                      </button>
                    </>
                  ) : null}
                  {publishingReadiness.status === 'blocked' &&
                  !serverConflict &&
                  !serverValidationIssues?.length ? (
                    <button
                      type="button"
                      className="builder-action-btn builder-action-btn--primary"
                      onClick={() => {
                        void refreshServerState();
                      }}
                      disabled={serverPending}
                    >
                      Refresh shared state
                    </button>
                  ) : null}
                  {publishingReadiness.status === 'needs-review' ? (
                    <button
                      type="button"
                      className="builder-action-btn builder-action-btn--primary"
                      onClick={() => {
                        void runPublishChecks();
                      }}
                      disabled={serverPending || !draftHydrated}
                    >
                      Run publish checks
                    </button>
                  ) : null}
                  {publishingReadiness.status === 'ready' ? (
                    <>
                      <button
                        type="button"
                        className="builder-action-btn builder-action-btn--primary"
                        onClick={() => {
                          void publishServerSnapshot();
                        }}
                        disabled={serverPending || !draftHydrated}
                      >
                        Publish to server
                      </button>
                      <button
                        type="button"
                        className="builder-action-btn"
                        onClick={() => {
                          void runPublishChecks();
                        }}
                        disabled={serverPending || !draftHydrated}
                      >
                        Run publish checks again
                      </button>
                    </>
                  ) : null}
                </>
              }
            />

            {rollbackPromotionCandidate ? (
              <BuilderInspectorStatusCard
                subtitle="Rollback promotion"
                tone="needs-review"
                message={`Browser draft is currently a recovery copy of published revision v${rollbackPromotionCandidate.revision}.`}
                meta={[
                  {
                    label: 'recovered from',
                    value: `Published v${rollbackPromotionCandidate.revision}`,
                  },
                  {
                    label: 'published at',
                    value: formatDraftTimestamp(rollbackPromotionCandidate.savedAt, locale),
                  },
                  {
                    label: 'shared draft target',
                    value: serverDraftMeta.persisted
                      ? `Shared draft v${serverDraftMeta.revision}`
                      : 'No shared draft yet',
                  },
                ]}
                note={
                  serverDraftMeta.persisted
                    ? '이 복구본은 아직 브라우저에만 있습니다. 최신 shared draft와 차이를 검토한 뒤 explicit promote로만 팀 draft를 교체할 수 있습니다.'
                    : '이 복구본은 아직 브라우저에만 있습니다. explicit promote를 해야 첫 shared draft가 만들어집니다.'
                }
                actions={
                  <>
                    {serverDraftMeta.persisted ? (
                      <button
                        type="button"
                        className="builder-action-btn builder-action-btn--primary"
                        onClick={() => {
                          void compareBrowserDraftAgainstSnapshot({
                            snapshot: serverDraftSnapshot ?? undefined,
                            label: 'Shared draft',
                            fallbackKind: 'draft',
                            reviewRollbackPromotionKey: activeRollbackPromotionKey,
                          });
                        }}
                        disabled={serverPending || comparePending}
                      >
                        Review recovery vs shared draft
                      </button>
                    ) : null}
                    <button
                      type="button"
                      className="builder-action-btn"
                      onClick={() => {
                        void saveServerDraft({ allowRollbackPromotion: true });
                      }}
                      disabled={
                        serverPending ||
                        (serverDraftMeta.persisted && !canPromoteRollbackRecovery)
                      }
                    >
                      Promote recovery to shared draft
                    </button>
                    <button
                      type="button"
                      className="builder-action-btn"
                      onClick={() => {
                        void loadServerDraft();
                      }}
                      disabled={serverPending || !serverDraftMeta.persisted}
                    >
                      Discard recovery and load shared draft
                    </button>
                  </>
                }
              />
            ) : null}

            {serverConflict ? (
              <>
                <BuilderInspectorStatusCard
                  subtitle={`Server conflict ${serverConflictAction ? `· ${serverConflictAction}` : ''}`}
                  tone="conflict"
                  message={buildConflictMessage(serverConflict, serverConflictAction)}
                  meta={[
                    {
                      label: 'blocked action',
                      value:
                        serverConflictAction === 'publish'
                          ? 'Publish to server'
                          : serverConflictAction === 'validate'
                            ? 'Run publish checks'
                            : 'Save to server',
                    },
                    {
                      label: 'slot',
                      value: getSnapshotKindLabel(serverConflict.kind),
                    },
                    {
                      label: 'expected',
                      value: formatExpectedSnapshot(
                        serverConflict.expectedRevision,
                        serverConflict.expectedSavedAt,
                        locale
                      ),
                    },
                    {
                      label: 'server current',
                      value: formatSnapshotMetaLine(serverConflict.currentSnapshot, locale),
                    },
                  ]}
                  note={
                    serverConflict.kind === 'draft' && !canReplaceSharedDraftAfterReview
                      ? '현재 브라우저 draft는 그대로 남아 있습니다. 최신 shared draft와 차이를 검토한 뒤에만 explicit overwrite를 열 수 있습니다.'
                      : '현재 브라우저 draft는 그대로 남아 있습니다. 최신 shared snapshot을 확인한 뒤 다시 저장하거나 발행하세요.'
                  }
                  actions={
                    <>
                      {serverConflict.kind === 'draft' ? (
                        <button
                          type="button"
                          className="builder-action-btn builder-action-btn--primary"
                          onClick={() => {
                            void compareBrowserDraftAgainstSnapshot({
                              snapshot: serverConflict.currentSnapshot,
                              label: 'Latest shared draft',
                              reviewConflictKey: activeConflictReviewKey,
                            });
                          }}
                          disabled={serverPending || comparePending}
                        >
                          Review local vs latest shared
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="builder-action-btn builder-action-btn--primary"
                          onClick={() => {
                            void loadServerPublished();
                          }}
                          disabled={serverPending}
                        >
                          Load latest server published
                        </button>
                      )}
                      <button
                        type="button"
                        className="builder-action-btn"
                        onClick={() => {
                          if (serverConflict.kind === 'draft') {
                            void loadServerDraft();
                            return;
                          }

                          void compareBrowserDraftAgainstSnapshot({
                            snapshot: serverConflict.currentSnapshot,
                            label: 'Live published',
                          });
                        }}
                        disabled={serverPending || (serverConflict.kind !== 'draft' && comparePending)}
                      >
                        {serverConflict.kind === 'draft'
                          ? 'Load latest shared draft'
                          : 'Compare local vs live published'}
                      </button>
                      {serverConflict.kind === 'draft' ? (
                        <button
                          type="button"
                          className="builder-action-btn"
                          onClick={() => {
                            void saveServerDraft({ allowConflictReplace: true });
                          }}
                          disabled={!canReplaceSharedDraftAfterReview || serverPending}
                        >
                          Overwrite shared draft after review
                        </button>
                      ) : null}
                      <button
                        type="button"
                        className="builder-action-btn"
                        onClick={() => {
                          void refreshServerState();
                        }}
                        disabled={serverPending}
                      >
                        Refresh shared slots
                      </button>
                    </>
                  }
                />
              </>
            ) : serverValidationIssues?.length ? (
              <>
                <BuilderInspectorStatusCard
                  subtitle="Publish validation"
                  tone="validation"
                  message={
                    <>
                      Publish stopped because {serverValidationIssues.length} asset issue
                      {serverValidationIssues.length > 1 ? 's' : ''} must be resolved first.
                    </>
                  }
                  meta={[
                    {
                      label: 'last checked',
                      value: serverValidationCheckedAt
                        ? formatDraftTimestamp(serverValidationCheckedAt, locale)
                        : 'Unknown',
                    },
                    {
                      label: 'blocked action',
                      value:
                        serverValidationAction === 'validate'
                          ? 'Run publish checks'
                          : 'Publish to server',
                    },
                    {
                      label: 'issue count',
                      value: serverValidationIssues.length,
                    },
                    {
                      label: 'policy',
                      value:
                        'Edited images must use registered builder image slots and builder-managed asset files.',
                    },
                  ]}
                  actions={
                    <>
                      <button
                        type="button"
                        className="builder-action-btn builder-action-btn--primary"
                        onClick={() => {
                          if (serverValidationAction === 'validate') {
                            void runPublishChecks();
                            return;
                          }
                          void publishServerSnapshot();
                        }}
                        disabled={serverPending}
                      >
                        {serverValidationAction === 'validate' ? 'Retry publish checks' : 'Retry publish'}
                      </button>
                      <button
                        type="button"
                        className="builder-action-btn"
                        onClick={() => {
                          void refreshServerState();
                        }}
                        disabled={serverPending}
                      >
                        Refresh shared slots
                      </button>
                      <button
                        type="button"
                        className="builder-action-btn"
                        onClick={() => {
                          setServerValidationIssues(null);
                          setServerError(null);
                          setServerValidationAction(null);
                        }}
                        disabled={serverPending}
                      >
                        Hide issue list
                      </button>
                    </>
                  }
                >
                  <ul className="builder-validation-issue-list">
                    {serverValidationIssues.map((issue) => (
                      <li key={`${issue.sectionId}:${issue.surfaceId}:${issue.code}`}>
                        <div className="builder-validation-issue-head">
                          <span className="builder-validation-issue-code">
                            {formatValidationIssueCode(issue.code)}
                          </span>
                          <button
                            type="button"
                            className="builder-action-btn"
                            onClick={() => {
                              focusValidationIssue(issue);
                            }}
                          >
                            Select section
                          </button>
                        </div>
                        <strong>{issue.sectionTitle}</strong>
                        <p>{issue.message}</p>
                      </li>
                    ))}
                  </ul>
                </BuilderInspectorStatusCard>
              </>
            ) : serverValidationPassed && serverValidationCheckedAt ? (
              <>
                <BuilderInspectorStatusCard
                  subtitle="Publish validation"
                  tone="success"
                  message={`${serverValidationAction === 'validate' ? 'Publish checks passed' : 'Publish completed'} at ${formatDraftTimestamp(serverValidationCheckedAt, locale)}.`}
                  note={
                    serverValidationAction === 'validate'
                      ? 'Current registered surface overrides satisfy the builder publish policy for the shared published slot.'
                      : 'Current registered surface overrides satisfied the builder publish policy during the last publish.'
                  }
                />
              </>
            ) : serverError ? (
              <>
                <BuilderInspectorStatusCard
                  subtitle="Server status"
                  message={serverError}
                  actions={
                    <button
                      type="button"
                      className="builder-action-btn"
                      onClick={() => {
                        void refreshServerState();
                      }}
                      disabled={serverPending}
                    >
                      Refresh shared slots
                    </button>
                  }
                />
              </>
            ) : serverNotice ? (
              <>
                <BuilderInspectorStatusCard
                  subtitle="Server status"
                  tone="success"
                  message={serverNotice}
                />
              </>
            ) : null}

            <BuilderAdvancedDisclosure
              title="Advanced publish controls"
              summary="Draft slots, recovery, compare, and manual shared-state actions"
            >
              <div className="builder-preview-inspector-subtitle">Local recovery draft</div>
              <p className="builder-preview-draft-status">
                {draftHydrated
                  ? lastDraftSavedAt
                    ? `Every change autosaves to this browser. Last recovery snapshot: ${formatDraftTimestamp(lastDraftSavedAt, locale)}`
                    : 'No browser recovery snapshot yet.'
                  : 'Loading local draft…'}
              </p>
              <p className="builder-preview-editor-note">Only on this browser. This is recovery, not collaboration.</p>
              <div className="builder-preview-draft-actions">
                <button type="button" className="builder-action-btn" onClick={resetCurrentSectionDraft}>
                  Reset current content
                </button>
                <button type="button" className="builder-action-btn" onClick={clearLocalDraft}>
                  Clear browser recovery
                </button>
              </div>

              <div className="builder-preview-inspector-subtitle">Browser-only published checkpoint</div>
              <p className="builder-preview-draft-status">
                {lastPublishedAt
                  ? `Browser-only checkpoint saved at ${formatDraftTimestamp(lastPublishedAt, locale)}`
                  : 'No browser-only published checkpoint yet. This never changes the real public route.'}
              </p>
              <p className="builder-preview-editor-note">
                Recovery only. Use shared draft and shared published for real team workflow.
              </p>
              <div className="builder-preview-draft-actions">
                <button
                  type="button"
                  className="builder-action-btn builder-action-btn--primary"
                  onClick={publishToLocalSnapshot}
                  disabled={!draftHydrated}
                >
                  Save browser checkpoint
                </button>
                <button
                  type="button"
                  className="builder-action-btn"
                  onClick={restorePublishedSnapshot}
                  disabled={!lastPublishedAt}
                >
                  Restore browser checkpoint
                </button>
              </div>

              <div className="builder-preview-inspector-subtitle">Shared draft</div>
              <p className="builder-preview-draft-status">
                {rollbackPromotionCandidate
                  ? serverDraftMeta.persisted
                    ? `Recovery candidate from published v${rollbackPromotionCandidate.revision}. Review it against shared draft v${serverDraftMeta.revision}, then explicitly promote it if this should become the team draft.`
                    : `Recovery candidate from published v${rollbackPromotionCandidate.revision}. Explicitly promote it if this should become the first shared draft.`
                  : serverDraftMeta.persisted && serverDraftMeta.savedAt
                  ? `Shared draft v${serverDraftMeta.revision} saved at ${formatDraftTimestamp(serverDraftMeta.savedAt, locale)} by ${serverDraftMeta.updatedBy ?? 'unknown'}`
                  : 'No shared draft yet. Save when this browser draft should become the team working draft.'}
              </p>
              <p className="builder-preview-editor-note">
                {formatSceneSummaryCopy(
                  serverDraftSceneSummary,
                  serverDraftMeta.persisted ? 'Shared draft scene' : 'Shared draft scene slot'
                )}
              </p>
              <div className="builder-preview-draft-actions">
                {rollbackPromotionCandidate && serverDraftMeta.persisted ? (
                  <button
                    type="button"
                    className="builder-action-btn"
                    onClick={() => {
                      void compareBrowserDraftAgainstSnapshot({
                        snapshot: serverDraftSnapshot ?? undefined,
                        label: 'Shared draft',
                        fallbackKind: 'draft',
                        reviewRollbackPromotionKey: activeRollbackPromotionKey,
                      });
                    }}
                    disabled={serverPending || comparePending}
                  >
                    Review recovery vs shared draft
                  </button>
                ) : null}
                <button
                  type="button"
                  className="builder-action-btn builder-action-btn--primary"
                  onClick={() => {
                    void saveServerDraft(
                      rollbackPromotionCandidate ? { allowRollbackPromotion: true } : undefined
                    );
                  }}
                  disabled={
                    serverPending ||
                    !draftHydrated ||
                    serverConflict?.kind === 'draft' ||
                    (Boolean(rollbackPromotionCandidate) &&
                      serverDraftMeta.persisted &&
                      !canPromoteRollbackRecovery)
                  }
                >
                  {rollbackPromotionCandidate ? 'Promote recovery to shared draft' : 'Save shared draft'}
                </button>
                <button
                  type="button"
                  className="builder-action-btn"
                  onClick={() => {
                    void loadServerDraft();
                  }}
                  disabled={serverPending || !serverDraftMeta.persisted}
                >
                  Load shared draft
                </button>
              </div>

              <div className="builder-preview-inspector-subtitle">Live published version</div>
              <p className="builder-preview-draft-status">
                {rollbackPromotionCandidate
                  ? `This browser draft is still a local recovery from published v${rollbackPromotionCandidate.revision}. Promote it to shared draft before any new publish.`
                  : serverPublishedMeta.persisted && serverPublishedMeta.savedAt
                  ? `Live published v${serverPublishedMeta.revision} saved at ${formatDraftTimestamp(serverPublishedMeta.savedAt, locale)} by ${serverPublishedMeta.updatedBy ?? 'unknown'}`
                  : 'No live published version yet. Publishing copies the current shared draft into the public slot.'}
              </p>
              <p className="builder-preview-editor-note">
                {formatSceneSummaryCopy(
                  serverPublishedSceneSummary,
                  serverPublishedMeta.persisted ? 'Live published scene' : 'Live published scene slot'
                )}
              </p>
              <div className="builder-preview-draft-actions">
                <button
                  type="button"
                  className="builder-action-btn builder-action-btn--primary"
                  onClick={() => {
                    void publishServerSnapshot();
                  }}
                  disabled={serverPending || !draftHydrated || Boolean(rollbackPromotionCandidate)}
                >
                  Publish shared draft
                </button>
                <button
                  type="button"
                  className="builder-action-btn"
                  onClick={() => {
                    void loadServerPublished();
                  }}
                  disabled={serverPending || !serverPublishedMeta.persisted}
                >
                  Load live published
                </button>
              </div>

              <div className="builder-preview-inspector-subtitle">Published revision browser</div>
              <p className="builder-preview-draft-status">
                Read-only archive of published heads. Use it for browser-only recovery, or for shared draft rollback after reviewing the difference against the latest shared draft.
              </p>
              <div className="builder-preview-draft-actions builder-preview-draft-actions--single">
                <button
                  type="button"
                  className="builder-action-btn"
                  onClick={() => {
                    void loadPublishedHistory({ force: true });
                  }}
                  disabled={publishedHistoryPending}
                >
                  {publishedHistoryPending ? 'Refreshing published revisions…' : 'Refresh published revisions'}
                </button>
              </div>
              {publishedHistoryError ? (
                <p className="builder-preview-editor-note">{publishedHistoryError}</p>
              ) : null}
              {publishedHistoryItems.length ? (
                <ul className="builder-preview-revision-list">
                  {publishedHistoryItems.map((record) => (
                    <li key={record.revisionId} className="builder-preview-revision-card">
                      <div className="builder-preview-revision-head">
                        <strong>{`Published v${record.revision}`}</strong>
                        <span>{formatDraftTimestamp(record.savedAt, locale)}</span>
                      </div>
                      <p className="builder-preview-revision-meta">
                        {record.updatedBy}
                        {record.sourceDraftRevision
                          ? ` · from shared draft v${record.sourceDraftRevision}`
                          : ''}
                      </p>
                      <p className="builder-preview-revision-meta">
                        Sections {record.sectionCount} · Hidden {record.hiddenSectionCount} · Overrides {record.overrideCount} · FAQ {record.faqCount} · Services {record.serviceCount}
                      </p>
                      <p className="builder-preview-revision-meta">
                        Scene {record.sceneNodeCount} · Authority {record.sceneAuthorityNodeCount} · Bridge {record.sceneSeedNodeCount}
                      </p>
                      {pendingRevisionRestore?.record.revisionId === record.revisionId ? (
                        <>
                          <p className="builder-preview-editor-note">
                            This will replace the current browser draft only. Shared draft and live published stay unchanged.
                          </p>
                          <div className="builder-preview-draft-actions">
                            <button
                              type="button"
                              className="builder-action-btn builder-action-btn--primary"
                              onClick={confirmPublishedRevisionRestore}
                              disabled={publishedHistoryPending}
                            >
                              Load revision now
                            </button>
                            <button
                              type="button"
                              className="builder-action-btn"
                              onClick={cancelPublishedRevisionRestore}
                              disabled={publishedHistoryPending}
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="builder-preview-draft-actions">
                            <button
                              type="button"
                              className="builder-action-btn"
                              onClick={() => {
                                void preparePublishedRevisionRestore(record);
                              }}
                              disabled={publishedHistoryPending}
                            >
                              Review first
                            </button>
                            <button
                              type="button"
                              className="builder-action-btn"
                              onClick={() => {
                                void preparePublishedRevisionRestore(record, { saveCheckpointFirst: true });
                              }}
                              disabled={publishedHistoryPending}
                            >
                              Save checkpoint then load
                            </button>
                          </div>
                          <div className="builder-preview-draft-actions">
                            <button
                              type="button"
                              className="builder-action-btn"
                              onClick={() => {
                                void reviewPublishedRevisionAgainstSharedDraft(record);
                              }}
                              disabled={
                                publishedHistoryPending ||
                                !serverDraftMeta.persisted ||
                                !browserDraftMatchesSharedDraft
                              }
                            >
                              Review vs shared draft
                            </button>
                            <button
                              type="button"
                              className="builder-action-btn"
                              onClick={() => {
                                void rollbackSharedDraftToPublishedRevision(record);
                              }}
                              disabled={
                                publishedHistoryPending ||
                                serverPending ||
                                !serverDraftMeta.persisted ||
                                !browserDraftMatchesSharedDraft ||
                                reviewedSharedRollbackKey !==
                                  getSharedRollbackReviewKey(
                                    record,
                                    serverDraftMeta.revision,
                                    serverDraftMeta.savedAt
                                  )
                              }
                            >
                              Roll back shared draft
                            </button>
                          </div>
                          {!serverDraftMeta.persisted ? (
                            <p className="builder-preview-editor-note">
                              Shared draft must exist before a shared rollback can run.
                            </p>
                          ) : !browserDraftMatchesSharedDraft ? (
                            <p className="builder-preview-editor-note">
                              Load the latest shared draft into this browser first. Shared rollback is blocked while the browser draft has its own local edits.
                            </p>
                          ) : null}
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              ) : publishedHistoryHydrated ? (
                <p className="builder-preview-editor-note">
                  No published revision archive yet. It starts recording from the next successful publish.
                </p>
              ) : null}

              <div className="builder-preview-inspector-subtitle">Publish checks</div>
              <p className="builder-preview-draft-status">
                Run a dry-run publish validation against the current browser draft without touching the shared
                published slot.
              </p>
              <div className="builder-preview-draft-actions builder-preview-draft-actions--single">
                <button
                  type="button"
                  className="builder-action-btn"
                  onClick={() => {
                    void runPublishChecks();
                  }}
                  disabled={serverPending || !draftHydrated}
                >
                  Run publish checks
                </button>
              </div>

              <div className="builder-preview-inspector-subtitle">Revision compare</div>
              <p className="builder-preview-draft-status">
                Compare shared and browser states before you decide to save or publish.
              </p>
              <div className="builder-preview-draft-actions">
                <button
                  type="button"
                  className="builder-action-btn"
                  onClick={() => {
                    void runRevisionCompare();
                  }}
                  disabled={comparePending || !serverDraftMeta.persisted || !serverPublishedMeta.persisted}
                >
                  {comparePending ? 'Comparing revisions…' : 'Compare shared draft vs published'}
                </button>
                <button
                  type="button"
                  className="builder-action-btn"
                  onClick={() => {
                    void compareBrowserDraftAgainstSnapshot({
                      snapshot: serverDraftSnapshot ?? undefined,
                      label: 'Shared draft',
                      fallbackKind: 'draft',
                    });
                  }}
                  disabled={comparePending || !serverDraftMeta.persisted}
                >
                  {comparePending ? 'Comparing revisions…' : 'Compare browser draft vs shared draft'}
                </button>
              </div>
              {!serverDraftMeta.persisted ? (
                <p className="builder-preview-editor-note">
                  Shared draft must exist before browser-vs-shared compare can run.
                </p>
              ) : null}
              {!serverDraftMeta.persisted || !serverPublishedMeta.persisted ? (
                <p className="builder-preview-editor-note">
                  Shared draft and shared published snapshots are both required before shared-vs-published compare can run.
                </p>
              ) : null}
              {compareError ? (
                <div className="builder-preview-compare-card">
                  <p className="builder-preview-draft-status">{compareError}</p>
                </div>
              ) : compareSummary ? (
                <div className="builder-preview-compare-card">
                  <dl className="builder-preview-server-alert-meta">
                    <div>
                      <dt>{compareSummary.leftMeta.label}</dt>
                      <dd>{formatCompareMetaLine(compareSummary.leftMeta, locale)}</dd>
                    </div>
                    <div>
                      <dt>{compareSummary.rightMeta.label}</dt>
                      <dd>{formatCompareMetaLine(compareSummary.rightMeta, locale)}</dd>
                    </div>
                    <div>
                      <dt>section order</dt>
                      <dd>{compareSummary.sectionOrderChanged ? 'Changed' : 'Same order'}</dd>
                    </div>
                    <div>
                      <dt>visibility changes</dt>
                      <dd>{compareSummary.visibilityChanges.length || 'None'}</dd>
                    </div>
                    <div>
                      <dt>lock changes</dt>
                      <dd>{compareSummary.lockChanges.length || 'None'}</dd>
                    </div>
                    <div>
                      <dt>overrides</dt>
                      <dd>
                        {compareSummary.leftMeta.label} {compareSummary.overrideCount.left} · {compareSummary.rightMeta.label}{' '}
                        {compareSummary.overrideCount.right}
                      </dd>
                    </div>
                    <div>
                      <dt>collections</dt>
                      <dd>
                        FAQ {compareSummary.faqCount.left}/{compareSummary.faqCount.right} · Services{' '}
                        {compareSummary.serviceCount.left}/{compareSummary.serviceCount.right}
                      </dd>
                    </div>
                    <div>
                      <dt>structural changes</dt>
                      <dd>{compareSummary.structuralChanges.length || 'None'}</dd>
                    </div>
                    <div>
                      <dt>field changes</dt>
                      <dd>{compareSummary.fieldChanges.length || 'None'}</dd>
                    </div>
                  </dl>
                  {compareSummary.structuralChanges.length ? (
                    <ul className="builder-preview-diff-list">
                      {compareSummary.structuralChanges.map((change, index) => {
                        const targetSectionId = change.sectionKey ? sectionIdByKey[change.sectionKey] : null;
                        return (
                          <li
                            key={`${change.group}:${change.sectionKey ?? 'global'}:${change.label}:${index}`}
                            className="builder-preview-diff-card"
                          >
                            <div className="builder-preview-diff-head">
                              <strong>{change.sectionTitle}</strong>
                              <span>{formatStructuralChangeGroup(change.group)}</span>
                            </div>
                            <p className="builder-preview-revision-meta">{change.label}</p>
                            <div className="builder-preview-diff-values">
                              <div>
                                <small>{compareSummary.leftMeta.label}</small>
                                <p>{change.leftValue}</p>
                              </div>
                              <div>
                                <small>{compareSummary.rightMeta.label}</small>
                                <p>{change.rightValue}</p>
                              </div>
                            </div>
                            {targetSectionId ? (
                              <div className="builder-preview-draft-actions builder-preview-draft-actions--single">
                                <button
                                  type="button"
                                  className="builder-action-btn"
                                  onClick={() => focusSection(change.sectionKey!)}
                                >
                                  Focus section
                                </button>
                              </div>
                            ) : null}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <div className="builder-preview-compare-summary">
                      <div>
                        <strong>Structural diff</strong>
                        <p>
                          No section presence, order, visibility, lock, layout, or collection structure changes between{' '}
                          {compareSummary.leftMeta.label.toLowerCase()} and{' '}
                          {compareSummary.rightMeta.label.toLowerCase()}.
                        </p>
                      </div>
                    </div>
                  )}
                  {compareSummary.fieldChanges.length ? (
                    <ul className="builder-preview-diff-list">
                      {compareSummary.fieldChanges.map((change, index) => (
                        <li key={`${change.sectionKey}:${change.label}:${index}`} className="builder-preview-diff-card">
                          <div className="builder-preview-diff-head">
                            <strong>{change.sectionTitle}</strong>
                            <span>{formatDiffFieldGroup(change.group)}</span>
                          </div>
                          <p className="builder-preview-revision-meta">{change.label}</p>
                          <div className="builder-preview-diff-values">
                            <div>
                              <small>{compareSummary.leftMeta.label}</small>
                              <p>{change.leftValue}</p>
                            </div>
                            <div>
                              <small>{compareSummary.rightMeta.label}</small>
                              <p>{change.rightValue}</p>
                            </div>
                          </div>
                          <div className="builder-preview-draft-actions builder-preview-draft-actions--single">
                            <button
                              type="button"
                              className="builder-action-btn"
                              onClick={() => focusSection(change.sectionKey)}
                            >
                              Focus section
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ) : null}
            </BuilderAdvancedDisclosure>

            <div className="builder-preview-inspector-subtitle">Selection path</div>
            <nav className="builder-preview-breadcrumbs" aria-label="Selection path">
              <span className="builder-preview-breadcrumb-btn">Home page</span>
              <span className="builder-preview-breadcrumb-sep" aria-hidden>
                /
              </span>
              <button
                type="button"
                className={`builder-preview-breadcrumb-btn${selection.surfaceId || selection.contentGroupId ? '' : ' is-active'}`}
                onClick={() => focusSection(selection.sectionKey, { scroll: false })}
                aria-current={selection.surfaceId || selection.contentGroupId ? undefined : 'true'}
              >
                {selectedDefinition.title}
              </button>
              {selection.contentGroupId ? (
                <>
                  <span className="builder-preview-breadcrumb-sep" aria-hidden>
                    /
                  </span>
                  {selection.surfaceId ? (
                    <button
                      type="button"
                      className="builder-preview-breadcrumb-btn"
                      onClick={() =>
                        selectSingleTarget(
                          createContentGroupSelection(
                            selection.sectionKey,
                            selection.sectionId,
                            selection.contentGroupId!,
                            selectedContentGroup?.label ?? 'Content group'
                          )
                        )
                      }
                    >
                      {selectedContentGroup?.label ?? 'Content group'}
                    </button>
                  ) : (
                    <span className="builder-preview-breadcrumb-btn is-active" aria-current="true">
                      {selectedContentGroup?.label ?? 'Content group'}
                    </span>
                  )}
                </>
              ) : null}
              {selection.surfaceId ? (
                <>
                  <span className="builder-preview-breadcrumb-sep" aria-hidden>
                    /
                  </span>
                  <span className="builder-preview-breadcrumb-btn is-active" aria-current="true">
                    {selection.targetLabel}
                  </span>
                </>
              ) : null}
            </nav>

            <dl className="builder-preview-inspector-list">
              <div>
                <dt>sectionKey</dt>
                <dd>{selection.sectionKey}</dd>
              </div>
              <div>
                <dt>component</dt>
                <dd>{selectedDefinition.componentName}</dd>
              </div>
              <div>
                <dt>clicked target</dt>
                <dd>{KIND_LABEL[selection.targetKind]}</dd>
              </div>
              <div>
                <dt>target label</dt>
                <dd>{selection.targetLabel}</dd>
              </div>
              <div>
                <dt>surface id</dt>
                <dd>{selection.surfaceId ?? 'section frame'}</dd>
              </div>
              <div>
                <dt>content group</dt>
                <dd>{selection.contentGroupId ?? 'none'}</dd>
              </div>
              <div>
                <dt>status</dt>
                <dd>
                  {selection.supported
                    ? selection.targetKind === 'group'
                      ? 'scene-backed content group'
                      : 'supported surface'
                    : 'dead zone / unsupported'}
                </dd>
              </div>
              <div>
                <dt>contract</dt>
                <dd>{selectedSurfaceContract.label}</dd>
              </div>
            </dl>
            {selectedSurfaceContract.note ? (
              <p className="builder-preview-editor-note">{selectedSurfaceContract.note}</p>
            ) : null}
            {selectedSurfaceContract.managerSignal ? (
              <p className="builder-preview-editor-note">
                Manager signal: {selectedSurfaceContract.managerSignal}
              </p>
            ) : null}
            {selectedContentGroup ? (
              <p className="builder-preview-editor-note">
                Group surfaces: {selectedContentGroup.surfaceIds.length || '0'} · dataset bindings:{' '}
                {selectedContentGroup.datasetTargetIds.length || '0'}
              </p>
            ) : null}

            <div className="builder-preview-inspector-divider" />

            <div className="builder-preview-inspector-subtitle">Detected elements</div>
            <div className="builder-preview-inspector-stats">
              <span>{selectedStats.text} text</span>
              <span>{selectedStats.button} button</span>
              <span>{selectedStats.image} image</span>
            </div>

            <div className="builder-preview-inspector-subtitle">Section support</div>
            <div className="builder-preview-inspector-tags">
              {selectedDefinition.supportedTargets.map((target) => (
                <span key={target}>{target}</span>
              ))}
            </div>

            <div className="builder-preview-inspector-subtitle">Section structure</div>
            <div className="builder-preview-section-structure">
              <div className="builder-preview-section-structure-meta">
                <span>
                  position {selectedSectionIndex >= 0 ? selectedSectionIndex + 1 : 'n/a'} of{' '}
                  {pageDocument.root.children.length}
                </span>
                <span>
                  {hasMultiSectionSelection
                    ? `${selectedSections.length} selected · ${selectedLockedSectionCount} locked`
                    : selectedSection?.locked
                      ? 'locked'
                      : selectedSectionHiddenInViewport
                        ? selectedViewportVisibilityState.badge
                        : 'visible'}
                </span>
              </div>
              <div className="builder-preview-section-structure-actions">
                <button
                  type="button"
                  className="builder-action-btn"
                  onClick={() => moveSection(selection.sectionKey, -1)}
                  disabled={
                    hasMultiSectionSelection ||
                    selectedSectionIndex <= 0 ||
                    Boolean(getSectionMoveLockBlockMessage(selection.sectionKey, selectedSectionIndex - 1))
                  }
                >
                  Move up
                </button>
                <button
                  type="button"
                  className="builder-action-btn"
                  onClick={() => moveSection(selection.sectionKey, 1)}
                  disabled={
                    hasMultiSectionSelection ||
                    selectedSectionIndex < 0 ||
                    selectedSectionIndex === pageDocument.root.children.length - 1 ||
                    Boolean(getSectionMoveLockBlockMessage(selection.sectionKey, selectedSectionIndex + 1))
                  }
                >
                  Move down
                </button>
                <button
                  type="button"
                  className="builder-action-btn builder-action-btn--primary"
                  onClick={() =>
                    setSelectedSectionsVisibility(
                      hasMultiSectionSelection
                        ? selectedSections.every((section) => resolveBuilderSectionHidden(section, viewportMode))
                        : !selectedSectionHiddenInViewport
                    )
                  }
                  disabled={(selectedSectionIndex < 0 && !selectedSections.length) || selectionIncludesLockedSection}
                >
                  {hasMultiSectionSelection
                    ? selectedSections.every((section) => resolveBuilderSectionHidden(section, viewportMode))
                      ? getVisibilityActionVerb(viewportMode, true, true)
                      : getVisibilityActionVerb(viewportMode, false, true)
                    : selectedSectionHiddenInViewport
                      ? getVisibilityActionVerb(viewportMode, true)
                      : getVisibilityActionVerb(viewportMode, false)}
                </button>
                {viewportMode !== 'desktop' ? (
                  <button
                    type="button"
                    className="builder-action-btn"
                    onClick={() => resetSelectedSectionsVisibilityOverride()}
                    disabled={
                      (selectedSectionIndex < 0 && !selectedSections.length) ||
                      selectionIncludesLockedSection ||
                      !hasVisibilityOverrideSelection(selectedSections, viewportMode)
                    }
                  >
                    {hasMultiSectionSelection
                      ? `Reset ${getViewportLabel(viewportMode).toLowerCase()} visibility`
                      : `Reset ${getViewportLabel(viewportMode).toLowerCase()} override`}
                  </button>
                ) : null}
                <button
                  type="button"
                  className="builder-action-btn"
                  onClick={() =>
                    setSelectedSectionsLock(
                      hasMultiSectionSelection
                        ? !selectedSections.every((section) => section.locked)
                        : !Boolean(selectedSection?.locked)
                    )
                  }
                  disabled={selectedSectionIndex < 0 && !selectedSections.length}
                >
                  {hasMultiSectionSelection
                    ? selectedSections.every((section) => section.locked)
                      ? 'Unlock selection'
                      : 'Lock selection'
                    : selectedSection?.locked
                      ? 'Unlock section'
                      : 'Lock section'}
                </button>
                <button
                  type="button"
                  className="builder-action-btn"
                  onClick={() => resetSectionStructure(selection.sectionKey)}
                  disabled={hasMultiSectionSelection || selectedSectionIndex < 0 || selectedSectionLocked}
                >
                  Reset structure
                </button>
              </div>
            </div>

            <div className="builder-preview-inspector-subtitle">Viewport preview</div>
            <div className="builder-preview-layout-panel">
              <div className="builder-preview-layout-panel-copy">
                <strong>{getViewportLabel(viewportMode)}</strong>
                <span>{getViewportHint(viewportMode)}</span>
              </div>
              <div className="builder-preview-segmented-grid builder-preview-segmented-grid--viewport">
                {VIEWPORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`builder-preview-segmented-btn${viewportMode === option.value ? ' is-active' : ''}`}
                    onClick={() => setViewportMode(option.value)}
                    aria-pressed={viewportMode === option.value}
                  >
                    <span>{option.label}</span>
                    <small>{option.hint}</small>
                  </button>
                ))}
              </div>
              <div className="builder-preview-layout-panel-copy">
                <strong>Zoom {zoomLevel}%</strong>
                <span>{zoomStatusCopy}</span>
              </div>
              <div className="builder-preview-segmented-grid builder-preview-segmented-grid--zoom">
                {ZOOM_OPTIONS.map((option) => (
                  <button
                    key={`zoom-${option}`}
                    type="button"
                    className={`builder-preview-segmented-btn${zoomLevel === option ? ' is-active' : ''}`}
                    onClick={() => setExactZoomLevel(option)}
                    aria-pressed={zoomLevel === option}
                  >
                    <span>{option}%</span>
                    <small>{option === DEFAULT_ZOOM_LEVEL ? 'Default' : 'Preview scale'}</small>
                  </button>
                ))}
              </div>
            </div>

            <div className="builder-preview-inspector-subtitle">Responsive visibility</div>
            <div className="builder-preview-layout-panel">
              <div className="builder-preview-layout-panel-copy">
                <strong>{selectedViewportVisibilityState.title}</strong>
                <span>{selectedViewportVisibilityState.detail}</span>
              </div>
            </div>

            <div className="builder-preview-inspector-subtitle">Section layout</div>
            <div className="builder-preview-layout-panel">
              <div className="builder-preview-layout-panel-copy">
                <strong>
                  {hasMultiSectionSelection
                    ? `${selectedSections.length} sections selected`
                    : formatSectionLayoutSummary(selectedSectionLayout)}
                </strong>
                <span>
                  {hasMultiSectionSelection
                    ? `Batch layout actions write to ${getViewportLabel(viewportMode).toLowerCase()}. Desktop edits base layout; tablet/mobile edits create or update overrides only.`
                    : selectedViewportLayoutState.detail}
                </span>
              </div>
              {!hasMultiSectionSelection ? (
                <div className="builder-preview-editor-note">
                  {selectedViewportLayoutState.title}
                </div>
              ) : null}
              <label className="builder-inspector-field">
                <span>Width</span>
                <div className="builder-preview-segmented-grid">
                  {SECTION_WIDTH_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`builder-preview-segmented-btn${selectedSectionLayout.width === option.value ? ' is-active' : ''}`}
                      disabled={selectionIncludesLockedSection}
                      onClick={() =>
                        updateSelectedSectionLayout({ width: option.value }, 'Adjust section width')
                      }
                    >
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </label>
              <label className="builder-inspector-field">
                <span>Alignment</span>
                <div className="builder-preview-segmented-grid">
                  {SECTION_ALIGNMENT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`builder-preview-segmented-btn${selectedSectionLayout.alignment === option.value ? ' is-active' : ''}`}
                      disabled={selectionIncludesLockedSection}
                      onClick={() =>
                        updateSelectedSectionLayout({ alignment: option.value }, 'Adjust section alignment')
                      }
                    >
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </label>
              <label className="builder-inspector-field">
                <span>Top spacing</span>
                <div className="builder-preview-segmented-grid">
                  {SECTION_SPACING_OPTIONS.map((option) => (
                    <button
                      key={`top-${option.value}`}
                      type="button"
                      className={`builder-preview-segmented-btn${selectedSectionLayout.spacingTop === option.value ? ' is-active' : ''}`}
                      disabled={selectionIncludesLockedSection}
                      onClick={() =>
                        updateSelectedSectionLayout({ spacingTop: option.value }, 'Adjust top spacing')
                      }
                    >
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </label>
              <label className="builder-inspector-field">
                <span>Bottom spacing</span>
                <div className="builder-preview-segmented-grid">
                  {SECTION_SPACING_OPTIONS.map((option) => (
                    <button
                      key={`bottom-${option.value}`}
                      type="button"
                      className={`builder-preview-segmented-btn${selectedSectionLayout.spacingBottom === option.value ? ' is-active' : ''}`}
                      disabled={selectionIncludesLockedSection}
                      onClick={() =>
                        updateSelectedSectionLayout({ spacingBottom: option.value }, 'Adjust bottom spacing')
                      }
                    >
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </label>
              <label className="builder-inspector-field">
                <span>Inline inset</span>
                <div className="builder-preview-segmented-grid">
                  {SECTION_SPACING_OPTIONS.map((option) => (
                    <button
                      key={`padding-inline-${option.value}`}
                      type="button"
                      className={`builder-preview-segmented-btn${selectedSectionLayout.paddingInline === option.value ? ' is-active' : ''}`}
                      disabled={selectionIncludesLockedSection}
                      onClick={() =>
                        updateSelectedSectionLayout({ paddingInline: option.value }, 'Adjust inline inset')
                      }
                    >
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </label>
              <label className="builder-inspector-field">
                <span>Block inset</span>
                <div className="builder-preview-segmented-grid">
                  {SECTION_SPACING_OPTIONS.map((option) => (
                    <button
                      key={`padding-block-${option.value}`}
                      type="button"
                      className={`builder-preview-segmented-btn${selectedSectionLayout.paddingBlock === option.value ? ' is-active' : ''}`}
                      disabled={selectionIncludesLockedSection}
                      onClick={() =>
                        updateSelectedSectionLayout({ paddingBlock: option.value }, 'Adjust block inset')
                      }
                    >
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </label>
              <div className="builder-preview-layout-panel-actions">
                <button
                  type="button"
                  className="builder-action-btn"
                  onClick={copySelectedSectionFrame}
                  disabled={selection.targetKind !== 'section'}
                >
                  Copy frame
                </button>
                <button
                  type="button"
                  className="builder-action-btn"
                  onClick={pasteSelectedSectionFrame}
                  disabled={!canPasteSectionFrame || selectionIncludesLockedSection}
                >
                  Paste frame
                </button>
                <button
                  type="button"
                  className="builder-action-btn"
                  onClick={resetSelectedSectionLayout}
                  disabled={(selectedSectionIndex < 0 && !selectedSections.length) || selectionIncludesLockedSection}
                >
                  {viewportMode === 'desktop'
                    ? hasMultiSectionSelection
                      ? 'Reset selected layouts'
                      : 'Reset section layout'
                    : hasMultiSectionSelection
                      ? `Reset ${getViewportLabel(viewportMode)} overrides`
                      : `Reset ${getViewportLabel(viewportMode)} override`}
                </button>
              </div>
            </div>

            {currentCollectionSection === 'home.faq' ? (
              <BuilderCollectionEditor
                title="FAQ items"
                subtitle="question / answer"
                itemCount={faqDraftItems.length}
                addLabel="Add FAQ item"
              >
                {selectedSectionLocked ? (
                  <p className="builder-preview-editor-note">
                    FAQ item editing is locked for this section. Unlock the section first.
                  </p>
                ) : null}
                {faqDraftItems.length > 0 ? (
                  faqDraftItems.map((item, index) => {
                    const active = activeCollectionIndex['home.faq'] === index;
                    return (
                      <article
                        key={`faq-item-${index}-${item.question}`}
                        className={`builder-collection-card${active ? ' is-active' : ''}`}
                        onClick={() =>
                          setActiveCollectionIndex((current) => ({
                            ...current,
                            'home.faq': index,
                          }))
                        }
                      >
                        <div className="builder-collection-item-context">
                          <span>FAQ item {index + 1}</span>
                          <span>{active ? 'focused' : 'click to focus'}</span>
                        </div>
                        <div className="builder-collection-card-head">
                          <div className="builder-collection-card-copy">
                            <strong>{item.question || `FAQ item ${index + 1}`}</strong>
                            <span>{truncateCopy(item.answer)}</span>
                          </div>
                          <div className="builder-collection-card-actions">
                            <button
                              type="button"
                              onClick={() =>
                                handleFaqItemsChange(
                                  (current) => insertAt(current, index + 1, cloneFaqItem(current[index])),
                                  index + 1
                                )
                              }
                              disabled={selectedSectionLocked}
                            >
                              Duplicate
                            </button>
                            <button
                              type="button"
                              onClick={() => handleFaqItemsChange((current) => moveItem(current, index, -1), index - 1)}
                              disabled={selectedSectionLocked || index === 0}
                            >
                              Up
                            </button>
                            <button
                              type="button"
                              onClick={() => handleFaqItemsChange((current) => moveItem(current, index, 1), index + 1)}
                              disabled={selectedSectionLocked || index === faqDraftItems.length - 1}
                            >
                              Down
                            </button>
                            <button
                              type="button"
                              className="is-danger"
                              onClick={() =>
                                handleFaqItemsChange(
                                  (current) => removeAt(current, index),
                                  clampCollectionIndex(index, faqDraftItems.length - 1)
                                )
                              }
                              disabled={selectedSectionLocked}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        <div className="builder-collection-card-fields">
                          <label className="builder-inspector-field">
                            <span>Question</span>
                            <input
                              type="text"
                              value={item.question}
                              disabled={selectedSectionLocked}
                              onChange={(event) =>
                                handleFaqItemsChange(
                                  (current) =>
                                    updateAt(current, index, {
                                      ...current[index],
                                      question: event.target.value,
                                    }),
                                  index
                                )
                              }
                            />
                          </label>
                          <label className="builder-inspector-field">
                            <span>Answer</span>
                            <textarea
                              rows={5}
                              value={item.answer}
                              disabled={selectedSectionLocked}
                              onChange={(event) =>
                                handleFaqItemsChange(
                                  (current) =>
                                    updateAt(current, index, {
                                      ...current[index],
                                      answer: event.target.value,
                                    }),
                                  index
                                )
                              }
                            />
                          </label>
                        </div>
                      </article>
                    );
                  })
                ) : (
                  <div className="builder-empty-state">No FAQ items. Add one to reopen the section.</div>
                )}
                <button
                  type="button"
                  className="builder-action-btn builder-action-btn--primary"
                  onClick={() =>
                    handleFaqItemsChange((current) => [...current, createEmptyFaqItem(locale)], faqDraftItems.length)
                  }
                  disabled={selectedSectionLocked}
                >
                  Add FAQ item
                </button>
              </BuilderCollectionEditor>
            ) : null}

            {currentCollectionSection === 'home.services' ? (
              <BuilderCollectionEditor
                title="Service items"
                subtitle="title / description / href"
                itemCount={serviceItems.length}
                addLabel="Add service item"
              >
                {selectedSectionLocked ? (
                  <p className="builder-preview-editor-note">
                    Service item editing is locked for this section. Unlock the section first.
                  </p>
                ) : null}
                {serviceItems.length > 0 ? (
                  serviceItems.map((item, index) => {
                    const active = activeCollectionIndex['home.services'] === index;
                    return (
                      <article
                        key={`service-item-${index}-${item.title}`}
                        className={`builder-collection-card${active ? ' is-active' : ''}`}
                        onClick={() =>
                          setActiveCollectionIndex((current) => ({
                            ...current,
                            'home.services': index,
                          }))
                        }
                      >
                        <div className="builder-collection-item-context">
                          <span>Service item {index + 1}</span>
                          <span>{active ? 'focused' : 'click to focus'}</span>
                        </div>
                        <div className="builder-collection-card-head">
                          <div className="builder-collection-card-copy">
                            <strong>{item.title || `Service item ${index + 1}`}</strong>
                            <span>{truncateCopy(item.description)}</span>
                          </div>
                          <div className="builder-collection-card-actions">
                            <button
                              type="button"
                              onClick={() =>
                                handleServiceItemsChange(
                                  (current) => insertAt(current, index + 1, cloneServiceItem(current[index])),
                                  index + 1
                                )
                              }
                              disabled={selectedSectionLocked}
                            >
                              Duplicate
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleServiceItemsChange((current) => moveItem(current, index, -1), index - 1)
                              }
                              disabled={selectedSectionLocked || index === 0}
                            >
                              Up
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleServiceItemsChange((current) => moveItem(current, index, 1), index + 1)
                              }
                              disabled={selectedSectionLocked || index === serviceItems.length - 1}
                            >
                              Down
                            </button>
                            <button
                              type="button"
                              className="is-danger"
                              onClick={() =>
                                handleServiceItemsChange(
                                  (current) => removeAt(current, index),
                                  clampCollectionIndex(index, serviceItems.length - 1)
                                )
                              }
                              disabled={selectedSectionLocked}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        <div className="builder-collection-card-fields">
                          <label className="builder-inspector-field">
                            <span>Title</span>
                            <input
                              type="text"
                              value={item.title}
                              disabled={selectedSectionLocked}
                              onChange={(event) =>
                                handleServiceItemsChange(
                                  (current) =>
                                    updateAt(current, index, {
                                      ...current[index],
                                      title: event.target.value,
                                    }),
                                  index
                                )
                              }
                            />
                          </label>
                          <label className="builder-inspector-field">
                            <span>Description</span>
                            <textarea
                              rows={5}
                              value={item.description}
                              disabled={selectedSectionLocked}
                              onChange={(event) =>
                                handleServiceItemsChange(
                                  (current) =>
                                    updateAt(current, index, {
                                      ...current[index],
                                      description: event.target.value,
                                    }),
                                  index
                                )
                              }
                            />
                          </label>
                          <label className="builder-inspector-field">
                            <span>Href</span>
                            <input
                              type="text"
                              value={item.href}
                              disabled={selectedSectionLocked}
                              onChange={(event) =>
                                handleServiceItemsChange(
                                  (current) =>
                                    updateAt(current, index, {
                                      ...current[index],
                                      href: event.target.value,
                                    }),
                                  index
                                )
                              }
                            />
                          </label>
                        </div>
                      </article>
                    );
                  })
                ) : (
                  <div className="builder-empty-state">No service items. Add one to restore the repeater block.</div>
                )}
                <button
                  type="button"
                  className="builder-action-btn builder-action-btn--primary"
                  onClick={() =>
                    handleServiceItemsChange(
                      (current) => [...current, createEmptyServiceItem(locale)],
                      serviceItems.length
                    )
                  }
                  disabled={selectedSectionLocked}
                >
                  Add service item
                </button>
              </BuilderCollectionEditor>
            ) : null}

            <div className="builder-preview-inspector-subtitle">Editable values</div>
            <div className="builder-preview-editor-fields">
              {renderEditorFields({
                locale,
                selection,
                selectedValues,
                selectedImageWorkflow,
                imageUploadPending,
                imageUploadError,
                imageUploadNotice,
                assetLibraryItems,
                assetLibraryPending,
                assetLibraryError,
                onChange: applySelectedSurfaceOverride,
                onImageFileChange: handleImageFileSelection,
                onAssetLibraryRefresh: () => {
                  void loadAssetLibrary({ force: true });
                },
                onAssetLibrarySelect: applyAssetLibraryItem,
              })}
            </div>

            <div className="builder-preview-inspector-subtitle">Next hooks</div>
            <ul className="builder-preview-inspector-notes">
              {buildNextHooks(selection.targetKind, selectedDefinition).map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

function BuilderCollectionEditor({
  title,
  subtitle,
  itemCount,
  addLabel,
  children,
}: {
  title: string;
  subtitle: string;
  itemCount: number;
  addLabel: string;
  children: ReactNode;
}) {
  return (
    <>
      <div className="builder-preview-inspector-subtitle">Collection editor</div>
      <div className="builder-collection-editor">
        <div className="builder-collection-editor-head">
          <div>
            <div className="builder-preview-inspector-label">COLLECTION</div>
            <div className="builder-collection-editor-title">
              {title} · {itemCount}
            </div>
            <p className="builder-preview-editor-note">{subtitle}</p>
          </div>
          <div className="builder-preview-collection-label">{addLabel}</div>
        </div>
        <div className="builder-collection-editor-list">{children}</div>
      </div>
    </>
  );
}

function createSectionSelection(
  sectionKey: BuilderSectionKey,
  sectionId: string
): BuilderSelectionState {
  return {
    sectionId,
    sectionKey,
    targetKind: 'section',
    targetLabel: homeSectionRegistry[sectionKey].title,
    supported: true,
  };
}

function createContentGroupSelection(
  sectionKey: BuilderSectionKey,
  sectionId: string,
  contentGroupId: string,
  targetLabel: string
): BuilderSelectionState {
  return {
    sectionId,
    sectionKey,
    contentGroupId,
    targetKind: 'group',
    targetLabel,
    supported: true,
  };
}

function resolveSelectionForDocument(
  document: BuilderPageDocument,
  preferredSectionKey?: BuilderSectionKey
): BuilderSelectionState {
  const preferredSection =
    (preferredSectionKey
      ? document.root.children.find((section) => section.sectionKey === preferredSectionKey)
      : null) ??
    document.root.children.find((section) => !section.hidden) ??
    document.root.children[0];

  if (!preferredSection) {
    throw new Error('Builder document must contain at least one section.');
  }

  return createSectionSelection(preferredSection.sectionKey, preferredSection.id);
}

function areCanvasSectionRectMapsEqual(
  left: Record<string, BuilderCanvasSectionRect>,
  right: Record<string, BuilderCanvasSectionRect>
) {
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);

  if (leftKeys.length !== rightKeys.length) {
    return false;
  }

  return leftKeys.every((key) => {
    const leftRect = left[key];
    const rightRect = right[key];

    if (!leftRect || !rightRect) {
      return false;
    }

    return (
      leftRect.sectionKey === rightRect.sectionKey &&
      areCloseRectValue(leftRect.top, rightRect.top) &&
      areCloseRectValue(leftRect.left, rightRect.left) &&
      areCloseRectValue(leftRect.width, rightRect.width) &&
      areCloseRectValue(leftRect.height, rightRect.height) &&
      areCloseRectValue(leftRect.bottom, rightRect.bottom)
    );
  });
}

function areCanvasContentGroupRectMapsEqual(
  left: Record<string, BuilderCanvasContentGroupRect>,
  right: Record<string, BuilderCanvasContentGroupRect>
) {
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);

  if (leftKeys.length !== rightKeys.length) {
    return false;
  }

  return leftKeys.every((key) => {
    const leftRect = left[key];
    const rightRect = right[key];

    if (!leftRect || !rightRect) {
      return false;
    }

    return (
      leftRect.sectionId === rightRect.sectionId &&
      leftRect.sectionKey === rightRect.sectionKey &&
      leftRect.groupKey === rightRect.groupKey &&
      leftRect.label === rightRect.label &&
      areSceneBoundsEqual(leftRect, rightRect)
    );
  });
}

function areCloseRectValue(left: number, right: number) {
  return Math.abs(left - right) < 0.5;
}

function areSceneBoundsEqual(
  left: BuilderSceneNodeBounds | null | undefined,
  right: BuilderSceneNodeBounds | null | undefined
) {
  if (!left && !right) {
    return true;
  }

  if (!left || !right) {
    return false;
  }

  return (
    areCloseRectValue(left.x, right.x) &&
    areCloseRectValue(left.y, right.y) &&
    areCloseRectValue(left.width, right.width) &&
    areCloseRectValue(left.height, right.height)
  );
}

function annotateSurfaceTargets(
  surface: HTMLDivElement | null,
  sectionId: string,
  sectionKey: BuilderSectionKey
): SurfaceDescriptor[] {
  if (!surface) return [];

  surface.querySelectorAll<HTMLElement>(ANNOTATED_SELECTOR).forEach((element) => {
    element.classList.remove('is-builder-selected');
    delete element.dataset.builderSurfaceKind;
    delete element.dataset.builderSurfaceId;
    delete element.dataset.builderSurfaceLabel;
  });

  const descriptors: SurfaceDescriptor[] = [];
  let textIndex = 0;
  let buttonIndex = 0;
  let imageIndex = 0;

  Array.from(surface.querySelectorAll<HTMLElement>(BUTTON_SELECTOR))
    .filter((element) => !isBuilderUiElement(element))
    .forEach((element) => {
      buttonIndex += 1;
      const labelTarget = findButtonLabelElement(element) ?? element;
      const declaredSurfaceId = element.dataset.builderSurfaceKey?.trim();
      descriptors.push(
        createDescriptor({
          element,
          sectionId,
          sectionKey,
          kind: 'button',
          surfaceId:
            declaredSurfaceId || `button-${String(buttonIndex).padStart(2, '0')}`,
          label: getElementSummary(labelTarget),
        })
      );
    });

  Array.from(surface.querySelectorAll<HTMLImageElement>(IMAGE_SELECTOR))
    .filter((element) => !isBuilderUiElement(element))
    .forEach((element) => {
      imageIndex += 1;
      const declaredSurfaceId = element.dataset.builderSurfaceKey?.trim();
      descriptors.push(
        createDescriptor({
          element,
          sectionId,
          sectionKey,
          kind: 'image',
          surfaceId:
            declaredSurfaceId || `image-${String(imageIndex).padStart(2, '0')}`,
          label: getElementSummary(element),
          baseAlt: getImageAltValue(element),
          baseSrc: getImageSrcValue(element),
        })
      );
    });

  Array.from(surface.querySelectorAll<HTMLElement>(TEXT_SELECTOR))
    .filter((element) => {
      if (isBuilderUiElement(element)) return false;
      const buttonAncestor = element.closest(BUTTON_SELECTOR);
      if (buttonAncestor && surface.contains(buttonAncestor)) return false;
      return isMeaningfulTextSurface(element);
    })
    .forEach((element) => {
      textIndex += 1;
      const declaredSurfaceId = element.dataset.builderSurfaceKey?.trim();
      descriptors.push(
        createDescriptor({
          element,
          sectionId,
          sectionKey,
          kind: 'text',
          surfaceId:
            declaredSurfaceId || `text-${String(textIndex).padStart(2, '0')}`,
          label: getElementSummary(element),
        })
      );
    });

  return descriptors;
}

function annotateContentGroupTargets(
  surface: HTMLDivElement | null,
  sectionId: string,
  sectionKey: BuilderSectionKey
): BuilderContentGroupDescriptor[] {
  if (!surface) return [];

  surface.querySelectorAll<HTMLElement>(CONTENT_GROUP_SELECTOR).forEach((element) => {
    delete element.dataset.builderContentGroupId;
    delete element.dataset.builderContentGroupLabel;
  });

  return getBuilderSectionContentGroups(sectionKey).reduce<BuilderContentGroupDescriptor[]>(
    (acc, group) => {
      const groupElement = surface.querySelector<HTMLElement>(
        `[data-builder-node-key="${group.groupKey}"]`
      );
      if (!groupElement || isBuilderUiElement(groupElement)) {
        return acc;
      }

      const contentGroupId = buildBuilderContentGroupNodeId(sectionKey, group.groupKey);
      groupElement.dataset.builderContentGroupId = contentGroupId;
      groupElement.dataset.builderContentGroupLabel = group.label;

      acc.push({
        sectionId,
        sectionKey,
        contentGroupId,
        groupKey: group.groupKey,
        label: group.label,
        surfaceIds: [...(group.surfaceIds ?? [])],
        datasetTargetIds: [...(group.datasetTargetIds ?? [])],
      });
      return acc;
    },
    []
  );
}

function createDescriptor({
  element,
  sectionId,
  sectionKey,
  kind,
  surfaceId,
  label,
  baseAlt,
  baseSrc,
}: {
  element: HTMLElement;
  sectionId: string;
  sectionKey: BuilderSectionKey;
  kind: BuilderEditableTargetKind;
  surfaceId: string;
  label: string;
  baseAlt?: string;
  baseSrc?: string;
}): SurfaceDescriptor {
  element.dataset.builderSurfaceKind = kind;
  element.dataset.builderSurfaceId = surfaceId;
  element.dataset.builderSurfaceLabel = label;
  if (typeof baseAlt === 'string') {
    element.dataset.builderBaseAlt = baseAlt;
  }
  if (typeof baseSrc === 'string') {
    element.dataset.builderBaseSrc = baseSrc;
  }

  return {
    sectionId,
    sectionKey,
    surfaceId,
    kind,
    label,
    baseAlt,
    baseSrc,
  };
}

function handleSurfaceClick({
  event,
  sectionId,
  sectionKey,
  definition,
  onSelect,
}: {
  event: React.MouseEvent<HTMLDivElement>;
  sectionId: string;
  sectionKey: BuilderSectionKey;
  definition: BuilderSectionDefinition;
  onSelect: (selection: BuilderSelectionState) => void;
}) {
  const surface = event.currentTarget;
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    onSelect(createSectionSelection(sectionKey, sectionId));
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  const classified = classifyTarget(target, surface);
  if (!classified) {
    onSelect({
      sectionId,
      sectionKey,
      targetKind: 'unknown',
      targetLabel: getElementSummary(target),
      supported: false,
    });
    return;
  }

  onSelect({
    sectionId,
    sectionKey,
    contentGroupId: classified.contentGroupId,
    surfaceId: classified.surfaceId,
    targetKind: classified.kind,
    targetLabel: classified.label,
    supported:
      classified.kind === 'section' ||
      classified.kind === 'group' ||
      (classified.kind !== 'unknown' && definition.supportedTargets.includes(classified.kind)),
  });
}

function classifyTarget(
  target: HTMLElement,
  surface: HTMLElement
): {
  kind: BuilderSelectableTargetKind;
  label: string;
  contentGroupId?: string;
  surfaceId?: string;
} | null {
  if (target.closest('.builder-preview-surface-pill')) {
    return { kind: 'section', label: 'Section frame' };
  }

  const annotated = target.closest(ANNOTATED_SELECTOR);
  if (!(annotated instanceof HTMLElement) || !surface.contains(annotated)) {
    const contentGroup = target.closest(CONTENT_GROUP_SELECTOR);
    if (!(contentGroup instanceof HTMLElement) || !surface.contains(contentGroup)) {
      return null;
    }

    const contentGroupId = contentGroup.dataset.builderContentGroupId;
    const label = contentGroup.dataset.builderContentGroupLabel || 'Content group';
    if (!contentGroupId) {
      return null;
    }

    return {
      kind: 'group',
      label,
      contentGroupId,
    };
  }

  const kind = annotated.dataset.builderSurfaceKind as BuilderEditableTargetKind | undefined;
  const surfaceId = annotated.dataset.builderSurfaceId;
  const label = annotated.dataset.builderSurfaceLabel || getElementSummary(annotated);
  const contentGroup = annotated.closest(CONTENT_GROUP_SELECTOR);
  const contentGroupId =
    contentGroup instanceof HTMLElement ? contentGroup.dataset.builderContentGroupId : undefined;

  if (!kind || !surfaceId) return null;
  return {
    kind,
    label,
    contentGroupId,
    surfaceId,
  };
}

function getSelectedDescriptor(
  descriptorsBySection: Record<string, SurfaceDescriptor[]>,
  selection: BuilderSelectionState
) {
  if (!selection.surfaceId) return null;
  return (
    descriptorsBySection[selection.sectionId]?.find(
      (descriptor) => descriptor.surfaceId === selection.surfaceId
    ) ?? null
  );
}

function getSelectedContentGroup(
  contentGroupsBySection: Record<string, BuilderContentGroupDescriptor[]>,
  selection: BuilderSelectionState
) {
  if (!selection.contentGroupId) {
    return null;
  }

  return (
    contentGroupsBySection[selection.sectionId]?.find(
      (descriptor) => descriptor.contentGroupId === selection.contentGroupId
    ) ?? null
  );
}

function getSelectedElement(
  surfaceMap: Record<string, HTMLDivElement | null>,
  selection: BuilderSelectionState
) {
  if (!selection.surfaceId) return null;
  const surface = surfaceMap[selection.sectionId];
  return surface ? surface.querySelector<HTMLElement>(`[data-builder-surface-id="${selection.surfaceId}"]`) : null;
}

function measureContentGroupBounds(
  surface: HTMLElement,
  groupElement: HTMLElement,
  scaleNormalization: number
): BuilderSceneNodeBounds {
  const surfaceRect = surface.getBoundingClientRect();
  const groupRect = resolveContentGroupRect(groupElement);
  const divisor = scaleNormalization > 0 ? scaleNormalization : 1;

  return {
    x: roundSceneBoundsValue((groupRect.left - surfaceRect.left) / divisor),
    y: roundSceneBoundsValue((groupRect.top - surfaceRect.top) / divisor),
    width: roundSceneBoundsValue(groupRect.width / divisor),
    height: roundSceneBoundsValue(groupRect.height / divisor),
  };
}

function resolveContentGroupRect(groupElement: HTMLElement) {
  const baseRect = groupElement.getBoundingClientRect();
  if (baseRect.width > 0 || baseRect.height > 0) {
    return baseRect;
  }

  const measurableChildren = Array.from(groupElement.querySelectorAll<HTMLElement>('*'))
    .filter((node) => !isBuilderUiElement(node))
    .map((node) => node.getBoundingClientRect())
    .filter((rect) => rect.width > 0 || rect.height > 0);

  if (!measurableChildren.length) {
    return baseRect;
  }

  const left = Math.min(...measurableChildren.map((rect) => rect.left));
  const top = Math.min(...measurableChildren.map((rect) => rect.top));
  const right = Math.max(...measurableChildren.map((rect) => rect.right));
  const bottom = Math.max(...measurableChildren.map((rect) => rect.bottom));

  return {
    ...baseRect,
    left,
    top,
    right,
    bottom,
    width: right - left,
    height: bottom - top,
    x: left,
    y: top,
    toJSON: baseRect.toJSON.bind(baseRect),
  };
}

function roundSceneBoundsValue(value: number) {
  return Math.round(value * 100) / 100;
}

function clampContentGroupBoundsToSection(
  bounds: BuilderSceneNodeBounds,
  sectionWidth: number | null,
  sectionHeight: number | null
): BuilderSceneNodeBounds {
  const maxX =
    typeof sectionWidth === 'number' ? Math.max(0, sectionWidth - bounds.width) : bounds.x;
  const maxY =
    typeof sectionHeight === 'number' ? Math.max(0, sectionHeight - bounds.height) : bounds.y;

  return {
    ...bounds,
    x: roundSceneBoundsValue(
      typeof sectionWidth === 'number' ? Math.min(Math.max(bounds.x, 0), maxX) : bounds.x
    ),
    y: roundSceneBoundsValue(
      typeof sectionHeight === 'number' ? Math.min(Math.max(bounds.y, 0), maxY) : bounds.y
    ),
  };
}

function clampContentGroupResizeBoundsToSection(
  bounds: BuilderSceneNodeBounds,
  sectionWidth: number | null,
  sectionHeight: number | null
): BuilderSceneNodeBounds {
  const width = roundSceneBoundsValue(Math.max(48, bounds.width));
  const height = roundSceneBoundsValue(Math.max(48, bounds.height));
  const maxWidth =
    typeof sectionWidth === 'number' ? Math.max(48, sectionWidth - bounds.x) : width;
  const maxHeight =
    typeof sectionHeight === 'number' ? Math.max(48, sectionHeight - bounds.y) : height;

  return {
    ...bounds,
    width: typeof sectionWidth === 'number' ? Math.min(width, maxWidth) : width,
    height: typeof sectionHeight === 'number' ? Math.min(height, maxHeight) : height,
  };
}

function getDisplayContentGroupBounds(
  document: BuilderPageDocument,
  section: BuilderSectionNode,
  contentGroupId: string,
  viewport: BuilderViewportMode
) {
  const persistedNode = document.scene?.nodes?.find(
    (candidate) =>
      candidate.nodeKind === 'content-group' &&
      candidate.sectionKey === section.sectionKey &&
      candidate.nodeId === contentGroupId
  );
  if (persistedNode) {
    if (persistedNode.source === 'page-scene') {
      return (
        resolveViewportSceneBounds(persistedNode.bounds, persistedNode.overrides, viewport) ??
        resolveViewportSceneBounds(
          persistedNode.measuredBounds,
          persistedNode.measuredOverrides,
          viewport
        )
      );
    }

    return (
      resolveViewportSceneBounds(
        persistedNode.measuredBounds,
        persistedNode.measuredOverrides,
        viewport
      ) ??
      resolveViewportSceneBounds(persistedNode.bounds, persistedNode.overrides, viewport)
    );
  }

  const group =
    section.props?.scene?.groups?.find((candidate) => candidate.nodeId === contentGroupId);
  if (!group) {
    return undefined;
  }

  return resolveViewportSceneBounds(
    group.bounds ?? group.measuredBounds,
    group.overrides ?? group.measuredOverrides,
    viewport
  );
}

function getMeasuredContentGroupBounds(
  document: BuilderPageDocument,
  section: BuilderSectionNode,
  contentGroupId: string,
  viewport: BuilderViewportMode
) {
  const persistedNode = document.scene?.nodes?.find(
    (candidate) =>
      candidate.nodeKind === 'content-group' &&
      candidate.sectionKey === section.sectionKey &&
      candidate.nodeId === contentGroupId
  );
  if (persistedNode?.measuredBounds || persistedNode?.measuredOverrides) {
    return resolveViewportSceneBounds(
      persistedNode.measuredBounds,
      persistedNode.measuredOverrides,
      viewport
    );
  }

  const group = section.props?.scene?.groups?.find((candidate) => candidate.nodeId === contentGroupId);
  if (!group) {
    return undefined;
  }

  return resolveViewportSceneBounds(group.measuredBounds ?? group.bounds, group.measuredOverrides, viewport);
}

function resolveViewportSceneBounds(
  baseBounds: BuilderSceneNodeBounds | undefined,
  overrides: Partial<Record<'tablet' | 'mobile', Partial<BuilderSceneNodeBounds>>> | undefined,
  viewport: BuilderViewportMode
) {
  if (viewport === 'desktop') {
    return baseBounds;
  }

  const override = overrides?.[viewport];
  if (!override && baseBounds) {
    return baseBounds;
  }

  const x = override?.x ?? baseBounds?.x;
  const y = override?.y ?? baseBounds?.y;
  const width = override?.width ?? baseBounds?.width;
  const height = override?.height ?? baseBounds?.height;

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

function getPersistedContentGroupSource(
  document: BuilderPageDocument,
  sectionKey: BuilderSectionKey,
  contentGroupId: string
): BuilderPersistedSceneNodeSource | undefined {
  return document.scene?.nodes?.find(
    (candidate) =>
      candidate.nodeKind === 'content-group' &&
      candidate.sectionKey === sectionKey &&
      candidate.nodeId === contentGroupId
  )?.source;
}

function summarizeBuilderSceneStatus(
  document: BuilderPageDocument | null | undefined
): BuilderSceneStatusSummary {
  const sceneNodes = Array.isArray(document?.scene?.nodes) ? document?.scene?.nodes ?? [] : [];
  const sceneAuthorityNodeCount = sceneNodes.filter((node) => node.source === 'page-scene').length;

  return {
    sceneNodeCount: sceneNodes.length,
    sceneAuthorityNodeCount,
    sceneSeedNodeCount: sceneNodes.length - sceneAuthorityNodeCount,
  };
}

function formatSceneSummaryCopy(
  summary: BuilderSceneStatusSummary,
  label: string
): string {
  if (summary.sceneNodeCount === 0) {
    return `${label} is still empty. The current slot has no promoted page.scene groups yet.`;
  }

  return `${label}: ${summary.sceneNodeCount} promoted scene nodes · ${summary.sceneAuthorityNodeCount} authoritative · ${summary.sceneSeedNodeCount} bridge-derived.`;
}

function getEditableValues(
  element: HTMLElement | null,
  descriptor: SurfaceDescriptor | null,
  selection: BuilderSelectionState,
  overrides: Record<string, BuilderSurfaceOverride>
): EditableValues {
  const base: EditableValues = {
    text: '',
    href: '',
    alt: '',
    src: '',
  };

  if (!descriptor || !selection.surfaceId) return base;

  const override = overrides[getOverrideKey(selection.sectionId, selection.surfaceId)];

  switch (descriptor.kind) {
    case 'text':
      return {
        ...base,
        text: override?.text ?? getTextValue(element),
      };
    case 'button':
      return {
        ...base,
        text: override?.text ?? getButtonTextValue(element),
        href: override?.href ?? getButtonHrefValue(element),
      };
    case 'image': {
      const baseAlt = descriptor.baseAlt ?? getImageAltValue(element);
      const baseSrc = descriptor.baseSrc ?? getImageSrcValue(element);
      return {
        ...base,
        alt: override?.alt ?? baseAlt,
        src: resolveImageSourceValue(override?.src, baseSrc),
      };
    }
    default:
      return base;
  }
}

function renderEditorFields({
  locale,
  selection,
  selectedValues,
  selectedImageWorkflow,
  imageUploadPending,
  imageUploadError,
  imageUploadNotice,
  assetLibraryItems,
  assetLibraryPending,
  assetLibraryError,
  onChange,
  onImageFileChange,
  onAssetLibraryRefresh,
  onAssetLibrarySelect,
}: {
  locale: Locale;
  selection: BuilderSelectionState;
  selectedValues: EditableValues;
  selectedImageWorkflow: BuilderImageWorkflowState | null;
  imageUploadPending: boolean;
  imageUploadError: string | null;
  imageUploadNotice: string | null;
  assetLibraryItems: BuilderAssetLibraryItem[];
  assetLibraryPending: boolean;
  assetLibraryError: string | null;
  onChange: (partial: Partial<BuilderSurfaceOverride>) => void;
  onImageFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onAssetLibraryRefresh: () => void;
  onAssetLibrarySelect: (asset: BuilderAssetLibraryItem) => void;
}) {
  if (!selection.supported) {
    return (
      <p className="builder-preview-editor-note">
        이 영역은 아직 semantic wrapper가 없어 직접 편집할 수 없습니다.
      </p>
    );
  }

  if (!selection.surfaceId || selection.targetKind === 'section') {
    return (
      <p className="builder-preview-editor-note">
        섹션 안의 text, button, image surface를 클릭하면 여기서 값을 바꿀 수 있습니다.
      </p>
    );
  }

  if (selection.targetKind === 'text') {
    return (
      <label className="builder-preview-editor-field">
        <span>Text</span>
        <textarea
          rows={4}
          value={selectedValues.text}
          onChange={(event) => onChange({ text: event.target.value })}
        />
      </label>
    );
  }

  if (selection.targetKind === 'button') {
    return (
      <>
        <label className="builder-preview-editor-field">
          <span>Label</span>
          <input
            type="text"
            value={selectedValues.text}
            onChange={(event) => onChange({ text: event.target.value })}
          />
        </label>
        <label className="builder-preview-editor-field">
          <span>Href</span>
          <input
            type="text"
            value={selectedValues.href}
            onChange={(event) => onChange({ href: event.target.value })}
          />
        </label>
      </>
    );
  }

  if (selection.targetKind === 'image') {
    return (
      <div className="builder-image-workflow">
        <div className="builder-image-workflow-preview">
          {selectedImageWorkflow?.previewSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={selectedImageWorkflow.previewSrc} alt={selectedImageWorkflow.previewAlt} />
          ) : (
            <div className="builder-image-workflow-preview-empty">
              No image source is linked yet. Use the source field to restore or replace it.
            </div>
          )}
        </div>

        <dl className="builder-image-workflow-meta">
          <div>
            <dt>Selection</dt>
            <dd>{selection.targetLabel}</dd>
          </div>
          <div>
            <dt>Current source</dt>
            <dd>{selectedImageWorkflow?.currentSourceSummary ?? 'No source URL'}</dd>
          </div>
          <div>
            <dt>Original source</dt>
            <dd>{selectedImageWorkflow?.baseSourceSummary ?? 'No source URL'}</dd>
          </div>
          <div>
            <dt>Alt status</dt>
            <dd>{selectedImageWorkflow?.altSummary ?? 'Alt text missing'}</dd>
          </div>
          <div>
            <dt>Source status</dt>
            <dd>{selectedImageWorkflow?.sourceSummary ?? 'Using original source'}</dd>
          </div>
          <div>
            <dt>Edit state</dt>
            <dd>{selectedImageWorkflow?.hasOverride ? 'Edited' : 'Original'}</dd>
          </div>
          <div>
            <dt>Current governance</dt>
            <dd>{selectedImageWorkflow?.currentGovernanceSummary ?? 'No governed source'}</dd>
          </div>
          <div>
            <dt>Original governance</dt>
            <dd>{selectedImageWorkflow?.baseGovernanceSummary ?? 'No governed source'}</dd>
          </div>
        </dl>

        <div className="builder-image-workflow-actions">
          <button
            type="button"
            className="builder-action-btn builder-action-btn--primary"
            onClick={() => {
              if (!selectedImageWorkflow) return;
              onChange({
                alt: selectedImageWorkflow.baseAlt,
                src: selectedImageWorkflow.baseSrc,
              });
            }}
          >
            Reset to original
          </button>
          <button
            type="button"
            className="builder-action-btn"
            onClick={() => {
              onChange({ alt: '' });
            }}
          >
            Clear alt
          </button>
          <a
            className={`builder-action-btn builder-image-workflow-link${selectedImageWorkflow?.currentSrc ? '' : ' is-disabled'}`}
            href={resolveImageLinkHref(selectedImageWorkflow?.currentSrc ?? '')}
            target="_blank"
            rel="noreferrer"
            aria-disabled={!selectedImageWorkflow?.currentSrc}
            onClick={(event) => {
              if (!selectedImageWorkflow?.currentSrc) {
                event.preventDefault();
              }
            }}
          >
            Open image link
          </a>
        </div>

        <div className="builder-image-upload-panel">
          <div className="builder-image-upload-copy">
            <strong>Replace image</strong>
            <span>Upload JPG, PNG, WEBP, GIF, or AVIF up to 8 MB. The uploaded file becomes the draft source URL.</span>
          </div>
          <label
            className={`builder-image-upload-dropzone${imageUploadPending ? ' is-pending' : ''}`}
          >
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
              onChange={onImageFileChange}
              disabled={imageUploadPending}
            />
            <span>{imageUploadPending ? 'Uploading replacement…' : 'Choose image file'}</span>
            <small>
              {imageUploadPending
                ? 'Sending to builder asset storage.'
                : 'Use upload for governed assets, or paste a URL below for external images.'}
            </small>
          </label>
          {imageUploadNotice ? (
            <p className="builder-image-upload-status is-success" role="status" aria-live="polite">
              {imageUploadNotice}
            </p>
          ) : null}
          {imageUploadError ? (
            <p className="builder-image-upload-status is-error" role="status" aria-live="polite">
              {imageUploadError}
            </p>
          ) : null}
        </div>

        <BuilderInspectorAssetLibraryPanel
          title="Recent builder assets"
          description="Reuse a recent upload for this locale instead of pasting a new image URL."
          locale={locale}
          items={assetLibraryItems.map((asset) => ({
            ...asset,
            isActive: selectedValues.src.trim() === asset.url,
          }))}
          pending={assetLibraryPending}
          error={assetLibraryError}
          onRefresh={onAssetLibraryRefresh}
          refreshDisabled={assetLibraryPending}
          onSelect={onAssetLibrarySelect}
          selectLabel="Use this image"
          selectedLabel="Selected"
        />

        <label className="builder-preview-editor-field">
          <span>Alt</span>
          <input
            type="text"
            value={selectedValues.alt}
            onChange={(event) => onChange({ alt: event.target.value })}
          />
        </label>
        <label className="builder-preview-editor-field">
          <span>Image URL</span>
          <input
            type="text"
            value={selectedValues.src}
            onChange={(event) => onChange({ src: event.target.value })}
          />
        </label>
        <p className="builder-preview-editor-note">
          빈 URL은 원본 source로 돌아갑니다. 업로드한 파일은 builder asset URL로 저장되고, 외부 URL은 그대로
          draft source로 사용됩니다.
        </p>
        <p className="builder-preview-editor-note">
          {selectedImageWorkflow?.publishGovernanceSummary ??
            'Publish governance will appear once an image source is selected.'}
        </p>
      </div>
    );
  }

  return (
    <p className="builder-preview-editor-note">
      이 surface는 아직 값 편집 패널이 연결되지 않았습니다.
    </p>
  );
}

function applyOverridesToSurfaces(
  surfaceMap: Record<string, HTMLDivElement | null>,
  descriptorsBySection: Record<string, SurfaceDescriptor[]>,
  overrides: Record<string, BuilderSurfaceOverride>
) {
  for (const [sectionId, descriptors] of Object.entries(descriptorsBySection)) {
    const surface = surfaceMap[sectionId];
    if (!surface) continue;

    for (const descriptor of descriptors) {
      const override = overrides[getOverrideKey(sectionId, descriptor.surfaceId)];
      if (!override) continue;

      const element = surface.querySelector<HTMLElement>(`[data-builder-surface-id="${descriptor.surfaceId}"]`);
      if (!element) continue;

      switch (descriptor.kind) {
        case 'text':
          applyTextOverride(element, override);
          break;
        case 'button':
          applyButtonOverride(element, override);
          break;
        case 'image':
          applyImageOverride(element, override, descriptor);
          break;
      }
    }
  }
}

function syncSelectedSurface(
  surfaceMap: Record<string, HTMLDivElement | null>,
  selection: BuilderSelectionState
) {
  Object.values(surfaceMap).forEach((surface) => {
    surface?.querySelectorAll<HTMLElement>(ANNOTATED_SELECTOR).forEach((element) => {
      element.classList.remove('is-builder-selected');
    });
  });

  if (!selection.surfaceId) return;
  const surface = surfaceMap[selection.sectionId];
  const selected = surface?.querySelector<HTMLElement>(`[data-builder-surface-id="${selection.surfaceId}"]`);
  selected?.classList.add('is-builder-selected');
}

function applyTextOverride(element: HTMLElement, override: BuilderSurfaceOverride) {
  const nextText = override.text ?? '';
  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
    element.value = nextText;
    return;
  }
  if (element instanceof HTMLSelectElement) {
    const option = Array.from(element.options).find((candidate) => candidate.text === nextText);
    if (option) {
      element.value = option.value;
    }
    return;
  }
  element.textContent = nextText;
}

function applyButtonOverride(element: HTMLElement, override: BuilderSurfaceOverride) {
  const labelTarget = findButtonLabelElement(element) ?? element;
  const nextText = override.text ?? '';
  if (labelTarget instanceof HTMLInputElement) {
    labelTarget.value = nextText;
  } else {
    labelTarget.textContent = nextText;
  }

  if (element instanceof HTMLAnchorElement) {
    const href = override.href || '#';
    element.href = href;
    element.setAttribute('href', href);
  }
}

function applyImageOverride(
  element: HTMLElement,
  override: BuilderSurfaceOverride,
  descriptor: SurfaceDescriptor
) {
  if (!(element instanceof HTMLImageElement)) return;
  const baseAlt = descriptor.baseAlt ?? element.dataset.builderBaseAlt ?? getImageAltValue(element);
  const baseSrc = descriptor.baseSrc ?? element.dataset.builderBaseSrc ?? getImageSrcValue(element);
  const nextAlt = override.alt ?? baseAlt;
  const nextSrc = resolveImageSourceValue(override.src, baseSrc);

  element.alt = nextAlt;
  if (nextAlt) {
    element.setAttribute('alt', nextAlt);
  } else {
    element.removeAttribute('alt');
  }

  if (nextSrc) {
    element.src = nextSrc;
    element.setAttribute('src', nextSrc);
    element.srcset = nextSrc;
    element.setAttribute('srcset', nextSrc);
  }
}

function getTextValue(element: HTMLElement | null) {
  if (!element) return '';
  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
    return element.value || element.placeholder || '';
  }
  if (element instanceof HTMLSelectElement) {
    return element.selectedOptions[0]?.text || '';
  }
  return element.textContent?.trim() ?? '';
}

function getButtonTextValue(element: HTMLElement | null) {
  if (!element) return '';
  const labelTarget = findButtonLabelElement(element) ?? element;
  if (labelTarget instanceof HTMLInputElement) return labelTarget.value;
  return labelTarget.textContent?.trim() ?? '';
}

function getButtonHrefValue(element: HTMLElement | null) {
  return element instanceof HTMLAnchorElement ? element.getAttribute('href') || '' : '';
}

function getImageAltValue(element: HTMLElement | null) {
  return element instanceof HTMLImageElement ? element.alt : '';
}

function getImageSrcValue(element: HTMLElement | null) {
  return element instanceof HTMLImageElement ? element.getAttribute('src') || element.currentSrc || '' : '';
}

function resolveImageSourceValue(src: string | undefined, fallbackSrc: string) {
  const trimmed = typeof src === 'string' ? src.trim() : '';
  return trimmed || fallbackSrc;
}

function buildImageWorkflowState(
  element: HTMLElement | null,
  descriptor: SurfaceDescriptor,
  selectedValues: EditableValues
): BuilderImageWorkflowState {
  const baseAlt = descriptor.baseAlt ?? getImageAltValue(element);
  const baseSrc = descriptor.baseSrc ?? getImageSrcValue(element);
  const currentAlt = selectedValues.alt;
  const currentSrc = selectedValues.src;
  const previewAlt = currentAlt || baseAlt || descriptor.label;
  const previewSrc = currentSrc || baseSrc;
  const currentSourceSummary = summarizeImageSource(currentSrc);
  const baseSourceSummary = summarizeImageSource(baseSrc);
  const currentGovernanceSummary = summarizeImageGovernance(currentSrc);
  const baseGovernanceSummary = summarizeImageGovernance(baseSrc);
  const sourceSummary =
    currentSrc === baseSrc
      ? baseSrc
        ? 'Using original source'
        : 'No source URL'
      : currentSrc
        ? 'Source override applied'
        : 'Source cleared to original';

  return {
    previewAlt,
    previewSrc,
    currentAlt,
    currentSrc,
    baseAlt,
    baseSrc,
    currentSourceSummary,
    baseSourceSummary,
    sourceSummary,
    altSummary: currentAlt ? 'Alt text set' : 'Alt text missing',
    hasOverride: currentAlt !== baseAlt || currentSrc !== baseSrc,
    currentGovernanceSummary,
    baseGovernanceSummary,
    publishGovernanceSummary: summarizePublishGovernance(currentSrc, baseSrc),
  };
}

function summarizeImageSource(src: string) {
  const trimmed = src.trim();
  if (!trimmed) return 'No source URL';
  if (trimmed.startsWith('data:')) return 'Embedded data URL';
  if (trimmed.startsWith('blob:')) return 'Blob preview URL';
  if (trimmed.startsWith('/')) return `Local path ${trimmed}`;

  try {
    const url = new URL(trimmed);
    return `${url.hostname}${url.pathname === '/' ? '' : url.pathname}`;
  } catch {
    return trimmed;
  }
}

function summarizeImageGovernance(src: string) {
  const classification = classifyImageSource(src);
  switch (classification.kind) {
    case 'builder':
      return 'Builder-managed asset URL';
    case 'external':
      return 'External URL override';
    case 'local':
      return 'Local relative path';
    case 'transient':
      return 'Transient preview URL';
    default:
      return 'No governed source';
  }
}

function summarizePublishGovernance(currentSrc: string, baseSrc: string) {
  if (!currentSrc && !baseSrc) {
    return 'No image source is linked yet.';
  }

  if (currentSrc === baseSrc) {
    return 'Using the original component source. Publish validation applies when you override the image.';
  }

  const classification = classifyImageSource(currentSrc);
  switch (classification.kind) {
    case 'builder':
      return 'Publish-ready. This override points to a builder-managed asset URL.';
    case 'external':
      return 'Publish will be blocked until this override uses a builder asset URL instead of an external URL.';
    case 'local':
      return 'Publish will be blocked until this override uses a builder asset URL instead of a local path.';
    case 'transient':
      return 'Publish will be blocked. Blob/data preview URLs cannot be published.';
    default:
      return 'Publish will be blocked until this override is replaced with a builder asset URL.';
  }
}

function classifyImageSource(src: string) {
  const trimmed = src.trim();
  if (!trimmed) return { kind: 'missing' as const };
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return { kind: 'transient' as const };
  }
  if (/^\/api\/builder\/assets\/[^/]+\/[^/?#]+$/i.test(trimmed)) {
    return { kind: 'builder' as const };
  }
  if (trimmed.startsWith('/')) {
    return { kind: 'local' as const };
  }
  try {
    const url = new URL(trimmed);
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      return { kind: 'external' as const };
    }
  } catch {
    return { kind: 'local' as const };
  }
  return { kind: 'external' as const };
}

function resolveImageLinkHref(src: string) {
  const trimmed = src.trim();
  if (!trimmed) return '#';
  if (/^(data:|blob:|https?:\/\/)/i.test(trimmed)) return trimmed;
  if (typeof window !== 'undefined' && window.location?.origin) {
    return new URL(trimmed, window.location.origin).toString();
  }
  return trimmed;
}

function findButtonLabelElement(element: HTMLElement) {
  return (
    element.querySelector<HTMLElement>('h1, h2, h3, h4, h5, h6, span, strong, em, small, label, p') ??
    null
  );
}

function isMeaningfulTextSurface(element: HTMLElement) {
  if (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLSelectElement
  ) {
    return true;
  }

  const text = element.textContent?.trim().replace(/\s+/g, ' ');
  if (!text) return false;

  const nestedText = Array.from(element.children).some((child) => {
    if (!(child instanceof HTMLElement)) return false;
    if (isBuilderUiElement(child)) return false;
    return child.matches(TEXT_SELECTOR) && child.textContent?.trim();
  });

  return !nestedText;
}

function isBuilderUiElement(element: HTMLElement) {
  return Boolean(element.closest(UI_SELECTOR));
}

function getElementSummary(element: HTMLElement) {
  if (element instanceof HTMLImageElement) {
    return element.alt || element.currentSrc || element.src || 'image';
  }
  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
    return element.value || element.placeholder || element.type || element.tagName.toLowerCase();
  }
  const text = element.textContent?.trim().replace(/\s+/g, ' ');
  if (text) return text.slice(0, 72);
  return element.tagName.toLowerCase();
}

function getOverrideKey(sectionId: string, surfaceId: string) {
  return `${sectionId}:${surfaceId}`;
}

function normalizeSectionSelectionIds(
  document: BuilderPageDocument,
  sectionIds: string[],
  fallbackSectionId: string
) {
  const validIds = document.root.children.map((section) => section.id);
  const deduped = Array.from(new Set(sectionIds)).filter((sectionId) => validIds.includes(sectionId));
  if (deduped.length) {
    return validIds.filter((sectionId) => deduped.includes(sectionId));
  }

  if (validIds.includes(fallbackSectionId)) {
    return [fallbackSectionId];
  }

  return validIds[0] ? [validIds[0]] : [];
}

function areStringListsEqual(left: string[], right: string[]) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function toggleSectionSelectionId(sectionIds: string[], nextSectionId: string) {
  if (sectionIds.includes(nextSectionId)) {
    if (sectionIds.length === 1) {
      return sectionIds;
    }
    return sectionIds.filter((sectionId) => sectionId !== nextSectionId);
  }

  return [...sectionIds, nextSectionId];
}

function isMultiSelectModifier(event: { metaKey: boolean; ctrlKey: boolean; shiftKey: boolean }) {
  return event.metaKey || event.ctrlKey || event.shiftKey;
}

function formatSectionFrameClipboardSummary(payload: BuilderSectionFrameClipboardPayload) {
  return payload.items.length > 1 ? `${payload.items.length} section frames` : '1 section frame';
}

function getNextSectionWidthPreset(
  current: BuilderSectionWidthPreset,
  direction: BuilderResizeDirection
) {
  const ordered: BuilderSectionWidthPreset[] = ['narrow', 'wide', 'full'];
  const currentIndex = ordered.indexOf(current);
  if (currentIndex < 0) return null;

  const offset = direction === 'narrower' ? -1 : 1;
  const nextIndex = Math.min(Math.max(currentIndex + offset, 0), ordered.length - 1);
  return ordered[nextIndex] ?? current;
}

function getNextSectionSpacingPreset(
  current: BuilderSectionSpacingPreset,
  direction: BuilderSpacingDirection
) {
  const ordered: BuilderSectionSpacingPreset[] = ['none', 'tight', 'normal', 'relaxed'];
  const currentIndex = ordered.indexOf(current);
  if (currentIndex < 0) return null;

  const offset = direction === 'tighter' ? -1 : 1;
  const nextIndex = Math.min(Math.max(currentIndex + offset, 0), ordered.length - 1);
  return ordered[nextIndex] ?? current;
}

function getVisibilityActionVerb(
  viewport: BuilderViewportMode,
  showing: boolean,
  selection = false
) {
  if (showing) {
    if (viewport === 'desktop') {
      return selection ? 'Show selection' : 'Show section';
    }
    return selection
      ? `Show on ${getViewportLabel(viewport).toLowerCase()}`
      : `Show on ${getViewportLabel(viewport).toLowerCase()}`;
  }

  if (viewport === 'desktop') {
    return selection ? 'Hide selection' : 'Hide section';
  }

  return selection
    ? `Hide on ${getViewportLabel(viewport).toLowerCase()}`
    : `Hide on ${getViewportLabel(viewport).toLowerCase()}`;
}

function hasVisibilityOverride(
  section: BuilderPageDocument['root']['children'][number],
  viewport: BuilderResponsiveBreakpoint
) {
  return typeof getStoredBuilderSectionVisibility(section)?.overrides?.[viewport] === 'boolean';
}

function hasVisibilityOverrideSelection(
  sections: BuilderPageDocument['root']['children'],
  viewport: BuilderResponsiveBreakpoint | 'desktop'
) {
  if (viewport === 'desktop') {
    return false;
  }

  return sections.some((section) => hasVisibilityOverride(section, viewport));
}

function buildNextHooks(
  targetKind: BuilderSelectableTargetKind,
  definition: BuilderSectionDefinition
) {
  const base = [
    `mapped surface 유지: ${definition.componentName}`,
    'public route와 preview 구조를 분리하지 않기',
  ];

  switch (targetKind) {
    case 'text':
      return [...base, 'surface override를 builder draft state로 승격', '긴 문장은 block editor 후보로 분리'];
    case 'button':
      return [...base, 'link / label / variant controls 확장', 'CTA와 일반 버튼을 구분'];
    case 'image':
      return [...base, 'media replace를 uploader와 연결', 'alt / fit / focal point 추가'];
    case 'unknown':
      return [...base, 'dead zone을 semantic wrapper로 감싸기', '지원되지 않는 surface를 명시적으로 표시'];
    default:
      return [...base, 'section reorder 핸들 추가', '기본 inspector shell에서 패널 분리'];
  }
}

function insertAt<T>(items: T[], index: number, item: T) {
  const next = [...items];
  next.splice(index, 0, item);
  return next;
}

function updateAt<T>(items: T[], index: number, item: T) {
  return items.map((current, currentIndex) => (currentIndex === index ? item : current));
}

function removeAt<T>(items: T[], index: number) {
  return items.filter((_, currentIndex) => currentIndex !== index);
}

function moveItem<T>(items: T[], index: number, offset: -1 | 1) {
  const nextIndex = index + offset;
  if (nextIndex < 0 || nextIndex >= items.length) return [...items];
  const next = [...items];
  const [removed] = next.splice(index, 1);
  next.splice(nextIndex, 0, removed);
  return next;
}

function truncateCopy(value: string, limit = 84) {
  const normalized = value.trim().replace(/\s+/g, ' ');
  if (!normalized) return 'No draft copy yet';
  return normalized.length > limit ? `${normalized.slice(0, limit)}…` : normalized;
}

function getViewportModeStorageKey(locale: Locale) {
  return `${VIEWPORT_STORAGE_PREFIX}:home:${locale}`;
}

function isBuilderViewportMode(value: unknown): value is BuilderViewportMode {
  return value === 'desktop' || value === 'tablet' || value === 'mobile';
}

function getViewportZoomStorageKey(locale: Locale) {
  return `${ZOOM_STORAGE_PREFIX}:home:${locale}`;
}

function isBuilderZoomLevel(value: unknown): value is BuilderZoomLevel {
  const parsed = Number(value);
  return ZOOM_OPTIONS.some((zoomLevel) => zoomLevel === parsed);
}

function resolveBestFittingZoomLevel(targetZoom: number): BuilderZoomLevel {
  const clampedTarget = Math.max(ZOOM_OPTIONS[0], Math.min(targetZoom, ZOOM_OPTIONS[ZOOM_OPTIONS.length - 1]));
  let bestOption: BuilderZoomLevel = ZOOM_OPTIONS[0];

  ZOOM_OPTIONS.forEach((option) => {
    const currentDistance = Math.abs(option - clampedTarget);
    const bestDistance = Math.abs(bestOption - clampedTarget);
    if (currentDistance < bestDistance) {
      bestOption = option;
    }
  });

  return bestOption;
}

function getViewportLabel(mode: BuilderViewportMode) {
  switch (mode) {
    case 'desktop':
      return 'Desktop';
    case 'tablet':
      return 'Tablet';
    case 'mobile':
      return 'Mobile';
    default:
      return mode;
  }
}

function getViewportHint(mode: BuilderViewportMode) {
  switch (mode) {
    case 'desktop':
      return '전체 canvas 폭에서 최종 데스크톱 체감을 확인합니다.';
    case 'tablet':
      return '태블릿 폭으로 줄여 섹션 흐름과 wrap 변화를 확인합니다.';
    case 'mobile':
      return '좁은 프레임에서 간격, 버튼, 카드 밀도를 확인합니다.';
    default:
      return '';
  }
}

function formatSectionLayoutSummary(layout: BuilderSectionResolvedLayout | BuilderSectionLayout) {
  return `${formatWidthLabel(layout.width)} / ${formatAlignmentLabel(layout.alignment)} / Top ${formatSpacingLabel(layout.spacingTop)} / Bottom ${formatSpacingLabel(layout.spacingBottom)} / Inset X ${formatSpacingLabel(layout.paddingInline)} / Inset Y ${formatSpacingLabel(layout.paddingBlock)}`;
}

function resolveStoredSectionLayoutForViewport(
  layout: BuilderSectionLayout,
  viewport: BuilderViewportMode
): BuilderSectionResolvedLayout {
  const desktop: BuilderSectionResolvedLayout = {
    width: layout.width,
    alignment: layout.alignment,
    spacingTop: layout.spacingTop,
    spacingBottom: layout.spacingBottom,
    paddingInline: layout.paddingInline,
    paddingBlock: layout.paddingBlock,
  };

  if (viewport === 'desktop') {
    return desktop;
  }

  const tablet: BuilderSectionResolvedLayout = {
    ...desktop,
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

function describeViewportLayoutState(layout: BuilderSectionLayout, viewport: BuilderViewportMode) {
  if (viewport === 'desktop') {
    return {
      title: 'Desktop base layout',
      detail: 'Desktop writes the base layout. Tablet and mobile inherit from it unless they carry their own overrides.',
    };
  }

  const override = layout.overrides?.[viewport];
  if (viewport === 'tablet') {
    return override
      ? {
          title: 'Tablet override active',
          detail: `Tablet currently resolves to ${formatSectionLayoutSummary(resolveStoredSectionLayoutForViewport(layout, 'tablet'))}. Reset removes only the tablet override and falls back to desktop.`,
        }
      : {
          title: 'Tablet inherits desktop',
          detail: 'Tablet is inheriting the desktop base layout. Any change here creates a tablet-only override.',
        };
  }

  const inheritsFrom = layout.overrides?.tablet ? 'tablet' : 'desktop';
  return override
    ? {
        title: 'Mobile override active',
        detail: `Mobile currently resolves to ${formatSectionLayoutSummary(resolveStoredSectionLayoutForViewport(layout, 'mobile'))}. Reset removes only the mobile override and falls back to ${inheritsFrom}.`,
      }
    : {
        title: `Mobile inherits ${inheritsFrom}`,
        detail: `Mobile is inheriting from ${inheritsFrom}. Any change here creates a mobile-only override.`,
      };
}

function describeViewportVisibilityState(
  section: BuilderPageDocument['root']['children'][number] | null,
  viewport: BuilderViewportMode
) {
  const hidden = resolveBuilderSectionHidden(section, viewport);
  const storedVisibility = getStoredBuilderSectionVisibility(section);

  if (viewport === 'desktop') {
    return hidden
      ? {
          title: 'Desktop base visibility: hidden',
          badge: 'hidden',
          detail:
            'Desktop visibility is the base visibility rule. Tablet and mobile inherit it unless they carry their own override.',
          overrideApplied: false,
        }
      : {
          title: 'Desktop base visibility: visible',
          badge: 'visible',
          detail:
            'Desktop visibility is the base visibility rule. Tablet and mobile inherit it unless they carry their own override.',
          overrideApplied: false,
        };
  }

  const overrideApplied = typeof storedVisibility?.overrides?.[viewport] === 'boolean';
  const inheritsFrom =
    viewport === 'tablet' ? 'desktop' : storedVisibility?.overrides?.tablet !== undefined ? 'tablet' : 'desktop';

  if (hidden) {
    return overrideApplied
      ? {
          title: `${getViewportLabel(viewport)} override: hidden`,
          badge: `${getViewportLabel(viewport).toLowerCase()} hidden`,
          detail: `${getViewportLabel(viewport)} is hidden by an explicit override. Reset removes only this override and falls back to ${inheritsFrom}.`,
          overrideApplied,
        }
      : {
          title: `${getViewportLabel(viewport)} inherits hidden state`,
          badge: `${getViewportLabel(viewport).toLowerCase()} hidden`,
          detail: `${getViewportLabel(viewport)} is currently hidden because it inherits the ${inheritsFrom} visibility rule.`,
          overrideApplied,
        };
  }

  return overrideApplied
    ? {
        title: `${getViewportLabel(viewport)} override: visible`,
        badge: 'visible',
        detail: `${getViewportLabel(viewport)} is forced visible even though larger breakpoints may be hidden. Reset removes only this override and falls back to ${inheritsFrom}.`,
        overrideApplied,
      }
    : {
        title: `${getViewportLabel(viewport)} inherits visible state`,
        badge: 'visible',
        detail: `${getViewportLabel(viewport)} is currently visible because it inherits the ${inheritsFrom} visibility rule.`,
        overrideApplied,
      };
}

function formatStoredSectionLayoutSummary(layout: BuilderSectionLayout) {
  const desktop = formatSectionLayoutSummary(resolveStoredSectionLayoutForViewport(layout, 'desktop'));
  const tablet = layout.overrides?.tablet
    ? formatSectionLayoutSummary(resolveStoredSectionLayoutForViewport(layout, 'tablet'))
    : 'inherits desktop';
  const mobile = layout.overrides?.mobile
    ? formatSectionLayoutSummary(resolveStoredSectionLayoutForViewport(layout, 'mobile'))
    : `inherits ${layout.overrides?.tablet ? 'tablet' : 'desktop'}`;

  return `Desktop ${desktop} | Tablet ${tablet} | Mobile ${mobile}`;
}

function buildSectionOrderSummary(order: BuilderSectionKey[]) {
  return order.map((sectionKey) => homeSectionRegistry[sectionKey].title).join(' -> ');
}

function formatCollectionStructureSummary(items: string[]) {
  if (!items.length) return '0 items';

  const preview = items
    .slice(0, 3)
    .map((item, index) => `#${index + 1} ${truncateCopy(item, 36)}`)
    .join(' · ');
  const overflow = items.length > 3 ? ` · +${items.length - 3} more` : '';
  return `${items.length} items · ${preview}${overflow}`;
}

function formatWidthLabel(value: BuilderSectionWidthPreset) {
  switch (value) {
    case 'full':
      return 'Full';
    case 'wide':
      return 'Wide';
    case 'narrow':
      return 'Narrow';
    default:
      return value;
  }
}

function formatAlignmentLabel(value: BuilderSectionAlignmentPreset) {
  switch (value) {
    case 'left':
      return 'Left';
    case 'center':
      return 'Center';
    case 'right':
      return 'Right';
    default:
      return value;
  }
}

function formatSpacingLabel(value: BuilderSectionSpacingPreset) {
  switch (value) {
    case 'none':
      return 'None';
    case 'tight':
      return 'Tight';
    case 'normal':
      return 'Normal';
    case 'relaxed':
      return 'Relaxed';
    default:
      return value;
  }
}

function formatBytes(value: number) {
  if (!Number.isFinite(value) || value <= 0) return '0 B';
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function dedupeAssetLibraryItems(items: BuilderAssetLibraryItem[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });
}

function formatValidationIssueCode(code: BuilderPublishValidationIssue['code']) {
  switch (code) {
    case 'invalid_override_key':
      return 'Override mapping';
    case 'unregistered_image_surface':
      return 'Image slot contract';
    case 'unregistered_text_surface':
      return 'Text slot contract';
    case 'unregistered_button_surface':
      return 'Button slot contract';
    case 'invalid_builder_asset_url':
      return 'Asset URL policy';
    case 'builder_asset_locale_mismatch':
      return 'Locale mismatch';
    case 'builder_asset_not_found':
      return 'Asset missing';
    default:
      return code;
  }
}

function resolvePublishingReadiness({
  locale,
  rollbackPromotionCandidate,
  serverConflict,
  serverError,
  serverValidationIssues,
  serverValidationPassed,
  serverValidationCheckedAt,
}: {
  locale: Locale;
  rollbackPromotionCandidate: BuilderRevisionHistoryItem | null;
  serverConflict: BuilderServerConflict | null;
  serverError: string | null;
  serverValidationIssues: BuilderPublishValidationIssue[] | null;
  serverValidationPassed: boolean;
  serverValidationCheckedAt: string | null;
}): BuilderPublishingReadiness {
  if (rollbackPromotionCandidate) {
    return {
      status: 'needs-review',
      title: 'Needs review',
      summary: `Recovery draft from published v${rollbackPromotionCandidate.revision} is loaded only in this browser.`,
      detail: 'Promote it to the shared draft explicitly before publish can continue.',
    };
  }

  if (serverConflict) {
    return {
      status: 'blocked',
      title: 'Blocked',
      summary: 'A newer shared version was detected. Review the latest shared snapshot before publishing.',
      detail: `Blocked by ${getSnapshotKindLabel(serverConflict.kind).toLowerCase()}.`,
    };
  }

  if (serverValidationIssues?.length) {
    return {
      status: 'blocked',
      title: 'Blocked',
      summary: `${serverValidationIssues.length} publish blocker${
        serverValidationIssues.length > 1 ? 's are' : ' is'
      } still open.`,
      detail: 'Review the first blocker, fix it, then run publish checks again.',
    };
  }

  if (serverError) {
    return {
      status: 'blocked',
      title: 'Blocked',
      summary: serverError,
      detail: 'Refresh the shared state or rerun checks before publishing again.',
    };
  }

  if (serverValidationPassed && serverValidationCheckedAt) {
    return {
      status: 'ready',
      title: 'Ready to publish',
      summary: `Checks passed at ${formatDraftTimestamp(serverValidationCheckedAt, locale)}.`,
      detail: 'This draft is cleared for publish unless you make more edits.',
    };
  }

  return {
    status: 'needs-review',
    title: 'Needs review',
    summary: 'Publish readiness is not confirmed yet for the current draft.',
    detail: 'Run publish checks before publishing this version.',
  };
}

function buildRevisionCompareSummary(
  left: BuilderCompareSource,
  right: BuilderCompareSource
): BuilderRevisionCompareSummary {
  const leftOrder = left.document.root.children.map((section) => section.sectionKey);
  const rightOrder = right.document.root.children.map((section) => section.sectionKey);
  const allSectionKeys = Array.from(new Set([...leftOrder, ...rightOrder])) as BuilderSectionKey[];
  const visibilityChanges = allSectionKeys
    .flatMap((sectionKey) => {
      const leftSection = left.document.root.children.find((section) => section.sectionKey === sectionKey);
      const rightSection = right.document.root.children.find((section) => section.sectionKey === sectionKey);
      return (['desktop', 'tablet', 'mobile'] as const)
        .map((viewport) => {
          const leftHidden = resolveBuilderSectionHidden(leftSection, viewport);
          const rightHidden = resolveBuilderSectionHidden(rightSection, viewport);
          if (leftHidden === rightHidden) return null;
          return {
            sectionKey,
            viewport,
            leftHidden,
            rightHidden,
          };
        })
        .filter(Boolean);
    })
    .filter(Boolean) as BuilderRevisionCompareSummary['visibilityChanges'];
  const lockChanges = allSectionKeys
    .map((sectionKey) => {
      const leftSection = left.document.root.children.find((section) => section.sectionKey === sectionKey);
      const rightSection = right.document.root.children.find((section) => section.sectionKey === sectionKey);
      const leftLocked = Boolean(leftSection?.locked);
      const rightLocked = Boolean(rightSection?.locked);
      if (leftLocked === rightLocked) return null;
      return {
        sectionKey,
        leftLocked,
        rightLocked,
      };
    })
    .filter(Boolean) as BuilderRevisionCompareSummary['lockChanges'];

  return {
    leftMeta: {
      label: left.label,
      revision: left.revision,
      savedAt: left.savedAt,
      updatedBy: left.updatedBy,
    },
    rightMeta: {
      label: right.label,
      revision: right.revision,
      savedAt: right.savedAt,
      updatedBy: right.updatedBy,
    },
    sectionOrderChanged: leftOrder.join('|') !== rightOrder.join('|'),
    leftOrder,
    rightOrder,
    visibilityChanges,
    lockChanges,
    overrideCount: {
      left: Object.keys(left.state.overrides).length,
      right: Object.keys(right.state.overrides).length,
    },
    faqCount: {
      left: left.state.faqItems.length,
      right: right.state.faqItems.length,
    },
    serviceCount: {
      left: left.state.serviceItems.length,
      right: right.state.serviceItems.length,
    },
    structuralChanges: collectStructuralChanges(left, right, {
      allSectionKeys,
      leftOrder,
      rightOrder,
      visibilityChanges,
      lockChanges,
    }),
    fieldChanges: [
      ...collectOverrideFieldChanges(left, right),
      ...collectFaqFieldChanges(left, right),
      ...collectServiceFieldChanges(left, right),
    ],
  };
}

function collectStructuralChanges(
  left: BuilderCompareSource,
  right: BuilderCompareSource,
  context: {
    allSectionKeys: BuilderSectionKey[];
    leftOrder: BuilderSectionKey[];
    rightOrder: BuilderSectionKey[];
    visibilityChanges: BuilderRevisionCompareSummary['visibilityChanges'];
    lockChanges: BuilderRevisionCompareSummary['lockChanges'];
  }
): BuilderRevisionStructuralChange[] {
  const changes: BuilderRevisionStructuralChange[] = [];

  if (context.leftOrder.join('|') !== context.rightOrder.join('|')) {
    changes.push({
      sectionKey: null,
      sectionTitle: 'Page structure',
      group: 'order',
      label: 'Section order',
      leftValue: buildSectionOrderSummary(context.leftOrder),
      rightValue: buildSectionOrderSummary(context.rightOrder),
    });
  }

  for (const sectionKey of context.allSectionKeys) {
    const sectionTitle = homeSectionRegistry[sectionKey].title;
    const leftSection = left.document.root.children.find((section) => section.sectionKey === sectionKey) ?? null;
    const rightSection = right.document.root.children.find((section) => section.sectionKey === sectionKey) ?? null;

    if (!leftSection || !rightSection) {
      changes.push({
        sectionKey,
        sectionTitle,
        group: 'presence',
        label: 'Section presence',
        leftValue: leftSection ? 'Present' : 'Missing',
        rightValue: rightSection ? 'Present' : 'Missing',
      });
      continue;
    }

    const leftLayoutSummary = formatStoredSectionLayoutSummary(getStoredBuilderSectionLayout(leftSection));
    const rightLayoutSummary = formatStoredSectionLayoutSummary(getStoredBuilderSectionLayout(rightSection));
    if (leftLayoutSummary !== rightLayoutSummary) {
      changes.push({
        sectionKey,
        sectionTitle,
        group: 'layout',
        label: 'Section layout',
        leftValue: leftLayoutSummary,
        rightValue: rightLayoutSummary,
      });
    }
  }

  for (const visibilityChange of context.visibilityChanges) {
    changes.push({
      sectionKey: visibilityChange.sectionKey,
      sectionTitle: homeSectionRegistry[visibilityChange.sectionKey].title,
      group: 'visibility',
      label: `${getViewportLabel(visibilityChange.viewport)} visibility`,
      leftValue: visibilityChange.leftHidden ? 'Hidden' : 'Visible',
      rightValue: visibilityChange.rightHidden ? 'Hidden' : 'Visible',
    });
  }

  for (const lockChange of context.lockChanges) {
    changes.push({
      sectionKey: lockChange.sectionKey,
      sectionTitle: homeSectionRegistry[lockChange.sectionKey].title,
      group: 'lock',
      label: 'Lock state',
      leftValue: lockChange.leftLocked ? 'Locked' : 'Unlocked',
      rightValue: lockChange.rightLocked ? 'Locked' : 'Unlocked',
    });
  }

  const faqLeft = left.state.faqItems.map((item) => item.question);
  const faqRight = right.state.faqItems.map((item) => item.question);
  if (faqLeft.join('|') !== faqRight.join('|')) {
    changes.push({
      sectionKey: 'home.faq',
      sectionTitle: homeSectionRegistry['home.faq'].title,
      group: 'collection',
      label: 'FAQ item structure',
      leftValue: formatCollectionStructureSummary(faqLeft),
      rightValue: formatCollectionStructureSummary(faqRight),
    });
  }

  const serviceLeft = left.state.serviceItems.map((item) => item.title);
  const serviceRight = right.state.serviceItems.map((item) => item.title);
  if (serviceLeft.join('|') !== serviceRight.join('|')) {
    changes.push({
      sectionKey: 'home.services',
      sectionTitle: homeSectionRegistry['home.services'].title,
      group: 'collection',
      label: 'Service item structure',
      leftValue: formatCollectionStructureSummary(serviceLeft),
      rightValue: formatCollectionStructureSummary(serviceRight),
    });
  }

  const leftInsightsBinding = formatDatasetBindingSummary(left.document, 'home.insights.feed');
  const rightInsightsBinding = formatDatasetBindingSummary(right.document, 'home.insights.feed');
  if (leftInsightsBinding !== rightInsightsBinding) {
    changes.push({
      sectionKey: 'home.insights',
      sectionTitle: homeSectionRegistry['home.insights'].title,
      group: 'dataset',
      label: 'Insights dataset binding',
      leftValue: leftInsightsBinding,
      rightValue: rightInsightsBinding,
    });
  }

  return changes;
}

function createCompareSource(source: BuilderCompareSource): BuilderCompareSource {
  return {
    label: source.label,
    revision: source.revision,
    savedAt: source.savedAt,
    updatedBy: source.updatedBy,
    document: normalizeBuilderDocument(source.document, source.document),
    state: normalizeHomeDocumentState(source.state, source.state),
  };
}

function collectOverrideFieldChanges(
  left: BuilderCompareSource,
  right: BuilderCompareSource
): BuilderRevisionFieldChange[] {
  const leftSectionKeyById = buildSectionKeyById(left.document);
  const rightSectionKeyById = buildSectionKeyById(right.document);
  const leftOverrides = buildOverrideCompareMap(left.state.overrides, leftSectionKeyById);
  const rightOverrides = buildOverrideCompareMap(right.state.overrides, rightSectionKeyById);
  const compareKeys = Array.from(new Set([...leftOverrides.keys(), ...rightOverrides.keys()])).sort();

  return compareKeys.flatMap((compareKey) => {
    const leftItem = leftOverrides.get(compareKey) ?? null;
    const rightItem = rightOverrides.get(compareKey) ?? null;
    const sectionKey = leftItem?.sectionKey ?? rightItem?.sectionKey;
    if (!sectionKey) return [];

    const sectionTitle = homeSectionRegistry[sectionKey].title;
    const group = leftItem?.override.kind ?? rightItem?.override.kind;
    if (!group) return [];

    const leftValue = formatOverrideCompareValue(leftItem?.override ?? null);
    const rightValue = formatOverrideCompareValue(rightItem?.override ?? null);
    if (leftValue === rightValue) return [];

    return [
      {
        sectionKey,
        sectionTitle,
        group,
        label: `${formatDiffFieldGroup(group)} · ${leftItem?.surfaceId ?? rightItem?.surfaceId ?? 'surface'}`,
        leftValue,
        rightValue,
      },
    ];
  });
}

function collectFaqFieldChanges(
  left: BuilderCompareSource,
  right: BuilderCompareSource
): BuilderRevisionFieldChange[] {
  const maxLength = Math.max(left.state.faqItems.length, right.state.faqItems.length);
  const sectionKey: BuilderSectionKey = 'home.faq';
  const sectionTitle = homeSectionRegistry[sectionKey].title;
  const changes: BuilderRevisionFieldChange[] = [];

  for (let index = 0; index < maxLength; index += 1) {
    const leftItem = left.state.faqItems[index];
    const rightItem = right.state.faqItems[index];

    const questionLeft = leftItem?.question?.trim() || '—';
    const questionRight = rightItem?.question?.trim() || '—';
    if (questionLeft !== questionRight) {
      changes.push({
        sectionKey,
        sectionTitle,
        group: 'faq',
        label: `FAQ item ${index + 1} · question`,
        leftValue: questionLeft,
        rightValue: questionRight,
      });
    }

    const answerLeft = leftItem?.answer?.trim() || '—';
    const answerRight = rightItem?.answer?.trim() || '—';
    if (answerLeft !== answerRight) {
      changes.push({
        sectionKey,
        sectionTitle,
        group: 'faq',
        label: `FAQ item ${index + 1} · answer`,
        leftValue: answerLeft,
        rightValue: answerRight,
      });
    }
  }

  return changes;
}

function collectServiceFieldChanges(
  left: BuilderCompareSource,
  right: BuilderCompareSource
): BuilderRevisionFieldChange[] {
  const maxLength = Math.max(left.state.serviceItems.length, right.state.serviceItems.length);
  const sectionKey: BuilderSectionKey = 'home.services';
  const sectionTitle = homeSectionRegistry[sectionKey].title;
  const changes: BuilderRevisionFieldChange[] = [];

  for (let index = 0; index < maxLength; index += 1) {
    const leftItem = left.state.serviceItems[index];
    const rightItem = right.state.serviceItems[index];
    const fields: Array<{ key: keyof BuilderServiceItem; label: string }> = [
      { key: 'title', label: 'title' },
      { key: 'description', label: 'description' },
      { key: 'href', label: 'href' },
    ];

    fields.forEach((field) => {
      const leftValue = normalizeDiffValue(leftItem?.[field.key]);
      const rightValue = normalizeDiffValue(rightItem?.[field.key]);
      if (leftValue === rightValue) return;

      changes.push({
        sectionKey,
        sectionTitle,
        group: 'service',
        label: `Service item ${index + 1} · ${field.label}`,
        leftValue,
        rightValue,
      });
    });
  }

  return changes;
}

function buildSectionKeyById(document: BuilderPageDocument) {
  return new Map(document.root.children.map((section) => [section.id, section.sectionKey] as const));
}

function buildOverrideCompareMap(
  overrides: Record<string, BuilderSurfaceOverride>,
  sectionKeyById: Map<string, BuilderSectionKey>
) {
  const compareMap = new Map<
    string,
    {
      sectionKey: BuilderSectionKey;
      surfaceId: string;
      override: BuilderSurfaceOverride;
    }
  >();

  Object.entries(overrides).forEach(([rawKey, override]) => {
    if (!override) return;

    const [sectionId, ...surfaceParts] = rawKey.split(':');
    const surfaceId = surfaceParts.join(':');
    const sectionKey = sectionKeyById.get(sectionId);
    if (!sectionKey || !surfaceId) return;

    compareMap.set(`${sectionKey}:${surfaceId}`, {
      sectionKey,
      surfaceId,
      override,
    });
  });

  return compareMap;
}

function formatOverrideCompareValue(override: BuilderSurfaceOverride | null) {
  if (!override) return '—';

  switch (override.kind) {
    case 'text':
      return normalizeDiffValue(override.text);
    case 'button':
      return `Label: ${normalizeDiffValue(override.text)} | Link: ${normalizeDiffValue(override.href)}`;
    case 'image':
      return `Alt: ${normalizeDiffValue(override.alt)} | Source: ${normalizeDiffValue(override.src)}`;
    default:
      return '—';
  }
}

function formatDiffFieldGroup(group: BuilderRevisionFieldChange['group']) {
  switch (group) {
    case 'text':
      return 'Text';
    case 'button':
      return 'Button';
    case 'image':
      return 'Image';
    case 'faq':
      return 'FAQ';
    case 'service':
      return 'Service';
    default:
      return group;
  }
}

function formatStructuralChangeGroup(group: BuilderRevisionStructuralChange['group']) {
  switch (group) {
    case 'layout':
      return 'Layout';
    case 'lock':
      return 'Lock';
    case 'collection':
      return 'Collection';
    case 'dataset':
      return 'Dataset';
    case 'order':
      return 'Order';
    case 'visibility':
      return 'Visibility';
    case 'presence':
      return 'Presence';
    default:
      return 'Structure';
  }
}

function normalizeDiffValue(value: unknown) {
  if (typeof value !== 'string') return '—';
  const normalized = value.trim().replace(/\s+/g, ' ');
  return normalized || '—';
}

function formatDatasetBindingSummary(
  document: BuilderPageDocument,
  targetId: BuilderDatasetTargetId
) {
  const binding = getBuilderPageDatasetBinding(document, targetId);
  return `${binding.collectionId} · ${binding.mode} · limit ${binding.limit ?? 'default'}`;
}

function buildServerSnapshotMeta(
  snapshot: BuilderHomePageSnapshot | undefined,
  persisted: boolean
): BuilderServerSnapshotMeta {
  return {
    persisted,
    revision: snapshot?.revision ?? 0,
    savedAt: snapshot?.savedAt ?? null,
    updatedBy: snapshot?.updatedBy ?? null,
  };
}

function getSnapshotKindLabel(kind: BuilderSnapshotKind) {
  return kind === 'draft' ? 'Shared draft slot' : 'Shared published slot';
}

function resolveSurfaceContractState(
  document: BuilderPageDocument,
  sectionKey: BuilderSectionKey,
  targetKind: BuilderSelectableTargetKind,
  surfaceId?: string,
  contentGroupId?: string
) {
  if (targetKind === 'section') {
    return {
      label: 'section frame',
    };
  }

  if (targetKind === 'group') {
    const persistedSource =
      contentGroupId ? getPersistedContentGroupSource(document, sectionKey, contentGroupId) : undefined;
    return {
      label: 'persisted content group',
      note:
        persistedSource === 'page-scene'
          ? `This group is now stored in the page document as an authoritative scene node (${contentGroupId ?? 'group'}). Canvas move is scene-backed and stage-local resize now writes authored bounds; generic free-position parity is still deferred.`
          : `This group is now stored in the page document as a stable scene node (${contentGroupId ?? 'group'}). Canvas move/size now enter through the page.scene bridge, but generic free-position parity is still intentionally deferred.`,
      managerSignal:
        persistedSource === 'page-scene'
          ? 'Page.scene authority · scene-backed group move/size entry · generic freeform still deferred.'
          : 'Scene-backed content group · bridge-driven move/size entry · generic freeform still deferred.',
    };
  }

  if (!surfaceId) {
    return {
      label: 'unknown target',
    };
  }

  if (targetKind === 'unknown') {
    return {
      label: 'dead zone / unsupported',
    };
  }

  if (targetKind === 'image') {
    const declared = isDeclaredHomeImageSurfaceId(sectionKey, surfaceId);
    return declared
      ? {
          label: 'registered image slot',
        }
      : {
          label: 'generated image slot',
          note: 'This image is not mapped to a declared builder slot. Local editing works, but publish governance will block it.',
        };
  }

  if (targetKind === 'button') {
    const declared = isDeclaredHomeButtonSurfaceId(sectionKey, surfaceId);
    return declared
      ? {
          label: 'registered button slot',
        }
      : {
          label: 'generated button slot',
          note: 'This button is using a generated surface id. Editing is stable in this browser, but section-level button contracts are still being expanded.',
          managerSignal: 'Generated slot · DOM-order derived · not publish-governed yet.',
        };
  }

  if (targetKind === 'text') {
    const declared = isDeclaredHomeTextSurfaceId(sectionKey, surfaceId);
    return declared
      ? {
          label: 'registered text slot',
        }
      : {
          label: 'generated text slot',
          note: 'This text is using a generated surface id. Editing is stable in this browser, but section-level text contracts are still being expanded.',
          managerSignal: 'Generated slot · DOM-order derived · not publish-governed yet.',
        };
  }

  return {
    label: 'unknown contract',
  };
}

function buildConflictMessage(
  conflict: BuilderServerConflict,
  action: 'save' | 'publish' | 'validate' | null
) {
  if (conflict.kind === 'draft') {
    if (action === 'validate') {
      return '검사 직전 서버 draft가 더 최신이라 publish checks를 멈췄습니다. 최신 shared draft를 확인한 뒤 다시 검사하세요.';
    }

    return action === 'publish'
      ? '발행 직전 서버 draft가 더 최신이라 진행을 멈췄습니다. 최신 shared draft를 확인한 뒤 다시 발행하세요.'
      : '서버 draft가 더 최신이라 저장을 멈췄습니다. 최신 shared draft를 확인한 뒤 다시 저장하세요.';
  }

  return '공유 published 슬롯이 바뀌어서 발행을 멈췄습니다. 공개본 메타를 새로 확인한 뒤 다시 발행하세요.';
}

function getConflictReviewKey(conflict: BuilderServerConflict) {
  return `${conflict.kind}:${conflict.currentSnapshot.revision}:${conflict.currentSnapshot.savedAt}`;
}

function getRollbackPromotionReviewKey(
  record: BuilderRevisionHistoryItem,
  serverDraftRevision: number,
  serverDraftSavedAt: string | null
) {
  return `${record.revisionId}:${serverDraftRevision}:${serverDraftSavedAt ?? 'none'}`;
}

function getSharedRollbackReviewKey(
  record: BuilderRevisionHistoryItem,
  serverDraftRevision: number,
  serverDraftSavedAt: string | null
) {
  return `shared-rollback:${record.revisionId}:${serverDraftRevision}:${serverDraftSavedAt ?? 'none'}`;
}

function formatExpectedSnapshot(
  revision: number | undefined,
  savedAt: string | undefined,
  locale: Locale
) {
  const revisionText = typeof revision === 'number' ? `v${revision}` : 'no revision';
  const savedAtText = savedAt ? formatDraftTimestamp(savedAt, locale) : 'no timestamp';
  return `${revisionText} · ${savedAtText}`;
}

function formatSnapshotMetaLine(
  snapshot: Pick<BuilderHomePageSnapshot, 'revision' | 'savedAt' | 'updatedBy'>,
  locale: Locale
) {
  return `v${snapshot.revision} · ${formatDraftTimestamp(snapshot.savedAt, locale)} · ${snapshot.updatedBy}`;
}

function formatCompareMetaLine(meta: BuilderCompareSnapshotMeta, locale: Locale) {
  const revisionText = meta.revision === null ? 'browser-only' : `v${meta.revision}`;
  const savedAtText = meta.savedAt ? formatDraftTimestamp(meta.savedAt, locale) : 'no timestamp';
  const updatedByText = meta.updatedBy || 'unknown';
  return `${revisionText} · ${savedAtText} · ${updatedByText}`;
}

function formatDraftTimestamp(value: string, locale: Locale) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(locale === 'zh-hant' ? 'zh-Hant-TW' : locale);
}

function isCollectionSection(sectionKey: BuilderSectionKey): sectionKey is BuilderCollectionSectionKey {
  return sectionKey === 'home.faq' || sectionKey === 'home.services';
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

function createEmptyFaqItem(locale: Locale): FAQItem {
  switch (locale) {
    case 'ko':
      return {
        question: '새 FAQ 질문',
        answer: '여기에 답변 초안을 입력하세요.',
      };
    case 'zh-hant':
      return {
        question: '新的常見問題',
        answer: '請在這裡輸入答案草稿。',
      };
    default:
      return {
        question: 'New FAQ question',
        answer: 'Add the answer draft here.',
      };
  }
}

function createEmptyServiceItem(locale: Locale): BuilderServiceItem {
  switch (locale) {
    case 'ko':
      return {
        title: '새 업무 분야',
        description: '업무 소개 초안을 입력하세요.',
        href: `/${locale}/services#new-service`,
        details: [],
        relatedColumns: [],
      };
    case 'zh-hant':
      return {
        title: '新的服務項目',
        description: '請輸入服務說明草稿。',
        href: `/${locale}/services#new-service`,
        details: [],
        relatedColumns: [],
      };
    default:
      return {
        title: 'New service',
        description: 'Add a draft service description.',
        href: `/${locale}/services#new-service`,
        details: [],
        relatedColumns: [],
      };
  }
}

function removeOverridesForSection(
  overrides: Record<string, BuilderSurfaceOverride>,
  sectionId: string
) {
  return Object.fromEntries(
    Object.entries(overrides).filter(([key]) => !key.startsWith(`${sectionId}:`))
  );
}

function clampCollectionIndex(index: number | null | undefined, length: number) {
  if (length <= 0) return 0;
  if (typeof index !== 'number' || Number.isNaN(index)) return 0;
  return Math.min(Math.max(index, 0), length - 1);
}

function isSameWorkspaceSnapshot(
  left: BuilderWorkspaceSnapshot,
  right: BuilderWorkspaceSnapshot
) {
  return (
    JSON.stringify({
      document: left.document,
      state: left.state,
      selection: left.selection,
    }) ===
    JSON.stringify({
      document: right.document,
      state: right.state,
      selection: right.selection,
    })
  );
}

function isSameDocumentStatePair(
  leftDocument: BuilderPageDocument,
  leftState: BuilderHomeDocumentState,
  rightDocument: BuilderPageDocument,
  rightState: BuilderHomeDocumentState
) {
  return (
    JSON.stringify({
      document: leftDocument,
      state: leftState,
    }) ===
    JSON.stringify({
      document: rightDocument,
      state: rightState,
    })
  );
}
