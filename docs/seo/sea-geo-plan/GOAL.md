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
- [x] 2026-09-09 S1-b Grok FAIL 5(716002c7) → R1 Opus 전부 반영 커밋 c8512969 (미결: 원표 칸값·원어민 미검수, C1~C5 마커 7)
- [x] 2026-09-09 S1-c 판정: C1(EN 갱신 랜딩)=WO-S3-C1 발주(336bf0ee). C2~C5(vi/id/th/fil work-permit-renewal)=코어 키 확장 필요 → S2b 커밋 후 WO-S3-GUIDANCE-KEY(구조+별도 데이터 파일 4언어) 1건으로

### S2 GEO 구조 (S2a ∥ S2b 병렬 가능)
- [x] 2026-09-09 S2a-1 Opus 구현 → vitest 7/7
- [x] 2026-09-09 S2a-2 Grok FAIL 1(services FAQ 문장 혼입, docs/seo/reviews/S2a-REVIEW.md) → WO-S2a-R1 Opus 반영 커밋 a506a7c1 (vitest 8/8, 미결: vi/about 밀도 보강은 길이 상한으로 보류)
- [x] 2026-09-09 S2a-3 게이트(typecheck·vitest 75·build·렌더 8URL evidence/render-S2a.txt·계약 grep) → 커밋 1d5577ca (Grok 검토 FAIL 시 R1 후속 커밋)
- [x] 2026-09-09 S2b-1 Opus 구현 → vitest 60·tsc 0 → 커밋 99fde7eb (llms.txt 라우트 배선은 WO-S2b-R1 진행 중 12:3x)
- [x] 2026-09-09 S2b-2 Grok 검토 PASS 5/5 → docs/seo/reviews/S2b-REVIEW.md
- [x] 2026-09-09 S2b-3 통합 게이트: typecheck·build(8 llms.txt prerender)·렌더 16URL(LegalService availableLanguage 4개 고정, faq FAQPage 8문항 파싱, hreflang 18, canonical self)·/vi|id|th|fil/llms.txt 200 text/plain·루트 카탈로그 8 → evidence/render-S2-integrated.txt. 커밋 915614df(R2)+b1002186(R1)+99fde7eb

### S3 신규 인텐트 페이지 (S1-c 결과 수만큼)
- [x] 2026-09-09 S3-C1-1 Opus 완료 → **drafts 브랜치 seo/sea-s3-drafts-20260909 커밋 0ff814e6**(배포 라인 격리): 4로케일 랜딩+라우트+sitemap+테스트, 마커 36(로케일당 9). 허용 밖 IntentLandingPage.tsx +39(exhaustive Record 필수, 수용). 기존 테스트 3개 깨짐 예상(슬러그 수 2·ja 한글금지 1=마커 게이트) → **S2b-R2 커밋 후 별도 브랜치 seo/sea-s3-drafts-20260909 로 분리 커밋**(main 배포 라인과 격리) → [ ] S3-C1-2 Grok 검토 → [ ] S3-C1-3 게이트·브랜치 커밋(마커 → main 금지)
- [x] 2026-09-09 S3-KEY-1 Opus 완료 → drafts 커밋 11ce641d (vitest 248·tsc 0, 마커 60, 코어 키 `work-permit-renewal` 11번째, GUIDANCE_PAGE_KEYS 10 유지): public-guidance 코어 키 `work-permit-renewal` 추가 + src/data/international-guidance-extra.ts(vi/id/th/fil 본문·마커) + 사이트맵·hreflang → [~] 12:56 S3-KEY-2 + S3-C1-2 통합 Grok 검토(WO-S3-review, drafts evidence/grok-S3-review.log) → [ ] S3-3 R1 반영·drafts 커밋

### S4 색인
- [x] 2026-09-09 S4-a 로컬 40URL 실측 BAD 0/40(200·canonical self·hreflang 9·x-default en) → evidence/s4-local-hreflang.txt
- [ ] S4-b 배포 후(사용자 승인 시) `live-seo-scan` + `verify:multilingual-live` → evidence/s4-live-*.log
- [x] 2026-09-09 S4-c 손빗 실행: IndexNow 40URL 200, sitemap Success(재제출 불필요), Request Indexing 8 요청/3 거부(홈)/3 오류/2 미시도(할당량) → evidence/s4-indexing.md. 잔여 7URL·거부 사유는 S4-d에서
- [ ] S4-d 2026-09-23 손빗 ASK: 40URL 색인 상태 + 거부 3홈 사유(URL 검사) + 잔여 7URL 재요청

### S5 권위
- [x] 2026-09-09 S5-a Grok 후보 40건·6국 → docs/marketing/SEA-AUTHORITY-CANDIDATES-2026-09.md
- [x] 2026-09-09 S5-b 검수(유료·交流協会 제외, 광고·계약 grep 0, 발송 0) → 커밋 551d2815
- [x] 2026-09-09 S5-c **보류 종결(사용자 스킵 12:4x, 재질문 금지)**: 상위 10 발송·문의 전부 안 함. 후보·문안은 docs/marketing/SEA-AUTHORITY-CANDIDATES-2026-09.md 에 보관, 사용자가 원할 때 직접 사용

### S6 측정 루프 (매주 화)
- [ ] W1 09-16 · [ ] W2 09-23 · [ ] W3 09-30 · [ ] W4 10-07 · [ ] W5 10-14 · [ ] W6 10-21 · [ ] W7 10-28 · [ ] W8 11-04 · [ ] W9 11-11 · [ ] W10 11-18 · [ ] W11 11-25 · [ ] 판정 12-02
  각 주: 손빗 GSC(국가별 7일·생성형AI) ASK + 방문 7일 리포트 → metrics-log 1행 + 반증 조건 점검 + 다음 WO 결정

### 배포
- [ ] `git log origin/main..HEAD` 정리 → `RELEASE-CHECK.md` → ASK 배포 승인 → 승인 시 RUNBOOK §4-b

## B. 미결·ASK 대기 (승계자는 여기부터)
- S0-e: 손빗 AI 인용 실측 예정(S0-b 직후). geo-sea-baseline-2026-09.md 는 손빗 소유 중 — 쓰기 금지.
- S1-b: Grok 검토 중. S1-c 판정 시 주의: C2~C5(/vi|id|th|fil/work-permit)는 international-guidance-content.ts(번역 레인 파일)에 본문이 필요 → 하드룰 4 충돌. 대안=별도 데이터 파일+코어 키 확장, 또는 번역 레인 요청. C1(EN 랜딩)은 intent-pages.ts 4로케일 동시 작성 필요.
- 12:56: S3 통합 Grok 검토 진행 중(drafts 워크트리). 이후 R1 반영 → S3 종결(초안 보관). 배포 라인은 배포 ASK 준비(RELEASE-CHECK.md).
- drafts 브랜치 커밋: 0ff814e6(C1)·9f466e7b·11ce641d(C2~C5)·1ac3467f. 배포 라인과 별도. 병합 조건은 변호사 검수·마커 제거·테스트 3개 갱신.
- drafts 브랜치 0ff814e6 인수 조건: 변호사 검수 후 마커 제거 → 테스트 3개(intent-pages-en-growth 슬러그 수·public-intent-docs 카운트·intent-pages-ja 한글금지) 갱신 → 배포 라인 병합. 셋 다 끝나면 통합 게이트(build+렌더) 1회 → 커밋 → Grok 검토 S2b·S3-C1 발주 → WO-S3-GUIDANCE-KEY.
- 손빗 AI 인용 실측 진행 중(geo-sea-baseline-2026-09.md 쓰기 금지).
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
- 2026-09-09 12:4x · 사용자(손빗 중계) · 권위 등재 발송 보류, 재질문 금지.
- 2026-09-09 12:3x · 사용자(손빗 중계 정정) · 색인 요청 둘 다 승인, 손빗 실행.
- 2026-09-09 12:2x · 사용자(손빗 중계) · 색인 요청 보류(→13:0x 철회).
- 2026-09-09 11:5x · 사용자(손빗 중계 정정) · AI 인용 실측 승인(전부), 손빗 실행.
- 2026-09-09 11:5x · Fable 5.1 · Documents TCC 차단 → 정본을 레포 docs/seo/sea-geo-plan/ 으로 이전·재생성.
