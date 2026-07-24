import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import MessengerChatSection from '@/components/MessengerChatSection';
import AiConsultationSection from '@/components/consultation/AiConsultationSection';
import { contactPageContent } from '@/data/contact-page-content';
import { siteLocales } from '@/lib/locales';

const verifiedMessengerHref = 'https://pf.kakao.com/_hojeong/chat';
const verifiedEmail = 'wei@hoveringlaw.com.tw';
const verifiedPhone = '+82-10-2992-9304';
const consultationSource = readFileSync(
  path.join(process.cwd(), 'src/components/consultation/AiConsultationSection.tsx'),
  'utf8',
);

function occurrences(value: string, fragment: string): number {
  return value.split(fragment).length - 1;
}

describe('verified public contact channels', () => {
  it('exposes one required primary messenger for every public locale', () => {
    for (const locale of siteLocales) {
      const content = contactPageContent[locale];

      expect(Object.keys(content.messenger)).toEqual(['primary']);
      expect(content.messenger.primary).toMatchObject({
        href: verifiedMessengerHref,
        platform: 'KakaoTalk',
      });
      expect(content.messenger.primary.label).not.toHaveLength(0);
      expect(content.direct.email).toMatchObject({
        value: verifiedEmail,
        href: `mailto:${verifiedEmail}`,
      });
      expect(content.direct.phone).toMatchObject({
        value: verifiedPhone,
        href: 'tel:+821029929304',
      });
      expect(content.offices.offices[0]?.phone).toBe(verifiedPhone);
    }
  });

  it('renders one verified messenger card and link', () => {
    const html = renderToStaticMarkup(createElement(MessengerChatSection, { locale: 'en' }));

    expect(occurrences(html, `href="${verifiedMessengerHref}"`)).toBe(1);
    expect(occurrences(html, 'KakaoTalk')).toBe(1);
    expect(occurrences(html, 'messenger-card messenger-card--')).toBe(1);
  });

  it('uses only the verified primary messenger in the consultation fallback', () => {
    const html = renderToStaticMarkup(createElement(AiConsultationSection, { locale: 'en' }));

    expect(consultationSource).not.toContain('messenger.secondary');
    expect(occurrences(html, `href="${verifiedMessengerHref}"`)).toBe(1);
    expect(html).toContain(`href="tel:${verifiedPhone.replace(/[^0-9+]/g, '')}"`);
    expect(html).toContain(`href="mailto:${verifiedEmail}"`);
  });
});
