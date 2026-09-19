# GOAL — tseng-law.com 테슬라식 글로벌화 (지구본 언어 선택기 + 세계 언어 확장)

총괄: Cursor Fable 5.1 2026-09-18 15:0x (사용자 /goal: "그룩4.6을 구현 에이전트로, 너는 검수·지시·계획. 테슬라처럼 전세계 언어 번역 + 지구 모양 누르면 각 나라 언어 클릭")
구현 워커: **Grok 4.6** (`cursor-agent -p --model cursor-grok-4.6-high`, 헤드리스, 로그 `evidence/grok-<WO>.log`). 폴백: Opus 5 서브에이전트.
작업트리 `~/Projects/tseng-law-global-picker-20260918` 브랜치 `i18n/global-picker-20260918` (base origin/main 4152e1c6).
상위 하드 룰 상속(`docs/seo/sea-geo-plan/PROMPT.md` §4): 상담 언어 EN/ZH/JA/KO만(안내 언어로 상담 가능 암시 금지, `availableLanguage` 4 고정), 대만 변호사 광고규정(승소율·보장·최고/유일 금지), 새 법률 주장은 `[변호사 검수 필요]`(있으면 main 금지), `siteLocales`·빌더 Locale 확대 금지(새 언어는 **안내 로케일** 메커니즘: `GUIDANCE_LOCALES_4`/`PUBLIC_LOCALES_8` + 팩 파일 + 폰트 + 칼럼 폴더).

## 현 상태 (2026-09-18 origin/main)
- 공개 로케일 11: ko·zh-hant·en·ja(사이트 4) + vi·id·th·fil·ar·de·es(안내 7). 팩: `international-guidance-content.ts`(vi/id/th/fil), `-western.ts`(de/es), ar 별도. 칼럼 17편 × 11언어 폴더. RTL ar 지원.
- 언어 선택 UI: 헤더 유틸리티 `LocaleFlagSwitcher`(드롭다운) + 푸터 동일. 지구본·지역 그룹 없음.
- 선례: de/es 추가 = 팩 파일 + 폰트 + 칼럼 17 + 테스트 갱신 + Fable 검토 4라운드(`docs/seo/reviews/DE-ES-*`). 새 언어 1개 ≈ WO 1~2건.

## A. 진행 보드
### G1 지구본 언어 선택기 (테슬라 "Select Your Region" 패턴)
- [x] 2026-09-18 G1-1 WO-G1 Grok 구현 → 8c365373 (evidence/grok-G1.log): 헤더 지구본 버튼(전 로케일·데스크톱/모바일) → 전면 오버레이, 지역(아시아·태평양 / 중동 / 유럽 / 아메리카) 그룹, 언어 자국어 표기 + 지역명, 현재 언어 표시, Esc/포커스 트랩/aria-modal, 기존 `resolvePublicLanguageSwitchTarget` 폴백 재사용, 레지스트리 1곳(`PUBLIC_LANGUAGE_REGISTRY`)에 항목 추가만으로 새 언어 노출
- [x] 2026-09-18 G1-2 게이트 + 브라우저 QA(Playwright chromium: en/ko/ar 1440·vi/ko 390) → R1(h1→h2, 드로어 지구본, 포커스 복귀) d7aa7622
- [~] G1-3 독립 검토(Opus, 진행 중 15:5x) → FAIL 시 R2
### G2 언어 확장 (배치당 WO 1건, 안내 로케일 메커니즘, 기게재 안내 팩 번역만 — 새 법률 주장 0)
우선순위(대만 로펌 시장 연관 + 테슬라 로케일 교집합): 배치1 **zh-hans(간체)·fr·pt** · 배치2 **ms·ru·tr** · 배치3 **it·nl·pl** · 배치4 **hi·sv·da·nb·fi** · 배치5 **cs·hu·ro·el·he(RTL)·uk**
- [~] G2-1 WO-G2-1 fr·pt Grok 진행 중(15:5x, evidence/grok-G2-1.log). zh-hans는 별도 WO(중국어 상담 가능 → 언어 FAQ 예외)
- [x] 2026-09-18 G2-2 zh-hans·ms·ru·tr (f82be715)
- [x] 2026-09-19 G2-3 it·nl·pl + 전 안내 로케일 폰트 바인딩 + 체커 테이블 — Grok 구현분을 총괄(Opus 5 세션 son7-51)이 인수·검증·커밋 **7a138084**, 후속 정정 **6bb3e839**(it/nl/pl에만 있던 '문의 전송 무료' 긍정 문장 삭제 — 기존 8언어는 부정문만). 게이트: typecheck 0·vitest 266·checker 126 pass/0 fail·eslint 0·guidance-country 0·마커 0·상담 4언어 불변
- [ ] G2-4~5 후속 배치(hi·sv·da·nb·fi / cs·hu·ro·el·he·uk)
- [ ] G2-C 칼럼 17편 번역은 배치별 후속 WO(안내 팩 먼저, 칼럼은 별도)
### G3 릴리스
- [ ] G3-1 `npm run qa` 0 · RELEASE-CHECK · PR → 사용자 머지 → 라이브 검증 → IndexNow
- [ ] G3-2 볼트 갱신

## B. 미결·ASK
- 새 언어 팩은 기존 안내 팩(vi 등)의 **번역**이라 새 법률 주장이 없음 → 마커 없이 배포 가능. 단 원어민 검수는 미실시(de/es와 동일 조건) — 사용자 인지.
- 배포·머지는 사용자.

## B2. 인수 메모 (2026-09-19, son7-51)
- 커서 Fable 세션 종료 후 사용자 지시로 이 세션이 총괄 인수. 워크트리·브랜치·보드 그대로 사용.
- 중복 정리: 같은 날 별도로 만든 `~/Projects/tseng-law-globe-i18n-20260919`(번역가 핸드오프 chunk-001 기반 선택기 사전 11언어)는 이 레인의 `LANGUAGE_PICKER_COPY`(public-language-registry.ts)와 중복 → **폐기**. 번역가 레인 chunk 산출물이 더 오면 이 레인 레지스트리에 반영한다.
- 미배포: 이 브랜치는 origin/main 4152e1c6 기준이라 그 뒤 main 변경(여성형 정정·링크 패리티·반도체 등)을 흡수해야 릴리스 가능.

## C. 세션 로그
- 2026-09-18 15:0x · Fable 5.1 · 워크트리 생성, GOAL·WO-G1 작성, Grok 발주.
- 2026-09-19 09:0x · Opus 5(son7-51) · 레인 인수. G2-3 검증·커밋(7a138084)·정정(6bb3e839). 중복 워크트리 폐기.
- 2026-09-18 15:5x · Fable 5.1 · G1 커밋 8c365373·R1 d7aa7622(브라우저 QA 통과). WO-G2-1(fr·pt) Grok 발주, G1 Opus 검토 병행.
