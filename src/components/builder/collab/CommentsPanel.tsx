'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

interface CollabComment {
  id: string;
  siteId: string;
  pageId: string;
  nodeId?: string;
  author: string;
  body: string;
  createdAt: string;
  resolvedAt?: string;
}

interface CommentsPanelProps {
  pageId: string;
  siteId?: string;
  /** Currently selected node id; enables the "attach to node" checkbox. */
  selectedNodeId?: string;
}

const POLL_MS = 12_000;

function relativeAgo(iso: string, now: number = Date.now()): string {
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return '';
  const diff = Math.max(0, Math.round((now - t) / 1000));
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3_600) return `${Math.round(diff / 60)}m ago`;
  if (diff < 86_400) return `${Math.round(diff / 3_600)}h ago`;
  return `${Math.round(diff / 86_400)}d ago`;
}

export default function CommentsPanel(props: CommentsPanelProps) {
  const { pageId, selectedNodeId } = props;
  const siteId = props.siteId ?? 'default';

  const [comments, setComments] = useState<CollabComment[]>([]);
  const [includeResolved, setIncludeResolved] = useState(false);
  const [draft, setDraft] = useState('');
  const [attachToNode, setAttachToNode] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedNodeId) setAttachToNode(false);
  }, [selectedNodeId]);

  const fetchComments = useCallback(async () => {
    try {
      const params = new URLSearchParams({ siteId, pageId });
      if (includeResolved) params.set('includeResolved', '1');
      const res = await fetch(`/api/builder/collab/comments?${params.toString()}`, {
        credentials: 'include',
      });
      if (!res.ok) return;
      const data = (await res.json()) as { comments?: CollabComment[] };
      if (Array.isArray(data.comments)) setComments(data.comments);
    } catch {
      /* swallow */
    }
  }, [siteId, pageId, includeResolved]);

  useEffect(() => {
    fetchComments();
    const id = setInterval(fetchComments, POLL_MS);
    return () => clearInterval(id);
  }, [fetchComments]);

  const submit = useCallback(async () => {
    const body = draft.trim();
    if (!body || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/builder/collab/comments', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId,
          pageId,
          body,
          nodeId: attachToNode && selectedNodeId ? selectedNodeId : undefined,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error ?? `Failed (${res.status})`);
        return;
      }
      setDraft('');
      await fetchComments();
    } finally {
      setBusy(false);
    }
  }, [draft, busy, siteId, pageId, attachToNode, selectedNodeId, fetchComments]);

  const toggleResolved = useCallback(async (comment: CollabComment) => {
    const action = comment.resolvedAt ? 'reopen' : 'resolve';
    const params = new URLSearchParams({ siteId, pageId });
    try {
      const res = await fetch(
        `/api/builder/collab/comments/${encodeURIComponent(comment.id)}?${params.toString()}`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action }),
        },
      );
      if (res.ok) await fetchComments();
    } catch {
      /* swallow */
    }
  }, [siteId, pageId, fetchComments]);

  const removeComment = useCallback(async (comment: CollabComment) => {
    const params = new URLSearchParams({ siteId, pageId });
    try {
      const res = await fetch(
        `/api/builder/collab/comments/${encodeURIComponent(comment.id)}?${params.toString()}`,
        {
          method: 'DELETE',
          credentials: 'include',
        },
      );
      if (res.ok) await fetchComments();
    } catch {
      /* swallow */
    }
  }, [siteId, pageId, fetchComments]);

  const ordered = useMemo(() => comments, [comments]);

  return (
    <aside
      data-builder-comments-panel=""
      aria-label="Page comments"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        padding: 16,
        background: '#0f172a',
        color: '#f8fafc',
        width: 320,
        maxHeight: '100%',
        boxSizing: 'border-box',
        fontFamily: 'inherit',
      }}
    >
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <strong style={{ fontSize: 14 }}>Comments</strong>
        <label style={{ fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <input
            type="checkbox"
            checked={includeResolved}
            onChange={(event) => setIncludeResolved(event.target.checked)}
            data-builder-comments-include-resolved=""
          />
          Show resolved
        </label>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Add a comment..."
          rows={3}
          data-builder-comments-input=""
          style={{
            background: '#1e293b',
            color: '#f8fafc',
            border: '1px solid #334155',
            borderRadius: 6,
            padding: 8,
            fontSize: 13,
            resize: 'vertical',
          }}
        />
        <label
          style={{
            fontSize: 12,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            opacity: selectedNodeId ? 1 : 0.5,
          }}
        >
          <input
            type="checkbox"
            disabled={!selectedNodeId}
            checked={attachToNode}
            onChange={(event) => setAttachToNode(event.target.checked)}
            data-builder-comments-attach=""
          />
          Attach to selected node{selectedNodeId ? ` (${selectedNodeId})` : ''}
        </label>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: '#fca5a5' }}>{error ?? ''}</span>
          <button
            type="button"
            onClick={submit}
            disabled={busy || draft.trim().length === 0}
            data-builder-comments-submit=""
            style={{
              background: '#6366f1',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              padding: '6px 12px',
              fontSize: 13,
              cursor: busy || draft.trim().length === 0 ? 'default' : 'pointer',
              opacity: busy || draft.trim().length === 0 ? 0.6 : 1,
            }}
          >
            {busy ? 'Posting…' : 'Post comment'}
          </button>
        </div>
      </div>

      <ul
        data-builder-comments-list=""
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          overflowY: 'auto',
        }}
      >
        {ordered.length === 0 ? (
          <li style={{ fontSize: 12, color: '#94a3b8' }}>No comments yet.</li>
        ) : null}
        {ordered.map((comment) => (
          <li
            key={comment.id}
            data-builder-comment=""
            data-builder-comment-id={comment.id}
            data-builder-comment-resolved={comment.resolvedAt ? 'true' : 'false'}
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: 6,
              padding: 10,
              opacity: comment.resolvedAt ? 0.65 : 1,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#cbd5f5' }}>
              <span><strong>{comment.author}</strong> · {relativeAgo(comment.createdAt)}</span>
              {comment.nodeId ? (
                <code style={{ fontSize: 11, color: '#94a3b8' }}>#{comment.nodeId}</code>
              ) : null}
            </div>
            <p style={{ margin: '6px 0 8px', fontSize: 13, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {comment.body}
            </p>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                type="button"
                onClick={() => toggleResolved(comment)}
                data-builder-comments-toggle-resolved=""
                style={{
                  background: 'transparent',
                  color: comment.resolvedAt ? '#fbbf24' : '#34d399',
                  border: '1px solid currentColor',
                  borderRadius: 4,
                  padding: '2px 8px',
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                {comment.resolvedAt ? 'Reopen' : 'Resolve'}
              </button>
              <button
                type="button"
                onClick={() => removeComment(comment)}
                data-builder-comments-delete=""
                style={{
                  background: 'transparent',
                  color: '#f87171',
                  border: '1px solid currentColor',
                  borderRadius: 4,
                  padding: '2px 8px',
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}