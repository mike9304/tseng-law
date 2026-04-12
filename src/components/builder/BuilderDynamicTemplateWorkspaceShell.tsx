import Link from 'next/link';
import BuilderWorkspaceFrame from '@/components/builder/BuilderWorkspaceFrame';
import type { BuilderDynamicTemplateDetail } from '@/lib/builder/dynamic-templates';
import {
  buildBuilderCollectionHref,
  buildBuilderDynamicRouteHref,
  buildBuilderDynamicTemplateHref,
} from '@/lib/builder/hrefs';
import type { BuilderSiteOverview } from '@/lib/builder/site';
import type { Locale } from '@/lib/locales';

export default function BuilderDynamicTemplateWorkspaceShell({
  locale,
  overview,
  detail,
}: {
  locale: Locale;
  overview: BuilderSiteOverview;
  detail: BuilderDynamicTemplateDetail;
}) {
  return (
    <BuilderWorkspaceFrame
      title={`${detail.title} template`}
      description="Read-only dynamic template ownership detail. This surface documents which live code route owns the template without implying a builder template editor."
      activeRail="pages"
      stageUrl={buildBuilderDynamicTemplateHref(locale, detail.templateId)}
      railItems={[
        { key: 'pages', label: 'Pages', description: 'Workspace inventory', href: `/${locale}/builder`, active: true },
        { key: 'assets', label: 'Assets', description: 'Recent builder media', href: `/${locale}/builder` },
      ]}
      leftMeta={
        <>
          <span className="builder-stage-pill builder-stage-pill--accent">Dynamic template ownership</span>
          <span className="builder-stage-pill">{detail.kind === 'list' ? 'List template' : 'Item template'}</span>
          <span className="builder-stage-pill">{detail.collectionId}</span>
          <span className="builder-stage-pill">{detail.ownerType}</span>
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
          <h2>Dynamic templates</h2>
          <p>Only explicit ownership entries appear here. They document runtime ownership but do not open a template canvas.</p>
          <div className="builder-dashboard-nav-list">
            {overview.dynamicTemplates.map((template) => (
              <Link
                key={template.templateId}
                href={buildBuilderDynamicTemplateHref(locale, template.templateId)}
                className={`builder-dashboard-nav-card${template.templateId === detail.templateId ? ' is-active' : ''}`}
              >
                <strong>{template.title}</strong>
                <span>{template.collectionTitle}</span>
                <small>{template.runtimeModulePath}</small>
              </Link>
            ))}
          </div>
        </section>
      }
      inspector={
        <>
          <section className="builder-preview-inspector-card">
            <h2>Ownership policy</h2>
            <ul className="builder-preview-inspector-notes">
              {detail.exclusions.map((exclusion) => (
                <li key={exclusion}>{exclusion}</li>
              ))}
            </ul>
          </section>
          <section className="builder-preview-inspector-card">
            <h2>Ownership links</h2>
            <dl className="builder-preview-inspector-list">
              <div>
                <dt>Collection</dt>
                <dd>
                  <Link href={buildBuilderCollectionHref(locale, detail.collectionId)} className="builder-link-inline">
                    Open collection detail
                  </Link>
                </dd>
              </div>
              <div>
                <dt>Route registry</dt>
                <dd>
                  <Link href={buildBuilderDynamicRouteHref(locale, detail.routeId)} className="builder-link-inline">
                    Open route detail
                  </Link>
                </dd>
              </div>
              <div>
                <dt>Preview support</dt>
                <dd>{detail.previewStatus}</dd>
              </div>
              <div>
                <dt>Editor status</dt>
                <dd>{detail.editorStatus}</dd>
              </div>
            </dl>
          </section>
        </>
      }
    >
      <div className="builder-dashboard-grid">
        <section className="builder-preview-inspector-card">
          <h2>Template ownership summary</h2>
          <p>{detail.notes}</p>
          <div className="builder-dashboard-kpi-grid">
            <article className="builder-dashboard-kpi-card">
              <strong>{detail.templateId}</strong>
              <span>Template ID</span>
            </article>
            <article className="builder-dashboard-kpi-card">
              <strong>{detail.routeId}</strong>
              <span>Route ID</span>
            </article>
            <article className="builder-dashboard-kpi-card">
              <strong>{detail.ownerType}</strong>
              <span>Owner type</span>
            </article>
            <article className="builder-dashboard-kpi-card">
              <strong>{detail.previewStatus}</strong>
              <span>Preview support</span>
            </article>
          </div>
        </section>

        <section className="builder-preview-inspector-card">
          <h2>Runtime ownership</h2>
          <div className="builder-dashboard-page-list">
            <article className="builder-dashboard-page-card">
              <div className="builder-dashboard-page-head">
                <div>
                  <strong>{detail.runtimeOwner}</strong>
                  <span>{detail.runtimeModulePath}</span>
                </div>
                <span className="builder-stage-pill">{detail.builderSupport}</span>
              </div>
              <div className="builder-dashboard-page-meta">
                <span>{detail.publicPathPattern}</span>
                <span>{detail.localized ? 'Localized content source' : 'Shared content source'}</span>
                <span>{detail.kind === 'list' ? 'Collection list ownership' : 'Collection item ownership'}</span>
              </div>
            </article>
          </div>
        </section>

        <section className="builder-preview-inspector-card">
          <h2>Current builder support</h2>
          <div className="builder-dashboard-page-list">
            <article className="builder-dashboard-page-card">
              <div className="builder-dashboard-page-head">
                <div>
                  <strong>Ownership traceability only</strong>
                  <span>Reachable from dashboard, collection detail, and route detail</span>
                </div>
              </div>
              <div className="builder-dashboard-page-meta">
                <span>No canvas render</span>
                <span>No inline editing</span>
                <span>No record-scoped preview renderer</span>
                <span>No dynamic page draft or publish lifecycle</span>
              </div>
            </article>
          </div>
        </section>
      </div>
    </BuilderWorkspaceFrame>
  );
}
