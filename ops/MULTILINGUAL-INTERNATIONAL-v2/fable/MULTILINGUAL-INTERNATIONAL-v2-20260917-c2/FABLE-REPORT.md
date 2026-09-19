Verdict: CHANGES_REQUIRED

# 독립 검증 리포트 — MULTILINGUAL-INTERNATIONAL-v2-20260917-c2

> **검증 모델: Claude Opus 5 (`claude-opus-5[1m]`), 세션 son7-a0** — WO가 허용한 Fable 5.1 대체 경로. 인간 검수자·원어민·변호사가 아니다. 일본어·한국어·중국어·동남아어·아랍어 문장 판단은 AI 의미 대조이며 원어민 검수를 대체하지 않는다.
> 배포 승인 아님. `technical_content_validation=CHANGES_REQUIRED`, `human_linguistic_review=PENDING`, `legal_review=PENDING`, `publication_approval=PENDING`, `publish_authorized=false`, `deployed=false`, 성과 `NOT_MEASURED`.
> 앱 소스·v2 파일 무수정. git·배포·운영 전송 없음. 쓰기는 이 폴더에만.

## 1. 후보와 해시

| 항목 | 값 |
|---|---|
| 후보 | `MULTILINGUAL-INTERNATIONAL-v2-20260917-c2` · 워크트리 `/Users/son7/Projects/tseng-law-en-international-20260917` · 브랜치 `seo/en-international-v1-20260917` · HEAD `90352b02`(미커밋 포함) |
| 시작 해시 (11:03:00Z) | `ops/MULTILINGUAL-INTERNATIONAL-v2/candidate-manifest.sha256` 44항목 중 **43 일치**. 불일치 1건은 매니페스트가 **자기 자신**의 해시를 담은 항목이라 구조상 일치 불가(결함 V2-06 참고). 매니페스트 밖 변경은 이 WO 파일 1개뿐. `logs/manifest-check-start.txt`, `SNAPSHOT-start.sha256`(45파일) |
| 종료 해시 (11:10:07Z) | 43/44 동일, `SNAPSHOT-start.sha256` = `SNAPSHOT-end.sha256` → **검증 중 드리프트 없음** |
| 고정 사본 | 44파일 사본 + `tracked.diff`를 워크트리 밖 scratchpad에 보관(`ml-v2-c2-snapshot`) |
| 실행 환경 | 로컬 `next dev` `127.0.0.1:3044`(PID 51790, cwd=이 워크트리). Playwright Chromium, 로컬 외 요청 전부 abort(시도 0건). |
| 기준 대조 | `git archive HEAD` 사본(scratchpad)에 node_modules 심링크로 실패 테스트 4파일 재실행 |
| 동시 활동 | grok 프로세스 2개(PID 16014·36185) 생존 — cwd는 `/Users/son7`, 검증 중 쓰기 없음(해시 동일) |

## 2. 판정 요지

- **통과:** 9개 언어 홈 두 경로(핵심 4언어 설립/분쟁/가이드, 안내형 5언어 설립안내/법률문제안내) — 4개 뷰포트(1440×900·390×844·320×568·200% 등가 720×450) 첫 화면 안, 가로 넘침 0, 클릭·키보드 이동, AR `dir=rtl`. 핵심 4언어 P07 200·noindex·자기 canonical·hreflang 0·다섯 상황 H2, 안내형·de/es는 404. sitemap·llms.txt에 P07 0건. 상담언어 4개 고지(P07 languageNote·안내형 홈) 유지, 통역·SLA·예약 보장 0. JA 칼럼 도입문 `日本企業や個人事業者`, 한·대만 협정 개명 없음. 신규 폼·API·분석 호출 0.
- **차단(필수 FAIL):** `tsc` 실패, 기준선에서 통과하던 단위 테스트 6건 회귀, JA 칼럼의 한국 전용 조세협정이 일본 독자용 도입문 아래 국가 표시 없이 남음, KO/ZH 가이드의 협정 발효일 오류(JA/EN과 불일치), JA/KO/ZH 분쟁 허브에서 P07 경로 없음, Grok 증거 산출물 결손, AR 신규 문구의 정책 근거 없음.
- **배포 전 별도 조건:** 후보 기준 `90352b02`는 origin/main `c4270097`보다 **48커밋 뒤**다(de/es 안내 로케일, 대표 변호사 여성형 정정, 반도체 랜딩). 양쪽이 모두 바꾼 파일 10개. 재통합 후 재검수 필요(V2-17).

## 3. 결함 표

| ID | 심각도 | 요구 | 위치 | 기대 / 실제 | 재현 | 증거 | Grok 재작업 지시 |
|---|---|---|---|---|---|---|---|
| V2-01 | **P1** | ML24·기술 | `src/app/[locale]/taiwan-debt-recovery-lawyer/content.ts:644` | typecheck 0 / `TS2322` — `keywords` readonly 튜플을 `string[]`에 대입 | `npx tsc -p tsconfig.json --noEmit --incremental false` → exit 2 | `logs/10-tsc.log` | 타입을 `readonly string[]`로 받거나 `as const` 제거 |
| V2-02 | **P1** | ML22·ML24 | 단위 테스트 4파일 6건 (**HEAD 90352b02에서는 4파일 44/44 통과**) | 기존 가드 유지 또는 근거 있는 갱신 / ① `intent-contact-paths.test.tsx:45` P05 헤더에 `intent-chip` 금지(EN 상황 nav를 헤더로 이동) ② `intent-pages-ja.test.ts:90` JA 비용표 6행 vs KO 7행(JA 협정 행 삭제) ③ `en-acquisition-guide-links.test.tsx:104` ja/ko/zh-hant 홈에 `/{locale}/taiwan-company-setup-lawyer` 링크 금지 가드 3건(v2 홈 경로와 정면 충돌) ④ `canonical-public-route-identity.test.ts:29` EN 가이드 CTA에서 "Attorney Wei Tseng" 소실 | `npm run test:unit` → 6 failed / 10851 passed | `logs/13-*.log`, `logs/14-vitest-4files-HEAD-baseline.log` | ①②④는 원고·구조를 맞추거나 사유를 적고 테스트 갱신. ③은 P1-5 가드의 의도(EN 획득 허브 비노출)와 v2 홈 경로를 구분하도록 가드를 좁히되, 결정 근거를 CONTENT-DIFF에 기록 |
| V2-03 | **P1** | ML11·시나리오 B/C/D | `src/components/IntentLandingPage.tsx:506` `locale === 'en' && slug === 'taiwan-litigation-lawyer'` | JA/KO/ZH 분쟁 고객이 P00→P05→P07로 도달 / `/ja|ko|zh-hant/taiwan-litigation-lawyer`에 P07 링크 **0**(EN만 있음). JA/KO/ZH P07 진입은 P06 민사 페이지 1곳뿐 | 홈 "台湾でのトラブルを相談する" 클릭 → `/ja/taiwan-litigation-lawyer`에서 `taiwan-debt-recovery-lawyer` href 검색 | `logs/20-render-matrix.log` (debtLink=False) | 상황별 진입 nav를 핵심 4언어로 확장(각 언어 라벨, 형사·가사·민사 분기 포함) |
| V2-04 | **P1** | ML06·ML05 | `src/content/columns-ja/001-taiwan-company-establishment-basics.md:25`(도입 `日本企業や個人事業者`) vs `:43`, `:117`(§5 제목 `税金と台湾・韓国所得税協定`), `:119`, `:123` | 국가별 예외는 해당 국가 설명으로 분리 / 도입문이 일본 독자를 기본으로 바꾼 뒤에도 한·대만 협정 10% 서술이 국가 한정 표시 없이 본문 일반 서술로 남음 → 일본 독자가 자신에게 적용되는 세율로 오독할 위험(EN 칼럼은 `Country-specific note` 표시) | 칼럼 본문 정독 | 본 리포트 §4 | 43·117·119·123행을 "韓国関連の事実関係に限る" 국가 한정 표시로 감싸기. **일본 관련 새 조세 주장 추가 금지**(근거·변호사 검토 없이) |
| V2-05 | **P1** | ML07·ML23 | `src/app/[locale]/guides/taiwan-company-setup/content.ts:176`(KO) `2023.12.2 발효`, `:311`(ZH) `2023.12.2生效` | 같은 주장은 언어 간 일치 + 공식 근거 / 대만 재정부 영문 협정 페이지(2026-09-17 열람)·JA 가이드 `:554`·JA/ZH/EN 칼럼은 **2023-12-27 발효, 2024-01-01 적용**. KO/ZH만 12월 2일 | 파일 grep | MOF `https://www.mof.gov.tw/eng/singlehtml/f48d641f159a4866b1d31c0916fbcc71?cntId=e1e57a4211474ff9b5d63a83b30dcf10` | KO/ZH 날짜를 공식 출처로 정정 후 변호사 검토 표시. JA 행 삭제는 V2-02②와 함께 결정 |
| V2-06 | **P1** | ML01·ML02·ML04·ML24 | `ops/MULTILINGUAL-INTERNATIONAL-v2/` | 02 프롬프트 필수 산출물 / `LOCALE-PAGE-MAP` 3줄(URL·소스·상태 표 없음), `POLICY-MATRIX` 3줄(ar/MENA·안내형 정책 파일 경로·조항 없음), `CLAIM-REGISTER` 4줄(근거 URL·확인일 없음). `BASELINE`·`TERMS`·`CONTENT-DIFF`·`LOCALE-SEO-MAP`·`RUNBOOK`·명령 로그·화면 **부재**(로그는 `{SCRATCH}` 자리표시자). QA-BY-LOCALE이 ML16·ML19를 PASS로 적고 비고에 NOT_TESTED 기재. 매니페스트가 자기 해시 포함. tsc·단위 회귀 미보고 | `ls -la ops/MULTILINGUAL-INTERNATIONAL-v2/` | 본 리포트 §1 | 필수 산출물 작성, 매니페스트에서 자기 자신 제외, EN-v1 기존 변경과 v2 변경을 파일 단위로 구분(ML04) |
| V2-07 | **BLOCKED** | ML02·ML20 | `src/data/multilingual-international-v2.ts:143` `GUIDANCE_HOME_PATHS.ar` (신규 아랍어 라벨 2개) | 정책 확인된 범위만 AR 문구 추가 / POLICY-MATRIX에 ar/MENA 지시서 경로·조항 인용 없음. Grok은 "AR extra copy BLOCKED"라 적었으나 경로 라벨 자체가 신규 아랍어 문구 | — | `screens/home-ar-390x844.png`(렌더·RTL 자체는 정상) | MENA 보드 소유자 확인 후 정책 근거 인용. 확인 전 AR 라벨은 보류 |
| V2-08 | P2 | ML09·ML15 | `src/data/intent-pages.ts:38,99,165`(KO `검색 가이드`), `:233,294,360`(ZH `搜尋指南`), `:295` `台灣公司設立律師指南`, `:361` `台灣訴訟律師指南`; JA P02 라벨 `検索ガイド`; JA 가이드 `content.ts:530` planHeading | 의뢰 페이지가 스스로를 "가이드"라 부르지 않음 / EN만 라벨 교체. JA planHeading에 가이드 제목 문구를 그대로 사용(섹션 목적과 불일치) | 렌더 title·라벨 | `logs/20-render-matrix.log` | 핵심 3언어 P02·P05 라벨/제목 정비, JA planHeading을 "事業計画から整理する"류 섹션 제목으로 |
| V2-09 | P2 | ML15 | P07 `content.ts:201`(JA)·`:497`(ZH) metaTitle | 브랜드 1회 / 렌더 `… | 昊鼎 | 昊鼎国際法律事務所`, `… | 昊鼎 | 昊鼎國際法律事務所` | curl title | `logs/40-simplified-scan.log` 하단 | metaTitle에서 브랜드 접미 제거 |
| V2-10 | P2 | ML22 | P07 `content.ts:312` JA `公证` | 일본어 표기 / 간체자 `证` → `公証` | 추가 행 문자 검사 | `logs/40-simplified-scan.log` | 교체 |
| V2-11 | P2 | ML10·ML15 | 고객 화면에 노출되는 작업 메모성 문장: `multilingual-international-v2.ts:171-195` injuryBody(예: "企業の回収結果に読み替えません"), 가이드 `content.ts:114`(KO "…한국 관련 송금·조세 조건은 유지합니다"), `:240`(ZH "不會把所有案件都寫成外國投資案件"), `:532`(JA "韓国企業をすべての読者の前提にはしません"), `:554`(JA "日本の租税条約に名前を付け替えた説明ではありません"), `service-details.ts:25`(ZH "台灣國內案件與外國投資案件的說明並不互相取代") | 독자 대상 문장 / 편집 방침을 독자에게 설명 | 렌더 | §4 | 독자 행동 기준 문장으로 재작성 또는 삭제 |
| V2-12 | P2 (발행 차단) | ML23 | `src/app/[locale]/services/[slug]/page.tsx:341` `svc-review-note`(검수 배지) 아래·위에 신규 블록(`CivilCommercialBlock`·투자 경로) 4언어 / P07 `reviewNote` 4언어 화면 노출 | 수정 원고에 기존 검수 배지 자동 승계 금지 / 기존 "변호사 검수" 표시가 미검수 신규 블록과 같은 페이지에 표시. P07은 초안 문구가 공개 화면에 보임(머지 시 noindex 라우트가 공개 도달) | 렌더 | `screens/p07-ja-390x844.png` | 발행 전 배지 범위 명시 또는 변호사 검수 후 배지 유지 판단. 초안 문구는 발행 전 제거 |
| V2-13 | P2 | ML16 | 헤더 언어 전환기(기존 메커니즘) | 번역 없으면 고지 / P07에서 vi·id·th·fil·ar 선택 시 고지 없이 각 언어 홈으로 이동(404는 아님). 핵심 4언어 간은 같은 주제로 이동 | P07 전환기 href 추출 | `logs/21-guidance-switcher-ar.log` | 미번역 대상 고지(사이트 공통 사안이라 별도 WO 가능) |
| V2-14 | P2 | ML19 | JA 홈 1440×900 시네마틱 오버레이 가이드 링크 | 가독 대비 / 밝은 구름 위 어두운 밑줄 텍스트, 일부 판독 어려움 | 스크린샷 | `screens/home-ja-1440x900.png` | 배경 칩 또는 라이트 톤 조정 |
| V2-15 | P2 | ML11·접근성 | P07 `page.tsx:89`·`:92` | 제목 계층 / 상황 묶음 H2 바로 아래 상황별 H2 중첩(4언어) | DOM | `logs/20-render-matrix.log` | 상황별 제목 H3 |
| V2-16 | P2 (법률 검토) | ML07·ML23 | `src/data/service-details.ts:20,25` ZH 투자 서비스 부제·도입 | 업무 범위 주장 근거 / "台灣本地企業與外國投資人" 신규 고객군 표기, 기존 "韓語全程對接" 삭제 | diff | §4 | 변호사 확인 대상으로 CLAIM-REGISTER 등재 |
| V2-17 | **P1 (배포 전 통합)** | ML18·ML21·ML24 | 브랜치 기준 | 최신 main 위 후보 / HEAD `90352b02`, origin/main `c4270097`(+48). 양측 변경 10파일(`logs/overlap-with-origin-main.txt`). main은 안내 로케일에 de/es 포함 → `GUIDANCE_HOME_PATHS: Record<GuidanceLocale,…>`가 de/es 누락으로 머지 후 타입 오류가 날 가능성[추정], de/es 홈 경로 미정의. main의 대표 변호사 여성형 정정과의 충돌 확인 필요 | `git log HEAD..origin/main` | `logs/overlap-with-origin-main.txt` | main 재통합 → de/es 경로 정책 결정(안내형 규칙 적용 여부) → tsc·단위·렌더 재실행 → 재검수 |

참고(범위 밖·기존): JA 시네마틱 오프닝 문구 "台湾の法律相談・日本語・英語・韓国語で対応"가 중국어를 빠뜨림(HEAD부터 동일). AR 이메일 링크에 LTR 격리 속성은 없으나 화면 표시는 정상(기존). 안내형 "설립 안내" 경로가 `/xx/services` 상단으로 이동하며 설립 섹션은 첫 H2(앵커 연결 권고).

## 4. 원고 의미·국가 예외·업무 범위 검토 (AI 의미 대조, 원어민·변호사 검수 아님)

- **EN:** EN-INTERNATIONAL-v1 c2 결과를 복사하지 않고 다시 렌더 확인. 홈 두 경로·P07·P06 블록 정상. EN c2 리포트(`out/EN-INTERNATIONAL-v1/fable/EN-INTERNATIONAL-v1-20260917-c2/FABLE-REPORT.md`)의 D-C2-04~10(P01 공식 출처 0, 검수 배지, P02 description 잔여 "guide", P03→P01 링크 부재, 내부 메모성 문장, korean-lawyer 언어 문장 불일치)은 이 후보에도 그대로 해당한다.
- **JA:** 도입문 일본 독자화는 요구대로. 협정은 개명하지 않았으나 국가 한정 표시가 없어 V2-04. 가이드는 국가별 예외 절을 신설해 한국 송금·협정을 분리(적절). P07 다섯 상황·비보장 문구 적절, `公证` 1자(V2-10). 실제 한국인 상해 사건은 변경 없음.
- **KO:** 한국 고객 도입문·한국 은행 송금 설명 유지(요구대로). 계획 질문에 "한국 본사" 전제는 한국어 독자 대상이라 허용 범위. 협정 발효일 오류 잔존(V2-05).
- **ZH-Hant:** 대만 국내 기업과 외국 투자자 구분을 도입했으나 신규 고객군 표기와 "韓語全程對接" 삭제는 업무 범위 변경이라 변호사 확인 필요(V2-16). 협정 발효일 오류(V2-05). P02/P05 제목이 "律師指南"(V2-08).
- **VI/ID/TH/FIL:** 신규 문구는 홈 경로 라벨 2개씩뿐. 목적지 `/services`(첫 H2가 투자·회사설립)·`/faq`는 실재·200. 홈에 상담언어 4개 문장 존재, 통역·24시간·예약 보장 표현 0.
- **AR:** RTL·레이아웃 정상, 상담언어 제한 문장 존재. 신규 라벨의 정책 근거 없음(V2-07).
- **상담언어:** 9개 언어 상담 광고 없음. P07 4언어 languageNote는 사무소 4언어와 변호사 직접 3언어를 구분.

## 5. 언어별 기술 결과 요약

| locale | 홈 두 경로(4뷰포트·클릭·키보드) | P07 | P01/P02 canonical·hreflang | P06 블록 | 비고 |
|---|---|---|---|---|---|
| en | PASS | 200 noindex, 5상황 | 자기 canonical, 5 hreflang | 있음 | EN c2 결함 이월 |
| ja | PASS (대비 P2) | 200 noindex, 5상황 | 자기 canonical, 5 | 있음 | V2-03·04·08·09·10 |
| ko | PASS | 200 noindex, 5상황 | 자기 canonical, 5 | 있음 | V2-03·05·08 |
| zh-hant | PASS | 200 noindex, 5상황 | 자기 canonical, 5 | 있음 | V2-03·05·08·09·16 |
| vi/id/th/fil | PASS (`/services`·`/faq`) | 404 (정상) | 기존 | N/A(민사 서비스 상세 없음) | 상담언어 고지 확인 |
| ar | PASS, `dir=rtl` | 404 (정상) | 기존 | N/A | V2-07 BLOCKED |
| de/es | 이 기준 커밋에 로케일 없음(404) | 404 | — | — | V2-17 |

명령: `tsc` exit 2 · `eslint`(변경·추가 src) exit 0 · 지정 vitest 5파일 2 failed/49 passed(`multilingual-international-v2.test.tsx` 14/14, `en-international-v1.test.tsx` 4/4, P07 page 3/3 통과) · `npm run test:unit` 6 failed/10851 passed/14 skipped · HEAD 사본 4파일 44/44 passed · `npm run build` 미실행(NOT_TESTED — tsc 실패 상태라 우선 수정 필요).

## 6. 재작업 후 재검수 범위

1. V2-01~07 수정 + main 재통합(V2-17) 후 새 후보 ID와 매니페스트(자기 해시 제외).
2. 재실행: `tsc` 0, `npm run test:unit` 기준선 대비 신규 실패 0, `npm run build`.
3. 재확인 표적: JA 칼럼 43·117·119·123행, KO/ZH 가이드 협정 행, JA/KO/ZH P05→P07 링크와 클릭 이동, AR 정책 인용, de/es 홈 경로 정책, 필수 산출물 실재.
4. 이번에 PASS한 항목(홈 경로 9언어·4뷰포트, P07 색인 경계, 상담언어 고지)은 해당 파일 해시가 유지되면 표본 재확인만.

## 7. 상태

`implementation=UNPUBLISHED_CANDIDATE(Grok 주장)` · `technical_content_validation=CHANGES_REQUIRED` · `human_linguistic_review=PENDING` · `legal_review=PENDING` · `publication_approval=PENDING` · `publish_authorized=false` · `deployed=false` · `search/AI/inquiries/retainers=NOT_MEASURED`.
