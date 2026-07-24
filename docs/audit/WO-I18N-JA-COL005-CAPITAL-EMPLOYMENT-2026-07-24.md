# WO-I18N-JA-COL005 — Correct Japanese capital-remittance and employment Q&A

Date: 2026-07-24 KST
Owner: delegated implementation worker
Manager: Codex `/root`

## Goal

Rewrite the Japanese company-establishment Q&A about Korea-to-Taiwan capital
remittance, Taiwan-held funds, bank-account conversion, online banking, and
foreign-worker permits. Remove universal bank rules and misleading statements
that the first foreign employee is unrestricted. Preserve the existing slug,
publication date, category, and both images. Embedding regeneration remains
deferred until the column corpus is corrected.

## Allowed files

1. `src/content/columns-ja/005-taiwan-company-establishment-advanced-2.md`
2. `src/lib/__tests__/columns-ja-investment-005.test.ts` (new)

Do not edit any other file, including `column-embeddings.json`. Do not stage,
commit, push, deploy, or operate the development server.

## Frontmatter

- Title: `台湾会社設立：資本金送金・銀行・外国人雇用の実務Q&A`
- Keep the original publication/display date and source URL.
- Set `lastmod` to `2026-07-24`.
- Set `read_time` to `約6分`.
- Add exactly five FAQ entries corresponding to the five body questions.
- Preserve the category and featured-image path.

Use these exact FAQ contracts:

1. `韓国から台湾会社の準備口座へ資本金を送金するとき、何を確認すべきですか？`

   `韓国居住者による台湾法人への出資は、韓国の外国為替制度上、海外直接投資の申告等が必要となる場合があります。資本金を送金する前に、申告先、指定外国為替銀行、申告時期、送金名義、必要書類および送金方法を利用銀行へ確認してください。本人来店、代理申請、オンライン手続の可否をすべての銀行について一律に断定することはできません。`

2. `台湾で保有する台湾ドルを会社の準備口座へ払い込めますか？`

   `承認された投資内容、資金の取得経緯、送金・払込方法および利用銀行の確認が必要です。台湾ドルで保有する資金を用いる場合は、適法な取得と資金の流れを示す資料を求められることがありますが、必要資料は給与、配当、事業所得その他の資金源と個別案件により異なります。国外から送金する場合も、資金源資料が常に不要とは限りません。`

3. `会社準備口座は、いつ正式な会社口座へ切り替えられますか？`

   `会社登記後、銀行が求める登記書類、代表権・本人確認資料その他の必要書類を提出し、銀行の確認を経て切替手続を行います。切替時期、会社責任者（代表者）本人の来店要否、追加資料および資金を利用できる時点は銀行と案件により異なるため、会社設立前に利用銀行へ確認してください。`

4. `正式口座への切替後、すぐにオンラインバンキングを利用できますか？`

   `オンラインバンキング、モバイルバンキング、送金限度額および認証方法は銀行の商品・審査・設定により異なります。台湾の携帯電話番号や利用実績を一律の要件とせず、申込時期、必要機器、代表者の本人確認、権限設定および利用開始日を選択した銀行に確認してください。`

5. `台湾会社が韓国人を雇用するとき、どの就業許可要件を確認しますか？`

   `韓国人を含む外国人が台湾で就労するには、予定する職務に対応する就業許可の区分と要件を満たす必要があります。台湾の制度上「一般僑外投資事業主管」と呼ばれる管理職区分で申請する場合でも、「最初の1名は無制限」ではありません。対象となる役職・出資関係、外国人本人の資格、雇用主の資本額・売上高等の要件および申請書類を確認し、就労開始前に許可を取得してください。`

## Body

### Introduction

- Link the preceding articles internally:
  - `/ja/columns/taiwan-company-establishment-basics`
  - `/ja/columns/taiwan-company-establishment-advanced-1`
- Introduce the five topics neutrally and do not use emoji.
- Use `曾雋崴`.

### 1. Korea-to-Taiwan capital remittance

- Explain that Korean overseas direct investment is a capital transaction and
  that applicable reporting/confirmation normally must be completed before the
  remittance.
- State that overseas direct investment transactions use a designated foreign
  exchange bank, while the competent/report-accepting body and required
  documents depend on the transaction and current Korean rules.
- Do not say every investor must personally visit a branch, cannot use a
  representative, or cannot use online banking. A representative may be
  possible with a power of attorney, and bank channels vary.
- Do not promise that a report is accepted automatically at the moment of
  remittance. Advise checking the reporting and remittance sequence in advance.
- Mention that missing required Korean reporting may lead to corrective,
  administrative, or other consequences, without promising a specific sanction.

### 2. Taiwan-held New Taiwan dollars

- Do not answer with an unconditional `可能です`.
- Explain that the payment must be consistent with the approved investment
  amount, contribution method, investor/remitter, and current investment
  instructions.
- Source-of-funds and transaction-flow evidence is case-specific. Salary,
  dividends, and business income may require different evidence; do not impose
  one document universally.
- Remove the claim that a Korea-origin remittance never needs source-of-funds
  documents.
- Explain that the bank records and supporting documents must allow the
  investment receipt/report and total-investment verification process to be
  completed.

### 3. Preparatory account to company account

- State that company-registration completion is a prerequisite for presenting
  the registered-company documents, but do not promise immediate conversion.
- Bank requirements, in-person attendance, additional review, account name,
  authority, and fund-availability timing are institution- and case-specific.

### 4. Online and mobile banking

- Remove any universal mobile-phone requirement and the unsupported six-month
  account-history example.
- Explain that channel availability, authentication, devices/phone numbers,
  transfer limits, corporate-user roles, and activation timing vary by bank and
  product.
- Do not promise immediate use.

### 5. Hiring a Korean or other foreign worker

- Replace the misleading `最初の1名の従業員には制限なし`.
- Explain first that foreign nationality does not itself create an
  unrestricted employment slot; the planned job must fit a work-permit
  category and permission is required before work starts.
- Introduce the Taiwan source-law term as
  `台湾の制度上「一般僑外投資事業主管」と呼ばれる管理職区分`.
  Explain `経理人` once as the Taiwan-law source term for a company or branch
  `経営管理者`; do not use standalone `主管`, `経理人`, or `経営責任者` in a
  way that Japanese readers could confuse with a competent authority,
  accounting staff, or the separate company representative concept.
- For this approved foreign-invested-business manager category, explain:
  - covered roles include the manager of a company in which overseas Chinese
    or foreign investors hold in aggregate more than one third of shares or
    capital, a foreign branch manager, and a representative-office
    representative, plus other officially recognized categories;
  - for the employer's first foreign hire under this manager category, only
    the specialized/technical-work education, experience, and average-salary
    standards are relaxed;
  - the role/ownership requirements, employer qualifications, application,
    and permit remain mandatory;
  - for more than one foreign hire in this category, the education/experience
    and average-salary standards follow the specialized/technical-work rules.
- Summarize current employer qualifications accurately:
  - established less than one year: one of paid-in capital/Taiwan working
    capital TWD 500,000, revenue TWD 3 million, import/export performance USD
    500,000, or agency commission USD 200,000;
  - established at least one year: one of Taiwan revenue TWD 3 million,
    import/export performance USD 500,000, or agency commission USD 200,000
    for the most recent year or the average of the preceding three years;
  - representative offices and special-recognition cases have separate rules.
- Other foreign employees must use the work-permit category applicable to
  their actual position; do not present the manager category as a blanket rule.

### Closing and sources

- Include neutral educational disclaimer copy, not a response-time promise.
- Include official source links:
  - Bank of Korea foreign-exchange payments/transactions
  - Bank of Korea administrative bodies
  - Invest Taiwan foreign-investment process
  - Invest Taiwan 2024 bank-account guidance
  - WDA foreign-invested-business manager guidance
- Use only these internal related links:
  - `/ja/services#investment`
  - `/ja/columns/taiwan-company-establishment-advanced-1`
  - `/ja/contact`

## Forbidden claims and terms

- universal personal bank visit: `本人が直接韓国の銀行に出向き`
- `代理送金はできません`
- `インターネットバンキング.*できません`
- report accepted only/automatically at remittance
- unconditional `可能です` for Taiwan-dollar payment
- universal source-document checklist for salary/dividend funds
- `韓国の銀行口座から送金する場合は、資金の出所に関する書類を添付する必要はありません`
- universal immediate conversion or online-banking activation
- universal phone-number requirement
- unsupported `6か月以上` account-history rule
- `最初の1名の従業員には制限なし`
- description of every foreign employee as a foreign-invested-business manager
- any `/ko/` link or Korean-encoded external preceding-article link
- any Hangul

## Source basis

- Bank of Korea: capital transactions generally require applicable procedures
  such as prior notification; overseas direct investment transactions use a
  designated foreign exchange bank; most implementation authority is delegated
  to foreign exchange banks.
- Taiwan Investment by Foreign Nationals Act Article 9 and Invest Taiwan
  investment process: approved contribution, receipt/report, and investment
  amount verification.
- Invest Taiwan 2024 bank-account guidance: account-opening documents differ
  by resident/registration status.
- WDA current foreign-invested-business manager page and qualification
  standards Articles 38–39.

Primary URLs:

- `https://www.bok.or.kr/eng/main/contents.do?menuNo=400191`
- `https://www.bok.or.kr/eng/main/contents.do?menuNo=400189`
- `https://investtaiwan.nat.gov.tw/showPageengInvestmentStatus01?lang=eng&menuNum=7&search=InvestmentStatus01`
- `https://investtaiwan.nat.gov.tw/faqQContent?lang=eng&search=94`
- `https://investtaiwan.nat.gov.tw/eBook/BravoTaiwan/2024ebook_en/files/basic-html/page55.html`
- `https://ezworktaiwan.wda.gov.tw/cp.aspx?n=A88DC323EF7C85FF`

## Required tests

- Read both raw Markdown and the parsed Japanese post.
- Assert exact title, dates, read time, category, source URL, exactly five FAQs,
  and exact FAQ q/a contracts.
- Extract each numbered body's heading and immediate first answer paragraph;
  compare the five ordered pairs directly with the FAQ array.
- Assert the qualified Korean reporting/designated-bank guidance, Taiwan
  investment receipt/verification sequence, case-specific banking terms, and
  WDA manager/employer rules and all numerical thresholds.
- Extract the full `設立から1年以上の会社では` paragraph and assert within
  that paragraph the recent-one-year/preceding-three-year-average qualifier and
  all three applicable thresholds; do not let the under-one-year bullets alone
  satisfy those assertions.
- Assert every forbidden claim/term/link is absent.
- Preserve `曾雋崴`, the featured image, and both original image paths.
- Assert no Hangul remains, content is substantial, and both canonical and
  alias slugs resolve in Japanese.
- Run the existing full Japanese-column corpus suite as a regression.

Independent factual, Japanese editorial, browser, and manager verification are
required before commit.
