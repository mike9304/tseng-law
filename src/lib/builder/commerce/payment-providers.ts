import type { Locale } from '@/lib/locales';
import type { CommerceCurrency } from './products-shared';
import type { CommerceOrderPayment, CommerceOrderPaymentStatus } from './orders-shared';

export const COMMERCE_PAYMENT_PROVIDER_VERSION = 1;

export type CommercePaymentProviderId = 'manual-invoice' | 'sandbox-card';
export type CommercePaymentIntentStatus =
  | 'requires_manual_payment'
  | 'authorized'
  | 'captured'
  | 'failed';

export interface CommercePaymentIntent {
  version: typeof COMMERCE_PAYMENT_PROVIDER_VERSION;
  intentId: string;
  provider: CommercePaymentProviderId;
  locale: Locale;
  currency: CommerceCurrency;
  amountCents: number;
  status: CommercePaymentIntentStatus;
  clientSecret?: string;
  stub: boolean;
  failureCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommercePaymentIntentInput {
  provider: CommercePaymentProviderId;
  locale: Locale;
  currency: CommerceCurrency;
  amountCents: number;
  now?: string;
  simulateFailure?: boolean;
}

const PAYMENT_LABELS: Record<CommercePaymentProviderId, Record<Locale, string>> = {
  'manual-invoice': {
    ko: '수동 송장 결제',
    'zh-hant': '人工發票付款',
    en: 'Manual invoice',
  },
  'sandbox-card': {
    ko: '샌드박스 카드 승인',
    'zh-hant': '沙盒卡片授權',
    en: 'Sandbox card authorization',
  },
};

function stamp(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function isLocale(value: unknown): value is Locale {
  return value === 'ko' || value === 'zh-hant' || value === 'en';
}

function isCurrency(value: unknown): value is CommerceCurrency {
  return value === 'TWD' || value === 'KRW' || value === 'USD';
}

export function isCommercePaymentProvider(value: unknown): value is CommercePaymentProviderId {
  return value === 'manual-invoice' || value === 'sandbox-card';
}

export function normalizeCommercePaymentProvider(value: unknown): CommercePaymentProviderId {
  return isCommercePaymentProvider(value) ? value : 'manual-invoice';
}

export function commercePaymentProviderLabel(provider: CommercePaymentProviderId, locale: Locale): string {
  return PAYMENT_LABELS[provider][locale];
}

export function normalizeCommercePaymentIntent(input: unknown): CommercePaymentIntent | null {
  if (!input || typeof input !== 'object') return null;
  const source = input as Partial<CommercePaymentIntent>;
  if (
    source.version !== COMMERCE_PAYMENT_PROVIDER_VERSION
    || !source.intentId
    || !isCommercePaymentProvider(source.provider)
    || !isLocale(source.locale)
    || !isCurrency(source.currency)
  ) {
    return null;
  }
  const amountCents = Number(source.amountCents);
  if (!Number.isFinite(amountCents) || amountCents < 0) return null;
  const status = source.provider === 'manual-invoice'
    ? 'requires_manual_payment'
    : source.status === 'authorized' || source.status === 'captured' || source.status === 'failed'
      ? source.status
      : 'authorized';
  const now = new Date().toISOString();

  return {
    version: COMMERCE_PAYMENT_PROVIDER_VERSION,
    intentId: String(source.intentId),
    provider: source.provider,
    locale: source.locale,
    currency: source.currency,
    amountCents: Math.floor(amountCents),
    status,
    clientSecret: typeof source.clientSecret === 'string' ? source.clientSecret : undefined,
    // Manual invoices are a real offline collection workflow. Sandbox card
    // intents are always simulations, even if a persisted payload claims
    // otherwise.
    stub: source.provider === 'sandbox-card',
    failureCode: typeof source.failureCode === 'string' ? source.failureCode : undefined,
    createdAt: typeof source.createdAt === 'string' ? source.createdAt : now,
    updatedAt: typeof source.updatedAt === 'string' ? source.updatedAt : now,
  };
}

export function createCommercePaymentIntent(input: CommercePaymentIntentInput): CommercePaymentIntent {
  const now = input.now ?? new Date().toISOString();
  const amountCents = Math.max(0, Math.floor(input.amountCents));
  const failed = Boolean(input.simulateFailure);
  if (input.provider === 'manual-invoice') {
    return {
      version: COMMERCE_PAYMENT_PROVIDER_VERSION,
      intentId: stamp('pi_manual'),
      provider: 'manual-invoice',
      locale: input.locale,
      currency: input.currency,
      amountCents,
      status: 'requires_manual_payment',
      stub: false,
      createdAt: now,
      updatedAt: now,
    };
  }

  return {
    version: COMMERCE_PAYMENT_PROVIDER_VERSION,
    intentId: stamp('pi_sandbox'),
    provider: 'sandbox-card',
    locale: input.locale,
    currency: input.currency,
    amountCents,
    status: failed ? 'failed' : 'authorized',
    clientSecret: failed ? undefined : `${stamp('cs_sandbox')}_secret`,
    stub: true,
    failureCode: failed ? 'sandbox_card_declined' : undefined,
    createdAt: now,
    updatedAt: now,
  };
}

export function captureCommercePaymentIntent(input: unknown, options: { simulateFailure?: boolean; now?: string } = {}): CommercePaymentIntent | null {
  const intent = normalizeCommercePaymentIntent(input);
  if (!intent) return null;
  const now = options.now ?? new Date().toISOString();
  if (intent.provider === 'manual-invoice') {
    return { ...intent, updatedAt: now };
  }
  if (options.simulateFailure || intent.status === 'failed') {
    return {
      ...intent,
      status: 'failed',
      failureCode: intent.failureCode ?? 'sandbox_capture_failed',
      updatedAt: now,
    };
  }
  return {
    ...intent,
    status: 'captured',
    updatedAt: now,
  };
}

export function paymentIntentToOrderStatus(intent: CommercePaymentIntent): CommerceOrderPaymentStatus {
  if (intent.status === 'captured') return 'paid';
  if (intent.status === 'failed') return 'failed';
  if (intent.status === 'authorized') return 'authorized_stub';
  return 'requires_manual_payment';
}

export function paymentIntentToOrderPayment(intent: CommercePaymentIntent, locale: Locale): CommerceOrderPayment {
  return {
    adapter: intent.provider,
    status: paymentIntentToOrderStatus(intent),
    label: commercePaymentProviderLabel(intent.provider, locale),
    stub: intent.stub,
    referenceId: intent.intentId,
  };
}
