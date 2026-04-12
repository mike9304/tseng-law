import Link from 'next/link';
import BuilderWorkspaceFrame from '@/components/builder/BuilderWorkspaceFrame';
import type { BuilderSiteOverview } from '@/lib/builder/site';
import type { BuilderDynamicRouteDetail } from '@/lib/builder/dynamic-routes';
import {
  buildBuilderCollectionHref,
  buildBuilderDynamicRouteHref,
  buildBuilderDynamicTemplateHref,
} from '@/lib/builder/hrefs';
import type { Locale } from '@/lib/locales';

export default function BuilderDynamicRouteWorkspaceShell({
  locale,
  overview,
  detail,
}: {
  locale: Locale;
  overview: BuilderSiteOverview;
  detail: BuilderDynamicRouteDetail;
}) {
  return (
    <BuilderWorkspaceFrame
      title={`${detail.title} dynamic route`}
      description="Registry + preview context seam only. This route does not render or edit a dynamic page template yet."
      activeRail="pages"
      stageUrl={buildBuilderDynamicRouteHref(locale, detail.routeId, {
        previewRecordId: detail.previewContext.selectedRecordId,
      })}
      railItems={[
        { key: 'pages', label: 'Pages', description: 'Workspace inventory', href: `/${locale}/builder`, active: true },
        { key: 'assets', label: 'Assets', description: 'Recent builder media', href: `/${locale}/builder` },
      ]}
      leftMeta={
        <>
          <span className="builder-stage-pill builder-stage-pill--accent">Dynamic route registry</span>
          <span className="builder-stage-pill">{detail.kind === 'list' ? 'List route' : 'Item route'}</span>
          <span className="builder-stage-pill">{detail.collectionId}</span>
          <span className="builder-stage-pill">{detail.recordCount} records</span>
        </>
      }
      rightMeta={
        <>
          <strong>{overview.site.name}</strong>
          <span>
            {overview.site.id} · locale {locale}
          </span>
        </>
      }
      leftSidebar={
        <section className="builder-preview-inspector-card builder-dashboard-sidebar">
          <h2>Dynamic routes</h2>
          <p>Only route registry entries backed by real live routes appear here. Template ownership is now explicit, but template editing remains deferred.</p>
          <div className="builder-dashboard-nav-list">
            {overview.dynamicRoutes.map((route) => (
              <Link
                key={route.routeId}
                href={buildBuilderDynamicRouteHref(locale, route.routeId)}
                className={`builder-dashboard-nav-card${route.routeId === detail.routeId ? ' is-active' : ''}`}
              >
                <strong>{route.title}</strong>
                <span>{route.collectionTitle}</span>
                <small>{route.pathPattern}</small>
              </Link>
            ))}
          </div>
        </section>
      }
      inspector={
        <>
          <section className="builder-preview-inspector-card">
            <h2>Route policy</h2>
            <ul className="builder-preview-inspector-notes">
              <li>This route now links to an explicit read-only template ownership entry.</li>
              <li>Preview context resolves path ownership only. It does not render a record-scoped page inside the builder yet.</li>
              <li>Collection CRUD and record CRUD remain outside this batch.</li>
            </ul>
          </section>
          <section className="builder-preview-inspector-card">
            <h2>Template ownership</h2>
            <dl className="builder-preview-inspector-list">
              <div>
                <dt>Template ID</dt>
                <dd>{detail.templateId}</dd>
              </div>
              <div>
                <dt>Owner type</dt>
                <dd>{detail.templateOwnerType}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{detail.templateStatus}</dd>
              </div>
              <div>
                <dt>Detail</dt>
                <dd>
                  <Link
                    href={buildBuilderDynamicTemplateHref(locale, detail.templateId)}
                    className="builder-link-inline"
                  >
                    Open template ownership detail
                  </Link>
                </dd>
              </div>
            </dl>
          </section>
          <section className="builder-preview-inspector-card">
            <h2>Preview context</h2>
            <dl className="builder-preview-inspector-list">
              <div>
                <dt>Status</dt>
                <dd>{detail.previewContext.status}</dd>
              </div>
              <div>
                <dt>Selected record</dt>
                <dd>{detail.previewContext.selectedRecordId ?? 'Not selected'}</dd>
              </div>
              <div>
                <dt>Resolved path</dt>
                <dd>{detail.previewContext.resolvedPath ?? 'No path resolved yet'}</dd>
              </div>
              <div>
                <dt>Collection</dt>
                <dd>
                  <Link href={buildBuilderCollectionHref(locale, detail.collectionId)} className="builder-link-inline">
                    Open collection detail
                  </Link>
                </dd>
              </div>
            </dl>
          </section>
        </>
      }
    >
      <div className="builder-dashboard-grid">
        <section className="builder-preview-inspector-card">
          <h2>Route summary</h2>
          <p>{detail.notes}</p>
          <div className="builder-dashboard-kpi-grid">
            <article className="builder-dashboard-kpi-card">
              <strong>{detail.pathPattern}</strong>
              <span>Path pattern</span>
            </article>
            <article className="builder-dashboard-kpi-card">
              <strong>{detail.recordCount}</strong>
              <span>Records</span>
            </article>
            <article className="builder-dashboard-kpi-card">
              <strong>{detail.previewContextMode}</strong>
              <span>Preview context mode</span>
            </article>
            <article className="builder-dashboard-kpi-card">
              <strong>{detail.templateStatus}</strong>
              <span>Template status</span>
            </article>
          </div>
        </section>

        <section className="builder-preview-inspector-card">
          <h2>Template ownership seam</h2>
          <p>
            This route now maps into an explicit template ownership entry. The entry documents which
            code route owns the list/item template, but it still does not expose canvas editing.
          </p>
          <div className="builder-dashboard-page-list">
            <article className="builder-dashboard-page-card">
              <div className="builder-dashboard-page-head">
                <div>
                  <strong>{detail.templateId}</strong>
                  <span>{detail.templateOwnerType}</span>
                </div>
                <span className="builder-stage-pill">{detail.templateStatus}</span>
              </div>
              <div className="builder-dashboard-page-meta">
                <span>{detail.pathPattern}</span>
                <span>{detail.kind === 'list' ? 'List template' : 'Item template'}</span>
              </div>
              <div className="builder-dashboard-page-actions">
                <Link
                  href={buildBuilderDynamicTemplateHref(locale, detail.templateId)}
                  className="builder-action-btn builder-action-btn--primary"
                >
                  Open template ownership detail
                </Link>
              </div>
            </article>
          </div>
        </section>

        <section className="builder-preview-inspector-card">
          <h2>Preview context seam</h2>
          <p>{detail.previewContext.note}</p>
          <div className="builder-dashboard-page-list">
            <article className="builder-dashboard-page-card">
              <div className="builder-dashboard-page-head">
                <div>
                  <strong>{detail.previewContext.summary}</strong>
                  <span>{detail.previewContext.status}</span>
                </div>
                <span className="builder-stage-pill">{detail.sourceStatus}</span>
              </div>
              <div className="builder-dashboard-page-meta">
                <span>{detail.pathPattern}</span>
                <span>{detail.previewContext.resolvedPath ?? 'No resolved live route'}</span>
              </div>
              {detail.previewContext.resolvedPath ? (
                <div className="builder-dashboard-page-actions">
                  <Link
                    href={detail.previewContext.resolvedPath}
                    className="builder-action-btn builder-action-btn--primary"
                  >
                    Open live route
                  </Link>
                </div>
              ) : null}
            </article>
          </div>
        </section>

        <section className="builder-preview-inspector-card">
          <h2>Preview record options</h2>
          {detail.kind === 'item' ? (
            <>
              <p>Selecting a record only resolves preview context. It does not open a dynamic template editor.</p>
              <div className="builder-dashboard-page-list">
                {detail.sampleRecords.map((record) => {
                  const isActive = record.recordId === detail.previewContext.selectedRecordId;

                  return (
                    <article key={record.recordId} className="builder-dashboard-page-card">
                      <div className="builder-dashboard-page-head">
                        <div>
                          <strong>{record.primaryLabel}</strong>
                          <span>{record.secondaryLabel}</span>
                        </div>
                        <span className="builder-stage-pill">{isActive ? 'Selected' : 'Sample record'}</span>
                      </div>
                      <div className="builder-dashboard-page-meta">
                        <span>{record.recordId}</span>
                        <span>{record.routePath}</span>
                      </div>
                      <div className="builder-dashboard-page-actions">
                        <Link
                          href={buildBuilderDynamicRouteHref(locale, detail.routeId, {
                            previewRecordId: record.recordId,
                          })}
                          className="builder-action-btn builder-action-btn--primary"
                        >
                          Use preview record
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          ) : (
            <p>List routes stay collection-scoped in this batch, so no preview record chooser is needed.</p>
          )}
        </section>
      </div>
    </BuilderWorkspaceFrame>
  );
}
