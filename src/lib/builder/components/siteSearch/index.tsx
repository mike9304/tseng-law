import React from 'react';
import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderSiteSearchCanvasNode } from '@/lib/builder/canvas/types';
import { normalizeLocale, type Locale } from '@/lib/locales';
import {
  getSiteSearchCopy,
  SITE_SEARCH_LEGACY_DEFAULT_VALUES,
  localizedSiteSearchLegacyText,
  SITE_SEARCH_LEGACY_DEFAULTS,
} from './site-search-copy';

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
  const copy = getSiteSearchCopy(effectiveLocale);
  const placeholder = localizedSiteSearchLegacyText(c.placeholder, copy.defaultPlaceholder, SITE_SEARCH_LEGACY_DEFAULT_VALUES.placeholder) || copy.defaultPlaceholder;
  const submitLabel = localizedSiteSearchLegacyText(c.submitLabel, copy.defaultSubmitLabel, SITE_SEARCH_LEGACY_DEFAULT_VALUES.submitLabel) || copy.defaultSubmitLabel;
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
        placeholder={placeholder}
        aria-label={placeholder}
        {...(c.showResultsInline
          ? {
              role: 'combobox',
              'aria-autocomplete': 'list',
              'aria-controls': resultsId,
              'aria-expanded': false,
              'aria-haspopup': 'listbox',
            }
          : {})}
        data-builder-site-search-input="true"
      />
      {c.kinds.length > 0 ? <input type="hidden" name="kinds" value={c.kinds.join(',')} /> : null}
      <button type="submit">{submitLabel}</button>
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
