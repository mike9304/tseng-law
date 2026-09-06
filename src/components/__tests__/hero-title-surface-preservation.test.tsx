import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import HeroSearch from '@/components/HeroSearch';
import { homeHeroTextSurfaceIds } from '@/lib/builder/registry';
import { BuilderSurfaceProvider } from '@/lib/builder/surface-context';

function headingText(html: string) {
  return html.match(/<h[12][^>]*>([\s\S]*?)<\/h[12]>/)?.[1].replace(/<[^>]*>/g, '');
}

describe('Japanese hero title surface content', () => {
  it('preserves the default title text at both supported heading levels', () => {
    for (const headingLevel of [1, 2] as const) {
      const html = renderToStaticMarkup(createElement(HeroSearch, { locale: 'ja', headingLevel }));
      expect(headingText(html)).toBe('台湾法を、分かりやすく。');
    }
  });

  it.each(['編集した日本語のタイトル。', ''])('preserves a builder title override verbatim: %j', (title) => {
    const html = renderToStaticMarkup(
      <BuilderSurfaceProvider
        nodeId="home-hero"
        mode="published"
        overrides={{ [homeHeroTextSurfaceIds[1]]: title }}
        selectedSurfaceKey={null}
      >
        <HeroSearch locale="ja" />
      </BuilderSurfaceProvider>,
    );

    expect(headingText(html)).toBe(title);
    expect(html).not.toContain('分かりやすく。');
  });
});
