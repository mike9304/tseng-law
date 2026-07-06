'use client';

import { useRouter } from 'next/navigation';
import { useState, type CSSProperties } from 'react';

type RenewPaymentLinkButtonProps = {
  className?: string;
  dataRenewPaymentLink?: string;
  failedLabel: string;
  href: string;
  label: string;
  pendingLabel: string;
  renewedLabel: string;
  style?: CSSProperties;
};

export function RenewPaymentLinkButton({
  className,
  dataRenewPaymentLink,
  failedLabel,
  href,
  label,
  pendingLabel,
  renewedLabel,
  style,
}: RenewPaymentLinkButtonProps) {
  const router = useRouter();
  const [state, setState] = useState<'idle' | 'pending' | 'renewed' | 'failed'>('idle');

  async function handleRenew() {
    if (state === 'pending') return;
    setState('pending');
    try {
      const response = await fetch(href, { method: 'POST', credentials: 'same-origin' });
      if (!response.ok) {
        setState('failed');
        return;
      }
      setState('renewed');
      router.refresh();
    } catch {
      setState('failed');
    }
  }

  const text = state === 'pending' ? pendingLabel : state === 'renewed' ? renewedLabel : state === 'failed' ? failedLabel : label;

  return (
    <button
      aria-live="polite"
      className={className}
      data-renew-payment-link={dataRenewPaymentLink}
      onClick={handleRenew}
      style={style}
      type="button"
      disabled={state === 'pending' || state === 'renewed'}
    >
      {text}
    </button>
  );
}
