"""Isolated new-locale tailoring; the fourteen-language baseline stays unchanged.

These are explicit orthographic heuristics, not a linguistic parser or a claim
of independent native review. Neutral expectations live separately in tests/.
"""
import re
import unicodedata

LANGUAGES = ('ru', 'ms', 'fil', 'tr', 'nl', 'zh-hans', 'sv', 'da', 'nb', 'fi', 'pl', 'cs', 'ro', 'uk', 'bg', 'ca', 'el', 'hr', 'hu', 'is', 'sk', 'he', 'bn', 'ur', 'fa', 'my', 'ta', 'ne', 'km', 'mn', 'sr', 'sl', 'lt', 'lv', 'et')
URL = re.compile(r'https?://[^\s<>\[\]()“”«»「」『』。，！？]+')


class SegmentationError(ValueError):
    pass


def comparison_key(text, lang):
    text = unicodedata.normalize('NFC', text)
    if lang == 'tr':
        text = text.replace('I', 'ı').replace('İ', 'i')
    return text.casefold()


def url_pattern(unspaced_terminators=''):
    if not unspaced_terminators:
        return URL
    # Native hard stops can directly precede the next sentence. ASCII URL
    # query punctuation remains valid, as in the unchanged original pattern.
    return re.compile(r'https?://[^\s<>\[\]()“”«»「」『』。，！？'
                      + re.escape(unspaced_terminators) + r']+')


def visible_text(text, additional_terminal_punctuation='', unspaced_terminators=''):
    """Remove destinations without swallowing the surrounding sentence end."""
    # Block classification has already used the original Markdown. Decode
    # ASCII punctuation escapes only now, retaining escaped markup literally.
    # Inline code has no backslash escapes (CommonMark 2.4 and 6.1).
    literals = []
    prefix = '\ue100'
    while prefix in text:
        prefix += '\ue100'
    if '\\' in text:
        parts = []
        i = 0
        def literal(value):
            literals.append(value)
            return prefix + str(len(literals) - 1) + '\ue101'
        while i < len(text):
            if text[i] == '\\' and i + 1 < len(text) and (
                    '!' <= text[i + 1] <= '/' or ':' <= text[i + 1] <= '@'
                    or '[' <= text[i + 1] <= '`' or '{' <= text[i + 1] <= '~'):
                parts.append(literal(text[i + 1]))
                i += 2
                continue
            if text[i] == '`':
                count = len(re.match(r'`+', text[i:]).group())
                closing = next((m for m in re.finditer(r'`+', text[i + count:])
                                if len(m.group()) == count), None)
                if closing:
                    end = i + count + closing.start()
                    code = text[i + count:end].replace('\n', ' ')
                    if code.startswith(' ') and code.endswith(' ') and code.strip(' '):
                        code = code[1:-1]
                    parts.append(literal(code))
                    i = end + count
                    continue
                parts.append(text[i:i + count])
                i += count
                continue
            parts.append(text[i])
            i += 1
        text = ''.join(parts)
    text = re.sub(r'!\[[^\]]*\]\([^)]*\)', '', text)
    text = re.sub(r'\[([^\]]+)\]\([^)]*\)', r'\1', text)
    def omit_url(match):
        value = match.group()
        core = value.rstrip('.,;:!?' + additional_terminal_punctuation)
        return value[len(core):]
    text = url_pattern(unspaced_terminators).sub(omit_url, text)
    text = re.sub(r'[*_`]', '', text)
    if literals:
        text = re.sub(re.escape(prefix) + r'(\d+)\ue101',
                      lambda match: literals[int(match.group(1))], text)
    return text


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


def _polish_fronted_date(prefix, remaining):
    """Detect a bounded date context; it does not decide its sentence reading.

    A fronted date before capital text can introduce a full sentence or be a
    standalone answer. The caller must report ambiguity, never infer a merge.
    NFC is used only for classification, preserving original offsets/text.
    """
    if not re.match(r'[^\S\r\n]+[^\W\d_]', remaining):
        return False
    space = r'[^\S\r\n]+'
    genitive = r'stycznia|lutego|marca|kwietnia|maja|czerwca|lipca|sierpnia|września|października|listopada|grudnia'
    locative = r'styczniu|lutym|marcu|kwietniu|maju|czerwcu|lipcu|sierpniu|wrześniu|październiku|listopadzie|grudniu'
    day = r'(?:0?[1-9]|[12]\d|3[01])'
    year = r'\d{4}'
    day_date = r'(?:(?:dnia|w' + space + r'dniu)' + space + r')?' + day + space + r'(?:' + genitive + r')' + space + year
    month_or_year = r'w' + space + r'(?:(?:' + locative + r')' + space + r')?' + year
    start = r'(?:^|[.!?]' + space + r'|[,;]' + space + r'(?:a|ale|natomiast|zaś)' + space + r')'
    return bool(re.search(start + r'(?:' + day_date + r'|' + month_or_year + r')' + space + r'$', unicodedata.normalize('NFC', prefix), re.I))


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
    protected = url_pattern(data.get('unspaced_sentence_terminators', '')).sub(protect_url, protected)

    for abbreviation in data.get('native_abbreviation_sequences', []):
        def protect_native(match):
            remaining = protected[match.end():].lstrip()
            token = match.group()
            stops = data.get('additional_sentence_terminators', '')
            masked = ''.join(marker if c in stops else c for c in token)
            if not remaining:
                return masked[:-1] + token[-1]
            if remaining[0] in ',;:៖.!?' + stops:
                return masked
            raise SegmentationError('Khmer native abbreviation followed by prose has an ambiguous sentence boundary; reviewed segmentation required')
        protected = re.sub(re.escape(abbreviation), protect_native, protected)

    if lang == 'fi':
        # A shared month completes coordinated dates, e.g. 7. ja 8. toukokuuta.
        # A capitalized next-sentence connector is deliberately not protected.
        months = r'tammikuuta|helmikuuta|maaliskuuta|huhtikuuta|toukokuuta|kesäkuuta|heinäkuuta|elokuuta|syyskuuta|lokakuuta|marraskuuta|joulukuuta'
        day = r'(?:0?[1-9]|[12]\d|3[01])'
        space = r'[^\S\r\n]+'
        protected = re.sub(
            r'(?<!\w)' + day + r'\.(?=(?:' + space + r'(?:ja|tai|vai)'
            + space + day + r'\.)+' + space + r'(?i:' + months + r')\b)',
            lambda match: match.group()[:-1] + marker, protected)

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
        numeral = r'\d+' if data.get('dotted_ordinal_arabic_only') else r'(?:\d+|[IVXLCDM]+)'
        expression = r'(?<![\w\u0300-\u036f])' + numeral + r'\.(?=[^\S\r\n]+([^\W\d_][\w\u0300-\u036f]*))'
        protected = re.sub(expression, lambda match: match.group()[:-1] + marker
                           if match.group(1).islower() else match.group(), protected)
    terminal = {re.sub(r'\s+', '', value).casefold().rstrip('.')
                for value in data.get('terminal_abbreviations', [])}
    contextual = data.get('context_terminal_abbreviations', {})
    for abbreviation in sorted(data['abbreviations'], key=len, reverse=True):
        literal = re.escape(abbreviation.rstrip('.'))
        if data.get('canonical_abbreviations'):
            literal = '(?:' + literal + '|' + re.escape(unicodedata.normalize('NFD', abbreviation.rstrip('.'))) + ')'
        if data.get('flexible_abbreviation_spaces'):
            literal = literal.replace(r'\ ', r'[^\S\r\n]+')
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
            if (lang == 'pl' and key == 'r' and can_end
                    and remaining[:1].isupper()
                    and _polish_fronted_date(protected[:match.start()], protected[match.end():])):
                raise SegmentationError('Polish fronted date before capital text has an ambiguous sentence boundary; a reviewed, source-SHA-bound Polish sentence map is required')
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
        expression = '[' + terminators + ']+' + close_sequence + r'(?:\s+|$)'
        unspaced = data.get('unspaced_sentence_terminators', '')
        if unspaced:
            expression = '[' + re.escape(unspaced) + ']+' + close_sequence + r'\s*|' + expression
        boundary = re.compile(expression)
    result = []
    start = 0
    for match in boundary.finditer(protected):
        delimiter = match.group().rstrip()
        remaining = protected[match.end():]
        if delimiter[-1:] in ('\"', '”', '’', '»', '›', '」', '』') + tuple(additional_closing):
            attribution = remaining.lstrip(' \t–—-')
            if attribution[:1].islower():
                continue
            reporting = data.get('quote_attribution_pattern')
            if reporting and re.match(reporting, unicodedata.normalize('NFC', attribution)):
                continue
        part = text[start:match.end()].strip()
        if part:
            result.append(part)
        start = match.end()
    tail = text[start:].strip()
    if tail:
        result.append(tail)
    return result
