import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderSiteSearchCanvasNode } from '@/lib/builder/canvas/types';

function SiteSearchRender({
  node,
}: {
  node: BuilderSiteSearchCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const c = node.content;
  const resultsId = `builder-site-search-results-${node.id}`;
  // Static markup; client-side enhancement (live results) is wired in
  // SiteSearchPublishedClient when present, otherwise the form falls back
  // to the existing /search page.
  return (
    <form
      className="builder-site-search"
      data-builder-site-search="true"
      data-builder-site-search-kinds={c.kinds.join(',')}
      data-builder-site-search-locale={c.locale}
      data-builder-site-search-max={c.maxResults}
      data-builder-site-search-inline={c.showResultsInline ? 'true' : 'false'}
      role="search"
      action={c.locale ? `/${c.locale}/search` : '/ko/search'}
      method="get"
    >
      <input
        type="search"
        name="q"
        placeholder={c.placeholder}
        aria-label={c.placeholder}
        aria-autocomplete="list"
        aria-controls={c.showResultsInline ? resultsId : undefined}
        aria-expanded={c.showResultsInline ? false : undefined}
        aria-haspopup={c.showResultsInline ? 'listbox' : undefined}
        data-builder-site-search-input="true"
      />
      <button type="submit">{c.submitLabel}</button>
      {c.showResultsInline ? (
        <div
          className="builder-site-search-results"
          id={resultsId}
          role="listbox"
          data-builder-site-search-results="true"
          hidden
        />
      ) : null}
    </form>
  );
}

function SiteSearchInspector({
  node,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const n = node as BuilderSiteSearchCanvasNode;
  const c = n.content;
  return (
    <>
      <label>
        <span>플레이스홀더</span>
        <input
          type="text"
          value={c.placeholder}
          disabled={disabled}
          onChange={(event) => onUpdate({ placeholder: event.target.value })}
        />
      </label>
      <label>
        <span>검색 버튼 라벨</span>
        <input
          type="text"
          value={c.submitLabel}
          disabled={disabled}
          onChange={(event) => onUpdate({ submitLabel: event.target.value })}
        />
      </label>
      <label>
        <span>결과 인라인 표시</span>
        <input
          type="checkbox"
          checked={c.showResultsInline}
          disabled={disabled}
          onChange={(event) => onUpdate({ showResultsInline: event.target.checked })}
        />
      </label>
      <label>
        <span>최대 결과수</span>
        <input
          type="number"
          min={1}
          max={20}
          value={c.maxResults}
          disabled={disabled}
          onChange={(event) => onUpdate({ maxResults: Math.max(1, Math.min(20, Number(event.target.value) || 8)) })}
        />
      </label>
      <label>
        <span>로케일 override</span>
        <input
          type="text"
          value={c.locale}
          placeholder="페이지 로케일 사용"
          disabled={disabled}
          onChange={(event) => onUpdate({ locale: event.target.value })}
        />
      </label>
    </>
  );
}

export default defineComponent({
  kind: 'site-search',
  displayName: '사이트 검색',
  category: 'advanced',
  icon: '🔍',
  defaultContent: {
    placeholder: '검색...',
    submitLabel: 'Search',
    showResultsInline: true,
    kinds: [],
    locale: '',
    maxResults: 8,
  },
  defaultStyle: {},
  defaultRect: { width: 360, height: 56 },
  Render: SiteSearchRender,
  Inspector: SiteSearchInspector,
});
