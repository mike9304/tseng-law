import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { InternationalInquiryRecord } from '@/lib/consultation/international-inquiry-store';

type SmtpTestMessage = {
  from?: string;
  to?: string;
  replyTo?: string;
  subject?: string;
  text?: string;
  html?: string;
};

type SmtpTestResult = {
  messageId?: string;
  accepted?: string[];
  rejected?: string[];
};

const mocks = vi.hoisted(() => ({
  sendMail: vi.fn<(message: SmtpTestMessage) => Promise<SmtpTestResult>>(async () => ({
    messageId: 'intl-message-id',
    accepted: ['lawyer@example.test'],
    rejected: [],
  })),
  createTransport: vi.fn(),
}));

vi.mock('nodemailer', () => ({
  default: {
    createTransport: mocks.createTransport,
  },
}));

function inquiryRecord(partial: {
  name?: string;
  email?: string;
  uiLocale?: InternationalInquiryRecord['payload']['uiLocale'];
  originalLanguage?: string;
  preferredConsultationLanguage?: InternationalInquiryRecord['payload']['preferredConsultationLanguage'];
  originalText?: string;
  intakeId?: string;
  receivedAt?: string;
} = {}): InternationalInquiryRecord {
  return {
    schemaVersion: 1,
    intakeId: partial.intakeId ?? '5b7a6d2e-3c1f-4a8b-9d0e-1f2a3b4c5d6e',
    receivedAt: partial.receivedAt ?? '2026-09-08T04:00:00.000Z',
    payload: {
      requestId: '7c8d9e0f-1a2b-4c3d-8e9f-0a1b2c3d4e5f',
      name: partial.name ?? 'Ada <script>alert(1)</script>',
      email: partial.email ?? 'ada@example.test',
      uiLocale: partial.uiLocale ?? 'ja',
      originalLanguage: partial.originalLanguage ?? 'vi',
      preferredConsultationLanguage: partial.preferredConsultationLanguage ?? 'needs-method-confirmation',
      originalText: partial.originalText ?? 'Hello',
      consent: true,
    },
    payloadSha256: 'ab'.repeat(32),
  };
}

describe('sendInternationalInquiryNotification', () => {
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

  it('preserves 10000-character raw text and newlines, escapes HTML, and uses operator labels and safe headers', async () => {
    const prefix = '<script>alert(1)</script>\nLine 2\n';
    const originalText = `${prefix}${'x'.repeat(10_000 - prefix.length)}`;
    expect(originalText).toHaveLength(10_000);
    const record = inquiryRecord({ originalText });
    const { sendInternationalInquiryNotification } = await import('../send-consultation-email');
    await sendInternationalInquiryNotification(record);

    expect(mocks.sendMail).toHaveBeenCalledTimes(1);
    const mail = mocks.sendMail.mock.calls[0]?.[0];
    if (mail === undefined) {
      throw new Error('expected sendMail to receive a message');
    }
    expect(mail.from).toBe('"Hovering International Inquiry" <smtp-account@example.test>');
    expect(mail.to).toBe('lawyer@example.test');
    expect(mail.replyTo).toBe('ada@example.test');
    expect(mail.subject).toBe(`[Hovering international inquiry] ${record.intakeId}`);
    expect(mail.subject).not.toContain(originalText);
    expect(mail.subject).not.toContain(record.payload.name);
    expect(mail.subject).not.toMatch(/[\r\n]/);

    const text = String(mail.text ?? '');
    expect(text.endsWith(originalText)).toBe(true);
    expect(text).toContain(`Intake ID: ${record.intakeId}`);
    expect(text).toContain(`Received at: ${record.receivedAt}`);
    expect(text).toContain(`Name: ${record.payload.name}`);
    expect(text).toContain(`Email: ${record.payload.email}`);
    expect(text).toContain('UI locale: ja');
    expect(text).toContain('Original language: vi');
    expect(text).toContain('Preferred consultation language: needs-method-confirmation');
    expect(text).toContain('Original text:');

    const html = String(mail.html ?? '');
    expect(html).toContain('white-space:pre-wrap');
    expect(html).toContain('Intake ID');
    expect(html).toContain('Received at');
    expect(html).toContain('Name');
    expect(html).toContain('Email');
    expect(html).toContain('UI locale');
    expect(html).toContain('Original language');
    expect(html).toContain('Preferred consultation language');
    expect(html).toContain('Original text');
    expect(html).toContain('ja');
    expect(html).toContain('vi');
    expect(html).toContain('needs-method-confirmation');
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(html).not.toContain('<script>alert(1)</script>');
    expect(html).toContain(record.intakeId);
    expect(html).toContain(record.receivedAt);
  });

  it('falls back to the official address when Reply-To is unsafe', async () => {
    const { sendInternationalInquiryNotification } = await import('../send-consultation-email');
    await sendInternationalInquiryNotification(inquiryRecord({
      email: 'ada@example.test\r\nBcc: attacker@example.test',
    }));
    expect(mocks.sendMail).toHaveBeenCalledWith(expect.objectContaining({
      to: 'lawyer@example.test',
      replyTo: 'lawyer@example.test',
    }));
  });

  it('makes one SMTP attempt and requires messageId', async () => {
    mocks.sendMail.mockRejectedValueOnce(new Error('timeout after DATA'));
    const { sendInternationalInquiryNotification } = await import('../send-consultation-email');
    await expect(sendInternationalInquiryNotification(inquiryRecord())).rejects.toThrow();
    expect(mocks.sendMail).toHaveBeenCalledTimes(1);

    mocks.sendMail.mockResolvedValueOnce({ accepted: ['lawyer@example.test'], rejected: [] });
    await expect(sendInternationalInquiryNotification(inquiryRecord())).rejects.toThrow();
  });

  it('rejects an explicit empty accepted list when all recipients were rejected', async () => {
    mocks.sendMail.mockResolvedValueOnce({
      messageId: 'intl-message-id',
      accepted: [],
      rejected: ['lawyer@example.test'],
    });
    const { sendInternationalInquiryNotification } = await import('../send-consultation-email');
    await expect(sendInternationalInquiryNotification(inquiryRecord())).rejects.toThrow();
    expect(mocks.sendMail).toHaveBeenCalledTimes(1);
  });

  it('throws a controlled error when SMTP is missing and does not send', async () => {
    vi.stubEnv('SMTP_USER', '');
    vi.stubEnv('SMTP_PASS', '');
    const {
      sendInternationalInquiryNotification,
      InternationalInquiryMailConfigError,
    } = await import('../send-consultation-email');
    await expect(sendInternationalInquiryNotification(inquiryRecord())).rejects.toBeInstanceOf(
      InternationalInquiryMailConfigError,
    );
    expect(mocks.sendMail).not.toHaveBeenCalled();
  });
});
