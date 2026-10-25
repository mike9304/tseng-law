/** Offline attribution/counterfactual size measurements. Never deploy the modified strings. */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';

const root = fileURLToPath(new URL('.', import.meta.url));
const metadata = JSON.parse(readFileSync(path.join(root, 'fetch-metadata.json'), 'utf8'));
const bytes = (s) => Buffer.byteLength(s);
const compact = (o) => JSON.stringify(o);
const gzip = (s) => gzipSync(s, { level: 9 }).length;
const safeScriptJson = (o) => compact(o).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');

function flightRows(text) {
  const input = Buffer.from(text);
  const records = [];
  let offset = 0;
  while (offset < input.length) {
    const colon = input.indexOf(':', offset);
    if (colon < offset) throw new Error('Cannot read Flight row id');
    const id = input.subarray(offset, colon).toString();
    if (input[colon + 1] === 84) { // T: a UTF-8 byte-counted string; its body may contain newlines.
      const comma = input.indexOf(',', colon + 2);
      const size = Number.parseInt(input.subarray(colon + 2, comma).toString(), 16);
      const end = comma + 1 + size;
      if (!Number.isFinite(size) || end > input.length) throw new Error(`Invalid text row ${id}`);
      records.push({ id, type: 'T', text: input.subarray(comma + 1, end).toString(), bytes: end - offset, serialized: input.subarray(offset, end).toString() });
      offset = end;
    } else {
      let end = input.indexOf('\n', colon + 1);
      if (end < 0) end = input.length;
      const raw = input.subarray(colon + 1, end).toString();
      let value;
      try { value = JSON.parse(raw); } catch { /* Module/preload records are not JSON model objects. */ }
      records.push({ id, type: value === undefined ? raw[0] : 'model', raw, value, bytes: end + 1 - offset, serialized: input.subarray(offset, end + 1).toString() });
      offset = end + 1;
    }
  }
  return records;
}

function visit(value, fn) {
  if (!value || typeof value !== 'object') return;
  fn(value);
  for (const child of Object.values(value)) visit(child, fn);
}

function references(value) {
  const found = new Set();
  function scan(item) {
    if (typeof item === 'string') {
      const match = item.match(/^\$(?:L|@)?([a-f0-9]+)(?::.*)?$/);
      if (match) found.add(match[1]);
    } else if (item && typeof item === 'object') Object.values(item).forEach(scan);
  }
  scan(value);
  return found;
}

function reachable(initial, byId) {
  const found = new Set();
  const queue = [...initial];
  while (queue.length) {
    const id = queue.pop();
    if (found.has(id) || !byId.has(id)) continue;
    found.add(id);
    queue.push(...references(byId.get(id).value));
  }
  return found;
}

let paritySlugs;

function analyze(sample) {
  const html = readFileSync(sample.path ?? path.join(root, `${sample.name}.html`), 'utf8');
  const actualSha256 = createHash('sha256').update(html).digest('hex');
  if (actualSha256 !== sample.sha256) throw new Error(`${sample.name}: captured HTML no longer matches its recorded hash`);
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)].map((m) => ({ all: m[0], attrs: m[1], code: m[2] }));
  const rsc = scripts.filter((s) => s.code.includes('__next_f'));
  const ld = scripts.filter((s) => s.attrs.includes('application/ld+json'));
  const dataScripts = rsc.flatMap((s) => {
    const match = s.code.match(/^self\.__next_f\.push\((\[1,[\s\S]*\])\)$/);
    return match ? [{ ...s, packet: JSON.parse(match[1]) }] : [];
  });
  if (dataScripts.length !== 1) throw new Error(`${sample.name}: expected one merged Flight payload, got ${dataScripts.length}`);
  const packet = dataScripts[0];
  const flight = packet.packet[1];
  const records = flightRows(flight);
  const byId = new Map(records.map((record) => [record.id, record]));
  let provider, shell, shellRowId, view;
  const largestArrays = [];
  for (const record of records) visit(record.value, (value) => {
    if (value.index?.clusters && value.index?.columns) provider = value;
    if ('header' in value && 'footer' in value && 'locale' in value) { shell = value; shellRowId = record.id; }
    if (value.post?.slug && 'recommendedItems' in value) view = value;
    if (!Array.isArray(value)) for (const [key, val] of Object.entries(value)) {
      if (Array.isArray(val) && val.length >= 10) largestArrays.push({ key, count: val.length, jsonBytes: bytes(compact(val)) });
    }
  });
  if (!provider || !shell) throw new Error(`${sample.name}: provider/shell not found`);
  const resolveText = (v) => typeof v === 'string' && /^\$[a-f\d]+$/.test(v) && byId.get(v.slice(1))?.type === 'T' ? byId.get(v.slice(1)).text : v;
  const serializeFlight = (value) => html.replace(packet.code, `self.__next_f.push(${safeScriptJson([1, value])})`);
  const normalized = serializeFlight(flight);
  const replaceValue = (input, from, to) => {
    const old = compact(from);
    const count = input.split(old).length - 1;
    if (count !== 1) throw new Error(`${sample.name}: exact serialized replacement has ${count} matches`);
    return input.replace(old, compact(to));
  };
  const slug = new URL(sample.url).pathname.split('/')[3];
  const existingCluster = provider.index.clusters[provider.index.columns[slug]];
  const minimalIndex = { locale: provider.index.locale, clusters: existingCluster ? [existingCluster] : [], columns: existingCluster ? { [slug]: 0 } : {} };
  const minimalFooter = ['$','$Lfooter_candidate',null,{ locale: shell.locale }];
  const footerCandidates = reachable(references(shell.footer), byId);
  const modifiedById = new Map(byId);
  modifiedById.set(shellRowId, { ...byId.get(shellRowId), value: JSON.parse(compact(byId.get(shellRowId).value).replace(compact(shell.footer), compact(minimalFooter))) });
  const outsideReferences = new Set();
  for (const record of records) {
    if (footerCandidates.has(record.id)) continue;
    const value = modifiedById.get(record.id).value;
    for (const id of references(value)) outsideReferences.add(id);
  }
  const stillReferenced = reachable(outsideReferences, modifiedById);
  // Drop only model/text records private to the old footer. Shared/module records stay.
  const footerExclusive = records.filter((record) => footerCandidates.has(record.id) && !stillReferenced.has(record.id) && ['model', 'T'].includes(record.type));
  const clientFooterFlight = (input) => footerExclusive.reduce((result, record) => result.replace(record.serialized, ''), replaceValue(input, shell.footer, minimalFooter));
  const scenarios = {};
  const measure = (name, value, note) => {
    const modified = serializeFlight(value);
    scenarios[name] = { htmlBytes: bytes(modified), gzip9Bytes: gzip(modified), rawReduction: bytes(normalized) - bytes(modified), gzip9Reduction: gzip(normalized) - gzip(modified), note, runnable: false };
  };
  const scopedFlight = replaceValue(flight, provider.index, minimalIndex);
  measure('currentArticleIndex', scopedFlight, 'Exact data projection; requires static-only source change and pathname handling. No active source change was made.');
  measure('clientFooterReference', replaceValue(flight, shell.footer, minimalFooter), 'Illustrative client-boundary reference. New module record/chunk costs are excluded; no browser validity is claimed.');
  measure('clientFooterExclusiveSubtree', clientFooterFlight(flight), 'Drops only private old-footer model/text dependencies as well as the inline footer. Shared/module records remain; new module cost excluded.');
  measure('indexPlusClientFooter', replaceValue(scopedFlight, shell.footer, minimalFooter), 'Combined counterfactual, not the sum of independent gzip savings. New module costs excluded.');
  measure('indexPlusFooterExclusiveSubtree', clientFooterFlight(scopedFlight), 'Combined current-index projection and full private footer subtree replacement; hypothetical, not browser-verified.');
  if (paritySlugs) {
    const slugs = slug && !paritySlugs.includes(slug) ? [...paritySlugs.slice(0,285),slug] : paritySlugs;
    const allLocales = provider.columnLocales;
    const expandedIndex = { locale: provider.index.locale, clusters:[allLocales], columns:Object.fromEntries(slugs.map((key) => [key,0])) };
    const expandedScoped = { locale:provider.index.locale, clusters:slug ? [allLocales] : [], columns:slug ? {[slug]:0} : {} };
    const full = serializeFlight(replaceValue(flight,provider.index,expandedIndex));
    const scoped = serializeFlight(replaceValue(flight,provider.index,expandedScoped));
    scenarios.parity286Index = { fullIndexJsonBytes:bytes(compact(expandedIndex)), scopedIndexJsonBytes:bytes(compact(expandedScoped)), fullHtmlGzip9Bytes:gzip(full), scopedHtmlGzip9Bytes:gzip(scoped), rawReduction:bytes(full)-bytes(scoped), gzip9Reduction:gzip(full)-gzip(scoped), runnable:false, note:'Index-only size model: 286 real Traditional Chinese baseline slugs, one 49-language cluster; a sampled topic absent from that set substitutes one slug. Future article bodies/menus/metadata are not simulated.' };
  }
  if (view?.faqJsonLd) {
    // Count removing this duplicate schema prop while keeping the visible JSON-LD unchanged.
    const reduced = { ...view };
    delete reduced.faqJsonLd;
    measure('deriveFaqSchema', replaceValue(flight, view, reduced), 'Requires synchronous deterministic schema derivation from existing FAQ data in the shared view.');
    const narrowed = replaceValue(replaceValue(scopedFlight, shell.footer, minimalFooter), view, reduced);
    measure('indexFooterFaq', narrowed, 'Combined projected data omissions; current runtime cannot consume this payload.');
  }
  const articleContent = view ? [resolveText(view.post.content), ...(view.diagramSplit ?? []).map(resolveText)].filter((value) => typeof value === 'string').join('') : '';
  const patternBytes = (pattern) => bytes(html.match(pattern)?.[0] ?? '');
  const footerHtml = html.match(/<footer\b[\s\S]*?<\/footer>/)?.[0] ?? '';
  const htmlWithoutRsc = rsc.reduce((result, script) => result.replace(script.all, ''), html);
  return {
    ...sample, actualSha256, kind: view ? 'detail' : 'board', actualHtmlBytes: bytes(html), actualGzip9Bytes: gzip(html),
    scriptBytes: scripts.reduce((n, s) => n + bytes(s.all), 0),
    flightScriptBytes: rsc.reduce((n, s) => n + bytes(s.all), 0), decodedFlightBytes: bytes(flight),
    jsonLdHtmlBytes: ld.reduce((n, s) => n + bytes(s.all), 0),
    headerHtmlBytes: patternBytes(/<header\b[\s\S]*?<\/header>/), footerHtmlBytes: bytes(footerHtml),
    footerLanguageLinkCount: [...footerHtml.matchAll(/class="locale-flag-switcher-link\b/g)].length,
    hreflangCount: [...html.matchAll(/<link\b[^>]*hrefLang=/gi)].length,
    bodyMarkdownBytesInFlight: bytes(articleContent),
    index: { jsonBytes: bytes(compact(provider.index)), locale: provider.index.locale, columnCount: Object.keys(provider.index.columns).length, clusters: provider.index.clusters.length, minimalJsonBytes: bytes(compact(minimalIndex)) },
    footerTreeJsonBytes: bytes(compact(shell.footer)),
    footerPrivateFlightRows: footerExclusive.map(({ id, bytes: count }) => ({id, bytes:count})),
    footerPrivateFlightBytes: footerExclusive.reduce((sum,record) => sum+record.bytes,0),
    columnLocalesJsonBytes: bytes(compact(provider.columnLocales)),
    viewPropsJsonBytesExcludingReferencedStrings: view ? bytes(compact(view)) : null,
    recommendations: view ? { count: view.recommendedItems.length, jsonBytes: bytes(compact(view.recommendedItems)), visibleCards: 3 } : null,
    faqItemsJsonBytes: view ? bytes(compact(view.faqItems)) : null,
    faqSchemaJsonBytes: view?.faqJsonLd ? bytes(compact(view.faqJsonLd)) : null,
    sharedFontClassListBytes: largestArrays.filter((a) => a.key === 'managedFontClassNames'),
    largestModelArrays: largestArrays.sort((a,b) => b.jsonBytes-a.jsonBytes).slice(0,8),
    flightRecordsBySize: records.map(({id,type,bytes:count}) => ({id,type,bytes:count})).sort((a,b) => b.bytes-a.bytes).slice(0,5),
    normalizedBaseline: { identical: normalized === html, rawDelta: bytes(normalized)-bytes(html), gzip9Delta: gzip(normalized)-gzip(html) },
    scenarios,
    unsafeDiagnostic: { noFlightGzip9Bytes: gzip(htmlWithoutRsc), noFlightGzip9Reduction: gzip(html)-gzip(htmlWithoutRsc), runnable: false, reason: 'Deleting Flight breaks React hydration; diagnostic upper bound only, not a proposed change.' },
  };
}

// Read the real 286-slug baseline from the captured Traditional Chinese page.
const baselineHtml = readFileSync(path.join(root,'zh-hant-arc.html'),'utf8');
const baselinePacket = baselineHtml.match(/self\.__next_f\.push\((\[1,[\s\S]*?\])\)<\/script>/);
for (const record of flightRows(JSON.parse(baselinePacket[1])[1])) visit(record.value,(value) => {
  if (value.index?.locale==='zh-hant' && value.index.columns) paritySlugs=Object.keys(value.index.columns);
});
if (paritySlugs?.length !== 286) throw new Error('Baseline no longer contains exactly 286 slugs');
const supplementalManifest = process.argv[2];
const supplemental = supplementalManifest ? JSON.parse(readFileSync(supplementalManifest,'utf8')).map((row) => ({...row,name:`${row.locale}-${path.basename(row.path,'.html')}`})) : [];
const rows = [...metadata.samples,...supplemental].map(analyze);
const result = { measuredAt: new Date().toISOString(), runtime:process.versions, build: metadata.publicBuildAfter, supplementalManifest, methodology: 'Actual downloaded HTML. Raw UTF-8 bytes and Node zlib gzip level 9. Counterfactuals mutate only in-memory copies and are not build or browser results. Overlapping component/prop measures must not be added.', samples: rows };
writeFileSync(path.join(root, 'payload-measurements.json'), `${JSON.stringify(result, null, 2)}\n`);
const quantitative = supplemental.length ? rows.slice(metadata.samples.length) : rows.filter((row) => row.kind === 'detail');
const mean = (values) => values.reduce((sum,value) => sum+value,0)/values.length;
const summary = {
  sampleCount: quantitative.length,
  scope: supplemental.length ? 'supplemental locale-balanced detail samples only' : 'direct detail samples only',
  actualGzipMean:mean(quantitative.map((row) => row.actualGzip9Bytes)),
  actualGzipTotal:quantitative.reduce((sum,row) => sum+row.actualGzip9Bytes,0),
  sourceHashesVerified: rows.length,
  roundtripFailures:rows.filter((row) => !row.normalizedBaseline.identical).map((row) => row.name),
};
for (const key of ['currentArticleIndex','clientFooterExclusiveSubtree','indexPlusFooterExclusiveSubtree','parity286Index']) {
  const values=quantitative.map((row) => row.scenarios[key].gzip9Reduction);
  summary[key]={mean:mean(values),min:Math.min(...values),max:Math.max(...values),multiply14014MiB:mean(values)*14014/1024/1024};
}
const faq=quantitative.filter((row) => row.scenarios.deriveFaqSchema).map((row) => row.scenarios.deriveFaqSchema.gzip9Reduction);
summary.faq={count:faq.length,mean:faq.length ? mean(faq) : null};
writeFileSync(path.join(root,'measurement-summary.json'),`${JSON.stringify(summary,null,2)}\n`);
console.table(rows.slice(0, 10).map((row) => ({ page:row.name, html:row.actualHtmlBytes, gzip9:row.actualGzip9Bytes, flight:row.flightScriptBytes, index:row.index.jsonBytes, footer:row.footerTreeJsonBytes, markdown:row.bodyMarkdownBytesInFlight, indexGzSave:row.scenarios.currentArticleIndex.gzip9Reduction, footerGzSave:row.scenarios.clientFooterReference.gzip9Reduction, combinedGzSave:row.scenarios.indexPlusClientFooter.gzip9Reduction })));
