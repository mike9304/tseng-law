# Independent Japanese locale review: A-205 and A-212

Review date: 2026-10-11, Taiwan time.

Reviewer: independent AI Japanese editorial reviewer (`review_a_ja`). This reviewer did not author either manuscript and has not edited either manuscript. This is not a claim of review by a human native speaker, attorney, or licensed Japanese practitioner.

Owned output: this report only. The review used the complete Air `RULES.md`, repository `EDITORIAL-VOICE.md`, `FRONTMATTER.md`, `AGENTS.md`, and tseng-law editorial skill and independent review criteria. Current official sources were opened independently. The author's source-ledger files were unavailable during the initial review but were read during the final-version recheck recorded below.

## Decisions and reviewed versions

| Rescue | Article | SHA-256 reviewed | Decision |
|---|---|---|---|
| A-205 → 518 | `src/content/columns-ja/518-taiwan-employment-service-certificate-after-leaving-japanese.md` | `654164a7ab0b4ed2895369dad329a50ac1ed6d8df095475de81d6ad10261bb5a` | PASS |
| A-212 → 522 | `src/content/columns-ja/522-taiwan-civil-court-deposit-service-japanese.md` | `f7abd26a0dab81452ea882c244744ffb328fa83cf58955f53f91cb638a4b2f6e` | PASS |

No unresolved material legal, factual, numerical, or Japanese-language issue was found in these versions. Optional edits below are not conditions of PASS. These decisions cover the manuscripts and their text metadata, not media pixels, rendered pages, tests, final legal review, or shipping. The operator's Claude Code review gate remains required.

## Language, length and scope

518 contains 1,008 narrative characters; 522 contains 1,163. Counting method: exclude frontmatter, the `参照資料` section, H2 headings and line breaks; retain rendered link labels and strip Markdown link URLs. Including headings and paragraph breaks yields 1,063 and 1,225 characters respectively. Both satisfy the assigned 1,000–1,600-character Japanese short-column range without relying on long source URLs.

Both use consistent です・ます prose, concrete actors and restrained explanations. The titles identify the actual documents and dispute. There is no repeated three-part checklist, invented case, purported client experience, human byline, Japanese professional qualification, bold emphasis, or public AI-author footer. Internal `author: "legal-ai-assistant"`, `audience: ["ja"]`, dates, source links and fictional AI-image captions are retained.

518 addresses a Japanese-reading worker seeking proof of a Taiwan employment history. It limits the rule to employment relationships covered by Taiwan's Labor Standards Act and distinguishes a service certificate from an involuntary-separation certificate. It makes no Japanese benefit or Japanese labor-law claim. Its administrative complaint route does not promise an outcome or a service of this firm.

522 addresses a Japanese-reading recipient of Taiwan civil-court documents. It preserves the validity prerequisite, the early actual-receipt exception, different delivery methods, and the difference between document storage and procedural deadlines. Its final paragraph excludes automatic application to criminal or administrative papers. The generic reference to a Taiwan lawyer creates no foreign-licensure or firm-service claim.

## Findings

Material findings: none.

The following are optional fluency improvements. They have not been applied.

| File:line | Exact sentence | Reason and evidence | Proposed rewrite | Legal meaning preserved? |
|---|---|---|---|---|
| `518-taiwan-employment-service-certificate-after-leaving-japanese.md:37` | 会社が発行を拒む、先延ばしにする、記載の修正に応じない場合は、台湾で働いていた地域の労働行政主管機関に相談・申訴できます。 | `申訴` is a Taiwan administrative term but is not familiar standalone Japanese. A short Japanese gloss would make the available action clearer. The named administrative route matches the live MOL guidance. | 会社が発行を拒む、先延ばしにする、記載の修正に応じない場合は、台湾で働いていた地域の労働行政主管機関に相談したり、苦情を申し立てたり（申訴）できます。 | Yes. Same problems, location, authority and optional complaint route; no new entitlement or deadline. |
| `522-taiwan-civil-court-deposit-service-japanese.md:41` | 送達場所や方法に争いがある場合や、対応期限が迫っている場合は、書類一式と日付の記録をもとに台湾の弁護士へ確認する場面です。 | `確認する場面です` is understandable but somewhat abstract. Naming what the consultation concerns makes the restrained next step more concrete. | 送達場所や方法に争いがある場合や、対応期限が迫っている場合は、書類一式と日付の記録を台湾の弁護士に示し、送達の効力と対応期限を相談できます。 | Yes. Same circumstances and records; generic Taiwan-law consultation, without a promised result. |

## Sentence-by-sentence opening deletion tests

The quotations below are the actual rendered sentences from the first two body paragraphs; Markdown link targets are omitted only for readability.

### 518

| Location | Actual sentence | Information lost if deleted | Decision |
|---|---|---|---|
| Paragraph 1, sentence 1, line 19 | 台湾の労働基準法が適用される雇用関係では、退職した労働者が勤務証明書（服務證明書）を求めたとき、雇用主またはその代理人は発行を拒めません（同法第19条）。 | Governing-law scope, claimant, request condition, Taiwan document name, responsible actor and statutory attribution. | Keep. This is the operative rule, not a restatement of the title. The previously separate source-only sentence has been merged without losing its link or the obligation. |
| Paragraph 2, sentence 1, line 21 | 労働部の案内によると、自己都合退職、定年退職、懲戒解雇を含む解雇など、離職の理由を問わず、会社は請求を受けたら速やかに発行する必要があります。 | Coverage across separation reasons, prompt issuance, and attribution to ministry guidance. | Keep. It adds conditions not stated in paragraph 1. |
| Paragraph 2, sentence 2, line 21 | 退職時に請求していなかったことだけで、後日の発行を拒めるわけでもありません。 | Direct clarification that a request can follow departure; prevents the phrase `退職した` being read as a same-day restriction. | Keep. The later five-year discussion supplies additional guidance, not the same proposition. |

Deleting either whole opening paragraph would lose the basic legal rule or the scope of permissible later requests. Neither paragraph is generic introduction.

### 522

| Location | Actual sentence | Information lost if deleted | Decision |
|---|---|---|---|
| Paragraph 1, sentence 1, line 19 | 台湾の民事裁判書類が適法に「寄存送達」された場合、本人がまだ受け取っていなくても、原則として寄存の日から10日を経過すると送達の効力が生じます（民事訴訟法第138条）。 | Civil jurisdiction, lawful-service prerequisite, legal effect without actual receipt, ten-day rule and statutory source. | Keep. Each limitation affects the legal proposition. |
| Paragraph 1, sentence 2, line 19 | ただし、10日以内に文書を受け取ったときは、実際の受取日に効力が生じます（司法院の注意事項第141点）。 | The earlier actual-receipt exception and its distinct official source. | Keep. Deletion would materially overstate the default rule. |
| Paragraph 2, sentence 1, line 21 | 寄存送達は、法律に定める本人への交付や補充送達ができないとき、文書を送達地の自治機関または警察機関に預ける方法です。 | Meaning of the unfamiliar Taiwan term, fallback condition and deposit institution. | Keep. It makes the rule intelligible to a Japanese reader. |
| Paragraph 2, sentence 2, line 21 | 通知書を見つけた日と、文書が預けられた日は同じとは限らないため、通知に記載された寄存日が期限を調べる手掛かりになります。 | Distinction between noticing a notice and deposit, plus the reason for examining its date. | Keep. It addresses the reader's concrete timing error. |

The opening supplies a rule, exception, definition and evidentiary distinction. None is expendable scene-setting.

## Comparison with three recent Japanese columns

The following current repository manuscripts were actually read for their first two paragraphs, headings and ending. Each frontmatter publication date is 2026-10-10. Their live public rendering was not inspected in this locale review.

| Comparator | Actual opening and structure | Comparison with 518 and 522 |
|---|---|---|
| `src/content/columns-ja/508-taiwan-equipment-acceptance-unpaid-balance-japanese.md` | Opens `残金の支払条件が「現地検収の完了」となっている装置取引では` and distinguishes operation from an accrued payment claim. Paragraph 2 uses a clearly framed example of missing test materials. Four issue-specific H2s include `出荷前の合格と、現地で確認する性能`; the ending requests contract, outstanding work and balance information through the contact route. | 518 starts with the employment certificate entitlement; 522 starts with a delivery-effect rule and exception. Neither copies 508's commercial hypothetical, testing sequence or document-submission CTA. Their two substantive H2s each fit a shorter article. |
| `src/content/columns-ja/509-taiwan-customer-data-japan-crm-transfer-japanese.md` | Opens `台湾の営業部門が集めた担当者名、メールアドレス、商談履歴を日本本社のCRMへ移すと` and asks who will use the information. Paragraph 2 distinguishes company-only lists from identifiable people. Five substantive H2s move through entities, purpose, notice, outsourcing and Japan-side rules. The ending separates Taiwan advice from Japan-law verification. | All three pieces define legal scope through concrete facts. 518 does so through the applicable employment relationship; 522 through lawful Taiwan civil service. Neither imports 509's cross-border law or repeats its five-part analysis/contact ending. |
| `src/content/columns-ja/510-taiwan-product-accident-recall-costs-japanese.md` | Opens with a hypothetical kettle-accident report and separates safety action from cost negotiation. Paragraph 2 identifies the product regime and excludes other product categories. Five substantive H2s cover recall, notification, evidence, costs and insurance; the ending separates technical inquiry from legal responsibility. | 518 and 522 likewise preserve necessary boundaries, but do not duplicate the accident setup, rhetorical question sequence or long cost-allocation structure. 518 ends at the administrative route; 522 ends with disputed delivery/timing and the civil-only limit. |

The direct openings, natural variation in sentence length and issue-specific headings are consistent with the same-locale corpus without imposing its length or recurring promotional ending. No mandatory opening deletion or structural rewrite is needed.

## Live legal cross-check

The sources below were independently opened on 2026-10-11. Statutes were read on MOJ; administrative and judicial guidance are identified as such, not promoted to statutory text.

| Article claim | Official source inspected | Result |
|---|---|---|
| 518: request-based duty at the end of an applicable employment relationship | [Labor Standards Act Article 19](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=19) | Current text matches the worker/employer-or-agent/request conditions. It contains no fixed issuance-day count, consistent with line 33. |
| 518: separation reasons, prompt issuance, later request, objective contents, worker's wishes about additional evaluative content, local administrative help | [MOL notice, 2026-02-24](https://www.mol.gov.tw/1607/1632/1633/88229/) | The notice expressly supplies these propositions. The draft attributes them to current MOL guidance. This review did not independently inspect the 1994 interpretation linked by the notice, and makes no such claim. |
| 518: service-certificate purpose differs from involuntary-separation certificate | [MOL FAQ, updated 2026-09-03](https://www.mol.gov.tw/1607/28690/2282/2326/2288/82277/) | Matches line 29. The article does not imply every departing worker qualifies for unemployment benefits. |
| 518: five-year request guidance versus the separate record-retention rule | [MOL service-certificate guidance, updated 2025-09-10](https://www.mol.gov.tw/1607/28162/28296/81778/81796/81939/) and [Article 7](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=7) | The guidance supports refusal being impermissible for a request within five years. Article 7 concerns employment-record retention. Line 35 keeps these separate and does not state a universal five-year extinction period. |
| 522: principal service places, employment-place alternatives, substitute recipient and opposing-party exception | [Civil Procedure Act Article 136](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=136) and [Article 137](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=137) | Lines 25–29 preserve the applicable places, prerequisites and exception. No Japanese service rule has been imported. |
| 522: lawful deposit, two notices, ten days, two months of storage | [Article 138](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=138) | Counts, recipient institutions and notice locations match. Lines 33–35 correctly deny that the storage period is a period for waiting to respond. |
| 522: earlier actual receipt, relocation inquiry, contents of service certificate | [Judicial Yuan, 辦理民事訴訟事件應行注意事項, points 140–142](https://legal.judicial.gov.tw/FLAW/dat02.aspx?lsid=FL001384) | Point 141 expressly gives the ten-day default and actual receipt within that interval. Points 140 and 142 support the relocation and service-record discussion. The page was accessible through link 173 on the [Judicial Yuan civil-procedure page](https://www.judicial.gov.tw/tw/cp-1447-58182-7cb42-1.html) after a direct tool open failed. |
| 522: period calculation follows the Civil Code, without a universal deadline for every document | [Article 161](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=161) | The article avoids inventing a document-specific appeal or response period and does not equate all commencement dates with actual receipt. |

The [Labor Standards Act history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=N0030001) shows the most recent listed amendment as 2024-07-31, concerning Article 54; the reviewed Articles 7 and 19 are not presented as pending amendments. The [Civil Procedure Act history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=B0010001) lists its latest amendment as 2023-11-29; the 2003 amendments including Articles 136 and 138 commenced on 2003-09-01. The Judicial Yuan attention-points page identifies its latest amendment as 2021-12-29. No draft or future-commencement text was used for the reviewed propositions.

## Final-version recheck

The author then froze 518 at `654164a7ab0b4ed2895369dad329a50ac1ed6d8df095475de81d6ad10261bb5a`. The only manuscript change from the previously reviewed `a336a3850e987f45eb88a8c7eee87861c6e7a89f65925c2b6d07914956f2272f` was integration of the source-only sentence in paragraph 1. Replacing that single revised paragraph with the prior paragraph reproduced the exact prior SHA-256, confirming that all other manuscript bytes were unchanged. 522 remained at its originally reviewed hash.

| File:line | Previous wording | Final wording | Reason and legal-meaning check |
|---|---|---|---|
| `518-taiwan-employment-service-certificate-after-leaving-japanese.md:19` | `発行を拒めません。同法第19条が定める義務です。` | `発行を拒めません（同法第19条）。` | Removes a separate attribution sentence while retaining the exact MOJ link and refusal prohibition. Article 19 was reopened during this recheck. The coverage, request trigger, responsible actor and mandatory strength are unchanged. Meaning preserved; not a substantive correction. |

The final opening deletion table above now evaluates three actual sentences for 518. Its body count was remeasured at 1,008 characters. PASS is reaffirmed for the latest hash; no new material issue was introduced.

The completed author records at `/Users/son7/tseng-air-1011/lanes/columns/work/A-205.md` and `A-212.md` were read during this recheck. Their recorded manuscript hashes and body counts match the current files. Their current-law quotations and claim mappings agree with the independent official-source checks above. Both explicitly distinguish author self-check from independent review and disclose the 1994 interpretation/access limitations. This verifies consistency of the ledgers' legal/source statements, not every historical action or media inspection described by the author.

## Evidence limits and bounded next step

This is a manuscript locale review with targeted legal cross-checks. It is not a human lawyer's opinion or a final publication authorization. No case or judgment is cited by either article, so there is no case-number or invented-fact issue to resolve.

The live MOJ pages displayed a consolidation cutoff of 2026-10-02. This report records what the official pages displayed on the review date; it does not claim to have audited every subsequent government announcement. The 1994 labor interpretation was not independently retrieved; the current accessible MOL notice is the actual basis for the contents discussion.

The author records are now present and consistent with this legal/locale review as recorded above. Media-image accuracy, registry tests, desktop/mobile rendering and current public URLs were outside this assigned review.

Next bounded step: preserve these manuscript versions or submit any changed passages and new hashes for a targeted recheck; complete the independent final/legal review, followed by the lane's test and Claude Code shipping gate. Neither optional fluency edit requires a broad rewrite.
