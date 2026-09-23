import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from 'vitest';

// WO-DS2 (2026-09-23): b149d664 added locale-agnostic `word-break: normal` to
// several CSS modules, so Korean text broke mid-syllable. Korean must keep
// 어절 wrapping (globals.css WI-1) via a :lang(ko)-scoped keep-all override in
// the same module, while ja/zh keep `normal`.

function read(relative: string): string {
  return readFileSync(path.join(process.cwd(), relative), 'utf8');
}

/** Selectors (normalized whitespace) of every rule declaring word-break: keep-all. */
function keepAllSelectors(css: string): string[] {
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const selectors: string[] = [];
  for (const match of stripped.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (!/word-break:\s*keep-all\s*;?/.test(match[2])) continue;
    for (const selector of match[1].split(',')) selectors.push(selector.replace(/\s+/g, ' ').trim());
  }
  return selectors;
}

const cases: Array<{ file: string; required: string[] }> = [
  {
    file: 'src/app/[locale]/columns/[slug]/ColumnDetail.module.css',
    required: [
      '.hero:lang(ko) :global(.blog-hero-title)',
      '.article:lang(ko) :global(.column-markdown) :global(h2.blog-heading)',
      '.article:lang(ko) :global(.column-faq-heading)',
      '.article:lang(ko) :global(.column-markdown) :global(h3.blog-heading)',
      '.article:lang(ko) :global(.blog-paragraph)',
      '.article:lang(ko) :global(.authority-card-name)',
      '.article:lang(ko) :global(.authority-card-role)',
      '.article:lang(ko) :global(.authority-card-summary)',
    ],
  },
  {
    file: 'src/components/ColumnsGrid.module.css',
    required: [
      '.root:lang(ko) :global(.columns-card-title)',
      '.root:lang(ko) :global(.columns-card-summary)',
      '.root:lang(ko) :global(.columns-grid) :global(.columns-card-summary)',
    ],
  },
  { file: 'src/components/Breadcrumbs.module.css', required: ['.current:lang(ko)'] },
  {
    file: 'src/components/InternationalInquiryForm.module.css',
    required: [
      '.form:lang(ko)',
      '.notice:lang(ko)',
      '.heading:lang(ko)',
      '.intro:lang(ko)',
      '.label:lang(ko)',
      '.noticeText:lang(ko)',
      '.consentLabel:lang(ko)',
      '.privacyLink:lang(ko)',
    ],
  },
  {
    file: 'src/app/[locale]/services/[slug]/ServiceDetail.module.css',
    required: [
      '.sidebar:lang(ko) :global(.authority-card-name)',
      '.sidebar:lang(ko) :global(.authority-card-role)',
      '.sidebar:lang(ko) :global(.authority-card-summary)',
    ],
  },
];

describe('WO-DS2 Korean keep-all scope in CSS modules', () => {
  for (const { file, required } of cases) {
    test(`${file} restores keep-all for ko only`, () => {
      const selectors = keepAllSelectors(read(file));
      for (const selector of required) expect(selectors).toContain(selector);
      // keep-all must never leak to ja / zh (WI-1: they stay `normal`).
      for (const selector of selectors) {
        expect(selector).not.toMatch(/:lang\((ja|zh)|lang='(ja|zh)|data-locale='(ja|zh)/i);
      }
    });
  }

  test('intentional break-anywhere elements stay out of the ko keep-all scope', () => {
    const selectors = keepAllSelectors(read('src/components/InternationalInquiryForm.module.css'));
    for (const selector of selectors) {
      expect(selector).not.toMatch(/\.(receiptId|emailInput|input|select)\b/);
    }
  });
});
