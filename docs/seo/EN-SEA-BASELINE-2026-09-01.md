# EN/SEA 노출 베이스라인 — 2026-09-01

작성: Fable 5 (라이브 실측 + 콘솔 기록 인용). 목적: 영어권·동남아(영어 검색) 노출 확대 goal(SEO-EN-SEA-GOAL.md)의 분모 고정.
표기: [실측]=오늘 직접 확인, [콘솔]=8/13~8/19 콘솔 기록 인용, [미측정]=근거 없음(처방 금지).

## 1. EN 자산 인벤토리 [실측 2026-09-01]

| 자산 | 상태 |
|---|---|
| EN 홈 `/en` | 200. title "Taiwan Lawyer, Litigation & Company Setup \| Hovering International Law Firm", H1 "Taiwan Law, Clearly Explained.", 렌더 텍스트 ~1,674 단어 |
| EN 칼럼 | 17편(`src/content/columns-en/`), 라이브 인덱스 초기 HTML에 17/17 `<a href>` 노출 |
| EN 랜딩 4종 | `/en/taiwan-lawyer`, `/en/taiwan-company-setup-lawyer`, `/en/taiwan-litigation-lawyer` 정상. **`/en/korean-lawyer-in-taiwan` 타이틀 브랜드 2중 접미 버그**("… \| Hovering International Law Firm (Taipei) \| Hovering International Law Firm") |
| EN 가이드 | `/en/guides/taiwan-company-setup` — "Taiwan Company Setup: Process, Cost & Timeline (2026)" |
| JSON-LD (홈) | LegalService(areaServed:["Taiwan"]) · Person×2 · Organization×2 · WebSite/SearchAction · ContactPoint · PostalAddress · CollegeOrUniversity×3 — 전부 초기 HTML |
| hreflang | 사이트맵에 ko/zh-Hant/en/ja 상호참조 + **x-default=/ko** (전 URL) |
| robots/llms.txt | robots 정상(AI봇 허용), llms.txt 200(한국어 중심) |

## 2. 콘솔 분모 [콘솔 — 8/13~8/19 기록, EN 세그먼트는 미분해]

- 구글: 색인 16/175 (GSC 8/13). 노출 732/클릭 24/CTR 3.3%/평균 12위(28일, 전체 — 로케일 미분해). 생성형 AI 노출 71/28일.
- Bing WMT: Indexed 130 · 노출 174 · 클릭 7 (28일, 전체).
- **[미측정] EN 전용 분모**: GSC 국가별(SG/MY/PH/US/등) 노출·클릭, `/en/` 페이지 필터 성과, EN 쿼리 목록, Bing 국가 분포 — **사용자/손빗 콘솔 라운드 필요**:
  1. GSC Performance → 페이지 필터 `/en/` → 쿼리·국가·노출·클릭 (28일)
  2. GSC Performance → 국가 필터 SG·MY·PH·US·AU·GB → 쿼리 상위
  3. GSC 색인 → `/en/` URL 상태 표본 5건(랜딩 4+가이드 1) — 색인/미색인/타표준
  4. Bing WMT Search Performance 국가 분해(가능하면)
- 이 4항목이 D7 주간 트래커의 EN 세그먼트 분모가 된다.

## 3. 판정 요지 (진단은 SEO-DIAGNOSIS-2026-08-18.md 승계)

- 기술·콘텐츠 기반은 이미 존재(EN 17칼럼+4랜딩+가이드, SSR, JSON-LD). **부족한 것은 ① EN 시장을 향한 서빙 기본값(x-default=/ko) ② EN 질의 커버리지의 폭(현 랜딩은 4 클러스터뿐) ③ 영어권 인용원·권위(백링크 0은 EN에서도 동일) ④ EN 성과의 측정 분해**.
- 색인 병목(16/175)은 로케일 불문 공통 — EN 페이지 증설만으로 노출이 늘지 않을 수 있음(권위 병목 우선 구조는 8/18 진단 유지). EN 트랙의 기대는 ① 경쟁 강도가 한국어 대비 낮은 특정 인텐트(대만 진출 실무 영문 정보) ② Bing(이미 색인 130)·Copilot·ChatGPT 계열 EN 인용 표면.
- 12주 반증 조건(초안, D7에서 확정): EN 랜딩·가이드가 색인되고 GSC EN 세그먼트 노출이 분모 대비 명확 증가하지 않으면 → 콘텐츠 증설 가설 기각, 권위(아웃리치) 단독 트랙으로 재배분.

## 4. 오늘 이후 변경 이력

- (기록 시작 — 이 goal의 커밋들이 여기 append)

## 5. 분모 고정 — 손빗 GSC 실측 (2026-09-02, sc-domain:tseng-law.com, 2026-08-03~08-30, Web)

| 세그먼트 | 클릭 | 노출 | CTR | 평균순위 | 비고 |
|---|---|---|---|---|---|
| 사이트 전체 | 16 | 761 | 2.1% | 11.2 | 국가 TW 10/363 · KR 5/269 · SG 1/16 · US 0/42 · CN 0/24 · HK 0/18 · JP 0/4 · GB 0/4 · MY 0/1 · PH 0/1 |
| `/en/` | 1 | 26 | 3.8% | 9.4 | guides/taiwan-company-setup 1/15 · about 0/5 · korean-lawyer-in-taiwan 0/5 · lawyers 0/1 |
| `/ja/` | **0** | **0** | — | — | 쿼리·국가 없음 |

색인(URL 검사): **EN 랜딩 3종 전부 미색인**(taiwan-lawyer·litigation Discovered-not-indexed, company-setup Crawled-not-indexed 마지막 크롤 2026-03-10) / korean-lawyer-in-taiwan·guides 색인됨. **JA 전부 미색인**: /ja·/ja/guides Discovered-not-indexed(홈: "참조 페이지 없음"), /ja/taiwan-lawyer·/ja/pricing **URL unknown to Google**. 생성형 AI = Include. Bing WMT 미로그인(핸드오프).
국가별 상위 쿼리: SG 台湾公司设立 0/8(58위)·台湾注册公司 0/7(66위) — 싱가포르 수요는 **간체 중국어**로 들어옴(EN 아님, 관찰 기록). US 대만 회사설립 0/2(3위).

**판정(2026-09-02)**: JA 트랙의 1차 게이트는 노출이 아니라 **발견·색인**. 원인 하나 확정·수정 — 언어 전환 링크가 /ja 전용 라우트에서 `/ja/columns`로 떨어져 JA 랜딩·pricing에 크롤 가능 유입 링크가 0(public-route-policy.ts, 커밋 db542668). 후속 = GSC 색인 요청 10 URL(손빗 S1b)·사이트맵 재제출·내부링크. 12주 반증의 분모는 위 표.
