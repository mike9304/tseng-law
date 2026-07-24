# WO-I18N-JA-COL001 — Correct Japanese company-setup basics

Date: 2026-07-24 KST
Owner: delegated implementation worker
Manager: Codex `/root`

## Goal

Correct the Japanese company-setup basics column using current primary-source
facts. Preserve its explanatory depth and media, but remove universal,
unsupported, stale, and wrong-locale claims. This is a source correction only;
embedding regeneration waits until all column corrections are complete.

## Allowed files

1. `src/content/columns-ja/001-taiwan-company-establishment-basics.md`
2. `src/lib/__tests__/columns-ja-investment-001.test.ts` (new)

Do not edit any other file, including `column-embeddings.json`. Do not stage,
commit, push, deploy, or operate the development server.

## Frontmatter

- Title: `台湾での会社設立：基礎編`
- Keep the original publication/display date. Set `read_time` to `約8分` to
  match the corrected body length.
- Set `lastmod` to `2026-07-24`.
- Preserve exactly three FAQ entries.
- Replace the FAQ answers with the safe contracts below.

### FAQ 1 — entity forms

`台湾子会社（有限公司・股份有限公司）は台湾法上の独立した法人です。外国会社の台湾支店は独立した法人格を持たず、外国会社の一部として台湾で営業します。代表者事務所は営利活動を行う拠点ではなく、外国会社のための法律行為や連絡業務に限られます。責任、税務、許認可および政府調達への参加資格は、組織形態と個別案件に応じて確認する必要があります。`

### FAQ 2 — work permit / residence

`会社設立だけで就業許可または居留資格を取得できるわけではありません。台湾で会社を管理・運営する外国人は、職務、出資関係、雇用主の事業実績等について就業許可の要件を満たし、許可取得後にその在留目的に応じた居留証を別途申請する必要があります。`

### FAQ 3 — capital / employer qualifications

Use the exact current work-permit summary already approved in
`src/data/service-details-ja.ts` at
`japaneseServiceDetails.investment.keyPoints[2]`. Do not copy a shorter version
back into this article. The FAQ answer must match that string exactly.

## Body corrections

### Identity and unsupported market statistics

- Keep `曾雋崴`.
- Remove the undated “KOTRA total 107 companies” claim and the uncited
  2022/2023 trade-partner and investment-total numbers. Do not replace them
  with new marketing statistics.
- Keep the general, non-numerical observation that Korean businesses operate in
  multiple Taiwan industries.

### Entity comparison

Replace the three entity explanations with:

1. `台湾子会社（有限公司・股份有限公司）は台湾法上の独立した法人であり、台湾で営利活動を行えます。責任、資本構成、利益分配、税務および上場の可否は会社形態と個別事情に応じて確認する必要があります。`
2. `外国会社の台湾支店は独立した法人格を持たず、外国会社の一部として台湾で営業します。支店自体に株主を置く形態ではなく、本店がその債務・責任を負います。`
3. `代表者事務所は台湾で営利活動を行う拠点ではなく、外国会社のための法律行為や連絡業務に限られます。販売、役務提供その他の営業活動を行う場合は、子会社または支店等の適切な形態を検討する必要があります。`

Replace the bold tax-treaty paragraph after the subsidiary explanation with:

`台湾・韓国所得税協定は2023年12月27日に発効し、2024年1月1日から適用されています。配当、利子および使用料の上限税率は10％です。事業利得は、相手方の地域に協定上の恒久的施設（PE）がある場合等を除き、原則として居住地側で課税されます。PEには、管理場所・支店・事務所等の固定的施設、6か月を超える工事、いずれかの12か月間に合計183日を超える役務提供、契約締結権限を反復して行使する代理人等が含まれ得るため、役務提供の日数だけで判断せず、活動内容、期間、契約関係その他の個別事情を確認する必要があります。`

Do not retain the old shortcut that treats “12 months / 183 days” as the
only PE test or says that a period below the threshold automatically makes all
business profits exempt. The corrected treaty paragraph above intentionally
preserves the official service-PE threshold while explaining that other PE
types also exist.

### Establishment process

Replace `台湾で会社を設立する手続きは10段階あります` with:

`台湾子会社の設立では、一般に次のような主要手続を行います。手続の内容、順序および所要期間は、組織形態、投資額、業種、審査内容、銀行対応および書類補正の有無により異なります。`

Keep the numbered educational outline, but correct:

- step 2 to
  `委任状その他の外国文書の公証・認証（必要に応じて台湾の在外機関による認証）`;
- step 3 to `経済部投資審議司への投資申請（該当する場合）`;
- step 5 to `国外からの投資資金送金`;
- step 6 to `投資額審定`;
- step 7 to `会社設立登記`;
- step 10 to `輸出入、業種別許認可、就業許可・居留等の追加手続（該当する場合）`.

After the list, say it is an outline rather than a universal fixed sequence.

### Common questions in the body

1. Student:
   `外国人は在学中でも投資・会社設立を申請できますが、現在の在留資格で就労または会社経営が認められるとは限りません。投資手続、就業許可および居留資格はそれぞれ確認が必要です。`
2. Industries:
   `多くの業種で外国投資が可能ですが、禁止・制限業種、専門資格、営業場所および業種別許認可の確認が必要です。`
3. Work permit:
   use the FAQ 2 text exactly.
4. Family:
   `就業許可等に基づく居留証を取得した場合、配偶者および未成年の子は、要件を満たせば依親居留を申請できます。家族の居留は自動的に付与されるものではなく、個別の申請と審査が必要です。`
5. Capital:
   use the FAQ 3 exact work-permit summary. Precede it with:
   `会社設立自体について一律の法定最低資本金があるわけではありません。ただし、業種別の最低資本額、事業計画の合理性、銀行審査および就業許可上の雇用主要件は別途確認が必要です。`
7. Permanent residence:
   `一般の外国人は、原則として台湾で合法的に5年連続して居留し、各年183日以上滞在するなどの要件を満たす場合に永久居留を申請できます。外国専門人材には平均年間滞在日数等の別の計算基準があり、素行、資産・技能その他の法定要件も審査されます。就業許可または居留証を5年間保有しただけで自動的に永久居留となるわけではありません。`
8. Address:
   `会社設立には所在地が必要です。所在地と営業項目について、土地使用分区、建築管理、賃貸借条件および税籍登記上の適合性を事前に確認してください。台北市では、対象となる会社・商業登記について「営業場所事前照会」制度が運用されています。`
9. Tax:
   - general business-tax rate 5%, generally filed every two months;
   - general profit-seeking-enterprise income-tax rate 20%, subject to taxable
     income and applicable rules;
   - domestic non-resident dividend withholding rate 21%;
   - eligible Taiwan–Korea treaty dividends have a 10% ceiling, subject to
     treaty eligibility and procedures;
   - do not say a 183-day resident's dividend tax simply “starts at 5%”.

Use this exact replacement:

`台湾の営業税は、一般税率が5％で、通常は2か月ごとに申告します。営利事業所得税の一般税率は20％ですが、実際の課税は課税所得と適用規定により異なります。非居住者に支払う配当の台湾国内法上の源泉徴収率は21％です。台湾・韓国所得税協定の適用要件と手続を満たす配当については、上限税率10％が適用されます。具体的な申告・源泉徴収は、居住者区分、受益者、所得の種類および協定適用書類を確認して処理する必要があります。`

Remove the duplicated, inaccurate treaty paragraph near the end.

### Closing and links

- Remove any promise to respond `迅速に`.
- Replace all three KO footer links:
  - company guide → `/ja/services#investment`
  - lawyer → `/ja/lawyers/wei-tseng`
  - company-setup lawyer → `/ja/services#investment`
- Link labels must be Japanese and no `/ko/` may remain.

## Forbidden claims

- `投資審議委員会`, `投資審査委員会`, `投審会`;
- a universal `10段階`, fixed `3か月`;
- `単独株主` with a universal TWD 500,000 minimum;
- Taiwan partner automatically reducing capital to one third/TWD 170,000;
- company formation automatically obtaining a visa;
- representative office doing ordinary sales/services;
- treaty effective on `2023年12月2日`;
- PE/tax exemption determined solely by 12 months/183 days;
- resident dividend taxation summarized as starting at 5%;
- automatic family residence or permanent residence;
- `迅速にお答え`;
- `招標文書`;
- any `/ko/` link.

## Source basis

- Taiwan MOEA Department of Investment Review / Invest Taiwan process and
  entity guidance
- Ministry of Labor Arts. 38–39 and WDA foreign-manager guidance
- Taiwan Ministry of Finance, Taiwan–Korea income-tax agreement:
  entered into force 2023-12-27, effective 2024-01-01; dividends, interest and
  royalties capped at 10%; PE includes fixed, project (>6 months), service
  (>183 days in any 12-month period), and agency categories
- Taiwan tax portal: general 20% enterprise-income-tax rate, 5% business tax,
  21% non-resident dividend withholding
- National Immigration Agency 2026 permanent-residence guidance

## Required tests

- Read both the parsed JA post and raw Markdown.
- Assert exact frontmatter title, `lastmod`, three FAQs, and exact replacement
  FAQ answers.
- Assert the required official terms, dates, rates, qualifiers, process labels,
  family/permanent-residence caveats, and safe links.
- Assert all four treaty PE categories remain represented: fixed facilities,
  projects exceeding six months, services exceeding 183 days in a twelve-month
  period, and agents repeatedly exercising contract-conclusion authority.
- Assert every forbidden claim/term/link is absent.
- Assert `曾雋崴` and all existing image paths remain.
- Assert there is still substantial content and the related-column slug
  resolves through `getColumnPost(..., 'ja')`.
- Run the existing full Japanese-column corpus suite as a regression.

Independent Japanese/factual review and commit are manager gates.
