import { CONTACT_FORM_LEGACY_DEFAULTS } from '../conversion-widgets-copy';
import { getContactFormLocalCopy } from './contact-form-copy';

export const DEFAULT_CONSULTATION_ACTION = CONTACT_FORM_LEGACY_DEFAULTS.action;
export const DEFAULT_REQUIRED_FIELDS = ['name', 'email', 'message'] as const;

const LIMITS = {
  name: 120,
  email: 254,
  phoneOrMessenger: 120,
  summary: 10_000,
  preferredContact: 80,
  companyOrOrganization: 200,
  sessionId: 120,
} as const;

export type ConsultationLocale = 'ko' | 'en' | 'zh-hant';

export type ConsultationSubmitBody = {
  sessionId: string;
  collectedFields: {
    name: string;
    email: string;
    summary: string;
    consent: true;
    phoneOrMessenger?: string;
    companyOrOrganization?: string;
    preferredContact?: string;
  };
  locale?: ConsultationLocale;
};

export type ContactFormPlan =
  | { kind: 'custom'; body: Record<string, string> }
  | { kind: 'consultation'; body: ConsultationSubmitBody }
  | {
      kind: 'blocked';
      reason: 'consent_required' | 'ja_unsupported' | 'misconfigured' | 'validation';
      message: string;
    };

export function isDefaultConsultationAction(action: string): boolean {
  return action.trim() === DEFAULT_CONSULTATION_ACTION;
}

export function isRuntimeJa(locale: string): boolean {
  return locale === 'ja';
}

export function isConsultationLocale(locale: string): locale is ConsultationLocale {
  return locale === 'ko' || locale === 'en' || locale === 'zh-hant';
}

export function isMissingRequiredConsultationFields(fields: string[]): boolean {
  return DEFAULT_REQUIRED_FIELDS.some((key) => !fields.includes(key));
}

export function createContactFormSessionId(): string {
  const uuid = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`;
  return `contact-form-${uuid}`;
}

function isValidEmail(value: string): boolean {
  if (/[\r\n]/.test(value)) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function planContactFormSubmit(input: {
  action: string;
  locale: string;
  sessionId: string;
  enabledFields: string[];
  values: Record<string, string>;
  consentChecked: boolean;
}): ContactFormPlan {
  if (!isDefaultConsultationAction(input.action)) {
    const body: Record<string, string> = {};
    for (const [key, value] of Object.entries(input.values)) {
      if (key === 'consent') continue;
      body[key] = value;
    }
    return { kind: 'custom', body };
  }

  const copy = getContactFormLocalCopy(input.locale);

  if (isRuntimeJa(input.locale)) {
    return { kind: 'blocked', reason: 'ja_unsupported', message: copy.jaUnsupported };
  }

  if (isMissingRequiredConsultationFields(input.enabledFields)) {
    return { kind: 'blocked', reason: 'misconfigured', message: copy.misconfigured };
  }

  if (!input.consentChecked) {
    return { kind: 'blocked', reason: 'consent_required', message: copy.consentRequired };
  }

  if (!input.sessionId.trim() || input.sessionId.length > LIMITS.sessionId) {
    return { kind: 'blocked', reason: 'validation', message: copy.error };
  }

  const name = (input.values.name ?? '').trim();
  const email = (input.values.email ?? '').trim();
  const message = (input.values.message ?? '').trim();
  const phone = (input.values.phone ?? '').trim();
  const company = (input.values.company ?? '').trim();
  const subject = (input.values.subject ?? '').trim();
  const address = (input.values.address ?? '').trim();
  const preference = (input.values.preference ?? '').trim();

  if (!name) return { kind: 'blocked', reason: 'validation', message: copy.nameRequired };
  if (!email) return { kind: 'blocked', reason: 'validation', message: copy.emailRequired };
  if (!isValidEmail(email)) return { kind: 'blocked', reason: 'validation', message: copy.emailInvalid };
  if (!message) return { kind: 'blocked', reason: 'validation', message: copy.messageRequired };

  if (name.length > LIMITS.name) {
    return { kind: 'blocked', reason: 'validation', message: copy.tooLong('name', LIMITS.name) };
  }
  if (email.length > LIMITS.email) {
    return { kind: 'blocked', reason: 'validation', message: copy.tooLong('email', LIMITS.email) };
  }
  if (phone.length > LIMITS.phoneOrMessenger) {
    return { kind: 'blocked', reason: 'validation', message: copy.tooLong('phone', LIMITS.phoneOrMessenger) };
  }
  if (company.length > LIMITS.companyOrOrganization) {
    return { kind: 'blocked', reason: 'validation', message: copy.tooLong('company', LIMITS.companyOrOrganization) };
  }
  if (preference.length > LIMITS.preferredContact) {
    return { kind: 'blocked', reason: 'validation', message: copy.tooLong('preference', LIMITS.preferredContact) };
  }

  const summaryParts = [message];
  if (subject) summaryParts.push(`${copy.summaryLabels.subject}: ${subject}`);
  if (address) summaryParts.push(`${copy.summaryLabels.address}: ${address}`);
  const summary = summaryParts.join('\n\n');
  if (summary.length > LIMITS.summary) {
    return { kind: 'blocked', reason: 'validation', message: copy.summaryTooLong(LIMITS.summary) };
  }

  const collectedFields: ConsultationSubmitBody['collectedFields'] = {
    name,
    email,
    summary,
    consent: true,
  };
  if (phone) collectedFields.phoneOrMessenger = phone;
  if (company) collectedFields.companyOrOrganization = company;
  if (preference) collectedFields.preferredContact = preference;

  const body: ConsultationSubmitBody = {
    sessionId: input.sessionId,
    collectedFields,
  };
  if (isConsultationLocale(input.locale)) {
    body.locale = input.locale;
  }

  return { kind: 'consultation', body };
}
