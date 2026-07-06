'use client';

import { useState } from 'react';
import { defineComponent } from '../define';
import ContactFormInspector from './Inspector';
import styles from './ContactForm.module.css';
import type { Locale } from '@/lib/locales';
import {
  CONTACT_FORM_LEGACY_DEFAULTS,
  getConversionWidgetsCopy,
  localizedContactFormSubmitLabel,
} from '../conversion-widgets-copy';

interface ContactFormContent {
  fields: string[];
  submitLabel: string;
  action: string;
}

function ContactFormRender({ node, locale = 'ko' }: { node: { content: ContactFormContent }; locale?: Locale }) {
  const copy = getConversionWidgetsCopy(locale);
  const {
    fields = CONTACT_FORM_LEGACY_DEFAULTS.fields,
    submitLabel = copy.contactForm.defaultSubmitLabel,
    action = CONTACT_FORM_LEGACY_DEFAULTS.action,
  } = node.content;
  const displaySubmitLabel = localizedContactFormSubmitLabel(submitLabel, copy.contactForm.defaultSubmitLabel);

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');

    const formData = new FormData(e.currentTarget);
    const body: Record<string, string> = {};
    formData.forEach((value, key) => {
      body[key] = value.toString();
    });

    try {
      const res = await fetch(action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className={styles.success}>
        {copy.contactForm.successMessage}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.form}
    >
      {fields.map((field) => {
        const label = copy.contactForm.fieldLabels[field as keyof typeof copy.contactForm.fieldLabels] || field;
        const isTextarea = field === 'message';

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
              />
            ) : (
              <input
                id={`contact-${field}`}
                name={field}
                type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                className={styles.input}
              />
            )}
          </div>
        );
      })}
      {status === 'error' && (
        <p className={styles.error}>
          {copy.contactForm.errorMessage}
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
