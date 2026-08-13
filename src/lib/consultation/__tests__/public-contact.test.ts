import { describe, expect, it } from 'vitest';
import {
  CONSULTATION_EMAIL,
  LAWYER_NAME_KO,
  LAWYER_NAME_ZH,
  getConsultationCtaLabel,
  getConsultationEmailTemplate,
  getConsultationPublicMailto,
  getEmailCopiedMessage,
  getSensitiveInformationWarning,
} from '@/lib/consultation/public-contact';
import { siteLocales } from '@/lib/locales';

describe('public consultation contact single source of truth', () => {
  it('keeps the verified attorney identity and recipient in one public module', () => {
    expect(CONSULTATION_EMAIL).toBe('wei@hoveringlaw.com.tw');
    expect(LAWYER_NAME_KO).toBe('증준외 대만 변호사');
    expect(LAWYER_NAME_ZH).toBe('曾雋崴律師');
  });

  it('builds locale-specific mailto links with encoded subject and body', () => {
    for (const locale of siteLocales) {
      const template = getConsultationEmailTemplate(locale);
      const href = getConsultationPublicMailto(locale);

      expect(href).toBe(
        `mailto:${CONSULTATION_EMAIL}?subject=${encodeURIComponent(template.subject)}&body=${encodeURIComponent(template.body)}`,
      );
      expect(decodeURIComponent(href)).not.toMatch(/[\r\n](?:to|cc|bcc|from):/i);
    }

    expect(getConsultationEmailTemplate('ko')).toEqual({
      subject: '[tseng-law.com 상담문의] 대만 법률 및 기업 업무 상담',
      body: expect.stringContaining('안녕하세요, 증준외 대만 변호사님.'),
    });
    expect(getConsultationEmailTemplate('zh-hant')).toEqual({
      subject: '【tseng-law.com 法律諮詢】台灣法律及企業服務諮詢',
      body: expect.stringContaining('曾雋崴律師您好：'),
    });
    expect(getConsultationEmailTemplate('en')).toEqual({
      subject: '[tseng-law.com Consultation] Taiwan Legal and Corporate Services',
      body: expect.stringContaining('Dear Attorney Tseng,'),
    });
  });

  it('provides localized CTA, copy confirmation, and sensitive-data warning text', () => {
    expect(getConsultationCtaLabel('ko')).toBe('증준외 대만 변호사에게 이메일 상담');
    expect(getConsultationCtaLabel('zh-hant')).toBe('寄信諮詢曾雋崴律師');
    expect(getConsultationCtaLabel('en')).toBe('Email Attorney Tseng for Consultation');
    expect(getEmailCopiedMessage('ko')).toBe('이메일 주소가 복사되었습니다.');
    expect(getEmailCopiedMessage('zh-hant')).toBe('電子郵件地址已複製。');
    expect(getEmailCopiedMessage('en')).toBe('Email address copied.');

    for (const locale of siteLocales) {
      const warning = getSensitiveInformationWarning(locale);
      expect(warning.length).toBeGreaterThan(70);
    }
  });
});
