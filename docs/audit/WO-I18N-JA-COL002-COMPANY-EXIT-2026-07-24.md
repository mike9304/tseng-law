# WO-I18N-JA-COL002 — Correct Japanese company exit and capital-return guidance

Date: 2026-07-24 KST
Owner: delegated implementation worker
Manager: Codex `/root`

## Goal

Rewrite the Japanese column about ending a Taiwan company so it clearly
distinguishes company assets, capital reduction, dissolution, liquidation,
residual-property distribution, insolvency, suspension, and tax filings. Remove
the current overbroad description of Company Act Article 9 and all KO-locale
links. This is a source correction only; do not touch embeddings.

## Allowed files

1. `src/content/columns-ja/002-withdraw-capital-taiwan-company.md`
2. `src/lib/__tests__/columns-ja-investment-002.test.ts` (new)

Do not edit any other file. Do not stage, commit, push, deploy, or operate the
development server. Preserve other agents' work.

## Frontmatter

- title: `台湾会社を終了するとき、出資金はどう扱われますか？`
- preserve the source URL, display/publication date, category, and featured
  image;
- set `lastmod` to `2026-07-24`;
- set `read_time` to `約5分`;
- preserve exactly three FAQ entries, replacing them with the exact contracts
  below.

### FAQ 1 — permanent exit versus lawful alternatives

Question:

`台湾会社の資金を株主へ戻すには、必ず解散・清算が必要ですか？`

Answer:

`会社を恒久的に終了する場合は、原則として解散登記と清算を行い、債務・税務を処理した後の残余財産を株主へ分配します。会社を存続させたまま出資を返還する場合は、会社形態に応じた減資その他の適法な手続を検討します。通常の事業経費、配当、借入金の返済等は、それぞれの法的・税務上の根拠と手続を確認する必要があります。`

### FAQ 2 — dissolution resolutions and registration

Question:

`会社解散の決議要件と登記期限はどうなっていますか？`

Answer:

`有限公司の解散には株主の議決権の3分の2以上の同意が必要です。股份有限公司では、原則として発行済株式総数の3分の2以上を代表する株主が出席し、出席株主の議決権の過半数で決議します。公開発行会社で前記の出席数に達しない場合は、発行済株式総数の過半数を代表する株主が出席し、出席株主の議決権の3分の2以上で決議できます。定款により、より高い要件が定められている場合があります。解散登記は解散後15日以内に申請します。`

### FAQ 3 — suspension

Question:

`すぐに解散せず、会社を休業させることはできますか？`

Answer:

`1か月以上休業する会社は、休業前または休業開始後15日以内に休業登記を申請し、1回の休業期間は最長1年です。ただし、休業した年度も年度の所得税申告が必要であり、税務申告が一律に不要になるわけではありません。税目、保有資産、従業員その他の事情に応じた義務を個別に確認してください。`

## Body contract

Write a coherent Japanese article rather than patching isolated sentences.
Preserve both image paths. Use the following structure and facts.

### Introduction and core distinction

- Explain that company assets belong to the company and are not automatically
  the shareholder's personal property.
- A company that will permanently cease must generally register dissolution
  and complete liquidation, then distribute `残余財産` only after debts and
  taxes are handled.
- Do not call the distributed property `資本金` or `残余財産（資本金）`.
- Explain that a continuing company may consider lawful capital reduction and
  that ordinary expenses, dividends, and genuine loan repayment are separate
  legal/tax categories.

### Company Act Article 9 — exact and narrow

Use this exact paragraph:

`会社法（公司法）第9条は、会社が受け取るべき払込金（股款）について、実際には払い込まれていないのに全額払込済みと表示した場合、または登記後に払込金を株主へ返還し、もしくは株主による回収を許した場合について、5年以下の有期刑、拘留または50万以上250万新台湾ドル以下の罰金を定めています。通常の適法な会社資金の使用一般を処罰する規定ではありません。`

Retain the Article 90 safeguard accurately:

`清算人が会社の債務を弁済する前に会社財産を株主へ分配した場合、会社法第90条により、1年以下の有期刑、拘留または6万新台湾ドル以下の罰金が科され得ます。`

Do not assert breach of trust automatically. Say only that other civil,
criminal, and tax consequences depend on the facts.

### Permanent exit process

Give a qualified, educational outline:

1. Confirm contracts, employees, permits, assets, debts, taxes, litigation,
   bank accounts, and foreign-investment/remittance issues.
2. Adopt the dissolution resolution:
   - LLC threshold from Company Act Article 113;
   - corporation threshold and public-company special rule from Article 316,
     exactly as stated in FAQ 2.
3. Apply for dissolution registration within 15 days after dissolution, based
   on Company Registration Regulations
   (`会社登記規則（公司登記辦法）第4条`).
4. For profit-seeking-enterprise income tax specifically, file the
   current-period final return within 45 days after the competent authority
   approves the dissolution, under Income Tax Act Article 75 and MOF guidance.
5. Select/confirm the liquidator, make the court report, prepare the asset
   inventory and balance sheet, close current business, collect claims, pay
   debts and taxes, and handle creditor procedures as applicable. Avoid a
   universal fixed duration.
6. After debts and taxes, distribute only the remaining `残余財産`.
7. File the liquidation-income return within 30 days after liquidation ends
   and make the required liquidation-completion report.

State that merger, split, and bankruptcy dissolutions may be exempt from the
ordinary liquidation process.

### Insolvency

Replace the false solvent-only liquidation rule with:

`解散後の清算は、会社の資産が負債を上回る場合だけに限られるものではありません。会社法第89条によれば、会社財産が債務を弁済するのに不足するとき、清算人は直ちに破産宣告を申し立てなければなりません。債務超過、支払不能、担保、租税債務および債権者数を確認し、通常清算を続けられるかを個別に判断します。`

### Capital reduction

Explain that capital reduction is a possible way to return part of an
investment while keeping the company, but it requires the resolution,
creditor-protection, capital verification/accounting, foreign-investment, tax,
remittance, and change-registration procedures applicable to the company form.
Do not imply it is an informal withdrawal or always available.

### Suspension

Use the FAQ 3 answer exactly in the body, then add:

`休業中も、所在地、責任者、定款、資本額等に変更があれば、必要な変更登記を行います。車両や建物等を保有している場合は、地方税その他の負担も別途確認してください。恒久的に事業を終了する場合、休業は解散・清算の代わりにはなりません。`

### Closing and safe JA links

Close without response-time promises or unsupported channels. Use only:

```markdown
> 関連リンク:
> - [台湾投資・会社設立サービス](/ja/services#investment)
> - [台湾会社設立の基礎](/ja/columns/taiwan-company-establishment-basics)
> - [お問い合わせ](/ja/contact)
```

No `/ko/` path may remain.

## Forbidden claims and strings

- `残余財産（資本金）` or `資本金（残余財産）`;
- generic `会社資金を直接持ち出すと` followed by the Article 9 penalty;
- Article 9 described as applying to all ordinary company spending;
- automatic `背任罪`;
- liquidation only when assets exceed liabilities;
- bankruptcy requiring the article's old two-condition shortcut;
- `次の期には税務申告をしなくてもよい`;
- a universal fixed liquidation duration;
- `営業停止処分` as an automatic result of leaving the company alone;
- `会社登記法第4条` (wrong instrument name);
- `直接韓国へ送金`;
- any `/ko/` link.

## Source basis

- Taiwan Company Act Articles 9, 24, 89, 90, 113, and 316:
  `https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=J0080001`;
- Company Registration Regulations (`公司登記辦法`) Articles 3 and 4;
- Taiwan Ministry of Economic Affairs Business Development Administration:
  dissolution registration within 15 days; suspension before/within 15 days,
  maximum one year per period, and continuing change-registration duties:
  `https://gcis.nat.gov.tw/mainNew/subclassNAction.do?method=getFile&pk=3`;
- Income Tax Act Article 75 and Ministry of Finance tax portal:
  current-period final return within 45 days; liquidation-income return within
  30 days; a business suspended during the year still files its annual return:
  `https://www.etax.nat.gov.tw/etwmain/tax-info/understanding/tax-q-and-a/national/profit-seeking-enterprise-income-tax/liquidation-procedure/x6mOPan`.

## Required regression tests

Read both raw Markdown and `getColumnPost(..., 'ja')`. Assert:

- exact title, lastmod, display date, read time, and exactly three exact FAQs;
- the two original image paths and source URL remain;
- exact Article 9 paragraph and the Article 90 safeguard;
- the LLC, corporation, and public-company vote thresholds;
- `会社登記規則（公司登記辦法）第4条`, dissolution registration within
  15 days, final return within 45 days, and liquidation return within 30 days;
- residual property, qualified bankruptcy, capital reduction, suspension
  timing/one-year limit, annual return, and change-registration caveats;
- exact three JA links and no KO links;
- every forbidden claim/string is absent;
- no Hangul appears in title or body;
- substantial content remains and the canonical slug resolves.

Run the focused test, the existing Japanese-column corpus regression,
typecheck, scoped ESLint, and `git diff --check`.
