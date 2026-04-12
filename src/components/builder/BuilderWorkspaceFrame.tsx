import type { ReactNode } from 'react';
import Link from 'next/link';

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
}) {
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
            aria-label="Builder navigation"
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
                <strong>Builder</strong>
                <span>Real systems only. No fake tabs.</span>
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
                  <strong>{title}</strong>
                  <span>{description}</span>
                </div>
                <div
                  className={`builder-canvas-stage-url${
                    surfaceTone === 'canvas-priority' ? ' builder-canvas-stage-url--canvas-priority' : ''
                  }`}
                >
                  <span>{stageUrl}</span>
                  <span>{surfaceTone === 'canvas-priority' ? 'canvas route' : 'canonical builder route'}</span>
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
