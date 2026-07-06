import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { getComponentLibraryCopy } from '../component-library-copy';
import { ComponentLibraryUpdateReview } from '../ComponentLibraryUpdateReview';
import type { ComponentLibraryUpdateReview as ComponentLibraryUpdateReviewModel } from '../component-library-update-review.helpers';
import { textNode } from './component-library-panel-test-fixtures';

describe('component library update review', () => {
  it('renders saved and current selection summaries before confirming an overwrite', () => {
    const review: ComponentLibraryUpdateReviewModel = {
      entryId: 'hero',
      entryName: 'Hero reusable',
      savedNodeJson: JSON.stringify(textNode({ id: 'saved', content: { text: 'Saved headline' } })),
      nextNodeJson: JSON.stringify(textNode({ id: 'next', content: { text: 'Current headline' } })),
      savedSummary: { rootKind: 'text', nodeCount: 1, isValid: true },
      nextSummary: { rootKind: 'container', nodeCount: 2, isValid: true },
      diffSummary: {
        hasChanges: true,
        items: [
          { kind: 'rootKind', previousRootKind: 'text', nextRootKind: 'container' },
          { kind: 'nodeCount', delta: 1 },
          { kind: 'text' },
          { kind: 'binding' },
        ],
        details: [
          { kind: 'text', previousText: 'Saved headline', nextText: 'Current headline' },
          {
            kind: 'binding',
            previousBinding: 'home.insights.feed · text:title',
            nextBinding: 'home.services.list · text:description',
          },
        ],
      },
    };

    const html = renderToStaticMarkup(
      React.createElement(ComponentLibraryUpdateReview, {
        copy: getComponentLibraryCopy('ko'),
        review,
        snapshotLabel: 'Original hero',
        onConfirm: () => undefined,
        onCancel: () => undefined,
        onSnapshotLabelChange: () => undefined,
      }),
    );

    expect(html).toContain('data-builder-component-library-update-review="true"');
    expect(html).toContain('data-builder-component-library-update-review-entry="hero"');
    expect(html).toContain('업데이트 확인');
    expect(html).toContain('&quot;Hero reusable&quot;을 현재 선택으로 덮어쓰기 전에 비교하세요.');
    expect(html).toContain('data-builder-component-library-update-review-summary="saved"');
    expect(html).toContain('data-builder-component-library-update-review-summary="current"');
    expect(html).toContain('텍스트 · 1개 요소');
    expect(html).toContain('컨테이너 · 2개 요소');
    expect(html).toContain('data-builder-component-library-update-review-previews="true"');
    expect(html).toContain('data-builder-component-library-update-review-preview="saved"');
    expect(html).toContain('data-builder-component-library-update-review-preview="current"');
    expect(html).toContain('Saved headline');
    expect(html).toContain('Current headline');
    expect(html).toContain('data-builder-component-library-update-review-diff="true"');
    expect(html).toContain('구조 변경');
    expect(html).toContain('텍스트 → 컨테이너');
    expect(html).toContain('요소 +1');
    expect(html).toContain('텍스트 변경');
    expect(html).toContain('연결 변경');
    expect(html).toContain('data-builder-component-library-review-diff-details="true"');
    expect(html).toContain('상세 변경');
    expect(html).toContain('data-builder-component-library-review-diff-detail="text"');
    expect(html).toContain('텍스트: Saved headline → Current headline');
    expect(html).toContain('data-builder-component-library-review-diff-detail="binding"');
    expect(html).toContain('연결: home.insights.feed · text:title → home.services.list · text:description');
    expect(html).toContain('data-builder-component-library-update-review-snapshot-label="true"');
    expect(html).toContain('스냅샷 이름');
    expect(html).toContain('value="Original hero"');
    expect(html).toContain('data-builder-component-library-update-review-confirm="true"');
    expect(html).toContain('data-builder-component-library-update-review-cancel="true"');
  });
});
