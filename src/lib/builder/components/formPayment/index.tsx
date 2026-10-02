'use client';

import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderFormPaymentCanvasNode } from '@/lib/builder/canvas/types';
import { FORM_PAYMENT_KO_DEFAULTS, getFormControlsCopy, localizedFormControlText } from '../form/form-controls-copy';
import inspectorStyles from '../form/FormControlInspector.module.css';

import FormPaymentRender from './Render';

function FormPaymentInspector({
  node,
  locale = 'ko',
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const pNode = node as BuilderFormPaymentCanvasNode;
  const c = pNode.content;
  const paymentCopy = getFormControlsCopy(locale).paymentWidget;
  const copy = paymentCopy.inspector;
  const label = localizedFormControlText(c.label, paymentCopy.defaults.label, FORM_PAYMENT_KO_DEFAULTS.label);
  const description = localizedFormControlText(
    c.description,
    paymentCopy.defaults.description,
    FORM_PAYMENT_KO_DEFAULTS.description,
  );
  return (
    <div className={inspectorStyles.root} data-builder-form-advanced-inspector="payment">
      <label>
        <span>{copy.nameLabel}</span>
        <input type="text" value={c.name} disabled={disabled} onChange={(event) => onUpdate({ name: event.target.value })} />
      </label>
      <label>
        <span>{copy.labelLabel}</span>
        <input type="text" value={label} disabled={disabled} onChange={(event) => onUpdate({ label: event.target.value })} />
      </label>
      <label>
        <span>{copy.providerLabel}</span>
        <select
          value={c.provider}
          disabled={disabled}
          onChange={(event) => onUpdate({ provider: event.target.value as BuilderFormPaymentCanvasNode['content']['provider'] })}
        >
          <option value="stripe-checkout">Stripe Checkout</option>
          <option value="stripe-payment-element">Stripe Payment Element</option>
          <option value="manual">{copy.manualProviderLabel}</option>
        </select>
      </label>
      <label>
        <span>{copy.amountLabel}</span>
        <input
          type="number"
          min={0}
          step={1}
          value={c.amountCents}
          disabled={disabled}
          onChange={(event) => onUpdate({ amountCents: Number(event.target.value) })}
        />
      </label>
      <label>
        <span>{copy.currencyLabel}</span>
        <select
          value={c.currency}
          disabled={disabled}
          onChange={(event) => onUpdate({ currency: event.target.value as BuilderFormPaymentCanvasNode['content']['currency'] })}
        >
          <option value="KRW">{copy.currencyOptions.KRW}</option>
          <option value="USD">{copy.currencyOptions.USD}</option>
          <option value="TWD">{copy.currencyOptions.TWD}</option>
          <option value="JPY">{copy.currencyOptions.JPY}</option>
          <option value="EUR">{copy.currencyOptions.EUR}</option>
        </select>
      </label>
      <label>
        <span>{copy.descriptionLabel}</span>
        <textarea rows={2} value={description} disabled={disabled} onChange={(event) => onUpdate({ description: event.target.value })} />
      </label>
      <label>
        <span>{copy.successUrlLabel}</span>
        <input type="text" value={c.successUrl} disabled={disabled} onChange={(event) => onUpdate({ successUrl: event.target.value })} />
      </label>
      <label>
        <span>{copy.cancelUrlLabel}</span>
        <input type="text" value={c.cancelUrl} disabled={disabled} onChange={(event) => onUpdate({ cancelUrl: event.target.value })} />
      </label>
      <label>
        <input type="checkbox" checked={c.showSecurityNote} disabled={disabled} onChange={(event) => onUpdate({ showSecurityNote: event.target.checked })} />
        <span>{copy.showSecurityNoteLabel}</span>
      </label>
    </div>
  );
}

export default defineComponent({
  kind: 'form-payment',
  displayName: '결제',
  category: 'advanced',
  icon: '💳',
  defaultContent: {
    name: 'payment',
    label: FORM_PAYMENT_KO_DEFAULTS.label,
    provider: 'stripe-checkout' as const,
    amountCents: 100000,
    currency: 'KRW' as const,
    description: FORM_PAYMENT_KO_DEFAULTS.description,
    successUrl: '',
    cancelUrl: '',
    showSecurityNote: true,
  },
  defaultStyle: {},
  defaultRect: { width: 420, height: 200 },
  Render: FormPaymentRender,
  Inspector: FormPaymentInspector,
});
