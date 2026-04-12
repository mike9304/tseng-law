import Link from 'next/link';
import BuilderWorkspaceFrame from '@/components/builder/BuilderWorkspaceFrame';
import {
  buildBuilderDynamicTemplateHref,
  buildBuilderStarterTemplateHref,
} from '@/lib/builder/hrefs';
import { buildBuilderPageHref, type BuilderSiteOverview } from '@/lib/builder/site';
import type { BuilderStarterTemplateDetail } from '@/lib/builder/starter-templates';
import type { Locale } from '@/lib/locales';

export default function BuilderStarterTemplateWorkspaceShell({
  locale,
  overview,
  detail,
}: {
  locale: Locale;
  overview: BuilderSiteOverview;
  detail: BuilderStarterTemplateDetail;
}) {
  return (
    <BuilderWorkspaceFrame
      title={`${detail.title} starter`}
      description="Template-first confirmation surface. This does not pretend to instantiate a new page yet; it only shows the safest current entry path."
      activeRail="pages"
      stageUrl={buildBuilderStarterTemplateHref(locale, detail.templateId)}
      railItems={[
        { key: 'pages', label: 'Pages', description: 'Workspace inventory', href: `/${locale}/builder`, active: true },
        { key: 'assets', label: 'Assets', description: 'Recent builder media', href: `/${locale}/builder` },
      ]}
      leftMeta={
        <>
          <span className="builder-stage-pill builder-stage-pill--accent">Starter template</span>
          <span className="builder-stage-pill">{detail.category}</span>
          <span className="builder-stage-pill">
            {detail.support === 'editable-now'
              ? 'Editable now'
              : detail.support === 'preview-now'
                ? 'Preview now'
                : 'Ownership only'}
          </span>
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
          <h2>Starter templates</h2>
          <p>Only templates backed by real current routes or builder pages appear here.</p>
          <div className="builder-dashboard-nav-list">
            {overview.starterTemplates.map((template) => (
              <Link
                key={template.templateId}
                href={buildBuilderStarterTemplateHref(locale, template.templateId)}
                className={`builder-dashboard-nav-card${template.templateId === detail.templateId ? ' is-active' : ''}`}
              >
                <strong>{template.title}</strong>
                <span>{template.focus}</span>
                <small>{template.livePath}</small>
              </Link>
            ))}
          </div>
        </section>
      }
      inspector={
        <>
          <section className="builder-preview-inspector-card">
            <h2>Current entry path</h2>
            <ul className="builder-preview-inspector-notes">
              {detail.capabilities.map((capability) => (
                <li key={capability}>{capability}</li>
              ))}
            </ul>
          </section>
          <section className="builder-preview-inspector-card">
            <h2>Still excluded</h2>
            <ul className="builder-preview-inspector-notes">
              {detail.exclusions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </>
      }
    >
      <div className="builder-dashboard-grid">
        <section className="builder-preview-inspector-card">
          <h2>Starter summary</h2>
          <p>{detail.description}</p>
          <div className="builder-dashboard-kpi-grid">
            <article className="builder-dashboard-kpi-card">
              <strong>{detail.templateId}</strong>
              <span>Template ID</span>
            </article>
            <article className="builder-dashboard-kpi-card">
              <strong>{detail.entryKind}</strong>
              <span>Entry kind</span>
            </article>
            <article className="builder-dashboard-kpi-card">
              <strong>{detail.support}</strong>
              <span>Current support</span>
            </article>
            <article className="builder-dashboard-kpi-card">
              <strong>{detail.category}</strong>
              <span>Category</span>
            </article>
          </div>
        </section>

        <section className="builder-preview-inspector-card">
          <h2>Use this starter</h2>
          <div className="builder-dashboard-page-list">
            <article className="builder-dashboard-page-card">
              <div className="builder-dashboard-page-head">
                <div>
                  <strong>{detail.title}</strong>
                  <span>{detail.focus}</span>
                </div>
                <span className="builder-stage-pill">{detail.support}</span>
              </div>
              <div className="builder-dashboard-page-meta">
                <span>{detail.livePath}</span>
                <span>{detail.pageKey ? `builder page ${detail.pageKey}` : 'dynamic route-backed starter'}</span>
                <span>{detail.dynamicTemplateId ?? 'no dynamic template ownership entry'}</span>
              </div>
              <div className="builder-dashboard-page-actions">
                {detail.pageKey ? (
                  <Link
                    href={buildBuilderPageHref(
                      locale,
                      detail.pageKey,
                      detail.support === 'editable-now' ? 'edit' : 'preview'
                    )}
                    className="builder-action-btn builder-action-btn--primary"
                  >
                    {detail.support === 'editable-now' ? 'Open in builder' : 'Open builder preview'}
                  </Link>
                ) : null}
                {detail.dynamicTemplateId ? (
                  <Link
                    href={buildBuilderDynamicTemplateHref(locale, detail.dynamicTemplateId)}
                    className="builder-action-btn"
                  >
                    Open ownership detail
                  </Link>
                ) : null}
                <Link href={detail.livePath} className="builder-action-btn">
                  Open live route
                </Link>
              </div>
            </article>
          </div>
        </section>
      </div>
    </BuilderWorkspaceFrame>
  );
}
