import Link from 'next/link';
import BuilderInspectorAssetLibraryPanel from '@/components/builder/BuilderInspectorAssetLibraryPanel';
import BuilderWorkspaceFrame from '@/components/builder/BuilderWorkspaceFrame';
import {
  buildBuilderCollectionHref,
  buildBuilderDynamicRouteHref,
  buildBuilderDynamicTemplateHref,
  buildBuilderStarterTemplateHref,
} from '@/lib/builder/hrefs';
import {
  buildBuilderPageHref,
  type BuilderSiteOverview,
} from '@/lib/builder/site';
import type { Locale } from '@/lib/locales';

export default function BuilderWorkspaceDashboard({
  locale,
  overview,
}: {
  locale: Locale;
  overview: BuilderSiteOverview;
}) {
  const pageNav = overview.pages.map((page) => ({
    key: 'pages' as const,
    label: page.title,
    href: buildBuilderPageHref(locale, page.pageKey, page.availableModes[0] ?? 'preview'),
    status: page.specialRole === 'homepage' ? 'Homepage' : page.editable ? 'Editable' : 'Preview only',
    meta: page.publicPath,
  }));

  return (
    <BuilderWorkspaceFrame
      title="Workspace dashboard"
      description="Single internal workspace, single canonical site, explicit page entry points."
      activeRail="pages"
      stageUrl={`/${locale}/builder`}
      railItems={[
        { key: 'pages', label: 'Pages', description: 'Live routes', active: true },
        { key: 'assets', label: 'Assets', description: 'Recent builder media' },
      ]}
      leftMeta={
        <>
          <span className="builder-stage-pill builder-stage-pill--accent">
            Workspace {overview.workspace.name}
          </span>
          <span className="builder-stage-pill">Site {overview.site.name}</span>
          <span className="builder-stage-pill">Schema v{overview.schema.schemaVersion}</span>
          <span className="builder-stage-pill">Site v{overview.schema.siteVersion}</span>
        </>
      }
      rightMeta={
        <>
          <strong>{overview.site.name}</strong>
          <span>
            {overview.site.id} · locale {overview.site.locale}
          </span>
        </>
      }
      leftSidebar={
        <section className="builder-preview-inspector-card builder-dashboard-sidebar">
          <h2>Pages</h2>
          <p>WAVE-01 keeps page entry explicit. Only routes backed by real page models appear here.</p>
          <div className="builder-dashboard-nav-list">
            {pageNav.map((item) => (
              <Link key={item.href} href={item.href} className="builder-dashboard-nav-card">
                <strong>{item.label}</strong>
                <span>{item.status}</span>
                <small>{item.meta}</small>
              </Link>
            ))}
          </div>
          <div className="builder-dashboard-nav-list">
            <a href="#static-page-topology" className="builder-dashboard-nav-card">
              <strong>Static page topology</strong>
              <span>Read-only</span>
              <small>Registry and route inventory</small>
            </a>
            <a href="#cms-inventory-kickoff" className="builder-dashboard-nav-card">
              <strong>CMS inventory</strong>
              <span>Read-only</span>
              <small>No builder editing path yet</small>
            </a>
            <a href="#dynamic-route-registry" className="builder-dashboard-nav-card">
              <strong>Dynamic routes</strong>
              <span>Registry only</span>
              <small>Preview context seam</small>
            </a>
            <a href="#dynamic-template-registry" className="builder-dashboard-nav-card">
              <strong>Dynamic templates</strong>
              <span>Ownership only</span>
              <small>Code-route template registry</small>
            </a>
            <a href="#starter-template-gallery" className="builder-dashboard-nav-card">
              <strong>Starter templates</strong>
              <span>Template-first</span>
              <small>Real starting points only</small>
            </a>
          </div>
        </section>
      }
      inspector={
        <>
          <section className="builder-preview-inspector-card">
            <h2>Workspace</h2>
            <dl className="builder-preview-inspector-list">
              <div>
                <dt>Workspace ID</dt>
                <dd>{overview.workspace.id}</dd>
              </div>
              <div>
                <dt>Owner</dt>
                <dd>{overview.workspace.ownerLabel}</dd>
              </div>
              <div>
                <dt>Site ID</dt>
                <dd>{overview.site.id}</dd>
              </div>
              <div>
                <dt>Schema pages</dt>
                <dd>{overview.schema.pageOrder.length}</dd>
              </div>
              <div>
                <dt>Collections</dt>
                <dd>{overview.collections.length}</dd>
              </div>
              <div>
                <dt>Dynamic routes</dt>
                <dd>{overview.dynamicRoutes.length}</dd>
              </div>
              <div>
                <dt>Dynamic templates</dt>
                <dd>{overview.dynamicTemplates.length}</dd>
              </div>
              <div>
                <dt>Starter templates</dt>
                <dd>{overview.starterTemplates.length}</dd>
              </div>
            </dl>
          </section>
          <section className="builder-preview-inspector-card">
            <h2>Static route policy</h2>
            <ul className="builder-preview-inspector-notes">
              <li>
                Current validation status:{' '}
                <strong>{overview.routing.valid ? 'valid static page registry' : 'route issues detected'}</strong>
              </li>
              <li>Slug editing and page duplication stay deferred until runtime route ownership is real.</li>
              <li>WAVE-03-B01 exposes real inventory only. No fake dataset binding or dynamic-page editor UI.</li>
            </ul>
          </section>
          <section className="builder-preview-inspector-card">
            <h2>Wave 01 scope lock</h2>
            <ul className="builder-preview-inspector-notes">
              <li>Editor core only: workspace/site model, shell, draft state, preview boundaries.</li>
              <li>No fake Components or CMS tabs before those systems exist.</li>
              <li>About and Contact stay preview-only until real interactive editing lands.</li>
            </ul>
          </section>
          <section className="builder-preview-inspector-card">
            <BuilderInspectorAssetLibraryPanel
              locale={locale}
              title="Recent builder assets"
              description="This is real asset inventory from the current builder storage backend."
              items={overview.assets}
              emptyMessage="No recent builder assets yet."
            />
          </section>
        </>
      }
    >
      <div className="builder-dashboard-grid">
        <section className="builder-preview-inspector-card">
          <h2>Site overview</h2>
          <p>{overview.site.description}</p>
          <div className="builder-dashboard-kpi-grid">
            <article className="builder-dashboard-kpi-card">
              <strong>{overview.pages.length}</strong>
              <span>Builder pages</span>
            </article>
            <article className="builder-dashboard-kpi-card">
              <strong>{countPersistedPages(overview.pages, 'draftPersisted')}</strong>
              <span>Shared drafts</span>
            </article>
            <article className="builder-dashboard-kpi-card">
              <strong>{countPersistedPages(overview.pages, 'publishedPersisted')}</strong>
              <span>Published snapshots</span>
            </article>
            <article className="builder-dashboard-kpi-card">
              <strong>{overview.assets.length}</strong>
              <span>Recent assets</span>
            </article>
            <article className="builder-dashboard-kpi-card">
              <strong>{overview.collections.length}</strong>
              <span>Read-only collections</span>
            </article>
            <article className="builder-dashboard-kpi-card">
              <strong>{overview.dynamicRoutes.length}</strong>
              <span>Dynamic route registry</span>
            </article>
            <article className="builder-dashboard-kpi-card">
              <strong>{overview.dynamicTemplates.length}</strong>
              <span>Dynamic template ownership</span>
            </article>
            <article className="builder-dashboard-kpi-card">
              <strong>{overview.starterTemplates.length}</strong>
              <span>Starter templates</span>
            </article>
          </div>
        </section>

        <section id="starter-template-gallery" className="builder-preview-inspector-card">
          <h2>Starter template gallery</h2>
          <p>
            Real starting points only. Each card tells you whether the current entry is editable now,
            previewable now, or only cataloged through ownership detail.
          </p>
          <div className="builder-dashboard-page-list">
            {overview.starterTemplates.map((template) => (
              <article key={template.templateId} className="builder-dashboard-page-card">
                <div className="builder-dashboard-page-head">
                  <div>
                    <strong>{template.title}</strong>
                    <span>{template.description}</span>
                  </div>
                  <span className="builder-stage-pill">
                    {template.support === 'editable-now'
                      ? 'Editable now'
                      : template.support === 'preview-now'
                        ? 'Preview now'
                        : 'Ownership only'}
                  </span>
                </div>
                <div className="builder-dashboard-page-meta">
                  <span>{template.category}</span>
                  <span>{template.focus}</span>
                  <span>{template.livePath}</span>
                </div>
                <div className="builder-dashboard-page-actions">
                  <Link
                    href={buildBuilderStarterTemplateHref(locale, template.templateId)}
                    className="builder-action-btn builder-action-btn--primary"
                  >
                    Open starter detail
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="static-page-topology" className="builder-preview-inspector-card">
          <h2>Static page topology</h2>
          <p>Only static pages backed by the current builder site registry appear here. Slug mutation and duplication remain deferred.</p>
          <div className="builder-dashboard-page-list">
            {overview.pages.map((page) => (
              <article key={page.pageKey} className="builder-dashboard-page-card">
                <div className="builder-dashboard-page-head">
                  <div>
                    <strong>{page.title}</strong>
                    <span>{page.description}</span>
                  </div>
                  <span className="builder-stage-pill">
                    {page.editable ? 'Editable' : 'Preview only'}
                  </span>
                </div>
                <div className="builder-dashboard-page-meta">
                  <span>Page ID {page.pageId}</span>
                  <span>Route {page.routeType}</span>
                  <span>Segment {page.routeSegment || '(root)'}</span>
                  <span>Role {page.specialRole ?? 'standard'}</span>
                  <span>Public route {page.publicPath}</span>
                  <span>Datasets {page.datasetCount}</span>
                  <span>Draft v{page.draftRevision}</span>
                  <span>Published v{page.publishedRevision}</span>
                </div>
                <div className="builder-dashboard-page-actions">
                  {page.availableModes.map((mode) => (
                    <Link
                      key={`${page.pageKey}-${mode}`}
                      href={buildBuilderPageHref(locale, page.pageKey, mode)}
                      className="builder-action-btn builder-action-btn--primary"
                    >
                      {mode === 'edit' ? 'Open editor' : 'Open preview'}
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="cms-inventory-kickoff" className="builder-preview-inspector-card">
          <h2>CMS inventory kickoff</h2>
          <p>These collections are real read-only inventory from the current site codebase. Collection editing, datasets, and dynamic-page binding are still deferred.</p>
          <div className="builder-dashboard-page-list">
            {overview.collections.map((collection) => (
              <article key={collection.id} className="builder-dashboard-page-card">
                <div className="builder-dashboard-page-head">
                  <div>
                    <strong>{collection.title}</strong>
                    <span>{collection.description}</span>
                  </div>
                  <span className="builder-stage-pill">
                    {collection.localized ? 'Localized' : 'Shared'}
                  </span>
                </div>
                <div className="builder-dashboard-page-meta">
                  <span>Collection {collection.id}</span>
                  <span>{collection.recordCount} records</span>
                  <span>{collection.fieldCount} fields</span>
                  <span>{collection.supportsRelations ? 'Relations present' : 'No relations'}</span>
                </div>
                <div className="builder-preview-inspector-list">
                  <div>
                    <dt>Source</dt>
                    <dd>{collection.sourceLabel}</dd>
                  </div>
                  <div>
                    <dt>Route bindings</dt>
                    <dd>{collection.routeBindings.map((binding) => binding.pathPattern).join(' · ')}</dd>
                  </div>
                  <div>
                    <dt>Field sample</dt>
                    <dd>{collection.fields.slice(0, 4).map((field) => `${field.label} (${field.type})`).join(' · ')}</dd>
                  </div>
                  <div>
                    <dt>Builder path</dt>
                    <dd>
                      <Link href={buildBuilderCollectionHref(locale, collection.id)}>
                        Open read-only detail
                      </Link>
                    </dd>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="dynamic-route-registry" className="builder-preview-inspector-card">
          <h2>Dynamic route registry</h2>
          <p>
            Registry only. These entries prove route ownership and preview context seams, but they do
            not imply dynamic page templates yet.
          </p>
          <div className="builder-dashboard-page-list">
            {overview.dynamicRoutes.map((route) => (
              <article key={route.routeId} className="builder-dashboard-page-card">
                <div className="builder-dashboard-page-head">
                  <div>
                    <strong>{route.collectionTitle}</strong>
                    <span>{route.notes}</span>
                  </div>
                  <span className="builder-stage-pill">
                    {route.kind === 'list' ? 'List route' : 'Item route'}
                  </span>
                </div>
                <div className="builder-dashboard-page-meta">
                  <span>Route ID {route.routeId}</span>
                  <span>{route.pathPattern}</span>
                  <span>{route.previewContextMode}</span>
                  <span>{route.recordCount} records</span>
                </div>
                <div className="builder-dashboard-page-actions">
                  <Link
                    href={buildBuilderDynamicRouteHref(locale, route.routeId)}
                    className="builder-action-btn builder-action-btn--primary"
                  >
                    Open registry detail
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="dynamic-template-registry" className="builder-preview-inspector-card">
          <h2>Dynamic template registry</h2>
          <p>
            Read-only template ownership only. These entries prove which live code routes currently own
            collection-backed list/item templates, but they do not imply a builder template editor.
          </p>
          <div className="builder-dashboard-page-list">
            {overview.dynamicTemplates.map((template) => (
              <article key={template.templateId} className="builder-dashboard-page-card">
                <div className="builder-dashboard-page-head">
                  <div>
                    <strong>{template.collectionTitle}</strong>
                    <span>{template.notes}</span>
                  </div>
                  <span className="builder-stage-pill">
                    {template.kind === 'list' ? 'List template' : 'Item template'}
                  </span>
                </div>
                <div className="builder-dashboard-page-meta">
                  <span>Template ID {template.templateId}</span>
                  <span>{template.publicPathPattern}</span>
                  <span>{template.ownerType}</span>
                  <span>{template.runtimeModulePath}</span>
                </div>
                <div className="builder-dashboard-page-actions">
                  <Link
                    href={buildBuilderDynamicTemplateHref(locale, template.templateId)}
                    className="builder-action-btn builder-action-btn--primary"
                  >
                    Open ownership detail
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="builder-preview-inspector-card">
          <h2>Route validation</h2>
          <p>Current static page registry is validated against duplicate public paths and homepage-role rules.</p>
          {overview.routing.valid ? (
            <div className="builder-dashboard-page-meta">
              <span>All static page routes are valid</span>
            </div>
          ) : (
            <div className="builder-dashboard-page-list">
              {overview.routing.issues.map((issue) => (
                <article key={`${issue.code}-${issue.message}`} className="builder-dashboard-page-card">
                  <div className="builder-dashboard-page-head">
                    <div>
                      <strong>{issue.code}</strong>
                      <span>{issue.message}</span>
                    </div>
                  </div>
                  <div className="builder-dashboard-page-meta">
                    <span>{issue.pageKeys.length ? issue.pageKeys.join(', ') : 'site-level'}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </BuilderWorkspaceFrame>
  );
}

function countPersistedPages(
  pages: BuilderSiteOverview['pages'],
  key: 'draftPersisted' | 'publishedPersisted'
) {
  return pages.reduce((count, page) => count + (page[key] ? 1 : 0), 0);
}
