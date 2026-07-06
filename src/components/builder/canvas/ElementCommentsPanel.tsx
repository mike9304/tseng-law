'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  BUILDER_EDITOR_PREFS_EVENT,
  DEFAULT_EDITOR_PREFS,
  loadEditorPreferences,
  makeCommentId,
  saveAndBroadcastEditorPreferences,
  type EditorPreferences,
  type ElementComment,
} from '@/lib/builder/canvas/editor-prefs';
import type { Locale } from '@/lib/locales';
import { getElementCommentsPanelCopy } from './element-comments-panel-copy';
import styles from './ElementCommentsPanel.module.css';

interface Props {
  selectedNodeId: string | null;
  authorLabel?: string;
  locale?: Locale;
}

/**
 * Phase 28 W224 — Element comments thread (designer 주석).
 *
 * Threads are scoped per node id. Comments live in editor preferences
 * (localStorage). Multi-user merging is a follow-up; this surface lets a
 * single designer leave notes against any selected node.
 */
export default function ElementCommentsPanel({ selectedNodeId, authorLabel, locale = 'ko' }: Props) {
  const [comments, setComments] = useState<ElementComment[]>([]);
  const [draft, setDraft] = useState('');
  const copy = getElementCommentsPanelCopy(locale);
  const commentAuthorLabel = authorLabel ?? copy.defaultAuthorLabel;

  useEffect(() => {
    setComments(loadEditorPreferences().comments);
    function handlePrefsChange(event: Event) {
      const prefs = (event as CustomEvent<EditorPreferences>).detail ?? loadEditorPreferences();
      setComments(prefs.comments);
    }
    document.addEventListener(BUILDER_EDITOR_PREFS_EVENT, handlePrefsChange);
    return () => document.removeEventListener(BUILDER_EDITOR_PREFS_EVENT, handlePrefsChange);
  }, []);

  const scoped = useMemo(
    () => comments.filter((c) => selectedNodeId && c.nodeId === selectedNodeId),
    [comments, selectedNodeId],
  );

  function persistAll(next: ElementComment[]) {
    const prefs = loadEditorPreferences() ?? DEFAULT_EDITOR_PREFS;
    saveAndBroadcastEditorPreferences({ ...prefs, comments: next });
    setComments(next);
  }

  function addComment(event: FormEvent) {
    event.preventDefault();
    if (!selectedNodeId) return;
    const body = draft.trim();
    if (!body) return;
    const comment: ElementComment = {
      id: makeCommentId(),
      nodeId: selectedNodeId,
      author: commentAuthorLabel,
      body: body.slice(0, 2000),
      createdAt: new Date().toISOString(),
    };
    persistAll([...comments, comment]);
    setDraft('');
  }

  function resolve(id: string) {
    persistAll(comments.map((c) => (c.id === id ? { ...c, resolvedAt: new Date().toISOString() } : c)));
  }

  function remove(id: string) {
    persistAll(comments.filter((c) => c.id !== id));
  }

  if (!selectedNodeId) {
    return (
      <div className={styles.emptyState} data-builder-element-comments="empty">
        {copy.noSelectionLabel}
      </div>
    );
  }

  return (
    <div className={styles.root} data-builder-element-comments={selectedNodeId}>
      <div className={styles.header}>
        <strong className={styles.title}>
          {copy.titleLabel(scoped.length)}
        </strong>
      </div>
      <ul className={styles.list}>
        {scoped.length === 0 ? (
          <li className={styles.emptyThread}>{copy.emptyLabel}</li>
        ) : (
          scoped.map((c) => (
            <li
              key={c.id}
              className={styles.commentCard}
              data-resolved={c.resolvedAt ? 'true' : 'false'}
            >
              <div className={styles.commentMeta}>
                <span className={styles.commentAuthor}>{c.author} · {new Date(c.createdAt).toLocaleString(copy.dateTimeLocale)}</span>
                {c.resolvedAt ? <em className={styles.resolvedBadge}>{copy.resolvedLabel}</em> : null}
              </div>
              <p className={styles.commentBody}>{c.body}</p>
              <div className={styles.actions}>
                {!c.resolvedAt ? (
                  <button
                    type="button"
                    onClick={() => resolve(c.id)}
                    className={styles.actionButton}
                  >
                    {copy.resolveLabel}
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => remove(c.id)}
                  className={styles.actionButton}
                  data-tone="danger"
                >
                  {copy.deleteLabel}
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
      <form className={styles.form} onSubmit={addComment}>
        <textarea
          rows={2}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={copy.placeholder}
          data-builder-comment-input="true"
          className={styles.textarea}
        />
        <button
          type="submit"
          data-builder-comment-submit="true"
          disabled={!draft.trim()}
          className={styles.submitButton}
        >
          {copy.submitLabel}
        </button>
      </form>
    </div>
  );
}
