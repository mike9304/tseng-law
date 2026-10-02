import type { BuilderSiteSearchCanvasNode } from '@/lib/builder/canvas/types';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { getSiteSearchCopy, SITE_SEARCH_LEGACY_DEFAULT_VALUES, localizedSiteSearchLegacyText } from './site-search-copy';

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

export default SiteSearchRender;
