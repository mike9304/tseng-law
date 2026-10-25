"""Isolated new-locale tailoring; the fourteen-language baseline stays unchanged.

These are explicit orthographic heuristics, not a linguistic parser or a claim
of independent native review. Neutral expectations live separately in tests/.
"""
import re
import unicodedata

LANGUAGES = ('ru', 'ms', 'fil', 'tr', 'nl', 'zh-hans', 'sv', 'da', 'nb', 'fi', 'pl', 'cs', 'ro', 'uk', 'bg', 'ca', 'el', 'hr', 'hu', 'is', 'sk')
URL = re.compile(r'https?://[^\s<>\[\]()“”«»「」『』。，！？]+')


class SegmentationError(ValueError):
    pass


def comparison_key(text, lang):
    text = unicodedata.normalize('NFC', text)
    if lang == 'tr':
        text = text.replace('I', 'ı').replace('İ', 'i')
    return text.casefold()


def visible_text(text, additional_terminal_punctuation=''):
    """Remove destinations without swallowing the surrounding sentence end."""
    text = re.sub(r'!\[[^\]]*\]\([^)]*\)', '', text)
    text = re.sub(r'\[([^\]]+)\]\([^)]*\)', r'\1', text)
    def omit_url(match):
        value = match.group()
        core = value.rstrip('.,;:!?' + additional_terminal_punctuation)
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
        core = value.rstrip('.,;:!?' + data.get('additional_sentence_terminators', ''))
        return re.sub(r'[.!?]', marker, core) + value[len(core):]
    protected = URL.sub(protect_url, protected)

    followers = data.get('ordinal_followers')
    if followers:
        end_word = r'\b'
        if data.get('canonical_abbreviations'):
            followers = '(?:' + followers + '|' + unicodedata.normalize('NFD', followers) + ')'
            end_word = r'(?![\w\u0300-\u036f])'
        protected = re.sub(r'(?<=\d)\.(?=\s+(?:' + followers + ')' + end_word + ')', marker, protected, flags=re.I)
    ordinal = data.get('ordinal_pattern')
    if ordinal:
        variants = (ordinal, unicodedata.normalize('NFD', ordinal)) if data.get('canonical_abbreviations') else (ordinal,)
        for expression in dict.fromkeys(variants):
            protected = re.sub(expression, lambda match: match.group().replace('.', marker), protected, flags=re.I)
    if data.get('dotted_ordinal_lowercase_continuation'):
        # HR/HU ordinal dots can precede adjectives, inflected nouns and
        # conjunctions. Keep real uppercase/mixed-case next sentences and
        # never infer continuation across a newline. This is not syntax parsing.
        expression = r'(?<![\w\u0300-\u036f])(?:\d+|[IVXLCDM]+)\.(?=[^\S\r\n]+([^\W\d_][\w\u0300-\u036f]*))'
        protected = re.sub(expression, lambda match: match.group()[:-1] + marker
                           if match.group(1).islower() else match.group(), protected)
    terminal = {re.sub(r'\s+', '', value).casefold().rstrip('.')
                for value in data.get('terminal_abbreviations', [])}
    contextual = data.get('context_terminal_abbreviations', {})
    for abbreviation in sorted(data['abbreviations'], key=len, reverse=True):
        literal = re.escape(abbreviation.rstrip('.'))
        if data.get('canonical_abbreviations'):
            literal = '(?:' + literal + '|' + re.escape(unicodedata.normalize('NFD', abbreviation.rstrip('.'))) + ')'
        expression = re.compile(r'(?<!\w)' + literal + r'\.', re.I)
        def protect(match):
            token = match.group()
            key = re.sub(r'\s+', '', abbreviation).casefold().rstrip('.')
            remaining = protected[match.end():]
            leading_quotes = '”’»\"\')]}' + additional_closing
            if data.get('canonical_abbreviations'):
                remaining = re.sub(r'^[\s' + re.escape(leading_quotes) + ']+', '', remaining)
            else:
                remaining = remaining.lstrip(' \t\r\n' + leading_quotes)
            can_end = key in terminal
            if key in contextual:
                can_end = bool(re.search(contextual[key], protected[:match.start()]))
            follower = data.get('nonterminal_abbreviation_followers', {}).get(key)
            if follower and re.match(follower, unicodedata.normalize('NFC', remaining)):
                can_end = False
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
        terminators = re.escape('.!?' + data.get('additional_sentence_terminators', ''))
        boundary = re.compile('[' + terminators + ']+' + close_sequence + r'(?:\s+|$)')
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
