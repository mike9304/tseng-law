'use client';

import { type ReactNode, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { ComponentLibraryShortcut } from '@/components/builder/canvas/ComponentLibraryShortcut';
import type { BuilderRegisteredAppWidget } from '@/lib/builder/apps/widgets';
import type { BuilderCanvasDocument, BuilderCanvasNode } from '@/lib/builder/canvas/types';
import {
  HOME_SECTION_TEMPLATE_TARGETS,
  HOME_SECTION_TEMPLATE_VARIANTS,
  getHomeSectionTemplateVariantOptions,
  getHomeSectionTemplateTarget,
  getHomeSectionTemplateVariant,
  type HomeSectionTemplateId,
} from '@/lib/builder/canvas/section-templates';
import { getAllTemplates } from '@/lib/builder/templates/registry';
import {
  COMPONENT_DESIGN_PRESETS,
  getComponentDesignPreset,
  summarizeComponentDesignTargets,
  type ComponentDesignPresetKey,
} from '@/lib/builder/site/component-design-presets';
import type { BuilderNavItem } from '@/lib/builder/site/types';
import type { Locale } from '@/lib/locales';
import { getAiGeneratorCopy } from '@/components/builder/ai-generator/ai-generator-copy';
import { getSandboxEditorRailCopy } from './sandbox-editor-rail-copy';
import styles from './SandboxPage.module.css';

const EMPTY_CANVAS_NODES: readonly BuilderCanvasNode[] = [];

function DrawerPanelLoading() {
  return (
    <div
      role="status"
      aria-label="Loading panel"
      aria-live="polite"
      aria-busy="true"
      data-builder-panel-loading="true"
    >
      Loading…
    </div>
  );
}

const DynamicPageSwitcher = dynamic(() => import('@/components/builder/canvas/PageSwitcher'), {
  ssr: false,
  loading: DrawerPanelLoading,
});
const DynamicNavigationEditor = dynamic(() => import('@/components/builder/canvas/NavigationEditor'), {
  ssr: false,
  loading: DrawerPanelLoading,
});
const DynamicSandboxCatalogPanel = dynamic(
  () => import('@/components/builder/canvas/SandboxCatalogPanel'),
  {
    ssr: false,
    loading: DrawerPanelLoading,
  },
);
const DynamicComponentLibraryPanel = dynamic(
  () => import('@/components/builder/canvas/ComponentLibraryPanel'),
  {
    ssr: false,
    loading: DrawerPanelLoading,
  },
);
const DynamicSandboxLayersPanel = dynamic(() => import('@/components/builder/canvas/SandboxLayersPanel'), {
  ssr: false,
  loading: DrawerPanelLoading,
});
const DynamicUndoStackTimeline = dynamic(() => import('@/components/builder/canvas/UndoStackTimeline'), {
  ssr: false,
  loading: DrawerPanelLoading,
});

export type SandboxDrawerPanel = 'pages' | 'add' | 'design' | 'layers' | 'nav' | 'columns' | 'history';

export type BuilderPageSummary = {
  pageId: string;
  slug: string;
  isHomePage?: boolean;
};

export type ColumnPostSummary = {
  slug: string;
  title: string;
};

export type ColumnPostsSummary = {
  loading: boolean;
  total: number | null;
  posts: ColumnPostSummary[];
  error: string | null;
};

type SandboxEditorRailProps = {
  locale: Locale;
  siteId: string;
  activeDrawer: SandboxDrawerPanel | null;
  activePageId: string | null;
  clipboardCount: number;
  columnPostsSummary: ColumnPostsSummary;
  columnsPageLookupPending: boolean;
  currentSlug: string;
  document: BuilderCanvasDocument | null;
  nodesById: Map<string, BuilderCanvasNode>;
  selectedNode: BuilderCanvasNode | null;
  focusedNavItemId: string | null;
  addNavChildParentId: string | null;
  missingPageHref?: string | null;
  appWidgets?: BuilderRegisteredAppWidget[];
  onToggleDrawer: (panel: SandboxDrawerPanel) => void;
  onOpenColumnsPanel: () => void;
  onOpenColumnsPage: () => void;
  onCloseDrawer: () => void;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  onApplyComponentDesignPreset: (presetKey: ComponentDesignPresetKey) => void;
  onSelectPage: (pageId: string, nextSlug?: string) => boolean | void | Promise<boolean | void>;
  onPagesChange: (pages: BuilderPageSummary[]) => void;
  onMissingPageHandled?: () => void;
  onNavigationChange: (items: BuilderNavItem[]) => void;
  onNavFocusHandled: () => void;
  onNavAddChildHandled: () => void;
  onSelectNode: (nodeId: string | null) => void;
  onUpdateNodeContent: (nodeId: string, content: Record<string, unknown>) => void;
  onToast: (message: string, tone: 'success' | 'error') => void;
};

type RailIconName = 'pages' | 'add' | 'design' | 'layers' | 'nav' | 'columns' | 'cms' | 'apps' | 'ai' | 'history';

function RailIcon({ name }: { name: RailIconName }) {
  let icon: ReactNode;

  switch (name) {
    case 'pages':
      icon = (
        <>
          <path d="M7 5.5h9.5a2 2 0 0 1 2 2v11" />
          <path d="M5.5 3.5h9.5a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5.5a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2Z" />
          <path d="M7.5 8.5h6" />
          <path d="M7.5 12h5" />
          <path d="M7.5 15.5h4" />
        </>
      );
      break;
    case 'add':
      icon = (
        <>
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </>
      );
      break;
    case 'design':
      icon = (
        <>
          <path d="M5.5 14.5 14.6 5.4a2 2 0 0 1 2.8 0l1.2 1.2a2 2 0 0 1 0 2.8l-9.1 9.1-4.8.8.8-4.8Z" />
          <path d="m13.5 6.5 4 4" />
          <path d="M4.5 20h15" />
        </>
      );
      break;
    case 'layers':
      icon = (
        <>
          <path d="m12 4 8 4-8 4-8-4 8-4Z" />
          <path d="m4 12 8 4 8-4" />
          <path d="m4 16 8 4 8-4" />
        </>
      );
      break;
    case 'nav':
      icon = (
        <>
          <path d="M5 7h7a4 4 0 0 1 4 4v6" />
          <path d="m12.5 13.5 3.5 3.5 3.5-3.5" />
          <circle cx="5" cy="7" r="2" />
          <circle cx="16" cy="17" r="2" />
        </>
      );
      break;
    case 'columns':
      icon = (
        <>
          <rect x="4" y="5" width="6" height="14" rx="1.6" />
          <rect x="14" y="5" width="6" height="14" rx="1.6" />
          <path d="M7 9h0" />
          <path d="M17 9h0" />
        </>
      );
      break;
    case 'cms':
      icon = (
        <>
          <ellipse cx="12" cy="6.5" rx="7" ry="3" />
          <path d="M5 6.5v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5" />
          <path d="M5 11.5v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5" />
        </>
      );
      break;
    case 'apps':
      icon = (
        <>
          <rect x="4" y="4" width="6" height="6" rx="1.5" />
          <rect x="14" y="4" width="6" height="6" rx="1.5" />
          <rect x="4" y="14" width="6" height="6" rx="1.5" />
          <path d="M17 14v6" />
          <path d="M14 17h6" />
        </>
      );
      break;
    case 'ai':
      icon = (
        <>
          <path d="M12 3.5 13.7 9l5.3 1.7-5.3 1.8L12 18l-1.7-5.5L5 10.7 10.3 9 12 3.5Z" />
          <path d="M5.5 16.5 6.2 19l2.3.7-2.3.8-.7 2.5-.8-2.5-2.2-.8 2.2-.7.8-2.5Z" />
        </>
      );
      break;
    case 'history':
      icon = (
        <>
          <path d="M7.2 7.4A7 7 0 1 1 5 12.5" />
          <path d="M7 4.5v3.2h3.2" />
          <path d="M12 8.5v4.1l3 1.8" />
        </>
      );
      break;
  }

  return (
    <svg
      className={styles.railIconSvg}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {icon}
    </svg>
  );
}

export default function SandboxEditorRail({
  locale,
  siteId,
  activeDrawer,
  activePageId,
  clipboardCount,
  columnPostsSummary,
  columnsPageLookupPending,
  currentSlug,
  document,
  nodesById,
  selectedNode,
  focusedNavItemId,
  addNavChildParentId,
  missingPageHref,
  appWidgets = [],
  onToggleDrawer,
  onOpenColumnsPanel,
  onOpenColumnsPage,
  onCloseDrawer,
  onOpenSettings,
  onOpenHistory,
  onApplyComponentDesignPreset,
  onSelectPage,
  onPagesChange,
  onMissingPageHandled,
  onNavigationChange,
  onNavFocusHandled,
  onNavAddChildHandled,
  onSelectNode,
  onUpdateNodeContent,
  onToast,
}: SandboxEditorRailProps) {
  const [focusedSectionTemplateId, setFocusedSectionTemplateId] = useState<HomeSectionTemplateId | null>(null);
  const [pageTemplateGalleryRequest, setPageTemplateGalleryRequest] = useState({ id: 0, query: '' });
  const designDrawerActive = activeDrawer === 'design';
  const pageTemplateCount = useMemo(
    () => (designDrawerActive ? getAllTemplates().length : 0),
    [designDrawerActive],
  );
  const designNodes = designDrawerActive
    ? (document?.nodes ?? EMPTY_CANVAS_NODES)
    : EMPTY_CANVAS_NODES;
  const designerTargetSummary = useMemo(
    () => summarizeComponentDesignTargets(designNodes),
    [designNodes],
  );
  const copy = useMemo(() => getSandboxEditorRailCopy(locale), [locale]);
  const aiGeneratorCopy = useMemo(() => getAiGeneratorCopy(locale), [locale]);
  const recommendedDesignerPreset = useMemo(
    () => getComponentDesignPreset(designerTargetSummary.recommendedPresetKey),
    [designerTargetSummary.recommendedPresetKey],
  );
  const recommendedDesignerPresetCopy = copy.design.presets[recommendedDesignerPreset.key];
  const currentFitLeaderPreset = useMemo(
    () => getComponentDesignPreset(designerTargetSummary.currentFitLeaderPresetKey),
    [designerTargetSummary.currentFitLeaderPresetKey],
  );
  const currentFitLeaderPresetCopy = copy.design.presets[currentFitLeaderPreset.key];
  const designerAuditState = designerTargetSummary.total === 0
    ? 'empty'
    : designerTargetSummary.recommendedChangeCount === 0
      ? 'synced'
      : 'pending';
  const canApplyRecommendedDesignerPreset = designerAuditState === 'pending';
  const canApplyCurrentFitLeader = designerTargetSummary.total > 0
    && designerTargetSummary.currentFitLeaderChangeCount > 0
    && !designerTargetSummary.recommendedIsCurrentFitLeader;
  const isColumnsCanvasActive = currentSlug === 'columns';
  const designerQualityLabel = designerTargetSummary.recommendedQualityState === 'empty'
    ? copy.design.noComponentTargets
    : designerTargetSummary.recommendedQualityState === 'synced'
      ? copy.design.allTargetsAligned
      : designerTargetSummary.recommendedQualityState === 'partial'
        ? copy.design.partialSystemFit
        : copy.design.systemUpdateNeeded;
  const selectPageAndClose = (pageId: string, nextSlug?: string) => {
    void Promise.resolve(onSelectPage(pageId, nextSlug)).then((loaded) => {
      if (loaded !== false) onCloseDrawer();
    });
  };
  const openPageTemplateGallery = (query?: string) => {
    const normalizedQuery = (query ?? '').trim();
    setPageTemplateGalleryRequest((current) => ({
      id: current.id + 1,
      query: normalizedQuery,
    }));
    if (activeDrawer !== 'pages') {
      onToggleDrawer('pages');
    }
  };
  const availableSectionTemplates = useMemo(() => {
    if (nodesById.size === 0) return [];
    return HOME_SECTION_TEMPLATE_TARGETS.filter((target) => nodesById.has(target.nodeId));
  }, [nodesById]);
  const selectedSectionTemplateNode = useMemo(() => {
    if (!selectedNode) return null;
    let current: BuilderCanvasNode | undefined = selectedNode;

    while (current) {
      if (getHomeSectionTemplateTarget(current)) return current;
      if (!current.parentId) return null;
      current = nodesById.get(current.parentId);
    }

    return null;
  }, [nodesById, selectedNode]);
  const focusedSectionTemplateNode = useMemo(() => {
    if (!focusedSectionTemplateId) return null;
    const target = HOME_SECTION_TEMPLATE_TARGETS.find((candidate) => candidate.id === focusedSectionTemplateId);
    if (!target) return null;
    return nodesById.get(target.nodeId) ?? null;
  }, [focusedSectionTemplateId, nodesById]);
  const activeSectionTemplateNode = selectedSectionTemplateNode ?? focusedSectionTemplateNode;
  const selectedSectionTemplate = activeSectionTemplateNode
    ? getHomeSectionTemplateTarget(activeSectionTemplateNode)
    : null;
  const selectedSectionTemplateVariant = activeSectionTemplateNode
    ? getHomeSectionTemplateVariant(activeSectionTemplateNode)
    : null;
  const selectedSectionTemplateVariants = selectedSectionTemplate
    ? getHomeSectionTemplateVariantOptions(selectedSectionTemplate.id)
    : HOME_SECTION_TEMPLATE_VARIANTS;

  return (
    <>
      <div className={styles.iconRail} data-drawer-open={activeDrawer ? 'true' : 'false'}>
        <button
          type="button"
          className={`${styles.railButton} ${activeDrawer === 'pages' ? styles.railButtonActive : ''}`}
          onClick={() => onToggleDrawer('pages')}
          aria-pressed={activeDrawer === 'pages'}
          aria-label={copy.rail.pages}
          data-builder-rail-item="pages"
          title={copy.rail.pages}
        >
          <span className={styles.railButtonIcon} aria-hidden="true"><RailIcon name="pages" /></span>
          <span className={styles.railButtonLabel}>{copy.rail.pages}</span>
        </button>
        <button
          type="button"
          className={`${styles.railButton} ${activeDrawer === 'add' ? styles.railButtonActive : ''}`}
          onClick={() => onToggleDrawer('add')}
          aria-pressed={activeDrawer === 'add'}
          aria-label={copy.rail.add}
          data-builder-rail-item="add"
          title={copy.rail.add}
        >
          <span className={styles.railButtonIcon} aria-hidden="true"><RailIcon name="add" /></span>
          <span className={styles.railButtonLabel}>{copy.rail.add}</span>
        </button>
        <button
          type="button"
          className={`${styles.railButton} ${activeDrawer === 'design' ? styles.railButtonActive : ''}`}
          onClick={() => onToggleDrawer('design')}
          aria-pressed={activeDrawer === 'design'}
          aria-label={copy.rail.design}
          data-builder-rail-item="design"
          title={copy.rail.design}
        >
          <span className={styles.railButtonIcon} aria-hidden="true"><RailIcon name="design" /></span>
          <span className={styles.railButtonLabel}>{copy.rail.design}</span>
        </button>
        <button
          type="button"
          className={`${styles.railButton} ${activeDrawer === 'layers' ? styles.railButtonActive : ''}`}
          onClick={() => onToggleDrawer('layers')}
          aria-pressed={activeDrawer === 'layers'}
          aria-label={copy.rail.layers}
          data-builder-rail-item="layers"
          title={copy.rail.layers}
        >
          <span className={styles.railButtonIcon} aria-hidden="true"><RailIcon name="layers" /></span>
          <span className={styles.railButtonLabel}>{copy.rail.layers}</span>
        </button>
        <button
          type="button"
          className={`${styles.railButton} ${activeDrawer === 'nav' ? styles.railButtonActive : ''}`}
          onClick={() => onToggleDrawer('nav')}
          aria-pressed={activeDrawer === 'nav'}
          aria-label={copy.rail.navigation}
          data-builder-rail-item="nav"
          title={copy.rail.navigation}
        >
          <span className={styles.railButtonIcon} aria-hidden="true"><RailIcon name="nav" /></span>
          <span className={styles.railButtonLabel}>{copy.rail.navigation}</span>
        </button>
        <button
          type="button"
          className={`${styles.railButton} ${activeDrawer === 'columns' ? styles.railButtonActive : ''}`}
          onClick={onOpenColumnsPanel}
          aria-pressed={activeDrawer === 'columns'}
          aria-label={copy.rail.columns}
          data-builder-rail-item="columns"
          title={copy.columns.description}
        >
          <span className={styles.railButtonIcon} aria-hidden="true"><RailIcon name="columns" /></span>
          <span className={styles.railButtonLabel}>{copy.rail.columns}</span>
        </button>
        <a
          className={styles.railButton}
          href={`/${locale}/admin-builder/cms`}
          aria-label={copy.rail.contentManager}
          title={copy.rail.contentManager}
        >
          <span className={styles.railButtonIcon} aria-hidden="true"><RailIcon name="cms" /></span>
          <span className={styles.railButtonLabel}>CMS</span>
        </a>
        <a
          className={styles.railButton}
          href={`/${locale}/admin-builder/apps`}
          aria-label={copy.rail.appMarket}
          title={copy.rail.appMarket}
        >
          <span className={styles.railButtonIcon} aria-hidden="true"><RailIcon name="apps" /></span>
          <span className={styles.railButtonLabel}>{copy.rail.appMarket}</span>
        </a>
        <a
          className={styles.railButton}
          href={`/${locale}/admin-builder/ai-generator`}
          aria-label={aiGeneratorCopy.title}
          title={aiGeneratorCopy.description}
        >
          <span className={styles.railButtonIcon} aria-hidden="true"><RailIcon name="ai" /></span>
          <span className={styles.railButtonLabel}>{copy.rail.ai}</span>
        </a>
        <button
          type="button"
          className={`${styles.railButton} ${activeDrawer === 'history' ? styles.railButtonActive : ''}`}
          onClick={() => onToggleDrawer('history')}
          aria-pressed={activeDrawer === 'history'}
          aria-label={copy.rail.history}
          data-builder-rail-item="history"
          title={copy.rail.history}
        >
          <span className={styles.railButtonIcon} aria-hidden="true"><RailIcon name="history" /></span>
          <span className={styles.railButtonLabel}>{copy.rail.history}</span>
        </button>
      </div>

      <aside
        className={`${styles.drawer} ${!activeDrawer ? styles.drawerHidden : ''}`}
        aria-hidden={!activeDrawer}
        data-builder-drawer={activeDrawer ?? undefined}
        data-builder-drawer-boundary={activeDrawer ? 'true' : undefined}
        onPointerDown={(event) => event.stopPropagation()}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {activeDrawer === 'pages' ? (
          <div className={styles.drawerBody} data-builder-drawer-body="pages">
            <DynamicPageSwitcher
              locale={locale}
              siteId={siteId}
              activePageId={activePageId}
              clipboardCount={clipboardCount}
              columnPostsSummary={columnPostsSummary}
              templateGalleryInitialSearch={pageTemplateGalleryRequest.query}
              templateGalleryRequestId={pageTemplateGalleryRequest.id}
              missingPageHref={missingPageHref}
              onSelectPage={selectPageAndClose}
              onPagesChange={onPagesChange}
              onMissingPageHandled={onMissingPageHandled}
              onToast={onToast}
            />
          </div>
        ) : null}

        {activeDrawer === 'add' ? (
          <div className={styles.drawerBody} data-builder-drawer-body="add">
            <ComponentLibraryShortcut locale={locale} />
            <DynamicSandboxCatalogPanel
              locale={locale}
              appWidgets={appWidgets}
              onOpenPageTemplates={openPageTemplateGallery}
            />
            <DynamicComponentLibraryPanel locale={locale} />
          </div>
        ) : null}

        {activeDrawer === 'design' ? (
          <div className={styles.drawerBody} data-builder-drawer-body="design">
            <section className={styles.panelSection} data-builder-design-section-templates="true">
              <header className={styles.panelSectionHeader}>
                <div>
                  <span>{copy.design.templates}</span>
                  <strong>{copy.design.sectionDesign}</strong>
                </div>
                {selectedSectionTemplate ? (
                  <button
                    type="button"
                    className={styles.panelHeaderButton}
                    onClick={() => {
                      setFocusedSectionTemplateId(null);
                      onSelectNode(null);
                    }}
                  >
                    ← {copy.design.sectionList}
                  </button>
                ) : null}
              </header>
              {selectedSectionTemplate && activeSectionTemplateNode && selectedSectionTemplateVariant ? (
                <>
                  <p className={styles.panelCopy}>
                    {copy.design.sectionDescription}
                  </p>
                  <div className={styles.sectionTemplateVariantGrid}>
                    {selectedSectionTemplateVariants.map((variant) => (
                      <button
                        key={variant.key}
                        type="button"
                        data-builder-section-template-option={`${selectedSectionTemplate.id}:${variant.key}`}
                        className={`${styles.sectionTemplateVariantCard} ${
                          selectedSectionTemplateVariant === variant.key ? styles.sectionTemplateVariantCardActive : ''
                        }`}
                        aria-pressed={selectedSectionTemplateVariant === variant.key}
                        onClick={() => onUpdateNodeContent(activeSectionTemplateNode.id, { variant: variant.key })}
                      >
                        <em
                          className={styles.sectionTemplateVariantPreview}
                          data-section-template-preview={variant.key}
                          aria-hidden="true"
                        >
                          <i />
                          <i />
                          <i />
                        </em>
                        <strong>{variant.label}</strong>
                        <span>{variant.description}</span>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <p className={styles.panelCopy}>{copy.design.overviewDescription}</p>
                  <button
                    type="button"
                    className={styles.actionButton}
                    data-builder-design-open-page-template-market="true"
                    onClick={() => openPageTemplateGallery('홈페이지')}
                  >
                    {copy.design.openTemplates(pageTemplateCount)}
                  </button>
                  <div className={styles.sectionTemplateVariantGrid} data-builder-section-template-targets="true">
                    {(availableSectionTemplates.length > 0 ? availableSectionTemplates : HOME_SECTION_TEMPLATE_TARGETS).map((target) => (
                      <button
                        key={target.id}
                        type="button"
                        data-builder-section-template-target={target.id}
                        className={styles.sectionTemplateVariantCard}
                        disabled={!availableSectionTemplates.some((available) => available.id === target.id)}
                        onClick={() => {
                          setFocusedSectionTemplateId(target.id);
                          onSelectNode(target.nodeId);
                        }}
                      >
                        <em
                          className={styles.sectionTemplateVariantPreview}
                          data-section-template-preview={getHomeSectionTemplateVariantOptions(target.id)[0]?.key ?? 'flat'}
                          aria-hidden="true"
                        >
                          <i />
                          <i />
                          <i />
                        </em>
                        <strong>{target.label}</strong>
                        <span>{copy.design.sectionTemplateTargetSummary(getHomeSectionTemplateVariantOptions(target.id).length, target.description)}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </section>
            <section className={styles.panelSection}>
              <header className={styles.panelSectionHeader}>
                <div>
                  <span>{copy.design.designer}</span>
                  <strong>{copy.design.siteSettings}</strong>
                </div>
                <button
                  type="button"
                  className={styles.panelHeaderButton}
                  onClick={onOpenSettings}
                >
                  {copy.design.open}
                </button>
              </header>
              <p className={styles.panelCopy}>
                {copy.design.siteSettingsDescription}
              </p>
            </section>
            <section className={styles.panelSection} data-builder-designer-polish="true">
              <header className={styles.panelSectionHeader}>
                <div>
                  <span>{copy.design.designer}</span>
                  <strong>{copy.design.polishPresets}</strong>
                </div>
              </header>
              <p className={styles.panelCopy}>
                {copy.design.sectionDescription}
              </p>
              <div
                className={styles.designerAudit}
                data-builder-designer-audit="true"
                data-builder-designer-audit-total={designerTargetSummary.total}
                data-builder-designer-audit-buttons={designerTargetSummary.buttons}
                data-builder-designer-audit-cards={designerTargetSummary.cards}
                data-builder-designer-audit-form-fields={designerTargetSummary.formFields}
                data-builder-designer-audit-form-submits={designerTargetSummary.formSubmits}
                data-builder-designer-audit-recommended={designerTargetSummary.recommendedPresetKey}
                data-builder-designer-audit-matched={designerTargetSummary.recommendedMatchedCount}
                data-builder-designer-audit-changes={designerTargetSummary.recommendedChangeCount}
                data-builder-designer-audit-change-node-ids={designerTargetSummary.recommendedChangeNodeIdPayload}
                data-builder-designer-audit-matched-node-ids={designerTargetSummary.recommendedMatchedNodeIdPayload}
                data-builder-designer-audit-change-details={designerTargetSummary.recommendedChangeDetailPayload}
                data-builder-designer-audit-priority-payload={designerTargetSummary.recommendedPriorityPayload}
                data-builder-designer-audit-preview-payload={designerTargetSummary.recommendedChangePreviewPayload}
                data-builder-designer-audit-change-breakdown={designerTargetSummary.recommendedChangeBreakdownPayload}
                data-builder-designer-audit-change-buttons={designerTargetSummary.recommendedChangeCounts.buttons}
                data-builder-designer-audit-change-cards={designerTargetSummary.recommendedChangeCounts.cards}
                data-builder-designer-audit-change-form-fields={designerTargetSummary.recommendedChangeCounts.formFields}
                data-builder-designer-audit-change-form-submits={designerTargetSummary.recommendedChangeCounts.formSubmits}
                data-builder-designer-audit-matched-buttons={designerTargetSummary.recommendedMatchedCounts.buttons}
                data-builder-designer-audit-matched-cards={designerTargetSummary.recommendedMatchedCounts.cards}
                data-builder-designer-audit-matched-form-fields={designerTargetSummary.recommendedMatchedCounts.formFields}
                data-builder-designer-audit-matched-form-submits={designerTargetSummary.recommendedMatchedCounts.formSubmits}
                data-builder-designer-audit-quality-score={designerTargetSummary.recommendedQualityScore}
                data-builder-designer-audit-quality-state={designerTargetSummary.recommendedQualityState}
                data-builder-designer-audit-quality-payload={designerTargetSummary.recommendedQualityPayload}
                data-builder-designer-audit-quality-signals={designerTargetSummary.recommendedQualitySignalPayload}
                data-builder-designer-audit-system-fit-payload={designerTargetSummary.presetQualityComparisonPayload}
                data-builder-designer-audit-fit-leader={designerTargetSummary.currentFitLeaderPresetKey}
                data-builder-designer-audit-fit-leader-score={designerTargetSummary.currentFitLeaderScore}
                data-builder-designer-audit-fit-leader-changes={designerTargetSummary.currentFitLeaderChangeCount}
                data-builder-designer-audit-fit-leader-payload={designerTargetSummary.currentFitLeaderPayload}
                data-builder-designer-audit-recommended-is-fit-leader={designerTargetSummary.recommendedIsCurrentFitLeader}
                data-builder-designer-audit-recommended-change-delta={designerTargetSummary.recommendedChangeDeltaFromLeader}
                data-builder-designer-audit-decision-payload={designerTargetSummary.recommendationDecisionPayload}
                data-builder-designer-audit-state={designerAuditState}
              >
                <div className={styles.designerAuditHeader}>
                  <span>{copy.design.audit}</span>
                  <strong>{copy.design.components(designerTargetSummary.total)}</strong>
                </div>
                <p data-builder-designer-audit-recommendation="true">
                  {copy.design.recommendation} {recommendedDesignerPresetCopy.label} · {recommendedDesignerPresetCopy.recommendation}
                </p>
                <p
                  className={styles.designerAuditPreview}
                  data-builder-designer-audit-change-preview="true"
                >
                  {designerAuditState === 'empty'
                    ? copy.design.previewEmpty
                    : designerAuditState === 'synced'
                      ? copy.design.previewSynced
                      : copy.design.previewPending(designerTargetSummary.recommendedChangeCount, designerTargetSummary.recommendedMatchedCount)}
                </p>
                <div
                  className={styles.designerAuditQuality}
                  data-builder-designer-audit-quality="true"
                >
                  <span>{copy.design.fit(designerTargetSummary.recommendedQualityScore)}</span>
                  <strong>{designerQualityLabel}</strong>
                </div>
                <div className={styles.designerAuditSignals}>
                  {designerTargetSummary.recommendedQualitySignals.slice(0, 4).map((signal) => (
                    <span
                      key={signal}
                      data-builder-designer-audit-quality-signal={signal}
                    >
                      {copy.design.qualitySignal(signal)}
                    </span>
                  ))}
                </div>
                <div className={styles.designerAuditSystemFit}>
                  {designerTargetSummary.presetQualityComparisons.map((comparison) => (
                    <span
                      key={comparison.presetKey}
                      data-builder-designer-audit-system-fit={comparison.presetKey}
                      data-builder-designer-audit-system-fit-score={comparison.score}
                      data-builder-designer-audit-system-fit-state={comparison.state}
                      data-builder-designer-audit-system-fit-recommended={comparison.presetKey === recommendedDesignerPreset.key}
                      data-builder-designer-audit-system-fit-leader={comparison.presetKey === currentFitLeaderPreset.key}
                    >
                      {copy.design.presets[comparison.presetKey].label} {comparison.score}% · {comparison.changeCount} {copy.design.changesLabel}
                      {comparison.presetKey === recommendedDesignerPreset.key ? copy.design.recommendedSuffix : ''}
                      {comparison.presetKey === currentFitLeaderPreset.key ? copy.design.closestSuffix : ''}
                    </span>
                  ))}
                </div>
                <div
                  className={styles.designerAuditFitLeader}
                  data-builder-designer-audit-fit-leader-card="true"
                >
                  <span>{copy.design.currentFitLeader}</span>
                  <strong>
                    {copy.design.currentFitLeaderSummary(currentFitLeaderPresetCopy.label, designerTargetSummary.currentFitLeaderScore, designerTargetSummary.currentFitLeaderChangeCount)}
                  </strong>
                  <em>
                    {designerTargetSummary.recommendedIsCurrentFitLeader
                      ? copy.design.recommendedIsCurrentFitLeader
                      : copy.design.recommendedChangeDelta(recommendedDesignerPresetCopy.label, designerTargetSummary.recommendedChangeDeltaFromLeader)}
                  </em>
                </div>
                <div className={styles.designerAuditActionRow}>
                  {!designerTargetSummary.recommendedIsCurrentFitLeader ? (
                    <button
                      type="button"
                      className={`${styles.designerAuditActionButton} ${styles.designerAuditActionButtonSecondary}`}
                      data-builder-designer-audit-fit-leader-action="true"
                      data-builder-designer-audit-fit-leader-action-preset={currentFitLeaderPreset.key}
                      disabled={!canApplyCurrentFitLeader}
                      onClick={() => onApplyComponentDesignPreset(currentFitLeaderPreset.key)}
                    >
                      {canApplyCurrentFitLeader
                        ? copy.design.currentFitApply(currentFitLeaderPresetCopy.label)
                        : copy.design.currentFitApplied}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className={styles.designerAuditActionButton}
                    data-builder-designer-audit-recommended-action="true"
                    data-builder-designer-audit-recommended-action-preset={recommendedDesignerPreset.key}
                    disabled={!canApplyRecommendedDesignerPreset}
                    onClick={() => onApplyComponentDesignPreset(recommendedDesignerPreset.key)}
                  >
                    {designerAuditState === 'empty'
                      ? copy.design.noComponentTargets
                      : designerAuditState === 'synced'
                        ? copy.design.recommendationApplied
                        : copy.design.applyRecommendation(recommendedDesignerPresetCopy.label)}
                  </button>
                </div>
                <div className={styles.designerAuditCounts}>
                  <span>{copy.design.buttons} {designerTargetSummary.buttons}</span>
                  <span>{copy.design.cards} {designerTargetSummary.cards}</span>
                  <span>{copy.design.fields} {designerTargetSummary.formFields}</span>
                  <span>{copy.design.submit} {designerTargetSummary.formSubmits}</span>
                </div>
                <div className={styles.designerAuditBreakdown}>
                  <span data-builder-designer-audit-breakdown="buttons">
                    {copy.design.buttonsChange(designerTargetSummary.recommendedChangeCounts.buttons)}
                  </span>
                  <span data-builder-designer-audit-breakdown="cards">
                    {copy.design.cardsChange(designerTargetSummary.recommendedChangeCounts.cards)}
                  </span>
                  <span data-builder-designer-audit-breakdown="fields">
                    {copy.design.fieldsChange(designerTargetSummary.recommendedChangeCounts.formFields)}
                  </span>
                  <span data-builder-designer-audit-breakdown="submits">
                    {copy.design.submitChange(designerTargetSummary.recommendedChangeCounts.formSubmits)}
                  </span>
                </div>
                {designerTargetSummary.recommendedChangeDetails.length > 0 ? (
                  <div className={styles.designerAuditChangeDetails}>
                    {designerTargetSummary.recommendedChangeDetails.slice(0, 4).map((detail) => (
                      <span
                        key={`${detail.nodeId}-${detail.property}`}
                        data-builder-designer-audit-change-detail={detail.nodeId}
                      >
                        {copy.design.changeTo(detail.category, detail.nextValue)}
                      </span>
                    ))}
                    {designerTargetSummary.recommendedChangeDetails.length > 4 ? (
                      <span className={styles.designerAuditChangeDetailMore}>
                        {copy.design.moreChanges(designerTargetSummary.recommendedChangeDetails.length - 4)}
                      </span>
                    ) : null}
                  </div>
                ) : null}
                {designerTargetSummary.recommendedPriorityItems.length > 0 ? (
                  <div
                    className={styles.designerAuditPriority}
                    data-builder-designer-audit-priority="true"
                  >
                    <span>{copy.design.priority}</span>
                    {designerTargetSummary.recommendedPriorityItems.slice(0, 4).map((item) => (
                      <em
                        key={`${item.nodeId}-${item.property}`}
                        data-builder-designer-audit-priority-item={item.nodeId}
                      >
                        {item.priority}. {copy.design.changeTo(item.category, item.nextValue)} · {copy.design.priorityReason(item.category)}
                      </em>
                    ))}
                    {designerTargetSummary.recommendedPriorityItems.length > 4 ? (
                      <em className={styles.designerAuditPriorityMore}>
                        {copy.design.morePriorities(designerTargetSummary.recommendedPriorityItems.length - 4)}
                      </em>
                    ) : null}
                  </div>
                ) : null}
              </div>
              <div className={styles.designerPresetGrid}>
                {COMPONENT_DESIGN_PRESETS.map((preset) => {
                  const presetCopy = copy.design.presets[preset.key];
                  return (
                    <button
                      key={preset.key}
                      type="button"
                      className={styles.designerPresetCard}
                      data-builder-designer-preset={preset.key}
                      data-builder-designer-preset-finish={preset.designerFinish}
                      data-builder-designer-preset-rhythm={preset.designerRhythm}
                      data-builder-designer-preset-accent={preset.designerAccent}
                      onClick={() => onApplyComponentDesignPreset(preset.key)}
                    >
                      <span
                        className={styles.designerPresetPreview}
                        data-designer-preset={preset.key}
                        aria-hidden="true"
                      >
                        <i />
                        <i />
                        <i />
                      </span>
                      <strong>{presetCopy.label}</strong>
                      <span className={styles.designerPresetDescription}>{presetCopy.description}</span>
                      <span className={styles.designerPresetMeta}>
                        <span>{presetCopy.finish}</span>
                        <span>{presetCopy.accent}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>
        ) : null}

        {activeDrawer === 'layers' ? (
          <div className={styles.drawerBody} data-builder-drawer-body="layers">
            <DynamicSandboxLayersPanel locale={locale} />
          </div>
        ) : null}

        {activeDrawer === 'nav' ? (
          <div className={styles.drawerBody} data-builder-drawer-body="nav">
            <DynamicNavigationEditor
              locale={locale}
              focusItemId={focusedNavItemId}
              addChildParentId={addNavChildParentId}
              onFocusHandled={onNavFocusHandled}
              onAddChildHandled={onNavAddChildHandled}
              onNavigationChange={onNavigationChange}
            />
          </div>
        ) : null}

        {activeDrawer === 'columns' ? (
          <div className={styles.drawerBody} data-builder-drawer-body="columns">
            <section className={styles.panelSection}>
              <header className={styles.panelSectionHeader}>
                <div>
                  <span>{copy.columns.blog}</span>
                  <strong>{copy.columns.writing}</strong>
                </div>
              </header>
              <p className={styles.panelCopy}>
                {copy.columns.description}
              </p>
              <div className={styles.columnsWorkflow} data-builder-columns-workflow="true">
                <div
                  className={styles.columnsWorkflowStep}
                  data-active={isColumnsCanvasActive ? 'true' : 'false'}
                  data-builder-columns-workflow-step="page"
                >
                  <span>{copy.columns.canvasLabel}</span>
                  <strong>{copy.columns.postList}</strong>
                  <em>{isColumnsCanvasActive ? copy.columns.currentOpen : copy.columns.openFirstClick}</em>
                </div>
                <div
                  className={styles.columnsWorkflowStep}
                  data-active="true"
                  data-builder-columns-workflow-step="manager"
                >
                  <span>{copy.columns.blog}</span>
                  <strong>{copy.columns.postList}</strong>
                  <em>
                    {columnPostsSummary.loading
                      ? copy.columns.syncing
                      : copy.columns.connected(columnPostsSummary.total ?? columnPostsSummary.posts.length)}
                  </em>
                </div>
              </div>
              <div className={styles.columnsStatusCard}>
                <strong>
                  {columnPostsSummary.loading
                    ? copy.columns.loading
                    : columnPostsSummary.error
                      ? copy.columns.checkNeeded
                      : copy.columns.connectedCount(columnPostsSummary.total ?? columnPostsSummary.posts.length)}
                </strong>
                {columnPostsSummary.error ? (
                  <span>{copy.columns.reload}</span>
                ) : (
                  <span>{copy.columns.description}</span>
                )}
                {columnPostsSummary.posts.length > 0 ? (
                  <div className={styles.columnsRecentList} aria-label={copy.columns.recentColumns}>
                    {columnPostsSummary.posts.slice(0, 4).map((post) => (
                      <a
                        key={post.slug}
                        href={`/${locale}/admin-builder/columns/${encodeURIComponent(post.slug)}/edit`}
                        title={post.title}
                      >
                        {copy.columns.edit} · {post.title}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className={styles.actionGrid}>
                <a className={`${styles.actionButton} ${styles.actionButtonPrimary}`} href={`/${locale}/admin-builder/columns?new=1`}>
                  {copy.columns.newPost}
                </a>
                <a className={styles.actionButton} href={`/${locale}/admin-builder/columns`}>
                  {copy.columns.postList}
                </a>
                <button
                  type="button"
                  className={styles.actionButton}
                  disabled={columnsPageLookupPending}
                  data-builder-open-columns-page="true"
                  onClick={onOpenColumnsPage}
                >
                  {columnsPageLookupPending ? copy.columns.pageLookupPending : copy.rail.columns}
                </button>
                <a className={styles.actionButton} href={`/${locale}/columns`} target="_blank" rel="noreferrer">
                  {copy.columns.openPublicColumns}
                </a>
              </div>
            </section>
          </div>
        ) : null}

        {activeDrawer === 'history' ? (
          <div className={styles.drawerBody} data-builder-drawer-body="history">
            <DynamicUndoStackTimeline />
            <section className={styles.panelSection}>
              <header className={styles.panelSectionHeader}>
                <div>
                  <span>{copy.history.history}</span>
                  <strong>{copy.history.versionHistory}</strong>
                </div>
                <button
                  type="button"
                  className={styles.panelHeaderButton}
                  onClick={onOpenHistory}
                >
                  {copy.history.open}
                </button>
              </header>
              <p className={styles.panelCopy}>
                {copy.history.description}
              </p>
            </section>
          </div>
        ) : null}
      </aside>
    </>
  );
}
