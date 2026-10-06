#!/usr/bin/env python3
"""Mechanical checks for WO-LINKB drafts (rule B: judgment-link repetition only).

usage: python3 lbcheck.py <orig.md> <draft.md>
Prints one TSV row: file, urls_equal, jlinks_body before->after, unique_judgments, table_links, sources_links,
attribution_missing, changed_paragraphs, novel_strings.
  1. URL set equal (every http(s) URL in the file).
  2. Judgment links in the body (outside tables and outside a sources section) before/after.
  3. Attribution: paragraphs that had a judgment link and now have none must still name a court/judgment.
  4. Sentence preservation: after stripping judgment-link parentheticals (and short attribution parentheses in the
     draft) and turning remaining links into their text, every paragraph must be identical except for paragraphs
     added as a sources section; anything else is reported as a novel string.
"""
import difflib, re, sys

J = r'https://judgment\.judicial\.gov\.tw[^)\s]*'
SRC_H = re.compile(r'^#{2,3}\s*(資料來源|出典|参考|參考|Sources?|References?|출처|판결과 법령 출처|공식 자료|官方資料|公式資料|参考にした)', re.M)
COURT = re.compile(r'(一審|二審|三審|高院|高等法院|地院|地方法院|最高法院|法院|判決|裁定|1심|2심|3심|고등법원|최고법원|지방법원|법원|판결|High Court|District Court|Supreme Court|court|judgment|裁判所|地裁|高裁|最高裁)', re.I)
ATTR = re.compile(r'[（(](?:一審|二審|高院|最高法院|一審、二審|一審・二審|1심|2심|고등법원|최고법원|first-instance|High Court|Supreme Court|高等法院|地方法院)[^（）()]{0,24}(?:判決|판결|judgment|judgments)?[）)]')
_JL = r'\[[^\]]*\]\(' + J + r'\)'
PAREN_J = re.compile(r'[（(](?:[^（）()\[]|' + _JL + r')*?' + _JL + r'(?:[^（）()\[]|' + _JL + r')*?[）)]')
LINK = re.compile(r'\[([^\]]*)\]\((https?://[^)\s]+)\)')


def split(md):
    end = md.find('\n---', 3) if md.startswith('---') else -1
    body = md[end + 4:] if end >= 0 else md
    m = SRC_H.search(body)
    main, src = (body[:m.start()], body[m.start():]) if m else (body, '')
    return body, main, src


def paras(text):
    return [p.strip() for p in re.split(r'\n\s*\n', text) if p.strip()]


def jcount(text):
    return len(re.findall(r'\]\(' + J + r'\)', text))


def norm(p, draft):
    p = PAREN_J.sub('', p)
    if draft:
        p = ATTR.sub('', p)
    p = LINK.sub(lambda m: m.group(1), p)
    p = re.sub(r'\s+', '', p)
    p = p.replace('。。', '。').replace('..', '.')
    return p


def main():
    o, d = open(sys.argv[1], encoding='utf-8').read(), open(sys.argv[2], encoding='utf-8').read()
    urls_o, urls_d = set(re.findall(r'https?://[^)\s>\]]+', o)), set(re.findall(r'https?://[^)\s>\]]+', d))
    _, mo, so = split(o)
    _, md_, sd = split(d)
    tab = lambda t: sum(jcount(l) for l in t.split('\n') if l.lstrip().startswith('|'))
    body_o = jcount(mo) - tab(mo)
    body_d = jcount(md_) - tab(md_)
    uniq = len(set(re.findall(J, o)))
    po, pd = paras(mo), paras(md_)
    no, nd = [norm(p, False) for p in po], [norm(p, True) for p in pd]
    sm = difflib.SequenceMatcher(a=no, b=nd, autojunk=False)
    miss, changed, novel = 0, 0, []
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == 'equal':
            for a, b in zip(range(i1, i2), range(j1, j2)):
                if jcount(po[a]) and not jcount(pd[b]) and not COURT.search(pd[b]):
                    miss += 1
            continue
        changed += max(i2 - i1, j2 - j1)
        for b in range(j1, j2):
            novel.append(pd[b][:80])
        for a in range(i1, i2):
            if no[a] and not any(no[a] == x for x in nd):
                novel.append('-' + po[a][:80])
    name = sys.argv[2].split('/work/')[-1]
    print('\t'.join(map(str, [name, urls_o == urls_d, f'{body_o}->{body_d}', uniq, tab(md_), jcount(sd),
                              miss, changed, ' | '.join(novel)[:400]])))
    if urls_o != urls_d:
        print('  missing:', sorted(urls_o - urls_d)[:5], ' new:', sorted(urls_d - urls_o)[:5])


if __name__ == '__main__':
    main()
