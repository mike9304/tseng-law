import React from 'react';
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { RepeaterTemplateCanvasHud } from '../RepeaterTemplateCanvasHud';
import { getRepeaterTemplateCopy } from '../repeater-template-copy';

const noop = () => undefined;

describe('RepeaterTemplateCanvasHud', () => {
  it('renders a canvas-level loading skeleton before repeater records are available', () => {
    const markup = renderToStaticMarkup(
      <RepeaterTemplateCanvasHud
        copy={getRepeaterTemplateCopy('en')}
        loading
        boundChildCount={1}
        childCount={3}
        recordCount={0}
        recordIndex={0}
        recordLabel="Loading CMS records"
        bindingSummary={[]}
        editDisabled
        duplicateDisabled
        onPrevious={noop}
        onNext={noop}
        onEdit={noop}
        onDuplicate={noop}
        onAddText={noop}
        onAddImage={noop}
        onAddButton={noop}
        onAddGallery={noop}
        onSelectBindingChild={noop}
      />,
    );

    expect(markup).toContain('data-builder-repeater-template-hud="true"');
    expect(markup).toContain('data-builder-repeater-template-loading="true"');
    expect(markup).toContain('Loading CMS records');
    expect(markup).toContain('Template 1/3 bound');
    expect(markup.match(/data-builder-repeater-template-skeleton-card="true"/g)).toHaveLength(3);
  });

  it('renders field summary chips as direct template child selectors', () => {
    const markup = renderToStaticMarkup(
      <RepeaterTemplateCanvasHud
        copy={getRepeaterTemplateCopy('en')}
        boundChildCount={2}
        childCount={2}
        recordCount={3}
        recordIndex={1}
        recordLabel="Taiwan update"
        bindingSummary={[
          {
            nodeId: 'template-image',
            kindLabel: 'Image',
            fieldId: 'featuredImage',
            extraCount: 1,
          },
        ]}
        editDisabled={false}
        duplicateDisabled={false}
        onPrevious={noop}
        onNext={noop}
        onEdit={noop}
        onDuplicate={noop}
        onAddText={noop}
        onAddImage={noop}
        onAddButton={noop}
        onAddGallery={noop}
        onSelectBindingChild={noop}
      />,
    );

    expect(markup).toContain('data-builder-repeater-template-field-node-id="template-image"');
    expect(markup).toContain('aria-label="Select Image featuredImage template child"');
    expect(markup).toContain('featuredImage +1');
  });

  it('marks locked field summary chips without hiding their field mapping', () => {
    const markup = renderToStaticMarkup(
      <RepeaterTemplateCanvasHud
        copy={getRepeaterTemplateCopy('en')}
        boundChildCount={1}
        childCount={1}
        recordCount={2}
        recordIndex={0}
        recordLabel="Taiwan update"
        bindingSummary={[
          {
            nodeId: 'template-image',
            kindLabel: 'Image',
            fieldId: 'featuredImage',
            extraCount: 1,
            locked: true,
          },
        ]}
        editDisabled={false}
        duplicateDisabled={false}
        onPrevious={noop}
        onNext={noop}
        onEdit={noop}
        onDuplicate={noop}
        onAddText={noop}
        onAddImage={noop}
        onAddButton={noop}
        onAddGallery={noop}
        onSelectBindingChild={noop}
      />,
    );

    expect(markup).toContain('data-builder-repeater-template-field-locked="true"');
    expect(markup).toContain('featuredImage +1');
    expect(markup).toContain('Locked');
  });
});
