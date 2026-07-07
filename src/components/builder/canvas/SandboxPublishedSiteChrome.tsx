'use client';

import {
  useRef,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import { getCanvasShellCopy } from '@/components/builder/canvas/canvas-shell-copy';
import SandboxPublicChromePreview, {
  type PublicChromeCopy,
} from '@/components/builder/canvas/SandboxPublicChromePreview';
import SiteFooter from '@/components/builder/published/SiteFooter';
import SiteHeader, { type SiteHeaderMemberNavPreview } from '@/components/builder/published/SiteHeader';
import type { BuilderNavItem, BuilderSiteSettings, BuilderTheme } from '@/lib/builder/site/types';
import type { Locale } from '@/lib/locales';
import styles from './SandboxPage.module.css';

type SandboxPublishedSiteChromeProps = {
  readonly locale: Locale;
  readonly activeDrawer: string | null;
  readonly siteName?: string;
  readonly siteSettings?: BuilderSiteSettings;
  readonly siteTheme: BuilderTheme;
  readonly headerNavItems: BuilderNavItem[];
  readonly currentSlug: string;
  readonly activeNavItemId: string | null;
  readonly viewportWidth: number | null;
  readonly publicChromeCopy: PublicChromeCopy;
  readonly publicChromeColumnsShortcut: boolean;
  readonly memberNavPreview?: SiteHeaderMemberNavPreview;
  readonly children: ReactNode;
  readonly onHeaderNavigate: (href: string) => void;
  readonly onOpenColumnsPage: () => void;
  readonly onOpenSettings: () => void;
  readonly onSetActiveDrawer: (panel: 'nav' | null) => void;
  readonly onRequestEditNavItem: (itemId: string) => void;
  readonly onRequestRenameNavItem: (itemId: string, labels: Record<Locale, string>) => Promise<boolean | void> | boolean | void;
  readonly onRequestAddNavChild: (parentItemId: string) => void;
  readonly onRequestMoveNavItem: (itemId: string, direction: 'up' | 'down') => void;
  readonly onFooterLinkActivation: (event: {
    target: EventTarget | null;
    preventDefault: () => void;
    stopPropagation: () => void;
  }) => void;
};

const EDITOR_HEADER_COMPACT_BREAKPOINT = 1120;

export default function SandboxPublishedSiteChrome({
  locale,
  activeDrawer,
  siteName,
  siteSettings,
  siteTheme,
  headerNavItems,
  currentSlug,
  activeNavItemId,
  viewportWidth,
  publicChromeCopy,
  publicChromeColumnsShortcut,
  memberNavPreview,
  children,
  onHeaderNavigate,
  onOpenColumnsPage,
  onOpenSettings,
  onSetActiveDrawer,
  onRequestEditNavItem,
  onRequestRenameNavItem,
  onRequestAddNavChild,
  onRequestMoveNavItem,
  onFooterLinkActivation,
}: SandboxPublishedSiteChromeProps) {
  const copy = getCanvasShellCopy(locale).workspaceHeader;
  const pendingHeaderPointerHrefRef = useRef<string | null>(null);
  const compactHeaderPreview = Boolean(viewportWidth && viewportWidth <= EDITOR_HEADER_COMPACT_BREAKPOINT);

  const handleHeaderNavActivation = (
    event: ReactMouseEvent<HTMLElement> | ReactPointerEvent<HTMLElement>,
    phase: 'pointer' | 'click',
  ) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return false;
    const navLink = target.closest<HTMLAnchorElement>([
      '.builder-site-header a.nav-link[href]',
      '.builder-site-header .header-actions a[href]',
      '.builder-site-header .utility-nav > a[href]',
      '.builder-site-header .utility-member-nav a[href]',
    ].join(', '));
    if (!navLink) return false;
    const href = navLink.getAttribute('href') ?? '';
    if (!href || /^(https?:|mailto:|tel:|#)/.test(href)) return false;
    if (event.altKey || event.metaKey || event.ctrlKey || event.shiftKey) return false;
    if ('button' in event && event.button !== 0) return false;

    event.preventDefault();
    event.stopPropagation();

    if (phase === 'click' && pendingHeaderPointerHrefRef.current === href) {
      pendingHeaderPointerHrefRef.current = null;
      return true;
    }

    if (phase === 'pointer') {
      pendingHeaderPointerHrefRef.current = href;
      globalThis.window.setTimeout(() => {
        if (pendingHeaderPointerHrefRef.current === href) {
          pendingHeaderPointerHrefRef.current = null;
        }
      }, 500);
    }

    onHeaderNavigate(href);
    return true;
  };

  return (
    <>
      {siteName ? (
        <div
          className={styles.globalHeaderRegion}
          data-editing={activeDrawer === 'nav' ? 'true' : undefined}
          data-builder-header-compact={compactHeaderPreview ? 'true' : undefined}
          style={{ width: viewportWidth ?? '100%', maxWidth: 1280, background: '#fff', borderBottom: '1px solid #e5e7eb' }}
          role="group"
          aria-label={copy.ariaLabel}
          title={copy.title}
          onPointerDownCapture={(event) => {
            handleHeaderNavActivation(event, 'pointer');
          }}
          onClickCapture={(event) => {
            const target = event.target;
            if (!(target instanceof HTMLElement)) return;
            if (target.closest('.search-overlay')) return;
            if (target.closest(`.${styles.globalRegionBadge}`)) return;
            if (target.closest('[data-builder-site-brand]')) return;
            if (target.closest('[data-builder-header-action]')) return;
            if (target.closest('[data-member-role-link="logout"]')) return;
            if (target.closest('[data-builder-mobile-hamburger]')) {
              onSetActiveDrawer(null);
              return;
            }
            if (target.closest('[data-builder-mobile-drawer]')) return;
            if (handleHeaderNavActivation(event, 'click')) return;
            const navTarget = target.closest<HTMLElement>('[data-builder-nav-item-id]');
            if (navTarget?.dataset.builderNavItemId) return;
            event.preventDefault();
            event.stopPropagation();
            onSetActiveDrawer('nav');
          }}
        >
          <div className={styles.globalRegionBadge}>
            <span>{copy.headerLabel}</span>
            <strong>{copy.menuEditable}</strong>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onSetActiveDrawer('nav');
              }}
            >
              {copy.editMenu}
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onOpenSettings();
              }}
            >
              {copy.siteSettings}
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
            mobileMode={compactHeaderPreview}
            canonicalStandardNav
            builderEditable
            activeBuilderNavItemId={activeNavItemId}
            onRequestEditNavItem={onRequestEditNavItem}
            onRequestRenameNavItem={onRequestRenameNavItem}
            onRequestAddNavChild={onRequestAddNavChild}
            onRequestMoveNavItem={onRequestMoveNavItem}
            onRequestEditSiteBrand={onOpenSettings}
            onRequestOpenMobileMenu={() => onSetActiveDrawer(null)}
            memberNavPreview={memberNavPreview}
          />
        </div>
      ) : null}
      {children}
      {siteName ? (
        <div
          className={styles.globalFooterRegion}
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
      <SandboxPublicChromePreview
        locale={locale}
        activeDrawer={Boolean(activeDrawer)}
        copy={publicChromeCopy}
        currentSlug={currentSlug}
        columnsShortcut={publicChromeColumnsShortcut}
        onOpenColumnsPage={onOpenColumnsPage}
        onFooterLinkActivation={onFooterLinkActivation}
      />
    </>
  );
}
