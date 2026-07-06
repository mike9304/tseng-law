'use client';

import type { Campaign } from '@/lib/builder/marketing/campaign-types';
import type { Locale } from '@/lib/locales';
import { CampaignAnalyticsPanel } from './CampaignAnalyticsPanel';
import type { CampaignAnalyticsStatsPayload } from './campaign-analytics-payload';
import type { CampaignEditorCopy } from './campaign-editor-copy';

export type TemplateSummary = {
  readonly templateId: string;
  readonly name: string;
  readonly category?: string;
};

export type CampaignEditorFormState = {
  readonly name: string;
  readonly fromName: string;
  readonly fromAddress: string;
  readonly segmentTags: string;
  readonly subject: Campaign['subject'];
  readonly bodyHtml: Campaign['bodyHtml'];
  readonly bodyText: Campaign['bodyText'];
  readonly scheduledAt: string;
};

export type CampaignEditorMessage = {
  readonly kind: 'success' | 'error';
  readonly text: string;
};

export type CampaignEditorFormPatch = Partial<
  Pick<CampaignEditorFormState, 'name' | 'fromName' | 'fromAddress' | 'segmentTags' | 'scheduledAt'>
>;

type Props = {
  readonly campaign: Campaign;
  readonly locale: Locale;
  readonly text: CampaignEditorCopy;
  readonly form: CampaignEditorFormState;
  readonly saving: boolean;
  readonly message: CampaignEditorMessage | null;
  readonly templates: readonly TemplateSummary[];
  readonly applyingTemplateId: string;
  readonly initialAnalyticsPayload?: CampaignAnalyticsStatsPayload;
  readonly onFormPatch: (patch: CampaignEditorFormPatch) => void;
  readonly onSave: () => void;
  readonly onApplyTemplate: (templateId: string) => void | Promise<void>;
};

const inputStyle = {
  padding: '6px 10px',
  border: '1px solid #cbd5e1',
  borderRadius: 6,
} as const;

const labelStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  fontSize: 12,
} as const;

export function CampaignEditorSidebar({
  campaign,
  locale,
  text,
  form,
  saving,
  message,
  templates,
  applyingTemplateId,
  initialAnalyticsPayload,
  onFormPatch,
  onSave,
  onApplyTemplate,
}: Props) {
  return (
    <aside style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: '0 1 320px', minWidth: 280 }}>
      <strong style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase' }}>{text.settings}</strong>

      <label style={labelStyle}>
        {text.campaignName}
        <input type="text" value={form.name} onChange={(event) => onFormPatch({ name: event.target.value })} style={inputStyle} />
      </label>
      <label style={labelStyle}>
        {text.fromName}
        <input type="text" value={form.fromName} onChange={(event) => onFormPatch({ fromName: event.target.value })} style={inputStyle} />
      </label>
      <label style={labelStyle}>
        {text.fromAddress}
        <input type="email" value={form.fromAddress} onChange={(event) => onFormPatch({ fromAddress: event.target.value })} style={inputStyle} />
      </label>
      <label style={labelStyle}>
        {text.segmentTags}
        <input type="text" value={form.segmentTags} onChange={(event) => onFormPatch({ segmentTags: event.target.value })} style={inputStyle} />
      </label>
      <label style={labelStyle}>
        {text.scheduledAt}
        <input
          type="datetime-local"
          value={form.scheduledAt ? form.scheduledAt.slice(0, 16) : ''}
          onChange={(event) => onFormPatch({ scheduledAt: event.target.value })}
          style={inputStyle}
        />
      </label>

      <button
        type="button"
        disabled={saving}
        onClick={onSave}
        style={{
          marginTop: 8,
          padding: '10px 16px',
          border: 0,
          background: saving ? '#94a3b8' : '#0f172a',
          color: '#fff',
          borderRadius: 8,
          cursor: saving ? 'not-allowed' : 'pointer',
          fontWeight: 700,
        }}
      >
        {saving ? text.saving : text.save}
      </button>
      {message ? (
        <div style={{ fontSize: 12, color: message.kind === 'error' ? '#dc2626' : '#16a34a' }}>
          {message.text}
        </div>
      ) : null}

      <hr style={{ border: 0, borderTop: '1px solid #e2e8f0', margin: '8px 0' }} />
      <strong style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>{text.templateSection}</strong>
      <select
        value=""
        onChange={(event) => void onApplyTemplate(event.target.value)}
        disabled={Boolean(applyingTemplateId)}
        style={{ ...inputStyle, fontSize: 12 }}
      >
        <option value="">{text.templateSelect}</option>
        {templates.map((template) => (
          <option key={template.templateId} value={template.templateId}>
            {template.name}{template.category ? ` (${template.category})` : ''}
          </option>
        ))}
      </select>
      <span style={{ fontSize: 10, color: '#94a3b8' }}>{text.templateHint}</span>

      <hr style={{ border: 0, borderTop: '1px solid #e2e8f0', margin: '8px 0' }} />
      <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.5 }}>
        {text.statusLabel}: <strong>{text.statusLabels[campaign.status]}</strong>
        <br />
        {text.recipientsLabel}: {campaign.stats.recipients} · {text.opensLabel}: {campaign.stats.opens} · {text.clicksLabel}: {campaign.stats.clicks}
      </div>

      <hr style={{ border: 0, borderTop: '1px solid #e2e8f0', margin: '8px 0' }} />
      <CampaignAnalyticsPanel campaign={campaign} locale={locale} initialPayload={initialAnalyticsPayload} />
    </aside>
  );
}
