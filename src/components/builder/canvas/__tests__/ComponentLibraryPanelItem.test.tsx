import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ComponentLibraryPanelItem } from '../ComponentLibraryPanelItem';
import { getComponentLibraryCopy } from '../component-library-copy';
import type { ComponentLibraryEntry, ComponentLibraryViewMode } from '../component-library-panel.helpers';
import { textNode } from './component-library-panel-test-fixtures';

function renderItem(
  entry: ComponentLibraryEntry,
  canUpdate = true,
  viewMode: ComponentLibraryViewMode = 'list',
  canReplace = true,
): string {
  return renderToStaticMarkup(
    React.createElement(ComponentLibraryPanelItem, {
      copy: getComponentLibraryCopy('ko'),
      entry,
      viewMode,
      isEditing: false,
      editingName: '',
      onEditingNameChange: () => undefined,
      onStartRename: () => undefined,
      onCancelRename: () => undefined,
      onSaveRename: () => undefined,
      onInsert: () => undefined,
      onDuplicate: () => undefined,
      canReplace,
      onReplace: () => undefined,
      canUpdate,
      onUpdate: () => undefined,
      onRestore: () => undefined,
      onTogglePinned: () => undefined,
      onRemove: () => undefined,
    }),
  );
}

describe('component library panel item', () => {
  it('disables insert action when saved payload needs review', () => {
    const entry: ComponentLibraryEntry = {
      id: 'broken',
      name: 'Broken component',
      nodeJson: JSON.stringify({ id: 'missing-kind' }),
      createdAt: '2026-06-17T00:00:00.000Z',
    };

    const html = renderItem(entry);

    expect(html).toContain('data-builder-component-library-valid="false"');
    expect(html).toContain('저장 데이터 확인 필요');
    expect(html).toContain('저장 데이터를 확인해야 삽입할 수 있음');
    expect(html).toContain('title="저장 데이터를 확인한 뒤 삽입할 수 있습니다."');
    expect(html).toContain('disabled=""');
  });

  it('keeps insert action enabled for valid saved payloads', () => {
    const entry: ComponentLibraryEntry = {
      id: 'text',
      name: 'Text component',
      nodeJson: JSON.stringify(textNode({ id: 'text' })),
      createdAt: '2026-06-17T00:00:00.000Z',
    };

    const html = renderItem(entry);

    expect(html).toContain('data-builder-component-library-valid="true"');
    expect(html).toContain('텍스트 · 1개 요소');
    expect(html).not.toContain('disabled=""');
  });

  it('renders a visual preview for valid saved payloads', () => {
    const entry: ComponentLibraryEntry = {
      id: 'text',
      name: 'Text component',
      nodeJson: JSON.stringify(textNode({
        id: 'text',
        content: {
          text: 'Reusable preview text',
          fontSize: 24,
          color: '#1d4ed8',
          fontWeight: 'bold',
          align: 'left',
        },
      })),
      createdAt: '2026-06-17T00:00:00.000Z',
    };

    const html = renderItem(entry);

    expect(html).toContain('data-builder-component-library-preview-tone="text"');
    expect(html).toContain('data-builder-component-library-preview-valid="true"');
    expect(html).toContain('Reusable preview text');
  });

  it('renders a grid-ready item variant for visual browsing', () => {
    const entry: ComponentLibraryEntry = {
      id: 'text',
      name: 'Grid text component',
      nodeJson: JSON.stringify(textNode({ id: 'text' })),
      createdAt: '2026-06-17T00:00:00.000Z',
    };

    const html = renderItem(entry, true, 'grid');

    expect(html).toContain('data-builder-component-library-item-view="grid"');
    expect(html).toContain('data-builder-component-library-preview-tone="text"');
    expect(html).toContain('Grid text component');
  });

  it('disables update action until the canvas has a selection', () => {
    const entry: ComponentLibraryEntry = {
      id: 'text',
      name: 'Text component',
      nodeJson: JSON.stringify(textNode({ id: 'text' })),
      createdAt: '2026-06-17T00:00:00.000Z',
    };

    const html = renderItem(entry, false);

    expect(html).toContain('현재 선택으로 업데이트');
    expect(html).toContain('먼저 캔버스에서 업데이트할 요소를 선택하세요.');
    expect(html).toContain('data-builder-component-library-update="text"');
    expect(html).toContain('disabled=""');
  });

  it('disables replace action until exactly one canvas element is selected', () => {
    const entry: ComponentLibraryEntry = {
      id: 'text',
      name: 'Text component',
      nodeJson: JSON.stringify(textNode({ id: 'text' })),
      createdAt: '2026-06-17T00:00:00.000Z',
    };

    const html = renderItem(entry, true, 'list', false);

    expect(html).toContain('data-builder-component-library-replace="text"');
    expect(html).toContain('title="교체할 요소 하나를 캔버스에서 선택하세요."');
    expect(html).toContain('disabled=""');
  });

  it('marks items that have been updated from a newer canvas selection', () => {
    const entry: ComponentLibraryEntry = {
      id: 'text',
      name: 'Text component',
      nodeJson: JSON.stringify(textNode({ id: 'text' })),
      createdAt: '2026-06-17T00:00:00.000Z',
      updatedAt: '2026-06-18T00:00:00.000Z',
    };

    const html = renderItem(entry);

    expect(html).toContain('업데이트됨');
    expect(html).toContain('data-builder-component-library-updated="true"');
  });

  it('shows restore affordances for entries with previous versions', () => {
    const entry: ComponentLibraryEntry = {
      id: 'text',
      name: 'Text component',
      nodeJson: JSON.stringify(textNode({ id: 'text' })),
      createdAt: '2026-06-17T00:00:00.000Z',
      updatedAt: '2026-06-18T00:00:00.000Z',
      versions: [
        {
          nodeJson: JSON.stringify(textNode({ id: 'previous-text' })),
          savedAt: '2026-06-17T00:00:00.000Z',
        },
      ],
    };

    const html = renderItem(entry);

    expect(html).toContain('data-builder-component-library-versions="1"');
    expect(html).toContain('이전 버전 1');
    expect(html).toContain('data-builder-component-library-restore="text"');
    expect(html).toContain('title="이전 버전 복원"');
    expect(html).toContain('aria-label="&quot;Text component&quot; 이전 버전 복원"');
  });
});
