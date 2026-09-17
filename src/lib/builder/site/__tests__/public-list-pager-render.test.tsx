import { renderToStaticMarkup } from 'react-dom/server';
import { expect } from 'vitest';
import type { Locale } from '@/lib/locales';
import { DynamicListVisitorControls } from '@/lib/builder/site/DynamicListVisitorControls';
import { resolvePublishedDynamicListRuntime } from '@/lib/builder/site/published-dynamic-list-runtime';
import { publicListFixture } from './public-list-state-fixture';
import { registerListUiTests } from './public-list-pager-contract';

registerListUiTests(async (locale, state) => {
  const resolved = publicListFixture(locale as Locale, state === 'empty' ? 'empty' : 'populated');
  const collection = resolved.site.cmsCollections![0];
  const sample = collection.records[0];
  const site = { ...resolved.site, cmsCollections: [{
    ...collection,
    fields: collection.fields.map((field) => field.key === 'title' ? { ...field, label: 'Synthetic Field' } : field),
    records: state === 'empty' ? [] : Array.from({ length: 6 }, (_, index) => ({
      ...sample,
      recordId: `pager-synthetic-${index}`,
      fields: { ...sample.fields, title: `Synthetic item ${index}`, slug: `synthetic-item-${index}` },
    })),
  }] };
  const searchParams: Record<string, string> = state === 'filtered'
    ? { q: 'needle', 'filter[title]': 'needle', 'filterOp[title]': 'contains', sort: 'title:asc', perPage: '2' }
    : { page: state === 'populated' ? '2' : '1', perPage: '2' };
  const runtime = resolvePublishedDynamicListRuntime({
    datasetDocument: resolved.datasetDocument!, dynamicList: resolved.pageMeta.dynamicList,
    locale: locale as Locale, searchParams, site, slugPath: resolved.slugPath,
  });
  const html = renderToStaticMarkup(DynamicListVisitorControls({
    basePath: runtime.pagePath, locale, pagination: runtime.pagination!, searchParams,
    searchTerm: runtime.searchTerm, slice: runtime.slice!, sortOptions: runtime.sortOptions,
    sortQuery: runtime.sortQuery, totalRecordCount: runtime.totalRecordCount,
    visitorFilters: runtime.filters, visitorFilterSummary: runtime.filterSummary,
  }));
  if (state === 'filtered') {
    expect(runtime.filters).toEqual([{ fieldId: 'title', operator: 'contains', value: 'needle' }]);
    expect(runtime.sortQuery).toEqual([{ fieldId: 'title', direction: 'asc' }]);
    expect(html).toContain('name="filter[title]" value="needle"');
    expect(html).toContain('name="sort" value="title:asc"');
    expect(html).toContain(`href="/${locale}/design-fixtures/public-list"`);
    expect(html).toContain('aria-current="page"');
  }
  return html;
});
