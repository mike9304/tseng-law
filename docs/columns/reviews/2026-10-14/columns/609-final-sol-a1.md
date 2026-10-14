# C4 final review — 2026-10-14

Verdict: FIX. The English body contains a wrong statute destination. It is a major citation error under the batch rules; the four files are not publishable as they stand. I did not change that link because the reviewer was authorized to edit only minor wording.

## Scope checked

Read in full: `brief-BATCH.md`, `brief-EDITORIAL-VOICE.md`, `COLUMN-VOICE-RULE.md`, `topics/C4.md`, all four C4 drafts and `drafts/C4/facts.md`, and `research/C4-statutes.md`. Checked the fact sheet against the independently opened official [Civil Code Articles 179](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=179), [180](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=180), [181](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=181) and [182](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=182). The official pages give the same operative text as the research transcription. Their pending-effect notices concern Articles 166-1 and 1223, not these four provisions. No draft cites a judgment or another external page, so there was no judgment text or other official page to open. No deadline, monetary amount, interest rate, effective date, arithmetic example or foreign-law holding is asserted in the public text.

Checked frontmatter, titles, summaries, FAQs, every body and source list, all statute link labels against their `flno` targets, internal links through `lint.py`, and the C1–C6 opening types. Read the shared sentence-variety rule §§5–6 and recurring-review lessons. The global `~/agent-library/knowledge/editorial-voice.md` path was absent; the supplied full `brief-EDITORIAL-VOICE.md` and local `COLUMN-VOICE-RULE.md` were applied. Viewed `images/C4.webp`.

## Issues

1. MAJOR — EN body, `en.md:65`. Original: `[Article 179](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=181)` → The label says Article 179, but the official URL opens Article 181. A reader checking the stated legal basis is sent to the wrong provision, violating the exact-article citation rule → Required: change only this link destination to `https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=179`, then rerun English lint and variety checks and verify the link in the rendered article. Not applied because changing citations is outside the minor-edit permission → Facts preserved: the sentence's Article 182(1) condition and its separate Article 179/181 return bases remain untouched. The [official Article 179](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=179) and [Article 181](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=181) pages establish the mismatch.

2. MINOR, applied — EN FAQ 1, `en.md:15`. Original: `[Article 182, paragraph 1](…), releases the recipient` → A comma separated the linked subject from its verb → Removed that comma → Facts preserved: both exemption conditions, the two knowledge branches, interest, conditional damages and the citation are unchanged.

3. MINOR, applied — EN FAQ 2, `en.md:17`. Original: `[Article 180, item 3](…), bars a claim` → The same subject–verb punctuation error → Removed that comma → Facts preserved: discharge purpose, knowledge at payment, the exception's effect and the citation are unchanged.

## Findings by language and gate

- KO: Article 179's benefit/loss/no-cause test, all four Article 180 exclusions and the recipient-only exception, Article 181's further gains/value rule, and both Article 182 paragraphs match the official text. The hypothetical is labelled. The contact, author and source date comply. No blocking voice or citation issue found.
- JA: The same legal tests and exceptions are preserved in natural です・ます prose. The separate question of who benefited when a relative withdrew cash is left open. No blocking voice or citation issue found.
- EN: The substantive law is consistent with the other versions, but issue 1 blocks publication. The two applied FAQ punctuation edits do not change legal meaning.
- ZH-HANT: The same legal tests and exceptions are preserved with Taiwan usage and traditional characters. The bank contact is presented as a practical inquiry without a statutory reversal or disclosure promise. No blocking voice or citation issue found.

All four distinguish spending from actual disappearance of the benefit, and knowledge at receipt from later knowledge. They do not claim that Article 182 sets an interest rate or a universal transfer-date start. No cross-language legal contradiction, private-party name, identifying account number, bold, phone/hotline, street address, lawyer/native-review claim, invented professional experience or unlabelled hypothetical was found. Each has one short firm/email contact paragraph and a complete four-article official-source list checked 2026-10-14. Matching-language internal links exist. English frontmatter title/seoTitle/summary conditions and the other frontmatter fields passed lint.

`lint.py` returned OK for KO (2,551 characters), JA (3,065 characters), EN (1,168 words after the minor edits) and ZH-HANT (2,101 characters). `variety_metrics.py check` returned exit 0 and zero FAIL lines in all four: KO CV 0.467/short 15.5%, JA 0.469/16.0%, EN 0.476/10.6%, ZH-HANT 0.476/9.1%. KO's stock-opener WARN is a heuristic on the second-sentence hypothetical label: the first sentence begins with the concrete company payment, not the stock formula. The KO/JA register WARNs do not show register mixing. Manual §5 checks found at least two very short sentences, no three same-word paragraph openings, no three consecutive claim–citation–caveat paragraphs, citation-free paragraphs, at most one contrast-template match, and fact-specific endings. No MONOTONY failure is established. The two EN punctuation edits were followed by English lint OK and variety OK.

Minor edits applied: two EN FAQ comma deletions (issues 2–3). No facts, numbers, citations, legal conditions or hypothetical labels were edited.

Image verdict: OK — viewed the hero image. Two ceramic bowls and blank coin-like discs form an abstract money-transfer scene. No face, identifiable person, text, logo, flag or readable document appears.

VERDICT: FIX
