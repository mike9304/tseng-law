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

interface Props {
  selectedNodeId: string | null;
  authorLabel?: string;
}

/**
 * Phase 28 W224 — Element comments thread (designer 주석).
 *
 * Threads are scoped per node id. Comments live in editor preferences
 * (localStorage). Multi-user merging is a follow-up; this surface lets a
 * single designer leave notes against any selected node.
 */
export default function ElementCommentsPanel({ selectedNodeId, authorLabel = 'designer' }: Props) {
  const [comments, setComments] = useState<ElementComment[]>([]);
  const [draft, setDraft] = useState('');

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
      author: authorLabel,
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
      <div data-builder-element-comments="empty" style={{ padding: 12, color: '#94a3b8', fontSize: 12 }}>
        노드를 선택하면 주석을 추가할 수 있습니다.
      </div>
    );
  }

  return (
    <div data-builder-element-comments={selectedNodeId} style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12 }}>
      <strong style={{ fontSize: 11, color: '#475569', textTransform: 'uppercase' }}>
        주석 · {scoped.length}
      </strong>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {scoped.length === 0 ? (
          <li style={{ color: '#94a3b8' }}>아직 주석이 없습니다.</li>
        ) : (
          scoped.map((c) => (
            <li
              key={c.id}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                padding: 8,
                background: c.resolvedAt ? '#f8fafc' : '#ffffff',
                opacity: c.resolvedAt ? 0.7 : 1,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#94a3b8' }}>
                <span>{c.author} · {new Date(c.createdAt).toLocaleString()}</span>
                {c.resolvedAt ? <em>resolved</em> : null}
              </div>
              <p style={{ margin: '4px 0 6px', fontSize: 13, color: '#0f172a', whiteSpace: 'pre-wrap' }}>{c.body}</p>
              <div style={{ display: 'flex', gap: 6 }}>
                {!c.resolvedAt ? (
                  <button
                    type="button"
                    onClick={() => resolve(c.id)}
                    style={{ fontSize: 11, padding: '3px 8px', border: '1px solid #cbd5e1', background: '#ffffff', borderRadius: 6, cursor: 'pointer' }}
                  >
                    해결
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => remove(c.id)}
                  style={{ fontSize: 11, padding: '3px 8px', border: '1px solid #fecaca', color: '#b91c1c', background: '#ffffff', borderRadius: 6, cursor: 'pointer' }}
                >
                  삭제
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
      <form onSubmit={addComment} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <textarea
          rows={2}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="이 노드에 대한 주석..."
          data-builder-comment-input="true"
          style={{ padding: 6, fontSize: 12, border: '1px solid #cbd5e1', borderRadius: 6, fontFamily: 'inherit', resize: 'vertical' }}
        />
        <button
          type="submit"
          data-builder-comment-submit="true"
          disabled={!draft.trim()}
          style={{
            alignSelf: 'flex-end',
            padding: '6px 12px',
            border: 0,
            background: draft.trim() ? '#0f172a' : '#cbd5e1',
            color: '#ffffff',
            borderRadius: 6,
            cursor: draft.trim() ? 'pointer' : 'not-allowed',
            fontWeight: 700,
            fontSize: 12,
          }}
        >
          댓글 추가
        </button>
      </form>
    </div>
  );
}
