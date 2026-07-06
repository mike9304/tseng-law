'use client';

import { useRouter } from 'next/navigation';
import { useState, type CSSProperties } from 'react';

function toLocalInputValue(iso: string): string {
  const date = new Date(iso);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function localInputToIso(value: string): string {
  return new Date(value).toISOString();
}

type RescheduleBookingButtonProps = {
  className?: string;
  dataRescheduleBooking?: string;
  doneLabel: string;
  failedLabel: string;
  href: string;
  initialStartAt: string;
  label: string;
  startLabel: string;
  pendingLabel: string;
  style?: CSSProperties;
};

export function RescheduleBookingButton({
  className,
  dataRescheduleBooking,
  doneLabel,
  failedLabel,
  href,
  initialStartAt,
  label,
  startLabel,
  pendingLabel,
  style,
}: RescheduleBookingButtonProps) {
  const router = useRouter();
  const [startAt, setStartAt] = useState(() => toLocalInputValue(initialStartAt));
  const [state, setState] = useState<'idle' | 'pending' | 'done' | 'failed'>('idle');

  async function handleReschedule() {
    if (state === 'pending' || state === 'done' || !startAt) return;
    setState('pending');
    try {
      const response = await fetch(href, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startAt: localInputToIso(startAt) }),
      });
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

  const buttonLabel = state === 'pending' ? pendingLabel : state === 'done' ? doneLabel : state === 'failed' ? failedLabel : label;

  return (
    <div className={className} data-member-booking-detail-reschedule={dataRescheduleBooking} style={style}>
      <label>
        <span>{startLabel}</span>
        <input
          data-member-booking-detail-reschedule-start={dataRescheduleBooking}
          onChange={(event) => setStartAt(event.target.value)}
          type="datetime-local"
          value={startAt}
        />
      </label>
      <button
        aria-live="polite"
        data-member-booking-detail-reschedule-submit={dataRescheduleBooking}
        disabled={state === 'pending' || state === 'done' || !startAt}
        onClick={handleReschedule}
        type="button"
      >
        {buttonLabel}
      </button>
    </div>
  );
}
