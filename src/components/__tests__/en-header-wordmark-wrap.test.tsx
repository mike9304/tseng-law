import { readFileSync } from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

const navigationState = vi.hoisted(() => ({
  pathname: '/en',
}));

vi.mock('next/navigation', () => ({
  usePathname: () => navigationState.pathname,
}));

import Header from '@/components/Header';

const cssSource = readFileSync(
  path.join(process.cwd(), 'src/components/PublicChrome.module.css'),
  'utf8',
);

describe('English mobile header wordmark wrap', () => {
  it('groups the EN wordmark into two nowrap lines instead of three words', () => {
    navigationState.pathname = '/en';
    const html = renderToStaticMarkup(<Header locale="en" />);

    expect(html).toContain('Hovering International');
    expect(html).toContain('Law Firm');
    expect(html).not.toMatch(/<span[^>]*>Hovering<\/span>\s+<span[^>]*>International<\/span>/);
  });

  it('keeps a two-line nowrap contract at 420px and leaves other locales as a single brand string', () => {
    expect(cssSource).toMatch(/@media\s*\(max-width:\s*420px\)/);
    expect(cssSource).toMatch(/white-space:\s*nowrap/);

    navigationState.pathname = '/ko';
    const ko = renderToStaticMarkup(<Header locale="ko" />);
    navigationState.pathname = '/ja';
    const ja = renderToStaticMarkup(<Header locale="ja" />);
    navigationState.pathname = '/zh-hant';
    const zh = renderToStaticMarkup(<Header locale="zh-hant" />);

    expect(ko).toContain('법무법인 호정');
    expect(ja).toContain('昊鼎国際法律事務所');
    expect(zh).toContain('昊鼎國際法律事務所');
    expect(ko).not.toContain('Hovering International');
    expect(ja).not.toContain('Hovering International');
    expect(zh).not.toContain('Hovering International');
  });
});
