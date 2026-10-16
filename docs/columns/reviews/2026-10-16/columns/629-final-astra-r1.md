# C3 final review — Astra r1

Verdict: PASS after the bounded edits recorded below. No unresolved major legal/factual issue or uncorrected C3 hard-rule failure remains. Image: OK.

Review date: 2026-10-16. Reviewer role: independent final reviewer, Astra r1 assignment. I did not write these columns or the preceding voice review. I made only the source-supported, meaning-preserving repairs listed here. This is the first final-review round; there was no earlier final-review verdict or fixer resolution table to reconcile.

## Scope checked

Read in full:

- `brief-BATCH.md`, `brief-EDITORIAL-VOICE.md`, `COLUMN-VOICE-RULE.md`, and `topics/C3.md`, including its out-of-scope list.
- `drafts/C3/ko.md`, `ja.md`, `en.md`, `zh-hant.md`, and the writer's `facts.md`.
- `research/C3-statutes.md`, `reviews/C3/voice-sol.md`, `topics/LINKS.md`, and `lint.py`.
- `/Users/son7/tseng-lanes-shared/SENTENCE-VARIETY-RULE.md`, including sections 5–6; the recurring issues in `LESSONS.md`; the final-review criteria in the `tseng-law-editorial` skill.

The pointer in `COLUMN-VOICE-RULE.md` to `/Users/son7/agent-library/knowledge/editorial-voice.md` does not resolve on this machine. The complete supplied `brief-EDITORIAL-VOICE.md` was available and was applied. The retired Fable workflow was not reinstated.

For each language, checked law/facts first, then citations, hard rules/frontmatter, prose/variety, and image suitability. Reviewed the complete title, SEO title, summary, all three FAQs, every body paragraph, the consultation section, and the sources list. Re-read the changed passages and compared them with the pre-review copies. Exact changes are preserved in `final-astra-r1-ko.diff`, `final-astra-r1-ja.diff`, `final-astra-r1-en.diff`, and `final-astra-r1-zh-hant.diff` in this directory.

No judgment is cited, so there was no cited judgment text or holding to verify. There are no foreign-law propositions, real client stories, private-party names, actual-case amounts, statutory fee claims, court schedules, or filing-time promises. The two-year leases are expressly fictional in all four versions; there is no arithmetic example to calculate.

## Official-source verification

Opened the following official pages with `curl --fail --location --silent --show-error --max-time 35`; all seven returned HTTP 200 and substantive law pages. Also opened the three Chinese single-article pages through the web tool. The downloaded HTML was read, not merely status-checked.

| Official source | Verification and result |
| --- | --- |
| [公證法第13條](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010010&flno=13) | Compared all three paragraphs and all four items with every locale. Parties' request, notary-made deed, listed legal act, and express direct-enforcement provision are cumulative. Item 1 requires a fixed quantity. Item 3 concerns a leased/borrowed building or work with a fixed term and return due at its expiry. Paragraph 2 retains the post-deed succession, relevant legal act, and possession-for-a-party/successor limitations. Paragraph 3 retains both the necessary-circumstances discretionary stay and the security-offer mandatory direction to fix security and order a stay. |
| [強制執行法第4條](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010004&flno=4) | Paragraph 1 items 1 and 4 distinguish a final judgment from an independently enforceable notarial deed. Paragraph 2's condition/time/security alternatives and their corresponding prerequisites are stated in every body. The FAQs address the applicable time prerequisite. Paragraph 3 was also read: no version says that the arrival of a date displaces any other applicable prerequisite. Counter-performance and deposit settlement are not analyzed in this narrowly scoped column. |
| [強制執行法第1條](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010004&flno=1) | The district courts' and branches' civil enforcement divisions handle civil compulsory enforcement. Fairness, reasonableness, relevant parties' rights, appropriate methods, and the necessary limit are preserved as mandatory limits, not suggestions. No version authorizes the landlord to execute an eviction personally. |
| [公證法 current Chinese full text](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=B0010010) | Whole-law amendment header: 民國108年04月03日 = 2019-04-03. Matches all four sources lists. No article-specific amendment or commencement date is falsely inferred from that header. |
| [強制執行法 current Chinese full text](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=B0010004) | Whole-law amendment header: 民國108年05月29日 = 2019-05-29. Matches all four sources lists. |
| [The Notary Act, official English translation](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=B0010010) | Verified the official English name and Article 13. The English page's amendment header is 2009-12-30, unlike the current Chinese whole-law header. The columns correctly label it as a wording-comparison source, not the controlling current Chinese version. Used the Chinese text to resolve translation weaknesses, including 得 versus the English opening's “shall” and the paragraph 2 successor/possessor wording. |
| [The Compulsory Enforcement Act, official English translation](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=B0010004) | Verified the official English name, 2019-05-29 header, and Articles 1 and 4. “Final, conclusive judgment” in the column preserves 確定之終局判決. |

Programmatic whitespace-normalized comparison of the downloaded Chinese full text against the research file returned:

```text
OFFICIAL_TEXT_MATCH B0010010 13 True
OFFICIAL_TEXT_MATCH B0010004 1 True
OFFICIAL_TEXT_MATCH B0010004 4 True
```

The repair-cost discussion remains limited to an unquantified future bill; it does not declare all future payments unenforceable. The statute does not supply a list of successful objections, and the columns do not invent one. A lawsuit is not described as an automatic stay. The statutory distinction between 得 and 應 is intact in ko, ja, en, and zh-hant.

The prior `voice-sol.md` legal repairs are present: all three Article 4(2) alternatives, no invented requirement for a calendar date or numerals alone, no assumption that rent arrears automatically fix the amount, and no expansion of successors/possessors to every occupant. These were independently checked against the official text rather than accepted from the review or fact sheet.

## Issues and repairs

### E1 — Summary completeness, all four languages — applied

Original → ko ends with “소를 제기할 수 있습니다”; ja with “訴えを起こすことができます”; zh-hant with “提起訴訟”. The English summary ends “with no judgment” and mentions neither challenges nor stays.

Problem & reason → The topic brief expressly includes the contest/stay route among the limits to preserve in summaries. The full bodies and FAQ 3 already state it correctly. The English character limit makes an abbreviated assertion of sufficient legal conditions especially prone to losing a qualification.

Fix → At `ko.md:4`, added “집행정지는 같은 조 제3항의 요건에 따른 법원 명령이 필요합니다.” At `ja.md:4`, added “執行停止には、同条第3項に基づく裁判所の命令が必要です。” At `zh-hant.md:4`, added “停止執行仍須法院依第3項作成命令。” At `en.md:4`, replaced the compressed entitlement statement with the following 155-character description of the subject:

> Taiwan's notarized lease deeds: conditions for enforcing fixed sums and return at term expiry, who is bound, and court challenges and stays of enforcement.

Facts preserved → The three non-English summaries retain the cumulative deed/category/wording conditions, fixed term, expiry return, fixed quantity, and persons entitled to contest. The English summary now describes the issues rather than purporting to give an exhaustive sufficiency test, as allowed by brief precision rule D. The full conditions and discretionary/mandatory stay distinction remain unchanged in its body and FAQ. No automatic stay is promised. Source: [公證法第13條第1項、第3項](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010010&flno=13).

### E2 — Ambiguous item reference in FAQ 2, all four languages — applied

Original → “제1호에 따른”, “第1号による”, “under item 1”, and “依第1款” follow a reference to Compulsory Enforcement Act Article 4(2).

Problem & reason → The intended payment category is Notary Act Article 13(1)(1). An unqualified “item 1” immediately after switching statutes can be read as Article 4(1)(1), which instead concerns a final judgment.

Fix → At line 17 of each language file, expanded the reference to the full Notary Act Article 13(1)(1) citation and linked it directly to the already-researched [correct article](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010010&flno=13).

Facts preserved → Fixed quantity, coverage of that payment by the deed's enforcement wording, and arrival of the payment date all remain. This resolves citation identity without changing the legal answer.

### E3 — English court-enforcement sentence needed its matching source — applied

Original → `en.md:37`: “Enforcement still takes place through the court.”

Problem & reason → That paragraph cited Article 13 and Article 4, while the provision assigning enforcement to the court's civil enforcement divisions is Article 1. The later correctly cited explanation did not supply a claim-adjacent link for this sentence.

Fix → Added the existing [Compulsory Enforcement Act Article 1(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010004&flno=1) link immediately after the sentence.

Facts preserved → Same institution and same legal proposition; no filing procedure or new legal rule added.

### E4 — English generic lead-in and imprecise heading — applied

Original → `en.md:27`: “That clause has a defined reach.” At line 29: “Only a notary's deed carries the clause”.

Problem & reason → The first sentence adds no condition or useful context before the actual rule. The heading confuses carrying the text of a clause with having its statutory enforcement effect; the next paragraph expressly says an ordinary lease can contain the same sentence.

Fix → Deleted only the generic lead-in; changed the heading to “The deed and its enforcement wording”.

Facts preserved → All three statutory requirements and the private-lease distinction remain in the linked paragraph. No source, hypothetical label, number, or exception was removed.

### E5 — Duplicate English out-of-scope referral — applied

Original → `en.md:43`: “Leaving early raises its own questions, discussed in [Leaving a One-Year Taiwan Lease Before the Term Ends]…”; the monetary section already had another referral to that same column together with the deposit column.

Problem & reason → The topic brief allows one adjacent-regime sentence. Two referrals repeated the early-exit topic without adding information.

Fix → Removed the first referral. Retained the combined early-termination/deposit sentence and both distinct internal URLs in the monetary section.

Facts preserved → The legal distinction between expiry return and early termination, its official citation, and both related articles remain. No rule from either adjacent regime is added or lost.

### E6 — Japanese repetition and narrative tense — applied

Original → `ja.md:31`: “当事者の請求で公証人が作成する公証書について、第13条第1項の柱書は、当事者が公証人に請求し…”; at line 27, “借りることになりました” followed by “言われます（架空の例です）”.

Problem & reason → The statutory sentence twice introduces the parties' request to the notary before reaching the rule. The completed fictional conversation changes tense unnecessarily.

Fix → The statutory sentence now starts “第13条第1項の柱書は、当事者の請求により公証人が同項各号の法律行為について作成した公証書に…” and proceeds directly to the express enforcement wording. Changed “言われます” to “言われました”.

Facts preserved → Requesting parties, the notary as maker, listed legal acts, express enforcement statement, permissive enforcement effect, Article 13 link, two-year period, and “架空の例です” all remain. The narration remains です・ます.

### E7 — Japanese fixed-term terminology in FAQ 2 — applied

Original → `ja.md:16`: “公証した定期の賃貸借”.

Problem & reason → For Japanese readers, “定期の賃貸借” is less precise than the body and can unnecessarily suggest a Japanese-law tenancy category. The column addresses the Taiwan statute's fixed term, not a Japanese statutory classification.

Fix → Changed to “期間の定めのある賃貸借を公証した場合”.

Facts preserved → Same Taiwan lease, notarization, arrears question, and expiry limitation. No foreign-law proposition added.

### E8 — Contact paragraphs ending on a generic address sentence — applied

Original → ko: “사무소는 臺北市大同區承德路一段35號7樓之2에 있습니다.”; ja: “事務所は台北市大同区承徳路一段35号7F-2にあります。”; en: “The office is at 7F-2, No. 35, Sec. 1, Chengde Rd., Datong Dist., Taipei City 103, Taiwan.”; zh-hant: “事務所地址是臺北市大同區承德路一段35號7樓之2。”

Problem & reason → The required contacts were correct, but all four final paragraphs ended on the same address formula rather than this column's documents. This was one unmet manual closing item, not a checker FAIL or a two-item monotony failure.

Fix → Put the firm and unchanged exact address first. End the short consultation paragraph with the actual lease, draft notarial deed, and any enforcement papers the reader has received:

- ko, line 65: “wei@hoveringlaw.com.tw로 상담을 문의하실 때 임대차계약서와 공정증서 초안, 이미 받은 집행 관련 서류를 함께 보내 주셔도 됩니다.”
- ja, line 69: “公証書についてのご相談は、wei@hoveringlaw.com.twへ、賃貸借契約書と公証書の草案、すでに届いている執行関係の書類を添えてお寄せいただけます。”
- en, line 69: “To consult an English-speaking lawyer in Taipei, you can email [wei@hoveringlaw.com.tw](mailto:wei@hoveringlaw.com.tw) with the lease, draft deed and any enforcement papers.”
- zh-hant, line 69: “若想就公證書諮詢，可寄信至 wei@hoveringlaw.com.tw，附上租約、公證書草稿，以及已收到的執行相關文件。”

Facts preserved → Exact required firm names, email, all four exact address forms, and “English-speaking lawyer in Taipei” remain. Sending the papers is phrased as optional consultation preparation, not a new legal filing requirement. No outcome, response time, or possession guarantee was added.

## Applied-edit inventory

- `ko.md`: summary stay qualification; FAQ 2 fully qualified citation; document-specific contact ending.
- `ja.md`: summary stay qualification; FAQ 2 fixed-term wording and fully qualified citation; fictional conversation tense; removal of the statutory sentence's duplicated opening; document-specific contact ending.
- `en.md`: 155-character scope summary; FAQ 2 fully qualified citation; deletion of the generic second-paragraph lead-in; precise first heading; Article 1(1) link for court enforcement; removal of the duplicate early-exit referral; document-specific contact ending.
- `zh-hant.md`: summary stay qualification; FAQ 2 fully qualified citation; document-specific contact ending.

No legal analysis needed new research or a substantive rewrite. The research file and writer's fact sheet were not altered. All original distinct official source URLs remain; official-link occurrences increased from 28 to 29 in ko, 28 to 29 in ja, 27 to 29 in en, and 28 to 29 in zh-hant. The removed English internal link was a duplicate; that target remains linked once.

## Language, citation, and hard-rule results

| Check | ko | ja | en | zh-hant |
| --- | --- | --- | --- | --- |
| Same legal core, conditions, parties, dates, may/must | PASS | PASS | PASS | PASS |
| Body rule paragraphs and FAQ answers carry matching inline sources | PASS | PASS | PASS | PASS |
| Every cited article appears in C3 research | PASS | PASS | PASS | PASS |
| All used official URLs listed; check date 2026-10-16 | PASS | PASS | PASS | PASS |
| Existing same-language internal targets | 2 | 1 | 2 | 2 |
| Scope and adjacent-regime limit | PASS | PASS | PASS | PASS |
| Title, frontmatter, exact contact, lawyer-retention tasks | PASS | PASS | PASS | PASS |
| Natural register and vocabulary | 합니다체 | です・ます | Plain, active English | Taiwan Traditional Chinese |

The English title is 80 characters, so an SEO title is required; its SEO title is 45 characters and differs from the title. The final English summary is 155 characters with none of the forbidden symbols, URLs, or ellipsis. All four dates, categories, topic `litigation`, audience values, literal `NNN` image paths, three FAQs, matching H1s, and `author: "legal-ai-assistant"` conform to the brief. Read times remain plausible for the measured lengths.

No bold, phone/hotline numbers, private-party names, fabricated experience, attorney byline, public author substitution, attorney-review claim, native-human-review claim, outcome promise, or unlabelled client scenario was found. The lawyer-retention work is confined to the actual lease/deed, expiry return, fixed payment, Article 13 objections, preparation of pleadings/responses, and representation in the ensuing Taiwan civil dispute. Internal links were checked by the supplied lint against the same-language files in the designated repository; Japanese correctly has no nonexistent deposit-column link.

### Opening and comparable-article review

Applied the sentence-deletion check to the first two paragraphs. In ko/ja, the opening explains why private wording is insufficient, supplies the cumulative conditions, and identifies the two obligations; the labelled scene establishes the concrete term, return wording, money, and pre-signing decision. In en, the fictional first paragraph supplies those contract facts and the reader's question; the second supplies the legal test. Its empty “defined reach” sentence was removed. In zh-hant, the opening distinguishes court enforcement from self-help and states the deed conditions; the second supplies the labelled lease scenario. The remaining scene connections explain the coexisting return/payment duties rather than previewing the article's structure.

Compared introductions, subheads, and endings with three recent same-language articles in the read-only repository `/Users/son7/Projects/tseng-law-columns-20261016/src/content/`. Dates below are their recorded publication dates:

| Locale / directory | Three comparators | Concrete comparison |
| --- | --- | --- |
| ko / `columns` | `628-taiwan-parked-car-collision-external-video-evidence.md`, `627-taiwan-oneway-wrongway-head-on-collision.md`, `626-taiwan-red-signal-straight-stop-line-collision.md` — all 2026-10-15 | Those start with collision evidence or a traffic direction rule and end on the missing record. C3 starts with deed eligibility and now ends on the actual lease/deed/enforcement papers; no borrowed traffic template or imperative heading. |
| ja / `columns-ja` | `610-taiwan-subsidiary-annual-shareholders-meeting-director-term.md` — 2026-10-15; `609-taiwan-mistaken-bank-transfer-unjust-enrichment.md`, `608-taiwan-false-financial-report-investor-civil-damages.md` — 2026-10-14 | The comparison texts start with a term cap, living-expenses defense, or reporting-signature duty. C3's deed wording and expiry return are specific to its reader; its repeated sentence opening was shortened. |
| en / `columns-en` | `611-taiwan-scooter-outer-lane-left-turn-dashcam.md`, `610-taiwan-subsidiary-annual-shareholders-meeting-director-term.md` — 2026-10-15; `609-taiwan-mistaken-bank-transfer-unjust-enrichment.md` — 2026-10-14 | Both 611 and 609 use labelled scenes, but their action/record questions differ from the lease clause here; 610 uses a number-first opening. C3 has no stock “Suppose” lead. Its subheads separate return, money, enforcement actor, and objections; its ending names the relevant papers. |
| zh-hant / `columns-zh` | `628-taiwan-parked-car-collision-external-video-evidence.md`, `627-taiwan-oneway-wrongway-head-on-collision.md`, `626-taiwan-red-signal-straight-stop-line-collision.md` — all 2026-10-15 | The questions concern proving a crash sequence. C3 addresses the concrete misconception that a deed permits personal eviction; the subsequent conditions and court role answer it immediately. The ending is tied to the lease documents. |

Available C1/C2 batch openings were also inspected. C3 has no copied opening sentence or stock hypothetical formula. The private-clause/self-enforcement misconception and the lease-negotiation scene are specific to this column. This review does not certify the eventual opening-type distribution of C4–C8 drafts that were not present in the inspected draft set. Comparator review was against repository text, not a live-site deployment check.

## Sentence-variety verification

Ran the exact required lint and variety commands on every language before editing and again after the final edits. Raw post-edit commands and output are in `final-astra-r1-checks.txt`.

```text
python3 /Users/son7/tseng-col-1016-work/lint.py /Users/son7/tseng-col-1016-work/drafts/C3/<lang>.md <lang> taiwan-notarized-fixed-term-lease-direct-enforcement
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-col-1016-work/drafts/C3/<lang>.md
```

| Language | Final lint | Length | Variety FAIL | CV | Very short share | Contrast count |
| --- | --- | --- | --- | --- | --- | --- |
| ko | OK | 2,795 characters | 0 | 0.463 | 9.5% | 1 |
| ja | OK | 3,066 characters | 0 | 0.458 | 11.8% | 2 |
| en | OK | 1,174 words | 0 | 0.534 | 12.9% | 0 |
| zh-hant | OK | 2,014 characters | 0 | 0.464 | 11.3% | 0 |

Korean and Japanese each retain one WARN about 84% of sentences ending in the standard polite register. These are WARNs, not FAILs. Manual reading confirms consistent 합니다체/です・ます, rather than register mixing; short statements and questions vary the rhythm. For example, ko has “조건은 셋입니다” and “둘 다 필요합니다”; ja has “条件は三つです” and “期限前にはできません”; en has “Why no judgment?” and “Timing matters”; zh-hant has “不能” and “仍要有法院命令”. Each language has at least two very short sentences.

Manual sections 5–6 check: no stock hypothetical opener; no three paragraphs opening with the same word; no three consecutive claim–citation–caveat paragraphs; an uncited fictional-scene paragraph is present; contrast templates remain within the limit and concern the column's actual enforcement question; final paragraphs now end on the relevant documents; no facts, numeric example, official source, or hypothetical label was lost through a variety edit. No MONOTONY FAIL remains. The pre-edit generic contact ending was the single manual closing issue and was repaired as E8.

## Image verdict

OK. Viewed `/Users/son7/tseng-col-1016-work/images/C3.webp` directly with the image-viewing tool. It shows a neutral, empty residential interior with a window, closed wooden door, and potted plant. It fits the return-of-rented-premises topic. There are no people or faces, text, logos, flags, readable documents, address markers, or identifiable parties. The illustrative scene does not depict an actual eviction or imply a real client result; there is no humiliating or confrontational content.

Image SHA-256: `0abce0f82dbd082381fdc5d0765fef0eddc5794875d20afdaee28615d30db102`.

## Reviewed final versions

| File | SHA-256 |
| --- | --- |
| `drafts/C3/ko.md` | `b9029df08fd60bfb530ccd28a08c5178f0f2e036f072fa42e277ebe7eab88186` |
| `drafts/C3/ja.md` | `a73b69f9eb1aaa47a66d2fc9ae68dd61b82973ac8255589efdaffdca1d20f55d` |
| `drafts/C3/en.md` | `7c4b90af81f2378872981614a996a90b6222cf1effdff4d713d2d6825d939ead` |
| `drafts/C3/zh-hant.md` | `e5a4871f2e5c4a7b17f6c61c3f08515a3d04d8a65dce8dd8a0fe0203d5710eab` |

## Points for lawyer confirmation

1. 실제 공정증서의 지급 조항이 제13조 제1항 제1호의 ‘일정한 수량’을 충족하는지, 특히 금액을 산식으로 특정하는 경우의 실무상 인정 범위를 확인할 필요가 있습니다.
2. 실제 점유자가 제13조 제2항의 승계인 또는 당사자·승계인을 위한 점유자인지, 승계 시점과 점유 관계를 계약 및 자료로 확인할 필요가 있습니다.
3. 제13조 제3항에 따른 집행정지에서 해당 사유의 소명, 담보액 산정, 담보 제공과 정지 효력의 구체적 순서를 대만 변호사가 확인할 필요가 있습니다.

VERDICT: PASS     (all four languages publishable now, image OK)
