import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import FloatingAiChat from '@/components/FloatingAiChat';
import {
  CONSULTATION_EMAIL,
  getConsultationPublicMailto,
} from '@/lib/consultation/public-contact';
import type { Locale } from '@/lib/locales';

const expectations = [
  {
    locale: 'ko',
    offices: '타이베이 · 타이중 · 가오슝 · 핑둥',
  },
  {
    locale: 'zh-hant',
    offices: '台北 · 台中 · 高雄 · 屏東',
  },
  {
    locale: 'en',
    offices: 'Taipei · Taichung · Kaohsiung · Pingtung',
  },
] as const satisfies ReadonlyArray<{ locale: Locale; offices: string }>;
const floatingChatSource = readFileSync(
  path.join(process.cwd(), 'src/components/FloatingAiChat.tsx'),
  'utf8',
);

function contactPanel(locale: Locale): string {
  const html = renderToStaticMarkup(
    createElement(FloatingAiChat, {
      locale,
      open: true,
      onClose: () => undefined,
    }),
  );

  return html.match(
    /<div class="floating-ai-chat-contacts">[\s\S]*?<\/div><\/div><\/div>/,
  )?.[0] ?? '';
}

describe('floating AI chat public contact panel', () => {
  it.each(expectations)(
    'shows four Taiwan offices and only the official email channel in $locale',
    ({ locale, offices }) => {
      const panel = contactPanel(locale);

      expect(panel).toContain(offices);
      expect(panel).toContain(CONSULTATION_EMAIL);
      expect(panel).toContain(
        getConsultationPublicMailto(locale).replace(/&/g, '&amp;'),
      );
      expect(panel).not.toMatch(/href="tel:/i);
      expect(panel).not.toMatch(/kakao|카카오|line\.me|lin.ee|라인|ライン/i);
    },
  );

  it('keeps the name input free-form and validates the reply channel as email', () => {
    expect(floatingChatSource).toMatch(
      /<input\s+type="text"[\s\S]*?value=\{formName\}/,
    );
    expect(floatingChatSource).toMatch(
      /<input\s+type="email"[\s\S]*?value=\{formContact\}/,
    );
  });
});
