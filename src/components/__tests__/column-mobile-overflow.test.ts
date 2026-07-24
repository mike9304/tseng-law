import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from 'vitest';

const css = readFileSync(path.join(process.cwd(), 'src/app/globals.css'), 'utf8');
const columnPage = readFileSync(
  path.join(process.cwd(), 'src/app/[locale]/columns/[slug]/page.tsx'),
  'utf8',
);

function extractBlocks(source: string, header: string): Array<{ block: string; start: number; end: number }> {
  const blocks: Array<{ block: string; start: number; end: number }> = [];
  let searchFrom = 0;

  while (searchFrom < source.length) {
    const start = source.indexOf(header, searchFrom);
    if (start === -1) break;

    const openingBrace = source.indexOf('{', start + header.length);
    if (openingBrace === -1) break;

    let depth = 0;
    for (let index = openingBrace; index < source.length; index += 1) {
      if (source[index] === '{') depth += 1;
      if (source[index] === '}') depth -= 1;

      if (depth === 0) {
        blocks.push({ block: source.slice(start, index + 1), start, end: index + 1 });
        searchFrom = index + 1;
        break;
      }
    }

    if (depth !== 0) throw new Error(`Unclosed CSS block for ${header}`);
  }

  return blocks;
}

function ruleBody(source: string, selector: string): string {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return source.match(new RegExp(`${escapedSelector}\\s*\\{([^{}]*)\\}`))?.[1] ?? '';
}

function ruleBodies(source: string, selector: string): string[] {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return Array.from(
    source.matchAll(new RegExp(`${escapedSelector}\\s*\\{([^{}]*)\\}`, 'g')),
    (match) => match[1],
  );
}

describe('public column mobile overflow contract', () => {
  test('constrains the one-column layout without changing its existing mobile rules', () => {
    const mediaBlocks = extractBlocks(css, '@media (max-width: 900px)');
    const targetBlocks = mediaBlocks.filter(({ block }) => block.includes('.blog-container'));
    const target = targetBlocks[0];

    expect(targetBlocks).toHaveLength(1);

    const mobileCss = target?.block ?? '';
    expect(ruleBody(mobileCss, '.blog-container')).toContain('grid-template-columns: 1fr');
    expect(ruleBody(mobileCss, '.blog-container > *')).toContain('min-width: 0');
    expect(ruleBody(mobileCss, '.column-post-nav > *')).toContain('min-width: 0');
    expect(ruleBody(mobileCss, '.column-post-nav > *')).toContain('overflow-wrap: anywhere');
    expect(ruleBody(mobileCss, '.blog-body')).toContain('padding: 1.5rem 1.2rem');
    expect(ruleBody(mobileCss, '.blog-container > .blog-body')).toContain('max-width: 100%');
    expect(ruleBody(mobileCss, '.blog-sidebar')).toContain('position: static');

    const cssOutsideTarget = target
      ? `${css.slice(0, target.start)}${css.slice(target.end)}`
      : css;
    expect(ruleBodies(cssOutsideTarget, '.blog-container > *')).toHaveLength(0);
    expect(
      ruleBodies(cssOutsideTarget, '.blog-container > .blog-body').some((body) =>
        body.includes('max-width: 100%'),
      ),
    ).toBe(false);
  });

  test('keeps locale-aware prev and next links inside the scoped navigation', () => {
    expect(columnPage).toContain('<nav className="container column-post-nav"');
    expect(columnPage).toContain('href={`/${locale}/columns/${prevPost.slug}`}');
    expect(columnPage).toContain('href={`/${locale}/columns/${nextPost.slug}`}');

    const mediaBlocks = extractBlocks(css, '@media (max-width: 900px)');
    const targetBlocks = mediaBlocks.filter(({ block }) => block.includes('.blog-container'));
    const mobileCss = targetBlocks[0]?.block ?? '';

    expect(ruleBody(mobileCss, '.column-post-nav > *')).toMatch(
      /min-width:\s*0;\s*overflow-wrap:\s*anywhere;/,
    );
    expect(ruleBodies(css, 'nav.container > *')).toHaveLength(0);
  });
});
