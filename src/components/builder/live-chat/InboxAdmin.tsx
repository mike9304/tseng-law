'use client';

import { useEffect, useRef, useState } from 'react';
import type { ChatConversation, ChatMessage } from '@/lib/builder/live-chat/types';

type ConversationSafe = Omit<ChatConversation, 'visitorToken'>;

interface Props {
  initialConversations: ConversationSafe[];
}

export default function InboxAdmin({ initialConversations }: Props) {
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
    let cancelled = false;
    (async () => {
      const res = await fetch(`/api/builder/live-chat/${selectedId}`, { credentials: 'same-origin' });
      if (!res.ok || cancelled) return;
      const payload = (await res.json()) as { messages: ChatMessage[] };
      setMessages(payload.messages);
    })();

    // Subscribe to stream for live updates.
    if (sourceRef.current) sourceRef.current.close();
    const source = new EventSource(`/api/builder/live-chat/${selectedId}/stream`, { withCredentials: true });
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
      cancelled = true;
      source.close();
    };
  }, [selectedId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function refresh() {
    const res = await fetch('/api/builder/live-chat', { credentials: 'same-origin' });
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
        body: JSON.stringify({ body: draft.trim() }),
      });
      if (res.ok) {
        const payload = (await res.json()) as { at: string };
        setMessages((curr) => [
          ...curr,
          { messageId: `local-${Date.now()}`, conversationId: selectedId, role: 'admin', body: draft.trim(), at: payload.at, authorLabel: 'admin' },
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
      body: JSON.stringify({ status: 'closed' }),
    });
    await refresh();
  }

  const selected = conversations.find((c) => c.conversationId === selectedId) ?? null;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', height: 'calc(100vh - 120px)' }}>
      <aside style={{ borderRight: '1px solid #e2e8f0', overflowY: 'auto' }}>
        <div style={{ padding: 12, display: 'flex', alignItems: 'center', borderBottom: '1px solid #e2e8f0' }}>
          <strong style={{ fontSize: 13 }}>대화 ({conversations.length})</strong>
          <button type="button" onClick={refresh} style={{ marginLeft: 'auto', fontSize: 11, padding: '4px 8px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 4, cursor: 'pointer' }}>새로고침</button>
        </div>
        {conversations.length === 0 ? (
          <div style={{ padding: 24, textAlign: 'center', color: '#94a3b8', fontSize: 12 }}>대화가 없습니다.</div>
        ) : conversations.map((conv) => (
          <button
            key={conv.conversationId}
            type="button"
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
              <strong style={{ fontSize: 13 }}>{conv.visitorName ?? '익명 방문자'}</strong>
              {conv.unreadByAdmin > 0 ? (
                <span style={{ padding: '1px 6px', borderRadius: 999, background: '#dc2626', color: '#fff', fontSize: 10, fontWeight: 700 }}>{conv.unreadByAdmin}</span>
              ) : null}
              {conv.status === 'closed' ? <span style={{ fontSize: 10, color: '#94a3b8' }}>(closed)</span> : null}
            </div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{conv.visitorEmail ?? conv.pagePath ?? '—'}</div>
            <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>{new Date(conv.lastMessageAt).toLocaleString('ko-KR')}</div>
          </button>
        ))}
      </aside>

      <section style={{ display: 'flex', flexDirection: 'column' }}>
        {selected ? (
          <>
            <div style={{ padding: 12, borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 8 }}>
              <strong>{selected.visitorName ?? '익명 방문자'}</strong>
              <small style={{ color: '#64748b' }}>{selected.visitorEmail}</small>
              <button type="button" onClick={() => close(selected.conversationId)} disabled={selected.status === 'closed'} style={{ marginLeft: 'auto', padding: '4px 10px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 4, fontSize: 11, cursor: selected.status === 'closed' ? 'not-allowed' : 'pointer' }}>
                {selected.status === 'closed' ? '닫힘' : '대화 종료'}
              </button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: 16, background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {messages.map((m) => (
                <div key={m.messageId} style={{ alignSelf: m.role === 'admin' ? 'flex-end' : 'flex-start', maxWidth: '70%', background: m.role === 'admin' ? '#1d4ed8' : '#fff', color: m.role === 'admin' ? '#fff' : '#0f172a', padding: '8px 12px', borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }}>
                  <div style={{ fontSize: 10, opacity: 0.7, marginBottom: 2 }}>{m.authorLabel ?? m.role} · {new Date(m.at).toLocaleTimeString('ko-KR')}</div>
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
                placeholder="답장 입력..."
                disabled={selected.status === 'closed'}
                style={{ flex: 1, padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 14 }}
              />
              <button type="button" disabled={sending || !draft.trim() || selected.status === 'closed'} onClick={send} style={{ padding: '8px 16px', border: 0, background: sending || !draft.trim() || selected.status === 'closed' ? '#94a3b8' : '#0f172a', color: '#fff', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: sending ? 'not-allowed' : 'pointer' }}>
                보내기
              </button>
            </div>
          </>
        ) : (
          <div style={{ padding: 48, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>대화를 선택하세요.</div>
        )}
      </section>
    </div>
  );
}
