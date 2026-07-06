'use client';

import { useState, type CSSProperties } from 'react';
import { z } from 'zod';
import type { BuilderCmsSlugConflictRule } from '@/lib/builder/cms-slug-conflict-rule';
import type { Locale } from '@/lib/locales';

type CmsDynamicItemScheduledPolicyControlsProps = {
  readonly busy: boolean;
  readonly locale: Locale;
  readonly siteId: string;
  readonly collectionId: string;
  readonly pageId: string;
  readonly policyName: string;
  readonly sourceFieldKey: string;
  readonly slugPattern: string;
  readonly slugConflictRule: BuilderCmsSlugConflictRule;
};

const scheduledPolicyResponseSchema = z.object({
  ok: z.boolean().optional(),
  error: z.string().optional(),
  issues: z.array(z.string()).optional(),
  job: z.object({
    status: z.string(),
    scheduledAt: z.string(),
  }).optional(),
});

export function CmsDynamicItemScheduledPolicyControls({
  busy,
  locale,
  siteId,
  collectionId,
  pageId,
  policyName,
  sourceFieldKey,
  slugPattern,
  slugConflictRule,
}: CmsDynamicItemScheduledPolicyControlsProps) {
  const [scheduledAt, setScheduledAt] = useState('');
  const [scheduling, setScheduling] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function schedulePolicy() {
    setScheduling(true);
    setStatus(null);
    setError(null);
    try {
      const scheduledTimestamp = Date.parse(scheduledAt);
      if (!Number.isFinite(scheduledTimestamp)) {
        throw new Error('Enter a valid schedule time.');
      }
      const scheduledIso = new Date(scheduledTimestamp).toISOString();
      const params = new URLSearchParams({ locale });
      const response = await fetch(
        `/api/builder/sites/${encodeURIComponent(siteId)}/collections/${encodeURIComponent(collectionId)}/dynamic-item-route-policies/${encodeURIComponent(pageId)}/schedule?${params.toString()}`,
        {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            kind: 'prepare-public-routes',
            scheduledAt: scheduledIso,
            policyName,
            sourceFieldKey,
            slugPattern,
            slugConflictRule,
          }),
        },
      );
      const parsed = scheduledPolicyResponseSchema.safeParse(await response.json());
      if (!parsed.success) {
        throw new Error('Unexpected dynamic item scheduled policy response.');
      }
      if (!response.ok || !parsed.data.ok) {
        throw new Error(parsed.data.issues?.join('\n') ?? parsed.data.error ?? 'Failed to schedule route policy.');
      }
      const nextScheduledAt = parsed.data.job?.scheduledAt ?? scheduledIso;
      setStatus(`Scheduled Prepare public routes for ${formatScheduledAt(nextScheduledAt)}.`);
    } catch (scheduleError) {
      setError(scheduleError instanceof Error ? scheduleError.message : 'Failed to schedule route policy.');
    } finally {
      setScheduling(false);
    }
  }

  return (
    <span style={controlsStyle} data-cms-dynamic-item-policy-schedule={pageId}>
      <label style={fieldStyle}>
        <span style={labelStyle}>Schedule Prepare</span>
        <input
          data-cms-dynamic-item-policy-schedule-at={pageId}
          disabled={busy || scheduling}
          style={inputStyle}
          type="datetime-local"
          value={scheduledAt}
          onChange={(event) => setScheduledAt(event.currentTarget.value)}
        />
      </label>
      <button
        type="button"
        className="builder-action-btn"
        data-cms-dynamic-item-policy-schedule-save={pageId}
        disabled={busy || scheduling || !scheduledAt}
        onClick={() => { void schedulePolicy(); }}
        style={buttonStyle}
      >
        {scheduling ? 'Scheduling...' : 'Schedule'}
      </button>
      {status ? (
        <span style={statusStyle} data-cms-dynamic-item-policy-schedule-status={pageId}>
          {status}
        </span>
      ) : null}
      {error ? (
        <span role="alert" style={errorStyle} data-cms-dynamic-item-policy-schedule-error={pageId}>
          {error}
        </span>
      ) : null}
    </span>
  );
}

function formatScheduledAt(input: string): string {
  const timestamp = Date.parse(input);
  if (!Number.isFinite(timestamp)) return input;
  return `${new Date(timestamp).toISOString().slice(0, 16).replace('T', ' ')} UTC`;
}

const controlsStyle = {
  display: 'inline-flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 6,
  maxWidth: '100%',
} satisfies CSSProperties;

const fieldStyle = {
  display: 'inline-flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 4,
  minWidth: 0,
} satisfies CSSProperties;

const inputStyle = {
  maxWidth: '100%',
  minWidth: 0,
} satisfies CSSProperties;

const labelStyle = {
  color: '#64748b',
  fontSize: 12,
  fontWeight: 700,
} satisfies CSSProperties;

const buttonStyle = {
  maxWidth: '100%',
  lineHeight: 1.2,
  textAlign: 'center',
  whiteSpace: 'normal',
} satisfies CSSProperties;

const statusStyle = {
  color: '#047857',
  fontSize: 12,
  fontWeight: 800,
} satisfies CSSProperties;

const errorStyle = {
  color: '#b91c1c',
  fontSize: 12,
  fontWeight: 800,
} satisfies CSSProperties;
