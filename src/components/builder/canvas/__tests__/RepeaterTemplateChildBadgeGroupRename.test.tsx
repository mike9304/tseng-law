import React from 'react';
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { RepeaterTemplateChildBadge } from '../RepeaterTemplateChildBadge';
import { getRepeaterTemplateCopy } from '../repeater-template-copy';

const noop = () => undefined;

describe('RepeaterTemplateChildBadge group rename action', () => {
  it('renders an editable name field for selected template field groups', () => {
    const markup = renderToStaticMarkup(
      <RepeaterTemplateChildBadge
        copy={getRepeaterTemplateCopy('en').childBadge}
        currentNodeId="group-template-fields"
        groupName="Case meta group"
        parentNodeId="repeater-parent"
        recordNumber={2}
        onRenameGroup={noop}
        onSelectParent={noop}
      />,
    );

    expect(markup).toContain('data-builder-repeater-template-child-group-name="true"');
    expect(markup).toContain('aria-label="Rename template field group for Record 2"');
    expect(markup).toContain('placeholder="Group name"');
    expect(markup).toContain('value="Case meta group"');
  });
});
