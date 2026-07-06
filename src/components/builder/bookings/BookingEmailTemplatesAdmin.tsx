'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import type { BookingEmailTemplate, BookingEmailTemplateType } from '@/lib/builder/bookings/types';
import {
  bookingEmailTemplatePlaceholders,
  getBookingEmailTemplateConfig,
} from '@/lib/builder/bookings/email-template-config';
import type { Locale } from '@/lib/locales';
import { bookingEmailTemplateAdminCopy, renderBookingEmailPreviewSample, sampleBookingEmailValuesForLocale } from './BookingEmailTemplatesAdmin.support';
import styles from './BookingsAdmin.module.css';

type Draft = Pick<BookingEmailTemplate, 'type' | 'subject' | 'body' | 'isActive'>;

function draftFromTemplate(template: BookingEmailTemplate): Draft {
  return {
    type: template.type,
    subject: template.subject,
    body: template.body,
    isActive: template.isActive,
  };
}

export default function BookingEmailTemplatesAdmin({
  locale,
  initialTemplates,
}: {
  locale: Locale;
  initialTemplates: BookingEmailTemplate[];
}) {
  const [templates, setTemplates] = useState(initialTemplates);
  const [selectedType, setSelectedType] = useState<BookingEmailTemplateType>(initialTemplates[0]?.type ?? 'customer-confirmation');
  const subjectRef = useRef<HTMLInputElement | null>(null);
  const bodyRef = useRef<HTMLTextAreaElement | null>(null);
  const activeFieldRef = useRef<'subject' | 'body'>('subject');
  const c = bookingEmailTemplateAdminCopy[locale];
  const templateConfig = getBookingEmailTemplateConfig(locale);
  const defaultDraft = useCallback((type: BookingEmailTemplateType): Draft => {
    const config = templateConfig[type];
    return {
      type,
      subject: config.subject,
      body: config.body,
      isActive: true,
    };
  }, [templateConfig]);
  const selectedTemplate = useMemo(
    () => templates.find((template) => template.type === selectedType) ?? {
      ...defaultDraft(selectedType),
      templateId: selectedType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    [defaultDraft, selectedType, templates],
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
      const response = await fetch(`/api/builder/bookings/email-templates/${draft.type}?locale=${
        encodeURIComponent(locale)
      }`, {
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
      const savedTemplate = payload.template;
      setTemplates((current) => current.map((template) => (
        template.type === savedTemplate.type ? savedTemplate : template
      )));
      setDraft(draftFromTemplate(savedTemplate));
      setMessage(c.saved);
    } catch {
      setError(c.saveFailed);
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    setDraft(defaultDraft(selectedType));
    setMessage(null);
    setError(null);
  };

  const setFocusedField = (field: 'subject' | 'body') => {
    activeFieldRef.current = field;
  };

  const insertToken = (token: string) => {
    const activeElement = document.activeElement;
    const field =
      activeElement === bodyRef.current
        ? 'body'
        : activeElement === subjectRef.current
          ? 'subject'
          : activeFieldRef.current;
    const target = field === 'body' ? bodyRef.current : subjectRef.current;
    if (!target) return;
    const targetField = target === bodyRef.current ? 'body' : 'subject';
    const selectionStart = target.selectionStart ?? target.value.length;
    const selectionEnd = target.selectionEnd ?? target.value.length;
    const nextValue = `${target.value.slice(0, selectionStart)}{{${token}}}${target.value.slice(selectionEnd)}`;
    const nextDraft = targetField === 'body'
      ? { ...draft, body: nextValue }
      : { ...draft, subject: nextValue };
    setDraft(nextDraft);
    setFocusedField(targetField);
    requestAnimationFrame(() => {
      target.focus();
      const cursor = selectionStart + token.length + 4;
      target.setSelectionRange(cursor, cursor);
    });
  };

  const previewValues = useMemo(() => sampleBookingEmailValuesForLocale(locale), [locale]);
  const previewSubject = renderBookingEmailPreviewSample(draft.subject, previewValues);
  const previewBody = renderBookingEmailPreviewSample(draft.body, previewValues);

  return (
    <div className={styles.emailTemplateLayout}>
      <aside className={styles.emailTemplateList} aria-label={c.listLabel}>
        {templates.map((template) => {
          const config = templateConfig[template.type];
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

      <section className={styles.panel} aria-label={c.editorLabel}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.cardTitle}>{templateConfig[draft.type].label}</h2>
            <p className={styles.muted}>{templateConfig[draft.type].description}</p>
          </div>
          <label className={styles.toggleRow}>
            <input
              checked={draft.isActive}
              type="checkbox"
              onChange={(event) => setDraft({ ...draft, isActive: event.target.checked })}
            />
            {c.active}
          </label>
        </div>

        {message ? <p className={styles.notice}>{message}</p> : null}
        {error ? <p className={styles.error}>{error}</p> : null}

        <div className={styles.formGrid}>
          <label className={`${styles.field} ${styles.fieldFull}`}>
            <span className={styles.label}>{c.subject}</span>
            <input
              className={styles.input}
              ref={subjectRef}
              value={draft.subject}
              placeholder={c.subjectPlaceholder}
              onFocus={() => setFocusedField('subject')}
              onChange={(event) => {
                setFocusedField('subject');
                setDraft({ ...draft, subject: event.target.value });
              }}
            />
          </label>
          <label className={`${styles.field} ${styles.fieldFull}`}>
            <span className={styles.label}>{c.body}</span>
            <textarea
              className={`${styles.textarea} ${styles.emailTemplateTextarea}`}
              ref={bodyRef}
              value={draft.body}
              placeholder={c.bodyPlaceholder}
              onFocus={() => setFocusedField('body')}
              onChange={(event) => {
                setFocusedField('body');
                setDraft({ ...draft, body: event.target.value });
              }}
            />
          </label>
        </div>

        <div className={styles.placeholderGrid} aria-label={c.placeholders}>
          {bookingEmailTemplatePlaceholders.map((placeholder) => (
            <button
              key={placeholder}
              className={styles.placeholderToken}
              type="button"
              data-placeholder-token={placeholder}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => insertToken(placeholder)}
            >
              {`{{${placeholder}}}`}
            </button>
          ))}
        </div>

        <div className={styles.inlineActions}>
          <button className={styles.button} disabled={saving} type="button" onClick={save}>
            {saving ? c.saving : c.save}
          </button>
          <button className={styles.buttonSecondary} disabled={saving} type="button" onClick={reset}>
            {c.reset}
          </button>
        </div>
      </section>

      <section className={styles.emailPreview} aria-label={c.preview}>
        <span className={styles.label}>{c.preview}</span>
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
