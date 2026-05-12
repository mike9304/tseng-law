'use client';

import type { CSSProperties, RefObject } from 'react';
import CanvasContainer from '@/components/builder/canvas/CanvasContainer';
import SandboxEditorRail, {
  type ColumnPostsSummary,
  type SandboxDrawerPanel,
} from '@/components/builder/canvas/SandboxEditorRail';
import SandboxInspectorPanel from '@/components/builder/canvas/SandboxInspectorPanel';
import SiteFooter from '@/components/builder/published/SiteFooter';
import SiteHeader from '@/components/builder/published/SiteHeader';
import type { BuilderCanvasDocument, BuilderCanvasNode } from '@/lib/builder/canvas/types';
import type { BuilderNavItem, BuilderSiteSettings, BuilderTheme } from '@/lib/builder/site/types';
import type { Locale } from '@/lib/locales';
import styles from './SandboxPage.module.css';

type PublicChromeCopy = {
  label: string;
  chat: string;
  event: string;
  top: string;
  chatTitle: string;
  chatBody: string;
  eventTitle: string;
  eventBody: string;
  editSettings: string;
  editColumns: string;
};

type PublicChromePanel = 'chat' | 'event' | null;

type SandboxEditorWorkspaceProps = {
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
  siteName?: string;
  siteSettings?: BuilderSiteSettings;
  siteTheme: BuilderTheme;
  headerNavItems: BuilderNavItem[];
  currentSlug: string;
  activeNavItemId: string | null;
  viewportWidth: number | null;
  canvasOuterStyle: CSSProperties;
  canvasWrapperStyle: CSSProperties;
  canvasColumnRef: RefObject<HTMLDivElement>;
  publicChromeCopy: PublicChromeCopy;
  publicChromePanel: PublicChromePanel;
  linkPickerLightboxes: Array<{ id: string; slug: string; name: string }>;
  linkPickerSitePages: Array<{ path: string; title: string; slug: string }>;
  onToggleDrawer: (panel: SandboxDrawerPanel) => void;
  onOpenColumnsPanel: () => void;
  onOpenColumnsPage: () => void;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  onSetActiveDrawer: (panel: SandboxDrawerPanel) => void;
  onSelectPage: (pageId: string, nextSlug?: string) => void | Promise<void>;
  onPagesChange: (pages: Array<{ pageId: string; slug: string; isHomePage?: boolean }>) => void;
  onNavigationChange: (items: BuilderNavItem[]) => void;
  onNavFocusHandled: () => void;
  onNavAddChildHandled: () => void;
  onSelectNode: (nodeId: string | null) => void;
  onUpdateNodeContent: (nodeId: string, content: Record<string, unknown>) => void;
  onHeaderNavigate: (href: string) => void;
  onRequestEditNavItem: (itemId: string) => void;
  onRequestAddNavChild: (parentItemId: string) => void;
  onFooterLinkActivation: (event: {
    target: EventTarget | null;
    preventDefault: () => void;
    stopPropagation: () => void;
  }) => void;
  onSetPublicChromePanel: (updater: PublicChromePanel | ((current: PublicChromePanel) => PublicChromePanel)) => void;
  onRequestAssetLibrary: (nodeId: string | null) => void;
  onRequestImageEditor: (request: { nodeId: string; initialTab?: 'crop' | 'filter' | 'alt' } | null) => void;
  onRequestMoveToPage: (nodeIds: string[]) => void;
  onRequestSaveAsSection: (rootNodeId: string) => void;
  onRequestInsertSavedSection: (sectionId: string, position: { x: number; y: number }) => void;
  onToast: (message: string, tone: 'success' | 'error') => void;
  onActivity: (message: string) => void;
};

export default function SandboxEditorWorkspace({
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
  siteName,
  siteSettings,
  siteTheme,
  headerNavItems,
  currentSlug,
  activeNavItemId,
  viewportWidth,
  canvasOuterStyle,
  canvasWrapperStyle,
  canvasColumnRef,
  publicChromeCopy,
  publicChromePanel,
  linkPickerLightboxes,
  linkPickerSitePages,
  onToggleDrawer,
  onOpenColumnsPanel,
  onOpenColumnsPage,
  onOpenSettings,
  onOpenHistory,
  onSetActiveDrawer,
  onSelectPage,
  onPagesChange,
  onNavigationChange,
  onNavFocusHandled,
  onNavAddChildHandled,
  onSelectNode,
  onUpdateNodeContent,
  onHeaderNavigate,
  onRequestEditNavItem,
  onRequestAddNavChild,
  onFooterLinkActivation,
  onSetPublicChromePanel,
  onRequestAssetLibrary,
  onRequestImageEditor,
  onRequestMoveToPage,
  onRequestSaveAsSection,
  onRequestInsertSavedSection,
  onToast,
  onActivity,
}: SandboxEditorWorkspaceProps) {
  return (
    <section className={styles.editorShell}>
      <SandboxEditorRail
        locale={locale}
        activeDrawer={activeDrawer}
        activePageId={activePageId}
        clipboardCount={clipboardCount}
        columnPostsSummary={columnPostsSummary}
        columnsPageLookupPending={columnsPageLookupPending}
        document={document}
        selectedNode={selectedNode}
        focusedNavItemId={focusedNavItemId}
        addNavChildParentId={addNavChildParentId}
        onToggleDrawer={onToggleDrawer}
        onOpenColumnsPanel={onOpenColumnsPanel}
        onOpenColumnsPage={onOpenColumnsPage}
        onOpenSettings={onOpenSettings}
        onOpenHistory={onOpenHistory}
        onSelectPage={onSelectPage}
        onPagesChange={onPagesChange}
        onNavigationChange={onNavigationChange}
        onNavFocusHandled={onNavFocusHandled}
        onNavAddChildHandled={onNavAddChildHandled}
        onSelectNode={onSelectNode}
        onUpdateNodeContent={onUpdateNodeContent}
        onToast={onToast}
      />

      <div ref={canvasColumnRef} className={styles.canvasColumn} style={canvasOuterStyle}>
        {siteName ? (
          <div
            className={styles.globalHeaderRegion}
            data-editing={activeDrawer === 'nav' ? 'true' : undefined}
            style={{ width: viewportWidth ?? '100%', maxWidth: 1280, background: '#fff', borderBottom: '1px solid #e5e7eb' }}
            role="group"
            aria-label="Editable site header"
            title="Edit header navigation"
            onClickCapture={(event) => {
              const target = event.target as HTMLElement;
              if (target.closest(`.${styles.globalRegionBadge}`)) return;
              if (target.closest('[data-builder-site-brand]')) return;
              if (target.closest('[data-builder-header-action]')) return;
              if (target.closest('[data-builder-mobile-hamburger]')) return;
              if (target.closest('[data-builder-mobile-drawer]')) return;
              const navTarget = target.closest<HTMLElement>('[data-builder-nav-item-id]');
              if (navTarget?.dataset.builderNavItemId) return;
              event.preventDefault();
              event.stopPropagation();
              onSetActiveDrawer('nav');
            }}
          >
            <div className={styles.globalRegionBadge} style={{ top: 8 }}>
              <span>Header</span>
              <strong>Menu editable</strong>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onSetActiveDrawer('nav');
                }}
              >
                Edit menu
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onOpenSettings();
                }}
              >
                Site settings
              </button>
            </div>
            <SiteHeader
              siteName={siteName}
              settings={siteSettings}
              theme={siteTheme}
              navItems={headerNavItems}
              locale={locale}
              currentSlug={currentSlug}
              onNavigate={onHeaderNavigate}
              mobileMode={Boolean(viewportWidth && viewportWidth <= 480)}
              builderEditable
              activeBuilderNavItemId={activeNavItemId}
              onRequestEditNavItem={onRequestEditNavItem}
              onRequestAddNavChild={onRequestAddNavChild}
              onRequestEditSiteBrand={onOpenSettings}
            />
          </div>
        ) : null}
        <div style={canvasWrapperStyle}>
          <CanvasContainer
            onRequestAssetLibrary={onRequestAssetLibrary}
            onRequestImageEditor={(nodeId, initialTab) => onRequestImageEditor({ nodeId, initialTab })}
            onRequestMoveToPage={onRequestMoveToPage}
            onRequestSaveAsSection={onRequestSaveAsSection}
            onRequestInsertSavedSection={(sectionId, position) => {
              onRequestInsertSavedSection(sectionId, position);
            }}
            onToast={onToast}
            onActivity={onActivity}
            siteLightboxes={linkPickerLightboxes}
            sitePages={linkPickerSitePages}
            viewportResetKey={activePageId}
          />
        </div>
        {siteName ? (
          <div
            style={{ width: viewportWidth ?? '100%', maxWidth: 1280, background: '#fff', borderTop: '1px solid #e5e7eb' }}
            onClick={onFooterLinkActivation}
            onAuxClick={onFooterLinkActivation}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                onFooterLinkActivation(event);
              }
            }}
          >
            <SiteFooter
              siteName={siteName}
              settings={siteSettings}
              theme={siteTheme}
              navItems={headerNavItems}
              locale={locale}
            />
          </div>
        ) : null}
        <div
          className={styles.publicChromePreview}
          data-builder-public-chrome="true"
          aria-label={publicChromeCopy.label}
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            className={styles.publicChromeAction}
            aria-pressed={publicChromePanel === 'chat'}
            onClick={() => onSetPublicChromePanel((current) => (current === 'chat' ? null : 'chat'))}
          >
            {publicChromeCopy.chat}
          </button>
          <button
            type="button"
            className={styles.publicChromeAction}
            onClick={() => {
              canvasColumnRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            ↑ {publicChromeCopy.top}
          </button>
          <button
            type="button"
            className={styles.publicChromeAction}
            aria-pressed={publicChromePanel === 'event'}
            onClick={() => onSetPublicChromePanel((current) => (current === 'event' ? null : 'event'))}
          >
            {publicChromeCopy.event}
          </button>
          {publicChromePanel ? (
            <div className={styles.publicChromePopover} role="status">
              <strong>
                {publicChromePanel === 'chat' ? publicChromeCopy.chatTitle : publicChromeCopy.eventTitle}
              </strong>
              <p>
                {publicChromePanel === 'chat' ? publicChromeCopy.chatBody : publicChromeCopy.eventBody}
              </p>
              <div className={styles.publicChromePopoverActions}>
                <button
                  type="button"
                  onClick={() => {
                    onSetPublicChromePanel(null);
                    onOpenSettings();
                  }}
                >
                  {publicChromeCopy.editSettings}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSetPublicChromePanel(null);
                    onSetActiveDrawer('columns');
                  }}
                >
                  {publicChromeCopy.editColumns}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <div className={styles.inspectorColumn}>
        <SandboxInspectorPanel
          onRequestAssetLibrary={() => {
            if (selectedNode?.kind === 'image') onRequestAssetLibrary(selectedNode.id);
          }}
          onRequestImageEditor={() => {
            if (selectedNode?.kind === 'image') onRequestImageEditor({ nodeId: selectedNode.id });
          }}
          siteLightboxes={linkPickerLightboxes}
          sitePages={linkPickerSitePages}
        />
      </div>
    </section>
  );
}
