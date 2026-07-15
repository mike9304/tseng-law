'use client';

import {
  useState,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import CanvasContainer from '@/components/builder/canvas/CanvasContainer';
import { BuilderDatasetPreviewProvider } from '@/components/builder/canvas/BuilderDatasetPreviewContext';
import SandboxEditorRail from '@/components/builder/canvas/SandboxEditorRail';
import SandboxInspectorPanel from '@/components/builder/canvas/SandboxInspectorPanel';
import SandboxPublishedSiteChrome from '@/components/builder/canvas/SandboxPublishedSiteChrome';
import type { SandboxEditorWorkspaceProps } from '@/components/builder/canvas/SandboxEditorWorkspace.types';
import styles from './SandboxPage.module.css';
import chromeStyles from './SandboxChrome.module.css';

function getInspectorChromeCopy(locale: SandboxEditorWorkspaceProps['locale']) {
  if (locale === 'zh-hant') {
    return {
      collapse: '收合檢查器',
      expand: '顯示檢查器',
      switchToInspector: '關閉目前面板並顯示檢查器',
    };
  }
  if (locale === 'en') {
    return {
      collapse: 'Collapse inspector',
      expand: 'Show inspector',
      switchToInspector: 'Close the current panel and show inspector',
    };
  }
  return {
    collapse: '인스펙터 접기',
    expand: '인스펙터 열기',
    switchToInspector: '현재 패널을 닫고 인스펙터 열기',
  };
}

export default function SandboxEditorWorkspace({
  locale,
  siteId,
  activeDrawer,
  activePageId,
  clipboardCount,
  columnPostsSummary,
  columnsPageLookupPending,
  document,
  nodesById,
  selectedNode,
  focusedNavItemId,
  addNavChildParentId,
  siteName,
  siteSettings,
  siteTheme,
  headerNavItems,
  currentSlug,
  activeNavItemId,
  missingPageHref,
  viewportWidth,
  canvasOuterStyle,
  canvasWrapperStyle,
  canvasColumnRef,
  publicChromeCopy,
  collabCursors = [],
  linkPickerLightboxes,
  linkPickerPopups,
  linkPickerSitePages,
  columnPosts,
  faqCategories,
  faqItems,
  datasetPreviewTargets = [],
  appWidgets = [],
  memberNavPreview,
  onToggleDrawer,
  onOpenColumnsPanel,
  onOpenColumnsPage,
  onOpenSettings,
  onOpenHistory,
  onApplyComponentDesignPreset,
  onSetActiveDrawer,
  onSelectPage,
  onPagesChange,
  onMissingPageHandled,
  onNavigationChange,
  onNavFocusHandled,
  onNavAddChildHandled,
  onSelectNode,
  onUpdateNodeContent,
  onHeaderNavigate,
  onRequestEditNavItem,
  onRequestRenameNavItem,
  onRequestAddNavChild,
  onRequestMoveNavItem,
  onFooterLinkActivation,
  onRequestAssetLibrary,
  onRequestImageEditor,
  onRequestMoveToPage,
  onRequestSaveAsSection,
  canDecomposeCurrentPage,
  onDecomposeCurrentPage,
  onRequestInsertSavedSection,
  onCanvasPageLink,
  onToast,
  onActivity,
}: SandboxEditorWorkspaceProps) {
  const [inspectorCollapsed, setInspectorCollapsed] = useState(false);
  const inspectorChromeCopy = getInspectorChromeCopy(locale);
  const handleCanvasPageLinkActivation = (event: ReactMouseEvent<HTMLElement>) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const link = target.closest<HTMLAnchorElement>('a[data-builder-canvas-page-link="true"][href]');
    if (!link) return;
    const href = link.getAttribute('href') ?? '';
    if (!href || !href.startsWith('/')) return;
    if (event.altKey || event.metaKey || event.ctrlKey || event.shiftKey) return;
    if ('button' in event && event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    onCanvasPageLink(href);
  };

  return (
    <BuilderDatasetPreviewProvider
      targets={datasetPreviewTargets}
      columnPosts={columnPosts}
      faqCategories={faqCategories}
      faqItems={faqItems}
    >
      <section
        className={`${styles.editorShell} ${chromeStyles.editorShell}`}
        data-builder-active-drawer={activeDrawer ? 'true' : 'false'}
        data-builder-compact-shell="true"
      >
      <SandboxEditorRail
        locale={locale}
        siteId={siteId}
        activeDrawer={activeDrawer}
        activePageId={activePageId}
        clipboardCount={clipboardCount}
        columnPostsSummary={columnPostsSummary}
        columnsPageLookupPending={columnsPageLookupPending}
        currentSlug={currentSlug}
        document={document}
        nodesById={nodesById}
        selectedNode={selectedNode}
        focusedNavItemId={focusedNavItemId}
        addNavChildParentId={addNavChildParentId}
        missingPageHref={missingPageHref}
        onToggleDrawer={onToggleDrawer}
        onOpenColumnsPanel={onOpenColumnsPanel}
        onOpenColumnsPage={onOpenColumnsPage}
        onCloseDrawer={() => onSetActiveDrawer(null)}
        onOpenSettings={onOpenSettings}
        onOpenHistory={onOpenHistory}
        onApplyComponentDesignPreset={onApplyComponentDesignPreset}
        onSelectPage={onSelectPage}
        onPagesChange={onPagesChange}
        onMissingPageHandled={onMissingPageHandled}
        onNavigationChange={onNavigationChange}
        onNavFocusHandled={onNavFocusHandled}
        onNavAddChildHandled={onNavAddChildHandled}
        onSelectNode={onSelectNode}
        onUpdateNodeContent={onUpdateNodeContent}
        appWidgets={appWidgets}
        onToast={onToast}
      />

      <div
        ref={canvasColumnRef}
        className={styles.canvasColumn}
        style={canvasOuterStyle}
        data-builder-canvas-scroll-root="true"
      >
        <SandboxPublishedSiteChrome
          locale={locale}
          activeDrawer={activeDrawer}
          siteName={siteName}
          siteSettings={siteSettings}
          siteTheme={siteTheme}
          headerNavItems={headerNavItems}
          currentSlug={currentSlug}
          activeNavItemId={activeNavItemId}
          viewportWidth={viewportWidth}
          publicChromeCopy={publicChromeCopy}
          memberNavPreview={memberNavPreview}
          onHeaderNavigate={onHeaderNavigate}
          onOpenSettings={onOpenSettings}
          onSetActiveDrawer={onSetActiveDrawer}
          onRequestEditNavItem={onRequestEditNavItem}
          onRequestRenameNavItem={onRequestRenameNavItem}
          onRequestAddNavChild={onRequestAddNavChild}
          onRequestMoveNavItem={onRequestMoveNavItem}
          onFooterLinkActivation={onFooterLinkActivation}
        >
          <div style={canvasWrapperStyle} onClickCapture={handleCanvasPageLinkActivation}>
            <CanvasContainer
              fallbackDocument={document}
              onRequestAssetLibrary={onRequestAssetLibrary}
              onRequestImageEditor={(nodeId, initialTab) => onRequestImageEditor({ nodeId, initialTab })}
              onRequestMoveToPage={onRequestMoveToPage}
              onRequestSaveAsSection={onRequestSaveAsSection}
              onRequestInsertSavedSection={(sectionId, position, parentNodeId) => {
                onRequestInsertSavedSection(sectionId, position, parentNodeId);
              }}
              onCanvasPageLink={onCanvasPageLink}
              onToast={onToast}
              onActivity={onActivity}
              locale={locale}
              collabCursors={collabCursors}
              siteLightboxes={linkPickerLightboxes}
              sitePopups={linkPickerPopups}
              sitePages={linkPickerSitePages}
              viewportResetKey={activePageId}
            />
          </div>
        </SandboxPublishedSiteChrome>
      </div>
      {activeDrawer ? (
        <button
          type="button"
          className={chromeStyles.compactInspectorSwitch}
          data-builder-compact-panel-switch="inspector"
          onClick={() => {
            onSetActiveDrawer(null);
            setInspectorCollapsed(false);
          }}
        >
          {inspectorChromeCopy.switchToInspector}
        </button>
      ) : null}
      <div
        className={`${styles.inspectorColumn} ${chromeStyles.inspectorColumn} ${inspectorCollapsed ? chromeStyles.inspectorCollapsed : ''}`}
        data-builder-inspector-surface="true"
        data-builder-inspector-collapsed={inspectorCollapsed ? 'true' : 'false'}
      >
        <button
          type="button"
          className={chromeStyles.inspectorCollapseButton}
          aria-controls="builder-inspector-panel-host"
          aria-expanded={!inspectorCollapsed}
          aria-label={inspectorCollapsed ? inspectorChromeCopy.expand : inspectorChromeCopy.collapse}
          title={inspectorCollapsed ? inspectorChromeCopy.expand : inspectorChromeCopy.collapse}
          data-builder-inspector-toggle="true"
          onClick={() => setInspectorCollapsed((current) => !current)}
        >
          <span aria-hidden="true">{inspectorCollapsed ? '‹' : '›'}</span>
        </button>
        <div
          id="builder-inspector-panel-host"
          className={chromeStyles.inspectorPanelHost}
          hidden={inspectorCollapsed}
        >
          <SandboxInspectorPanel
            onRequestAssetLibrary={() => {
              if (selectedNode?.kind === 'image') onRequestAssetLibrary(selectedNode.id);
            }}
            onRequestImageEditor={() => {
              if (selectedNode?.kind === 'image') onRequestImageEditor({ nodeId: selectedNode.id });
            }}
            siteLightboxes={linkPickerLightboxes}
            sitePopups={linkPickerPopups}
            sitePages={linkPickerSitePages}
            canDecomposeCurrentPage={canDecomposeCurrentPage}
            onDecomposeCurrentPage={onDecomposeCurrentPage}
          />
        </div>
      </div>
      </section>
    </BuilderDatasetPreviewProvider>
  );
}
