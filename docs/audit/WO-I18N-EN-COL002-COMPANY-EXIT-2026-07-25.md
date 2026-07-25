# WO-I18N-EN-COL002 — Closing a Taiwan Company Full Rewrite

Date: 2026-07-25 KST  
Manager: Codex `/root`

## Goal and scope

Replace the legacy EN002 article with original, natural American legal English
that distinguishes company property, paid-in capital, capital reduction,
dissolution, liquidation, residual-asset distribution, insolvency, business
suspension, and tax filings.

Use the corrected, committed KO002, ZH002, and JA002 articles and tests as the
factual contract. Do not translate them sentence by sentence.

The writer may modify only:

1. `src/content/columns-en/002-withdraw-capital-taiwan-company.md`
2. `src/lib/__tests__/columns-en-investment-002.test.ts` (new)

Do not modify another locale, shared code, images, existing tests, this work
order, or embeddings. Do not stage, commit, push, deploy, publish, or operate a
server.

## Exact frontmatter and H1

- title and H1:
  `Closing a Taiwan Company: What Happens to Capital and Company Assets?`
- preserve the exact source URL.
- `lastmod: "2026-07-25"`
- `date_display: "September 13, 2025"`
- category: `Taiwan Company Formation`
- preserve the featured-image path.
- use exactly the three FAQs below.
- calculate `read_time` only after the final copy is complete.

Preserve both image paths. Use meaningful American-English alt text for the
featured image and an empty alt for `img-01.png`.

## Exact FAQs and H2-first-paragraph contract

Repeat each FAQ answer character-for-character as the first paragraph
immediately after its matching H2. Nothing may intervene.

### FAQ 1

- H2:
  `## 1. Company Assets, Paid-In Capital, and Shareholder Funds Are Different`
- Q:
  `Can a Taiwan company return money to its shareholders without dissolution and liquidation?`
- A:
  `A company that will permanently cease operations generally should register its dissolution, complete liquidation, discharge its debts and tax obligations, and only then distribute its remaining assets to shareholders. If the company will continue, it may consider a lawful capital reduction appropriate to its company form. Ordinary business expenses, lawful dividends, and repayment of genuine company debt are separate legal and tax categories and require their own authority, documentation, accounting, and tax treatment.`

### FAQ 2

- H2: `## 2. Permanently Closing a Taiwan Company`
- Q:
  `What approval and filing requirements apply when a Taiwan company dissolves?`
- A:
  `Dissolution of a limited company requires approval by shareholders holding at least two-thirds of all voting rights. Dissolution of a company limited by shares ordinarily requires a meeting attended by shareholders representing at least two-thirds of all outstanding shares and approval by a majority of the voting rights represented at the meeting. If a company with publicly issued shares does not meet that attendance threshold, it may instead act at a meeting attended by shareholders representing a majority of all outstanding shares if at least two-thirds of the voting rights represented at the meeting approve. Any higher quorum or voting threshold in the articles of incorporation controls. The dissolution change registration generally must be filed within 15 days after dissolution.`

### FAQ 3

- H2: `## 5. Temporarily Suspending Business Instead of Closing`
- Q:
  `Can a Taiwan company suspend business instead of dissolving immediately?`
- A:
  `A company suspending business for at least one month must apply for business-suspension registration before the suspension begins or within 15 days after it begins, and each suspension period may not exceed one year. Suspension does not eliminate the company or automatically eliminate its tax-filing obligations; a profit-seeking enterprise that suspends business during the year still must file its annual income tax return. Other obligations depend on the company’s assets, employees, contracts, licenses, and tax profile.`

## Exact H2 structure

Use exactly these seven H2s, in order:

1. `## 1. Company Assets, Paid-In Capital, and Shareholder Funds Are Different`
2. `## 2. Permanently Closing a Taiwan Company`
3. `## 3. When Liabilities Exceed Assets or the Company Cannot Pay Its Debts`
4. `## 4. Returning Capital While the Company Continues: Capital Reduction`
5. `## 5. Temporarily Suspending Business Instead of Closing`
6. `## Official Sources`
7. `## Related Services`

## Introduction and terminology

Explain that company assets belong to the company, not its shareholders.
Contributing capital does not let a shareholder withdraw company cash or assets
at will. Distinguish:

- company property;
- paid-in capital or capital contributions;
- lawful business expenses;
- dividends;
- repayment of genuine company debt;
- capital reduction; and
- liquidation and distribution of residual assets.

Never describe residual assets as capital or `remaining assets (capital)`.

Use Taiwan statutory company forms precisely: `limited company` and
`company limited by shares`. Do not substitute U.S. `LLC` or `corporation`.
Prefer `shareholders holding voting rights`, `outstanding shares`,
`articles of incorporation`, `dissolution change registration`, `liquidator`,
`creditors`, `residual assets`, `capital reduction`,
`business-suspension registration`, `profit-seeking enterprise income tax`,
and `current-period final income tax return`.

Do not add client dialogue, anecdotes, solicitation, processing-time promises,
or outcome, approval, or remittance guarantees.

## Exact Articles 9, 90, and 89 paragraphs

Use verbatim:

`Article 9 of Taiwan’s Company Act applies when share subscription payments or capital contributions owed to a company were not actually paid but were represented as fully paid in the incorporation filing, or when paid-in amounts were returned to shareholders or shareholders were allowed to withdraw them after incorporation. The responsible person may be punished by imprisonment for up to five years or detention and may also be fined from NT$500,000 to NT$2.5 million. Article 9 is not a general criminal prohibition on every lawful use of company funds.`

Use verbatim:

`Under Article 90 of the Company Act, a liquidator may not distribute company assets to shareholders before all company liabilities have been discharged. A liquidator who violates that rule may be sentenced to imprisonment for up to one year or detention and may also be fined up to NT$60,000.`

Use verbatim:

`Liquidation following dissolution is not limited to companies whose assets exceed their liabilities. Under Article 89 of the Company Act, if the aggregate value of the company’s assets is insufficient to satisfy its liabilities, the liquidator must file an application for a declaration of bankruptcy. Whether ordinary liquidation may continue requires a fact-specific review of the company’s assets, liabilities, ability to pay debts as they mature, collateral, tax liabilities, and creditor body.`

State separately that any other civil, criminal, director-duty, accounting, or
tax consequence depends on purpose, authority, documentation, accounting
treatment, and facts. Do not state that breach of trust automatically applies.

## Articles 113 and 316

Section 2 must state:

- Article 113: a limited company requires approval by shareholders holding at
  least two-thirds of all voting rights.
- Article 316: a company limited by shares ordinarily requires attendance
  representing at least two-thirds of all outstanding shares and approval by a
  majority of voting rights represented at the meeting.
- For a company with publicly issued shares that cannot meet the ordinary
  attendance threshold: attendance representing a majority of outstanding
  shares and approval by at least two-thirds of voting rights represented.
- Higher requirements in the articles of incorporation control.

## Permanent-closing sequence

Present a qualified educational outline, not a universal checklist:

1. Review contracts, employees, permits, company assets, debts, taxes,
   litigation, bank accounts, foreign-investment approvals, and remittance
   records.
2. Adopt the dissolution resolution under Article 113 or 316.
3. Under the Company Registration Regulations (`公司登記辦法`) Article 4,
   apply for dissolution change registration within 15 days after dissolution.
4. For profit-seeking enterprise income tax, file the current-period final
   income tax return within 45 days after the competent authority approves
   dissolution. Explain that the official guidance uses the approval document’s
   issuance date and counts from the following day, subject to the actual
   document and dissolution basis.
5. Select or confirm the liquidator, make the required court filing, prepare
   the inventory of property and balance sheet, conclude pending business,
   collect claims, discharge debts and taxes, and complete applicable creditor
   procedures.
6. Distribute only residual assets remaining after liabilities and taxes have
   been handled, under applicable rules and ownership interests.
7. File the liquidation-income return within 30 days after liquidation ends
   and make the required liquidation-completion report to the court.

State that under Company Act Article 24, dissolution caused by consolidation or
merger, split-up, or bankruptcy may not follow ordinary liquidation. Do not
promise a fixed liquidation duration.

## Insolvency

Explain the difference among balance-sheet insolvency, inability to pay debts
as they mature, liquidity, collateral, priority claims, tax liabilities,
litigation, and realizable value. Do not use the stale shortcut that bankruptcy
requires both remaining property and multiple creditors.

Shareholder distributions must not precede the review of books, claims,
liabilities, security interests, taxes, and creditor treatment.

## Capital reduction and other payments

Explain that capital reduction may be considered when the company will
continue but wishes to return part of its capital. It is not an informal
withdrawal and is not always available. Address the company-form-specific
resolution, creditor protection, capital verification and accounting,
foreign-investment filings, tax, remittance, and change registration.

Separately discuss lawful business expenses, dividends supported by
distributable earnings, and repayment of genuine shareholder loans or company
debt. Each requires its own contract or resolution, evidence, accounting,
withholding, and tax treatment. Cash in a bank account alone does not establish
distributable earnings.

## Business suspension

After FAQ 3, explain that suspension preserves legal existence and is not a
substitute for dissolution and liquidation. Cover:

- continuing change-registration duties for address, responsible person,
  articles of incorporation, or capital;
- taxes and carrying costs on vehicles and real property;
- contracts, employees, licenses, bank accounts, and record retention;
- notices and responsible contacts; and
- reassessment of resumption, another lawful suspension period, or permanent
  closure before the period ends.

## Exact official sources

Use each exactly once, in order:

1. `[Taiwan Laws & Regulations Database — Company Act](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=J0080001)`
2. `[Taiwan Ministry of Economic Affairs — Company Registration Regulations](https://law.moea.gov.tw/LawContent.aspx?id=FL011312)`
3. `[Taiwan Ministry of Finance Tax Portal — Final and Liquidation Returns and Business Suspension](https://www.etax.nat.gov.tw/etwmain/tax-info/understanding/tax-q-and-a/national/profit-seeking-enterprise-income-tax/liquidation-procedure/x6mOPan)`
4. `[Taiwan Ministry of Economic Affairs — Business Suspension Filing Deadline](https://serv.gcis.nat.gov.tw/crm/faqAction.do?id=659&method=faqDetlDetl)`

## Exact internal links and ending

Under `## Related Services`, use only these three internal links, once and in
order:

1. `[Taiwan Investment and Company Formation Services](/en/services#investment)`
2. `[Taiwan Company Formation Basics](/en/columns/taiwan-company-establishment-basics)`
3. `[Contact Our Office](/en/contact)`

After the links, add a horizontal rule and use exactly:

`This article provides general legal and tax information about closing a Taiwan company and handling company assets. It is educational material, not legal or tax advice for any specific matter. The appropriate dissolution, liquidation, capital-reduction, business-suspension, and tax-filing procedures depend on the company form, articles of incorporation, financial condition, creditors, foreign-investment structure, and particular transactions. Confirm the current rules and facts before adopting a resolution, transferring funds, or distributing company assets.`

End with:

`**Wei Tseng (曾雋崴), Taiwan Attorney**`

Nothing may follow the author.

## Word count and read time

Body outside frontmatter must have at least 1,800 visible English words. Links
count only labels, images only alt, and URLs and Markdown syntax do not count.
Use:

`/[A-Za-z0-9]+(?:[.’'-][A-Za-z0-9]+)*/g`

Freeze the exact final count in the test. Set:

`minutes = Math.ceil(visibleWordCount / 200)`

and `read_time: "N min read"`.

## Forbidden stale content

- old title or `1 min read`;
- category `Company Setup`;
- `remaining assets (capital)`, `residual assets (capital)`, or equivalent;
- remitting capital `directly back to Korea`;
- generic Article 9 liability for any company-fund use;
- automatic breach of trust;
- liquidation only when assets exceed liabilities;
- the old bankruptcy shortcut requiring property and multiple creditors;
- `Company Registration Act Article 4`;
- assertion that dissolution registration automatically cancels every tax,
  license, or business registration;
- assertion that suspension eliminates all next-period tax filings;
- automatic fines or business suspension merely because a company is inactive;
- unconditional `renewable upon expiry`;
- universal liquidation duration or guarantee;
- client dialogue, marketing anecdotes, solicitation, DMs, or response promise;
- Hangul, kana, `/ko/`, `/ja/`, `/zh-hant/`, `曾俊瑋`, U+FEFF, U+00A0,
  or U+200B.

## Required test and Manager gates

The new test must inspect raw Markdown, gray-matter, and
`getColumnPost('withdraw-capital-taiwan-company', 'en')`, and lock:

- exact metadata, H1, URL, category, dates, images, and exactly three FAQs;
- FAQ/body first-paragraph identity;
- exact seven-H2 order;
- exact Articles 9, 89, and 90 paragraphs;
- Articles 113 and 316 thresholds;
- Article 4 and 15 days; final return 45 days; liquidation return 30 days;
- liquidator, court, creditor, residual-assets, and Article 24 qualifications;
- capital reduction and separate expense/dividend/debt treatment;
- suspension timing, one-year maximum, annual return, and continuing duties;
- exactly four official links and three `/en/` links, once and in order;
- disclaimer, author, and author-last;
- forbidden strings, wrong locales, and hidden characters absent;
- at least 1,800 visible words, exact count, and the 200-wpm formula;
- canonical slug and alias `withdraw-capital`.

Manager:

1. `npx vitest run src/lib/__tests__/columns-en-investment-002.test.ts src/lib/__tests__/columns-ko-investment-002.test.ts src/lib/__tests__/columns-ja-investment-002.test.ts src/lib/__tests__/columns-faq.test.ts`
2. `npm run -s typecheck`
3. `npx eslint src/lib/__tests__/columns-en-investment-002.test.ts`
4. scoped `git diff --check`
5. independent American legal-English review, with exact replacements and
   re-review until PASS
6. independent current Taiwan-law review against the four primary sources
7. Playwright Chromium at `1440x1000` and `390x844` on
   `/en/columns/withdraw-capital-taiwan-company`: HTTP 200, `lang=en`, exact
   H1/canonical/date/read time, three FAQ entries, four official links, four
   locale flags, zero console/page errors, and zero horizontal overflow;
   inspect mobile screenshot and click all four flags to confirm URL and `lang`.
