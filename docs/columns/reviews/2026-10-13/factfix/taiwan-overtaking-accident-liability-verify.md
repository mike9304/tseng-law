# verify — fact-taiwan-overtaking-accident-liability-1 (round 0, Claude Opus)

Retrieval date for every official page below: 2026-10-13.

Scope: triage.md lists one factual item. The other four points in issues.md (wording "두 가지", checklist-flavoured heading, "기존 칼럼/원래 칼럼" labels, house format without sources section) are style or format remarks, not statute facts, and were left untouched.

## Issue 1 — Does the "sign installed" condition in Article 101 cover all five places, or only the tunnel/intersection item?

### The claim as each language version states it (live text)

- ko: "제101조는 굽은 도로, 급경사, 좁은 다리, 터널 또는 교차로를 나타내는 표지가 설치된 구간, 철도 건널목, 도로 공사 구간에서는 추월을 금지합니다."
- ja: "第101条によれば、曲線、急勾配、狭橋、トンネル、交差点を示す標識が設けられた区間、ならびに鉄道の踏切や道路工事区間では、追い越しは禁止されます。"
- en: "Article 101 prohibits overtaking on road sections with signs for bends, steep slopes, narrow bridges, tunnels, or intersections, and at railroad crossings or roadwork areas."
- zh-hant: "第101條規定，行經設有彎道、陡坡、狹橋、隧道、交岔路口標誌之路段，或鐵路平交道、道路施工地段，不得超車。"

### Official source

- 道路交通安全規則 第101條 (single article): https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040013&flno=101 — retrieved 2026-10-13
- Same article through the article-search view, used as a second independent read of the wording: https://law.moj.gov.tw/LawClass/LawSearchContent.aspx?pcode=K0040013&norge=101 — retrieved 2026-10-13
- Amendment history: https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=K0040013 — retrieved 2026-10-13. The newest entry is 中華民國115年6月26日. The last entry that lists 第101條 is 中華民國106年12月29日 (in force 107年1月1日); none of the 22 later entries (107年6月29日 to 115年6月26日) lists Article 101. So the text below is the current text.

How it was read: WebFetch on the two law.moj.gov.tw pages above; both returned the same characters and punctuation for items 一 and 二. The English page (https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=K0040013 and the ENG LawSearchContent view) came back blank through WebFetch, so no official English wording was used. A direct download with curl was not permitted in this session, so the quotes rest on the two WebFetch reads.

### Statute text (original Chinese, 第101條第1項 lead-in and the two prohibition items)

> 汽車超車時，應依下列規定：
>
> 一、行經設有彎道、陡坡、狹橋、隧道、交岔路口標誌之路段或鐵路平交道、道路施工地段，不得超車。
>
> 二、在設有學校、醫院標誌或其他設有禁止超車標誌、標線之處所、地段或對面有來車交會或前行車連貫二輛以上者，不得超車。

### Reading of item 一

The verb 設有 takes 標誌 as its object, and the five nouns joined by 頓號 (彎道、陡坡、狹橋、隧道、交岔路口) all modify 標誌. 之路段 closes that phrase: "road sections where a sign for a bend, steep slope, narrow bridge, tunnel or intersection is installed". After 或, 鐵路平交道 and 道路施工地段 are direct objects of 行經 and carry no sign condition.

Answer to the reported question: the sign condition covers all five places. It is not limited to tunnel and intersection, and bends, steep slopes and narrow bridges are not prohibited places on their own under this item.

### Verdict: PARTLY

What is wrong is the list structure in ko and ja only. No version states a wrong fact on its intended reading, and nothing else in the sentence is affected.

- ko — PARTLY. The comma list runs flat from "굽은 도로" to "도로 공사 구간", every item is a place noun, and "또는" sits between only the fourth and fifth. The sentence can therefore be read as "bends, steep slopes, narrow bridges, [sections with a tunnel or intersection sign], railway crossings, roadwork sections", which makes the first three places prohibited without any sign. Item 一 excludes that reading. This is the ambiguity the review reported.
- ja — PARTLY, same structure, weaker. "ならびに" already separates the railway crossing and roadwork group, but inside the first group "曲線、急勾配、狭橋、トンネル、交差点を示す標識が設けられた区間" can still be read as four bare places plus "sections with an intersection sign". Item 一 excludes that reading too.
- en — ORIGINAL-RIGHT. "road sections with signs for bends, steep slopes, narrow bridges, tunnels, or intersections" puts all five under "signs for", and "and at railroad crossings or roadwork areas" stands outside it. Matches item 一. Left unchanged and used as the reference.
- zh-hant — ORIGINAL-RIGHT. The sentence reproduces the statute wording of item 一 (only a comma added before 或). Left unchanged and used as the reference.

Correct statement: overtaking is prohibited on road sections where a sign for a bend, steep slope, narrow bridge, tunnel or intersection is installed, and at railway level crossings and road construction sections.

Fix applied: in ko and ja the five sign subjects are joined with a middle dot (가운뎃점 / 中黒) instead of commas, so they read as one group governed by "를 나타내는 표지가 설치된 구간" / "を示す標識が設けられた区間". No word, number, link or heading was added or removed; the ko column already uses the middle dot for grouped nouns ("신호·양보 순서").

No link was replaced or removed.

## Changes

- ko:
  - "굽은 도로, 급경사, 좁은 다리, 터널 또는 교차로를 나타내는 표지가 설치된 구간" → "굽은 도로·급경사·좁은 다리·터널·교차로를 나타내는 표지가 설치된 구간" (rest of the sentence unchanged)
  - lastmod "2026-09-30" → "2026-10-13"
- ja:
  - "曲線、急勾配、狭橋、トンネル、交差点を示す標識が設けられた区間" → "曲線・急勾配・狭橋・トンネル・交差点を示す標識が設けられた区間" (rest of the sentence unchanged)
  - lastmod "2026-09-30" → "2026-10-13"
- en: no change (already correct)
- zh-hant: no change (already correct)

No front-matter FAQ or summary carried the claim: ko, ja and zh-hant have neither key, and the en summary does not list the prohibited places.

## Checks run (2026-10-13)

- factguard.py: FACTGUARD: PASS — ko 10 body characters changed (0.4%), ja 4 (0.2%), en and zh-hant unchanged.
- variety_metrics.py check: the corrected drafts report the same FAIL lines as the live text (ko: len_cv, short_share, top_opener_n; ja: short_share). They are in the published column already and were not introduced by this fix (ko len_cv 0.394 → 0.393, everything else identical). Not repaired here, because this job allows only the smallest edit that matches the statute.
