import { describe, expect, it } from 'vitest';
import { textNode } from './component-library-panel-test-fixtures';
import {
  formatMultiSelectionBboxLabel,
  formatSelectionToolbarSummary,
  getSelectionToolbarAriaLabel,
  previewSelectionLinkHref,
} from '../selection-overlay-copy';

describe('selection overlay copy', () => {
  it('formats multi-selection bounding-box labels by locale', () => {
    expect(formatMultiSelectionBboxLabel({
      count: 2,
      height: 90.5,
      locale: 'ko',
      width: 200.4,
    })).toBe('2개 선택됨 · 200 x 91');
    expect(formatMultiSelectionBboxLabel({
      count: 3,
      height: 88.1,
      locale: 'zh-hant',
      width: 144.9,
    })).toBe('已選取 3 個 · 145 x 88');
    expect(formatMultiSelectionBboxLabel({
      count: 4,
      height: 120.2,
      locale: 'en',
      width: 320.6,
    })).toBe('4 selected · 321 x 120');
  });

  it('formats toolbar summaries and aria labels by locale', () => {
    const selectedNodes = [textNode({ id: 'node-a' }), textNode({ id: 'node-b' })];

    expect(formatSelectionToolbarSummary(selectedNodes, 'ko')).toBe('2개 선택됨');
    expect(formatSelectionToolbarSummary(selectedNodes, 'zh-hant')).toBe('已選取 2 個');
    expect(formatSelectionToolbarSummary(selectedNodes, 'en')).toBe('2 selected');
    expect(formatSelectionToolbarSummary([selectedNodes[0]], 'ko')).toBe('text');
    expect(getSelectionToolbarAriaLabel('ko')).toBe('요소 빠른 작업');
    expect(getSelectionToolbarAriaLabel('zh-hant')).toBe('元素快速操作');
    expect(getSelectionToolbarAriaLabel('en')).toBe('Element quick actions');
  });

  it('previews long link hrefs without leaking raw toolbar logic', () => {
    expect(previewSelectionLinkHref(undefined)).toBe('');
    expect(previewSelectionLinkHref(' /contact ')).toBe('/contact');
    expect(previewSelectionLinkHref('https://example.com/path/to/resource')).toBe('https://example.com/pa...');
  });
});
