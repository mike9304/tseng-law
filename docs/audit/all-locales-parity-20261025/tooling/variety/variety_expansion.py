"""Isolated new-locale tailoring; the fourteen-language baseline stays unchanged.

These are explicit orthographic heuristics, not a linguistic parser or a claim
of independent native review. Neutral expectations live separately in tests/.
"""
import re
import unicodedata

LANGUAGES = ('ru', 'ms', 'fil', 'tr', 'nl', 'zh-hans', 'sv', 'da', 'nb', 'fi', 'pl', 'cs', 'ro', 'uk')
URL = re.compile(r'https?://[^\s<>\[\]()“”«»「」『』。，！？]+')


class SegmentationError(ValueError):
    pass


def comparison_key(text, lang):
    text = unicodedata.normalize('NFC', text)
    if lang == 'tr':
        text = text.replace('I', 'ı').replace('İ', 'i')
    return text.casefold()


def visible_text(text):
    """Remove destinations without swallowing the surrounding sentence end."""
    text = re.sub(r'!\[[^\]]*\]\([^)]*\)', '', text)
    text = re.sub(r'\[([^\]]+)\]\([^)]*\)', r'\1', text)
    def omit_url(match):
        value = match.group()
        core = value.rstrip('.,;:!?')
        return value[len(core):]
    text = URL.sub(omit_url, text)
    return re.sub(r'[*_`]', '', text)


def characters(text):
    """Match the legacy Chinese nonspace-codepoint unit, including punctuation."""
    text = re.sub(r'\([^)]*\)|（[^）]*）', '', text)
    return [char for char in text if not char.isspace()]


def opener(text, lang, data, tokens):
    if lang != 'zh-hans':
        return comparison_key(tokens[0], lang) if tokens else ''
    text = unicodedata.normalize('NFC', text).lstrip(' \t\r\n“”‘’\"\'「」『』（(《【')
    match = re.match(data['opener_pattern'], text)
    return match.group() if match else text[:2]


def ending(text, lang, tokens):
    if lang != 'zh-hans':
        return comparison_key(tokens[-1], lang) if tokens else ''
    text = ''.join(characters(text)).rstrip('。！？.!?，,；;：:）)】]」』”’\"\'')
    return text[-2:]


def split_sentences(text, lang, data):
    marker = '\ue000'
    terminal_marker = '\ue001'
    additional_closing = data.get('additional_closing_quotes', '')
    if marker in text or terminal_marker in text:
        raise SegmentationError('input contains reserved segmentation marker')
    protected = re.sub(r'(?<=\d)\.(?=\d)', marker, text)

    def protect_url(match):
        value = match.group()
        core = value.rstrip('.,;:!?')
        return re.sub(r'[.!?]', marker, core) + value[len(core):]
    protected = URL.sub(protect_url, protected)

    followers = data.get('ordinal_followers')
    if followers:
        protected = re.sub(r'(?<=\d)\.(?=\s+(?:' + followers + r')\b)', marker, protected, flags=re.I)
    terminal = {re.sub(r'\s+', '', value).casefold().rstrip('.')
                for value in data.get('terminal_abbreviations', [])}
    contextual = data.get('context_terminal_abbreviations', {})
    for abbreviation in sorted(data['abbreviations'], key=len, reverse=True):
        expression = re.compile(r'(?<!\w)' + re.escape(abbreviation.rstrip('.')) + r'\.', re.I)
        def protect(match):
            token = match.group()
            key = re.sub(r'\s+', '', abbreviation).casefold().rstrip('.')
            remaining = protected[match.end():].lstrip(' \t\r\n”’»\"\')]}' + additional_closing)
            can_end = key in terminal
            if key in contextual:
                can_end = bool(re.search(contextual[key], protected[:match.start()]))
            if can_end and (not remaining or remaining[0].isupper()):
                # A shorter abbreviation must not remask the last dot of a
                # terminal compound (Russian т. д. contains standalone д.).
                return token[:-1].replace('.', marker) + terminal_marker
            return token.replace('.', marker)
        protected = expression.sub(protect, protected)

    # Initials can precede capitalized surnames or lowercase surname particles.
    # A single-letter sentence is inherently ambiguous and needs prose review.
    protected = re.sub(r'(?<!\w)([^\W\d_])\.(?=\s*[^\W\d_])',
                       lambda match: match.group(1) + marker if match.group(1).isupper() else match.group(), protected)
    protected = protected.replace(terminal_marker, '.')
    closing = r'[\"”’»›\')\]}」』】）]'
    if additional_closing:
        closing = '(?:' + closing + '|[' + re.escape(additional_closing) + '])'
    close_sequence = r'(?:[^\S\r\n]*' + closing + r')*'
    if lang == 'zh-hans':
        boundary = re.compile(r'[。！？!?]+' + close_sequence + r'\s*|[.]+' + close_sequence + r'(?:\s+|$)')
    else:
        boundary = re.compile(r'[.!?]+' + close_sequence + r'(?:\s+|$)')
    result = []
    start = 0
    for match in boundary.finditer(protected):
        delimiter = match.group().rstrip()
        remaining = protected[match.end():]
        if delimiter[-1:] in ('\"', '”', '’', '»', '›', '」', '』') + tuple(additional_closing):
            attribution = remaining.lstrip(' \t–—-')
            if attribution[:1].islower():
                continue
        part = text[start:match.end()].strip()
        if part:
            result.append(part)
        start = match.end()
    tail = text[start:].strip()
    if tail:
        result.append(tail)
    return result
