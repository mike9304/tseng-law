# WO-I18N-EN-COL004 — Taiwan Subsidiary and Branch Full Rewrite

Date: 2026-07-25 KST
Manager: Codex `/root`

## Goal and scope

Replace the unapproved English 004 candidate with original, publication-quality
English legal editorial copy based on current Taiwan primary sources. The
completed KO and ZH-Hant articles and the corrected JA article are factual and
structural references, not sentence-by-sentence translation sources.

The writer may modify only:

1. `src/content/columns-en/004-taiwan-company-subsidiary-vs-branch.md`
2. `src/lib/__tests__/columns-en-investment-004.test.ts`

The existing changes in those two files are an unapproved candidate. Replace
them as necessary; do not preserve unsupported language merely because it is
already present.

Do not modify another locale, shared code, images, existing tests, this work
order, or `src/content/column-embeddings.json`. Do not stage, commit, push,
deploy, publish, or operate a server.

## Exact frontmatter, H1, and images

- title and H1:
  `Entering the Taiwan Market: Key Differences Between a Subsidiary and a Branch`
- preserve the exact source URL:
  `https://www.wei-wei-lawyer.com/post/taiwan-company-subsidiary-vs-branch`
- `lastmod: "2026-07-25"`
- `date_display: "September 13, 2025"`
- category: `Taiwan Company Formation`
- preserve the featured-image path;
- use exactly the three FAQs below;
- calculate `read_time` only after the final copy is complete.

Preserve exactly the two existing image paths and no others. Immediately after
H1 use:

`![Taiwan subsidiary and foreign-company branch comparison](../images/004-taiwan-company-subsidiary-vs-branch/featured-01.jpg)`

Use the second image after the opening overview and before the first H2, with
an empty alt:

`![](../images/004-taiwan-company-subsidiary-vs-branch/img-01.jpg)`

## Exact FAQs and body-repeat contract

FAQ 1

- Q:
  `Can Taiwanese individuals or Taiwan entities participate as shareholders in a Taiwan branch?`
- A:
  `A Taiwan branch is part of the foreign company and has no shareholders of its own. If the business will have third-party co-investors, it may consider a Taiwan subsidiary with an appropriate shareholder structure or another lawful arrangement. Liability, voting rights, financing, licensing, and tax treatment must be evaluated based on the ownership arrangement and business plan.`
- repeat the answer character-for-character as the first paragraph immediately
  after `## 1. Legal Personality and Ownership`.

FAQ 2

- Q:
  `How do the tax consequences of a Taiwan subsidiary and a Taiwan branch differ?`
- A:
  `A subsidiary and a branch that conduct taxable business in Taiwan generally must address 5% business tax and 20% profit-seeking enterprise income tax, although actual liability depends on taxable income, transaction type, and allowable deductions. Under Taiwan domestic law, a Taiwan subsidiary’s dividend to a foreign parent is subject to 21% withholding; when the Taiwan–Korea Income Tax Agreement and its procedures apply, the source-territory rate is capped at 10%. A Taiwan branch’s remittance of after-tax branch profits to its foreign head office is not a dividend and generally does not trigger separate dividend withholding. A profit-seeking enterprise whose head office is outside Taiwan is exempt from filing the undistributed-earnings return and from the related 5% additional tax.`
- repeat the answer character-for-character as the first paragraph immediately
  after `## 2. Tax and Profit Remittances`.

FAQ 3

- Q:
  `If a business plans to list in Taiwan or claim an investment tax credit, should it use a subsidiary or a branch?`
- A:
  `A branch is not an independent issuer and cannot itself be listed in Taiwan. A Taiwan subsidiary must still satisfy the Company Act and the applicable exchange’s requirements to pursue a listing. Tax incentives do not apply solely because of the chosen organizational form. Eligibility for an investment credit under Article 10-1 of the Statute for Industrial Innovation depends on the taxpayer, qualifying investment, filing deadline, credit method, anti-duplication rules, and applicable tax limits.`
- repeat the answer character-for-character as the first paragraph immediately
  after `## 4. Financing and Listing in Taiwan`.

Each answer must occur exactly twice in the raw file: once in frontmatter and
once in its assigned body location. Nothing may intervene between the H2 and
the repeated answer.

## Exact H2 structure

Use exactly these nine H2s, in order:

1. `## 1. Legal Personality and Ownership`
2. `## 2. Tax and Profit Remittances`
3. `## 3. Debts and Legal Liability`
4. `## 4. Financing and Listing in Taiwan`
5. `## 5. Article 10-1 Investment Tax Credits`
6. `## 6. The Taiwan–Korea Income Tax Agreement and Permanent Establishments`
7. `## 7. Choosing a Structure and Planning an Exit`
8. `## Official Sources`
9. `## Related Services`

Do not add a representative-office comparison or discussion. This article is
limited to a Taiwan subsidiary and a foreign company’s Taiwan branch.

## Terminology and editorial rules

- use `Taiwan subsidiary` for the locally incorporated entity;
- use `foreign parent` only for the shareholder relationship with a subsidiary;
- use `foreign company` or `foreign head office` for the branch relationship;
- do not call branch appropriated operating funds share capital or equity;
- a branch has no shareholders, shares, equity owners, or independent legal
  personality;
- use `profit-seeking enterprise income tax`, not generic corporate tax, when
  stating the Taiwan tax;
- introduce `permanent establishment (PE)` on first use;
- use `Taiwan–Korea Income Tax Agreement`, with an en dash;
- explain conclusions in natural professional English rather than translating
  Korean or Chinese syntax;
- use concise topic sentences, varied paragraph rhythm, and transitions that
  make the article readable by a foreign business decision-maker;
- qualify conclusions that depend on facts, filing procedure, market,
  industry, treaty entitlement, or agency practice;
- do not promise a result, timeline, approval, tax saving, or liability shield;
- do not use marketing superlatives or imply that organizational form alone
  resolves legal, tax, listing, or financing issues.

## Required Company Act analysis

The article must accurately explain all of the following:

1. Article 1 defines a company organized, registered, and incorporated under
   the Company Act as a corporate juristic person for profit.
2. A Taiwan subsidiary and its foreign parent are separate rights-and-
   obligations subjects.
3. Under Article 99(1), a limited-company shareholder is generally liable to
   the company to the extent of the shareholder’s contribution.
4. Article 99(2) creates a serious-abuse exception; limited liability does not
   eliminate liability under guarantees, contract, tort, director/officer
   duties, regulatory law, or other applicable causes of action.
5. Under Article 371, a foreign company that has not registered a branch may
   not conduct business in Taiwan in the foreign company’s name.
6. Article 372 requires the foreign company to appropriate funds exclusively
   for the branch’s business and designate a representative who serves as the
   responsible person in Taiwan.
7. Appropriated branch operating funds are funds of the foreign company, not
   equity in a separate entity.
8. A branch obligation is an obligation of the foreign company. Do not imply
   that branch registration creates a limited-liability silo.

The exit section must include this paragraph exactly:

`Under Article 378 of the Company Act, a foreign company that no longer intends to conduct business in Taiwan must apply to cancel its branch registration, and cancellation does not discharge liabilities or debts incurred before cancellation. Article 379 separately authorizes official cancellation in specified circumstances and provides that cancellation does not affect creditors’ rights or the foreign company’s obligations. If all of the foreign company’s Taiwan branches have been revoked or canceled, Article 380 requires liquidation of the claims and debts arising from its Taiwan business, and the foreign company remains liable for outstanding debts.`

Explain separately that a Taiwan subsidiary ends its business through the
applicable dissolution and liquidation procedures in its own legal identity.
Do not collapse branch cancellation and subsidiary liquidation into the same
process.

## Required tax and remittance analysis

Explain, with appropriate qualifications:

- Taiwan’s general business-tax rate is 5%; zero-rating, exemptions, special
  rates, input-tax treatment, and the character and place of supply can alter
  the result;
- the general profit-seeking enterprise income-tax rate is 20% for taxable
  income above the statutory threshold, not 20% of gross revenue;
- under Taiwan domestic law, dividends from a Taiwan subsidiary to a foreign
  parent are subject to 21% withholding;
- when all requirements and procedures of the Taiwan–Korea Income Tax
  Agreement apply, the source-territory ceiling for a qualifying dividend is
  10%;
- residence evidence, beneficial-owner status, payment character, documents,
  and filing procedure must be confirmed before applying a treaty rate;
- a Taiwan branch’s remittance of after-tax branch profits to its foreign head
  office is not a dividend and generally does not trigger separate dividend
  withholding;
- interest, royalties, service fees, asset consideration, and third-party
  payments are different payment types and require their own analysis;
- a profit-seeking enterprise whose head office is outside Taiwan is exempt
  from filing the undistributed-earnings return and from the related 5%
  additional tax;
- transfer pricing, cost allocation, foreign tax credits, and the foreign
  jurisdiction’s tax and accounting treatment require separate review.

Do not claim that a branch is always tax-favored or that a subsidiary always
produces a lower or higher total tax burden.

## Required liability, financing, and listing analysis

Explain that:

- shareholders of a limited company are generally limited by their
  contributions and shareholders of a company limited by shares are generally
  responsible for the shares they subscribe, subject to applicable exceptions;
- guarantees, comfort letters, director/officer duties, abuse of juristic
  personality, joint torts, labor and tax violations, licensing issues, and
  group contracts can create liability outside the ordinary shareholder rule;
- a subsidiary is not a device that isolates every risk;
- a branch cannot issue branch equity to third-party investors, but it may
  receive appropriately characterized funds or financing subject to authority,
  banking, foreign-exchange, tax, and documentation requirements;
- a Taiwan subsidiary can be used to structure local or third-party
  participation, but its capital, shareholder, governance, incentive, transfer,
  and financing arrangements remain subject to law and facts.

The listing section must include this paragraph exactly:

`A branch is not an independent issuer and cannot itself be listed in Taiwan. A Taiwan subsidiary does not qualify for listing merely because it exists or is organized as a company limited by shares. The issuer must satisfy the requirements of the applicable market, including requirements concerning operating history, capital, profitability, share distribution, corporate governance, internal controls, audit, and disclosure.`

Mention that market, board, and industry-specific requirements may differ, and
that the operational substance, assets, contracts, employees, related-party
transactions, and disclosure readiness of the issuer also matter.

## Exact Article 10-1 paragraph

Include this paragraph exactly:

`Article 10-1 of the Statute for Industrial Innovation applies from January 1, 2025, through December 31, 2029. Subject to its statutory conditions and approval process, a company or limited partnership with qualifying expenditures totaling NT$1 million or more but NT$2 billion or less in the same taxable year may elect a credit for qualifying new, own-use smart machinery; 5G systems; cybersecurity products or services; AI products or services; and energy-saving or carbon-reduction hardware, software, technology, or technical services. The taxpayer may elect up to 5% of the expenditure against tax payable for the current year or up to 3% against tax payable in each of three years beginning with the current year. The annual Article 10-1 credit may not exceed 30% of the current year’s profit-seeking enterprise income tax; the combined-credit limit and restrictions on duplicate benefits require separate review.`

Also explain that eligibility depends on the taxpayer, compliance history,
qualifying expenditure, new and own-use requirements, filing and approval,
supporting records, and later changes in use. Distinguish Article 10 research
and development credits from Article 10-1 investment credits. Do not say the
credit is limited to subsidiaries or automatically unavailable to branches;
the specific taxpayer and statutory requirements must be checked.

The statutory ceiling is `NT$2 billion or less`, not less than NT$2 billion.
The current Chinese statutory text controls if an English official page is
stale.

## Exact treaty and PE paragraph

Include this paragraph exactly:

`The Taiwan–Korea Income Tax Agreement was signed on November 17, 2021, entered into force on December 27, 2023, and applies from January 1, 2024. Its source-territory ceilings for qualifying dividends, interest, and royalties are each 10%, subject to the Agreement’s residence, beneficial-owner, documentation, and procedural requirements. Business profits are generally exempt in the other territory if the enterprise has no permanent establishment there. A permanent establishment may arise from a fixed place such as a place of management, branch, or office; a construction project lasting more than six months; services performed for more than 183 aggregate days in any 12-month period; or a dependent agent that habitually exercises authority to conclude contracts. A Taiwan branch ordinarily is a fixed-place permanent establishment, so its Taiwan business profits are not automatically exempt.`

Explain that the PE tests are distinct factual tests and that a subsidiary’s
existence does not by itself establish or prevent a foreign parent’s PE.
Employee activity, access to premises, contract authority, functions, assets,
risks, and profit attribution may require separate analysis.

## Required selection and implementation topics

The final substantive section must help readers compare the two forms using
the same business facts:

- investor and governance needs;
- liability allocation and parent guarantees;
- contracts, employees, intellectual property, premises, data, assets, and
  licenses;
- revenue, costs, cross-border charges, retained earnings, dividends, and
  branch-profit remittances;
- investment approval, bank account, inward remittance, capital increase,
  appropriated branch funds, and later outbound remittance;
- books, audit, transfer pricing, group reporting, and foreign-jurisdiction
  consequences;
- future financing, local participation, employee incentives, restructuring,
  share or business sale, and listing;
- suspension, branch-registration cancellation, subsidiary dissolution and
  liquidation, creditor claims, employee matters, tax, and record retention.

Recommend using an organization chart, contract list, funds-flow diagram, and
financial forecast. Do not state a fixed registration or bank-completion
timeline.

## Exact official links

Under `## Official Sources`, use exactly these ten Markdown links, once each,
in this order:

1. `[Laws & Regulations Database — Company Act](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=J0080001)`
2. `[Laws & Regulations Database — Article 10 of the Value-Added and Non-Value-Added Business Tax Act](https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=10&pcode=G0340080)`
3. `[Laws & Regulations Database — Income Tax Act](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=G0340003)`
4. `[Ministry of Finance eTax Portal — Withholding on Profit Income](https://www.etax.nat.gov.tw/etwmain/tax-info/understanding/tax-q-and-a/national/individual-income-tax/withheld-rule/rule/3AmWR0R)`
5. `[Ministry of Finance Laws and Regulations Database — Taxation of Profits of a Taiwan Branch of a Foreign Company](https://law-out.mof.gov.tw/LawContent.aspx?id=GL002917)`
6. `[Ministry of Finance eTax Portal — Exemption from the Undistributed-Earnings Return](https://www.etax.nat.gov.tw/etwmain/tax-info/understanding/tax-q-and-a/national/profit-seeking-enterprise-income-tax/undistributed-surplus-earnings/om7pAeL)`
7. `[Ministry of Finance — Entry into Force and Application of the Taiwan–Korea Income Tax Agreement](https://www.mof.gov.tw/singlehtml/384fb3077bb349ea973e7fc6f13b6974?cntId=127fffb302f24987b0bbf1eff78ff9c9)`
8. `[Laws & Regulations Database — Article 10-1 of the Statute for Industrial Innovation](https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=10-1&pcode=J0040051)`
9. `[Taiwan Stock Exchange — Domestic Company Listing Standards](https://www.twse.com.tw/zh/listed/method/standars.html)`
10. `[Invest Taiwan — Foreign-Company Branch Investment and Registration Procedures](https://investtaiwan.nat.gov.tw/showPageengInvestmentStatus01?lang=eng&menuNum=7&search=InvestmentStatus01)`

Do not add unofficial legal, accounting, marketing, blog, or aggregator
sources.

## Exact internal links

Under `## Related Services`, use exactly these three Markdown links, once each,
in this order:

1. `[Taiwan Investment and Company Formation Services](/en/services#investment)`
2. `[Taiwan Company Formation Basics](/en/columns/taiwan-company-establishment-basics)`
3. `[Contact Our Office](/en/contact)`

Do not add another internal link.

## Exact ending

After the internal links, use a Markdown horizontal rule, then this disclaimer
as one paragraph exactly:

`This article provides general legal and tax information about the differences between a Taiwan subsidiary and a Taiwan branch of a foreign company. It is educational material, not legal or tax advice for any specific matter. The applicable laws and tax treatment may vary depending on the jurisdictions of the investor, foreign parent, and foreign head office; the business activities; the transactions and cash flows; treaty eligibility; and current agency practice. Confirm the current official guidance and the facts of your matter before forming or funding an entity, entering into a contract, declaring a dividend, or making an outbound remittance.`

End the file exactly with:

`**Wei Tseng (曾雋崴), Taiwan Attorney**`

Nothing may follow the author line.

## Length and read-time contract

Use this visible-word algorithm in the test:

1. remove Markdown image paths while retaining alt text;
2. replace Markdown links with their labels;
3. remove heading, blockquote, list, emphasis, code, and horizontal-rule
   markup;
4. collapse whitespace;
5. count matches using:
   `/[A-Za-z0-9]+(?:[.’'-][A-Za-z0-9]+)*/g`.

The final article must contain at least 1,800 visible words. Freeze the exact
final visible-word count in the test. Calculate:

`read_time = ceil(visible_word_count / 200)`

Freeze the resulting exact frontmatter value as `${minutes} min read`.

## Required test contract

Create a strong Vitest suite in
`src/lib/__tests__/columns-en-investment-004.test.ts`. It must:

- parse the source with `gray-matter`;
- use full `parsed.data` `toEqual` for the complete frontmatter;
- resolve both canonical slug
  `taiwan-company-subsidiary-vs-branch` and alias `subsidiary-vs-branch`
  through `getColumnPost`;
- lock exact H1, title, date, read time, category, category label, featured
  image, FAQ array, and canonical content;
- require exactly the two contracted images, alts, paths, counts, and
  positions;
- require exactly the nine ordered H2s;
- require each exact FAQ answer as the first paragraph after its assigned H2
  and exactly twice in the raw source;
- lock the Company Act Articles 1, 99, 371, 372, and 378–380 propositions;
- lock the 5%, 20%, 21%, treaty 10%, branch-remittance, and undistributed-
  earnings propositions;
- lock the listing paragraph, exact Article 10-1 paragraph, exact treaty/PE
  paragraph, and the required selection topics;
- require the ten official and three internal links exactly once and in order;
- require the exact disclaimer and author as the final content;
- freeze the exact visible-word count and formula-derived read time;
- reject hidden characters, other-locale leakage, stale dates, obsolete tax-
  credit thresholds, absolute liability or tax claims, representative-office
  discussion, unsupported timelines, marketing claims, and legacy endings.

At minimum, explicitly ban:

- `representative office`;
- `November 2, 2023`;
- `December 2, 2023`;
- `2023年12月2日`;
- `less than NT$2 billion`;
- `under NT$2 billion`;
- `only subsidiaries`;
- `branches cannot claim`;
- `always tax`;
- `guaranteed`;
- `takes 7 days`;
- `contact us by comment or direct message`;
- `Wei-Wei Lawyer`;
- zero-width and non-breaking characters.

The test must fail if a required proposition is reduced to a bare keyword or
if a source URL is present without its contracted label.

## Writer verification

Before handoff, run:

```bash
npx vitest run \
  src/lib/__tests__/columns-en-investment-004.test.ts \
  src/lib/__tests__/columns-zh-investment-004.test.ts \
  src/lib/__tests__/columns-ko-investment-004.test.ts \
  src/lib/__tests__/columns-ja-investment-004.test.ts \
  src/lib/__tests__/columns-faq.test.ts
npm run -s typecheck
npx eslint src/lib/__tests__/columns-en-investment-004.test.ts
git diff --check -- \
  src/content/columns-en/004-taiwan-company-subsidiary-vs-branch.md \
  src/lib/__tests__/columns-en-investment-004.test.ts
```

Report the final visible-word count, calculated read time, test counts, and the
source SHA-256. Do not stage or commit.

## Acceptance gates

The manager accepts the unit only after:

1. work-order review is `OKAY`;
2. current-Taiwan-law review is `PASS`;
3. an independent native-English editorial review is `PASS`;
4. the writer’s tests pass;
5. the manager reruns focused and cross-locale tests, typecheck, ESLint, and
   diff-check;
6. desktop and mobile browser checks pass for exact H1, canonical, date, read
   time, FAQ text, FAQ JSON-LD, official links, no overflow, and no console or
   page errors;
7. actual mobile flag clicks reach the KO, JA, ZH-Hant, and EN routes with the
   correct `html lang`;
8. only the EN source, EN test, and this work order are committed locally.

No push or deployment is authorized.
