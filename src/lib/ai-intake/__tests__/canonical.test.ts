import { describe, expect, it } from 'vitest';
import {
  AI_INTAKE_CANONICAL_SEPARATOR,
  AI_INTAKE_CANONICAL_VERSION,
} from '@/lib/ai-intake/constants';
import {
  buildCanonicalAiIntakeEmail,
  digestCanonicalEmail,
  generateAiIntakeId,
  serializeCanonicalEmail,
} from '@/lib/ai-intake/canonical';
import { getAiIntakeCopy } from '@/lib/ai-intake/copy';
import { fullCanonicalFields } from '@/lib/ai-intake/__tests__/helpers';
import type { AiIntakeFields } from '@/lib/ai-intake/schemas';
import { siteLocales } from '@/lib/locales';
import canonicalKo from '@/lib/ai-intake/__tests__/fixtures/canonical-ko.json';
import canonicalZh from '@/lib/ai-intake/__tests__/fixtures/canonical-zh-hant.json';
import canonicalEn from '@/lib/ai-intake/__tests__/fixtures/canonical-en.json';
import canonicalJa from '@/lib/ai-intake/__tests__/fixtures/canonical-ja.json';

const INTAKE_ID = 'HC-TEST0001';

const GOLDEN = {
  ko: canonicalKo,
  'zh-hant': canonicalZh,
  en: canonicalEn,
  ja: canonicalJa,
} as const;

function base(locale: AiIntakeFields['locale']): AiIntakeFields {
  return {
    name: 'Jane Doe',
    email: 'jane@example.test',
    summary: 'Short company-setup facts and a 2024 timeline.',
    locale,
    category: 'company_setup',
    companyOrOrganization: 'Example Co',
    countryOrResidence: 'Japan',
    documentsAvailable: 'contract types only',
  };
}

describe('ai intake canonical email', () => {
  it('documents the digest serialization as version + LF + subject + LF + body', () => {
    const canonical = buildCanonicalAiIntakeEmail(base('en'), INTAKE_ID);
    expect(serializeCanonicalEmail(canonical.subject, canonical.body)).toBe(
      `${AI_INTAKE_CANONICAL_VERSION}${AI_INTAKE_CANONICAL_SEPARATOR}${canonical.subject}${AI_INTAKE_CANONICAL_SEPARATOR}${canonical.body}`,
    );
    expect(canonical.digest).toBe(digestCanonicalEmail(canonical.subject, canonical.body));
    expect(canonical.digest).toMatch(/^[a-f0-9]{64}$/);
    expect(canonical.subject).toContain(INTAKE_ID);
    expect(canonical.body).toContain(INTAKE_ID);
    expect(canonical.subject).not.toMatch(/[\r\n]/);
  });

  it('matches exact golden subject and body for all four locales with every optional field', () => {
    for (const locale of siteLocales) {
      const canonical = buildCanonicalAiIntakeEmail(fullCanonicalFields(locale), INTAKE_ID);
      expect(canonical.subject).toBe(GOLDEN[locale].subject);
      expect(canonical.body).toBe(GOLDEN[locale].body);
    }
    expect(GOLDEN.ja.body).not.toBe(GOLDEN.ko.body);
    expect(GOLDEN.ja.subject).not.toBe(GOLDEN.ko.subject);
  });

  it('changes when an optional field is omitted and ignores request key order', () => {
    const full = buildCanonicalAiIntakeEmail(fullCanonicalFields('en'), INTAKE_ID);
    const omitted = buildCanonicalAiIntakeEmail({
      ...fullCanonicalFields('en'),
      phoneOrMessenger: undefined,
      urgency: undefined,
    }, INTAKE_ID);
    expect(omitted.body).not.toBe(full.body);
    expect(omitted.body).toContain(getAiIntakeCopy('en').notProvided);

    const reordered = buildCanonicalAiIntakeEmail({
      documentsAvailable: 'contract types only',
      preferredTime: 'morning Taipei time',
      preferredContact: 'email',
      urgency: 'this month',
      phoneOrMessenger: '+886 912 345 678',
      countryOrResidence: 'Japan',
      companyOrOrganization: 'Example Co',
      category: 'company_setup',
      summary: 'Short company-setup facts and a 2024 timeline. Related party names only: Acme Ltd.',
      email: 'jane@example.test',
      name: 'Jane Doe',
      locale: 'en',
    }, INTAKE_ID);
    expect(reordered.body).toBe(full.body);
    expect(reordered.subject).toBe(full.subject);
  });

  it('NFC-normalizes, converts CRLF to LF, and keeps field order stable', () => {
    const canonical = buildCanonicalAiIntakeEmail({
      ...base('en'),
      name: 'Cafe\u0301 User\r\n',
      summary: 'line1\r\nline2\rline3',
    }, INTAKE_ID);
    expect(canonical.body).toContain('Café User');
    expect(canonical.body).not.toContain('\r');
    expect(canonical.body).toContain('line1\nline2\nline3');
    const nameIndex = canonical.body.indexOf('Name:');
    const summaryIndex = canonical.body.indexOf('Matter or business summary:');
    expect(nameIndex).toBeGreaterThan(-1);
    expect(summaryIndex).toBeGreaterThan(nameIndex);
  });

  it('derives a safe uppercase intake id from a UUID', () => {
    expect(generateAiIntakeId('aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee')).toBe('HC-AAAAAAAA');
  });
});
