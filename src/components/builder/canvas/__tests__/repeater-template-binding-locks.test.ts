import { describe, expect, it } from 'vitest';
import {
  builderCanvasNodeSchema,
  type BuilderCanvasNode,
  type BuilderDataBindingFieldMap,
} from '@/lib/builder/canvas/types';
import type { BuilderDatasetSampleRecord } from '@/lib/builder/datasets';
import { resolveRepeaterTemplateBindingSummaryWithLocks } from '../repeater-template-binding-locks';

describe('resolveRepeaterTemplateBindingSummaryWithLocks', () => {
  it('attaches active record preview values to mapped child fields', () => {
    const [textChild, buttonChild] = [
      parseNode({
        id: 'template-title',
        kind: 'text',
        content: {
          text: 'Template title',
          fontSize: 18,
          color: '#0f172a',
          fontWeight: 'bold',
          align: 'left',
          lineHeight: 1.25,
          letterSpacing: 0,
        },
        fields: { text: 'title' },
      }),
      parseNode({
        id: 'template-button',
        kind: 'button',
        content: {
          label: 'Template link',
          href: '',
          style: 'primary-solid',
          link: null,
        },
        fields: { label: 'readTime' },
      }),
    ];

    const summary = resolveRepeaterTemplateBindingSummaryWithLocks(
      [textChild, buttonChild],
      'home.insights.feed',
      {
        emptyValue: 'Empty',
        previewRecord: makeRecord(),
      },
    );

    expect(summary).toEqual([
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
        previewValue: 'Empty',
      },
    ]);
  });
});

function parseNode(node: {
  readonly content: unknown;
  readonly fields: BuilderDataBindingFieldMap;
  readonly id: string;
  readonly kind: BuilderCanvasNode['kind'];
}): BuilderCanvasNode {
  return builderCanvasNodeSchema.parse({
    id: node.id,
    kind: node.kind,
    rect: { x: 0, y: 0, width: 220, height: 120 },
    zIndex: 1,
    content: node.content,
    dataBinding: {
      targetId: 'home.insights.feed',
      fields: node.fields,
    },
  });
}

function makeRecord(): BuilderDatasetSampleRecord {
  return {
    recordId: 'record-2',
    primaryLabel: 'Second title',
    secondaryLabel: 'Second summary',
    routePath: '/ko/columns/record-2',
    fieldValues: {
      title: 'Second title',
    },
  };
}
