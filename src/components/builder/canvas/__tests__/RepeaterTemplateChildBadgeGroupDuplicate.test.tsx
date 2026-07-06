import React from 'react';
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { RepeaterTemplateChildBadge } from '../RepeaterTemplateChildBadge';
import { getRepeaterTemplateCopy } from '../repeater-template-copy';

const noop = () => undefined;

describe('RepeaterTemplateChildBadge duplicate group action', () => {
  it('renders a direct duplicate action for selected template field groups', () => {
    const markup = renderToStaticMarkup(
      <RepeaterTemplateChildBadge
        copy={getRepeaterTemplateCopy('en').childBadge}
        currentNodeId="group-template-fields"
        parentNodeId="repeater-parent"
        recordNumber={2}
        onDuplicateGroup={noop}
        onSelectParent={noop}
      />,
    );

    expect(markup).toContain('data-builder-repeater-template-child-duplicate-group="true"');
    expect(markup).toContain('aria-label="Duplicate template field group for Record 2"');
    expect(markup).toContain('Duplicate group');
  });
});
