# Hebrew native review — part a (he)
reviewer: Grok 4.6 · date: 2026-09-21 · scope: he-guidance.txt (365 strings); columns-he/001-taiwan-company-establishment-basics.md, 002-withdraw-capital-taiwan-company.md, 003-taiwan-traffic-accident-procedure.md, 004-taiwan-company-subsidiary-vs-branch.md, 005-taiwan-company-establishment-advanced-2.md, 006-taiwan-massage-history-law.md, 007-taiwan-divorce-lawsuit-qna.md, 008-taiwan-labor-severance-law.md, 009-taiwan-voluntary-resignation-severance.md

## Verdict
naturalness (1 = machine, 5 = native professional): 3/5 for guidance pack, 2/5 for columns
variety used: Israeli Hebrew (עברית ישראלית), consistent in the guidance pack; columns mix high-register legal calque with leftover Korean-blog first person. Traditional Chinese glosses are Traditional (臺北, 居留, 工作許可) and should stay. No mix of vocalization systems beyond odd partial niqqud in one alt-text.
systemic patterns (max 6, each one line, with 1 example quote):
- Korean-audience leftovers never generalized for Israel: `/ko/korean-lawyer-in-taiwan`, "הדוברת קוריאנית", "שלא כמו בקוריאה", Taiwan–Korea tax treaty as the default treaty.
- Masculine grammar for attorney Wei Tseng in bios and first-person columns: "מוסמך (M.S.)", "איני ממליץ", "אני מסיים", "איני חושף".
- Copy-and-paste calque of "does not mean": "אינה משמעה", "אין משמע הדבר" (native: "אין פירוש הדבר" / "אין בכך כדי לומר").
- Machine numerals instead of Hebrew: "1 שנה", "ערכאה 2", "צד 3", "2 עדים".
- French guillemets «» on a Hebrew site (Israeli legal/web copy uses "…" or ״…״).
- Guidance titles for Wei Tseng are correctly feminine ("עורכת הדין המנהלת", "ייצגה", "מוסמכת" in the qualification sentence). Consultation-language disclaimers stay negative and should stay so.

Guidance pack is careful, inclusive, and legally hedged; a native can follow it, but it still reads as translationese (stock "עורכת דין או עורך דין" in almost every sentence, "קבוצות העבודה", broken sentence on intake). Columns 001–002, 004 and 007 are dense and structurally useful; 003 Q16–Q20, 005, 006, 008 and 009 still sound like a Korean blog, with Hangul URLs, `/ko/` "see also" links, and outcome-talk a client in Israel must not see.

## Findings
| # | sev | cat | file | quote (≤120 chars, verbatim) | problem (English, one line) | suggested Hebrew rewrite |
|---|-----|-----|------|------|------|------|
| 1 | P1 | F | he-guidance.txt | "מוסמך (M.S.), Institute of Finance, National Taiwan University" | Masculine degree title on Wei Tseng's own education line (also "בוגר (B.A.)" on the next line). | מוסמכת (M.S.), Institute of Finance, National Taiwan University |
| 2 | P1 | F | columns-he/003-taiwan-traffic-accident-procedure.md | "לכן איני ממליץ למסור את מכלול הסכסוך למבטח." | First-person masculine; she is a woman. Also "בכך אני מסיים" in the same file; "האם איני חושף בלי משים את גילי?" in 006. | לכן איני ממליצה למסור את מכלול הסכסוך למבטח. |
| 3 | P1 | A | he-guidance.txt | "אם נוכל לקבל עניין תלוי בתוכן ובשפת התקשורת." | Sentence is ungrammatical; the "whether" subject was dropped, so the intake rule does not parse. | קבלת עניין תלויה בתוכן ובשפת התקשורת. |
| 4 | P1 | A | he-guidance.txt | "חוות דעת" | `reviewCountWord` — in a law firm this means a legal opinion, not Google reviews. | ביקורות |
| 5 | P1 | A | he-guidance.txt | "הסניף בטאיצ׳ונג מטפל בעניינים הנדסיים, בקניין רוחני" | German/EN sense is construction matters (Bausachen), not "engineering matters"; also in the about-foreign paragraph. | הסניף בטאיצ׳ונג מטפל בענייני בנייה, בקניין רוחני |
| 6 | P1 | A | columns-he/002-withdraw-capital-taiwan-company.md | "מאסר לתקופה של 5 שנים לכל היותר, מעצר או קנס פלילי (罰金)" | 拘役 rendered as מעצר (= arrest). Israeli readers hear a pre-trial measure, not a short sentence. Also Art. 90 in the same file. | מאסר עד 5 שנים, מאסר קצר (拘役) או קנס פלילי (罰金) |
| 7 | P1 | E | columns-he/003-taiwan-traffic-accident-procedure.md | "ויפעל לקבלת הפיצוי הגבוה ביותר האפשרי." | "Highest possible" compensation is a forbidden best/result claim. | ויפעל למיצוי הפיצוי המגיע לפי הדין והראיות. |
| 8 | P1 | E | columns-he/003-taiwan-traffic-accident-procedure.md | "בחבלה ברשלנות גוזרים בתי המשפט כיום עונש של כ-3 חודשים." | Typical-sentence talk reads as a predicted result; same block states 4 and 6 months as "usually". | בתי המשפט גוזרים במקרים מתאימים מאסר קצר, אך אין עונש טיפוסי ואין תוצאה מובטחת. |
| 9 | P1 | E | columns-he/005-taiwan-company-establishment-advanced-2.md | "אם יש לכם שאלות נוספות, ניתן לפנות אלינו בכל עת." | "At any time" is a 24/7 / always-available promise the Hebrew pages must not make. | לשאלות נוספות אפשר לשלוח פנייה בטופס יצירת הקשר. אין הבטחה למענה מיידי. |
| 10 | P1 | E | columns-he/008-taiwan-labor-severance-law.md | "לכן יכול היה אחר כך, בעזרת עורכת דין, לקבל דמי פיטורים גבוהים" | Anecdote advertises a successful high payout obtained with a lawyer. | לכן יכול היה אחר כך, בייצוג משפטי, לבסס את זכאותו לדמי פיטורים לפי הדין. |
| 11 | P1 | G | columns-he/001-taiwan-company-establishment-basics.md | "](/ko/services/investment)" | Hebrew article points at Korean-locale paths. Also in 002, 003, 004, 005, 007, 008, 009. | ](/he/contact) or the matching /he/services/… slug |
| 12 | P1 | G | columns-he/003-taiwan-traffic-accident-procedure.md | "עורכת דין בטאיוואן הדוברת קוריאנית" | Visible CTA still sells a "Korean-speaking" lawyer to Israeli readers. Also in 005, 008, 009. | יצירת קשר / מאמרים בעברית |
| 13 | P1 | G | columns-he/005-taiwan-company-establishment-advanced-2.md | "https://www.wei-wei-lawyer.com/post/%EB%8C%80%EB%A7%8C-%ED%9A%8C%EC%82%AC%EC%84%A4%EB%A6%BD-%EA%B8%B0%EC%B4%88%ED%8E%B8" | Body links still encoded Hangul (대만-회사설립-…). | קישור למאמר העברי המקביל, בלי נתיב קוריאני |
| 14 | P1 | D | columns-he/005-taiwan-company-establishment-advanced-2.md | "בהעברת ההון (資本額) מקוריאה לחשבון המכין" | Q1–Q5 still address a Korean remitter/Korean national; Israeli reader is written out. | בהעברת ההון ממדינת המושב לחשבון המכין (יש לבדוק את דיני מטבע החוץ במדינת המשקיע) |
| 15 | P1 | D | columns-he/001-taiwan-company-establishment-basics.md | "הסכם מס הכנסה (所得稅協定) בין טאיוואן לקוריאה" | Korea treaty is the only treaty explained, as if the reader were Korean. Also 004 tables/FAQ. | הסכם למניעת כפל מס, אם קיים בין טאיוואן למדינת המושב של המשקיע (למשל הסכם טאיוואן–קוריאה, 所得稅協定) |
| 16 | P2 | C | he-guidance.txt | "קבוצות העבודה" | Calque of "practice groups"; Israeli firms say תחומי עיסוק / תחומי התמחות. Repeats across home, services, FAQ. | תחומי העיסוק |
| 17 | P2 | C | he-guidance.txt | "ראשי" | Nav "Home" as "ראשי" is translator shorthand; Israeli sites use דף הבית. | דף הבית |
| 18 | P2 | B | he-guidance.txt | "העמוד «יצירת קשר» מסביר" | French guillemets on Hebrew UI; Israeli legal/web copy uses "…" or ״…״. Systemic in guidance + 004, 005, 008, 009. | העמוד "יצירת קשר" מסביר |
| 19 | P2 | C | he-guidance.txt | "בודקת עורכת דין או בודק עורך דין את התוכן" | Gender-split word order no native would write. | עורכת דין או עורך דין בודקים את התוכן |
| 20 | P2 | B | he-guidance.txt | "אין משמע הדבר שהייעוץ התקיים או שאושרה פגישה." | "אין משמע הדבר" is not Hebrew; related calque "אינה משמעה" runs through 001–003. | אין פירוש הדבר שהייעוץ התקיים או שאושרה פגישה. |
| 21 | P2 | D | he-guidance.txt | "קראתי את עמוד הפרטיות ואני מסכים לשליחת פנייה זו." | Consent is masculine-only; Israeli forms use inclusive or past-tense. FAQ "אם איני יכול" has the same gap. | קראתי את עמוד הפרטיות והסכמתי לשליחת פנייה זו. |
| 22 | P2 | D | he-guidance.txt | "קאוסיונג" | Israeli/Hebrew media: קאושיונג (高雄); ס instead of ש. Also officeTitles.kaohsiung. | קאושיונג |
| 23 | P2 | C | he-guidance.txt | "בדיקת מען העסק ודרישות ענפיות" | מען is archaic/biblical for "address"; native is כתובת. | בדיקת כתובת העסק ודרישות ענפיות |
| 24 | P2 | C | he-guidance.txt | "ציינו מוקדם את התאריך שעליו" | "The date on it" copied from the source; same formula on contact. | ציינו בהקדם את התאריך הנקוב במסמך |
| 25 | P2 | B | he-guidance.txt | "אם ברצונכם מחיקה מוקדמת יותר, ציינו זאת בפנייה." | Missing ב/ל; ungrammatical. | אם ברצונכם לבקש מחיקה מוקדמת יותר, ציינו זאת בפנייה. |
| 26 | P2 | C | he-guidance.txt | "העבודה החוצה גבולות כוללת הקמת חברות" | Calque of "cross-border work". | העבודה חוצת הגבולות כוללת הקמת חברות |
| 27 | P2 | C | he-guidance.txt | "הגשות של סימני מסחר ופטנטים" | "Filings of trademarks" in Hebrew word order. Also practice-area name. | רישום סימני מסחר ופטנטים |
| 28 | P2 | C | he-guidance.txt | "אנו תומכים גם בהנהלת חשבונות ובמיסוי" | "We support accounting" calque; same "תומכים ברישום סימני מסחר". | אנו מלווים גם בהנהלת חשבונות ובמיסוי |
| 29 | P2 | A | he-guidance.txt | "בהפעלת הזכויות והחובות כלפי ילדים קטינים ובנשיאה בהן" | Literal dump of 未成年子女權利義務之行使或負擔; custody/parental responsibility is lost. | במשמורת ובאחריות ההורית כלפי ילדים קטינים (未成年子女權利義務之行使 או 負擔) |
| 30 | P2 | C | he-guidance.txt | "ביקורת החשבונות השותפה" | Calque of "partner audit"; the role line already has the right term. Also lawyers.description. | רואה החשבון השותף |
| 31 | P2 | C | he-guidance.txt | "איננו מבטיחים מתורגמן, מועד למענה ולא פגישה דרך עמוד זה." | ולא after a comma-list is the wrong coordinator; keep the negatives. | איננו מבטיחים מתורגמן, איננו מבטיחים מועד למענה, ואין פגישה הנקבעת דרך עמוד זה. |
| 32 | P2 | C | he-guidance.txt | "סאנהֶייוּאָן (三合院)" | Partial niqqud on a Chinese courtyard name looks machine-made. | סאנהייוואן (三合院) |
| 33 | P2 | C | columns-he/001-taiwan-company-establishment-basics.md | "בדיקה מוקדמת של שם החברה בסימני האן" | "Han characters" (漢字) as סימני האן is opaque to Israeli readers. | בדיקה מוקדמת של שם החברה בתווים סיניים (סימניות האן, 漢字) |
| 34 | P2 | C | columns-he/001-taiwan-company-establishment-basics.md | "אם המעסיק, חברה או סניף, קיים פחות מ-1 שנה" | "1 שנה / 1 השנה / ממוצע 3 השנים" is spreadsheet Hebrew. Systemic in 001–009. | אם המעסיק — חברה או סניף — קיים פחות משנה |
| 35 | P2 | C | columns-he/003-taiwan-traffic-accident-procedure.md | "בערכאה 2" | "Instance 2" / "ערכאה 1" copied from numbered source. | בערכאה השנייה |
| 36 | P2 | C | columns-he/003-taiwan-traffic-accident-procedure.md | "Q16. לאחר התאונה, האם ניתן להשאיר הכול בידי המבטח?" | Q16–Q20 drop the professional register of Q1–Q15: first-person blog, empty lines, comment CTA. | Restore the Q1–Q15 register; drop "השאירו אותן בתגובות". |
| 37 | P2 | D | columns-he/003-taiwan-traffic-accident-procedure.md | "התקשרו ל-119, ואם יש עבירה או מצב ביטחון דחוף, ל-110 או ל-112." | Taiwan emergency numbers without saying so; 112 is EU/Israel-adjacent and will mislead. | התקשרו בטאיוואן למוקד ההצלה 119, ולמשטרה 110 (או 112 בנייד) |
| 38 | P2 | D | columns-he/004-taiwan-company-subsidiary-vs-branch.md | "גם כאשר חברה אם קוריאנית נכנסת לטאיוואן" | Parent-company example still Korean; §2 tax and §Korea-side credits stay Korea-only. | גם כאשר חברה אם זרה נכנסת לטאיוואן |
| 39 | P2 | D | columns-he/007-taiwan-divorce-lawsuit-qna.md | "כגון קוריאה וטאיוואן" | Cross-border family example is still Korea–Taiwan, not Israel–Taiwan. | כגון ישראל וטאיוואן |
| 40 | P2 | D | columns-he/008-taiwan-labor-severance-law.md | "בטאיוואן, שלא כמו בקוריאה" | Labor explainers still contrast Korea (퇴직금), not Israeli פיצויי פיטורים. Also 009 "וזה שונה מקוריאה". | בטאיוואן, שלא כמו במדינות שבהן משתלם מענק גם בהפסקה מרצון |
| 41 | P2 | B | columns-he/007-taiwan-divorce-lawsuit-qna.md | "זהו נקודת מוצא לסיווג ולהוכחה בחישוב המשטר" | Gender clash: זהו (m.) + נקודת (f.). | זו נקודת מוצא לסיווג ולהוכחה בחישוב המשטר |
| 42 | P2 | B | columns-he/007-taiwan-divorce-lawsuit-qna.md | "גם בקשה לאחר עבור תקופת הבקשה חייבת להתקבל" | "לאחר עבור" is not Hebrew (calque of 經過). | גם בקשה לאחר שעברה תקופת הבקשה חייבת להתקבל |
| 43 | P2 | D | columns-he/007-taiwan-divorce-lawsuit-qna.md | "פסק החוקה מספר 4 לשנת 112 (112年憲判字第4號)" | ROC year 112 is unexplained; Israeli reader needs 2023. | פסק החוקה מספר 4 לשנת 112 (2023; 112年憲判字第4號) |
| 44 | P2 | C | columns-he/004-taiwan-company-subsidiary-vs-branch.md | "יש לשפוט על כל משך הפעילות." | Broken preposition; native לשפוט לאורך / לאור כל תקופת הפעילות. | יש לשפוט לאור כל תקופת הפעילות. |
| 45 | P2 | C | columns-he/001-taiwan-company-establishment-basics.md | "את היקף העבודה הנוגע בדבר ניתן לעיין ב" | את + לעיין is ungrammatical. | בהיקף העבודה הנוגע בדבר ניתן לעיין ב |
| 46 | P2 | G | columns-he/008-taiwan-labor-severance-law.md | "פיטורים כלכליים  **資遣** **員工(經濟解僱)**" | Raw Chinese stacked in the table cell, not a parenthetical gloss. | פיטורים כלכליים (資遣 / 經濟解僱) |
| 47 | P2 | C | columns-he/008-taiwan-labor-severance-law.md | "האם באמת קשה לקבל דמי פיטורים בטאיוואן??" | Blog title with double ?? and chopped one-line paragraphs; 005/006/009 share the Korean-blog layout. | דיני עבודה בטאיוואן: מתי משתלמים דמי פיטורים (資遣費)? |
| 48 | P2 | C | he-guidance.txt | "אם אין זה ברור לאיזו קבוצה שייך העניין שלכם" | Literary "אם אין זה ברור"; native אם אינכם בטוחים. | אם אינכם בטוחים לאיזו קבוצה שייך העניין שלכם |
