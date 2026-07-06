'use client';

import { useState, type Dispatch, type SetStateAction } from 'react';
import type { Locale } from '@/lib/locales';
import type {
  TranslationEntry,
  TranslationManagerPayload,
  TranslationStatus,
} from '@/lib/builder/translations/types';
import { getTranslationStatus } from '@/lib/builder/translations/types';
import type { TranslationCopy } from './translation-copy';
import type { ApiPayload, TranslationBatchProgressState } from './TranslationManagerView.types';
import { requestTranslationBatchStream } from './translation-batch-stream';

interface TranslationManagerActionArgs {
  readonly payload: TranslationManagerPayload;
  readonly setPayload: Dispatch<SetStateAction<TranslationManagerPayload>>;
  readonly setNotice: Dispatch<SetStateAction<string>>;
  readonly routeLocale: Locale;
  readonly copy: TranslationCopy;
  readonly filteredEntries: readonly TranslationEntry[];
}

function setBusy(setter: Dispatch<SetStateAction<Set<string>>>, key: string, busy: boolean) {
  setter((previous) => {
    const next = new Set(previous);
    if (busy) next.add(key);
    else next.delete(key);
    return next;
  });
}

export function useTranslationManagerActions({
  payload,
  setPayload,
  setNotice,
  routeLocale,
  copy,
  filteredEntries,
}: TranslationManagerActionArgs) {
  const [savingKeys, setSavingKeys] = useState<Set<string>>(() => new Set());
  const [translatingKeys, setTranslatingKeys] = useState<Set<string>>(() => new Set());
  const [batchProgress, setBatchProgress] = useState<TranslationBatchProgressState | null>(null);
  const [error, setError] = useState('');

  async function saveTranslation(
    key: string,
    targetLocale: Locale,
    text: string,
    status: TranslationStatus,
    provider: 'manual' | 'ai-openai' | 'mock' = 'manual',
  ) {
    const operationKey = `${key}:${targetLocale}`;
    setBusy(setSavingKeys, operationKey, true);
    setError('');
    try {
      const response = await fetch('/api/builder/translations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key,
          targetLocale,
          text,
          status,
          provider,
          locale: routeLocale,
          sourceLocale: payload.sourceLocale,
        }),
      });
      const data = await response.json().catch(() => null) as ApiPayload | null;
      if (!response.ok || !data?.ok || !data.payload) {
        throw new Error(data?.error || `${copy.managerSaveFailed} (${response.status})`);
      }
      setPayload(data.payload);
      setNotice(copy.managerTranslationSaved);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : copy.managerSaveFailed);
    } finally {
      setBusy(setSavingKeys, operationKey, false);
    }
  }

  async function translateEntry(entry: TranslationEntry, targetLocale: Locale) {
    const operationKey = `${entry.key}:${targetLocale}`;
    setBusy(setTranslatingKeys, operationKey, true);
    setError('');
    try {
      const response = await fetch('/api/builder/translations/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceLocale: payload.sourceLocale,
          targetLocale,
          sourceText: entry.sourceText,
          provider: 'openai',
          locale: routeLocale,
        }),
      });
      const data = await response.json().catch(() => null) as ApiPayload | null;
      if (!response.ok || !data?.ok || typeof data.text !== 'string') {
        throw new Error(data?.error || `${copy.managerTranslationUnavailable} (${response.status})`);
      }
      await saveTranslation(entry.key, targetLocale, data.text, 'translated', 'ai-openai');
    } catch (translateError) {
      setError(translateError instanceof Error ? translateError.message : copy.managerTranslationFailed);
    } finally {
      setBusy(setTranslatingKeys, operationKey, false);
    }
  }

  async function translateBatch(targetLocale: Locale) {
    const candidates = filteredEntries
      .filter((entry) => {
        const status = getTranslationStatus(entry, targetLocale);
        return status === 'missing' || status === 'outdated';
      })
      .slice(0, 25);
    if (candidates.length === 0) {
      setNotice(copy.managerNoMissingOrOutdated(targetLocale));
      return;
    }

    const keys = candidates.map((entry) => `${entry.key}:${targetLocale}`);
    setTranslatingKeys((previous) => new Set([...previous, ...keys]));
    setBatchProgress({
      locale: targetLocale,
      total: candidates.length,
      saved: 0,
      failed: 0,
      stage: 'translating',
    });
    setError('');
    try {
      const data = await requestTranslationBatchStream({
        sourceLocale: payload.sourceLocale,
        targetLocale,
        entries: candidates.map((entry) => ({ key: entry.key, sourceText: entry.sourceText })),
        provider: 'openai',
        locale: routeLocale,
      }, (summary) => {
        setBatchProgress({
          locale: targetLocale,
          total: candidates.length,
          saved: 0,
          failed: 0,
          stage: 'translating',
          summary,
        });
      });
      if (!data.ok || !Array.isArray(data.results)) {
        throw new Error(data.error || copy.managerBatchUnavailable);
      }

      const summary = data.summary;
      let saved = 0;
      let failed = data.results.filter((result) => !result.ok || typeof result.text !== 'string').length;
      let lastPayload: TranslationManagerPayload | null = null;
      setBatchProgress({
        locale: targetLocale,
        total: candidates.length,
        saved,
        failed,
        stage: 'saving',
        summary,
      });
      for (const result of data.results) {
        if (!result.ok || typeof result.text !== 'string') continue;
        const saveResponse = await fetch('/api/builder/translations', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            key: result.key,
            targetLocale,
            text: result.text,
            status: 'translated',
            provider: 'ai-openai',
            locale: routeLocale,
            sourceLocale: payload.sourceLocale,
          }),
        });
        const savedData = await saveResponse.json().catch(() => null) as ApiPayload | null;
        if (saveResponse.ok && savedData?.ok && savedData.payload) {
          saved += 1;
          lastPayload = savedData.payload;
        } else {
          failed += 1;
        }
        setBatchProgress({
          locale: targetLocale,
          total: candidates.length,
          saved,
          failed,
          stage: 'saving',
          summary,
        });
      }
      if (lastPayload) setPayload(lastPayload);
      setNotice(copy.managerAiTranslatedBatch(saved, candidates.length, targetLocale));
      if (saved === 0) {
        const firstError = data.results.find((result) => result.error)?.error;
        setError(firstError || copy.managerNoReturnedTranslations);
      }
    } catch (batchError) {
      setError(batchError instanceof Error ? batchError.message : copy.managerBatchFailed);
    } finally {
      setBatchProgress(null);
      setTranslatingKeys((previous) => {
        const next = new Set(previous);
        for (const key of keys) next.delete(key);
        return next;
      });
    }
  }

  async function refreshSync() {
    setError('');
    try {
      const response = await fetch('/api/builder/translations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceLocale: payload.sourceLocale, locale: routeLocale }),
      });
      const data = await response.json().catch(() => null) as TranslationManagerPayload | { ok?: false; error?: string } | null;
      if (!response.ok || !data?.ok) {
        throw new Error((data as { error?: string } | null)?.error || copy.managerSyncFailed(response.status));
      }
      setPayload(data as TranslationManagerPayload);
      setNotice(copy.managerSourceStringsSynced);
    } catch (syncError) {
      setError(syncError instanceof Error ? syncError.message : copy.managerTranslationUnavailable);
    }
  }

  return {
    savingKeys,
    translatingKeys,
    batchProgress,
    error,
    saveTranslation,
    translateEntry,
    translateBatch,
    refreshSync,
  };
}
