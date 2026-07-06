'use client';

import { useMemo, useState } from 'react';
import type { KeyboardEvent } from 'react';
import type { BuilderCollectionRecordRelationOption } from '@/lib/builder/cms';
import type { ServiceAreaSourceRecord } from '@/lib/builder/services/source';
import type { Locale } from '@/lib/locales';
import { ServiceSourceForm } from './ServiceSourceForm';
import { ServiceSourceRecordList } from './ServiceSourceRecordList';
import { formStateFromRecord, splitKeyPoints, type ServiceSourceDraft } from './serviceSourceDraft';
import { helperStyle, panelStyle } from './serviceSourceStyles';

type ApiServiceMutation = {
  ok?: boolean;
  record?: ServiceAreaSourceRecord;
  slugRedirect?: {
    status?: string;
    redirects?: unknown[];
    skipReason?: string;
  } | null;
  error?: string;
  issues?: string[];
};

interface ServiceSourceManagerProps {
  columnOptions: readonly BuilderCollectionRecordRelationOption[];
  locale: Locale;
  records: ServiceAreaSourceRecord[];
}

const localeLabels: Record<Locale, string> = {
  ko: '한국어',
  'zh-hant': '繁體中文',
  en: 'English',
};

export default function ServiceSourceManager({ columnOptions, locale, records }: ServiceSourceManagerProps) {
  const [items, setItems] = useState(records);
  const [selectedSourceSlug, setSelectedSourceSlug] = useState(records[0]?.sourceSlug ?? '');
  const selected = useMemo(
    () => items.find((record) => record.sourceSlug === selectedSourceSlug) ?? items[0],
    [items, selectedSourceSlug],
  );
  const [draft, setDraft] = useState(() => formStateFromRecord(selected, locale));
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [redirectReview, setRedirectReview] = useState('');

  function revertDraft() {
    if (!selected) return;
    setDraft(formStateFromRecord(selected, locale));
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

  function selectRecord(record: ServiceAreaSourceRecord) {
    setSelectedSourceSlug(record.sourceSlug);
    setDraft(formStateFromRecord(record, locale));
    setStatus('');
    setError('');
    setRedirectReview('');
  }

  function updateDraft(patch: Partial<ServiceSourceDraft>) {
    setDraft((current) => ({ ...current, ...patch }));
  }

  async function saveRecord() {
    if (!selected || saving) return;
    const keyPoints = splitKeyPoints(draft.keyPoints);
    if (!keyPoints?.length) {
      setStatus('');
      setRedirectReview('');
      setError('At least one key point is required.');
      return;
    }
    if (draft.columnSlugs.length > 40) {
      setStatus('');
      setRedirectReview('');
      setError('Related columns must include 40 items or fewer.');
      return;
    }
    setSaving(true);
    setStatus('');
    setError('');
    setRedirectReview('');
    try {
      const response = await fetch(`/api/builder/services/${encodeURIComponent(selected.sourceSlug)}?locale=${locale}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          slug: draft.slug,
          title: { [locale]: draft.title },
          subtitle: { [locale]: draft.subtitle },
          intro: { [locale]: draft.intro },
          keyPoints: { [locale]: keyPoints },
          columnSlugs: draft.columnSlugs,
        }),
      });
      const payload = await response.json() as ApiServiceMutation;
      if (!response.ok || !payload.ok || !payload.record) {
        setError(payload.issues?.join(' ') || payload.error || 'Service record save failed.');
        return;
      }
      const savedRecord = payload.record;
      setItems((current) => current.map((record) => (
        record.sourceSlug === savedRecord.sourceSlug ? savedRecord : record
      )));
      setDraft(formStateFromRecord(savedRecord, locale));
      const redirectCount = payload.slugRedirect?.redirects?.length ?? 0;
      setStatus(redirectCount > 0
        ? `Saved. ${redirectCount} slug redirect rule(s) created.`
        : 'Saved. Service source override is active.');
      setRedirectReview(redirectCount > 0
        ? `Redirect review: ${redirectCount} active rule(s) now protect old service URLs.`
        : 'Redirect review: no slug redirect was needed for this save.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Service record save failed.');
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
      const response = await fetch(`/api/builder/services/${encodeURIComponent(selected.sourceSlug)}?locale=${locale}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      const payload = await response.json() as ApiServiceMutation;
      if (!response.ok || !payload.ok || !payload.record) {
        setError(payload.issues?.join(' ') || payload.error || 'Service record reset failed.');
        return;
      }
      const resetRecord = payload.record;
      setItems((current) => current.map((record) => (
        record.sourceSlug === resetRecord.sourceSlug ? resetRecord : record
      )));
      setDraft(formStateFromRecord(resetRecord, locale));
      const redirectCount = payload.slugRedirect?.redirects?.length ?? 0;
      setStatus(redirectCount > 0
        ? `Reset. ${redirectCount} slug redirect rule(s) created.`
        : 'Reset. The service record now follows the code source again.');
      setRedirectReview(redirectCount > 0
        ? `Redirect review: ${redirectCount} active rule(s) now protect the removed override URL.`
        : '');
    } catch (resetError) {
      setError(resetError instanceof Error ? resetError.message : 'Service record reset failed.');
    } finally {
      setResetting(false);
    }
  }

  if (!selected) {
    return (
      <section className="builder-preview-inspector-card" data-service-source-manager>
        <h2>Service source records</h2>
        <p style={helperStyle}>No service records are available.</p>
      </section>
    );
  }

  const publicPath = `/${locale}/services/${draft.slug || selected.slug}`;

  return (
    <div style={panelStyle} data-service-source-manager onKeyDown={handleEditorKeyDown}>
      <ServiceSourceRecordList
        locale={locale}
        records={items}
        selectedSourceSlug={selected.sourceSlug}
        onSelectRecord={selectRecord}
      />

      <section className="builder-preview-inspector-card">
        <div className="builder-dashboard-page-heading">
          <div>
            <p className="builder-stage-pill">Source: {selected.sourceSlug}</p>
            <h2>{selected.title[locale]}</h2>
          </div>
          <span className="builder-stage-pill builder-stage-pill--accent">{localeLabels[locale]}</span>
        </div>

        <ServiceSourceForm
          columnOptions={columnOptions}
          draft={draft}
          error={error}
          publicPath={publicPath}
          redirectReview={redirectReview}
          resetting={resetting}
          saving={saving}
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
