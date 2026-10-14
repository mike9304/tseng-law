# C6 afix1 — 2026-10-14

Resolved both major findings in `final-astra-r3.md`. That review listed no MONOTONY rejection. Edited all four language drafts directly; no git command, publication, or image edit.

| Issue | Change and meaning preserved | Official source |
|---|---|---|
| L1, EN: “limits exchange students to two semesters” misstates the scope | The handbook now includes exchange students studying in Taiwan for two semesters among those eligible to apply for a work permit. A shorter exchange does not meet that condition. Retained the two-semester hypothetical, its invented-example label, the separate school-certified fact and the permit requirement. Added no maximum/minimum exchange-study rule. | [WDA handbook, printed p. 3][handbook]; [management regulation Article 51][article51] |
| L2, KO/JA/EN FAQ 1: “same requirement” / “同じ要件” / “pairs … with” obscures OR | Rewrote all four FAQs to say formal enrollment in a department/faculty/graduate program OR at least six months of language study. The six-month explanation expressly concerns language-only students. Preserved the additional school certification in paragraph 1, item 2; mentioned paragraph 2's separate qualification exceptions. ZH also explicitly uses 或. | [Article 51][article51] |
| ZH heading/body suggests school certification covers both statutory items | “學校認定的兩件事” → “在學條件與學校認定”; “就讀學校要同時認定兩件事” → “申請須符合兩項條件”. Both requirements remain, with school-certified facts attached to item 2. | [Article 51][article51] |
| Citation placement | Added official Markdown links to FAQ legal references, KO/JA/EN fine-table rows, the repeated EN handbook-fee claim and ZH hours reference. All cited sources remain in each final source list. | [Articles 43](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=43), [63](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=63), [68](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=68), [54](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090027&flno=54); [handbook, printed p. 5][handbook] |
| Short wording fixes to retain the length limits | KO receipt wording now says data entry permits omission of the original unless requested; the repeat-offense sentence expressly identifies the fine as available in combination. EN attaches Article 53 directly to the document requirement. No amount, deadline, document or exception changed. | [WDA documents](https://ezworktaiwan.wda.gov.tw/cp.aspx?n=99329239A3FBA2BB&s=B87ABDBEA90DBADA); [Article 63](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=63); [Article 53](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090027&flno=53) |

Fresh verification: curl fetched all 42 distinct official URLs successfully, including all 28 cited single-article pages and seven full-law pages. The 23 articles in `research/C6-statutes.md` match the fetched text after whitespace normalization; separately checked the five additional articles, amendment dates, WDA instructions and NIA extension instructions. Rendered and inspected handbook PDF pages 4 and 6 (printed pp. 3 and 5). `research/judgments` contains no `.txt` files; no judgment is cited.

The fact sheet was not treated as proof. Its statement that professional qualifications are “not used in the column” is stale: all four drafts retain that caveat, supported by the [WDA graduate page](https://ezworktaiwan.wda.gov.tw/cp.aspx?n=511766BD9E956242). The fact sheet itself was outside the edited files.

| Language | Final lint | Variety FAILs | CV / short-sentence share |
|---|---|---|---|
| KO | OK, 3,497 characters | 0 | .504 / .106 |
| JA | OK, 4,056 characters | 0 | .495 / .129 |
| EN | OK, 1,600 words | 0 | .561 / .265 |
| ZH-HANT | OK, 2,699 characters | 0 | .518 / .103 |

Section 5 self-check: retained distinct number/ARC/question openings and compared C1–C5 plus three preceding published columns per language. First-two-paragraph deletion checks preserve the cap, covered groups, applicant or ARC distinction. Each version has multiple very short sentences, a citation-free scene/question, no excessive repeated paragraph opener, no repeated claim/citation/caveat sequence, no excess contrast template, and a substantive ending. KO 합니다체 and JA です・ます remain consistent; their ending-frequency WARNs are not FAILs. EN answers its reader's question directly without inserting an artificial body question.

Author, featured-image path, hypothetical labels, legal figures, full source lists and the required 2026-10-13 source-check date remain. Image SHA-256 remains `e9c8784a28f3bbb5d9041bd9aa3f619f5fb8d56c69b4ba7cb4259dd7013c5c2c`. Fresh fetches, before copies, diffs and final command outputs: `/private/tmp/C6-afix1-3y1sh94f/`.

Integration note: the requested inline citations are Markdown inside FAQ YAML strings. The current site FAQ component renders those strings as plain text; this draft-only task did not change the renderer or claim rendered-site verification.

[article51]: https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090027&flno=51
[handbook]: https://ws.wda.gov.tw/Download.ashx?u=LzAwMS9VcGxvYWQvMzIwL2NrZmlsZS9iMzE3ZTYzNS1jNmNiLTRmYWMtYmY0ZC04OWVhMDVlNDM1MjYucGRm&n=5aSW5ZyL55WZ5a2455Sf44CB5YOR55Sf44CB6I%2bv6KOU5a2455Sf55Sz6KuL5bel5L2c6Kix5Y%2bv5a%2bp5p%2bl5L2c5qWt5omL5YaKLTExNOW5tDTmnIjnt6jljbAucGRm&icon=.pdf
