from pathlib import Path
from datetime import datetime,timezone
import json,hashlib
b=Path('/Users/son7/tseng-all-language-columns-20261025/batch04')
root=b/'src/content/columns-my'
h=lambda t:hashlib.sha256(t.encode()).hexdigest()
changes={
'704':[
('သက်ဆိုင်ရာလမ်းကြောင်းအတွက် အရည်အချင်း အရင်ပြည့်မီရသည်။','အရည်အချင်း ပြည့်မီရမည်။','Remove a repeated route qualifier after the sentence denying a general visitor conversion right; eligibility remains mandatory.'),
('အိမ်ငှားစာချုပ်သည် အသုံးပြုနိုင်သည့် သက်သေတစ်မျိုးဖြစ်သည်။','အိမ်ငှားစာချုပ်လည်း သုံးနိုင်သည်။','State the lease as one usable address proof directly; the adjacent actual-address requirement and host alternative remain.'),
('သုံးလသည် 15 ရက်ကို အစားထိုးသောကာလ ဖြစ်သည်။','15 ရက်ကို ထပ်မပေါင်းပါ။','After the qualifying overseas-document three-month rule, state directly that 15 days are not added; same replacement duration.'),
('အထွေထွေစိစစ်ချိန်ကို [NIA က ရုံးဖွင့်ရက် 10 ရက်](https://www.immigration.gov.tw/5475/5478/141465/141808/141970) ဟု ဖော်ပြထားပြီး စာရွက်ပြန်ပို့ခြင်း၊ ဖြည့်စွက်ခြင်းနှင့် တွေ့ဆုံမေးမြန်းခြင်းအတွက် ကြာချိန်ကို မထည့်တွက်ပါ။ ဖြည့်စွက်ပြီးလျှင် စိစစ်ချိန်ကို ပြန်စတွက်သည်။','အထွေထွေစိစစ်ချိန်ကို [NIA က ရုံးဖွင့်ရက် 10 ရက်](https://www.immigration.gov.tw/5475/5478/141465/141808/141970) ဟု ဖော်ပြထားပြီး စာရွက်ပြန်ပို့ခြင်း၊ ဖြည့်စွက်ခြင်းနှင့် တွေ့ဆုံမေးမြန်းခြင်းအတွက် ကြာချိန်ကို မထည့်တွက်ဘဲ၊ ဖြည့်စွက်ပြီးလျှင် စိစစ်ချိန်ကို ပြန်စတွက်သည်။','Connect excluded processing intervals with the restart after supplementation in one procedural sentence; preserve 10 working days and every exclusion.')],
'705':[
('နိုင်ငံခြားပညာရှင်ကို ပုံမှန်ငှားရမ်းရာတွင် အလုပ်ရှင်က အလုပ်လုပ်ခွင့်ပြုချက် လျှောက်ရသည်။ ဥပဒေပါ ချွင်းချက်များနှင့် သက်ဆိုင်ရာအာဏာပိုင်တို့ကို အလုပ်အမျိုးအစားအလိုက် သတ်မှတ်ထားကြောင်း [ပညာရှင်ဥပဒေ ပုဒ်မ 4 နှင့် 5](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=A0030295) တွင် ဖတ်နိုင်သည်။ လက်မှတ်ထိုးထားသော ကမ်းလှမ်းစာက အလုပ်လုပ်ခွင့်ကို အစားမထိုးပါ။','ပုံမှန်နိုင်ငံခြားပညာရှင်ငှားရမ်းမှုတွင် အလုပ်ရှင်က အလုပ်လုပ်ခွင့်ပြုချက် လျှောက်ရပြီး၊ ဥပဒေပါ ချွင်းချက်နှင့် တာဝန်ရှိအာဏာပိုင်မှာ [ပညာရှင်ဥပဒေ ပုဒ်မ 4 နှင့် 5](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=A0030295) အရ အလုပ်အမျိုးအစားပေါ် မူတည်သည်။ ကမ်းလှမ်းစာဖြင့် မလုံလောက်ပါ။','Make the employer filing rule and its category-specific exceptions one sentence, followed by the concrete insufficiency of an offer letter. No permit exception is removed; changes repeated foreign-professional paragraph opener.'),
('NIA က နေထိုင်ခွင့် အတည်ပြုပြီးမှ ARC ရသည်။','NIA ခွင့်ပြုမှ ARC ရသည်။','The preceding sentence expressly names direct residence application; shorten the consequent NIA approval requirement without replacing it with employment approval.'),
('အိမ်ထောင်ဖက် အလုပ်လုပ်မည့်အခါလည်း ကိုယ်ပိုင်အခြေအနေကို ပြန်ကြည့်ရသည်။','အိမ်ထောင်ဖက်က အလုပ်လုပ်မည်လား။','Use the actual reader decision to introduce the unchanged spouse work-permit exemption/direct-application distinctions.'),
('[Employment Gold Card](https://goldcard.nat.gov.tw/en/) သည် အလုပ်လုပ်ခွင့်ပြုချက်၊ နေထိုင်ခွင့်ဗီဇာ၊ ARC နှင့် ပြန်ဝင်ခွင့်ကို ပေါင်းစပ်ပေးသည်။ လျှောက်ထားသူက အစီအစဉ်၏ ပညာရှင်အရည်အချင်းကို ပြည့်မီရပြီး [အင်္ဂလိပ်ဘာသာ Gold Card ဆောင်းပါး](/en/columns/taiwan-employment-gold-card) တွင် လျှောက်နည်း ရှိသည်။','[Employment Gold Card](https://goldcard.nat.gov.tw/en/) သည် အလုပ်လုပ်ခွင့်ပြုချက်၊ နေထိုင်ခွင့်ဗီဇာ၊ ARC နှင့် ပြန်ဝင်ခွင့်ကို ပေါင်းစပ်ပေးပြီး၊ လျှောက်ထားသူက အစီအစဉ်၏ ပညာရှင်အရည်အချင်းကို ပြည့်မီရသည်။ လျှောက်နည်းကို [အင်္ဂလိပ်ဘာသာ Gold Card ဆောင်းပါး](/en/columns/taiwan-employment-gold-card) တွင် ဖတ်နိုင်သည်။','Connect the four functions to the applicant qualification, then leave the explicitly English guidance link as a separate reading instruction; preserve all four functions and eligibility.')],
'706':[
('ပိုကြေးပေး၍ သက်တမ်းကို ရွေးဝယ်၍ မရပါ။','သက်တမ်းကို ဝယ်ယူ၍ မရပါ။','Compress the consequence after the fee and category-dependent duration rules; paying a higher fee still cannot buy a chosen residence duration.'),
('ကတ်ရှိပြီးသားဆိုခြင်းက အကြောင်းရင်းအသစ် မည်သည့်အမျိုးအစားကိုမဆို အလိုအလျောက်ပြောင်းခွင့် မပေးပါ။','အလိုအလျောက် ပြောင်းခွင့်မရှိပါ။','The preceding sentence retains graduation, termination, family change and qualifying Article 23-1 grounds; remove repeated card-holder framing from the no-automatic-change consequence.'),
('ကတ်အသစ်ပြန်ထုတ်ခြင်းက နေထိုင်ခွင့်သက်တမ်းကို မတိုးပေးပါ။','သက်တမ်းကတော့ မတိုးပါ။','Within the lost/damaged ARC replacement paragraph, retain the direct consequence that replacement does not extend validity.'),
('[ဝင်ထွက်နှင့်ရွှေ့ပြောင်းမှုဥပဒေ ပုဒ်မ 34](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=34) ပါ ပုံမှန်ပြန်ဝင်ခွင့်ကို မထွက်ခွာမီ ရယူထားရသည်။ [နေထိုင်ခွင့်စည်းမျဉ်း ပုဒ်မ 20](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=D0080129) အရ ထိုခွင့်သည် ARC သက်တမ်းထက် မကျော်နိုင်ဘဲ ARC ပယ်ဖျက်လျှင် ပြန်ဝင်ခွင့်ပါ ပယ်ဖျက်သည်။','[ဝင်ထွက်နှင့်ရွှေ့ပြောင်းမှုဥပဒေ ပုဒ်မ 34](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=34) ပါ ပုံမှန်ပြန်ဝင်ခွင့်ကို မထွက်ခွာမီ ရယူထားရပြီး၊ [နေထိုင်ခွင့်စည်းမျဉ်း ပုဒ်မ 20](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=D0080129) အရ ထိုခွင့်သည် ARC သက်တမ်းထက် မကျော်နိုင်ဘဲ ARC ပယ်ဖျက်လျှင် ပြန်ဝင်ခွင့်ပါ ပယ်ဖျက်သည်။','Keep the ordinary re-entry permission and its ARC-dependent validity/cancellation in one linked sentence; unchanged separate valid-passport/APRC exception.'),
('အိမ် သို့မဟုတ် အလုပ်လုပ်ရာနေရာ ပြောင်းလျှင် ဘယ်အချိန်အတွင်း မှတ်ပုံတင်ရသနည်း။','အိမ် သို့မဟုတ် အလုပ်လုပ်ရာနေရာ ပြောင်းလျှင် ဘယ်အချိန်အတွင်း မှတ်ပုံတင်ရန် လျှောက်ရသနည်း။','Clarify the FAQ question is about applying for change registration, not NIA completing its processing.'),
('ပြောင်းလဲသည့်နေ့နောက်တစ်ရက်မှ ရက် 30 အတွင်း NIA တွင် ပြောင်းလဲမှုမှတ်ပုံတင်ရသည်။','ပြောင်းလဲသည့်နေ့နောက်တစ်ရက်မှ ရက် 30 အတွင်း NIA တွင် ပြောင်းလဲမှုမှတ်ပုံတင်ရန် လျှောက်ထားရသည်။','Preserve next-day 30-day clock and specify applicant filing duty in FAQ answer.'),
('ပြောင်းသည့်နေ့နောက်တစ်ရက်မှ ရက် 30 အတွင်း NIA မှတ်ပုံတင်ရန်။','ပြောင်းသည့်နေ့နောက်တစ်ရက်မှ ရက် 30 အတွင်း NIA သို့ ပြောင်းလဲမှုမှတ်ပုံတင်ရန် လျှောက်ထားရန်။','Same applicant filing clarification in the deadline table; clock unchanged.')]
}
records=[];snap=[]
for prefix,edits in changes.items():
 p=next(root.glob(prefix+'-*.md'));old=p.read_text();t=old;rows=[]
 snap.append({'file':str(p),'sha256':h(old),'text':old})
 for i,(a,z,reason) in enumerate(edits,1):
  assert t.count(a)==1,(p.name,i,t.count(a))
  start=t.index(a);pre=h(t);t=t[:start]+z+t[start+len(a):]
  rows.append({'id':f'{prefix}-R{i:02d}','offset':start,'before':a,'after':z,'reason':reason,'beforeSHA256':pre,'afterSHA256':h(t)})
 inverse=t
 for x in reversed(rows):
  s=x['offset'];assert inverse[s:s+len(x['after'])]==x['after'];inverse=inverse[:s]+x['before']+inverse[s+len(x['after']):]
 assert inverse==old
 p.write_text(t);records.append({'file':str(p),'beforeSHA256':h(old),'afterSHA256':h(t),'exactInverseToBefore':True,'edits':rows})
(b/'checks/my-rhythm-before.json').write_text(json.dumps({'atUTC':datetime.now(timezone.utc).isoformat(),'files':snap},ensure_ascii=False,indent=2)+'\n')
(b/'checks/my-rhythm-edits.json').write_text(json.dumps({'atUTC':datetime.now(timezone.utc).isoformat(),'records':records},ensure_ascii=False,indent=2)+'\n')
for x in records:print(Path(x['file']).name,len(x['edits']),x['afterSHA256'])
