#!/usr/bin/env python3
"""Scaffold 18 new guidance locales by cloning template-locale blocks in every per-locale Record.
Each cloned block/line carries a `SCAFFOLD(<tpl>)` marker that translation workers must remove."""
import re, sys, os
NEW = ['bn','ur','fa','my','ta','ne','km','mn','sk','bg','hr','sr','sl','lt','lv','et','ca','is']
TPL = {'bn':'hi','ta':'hi','ne':'hi','ur':'ar','fa':'ar','my':'th','km':'th','mn':'ru','bg':'ru','sr':'cs','sk':'cs','hr':'cs','sl':'cs','lt':'cs','lv':'cs','et':'cs','ca':'cs','is':'cs'}
ENG = {'bn':'Bengali','ur':'Urdu','fa':'Persian','my':'Burmese','ta':'Tamil','ne':'Nepali','km':'Khmer','mn':'Mongolian','sk':'Slovak','bg':'Bulgarian','hr':'Croatian','sr':'Serbian','sl':'Slovenian','lt':'Lithuanian','lv':'Latvian','et':'Estonian','ca':'Catalan','is':'Icelandic'}
REGION = {'fa':'middle-east','ur':'asia-pacific','bn':'asia-pacific','ta':'asia-pacific','ne':'asia-pacific','my':'asia-pacific','km':'asia-pacific','mn':'asia-pacific'}
PACK = {'bn':'bengali','ur':'urdu','fa':'persian','my':'burmese','ta':'tamil','ne':'nepali','km':'khmer','mn':'mongolian','sk':'slovak','bg':'bulgarian','hr':'croatian','sr':'serbian','sl':'slovenian','lt':'lithuanian','lv':'latvian','et':'estonian','ca':'catalan','is':'icelandic'}
PACKFILE = {'south-asia':['bn','ur','fa','ta'],'southeast-central':['ne','my','km','mn'],'central-europe':['sk','bg','hr','sr','sl'],'baltic-atlantic':['lt','lv','et','ca','is']}
KEYRE = lambda k: re.compile(r"^  '?%s'?: (\{|.*)$" % re.escape(k))

def block_end(lines, i):
    """i = index of '  key: {' line; return index of its closing '  },' line."""
    if not lines[i].rstrip().endswith('{'): return i
    for j in range(i+1, len(lines)):
        if lines[j].startswith('  }'): return j
    raise RuntimeError('no block end')

def clone_records(path, anchor='he'):
    lines = open(path, encoding='utf8').read().split('\n')
    anchors = [i for i,l in enumerate(lines) if re.match(r"^  '?%s'?: " % anchor, l)]
    if not anchors: return 0
    out = []; pos = 0; added = 0
    for ai_idx, ai in enumerate(anchors):
        ae = block_end(lines, ai)
        out.extend(lines[pos:ae+1]); pos = ae+1
        # template blocks for this record: nth occurrence of each template key
        for loc in NEW:
            tpl = TPL[loc]
            tis = [i for i,l in enumerate(lines) if re.match(r"^  '?%s'?: " % tpl, l)]
            if ai_idx >= len(tis): raise RuntimeError(f'{path}: template {tpl} occurrence {ai_idx} missing')
            ti = tis[ai_idx]; te = block_end(lines, ti)
            blk = lines[ti:te+1]
            first = re.sub(r"^  '?%s'?:" % tpl, f"  {loc}:", blk[0])
            if len(blk) == 1:
                out.append(first + f' // SCAFFOLD({tpl})')
            else:
                out.append(first + f' // SCAFFOLD({tpl})'); out.extend(blk[1:])
            added += 1
    out.extend(lines[pos:])
    open(path, 'w', encoding='utf8').write('\n'.join(out)); return added

total = 0
for f in ['src/data/international-guidance-team.ts','src/data/international-guidance-offices.ts','src/data/international-guidance-answers.ts','src/data/international-inquiry-copy.ts','src/lib/llms-txt.ts','src/data/multilingual-international-v2.ts','src/lib/columns.ts','src/components/ColumnsGrid.tsx','src/components/CinematicOpening.tsx','src/components/decorative-video-controls.ts','src/data/team-name.ts','src/lib/public-language-registry.ts']:
    n = clone_records(f); print(f'{f}: +{n} blocks'); total += n

# type unions
for path, anchor in [('src/data/international-guidance-content.ts',"  | 'he'"),('src/data/international-inquiry-copy.ts',"  | 'he'")]:
    s = open(path, encoding='utf8').read()
    s = s.replace(anchor + ';', anchor + '\n' + '\n'.join(f"  | '{c}'" for c in NEW) + ';', 1)
    open(path,'w',encoding='utf8').write(s)

# registry list items (PUBLIC_LANGUAGE_REGISTRY): insert after the he item
p='src/lib/public-language-registry.ts'; s=open(p,encoding='utf8').read()
he_item = "  {\n    locale: 'he',\n    autonym: PUBLIC_LANGUAGE_AUTONYMS.he,\n    englishName: 'Hebrew',\n    region: 'europe',\n  },\n"
assert he_item in s
items = ''.join(f"  {{\n    locale: '{c}',\n    autonym: PUBLIC_LANGUAGE_AUTONYMS.{c},\n    englishName: '{ENG[c]}',\n    region: '{REGION.get(c,'europe')}',\n  }},\n" for c in NEW)
s = s.replace(he_item, he_item + items, 1); open(p,'w',encoding='utf8').write(s)

# pack files: clone template pack objects
src_files = {'hi':'src/data/international-guidance-asia.ts','ar':'src/data/international-guidance-content.ts','th':'src/data/international-guidance-content.ts','ru':'src/data/international-guidance-western.ts','cs':'src/data/international-guidance-eastern.ts'}
names = {'hi':'hindiGuidanceContent','ru':'russianGuidanceContent','cs':'czechGuidanceContent'}
def extract_pack(tpl):
    text = open(src_files[tpl], encoding='utf8').read()
    if tpl in names:
        m = re.search(r"export const %s: GuidanceLocaleContent = \{\n(.*?)\n\};" % names[tpl], text, re.S)
        return m.group(1)
    # ar/th live inline in guidanceContent map as '  ar: {' ... '  },'
    lines = text.split('\n'); i = next(k for k,l in enumerate(lines) if l == f'  {tpl}: {{'); e = block_end(lines, i)
    body = lines[i+1:e]
    return '\n'.join(l[2:] if l.startswith('  ') else l for l in body)  # dedent one level
imports = []; mapping = []
for fname, locs in PACKFILE.items():
    out = ["import type { GuidanceLocaleContent } from './international-guidance-content';", "", f"// SCAFFOLD: {', '.join(locs)} — cloned from template packs; every string must be translated and the SCAFFOLD markers removed.", ""]
    for c in locs:
        tpl = TPL[c]; body = extract_pack(tpl)
        out.append(f"// SCAFFOLD({tpl}) locale {c}")
        out.append(f"export const {PACK[c]}GuidanceContent: GuidanceLocaleContent = {{")
        out.append(body); out.append("};"); out.append("")
        imports.append((fname, f"{PACK[c]}GuidanceContent")); mapping.append((c, f"{PACK[c]}GuidanceContent"))
    open(f'src/data/international-guidance-{fname}.ts','w',encoding='utf8').write('\n'.join(out))
# register in content map
p='src/data/international-guidance-content.ts'; s=open(p,encoding='utf8').read()
imp = ''.join(f"import {{ {', '.join(n for f,n in imports if f==fname)} }} from './international-guidance-{fname}';\n" for fname in PACKFILE)
s = s.replace("export const guidanceContent: Record<GuidanceLocale, GuidanceLocaleContent> = {", "export const guidanceContent: Record<GuidanceLocale, GuidanceLocaleContent> = {", 1)
s = s.replace("  he: hebrewGuidanceContent,", "  he: hebrewGuidanceContent,\n" + ''.join(f"  {c}: {n},\n" for c,n in mapping).rstrip('\n'), 1)
# imports: put after the first import line
first_import_end = s.index('\n', s.index('import '))
s = s[:first_import_end+1] + imp + s[first_import_end+1:]
open(p,'w',encoding='utf8').write(s)
print('pack files written; total cloned blocks', total)
