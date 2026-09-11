# GOAL — tseng-law.com 동남아 B2B 인텐트(회사설립·소송/미수금) 노출·유입 (정본, 레포 내)

총괄: Cursor Fable 5.1 2026-09-11 14:40 (사용자 /goal 지시: "인도네시아·베트남·필리핀 등에서 대만 소송·회사설립에 관심 있는 유저에게 보이게, 유입 늘리기")
작업트리 `~/Projects/tseng-law-sea-b2b-20260911` 브랜치 `seo/sea-b2b-20260911` (base origin/main 3f0c5e1f = SEA S2 배포 3799c41d 포함).
상위 캠페인 정본: `docs/seo/sea-geo-plan/` (PROMPT v2.1 하드 룰 1~9 전부 이 트랙에도 적용). 이 트랙은 그 캠페인의 **S7 스트림**이다.

## 왜 별도 트랙인가
S1 인텐트 지도(`docs/seo/sea-intent-map-2026-09.md`)는 "대만 내 체류 규모" 기준으로 ② ARC 갱신·③ 이주노동자 권리를 H로 뽑았다. 그러나 사무소의 **수임 의도는 ① 회사설립·투자, ⑤ 계약·미수금·소송(B2B, 수요 주체가 대만 밖 기업)**이고 사용자가 9/11 이를 명시했다. S1은 ①⑤를 "규모 근거 미확인 → M"으로 두었을 뿐 낮은 가치라고 판정한 것이 아니다. 현재 vi/id/th/fil에는 ①⑤ 전용 페이지가 0(`/{l}/services` 범위 안내만)이며 EN 랜딩 2종(`/en/taiwan-company-setup-lawyer`, `/en/taiwan-litigation-lawyer`)만 있다.

## A. 진행 보드
### S7-R 리서치 (증거등급 A~E·조회일 필수, 수치 창작 금지)
- [ ] S7-R1 SEO·GEO 진단(seo-geo-expert): VN·ID·PH(+TH·MY·SG) B2B ①⑤ — 검색 표면·질의 언어·GEO·경쟁·처방 순위 → `research-seo-geo-2026-09-11.md`
- [ ] S7-R2 시장 사실(generalPurpose 웹리서치): 검색엔진 점유·비즈니스 검색 언어·AI 도구 사용·대만↔3국 투자/무역 A급 통계·경쟁 로펌 현지어 표면·0원 등재처 → `research-market-facts-2026-09-11.md`
- [ ] S7-R3 채널 처방(marketing-expert): audience/offer/channel/constraint → 0원/유료 분리 순위·측정 설계 → `research-channels-2026-09-11.md`
- [ ] S7-R4 총괄 합성 → `SEA-B2B-PLAN-2026-09-11.md` (사용자 결정 항목 분리)

### S7-C 구현 (안내 4언어 ①⑤ 전용 페이지 — 기게재 사실 번역만, 새 법률 주장 0)
- [ ] S7-C1 WO-B2B-1: `GUIDANCE_EXTRA_PAGE_KEYS` 메커니즘(drafts 11ce641d 방식 재구현) + `company-setup`·`debt-collection` 2키 × vi/id/th/fil 본문(EN 인텐트 랜딩 기게재 사실만) + 답변 블록 + FAQPage JSON-LD + sitemap + llms.txt + 테스트
- [ ] S7-C2 검수 게이트(RUNBOOK §3: diff 범위·typecheck·vitest·build·렌더 8URL·계약/광고 grep·마커 0) → 커밋
- [ ] S7-C3 독립 검토(Grok 또는 Opus 검토자) → FAIL 시 R1
- [ ] S7-C4 리베이스·RELEASE-CHECK → 배포 ASK(사용자)

### S7-M 측정
- [ ] S7-M1 metrics-log에 B2B 분모 행(GSC 국가별 ①⑤ 쿼리·신규 8URL 색인) + geo-sea-baseline 문항 세트에 ①⑤ 현지어 문항 보강 제안(손빗 소유 파일은 직접 수정 금지 → 제안 문서)
- [ ] S7-M2 볼트 갱신(`20-Projects/tseng-law/SEO-작업-로그.md` + `AI-MEMORY-INDEX.md`)

## B. 미결·ASK
- 배포·외부 발송·유료 광고는 사용자. 재질문 금지 항목(PROMPT §4-9) 준수.

## C. 베이스라인 (FROM-GROK-BOT-SEA-2026-09 2026-09-09)
SEA 6국 28일: 클릭 2·노출 30(SG zh-hant 가이드). 생성형AI 34/0. /vi /id /th /fil 40URL 색인 0(확인 14). VN 1·ID 1·PH 1 노출.

## D. 세션 로그
- 2026-09-11 14:40 · Cursor Fable 5.1 · /goal 가동. 워크트리 생성. S7-R1~R3 병렬 발주, WO-B2B-1 작성.
