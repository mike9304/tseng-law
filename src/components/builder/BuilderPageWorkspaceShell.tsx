import type { ReactNode } from 'react';
import Link from 'next/link';
import BuilderWorkspaceFrame from '@/components/builder/BuilderWorkspaceFrame';
import { buildBuilderCollectionHref, buildBuilderPageSceneHref } from '@/lib/builder/hrefs';
import {
  buildBuilderPageHref,
  type BuilderEditorMode,
  type BuilderSitePageSummary,
  type BuilderSiteSummary,
  type BuilderWorkspaceSummary,
} from '@/lib/builder/site';
import type { BuilderPageDatasetOverview } from '@/lib/builder/datasets';
import type { BuilderPageKey } from '@/lib/builder/types';
import type { Locale } from '@/lib/locales';

export default function BuilderPageWorkspaceShell({
  locale,
  pageKey,
  title,
  description,
  requestedMode,
  availableModes,
  editable,
  workspace,
  site,
  pages,
  datasetOverviews,
  snapshot,
  policyNotes,
  children,
}: {
  locale: Locale;
  pageKey: BuilderPageKey;
  title: string;
  description: string;
  requestedMode: BuilderEditorMode;
  availableModes: BuilderEditorMode[];
  editable: boolean;
  workspace: BuilderWorkspaceSummary;
  site: BuilderSiteSummary;
  pages: BuilderSitePageSummary[];
  datasetOverviews: BuilderPageDatasetOverview[];
  snapshot: {
    persisted: boolean;
    kind: 'draft' | 'published';
    revision: number;
    savedAt: string | null;
  };
  policyNotes: string[];
  children: ReactNode;
}) {
  const currentPage =
    pages.find((candidate) => candidate.pageKey === pageKey) ??
    createFallbackPageSummary({
      locale,
      pageKey,
      title,
      description,
      editable,
      availableModes,
    });

  return (
    <BuilderWorkspaceFrame
      title={`${title} ${requestedMode === 'preview' ? 'preview' : 'workspace'}`}
      description={description}
      activeRail="pages"
      stageUrl={buildBuilderPageHref(locale, pageKey, requestedMode)}
      railItems={[
        { key: 'pages', label: 'Pages', description: 'Page entry points', href: `/${locale}/builder`, active: true },
        { key: 'assets', label: 'Assets', description: 'Recent builder media', href: `/${locale}/builder` },
      ]}
      leftMeta={
        <>
          <span className="builder-stage-pill builder-stage-pill--accent">Workspace {workspace.name}</span>
          <span className="builder-stage-pill">Site {site.name}</span>
          <span className="builder-stage-pill">
            {requestedMode === 'preview' ? 'Preview mode' : 'Edit mode'}
          </span>
          <span className="builder-stage-pill">
            {snapshot.persisted ? `${snapshot.kind} v${snapshot.revision}` : 'default schema'}
          </span>
        </>
      }
      rightMeta={
        <>
          <strong>{title}</strong>
          <span>
            {site.id} · {pageKey} · locale {locale}
          </span>
        </>
      }
      leftSidebar={
        <section className="builder-preview-inspector-card builder-dashboard-sidebar">
          <h2>Page routes</h2>
          <p>Only routes backed by the current builder schema appear here.</p>
          <div className="builder-dashboard-nav-list">
            {pages.map((page) => (
              <Link
                key={page.pageKey}
                href={buildBuilderPageHref(locale, page.pageKey, page.availableModes[0] ?? 'preview')}
                className={`builder-dashboard-nav-card${page.pageKey === pageKey ? ' is-active' : ''}`}
              >
                <strong>{page.title}</strong>
                <span>{page.editable ? 'Editable' : 'Preview only'}</span>
                <small>{page.sectionCount} sections</small>
              </Link>
            ))}
          </div>
        </section>
      }
      inspector={
        <>
          <section className="builder-preview-inspector-card">
            <h2>Mode policy</h2>
            <ul className="builder-preview-inspector-notes">
              {policyNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </section>
          <section className="builder-preview-inspector-card">
            <h2>Snapshot</h2>
            <dl className="builder-preview-inspector-list">
              <div>
                <dt>Source</dt>
                <dd>{snapshot.persisted ? snapshot.kind : 'default document'}</dd>
              </div>
              <div>
                <dt>Revision</dt>
                <dd>v{snapshot.revision}</dd>
              </div>
              <div>
                <dt>Saved</dt>
                <dd>{snapshot.persisted ? snapshot.savedAt : 'Not persisted yet'}</dd>
              </div>
              <div>
                <dt>Public path</dt>
                <dd>{currentPage.publicPath}</dd>
              </div>
            </dl>
          </section>
          <section className="builder-preview-inspector-card">
            <h2>Dataset seams</h2>
            {datasetOverviews.length > 0 ? (
              <div className="builder-preview-inspector-list">
                {datasetOverviews.map((item) => (
                  <div key={item.targetId}>
                    <dt>{item.title}</dt>
                    <dd>
                      {item.currentBinding.collectionId} · {item.currentBinding.mode}
                      {typeof item.currentBinding.limit === 'number'
                        ? ` · limit ${item.currentBinding.limit}`
                        : ''}
                    </dd>
                    <dd>{item.description}</dd>
                    <dd>
                      <Link
                        href={buildBuilderCollectionHref(locale, item.currentBinding.collectionId)}
                        className="builder-link-inline"
                      >
                        Open collection detail
                      </Link>
                    </dd>
                  </div>
                ))}
              </div>
            ) : (
              <ul className="builder-preview-inspector-notes">
                <li>No dataset seams are reachable on this page yet.</li>
              </ul>
            )}
          </section>
          <section className="builder-preview-inspector-card">
            <h2>Scene graph foundation</h2>
            <ul className="builder-preview-inspector-notes">
              <li>The canvas-first core will replace the current semantic-section runtime with a real scene graph.</li>
              <li>
                <Link href={buildBuilderPageSceneHref(locale, pageKey)} className="builder-link-inline">
                  Open read-only scene graph view
                </Link>
              </li>
            </ul>
          </section>
        </>
      }
    >
      <div className="builder-dashboard-canvas-copy">
        <div className="builder-dashboard-mode-row">
          {availableModes.map((mode) => (
            <Link
              key={mode}
              href={buildBuilderPageHref(locale, pageKey, mode)}
              className={`builder-stage-pill${mode === requestedMode ? ' builder-stage-pill--accent' : ''}`}
            >
              {mode === 'edit' ? 'Edit' : 'Preview'}
            </Link>
          ))}
          <Link href={buildBuilderPageSceneHref(locale, pageKey)} className="builder-stage-pill">
            Scene graph
          </Link>
        </div>
        {children}
      </div>
    </BuilderWorkspaceFrame>
  );
}

function createFallbackPageSummary({
  locale,
  pageKey,
  title,
  description,
  editable,
  availableModes,
}: {
  locale: Locale;
  pageKey: BuilderPageKey;
  title: string;
  description: string;
  editable: boolean;
  availableModes: BuilderEditorMode[];
}) {
  const publicPath = pageKey === 'home' ? `/${locale}` : `/${locale}/${pageKey}`;

  return {
    pageId: `fallback:${pageKey}`,
    pageKey,
    pageType: 'static',
    routeType: 'static',
    routeSegment: pageKey === 'home' ? '' : pageKey,
    parentPageKey: null,
    specialRole: pageKey === 'home' ? 'homepage' : null,
    title,
    description,
    editable,
    availableModes,
    publicPath,
    builderPath: buildBuilderPageHref(locale, pageKey, availableModes[0] ?? 'preview'),
    draftPersisted: false,
    publishedPersisted: false,
    draftRevision: 0,
    publishedRevision: 0,
    draftSavedAt: null,
    publishedSavedAt: null,
    sectionCount: 0,
    datasetCount: 0,
  } satisfies BuilderSitePageSummary;
}
