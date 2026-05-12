'use client';

import { useEffect, useRef, useState } from 'react';
import { usePublishedOverlayFocus } from './overlayFocus';

interface ChatMessage {
  messageId: string;
  role: 'visitor' | 'admin' | 'system';
  body: string;
  at: string;
  authorLabel?: string;
}

const STORAGE_KEY = 'tw_live_chat_session_v1';

interface Persisted {
  conversationId: string;
  visitorToken: string;
}

function loadSession(): Persisted | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Persisted;
  } catch {
    return null;
  }
}

function saveSession(session: Persisted): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    /* ignore */
  }
}

/**
 * PR #14 follow-up — Public chat widget.
 *
 * Floating bubble at bottom-right. On first open, the visitor sees a name
 * + email + message form; on submit we hit /api/live-chat/start and store
 * the visitorToken in localStorage. Subsequent visits resume the
 * conversation via /api/live-chat/stream (SSE).
 */
export default function LiveChatWidget({ enabled = true }: { enabled?: boolean }) {
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<Persisted | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const sourceRef = useRef<EventSource | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const draftInputRef = useRef<HTMLInputElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const restoreTriggerOnCloseRef = useRef(false);

  useEffect(() => {
    setSession(loadSession());
  }, []);

  useEffect(() => {
    if (!open || !session) return;
    if (sourceRef.current) sourceRef.current.close();
    const source = new EventSource(
      `/api/live-chat/stream?conversationId=${encodeURIComponent(session.conversationId)}&visitorToken=${encodeURIComponent(session.visitorToken)}`,
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
    return () => source.close();
  }, [open, session]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function closeChat(restoreTrigger = true) {
    restoreTriggerOnCloseRef.current = restoreTrigger;
    setOpen(false);
  }

  useEffect(() => {
    if (open || !restoreTriggerOnCloseRef.current) return undefined;
    restoreTriggerOnCloseRef.current = false;
    const frame = window.requestAnimationFrame(() => {
      triggerRef.current?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  usePublishedOverlayFocus({
    open,
    overlayRef: panelRef,
    initialFocusRef: draftInputRef,
    openerRef,
  });

  useEffect(() => {
    if (!open) return undefined;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopPropagation();
      closeChat(true);
    }
    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [open]);

  async function startConversation() {
    if (!draft.trim()) return;
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/live-chat/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorName: name.trim() || undefined,
          visitorEmail: email.trim() || undefined,
          pagePath: typeof window !== 'undefined' ? window.location.pathname : undefined,
          message: draft.trim(),
        }),
      });
      const payload = (await res.json().catch(() => ({}))) as { conversationId?: string; visitorToken?: string; error?: string };
      if (!res.ok || !payload.conversationId || !payload.visitorToken) {
        setError(payload.error ?? '시작 실패');
        return;
      }
      const next: Persisted = { conversationId: payload.conversationId, visitorToken: payload.visitorToken };
      saveSession(next);
      setSession(next);
      setMessages([{ messageId: `local-${Date.now()}`, role: 'visitor', body: draft.trim(), at: new Date().toISOString() }]);
      setDraft('');
    } finally {
      setSending(false);
    }
  }

  async function sendMessage() {
    if (!session || !draft.trim()) return;
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/live-chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: session.conversationId,
          visitorToken: session.visitorToken,
          body: draft.trim(),
        }),
      });
      if (res.ok) {
        const payload = (await res.json()) as { at: string };
        setMessages((curr) => [
          ...curr,
          { messageId: `local-${Date.now()}`, role: 'visitor', body: draft.trim(), at: payload.at },
        ]);
        setDraft('');
      } else {
        const payload = (await res.json().catch(() => ({}))) as { error?: string };
        setError(payload.error ?? '전송 실패');
      }
    } finally {
      setSending(false);
    }
  }

  if (!enabled) return null;

  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999, fontFamily: 'system-ui, sans-serif' }}>
      {open ? (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="호정국제 상담"
          tabIndex={-1}
          style={{ width: 320, height: 460, background: '#fff', borderRadius: 12, boxShadow: '0 12px 32px rgba(15,23,42,0.18)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}
        >
          <header style={{ padding: 12, background: '#0f172a', color: '#fff', borderTopLeftRadius: 12, borderTopRightRadius: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <strong style={{ fontSize: 14 }}>호정국제 상담</strong>
            <button type="button" onClick={() => closeChat(true)} style={{ marginLeft: 'auto', background: 'transparent', border: 0, color: '#fff', cursor: 'pointer', fontSize: 18 }} aria-label="닫기">×</button>
          </header>
          <div style={{ flex: 1, overflowY: 'auto', padding: 12, background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {!session ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <p style={{ margin: 0, fontSize: 12, color: '#475569' }}>이름과 이메일은 선택 사항입니다.</p>
                <input type="text" placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }} />
                <input type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }} />
              </div>
            ) : null}
            {messages.map((m) => (
              <div key={m.messageId} style={{ alignSelf: m.role === 'visitor' ? 'flex-end' : 'flex-start', maxWidth: '85%', background: m.role === 'visitor' ? '#1d4ed8' : '#fff', color: m.role === 'visitor' ? '#fff' : '#0f172a', padding: '8px 12px', borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }}>
                {m.body}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div style={{ padding: 8, borderTop: '1px solid #e2e8f0', display: 'flex', gap: 6 }}>
            <input
              ref={draftInputRef}
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !sending) {
                  void (session ? sendMessage() : startConversation());
                }
              }}
              placeholder={session ? '메시지를 입력하세요...' : '문의 내용을 입력하세요'}
              disabled={sending}
              style={{ flex: 1, padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }}
            />
            <button type="button" disabled={sending || !draft.trim()} onClick={() => (session ? sendMessage() : startConversation())} style={{ padding: '8px 14px', border: 0, background: sending || !draft.trim() ? '#94a3b8' : '#0f172a', color: '#fff', borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: sending ? 'not-allowed' : 'pointer' }}>
              {session ? '전송' : '시작'}
            </button>
          </div>
          {error ? <div style={{ padding: '0 12px 8px', fontSize: 11, color: '#dc2626' }}>{error}</div> : null}
        </div>
      ) : (
        <button
          ref={triggerRef}
          type="button"
          onClick={(event) => {
            openerRef.current = event.currentTarget;
            restoreTriggerOnCloseRef.current = false;
            setOpen(true);
          }}
          aria-label="실시간 상담 열기"
          style={{ width: 56, height: 56, borderRadius: '50%', border: 0, background: '#0f172a', color: '#fff', fontSize: 22, boxShadow: '0 10px 20px rgba(15,23,42,0.32)', cursor: 'pointer' }}
        >
          💬
        </button>
      )}
    </div>
  );
}
