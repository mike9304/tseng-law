# WO-I18N-JA-COL013 — Correct Japanese company-setup practice Q&A

Date: 2026-07-24 KST
Owner: delegated implementation worker
Manager: Codex `/root`

## Goal

Rewrite the Japanese company-establishment practice Q&A as accurate,
source-grounded guidance. Remove stale agency names, fixed-duration promises,
bank-specific generalizations, stereotypes, anecdotes, and unsafe
wrong-locale links. Preserve the existing slug, publication date, and both
images. This is a source correction only; embedding regeneration waits until
all column corrections are complete.

## Allowed files

1. `src/content/columns-ja/013-taiwan-company-establishment-advanced-1.md`
2. `src/lib/__tests__/columns-ja-investment-013.test.ts` (new)

Do not edit any other file, including `column-embeddings.json`. Do not stage,
commit, push, deploy, or operate the development server.

## Frontmatter

- Title: `台湾会社設立：住所・銀行口座・審査の実務Q&A`
- Keep the original publication/display date.
- Set `lastmod` to `2026-07-24`.
- Set `read_time` to `約6分`.
- Add exactly five FAQ entries corresponding to the five body questions.
- Preserve the existing category and featured-image path.

Use these exact FAQ questions and answers:

1. `登記住所が未確定の段階では、どのように準備すべきですか？`

   `外国投資申請と会社登記では、求められる所在地情報・書類が異なります。申請時点では最新の申請様式と審査案内を確認し、会社登記までに賃貸借契約書、建物資料、所有者の同意その他の必要書類を準備します。予定地で営業項目を行えるかも、土地使用分区、建築管理および業種別許認可の観点から事前に確認してください。`

2. `台湾の居留証がなくても、会社口座の開設を相談できますか？`

   `銀行ごとに本人確認と口座開設に必要な資料が異なります。居留証がない場合に旅券、統一証号に関する資料その他の代替書類で相談できるかを含め、受理の可否と必要書類は口座開設前に銀行へ確認してください。会社準備口座と正式口座でも手続が異なり得ます。`

3. `学歴・職歴と予定する事業の分野が異なっていても申請できますか？`

   `学歴・職歴は事実に基づいて記載し、担当する職務、事業計画、資金、専門知識および事業を実行できる体制との関係を具体的に説明します。経歴の分野が異なることだけで結論が決まるとは限りませんが、虚偽または誇張した経歴を記載してはいけません。補足資料や説明が必要かは個別案件に応じて確認してください。`

4. `会社設立や就業許可を見込んで賃貸借契約を結ぶときの注意点は何ですか？`

   `会社設立、銀行手続、就業許可および居留の全工程に一律の処理期間はありません。契約開始日、内装期間、賃料免除、保証、追加保証金および公証の要否は、物件、当事者の合意および個別事情に応じて交渉します。許認可や営業場所の適合性を確認し、手続が遅れた場合の負担も契約前に検討してください。`

5. `一般のオフィスを飲食業などの営業場所として使えますか？`

   `使用の可否は、営業項目、土地使用分区、建物の用途、賃貸借条件および業種別許認可により異なります。一般のオフィスであることだけを理由に飲食業等を行えるとは限りません。台北市では対象となる会社・商業登記について営業場所事前照会制度が運用されているため、契約前に所在地と営業項目の適合性を確認してください。銀行の本人確認・口座審査はこれとは別の手続です。`

## Body

### Introduction

- Replace the unsupported success/visa-acquisition marketing claim with a
  neutral introduction to the five practical questions.
- Link the basics article internally to
  `/ja/columns/taiwan-company-establishment-basics`.
- Do not use emoji.

### 1. Address and foreign-investment review

- Use the bilingual designation
  `経済部投資審議司（Department of Investment Review, MOEA）` so the Japanese
  translation is anchored to the official English body name.
- Explain that the filing and review concern the investment plan, investor,
  source and use of funds, business activities, and submitted documents, but
  the required materials depend on the case and current official forms.
- Do not claim that an exact address is universally unnecessary or that only
  a city is always sufficient.
- Explain that foreign-investment filing and company registration have
  different address/document stages and should be prepared in parallel.
- Do not state a universal one-year capital-remittance deadline. Taiwan's
  Investment by Foreign Nationals Act Article 9 requires the approved capital
  contribution to be remitted in full within the prescribed period, the receipt
  to be reported for examination, and the total investment amount to be
  submitted for verification after implementation. The applicable approval and
  current instructions must be checked.
- Remove anecdotes about people fleeing and unsupported money-laundering
  prevalence.

### 2. Bank account without a residence certificate

- Keep the answer qualified and bank-specific.
- Explain only that banks require identity and account-opening documents and
  that requirements differ by institution and case. Do not impose one generic
  checklist or review rationale on every bank.
- Present a passport and unified-number-related or other substitute
  documentation only as items to ask the selected bank about; never say that
  every bank accepts them.
- Distinguish a preparatory account from the later company account.
- Do not promise same-day issuance or make crowd/time-of-day claims.

### 3. Education and career

- Require truthful, non-inflated information.
- Explain the relationship among the investor's experience, proposed role,
  business plan, capital/resources, and execution capability.
- Do not describe review as lax and do not advise applicants to “persuade” a
  reviewer with unrelated part-time work.

### 4. Lease timing and permits

- State that company establishment, bank procedures, work permit, and residence
  do not have one universal total duration.
- It is acceptable to explain that the WDA's published processing target for a
  complete professional work-permit application is seven working days online
  or twelve working days on paper, while clearly saying this is not the total
  company-establishment/residence timeline and excludes corrections and other
  agencies.
- Treat contract start, fit-out/rent-free periods, guarantees, additional
  deposits, and notarization as negotiable, case-specific terms.
- Remove generalizations about foreigners or landlords and remove any
  universal two-month deposit claim.

### 5. Business-location suitability

- Explain the separate checks for land-use zoning, building use, lease
  authority/terms, company/commercial registration, and industry permits.
- Use Taipei's `営業場所事前照会` only as a concrete example, not a nationwide
  universal procedure.
- Keep bank KYC/account review separate from location legality.
- Repair the broken `賃貸\n契約` sentence.

### Closing and links

- Replace the invitation to leave comments with neutral educational copy.
- Use these Japanese links and no `/ko/` links:
  - `/ja/services#investment`
  - `/ja/columns/taiwan-company-establishment-basics`
  - `/ja/contact`

## Forbidden claims and terms

- `投資審議委員会`, `投資審議委員會`, `投資審査委員会`, `投審会`
- `海外勢力`
- a universal `投資承認後1年以内`
- fixed total timelines `約3か月` or `約1か月`
- `逃亡`
- `資金洗浄の事例が非常に多い`
- `審査委員を説得`
- claims that review is not very strict
- `外国人は店舗を借りにくく`
- `家主は外国人への賃貸を嫌`
- a universal `通常2か月分`
- a universal bank site inspection or `必ず実地調査`
- guaranteed account opening, same-day document issuance, or crowd claims
- any `/ko/` link or external Korean-encoded basics link
- invitation to leave comments

## Source basis

- Investment by Foreign Nationals Act, especially Articles 7–9
- Invest Taiwan foreign-investment process and application guidance
- MOEA company-registration guidance
- WDA official professional work-permit processing-time guidance
- Current bank/KYC requirements are institution- and case-specific
- Taipei City company/commercial registration place-of-business prior inquiry

Primary URLs:

- `https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=J0040002`
- `https://investtaiwan.nat.gov.tw/showPage?lang=eng&search=55`
- `https://investtaiwan.nat.gov.tw/showPageengInvestmentStatus01?lang=eng&menuNum=7&search=InvestmentStatus01`
- `https://gcis.nat.gov.tw/mainNew/English/subclassEnAction.do?method=getFile&pk=11`
- `https://ezworktaiwan.wda.gov.tw/en/News_Content.aspx?n=35C4C6202979ECD0&s=8E117BF2FD606799&sms=2D58889BB41F75D7`

## Required tests

- Read both parsed JA post data and raw Markdown.
- Assert exact title, `lastmod`, `read_time`, exactly five FAQ entries, and the
  five exact FAQ question/answer contracts.
- Assert the bilingual current agency designation, the Article 9
  remittance/report/verification sequence, official WDA
  seven/twelve-working-day qualifier,
  location-law checks, bank-specific qualifications, truthful-history
  language, and safe Japanese links.
- Assert all forbidden claims/terms/links are absent.
- Assert `曾雋崴`, the featured image, and both body image paths remain.
- Assert substantial Japanese content and no Hangul remains.
- Assert the slug resolves through `getColumnPost(..., 'ja')`.
- Run the existing full Japanese-column corpus suite as a regression.

Independent factual and Japanese editorial reviews, browser checks, and commit
are manager gates.
