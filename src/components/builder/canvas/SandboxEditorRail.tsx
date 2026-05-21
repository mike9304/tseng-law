'use client';

import { useMemo, useState } from 'react';
import NavigationEditor from '@/components/builder/canvas/NavigationEditor';
import PageSwitcher from '@/components/builder/canvas/PageSwitcher';
import SandboxCatalogPanel from '@/components/builder/canvas/SandboxCatalogPanel';
import SandboxLayersPanel from '@/components/builder/canvas/SandboxLayersPanel';
import ComponentLibraryPanel from '@/components/builder/canvas/ComponentLibraryPanel';
import UndoStackTimeline from '@/components/builder/canvas/UndoStackTimeline';
import type { BuilderRegisteredAppWidget } from '@/lib/builder/apps/widgets';
import type { BuilderCanvasDocument, BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { getCanvasNodesById } from '@/lib/builder/canvas/indexes';
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
  type ComponentDesignPresetKey,
} from '@/lib/builder/site/component-design-presets';
import type { BuilderNavItem } from '@/lib/builder/site/types';
import type { Locale } from '@/lib/locales';
import styles from './SandboxPage.module.css';

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
  activeDrawer: SandboxDrawerPanel | null;
  activePageId: string | null;
  clipboardCount: number;
  columnPostsSummary: ColumnPostsSummary;
  columnsPageLookupPending: boolean;
  document: BuilderCanvasDocument | null;
  selectedNode: BuilderCanvasNode | null;
  focusedNavItemId: string | null;
  addNavChildParentId: string | null;
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
  onNavigationChange: (items: BuilderNavItem[]) => void;
  onNavFocusHandled: () => void;
  onNavAddChildHandled: () => void;
  onSelectNode: (nodeId: string | null) => void;
  onUpdateNodeContent: (nodeId: string, content: Record<string, unknown>) => void;
  onToast: (message: string, tone: 'success' | 'error') => void;
};

export default function SandboxEditorRail({
  locale,
  activeDrawer,
  activePageId,
  clipboardCount,
  columnPostsSummary,
  columnsPageLookupPending,
  document,
  selectedNode,
  focusedNavItemId,
  addNavChildParentId,
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
  onNavigationChange,
  onNavFocusHandled,
  onNavAddChildHandled,
  onSelectNode,
  onUpdateNodeContent,
  onToast,
}: SandboxEditorRailProps) {
  const [focusedSectionTemplateId, setFocusedSectionTemplateId] = useState<HomeSectionTemplateId | null>(null);
  const [pageTemplateGalleryRequest, setPageTemplateGalleryRequest] = useState({ id: 0, query: '' });
  const pageTemplateCount = useMemo(() => getAllTemplates().length, []);
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
    const nodeIds = new Set(document?.nodes.map((node) => node.id) ?? []);
    return HOME_SECTION_TEMPLATE_TARGETS.filter((target) => nodeIds.has(target.nodeId));
  }, [document]);
  const selectedSectionTemplateNode = useMemo(() => {
    if (!selectedNode || !document) return null;
    const nodesById = getCanvasNodesById(document.nodes);
    let current: BuilderCanvasNode | undefined = selectedNode;

    while (current) {
      if (getHomeSectionTemplateTarget(current)) return current;
      if (!current.parentId) return null;
      current = nodesById.get(current.parentId);
    }

    return null;
  }, [document, selectedNode]);
  const focusedSectionTemplateNode = useMemo(() => {
    if (!focusedSectionTemplateId || !document) return null;
    const target = HOME_SECTION_TEMPLATE_TARGETS.find((candidate) => candidate.id === focusedSectionTemplateId);
    if (!target) return null;
    return document.nodes.find((node) => node.id === target.nodeId) ?? null;
  }, [document, focusedSectionTemplateId]);
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
          aria-label="Pages"
          data-builder-rail-item="pages"
          title="Pages"
        >
          <span className={styles.railButtonIcon} aria-hidden="true">▤</span>
          <span className={styles.railButtonLabel}>Pages</span>
        </button>
        <button
          type="button"
          className={`${styles.railButton} ${activeDrawer === 'add' ? styles.railButtonActive : ''}`}
          onClick={() => onToggleDrawer('add')}
          aria-pressed={activeDrawer === 'add'}
          aria-label="Add"
          data-builder-rail-item="add"
          title="Add"
        >
          <span className={styles.railButtonIcon} aria-hidden="true">+</span>
          <span className={styles.railButtonLabel}>Add</span>
        </button>
        <button
          type="button"
          className={`${styles.railButton} ${activeDrawer === 'design' ? styles.railButtonActive : ''}`}
          onClick={() => onToggleDrawer('design')}
          aria-pressed={activeDrawer === 'design'}
          title="Design"
        >
          <span className={styles.railButtonIcon} aria-hidden="true">◇</span>
          <span className={styles.railButtonLabel}>Design</span>
        </button>
        <button
          type="button"
          className={`${styles.railButton} ${activeDrawer === 'layers' ? styles.railButtonActive : ''}`}
          onClick={() => onToggleDrawer('layers')}
          aria-pressed={activeDrawer === 'layers'}
          title="Layers"
        >
          <span className={styles.railButtonIcon} aria-hidden="true">☰</span>
          <span className={styles.railButtonLabel}>Layers</span>
        </button>
        <button
          type="button"
          className={`${styles.railButton} ${activeDrawer === 'nav' ? styles.railButtonActive : ''}`}
          onClick={() => onToggleDrawer('nav')}
          aria-pressed={activeDrawer === 'nav'}
          title="Navigation"
        >
          <span className={styles.railButtonIcon} aria-hidden="true">↗</span>
          <span className={styles.railButtonLabel}>Navigation</span>
        </button>
        <button
          type="button"
          className={`${styles.railButton} ${activeDrawer === 'columns' ? styles.railButtonActive : ''}`}
          onClick={onOpenColumnsPanel}
          aria-pressed={activeDrawer === 'columns'}
          aria-label="Columns"
          data-builder-rail-item="columns"
          title="칼럼 페이지로 이동 / 글 관리"
        >
          <span className={styles.railButtonIcon} aria-hidden="true">▦</span>
          <span className={styles.railButtonLabel}>칼럼</span>
        </button>
        <a
          className={styles.railButton}
          href={`/${locale}/admin-builder/cms`}
          aria-label="Content Manager"
          title="CMS Content Manager"
        >
          <span className={styles.railButtonIcon} aria-hidden="true">▥</span>
          <span className={styles.railButtonLabel}>CMS</span>
        </a>
        <a
          className={styles.railButton}
          href={`/${locale}/admin-builder/apps`}
          aria-label="App Market"
          title="App Market"
        >
          <span className={styles.railButtonIcon} aria-hidden="true">▣</span>
          <span className={styles.railButtonLabel}>Apps</span>
        </a>
        <a
          className={styles.railButton}
          href={`/${locale}/admin-builder/ai-generator`}
          aria-label="AI Site Generator"
          title="AI Site Generator"
        >
          <span className={styles.railButtonIcon} aria-hidden="true">✦</span>
          <span className={styles.railButtonLabel}>AI</span>
        </a>
        <button
          type="button"
          className={`${styles.railButton} ${activeDrawer === 'history' ? styles.railButtonActive : ''}`}
          onClick={() => onToggleDrawer('history')}
          aria-pressed={activeDrawer === 'history'}
          title="History"
        >
          <span className={styles.railButtonIcon} aria-hidden="true">↺</span>
          <span className={styles.railButtonLabel}>History</span>
        </button>
      </div>

      <aside
        className={`${styles.drawer} ${!activeDrawer ? styles.drawerHidden : ''}`}
        aria-hidden={!activeDrawer}
        data-builder-drawer={activeDrawer ?? undefined}
      >
        {activeDrawer === 'pages' ? (
          <div className={styles.drawerBody}>
            <PageSwitcher
              locale={locale}
              activePageId={activePageId}
              clipboardCount={clipboardCount}
              columnPostsSummary={columnPostsSummary}
              templateGalleryInitialSearch={pageTemplateGalleryRequest.query}
              templateGalleryRequestId={pageTemplateGalleryRequest.id}
              onSelectPage={selectPageAndClose}
              onPagesChange={onPagesChange}
              onToast={onToast}
            />
          </div>
        ) : null}

        {activeDrawer === 'add' ? (
          <div className={styles.drawerBody}>
            <SandboxCatalogPanel
              locale={locale}
              appWidgets={appWidgets}
              onOpenPageTemplates={openPageTemplateGallery}
            />
            <ComponentLibraryPanel />
          </div>
        ) : null}

        {activeDrawer === 'design' ? (
          <div className={styles.drawerBody}>
            <section className={styles.panelSection} data-builder-design-section-templates="true">
              <header className={styles.panelSectionHeader}>
                <div>
                  <span>Templates</span>
                  <strong>Section design</strong>
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
                    ← 섹션 목록
                  </button>
                ) : null}
              </header>
              {selectedSectionTemplate && activeSectionTemplateNode && selectedSectionTemplateVariant ? (
                <>
                  <p className={styles.panelCopy}>
                    {selectedSectionTemplate.label}의 글, 주소, 링크 데이터는 그대로 두고 디자인 템플릿만 바꿉니다.
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
                  <p className={styles.panelCopy}>
                    섹션을 선택하면 해당 영역의 디자인 변형 12개를 바로 적용할 수 있습니다.
                  </p>
                  <button
                    type="button"
                    className={styles.actionButton}
                    data-builder-design-open-page-template-market="true"
                    onClick={() => openPageTemplateGallery('홈페이지')}
                  >
                    전체 페이지 템플릿 {pageTemplateCount}개 보기
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
                        <span>{getHomeSectionTemplateVariantOptions(target.id).length}개 디자인 템플릿 · {target.description}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </section>
            <section className={styles.panelSection}>
              <header className={styles.panelSectionHeader}>
                <div>
                  <span>Design</span>
                  <strong>Site settings</strong>
                </div>
                <button
                  type="button"
                  className={styles.panelHeaderButton}
                  onClick={onOpenSettings}
                >
                  Open
                </button>
              </header>
              <p className={styles.panelCopy}>
                브랜드, 연락처, 로고, 파비콘 같은 site-level design 설정은 modal에서 편집합니다.
              </p>
            </section>
            <section className={styles.panelSection} data-builder-designer-polish="true">
              <header className={styles.panelSectionHeader}>
                <div>
                  <span>Designer</span>
                  <strong>Polish presets</strong>
                </div>
              </header>
              <p className={styles.panelCopy}>
                현재 페이지의 버튼, 카드, 폼 요소에 전문 디자이너가 정리한 시각 시스템을 즉시 적용합니다.
              </p>
              <div className={styles.designerPresetGrid}>
                {COMPONENT_DESIGN_PRESETS.map((preset) => (
                  <button
                    key={preset.key}
                    type="button"
                    className={styles.designerPresetCard}
                    data-builder-designer-preset={preset.key}
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
                    <strong>{preset.label}</strong>
                    <span>{preset.description}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        ) : null}

        {activeDrawer === 'layers' ? (
          <div className={styles.drawerBody}>
            <SandboxLayersPanel />
          </div>
        ) : null}

        {activeDrawer === 'nav' ? (
          <div className={styles.drawerBody}>
            <NavigationEditor
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
          <div className={styles.drawerBody}>
            <section className={styles.panelSection}>
              <header className={styles.panelSectionHeader}>
                <div>
                  <span>Blog</span>
                  <strong>글쓰기</strong>
                </div>
              </header>
              <p className={styles.panelCopy}>
                제목과 본문만 쓰면 요약은 자동으로 채웁니다. 페이지 편집은 별도 버튼으로 이동합니다.
              </p>
              <div className={styles.columnsStatusCard}>
                <strong>
                  {columnPostsSummary.loading
                    ? '칼럼 불러오는 중'
                    : columnPostsSummary.error
                      ? '칼럼 연결 확인 필요'
                      : `${columnPostsSummary.total ?? columnPostsSummary.posts.length}개 칼럼 연결됨`}
                </strong>
                {columnPostsSummary.error ? (
                  <span>목록을 다시 열거나 새로고침 후 확인하세요.</span>
                ) : (
                  <span>공개 글과 빌더 초안이 같은 관리 화면에 표시됩니다.</span>
                )}
                {columnPostsSummary.posts.length > 0 ? (
                  <div className={styles.columnsRecentList} aria-label="최근 칼럼">
                    {columnPostsSummary.posts.slice(0, 4).map((post) => (
                      <a
                        key={post.slug}
                        href={`/${locale}/admin-builder/columns/${encodeURIComponent(post.slug)}/edit`}
                        title={post.title}
                      >
                        수정 · {post.title}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className={styles.actionGrid}>
                <a className={`${styles.actionButton} ${styles.actionButtonPrimary}`} href={`/${locale}/admin-builder/columns?new=1`}>
                  새 글 쓰기
                </a>
                <a className={styles.actionButton} href={`/${locale}/admin-builder/columns`}>
                  글 목록
                </a>
                <button
                  type="button"
                  className={styles.actionButton}
                  disabled={columnsPageLookupPending}
                  data-builder-open-columns-page="true"
                  onClick={onOpenColumnsPage}
                >
                  {columnsPageLookupPending ? '페이지 확인 중...' : '칼럼 페이지로 이동'}
                </button>
                <a className={styles.actionButton} href={`/${locale}/columns`} target="_blank" rel="noreferrer">
                  공개 칼럼 보기
                </a>
              </div>
            </section>
          </div>
        ) : null}

        {activeDrawer === 'history' ? (
          <div className={styles.drawerBody}>
            <UndoStackTimeline />
            <section className={styles.panelSection}>
              <header className={styles.panelSectionHeader}>
                <div>
                  <span>History</span>
                  <strong>Version history</strong>
                </div>
                <button
                  type="button"
                  className={styles.panelHeaderButton}
                  onClick={onOpenHistory}
                >
                  Open
                </button>
              </header>
              <p className={styles.panelCopy}>
                revision timeline과 restore는 existing history modal에서 확인합니다.
              </p>
            </section>
          </div>
        ) : null}
      </aside>
    </>
  );
}
