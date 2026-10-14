# C6 final review — GPT-6 Sol — 2026-10-14

Verdict: FIX. The four drafts are not ready to publish as-is. No substantive correction was made by this reviewer.

## Scope checked

- Read the batch brief, both worktree voice rules, C6 topic, all four complete drafts, and the writer's fact sheet. The canonical `~/agent-library/knowledge/editorial-voice.md` named by `COLUMN-VOICE-RULE.md` is absent; `brief-EDITORIAL-VOICE.md` contains the worktree's full editorial rule text and was read. Read the sentence-variety rule and recurring lessons. Compared the opening types with C1–C5.
- Read `research/C6-statutes.md` in full. No judgment is cited, and `research/judgments/` contains no judgment text. Independently opened all seven cited full laws and all 28 distinct single-article links with `curl` (all HTTP 200). Opened the WDA application, document, FAQ, handbook PDF, portal and fresh-graduate sources, and the NIA extension page with `curl`; checked their relevant text against the drafts. The fee and residence regulations were also independently opened. The foreign-professionals act's Article 12 was in force from 2026-01-01 according to the [National Development Council's implementation notice](https://foreigntalentact.ndc.gov.tw/Content_List.aspx?n=8E20BBA0AFD356E5). The cited amendment dates, amounts, periods, conditions, exceptions and article targets otherwise match the official sources as of the stated 2026-10-13 source check.
- Compared the four versions for the student groups, Article 51's OR inside item 1 and AND with the school-certified item 2, its paragraph 2 exceptions, the 20-hour rule, the student application and fee, permit expiry, Article 68 versus Article 74 departure rules, employer sanctions, and graduate residence extension. No numerical contradiction or arithmetic error found. The body links and source lists cover those claims. Three internal links per language passed lint's language-specific existence check. No private-party name, bold, phone, street address, improper byline, review claim, unmarked hypothetical or definitive foreign-law claim found. Frontmatter and EN title/seoTitle/summary limits passed lint.
- Visually opened `images/C6.webp`. Image verdict appears below.

## Major issues requiring correction

1. All four languages, every FAQ answer (`drafts/C6/{ko,ja,en,zh-hant}.md:13–20`): Original → FAQ answers contain raw Markdown citations such as `[Article 51](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090027&flno=51)` (13 links in KO, 13 in JA, 15 in EN, 15 in ZH-HANT) → The publication code preserves each FAQ `a` as a string (`src/lib/columns.ts:45–58`) and inserts it directly as text in `<dd>{item.a}</dd>` (`src/app/[locale]/columns/[slug]/ColumnDetailView.tsx:160–164`); `src/lib/seo.ts:869–881` also places that raw string into FAQPage JSON-LD. Thus publication as-is displays citation syntax and URLs rather than working inline links, and exports Markdown syntax in structured answers. Lint checks the links' target existence but cannot catch this rendering failure. This violates the batch's inline-link rule and the native-reading requirement → Required: render safe inline links in column FAQ answers and emit clean readable text in FAQPage JSON-LD, then check all four rendered FAQ sections; alternatively revise the publication pipeline and FAQ content together so every legal FAQ claim retains a functional official citation → Facts preserved: retain all current Article 51 alternatives and school certification, Article 68/74 distinction, graduate degree and extension conditions, numbers, and source URLs. No draft or site code was edited.

2. EN FAQ 1 and body (`drafts/C6/en.md:15,52`): Original → “formally enrolled in a department, faculty, or graduate program” / “enrolled in a department, faculty, or graduate school” → `faculty` is ambiguous for this U.S.-facing readership and is not a faithful name for the student course units `科、系、所` in [management regulation Article 51(1)(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090027&flno=51); in American English it commonly refers to teaching staff. It obscures a core eligibility condition → Required: use an accurate student-program description of `科、系、所` in both places, such as “formally enrolled in an academic department, program, or graduate institute,” after checking it against the Chinese original; keep the language-course alternative → Facts preserved: formal enrollment OR six months of language study, followed by one school-certified fact under item 2, subject to paragraph 2's exceptions. No legal wording was changed by this reviewer.

## Sentence variety and voice

Required variety command was run on each complete file: KO CV .504 / short .106; JA .495 / .129; EN .561 / .265; ZH-HANT .518 / .103. All exited 0 with no FAIL. KO and JA carry ending-frequency WARNs (96% `니다`, 97% です・ます), but remain in the required registers. Manual section 5 checks found at least two very short sentences per language, no stock hypothetical opening, no three repeated paragraph openers, no three consecutive claim/citation/caveat paragraphs, no excessive contrast pattern, a citation-free scene/question, and a factual close. KO/JA use number-first openings, EN the ARC distinction, ZH-HANT a shop-owner question; none dominates the six-column batch. No MONOTONY rejection is added. The EN `faculty` problem is recorded above because it affects legal eligibility wording.

## Minor edits applied

None. The remaining problems require changes to citation rendering or legal eligibility wording, which the final-review instructions reserve for a fix round.

## Verification and image

`lint.py <file> <lang> taiwan-foreign-student-part-time-work-permit-hours` returned OK for KO (3,497 characters), JA (4,056 characters), EN (1,600 words), and ZH-HANT (2,699 characters). No draft was changed after those checks.

Image verdict: OK. The WebP shows a back-facing, unidentifiable person with a backpack tying an apron beside café equipment. It fits student part-time work, is respectful, and shows no visible face, text, logo, flag or readable document. It reads as a generic illustrative scene; no real-world identity is apparent.

VERDICT: FIX
