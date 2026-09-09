# GOAL — tseng-law.com 동남아 SEO·GEO (무인 지속 정본, 레포 내)

총괄 승계 순서: Claude Code Fable 5.1 → (토큰 소진) Cursor Fable 5 `claude-fable-5-thinking-high` (RUNBOOK §7) → (불가 시) Opus 5.
총괄 이력: 2026-09-09 Fable 5.1(계획·가동). ← 승계자는 `총괄: <모델> <YYYY-MM-DD HH:MM>` 한 줄 추가.
정본: `PROMPT.md` · `RUNBOOK.md` · `WO-*.txt` · `evidence/`. 작업트리 `~/Projects/tseng-law-sea-seo-20260909` 브랜치 `seo/sea-geo-20260909`.
판정일: 2026-12-02. 주간 루프: 매주 화(S6).

## A. 진행 보드 — 완료 시 `[x] <날짜> <증거>`. 위에서부터 순서대로.

### S0 베이스라인
- [x] 2026-09-09 S0-a 워크트리 생성 (6022bdcc, seo/sea-geo-20260909)
- [x] 2026-09-09 S0-b 손빗 GSC 실측 → docs/seo/FROM-GROK-BOT-SEA-2026-09.md 커밋 b0a1b8e9 (6국 노출30·클릭2, 생성형AI 34/0, 4로케일 40URL 미등록)
- [x] 2026-09-09 S0-c 방문 리포트 → evidence/visit-28d.md (실데이터 9/1~9/7만: 세션 58, SEA=SG 2·VN 1, AI 경유 1(chatgpt→/ko), GSC CSV 미병합)
- [x] 2026-09-09 S0-d AI 인용 문항 세트 31행 → docs/seo/geo-sea-baseline-2026-09.md 커밋 05363645 (미결: 엔진 로그인 여부·원어민 검수)
- [~] S0-e AI 인용 1차 실측: 워커 0건(6엔진 403, 551d2815) → 11:37 손빗 ASK → 11:4x 보류 → **11:5x 사용자 정정=완료(전부)**. 손빗이 GSC 문서 후 Perplexity+Google(+ChatGPT/Gemini)로 31문항 실측, 이 워크트리의 docs/seo/geo-sea-baseline-2026-09.md 에 직접 기록 예정. **그 파일은 손빗이 쓰는 동안 총괄이 건드리지 않는다.** 도착 후 diff 확인→커밋→[x]
- [x] 2026-09-09 S0-f metrics-log SEA 베이스라인 행 추가(b0a1b8e9). §C 베이스라인 기입. 12주 목표치는 색인 완료 후 W2에 정함(색인 0 상태에서 목표 수치 무의미)

### S1 인텐트 지도
- [x] 2026-09-09 S1-a 42셀·H9/M19/L14·후보 C1~C5 → docs/seo/sea-intent-map-2026-09.md 커밋 3077b6ae (미결: MY/SG ①⑤ 근거 미확인, C2~C5는 guidance 코어 키 확장 필요 §3.1)
- [~] S1-b Grok 검토 완료 → 총평 FAIL 5(docs/seo/sea-intent-map-2026-09.REVIEW.md, 716002c7) → WO-S1-R1 Opus 수정 중(12:0x). 재검토 후 [x] → `.REVIEW.md` FAIL 0 (FAIL 있으면 WO-S1-R1 반려)
- [ ] S1-c 총괄 판정: "없음+H" 셀 확정 → `WO-S3-<slug>.txt` 생성(페이지당 1개)

### S2 GEO 구조 (S2a ∥ S2b 병렬 가능)
- [x] 2026-09-09 S2a-1 Opus 구현 → vitest 7/7
- [~] 12:07 S2a-2 Grok 검토 중(evidence/grok-S2a-review.log)
- [x] 2026-09-09 S2a-3 게이트(typecheck·vitest 75·build·렌더 8URL evidence/render-S2a.txt·계약 grep) → 커밋 1d5577ca (Grok 검토 FAIL 시 R1 후속 커밋)
- [~] 12:08 S2b-1 Opus 진행 중
- [ ] S2b-2 WO-S2b-review (Grok) → availableLanguage 위반 0, JSON-LD 파싱 0오류
- [ ] S2b-3 총괄 게이트 → 커밋 SHA

### S3 신규 인텐트 페이지 (S1-c 결과 수만큼)
- [ ] S3-<slug>-1 초안(Opus) → -2 검토(Grok) → -3 게이트·브랜치 커밋(마커 유지, main 금지)  ※ S1-c 후 slug별 행 추가

### S4 색인
- [ ] S4-a 로컬 실측: RUNBOOK §3 ⑤ 렌더 40 URL → evidence/s4-local-render.txt
- [ ] S4-b 배포 후(사용자 승인 시) `live-seo-scan` + `verify:multilingual-live` → evidence/s4-live-*.log
- [~] 12:09 S4-c **앞당김**: ASK-20260909-1209-sea-seo-indexing(sitemap 재제출+Request Indexing 16URL+IndexNow 40URL) 답 대기. 승인 시 IndexNow는 총괄이 `--dry-run` 후 실행, GSC는 손빗
- [ ] S4-d 2주 뒤 색인 재확인(손빗)

### S5 권위
- [x] 2026-09-09 S5-a Grok 후보 40건·6국 → docs/marketing/SEA-AUTHORITY-CANDIDATES-2026-09.md
- [x] 2026-09-09 S5-b 검수(유료·交流協会 제외, 광고·계약 grep 0, 발송 0) → 커밋 551d2815
- [ ] S5-c ASK "발송 승인 항목 선택"(문서 §4 상위 10이 선택지). S0-b 정리 후 발송. 승인 전 발송 금지

### S6 측정 루프 (매주 화)
- [ ] W1 09-16 · [ ] W2 09-23 · [ ] W3 09-30 · [ ] W4 10-07 · [ ] W5 10-14 · [ ] W6 10-21 · [ ] W7 10-28 · [ ] W8 11-04 · [ ] W9 11-11 · [ ] W10 11-18 · [ ] W11 11-25 · [ ] 판정 12-02
  각 주: 손빗 GSC(국가별 7일·생성형AI) ASK + 방문 7일 리포트 → metrics-log 1행 + 반증 조건 점검 + 다음 WO 결정

### 배포
- [ ] `git log origin/main..HEAD` 정리 → `RELEASE-CHECK.md` → ASK 배포 승인 → 승인 시 RUNBOOK §4-b

## B. 미결·ASK 대기 (승계자는 여기부터)
- S4-c 색인 ASK 답 대기(12:09).
- S0-e: 손빗 AI 인용 실측 예정(S0-b 직후). geo-sea-baseline-2026-09.md 는 손빗 소유 중 — 쓰기 금지.
- S1-b: Grok 검토 중. S1-c 판정 시 주의: C2~C5(/vi|id|th|fil/work-permit)는 international-guidance-content.ts(번역 레인 파일)에 본문이 필요 → 하드룰 4 충돌. 대안=별도 데이터 파일+코어 키 확장, 또는 번역 레인 요청. C1(EN 랜딩)은 intent-pages.ts 4로케일 동시 작성 필요.
- S1-R1 Opus·S2a-review Grok·S2b Opus 병렬 진행 중(12:08). node_modules는 12:05 npm ci 재설치 완료.
- S5-c: 발송 승인 ASK 미발송(S0-b 정리 후).
- Documents 폴더 TCC 차단(11:4x~): 구 정본 접근 불가. 이 폴더가 정본.

## C. 목표 수치 (S0-f 후 기입)
| 지표 | 베이스라인(날짜) | 12주 목표 | 출처 |
|---|---|---|---|
| GSC SEA 6국 노출/28일 | 30 (2026-09-09) | W2에 확정 | FROM-GROK-BOT-SEA |
| GSC SEA 6국 클릭/28일 | 2 (SG, zh-hant 가이드) | | |
| GSC 생성형AI 노출/28일 | 34 / 클릭 0 | | |
| 4로케일 URL 색인율 | 0/14 검사(26 미확인) | | |
| 방문 SEA 세션 · AI 채널 세션 (28일) | 9/1~9/7: SEA 3(SG2·VN1) · AI 1 | | visit-28d |

## D. 세션 로그
- 2026-09-09 · Fable 5.1 · PROMPT v2·GOAL·RUNBOOK·WO 작성(Documents).
- 2026-09-09 11:25 · Fable 5.1 · /goal 가동. S0-a 완료, S0-b ASK 발송(승인), S0-c 완료, S0-d 커밋 05363645, S0-e 실측 0건→사용자 보류 종결, S5 커밋 551d2815, S1 Opus 진행 중.
- 2026-09-09 11:5x · 사용자(손빗 중계 정정) · AI 인용 실측 승인(전부), 손빗 실행.
- 2026-09-09 11:5x · Fable 5.1 · Documents TCC 차단 → 정본을 레포 docs/seo/sea-geo-plan/ 으로 이전·재생성.
