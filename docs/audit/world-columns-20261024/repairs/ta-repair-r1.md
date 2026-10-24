# ta repair round 1 — response to reviews/codex-ta-r1.md

Checked on 24 October 2026 with `python3 tools/law.py`, the MOJ LawHistory page, and curl on official pages. Edited only `drafts/ta/*.md` and this file. `work/ta-author.md` was not edited (see "Superseded statements" at the end).

Summary: 831 M1 ACCEPTED, M2 ACCEPTED, S1 REBUTTED. 832 M1–M5 ACCEPTED, S1 ACCEPTED. 833 M1, M2 ACCEPTED.

---

## 831

### M1 (qualification paragraph; FPA art. 6) — ACCEPTED
Verification:
- N0090031 art. 5: "外國人受聘僱從事前條工作，除符合本標準其他規定外，仍應符合下列資格之一：一、依專門職業及技術人員考試法規定取得證書或執業資格者。……四、經專業訓練，或自力學習，有五年以上相關經驗，而有創見及特殊表現者。" So the other standards also apply, the certificate route is under the professional/technical examination law, and the five-year route is "professional training or self-study".
- A0030295 art. 6: "外國人取得國內外大學之碩士以上學位，或教育部公告世界大學排名前一千五百名大學之學士以上學位者，受聘僱在我國從事就業服務法第四十六條第一項第一款專門性或技術性工作，除應取得執業資格、符合一定執業方式及條件者，及應符合中央目的事業主管機關所定之法令規定外，無須具備一定期間工作經驗。"
- Commencement: LawHistory A0030295: "令修正公布全文 33 條……定自一百十五年一月一日施行" (art. 6 is not among the later-dated provisions), so in force on 24 Oct 2026.

Old → new:
- Old: "தகுதிக்கு பிரிவு 5 நான்கு வழிகளைத் தருகிறது; ஏதேனும் ஒன்று போதும். தொழில்முறைச் சான்றிதழ் அல்லது பணி உரிமம்; ……; அல்லது குறைந்தது ஐந்து ஆண்டு தொடர்புடைய அனுபவத்துடன் புதுமையும் தனிச்சிறப்பான செயல்பாடும்."
- New: "பிற தகுதி விதிகளையும் பூர்த்தி செய்வதுடன், பிரிவு 5 சொல்லும் நான்கு தகுதிகளில் ஒன்று தேவை: தைவானின் தொழில்முறை மற்றும் தொழில்நுட்பப் பணியாளர் தேர்வுச் சட்டத்தின்படி பெற்ற சான்றிதழ் அல்லது தொழில் உரிமம்; …… தொழில்முறைப் பயிற்சி அல்லது சுயகற்றலுடன் குறைந்தது ஐந்து ஆண்டு …" plus a new sentence on art. 6 (master's or higher, or bachelor's or higher from a top-1,500 university listed by the Ministry of Education: no set period of work experience; licensing and sector-law requirements still apply). Salary sentence kept. Art. 6 added to the body and the source list.
- Wording is my own shorter Tamil, not Codex's paragraph verbatim; every element Codex listed is present.

### M2 (document waiver covers spouse and under-18 children only) — ACCEPTED
Verification, NIA 0915 (updated 2026-04-14), section 4(8):
- (a)(i) spouses: "is exempt from submitting a marriage certificate verified by the overseas missions if the relationship, spouse's name, and identification number have already been annotated in the visa note field … The submission of the identification documents of the sponsoring relative is sufficient".
- (b)(ii) children: "Foreign nationals under the age of eighteen (18) applying for family reunification with their lineal ascendants, if the relationship, family member's name, and ID (or residence permit) number are already noted in the visa annotation column, only need to submit the identity documents of the family member".
- (b)(iv): "Applicants who are 18 or older unable to live independently due to physical or mental disabilities must provide a diagnosis certificate."
So the waiver is limited to the spouse and under-18 children; the earlier sentence over-reached.

Old → new:
- Old: "விசாவின் குறிப்புப் பகுதியிலேயே உறவு, பெயர், அடையாள எண் குறிக்கப்பட்டிருந்தால் அந்தச் சரிபார்க்கப்பட்ட சான்றிதழ் தேவையில்லை."
- New: waiver stated for the spouse and children under 18 (substituting the sponsor's identity documents); "வயது வந்த, குறைபாடுள்ள குழந்தைகளுக்கு இந்த விலக்குக் குறிப்பிடப்படவில்லை; அவர்களுக்கு உறவுச் சான்றும் மருத்துவ நோயறிதல் சான்றும் தேவை."

### S1 (BOCA visa-exempt URL "redirects to the homepage"; use fp-384-4485-149c7-1) — REBUTTED
Not reproduced. Commands run on 24 Oct 2026:
- `curl -s -o /dev/null -w 'code=%{http_code} redirect=%{redirect_url} final=%{url_effective}' https://www.boca.gov.tw/cp-149-4486-7785a-2.html` returned `code=200 redirect= final=https://www.boca.gov.tw/cp-149-4486-7785a-2.html`, with and without a browser User-Agent, and with `-L`.
- The body has no `http-equiv="refresh"`; `<title>` is "Bureau of Consular Affairs, Ministry of Foreign Affairs, Republic of China(Taiwan)-Visa-Exempt Entry"; it contains "Nationals of the following countries are eligible for the visa-exemption program, with a duration of stay of up to 90 days: Albania, Andorra, …" and "Updated：2026-07-17"; neither India nor Sri Lanka appears.
- (The dead BOCA URLs I met earlier, e.g. cp-338-183-05f05-1, do return a meta-refresh to the homepage; the cited URL is not one of them.)
The Chinese page Codex suggests gives the same result, but replacing a working primary link is not required. Text unchanged. The same URL is reused in 832 (S1).

---

## 832

### M1 (severance formula after the Foreign Professionals Act amendment) — ACCEPTED (my earlier reading was wrong)
Verification:
- A0030295 art. 24 (current text): "從事專業工作之外國專業人才及外國特定專業人才，適用勞工退休金條例之退休金制度。但其於本法中華民國一百十四年八月二十九日修正之條文施行前已受僱且仍服務於同一事業單位，於修正施行之日起六個月內，以書面向雇主表明繼續適用勞動基準法之退休金規定者，不在此限。" Para. 2: those who made that election "不得再變更選擇". Para. 3: "依第一項規定適用勞工退休金條例退休金制度者，其適用前之工作年資依該條例第十一條規定辦理。"
- LawHistory A0030295: "中華民國一百十四年九月二十四日總統華總一經字第 11400095401 號令修正公布全文 33 條；依第 33 條規定：施行日期，由行政院定之 / 中華民國一百十四年十一月十八日行政院院臺教字第 1141030485 號令發布第 4 條第 4 款第 4 目後段、第 28、29 條，定自一百十五年六月三十日施行；其餘條文，定自一百十五年一月一日施行". So art. 24 has applied since 1 January 2026.
- BLI notice (https://www.bli.gov.tw/0109916.html, published 2026-06-01): "外專法第24條自115年1月1日修正施行，從事專業工作之外國專業人才及外國特定專業人才……無論是否取得永久居留身分，自是日起適用勞退新制"; election "應於修法施行之日起6個月內(即115年6月30日前)，以書面向雇主表明，屆期未選擇者一律適用勞退新制".
- N0030020 art. 11(2): preserved old service is paid "以契約終止時之平均工資，計給該保留年資之資遣費或退休金，並於終止勞動契約後三十日內發給"; art. 12(1): new-system service "每滿一年發給二分之一個月之平均工資，未滿一年者，以比例計給；最高以發給六個月平均工資為限，不適用勞動基準法第十七條之規定".

What went wrong: I read Pension Act art. 7 (list of covered persons) and the FPA "修正日期 114.09.24" printed by `law.py`, and did not read the FPA LawHistory to see that the 2025 full-text amendment (including art. 24) commenced on 2026-01-01. I have now done that check for every FPA article the three drafts cite (4, 6, 9, 15, 16, 17, 24): all are in the text in force since 2026-01-01 (the 2026-06-30 provisions are art. 4(4)(iv) latter part, 28 and 29, which are not cited).

Old → new:
- Section heading "ஓய்வூதியச் சட்டம் உங்களைச் சேர்க்கிறதா என்பதே சூத்திரத்தை மாற்றும்" → "2026 ஜனவரி 1-க்குப் பிறகு: நிபுணர்களுக்குப் புதிய ஓய்வூதிய முறை, இரு பகுதியாகும் நஷ்டஈடு".
- Removed the Pension Act art. 7 list and the sentence "சட்ட வாசகத்தை அப்படியே படித்தால் அவருக்குப் பிரிவு 17-இன் ஒரு மாதச் சூத்திரம் பொருந்தும்; நிரந்தரத் தங்கல் பெற்றவருக்கு அரை மாதச் சூத்திரம்."
- New text: half-month formula for new-system service (art. 12); art. 24 extends the new system to professional-work foreign professionals regardless of permanent residence, in force since 1 Jan 2026 (LawHistory and BLI linked); election by 30 June 2026 for those already employed at the same employer, not changeable; earlier service preserved and computed separately under the old formula at the termination-date average wage (art. 11 via FPA art. 24(3)); so a hire after 1 Jan 2026 is wholly half-month, an earlier hire may have two parts, an electing employee all old formula; ask the employer which article each part rests on.
- In the severance paragraph of "விலகலா, நீக்கமா" the blanket art. 17 statement now reads "பழைய முறையில் நஷ்டஈட்டுக்கு பிரிவு 17 தரும் அளவு …" and "2026 ஜனவரி 1-க்குப் பிந்தைய நிபுணர் பணிக்காலத்துக்கு வேறு சூத்திரம் பொருந்தும் (அடுத்த பகுதி)".
- FAQ 2 rewritten to the same content (art. 24, 12, 11, 17; the 30 June 2026 election). FAQ 1 ends "தொகை, உங்கள் பணிக்காலம் எந்த ஓய்வூதிய முறையில் வருகிறது என்பதைப் பொறுத்தது."
- Sources: Pension Act art. 7 link removed (no longer cited); arts. 11, 12 kept; FPA art. 24, LawHistory and the BLI notice added. The "checked" line now says the 2025 FPA amendment is in force on that date.

### M2 (art. 31 exceptions sound exhaustive; professional's extension route) — ACCEPTED
Verification:
- D0080129 art. 10: "……從事外國專業人才延攬及僱用法第四條第四款第三目至第五目、第八條至第十一條之專業工作……於居留期限屆滿前，本人、其原經許可居留之配偶、未滿十八歲子女及年滿十八歲因身心障礙無法自理生活之子女，得向移民署申請延期居留。" Para. 2: "自原居留期限屆滿之翌日起延期六個月；延期屆滿前，有必要者，得再申請延期居留一次，總延期居留期間最長為一年。"
- A0030295 art. 17 (same period and one further extension; spouse and children included).
- NIA extension guide (https://www.immigration.gov.tw/5385/7244/7250/7317/居留/29996/, updated 2026-01-19), section 2(5): "其他相關證明文件，例如一個月內核發之離職證明、正式學制畢業證書、司法機關相關證明文件等"; section 10(1): "依本辦法第十條規定申請者，得申請延期六個月；有必要者，得再申請延期居留一次，總延期居留期間最長為一年；其配偶、未滿十八歲子女……亦同".

Old → new:
- Old opening: "…சில குறிப்பிட்ட சூழ்நிலைகளில் மட்டுமே தொடர்ந்து தங்க அனுமதிக்கலாம் (குடியேற்றச் சட்டம் பிரிவு 31)."
- New opening: art. 31 list kept as "பிரிவு 31 பட்டியலிட்ட சில சூழ்நிலைகளில்" (no "only"), then "அட்டையில் அச்சிட்ட தேதிவரை தானாகத் தங்கலாம் என்று கொள்ளக்கூடாது", then the six-month extension for qualifying professionals before the card expires (Residence Regs art. 10), "தானாகக் கிடைக்கும் சலுகைக் காலமோ வேலை செய்யும் அனுமதியோ அல்ல".
- FAQ 3 now names the art. 31 cases as examples, adds the six-month plus one further extension (max one year, regs art. 10 / FPA art. 17), says it is not an automatic grace period or work permission, and says an already-cancelled card must be confirmed with NIA.
- Later section: extension paragraph now cites regs art. 10 as well as FPA art. 17, says it covers spouse and children, and refers to the NIA guide (sections 2(5), 10(1)) listing a separation certificate issued within one month as example evidence; the sentence that the statute is silent on use after an earlier cancellation is kept. "பிரிவு 31 பட்டியலிட்ட சூழ்நிலைகளில் இரண்டு …; பட்டியலில் வேறு சூழ்நிலைகளும் உள்ளன" replaces wording that implied the two cases were the only ones.
- Sources: regs arts. 10 and 20, the NIA extension guide, the BLI notice and the BOCA list added.

### M3 (LSA art. 14 conditions) — ACCEPTED
Verification, N0030001 art. 14: item 5 "雇主不依勞動契約給付工作報酬，或對於按件計酬之勞工不供給充分之工作者"; item 6 "雇主違反勞動契約或勞工法令，致有損害勞工權益之虞者"; para. 2 "勞工依前項第一款、第六款規定終止契約者，應自知悉其情形之日起，三十日內為之。但雇主有前項第六款所定情形者，勞工得於知悉損害結果之日起，三十日內為之"; para. 4 "第十七條規定於本條終止契約準用之". The 30-day rule is stated for items 1 and 6 only. Pension Act art. 12(1) lists art. 14 as a termination to which the new-system formula applies.

Old → new:
- Old body: "நிறுவனமே ஊதியம் தராதது போன்ற தவறு செய்ததால் நீங்கள் முன்னறிவிப்பின்றி ஒப்பந்தத்தை முடித்தாலும் இதே நஷ்டஈடு உண்டு (பிரிவு 14 முதல் பத்தி 5, 6 உட்பிரிவுகள்; நான்காம் பத்தி)."
- New body: unpaid wages = item 5; risk of harm from breach of contract or labor law = item 6; "இரண்டாம் பத்தி 30 நாள் வரம்பை 1, 6 உட்பிரிவுகளுக்கு மட்டுமே சொல்கிறது" with the two 30-day starting points for item 6; severance under para. 4 and the formula depends on the pension regime.
- FAQ 1 rewritten the same way (item 5, item 6 with the risk-of-harm condition, the 30-day rule for item 6 only, amount depends on pension regime).

### M4 (average wage, art. 2(4)) — ACCEPTED
Verification, N0030001 art. 2(4): "計算事由發生之當日前六個月內所得工資總額除以該期間之總日數所得之金額。工作未滿六個月者，指工作期間所得工資總額除以工作期間之總日數所得之金額。工資按工作日數、時數或論件計算者，其依上述方式計算之平均工資，如少於該期內工資總額除以實際工作日數所得金額百分之六十者，以百分之六十計".

Old → new: "வேலை முடியும் நாளுக்கு முந்தைய ஆறு மாதத்தின் மொத்த ஊதியத்தை அந்தக் காலத்தின் மொத்த நாட்களால் வகுத்த தொகை" → the six-month rule counted from the day the calculation event occurs, the actual-period rule for service under six months, and the 60% floor for day, hour and piece-rate pay (stated as 60% of the period's wages divided by actual working days).

### M5 (art. 11(3) force majeure "one month or more") — ACCEPTED
Verification, N0030001 art. 11: "三、不可抗力暫停工作在一個月以上時" (suspension of work of one month or more). The draft said "more than a month".
Old → new: "ஒரு மாதத்துக்கு மேல் தவிர்க்க முடியாத வேலை நிறுத்தம்" → "தவிர்க்க முடியாத காரணத்தால் ஒரு மாதம் அல்லது அதற்கு மேல் வேலை நிறுத்தம்". In the same sentence "5) 確不能勝任" is now "வேலையைச் செய்ய முடியாது என்பது உறுதியாக இருத்தல்" (the statute says plainly unable to do the work); other grounds unchanged.

### S1 (country link; re-entry; link the companion article) — ACCEPTED
Verification: India and Sri Lanka are absent from BOCA's visa-exempt list (page updated 2026-07-17, see 831 S1); D0080129 art. 20 para. 3: "外僑居留證經註銷者，其重入國許可視同註銷". Small and clearly supported, so applied in the family section: India and Sri Lanka are not on the visa-exempt list; a cancelled ARC takes its re-entry permit with it (regs art. 20); anyone planning to leave and return during a gap should settle the visa question beforehand; link to /ta/columns/tamil-engineer-taiwan-work-permit-family-residence. I did not copy Codex's sentence word for word and did not promise anything about re-entry rights.

---

## 833

### M1 (opening makes "when did the defect arise" a precondition to notice) — ACCEPTED
Verification, B0000001 art. 356: "買受人應按物之性質，依通常程序從速檢查其所受領之物。如發見有應由出賣人負擔保責任之瑕疵時，應即通知出賣人。" The body already said not to wait for the final report; the opening contradicted it.
Old: "தைவான் விற்பனையாளருக்கு எழுதும் முன் ஒரு கேள்விக்கு விடை வேண்டும்: குறை எப்போது உருவானது?"
New: "குறை தெரிந்தவுடன் தைவான் விற்பனையாளருக்குத் தெரிவிக்க வேண்டும்; காரணம் உறுதியாகும் வரை காத்திருக்கக்கூடாது. ஆனால் இழப்பை யார் சுமப்பார் என்பதற்கு ஒரு கேள்விக்கு விடை வேண்டும்: குறை எப்போது உருவானது?" Risk-transfer analysis kept.

### M2 (deemed acceptance wording; latent defects; art. 357) — ACCEPTED
Verification, B0000001 art. 356: para. 2 "買受人怠於為前項之通知者，除依通常之檢查不能發見之瑕疵外，視為承認其所受領之物"; para. 3 "不能即知之瑕疵，至日後發見者，應即通知出賣人，怠於為通知者，視為承認其所受領之物"; art. 357 "前條規定，於出賣人故意不告知瑕疵於買受人者，不適用之".
Old: FAQ 2 "…பொருளை ஏற்றதாகக் கருதலாம்." and body "…பொருளை ஏற்றதாகக் கருதுவார்கள்."
New: "…பெற்ற பொருளை ஏற்றதாகக் கருதப்படும்" in both places; the body now adds that the same consequence follows a failure to notify a later-found latent defect; FAQ 2 adds the latent-defect rule and the art. 357 exception.

---

## Checks after the edits
- Front matter parses as YAML (Ruby) with the required field order and three FAQ items in each file; no bold, no H1.
- Every statute link's article exists in the fetched page; every link in a body is also in that article's source list and vice versa; new external URLs return HTTP 200 (LawHistory, BLI notice, NIA extension guide).
- `variety_metrics.py --lang hi` (proxy; Tamil unsupported): 831 cv 0.656, 832 cv 0.503, 833 cv 0.469, no FAIL.
- Main-text size after repair (Tamil words / characters, before the source list): 831 822 / 7,267 (was 728 / 6,424); 832 988 / 8,413 (was 811 / 6,860); 833 695 / 6,253 (was 677 / 6,095). 832 grew by about 23% because the corrected pension rule, the extension route and the art. 14/2(4)/11 conditions had to be stated; I condensed other paragraphs to limit the growth. A reviewer who wants 832 shorter could drop the Article 11 list of grounds or the notice-day table; I did not, because both are accurate and the table is compact.

## Superseded statements in work/ta-author.md (not edited, per instruction)
- Section 832-2 ("why this topic fits") and "Points for the reviewer" item 1 say an ordinary ARC holder is outside the pension scheme and falls under LSA art. 17. That is wrong as of 2026-01-01 for professional-work foreign professionals; the claim table row for Pension Act art. 7 is no longer used in the article.
- The "Version and banner check" there lists the FPA by its amendment date (114.09.24) only; the commencement history (2026-01-01, with 2026-06-30 for a few provisions) is the relevant fact.
- The "Statements dropped" list for 832 is otherwise unchanged; the "which document is the 離職證明文件" hedge was dropped from the text during condensing (the statute does not define it; the service-certificate right under LSA art. 19 stays).
