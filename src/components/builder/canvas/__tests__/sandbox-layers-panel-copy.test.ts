import { describe, expect, it } from 'vitest';
import { getSandboxLayersPanelCopy } from '../sandbox-layers-panel-copy';

describe('sandbox layers panel copy', () => {
  it('returns ko layers panel copy', () => {
    const copy = getSandboxLayersPanelCopy('ko');
    expect(copy.title).toBe('레이어');
    expect(copy.nodeCountLabel(2)).toBe('2개 노드');
    expect(copy.collapseTitle).toBe('레이어 패널 접기');
    expect(copy.emptyLabel).toContain('카탈로그');
    expect(copy.dropHintLabel).toContain('컨테이너');
    expect(copy.kindLabels.heading).toBe('제목');
    expect(copy.search.placeholder).toBe('노드 검색...');
    expect(copy.search.resultCountLabel(3)).toBe('3개 결과');
    expect(copy.search.clearAriaLabel).toBe('레이어 검색 지우기');
    expect(copy.row.hideNodeLabel).toBe('캔버스에서 숨기기');
    expect(copy.row.childCountLabel(3)).toBe('3개 하위');
    expect(copy.row.moreActionsLabel).toBe('레이어 더보기');
    expect(copy.row.semanticLabels.sections.contact).toBe('연락');
    expect(copy.row.semanticLabels.roles.root).toBe('섹션');
  });

  it('returns zh-hant layers panel copy without Hangul', () => {
    const copy = getSandboxLayersPanelCopy('zh-hant');
    expect(copy.title).toBe('圖層');
    expect(copy.nodeCountLabel(2)).toBe('2 個節點');
    expect(copy.kindLabels['video-embed']).toBe('影片');
    expect(copy.search.hintLabel).toBe('id / 類型 / 文字');
    expect([
      copy.title,
      copy.nodeCountLabel(1),
      copy.collapseTitle,
      copy.expandTitle,
      copy.hideLabel,
      copy.showLabel,
      copy.emptyLabel,
      copy.dropHintLabel,
      Object.values(copy.kindLabels).join(' '),
      copy.search.placeholder,
      copy.search.ariaLabel,
      copy.search.resultCountLabel(4),
      copy.search.hintLabel,
      copy.search.clearAriaLabel,
      copy.row.collapseLabel,
      copy.row.expandLabel,
      copy.row.noChildrenLabel,
      copy.row.dragHandleLabel,
      copy.row.primaryLabel,
      copy.row.zIndexLabel(7),
      copy.row.childCountLabel(2),
      copy.row.hideNodeLabel,
      copy.row.showNodeLabel,
      copy.row.lockNodeLabel,
      copy.row.unlockNodeLabel,
      copy.row.moreActionsLabel,
      Object.values(copy.row.semanticLabels.sections).join(' '),
      Object.values(copy.row.semanticLabels.roles).join(' '),
    ].join(' ')).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/);
  });

  it('returns en layers panel copy without CJK', () => {
    const copy = getSandboxLayersPanelCopy('en');
    const cjk = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/;
    expect(copy.title).toBe('Layers');
    expect(copy.nodeCountLabel(2)).toBe('2 nodes');
    expect(copy.kindLabels.composite).toBe('Composite element');
    expect(copy.search.hintLabel).toBe('id / type / text');
    expect(copy.row.childCountLabel(1)).toBe('1 child');
    expect(copy.row.childCountLabel(2)).toBe('2 children');
    expect(copy.row.semanticLabels.sections['case-results']).toBe('Case results');
    expect(copy.row.semanticLabels.roles.root).toBe('section');
    expect([
      copy.title,
      copy.nodeCountLabel(1),
      copy.collapseTitle,
      copy.expandTitle,
      copy.hideLabel,
      copy.showLabel,
      copy.emptyLabel,
      copy.dropHintLabel,
      Object.values(copy.kindLabels).join(' '),
      copy.search.placeholder,
      copy.search.ariaLabel,
      copy.search.resultCountLabel(4),
      copy.search.hintLabel,
      copy.search.clearAriaLabel,
      copy.row.collapseLabel,
      copy.row.expandLabel,
      copy.row.noChildrenLabel,
      copy.row.dragHandleLabel,
      copy.row.primaryLabel,
      copy.row.zIndexLabel(7),
      copy.row.childCountLabel(2),
      copy.row.hideNodeLabel,
      copy.row.showNodeLabel,
      copy.row.lockNodeLabel,
      copy.row.unlockNodeLabel,
      copy.row.moreActionsLabel,
      Object.values(copy.row.semanticLabels.sections).join(' '),
      Object.values(copy.row.semanticLabels.roles).join(' '),
    ].join(' ')).not.toMatch(cjk);
  });
});
