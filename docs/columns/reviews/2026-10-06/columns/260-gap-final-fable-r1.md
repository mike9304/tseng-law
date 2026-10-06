# G3 final review r1 — Claude Fable 5.1

Slug: foreigners-buying-property-in-taiwan · files: drafts/G3/{ko,ja,en,zh-hant}.md · image: images/G3.webp
Reviewed 2026-10-06 KST. I did not write or edit this column before this review.

## Verdict

PASS. All four languages are publishable as they stand after one minor Korean wording edit (listed below). Image OK. No major issue found.

## Scope checked

Read in full: brief-BATCH.md, brief-EDITORIAL-VOICE.md, COLUMN-VOICE-RULE.md, THREADS-VIRAL-BRIEF-20261005.md, SENTENCE-VARIETY-RULE.md, LESSONS.md, topics/G3.md, the four column files, drafts/G3/facts.md, research/G3-statutes.md, reviews/G3/check-grok.md, reviews/G3/fix1-notes.md, images/G3.webp and G3.txt. research/judgments/ is empty and the column cites no judgment.

Sources re-opened by me today (not taken from facts.md):
- Every URL in the four files was fetched with curl; all 24 returned HTTP 200.
- law.moj.gov.tw single-article pages, text compared word by word with each sentence that cites them: 土地法 17, 18, 19, 20; 平均地權條例 47-4, 79-1; 預售屋及新建成屋買賣契約讓與或轉售審核辦法 2; 私法人買受供住宅使用之房屋許可辦法 2; 外國人投資條例 17; 民法 758; 契稅條例 2, 3, 4, 13; 所得稅法 4-4, 7, 14-4; 土地稅法 5, 28. Every link points to the article the sentence states.
- 平均地權條例 沿革 (LawHistory pcode=D0060009): entry 25 read in full. No entry later than 2023 exists on the page.
- The reciprocity table PDF (header 110.5, 7 pages): text extracted and all three tables read; US rows counted by hand.
- Taipei City Department of Land Administration page (資料更新 115-06-08; still links the same PDF), Tainan City land bureau page (point 1 of the directions, certificate exemption), Ministry of the Interior English FAQ s=124867.
- Internal links: 024, 026 exist in ko/ja/en/zh-hant; 047 exists in ja/en/zh-hant only and ko does not link it. The en description of 047 ("both calculations and the filing deadline") matches that column (art. 14-4 calculation, land value increment, art. 14-5 30-day filing). G3's figures agree with 047.

Checks run:
- lint.py: ko OK (1,393 after my edit), ja OK (1,394), en OK (796 words), zh-hant OK (1,392).
- variety_metrics.py check: no FAIL and no WARN in any language (ko cv 0.56 / short 0.167 / contrast 0; ja cv 0.54 / short 0.219 / contrast 2; en cv 0.59 / short 0.231 / contrast 0; zh-hant cv 0.67 / short 0.20 / contrast 0).
- Pattern scan of the four final files: no `**`, `__`, `<b>`, `<strong>`, no emoji or pictographs, no phone number, no LINE/Kakao, no 2024, no lawyer/native review claim, no first-person firm voice, no simplified characters in zh-hant. Firm name once and email once per file, in the contact paragraph only.

Verification limits:
- www.land.moi.gov.tw and glrs.moi.gov.tw timed out or refused the connection from this machine and from the web fetcher, as they did for the editor. "No edition later than 110.5" therefore rests on the Taipei page (updated June 2026, still linking this file) and on two web searches that returned no later edition; the latest amending order found is 內政部 110年5月13日 台內地字第1100262594號. The columns do not claim the table is the newest edition; they name the edition and where it is posted, which is what the sources support.
- Point 1 of 外國人在我國取得土地權利作業要點 (en only) was read on the Tainan City page (updated 110-10-28) and matched against the Ministry's English FAQ on moi.gov.tw, not on the Ministry's own regulation database.
- Japanese, Korean and Chinese naturalness is a model's reading, not a native speaker's review.

## MUST VERIFY

MUST VERIFY 1: CONFIRMED — https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=D0060009 (article: https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0060009&flno=47-4) — the page reads 「中華民國一百十二年二月八日…增訂第 47-4、47-5、79-1、81-3、81-4 條條文」 and 「中華民國一百十二年六月九日行政院院臺建字第 1121025278 號令發布第 4、47-3、47-4、79-1、81-2、第 81-3 條第 1 項、81-4 條條文定自一百十二年七月一日施行」. The text must say the restriction took effect on July 1, 2023. All four versions say exactly that, with the 沿革 page linked inline beside the date (ko body, heading and summary; ja body and summary; en body and heading; zh-hant body, heading and summary).

MUST VERIFY 2: CONFIRMED — same source — the public text must state the effective date only and must not rebut 2024. The string "2024" does not occur in any of the four final files (it survives only in drafts/G3/orig/). No sentence about contracts signed in 2024 or before the effective date remains.

MUST VERIFY 3: CONFIRMED — https://www-ws.gov.taipei/001/Upload/305/relfile/11556/338160/1b6177f4-4f81-4885-8796-5f8a49842c05.pdf (linked from https://land.gov.taipei/News_Content.aspx?n=884BD5BC983BEF3F&s=A602CF7D75EEF27A&sms=2258135BEACBDF52, 資料更新 115-06-08) — 表一 完全平等互惠: 編號 1 韓國, 編號 2 日本; 編號 25-01 to 25-42 are 41 US states plus 華盛頓特區 (25-20). 表二 附條件: 南卡羅萊納 (500,000-acre cap); 明尼蘇達, 愛荷華, 馬里蘭, 西維吉尼亞, 北達科他, 南達科他 (land other than agricultural land); 密西西比 (public-land, residency and 230-acre industrial limits) = 8 states. 表三 非平等互惠: 編號 6 奧克拉荷馬州. 41 + 8 + 1 = 50. The text must say Korea and Japan are fully reciprocal, give the US by state in three groups with Oklahoma non-reciprocal, and date the table May 2021. All four versions do so in body, FAQ and summary; none says "US citizens can buy". Limit: the Ministry's own site could not be opened to rule out a later edition (see above); the columns date the edition and name where it is posted.

## Issues

No major issue. Items below are the points I tested hardest and one minor edit.

1. ko contact paragraph (minor, applied)
   Original: 「국적과 물건 소재지를 적은 비밀이 아닌 개요는 호정(昊鼎)국제법률사무소(wei@hoveringlaw.com.tw)로 보내 주셔도 됩니다.」
   → Problem and reason: 「적은 비밀이 아닌」 reads at first as "a small secret"; the modifier chain is hard to parse.
   → Fix applied: 「국적과 물건 소재지를 적되 비밀 정보는 뺀 개요를 호정(昊鼎)국제법률사무소(wei@hoveringlaw.com.tw)로 보내 주셔도 됩니다.」
   → Facts preserved: firm name, email, non-confidential outline, nationality and location. No legal content touched. lint OK (1,393), variety OK.

2. All four: 「주거용 여부는 등기부등본 등에 … '住'나 '住宅'으로 적혔는지로 정합니다」 / "Whether a building is residential turns on the use recorded …" (no change required)
   → Tested against 許可辦法 第2條: paragraph 2 defines 供住宅使用 by the recorded use exactly as stated (transcript for a completed house, occupancy permit for a newly completed one, building permit for a presale). Paragraph 3 lists completed houses outside the regulation (mixed-use entries, blank entries, documentary proof of non-residential use). The columns do not say every 住/住宅 entry needs a permit: "원칙적으로 / 原則として / unless an announced exemption applies / 原則上" is kept, and the desk sentence claims only that the entry does not change. Supported; the paragraph 3 exclusions are a permissible omission in the short format.

3. All four: 「사무실 매입도 여기서 출발합니다」 / "An office bought in the Taiwan company's own name starts from that rule" (no change required)
   → Editorial inference from 外國人投資條例 第17條, flagged as such in facts.md K9. It claims no more than a starting point, keeps "invested under the statute" and 「除法律另有規定外」, and cites only art. 17. Company Act art. 1 and art. 8 of the investment statute are gone. Acceptable.

4. en: "Listed buyers need no certificate" (no change required)
   → Tainan page: 「已列入…互惠國家一覽表之國家者，得免附」; Ministry FAQ: "has included in the table of reciprocal countries, therefore not necessary". Supported. "Listed buyers" is shorthand for buyers from a listed jurisdiction and follows the heading "U.S. buyers are listed by state".

5. en opening sentence carries three figures (forty-one, items 1 and 2) against the two-number guideline in SENTENCE-VARIETY-RULE 2-8. Not one of the section 5 self-check items, the checker passes, and each figure is a fact from the table. Left as is.

6. ja 「…中央の主管機関の許可（有効期間1年）を受けます」 (no change required)
   → 「買うには…許可を受けます」 states the requirement as the condition for buying; the legal force of 應…經許可 is kept by 「買うには」 and 「原則として」. ja sits at 1,394 of 1,400 characters, so I did not lengthen it.

Law and facts, per language: every statement in ko, ja, en and zh-hant matched the official text opened today — reciprocity rule (art. 18), the seven land categories and three prohibited acts with the inheritance carve-out (art. 17), purposes, uses and local limits (art. 19), local approval (art. 20), art. 47-4's ban, advertisement bar, two exceptions and the one-unit-per-two-years cap on the approval route, the 新建成屋 definition, art. 79-1's central permit, one-year validity and five-year bar with its exceptions, Civil Code art. 758, deed tax 6% of the committee's standard price paid by the buyer with the land exemption, the art. 7 residence tests (domicile plus habitual residence, or 183 days in the tax year), the 2016-01-01 acquisition date, 45% within two years and 35% beyond for an individual nonresident, the base (transaction income less the total land value increase), and land value increment tax charged to the original owner. The four versions do not contradict each other; ja omits the land value increment tax sentence and does not list the Land Tax Act, which is consistent.

Citations: inline single-article links follow each claim; sources sections list every source used in that language with the check date; no judgment cited.

Rules: no private-party names, cases, statistics, quotes, first-person stories or hypotheticals; no bold, emoji, phone or street address; one email-only contact paragraph; author legal-ai-assistant; no review claim; no Korean, Japanese or US domestic law stated beyond the directions' own "如美國" example; frontmatter per brief (en title 70 characters so seoTitle is required: 40 characters, differs from title; en summary 157 characters; ko/ja/zh-hant seoTitle 26/22/21 characters; two FAQ items each, consistent with the body); time-sensitive figures dated October 2026; final general-information line with the check date.

Voice: ko 합니다체 throughout, opens on the table entry; ja です・ます throughout with one 体言止め, opens on the reader's question; en plain and active, opens on the state count; zh-hant Taiwan usage (地政事務所, 謄本, 公寓大廈), opens on a question and its answer. Titles name the issues and are not imperative or checklist titles. Opening types differ from G1, G2 and G4 in each language.

## Sentence variety

Checker: no FAIL in any language. Section 5 self-check, items 2–7: all met in all four (no stock hypothetical opener; at least five very short sentences each; no word opens three paragraphs; the exceptions paragraph and the contact paragraph carry no citation and no three claim-statute-caveat paragraphs run in a row; contrast templates ko 0, ja 2, en 0, zh-hant 0, none rebutting a claim the reader did not make; the last paragraph is tied to this column's facts). No MONOTONY finding.

## Minor edits applied

- ko.md, contact paragraph: 「적은 비밀이 아닌 개요는」 → 「적되 비밀 정보는 뺀 개요를」 (issue 1). Nothing else was edited; ja.md, en.md, zh-hant.md, facts.md and the research file are untouched.

## Image

OK. A pale wooden door standing ajar in an empty plaster entry with a terrazzo floor and a clay bowl of leaves on a stone ledge. It fits a column about buying a home, is generic and fictional, and shows no faces, people, text, logos, flags, documents or screens. It does not depict or recreate any identifiable case.

VERDICT: PASS
