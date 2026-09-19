Verdict: CHANGES_REQUIRED

# 재검수 리포트 — MULTILINGUAL-INTERNATIONAL-v2-20260918-c3

> **검증 모델: Claude Opus 5 (`claude-opus-5[1m]`), 세션 son7-a0** — WO가 지정한 Fable 5.1 대체. c2 검수자 동일. 인간 검수자·원어민·변호사가 아니다. 언어 판단은 AI 의미 대조다.
> 배포 승인 아님. `technical_content_validation=CHANGES_REQUIRED`, `human_linguistic_review=PENDING`, `legal_review=PENDING`, `publication_approval=PENDING`, `publish_authorized=false`, `deployed=false`, 성과 `NOT_MEASURED`.
> 앱 소스·v2 파일 무수정, git·배포·운영 전송 없음. 단 §6의 검증 부작용 1건(자동 수정된 추적 파일 2개)을 기록하고 원상 복구했다.
> 기준선: c2 리포트 `…/MULTILINGUAL-INTERNATIONAL-v2-20260917-c2/FABLE-REPORT.md`, c2 시작 시점 44파일 고정 사본.

## 1. 요지

c2의 P1 7건 중 **제품 결함 6건(V2-01·02·03·04·05·07)은 해소**를 실행·렌더·클릭으로 확인했다. 남은 차단은 두 가지다. **(a) 이번 수정이 새로 만든 단위 테스트 회귀 1건**, **(b) Grok 증거 패키지의 필수 산출물 결손(V2-06 부분 해소)**. 둘 다 원고 품질이 아니라 게이트·기록 문제라 수정 범위는 작다. V2-17(main 48커밋 뒤)은 WO에 따라 이번 후보에서 제외하고 배포 전 통합으로 남긴다.

## 2. 후보와 해시

| 항목 | 값 |
|---|---|
| 후보 | `MULTILINGUAL-INTERNATIONAL-v2-20260918-c3` · `/Users/son7/Projects/tseng-law-en-international-20260917` · `seo/en-international-v1-20260917` · HEAD `90352b02` + 미커밋 · origin/main `c4270097` |
| 매니페스트 | 93항목, **시작·종료 모두 93/93 일치**, 자기 해시 항목 없음(V2-06 일부 해소). 매니페스트 밖 변경은 WO-c3 문서와 매니페스트 자신뿐 |
| 독립 스냅샷 | `SNAPSHOT-start.sha256` = `SNAPSHOT-end.sha256`(부작용 복구 후) → 검증 중 드리프트 없음 |
| c2→c3 제품 변경 | `IntentLandingPage.tsx`, `multilingual-international-v2.ts`, `intent-pages.ts`, `service-details.ts`, `columns-ja/001`, P07 `content.ts`·`page.tsx`, 가이드 `content.ts`, `globals.css` + 테스트 5파일(`en-acquisition-guide-links`, `intent-pages-ja`, `intent-pages-en`, `columns-ja-investment-001`, `intent-pages.playwright`) |
| 소유 경합 | son7-db가 01:55:05에 폴더를 만들고 양보, son7-51도 양보 → son7-a0 `OWNER.txt`. 경합 중 후보 해시 불변 |
| 환경 | 기존 3044 서버 종료 상태 → 워크트리에서 `NEXT_DIST_DIR=.next-m-fable-c3 npx next dev -p 3046`(gitignore 대상) 기동. Playwright Chromium, 외부 요청 abort(시도 0건) |

## 3. c2 결함별 판정

| c2 ID | c2 내용 | c3 확인 | 판정 |
|---|---|---|---|
| V2-01 | tsc TS2322 | `npx tsc --noEmit --incremental false` **exit 0** (`logs/10-tsc.log`) | **해소** |
| V2-02 | 단위 회귀 6건(4파일) | 4파일 + v2/EN/P07 3파일 = **7파일 65/65 통과**(`logs/12`). 테스트 수정 내용 검토: ① `intent-contact-paths` — 상황 nav 클래스를 `intent-situation-nav`로 바꿔 "헤더 키워드 칩 금지" 가드의 대상이 아니게 함(상황 링크는 키워드 칩이 아니므로 타당) ② `intent-pages-ja` — 비용표 행 수 KO−1로 바꾸고 JA 국가별 절에 협정이 있음을 함께 단언(타당) ③ `en-acquisition-guide-links` — 비영문 홈의 설립·소송 href 금지 단언 2줄 삭제(v2 범위상 타당하나 대체 단언 없음 → C3-04) ④ `canonical-public-route-identity` — 원고에 "Attorney Wei Tseng" 복원(새 주장 문구 → C3-03) | **해소** (파생 P2 2건) |
| V2-03 | JA/KO/ZH 분쟁 허브에 P07 링크 없음 | 4언어 `/{l}/taiwan-litigation-lawyer`에 상황 nav(미수금·민사·형사·가사) 렌더, 미수금 링크가 1440×900·390×844 **첫 화면 안**(y 319~541), 클릭 → 같은 언어 P07 → "민사" 링크 → `/{l}/services/civil` 이동 확인(`logs/30-pw-p05-p07.json`, `screens/p05-*-390x844.png`) | **해소** |
| V2-04 | JA 칼럼 협정 국가 한정 표시 없음 | `columns-ja/001:43`·`:119`·`:123`에 "韓国関連の事実関係に限る。", §5 제목 `（韓国関連）`. 렌더 3회·제목 확인(`logs/21`) | **해소** (문체 P2 → C3-05) |
| V2-05 | KO/ZH 협정 발효일 2023.12.2 | KO `2023.12.27 발효, 2024.1.1 적용`, ZH `2023.12.27生效、2024.1.1適用` 렌더 확인, 12.2 잔존 0. 대만 재정부 영문 페이지(c2에서 열람)와 일치 | **해소** |
| V2-06 | ops 증거 스텁 | `POLICY-MATRIX`·`LOCALE-PAGE-MAP`·`CLAIM-REGISTER`는 경로·조항·출처·확인일을 갖춘 표로 복원, 매니페스트 자기 해시 제거. **그러나** `BASELINE`·`TERMS`·`CONTENT-DIFF`·`LOCALE-SEO-MAP`·`RUNBOOK`·명령 로그·화면이 여전히 없고, `QA-BY-LOCALE.md`는 c2 후보 ID·c2 표 그대로(갱신 안 됨), GROK-REPORT의 로그는 scratch 경로만 가리킴. 매니페스트에 c2 검수 산출물 44개(`fable/…-c2/*`)가 후보 파일로 들어감 | **부분 해소 → C3-02** |
| V2-07 | AR 라벨 정책 근거 없음 | POLICY-MATRIX가 `international-guidance-content.ts` ar 블록(WO-M3B)·`docs/seo/mena-plan/AR-LOCALE-INVENTORY.md`·`docs/seo/geo-mena-baseline-2026-09.md`를 인용 — **파일 실재 확인**. 라벨은 기존 `/ar/services`·`/ar/faq`로 가는 탐색 문구이고 국가·송금·종교법 규칙 추가 없음, 코드 주석에도 명시 | **해소** |
| V2-08 | 의뢰 페이지 "가이드" 라벨·제목 | KO `상담 안내`, ZH `諮詢說明`·`台灣公司設立法律諮詢`·`台灣訴訟法律諮詢`, JA `相談案内`, JA planHeading `事業計画から整理する` | **해소** (단 범위 밖 제목 1건이 회귀 유발 → C3-01) |
| V2-09 | JA/ZH P07 제목 브랜드 중복 | 렌더 `… | 昊鼎国際法律事務所`, `… | 昊鼎國際法律事務所` 1회 | **해소** |
| V2-10 | JA `公证` | `公証` | **해소** |
| V2-11 | 독자 화면의 편집 메모 | injuryBody 4언어·가이드 planIntro·JA 국가별 도입·ZH 투자 도입의 메모성 문장 제거·독자 문장화 | **해소** |
| V2-12 | 검수 배지·P07 초안 문구 | 민사 페이지 `svc-review-note` 4언어 잔존, P07 초안 문구 4언어 화면 노출 잔존 | **미해소 (P2, 발행 차단)** |
| V2-13 | 안내형 전환 미번역 고지 | 변경 없음(공통 메커니즘) | **미해소 (P2)** |
| V2-14 | JA 1440 가이드 링크 대비 | 관련 파일 무변경 | **미해소 (P2)** — 이번에 재촬영하지 않음(3046 서버에서 시네마틱 오프닝 미렌더, §6) |
| V2-15 | P07 H2 중첩 | 상황별 제목 `h3` 확인 | **해소** |
| V2-16 | ZH 투자 업무범위 변경 | CLAIM-REGISTER `C-ZH-DUAL` "needs lawyer review" 등재 | **추적 등재 (변호사 검토 대기)** |
| V2-17 | main 48커밋 뒤 | WO 지시로 이번 후보 제외 | **이월 (배포 전 필수)** |

## 4. 신규·잔여 결함

| ID | 심각도 | 요구 | 위치 | 기대 / 실제 | 재현 | 증거 | Grok 재작업 |
|---|---|---|---|---|---|---|---|
| C3-01 | **P1** | ML22·ML24 | `src/data/intent-pages.ts:234` ZH `taiwan-lawyer` 제목 `台灣律師指南`→`台灣律師諮詢` / 고정 테스트 `src/data/__tests__/intent-pages-en-growth.test.ts:17` | 단위 게이트 기준선 대비 신규 실패 0 / `npm run test:unit` **1 failed** / 10856 passed. 이 파일은 HEAD 사본에서 6/6 통과, c2에서도 통과 → **c3가 새로 만든 회귀**. c2 V2-08은 설립·소송 의뢰 페이지 제목만 지적했고 `taiwan-lawyer`는 범위 밖 | `npm run test:unit` | `logs/13-test-unit-full.log`, `logs/14-vitest-growth-HEAD-baseline.log` | 제목 변경을 유지하려면 사유를 CONTENT-DIFF에 적고 해당 핀을 갱신, 아니면 원래 제목으로 되돌림 |
| C3-02 | **P1 (증거)** | ML01·ML04·ML23·ML24 | `ops/MULTILINGUAL-INTERNATIONAL-v2/` | 02 프롬프트 필수 산출물 / `BASELINE`·`TERMS`·`CONTENT-DIFF`(원문·변경문)·`LOCALE-SEO-MAP`·`RUNBOOK` 부재, 명령·종료코드 로그와 언어별 화면이 저장소 증거로 없음(scratch 경로만), `QA-BY-LOCALE.md`가 c2 후보 ID·c2 결과 그대로이고 ML16·ML19의 PASS/NOT_TESTED 모순도 그대로, 매니페스트가 c2 검수 산출물 44개를 후보 파일로 포함 | `ls ops/MULTILINGUAL-INTERNATIONAL-v2/`; `head QA-BY-LOCALE.md` | §2 | 필수 산출물 작성, QA를 c3 기준으로 재작성, 매니페스트에서 `fable/` 제외 |
| C3-03 | P2 (주장 검토) | ML08·ML23 | 가이드 `src/app/[locale]/guides/taiwan-company-setup/content.ts:502` EN ctaText | 응대 주체를 새로 만들지 않음(02 프롬프트 §5) / 신원 테스트를 통과시키려고 "Attorney Wei Tseng reviews the first enquiry"라는 **응대 주체 주장**을 새로 씀. CLAIM-REGISTER 미등재. 기존 공개 문구는 "Email Attorney Tseng for Consultation"(`public-contact.ts:112`) 수준 | 렌더 `/en/guides/taiwan-company-setup` | `logs/21-regression-sweep.log` | HEAD 문장("…we will arrange a consultation flow with Attorney Wei Tseng")에 가까운 표현으로 바꾸거나 주장으로 등재해 변호사 확인 |
| C3-04 | P2 (테스트 품질) | ML22 | `src/components/__tests__/en-acquisition-guide-links.test.tsx:104-105` | 가드 약화 시 대체 단언 / 금지 단언 2줄 삭제 후 `void locale;`만 남음 | 코드 | §3 V2-02 | 비영문 홈에 `locale-home-paths` nav가 해당 언어 href로 렌더되고 EN 허브 문구·EN href는 여전히 없음을 **양의 단언**으로 추가 |
| C3-05 | P2 (원어민 확인) | ML06·ML15 | `src/content/columns-ja/001-taiwan-company-establishment-basics.md:43`, `:119`, `:123` | 자연스러운 한정 표시 / "韓国関連の事実関係に限る。"가 문단 앞 독립 문장(체언 종지형 라벨)으로 들어감 — 의미는 전달되나 본문 문체와 어긋남 | 칼럼 정독 | §3 V2-04 | 예: "（以下は、韓国に関連する事実関係に限った説明です。）" — 원어민 검수 시 확정 |

## 5. 회귀 확인 (c2 통과 항목)

- 9개 언어 홈 200, 경로 nav 렌더(핵심 4언어 2개소, 안내형 5언어 hero 1개소), AR `dir=rtl`. 홈 경로 관련 컴포넌트(`LocaleHomePathNav`·`HeroSearch`·`CinematicOpening`·`GuidanceHomeBody`)는 c2와 **바이트 동일**이므로 c2의 4뷰포트·클릭·키보드 결과가 유효하다. 안내형 홈의 시네마틱 인스턴스는 3046 서버에서 렌더되지 않았다(환경 차이 — 컴포넌트 무변경).
- P07: 핵심 4언어 200, 안내형 5언어 404. sitemap 302 loc·P07 0건, llms.txt P07 0건.
- 명령: `tsc` 0 · `eslint`(변경·추가 src) 0 · 가드 7파일 65/65 · `npm run test:unit` 1 failed(C3-01)/10856 passed/14 skipped · `npm run build` NOT_TESTED.

## 6. 검증 부작용 기록 (정직 신고)

`next dev`를 별도 distDir(`.next-m-fable-c3`)로 띄우자 Next.js가 추적 파일 두 개를 자동 수정했다: `tsconfig.json`(include 배열 재정렬·`.next-m-fable-c3/types` 추가), `next-env.d.ts`(routes 참조 경로 변경). 두 파일은 검수 시작 시 HEAD와 동일(시작 스냅샷에 없음)했다. 서버를 종료한 뒤 `git show HEAD:<file>`로 **원래 내용으로 복원**하고 빌드 폴더를 삭제했다. 복원 후 `git diff --quiet HEAD -- tsconfig.json next-env.d.ts` 통과, 시작·종료 스냅샷 일치. 이후 이 워크트리에서 별도 distDir로 서버를 띄우는 검수자는 같은 부작용을 주의할 것.

## 7. 재작업 후 재검수 범위 (c4)

1. C3-01 핀 정리 → `npm run test:unit` 기준선 대비 신규 실패 0.
2. C3-02 증거 패키지 → 산출물 실재·QA c4 기준·매니페스트 `fable/` 제외.
3. C3-03·04·05는 P2 — 수정 시 해당 줄만 확인.
4. 이번에 해소 확인한 V2-01~05·07~11·15는 관련 파일 해시가 유지되면 재실행 생략.
5. 배포 전: V2-17 main 재통합(de/es 로케일, 대표 변호사 여성형, 반도체) 후 tsc·단위·렌더·홈 경로 재검수, V2-12 배지·초안 문구 처리, 변호사 검토(V2-16·C3-03 포함).

## 8. 상태

`implementation=UNPUBLISHED_CANDIDATE` · `technical_content_validation=CHANGES_REQUIRED` · `human_linguistic_review=PENDING` · `legal_review=PENDING` · `publication_approval=PENDING` · `publish_authorized=false` · `deployed=false` · `search/AI/inquiries/retainers=NOT_MEASURED`.
