'use client';

import { useEffect, useState } from 'react';
import type { Campaign } from '@/lib/builder/marketing/campaign-types';
import type { EmailTemplate } from '@/lib/builder/marketing/templates/types';
import type { Locale } from '@/lib/locales';

interface Props {
  campaign: Campaign;
}

interface TemplateSummary {
  templateId: string;
  name: string;
  category?: string;
}

type LocaleKey = Locale;
const LOCALE_LABEL: Record<LocaleKey, string> = { ko: '한국어', 'zh-hant': '繁體中文', en: 'English' };

export default function CampaignEditor({ campaign }: Props) {
  const [form, setForm] = useState({
    name: campaign.name,
    fromName: campaign.fromName,
    fromAddress: campaign.fromAddress,
    segmentTags: campaign.segmentTags.join(', '),
    subject: { ...campaign.subject },
    bodyHtml: { ...campaign.bodyHtml },
    bodyText: { ...campaign.bodyText },
    scheduledAt: campaign.scheduledAt ?? '',
  });
  const [activeLocale, setActiveLocale] = useState<LocaleKey>('ko');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [templates, setTemplates] = useState<TemplateSummary[]>([]);
  const [applyingTemplateId, setApplyingTemplateId] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch('/api/builder/marketing/templates', { credentials: 'same-origin' });
      if (!res.ok || cancelled) return;
      const payload = (await res.json()) as { templates: TemplateSummary[] };
      setTemplates(payload.templates);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function applyTemplate(templateId: string) {
    if (!templateId) return;
    setApplyingTemplateId(templateId);
    setMessage('');
    try {
      const res = await fetch(`/api/builder/marketing/templates/${templateId}?render=html`, {
        credentials: 'same-origin',
      });
      if (!res.ok) {
        const payload = (await res.json().catch(() => ({}))) as { error?: string };
        setMessage(`템플릿 적용 실패: ${payload.error ?? res.statusText}`);
        return;
      }
      const payload = (await res.json()) as { template: EmailTemplate; html: string; text: string };
      setForm((f) => ({
        ...f,
        bodyHtml: { ko: payload.html, 'zh-hant': payload.html, en: payload.html },
        bodyText: { ko: payload.text, 'zh-hant': payload.text, en: payload.text },
      }));
      setMessage(`템플릿 "${payload.template.name}" 적용 — 로케일별 본문 수정 필요`);
    } finally {
      setApplyingTemplateId('');
    }
  }

  function setSubjectFor(locale: LocaleKey, value: string) {
    setForm((f) => ({ ...f, subject: { ...f.subject, [locale]: value } }));
  }
  function setBodyHtmlFor(locale: LocaleKey, value: string) {
    setForm((f) => ({ ...f, bodyHtml: { ...f.bodyHtml, [locale]: value } }));
  }
  function setBodyTextFor(locale: LocaleKey, value: string) {
    setForm((f) => ({ ...f, bodyText: { ...f.bodyText, [locale]: value } }));
  }

  async function save() {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch(`/api/builder/marketing/campaigns/${campaign.campaignId}`, {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          fromName: form.fromName,
          fromAddress: form.fromAddress,
          segmentTags: form.segmentTags.split(',').map((s) => s.trim()).filter(Boolean),
          subject: form.subject,
          bodyHtml: form.bodyHtml,
          bodyText: form.bodyText,
          ...(form.scheduledAt ? { scheduledAt: new Date(form.scheduledAt).toISOString() } : {}),
        }),
      });
      if (!res.ok) {
        const payload = (await res.json().catch(() => ({}))) as { error?: string };
        setMessage(`저장 실패: ${payload.error ?? res.statusText}`);
      } else {
        setMessage('저장 완료');
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {(Object.keys(LOCALE_LABEL) as LocaleKey[]).map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => setActiveLocale(loc)}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                border: '1px solid #cbd5e1',
                background: activeLocale === loc ? '#0f172a' : '#fff',
                color: activeLocale === loc ? '#fff' : '#475569',
                fontWeight: 700,
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              {LOCALE_LABEL[loc]}
            </button>
          ))}
        </div>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12 }}>
          제목 ({LOCALE_LABEL[activeLocale]})
          <input
            type="text"
            value={form.subject[activeLocale]}
            onChange={(e) => setSubjectFor(activeLocale, e.target.value)}
            style={{ padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 14 }}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12 }}>
          본문 HTML ({LOCALE_LABEL[activeLocale]})
          <textarea
            rows={18}
            value={form.bodyHtml[activeLocale]}
            onChange={(e) => setBodyHtmlFor(activeLocale, e.target.value)}
            style={{ padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 12, fontFamily: 'ui-monospace, Menlo, monospace', resize: 'vertical' }}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12 }}>
          본문 텍스트 ({LOCALE_LABEL[activeLocale]})
          <textarea
            rows={6}
            value={form.bodyText[activeLocale]}
            onChange={(e) => setBodyTextFor(activeLocale, e.target.value)}
            style={{ padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 12, resize: 'vertical' }}
          />
        </label>
      </div>

      <aside style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <strong style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase' }}>설정</strong>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12 }}>
          캠페인 이름
          <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: 6 }} />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12 }}>
          발신자 이름
          <input type="text" value={form.fromName} onChange={(e) => setForm((f) => ({ ...f, fromName: e.target.value }))} style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: 6 }} />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12 }}>
          발신자 주소
          <input type="email" value={form.fromAddress} onChange={(e) => setForm((f) => ({ ...f, fromAddress: e.target.value }))} style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: 6 }} />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12 }}>
          세그먼트 태그 (쉼표 구분; 비우면 전체)
          <input type="text" value={form.segmentTags} onChange={(e) => setForm((f) => ({ ...f, segmentTags: e.target.value }))} style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: 6 }} />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12 }}>
          예약 발송
          <input type="datetime-local" value={form.scheduledAt ? form.scheduledAt.slice(0, 16) : ''} onChange={(e) => setForm((f) => ({ ...f, scheduledAt: e.target.value }))} style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: 6 }} />
        </label>

        <button type="button" disabled={saving} onClick={save} style={{ marginTop: 8, padding: '10px 16px', border: 0, background: saving ? '#94a3b8' : '#0f172a', color: '#fff', borderRadius: 8, cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 700 }}>
          {saving ? '저장 중...' : '저장'}
        </button>
        {message ? <div style={{ fontSize: 12, color: message.includes('실패') ? '#dc2626' : '#16a34a' }}>{message}</div> : null}

        <hr style={{ border: 0, borderTop: '1px solid #e2e8f0', margin: '8px 0' }} />
        <strong style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>템플릿 적용</strong>
        <select
          value=""
          onChange={(e) => applyTemplate(e.target.value)}
          disabled={Boolean(applyingTemplateId)}
          style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 12 }}
        >
          <option value="">— 템플릿 선택 —</option>
          {templates.map((t) => (
            <option key={t.templateId} value={t.templateId}>
              {t.name}{t.category ? ` (${t.category})` : ''}
            </option>
          ))}
        </select>
        <span style={{ fontSize: 10, color: '#94a3b8' }}>
          선택한 템플릿의 HTML/텍스트가 모든 로케일에 적용됩니다. 로케일별로 수정하세요.
        </span>

        <hr style={{ border: 0, borderTop: '1px solid #e2e8f0', margin: '8px 0' }} />
        <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.5 }}>
          상태: <strong>{campaign.status}</strong>
          <br />
          수신: {campaign.stats.recipients} · 오픈: {campaign.stats.opens} · 클릭: {campaign.stats.clicks}
        </div>
      </aside>
    </div>
  );
}
