# Grok Bot → Claude — SEA GSC 베이스라인 실측 — 2026-09-09

손빗이 **로그인된 Google Search Console**(`sc-domain:tseng-law.com`)에서 직접 본 값만 적는다.
추정·다른 도구 대리는 없다. 못 본 항목은 **미추출/미확인**으로 둔다.

대상 파일(레포): `docs/seo/FROM-GROK-BOT-SEA-2026-09.md`  
원본 스크래치: `/workspace/exports/sea-2026-09/`

---

## 0. 조회 조건 (공통)

| 항목 | 값 |
|---|---|
| 속성 | `sc-domain:tseng-law.com` (UI: tseng-law.com) |
| 조회일(KST) | **2026-09-09** (국가 개요 ~11:45–11:47 · 생성형 AI 11:43 · 페이지/색인 11:58) |
| 실적 기간 | **28일** (`num_of_days=28`, UI 칩 `28일`) |
| 검색 유형 | **웹** |
| 국가 필터 UI | `국가: <국가명>` (URL 코드: vnm / idn / tha / phl / mys / sgp) |
| 설정·색인요청 | **변경 없음 / Request Indexing 클릭 없음** |

---

## 1. 국가별 지난 28일 (노출·클릭·평균순위 + 페이지 상위)

국가 칩만 바꾼 사이트 전체 합계. 페이지 탭은 같은 필터.

| 국가 | 클릭 | 노출 | CTR | 평균순위 | 페이지 상위(최대20) | 개요 시각(KST) |
|---|---:|---:|---:|---:|---|---|
| Vietnam (VN) | 0 | 1 | 0% | 11 | **0행** | 11:45:45 |
| Indonesia (ID) | 0 | 1 | 0% | 8 | **0행** | 11:45:55 |
| Thailand (TH) | 0 | 0 | 0% | 0 | **0행** | 11:46:11 |
| Philippines (PH) | 0 | 1 | 0% | 86 | **0행** | 11:46:26 |
| Malaysia (MY) | 0 | 7 | 0% | 3.1 | **0행** | 11:46:42 |
| Singapore (SG) | 2 | 20 | 10% | 49.7 | 1행: `https://tseng-law.com/zh-hant/guides/taiwan-company-setup` — 클릭 0 · 노출 15 · CTR 0% · 순위 63.73 | 11:46:56 |

**합계(6개국):** 클릭 **2** · 노출 **30**. SEA 로케일(`/vi` `/id` `/th` `/fil`) 페이지는 이 국가 필터 페이지 탭에 **한 행도 없음**.

스크린샷: `/workspace/exports/sea-2026-09/{vietnam,indonesia,thailand,philippines,malaysia,singapore}-overview.png`

---

## 2. 생성형 AI 리포트 (28일)

| 항목 | 값 |
|---|---|
| 리포트 | 검색실적 UI **생성형 AI** |
| 조회 | **2026-09-09 11:43:19 KST** |
| 노출 | **34** |
| 클릭 | **0** |

스크린샷: `/workspace/exports/sea-2026-09/generative-ai-overview.png`

---

## 3. `/vi` `/id` `/th` `/fil` 40 URL 색인 상태

사이트맵에서 확인한 40 URL(로케일당 홈+about+columns+contact+disclaimer+faq+lawyers+pricing+privacy+services).

### 3a. 사이트 전체 색인 카드 (맥락, 2026-09-09 11:58 KST)

| 버킷 | 수 |
|---|---:|
| 색인 생성됨 | **27** |
| 색인이 생성되지 않은 페이지 | **148** |
| 발견됨 - 현재 색인이 생성되지 않음 | **127** |
| 크롤링됨 - 현재 색인이 생성되지 않음 | **12** |
| 리디렉션이 포함된 페이지 | **7** |
| NOINDEX 태그에 의해 제외 | **2** |

색인됨 27개 목록(드릴다운)에 `/vi` `/id` `/th` `/fil` **0건**. 보이는 색인 URL은 `/ko` `/en` `/ja` `/zh-hant` 계열.

### 3b. URL 검사 / 페이지 리포트 결과

방법: 페이지 리포트에 SEA prefix contains 필터 **없음** → 루트·표본 URL 검사 + 색인됨 목록에 SEA 부재로 교차. Request Indexing **안 함**.

| URL | 상태 |
|---|---|
| https://tseng-law.com/vi | 미색인 — URL이 Google에 등록되어 있지 않음 / 아직 알려지지 않은 URL |
| https://tseng-law.com/vi/about | 〃 |
| https://tseng-law.com/vi/columns | 〃 |
| https://tseng-law.com/vi/contact | 〃 |
| https://tseng-law.com/vi/disclaimer | 〃 |
| https://tseng-law.com/vi/faq | 〃 |
| https://tseng-law.com/vi/lawyers | 〃 |
| https://tseng-law.com/vi/pricing | 〃 |
| https://tseng-law.com/vi/privacy | 〃 |
| https://tseng-law.com/vi/services | 〃 |
| https://tseng-law.com/id | 〃 |
| https://tseng-law.com/id/about | 〃 |
| https://tseng-law.com/id/columns | **미확인** (개별 검사 미실시) |
| https://tseng-law.com/id/contact | 미확인 |
| https://tseng-law.com/id/disclaimer | 미확인 |
| https://tseng-law.com/id/faq | 미확인 |
| https://tseng-law.com/id/lawyers | 미확인 |
| https://tseng-law.com/id/pricing | 미확인 |
| https://tseng-law.com/id/privacy | 미확인 |
| https://tseng-law.com/id/services | 미확인 |
| https://tseng-law.com/th | 미색인 — URL이 Google에 등록되어 있지 않음 / 아직 알려지지 않은 URL |
| https://tseng-law.com/th/about … /services (9) | **미확인** |
| https://tseng-law.com/fil | 미색인 — URL이 Google에 등록되어 있지 않음 / 아직 알려지지 않은 URL |
| https://tseng-law.com/fil/about … /services (9) | **미확인** |

**요약:** 개별 확인 14/40 = 전부 **미등록(알려지지 않음)**. 색인됨 목록에 SEA 0. 나머지 26은 **미확인**(같은 패턴 가능성 높으나 추정으로 채우지 않음).

---

## 4. 12주 채점용 메모

- 재측정 권장일: **2026-12-02** (동일 필터: 28일·웹·동일 6개국·생성형 AI·동일 40 URL).
- 오늘 분모: SEA 국가 클릭 2 / 노출 30, 생성형 AI 노출 34, SEA 40 URL 색인 확인분 0.

