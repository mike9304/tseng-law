import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import floatingChat from '../index';
import {
  builderCanvasNodeSchema,
  type BuilderFloatingChatCanvasNode,
} from '@/lib/builder/canvas/types';

describe('floating chat component', () => {
  it('does not render unsafe href protocols', () => {
    const html = renderToStaticMarkup(
      React.createElement(floatingChat.Render, {
        node: makeNode('javascript:alert(document.domain)'),
        mode: 'published',
      }),
    );

    expect(html).toContain('href="#"');
    expect(html).not.toContain('javascript:');
  });

  it('keeps safe chat URLs intact', () => {
    const html = renderToStaticMarkup(
      React.createElement(floatingChat.Render, {
        node: makeNode('https://wa.me/15551234567'),
        mode: 'published',
      }),
    );

    expect(html).toContain('href="https://wa.me/15551234567"');
  });
});

function makeNode(href: string): BuilderFloatingChatCanvasNode {
  return builderCanvasNodeSchema.parse({
    id: 'floating-chat-1',
    kind: 'floating-chat',
    rect: { x: 0, y: 0, width: 64, height: 64 },
    zIndex: 1,
    content: {
      provider: 'whatsapp',
      href,
      label: 'Chat',
      placement: 'bottom-right',
      showLabel: false,
      color: '#25d366',
    },
  }) as BuilderFloatingChatCanvasNode;
}
