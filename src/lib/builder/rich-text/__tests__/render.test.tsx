import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { BUILDER_RICH_TEXT_FORMAT, type BuilderRichText } from '../types';
import { renderRichText } from '../render';

describe('renderRichText', () => {
  it('keeps block text on the surrounding node typography', () => {
    const richText: BuilderRichText = {
      format: BUILDER_RICH_TEXT_FORMAT,
      plainText: '대만 법률을 한국어로 명확하게',
      doc: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: '대만 법률을 한국어로 명확하게' }],
          },
        ],
      },
    };

    const html = renderToStaticMarkup(
      <div style={{ fontSize: 52 }}>
        {renderRichText(richText, { mode: 'block' })}
      </div>,
    );

    expect(html).toContain('font:inherit');
    expect(html).toContain('대만 법률을 한국어로 명확하게');
  });
});
