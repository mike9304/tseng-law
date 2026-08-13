import { describe, expect, it } from 'vitest';

import { heroQuickMenus } from '@/components/HeroSearch';
import { createHeroDecomposedNodes } from '@/lib/builder/canvas/decompose-hero';

describe('hero search contact-information suggestions', () => {
  it.each([
    ['ko', '연락처 정보'],
    ['zh-hant', '聯絡資訊'],
    ['en', 'Contact information'],
    ['ja', '連絡先'],
  ] as const)(
    'keeps the %s suggestion informational and linked to the contact page',
    (locale, label) => {
      const contactSuggestion = heroQuickMenus[locale].find(
        (item) => item.href === `/${locale}/contact`,
      );

      expect(contactSuggestion).toEqual({
        label,
        href: `/${locale}/contact`,
      });
    },
  );

  it.each([
    ['ko', '연락처 정보'],
    ['zh-hant', '聯絡資訊'],
    ['en', 'Contact information'],
  ] as const)(
    'keeps the decomposed %s builder suggestion aligned with the public hero',
    (locale, label) => {
      const nodes = createHeroDecomposedNodes(0, locale, 0);
      const contactSuggestion = nodes.find(
        (node) => node.id === 'home-hero-quick-menu-item-5',
      );

      expect(contactSuggestion?.content).toMatchObject({
        label,
        href: `/${locale}/contact`,
      });
    },
  );

  it('does not present informational search suggestions as direct consultation CTAs', () => {
    const publicSuggestions = JSON.stringify(heroQuickMenus);
    const decomposedHeroes = (['ko', 'zh-hant', 'en'] as const)
      .flatMap((locale) => createHeroDecomposedNodes(0, locale, 0))
      .map((node) => JSON.stringify(node.content))
      .join('');

    expect(`${publicSuggestions}${decomposedHeroes}`).not.toMatch(
      /문의하기|聯絡我們|Contact Us|お問い合わせ/,
    );
  });
});
