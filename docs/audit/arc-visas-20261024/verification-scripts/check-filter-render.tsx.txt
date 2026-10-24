import fs from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { AppRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { PathnameContext, SearchParamsContext } from 'next/dist/shared/lib/hooks-client-context.shared-runtime';
import ColumnsGrid from '../repo/src/components/ColumnsGrid';
import { getAllColumnPosts } from '../repo/src/lib/columns';
import { toColumnListItems } from '../repo/src/lib/column-list-items';

const root = '/Users/son7/tseng-arc-visas-20261024';
const items = toColumnListItems(getAllColumnPosts('en'));
const slugs = ['taiwan-arc-first-application','taiwan-visa-residence-work-study-family','taiwan-arc-renewal-changes-reentry'];
function render(filters: { topic?: string; q?: string }) {
  return renderToStaticMarkup(
    <AppRouterContext.Provider value={{} as never}>
      <PathnameContext.Provider value="/en/columns">
        <SearchParamsContext.Provider value={new URLSearchParams(filters)}>
          <ColumnsGrid locale="en" posts={items} initialFilters={filters} />
        </SearchParamsContext.Provider>
      </PathnameContext.Provider>
    </AppRouterContext.Provider>,
  );
}
const topicHTML = render({ topic: 'visa' });
const errors: string[] = [];
const rows = slugs.map(slug => {
  const item = items.find(x => x.slug === slug);
  if (!item) throw new Error(`missing input ${slug}`);
  const href = `href="/en/columns/${slug}"`;
  const searchHTML = render({ q: item.title });
  const topicFound = topicHTML.includes(href);
  const searchFound = searchHTML.includes(href) && searchHTML.includes('data-columns-visible-count="1"');
  if (!topicFound || !searchFound) errors.push(slug);
  return { locale:'en', slug, topicFound, searchFound };
});
const result = { scope:'Actual ColumnsGrid React server rendering with route context and topic/search filters; no browser interaction or hydration verified', rows, errors };
fs.writeFileSync(`${root}/work/checks/filter-render-audit.json`, JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result));
process.exitCode = errors.length ? 1 : 0;
