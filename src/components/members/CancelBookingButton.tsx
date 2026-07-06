'use client';

import { useRouter } from 'next/navigation';
import { useState, type CSSProperties } from 'react';

type CancelBookingButtonProps = {
  className?: string;
  dataCancelBooking?: string;
  doneLabel: string;
  failedLabel: string;
  href: string;
  label: string;
  pendingLabel: string;
  style?: CSSProperties;
};

export function CancelBookingButton({
  className,
  dataCancelBooking,
  doneLabel,
  failedLabel,
  href,
  label,
  pendingLabel,
  style,
}: CancelBookingButtonProps) {
  const router = useRouter();
  const [state, setState] = useState<'idle' | 'pending' | 'done' | 'failed'>('idle');

  async function handleCancel() {
    if (state === 'pending' || state === 'done') return;
    setState('pending');
    try {
      const response = await fetch(href, { method: 'POST', credentials: 'same-origin' });
      if (!response.ok) {
        setState('failed');
        return;
      }
      setState('done');
      router.refresh();
    } catch {
      setState('failed');
    }
  }

  const text = state === 'pending' ? pendingLabel : state === 'done' ? doneLabel : state === 'failed' ? failedLabel : label;

  return (
    <button
      aria-live="polite"
      className={className}
      data-cancel-booking={dataCancelBooking}
      data-member-booking-detail-cancel={dataCancelBooking}
      disabled={state === 'pending' || state === 'done'}
      onClick={handleCancel}
      style={style}
      type="button"
    >
      {text}
    </button>
  );
}
