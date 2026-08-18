'use client';

import { useEffect, useState } from 'react';
import type { Locale } from '@/lib/locales';
import type { DomainBinding, DomainStatus } from '@/lib/builder/domains/types';

interface Props {
  locale: Locale;
  initialDomains: DomainBinding[];
}

const STATUS_COLOR: Record<DomainStatus, string> = {
  'pending-dns': '#f59e0b',
  verifying: '#0ea5e9',
  active: '#16a34a',
  error: '#dc2626',
  removed: '#94a3b8',
};

const COPY = {
  ko: {
    status: {
      'pending-dns': 'DNS 대기',
      verifying: '검증 중',
      active: '활성',
      error: '오류',
      removed: '제거됨',
    },
    placeholder: 'example.com',
    register: '도메인 등록',
    autoPoll: '대기 중인 도메인 30초마다 자동 검증',
    verify: '검증',
    verifying: '검증 중...',
    remove: '제거',
    removeConfirm: (domain: string) => `${domain} 도메인을 제거할까요? (Vercel alias도 해제됩니다)`,
    txt: '1) TXT 레코드:',
    cname: '2) CNAME 레코드:',
    lastError: '마지막 오류:',
    activeVerified: (at?: string | null) => (at ? `${new Date(at).toLocaleString('ko-KR')} 검증 완료` : '검증 완료'),
    ssl: 'SSL 자동 발급',
    empty: '등록된 도메인이 없습니다.',
    registerError: (error?: string) => `등록 실패: ${error ?? 'Unknown error'}`,
    verifySuccess: (domain: string) => `${domain} 검증 완료`,
    verifyFailed: '검증 실패',
    missing: '누락:',
    ready: '준비됨',
  },
  'zh-hant': {
    status: {
      'pending-dns': '等待 DNS',
      verifying: '驗證中',
      active: '啟用',
      error: '錯誤',
      removed: '已移除',
    },
    placeholder: 'example.com',
    register: '註冊網域',
    autoPoll: '每 30 秒自動驗證待處理的網域',
    verify: '驗證',
    verifying: '驗證中...',
    remove: '移除',
    removeConfirm: (domain: string) => `要移除 ${domain} 網域嗎？（Vercel alias 也會解除）`,
    txt: '1) TXT 記錄：',
    cname: '2) CNAME 記錄：',
    lastError: '最後錯誤：',
    activeVerified: (at?: string | null) => (at ? `${new Date(at).toLocaleString('zh-Hant')} 驗證完成` : '驗證完成'),
    ssl: 'SSL 自動發佈',
    empty: '尚無已註冊的網域。',
    registerError: (error?: string) => `註冊失敗：${error ?? 'Unknown error'}`,
    verifySuccess: (domain: string) => `${domain} 驗證完成`,
    verifyFailed: '驗證失敗',
    missing: '缺少：',
    ready: '就緒',
  },
  en: {
    status: {
      'pending-dns': 'DNS pending',
      verifying: 'Verifying',
      active: 'Active',
      error: 'Error',
      removed: 'Removed',
    },
    placeholder: 'example.com',
    register: 'Register domain',
    autoPoll: 'Automatically verify pending domains every 30 seconds',
    verify: 'Verify',
    verifying: 'Verifying...',
    remove: 'Remove',
    removeConfirm: (domain: string) => `Remove ${domain}? (Vercel alias will be detached as well)`,
    txt: '1) TXT record:',
    cname: '2) CNAME record:',
    lastError: 'Last error:',
    activeVerified: (at?: string | null) => (at ? `${new Date(at).toLocaleString('en-US')} verified` : 'Verified'),
    ssl: 'SSL auto-provisioned',
    empty: 'No domains registered yet.',
    registerError: (error?: string) => `Registration failed: ${error ?? 'Unknown error'}`,
    verifySuccess: (domain: string) => `${domain} verified`,
    verifyFailed: 'Verification failed',
    missing: 'Missing:',
    ready: 'Ready',
  },
} satisfies Record<Locale, {
  status: Record<DomainStatus, string>;
  placeholder: string;
  register: string;
  autoPoll: string;
  verify: string;
  verifying: string;
  remove: string;
  removeConfirm: (domain: string) => string;
  txt: string;
  cname: string;
  lastError: string;
  activeVerified: (at?: string | null) => string;
  ssl: string;
  empty: string;
  registerError: (error?: string) => string;
  verifySuccess: (domain: string) => string;
  verifyFailed: string;
  missing: string;
  ready: string;
}>;

export default function DomainsAdmin({ locale, initialDomains }: Props) {
  const copy = COPY[locale];
  const [domains, setDomains] = useState(initialDomains);
  const [newDomain, setNewDomain] = useState('');
  const [busy, setBusy] = useState(false);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [messageTone, setMessageTone] = useState<'success' | 'error'>('success');
  const [autoPollEnabled, setAutoPollEnabled] = useState(true);

  // PR #12 follow-up — auto-verify pending domains every 30s.
  useEffect(() => {
    if (!autoPollEnabled) return;
    const pendingIds = domains
      .filter((d) => d.status === 'pending-dns' || d.status === 'error')
      .map((d) => d.domain);
    if (pendingIds.length === 0) return;
    const interval = setInterval(async () => {
      for (const domain of pendingIds) {
        await fetch(`/api/builder/domains/${encodeURIComponent(domain)}/verify?locale=${encodeURIComponent(locale)}`, {
          method: 'POST',
          credentials: 'same-origin',
        }).catch(() => undefined);
      }
      const res = await fetch(`/api/builder/domains?locale=${encodeURIComponent(locale)}`, { credentials: 'same-origin' }).catch(() => null);
      if (res?.ok) {
        const payload = (await res.json()) as { domains: DomainBinding[] };
        setDomains(payload.domains);
      }
    }, 30_000);
    return () => clearInterval(interval);
  }, [autoPollEnabled, domains, locale]);

  async function refresh() {
    const res = await fetch(`/api/builder/domains?locale=${encodeURIComponent(locale)}`, { credentials: 'same-origin' });
    const payload = (await res.json().catch(() => ({}))) as { domains?: DomainBinding[]; error?: string };
    if (!res.ok) {
      if (payload.error) {
        setMessageTone('error');
        setMessage(payload.error);
      }
      return;
    }
    if (!payload.domains) return;
    setDomains(payload.domains);
  }

  async function register() {
    if (!newDomain.trim()) return;
    setBusy(true);
    setMessage('');
    setMessageTone('success');
    try {
      const res = await fetch(`/api/builder/domains?locale=${encodeURIComponent(locale)}`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: newDomain.trim().toLowerCase() }),
      });
      if (!res.ok) {
        const payload = (await res.json().catch(() => ({}))) as { error?: string };
        setMessageTone('error');
        setMessage(copy.registerError(payload.error ?? res.statusText));
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
    setMessageTone('success');
    try {
      const res = await fetch(`/api/builder/domains/${encodeURIComponent(binding.domain)}/verify?locale=${encodeURIComponent(locale)}`, {
        method: 'POST',
        credentials: 'same-origin',
      });
      const payload = (await res.json().catch(() => ({}))) as { ok?: boolean; domain?: DomainBinding; dns?: { txtMatched: boolean; cnameMatched: boolean }; error?: string };
      if (payload.domain) {
        setDomains((curr) => curr.map((d) => (d.domainId === binding.domainId ? payload.domain! : d)));
      }
      if (payload.ok) {
        setMessageTone('success');
        setMessage(copy.verifySuccess(binding.domain));
      } else {
        const missing: string[] = [];
        if (payload.dns && !payload.dns.txtMatched) missing.push('TXT');
        if (payload.dns && !payload.dns.cnameMatched) missing.push('CNAME/A');
        setMessageTone('error');
        setMessage(missing.length > 0 ? `${copy.missing} ${missing.join(', ')}` : payload.error || copy.verifyFailed);
      }
    } finally {
      setVerifyingId(null);
    }
  }

  async function remove(binding: DomainBinding) {
    if (!window.confirm(copy.removeConfirm(binding.domain))) return;
    const res = await fetch(`/api/builder/domains/${encodeURIComponent(binding.domain)}?locale=${encodeURIComponent(locale)}`, {
      method: 'DELETE',
      credentials: 'same-origin',
    });
    if (!res.ok) {
      const payload = (await res.json().catch(() => ({}))) as { error?: string };
      setMessageTone('error');
      setMessage(payload.error || copy.verifyFailed);
      return;
    }
    await refresh();
  }

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          placeholder={copy.placeholder}
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
          {copy.register}
        </button>
      </div>
      {message ? <div style={{ fontSize: 12, color: messageTone === 'success' ? '#16a34a' : '#dc2626' }}>{message}</div> : null}

      <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#475569' }}>
        <input type="checkbox" checked={autoPollEnabled} onChange={(e) => setAutoPollEnabled(e.target.checked)} />
        {copy.autoPoll}
      </label>

      {domains.map((binding) => (
        <div
          key={binding.domainId}
          style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <strong style={{ fontSize: 15 }}>{binding.domain}</strong>
            <span style={{ padding: '2px 8px', borderRadius: 999, background: `${STATUS_COLOR[binding.status]}22`, color: STATUS_COLOR[binding.status], fontSize: 11, fontWeight: 700 }}>
              {copy.status[binding.status]}
            </span>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
              <button type="button" disabled={verifyingId === binding.domainId} onClick={() => verify(binding)} style={{ padding: '4px 10px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 6, fontSize: 11, cursor: verifyingId === binding.domainId ? 'not-allowed' : 'pointer' }}>
                {verifyingId === binding.domainId ? copy.verifying : copy.verify}
              </button>
              <button type="button" onClick={() => remove(binding)} style={{ padding: '4px 10px', border: '1px solid #fecaca', background: '#fff', color: '#b91c1c', borderRadius: 6, fontSize: 11, cursor: 'pointer' }}>
                {copy.remove}
              </button>
            </div>
          </div>

          {binding.status === 'pending-dns' || binding.status === 'error' ? (
            <div style={{ fontSize: 12, color: '#475569', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: 10, fontFamily: 'ui-monospace, Menlo, monospace' }}>
              <div>{copy.txt}</div>
              <div style={{ paddingLeft: 16 }}>
                Name: <strong>_vercel.{binding.domain}</strong>
                <br />
                Value: <strong style={{ userSelect: 'all' }}>{binding.verificationToken}</strong>
              </div>
              <div style={{ marginTop: 6 }}>{copy.cname}</div>
              <div style={{ paddingLeft: 16 }}>
                Name: <strong>{binding.domain}</strong>
                <br />
                Value: <strong>{binding.cnameTarget}</strong>
              </div>
              {binding.lastError ? <div style={{ marginTop: 6, color: '#b91c1c' }}>{copy.lastError} {binding.lastError}</div> : null}
            </div>
          ) : null}

          {binding.status === 'active' ? (
            <div style={{ fontSize: 12, color: '#15803d' }}>
              ✓ {copy.activeVerified(binding.lastVerifiedAt)} · {copy.ssl}
            </div>
          ) : null}
        </div>
      ))}

      {domains.length === 0 ? (
        <div style={{ padding: 24, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
          {copy.empty}
        </div>
      ) : null}
    </div>
  );
}
