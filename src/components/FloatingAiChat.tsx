'use client';

import { useEffect, useRef, useState } from 'react';
import type { Locale } from '@/lib/locales';
import { getFollowUpSuggestions, getQuickReplies } from '@/components/floating-ai-quick-replies';

interface FloatingChatReference {
  slug: string;
  title: string;
  summary: string;
  lastmod: string;
  freshness: 'fresh' | 'review_needed' | 'unknown';
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  references?: FloatingChatReference[];
}

type FeedbackState = 'pending' | 'helpful' | 'unhelpful';

function makeMessageId(role: 'user' | 'assistant'): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${role}-${crypto.randomUUID().slice(0, 12)}`;
  }
  return `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function feedbackStorageKey(sessionId: string): string {
  return `hoj-float-feedback-${sessionId}`;
}

function loadStoredFeedback(sessionId: string): Record<string, 'helpful' | 'unhelpful'> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(feedbackStorageKey(sessionId));
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    const out: Record<string, 'helpful' | 'unhelpful'> = {};
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      if (v === 'helpful' || v === 'unhelpful') out[k] = v;
    }
    return out;
  } catch {
    return {};
  }
}

function persistFeedback(
  sessionId: string,
  state: Record<string, FeedbackState>,
): void {
  if (typeof window === 'undefined') return;
  try {
    const clean: Record<string, 'helpful' | 'unhelpful'> = {};
    for (const [k, v] of Object.entries(state)) {
      if (v === 'helpful' || v === 'unhelpful') clean[k] = v;
    }
    window.localStorage.setItem(feedbackStorageKey(sessionId), JSON.stringify(clean));
  } catch {
    /* Safari private mode or quota — ignore */
  }
}

/**
 * Session persistence (Wave 3) — allow a visitor to close and reopen
 * the browser tab without losing their AI consultation conversation.
 * Stored as one blob per locale; expires after SESSION_TTL_MS so the
 * store doesn't accumulate forever.
 */
const SESSION_STORAGE_KEY_PREFIX = 'hoj-float-session-v1-';
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

interface PersistedSession {
  sessionId: string;
  locale: string;
  messages: ChatMessage[];
  savedAt: number;
}

function sessionStorageKey(locale: string): string {
  return `${SESSION_STORAGE_KEY_PREFIX}${locale}`;
}

function loadPersistedSession(locale: string): PersistedSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(sessionStorageKey(locale));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      Array.isArray(parsed)
    ) {
      return null;
    }
    const obj = parsed as Record<string, unknown>;
    if (
      typeof obj.sessionId !== 'string' ||
      typeof obj.locale !== 'string' ||
      typeof obj.savedAt !== 'number' ||
      !Array.isArray(obj.messages)
    ) {
      return null;
    }
    if (Date.now() - obj.savedAt > SESSION_TTL_MS) {
      // Expired — clear and start fresh.
      window.localStorage.removeItem(sessionStorageKey(locale));
      return null;
    }
    // Shape-check each message to be safe against tampered/garbled
    // localStorage (e.g. a prior app version wrote a different shape).
    const messages: ChatMessage[] = [];
    for (const entry of obj.messages) {
      if (!entry || typeof entry !== 'object') continue;
      const m = entry as Record<string, unknown>;
      if (
        typeof m.id === 'string' &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.text === 'string'
      ) {
        const cleanMsg: ChatMessage = {
          id: m.id,
          role: m.role,
          text: m.text,
        };
        // Drop the references array on restore — slugs are stable but
        // stored metadata (title/summary/lastmod) could be outdated
        // after a content update; the next response will carry fresh
        // references anyway.
        messages.push(cleanMsg);
      }
    }
    if (messages.length === 0) return null;
    return {
      sessionId: obj.sessionId,
      locale: obj.locale,
      messages,
      savedAt: obj.savedAt,
    };
  } catch {
    return null;
  }
}

function persistSession(sessionId: string, locale: string, messages: ChatMessage[]): void {
  if (typeof window === 'undefined') return;
  try {
    const payload: PersistedSession = {
      sessionId,
      locale,
      messages,
      savedAt: Date.now(),
    };
    window.localStorage.setItem(sessionStorageKey(locale), JSON.stringify(payload));
  } catch {
    /* Quota or private mode — degrade to session-only state */
  }
}

/** Number of most-recent non-greeting turns to forward with each chat request. */
const PRIOR_TURNS_SENT_TO_SERVER = 5;

function buildPriorTurnsForRequest(messages: ChatMessage[]): Array<{
  role: 'user' | 'assistant';
  text: string;
  timestamp?: string;
}> {
  // Drop the initial greeting (id === 'initial-greeting') and take the
  // last N turns of actual conversation.
  const history = messages.filter((m) => m.id !== 'initial-greeting');
  const tail = history.slice(-PRIOR_TURNS_SENT_TO_SERVER);
  return tail.map((m) => ({ role: m.role, text: m.text }));
}

interface ChatApiReferenceRaw {
  slug?: string;
  title?: string;
  summary?: string;
  lastmod?: string;
  freshness?: string;
}

function normalizeFreshness(raw: string | undefined): FloatingChatReference['freshness'] {
  if (raw === 'fresh' || raw === 'review_needed') return raw;
  return 'unknown';
}

function normalizeReferences(
  raw: ChatApiReferenceRaw[] | undefined,
): FloatingChatReference[] {
  if (!Array.isArray(raw)) return [];
  const out: FloatingChatReference[] = [];
  for (const ref of raw) {
    if (!ref || typeof ref !== 'object') continue;
    const slug = typeof ref.slug === 'string' ? ref.slug : '';
    if (!slug) continue;
    out.push({
      slug,
      title: typeof ref.title === 'string' ? ref.title : slug,
      summary: typeof ref.summary === 'string' ? ref.summary : '',
      lastmod: typeof ref.lastmod === 'string' ? ref.lastmod : '',
      freshness: normalizeFreshness(ref.freshness),
    });
    if (out.length >= 3) break;
  }
  return out;
}

function formatReferenceDate(lastmod: string, locale: Locale): string {
  if (!lastmod) return '';
  const parsed = new Date(lastmod);
  if (Number.isNaN(parsed.getTime())) return lastmod;
  try {
    const intlLocale = locale === 'zh-hant' ? 'zh-TW' : locale === 'en' ? 'en-US' : 'ko-KR';
    return new Intl.DateTimeFormat(intlLocale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(parsed);
  } catch {
    return lastmod;
  }
}

function freshnessLabel(freshness: FloatingChatReference['freshness'], locale: Locale): string {
  if (locale === 'ko') {
    if (freshness === 'fresh') return '최신';
    if (freshness === 'review_needed') return '재검토 필요';
    return '확인 전';
  }
  if (locale === 'zh-hant') {
    if (freshness === 'fresh') return '最新';
    if (freshness === 'review_needed') return '需重新檢閱';
    return '待確認';
  }
  if (freshness === 'fresh') return 'Fresh';
  if (freshness === 'review_needed') return 'Review needed';
  return 'Unverified';
}

const COPY: Record<
  Locale,
  {
    title: string;
    subtitle: string;
    greeting: string;
    placeholder: string;
    showForm: string;
    formTitle: string;
    nameLabel: string;
    contactLabel: string;
    summaryLabel: string;
    consentLabel: string;
    submit: string;
    submitting: string;
    success: (id: string) => string;
    error: string;
    closeLabel: string;
    contactsTitle: string;
    emailLabel: string;
    phoneLabel: string;
    officesLabel: string;
    requireBoth: string;
    typingHint: string;
    feedbackHelpful: string;
    feedbackUnhelpful: string;
    feedbackPending: string;
    feedbackThanks: string;
    feedbackError: string;
    sourcesTitle: string;
    sourceLastVerified: (date: string) => string;
    sourceReadMore: string;
    disclaimerBar: string;
  }
> = {
  ko: {
    title: 'AI 상담사',
    subtitle: '호정국제법률사무소',
    greeting:
      '안녕하세요. 호정국제법률사무소 AI 상담사입니다. 대만 법률 관련 어떤 도움이 필요하신가요? 회사설립, 교통사고, 노동, 이혼·상속, 형사 등 어떤 주제든 편하게 질문해 주세요.',
    placeholder: '질문을 입력해 주세요...',
    showForm: '상담 접수하기',
    formTitle: '상담 접수',
    nameLabel: '이름',
    contactLabel: '이메일 또는 연락처',
    summaryLabel: '사건 요약 (선택)',
    consentLabel: '개인정보 처리 및 변호사 검토에 동의합니다',
    submit: '접수하기',
    submitting: '접수 중...',
    success: (id) =>
      `접수가 완료되었습니다. 변호사가 검토 후 빠르게 회신드리겠습니다. 접수번호: ${id}`,
    error: '일시적 오류가 발생했습니다. 직접 wei@hoveringlaw.com.tw 로 문의해 주세요.',
    closeLabel: '닫기',
    contactsTitle: '직접 연락',
    emailLabel: '이메일',
    phoneLabel: '한국 전화',
    officesLabel: '사무소',
    requireBoth: '이름과 연락처를 입력해 주세요',
    typingHint: 'Enter로 전송',
    feedbackHelpful: '도움이 됐어요',
    feedbackUnhelpful: '도움이 안 됐어요',
    feedbackPending: '전송 중...',
    feedbackThanks: '피드백 감사합니다. 더 나은 응답에 반영하겠습니다.',
    feedbackError: '피드백 전송 실패. 잠시 후 다시 시도해 주세요.',
    sourcesTitle: '참고 칼럼',
    sourceLastVerified: (date) => `최근 갱신: ${date}`,
    sourceReadMore: '원문 보기',
    disclaimerBar: 'AI 응답은 참고용입니다. 최종 판단은 대만 변호사 검토가 필요합니다.',
  },
  'zh-hant': {
    title: 'AI 諮詢',
    subtitle: '昊鼎國際法律事務所',
    greeting:
      '您好，我是昊鼎國際法律事務所的 AI 諮詢助理。請問需要什麼法律協助？無論是公司設立、車禍、勞動、離婚繼承、刑事等任何主題，都歡迎詢問。',
    placeholder: '請輸入您的問題...',
    showForm: '正式預約諮詢',
    formTitle: '諮詢預約',
    nameLabel: '姓名',
    contactLabel: '電子郵件或聯絡方式',
    summaryLabel: '案件摘要 (選填)',
    consentLabel: '同意個資處理與律師檢閱',
    submit: '送出',
    submitting: '送出中...',
    success: (id) => `預約已完成。律師檢閱後將盡快回覆。預約編號: ${id}`,
    error: '發生暫時性錯誤，請直接寄信至 wei@hoveringlaw.com.tw。',
    closeLabel: '關閉',
    contactsTitle: '直接聯繫',
    emailLabel: '電子郵件',
    phoneLabel: '韓國電話',
    officesLabel: '據點',
    requireBoth: '請輸入姓名與聯絡方式',
    typingHint: 'Enter 送出',
    feedbackHelpful: '有幫助',
    feedbackUnhelpful: '沒有幫助',
    feedbackPending: '傳送中...',
    feedbackThanks: '感謝您的回饋，將協助我們持續改善。',
    feedbackError: '回饋送出失敗，請稍後再試。',
    sourcesTitle: '參考文章',
    sourceLastVerified: (date) => `最近更新: ${date}`,
    sourceReadMore: '閱讀全文',
    disclaimerBar: 'AI 回覆僅供參考，最終判斷應由台灣律師確認。',
  },
  en: {
    title: 'AI Consult',
    subtitle: 'Hovering International Law',
    greeting:
      'Hello. I am the AI consultation assistant at Hovering International Law Office. How can I help with your Taiwan legal matter? Feel free to ask about company setup, traffic accidents, labor, divorce, inheritance, criminal cases, or any other topic.',
    placeholder: 'Type your question...',
    showForm: 'Request consultation',
    formTitle: 'Consultation Request',
    nameLabel: 'Name',
    contactLabel: 'Email or contact',
    summaryLabel: 'Brief summary (optional)',
    consentLabel: 'I consent to data processing and attorney review',
    submit: 'Submit',
    submitting: 'Submitting...',
    success: (id) =>
      `Submitted. An attorney will review and respond shortly. Reference: ${id}`,
    error:
      'A temporary error occurred. Please email wei@hoveringlaw.com.tw directly.',
    closeLabel: 'Close',
    contactsTitle: 'Direct contact',
    emailLabel: 'Email',
    phoneLabel: 'Korea phone',
    officesLabel: 'Offices',
    requireBoth: 'Please enter both name and contact',
    typingHint: 'Press Enter to send',
    feedbackHelpful: 'This was helpful',
    feedbackUnhelpful: 'Not helpful',
    feedbackPending: 'Sending...',
    feedbackThanks: 'Thank you for the feedback. It will help us improve.',
    feedbackError: 'Could not send feedback. Please try again later.',
    sourcesTitle: 'Sources',
    sourceLastVerified: (date) => `Last verified: ${date}`,
    sourceReadMore: 'Read full article',
    disclaimerBar: 'AI responses are for reference only. Final judgment requires a Taiwan lawyer\'s review.',
  },
};

const OFFICES_TEXT: Record<Locale, string> = {
  ko: '타이베이 · 타이중 · 가오슝',
  'zh-hant': '台北 · 台中 · 高雄',
  en: 'Taipei · Taichung · Kaohsiung',
};

export default function FloatingAiChat({
  locale,
  open,
  onClose,
}: {
  locale: Locale;
  open: boolean;
  onClose: () => void;
}) {
  const copy = COPY[locale];
  // Always start with the server-rendered initial greeting so SSR and
  // the first client render agree. The localStorage restore runs in a
  // useEffect below (hydrationRestored flag), avoiding hydration
  // mismatches when next.js pre-renders the page.
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'initial-greeting', role: 'assistant', text: copy.greeting },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formContact, setFormContact] = useState('');
  const [formSummary, setFormSummary] = useState('');
  const [formConsent, setFormConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [lastClassification, setLastClassification] = useState('unknown');
  const [lastRiskLevel, setLastRiskLevel] = useState('L1');
  const [sessionId, setSessionId] = useState<string>(
    () => `float-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  );
  const [sessionHydrated, setSessionHydrated] = useState(false);
  const [feedbackByMessageId, setFeedbackByMessageId] = useState<
    Record<string, FeedbackState>
  >({});
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!scrollRef.current) return;
    // When a new message arrives, scroll to show it (not jump past it)
    const lastMsg = scrollRef.current.querySelector(
      '.floating-ai-chat-msg:last-of-type'
    ) as HTMLElement | null;
    if (lastMsg) {
      lastMsg.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  useEffect(() => {
    // Form/submitted state changes scroll separately
    if (showForm && scrollRef.current) {
      const form = scrollRef.current.querySelector('.floating-ai-chat-form');
      if (form) {
        (form as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [showForm]);

  useEffect(() => {
    if (!open) return;
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [open, onClose]);

  // Hydrate persisted feedback for this session on first render.
  useEffect(() => {
    const stored = loadStoredFeedback(sessionId);
    if (Object.keys(stored).length > 0) {
      setFeedbackByMessageId(stored);
    }
  }, [sessionId]);

  // Hydrate persisted session (messages + sessionId) on first mount.
  // Runs ONCE, then flips sessionHydrated so the auto-save effect
  // below won't accidentally overwrite storage with the initial
  // greeting-only state before the restore had a chance to run.
  useEffect(() => {
    const persisted = loadPersistedSession(locale);
    if (persisted && persisted.messages.length > 0) {
      setSessionId(persisted.sessionId);
      setMessages(persisted.messages);
      const feedbackForRestored = loadStoredFeedback(persisted.sessionId);
      if (Object.keys(feedbackForRestored).length > 0) {
        setFeedbackByMessageId(feedbackForRestored);
      }
    }
    setSessionHydrated(true);
    // locale is intentionally excluded from deps — this effect should
    // run exactly once on mount to avoid clobbering live state on
    // subsequent renders caused by locale prop mutation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save messages to localStorage whenever they change, but only
  // after the hydration pass has completed. This gives users a seamless
  // "come back later and continue" experience across browser restarts.
  useEffect(() => {
    if (!sessionHydrated) return;
    persistSession(sessionId, locale, messages);
  }, [sessionId, locale, messages, sessionHydrated]);

  function handleQuickReply(question: string, answer: string) {
    setMessages((prev) => [
      ...prev,
      { id: makeMessageId('user'), role: 'user', text: question },
      { id: makeMessageId('assistant'), role: 'assistant', text: answer },
    ]);
  }

  async function sendChatMessage(text: string) {
    if (!text || loading) return;

    // Snapshot prior turns before optimistic append.
    const priorTurnsForRequest = buildPriorTurnsForRequest(messages);

    // Append user message immediately, then an empty assistant
    // placeholder whose text grows as streaming chunks arrive.
    const pendingAssistantId = makeMessageId('assistant');
    setMessages((prev) => [
      ...prev,
      { id: makeMessageId('user'), role: 'user', text },
      { id: pendingAssistantId, role: 'assistant', text: '' },
    ]);
    setLoading(true);

    try {
      const res = await fetch('/api/consultation/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locale,
          sessionId,
          message: text,
          priorTurns: priorTurnsForRequest,
          stream: true,
        }),
      });

      if (!res.ok || !res.body) throw new Error(`${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let pendingText = '';
      let groundednessSuffix = '';
      let stalenessSuffix = '';
      let attorneyNotice = '';
      let streamDone = false;

      const flushMessage = () => {
        const assembled = [pendingText, groundednessSuffix, stalenessSuffix, attorneyNotice]
          .filter(Boolean)
          .join('');
        setMessages((prev) =>
          prev.map((m) =>
            m.id === pendingAssistantId ? { ...m, text: assembled } : m,
          ),
        );
      };

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // SSE events are separated by `\n\n`. Each event starts with
        // `data: `. Split on the separator and keep incomplete tails.
        const parts = buffer.split('\n\n');
        buffer = parts.pop() || '';

        for (const part of parts) {
          const line = part.trim();
          if (!line.startsWith('data:')) continue;
          const payload = line.slice(5).trim();
          if (!payload) continue;
          let chunk: unknown;
          try {
            chunk = JSON.parse(payload);
          } catch {
            continue;
          }
          if (!chunk || typeof chunk !== 'object') continue;
          const evt = chunk as { type?: string; [k: string]: unknown };

          if (evt.type === 'metadata') {
            const data = evt.data as Record<string, unknown> | undefined;
            if (data) {
              if (typeof data.classification === 'string') {
                setLastClassification(data.classification);
              }
              if (typeof data.riskLevel === 'string') {
                setLastRiskLevel(data.riskLevel);
              }
              const rawRefs = data.references as ChatApiReferenceRaw[] | undefined;
              const parsed = normalizeReferences(rawRefs);
              if (parsed.length > 0) {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === pendingAssistantId ? { ...m, references: parsed } : m,
                  ),
                );
              }
            }
          } else if (evt.type === 'delta' && typeof evt.text === 'string') {
            pendingText += evt.text;
            flushMessage();
          } else if (evt.type === 'warning' && typeof evt.text === 'string') {
            if (evt.variant === 'groundedness') {
              groundednessSuffix = evt.text;
            } else if (evt.variant === 'staleness') {
              stalenessSuffix = evt.text;
            }
            flushMessage();
          } else if (evt.type === 'attorney_notice' && typeof evt.text === 'string') {
            attorneyNotice = `\n\n${evt.text}`;
            flushMessage();
          } else if (evt.type === 'error') {
            pendingText = copy.error;
            flushMessage();
            streamDone = true;
          } else if (evt.type === 'done') {
            streamDone = true;
          }
        }
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === pendingAssistantId ? { ...m, text: copy.error } : m,
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    await sendChatMessage(text);
  }

  async function handleFollowUp(suggestion: string) {
    if (loading) return;
    await sendChatMessage(suggestion);
  }

  async function submitFeedback(messageId: string, rating: 'helpful' | 'unhelpful') {
    const current = feedbackByMessageId[messageId];
    if (current === 'pending' || current === 'helpful' || current === 'unhelpful') return;

    setFeedbackByMessageId((prev) => ({ ...prev, [messageId]: 'pending' }));
    setFeedbackNotice(null);

    try {
      const res = await fetch('/api/consultation/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          messageId,
          rating,
          locale,
          classification: lastClassification,
          riskLevel: lastRiskLevel,
        }),
      });
      if (!res.ok) throw new Error(`feedback request failed with ${res.status}`);

      setFeedbackByMessageId((prev) => {
        const next: Record<string, FeedbackState> = { ...prev, [messageId]: rating };
        persistFeedback(sessionId, next);
        return next;
      });
      setFeedbackNotice(copy.feedbackThanks);
    } catch (err) {
      console.error('[floating-ai-chat] feedback failed:', err);
      setFeedbackByMessageId((prev) => {
        const next = { ...prev };
        delete next[messageId];
        return next;
      });
      setFeedbackNotice(copy.feedbackError);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formName.trim() || !formContact.trim()) {
      setFormError(copy.requireBoth);
      return;
    }
    if (!formConsent) {
      setFormError(copy.consentLabel);
      return;
    }

    setSubmitting(true);
    setFormError(null);

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formContact.trim());
    const collectedFields = {
      name: formName.trim(),
      email: isEmail ? formContact.trim() : '',
      phoneOrMessenger: !isEmail ? formContact.trim() : '',
      summary:
        formSummary.trim() ||
        messages
          .filter((m) => m.role === 'user')
          .map((m) => m.text)
          .join('\n'),
      category: lastClassification,
      consent: true,
    };

    try {
      const res = await fetch('/api/consultation/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locale,
          sessionId,
          collectedFields,
          transcript: messages.map((m) => ({ role: m.role, text: m.text })),
          classification: lastClassification,
          riskLevel: lastRiskLevel,
          referencedColumns: [],
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'submit_failed');
      }

      setSubmitted(data.intakeId);
      setMessages((prev) => [
        ...prev,
        { id: makeMessageId('assistant'), role: 'assistant', text: copy.success(data.intakeId) },
      ]);
      setShowForm(false);
    } catch {
      setFormError(copy.error);
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="floating-ai-chat"
      role="dialog"
      aria-modal="true"
      aria-label={copy.title}
    >
      <div className="floating-ai-chat-header">
        <div className="floating-ai-chat-avatar" aria-hidden>
          <svg viewBox="0 0 32 32" width="32" height="32">
            <circle cx="16" cy="16" r="15" fill="currentColor" opacity="0.12" />
            <path
              d="M16 7 L23 12 L23 20 L16 25 L9 20 L9 12 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <text
              x="16"
              y="20"
              textAnchor="middle"
              fontSize="9"
              fontWeight="700"
              fill="currentColor"
              fontFamily="serif"
            >
              昊
            </text>
          </svg>
          <span className="floating-ai-chat-online" aria-hidden />
        </div>
        <div className="floating-ai-chat-title">
          <strong>{copy.title}</strong>
          <span>{copy.subtitle}</span>
        </div>
        <button type="button" onClick={onClose} aria-label={copy.closeLabel}>
          ×
        </button>
      </div>

      <div className="floating-ai-chat-contacts">
        <a href="mailto:wei@hoveringlaw.com.tw" className="floating-ai-chat-contact-item">
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
            <path
              d="M3 6h18v12H3z M3 6l9 7 9-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
          <div>
            <span>{copy.emailLabel}</span>
            <strong>wei@hoveringlaw.com.tw</strong>
          </div>
        </a>
        <a href="tel:+821029929304" className="floating-ai-chat-contact-item">
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
            <path
              d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
          <div>
            <span>{copy.phoneLabel}</span>
            <strong>010-2992-9304</strong>
          </div>
        </a>
        <div className="floating-ai-chat-contact-item floating-ai-chat-contact-offices">
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
            <path
              d="M12 21s7-7 7-12a7 7 0 0 0-14 0c0 5 7 12 7 12z M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
          <div>
            <span>{copy.officesLabel}</span>
            <strong>{OFFICES_TEXT[locale]}</strong>
          </div>
        </div>
      </div>

      <div className="floating-ai-chat-body" ref={scrollRef}>
        {messages.map((msg, i) => {
          const showFeedback = msg.role === 'assistant' && i > 0;
          const feedbackState = feedbackByMessageId[msg.id];
          const isPending = feedbackState === 'pending';
          const isHelpful = feedbackState === 'helpful';
          const isUnhelpful = feedbackState === 'unhelpful';
          const alreadyRated = isHelpful || isUnhelpful;
          return (
            <div key={msg.id} className={`floating-ai-chat-msg ${msg.role}`}>
              <div className="floating-ai-chat-bubble">{msg.text}</div>
              {msg.references && msg.references.length > 0 ? (
                <div
                  className="floating-ai-chat-sources"
                  role="region"
                  aria-label={copy.sourcesTitle}
                >
                  <div className="floating-ai-chat-sources-title">{copy.sourcesTitle}</div>
                  <ul className="floating-ai-chat-sources-list">
                    {msg.references.map((ref) => {
                      const formattedDate = formatReferenceDate(ref.lastmod, locale);
                      const freshClass =
                        ref.freshness === 'fresh'
                          ? 'floating-ai-chat-source-fresh'
                          : ref.freshness === 'review_needed'
                            ? 'floating-ai-chat-source-stale'
                            : 'floating-ai-chat-source-unknown';
                      return (
                        <li key={ref.slug} className="floating-ai-chat-source">
                          <a
                            href={`/${locale}/columns/${ref.slug}`}
                            className="floating-ai-chat-source-link"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <div className="floating-ai-chat-source-head">
                              <span className="floating-ai-chat-source-title">{ref.title}</span>
                              <span
                                className={`floating-ai-chat-source-badge ${freshClass}`}
                                aria-label={freshnessLabel(ref.freshness, locale)}
                              >
                                {freshnessLabel(ref.freshness, locale)}
                              </span>
                            </div>
                            {ref.summary ? (
                              <p className="floating-ai-chat-source-summary">{ref.summary}</p>
                            ) : null}
                            <div className="floating-ai-chat-source-meta">
                              {formattedDate ? (
                                <span>{copy.sourceLastVerified(formattedDate)}</span>
                              ) : null}
                              <span className="floating-ai-chat-source-more">
                                {copy.sourceReadMore} →
                              </span>
                            </div>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}
              {showFeedback ? (
                <div
                  className="floating-ai-chat-feedback"
                  role="group"
                  aria-label={copy.feedbackHelpful}
                >
                  <button
                    type="button"
                    className={`floating-ai-chat-feedback-btn${isHelpful ? ' is-active' : ''}`}
                    onClick={() => {
                      void submitFeedback(msg.id, 'helpful');
                    }}
                    disabled={isPending || alreadyRated}
                    aria-label={copy.feedbackHelpful}
                    aria-pressed={isHelpful}
                  >
                    <span aria-hidden="true">👍</span>
                    <span className="floating-ai-chat-feedback-text">
                      {isPending ? copy.feedbackPending : copy.feedbackHelpful}
                    </span>
                  </button>
                  <button
                    type="button"
                    className={`floating-ai-chat-feedback-btn floating-ai-chat-feedback-btn--down${isUnhelpful ? ' is-active' : ''}`}
                    onClick={() => {
                      void submitFeedback(msg.id, 'unhelpful');
                    }}
                    disabled={isPending || alreadyRated}
                    aria-label={copy.feedbackUnhelpful}
                    aria-pressed={isUnhelpful}
                  >
                    <span aria-hidden="true">👎</span>
                    <span className="floating-ai-chat-feedback-text">
                      {isPending ? copy.feedbackPending : copy.feedbackUnhelpful}
                    </span>
                  </button>
                </div>
              ) : null}
            </div>
          );
        })}
        {feedbackNotice ? (
          <div className="floating-ai-chat-feedback-notice" role="status" aria-live="polite">
            {feedbackNotice}
          </div>
        ) : null}

        {messages.length === 1 && !loading && (
          <div className="floating-ai-chat-quick-chips">
            {getQuickReplies(locale).map((reply) => (
              <button
                key={reply.label}
                type="button"
                className="floating-ai-chat-chip"
                onClick={() => handleQuickReply(reply.question, reply.answer)}
              >
                {reply.label}
              </button>
            ))}
          </div>
        )}

        {/*
          Context-aware follow-ups: only rendered when the latest assistant
          message is NOT the initial greeting (i.e. the user has actually
          received a classified response). Suggestions are keyed off the
          engine's last classification so they stay relevant to the topic
          the user is currently exploring.
        */}
        {messages.length > 1
          && messages[messages.length - 1]?.role === 'assistant'
          && !loading
          && !showForm
          && !submitted ? (
          <div
            className="floating-ai-chat-follow-ups"
            role="group"
            aria-label={locale === 'ko' ? '이어서 질문하기' : locale === 'zh-hant' ? '繼續追問' : 'Follow-up questions'}
          >
            {getFollowUpSuggestions(locale, lastClassification).map((suggestion) => (
              <button
                key={suggestion.label}
                type="button"
                className="floating-ai-chat-follow-up-chip"
                onClick={() => {
                  void handleFollowUp(suggestion.message);
                }}
                disabled={loading}
              >
                {suggestion.label}
              </button>
            ))}
          </div>
        ) : null}

        {loading && (
          <div className="floating-ai-chat-msg assistant">
            <div className="floating-ai-chat-bubble floating-ai-chat-typing">
              ···
            </div>
          </div>
        )}

        {!showForm && !submitted && messages.length > 1 && !loading && (
          <button
            type="button"
            className="floating-ai-chat-cta-card"
            onClick={() => setShowForm(true)}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
              <path
                d="M3 6h18v12H3z M3 6l9 7 9-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
            <div>
              <strong>{copy.showForm}</strong>
              <span>
                {locale === 'ko'
                  ? '변호사가 직접 검토 후 회신드립니다'
                  : locale === 'zh-hant'
                    ? '律師將親自檢閱後回覆'
                    : 'An attorney will personally review and respond'}
              </span>
            </div>
            <span aria-hidden className="floating-ai-chat-cta-arrow">→</span>
          </button>
        )}

        {showForm && !submitted && (
          <form className="floating-ai-chat-form" onSubmit={handleSubmit}>
            <strong>{copy.formTitle}</strong>
            <input
              type="text"
              placeholder={copy.nameLabel}
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder={copy.contactLabel}
              value={formContact}
              onChange={(e) => setFormContact(e.target.value)}
              required
            />
            <textarea
              placeholder={copy.summaryLabel}
              value={formSummary}
              onChange={(e) => setFormSummary(e.target.value)}
              rows={2}
            />
            <label className="floating-ai-chat-consent">
              <input
                type="checkbox"
                checked={formConsent}
                onChange={(e) => setFormConsent(e.target.checked)}
              />
              <span>{copy.consentLabel}</span>
            </label>
            {formError && (
              <p className="floating-ai-chat-error">{formError}</p>
            )}
            <button type="submit" disabled={submitting}>
              {submitting ? copy.submitting : copy.submit}
            </button>
          </form>
        )}
      </div>

      <div
        className="floating-ai-chat-disclaimer-bar"
        role="note"
        aria-live="off"
      >
        <span aria-hidden="true" className="floating-ai-chat-disclaimer-icon">⚠</span>
        <span className="floating-ai-chat-disclaimer-text">{copy.disclaimerBar}</span>
      </div>

      {!submitted && (
        <form
          className="floating-ai-chat-input"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={copy.placeholder}
            maxLength={2400}
            disabled={loading}
          />
          {!showForm && messages.length > 1 && (
            <button
              type="button"
              className="floating-ai-chat-form-toggle"
              onClick={() => setShowForm(true)}
              title={copy.showForm}
            >
              {copy.showForm}
            </button>
          )}
          <button type="submit" disabled={loading || !input.trim()}>
            ↑
          </button>
        </form>
      )}
    </div>
  );
}
