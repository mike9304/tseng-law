import type { Metadata } from 'next';
import WorkspaceOverview from '@/components/builder/workspace/WorkspaceOverview';
import SitesPanel from '@/components/builder/workspace/SitesPanel';
import MembersPanel from '@/components/builder/workspace/MembersPanel';
import SharedAssetsPanel from '@/components/builder/workspace/SharedAssetsPanel';
import AnalyticsPanel from '@/components/builder/workspace/AnalyticsPanel';
import {
  ensureDefaultAccount,
  listMembers,
  listWorkspaceSites,
} from '@/lib/builder/workspace/workspace-store';
import { listSharedAssets } from '@/lib/builder/workspace/shared-assets';
import { listAccountCollections } from '@/lib/builder/workspace/shared-cms';
import { buildWorkspaceAnalyticsRollup } from '@/lib/builder/workspace/analytics-aggregate';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Workspace · Hojeong Builder',
  robots: { index: false, follow: false },
};

type TabId = 'overview' | 'sites' | 'members' | 'assets' | 'analytics';

const VALID_TABS: readonly TabId[] = ['overview', 'sites', 'members', 'assets', 'analytics'];

function parseTab(input?: string): TabId {
  return (VALID_TABS as readonly string[]).includes(input ?? '') ? (input as TabId) : 'overview';
}

const tabButtonStyle = (active: boolean): React.CSSProperties => ({
  padding: '8px 14px',
  fontSize: 13,
  fontWeight: active ? 600 : 500,
  color: active ? '#0f172a' : '#475569',
  background: active ? '#fff' : 'transparent',
  border: '1px solid',
  borderColor: active ? '#cbd5f5' : 'transparent',
  borderRadius: 999,
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
});

const countBadgeStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  background: '#e2e8f0',
  color: '#334155',
  padding: '1px 8px',
  borderRadius: 999,
};

export default async function WorkspacePage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams?: { tab?: string };
}) {
  const locale = params.locale;
  const tab = parseTab(searchParams?.tab);

  await ensureDefaultAccount();
  const [account, sites, members, sharedAssets, collections, analytics] = await Promise.all([
    ensureDefaultAccount(),
    listWorkspaceSites(),
    listMembers(),
    listSharedAssets(24).catch(() => []),
    listAccountCollections().catch(() => []),
    buildWorkspaceAnalyticsRollup().catch(() => null),
  ]);

  const tabs: Array<{ id: TabId; label: string; count?: number }> = [
    { id: 'overview', label: 'Overview' },
    { id: 'sites', label: 'Sites', count: sites.length },
    { id: 'members', label: 'Members', count: members.length },
    { id: 'assets', label: 'Shared Assets', count: sharedAssets.length },
    { id: 'analytics', label: 'Analytics' },
  ];

  return (
    <main data-workspace-page style={{ padding: '24px', maxWidth: 1280, margin: '0 auto' }}>
      <header style={{ marginBottom: 20 }}>
        <p style={{ margin: 0, fontSize: 12, color: '#64748b', letterSpacing: 0.4, textTransform: 'uppercase' }}>
          Workspace
        </p>
        <h1 style={{ margin: '4px 0 0', fontSize: 24, color: '#0f172a' }}>{account.name}</h1>
        <p style={{ margin: '6px 0 0', fontSize: 13, color: '#64748b' }}>
          Owner {account.ownerEmail} · Account id {account.id}
        </p>
      </header>

      <nav
        aria-label="Workspace sections"
        data-workspace-tabs
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          padding: '6px',
          background: '#f1f5f9',
          borderRadius: 999,
          marginBottom: 24,
          width: 'fit-content',
        }}
      >
        {tabs.map((entry) => {
          const isActive = entry.id === tab;
          return (
            <a
              key={entry.id}
              href={`/${locale}/admin-builder/workspace?tab=${entry.id}`}
              data-workspace-tab={entry.id}
              data-active={isActive ? 'true' : 'false'}
              style={tabButtonStyle(isActive)}
            >
              {entry.label}
              {typeof entry.count === 'number'
                ? <span style={countBadgeStyle} data-workspace-tab-count={entry.id}>{entry.count}</span>
                : null}
            </a>
          );
        })}
      </nav>

      <section data-workspace-panel={tab}>
        {tab === 'overview' && (
          <WorkspaceOverview
            account={account}
            siteCount={sites.length}
            memberCount={members.length}
            sharedAssetCount={sharedAssets.length}
            collectionCount={collections.length}
            analytics={analytics}
          />
        )}
        {tab === 'sites' && <SitesPanel initialSites={sites} />}
        {tab === 'members' && <MembersPanel initialMembers={members} />}
        {tab === 'assets' && <SharedAssetsPanel initialAssets={sharedAssets} />}
        {tab === 'analytics' && <AnalyticsPanel analytics={analytics} collections={collections} />}
      </section>
    </main>
  );
}