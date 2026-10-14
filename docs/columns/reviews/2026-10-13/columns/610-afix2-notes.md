# C2 afix2 — 2026-10-14

Edited ko.md, ja.md, en.md and zh-hant.md directly. Latest final-sol-a1 blocker resolved in all four. Earlier final-astra-r3 corrections were rechecked against the current drafts and retained. No git command was run; the image and author metadata are unchanged.

## Issue → change → official source

- final-sol-a1, all languages: the annual-document procedure left the meeting requirement unanswered → explicitly state that the Company Act does not require a statutory shareholders’ meeting for a 有限公司. Added the official MOEA interpretation inline and to each source list. This does not prohibit voluntary meetings or waive annual approval. Six-month dispatch, majority voting rights and individual deemed approval after more than one month without objection remain → [MOEA, 1993-11-09, 商227281](https://gcis.nat.gov.tw/elaw/constructionDetailFromSingleLaw?art=108&dash=0&lawCode=19), [Article 110](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=110).
- R3 L01 → confirmed all four retain the mandatory agenda/main-content explanation, optional website method, URL condition and extempore-motion prohibition → [Article 172(5)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=172).
- R3 L02/R01 → retained explicit 股份有限公司 scope, single-government/corporate-shareholder conditions, ordinary-board transitions, limited-company distinction and substantive Chinese subheads → [Article 128-1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=128-1), [Article 192](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=192), [Article 108](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=108).
- R3 L03/C01 → confirmed the existing post-2018-11-01 hypothetical dates (KO/EN/ZH 2020; JA 2019) and repaired English Article 170 link remain intact → [official commencement history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=J0080001), [Article 170](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=170).
- R3 V01–V04 and MONOTONY → retained the earlier prose corrections and varied EN/ZH paragraph openings. KO “이사가 결산 서류를 주주 각자에게 보내고, 승인은 의결권 과반수입니다” now names the director’s action: “이사는 결산 서류를 각 주주에게 보내 의결권 과반수의 승인을 받습니다.” Split the hypothetical’s ownership/charter sentence; shortened repeated fine ranges without changing either bound. JA’s duplicated dispatch sentence became the missing meeting answer. EN/ZH cuts preserve reserve duties, capital thresholds, fines, company scope and dated minutes. ZH’s third “除…” paragraph now begins “證券主管機關未另作規定時” → [Article 110](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=110), [Article 112](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=112), [Article 237](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=237), [Article 210](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=210).
- R3 E01 / fact-sheet bounds → facts.md was already regenerated after afix1, including the correct Article 230(4) fine. Its statement explaining omission of the no-meeting rule is superseded by the verified MOEA finding above; it was not relied on as proof. This log records that correction without editing the reference sheet → [Article 230](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=230), MOEA interpretation above.

## Verification

Fresh curl checks covered all 29 cited statute articles: 27 Company Act articles and Registration Regulations Articles 4–5. The 26 provisions present in research/C2-statutes.md match the official text after whitespace normalization; Articles 185, 189 and registration Article 5 were read directly. Both complete statutes, amendment history and Annexes 3–4 were also fetched. The annexes were extracted and visually checked. The MOEA page loads its interpretations through its public API; the retrieved record is consCd 5982, 商227281, with the express no-meeting-provision statement. Evidence: /private/tmp/c2-afix2/fetch.json, source-*.txt and moea-108.json.

All four versions agree on the conditions, exceptions, AND/OR, deadlines, reserve thresholds and fine amounts. Each body/FAQ official URL is included in its source list. No judgment is cited; research/judgments/ contains no .txt file. Author remains legal-ai-assistant; no prohibited bold, contact number, address, private-party name or lawyer/native-review claim was added. Image SHA-256 matches the initial snapshot.

| Language | lint.py | Body length | Variety FAIL |
|---|---|---:|---:|
| ko | OK | 3,467 characters | 0 |
| ja | OK | 4,457 characters | 0 |
| en | OK | 1,589 words | 0 |
| zh-hant | OK | 2,700 characters | 0 |

Executed both requested commands for every final file. ZH has a non-failing warning for 59% “）。” sentence endings; citation-end ratio is 0.420, below 0.45.

Sentence-variety §5 self-check: no stock hypothetical opener; batch openings and the latest three local columns per language were compared (local corpus, not live publication order). Each file has at least two genuine very short sentences; paragraph-opening words stay within the manual limit; no three consecutive claim–citation–caveat paragraphs; uncited hypothetical paragraphs remain; no contrast template excess; final paragraphs return to approval records. KO 합니다체 and JA です・ます remain consistent. The first-two-paragraph deletion check found substantive question, term/holdover or annual-duty context; none was deleted. Duties, figures, citations and hypothetical labels were preserved. No unresolved major or MONOTONY item remains.
