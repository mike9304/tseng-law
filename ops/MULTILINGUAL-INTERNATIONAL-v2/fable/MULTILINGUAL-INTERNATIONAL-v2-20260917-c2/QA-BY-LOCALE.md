# QA-BY-LOCALE — MULTILINGUAL-INTERNATIONAL-v2-20260917-c2

reviewer: Claude Opus 5 (son7-a0) · 2026-09-17 11:03–11:10Z · 후보 해시 시작=종료(드리프트 없음) · 서버 127.0.0.1:3044
상태: PASS / FAIL / NOT_TESTED / BLOCKED. N/A는 실제 비해당만. 증거 경로는 이 폴더 기준.

| test_id | locale | page_role | actual_url | source_path | status | evidence / 비고 |
|---|---|---|---|---|---|---|
| ML01 | all9(+de/es) | inventory | 9개 홈 200, de/es 404 | `src/lib/public-guidance.ts` | FAIL | 로컬 9언어는 실재. Grok LOCALE-PAGE-MAP이 URL·소스 표 없는 3줄. origin/main은 11언어(V2-06, V2-17) |
| ML02 | core4 | policy | — | `ops/.../POLICY-MATRIX.md` | FAIL | EN-only 대체는 WO에 명시됐으나 정책 근거 표 없음(V2-06) |
| ML02 | vi/id/th/fil | policy | — | 동상 | FAIL | 안내형 운영 규칙 파일 인용 없음 |
| ML02 | ar | policy | — | 동상 | BLOCKED | ar/MENA 지시서 인용 없이 신규 AR 라벨(V2-07) |
| ML03 | en/ja/ko/zh-hant | P07 | `/{l}/taiwan-debt-recovery-lawyer` | P07 `content.ts` languageNote | PASS | 사무소 4언어 vs 변호사 직접 3언어 구분 |
| ML03 | vi/id/th/fil/ar | P00 | `/{l}` | guidance copy | PASS | 4언어 상담 문장 확인(`logs/22`) |
| ML04 | tree | preservation | — | git status | FAIL | EN-v1과 v2 변경 구분 문서(BASELINE/CONTENT-DIFF) 부재(V2-06). 파일 해시상 EN c2 파일은 유지 |
| ML05 | ja | P03 | `/ja/columns/taiwan-company-establishment-basics` | columns-ja/001:25 | PASS | `日本企業や個人事業者` |
| ML05 | ja | P01 | `/ja/guides/taiwan-company-setup` | guide content.ts JA | PASS | 국가별 예외 절 분리 |
| ML05 | ko | P01/P03 | `/ko/guides/taiwan-company-setup` | guide content.ts KO | PASS | 한국 고객 설명 유지 |
| ML05 | zh-hant | P01/P04 | `/zh-hant/guides/…`, `/zh-hant/services/investment` | content.ts ZH, service-details.ts | PASS | 국내/외국 구분 도입(업무 범위는 ML07·V2-16) |
| ML05 | en | P00/P01 | `/en` | EN files | PASS | EN c2 결과 재확인 |
| ML06 | ja | P03 | `/ja/columns/taiwan-company-establishment-basics` | columns-ja/001:43,117,119,123 | FAIL | 한국 전용 협정 서술에 국가 한정 표시 없음(V2-04) |
| ML06 | ja/ko/zh-hant | P01 | `/{l}/guides/taiwan-company-setup` | guide content.ts | PASS | 한국 송금·협정을 국가 예외 절로 분리, 개명 없음 |
| ML07 | ko/zh-hant vs ja/en | P01 | `/{l}/guides/taiwan-company-setup` | content.ts:176, :311 | FAIL | 협정 발효일 KO/ZH 2023.12.2 vs JA/EN·MOF 2023-12-27(V2-05) |
| ML07 | core4 | P07 | `/{l}/taiwan-debt-recovery-lawyer` | P07 content.ts | PASS | 절차·비보장·원격 범위 의미 일치(AI 대조) |
| ML07 | zh-hant | P04 | `/zh-hant/services/investment` | service-details.ts:20,25 | FAIL | 신규 고객군·韓語全程 삭제 — 근거·검토 등재 없음(V2-16, P2) |
| ML08 | core4 | P06 | `/{l}/services/civil` | service-details.ts civil | PASS | 헬스장 상해 사건 국적·결과 불변, 회수 실적 재분류 없음 |
| ML09 | en | P01/P02 | `/en/guides/…`, `/en/taiwan-company-setup-lawyer` | — | PASS | EN c2 확인 사항 유지(잔여 P2는 EN c2 D-C2-06) |
| ML09 | ja/ko/zh-hant | P02 | `/{l}/taiwan-company-setup-lawyer` | intent-pages.ts:38,99,165,233,294,295,360,361 | FAIL | 라벨 `検索ガイド/검색 가이드/搜尋指南`, ZH 제목 `律師指南`, JA planHeading(V2-08, P2) |
| ML10 | core4 | P06 | `/{l}/services/civil` | CivilCommercialBlock | PASS | 계약·대금 절 + 상해 절 보존. 메모성 문장 P2(V2-11) |
| ML11 | core4 | P07 | `/{l}/taiwan-debt-recovery-lawyer` | P07 page/content | PASS | 다섯 상황·자료·질문·mailto, 보장 표현 0 |
| ML11 | ja/ko/zh-hant | P05→P07 | `/{l}/taiwan-litigation-lawyer` | IntentLandingPage.tsx:506 | FAIL | P07 링크 0(V2-03) |
| ML12 | en/ja/ko/zh-hant | P00 | `/{l}` | LocaleHomePathNav | PASS | 3경로 href 200, 첫 화면·클릭·키보드(`logs/30`) |
| ML12 | vi/id/th/fil/ar | P00 | `/{l}` | LocaleHomePathNav | PASS | 2경로 `/services`·`/faq` 200, 첫 화면·클릭·키보드 |
| ML13 | vi/id/th/fil/ar | P00/contact | `/{l}` | guidance copy | PASS | 상담언어 문장 존재, 통역·24h·예약 보장 0 |
| ML14 | all | inquiry | mailto | diff | PASS | 추가 코드에 fetch/form/api/analytics 0, 운영 전송 0 |
| ML15 | ja/zh-hant | P07 title | `/{l}/taiwan-debt-recovery-lawyer` | content.ts:201,497 | FAIL | 브랜드 중복(V2-09, P2) |
| ML15 | core4 | chrome/CTA | homes, P07 | — | PASS | 경로 라벨·P07 본문 해당 언어 |
| ML16 | core4 | P07 switch | 전환기 | 기존 헤더 | PASS | 4언어 간 같은 주제로 이동(200) |
| ML16 | vi/id/th/fil/ar | P07 switch | 전환기 | 기존 헤더 | FAIL | 미번역 고지 없이 홈으로(V2-13, P2·기존 메커니즘) |
| ML17 | core4 | P01/P02/P04/P05/P06 | 각 URL | buildSeoMetadata | PASS | 자기 locale canonical, index,follow |
| ML17 | core4 | P07 | `/{l}/taiwan-debt-recovery-lawyer` | seo-visibility.ts | PASS | noindex,nofollow + 자기 canonical, 운영 전역 noindex 유출 없음 |
| ML18 | core4 | P07 | 동상 | — | PASS | hreflang 0, sitemap·llms.txt 0건 |
| ML18 | core4 | P01/P02 | 각 URL | — | PASS | en/ja/ko/zh-Hant/x-default 5개(ja≠jp, zh-Hant 표기) |
| ML18 | de/es | all | — | — | NOT_TESTED | 기준 커밋에 로케일 없음, 통합 후 필요(V2-17) |
| ML19 | all9 | P00 | `/{l}` | — | PASS | 1440×900·390×844·320×568·720×450(200% 등가) 첫 화면, 넘침 0, 44px 이상. JA 1440 대비 P2(V2-14) |
| ML19 | core4 | P07 | 390×844 | — | PASS | `screens/p07-*-390x844.png` |
| ML20 | ar | P00 | `/ar` | — | PASS | `dir=rtl`, 라벨·레이아웃 정상(`screens/home-ar-390x844.png`). 이메일 LTR 격리 속성 없음(기존·표시 정상) |
| ML21 | all | routes | P07 | — | PASS | 신규 locale 0, 안내형 P07 404, 핵심 4언어 P07 각 1 |
| ML22 | core4 | 공통 템플릿 | homes/services/intent | — | FAIL | 단위 가드 회귀 6건(V2-02), tsc 실패(V2-01) |
| ML22 | ja | 문자 | P07 | content.ts:312 | FAIL | 간체 `公证`(V2-10, P2) |
| ML22 | D11/D12 | — | — | — | PASS | 공개 CSS에 D11 토큰 유입 없음, D12 무실행 |
| ML23 | core4 | 배지 | civil/investment, P07 | services page.tsx:341 | FAIL | 기존 검수 배지와 미검수 신규 블록 공존, P07 초안 문구 노출(V2-12, P2 발행 차단) |
| ML23 | core4 | 출처 | CLAIM-REGISTER | ops | FAIL | 근거 URL·확인일 없음(V2-06) |
| ML24 | candidate | 해시·증거·상태 | — | manifest | FAIL | 해시 고정은 PASS, 그러나 매니페스트 자기 해시·필수 산출물 부재·QA 표기 모순·tsc/단위 실패 미보고(V2-06) |

## 고객 시나리오 (에이전트 과제 수행, 실제 고객 테스트 아님)
A EN PASS · B JA FAIL(분쟁 허브에서 P07 미도달, V2-03) · C KO FAIL(동일) · D ZH-Hant FAIL(동일) · E VI/ID/TH/FIL PASS · F AR BLOCKED(정책 근거) · G 상해 자료 PASS · H 언어 전환 FAIL(안내형 미번역 고지 없음, P2)
