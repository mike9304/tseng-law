from pathlib import Path
import json,hashlib,datetime
b=Path('/Users/son7/tseng-all-language-columns-20261025/batch04')
d=b/'src/content/columns-my'
changes=[
('704','စလျှောက်ရမည့်ရက်ကို ဝင်ရောက်သည့်နေ့နှင့် တစ်ရက်ခွာ၍ ရေတွက်သည်။ ','','M01','Opening repeats the same next-day counting fact without adding a reader action. Remove the duplicate, preserving the preceding 30-day rule and statute link.'),
('704','[ဝင်ထွက်နှင့်ရွှေ့ပြောင်းမှုဥပဒေ ပုဒ်မ 22](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=22) အတွင်းမှ မည်မျှခွင့်ပြုမည်ကို NIA က ဆုံးဖြတ်သည်။','[ဝင်ထွက်နှင့်ရွှေ့ပြောင်းမှုဥပဒေ ပုဒ်မ 22](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=22) ပါ ကန့်သတ်ချက်အတွင်း မည်မျှခွင့်ပြုမည်ကို NIA က ဆုံးဖြတ်သည်။','M02','Replace a literal within-Article construction with within-the-statutory-limit; the maximum and NIA discretion remain.'),
('704','မိသားစုဝင်၏ နေထိုင်ခွင့်ကို သီးခြားအတည်ပြုရသည်။','မိသားစုဝင်အတွက်လည်း မိမိ၏ နေထိုင်ခွင့်ကို NIA က အတည်ပြုသည့်နေ့နောက်တစ်ရက်မှ စတွက်သည်။','M03','Clarify that the family member uses their own NIA residence approval date, rather than borrowing the professional’s approval date. Article 8 approval means residence approval, not employment permission.'),
('705','နိုင်ငံခြားပညာရှင်ဥပဒေ ပုဒ်မ 16 အရ သက်ဆိုင်ရာ အလုပ်လုပ်ခွင့် သို့မဟုတ် ကင်းလွတ်ခွင့်ရှိသော အရည်အချင်းပြည့်မီသည့် ပညာရှင်များနှင့် သတ်မှတ်မိသားစုဝင်များက NIA သို့ တိုက်ရိုက်လျှောက်နိုင်သည်။','နိုင်ငံခြားပညာရှင်ဥပဒေ ပုဒ်မ 16 အရ သက်ဆိုင်ရာ အလုပ်လုပ်ခွင့် သို့မဟုတ် ကင်းလွတ်ခွင့်ရှိသော အရည်အချင်းပြည့်မီသည့် ပညာရှင်က NIA သို့ တိုက်ရိုက်လျှောက်နိုင်သည်။ သတ်မှတ်မိသားစုဝင်အတွက်လည်း ဆွေမျိုးဆက်နွယ်မှုနှင့် ပညာရှင်၏ နေထိုင်ခွင့်အမျိုးအစားဆိုင်ရာ သီးခြားသတ်မှတ်ချက်များအရ တိုက်ရိုက်လမ်းကြောင်း ရှိသည်။','M04','FAQ modifier could attach the employment permit condition to family members. Separate the professional and dependent routes; retain limited-family qualification and their own entry conditions in the following sentence and body.'),
('705','ခြွင်းချက်','ချွင်းချက်','M05','Correct Burmese spelling of exception without changing the exception itself.'),
('706','ခြွင်းချက်','ချွင်းချက်','M06','Correct Burmese spelling of exception at three occurrences; preserve all conditions and URLs.'),
('706','မိသားစုမှီခိုနေထိုင်ခွင့်၏ အခြေခံဖြစ်သူ ကွယ်လွန်ခြင်း၊ ထိုင်ဝမ်တွင် နေထိုင်ပြီး အိမ်ထောင်စုစာရင်းရှိသော ထိုင်ဝမ်အိမ်ထောင်ဖက်နှင့် အိမ်တွင်းအကြမ်းဖက်မှုကြောင့် ကွာရှင်းကာ နိုင်ငံခြားသားလျှောက်ထားသူက နောက်အိမ်ထောင်မပြုရသေးခြင်းတို့ ပါဝင်သည်။ နောက်အိမ်ထောင်မပြုရသေးရမည့်သူမှာ နိုင်ငံခြားသားလျှောက်ထားသူ ဖြစ်သည်။ ကွာရှင်းခဲ့သော ထိုင်ဝမ်အိမ်ထောင်ဖက်၏ နေထိုင်မှုနှင့် အိမ်ထောင်စုစာရင်း သတ်မှတ်ချက်ကိုလည်း ထိန်းထားရသည်။','မိသားစုမှီခိုနေထိုင်ခွင့်၏ အခြေခံဖြစ်သူ ကွယ်လွန်ခြင်းမှာ ထိုအခြေအနေတစ်ခု ဖြစ်သည်။ အိမ်တွင်းအကြမ်းဖက်မှုကြောင့် ကွာရှင်းထားသော နိုင်ငံခြားသားအိမ်ထောင်ဖက်က နောက်အိမ်ထောင်မပြုရသေးလျှင်လည်း အကျုံးဝင်နိုင်သည်။ ထိုကွာရှင်းမှုလမ်းကြောင်းတွင် ယခင်ထိုင်ဝမ်အိမ်ထောင်ဖက်သည် ထိုင်ဝမ်၌ နေထိုင်ပြီး အိမ်ထောင်စုစာရင်း ရှိရသည်။','M07','Replace a long list plus two repetitive interpretive sentences with three linked sentences. Death is distinct; the foreign applicant must not have remarried; former Taiwanese spouse must reside in Taiwan and have household registration. No judicial-divorce-only condition is introduced.')
]
logs=[]
for prefix,old,new,id,reason in changes:
    p=next(d.glob(prefix+'-*.md')); before=p.read_bytes(); text=before.decode(); n=text.count(old)
    assert n>0,(id,'not found')
    if id not in {'M05','M06'}: assert n==1,(id,n)
    after=text.replace(old,new)
    p.write_text(after)
    logs.append({'id':id,'file':str(p),'before':old,'after':new,'occurrences':n,'reason':reason,'meaningPreserved':True,'beforeSHA256':hashlib.sha256(before).hexdigest(),'afterSHA256':hashlib.sha256(p.read_bytes()).hexdigest()})
(b/'checks/my-self-edits.json').write_text(json.dumps({'atUTC':datetime.datetime.now(datetime.timezone.utc).isoformat(),'edits':logs},ensure_ascii=False,indent=2)+'\n')
print(json.dumps([{'id':x['id'],'occurrences':x['occurrences'],'sha':x['afterSHA256']} for x in logs]))
