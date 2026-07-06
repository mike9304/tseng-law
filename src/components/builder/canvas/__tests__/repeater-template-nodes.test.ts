import { describe, expect, it } from 'vitest';
import {
  createRepeaterTemplateDuplicateNode,
  createRepeaterTemplateGalleryNode,
  resolveRepeaterTemplateBindingSummary,
} from '../repeater-template-nodes';
import {
  builderCanvasNodeSchema,
  type BuilderContainerCanvasNode,
  type BuilderTextCanvasNode,
} from '@/lib/builder/canvas/types';

describe('repeater template node factories', () => {
  it('creates a gallery child bound to image, caption, and alt CMS fields', () => {
    const parentNode = makeRepeaterNode();
    const galleryNode = createRepeaterTemplateGalleryNode({
      childNodes: [makeTemplateTextChild()],
      locale: 'ko',
      parentNode,
      targetId: 'home.insights.feed',
      zIndex: 8,
    });

    expect(galleryNode.kind).toBe('gallery');
    expect(galleryNode.parentId).toBe(parentNode.id);
    expect(galleryNode.rect.y).toBe(76);
    expect(galleryNode.content.layout).toBe('grid');
    expect(galleryNode.content.columns).toBe(2);
    expect(galleryNode.content.showCaptions).toBe(true);
    expect(galleryNode.content.captionMode).toBe('overlay');
    expect(galleryNode.content.images[0]).toMatchObject({
      src: '/images/placeholder-image.svg',
      alt: 'Bound gallery',
      caption: 'Bound gallery',
    });
    expect(galleryNode.dataBinding).toEqual({
      targetId: 'home.insights.feed',
      recordIndex: 0,
      fields: {
        src: 'featuredImage',
        caption: 'categoryLabel',
        alt: 'title',
      },
    });
  });

  it('summarizes gallery bindings as first-class repeater template fields', () => {
    const galleryNode = createRepeaterTemplateGalleryNode({
      childNodes: [],
      locale: 'en',
      parentNode: makeRepeaterNode(),
      targetId: 'home.insights.feed',
      zIndex: 2,
    });

    expect(resolveRepeaterTemplateBindingSummary([galleryNode], 'home.insights.feed')).toEqual([
      {
        nodeId: galleryNode.id,
        kindLabel: 'Gallery',
        fieldId: 'featuredImage',
        extraCount: 2,
      },
    ]);
  });

  it('duplicates an existing bound child as a reusable repeater template node', () => {
    const parentNode = makeRepeaterNode();
    const sourceNode = makeTemplateTextChild();
    const duplicateNode = createRepeaterTemplateDuplicateNode({
      childNodes: [sourceNode],
      parentNode,
      sourceNode,
      zIndex: 11,
    });

    expect(duplicateNode.kind).toBe('text');
    expect(duplicateNode.id).not.toBe(sourceNode.id);
    expect(duplicateNode.parentId).toBe(parentNode.id);
    expect(duplicateNode.rect).toEqual({
      ...sourceNode.rect,
      y: 76,
    });
    expect(duplicateNode.zIndex).toBe(11);
    expect(duplicateNode.locked).toBe(false);
    expect(duplicateNode.dataBinding).toEqual(sourceNode.dataBinding);
    expect(duplicateNode.content).toEqual(sourceNode.content);

    if (duplicateNode.kind !== 'text') {
      throw new Error('Expected duplicate fixture to be a text node.');
    }
    duplicateNode.content.text = 'Changed duplicate';
    expect(sourceNode.content.text).toBe('Title');
  });
});

function makeRepeaterNode(): BuilderContainerCanvasNode {
  const parsed = builderCanvasNodeSchema.parse({
    id: 'repeater-template',
    kind: 'container',
    rect: { x: 0, y: 0, width: 320, height: 360 },
    zIndex: 1,
    content: {
      label: 'Repeater',
      background: '#ffffff',
      borderColor: '#e5e7eb',
      borderStyle: 'solid',
      borderWidth: 1,
      borderRadius: 16,
      padding: 20,
      layoutMode: 'repeater',
      layoutItems: [],
    },
    dataBinding: {
      targetId: 'home.insights.feed',
      recordIndex: 0,
      fields: { title: 'title', src: 'featuredImage' },
    },
  });
  if (parsed.kind !== 'container') {
    throw new Error('Expected parsed repeater fixture to be a container node.');
  }
  return parsed;
}

function makeTemplateTextChild(): BuilderTextCanvasNode {
  const parsed = builderCanvasNodeSchema.parse({
    id: 'template-title',
    kind: 'text',
    parentId: 'repeater-template',
    rect: { x: 0, y: 0, width: 220, height: 64 },
    zIndex: 2,
    content: {
      text: 'Title',
      fontSize: 18,
      color: '#0f172a',
      fontWeight: 'bold',
      align: 'left',
      lineHeight: 1.25,
      letterSpacing: 0,
    },
    dataBinding: {
      targetId: 'home.insights.feed',
      recordIndex: 0,
      fields: { text: 'title' },
    },
  });
  if (parsed.kind !== 'text') {
    throw new Error('Expected parsed template fixture to be a text node.');
  }
  return parsed;
}
