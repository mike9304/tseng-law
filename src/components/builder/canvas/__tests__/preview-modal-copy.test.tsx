import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, test, vi } from 'vitest';
import PreviewModal from '../PreviewModal';
import { getPreviewModalCopy } from '../preview-modal-copy';

describe('preview modal copy', () => {
  test('returns localized zh-hant preview modal labels', () => {
    const copy = getPreviewModalCopy('zh-hant');

    expect(copy.ariaLabel).toBe('頁面預覽');
    expect(copy.deviceLabels.mobile).toBe('手機');
    expect(copy.loadingMessage).toBe('正在載入預覽');
    expect(copy.footerSummary(390, 780, 75)).toContain('縮放 75%');
  });

  test('renders preview modal with zh-hant chrome', () => {
    const originalError = console.error;
    const consoleError = vi.spyOn(console, 'error').mockImplementation((message, ...args) => {
      if (typeof message === 'string' && message.includes('useLayoutEffect does nothing on the server')) return;
      originalError.call(console, message, ...args);
    });

    let html = '';
    try {
      html = renderToStaticMarkup(
        React.createElement(PreviewModal, {
          open: true,
          locale: 'zh-hant',
          onClose: () => undefined,
          previewUrl: null,
          initialDevice: 'mobile',
        }),
      );
    } finally {
      consoleError.mockRestore();
    }

    expect(html).toContain('aria-label="頁面預覽"');
    expect(html).toContain('選擇裝置');
    expect(html).toContain('手機');
    expect(html).toContain('重新整理');
    expect(html).toContain('請先發佈頁面才能預覽。');
    expect(html).not.toContain('페이지 미리보기');
    expect(html).not.toContain('새로고침');
    expect(html).not.toContain('Desktop');
  });
});
