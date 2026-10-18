# C6 final review — round 1

Verdict: PASS after the bounded repairs recorded below. No unresolved MAJOR legal/factual finding, hard-rule failure, or MONOTONY failure remains. All four reviewed manuscripts and the image are publishable in the versions identified at the end of this log.

Review date: 2026-10-16. Role: independent final reviewer. I did not author the incoming manuscripts. I applied only the expressly permitted source-known alignment, wording and structural repairs; this is not a claim of human native-speaker or lawyer review.

## Scope checked

- Read fully: `brief-BATCH.md`, `brief-EDITORIAL-VOICE.md`, `COLUMN-VOICE-RULE.md`, `topics/C6.md`, `drafts/C6/ko.md`, `ja.md`, `en.md`, `zh-hant.md`, `drafts/C6/facts.md`, and `research/C6-statutes.md`.
- Read the sentence-variety rule, including sections 5–6, the current `LESSONS.md`, `topics/LINKS.md`, and `reviews/C6/voice-sol.md`. The repository editorial-voice copy was compared with the supplied brief: the latter additionally includes the sentence-variety instruction. The supplied, stricter brief was applied.
- Independently opened the official Article 15 and Article 16 pages and the whole Act. Also fetched them with `curl`, together with the official amendment history and English full-text page. All curl fetches succeeded; the Chinese article/full-text/history responses returned HTTP 200. The writer's fact sheet was checked against these texts, not treated as authority.
- Read all 51 lines of the research file, including context-only Articles 11, 13, 50 and 59. The manuscripts cite only Articles 15 and 16. No judgment, agency guidance, foreign-law proposition, processing time, fee, statistical claim or other external factual source is cited, so there is no cited judgment text or additional agency page to audit.
- Checked the two related-column links in each language against the actual files in `/Users/son7/Projects/tseng-law-columns-20261016/src/content/columns{,-ja,-en,-zh}`. Examined available C1–C8 openings and three recent same-language comparator articles, identified below.
- Viewed `images/C6.webp` directly with the image-viewing tool; checked its generation record in `logs/codex-images.log`.
- Scope is the four C6 manuscripts and their hero image. This review performed no publication or deployment operation.

## Findings and applied repairs

### E1 — ja: employer-notice condition omitted in the body (MAJOR on intake; resolved)

Original (`ja.md:62`): 「第16条第2項によれば、その労働者は次の仕事を探すため、勤務時間中に休暇を取って外出できます。」 The preceding sentence referred broadly to employer termination.

→ Problem & reason: 「その労働者」 could include workers whose employer terminates without advance notice. Article 16(2) expressly starts 「勞工於接到前項預告後」. The Japanese FAQ already preserved receipt of employer notice, and the other three bodies did too. [Official Article 16](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=16).

→ Fix applied: replaced 「その労働者は」 with 「雇用主から第1項に基づく予告を受けた労働者は、」. This restores the omitted condition directly from the existing research source and aligns the body with the correct FAQ and other versions. No new legal research or alternative interpretation was needed.

→ Facts preserved: job-search purpose, working-hours leave, the weekly cap of two days' working time, continued wages, the employer's separate Article 16(3) obligation, and both paragraph-specific links. This is a legal-precision correction, not merely a stylistic synonym change.

### E2 — ko: redundant, uncited statutory comparison in the second paragraph (resolved)

Original (`ko.md:28`): 「법정 기간과 회사가 요구하는 기간이 다릅니다.」

→ Problem & reason: the preceding paragraph already supplies both the hypothetical two-month demand and the sourced statutory 20-day period. Deleting this sentence loses no information; retaining it separately also repeats a statutory comparison without its own inline source.

→ Fix applied: deleted that sentence. The paragraph now begins 「직원은 두 달 전 예고 조항이 근로계약서에도 있는지 확인해야 합니다.」

→ Facts preserved: the two-month clause, 20-day statutory period, indefinite-contract condition, service bracket and Article 15/16 links remain in the preceding paragraph; the practical contract-document check remains here.

### E3 — zh-hant: unnecessary fictional party nickname (resolved)

Original (`zh-hant.md:26,48,52,68`): 「小陳」, including 「小陳算出的法定期間卻是十日。」 and 「公司的一個月規定是否拘束小陳」.

→ Problem & reason: the example is expressly fictional and does not identify a real person. Nevertheless, a party nickname is unnecessary under the user's unqualified no-private-party-names instruction.

→ Fix applied: replaced every occurrence with 「員工」、「這名員工」 or 「他」 as the sentence required. No new name was introduced.

→ Facts preserved: November 2025 start, October 2026 proposed departure, approximately eleven months' continuous service, indefinite contract, ten-day bracket, one-month company demand, intended next-month start elsewhere, all citations and 「虛構情境」.

### E4 — ko: repeated document request in the contact paragraph (resolved)

Original (`ko.md:74`): 「계약서와 입사일 자료를 갖춰 … 보내 주시면」 followed by 「입사일 자료와 두 달 조항이 적힌 문서를 함께 보내 주십시오.」

→ Problem & reason: the same paragraph asks twice for start-date documents and adds the vague phrase 「검토 방향을 함께 정할 수 있습니다」.

→ Fix applied: the first sentence now offers consultation on the resignation-notice period; the final sentence makes one complete request for the employment contract, start-date records and two-month clause.

→ Facts preserved: firm name, email, the exact required Taipei address, consultation scope, all requested documents and the column-specific ending. No outcome is promised.

### E5 — ja: repeated document request in the contact paragraph (resolved)

Original (`ja.md:76`): 「労働契約書と入社日の資料をお手元にそろえて … ご連絡ください」 followed by 「入社日がわかる資料と『3か月前』と書かれた条項をあわせてお送りください」.

→ Problem & reason: the initial and final sentences duplicate the start-date document request.

→ Fix applied: the first sentence now offers an email inquiry about the notice period; the final sentence lists the employment contract, start-date evidence and three-month clause once.

→ Facts preserved: the firm, email, exact Japanese address, three-month company clause, documents and polite register. No additional service or legal result is claimed.

### E6 — zh-hant: repeated document request in the contact paragraph (resolved)

Original (`zh-hant.md:74`): 「可以把勞動契約和到職日資料寄到 …」 followed by 「請一併附上到職日期的資料，以及公司所說的一個月條款」.

→ Problem & reason: start-date evidence is requested twice in a short paragraph.

→ Fix applied: the first sentence now identifies resignation-notice questions as the reason to email; the final sentence requests the employment contract, start-date evidence and one-month clause together.

→ Facts preserved: the firm, email, exact Traditional Chinese address, all documents, the one-month company clause and the restrained consultation invitation.

### E7 — en: consecutive rule-and-caveat endings (resolved)

MONOTONY: consecutive claim–citation–caveat rhythm — “It imports the periods, not every rule that follows them in Article 16”; “HR's 60-day request raises a separate question about the offer letter”; “The two articles do not specify the precise measuring moment at a boundary” — move the existing offer-letter sentence to the beginning of the example paragraph so that the example ends with the supported ten-day requirement.

Original (`en.md:48`): the example gives the first bracket and ten-day duty with citations, then ends with “HR's 60-day request raises a separate question about the offer letter.”

→ Problem & reason: read with paragraphs 46 and 50, this repeats the same rule-then-limitation shape. The automatic metrics passed, but the manual rhythm check warranted a small structural repair.

→ Fix applied: moved that exact HR sentence to the beginning of paragraph 48. All three existing sentences remain verbatim.

→ Facts preserved: every word, number, citation, assumed-facts qualifier, indefinite-contract condition, ten-day duty and 60-day contractual question. No content was deleted to obtain a variety pass.

## Edits applied

1. `ja.md:62`: restored receipt of the employer's Article 16(1) notice as the condition for Article 16(2) leave.
2. `ko.md:28`: removed one duplicate statutory-comparison sentence.
3. `zh-hant.md:26,48,52,68`: replaced the fictional nickname throughout with neutral references.
4. `ko.md:74`: consolidated the document request and made the consultation subject explicit.
5. `ja.md:76`: consolidated the document request and made the consultation subject explicit.
6. `zh-hant.md:74`: consolidated the document request and made the consultation subject explicit.
7. `en.md:48`: reordered existing sentences to break the repeated caveat-ending pattern.

No frontmatter, table, statute URL, internal link, hypothetical label, date, notice period, service threshold, image or source list was changed. URL multisets match the incoming manuscripts in all four languages. No numeral token was removed; Japanese gained one “1” solely in the restored paragraph-1 condition.

## Law and facts — four-language result

| Point audited | Result in ko / ja / en / zh-hant |
|---|---|
| Article 15(2): employee terminating an indefinite contract | All retain the employee, indefinite-contract condition, mandatory advance notice to the employer, and incorporation of Article 16(1)'s periods. 「應」 is not weakened into an optional recommendation. |
| Article 16(1)(1) | All state continuous service of at least three months but less than one year: ten days' advance notice. |
| Article 16(1)(2) | All state at least one year but less than three years: twenty days' advance notice. |
| Article 16(1)(3) | All state three years or more: thirty days' advance notice. |
| Under three months | All identify the missing bracket; none invents a notice period or declares that notice is unnecessary. |
| Article 16(1)'s employer-termination opening | All explain that the employee route reaches the periods through Article 15(2). No dismissal rule from Articles 11/13 is stated. |
| Article 15(1) boundary | All retain specific-work fixed-term contract, term exceeding three years, termination after three years, permission to terminate, and mandatory thirty-day notice. None generalizes it to all fixed-term contracts. |
| Article 16(2) | After E1, all retain receipt of employer notice, job-search purpose, leave during working hours, weekly cap of two days' working time and continued wages. None transfers that benefit automatically through Article 15(2). |
| Article 16(3) | All place the notice-period wage obligation on the employer terminating without the paragraph-1 notice. None turns it into an automatic employee debt. |
| Longer contractual notice / employee short notice | All leave enforceability and any damages claim for separate assessment. None declares the clause valid or void, promises freedom from liability, or invents an employer-consent requirement. |
| Records and dates | Email, submission records, acknowledgment and contract/payroll comparison are practical recommendations. The manuscripts do not invent a statutory written-form requirement, a calendar-versus-working-day rule, a threshold measuring date or a deemed receipt rule. |
| Out-of-scope law | Severance, minimum-service clauses, work permits and residence receive only a separation sentence with related links. No rule is stated for pension, insurance, deductions, noncompetes, immediate employee termination, maternity or occupational injury. |

The statutory passages were checked against [Article 15](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=15) and [Article 16](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=16). No inter-language contradiction remains.

Hypothetical arithmetic is consistent: ko, summer 2024 to October 2026, a little over two years → twenty days; ja, April 2022 to October 2026, approximately four and a half years → thirty days; en, February to mid-October 2026, approximately eight months → ten days; zh-hant, November 2025 to October 2026, approximately eleven months → ten days on the stated assumptions. The Traditional Chinese version expressly calls for checking dates near the one-year boundary. None supplies an unsupported exact final working day.

The whole-Act header reads 「修正日期：民國 113 年 07 月 31 日」, correctly rendered as July 31, 2024 only in the source lists. The [official history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=N0030001) identifies the latest amendment as concerning Article 54; the drafts do not mislabel it as an Article 15/16 amendment or effective date. Each source list separately records the 2026-10-16 check date. The [official English text](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=N0030001) confirms the name “Labor Standards Act.”

## Citations, metadata and hard rules

- All body paragraphs that state a legal rule, period or statutory proposition now contain an inline official link. Table rows and legal FAQ answers carry the correct Article 15/16 links. Practical record-gathering and fictional-scene paragraphs are not presented as independent statutory duties. Metadata summaries are checked against the sourced body; English retains the required plain, URL-free summary.
- All cited articles are present in `research/C6-statutes.md`. Source lists include both single-article pages and the full-text page actually cited. No invented judgment, private case, secondary authority or foreign-law rule appears.
- Both internal links exist in each corresponding locale: `009-taiwan-voluntary-resignation-severance.md` and `014-taiwan-mandatory-employment-period.md`. No C1–C8 draft is linked. These are repository-existence checks, not a claim that publication URLs were newly deployed.
- All four frontmatter blocks have the required keys, `topic: "labor"`, correct locale category and audience, `author: "legal-ai-assistant"`, three FAQs, the 2026-10-16 publication/lastmod/display dates and the literal `NNN` image path. Read times are reasonable for the resulting lengths.
- English title: 67 characters; with “ | Hovering Law”: 82. Its distinct 41-character `seoTitle` is therefore required and valid. English summary: 159 characters, with no forbidden punctuation or URL.
- No bold, phone/hotline number, LINE/Kakao ID, private-party name, attorney byline, lawyer-review claim or native-review claim remains. All four hypothetical labels remain visible.
- Each final pre-sources section identifies concrete retainable tasks: contract/service-date review, bracket identification, drafting a clear effective-date notice, negotiation about the leaving date and a response to a threatened contract claim. There is no promised legal outcome.
- Each contact paragraph contains the required firm name, `wei@hoveringlaw.com.tw`, and the exact locale-specific address in brief rule 5. English includes the exact phrase “English-speaking lawyer in Taipei.” Each ending returns to the relevant contract clause and service records.

## Previous cross-review reconciliation

This is the first final-review round; there is no earlier Astra final log or final-review resolution table to re-audit. The available `voice-sol.md` was nevertheless reconciled with the current files:

- ko: employer-payment wording/link, indefinite-contract conditions in FAQs, direct Article 15/16 citations and separate whole-law amendment date are present.
- ja: the FAQ conditions, paragraph-3 payment citation and source-date formatting are present. Its body still omitted the employer-notice receipt condition despite the general alignment statement; E1 corrects that specific remaining defect.
- en: mandatory notice wording in the summary, sourced example, employer-payment condition, FAQ scope and whole-law date are present.
- zh-hant: the former 「一年以下」 problem is corrected to 「三個月以上、一年未滿」; paragraph-3 obligation and citation, FAQ conditions and whole-law date are present.

## Voice and sentence-variety review

The openings supply concrete information: ko establishes the two-month demand and twenty-day statutory bracket; ja juxtaposes the three-month work-rule demand with the employee's dates and thirty-day bracket; en supplies the sixty-day offer-letter clause and eight-month service example; zh-hant opens with the one-month versus ten-day discrepancy and immediately labels the example fictional. The title and headings stay specific to contract type, service, notice records and the disputed longer clause.

First-two-paragraph deletion test: the dates, contract assumptions, company demands and statutory results cannot be removed without losing the examples' basis. The Korean second paragraph's first sentence added no information and was removed in E2. The remaining contract-location questions/recommendations provide a concrete next step. No stock “Suppose / 가령 / 例えば…とします / 假設” opening remains.

Compared openings, headings and endings with these recent repository articles:

| Locale | Comparator files and publication dates |
|---|---|
| ko | `src/content/columns/628-taiwan-parked-car-collision-external-video-evidence.md`, `627-taiwan-oneway-wrongway-head-on-collision.md`, `626-taiwan-red-signal-straight-stop-line-collision.md` — all 2026-10-15 |
| ja | `src/content/columns-ja/610-taiwan-subsidiary-annual-shareholders-meeting-director-term.md` — 2026-10-15; `609-taiwan-mistaken-bank-transfer-unjust-enrichment.md` and `608-taiwan-false-financial-report-investor-civil-damages.md` — 2026-10-14 |
| en | `src/content/columns-en/611-taiwan-scooter-outer-lane-left-turn-dashcam.md` and `610-taiwan-subsidiary-annual-shareholders-meeting-director-term.md` — 2026-10-15; `609-taiwan-mistaken-bank-transfer-unjust-enrichment.md` — 2026-10-14 |
| zh-hant | `src/content/columns-zh/628-taiwan-parked-car-collision-external-video-evidence.md`, `627-taiwan-oneway-wrongway-head-on-collision.md`, `626-taiwan-red-signal-straight-stop-line-collision.md` — all 2026-10-15 |

C6 does not copy those headings or endings. English 609 also uses an American in Taipei, but its mistaken-payment facts, evidence question and ending differ from this notice dispute. The available batch openings use questions, statutory quotations, numerical/rule openings and labelled scenes; C6's employer-demand discrepancy is distinct from the investment-account and lease scenes. Generic scene-category reuse exists, but there is no repeated stock opener, and scene openings remain within the stated one-third batch limit among the available drafts. No missing future draft is certified by this comparison.

Manual checks after repairs: each language has at least two very short sentences; no word opens three body paragraphs; no three consecutive claim–citation–caveat paragraphs remain; each has a non-rule paragraph without a citation; no unsupported rhetorical rebuttal or excessive contrast template remains; endings concern the actual clause and records, without a copied disclaimer. Korean remains 합니다체 and Japanese remains です・ます. Traditional Chinese uses Taiwan terms; English is plain and active. The scope limitations are necessary to distinguish employee notice from employer termination and are not invented objections.

Very short sentence examples: ko 「계약 종류가 먼저입니다.」「근속기간도 봅니다.」; ja 「日時が手掛かりになります。」「文書の確認が先です。」; en “State the proposed effective date.” / “Keep any acknowledgment.”; zh-hant 「日期會影響級距。」「表上沒有這一級。」. The absence of body questions in ko/ja/en is acceptable here: their concrete demand/period examples and FAQ questions already establish the reader's decision.

## Executed verification

Ran the following for each language after its last edit:

```text
python3 /Users/son7/tseng-col-1016-work/lint.py /Users/son7/tseng-col-1016-work/drafts/C6/<lang>.md <lang> taiwan-employee-resignation-notice-indefinite-contract
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-col-1016-work/drafts/C6/<lang>.md
```

| Language | lint result / body length | Variety: sentences; CV; short fraction; similar-length triples; contrast | Result |
|---|---|---|---|
| ko | OK / 2,570 characters | 59; 0.459; 0.119; 0.053; 0 | Exit 0, zero FAIL; advisory warning: 76% “니다.” endings |
| ja | OK / 3,089 characters | 67; 0.460; 0.134; 0.015; 1 | Exit 0, zero FAIL; advisory warning: 82% desu-masu endings |
| en | OK / 1,123 words | 60; 0.475; 0.150; 0.086; 2 | Exit 0, “OK — no variety limit violated” |
| zh-hant | OK / 1,952 characters | 51; 0.517; 0.118; 0.061; 1 | Exit 0, “OK — no variety limit violated” |

The Korean/Japanese warnings concern expected polite-register endings, not register mixing or failed thresholds. They do not justify switching registers. No unresolved MONOTONY finding remains. Citation, numeral, condition and hypothetical-label preservation was checked against copies of the incoming files after the repairs.

## Image verdict

OK — viewed `images/C6.webp` at 1280 × 720. It shows plain navy work jackets, an empty workshop doorway, natural light and an unoccupied stool. The open workplace threshold fits a planned departure from employment. No person, identifiable face, readable document/screen, text, logo, flag or emblem is visible. The scene is calm and respectful.

The C6 prompt and generated-image copy record in `logs/codex-images.log` identify it as a fictional generated workplace scene. It is not presented as a real employer, employee or incident. The image was not edited.

## Points for lawyer confirmation

1. 실제 계약이 법적으로 불정기계약에 해당하는지, 재입사·관계회사 이동을 계속근무기간에 어떻게 반영하는지 확인해야 합니다.
2. 3개월·1년·3년 경계에서의 근속 산정시점과 예고일수 계산·통지 도달시점은 대만 실무를 확인해야 합니다.
3. 3개월 미만 근무자의 예고, 더 긴 계약상 예고조항의 효력, 예고 부족에 따른 책임은 현행 행정해석과 판례를 별도로 확인해야 합니다.

These are deliberately unresolved case-specific questions identified by the column, not outstanding publication defects or a suggestion that a lawyer has already reviewed it.

## Reviewed final versions

| File | SHA-256 |
|---|---|
| `drafts/C6/ko.md` | `16110a9b02f55636e4d89ae24c38da51d20723699c49a7c6439cb572a10e55e5` |
| `drafts/C6/ja.md` | `43c1cb4da8c119b93a02444b05f6ea160c24bb634329754513c59bffbeedc58d` |
| `drafts/C6/en.md` | `2be72fcd00f78120aaca2c361ec99edb76144ae54dbecaf1192075ec9aed8b8b` |
| `drafts/C6/zh-hant.md` | `2723a8860931a2fd3478d138f631c3d6eba4f133e41285e4a11bc24609cc3861` |
| `images/C6.webp` | `42b6ef176bb9fb39a40114e1b946fd555a5cc827c1c1a95bd78651fa5a5a6380` |

VERDICT: PASS     (all four languages publishable now, image OK)
