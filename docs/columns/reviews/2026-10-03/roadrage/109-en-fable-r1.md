# C2 en — final review (Fable r1)

Review date: 2026-10-03
Reviewer: Claude Fable 5.1 (final gate). This is an AI review; it is not a lawyer review or a native-speaker review.
Target: drafts/C2/en.md (state after Astra r1's three minor edits; Astra's seven "required" items M1–M7 had not been actioned by the writer when this review started)

## Verdict

PASS — after the minor edits listed below, which I applied directly. No factual, citation or rule violation remains that requires the writer. Astra r1's seven findings were each re-examined against the primary sources; six were wording/placement problems that I resolved without changing any fact, number, citation or legal meaning, and one (M7, privacy of pay and family-care detail) I assessed as not a violation, for the reasons given under "Observations not changed".

## Scope checked

- Read in full: brief-SERIES.md, brief-EDITORIAL-VOICE.md, drafts/C2/en.md, cases/jud/194.txt (基隆地院 114訴502 civil, 2025-12-04), cases/jud/347.txt (基隆地院 114易159 criminal, 2025-04-09, with the appended indictment dated 2025-02-03), cases/jud/95.txt (高院 115上易1045 criminal, 2026-08-18), cases/statutes.md.
- drafts/C2/en.facts.md does not exist. I used drafts/C2/ko.facts.md only as a map and checked every claim directly against the judgment texts.
- Statutes not in statutes.md were fetched from law.moj.gov.tw on 2026-10-03: 刑事訴訟法 273-1, 刑法 38-2, 民事訴訟法 385, 勞動基準法 54. All four link targets open the right article and the column's paraphrase of each is accurate.
- Quotation check: every Chinese quotation in the column (單純行車糾紛; 我記得被告載我當天有發生行車糾紛，我因此還被基隆地院判了傷害7個月; 行車紀錄器影像檔案光碟1片、翻拍截圖8張、現場照片4張; 僅因行車糾紛率爾持球棒毆打告訴人; 迄今未與告訴人和解並賠償所受損害; 至多僅得恢復至80%; 術後需專人照護一個月; 僅因與原告發生單純行車糾紛，竟持球棒攻擊原告; 私鑑定; 不得上訴) was confirmed by grep as an exact substring of the judgment the column attributes it to.
- URL check: three judgment URLs and nine statute URLs match the specified targets character for character (grep extraction). Sources list contains all three judgments and all nine statutes used.
- Rule grep on the column: `**`, `__`, `<b>`, `<strong>`, private names (江·賴·廖), lane number 370巷, phone patterns, "lawyer", "native" — zero hits. `author: "legal-ai-assistant"` present. AI-disclosure line present as the final line with the 3 October 2026 check date.
- Arithmetic recomputed by hand: awarded 98,427 + 45,000 + 151,200 + 1,284,971 + 500,000 = 2,079,598; claimed 98,427 + 45,000 + 151,200 + 3,729,600 + 800,000 = 4,824,227; medical 83,415 + 12,932 + 2,080 = 98,427; lost pay 42,000 × 3 + 42,000 × 0.2 × 3 = 151,200; annual capacity value 42,000 × 12% × 12 = 60,480; 5% of 2,079,598 ≈ 103,980 ("a little over NT$100,000 for each year" is correct); 2,079,598 ÷ 4,824,227 ≈ 43%, consistent with the costs split.
- Consistency with sibling languages: ko (passed, Fable r1), ja and zh-hant all keep the family-care fact and the pay arithmetic; en already goes one step further by omitting the NT$42,000 monthly figure.

## Fact check — all passed

| Claim in column | Source and result |
|---|---|
| About 6 p.m., 7 Nov 2024, Keelung Anle District; traffic dispute → argument → bat attack; right ulna and right patella fractures | 347 indictment 犯罪事實一 (113年11月7日18時許, 基隆市安樂區…, 因行車糾紛而發生口角爭執…持球棒攻擊…右側尺骨骨折、右側髕骨骨折); 194 貳一. District level only; lane number omitted. |
| Judgments silent on the driving, traffic fault, victim's mode of travel | Absence confirmed across 194/347/95: only 行車糾紛, no manoeuvre, cause or victim vehicle. |
| Friend drove, attacker was passenger; 115上易1045 is a theft case; conviction overturned, acquittal, 不得上訴, 18 Aug 2026; testimony given at the friend's first-instance trial | 95: 上訴人因竊盜案件; 主文 原判決撤銷。○○○無罪; 理由四㈡⒉ 於113年11月7日18時許被告搭載證人○○○，因行車糾紛，證人○○○因此攻擊訴外人…有上開警詢筆錄在卷可參; 證人…於原審審理時證稱; 不得上訴; date 115年8月18日. |
| Indicted 3 Feb 2025; evidence list items; dashcam owner not stated | 347 appendix: date 114年2月3日 (not the 2月17日 clerk date); items 1–5 match; no owner stated. |
| Simplified procedure, Art. 273-1; indictment adopted, confession added; no 勘驗/timestamps | 347 壹 and 貳一; absence of 勘驗 confirmed. 273-1(1) text fetched: 死刑、無期徒刑、最輕本刑三年以上…或高等法院管轄第一審案件 excluded; column's paraphrase accurate. |
| Art. 277(1), 5 years / detention / NT$500,000; seven months; sentencing reasons; no settlement | 347 主文, 貳二㈡; statute text in statutes.md. Personal circumstances kept generic (rule 11). |
| Bat not seized, said discarded, no confiscation under Art. 38-2(2) | 347 貳二㈢; 38-2(2) fetched: 得不宣告或酌減之. |
| No 易科罰金 rate, no 緩刑 | 347 主文 contains only the sentence. |
| Art. 41(1) as background: conversion only for six months or less | statutes.md 41(1): 受六月以下有期徒刑或拘役之宣告者…得…易科罰金. Column labels it as not discussed by the court. |
| Appeal dismissed by 高院 114上易1128, sentence final, text not in sources | 194 貳三㈠. Column states it is reported secondhand. |
| 附帶民事訴訟 (114附民240) transferred; defendant notified, absent, filed nothing; 一造辯論 on plaintiff's application, Art. 385; criminal file obtained ex officio | 194 opening recital, 壹, 貳二, 貳三㈠; 385(1) fetched. |
| Victim's allegations (brace, one month care, three months off, four-day weeks ~20%, "至多僅得恢復至80%") | 194 貳一, attributed to the plaintiff. |
| Table of claimed/awarded items | 194 貳一 and 貳三⒍; sums verified. |
| Medical sub-amounts, emergency surgery, follow-ups, receipts, "necessary and reasonable" | 194 貳三⒈. |
| Family care; 94台上1543 principle; 術後需專人照護一個月; full-day need, half-day rate; 3,000/1,500; 30 × 1,500 | 194 貳三⒉. |
| Lost pay: labour insurance certificate and tax records checked ex officio; 126,000 + 25,200 | 194 貳三⒊. |
| Capacity: NTUH certificate; 19 Sep 2025 specialist assessment ~12%; 私鑑定 / 113台上528; no interest in either party; 60,480/yr; 7 Feb 2025 to age 65 (151年1月9日 = 9 Jan 2062); Hoffmann, 5% simple, first period not discounted; 1,284,971; no basis for 3,729,600 shown | 194 貳三⒋. Art. 54(1)(1) fetched: 年滿六十五歲者. |
| Solatium factors, victim 26, 500,000 of 800,000 | 194 貳三⒌. |
| Order: 2,079,598; 5% from 29 Mar 2025 (day after service); costs 43%/rest; security 693,000 / 2,079,598 | 194 主文 and 貳四. |
| Civil appeal within 20 days of service; no information on civil appeal, finality or payment; no traffic-penalty measures in any judgment | 194 closing notice; absences confirmed (no 道路交通管理處罰條例/罰鍰/吊扣/吊銷 in 194/347/95). |
| Criminal judgment ordered no payment; civil judgment does not reduce damages for the prison term | 347 主文; 194 reasoning reduces only on evidence (12%) and solatium discretion. |

## Issues and fixes

Format: 원문/Original → problem & reason → fix (applied or required) → facts/conditions preserved.

1. Original (summary): "awarded NT$2,079,598 plus 5% annual interest of the NT$4,824,227 sought." → Reads as if interest runs on the full claim; 194 主文 awards interest on 2,079,598 only. → Applied: "On the victim's civil claim for NT$4,824,227, the Keelung District Court awarded NT$2,079,598 plus 5% annual interest on that sum." → Claim, award, rate preserved; start date is given in the body.

2. Original (heading): "Footage on file, but no inspection in court" → Asserts an inspection never happened; 347 only records none. Body already says "records no inspection". → Applied: "Footage on file, but no inspection recorded". → Evidence list, absence of 勘驗/timestamps unchanged.

3. Original: "It records no inspection (勘驗) of the footage, no timestamps and no description of what the video shows." → No judgment link anywhere in the indictment/procedure paragraphs (rule 2 placement). → Applied: appended the 114易159 citation link. → No text change.

4. Original: "Article 41(1) of the Criminal Code provides that conversion for sentences of six months or less." → Ungrammatical (no main verb) and states the six-month limit as the whole rule. → Applied: "allows such conversion only where the sentence imposed is six months or less, subject to further conditions; a seven-month sentence is outside that ceiling." → Background label kept; six-month threshold kept; the inference that seven months exceeds six is arithmetic on the statute text, not a claim about this court's reasoning.

5. Original: "...the Taiwan High Court dismissed the appeal (114年度上易字第1128號) and the seven-month sentence became final." → The claim rests on the civil judgment but had no adjacent link. → Applied: appended the 114訴502 citation link; the sentence "That appeal judgment itself is not among this column's sources" retained. → No change to what is asserted.

6. Original (heading): "Paid in full: treatment, care and lost pay" → "Paid" asserts payment; nothing in the sources shows payment, and the column itself says payment status is unknown. The body says "allowed", so the heading misstated the body. → Applied: "Awarded in full: treatment, care and lost pay". → Three fully allowed items unchanged.

7. Original: "Because the sum is paid now rather than year by year, it deducted interim interest..." → Same payment implication. → Applied: "Because the award is a single lump sum now rather than a payment each year, it deducted interim interest..." Also appended the 114訴502 link at the end of that paragraph. → Hoffmann method, 5% simple, first period not discounted, 1,284,971 unchanged.

8. Original: "The court's solatium reasoning separately described the victim as 26 at the time of the incident; that age is not presented here as an input to the capacity-loss formula." → Awkward "presented here". → Applied: "...separately describes the victim as 26...; that age is not used here as an input to the capacity-loss formula." → Meaning unchanged. (The judgment's 26 vs. the birth date implied by 151年1月9日 is an internal inconsistency in 194 itself; the column reports the court's statement and does not reconcile it, which matches rule 1. Same decision as in the ko review.)

9. Original: "the judgment shows where the money came from." → Suggests money changed hands. → Applied: "the judgment shows how the award was built." → No fact change.

10. Original: "reached judgment even though the attacker never came to court." → Overbroad: 347 records the attacker's in-court confession in the criminal case; 194 establishes only non-attendance at the civil hearing and no written submission. → Applied: "even though the attacker neither attended the civil hearing nor filed a defence." → Attached-action and one-sided-hearing facts preserved.

11. Original (Sources): no mention of the two Supreme Court judgments and the 1128 appeal cited via the civil judgment. → Reader could assume they were reviewed. → Applied: added one sentence after the judgments list stating that 114上易1128, 94台上1543 and 113台上528 are mentioned only as the civil judgment reports them and were not reviewed. → No new sources claimed.

Astra r1 mapping: M1 → item 1; M2 → item 2; M3 → items 6, 7, 9; M4 → item 4; M5 → item 10; M6 → items 3, 5, 7, 11; M7 → see below (not changed).

## Observations not changed

- Astra M7 (victim's pay and family-care detail vs. rule 11). Rule 11 targets parties' personal circumstances listed as sentencing factors (health, family situation, income, education, occupation). Here the monthly pay is the court's accepted input to two heads of damages, and the family-care fact is the legal reason the care item was compensated at all (94台上1543). Both are outcome-determinative in the sense rule 11 allows for injuries. The en column already omits the NT$42,000 figure itself; the passed ko column and the ja/zh-hant columns state it. Removing the sub-amounts here would make the English column less informative than its siblings and would hide how the court reached the figures. Not a violation; left as is. If the editor wants a stricter series-wide standard, it should be applied to all four languages together.
- The attacker's own 智識程度、職業、家庭狀況 are already generalised to "personal circumstances", satisfying rule 11.
- Age 26 of the victim is not in the rule 11 list and is central to the solatium reasoning; kept.
- Em-dashes in body text ("The largest item — loss of working capacity —") are ordinary English punctuation; not a rule issue.
- Placeholders IMAGE_PATH / ALT_TBD / CAPTION_TBD ignored as instructed.

## Voice check (en)

- Title: names the city, the escalation, the weapon and the rounded award; noun phrase, not imperative or clickbait. "an NT$2.08 million" article agreement already fixed by Astra.
- Sentence-deletion test, paragraph 1: sentence 1 (time, date, district, dispute → argument) loses the setting; sentence 2 (bat attack) loses the act; sentence 3 (injuries + citation) loses the outcome and source. All kept.
- Paragraph 2: sentence 1 (what the judgments do not say) loses the evidentiary limit; sentence 2 (單純行車糾紛 + civil citation) loses the court's characterisation reused later; sentence 3 (seven months; 2,079,598 of 4,824,227) loses both outcomes. All kept.
- Subheads are story-specific noun phrases; no checklist or "3 things" patterns. One reader-engagement question ("If you were the judge, would you have awarded all of it?") used once before the table.
- Prose is plain and active; "solatium" is glossed on first use; criminal, civil and administrative outcomes are kept distinct in their own section ("Two courts, two questions") and in the limits section. No foreign-law comparison. No contact pitch.

## Minor edits applied (summary list)

1. Summary sentence on award and interest reworded (item 1).
2. Heading "no inspection in court" → "no inspection recorded" (item 2).
3. Criminal-judgment link added after the simplified-procedure paragraph (item 3).
4. Article 41 sentence made grammatical and qualified (item 4).
5. Civil-judgment link added after the appeal-dismissal sentence (item 5).
6. Heading "Paid in full" → "Awarded in full" (item 6).
7. "sum is paid now" → "award is a single lump sum now"; civil-judgment link added at paragraph end (item 7).
8. "not presented here" → "not used here"; "described" → "describes" (item 8).
9. "where the money came from" → "how the award was built" (item 9).
10. "never came to court" → "neither attended the civil hearing nor filed a defence" (item 10).
11. Sources note on 114上易1128, 94台上1543, 113台上528 added (item 11).

No number, date, case number, URL, Chinese quotation, statute reference or legal conclusion was altered.

VERDICT: PASS
