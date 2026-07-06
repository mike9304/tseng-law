import { describe, expect, test } from 'vitest';
import type { BuilderCanvasDocument, BuilderCanvasNode } from '@/lib/builder/canvas/types';
import {
  computeDocumentDiff,
  formatDiffNodeKind,
  formatDocumentDiffSummary,
  summarizeDiffNode,
  summarizeDocumentDiff,
} from '../document-diff';
import { getDocumentDiffCopy } from '../document-diff-copy';

function textNode(id: string, text: string): BuilderCanvasNode {
  return {
    id,
    kind: 'text',
    rect: { x: 0, y: 0, width: 120, height: 48 },
    content: { text },
    visible: true,
    locked: false,
    zIndex: 1,
    rotation: 0,
    style: {},
  } as BuilderCanvasNode;
}

function documentWith(nodes: BuilderCanvasNode[]): BuilderCanvasDocument {
  return {
    version: 1,
    locale: 'ko',
    updatedAt: '2026-06-02T00:00:00.000Z',
    updatedBy: 'test',
    stageWidth: 1280,
    stageHeight: 880,
    nodes,
  };
}

describe('document diff copy', () => {
  test('formats zh-hant node summaries and change descriptions', () => {
    const copy = getDocumentDiffCopy('zh-hant');
    const current = documentWith([textNode('headline', '新標題')]);
    const revision = documentWith([textNode('headline', '舊標題')]);
    const diff = computeDocumentDiff(current, revision, copy);

    expect(summarizeDiffNode(current.nodes[0], copy)).toBe('文字 - "新標題"');
    expect(formatDiffNodeKind('button', copy)).toBe('按鈕');
    expect(diff.modified[0].changes).toContain('文字 "舊標題" -> "新標題"');
    expect(formatDocumentDiffSummary(summarizeDocumentDiff(diff), copy)).toBe('+0 / -0 / ~1');
  });

  test('formats ko loading, same, and fallback node summaries', () => {
    const copy = getDocumentDiffCopy('ko');
    const imageNode = {
      ...textNode('image-1', ''),
      kind: 'image',
      content: {},
    } as BuilderCanvasNode;

    expect(formatDocumentDiffSummary(undefined, copy)).toBe('차이 미리보기 준비 중');
    expect(formatDocumentDiffSummary({ added: 0, removed: 0, modified: 0 }, copy)).toBe('현재 초안과 동일');
    expect(summarizeDiffNode(imageNode, copy)).toBe('이미지 - (소스 없음)');
  });

  test('falls back to English copy for unknown locale', () => {
    const copy = getDocumentDiffCopy('fr');

    expect(copy.summaryLoading).toBe('Diff preview loading');
    expect(formatDiffNodeKind('heading', copy)).toBe('heading');
    expect(formatDocumentDiffSummary({ added: 1, removed: 2, modified: 3 }, copy)).toBe('+1 / -2 / ~3');
  });
});
