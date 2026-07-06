import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { getComponentLibraryCopy } from '../component-library-copy';
import { ComponentLibraryRemapReview } from '../ComponentLibraryRemapReview';
import { makeComponentLibraryFieldOverrideKey } from '../component-library-field-remap.helpers';
import { makeComponentLibraryFieldRemapReview } from '../component-library-remap-review.helpers';

describe('component library remap review', () => {
  it('renders editable field choices before confirming a cross-target insert', () => {
    const review = makeComponentLibraryFieldRemapReview({
      targetId: 'home.services.list',
      remappedFields: [
        { fieldKey: 'text', sourceFieldId: 'readTime', targetFieldId: 'description' },
      ],
      droppedFields: [],
    });
    const html = renderToStaticMarkup(
      React.createElement(ComponentLibraryRemapReview, {
        copy: getComponentLibraryCopy('en'),
        review,
        fieldOverrides: { [makeComponentLibraryFieldOverrideKey('text', 'readTime')]: 'details' },
        onFieldOverrideChange: () => undefined,
        onConfirm: () => undefined,
        onCancel: () => undefined,
      }),
    );

    expect(html).toContain('data-builder-component-library-remap-review="true"');
    expect(html).toContain('data-builder-component-library-remap-review-target="home.services.list"');
    expect(html).toContain('data-builder-component-library-remap-review-field="text"');
    expect(html).toContain('data-builder-component-library-remap-review-source-field="readTime"');
    expect(html).toContain('Read time');
    expect(html).toContain('Description');
    expect(html).toContain('Details');
    expect(html).toContain('selected=""');
    expect(html).toContain('Review fields');
  });
});
