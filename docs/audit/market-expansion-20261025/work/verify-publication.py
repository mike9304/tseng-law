#!/usr/bin/env python3
"""Read-only local/live verification of an explicitly counted Codex column inventory.

Requires the final extractor's {path, route, sha256, html} entries. Source metadata
is read directly with the repository's gray-matter. Only --out JSON is written.
This checks HTML/data/asset bytes, not browser visibility or interaction.
"""
import argparse
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import subprocess
import sys
import unicodedata
from urllib.parse import unquote, urljoin, urlsplit
import urllib.request
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
VOID = set('area base br col embed hr img input link meta param source track wbr'.split())
BLOCKS = set('p h1 h2 h3 h4 h5 h6 li blockquote table'.split())
BREAKS = BLOCKS | set('div section article main nav header footer ul ol br hr thead tbody tr th td dl dt dd'.split())
# src/app/[locale]/layout.tsx and src/lib/seo.ts: core locales use a brand
# suffix; the ten guidance locales use the authored page title alone.
TITLE_BRANDS = {'ko': '법무법인 호정', 'zh-hant': '昊鼎國際法律事務所',
                'en': 'Hovering Law', 'ja': '昊鼎国際法律事務所'}


def now():
    return datetime.now(timezone.utc).isoformat()


def digest(raw):
    return hashlib.sha256(raw).hexdigest()


def norm(value):
    return re.sub(r'\s+', ' ', unicodedata.normalize('NFC', str(value or ''))).strip()


class SourceText(HTMLParser):
    """Original ARC block parser, independent of the application's stripping."""
    def __init__(self):
        super().__init__()
        self.text, self.links, self.blocks, self.buffer = [], [], [], []
        self.ignore = self.depth = 0
        self.active = None

    def add(self, value):
        self.text.append(value)
        if self.active:
            self.buffer.append(value)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in ('script', 'style', 'svg'):
            self.ignore += 1
        if self.ignore:
            return
        if tag == 'a':
            self.links.append(attrs.get('href', ''))
        if tag in BLOCKS and not self.active:
            self.active, self.depth, self.buffer = tag, 0, []
        if tag == self.active:
            self.depth += 1
        if tag in BREAKS:
            self.add(' ')

    def handle_endtag(self, tag):
        if tag in ('script', 'style', 'svg') and self.ignore:
            self.ignore -= 1
            return
        if self.ignore:
            return
        if tag in BREAKS:
            self.add(' ')
        if tag == self.active:
            self.depth -= 1
            if self.depth == 0:
                self.blocks.append(norm(''.join(self.buffer)))
                self.active = None

    def handle_data(self, value):
        if not self.ignore:
            self.add(value)


class Page(HTMLParser):
    """Capture the markdown container; recommendations cannot satisfy checks."""
    def __init__(self):
        super().__init__()
        self.stack, self.links, self.primary_links = [], [], []
        self.primary, self.titles, self.h1, self.captions = [], [], [], []
        self.questions, self.answers, self.schemas, self.schema_errors = [], [], [], []
        self.hero, self.canonicals, self.metadata, self.html_attrs = [], [], {}, {}
        self.primary_containers = self.recommendations = 0

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        parent = self.stack[-1] if self.stack else {}
        frame = {'tag': tag, 'ignore': parent.get('ignore', False) or tag in ('script', 'style', 'svg'),
                 'recommendation': parent.get('recommendation', False) or 'data-recommended-for-you' in attrs,
                 'primary': parent.get('primary', False) or attrs.get('data-column-content') == 'markdown',
                 'captures': list(parent.get('captures', []))}
        classes = attrs.get('class', '').split()
        if attrs.get('data-column-content') == 'markdown':
            self.primary_containers += 1
        if 'data-recommended-for-you' in attrs:
            self.recommendations += 1
        for condition, target in [(tag == 'title', self.titles), (tag == 'h1', self.h1),
                                  (attrs.get('id') == 'column-image-caption', self.captions),
                                  ('column-faq-question' in classes, self.questions),
                                  ('column-faq-answer' in classes, self.answers)]:
            if condition:
                target.append([])
                frame['captures'].append(target[-1])
        if tag == 'script' and attrs.get('type') == 'application/ld+json':
            frame['json_ld'] = []
        if tag == 'html':
            self.html_attrs = attrs
        if tag == 'link' and attrs.get('rel') == 'canonical':
            self.canonicals.append(attrs.get('href'))
        if tag == 'meta':
            key = attrs.get('name') or attrs.get('property')
            if key:
                self.metadata.setdefault(key, []).append(attrs.get('content', ''))
        if tag == 'img' and 'blog-hero-img' in classes:
            self.hero.append(attrs)
        if tag == 'a' and not frame['ignore']:
            self.links.append(attrs.get('href', ''))
            if frame['primary'] and not frame['recommendation']:
                self.primary_links.append(attrs.get('href', ''))
        if tag in BREAKS:
            self.add(' ', frame)
        if tag not in VOID:
            self.stack.append(frame)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID:
            self.handle_endtag(tag)

    def add(self, text, frame):
        if frame.get('ignore'):
            return
        for target in frame.get('captures', []):
            target.append(text)
        if frame.get('primary') and not frame.get('recommendation'):
            self.primary.append(text)

    def handle_data(self, text):
        if not self.stack:
            return
        frame = self.stack[-1]
        if 'json_ld' in frame:
            frame['json_ld'].append(text)
        self.add(text, frame)

    def handle_endtag(self, tag):
        index = next((i for i in range(len(self.stack) - 1, -1, -1) if self.stack[i]['tag'] == tag), None)
        if index is None:
            return
        frame = self.stack[index]
        if tag in BREAKS:
            self.add(' ', frame)
        if 'json_ld' in frame:
            try:
                self.schemas.extend(schema_nodes(json.loads(''.join(frame['json_ld']))))
            except (ValueError, TypeError) as error:
                self.schema_errors.append(str(error))
        del self.stack[index:]


def schema_nodes(value):
    if isinstance(value, list):
        return [node for item in value for node in schema_nodes(item)]
    if isinstance(value, dict):
        return [value] + schema_nodes(value.get('@graph', []))
    return []


def texts(items):
    return [norm(''.join(item)) for item in items]


def ordered_missing(wanted, actual, text=False):
    cursor, missing = 0, []
    for index, item in enumerate(wanted):
        if not item:
            continue
        try:
            position = actual.index(item, cursor)
            cursor = position + (len(item) if text else 1)
        except ValueError:
            missing.append({'index': index + 1, 'value': item})
    return missing


def image_path(raw):
    return re.sub(r'^\.\./images/', '/images/blog/', raw.strip())


def comparable_link(href):
    # The renderer adds localized subject/body to mailto links. Preserve the
    # recipient while keeping every HTTP(S) source URL, including query, exact.
    parts = urlsplit(href)
    return 'mailto:' + unquote(parts.path) if parts.scheme == 'mailto' else href


def document_title(entry):
    title = (entry['seoTitle'] or entry['title']).strip()
    brands = sorted(set(TITLE_BRANDS.values()) | {'Hovering International Law Firm'}, key=len, reverse=True)
    previous = None
    while previous != title:
        previous = title
        for brand in brands:
            title = re.sub(r'\s*[|｜—–-]\s*' + re.escape(brand) + r'$', '', title).strip()
    return title + ' | ' + TITLE_BRANDS[entry['locale']] if entry['locale'] in TITLE_BRANDS else title


def check_page(entry, body, raw, args):
    page, source = Page(), SourceText()
    page.feed(raw.decode('utf-8'))
    source.feed(body['html'])
    errors = []

    def equal(field, actual, expected):
        if actual != expected:
            errors.append({'field': field, 'expected': expected, 'actual': actual})

    expected_url = args.canonical_origin.rstrip('/') + entry['route']
    equal('canonical', page.canonicals, [expected_url])
    equal('language', page.html_attrs.get('lang', '').lower(), entry['locale'].lower())
    equal('direction', page.html_attrs.get('dir'), 'rtl' if entry['locale'] == 'ar' else 'ltr')
    equal('visibleTitle', texts(page.h1), [norm(entry['title'])])
    equal('seoTitle', texts(page.titles), [norm(document_title(entry))])
    for key, expected in [('description', entry['summary']), ('og:description', entry['summary']),
                          ('twitter:description', entry['summary']), ('og:title', entry['seoTitle'] or entry['title']),
                          ('twitter:title', entry['seoTitle'] or entry['title'])]:
        equal(key, [norm(x) for x in page.metadata.get(key, [])], [norm(expected)])
    if any('noindex' in value.lower() for value in page.metadata.get('robots', [])):
        errors.append({'field': 'robots', 'actual': page.metadata['robots']})
    if not page.primary_containers:
        errors.append({'field': 'primaryContainer', 'expected': 'data-column-content=markdown'})
    primary = norm(''.join(page.primary))
    missing_blocks = ordered_missing(source.blocks, primary, text=True)
    missing_links = ordered_missing([comparable_link(x) for x in source.links],
                                    [comparable_link(x) for x in page.primary_links])
    if missing_blocks:
        errors.append({'field': 'primaryBodyBlocks', 'missingOrReordered': missing_blocks})
    if missing_links:
        errors.append({'field': 'primaryBodyLinks', 'missingOrReordered': missing_links})
    faq = [(norm(x['q']), norm(x['a'])) for x in entry['faq']]
    equal('visibleFaqQuestions', texts(page.questions), [x[0] for x in faq])
    equal('visibleFaqAnswers', texts(page.answers), [x[1] for x in faq])
    faq_schemas = [x for x in page.schemas if x.get('@type') == 'FAQPage']
    article_schemas = [x for x in page.schemas if x.get('@type') == 'Article']
    equal('FAQPageCount', len(faq_schemas), 1)
    equal('ArticleCount', len(article_schemas), 1)
    if page.schema_errors:
        errors.append({'field': 'jsonLdParse', 'errors': page.schema_errors})
    if len(faq_schemas) == 1:
        equal('jsonLdFaq', [(norm(x.get('name')), norm(x.get('acceptedAnswer', {}).get('text')))
                           for x in faq_schemas[0].get('mainEntity', [])], faq)
    if len(article_schemas) == 1:
        article = article_schemas[0]
        equal('jsonLdHeadline', norm(article.get('headline')), norm(entry['title']))
        equal('jsonLdDescription', norm(article.get('description')), norm(entry['summary']))
        equal('jsonLdPublished', article.get('datePublished'), entry['published'])
        if 'author' in article:
            errors.append({'field': 'jsonLdAuthor', 'expected': 'absent'})
    equal('heroImageCount', len(page.hero), 1)
    expected_path = image_path(entry['featured_image'])
    hero_url = None
    if len(page.hero) == 1:
        hero = page.hero[0]
        hero_url = urljoin(args.origin.rstrip('/') + '/', hero.get('src', ''))
        parts = urlsplit(hero_url)
        allowed_hosts = {urlsplit(x).netloc for x in (args.origin, args.media_origin, args.canonical_origin)}
        equal('heroImagePath', unquote(parts.path), expected_path)
        if parts.scheme not in ('http', 'https') or parts.netloc not in allowed_hosts or parts.query or parts.fragment:
            errors.append({'field': 'heroImageOriginOrQuery', 'actual': hero_url})
        equal('heroAlt', norm(hero.get('alt')), norm(entry['featured_image_alt'] or entry['title']))
        if entry['featured_image_caption']:
            equal('heroCaptionReference', hero.get('aria-describedby'), 'column-image-caption')
    equal('heroCaption', texts(page.captions), [norm(entry['featured_image_caption'])] if entry['featured_image_caption'] else [])
    return {'route': entry['route'], 'path': entry['path'], 'sourceSha256': entry['sha256'],
            'htmlSha256': digest(raw), 'bodyBlocks': len(source.blocks), 'bodyLinks': len(source.links),
            'externalSourceLinks': sum(x.startswith(('http://', 'https://')) for x in source.links),
            'primaryContainers': page.primary_containers, 'recommendationSectionsExcluded': page.recommendations,
            'primaryTextExact': primary == norm(''.join(source.text)), 'faqPairs': len(faq),
            'heroUrl': hero_url, 'expectedImagePath': expected_path, 'errors': errors}


NODE_METADATA = r"""
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const {createRequire} = require('node:module');
const input = JSON.parse(fs.readFileSync(0, 'utf8'));
const matter = createRequire(path.join(input.repo, 'package.json'))('gray-matter');
const string = x => typeof x === 'string' ? x.trim() : x instanceof Date ? x.toISOString().slice(0,10) : '';
process.stdout.write(JSON.stringify(input.entries.map(e => {
  const raw = fs.readFileSync(path.join(input.repo, e.source_path));
  const {data} = matter(raw.toString('utf8'));
  const result = {path:e.source_path, route:e.route, locale:e.locale,
    sha256:crypto.createHash('sha256').update(raw).digest('hex')};
  for (const key of ['title','seoTitle','summary','published','featured_image','featured_image_alt','featured_image_caption']) result[key] = string(data[key]);
  result.faq = Array.isArray(data.faq) ? data.faq.map(x => ({q:string(x.q), a:string(x.a)})) : [];
  return result;
})));
"""


def load_inputs(args):
    inventory_raw, bodies_raw = args.inventory.read_bytes(), args.bodies.read_bytes()
    inventory = [x for x in json.loads(inventory_raw)['records'] if x.get('included_in_codex_scope')]
    if len(inventory) != args.expected_count or len({x['route'] for x in inventory}) != args.expected_count:
        raise ValueError(f'Inventory must contain exactly {args.expected_count} distinct Codex routes.')
    bodies_list = json.loads(bodies_raw)
    bodies = {x['path']: x for x in bodies_list}
    paths = {x['source_path'] for x in inventory}
    if len(bodies_list) != args.expected_count or set(bodies) != paths:
        raise ValueError(f'Source body manifest must cover exactly the inventory {args.expected_count} paths.')
    run = subprocess.run(['node', '-e', NODE_METADATA], input=json.dumps({'repo': str(args.repo), 'entries': inventory}),
                         capture_output=True, text=True, timeout=45, cwd=args.repo)
    if run.returncode:
        raise ValueError('Source metadata reader failed: ' + run.stderr[-1200:])
    entries = json.loads(run.stdout)
    for entry in entries:
        body = bodies[entry['path']]
        if body.get('route') != entry['route'] or body.get('sha256') != entry['sha256']:
            raise ValueError('Stale/missing source-body SHA or route: ' + entry['path'])
        for key in ('title', 'summary', 'published', 'featured_image', 'featured_image_alt', 'featured_image_caption'):
            if not entry[key]:
                raise ValueError('Missing final metadata ' + key + ': ' + entry['path'])
        if not entry['faq'] or any(not x['q'] or not x['a'] for x in entry['faq']):
            raise ValueError('Missing or incomplete source FAQ: ' + entry['path'])
        expected = image_path(entry['featured_image'])
        if not expected.startswith('/images/') or 'placeholder' in expected.lower():
            raise ValueError('Expected a real final local hero image: ' + entry['path'])
        asset = (args.repo / 'public' / expected.lstrip('/')).resolve()
        if not asset.is_relative_to((args.repo / 'public').resolve()):
            raise ValueError('Image path escapes repo/public: ' + expected)
        raw = asset.read_bytes()
        if not raw:
            raise ValueError('Empty image: ' + expected)
        entry['imageSha256'], entry['imageBytes'] = digest(raw), len(raw)
    return entries, bodies, {'inventorySha256': digest(inventory_raw), 'bodyManifestSha256': digest(bodies_raw),
                            'verifierSha256': digest(Path(__file__).read_bytes())}


class Reader:
    def __init__(self, args):
        self.args, self.resolve = args, []
        if args.mode == 'live' and args.doh:
            for host in sorted({urlsplit(args.origin).hostname, urlsplit(args.media_origin).hostname}):
                request = urllib.request.Request('https://1.1.1.1/dns-query?name=' + host + '&type=A',
                                                 headers={'Accept': 'application/dns-json'})
                answer = json.load(urllib.request.urlopen(request, timeout=args.timeout))
                address = next(x['data'] for x in answer.get('Answer', []) if x['type'] == 1)
                self.resolve += ['--resolve', host + ':443:' + address]

    def get(self, route=None, asset=None):
        if self.args.mode == 'local':
            if asset:
                candidates = [self.args.html_root / asset.lstrip('/'), self.args.media_root / asset.lstrip('/')]
            else:
                rel = route.lstrip('/')
                candidates = [self.args.html_root / rel] if rel.endswith(('.json', '.xml')) else [self.args.html_root / (rel + '.html'), self.args.html_root / rel / 'index.html']
            found = next((x for x in candidates if x.is_file()), None)
            if not found:
                return {'ok': False, 'status': 'MISSING', 'error': str(candidates[0]), 'body': b''}
            raw = found.read_bytes()
            return {'ok': True, 'status': 'LOCAL_FILE', 'file': str(found), 'body': raw, 'sha256': digest(raw)}
        url = asset if asset else self.args.origin.rstrip('/') + route
        marker = b'\n__TSENG_VERIFY_HTTP__\n'
        command = ['curl', '--silent', '--show-error', '--fail', '--location', '--compressed',
                   '--connect-timeout', '10', '--max-time', str(self.args.timeout),
                   '--header', 'Cache-Control: no-cache', *self.resolve, '--write-out',
                   marker.decode() + '%{http_code}\t%{content_type}\t%{url_effective}', url]
        run = subprocess.run(command, capture_output=True, timeout=self.args.timeout + 5)
        raw, _, metadata = run.stdout.rpartition(marker)
        fields = metadata.decode(errors='replace').split('\t')
        status = fields[0] if fields else ''
        return {'ok': run.returncode == 0 and status == '200', 'status': status, 'exit': run.returncode,
                'contentType': fields[1] if len(fields) > 1 else '', 'effectiveUrl': fields[2] if len(fields) > 2 else '',
                'error': run.stderr.decode(errors='replace')[-800:], 'body': raw, 'sha256': digest(raw)}


def evidence(response):
    return {key: value for key, value in response.items() if key != 'body'}


def verify(args):
    entries, bodies, inputs = load_inputs(args)
    reader = Reader(args)
    errors, warnings = [], []

    def build():
        response = reader.get('/build-info.json')
        if not response['ok']:
            raise ValueError('build-info unavailable: ' + json.dumps(evidence(response)))
        return json.loads(response['body'])

    before = build()
    if args.expected_commit and before.get('commit') != args.expected_commit:
        raise ValueError('Unexpected starting build commit: ' + str(before.get('commit')))

    def article(entry):
        try:
            response = reader.get(entry['route'])
            if not response['ok']:
                return {'route': entry['route'], 'path': entry['path'], 'read': evidence(response), 'errors': [{'field': 'articleRead'}]}
            row = check_page(entry, bodies[entry['path']], response['body'], args)
            row['read'] = evidence(response)
            return row
        except Exception as error:
            return {'route': entry['route'], 'path': entry['path'], 'errors': [{'field': 'articleException', 'message': str(error)}]}

    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        rows = list(pool.map(article, entries))
    images = {}
    for entry, row in zip(entries, rows):
        if row.get('heroUrl') and not any(x['field'] in ('heroImagePath', 'heroImageOriginOrQuery') for x in row['errors']):
            key = row['heroUrl']
            wanted = {'url': key, 'path': row['expectedImagePath'], 'expectedSha256': entry['imageSha256'], 'expectedBytes': entry['imageBytes']}
            if key in images and images[key]['expectedSha256'] != wanted['expectedSha256']:
                errors.append({'field': 'conflictingExpectedAssetHashes', 'url': key})
            images[key] = wanted

    def image(item):
        try:
            response = reader.get(asset=item['url'] if args.mode == 'live' else item['path'])
            result = {**item, 'read': evidence(response), 'actualBytes': len(response['body']),
                      'sha256Matches': response.get('sha256') == item['expectedSha256'], 'errors': []}
            if not response['ok'] or not result['sha256Matches']:
                result['errors'].append('Image unavailable or bytes differ from repo/public.')
            if args.mode == 'live' and not response.get('contentType', '').lower().startswith('image/'):
                result['errors'].append('Image response Content-Type is not image/*.')
            return result
        except Exception as error:
            return {**item, 'errors': [str(error)]}

    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        image_rows = list(pool.map(image, images.values()))

    def listing(locale):
        response = reader.get('/' + locale + '/columns')
        result = {'locale': locale, 'read': evidence(response), 'articles': [], 'errors': []}
        if not response['ok']:
            result['errors'].append('Index unavailable')
            return result
        raw = response['body'].decode('utf-8')
        page = Page(); page.feed(raw)
        if page.html_attrs.get('lang', '').lower() != locale.lower():
            result['errors'].append('Incorrect index document language')
        allowed_hosts = {urlsplit(args.canonical_origin).netloc, urlsplit(args.origin).netloc}
        parsed_links = [urlsplit(urljoin(args.canonical_origin, href)) for href in page.links]
        links = {link.path for link in parsed_links if link.scheme in ('http', 'https') and link.netloc in allowed_hosts}
        for entry in [x for x in entries if x['locale'] == locale]:
            slug = entry['route'].rsplit('/', 1)[1]
            serialized = ('"slug":"' + slug + '"') in raw or ('\\"slug\\":\\"' + slug + '\\"') in raw
            state = 'direct_anchor' if entry['route'] in links else 'serialized_slug_only' if serialized else 'not_found'
            result['articles'].append({'route': entry['route'], 'discovery': state})
        return result

    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        indexes = list(pool.map(listing, sorted({x['locale'] for x in entries})))
    sitemap_response = reader.get('/sitemap.xml')
    locations = set()
    if sitemap_response['ok']:
        locations = {node.text for node in ET.fromstring(sitemap_response['body']).iter() if node.tag.endswith('}loc') or node.tag == 'loc'}
    missing = [x['route'] for x in entries if args.canonical_origin.rstrip('/') + x['route'] not in locations]
    sitemap = {'read': evidence(sitemap_response), 'present': len(entries) - len(missing), 'missing': missing}
    if not sitemap_response['ok'] or missing:
        errors.append({'field': 'sitemap', 'missing': missing})
    after = build()
    if before != after:
        errors.append({'field': 'buildChangedDuringReadback', 'before': before, 'after': after})
    for entry in entries:
        if digest((args.repo / entry['path']).read_bytes()) != entry['sha256']:
            errors.append({'field': 'sourceChangedDuringReadback', 'path': entry['path']})
        asset = args.repo / 'public' / image_path(entry['featured_image']).lstrip('/')
        if digest(asset.read_bytes()) != entry['imageSha256']:
            errors.append({'field': 'imageChangedDuringReadback', 'path': str(asset)})
    if digest(args.bodies.read_bytes()) != inputs['bodyManifestSha256'] or digest(args.inventory.read_bytes()) != inputs['inventorySha256']:
        errors.append({'field': 'inputManifestChangedDuringReadback'})
    for row in rows:
        if row['errors']:
            errors.append({'field': 'article', 'route': row['route'], 'count': len(row['errors'])})
    for row in image_rows:
        if row['errors']:
            errors.append({'field': 'image', 'url': row['url'], 'errors': row['errors']})
    for index in indexes:
        if index['errors']:
            errors.append({'field': 'index', 'locale': index['locale'], 'errors': index['errors']})
        for item in index['articles']:
            if item['discovery'] != 'direct_anchor':
                (errors if args.require_index_links else warnings).append({'field': 'indexDiscovery', **item})
    summary = {'mode': args.mode, 'articles': len(rows), 'articlePass': sum(not x['errors'] for x in rows),
               'bodyBlocks': sum(x.get('bodyBlocks', 0) for x in rows), 'externalSourceLinks': sum(x.get('externalSourceLinks', 0) for x in rows),
               'images': len(image_rows), 'imagePass': sum(not x['errors'] for x in image_rows), 'indexPages': len(indexes),
               'indexDirectLinks': sum(x['discovery'] == 'direct_anchor' for y in indexes for x in y['articles']),
               'sitemapPresent': sitemap['present'], 'errors': len(errors), 'warnings': len(warnings),
               'publicationVerified': args.mode == 'live' and not errors, 'localVerified': args.mode == 'local' and not errors}
    return {'checkedAt': now(), 'summary': summary, 'inputs': inputs, 'expectedCommit': args.expected_commit,
            'buildBefore': before, 'buildAfter': after, 'records': rows, 'images': image_rows, 'indexes': indexes,
            'sitemap': sitemap, 'errors': errors, 'warnings': warnings,
            'scope': f'{args.expected_count} current source SHA/metadata, ordered primary markdown blocks and links, visible/JSON-LD FAQ, hero attributes and bytes, sitemap and index evidence. Recommendations excluded. No visual/hydration/interaction verification. Local files do not establish public image HTTP availability.'}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--mode', choices=['local', 'live'], required=True)
    parser.add_argument('--expected-count', type=int, required=True, help='Exact positive count; duplicates or missing routes fail.')
    parser.add_argument('--repo', type=Path, default=ROOT / 'repo')
    parser.add_argument('--inventory', type=Path, default=ROOT / 'work/research/today-publication-inventory.json')
    parser.add_argument('--bodies', type=Path, default=ROOT / 'work/checks/source-body-html.json')
    parser.add_argument('--html-root', type=Path, help='Required in local mode; supports route.html or route/index.html.')
    parser.add_argument('--media-root', type=Path, help='Local externalized media root; defaults to repo/public.')
    parser.add_argument('--origin', default='https://tseng-law.com')
    parser.add_argument('--canonical-origin', default='https://tseng-law.com')
    parser.add_argument('--media-origin', default='https://media.tseng-law.com')
    parser.add_argument('--expected-commit', help='Required exact build-info commit in live mode.')
    parser.add_argument('--doh', action='store_true', help='Fresh Cloudflare DoH answers used only for these curl processes; TLS remains enabled.')
    parser.add_argument('--require-index-links', action='store_true', help='Fail if any article lacks an actual index anchor; default records non-anchor discovery as a warning.')
    parser.add_argument('--workers', type=int, default=4)
    parser.add_argument('--timeout', type=int, default=40)
    parser.add_argument('--out', type=Path)
    args = parser.parse_args()
    if args.expected_count < 1:
        parser.error('--expected-count must be positive')
    if args.mode == 'local' and not args.html_root:
        parser.error('--html-root is required for local mode')
    if args.mode == 'live' and not args.expected_commit:
        parser.error('--expected-commit is required for live mode')
    if not 1 <= args.workers <= 8 or not 5 <= args.timeout <= 60:
        parser.error('workers must be 1–8 and timeout 5–60 seconds')
    args.media_root = args.media_root or args.repo / 'public'
    args.out = args.out or ROOT / ('work/checks/today-publication-' + args.mode + '.json')
    try:
        report = verify(args)
    except Exception as error:
        report = {'checkedAt': now(), 'summary': {'mode': args.mode, 'errors': 1, 'publicationVerified': False, 'localVerified': False},
                  'errors': [{'field': 'inputOrExecution', 'message': str(error)}]}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({**report['summary'], 'report': str(args.out)}, ensure_ascii=False))
    return int(bool(report['errors']))


if __name__ == '__main__':
    raise SystemExit(main())
