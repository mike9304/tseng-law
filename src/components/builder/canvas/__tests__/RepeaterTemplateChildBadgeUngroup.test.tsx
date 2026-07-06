import React from 'react';
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { RepeaterTemplateChildBadge } from '../RepeaterTemplateChildBadge';
import { getRepeaterTemplateCopy } from '../repeater-template-copy';

const noop = () => undefined;

describe('RepeaterTemplateChildBadge ungroup action', () => {
  it('renders a direct ungroup action for selected template field groups', () => {
    const markup = renderToStaticMarkup(
      <RepeaterTemplateChildBadge
        copy={getRepeaterTemplateCopy('en').childBadge}
        currentNodeId="group-template-fields"
        parentNodeId="repeater-parent"
        recordNumber={2}
        onSelectParent={noop}
        onUngroup={noop}
      />,
    );

    expect(markup).toContain('data-builder-repeater-template-child-ungroup="true"');
    expect(markup).toContain('aria-label="Ungroup template children for Record 2"');
    expect(markup).toContain('Ungroup');
  });
});
