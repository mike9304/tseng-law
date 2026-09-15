# M2c 색인·콘솔 계획 — MENA ar (중동 7국)

> **초안 · 총괄 미승인 · 실행 0**

| 항목 | 값 |
|---|---|
| 작성 | 2026-09-16 · 문서 워커 Grok 4.6 · 총괄 Fable 5.1(son7-db) |
| 상태 | 계획만. GSC / Bing WMT / IndexNow / GBP / 배포 **실행 0** |
| 대상 | `ar` 안내 로케일이 **라이브에 붙은 뒤** AE·SA·QA·KW·BH·OM·EG 색인·노출 확보 |
| 선례 | `docs/seo/sea-geo-plan/evidence/s4-indexing.md`, `docs/seo/sea-geo-plan/GOAL.md` S4 보드, `docs/seo/sea-geo-plan/RUNBOOK.md` §3 라이브 명령, `docs/seo/EN-SEA-MEASUREMENT-2026-09.md` |
| 실행 주체 | 콘솔·IndexNow = 손빗(사용자 게이트). 이 문서는 발주·복붙용 |

`docs/seo/sea-geo-plan/RUNBOOK.md`에는 **「§S4」제목이 없다.** S4 정본은 GOAL.md S4 보드(S4-a 로컬 hreflang → S4-b 라이브 스캔 → S4-c IndexNow·GSC 요청 → S4-d 2주 재확인)이고, 명령은 RUNBOOK §3 라이브 줄과 PROMPT.md §5 스트림 표다. 이 문서는 그 네 칸을 MENA `ar`에 맞춰 다시 쓴다.

---

## 0. 계약 · 근거 등급 · 하지 않는 것

### 0.1 언어 계약

- `ar` = **안내(guidance) 언어**. SEA `vi/id/th/fil`과 동일 축.
- 상담 가능 언어는 **English / Chinese / Japanese / Korean** 뿐 (`en` / `zh-hant` / `ja` / `ko`). 코드: `src/lib/consultation/intake-language-contract.ts` `CONSULTATION_LANGUAGES`, `src/lib/seo.ts` `GUIDANCE_CONSULTATION_LANGUAGES`.
- 메타·본문·FAQ·JSON-LD `availableLanguage`에 **아랍어 상담·통역 가능**을 쓰지 않는다.
- 국가 가정은 「걸프·이집트에 있는 독자가 **대만법**이 필요할 때」이지, 그 나라에 사무소가 있다는 뜻이 아니다.

### 0.2 근거 등급 (SEA PROMPT §4-8과 동일)

| 등급 | 뜻 |
|---|---|
| **A** | 구글·빙·IndexNow.org 공식 문서 축자 |
| **B** | 업계 측정기(StatCounter 국가 페이지 등) |
| **C** | 업계 리서치·벤더 |
| **D** | 언론 |
| **E** | 추정 — 본문에 쓰지 않고 「미확인」 |
| **사내실측** | 손빗이 로그인 콘솔에서 읽은 값 (`FROM-GROK-BOT-*`, `evidence/s4-*`) |

검색량·트래픽·점유율·ROI를 **지어내지 않는다.** 출처 없는 규모는 **미확인**. 승소율·최고·유일 표현 금지 (`docs/seo/taiwan-lawyer-ad-rules-2026-08-18.md`).

### 0.3 이 초안이 주장하지 않는 것

- `ar`이 이미 라이브라는 것 — **이 브랜치 `public-guidance.ts`의 `GUIDANCE_LOCALES_4`는 아직 `vi,id,th,fil`.** `ar` 라우팅은 별 레인. 아래 URL은 **배포 후 예상**.
- IndexNow HTTP 200 = 색인. 공식: 200은 수신 확인일 뿐 ([IndexNow.org Documentation](https://www.indexnow.org/documentation), 조회 2026-09-16).
- GSC 「색인 요청」= 검색 노출. 공식: 크롤 요청은 색인·노출을 보장하지 않음 ([Ask Google to recrawl](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl), 조회 2026-09-16).
- 중동에서 Bing/Copilot이 「크다」는 것 — §3. StatCounter Bing은 2~4%대(B). Copilot 사용 비중은 **미확인**.

---

## 1. 배포 직후 순서 (S4-b → S4-c 대응)

전제: 사용자 ASK로 **라이브 배포가 끝난 뒤**. 배포 승인 ASK는 이 문서 범위 밖(M6). 아래는 배포 그린 확인 이후의 색인 레인만.

### 1.1 예상 `ar` URL 수 — 코어 10 + 칼럼 기사 0

근거: `src/lib/public-guidance.ts` `GUIDANCE_CORE_ROUTE_KEYS` 10개(홈은 빈 슬러그, `home`이 아님). 사이트맵 루프는 같은 파일의 `GUIDANCE_PAGE_KEYS` × 안내 로케일 (`src/app/sitemap.ts` `appendGuidanceLocaleSitemapEntries`).

| # | 키 | 배포 후 예상 URL | 비고 |
|---|---|---|---|
| 1 | `''` (home) | `https://tseng-law.com/ar` | |
| 2 | `services` | `https://tseng-law.com/ar/services` | |
| 3 | `about` | `https://tseng-law.com/ar/about` | |
| 4 | `lawyers` | `https://tseng-law.com/ar/lawyers` | |
| 5 | `pricing` | `https://tseng-law.com/ar/pricing` | |
| 6 | `contact` | `https://tseng-law.com/ar/contact` | |
| 7 | `faq` | `https://tseng-law.com/ar/faq` | EN noindex 경로. x-default는 `/ko/faq` (현행 `buildGuidanceCoreLanguageAlternates`) |
| 8 | `privacy` | `https://tseng-law.com/ar/privacy` | |
| 9 | `disclaimer` | `https://tseng-law.com/ar/disclaimer` | |
| 10 | `columns` | `https://tseng-law.com/ar/columns` | **목록 페이지**. 기사 URL 아님 |

칼럼 **기사 0**: `src/lib/column-locales.ts`는 파일이 있는 로케일만 사이트맵에 넣는다. 이 워크트리에 `src/content/columns-ar/` **없음**(조회 2026-09-16). SEA 선례도 색인 요청 분모를 로케일당 코어 10으로 잡음 (`FROM-GROK-BOT-SEA-2026-09.md` §3, 40 URL = 4 × 10).

`ar`이 `GUIDANCE_LOCALES_4`에 붙으면 사이트맵에 **+10 loc**이 생긴다. 기존 ko/zh-hant/en/ja/vi/id/th/fil 코어의 hreflang 클러스터에 `ar`이 추가되는 것은 별개(§1.3).

### 1.2 순서 (한 줄에 한 게이트)

| 순 | 작업 | 누가 | 완료 조건 | 하지 말 것 |
|---|---|---|---|---|
| 0 | 라이브 200·canonical self | 총괄 또는 손빗 | `/ar` 및 코어 9가 HTTP 200, canonical이 자기 URL | 스테이징 호스트를 콘솔에 제출 |
| 1 | hreflang `ar` 상호성 | 총괄 curl 또는 확장된 live 스크립트 | §1.5 | `ar-AE` 등 국가 변형 태그 추가 |
| 2 | GSC 사이트맵 확인·필요 시 재제출 | 손빗 (ASK ①) | `https://tseng-law.com/sitemap.xml` 상태가 성공이고, 발견 페이지 수가 배포 전 대비 늘었거나 재제출함 | 새 속성 만들기. www 사이트맵 추가 |
| 3 | IndexNow **변경분 10 URL** | 손빗 (ASK ①) | 스크립트 HTTP 200. dry-run으로 목록 확인 후 POST | 사이트맵 전량·구 URL 소급 (`SEO-DIAGNOSIS` 기각 4, Bing 핸드오프 「전량 핑 하지 마라」) |
| 4 | GSC URL 검사 10건 | 손빗 (ASK ①) | 10행 상태 기록(색인/미등록/기타) | 라이브 테스트를 10건 모두 돌리기(할당 별도) |
| 5 | Request indexing (미색인만, 할당 내) | 손빗 (ASK ①) | 우선순위 §1.4. 할당 메시지 나오는 즉시 중단 | 같은 URL 당일 재요청. 거부된 홈을 같은 날 반복 |
| 6 | Bing WMT 사이트맵 확인 | 손빗 (ASK ①) | 기존 속성에서 sitemap.xml 처리 상태 기록 | 걸프 GBP 생성, 새 Bing 속성 남발 |
| 7 | 2주 후 재확인 | 손빗 (ASK ②) | §5.2 | 1차와 같은 날 잔여분 우회 재시도 |

SEA S4-c 실측(2026-09-09, `evidence/s4-indexing.md`): IndexNow 40 URL HTTP 200 · GSC 사이트맵 Success라 **재제출 버튼 없음 → 미실행** · Request indexing 16 시도 중 요청 8 / 거부 3(vi·id·th 홈) / 오류 3 / 할당량으로 2 미시도. **같은 패턴을 전제로 짠다.**

### 1.3 IndexNow — 현행 스크립트

grep `indexnow` 위치 (이 워크트리, 2026-09-16):

| 파일 | 역할 |
|---|---|
| `scripts/indexnow-submit.mjs` | CLI. `https://api.indexnow.org/indexnow` POST |
| `src/lib/indexnow.ts` | 동일 상수·`submitIndexNow()`. 스크립트와 키/호스트 동기화 주석 |
| `public/<INDEXNOW_KEY>.txt` | 소유 확인 키 파일. `keyLocation` = `https://tseng-law.com/<key>.txt` |

`package.json`에 `indexnow` npm 스크립트는 **없음**. 명령은 node 직접.

배포 후 (ASK ① 승인 시에만):

```bash
# 1) 목록 확인 — POST 없음
node scripts/indexnow-submit.mjs --urls \
https://tseng-law.com/ar,https://tseng-law.com/ar/services,https://tseng-law.com/ar/about,https://tseng-law.com/ar/lawyers,https://tseng-law.com/ar/pricing,https://tseng-law.com/ar/contact,https://tseng-law.com/ar/faq,https://tseng-law.com/ar/privacy,https://tseng-law.com/ar/disclaimer,https://tseng-law.com/ar/columns \
--dry-run

# 2) 승인 후 실제. 전량 사이트맵 기본 모드(인자 없이 실행) 쓰지 말 것
node scripts/indexnow-submit.mjs --urls \
https://tseng-law.com/ar,https://tseng-law.com/ar/services,https://tseng-law.com/ar/about,https://tseng-law.com/ar/lawyers,https://tseng-law.com/ar/pricing,https://tseng-law.com/ar/contact,https://tseng-law.com/ar/faq,https://tseng-law.com/ar/privacy,https://tseng-law.com/ar/disclaimer,https://tseng-law.com/ar/columns
```

- 기본값(URL 생략)은 라이브 sitemap.xml **전량**을 뽑아 최대 10,000개 POST한다. 8/18 진단·Bing 핸드오프와 충돌. **`--urls` 10개만.**
- 기존 8로케일 코어 HTML에 `hreflang="ar"`이 붙는 변경은 사이트맵 재읽힘에 맡긴다. SEA S4-c도 **신규 로케일 URL만** 40개 제출.
- 200 ≠ 색인. FAQ 축자: “Submitting a URL does not guarantee immediate indexing.” ([IndexNow.org FAQ](https://www.indexnow.org/faq), 조회 2026-09-16).
- 참여 엔진(FAQ 동일 조회): Bing, Naver, Seznam, Yandex, Yep, Amazon 등. **Google은 IndexNow 수신 엔진이 아니다.** 구글은 사이트맵 + URL 검사.

### 1.4 GSC URL 검사 · 색인 요청 우선순위 10

속성: 이미 `sc-domain:tseng-law.com` (`FROM-GROK-BOT-SEA-2026-09.md`). `ar`용 새 속성 **불필요**.

**검사(10/10, 라이브 테스트는 기본 생략)** — 색인됨 여부만.

**Request indexing** — 미색인만, 아래 순. 이미 「URL이 Google에 등록」이면 요청하지 않음(공식: 같은 URL 반복이 대기열을 올리지 않음, `FROM-GROK-BOT-GSC-2026-08-18.md` 확인 문구).

| 순위 | URL | 이유 |
|---|---|---|
| 1 | `/ar/services` | 회사설립·분쟁 안내 진입 |
| 2 | `/ar/contact` | 문의. 상담 언어 고지가 있는 페이지여야 함 |
| 3 | `/ar/faq` | 질문형. EN alternate 없음(현행 noindex 규칙) |
| 4 | `/ar/about` | 사무소=대만 4곳 정합 |
| 5 | `/ar/lawyers` | |
| 6 | `/ar/pricing` | |
| 7 | `/ar/privacy` | |
| 8 | `/ar/disclaimer` | |
| 9 | `/ar/columns` | 목록만. 기사 0 |
| 10 | `/ar` (홈) | SEA S4-c에서 vi/id/th 홈 **거부됨**, 사유 미확인 → 마지막. 할당 남으면 1회만 |

**일일 할당 (A, 수치 미공개):**

- URL 검사(인덱스 상태): “There is a daily limit of inspection requests for each property that you own.” ([Inspect a URL](https://support.google.com/webmasters/answer/9012289?hl=en), 조회 2026-09-16)
- 라이브 테스트: “per-property daily limit of live inspections.” (동일)
- 색인 요청: “There is a daily limit to how many index requests you can submit.” / 문서 제목 구절 “just a few URLs” ([Ask Google to recrawl](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl), 조회 2026-09-16)
- 공식은 **정확한 일일 건수를 공개하지 않음 → 숫자 지어내지 않음.**
- 사내실측: 2026-09-09 SEA는 16 URL을 시도하다 약 14건 처리 후 「할당량 초과」로 중단 (`s4-indexing.md`). 10건 요청은 그날 할당을 **거의 채울 수 있다.**
- 할당 메시지 → **즉시 중단**. 잔여는 ASK ②. 같은 URL 당일 재클릭 금지(공식·GSC UI 문구).

### 1.5 hreflang `ar` 검증

배포 후 기대(라우팅 레인이 `PUBLIC_LOCALES`에 `ar`을 넣은 뒤):

- 태그 값: **`ar`** (ISO 639-1). 국가 코드 `ar-AE`/`ar-SA` 등은 **국가별 URL이 없으므로 쓰지 않음** (A: [Localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions), 조회 2026-09-16 — 언어 또는 언어-지역).
- 자기 자신 + 다른 공개 로케일 + `x-default` 상호 링크. 누락 시 어노테이션이 무시될 수 있음 (A: 동일 문서 “Missing return links”).
- `x-default`: 현행과 같이 대부분 `/en/…`, `faq`만 `/ko/faq`.
- 언어 감지는 hreflang이 아니라 본문 알고리즘 (A: “Google doesn't use hreflang or the HTML lang attribute to detect the language”).

방법:

```bash
# 수동 (스크립트에 ar이 아직 없을 때 — 현재 verify-multilingual-live.mjs는 PUBLIC_LOCALES_8에 ar 없음)
for p in '' /services /about /lawyers /pricing /contact /faq /privacy /disclaimer /columns; do
  echo "=== /ar$p"
  curl -sS -D - -o /tmp/ar.html "https://tseng-law.com/ar$p" | awk 'NR==1 || /[Cc]anonical|[Ll]ocation|[Hh]ttp/'
  grep -o '<link rel="alternate"[^>]*>' /tmp/ar.html
  grep -o '<link rel="canonical"[^>]*>' /tmp/ar.html
done

# 라우팅 레인이 스크립트에 ar을 넣은 뒤 (RUNBOOK §3과 동일, 배포 후만)
node scripts/live-seo-scan.mjs --base=https://tseng-law.com
npm run verify:multilingual-live -- --base https://tseng-law.com
```

로컬 게이트는 SEA S4-a (`evidence/s4-local-hreflang.txt`): 40 URL BAD 0, 200, canonical self, hreflang 클러스터, x-default. `ar` 10 URL에 같은 표를 남긴다. **이 초안 작성 시점은 실행 0.**

GSC URL 검사 화면의 alternate/중복 칸이 있으면 베끼고, 없으면 「필드 없음」으로 둔다 (8/18 칼럼 검사 관례).

---

## 2. GSC 28일 베이스라인 보고서 (실측 열 = 빈칸)

형식은 `docs/seo/FROM-GROK-BOT-SEA-2026-09.md` + `EN-SEA-MEASUREMENT-2026-09.md` §1~2. 분모가 채워지기 전에 목표 수치를 쓰지 않는다.

### 2.1 조회 조건 (고정)

| 항목 | 값 |
|---|---|
| 속성 | `sc-domain:tseng-law.com` (UI: tseng-law.com) |
| 기간 | **28일** 롤링 (SEA·EN 측정과 동일) |
| 검색 유형 | 웹 |
| 설정 변경 | 없음. Search generative AI = Include 유지 확인만 (`EN-USER-ACTIONS`) |
| 국가 필터 | 아래 7. WO 표기 ISO2. UI는 국가명. API/일부 UI URL은 ISO 3166-1 alpha-3 (A: [Search Analytics query](https://developers.google.com/webmaster-tools/v1/searchanalytics/query) “3-letter country code”, 조회 2026-09-16) |

| ISO2 (WO) | ISO3 (GSC API) | UI에서 고를 이름 (영) |
|---|---|---|
| ae | are | United Arab Emirates |
| sa | sau | Saudi Arabia |
| qa | qat | Qatar |
| kw | kwt | Kuwait |
| bh | bhr | Bahrain |
| om | omn | Oman |
| eg | egy | Egypt |

SEA 선례 URL 코드: `vnm/idn/tha/phl/mys/sgp` (alpha-3). 손빗은 **UI 국가명으로 필터**하고, 주소창 코드가 보이면 캡처에 병기.

페이지 언어는 국가 필터와 별개다. GSC「언어」차원이 국가처럼 1칩이 아닐 수 있음 → **페이지 접두 `/ar/` `/en/` `/ko/` `/zh-hant/` `/ja/`** 로 언어별 페이지를 나눈다. 쿼리 언어는 쿼리 탭의 문자열로만 관찰(아랍어 스크립트 여부). 없으면 「미추출」.

### 2.2 국가별 합계 (사이트 전체, 국가 칩만)

배포일+28일 또는 그 이전 첫 추출일. **실측 열 공란.**

| 국가 | 클릭 | 노출 | CTR | 평균순위 | 조회시각(KST) |
|---|---|---|---|---|---|
| AE |  |  |  |  |  |
| SA |  |  |  |  |  |
| QA |  |  |  |  |  |
| KW |  |  |  |  |  |
| BH |  |  |  |  |  |
| OM |  |  |  |  |  |
| EG |  |  |  |  |  |
| **7국 합** |  |  | — | — |  |

### 2.3 국가별 쿼리 상위 20

국가 칩 1개 + 쿼리 탭. 행이 20 미만이면 있는 만큼. 없으면 「0행」.

| 국가 | # | 쿼리 | 클릭 | 노출 | CTR | 평균순위 |
|---|---|---|---|---|---|---|
| AE | 1 |  |  |  |  |  |
| AE | … |  |  |  |  |  |
| *(SA~EG 동일 표, 초안에서는 헤더만)* |  |  |  |  |  |  |

실측 시 국가당 표를 복제한다. 이 초안에 가짜 쿼리를 넣지 않는다.

### 2.4 언어별 페이지 (같은 28일 · 국가 칩 ON)

페이지 탭. 접두 필터를 바꿔가며 상위 행(최대 20) 기록.

| 국가 | 페이지 접두 | 상위 페이지 URL | 클릭 | 노출 | 평균순위 |
|---|---|---|---|---|---|
| AE | `/ar/` |  |  |  |  |
| AE | `/en/` |  |  |  |  |
| AE | `/ko/` |  |  |  |  |
| AE | `/zh-hant/` |  |  |  |  |
| AE | `/ja/` |  |  |  |  |

7국 × 접두. 첫 베이스라인에서 `/ar/` 0행이면 그것이 분모(SEA 6국 페이지 탭에 `/vi` 0행과 같음).

### 2.5 코어 10 URL 색인 카드 (국가 필터와 독립)

| URL | 색인? | 사유 문구 | 사용자 표준 | Google 표준 | 사이트맵 필드 | 검사시각 |
|---|---|---|---|---|---|---|
| `https://tseng-law.com/ar` |  |  |  |  |  |  |
| `…/ar/services` |  |  |  |  |  |  |
| `…/ar/about` |  |  |  |  |  |  |
| `…/ar/lawyers` |  |  |  |  |  |  |
| `…/ar/pricing` |  |  |  |  |  |  |
| `…/ar/contact` |  |  |  |  |  |  |
| `…/ar/faq` |  |  |  |  |  |  |
| `…/ar/privacy` |  |  |  |  |  |  |
| `…/ar/disclaimer` |  |  |  |  |  |  |
| `…/ar/columns` |  |  |  |  |  |  |

저장 위치(배포 후, 총괄이 파일명 확정): `docs/seo/FROM-GROK-BOT-MENA-YYYY-MM-DD.md`. 주간은 `docs/seo/metrics-log.md`에 MENA 행을 EN/SEA와 병행 (`EN-SEA-MEASUREMENT` §1 형식).

### 2.6 생성형 AI (참고 슬롯, 국가 분해 가능 여부 미확인)

| 항목 | 28일 값 |
|---|---|
| GSC 생성형 AI 노출 |  |
| 생성형 AI 클릭 |  |
| 7국 필터와 동시 적용 가능? | 미확인(실측 시 기록) |

GA4 ‘AI Assistants’는 정본으로 쓰지 않음 (`EN-SEA-MEASUREMENT` §4).

### 2.7 12주 판정 자리 (숫자는 베이스라인 후에만)

SEA GOAL §C와 같이 **색인 0인 상태에서 목표치를 만들지 않는다.** 자리만:

| 지표 | 베이스라인(날짜) | 12주 목표 | 반증 |
|---|---|---|---|
| GSC 7국 노출·클릭 /28일 | (빈칸) | 베이스라인 후 W2에 확정 | 색인 정상인데 노출 0 지속 → 인텐트 불일치 재심 |
| `/ar/` 코어 10 색인 | (빈칸) |  | 10 중 절반 미만이면 기술 S4 재실측 우선, 본문 증설 중단 |
| 생성형 AI 노출 | (빈칸) |  | 색인↑·생성형 0 → 직답 구조 재점검 |

---

## 3. Bing Webmaster Tools

### 3.1 중동 Bing / Copilot 비중 (B · 없으면 미확인)

**검색엔진 점유 — StatCounter Global Stats, 기간 표시: August 2026, HTML 조회 2026-09-16.** 패널 기반 업계 측정(B). 국가 공식통계 아님. Copilot은 이 차트에 **검색엔진으로 분리되어 있지 않음.**

| 국가 | 페이지 | Google | bing | 비고 |
|---|---|---|---|---|
| AE | [UAE](https://gs.statcounter.com/search-engine-market-share/all/united-arab-emirates) | 95.8% | 2.37% | |
| SA | [Saudi Arabia](https://gs.statcounter.com/search-engine-market-share/all/saudi-arabia) | 95.76% | 2.82% | |
| QA | [Qatar](https://gs.statcounter.com/search-engine-market-share/all/qatar) | 95.63% | 3.28% | |
| KW | [Kuwait](https://gs.statcounter.com/search-engine-market-share/all/kuwait) | 95.22% | 3.64% | |
| BH | [Bahrain](https://gs.statcounter.com/search-engine-market-share/all/bahrain) | 97.33% | 2.05% | |
| OM | [Oman](https://gs.statcounter.com/search-engine-market-share/all/oman) | 95.07% | 4.07% | 7국 중 Bing 표시값 최대 |
| EG | [Egypt](https://gs.statcounter.com/search-engine-market-share/all/egypt) | 95.37% | 3.29% | |
| 중동 합계 | [Middle East](https://gs.statcounter.com/search-engine-market-share/all/middle-east) | **미추출** | **미추출** | 이번 조회 HTML에서 August 2026 Bing 수치를 읽지 못함 |

- **Copilot 사용 비중:** 미확인. StatCounter 검색엔진 페이지에 Copilot 행 없음. Bing 검색점유를 Copilot/ChatGPT 인용 기회로 환산하지 않음. SEA 진단도 ChatGPT ≠ Bing 단일 게이트 (`SEO-DIAGNOSIS` P7 정정).
- 해석(과약속 금지): 7국 모두 Google이 차트 상단. Bing은 보조. **IndexNow 10 URL·기존 WMT 사이트맵 확인은 비용이 낮아 유지.** Bing 전용 콘텐츠/광고 예산은 이 표만으로 열지 않음.
- EN 레인에서 「SEA-Bing 가설」은 이미 기각 (`SEO-EN-SEA-GOAL` 사이클 4). MENA에서 뒤집어 쓰지 않음.

### 3.2 사이트 등록 · 사이트맵 · IndexNow (이미 있는 것부터)

사내실측 2026-08-18 (`FROM-GROK-BOT-BING-2026-08-18.md`):

- 속성 **tseng-law.com/** 만. GSC 가져오기로 등록. `BingSiteAuth.xml` 404는 불필요.
- 사이트맵 `https://tseng-law.com/sitemap.xml` 제출 2026-07-21, 당시 Success.
- Indexed 130 (그 날짜 기준선). 이후 변동은 **미확인**(이번 문서 실행 0).

배포 후 손빗 절차 (ASK ①):

1. [Bing Webmaster Tools](https://www.bing.com/webmasters) 로그인. **새 사이트 추가 금지**(이미 있음). www와 apex를 새로 쪼개지 않음.
2. Sitemaps: `https://tseng-law.com/sitemap.xml` 처리 상태·발견된 URL 수 기록. 실패/미처리면 재제출 1회. 정상이면 SEA GSC와 같이 억지 재제출 안 함.
3. IndexNow: 키 파일은 이미 라이브. §1.3 10 URL POST가 Bing 참여 엔드포인트로도 전달됨 (`api.indexnow.org` + FAQ의 `https://www.bing.com/indexnow`). WMT에서 별도 「IndexNow 켜기」UI 문구는 이번 조회에서 **미추출**(about 페이지가 JS 앱).
4. (선택) AI Performance Citation Share — `EN-SEA-MEASUREMENT` §2가 「유일한 벤더 1차 인용 지표」로 지정. MENA 전용 수치가 있으면 기록, 없으면 「미추출」.
5. 사이트맵 전량 IndexNow 재핑 금지 (8/18 핸드오프).

Bing about/도움말 일부 URL은 2026-09-16에 404 또는 JS 셸이라, **클릭 순서 스크린샷 수준의 UI 복원은 미확인.** 손빗은 기존 속성 화면을 기준으로 한다.

---

## 4. 걸프권 Google 로컬 신호 — GBP 국가 페이지 금지

### 4.1 사실 (레포)

사무소는 **대만 4곳**뿐이다. `src/data/office-locations.ts` `taiwanOfficeSeoRecords`: 台北·台中·高雄·屏東. JSON-LD `addressCountry` = `TW` (`src/lib/__tests__/local-business-signals.test.ts`). 타이베이 전화 없음(추측 금지, 테스트가 고정).

걸프·이집트 주소·가상 오피스·coworking「지점」**없음.**

### 4.2 GBP (A)

[Guidelines for representing your business on Google](https://support.google.com/business/answer/3038177?hl=en) (조회 2026-09-16):

- 프로필은 고객이 방문하는 실제 위치, 또는 고객에게 찾아가는 서비스 지역 사업용.
- **위치당 페이지 1개.** “Do not create more than one page for each location…”
- 가상 오피스(“rents a physical mailing address but doesn't operate out of that location”)는 **자격 없음.**
- 서비스 지역 사업은 **실제 운영하는 중앙 사무소 1개** + 서비스 지역. 무인 가상 오피스 불가.

**금지:** AE·SA·QA·KW·BH·OM·EG용 GBP 생성, 두바이/리야드 등 허위 핀, 대만 사무소를 걸프 서비스 지역으로 부풀리기. EN 레인의 GBP 영어화(`EN-USER-ACTIONS` §B)는 **대만 프로필**에 한정. MENA가 그걸 재실행하라는 뜻이 아님.

areaServed를 걸프 국가로 넓히는 레버는 EN/SEA 전문가 판정에서 기각된 바 있음. 이 초안도 **JSON-LD areaServed 걸프 추가를 처방하지 않음.**

### 4.3 대신 쓸 신호

| 신호 | 원칙 |
|---|---|
| URL | `https://tseng-law.com/ar/…` 언어 코드만. `ar-ae` 서브폴더·ccTLD 없음 |
| hreflang | `ar` 언어 태그 + 상호성 + x-default=en(예외 faq=ko) |
| 본문 국가 가정 | 「UAE/사우디/…에 있는 독자」를 **청중**으로 명시. 대만 회사설립·소송·거류 등 **대만법** 범위. 「두바이 사무소」「현지 변호사」암시 금지 |
| NAP | 대만 4주소·게시된 전화만. 걸프 전화번호 창작 금지 |
| 상담 언어 | English / Chinese / Japanese / Korean. 아랍어 안내 페이지에서도 동일 |
| 로컬팩 | 걸프 로컬팩 진입을 목표로 두지 않음. 목표는 웹 검색·AI 인용에서 대만법 안내가 `ar`/`en`으로 보이는 것 |

---

## 5. 손빗 ASK 초안 2개 (실행 = 사용자 게이트)

이 워커는 ASK 파일을 브리지에 넣지 않는다. 총괄이 배포 그린 뒤에만 발송. 형식은 `docs/seo/sea-geo-plan/RUNBOOK.md` §5.

### 5.1 ASK ① — GSC/Bing 등록 확인 · 사이트맵 · IndexNow · 1차 색인 요청

배포가 **라이브에서 확인된 뒤** 발송. 배포 승인과 묶지 말 것(배포는 M6).

```
status: waiting
question: ar 안내 로케일이 라이브인 전제로, 손빗이 (1) GSC 기존 속성에서 sitemap.xml 상태 확인·필요 시만 재제출 (2) IndexNow에 ar 코어 10 URL만 제출 (3) GSC URL 검사 10건 후 미색인만 할당량 내 Request indexing (4) Bing WMT 기존 속성 사이트맵 확인 을 실행해도 되는가?
context: 새 GSC/Bing 속성 추가 없음. IndexNow 전량 소급 금지. 걸프 GBP 생성 금지. 설정(생성형 AI Include 등) 변경 없음. ar은 안내 언어, 상담은 English/Chinese/Japanese/Korean만.
options: 승인(위 4항 전부) / 일부만(번호로) / 보류
```

손빗 기록 템플릿: `docs/seo/FROM-GROK-BOT-MENA-INDEX-1.md` (총괄이 경로 확정). IndexNow HTTP 코드, 사이트맵 상태, 10 URL 검사표, 요청/거부/오류/미시도 건수.

### 5.2 ASK ② — 2주 후 색인 재확인 (SEA S4-d)

S4-d 날짜 규칙: SEA는 S4-c 2026-09-09 → S4-d 2026-09-23. MENA는 **ASK ① 실행일 + 14일.**

```
status: waiting
question: ar 코어 10 URL의 GSC 색인 상태를 재확인하고, 1차에서 거부·오류·할당량 미시도·아직 미등록인 URL에 대해 재요청 여부를 손빗이 실행해도 되는가?
context: SEA S4-c에서 홈 3건 거부·사유 미확인. 같은 URL 당일 반복 금지. 거부 사유는 URL 검사 문구를 그대로 적는다. Bing 전량 재핑 없음.
options: 승인(검사만) / 승인(검사 + 미색인 재요청 1회) / 보류
```

---

## 6. 위험

### 6.1 자동 로케일 리다이렉트 미도입 (루트는 `/ko`)

현행 (실행하지 말고 유지):

- `next.config.mjs` `source: '/'` → `destination: '/ko'` **permanent: true**
- middleware는 안내 로케일 rewrite + 빌더 리다이렉트 룩업. **Accept-Language / IP 국가로 `/ar` 강제 없음**

공식 (A, [Managing multi-regional and multilingual sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites), 조회 2026-09-16):

> Avoid automatically redirecting users from one language version of a site to a different language version of a site. … These redirections could prevent users (and search engines) from viewing all the versions of your site.

Googlebot은 미국발·`Accept-Language` 없음(동일 문서). 중동 IP → `/ar` 자동 점프를 넣으면 봇이 `ar`만 보거나 상호 hreflang이 깨질 수 있다. **MENA 때문에 루트 리다이렉트를 `/ar`로 바꾸지 않음. 언어 전환은 링크.**

### 6.2 봇 UA 처리 현행 유지

| 위치 | 현행 | MENA에서 |
|---|---|---|
| `src/app/robots.ts` | 프로덕션 `userAgent: '*'`, `allow: '/'`, admin/api disallow. 프리뷰는 전부 disallow | 유지. `ar`만 막거나 봇별 분기 추가 금지 |
| `src/app/api/metrics/collect/route.ts` `BOT_UA` | 봇 UA면 방문 이벤트 204 스킵 | 유지. **페이지 HTML을 봇에 다르게 주지 않음** (클로킹 아님) |
| Cloudflare AI 크롤러 기본 차단 (2026-09-15 언급, `EN-SEA-MEASUREMENT` §5) | 자사 Vercel 직접 영향 낮음[그 문서의 추정] | Googlebot/Bingbot과 별개. 인용원 스팟체크는 그 문서 규칙. 이 레인에서 봇 UA 예외를 새로 만들지 않음 |

구글 공식 크롤 예산 가이드: 페이지가 많지 않으면 가이드 대상이 아님 ([Crawl budget](https://developers.google.com/search/docs/crawling-indexing/large-site-managing-crawl-budget), 조회 2026-09-16). 코어 +10은 소형. 크롤 예산 튜닝 금지 (`SEO-DIAGNOSIS` 기각 4).

### 6.3 중복 콘텐츠 — `ar` 안내가 en 요약 번역인 경우 hreflang으로 충분한가

| 주장 | 등급 | 근거 |
|---|---|---|
| hreflang은 「같은 내용의 언어·지역 변형」이라고 **알려 주는** 신호다 | **A** | Localized versions: “Use hreflang to tell Google … localized variations of the same content.” 조회 2026-09-16 |
| 본문이 **번역되지 않고** 언어 껍데기만 바뀌면 구글은 그 변형을 **중복으로 본다** | **A** | “Localized versions of a page are only considered duplicates if the main content of the page remains untranslated.” |
| 본문이 실제로 번역되면 그 정의상 중복이 **아니다** | **A** | 위 문장의 대우. 「충분」은 색인 보장이 아님 |
| hreflang만으로 색인·노출이 된다 | **반증됨(사내실측)** | SEA 4로케일은 hreflang 상호성 로컬 BAD 0인데, 배포 직후 GSC 검사분은 전부 미등록 (`FROM-GROK-BOT-SEA` §3, `s4-local-hreflang.txt`) |
| 요약만 번역하고 본문 대부분이 en이면 중복으로 묶일 수 있다 | **A에 가까움 / 이 사이트 ar 본문은 아직 미배포라 판정 불가** | 공식 기준은 「main content remains untranslated」. ar 초안이 요약이면 위험. 라우팅·콘텐츠 레인 검수 항목 |
| 동일 URL 반복 색인 요청·전량 IndexNow로 중복을 풀 수 있다 | **기각** | 공식 할당·IndexNow 200≠색인·8/18 진단 |

실무: hreflang `ar` 클러스터는 **필요 조건**. 충분 조건이 아님. 안내는 아랍어 **본문**이어야 하고, 상담 언어 고지는 번역과 별개로 EN/ZH/JA/KO만. 얇은 요약이면 품질·중복 리스크를 콘텐츠 레인이 마커로 남긴다. 이 색인 계획이 본문 길이를 숫자로 처방하지 않음.

---

## 7. 출처 (조회 2026-09-16 KST, 별도 표기 없는 한)

**공식 A**

- https://support.google.com/webmasters/answer/9012289?hl=en — URL 검사·일일 한도
- https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl — 색인 요청 소량·보장 없음·사이트맵
- https://developers.google.com/search/docs/specialty/international/localized-versions — hreflang·x-default·상호 링크·미번역=중복
- https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites — 자동 언어 리다이렉트 금지, Googlebot Accept-Language 없음
- https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls — canonical
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap — 사이트맵 제출
- https://developers.google.com/webmaster-tools/v1/searchanalytics/query — 국가 필터 ISO 3166-1 alpha-3
- https://support.google.com/webmasters/answer/7576553?hl=en — 실적 보고서
- https://developers.google.com/crawling/docs/crawl-budget — 소형 사이트는 크롤 예산 가이드 대상 아님 (구 Search Central URL에서 리다이렉트, 조회 2026-09-16)
- https://support.google.com/business/answer/3038177?hl=en — GBP 위치당 1페이지, 가상 오피스 불가
- https://www.indexnow.org/documentation — 200=수신, urlList ≤10,000
- https://www.indexnow.org/faq — 색인 미보장, 참여 엔진
- https://www.bing.com/indexnow — Bing IndexNow 진입

**B**

- StatCounter 7국 + 중동 합계 검색엔진 점유 페이지 — §3.1 URL. 데이터 라벨 August 2026

**사내실측 (실행 0인 이 초안의 선례)**

- `docs/seo/sea-geo-plan/evidence/s4-indexing.md`
- `docs/seo/sea-geo-plan/evidence/s4-local-hreflang.txt`
- `docs/seo/sea-geo-plan/GOAL.md` S4, `RUNBOOK.md` §3, `PROMPT.md` §5
- `docs/seo/EN-SEA-MEASUREMENT-2026-09.md`
- `docs/seo/FROM-GROK-BOT-SEA-2026-09.md`
- `docs/seo/FROM-GROK-BOT-GSC-2026-08-18.md`
- `docs/seo/FROM-GROK-BOT-BING-2026-08-18.md`
- `docs/seo/SEO-DIAGNOSIS-2026-08-18.md` (IndexNow 전량 기각)
- 코드: `src/lib/public-guidance.ts`, `src/app/sitemap.ts`, `scripts/indexnow-submit.mjs`, `next.config.mjs` `/`→`/ko`, `src/data/office-locations.ts`

**확인 못 한 것** — 워커 보고서 `M2c-REPORT.md`와 동일. 요지: GSC/Bing 일일 할당 정확한 건수, Copilot 국가별 비중, 중동 합계 StatCounter Bing %, Bing WMT IndexNow UI 문구, GSC 생성형 AI × 국가 동시 필터, 라이브 `ar` 200 여부(미배포).
