import { describe, expect, it } from 'vitest';

import { contactPageContent } from '@/data/contact-page-content';

describe('Japanese contact page content', () => {
  const japanese = contactPageContent.ja;
  const korean = contactPageContent.ko;
  const traditionalChinese = contactPageContent['zh-hant'];
  const english = contactPageContent.en;

  it('uses concise Japanese labels without Korean or English fallback labels', () => {
    expect(japanese.messenger.primary.label).toBe('LINEで相談');
    expect(japanese.messenger.secondary.label).toBe('KakaoTalkチャンネルで相談');
    expect(japanese.direct.email.label).toBe('メール');
    expect(japanese.direct.phone.label).toBe('電話');

    const labels = [
      japanese.messenger.primary.label,
      japanese.messenger.secondary.label,
      japanese.direct.email.label,
      japanese.direct.phone.label,
    ];

    expect(labels.every((label) => label.length > 0)).toBe(true);
    expect(labels.join(' ')).not.toMatch(/[가-힣]/);
    expect(labels).not.toContain('Email');
    expect(labels).not.toContain('Phone');
    expect(labels).not.toContain('LINE channel chat');
    expect(labels).not.toContain('KakaoTalk channel');
  });

  it('preserves every canonical channel value and link', () => {
    for (const localeContent of [korean, traditionalChinese, english]) {
      expect(japanese.messenger.primary).toMatchObject({
        href: localeContent.messenger.primary.href,
        platform: localeContent.messenger.primary.platform,
      });
      expect(japanese.messenger.secondary).toMatchObject({
        href: localeContent.messenger.secondary.href,
        platform: localeContent.messenger.secondary.platform,
      });
      expect(japanese.direct.email).toMatchObject({
        value: localeContent.direct.email.value,
        href: localeContent.direct.email.href,
      });
      expect(japanese.direct.phone).toMatchObject({
        value: localeContent.direct.phone.value,
        href: localeContent.direct.phone.href,
      });
      expect(japanese.offices).toEqual(localeContent.offices);
    }
  });

  it('keeps the existing locale labels and representative values unchanged', () => {
    expect(korean.messenger.primary.label).toBe('LINE 채널 문의');
    expect(korean.messenger.secondary.label).toBe('카카오톡 채널 상담');
    expect(korean.direct.email).toEqual({
      label: '이메일',
      value: 'wei@hoveringlaw.com.tw',
      href: 'mailto:wei@hoveringlaw.com.tw',
    });
    expect(korean.direct.phone).toEqual({
      label: '전화',
      value: '+82-10-2992-9304',
      href: 'tel:+821029929304',
    });

    expect(traditionalChinese.messenger.primary.label).toBe('LINE 頻道諮詢');
    expect(traditionalChinese.messenger.secondary.label).toBe('KakaoTalk 頻道諮詢');
    expect(traditionalChinese.direct.email.label).toBe('電子郵件');
    expect(traditionalChinese.direct.phone.label).toBe('電話');

    expect(english.messenger.primary.label).toBe('LINE channel chat');
    expect(english.messenger.secondary.label).toBe('KakaoTalk channel');
    expect(english.direct.email.label).toBe('Email');
    expect(english.direct.phone.label).toBe('Phone');
  });
});
