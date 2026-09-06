import { describe, expect, it } from 'vitest';
import {
  aiIntakeExternalSubmitRequestSchema,
  aiIntakePreviewRequestSchema,
  aiIntakeRequirementsResponseSchema,
  aiIntakeSubmitRequestSchema,
  classifyAiIntakeExternalSubmitAttestation,
  parseAiIntakeRequirementsQuery,
  sanitizeZodIssues,
  stripAiIntakeExternalSubmitRequest,
} from '@/lib/ai-intake/schemas';
import { buildRequirementsPayload } from '@/lib/ai-intake/copy';
import { validPreviewBody } from '@/lib/ai-intake/__tests__/helpers';

describe('ai intake schemas', () => {
  it('accepts a bounded preview body and trims fields', () => {
    const parsed = aiIntakePreviewRequestSchema.parse({
      ...validPreviewBody(),
      name: '  Jane Doe  ',
      phoneOrMessenger: '  ',
    });
    expect(parsed.name).toBe('Jane Doe');
    expect(parsed.phoneOrMessenger).toBe('');
  });

  it('rejects unknown keys including transcript, attachments, and userConfirmed', () => {
    for (const extra of [
      { transcript: [] },
      { attachments: [] },
      { recipient: 'wei@hoveringlaw.com.tw' },
      { from: 'attacker@example.test' },
      { subject: 'spoof' },
      { userConfirmed: true },
      { priorTurns: [] },
      { referencedColumns: [] },
    ]) {
      const result = aiIntakePreviewRequestSchema.safeParse({ ...validPreviewBody(), ...extra });
      expect(result.success).toBe(false);
      if (!result.success) {
        const fields = sanitizeZodIssues(result.error);
        expect(fields.some((field) => field.reason === 'unexpected_field' && field.name === 'body')).toBe(true);
        expect(JSON.stringify(fields)).not.toContain('transcript');
        expect(JSON.stringify(fields)).not.toContain('attacker');
        expect(JSON.stringify(fields)).not.toContain('spoof');
      }
    }
  });

  it('enforces required bounds and a UUID idempotency key', () => {
    expect(aiIntakePreviewRequestSchema.safeParse(validPreviewBody({ name: '' })).success).toBe(false);
    expect(aiIntakePreviewRequestSchema.safeParse(validPreviewBody({ summary: 'x'.repeat(4001) })).success).toBe(false);
    expect(aiIntakePreviewRequestSchema.safeParse(validPreviewBody({ email: 'not-an-email' })).success).toBe(false);
    expect(aiIntakePreviewRequestSchema.safeParse(validPreviewBody({ idempotencyKey: 'not-a-uuid' })).success).toBe(false);
    expect(aiIntakePreviewRequestSchema.safeParse(validPreviewBody({ locale: 'fr' })).success).toBe(false);
  });

  it('requires privacyConsent true on submit and no meaningless confirmation boolean', () => {
    const token = `${'a'.repeat(40)}.${'b'.repeat(40)}`;
    expect(aiIntakeSubmitRequestSchema.safeParse({
      ...validPreviewBody(),
      confirmationToken: token,
      privacyConsent: true,
    }).success).toBe(true);
    expect(aiIntakeSubmitRequestSchema.safeParse({
      ...validPreviewBody(),
      confirmationToken: token,
    }).success).toBe(false);
    expect(aiIntakeSubmitRequestSchema.safeParse({
      ...validPreviewBody(),
      confirmationToken: token,
      privacyConsent: false,
    }).success).toBe(false);
    expect(aiIntakeSubmitRequestSchema.safeParse({
      ...validPreviewBody(),
      confirmationToken: token,
      privacyConsent: true,
      userConfirmed: true,
    }).success).toBe(false);
    expect(aiIntakeSubmitRequestSchema.safeParse({
      ...validPreviewBody(),
      confirmationToken: token,
      privacyConsent: true,
      userApprovedExactPreview: true,
    }).success).toBe(false);
  });

  it('requires a literal external approval attestation and strips it before core submit', () => {
    const token = `${'a'.repeat(40)}.${'b'.repeat(40)}`;
    const core = {
      ...validPreviewBody(),
      confirmationToken: token,
      privacyConsent: true as const,
    };
    const approved = { ...core, userApprovedExactPreview: true as const };
    expect(aiIntakeExternalSubmitRequestSchema.safeParse(approved).success).toBe(true);
    expect(aiIntakeExternalSubmitRequestSchema.safeParse(core).success).toBe(false);
    for (const userApprovedExactPreview of [false, 'true', 1, null] as const) {
      expect(aiIntakeExternalSubmitRequestSchema.safeParse({
        ...core,
        userApprovedExactPreview,
      }).success).toBe(false);
    }

    const parsed = aiIntakeExternalSubmitRequestSchema.parse(approved);
    const stripped = stripAiIntakeExternalSubmitRequest(parsed);
    expect(stripped).not.toHaveProperty('userApprovedExactPreview');
    expect(stripped.privacyConsent).toBe(true);
    expect(aiIntakeSubmitRequestSchema.safeParse(stripped).success).toBe(true);

    expect(classifyAiIntakeExternalSubmitAttestation({
      ...core,
      userApprovedExactPreview: true,
      privacyConsent: false,
    })).toBe('CONSENT_REQUIRED');
    expect(classifyAiIntakeExternalSubmitAttestation({
      ...core,
      userApprovedExactPreview: false,
    })).toBe('APPROVAL_REQUIRED');
    expect(classifyAiIntakeExternalSubmitAttestation(core)).toBe('APPROVAL_REQUIRED');
    expect(classifyAiIntakeExternalSubmitAttestation({
      ...core,
      userApprovedExactPreview: true,
    })).toBeNull();
    expect(classifyAiIntakeExternalSubmitAttestation({
      privacyConsent: 'true',
      userApprovedExactPreview: true,
    })).toBe('CONSENT_REQUIRED');
    expect(classifyAiIntakeExternalSubmitAttestation({
      privacyConsent: true,
      userApprovedExactPreview: 'true',
    })).toBe('APPROVAL_REQUIRED');
    expect(classifyAiIntakeExternalSubmitAttestation({
      privacyConsent: 1,
      userApprovedExactPreview: 1,
    })).toBe('CONSENT_REQUIRED');
    expect(classifyAiIntakeExternalSubmitAttestation(null)).toBe('CONSENT_REQUIRED');
  });

  it('never reflects an unknown JSON key such as a card-shaped attacker key', () => {
    const result = aiIntakePreviewRequestSchema.safeParse({
      ...validPreviewBody(),
      x4111111111111111: '4111111111111111',
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    const fields = sanitizeZodIssues(result.error);
    const serialized = JSON.stringify(fields);
    expect(serialized).not.toContain('x4111111111111111');
    expect(serialized).not.toContain('4111111111111111');
    expect(fields).toEqual([{ name: 'body', reason: 'unexpected_field' }]);
  });

  it('parses original URLSearchParams strictly for requirements', () => {
    expect(parseAiIntakeRequirementsQuery(new URLSearchParams('locale=en')).ok).toBe(true);
    expect(parseAiIntakeRequirementsQuery(new URLSearchParams('locale=en&category=labor')).ok).toBe(true);
    expect(parseAiIntakeRequirementsQuery(new URLSearchParams('locale=en&locale=ko')).ok).toBe(false);
    expect(parseAiIntakeRequirementsQuery(new URLSearchParams('locale=en&category=')).ok).toBe(false);
    expect(parseAiIntakeRequirementsQuery(new URLSearchParams('locale=en&category=labor&category=general')).ok).toBe(false);
    expect(parseAiIntakeRequirementsQuery(new URLSearchParams('category=labor')).ok).toBe(false);
    const unknown = parseAiIntakeRequirementsQuery(new URLSearchParams('locale=en&x4111111111111111=1'));
    expect(unknown.ok).toBe(false);
    expect(JSON.stringify(unknown)).not.toContain('x4111111111111111');
  });

  it('validates the built requirements payload against the strict nested schema', () => {
    const payload = buildRequirementsPayload('en', 'labor');
    const parsed = aiIntakeRequirementsResponseSchema.safeParse(payload);
    expect(parsed.success).toBe(true);
    expect(aiIntakeRequirementsResponseSchema.safeParse({
      ...payload,
      privacyUrl: 'https://evil-user:leak-pass@hostile.example/en/privacy?q=1#f',
    }).success).toBe(false);
    for (const privacyUrl of [
      'https://2130706433/en/privacy',
      'https://0177.0.0.1/en/privacy',
      'https://0x7f000001/en/privacy',
      'https://127.1/en/privacy',
      'https://01.02.03.004/en/privacy',
      'https://example.test\\en/privacy',
      ' https://example.test/en/privacy',
      'https://exa%6dple.test/en/privacy',
      'https://%31%32%37.0.0.1/en/privacy',
      'https:/example.test/en/privacy',
      'http:/example.test/en/privacy',
      'https:///example.test/en/privacy',
      'https:example.test/en/privacy',
      'https://example.test:/en/privacy',
      'https://example.test:443/en/privacy',
      'https://example.test:0443/en/privacy',
    ]) {
      expect(aiIntakeRequirementsResponseSchema.safeParse({
        ...payload,
        privacyUrl,
      }).success, privacyUrl).toBe(false);
    }
  });
});
