'use client';

import { useState } from 'react';
import { defineComponent } from '../define';

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
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          background: '#f0fdf4',
          borderRadius: 8,
          color: '#166534',
          fontSize: 15,
          fontWeight: 600,
        }}
      >
        Thank you! Your message has been sent.
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    fontSize: 14,
    border: '1px solid #d1d5db',
    borderRadius: 6,
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        padding: 16,
      }}
    >
      {fields.map((field) => {
        const label = fieldLabels[field] || field;
        const isTextarea = field === 'message';

        return (
          <div key={field} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label
              htmlFor={`contact-${field}`}
              style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}
            >
              {label}
            </label>
            {isTextarea ? (
              <textarea
                id={`contact-${field}`}
                name={field}
                rows={4}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            ) : (
              <input
                id={`contact-${field}`}
                name={field}
                type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                style={inputStyle}
              />
            )}
          </div>
        );
      })}
      {status === 'error' && (
        <p style={{ margin: 0, fontSize: 13, color: '#dc2626' }}>
          Failed to send. Please try again.
        </p>
      )}
      <button
        type="submit"
        disabled={status === 'submitting'}
        style={{
          padding: '10px 24px',
          fontSize: 15,
          fontWeight: 600,
          color: '#ffffff',
          background: status === 'submitting' ? '#94a3b8' : '#0b3b2e',
          border: 'none',
          borderRadius: 6,
          cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
          alignSelf: 'flex-start',
        }}
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
});
