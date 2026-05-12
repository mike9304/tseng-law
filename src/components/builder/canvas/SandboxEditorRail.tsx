'use client';

import { useMemo, useState } from 'react';
import NavigationEditor from '@/components/builder/canvas/NavigationEditor';
import PageSwitcher from '@/components/builder/canvas/PageSwitcher';
import SandboxCatalogPanel from '@/components/builder/canvas/SandboxCatalogPanel';
import SandboxLayersPanel from '@/components/builder/canvas/SandboxLayersPanel';
import ComponentLibraryPanel from '@/components/builder/canvas/ComponentLibraryPanel';
import UndoStackTimeline from '@/components/builder/canvas/UndoStackTimeline';
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
  onToggleDrawer: (panel: SandboxDrawerPanel) => void;
  onOpenColumnsPanel: () => void;
  onOpenColumnsPage: () => void;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  onSelectPage: (pageId: string, nextSlug?: string) => void | Promise<void>;
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
  onToggleDrawer,
  onOpenColumnsPanel,
  onOpenColumnsPage,
  onOpenSettings,
  onOpenHistory,
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
  const [pageTemplateGalleryRequestId, setPageTemplateGalleryRequestId] = useState(0);
  const openPageTemplateGallery = () => {
    setPageTemplateGalleryRequestId((current) => current + 1);
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
      if (getHomeSectionTemplateTarget(current.id)) return current;
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
    ? getHomeSectionTemplateTarget(activeSectionTemplateNode.id)
    : null;
  const selectedSectionTemplateVariant = activeSectionTemplateNode
    ? getHomeSectionTemplateVariant(activeSectionTemplateNode)
    : null;
  const selectedSectionTemplateVariants = selectedSectionTemplate
    ? getHomeSectionTemplateVariantOptions(selectedSectionTemplate.id)
    : HOME_SECTION_TEMPLATE_VARIANTS;

  return (
    <>
      <div className={styles.iconRail}>
        <button
          type="button"
          className={`${styles.railButton} ${activeDrawer === 'pages' ? styles.railButtonActive : ''}`}
          onClick={() => onToggleDrawer('pages')}
          aria-pressed={activeDrawer === 'pages'}
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
          title="칼럼 페이지로 이동 / 글 관리"
        >
          <span className={styles.railButtonIcon} aria-hidden="true">▦</span>
          <span className={styles.railButtonLabel}>칼럼</span>
        </button>
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
      >
        {activeDrawer === 'pages' ? (
          <div className={styles.drawerBody}>
            <PageSwitcher
              locale={locale}
              activePageId={activePageId}
              clipboardCount={clipboardCount}
              columnPostsSummary={columnPostsSummary}
              templateGalleryRequestId={pageTemplateGalleryRequestId}
              onSelectPage={onSelectPage}
              onPagesChange={onPagesChange}
              onToast={onToast}
            />
          </div>
        ) : null}

        {activeDrawer === 'add' ? (
          <div className={styles.drawerBody}>
            <SandboxCatalogPanel
              locale={locale}
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
                  <button
                    type="button"
                    className={styles.panelHeaderButton}
                    data-builder-section-template-back="true"
                    onClick={() => {
                      setFocusedSectionTemplateId(null);
                      onSelectNode(null);
                    }}
                  >
                    섹션 목록으로 돌아가기
                  </button>
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
                    주요 서비스, 칼럼 아카이브, FAQ, 오시는길 섹션을 선택하면 디자인 템플릿을 바꿀 수 있습니다.
                  </p>
                  <div className={styles.sectionTemplateHintList}>
                    {(availableSectionTemplates.length > 0 ? availableSectionTemplates : HOME_SECTION_TEMPLATE_TARGETS).map((target) => (
                      <button
                        key={target.id}
                        type="button"
                        className={styles.sectionTemplateHintButton}
                        disabled={!availableSectionTemplates.some((available) => available.id === target.id)}
                        onClick={() => {
                          setFocusedSectionTemplateId(target.id);
                          onSelectNode(target.nodeId);
                        }}
                      >
                        {target.label}
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
