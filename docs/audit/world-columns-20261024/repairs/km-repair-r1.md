# km repair r1 (response to reviews/codex-km-r1.md)

Verification done on 24 October 2026: `python3 tools/law.py D0030001 4`, `G0340072 23`, `D0080132 23`, `D0060001 18`; BOCA page cp-402-179; Taipei Land Department page and the New Taipei land office table fetched with curl. All eight review items are ACCEPTED (none rebutted). No FAQ or summary text was affected by any item. After the edits: Sources lists and body links match in all three files, YAML parses (ruby), all 48 distinct URLs return 200/206 (one transient 502 on the MOFA release cleared on retry), sentence-variety measures are unchanged in kind (CV 0.49 / 0.62 / 0.61; 4 short sentences each).

## 813

[M1] ACCEPTED. Text checked: BOCA cp-402-179, document 5 「申請人本國政府1年內所核發之無犯罪證明或良民證，倘該證明註明有效期限，則不得逾該證明效期」; also 「無犯罪紀錄證明及良民證均須附中文或英文譯本，並經中華民國駐外館處驗證」.
- Old (bullet 3): លិខិតមិនមានទោសពីរដ្ឋាភិបាលកម្ពុជា ចេញក្នុង 1 ឆ្នាំ មានការបកប្រែជាភាសាចិនឬអង់គ្លេស និងការផ្ទៀងផ្ទាត់
- New: លិខិតមិនមានទោសពីរដ្ឋាភិបាលកម្ពុជា ចេញក្នុង 1 ឆ្នាំ ហើយបើលិខិតកំណត់ថ្ងៃផុតសុពលភាព ត្រូវមិនទាន់ហួសថ្ងៃនោះ ; លិខិតត្រូវមានការបកប្រែជាភាសាចិនឬអង់គ្លេស និងការផ្ទៀងផ្ទាត់ (kept as one bullet, semicolon instead of a second sentence).

[S1] ACCEPTED. Meaning unchanged (「單身證明」 in the 2017 MOI letter).
- Old: ភាពទទេមានគូ → New: ភាពនៅលីវ ("លិខិតបញ្ជាក់ភាពនៅលីវតាមទម្រង់ធម្មតា"). The 2017 attribution, "may accept", and the prompt to ask whether it still applies are unchanged.

## 814

[M1] ACCEPTED. Nationality Act 4(1) head: 「外國人或無國籍人，現於中華民國領域內有住所，具備前條第一項第二款至第五款要件，於中華民國領域內，每年合計有一百八十三日以上合法居留之事實繼續三年以上…」. The domicile condition was missing.
- Old (end of the naturalisation sentence): …ហើយត្រូវបំពេញលក្ខខណ្ឌទូទៅនៃមាត្រា 3 ចំណុច 2 ដល់ 5 ដូចជាអាចចិញ្ចឹមខ្លួនបាន។
- New: …ហើយត្រូវបំពេញលក្ខខណ្ឌទូទៅនៃ[មាត្រា 3](…D0030001&flno=3) ចំណុច 2 ដល់ 5 ដូចជាអាចចិញ្ចឹមខ្លួនបាន។ នៅពេលដាក់ពាក្យ អ្នកដាក់ពាក្យក៏ត្រូវមានទីលំនៅ (住所) នៅតៃវ៉ាន់ដែរ។ Article 3 added as a body link and in Sources (Nationality Act: មាត្រា 3 និង 4).

[M2] ACCEPTED. Brief: first inquiry = non-sensitive summary, other party's name for conflict check, Taiwan connection, any deadline; the child's age is outside that list.
- Old: …ទំនាក់ទំនងជាមួយតៃវ៉ាន់ អាយុកូន និងថ្ងៃផុតសុពលភាពប័ណ្ណស្នាក់នៅ។ → New: …ទំនាក់ទំនងជាមួយតៃវ៉ាន់ និងថ្ងៃផុតសុពលភាពប័ណ្ណស្នាក់នៅ។ I also re-read the contact paragraphs of 813 (summary, other party's name, Taiwan connection, deadline) and 815 (summary, other heirs' names, Taiwan connection, the day the heir learned of the inheritance, which starts the 3-month period): both stay within the brief.

## 815

[M1] ACCEPTED, with one adjustment to the wording. Verified: Land Act 18 「外國人在中華民國取得或設定土地權利，以依條約或其本國法律，中華民國人民得在該國享受同樣權利者為限」; Taipei Land Department (資料更新 113-01-18): 「外國人不論是要購買、受贈或繼承本國不動產，依土地法第18條規定，必須要符合平等互惠條件」; MOI letter 110-05-13 台內地字第11002625943號 table (New Taipei land office): 「非平等互惠之國家 柬埔寨 Cambodia 無法取得我國不動產」. My earlier sentence put Art. 18 only on "other land", which was wrong; this also resolves item 7 of my earlier dropped-statements list in `work/km-author.md` (that file is not edited here, so treat that item as superseded).
- Old: ចំពោះអ្នកទទួលមរតកបរទេស [មាត្រា 17 កថាខណ្ឌទី 2] ចែងថា ដីប្រភេទខ្លះ… ត្រូវលក់ឱ្យជនជាតិតៃវ៉ាន់ក្នុង 3 ឆ្នាំ… ; ដីផ្សេងទៀតមានវិធានក្នុងមាត្រា 18 ដល់ 20 ដូច្នេះគួរសួរការិយាល័យដីធ្លីមុនចុះបញ្ជី។
- New (own paragraph): ការទទួលដីតាមមរតកដោយជនបរទេសក៏ត្រូវបំពេញលក្ខខណ្ឌផ្តល់សិទ្ធិស្មើគ្នាទៅវិញទៅមកតាម[មាត្រា 18] ដែរ ដូចការិយាល័យដីធ្លីក្រុងតៃប៉ិ[ពន្យល់]។ [បញ្ជីរបស់ក្រសួងមហាផ្ទៃ] (លិខិតថ្ងៃទី 13 ឧសភា 2021) ចាត់កម្ពុជាជាប្រទេសមិនមានលក្ខខណ្ឌនេះ ហើយកត់ចំណាំថា មិនអាចទទួលអចលនវត្ថុនៅតៃវ៉ាន់។ ដូច្នេះប្រពន្ធដែលមានតែសញ្ជាតិខ្មែរ មិនគួរសន្មតថានាងអាចចុះបញ្ជីដីជាឈ្មោះខ្លួនបានទេ ; [មាត្រា 17 កថាខណ្ឌទី 2]… ជាវិធានដាច់ដោយឡែក ហើយការពន្យល់ខាងលើមិនលើកលែងមរតកពីមាត្រា 18 ទេ។ សិទ្ធិទទួលមរតកតាមក្រមរដ្ឋប្បវេណី និងលក្ខខណ្ឌទទួលដីតាមច្បាប់ដីធ្លី ជាសំណួរពីរផ្សេងគ្នា។ គួរសួរការិយាល័យដីធ្លីអំពីចំណាត់ថ្នាក់បច្ចុប្បន្ន និងវិធីចាត់ចែងចំណែកមរតកដែលពាក់ព័ន្ធនឹងដី។
- Differences from the proposed text: I kept the Art. 17(2) rule (it is still accurate) but as a separate rule that does not lift Art. 18, and wrote "should not assume" instead of "cannot", because the classification is a 2021 table (the sentence also says to ask for the current one). Sources added in the body and the list: Land Act 18, the Taipei Land Department page, the MOI table.

[M2] ACCEPTED. Estate and Gift Tax Act 23 para 1: 「…向戶籍所在地主管稽徵機關…辦理遺產稅申報」; para 2: 「被繼承人為經常居住中華民國境外之中華民國國民或非中華民國國民死亡時，在中華民國境內遺有財產者，應向中華民國中央政府所在地之主管稽徵機關辦理遺產稅申報」.
- Old: …ហើយត្រូវប្រកាសនៅការិយាល័យពន្ធតាមទីកន្លែងបញ្ជីគ្រួសារ (戶籍所在地) របស់អ្នកស្លាប់ ([មាត្រា 23…])។
- New: ពន្ធមរតកមានកាលកំណត់ 6 ខែដូចគ្នា តែរាប់ពីថ្ងៃបន្ទាប់ពីស្លាប់។ ជាទូទៅ ត្រូវប្រកាសនៅអាជ្ញាធរពន្ធតាមទីកន្លែងបញ្ជីគ្រួសារ (戶籍所在地) របស់អ្នកស្លាប់ ; ប៉ុន្តែបើអ្នកស្លាប់ជាពលរដ្ឋតៃវ៉ាន់ដែលរស់នៅក្រៅប្រទេសជាប្រចាំ ហើយមានទ្រព្យនៅតៃវ៉ាន់ ត្រូវប្រកាសនៅអាជ្ញាធរពន្ធនៅទីតាំងរដ្ឋាភិបាលកណ្តាល ([មាត្រា 23] កថាខណ្ឌទី 1 និងទី 2)។ Article 26 extension sentence untouched.
- Opening: old 「កាលកំណត់ដទៃទៀតរាប់ពីថ្ងៃស្លាប់」 → new 「កាលកំណត់ផ្សេងទៀតរាប់ពីថ្ងៃស្លាប់ ឬពីថ្ងៃបន្ទាប់ពីស្លាប់」. I used this instead of the proposed vaguer "each procedure has its own start day" because it stays specific and matches the statutes (registration: from the event, Land Act 73: from opening of succession, tax: from the next day).

[M3] ACCEPTED. Immigration Act 23(1)(9): 「配偶死亡時為居住臺灣地區設有戶籍國民，並對在臺灣地區已設有戶籍未成年子女，有撫育事實、行使負擔權利義務或會面交往」; 25 para 11 incorporates the same case.
- Old: …ជនបរទេសដែលដៃគូស្លាប់ជាពលរដ្ឋមានបញ្ជីគ្រួសារតៃវ៉ាន់ ហើយខ្លួនមានកូនមិនគ្រប់អាយុ…
- New: …ជនបរទេសដែលដៃគូស្លាប់ជាពលរដ្ឋតៃវ៉ាន់ ដែលនៅពេលស្លាប់រស់នៅតៃវ៉ាន់ និងមានបញ្ជីគ្រួសារនៅតៃវ៉ាន់ ហើយខ្លួនមានកូនមិនគ្រប់អាយុ… (edited the clause in place instead of adding a sentence; the child alternatives, the visa-condition parenthesis and the Art. 25 sentence are unchanged).

[S1] ACCEPTED. Civil Code 1148 para 1 (succession from the opening) and 1174 (renunciation), 1156 (inventory) are distinct.
- Old heading: ក្នុងរយៈ 3 ខែ លះបង់ ឬទទួលមរតក → New: កាលកំណត់ 3 ខែសម្រាប់លះបង់ និងដាក់បញ្ជីមរតក.

## Found while repairing (not in the review)

- 815, naturalisation sentence (Nationality Act 4(1) head): the same missing domicile condition as 814 M1. Old: …លក្ខខណ្ឌទូទៅដទៃទៀតនៃមាត្រា 3 នៅតែត្រូវពិនិត្យ។ New: ត្រូវមានទីលំនៅ (住所) នៅតៃវ៉ាន់នៅពេលដាក់ពាក្យ ហើយលក្ខខណ្ឌទូទៅដទៃទៀតនៃ[មាត្រា 3] នៅតែត្រូវពិនិត្យ។ Article 3 added to the Sources.
