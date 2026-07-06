'use client';

import { useState } from 'react';
import type { Locale } from '@/lib/locales';
import type { TranslationManagerPayload } from '@/lib/builder/translations/types';
import TranslationCategoryTree from './TranslationCategoryTree';
import TranslationMatrix from './TranslationMatrix';
import TranslationManagerToolbar from './TranslationManagerToolbar';
import { useTranslationManagerActions } from './useTranslationManagerActions';
import { useTranslationManagerFilters } from './useTranslationManagerFilters';
import styles from './TranslationManager.module.css';
import { getTranslationCopy } from './translation-copy';

export default function TranslationManagerView({
  initialPayload,
  routeLocale,
  initialCategory = 'all',
  initialSearch = '',
  initialStatus = 'all',
  initialVisibleTargets,
}: {
  initialPayload: TranslationManagerPayload;
  routeLocale: Locale;
  initialCategory?: string;
  initialSearch?: string;
  initialStatus?: string;
  initialVisibleTargets?: string;
}) {
  const copy = getTranslationCopy(routeLocale);
  const [payload, setPayload] = useState(initialPayload);
  const [notice, setNotice] = useState('');
  const {
    selectedCategory,
    setSelectedCategory,
    statusFilter,
    setStatusFilter,
    search,
    setSearch,
    visibleTargets,
    setVisibleTargets,
    shownTargetLocales,
    filteredEntries,
    reviewSummary,
    reviewHref,
    resetReviewState,
  } = useTranslationManagerFilters({
    initialPayload,
    payload,
    copy,
    initialCategory,
    initialSearch,
    initialStatus,
    initialVisibleTargets,
    setNotice,
  });

  const {
    savingKeys,
    translatingKeys,
    batchProgress,
    error,
    saveTranslation,
    translateEntry,
    translateBatch,
    refreshSync,
  } = useTranslationManagerActions({
    payload,
    setPayload,
    setNotice,
    routeLocale,
    copy,
    filteredEntries,
  });

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <p className={styles.eyebrow}>Builder</p>
          <h1 className={styles.title}>{copy.managerTitle}</h1>
          <p className={styles.meta}>
            {copy.managerAdminLocale} {routeLocale} - {copy.managerSourceLocale} {payload.sourceLocale}
          </p>
        </div>
        <TranslationCategoryTree
          categories={payload.categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          locale={routeLocale}
        />
      </aside>

      <main className={styles.main}>
        <TranslationManagerToolbar
          copy={copy}
          error={error}
          notice={notice}
          filteredEntryCount={filteredEntries.length}
          payload={payload}
          routeLocale={routeLocale}
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          refreshSync={refreshSync}
          resetReviewState={resetReviewState}
          reviewHref={reviewHref}
          reviewSummary={reviewSummary}
          shownTargetLocales={shownTargetLocales}
          visibleTargets={visibleTargets}
          setVisibleTargets={setVisibleTargets}
          translateBatch={translateBatch}
          batchProgress={batchProgress}
        />

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
