import React from 'react';
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import TemplateEditor from '../TemplateEditor';
import type { EmailTemplate } from '@/lib/builder/marketing/templates/types';

function templateFixture(blocks: EmailTemplate['blocks']): EmailTemplate {
  return {
    templateId: 'tpl-preview-test',
    name: 'Preview test',
    blocks,
    pageBackground: '#f8fafc',
    contentBackground: '#ffffff',
    createdAt: '2026-05-13T00:00:00Z',
    updatedAt: '2026-05-13T00:00:00Z',
  };
}

describe('TemplateEditor preview', () => {
  it('does not reflect unsafe button or image URLs into preview markup', () => {
    const html = renderToStaticMarkup(
      <TemplateEditor
        initialTemplate={templateFixture([
          {
            blockId: 'button-unsafe',
            kind: 'button',
            label: 'Click',
            href: 'javascript:alert(1)',
          },
          {
            blockId: 'image-unsafe',
            kind: 'image',
            src: 'data:text/html,<script>alert(1)</script>',
            alt: 'Unsafe image',
          },
        ])}
      />,
    );

    expect(html).not.toContain('<a href="javascript:');
    expect(html).not.toContain('<img src="data:text/html');
    expect(html).toContain('href="#"');
    expect(html).toContain('src="#"');
  });
});
