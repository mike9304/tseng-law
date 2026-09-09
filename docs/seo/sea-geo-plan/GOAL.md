# GOAL — tseng-law.com 동남아 SEO·GEO (무인 지속 정본, 레포 내)

총괄 승계 순서: Claude Code Fable 5.1 → (토큰 소진) Cursor Fable 5 `claude-fable-5-thinking-high` (RUNBOOK §7) → (불가 시) Opus 5.
총괄 이력: 2026-09-09 Fable 5.1(계획·가동). ← 승계자는 `총괄: <모델> <YYYY-MM-DD HH:MM>` 한 줄 추가.
정본: `PROMPT.md` · `RUNBOOK.md` · `WO-*.txt` · `evidence/`. 작업트리 `~/Projects/tseng-law-sea-seo-20260909` 브랜치 `seo/sea-geo-20260909`.
판정일: 2026-12-02. 주간 루프: 매주 화(S6).

## A. 진행 보드 — 완료 시 `[x] <날짜> <증거>`. 위에서부터 순서대로.

### S0 베이스라인
- [x] 2026-09-09 S0-a 워크트리 생성 (6022bdcc, seo/sea-geo-20260909)
- [~] S0-b 손빗 GSC 베이스라인: ASK-20260909-1124 사용자 승인(전부), 손빗 작성 중 → 파일 `~/Projects/tseng-law/docs/seo/FROM-GROK-BOT-SEA-2026-09.md`(main 작업트리) 생기면 `cp`로 워크트리 `docs/seo/`에 복사 → 커밋 → [x]
- [x] 2026-09-09 S0-c 방문 리포트 → evidence/visit-28d.md (실데이터 9/1~9/7만: 세션 58, SEA=SG 2·VN 1, AI 경유 1(chatgpt→/ko), GSC CSV 미병합)
- [x] 2026-09-09 S0-d AI 인용 문항 세트 31행 → docs/seo/geo-sea-baseline-2026-09.md 커밋 05363645 (미결: 엔진 로그인 여부·원어민 검수)
- [x] 2026-09-09 S0-e **보류 종결(사용자 결정, 재질문 금지)**: 워커 실측 0건(6엔진 403), 손빗 브라우저 실측 스킵. 미실측으로 고정(커밋 551d2815). AI 축 판정은 GSC 생성형AI 리포트+방문 AI채널로 대체.
- [ ] S0-f 베이스라인 요약을 `docs/seo/metrics-log.md`에 1행 추가 + §C 목표수치 확정(S0-b 파일 도착 후. 목표수치는 ASK로 사용자 확인 1회)

### S1 인텐트 지도
- [~] S1-a WO-S1 Opus 진행 중(11:4x 발주) → `docs/seo/sea-intent-map-2026-09.md` 42셀
- [ ] S1-b WO-S1-review (Grok) → `.REVIEW.md` FAIL 0 (FAIL 있으면 WO-S1-R1 반려)
- [ ] S1-c 총괄 판정: "없음+H" 셀 확정 → `WO-S3-<slug>.txt` 생성(페이지당 1개)

### S2 GEO 구조 (S2a ∥ S2b 병렬 가능)
- [ ] S2a-1 WO-S2a (Opus) 답변형 블록 → diff·vitest
- [ ] S2a-2 WO-S2a-review (Grok) → REVIEW FAIL 0
- [ ] S2a-3 총괄 게이트 ①~⑦ → 커밋 SHA
- [ ] S2b-1 WO-S2b (Opus) llms.txt 4로케일 + FAQPage JSON-LD + @id 참조 → diff·vitest
- [ ] S2b-2 WO-S2b-review (Grok) → availableLanguage 위반 0, JSON-LD 파싱 0오류
- [ ] S2b-3 총괄 게이트 → 커밋 SHA

### S3 신규 인텐트 페이지 (S1-c 결과 수만큼)
- [ ] S3-<slug>-1 초안(Opus) → -2 검토(Grok) → -3 게이트·브랜치 커밋(마커 유지, main 금지)  ※ S1-c 후 slug별 행 추가

### S4 색인
- [ ] S4-a 로컬 실측: RUNBOOK §3 ⑤ 렌더 40 URL → evidence/s4-local-render.txt
- [ ] S4-b 배포 후(사용자 승인 시) `live-seo-scan` + `verify:multilingual-live` → evidence/s4-live-*.log
- [ ] S4-c IndexNow(변경 URL, `--dry-run` 먼저) + 손빗 GSC 색인요청 ASK
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
- S0-b: 손빗 GSC 작성 중(11:3x). 파일은 main 작업트리에 생김.
- S1-a: Opus 진행 중. 완료 시 게이트(범위·42셀·URL·계약 grep) → S1-b Grok 발주.
- S5-c: 발송 승인 ASK 미발송(S0-b 정리 후).
- Documents 폴더 TCC 차단(11:4x~): 구 정본 접근 불가. 이 폴더가 정본.

## C. 목표 수치 (S0-f 후 기입)
| 지표 | 베이스라인(날짜) | 12주 목표 | 출처 |
|---|---|---|---|
| GSC SEA 6국 노출/28일 | | | FROM-GROK-BOT-SEA |
| GSC SEA 6국 클릭/28일 | | | |
| GSC 생성형AI 노출/28일 | | | |
| 4로케일 URL 색인율 | | | |
| 방문 SEA 세션 · AI 채널 세션 (28일) | 9/1~9/7: SEA 3(SG2·VN1) · AI 1 | | visit-28d |

## D. 세션 로그
- 2026-09-09 · Fable 5.1 · PROMPT v2·GOAL·RUNBOOK·WO 작성(Documents).
- 2026-09-09 11:25 · Fable 5.1 · /goal 가동. S0-a 완료, S0-b ASK 발송(승인), S0-c 완료, S0-d 커밋 05363645, S0-e 실측 0건→사용자 보류 종결, S5 커밋 551d2815, S1 Opus 진행 중.
- 2026-09-09 11:5x · Fable 5.1 · Documents TCC 차단 → 정본을 레포 docs/seo/sea-geo-plan/ 으로 이전·재생성.
