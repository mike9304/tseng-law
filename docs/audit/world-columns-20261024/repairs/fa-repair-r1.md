# fa repair round 1 (response to reviews/codex-fa-r1.md), 2026-10-24

All nine items were checked against the statute or official text again (`python3 tools/law.py`, curl of the NIA guideline PDF, BOCA pages). All nine MUST items are ACCEPTED; none was rebutted. The one SHOULD (830 S1) is also applied. Edits were limited to the three `drafts/fa/*.md` files. The frontmatter parses as YAML (Ruby), each file still has 3 FAQ entries, body links are all in Sources, no bold, no H1. The Arabic-profile proxy of `variety_metrics.py` (no `fa` profile exists) still reports OK for all three.

## 828

**M1 ACCEPTED** — "every job needs the employer's permit" overstated.
Check: ESA art 43 reads 「除本法另有規定外，外國人未經雇主申請許可，不得在中華民國境內工作」; FPA art 9 (Gold Card, applied for directly by the specialist) and art 15(1) (spouse applies directly to MOL) are routes the article itself describes.
Changes (old → new):
- Job-seeking paragraph: «این روادید مجوز کار نیست؛ هر کاری مجوز کارفرما را می‌خواهد.» → «این روادید هم به‌خودی‌خود اجازهٔ کار نمی‌دهد؛ مجوز کار را همان‌طور که در بخش نخست آمد، در حالت عادی کارفرما می‌گیرد.»
- Business-eVisa paragraph: «این راه برای بازرگانان است؛ کار کردن همچنان مجوز کارفرما می‌خواهد.» → «این روادید به‌خودی‌خود اجازهٔ کار نمی‌دهد. در حالت عادی، کارفرما باید مجوز کار بگیرد؛ مسیرهای درخواست مستقیم و معافیت‌های قانونی جداگانه‌اند.»
- Summary: «کار بدون مجوزی که کارفرما می‌گیرد ممکن نیست» → «کار در حالت عادی مجوزی می‌خواهد که کارفرما می‌گیرد» (165 characters, still within 110–170).
- FAQ 1: «کار کردن هم مجوزی می‌خواهد که کارفرما برای کارمند درخواست می‌کند» → «کار کردن هم، جز در استثناها و مسیرهای درخواست مستقیمی که قانون می‌شمارد، مجوزی می‌خواهد که کارفرما برای کارمند درخواست می‌کند» (art 43 still cited).

**M2 ACCEPTED** — FPA art 5(1) sends ESA 46(1)(3) and FPA 4(4)(4),(5) jobs to the Ministry of Education.
Check: 第5條第1項「應檢具相關文件，向勞動部申請許可。但聘僱從事就業服務法第四十六條第一項第三款及前條第四款第四目、第五目之專業工作者，應檢具相關文件，向教育部申請許可」, preceded by 「除本法另有規定外」.
Change: «برای کار تخصصی، کارفرما باید با مدارک لازم از وزارت کار مجوز بخواهد (» → «برای کار تخصصی، کارفرما جز در موارد استثنایی قانون باید با مدارک لازم از وزارت کار مجوز بخواهد؛ برای برخی مشاغل آموزشی، مرجع درخواست وزارت آموزش است (» (art 5 link kept).

**M3 ACCEPTED** — FAQ 2 dropped the exception, and the body's "unless other rules say otherwise" was incomplete.
Check: NIA guideline (HTML page and the PDF "0915 Guidelines…", note 7(1)): 「Applicants holding a visitor visa valid for 180 days and bearing the remark “No Extension” may apply. Those entering … and those whose visas contain annotations prohibiting extension, conversion to a residence visa, or application for a residence certificate in the State, shall not be eligible to apply, unless otherwise provided by relevant regulations.」 The reviewer is right that the first sentence permits that case. I kept the wording close to the NIA text ("visa valid for 180 days" translated as "اعتبار 180 روز", the NIA's own phrase) and did not try to resolve the internal tension in the NIA note.
Changes:
- Body: «…این راه را می‌بندد، مگر مقرراتی خلاف آن بگوید.» → «…اصولاً این راه را می‌بندد، اما همان راهنما به دارندهٔ روادید ملاقات با اعتبار 180 روز و قید «No Extension» اجازهٔ درخواست می‌دهد، و مقررات دیگر هم می‌توانند استثنا بیاورند.»
- FAQ 2: «متخصصی که با روادید ملاقات وارد شده و مجوز کار یا معافیت از آن را دارد، شرایط درخواست مستقیم اقامت را جداگانه دارد، و روادیدی که تمدید یا تبدیل را ممنوع کرده باشد این راه را می‌بندد.» → «متخصص دارای مجوز کار یا معافیت قانونی ممکن است بتواند پس از ورود با روادید ملاقات مستقیماً اقامت بخواهد. قیدهای منع تمدید یا تبدیل اصولاً مانع‌اند، اما راهنمای اداره مهاجرت برای روادید ملاقات با اعتبار 180 روز و قید «No Extension» و برای مواردی که مقررات دیگر مقرر کرده‌اند امکان درخواست را حفظ کرده است.»

## 829

**M1 ACCEPTED** — the catch-all category is not limited to nuclear/bio-chemical/missile weapons.
Check: the notice (PDF, section I(2)) reads 「有可能用於生產、發展核子、生化、飛彈等軍事武器用途」; 「等」 makes the three named types examples.
Changes:
- Body: «…ممکن است به تولید یا توسعهٔ سلاح هسته‌ای، زیستی-شیمیایی یا موشکی برسد.» → «…احتمالاً به تولید یا توسعهٔ سلاح‌های نظامی، از جمله سلاح‌های هسته‌ای، زیستی-شیمیایی یا موشکی، مربوط شود.»
- FAQ 2: «اگر مصرف یا مصرف‌کنندهٔ نهایی احتمالاً به تولید یا توسعهٔ سلاح هسته‌ای، زیستی-شیمیایی یا موشکی برسد، کالا حتی بیرون از فهرست‌ها هم راهبردی شمرده می‌شود.» → «کالای خارج از فهرست‌ها نیز ممکن است مشمول کنترل باشد، اگر مصرف یا مصرف‌کنندهٔ نهایی آن احتمالاً به تولید یا توسعهٔ سلاح‌های نظامی، از جمله سلاح‌های هسته‌ای، زیستی، شیمیایی یا موشک، مربوط شود.»

**M2 ACCEPTED** — group 3 omitted the alternative "other related assurance documents".
Check: notice I(3) and the Agency page: 「依出口國政府規定須取得我國核發國際進口證明書或其他相關保證文件之輸入貨品」.
Change: «گروه سوم کالای وارداتی است که کشور صادرکنندهٔ اصلی گواهی واردات تایوان را برایش شرط کرده» → «گروه سوم شامل کالاهای وارداتی است که طبق مقررات کشور صادرکننده، به گواهی بین‌المللی واردات صادرشده از تایوان یا دیگر اسناد تضمینی مرتبط نیاز دارند».

**M3 ACCEPTED** — "every destination needs a permit" ignored SHTC regulation art 15(2).
Check: art 15(2) 「輸往美國或日本之戰略性高科技貨品，具有下列情形之一，且經出口人查證國外交易對象非屬…出口實體管理名單之對象或主管機關告知之特定對象，主管機關得免發輸出許可證：一、同一出口管制貨品輸出金額離岸價格低於新臺幣三十萬元者。二、實施內部出口管控制度並經貿易署認定之出口人」. The waiver is discretionary ("得") and limited to US/Japan, so the Iran/Afghanistan point stands. This also reverses my earlier note that the Japan/US exemption was irrelevant: it is now mentioned, only to bound the "permit for every destination" statement.
Change: «مقصد بیرون از این شش نام هم بی‌مجوز نیست. صادرات کالای راهبردی به هر جا مجوز می‌خواهد (فقرهٔ 1 ماده 13)؛ تخلف در آن حالت می‌تواند…» → «خارج‌بودن مقصد از این شش نام، به‌تنهایی معافیت از مجوز نیست؛ اصل ممنوعیت صادرات بدون مجوز است (فقرهٔ 1 ماده 13). برای برخی صادرات به آمریکا یا ژاپن، مرجع صالح می‌تواند در شرایط فقرهٔ 2 ماده 15 آیین‌نامه صدور مجوز را لازم نداند: پس از بررسی اینکه طرف خارجی در فهرست نهادها و میان طرف‌های اعلام‌شدهٔ مرجع نیست، و در صورت ارزش زیر 300,000 دلار جدید تایوان (قیمت فوب) یا وجود نظام کنترل داخلی تأییدشده. این استثنا ایران یا افغانستان را شامل نمی‌شود. در غیر این موارد، صادرات بی‌مجوز به مقصد بیرون از فهرست می‌تواند…». The closing sentence about Afghanistan now reads «افغانستان در آن شش نام نیست، اما برای آن هم مجوز لازم است.» No FAQ stated the universal rule, so no FAQ change was needed.
Length housekeeping: the three additions pushed 829 past the target, so I removed «انگیزهٔ هر تأمین‌کننده را فقط خودش می‌داند.» (the preceding sentence is already hedged), folded the mainland-China limit into the parenthesis after the name in the first paragraph (same fact, FAQ 1 still consistent) and dropped the last sentence of the contact paragraph (it repeated the foreign-law line). Body is now 977 words including headings and the contact paragraph, with Chinese glosses counted.

## 830

**M1 ACCEPTED** — art 23(1)(1) requires the Taiwanese spouse to be currently residing in Taiwan with household registration.
Check: 第23條第1項第1款「配偶為現在在臺灣地區居住且設有戶籍或獲准居留之我國國民…」.
Change: «همسر خارجی شهروندی که در تایوان ثبت خانوار دارد، اگر با روادیدی وارد شده باشد که … قید ممنوعیت تمدید یا قید دیگری ندارد» → «همسر خارجیِ شهروندی که اکنون در تایوان زندگی می‌کند و در آنجا ثبت خانوار دارد، اگر با روادید معتبری وارد شده باشد که … قید ممنوعیت تمدید یا قید محدودکنندهٔ دیگری ندارد». For consistency the next paragraph's «با چنین شهروندی» became «با شهروند دارای ثبت خانوار در تایوان», because ESA art 48(1)(2) requires only household registration in the ROC, not residence there.

**M2 ACCEPTED** — certificate description incomplete.
Check: BOCA spouse-visa page (Chinese): 「申請人本國政府1年內所核發之無犯罪紀錄證明或良民證，倘該證明註明有效期限，則不得逾該證明效期（該證明須經中華民國駐外館處驗證）」.
Change: «…گواهی عدم سوءپیشینهٔ صادرشده در یک سال اخیر و گواهی سلامت سه‌ماههٔ اخیر را می‌خواهد» → «…گواهی عدم سوءپیشینه و گواهی سلامت سه‌ماههٔ اخیر را می‌خواهد؛ گواهی عدم سوءپیشینه باید در یک سال اخیر از سوی دولت کشور متقاضی صادر و به تصدیق نمایندگی تایوان رسیده باشد، و اگر تاریخ انقضا دارد، هنگام ارائه نباید منقضی شده باشد».

**M3 ACCEPTED** — first-email list asked for prior-marriage history (also per the coordinator's note).
Change: «در پیام نخست کافی است بنویسید: ملیت هر دو طرف، ازدواج پیشین احتمالی، محل ازدواج یا ثبت، روادید یا اقامت فعلی، نام طرف مقابل برای بررسی تضاد منافع و نزدیک‌ترین مهلت.» → «در پیام نخست فقط خلاصه‌ای غیرحساس از موضوع، نام طرف مقابل برای بررسی تضاد منافع، ارتباط موضوع با تایوان و مهلت‌های پیش رو را بنویسید.» The rest of that paragraph (no ID copy, bank details or full originals; no lawyer–client relationship; languages arranged first) is unchanged. 828 and 829 contact paragraphs were not flagged and were left as they are; both stay within the brief (a non-sensitive summary, counterparty or employer name for conflict check, Taiwan connection, deadline).

**S1 ACCEPTED (small and clearly correct)** — «ساخته می‌شود» was awkward for officially issued documents.
Changes, body and FAQ 2: «اسنادی که در خارج ساخته می‌شود باید نمایندگی تایوان تصدیق کرده باشد، و ترجمهٔ چینی اسناد فارسی را نمایندگی تصدیق می‌کند یا سردفتر تایوانی گواهی می‌کند» → «مدارک لازم برای ثبت ازدواج که در خارج صادر یا تنظیم شده‌اند باید به تصدیق نمایندگی تایوان برسند؛ ترجمهٔ چینی مدارک فارسی نیز باید به تصدیق نمایندگی یا گواهی سردفتر تایوانی برسد». Same authentication and translation rules (ris.gov.tw: 「應備證件在國外作成者，應經我駐外館處驗證…應另檢附經駐外館處驗證或國內公證人認證之中文譯本」).

## Reviewer's remark on the checker
The checker has no `fa` profile. I ran it only with `--lang ar` as a proxy and recorded that in `work/fa-author.md`; sentence variety was also checked by hand. No claim of a validated Persian measurement is made. Persian idiom has not had native review.

## Counts after repair (body words, headings and contact paragraph included, URLs stripped)
828 = 943, 829 = 977, 830 = 876. Titles 62/63/62 characters, summaries 165/163/170. The counts in `work/fa-author.md` (888/926/842) are now outdated; the claim tables there remain valid except that the SHTC regulation art 15(2) is now also used in 829.
