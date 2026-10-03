# C4 English — final review, round 4 (Claude Fable 5.1)

VERDICT: PASS

Review date: 2026-10-03. Reviewer: Claude Fable 5.1, final gate. Two minor wording edits applied directly to `drafts/C4/en.md`; no facts, numbers, citations or legal meaning changed. No major issue remains.

## Scope checked

Read in full with the Read tool: `brief-SERIES.md`, `brief-EDITORIAL-VOICE.md`, `drafts/C4/en.md`, `drafts/C4/en.facts.md`, `cases/jud/55.txt` (臺灣高等法院114年度上訴字第5567號刑事判決, 2026-01-14), `cases/jud/344.txt` (臺灣新北地方法院113年度審訴字第716號刑事判決, 2025-03-06, with the attached indictment 113年度偵字第38619號), `cases/statutes.md`. Criminal Code Article 33 is not in `statutes.md`; fetched from law.moj.gov.tw (text: 有期徒刑二月以上十五年以下, 但遇有加減時得減至二月未滿或加至二十年; 拘役一日以上六十日未滿, 但遇有加重時得加至一百二十日). Also read the round-3 log `en-astra-r3.md` and `en-astra-note-r3.txt` for context; the fact sheet was not trusted and every claim was checked against the judgment texts.

Mechanical checks (ripgrep over the column): no `**` / `__` / `<b>` / `<strong>`; no defendant, victim, judge or prosecutor names; no phone number or +886 pattern; every link is one of the two supplied judgment URLs (PCDM…716…20250306 and TPHM…5567…20260114) or a single-article law.moj.gov.tw URL for Criminal Code 185, 304, 57, 33, 41, Code of Criminal Procedure 348 and Road Traffic Management and Penalty Act 43.

## 1. Facts against the primary sources

Every factual and legal statement was traced to 55.txt, 344.txt or a statute. Result by claim group:

| Column claim | Source | Result |
|---|---|---|
| About 15:10, 22 Feb 2024 (民國113年); rented light truck toward Linkou, 營業小客車 toward Guishan on 文化一路, 林口區; truck left turn and taxi right turn at 八德路 into the northbound Linkou interchange entrance; sign for left-turning vehicles to keep to inner side; driver knew, violated it without reason, cut in front of the taxi in the outer lane | 55.txt 二㈠; 344.txt 附件 犯罪事實一 | Supported |
| Freeway section Linkou interchange toward Wugu: 4 forced lane entries, 3 emergency brakings in front, driving alongside; quote 任意以迫近、驟然變換車道方式; taxi's automatic braking activated on sensing the vehicle | 55.txt 二㈠; 344.txt 附件 | Supported, quote verbatim |
| "Taxi" for 營業小客車 | 55.txt driver statement 黑色賓士E200計程車 | Acceptable |
| First instance 有期徒刑肆月, 易科罰金 NT$1,000/日; High Court 拘役肆拾日, NT$1,000/日; 原判決關於刑之部分撤銷 | 344.txt 主文; 55.txt 主文 | Supported |
| No settlement in both judgments | 344.txt 尚未與告訴人和解; 55.txt 尚未與被害人和解 | Supported |
| Guilty statement at preparatory stage; simplified trial procedure; judgment adopts indictment except added confession | 344.txt 一, 二 | Supported |
| Evidence list: his police/prosecutor statements, victim's statements, 2 traffic violation notice copies, victim's dashcam footage with evidence photos, 本署勘驗筆錄; referral by 內政部警政署國道公路警察局 | 344.txt 附件 證據清單, 犯罪事實二 | Supported |
| Denied at police/prosecutor stage | 344.txt 附件 證據1 被告否認上開犯罪事實 | Supported |
| Screenshots in 偵卷 attached to 勘驗筆錄; 15:07:56 to about 15:08:08 (about 12 seconds); quote 被告與被害人車輛為了爭道而有互不禮讓及貼近車身等情形 | 55.txt 三㈠ | Supported, quote verbatim |
| Driver's police statement: about 15:07 left turn; black Mercedes taxi from shoulder at right rear, pressed alongside about 30 s; dropped behind, moved to his left, pressed left side 1–2 min; sped ahead to block after a large truck changed lanes; 3–5 overtakes | 55.txt 三㈠ 警詢供稱 | Supported; column attributes it to him throughout |
| 相符 and 尚屬有據 | 55.txt 三㈠ | Supported, verbatim |
| Absence claims: no camera source for screenshots, no braking log/data/expert report, no investigation of taxi driver, no fault apportionment, no civil claim, notice recipients/provisions not stated, no later appeal history | Both texts searched | Supported by absence |
| Indictment 2 Sept 2024 (民國113年9月2日), 113年度偵字第38619號; Art. 185(1) and 304(1); 想像競合 punished under heavier 185(1); 接續犯 one offence | 344.txt 附件; 55.txt 二㈡ | Supported |
| Art. 185(1): up to 5 years, detention or fine up to NT$15,000; 或以他法 | statutes.md 第185條 | Supported |
| Art. 304(1) coercion; right obstructed = safe driving | statutes.md 第304條; 55.txt 妨害被害人安全行車權利 | Supported |
| Appeal expressly limited to sentence; CCP 348(3); High Court adopts first-instance facts/evidence/offence | 55.txt 一; statutes.md 第348條第3項 | Supported |
| Appeal grounds: admission plus 雙方為了超車而有相互逼車的情形 | 55.txt 三㈠ | Supported, verbatim |
| General sentencing standard, Art. 57, proportionality/equality/罪刑相當 | 55.txt 三㈠; statutes.md 第57條 | Supported |
| Quote 被害人就本件行車糾紛之發生亦應負部分責任; 原審漏未審酌及此，容有未當; 誠屬不該，殊值非難 | 55.txt 三㈠, 三㈡ | Supported, verbatim |
| Motive / provocation / breach of duty correspond to Art. 57 items 1, 2, 8 | 55.txt 犯罪之動機、所受之刺激及違反義務程度; statutes.md 第57條 | Supported; wording tightened (minor edit 2) |
| Art. 33 ranges; Art. 41 conditions, rates, exception; both courts chose NT$1,000; 40 × 1,000 = 40,000 | law.moj.gov.tw 第33條; statutes.md 第41條; both 主文 | Supported; Art. 33 labelled background |
| Art. 43(1)(iii) wording match; item (iv); NT$6,000–36,000 and 當場禁止其駕駛; paragraph 4 吊扣牌照六個月; not applied by either court | statutes.md 第43條; judgments cite no 道交條例 | Supported; labelled background |
| 20-day appeal notice after service; no finality claimed | 55.txt closing notice | Supported |
| Court vs party: the detailed sequence is the driver's account; the court's own findings for sentencing are mutual lane contest, non-yielding, closing in | 55.txt 三㈠, 三㈡ | Correctly distinguished |

No invented fact, number, quote, motive, weather, injury, damages item or outcome found. Title "Four cut-ins and three brake checks" matches 強行切入…4次 and 緊急剎車3次 with the intent found (迫使他人讓道); "brake check" is the ordinary English term for deliberate braking in front of a following vehicle. Summary matches the body and does not overstate.

## 2. Citations

- Case numbers, courts and dates correct: 新北地院 113年度審訴字第716號 (2025-03-06; the 2025-03-11 line is the clerk's certification, correctly not used); 高等法院 114年度上訴字第5567號 (民國115年1月14日 = 2026-01-14).
- All judgment links point to the two supplied URLs; all statute links are correct single-article URLs.
- Sources section lists both judgments and all seven statutes, with background labels on Art. 33 and Art. 43.

## 3. Series hard rules

- No private-party names; location at district/road level only, no addresses. OK.
- No bold or markup workaround; no phone number; no sales CTA. OK.
- `author: "legal-ai-assistant"`; no lawyer-review or native-review claim; AI-disclosure line present with 3 October 2026. OK.
- Criminal / administrative / civil kept distinct: the two violation notices are reported without inferring their recipient; Art. 43 and Art. 33 are marked background; civil damages expressly stated as not addressed. OK.
- No foreign-law comparison. OK.
- Appeal status honest: 20-day notice, later history unknown; "a single judgment is not a rule" caveat present. OK.
- Rule 11 privacy: health, education, occupation and family circumstances in both judgments are rendered only as "personal circumstances". OK.
- One reader-engagement question ("should that lighten his sentence?"). OK.
- ALT_TBD / CAPTION_TBD / IMAGE_PATH placeholders ignored as instructed.

## 4. Voice (en)

- Title specific, not imperative, not formulaic.
- Sentence-deletion test, first two paragraphs: each sentence carries unique information (date/time/road/directions; junction and turns; the sign; the courts' acceptance of the sign violation and first cut-in; freeway cut-ins, braking and forcing to yield; automatic braking). Nothing deletable.
- Headings are story-bound, not checklist. No "delve", "navigate", "it is important to note", no intro-preview sentences. Active voice throughout.
- The citation density (full linked label after nearly every paragraph) is heavy for a reader but was required by the round-2/3 citation repair under hard rule 2; it does not block publication.

## Issues and edits

### Minor 1 (applied)

원문/Original → `…and drove alongside it, forcing the taxi to give way "任意以迫近、驟然變換車道方式" (by closing in and abruptly changing lanes).`

problem & reason → The Chinese quotation dangled after "give way" without a connector, reading as if the English sentence ran straight into the quote.

fix (applied) → `…forcing the taxi to give way, in the judgment's words, "任意以迫近、驟然變換車道方式" (by closing in and abruptly changing lanes).`

facts/conditions preserved → Quote verbatim, translation unchanged, attribution to the judgment made explicit; counts and conduct untouched.

### Minor 2 (applied)

원문/Original → `…the degree to which he breached his duties (items 1, 2 and 8 of Article 57), the sentencing court…`

problem & reason → The High Court names the factors (犯罪之動機、所受之刺激及違反義務程度) but does not number them; the bare parenthetical could read as if the court cited the item numbers.

fix (applied) → `(the factors listed in items 1, 2 and 8 of Article 57)`

facts/conditions preserved → The mapping to Art. 57 items 1, 2 and 8 is accurate against statutes.md; the sentence still states that the sentencing court had to weigh the taxi driver's conduct.

### Major issues

None.

## Minor edits applied (list)

1. Line 22: inserted "in the judgment's words," before the quoted phrase 任意以迫近、驟然變換車道方式.
2. Line 68: "(items 1, 2 and 8 of Article 57)" → "(the factors listed in items 1, 2 and 8 of Article 57)".

No other file was modified. Fact sheet left untouched (its claim that the High Court made no new findings of fact remains superseded, as noted in round 3, but the column itself is correct).
