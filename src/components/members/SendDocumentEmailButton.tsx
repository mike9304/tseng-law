'use client';

import { useState, type CSSProperties } from 'react';

type SendDocumentEmailButtonProps = {
  className?: string;
  dataSendEmail?: string;
  href: string;
  label: string;
  pendingLabel: string;
  sentLabel: string;
  failedLabel: string;
  style?: CSSProperties;
};

export function SendDocumentEmailButton({
  className,
  dataSendEmail,
  href,
  label,
  pendingLabel,
  sentLabel,
  failedLabel,
  style,
}: SendDocumentEmailButtonProps) {
  const [state, setState] = useState<'idle' | 'pending' | 'sent' | 'failed'>('idle');

  async function handleSend() {
    if (state === 'pending') return;
    setState('pending');
    try {
      const response = await fetch(href, { method: 'POST', credentials: 'same-origin' });
      if (!response.ok) {
        setState('failed');
        return;
      }
      setState('sent');
    } catch {
      setState('failed');
    }
  }

  const text = state === 'pending' ? pendingLabel : state === 'sent' ? sentLabel : state === 'failed' ? failedLabel : label;

  return (
    <button
      aria-live="polite"
      className={className}
      data-send-email={dataSendEmail}
      onClick={handleSend}
      style={style}
      type="button"
      disabled={state === 'pending' || state === 'sent'}
    >
      {text}
    </button>
  );
}
