# WO-I18N-ZH-COL004 — 台灣子公司與分公司全面重寫

Date: 2026-07-25 KST
Manager: Codex `/root`

## Goal and scope

Replace the legacy ZH-Hant 004 article with original Taiwan Traditional Chinese
legal editorial copy based on current Taiwan primary sources. The completed KO
and corrected JA articles are factual and structural references, not
sentence-by-sentence translation sources.

The writer may modify only:

1. `src/content/columns-zh/004-taiwan-company-subsidiary-vs-branch.md`
2. `src/lib/__tests__/columns-zh-investment-004.test.ts` (new)

Do not modify another locale, shared code, images, existing tests, this work
order, or `src/content/column-embeddings.json`. Do not stage, commit, push,
deploy, publish, or operate a server.

## Exact frontmatter, H1, and images

- title and H1:
  `進入台灣市場：子公司與分公司的差異`
- preserve the exact source URL;
- `lastmod: "2026-07-25"`;
- `date_display: "2025年9月13日"`;
- category: `台灣公司設立`;
- preserve the featured-image path;
- use exactly the three FAQs below;
- calculate `read_time` only after the final copy is complete.

Preserve exactly the two existing image paths and no others. Immediately after
H1 use:

`![台灣子公司與外國公司分公司的比較示意圖](../images/004-taiwan-company-subsidiary-vs-branch/featured-01.jpg)`

Use the second image after the opening overview, before detailed definitions,
with an empty alt:

`![](../images/004-taiwan-company-subsidiary-vs-branch/img-01.jpg)`

## Exact FAQs and body-repeat contract

FAQ 1

- Q:
  `台灣分公司可以讓台灣自然人或台灣法人以股東身分參與嗎？`
- A:
  `分公司是外國公司的一部分，分公司本身並無股東。若要與第三人共同出資經營台灣事業，可評估設立台灣子公司並規劃股東結構，或採取其他合法安排。責任、表決權、資金籌措、許可及稅務，仍應依出資關係與事業計畫個別確認。`
- repeat the answer character-for-character as the first paragraph immediately
  after `## 1. 法人格與出資結構`.

FAQ 2

- Q:
  `台灣子公司與台灣分公司的稅負有何不同？`
- A:
  `子公司與分公司在台灣從事應稅營業時，一般均須處理5%營業稅及20%營利事業所得稅，但實際稅額取決於課稅所得、交易性質與可扣除項目。台灣子公司向境外母公司分配股利時，台灣國內法的扣繳率為21%；符合台韓所得稅協定的適用要件及程序時，來源地上限稅率為10%。外國公司的台灣分公司將稅後盈餘匯回外國本公司並非分配股利，原則上無須另行扣繳股利所得稅。總機構在台灣境外的營利事業，免辦理5%未分配盈餘加徵稅額申報。`
- repeat the answer character-for-character as the first paragraph immediately
  after `## 2. 稅務與盈餘匯回`.

FAQ 3

- Q:
  `若規劃在台灣上市或申請投資抵減，應選擇子公司還是分公司？`
- A:
  `分公司不是獨立的發行公司，因此不能以分公司本身作為在台灣上市的主體。子公司如要上市，仍須符合公司法及臺灣證券交易所等適用市場的各項要件。租稅優惠也不會只因組織形式而一律適用；例如《產業創新條例》第10條之1投資抵減的適用對象、投資範圍、申請期限、抵減方式、重複適用限制及稅額上限，都應個別確認。`
- repeat the answer character-for-character as the first paragraph immediately
  after `## 4. 資金籌措與在台灣上市`.

Each answer must occur exactly twice in the raw file: once in frontmatter and
once in its assigned body location. Nothing may intervene between the H2 and
the repeated answer.

## Exact H2 structure

Use exactly these nine H2s, in order:

1. `## 1. 法人格與出資結構`
2. `## 2. 稅務與盈餘匯回`
3. `## 3. 債務與法律責任`
4. `## 4. 資金籌措與在台灣上市`
5. `## 5. 投資抵減`
6. `## 6. 台韓所得稅協定與常設機構（PE）`
7. `## 7. 如何選擇適合的組織形式`
8. `## 官方資料`
9. `## 相關資訊`

## Taiwan terminology

- `台灣子公司`;
- `外國公司的台灣分公司` or `外國公司在台分公司`;
- use `母公司` for a subsidiary relationship;
- first use `外國本公司（總公司）`, then `外國本公司`, for a branch
  relationship;
- use `總機構在台灣境外` for the tax-law status;
- use `股份`, `出資額`, and `股東` only for companies, not a branch;
- branch funding is `專撥營業所用資金`, never branch `股本` or `持股`;
- `營業稅（加值型及非加值型營業稅）`, `營利事業所得稅`,
  `扣繳率`, `未分配盈餘加徵5%營利事業所得稅`,
  `稅後分公司盈餘匯回外國本公司`, `台韓所得稅協定`,
  `常設機構（PE）`, `居住者證明`, `受益所有人`, `移轉訂價`,
  and `投資抵減`;
- use `許可` or `核准` according to context;
- branch closure is `廢止分公司登記`; company closure is `解散及清算`.

Narrative uses `台灣`. Preserve official spellings including `臺灣證券交易所`
and `新臺幣`.

## Section 1: legal personality and ownership

After FAQ 1, state:

- Company Act Article 1: a company is a profit-seeking juristic association
  organized, registered, and incorporated under the Act;
- a Taiwan subsidiary is a Taiwan juristic person separate from its foreign
  parent and contracts, acquires rights, and assumes obligations in its own
  name;
- under Article 99(1), a limited-company shareholder is generally liable up
  to its contribution; Article 99(2) veil-abuse liability and guarantees,
  torts, and other liability remain separate;
- under Article 371, a foreign company may not conduct business in Taiwan
  under the foreign-company name without branch registration;
- Article 372 requires funds appropriated exclusively for the Taiwan branch
  business and a responsible person in Taiwan;
- the appropriated funds are not branch equity; a branch has no shares,
  capital interests, or shareholders;
- co-investment may be structured through subsidiary ownership,
  shareholders' agreements, or another lawful arrangement. Do not call a
  subsidiary the only possible joint-business structure.

Use one three-column comparison table covering legal status, equity/shareholder
structure, third-party co-investment, liability subject, and principal
decision/operational control.

## Section 2: tax and profit remittance

After FAQ 2, separately cover:

- general business-tax rate 5% and the usual two-month filing period,
  qualified by zero-rating, exemption, special rates, and input-tax issues;
- general 20% profit-seeking enterprise income-tax rate when taxable income
  exceeds the statutory threshold; it is not 20% of gross revenue;
- domestic 21% withholding on a Taiwan subsidiary's dividend to a
  profit-seeking enterprise with its head office outside Taiwan;
- Taiwan-Korea treaty dividend source ceiling 10% only when treaty residence,
  beneficial-owner, documentation, and procedural requirements are met;
- a remittance of after-tax branch profits to the foreign head company is not
  a dividend and generally is not subject to separate dividend withholding;
  interest, royalties, service fees, asset prices, and third-party payments
  require separate characterization;
- a profit-seeking enterprise with its head office outside Taiwan is exempt
  from the undistributed-earnings filings under Income Tax Act Articles 66-9
  and 102-2;
- compare subsidiary taxable income, costs, losses, retained earnings, and
  dividend timing against Taiwan-attributable branch income, head-office cost
  allocations, transfer pricing, and remittance documents;
- Korean foreign-tax-credit, loss, accounting, and exchange-reporting results
  require separate Korean review. Do not promise branch tax savings.

Use one three-column tax table covering business tax, profit-seeking enterprise
income tax, outbound profits, undistributed earnings, and principal
calculation/document issues. Do not rank the structures using rates alone.

## Section 3: liabilities

- A branch is not a separate juristic person; branch debts are debts of the
  foreign company.
- A Taiwan subsidiary is a separate person. Limited-company shareholders are
  generally limited to contributions and company-limited-by-shares
  shareholders are generally limited to subscribed shares.
- Parent guarantees, director/responsible-person duties, veil abuse, torts,
  labor, tax, licensing, compliance, and group contracts may create other
  liability.
- Do not say a subsidiary blocks every risk or is always safer.
- Explain that contracts, insurance, internal controls, signing/payment
  authority, and compliance must reflect the real business risk.

## Section 4: financing and listing

After FAQ 3:

- a branch cannot issue its own equity, but do not expand this to say it
  cannot borrow or obtain any funding;
- for capital increases, local partners, employee equity, equity transfers,
  exits, reorganizations, or listing, a separate subsidiary can be easier to
  structure;
- a branch is not an independent issuer and cannot itself be listed;
- a subsidiary does not become listable merely because it is a company
  limited by shares. Address applicable market requirements for operating
  history, capital, profitability, share distribution, governance, internal
  controls, audit, and disclosure.

## Section 5: Article 10-1 investment credit

- The organization label alone does not determine tax incentives.
- Include exactly:
  `同一課稅年度內合計達新臺幣一百萬元以上、二十億元以下`.
- Article 10-1 applies from 2025-01-01 through 2029-12-31.
- Qualified companies or limited partnerships may apply for qualifying
  own-use investment in brand-new smart machinery, 5G, cybersecurity,
  AI products/services, and energy-saving/carbon-reduction hardware,
  software, technology, or technical services.
- The taxpayer chooses up to 5% of expenditure against current-year tax or up
  to 3% over three years from the current year.
- The Article 10-1 annual credit is capped at 30% of current-year
  profit-seeking enterprise income tax; combined credits and duplication
  restrictions require separate review.
- Do not confuse Article 10 R&D credits with Article 10-1 investment credits.
- Explicitly forbid `低於二十億元`, `少於二十億元`, `未滿二十億元`, or
  English `less than NT$2 billion`. The current Chinese statute says
  `二十億元以下`.

## Section 6: Taiwan-Korea treaty and PE

Use these exact dates:

- signed 2021-11-17;
- entered into force 2023-12-27;
- applicable from 2024-01-01.

State that the treaty source-territory ceilings on dividends, interest, and
royalties are each 10%, subject to all treaty and procedural requirements.
Business profits are generally exempt in the other territory when there is no
treaty PE there.

Cover at least:

- a fixed place such as a place of management, branch, or office;
- a construction project lasting more than six months;
- services exceeding 183 aggregate days in any 12-month period;
- a dependent agent that habitually exercises authority to conclude contracts.

A Taiwan branch ordinarily is a fixed-place PE, so its Taiwan business profits
are not automatically exempt. Do not use a single 183-day rule for all PE
questions. A subsidiary/parent PE question still depends on place use,
contract authority, and actual activity.

## Section 7: selection and exit

Use a checklist covering investors/shareholding/voting, foreign-company or
parent liability, contracts/employment/IP/premises/permits, income/costs/
retained earnings/dividends/branch remittance, investment approval/banking/
FX records, accounting/audit/transfer pricing/Korean tax, later capital/
partners/listing/reorganization/equity transfer, and suspension/exit.

State:

- Article 378: a foreign company that no longer wishes to operate in Taiwan
  must apply to nullify/cancel the branch registration; prior obligations and
  debts are not extinguished;
- Article 379: cancellation/nullification does not impair creditor rights or
  foreign-company obligations;
- Article 380: when all Taiwan branches are cancelled/nullified, Taiwan
  business rights and obligations must be liquidated and outstanding debts
  remain the foreign company's;
- a Taiwan subsidiary follows dissolution and liquidation as its own juristic
  person. Do not describe the two exit processes as identical.

## Exact official sources

Under `## 官方資料`, use exactly these ten links, once each, in this order:

1. `[全國法規資料庫—公司法](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=J0080001)`
2. `[全國法規資料庫—加值型及非加值型營業稅法第10條](https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=10&pcode=G0340080)`
3. `[全國法規資料庫—所得稅法](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=G0340003)`
4. `[財政部稅務入口網—營利所得扣繳說明](https://www.etax.nat.gov.tw/etwmain/tax-info/understanding/tax-q-and-a/national/individual-income-tax/withheld-rule/rule/3AmWR0R)`
5. `[財政部主管法規查詢系統—外商在我國境內分公司之盈餘課稅釋疑](https://law-out.mof.gov.tw/LawContent.aspx?id=GL002917)`
6. `[財政部稅務入口網—免辦未分配盈餘申報之營利事業](https://www.etax.nat.gov.tw/etwmain/tax-info/understanding/tax-q-and-a/national/profit-seeking-enterprise-income-tax/undistributed-surplus-earnings/om7pAeL)`
7. `[財政部—台韓所得稅協定生效及適用說明](https://www.mof.gov.tw/singlehtml/384fb3077bb349ea973e7fc6f13b6974?cntId=127fffb302f24987b0bbf1eff78ff9c9)`
8. `[全國法規資料庫—產業創新條例第10條之1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=10-1&pcode=J0040051)`
9. `[臺灣證券交易所—國內公司申請上市標準](https://www.twse.com.tw/zh/listed/method/standars.html)`
10. `[投資台灣入口網—外國公司分公司投資及登記程序](https://investtaiwan.nat.gov.tw/showPageengInvestmentStatus01?lang=eng&menuNum=7&search=InvestmentStatus01)`

## Exact internal links and ending

Under `## 相關資訊`, use only these three internal links, once each, in order:

1. `[台灣投資及公司設立服務](/zh-hant/services#investment)`
2. `[台灣公司設立基礎](/zh-hant/columns/taiwan-company-establishment-basics)`
3. `[聯絡我們](/zh-hant/contact)`

After those links, add a horizontal rule and exactly:

`本文僅供說明台灣子公司與外國公司分公司的一般差異及教育參考，不構成就任何個案提供的法律或稅務意見。適用的法令與稅務處理，可能因投資人及外國本公司所在地、事業內容、交易與資金流向、協定適用要件及主管機關最新實務而異；在實際辦理設立、投資、簽約、分配股利或匯款前，仍應依最新官方資料及個案情形另行確認。`

End with:

`**曾雋崴律師（Wei Tseng）**`

Nothing may follow the author.

## Length and read time

The body outside frontmatter must contain at least 5,000 visible Han
characters. Image alt text and link labels count; paths, URLs, and Markdown
syntax do not. Remove heading, list, blockquote, emphasis/backtick, and
horizontal-rule syntax, then count only:

`/\p{Script=Han}/gu`

Freeze the final exact count in the test. Set:

`minutes = Math.ceil(visibleHanCount / 400)`

and `read_time: "N分鐘閱讀"`.

Do not pad with repetition, invented clients, promotional copy, processing
times, or approval/tax/remittance/listing promises.

## Native Taiwan style

- Write for foreign businesses entering Taiwan, with Korean investors as an
  example rather than the only audience.
- Use complete connected paragraphs, not one-clause-per-line legacy prose.
- Prefer `原則上`, `可能`, `須依個案確認`, `符合要件時`, `不得僅因`.
- Separate company law, tax, treaty, accounting, and home-country rules.
- Use Taiwan wording including `營運`, `資訊`, `核准`, `申請`, `法令`,
  `課稅所得`, `資金流向`, `移轉訂價`, `法令遵循`.
- Use full-width Chinese punctuation and consistent Arabic dates/rates.
- Do not translate sentence-by-sentence from KO, JA, or EN.
- Do not add greetings, self-introduction, promotional ending, anecdotes,
  turnaround estimates, or invitations to comment/message.

## Forbidden content and leakage

Ban these literals and equivalent claims:

- `台灣公司設立 子公司 VS 分公司` or `VS` in title/H1/H2;
- branch ownership through `韓國企業100%持有`;
- treating branch non-shareholders as a prohibited shareholder class rather
  than explaining that a branch has no shareholders;
- `共同投資一定／只能設立子公司`;
- `子公司與分公司的實際稅負相同`;
- `外國人所得稅`;
- a subsidiary always has more tax than a branch;
- a branch always reduces Korean parent tax;
- branch-profit remittance is completely tax-free in every sense;
- a subsidiary isolates every parent-company liability or risk;
- a company limited by shares automatically may list;
- only subsidiaries receive tax incentives;
- innovative R&D automatically credits 30%;
- `二十億元未滿`, `低於二十億元`, `少於二十億元`,
  or English `less than`;
- treaty effective date `2023年12月2日`;
- every business profit is exempt without a fixed place;
- Taiwan branch profits are treaty-exempt;
- using only 183 days to decide every PE;
- treaty 10% without residence, beneficial-owner, and procedure conditions;
- `留言`, `私訊`, `快速回覆`, or guarantees of approval, tax saving,
  remittance, or listing.

Script and locale bans:

- no Hangul or Korean prose;
- no Japanese leakage such as `支店`, `本店`, `株主`, `許認可`,
  `投資稅額控除`;
- no English prose or legal substitutes including `subsidiary`, `branch`,
  `corporation`, `LLC`, `less than`; only established `PE`, `5G`, `AI`,
  URLs, and `Wei Tseng` are allowed;
- no Simplified Chinese forms such as `台湾`, `与`, `税`, `应`, `为`,
  `额`, `权`, `义务`, `股东`, `营业`, `投资`, `适用`, `独立`,
  `资料`, `发`, `办`, `缴`;
- no `/ko/`, `/ja/`, or `/en/` internal links;
- no incorrect author `曾俊瑋`;
- no BOM, NBSP, zero-width spaces/joiners, or word joiner.

## Test contract

The new test must directly read the source and exercise:

- `getColumnPost('taiwan-company-subsidiary-vs-branch', 'zh-hant')`;
- alias `getColumnPost('subsidiary-vs-branch', 'zh-hant')`.

Lock at least:

- exact frontmatter, H1, two images, and three FAQs;
- each FAQ answer repeated as the first paragraph after its assigned H2;
- exact order of nine H2s;
- safe Company Act Article 1/99/371/372/378/379/380 propositions;
- 5%/20%/21%/10%/5% rules with their qualifications;
- branch-profit remittance versus subsidiary dividends;
- undistributed-earnings filing exemption;
- liability principle and exceptions;
- listing, Article 10-1, treaty dates, and PE;
- exact ten official sources and three internal links once, in order;
- exact disclaimer, author, and nothing after the author;
- exact final visible-Han count and formula-derived read time;
- alias slug/title/content/FAQ equivalence;
- all forbidden strings, locale links, wrong identity, and hidden characters.

## Writer verification

1. `npx vitest run src/lib/__tests__/columns-zh-investment-004.test.ts src/lib/__tests__/columns-ko-investment-004.test.ts src/lib/__tests__/columns-ja-investment-004.test.ts src/lib/__tests__/columns-faq.test.ts`
2. `npm run -s typecheck`
3. `npx eslint src/lib/__tests__/columns-zh-investment-004.test.ts`
4. `git diff --check -- src/content/columns-zh/004-taiwan-company-subsidiary-vs-branch.md src/lib/__tests__/columns-zh-investment-004.test.ts`

## Manager gates

- independent Taiwan Traditional Chinese legal-editor review;
- independent Taiwan-law review;
- manager reruns every writer gate;
- desktop 1440×1000 and mobile 390×844 browser review at
  `/zh-hant/columns/taiwan-company-subsidiary-vs-branch`;
- status 200, `lang=zh-Hant`, exact H1/canonical/date/read time, three FAQ
  blocks and three FAQ JSON-LD items, ten official links, no horizontal
  overflow, and no console/page errors;
- actual clicks on 🇰🇷 KR, 🇯🇵 JP, 🇹🇼 TW, 🇺🇸 EN to the same slug under
  `/ko`, `/ja`, `/zh-hant`, and `/en`, with matching html lang.
