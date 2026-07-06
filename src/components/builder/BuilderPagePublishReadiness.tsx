'use client';

import React from 'react';
import { useCallback, useMemo, useState } from 'react';
import { getPublishReadinessCopy } from '@/components/builder/builder-page-publish-readiness-copy';
import type { BuilderPublishValidationIssue } from '@/lib/builder/validation';
import type { BuilderPageKey } from '@/lib/builder/types';
import type { Locale } from '@/lib/locales';

type PublishReadinessResult = {
  passed: boolean;
  issues: BuilderPublishValidationIssue[];
  checkedAt?: string;
};

export default function BuilderPagePublishReadiness({
  locale,
  siteId,
  pageKey,
  initialResult,
  publishSnapshot,
}: {
  locale: Locale;
  siteId: string;
  pageKey: BuilderPageKey;
  initialResult: PublishReadinessResult;
  publishSnapshot: {
    draft: { persisted: boolean; revision: number; savedAt: string | null };
    published: { persisted: boolean; revision: number; savedAt: string | null };
  };
}) {
  const [result, setResult] = useState<PublishReadinessResult>(initialResult);
  const [status, setStatus] = useState<'idle' | 'checking' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [publishStatus, setPublishStatus] = useState<'idle' | 'publishing' | 'success' | 'error'>('idle');
  const [publishError, setPublishError] = useState<string | null>(null);

  const issuePreview = useMemo(() => result.issues.slice(0, 4), [result.issues]);
  const copy = getPublishReadinessCopy(locale);
  const hasDraft = publishSnapshot.draft.persisted;
  const canPublishCurrentDraft = hasDraft && result.passed;

  const runChecks = useCallback(async () => {
    if (!hasDraft) {
      setStatus('idle');
      setError(copy.draftRequiredDescription);
      return;
    }

    setStatus('checking');
    setError(null);
    try {
      const response = await fetch(
        `/api/builder/sites/${encodeURIComponent(siteId)}/pages/${encodeURIComponent(pageKey)}/publish-checks?locale=${encodeURIComponent(locale)}`,
        {
          method: 'POST',
          credentials: 'same-origin',
        },
      );
      const payload = (await response.json().catch(() => null)) as
        | { ok?: boolean; passed?: boolean; issues?: BuilderPublishValidationIssue[]; checkedAt?: string; error?: string }
        | null;

      if (!response.ok || !payload?.ok) {
        setStatus('error');
        setError(payload?.error ?? copy.refreshFailedDescription);
        return;
      }

      setResult({
        passed: Boolean(payload.passed),
        issues: payload.issues ?? [],
        checkedAt: payload.checkedAt,
      });
      setStatus('idle');
    } catch {
      setStatus('error');
      setError(copy.refreshFailedDescription);
    }
  }, [copy.draftRequiredDescription, copy.refreshFailedDescription, hasDraft, locale, pageKey, siteId]);

  const publishPage = useCallback(async () => {
    if (!hasDraft) {
      setPublishStatus('error');
      setPublishError(copy.noDraftPublishDescription);
      return;
    }

    setPublishStatus('publishing');
    setPublishError(null);
    try {
      const response = await fetch(
        `/api/builder/sites/${encodeURIComponent(siteId)}/pages/${encodeURIComponent(pageKey)}/publish?locale=${encodeURIComponent(locale)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({
            expectedDraftRevision: publishSnapshot.draft.revision,
            expectedDraftSavedAt: publishSnapshot.draft.savedAt,
            expectedPublishedRevision: publishSnapshot.published.revision,
            expectedPublishedSavedAt: publishSnapshot.published.savedAt,
          }),
        },
      );
      const payload = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string; issues?: BuilderPublishValidationIssue[] }
        | null;

      if (!response.ok || !payload?.ok) {
        setPublishStatus('error');
        setPublishError(payload?.error ?? copy.publishFailedDescription);
        return;
      }

      setPublishStatus('success');
      await runChecks();
    } catch {
      setPublishStatus('error');
      setPublishError(copy.publishFailedDescription);
    }
  }, [copy.noDraftPublishDescription, copy.publishFailedDescription, hasDraft, locale, pageKey, publishSnapshot, runChecks, siteId]);

  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
        <span
          className={`builder-stage-pill${canPublishCurrentDraft ? '' : ' builder-stage-pill--danger'}`}
        >
          {canPublishCurrentDraft ? copy.publishReadyLabel : hasDraft ? copy.publishBlockedLabel : copy.savedDraftRequiredStatusLabel}
        </span>
        <span className="builder-stage-pill">{copy.issuesLabel(result.issues.length)}</span>
        {result.checkedAt ? <span className="builder-stage-pill">{copy.checkedLabel(result.checkedAt)}</span> : null}
        <span className="builder-stage-pill">
          {hasDraft ? copy.draftLabel(publishSnapshot.draft.revision) : copy.noDraftLabel}
        </span>
        <span className="builder-stage-pill">
          {publishSnapshot.published.persisted
            ? copy.publishedLabel(publishSnapshot.published.revision)
            : copy.noPublishedBaselineLabel}
        </span>
      </div>
      <dl className="builder-preview-inspector-list">
        <div>
          <dt>{copy.pageValidationLabel}</dt>
          <dd>
            {!hasDraft
              ? copy.pageNeedsSavedDraftDescription
              : result.passed
                ? copy.pagePublishableDescription
                : copy.pageNeedsFixesDescription}
          </dd>
        </div>
        <div>
          <dt>{copy.datasetBindingLabel}</dt>
          <dd>{copy.datasetBindingDescription}</dd>
        </div>
      </dl>
      <div style={{ marginTop: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
          <button
            type="button"
            className="builder-stage-pill"
            onClick={() => void publishPage()}
            disabled={publishStatus === 'publishing' || !canPublishCurrentDraft}
            style={{
              border: '1px solid currentColor',
              background: 'transparent',
              cursor:
                publishStatus === 'publishing' || !canPublishCurrentDraft
                  ? 'not-allowed'
                  : 'pointer',
            }}
          >
            {publishStatus === 'publishing' ? copy.publishingLabel : copy.publishPageLabel}
          </button>
        </div>
        {publishError ? (
          <div style={{ marginBottom: 8, color: '#991b1b', fontSize: '0.82rem' }}>{publishError}</div>
        ) : null}
        {publishStatus === 'success' ? (
          <div style={{ marginBottom: 8, color: '#166534', fontSize: '0.82rem' }}>
            {copy.publishCompletedDescription}
          </div>
        ) : null}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 8 }}>
          <h3 style={{ margin: 0, fontSize: '0.8rem' }}>{copy.validationIssuesLabel}</h3>
          <button
            type="button"
            className="builder-link-inline"
            onClick={() => void runChecks()}
            disabled={status === 'checking' || !hasDraft}
            style={{
              border: 'none',
              background: 'transparent',
              padding: 0,
              cursor: status === 'checking' ? 'wait' : hasDraft ? 'pointer' : 'not-allowed',
            }}
          >
            {status === 'checking' ? copy.refreshingLabel : hasDraft ? copy.runChecksLabel : copy.draftRequiredLabel}
          </button>
        </div>
        {!hasDraft ? (
          <div style={{ marginBottom: 8, color: '#92400e', fontSize: '0.82rem' }}>
            {copy.draftRequiredDescription}
          </div>
        ) : null}
        {error ? (
          <div style={{ marginBottom: 8, color: '#991b1b', fontSize: '0.82rem' }}>{error}</div>
        ) : null}
        {issuePreview.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 6 }}>
            {issuePreview.map((issue) => (
              <li
                key={`${issue.code}:${issue.sectionId}:${issue.surfaceId}`}
                style={{
                  padding: '8px 12px',
                  borderRadius: 8,
                  background: '#fef2f2',
                  border: '1px solid #fca5a5',
                  color: '#991b1b',
                  fontSize: '0.82rem',
                }}
              >
                <strong>{issue.sectionTitle}</strong>
                <div>{issue.message}</div>
                <div style={{ marginTop: 4, fontSize: '0.74rem', opacity: 0.82 }}>
                  {issue.sectionKey} · {issue.surfaceId || 'snapshot'}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="builder-preview-inspector-notes">
            <li>{copy.noValidationIssuesDescription}</li>
          </ul>
        )}
      </div>
    </>
  );
}
