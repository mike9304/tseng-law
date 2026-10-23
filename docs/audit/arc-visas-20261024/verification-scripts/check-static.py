"""Verify generated pages and frozen source hashes; this is not visual/browser QA."""
from pathlib import Path
from html import unescape
from html.parser import HTMLParser
import hashlib
import json
import re
import xml.etree.ElementTree as ET
from urllib.parse import urlsplit, unquote

ROOT = Path('/Users/son7/tseng-arc-visas-20261024')
REPO = ROOT / 'repo'
OUT = REPO / 'out-arc'
audit = json.loads((ROOT / 'work/checks/content-audit.json').read_text())
snapshot_path = ROOT / 'work/checks/build-source-manifest.json'
snapshot = json.loads(snapshot_path.read_text()) if snapshot_path.exists() else {}
errors = []
rows = []
filter_audit = json.loads((ROOT / 'work/checks/filter-render-audit.json').read_text())
assert not filter_audit['errors']
locales = {item['locale'] for item in audit['articles']}
sitemap = ET.parse(OUT / 'sitemap.xml')
ns = {'s':'http://www.sitemaps.org/schemas/sitemap/0.9','x':'http://www.w3.org/1999/xhtml'}
sitemap_rows = {u.find('s:loc',ns).text:u for u in sitemap.findall('s:url',ns)}

class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.lang = None
        self.direction = None
        self.canonical = None
        self.links = []
        self.alternates = {}
        self.description = None
        self.text = []
        self.ignore = 0
        self.in_h1 = False
        self.h1_text = []
        self.topic_more = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'h1':
            self.in_h1 = True
        if tag == 'button' and attrs.get('data-columns-topic-more'):
            self.topic_more.append(attrs['data-columns-topic-more'])
        if tag == 'html':
            self.lang, self.direction = attrs.get('lang'), attrs.get('dir')
        if tag == 'link' and attrs.get('rel') == 'canonical':
            self.canonical = attrs.get('href')
        if tag == 'link' and attrs.get('rel') == 'alternate' and attrs.get('hreflang'):
            self.alternates[attrs['hreflang'].lower()] = attrs.get('href')
        if tag == 'meta' and attrs.get('name') == 'description':
            self.description = attrs.get('content')
        if tag == 'a':
            self.links.append(attrs.get('href', ''))
        if tag in ('script', 'style'):
            self.ignore += 1
    def handle_endtag(self, tag):
        if tag == 'h1':
            self.in_h1 = False
        if tag in ('script', 'style') and self.ignore:
            self.ignore -= 1
    def handle_data(self, text):
        if not self.ignore:
            self.text.append(text)
            if self.in_h1:
                self.h1_text.append(text)

for article in audit['articles']:
    route = article['route']
    file = OUT / (route.lstrip('/') + '.html')
    before = len(errors)
    if not file.exists():
        errors.append(f'{route}: missing HTML')
        continue
    html = file.read_text()
    page = Page()
    page.feed(html)
    current_hash = hashlib.sha256((REPO / article['path']).read_bytes()).hexdigest()
    if snapshot.get(article['path']) != current_hash:
        errors.append(f'{route}: current source differs from frozen build input or no snapshot')
    if article['sha256'] != current_hash:
        errors.append(f'{route}: content audit is stale')
    # BCP47 casing is conventional, not a different language (zh-Hant/zh-hant).
    if (page.lang or '').lower() != article['locale'].lower():
        errors.append(f'{route}: wrong document language {page.lang}')
    expected_dir = 'rtl' if article['locale'] == 'ar' else 'ltr'
    if page.direction != expected_dir:
        errors.append(f'{route}: wrong text direction {page.direction}')
    if page.canonical != 'https://tseng-law.com' + route:
        errors.append(f'{route}: incorrect canonical')
    for locale in locales:
        expected = f'https://tseng-law.com/{locale}/columns/{article["slug"]}'
        if page.alternates.get(locale) != expected:
            errors.append(f'{route}: missing/wrong {locale} alternate')
    sitemap_row = sitemap_rows.get('https://tseng-law.com' + route)
    if sitemap_row is None:
        errors.append(f'{route}: absent from actual sitemap')
    else:
        sitemap_alternates = {x.get('hreflang').lower():x.get('href') for x in sitemap_row.findall('x:link',ns)}
        for locale in locales:
            if sitemap_alternates.get(locale) != f'https://tseng-law.com/{locale}/columns/{article["slug"]}':
                errors.append(f'{route}: missing/wrong sitemap alternate {locale}')
    listing = Page()
    listing.feed((OUT / f'{article["locale"]}/columns.html').read_text())
    listing_status = 'direct link in initial listing HTML'
    if route not in listing.links:
        # Topic sections intentionally preview three cards. Require a real
        # topic control plus independently rendered topic/search evidence.
        filtered = next((r for r in filter_audit['rows']
                         if r['locale'] == article['locale'] and r['slug'] == article['slug']), None)
        if article['topic'] not in listing.topic_more or not filtered or not filtered['topicFound'] or not filtered['searchFound']:
            errors.append(f'{route}: absent from listing and no verified filter discovery')
        listing_status = 'topic preview omits this card; actual topic/search server rendering includes it; browser interaction unverified'
    if page.description != article['summary']:
        errors.append(f'{route}: source/HTML description mismatch')
    # Decorative title spans can split individual syllables/punctuation.
    if ' '.join(article['title'].split()) != ' '.join(''.join(page.h1_text).split()):
        errors.append(f'{route}: visible article title missing')
    if f'/{article["locale"]}/contact' not in page.links:
        errors.append(f'{route}: locale contact link missing')
    # The existing renderer adds localized subject/body query parameters.
    # Validate the actual recipient rather than requiring a bare mailto URL.
    email_links = [urlsplit(href) for href in page.links if href.startswith('mailto:')]
    if not any(unquote(link.path) == 'wei@hoveringlaw.com.tw' for link in email_links):
        errors.append(f'{route}: inquiry email missing')
    schemas = [json.loads(unescape(match.group(1))) for match in re.finditer(
        r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>', html, re.S)]
    articles = [x for x in schemas if x.get('@type') == 'Article']
    faqs = [x for x in schemas if x.get('@type') == 'FAQPage']
    if len(articles) != 1 or articles[0].get('datePublished') != '2026-10-24':
        errors.append(f'{route}: missing or wrong Article publication metadata')
    if any('author' in x for x in articles):
        errors.append(f'{route}: public article author metadata')
    if len(faqs) != 1 or len(faqs[0].get('mainEntity', [])) != 3:
        errors.append(f'{route}: expected three FAQ entities')
    elif [(x.get('name'),x.get('acceptedAnswer',{}).get('text')) for x in faqs[0]['mainEntity']] != [(x['q'],x['a']) for x in article['faq']]:
        errors.append(f'{route}: source/HTML FAQ mismatch')
    rows.append({'route': route, 'sourceSha256': current_hash,
                 'htmlSha256': hashlib.sha256(file.read_bytes()).hexdigest(),
                 'listingDiscovery': listing_status,
                 'pass': len(errors) == before})

report = json.loads((REPO / 'static-site-report.json').read_text())
baseline = json.loads(Path('/Users/son7/Projects/tseng-law-deploy/static-site-report.json').read_text())
new_broken = {key: value for key, value in report['verification']['brokenRefs'].items()
              if baseline['verification']['brokenRefs'].get(key) != value}
if new_broken:
    errors.append('new broken internal references: ' + json.dumps(new_broken))
new_missing_media = sorted(set(report['assembled']['media']['missingReferences'])
                           - set(baseline['assembled']['media']['missingReferences']))
if new_missing_media:
    errors.append('new missing media: ' + json.dumps(new_missing_media))
for key in ('sitemapMissing', 'oversize', 'flightErrors'):
    if report['verification'][key]:
        errors.append(f'static report has {key}')
result = {'scope': 'Generated HTML and source integrity only; no visual or hydration verification',
          'articles': rows, 'errors': errors,
          'htmlPages': report['verification']['htmlPages'],
          'sitemapUrls': report['verification']['sitemapUrls'],
          'baselineBrokenReferences': len(baseline['verification']['brokenRefs']),
          'newBrokenReferences': new_broken,
          'baselineMissingMedia': baseline['assembled']['media']['missingReferences'],
          'newMissingMedia': new_missing_media}
(ROOT / 'work/checks/static-content-audit.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'articles': len(rows), 'errors': errors, 'newBrokenReferences': len(new_broken)}, ensure_ascii=False))
raise SystemExit(bool(errors))
