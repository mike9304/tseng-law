import { expect, it } from 'vitest';
import { guidanceContent } from '../international-guidance-content';
import chrome from '../guidance-chrome.json';

it('keeps the lightweight client chrome identical to the canonical translated copy', () => {
  const expected = Object.fromEntries(Object.entries(guidanceContent).map(([locale, pack]) => [locale, {
    nav: pack.nav, languageLabel: pack.languageLabel, skipLink: pack.skipLink,
    menuLabel: pack.menuLabel, contactCta: pack.contactCta, footerNotice: pack.footerNotice,
    pages: { home: { title: pack.pages.home.title, description: pack.pages.home.description } },
  }]));
  // Refresh with scripts/generate-public-chrome.ts after changing these strings.
  expect(chrome).toEqual(expected);
  expect(JSON.stringify(chrome).length).toBeLessThan(JSON.stringify(guidanceContent).length / 10);
});
