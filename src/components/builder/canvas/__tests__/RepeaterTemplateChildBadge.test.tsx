import React from 'react';
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { RepeaterTemplateChildBadge } from '../RepeaterTemplateChildBadge';
import { getRepeaterTemplateCopy } from '../repeater-template-copy';

const noop = () => undefined;

describe('RepeaterTemplateChildBadge', () => {
  it('renders the selected child badge as a parent repeater selector', () => {
    const markup = renderToStaticMarkup(
      <RepeaterTemplateChildBadge
        copy={getRepeaterTemplateCopy('en').childBadge}
        parentNodeId="repeater-parent"
        recordNumber={2}
        onSelectParent={noop}
      />,
    );

    expect(markup).toContain('data-builder-repeater-template-child-badge="true"');
    expect(markup).toContain('data-builder-repeater-template-parent-id="repeater-parent"');
    expect(markup).toContain('aria-label="Select parent repeater for Record 2"');
    expect(markup).toContain('Template child');
    expect(markup).toContain('Record 2');
  });

  it('renders sibling field chips for jumping between bound template children', () => {
    const markup = renderToStaticMarkup(
      <RepeaterTemplateChildBadge
        copy={getRepeaterTemplateCopy('en').childBadge}
        currentNodeId="template-title"
        parentNodeId="repeater-parent"
        recordNumber={1}
        siblingBindings={[
          {
            nodeId: 'template-image',
            kindLabel: 'Image',
            fieldId: 'featuredImage',
            extraCount: 1,
          },
          {
            nodeId: 'template-title',
            kindLabel: 'Text',
            fieldId: 'title',
            extraCount: 0,
          },
        ]}
        onSelectParent={noop}
        onSelectSibling={noop}
      />,
    );

    expect(markup).toContain('data-builder-repeater-template-child-field-rail="true"');
    expect(markup).toContain('data-builder-repeater-template-child-field-node-id="template-image"');
    expect(markup).toContain('data-builder-repeater-template-child-field-node-id="template-title"');
    expect(markup).toContain('data-builder-repeater-template-child-field-active="true"');
    expect(markup).toContain('featuredImage +1');
  });

  it('marks locked sibling field chips without hiding their binding target', () => {
    const markup = renderToStaticMarkup(
      <RepeaterTemplateChildBadge
        copy={getRepeaterTemplateCopy('en').childBadge}
        currentNodeId="template-title"
        parentNodeId="repeater-parent"
        recordNumber={1}
        siblingBindings={[
          {
            nodeId: 'template-image',
            kindLabel: 'Image',
            fieldId: 'featuredImage',
            extraCount: 1,
            locked: true,
          },
          {
            nodeId: 'template-title',
            kindLabel: 'Text',
            fieldId: 'title',
            extraCount: 0,
          },
        ]}
        onSelectParent={noop}
        onSelectSibling={noop}
      />,
    );

    expect(markup).toContain('data-builder-repeater-template-child-field-locked="true"');
    expect(markup).toContain('featuredImage +1');
    expect(markup).toContain('Locked');
  });

  it('shows active record preview values on sibling field chips', () => {
    const markup = renderToStaticMarkup(
      <RepeaterTemplateChildBadge
        copy={getRepeaterTemplateCopy('en').childBadge}
        currentNodeId="template-title"
        parentNodeId="repeater-parent"
        recordNumber={2}
        siblingBindings={[
          {
            nodeId: 'template-title',
            kindLabel: 'Text',
            fieldId: 'title',
            extraCount: 0,
            previewValue: 'Second title',
          },
          {
            nodeId: 'template-button',
            kindLabel: 'Button',
            fieldId: 'readTime',
            extraCount: 0,
            previewValue: '7 min',
          },
        ]}
        onSelectParent={noop}
        onSelectSibling={noop}
      />,
    );

    expect(markup).toContain('data-builder-repeater-template-child-field-preview="true"');
    expect(markup).toContain('data-builder-repeater-template-child-field-preview-value="Second title"');
    expect(markup).toContain('Preview: Second title');
  });

  it('renders a lock toggle for the selected template child', () => {
    const markup = renderToStaticMarkup(
      <RepeaterTemplateChildBadge
        copy={getRepeaterTemplateCopy('en').childBadge}
        currentNodeId="template-title"
        locked={false}
        parentNodeId="repeater-parent"
        recordNumber={1}
        onSelectParent={noop}
        onToggleLock={noop}
      />,
    );

    expect(markup).toContain('data-builder-repeater-template-child-lock-toggle="true"');
    expect(markup).toContain('data-builder-repeater-template-child-lock-state="unlocked"');
    expect(markup).toContain('aria-label="Lock template child for Record 1"');
    expect(markup).toContain('Lock');
  });

  it('renders an unlock toggle when the selected template child is locked', () => {
    const markup = renderToStaticMarkup(
      <RepeaterTemplateChildBadge
        copy={getRepeaterTemplateCopy('en').childBadge}
        currentNodeId="template-title"
        locked
        parentNodeId="repeater-parent"
        recordNumber={2}
        onSelectParent={noop}
        onToggleLock={noop}
      />,
    );

    expect(markup).toContain('data-builder-repeater-template-child-lock-state="locked"');
    expect(markup).toContain('aria-label="Unlock template child for Record 2"');
    expect(markup).toContain('Unlock');
  });

  it('renders a group action for unlocked sibling template children', () => {
    const markup = renderToStaticMarkup(
      <RepeaterTemplateChildBadge
        copy={getRepeaterTemplateCopy('en').childBadge}
        currentNodeId="template-title"
        groupableSiblingCount={2}
        parentNodeId="repeater-parent"
        recordNumber={1}
        siblingBindings={[
          {
            nodeId: 'template-image',
            kindLabel: 'Image',
            fieldId: 'featuredImage',
            extraCount: 1,
            locked: true,
          },
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
        onGroupSiblings={noop}
        onSelectParent={noop}
        onSelectSibling={noop}
      />,
    );

    expect(markup).toContain('data-builder-repeater-template-child-group-siblings="true"');
    expect(markup).toContain('data-builder-repeater-template-child-group-count="2"');
    expect(markup).toContain('aria-label="Group 2 unlocked template children for Record 1"');
    expect(markup).toContain('Group fields');
  });

  it('marks every bound descendant in the selected group as an active field chip', () => {
    const markup = renderToStaticMarkup(
      <RepeaterTemplateChildBadge
        copy={getRepeaterTemplateCopy('en').childBadge}
        currentNodeId="template-group"
        activeSiblingNodeIds={['template-title', 'template-button']}
        parentNodeId="repeater-parent"
        recordNumber={2}
        siblingBindings={[
          {
            nodeId: 'template-image',
            kindLabel: 'Image',
            fieldId: 'featuredImage',
            extraCount: 1,
            locked: true,
          },
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

    const activeMatches = markup.match(/data-builder-repeater-template-child-field-active="true"/g) ?? [];
    expect(activeMatches).toHaveLength(2);
    expect(markup).toContain('data-builder-repeater-template-child-field-node-id="template-title"');
    expect(markup).toContain('data-builder-repeater-template-child-field-node-id="template-button"');
  });
});
