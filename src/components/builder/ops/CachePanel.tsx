'use client';

import { useEffect, useState } from 'react';
import type { CacheKeyMeta } from '@/lib/builder/ops/cache-introspection';

function fmtBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

export default function CachePanel() {
  const [keys, setKeys] = useState<CacheKeyMeta[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  async function refresh() {
    setMessage('');
    const res = await fetch('/api/builder/ops/cache', { credentials: 'same-origin' });
    if (res.ok) {
      const payload = await res.json() as { keys: CacheKeyMeta[] };
      setKeys(payload.keys);
    }
  }

  async function clearOne(key: string) {
    setBusy(true);
    try {
      const res = await fetch(`/api/builder/ops/cache?key=${encodeURIComponent(key)}`, {
        method: 'DELETE', credentials: 'same-origin',
      });
      if (res.ok) {
        setMessage(`cleared ${key}`);
        await refresh();
      } else {
        setMessage(`failed: ${res.statusText}`);
      }
    } finally { setBusy(false); }
  }

  async function clearAll() {
    if (!window.confirm('모든 캐시 키를 삭제합니다. 계속할까요?')) return;
    setBusy(true);
    try {
      const res = await fetch('/api/builder/ops/cache', {
        method: 'POST', credentials: 'same-origin',
      });
      const payload = (await res.json().catch(() => ({}))) as { cleared?: number };
      setMessage(`cleared ${payload.cleared ?? 0} keys`);
      await refresh();
    } finally { setBusy(false); }
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <div data-ops-cache-panel="true" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button type="button" disabled={busy} onClick={refresh}
          style={{ padding: '6px 12px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>
          새로고침
        </button>
        <button type="button" disabled={busy || keys.length === 0} onClick={clearAll}
          style={{ padding: '6px 12px', border: '1px solid #fecaca', color: '#b91c1c', background: '#fff', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>
          전체 삭제
        </button>
        {message ? <span style={{ marginLeft: 'auto', fontSize: 12, color: '#64748b' }}>{message}</span> : null}
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
            <th style={{ padding: '8px 12px' }}>key</th>
            <th style={{ padding: '8px 12px' }}>size</th>
            <th style={{ padding: '8px 12px' }}>last written</th>
            <th style={{ padding: '8px 12px' }}>action</th>
          </tr>
        </thead>
        <tbody>
          {keys.length === 0 ? (
            <tr><td colSpan={4} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>캐시 키가 없습니다.</td></tr>
          ) : keys.map((meta) => (
            <tr key={meta.key} style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '8px 12px', fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 11 }}>{meta.key}</td>
              <td style={{ padding: '8px 12px' }}>{fmtBytes(meta.sizeBytes)}</td>
              <td style={{ padding: '8px 12px', color: '#64748b' }}>{meta.lastWrittenAt ? new Date(meta.lastWrittenAt).toLocaleString('ko-KR') : '—'}</td>
              <td style={{ padding: '8px 12px' }}>
                <button type="button" disabled={busy} onClick={() => clearOne(meta.key)}
                  style={{ padding: '4px 8px', border: '1px solid #fecaca', color: '#b91c1c', background: '#fff', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}>
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}