# Final review r2 — ko-016 taiwan-inheritance-custody-analysis (Claude Fable 5.1, 2026-10-06)

## Verdict

PASS — publishable as the live replacement.

The one blocking issue of r1 (read_time) is fixed in draft.md and in the regenerated tests.patch. I compared the whole body with the original again, claim by claim, without relying on the r1 table: no legal point is lost, shifted, overstated or added. The variety tool has no FAIL and fewer than two section-5 items are unmet. I made no edit in this round.

## Scope checked

- Read in full: orig.md, draft.md, guard.txt, notes.md (including "fix round review-1"), tests.patch, tests.txt, review-r1.md, p-write.txt, log, claude-tests1.log, SENTENCE-VARIETY-RULE.md (all sections), rules/COLUMN-VOICE-RULE.md, LESSONS.md, ORIGINAL-ISSUES.md.
- Repo, read only: `~/Projects/tseng-law-rewrite-1006-w1/src/lib/__tests__/columns-ko-family-016.test.ts` (the pre-patch test, to read `extractPublicText`, `firstParagraphAfter`, the read-time block and the forbidden-literal list).
- Commands run in this round:
  - `variety_metrics.py check draft.md --lang ko` → `sentences=162 mean=38.8 cv=0.462 short=0.148 run3=0.056 opener_rep=0.065 cite_end=0.019 cite_para=0.304 contrast=1 caveat=2 q=2`; 0 FAIL, 1 WARN (96% of sentences end in 니다. — 합니다체; 98% in the original).
  - `guard.py orig.md draft.md ko taiwan-inheritance-custody-analysis --today 2026-10-06` → `GUARD: PASS` (length 7072 → 6941, 98%; three pre-existing lint notes tolerated). Same as guard.txt.
  - Diff of lines 1–24, of all headings, and of everything from "## 10. 공식 자료" to the end.
  - Counts of article references, URLs, numbers and qualifiers in both files.
  - Eojeol count with the test's `extractPublicText` steps reimplemented in Python: orig 2227 → 13 (12.37), draft 2132 → 12 (11.84).
  - A script that looks up every string literal added by tests.patch in draft.md and every removed literal in orig.md.
  - My own counts of paragraph openers, short and long sentences, endings and contrast sentences.
- Limits: I did not run vitest myself. vitest-1.log (17:08–17:09, after the last change to draft.md at 17:06) shows 78 files / 1024 tests passed, including `columns-ko-family-016.test.ts` (15 tests) and `column-016-public-reference-sync.test.ts`. No statute or source page was opened; articles were compared original ↔ rewrite only. The reading of Korean naturalness is a model's reading, not a native speaker's or a lawyer's review.

## Front matter

Lines 1–24 differ in two lines only: `lastmod: "2026-07-25"` → `"2026-10-06"` and `read_time: "13분 분량"` → `"12분 분량"`. title, url, date_display, categories, featured_image, the four FAQ questions and answers, the H1 and the image line are byte-identical. read_time 12 equals ceil(2132 / 180), the formula the repo test applies.

## Fact comparison (original → rewrite)

Mechanical counts first: 13 distinct article references with the same frequencies in both bodies (제1138조 ×3, 제1144조 ×2, 제1030조의1 ×2, 제1088조 ×2, 제1148조, 제1174조, 제1089조, 제1091조, 제1093조, 제1094조, 제1094조의1, 제1087조, 제1086조); 9 link targets identical and in the same order; every number identical (3분의 1, 3개월 ×2, 6개월, 2026년 6월 25일). Qualifiers: 원칙적으로 2 → 2, 통상 3 → 3 (FAQ included), 일반적 6 → 5 (the one dropped is in the cut preview sentence "일반적인 확인 순서").

Intro

| Original point | In the rewrite | Result |
|---|---|---|
| A death starts more than one procedure | P1 s1 | preserved |
| Six questions (heirs; assets and debts; spouse's separate matrimonial-property right; who exercises parental rights and duties; need for guardianship; protection of the child's property) | P1 s2–s3, all six | preserved |
| They affect each other; legal basis and order of analysis differ | P1 s4 | preserved |
| Keep apart: share / residual-property claim, parental rights / guardianship, legal representation / ownership | P2 s1–s2 ("세 쌍" counts the three listed pairs) | preserved |
| Carrying a conclusion over misleads on right-holder, calculation base, court procedure (수 있습니다) | P2 s3 ("위험이 있습니다") | preserved, hedge kept |
| Preview: "다음 내용은 대만 민법과 공식 절차 자료를 바탕으로 일반적인 확인 순서를 정리한 것입니다" | cut; "대만 민법과 공식 절차 자료를 바탕으로" now in the closing notice | no legal point lost |

1. 법정상속인과 상속분

| Original point | In the rewrite | Result |
|---|---|---|
| 제1138조·제1144조: spouse co-inherits with the applicable rank; lineal descendants are first rank | P1 s1 (clauses swapped) | preserved |
| Illustration: no valid will AND only spouse + two children AND no 상속포기·상속결격·대습상속 or other deciding fact → 통상 3분의 1 each | P1 s2 | preserved, every condition and 통상 |
| Label: assumption for explanation, not a conclusion on a case | P1 s3–s4 | preserved |
| 제1138조 order other than the spouse: 직계비속, 부모, 형제자매, 조부모 | P2 s1, article in end parentheses | preserved |
| Later rank does not inherit ahead, 원칙적으로 | P2 s2 | preserved |
| Within a rank: time of death, parentage, adoption, representation; get family records first | P2 s3–s4 | preserved |
| Spouse is not a later-rank heir of 제1138조; co-inherits under 제1144조 with the rank that applies | P3 s1–s3 | preserved, each article on its claim |
| Ratio depends on the co-inheriting rank (수 있습니다); disqualification, valid renunciation, representation affect the result | P3 s4 | preserved |
| No immediate sole ownership; scope, debts and costs, agreement or court procedure (수 있습니다); abstract share vs final attribution | P4 | preserved |

2. 유언과 상속재산의 확정

| Original point | In the rewrite | Result |
|---|---|---|
| Valid will can set another distribution; check form, capacity, interpretation, enforceability; 유류분 and other mandatory limits | P1 s1 | preserved |
| A will alone does not fix every asset; partial will → intestate rules for the rest (수 있습니다) | P1 s2–s3 ("여지가 있습니다") | preserved |
| Fix the list and legal nature of the estate before computing shares | P2 s1–s2 | preserved |
| Six asset kinds + debts, guarantees, unpaid tax, funeral costs | P2 s3 | preserved, all items |
| Not by registered or account name alone: beneficial ownership, co-ownership shares, third-party rights, security | P2 s4 | preserved |
| Insurance / retirement benefits with a named beneficiary may be treated differently | P3 s1 ("처리되기도 합니다") | preserved |
| Trust: structure and beneficial rights; lifetime gifts or transfers → 반환, 산입 또는 유류분 (수 있습니다) | P3 s2–s3 | preserved |
| Foreign accounts or real estate: law of the situs and Taiwan's choice-of-law rules | P3 s4 | preserved |
| Search covers debts and procedural risk; seven document types by reference date; incomplete data → gap from divisible net estate (수 있습니다) | P4 ("우려가 있습니다") | preserved |

3. 배우자의 잔여재산 분배청구권

| Original point | In the rewrite | Result |
|---|---|---|
| "아닙니다." without a question in the body | question in the FAQ question's words + "아닙니다." | preserved; no new claim |
| 제1030조의1: separate right when statutory requirements are met; calculated apart from the share | P1 s3 | preserved |
| Not all property acquired during marriage counts; no automatic half | P1 s4 | preserved |
| Check regime, cause and time of acquisition, debts, statutory exclusions; decide individually | P3 (포함·제외 범위, 제외항목, 채무, 재산제 약정, 취득 시기와 원인, "개별적으로 판단합니다") | preserved, moved |
| Compares each spouse's post-marriage increase when the statutory regime ends | P2 s1 | preserved |
| Differs from the share in basis, counterparty, calculation base | P2 s2 | preserved |
| If the claim stands, the order "reflect it first, then fix the remainder as the estate" may be at issue | P2 s3–s4 | preserved; "문제될 수 있습니다" is in s3, s4 names the order |
| Exclusions (inherited or gifted property, 위자료 등; 있을 수 있고); debts during marriage; other agreed regime; time and cause; valuation date | P3 | preserved; "때문입니다" only links two original sentences |
| 제1030조의1: court may adjust where equal division is 현저히 불공평 | P4 s1 | preserved as published (Original issues 1) |
| Five factor groups "법이 요구하는 요소" | P4 s2 | preserved |
| Names or length of marriage alone cannot settle existence or amount | P4 s3 | preserved |

4. 상속채무와 상속포기

| Original point | In the rewrite | Result |
|---|---|---|
| 제1148조: universal succession from the opening of succession; strictly personal rights and duties excluded | P1 s1–s2 | preserved |
| Liability 원칙적으로 limited to the value of inherited property | P1 s3, word for word | preserved |
| 다만: inventory, notice to and payment of creditors, preservation, exceptions | P1 s4 | preserved |
| 제1174조: 3개월 from knowing of the right, in writing, to the competent court (해야 합니다) | P2 s2, article in end parentheses | preserved: period, starting point, form, addressee, duty |
| Family statements or non-use are not a renunciation | P2 s3 | preserved |
| Effect on next-rank heirs and representation | P2 s4 | preserved |
| Before disposal or payment investigate assets and liabilities; five checks; inventory and creditor procedures where needed | P3 s1–s3 | preserved |
| Avoid concealment or omission that can affect limited liability (피해야 합니다) | P3 s4 | preserved |
| Tax portal guidance updated 2026년 6월 25일; general 3개월 (inventory and renunciation court procedures); general 6개월 (estate tax return) | P4 s1–s3 ("이 안내에 따르면 … 일반적인 기간은 3개월입니다. 상속세 신고는 일반적으로 6개월입니다.") | preserved: date, attribution, both periods, both "general" |
| Starting point, extension, exceptions, jurisdiction per case; not an individual's deadline (안 됩니다) | P4 s4–s5 | preserved |
| Agencies and documents can differ; court renunciation and tax return are not one procedure; deadlines can run together; separate calendar per procedure (편이 안전합니다) | P5 | preserved |

5. 생존 부모의 친권상 권리와 의무

| Original point | In the rewrite | Result |
|---|---|---|
| 제1089조: when one parent cannot exercise, the other does (원칙) | P1 s1, article as subject ("대만" omitted; the sentence sits under a Taiwan-law section) | preserved |
| Survivor who keeps parental rights, absent a contrary court decision, 통상 continues | P1 s2, word for word | preserved |
| 다만: existing judgments, restriction or suspension, foreign element, best interests → court involvement may be needed | P1 s3–s4 ("필요할 때도 있습니다 … 사정에 달려 있습니다") | preserved |
| Content of parental rights (4 items, 수 있습니다); for the child, not the parent (해야 합니다) | P2 s1–s3 | preserved |
| Daily care vs major disposal: review may differ | P2 s4 | preserved |
| Check divorce or custody judgments, restriction or suspension; foreign decisions: recognition and effect in Taiwan, procedures abroad | P3 s1–s3 | preserved |
| Conflict transactions: is ordinary legal representation enough | P3 s4 | preserved |
| Parental rights and succession are separate; the child owns the inherited property; not the parent's share | P4 s1–s3 | preserved |
| Parental status can exist without heirship; a parent who is an heir checks conflict more carefully | P4 s4 | preserved |

6. 후견인 지정과 법원의 관여

| Original point | In the rewrite | Result |
|---|---|---|
| 제1091조: no parents OR both unable to exercise | P1 s1 | preserved, OR kept |
| One parent's death alone does not start guardianship; first the survivor's status, existing judgments, actual ability | P1 s2–s4 | preserved |
| 제1093조: the parent last exercising parental rights may appoint by will | P2 s1 | preserved |
| Needs statutory form AND authority to appoint | P2 s2–s3 | preserved, AND kept |
| Even then: commencement, qualification and acceptance, report to the court, other supervision | P2 s4 | preserved |
| No valid appointment OR appointee unable → 제1094조 order and 제1094조의1 court selection (문제될 수 있습니다) | P3 s1 | preserved, hedge kept |
| Court reviews the child's best interests on four fact groups | P3 s2–s3 | preserved |
| Relatives and statutory applicants may apply on statutory grounds; family ties alone make no one guardian | P4 s1 | preserved |
| Guardian ≠ parent with parental rights; separate duties possible (수 있습니다) | P4 s2–s3 ("지는 경우가 있습니다") | preserved |
| Split care and property roles; three candidate situations; court can decide supervision and measures | P5 | preserved |

7. 미성년자의 상속재산 보호

| Original point | In the rewrite | Result |
|---|---|---|
| "그렇지 않습니다." + "제한 없이 일방적으로 사용할 수 있다고 보아서는 안 됩니다" | P1 question ("제한 없이, 일방적으로 써도 될까요?") + "그렇지 않습니다."; ban restated in P2 | preserved |
| 제1087조·제1088조: inherited property is the child's 특유재산 = property belonging to the minor | P1 s3–s4 | preserved |
| Managing parent or guardian is not the beneficial owner (twice in the original) | P1 s5, once | repetition cut |
| Mark as the child's and manage separately; not for the manager's living costs or debts (안 됩니다) | P2 s1–s2 | preserved |
| 관리·사용·수익·법정대리·처분 for the child's interest (이루어져야 하고); 제1088조 powers bound to that purpose | P2 s3 | preserved |
| Record asset type, need, adequacy of price, custody and planned use of proceeds | P3 s1 | preserved |
| Sale, security, business investment: other permits or court procedures | P3 s2 | preserved |
| Conflict or major disposal → special representative or court involvement (문제될 수 있습니다) | P4 s1 ("문제되기도 합니다") | preserved, moved |
| Co-heirs or counterparties → conflict possible; 제1086조; who represents the child in partition or litigation; real economic conflict as the test | P4 s2–s5 | preserved |
| Guardian: inventory, vouchers, separate income and expense, reporting and supervision (수 있습니다); identifiable accounts; record purpose and basis; handover at end of guardianship or majority | P5 | preserved |
| Trust or insurance: six items, 유류분 and tax; present and future needs; manager's convenience not first (안 됩니다) | P6 | preserved |

8. 국제가족의 준거법과 절차

| Original point | In the rewrite | Result |
|---|---|---|
| No direct use of domestic rules (안 됩니다); six connecting facts (수 있습니다); different connecting factors per issue (가능성) | P1 | preserved |
| 섭외민사법률적용법 as the starting point; may not suffice; jurisdiction, recognition and enforcement, treaties, foreign law; effect abroad checked at the situs | P2 | preserved |
| Foreign will: form, substantive validity, translation and authentication, probate or execution | P3 s1 | preserved |
| Certificates: apostille OR consular confirmation AND translation (수 있습니다); name mismatch → extra documents (수 있습니다) | P3 s2–s3 | preserved |
| Foreign custody or guardianship judgment: final, due process, recognisable; habitual residence abroad; order of proceedings by best interests and enforceability | P4 | preserved |
| Tax: duties per country (수 있습니다); four overlapping items; double-tax relief; no copying of one country's return (안 됩니다) | P5 | preserved |

9. 자료 수집 순서와 일정 관리 (was 실무 준비 체크리스트)

| Original point | In the rewrite | Result |
|---|---|---|
| Basic framework; filing order varies with agency and urgency; deadlines per step | lead paragraph | preserved |
| Items 1–6 | same order, every element; item 3 merged into one sentence; elsewhere particles only | preserved |
| Record custody place and issue / reference dates; one filing scheme; who holds and who approved; access control for the minor's data | paragraph after the list | preserved |
| Separate urgent preservation from ordinary filings; check urgent facts first; no unauthorised disposal on grounds of urgency; one calendar for court, tax, household, registry | last paragraph | preserved (see observation 1 below) |

10–11 and ending

| Original point | In the rewrite | Result |
|---|---|---|
| Five official links, text and URL | byte-identical | preserved |
| Amendment and effective dates; English text as an aid for collation; forms and portal show general direction; requirements per the receiving office's latest guidance | four sentences, same four points | preserved |
| Three related links | byte-identical | preserved |
| Notice: general educational material, not legal advice; six factors change law, procedure, result (수 있습니다); check latest official sources and own facts before computing deadlines or disposing of property | all three points; plus the phrase moved from the cut intro sentence | preserved, nothing new |
| Signature; no contact line in the original | identical; none added | preserved |

Additions: none. The body questions repeat the FAQ question and the original's own sentence; "상속포기에는 방식이 있습니다.", "조사가 먼저입니다.", "조건이 있습니다." only announce the sentence after them.

Duty wording: 제1174조 "표시해야 합니다", "행사해야 합니다" (§5), "이루어져야 하고" (§7), "권한이 있어야 합니다" (§6), "피해야 합니다" (§4) and seven "안 됩니다" keep their force. Two of the original's nine "안 됩니다" became statements with the same content ("같은 절차가 아닙니다"; the §7 question with "그렇지 않습니다" plus the ban on living costs and debts).

Observations on advisory wording, not legal points and not blocking:
1. §9 last sentence: "하나의 일정표로 함께 관리하는 것이 도움이 됩니다" → "함께 관리합니다". Likewise "확보하는 것이 중요합니다" → "확보합니다" (§1) and "기록으로 남기는 것이 중요합니다" → "남깁니다" (§7). Practical advice stated a little more flatly; no rule of law, condition or deadline is involved. I left it: any change in word count would break the eojeol pin in tests.patch.
2. §4 P4 "상속세 신고는 일반적으로 6개월입니다." is elliptical (신고 기간). The attribution "이 안내에 따르면" stands in the sentence before it and still covers it.

## Not padded

98% of the original (2227 → 2132 eojeol, 7072 → 6941 characters). Cuts: the intro preview sentence, the doubled "실질적 소유자" statement, two of three "자녀의 이익을 위해" in §7, the FAQ-duplicate sentence of §3 P1 merged into §3 P3. No legal point was cut.

## AI voice / MONOTONY

Tool: 0 FAIL. Section 5 items 2–8:
- 2 opener: "가족이 사망하면 시작되는 절차는 하나가 아닙니다." — plain statement, no stock hypothetical. Met.
- 3 short / long: 22 sentences of 15 characters or fewer out of about 160; 8 sentences of 70+ characters, never two in one paragraph. Met.
- 4 paragraph starts: 45 body paragraphs; no first word used three times (대만 2, 민법 2, 이 2). No two consecutive sentences start with the same word. Met.
- 5 claim (statute) → caveat: "다만" opens two sentences in the whole text; about 70% of paragraphs carry no citation. Met.
- 6 contrast: tool count 1. On a strict reading by hand I count about nine sentences that separate two things by negation — "하나가 아닙니다", "같지 않습니다", "후순위 상속인이 아닙니다. 실제로 … 공동상속합니다.", "권리만 찾는 일이 아닙니다. 채무와 절차상 위험도 함께 파악합니다.", "발생 근거도, 상대방도, 계산 대상도 다릅니다.", "같은 절차가 아닙니다.", "부모 개인의 이익을 위한 것이 아닙니다. 자녀의 … 행사해야 합니다.", "별개의 문제입니다.", "같은 개념도 아닙니다." The original has the same nine; the rewrite turned five "…이 아니라" clauses into two-sentence pairs, which lowers the tool count more than the reading effect. Each one is a legal distinction this column exists to make (share / residual claim, parental rights / guardianship, court / tax office), none rebuts a claim the reader did not make, and deleting them would drop legal points, which ranks above variety. I record this item as not met on the strict count. It is the only one.
- 7 closing: the last body paragraph ends on the column's own 일정표 point; the notice is the original's with the clauses reordered; no contact or sales line. Met.
- 8 register: 합니다체 throughout, no 해라체, no bold, no emoji, no first person; the checklist heading was renamed to "9. 자료 수집 순서와 일정 관리". Met.

One item unmet, below the two-item threshold: no FIX on voice.

Recorded for the file, not required for publication:
- MONOTONY: contrast pairs — "재산조사는 권리만 찾는 일이 아닙니다. 채무와 절차상 위험도 함께 파악합니다." — in a later pass, state the positive side alone ("재산조사에서는 권리와 함께 채무와 절차상 위험도 파악합니다") where no misunderstanding is being corrected.
- Three short sentences only announce the next one ("상속포기에는 방식이 있습니다." / "조사가 먼저입니다." / "조건이 있습니다."), and there are about eight "~것은 …입니다" clefts; the 제1094조 sentence is the heaviest.
- "아닙니다" 8 → 12 in the body (closing notice included in both counts) after the "아니라" clauses were split.
- About a third of the sentences are subjectless plain-present advice (확인합니다 7, 살핍니다 7, 검토합니다 6). It reads as procedural Korean and keeps the directive sense.

As a whole the text no longer has the original's uniform rhythm: phrase counts orig → draft are "수 있습니다" 27 → 4, "해야 합니다" 37 → 3, "다만" 5 → 2, with two body questions and sentence lengths from 5 to about 90 characters.

## Tests verdict

PASS. tests.patch touches only `src/lib/__tests__/columns-ko-family-016.test.ts`; no .skip / .only / .todo; no assertion about another column.

- Every string literal the patch adds exists in draft.md exactly once (script check); every literal it removes was in orig.md. The four `h2Lead` constants equal the first paragraphs of sections 1, 3, 5 and 7 character for character.
- Read time (the r1 blocker): the two computed assertions `expect(parsed.data.read_time).toBe(`${calculatedMinutes}분 분량`)` and `expect(post?.readTime).toBe(…)` are kept as context lines; the pins are 2_132 and 12, which match my recount; the front-matter `toEqual` and the `post` match carry '12분 분량'.
- Legal locks still lock the fact in the new wording: 제1138조 order; 제1144조; 제1030조의1; liability cap with 원칙적으로; 제1174조 with 안 날 / 3개월 / 관할 법원 / 서면; tax portal with 2026년 6월 25일 / 3개월 / 6개월 / 일반적; 제1091조; 제1093조; 제1094조 and 제1094조의1; 최선의 이익; 제1087조·제1088조 특유재산; 제1086조; 섭외민사법률적용법; checklist items 1–6 in order; the five official and three internal links (test untouched); the disclaimer and author ending.
- Replaced assertion: "repeats every FAQ answer exactly twice and as the assigned H2 first paragraph". The verbatim FAQ paragraph in the body was removed on purpose (notes 4–5). The new test requires each FAQ answer exactly once (front matter, still locked by the exact `toEqual`), pins the four section openings exactly and once each, and keeps the "3분의 1" count at 2. Acceptable.
- The anonymization list ('두 자녀' and the rest) is not touched by the patch; draft.md contains no '두 자녀'.
- Evidence of the run: tests.txt "PASS (Test Files 78 passed (78))", vitest-1.log 1024 tests passed at 17:08–17:09, after draft.md was last changed (17:06). Not re-run by me.

## Tiny edits applied to draft.md

None in this round. draft.md is as the fix round left it; guard re-run: GUARD: PASS.

## Original issues (not blocking; carried over as published)

1. 제1030조의1 wording looks outdated: "균등 분배의 결과가 현저히 불공평하면 법원이 분배액을 조정할 수 있다". The ja-016 r1 review recorded the current text on law.moj.gov.tw as 有失公平 with 調整或免除 (adjust or waive). That matches my recollection of the 2021 amendment; I did not open the page in this round — 확인 필요. The factor list in §3 P4 is a loose paraphrase of paragraph 3. Belongs to the open fact-fix job for all language versions of 016.
2. §4 P5 says "별도의 일정표", §9 says "하나의 일정표".
3. The 3개월 inventory period and the 6개월 estate-tax period rest on the tax-portal link only, with no article number; the portal's update date 2026년 6월 25일 was not re-verified.
4. Pre-existing lint notes tolerated by the guard: no contact email, last H2 is 관련 안내 and not the sources section, no source-check date in the sources section.

VERDICT: PASS
