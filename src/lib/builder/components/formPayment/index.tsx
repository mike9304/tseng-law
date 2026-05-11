import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderFormPaymentCanvasNode } from '@/lib/builder/canvas/types';

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
}: {
  node: BuilderFormPaymentCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const c = node.content;

  return (
    <fieldset
      className="builder-form-payment"
      data-builder-form-widget="payment"
      data-builder-form-name={c.name}
      data-builder-payment-provider={c.provider}
    >
      <legend>{c.label}</legend>
      <div className="builder-form-payment-summary">
        <strong>{formatAmount(c.amountCents, c.currency)}</strong>
        <small>{c.description}</small>
      </div>
      <button type="button" disabled={mode === 'edit'}>
        {c.provider === 'manual' ? '계좌 안내 보기' : 'Stripe로 결제 진행'}
      </button>
      {c.showSecurityNote ? (
        <small className="builder-form-payment-security">
          결제는 외부 PG(Stripe)에서 안전하게 처리됩니다.
        </small>
      ) : null}
    </fieldset>
  );
}

function FormPaymentInspector({
  node,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const pNode = node as BuilderFormPaymentCanvasNode;
  const c = pNode.content;
  return (
    <>
      <label>
        <span>이름 (name)</span>
        <input type="text" value={c.name} disabled={disabled} onChange={(event) => onUpdate({ name: event.target.value })} />
      </label>
      <label>
        <span>라벨</span>
        <input type="text" value={c.label} disabled={disabled} onChange={(event) => onUpdate({ label: event.target.value })} />
      </label>
      <label>
        <span>공급자</span>
        <select
          value={c.provider}
          disabled={disabled}
          onChange={(event) => onUpdate({ provider: event.target.value as BuilderFormPaymentCanvasNode['content']['provider'] })}
        >
          <option value="stripe-checkout">Stripe Checkout</option>
          <option value="stripe-payment-element">Stripe Payment Element</option>
          <option value="manual">계좌 안내 (수동)</option>
        </select>
      </label>
      <label>
        <span>금액 (최소 단위)</span>
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
        <span>통화</span>
        <select
          value={c.currency}
          disabled={disabled}
          onChange={(event) => onUpdate({ currency: event.target.value as BuilderFormPaymentCanvasNode['content']['currency'] })}
        >
          <option value="KRW">KRW (원)</option>
          <option value="USD">USD ($)</option>
          <option value="TWD">TWD (NT$)</option>
          <option value="JPY">JPY (¥)</option>
          <option value="EUR">EUR (€)</option>
        </select>
      </label>
      <label>
        <span>설명</span>
        <textarea rows={2} value={c.description} disabled={disabled} onChange={(event) => onUpdate({ description: event.target.value })} />
      </label>
      <label>
        <span>성공 URL</span>
        <input type="text" value={c.successUrl} disabled={disabled} onChange={(event) => onUpdate({ successUrl: event.target.value })} />
      </label>
      <label>
        <span>취소 URL</span>
        <input type="text" value={c.cancelUrl} disabled={disabled} onChange={(event) => onUpdate({ cancelUrl: event.target.value })} />
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <input type="checkbox" checked={c.showSecurityNote} disabled={disabled} onChange={(event) => onUpdate({ showSecurityNote: event.target.checked })} />
        <span>보안 안내 표시</span>
      </label>
    </>
  );
}

export default defineComponent({
  kind: 'form-payment',
  displayName: '결제',
  category: 'advanced',
  icon: '💳',
  defaultContent: {
    name: 'payment',
    label: '결제',
    provider: 'stripe-checkout' as const,
    amountCents: 100000,
    currency: 'KRW' as const,
    description: '상담 비용',
    successUrl: '',
    cancelUrl: '',
    showSecurityNote: true,
  },
  defaultStyle: {},
  defaultRect: { width: 420, height: 200 },
  Render: FormPaymentRender,
  Inspector: FormPaymentInspector,
});
