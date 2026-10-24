# ur repair round 1 (response to reviews/codex-ur-r1.md)

Checked 24 October 2026. Every MUST was re-read against the statute via `python3 tools/law.py` (B0010001, B0000007, N0090001, N0090031, A0030295) or the official page by curl (BOCA PDF `dl-5210-…`, BOCA directions `cp-212-4295-61dd5-1`, BOCA FAQ `fp-398-696-550e9-1`, NIA guide `…/141970`). All 13 items (11 MUST: 2 on 825, 6 on 826, 3 on 827; plus 2 SHOULD, one each on 826 and 827) are correct; none was rebutted. Edited files: the three `drafts/ur/*.md` only (the author note `work/ur-author.md` was not touched, so its word counts and a few descriptions are now superseded by the figures below).

## 825-pakistani-exporter-unpaid-taiwan-buyer-invoice.md

### M1 ACCEPTED (CCP art. 515 start date; art. 516 service trigger in FAQ 3)
- Statute: 515(1) 「發支付命令後，三個月內不能送達於債務人者，其命令失其效力。」; 516(1) 「債務人對於支付命令之全部或一部，得於送達後二十日之不變期間內，不附理由…提出異議。」
- Body, old: 「اور تین ماہ میں تعمیل نہ ہو تو حکم ختم ہو جاتا ہے」 → new: 「اور حکم جاری ہونے کے بعد تین ماہ میں خریدار تک تعمیل نہ ہو تو حکم ختم ہو جاتا ہے」.
- FAQ 3, old: 「تعمیل تین ماہ میں نہ ہو تو حکم ختم ہو جاتا ہے (دفعہ 515)۔ خریدار 20 دن میں … اعتراض کر سکتا ہے」 → new: 「حکم جاری ہونے کے بعد تین ماہ میں خریدار تک تعمیل نہ ہو … خریدار تعمیل کے بعد 20 دن میں … اعتراض کر سکتا ہے」. The table row "تعمیل کے بعد 20 دن" already had the trigger.

### M2 ACCEPTED (Choice-of-Law Act art. 20(2))
- Statute: 20(1) 「依當事人意思定其應適用之法律」; 20(2) 「當事人無明示之意思或其明示之意思依所定應適用之法律無效時，依關係最切之法律」; 20(3) presumption retained.
- Body, old: 「معاہدے میں قانون کا انتخاب لکھا ہو تو وہی چلتا ہے۔ نہ لکھا ہو تو سب سے قریبی تعلق والا قانون دیکھا جاتا ہے، اور اگر …」 → new (reviewer's wording, presumption clause kept): 「قانون کے انتخاب کا واضح اور معتبر اتفاق ہو تو منتخب قانون لاگو ہوتا ہے۔ ایسا اتفاق نہ ہو، یا انتخاب منتخب قانون کے مطابق باطل ہو، تو سب سے قریبی تعلق والا قانون لاگو ہوتا ہے، اور اگر …」.
- FAQ 1, old: 「معاہدے میں قانون کا انتخاب نہ ہو تو … دفعہ 20 کی شق 3 کا قیاس」 → new: 「قانون کا واضح اور معتبر انتخاب نہ ہو، یا انتخاب منتخب قانون کے مطابق باطل ہو، تو … دفعہ 20 کی شق 2 کے مطابق سب سے قریبی تعلق والا قانون لاگو ہوتا ہے، اور شق 3 کا قیاس …」.
- Side edit for length: the arbitration sentence "… تائیوان میں غیر ملکی ثالثی فیصلہ کہلاتا ہے۔ عدالت اسے تسلیم کر لے تو …" became "… ثالثی کا فیصلہ عدالت سے تسلیم کرایا جائے تو …" (same content, art. 47 recognition requirement kept).

Body now 961 words (was 949).

## 826-pakistani-engineer-taiwan-work-permit-arc-family.md

### M1 ACCEPTED (ESA arts. 43/48 exceptions) + S1 ACCEPTED (signpost deleted)
- Statute: 43 「除本法另有規定外，外國人未經雇主申請許可，不得在中華民國境內工作。」; 48(1) 「…應檢具有關文件，向中央主管機關申請許可。但有下列情形之一，不須申請許可：…」
- Opening, old: 「پہلے دیکھیں کہ اجازت کس کے ہاتھ میں ہے۔ غیر ملکی آجر کی درخواست اور منظوری کے بغیر تائیوان میں کام نہیں کر سکتا …، اور درخواست آجر دیتا ہے …」 → new: 「عام آجر کے ذریعے بھرتی میں، قانونی استثنا یا قابلِ اطلاق موجودہ ورک پرمٹ کے بغیر، غیر ملکی کو آجر کی درخواست پر ملنے والی اجازت درکار ہوتی ہے …؛ … گولڈ کارڈ جیسے راستے الگ ہیں (نیچے)۔ آفر لیٹر معاہدے کا ثبوت ہے، کام کی اجازت نہیں۔」 The offer-letter warning is kept.
- FAQ 1 rewritten to the same effect ("نہیں۔ محض آفر لیٹر سے کام شروع نہیں کیا جا سکتا۔ عام آجر کے ذریعے بھرتی میں، قانونی استثنا … کے بغیر … گولڈ کارڈ جیسے راستے الگ ہیں (دفعہ 9)").

### M2 ACCEPTED (Standard art. 5)
- Statute: 5 「…仍應符合下列資格之一：一、依專門職業及技術人員考試法規定取得證書或執業資格者。二、取得…碩士以上學位者，或取得相關系所之學士學位而有二年以上相關工作經驗者。三、服務跨國企業滿一年以上經指派來我國任職者。四、經專業訓練，或自力學習，有五年以上相關經驗，而有創見及特殊表現者。」
- Old: 「… (بیچلر ہو تو دو سال کا تجربہ) … پانچ سال کا متعلقہ تجربہ اور نمایاں کارکردگی」 → new: 「… سند یا پریکٹس کی اہلیت؛ یا … ماسٹرز یا اس سے اوپر کی ڈگری، یا متعلقہ بیچلر ڈگری کے ساتھ کم از کم دو سال کا متعلقہ تجربہ؛ … یا پیشہ ورانہ تربیت یا خودآموزی کے ساتھ کم از کم پانچ سال کا متعلقہ تجربہ، اختراعی صلاحیت اور غیر معمولی کارکردگی」. ("執業資格" and "創見" restored too.) The FPA art. 6 paragraph that follows is unchanged.

### M3 ACCEPTED (Standard art. 7 counting)
- Statute: 7 「…其工作期間在九十日以下者，外國人資格不受第五條之限制。但自申請日起前一年內履約工作期間與當次申請工作期間累計已逾九十日者，外國人仍應符合第五條第一款、第二款及第四款之規定。」
- Old: 「کام 90 دن یا کم ہو تو دفعہ 5 کی اہلیت لازم نہیں؛ پچھلے ایک سال کے دن ملا کر 90 سے بڑھ جائیں تو شقیں 1، 2 اور 4 لاگو ہو جاتی ہیں」 → new: 「اس معاہداتی کام کی مدت 90 دن یا کم ہو تو دفعہ 5 کی اہلیت سے چھوٹ ہے؛ مگر درخواست کی تاریخ سے پچھلے ایک سال کے ایسے کام اور اس درخواست کے کام کے دن ملا کر 90 سے بڑھیں تو دفعہ 5 کی شق 1، 2 یا 4 میں سے ایک اہلیت لازم ہے، شق 3 کافی نہیں」. "One of" is read from art. 5's own lead 「仍應符合下列資格之一」; the statute for art. 7 names items 1, 2 and 4 and so excludes item 3.

### M4 ACCEPTED (FPA art. 16(2) condition)
- Statute: 16(2) 「外國專業人才在我國從事專業工作及外國特定專業人才，經內政部移民署許可居留或永久居留者，其配偶、未成年子女及因身心障礙無法自理生活之成年子女，以免簽證或持停留簽證入國者，得逕向內政部移民署申請居留」. The "從事專業工作" qualifier attaches to the ordinary professional; the specific professional needs only NIA residence/permanent residence.
- Body: new first sentence of the family section (reviewer's wording, compressed): 「دفعہ 16 کی شق 2 کی شرط یہ ہے: عام غیر ملکی پیشہ ور تائیوان میں پیشہ ورانہ کام کر رہا ہو اور NIA سے رہائش یا مستقل رہائش پا چکا ہو؛ خاص پیشہ ور کے لیے NIA کی رہائش یا مستقل رہائش کی منظوری درکار ہے۔」, followed by the unchanged family categories and entry conditions. FAQ 3 carries the same condition.

### M5 ACCEPTED (FPA art. 15(1) dependent-residence condition)
- Statute: 15(1) 「外國特定專業人才及外國高級專業人才之配偶，經內政部移民署許可在我國依親居留者，得逕向勞動部申請許可，在我國從事工作；該工作許可期間不得逾其依親居留期間。」
- Old: 「… اجازت کی مدت رہائش کی مدت سے آگے نہیں جا سکتی۔」 → new: 「خاص یا اعلیٰ پیشہ ور کا شریکِ حیات، NIA سے تائیوان میں خاندانی بنیاد (依親) پر رہائش کی اجازت ملنے کے بعد، وزارتِ محنت کو براہِ راست کام کی اجازت کی درخواست دے سکتا ہے …؛ ہر انجینئر کے شریکِ حیات کے لیے یہ راستہ نہیں۔ ورک پرمٹ کی مدت اسی خاندانی رہائش کی مدت سے آگے نہیں جا سکتی۔」 FAQ 3 corrected the same way.

### M6 ACCEPTED (NIA note 6(4))
- Source: NIA guide note 6(4): "changes his/her resident address or his/her place of employment … shall apply to the NIA for registering the change within thirty (30) days, calculating from the next day of the occurrence of the event."
- Old: 「رہائشی پتہ یا آجر بدلے تو 30 دن میں ہجرت ایجنسی (NIA) کو بتانا ہوتا ہے」 → new: 「رہائشی پتہ یا کام کی جگہ بدلنے پر تبدیلی کے اگلے دن سے 30 دن کے اندر ہجرت ایجنسی (NIA) میں تبدیلی کا اندراج کرانا ہوتا ہے」.

Length: body grew from 946 to 1,006 words because of the restored conditions. To limit growth I removed the sentence "پہلے وزٹ پر جا کر …" and the visitor-visa example list from the body (the FAQ 2 list and the "do not plan on visit-first" advice stay), compressed the mission-list paragraph, and shortened the internal-links sentence (now links only the severance column `/ur/columns/taiwan-labor-severance-law`; the link to the mandatory-service-period column was dropped, which does not affect the Sources list). It remains about 6% above the 950 band; a reviewer who wants it shorter can drop the FPA art. 6 paragraph or the Gold Card paragraph without touching any MUST fix.

## 827-pakistani-fiance-marry-taiwanese-national-interview.md

### M1 ACCEPTED (police clearance timing: BOCA sources disagree)
- Sources: BOCA PDF (revised 2026-08-24), (二)1: 「（外籍配偶之體檢表、無犯罪紀錄及業經結婚登記之戶籍謄本於此階段暫無須提出）」; interview directions, point 3(9): 「外國人無犯罪紀錄證明，須經文件核發國主管機關驗證。」 listed among documents to be submitted when registering for the interview. They conflict.
- Old step 2: 「طبی رپورٹ، پولیس کلیئرنس اور شادی کے اندراج والی ہاؤس ہولڈ نقل اس مرحلے پر درکار نہیں۔」 → new: 「جدول طبی رپورٹ، پولیس کلیئرنس اور اندراج والی ہاؤس ہولڈ نقل اس مرحلے پر مؤخر کرتی ہے، مگر انٹرویو کی ہدایات پولیس کلیئرنس کو ابتدائی کاغذات میں رکھتی ہیں؛ دفتر سے پوچھ لیں کہ یہ سند کب اور کس تصدیق کے ساتھ دینی ہے۔」 Neither source is picked.
- Documents paragraph: police clearance is now described as authenticated by the issuing country's competent authority (point 3(9)), both certificates in one clause.

### M2 ACCEPTED (BOCA FAQ police-certificate rule)
- Source: BOCA FAQ item 3: 「申請人本國政府1年內所核發之無犯罪紀錄證明或良民證，倘該證明註明有效期限，則不得逾該證明效期（該證明須經中華民國駐外館處驗證）」.
- Old: 「… ایک سال کے اندر کی پولیس کلیئرنس …」 (visa list) and 「رہائشی ویزا کے لیے پولیس کلیئرنس ایک سال سے پرانی نہیں ہونی چاہیے۔」 → new: visa list says only "پولیس کلیئرنس"; closing paragraph now says 「ازدواجی حیثیت کا ثبوت اجرا کے بعد 6 ماہ تک معتبر ہے (RIS)۔ رہائشی ویزا کے لیے پولیس کلیئرنس پچھلے ایک سال میں جاری ہوئی ہو، اس پر درج کوئی مدتِ اعتبار ختم نہ ہوئی ہو، اور تائیوانی دفتر سے تصدیق شدہ ہو (BOCA)۔」 The six-month marital-status rule and its RIS source are unchanged.

### M3 ACCEPTED (interview directions points 8–9)
- Source: point 8 「…認雙方所繳文件真實性有疑慮者，得函請原發證機關查證」; point 9 「得要求當事人一個月內補正證明婚姻屬實之相關事證，限期未補正者，面談不予通過。」
- Old: 「دفتر کاغذات پر شبہ ہو تو جاری کرنے والے ادارے سے تصدیق کروا سکتا ہے اور ایک ماہ میں مزید ثبوت مانگ سکتا ہے۔」 → new: 「انٹرویو کے بعد دفتر کاغذات کی اصلیت پر شبہ ہو تو جاری کرنے والے ادارے سے تصدیق کروا سکتا ہے؛ وہ شادی کی حقیقت کے مزید ثبوت ایک ماہ کے اندر جمع کرانے کا بھی کہہ سکتا ہے، اور مقررہ وقت میں ثبوت نہ دینے پر انٹرویو پاس نہیں مانا جاتا۔」 (discretion kept with "سکتا").

### S1 ACCEPTED
- Deleted the signpost 「ترتیب اسی جدول سے شروع ہوتی ہے۔」; the BOCA table, offices, Hong Kong exception and source are untouched.

Side edits for length (no legal change): shortened the translation paragraph and the art. 23-1 sentence and the interview-record sentence. Body 940 → 987 words.

## Cross-checks after repair
- Every URL linked in a body is still in that article's Sources list; the only Sources entry not linked in a body is the FPA legislative-history page (826), kept as an official page used for the in-force check.
- FAQ/summary consistency: 825 FAQ 1 and 3, 826 FAQ 1 and 3, 827 FAQ unchanged except as listed; titles, seoTitle and summaries unchanged and still accurate (826 summary "آفر لیٹر کام کی اجازت نہیں" remains true).
- No bold, no H1; YAML frontmatter re-parsed (16 fields, 3 FAQ entries each).
- Variety check (same `--lang ar` approximation as before, still not a validated Urdu measurement): 825 cv 0.588 short 0.14; 826 cv 0.727 short 0.143; 827 cv 0.800 short 0.219; no limit violated in any.
- Final body word counts (excluding Sources): 825 = 961, 826 = 1,006, 827 = 987.
