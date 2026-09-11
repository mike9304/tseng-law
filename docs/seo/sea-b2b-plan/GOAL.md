# GOAL — tseng-law.com 동남아 B2B 인텐트(회사설립·소송/미수금) 노출·유입 (정본, 레포 내)

총괄: Cursor Fable 5.1 2026-09-11 14:40 (사용자 /goal 지시: "인도네시아·베트남·필리핀 등에서 대만 소송·회사설립에 관심 있는 유저에게 보이게, 유입 늘리기")
작업트리 `~/Projects/tseng-law-sea-b2b-20260911` 브랜치 `seo/sea-b2b-20260911` (base origin/main 3f0c5e1f = SEA S2 배포 3799c41d 포함).
상위 캠페인 정본: `docs/seo/sea-geo-plan/` (PROMPT v2.1 하드 룰 1~9 전부 이 트랙에도 적용). 이 트랙은 그 캠페인의 **S7 스트림**이다.

## 왜 별도 트랙인가
S1 인텐트 지도(`docs/seo/sea-intent-map-2026-09.md`)는 "대만 내 체류 규모" 기준으로 ② ARC 갱신·③ 이주노동자 권리를 H로 뽑았다. 그러나 사무소의 **수임 의도는 ① 회사설립·투자, ⑤ 계약·미수금·소송(B2B, 수요 주체가 대만 밖 기업)**이고 사용자가 9/11 이를 명시했다. S1은 ①⑤를 "규모 근거 미확인 → M"으로 두었을 뿐 낮은 가치라고 판정한 것이 아니다. 현재 vi/id/th/fil에는 ①⑤ 전용 페이지가 0(`/{l}/services` 범위 안내만)이며 EN 랜딩 2종(`/en/taiwan-company-setup-lawyer`, `/en/taiwan-litigation-lawyer`)만 있다.

## A. 진행 보드
### S7-R 리서치 (증거등급 A~E·조회일 필수, 수치 창작 금지)
- [x] 2026-09-11 S7-R1 SEO·GEO 진단 → `research-seo-geo-2026-09-11.md` (c05ec4ea) — 병목=색인(40URL 0/14, 사이트 미색인 148), ① 현지어 칼럼 17×4 이미 존재, ⑤ 현지어 표면 0, 6국 Google 90%+, PH·MY·SG=EN(SG는 간체 질의 실측→zh-hant 병행)
- [x] 2026-09-11 S7-R2 시장 사실 → `research-market-facts-2026-09-11.md` (c05ec4ea) — SEA→대만 인바운드 투자 SG 외 미미(VN 누적 US$79M), 對VN 수입 +80.6%·對ID 순수입 → ⑤ 수요 근거 > ①. 대만 로펌 현지어 표면 0(공백). 0원 채널 실체=VTBA 등
- [x] 2026-09-11 S7-R3 채널 처방 → `research-channels-2026-09-11.md` (c05ec4ea) — 소개 뒤 웹 검증 표면·문의 원장 분모 부재·0원/유료 분리·H1~H6 반증 조건
- [x] 2026-09-11 S7-R4 합성 → `SEA-B2B-PLAN-2026-09-11.md` (c05ec4ea) — 총괄 결정 D1~D8, 사용자 결정 U1~U10

### S7-C 구현 (안내 4언어 ①⑤ 전용 페이지 — 기게재 사실 번역만, 새 법률 주장 0)
- [x] 2026-09-11 S7-C1 WO-B2B-1 → 커밋 7f585835 (Opus 구현) — 8 URL 200, FAQPage/LegalService(availableLanguage 4 고정), 답변 블록, 관련 안내 내부링크(home·services·pricing·contact), llms.txt, sitemap 8. 게이트: typecheck 0·vitest 184·eslint 0·build 0·evidence/render-C1.txt·마커 0·금액 0
- [x] 2026-09-11 S7-C2-R1 → 9117c4c5(리베이스 후): 마지막 FAQ 원문 일치 · company-setup 허브 ① 칼럼 8편 링크 · 8언어 hreflang+x-default=en 상호참조 · 칼럼 FAQPage inLanguage 수정 — evidence/render-R1.txt
- [x] 2026-09-11 S7-C3 독립 검토 Grok 4.6 `reviews/S7-C-REVIEW.md` PASS 0 BLOCK·FIX 6 → R2 852a4e69 반영(전환기 역방향·th/id/fil 교정·debt-collection 준비목록 B2B 정리·출처추적 테스트). NOTE #8 클러스터 유지(총괄 결정, RELEASE-CHECK 참조)
- [x] 2026-09-11 S7-C4 origin/main f110b2bc 리베이스 · 전체 lint 0·unit(기존 attestation 1건 외 전부)·build 0·렌더 evidence/render-release.txt → `RELEASE-CHECK.md`. **배포·색인 확대는 사용자 결정(U1·U2) 대기**

### S7-M 측정
- [x] 2026-09-11 S7-M1 metrics-log "SEA B2B(S7)" 표 + `AI-CITATION-QUESTIONS-B2B-PROPOSAL.md`(①⑤ 10문항 제안) → 7686f4ee
- [x] 2026-09-11 S7-M2 볼트 갱신 — SEO-작업-로그 2026-09-11 절 + AI-MEMORY-INDEX updated/최근결정

## B. 미결·ASK
- 배포·외부 발송·유료 광고는 사용자. 재질문 금지 항목(PROMPT §4-9) 준수.
- 사용자 결정 묶음 U1~U10은 `SEA-B2B-PLAN-2026-09-11.md` §3. 추가: **U11 Person `knowsLanguage`에 English 추가 여부**(현재 Korean·Chinese·Japanese — 변호사 본인 사실 확인 필요, 총괄이 임의 추가하지 않음).
- 환경: 워크트리 node_modules는 `~/Projects/tseng-law-sea-seo-20260909/node_modules` 심링크(main의 것은 `@modelcontextprotocol/server` 누락으로 typecheck 실패).

## C. 베이스라인 (FROM-GROK-BOT-SEA-2026-09 2026-09-09)
SEA 6국 28일: 클릭 2·노출 30(SG zh-hant 가이드). 생성형AI 34/0. /vi /id /th /fil 40URL 색인 0(확인 14). VN 1·ID 1·PH 1 노출.

## D. 세션 로그
- 2026-09-11 14:40 · Cursor Fable 5.1 · /goal 가동. 워크트리 생성. S7-R1~R3 병렬 발주, WO-B2B-1 작성.
- 2026-09-11 15:3x · Cursor Fable 5.1 · R1~R4 커밋 c05ec4ea, M1 7686f4ee, C1 7f585835(게이트 전부 통과). WO-B2B-R1 발주.
- 2026-09-11 16:3x · Cursor Fable 5.1 · C2-R1·C3·R2·C4 완료, RELEASE-CHECK 작성. 남은 것 = 사용자 결정 U1~U11(배포·색인·원장 등) → 배포 후 S6 주간 루프에 B2B 4행 추가(W1 09-16).
- 2026-09-11 16:3x · Cursor Fable 5.1 · `npm run qa` exit 0(1231 파일 전부 통과 — attestation 실패 원인은 `data/audit/` 부재, 환경 수정). fil gloss·결제증빙 복원 소수정.
- 2026-09-11 16:4x · Cursor Fable 5.1 · 브랜치 origin 푸시 + PR #1(https://github.com/mike9304/tseng-law/pull/1) 생성 — main 머지(=배포)는 사용자. 머지 후 절차는 PR 본문·RELEASE-CHECK.
