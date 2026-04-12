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
}) {
  return (
    <div className="builder-route-root">
      <div className="builder-shell">
        <div className="builder-shell-body">
          <aside className="builder-workspace-sidebar" aria-label="Builder navigation">
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
            <div>{leftSidebar}</div>
          </aside>

          <div className="builder-canvas-wrapper">
            <div className="builder-canvas-stage">
              <div className="builder-canvas-stage-head">
                <div className="builder-canvas-stage-meta">
                  <strong>{title}</strong>
                  <span>{description}</span>
                </div>
                <div className="builder-canvas-stage-url">
                  <span>{stageUrl}</span>
                  <span>canonical builder route</span>
                </div>
                <div className="builder-canvas-stage-meta">{rightMeta}</div>
              </div>
              <div className="builder-canvas-stage-toolbar">{leftMeta}</div>
              {children}
            </div>
          </div>

          <aside className="builder-preview-inspector builder-preview-inspector--shell">
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
