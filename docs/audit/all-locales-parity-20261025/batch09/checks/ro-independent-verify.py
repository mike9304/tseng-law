from pathlib import Path
from hashlib import sha256
from datetime import datetime, timezone
from difflib import SequenceMatcher
import json, re, yaml

B = Path('/Users/son7/tseng-all-language-columns-20261025/batch09')
C = B / 'checks'
R = Path('/Users/son7/Projects/tseng-law-all-locales-20261025')
def h(value):
    return sha256(value if isinstance(value, bytes) else value.encode()).hexdigest()
def read(name):
    return json.loads((C / name).read_text())
def fm_body(text):
    header, body = text.split('\n---\n', 1)
    return yaml.safe_load(header[4:]), body
def urls(text):
    return re.findall(r'https?://[^\s)<>"\]]+', text)
def paragraphs(text):
    body = fm_body(text)[1].split('\n## Surse oficiale\n', 1)[0]
    result, current = [], []
    def flush():
        if current:
            result.append(' '.join(current).strip())
            current.clear()
    for line in body.splitlines():
        line = line.strip()
        if not line or line.startswith(('#', '|', '<', '![')) or re.match(r'^([-*+]|\d+[.)])\s', line):
            flush()
            continue
        current.append(line)
    flush()
    return [p for p in result if len(p) > 1]
def visible(text):
    # The actual inputs have no backslashes or code spans. This is only a
    # conservation check against saved arrays, not a new segmenter or score.
    assert '\\' not in text and '`' not in text
    text = re.sub(r'\[([^\]]+)\]\([^)]*\)', r'\1', text)
    assert not re.search(r'https?://', text)
    return re.sub(r'\s+', ' ', text).strip()

manifest = read('ro-author-manifest.json')
assert h((C / 'ro-author-manifest.json').read_bytes()) == '86b3bc5d29b0142a79d10e9d0f02c355b923945207cc30b17690d3b0748b09bd'
assert h((B / 'reviews/ro-author.md').read_bytes()) == '05cdc0663f02e7d81c707033b62aac5f149f518cc643958085d3f872abfa06b3'
initial = read('ro-initial-drafts.json')
edits = read('ro-self-edits-r1.json')
proof = read('ro-final-proof.json')
first = read('ro-variety-first-cli.json')
last = read('ro-variety-edited-r1.json')
audit = read('ro-content-audit-r1.json')
bindings = {}
def collect(value):
    if isinstance(value, dict):
        if isinstance(value.get('path'), str) and isinstance(value.get('sha256'), str):
            old = bindings.setdefault(value['path'], value['sha256'])
            assert old == value['sha256'], value['path']
        for item in value.values():
            collect(item)
    elif isinstance(value, list):
        for item in value:
            collect(item)
collect(manifest)
verified = []
for path, expected in sorted(bindings.items()):
    actual = h(Path(path).read_bytes())
    assert actual == expected, (path, expected, actual)
    verified.append({'path': path, 'expectedSHA256': expected, 'actualSHA256': actual, 'match': True})

rows, matching, after_count, before_count, faq_count, edit_count = [], 0, 0, 0, 0, 0
for p in sorted((B / 'src/content/columns-ro').glob('*.md')):
    ident = p.name[:3]
    current = p.read_text()
    old = next(x for x in initial['rows'] if x['file'] == str(p))
    e = next(x for x in edits['rows'] if x['file'] == str(p))
    pr = next(x for x in proof['rows'] if x['path'] == str(p))
    assert h(old['text']) == old['sha256'] == e['beforeSHA256']
    assert old['text'] == e['beforeText']
    replay = old['text']
    actual_edits = []
    for change in e['edits']:
        offset = change['offset']
        assert replay[offset:offset + len(change['old'])] == change['old']
        state_before = h(replay)
        replay = replay[:offset] + change['new'] + replay[offset + len(change['old']):]
        actual_edits.append({**change, 'stateBeforeSHA256': state_before, 'stateAfterSHA256': h(replay)})
    assert replay == current == e['afterText'] and h(current) == e['afterSHA256'] == pr['sha256']
    reverse = current
    for change in reversed(e['edits']):
        offset = change['offset']
        assert reverse[offset:offset + len(change['new'])] == change['new']
        reverse = reverse[:offset] + change['old'] + reverse[offset + len(change['new']):]
    assert reverse == old['text']
    edit_count += len(actual_edits)
    fm, body = fm_body(current)
    old_fm, old_body = fm_body(old['text'])
    assert fm == old_fm and current.split('\n---\n', 1)[0] == old['text'].split('\n---\n', 1)[0]
    assert fm['published'] == fm['lastmod'] == '2026-10-26'
    assert fm['audience'] == ['ro'] and fm['author'] == 'legal-ai-assistant'
    assert fm['featured_image_caption'] == 'Scenă fictivă'
    assert not re.search(r'\*\*|__|</?(?:strong|b)(?:\s|>)', current, re.I)
    assert not re.search(r'legal-ai-assistant|AI-assisted|artificial intelligence', body, re.I)
    assert urls(current) == urls(old['text'])
    canonical = next(x for x in manifest['canonical'] if x['target'] == str(p))
    canonical_text = Path(canonical['snapshot']['path']).read_text()
    assert set(urls(current)) == set(urls(canonical_text))
    body_before_sources, sources = current.split('\n## Surse oficiale\n', 1)
    assert set(urls(body_before_sources)) == set(urls(sources))
    numbers_old, numbers_new = re.findall(r'\d+', old['text']), re.findall(r'\d+', current)
    number_delta = []
    for tag, a, b, c, d in SequenceMatcher(None, numbers_old, numbers_new, autojunk=False).get_opcodes():
        if tag != 'equal':
            number_delta.append({'kind': tag, 'before': numbers_old[a:b], 'after': numbers_new[c:d]})
    assert number_delta == ([{'kind': 'delete', 'before': ['15'], 'after': []}] if ident == '920' else [])
    assert len(fm['faq']) == (2 if ident == '915' else 3)
    faq_count += len(fm['faq'])
    current_paragraphs = paragraphs(current)
    assert current_paragraphs == pr['paragraphs']
    actual_cli = next(x for x in (first if ident == '918' else last)['rows'] if x['file'] == str(p))
    assert actual_cli['exit'] == 0 and 'OK — no variety limit violated' in actual_cli['stdout']
    assert actual_cli['command'][-2:] == ['--lang', 'ro']
    assert actual_cli['metrics'] == pr['metrics']
    arrays = [x['sentences'] for x in actual_cli['paragraphs']]
    assert arrays == pr['sentencesByParagraph']
    assert len(current_paragraphs) == len(arrays)
    conservation = []
    for para, array in zip(current_paragraphs, arrays):
        extracted = ' '.join(x['text'] for x in array)
        assert visible(para) == extracted
        conservation.append({'visibleParagraphSHA256': h(visible(para)), 'joinedSentencesSHA256': h(extracted), 'equal': True})
    old_cli = next(x for x in first['rows'] if x['file'] == str(p))
    aa = [s['text'] for para in old_cli['paragraphs'] for s in para['sentences']]
    zz = [s['text'] for para in arrays for s in para]
    equal = 0
    actual_delta = []
    for tag, a, b, c, d in SequenceMatcher(None, aa, zz, autojunk=False).get_opcodes():
        if tag == 'equal':
            equal += b - a
        else:
            actual_delta.append({'kind': tag, 'before': aa[a:b], 'after': zz[c:d]})
    matching += equal
    after_count += len(zz)
    before_count += len(aa)
    measured_directly = ident != '918'
    if measured_directly:
        assert actual_cli['sha256'] == h(current)
    else:
        assert actual_cli['sha256'] == h(old['text'])
        assert paragraphs(old['text']) == current_paragraphs
        assert old_body != body and old_body.split('\n## Surse oficiale\n', 1)[0] == body.split('\n## Surse oficiale\n', 1)[0]
        assert not actual_delta
    ar = next(x for group in audit['groups'] for x in group['files'] if Path(x['file']).name == p.name)
    assert ar['sha256'] == h(current) and ar['errors'] == []
    tables = sum(bool(re.match(r'^\|\s*:?-+', line)) for line in body.splitlines())
    rows.append({'path': str(p), 'sha256': h(current), 'initialSHA256': old['sha256'], 'exactEdits': actual_edits,
        'forwardEqualsCurrent': True, 'reverseEqualsInitial': True, 'FMAndFAQByteIdenticalToInitial': True,
        'metadata': fm, 'numericDelta': number_delta, 'URLSequenceUnchanged': True,
        'officialURLsEqualCanonicalAndBodyFooter': True, 'officialURLs': sorted(set(urls(current))),
        'FAQCount': len(fm['faq']), 'tableCount': tables, 'actualCLIFile': str(C / ('ro-variety-first-cli.json' if ident == '918' else 'ro-variety-edited-r1.json')),
        'actualCLIFileSHA256': h((C / ('ro-variety-first-cli.json' if ident == '918' else 'ro-variety-edited-r1.json')).read_bytes()),
        'actualCLIExit': actual_cli['exit'], 'actualCLIStdout': actual_cli['stdout'], 'measuredFileSHA256': actual_cli['sha256'],
        'currentFileMeasuredDirectly': measured_directly, '918Bridge': 'Full raw file/body differ only in source-footer date phrase; measured prose before sources, sentence arrays and metrics unchanged.' if not measured_directly else None,
        'metrics': pr['metrics'], 'initialSentenceCount': len(aa), 'currentSentenceCount': len(zz),
        'sameOrderedSentences': equal, 'newSentences': len(zz)-equal, 'actualSentenceDelta': actual_delta,
        'paragraphConservation': conservation, 'currentArraysReadByReviewer': True,
        'automatedStructureErrors': [], 'requiredItemsRetainedForSemanticReview': [x for x in ar['reviews'] if x['status'] == 'REQUIRED']})

assert (edit_count, faq_count, before_count, after_count, matching) == (10, 17, 230, 228, 217)
recent = []
missing_published = []
for p in (R / 'src/content/columns-ro').glob('*.md'):
    fm = fm_body(p.read_text())[0]
    if not fm.get('published'):
        missing_published.append(str(p))
    recent.append((str(fm.get('published', '')), p.name, p))
selected_recent = [x[2] for x in sorted(recent, reverse=True)[:3]]
assert [str(p) for p in selected_recent] == [x['path'] for x in manifest['recent']]
assert [p.name[:3] for p in selected_recent] == ['706', '705', '704']
assert read('ro-variety-initial.json')['rows'] == []
duplicate = read('ro-variety-r1.json')['rows']
for x in duplicate:
    old = next(q for q in first['rows'] if q['file'] == x['file'])
    assert x['sha256'] == old['sha256'] and x['metrics'] == old['metrics'] and x['exit'] == old['exit']
out = C / 'ro-independent-proof.json'
assert not out.exists()
data = {'atUTC': datetime.now(timezone.utc).isoformat(), 'owner': 'column_live_audit',
    'scope': 'Independent byte reconstruction, parsing, saved-CLI/array binding and semantic review; no new variety CLI or shared metrics/segmenter API run; no public rendering claim.',
    'verifiedBindings': verified, 'bindingCount': len(verified), 'rows': rows, 'exactEdits': 10,
    'FAQ': 17, 'initialSegments': 230, 'currentSegments': 228, 'sameOrderedSegments': 217, 'newCurrentSegments': 11,
    'sourceURLsPerFileTotal': sum(len(x['officialURLs']) for x in rows), 'uniqueOfficialURLs': len(set(u for x in rows for u in x['officialURLs'])),
    'tables': sum(x['tableCount'] for x in rows), 'recentSelection': [str(p) for p in selected_recent],
    'legacyFilesWithoutPublished': missing_published, 'freshVarietyCLIRuns': 0, 'freshStructureCLIRuns': 0,
    'savedCurrentResult': 'All six file-level CLI results PASS; five current raw SHA runs and 918 initial run with exact measured-prose bridge.',
    'historicalFailuresPreserved': {'initialCLI': {'919': '.445 CV', '920': '.433 CV', '921': '.442 CV'},
      'noCLIRowsFile': 'ro-variety-initial.json', 'duplicateOldCLIFile': 'ro-variety-r1.json',
      'wrapperErrors': ['ro-preparation-error.json', 'ro-measure-initial-error.json', 'ro-self-edit-wrapper-error.json']},
    'humanNativeOrLegalApproval': False, 'publicRenderingInspected': False,
    'readLimits': ['Home editorial-voice.md and mac-studio-macbook-air-sync.md are absent; no claim to have read them.',
                   'Frozen canonical six/facts/contract/voice rules reuse this reviewer\'s earlier full reads at identical SHA; recent RO three and current RO six/FAQ/current arrays read in this review.',
                   'No fresh official HTTP response was required: frozen official source content already supplied and read.']}
out.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'output': str(out), 'sha256': h(out.read_bytes()), 'bindings': len(verified), 'edits': edit_count, 'FAQ': faq_count,
                  'initial': before_count, 'current': after_count, 'same': matching, 'new': after_count-matching,
                  'tables': data['tables'], 'officialURLSum': data['sourceURLsPerFileTotal'], 'uniqueURLs': data['uniqueOfficialURLs']}, ensure_ascii=False, indent=2))
