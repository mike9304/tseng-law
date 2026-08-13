import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  sendMail: vi.fn(async () => ({ messageId: 'test-message-id' })),
  createTransport: vi.fn(),
}));

vi.mock('nodemailer', () => ({
  default: {
    createTransport: mocks.createTransport,
  },
}));

describe('sendConsultationEmail', () => {
  beforeEach(() => {
    vi.resetModules();
    mocks.sendMail.mockClear();
    mocks.createTransport.mockReset();
    mocks.createTransport.mockReturnValue({ sendMail: mocks.sendMail });
    vi.stubEnv('SMTP_HOST', 'smtp.example.test');
    vi.stubEnv('SMTP_PORT', '587');
    vi.stubEnv('SMTP_USER', 'smtp-account@example.test');
    vi.stubEnv('SMTP_PASS', 'test-only-password');
    vi.stubEnv('CONSULTATION_NOTIFY_EMAIL', 'lawyer@example.test');
    vi.stubEnv('NOTIFY_EMAIL', 'ignored@example.test');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('uses only server-owned sender and recipient while replying to a valid user email', async () => {
    const { sendConsultationEmail } = await import('../send-consultation-email');
    await sendConsultationEmail(payload('client@example.test'));

    expect(mocks.sendMail).toHaveBeenCalledWith(expect.objectContaining({
      from: '"호정 AI Intake" <smtp-account@example.test>',
      to: 'lawyer@example.test',
      replyTo: 'client@example.test',
    }));
  });

  it('rejects a CRLF-injected Reply-To value and falls back to the official email', async () => {
    const { sendConsultationEmail } = await import('../send-consultation-email');
    await sendConsultationEmail(payload('client@example.test\r\nBcc: attacker@example.test'));

    expect(mocks.sendMail).toHaveBeenCalledWith(expect.objectContaining({
      to: 'lawyer@example.test',
      replyTo: 'lawyer@example.test',
    }));
  });
});

function payload(email: string) {
  return {
    locale: 'ko' as const,
    sessionId: 'session-123',
    collectedFields: {
      name: 'Client',
      email,
      summary: 'Need legal advice.',
      consent: true,
    },
    transcript: [],
    classification: 'general' as const,
    riskLevel: 'L2' as const,
    referencedColumns: [],
  };
}
