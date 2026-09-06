import { describe, expect, it } from 'vitest';
import { siteLocales } from '@/lib/locales';
import { buildRequirementsPayload, getAiIntakeCopy } from '@/lib/ai-intake/copy';
import { AI_INTAKE_REQUIREMENTS_VERSION } from '@/lib/ai-intake/constants';
import { aiIntakeRequirementsResponseSchema } from '@/lib/ai-intake/schemas';
import requirementsKo from '@/lib/ai-intake/__tests__/fixtures/requirements-ko.json';
import requirementsZh from '@/lib/ai-intake/__tests__/fixtures/requirements-zh-hant.json';
import requirementsEn from '@/lib/ai-intake/__tests__/fixtures/requirements-en.json';
import requirementsJa from '@/lib/ai-intake/__tests__/fixtures/requirements-ja.json';

const GOLDEN = {
  ko: requirementsKo,
  'zh-hant': requirementsZh,
  en: requirementsEn,
  ja: requirementsJa,
} as const;

describe('ai intake requirements copy', () => {
  it('returns four first-class locales including Japanese', () => {
    for (const locale of siteLocales) {
      const payload = buildRequirementsPayload(locale, 'labor');
      expect(payload.requirementsVersion).toBe(AI_INTAKE_REQUIREMENTS_VERSION);
      expect(payload.locale).toBe(locale);
      expect(payload.categories).toHaveLength(9);
      expect(payload.questions.length).toBeGreaterThanOrEqual(10);
      expect(payload.notices.emergency).not.toMatch(/\d{3}/);
      expect(payload.notices.noRepresentation.toLowerCase()).not.toContain('attorney-client relationship is established');
      expect(payload.privacyUrl).toContain(`/${locale}/privacy`);
      expect(payload.confirmationInstruction).toContain('/api/ai/intake/submit');
      expect(payload.confirmationInstruction).toContain('userApprovedExactPreview=true');
      expect(payload.confirmationInstruction).toContain('privacyConsent=true');
      expect(aiIntakeRequirementsResponseSchema.safeParse(payload).success).toBe(true);
    }
    const ja = buildRequirementsPayload('ja');
    const ko = buildRequirementsPayload('ko');
    expect(ja.questions.join('\n')).not.toEqual(ko.questions.join('\n'));
    expect(ja.notices.aiLimit).toContain('法律助言');
    expect(ja.notices.aiLimit).not.toContain('법률 자문');
    expect(getAiIntakeCopy('ja').emailGreeting).toContain('弁護士');
  });

  it('matches exact requirements fixtures including field order, questions, notices, and URL', () => {
    for (const locale of siteLocales) {
      const payload = buildRequirementsPayload(locale, 'labor');
      expect(payload).toEqual(GOLDEN[locale]);
    }
  });

  it('is mutation-sensitive to omitted category questions and reordered required fields', () => {
    const withCategory = buildRequirementsPayload('en', 'labor');
    const withoutCategory = buildRequirementsPayload('en');
    expect(withoutCategory.questions).not.toEqual(withCategory.questions);
    expect(withCategory.questions.at(-1)).toContain('employment status');
    expect(withCategory.fields.required.map((field) => field.name)).toEqual([
      'name',
      'email',
      'summary',
      'locale',
      'idempotencyKey',
    ]);
    expect(withCategory.fields.optional.map((field) => field.name)).toEqual([
      'category',
      'phoneOrMessenger',
      'urgency',
      'preferredContact',
      'companyOrOrganization',
      'countryOrResidence',
      'preferredTime',
      'documentsAvailable',
      'confirmationToken',
      'privacyConsent',
      'userApprovedExactPreview',
    ]);
    for (const locale of siteLocales) {
      expect(buildRequirementsPayload(locale, 'labor').questions.join('\n')).toMatch(/summary/i);
      expect(buildRequirementsPayload(locale, 'labor').questions.join('\n')).not.toMatch(/identity numbers are required/i);
    }
  });
});
