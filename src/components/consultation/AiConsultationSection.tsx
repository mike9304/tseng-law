'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Locale } from '@/lib/locales';
import type {
  ConsultationCategory,
  ConsultationChatResponse,
  ConsultationCollectedFields,
  ConsultationSubmitSuccessResponse,
  ConsultationTranscriptMessage,
} from '@/lib/consultation/types';
import {
  getConsultationCategoryLabel,
  getConsultationCopy,
  getConsultationFieldPrompt,
  getConsultationRiskLabel,
} from '@/lib/consultation/copy';
import { getConsultationPublicEmail, getConsultationPublicMailto } from '@/lib/consultation/public-contact';
import { contactPageContent } from '@/data/contact-page-content';
import SectionLabel from '@/components/SectionLabel';
import OrnamentDivider from '@/components/OrnamentDivider';

type ChatUiMessage = ConsultationTranscriptMessage & { id: string };

function createSessionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `hc-${Date.now()}`;
}

function createMessage(role: 'user' | 'assistant', text: string): ChatUiMessage {
  return {
    id: `${role}-${Math.random().toString(36).slice(2, 10)}`,
    role,
    text,
    timestamp: new Date().toISOString(),
  };
}

function shouldUseFallbackErrorMessage(error: unknown): boolean {
  if (!(error instanceof Error)) return true;
  const normalized = error.message.trim().toLowerCase();
  if (!normalized) return true;
  return (
    normalized === 'failed to fetch' ||
    normalized === 'network error' ||
    normalized === 'networkerror when attempting to fetch resource.' ||
    normalized.includes('networkerror') ||
    normalized.includes('load failed')
  );
}

function getFreshnessLabel(locale: Locale, freshness: 'fresh' | 'review_needed' | 'unknown'): string {
  if (locale === 'ko') {
    if (freshness === 'fresh') return '칼럼 최신성 양호';
    if (freshness === 'review_needed') return '최신성 재검토 필요';
    return '최신성 확인 전';
  }

  if (locale === 'zh-hant') {
    if (freshness === 'fresh') return '文章時效正常';
    if (freshness === 'review_needed') return '建議再次確認時效';
    return '時效尚未確認';
  }

  if (freshness === 'fresh') return 'Source freshness checked';
  if (freshness === 'review_needed') return 'Source freshness should be reviewed';
  return 'Source freshness not confirmed';
}

function getConfidenceLabel(locale: Locale, confidence: 'high' | 'medium' | 'low'): string {
  if (locale === 'ko') {
    if (confidence === 'high') return '근거 신뢰도 높음';
    if (confidence === 'medium') return '근거 신뢰도 중간';
    return '근거 신뢰도 낮음';
  }

  if (locale === 'zh-hant') {
    if (confidence === 'high') return '依據可信度高';
    if (confidence === 'medium') return '依據可信度中';
    return '依據可信度低';
  }

  if (confidence === 'high') return 'High source confidence';
  if (confidence === 'medium') return 'Medium source confidence';
  return 'Low source confidence';
}

export default function AiConsultationSection({ locale }: { locale: Locale }) {
  const copy = getConsultationCopy(locale);
  const messenger = contactPageContent[locale].messenger;
  const primaryOffice = contactPageContent[locale].offices.offices[0];
  const publicEmail = getConsultationPublicEmail();
  const publicMailto = getConsultationPublicMailto();

  const [sessionId] = useState<string>(() => createSessionId());
  const [messages, setMessages] = useState<ChatUiMessage[]>(() => [createMessage('assistant', copy.assistantInitialMessage)]);
  const [input, setInput] = useState('');
  const [chatPending, setChatPending] = useState(false);
  const [submitPending, setSubmitPending] = useState(false);
  const [submitState, setSubmitState] = useState<ConsultationSubmitSuccessResponse | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [lastResponse, setLastResponse] = useState<ConsultationChatResponse | null>(null);
  const [lead, setLead] = useState<ConsultationCollectedFields>({
    category: 'unknown',
    urgency: 'medium',
    preferredContact: 'email',
    consent: false,
  });

  const emailValue = (lead.email || '').trim();
  const emailValid = !emailValue || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);

  const canSubmit =
    !submitPending &&
    Boolean(lead.name?.trim()) &&
    Boolean(lead.summary?.trim()) &&
    Boolean(emailValue || (lead.phoneOrMessenger || '').trim()) &&
    emailValid &&
    lead.consent === true;

  function updateLead<Key extends keyof ConsultationCollectedFields>(key: Key, value: ConsultationCollectedFields[Key]) {
    setLead((current) => ({ ...current, [key]: value }));
  }

  function applyAssistantHints(response: ConsultationChatResponse, userText: string) {
    setLead((current) => {
      const nextLead = { ...current };

      if ((!current.category || current.category === 'unknown' || current.category === 'general') && response.classification !== 'unknown') {
        nextLead.category = response.classification;
      }

      if (!current.summary?.trim() && userText.trim().length > 15) {
        nextLead.summary = userText.trim();
      }

      if ((!current.preferredContact || current.preferredContact === 'email') && response.suggestedHandoffChannel !== 'none') {
        nextLead.preferredContact = response.suggestedHandoffChannel;
      }

      return nextLead;
    });
  }

  async function sendMessage(rawText: string) {
    const text = rawText.trim();
    if (!text || chatPending) return;

    const nextMessages = [...messages, createMessage('user', text)];
    setMessages(nextMessages);
    setInput('');
    setChatPending(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/consultation/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locale,
          sessionId,
          message: text,
          collectedFields: lead,
        }),
      });

      if (!response.ok) {
        const errorPayload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(errorPayload?.error || copy.assistantFallbackError);
      }

      const payload = (await response.json()) as ConsultationChatResponse;
      setLastResponse(payload);
      applyAssistantHints(payload, text);
      setMessages((current) => [...current, createMessage('assistant', payload.assistantMessage)]);
    } catch (error) {
      const message = shouldUseFallbackErrorMessage(error)
        ? copy.assistantFallbackError
        : error instanceof Error
          ? error.message
          : copy.assistantFallbackError;
      setMessages((current) => [...current, createMessage('assistant', message)]);
    } finally {
      setChatPending(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    setSubmitPending(true);
    setSubmitError(null);
    setSubmitState(null);

    try {
      const response = await fetch('/api/consultation/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locale,
          sessionId,
          collectedFields: lead,
          transcript: messages.map((message) => ({
            role: message.role,
            text: message.text,
            timestamp: message.timestamp,
          })),
          classification: lastResponse?.classification ?? lead.category,
          riskLevel: lastResponse?.riskLevel,
          referencedColumns: lastResponse?.referencedColumns ?? [],
        }),
      });

      if (!response.ok) {
        const errorPayload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(errorPayload?.error || copy.submitFailure);
      }

      const payload = (await response.json()) as ConsultationSubmitSuccessResponse;
      setSubmitState(payload);
    } catch (error) {
      const fallbackMessage = `${copy.submitFailure} ${publicEmail}`;
      setSubmitError(
        shouldUseFallbackErrorMessage(error)
          ? fallbackMessage
          : error instanceof Error
            ? error.message
            : fallbackMessage,
      );
    } finally {
      setSubmitPending(false);
    }
  }

  const categoryValue = lead.category ?? 'unknown';
  const escalationPrompt = lastResponse ? getConsultationFieldPrompt(locale, lastResponse.nextRequiredField) : '';
  const userRoleLabel = locale === 'ko' ? '질문' : locale === 'zh-hant' ? '提問' : 'You';

  return (
    <section className="section consultation-ai-section">
      <div className="container">
        <SectionLabel>{copy.sectionLabel}</SectionLabel>
        <div className="consultation-ai-shell">
          <div className="consultation-ai-heading">
            <div>
              <h2 className="section-title">{copy.sectionTitle}</h2>
              <p className="section-lede">{copy.sectionDescription}</p>
            </div>
            <div className="consultation-ai-risk-note">
              <strong>{copy.assistantTitle}</strong>
              <p>{copy.assistantDescription}</p>
            </div>
          </div>
          <OrnamentDivider />

          <div className="consultation-ai-grid">
            <div className="consultation-ai-chat-card">
              <div className="consultation-ai-card-head">
                <div>
                  <h3>{copy.assistantTitle}</h3>
                  <p>{copy.disclaimer}</p>
                </div>
                {lastResponse ? (
                  <div className={`consultation-ai-badge consultation-ai-badge--${lastResponse.riskLevel.toLowerCase()}`}>
                    {getConsultationRiskLabel(locale, lastResponse.riskLevel)}
                  </div>
                ) : null}
              </div>

              <div className="consultation-ai-quick-actions">
                <span>{copy.quickActionsLabel}</span>
                <div className="consultation-ai-chip-row">
                  {copy.quickActions.map((action) => (
                    <button
                      key={action.label}
                      type="button"
                      className="consultation-ai-chip"
                      onClick={() => sendMessage(action.message)}
                      disabled={chatPending}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="consultation-ai-messages" aria-live="polite">
                {messages.map((message) => (
                  <article
                    key={message.id}
                    className={`consultation-ai-message consultation-ai-message--${message.role}`}
                  >
                    <span className="consultation-ai-message-role">
                      {message.role === 'assistant' ? 'AI' : userRoleLabel}
                    </span>
                    <p>{message.text}</p>
                  </article>
                ))}
                {chatPending ? <p className="consultation-ai-pending">{copy.assistantPendingLabel}</p> : null}
              </div>

              {lastResponse ? (
                <div className="consultation-ai-status-strip">
                  <span>{getConsultationCategoryLabel(locale, lastResponse.classification)}</span>
                  <span>{getFreshnessLabel(locale, lastResponse.sourceFreshness)}</span>
                  <span>{getConfidenceLabel(locale, lastResponse.sourceConfidence)}</span>
                </div>
              ) : null}

              <form
                className="consultation-ai-composer"
                onSubmit={(event) => {
                  event.preventDefault();
                  void sendMessage(input);
                }}
              >
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder={copy.placeholders.input}
                  rows={4}
                />
                <button type="submit" className="button" disabled={chatPending || !input.trim()}>
                  {chatPending ? copy.sendingLabel : copy.sendLabel}
                </button>
              </form>

              {lastResponse?.references.length ? (
                <div className="consultation-ai-references">
                  <strong>{locale === 'ko' ? 'AI 참고 칼럼' : locale === 'zh-hant' ? 'AI 參考文章' : 'Referenced Columns'}</strong>
                  <div className="consultation-ai-reference-list">
                    {lastResponse.references.map((reference) => (
                      <Link
                        key={reference.slug}
                        href={`/${locale}/columns/${reference.slug}`}
                        className="consultation-ai-reference-link"
                      >
                        {reference.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}

              {lastResponse?.shouldEscalate ? (
                <div className="consultation-ai-escalation">
                  <strong>{copy.humanReviewRecommended}</strong>
                  <p>{escalationPrompt || copy.submitDescription}</p>
                  <a href={publicMailto} className="consultation-ai-inline-email">
                    {publicEmail}
                  </a>
                </div>
              ) : null}
            </div>

            <div className="consultation-ai-side">
              <div className="consultation-ai-side-card consultation-ai-side-card--channels">
                <h3>{copy.channelsTitle}</h3>
                <p>{copy.channelsDescription}</p>
                <div className="consultation-ai-channel-list">
                  <a href={messenger.primary.href} target="_blank" rel="noopener noreferrer">
                    <span>{messenger.primary.platform}</span>
                    <strong>{messenger.primary.label}</strong>
                  </a>
                  <a href={messenger.secondary.href} target="_blank" rel="noopener noreferrer">
                    <span>{messenger.secondary.platform}</span>
                    <strong>{messenger.secondary.label}</strong>
                  </a>
                  <a href={`tel:${primaryOffice.phone.replace(/[^0-9+]/g, '')}`}>
                    <span>{locale === 'ko' ? '대표 전화' : locale === 'zh-hant' ? '代表電話' : 'Phone'}</span>
                    <strong>{primaryOffice.phone}</strong>
                  </a>
                </div>
              </div>

              <div className="consultation-ai-side-card consultation-ai-side-card--attorney">
                <h3>{copy.attorneyReviewTitle}</h3>
                <p>{copy.attorneyReviewDescription}</p>
                <a href={publicMailto} className="consultation-ai-email-link">
                  <span>{copy.attorneyEmailLabel}</span>
                  <strong>{publicEmail}</strong>
                </a>
              </div>

              <div className="consultation-ai-side-card consultation-ai-side-card--form">
                <h3>{copy.submitTitle}</h3>
                <p>{copy.submitDescription}</p>

                <form className="consultation-ai-form" onSubmit={handleSubmit}>
                  <label>
                    <span>{copy.formLabels.name}</span>
                    <input
                      value={lead.name || ''}
                      onChange={(event) => updateLead('name', event.target.value)}
                      placeholder={copy.placeholders.name}
                    />
                  </label>

                  <label>
                    <span>{copy.formLabels.email}</span>
                    <input
                      type="email"
                      value={lead.email || ''}
                      onChange={(event) => updateLead('email', event.target.value)}
                      placeholder={copy.placeholders.email}
                      style={emailValue && !emailValid ? { borderColor: '#ef4444' } : undefined}
                    />
                    {emailValue && !emailValid && (
                      <span style={{ color: '#ef4444', fontSize: '12px' }}>
                        {locale === 'ko' ? '이메일 형식을 확인해 주세요' : locale === 'zh-hant' ? '請確認電子郵件格式' : 'Please check email format'}
                      </span>
                    )}
                  </label>

                  <label>
                    <span>{copy.formLabels.phoneOrMessenger}</span>
                    <input
                      value={lead.phoneOrMessenger || ''}
                      onChange={(event) => updateLead('phoneOrMessenger', event.target.value)}
                      placeholder={copy.placeholders.phoneOrMessenger}
                    />
                  </label>

                  <div className="consultation-ai-form-grid">
                    <label>
                      <span>{copy.formLabels.category}</span>
                      <select
                        value={categoryValue}
                        onChange={(event) => updateLead('category', event.target.value as ConsultationCategory)}
                      >
                        {(
                          Object.entries(copy.categoryLabels) as Array<[ConsultationCategory, string]>
                        ).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label>
                      <span>{copy.formLabels.urgency}</span>
                      <select
                        value={lead.urgency || 'medium'}
                        onChange={(event) => updateLead('urgency', event.target.value)}
                      >
                        {copy.urgencyOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="consultation-ai-form-grid">
                    <label>
                      <span>{copy.formLabels.companyOrOrganization}</span>
                      <input
                        value={lead.companyOrOrganization || ''}
                        onChange={(event) => updateLead('companyOrOrganization', event.target.value)}
                        placeholder={copy.placeholders.companyOrOrganization}
                      />
                    </label>

                    <label>
                      <span>{copy.formLabels.countryOrResidence}</span>
                      <input
                        value={lead.countryOrResidence || ''}
                        onChange={(event) => updateLead('countryOrResidence', event.target.value)}
                        placeholder={copy.placeholders.countryOrResidence}
                      />
                    </label>
                  </div>

                  <div className="consultation-ai-form-grid">
                    <label>
                      <span>{copy.formLabels.preferredContact}</span>
                      <select
                        value={lead.preferredContact || 'email'}
                        onChange={(event) => updateLead('preferredContact', event.target.value)}
                      >
                        {copy.preferredContactOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label>
                      <span>{copy.formLabels.preferredTime}</span>
                      <input
                        value={lead.preferredTime || ''}
                        onChange={(event) => updateLead('preferredTime', event.target.value)}
                        placeholder={copy.placeholders.preferredTime}
                      />
                    </label>
                  </div>

                  <label>
                    <span>{copy.formLabels.summary}</span>
                    <textarea
                      rows={6}
                      value={lead.summary || ''}
                      onChange={(event) => updateLead('summary', event.target.value)}
                      placeholder={copy.placeholders.summary}
                    />
                  </label>

                  <label>
                    <span>{copy.formLabels.hasDocuments}</span>
                    <input
                      value={lead.hasDocuments || ''}
                      onChange={(event) => updateLead('hasDocuments', event.target.value)}
                      placeholder={copy.placeholders.hasDocuments}
                    />
                  </label>

                  <label className="consultation-ai-consent">
                    <input
                      type="checkbox"
                      checked={Boolean(lead.consent)}
                      onChange={(event) => updateLead('consent', event.target.checked)}
                    />
                    <span>{copy.formLabels.consent}</span>
                  </label>

                  <button type="submit" className="button" disabled={submitPending || !canSubmit}>
                    {submitPending ? copy.submittingLabel : copy.submitLabel}
                  </button>
                </form>

                {submitState ? (
                  <div className="consultation-ai-submit-status consultation-ai-submit-status--success">
                    <strong>{copy.submitSuccess}</strong> <code>{submitState.intakeId}</code>
                    <p>{submitState.message}</p>
                  </div>
                ) : null}
                {submitError ? (
                  <div className="consultation-ai-submit-status consultation-ai-submit-status--error">
                    {submitError}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
