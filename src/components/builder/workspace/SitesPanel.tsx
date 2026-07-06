'use client';

import Link from 'next/link';
import { useState } from 'react';
import type {
  BuilderWorkspaceRole,
  BuilderWorkspaceSite,
} from '@/lib/builder/workspace/account-model';
import type { WorkspaceCopy } from '@/lib/builder/workspace/workspace-copy';

interface SitesPanelProps {
  locale: string;
  copy: WorkspaceCopy['sites'];
  initialSites: BuilderWorkspaceSite[];
}

const ROLE_COLORS: Record<BuilderWorkspaceRole, { bg: string; fg: string }> = {
  owner: { bg: '#fef3c7', fg: '#92400e' },
  editor: { bg: '#dbeafe', fg: '#1d4ed8' },
  viewer: { bg: '#e2e8f0', fg: '#475569' },
};

const buttonStyle: React.CSSProperties = {
  padding: '8px 14px',
  borderRadius: 6,
  background: '#0f172a',
  color: '#fff',
  border: 'none',
  fontSize: 13,
  cursor: 'pointer',
};

const inputStyle: React.CSSProperties = {
  padding: '8px 10px',
  borderRadius: 6,
  border: '1px solid #cbd5f5',
  fontSize: 13,
  flex: 1,
  minWidth: 160,
};

export default function SitesPanel({ locale, copy, initialSites }: SitesPanelProps) {
  const [sites, setSites] = useState(initialSites);
  const [siteId, setSiteId] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleAdd(event: React.FormEvent) {
    event.preventDefault();
    if (!siteId.trim()) return;
    setError(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/builder/workspace/sites?locale=${locale}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId: siteId.trim(), name: name.trim() || undefined, locale }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok || !payload?.ok) throw new Error(payload?.error ?? copy.errors.add);
      setSites((prev) => {
        if (prev.some((entry) => entry.siteId === payload.site.siteId)) return prev;
        return [...prev, payload.site];
      });
      setSiteId('');
      setName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.errors.add);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div data-sites-panel style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <form
        onSubmit={handleAdd}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          padding: 16,
          background: '#fff',
          borderRadius: 12,
          border: '1px solid #e2e8f0',
        }}
      >
        <input
          value={siteId}
          onChange={(event) => setSiteId(event.target.value)}
          placeholder={copy.siteIdPlaceholder}
          style={inputStyle}
          aria-label={copy.siteIdLabel}
        />
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder={copy.siteNamePlaceholder}
          style={inputStyle}
          aria-label={copy.siteNameLabel}
        />
        <button type="submit" style={buttonStyle} disabled={busy} data-sites-add>
          {busy ? copy.adding : copy.register}
        </button>
      </form>
      {error ? (
        <p role="alert" style={{ color: '#b91c1c', fontSize: 13 }}>{error}</p>
      ) : null}

      <ul
        data-sites-list
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
        >
        {sites.length === 0 ? (
          <li style={{ color: '#64748b', fontSize: 13 }}>{copy.noSites}</li>
        ) : null}
        {sites.map((site) => {
          const palette = ROLE_COLORS[site.role];
          return (
            <li
              key={site.siteId}
              data-site-id={site.siteId}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                padding: '12px 16px',
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: 10,
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <strong style={{ fontSize: 14, color: '#0f172a' }}>{site.name}</strong>
                <span style={{ fontSize: 12, color: '#64748b' }}>{site.siteId}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: 8,
                  flexWrap: 'wrap',
                }}
              >
                <Link
                  href={`/${locale}/admin-builder?siteId=${encodeURIComponent(site.siteId)}`}
                  data-site-open-editor={site.siteId}
                  style={{
                    color: '#1d4ed8',
                    fontSize: 12,
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  {copy.openEditor}
                </Link>
                <span
                  data-site-role={site.role}
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    padding: '4px 10px',
                    borderRadius: 999,
                    background: palette.bg,
                    color: palette.fg,
                  }}
                >
                  {copy.role[site.role]}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
