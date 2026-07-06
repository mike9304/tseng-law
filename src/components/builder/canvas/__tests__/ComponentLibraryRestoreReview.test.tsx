import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { getComponentLibraryCopy } from '../component-library-copy';
import { ComponentLibraryRestoreReview } from '../ComponentLibraryRestoreReview';
import type { ComponentLibraryRestoreReview as ComponentLibraryRestoreReviewModel } from '../component-library-restore-review.helpers';
import { containerNode, textNode } from './component-library-panel-test-fixtures';

describe('component library restore review', () => {
  it('renders current and previous version previews before confirming a restore', () => {
    const currentNodeJson = JSON.stringify({
      rootNodeId: 'current-container',
      nodes: [
        containerNode({ id: 'current-container' }),
        textNode({
          id: 'current-title',
          parentId: 'current-container',
          content: { text: 'Current reusable source' },
        }),
      ],
    });
    const restoredNodeJson = JSON.stringify(textNode({
      id: 'previous-title',
      content: { text: 'Original hero snapshot' },
    }));
    const oldestNodeJson = JSON.stringify(textNode({
      id: 'oldest-title',
      content: { text: 'Oldest reusable source' },
    }));
    const review: ComponentLibraryRestoreReviewModel = {
      entryId: 'hero',
      entryName: 'Hero reusable',
      currentNodeJson,
      restoredNodeJson,
      selectedVersionIndex: 0,
      versions: [
        {
          index: 0,
          nodeJson: restoredNodeJson,
          savedAt: '2026-06-02T00:00:00.000Z',
          label: 'Original hero snapshot',
          summary: { rootKind: 'text', nodeCount: 1, isValid: true },
        },
        {
          index: 1,
          nodeJson: oldestNodeJson,
          savedAt: '2026-06-01T00:00:00.000Z',
          summary: { rootKind: 'text', nodeCount: 1, isValid: true },
        },
      ],
      currentSummary: { rootKind: 'container', nodeCount: 2, isValid: true },
      previousSummary: { rootKind: 'text', nodeCount: 1, isValid: true },
      diffSummary: {
        hasChanges: true,
        items: [
          { kind: 'rootKind', previousRootKind: 'container', nextRootKind: 'text' },
          { kind: 'nodeCount', delta: -1 },
          { kind: 'text' },
        ],
        details: [
          { kind: 'text', previousText: 'Current reusable source', nextText: 'Original hero snapshot' },
        ],
      },
    };

    const html = renderToStaticMarkup(
      React.createElement(ComponentLibraryRestoreReview, {
        copy: getComponentLibraryCopy('ko'),
        review,
        snapshotLabel: 'Original hero snapshot',
        onConfirm: () => undefined,
        onCancel: () => undefined,
        onSelectVersion: () => undefined,
        onSnapshotLabelChange: () => undefined,
        onSaveSnapshotLabel: () => undefined,
        onDeleteVersion: () => undefined,
      }),
    );

    expect(html).toContain('data-builder-component-library-restore-review="true"');
    expect(html).toContain('data-builder-component-library-restore-review-entry="hero"');
    expect(html).toContain('복원 확인');
    expect(html).toContain('&quot;Hero reusable&quot;을 직전 버전으로 되돌리기 전에 비교하세요.');
    expect(html).toContain('data-builder-component-library-restore-review-summary="current"');
    expect(html).toContain('data-builder-component-library-restore-review-summary="previous"');
    expect(html).toContain('컨테이너 · 2개 요소');
    expect(html).toContain('텍스트 · 1개 요소');
    expect(html).toContain('data-builder-component-library-restore-review-previews="true"');
    expect(html).toContain('data-builder-component-library-restore-review-preview="current"');
    expect(html).toContain('data-builder-component-library-restore-review-preview="previous"');
    expect(html).toContain('Current reusable source');
    expect(html).toContain('Original hero snapshot');
    expect(html).toContain('data-builder-component-library-restore-review-diff="true"');
    expect(html).toContain('구조 변경');
    expect(html).toContain('컨테이너 → 텍스트');
    expect(html).toContain('요소 -1');
    expect(html).toContain('텍스트 변경');
    expect(html).toContain('data-builder-component-library-review-diff-details="true"');
    expect(html).toContain('상세 변경');
    expect(html).toContain('텍스트: Current reusable source → Original hero snapshot');
    expect(html).toContain('data-builder-component-library-restore-review-versions="true"');
    expect(html).toContain('data-builder-component-library-restore-review-version="0"');
    expect(html).toContain('data-builder-component-library-restore-review-version="1"');
    expect(html).toContain('data-builder-component-library-restore-review-version-preview="0"');
    expect(html).toContain('data-builder-component-library-restore-review-version-preview="1"');
    expect(html).toContain('복원할 버전');
    expect(html).toContain('버전 1');
    expect(html).toContain('Original hero snapshot');
    expect(html).toContain('Oldest reusable source');
    expect(html).toContain('data-builder-component-library-restore-review-version-date="0"');
    expect(html).toContain('버전 2');
    expect(html).toContain('스냅샷 이름');
    expect(html).toContain('value="Original hero snapshot"');
    expect(html).toContain('data-builder-component-library-restore-review-snapshot-label="true"');
    expect(html).toContain('data-builder-component-library-restore-review-snapshot-save="true"');
    expect(html).toContain('data-builder-component-library-restore-review-snapshot-delete="true"');
    expect(html).toContain('이름 저장');
    expect(html).toContain('버전 삭제');
    expect(html).toContain('data-builder-component-library-restore-review-confirm="true"');
    expect(html).toContain('data-builder-component-library-restore-review-cancel="true"');
  });

  it('keeps the version selector visible when only one snapshot remains', () => {
    const review: ComponentLibraryRestoreReviewModel = {
      entryId: 'hero',
      entryName: 'Hero reusable',
      currentNodeJson: '{"id":"current"}',
      restoredNodeJson: '{"id":"previous"}',
      selectedVersionIndex: 0,
      versions: [
        {
          index: 0,
          nodeJson: '{"id":"previous"}',
          savedAt: '2026-06-02T00:00:00.000Z',
          label: 'Original hero snapshot',
          summary: { rootKind: 'text', nodeCount: 1, isValid: true },
        },
      ],
      currentSummary: { rootKind: 'container', nodeCount: 2, isValid: true },
      previousSummary: { rootKind: 'text', nodeCount: 1, isValid: true },
      diffSummary: {
        hasChanges: false,
        items: [],
        details: [],
      },
    };

    const html = renderToStaticMarkup(
      React.createElement(ComponentLibraryRestoreReview, {
        copy: getComponentLibraryCopy('ko'),
        review,
        snapshotLabel: 'Original hero snapshot',
        onConfirm: () => undefined,
        onCancel: () => undefined,
        onSelectVersion: () => undefined,
        onSnapshotLabelChange: () => undefined,
        onSaveSnapshotLabel: () => undefined,
        onDeleteVersion: () => undefined,
      }),
    );

    expect(html).toContain('data-builder-component-library-restore-review-versions="true"');
    expect(html).toContain('data-builder-component-library-restore-review-version="0"');
    expect(html).toContain('Original hero snapshot');
  });
});
