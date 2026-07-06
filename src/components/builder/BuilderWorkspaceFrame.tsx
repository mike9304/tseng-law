import type { ReactNode } from 'react';
import Link from 'next/link';
import { getAdminNavCopy } from '@/lib/builder/admin-nav/nav-copy';
import type { Locale } from '@/lib/locales';

type BuilderWorkspaceRailKey = 'pages' | 'layers' | 'assets';

type BuilderWorkspaceRailItem = {
  key: BuilderWorkspaceRailKey;
  label: string;
  description: string;
  href?: string;
  active?: boolean;
};

export default function BuilderWorkspaceFrame({
  title,
  description,
  activeRail,
  stageUrl,
  leftMeta,
  rightMeta,
  railItems,
  leftSidebar,
  inspector,
  children,
  surfaceTone = 'default',
  locale,
  backLink,
  navigationLabel,
  footerLabel,
  footerDescription,
  routeLabel,
}: {
  title: string;
  description: string;
  activeRail: BuilderWorkspaceRailKey;
  stageUrl: string;
  leftMeta: ReactNode;
  rightMeta: ReactNode;
  railItems: BuilderWorkspaceRailItem[];
  leftSidebar: ReactNode;
  inspector: ReactNode;
  children: ReactNode;
  surfaceTone?: 'default' | 'canvas-priority';
  locale?: Locale;
  /**
   * Optional back link rendered at the top of the canvas stage head so
   * users always have a clear way back to the main builder editor.
   */
  backLink?: { href: string; label: string };
  navigationLabel?: string;
  footerLabel?: string;
  footerDescription?: string;
  routeLabel?: string;
}) {
  const shellCopy = getWorkspaceFrameCopy(locale);
  const effectiveNavigationLabel = navigationLabel ?? shellCopy.navigationLabel;
  const effectiveFooterLabel = footerLabel ?? shellCopy.footerLabel;
  const effectiveFooterDescription = footerDescription ?? shellCopy.footerDescription;
  const effectiveRouteLabel =
    routeLabel ?? (surfaceTone === 'canvas-priority' ? shellCopy.canvasRouteLabel : shellCopy.builderRouteLabel);

  return (
    <div
      className={`builder-route-root${
        surfaceTone === 'canvas-priority' ? ' builder-route-root--canvas-priority' : ''
      }`}
    >
      <div className="builder-shell">
        <div
          className={`builder-shell-body${
            surfaceTone === 'canvas-priority' ? ' builder-shell-body--canvas-priority' : ''
          }`}
        >
          <aside
            className={`builder-workspace-sidebar${
              surfaceTone === 'canvas-priority' ? ' builder-workspace-sidebar--canvas-priority' : ''
            }`}
            aria-label={effectiveNavigationLabel}
          >
            <nav className="builder-app-rail">
              <div className="builder-app-rail-brand" aria-hidden>
                HJ
              </div>
              <div className="builder-app-rail-stack">
                {railItems.map((item) => {
                  const content = (
                    <>
                      <span className="builder-app-rail-icon" aria-hidden>
                        {getRailIcon(item.key)}
                      </span>
                      <span className="builder-app-rail-copy">
                        <strong>{item.label}</strong>
                        <small>{item.description}</small>
                      </span>
                    </>
                  );

                  const className = `builder-app-rail-item${
                    item.active || item.key === activeRail ? ' is-active' : ''
                  }`;

                  return item.href ? (
                    <Link key={item.key} href={item.href} className={className}>
                      {content}
                    </Link>
                  ) : (
                    <div key={item.key} className={className} aria-current={item.active ? 'page' : undefined}>
                      {content}
                    </div>
                  );
                })}
              </div>
              <div className="builder-app-rail-footer">
                <strong>{effectiveFooterLabel}</strong>
                <span>{effectiveFooterDescription}</span>
              </div>
            </nav>
            <div
              className={`builder-workspace-sidebar-panel${
                surfaceTone === 'canvas-priority' ? ' builder-workspace-sidebar-panel--canvas-priority' : ''
              }`}
            >
              {leftSidebar}
            </div>
          </aside>

          <div className="builder-canvas-wrapper">
            <div
              className={`builder-canvas-stage${
                surfaceTone === 'canvas-priority' ? ' builder-canvas-stage--canvas-priority' : ''
              }`}
            >
              <div
                className={`builder-canvas-stage-head${
                  surfaceTone === 'canvas-priority' ? ' builder-canvas-stage-head--canvas-priority' : ''
                }`}
              >
                <div
                  className={`builder-canvas-stage-meta${
                    surfaceTone === 'canvas-priority' ? ' builder-canvas-stage-meta--canvas-priority' : ''
                  }`}
                >
                  {backLink ? (
                    <Link
                      href={backLink.href}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        marginBottom: 4,
                        padding: '4px 10px',
                        borderRadius: 8,
                        border: '1px solid #cbd5e1',
                        background: '#ffffff',
                        color: '#0f172a',
                        fontSize: 12,
                        fontWeight: 700,
                        textDecoration: 'none',
                        width: 'fit-content',
                      }}
                    >
                      <span aria-hidden>←</span>
                      <span>{backLink.label}</span>
                    </Link>
                  ) : null}
                  <strong>{title}</strong>
                  <span>{description}</span>
                </div>
                <div
                  className={`builder-canvas-stage-url${
                    surfaceTone === 'canvas-priority' ? ' builder-canvas-stage-url--canvas-priority' : ''
                  }`}
                >
                  <span>{stageUrl}</span>
                  <span>{effectiveRouteLabel}</span>
                </div>
                <div
                  className={`builder-canvas-stage-meta${
                    surfaceTone === 'canvas-priority' ? ' builder-canvas-stage-meta--canvas-priority' : ''
                  }`}
                >
                  {rightMeta}
                </div>
              </div>
              <div
                className={`builder-canvas-stage-toolbar${
                  surfaceTone === 'canvas-priority' ? ' builder-canvas-stage-toolbar--canvas-priority' : ''
                }`}
              >
                {leftMeta}
              </div>
              {children}
            </div>
          </div>

          <aside
            className={`builder-preview-inspector builder-preview-inspector--shell${
              surfaceTone === 'canvas-priority' ? ' builder-preview-inspector--canvas-priority' : ''
            }`}
          >
            {inspector}
          </aside>
        </div>
      </div>
    </div>
  );
}

function getRailIcon(key: BuilderWorkspaceRailKey) {
  switch (key) {
    case 'pages':
      return 'Pg';
    case 'layers':
      return 'Ly';
    case 'assets':
      return 'As';
    default:
      return key;
  }
}

function getWorkspaceFrameCopy(locale?: Locale) {
  const navCopy = locale ? getAdminNavCopy(locale) : getAdminNavCopy('en');
  switch (locale) {
    case 'ko':
      return {
        navigationLabel: '빌더 탐색',
        footerLabel: '빌더',
        footerDescription: '실제 시스템만 사용합니다. 가짜 탭은 없습니다.',
        builderRouteLabel: '빌더 기준 경로',
        canvasRouteLabel: '캔버스 경로',
      };
    case 'zh-hant':
      return {
        navigationLabel: '建構器導覽',
        footerLabel: '建構器',
        footerDescription: '只保留真實系統，不放假分頁。',
        builderRouteLabel: '建構器基準路由',
        canvasRouteLabel: '畫布路由',
      };
    case 'en':
    default:
      return {
        navigationLabel: navCopy.ariaLabel,
        footerLabel: 'Builder',
        footerDescription: 'Real systems only. No fake tabs.',
        builderRouteLabel: 'canonical builder route',
        canvasRouteLabel: 'canvas route',
      };
  }
}
