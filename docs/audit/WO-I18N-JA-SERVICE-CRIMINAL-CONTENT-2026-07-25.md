# WO-I18N-JA-SERVICE-CRIMINAL — Approve Japanese criminal-service content

Date: 2026-07-25 KST
Owner: delegated implementation worker
Manager: Codex `/root`

## Goal

Add a current, primary-source-checked and professionally edited Japanese
`criminal` record to `src/data/service-details-ja.ts`.

This unit approves data only. It does not publish `/ja/services/criminal`.
Route, language-switch, related-column and sitemap changes belong to later
reviewed units.

## Allowed files

1. `src/data/service-details-ja.ts`
2. `src/data/__tests__/service-details-ja-investment.test.ts`
3. `src/data/__tests__/service-details-ja-criminal.test.ts` (new)

No other file may be modified.

## Exact Japanese contract

Add this exact `criminal` entry after `labor`:

```ts
criminal: {
  title: '台湾の刑事事件・刑事弁護',
  subtitle: '捜査対応、被疑者・被告人の弁護、被害者の告訴手続を日本語で支援',
  intro:
    '昊鼎国際法律事務所は、台湾の刑事事件について、警察・検察による捜査への対応、弁護人による接見、被疑者・被告人の弁護、被害者の代理および告訴手続を日本語で支援します。また、会社の株金、交通事故、外国人の就労などに伴う刑事・行政上のリスクを、事実関係、証拠、適用法令および手続期限に基づいて整理し、対応方針を検討します。',
  keyPoints: [
    '台湾の刑事手続では、当事者の立場と手続段階に応じた初動が重要です。刑事訴訟法第27条により、被告人（台湾法上の「被告」）はいつでも弁護人を選任でき、司法警察官または司法警察による取調べを受ける被疑者（同「犯罪嫌疑人」）も同様です。被告人の取調べ前には、被疑事実とすべての罪名、黙秘できること、弁護人を選任できること、有利な証拠の取調べを請求できることなどが告知されます。聴覚・言語に障害がある場合または言語が通じない場合には通訳を付すこととされているため、外国人事件では通訳の確保、供述内容および証拠を早期に確認します。',
    '6か月の告訴期間は、すべての刑事事件に共通する期限ではありません。刑事訴訟法第237条では、告訴を訴追の条件とする犯罪（告訴乃論之罪）について、告訴権者が犯人を知った時から6か月以内に告訴することとされています。告訴を要しない犯罪、告訴権者、起算点、告訴の撤回可否および民事請求の期間はそれぞれ別に確認し、6か月を過ぎれば一律に民事手続しか利用できないとは扱いません。',
    '台湾会社法第9条の刑事責任は、会社が受け取るべき株金について、実際には払い込まれていないのに申請書類上は全額払込済みと表示した場合、または株主が実際に払い込んだ株金を、登記後に会社責任者が株主へ返還し、もしくは株主による回収を許した場合に問題となります。会社責任者には5年以下の有期刑、拘役（台湾法上の短期自由刑）または50万以上250万新台湾ドル以下の罰金が科され得ますが、通常の適法な会社資金の使用一般を処罰する規定ではありません。',
    '台湾刑法第185条の4では、自動車などの動力交通手段（台湾法上の「動力交通工具」）の運転者が交通事故を起こし、人を負傷させた後に逃走した場合は6か月以上5年以下の有期刑、人を死亡させ、または重傷を負わせた後に逃走した場合は1年以上7年以下の有期刑とされています。事故による死傷について運転者に過失がない場合には刑を減軽または免除できる旨も定められており、同条の適用は、死傷結果、事故後の行動、現場を離れた経緯などを個別に確認して判断する必要があります。',
    '就業サービス法第43条（就業服務法第43條）は、同法に別段の定めがある場合を除き、外国人が雇用主による許可申請を経ずに台湾で就労することを禁止しています。入出国及び移民法第18条（入出國及移民法第18條）では、過去に不法就労または在留期間超過等があった外国人について、移民署が入国を禁止できるとされ、同条第1項第12号による入国禁止期間は出国日の翌日から少なくとも1年、最長7年です。一律に3年間入国できない、または無許可就労が常に刑事責任を生じさせるとは断定せず、就労内容、許可・在留状況および具体的な処分を確認します。',
  ],
},
```

## Factual boundaries

- Do not generalize the six-month complaint period to every crime. Preserve
  `告訴乃論之罪`, the complainant's knowledge of the offender as the trigger,
  and the separation from civil limitation periods.
- Do not say that missing six months leaves civil litigation as the only
  available procedure.
- Do not characterize Company Act Article 9 as ordinary withdrawal or use of
  company funds. Preserve its unpaid/falsely represented or post-registration
  return/recovery conditions.
- Do not state only the one-to-seven-year hit-and-run range. Preserve the
  injury and death/serious-injury tiers and the no-fault mitigation/exemption
  clause.
- Do not say unauthorized work always causes criminal liability or a fixed
  three-year entry ban. Preserve the current at-least-one/up-to-seven-year
  statutory range and the Immigration Agency's discretionary wording.
- Do not promise a result, response time, exact fee or outcome.

## Official primary sources

- Code of Criminal Procedure Article 27 — selection of counsel:
  `https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=27&pcode=C0010001`
- Code of Criminal Procedure Article 95 — notice before questioning:
  `https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=95&pcode=C0010001`
- Code of Criminal Procedure Article 99 — interpreter:
  `https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=99&pcode=C0010001`
- Code of Criminal Procedure Article 237 — six-month complaint period:
  `https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=237&pcode=C0010001`
- Company Act Article 9:
  `https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=9&pcode=J0080001`
- Criminal Code Article 185-4:
  `https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=185-4&pcode=C0000001`
- Employment Service Act Article 43:
  `https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=43&pcode=N0090001`
- Immigration Act Article 18:
  `https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=18&pcode=D0080132`

## Existing-record regression

Update the investment test only as required for the fifth approved record:

- `Object.keys(japaneseServiceDetails)` becomes exactly
  `['investment', 'civil', 'family', 'labor', 'criminal']`.
- `criminal` is removed from the undefined list.
- Investment, civil, family and labor content/tests remain untouched.
- `ip`, unknown and prototype-like keys remain undefined.

## Criminal regression test

Create `src/data/__tests__/service-details-ja-criminal.test.ts` and prove:

1. exact title, subtitle, intro and ordered five points;
2. exactly five substantial Japanese points, no Hangul or representative
   English/Korean fallback;
3. required legal anchors:
   - `刑事訴訟法第27条`, `刑事訴訟法第237条`
   - `黙秘できること`, `有利な証拠`, `通訳`
   - `告訴乃論之罪`, `犯人を知った時から6か月以内`
   - `一律に民事手続しか利用できないとは扱いません`
   - `台湾会社法第9条`, `全額払込済み`, `登記後`
   - `5年以下の有期刑`, `50万以上250万新台湾ドル以下`
   - `通常の適法な会社資金の使用一般`
   - `6か月以上5年以下`, `1年以上7年以下`
   - `減軽または免除`
   - `就業服務法第43條`, `入出國及移民法第18條`
   - `少なくとも1年`, `最長7年`
   - `常に刑事責任を生じさせるとは断定せず`
4. forbidden:
   - `刑事告訴期限は6か月`, `すべて6か月以内`
   - `6か月を過ぎると民事のみ`, `民事しかできない`
   - `会社資金を引き出すと5年`, `会社資金の不正払戻し`
   - a lone/generalized `ひき逃げは1年以上7年以下`
   - `3年間入国禁止`, `3年内禁止入境`
   - `無許可就労は犯罪`, `必ず刑事責任`
   - `曾俊瑋`, `법무법인 호정`, Hangul and fallback English
   - outcome guarantees;
5. prototype-safe `__proto__` and `constructor`.

## Forbidden scope

- Route, language switcher, sitemap, visible service list or related-column
  changes
- Editing prior approved Japanese service copy/tests
- KO, ZH-Hant or EN service-copy corrections
- Column, attorney, FAQ, pricing, review, SEO, builder, asset or embedding
  edits
- Stage, commit, push, deploy or server operation by worker

## Required gates

```bash
npx vitest run \
  src/data/__tests__/service-details-ja-investment.test.ts \
  src/data/__tests__/service-details-ja-civil.test.ts \
  src/data/__tests__/service-details-ja-family.test.ts \
  src/data/__tests__/service-details-ja-labor.test.ts \
  src/data/__tests__/service-details-ja-criminal.test.ts
npm run -s typecheck
npx eslint \
  src/data/service-details-ja.ts \
  src/data/__tests__/service-details-ja-investment.test.ts \
  src/data/__tests__/service-details-ja-criminal.test.ts
git diff --check
git status --short
```

Independent factual and native-Japanese review are required before commit.
Browser QA is deferred to the separate criminal-route publication unit.
