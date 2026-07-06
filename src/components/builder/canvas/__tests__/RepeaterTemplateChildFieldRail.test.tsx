import React from 'react';
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { RepeaterTemplateChildFieldRail } from '../RepeaterTemplateChildFieldRail';
import { getRepeaterTemplateCopy } from '../repeater-template-copy';

const noop = () => undefined;

describe('RepeaterTemplateChildFieldRail', () => {
  it('renders grouped active descendants as selectable field chips', () => {
    const markup = renderToStaticMarkup(
      <RepeaterTemplateChildFieldRail
        activeSiblingNodeIds={['template-title']}
        copy={getRepeaterTemplateCopy('en').childBadge}
        currentNodeId="group-template-fields"
        siblingBindings={[
          {
            nodeId: 'template-title',
            kindLabel: 'Text',
            fieldId: 'title',
            extraCount: 0,
            previewValue: 'Case update',
          },
          {
            nodeId: 'template-button',
            kindLabel: 'Button',
            fieldId: 'readTime',
            extraCount: 0,
            locked: true,
          },
        ]}
        onSelectSibling={noop}
      />,
    );

    expect(markup).toContain('data-builder-repeater-template-child-field-rail="true"');
    expect(markup).toContain('data-builder-repeater-template-child-field-active="true"');
    expect(markup).toContain('data-builder-repeater-template-child-field-preview-value="Case update"');
    expect(markup).toContain('data-builder-repeater-template-child-field-locked="true"');
    expect(markup).not.toContain('disabled=""');
  });
});
