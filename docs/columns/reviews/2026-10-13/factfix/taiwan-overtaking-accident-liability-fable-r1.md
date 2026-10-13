# review-r1 — fact-taiwan-overtaking-accident-liability-1 (Claude Fable, final gate)

Review date: 2026-10-13. Files read in full: issues.md, triage.md, verify.md, guard.txt, tests.patch, orig/draft for ko, ja, en, zh-hant.

## Verdict

PASS. One factual item was in scope (triage: FACTUAL 1). The fixer's reading of the statute is correct, the ko and ja corrections match it, en and zh-hant were rightly left unchanged, the diffs contain nothing beyond the corrected sentence and lastmod, and the test patch only re-anchors pinned values of this column.

## Issue 1 — does the "sign installed" condition in Article 101 item 一 cover all five places?

### Official pages opened independently (2026-10-13, WebFetch)

1. https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040013&flno=101
2. https://law.moj.gov.tw/LawClass/LawSearchContent.aspx?pcode=K0040013&norge=101
3. https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=K0040013

Pages 1 and 2 returned identical characters and punctuation for the lead-in and items 一, 二, 三 of 第101條第1項:

> 汽車超車時，應依下列規定：
> 一、行經設有彎道、陡坡、狹橋、隧道、交岔路口標誌之路段或鐵路平交道、道路施工地段，不得超車。
> 二、在設有學校、醫院標誌或其他設有禁止超車標誌、標線之處所、地段或對面有來車交會或前行車連貫二輛以上者，不得超車。
> 三、欲超越同一車道之前車時，須先按鳴喇叭二單響或變換燈光一次，不得連續密集按鳴喇叭或變換燈光迫使前車允讓。

This matches the quotation in verify.md character for character.

Currency: page 3 lists 132 entries. The newest is 民國115年6月26日 (in force 115年6月30日) and amends 第3、8、39-2、44、53、56、60、61-1、88、95、99-1、112條 plus annexes; it does not touch 第101條. The last entry listing 第101條 is 民國106年12月29日 (entry 110). None of entries 111 to 132 lists 第101條. So the text above is the current text, as verify.md states.

### Statute sentence checked and its reading

Item 一: 行經設有彎道、陡坡、狹橋、隧道、交岔路口標誌之路段 / 或鐵路平交道、道路施工地段 / 不得超車。

設有 ("has installed") takes 標誌 as its object. 彎道、陡坡、狹橋、隧道、交岔路口 are five coordinated modifiers of 標誌, closed by 之路段. A bend, slope or bridge cannot itself be "installed", so the alternative reading (first three as bare places) is excluded by the verb. After 或, 鐵路平交道 and 道路施工地段 are direct objects of 行經 with no sign condition. The fixer's reading in verify.md is correct: the sign condition governs all five places; railway crossings and roadwork sections are prohibited on their own.

### Verdict on verify.md: PARTLY — agreed

- ko — PARTLY, agreed. Live text "굽은 도로, 급경사, 좁은 다리, 터널 또는 교차로를 나타내는 표지가 설치된 구간, 철도 건널목, 도로 공사 구간" is a flat comma list in which "또는" joins only 터널/교차로, so "표지가 설치된" can be read as attaching only to those two. Draft "굽은 도로·급경사·좁은 다리·터널·교차로를 나타내는 표지가 설치된 구간, 철도 건널목, 도로 공사 구간" groups the five under the sign condition and leaves the two bare places outside it. Matches item 一. Reads as native 합니다체; the column already uses 가운뎃점 ("신호·양보 순서").
- ja — PARTLY, agreed. Live "曲線、急勾配、狭橋、トンネル、交差点を示す標識が設けられた区間" allowed the same misreading. Draft "曲線・急勾配・狭橋・トンネル・交差点を示す標識が設けられた区間、ならびに鉄道の踏切や道路工事区間" is standard Japanese enumeration with 中黒, and "ならびに" keeps the two bare places separate. Matches item 一. Natural です・ます register.
- en — ORIGINAL-RIGHT, agreed. "road sections with signs for bends, steep slopes, narrow bridges, tunnels, or intersections, and at railroad crossings or roadwork areas" already places all five under "signs for". Unchanged.
- zh-hant — ORIGINAL-RIGHT, agreed. "行經設有彎道、陡坡、狹橋、隧道、交岔路口標誌之路段，或鐵路平交道、道路施工地段，不得超車" reproduces the statute with one added comma. Unchanged.

Cross-language consistency: all four versions now state the same rule (five sign-marked places + railway crossing + roadwork). Item 二 and item 三 sentences in each language were compared against the statute as read above and were already consistent; they were not touched.

No front-matter summary carries the claim (checked: en summary does not list places; ko/ja/zh-hant have no summary or FAQ keys).

## Scope (diff of each pair)

- ko: two hunks only — lastmod 2026-09-30 → 2026-10-13, and the item-一 sentence (four commas plus "또는" → four 가운뎃점). Nothing else.
- ja: two hunks only — lastmod → 2026-10-13, and the item-一 sentence (four 、 → four ・). Nothing else.
- en: no diff.
- zh-hant: no diff.

No facts added. All links and source entries kept (law.moj.gov.tw Article 101 link, gonews secondary link, three internal links). No URL removed, so no REMOVED-URL line is required. The other four items in issues.md are style/format remarks and were correctly left out of scope.

## Language

Both edited sentences read natively. ko middle-dot enumeration inside a comma-separated list is standard usage. ja 中黒 enumeration before を示す標識 is standard. No translationese introduced.

## Tests (tests.patch)

- Touches only columns-ja-traffic-012.test.ts and columns-ko-traffic-012.test.ts.
- ja: lastmod and loader date re-pinned to 2026-10-13; pinned item-一 sentence updated to the middle-dot wording; EXPECTED_SOURCE_SHA256 updated. I hashed the files myself: orig-ja.md = c37198269c130ab4f0c63e5b15f51ac689a4a17d0a1addff2569017670ba2e86 (the old pinned value), draft-ja.md = 8f027ed010b1c9f23dea377cfba707f33c46bb19c111e7702255ad740012fad7 (the new pinned value). Japanese and kana counts unchanged, consistent with 、→・ not counting as Han or kana.
- ko: lastmod and loader date re-pinned; pinned item-一 sentence updated; EXPECTED_VISIBLE_EOJEOL 538 → 533. Arithmetic checks: "굽은 도로, 급경사, 좁은 다리, 터널 또는 교차로를" is 8 whitespace-separated words, "굽은 도로·급경사·좁은 다리·터널·교차로를" is 3, difference 5.
- The fact-locking assertions (pinned Article 101 sentences, Article 101 URL, link labels) still lock the corrected wording. No .skip/.only/.todo (grep: no matches). No assertion loosened.
- vitest-1.log: 82 files, 1405 tests passed.

Tests verdict: OK.

## Checks run by the reviewer

- factguard.py (2026-10-13): NOTE ko 10 chars (0.4%), ja 4 chars (0.2%), en/zh-hant unchanged — FACTGUARD: PASS.
- variety_metrics.py check: draft-ko and draft-ja report exactly the same FAIL lines as orig-ko and orig-ja (ko: len_cv, short_share, top_opener_n; ja: short_share). Pre-existing in the live column, not introduced by this fix, and outside this job's minimal-edit scope.

## Tiny edits by the reviewer

None.

## Blocking issues

None.

VERDICT: PASS
