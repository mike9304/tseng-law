import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import TemplateThumbnailRenderer from '../TemplateThumbnailRenderer';
import type { PageTemplate } from '@/lib/builder/templates/types';

const template = {
  id: 'demo-template',
  name: 'Demo template',
  category: 'law',
  subcategory: 'editorial',
  description: 'Demo',
  paletteKey: 'law-editorial',
  document: {
    version: 1,
    locale: 'en',
    updatedAt: '2026-07-13T00:00:00.000Z',
    updatedBy: 'test',
    stageWidth: 1200,
    stageHeight: 800,
    nodes: [],
  },
} as PageTemplate;

describe('TemplateThumbnailRenderer demo disclosure', () => {
  it('visibly labels HTML-scaled mock thumbnails', () => {
    const html = renderToStaticMarkup(
      <TemplateThumbnailRenderer template={template} width={240} height={160} eager locale="en" />,
    );

    expect(html).toContain('data-template-thumbnail-renderer="html-scaled-mock"');
    expect(html).toContain('data-builder-demo-disclosure="html-scaled-mock"');
    expect(html).toContain('Demo preview');
  });

  it('does not add the demo disclosure to published image thumbnails', () => {
    const html = renderToStaticMarkup(
      <TemplateThumbnailRenderer
        template={{ ...template, thumbnail: '/images/template.jpg' }}
        width={240}
        height={160}
        eager
        locale="en"
      />,
    );

    expect(html).not.toContain('data-builder-demo-disclosure');
  });
});
