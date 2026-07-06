'use client';

import { useState } from 'react';
import type { ProjectedSeoValue } from '@/lib/builder/translations/seo-projection';
import { getTranslationCopy } from './translation-copy';
import type {
  AutoTranslateRollbackSnapshot,
  TranslationEditorAutoTranslateResponse,
  TranslationEditorProps,
  TranslationEditorSaveResponse,
} from './TranslationEditor.types';
import {
  TranslationEditorSeoSection,
  type TranslationEditorSeoField,
} from './TranslationEditorSeoSection';
import { TranslationEditorTextSection } from './TranslationEditorTextSection';
import { TranslationEditorToolbar } from './TranslationEditorToolbar';

export default function TranslationEditor({
  siteId,
  pageId,
  sourceLocale,
  targetLocale,
  sources,
  initialTargetValues,
  targetPageReady,
  initialSourceSeo,
  initialTargetSeo,
}: TranslationEditorProps) {
  const copy = getTranslationCopy(targetLocale);
  const [values, setValues] = useState<Record<string, string>>(() => {
    const seeded: Record<string, string> = {};
    for (const source of sources) {
      seeded[source.nodeId] = initialTargetValues[source.nodeId] ?? '';
    }
    return seeded;
  });
  const [seo, setSeo] = useState<ProjectedSeoValue>(initialTargetSeo);
  const [saving, setSaving] = useState(false);
  const [autoBusy, setAutoBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [rollbackSnapshot, setRollbackSnapshot] = useState<AutoTranslateRollbackSnapshot | null>(null);

  function updateValue(nodeId: string, next: string) {
    setValues((previous) => ({ ...previous, [nodeId]: next }));
  }

  function updateSeo(field: TranslationEditorSeoField, value: string) {
    setSeo((previous) => ({ ...previous, [field]: value }));
  }

  function revertAutoTranslate() {
    if (!rollbackSnapshot) return;
    setValues(rollbackSnapshot.values);
    setRollbackSnapshot(null);
    setError('');
    setNotice(copy.editorAutoTranslateReverted(rollbackSnapshot.proposalCount));
  }

  async function saveAll() {
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const nodeUpdates: Record<string, { text: string }> = {};
      for (const source of sources) {
        const candidate = values[source.nodeId] ?? '';
        // Only send entries the user actually filled in.
        if (candidate.length === 0) continue;
        if (candidate === initialTargetValues[source.nodeId]) continue;
        nodeUpdates[source.nodeId] = { text: candidate };
      }
      const seoOverride: Record<string, string> = {};
      if ((seo.title ?? '') !== (initialTargetSeo.title ?? '')) {
        seoOverride.title = seo.title ?? '';
      }
      if ((seo.description ?? '') !== (initialTargetSeo.description ?? '')) {
        seoOverride.description = seo.description ?? '';
      }
      if ((seo.ogImage ?? '') !== (initialTargetSeo.ogImage ?? '')) {
        seoOverride.ogImage = seo.ogImage ?? '';
      }

      const hasNodeUpdates = Object.keys(nodeUpdates).length > 0;
      const hasSeoUpdates = Object.keys(seoOverride).length > 0;
      if (!hasNodeUpdates && !hasSeoUpdates) {
        setNotice(copy.editorNothingToSave);
        setSaving(false);
        return;
      }

      const response = await fetch('/api/builder/translations/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId,
          pageId,
          sourceLocale,
          targetLocale,
          nodeUpdates: hasNodeUpdates ? nodeUpdates : undefined,
          seoOverride: hasSeoUpdates ? seoOverride : undefined,
        }),
      });
      const body = (await response.json().catch(() => null)) as TranslationEditorSaveResponse | null;
      if (!response.ok || !body?.ok) {
        setError(body?.error ?? `${copy.editorSaveFailed} (${response.status})`);
      } else {
        const applied = body.nodeUpdates?.appliedCount ?? 0;
        setRollbackSnapshot(null);
        setNotice(`${copy.editorTranslationSaved} (${applied} nodes).`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.editorSaveFailed);
    } finally {
      setSaving(false);
    }
  }

  async function runAutoTranslate() {
    setAutoBusy(true);
    setError('');
    setNotice('');
    const rollbackValues = { ...values };
    try {
      const response = await fetch('/api/builder/translations/auto-translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId, pageId, sourceLocale, targetLocale }),
      });
      const body = (await response.json().catch(() => null)) as TranslationEditorAutoTranslateResponse | null;
      if (!response.ok) {
        setError(body?.error ?? `${copy.editorTranslationFailed} (${response.status})`);
        return;
      }
      const proposals = body?.proposals ?? [];
      if (proposals.length > 0) {
        setRollbackSnapshot({
          values: rollbackValues,
          proposalCount: proposals.length,
        });
      } else {
        setRollbackSnapshot(null);
      }
      setValues((previous) => {
        const next = { ...previous };
        for (const proposal of proposals) next[proposal.nodeId] = proposal.text;
        return next;
      });
      const errorsCount = body?.errors?.length ?? 0;
      setNotice(
        proposals.length === 0 && errorsCount === 0
          ? copy.editorNothingToTranslate
          : copy.editorAutoTranslateFilled(proposals.length, errorsCount),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.editorTranslationFailed);
    } finally {
      setAutoBusy(false);
    }
  }

  return (
    <div data-translation-editor="true">
      <TranslationEditorToolbar
        autoBusy={autoBusy}
        saving={saving}
        sourcesCount={sources.length}
        targetPageReady={targetPageReady}
        targetLocale={targetLocale}
        notice={notice}
        error={error}
        rollbackAvailable={Boolean(rollbackSnapshot)}
        copy={copy}
        onAutoTranslate={runAutoTranslate}
        onSave={saveAll}
        onRollback={revertAutoTranslate}
      />
      <TranslationEditorSeoSection
        sourceLocale={sourceLocale}
        targetLocale={targetLocale}
        initialSourceSeo={initialSourceSeo}
        seo={seo}
        copy={copy}
        onSeoChange={updateSeo}
      />
      <TranslationEditorTextSection
        sourceLocale={sourceLocale}
        targetLocale={targetLocale}
        sources={sources}
        values={values}
        copy={copy}
        onValueChange={updateValue}
      />
    </div>
  );
}
