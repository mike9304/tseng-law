# tseng-law.com 방문 모니터링 시스템 (visit-metrics) — 설계 v1

작성: 2026-09-01 Fable 5 (설계·검수) · 구현: Codex GPT-5.6 하청
목표(사용자 지시): "어떻게 노출이 되어서 어떤 경로로 들어오는지, 키워드는 뭘 선택한 건지, AI 추천으로
온 건지, 어떤 언어를 선택해서 뭘 봤는지, 얼마나 머물렀는지 — 모니터링하고 기록하는 시스템."

## 0. 원칙

- **자체 수집(1st-party)**: 외부 애널리틱스(GA 등) 미도입. 쿠키 없음, IP 원문 저장 없음(레이트리밋에만
  사용), PII 없음. 세션 ID는 sessionStorage 한정(탭 종료 시 소멸). `navigator.doNotTrack === '1'` 존중.
- **레포 관례 재사용**: Blob 이중 백엔드 게이트(BLOB_READ_WRITE_TOKEN 유무), `checkRateLimit`,
  `isCronAuthorized`, zod 검증, `__tests__/route.test.ts` vitest 관례를 그대로 따른다.
- **경합 없는 쓰기**: Blob은 append 불가 → 수집은 "배치당 blob 1개" 쓰기, 일 1회 크론이 롤업으로
  병합·정리. read-modify-write 없음.
- **공개 레포 주의**: 방문 데이터는 레포에 커밋하지 않는다. 로컬 풀 대상 `metrics-local/`은 gitignore.

## 1. 데이터 축 (질문 → 어디서 답하나)

| 질문 | v1 답 | 비고 |
|---|---|---|
| 어떤 경로로 들어왔나 | referrer+UTM → channel(ai/search/social/referral/direct) | 수집 시 서버 분류 |
| AI 추천으로 왔나 | AI 도메인/utm_source 매칭(chatgpt·perplexity·claude·gemini·copilot 등) | `channel='ai'` + source |
| 키워드는 뭘 선택했나 | ① referrer 쿼리(네이버·다음·바이두·얀덱스 등 잔존분) ② GSC CSV 병합(구글은 referrer에 키워드 없음) | GSC 콘솔은 손빗 유지 |
| 어떻게 노출됐나 | GSC 노출/생성형AI 탭(CSV 병합) + 기존 주간 SEO 트래커 | 자동화는 v2(API 자격증명 필요) |
| 어떤 언어를 선택했나 | URL locale(ko/zh-hant/en/ja) + 세션 내 locale 전환 감지 + navigator.language | |
| 뭘 봤나 | 세션별 pageview 경로열, 진입 페이지 | |
| 얼마나 머물렀나 | 가시성 기반 dwell(visible 시간만 합산, 페이지별), max scroll % | 30분 상한 |

## 2. 구성요소

```
[브라우저 VisitTracker] --POST /api/metrics/collect--> [zod검증·봇필터·분류·국가부착]
        |                                                      |
        | sendBeacon(engagement)                    Blob: metrics/visits/raw/<day>/<ts>-<rand>.json
        v                                                      |
   (dwell/scroll 누적)                    [cron 일1회 /api/cron/metrics-rollup (isCronAuthorized)]
                                                               |
                                     Blob: metrics/visits/daily/<day>.jsonl + summary/<day>.json
                                                               |
                        [Mac Studio: scripts/pull-visit-metrics.mjs → metrics-local/visits/]
                                                               |
                              [scripts/visit-report.mjs → 콘솔/MD 리포트 (+ GSC CSV 병합)]
```

### 2.1 이벤트 스키마 (`src/lib/metrics/visit-schema.ts`)
- 공통: `{ v:1, sid, ts }` (sid: 8~64자 `[A-Za-z0-9_-]`)
- `pageview`: `{ type:'pageview', path, locale, ref?(≤512), utm?{source,medium,campaign}(각≤120), lang?(≤16), vw?(정수), firstLoad:boolean }`
- `engagement`: `{ type:'engagement', path, dwellMs(0..1_800_000), scrollPct?(0..100) }`
- 서버 부착(enrich): `{ receivedAt, country?(x-vercel-ip-country), channel, source, keyword }`(pageview만 분류)

### 2.2 유입 분류 (`src/lib/metrics/classify-referrer.ts`)
우선순위: ① AI(utm_source 또는 referrer 도메인) ② 검색(도메인 매칭, 키워드 파라미터 추출)
③ 소셜 ④ utm_source 잔여 → referral ⑤ referrer 있음 → referral(호스트) ⑥ 없음 → direct.
SPA 내부 이동(firstLoad=false)은 internal.
- AI: chatgpt.com, chat.openai.com, perplexity.ai, claude.ai, gemini.google.com, bard.google.com,
  copilot.microsoft.com, you.com, felo.ai, genspark.ai, liner.com/getliner.com, mistral.ai,
  grok.com, x.ai, deepseek.com, kimi.com/kimi.moonshot.cn, chatglm.cn, qwen.ai, meta.ai, doubao.com
- 검색: google.*(키워드 대부분 미제공), search.naver.com/m.search.naver.com(`query`),
  bing.com(`q`), yahoo(`p`), duckduckgo(`q`), baidu(`wd`/`word`), yandex(`text`),
  daum(`q`), ecosia/brave/sogou/so.com/coccoc, kagi.com
- 소셜: x.com/twitter/t.co, facebook(l./lm./m.), instagram, linkedin/lnkd.in, threads,
  youtube/youtu.be, blog.naver.com(→'naver-blog'), cafe.naver.com(→'naver-cafe'), band.us,
  pf.kakao.com, line.me, tiktok, reddit

### 2.3 저장 (`src/lib/metrics/visit-store.ts`)
- 백엔드 게이트: `BLOB_READ_WRITE_TOKEN` 있으면 Blob, 없으면 파일(`.data/metrics/visits/…`) —
  `src/lib/consultation/log-storage.ts` 관례 미러. blob-env-guard가 프리뷰에서 토큰 스트립(자동 적용).
- 원시: 배치당 1 blob `metrics/visits/raw/YYYY-MM-DD/<epochms>-<rand>.json`(이벤트 배열)
- 롤업 산출: `metrics/visits/daily/<day>.jsonl`(이벤트 전체) + `metrics/visits/summary/<day>.json`
- 원시는 롤업 성공 후 삭제. 일자는 UTC 기준(리포트에서 KST 표기 변환).

### 2.4 수집 API (`src/app/api/metrics/collect/route.ts`)
POST 전용(그 외 405). body ≤32KB, 이벤트 1~25개. `checkRateLimit('visit-collect:'+ip, 120, 60_000)`.
UA 봇 정규식(bot|crawl|spider|slurp|headless|lighthouse|pingdom|monitor 등) → 저장 없이 204.
검증 실패 400, 저장 실패는 로그 후 204(재시도 폭주 방지). 응답은 항상 no-store.

### 2.5 클라이언트 (`src/components/metrics/VisitTracker.tsx` + `src/lib/metrics/client/dwell-tracker.ts`)
- `src/app/[locale]/layout.tsx`(공개 레이아웃)에 마운트. `/admin-builder`·`/admin-consultation` 경로,
  `navigator.webdriver`, DNT=1이면 완전 비활성.
- 첫 로드 pageview(ref=document.referrer, utm 파싱, firstLoad=true) + usePathname 변화마다
  pageview(firstLoad=false). fetch keepalive.
- dwell: visible 상태의 경과만 누적(visibilitychange), pagehide/경로전환/숨김 시 sendBeacon으로
  engagement 플러시. max scroll % 스로틀 추적. 누적 로직은 주입 가능한 clock으로 단위테스트.

### 2.6 롤업 크론 (`src/app/api/cron/metrics-rollup/route.ts` + `src/lib/metrics/visit-rollup.ts`)
- vercel.json: `{ "path": "/api/cron/metrics-rollup", "schedule": "30 2 * * *" }` (UTC 02:30 = KST 11:30 전일분)
- `isCronAuthorized` 가드. `?day=YYYY-MM-DD` 수동 지정 가능(기본: UTC 어제 + 최근 7일 내 미롤업 원시 캐치업).
- summary 스키마:
```json
{ "day":"2026-09-01", "totals":{"pageviews":0,"sessions":0,"avgDwellMs":0,"bounceSessions":0},
  "byChannel":{}, "bySource":{}, "aiBySource":{}, "aiLandingPages":{}, "byLocale":{}, "byCountry":{},
  "topPages":[{"path":"","views":0,"avgDwellMs":0}], "topEntryPages":[], 
  "keywords":[{"keyword":"","source":"","count":0}], "localeSwitchSessions":0 }
```
- 멱등: 재실행 시 덮어쓰기. 원시 삭제는 daily+summary 쓰기 성공 후에만.

### 2.7 로컬 모니터링 (Mac Studio)
- `scripts/pull-visit-metrics.mjs`: .env.local 토큰으로 summary/daily 신규분을 `metrics-local/visits/`로 풀(`--days 35`).
- `scripts/visit-report.mjs`: `--days 7|30`, `--md` 옵션. 채널·AI유입 상세(소스별+랜딩)·키워드(수집분
  + `metrics-local/gsc/*.csv` 병합) · locale/국가 · 톱페이지·체류 · 언어전환 세션 출력.
- `.gitignore`: `/metrics-local/` 추가.

## 3. v2 후보 (이번 범위 아님)
GSC/네이버 서치어드바이저 API 자동 풀(자격증명 필요·손빗 협의), 관리자 대시보드 페이지
(/admin-builder/traffic), AI 크롤러 봇 방문 로그 축(서버로그 기반), launchd 일일 풀 자동화.

## 4. 게이트
WO별: typecheck + 해당 vitest. 통합: `npm run qa` + `npm run build` 그린 → 커밋(브랜치
feat/visit-metrics, 워크트리 격리 — main 작업트리는 활성 타 세션 WIP 779파일이라 접촉 금지).
배포(main 병합·push·Vercel)는 사용자 1회 확인 후.
