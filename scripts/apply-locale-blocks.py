#!/usr/bin/env python3
"""Apply one new locale's translation from its worktree onto the integration tree, keyed by locale
(replaces the `<loc>:` block/line inside every per-locale Record, the locale's pack export, and copies
whole files that belong only to that locale). Deterministic; avoids adjacent-hunk merge conflicts."""
import re, sys, os, subprocess, shutil
loc, src, dst = sys.argv[1], sys.argv[2], sys.argv[3]
PACK = {'bn':'bengali','ur':'urdu','fa':'persian','my':'burmese','ta':'tamil','ne':'nepali','km':'khmer','mn':'mongolian','sk':'slovak','bg':'bulgarian','hr':'croatian','sr':'serbian','sl':'slovenian','lt':'lithuanian','lv':'latvian','et':'estonian','ca':'catalan','is':'icelandic'}
dst_head = subprocess.run(['git','-C',dst,'rev-parse','HEAD'],capture_output=True,text=True).stdout.strip()
base = subprocess.run(['git','-C',src,'merge-base','HEAD',dst_head],capture_output=True,text=True).stdout.strip()
committed = subprocess.run(['git','-C',src,'diff','--name-only',base,'HEAD'],capture_output=True,text=True).stdout.split('\n')
changed = subprocess.run(['git','-C',src,'status','--short'],capture_output=True,text=True).stdout.split('\n')
files = sorted({l.strip() for l in committed if l.strip()} | {l[3:].strip() for l in changed if l.strip() and not l.endswith('/')})
def read(p): return open(p,encoding='utf8').read()
def key_blocks(text, key):
    """yield (start,end) line index ranges of every `<indent><key>: ...` block/line, any indent."""
    lines = text.split('\n'); out=[]; i=0
    while i < len(lines):
        m = re.match(r"^( +)'?%s'?: (.*)$" % re.escape(key), lines[i])
        if m:
            ind = m.group(1); e = i
            head = re.sub(r"\s*//.*$", "", lines[i]).rstrip()
            if head.endswith('{') or head.endswith('['):
                closer = ind + ('}' if head.endswith('{') else ']')
                e = next(j for j in range(i+1, len(lines)) if lines[j].startswith(closer))
            out.append((i, e)); i = e + 1
        else: i += 1
    return lines, out
replaced = 0; copied = 0
for f in files:
    sp, dp = os.path.join(src, f), os.path.join(dst, f)
    if not os.path.exists(sp) or '/.tmp-' in '/'+f or f.startswith('.tmp-'): continue
    if f.startswith(f'src/content/columns-{loc}/') or f.startswith('docs/'):
        os.makedirs(os.path.dirname(dp), exist_ok=True); shutil.copyfile(sp, dp); copied += 1; continue
    if not os.path.exists(dp): shutil.copyfile(sp, dp); copied += 1; continue
    s, d = read(sp), read(dp)
    # pack export
    name = f'{PACK[loc]}GuidanceContent'
    if f'export const {name}:' in s:
        ms = re.search(r"export const %s: GuidanceLocaleContent = \{.*?\n\};" % name, s, re.S)
        md = re.search(r"export const %s: GuidanceLocaleContent = \{.*?\n\};" % name, d, re.S)
        if ms and md:
            d = d[:md.start()] + ms.group(0) + d[md.end():]
            # drop the scaffold marker line above it if the worker removed it
            d = d.replace(f"// SCAFFOLD({'hi' if loc in ('bn','ta','ne') else 'ar' if loc in ('ur','fa') else 'th' if loc in ('my','km') else 'ru' if loc in ('mn','bg') else 'cs'}) locale {loc}\n", "") if f"locale {loc}\n" not in s else d
            replaced += 1
    # keyed blocks
    sl, sb = key_blocks(s, loc); dl, db = key_blocks(d, loc)
    if sb and db:
        if len(sb) != len(db): print(f'WARN {f}: {len(sb)} src blocks vs {len(db)} dst blocks — skipping keyed replace'); 
        else:
            out = []; pos = 0
            for (ds, de), (ss, se) in zip(db, sb):
                out.extend(dl[pos:ds]); out.extend(sl[ss:se+1]); pos = de + 1
            out.extend(dl[pos:]); d = '\n'.join(out); replaced += len(db)
    open(dp, 'w', encoding='utf8').write(d)
print(f'{loc}: files={len(files)} keyed-blocks-replaced={replaced} whole-files-copied={copied}')
