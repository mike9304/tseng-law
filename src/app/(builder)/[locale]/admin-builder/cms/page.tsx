import type { Metadata } from 'next';
import Link from 'next/link';
import BuilderWorkspaceFrame from '@/components/builder/BuilderWorkspaceFrame';
import ContentManagerClient from '@/components/builder/cms/ContentManagerClient';
import { readBuilderCollectionSummaries } from '@/lib/builder/cms';
import { listEditableBuilderCmsCollections } from '@/lib/builder/cms-editable';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { readBuilderSiteOverview } from '@/lib/builder/site';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const locale = normalizeLocale(params.locale);
  return buildSeoMetadata({
    locale,
    title: 'Builder CMS',
    description: 'Content Manager for editable builder CMS collections.',
    path: '/admin-builder/cms',
    noindex: true,
  });
}

export default async function BuilderCmsPage({ params }: { params: { locale: Locale } }) {
  const locale = normalizeLocale(params.locale);
  const [overview, sourceCollections, editableCollections] = await Promise.all([
    readBuilderSiteOverview(locale),
    Promise.resolve(readBuilderCollectionSummaries(locale)),
    listEditableBuilderCmsCollections(DEFAULT_BUILDER_SITE_ID, locale),
  ]);

  return (
    <BuilderWorkspaceFrame
      title="Content Manager"
      description="Editable CMS collections, schema, and records."
      activeRail="pages"
      stageUrl={`/${locale}/admin-builder/cms`}
      backLink={{ href: `/${locale}/admin-builder`, label: '사이트 빌더로 돌아가기' }}
      railItems={[
        { key: 'pages', label: 'Pages', description: 'Editor', href: `/${locale}/admin-builder` },
        { key: 'assets', label: 'Assets', description: 'Library', href: `/${locale}/admin-builder` },
      ]}
      leftMeta={
        <>
          <span className="builder-stage-pill builder-stage-pill--accent">CMS</span>
          <span className="builder-stage-pill">{editableCollections.length} editable</span>
          <span className="builder-stage-pill">{sourceCollections.length} read-only sources</span>
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
          <h2>Builder</h2>
          <div className="builder-dashboard-nav-list">
            <Link href={`/${locale}/admin-builder`} className="builder-dashboard-nav-card">
              <strong>Desktop editor</strong>
              <span>Canvas and page editing</span>
            </Link>
            <Link href={`/${locale}/builder`} className="builder-dashboard-nav-card">
              <strong>Workspace map</strong>
              <span>Pages, routes, templates</span>
            </Link>
            <Link href={`/${locale}/admin-builder/cms`} className="builder-dashboard-nav-card is-active">
              <strong>Content Manager</strong>
              <span>Collections and records</span>
            </Link>
          </div>
        </section>
      }
      inspector={
        <>
          <section className="builder-preview-inspector-card">
            <h2>M158 status</h2>
            <dl className="builder-preview-inspector-list">
              <div>
                <dt>Editable collections</dt>
                <dd>{editableCollections.length}</dd>
              </div>
              <div>
                <dt>Source collections</dt>
                <dd>{sourceCollections.length}</dd>
              </div>
              <div>
                <dt>Site</dt>
                <dd>{DEFAULT_BUILDER_SITE_ID}</dd>
              </div>
            </dl>
          </section>
          <section className="builder-preview-inspector-card">
            <h2>F-layer</h2>
            <ul className="builder-preview-inspector-notes">
              <li>F07 schema model: in progress</li>
              <li>F08 content manager UI: in progress</li>
              <li>F09-F10 field validation: in progress</li>
              <li>F12/F16 permissions UI and guarded APIs: in progress</li>
            </ul>
          </section>
        </>
      }
    >
      <ContentManagerClient
        locale={locale}
        siteId={DEFAULT_BUILDER_SITE_ID}
        initialSourceCollections={sourceCollections}
        initialEditableCollections={editableCollections}
      />
    </BuilderWorkspaceFrame>
  );
}
