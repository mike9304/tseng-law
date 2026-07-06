'use client';

import { useState, type CSSProperties } from 'react';
import { z } from 'zod';
import { CmsDynamicItemSlugMutationOptions } from '@/components/builder/cms/CmsDynamicItemSlugMutationOptions';
import {
  buildCmsDynamicItemRouteMutationBody,
  cmsDynamicItemRouteMutationSupportsSlugOptions,
  getCmsDynamicItemRouteMutationCopy,
  getCmsDynamicItemRouteMutationDataAttributes,
  type CmsDynamicItemRouteMutationKind,
} from '@/components/builder/cms/cms-dynamic-item-route-mutation-config';
import type { BuilderCmsSlugConflictRule } from '@/lib/builder/cms-slug-conflict-rule';
import type { BuilderCmsSlugSourceField } from '@/lib/builder/cms-slug-source-fields';
import type { Locale } from '@/lib/locales';

type CmsDynamicItemRouteMutationButtonProps = {
  readonly kind: CmsDynamicItemRouteMutationKind;
  readonly locale: Locale;
  readonly siteId: string;
  readonly collectionId: string;
  readonly pageId: string;
  readonly recordIds: readonly string[];
  readonly slugField: string;
  readonly sourceFields?: readonly BuilderCmsSlugSourceField[];
  readonly previewRecordId?: string;
  readonly previewFields?: Readonly<Record<string, unknown>>;
  readonly showSlugOptions?: boolean;
};

const bulkMutationResponseSchema = z.object({
  ok: z.boolean().optional(),
  updated: z.number().optional(),
  error: z.string().optional(),
  issues: z.array(z.string()).optional(),
  missingRecordIds: z.array(z.string()).optional(),
  skippedRecordIds: z.array(z.string()).optional(),
});

export function CmsDynamicItemRouteMutationButton({
  kind,
  locale,
  siteId,
  collectionId,
  pageId,
  recordIds,
  slugField,
  sourceFields = [],
  previewRecordId,
  previewFields,
  showSlugOptions: showSlugOptionsInput,
}: CmsDynamicItemRouteMutationButtonProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sourceFieldKey, setSourceFieldKey] = useState('');
  const [slugPattern, setSlugPattern] = useState('');
  const [slugConflictRule, setSlugConflictRule] = useState<BuilderCmsSlugConflictRule>('next-available');
  const copy = getCmsDynamicItemRouteMutationCopy(kind, recordIds.length, slugField);
  const showSlugOptions = showSlugOptionsInput ?? cmsDynamicItemRouteMutationSupportsSlugOptions(kind);

  async function runMutation() {
    if (!recordIds.length) return;
    if (!window.confirm(copy.confirm)) return;
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/builder/sites/${encodeURIComponent(siteId)}/collections/${encodeURIComponent(collectionId)}/records/bulk?locale=${locale}`,
        {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(buildCmsDynamicItemRouteMutationBody({
            kind,
            recordIds,
            slugField,
            sourceFieldKey,
            slugPattern,
            slugConflictRule,
          })),
        },
      );
      const parsed = bulkMutationResponseSchema.safeParse(await response.json());
      if (!parsed.success) {
        throw new Error('Unexpected CMS bulk mutation response.');
      }
      const result = parsed.data;
      if (!response.ok || !result.ok) {
        throw new Error(result.issues?.join('\n') ?? result.error ?? copy.error);
      }
      window.location.reload();
    } catch (mutationError) {
      setError(mutationError instanceof Error ? mutationError.message : copy.error);
      setBusy(false);
    }
  }

  return (
    <span style={controlStyle}>
      {showSlugOptions ? (
        <CmsDynamicItemSlugMutationOptions
          busy={busy}
          pageId={pageId}
          previewFields={previewFields}
          previewRecordId={previewRecordId}
          showConflictRule={kind === 'repair-slug-conflicts'}
          slugConflictRule={slugConflictRule}
          slugPattern={slugPattern}
          sourceFieldKey={sourceFieldKey}
          sourceFields={sourceFields}
          onSlugConflictRuleChange={setSlugConflictRule}
          onSlugPatternChange={setSlugPattern}
          onSourceFieldKeyChange={setSourceFieldKey}
        />
      ) : null}
      <button
        type="button"
        className="builder-action-btn"
        disabled={busy}
        onClick={() => { void runMutation(); }}
        style={buttonStyle}
        {...getCmsDynamicItemRouteMutationDataAttributes(kind, pageId)}
      >
        {busy ? copy.busyLabel : copy.idleLabel}
      </button>
      {error ? <span role="alert" style={errorStyle}>{error}</span> : null}
    </span>
  );
}

const errorStyle = {
  display: 'block',
  color: '#b91c1c',
  fontSize: 13,
  fontWeight: 700,
  marginTop: 6,
};

const controlStyle = {
  display: 'inline-flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 6,
  maxWidth: '100%',
} satisfies CSSProperties;

const buttonStyle = {
  maxWidth: '100%',
  lineHeight: 1.2,
  textAlign: 'center',
  whiteSpace: 'normal',
} satisfies CSSProperties;
