"""Language-aware measurements for the additional tseng-law column locales.

The four original languages remain in variety_metrics.py. Additional languages
use explicit lexical profiles with provenance documented in each profile and
MULTILINGUAL-METHOD.md; the newest task-local profiles await coordinating review.
Thai requires independently reviewed, hash-bound
sentence boundaries and the installed Node/ICU dictionary word segmenter.
Missing measurement support is an error, never an editorial PASS.
"""
from functools import lru_cache
from pathlib import Path
import hashlib
import json
import re
import shutil
import subprocess
import unicodedata
import variety_expansion as expansion

LANGUAGES = ('th', 'id', 'hi', 'fr', 'de', 'it', 'es', 'pt', 'ar', 'vi') + expansion.LANGUAGES
PROFILE_DIR = Path(__file__).with_name('profiles')
SHORT_WORDS = 8
LONG_WORDS = 32
_THAI_WORDS = {}
_MYANMAR_WORDS = {}
_KHMER_WORDS = {}


class MeasurementError(ValueError):
    """The input cannot be measured under the selected language profile."""


@lru_cache(maxsize=None)
def profile(lang):
    if lang not in LANGUAGES:
        raise MeasurementError(f'unsupported language: {lang}')
    path = PROFILE_DIR / f'{lang}.json'
    try:
        data = json.loads(path.read_text(encoding='utf-8'))
    except (OSError, ValueError) as error:
        raise MeasurementError(f'missing or invalid language profile: {path}') from error
    if not isinstance(data, dict) or data.get('locale') != lang:
        raise MeasurementError(f'profile locale mismatch: {path}')
    for key in ('source_heading_pattern', 'caveat_pattern', 'hypo_pattern',
                'formula_close_pattern'):
        try:
            re.compile(data[key])
        except (KeyError, TypeError, re.error) as error:
            raise MeasurementError(f'invalid {key} in {path}') from error
    for key in ('abbreviations', 'contrast_patterns'):
        if not isinstance(data.get(key), list) or not all(isinstance(x, str) for x in data[key]):
            raise MeasurementError(f'invalid {key} in {path}')
    for expression in data['contrast_patterns']:
        try:
            re.compile(expression)
        except re.error as error:
            raise MeasurementError(f'invalid contrast pattern in {path}') from error
    return data


def source_heading(line, lang):
    if lang == 'vi' or lang in expansion.LANGUAGES:
        line = unicodedata.normalize('NFC', line)
    return bool(re.match(profile(lang)['source_heading_pattern'], line.strip()))


def _letter_number(char):
    return bool(char) and unicodedata.category(char)[0] in ('L', 'N')


def lexical_words(text, join_hyphens=False, join_catalan_ela_geminada=False,
                  hebrew_internal_quotes=False):
    """Count orthographic lexical units, preserving Unicode marks and digits.

Internal apostrophes stay within words. Decimal/group separators between digits
stay within one number; spaces always separate. A locale may retain hyphenated
orthographic compounds. This is not a claim about morphemes or semantic load.
"""
    result = []
    i = 0
    while i < len(text):
        if not _letter_number(text[i]):
            i += 1
            continue
        start = i
        i += 1
        while i < len(text):
            char = text[i]
            before, after = text[i - 1], text[i + 1:i + 2]
            if _letter_number(char) or unicodedata.category(char)[0] == 'M':
                i += 1
            elif char in ('\u200c', '\u200d') and after:
                i += 1
            elif hebrew_internal_quotes and char in ('׳', "'") and '\u0590' <= before <= '\u05ff':
                # A final geresh can mark an abbreviation; preserve it too.
                i += 1
            elif hebrew_internal_quotes and char in ('״', '"') and '\u0590' <= before <= '\u05ff' and '\u0590' <= after <= '\u05ff':
                i += 1
            elif char in ("'", '’', 'ʼ') and _letter_number(after):
                i += 1
            elif join_hyphens and char in ('-', '‐', '‑') and _letter_number(after) and not (before.isdecimal() and after.isdecimal()):
                i += 1
            elif join_catalan_ela_geminada and char == '·' and before.casefold() == 'l' and after.casefold() == 'l':
                i += 1
            elif char in ('.', ',', '٫', '٬') and before.isdecimal() and after.isdecimal():
                i += 1
            else:
                break
        result.append(text[start:i])
    return result


def prepare_words(texts, lang):
    if lang == 'my':
        return prepare_myanmar_words(texts)
    if lang == 'km':
        return prepare_khmer_words(texts)
    if lang != 'th':
        return
    missing = list(dict.fromkeys(t for t in texts if t not in _THAI_WORDS))
    if not missing:
        return
    executable = shutil.which('node')
    if not executable:
        raise MeasurementError('Thai dictionary segmentation requires installed Node with Thai ICU support')
    script = """
const fs = require('node:fs');
if (!Intl.Segmenter.supportedLocalesOf(['th']).length) throw Error('Thai ICU unavailable');
const input = JSON.parse(fs.readFileSync(0, 'utf8'));
const segmenter = new Intl.Segmenter('th', {granularity: 'word'});
const tokens = input.map(text => [...segmenter.segment(text)].filter(x => x.isWordLike).map(x => x.segment));
process.stdout.write(JSON.stringify({tokens, node: process.versions.node, icu: process.versions.icu, unicode: process.versions.unicode}));
"""
    try:
        run = subprocess.run([executable, '-e', script], input=json.dumps(missing),
                             capture_output=True, text=True, timeout=30, check=True)
        output = json.loads(run.stdout)
        if len(output['tokens']) != len(missing):
            raise ValueError('token result count mismatch')
        for text, tokens in zip(missing, output['tokens']):
            if not isinstance(tokens, list) or not all(isinstance(t, str) for t in tokens):
                raise ValueError('invalid token result')
            _THAI_WORDS[text] = tokens
        prepare_words.engine = {k: output[k] for k in ('node', 'icu', 'unicode')}
    except (OSError, ValueError, KeyError, subprocess.SubprocessError) as error:
        raise MeasurementError(f'Thai dictionary segmentation unavailable: {error}') from error


def prepare_myanmar_words(texts):
    """Explicit ICU wordlike units, never Burmese whitespace/Thai fallback."""
    missing = list(dict.fromkeys(t for t in texts if t not in _MYANMAR_WORDS))
    if not missing:
        return
    executable = shutil.which('node')
    if not executable:
        raise MeasurementError('Burmese dictionary segmentation requires installed Node with Myanmar ICU support')
    script = r"""
const fs = require('node:fs');
if (!Intl.Segmenter.supportedLocalesOf(['my']).length) throw Error('Burmese ICU unavailable');
const segmenter = new Intl.Segmenter('my', {granularity: 'word'});
if (segmenter.resolvedOptions().locale !== 'my') throw Error('Burmese ICU locale fallback');
// Myanmar whitespace separates phrases. Narrow NBSP is otherwise an ICU
// in-token connector: split phrases first, then dictionary-segment each one.
const words = text => text.split(/\p{White_Space}+/u).flatMap(part =>
  [...segmenter.segment(part)].filter(x => x.isWordLike).map(x => x.segment));
if (JSON.stringify(words('စာအုပ်ခဲတံ')) !== JSON.stringify(['စာအုပ်', 'ခဲတံ']))
  throw Error('Burmese dictionary capability probe differs; re-audit runtime');
const input = JSON.parse(fs.readFileSync(0, 'utf8'));
process.stdout.write(JSON.stringify({tokens: input.map(words), locale: 'my',
  whitespace: 'Unicode_White_Space_phrase_chunks',
  node: process.versions.node, icu: process.versions.icu, unicode: process.versions.unicode}));
"""
    try:
        run = subprocess.run([executable, '-e', script], input=json.dumps(missing),
                             capture_output=True, text=True, timeout=30, check=True)
        output = json.loads(run.stdout)
        if output['locale'] != 'my' or len(output['tokens']) != len(missing):
            raise ValueError('Burmese locale or token result count mismatch')
        if not all(isinstance(tokens, list) and all(isinstance(t, str) and t for t in tokens)
                   for tokens in output['tokens']):
            raise ValueError('invalid Burmese token result')
        engine = {key: output[key] for key in ('locale', 'node', 'icu', 'unicode', 'whitespace')}
        if not all(isinstance(value, str) and value for value in engine.values()):
            raise ValueError('missing Burmese runtime metadata')
        _MYANMAR_WORDS.update(zip(missing, output['tokens']))
        prepare_myanmar_words.engine = engine
    except (OSError, ValueError, TypeError, KeyError, subprocess.SubprocessError) as error:
        raise MeasurementError(f'Burmese dictionary segmentation unavailable: {error}') from error


def prepare_khmer_words(texts):
    """Explicit Khmer ICU dictionary units; no whitespace or other locale fallback."""
    missing = list(dict.fromkeys(t for t in texts if t not in _KHMER_WORDS))
    if not missing:
        return
    executable = shutil.which('node')
    if not executable:
        raise MeasurementError('Khmer dictionary segmentation requires installed Node with Khmer ICU support')
    script = r"""
const fs = require('node:fs');
if (!Intl.Segmenter.supportedLocalesOf(['km']).length) throw Error('Khmer ICU unavailable');
const segmenter = new Intl.Segmenter('km', {granularity: 'word'});
if (segmenter.resolvedOptions().locale !== 'km') throw Error('Khmer ICU locale fallback');
// Khmer spaces delimit phrases, not words. Keep phrase whitespace variants
// equivalent; dictionary-segment the unspaced text inside each phrase.
const words = text => text.split(/\p{White_Space}+/u).flatMap(part =>
  [...segmenter.segment(part)].filter(x => x.isWordLike).map(x => x.segment));
if (JSON.stringify(words('សៀវភៅខ្មៅ')) !== JSON.stringify(['សៀវភៅ', 'ខ្មៅ']))
  throw Error('Khmer dictionary capability probe differs; re-audit runtime');
const input = JSON.parse(fs.readFileSync(0, 'utf8'));
process.stdout.write(JSON.stringify({tokens: input.map(words), locale: 'km',
  whitespace: 'Unicode_White_Space_phrase_chunks',
  node: process.versions.node, icu: process.versions.icu, unicode: process.versions.unicode}));
"""
    try:
        run = subprocess.run([executable, '-e', script], input=json.dumps(missing),
                             capture_output=True, text=True, timeout=30, check=True)
        output = json.loads(run.stdout)
        if output['locale'] != 'km' or len(output['tokens']) != len(missing):
            raise ValueError('Khmer locale or token result count mismatch')
        if not all(isinstance(tokens, list) and all(isinstance(t, str) and t for t in tokens)
                   for tokens in output['tokens']):
            raise ValueError('invalid Khmer token result')
        engine = {key: output[key] for key in ('locale', 'node', 'icu', 'unicode', 'whitespace')}
        if not all(isinstance(value, str) and value for value in engine.values()):
            raise ValueError('missing Khmer runtime metadata')
        _KHMER_WORDS.update(zip(missing, output['tokens']))
        prepare_khmer_words.engine = engine
    except (OSError, ValueError, TypeError, KeyError, subprocess.SubprocessError) as error:
        raise MeasurementError(f'Khmer dictionary segmentation unavailable: {error}') from error


def words(text, lang):
    if lang == 'zh-hans':
        return expansion.characters(text)
    if lang == 'th':
        prepare_words([text], lang)
        return _THAI_WORDS[text]
    if lang == 'my':
        prepare_myanmar_words([text])
        return _MYANMAR_WORDS[text]
    if lang == 'km':
        prepare_khmer_words([text])
        return _KHMER_WORDS[text]
    data = profile(lang)
    return lexical_words(text, data.get('join_hyphens', False),
                         data.get('join_catalan_ela_geminada', False),
                         data.get('hebrew_internal_quotes', False))


def normalized(text):
    return ' '.join(text.split())


def paragraphs_sha256(paragraphs):
    payload = json.dumps(paragraphs, ensure_ascii=False, sort_keys=True,
                         separators=(',', ':')).encode('utf-8')
    return hashlib.sha256(payload).hexdigest()


def _bound_artifact(binding, base, description):
    """Read the exact review artifact named by a content-hash binding."""
    if not isinstance(binding, dict):
        raise MeasurementError(f'missing {description} binding')
    name, expected = binding.get('path'), binding.get('sha256')
    if not isinstance(name, str) or not name or not isinstance(expected, str) or not re.fullmatch(r'[0-9a-f]{64}', expected):
        raise MeasurementError(f'invalid {description} binding')
    path = Path(name)
    if not path.is_absolute():
        path = base / path
    try:
        payload = path.read_bytes()
    except OSError as error:
        raise MeasurementError(f'missing {description}: {path}') from error
    if hashlib.sha256(payload).hexdigest() != expected:
        raise MeasurementError(f'changed {description}: {path}')
    return path, payload


def _validate_sentence_review(record, found, source_hash):
    method = record.get('method')
    allowed = {'independent_review', 'independent_review_with_author_boundary_adjudication'}
    if method not in allowed or record.get('unresolved_boundaries') != []:
        raise MeasurementError(f'missing or unresolved Thai sentence review: {found}')
    approval_path, payload = _bound_artifact(record.get('approval_record'), found.parent,
                                             'Thai boundary approval')
    try:
        approval = json.loads(payload)
    except (ValueError, UnicodeError) as error:
        raise MeasurementError(f'invalid Thai boundary approval: {approval_path}') from error
    if not isinstance(approval, dict) or approval.get('schema_version') != 1 or approval.get('locale') != 'th' or approval.get('status') != 'approved' or not isinstance(approval.get('reviewer'), str) or not approval['reviewer'].strip():
        raise MeasurementError(f'unapproved Thai boundary record: {approval_path}')
    entries = approval.get('entries')
    if not isinstance(entries, list) or not all(isinstance(x, dict) for x in entries):
        raise MeasurementError(f'invalid Thai approval entries: {approval_path}')
    matches = [x for x in entries if x.get('source_sha256') == source_hash]
    if len(matches) != 1:
        raise MeasurementError(f'Thai source is not uniquely approved: {found}')
    entry = matches[0]
    if entry.get('method') != method or entry.get('unresolved_boundaries') != [] or entry.get('paragraphs_sha256') != paragraphs_sha256(record.get('paragraphs')):
        raise MeasurementError(f'Thai sentence map differs from approved boundaries: {found}')
    evidence = approval.get('evidence')
    if not isinstance(evidence, list) or not all(isinstance(x, dict) for x in evidence):
        raise MeasurementError(f'missing Thai review evidence: {approval_path}')
    roles = [x.get('role') for x in evidence]
    if roles.count('independent-review') != 1 or (method.endswith('author_boundary_adjudication') and roles.count('author-adjudication') != 1):
        raise MeasurementError(f'incomplete Thai review evidence: {approval_path}')
    for binding in evidence:
        _bound_artifact(binding, approval_path.parent, 'Thai review evidence')


def sentence_map(path, text, lang, override=None):
    if lang != 'th':
        return None
    try:
        raw = Path(path).read_bytes()
        original = raw.decode('utf-8')
    except (OSError, UnicodeError) as error:
        raise MeasurementError(f'unreadable Thai source: {path}') from error
    if text not in (original, original.replace('\r\n', '\n').replace('\r', '\n')):
        raise MeasurementError(f'Thai measurement text differs from source: {path}')
    source_hash = hashlib.sha256(raw).hexdigest()
    if override:
        candidates = [Path(override)]
    else:
        source = Path(path).resolve()
        candidates = [source.with_suffix('.sentences.json')]
        for parent in source.parents:
            if (parent / '.git').exists():
                candidates.append(parent / 'docs/audit/variety-segments' / f'{source_hash}.json')
                break
    found = next((p for p in candidates if p.is_file()), None)
    if found is None:
        raise MeasurementError('Thai sentence boundaries require a reviewed, source-SHA-bound sentence map; no punctuation-only fallback')
    try:
        record = json.loads(found.read_text(encoding='utf-8'))
    except (OSError, ValueError) as error:
        raise MeasurementError(f'invalid sentence map: {found}') from error
    if not isinstance(record, dict):
        raise MeasurementError(f'invalid sentence map object: {found}')
    if record.get('source_sha256') != source_hash:
        raise MeasurementError(f'stale Thai sentence map: {found}')
    _validate_sentence_review(record, found, source_hash)
    mapping = {}
    rows = record.get('paragraphs')
    if not isinstance(rows, list) or not all(isinstance(row, dict) for row in rows):
        raise MeasurementError(f'invalid paragraphs in sentence map: {found}')
    for row in rows:
        paragraph = row.get('text')
        slices = row.get('sentences')
        if not isinstance(paragraph, str) or not isinstance(slices, list) or not slices:
            raise MeasurementError(f'invalid paragraph in sentence map: {found}')
        if not all(isinstance(s, str) and s.strip() for s in slices):
            raise MeasurementError(f'empty sentence in map: {found}')
        if normalized(' '.join(slices)) != normalized(paragraph):
            raise MeasurementError(f'sentence map changes paragraph text: {found}')
        key = normalized(paragraph)
        if key in mapping and mapping[key] != slices:
            raise MeasurementError(f'inconsistent duplicate paragraph in map: {found}')
        mapping[key] = slices
    if not mapping:
        raise MeasurementError(f'empty sentence map: {found}')
    return mapping


def split_sentences(text, lang, mapping=None):
    """Split punctuation-delimited languages with reviewed abbreviation tailoring.

Thai prose has no reliable punctuation-only boundary rule. Its complete,
independently reviewed sentence map is required instead.
"""
    if lang in expansion.LANGUAGES:
        try:
            return expansion.split_sentences(text, lang, profile(lang))
        except expansion.SegmentationError as error:
            raise MeasurementError(str(error)) from error
    if lang == 'th':
        key = normalized(text)
        if mapping is None or key not in mapping:
            raise MeasurementError('Thai paragraph missing from reviewed sentence map')
        return list(mapping[key])
    data = profile(lang)
    # Use a private-use marker only internally; its length equals a period so
    # boundaries index the untouched original string exactly.
    marker = '\ue000'
    if marker in text:
        raise MeasurementError('input contains reserved segmentation marker')
    protected = re.sub(r'(?<=\d)\.(?=\d)', marker, text)
    if lang == 'de':
        # A German calendar ordinal has a dot followed by a month name;
        # it is not the end of the enclosing sentence.
        months = r'Januar|Februar|März|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember'
        protected = re.sub(r'(?<=\d)\.(?=\s+(?:' + months + r')\b)', marker, protected, flags=re.I)
    if lang == 'vi':
        # Vietnamese terminal dotted abbreviations such as v.v. can close a
        # sentence. Keep the final dot only at a plausible sentence boundary.
        # This tailoring is isolated from all previously supported locales.
        vi_terminal = {x.casefold().rstrip('.') for x in data.get('terminal_abbreviations', [])}
        def protect_vi_dotted(match):
            remaining = protected[match.end():].lstrip(' \t\r\n”’»"\')]}')
            token = match.group()
            if re.sub(r'\s+', '', token).casefold().rstrip('.') in vi_terminal and (not remaining or remaining[0].isupper()):
                return token[:-1].replace('.', marker) + '.'
            return token.replace('.', marker)
        protected = re.sub(r'(?<!\w)(?:[^\W\d_]\.[ \t]*)+[^\W\d_]\.', protect_vi_dotted, protected)
    else:
        protected = re.sub(r'(?<!\w)(?:[^\W\d_]\.){2,}',
                           lambda m: m.group().replace('.', marker), protected)
    terminal = {x.casefold().rstrip('.') for x in
                data.get('terminal_abbreviations', ['etc', 'ecc', 'usw', 'dll', 'dsb'])}
    for abbreviation in sorted(data.get('abbreviations', []), key=len, reverse=True):
        expression = re.compile(r'(?<!\w)' + re.escape(abbreviation.rstrip('.')) + r'\.', re.I)
        def protect(match):
            remaining = protected[match.end():].lstrip(' \t\r\n”’»"\')]}')
            is_terminal = abbreviation.casefold().rstrip('.') in terminal
            if is_terminal and (not remaining or remaining[0].isupper()):
                return match.group()
            return match.group().replace('.', marker)
        protected = expression.sub(protect, protected)
    close_chars = "\"”’»›')]}" + ('“' if lang == 'de' else '')
    closing = '[' + re.escape(close_chars) + ']'
    # French typographic quotations can put a narrow/ordinary space before ».
    # Preserve closing punctuation with the sentence to which it belongs.
    close_sequence = r'(?:[^\S\r\n]*' + closing + r')*'
    boundary = re.compile(r'[.!?؟]+' + close_sequence + r'(?:\s+|$)|[।॥]+' + close_sequence + r'\s*')
    result = []
    start = 0
    for match in boundary.finditer(protected):
        delimiter = match.group().rstrip()
        remaining = protected[match.end():]
        # A quoted question followed by a lower-case reporting clause belongs
        # to the surrounding sentence (e.g. «... ?» demanda-t-il).
        if delimiter[-1:] in ('"', '”', '’', '»', '›', '“') and remaining[:1].islower():
            continue
        if lang == 'vi' and delimiter[-1:] in ('"', '”', '’', '»', '›'):
            # A short named speaker followed by a reporting verb can be the
            # attribution clause of this quotation. This is a documented
            # heuristic, not a general Vietnamese syntactic parser.
            attribution = r'^[^\W\d_]+(?:[ \t]+[^\W\d_]+){0,3}[ \t]+(?:hỏi|nói|đáp|trả lời|thì thầm|kêu|hét|nhắc|thốt lên)\b'
            if re.match(attribution, unicodedata.normalize('NFC', remaining), re.I):
                continue
        end = match.end()
        part = text[start:end].strip()
        if part:
            result.append(part)
        start = end
    tail = text[start:].strip()
    if tail:
        result.append(tail)
    return result


def contrasts(text, lang):
    if lang == 'vi' or lang in expansion.LANGUAGES:
        text = unicodedata.normalize('NFC', text)
    # Overlapping linguistic patterns count one occurrence, not two.
    spans = sorted(match.span() for pattern in profile(lang)['contrast_patterns']
                   for match in re.finditer(pattern, text))
    merged = []
    for start, end in spans:
        if merged and start < merged[-1][1]:
            merged[-1] = (merged[-1][0], max(merged[-1][1], end))
        else:
            merged.append((start, end))
    return len(merged)
