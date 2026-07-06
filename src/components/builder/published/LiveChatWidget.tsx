'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { LiveChatLauncherPlacement } from '@/lib/builder/live-chat/app-settings';
import { getLiveChatWidgetCopy } from '@/lib/builder/live-chat/widget-copy';
import { defaultLocale, type Locale } from '@/lib/locales';
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

export interface LiveChatWidgetProps {
  enabled?: boolean;
  title?: string;
  introText?: string;
  offlineMessage?: string;
  accentColor?: string;
  placement?: LiveChatLauncherPlacement;
  emailRequired?: boolean;
  launcherLabel?: string;
  launcherEnabled?: boolean;
  source?: string;
  locale?: Locale;
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

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function LiveChatWidget({
  enabled = true,
  title,
  introText,
  offlineMessage,
  accentColor = '#0f172a',
  placement = 'bottom-right',
  emailRequired = false,
  launcherLabel,
  locale = defaultLocale,
}: LiveChatWidgetProps) {
  const copy = getLiveChatWidgetCopy(locale);
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
  const restoreLocalTriggerOnCloseRef = useRef(false);
  const resolvedTitle = title?.trim() || copy.defaultTitle;
  const resolvedIntroText = introText?.trim() || copy.defaultIntroText;
  const resolvedOfflineMessage = offlineMessage === undefined
    ? copy.defaultOfflineMessage
    : offlineMessage.trim();
  const resolvedAccentColor = accentColor.trim() || '#0f172a';
  const resolvedLauncherLabel = launcherLabel?.trim() || copy.defaultLauncherLabel;

  useEffect(() => {
    setSession(loadSession());
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;

    function handleExternalTriggerClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const trigger = target.closest<HTMLElement>('[data-builder-live-chat-trigger="true"]');
      if (!trigger) return;
      event.preventDefault();
      openerRef.current = trigger;
      restoreLocalTriggerOnCloseRef.current = false;
      setOpen(true);
    }

    document.addEventListener('click', handleExternalTriggerClick);
    return () => document.removeEventListener('click', handleExternalTriggerClick);
  }, [enabled]);

  useEffect(() => {
    if (!open || !session) return;
    if (sourceRef.current) sourceRef.current.close();
    const source = new EventSource(
      `/api/live-chat/stream?conversationId=${encodeURIComponent(session.conversationId)}&visitorToken=${encodeURIComponent(session.visitorToken)}&locale=${encodeURIComponent(locale)}`,
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
      if (sourceRef.current === source) sourceRef.current = null;
    };
  }, [open, session]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function closeChat() {
    setOpen(false);
  }

  useEffect(() => {
    if (open || !restoreLocalTriggerOnCloseRef.current) return undefined;
    restoreLocalTriggerOnCloseRef.current = false;
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
      closeChat();
    }
    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [open]);

  async function startConversation() {
    if (!draft.trim()) return;
    const trimmedEmail = email.trim();
    if (emailRequired && !trimmedEmail) {
      setError(copy.emailRequiredError);
      return;
    }
    if (trimmedEmail && !isValidEmail(trimmedEmail)) {
      setError(copy.invalidEmailError);
      return;
    }
    setSending(true);
    setError('');
    try {
      const res = await fetch(`/api/live-chat/start?locale=${encodeURIComponent(locale)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locale,
          visitorName: name.trim() || undefined,
          visitorEmail: trimmedEmail || undefined,
          pagePath: typeof window !== 'undefined' ? window.location.pathname : undefined,
          message: draft.trim(),
        }),
      });
      const payload = (await res.json().catch(() => ({}))) as { conversationId?: string; visitorToken?: string; error?: string; errorCode?: string };
      if (!res.ok || !payload.conversationId || !payload.visitorToken) {
        setError(copy.apiErrorMessage(payload.errorCode ?? payload.error, 'start'));
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
      const res = await fetch(`/api/live-chat/send?locale=${encodeURIComponent(locale)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locale,
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
        const payload = (await res.json().catch(() => ({}))) as { error?: string; errorCode?: string };
        setError(copy.apiErrorMessage(payload.errorCode ?? payload.error, 'send'));
      }
    } finally {
      setSending(false);
    }
  }

  if (!enabled) return null;

  const rootStyle = {
    ['--builder-live-chat-accent' as string]: resolvedAccentColor,
  } as CSSProperties;

  return (
    <div
      className="builder-live-chat-widget"
      data-builder-live-chat-widget="true"
      data-builder-live-chat-placement={placement}
      style={rootStyle}
    >
      {open ? (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={resolvedTitle}
          tabIndex={-1}
          style={{ width: 'min(360px, calc(100vw - 32px))', height: 'min(520px, calc(100dvh - 128px))', background: '#fff', borderRadius: 12, boxShadow: '0 12px 32px rgba(15,23,42,0.18)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
        >
          <header style={{ padding: 12, background: 'var(--builder-live-chat-accent)', color: '#fff', borderTopLeftRadius: 12, borderTopRightRadius: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <strong style={{ fontSize: 14 }}>{resolvedTitle}</strong>
            <button type="button" onClick={() => closeChat()} style={{ marginLeft: 'auto', background: 'transparent', border: 0, color: '#fff', cursor: 'pointer', fontSize: 18 }} aria-label={copy.closeLabel}>×</button>
          </header>
          <div role="log" aria-live="polite" aria-relevant="additions text" style={{ flex: 1, overflowY: 'auto', padding: 12, background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {!session ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <p style={{ margin: 0, fontSize: 12, color: '#475569' }}>{resolvedIntroText}</p>
                {resolvedOfflineMessage ? <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>{resolvedOfflineMessage}</p> : null}
                <input aria-label={copy.nameLabel} type="text" placeholder={copy.namePlaceholder} value={name} onChange={(e) => setName(e.target.value)} style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }} />
                <input aria-label={copy.emailLabel} type="email" required={emailRequired} placeholder={emailRequired ? copy.emailRequiredPlaceholder : copy.emailPlaceholder} value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }} />
              </div>
            ) : null}
            {messages.map((m) => (
              <div key={m.messageId} style={{ alignSelf: m.role === 'visitor' ? 'flex-end' : 'flex-start', maxWidth: '85%', background: m.role === 'visitor' ? 'var(--builder-live-chat-accent)' : '#fff', color: m.role === 'visitor' ? '#fff' : '#0f172a', padding: '8px 12px', borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13, wordBreak: 'break-word' }}>
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
              placeholder={session ? copy.replyPlaceholder : copy.newConversationPlaceholder}
              aria-label={copy.messageInputLabel}
              disabled={sending}
              style={{ flex: 1, padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }}
            />
            <button type="button" disabled={sending || !draft.trim()} onClick={() => (session ? sendMessage() : startConversation())} style={{ padding: '8px 14px', border: 0, background: sending || !draft.trim() ? '#94a3b8' : 'var(--builder-live-chat-accent)', color: '#fff', borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: sending ? 'not-allowed' : 'pointer' }}>
              {session ? copy.sendLabel : copy.startLabel}
            </button>
          </div>
          {error ? <div role="status" aria-live="polite" style={{ padding: '0 12px 8px', fontSize: 11, color: '#dc2626' }}>{error}</div> : null}
        </div>
      ) : (
        <button
          ref={triggerRef}
          type="button"
          onClick={(event) => {
            openerRef.current = event.currentTarget;
            restoreLocalTriggerOnCloseRef.current = true;
            setOpen(true);
          }}
          aria-label={copy.openLauncherLabel(resolvedLauncherLabel)}
          style={{ width: 56, height: 56, borderRadius: '50%', border: 0, background: 'var(--builder-live-chat-accent)', color: '#fff', fontSize: 22, boxShadow: '0 10px 20px rgba(15,23,42,0.32)', cursor: 'pointer' }}
        >
          💬
        </button>
      )}
    </div>
  );
}
