'use client';

import { useMemo, useState } from 'react';
import type { BookingEmailTemplate, BookingEmailTemplateType } from '@/lib/builder/bookings/types';
import {
  bookingEmailTemplateConfig,
  bookingEmailTemplatePlaceholders,
} from '@/lib/builder/bookings/email-template-config';
import styles from './BookingsAdmin.module.css';

type Draft = Pick<BookingEmailTemplate, 'type' | 'subject' | 'body' | 'isActive'>;

const sampleValues: Record<string, string> = {
  customerName: '김민수',
  customerEmail: 'client@example.com',
  customerPhone: '+82-10-1234-5678',
  serviceName: '초기 상담 30분',
  staffName: '증위명 변호사',
  startTime: '2026. 5. 18. 오후 2:00',
  endTime: '2026. 5. 18. 오후 2:30',
  timezone: 'Asia/Seoul',
  meetingLink: 'https://meet.example.com/consultation',
  manageUrl: 'https://tseng-law.com/ko/booking/manage/demo-token',
  caseSummary: '대만 법인 설립 전 계약 리스크를 검토하고 싶습니다.',
  notes: '한국어 상담을 선호합니다.',
  bookingSummary: 'Service: 초기 상담 30분\nStaff: 증위명 변호사\nTime: 2026. 5. 18. 오후 2:00\nManage: https://tseng-law.com/ko/booking/manage/demo-token',
};

function draftFromTemplate(template: BookingEmailTemplate): Draft {
  return {
    type: template.type,
    subject: template.subject,
    body: template.body,
    isActive: template.isActive,
  };
}

function defaultDraft(type: BookingEmailTemplateType): Draft {
  const config = bookingEmailTemplateConfig[type];
  return {
    type,
    subject: config.subject,
    body: config.body,
    isActive: true,
  };
}

function renderSample(input: string): string {
  return input.replace(/{{\s*([a-zA-Z0-9]+)\s*}}/g, (match, key: string) => sampleValues[key] ?? match);
}

export default function BookingEmailTemplatesAdmin({
  initialTemplates,
}: {
  initialTemplates: BookingEmailTemplate[];
}) {
  const [templates, setTemplates] = useState(initialTemplates);
  const [selectedType, setSelectedType] = useState<BookingEmailTemplateType>(initialTemplates[0]?.type ?? 'customer-confirmation');
  const selectedTemplate = useMemo(
    () => templates.find((template) => template.type === selectedType) ?? {
      ...defaultDraft(selectedType),
      templateId: selectedType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    [selectedType, templates],
  );
  const [draft, setDraft] = useState<Draft>(() => draftFromTemplate(selectedTemplate));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectType = (type: BookingEmailTemplateType) => {
    const template = templates.find((item) => item.type === type);
    setSelectedType(type);
    setDraft(template ? draftFromTemplate(template) : defaultDraft(type));
    setMessage(null);
    setError(null);
  };

  const save = async () => {
    if (saving) return;
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const response = await fetch(`/api/builder/bookings/email-templates/${draft.type}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          subject: draft.subject,
          body: draft.body,
          isActive: draft.isActive,
        }),
      });
      const payload = (await response.json().catch(() => null)) as { template?: BookingEmailTemplate; error?: string } | null;
      if (!response.ok || !payload?.template) throw new Error(payload?.error || 'save failed');
      setTemplates((current) => current.map((template) => (
        template.type === payload.template!.type ? payload.template! : template
      )));
      setDraft(draftFromTemplate(payload.template));
      setMessage('Email template saved.');
    } catch {
      setError('이메일 템플릿을 저장하지 못했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    setDraft(defaultDraft(selectedType));
    setMessage(null);
    setError(null);
  };

  const previewSubject = renderSample(draft.subject);
  const previewBody = renderSample(draft.body);

  return (
    <div className={styles.emailTemplateLayout}>
      <aside className={styles.emailTemplateList} aria-label="Booking email template list">
        {templates.map((template) => {
          const config = bookingEmailTemplateConfig[template.type];
          return (
            <button
              className={styles.emailTemplateItem}
              data-active={template.type === selectedType}
              key={template.type}
              type="button"
              onClick={() => selectType(template.type)}
            >
              <strong>{config.label}</strong>
              <span>{config.description}</span>
            </button>
          );
        })}
      </aside>

      <section className={styles.panel} aria-label="Booking email template editor">
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.cardTitle}>{bookingEmailTemplateConfig[draft.type].label}</h2>
            <p className={styles.muted}>{bookingEmailTemplateConfig[draft.type].description}</p>
          </div>
          <label className={styles.toggleRow}>
            <input
              checked={draft.isActive}
              type="checkbox"
              onChange={(event) => setDraft({ ...draft, isActive: event.target.checked })}
            />
            Active
          </label>
        </div>

        {message ? <p className={styles.notice}>{message}</p> : null}
        {error ? <p className={styles.error}>{error}</p> : null}

        <div className={styles.formGrid}>
          <label className={`${styles.field} ${styles.fieldFull}`}>
            <span className={styles.label}>Subject</span>
            <input
              className={styles.input}
              value={draft.subject}
              onChange={(event) => setDraft({ ...draft, subject: event.target.value })}
            />
          </label>
          <label className={`${styles.field} ${styles.fieldFull}`}>
            <span className={styles.label}>Body</span>
            <textarea
              className={`${styles.textarea} ${styles.emailTemplateTextarea}`}
              value={draft.body}
              onChange={(event) => setDraft({ ...draft, body: event.target.value })}
            />
          </label>
        </div>

        <div className={styles.placeholderGrid} aria-label="Available placeholders">
          {bookingEmailTemplatePlaceholders.map((placeholder) => (
            <code key={placeholder}>{`{{${placeholder}}}`}</code>
          ))}
        </div>

        <div className={styles.inlineActions}>
          <button className={styles.button} disabled={saving} type="button" onClick={save}>
            {saving ? 'Saving...' : 'Save template'}
          </button>
          <button className={styles.buttonSecondary} disabled={saving} type="button" onClick={reset}>
            Reset default
          </button>
        </div>
      </section>

      <section className={styles.emailPreview} aria-label="Email preview">
        <span className={styles.label}>Live preview</span>
        <h2>{previewSubject}</h2>
        <div className={styles.emailPreviewBody}>
          {previewBody.split('\n').map((line, index) => (
            <p key={`${line}-${index}`}>{line || '\u00a0'}</p>
          ))}
        </div>
      </section>
    </div>
  );
}
