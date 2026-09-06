import { describe, expect, it } from 'vitest';
import { scanAiIntakeFields } from '@/lib/ai-intake/sensitive';
import type { AiIntakeFields } from '@/lib/ai-intake/schemas';

const USER_FIELDS = [
  'name',
  'email',
  'summary',
  'phoneOrMessenger',
  'urgency',
  'preferredContact',
  'companyOrOrganization',
  'countryOrResidence',
  'preferredTime',
  'documentsAvailable',
] as const;

function fields(summary: string, extra: Partial<AiIntakeFields> = {}): AiIntakeFields {
  return {
    name: 'Jane Doe',
    email: 'jane@example.test',
    summary,
    locale: 'en',
    ...extra,
  };
}

function kinds(summary: string, extra?: Partial<AiIntakeFields>) {
  return scanAiIntakeFields(fields(summary, extra)).findings.map((finding) => finding.kind);
}

const REJECT_SAMPLES: Array<{ kind: string; value: string }> = [
  { kind: 'payment_card', value: '4111111111111111' },
  { kind: 'iban', value: 'GB82 WEST 1234 5698 7654 32' },
  { kind: 'iban', value: 'GB82WEST12345698765432' },
  { kind: 'bank_account', value: 'bank account number 123456789012' },
  { kind: 'passport', value: 'passport number M12345678' },
  { kind: 'identity_number', value: 'identity number AB12345678' },
  { kind: 'kr_resident_registration', value: '900101-1234567' },
  { kind: 'tw_national_id', value: 'A123456789' },
];

describe('ai intake sensitive scanner', () => {
  it('rejects Korean RRN shape, Taiwan national ID, Luhn cards, IBAN, and labelled sequences', () => {
    expect(scanAiIntakeFields(fields('My number is 900101-1234567')).rejected).toBe(true);
    expect(kinds('My number is 900101-1234567')).toContain('kr_resident_registration');
    expect(scanAiIntakeFields(fields('ID A123456789 on file')).rejected).toBe(true);
    expect(kinds('ID A123456789 on file')).toContain('tw_national_id');
    expect(scanAiIntakeFields(fields('card 4111111111111111')).rejected).toBe(true);
    expect(kinds('card 4111111111111111')).toContain('payment_card');
    expect(scanAiIntakeFields(fields('iban GB82WEST12345698765432')).rejected).toBe(true);
    expect(kinds('iban GB82WEST12345698765432')).toContain('iban');
    expect(kinds('iban GB82 WEST 1234 5698 7654 32')).toContain('iban');
    expect(scanAiIntakeFields(fields('bank account number 123456789012')).rejected).toBe(true);
    expect(kinds('passport number M12345678')).toContain('passport');
    expect(scanAiIntakeFields(fields('identity number AB12345678')).rejected).toBe(true);
  });

  it('rejects header injection in contact-like fields without echoing the value', () => {
    const result = scanAiIntakeFields(fields('plain summary', {
      name: 'Jane\r\nBcc: attacker@example.test',
    }));
    expect(result.rejected).toBe(true);
    expect(result.findings.some((finding) => finding.kind === 'header_injection')).toBe(true);
    expect(JSON.stringify(result)).not.toContain('attacker');
    expect(JSON.stringify(result)).not.toContain('Bcc');
  });

  it('does not reject ordinary dates, case numbers, phones in the contact field, or innocent digits', () => {
    expect(scanAiIntakeFields(fields('Hearing on 2026-09-04, case 113-訴-123.')).rejected).toBe(false);
    expect(scanAiIntakeFields(fields('Need review next week.', {
      phoneOrMessenger: '+886 912 345 678',
    })).rejected).toBe(false);
    expect(scanAiIntakeFields(fields('We signed in 1990 and paid 12000 TWD.')).rejected).toBe(false);
    expect(kinds('card 4111111111111112')).not.toContain('payment_card');
    expect(scanAiIntakeFields(fields('passport number unavailable')).rejected).toBe(false);
    expect(scanAiIntakeFields(fields('identity number unknownvalue')).rejected).toBe(false);
  });

  it('does not treat a failed Luhn long number as both a card and an ambiguity credit', () => {
    const result = scanAiIntakeFields(fields('ref 4111111111111112'));
    const ambiguous = result.findings.find((finding) => finding.kind === 'long_number_ambiguous');
    expect(result.findings.some((finding) => finding.kind === 'payment_card')).toBe(false);
    expect(ambiguous?.count).toBe(1);
  });

  it('treats URLs as warnings and full-width Taiwan IDs as rejects', () => {
    const urls = scanAiIntakeFields(fields('See https://example.test/contract for types only.'));
    expect(urls.rejected).toBe(false);
    expect(urls.findings.some((finding) => finding.kind === 'url' && finding.severity === 'warning')).toBe(true);
    const fullWidth = scanAiIntakeFields(fields('ＩＤ　Ａ１２３４５６７８９'));
    expect(fullWidth.rejected).toBe(true);
    expect(fullWidth.findings.some((finding) => finding.kind === 'tw_national_id')).toBe(true);
    expect(JSON.stringify(fullWidth)).not.toContain('A123456789');
  });

  it.each(USER_FIELDS)('scans rejecting classes in %s without echoing values', (field) => {
    for (const sample of REJECT_SAMPLES) {
      const extra: Partial<AiIntakeFields> = field === 'summary'
        ? {}
        : { summary: 'Need a short review of a Taiwan company-setup timeline.' };
      (extra as Record<string, string>)[field] = sample.value;
      const result = scanAiIntakeFields(fields(field === 'summary' ? sample.value : extra.summary ?? '', extra));
      expect(result.rejected, `${field} ${sample.kind}`).toBe(true);
      expect(JSON.stringify(result)).not.toContain('4111111111111111');
      expect(JSON.stringify(result)).not.toContain('GB82');
      expect(JSON.stringify(result)).not.toContain('M12345678');
      expect(JSON.stringify(result)).not.toContain('AB12345678');
      expect(JSON.stringify(result)).not.toContain('900101-1234567');
    }
    const header = scanAiIntakeFields(fields('plain summary', {
      ...(field === 'summary' ? {} : { summary: 'plain summary' }),
      [field]: 'Jane\r\nBcc: attacker@example.test',
    } as Partial<AiIntakeFields>));
    if (field !== 'documentsAvailable' && field !== 'summary') {
      expect(header.findings.some((finding) => finding.kind === 'header_injection')).toBe(true);
    }
  });
});
