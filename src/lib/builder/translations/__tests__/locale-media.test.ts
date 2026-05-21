import { describe, expect, it } from 'vitest';
import type {
  BuilderCanvasDocument,
  BuilderImageCanvasNode,
} from '@/lib/builder/canvas/types';
import {
  applyImageLocaleOverride,
  listImageNodesForLocaleEditor,
  projectImageNodeForLocale,
  resolveLocaleImageContent,
} from '@/lib/builder/translations/locale-media';

function makeImageNode(
  overrides?: Partial<BuilderImageCanvasNode>,
): BuilderImageCanvasNode {
  const node: BuilderImageCanvasNode = {
    id: 'img-1',
    kind: 'image',
    rect: { x: 0, y: 0, width: 200, height: 150 },
    style: {
      backgroundColor: 'transparent',
      borderColor: '#cbd5e1',
      borderStyle: 'solid',
      borderWidth: 0,
      borderRadius: 12,
      shadowX: 0,
      shadowY: 0,
      shadowBlur: 0,
      shadowSpread: 0,
      shadowColor: 'rgba(0,0,0,0.1)',
      opacity: 100,
    },
    zIndex: 0,
    rotation: 0,
    locked: false,
    visible: true,
    content: {
      src: '/images/source.jpg',
      alt: '소스 이미지',
      fit: 'cover',
    },
    ...overrides,
  };
  return node;
}

function makeCanvas(node: BuilderImageCanvasNode): BuilderCanvasDocument {
  return {
    version: 1,
    canvasId: 'canvas-1',
    pageId: 'page-1',
    locale: 'ko',
    stageWidth: 1280,
    stageHeight: 720,
    nodes: [node],
    createdAt: '2026-05-20T00:00:00.000Z',
    updatedAt: '2026-05-20T00:00:00.000Z',
  } as unknown as BuilderCanvasDocument;
}

describe('resolveLocaleImageContent', () => {
  it('falls back to source content when no overrides exist', () => {
    const node = makeImageNode();
    expect(resolveLocaleImageContent(node, 'en')).toEqual({
      src: '/images/source.jpg',
      alt: '소스 이미지',
    });
  });

  it('honours per-locale src/alt overrides field-by-field', () => {
    const node = makeImageNode({
      content: {
        ...makeImageNode().content,
        srcByLocale: { en: '/images/en.jpg' },
        altByLocale: { en: 'English alt' },
      } as never,
    });
    expect(resolveLocaleImageContent(node, 'en')).toEqual({
      src: '/images/en.jpg',
      alt: 'English alt',
    });
  });

  it('falls back per-field — only-src override does not steal alt', () => {
    const node = makeImageNode({
      content: {
        ...makeImageNode().content,
        srcByLocale: { 'zh-hant': '/images/zh.jpg' },
      } as never,
    });
    const resolved = resolveLocaleImageContent(node, 'zh-hant');
    expect(resolved.src).toBe('/images/zh.jpg');
    expect(resolved.alt).toBe('소스 이미지');
  });

  it('ignores empty-string overrides', () => {
    const node = makeImageNode({
      content: {
        ...makeImageNode().content,
        srcByLocale: { en: '' },
      } as never,
    });
    expect(resolveLocaleImageContent(node, 'en').src).toBe('/images/source.jpg');
  });
});

describe('projectImageNodeForLocale', () => {
  it('returns a new node with the locale src/alt applied', () => {
    const node = makeImageNode({
      content: {
        ...makeImageNode().content,
        srcByLocale: { en: '/images/en.jpg' },
      } as never,
    });
    const projected = projectImageNodeForLocale(node, 'en');
    expect(projected).not.toBe(node);
    expect((projected.content as { src: string }).src).toBe('/images/en.jpg');
  });

  it('returns the same reference when nothing changes', () => {
    const node = makeImageNode();
    expect(projectImageNodeForLocale(node, 'en')).toBe(node);
  });

  it('passes non-image nodes through unchanged', () => {
    const textNode = {
      ...makeImageNode(),
      kind: 'text',
    } as unknown as BuilderImageCanvasNode;
    expect(projectImageNodeForLocale(textNode, 'en')).toBe(textNode);
  });
});

describe('applyImageLocaleOverride', () => {
  it('writes a new src override and preserves untouched fields', () => {
    const canvas = makeCanvas(makeImageNode());
    const next = applyImageLocaleOverride(canvas, 'img-1', 'en', {
      src: '/images/en.jpg',
    });
    const node = next.nodes[0] as BuilderImageCanvasNode;
    const bag = node.content as unknown as {
      srcByLocale?: Record<string, string>;
      altByLocale?: Record<string, string>;
    };
    expect(bag.srcByLocale?.en).toBe('/images/en.jpg');
    expect(bag.altByLocale).toBeUndefined();
  });

  it('empty-string override clears that locale slot', () => {
    const canvas = makeCanvas(
      makeImageNode({
        content: {
          ...makeImageNode().content,
          srcByLocale: { en: '/images/en.jpg', 'zh-hant': '/images/zh.jpg' },
        } as never,
      }),
    );
    const next = applyImageLocaleOverride(canvas, 'img-1', 'en', { src: '' });
    const bag = (next.nodes[0] as BuilderImageCanvasNode).content as unknown as {
      srcByLocale?: Record<string, string>;
    };
    expect(bag.srcByLocale?.en).toBeUndefined();
    expect(bag.srcByLocale?.['zh-hant']).toBe('/images/zh.jpg');
  });

  it('returns the same canvas when the nodeId is unknown', () => {
    const canvas = makeCanvas(makeImageNode());
    expect(applyImageLocaleOverride(canvas, 'nope', 'en', { src: 'x' })).toBe(canvas);
  });
});

describe('listImageNodesForLocaleEditor', () => {
  it('returns image nodes with their per-locale bags', () => {
    const canvas = makeCanvas(
      makeImageNode({
        content: {
          ...makeImageNode().content,
          srcByLocale: { en: '/images/en.jpg' },
        } as never,
      }),
    );
    const rows = listImageNodesForLocaleEditor(canvas);
    expect(rows).toHaveLength(1);
    expect(rows[0]?.nodeId).toBe('img-1');
    expect(rows[0]?.byLocale.src.en).toBe('/images/en.jpg');
    expect(rows[0]?.byLocale.alt).toEqual({});
  });
});