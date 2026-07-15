import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from 'vitest';

const css = readFileSync(path.join(process.cwd(), 'src/app/globals.css'), 'utf8');
const publicPage = readFileSync(path.join(process.cwd(), 'src/lib/builder/site/public-page.tsx'), 'utf8');

function zIndexFor(selector: string): number {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(`(?:^|\\n)${escaped}\\s*\\{[\\s\\S]*?z-index:\\s*(\\d+);`));
  if (!match) throw new Error(`Missing z-index for ${selector}`);
  return Number(match[1]);
}

describe('search overlay layering', () => {
  test('keeps global search above floating AI chat', () => {
    expect(zIndexFor('.search-overlay')).toBeGreaterThan(zIndexFor('.floating-ai-chat'));
    expect(zIndexFor('.search-overlay')).toBeGreaterThan(zIndexFor('.builder-gallery-lightbox'));
    expect(zIndexFor('.search-overlay')).toBeGreaterThan(zIndexFor('.wix-toolbar'));
  });

  test('lifts the focused hero search stacking context above following sections', () => {
    expect(publicPage).toContain(".builder-pub-node[data-node-id='home-hero']:has(.hero-search-dropdown-wrap:focus-within)");
    expect(publicPage).toContain(".builder-pub-node[data-node-id='home-hero-root']:has([data-node-id='home-hero-search-wrap']:focus-within)");
  });

  test('drops floating AI chat under header-hosted search dialogs', () => {
    const match = css.match(/body:has\(\.search-overlay\[data-open='true'\]\) \.floating-ai-chat\s*\{[\s\S]*?z-index:\s*(\d+);/);

    expect(match).not.toBeNull();
    expect(Number(match?.[1])).toBeLessThan(zIndexFor('.floating-ai-chat'));
  });
});
