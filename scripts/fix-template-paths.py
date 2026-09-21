#!/usr/bin/env python3
"""Inside each new locale's `<loc>:` block (any indent), rewrite leaked template-locale paths `/<tpl>/` → `/<loc>/`."""
import re, sys
TPL={'bn':'hi','ta':'hi','ne':'hi','ur':'ar','fa':'ar','my':'th','km':'th','mn':'ru','bg':'ru','sr':'cs','sk':'cs','hr':'cs','sl':'cs','lt':'cs','lv':'cs','et':'cs','ca':'cs','is':'cs'}
FILES=['src/data/international-guidance-answers.ts','src/data/multilingual-international-v2.ts','src/data/international-guidance-team.ts','src/data/international-guidance-offices.ts','src/data/international-inquiry-copy.ts','src/lib/llms-txt.ts','src/components/CinematicOpening.tsx','src/lib/public-language-registry.ts','src/data/international-guidance-south-asia.ts','src/data/international-guidance-southeast-central.ts','src/data/international-guidance-central-europe.ts','src/data/international-guidance-baltic-atlantic.ts']
PACK={'bn':'bengali','ur':'urdu','fa':'persian','my':'burmese','ta':'tamil','ne':'nepali','km':'khmer','mn':'mongolian','sk':'slovak','bg':'bulgarian','hr':'croatian','sr':'serbian','sl':'slovenian','lt':'lithuanian','lv':'latvian','et':'estonian','ca':'catalan','is':'icelandic'}
total=0
for f in FILES:
    lines=open(f,encoding='utf8').read().split('\n'); i=0; n=0
    while i < len(lines):
        m=re.match(r"^( +)'?([a-z-]+)'?: (.*)$", lines[i]); loc=m.group(2) if m else None
        packm=re.match(r"^export const (\w+)GuidanceContent: GuidanceLocaleContent = \{", lines[i])
        if packm and packm.group(1) in PACK.values():
            loc=[k for k,v in PACK.items() if v==packm.group(1)][0]; ind=''
            e=next(j for j in range(i+1,len(lines)) if lines[j]=='};')
        elif loc in TPL:
            ind=m.group(1); head=re.sub(r"\s*//.*$","",lines[i]).rstrip(); e=i
            if head.endswith('{') or head.endswith('['): e=next(j for j in range(i+1,len(lines)) if lines[j].startswith(ind+('}' if head.endswith('{') else ']')))
        else: i+=1; continue
        tpl=TPL[loc]; pat=re.compile(r"(?<=[\"'(`])/%s(?=/|[\"'`)])"%tpl)
        for j in range(i,e+1):
            new,c=pat.subn('/'+loc, lines[j]); 
            if c: lines[j]=new; n+=c
        i=e+1
    open(f,'w',encoding='utf8').write('\n'.join(lines)); total+=n
    if n: print(f, n)
print('total replaced', total)
