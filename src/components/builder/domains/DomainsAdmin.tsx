'use client';

import { useState } from 'react';
import type { DomainBinding, DomainStatus } from '@/lib/builder/domains/types';

interface Props {
  initialDomains: DomainBinding[];
}

const STATUS_COLOR: Record<DomainStatus, string> = {
  'pending-dns': '#f59e0b',
  verifying: '#0ea5e9',
  active: '#16a34a',
  error: '#dc2626',
  removed: '#94a3b8',
};

const STATUS_LABEL: Record<DomainStatus, string> = {
  'pending-dns': 'DNS 대기',
  verifying: '검증 중',
  active: '활성',
  error: '오류',
  removed: '제거됨',
};

export default function DomainsAdmin({ initialDomains }: Props) {
  const [domains, setDomains] = useState(initialDomains);
  const [newDomain, setNewDomain] = useState('');
  const [busy, setBusy] = useState(false);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  async function refresh() {
    const res = await fetch('/api/builder/domains', { credentials: 'same-origin' });
    if (!res.ok) return;
    const payload = (await res.json()) as { domains: DomainBinding[] };
    setDomains(payload.domains);
  }

  async function register() {
    if (!newDomain.trim()) return;
    setBusy(true);
    setMessage('');
    try {
      const res = await fetch('/api/builder/domains', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: newDomain.trim().toLowerCase() }),
      });
      if (!res.ok) {
        const payload = (await res.json().catch(() => ({}))) as { error?: string };
        setMessage(`등록 실패: ${payload.error ?? res.statusText}`);
        return;
      }
      setNewDomain('');
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  async function verify(binding: DomainBinding) {
    setVerifyingId(binding.domainId);
    setMessage('');
    try {
      const res = await fetch(`/api/builder/domains/${encodeURIComponent(binding.domain)}/verify`, {
        method: 'POST',
        credentials: 'same-origin',
      });
      const payload = (await res.json().catch(() => ({}))) as { ok?: boolean; domain?: DomainBinding; dns?: { txtMatched: boolean; cnameMatched: boolean } };
      if (payload.domain) {
        setDomains((curr) => curr.map((d) => (d.domainId === binding.domainId ? payload.domain! : d)));
      }
      if (payload.ok) {
        setMessage(`${binding.domain} 검증 완료`);
      } else {
        const missing: string[] = [];
        if (payload.dns && !payload.dns.txtMatched) missing.push('TXT');
        if (payload.dns && !payload.dns.cnameMatched) missing.push('CNAME/A');
        setMessage(missing.length > 0 ? `누락: ${missing.join(', ')}` : '검증 실패');
      }
    } finally {
      setVerifyingId(null);
    }
  }

  async function remove(binding: DomainBinding) {
    if (!window.confirm(`${binding.domain} 도메인을 제거할까요? (Vercel alias도 해제됩니다)`)) return;
    const res = await fetch(`/api/builder/domains/${encodeURIComponent(binding.domain)}`, {
      method: 'DELETE',
      credentials: 'same-origin',
    });
    if (res.ok) await refresh();
  }

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          placeholder="example.com"
          value={newDomain}
          onChange={(e) => setNewDomain(e.target.value)}
          style={{ flex: 1, padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 14 }}
        />
        <button
          type="button"
          disabled={busy || !newDomain.trim()}
          onClick={register}
          style={{ padding: '8px 16px', border: 0, background: busy ? '#94a3b8' : '#0f172a', color: '#fff', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: busy ? 'not-allowed' : 'pointer' }}
        >
          도메인 등록
        </button>
      </div>
      {message ? <div style={{ fontSize: 12, color: message.includes('완료') ? '#16a34a' : '#dc2626' }}>{message}</div> : null}

      {domains.map((binding) => (
        <div
          key={binding.domainId}
          style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <strong style={{ fontSize: 15 }}>{binding.domain}</strong>
            <span style={{ padding: '2px 8px', borderRadius: 999, background: `${STATUS_COLOR[binding.status]}22`, color: STATUS_COLOR[binding.status], fontSize: 11, fontWeight: 700 }}>
              {STATUS_LABEL[binding.status]}
            </span>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
              <button type="button" disabled={verifyingId === binding.domainId} onClick={() => verify(binding)} style={{ padding: '4px 10px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 6, fontSize: 11, cursor: verifyingId === binding.domainId ? 'not-allowed' : 'pointer' }}>
                {verifyingId === binding.domainId ? '검증 중...' : '검증'}
              </button>
              <button type="button" onClick={() => remove(binding)} style={{ padding: '4px 10px', border: '1px solid #fecaca', background: '#fff', color: '#b91c1c', borderRadius: 6, fontSize: 11, cursor: 'pointer' }}>
                제거
              </button>
            </div>
          </div>

          {binding.status === 'pending-dns' || binding.status === 'error' ? (
            <div style={{ fontSize: 12, color: '#475569', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: 10, fontFamily: 'ui-monospace, Menlo, monospace' }}>
              <div>1) TXT 레코드:</div>
              <div style={{ paddingLeft: 16 }}>
                Name: <strong>_vercel.{binding.domain}</strong>
                <br />
                Value: <strong style={{ userSelect: 'all' }}>{binding.verificationToken}</strong>
              </div>
              <div style={{ marginTop: 6 }}>2) CNAME 레코드:</div>
              <div style={{ paddingLeft: 16 }}>
                Name: <strong>{binding.domain}</strong>
                <br />
                Value: <strong>{binding.cnameTarget}</strong>
              </div>
              {binding.lastError ? <div style={{ marginTop: 6, color: '#b91c1c' }}>마지막 오류: {binding.lastError}</div> : null}
            </div>
          ) : null}

          {binding.status === 'active' ? (
            <div style={{ fontSize: 12, color: '#15803d' }}>
              ✓ {binding.lastVerifiedAt ? `${new Date(binding.lastVerifiedAt).toLocaleString('ko-KR')} 검증 완료` : '검증 완료'} · SSL 자동 발급
            </div>
          ) : null}
        </div>
      ))}

      {domains.length === 0 ? (
        <div style={{ padding: 24, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
          등록된 도메인이 없습니다.
        </div>
      ) : null}
    </div>
  );
}
