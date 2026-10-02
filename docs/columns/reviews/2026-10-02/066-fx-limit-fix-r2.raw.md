VERDICT: FAIL

FACTUAL:
- The annual limits match the brief in all four languages: USD 10 million for groups and individuals, and USD 100 million for companies and firms. Each version says they apply from 2024-11-01 under the CBC adjustment order issued 2024-10-31 under Article 7. They appear in FAQ 2, the Article 4 and Article 6 paragraphs (in the Article 6 paragraph only in KO), and the source list. No old USD 5 million / 50 million figure is left.
- The per-conversion thresholds are unchanged and correct in the FAQ and the Article 5 paragraph: USD 500,000 for individuals and groups, USD 1 million for companies and firms.
- The NT$500,000 declaration threshold, the USD 100,000 non-resident threshold and the NT$30,000–600,000 fine range are unchanged and consistent across languages.
- The three official pages were not checked live: WebFetch and `git diff` both needed approval, which was not given. The figures match the brief and what I already know of the CBC 2024-10-31 announcement, but still open those pages in a browser before publishing.
- The edits suggested in the earlier review (`066-fx-limit-fix-r1.raw.md`) have all been made: the Article 7 link is back in the KO, EN and JA FAQs, the ZH FAQ wording is fixed, and the broken JA body sentence is fixed.

KO: Natural, calm 합니다체. The changed FAQ 2 and the Article 4 and Article 6 paragraphs read cleanly. No bold, no phone number, no lawyer-review claim. `author: legal-ai-assistant` is kept.

EN: Idiomatic, with must/may used correctly. Minor: FAQ 2 says "USD 1 million for companies" while the body says "companies and firms" (optional consistency fix). No bold, phone number or review claim.

ZH: Taiwanese terms (結購/結售, 逕行結匯, 行號) and 應/得 are used correctly. "上述年度金額係央行依第7條於2024年10月31日發布調整命令" now cites the correct legal basis. No bold, phone number or review claim.

JA: Natural です・ます style, and the fixed sentence at line 34 reads correctly. Minor, optional: line 30's "（同条第1項第2号・第2項）" now starts a new paragraph, so it's unclear which article 同条 means; "第6条第1項第2号・第2項" would be clearer. Line 34 says 台湾ドル where the rest of the text says 新台湾ドル. No bold, phone number or review claim.

ISSUES:
1. Must fix, all four languages: FAQ 2 answers contain Markdown links. These four files are the only columns that do. `normalizeColumnFaq` (`src/lib/columns.ts:47-59`) and `buildFaqJsonLd` (`src/lib/seo.ts:851-869`) pass the answer text through unchanged, and `page.tsx:431` renders it as plain text (`<dd>{item.a}</dd>`). So the visible FAQ and the FAQPage structured data will both show raw text like `[제7조](https://law.moj.gov.tw/...)`. Remove the link syntax from FAQ 2 and keep the meaning as plain text; the body and source list already link the sources. For example:
   - KO: "…중앙은행이 제7조에 따라 2024년 10월 31일 조정 명령을 내려 2024년 11월 1일부터 적용되었습니다."
   - EN: "…under the adjustment order the Central Bank issued on 31 October 2024 under Article 7 of the regulations."
   - ZH: "…上述年度金額係央行依第7條於2024年10月31日發布調整命令，自2024年11月1日起適用。"
   - JA: "…これらの年間基準は、中央銀行が第7条に基づき2024年10月31日に出した調整命令により、2024年11月1日から適用されています。"
2. Optional: the EN FAQ's "companies" wording and the JA "同条" and 台湾ドル wording (see EN and JA above).
3. Before publishing: open the CBC press release, the CBC order notice and Article 7 in a browser and confirm them.

No files were modified.
