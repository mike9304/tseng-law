# 사기·반도체 칼럼 통합 기록 — 2026-10-03

검수한 칼럼 11편과 원본 이미지를 배포 체크아웃에 통합했다. 발행 상태와 운영 화면은 상위 배포 담당자의 별도 확인 대상이다.

## 기준과 변경 범위

- 체크아웃: `/Users/son7/Projects/tseng-law-fraud-editorial-20261003`.
- 현재 통합 기준 커밋: `b3a339d4` (최초 `7816ec28`, 이전 `64dac3f6`·`130fe5be`). 상위 담당자가 반영한 교통사고 ZH 120–121, road-rage 122의 4개 언어와 기존 반도체 b04 116–119를 보존했다. b04 공개 AI 작성자 푸터의 별도 교정은 아래 추가 기록에 구분했다.
- 신규 칼럼: 반도체 133–137의 5편, 사기 138–143의 6편. 원고는 승인된 source에서 바이트 수정 없이 복사했다.
- 이미지: 기존 반도체 WebP 5개를 같은 공개 경로로 복사했다. 사기 PNG 6개는 앞선 자산 작업의 사본을 사용했다. 11개 모두 원본과 바이트·SHA-256이 일치한다.
- 필수 registry 4개에만 항목을 추가했다. 기존 항목 삭제·변경과 중복 추가는 없다. native-locale-columns 11개, publication dates 11개, embeddings pending 9개(ko/en/zh-hant), semiconductor board 5개를 추가했다. JA는 기존 embedding 대상이 아니므로 pending에 넣지 않았다.
- 사기 evidence 6개, 반도체 repair evidence 5개, final review 5개를 고정 사본으로 보존했다. 검수 기록의 작성·검증 주체와 한계는 원문 그대로다.
- source/destination/locale/slug/운영 확인 URL 및 전체 SHA는 [RELEASE-MANIFEST.json](fraud-semiconductor-20261003/RELEASE-MANIFEST.json)에 기록했다.
- 정책은 [FRAUD-EDITORIAL-POLICY.md](../columns/FRAUD-EDITORIAL-POLICY.md), 사기 이미지 프롬프트와 생성 provenance는 [fraud-images-20261003.md](fraud-images-20261003.md)에 있다.

## 원고와 운영 확인 URL

아래 URL은 발행 후 readback 대상이다. 이 통합 작업에서 운영 반영을 확인했다고 표시하지 않는다.

| 번호 | 언어 | 칼럼 URL | 원고 SHA-256 |
|---|---|---|---|
| 133 | zh-hant | [taiwan-semiconductor-overseas-fab-core-key-technology-review](https://tseng-law.com/zh-hant/columns/taiwan-semiconductor-overseas-fab-core-key-technology-review) | `57aa6fbe4afd21771e273ea6649759b4693e5307e8389e96547fea0e3aae04b5` |
| 134 | ko | [taiwan-national-security-act-core-key-technology-korean-engineers](https://tseng-law.com/ko/columns/taiwan-national-security-act-core-key-technology-korean-engineers) | `a2bd9c36eb2e9faa08393c6cc634566afccd0470f13b3617af8ce2f89c5d459a` |
| 135 | ja | [japanese-equipment-maker-engineers-taiwan-work-permit](https://tseng-law.com/ja/columns/japanese-equipment-maker-engineers-taiwan-work-permit) | `19ab26761d3a8d999b0ef2e33f33f3d68b6d39e49172fe47b444b6cb21b99161` |
| 136 | en | [taiwan-export-controls-shtc-entity-list-us-ear-compliance](https://tseng-law.com/en/columns/taiwan-export-controls-shtc-entity-list-us-ear-compliance) | `904703a8f4f094c3c2cc65c167708a6212254236d07650d95dff50bd3dbd1a4c` |
| 137 | zh-hant | [taiwan-engineer-job-change-trade-secret-national-security-judgments](https://tseng-law.com/zh-hant/columns/taiwan-engineer-job-change-trade-secret-national-security-judgments) | `e84a46e7c03bb0434eb60d12b648ba106e152b9fc3b55bba3c10648ad6ae219c` |
| 138 | zh-hant | [cash-investment-courier-receipt-fraud-taiwan](https://tseng-law.com/zh-hant/columns/cash-investment-courier-receipt-fraud-taiwan) | `0062392fec357f62985bd4367dd8cdebe62d45f124584ad343f06ef826485089` |
| 139 | zh-hant | [land-registration-alert-property-fraud-taiwan](https://tseng-law.com/zh-hant/columns/land-registration-alert-property-fraud-taiwan) | `0eb7442b9cc4b6510411bedcf6310ae933e874494768ccb49764ddcd6d3c1ebd` |
| 140 | zh-hant | [fake-lawyer-scam-recovery-fee-taiwan](https://tseng-law.com/zh-hant/columns/fake-lawyer-scam-recovery-fee-taiwan) | `1e90362a24cbf2c7041a1abbea20771769a49263d57d45d0fa4faa25bcbbea2e` |
| 141 | ja | [taiwan-rental-deposit-before-viewing-fraud](https://tseng-law.com/ja/columns/taiwan-rental-deposit-before-viewing-fraud) | `1660efd3f155d6c73157db3d20bb6d2365234be5f64a5d2418dd6a6984867a33` |
| 142 | en | [taiwan-supplier-bank-account-change-bec](https://tseng-law.com/en/columns/taiwan-supplier-bank-account-change-bec) | `ac8293d32ca6c2c9ba29e31771c949ad21b27f912bd9bb93835756b3e90627bc` |
| 143 | ko | [taiwan-unpaid-invoice-fraud-or-contract](https://tseng-law.com/ko/columns/taiwan-unpaid-invoice-fraud-or-contract) | `a9f2130de685542fa6132c206f9ecf70eafbd94436da68c01db2d278106788d8` |

## 반도체 게시판 확인 URL

기존 `src/app/[locale]/semiconductor/page.tsx` 라우트와 `src/data/semiconductor-board-columns.json` 등록을 근거로 한다. 새 5편이 각 언어 게시판에 나타나는지 운영에서 다시 확인한다.

| 언어 | 게시판 | 새 등록 slug |
|---|---|---|
| ko | [ko 반도체 게시판](https://tseng-law.com/ko/semiconductor) | taiwan-national-security-act-core-key-technology-korean-engineers |
| ja | [ja 반도체 게시판](https://tseng-law.com/ja/semiconductor) | japanese-equipment-maker-engineers-taiwan-work-permit |
| en | [en 반도체 게시판](https://tseng-law.com/en/semiconductor) | taiwan-export-controls-shtc-entity-list-us-ear-compliance |
| zh-hant | [zh-hant 반도체 게시판](https://tseng-law.com/zh-hant/semiconductor) | taiwan-engineer-job-change-trade-secret-national-security-judgments, taiwan-semiconductor-overseas-fab-core-key-technology-review |

## 검수·출처 사본

모든 사본은 원본 SHA와 대조했다. 상세 법률 검수·문체 수정·범위와 남은 불확실성은 해당 기록을 따른다.

| 사본 | SHA-256 |
|---|---|
| [evidence/en-taiwan-supplier-bank-account-change-bec.md](fraud-semiconductor-20261003/evidence/en-taiwan-supplier-bank-account-change-bec.md) | `4805669cc6ee3055de4e564f518db279b46eac78cad75dbb6bcd657284eb680d` |
| [evidence/ja-taiwan-rental-deposit-before-viewing-fraud.md](fraud-semiconductor-20261003/evidence/ja-taiwan-rental-deposit-before-viewing-fraud.md) | `7f88a5a81d5bc9a59b4b0c529c2ca864a1616d9fcff0c3f406fe6b19174e6704` |
| [evidence/ko-taiwan-unpaid-invoice-fraud-or-contract.md](fraud-semiconductor-20261003/evidence/ko-taiwan-unpaid-invoice-fraud-or-contract.md) | `7dc65aedff707c7ab3c80baaf990f63239ce51bc724428898a03c572439f9cc1` |
| [evidence/zh-hant-cash-investment-courier-receipt-fraud-taiwan.md](fraud-semiconductor-20261003/evidence/zh-hant-cash-investment-courier-receipt-fraud-taiwan.md) | `ce44134930659cbdf50acabf4d4d8561bdc22fb39e8bc7106398c1b944f53062` |
| [evidence/zh-hant-fake-lawyer-scam-recovery-fee-taiwan.md](fraud-semiconductor-20261003/evidence/zh-hant-fake-lawyer-scam-recovery-fee-taiwan.md) | `528db40296746d87d0785965b6bf6600538f91959652b9d2b1648ac279b899ce` |
| [evidence/zh-hant-land-registration-alert-property-fraud-taiwan.md](fraud-semiconductor-20261003/evidence/zh-hant-land-registration-alert-property-fraud-taiwan.md) | `c9ecff4ab3ea4d30c9ad95f4e2c4d44d5e0f02afac6f13184a1d52e30193e521` |
| [reviews/fraud-ja-legal-r1.md](fraud-semiconductor-20261003/reviews/fraud-ja-legal-r1.md) | `9f4594242681ef7c818c2dcd76c02e7be002773c22a329c888835f4c95837222` |
| [reviews/fraud-ko-en-legal-r1.md](fraud-semiconductor-20261003/reviews/fraud-ko-en-legal-r1.md) | `e48606d3807081672f1486b6f5a6268df3a9e87a00c088beac816427193ff0d4` |
| [reviews/fraud-voice-r1.md](fraud-semiconductor-20261003/reviews/fraud-voice-r1.md) | `e6ea5eff3545552b5720775af0bf0479dfd9d82cc2979070a3b0523b469ff2b2` |
| [reviews/fraud-zh-legal-r1.md](fraud-semiconductor-20261003/reviews/fraud-zh-legal-r1.md) | `fc0ddcebba3fb3211b5ab319cb57435027a626250f8e848bc5a666e982cfed14` |
| [reviews/semiconductor-b01-zh-final.md](fraud-semiconductor-20261003/reviews/semiconductor-b01-zh-final.md) | `bc2404d4812e7eefcb69b8d4ac4d2c961393fd50e47689e5b3404f6e13f1bece` |
| [semiconductor-repairs/b01-zh-hant-evidence.md](fraud-semiconductor-20261003/semiconductor-repairs/b01-zh-hant-evidence.md) | `6c2f1576ec00ade18b073153a4760bedaee2bfdfcda8c8edf17c27a770b6c0a8` |
| [semiconductor-repairs/en-evidence.md](fraud-semiconductor-20261003/semiconductor-repairs/en-evidence.md) | `40fcf65e9bd013e989d3bcffd2c4bea994ba19c1a6184b9a0c75740c56b462ba` |
| [semiconductor-repairs/ja-evidence.md](fraud-semiconductor-20261003/semiconductor-repairs/ja-evidence.md) | `f8a482efacf196aee2bad789d64e2232c8a1605069e52ed0b81a07d93012c521` |
| [semiconductor-repairs/ko-evidence.md](fraud-semiconductor-20261003/semiconductor-repairs/ko-evidence.md) | `1ae2196d07cc6f0a215d811ab2c957e5be63bb3ff062b2182bc7d917ff1945cf` |
| [semiconductor-repairs/zh-hant-evidence.md](fraud-semiconductor-20261003/semiconductor-repairs/zh-hant-evidence.md) | `f90aa9608eccb13fa9dc190aaa9c825b7762e78d04654a226bf7df969d063c01` |

## 실행 검증

- Python 해시·복사 검증: 11개 원고와 11개 이미지의 source/destination byte equality 및 manifest SHA 일치, ledger 16개 일치.
- 좁은 테스트 직후 tracked 변경 파일은 정확히 4개 registry였다. 이 통합 작업에서 다른 기존 콘텐츠·이미지·UI·dependency는 변경하지 않았다.
- 상위 전체 QA가 병행된 뒤 next-env.d.ts의 생성 경로 한 줄(.next/types/routes → .next-build/types/routes) 변경이 관측됐다. root가 QA 생성 변경임을 직접 확인했고 커밋 전 복원을 맡았다. 통합 담당자는 이 파일을 수정하거나 되돌리지 않았다.
- 실제 이미지 크기: 반도체 5개는 1280 × 720, 사기 6개는 1672 × 941. 실제 그림의 편집 검수는 각 source/review 기록과 상위 담당자의 육안 확인 범위를 따른다.
- `git diff --check`: exit 0, 출력 없음.
- 다음 기존 테스트만 실행했다. 새 테스트나 assertion 약화는 없다.

```sh
npm run test:unit -- src/lib/__tests__/columns-publication-date.test.ts src/lib/__tests__/column-native-date-display.test.ts src/lib/__tests__/columns-new-four-locales.test.ts src/lib/__tests__/columns-en-content.test.ts src/lib/__tests__/columns-ja-content.test.ts src/lib/__tests__/columns-zh-content.test.ts src/lib/__tests__/column-seo-title-frontmatter.test.ts src/lib/__tests__/column-summary-frontmatter.test.ts src/lib/__tests__/column-emphasis.test.ts src/lib/__tests__/column-language-links.test.tsx src/lib/__tests__/column-audience-and-ai-author-20260929.test.tsx src/lib/__tests__/column-publication-search-boundary.test.ts src/lib/__tests__/column-embeddings-content-sync.test.ts src/lib/__tests__/column-pending-text-search.test.ts src/lib/__tests__/semiconductor-public-board.test.ts src/lib/__tests__/semiconductor-drafts-public-surface.test.ts src/lib/__tests__/column-image-descriptions.test.ts src/lib/__tests__/column-topics.test.ts src/lib/__tests__/column-category-parity.test.ts src/app/__tests__/sitemap.test.ts --maxWorkers=2
```

실제 최종 출력:

```text
Test Files  20 passed (20)
     Tests  214 passed (214)
  Start at  20:49:16
  Duration  18.15s
exit_code=0
```

컬럼 로딩·날짜·독자 추천·언어 전환·SEO/summary·굵은 강조·이미지 metadata·검색 대기 목록·게시판과 sitemap을 검증한 결과다. 법률·출처 정확성이나 실화면·운영 반영은 이 테스트 숫자로 대신하지 않는다.

## 상위 배포 검증 범위

전체 QA와 클린 빌드, PC/모바일 화면, 원문·출처·이미지의 운영 readback은 상위 배포 담당자가 수행한다. 이 작업에서는 fetch/merge/add/commit/push, API embedding 호출, 소셜·메일 전송 또는 스케줄러 변경을 수행하지 않았다.

## 추가 교정: b04 공개 작성자 푸터

상위 담당자가 별도로 승인한 기존 116 KO·117 JA·118 EN·119 ZH의 공개 AI 작성 접두부만 제거했다. 이는 신규 11편의 원고 변경이 아니다. 내부 author, frontmatter, 이미지 AI 고지, 법률 내용, 일반정보·개별 법률자문 제한과 출처 확인일은 그대로다. EN은 문장 첫 글자 general을 General로 정리했다.

- 승인된 외부 작업자의 [byline-footer.patch](fraud-semiconductor-20261003/byline-regression/byline-footer.patch): `a8d4e1725156c891a07bd6612b6af591fbe7bcd6ac09538a87611d09f124b238`.
- 원본 [evidence.md](fraud-semiconductor-20261003/byline-regression/evidence.md): `2d537ff8c2e313791457c9acf1606266405c60cb665cc0ffd9b1ea77055d4640`. 두 사본은 `/Users/son7/tseng-fraud-editorial-20261003/ai-byline-regression/` 아래 원본과 바이트가 같다.
- 적용 전 두 산출물 SHA와 4개 원고의 before SHA를 확인했다. `git apply --check` → `git apply`를 순서대로 실행했으며 둘 다 exit 0이었다.
- 적용 후 기대 SHA 4/4, 역치환 시 원본 바이트 완전 일치 4/4, frontmatter·URL 목록·숫자열 보존 4/4를 확인했다. 접두부 외 모든 바이트가 동일하므로 이미지 고지와 본문의 법률 내용도 보존됐다.

| 파일 | before SHA-256 | after SHA-256 |
|---|---|---|
| `src/content/columns/116-taiwan-trade-secrets-act-criminal-civil-korean-companies.md` | `aa41029cb796e76a7a4b910ddbc5ce4813e38723e95996576fed51f779c7c75e` | `f6582862d8cdaaf1c7a36995fc74c5fb9892fccaab8dce33f27d0ed20988f6dd` |
| `src/content/columns-ja/117-japanese-materials-supplier-taiwan-nda-trade-secrets.md` | `4b7806c91651ed7b0b2e928f5a82041213dabd671a6505eecd3d7246f0b5fb3b` | `6093db1843056ad324eeda92441e7fe53a4ce5e4cdcaeca76c0342d0c94f3146` |
| `src/content/columns-en/118-tsmc-arizona-chips-act-taiwan-outbound-approval.md` | `f1433ebb20a57d17e28a30b16357c04642424daa7beafa03bf6b6587541ab51c` | `99bc5d4cf7d81f064c98689af9ea84bae15b13aa2858fb34a2cb973f5e22a0f6` |
| `src/content/columns-zh/119-taiwan-semiconductor-employees-overseas-assignment-labor-law.md` | `d56431bab13c508c357bc264f83ad473e4b1ed3acaf21331cf7fb3546a3d6dc4` | `8a9fd16f2ae443a122d5fdbc8b2b26b98f0c2781255bbdd1ac5576bcb6ccb16b` |

`EDITORIAL-VOICE.md`의 4개 상충 문장을 사용자 기준에 맞췄다. 내부 provenance·실제 사람 byline·미디어 AI 고지를 보존하고, 공개 AI 작성자 이름·프로필·푸터를 추가하지 않으며, 변호사·원어민 작성·검수를 꾸미지 않는다고 구별했다. FRAUD 정책의 과거 문구 우선순위 설명도 현재 정정 상태에 맞췄다. AGENTS가 요구한 `node scripts/sync-editorial-voice.mjs`를 실행해 생성 파일을 동기화했다(exit 0).

| 정책/생성 파일 | SHA-256 |
|---|---|
| `docs/columns/EDITORIAL-VOICE.md` | `f4736c269436ceaf94c4d726cf9a1687d6b8b1df4823cd14f84afd7a17ed3e2c` |
| `docs/columns/FRAUD-EDITORIAL-POLICY.md` | `6e0d249b7f185d6376e9afdbcab834fa6b00d729da08020158606e25cfd80118` |
| `src/lib/editorial-voice.generated.ts` | `7901a7507117e2eea3419f02a5ec4a2d20d1898015c5439c41770eb19438235d` |

## 추가 통합: 교통사고 발행분 보존 및 번호 조정

상위 담당자가 `64dac3f6`로 fast-forward하여 교통사고 ZH 120–121과 해당 UI 변경을 반영했다. 이 통합 담당자는 fetch/merge 또는 UI 수정을 하지 않았다. scoped stash를 적용하며 생긴 pending·native-locale·publication-date registry의 내용 충돌은 양쪽 추가 항목을 모두 보존해 해결했다. 기존 board의 새 반도체 5편도 유지했다.

우리 11편은 120–130에서 122–132로 파일명만 옮겼다(반도체 122–126, 사기 127–132). slug·본문 바이트·이미지·공개 URL은 바뀌지 않았다. manifest의 현재 번호·destination·base와 registry 전후 해시를 갱신했고, 승인된 article SHA 11개와 고정 ledger 16개는 수정하지 않았다. ledger의 과거 번호는 검수 당시 기록으로 보존한다. 교통사고 120–121은 HEAD 원본과 바이트 동일성을 확인했다.

검증 결과: 새 원고 source=destination=승인 SHA 11/11, 이미지 SHA 11/11, ledger SHA 16/16, incoming traffic 원본 2/2. HEAD의 모든 registry 항목을 보존하고 native +11, publication date +11, pending +9, board +5만 추가했음을 대조했다. working-tree conflict marker는 0개이고 `git diff --check`는 exit 0이었다. index의 unmerged 상태 해제와 staging은 상위 담당자에게 남겼다.

정책 동기화 직후 기존 4개 테스트 파일 중 editorial-voice·image-descriptions·emphasis의 3파일 9개 테스트는 통과했다. 병행 FF 중 author suite는 native registry의 충돌 표시 때문에 수집에 실패했다. 충돌 해결·번호 정합 후 위의 기존 20개 테스트 명령을 다시 실행해 author suite를 포함한 전체가 통과했다. 새 테스트나 assertion 약화는 없다.

```text
Test Files  20 passed (20)
     Tests  214 passed (214)
  Start at  21:10:53
  Duration  20.49s
exit_code=0
```

전체 QA·클린 빌드와 현재 HEAD의 운영 검증은 상위 담당자의 별도 단계다. 이 기록이 그 결과를 대신하지 않는다.

## 상위 담당자의 커밋 전 검증

당시 통합 기준은 `64dac3f6`이었다. `npm run qa`를 재실행해 exit 0을 확인했다: typecheck·lint·security 통과, Vitest 1,402 files / 13,914 passed / 14 skipped / 1 todo, 총 323.161초. 보안 검사는 279 route files와 273 mutation handlers를 확인했고 기존 comment allowlist 4건 경고는 유지됐다. 소스 5,447파일의 QA 전후 집계 SHA는 같았다. 실제 로그는 `/Users/son7/tseng-fraud-editorial-20261003/qa/final-full-qa.log`와 `.json`에 있다.

첫 후보 빌드는 exit 0, 2,037개 정적 페이지를 생성했다. PC 1440px와 모바일 390px에서 새 11편의 H1·이미지·페이지 폭을 확인했고 4개 언어 템플릿의 실제 화면을 검수했다. 대만 목록 검색 `地籍` → 새 칼럼, 목차 이동, 모바일 표, 새 탭으로 열리는 상담 페이지를 확인했다. 개발 모드 목록·신규 글에서는 React key/hydration 경고가 관측되지 않았다. 기존 ContactEditorial.module.css:298의 autoprefixer 경고는 기록했다. 상세는 같은 qa 폴더의 `BROWSER-RESULT-20261003.md`와 `local-browser-checks.json`에 있다.

독립 로컬 HTTP 검사는 418/418 통과했다(32 GET): 원문 442문단·137목록 항목·116표 셀, 출처 링크 406회, 원본 이미지 11 SHA, sitemap 11 URL, 반도체 게시판 신규 5카드 및 4개 언어 목록에서 11편 발견. `verify-release-http.local.json`이 실제 결과다. 번호 이동 후 원고 11·이미지 11·검수 ledger 16개 해시도 상위 담당자가 직접 다시 확인했다.

보조 감사의 범위는 구분한다. `audit:release`는 기존 체크포인트 문서 120행의 green 상태를 파싱하여 통과했으며 120기능을 새로 실행한 결과가 아니다. `audit:w-checkpoints`는 외부 입력 파일 ENOENT로 SKIPPED되어 W225 검증 완료로 표시하지 않는다. 마지막 커밋의 클린 빌드·운영 배포·운영 본문/이미지 readback은 이후 별도 기록으로 남긴다.

## 커밋 전 감사 사본 공백 정규화

staged `git diff --cached --check`에서 패치 context의 공백 4행, 검수 사본의 EOF 빈 줄 1개, Markdown hard-break 공백 2행을 보고해 감사 사본만 정규화했다. 원본 source와 승인된 원고·이미지·법률 내용은 수정하지 않았다. 위의 ledger 16개 및 패치 사본의 바이트 동일 기록은 정규화 전 검증 결과다. 현재 ledger는 14개가 원본과 바이트 동일하고 2개는 아래 공백 정규화 사본이며, 모든 source 원본 해시는 그대로다.

- 원본 context patch SHA-256: `a8d4e1725156c891a07bd6612b6af591fbe7bcd6ac09538a87611d09f124b238`. 원본은 `/Users/son7/tseng-fraud-editorial-20261003/ai-byline-regression/byline-footer.patch`에 그대로 있다.
- 현재 [byline-footer.patch](fraud-semiconductor-20261003/byline-regression/byline-footer.patch)는 `git diff HEAD --unified=0 -- <기존 footer 4파일>`로 만든 context-free 파생본이다. SHA-256: `41a4d2b9913da5b6a58ad0305f15e0a3696d893760369be3309cb565ca780ed3`. 원본과 4파일의 삭제·추가 payload가 정확히 같음을 확인했다.
- 이 파생본을 적용할 때는 `git apply --unidiff-zero <patch>`가 필요하다. 이미 적용된 현재 파일에 `git apply --check --reverse --unidiff-zero <patch>`를 실행해 exit 0을 확인했으며 원고를 다시 적용하거나 되돌리지 않았다. 외부 작업자의 evidence.md는 원본 바이트 그대로 남긴다.

| 감사 사본 | 원본 source SHA-256 | 정규화 destination SHA-256 | 정규화 |
|---|---|---|---|
| `docs/audit/fraud-semiconductor-20261003/semiconductor-repairs/en-evidence.md` | `40fcf65e9bd013e989d3bcffd2c4bea994ba19c1a6184b9a0c75740c56b462ba` | `bd2a3e70d7eb60248eef74dccf9699b837a7003fa56acc3c17be411b0643539f` | 150·164행 끝 공백 각 2개 제거 |
| `docs/audit/fraud-semiconductor-20261003/reviews/fraud-voice-r1.md` | `e6ea5eff3545552b5720775af0bf0479dfd9d82cc2979070a3b0523b469ff2b2` | `865f88d5d748262d0085c6966ce904bb76a0c386076d33d7059b2a942bcbb0a5` | EOF의 추가 빈 줄 1개 제거 |

두 사본은 공백을 제외한 텍스트와 줄 순서를 보존했다. manifest의 해당 두 ledger 항목은 `sourceSha256`에 원본 해시, `sha256`에 현재 사본 해시와 normalization 설명을 기록했다. 새 원고 11개와 이미지 11개의 승인 SHA, 나머지 ledger 14개 및 원본 source 16개의 SHA는 변경되지 않았다. runtime 코드나 테스트를 수정하지 않았다. 재-staging 후 최종 staged 검사는 상위 담당자가 수행한다.

## 추가 rebase 통합: 133–143 배정

상위 담당자가 통합 커밋 `61960d23`을 새 원격 기준 `130fe5be` 위로 rebase하며 생긴 pending·publication-date의 두 내용 충돌을 해결했다. native-locale은 자동 병합 결과를 확인한 뒤 우리 파일명만 옮겼다. rebase·staging·continue·commit은 이 통합 담당자가 수행하지 않았다.

현재 신규 11편의 번호는 133–143이다(반도체 133–137, 사기 138–143). 이전 122–132에서 각 파일명 번호에 11을 더했으며 본문 바이트·slug·이미지·공개 URL은 그대로다. 앞선 번호와 QA 실행 기록은 각 검증 당시 결과로 남기고, 이 문서의 상단 목록과 manifest에는 현재 번호·destination·기준 commit을 반영했다.

incoming road-rage 122의 4언어 본문은 HEAD 원본과 바이트가 같으며 해당 등록도 모두 보존했다. HEAD 대비 pending +9, publication-date +11, native-locale +11 이외의 기존 registry 항목은 바뀌지 않았다. semiconductor-board 파일은 이번 단계에서 수정하지 않았다. working-tree의 충돌 표시는 0개다.

승인 원고 11개는 source=destination=승인 SHA, 이미지 11개는 원본 SHA, 검수 사본 16개는 현재 destination SHA, source 16개는 원본 SHA가 모두 일치한다. 정규화된 2개 ledger의 sourceSha256·sha256 구분과 normalization 설명은 유지했다. 새로운 원고나 runtime 코드·UI·영상 data·다른 작업자의 파일은 수정하지 않았다.

이번 단계의 검증은 해시·경로·번호·registry union·충돌 표시와 공백 검사다. 기존 20개 테스트 및 incoming traffic data 영향 검사는 지정 QA 담당자에게 넘겼으며 중복 실행하지 않았다. 상위 담당자는 파일 이동의 삭제·추가와 해결한 registry를 staging한 뒤 rebase를 계속한다.

## 기준 commit 갱신: b3a339d4

상위 담당자가 `b3a339d4`로 rebase한 뒤 현재 기준 commit만 갱신했다. incoming 영상·지원 data, 영상 QA 스크립트 및 traffic 테스트 교정의 16개 경로는 `b3a339d4`의 blob과 현재 파일을 대조해 모두 보존됐음을 확인했다. 이 담당자는 해당 파일을 수정하지 않았다.

우리 번호는 133–143으로 유지한다. 승인 원고 11개는 source=destination=승인 SHA, 이미지 11개는 원본 SHA, ledger 현재 사본 16개와 source 16개는 각각 기록된 SHA가 그대로다. 정규화된 두 ledger의 원본/사본 해시 구분도 유지했다. 4개 registry의 현재 해시는 기존 manifest 값과 동일하다.

이번 변경은 이 감사 문서와 manifest의 배포 기준 metadata뿐이다. git add/amend 및 테스트·빌드는 실행하지 않았으며, 상위 담당자와 QA 담당자가 최종 커밋·클린 빌드 검증을 이어간다. 앞선 기준의 실행 로그는 당시 검증 기록으로 남긴다.

## 추가 교정: road-rage 122 푸터 4개

상위 담당자의 명시적 승인으로 122번 road-rage 글의 KO·EN·JA·ZH 공개 AI 작성 주체 문자열만 각 1회 제거했다. 독립 협업 작업자의 [traffic122-evidence.md](fraud-semiconductor-20261003/byline-regression/traffic122-evidence.md)를 읽고 before SHA 4개를 현재 원고와 대조한 뒤 승인된 4줄 패치를 적용했다. 이는 앞선 incoming 원본 보존 확인 후 별도 승인된 작성자 표시 교정이며 법률 내용의 재검수·수정이 아니다.

- 적용 artifact: `/Users/son7/tseng-fraud-editorial-20261003/ai-byline-regression/traffic122-footer.patch`; SHA-256 `0db29da117cd2e1c632b866ae0745281b9c8a6d51a858d381e393d983de56677`. context 공백이 있는 patch는 저장소에 복사하지 않았다.
- evidence 사본은 source와 바이트 동일: `f3f20d5726141f2ec8be4b93aed353f4fa3ef989a5783dbc73415958c07b6b28`. `git apply --check` 및 `git apply`는 각각 exit 0.
- 적용 후 기대 SHA 4/4, 원래 제거 문자열만 되넣었을 때 원본 바이트 완전 복원 4/4, footer 이외 모든 줄·frontmatter·URL·숫자열 보존 4/4를 확인했다. 내부 author와 이미지 AI 고지, 법률 내용 및 확인일도 그대로다.

| 파일·행 | before SHA-256 | after SHA-256 |
|---|---|---|
| `src/content/columns/122-taiwan-road-rage-reversing-into-tailgater-no-self-defense.md:116` | `b0025a337a766cd4f879ff921f68010879e125b94ce40673be2033a74a0b9783` | `8bf2aab4b729823f79d988d99e2e5275e4b3f55edc1573f7e64e83f2adb5a8c0` |
| `src/content/columns-en/122-taiwan-road-rage-reversing-into-tailgater-no-self-defense.md:130` | `50f6974dde7ac078849dc907566f9b807bb6675c22414ffcd131e5fe18a866f3` | `f46a35553250caf9c4330cbc2fface037eba74c3c92643091343fa0609a20a2b` |
| `src/content/columns-ja/122-taiwan-road-rage-reversing-into-tailgater-no-self-defense.md:149` | `593d152ca6e69b3b392bcb256fce288cc1cb999d49ebe78534157dd0595db515` | `c3b69068ffa425e8cd47003d9444acefd5ab7c0a6ca2cb6c2466e894fc254d77` |
| `src/content/columns-zh/122-taiwan-road-rage-reversing-into-tailgater-no-self-defense.md:142` | `46fc1f700ae93f48ab6ac3bad67804d3f7d8a8b6a901e714287ce78e46012d54` | `8dacce19968145d00eacff36e36934e37f42b5465c69d9cbad1ce63de4b423fa` |

신규 133–143 원고·이미지·ledger 및 manifest는 변경하지 않았다. 이번 수정은 122번 원고 4개와 evidence 사본·상위 audit의 2개 파일뿐이다. staging·commit·build는 수행하지 않았다.
