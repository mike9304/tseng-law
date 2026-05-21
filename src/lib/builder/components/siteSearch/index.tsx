import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderSiteSearchCanvasNode } from '@/lib/builder/canvas/types';
import { normalizeLocale, type Locale } from '@/lib/locales';

const SEARCH_KIND_OPTIONS: Array<{ id: 'page' | 'blog' | 'faq' | 'portfolio'; label: string }> = [
  { id: 'page', label: '페이지' },
  { id: 'blog', label: '칼럼' },
  { id: 'faq', label: 'FAQ' },
  { id: 'portfolio', label: '포트폴리오' },
];

function SiteSearchRender({
  node,
  locale,
}: {
  node: BuilderSiteSearchCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
  locale?: Locale;
}) {
  const c = node.content;
  const effectiveLocale = normalizeLocale(c.locale || locale || 'ko');
  const resultsId = `builder-site-search-results-${node.id}`;
  // Static markup; client-side enhancement (live results) is wired in
  // SiteSearchPublishedClient when present, otherwise the form falls back
  // to the existing /search page.
  return (
    <form
      className="builder-site-search"
      data-builder-site-search="true"
      data-builder-site-search-kinds={c.kinds.join(',')}
      data-builder-site-search-locale={effectiveLocale}
      data-builder-site-search-max={c.maxResults}
      data-builder-site-search-inline={c.showResultsInline ? 'true' : 'false'}
      role="search"
      action={`/${effectiveLocale}/search`}
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
      {c.kinds.length > 0 ? <input type="hidden" name="kinds" value={c.kinds.join(',')} /> : null}
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
  const toggleKind = (kind: 'page' | 'blog' | 'faq' | 'portfolio', checked: boolean) => {
    const next = checked
      ? Array.from(new Set([...c.kinds, kind]))
      : c.kinds.filter((item) => item !== kind);
    onUpdate({ kinds: next });
  };
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
      <fieldset>
        <legend>검색 범위</legend>
        <p>선택하지 않으면 전체 검색</p>
        {SEARCH_KIND_OPTIONS.map((option) => (
          <label key={option.id}>
            <span>{option.label}</span>
            <input
              type="checkbox"
              checked={c.kinds.includes(option.id)}
              disabled={disabled}
              onChange={(event) => toggleKind(option.id, event.target.checked)}
            />
          </label>
        ))}
      </fieldset>
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
    placeholder: '어떻게 도와드릴까요?',
    submitLabel: '검색',
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
