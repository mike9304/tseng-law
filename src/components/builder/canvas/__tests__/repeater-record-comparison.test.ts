import { describe, expect, it } from 'vitest';
import {
  buildRepeaterRecordComparisonModel,
} from '../repeater-record-comparison';
import {
  builderCanvasNodeSchema,
  type BuilderCanvasNode,
  type BuilderDataBindingFieldMap,
} from '@/lib/builder/canvas/types';
import type { BuilderDatasetSampleRecord } from '@/lib/builder/datasets';

const fieldLabels: Record<string, string> = {
  featuredImage: 'Featured image',
  href: 'Column link',
  readTime: 'Read time',
  title: 'Title',
};

const records: BuilderDatasetSampleRecord[] = [
  makeRecord('record-1', 'First title', '5 min', '/images/first.jpg'),
  makeRecord('record-2', 'Second title', '7 min', '/images/second.jpg'),
  makeRecord('record-3', 'Third title', '9 min', '/images/third.jpg'),
  makeRecord('record-4', 'Fourth title', '11 min', '/images/fourth.jpg'),
];

describe('buildRepeaterRecordComparisonModel', () => {
  it('compares the fields used by repeater child template bindings', () => {
    const model = buildRepeaterRecordComparisonModel({
      childNodes: [
        makeImageChild(),
        makeTextChild(),
        makeButtonChild(),
      ],
      containerFields: { title: 'title' },
      currentIndex: 1,
      emptyValue: 'Empty',
      records,
      resolveFieldLabel: (fieldId) => fieldLabels[fieldId] ?? null,
      targetId: 'home.insights.feed',
    });

    expect(model.fieldSummary).toBe('Featured image / Title / Read time +1');
    expect(model.rows.map((row) => row.index)).toEqual([0, 1, 2]);
    expect(model.rows[1]?.fields).toEqual([
      { fieldId: 'featuredImage', label: 'Featured image', value: '/images/second.jpg' },
      { fieldId: 'title', label: 'Title', value: 'Second title' },
      { fieldId: 'readTime', label: 'Read time', value: '7 min' },
      { fieldId: 'href', label: 'Column link', value: '/ko/columns/record-2' },
    ]);
  });

  it('falls back to the repeater container mapping when no child template fields are bound', () => {
    const model = buildRepeaterRecordComparisonModel({
      childNodes: [],
      containerFields: { title: 'title' },
      currentIndex: 0,
      emptyValue: 'Empty',
      records: records.slice(0, 2),
      resolveFieldLabel: (fieldId) => fieldLabels[fieldId] ?? null,
      targetId: 'home.insights.feed',
    });

    expect(model.fieldSummary).toBe('Title');
    expect(model.rows).toHaveLength(2);
    expect(model.rows[0]?.fields).toEqual([
      { fieldId: 'title', label: 'Title', value: 'First title' },
    ]);
  });
});

function makeRecord(
  recordId: string,
  title: string,
  readTime: string,
  featuredImage: string,
): BuilderDatasetSampleRecord {
  return {
    recordId,
    primaryLabel: title,
    secondaryLabel: readTime,
    routePath: `/ko/columns/${recordId}`,
    fieldValues: {
      featuredImage,
      href: `/ko/columns/${recordId}`,
      readTime,
      title,
    },
  };
}

function makeImageChild(): BuilderCanvasNode {
  return parseNode({
    id: 'image-child',
    kind: 'image',
    content: {
      src: '/images/placeholder-image.svg',
      alt: '',
      fit: 'cover',
      link: null,
    },
    dataBinding: {
      targetId: 'home.insights.feed',
      fields: { src: 'featuredImage', alt: 'title' },
    },
  });
}

function makeTextChild(): BuilderCanvasNode {
  return parseNode({
    id: 'text-child',
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
    dataBinding: {
      targetId: 'home.insights.feed',
      fields: { text: 'title' },
    },
  });
}

function makeButtonChild(): BuilderCanvasNode {
  return parseNode({
    id: 'button-child',
    kind: 'button',
    content: {
      label: 'Template link',
      href: '',
      style: 'primary-solid',
      link: null,
    },
    dataBinding: {
      targetId: 'home.insights.feed',
      fields: { label: 'readTime', href: 'href' },
    },
  });
}

function parseNode(node: {
  content: unknown;
  dataBinding: {
    fields: BuilderDataBindingFieldMap;
    targetId: 'home.insights.feed';
  };
  id: string;
  kind: BuilderCanvasNode['kind'];
}): BuilderCanvasNode {
  return builderCanvasNodeSchema.parse({
    id: node.id,
    kind: node.kind,
    rect: { x: 0, y: 0, width: 220, height: 120 },
    zIndex: 1,
    content: node.content,
    dataBinding: node.dataBinding,
  }) as BuilderCanvasNode;
}
