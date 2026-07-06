import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { getComponentLibraryCopy } from '../component-library-copy';
import { ComponentLibraryRemapNotice } from '../ComponentLibraryRemapNotice';

describe('component library remap notice', () => {
  it('renders remapped and dropped field chips for a cross-target insert', () => {
    const html = renderToStaticMarkup(
      React.createElement(ComponentLibraryRemapNotice, {
        copy: getComponentLibraryCopy('en'),
        summary: {
          targetId: 'home.services.list',
          remappedFields: [
            { fieldKey: 'label', sourceFieldId: 'readTime', targetFieldId: 'description' },
          ],
          droppedFields: [
            { fieldKey: 'src', sourceFieldId: 'featuredImage' },
          ],
        },
        onDismiss: () => undefined,
      }),
    );

    expect(html).toContain('data-builder-component-library-remap-notice="true"');
    expect(html).toContain('data-builder-component-library-remap-target="home.services.list"');
    expect(html).toContain('data-builder-component-library-remap-changed="true"');
    expect(html).toContain('readTime -&gt; description');
    expect(html).toContain('data-builder-component-library-remap-dropped="true"');
    expect(html).toContain('featuredImage removed');
  });

  it('renders nothing when no fields were adjusted', () => {
    const html = renderToStaticMarkup(
      React.createElement(ComponentLibraryRemapNotice, {
        copy: getComponentLibraryCopy('en'),
        summary: null,
        onDismiss: () => undefined,
      }),
    );

    expect(html).toBe('');
  });
});
