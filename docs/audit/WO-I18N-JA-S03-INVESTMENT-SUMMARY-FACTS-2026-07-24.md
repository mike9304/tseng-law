# WO-I18N-JA-S03 — Correct Japanese investment-service summary facts

Date: 2026-07-24 KST
Owner: implementation worker
Reviewer: independent Japanese/legal reviewer
Manager: root

## Objective

Correct only the published Japanese investment-service summary. Use current
Taiwan terminology and avoid presenting qualified rules as universal facts.

## Allowed files

- `src/data/site-content.ts`
- `src/data/__tests__/site-content-ja-services.test.ts`

No other file may be edited.

## Required exact copy

Keep the existing title, href, order, column links, and all other locales.
Replace the Japanese investment description with:

`韓国企業の台湾進出に際し、台湾子会社・台湾支店・代表者事務所等の組織形態の選定から、必要に応じた経済部投資審議司への投資申請、投資資金の送金・投資額審定、銀行口座の開設、営業場所の適法性確認まで一貫して支援します。化粧品の製品登録・PIF作成保存、自動車貨物運送業等の業種別許認可、解散・清算等による残余財産・投資資金回収の法的手続についてもご案内します。`

Replace the six detail strings with:

1. `台湾子会社（有限公司・股份有限公司）、台湾支店、代表者事務所の比較`
2. `経済部投資審議司への投資申請・投資額審定（該当する場合）`
3. `投資資金の送金、会社設立準備口座の開設・正式口座への切替え`
4. preserve `事業所の土地使用分区・用途適合性の事前確認`
5. `化粧品の製品登録・PIF作成保存、自動車貨物運送業等の業種別許認可`
6. `解散・清算、減資等による残余財産・投資資金回収の法的手続`

## Fact basis

- MOEA Department of Investment Review history:
  `https://mnscdn.moea.gov.tw/Mns/dir/content/Content.aspx?menu_id=42879`
- Invest Taiwan entity/process guidance:
  `https://investtaiwan.nat.gov.tw/showPagechtInvestmentStatus01?lang=cht&menuNum=7&search=InvestmentStatus01`
- TFDA phased PIF implementation:
  `https://www.fda.gov.tw/TC/siteListContent.aspx?id=46938&sid=10992`
- Current Motor Transportation Enterprise Review Regulations:
  `https://motclaw.motc.gov.tw/webMotcLaw2018/Law/ArticleContent?LawID=E0047045&akeyword1=5&stype=2&type=1`
- Company Act articles 9 and 24:
  `https://law.moea.gov.tw/LawContent.aspx?id=FL011292`

## Test contract

- Assert the exact description and six detail strings.
- Assert stale/misleading phrases are absent from the Japanese investment item:
  - `子会社・支店・有限会社`
  - `化粧品PIFや物流許認可`
  - `解散・清算による適法な資本回収`
- Preserve six service items, their order, detail counts, hrefs, and 16 related
  Japanese column links.
- Preserve KO, ZH-Hant, and EN content byte-for-byte.

## Gates

- Focused Japanese service-data tests.
- `npm run -s typecheck`
- scoped ESLint on the two allowed files
- `git diff --check`

Do not stage, commit, push, deploy, or operate the dev server.
