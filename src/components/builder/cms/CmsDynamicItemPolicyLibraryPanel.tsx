'use client';

import { useState, type CSSProperties } from 'react';
import { z } from 'zod';
import type { CmsDynamicItemPolicyLibraryEntry } from '@/components/builder/cms/cms-dynamic-item-policy-library';
import type { Locale } from '@/lib/locales';

type CmsDynamicItemPolicyLibraryPanelProps = {
  readonly locale: Locale;
  readonly siteId: string;
  readonly collectionId: string;
  readonly entries: readonly CmsDynamicItemPolicyLibraryEntry[];
};

const routePolicyDeleteResponseSchema = z.object({
  ok: z.boolean().optional(),
  error: z.string().optional(),
  issues: z.array(z.string()).optional(),
});

export function CmsDynamicItemPolicyLibraryPanel({
  locale,
  siteId,
  collectionId,
  entries,
}: CmsDynamicItemPolicyLibraryPanelProps) {
  const [removedPageIds, setRemovedPageIds] = useState<readonly string[]>([]);
  const [removingPageId, setRemovingPageId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  if (!entries.length) return null;

  const visibleEntries = resolveVisibleEntries(entries.filter((entry) => !removedPageIds.includes(entry.pageId)));

  async function removePolicy(entry: CmsDynamicItemPolicyLibraryEntry) {
    if (!window.confirm(`Remove saved policy "${entry.policyName}" from ${entry.sourceTitle}?`)) return;
    setRemovingPageId(entry.pageId);
    setStatus(null);
    setError(null);
    try {
      await deleteRoutePolicy({
        locale,
        siteId,
        collectionId,
        pageId: entry.pageId,
      });
      setRemovedPageIds((current) => [...current, entry.pageId]);
      setStatus(`Removed ${entry.policyName} from ${entry.sourceTitle}.`);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to remove saved policy.');
    } finally {
      setRemovingPageId(null);
    }
  }

  return (
    <div style={panelStyle} data-cms-dynamic-item-policy-library={collectionId}>
      <div style={summaryStyle}>
        <strong>Saved route policy library</strong>
        <span style={hintStyle}>
          {visibleEntries.length} saved route policy entr{visibleEntries.length === 1 ? 'y' : 'ies'} for linked item pages.
        </span>
      </div>
      {visibleEntries.length ? (
        <div style={entryListStyle}>
          {visibleEntries.map((entry) => (
            <article
              key={entry.pageId}
              style={entryStyle}
              data-cms-dynamic-item-policy-library-entry={entry.pageId}
            >
              <div style={entrySummaryStyle}>
                <strong>{entry.policyName}</strong>
                <span style={hintStyle}>{entry.sourceTitle}</span>
              </div>
              <span style={metaStyle}>
                Source {entry.sourceFieldKey} · Pattern {entry.slugPattern} · Conflict {describeConflictRule(entry)}
              </span>
              <span style={metaStyle}>
                Used by {entry.usageCount} linked item page{entry.usageCount === 1 ? '' : 's'}
              </span>
              <button
                type="button"
                className="builder-action-btn"
                data-cms-dynamic-item-policy-library-remove={entry.pageId}
                disabled={removingPageId === entry.pageId}
                onClick={() => { void removePolicy(entry); }}
                style={buttonStyle}
              >
                {removingPageId === entry.pageId ? 'Removing...' : 'Remove'}
              </button>
            </article>
          ))}
        </div>
      ) : (
        <span style={hintStyle}>No saved route policies remain for this collection.</span>
      )}
      {status ? (
        <span style={statusStyle} data-cms-dynamic-item-policy-library-status={collectionId}>
          {status}
        </span>
      ) : null}
      {error ? (
        <span role="alert" style={errorStyle} data-cms-dynamic-item-policy-library-error={collectionId}>
          {error}
        </span>
      ) : null}
    </div>
  );
}

type DeleteRoutePolicyInput = {
  readonly locale: Locale;
  readonly siteId: string;
  readonly collectionId: string;
  readonly pageId: string;
};

async function deleteRoutePolicy({
  locale,
  siteId,
  collectionId,
  pageId,
}: DeleteRoutePolicyInput): Promise<void> {
  const params = new URLSearchParams({ locale });
  const response = await fetch(
    `/api/builder/sites/${encodeURIComponent(siteId)}/collections/${encodeURIComponent(collectionId)}/dynamic-item-route-policies/${encodeURIComponent(pageId)}?${params.toString()}`,
    {
      method: 'DELETE',
      credentials: 'same-origin',
    },
  );
  const parsed = routePolicyDeleteResponseSchema.safeParse(await response.json());
  if (!parsed.success) {
    throw new Error('Unexpected dynamic item route policy response.');
  }
  if (!response.ok || !parsed.data.ok) {
    throw new Error(parsed.data.issues?.join('\n') ?? parsed.data.error ?? 'Failed to delete route policy.');
  }
}

function describeConflictRule(entry: CmsDynamicItemPolicyLibraryEntry): string {
  return entry.slugConflictRule === 'record-id-suffix' ? 'Append record ID' : 'Next available';
}

function resolveVisibleEntries(
  entries: readonly CmsDynamicItemPolicyLibraryEntry[],
): readonly CmsDynamicItemPolicyLibraryEntry[] {
  return entries.map((entry) => ({
    ...entry,
    usageCount: entries.filter((candidate) => (
      candidate.policyName === entry.policyName
      && candidate.sourceFieldKey === entry.sourceFieldKey
      && candidate.slugPattern === entry.slugPattern
      && candidate.slugConflictRule === entry.slugConflictRule
    )).length,
  }));
}

const panelStyle = {
  display: 'grid',
  gap: 8,
  border: '1px solid #dbe4f0',
  borderRadius: 8,
  minWidth: 0,
  padding: 12,
  width: '100%',
} satisfies CSSProperties;

const summaryStyle = {
  display: 'grid',
  gap: 2,
  minWidth: 0,
} satisfies CSSProperties;

const hintStyle = {
  color: '#64748b',
  fontSize: 13,
} satisfies CSSProperties;

const entryListStyle = {
  display: 'grid',
  gap: 8,
  minWidth: 0,
} satisfies CSSProperties;

const entryStyle = {
  display: 'grid',
  gap: 6,
  minWidth: 0,
  border: '1px solid #e5edf7',
  borderRadius: 8,
  padding: 10,
} satisfies CSSProperties;

const entrySummaryStyle = {
  display: 'grid',
  gap: 2,
  minWidth: 0,
} satisfies CSSProperties;

const metaStyle = {
  color: '#475569',
  fontSize: 12,
  overflowWrap: 'anywhere',
} satisfies CSSProperties;

const buttonStyle = {
  justifySelf: 'start',
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
