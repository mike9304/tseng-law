import React from 'react';
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { RepeaterTemplateChildBadge } from '../RepeaterTemplateChildBadge';
import { getRepeaterTemplateCopy } from '../repeater-template-copy';

const noop = () => undefined;

describe('RepeaterTemplateChildBadge grouped field chip selection', () => {
  it('keeps active grouped descendant chips selectable', () => {
    const markup = renderToStaticMarkup(
      <RepeaterTemplateChildBadge
        activeSiblingNodeIds={['template-title']}
        copy={getRepeaterTemplateCopy('en').childBadge}
        currentNodeId="group-template-fields"
        parentNodeId="repeater-parent"
        recordNumber={1}
        siblingBindings={[
          {
            nodeId: 'template-title',
            kindLabel: 'Text',
            fieldId: 'title',
            extraCount: 0,
          },
          {
            nodeId: 'template-button',
            kindLabel: 'Button',
            fieldId: 'readTime',
            extraCount: 0,
          },
        ]}
        onSelectParent={noop}
        onSelectSibling={noop}
      />,
    );

    expect(markup).toContain('data-builder-repeater-template-child-field-active="true"');
    expect(markup).not.toContain('disabled=""');
  });
});
