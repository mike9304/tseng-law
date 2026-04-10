'use client';

import { useEffect, useRef, useState } from 'react';
import type { Locale } from '@/lib/locales';
import { getQuickReplies } from '@/components/floating-ai-quick-replies';

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
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', text: copy.greeting },
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
  const [sessionId] = useState(
    () => `float-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  );
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

  function handleQuickReply(question: string, answer: string) {
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: question },
      { role: 'assistant', text: answer },
    ]);
  }

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
      setLastClassification(data.classification);
      setLastRiskLevel(data.riskLevel);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: data.assistantMessage },
      ]);
      // Note: form is no longer auto-shown on escalation.
      // User explicitly opens it via the "상담 접수하기" button so the
      // assistant response stays visible first.
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', text: copy.error }]);
    } finally {
      setLoading(false);
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
        { role: 'assistant', text: copy.success(data.intakeId) },
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
        {messages.map((msg, i) => (
          <div key={i} className={`floating-ai-chat-msg ${msg.role}`}>
            <div className="floating-ai-chat-bubble">{msg.text}</div>
          </div>
        ))}

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
