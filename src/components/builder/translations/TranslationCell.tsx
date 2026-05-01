'use client';

import { useEffect, useRef, useState } from 'react';
import type { Locale } from '@/lib/locales';
import type { TranslationEntry, TranslationStatus } from '@/lib/builder/translations/types';
import { getTranslationStatus } from '@/lib/builder/translations/types';
import styles from './TranslationManager.module.css';

const statusClass: Record<TranslationStatus, string> = {
  translated: styles.statusTranslated,
  outdated: styles.statusOutdated,
  missing: styles.statusMissing,
  manual: styles.statusManual,
};

export default function TranslationCell({
  entry,
  locale,
  saving,
  translating,
  onSave,
  onTranslate,
}: {
  entry: TranslationEntry;
  locale: Locale;
  saving: boolean;
  translating: boolean;
  onSave: (key: string, locale: Locale, text: string, status: TranslationStatus) => Promise<void>;
  onTranslate: (entry: TranslationEntry, locale: Locale) => Promise<void>;
}) {
  const value = entry.translations[locale]?.text ?? '';
  const status = getTranslationStatus(entry, locale);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!editing) setDraft(value);
  }, [editing, value]);

  useEffect(() => {
    if (editing) textareaRef.current?.focus();
  }, [editing]);

  async function save() {
    await onSave(entry.key, locale, draft.trim(), draft.trim() ? 'manual' : 'missing');
    setEditing(false);
  }

  if (editing) {
    return (
      <div className={styles.editor}>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.preventDefault();
              setDraft(value);
              setEditing(false);
            }
            if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
              event.preventDefault();
              void save();
            }
          }}
        />
        <div className={styles.cellActions}>
          <button className={styles.smallButton} disabled={saving} type="button" onClick={() => void save()}>
            Save
          </button>
          <button
            className={styles.smallButton}
            disabled={saving}
            type="button"
            onClick={() => {
              setDraft(value);
              setEditing(false);
            }}
          >
            Cancel
          </button>
          <button
            className={styles.smallButton}
            disabled={translating || saving}
            type="button"
            onClick={() => {
              setEditing(false);
              void onTranslate(entry, locale);
            }}
          >
            AI translate
          </button>
        </div>
      </div>
    );
  }

  return (
    <button className={styles.cellDisplay} type="button" onClick={() => setEditing(true)}>
      <span
        aria-label={status}
        className={[styles.statusDot, statusClass[status]].join(' ')}
        title={status}
      />
      <span className={[styles.cellText, value ? '' : styles.placeholder].join(' ')}>
        {value || (status === 'outdated' ? 'Outdated translation' : 'Click to translate')}
      </span>
    </button>
  );
}
