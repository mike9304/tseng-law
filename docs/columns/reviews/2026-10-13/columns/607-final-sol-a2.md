# C6 final review — GPT-6 Sol — 2026-10-14

Verdict: PASS. The four current language files and the hero image are publishable as supplied. This reviewer made no column edits.

## Scope and source verification

- Read `brief-BATCH.md`, `brief-EDITORIAL-VOICE.md`, `COLUMN-VOICE-RULE.md`, `topics/C6.md`, all four complete `drafts/C6/{ko,ja,en,zh-hant}.md` files including frontmatter and FAQs, `drafts/C6/facts.md`, and `research/C6-statutes.md`. The separately named `~/agent-library/knowledge/editorial-voice.md` does not exist at that path on this machine; the supplied complete editorial brief was applied. Read `SENTENCE-VARIETY-RULE.md` sections 5–6 and the recurring `LESSONS.md` entries. Compared opening types with C1–C5. No judgment is cited; `research/judgments/` has no C6 judgment to open.
- Treated the writer's fact sheet as a claim index, not proof. Compared each legal claim and cross-language condition with the official Chinese article texts in `research/C6-statutes.md`. Independently opened with `curl` the cited law.moj.gov.tw fee provisions (Articles 2, 4, 6), fee-standard full law and amendment date, residence regulation Article 11 and its full law, Employment Service Act Article 46, the WDA student-work page, document page, online-application FAQ, application portal and fresh-graduate page, and the NIA residence-extension instructions. Downloaded and text-read the WDA's April 2025 L-114-V01 PDF handbook, including the two-semester exchange-student category and the NT$100 application/reissue fee. Opened the seven official English law pages to check the English names. These sources support the cited dates, fees, periods, application conditions, exceptions, penalties and graduate rule. No arithmetic example appears.
- The statutory single-article links use the cited pcode and flno; additional official URLs opened successfully. Each language has an inline citation near the legal claim and a complete official-sources section with the requested check date, 2026-10-13. `lint.py` confirmed that all three internal links in each version point to existing columns in that language.
- Checked the current publication code because an earlier C6 review identified a FAQ rendering risk. `ColumnDetailView.tsx` now renders FAQ answers with `ReactMarkdown` and permits links; `buildFaqJsonLd` parses Markdown to readable text before emitting FAQPage JSON-LD. That earlier objection does not apply to the current publication code. This is a code inspection, not a claim of a live-page check.

## Per-language findings

- KO: Article 43's general rule and Article 48's marriage/residence exception, the Article 50 student groups and vacation exception, Article 51's enrollment-or-six-month branch plus separate school-certified fact, both Article 51(2) qualification exceptions, and student self-application are correctly stated. The one-year validity, NT$100 fee, online-filing exception, fines, Article 68/74 departure distinction, school reporting and degree-based extension match the sources. The hypothetical is marked. Korean formal register holds. Issues: none.
- JA: The same legal conditions and numbers match the Chinese text. In particular, the graduate research exception includes enrollment, school consent and related research; the 20-hour rule is not presented as an unlimited-vacation or unlimited-graduate rule. Natural です・ます register holds. The tutoring scene is marked as fictional. Issues: none.
- EN: The exchange-student passage correctly says the WDA handbook includes exchange students studying in Taiwan for two semesters among those eligible to apply, while the separate school-certified fact remains necessary. The FAQ's enrollment alternatives and graduate extension match the statute. Statute English names match the official English database. Plain, active prose; invented example labeled. Issues: none.
- ZH-HANT: Taiwan terminology, traditional characters, Article 51's AND/OR conditions, employer prohibitions and fine, discretionary immigration power, and the graduate qualification caveat match the official text. The breakfast-shop scenario is labeled 虛構情境. Issues: none.

## Hard-rule and voice audit

- All four frontmatters have the required author, language audience, dates, topic, literal featured-image path, three FAQs and matching H1. The EN title requires and has a 41-character seoTitle; its summary is 156 characters with no forbidden characters. Four required lint commands returned OK: KO 3,497 characters; JA 4,056 characters; EN 1,595 words; ZH-HANT 2,699 characters.
- No private-party names, bold emphasis, phone/hotline number, street address, improper byline, lawyer/native-review claim, unmarked client story, outcome promise, or definitive foreign-law statement found. Each version gives the email-only firm contact once near the end. No excluded topic is developed beyond an allowed internal link.
- First-two-paragraph deletion test: KO/JA's opening paragraph supplies the weekly cap, vacation qualification, covered groups and Article 46 exemption; their next paragraph supplies the student applicant. EN's first two paragraphs separately supply the ARC distinction and applicant. ZH's opening question sets the shop/shift issue, answered immediately by the permit rule. Removing these units would lose context or a legal fact. Titles and subheads are specific rather than imperative/checklist formulas. Final paragraphs return to this column's facts.
- The variety checker exited 0 with no FAIL in every language: KO CV .504 / short .106; JA .495 / .129; EN .560 / .268; ZH-HANT .518 / .103. KO/JA ending-frequency WARNs reflect the required formal registers, not a FAIL. Manual section 5 checks found at least two very short sentences per file, no stock hypothetical opener, no three repeated paragraph-opening words, a citation-free scene or question, no three consecutive claim–citation–caveat paragraphs, no excessive contrast templates or strawman, and no formula closing. KO/JA's isolated numeric opening differs in construction from the other batch openings. No two-item monotony failure is present; no MONOTONY change is required.

## Issues and edits

No unresolved publication issue. There is therefore no `Original → problem & reason → fix → facts preserved` entry to apply. Minor edits applied: none. All factual conditions, numbers, citations and hypothetical labels remain as reviewed.

## Image

Image verdict: OK. Viewed `images/C6.webp` directly. The back-facing apron wearer beside café equipment fits student part-time work and has no visible face, readable text or document, logo or flag. The scene is respectful and the person is unidentifiable.

VERDICT: PASS
