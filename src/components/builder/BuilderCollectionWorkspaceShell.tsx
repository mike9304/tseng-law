import Link from 'next/link';
import BuilderWorkspaceFrame from '@/components/builder/BuilderWorkspaceFrame';
import BuilderCollectionSeedAllAndOpenAction from '@/components/builder/datasets/BuilderCollectionSeedAllAndOpenAction';
import BuilderDatasetSeedAction from '@/components/builder/datasets/BuilderDatasetSeedAction';
import BuilderDatasetSeedAllAction from '@/components/builder/datasets/BuilderDatasetSeedAllAction';
import type { BuilderCollectionDetail } from '@/lib/builder/cms';
import { buildBuilderDynamicRouteId } from '@/lib/builder/dynamic-routes';
import {
  buildBuilderCollectionHref,
  buildBuilderCmsCollectionHref,
  buildBuilderDynamicRouteHref,
  buildBuilderDynamicTemplateHref,
  buildBuilderPageDatasetHref,
} from '@/lib/builder/hrefs';
import { buildBuilderDynamicTemplateId } from '@/lib/builder/dynamic-templates';
import { getBuilderWorkspaceCopy } from '@/lib/builder/workspace-copy';
import type { BuilderSiteOverview } from '@/lib/builder/site';
import type { Locale } from '@/lib/locales';

export default function BuilderCollectionWorkspaceShell({
  locale,
  overview,
  detail,
}: {
  locale: Locale;
  overview: BuilderSiteOverview;
  detail: BuilderCollectionDetail;
}) {
  const copy = getBuilderWorkspaceCopy(locale);
  return (
    <BuilderWorkspaceFrame
      locale={locale}
      title={`${detail.title} collection`}
      description="Read-only collection detail. This route exposes real schema and sample record evidence without pretending record editing or dataset mapping already exists."
      activeRail="pages"
      stageUrl={buildBuilderCollectionHref(locale, detail.id)}
      railItems={[
        { key: 'pages', label: copy.pagesLabel, description: copy.pagesDescription, href: `/${locale}/builder`, active: true },
        { key: 'assets', label: copy.assetsLabel, description: copy.assetsDescription, href: `/${locale}/builder` },
      ]}
      leftMeta={
        <>
          <span className="builder-stage-pill builder-stage-pill--accent">Collection detail</span>
          <span className="builder-stage-pill">{detail.id}</span>
          <span className="builder-stage-pill">{detail.localized ? 'Localized' : 'Shared'}</span>
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
          <h2>{copy.collectionSidebarTitle}</h2>
          <p>{copy.collectionSidebarDescription}</p>
          <div className="builder-dashboard-nav-list">
            {overview.collections.map((collection) => (
              <Link
                key={collection.id}
                href={buildBuilderCollectionHref(locale, collection.id)}
                className={`builder-dashboard-nav-card${collection.id === detail.id ? ' is-active' : ''}`}
              >
                <strong>{collection.title}</strong>
                <span>{collection.recordCount} records</span>
                <small>{collection.sourceLabel}</small>
              </Link>
            ))}
          </div>
        </section>
      }
      inspector={
        <>
          <section className="builder-preview-inspector-card">
            <h2>{copy.collectionPolicyTitle}</h2>
            <ul className="builder-preview-inspector-notes">
              {copy.collectionPolicyItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="builder-preview-inspector-card">
            <h2>Current collection</h2>
            <div className="builder-dashboard-page-actions" style={{ marginBottom: 12 }}>
              <Link
                href={buildBuilderCmsCollectionHref(locale, detail.id)}
                className="builder-action-btn builder-action-btn--primary"
                data-cms-source-collection-link={detail.id}
              >
                Open CMS collection
              </Link>
            </div>
            <dl className="builder-preview-inspector-list">
              <div>
                <dt>ID</dt>
                <dd>{detail.id}</dd>
              </div>
              <div>
                <dt>Records</dt>
                <dd>{detail.recordCount}</dd>
              </div>
              <div>
                <dt>Fields</dt>
                <dd>{detail.fieldCount}</dd>
              </div>
              <div>
                <dt>Relations</dt>
                <dd>{detail.supportsRelations ? 'Present' : 'None'}</dd>
              </div>
            </dl>
          </section>
          <section className="builder-preview-inspector-card">
            <h2>Bindable targets</h2>
            {detail.bindableTargets.length ? (
              <div style={{ marginBottom: 12, display: 'grid', gap: 8 }}>
                <Link
                  href={buildBuilderPageDatasetHref(locale, detail.bindableTargets[0].pageKey, {
                    targetId: detail.bindableTargets[0].targetId,
                  })}
                  className="builder-action-btn builder-action-btn--primary"
                  data-builder-collection-target-primary-link={detail.bindableTargets[0].targetId}
                  style={{ justifySelf: 'start', textDecoration: 'none' }}
                >
                  Open {detail.bindableTargets[0].title}
                </Link>
                <BuilderCollectionSeedAllAndOpenAction
                  locale={locale}
                  siteId={overview.site.id}
                  targets={detail.bindableTargets}
                />
                <BuilderDatasetSeedAllAction
                  locale={locale}
                  siteId={overview.site.id}
                  targets={detail.bindableTargets}
                />
              </div>
            ) : null}
            {detail.bindableTargets.length ? (
              <ul className="builder-preview-inspector-notes">
                {detail.bindableTargets.map((target) => (
                  <li key={target.targetId} data-builder-collection-target={target.targetId}>
                    <div style={{ display: 'grid', gap: 8 }}>
                      <Link href={buildBuilderPageDatasetHref(locale, target.pageKey, { targetId: target.targetId })}>
                        {target.title} · {target.pageKey} · {target.runtimeStatus}
                      </Link>
                      <BuilderDatasetSeedAction
                        locale={locale}
                        siteId={overview.site.id}
                        pageKey={target.pageKey}
                        targetId={target.targetId}
                        label="Seed defaults and open editor"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="builder-preview-editor-note">No registered builder targets use this collection yet.</p>
            )}
          </section>
        </>
      }
    >
      <div className="builder-dashboard-grid">
        <section className="builder-preview-inspector-card">
          <h2>{detail.title}</h2>
          <p>{detail.description}</p>
          <div className="builder-dashboard-kpi-grid">
            <article className="builder-dashboard-kpi-card">
              <strong>{detail.recordCount}</strong>
              <span>Records</span>
            </article>
            <article className="builder-dashboard-kpi-card">
              <strong>{detail.fieldCount}</strong>
              <span>Fields</span>
            </article>
            <article className="builder-dashboard-kpi-card">
              <strong>{detail.bindableTargets.length}</strong>
              <span>Registered targets</span>
            </article>
            <article className="builder-dashboard-kpi-card">
              <strong>{detail.routeBindings.length}</strong>
              <span>Route bindings</span>
            </article>
          </div>
        </section>

        <section className="builder-preview-inspector-card">
          <h2>Field schema</h2>
          <div className="builder-dashboard-page-list">
            {detail.fields.map((field) => (
              <article key={field.key} className="builder-dashboard-page-card">
                <div className="builder-dashboard-page-head">
                  <div>
                    <strong>{field.label}</strong>
                    <span>{field.key}</span>
                  </div>
                  <span className="builder-stage-pill">{field.type}</span>
                </div>
                <div className="builder-dashboard-page-meta">
                  <span>{field.localized ? 'Localized' : 'Shared field'}</span>
                  <span>{field.repeated ? 'Repeated' : 'Single value'}</span>
                  <span>{field.required ? 'Required' : 'Optional'}</span>
                  <span>
                    {field.relationCollectionId
                      ? `Relates to ${field.relationCollectionId}`
                      : 'No relation target'}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="builder-preview-inspector-card">
          <h2>Sample records</h2>
          <p>Real source data only. This is not a record editor yet.</p>
          <div className="builder-dashboard-page-list">
            {detail.sampleRecords.map((record) => (
              <article key={record.recordId} className="builder-dashboard-page-card">
                <div className="builder-dashboard-page-head">
                  <div>
                    <strong>{record.primaryLabel}</strong>
                    <span>{record.secondaryLabel}</span>
                  </div>
                </div>
                <div className="builder-dashboard-page-meta">
                  <span>Record {record.recordId}</span>
                  <Link href={record.routePath} data-cms-source-record-route-link={record.recordId}>
                    Open route
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="builder-preview-inspector-card">
          <h2>Route bindings</h2>
          <div className="builder-dashboard-page-list">
            {detail.routeBindings.map((binding) => (
              <article key={`${binding.kind}:${binding.pathPattern}`} className="builder-dashboard-page-card">
                <div className="builder-dashboard-page-head">
                  <div>
                    <strong>{binding.kind === 'list' ? 'List route' : 'Item route'}</strong>
                    <span>{binding.pathPattern}</span>
                  </div>
                </div>
                <div className="builder-dashboard-page-meta">
                  <span>{binding.notes}</span>
                </div>
                <div className="builder-dashboard-page-actions">
                  <Link
                    href={buildBuilderDynamicRouteHref(
                      locale,
                      buildBuilderDynamicRouteId(detail.id, binding.kind)
                    )}
                    className="builder-action-btn builder-action-btn--primary"
                  >
                    Open registry detail
                  </Link>
                  <Link
                    href={buildBuilderDynamicTemplateHref(
                      locale,
                      buildBuilderDynamicTemplateId(detail.id, binding.kind)
                    )}
                    className="builder-action-btn"
                  >
                    Open template detail
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="builder-preview-inspector-card">
          <h2>Registered builder targets</h2>
          <p>Targets listed here are safe future seams. Only runtime-applied targets may affect current preview output.</p>
          <div className="builder-dashboard-page-list">
            {detail.bindableTargets.length ? (
              detail.bindableTargets.map((target) => (
                <article key={target.targetId} className="builder-dashboard-page-card">
                  <div className="builder-dashboard-page-head">
                    <div>
                      <strong>{target.title}</strong>
                      <span>{target.description}</span>
                    </div>
                    <span className="builder-stage-pill">{target.runtimeStatus}</span>
                  </div>
                  <div className="builder-dashboard-page-meta">
                    <span>Page {target.pageKey}</span>
                    <span>Section {target.sectionKey}</span>
                    <span>Target {target.targetId}</span>
                  </div>
                  <div className="builder-dashboard-page-actions">
                    <Link
                      href={buildBuilderPageDatasetHref(locale, target.pageKey, { targetId: target.targetId })}
                      className="builder-action-btn builder-action-btn--primary"
                    >
                      Open dataset editor
                    </Link>
                    <BuilderDatasetSeedAction
                      locale={locale}
                      siteId={overview.site.id}
                      pageKey={target.pageKey}
                      targetId={target.targetId}
                    />
                  </div>
                </article>
              ))
            ) : (
              <article className="builder-dashboard-page-card">
                <div className="builder-dashboard-page-head">
                  <div>
                    <strong>No registered targets</strong>
                    <span>This collection is not yet wired to a builder runtime target.</span>
                  </div>
                </div>
              </article>
            )}
          </div>
        </section>
      </div>
    </BuilderWorkspaceFrame>
  );
}
