'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Campaign } from '@/lib/builder/marketing/campaign-types';
import type { Locale } from '@/lib/locales';

interface Props {
  initialCampaigns: Campaign[];
  locale: Locale;
}

const copy = {
  ko: {
    create: '+ 새 캠페인',
    namePlaceholder: '캠페인 이름',
    subjectPlaceholder: '제목',
    bodyPlaceholder: '본문 HTML (한국어 기준; 다국어는 편집 페이지에서 보강)',
    cancel: '취소',
    saveDraft: '저장 (draft)',
    name: '이름',
    status: '상태',
    segment: '세그먼트',
    metrics: '발송 / 오픈 / 클릭',
    actions: '작업',
    noCampaigns: '캠페인이 없습니다.',
    test: '테스트',
    send: '발송',
    all: '전체',
    failed: '실패',
    sendFailure: '발송 실패',
    testPrompt: '테스트 메일 받을 주소',
    batchConfirm: '실제 배치 발송을 진행하시겠습니까?',
    batchSuccess: (succeeded: number, remaining: number) => `발송 완료: 성공 ${succeeded} / 잔여 ${remaining}`,
    batchPartial: (succeeded: number, failed: number, remaining: number) => `부분 발송: 성공 ${succeeded} / 실패 ${failed} / 잔여 ${remaining}`,
    batchAllFailed: (failed: number, remaining: number) => `발송 실패: ${failed}건 실패 / 잔여 ${remaining}`,
    testSuccess: '테스트 메일 발송 완료',
    testFailure: '테스트 메일 실패',
    statusLabels: {
      draft: '초안',
      scheduled: '예약',
      sending: '발송중',
      sent: '발송완료',
      failed: '실패',
      partial: '부분발송',
    },
  },
  'zh-hant': {
    create: '+ 新活動',
    namePlaceholder: '活動名稱',
    subjectPlaceholder: '主旨',
    bodyPlaceholder: 'HTML 內文（以韓文為主；多語請在編輯頁補強）',
    cancel: '取消',
    saveDraft: '儲存 (draft)',
    name: '名稱',
    status: '狀態',
    segment: '區隔',
    metrics: '發送 / 開啟 / 點擊',
    actions: '操作',
    noCampaigns: '沒有活動。',
    test: '測試',
    send: '發送',
    all: '全部',
    failed: '失敗',
    sendFailure: '發送失敗',
    testPrompt: '測試郵件收件地址',
    batchConfirm: '是否要執行實際批次發送？',
    batchSuccess: (succeeded: number, remaining: number) => `發送完成：成功 ${succeeded} / 剩餘 ${remaining}`,
    batchPartial: (succeeded: number, failed: number, remaining: number) => `部分發送：成功 ${succeeded} / 失敗 ${failed} / 剩餘 ${remaining}`,
    batchAllFailed: (failed: number, remaining: number) => `發送失敗：${failed} 筆失敗 / 剩餘 ${remaining}`,
    testSuccess: '測試郵件發送完成',
    testFailure: '測試郵件失敗',
    statusLabels: {
      draft: '草稿',
      scheduled: '排程',
      sending: '發送中',
      sent: '已發送',
      failed: '失敗',
      partial: '部分發送',
    },
  },
  en: {
    create: '+ New campaign',
    namePlaceholder: 'Campaign name',
    subjectPlaceholder: 'Subject',
    bodyPlaceholder: 'Body HTML (Korean baseline; enrich per locale in the editor)',
    cancel: 'Cancel',
    saveDraft: 'Save (draft)',
    name: 'Name',
    status: 'Status',
    segment: 'Segment',
    metrics: 'Send / open / click',
    actions: 'Actions',
    noCampaigns: 'No campaigns.',
    test: 'Test',
    send: 'Send',
    all: 'All',
    failed: 'Failed',
    sendFailure: 'Send failed',
    testPrompt: 'Test recipient email',
    batchConfirm: 'Send the real batch now?',
    batchSuccess: (succeeded: number, remaining: number) => `Send complete: ${succeeded} succeeded / ${remaining} remaining`,
    batchPartial: (succeeded: number, failed: number, remaining: number) => `Partial send: ${succeeded} succeeded / ${failed} failed / ${remaining} remaining`,
    batchAllFailed: (failed: number, remaining: number) => `Send failed: ${failed} failed / ${remaining} remaining`,
    testSuccess: 'Test email sent',
    testFailure: 'Test email failed',
    statusLabels: {
      draft: 'Draft',
      scheduled: 'Scheduled',
      sending: 'Sending',
      sent: 'Sent',
      failed: 'Failed',
      partial: 'Partial',
    },
  },
};

const STATUS_COLOR: Record<Campaign['status'], string> = {
  draft: '#94a3b8',
  scheduled: '#0ea5e9',
  sending: '#f59e0b',
  sent: '#16a34a',
  failed: '#dc2626',
  partial: '#ea580c',
};

export type CampaignsAdminCopy = typeof copy['ko'];

function localizedMarketingApiPath(locale: Locale, path: string): string {
  if (locale === 'ko') return path;
  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}locale=${locale}`;
}

/** Pure selection of the operator alert from the batch/test response semantics.
 * The route keeps HTTP 200 even when delivery failed, so the UI must inspect the
 * JSON body (ok / counts) rather than res.ok alone. Returns null only when no
 * alert should be shown (handled by the caller before fetching). */
export function resolveCampaignSendAlert(
  mode: 'test' | 'batch',
  responseOk: boolean,
  payload: { ok?: boolean; error?: string; succeeded?: number; failed?: number; remaining?: number },
  text: CampaignsAdminCopy,
): string {
  if (!responseOk) {
    return payload.error || text.sendFailure;
  }
  if (mode === 'test') {
    return payload.ok ? text.testSuccess : text.testFailure;
  }
  const succeeded = payload.succeeded ?? 0;
  const failed = payload.failed ?? 0;
  const remaining = payload.remaining ?? 0;
  if (payload.ok) {
    return text.batchSuccess(succeeded, remaining);
  }
  const base =
    succeeded > 0
      ? text.batchPartial(succeeded, failed, remaining)
      : text.batchAllFailed(failed, remaining);
  return payload.error ? `${base}\n${payload.error}` : base;
}

export interface RunSendCampaignDeps {
  mode: 'test' | 'batch';
  campaignId: string;
  locale: Locale;
  text: CampaignsAdminCopy;
  fetchImpl?: typeof fetch;
  promptImpl?: (message: string) => string | null;
  confirmImpl?: (message: string) => boolean;
  alertImpl?: (message: string) => void;
}

/** Browser-gated send flow. Dependencies are injectable so the UI branch can be
 * exercised with mocked fetch/alert/prompt/confirm instead of a live DOM. */
export async function runSendCampaign(deps: RunSendCampaignDeps): Promise<void> {
  const fetchImpl = deps.fetchImpl ?? fetch;
  const promptImpl = deps.promptImpl ?? ((message: string) => window.prompt(message));
  const confirmImpl = deps.confirmImpl ?? ((message: string) => window.confirm(message));
  const alertImpl = deps.alertImpl ?? ((message: string) => window.alert(message));

  const testEmail = deps.mode === 'test' ? promptImpl(deps.text.testPrompt) ?? '' : '';
  if (deps.mode === 'test' && !testEmail.trim()) return;
  if (deps.mode === 'batch' && !confirmImpl(deps.text.batchConfirm)) return;

  const res = await fetchImpl(
    localizedMarketingApiPath(deps.locale, `/api/builder/marketing/campaigns/${deps.campaignId}/send`),
    {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deps.mode === 'test' ? { testEmail: testEmail.trim() } : { batchSize: 50 }),
    },
  );
  const payload = (await res.json().catch(() => ({}))) as {
    ok?: boolean;
    error?: string;
    succeeded?: number;
    failed?: number;
    remaining?: number;
  };
  alertImpl(resolveCampaignSendAlert(deps.mode, res.ok, payload, deps.text));
}

export default function CampaignsAdmin({ initialCampaigns, locale }: Props) {
  const text = copy[locale];
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
      const res = await fetch(localizedMarketingApiPath(locale, '/api/builder/marketing/campaigns'), {
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
        setError(payload.error || text.failed);
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
    await runSendCampaign({ mode, campaignId, locale, text });
  }

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex' }}>
        <button
          type="button"
          onClick={() => setShowCreate((v) => !v)}
          style={{ marginLeft: 'auto', padding: '6px 12px', border: 0, background: '#0f172a', color: '#fff', borderRadius: 6, fontSize: 13, cursor: 'pointer', fontWeight: 700 }}
        >
          {text.create}
        </button>
      </div>

      {showCreate ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 16, border: '1px solid #e2e8f0', borderRadius: 8, background: '#f8fafc' }}>
          <input
            type="text"
            placeholder={text.namePlaceholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }}
          />
          <input
            type="text"
            placeholder={text.subjectPlaceholder}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }}
          />
          <textarea
            placeholder={text.bodyPlaceholder}
            value={body}
            rows={8}
            onChange={(e) => setBody(e.target.value)}
            style={{ padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 12, fontFamily: 'ui-monospace, Menlo, monospace', resize: 'vertical' }}
          />
          {error ? <div style={{ color: '#dc2626', fontSize: 12 }}>{error}</div> : null}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setShowCreate(false)} style={{ padding: '6px 12px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}>
              {text.cancel}
            </button>
            <button type="button" disabled={busy} onClick={createDraft} style={{ padding: '6px 12px', border: 0, background: busy ? '#94a3b8' : '#16a34a', color: '#fff', borderRadius: 6, fontSize: 13, cursor: busy ? 'not-allowed' : 'pointer', fontWeight: 700 }}>
              {text.saveDraft}
            </button>
          </div>
        </div>
      ) : null}

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
            <th style={{ padding: '8px 12px' }}>{text.name}</th>
            <th style={{ padding: '8px 12px' }}>{text.status}</th>
            <th style={{ padding: '8px 12px' }}>{text.segment}</th>
            <th style={{ padding: '8px 12px' }}>{text.metrics}</th>
            <th style={{ padding: '8px 12px' }}>{text.actions}</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>
                {text.noCampaigns}
              </td>
            </tr>
          ) : (
            campaigns.map((c) => (
              <tr key={c.campaignId} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '8px 12px' }}>
                  <Link href={`/${locale}/admin-builder/marketing/campaigns/${c.campaignId}/edit`} style={{ color: '#0f172a', fontWeight: 700, textDecoration: 'none' }}>
                    {c.name}
                  </Link>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>{c.subject[locale] ?? c.subject.ko}</div>
                </td>
                <td style={{ padding: '8px 12px' }}>
                  <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 999, background: `${STATUS_COLOR[c.status]}22`, color: STATUS_COLOR[c.status], fontWeight: 700, fontSize: 11 }}>
                    {text.statusLabels[c.status]}
                  </span>
                </td>
                <td style={{ padding: '8px 12px' }}>{c.segmentTags.length === 0 ? text.all : c.segmentTags.join(', ')}</td>
                <td style={{ padding: '8px 12px' }}>
                  {c.stats.recipients} / {c.stats.opens} / {c.stats.clicks}
                </td>
                <td style={{ padding: '8px 12px', display: 'flex', gap: 6 }}>
                  <button type="button" onClick={() => sendCampaign(c.campaignId, 'test')} style={{ padding: '4px 8px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}>
                    {text.test}
                  </button>
                  <button type="button" disabled={c.status === 'sent' || c.status === 'sending'} onClick={() => sendCampaign(c.campaignId, 'batch')} style={{ padding: '4px 8px', border: 0, background: c.status === 'sent' || c.status === 'sending' ? '#94a3b8' : '#0f172a', color: '#fff', borderRadius: 4, fontSize: 11, cursor: c.status === 'sent' || c.status === 'sending' ? 'not-allowed' : 'pointer', fontWeight: 700 }}>
                    {text.send}
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
