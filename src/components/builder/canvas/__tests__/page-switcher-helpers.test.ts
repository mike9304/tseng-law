import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  filterVisiblePageSwitcherPages,
  isInternalSandboxPage,
  pageHasUnpublishedChanges,
} from '../PageSwitcher.helpers';

const root = process.cwd();

describe('page switcher helpers', () => {
  it('hides internal sandbox pages from the main page list', () => {
    const pages = [
      { pageId: 'home', slug: '', title: { ko: '홈' } },
      { pageId: 'about', slug: 'about', title: { ko: '호정 소개' } },
      { pageId: 'nested', slug: 'nested-ui-parent-mpgljzsv', title: { ko: 'Nested UI parent mpgljzsv' } },
      { pageId: 'visual', slug: 'visual-dynamic-list-mpr9xx4i', title: { ko: 'Visual dynamic list' } },
      { pageId: 'dataset', slug: 'dataset-repeater-template-mps5eg8n', title: { ko: 'Dataset repeater template mps5eg8n' } },
      { pageId: 'g-editor', slug: 'g-editor-w26w28ui-mpteng5p', title: { ko: 'G Editor UI w26w28ui-mpteng5p' } },
      { pageId: 'manual-save-section', slug: 'manual-save-section-mq04ajpb', title: { ko: 'Manual manual-save-section-mq04ajpb' } },
      { pageId: 'save-section-final', slug: 'save-section-final2-mq04g2un', title: { ko: 'Save section final2 save-section-final2-mq04g2un' } },
    ];

    expect(filterVisiblePageSwitcherPages(pages).map((page) => page.pageId)).toEqual(['home', 'about']);
  });

  it('filters internal sandbox pages even from minimal page summaries', () => {
    const pages = [
      { pageId: 'home', slug: '', isHomePage: true },
      { pageId: 'g-editor', slug: 'g-editor-w26w28ui-mpteng5p' },
      { pageId: 'dataset', slug: 'dataset-cms-service-preview-mps40fas' },
      { pageId: 'contact', slug: 'contact' },
    ];

    expect(filterVisiblePageSwitcherPages(pages).map((page) => page.pageId)).toEqual(['home', 'contact']);
  });

  it('keeps real user and CMS pages visible', () => {
    expect(isInternalSandboxPage({ slug: 'columns', title: { ko: '칼럼' } })).toBe(false);
    expect(isInternalSandboxPage({ slug: 'custom-landing', title: { ko: 'Custom landing' } })).toBe(false);
    expect(isInternalSandboxPage({ slug: 'services/detention', title: { ko: '세부 서비스' } })).toBe(false);
    expect(isInternalSandboxPage({ slug: 'attorney-profiles-list', title: { ko: '변호사 동적 리스트 abc' } })).toBe(false);
  });

  it('hides observed leaked QA/probe/test pages from the builder page list', () => {
    const leaked = [
      { pageId: 'g-editor-outline-toggle-a', slug: 'g-editor-outline-toggle-mqz9wtsk', title: { ko: 'Outline Toggle mqz9wtsk' } },
      { pageId: 'g-editor-outline-toggle-b', slug: 'g-editor-outline-toggle-mqzaev3h', title: { ko: 'Outline Toggle mqzaev3h' } },
      { pageId: 'g-editor-widget-drag', slug: 'g-editor-widget-drag-mqzqre1j', title: { ko: 'Widget Drag mqzqre1j' } },
      { pageId: 'visual-template', slug: 'visual-template-pet-home-mqzemq7q', title: { ko: 'Visual template pet-home' } },
      { pageId: 'public-animation-a', slug: 'public-animation-mqzrfcqb', title: { ko: 'Public animation public-animation-mqzrfcqb' } },
      { pageId: 'public-animation-b', slug: 'public-animation-mqzs7t9x', title: { ko: 'Public animation public-animation-mqzs7t9x' } },
      { pageId: 'visual-saved-drag', slug: 'visual-saved-drag-mqzrq9vh', title: { ko: 'Visual Saved Drag mqzrq9vh' } },
      { pageId: 'nested-container-drop', slug: 'nested-container-drop-mqzs4j5k', title: { ko: 'Nested container drop nested-container-drop-mqzs4j5k' } },
      { pageId: 'custom-preview', slug: 'custom-preview-mr0kw8u4', title: { ko: 'Custom preview mr0kw8u4' } },
      { pageId: 'ui-publish', slug: 'ui-publish-mr2vwj8t', title: { ko: 'UI Publish mr2vwj8t' } },
      { pageId: 'anchor-menu-widget', slug: 'anchor-menu-widget-mr2vx9rz', title: { ko: 'Anchor menu widget mr2vx9rz' } },
      { pageId: 'unused', slug: 'unused-mr3ns0ye', title: { ko: 'unused' } },
      { pageId: 'db-probe', slug: 'db-probe-1783017761', title: { ko: 'probe' } },
    ];

    expect(filterVisiblePageSwitcherPages(leaked)).toEqual([]);
  });

  it('does not hide legitimate user pages that share a broad prefix', () => {
    const real = [
      { pageId: 'home', slug: '', title: { ko: '홈' } },
      { pageId: 'about', slug: 'about', title: { ko: '호정 소개' } },
      { pageId: 'services', slug: 'services', title: { ko: '서비스' } },
      { pageId: 'detention', slug: 'services/detention', title: { ko: '세부 서비스' } },
      { pageId: 'columns', slug: 'columns', title: { ko: '칼럼' } },
      { pageId: 'custom-landing', slug: 'custom-landing', title: { ko: 'Custom landing' } },
      { pageId: 'faq', slug: 'faq', title: { ko: 'FAQ' } },
      { pageId: 'lawyers', slug: 'lawyers', title: { ko: '변호사' } },
      { pageId: 'pricing', slug: 'pricing', title: { ko: ' fees' } },
      { pageId: 'reviews', slug: 'reviews', title: { ko: '리뷰' } },
      { pageId: 'contact', slug: 'contact', title: { ko: '문의' } },
      { pageId: 'privacy', slug: 'privacy', title: { ko: '개인정보' } },
      { pageId: 'disclaimer', slug: 'disclaimer', title: { ko: '면책' } },
    ];

    expect(filterVisiblePageSwitcherPages(real).map((page) => page.pageId)).toEqual(real.map((page) => page.pageId));
  });

  it('keeps sandbox site page state behind the same visibility filter', () => {
    const hookSource = readFileSync(
      path.join(root, 'src/components/builder/canvas/hooks/useSandboxSiteState.ts'),
      'utf8',
    );

    expect(hookSource).toContain("import { filterVisiblePageSwitcherPages } from '@/components/builder/canvas/PageSwitcher.helpers';");
    expect(hookSource).toContain('filterVisiblePageSwitcherPages(sitePages ?? [])');
    expect(hookSource).toContain('const visiblePages = filterVisiblePageSwitcherPages(pages);');
  });

  it('does not infer unpublished changes from page metadata updatedAt alone', () => {
    expect(pageHasUnpublishedChanges({
      publishedAt: '2026-07-03T10:00:00.000Z',
      publishedSavedAt: '2026-07-03T10:00:00.000Z',
      lastPublishedDraftRevision: 1,
      draftRevision: undefined,
      draftSavedAt: undefined,
    })).toBe(false);
  });

  it('detects unpublished changes from revision or legacy draft timestamp data', () => {
    expect(pageHasUnpublishedChanges({
      publishedAt: '2026-07-03T10:00:00.000Z',
      lastPublishedDraftRevision: 1,
      draftRevision: 2,
    })).toBe(true);

    expect(pageHasUnpublishedChanges({
      publishedAt: '2026-07-03T10:00:00.000Z',
      publishedSavedAt: '2026-07-03T10:00:00.000Z',
      draftSavedAt: '2026-07-03T10:01:00.000Z',
    })).toBe(true);
  });
});
