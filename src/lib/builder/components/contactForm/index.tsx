'use client';

import { useState } from 'react';
import { defineComponent } from '../define';
import ContactFormInspector from './Inspector';
import styles from './ContactForm.module.css';

interface ContactFormContent {
  fields: string[];
  submitLabel: string;
  action: string;
}

const fieldLabels: Record<string, string> = {
  name: 'Name',
  email: 'Email',
  phone: 'Phone',
  message: 'Message',
};

function ContactFormRender({ node }: { node: { content: ContactFormContent } }) {
  const {
    fields = ['name', 'email', 'phone', 'message'],
    submitLabel = 'Submit',
    action = '/api/consultation/submit',
  } = node.content;

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
        Thank you! Your message has been sent.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.form}
    >
      {fields.map((field) => {
        const label = fieldLabels[field] || field;
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
          Failed to send. Please try again.
        </p>
      )}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className={styles.button}
      >
        {status === 'submitting' ? 'Sending...' : submitLabel}
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
    fields: ['name', 'email', 'phone', 'message'],
    submitLabel: 'Submit',
    action: '/api/consultation/submit',
  },
  defaultStyle: {},
  defaultRect: { width: 400, height: 250 },
  Render: ContactFormRender,
  Inspector: ContactFormInspector,
});
