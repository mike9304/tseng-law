"""Compare every raw-source prose/list/heading block with generated HTML in order."""
from pathlib import Path
from html.parser import HTMLParser
from datetime import datetime, timezone
import json
import re
import unicodedata

ROOT = Path('/Users/son7/tseng-arc-visas-20261024')
OUT = ROOT / 'work/checks'
norm = lambda s: re.sub(r'\s+', ' ', unicodedata.normalize('NFC', s)).strip()
BLOCKS = {'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'blockquote', 'table'}
BREAKS = BLOCKS | {'div', 'section', 'article', 'main', 'nav', 'header', 'footer', 'ul', 'ol', 'br', 'hr', 'thead', 'tbody', 'tr', 'th', 'td'}

class Text(HTMLParser):
    def __init__(self, capture_blocks=False):
        super().__init__()
        self.capture_blocks = capture_blocks
        self.ignore = 0
        self.text = []
        self.links = []
        self.blocks = []
        self.active = None
        self.depth = 0
        self.buffer = []
    def add(self, s):
        self.text.append(s)
        if self.active:
            self.buffer.append(s)
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in ('script', 'style', 'svg'):
            self.ignore += 1
        if self.ignore:
            return
        if tag == 'a':
            self.links.append(attrs.get('href', ''))
        if self.capture_blocks and tag in BLOCKS and not self.active:
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
    def handle_data(self, data):
        if not self.ignore:
            self.add(data)

rows, errors = [], []
for entry in json.loads((OUT / 'source-body-html.json').read_text()):
    source = Text(capture_blocks=True)
    source.feed(entry['html'])
    target = Text()
    target.feed((ROOT / 'repo/out-arc' / (entry['route'].lstrip('/') + '.html')).read_text())
    actual = norm(''.join(target.text))
    cursor = 0
    missing = []
    for index, block in enumerate(source.blocks):
        if not block:
            continue
        position = actual.find(block, cursor)
        if position < 0:
            missing.append({'block': index + 1, 'text': block})
        else:
            cursor = position + len(block)
    missing_sources = sorted(set(link for link in source.links if link.startswith(('http://', 'https://'))) - set(target.links))
    if missing or missing_sources:
        errors.append({'path': entry['path'], 'missingOrReorderedBlocks': missing, 'missingSourceLinks': missing_sources})
    rows.append({'path': entry['path'], 'sourceBlocks': len(source.blocks),
                 'allSourceBlocksPresentInOrder': not missing, 'missingSourceLinks': missing_sources})
result = {'checkedAt': datetime.now(timezone.utc).isoformat(), 'articles': rows, 'errors': errors,
          'scope': 'All raw-source body blocks and official/external links compared with saved HTML, excluding YAML metadata. Not browser visibility or visual QA.'}
(OUT / 'source-preservation.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'articles': len(rows), 'bodyBlocks': sum(r['sourceBlocks'] for r in rows), 'errors': len(errors),
                  'sampleErrors': [{'path':e['path'], 'missingBlocks':len(e['missingOrReorderedBlocks']), 'missingSourceLinks':e['missingSourceLinks']} for e in errors[:5]]}, ensure_ascii=False))
raise SystemExit(bool(errors))
