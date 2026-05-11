'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Campaign } from '@/lib/builder/marketing/campaign-types';
import type { Locale } from '@/lib/locales';

interface Props {
  initialCampaigns: Campaign[];
  locale: Locale;
}

const STATUS_LABEL: Record<Campaign['status'], string> = {
  draft: '초안',
  scheduled: '예약',
  sending: '발송중',
  sent: '발송완료',
  failed: '실패',
};
const STATUS_COLOR: Record<Campaign['status'], string> = {
  draft: '#94a3b8',
  scheduled: '#0ea5e9',
  sending: '#f59e0b',
  sent: '#16a34a',
  failed: '#dc2626',
};

export default function CampaignsAdmin({ initialCampaigns, locale }: Props) {
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function createDraft() {
    if (!name.trim() || !subject.trim() || !body.trim()) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/builder/marketing/campaigns', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          subject: { ko: subject.trim(), 'zh-hant': subject.trim(), en: subject.trim() },
          bodyHtml: { ko: body, 'zh-hant': body, en: body },
          bodyText: {
            ko: body.replace(/<[^>]+>/g, ''),
            'zh-hant': body.replace(/<[^>]+>/g, ''),
            en: body.replace(/<[^>]+>/g, ''),
          },
          segmentTags: [],
        }),
      });
      if (!res.ok) {
        const payload = (await res.json().catch(() => ({}))) as { error?: string };
        setError(payload.error || 'Failed');
        return;
      }
      const payload = (await res.json()) as { campaign: Campaign };
      setCampaigns((current) => [payload.campaign, ...current]);
      setShowCreate(false);
      setName('');
      setSubject('');
      setBody('');
    } finally {
      setBusy(false);
    }
  }

  async function sendCampaign(campaignId: string, mode: 'test' | 'batch') {
    const testEmail = mode === 'test' ? window.prompt('테스트 메일 받을 주소') ?? '' : '';
    if (mode === 'test' && !testEmail.trim()) return;
    if (mode === 'batch' && !window.confirm('실제 배치 발송을 진행하시겠습니까?')) return;
    const res = await fetch(`/api/builder/marketing/campaigns/${campaignId}/send`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mode === 'test' ? { testEmail: testEmail.trim() } : { batchSize: 50 }),
    });
    const payload = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; succeeded?: number; failed?: number; remaining?: number };
    if (!res.ok) {
      window.alert(payload.error || '발송 실패');
      return;
    }
    if (mode === 'test') {
      window.alert(payload.ok ? '테스트 메일 발송 완료' : '테스트 메일 실패');
    } else {
      window.alert(`발송: 성공 ${payload.succeeded ?? 0} / 실패 ${payload.failed ?? 0} / 잔여 ${payload.remaining ?? 0}`);
    }
  }

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex' }}>
        <button
          type="button"
          onClick={() => setShowCreate((v) => !v)}
          style={{ marginLeft: 'auto', padding: '6px 12px', border: 0, background: '#0f172a', color: '#fff', borderRadius: 6, fontSize: 13, cursor: 'pointer', fontWeight: 700 }}
        >
          + 새 캠페인
        </button>
      </div>

      {showCreate ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 16, border: '1px solid #e2e8f0', borderRadius: 8, background: '#f8fafc' }}>
          <input
            type="text"
            placeholder="캠페인 이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }}
          />
          <input
            type="text"
            placeholder="제목"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }}
          />
          <textarea
            placeholder="본문 HTML (한국어 기준; 다국어는 편집 페이지에서 보강)"
            value={body}
            rows={8}
            onChange={(e) => setBody(e.target.value)}
            style={{ padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 12, fontFamily: 'ui-monospace, Menlo, monospace', resize: 'vertical' }}
          />
          {error ? <div style={{ color: '#dc2626', fontSize: 12 }}>{error}</div> : null}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setShowCreate(false)} style={{ padding: '6px 12px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}>
              취소
            </button>
            <button type="button" disabled={busy} onClick={createDraft} style={{ padding: '6px 12px', border: 0, background: busy ? '#94a3b8' : '#16a34a', color: '#fff', borderRadius: 6, fontSize: 13, cursor: busy ? 'not-allowed' : 'pointer', fontWeight: 700 }}>
              저장 (draft)
            </button>
          </div>
        </div>
      ) : null}

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
            <th style={{ padding: '8px 12px' }}>이름</th>
            <th style={{ padding: '8px 12px' }}>상태</th>
            <th style={{ padding: '8px 12px' }}>세그먼트</th>
            <th style={{ padding: '8px 12px' }}>발송 / 오픈 / 클릭</th>
            <th style={{ padding: '8px 12px' }}>작업</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>
                캠페인이 없습니다.
              </td>
            </tr>
          ) : (
            campaigns.map((c) => (
              <tr key={c.campaignId} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '8px 12px' }}>
                  <Link href={`/${locale}/admin-builder/marketing/campaigns/${c.campaignId}/edit`} style={{ color: '#0f172a', fontWeight: 700, textDecoration: 'none' }}>
                    {c.name}
                  </Link>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>{c.subject.ko}</div>
                </td>
                <td style={{ padding: '8px 12px' }}>
                  <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 999, background: `${STATUS_COLOR[c.status]}22`, color: STATUS_COLOR[c.status], fontWeight: 700, fontSize: 11 }}>
                    {STATUS_LABEL[c.status]}
                  </span>
                </td>
                <td style={{ padding: '8px 12px' }}>{c.segmentTags.length === 0 ? '전체' : c.segmentTags.join(', ')}</td>
                <td style={{ padding: '8px 12px' }}>
                  {c.stats.recipients} / {c.stats.opens} / {c.stats.clicks}
                </td>
                <td style={{ padding: '8px 12px', display: 'flex', gap: 6 }}>
                  <button type="button" onClick={() => sendCampaign(c.campaignId, 'test')} style={{ padding: '4px 8px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}>
                    테스트
                  </button>
                  <button type="button" disabled={c.status === 'sent' || c.status === 'sending'} onClick={() => sendCampaign(c.campaignId, 'batch')} style={{ padding: '4px 8px', border: 0, background: c.status === 'sent' || c.status === 'sending' ? '#94a3b8' : '#0f172a', color: '#fff', borderRadius: 4, fontSize: 11, cursor: c.status === 'sent' || c.status === 'sending' ? 'not-allowed' : 'pointer', fontWeight: 700 }}>
                    발송
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
