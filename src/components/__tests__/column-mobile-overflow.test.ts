import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from 'vitest';
import * as ts from 'typescript';

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
    const sourceFile = ts.createSourceFile(
      'column-detail-page.tsx',
      columnPage,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX,
    );

    const classTokensOf = (attr: ts.JsxAttribute): string[] => {
      const tokens: string[] = [];
      const take = (node: ts.Node) => {
        if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
          tokens.push(...node.text.split(/\s+/).filter(Boolean));
        } else if (ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node)) {
          tokens.push(...node.text.split(/\s+/).filter(Boolean));
        }
        ts.forEachChild(node, take);
      };
      take(attr);
      return tokens;
    };

    const scopedNavs: ts.JsxElement[] = [];
    const visitNav = (node: ts.Node) => {
      if (ts.isJsxElement(node) && node.openingElement.tagName.getText() === 'nav') {
        const classNameAttr = node.openingElement.attributes.properties.find(
          (p): p is ts.JsxAttribute => ts.isJsxAttribute(p) && p.name.getText() === 'className',
        );
        const tokens = classNameAttr ? classTokensOf(classNameAttr) : [];
        if (tokens.includes('container') && tokens.includes('column-post-nav')) {
          scopedNavs.push(node);
        }
      }
      ts.forEachChild(node, visitNav);
    };
    visitNav(sourceFile);
    expect(scopedNavs).toHaveLength(1);
    const nav = scopedNavs[0]!;

    const isLocaleColumnSlugHref = (
      initializer: ts.JsxAttribute['initializer'],
      postIdent: 'prevPost' | 'nextPost',
    ): boolean => {
      if (!initializer || !ts.isJsxExpression(initializer) || !initializer.expression) {
        return false;
      }
      const expr = initializer.expression;
      if (!ts.isTemplateExpression(expr) || expr.head.text !== '/' || expr.templateSpans.length !== 2) {
        return false;
      }
      const [localeSpan, slugSpan] = expr.templateSpans;
      if (
        !ts.isIdentifier(localeSpan.expression) ||
        (localeSpan.expression.text !== 'locale' && localeSpan.expression.text !== 'urlLocale')
      ) {
        return false;
      }
      if (localeSpan.literal.text !== '/columns/') {
        return false;
      }
      const access = slugSpan.expression;
      return (
        ts.isPropertyAccessExpression(access) &&
        ts.isIdentifier(access.expression) &&
        access.expression.text === postIdent &&
        access.name.text === 'slug' &&
        slugSpan.literal.text === ''
      );
    };

    const hrefInits: Array<ts.JsxAttribute['initializer']> = [];
    const visitLinks = (node: ts.Node) => {
      if (
        (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) &&
        node.tagName.getText() === 'Link'
      ) {
        const hrefAttr = node.attributes.properties.find(
          (p): p is ts.JsxAttribute => ts.isJsxAttribute(p) && p.name.getText() === 'href',
        );
        hrefInits.push(hrefAttr?.initializer);
      }
      ts.forEachChild(node, visitLinks);
    };
    visitLinks(nav);
    expect(hrefInits.some((init) => isLocaleColumnSlugHref(init, 'prevPost'))).toBe(true);
    expect(hrefInits.some((init) => isLocaleColumnSlugHref(init, 'nextPost'))).toBe(true);
    expect(columnPage).toContain('container column-post-nav');
    expect(columnPage).toContain('href={`/${urlLocale}/columns/${prevPost.slug}`}');
    expect(columnPage).toContain('href={`/${urlLocale}/columns/${nextPost.slug}`}');

    const mediaBlocks = extractBlocks(css, '@media (max-width: 900px)');
    const targetBlocks = mediaBlocks.filter(({ block }) => block.includes('.blog-container'));
    const mobileCss = targetBlocks[0]?.block ?? '';

    expect(ruleBody(mobileCss, '.column-post-nav > *')).toMatch(
      /min-width:\s*0;\s*overflow-wrap:\s*anywhere;/,
    );
    expect(ruleBodies(css, 'nav.container > *')).toHaveLength(0);
  });

  test('allows long rendered Markdown link labels to wrap within mobile articles', () => {
    const mediaBlocks = extractBlocks(css, '@media (max-width: 900px)');
    const targetBlocks = mediaBlocks.filter(({ block }) => block.includes('.blog-container'));
    const mobileCss = targetBlocks[0]?.block ?? '';

    expect(ruleBody(mobileCss, '.column-markdown .link-underline')).toContain(
      'overflow-wrap: anywhere',
    );

    const cssOutsideTarget = targetBlocks[0]
      ? `${css.slice(0, targetBlocks[0].start)}${css.slice(targetBlocks[0].end)}`
      : css;
    expect(ruleBodies(cssOutsideTarget, '.column-markdown .link-underline')).toHaveLength(0);
  });
});
