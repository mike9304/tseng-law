import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, test } from 'vitest';
import { BuilderThemeProvider } from '../BuilderThemeContext';
import ThemeTextPresetPicker from '../ThemeTextPresetPicker';
import { DEFAULT_THEME } from '@/lib/builder/site/types';

describe('ThemeTextPresetPicker', () => {
  test('renders localized preset labels', () => {
    const koMarkup = renderToStaticMarkup(
      <BuilderThemeProvider value={DEFAULT_THEME}>
        <ThemeTextPresetPicker
          locale="ko"
          value="title1"
          onChange={() => {}}
        />
      </BuilderThemeProvider>,
    );
    const zhMarkup = renderToStaticMarkup(
      <BuilderThemeProvider value={DEFAULT_THEME}>
        <ThemeTextPresetPicker
          locale="zh-hant"
          value={undefined}
          onChange={() => {}}
        />
      </BuilderThemeProvider>,
    );

    expect(koMarkup).toContain('제목 1');
    expect(zhMarkup).toContain('無預設');
  });
});
