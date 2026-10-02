import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderSiteSearchCanvasNode } from '@/lib/builder/canvas/types';
import { getSiteSearchCopy, SITE_SEARCH_LEGACY_DEFAULT_VALUES, localizedSiteSearchLegacyText, SITE_SEARCH_LEGACY_DEFAULTS } from './site-search-copy';

import SiteSearchRender from './Render';

function SiteSearchInspector({
  node,
  locale = 'ko',
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const n = node as BuilderSiteSearchCanvasNode;
  const c = n.content;
  const copy = getSiteSearchCopy(locale);
  const placeholder = localizedSiteSearchLegacyText(c.placeholder, copy.defaultPlaceholder, SITE_SEARCH_LEGACY_DEFAULT_VALUES.placeholder);
  const submitLabel = localizedSiteSearchLegacyText(c.submitLabel, copy.defaultSubmitLabel, SITE_SEARCH_LEGACY_DEFAULT_VALUES.submitLabel);
  const toggleKind = (kind: 'page' | 'blog' | 'faq' | 'portfolio', checked: boolean) => {
    const next = checked
      ? Array.from(new Set([...c.kinds, kind]))
      : c.kinds.filter((item) => item !== kind);
    onUpdate({ kinds: next });
  };
  return (
    <>
      <label>
        <span>{copy.placeholderLabel}</span>
        <input
          type="text"
          value={placeholder}
          disabled={disabled}
          onChange={(event) => onUpdate({ placeholder: event.target.value })}
        />
      </label>
      <label>
        <span>{copy.searchButtonLabel}</span>
        <input
          type="text"
          value={submitLabel}
          disabled={disabled}
          onChange={(event) => onUpdate({ submitLabel: event.target.value })}
        />
      </label>
      <label>
        <span>{copy.showInlineResultsLabel}</span>
        <input
          type="checkbox"
          checked={c.showResultsInline}
          disabled={disabled}
          onChange={(event) => onUpdate({ showResultsInline: event.target.checked })}
        />
      </label>
      <fieldset>
        <legend>{copy.searchScopeLegend}</legend>
        <p>{copy.searchScopeHint}</p>
        {Object.entries(copy.kindLabels).map(([id, label]) => (
          <label key={id}>
            <span>{label}</span>
            <input
              type="checkbox"
              checked={c.kinds.includes(id as 'page' | 'blog' | 'faq' | 'portfolio')}
              disabled={disabled}
              onChange={(event) => toggleKind(id as 'page' | 'blog' | 'faq' | 'portfolio', event.target.checked)}
            />
          </label>
        ))}
      </fieldset>
      <label>
        <span>{copy.maxResultsLabel}</span>
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
        <span>{copy.localeOverrideLabel}</span>
        <input
          type="text"
          value={c.locale}
          placeholder={copy.localeOverridePlaceholder}
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
    placeholder: SITE_SEARCH_LEGACY_DEFAULTS.placeholder,
    submitLabel: SITE_SEARCH_LEGACY_DEFAULTS.submitLabel,
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
