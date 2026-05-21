'use client';

import { useEffect, useState } from 'react';
import type { OpsPerfSnapshot } from '@/lib/builder/ops/perf-snapshot';

function fmtMb(n: number): string {
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

function fmtUptime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

export default function PerfPanel() {
  const [perf, setPerf] = useState<OpsPerfSnapshot | null>(null);

  async function refresh() {
    const res = await fetch('/api/builder/ops/perf', { credentials: 'same-origin' });
    if (res.ok) {
      const payload = await res.json() as { perf: OpsPerfSnapshot };
      setPerf(payload.perf);
    }
  }

  useEffect(() => { void refresh(); }, []);

  if (!perf) {
    return (
      <div data-ops-perf-panel="true" style={{ padding: 24, color: '#94a3b8' }}>perf 정보를 불러오는 중...</div>
    );
  }

  return (
    <div data-ops-perf-panel="true" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button type="button" onClick={refresh}
          style={{ padding: '6px 12px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>
          새로고침
        </button>
        <span style={{ fontSize: 12, color: '#64748b' }}>
          {new Date(perf.capturedAt).toLocaleString('ko-KR')}
        </span>
      </div>
      <dl style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
        <Row label="uptime" value={fmtUptime(perf.uptimeSeconds)} />
        <Row label="RSS" value={fmtMb(perf.memory.rssBytes)} />
        <Row label="Heap total" value={fmtMb(perf.memory.heapTotalBytes)} />
        <Row label="Heap used" value={fmtMb(perf.memory.heapUsedBytes)} />
        <Row label="External" value={fmtMb(perf.memory.externalBytes)} />
        <Row label="Node" value={`${perf.node.version} ${perf.node.platform}/${perf.node.arch}`} />
      </dl>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding: 12, border: '1px solid #e2e8f0', borderRadius: 6, background: '#fff' }}>
      <dt style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: 700 }}>{label}</dt>
      <dd style={{ margin: '4px 0 0', fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{value}</dd>
    </div>
  );
}