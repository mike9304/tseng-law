import { createHash } from 'node:crypto';
import {
  AI_INTAKE_CANONICAL_SEPARATOR,
  AI_INTAKE_CANONICAL_VERSION,
} from '@/lib/ai-intake/constants';
import { aiIntakeRandomUuid } from '@/lib/ai-intake/clock';
import {
  getAiIntakeCategoryLabel,
  getAiIntakeCopy,
  getAiIntakeFieldLabel,
} from '@/lib/ai-intake/copy';
import type { AiIntakeFields } from '@/lib/ai-intake/schemas';

export type CanonicalAiIntakeEmail = {
  intakeId: string;
  subject: string;
  body: string;
  digest: string;
  locale: AiIntakeFields['locale'];
  replyTo: string;
};

const BODY_FIELD_ORDER = [
  'name',
  'email',
  'phoneOrMessenger',
  'companyOrOrganization',
  'countryOrResidence',
  'category',
  'urgency',
  'preferredContact',
  'preferredTime',
  'summary',
  'documentsAvailable',
] as const;

export function normalizeCanonicalText(value: string): string {
  return value
    .normalize('NFC')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .trim();
}

function emptyToUndefined(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const normalized = normalizeCanonicalText(value);
  return normalized.length > 0 ? normalized : undefined;
}

export function generateAiIntakeId(uuid: string = aiIntakeRandomUuid()): string {
  const suffix = uuid.replace(/-/g, '').slice(0, 8).toUpperCase();
  return `HC-${suffix}`;
}

export function serializeCanonicalEmail(subject: string, body: string): string {
  return `${AI_INTAKE_CANONICAL_VERSION}${AI_INTAKE_CANONICAL_SEPARATOR}${subject}${AI_INTAKE_CANONICAL_SEPARATOR}${body}`;
}

export function digestCanonicalEmail(subject: string, body: string): string {
  return createHash('sha256').update(serializeCanonicalEmail(subject, body), 'utf8').digest('hex');
}

function displayValue(
  locale: AiIntakeFields['locale'],
  value: string | undefined,
): string {
  if (!value) return getAiIntakeCopy(locale).notProvided;
  return normalizeCanonicalText(value);
}

function buildSubject(fields: AiIntakeFields, intakeId: string): string {
  const copy = getAiIntakeCopy(fields.locale);
  const categoryLabel = getAiIntakeCategoryLabel(fields.locale, fields.category);
  const subject = `[tseng-law.com AI Intake ${intakeId}] ${categoryLabel} / ${copy.localeLabel}`;
  return normalizeCanonicalText(subject).replace(/[\r\n]/g, ' ').slice(0, 200);
}

function buildBody(fields: AiIntakeFields, intakeId: string): string {
  const copy = getAiIntakeCopy(fields.locale);
  const values: Record<(typeof BODY_FIELD_ORDER)[number], string> = {
    name: displayValue(fields.locale, fields.name),
    email: displayValue(fields.locale, fields.email),
    phoneOrMessenger: displayValue(fields.locale, fields.phoneOrMessenger),
    companyOrOrganization: displayValue(fields.locale, fields.companyOrOrganization),
    countryOrResidence: displayValue(fields.locale, fields.countryOrResidence),
    category: getAiIntakeCategoryLabel(fields.locale, fields.category),
    urgency: displayValue(fields.locale, fields.urgency),
    preferredContact: displayValue(fields.locale, fields.preferredContact),
    preferredTime: displayValue(fields.locale, fields.preferredTime),
    summary: displayValue(fields.locale, fields.summary),
    documentsAvailable: displayValue(fields.locale, fields.documentsAvailable),
  };

  const intakeLabel = fields.locale === 'ko'
    ? '접수 번호'
    : fields.locale === 'zh-hant'
      ? '受理編號'
      : fields.locale === 'ja'
        ? '受付番号'
        : 'Intake ID';

  const lines: string[] = [
    copy.emailGreeting,
    '',
    copy.emailIntro,
    '',
    `${intakeLabel}: ${intakeId}`,
    `${getAiIntakeFieldLabel(fields.locale, 'locale')}: ${copy.localeLabel}`,
  ];

  for (const key of BODY_FIELD_ORDER) {
    lines.push(`${getAiIntakeFieldLabel(fields.locale, key)}: ${values[key]}`);
  }

  lines.push('', copy.sensitiveWarning, '', copy.emailClosing);
  return lines.join('\n');
}

export function canonicalizeAiIntakeFields(fields: AiIntakeFields): AiIntakeFields {
  return {
    name: normalizeCanonicalText(fields.name),
    email: normalizeCanonicalText(fields.email),
    summary: normalizeCanonicalText(fields.summary),
    locale: fields.locale,
    category: fields.category,
    phoneOrMessenger: emptyToUndefined(fields.phoneOrMessenger),
    urgency: emptyToUndefined(fields.urgency),
    preferredContact: emptyToUndefined(fields.preferredContact),
    companyOrOrganization: emptyToUndefined(fields.companyOrOrganization),
    countryOrResidence: emptyToUndefined(fields.countryOrResidence),
    preferredTime: emptyToUndefined(fields.preferredTime),
    documentsAvailable: emptyToUndefined(fields.documentsAvailable),
  };
}

export function buildCanonicalAiIntakeEmail(
  fields: AiIntakeFields,
  intakeId: string,
): CanonicalAiIntakeEmail {
  const canonicalFields = canonicalizeAiIntakeFields(fields);
  const subject = buildSubject(canonicalFields, intakeId);
  const body = buildBody(canonicalFields, intakeId);
  return {
    intakeId,
    subject,
    body,
    digest: digestCanonicalEmail(subject, body),
    locale: canonicalFields.locale,
    replyTo: canonicalFields.email,
  };
}
