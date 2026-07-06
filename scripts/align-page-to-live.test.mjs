// align-page-to-live.test.mjs — 순수 함수 단위 테스트 (node:test)
// 실행: node --test scripts/align-page-to-live.test.mjs

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeRectPatch,
  extractNodeText,
  matchNode,
  findMatchingNodes,
  applyTargetToNode,
  alignDocument,
} from './align-page-to-live.mjs';

function textNode(overrides = {}) {
  return {
    id: 'n1',
    kind: 'text',
    rect: { x: 10, y: 20, width: 100, height: 40 },
    style: {
      backgroundColor: 'transparent',
      borderColor: '#cbd5e1',
      borderStyle: 'solid',
      borderWidth: 0,
      borderRadius: 14,
      shadowX: 0,
      shadowY: 0,
      shadowBlur: 0,
      shadowSpread: 0,
      shadowColor: 'rgba(15, 23, 42, 0.16)',
      opacity: 100,
    },
    zIndex: 0,
    rotation: 0,
    locked: false,
    visible: true,
    content: { text: '상담 예약', fontSize: 16, color: '#0f172a', align: 'center' },
    ...overrides,
  };
}

function containerNode(overrides = {}) {
  return textNode({
    id: 'home-hero-root',
    kind: 'container',
    rect: { x: 0, y: 0, width: 1280, height: 820 },
    content: {
      label: 'home hero root',
      layoutMode: 'absolute',
      padding: 0,
      className: 'hero',
      htmlId: 'hero',
    },
    ...overrides,
  });
}

test('normalizeRectPatch: w/h -> width/height, drops invalid', () => {
  assert.deepEqual(normalizeRectPatch({ x: 1, y: 2, w: 3, h: 4 }), {
    x: 1,
    y: 2,
    width: 3,
    height: 4,
  });
  assert.deepEqual(normalizeRectPatch({ width: 5, height: 6 }), { width: 5, height: 6 });
  // null/undefined values skipped; non-number x skipped
  assert.deepEqual(normalizeRectPatch({ x: null, y: undefined, w: 'a' }), {});
  assert.equal(normalizeRectPatch(null), null);
});

test('extractNodeText: 여러 content 필드를 공백 결합', () => {
  assert.equal(extractNodeText(containerNode()), 'home hero root');
  assert.equal(extractNodeText(textNode()), '상담 예약');
  assert.equal(extractNodeText({ content: {} }), '');
  assert.equal(extractNodeText({}), '');
});

test('matchNode: id regex / kind exact / text substring (AND)', () => {
  const n = textNode({ id: 'cta-booking-1', kind: 'button' });
  assert.ok(matchNode(n, { id: '^cta-' }));
  assert.ok(matchNode(n, { kind: 'button' }));
  assert.ok(matchNode(n, { text: '상담' }));
  assert.ok(matchNode(n, { id: 'cta', kind: 'button', text: '예약' }));
  assert.equal(matchNode(n, { id: 'nope' }), false);
  assert.equal(matchNode(n, { kind: 'text' }), false);
  assert.equal(matchNode(n, { text: '없는문자' }), false);
  // id 값이 정규식으로 깨지면 리터럴 비교로 폴백
  assert.ok(matchNode(textNode({ id: 'a.b.c' }), { id: 'a.b.c' }));
});

test('matchNode: className / htmlId substring', () => {
  const n = containerNode();
  assert.ok(matchNode(n, { className: 'her' }));
  assert.ok(matchNode(n, { htmlId: 'ero' }));
  assert.equal(matchNode(n, { className: 'xyz' }), false);
});

test('findMatchingNodes: 모든 일치 노드 반환', () => {
  const nodes = [textNode({ id: 'a' }), textNode({ id: 'b' }), containerNode({ id: 'c' })];
  assert.equal(findMatchingNodes(nodes, { kind: 'text' }).length, 2);
  assert.equal(findMatchingNodes(nodes, { id: '^[ab]$' }).length, 2);
  assert.equal(findMatchingNodes(nodes, { kind: 'image' }).length, 0);
});

test('applyTargetToNode: rect/style/content 병합 + 변경/스킵 기록', () => {
  const n = containerNode();
  const { node, changes, skipped } = applyTargetToNode(n, {
    rect: { x: 5, w: 1300 },
    style: { backgroundColor: '#000', opacity: 80 },
    content: { padding: 24, layoutMode: 'flex' },
  });
  assert.equal(node.rect.x, 5);
  assert.equal(node.rect.width, 1300);
  assert.equal(node.rect.y, 0);
  assert.equal(node.style.backgroundColor, '#000');
  assert.equal(node.style.opacity, 80);
  assert.equal(node.content.padding, 24);
  assert.equal(node.content.layoutMode, 'flex');
  assert.equal(node.content.label, 'home hero root'); // 미지정 필드 보존
  const paths = changes.map((c) => c.path).sort();
  assert.deepEqual(paths, [
    'content.layoutMode',
    'content.padding',
    'rect.width',
    'rect.x',
    'style.backgroundColor',
    'style.opacity',
  ].sort());
  assert.equal(skipped.length, 0);
  // 원본 불변
  assert.equal(n.rect.width, 1280);
});

test('applyTargetToNode: 알 수 없는 style/content 키는 스킵 + 경고', () => {
  const n = textNode();
  const { node, skipped } = applyTargetToNode(n, {
    style: { notAStyle: 1 },
    content: { totallyUnknown: 2 },
  });
  const keys = skipped.map((s) => s.key).sort();
  assert.deepEqual(keys, ['content.totallyUnknown', 'style.notAStyle']);
  assert.equal(skipped.every((s) => /unknown/.test(s.reason)), true);
  assert.equal(node.style.notAStyle, undefined);
});

test('applyTargetToNode: 같은 값이면 changes 에 기록하지 않음', () => {
  const n = containerNode();
  const { changes } = applyTargetToNode(n, { rect: { x: 0 }, content: { padding: 0 } });
  assert.equal(changes.length, 0);
});

test('alignDocument: 문서 불변 + 매칭 없음 항목은 미수정 + 요약', () => {
  const doc = {
    version: 1,
    locale: 'ko',
    updatedAt: '2026-01-01T00:00:00Z',
    updatedBy: 'tester',
    stageWidth: 1280,
    stageHeight: 880,
    nodes: [containerNode({ id: 'home-hero-root' }), textNode({ id: 'cta-1' })],
  };
  const items = [
    { match: { id: 'home-hero-root' }, target: { rect: { w: 1400 }, content: { padding: 40 } } },
    { match: { id: 'does-not-exist' }, target: { rect: { x: 999 } } },
  ];
  const { document: aligned, results } = alignDocument(doc, items);
  assert.equal(doc.nodes[0].rect.width, 1280); // 원본 불변
  assert.equal(aligned.nodes[0].rect.width, 1400);
  assert.equal(aligned.nodes[0].content.padding, 40);
  assert.deepEqual(results[0].matchedIds, ['home-hero-root']);
  assert.deepEqual(results[1].matchedIds, []);
  assert.equal(results[1].changes.length, 0);
  assert.equal(aligned.updatedBy, 'align-page-to-live');
});

test('alignDocument: 같은 kind 의 모든 노드에 일괄 적용', () => {
  const doc = {
    version: 1,
    locale: 'ko',
    updatedAt: 'x',
    updatedBy: 'x',
    stageWidth: 1280,
    stageHeight: 880,
    nodes: [textNode({ id: 't1' }), textNode({ id: 't2' })],
  };
  const { results } = alignDocument(doc, [
    { match: { kind: 'text' }, target: { content: { fontSize: 22 } } },
  ]);
  assert.equal(results[0].matchedIds.length, 2);
});
