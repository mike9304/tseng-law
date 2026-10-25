"""Produce deterministic old-locale measurements in an isolated interpreter."""
from pathlib import Path
import contextlib
import hashlib
import io
import json
import sys
import tempfile
import unicodedata

ROOT=Path(__file__).resolve().parent
backend=Path(sys.argv[1]).resolve()
sys.path.insert(0,str(backend))
import variety_metrics as metrics
import variety_multilingual as multilingual

legacy={
 'ko':'상자는 열려 있습니다. 종이는 그대로입니다. 연필은 어디에 있습니까? 책상 위의 흰 봉투 안에는 어제 준비한 사본이 들어 있습니다. 서랍은 비어 있습니다. 마지막 장에는 날짜가 적혀 있습니다.',
 'ja':'箱は開いています。紙はそのままです。鉛筆はどこにありますか。机の上の白い封筒には昨日用意した写しが入っています。引き出しは空です。最後の紙には日付があります。',
 'en':'The box is open. Paper remains inside. Where is the pencil? A white envelope on the desk holds the copy that was prepared yesterday. Nothing fills the drawer. One final sheet bears a date.',
 'zh-hant':'盒子開著。紙還在。鉛筆在哪裡？桌上的白色信封裝著昨天準備好的影本。抽屜是空的。最後一張紙上寫著日期。',
}
outputs=[]
for locale in ('ko','ja','en','zh-hant','th','id','hi','fr','de','it','es','pt','ar','vi'):
    if locale in legacy:
        base=legacy[locale]
        cases=[base,'\n\n'.join([base]*3),'## Neutral heading\n\n'+base+'\n\n## Sources\nIgnored tail.']
        mapping=None
    else:
        profile=json.loads((ROOT/'baseline/profiles'/f'{locale}.json').read_text())
        fixtures=profile['sentence_fixtures']
        base='\n\n'.join(row['text'] for row in fixtures)
        mapping={multilingual.normalized(row['text']):row['sentences'] for row in fixtures} if locale=='th' else None
        cases=[base,'\n\n'.join([base]*2)]
        if locale!='th':
            cases += [unicodedata.normalize('NFD',base),'## Neutral heading\n\n'+base]
    for index,text in enumerate(cases):
        value=metrics.metrics(text,locale,mapping)
        outputs.append({'locale':locale,'case':index,'text_sha256':hashlib.sha256(text.encode()).hexdigest(),'metrics':value,'score':metrics.score(value,{}) if value else None})
    # Probe exactly the same file paths through the check API for stdout/exit parity.
    if locale!='th':
        source=ROOT/'fixtures'/f'regression.{locale}.md'
        # Fixtures are created by the driver before either backend runs.
        with contextlib.redirect_stdout(io.StringIO()) as captured:
            code=metrics.check(str(source),locale)
        outputs.append({'locale':locale,'check_exit':code,'check_stdout':captured.getvalue()})
print(json.dumps({'hard':metrics.HARD,'outputs':outputs},ensure_ascii=False,sort_keys=True))
