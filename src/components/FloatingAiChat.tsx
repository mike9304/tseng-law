'use client';

import { useEffect, useRef, useState } from 'react';
import type { Locale } from '@/lib/locales';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

interface ChatApiResponse {
  assistantMessage: string;
  classification: string;
  riskLevel: string;
  shouldEscalate: boolean;
  nextRequiredField: string;
  referencedColumns: string[];
}

const PLACEHOLDER: Record<Locale, string> = {
  ko: '무엇이 궁금하신가요?',
  'zh-hant': '有什麼問題想詢問的嗎？',
  en: 'What would you like to ask?',
};

const TITLE: Record<Locale, string> = {
  ko: 'AI 법률 상담',
  'zh-hant': 'AI 法律諮詢',
  en: 'AI Legal Consult',
};

const DISCLAIMER: Record<Locale, string> = {
  ko: 'AI 안내는 참고용이며, 최종 판단은 변호사 검토가 필요합니다.',
  'zh-hant': 'AI 說明僅供參考，最終判斷仍需律師檢閱。',
  en: 'AI guidance is for reference only. Final decisions require attorney review.',
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
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `float-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!open) return;
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [open, onClose]);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setLoading(true);

    try {
      const res = await fetch('/api/consultation/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale, sessionId, message: text }),
      });

      if (!res.ok) throw new Error(`${res.status}`);
      const data: ChatApiResponse = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', text: data.assistantMessage }]);
    } catch {
      const errorMsg =
        locale === 'ko'
          ? '일시적 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'
          : locale === 'zh-hant'
            ? '發生暫時性錯誤，請稍後再試。'
            : 'A temporary error occurred. Please try again shortly.';
      setMessages((prev) => [...prev, { role: 'assistant', text: errorMsg }]);
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="floating-ai-chat" role="dialog" aria-modal="true" aria-label={TITLE[locale]}>
      <div className="floating-ai-chat-header">
        <strong>{TITLE[locale]}</strong>
        <button type="button" onClick={onClose} aria-label="Close">
          ×
        </button>
      </div>

      <div className="floating-ai-chat-body" ref={scrollRef}>
        {messages.length === 0 && (
          <p className="floating-ai-chat-empty">{DISCLAIMER[locale]}</p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`floating-ai-chat-msg ${msg.role}`}>
            <div className="floating-ai-chat-bubble">{msg.text}</div>
          </div>
        ))}
        {loading && (
          <div className="floating-ai-chat-msg assistant">
            <div className="floating-ai-chat-bubble floating-ai-chat-typing">···</div>
          </div>
        )}
      </div>

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
          placeholder={PLACEHOLDER[locale]}
          maxLength={2400}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()}>
          ↑
        </button>
      </form>
    </div>
  );
}
