# Grok Bot → Claude Code 실측 핸드오프 — 2026-08-18 14:57 KST

손빗(Grok Bot)이 **로그인된 Google Search Console**에서 직접 본 값만 적는다.
추정·다른 도구 대리는 없다. 못 본 항목은 **미추출**로 둔다.
Claude는 화면 권한/Chrome 확장 없이 이 파일을 읽고 P0 판정·코딩을 이어가면 된다.

파일 위치:
- Claude scratchpad: `/private/tmp/claude-501/-Users-son7/bcc85177-cf6e-4905-bf0b-cebcd6c04371/scratchpad/FROM-GROK-BOT-GSC-2026-08-18.md`
- 레포: `docs/seo/FROM-GROK-BOT-GSC-2026-08-18.md`

---

## 0. 범위 / 속성

- 로그인됨. UI 한국어. 속성 피커에 **`tseng-law.com`만** 있음.
- `wei-wei-lawyer.com` / `www.wei-wei-lawyer.com` 속성 **없음**.
- wei-wei URL을 tseng 속성에서 검사하면 대화상자: **"속성에 URL이 없음 — 현재 선택된 속성에서 URL을 검사하거나 속성을 전환하세요."**
- 설정 변경 없음. 색인 요청은 아래 §4 (진행 중일 수 있음).

---

## 1. 색인 > 페이지 (baseline §7-1) — 갱신 2026.8.13

| 항목 | 수치 |
|---|---|
| 색인 생성됨 | **16** |
| 색인이 생성되지 않은 페이지 | **159** |
| 발견됨-현재 색인 생성 안됨 | **138** |
| 크롤됨-현재 색인 생성 안됨 | **12** |
| 리디렉션이 포함된 페이지 | **7** |
| NOINDEX 태그 제외 | **2** |
| Google에서 다른 표준 URL이 지정된 중복 페이지 | **버킷 없음 (목록에 안 보임)** |
| 사용자가 선택한 표준이 없는 중복 페이지 | **버킷 없음 (목록에 안 보임)** |

구 베이스라인 14/118은 오늘 값으로 대체: **16 / (16+159)**. "89건 발견됨-크롤안됨"은 오늘 **138**.

---

## 2. URL 검사 — 한 것 / 안 한 것

### 2a. P0 군별 대조 7편 — **실시함, 아래 갱신**

`baseline-2026-08-18.md` §7-2가 요구한 칼럼은 아직 검사하지 않았다.
Grok Bot이 먼저 연 건 수익 랜딩 3 + wei-wei 3 (아래 2b). 칼럼 7편은 이 핸드오프 직후 이어서 검사할 예정.

동일군 3:
- `https://tseng-law.com/ko/columns/taiwan-company-establishment-advanced-1`
- `https://tseng-law.com/ko/columns/taiwan-massage-history-law`
- `https://tseng-law.com/ko/columns/taiwan-voluntary-resignation-severance`

상이군 3:
- `https://tseng-law.com/ko/columns/taiwan-company-establishment-basics`
- `https://tseng-law.com/ko/columns/taiwan-divorce-lawsuit-qna`
- `https://tseng-law.com/ko/columns/taiwan-logistics-business-setup`

부분 1:
- `https://tseng-law.com/ko/columns/taiwan-traffic-accident-procedure`

### 2b. 수익 랜딩 + wei-wei (실측, 2026-08-18)

| URL | 색인? | 사용자 표준 | Google 표준 | 메모 |
|---|---|---|---|---|
| `https://tseng-law.com/ko` | **색인 생성됨** ("URL이 Google에 등록되어 있음") | `https://tseng-law.com/ko` | 검사된 URL = 자기 자신 | 최근 크롤 2026.8.17 02:53:31, Googlebot 스마트폰, 크롤 허용, 가져오기 성공, 색인 허용. Sitemap `tseng-law.com/sitemap.xml`. HTTPS OK. 중복/정본 경고 없음. |
| `https://tseng-law.com/ko/taiwan-company-setup-lawyer` | **색인 안됨** — "크롤됨 - 현재 색인이 생성되지 않음" | 해당사항 없음 | 해당사항 없음 | 최근 크롤 2026.7.20 21:45:37. Sitemap: "일시적인 처리 오류". 참조 페이지 `/ko/services/ip`. 정본 충돌 문구 없음. |
| `https://tseng-law.com/ko/taiwan-litigation-lawyer` | **색인 안됨** — "Google에는 아직 알려지지 않은 URL입니다" | 해당사항 없음 | 해당사항 없음 | 미크롤. 참조 사이트맵/페이지 없음. |
| `https://www.wei-wei-lawyer.com/` | n/a | n/a | n/a | 속성 없음. 검사 차단. |
| `https://www.wei-wei-lawyer.com/general-clean` | n/a | n/a | n/a | 〃 |
| `https://www.wei-wei-lawyer.com/lawyertseng` | n/a | n/a | n/a | 〃 |

세 tseng 검사 모두에서 "다른 표준 URL 선택 / 중복 / alternate / redirect" 빨간 경고 **없음**.
wei-wei 쪽 Google 선택 표준은 **속성 미추가로 판정 불가**.

---

## 3. 개요 카드 (실적 요약, 검사 전 화면)

- 속성 `tseng-law.com` 개요.
- 카드 문구: 총 웹 검색결과 클릭수 **74**.
- 그래프 가로축 대략 26.5.16 ~ 26.8.14.
- **쿼리 상위 20 / 국가=한국 필터 / 생성형 AI 탭 / Search generative AI 설정 / 사이트맵 163 인식 여부는 미추출** (baseline §7-3~6).

---

## 4. 색인 요청 (사용자 지시, 진행)

사용자가 손빗에게 요청함. 대상은 P0 칼럼이 아니라 위 미색인 랜딩 2개:
- `https://tseng-law.com/ko/taiwan-company-setup-lawyer`
- `https://tseng-law.com/ko/taiwan-litigation-lawyer`

제출 확인 문구는 이 파일 작성 시점에 아직 없음. 끝나면 같은 scratchpad에 追記하거나 이 파일 갱신.

---

## 5. Grok Bot 쪽 SEO 판정 (코딩 가드 — GSC와 별개 실측)

손빗이 사이트/SERP를 보고 사용자에게 말한 방향. GSC 숫자는 아님.

- 수익 키워드(대만 법인설립·대만 소송) 유입은 지금 **wei-wei**가 가져감. tseng 랜딩은 SERP에 거의 안 보임. GSC가 그걸 설명함: 홈만 색인, 법인설립 랜딩은 7/20 이후 미색인, 소송 랜딩은 미발견.
- wei-wei `/general-clean` 슬러그 나쁨. tseng에는 이미 `/ko/taiwan-company-setup-lawyer`, `/ko/taiwan-litigation-lawyer`, `/ko/guides/taiwan-company-setup` 있음. 소송 가이드(`/ko/guides/taiwan-litigation`)는 없음.
- 같은 칼럼 슬러그 양 도메인 = 잠식. 진단서 재검(동일 6+부분 1)과 정합.
- 손빗 권고(사용자 미선택): 주제를 도메인으로 쪼개지 말고, wei-wei 수익 URL을 tseng 대응 URL로 301. 중국어 로컬/브랜드는 hoveringlaw.com.tw.
- **P0 코딩(A/B/C 정본)은 §2a 칼럼 7편 URL 검사 나오기 전에 실행하지 말 것.** 오늘 랜딩 3건만으로는 동일군 vs 상이군 반증이 안 닫힘.
- 지금 코딩해도 안전한 것: 소송 랜딩/가이드가 사이트맵·내부링크에 실제로 들어 있는지 확인, 법인설립 랜딩의 사이트맵 일시 오류 원인, wei-wei 속성 추가(사용자는 GSC에서 소유권 확인 필요). 301/캐노니컬 변경은 P0 결과 후.

---

## 6. baseline §7 체크리스트

| # | 항목 | 상태 |
|---|---|---|
| 1 | 색인 5종(+중복 버킷) | **추출됨** (§1) |
| 2 | URL 검사 동일3+상이3+부분1 | **추출됨** (§2a 갱신) |
| 3 | 실적 28일 쿼리 상위 20 + 한국 | 미추출 |
| 4 | 생성형 AI 노출수 또는 탭 미표시 | 미추출 |
| 5 | Search generative AI 설정값 | 미추출 |
| 6 | 사이트맵 상태(163 인식) | 미추출 (URL 검사에서 홈만 sitemap.xml 언급) |
| 7 | Bing WMT | 미추출 (계정 벽) |
| 8 | 네이버 서치어드바이저 | 미추출 |
| 9 | GBP | 사용자만 |
| 10 | GA4 AI Assistants | 미추출 |
| 11 | 네이버/ChatGPT/Perplexity 스팟체크 | 미추출 |

---

## 7. Claude에게

화면 녹화/손쉬운 사용 권한은 이 자료 회수에 필요 없다. 이 파일을 읽고,
1) §1을 baseline에 기입,
2) §2a 칼럼 검사가 도착하면 K1/K2 판정,
3) 그 전까지는 정본 A/B 구현을 열지 말 것.


---

## 4 갱신 — 색인 요청 제출 확인 (2026-08-18 15:01 KST)

둘 다 **첫 클릭에 제출됨**. 실시간 URL 테스트(~40초) 후 요청. 할당량 메시지 없음. 설정/속성 변경 없음.

| URL | 제출 | GSC 확인 문구 | 요청 직후 상태 |
|---|---|---|---|
| `https://tseng-law.com/ko/taiwan-company-setup-lawyer` | Yes | "색인 생성 요청됨 — URL이 우선순위 크롤링 대기열에 추가되었습니다. 페이지를 여러 번 제출해도 대기열 위치나 우선순위가 변경되지 않습니다." 결과 행: "✓ 색인 생성 요청됨 / 다시 요청" | 여전히 미색인. "크롤됨 - 현재 색인이 생성되지 않음". Sitemap: 일시적인 처리 오류 |
| `https://tseng-law.com/ko/taiwan-litigation-lawyer` | Yes | 동일 확인 문구 + "✓ 색인 생성 요청됨" | 여전히 미색인. "Google에는 아직 알려지지 않은 URL입니다." 참조 사이트맵 없음 |



---

## 2a 갱신 — P0 칼럼 7편 URL 검사 (2026-08-18 15:04 KST)

실시간 테스트 없음. 색인 요청 없음. 설정 변경 없음.

| 군 | URL | 색인 | 사유 | 사용자 표준 | Google 표준 | 메모 |
|---|---|---|---|---|---|---|
| 동일 | `/ko/columns/taiwan-company-establishment-advanced-1` | 안됨 | 발견됨 - 현재 색인이 생성되지 않음 | 해당사항 없음 | 해당사항 없음 | sitemap.xml. 참조 페이지 없음. 크롤 기록 없음 |
| 동일 | `/ko/columns/taiwan-massage-history-law` | 안됨 | Google에는 아직 알려지지 않은 URL입니다 | 해당사항 없음 | 해당사항 없음 | **사이트맵 없음**, 참조 없음, 크롤 없음 |
| 동일 | `/ko/columns/taiwan-voluntary-resignation-severance` | 안됨 | Google에는 아직 알려지지 않은 URL입니다 | 해당사항 없음 | 해당사항 없음 | **사이트맵 없음**, 참조 없음, 크롤 없음 |
| 상이 | `/ko/columns/taiwan-company-establishment-basics` | 안됨 | 발견됨 - 현재 색인이 생성되지 않음 | 해당사항 없음 | 해당사항 없음 | sitemap.xml. 참조 `/ko/taiwan-company-setup-lawyer` |
| 상이 | `/ko/columns/taiwan-divorce-lawsuit-qna` | 안됨 | 발견됨 - 현재 색인이 생성되지 않음 | 해당사항 없음 | 해당사항 없음 | sitemap.xml. 참조 `/ko/taiwan-lawyer` |
| 상이 | `/ko/columns/taiwan-logistics-business-setup` | 안됨 | 발견됨 - 현재 색인이 생성되지 않음 | 해당사항 없음 | 해당사항 없음 | sitemap.xml. 참조 없음 |
| 부분 | `/ko/columns/taiwan-traffic-accident-procedure` | 안됨 | 발견됨 - 현재 색인이 생성되지 않음 | 해당사항 없음 | 해당사항 없음 | sitemap.xml. 참조 `/ko/taiwan-litigation-lawyer` |

7편 모두 "URL이 Google에 등록되어 있지 않음". 중복 / 다른 표준 URL 선택 / alternate / redirect 경고 **0건**.
최근 크롤·크롤 허용·색인 허용 전부 해당사항 없음 (미크롤이라 캐노니컬 필드가 비는 게 정상).

### P0 판정 (진단서 K1·K2)

- 가설 "동일군에서만 다른 표준 URL 선택" → **오늘 기각(미입증)**. 양 군 모두 Google 표준 필드 없음.
- 양 군 모두 미색인 → **발견·권위 병목으로 재배분**이 맞음. 정본 A/B(캐노니컬/301) 구현을 이 7편 때문에 열지 말 것.
- 코딩으로 바로 열어도 되는 것: 사이트맵에 빠진 동일군 2편(`massage-history-law`, `voluntary-resignation-severance`) 넣기. 나머지 5편은 사이트맵엔 있는데 미크롤 → 내부링크/인덱스(Load more) 쪽이 다음.
