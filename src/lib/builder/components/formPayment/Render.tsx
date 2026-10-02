'use client';

import { useState } from 'react';
import type { BuilderFormPaymentCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import { FORM_PAYMENT_KO_DEFAULTS, getFormControlsCopy, localizedFormControlText } from '../form/form-controls-copy';

const CURRENCY_SYMBOL: Record<BuilderFormPaymentCanvasNode['content']['currency'], string> = {
  KRW: '₩',
  USD: '$',
  TWD: 'NT$',
  JPY: '¥',
  EUR: '€',
};

function formatAmount(amountCents: number, currency: BuilderFormPaymentCanvasNode['content']['currency']): string {
  const major = currency === 'KRW' || currency === 'JPY' ? amountCents : amountCents / 100;
  return `${CURRENCY_SYMBOL[currency]}${major.toLocaleString()}`;
}

function FormPaymentRender({
  node,
  mode = 'edit',
  locale = 'ko',
}: {
  node: BuilderFormPaymentCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
  locale?: Locale;
}) {
  const c = node.content;
  const copy = getFormControlsCopy(locale);
  const label = localizedFormControlText(c.label, copy.paymentWidget.defaults.label, FORM_PAYMENT_KO_DEFAULTS.label);
  const description = localizedFormControlText(
    c.description,
    copy.paymentWidget.defaults.description,
    FORM_PAYMENT_KO_DEFAULTS.description,
  );
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  async function startPayment() {
    if (mode === 'edit') return;
    if (c.provider === 'manual') {
      setStatus('idle');
      return;
    }
    setStatus('loading');
    const response = await fetch('/api/forms/stripe-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amountCents: c.amountCents,
        currency: c.currency,
        description: description || label,
        successUrl: c.successUrl || undefined,
        cancelUrl: c.cancelUrl || undefined,
      }),
    });
    const payload = (await response.json().catch(() => ({}))) as { url?: string };
    if (response.ok && payload.url && typeof window !== 'undefined') {
      window.location.href = payload.url;
      return;
    }
    setStatus('error');
  }

  return (
    <fieldset
      className="builder-form-payment"
      data-builder-form-widget="payment"
      data-builder-form-name={c.name}
      data-builder-payment-provider={c.provider}
    >
      <legend>{label}</legend>
      <div className="builder-form-payment-summary">
        <strong>{formatAmount(c.amountCents, c.currency)}</strong>
        <small>{description}</small>
      </div>
      <button type="button" disabled={mode === 'edit' || status === 'loading'} onClick={startPayment}>
        {status === 'loading'
          ? copy.paymentWidget.loadingLabel
          : c.provider === 'manual'
            ? copy.paymentWidget.manualButtonLabel
            : copy.paymentWidget.stripeButtonLabel}
      </button>
      <input type="hidden" name={c.name} value={`${c.provider}:${c.currency}:${c.amountCents}`} readOnly />
      {c.showSecurityNote ? (
        <small className="builder-form-payment-security">
          {copy.paymentWidget.securityNote}
        </small>
      ) : null}
      {status === 'error' ? <small role="alert">{copy.paymentWidget.stripeError}</small> : null}
    </fieldset>
  );
}

export default FormPaymentRender;
