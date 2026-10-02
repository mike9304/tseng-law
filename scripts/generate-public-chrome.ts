/** Run: npx vite-node --config vitest.config.ts scripts/generate-public-chrome.ts */
import { writeFileSync } from 'node:fs';
import { guidanceContent } from '../src/data/international-guidance-content';
const chrome = Object.fromEntries(Object.entries(guidanceContent).map(([locale, pack]) => [locale, {
  nav: pack.nav,
  languageLabel: pack.languageLabel,
  skipLink: pack.skipLink,
  menuLabel: pack.menuLabel,
  contactCta: pack.contactCta,
  footerNotice: pack.footerNotice,
  pages: { home: { title: pack.pages.home.title, description: pack.pages.home.description } },
}]));
writeFileSync(new URL('../src/data/guidance-chrome.json', import.meta.url), JSON.stringify(chrome, null, 2) + '\n');
