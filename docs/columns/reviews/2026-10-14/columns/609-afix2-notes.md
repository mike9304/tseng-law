# C4 afix2 — 2026-10-14

Edited `ko.md`, `ja.md`, `en.md`, and `zh-hant.md` directly. Read both requested reviews and independently checked the official text. No git commands were run. The image and `author: "legal-ai-assistant"` are unchanged.

## Issue → change → source

- Final Sol MAJOR 1: EN `[Article 179]` opened Article 181 → changed that destination to `flno=179`, preserving the sentence's Article 182(1) condition and separate Article 181 basis → [Civil Code Article 179](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=179). All 126 statute links now have matching article labels/destinations; each language's source list contains all four authorities.
- Earlier Astra C1: EN Article 180 application lacked an adjacent citation → the current draft already restores the link at “Article 180, items 1 and 3”; verified and retained it, including discharge purpose and knowledge at payment. Also made the recipient-only unlawful-cause exception explicit in all four FAQ 2 answers and in the JA summary, avoiding an unqualified exclusion → [Article 180](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=180).
- Earlier Astra V1 / MONOTONY, duplicate short statements → confirmed that the intervening revision had integrated the one-line reply, removed repeated two-condition and arrival-date sentences, and retained the reply date together with its evidentiary limitation. Preserved those repairs. Rephrased all four FAQ 1 answers to pair each knowledge branch with its corresponding benefit, retaining both exemption conditions, return/value release, interest and conditional damages → [Article 182](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=182).
- Earlier Astra MONOTONY, three proposition–statute–limitation paragraphs → rechecked the current recipient sections: the record-comparison paragraphs now have a distinct evidentiary function and break the former sequence. No three consecutive paragraphs retain the cited pattern. The account holder, person withdrawing cash, original beneficiary and later remaining benefit remain distinct → [Article 179](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=179), [Article 182](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=182).
- Earlier Astra V2, awkward factual/legal transitions → retained the repaired KO/JA/EN separation between “did further gains arise?” and the return rule; ZH now explains that a relative's withdrawal alone does not identify the beneficiary. Additional gains are not limited to bank interest, and value repayment remains conditional on inability to return → [Article 181](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=181), [Article 179](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=179).

The stale `facts.md` formulations identified in Astra I1 were not used: identifying who originally benefited is distinct from examining the benefit remaining later; Article 181 defines the benefit/further gains/value obligation, not merely a reduction. The fact sheet remains outside the requested edit files.

## Verification

Fresh curl requests returned HTTP 200 for Articles 179–183 and the official Civil Code amendment history. Extracted provisions match the research transcription. Articles 179–182 are the only statutes cited publicly; Article 183 remains research context. `research/judgments/` contains no `.txt` judgments, and no judgment was added. No rate, deadline, amount or transfer-date interest rule was introduced.

Both requested commands were run for each language:

| Language | lint.py | Body length | Variety CV / short share | FAIL |
|---|---|---|---|---|
| ko | OK | 2,559 characters | 0.452 / 12.9% | 0 |
| ja | OK | 3,065 characters | 0.469 / 16.0% | 0 |
| en | OK | 1,168 words | 0.476 / 10.6% | 0 |
| zh-hant | OK | 2,101 characters | 0.476 / 9.1% | 0 |

Manual §5 check: useful short sentences remain; no same-word paragraph opening occurs three times; citation-free paragraphs remain; contrast templates are within limits; endings return to the transfer records; KO/JA retain their required registers. Hypothetical labels, all legal conditions and inline sources remain. KO's opener warning detects the parenthetical hypothetical label after a concrete scene; KO/JA ending warnings reflect their required register. None is a FAIL.

Compared C1–C6 openings and the preceding three dated columns in each language. First-two-paragraph deletion check: the transfer setting, hypothetical label, recorded details, one-line reply and applicable rule each supply information; the duplicate reply sentence quoted in Astra is absent.

The corrected EN paragraph was rendered to HTML and its three anchors verified as 182, 179 and 181. Actual browser-screen verification was unavailable: neither IAB nor Chrome was connected, and browser inventory was empty. This is HTML-link verification, not a claim of live-site or visual QA.

Curl HTML/text, before snapshots, diffs, rendered HTML and link-audit results: `/private/tmp/c4-afix2-htvrdtsz/`. Image SHA-256 before/after: `eb2361b457884e30fba01244fd57d75dc60c821aeab587e75f03f471b5e7cbea`.
