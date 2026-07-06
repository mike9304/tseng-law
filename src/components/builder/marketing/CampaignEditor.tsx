'use client';

import { useEffect, useState } from 'react';
import { z } from 'zod';
import type { Campaign } from '@/lib/builder/marketing/campaign-types';
import type { Locale } from '@/lib/locales';
import {
  CampaignEditorSidebar,
  type CampaignEditorFormPatch,
  type CampaignEditorFormState,
  type CampaignEditorMessage,
  type TemplateSummary,
} from './CampaignEditorSidebar';
import { CAMPAIGN_EDITOR_COPY, LOCALE_KEYS, LOCALE_LABEL } from './campaign-editor-copy';
import { localizedMarketingApiPath } from './marketing-api-path';

interface Props {
  campaign: Campaign;
  locale?: Locale;
}

const templateSummarySchema = z.object({
  templateId: z.string(),
  name: z.string(),
  category: z.string().optional(),
});

const templateListSchema = z.object({
  templates: z.array(templateSummarySchema),
});

const renderedTemplateSchema = z.object({
  template: z.object({ name: z.string() }),
  html: z.string(),
  text: z.string(),
});

const errorPayloadSchema = z.object({
  error: z.string().optional(),
});

async function readErrorReason(response: Response): Promise<string | null> {
  try {
    const raw: unknown = await response.json();
    const parsed = errorPayloadSchema.safeParse(raw);
    return parsed.success ? parsed.data.error ?? null : null;
  } catch (error) {
    if (error instanceof Error) return null;
    throw error;
  }
}

export default function CampaignEditor({ campaign, locale = 'ko' }: Props) {
  const text = CAMPAIGN_EDITOR_COPY[locale];
  const [form, setForm] = useState<CampaignEditorFormState>({
    name: campaign.name,
    fromName: campaign.fromName,
    fromAddress: campaign.fromAddress,
    segmentTags: campaign.segmentTags.join(', '),
    subject: { ...campaign.subject },
    bodyHtml: { ...campaign.bodyHtml },
    bodyText: { ...campaign.bodyText },
    scheduledAt: campaign.scheduledAt ?? '',
  });
  const [activeLocale, setActiveLocale] = useState<Locale>('ko');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<CampaignEditorMessage | null>(null);
  const [templates, setTemplates] = useState<TemplateSummary[]>([]);
  const [applyingTemplateId, setApplyingTemplateId] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadTemplates(): Promise<void> {
      try {
        const res = await fetch(localizedMarketingApiPath(locale, '/api/builder/marketing/templates'), {
          credentials: 'same-origin',
        });
        if (!res.ok || cancelled) return;
        const raw: unknown = await res.json();
        const parsed = templateListSchema.safeParse(raw);
        if (parsed.success && !cancelled) setTemplates(parsed.data.templates);
      } catch (error) {
        if (error instanceof Error) return;
        throw error;
      }
    }

    void loadTemplates();
    return () => {
      cancelled = true;
    };
  }, [locale]);

  async function applyTemplate(templateId: string) {
    if (!templateId) return;
    setApplyingTemplateId(templateId);
    setMessage(null);
    try {
      const res = await fetch(localizedMarketingApiPath(locale, `/api/builder/marketing/templates/${templateId}?render=html`), {
        credentials: 'same-origin',
      });
      if (!res.ok) {
        const reason = await readErrorReason(res);
        setMessage({ kind: 'error', text: text.templateApplyFailed(reason ?? text.requestFailed) });
        return;
      }
      const raw: unknown = await res.json();
      const parsed = renderedTemplateSchema.safeParse(raw);
      if (!parsed.success) {
        setMessage({ kind: 'error', text: text.templateApplyFailed(text.requestFailed) });
        return;
      }
      const payload = parsed.data;
      setForm((f) => ({
        ...f,
        bodyHtml: { ko: payload.html, 'zh-hant': payload.html, en: payload.html },
        bodyText: { ko: payload.text, 'zh-hant': payload.text, en: payload.text },
      }));
      setMessage({ kind: 'success', text: text.templateApplied(payload.template.name) });
    } finally {
      setApplyingTemplateId('');
    }
  }

  function setSubjectFor(targetLocale: Locale, value: string) {
    setForm((f) => ({ ...f, subject: { ...f.subject, [targetLocale]: value } }));
  }
  function setBodyHtmlFor(targetLocale: Locale, value: string) {
    setForm((f) => ({ ...f, bodyHtml: { ...f.bodyHtml, [targetLocale]: value } }));
  }
  function setBodyTextFor(targetLocale: Locale, value: string) {
    setForm((f) => ({ ...f, bodyText: { ...f.bodyText, [targetLocale]: value } }));
  }

  function patchForm(patch: CampaignEditorFormPatch) {
    setForm((current) => ({ ...current, ...patch }));
  }

  async function save() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(localizedMarketingApiPath(locale, `/api/builder/marketing/campaigns/${campaign.campaignId}`), {
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
        const reason = await readErrorReason(res);
        setMessage({ kind: 'error', text: text.saveFailed(reason ?? text.requestFailed) });
      } else {
        setMessage({ kind: 'success', text: text.saveSuccess });
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ padding: 24, display: 'flex', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: '1 1 560px', minWidth: 280 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {LOCALE_KEYS.map((loc) => (
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
          {text.subjectLabel} ({LOCALE_LABEL[activeLocale]})
          <input
            type="text"
            value={form.subject[activeLocale]}
            onChange={(e) => setSubjectFor(activeLocale, e.target.value)}
            style={{ padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 14 }}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12 }}>
          {text.bodyHtmlLabel} ({LOCALE_LABEL[activeLocale]})
          <textarea
            rows={18}
            value={form.bodyHtml[activeLocale]}
            onChange={(e) => setBodyHtmlFor(activeLocale, e.target.value)}
            style={{ padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 12, fontFamily: 'ui-monospace, Menlo, monospace', resize: 'vertical' }}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12 }}>
          {text.bodyTextLabel} ({LOCALE_LABEL[activeLocale]})
          <textarea
            rows={6}
            value={form.bodyText[activeLocale]}
            onChange={(e) => setBodyTextFor(activeLocale, e.target.value)}
            style={{ padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 12, resize: 'vertical' }}
          />
        </label>
      </div>

      <CampaignEditorSidebar
        campaign={campaign}
        locale={locale}
        text={text}
        form={form}
        saving={saving}
        message={message}
        templates={templates}
        applyingTemplateId={applyingTemplateId}
        onFormPatch={patchForm}
        onSave={save}
        onApplyTemplate={applyTemplate}
      />
    </div>
  );
}
