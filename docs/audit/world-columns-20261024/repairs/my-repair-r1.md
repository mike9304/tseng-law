# Repair round 1 — locale `my` (810, 811, 812)

Source: `reviews/codex-my-r1.md`. Every MUST was re-checked on 24 Oct 2026 against `python3 tools/law.py` output or the official page (curl). All MUSTs were right; none rebutted. Edited files: `drafts/my/810-…`, `811-…`, `812-…` only. FAQ answers were updated where the changed fact appears in them. Summaries and titles did not need changes (still 147–164 / 59–65 code points). YAML re-parsed (valid), no bold/H1, every body link still listed in Sources.

Burmese wording of the fixes is mine and has no native-speaker sign-off (same limit as the first draft; the reviewer's own S1 says the same about the proposed wording).

## 810

**M1 (寒暑假 vs any school holiday) — ACCEPTED.**
Checked: ESA Art. 50 「其工作時間除寒暑假外，每星期最長為二十小時」; Permit Regs Art. 54 「其工作時間除寒暑假外，每星期最長為二十小時」; WDA press release 「寒暑假期間工作時數不受限」. The statute names winter and summer vacation only; my "ကျောင်းပိတ်ရက်" could read as any day off.
Old → New: "ကျောင်းပိတ်ရက်တွင်မူ ထိုကန့်သတ်ချက် မသက်ရောက်ပါ" → "ဆောင်းရာသီနှင့် နွေရာသီ ကျောင်းပိတ်ရက် (寒暑假) တွင်သာ ထိုကန့်သတ်ချက် မသက်ရောက်ပါ" (opening); permit-duration paragraph now says "ဆောင်းရာသီ၊ နွေရာသီ ကျောင်းပိတ်ရက် (寒暑假) မှလွဲ၍ …" and "ထိုကျောင်းပိတ်ရက်တွင်လည်း အလုပ်ရှင်သည် … လိုက်နာရဆဲ"; FAQ 2 question and answer rewritten ("… 寒暑假 တွင်သာ မသက်ရောက်ပါ။ ထိုမှလွဲသော အချိန်များတွင် ကန့်သတ်ချက် ဆက်သက်ရောက်သည်").

**M2 (Permit Regs Art. 51(2) exception) — ACCEPTED.**
Checked: 「具語文專長，且有下列情形之一，並經教育部專案核准：（一）入學後於各大專校院附設語文中心或外國在華文教機構附設之語文中心兼任外國語文教師。（二）入學後協助各級學校語文專長相關教學活動。二、就讀研究所，並經就讀學校同意從事與修習課業有關之研究工作。」 My sentence dropped "language expertise" and the school's consent.
Old → New: "ပညာရေးဝန်ကြီးဌာန သီးသန့်ခွင့်ပြုသော ဘာသာစကားအလုပ်နှင့် ဘွဲ့လွန်ကျောင်းသား၏ သင်ကြားမှုနှင့်ဆိုင်သော သုတေသနအလုပ်တို့မှာ ထိုအတည်ပြုချက်မှ ကင်းလွတ်သည်" → "ဘာသာစကားကျွမ်းကျင်မှုရှိပြီး စည်းမျဉ်းပါ ဘာသာစကားသင်ကြားရေးအလုပ်ကို ပညာရေးဝန်ကြီးဌာန၏ သီးသန့်ခွင့်ပြုချက်ဖြင့် လုပ်သူမှာ ထိုအတည်ပြုချက်မှ ကင်းလွတ်သည်။ မိမိသင်ယူသော ဘာသာရပ်နှင့်ဆိုင်သည့် သုတေသနအလုပ်ကို မိမိတက်ရောက်သောကျောင်း၏ သဘောတူညီချက်ဖြင့် လုပ်သော ဘွဲ့လွန်ကျောင်းသားလည်း ထို့အတူ ဖြစ်သည်".

**M3 (2 years or more) — ACCEPTED.**
Checked: Standard Art. 5(2) 「取得相關系所之學士學位而有二年以上相關工作經驗者」 = two years or more. "နှစ်နှစ်ကျော်" means more than two.
Old → New: "နှစ်နှစ်ကျော် ဖြစ်သည်" → "နှစ်နှစ်နှင့်အထက် ဖြစ်သည်".

**S1 (variety checker) — NOTED, no text change.**
`variety_metrics.py` has no `my` profile (`--lang my` is rejected; auto-detection is wrong). I reported this in `work/my-author.md` and used a syllable-based approximation instead (CV 0.47–0.48, 8–9% sentences of 14 syllables or fewer in 810/811, 7% in 812). It cannot give a valid zero-FAIL result for Burmese; a human Burmese reader should judge monotony.

**S2 (graduation exception) — ACCEPTED.**
Checked: WDA student Q&A 10 「工作許可因休學、退學、畢業、語文學習或技術訓練階段性課程結束，失其效力。但畢業且取得學士、碩士或博士班錄取通知繼續就學且完成入學報到程序者，不在此限。」
Old → New: "ဘွဲ့ရလျှင် ကျောင်းသားအလုပ်ခွင့်ပြုချက် ဆုံးသည်။" → "ဘွဲ့ရလျှင် ကျောင်းသားအလုပ်ခွင့်ပြုချက် ယေဘုယျအားဖြင့် ဆုံးသည်။ ဘွဲ့ဆက်တက်ရန် ဝင်ခွင့်ရပြီး ကျောင်းအပ်ပြီးသူမှာ ချွင်းချက်ဖြစ်သည်။"
Length offset: deleted "ဒဏ်ငွေနှစ်ခုသည် သီးခြားစီ ဖြစ်သည်။".

## 811

**M1 (MLCA Art. 19, NT$100,000,000 boundary and fine) — ACCEPTED.**
Checked: 「有第二條各款所列洗錢行為者，處三年以上十年以下有期徒刑，併科新臺幣一億元以下罰金。其洗錢之財物或財產上利益未達新臺幣一億元者，處六月以上五年以下有期徒刑，併科新臺幣五千萬元以下罰金。」 So exactly NT$100 million is in the upper tier, with a fine up to NT$100 million.
Old → New: "ပမာဏ ထိုထက်ပိုလျှင် ထောင်ဒဏ် 3 နှစ်မှ 10 နှစ်ဖြစ်သည်။" → "NT$100,000,000 နှင့်အထက်ဖြစ်လျှင် ထောင်ဒဏ် 3 နှစ်မှ 10 နှစ်ဖြစ်ပြီး ငွေဒဏ် NT$100,000,000 အထိ တွဲချမှတ်သည်။" (lower tier sentence unchanged).

**M2 (Banking Act Arts. 29, 125) — ACCEPTED.**
Checked: Art. 29(1) 「除法律另有規定者外，非銀行不得經營…國內外匯兌業務」; Art. 125(1) 「處三年以上十年以下有期徒刑，得併科新臺幣一千萬元以上二億元以下罰金。其因犯罪獲取之財物或財產上利益達新臺幣一億元以上者，處七年以上有期徒刑，得併科新臺幣二千五百萬元以上五億元以下罰金。」
Old → New: "ထိုပုဒ်မက ဘဏ်မဟုတ်သူကို … တားမြစ်ပြီး ပုဒ်မ 125 အရ ထောင်ဒဏ် 3 နှစ်မှ 10 နှစ်ဖြစ်သည်" → "ထိုပုဒ်မက ဥပဒေတွင် အခြားခွင့်ပြုချက်မရှိလျှင် ဘဏ်မဟုတ်သူကို … တားမြစ်သည်။ ပုဒ်မ 125 အရ ပုံမှန်ပြစ်ဒဏ်မှာ ထောင်ဒဏ် 3 နှစ်မှ 10 နှစ်ဖြစ်ပြီး ငွေဒဏ် NT$10,000,000 မှ 200,000,000 အထိ တွဲချမှတ်နိုင်သည်။ ပြစ်မှုမှ ရသောငွေ သို့မဟုတ် အကျိုးအမြတ် NT$100,000,000 နှင့်အထက်ဖြစ်လျှင် ထောင်ဒဏ် အနည်းဆုံး 7 နှစ်ဖြစ်ပြီး ငွေဒဏ် NT$25,000,000 မှ 500,000,000 အထိ တွဲချမှတ်နိုင်သည်။" ("得併科" kept as "နိုင်သည်", discretionary.)

**M3 (account-warning start date and extension notice) — ACCEPTED.**
Checked on law.moj.gov.tw (pcode G0380199, amended 115-08-31, same text as the FSC page): Art. 9 「警示帳戶之警示期限自通報時起算，逾二年自動失其效力。但有繼續警示之必要者，原通報機關應於期限屆滿前再行通報之，通報延長以一次及一年為限。」 The period runs from the notification (通報) to the bank, and the original authority must notify an extension before expiry.
Old → New: "ပုဒ်မ 9 အရ သတိပေးကာလသည် နှစ်နှစ်ဖြစ်သည်။ တိုးချဲ့ခြင်းကို တစ်ကြိမ်၊ တစ်နှစ်အထိသာ ပြုနိုင်သည်။" → "ပုဒ်မ 9 အရ သတိပေးကာလကို ဘဏ်သို့ အကြောင်းကြားသည့်အချိန်မှ ရေတွက်ပြီး နှစ်နှစ်ကျော်လျှင် အလိုအလျောက် ပျက်ပြယ်သည်။ ဆက်ထားလိုလျှင် မူလအကြောင်းကြားသည့်အဖွဲ့က ကာလမကုန်မီ ထပ်အကြောင်းကြားရမည်။ တိုးချဲ့ခြင်းကို တစ်ကြိမ်၊ တစ်နှစ်အထိသာ ပြုနိုင်သည်။" (Here "နှစ်နှစ်ကျော်" is correct: 逾二年 = beyond two years.) Sources list still links the FSC page; the law.moj.gov.tw copy has the same text.
Length offsets: Art. 30 sentence shortened; the duplicate "tell them at the first call" language sentence removed from the body (kept in FAQ 3).

## 812

**M1 (domestic formation formalities applied to registering a foreign marriage) — ACCEPTED, with both readings reported.**
Checked RIS 結婚登記: 「申請人 97年5月23日起結婚者：結婚雙方當事人。97年5月22日以前（含97年5月22日當日）結婚或其結婚已生效者：結婚當事人之一方。」 and 「結婚書約：依民法第982條規定：自民國97年5月23日起，結婚應以書面為之，並應由雙方當事人向戶政機關為結婚之登記，方為有效。」 plus 「在國外結婚已生效者，應檢附經我駐外館處…驗證之結婚證明…」. Art. 982 is a rule for forming a marriage in Taiwan. The RIS page does not say which applicant line governs a marriage already effective in Myanmar; the second line ("其結婚已生效者") suggests one spouse, the first suggests both. I could not settle this from official text, so the article now states both and tells the reader to confirm with the household registration office.
Old → New: "ထိုင်ဝမ်ဘက်၏ မှတ်ပုံတင်ကို တရားမဥပဒေ ပုဒ်မ 982 က ပြဋ္ဌာန်းသည်။ လက်ထပ်မှုကို စာဖြင့်ပြုလုပ်၍ သက်သေနှစ်ဦးနှင့်အထက် လက်မှတ်ထိုးရမည်။ နှစ်ဖက်စလုံးကလည်း မှတ်ပုံတင်ရမည်။" → "ထိုင်ဝမ်တွင် လက်ထပ်ဖွဲ့စည်းလျှင် ပုဒ်မ 982 အရ စာဖြင့်ပြုလုပ်၍ သက်သေနှစ်ဦးနှင့်အထက် လက်မှတ်ထိုးရမည်၊ နှစ်ဖက်စလုံးက မှတ်ပုံတင်ရမည်။ မြန်မာတွင် ပြီးစီးပြီးသော လက်ထပ်မှုကို ထိုင်ဝမ်တွင် မှတ်ပုံတင်ရာ၌မူ RIS က လျှောက်ထားသူကို နှစ်မျိုးခွဲ၍ ဖော်ပြသည်။ 2008 ခုနှစ် မေလ 23 ရက်မှစ၍ လက်ထပ်သူများအတွက် နှစ်ဦးစလုံး၊ မေလ 22 ရက် သို့မဟုတ် ထိုမတိုင်မီ လက်ထပ်သူ သို့မဟုတ် လက်ထပ်မှု ထိရောက်ပြီးသူအတွက် တစ်ဦးဟု ရေးထားသည်။ မည်သည့်စည်းမျဉ်း သက်ရောက်သည်ကို မှတ်ပုံတင်ရုံးထံ အတည်ပြုပါ။" The separate sentence "အစဉ်လိုက်ကို RIS က ပြတ်သားစွာ ရေးထားသည်" was dropped because the paragraph now cites RIS directly; the order itself (Myanmar marriage, interview, authentication, Taiwan registration) is unchanged and still supported by the RIS line 「經外交部公告之特定國家，國人與特定國家人士結婚須先於外籍配偶之原屬國完成結婚登記後，備齊結婚證明文件向駐外館處申請面談，再持憑經駐外館處驗證之結婚證明文件，向國內戶政機關辦理結婚登記」. FAQ 1 still says only that Myanmar registration comes first and Taiwan registration uses the mission-authenticated paper.

**M2 (marital-status affidavits and passports: dual nationals) — ACCEPTED.**
Checked mission sheet, section on registration in Myanmar: 「我國人應持我國護照入境緬甸（台、緬雙籍之國人亦得持緬甸護照入境緬甸）」 and 「緬籍配偶及台、緬雙籍國人須另辦理「婚姻狀況宣誓書」。(本處僅受理結婚雙方各自辦理之「婚姻狀況宣誓書」，不接受當事人雙方「共同」婚姻狀況宣誓書…)」. So the affidavit is required of the Myanmar spouse and a Taiwan–Myanmar dual-national spouse, not of every Taiwanese spouse.
Old → New: "နှစ်ဦးစလုံးက … ကြေညာချက် … ကို သီးခြားစီ ပြုလုပ်ရသည်" → "မြန်မာအိမ်ထောင်ဖက်နှင့် နိုင်ငံသားနှစ်မျိုးရှိသော ထိုင်ဝမ်အိမ်ထောင်ဖက်တို့က … ကို တစ်ဦးချင်းစီ ပြုလုပ်ရသည်"; passport sentence now "ပုံမှန်အားဖြင့် ထိုင်ဝမ်နိုင်ငံကူးလက်မှတ်ဖြင့် … ဝင်ရသည်။ ထိုင်ဝမ်–မြန်မာ နိုင်ငံသားနှစ်မျိုးရှိသူမူ မြန်မာနိုင်ငံကူးလက်မှတ်ဖြင့်လည်း ဝင်နိုင်သည်".

**M3 (two years of marriage AND evidence of living together) — ACCEPTED.**
Checked MOFA directions, exemption list: 「雙方育有親生子女。結婚二年以上並有共同生活事實之具體事證。」 "ကျော်" meant "more than". Retained discretion (得免予面談) and the "interview previously failed" exclusion.
Old → New: "လက်ထပ်ပြီး နှစ်နှစ်ကျော် အတူနေထိုင်ကြောင်း သက်သေရှိခြင်း" → "လက်ထပ်ပြီး နှစ်နှစ်နှင့်အထက်ရှိကာ အတူနေထိုင်ကြောင်း တိကျသော သက်သေရှိခြင်း" in the body and in FAQ 2.

**M4 (visa application is not only "after registration") — ACCEPTED.**
Checked BOCA PDF (rev. 115-08-24) (二): 「當事人於境外完成外籍配偶原屬國之結婚程序後，備齊申請依親簽證及結婚文件驗證之相關資料及表格…，並繳交各該申請費用後，提出面談之申請」, with health exam, police record and registered household transcript "於此階段暫無須提出"; and the mission sheet: on interview day the applicant pays the resident-visa fee and the authentication fee. My step 4 and later repetition ("မှတ်ပုံတင်ပြီးမှ ဗီဇာကို လျှောက်ရသည်") contradicted the opening.
Old → New: step 2 now "စာရွက်စာတမ်းများနှင့် ဗီဇာလျှောက်လွှာပုံစံများ စုဆောင်းကာ ကြေးများပေးပြီး ကိုယ်စားလှယ်ရုံးတွင် အင်တာဗျူးလျှောက်သည်"; step 4 "မှတ်ပုံတင်ပြီးနောက် မတင်ရသေးသော စာရွက်များကို ဖြည့်တင်၍ ဇနီး၊ ခင်ပွန်းဗီဇာ လုပ်ငန်းစဉ်ကို အပြီးသတ်သည်"; section 5 "ဗီဇာလျှောက်လွှာနှင့် ကြေးများကို အင်တာဗျူးလျှောက်စဉ်က တင်ပြီးဖြစ်ရာ မှတ်ပုံတင်ပြီးနောက် ကျန်စာရွက်များကို ဖြည့်တင်ရသည်"; FAQ 3 rewritten the same way.

**M5 (ARC 30-day rule depends on visa type) — ACCEPTED, with both sources reported.**
Checked: mission sheet, step on visa issue: 「本處將視情況發給國人之外籍配偶居留或停留簽證（倘係核發停留簽證，簽證費用差額將不退費）」; BOCA resident-visa guidance: 「持居留簽證入境或在中華民國境內獲改換發居留簽證者，應於入境次日或居留簽證簽發日起30日內，向居留地之內政部移民署各縣（市）服務站申請外僑居留證及重入國許可」 and, for the other case, 「申請人倘持停留期限60日以上、且未加註「不得延期」(NO EXTENSION)或「不得在臺改辦居留」之停留簽證入境、符合依親…居留事由，請逕向內政部移民署各縣(市)服務站申請外僑居留證」.
Old → New: "ဗီဇာဖြင့် ဝင်ရောက်ပြီးနောက် ARC ကို … 30 ရက်အတွင်း … လျှောက်ရသည်" → the mission may issue a resident or a visitor visa; with a resident visa the 30-day rule applies; a visitor visa of 60 days or more without the "no extension / no change to residence" notation allows a direct ARC application to the NIA; "ကိုယ်ရသည့်ဗီဇာအမျိုးအစားနှင့် ကိုက်ညီသည့် စည်းမျဉ်းကို လူဝင်မှုကြီးကြပ်ရေးဌာနနှင့် အတည်ပြုပါ". FAQ 3 now says 30 days applies "နေထိုင်ခွင့်ဗီဇာဖြင့် ဝင်ရောက်ပါက" and that a visitor visa holder must confirm the ARC route with the NIA.

## Length after repairs (main body, Burmese code points; estimate 7 and 5.8 code points per English word)

| | before | after | English-word equivalent |
|---|---|---|---|
| 810 | 5,625 | 5,851 | about 835–1,010 |
| 811 | 6,606 | 6,888 | about 985–1,190 |
| 812 | 6,923 | 7,176 | about 1,025–1,240 |

To keep growth small I deleted non-essential sentences, none of them a legal condition: 810 "the two fines are separate"; 811 the repeated "tell them when called" sentence and part of the Art. 30 sentence; 812 the interview recording/no-coercion sentences, the NIA home-visit sentence, the "answer truthfully whether or not a broker introduced you" sentence, the "returned for spelling errors" sentence, the passport-and-form bullet in the visa list, and two "check the current version" sentences. 812 remains the longest and is above the 950-word guideline at the upper estimate; further cuts would remove the discrepancy report on the police certificate or the visa-type ARC distinction, which the coordinator asked to keep.
