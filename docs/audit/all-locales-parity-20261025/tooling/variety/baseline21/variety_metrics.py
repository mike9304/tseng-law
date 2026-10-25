#!/usr/bin/env python3
"""Sentence-variety / monotony metrics for twenty-one tseng-law column locales.

  variety_metrics.py check FILE [--lang LOCALE] [--sentences REVIEWED_MAP]
  variety_metrics.py corpus DIR [--out DIR2]

Check exit 0: no hard limit failure; 1: editorial hard limit failure;
2: measurement unavailable (unsupported language, missing/stale Thai boundaries,
or missing dictionary support). Legacy four-language inputs too short to measure
retain their previous exit 0 skip; that is not a measured PASS. Corpus mode emits
measurements, not HARD verdicts. Thai maps must match the source and review SHAs.
The original four locales preserve their existing measurement definitions.
Additional locales count orthographic words; see MULTILINGUAL-METHOD.md for
the independent examples, heuristic scope, and Thai Node/ICU requirement.

Rules and thresholds: ~/tseng-lanes-shared/SENTENCE-VARIETY-RULE.md (section 5, self-check).
"""
import sys, re, os, json, statistics as st, argparse, collections
import variety_multilingual as multilingual

DIRLANG = {'columns': 'ko', 'columns-ja': 'ja', 'columns-en': 'en', 'columns-zh': 'zh-hant'}
DIRLANG.update({f'columns-{lang}': lang for lang in multilingual.LANGUAGES})
SUPPORTED = ('ko', 'ja', 'en', 'zh-hant') + multilingual.LANGUAGES
SRC_HEAD = re.compile(r'^#{2,3}\s*(참고|출처|공식 자료|Sources?|References?|Official sources|参考|出典|參考|資料來源|法源|主要參考|参照)', re.I)
CITE = re.compile(r'law\.moj\.gov\.tw|judgment\.judicial\.gov\.tw|law\.go\.kr|e-gov\.go\.jp|제\s?\d+조|第\s?\d+(?:-\d+)?\s?[條条]|\bArt(?:icle|\.)\s?\d+|\bArticles?\s\d+|\bsection\s\d+', re.I)
CONTRAST = {
 'ko': [r'(와|과)는?\s*(다릅니다|다르다|다른 문제|별개)', r'이\s*아니라', r'가\s*아니라', r'같은 일이 아닙니다', r'별개(의|입니다|이므로)'],
 'ja': [r'ではなく', r'とは(違|異な)', r'別の(問題|話|手続)', r'のではありません', r'というわけではありません'],
 'en': [r'\bnot\b[^.]{0,60}\bbut\b', r'\brather than\b', r'\bdifferent from\b', r'\bis not the same\b', r'\bseparate (matter|question|issue)\b', r'\bnot a\b[^.]{0,40}\bbut\b'],
 'zh-hant': [r'不是[^。]{0,40}而是', r'不是[^。，,]{0,30}[，,]\s*(?:而)?是', r'並非[^。]{0,30}而是', r'不同於', r'另一回事', r'兩回事', r'不等於'],
}
CAVEAT = {'ko': r'^(다만|단,|단\s|그렇다고|하지만|그러나|물론)', 'ja': r'^(ただし|とはいえ|もっとも|ただ、|しかし)', 'en': r'^(However|But|That said|Still|Even so)\b', 'zh-hant': r'^(但|不過|然而|只是)'}
HYPO = {'ko': r'^(가령|예를 들어|이를테면|예컨대)|가상의? (사례|장면)|이런 경우입니다', 'ja': r'^(例えば|たとえば|仮に)|とします。|架空', 'en': r'^(Suppose|Imagine|Say|Consider|Picture|Take)\b|hypothetical', 'zh-hant': r'^(假設|假如|舉例|例如|設想)|虛構|假想'}
FORMULA_CLOSE = {
 'ko': r'(일반적인 (설명|정보)|개별 사안|사실관계와 증거에 따라|문의하려면|이메일.*보내|법률사무소에)',
 'ja': r'(一般的な(説明|情報)|個別の事案|事実関係と証拠|お問い合わせ|メールで|法律事務所)',
 'en': r'(general information|not legal advice|individual case|facts and evidence|contact|email|law firm|our office)',
 'zh-hant': r'(一般性說明|一般資訊|個案|事實與證據|諮詢|電子郵件|來信|法律事務所)'}

def strip_fm(t):
    fm = ''
    if t.startswith('---'):
        e = t.find('\n---', 3)
        if e > 0: fm, t = t[3:e], t[e + 4:]
    return fm, t

def body_blocks(t, lang=None):
    """prose paragraphs (list of str), headings, list items; stops at the sources section."""
    paras, heads, items = [], [], []
    cur = []
    def flush():
        if cur: paras.append(' '.join(cur).strip()); cur.clear()
    for ln in t.split('\n'):
        s = ln.strip()
        is_source = multilingual.source_heading(s, lang) if lang in multilingual.LANGUAGES else SRC_HEAD.match(s)
        if is_source: flush(); break
        if not s: flush(); continue
        if s.startswith('#'):
            flush()
            if not s.startswith('# '): heads.append(s.lstrip('#').strip())
            continue
        if s.startswith('|') or s.startswith('<') or s.startswith('!['): flush(); continue
        if re.match(r'^([-*+]|\d+[.)])\s', s): flush(); items.append(s); continue
        if re.match(r'^(확인일|確認日|Checked|Last checked|查證日|資料確認日)', s): flush(); continue
        cur.append(s)
    flush()
    return [p for p in paras if len(p) > 1], heads, items

def unlink(p):
    p = re.sub(r'!\[[^\]]*\]\([^)]*\)', '', p)
    p = re.sub(r'\[([^\]]+)\]\([^)]*\)', r'\1', p)
    p = re.sub(r'https?://\S+', '', p)
    return re.sub(r'[*_`]', '', p)

ABBR = re.compile(r'\b(art|arts|No|Nos|e\.g|i\.e|U\.S|Mr|Ms|Dr|para|paras|Inc|Ltd|Co|vs|cf|p|pp|St)\.$', re.I)
def sentences(p, lang, sentence_map=None):
    p = multilingual.expansion.visible_text(p) if lang in multilingual.expansion.LANGUAGES else unlink(p)
    if lang in multilingual.LANGUAGES:
        return multilingual.split_sentences(p, lang, sentence_map)
    if lang == 'en':
        parts = re.split(r'(?<=[.!?])["”’)]?\s+(?=[A-Z"“(0-9])', p)
        out = []
        for s in parts:
            if out and ABBR.search(out[-1]): out[-1] += ' ' + s
            else: out.append(s)
    else:
        out = re.split(r'(?<=[。！？!?])\s*|(?<=[다요까죠][.])\s+|(?<=[.?!])\s+(?=[가-힣A-Z(「“"])', p)
    return [s.strip() for s in out if s and len(s.strip()) > 1]

def slen(s, lang):
    if lang in multilingual.LANGUAGES:
        return len(multilingual.words(s, lang))
    if lang == 'en': return len(re.findall(r"[A-Za-z0-9][A-Za-z0-9'’\-]*", s))
    return len(re.sub(r'\s', '', re.sub(r'\([^)]*\)|（[^）]*）', '', s)))  # drop parenthetical citations from length

def opener(p, lang):
    s = (multilingual.expansion.visible_text(p) if lang in multilingual.expansion.LANGUAGES else unlink(p)).strip()
    if lang in multilingual.expansion.LANGUAGES:
        return multilingual.expansion.opener(s, lang, multilingual.profile(lang), multilingual.words(s, lang))
    if lang in multilingual.LANGUAGES:
        tokens = multilingual.words(s, lang)
        return (multilingual.unicodedata.normalize('NFC', tokens[0]).casefold() if lang == 'vi' else tokens[0].casefold()) if tokens else ''
    if lang == 'en': w = re.findall(r"[A-Za-z']+", s)[:1]; return (w[0] if w else s[:3])
    if lang == 'ko': return s.split()[0] if s.split() else s[:2]
    m = re.match(r'^(ただし|とはいえ|また|なお|例えば|まず|一方|この|その|台湾|日本|但|不過|如果|若|另外|此外|因此|所以|這|那|在|依|根據|[^\s、，。]{2})', s)
    return m.group(1) if m else s[:2]

def ending(s, lang):
    if lang in multilingual.expansion.LANGUAGES:
        return multilingual.expansion.ending(s, lang, multilingual.words(s, lang))
    if lang in multilingual.LANGUAGES:
        tokens = multilingual.words(s, lang)
        return (multilingual.unicodedata.normalize('NFC', tokens[-1]).casefold() if lang == 'vi' else tokens[-1].casefold()) if tokens else ''
    s = re.sub(r'[\s)）」』”"\]]+$', '', s)
    if lang == 'ko': return s[-3:]
    if lang == 'ja':
        if re.search(r'(です|ます|でした|ました|ません|でしょう|ください|ましょう)[。？?]?$', s): return 'desu-masu'
        if re.search(r'(だ|である|ない|た|る|う|い)[。？?]?$', s): return 'da-dearu'
        return 'other'
    if lang == 'zh-hant': return s[-2:]
    return (re.findall(r'[A-Za-z]+', s) or ['?'])[-1].lower()

def metrics(text, lang, sentence_map=None):
    if lang not in SUPPORTED:
        raise multilingual.MeasurementError(f'unsupported language: {lang}')
    extended = lang in multilingual.LANGUAGES
    language_profile = multilingual.profile(lang) if extended else None
    fm, t = strip_fm(text)
    paras, heads, items = body_blocks(t, lang)
    if not paras: return None
    S = [s for p in paras for s in sentences(p, lang, sentence_map)]
    if extended:
        multilingual.prepare_words(S + [unlink(p) for p in paras] + [unlink('\n'.join(paras))], lang)
    L = [slen(s, lang) for s in S if slen(s, lang) > 0]
    if len(L) < 5: return None
    mean = st.mean(L); sd = st.pstdev(L)
    short_th = language_profile.get('short_threshold', multilingual.SHORT_WORDS) if extended else {'ko': 15, 'ja': 18, 'zh-hant': 12, 'en': 8}[lang]
    long_th = language_profile.get('long_threshold', multilingual.LONG_WORDS) if extended else {'ko': 70, 'ja': 80, 'zh-hant': 60, 'en': 32}[lang]
    PL = [sum(slen(s, lang) for s in sentences(p, lang, sentence_map)) for p in paras]
    ops = [opener(p, lang) for p in paras]
    opc = collections.Counter(ops)
    ends = collections.Counter(ending(s, lang) for s in S)
    body = '\n'.join(paras)
    plain = multilingual.expansion.visible_text(body) if lang in multilingual.expansion.LANGUAGES else unlink(body)
    cite_pattern = CITE
    if extended:
        cite_pattern = re.compile(CITE.pattern + r'|(?:§|art[íi]culos?|articol[oi]|artigos?|Artikel|Pasal|धारा|अनुच्छेद|المادة|المواد|มาตรา)\s*\d+', re.I)
    if lang == 'vi':
        cite_pattern = re.compile(cite_pattern.pattern + r'|Điều\s*\d+', re.I)
    if lang in multilingual.expansion.LANGUAGES:
        cite_pattern = re.compile(cite_pattern.pattern + '|' + language_profile['citation_pattern'], re.I)
    normalize_comparisons = lang == 'vi' or lang in multilingual.expansion.LANGUAGES
    cite_paras = sum(1 for p in paras if cite_pattern.search(multilingual.unicodedata.normalize('NFC', p) if normalize_comparisons else p))
    # sentence that closes with a (statute/judgment) parenthesis
    def _ce(x):
        x = x.rstrip(' .。।॥!?！？؟' if extended else ' .。')
        m = re.search(r'[(（]([^()（）]*)[)）]$', x)
        return bool(m and cite_pattern.search(multilingual.unicodedata.normalize('NFC', m.group(1)) if normalize_comparisons else m.group(1)))
    cite_end = sum(1 for s in S if _ce(s))
    contrast = multilingual.contrasts(plain, lang) if extended else sum(len(re.findall(rx, plain)) for rx in CONTRAST[lang])
    caveat_pattern = language_profile['caveat_pattern'] if extended else CAVEAT[lang]
    caveat = sum(1 for s in S if re.search(caveat_pattern, multilingual.unicodedata.normalize('NFC', s) if normalize_comparisons else s))
    question_pattern = r'[?？؟]\s*["”」』)]?$' if extended else r'[?？]\s*["”」』)]?$'
    q = sum(1 for s in S if re.search(question_pattern, s))
    digits = len(re.findall(r'\d+', plain))
    nchar = len(multilingual.words(plain, lang)) if extended else (len(re.sub(r'\s', '', plain)) if lang != 'en' else len(plain.split()))
    first_segments = sentences(paras[0], lang, sentence_map)
    first = first_segments[0] if first_segments else ''
    last = unlink(paras[-1])
    if normalize_comparisons:
        first = multilingual.unicodedata.normalize('NFC', first)
        last = multilingual.unicodedata.normalize('NFC', last)
    # repeated sentence-start in consecutive sentences (ko/ja/zh: first 2 chars, en: first word)
    st_keys = [' '.join(re.findall(r"[A-Za-z']+", s)[:2]) if lang == 'en' else ((s.split() or [''])[0] if lang == 'ko' else s[:2]) for s in S]
    if extended:
        st_keys = [opener(s, lang) for s in S]
    consec = sum(1 for a, b in zip(st_keys, st_keys[1:]) if a and a == b)
    # runs of 3+ consecutive sentences within ±20% length
    run3 = sum(1 for i in range(len(L) - 2) if max(L[i:i+3]) <= 1.25 * min(L[i:i+3]))
    m = dict(lang=lang, sentences=len(L), paras=len(paras), heads=len(heads), list_items=len(items),
             mean_len=round(mean, 1), len_cv=round(sd / mean, 3) if mean else 0,
             short_share=round(sum(1 for x in L if x <= short_th) / len(L), 3),
             long_share=round(sum(1 for x in L if x >= long_th) / len(L), 3),
             para_cv=round(st.pstdev(PL) / st.mean(PL), 3) if len(PL) > 1 and st.mean(PL) else 0,
             even_run3=round(run3 / max(1, len(L) - 2), 3),
             top_end=ends.most_common(1)[0][0], top_end_share=round(ends.most_common(1)[0][1] / len(S), 3),
             ja_desu=ends.get('desu-masu', 0), ja_da=ends.get('da-dearu', 0),
             top_opener=opc.most_common(1)[0][0], top_opener_n=opc.most_common(1)[0][1],
             opener_rep=round(1 - len(opc) / len(ops), 3),
             consec_same_start=consec,
             cite_para_share=round(cite_paras / len(paras), 3), cite_end_share=round(cite_end / max(1, len(S)), 3),
             contrast=contrast, caveat=caveat, questions=q,
             num_per100=round(100 * digits / max(1, nchar), 2),
             hypo_open=bool(re.search(language_profile['hypo_pattern'] if extended else HYPO[lang], first)) or bool(re.search(language_profile['hypo_pattern'] if extended else HYPO[lang], unlink(paras[0])[:80])),
             q_open=bool(re.search(r'[?？؟]' if extended else r'[?？]', first)),
             formula_close=bool(re.search(language_profile['formula_close_pattern'] if extended else FORMULA_CLOSE[lang], last)),
             first=first[:90], last=last[:120])
    if extended:
        m.update(length_unit=language_profile.get('length_unit', 'orthographic_words'), short_threshold=short_th,
                 long_threshold=long_th, sentence_boundary_method='reviewed_sha_bound_map' if lang == 'th' else 'unicode_punctuation_with_locale_abbreviations')
        if lang == 'vi':
            m['length_unit'] = 'orthographic_syllabic_units'
        if lang == 'th':
            m['word_segmenter'] = getattr(multilingual.prepare_words, 'engine', {})
    return m

def score(m, med):
    """0-100, higher = more monotonous; compared with per-language corpus medians."""
    pts = []
    def add(w, bad): pts.append(w * max(0.0, min(1.0, bad)))
    add(14, (0.55 - m['len_cv']) / 0.30)              # flat sentence lengths
    add(10, (0.12 - m['short_share']) / 0.12)          # no short sentences
    add(10, (m['even_run3'] - 0.15) / 0.35)            # runs of same-length sentences
    add(8, (m['top_end_share'] - (0.55 if m['lang'] != 'en' else 0.10)) / 0.4)
    add(8, (m['opener_rep'] - 0.15) / 0.4)
    add(12, (m['cite_para_share'] - 0.6) / 0.4)        # every paragraph carries a citation
    add(10, (m['cite_end_share'] - 0.25) / 0.5)        # sentence closes with (statute) again and again
    add(10, (m['contrast'] - 2) / 6)
    add(6, (m['caveat'] - 3) / 6)
    add(4, 1.0 if m['hypo_open'] else 0)
    add(4, (m['para_cv'] < 0.35) * 1.0)
    add(4, (m['num_per100'] - med.get('num_per100', 3)) / 4)
    if m['lang'] == 'ja': add(8, 1.0 if min(m['ja_desu'], m['ja_da']) >= 3 and min(m['ja_desu'], m['ja_da']) / max(1, m['ja_desu'] + m['ja_da']) > 0.12 else 0)
    if m['lang'] == 'zh-hant': add(4, (m['contrast'] - 3) / 5)
    return round(sum(pts) * 100 / 112, 1)

HARD = {  # self-check hard limits (draft fails if any is violated)
 'len_cv': ('>=', 0.45, 'sentence-length variation (stdev/mean) too low — mix very short and long sentences'),
 'short_share': ('>=', 0.08, 'need at least ~1 in 12 sentences that is very short'),
 'even_run3': ('<=', 0.30, 'too many runs of 3 sentences of almost the same length'),
 'top_opener_n': ('<=', 'dyn', 'too many paragraphs start with the same word (max 2, or paragraphs/8 for long columns)'),
 'consec_same_start': ('<=', 2, 'consecutive sentences start with the same word'),
 'cite_end_share': ('<=', 0.45, 'too many sentences end with a (statute) parenthesis — move some citations to the front or into the sentence'),
 'contrast': ('<=', 3, 'contrast template (X is not Y / 不是…而是 / ではなく) used too often — max 1 deliberate, 3 total'),
}

def check(path, lang, segments_path=None):
    try:
        with open(path, encoding='utf-8') as source:
            text = source.read()
        mapping = multilingual.sentence_map(path, text, lang, segments_path)
        m = metrics(text, lang, mapping)
    except (OSError, UnicodeError, multilingual.MeasurementError) as error:
        print(f'{path}: ERROR measurement unavailable: {error}')
        return 2
    if not m:
        print(f'{path}: too short to measure')
        return 2 if lang in multilingual.LANGUAGES else 0
    fails = []
    for k, (op, th, why) in HARD.items():
        v = m[k]
        if th == 'dyn': th = max(2, m['paras'] // 8)
        ok = v >= th if op == '>=' else v <= th
        if not ok: fails.append(f'  FAIL {k}={v} (limit {op} {th}): {why}')
    if lang == 'ja' and min(m['ja_desu'], m['ja_da']) >= 3: fails.append(f"  FAIL ja style mixed: です・ます={m['ja_desu']} だ・である={m['ja_da']} — use です・ます throughout (headings excepted)")
    if m['hypo_open']: fails.append('  WARN opens with the stock hypothetical ("가령/例えば…とします/Suppose…/假設") — allowed at most 1 in 4 columns; prefer a concrete fact, number, question or scene')
    if m['top_end_share'] > (0.75 if lang in ('ko', 'ja') else 0.5) and lang != 'en': fails.append(f"  WARN {round(100*m['top_end_share'])}% of sentences end in '{m['top_end']}' — vary endings within the register")
    if m['caveat'] > 4: fails.append(f"  WARN {m['caveat']} caveat-openers (다만/ただし/However/但) — keep ≤ 4")
    print(f"{path} [{lang}] sentences={m['sentences']} mean={m['mean_len']} cv={m['len_cv']} short={m['short_share']} run3={m['even_run3']} "
          f"opener_rep={m['opener_rep']} cite_end={m['cite_end_share']} cite_para={m['cite_para_share']} contrast={m['contrast']} caveat={m['caveat']} q={m['questions']}")
    print('\n'.join(fails) if fails else '  OK — no variety limit violated')
    return 1 if any(f.startswith('  FAIL') for f in fails) else 0

def guess_lang(path):
    b = os.path.basename(path)
    for l in ('zh-hant', 'ko', 'ja', 'en') + multilingual.LANGUAGES:
        if b.startswith(l + '.') or f'.{l}.' in b: return l
    d = os.path.basename(os.path.dirname(path))
    if d in DIRLANG:
        return DIRLANG[d]
    raise multilingual.MeasurementError(f'cannot infer language for {path}; supply --lang')

if __name__ == '__main__':
    ap = argparse.ArgumentParser(); ap.add_argument('mode', choices=('check', 'corpus')); ap.add_argument('path', nargs='+'); ap.add_argument('--lang', choices=SUPPORTED); ap.add_argument('--out'); ap.add_argument('--sentences', help='reviewed source-SHA-bound Thai sentence map')
    a = ap.parse_args()
    if a.mode == 'check':
        rc = 0
        for p in a.path:
            try:
                code = check(p, a.lang or guess_lang(p), a.sentences)
            except multilingual.MeasurementError as error:
                print(f'{p}: ERROR measurement unavailable: {error}')
                code = 2
            rc = max(rc, code)
        sys.exit(rc)
    rows = []
    measurement_errors = []
    for root in a.path:
        for d, lang in DIRLANG.items():
            dd = os.path.join(root, d)
            if not os.path.isdir(dd): continue
            for f in sorted(os.listdir(dd)):
                if not f.endswith('.md'): continue
                try:
                    txt = open(os.path.join(dd, f), encoding='utf-8').read()
                    mapping = multilingual.sentence_map(os.path.join(dd, f), txt, lang)
                    m = metrics(txt, lang, mapping)
                except (OSError, UnicodeError, multilingual.MeasurementError) as error:
                    measurement_errors.append({'file': os.path.join(dd, f), 'error': str(error)})
                    continue
                if not m:
                    if lang in multilingual.LANGUAGES:
                        measurement_errors.append({'file': os.path.join(dd, f), 'error': 'too short to measure'})
                    continue
                fm, _ = strip_fm(txt)
                m['file'] = f'{d}/{f}'; m['num'] = f.split('-')[0]; m['slug'] = re.sub(r'^\d+-', '', f[:-3])
                pm = re.search(r'^published:\s*"?([0-9-]+)', fm, re.M); m['published'] = pm.group(1) if pm else ''
                am = re.search(r'^author:\s*"?([^"\n]+)', fm, re.M); m['author'] = am.group(1) if am else ''
                rows.append(m)
    med = {}
    for lang in DIRLANG.values():
        R = [r for r in rows if r['lang'] == lang]
        if R: med[lang] = {k: st.median([r[k] for r in R]) for k in ('num_per100',)}
    for r in rows: r['score'] = score(r, med.get(r['lang'], {}))
    out = a.out or '.'
    os.makedirs(out, exist_ok=True)
    json.dump(rows, open(os.path.join(out, 'metrics.json'), 'w'), ensure_ascii=False, indent=1)
    print(f'{len(rows)} columns -> {out}/metrics.json')
    json.dump(measurement_errors, open(os.path.join(out, 'measurement-errors.json'), 'w'), ensure_ascii=False, indent=1)
    if measurement_errors:
        print(f'{len(measurement_errors)} measurement errors; these files are not certified')
        sys.exit(2)
