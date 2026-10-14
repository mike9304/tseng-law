# C2 final review — GPT-6 Sol — 2026-10-14

Verdict: PASS. All four current language files are publishable with the one minor English heading edit recorded below. No substantive correction remains.

## Scope checked

- Read in full `brief-BATCH.md`, `brief-EDITORIAL-VOICE.md`, `COLUMN-VOICE-RULE.md`, the common `editorial-voice.md`, `topics/C2.md`, all four C2 column files, `drafts/C2/facts.md`, and `research/C2-statutes.md`. The fact sheet was treated as a claim inventory, not as proof. Read the sentence-variety rule, including §§5–6, and the recurring lessons. No judgment is cited; `research/judgments/` has no judgment text.
- Fetched the current official Company Act and its amendment history, the Company Registration Regulations, the MOEA Article 108 interpretation, and registration Annexes 3 and 4 by curl on 2026-10-14. The 25 Company Act articles and two registration articles present in the research extract match the current official full-law text after whitespace normalization. Also read the cited Articles 185, 189 and registration Article 5 directly. The Company Act page prints the 2025-12-26 amendment date; the history shows that amendment changed Article 449 and added Article 387-1, with delayed commencement only for Article 387-1. The registration regulation page prints 2021-04-23. The MOEA's live API gives interpretation 商227281 of 1993-11-09 and expressly says there is no statutory shareholders' meeting provision for a limited company. Extracted and visually viewed the first pages of both official annex PDFs; the cited director-change rows are present.
- Verified all 33 distinct official URLs in the four drafts return HTTP 200. Every distinct body/FAQ official URL appears in the corresponding source list. The encoded statute links decode to the correct pcode and article. Internal links use the language's `/columns/` path and pass lint's existence check. Each source list has the 2026-10-13 check date and a 2026-10-14 recheck note.

## Law and facts, by language

- KO: Checked the limited-company no-meeting and Article 110 approval route; the one government/corporate shareholder Article 128-1 route; multiple-shareholder AGM, notice, quorum and sanctions; annual accounts, CPA condition, liability-release exception, dividend reserves, terms, minutes and change registration. All cited conditions, actors, periods and fine ranges agree with the official provisions. The 2020 example is labelled hypothetical. No arithmetic example or judgment holding is present.
- JA: Checked the same legal core, including the one-director exception in its 2019 hypothetical. It correctly treats a dated sole-director approval record as practical advice and does not impose Article 207 board minutes on that structure. The terms, statutory exceptions and fine amounts agree with the official text.
- EN: Checked the same legal core, including the two-director board route in its 2020 hypothetical. The Article 231 exception and the distinction between a shareholders' meeting resolution and Article 128-1 board approval remain explicit. The legal statements agree with the official text.
- ZH-HANT: Checked the same legal core, including the one-corporate-shareholder and multi-shareholder branches, 15-day change registration, the reserve thresholds for each company form, and the stated sanctions. Taiwan legal terminology and the 2020 fictional example are appropriate. The legal statements agree with the official text.
- Cross-language: No conflict in the legal rules. The four different hypotheticals use permitted structures; none is presented as an actual client matter. The Korean/Japanese/US-law sentence in each version is a general referral to local professionals, with no unsupported foreign-law deadline or outcome asserted. No tax-return deadline, Article 22-1 filing or video-meeting rule is imported.

## Citations, hard rules and voice

- All versions have article-specific inline citations after the legal claims and complete official-source sections. Article 172's agenda items, main-content explanation, optional website method and ban on extempore motions are preserved. Article 170's good cause **and** authority approval, Article 110's six-month dispatch and more-than-one-month deemed approval, Articles 195/217's holdover and authority-order conditions, and the registration exception are stated correctly. The examples contain no calculation.
- All four frontmatter blocks and body lengths pass lint: KO 3,467 characters; JA 4,457 characters; EN 1,589 words; ZH-HANT 2,700 characters. English `seoTitle` and summary pass their limits. No private-party names, prohibited bold, phone/hotline, street address, LINE/Kakao ID, attorney or native-review claim, extra public byline, or unmarked hypothetical was found. `author` is `legal-ai-assistant`. Each version has one email-only firm contact paragraph near the end.
- Natural-language review: KO maintains 합니다체; JA maintains です・ます; EN uses plain English; ZH-HANT uses Taiwan terms without simplified characters or Mainland expressions. Titles, summaries, first two paragraphs and final paragraphs were read separately. The first paragraphs supply the shareholder/term/deadline question or fact; removing them would lose that context or break the next sentence. Closings return to the approval record, not a generic disclaimer or sales line. The batch's other openings were checked for repeated opening type.
- Sentence-variety checker: KO, JA and EN report OK; ZH-HANT reports one non-failing WARN for frequent `）。` endings and no FAIL. Manual §§5–6: no stock hypothetical opener, at least two very short sentences in each, no three paragraphs beginning with the same word, no three consecutive claim–citation–caveat paragraphs, at least one uncited paragraph, no excess contrast template or invented rebuttal, a fact-specific close, and consistent KO/JA register. No MONOTONY rejection.

## Issue and minor edit applied

- EN heading original `## After the three years` → could suggest every director serves exactly three years, whereas Article 195 sets a maximum → changed to `## When the term ends` (applied) → facts preserved: the three-year ceiling, re-election, holdover and automatic discharge conditions in the adjacent text and citations are unchanged. Re-ran EN lint (OK, 1,589 words) and variety checker (OK, no FAIL).

Minor edits applied: one English subheading only. No fact, number, article, citation, link or hypothetical label was changed. No major issue remains.

## Image

Image verdict: OK. Viewed `images/C2.webp` at original resolution. Generic blank books, a plain stamp and case suit the accounts/records subject. No face, identifying detail, readable text or document, logo, or flag appears.

VERDICT: PASS     (all four languages publishable now, image OK)
