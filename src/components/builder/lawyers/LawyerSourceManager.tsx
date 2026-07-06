'use client';

import { useMemo, useState } from 'react';
import type { KeyboardEvent } from 'react';
import type { AttorneyProfileSourceRecord } from '@/lib/builder/lawyers/source';
import type { Locale } from '@/lib/locales';
import { LawyerSourceForm } from './LawyerSourceForm';
import { LawyerSourceProfilePreview } from './LawyerSourceProfilePreview';
import { LawyerSourceRecordList } from './LawyerSourceRecordList';
import {
  formStateFromRecord,
  readFocalDraft,
  readInternalLinksDraft,
  splitList,
  splitSummary,
  type LawyerSourceDraft,
} from './lawyerSourceDraft';
import { helperStyle, panelStyle } from './lawyerSourceStyles';

type ApiLawyerMutation = {
  ok?: boolean;
  record?: AttorneyProfileSourceRecord;
  slugRedirect?: {
    status?: string;
    redirects?: unknown[];
    skipReason?: string;
  } | null;
  error?: string;
  issues?: string[];
};

interface LawyerSourceManagerProps {
  locale: Locale;
  records: AttorneyProfileSourceRecord[];
}

const localeLabels: Record<Locale, string> = {
  ko: '한국어',
  'zh-hant': '繁體中文',
  en: 'English',
};

export default function LawyerSourceManager({ locale, records }: LawyerSourceManagerProps) {
  const [items, setItems] = useState(records);
  const [selectedSourceSlug, setSelectedSourceSlug] = useState(records[0]?.sourceSlug ?? '');
  const selected = useMemo(
    () => items.find((record) => record.sourceSlug === selectedSourceSlug) ?? items[0],
    [items, selectedSourceSlug],
  );
  const [draft, setDraft] = useState(() => formStateFromRecord(selected));
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [redirectReview, setRedirectReview] = useState('');

  function revertDraft() {
    if (!selected) return;
    setDraft(formStateFromRecord(selected));
    setStatus('Draft reverted.');
    setError('');
    setRedirectReview('');
  }

  function handleDraftKeyDown(event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (event.key === 'Escape') {
      event.preventDefault();
      revertDraft();
      return;
    }
    if (event.key !== 'Enter') return;
    const isTextarea = event.currentTarget.tagName === 'TEXTAREA';
    if (isTextarea && !(event.metaKey || event.ctrlKey)) return;
    event.preventDefault();
    void saveRecord();
  }

  function handleEditorKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 's') return;
    event.preventDefault();
    void saveRecord();
  }

  function selectRecord(record: AttorneyProfileSourceRecord) {
    setSelectedSourceSlug(record.sourceSlug);
    setDraft(formStateFromRecord(record));
    setStatus('');
    setError('');
    setRedirectReview('');
  }

  function updateDraft(patch: Partial<LawyerSourceDraft>) {
    setDraft((current) => ({ ...current, ...patch }));
  }

  async function saveRecord() {
    if (!selected || saving) return;
    if (!splitList(draft.languages)?.length) {
      setStatus('');
      setRedirectReview('');
      setError('At least one language is required.');
      return;
    }
    if (!splitList(draft.practiceAreas)?.length) {
      setStatus('');
      setRedirectReview('');
      setError('At least one practice area is required.');
      return;
    }
    const internalLinks = readInternalLinksDraft(draft.internalLinks);
    if (!internalLinks.ok) {
      setStatus('');
      setRedirectReview('');
      setError(internalLinks.message);
      return;
    }
    setSaving(true);
    setStatus('');
    setError('');
    setRedirectReview('');
    try {
      const response = await fetch(`/api/builder/lawyers/${encodeURIComponent(selected.sourceSlug)}?locale=${locale}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          slug: draft.slug,
          localized: {
            [locale]: {
              name: draft.name,
              role: draft.role,
              title: draft.title,
              description: draft.description,
              summary: splitSummary(draft.summary),
              languages: splitList(draft.languages),
              practiceAreas: splitList(draft.practiceAreas),
              internalLinks: internalLinks.links,
            },
          },
          email: draft.email || undefined,
          image: draft.image || undefined,
          imageAltText: draft.imageAltText || undefined,
          imageFocalPoint: {
            x: readFocalDraft(draft.imageFocalX),
            y: readFocalDraft(draft.imageFocalY),
          },
        }),
      });
      const payload = await response.json() as ApiLawyerMutation;
      if (!response.ok || !payload.ok || !payload.record) {
        setError(payload.issues?.join(' ') || payload.error || 'Attorney profile save failed.');
        return;
      }
      const savedRecord = payload.record;
      setItems((current) => current.map((record) => (
        record.sourceSlug === savedRecord.sourceSlug ? savedRecord : record
      )));
      setDraft(formStateFromRecord(savedRecord));
      const redirectCount = payload.slugRedirect?.redirects?.length ?? 0;
      setStatus(redirectCount > 0
        ? `Saved. ${redirectCount} slug redirect rule(s) created.`
        : 'Saved. Attorney profile source override is active.');
      setRedirectReview(redirectCount > 0
        ? `Redirect review: ${redirectCount} active rule(s) now protect old lawyer URLs.`
        : 'Redirect review: no slug redirect was needed for this save.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Attorney profile save failed.');
    } finally {
      setSaving(false);
    }
  }

  async function resetOverride() {
    if (!selected || resetting) return;
    setResetting(true);
    setStatus('');
    setError('');
    setRedirectReview('');
    try {
      const response = await fetch(`/api/builder/lawyers/${encodeURIComponent(selected.sourceSlug)}?locale=${locale}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      const payload = await response.json() as ApiLawyerMutation;
      if (!response.ok || !payload.ok || !payload.record) {
        setError(payload.issues?.join(' ') || payload.error || 'Attorney profile reset failed.');
        return;
      }
      const resetRecord = payload.record;
      setItems((current) => current.map((record) => (
        record.sourceSlug === resetRecord.sourceSlug ? resetRecord : record
      )));
      setDraft(formStateFromRecord(resetRecord));
      const redirectCount = payload.slugRedirect?.redirects?.length ?? 0;
      setStatus(redirectCount > 0
        ? `Reset. ${redirectCount} slug redirect rule(s) created.`
        : 'Reset. The attorney profile now follows the code source again.');
      setRedirectReview(redirectCount > 0
        ? `Redirect review: ${redirectCount} active rule(s) now protect the removed override URL.`
        : '');
    } catch (resetError) {
      setError(resetError instanceof Error ? resetError.message : 'Attorney profile reset failed.');
    } finally {
      setResetting(false);
    }
  }

  if (!selected) {
    return (
      <section className="builder-preview-inspector-card" data-lawyer-source-manager>
        <h2>Lawyer source records</h2>
        <p style={helperStyle}>No attorney profile records are available.</p>
      </section>
    );
  }

  const publicPath = `/${locale}/lawyers/${draft.slug || selected.slug}`;

  return (
    <div style={panelStyle} data-lawyer-source-manager onKeyDown={handleEditorKeyDown}>
      <LawyerSourceRecordList
        records={items}
        selectedSourceSlug={selected.sourceSlug}
        onSelectRecord={selectRecord}
      />

      <section className="builder-preview-inspector-card">
        <div className="builder-dashboard-page-heading">
          <div>
            <p className="builder-stage-pill">Source: {selected.sourceSlug}</p>
            <h2>{draft.name || selected.name}</h2>
          </div>
          <span className="builder-stage-pill builder-stage-pill--accent">{localeLabels[locale]}</span>
        </div>

        <LawyerSourceProfilePreview draft={draft} publicPath={publicPath} record={selected} />
        <LawyerSourceForm
          draft={draft}
          error={error}
          locale={locale}
          publicPath={publicPath}
          redirectReview={redirectReview}
          resetting={resetting}
          saving={saving}
          sourceSlug={selected.sourceSlug}
          status={status}
          onDraftChange={updateDraft}
          onDraftKeyDown={handleDraftKeyDown}
          onReset={() => { void resetOverride(); }}
          onSave={() => { void saveRecord(); }}
        />
      </section>
    </div>
  );
}
