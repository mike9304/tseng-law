"""Old 14 locales: exact neutral metric, score, stdout and exit comparison."""
from pathlib import Path
import hashlib
import json
import subprocess
import sys

ROOT=Path(__file__).resolve().parent
legacy={
 'ko':'상자는 열려 있습니다. 종이는 그대로입니다. 연필은 어디에 있습니까? 책상 위의 흰 봉투 안에는 어제 준비한 사본이 들어 있습니다. 서랍은 비어 있습니다. 마지막 장에는 날짜가 적혀 있습니다.',
 'ja':'箱は開いています。紙はそのままです。鉛筆はどこにありますか。机の上の白い封筒には昨日用意した写しが入っています。引き出しは空です。最後の紙には日付があります。',
 'en':'The box is open. Paper remains inside. Where is the pencil? A white envelope on the desk holds the copy that was prepared yesterday. Nothing fills the drawer. One final sheet bears a date.',
 'zh-hant':'盒子開著。紙還在。鉛筆在哪裡？桌上的白色信封裝著昨天準備好的影本。抽屜是空的。最後一張紙上寫著日期。',
}
for locale,text in legacy.items():
    (ROOT/'fixtures'/f'regression.{locale}.md').write_text(text)
for path in sorted((ROOT/'baseline/profiles').glob('*.json')):
    profile=json.loads(path.read_text())
    if profile['locale']=='th': continue
    text='\n\n'.join(row['text'] for row in profile['sentence_fixtures'])
    (ROOT/'fixtures'/f"regression.{profile['locale']}.md").write_text(text)
out={}
for backend in ('baseline','candidate'):
    run=subprocess.run([sys.executable,str(ROOT/'probe_neutral.py'),str(ROOT/backend)],capture_output=True,text=True,check=True)
    out[backend]=json.loads(run.stdout)
    (ROOT/'evidence'/f'old14-{backend}-neutral.json').write_text(json.dumps(out[backend],ensure_ascii=False,indent=2)+'\n')
errors=[]
if out['baseline']['hard']!=out['candidate']['hard']: errors.append('HARD changed')
for a,b in zip(out['baseline']['outputs'],out['candidate']['outputs']):
    if a!=b: errors.append({'baseline':a,'candidate':b})
if len(out['baseline']['outputs'])!=len(out['candidate']['outputs']): errors.append('Output count changed')
report={'locales':14,'measurements_and_cli_comparisons':len(out['baseline']['outputs']),
        'errors':errors,'hard_unchanged':out['baseline']['hard']==out['candidate']['hard'],
        'scope':'neutral fixtures only, not current article corpus; source guards additionally reviewed',
        'target_manuscripts_or_scores_read':False}
(ROOT/'evidence/old14-regression.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(report,ensure_ascii=False,indent=2))
sys.exit(bool(errors))
