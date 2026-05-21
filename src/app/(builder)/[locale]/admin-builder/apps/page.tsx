import type { Metadata } from 'next';
import Link from 'next/link';
import BuilderWorkspaceFrame from '@/components/builder/BuilderWorkspaceFrame';
import AppMarketClient from '@/components/builder/apps/AppMarketClient';
import { listBuilderAppCatalogEntries } from '@/lib/builder/apps/installed';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { readBuilderSiteOverview } from '@/lib/builder/site';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const locale = normalizeLocale(params.locale);
  return buildSeoMetadata({
    locale,
    title: 'Builder App Market',
    description: 'Local app catalog and install lifecycle controls.',
    path: '/admin-builder/apps',
    noindex: true,
  });
}

export default async function BuilderAppsPage({ params }: { params: { locale: Locale } }) {
  const locale = normalizeLocale(params.locale);
  const [overview, entries] = await Promise.all([
    readBuilderSiteOverview(locale),
    listBuilderAppCatalogEntries(DEFAULT_BUILDER_SITE_ID, locale),
  ]);
  const installedCount = entries.filter((entry) => entry.installation).length;
  const enabledCount = entries.filter((entry) => entry.installation?.status === 'enabled').length;

  return (
    <BuilderWorkspaceFrame
      title="App Market"
      description="Install and manage builder apps."
      activeRail="pages"
      stageUrl={`/${locale}/admin-builder/apps`}
      backLink={{ href: `/${locale}/admin-builder`, label: '사이트 빌더로 돌아가기' }}
      railItems={[
        { key: 'pages', label: 'Pages', description: 'Editor', href: `/${locale}/admin-builder` },
        { key: 'assets', label: 'Assets', description: 'Library', href: `/${locale}/admin-builder` },
      ]}
      leftMeta={
        <>
          <span className="builder-stage-pill builder-stage-pill--accent">M161</span>
          <span className="builder-stage-pill">{entries.length} apps</span>
          <span className="builder-stage-pill">{installedCount} installed</span>
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
            <Link href={`/${locale}/admin-builder/cms`} className="builder-dashboard-nav-card">
              <strong>Content Manager</strong>
              <span>Collections and records</span>
            </Link>
            <Link href={`/${locale}/admin-builder/apps`} className="builder-dashboard-nav-card is-active">
              <strong>App Market</strong>
              <span>Catalog and lifecycle</span>
            </Link>
          </div>
        </section>
      }
      inspector={
        <>
          <section className="builder-preview-inspector-card">
            <h2>M161 status</h2>
            <dl className="builder-preview-inspector-list">
              <div>
                <dt>Catalog apps</dt>
                <dd>{entries.length}</dd>
              </div>
              <div>
                <dt>Installed</dt>
                <dd>{installedCount}</dd>
              </div>
              <div>
                <dt>Enabled</dt>
                <dd>{enabledCount}</dd>
              </div>
            </dl>
          </section>
          <section className="builder-preview-inspector-card">
            <h2>F-layer</h2>
            <ul className="builder-preview-inspector-notes">
              <li>F33 manifest schema: local validation active</li>
              <li>F34 discovery: browse/search/filter active</li>
              <li>F35 lifecycle: install/enable/disable/uninstall active</li>
              <li>F36-F42 runtime, scopes, versioning, and cleanup active</li>
            </ul>
          </section>
        </>
      }
    >
      <AppMarketClient locale={locale} initialEntries={entries} />
    </BuilderWorkspaceFrame>
  );
}
