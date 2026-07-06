import { describe, expect, it } from 'vitest';
import type {
  BuilderCanvasNode,
  BuilderCanvasDocument,
  BuilderImageCanvasNode,
} from '@/lib/builder/canvas/types';
import { normalizeCanvasDocument } from '@/lib/builder/canvas/types';
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

function makeTextNode(): BuilderCanvasNode {
  return {
    id: 'text-1',
    kind: 'text',
    rect: { x: 0, y: 0, width: 200, height: 80 },
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
      text: '본문',
      fontSize: 16,
      color: '#111827',
      fontWeight: 'regular',
      align: 'left',
      lineHeight: 1.25,
      letterSpacing: 0,
    },
  };
}

function makeCanvas(node: BuilderCanvasNode): BuilderCanvasDocument {
  return {
    version: 1,
    locale: 'ko',
    updatedAt: '2026-05-20T00:00:00.000Z',
    updatedBy: 'locale-media-test',
    stageWidth: 1280,
    stageHeight: 720,
    nodes: [node],
  };
}

function expectImageNode(canvas: BuilderCanvasDocument): BuilderImageCanvasNode {
  const node = canvas.nodes.find(
    (candidate): candidate is BuilderImageCanvasNode => candidate.kind === 'image',
  );
  expect(node).toBeTruthy();
  if (!node) throw new Error('Expected image node.');
  return node;
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
      },
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
      },
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
      },
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
      },
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
    const textNode = makeTextNode();
    expect(projectImageNodeForLocale(textNode, 'en')).toBe(textNode);
  });
});

describe('normalizeCanvasDocument locale image fields', () => {
  it('preserves locale image override bags for published render projection', () => {
    const normalized = normalizeCanvasDocument(
      makeCanvas(
        makeImageNode({
          content: {
            ...makeImageNode().content,
            srcByLocale: { en: '/images/en.jpg' },
            altByLocale: { en: 'English alt' },
          },
        }),
      ),
      'en',
    );
    const node = expectImageNode(normalized);

    expect(resolveLocaleImageContent(node, 'en')).toEqual({
      src: '/images/en.jpg',
      alt: 'English alt',
    });
  });
});

describe('applyImageLocaleOverride', () => {
  it('writes a new src override and preserves untouched fields', () => {
    const canvas = makeCanvas(makeImageNode());
    const next = applyImageLocaleOverride(canvas, 'img-1', 'en', {
      src: '/images/en.jpg',
    });
    const node = expectImageNode(next);
    expect(node.content.srcByLocale?.en).toBe('/images/en.jpg');
    expect(node.content.altByLocale).toBeUndefined();
  });

  it('empty-string override clears that locale slot', () => {
    const canvas = makeCanvas(
      makeImageNode({
        content: {
          ...makeImageNode().content,
          srcByLocale: { en: '/images/en.jpg', 'zh-hant': '/images/zh.jpg' },
        },
      }),
    );
    const next = applyImageLocaleOverride(canvas, 'img-1', 'en', { src: '' });
    const node = expectImageNode(next);
    expect(node.content.srcByLocale?.en).toBeUndefined();
    expect(node.content.srcByLocale?.['zh-hant']).toBe('/images/zh.jpg');
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
        },
      }),
    );
    const rows = listImageNodesForLocaleEditor(canvas);
    expect(rows).toHaveLength(1);
    expect(rows[0]?.nodeId).toBe('img-1');
    expect(rows[0]?.byLocale.src.en).toBe('/images/en.jpg');
    expect(rows[0]?.byLocale.alt).toEqual({});
  });
});
