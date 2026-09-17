import React, { type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Node unit harness: execute the real component's effect, retain its state, then rerender.
// This does not claim native hydration or an actual Next.js error recovery.
const hooks = vi.hoisted(() => ({
  initialized: false,
  state: undefined as unknown,
  effects: [] as Array<() => void>,
}));

vi.mock('react', async (importOriginal) => ({
  ...await importOriginal<typeof import('react')>(),
  useState: (initial: unknown) => {
    if (!hooks.initialized) {
      hooks.state = initial;
      hooks.initialized = true;
    }
    return [hooks.state, (next: unknown) => { hooks.state = next; }];
  },
  useEffect: (effect: () => void) => { hooks.effects.push(effect); },
}));

import GlobalError from '../global-error';

function retryCallback(node: ReactNode): (() => void) | undefined {
  if (Array.isArray(node)) return node.map(retryCallback).find(Boolean);
  if (!React.isValidElement<{ children?: ReactNode; onClick?: () => void }>(node)) return undefined;
  return node.type === 'button' ? node.props.onClick : retryCallback(node.props.children);
}

describe('global error locale after its pathname effect', () => {
  beforeEach(() => {
    hooks.initialized = false;
    hooks.state = undefined;
    hooks.effects = [];
  });
  afterEach(() => vi.unstubAllGlobals());

  it.each([
    ['/ko/search', 'ko', 'ko', '페이지를 표시할 수 없습니다', '다시 시도'],
    ['/zh-hant/search', 'zh-hant', 'zh-Hant', '目前無法顯示頁面', '再試一次'],
    ['/en/search', 'en', 'en', 'We could not display this page', 'Try again'],
    ['/ja/search?q=example', 'ja', 'ja', 'ページを表示できません', '再試行'],
    ['/unknown/search', 'ko', 'ko', '페이지를 표시할 수 없습니다', '다시 시도'],
    ['/', 'ko', 'ko', '페이지를 표시할 수 없습니다', '다시 시도'],
  ])('selects the expected public language for %s and keeps reset wiring', (pathname, locale, lang, title, retry) => {
    vi.stubGlobal('window', { location: new URL(pathname, 'https://example.invalid') });
    const reset = vi.fn();
    const error = Object.assign(new Error('PRIVATE_ERROR_MESSAGE'), { digest: 'PRIVATE_ERROR_DIGEST' });
    const props = { error, reset };
    const initial = renderToStaticMarkup(GlobalError(props));
    expect(initial).toContain('<html lang="ko">');
    expect(hooks.effects).toHaveLength(1);
    hooks.effects[0]();
    const tree = GlobalError(props);
    const html = renderToStaticMarkup(tree);
    expect(html).toContain(`<html lang="${lang}">`);
    expect(html).toContain(`<h1 id="global-error-title">${title}</h1>`);
    expect(html.match(new RegExp(`href="/${locale}"`, 'g'))).toHaveLength(2);
    expect(html).toContain(`>${retry}</button>`);
    expect(html).not.toContain('PRIVATE_ERROR_MESSAGE');
    expect(html).not.toContain('PRIVATE_ERROR_DIGEST');
    if (locale === 'ja') {
      expect(html).toContain('一時的なエラーのため、このページを表示できません。もう一度お試しいただくか、ホームに戻ってください。');
      expect(html).toContain('>ホームに戻る</a>');
      expect(html).toContain('<footer class="global-error-footer">昊鼎国際法律事務所</footer>');
      expect(html).not.toMatch(/[가-힣]/);
    }
    expect(retryCallback(tree)).toBe(reset);
    retryCallback(tree)?.();
    expect(reset).toHaveBeenCalledTimes(1);
  });
});
