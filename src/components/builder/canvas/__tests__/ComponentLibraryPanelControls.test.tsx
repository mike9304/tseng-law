import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ComponentLibraryPanelControls } from '../ComponentLibraryPanelControls';
import { getComponentLibraryCopy } from '../component-library-copy';

describe('component library panel controls', () => {
  it('renders a segmented list/grid view switcher', () => {
    const html = renderToStaticMarkup(
      React.createElement(ComponentLibraryPanelControls, {
        copy: getComponentLibraryCopy('ko'),
        name: '',
        searchQuery: '',
        sortMode: 'recent',
        viewMode: 'grid',
        visibleCount: 2,
        totalCount: 3,
        canSave: false,
        hasSelection: false,
        onNameChange: () => undefined,
        onSearchQueryChange: () => undefined,
        onSortModeChange: () => undefined,
        onViewModeChange: () => undefined,
        onSave: () => undefined,
      }),
    );

    expect(html).toContain('aria-label="보기 방식"');
    expect(html).toContain('data-builder-component-library-view-toggle="list"');
    expect(html).toContain('data-builder-component-library-view-toggle="grid"');
    expect(html).toContain('aria-label="목록 보기"');
    expect(html).toContain('aria-label="격자 보기"');
    expect(html).toContain('aria-pressed="true"');
  });
});
