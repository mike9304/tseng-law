import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { previewAiIntake } from '@/lib/ai-intake/preview';
import { resetAiIntakeClaimStoreForTests } from '@/lib/ai-intake/store';
import { stubAiIntakeTestEnv, TEST_AI_INTAKE_CLIENT_ID, validPreviewBody } from '@/lib/ai-intake/__tests__/helpers';
import { sendPreparedAiIntakeEmail } from '@/lib/email/send-consultation-email';
import { getAiIntakeClaimStore } from '@/lib/ai-intake/store';
import { aiIntakePreviewRequestSchema } from '@/lib/ai-intake/schemas';

vi.mock('@/lib/email/send-consultation-email', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/email/send-consultation-email')>();
  return {
    ...actual,
    sendPreparedAiIntakeEmail: vi.fn(actual.sendPreparedAiIntakeEmail),
  };
});

describe('previewAiIntake', () => {
  beforeEach(() => {
    stubAiIntakeTestEnv();
    vi.mocked(sendPreparedAiIntakeEmail).mockClear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    resetAiIntakeClaimStoreForTests();
  });

  it('returns exact subject/body/digest and never sends mail or writes a claim', async () => {
    const request = aiIntakePreviewRequestSchema.parse(validPreviewBody());
    const result = previewAiIntake({ request, clientId: TEST_AI_INTAKE_CLIENT_ID });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.response.subject).toContain(result.response.intakeId);
    expect(result.response.body).toContain(result.response.intakeId);
    expect(result.response.confirmationToken.includes('.')).toBe(true);
    expect(sendPreparedAiIntakeEmail).not.toHaveBeenCalled();
    expect(getAiIntakeClaimStore() ? await getAiIntakeClaimStore()!.claim({
      clientId: TEST_AI_INTAKE_CLIENT_ID,
      idempotencyKey: request.idempotencyKey,
      intakeId: result.response.intakeId,
      digest: result.response.digest,
    }) : null).toMatchObject({ type: 'acquired' });
  });

  it('rejects sensitive data with kinds only', () => {
    const request = aiIntakePreviewRequestSchema.parse(validPreviewBody({
      summary: 'My card is 4111111111111111',
    }));
    const result = previewAiIntake({ request, clientId: TEST_AI_INTAKE_CLIENT_ID });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.status).toBe(422);
    expect(result.code).toBe('SENSITIVE_DATA_REJECTED');
    expect(JSON.stringify(result)).not.toContain('4111111111111111');
    expect(sendPreparedAiIntakeEmail).not.toHaveBeenCalled();
  });
});
