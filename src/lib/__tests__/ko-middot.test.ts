import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { describe, expect, it } from 'vitest';

import { typesetTitle } from '@/lib/ko-middot';

const html = (locale: string, text: string) =>
  renderToStaticMarkup(createElement('h1', null, typesetTitle(locale, text)));
const textOf = (markup: string) => markup.replace(/<[^>]+>/g, '');

describe('Korean middle-dot title typesetting', () => {
  it('keeps each middle dot on the line of the character before it', () => {
    expect(html('ko', '자회사·지점·대표사무소')).toBe(
      '<h1>자회<span style="white-space:nowrap">사·</span>지<span style="white-space:nowrap">점·</span>대표사무소</h1>',
    );
  });

  it('leaves the visible text byte-identical (no control characters)', () => {
    for (const title of ['한국어 상담·소송·법인설립 지원', '자회사·지점·대표사무소, 절차와 취업허가', 'A · B']) {
      const markup = html('ko', title);
      expect(textOf(markup)).toBe(title);
      expect(markup).not.toMatch(/⁠/);
    }
  });

  it('only changes Korean titles that contain a middle dot', () => {
    expect(typesetTitle('en', 'Setup · Tax')).toBe('Setup · Tax');
    expect(typesetTitle('zh-hant', '公司·稅務')).toBe('公司·稅務');
    expect(typesetTitle('ko', '대만 회사 설립')).toBe('대만 회사 설립');
  });
});
