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

  it('sends prepared AI intake mail with the exact preview subject and text and escaped HTML only', async () => {
    const { sendPreparedAiIntakeEmail } = await import('../send-consultation-email');
    const subject = '[tseng-law.com AI Intake HC-TEST0001] General Inquiry / English';
    const textBody = 'Dear Attorney Tseng,\n\nHello <script>alert(1)</script>\n';
    await sendPreparedAiIntakeEmail({
      intakeId: 'HC-TEST0001',
      subject,
      textBody,
      replyTo: 'client@example.test',
    });

    expect(mocks.sendMail).toHaveBeenCalledWith(expect.objectContaining({
      from: '"호정 AI Intake" <smtp-account@example.test>',
      to: 'lawyer@example.test',
      replyTo: 'client@example.test',
      subject,
      text: textBody,
    }));
    expect(mocks.sendMail).toHaveBeenCalledWith(expect.objectContaining({
      html: expect.stringContaining('Hello &lt;script&gt;alert(1)&lt;/script&gt;'),
    }));
    const firstCall = mocks.sendMail.mock.calls.at(0)?.at(0) as { html?: string } | undefined;
    const html = String(firstCall?.html ?? '');
    expect(html).not.toContain('<script>alert(1)</script>');
    expect(html).not.toContain('session-123');
    expect(mocks.sendMail).toHaveBeenCalledTimes(1);
  });

  it('makes one SMTP attempt for prepared AI intake mail even on ambiguous failure', async () => {
    mocks.sendMail.mockRejectedValueOnce(new Error('timeout after DATA'));
    const { sendPreparedAiIntakeEmail } = await import('../send-consultation-email');
    await expect(sendPreparedAiIntakeEmail({
      intakeId: 'HC-TEST0001',
      subject: '[tseng-law.com AI Intake HC-TEST0001] General Inquiry / English',
      textBody: 'Dear Attorney Tseng,\n\nHello',
      replyTo: 'client@example.test',
    })).rejects.toThrow();
    expect(mocks.sendMail).toHaveBeenCalledTimes(1);
  });

  it('still retries legacy consultation mail', async () => {
    mocks.sendMail
      .mockRejectedValueOnce(new Error('temporary'))
      .mockResolvedValueOnce({ messageId: 'retry-id' });
    const { sendConsultationEmail } = await import('../send-consultation-email');
    await sendConsultationEmail(payload('client@example.test'));
    expect(mocks.sendMail).toHaveBeenCalledTimes(2);
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
