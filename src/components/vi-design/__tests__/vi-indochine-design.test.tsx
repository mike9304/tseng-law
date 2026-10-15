import { readFileSync } from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import ViHomeBody from '../ViHomeBody';
import { ViServiceGrid } from '../ViShared';
import { guidanceContent } from '@/data/international-guidance-content';
import { guidanceOfficeCopy } from '@/data/international-guidance-offices';
import { viServicePresentation } from '@/data/vi-site';
import { internationalInquiryCopy } from '@/data/international-inquiry-copy';
import ViPageBody from '../ViPageBody';

const css = (file: string) => readFileSync(path.join(process.cwd(), file), 'utf8');
const textMarkup = (text: string) => renderToStaticMarkup(<>{text}</>);

/** Comma-separated selector list → selectors, keeping commas inside :is()/:global() together. */
function splitSelectorList(list: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = '';
  for (const char of list) {
    if (char === '(') depth += 1;
    if (char === ')') depth -= 1;
    if (char === ',' && depth === 0) {
      parts.push(current.trim());
      current = '';
      continue;
    }
    current += char;
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

/** True when the selector keeps a CSS-module (hashed, file-local) class outside every :global(…), so it cannot match
 *  outside the components that render that class. */
function hasLocalClass(selector: string): boolean {
  let rest = selector;
  for (let at = rest.indexOf(':global('); at !== -1; at = rest.indexOf(':global(')) {
    let depth = 0;
    let end = at + ':global'.length;
    for (; end < rest.length; end += 1) {
      if (rest[end] === '(') depth += 1;
      if (rest[end] === ')') { depth -= 1; if (depth === 0) break; }
    }
    rest = `${rest.slice(0, at)} ${rest.slice(end + 1)}`;
  }
  return /\.[A-Za-z_][\w-]*/.test(rest);
}

/** Every style-rule selector from the comment holding `marker` to the end of the file (comments and at-rule headers skipped). */
function selectorsFrom(source: string, marker: string): string[] {
  const start = source.indexOf(marker);
  expect(start, marker).toBeGreaterThan(-1);
  const body = source.slice(source.lastIndexOf('/*', start)).replace(/\/\*[\s\S]*?\*\//g, '');
  return [...body.matchAll(/([^{};]+)\{/g)]
    .map((match) => match[1].trim())
    .filter((prelude) => prelude && !prelude.startsWith('@'))
    .flatMap(splitSelectorList);
}

describe('vi «Indochine» design (2026-10-13)', () => {
  it('states the consultation languages on the contact page too (it does not render the contact band)', () => {
    const notice = internationalInquiryCopy.vi.consultationNotice;
    expect(renderToStaticMarkup(<ViPageBody pageKey="contact" />)).toContain(notice);
    expect(renderToStaticMarkup(<ViHomeBody posts={[]} />)).toContain(notice);
  });

  it('scopes the vi chrome block to Vietnamese pages, with square actions', () => {
    const source = css('src/components/PublicChrome.module.css');
    const marker = 'vi chrome «Indochine» (2026-10-13)';
    const selectors = selectorsFrom(source, marker);
    expect(selectors.length).toBeGreaterThan(40);
    for (const selector of selectors) expect(selector).toContain(":global(.site[data-locale='vi'])");
    expect(source.slice(source.indexOf(marker))).not.toContain('999px');
  });

  it('scopes the vi columns block to #vi-columns and drops the chevron whose glyph only zh-hant/ko define', () => {
    const source = css('src/components/zh-hant-columns/ZhHantColumns.module.css');
    const marker = '===== vi «Indochine» (2026-10-13) =====';
    const selectors = selectorsFrom(source, marker);
    expect(selectors.length).toBeGreaterThan(30);
    for (const selector of selectors) expect(selector).toContain(':global(#vi-columns)');
    expect(source).toContain('.root:global(#vi-columns) .switchLatest a::after { content: none; }');
  });

  it('keeps the vi page, article and FAQ styles inside vi-only scopes', () => {
    // ViSite/ViArticle are vi-only modules: a rule leaks only if it has no local class outside :global().
    for (const [file, marker] of [
      ['src/components/vi-design/ViSite.module.css', 'vi «Indochine law office» (2026-10-13)'],
      ['src/components/vi-design/ViArticle.module.css', 'vi article «Indochine» (2026-10-13)'],
    ] as const) {
      const selectors = selectorsFrom(css(file), marker);
      expect(selectors.length, file).toBeGreaterThan(40);
      for (const selector of selectors) expect(hasLocalClass(selector), `${file}: ${selector}`).toBe(true);
    }
    const article = css('src/components/vi-design/ViArticle.module.css');
    expect(article.match(/#[a-z-]+-column\b/g)?.every((id) => id === '#vi-column')).toBe(true);
    const faqSelectors = selectorsFrom(css('src/components/FAQAccordion.module.css'), 'vi Indochine (2026-10-13)');
    expect(faqSelectors.length).toBeGreaterThan(5);
    for (const selector of faqSelectors) expect(selector).toContain(":global(.site[data-locale='vi'])");
  });

  it('labels home sections only with names the site already uses (no new copy)', () => {
    const html = renderToStaticMarkup(<ViHomeBody posts={[]} />);
    const labels = [...html.matchAll(/<p class="_eyebrow_[^"]*">([^<]*)<\/p>/g)].map((match) => match[1]);
    const known = new Set([...Object.values(guidanceContent.vi.nav), guidanceOfficeCopy.vi.label].map(textMarkup));
    expect(labels.length).toBeGreaterThanOrEqual(3);
    for (const label of labels) expect(known.has(label), label).toBe(true);
  });

  it('draws the service ledger without pictograms (one chevron per card)', () => {
    const html = renderToStaticMarkup(<ViServiceGrid />);
    expect(html.match(/<svg\b/g)).toHaveLength(viServicePresentation.length);
    for (const service of viServicePresentation) expect(html).toContain(textMarkup(service.title));
  });
});
