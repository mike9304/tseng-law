"""Run independent editorial fixtures and fail-closed measurement contracts."""
from pathlib import Path
import contextlib
import hashlib
import importlib.util
import io
import json
import subprocess
import sys
import tempfile

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / 'candidate'))
import variety_metrics as metrics
import variety_multilingual as multilingual

errors = []
counts = {'sentence': 0, 'words': 0, 'body': 0, 'contracts': 0}


def compare(kind, locale, index, actual, expected):
    counts[kind] += 1
    if actual != expected:
        errors.append(dict(kind=kind, locale=locale, index=index,
                           actual=actual, expected=expected))


for path in sorted((ROOT / 'candidate/profiles').glob('*.json')):
    p = json.loads(path.read_text())
    lang = p['locale']
    for index, row in enumerate(p.get('sentence_fixtures', []), 1):
        # Thai fixtures explicitly carry independently authored boundaries;
        # they verify map-preserving operation, not a punctuation heuristic.
        mapping = {multilingual.normalized(row['text']): row['sentences']} if lang == 'th' else None
        compare('sentence', lang, index,
                multilingual.split_sentences(row['text'], lang, mapping), row['sentences'])
    for index, row in enumerate(p.get('word_fixtures', []), 1):
        compare('words', lang, index, multilingual.words(row['text'], lang), row['tokens'])
    for index, row in enumerate(p.get('body_fixtures', []), 1):
        paras, _, _ = metrics.body_blocks(row['text'], lang)
        actual = [s for p in paras for s in metrics.sentences(p, lang)]
        compare('body', lang, index, actual, row['sentences'])

spec = importlib.util.spec_from_file_location('legacy', ROOT / 'variety_metrics.baseline.py')
old = importlib.util.module_from_spec(spec)
spec.loader.exec_module(old)
compare('contracts', 'all', 'unchanged-hard-limits', metrics.HARD, old.HARD)
for lang in multilingual.LANGUAGES:
    compare('contracts', lang, 'directory-routing',
            metrics.guess_lang(f'/tmp/columns-{lang}/fixture.md'), lang)
    compare('contracts', lang, 'filename-routing',
            metrics.guess_lang(f'/tmp/fixture.{lang}.md'), lang)
try:
    metrics.guess_lang('/tmp/columns-tr/fixture.md')
    errors.append({'kind': 'contracts', 'error': 'unknown language silently accepted'})
except multilingual.MeasurementError:
    counts['contracts'] += 1

for lang, sentence in [('it', 'La copia resta qui (articolo 22).'),
                       ('it', 'La copia resta qui (articoli 22).'),
                       ('de', 'Die Kopie bleibt hier (Artikel 22).'),
                       ('hi', 'एक छोटा वाक्य (धारा 22)।'),
                       ('hi', 'एक छोटा वाक्य (अनुच्छेद 22)॥'),
                       ('ar', 'تبقى النسخة هنا (المادة ٢٢).'),
                       ('vi', 'Bản sao nằm trong hồ sơ (Điều 22).')]:
    measured = metrics.metrics('\n\n'.join([sentence] * 5), lang)
    compare('contracts', lang, 'statute-cite-paragraph', measured['cite_para_share'], 1)
    compare('contracts', lang, 'statute-cite-end', measured['cite_end_share'], 1)
compare('contracts', 'id', 'numeric-range-not-compound',
        multilingual.words('3-5 hari, buku-buku di masing-masing rak.', 'id'),
        ['3', '5', 'hari', 'buku-buku', 'di', 'masing-masing', 'rak'])

with tempfile.TemporaryDirectory() as temporary:
    source = Path(temporary) / 'fixture.th.md'
    text = 'เอกสารยังอยู่ที่เดิม ผู้ส่งเก็บสำเนาไว้'
    source.write_text(text)
    with contextlib.redirect_stdout(io.StringIO()):
        compare('contracts', 'th', 'missing-map-is-error', metrics.check(str(source), 'th'), 2)
    sidecar = source.with_suffix('.sentences.json')
    record = {'source_sha256': hashlib.sha256(text.encode()).hexdigest(),
              'method': 'independent_review_with_author_boundary_adjudication',
              'unresolved_boundaries': [],
              'paragraphs': [{'text': text, 'sentences': ['เอกสารยังอยู่ที่เดิม', 'ผู้ส่งเก็บสำเนาไว้']}]}
    # A source hash and a matching reconstruction alone are not review approval.
    sidecar.write_text(json.dumps(record, ensure_ascii=False))
    try:
        multilingual.sentence_map(source, text, 'th')
        errors.append({'kind': 'contracts', 'error': 'unreviewed map accepted'})
    except multilingual.MeasurementError:
        counts['contracts'] += 1
    evidence = []
    for role in ('independent-review', 'author-adjudication'):
        artifact = Path(temporary) / (role + '.md')
        artifact.write_text('Neutral fixture approval: ' + role)
        evidence.append({'role': role, 'path': artifact.name,
                         'sha256': hashlib.sha256(artifact.read_bytes()).hexdigest()})
    approval = {'schema_version': 1, 'locale': 'th', 'status': 'approved',
                'reviewer': 'independent-fixture-reviewer',
                'entries': [{'source_sha256': record['source_sha256'],
                             'paragraphs_sha256': multilingual.paragraphs_sha256(record['paragraphs']),
                             'method': record['method'], 'unresolved_boundaries': []}],
                'evidence': evidence}
    approved_path = Path(temporary) / 'approval.json'
    approved_path.write_text(json.dumps(approval, ensure_ascii=False))
    record['approval_record'] = {'path': approved_path.name,
                                'sha256': hashlib.sha256(approved_path.read_bytes()).hexdigest()}
    sidecar.write_text(json.dumps(record, ensure_ascii=False))
    mapping = multilingual.sentence_map(source, text, 'th')
    compare('contracts', 'th', 'valid-sha-map', mapping[multilingual.normalized(text)], record['paragraphs'][0]['sentences'])
    # A source hash binds original bytes, including newline encoding.
    with_newline = text + '\n'
    source.write_bytes((text + '\r\n').encode('utf-8'))
    normalized_record = {**record, 'source_sha256': hashlib.sha256(with_newline.encode()).hexdigest()}
    sidecar.write_text(json.dumps(normalized_record, ensure_ascii=False))
    try:
        multilingual.sentence_map(source, with_newline, 'th')
        errors.append({'kind': 'contracts', 'error': 'normalized newline hash accepted as raw source hash'})
    except multilingual.MeasurementError:
        counts['contracts'] += 1
    source.write_text(text)
    for kind, altered in [
        ('stale-map', {**record, 'source_sha256': '0' * 64}),
        ('unresolved-map', {**record, 'unresolved_boundaries': ['P1']}),
        ('missing-review', {**record, 'approval_record': None}),
        ('wrong-method', {**record, 'method': 'unreviewed'}),
        ('changed-boundaries-same-text', {**record, 'paragraphs': [{'text': text, 'sentences': [text]}]}),
        ('truncated-map', {**record, 'paragraphs': [{'text': text, 'sentences': ['เอกสารยังอยู่ที่เดิม']}]})]:
        sidecar.write_text(json.dumps(altered, ensure_ascii=False))
        try:
            multilingual.sentence_map(source, text, 'th')
            errors.append({'kind': 'contracts', 'error': kind + ' accepted'})
        except multilingual.MeasurementError:
            counts['contracts'] += 1
    sidecar.write_text(json.dumps(record, ensure_ascii=False))
    (Path(temporary) / 'independent-review.md').write_text('Changed after approval')
    try:
        multilingual.sentence_map(source, text, 'th')
        errors.append({'kind': 'contracts', 'error': 'changed review evidence accepted'})
    except multilingual.MeasurementError:
        counts['contracts'] += 1

    bad = Path(temporary) / 'invalid.id.md'
    bad.write_bytes(b'\xff')
    run = subprocess.run([sys.executable, str(ROOT / 'candidate/variety_metrics.py'), 'check', str(bad)], capture_output=True, text=True)
    compare('contracts', 'id', 'invalid-utf8-exit', run.returncode, 2)
    compare('contracts', 'id', 'invalid-utf8-no-traceback', 'Traceback' in run.stderr, False)
    corpus = Path(temporary) / 'corpus/columns-id'
    corpus.mkdir(parents=True)
    (corpus / 'short.md').write_text('Berkas sudah siap.')
    (corpus / 'invalid.md').write_bytes(b'\xff')
    out = Path(temporary) / 'out'
    run = subprocess.run([sys.executable, str(ROOT / 'candidate/variety_metrics.py'), 'corpus', str(corpus.parent), '--out', str(out)], capture_output=True, text=True)
    compare('contracts', 'id', 'corpus-unmeasured-exit', run.returncode, 2)
    compare('contracts', 'id', 'corpus-unmeasured-count', len(json.loads((out / 'measurement-errors.json').read_text())), 2)

# Language author supplied neutral semantic positives and negatives before any target score.
import re
import unicodedata
profile = multilingual.profile('vi')
for category, sentence, expected in re.findall(r'^\| (대조|주의|가상) \| `([^`]+)` \| ([01]) \|', (ROOT/'profile-author.md').read_text(), re.M):
    for form in ('NFC', 'NFD'):
        text = unicodedata.normalize(form, sentence)
        if category == '대조': actual=multilingual.contrasts(text, 'vi')
        else:
            measured=metrics.metrics('\n\n'.join([text]*5),'vi')
            actual=(measured['caveat']//5) if category=='주의' else int(measured['hypo_open'])
        compare('contracts','vi',category+'-'+form+'-'+sentence,actual,int(expected))
text=unicodedata.normalize('NFD','Bản sao nằm trong hồ sơ (Điều 22).')
measured=metrics.metrics('\n\n'.join([text]*5),'vi')
compare('contracts','vi','NFD-citation-end',measured['cite_end_share'],1)
compare('contracts','vi','NFD-citation-paragraph',measured['cite_para_share'],1)

report = {'counts': counts, 'total': sum(counts.values()), 'errors': errors}
(ROOT / 'fixture-tests.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(report, ensure_ascii=False, indent=2))
sys.exit(bool(errors))
