# WO-I18N-COL007-PUBLIC-SYNC — column 007 공개 표면 동기화

Date: 2026-07-26 KST
Manager: Codex `/root`

## 목적과 상위 계약

네 언어 column 007 본문이 모두 통과한 뒤, 다음 상위 계약의
`Public-surface synchronization after all four articles pass`를 별도
커밋으로 수행한다.

`docs/audit/WO-I18N-COL007-EDITORIAL-LEGAL-CONTRACT-2026-07-25.md`

이 작업은 본문을 다시 쓰는 단위가 아니다. 공개 카드, 서비스의 관련 글
제목, 검색 원본, 서비스 상세 법률 요약, alias·sitemap·metadata·JSON-LD
회귀 검증만 동기화한다.

## 변경 가능 파일

- `src/data/site-content.ts`
- `src/data/insights-archive.ts`
- `src/data/service-details.ts`
- `src/data/__tests__/site-content-ja-services.test.ts`
- 신규 `src/data/__tests__/column-007-public-reference-sync.test.ts`

그 밖의 파일, 네 언어 article, `src/data/blog-posts.ts`, 변호사 프로필,
공통 loader·SEO·sitemap 구현, `next.config.mjs`, 임베딩 파일을 변경하지
않는다. stage, commit, push, deploy, publish, server 실행은 Codex만 한다.

## 정확한 네 언어 제목

```ts
{
  ko: '대만 이혼 절차 Q&A: 조정·소송·재산분할·자녀',
  'zh-hant': '台灣離婚程序 Q&A：調解、訴訟、財產分配與子女',
  en: 'Taiwan Divorce Q&A: Mediation, Litigation, Property, and Children',
  ja: '台湾の離婚手続Q&A：調停・訴訟・財産分与・子ども',
}
```

`src/data/site-content.ts`의 네 locale family-service `relatedColumns`에서
slug `taiwan-divorce-lawsuit-qna`의 title을 위 값으로 정확히 바꾼다.
다른 service copy나 관련 글은 이 단위에서 변경하지 않는다.

`src/data/__tests__/site-content-ja-services.test.ts`의 기존 일본어 기대값도
정확한 새 일본어 제목으로만 갱신한다.

## 정확한 KO archive record

기존 `id`, `href`, `category`, `image`는 유지하고 다음을 정확히 사용한다.

```ts
{
  id: 'divorce-qna',
  title: '대만 이혼 절차 Q&A: 조정·소송·재산분할·자녀',
  summary:
    '대만의 협의·조정·재판이혼 절차, 국제결혼·외국 이혼의 호적·승인 문제, 부부재산, 이혼 후 청구와 미성년 자녀 문제를 결과 보장 없이 정리합니다.',
  href: '/ko/insights/divorce-qna',
  category: 'legal',
  readTime: '18분 분량',
  image: '/images/007-taiwan-divorce-lawsuit-qna/featured-01.jpg',
  keywords: [
    '대만 이혼 절차',
    '국제이혼',
    '부부재산',
    '이혼 후 청구',
    '미성년 자녀',
  ],
}
```

## 정확한 ZH-Hant archive record

```ts
{
  id: 'divorce-qna',
  title: '台灣離婚程序 Q&A：調解、訴訟、財產分配與子女',
  summary:
    '整理台灣協議、調解與裁判離婚程序、跨國婚姻與外國離婚的戶籍及承認問題、夫妻財產、離婚後請求與未成年子女事項，不保證個案結果。',
  href: '/zh-hant/insights/divorce-qna',
  category: 'legal',
  readTime: '20分鐘閱讀',
  image: '/images/007-taiwan-divorce-lawsuit-qna/featured-01.jpg',
  keywords: [
    '台灣離婚程序',
    '跨國離婚',
    '夫妻財產',
    '離婚後請求',
    '未成年子女',
  ],
}
```

## 정확한 EN archive copy

영문 archive는 KO base record에서 생성되므로, `englishPostCopy`의 타입에
optional `readTime?: string`을 추가하고 `divorce-qna`에 다음 값을 정확히
둔다.

```ts
{
  title: 'Taiwan Divorce Q&A: Mediation, Litigation, Property, and Children',
  summary:
    'A guide to Taiwan divorce by agreement, court mediation or judgment, cross-border marriage and divorce records, matrimonial property, post-divorce claims, and minor-child issues, without promising an outcome.',
  readTime: '25 min read',
  keywords: [
    'Taiwan divorce procedure',
    'cross-border divorce',
    'matrimonial property',
    'post-divorce claims',
    'minor children',
  ],
}
```

`buildEnglishInsights`는 이 optional override가 있으면 그것을 사용하고,
없으면 기존 `toEnglishReadTime(post.readTime)` 동작을 보존한다.

최종 EN record는 기존 `id`, alias `href`, category, image를 보존하면서
위 title/summary/readTime/keywords를 가져야 한다.

## family service detail의 정확한 6개 KO key points

`src/data/service-details.ts`의 `slug: 'family'` 아래 KO 배열만 다음으로
정확히 교체한다.

1. `대만 이혼은 민법 제1050조의 서면, 당사자 쌍방의 진정한 이혼 의사를 직접 확인한 2명 이상 증인의 서명, 호정기관 등기를 모두 갖추는 협의이혼과 법원 조정·화해에 의한 이혼, 재판이혼을 구분해 검토합니다.`
2. `국제결혼·외국 이혼은 대만의 재판관할·행정권한, 준거법, 외국 신분행위·재판의 대만 내 승인과 효력, 대만 호적 절차, 다른 국가·지역의 절차를 각각 확인해야 합니다.`
3. `특정 재산의 등기·소유권과 증여·차명등기·대여·반환 등 개별 청구는 민법 제1030조의1 잔여재산 차액분배와 구분하며, 해당 청구의 2년·5년 행사기간을 손해배상·이혼 후 부양·양육비 등에 일률 적용하지 않습니다.`
4. `배우자는 다른 상속인이 있으면 대만 민법상 해당 순위의 상속인과 공동상속하고, 다른 상속인이 없으면 전부를 상속합니다. 상속분은 상속인 구성에 따라 달라지며, 상속과 배우자의 잔여재산 관련 청구는 별도로 계산합니다.`
5. `미성년 자녀에 대한 권리·의무의 행사·부담과 면접교섭은 자녀의 최선의 이익을 기준으로 판단하며, 혼인 파탄 책임이나 한 가지 요소가 결과를 자동으로 정하지 않습니다.`
6. `법원이 본인 출석을 명령한 경우 정당한 이유 없는 불출석에는 첫 과태료가 3만 대만달러 이하이고 강제구인할 수 없으며, 이혼판결 확정일 또는 법원 조정·화해 성립일부터 일반적으로 30일 안에 호적 신고하되 기간 후 신청도 수리되고 요건을 갖추면 서면 최고 후 호정기관이 직접 등기할 수 있습니다.`

## family service detail의 정확한 6개 ZH-Hant key points

1. `台灣離婚應區分：依民法第1050條具備書面、兩名以上親自見聞並確認雙方真實離婚意思之證人簽名及戶政登記的協議離婚；法院調解或和解離婚；以及裁判離婚。`
2. `跨國婚姻或外國離婚應分別確認台灣的司法管轄與行政權限、準據法、外國身分行為或裁判在台灣的承認及效力、台灣戶籍程序，以及其他國家或地區的程序。`
3. `特定財產的登記與所有權，以及贈與、借名登記、借貸、返還等個別請求，應與民法第1030條之1夫妻剩餘財產差額分配分開分析；該請求的二年及五年期間不得一律套用於損害賠償、離婚後扶養或子女扶養費。`
4. `配偶在有其他繼承人時，與民法所定相應順位的繼承人共同繼承；四個順序均無繼承人時，由配偶繼承全部遺產。應繼分依繼承人組成而異，繼承與配偶的剩餘財產相關請求也應分別計算。`
5. `未成年子女權利義務之行使或負擔及會面交往，應以子女最佳利益判斷，不因婚姻破綻責任或單一因素而自動決定。`
6. `法院命本人到場而無正當理由不到場時，首次罰鍰為新臺幣3萬元以下且不得拘提；離婚判決確定日或法院調解、和解成立日起一般應於30日內申請戶籍登記，逾期申請仍會受理，符合要件時戶政機關得於書面催告後逕為登記。`

## family service detail의 정확한 6개 EN key points

1. `Taiwan divorce analysis must distinguish a mutual-consent divorce satisfying Civil Code Article 1050’s writing requirement, signatures by at least two witnesses who personally perceived and confirmed both spouses’ genuine intent to divorce, and household registration; divorce by court mediation or settlement; and judicial divorce.`
2. `A cross-border marriage or foreign divorce requires separate analysis of Taiwan judicial jurisdiction and administrative authority, applicable law, Taiwan recognition and effect of the foreign status act or judgment, Taiwan household-registration procedure, and any procedure in another country or region.`
3. `Registered title and ownership of a specific asset, and claims based on gift, nominee registration, loan, or restitution, must be separated from Civil Code Article 1030-1 residual-property distribution; its two-year and five-year periods do not apply wholesale to damages, post-divorce support, or child support.`
4. `When other heirs exist, a spouse inherits concurrently with the heirs in the applicable Civil Code rank; if no heir exists in any of the four ranks, the spouse inherits the entire estate. The share varies with the composition of the heirs, and inheritance and the spouse’s separate residual-property claim must also be calculated separately.`
5. `The exercise and assumption of rights and duties concerning a minor child, and contact or visitation, are determined under the child’s best interests rather than marital fault or any single automatic factor.`
6. `When a court orders personal appearance, the first fine for unjustified nonappearance is up to NTD 30,000 and arrest is unavailable; household registration is generally sought within 30 days after a divorce judgment becomes final or court mediation or settlement is established, late applications remain accepted, and the office may register directly after written demand when statutory conditions are met.`

family intro, title, subtitle, `columnSlugs`, inheritance article, other service
records는 변경하지 않는다.

## 전용 교차표면 회귀 테스트

신규 `src/data/__tests__/column-007-public-reference-sync.test.ts`는 최소한
다음을 exact assertion으로 고정한다.

1. 네 article frontmatter title과 위 네 title의 일치.
2. 네 locale `siteContent` family related card가 exact `{slug, title}`.
3. KO, ZH-Hant, EN archive record의 exact 전체 객체. alias insights href는
   유지하되 `readTime`은 각각 `18분 분량`, `20分鐘閱讀`, `25 min read`.
4. `getSearchIndex` 결과가 archive title, summary, keywords와 canonical
   `/{locale}/columns/taiwan-divorce-lawsuit-qna`를 사용.
5. `filterSearchIndex`에서 native query `대만 이혼`, `台灣 離婚`,
   `Taiwan divorce`가 각각 이 record를 반환.
6. family service detail의 세 locale 6개 배열 exact.
7. 네 canonical/`divorce-qna` loader 결과의 title·slug 동일성.
8. `next.config.mjs`의 네 locale column alias와 insights alias가 모두
   permanent redirect.
9. sitemap에 네 canonical route가 정확히 한 번씩 존재하고 네 언어
   alternate 및 x-default가 동일.
10. `generateMetadata`가 네 locale article의 exact title, canonical,
    네 alternate를 사용.
11. article JSON-LD의 headline, mainEntityOfPage, inLanguage 및 FAQ JSON-LD
    6개가 article loader 데이터에서 생성됨.
12. KO/ZH-Hant/EN 공개 archive·search는 존재하지만 `insightsArchive`에
    일본어 archive가 없고, 이 단위가 `/ja/insights/divorce-qna`를 새로
    노출하지 않았음을 명시적으로 검증.
13. 다음 stale public copy가 동기화 파일과 결과에서 사라짐:
    - `이혼 조정·소송 Q&A`
    - `離婚調解訴訟 Q&A`
    - `Taiwan Divorce Litigation Q&A`
    - `台湾の離婚調停・訴訟Q&A`
    - archive 옛 세 제목·요약
    - `3,000 TWD`, `3,000TWD`
    - 해외 혼인등록의 거짓 양자택일
    - 잔여재산 청구기간을 모든 청구에 적용하는 문구
14. 다른 archive record와 service record가 변하지 않도록 변경 범위를
    확인한다.

테스트가 implementation 문자열을 그대로 읽어 expected 값을 만드는
tautology가 되어서는 안 된다. exact expected copy를 테스트에 독립적으로
기록한다.

## 작성자 검증

각 작은 구현 단위가 끝날 때 해당 파일의 scoped test와 `git diff --check`
만 실행한다. 모든 구현·테스트가 끝나면 Codex가 직접 다음을 수행한다.

1. 신규 public-sync test
2. `site-content-ja-services.test.ts`
3. 기존 column 007 네 언어 전용 test
4. search, sitemap, redirect, metadata/JSON-LD 관련 test
5. `npm run -s typecheck`
6. scoped ESLint
7. production build
8. KO/ZH-Hant/EN archive·search와 네 locale family related card browser 확인
9. 최종 diff 및 로컬 manager commit

## 임베딩 분리

`src/content/column-embeddings.json`은 이 public-sync commit에서 변경하지
않는다. 공개 동기화 commit과 검증이 끝난 뒤 공식 local build-embeddings
API를 호출하고, 별도 test·검증·manager commit으로 처리한다. JA는 현재
consultation embedding schema에 추가하지 않는다.
