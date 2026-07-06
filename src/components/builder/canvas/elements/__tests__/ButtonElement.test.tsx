import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { createHomeButtonNode } from '@/lib/builder/canvas/decompose-home-shared';
import ButtonElement from '../ButtonElement';

describe('ButtonElement', () => {
  it('keeps classed link-style buttons left aligned', () => {
    const node = createHomeButtonNode({
      id: 'attorney-email',
      rect: { x: 0, y: 0, width: 348, height: 22 },
      zIndex: 0,
      label: 'wei@hoveringlaw.com.tw',
      href: 'mailto:wei@hoveringlaw.com.tw',
      style: 'link',
      className: 'attorney-card-email',
      as: 'a',
    });

    if (node.kind !== 'button') throw new Error('Expected button node');

    const html = renderToStaticMarkup(
      React.createElement(ButtonElement, { node, mode: 'published', locale: 'ko' }),
    );

    expect(html).toContain('justify-content:flex-start');
  });
});
