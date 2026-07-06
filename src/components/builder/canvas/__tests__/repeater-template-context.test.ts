import { describe, expect, it } from 'vitest';
import {
  builderCanvasNodeSchema,
  type BuilderCanvasNode,
} from '@/lib/builder/canvas/types';
import {
  collectRepeaterTemplateBindingNodes,
  findRepeaterTemplateParentNode,
  resolveRepeaterTemplateActiveNodeIds,
} from '../repeater-template-context';

describe('repeater template context helpers', () => {
  it('keeps grouped bound descendants visible to repeater field summaries', () => {
    const repeater = parseNode({
      id: 'repeater',
      kind: 'container',
      rect: { x: 0, y: 0, width: 360, height: 420 },
      content: {
        label: 'Repeater',
        background: '#ffffff',
        borderColor: '#e2e8f0',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 16,
        padding: 20,
        layoutMode: 'repeater',
      },
      dataBinding: {
        targetId: 'home.insights.feed',
        recordIndex: 0,
        fields: { title: 'title' },
      },
    });
    const group = parseNode({
      id: 'template-group',
      kind: 'container',
      parentId: repeater.id,
      rect: { x: 0, y: 132, width: 240, height: 132 },
      content: {
        label: 'Group',
        background: 'transparent',
        borderColor: 'transparent',
        borderStyle: 'solid',
        borderWidth: 0,
        borderRadius: 0,
        padding: 0,
        layoutMode: 'absolute',
      },
    });
    const image = parseNode({
      id: 'template-image',
      kind: 'image',
      parentId: repeater.id,
      rect: { x: 0, y: 0, width: 220, height: 124 },
      content: {
        src: '/images/placeholder-image.svg',
        alt: 'Template image',
        fit: 'cover',
        link: null,
      },
      dataBinding: {
        targetId: 'home.insights.feed',
        recordIndex: 0,
        fields: { src: 'featuredImage', alt: 'title' },
      },
    });
    const title = parseNode({
      id: 'template-title',
      kind: 'text',
      parentId: group.id,
      rect: { x: 0, y: 0, width: 220, height: 70 },
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
        recordIndex: 0,
        fields: { text: 'title' },
      },
    });
    const button = parseNode({
      id: 'template-button',
      kind: 'button',
      parentId: group.id,
      rect: { x: 0, y: 88, width: 148, height: 44 },
      content: {
        label: 'Read more',
        href: '',
        style: 'primary-solid',
        link: null,
      },
      dataBinding: {
        targetId: 'home.insights.feed',
        recordIndex: 0,
        fields: { label: 'readTime', href: 'href' },
      },
    });
    const childrenByParentId = new Map<string, readonly BuilderCanvasNode[]>([
      [repeater.id, [image, group]],
      [group.id, [title, button]],
    ]);
    const nodesById = new Map([repeater, group, image, title, button].map((node) => [node.id, node]));

    expect(findRepeaterTemplateParentNode(button, nodesById, childrenByParentId)?.id).toBe(repeater.id);
    expect(findRepeaterTemplateParentNode(group, nodesById, childrenByParentId)?.id).toBe(repeater.id);
    expect(collectRepeaterTemplateBindingNodes([image, group], childrenByParentId).map((node) => node.id)).toEqual([
      'template-image',
      'template-title',
      'template-button',
    ]);
    expect(resolveRepeaterTemplateActiveNodeIds(
      group,
      'home.insights.feed',
      childrenByParentId,
    )).toEqual(['template-title', 'template-button']);
  });
});

function parseNode(input: {
  readonly content: unknown;
  readonly dataBinding?: unknown;
  readonly id: string;
  readonly kind: BuilderCanvasNode['kind'];
  readonly parentId?: string;
  readonly rect: BuilderCanvasNode['rect'];
}): BuilderCanvasNode {
  return builderCanvasNodeSchema.parse({
    id: input.id,
    kind: input.kind,
    parentId: input.parentId,
    rect: input.rect,
    style: {
      backgroundColor: 'transparent',
      borderColor: '#cbd5e1',
      borderStyle: 'solid',
      borderWidth: 0,
      borderRadius: 0,
      shadowX: 0,
      shadowY: 0,
      shadowBlur: 0,
      shadowSpread: 0,
      shadowColor: 'rgba(15, 23, 42, 0.16)',
      opacity: 100,
    },
    zIndex: 1,
    rotation: 0,
    locked: false,
    visible: true,
    content: input.content,
    dataBinding: input.dataBinding,
  });
}
