'use client';

import { useRef, useState } from 'react';
import { defineComponent } from '../define';
import ContactFormInspector from './Inspector';
import styles from './ContactForm.module.css';
import type { Locale } from '@/lib/locales';
import {
  CONTACT_FORM_LEGACY_DEFAULTS,
  getConversionWidgetsCopy,
  localizedContactFormSubmitLabel,
} from '../conversion-widgets-copy';
import { getContactFormLocalCopy } from './contact-form-copy';
import {
  createContactFormSessionId,
  isDefaultConsultationAction,
  isMissingRequiredConsultationFields,
  isRuntimeJa,
} from './submit-adapter';
import { submitContactForm } from './submit-client';

interface ContactFormContent {
  fields: string[];
  submitLabel: string;
  action: string;
}

function builderCopyLocale(locale: string): Locale {
  if (locale === 'zh-hant' || locale === 'en') return locale;
  return 'ko';
}

function ContactFormRender({ node, locale = 'ko' }: { node: { content: ContactFormContent }; locale?: string }) {
  const runtimeLocale = locale || 'ko';
  const copy = getConversionWidgetsCopy(builderCopyLocale(runtimeLocale));
  const local = getContactFormLocalCopy(runtimeLocale);
  const {
    fields = CONTACT_FORM_LEGACY_DEFAULTS.fields,
    submitLabel = copy.contactForm.defaultSubmitLabel,
    action = CONTACT_FORM_LEGACY_DEFAULTS.action,
  } = node.content;
  const displaySubmitLabel = localizedContactFormSubmitLabel(submitLabel, copy.contactForm.defaultSubmitLabel);
  const defaultAction = isDefaultConsultationAction(action);
  const sessionIdRef = useRef<string | null>(null);
  if (sessionIdRef.current === null) {
    sessionIdRef.current = createContactFormSessionId();
  }

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');
  const [successText, setSuccessText] = useState(copy.contactForm.successMessage);
  const inflightRef = useRef(false);

  if (defaultAction && isRuntimeJa(runtimeLocale)) {
    return (
      <div className={styles.notice} data-contact-form-ja-unsupported="true">
        {local.jaUnsupported}
      </div>
    );
  }

  if (defaultAction && isMissingRequiredConsultationFields(fields)) {
    return (
      <div className={styles.notice} data-contact-form-config-notice="true">
        {local.misconfigured}
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inflightRef.current) return;
    inflightRef.current = true;
    setStatus('submitting');
    setFeedback('');

    const formData = new FormData(e.currentTarget);
    const values: Record<string, string> = {};
    formData.forEach((value, key) => {
      values[key] = value.toString();
    });
    const consentChecked = defaultAction && formData.get('consent') === 'on';

    const outcome = await submitContactForm({
      action,
      locale: runtimeLocale,
      sessionId: sessionIdRef.current ?? createContactFormSessionId(),
      enabledFields: fields,
      values,
      consentChecked,
    });

    if (outcome.status === 'success') {
      setSuccessText(defaultAction ? outcome.message : copy.contactForm.successMessage);
      setStatus('success');
      return;
    }

    inflightRef.current = false;
    setFeedback(outcome.message);
    setStatus('error');
  }

  if (status === 'success') {
    return (
      <div className={styles.success}>
        {successText}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.form}
      data-contact-form-mode={defaultAction ? 'consultation' : 'custom'}
    >
      {fields.map((field) => {
        const label = copy.contactForm.fieldLabels[field as keyof typeof copy.contactForm.fieldLabels] || field;
        const isTextarea = field === 'message';
        const required = defaultAction && (field === 'name' || field === 'email' || field === 'message');

        return (
          <div key={field} className={styles.field}>
            <label
              htmlFor={`contact-${field}`}
              className={styles.label}
            >
              {label}
            </label>
            {isTextarea ? (
              <textarea
                id={`contact-${field}`}
                name={field}
                rows={4}
                className={styles.textarea}
                required={required}
              />
            ) : (
              <input
                id={`contact-${field}`}
                name={field}
                type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                className={styles.input}
                required={required}
              />
            )}
          </div>
        );
      })}
      {defaultAction && (
        <label className={styles.checkboxRow}>
          <input type="checkbox" name="consent" value="on" />
          <span>{local.consentLabel}</span>
        </label>
      )}
      {status === 'error' && (
        <p className={styles.error} aria-live="polite">
          {feedback || copy.contactForm.errorMessage}
        </p>
      )}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className={styles.button}
      >
        {status === 'submitting' ? copy.contactForm.submittingLabel : displaySubmitLabel}
      </button>
    </form>
  );
}

export default defineComponent({
  kind: 'contactForm',
  displayName: 'contactForm',
  category: 'domain',
  icon: '◻',
  defaultContent: {
    fields: CONTACT_FORM_LEGACY_DEFAULTS.fields.map((field) => field),
    submitLabel: CONTACT_FORM_LEGACY_DEFAULTS.submitLabel,
    action: CONTACT_FORM_LEGACY_DEFAULTS.action,
  },
  defaultStyle: {},
  defaultRect: { width: 400, height: 250 },
  Render: ContactFormRender,
  Inspector: ContactFormInspector,
});
