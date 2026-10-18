# C5 final review — round 1 — 2026-10-16

Verdict: PASS after the bounded edits recorded below. No unresolved MAJOR legal/factual finding, uncorrected hard-rule failure, or MONOTONY failure remains. Image: OK.

Reviewer: independent final reviewer; I did not write the submitted drafts or the earlier voice review. I directly applied the limited corrections below as authorized. This is an editorial publication verdict, not a claim of attorney or human native-speaker review. No publication action was performed.

## Scope and evidence

Read in full: `brief-BATCH.md`, `brief-EDITORIAL-VOICE.md`, `COLUMN-VOICE-RULE.md`, `topics/C5.md`, all four `drafts/C5/{ko,ja,en,zh-hant}.md`, `drafts/C5/facts.md`, and `research/C5-statutes.md`. Also read `reviews/C5/voice-sol.md`, `topics/LINKS.md`, the sentence-variety rule including sections 5–6, and the recurring-reviewer lessons. The legacy canonical voice path referenced by `COLUMN-VOICE-RULE.md` is absent locally; the supplied full `brief-EDITORIAL-VOICE.md` was available and applied. This is round 1: there is no earlier C5 Astra finding/resolution table to close.

Reviewed frontmatter, titles, summaries, all FAQ answers, every body paragraph, every comparison-table cell, the lawyer-services ending, contact details, and the sources sections. The scope is a Taiwan-incorporated company limited by shares with a board, illustrated by a company whose shares have not been publicly issued. No judgment is cited in any version; there was therefore no judgment text or holding to audit. No Korean, Japanese or US legal rule is asserted.

Opened these official pages with `curl`, saved the successful HTTP 200 responses and extracted text under `final-astra-r1-evidence/`:

- [Company Act Article 205](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=205): all seven Chinese paragraphs match the research file exactly after surrounding whitespace is removed. This was independently compared with the claims, rather than treating the writer's facts sheet as authority.
- [Chinese full text](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=J0080001): the law-wide amendment header is 2025-12-26, matching the research header's ROC 114 date.
- [Official English translation](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=J0080001): checked Article 205 and the footer stating that the Chinese version prevails if the versions differ. The English column's phrase “a company that has publicly issued its shares” follows the Chinese category; it does not substitute a broader colloquial meaning of “public company.”
- [Legislative history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=J0080001): the 2018 amendment containing Article 205 took effect on 2018-11-01; the 2025 amendment concerns Articles 387-1 and 449. None of the drafts attributes the law-wide 2025 amendment date to Article 205 or invents a new commencement date.

The official database's displayed compilation cutoff is 2026-10-08; the above pages were accessed for this review on 2026-10-16. The columns accurately give the check date rather than presenting the compilation date as an amendment date. The browser fetch of the English page timed out, but the required independent curl fetch succeeded and its text was read.

## 1. Law and facts — all four languages

| Statutory point | Official text / necessary distinction | Result in ko, ja, en and zh-hant |
|---|---|---|
| Article 205(1) | “董事應親自出席”; exception where the articles permit another director to represent the director | Mandatory personal attendance retained. Proxy must be another director of the same company, with an articles provision. A non-director employee or parent-company manager is not made eligible. |
| Article 205(2) | The board meeting is held by video, and the director participates in that meeting by video | Both conditions retained, including the FAQ and table. No invented articles requirement or geographic restriction. A later message is not called video attendance. |
| Article 205(3) | “應於每次出具委託書，並列舉召集事由之授權範圍” | Meeting-specific written proxy and the scope of authority for the convened matters retained. No notarisation requirement, filing deadline or mandatory voting instruction invented. The annual standing-proxy example is tied to “每次.” |
| Article 205(4) | “前項代理人，以受一人之委託為限” | One proxy director may represent only one other director. With two directors abroad, the Taipei director cannot represent both. Video participation does not use a proxy. |
| Article 205(5) | Articles provision AND all-director consent; writing on that meeting's proposals; no actual meeting | All conditions retained in the operative sections and FAQs. JA/ZH summaries and the opening overviews were tightened as recorded below. Consent is expressly consent to using the method, not an invented unanimous substantive-vote threshold. |
| Article 205(6) | “前項情形” limits the deemed-meeting effect; written voters are deemed personally present | Both deeming effects remain conditional on paragraph 5. Merely exchanging email views is not stated to establish a board meeting. The drafts do not decide whether a particular electronic document satisfies the writing requirement. |
| Article 205(7) | “前二項規定，於公開發行股票之公司，不適用之” | Exclusion applies to paragraphs 5–6 only. The text does not extend the exclusion to video or proxy participation and does not purport to decide separate public-company procedures. |

The three-director hypotheticals are labelled as invented in every language. The Taipei general manager is also a director; the mixed video/proxy examples preserve that fact and the one-principal limit. Three directors and two directors abroad are consistent throughout. Two agenda items and a one-year blanket proxy are illustrative facts, not statutory voting thresholds or statutory periods. No financial amount, fee, exchange rate or deadline calculation is asserted.

The drafts leave meeting notices, quorum and voting thresholds to separate rules without stating their content. Annual accounts, terms of office and the Japanese responsibility article are confined to the permitted internal-link sentence. There is no expansion into shareholder video meetings, companies without a board, registration or director-liability analysis. The services ending does not guarantee the validity of a resolution.

## 2. Citations

All four versions: each body paragraph stating an Article 205 rule carries its own official inline link. Each FAQ answer and each table row also links the same correct single-article URL, `pcode=J0080001&flno=205`. Paragraph numbers are consistent with the source. The summaries are supported by the linked body and FAQ; the English summary stays general and contains no prohibited URL.

All cited statute articles are in `research/C5-statutes.md`; the only cited article is 205. Source lists include every official source used by the corresponding version and the required 2026-10-16 check date. The English translation is additionally listed in English. No source URL or internal link was removed by the edits.

The supplied lint verified that `taiwan-subsidiary-annual-shareholders-meeting-director-term` exists in ko, ja, en and zh-hant in the designated repository. The additional `taiwan-subsidiary-responsible-person-liability` link exists in ja and appears only there. There are 1, 2, 1 and 1 internal links respectively; none points to this batch.

## 3. Hard rules and frontmatter

All four versions pass the exact required metadata, `topic: "company"`, language-only audience, internal `author: "legal-ai-assistant"`, 2026-10-16 dates, three FAQ items, and literal `NNN` image path. H1 equals title. The EN title is 80 characters, so its distinct 45-character seoTitle is required and valid; the summary is 155 characters and contains no forbidden punctuation or URL. Read times are plausible for the measured lengths.

No private-party names, bold markup, phone/hotline numbers, messaging IDs, attorney byline, lawyer-review claim, native-review claim or invented first-person experience appears. Fictional roles and locations are not presented as actual client facts.

The final section in every language describes suitable work: reviewing articles and board composition, selecting an available Article 205 method, preparing/reviewing the meeting-specific proxy or written-consent/vote record, and checking the minutes against participation. It expressly reserves resolution validity for review of the complete record and other applicable rules. Each contact paragraph names the required firm, email and exact locale-specific Taipei address once. EN includes exactly “English-speaking lawyer in Taipei.” The final substantive sentence requests the articles, director list and next meeting's convened matters; it is tied to this column's facts and makes no outcome promise.

## 4. Issues and corrections applied

All corrections use the already researched Article 205 or preserve existing practical guidance. None required a new legal theory, an additional operative statute, or rewriting the legal analysis.

### E1 — Opening written-vote overview: public-share exclusion

- KO `ko.md:26`: “정관 규정과 이사 전원의 동의를 갖추면 … 서면으로 표결할 수도 있습니다” → problem & reason: the opening overview did not itself state the paragraph 7 exclusion, although the body and FAQ did → fix applied: “주식을 공개발행하지 않은 회사는 …” and expanded the cited paragraph range from 2–6 to 2–7 → facts preserved: articles provision, every director's consent, the particular meeting's proposals, writing and no actual gathering.
- JA `ja.md:26`: “定款の定めと董事全員の同意がそろえば … 書面で議決することもできます” → same compressed-overview omission → fix applied: “株式を公開発行していない会社では、…”; paragraph 7 added to the citation label and proxy/written-vote sentences separated → facts preserved: every existing proxy, video and written-vote proposition and link.
- EN `en.md:26`: “a written vote without an actual meeting requires both a provision in the articles and every director's consent” → same omission, with the particular-meeting scope only explained later → fix applied: “For a company that has not publicly issued shares, voting in writing on that meeting's proposals without actually meeting requires …”; paragraph 7 added to the citation label and the proxy clause made its own sentence → facts preserved: no-meeting route, articles provision, unanimous procedural consent, video conditions and proxy condition.
- ZH `zh-hant.md:26`: “若章程訂明、全體董事也同意，則可就當次議案書面表決而不實際集會” → same omission → fix applied: “股票未公開發行的公司，若…”; paragraph 7 added to the citation label and the proxy sentence separated → facts preserved: all original conditions, subject matter and citations.

Source: Article 205(7), “前二項規定，於公開發行股票之公司，不適用之.” The operative body had this exclusion correctly in every language; these are consistency repairs to the overview, not a new legal conclusion.

### E2 — JA and ZH summaries: the particular meeting's proposals

- JA `ja.md:4`: “会議を開かない書面での議決権行使には…” → problem & reason: summary omitted “當次董事會議案,” already correctly stated in the body → fix applied: “実際に集まらず、その回の董事会の議案について書面で議決権を行使するには…” → facts preserved: articles, all-director consent, no actual gathering and the public-share exclusion.
- ZH `zh-hant.md:4`: “不實際集會的書面表決…” → same summary omission → fix applied: “針對當次董事會議案、不實際集會的書面表決…” → facts preserved: the same conditions and exclusion.

Source: Article 205(5), “董事就當次董事會議案以書面方式行使其表決權.”

### E3 — All four: make the object of unanimous consent explicit

- KO `ko.md:50`: “이사 세 명 모두가 동의해야 합니다” → potential ambiguity about consent to the method versus approval of every proposal → applied “이사 세 명 모두가 이 방식에 동의해야 합니다” → facts preserved: unanimity, the example's three directors, articles requirement and the separate question of resolution thresholds.
- JA `ja.md:54`: “合わせて3人全員の同意が必要です” → same ambiguity → applied “合わせて3人全員がこの方法に同意する必要があります” → same facts preserved.
- EN `en.md:54`: “must consent” → same ambiguity → applied “must consent to using this method” → same facts preserved.
- ZH `zh-hant.md:54`: “三位董事全體同意” → same ambiguity → applied “三位董事全體同意採用” → same facts preserved.

Source: Article 205(5). These phrases clarify the existing explanation; they do not introduce a substantive voting threshold.

### E4 — KO: proxy writing is required each meeting, not a page-count rule

`ko.md:42`: “한 장으로는 안 됩니다.” → problem & reason: following the annual-blanket example, the isolated short sentence could sound like a physical page-count requirement → fix applied: “회의마다 따로 냅니다.” → facts preserved: Article 205(3)'s “每次,” written proxy, agenda-related authority, the one-year example and its citation. A properly completed one-page proxy for one meeting is not disparaged.

### E5 — JA: conditional deemed attendance and natural legal prose

- `ja.md:32`: “ビデオでの参加と書面での議決は、それぞれ第2項と第6項で『親自出席』とみなされる形をとっています” → problem & reason: explanation of drafting form rather than the reader's legal position; abbreviated written-vote reference → fix applied: “ビデオでの参加と要件を満たす書面での議決は、それぞれ第2項と第6項により自ら出席したものとみなされます” → facts preserved: both paragraph references, deemed personal attendance and conditional written voting.
- `ja.md:54`: “第6項のみなし” → problem & reason: compressed legal-note wording → fix applied: “第6項の効果” → facts preserved: the effect remains limited to the paragraph 5 situation, with the same link and email limitation.

### E6 — JA: remove repeated sentence endings in practical preparation

`ja.md:68`: “その日数も逆算に入れておきたいところです。…読んでおきたいところです。” → problem & reason: two adjacent, unnecessarily indirect endings → fix applied: “その日数も見込んで準備します。会議後は、議事録に各董事の参加方法が正確に記録されているかを確かめます。” → facts preserved: any Japanese head-office internal approval remains conditional practical context, no foreign-law rule or duration is introduced, and checking the participation record remains practical advice.

### E7 — ZH: explain the effect instead of the statute's writing technique

`zh-hant.md:32`: “視訊參與和書面表決走的是另一種寫法，分別由第2項、第6項『視為親自出席』。” → problem & reason: unnatural discussion of drafting technique and abbreviated written-vote scope → fix applied: “視訊參與及符合要件的書面表決，則分別依第2項、第6項視為親自出席。” → facts preserved: both paragraph numbers, the attendance effect and the conditions on written voting.

### Applied-edit inventory

- `ko.md`: opening exclusion/citation label; meeting-specific proxy wording; consent-to-method clarification — 3 changed lines.
- `ja.md`: summary scope; opening exclusion/citation label and sentence split; deemed-attendance wording; consent object and “効果”; practical-preparation endings — 5 changed lines.
- `en.md`: opening exclusion/meeting scope/citation label and sentence split; consent object — 2 changed lines.
- `zh-hant.md`: summary scope; opening exclusion/citation label and sentence split; deemed-attendance wording; consent object — 4 changed lines.

Exact before/after patches are saved as `final-astra-r1-evidence/{ko,ja,en,zh-hant}.diff`, with original manuscripts in its `originals/` directory. No fact, numeral, source URL, hypothetical label, required contact detail or internal attribution was deleted. The citation label changes add paragraph 7 while preserving the formerly cited paragraphs.

## 5. Voice and sentence variety

KO maintains 합니다체, JA maintains です・ます, EN uses plain active explanations, and ZH uses Taiwan terminology. The titles identify the overseas-director/board-participation problem and are neither imperative nor clickbait. The comparison table has an actual comparative purpose. The service-section heading is required by the brief rather than an added checklist.

Opening deletion test: in each language the first paragraph supplies the attendance rule/result and the alternatives' scope; the second establishes company form, non-public issuance, board membership, overseas locations, inability to travel and the hypothetical label used by subsequent examples. Removing either paragraph loses that context or the immediate legal answer. The statutory quotation in KO and JA is translated/explained, not left as an unexplained foreign-language block. The redundant drafting-form language in JA/ZH was corrected above.

Compared opening, headings and ending with three recent same-language repository articles. These are local publication-labelled comparators, not a fresh certification of their live deployment:

| Locale | Repository comparator files and publication dates |
|---|---|
| KO | `src/content/columns/628-taiwan-parked-car-collision-external-video-evidence.md`, `627-taiwan-oneway-wrongway-head-on-collision.md`, `626-taiwan-red-signal-straight-stop-line-collision.md` — all 2026-10-15 |
| JA | `src/content/columns-ja/610-taiwan-subsidiary-annual-shareholders-meeting-director-term.md` — 2026-10-15; `609-taiwan-mistaken-bank-transfer-unjust-enrichment.md`, `608-taiwan-false-financial-report-investor-civil-damages.md` — 2026-10-14 |
| EN | `src/content/columns-en/611-taiwan-scooter-outer-lane-left-turn-dashcam.md`, `610-taiwan-subsidiary-annual-shareholders-meeting-director-term.md` — 2026-10-15; `609-taiwan-mistaken-bank-transfer-unjust-enrichment.md` — 2026-10-14 |
| ZH | `src/content/columns-zh/628-taiwan-parked-car-collision-external-video-evidence.md`, `627-taiwan-oneway-wrongway-head-on-collision.md`, `626-taiwan-red-signal-straight-stop-line-collision.md` — all 2026-10-15 |

Root: `/Users/son7/Projects/tseng-law-columns-20261016/`. Extracts and exact paths are in `final-astra-r1-evidence/comparators.json`. C5's overseas-attendance result and route-specific headings differ from the traffic evidence, term-of-office, mistaken-payment and financial-report structures. Its ending requests the actual articles, board list and meeting matters rather than copying those articles' closing facts.

Also compared available C1–C4 openings in each language and the available C6 KO opening. C5 does not use a stock hypothetical first sentence. The broad outcome-first opening family is shared with some C2/C3 versions, so I do not claim perfect batch-wide opening-type uniqueness: that is at most one partially unmet manual item, not the two-item MONOTONY threshold. Later batch versions were not all available; no audit of future openings is claimed. All other manual items pass: at least two genuine very short sentences per language, no word starts three body paragraphs, no consecutive long-sentence run, no three consecutive claim–citation–caveat paragraphs, uncited hypothetical/practical paragraphs present, no excess contrast or invented reader rebuttal, fact-specific ending, and consistent KO/JA register.

The checker counts one quoted-punctuation fragment in JA and an address fragment in EN as short sentences; the manual check excluded those artifacts and still found at least two genuine short sentences in each language. The required KO/JA register-ending WARNs are not FAILs and were not “fixed” by mixing registers.

After the edits, ran the exact supplied lint command and `python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <file>` on every language:

| Language | Lint | Body length | Variety length CV | Short share | Variety FAIL |
|---|---|---:|---:|---:|---:|
| ko | OK | 2,792 characters | 0.452 | 0.092 | 0 |
| ja | OK | 3,344 characters | 0.496 | 0.092 | 0 |
| en | OK | 1,287 words | 0.460 | 0.098 | 0 |
| zh-hant | OK | 2,339 characters | 0.483 | 0.086 | 0 |

MONOTONY: none requiring changes remains. Raw results are in `final-astra-r1-evidence/checks-after-edit.json`; initial results are preserved separately. The length changes are within the batch's required ranges.

## 6. Image

Image verdict: OK. I directly viewed `images/C5.webp` with the image-viewing tool. It shows an empty, neutral meeting/seating area with a round table and four chairs. Empty seats are an appropriate illustrative visual for directors' participation and absence; it is not presented as a photograph of the three-director hypothetical or as evidence of any real meeting. There are no people or faces, legible text, logos, flags, readable documents, identifiable parties or disrespectful elements. It is an unidentifiable illustrative setting; the review does not assert a real venue or verify a generation model. The image file was not edited.

Image SHA-256: `4f028792380c82c5d94c15299dda720e4511cbeb6f3203ab7becdb0ee3adb309`.

## Reviewed final versions

| File | SHA-256 |
|---|---|
| `drafts/C5/ko.md` | `84772b3517ca055bd9c7c84d16598f3eba62bcac1a7ca115b04fe63d8714a508` |
| `drafts/C5/ja.md` | `d3a2a95fd1fd282e3b0099108abc76c20307ba2a187de8e90144e6002135eb32` |
| `drafts/C5/en.md` | `79a8dcfe2853b0558c8c006e38bc64260e7cb92ca2b45503d85473aa88e67b65` |
| `drafts/C5/zh-hant.md` | `5f99e5d1d5d90478419e4fd557a93cda8de890d661c74729d9497a9c2dba70d2` |

These hashes identify the corrected manuscripts covered by this PASS. The writer's facts sheet, research file, other columns and image remain unchanged. There are no required legal-analysis repairs to hand to a fixer.

## Points for lawyer confirmation

- 실제 정관의 대리·서면표결 조항이 허용하는 범위와, 해당 회차의 전원 동의를 확보·기록하는 방식을 확인할 필요가 있습니다.
- 해외 화상참여자의 본인 확인, 접속 중단 시 출석 인정, 의사록에 남길 참여 기록은 실제 회의 방식에 맞춰 확인할 필요가 있습니다.
- 전자우편·전자서명이 위임장이나 서면표결 요건을 충족하는지, 소집·정족수 등 별도 규정을 포함해 결의가 유효한지는 전체 자료로 확인할 필요가 있습니다.

VERDICT: PASS     (all four languages publishable now, image OK)
