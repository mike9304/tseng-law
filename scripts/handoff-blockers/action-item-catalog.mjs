import { actionItemMetadata } from './reporting.mjs';

export const AUTH_SMOKE_MISSING = [
  'BUILDER_SMOKE_USERNAME/BUILDER_SMOKE_PASSWORD',
  'CMS_ADMIN_USERNAME/CMS_ADMIN_PASSWORD',
  'BUILDER_BASIC_AUTH_USERS',
];

export const ACTION_ITEMS = {
  publicAsset: {
    code: 'public_asset',
    category: 'public_asset',
    owner: 'developer',
    requiresSecret: false,
  },
  authBoundary: {
    code: 'admin_builder_auth_boundary',
    category: 'security_boundary',
    owner: 'developer',
    requiresSecret: false,
  },
  authSmoke: {
    code: 'admin_builder_auth_smoke',
    category: 'auth_credentials',
    owner: 'operator',
    requiresSecret: true,
  },
  basicAuthUsers: {
    code: 'builder_basic_auth_users',
    category: 'auth_credentials',
    owner: 'operator',
    requiresSecret: true,
  },
  bookingFormMail: {
    code: 'booking_form_mail',
    category: 'provider_credentials',
    owner: 'client',
    requiresSecret: true,
  },
  bookingFormMailResendAlternate: {
    code: 'booking_form_mail_resend_alternate',
    category: 'provider_alternate',
    owner: 'client',
    requiresSecret: true,
  },
  bookingFormMailSmtpAlternate: {
    code: 'booking_form_mail_smtp_alternate',
    category: 'provider_alternate',
    owner: 'client',
    requiresSecret: true,
  },
  marketingMail: {
    code: 'marketing_mail',
    category: 'provider_credentials',
    owner: 'client',
    requiresSecret: true,
  },
  stripeBookingPayment: {
    code: 'stripe_booking_payment',
    category: 'provider_credentials',
    owner: 'client',
    requiresSecret: true,
  },
  zoom: {
    code: 'zoom',
    category: 'provider_credentials',
    owner: 'client',
    requiresSecret: true,
  },
  googleCalendar: {
    code: 'google_calendar',
    category: 'provider_credentials',
    owner: 'client',
    requiresSecret: true,
  },
  outlookCalendar: {
    code: 'outlook_calendar',
    category: 'provider_credentials',
    owner: 'client',
    requiresSecret: true,
  },
  translationAiOpenai: {
    code: 'translation_ai_openai',
    category: 'provider_credentials',
    owner: 'client',
    requiresSecret: true,
  },
  translationAiDeepl: {
    code: 'translation_ai_deepl',
    category: 'provider_credentials',
    owner: 'client',
    requiresSecret: true,
  },
  upstashRateLimit: {
    code: 'upstash_rate_limit',
    category: 'provider_credentials',
    owner: 'client',
    requiresSecret: true,
  },
  blobPersistence: {
    code: 'blob_persistence',
    category: 'provider_credentials',
    owner: 'client',
    requiresSecret: true,
  },
};

export function actionItem(base, missing = []) {
  return actionItemMetadata({ ...base, missing });
}
