import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { guidanceChromeLabels } from '@/lib/public-site-chrome';
import { guidanceContent } from '@/data/international-guidance-content';

const GUIDANCE = ['vi', 'id', 'th', 'fil'] as const;

/**
 * The guidance locales ship reviewed translations for chrome the site was
 * nonetheless rendering in English: `Header.tsx` branches on ko/zh-hant/ja and
 * falls through to English, and the column shell coerces the locale to 'en'
 * before reading its copy pack. Live vi column page carried "Skip to main
 * content", "Back to columns", "Contact Us" and "Frequently Asked Questions"
 * under Vietnamese body text.
 */
describe('guidance chrome uses the pack instead of falling through to English', () => {
  it('exposes the skip-link and menu labels each pack already publishes', () => {
    for (const locale of GUIDANCE) {
      const labels = guidanceChromeLabels(locale);
      expect(labels, locale).not.toBeNull();
      expect(labels!.skipLink).toBe(guidanceContent[locale].skipLink);
      expect(labels!.menuLabel).toBe(guidanceContent[locale].menuLabel);
      // Guards the actual regression: an English fallback leaking through.
      expect(labels!.skipLink).not.toBe('Skip to main content');
      expect(labels!.menuLabel).not.toBe('Menu');
    }
  });

  it('returns null for the four locales that keep their own ladder', () => {
    for (const locale of ['ko', 'zh-hant', 'en', 'ja'] as const) {
      expect(guidanceChromeLabels(locale), locale).toBeNull();
    }
  });

  it('wires the header skip label and menu label through the accessor', () => {
    const header = readFileSync(path.join(process.cwd(), 'src/components/Header.tsx'), 'utf8');
    expect(header).toContain('guidanceChromeLabels(locale)');
    expect(header).toMatch(/const skipLabel = guidanceLabels\s*\?\s*guidanceLabels\.skipLink/);
    expect(header).toMatch(/const menuLabel = guidanceLabels\s*\?\s*guidanceLabels\.menuLabel/);
  });

  it('builds the column shell labels from the pack, not from copy.en', () => {
    const page = readFileSync(
      path.join(process.cwd(), 'src/app/[locale]/columns/[slug]/page.tsx'),
      'utf8',
    );
    expect(page).toMatch(/backLabel: `← \$\{guidancePack\.nav\.columns\}`/);
    expect(page).toContain('faqHeading: guidancePack.nav.faq');
    expect(page).toContain('consultationButton: guidancePack.contactCta');
  });

  it('every pack supplies the three strings the column shell reuses', () => {
    for (const locale of GUIDANCE) {
      const pack = guidanceContent[locale];
      for (const value of [pack.nav.columns, pack.nav.faq, pack.contactCta]) {
        expect(value, locale).toBeTruthy();
        expect(/^[\x00-\x7F]*$/.test(value) && /^(Articles|FAQ|Contact)$/i.test(value)).toBe(false);
      }
    }
  });
});
