# 그룩봇 실행 WO — 나라별 검색 노출 + 유입 설정

작성: 2026-09-19 20:3x KST · Cursor Grok 4.6
대상: **그룩봇(손빗 Computer Use)** — 사용자에게 재질문 금지
정본 URL 목록: `docs/marketing/INDEXNOW-BATCH-20260919.txt` (83 URL, 2026-09-19 HEAD 전부 200)
회신: `~/.local/share/son-bridge/in/IN-cursor-<시각>.md` + `docs/seo/FROM-GROK-BOT-COUNTRY-EXPOSURE-20260919.md`

사용자 원문: 「각나라별로 다 됐는데 그룩봇 이용해서 각 나라별 노출 시키는거 나라별 사람 유입 시키는것도 설정해」

## 한 줄 진실

GSC에는 **국가 타깃 토글이 없다**(International Targeting UI 2022-09-22 제거). 나라별 노출 = 라이브 로케일 URL + hreflang + 색인 요청(200만) + GSC 국가 필터로 **측정**. 나라별 유입 = 그 페이지가 해당국 검색/지도/소셜에서 발견되고, 문의가 상담 4언어로 들어오게 프로필을 맞추는 것. 광고·아웃리치·협회 가입은 이 WO에 없다.

## 실측 (이 세션, 2026-09-19)

| 집합 | HTTP | 비고 |
|---|---|---|
| 사이트 4 `ko/zh-hant/en/ja` × home·services·contact·taiwan-company-setup-lawyer·guides/taiwan-company-setup | 200 | 5경로 |
| 안내 21 `vi id th fil ar de es fr pt zh-hans ms ru tr it nl pl hi sv da nb fi` × home·services·contact | 200 | 3경로 |
| `/{vi,id,…}/debt-collection` · `/company-setup` · G2-5 `cs/hu/ro/el/he/uk` | **404** | IndexNow·Request Indexing **금지** |
| 상담 언어 | EN / 中文 / JA / KO 만 | 안내 페이지가 그 언어 상담을 약속하면 안 됨. `zh-hans`만 중문 상담과 겹침 |

프로덕션은 이미 25언어 서빙 중(G3-1 배포). 워크트리 미머지 가정으로 404를 제출하지 말 것.

## 금지선 (막히면 건너뛰고 나머지 계속)

- 사이트 코드·git push·Vercel·배포 조작 금지
- 유료 광고 집행·예산 설정 금지
- 아웃리치 메일·협회 가입 신청 발송 금지 (초안만 읽기)
- 리뷰 인센티브·승소율·결과보장·24시간·무료상담 광고 문구 금지
- 안내 로케일을 GBP/YouTube/LinkedIn **상담 가능 언어**에 추가 금지 (베트남어 상담 등)
- HTTP 404 URL IndexNow / Request Indexing 금지
- 사용자에게 「배포할까요」「광고할까요」 재질문 금지

---

## S1. 측정 분모 — GSC / Bing (먼저, 숫자 약속 전에)

기간: **지난 28일**. 캡처 또는 표로 수치를 파일에 남긴다. 0도 0으로 기록. 추정 금지.

### S1a. GSC Performance — 페이지 × 국가

각 행: 노출 / 클릭 / CTR / 평균게재순위. 데이터가 없으면 `미측정(표본 없음)`.

**페이지 필터 (로케일 홈):**
`/ko` `/zh-hant` `/en` `/ja` `/vi` `/id` `/th` `/fil` `/ar` `/de` `/es` `/fr` `/pt` `/zh-hans` `/ms` `/ru` `/tr` `/it` `/nl` `/pl` `/hi` `/sv` `/da` `/nb` `/fi`

**국가 칩 (한 번에 전부 돌리지 말고, 로케일↔국가 쌍으로):**

| 로케일 | GSC 국가 |
|---|---|
| ko | KR |
| zh-hant | TW, HK, MO |
| en | US, SG, MY, PH, AU, GB, IN |
| ja | JP |
| vi | VN |
| id | ID |
| th | TH |
| fil | PH |
| ar | AE, SA |
| de | DE |
| es | ES |
| fr | FR |
| pt | BR, PT |
| zh-hans | SG, MY, CN |
| ms | MY, SG |
| ru | RU |
| tr | TR |
| it | IT |
| nl | NL |
| pl | PL |
| hi | IN |
| sv | SE |
| da | DK |
| nb | NO |
| fi | FI |

우선 추출(시간 부족 시 이 12쌍만이라도): `ja×JP`, `ko×KR`, `zh-hant×TW`, `en×SG`, `en×US`, `vi×VN`, `id×ID`, `th×TH`, `fil×PH`, `zh-hans×SG`, `fr×FR`, `de×DE`.

각 쌍의 **상위 쿼리 5**.

### S1b. GSC URL 검사 (색인 상태만 기록, 아직 Request Indexing 하지 말 것)

검사 대상 12 (신규 안내 홈 우선):
`/fr` `/pt` `/zh-hans` `/ms` `/ru` `/tr` `/it` `/nl` `/pl` `/hi` `/sv` `/fi`

각 URL: 색인됨 / 미색인 / 타표준 / 발견됨-미색인 / 오류. 인용 문장 그대로.

### S1c. GSC 사이트맵

`https://tseng-law.com/sitemap.xml` 제출(이미 있으면 lastmod 확인). 발견 URL 수·색인 URL 수는 **화면에 보이는 숫자만**. 예전 9/9 숫자 재사용 금지.

### S1d. Bing Webmaster Tools

- 사이트맵 상태
- Search Performance 국가 분해가 있으면 JP·KR·TW·VN·ID·TH·PH·US·SG 기록
- AI Performance / Citation Share 있으면 값, 없으면 `화면 없음`

### S1e. 네이버 서치어드바이저

`/ko` 수집·노출만. 안내 로케일을 네이버에 억지로 넣지 말 것.

---

## S2. IndexNow (Bing/Naver — Google 비참여)

**이미 실행됨 (2026-09-19 20:4x Cursor):** 83 URL POST `https://api.indexnow.org/indexnow` → **HTTP 200**. 재제출하지 말 것. 키 파일 200 확인만 하고 S1/S3로.

원 절차(재실행 금지, 기록용):

1. 목록 83개 **각 URL을 GET으로 한 번 더 확인**. 200이 아니면 그 URL만 빼고 제출.
2. 워크트리에서:

```bash
cd /Users/son7/Projects/tseng-law-global-picker-20260918
URLS=$(tr '\n' ',' < docs/marketing/INDEXNOW-BATCH-20260919.txt | sed 's/,$//')
node scripts/indexnow-submit.mjs --urls "$URLS"
```

3. HTTP 응답 코드 기록. **200 = 접수 영수증이지 색인 완료가 아님.**
4. 키 파일 `https://tseng-law.com/<indexnow-key>.txt` 200 확인(키 값은 채팅에 붙여넣지 말 것).
5. 404를 목록에 끼워 재제출하지 말 것.

---

## S3. Google Business Profile — 유입(지도·로컬) 설정

목적: 대만 현지·방문자·expat가 지도에서 영어/일어/한국어/중국어로 찾게 하기. **안내 21언어를 구사 언어로 넣지 말 것.**

1. 비즈니스 설명: 기존 KO/ZH 유지. 영어·일본어 문단이 없으면 카피 킷 `docs/marketing/EN-JA-COPY-KIT-2026-09.md` §1a·§1b를 **뒤에 추가**. 750자 초과 시 영어 우선.
2. Languages spoken / 구사 언어: **English, Japanese, Korean, Mandarin(中文)** 만. Vietnamese/French/Hindi 등 추가 금지.
3. 웹사이트: 기본 `https://tseng-law.com/en` (이미 `/ja` 등 추가 링크가 있으면 유지, 안내 로케일 21개를 웹사이트 슬롯에 도배하지 말 것).
4. Services: 카피 킷 §1c 사전정의 항목이 있으면 선택. 새 법률 서비스명 창작 금지.
5. 금지: 리뷰 인센티브, 상호에 언어 병기, 카테고리 삭제, 승소·24시간 문구.

---

## S4. YouTube @weilawyer · 소셜 — 소유 채널 유입

1. 채널 링크: `https://tseng-law.com/en` 과 `https://tseng-law.com/ja` 와 `https://tseng-law.com/ko` (없으면 추가).
2. 채널 설명에 상담 언어 4개만. 안내 언어 21개를 「상담 가능」으로 나열 금지.
3. 최근 영상 제목/설명 **자동번역을 새로 돌리지 말 것**(2026-09-06 S3 재실행 금지 유지). 링크만 확인.
4. LinkedIn: 웹사이트 `https://tseng-law.com/en`. 헤드라인이 카피 킷 §6과 다르면 **기록만** (바꾸기 전 화면 저장). 회사 페이지 없으면 **개설하지 말고 없음으로 기록**.
5. X 일본어 계정: 존재 여부만.

---

## S5. 카피·hreflang 스팟체크 (유입이 잘못된 언어 약속으로 새지 않게)

브라우저에서 아래 5개 홈을 연다. 각각:
- html `lang` 또는 페이지 언어가 해당 로케일인지
- **상담은 EN/ZH/JA/KO** 라는 문구가 보이는지
- hreflang 클러스터에 자기자신 + `x-default`(=en) 있는지 (소스 또는 헤드)

대상: `/fr` `/vi` `/hi` `/zh-hans` `/ja`

불일치(안내 언어로 상담 약속)면 **설정 변경하지 말고** 파일에 BLOCK으로 적고 S1–S4는 계속.

추가: `/cs` `/el` 은 404여야 한다. 200이면 기록만 (G2-5 미배포 전제).

---

## S6. GSC Request Indexing (쿼터 아껴서, S1b 이후)

S1b에서 **미색인**인 URL만, 최대 **12개**. 이미 색인됨이면 요청하지 말 것(반복 무효).
우선순위: `/fr` `/zh-hans` `/hi` `/sv` `/it` `/ms` `/ru` `/pt` `/nl` `/pl` `/tr` `/fi`.

---

## 완료 보고 형식 (파일에 이 표)

| 항목 | 결과 | 증거(화면 한 줄/수치) | 막힘 사유 |
|---|---|---|---|
| S1a 국가×페이지 12쌍 | | | |
| S1b URL 검사 12 | | | |
| S1c 사이트맵 | | | |
| S1d Bing | | | |
| S1e 네이버 | | | |
| S2 IndexNow | HTTP ? / URL n | | |
| S3 GBP | | | |
| S4 YouTube/소셜 | | | |
| S5 스팟체크 5 | | | |
| S6 Request Indexing | 요청 n / 스킵 n | | |

색인·1페이지·클릭·문의 건수는 **보장하지 않는다**. 분모만 남긴다.
