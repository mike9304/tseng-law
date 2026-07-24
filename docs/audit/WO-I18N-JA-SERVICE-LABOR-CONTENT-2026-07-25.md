# WO-I18N-JA-SERVICE-LABOR — Approve Japanese labor-service content

Date: 2026-07-25 KST
Owner: delegated implementation worker
Manager: Codex `/root`

## Goal

Add a current, primary-source-checked and professionally edited Japanese
`labor` record to `src/data/service-details-ja.ts`.

This unit approves data only. It does not publish `/ja/services/labor`.
Route, language-switch and sitemap changes belong to a later reviewed unit.

## Allowed files

1. `src/data/service-details-ja.ts`
2. `src/data/__tests__/service-details-ja-investment.test.ts`
3. `src/data/__tests__/service-details-ja-labor.test.ts` (new)

No other file may be modified.

## Exact Japanese contract

Add this exact `labor` entry after `family`:

```ts
labor: {
  title: '台湾の労働法・雇用紛争',
  subtitle: '解雇、退職金（台湾法上の「資遣費」）、労働契約をめぐる問題への対応を日本語で支援',
  intro:
    '昊鼎国際法律事務所は、台湾における解雇、資遣費、賃金・労働時間、労働契約、最低勤務期間などをめぐる雇用紛争について、台湾進出企業側・労働者側のいずれの立場からも、日本語で助言します。労働契約終了の法的根拠、予告、給付、期限および証拠を事案ごとに確認し、社内対応、交渉、労使紛争の調停（労資争議調解）および訴訟への対応を支援します。',
  keyPoints: [
    '台湾の労働契約終了は、「経済解雇・懲戒解雇・自己都合退職」の三類型だけで判断できるものではありません。雇用主が予告して契約を終了できる労働基準法第11条の事由、予告なしに終了できる同法第12条の事由、労働者が予告なしに終了できる同法第14条の事由、定期契約の満了などを区別し、契約形態、終了原因および手続に応じて、予告の要否、資遣費の支給、必要な証明書類など、個別の手続と法的効果を確認する必要があります。',
    '資遣費の計算は、適用される新制・旧制の勤続期間によって異なります。労工退職金条例（勞工退休金條例）の新制が適用される勤続期間について、労働契約が法定の対象事由により終了した場合、原則として勤続1年につき平均賃金の2分の1か月分を支給し、1年未満は比例計算、上限は平均賃金6か月分で、契約終了後30日以内に支給します。旧制が適用される勤続期間は、原則として勤続1年につき平均賃金1か月分を基礎とし、端数期間には別の計算規則があります。新旧両制度の勤続期間が混在する場合は、各期間を分けて確認します。',
    '労働基準法第14条は、雇用主による賃金不払、雇用主側の暴行・重大な侮辱、健康を害するおそれのある業務について必要な改善がない場合、雇用主が労働契約または労働法令に違反して労働者の権益を害するおそれがある場合などに、労働者が予告なしに契約を終了できる事由を定めています。同条第1項第1号または第6号に基づく終了には30日の期間制限があり、第1号は事由を知った時から、第6号については、権益が損なわれた場合、その結果を知った時から起算されるため、すべての第14条事由に一律の期限があると扱わず、該当号と起算点を確認する必要があります。',
    '最低勤務期間条項が有効かどうかは、個別の要件に照らして判断する必要があり、一律に無効となるものではありません。労働基準法第15-1条では、雇用主が専門技術訓練を実施してその費用を負担する場合、または最低勤務期間を守るための合理的な補償を提供する場合のいずれかに該当し、さらに訓練期間・費用、代替人員の確保可能性、補償の額・範囲その他の事情を総合して合理的な範囲内であることが必要です。これらの要件に反する条項は無効となり、労働者の責めに帰すことのできない理由で期間満了前に契約が終了した場合、労働者は、最低勤務期間条項に違反したことによる責任や訓練費用の返還責任を負いません。',
    '証拠の保存では、労働契約書、就業規則、給与明細・振込記録、出退勤・残業記録、業績評価、配置転換・減給・契約終了に関する通知、電子メールやチャットを、日時と出所を確認できる元の形式のまま適法に保全し、時系列を整理します。録音が常に許されるとは限らず、録音データが常に証拠として採用されるわけでもありません。録音を検討する場合は、録音者の会話への参加状況、取得方法、プライバシーや通信の秘密、社内規程および利用目的を個別に確認し、他人のアカウントへの無断アクセス、機器の無断設置、データ改変、営業秘密・個人情報の過剰な持ち出しは避けます。',
  ],
},
```

## Factual boundaries

- Do not say severance is available only when a company dismisses a worker.
- Do not reduce all endings to exactly three universal categories.
- Do not say voluntary resignation can never lead to severance; Article 14
  statutory termination must be considered separately.
- Do not apply a 30-day period to every Article 14 ground. Preserve the
  Article 14(1) item 1/item 6 distinction and their trigger wording.
- Do not apply the new-system half-month formula to old-system service or
  omit the new-system six-month cap and proportional partial-year rule.
- Do not say a minimum-service-period clause is almost always invalid.
  Preserve both Article 15-1 threshold alternatives, reasonableness factors
  and the non-attributable-termination protection.
- Do not tell every user to record a meeting. Evidence must be obtained and
  used lawfully.
- Do not retain the stale 2024 minimum-wage figures of monthly TWD 27,470 and
  hourly TWD 183.
- Do not hard-code a current minimum wage in this durable service-detail
  record; verify the threshold applicable to each matter at the time of use.
- Do not promise a result, response time, exact fee or automatic entitlement.

## Official sources

- Labor Standards Act Article 11 — employer termination with notice:
  `https://laws.mol.gov.tw/flaw/FLAWDOC01.aspx?flno=11&id=FL014930`
- Labor Standards Act Article 12 — employer termination without notice:
  `https://laws.mol.gov.tw/flaw/FLAWDOC01.aspx?flno=12&id=FL014930`
- Labor Standards Act Article 14 — worker termination and specific 30-day
  rules:
  `https://laws.mol.gov.tw/flaw/FLAWDOC01.aspx?flno=14&id=FL014930`
- Labor Standards Act Article 15-1 — minimum-service-period clauses:
  `https://laws.mol.gov.tw/flaw/FLAWDOC01.aspx?flno=15-1&id=FL014930`
- Labor Standards Act Article 17 — old-system severance:
  `https://laws.mol.gov.tw/flaw/FLAWDOC01.aspx?flno=17&id=FL014930`
- Labor Pension Act Article 12 — new-system severance:
  `https://laws.mol.gov.tw/FLAW/FLAWDAT09.aspx?flno=12&id=FL030634`
- Ministry of Labor — current new-system severance explanation:
  `https://www.mol.gov.tw/1607/28162/28540/28564/28568/30457/`
- Ministry of Labor — 2026 minimum wage (used to reject stale copy, not
  published in this durable record):
  `https://www.mol.gov.tw/1607/1632/1633/87257/post`

## Existing-record regression

Update the investment test only as required for the fourth approved data
record:

- `Object.keys(japaneseServiceDetails)` becomes exactly
  `['investment', 'civil', 'family', 'labor']`.
- `labor` is removed from the undefined list.
- All investment content, eight points, legal probes, column relationships and
  forbidden assertions stay byte-for-byte unchanged.
- `criminal`, `ip`, unknown and prototype-like keys remain undefined.
- Approved civil and family data/tests remain untouched.

## Labor regression test

Create `src/data/__tests__/service-details-ja-labor.test.ts` and prove:

1. exact title, subtitle, intro and ordered five points;
2. exactly five substantial Japanese points, no Hangul or representative
   English/Korean fallback;
3. required distinctions:
   - `三類型だけで判断できるものではありません`
   - `労働基準法第11条`, `同法第12条`, `同法第14条`
   - `勤続1年につき平均賃金の2分の1か月分`
   - `1年未満は比例計算`, `上限は平均賃金6か月分`
   - `旧制`, `平均賃金1か月分`, `各期間を分けて確認`
   - `第1項第1号または第6号`, `30日の期間制限`
   - `すべての第14条事由に一律の期限があると扱わず`
   - `専門技術訓練`, `合理的な補償`, `合理的な範囲内`
   - `労働者の責めに帰すことのできない理由`
   - `元の形式のまま適法に保全`, `録音が常に許されるとは限らず`
   - `プライバシー・通信の秘密`, `無断アクセス`, `データ改変`
4. forbidden:
   - `会社が解雇した場合にのみ`, `自発的退職では一切`
   - `最低勤務期間はほぼ常に無効`, `ほぼ一律無効`
   - `すべて30日以内`, `第14条はすべて30日`
   - `必ず録音`, `録音しなければならない`
   - `月額27,470`, `時給183`, `2024年の最低賃金`
   - `月額29,500`, `時給196`
   - unrelated `親権`, `残余財産差額分配`, `刑事告訴期限`
   - `曾俊瑋`, `법무법인 호정`, Hangul, fallback English;
5. prototype-safe `__proto__` and `constructor`.

## Forbidden scope

- Route, language switcher, sitemap or visible service-list changes
- Investment, civil or family copy/test changes
- KO, ZH-Hant or EN service-copy changes
- Column, attorney, FAQ, pricing, review, SEO, builder, asset or embedding
  edits
- Stage, commit, push, deploy or server operation by worker

## Required gates

```bash
npx vitest run \
  src/data/__tests__/service-details-ja-investment.test.ts \
  src/data/__tests__/service-details-ja-civil.test.ts \
  src/data/__tests__/service-details-ja-family.test.ts \
  src/data/__tests__/service-details-ja-labor.test.ts
npm run -s typecheck
npx eslint \
  src/data/service-details-ja.ts \
  src/data/__tests__/service-details-ja-investment.test.ts \
  src/data/__tests__/service-details-ja-civil.test.ts \
  src/data/__tests__/service-details-ja-family.test.ts \
  src/data/__tests__/service-details-ja-labor.test.ts
git diff --check
git status --short
```

Independent factual and native-Japanese review are required before commit.
Browser QA is deferred to the separate labor-route publication unit.
