'use client';

import { useEffect, useRef, useState } from 'react';
import type { ChatConversation, ChatMessage } from '@/lib/builder/live-chat/types';
import type { Locale } from '@/lib/locales';
import { getLiveChatInboxCopy } from './inbox-copy';
import { formatDateTime, formatTime } from '@/lib/builder/format/datetime';

type ConversationSafe = Omit<ChatConversation, 'visitorToken'>;

interface Props {
  locale: Locale;
  initialConversations: ConversationSafe[];
}

export default function InboxAdmin({ locale, initialConversations }: Props) {
  const copy = getLiveChatInboxCopy(locale);
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedId, setSelectedId] = useState<string | null>(initialConversations[0]?.conversationId ?? null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const sourceRef = useRef<EventSource | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!selectedId) {
      setMessages([]);
      return;
    }
    // Reset to empty; SSE will dump the initial history. We avoid the
    // race where the parallel HTTP GET landed after live messages and
    // clobbered them — instead just hit the GET to reset unread.
    setMessages([]);
    void fetch(
      `/api/builder/live-chat/${selectedId}?locale=${encodeURIComponent(locale)}`,
      { credentials: 'same-origin' },
    ).catch(() => undefined);

    if (sourceRef.current) sourceRef.current.close();
    const source = new EventSource(
      `/api/builder/live-chat/${selectedId}/stream?locale=${encodeURIComponent(locale)}`,
      { withCredentials: true },
    );
    source.addEventListener('message', (event) => {
      try {
        const msg = JSON.parse(event.data as string) as ChatMessage;
        setMessages((curr) => (curr.some((m) => m.messageId === msg.messageId) ? curr : [...curr, msg]));
      } catch {
        /* ignore malformed */
      }
    });
    sourceRef.current = source;
    return () => {
      source.close();
    };
  }, [selectedId, locale]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function refresh() {
    const res = await fetch(
      `/api/builder/live-chat?locale=${encodeURIComponent(locale)}`,
      { credentials: 'same-origin' },
    );
    if (!res.ok) return;
    const payload = (await res.json()) as { conversations: ConversationSafe[] };
    setConversations(payload.conversations);
  }

  async function send() {
    if (!selectedId || !draft.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`/api/builder/live-chat/${selectedId}/send`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: draft.trim(), authorLabel: copy.adminAuthorLabel, locale }),
      });
      if (res.ok) {
        const payload = (await res.json()) as { at: string };
        setMessages((curr) => [
          ...curr,
          { messageId: `local-${Date.now()}`, conversationId: selectedId, role: 'admin', body: draft.trim(), at: payload.at, authorLabel: copy.adminAuthorLabel },
        ]);
        setDraft('');
      }
    } finally {
      setSending(false);
    }
  }

  async function close(id: string) {
    await fetch(`/api/builder/live-chat/${id}`, {
      method: 'PATCH',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'closed', locale }),
    });
    await refresh();
  }

  const selected = conversations.find((c) => c.conversationId === selectedId) ?? null;

  return (
    <div data-inbox-admin-shell="true" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', height: 'calc(100vh - 120px)' }}>
      <aside style={{ borderRight: '1px solid #e2e8f0', overflowY: 'auto' }}>
        <div style={{ padding: 12, display: 'flex', alignItems: 'center', borderBottom: '1px solid #e2e8f0' }}>
          <strong style={{ fontSize: 13 }}>{copy.conversationsLabel(conversations.length)}</strong>
          <button type="button" data-inbox-refresh="true" onClick={refresh} style={{ marginLeft: 'auto', fontSize: 11, padding: '4px 8px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 4, cursor: 'pointer' }}>{copy.refreshLabel}</button>
        </div>
        {conversations.length === 0 ? (
          <div data-inbox-empty="true" style={{ padding: 24, textAlign: 'center', color: '#94a3b8', fontSize: 12 }}>{copy.emptyLabel}</div>
        ) : conversations.map((conv) => (
          <button
            key={conv.conversationId}
            type="button"
            data-inbox-conversation-item={conv.conversationId}
            onClick={() => setSelectedId(conv.conversationId)}
            style={{
              width: '100%',
              padding: 12,
              border: 0,
              borderBottom: '1px solid #e2e8f0',
              background: selectedId === conv.conversationId ? '#dbeafe' : '#fff',
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <strong style={{ fontSize: 13 }}>{conv.visitorName ?? copy.anonymousVisitorLabel}</strong>
              {conv.unreadByAdmin > 0 ? (
                <span style={{ padding: '1px 6px', borderRadius: 999, background: '#dc2626', color: '#fff', fontSize: 10, fontWeight: 700 }}>{conv.unreadByAdmin}</span>
              ) : null}
              {conv.status === 'closed' ? <span data-inbox-status="closed" style={{ fontSize: 10, color: '#94a3b8' }}>({copy.closedLabel})</span> : null}
            </div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{conv.visitorEmail ?? conv.pagePath ?? '—'}</div>
            <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>{formatDateTime(conv.lastMessageAt, locale)}</div>
          </button>
        ))}
      </aside>

      <section style={{ display: 'flex', flexDirection: 'column' }}>
        {selected ? (
          <>
            <div style={{ padding: 12, borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 8 }}>
              <strong>{selected.visitorName ?? copy.anonymousVisitorLabel}</strong>
              <small style={{ color: '#64748b' }}>{selected.visitorEmail}</small>
              <button type="button" data-inbox-close="true" onClick={() => close(selected.conversationId)} disabled={selected.status === 'closed'} style={{ marginLeft: 'auto', padding: '4px 10px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 4, fontSize: 11, cursor: selected.status === 'closed' ? 'not-allowed' : 'pointer' }}>
                {selected.status === 'closed' ? copy.closedLabel : copy.closeConversationLabel}
              </button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: 16, background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {messages.map((m) => (
                <div key={m.messageId} style={{ alignSelf: m.role === 'admin' ? 'flex-end' : 'flex-start', maxWidth: '70%', background: m.role === 'admin' ? '#1d4ed8' : '#fff', color: m.role === 'admin' ? '#fff' : '#0f172a', padding: '8px 12px', borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }}>
                  <div style={{ fontSize: 10, opacity: 0.7, marginBottom: 2 }}>{m.authorLabel ?? (m.role === 'admin' ? copy.adminAuthorLabel : m.role === 'visitor' ? copy.visitorAuthorLabel : copy.systemAuthorLabel)} · {formatTime(m.at, locale)}</div>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{m.body}</div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div style={{ padding: 12, borderTop: '1px solid #e2e8f0', display: 'flex', gap: 8 }}>
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !sending) send(); }}
                placeholder={copy.replyPlaceholder}
                disabled={selected.status === 'closed'}
                style={{ flex: 1, padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 14 }}
              />
              <button type="button" data-inbox-send="true" disabled={sending || !draft.trim() || selected.status === 'closed'} onClick={send} style={{ padding: '8px 16px', border: 0, background: sending || !draft.trim() || selected.status === 'closed' ? '#94a3b8' : '#0f172a', color: '#fff', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: sending ? 'not-allowed' : 'pointer' }}>
                {copy.sendLabel}
              </button>
            </div>
          </>
        ) : (
          <div data-inbox-empty-thread="true" style={{ padding: 48, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>{copy.selectConversationLabel}</div>
        )}
      </section>
    </div>
  );
}
