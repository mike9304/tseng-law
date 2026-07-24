# WO-I18N-JA-COL004 — Correct Japanese subsidiary-versus-branch guidance

Date: 2026-07-24 KST
Owner: delegated implementation worker
Manager: Codex `/root`

## Goal

Rewrite the Japanese Taiwan subsidiary-versus-branch column using current
primary-source facts. Correct the legal nature of a branch, separate domestic
tax rates from treaty relief, distinguish dividends from branch profit
remittances, remove the stale treaty date and unsupported Korean-parent loss
claim, and replace the obsolete generic R&D credit description. Preserve the
article's comparison depth and media.

## Allowed files

1. `src/content/columns-ja/004-taiwan-company-subsidiary-vs-branch.md`
2. `src/lib/__tests__/columns-ja-investment-004.test.ts` (new; create it)

Do not edit embeddings or any other file. Do not stage, commit, push, deploy,
or operate the development server. Preserve other agents' work.

## Frontmatter

- title: `台湾進出：子会社と支店の違い`
- preserve source URL, display/publication date, category, and featured image;
- set `lastmod` to `2026-07-24`;
- set `read_time` to `約7分`;
- preserve exactly three FAQs with the exact contracts below.

### FAQ 1 — legal form and joint ownership

Question:

`台湾支店に台湾人や台湾法人を株主として参加させることはできますか？`

Answer:

`支店は外国会社の一部であり、支店自体に株主は存在しません。第三者と台湾事業へ共同出資したい場合は、台湾子会社を設立して株主構成を定める方法等を検討します。責任、議決権、資金調達、許認可および税務は、出資関係と事業計画に応じて確認する必要があります。`

### FAQ 2 — tax comparison

Question:

`台湾子会社と台湾支店では、税負担にどのような違いがありますか？`

Answer:

`子会社と支店はいずれも、一般に営業税5％および営利事業所得税20％の対象となります。台湾子会社が国外の親会社へ配当する場合、国内法上の源泉徴収率は21％ですが、台湾・韓国所得税協定の適用要件を満たすと上限10％です。外国会社の台湾支店の税引後利益を本店へ送金することは配当ではなく、原則として追加の源泉徴収はありません。総機構が台湾国外にある事業者は、未分配利益に対する5％の追加課税の申告対象外です。`

### FAQ 3 — listing and incentives

Question:

`台湾での上場や投資税額控除は、子会社と支店のどちらで利用できますか？`

Answer:

`支店は独立した発行会社ではないため、台湾で上場主体にはなれません。子会社の上場には、会社法および証券取引所の所定要件を満たす必要があります。税制優遇は組織形態だけで一律に決まるものではありません。産業創新条例第10条の1の投資税額控除等について、対象投資、申請期限、控除方法、重複適用および税額上限を個別に確認する必要があります。`

## Body contract

Write a coherent, natural Japanese comparison article. Preserve both image
paths and `曾雋崴`. Use headings and a readable table where helpful.

Editorial terminology:

- use `出資者`, not `投資者`, for a person/entity joining the shareholding;
- use `居住者証明書`, not the incomplete document label `居住者証明`;
- use the tax term `移転価格`, not `取引価格`;
- avoid adjacent paragraphs that repeat the same branch-liability,
  branch-listing, or incentive qualification.

### 1. Legal identity and ownership

- A Taiwan subsidiary is an independently incorporated Taiwan company.
- A Taiwan branch is a branch establishment of its foreign head office and has
  no separate legal personality.
- Do not say a branch is `100％所有` by the Korean company or that Taiwanese
  people cannot be its shareholders. A branch has no shareholder structure.
- Joint investment with a third party generally points toward a subsidiary or
  another separately incorporated vehicle, subject to the actual arrangement.

Use the FAQ 1 answer exactly in the body.

### 2. Tax comparison

Use a qualified table and prose that accurately state:

- general business-tax rate: 5%; generally filed every two months;
- general profit-seeking-enterprise income-tax rate: 20%;
- Taiwan subsidiary dividend paid to an overseas parent:
  domestic-law withholding 21%, but eligible Taiwan–Korea treaty dividend
  ceiling 10%;
- foreign-company Taiwan branch after-tax profit transfer to the head office:
  not a dividend distribution and generally no additional Taiwan withholding;
- an enterprise whose head office is outside Taiwan is exempt from the
  undistributed-earnings return/additional 5% tax; do not describe branch
  profits as a dividend distribution.

After the table, include the FAQ 2 answer exactly as the authoritative summary.

Do not conclude that a subsidiary is always more heavily taxed. Explain that
taxable income, retained earnings, treaty eligibility, expenses, losses,
financing, remittance, and the tax rules of the parent company's jurisdiction
all affect the result.

Replace the unsupported Korean-parent loss statement with:

`台湾支店の損益は外国本店との関係で処理されますが、韓国側で損失をどのように扱えるかは、韓国税法、会計基準、外国税額控除その他の制度により異なります。台湾支店を選べば韓国親会社の税負担が必ず減るとはいえません。`

### 3. Liability

- A branch and its head office are the same legal entity; branch liabilities
  are liabilities of the foreign company.
- A subsidiary is a separate legal person. A shareholder is generally liable
  only to the extent of its contribution, but contractual guarantees, director
  duties, torts, labor, tax, regulatory, and group-company arrangements require
  separate review.
- Do not promise that the subsidiary always isolates every risk.

Use this exact paragraph:

`支店は外国本店と同じ法人であるため、支店の債務は外国会社の債務となります。子会社は独立した法人であり、株主は原則として出資額を限度に責任を負います。ただし、親会社の保証、取締役の義務、不法行為、労働、税務、規制およびグループ会社間の契約等によって別の責任が生じる場合があるため、子会社を設立すればすべてのリスクが遮断されるとは限りません。`

### 4. Financing and listing

Use:

`支店は独立した発行会社ではないため、台湾で上場主体にはなれません。台湾子会社が上場を申請するには、会社法に基づく発行会社であることに加え、台湾証券取引所等の設立年数、資本、収益、株式分散、内部統制その他の所定要件を満たす必要があります。`

Explain that the suitable vehicle also depends on future equity financing,
local partners, employee equity, reorganization, and exit plans. Do not say
only a subsidiary in one named form is universally eligible without the other
listing requirements.

When describing third-party capital, distinguish equity from debt. Say that a
branch cannot issue its own shares or equity interests; do not broadly imply
that no third party can ever provide financing.

### 5. Investment tax incentives

Remove the claim that incentives are available only to subsidiaries and the
generic `革新的な研究開発支出` claim.

Use:

`税制優遇は、子会社か支店かという名称だけで一律に決まるものではありません。現行の産業創新条例第10条の1には、一定の新品のスマート機械、5G、サイバーセキュリティ、AI製品・サービス、省エネ・脱炭素関連設備または技術への投資に関する投資税額控除があり、控除額には当年度の営利事業所得税額の30％という上限があります。対象者、投資内容、金額、申請期限、控除方法および他の優遇との関係を個別に確認してください。`

### 6. Taiwan–Korea treaty and PE

Use the exact current dates and a non-misleading PE explanation:

`台湾・韓国所得税協定は2023年12月27日に発効し、2024年1月1日から適用されています。配当、利子および使用料の上限税率は10％です。事業利得は、相手方の地域に協定上の恒久的施設（PE）がある場合等を除き、原則として居住地側で課税されます。PEには、管理場所・支店・事務所等の固定的施設、6か月を超える工事、いずれかの12か月間に合計183日を超える役務提供、契約締結権限を反復して行使する代理人等が含まれ得ます。台湾支店は通常、台湾の固定的施設に当たるため、支店の台湾事業利得が当然に免税になるわけではありません。`

### 7. Decision and closing

Conclude that the choice depends on ownership, liability, tax/remittance,
licenses, banking, accounting, financing/listing, employment, and exit plans.
Remove comment/DM invitations and response-speed promises.

Use only:

```markdown
> 関連リンク:
> - [台湾投資・会社設立サービス](/ja/services#investment)
> - [台湾会社設立の基礎](/ja/columns/taiwan-company-establishment-basics)
> - [お問い合わせ](/ja/contact)
```

## Forbidden claims and strings

- `支店は韓国企業が100％所有`;
- a branch described as having or excluding shareholders;
- `付加価値税` as the primary Taiwan tax label;
- `外国人所得税` as the dividend-tax label;
- a universal conclusion that the subsidiary always pays more tax;
- a guarantee that branch losses reduce Korean parent tax;
- incentives `子会社のみ`;
- generic `革新的な研究開発支出` as the current 30% credit;
- `股份有限公司形態の子会社のみが上場`;
- treaty date `2023年12月2日`;
- PE exemption based solely on one duration shortcut;
- `迅速にお答え`;
- comment or DM channel promises;
- any `/ko/` link.

## Source basis

- Company Act:
  `https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=J0080001`
- Business Tax Act Article 10:
  `https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=10&pcode=G0340080`
- MOF business-tax and profit-seeking-enterprise tax guidance:
  `https://www.etax.nat.gov.tw/etwmain/tax-info/understanding/tax-q-and-a/national/business-tax/collection-prcedure/oVL9pwM`
  and
  `https://www.etax.nat.gov.tw/etwmain/tax-info/understanding/tax-q-and-a/national/profit-seeking-enterprise-income-tax/file-payment/62nOrYR`
- MOF withholding guidance:
  `https://www.etax.nat.gov.tw/etwmain/alien-tax-service/alien-tax-faq/KK9Y76o`
- MOF foreign-branch profit ruling:
  `https://law-out.mof.gov.tw/LawContent.aspx?id=GL002917`
- MOF undistributed-earnings exemptions:
  `https://www.etax.nat.gov.tw/etwmain/tax-info/understanding/tax-q-and-a/national/profit-seeking-enterprise-income-tax/undistributed-surplus-earnings/om7pAeL`
- Taiwan–Korea income-tax agreement:
  `https://www.mof.gov.tw/eng/singlehtml/f48d641f159a4866b1d31c0916fbcc71?cntId=e1e57a4211474ff9b5d63a83b30dcf10`
- Industrial Innovation Statute Article 10-1:
  `https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=10-1&pcode=J0040051`
- TWSE listing standards:
  `https://www.twse.com.tw/zh/listed/method/standars.html`

## Required tests

Read raw Markdown and `getColumnPost(..., 'ja')`. Assert:

- exact title, lastmod, display date, read time, and three exact FAQs;
- source URL, both original image paths, `曾雋崴`, and substantial content;
- the FAQ 1 answer appears exactly in the body, locking the legal-person and
  shareholder distinction;
- general 5%/20% rates, every two months, dividend 21%/treaty 10%, branch
  remittance, and foreign-head-office undistributed-earnings exemption through
  an exact body occurrence of the FAQ 2 answer;
- the exact Korean-parent loss qualification paragraph;
- the exact branch/head-office and qualified subsidiary-liability paragraph;
- the exact listing paragraph;
- exact current investment-credit paragraph;
- exact treaty paragraph, all four PE categories, and branch-PE caveat;
- exact three JA links and every forbidden claim absent;
- `出資者`, `居住者証明書`, and `移転価格` are present, while the stale forms
  `投資者`, `居住者証明や`, `取引価格`, and
  `第三者から支店への出資` are absent;
- no Hangul in title or rendered body; canonical slug resolves.

Run focused Vitest, the Japanese-column corpus regression, mobile overflow
regression, typecheck, scoped ESLint, and `git diff --check`.
