'use client';

import { useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import type { Locale } from '@/lib/locales';
import type {
  TranslationCategorySummary,
  TranslationEntry,
  TranslationManagerPayload,
  TranslationStatus,
} from '@/lib/builder/translations/types';
import { getTranslationStatus } from '@/lib/builder/translations/types';
import TranslationCategoryTree from './TranslationCategoryTree';
import TranslationMatrix from './TranslationMatrix';
import TranslationProgress from './TranslationProgress';
import styles from './TranslationManager.module.css';

type StatusFilter = 'all' | TranslationStatus;

interface ApiPayload {
  ok?: boolean;
  error?: string;
  text?: string;
  payload?: TranslationManagerPayload;
}

interface BatchResult {
  key: string;
  ok: boolean;
  text?: string;
  error?: string;
}

export default function TranslationManagerView({
  initialPayload,
  routeLocale,
}: {
  initialPayload: TranslationManagerPayload;
  routeLocale: Locale;
}) {
  const [payload, setPayload] = useState(initialPayload);
  const [selectedCategory, setSelectedCategory] = useState<TranslationCategorySummary['key']>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');
  const [visibleTargets, setVisibleTargets] = useState<Set<Locale>>(
    () => new Set(initialPayload.targetLocales),
  );
  const [savingKeys, setSavingKeys] = useState<Set<string>>(() => new Set());
  const [translatingKeys, setTranslatingKeys] = useState<Set<string>>(() => new Set());
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const shownTargetLocales = useMemo(
    () => payload.targetLocales.filter((locale) => visibleTargets.has(locale)),
    [payload.targetLocales, visibleTargets],
  );

  const filteredEntries = useMemo(() => {
    const query = search.trim().toLowerCase();
    return payload.entries.filter((entry) => {
      if (selectedCategory !== 'all' && entry.content.category !== selectedCategory) return false;
      if (query) {
        const haystack = [
          entry.key,
          entry.sourceText,
          entry.content.label,
          entry.content.pageTitle,
          ...payload.targetLocales.map((locale) => entry.translations[locale]?.text ?? ''),
        ].join('\n').toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      if (statusFilter !== 'all') {
        return shownTargetLocales.some((locale) => getTranslationStatus(entry, locale) === statusFilter);
      }
      return true;
    });
  }, [payload.entries, payload.targetLocales, search, selectedCategory, shownTargetLocales, statusFilter]);

  function setBusy(setter: Dispatch<SetStateAction<Set<string>>>, key: string, busy: boolean) {
    setter((previous) => {
      const next = new Set(previous);
      if (busy) next.add(key);
      else next.delete(key);
      return next;
    });
  }

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
          sourceLocale: payload.sourceLocale,
        }),
      });
      const data = await response.json().catch(() => null) as ApiPayload | null;
      if (!response.ok || !data?.ok || !data.payload) {
        throw new Error(data?.error || `Save failed (${response.status})`);
      }
      setPayload(data.payload);
      setNotice('Translation saved.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Save failed');
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
        }),
      });
      const data = await response.json().catch(() => null) as ApiPayload | null;
      if (!response.ok || !data?.ok || typeof data.text !== 'string') {
        throw new Error(data?.error || `Translation unavailable (${response.status})`);
      }
      await saveTranslation(entry.key, targetLocale, data.text, 'translated', 'ai-openai');
    } catch (translateError) {
      setError(translateError instanceof Error ? translateError.message : 'Translation failed');
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
      setNotice(`No missing or outdated ${targetLocale} strings in this filter.`);
      return;
    }

    const keys = candidates.map((entry) => `${entry.key}:${targetLocale}`);
    setTranslatingKeys((previous) => new Set([...previous, ...keys]));
    setError('');
    try {
      const response = await fetch('/api/builder/translations/translate-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceLocale: payload.sourceLocale,
          targetLocale,
          entries: candidates.map((entry) => ({ key: entry.key, sourceText: entry.sourceText })),
          provider: 'openai',
        }),
      });
      const data = await response.json().catch(() => null) as {
        ok?: boolean;
        error?: string;
        results?: BatchResult[];
      } | null;
      if (!response.ok || !data?.ok || !Array.isArray(data.results)) {
        throw new Error(data?.error || `Batch translation unavailable (${response.status})`);
      }

      let saved = 0;
      let lastPayload: TranslationManagerPayload | null = null;
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
            sourceLocale: payload.sourceLocale,
          }),
        });
        const savedData = await saveResponse.json().catch(() => null) as ApiPayload | null;
        if (saveResponse.ok && savedData?.ok && savedData.payload) {
          saved += 1;
          lastPayload = savedData.payload;
        }
      }
      if (lastPayload) setPayload(lastPayload);
      setNotice(`AI translated ${saved}/${candidates.length} ${targetLocale} strings.`);
      if (saved === 0) {
        const firstError = data.results.find((result) => result.error)?.error;
        setError(firstError || 'No translations were returned.');
      }
    } catch (batchError) {
      setError(batchError instanceof Error ? batchError.message : 'Batch translation failed');
    } finally {
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
        body: JSON.stringify({ sourceLocale: payload.sourceLocale }),
      });
      const data = await response.json().catch(() => null) as TranslationManagerPayload | { ok?: false; error?: string } | null;
      if (!response.ok || !data?.ok) {
        throw new Error((data as { error?: string } | null)?.error || `Sync failed (${response.status})`);
      }
      setPayload(data as TranslationManagerPayload);
      setNotice('Source strings synced.');
    } catch (syncError) {
      setError(syncError instanceof Error ? syncError.message : 'Sync failed');
    }
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <p className={styles.eyebrow}>Builder</p>
          <h1 className={styles.title}>Translation Manager</h1>
          <p className={styles.meta}>
            Admin locale {routeLocale} - source {payload.sourceLocale}
          </p>
        </div>
        <TranslationCategoryTree
          categories={payload.categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </aside>

      <main className={styles.main}>
        <section className={styles.toolbar}>
          <div className={styles.toolbarRow}>
            <div>
              <h2 className={styles.toolbarTitle}>{filteredEntries.length} strings</h2>
              <p className={styles.meta}>Last sync {new Date(payload.syncedAt).toLocaleString()}</p>
            </div>
            <div className={styles.toolbarActions}>
              <input
                className={styles.input}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search source, target, key..."
                type="search"
              />
              <select
                className={styles.select}
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
              >
                <option value="all">All statuses</option>
                <option value="missing">Missing</option>
                <option value="outdated">Outdated</option>
                <option value="translated">Translated</option>
                <option value="manual">Manual</option>
              </select>
              <button className={styles.button} type="button" onClick={() => void refreshSync()}>
                Sync sources
              </button>
            </div>
          </div>

          <TranslationProgress progress={payload.progress} />

          <div className={styles.toolbarRow}>
            <div className={styles.localeToggles}>
              {payload.targetLocales.map((locale) => (
                <button
                  className={[styles.toggle, visibleTargets.has(locale) ? styles.toggleActive : ''].join(' ')}
                  key={locale}
                  type="button"
                  onClick={() => {
                    setVisibleTargets((previous) => {
                      const next = new Set(previous);
                      if (next.has(locale) && next.size > 1) next.delete(locale);
                      else next.add(locale);
                      return next;
                    });
                  }}
                >
                  {locale}
                </button>
              ))}
            </div>
            <div className={styles.toolbarActions}>
              {shownTargetLocales.map((locale) => (
                <button
                  className={[styles.button, styles.primaryButton].join(' ')}
                  key={locale}
                  type="button"
                  onClick={() => void translateBatch(locale)}
                >
                  AI translate missing - {locale}
                </button>
              ))}
            </div>
          </div>

          <div className={[styles.notice, error ? styles.noticeError : ''].join(' ')}>
            {error || notice || 'Inline edits save as manual translations. AI translation requires OPENAI_API_KEY.'}
          </div>
        </section>

        <TranslationMatrix
          entries={filteredEntries}
          sourceLocale={payload.sourceLocale}
          targetLocales={shownTargetLocales}
          savingKeys={savingKeys}
          translatingKeys={translatingKeys}
          onSave={saveTranslation}
          onTranslate={translateEntry}
        />
      </main>
    </div>
  );
}
