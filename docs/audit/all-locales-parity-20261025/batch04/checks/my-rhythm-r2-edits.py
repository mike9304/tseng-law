from pathlib import Path
from datetime import datetime,timezone
import json,hashlib
b=Path('/Users/son7/tseng-all-language-columns-20261025/batch04');root=b/'src/content/columns-my'
h=lambda t:hashlib.sha256(t.encode()).hexdigest()
changes={
'704':[
('ကျောင်းမအပ်ရသေးသူက ဝင်ခွင့်စာကို တင်သည်။ ကျောင်းအပ်ပြီးသူအတွက် NIA က နောက်ဆုံးတစ်လအတွင်း ကျောင်းတက်ကြောင်း အထောက်အထားကို ဖော်ပြထားပြီး၊ လက်ရှိစာသင်ကာလ ကျောင်းအပ်အထောက်အထား သို့မဟုတ် ကျောင်းသားကတ်လည်း ထိုစာရင်းတွင် ပါသည်။','ကျောင်းမအပ်ရသေးသူက ဝင်ခွင့်စာကို တင်ရပြီး၊ ကျောင်းအပ်ပြီးသူအတွက် NIA က နောက်ဆုံးတစ်လအတွင်း ကျောင်းတက်ကြောင်း အထောက်အထားကို ဖော်ပြထားပြီး၊ လက်ရှိစာသင်ကာလ ကျောင်းအပ်အထောက်အထား သို့မဟုတ် ကျောင်းသားကတ်လည်း ထိုစာရင်းတွင် ပါသည်။','Compare the not-yet-enrolled and enrolled document paths in one sentence. Keep recent one-month attendance proof and current-term enrollment proof OR student card; no document is made cumulatively compulsory.')],
'705':[
('ဝင်ခွင့်စာအပြင် ပညာရေးမှတ်တမ်း၊ ငွေကြေးအထောက်အထားနှင့် ကျန်းမာရေးလက်မှတ်တို့ကို လျှောက်လွှာအမျိုးအစားအလိုက် တောင်းနိုင်သည်။ ပြည်ပစာရွက်များကို မည်သို့အတည်ပြုရမည်ကို သက်ဆိုင်ရာစာရင်းအတိုင်း ဆောင်ရွက်ရသည်။','ဝင်ခွင့်စာအပြင် ပညာရေးမှတ်တမ်း၊ ငွေကြေးအထောက်အထားနှင့် ကျန်းမာရေးလက်မှတ်တို့ကို လျှောက်လွှာအမျိုးအစားအလိုက် တောင်းနိုင်ပြီး၊ ပြည်ပစာရွက်များကို မည်သို့အတည်ပြုရမည်ကို သက်ဆိုင်ရာစာရင်းအတိုင်း ဆောင်ရွက်ရသည်။','Tie the category-specific supporting documents to their overseas authentication checklist; preserve every document and the conditional scope.'),
('[BOCA တရုတ်ဘာသာသင် နေထိုင်ခွင့်လမ်းညွှန်](https://www.boca.gov.tw/fp-166-285-041cb-2.html) က တနင်္လာမှ သောကြာအတွင်း တစ်ပတ် အနည်းဆုံး 15 နာရီသင်ရန် သတ်မှတ်သည်။ ခွင့်ယူချိန်အပါအဝင် ပျက်ကွက်ချိန်သည် စုစုပေါင်းသင်ချိန်၏ လေးပုံတစ်ပုံထက် မကျော်ရ။','[BOCA တရုတ်ဘာသာသင် နေထိုင်ခွင့်လမ်းညွှန်](https://www.boca.gov.tw/fp-166-285-041cb-2.html) က တနင်္လာမှ သောကြာအတွင်း တစ်ပတ် အနည်းဆုံး 15 နာရီသင်ရန် သတ်မှတ်ပြီး၊ ခွင့်ယူချိန်အပါအဝင် ပျက်ကွက်ချိန်သည် စုစုပေါင်းသင်ချိန်၏ လေးပုံတစ်ပုံထက် မကျော်ရ။','Present classroom hours and permitted absences as connected attendance conditions; preserve Monday-Friday, >=15 weekly hours, leave included and <=one-quarter absences.')]
}
records=[]
for prefix,edits in changes.items():
 p=next(root.glob(prefix+'-*.md'));old=p.read_text();t=old;rows=[]
 for i,(a,z,why) in enumerate(edits,1):
  assert t.count(a)==1,(prefix,i,t.count(a));offset=t.index(a);before=h(t);t=t[:offset]+z+t[offset+len(a):]
  rows.append({'id':f'{prefix}-S{i:02d}','offset':offset,'before':a,'after':z,'reason':why,'beforeSHA256':before,'afterSHA256':h(t)})
 inv=t
 for x in reversed(rows):
  s=x['offset'];assert inv[s:s+len(x['after'])]==x['after'];inv=inv[:s]+x['before']+inv[s+len(x['after']):]
 assert inv==old;p.write_text(t);records.append({'file':str(p),'beforeSHA256':h(old),'afterSHA256':h(t),'exactInverseToBefore':True,'edits':rows})
(b/'checks/my-rhythm-r2-edits.json').write_text(json.dumps({'atUTC':datetime.now(timezone.utc).isoformat(),'records':records},ensure_ascii=False,indent=2)+'\n')
for x in records:print(Path(x['file']).name,x['afterSHA256'])
