import { describe, expect, it } from 'vitest';
import { validPreviewBody } from '@/lib/ai-intake/__tests__/helpers';
import { mcpPassThroughInputSchema } from '../pass-through-schema';
import { aiIntakeMcpPreviewInputSchema, aiIntakeMcpSubmitInputSchema } from '../schemas';

const MARKER = 'ATTACKER_PII_KEY_9001011234567';

describe('mcpPassThroughInputSchema', () => {
  it('advertises the strict Zod JSON Schema and passes opaque values through', async () => {
    const wrapped = mcpPassThroughInputSchema(aiIntakeMcpPreviewInputSchema);
    const json = wrapped['~standard'].jsonSchema.input({ target: 'draft-2020-12' });
    expect(json.type).toBe('object');
    expect(json.additionalProperties).toBe(false);
    expect(json.required).toEqual(
      expect.arrayContaining(['name', 'email', 'summary', 'locale', 'idempotencyKey']),
    );

    const hostile = { ...validPreviewBody(), [MARKER]: '4111111111111111' };
    const result = await wrapped['~standard'].validate(hostile);
    expect(result.issues).toBeUndefined();
    expect(result).toEqual({ value: hostile });
    expect(JSON.stringify(result)).toContain(MARKER);

    const advertised = JSON.stringify(json);
    expect(advertised).not.toContain(MARKER);
    expect(advertised).toContain('"additionalProperties":false');
  });

  it('advertises shared external userApprovedExactPreview on submit without SDK-validating it', async () => {
    const wrapped = mcpPassThroughInputSchema(aiIntakeMcpSubmitInputSchema);
    const json = wrapped['~standard'].jsonSchema.input({ target: 'draft-2020-12' });
    expect(json.properties).toMatchObject({
      userApprovedExactPreview: { const: true },
      privacyConsent: { const: true },
    });
    const result = await wrapped['~standard'].validate({
      ...validPreviewBody(),
      privacyConsent: 'true',
      userApprovedExactPreview: false,
      [MARKER]: true,
    });
    expect(result.issues).toBeUndefined();
  });
});
