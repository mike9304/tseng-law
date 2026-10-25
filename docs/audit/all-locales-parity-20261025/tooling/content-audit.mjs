#!/usr/bin/env node
/** Read-only manuscript checks. Automated PASS is never legal/translation approval. See CONTENT-AUDIT.md. */
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { existsSync, globSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const DEFAULT_ROOT = fileURLToPath(new URL('../../../../', import.meta.url));
const require = createRequire(path.join(DEFAULT_ROOT, 'package.json'));
const matter = require('gray-matter');
const ts = require('typescript');
const [{ unified }, { default: remarkParse }, { default: remarkGfm }] = await Promise.all(
  ['unified', 'remark-parse', 'remark-gfm'].map((name) => import(pathToFileURL(require.resolve(name)).href)),
);
const parser = unified().use(remarkParse).use(remarkGfm);
const FIRST_BATCH = {
  locales: ['ru', 'ms', 'fil', 'tr', 'nl', 'zh-hans'],
  files: ['704-taiwan-arc-first-application.md', '705-taiwan-visa-residence-work-study-family.md', '706-taiwan-arc-renewal-changes-reentry.md'],
};
const SITE_HOSTS = new Set(['tseng-law.com', 'www.tseng-law.com']);
const MIN_BODY_LETTERS = 500;
const MIN_UNIQUE_BODY_LETTERS = 350;
const PLACEHOLDER = /\b(?:TODO|TBD|lorem ipsum|insert (?:text|content|translation) here|translation pending)\b|내용\s*작성\s*예정|待(?:翻译|翻譯|补充|補充)|\[\s*(?:TRANSLATE|PLACEHOLDER)\s*\]/iu;
const CONDITION_HINT = /\b(?:must|may|only|unless|except|if|eligible|eligibility|cannot|does not|not automatically|before|after|within|required|permission|permit|exemption|and|or)\b|(?:경우|요건|기한|예외|허가|신청|해야|또는|다만|않)|(?:應|应|須|须|得|不得|但|除外|如果|許可|许可|期限|申請|申请)/iu;
const COUNTRY_HINT = /\b(?:nationality|citizen|nationals?|passport|mainland|Hong Kong|Macau|China|Taiwan|Korea|Japan|United States|Russia|Malaysia|Philippines|Turkey|Netherlands|граждан|гражданство|паспорт|warganegara|kewarganegaraan|mamamayan|pagkamamamayan|vatandaş|uyruk|nationaliteit|staatsburger)\b|国籍|國籍|국적|국민|台湾|台灣|大陆|大陸|香港|澳門|澳门|中国|中國/iu;

const hash = (raw) => createHash('sha256').update(raw).digest('hex');
const letters = (text) => [...text.matchAll(/[\p{L}\p{N}]/gu)].length;
const cleanSpace = (text) => text.replace(/\s+/g, ' ').trim();
const relative = (root, file) => path.relative(root, file).split(path.sep).join('/');
const addError = (row, code, message, extra = {}) => row.errors.push({ code, message, ...extra });
const addReview = (row, code, message, extra = {}) => row.reviews.push({ code, status: 'REQUIRED', message, ...extra });

function parseTsFile(root, file) {
  const raw = readFileSync(path.join(root, file), 'utf8');
  return ts.createSourceFile(file, raw, ts.ScriptTarget.Latest, true);
}

/** Read data from the repository's real declarations, not a second hand-maintained locale list. */
function literalDeclaration(root, file, name) {
  const ast = parseTsFile(root, file);
  let found;
  function visit(node) {
    if (ts.isVariableDeclaration(node) && node.name.getText(ast) === name) found = node.initializer;
    ts.forEachChild(node, visit);
  }
  visit(ast);
  function literal(node) {
    if (!node) throw new Error(`Missing ${name} in ${file}`);
    if (ts.isAsExpression(node) || ts.isSatisfiesExpression(node) || ts.isParenthesizedExpression(node)) return literal(node.expression);
    if (ts.isStringLiteralLike(node)) return node.text;
    if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal);
    if (ts.isObjectLiteralExpression(node)) return Object.fromEntries(node.properties.map((item) => {
      if (!ts.isPropertyAssignment(item)) throw new Error(`Nonliteral property in ${file}:${name}`);
      return [ts.isIdentifier(item.name) || ts.isStringLiteralLike(item.name) ? item.name.text : item.name.getText(ast), literal(item.initializer)];
    }));
    throw new Error(`Unsupported runtime declaration ${file}:${name}; inspect the changed contract`);
  }
  return literal(found);
}

/** Only these three pure repository modules are evaluated; no CMS/store/API module is loaded. */
function loadPureContracts(root) {
  const allowed = new Set(['src/lib/column-audience.ts', 'src/data/market-column-curation.ts', 'src/lib/column-attribution.ts']);
  const cache = new Map();
  function load(file) {
    if (!allowed.has(file)) throw new Error(`Unexpected contract dependency: ${file}`);
    if (cache.has(file)) return cache.get(file);
    const mod = { exports: {} };
    const code = ts.transpileModule(readFileSync(path.join(root, file), 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText;
    cache.set(file, mod.exports);
    const scopedRequire = (specifier) => {
      if (specifier !== '@/lib/column-audience') throw new Error(`Unexpected contract import ${specifier}`);
      return load('src/lib/column-audience.ts');
    };
    new Function('require', 'module', 'exports', code)(scopedRequire, mod, mod.exports);
    return mod.exports;
  }
  return {
    ...load('src/lib/column-audience.ts'), ...load('src/data/market-column-curation.ts'), ...load('src/lib/column-attribution.ts'),
    hashes: Object.fromEntries([...allowed].map((file) => [file, hash(readFileSync(path.join(root, file)))])),
  };
}

function readRuntimeContract(root) {
  const mapping = literalDeclaration(root, 'src/lib/column-locales.ts', 'COLUMN_CONTENT_DIR_BY_LOCALE');
  const source = parseTsFile(root, 'src/lib/columns.ts');
  const functions = ['slugFromFilename', 'labelPhrases', 'categoryFromString'].map((name) => {
    const declaration = source.statements.find((node) => ts.isFunctionDeclaration(node) && node.name?.text === name);
    if (!declaration) throw new Error(`Cannot locate the runtime ${name} function`);
    return declaration.getText(source);
  });
  const dependencyNames = ['FORMATION_CATEGORY_PHRASES', 'CASE_CATEGORY_PHRASES', 'GUIDANCE_COLUMN_CATEGORY_LABELS'];
  const dependencies = dependencyNames.map((name) => literalDeclaration(root, 'src/lib/columns.ts', name));
  const code = ts.transpileModule(functions.join('\n'), { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
  const { slugFromFilename, categoryFromString } = new Function(...dependencyNames, `${code}; return { slugFromFilename, categoryFromString };`)(...dependencies);
  const pure = loadPureContracts(root);
  return {
    ...pure, mapping, slugFromFilename, categoryFromString,
    topics: literalDeclaration(root, 'src/lib/column-topics.ts', 'COLUMN_TOPICS'),
    guidance: literalDeclaration(root, 'src/lib/public-guidance.ts', 'GUIDANCE_LOCALES_4'),
    guidanceRoutes: literalDeclaration(root, 'src/lib/public-guidance.ts', 'GUIDANCE_CORE_ROUTE_KEYS'),
    issueLocales: literalDeclaration(root, 'src/lib/columns.ts', 'ISSUE_BOARD_LOCALES'),
    aliases: literalDeclaration(root, 'src/lib/columns.ts', 'SLUG_ALIASES'),
    hashes: { ...pure.hashes, ...Object.fromEntries(['src/lib/columns.ts', 'src/lib/column-locales.ts', 'src/lib/public-guidance.ts', 'src/lib/column-topics.ts'].map((file) => [file, hash(readFileSync(path.join(root, file)))])) },
  };
}

function walk(node, action, ancestors = []) {
  action(node, ancestors);
  for (const child of node.children ?? []) walk(child, action, [...ancestors, node]);
}

function visibleText(node) {
  if (['code', 'inlineCode', 'image', 'imageReference', 'definition', 'html'].includes(node.type)) return '';
  if (node.type === 'text') return node.value;
  return (node.children ?? []).map(visibleText).join('');
}

function readDocument(file) {
  const raw = readFileSync(file, 'utf8');
  if (!/^\uFEFF?---\r?\n/.test(raw)) throw new Error('Missing opening YAML frontmatter delimiter');
  // Options bypass gray-matter's text-only cache, whose shallow cache copy drops
  // nonenumerable parser metadata when several translations share one source.
  const parsed = matter(raw, {});
  if (!/^\uFEFF?---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/.test(raw)) throw new Error('Missing closing YAML frontmatter delimiter');
  if (!parsed.data || Array.isArray(parsed.data) || typeof parsed.data !== 'object') throw new Error('Frontmatter must be a YAML mapping');
  const body = parsed.content;
  const bodyLine = raw.slice(0, raw.length - body.length).split('\n').length - 1;
  const tree = parser.parse(body);
  const definitions = new Map();
  walk(tree, (node) => { if (node.type === 'definition') definitions.set(node.identifier, node.url); });
  const links = [];
  const paragraphs = [];
  const headings = [];
  const codePassages = [];
  const strong = [];
  const h1 = [];
  walk(tree, (node, ancestors) => {
    const line = (node.position?.start.line ?? 1) + bodyLine;
    if (node.type === 'link') links.push({ href: node.url, text: visibleText(node), line, kind: 'body' });
    if (node.type === 'linkReference') {
      const href = definitions.get(node.identifier);
      if (href) links.push({ href, text: visibleText(node), line, kind: 'body' });
    }
    if (node.type === 'paragraph' || node.type === 'tableCell') {
      const text = cleanSpace(visibleText(node));
      if (text) paragraphs.push({ text, line, kind: node.type });
    }
    if (node.type === 'heading') headings.push({ text: cleanSpace(visibleText(node)), line, kind: `h${node.depth}` });
    if (node.type === 'code' || node.type === 'inlineCode') codePassages.push({ text: node.value, line, kind: node.type });
    if (node.type === 'strong' || (node.type === 'html' && /<\s*(?:strong|b)\b/i.test(node.value))) {
      strong.push({ line, quoted: ancestors.some((parent) => parent.type === 'blockquote') });
    }
    if (node.type === 'heading' && node.depth === 1) h1.push(line);
    if (node.type === 'html') {
      for (const match of node.value.matchAll(/\b(?:href|src)\s*=\s*["']([^"']+)["']/gi)) links.push({ href: match[1], line, kind: 'html' });
    }
  });
  const fields = [];
  for (const key of ['title', 'seoTitle', 'summary', 'featured_image_alt', 'featured_image_caption']) {
    if (typeof parsed.data[key] === 'string') fields.push({ key, text: parsed.data[key] });
  }
  for (const [index, item] of (Array.isArray(parsed.data.faq) ? parsed.data.faq : []).entries()) {
    for (const key of ['q', 'a']) if (typeof item?.[key] === 'string') fields.push({ key: `faq[${index}].${key}`, text: item[key] });
  }
  for (const field of fields) {
    const fieldTree = parser.parse(field.text);
    walk(fieldTree, (node) => {
      if (node.type === 'link') links.push({ href: node.url, kind: field.key, text: visibleText(node) });
      if (node.type === 'strong' || (node.type === 'html' && /<\s*(?:strong|b)\b/i.test(node.value))) strong.push({ field: field.key, quoted: false });
    });
  }
  return { path: file, raw, data: parsed.data, body, tree, paragraphs, headings, codePassages, fields, links, strong, h1, sha256: hash(raw) };
}

function buildInventory(contentRoot, contract) {
  const byKey = new Map();
  const identity = new Map();
  const counts = {};
  for (const [locale, dir] of Object.entries(contract.mapping)) {
    const absolute = path.join(contentRoot, path.basename(dir));
    const names = existsSync(absolute) ? readdirSync(absolute).filter((name) => name.endsWith('.md')) : [];
    counts[locale] = names.length;
    for (const name of names) {
      const file = path.resolve(absolute, name);
      const slug = contract.slugFromFilename(name);
      const key = `${locale}:${slug}`;
      byKey.set(key, [...(byKey.get(key) ?? []), file]);
      identity.set(file, { locale, slug });
    }
  }
  return { byKey, identity, counts };
}

function sourceUrls(doc) {
  return [...new Set(doc.links.flatMap(({ href }) => {
    try {
      const url = new URL(href);
      return ['https:', 'http:'].includes(url.protocol) && !SITE_HOSTS.has(url.hostname) ? [href] : [];
    } catch { return []; }
  }))];
}

function publicAssetPath(root, href) {
  if (!href) return null;
  const value = href.replace(/^\.\.\/images\//, '/images/blog/');
  if (!value.startsWith('/')) return null;
  const result = path.resolve(root, 'public', `.${decodeURI(value.split(/[?#]/)[0])}`);
  return result.startsWith(`${path.resolve(root, 'public')}${path.sep}`) ? result : null;
}

function staticPagePatterns(root) {
  const patterns = [];
  function visit(dir, segments = []) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory() && !entry.name.startsWith('__tests__') && !entry.name.startsWith('@')) visit(path.join(dir, entry.name), [...segments, entry.name]);
      else if (/^page\.(?:tsx|ts|jsx|js)$/.test(entry.name)) {
        const parts = segments.filter((segment) => !/^\(.*\)$/.test(segment));
        if (parts[0] === '[locale]' && !parts.some((part) => part.includes('...'))) patterns.push(parts.slice(1));
      }
    }
  }
  visit(path.join(root, 'src/app'));
  return patterns;
}

function verifyLink(link, row, context) {
  const { repoRoot, contentRoot, contract, inventory, patterns } = context;
  let url;
  try { url = new URL(link.href, `https://tseng-law.com/${row.locale}/columns/${row.slug}`); }
  catch { addError(row, 'link-malformed', 'Link cannot be parsed as a URL', link); return; }
  if (['mailto:', 'tel:'].includes(url.protocol)) return;
  if (!['http:', 'https:'].includes(url.protocol)) { addError(row, 'link-protocol', 'Unsupported link protocol', link); return; }
  if (!SITE_HOSTS.has(url.hostname)) return;
  let pathname;
  try { pathname = decodeURI(url.pathname).replace(/\/$/, ''); }
  catch { addError(row, 'link-malformed', 'Invalid percent encoding', link); return; }
  if (!pathname) return;
  const [locale, ...parts] = pathname.split('/').filter(Boolean);
  const segments = parts.join('/');
  if (!Object.hasOwn(contract.mapping, locale)) {
    const asset = publicAssetPath(repoRoot, pathname);
    if (!asset || !existsSync(asset)) addError(row, 'internal-link-missing', 'No supported locale or existing public asset at this path', link);
    return;
  }
  if (locale !== row.locale) addReview(row, 'cross-language-link', 'Confirm that the label explicitly identifies the source language and that no same-language page is available', link);
  if (parts[0] === 'columns' && parts[1] === 'issues') {
    const issueDir = path.join(contentRoot, 'issues', locale);
    const issueNames = contract.issueLocales.includes(locale) && existsSync(issueDir) ? readdirSync(issueDir).filter((file) => file.endsWith('.md')) : [];
    const available = parts.length === 2 ? issueNames.length > 0 : parts.length === 3 && issueNames.some((name) => name.replace(/^ISSUE-\d{8}-\d{2}-/, '').replace(/\.md$/, '') === parts[2]);
    if (!available) addError(row, 'internal-link-missing', 'Issue board/article is not present in this locale', link);
    return;
  }
  if (parts[0] === 'columns' && parts.length > 1) {
    const slug = contract.aliases[parts[1]] ?? parts[1];
    const destinations = inventory.byKey.get(`${locale}:${slug}`) ?? [];
    if (parts.length !== 2 || destinations.length !== 1) {
      addError(row, 'internal-link-missing', 'Column link must resolve to one actual file in the requested language', { ...link, matches: destinations.map((file) => relative(repoRoot, file)) });
    } else if (url.hash) {
      if (/^#sec-\d+$/.test(url.hash)) {
        try {
          const target = readDocument(destinations[0]);
          const sections = target.tree.children.filter((node) => node.type === 'heading' && node.depth === 2).length;
          const index = Number(url.hash.slice(5));
          if (index < 1 || index > sections) addError(row, 'internal-anchor-missing', 'Section number does not exist in the target column', link);
        } catch { addError(row, 'internal-target-invalid', 'Linked column cannot be parsed', link); }
      } else addReview(row, 'internal-anchor-review', 'Custom anchor requires rendered-page verification', link);
    }
    return;
  }
  if (contract.guidance.includes(locale)) {
    const known = segments === '' || contract.guidanceRoutes.includes(segments) || (locale === 'vi' && segments === 'criminal-litigation');
    if (!known) addError(row, 'internal-link-missing', 'Guidance locale does not publish this route', link);
    else if (url.hash) addReview(row, 'internal-anchor-review', 'Check the rendered core-page anchor', link);
    return;
  }
  const fixed = patterns.some((pattern) => pattern.every((part) => !part.startsWith('[')) && pattern.join('/') === segments);
  const dynamic = patterns.some((pattern) => pattern.length === parts.length && pattern.every((part, i) => /^\[[^\]]+\]$/.test(part) || part === parts[i]));
  if (!fixed && !dynamic) addError(row, 'internal-link-missing', 'No public route found in the App Router tree', link);
  else if (!fixed) addReview(row, 'dynamic-route-review', 'Dynamic route exists; its published record and final HTTP response still require verification', link);
  if (url.hash) addReview(row, 'internal-anchor-review', 'Check the rendered page anchor', link);
}

function numericEvidence(doc) {
  const passages = [...doc.fields, ...doc.paragraphs, ...doc.headings, ...doc.codePassages];
  const tokens = new Map();
  const evidence = [];
  for (const passage of passages) {
    // Preserve spelling, separators and script. Do not assume 1.000 = 1,000, or turn an unknown word into zero.
    const found = [...passage.text.matchAll(/\p{N}+(?:(?:[.,٫٬:/‐‑–—-]|[\u00a0\u202f ])\p{N}+)*/gu)].map((match) => match[0]);
    for (const token of found) tokens.set(token, (tokens.get(token) ?? 0) + 1);
    if (found.length) evidence.push({ ...passage, tokens: found });
  }
  return { tokens, evidence };
}

function tokenDifference(left, right) {
  return [...left].flatMap(([token, count]) => count > (right.get(token) ?? 0) ? [{ token, count: count - (right.get(token) ?? 0) }] : []);
}

function checkDocument(row, target, source, context, publicationDate) {
  const { repoRoot, contract } = context;
  const data = target.data;
  for (const field of ['title', 'summary', 'published', 'lastmod', 'date_display', 'read_time', 'topic', 'featured_image']) {
    if (typeof data[field] !== 'string' || !data[field].trim()) addError(row, 'frontmatter-required', `Nonempty string required: ${field}`, { field });
  }
  for (const field of ['published', 'lastmod']) {
    if (typeof data[field] !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(data[field]) || Number.isNaN(Date.parse(data[field])) || new Date(data[field]).toISOString().slice(0, 10) !== data[field]) {
      addError(row, 'frontmatter-date', `Use an actual quoted ISO calendar date for ${field}`, { field });
    } else if (publicationDate && data[field] !== publicationDate) addError(row, 'publication-date', `${field} must match the selected release date`, { field, expected: publicationDate, actual: data[field] });
  }
  if (!Array.isArray(data.categories) || !data.categories.length || data.categories.some((value) => typeof value !== 'string' || !value.trim())) addError(row, 'frontmatter-categories', 'categories must be a nonempty string array');
  if (!contract.topics.includes(data.topic)) addError(row, 'frontmatter-topic', 'topic must be an actual public taxonomy identifier', { actual: data.topic ?? null });
  if (data.author !== 'legal-ai-assistant') addError(row, 'internal-author', 'Preserve author: legal-ai-assistant internally; this is not a public byline');
  const audience = contract.normalizeColumnAudience(data.audience);
  if (!Array.isArray(data.audience) || !data.audience.includes(row.locale)) addError(row, 'audience-not-local', 'New localizations require an explicit audience array containing their locale', { actual: data.audience ?? null, expected: row.locale });
  const visible = contract.filterMarketBoardColumns(row.locale, [{ slug: row.slug, audience }]).length === 1;
  row.board = { visible, audience, marketBoard: contract.isMarketBoardLocale(row.locale), basis: 'current repository filterMarketBoardColumns + normalizeColumnAudience' };
  if (!visible) addError(row, 'board-hidden', 'The current market-board filter hides this selected new column');
  const prose = target.paragraphs.map((item) => item.text).join('\n');
  const uniqueProse = [...new Set(target.paragraphs.map((item) => item.text))].join('\n');
  row.bodyMetrics = { lettersAndNumbers: letters(prose), uniqueParagraphLettersAndNumbers: letters(uniqueProse), paragraphs: target.paragraphs.length, h1: target.h1.length };
  if (letters(prose) < MIN_BODY_LETTERS || letters(uniqueProse) < MIN_UNIQUE_BODY_LETTERS) addError(row, 'body-too-short', 'Insufficient substantive visible prose (URLs, code and images do not count)', { minimumLettersAndNumbers: MIN_BODY_LETTERS, minimumUnique: MIN_UNIQUE_BODY_LETTERS, ...row.bodyMetrics });
  for (const passage of [...target.fields, ...target.paragraphs, ...target.headings]) if (PLACEHOLDER.test(passage.text)) addError(row, 'placeholder', 'Unfinished placeholder text', passage);
  for (const line of target.h1) addError(row, 'body-h1', 'New manuscripts must not repeat the page title as body H1', { line });
  for (const item of target.strong) {
    if (item.quoted) addReview(row, 'quoted-bold', 'Confirm that bold markers are literal quoted content rather than decoration', item);
    else addError(row, 'decorative-bold', 'Decorative strong/bold markup is prohibited', item);
  }
  for (const surface of [{ key: 'body', text: target.body }, ...target.fields]) {
    if (contract.stripColumnAttribution(surface.text) !== surface.text) addError(row, 'public-author', 'Recognized public author/byline found outside internal metadata', { field: surface.key });
  }
  const faq = data.faq;
  if (!Array.isArray(faq) || faq.length === 0) addError(row, 'faq-missing', 'New localized articles must preserve a nonempty FAQ array');
  else faq.forEach((item, index) => {
    if (!item || typeof item.q !== 'string' || !item.q.trim() || typeof item.a !== 'string' || !item.a.trim()) addError(row, 'faq-invalid', 'Each FAQ must contain nonempty q and a strings', { index });
  });
  for (const field of ['featured_image', 'social_image']) {
    if (typeof data[field] !== 'string') continue;
    const asset = publicAssetPath(repoRoot, data[field]);
    if (asset && !existsSync(asset)) addError(row, 'media-missing', 'Referenced local media does not exist', { field, value: data[field] });
    else if (!asset) addReview(row, 'remote-media-review', 'Remote or nonstandard media path needs rendered-page verification', { field, value: data[field] });
  }
  for (const link of target.links) verifyLink(link, row, context);
  addReview(row, 'public-output-and-native-prose', 'Inspect rendered title, summary, FAQ, captions, cards, JSON-LD and feeds for native language and author leakage; compare opening/headings/ending with the previous three same-language articles. Automated token checks cannot prove either.', { targetFields: target.fields });
  if (!source) { addReview(row, 'source-required', 'Select an accepted source with this full slug before meaning review'); return; }
  if (source.path !== target.path && cleanSpace(source.body) === cleanSpace(target.body)) addError(row, 'untranslated-body', 'Body is identical to the source-language article');
  for (const field of ['topic', 'featured_image', 'social_image', 'diagram', 'diagram_video']) {
    if ((source.data[field] ?? null) !== (data[field] ?? null)) addError(row, 'source-metadata-changed', `Preserve source ${field}`, { field, source: source.data[field] ?? null, target: data[field] ?? null });
  }
  const category = (doc) => contract.categoryFromString(typeof doc.data.categories?.[0] === 'string' ? doc.data.categories[0] : '');
  row.classification = { sourceCategory: category(source), targetCategory: category(target), topic: data.topic };
  if (row.classification.sourceCategory !== row.classification.targetCategory) addError(row, 'source-category-changed', 'Translated label resolves to a different public category identifier', { source: row.classification.sourceCategory, target: row.classification.targetCategory });
  const sourceFaq = Array.isArray(source.data.faq) ? source.data.faq : [];
  if (sourceFaq.length > (Array.isArray(faq) ? faq.length : 0)) addError(row, 'faq-source-omitted', 'Fewer FAQ entries than the accepted source; restore the omitted entry before review', { sourceCount: sourceFaq.length, targetCount: Array.isArray(faq) ? faq.length : 0 });
  const sourceExternal = sourceUrls(source);
  const targetExternal = sourceUrls(target);
  for (const url of sourceExternal) if (!targetExternal.includes(url)) addError(row, 'source-url-missing', 'A cited source URL was removed or changed; restore it or resolve an explicitly reviewed replacement before integration', { url });
  for (const url of targetExternal) if (!sourceExternal.includes(url)) addReview(row, 'source-url-added', 'Verify the added or localized source directly; a model assertion does not verify it', { url });
  row.sourceUrls = { expected: sourceExternal, actual: targetExternal, networkChecked: false };
  addReview(row, 'title-summary-faq', 'Compare legal subject and scope in title, summary and every FAQ; presence/count is not semantic preservation. Check translated category labels and captions too.', {
    source: { title: source.data.title, seoTitle: source.data.seoTitle, summary: source.data.summary, faq: source.data.faq, categories: source.data.categories, featured_image_caption: source.data.featured_image_caption },
    target: { title: data.title, seoTitle: data.seoTitle, summary: data.summary, faq: data.faq, categories: data.categories, featured_image_caption: data.featured_image_caption },
  });
  const sourcePassages = [...source.paragraphs, ...source.headings, ...source.fields.filter((item) => item.key.startsWith('faq'))];
  const targetPassages = [...target.paragraphs, ...target.headings, ...target.fields.filter((item) => item.key.startsWith('faq'))];
  addReview(row, 'legal-conditions', 'Verify every source actor, must/may, AND/OR, exception, eligibility, starting date, period, amount, quotation and factual qualifier against the full target. Passage order/count need not match. No heuristic clears this item.', {
    sourcePassages, sourceConditionHints: sourcePassages.filter((item) => CONDITION_HINT.test(item.text)), targetPassages,
    sourceMarkdown: source.body, targetMarkdown: target.body,
  });
  const sourceNumbers = numericEvidence(source);
  const targetNumbers = numericEvidence(target);
  addReview(row, 'numbers-dates-currencies', 'Raw numeric-token differences require context review; locale separators, spelled-out numerals and era conversions are not automatically equivalent. Matching tokens also do not prove matching conditions. No values are synthesized or zero-filled.', {
    sourceOnly: tokenDifference(sourceNumbers.tokens, targetNumbers.tokens), targetOnly: tokenDifference(targetNumbers.tokens, sourceNumbers.tokens),
    sourceEvidence: sourceNumbers.evidence, targetEvidence: targetNumbers.evidence,
    editorialMetadata: { source: { published: source.data.published, lastmod: source.data.lastmod, date_display: source.data.date_display, read_time: source.data.read_time }, target: { published: data.published, lastmod: data.lastmod, date_display: data.date_display, read_time: data.read_time } },
    spelledOutNumerals: 'Not completely parsed in 49 languages. Review the full source/target passages; absence from these arrays is not zero or PASS.',
  });
  addReview(row, 'nationality-jurisdiction', 'A language does not establish nationality. Verify Taiwan jurisdiction, immigration status, nationality qualifications and any foreign-law/consular claim throughout the text; the highlighted passages are incomplete hints, not a language classifier.', {
    sourceHints: sourcePassages.filter((item) => COUNTRY_HINT.test(item.text)), targetHints: targetPassages.filter((item) => COUNTRY_HINT.test(item.text)),
    sourceLocale: row.source?.locale, targetLocale: row.locale,
  });
}

export async function auditBatch({ repoRoot = DEFAULT_ROOT, contentRoot, files, sourceLocale = 'en', sourceMap = {}, publicationDate = null }) {
  repoRoot = path.resolve(repoRoot);
  contentRoot = path.resolve(contentRoot ?? path.join(repoRoot, 'src/content'));
  if (!Array.isArray(files) || files.length === 0) throw new Error('Explicit nonempty files selection is required');
  const contract = readRuntimeContract(repoRoot);
  if (!Object.hasOwn(contract.mapping, sourceLocale)) throw new Error(`Unknown source locale: ${sourceLocale}`);
  const inventory = buildInventory(contentRoot, contract);
  const patterns = staticPagePatterns(repoRoot);
  const context = { repoRoot, contentRoot, contract, inventory, patterns };
  const results = [];
  for (const file of [...new Set(files.map((value) => path.resolve(repoRoot, value)))]) {
    const identity = inventory.identity.get(file);
    const row = { file: relative(repoRoot, file), locale: identity?.locale ?? null, slug: identity?.slug ?? null, errors: [], reviews: [] };
    results.push(row);
    if (!existsSync(file)) { addError(row, 'file-missing', 'Explicitly requested file does not exist'); continue; }
    if (!identity) { addError(row, 'unsupported-content-path', 'Selected file is not in a registered professional-column directory'); continue; }
    const duplicates = inventory.byKey.get(`${row.locale}:${row.slug}`);
    if (duplicates.length > 1) addError(row, 'duplicate-locale-slug', 'Different files resolve to the same locale and full public slug', { paths: duplicates.map((value) => relative(repoRoot, value)) });
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(row.slug)) addError(row, 'slug-invalid', 'Runtime slug is not lowercase ASCII kebab-case');
    if (/^\d+-/.test(row.slug)) addError(row, 'numeric-prefix-in-url', 'The runtime loader did not strip the file number; inspect numbering before publishing');
    let target;
    try { target = readDocument(file); }
    catch (error) { addError(row, 'frontmatter-parse', error.message); continue; }
    row.sha256 = target.sha256;
    const mapped = sourceMap[row.file] ?? sourceMap[`${row.locale}:${row.slug}`];
    const sourcePaths = mapped ? [path.resolve(repoRoot, mapped)] : inventory.byKey.get(`${sourceLocale}:${row.slug}`) ?? [];
    let source;
    if (sourcePaths.length !== 1 || !existsSync(sourcePaths[0])) addError(row, 'source-missing-or-ambiguous', 'Accepted source must resolve by full slug to exactly one file', { sourceLocale, matches: sourcePaths.map((value) => relative(repoRoot, value)) });
    else if (sourcePaths[0] === file) addError(row, 'source-is-target', 'An article cannot be its own translation source');
    else if (contract.slugFromFilename(path.basename(sourcePaths[0])) !== row.slug) addError(row, 'source-slug-mismatch', 'Source mapping points to a different full slug');
    else {
      try {
        source = readDocument(sourcePaths[0]);
        row.source = { file: relative(repoRoot, source.path), locale: inventory.identity.get(source.path)?.locale ?? sourceLocale, sha256: source.sha256 };
      } catch (error) { addError(row, 'source-parse', error.message); }
    }
    checkDocument(row, target, source, context, publicationDate);
  }
  const errors = results.reduce((sum, row) => sum + row.errors.length, 0);
  return {
    version: 1, generatedAt: new Date().toISOString(), repoRoot, selectedFiles: results.length,
    automatedStatus: errors ? 'FAIL' : 'PASS', semanticStatus: 'REVIEW_REQUIRED', publicationReady: false,
    errors, reviewItems: results.reduce((sum, row) => sum + row.reviews.length, 0),
    policy: { minBodyLettersAndNumbers: MIN_BODY_LETTERS, minUniqueParagraphLettersAndNumbers: MIN_UNIQUE_BODY_LETTERS, sourceLocale, publicationDate, legacyPolicy: 'Unselected files supply existence/duplicate context only; no content changes or audience changes are made.', sourceApproval: 'The operator must select an accepted source; existence/hash is not evidence of legal approval.' },
    runtimeContractHashes: contract.hashes,
    inventory: { counts: inventory.counts, duplicateKeys: [...inventory.byKey].filter(([, values]) => values.length > 1).map(([key, values]) => ({ key, files: values.map((value) => relative(repoRoot, value)) })) },
    files: results,
  };
}

function usage() {
  return `Usage: node content-audit.mjs --files <path or quoted glob> [more paths] [--source-locale en] [--publication-date YYYY-MM-DD] [--json report.json] [--errors-only]\n       node content-audit.mjs --batch arc-first-6 [--locales ru,ms,fil,tr,nl,zh-hans] [--json report.json]\nOptional: --repo <path>, --source-map <JSON mapping target path or locale:full-slug to source path>\nExit: 1 automatic errors; 2 input/runtime failure; 3 automatic checks pass but meaning review required. --errors-only changes only 3 to 0. No article is edited.`;
}

export async function main(argv) {
  const args = { repoRoot: DEFAULT_ROOT, patterns: [], sourceLocale: 'en', sourceMap: {}, publicationDate: null, errorsOnly: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const take = () => {
      if (!argv[i + 1] || argv[i + 1].startsWith('--')) throw new Error(`${arg} requires a value`);
      return argv[++i];
    };
    if (arg === '--help' || arg === '-h') { console.log(usage()); return 0; }
    if (arg === '--repo') args.repoRoot = path.resolve(take());
    else if (arg === '--files') { args.patterns.push(take()); while (argv[i + 1] && !argv[i + 1].startsWith('--')) args.patterns.push(argv[++i]); }
    else if (arg === '--source-locale') args.sourceLocale = take();
    else if (arg === '--source-map') args.sourceMapPath = take();
    else if (arg === '--publication-date') args.publicationDate = take();
    else if (arg === '--batch') args.batch = take();
    else if (arg === '--locales') args.locales = take().split(',');
    else if (arg === '--json') args.json = take();
    else if (arg === '--errors-only') args.errorsOnly = true;
    else throw new Error(`Unknown option ${arg}`);
  }
  if (!args.batch && !args.patterns.length) throw new Error(usage());
  if (args.batch && args.patterns.length) throw new Error('Use --batch or --files, not both');
  if (args.locales && !args.batch) throw new Error('--locales is only supported with --batch');
  if (args.sourceMapPath) args.sourceMap = JSON.parse(readFileSync(path.resolve(args.repoRoot, args.sourceMapPath), 'utf8'));
  let files = [];
  if (args.batch) {
    if (args.batch !== 'arc-first-6') throw new Error(`Unknown batch ${args.batch}`);
    const locales = args.locales ?? FIRST_BATCH.locales;
    if (!locales.length || locales.some((locale) => !FIRST_BATCH.locales.includes(locale))) throw new Error('Unknown locale in arc-first-6 selection');
    files = locales.flatMap((locale) => FIRST_BATCH.files.map((file) => `src/content/columns-${locale}/${file}`));
    args.publicationDate ??= '2026-10-25';
  } else {
    for (const pattern of args.patterns) {
      if (/[*?\[\]{}]/.test(pattern)) {
        const matches = globSync(pattern, { cwd: args.repoRoot });
        if (!matches.length) throw new Error(`Selection matched zero files: ${pattern}`);
        files.push(...matches);
      } else files.push(pattern);
    }
  }
  const report = await auditBatch({ ...args, files });
  for (const row of report.files) {
    console.log(`${row.errors.length ? 'FAIL' : 'AUTO_OK'} ${row.file} — ${row.errors.length} errors, ${row.reviews.length} required review items`);
    for (const error of row.errors) console.log(`  ERROR ${error.code}: ${error.message}${error.href ? ` (${error.href})` : error.url ? ` (${error.url})` : ''}`);
    const numeric = row.reviews.find((item) => item.code === 'numbers-dates-currencies');
    if (numeric) console.log(`  REVIEW numeric token differences: ${numeric.sourceOnly.length} source-only / ${numeric.targetOnly.length} target-only; context in JSON`);
  }
  console.log(`Automated: ${report.automatedStatus}; selected=${report.selectedFiles}; errors=${report.errors}; semantic=${report.semanticStatus}; publicationReady=false`);
  if (args.json) {
    const target = path.resolve(args.repoRoot, args.json);
    if (target.startsWith(`${path.resolve(args.repoRoot, 'src')}${path.sep}`)) throw new Error('Report output must not overwrite source files');
    mkdirSync(path.dirname(target), { recursive: true });
    writeFileSync(target, `${JSON.stringify(report, null, 2)}\n`);
    console.log(`Review evidence: ${target}`);
  }
  return report.errors ? 1 : args.errorsOnly ? 0 : 3;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).then((code) => { process.exitCode = code; }).catch((error) => {
    console.error(error.message); process.exitCode = 2;
  });
}
