# GOAL — tseng-law.com 테슬라식 글로벌화 (지구본 언어 선택기 + 세계 언어 확장)

총괄: Cursor Fable 5.1 2026-09-18 15:0x (사용자 /goal: "그룩4.6을 구현 에이전트로, 너는 검수·지시·계획. 테슬라처럼 전세계 언어 번역 + 지구 모양 누르면 각 나라 언어 클릭")
구현 워커(2026-09-19~): **Grok 4.6** + **Opus 5** 병렬.
- Grok: `cursor-agent -p --trust --force --model cursor-grok-4.6-high --workspace <이 워크트리>` · 로그 `evidence/grok-<WO>.log`
- Opus: `cursor-agent -p --trust --force --model claude-opus-5-thinking-xhigh --workspace <Opus 전용 워크트리>` · 로그 `evidence/opus-<WO>.log`
Cloud Terminal MCP는 이 로컬 세션 네임스페이스에 없고(`CURSOR_API_KEY` 없음, 브랜치 미푸시라 Cloud Agent도 이 워크트리에 못 붙음). 동일 바이너리 `cursor-agent`로 Opus를 붙인다.
**같은 워크트리 동시 쓰기 금지.** 배치마다 파일 소유권을 WO에 박고, 칼럼 번역은 별도 워크트리.
작업트리 `~/Projects/tseng-law-global-picker-20260918` 브랜치 `i18n/global-picker-20260918` (base origin/main 4152e1c6).
상위 하드 룰 상속(`docs/seo/sea-geo-plan/PROMPT.md` §4): 상담 언어 EN/ZH/JA/KO만(안내 언어로 상담 가능 암시 금지, `availableLanguage` 4 고정), 대만 변호사 광고규정(승소율·보장·최고/유일 금지), 새 법률 주장은 `[변호사 검수 필요]`(있으면 main 금지), `siteLocales`·빌더 Locale 확대 금지(새 언어는 **안내 로케일** 메커니즘: `GUIDANCE_LOCALES_4`/`PUBLIC_LOCALES_8` + 팩 파일 + 폰트 + 칼럼 폴더).

## 현 상태 (2026-09-21 origin/main 7becf2e2)
- 공개 로케일 31: 사이트 4 + 안내 27. 칼럼 18편 × 31언어 전부 보유, 안내 27개 체커 PASS. 다음 단계는 사용자 지시대로 언어 추가(후보: bn·ur·ta·fa·my·km·lo·mn·sk·bg·hr·lt·lv·et·sl·ca·is·sw).

### (이전) 2026-09-18 기준
- 공개 로케일 11: ko·zh-hant·en·ja(사이트 4) + vi·id·th·fil·ar·de·es(안내 7). 팩: `international-guidance-content.ts`(vi/id/th/fil), `-western.ts`(de/es), ar 별도. 칼럼 17편 × 11언어 폴더. RTL ar 지원.
- 언어 선택 UI: 헤더 유틸리티 `LocaleFlagSwitcher`(드롭다운) + 푸터 동일. 지구본·지역 그룹 없음.
- 선례: de/es 추가 = 팩 파일 + 폰트 + 칼럼 17 + 테스트 갱신 + Fable 검토 4라운드(`docs/seo/reviews/DE-ES-*`). 새 언어 1개 ≈ WO 1~2건.

## A. 진행 보드
### G1 지구본 언어 선택기 (테슬라 "Select Your Region" 패턴)
- [x] 2026-09-18 G1-1 WO-G1 Grok 구현 → 8c365373 (evidence/grok-G1.log): 헤더 지구본 버튼(전 로케일·데스크톱/모바일) → 전면 오버레이, 지역(아시아·태평양 / 중동 / 유럽 / 아메리카) 그룹, 언어 자국어 표기 + 지역명, 현재 언어 표시, Esc/포커스 트랩/aria-modal, 기존 `resolvePublicLanguageSwitchTarget` 폴백 재사용, 레지스트리 1곳(`PUBLIC_LANGUAGE_REGISTRY`)에 항목 추가만으로 새 언어 노출
- [x] 2026-09-18 G1-2 게이트 + 브라우저 QA(Playwright chromium: en/ko/ar 1440·vi/ko 390) → R1(h1→h2, 드로어 지구본, 포커스 복귀) d7aa7622
- [x] G1-3 독립 검토 FAIL(BLOCK 1) → R2 `86d6fe70`. 2026-09-19 지연 알림은 동일 파일, 재오픈 금지
### G2 언어 확장 (배치당 WO 1건, 안내 로케일 메커니즘, 기게재 안내 팩 번역만 — 새 법률 주장 0)
우선순위(대만 로펌 시장 연관 + 테슬라 로케일 교집합): 배치1 **zh-hans(간체)·fr·pt** · 배치2 **ms·ru·tr** · 배치3 **it·nl·pl** · 배치4 **hi·sv·da·nb·fi** · 배치5 **cs·hu·ro·el·he(RTL)·uk**
- [x] G2-1 fr·pt `04677e16` + 검토 PASS(FIX 16) → R1 `69330894`. 2026-09-19 지연 알림은 동일 파일, 재오픈 금지
- [x] 2026-09-18 G2-2 zh-hans·ms·ru·tr (f82be715)
- [x] 2026-09-19 G2-3 it·nl·pl + 전 안내 로케일 폰트 바인딩 + 체커 테이블 — Grok 구현분을 총괄(Opus 5 세션 son7-51)이 인수·검증·커밋 **7a138084**, 후속 정정 **6bb3e839**(it/nl/pl에만 있던 '문의 전송 무료' 긍정 문장 삭제 — 기존 8언어는 부정문만). 게이트: typecheck 0·vitest 266·checker 126 pass/0 fail·eslint 0·guidance-country 0·마커 0·상담 4언어 불변
- [x] 2026-09-19 G2-4 hi·sv·da·nb·fi `c1312c06` (evidence/grok-G2-4.log): typecheck 0 · vitest 435 · checker 126 · 상담 FAQ 부정 5로케일 · Devanagari 바인딩. 공개 25언어(사이트 4 + 안내 21)
- [x] 2026-09-19 G2-5 cs·hu·ro·uk·el·he — **총괄(son7-51) 직접 구현**. 팩 `international-guidance-eastern.ts`
  (2978줄) 작성 → 레지스트리·라우팅·폰트·SEO 배선 → 시험 핀 정합. 공개 31언어(사이트 4 + 안내 27).
  게이트: typecheck 0 · vitest 1320파일 11975건 통과 0 실패 · lint 0 · guidance-country 0 · 마커 0 · build 0.
  런타임 실측 31언어 × 4경로 124건 전부 200, 선택기 31언어, 상담 4언어 고정, 히브리어 dir=rtl.
  신규 인프라: 공용 Noto Sans에 'greek' subset, Noto Sans Hebrew 로더, RTL 판정에 he 추가.
  검사에서 걸러낸 내용 결함 4종(uk 지명 격변화, hu·uk 통역 부정 누락, ro·uk·el·he 개인정보 문형,
  'All' 라벨 부분문자열 규칙)을 고쳤다.
- [x] 2026-09-19 G2-C-FR 칼럼 18편 `18adba43` (체커 18/18 PASS, FAQ 패리티 de와 동일). 원어민 검수 아님
- [ ] G2-C 나머지 로케일 칼럼(pt·zh-hans·ms·ru·tr·it·nl·pl + G2-4/5)
- [x] 2026-09-19 G2-GATE-R1 `WO-G2-GATE-R1` 커밋됨 — 배타 한정어·무료 전송 게이트·pl 직함·ru nav 축약. 원어민 검수는 여전히 아님
- [ ] G2-2·G2-3 원어민 검토: Opus/Fable 한도(2026-10-18)
### G3 릴리스
- [x] 2026-09-19 14:3x **G3-1 배포 완료** — 사용자 지시("워커 끝나면 바로 통합하고 배포까지 진행해")로 총괄(son7-51)이 통합·검증·푸시.
  - 통합 순서: 워커 산출물 `c1312c06` → 다른 레인 문서 보존 `f78c1328` → 총괄 검증분 병합 `ee9b3e65`(최신 main 06af5b44 흡수 + 표본 가드) → 게이트 R1 `0d5409eb` → 인수 정정 **`9871b8e8`**
  - `origin/main 06af5b44 → 9871b8e8` (fast-forward). 브랜치도 원격에 올림.
  - 게이트 전부 통과: typecheck 0 · **vitest 1320파일 11758건 전부 통과, 실패 0** · lint 0 · security:builder-routes 0 · guidance-country 0 위반 · 칼럼 체커 128 pass/0 fail · `npm run build` 0
  - 런타임 실측(`next start`): 안내 21언어 × home/services/faq/columns = 84건 전부 200, 사이트 4언어 200, 무효 `/xx` 404, 선택기 25언어 노출, `availableLanguage` 4개 고정, 미검수 마커 0
  - **적색 기준선 해소**: main의 018 결정 반영(06af5b44)으로 낡은 핀이 갱신돼 판정 기준이 "기준선 대비 신규 실패 0"에서 **"실패 0"**으로 올라갔다.
  - 인수 중 총괄이 고친 것: ①llms 고지문이 원문 인용이 아니었던 것(5언어) ②`fi`가 `fil`의 접두사라 카탈로그 격리 시험이 자기 URL에 걸린 것 ③낡은 개수·목록 핀 6곳을 레지스트리 파생으로 전환
- [x] 2026-09-19 21:0x G3-2 라이브 검증 + IndexNow 제출
  - 배포 `cb84f507` → 라이브. **31언어 × 4경로 124건 전부 200.**
  - 신규 6언어 렌더 확인: availableLanguage 4개 고정, 미검수 마커 0, 히브리어 `dir=rtl`.
  - 언어 선택기 31개 노출.
  - IndexNow: 사이트맵 593 URL 제출, HTTP 200.
- [ ] G3-3 볼트 갱신 — 2026-09-19 20:4x 사용자 「그룩봇으로 나라별 노출·유입 설정」. HEAD 실측 83 URL 200(사이트4×5 + 안내21×3). IndexNow POST 83건 HTTP 200(영수증≠색인). 404(debt-collection·짧은 company-setup·G2-5) 미제출. GSC/GBP/YouTube는 그룩봇 ASK `ASK-20260919-2040-grokbot-country-exposure.md` + Grok Bot.app 붙여넣기. 정본 `docs/marketing/GROK-BOT-COUNTRY-EXPOSURE-WO-20260919.md`. GSC 국가 타깃 UI 없음.
- **배포 차단 사건 (2026-09-19 14:31~19:2x)**: 저장소 비공개 전환(13:59:36) 이후 Vercel 배포가 전부 막혔다.
  증상은 배포 상태 `UNKNOWN`·빌드 0ms·GitHub 커밋 상태 `Vercel: Deployment was blocked`. 성공 배포 0건.
  근거: 마지막 성공 배포 13:42(전환 전), 전환 후 5시간 동안 시도 3건 전부 차단.
  조치: 저장소를 다시 공개로 되돌리자(사용자 직접 실행) 다음 푸시에서 즉시 `Building`으로 넘어갔다.
  → **원인은 비공개 전환이 맞다.** 다시 비공개로 가려면 Vercel 쪽 GitHub 연동 재승인이 선행돼야 한다.
  공개 전 점검(총괄): 추적 비밀정보 0건(`.env.example`은 전부 자리표시자), 고객 개인정보 0건
  (문의 원장 2파일에 이메일 0건, 열 구성은 집계 항목뿐).
- 총괄 검증 기록: 프랑스어 칼럼 18편은 `check-column-translation.mjs --lang fr`로 **18/18 PASS**
  (frontmatter·블록·링크·숫자·langid·금지어·통화), `[변호사 검수 필요]` 0건.

## B. 미결·ASK
- 새 언어 팩은 기존 안내 팩(vi 등)의 **번역**이라 새 법률 주장이 없음 → 마커 없이 배포 가능. 단 원어민 검수는 미실시(de/es와 동일 조건) — 사용자 인지.
- 배포·머지 권한: 2026-09-19 사용자가 총괄(son7-51)에게 위임("배포까지 진행해"). 이후 배포는 총괄이 게이트 통과 확인 후 직접 한다.
- 저장소가 2026-09-19 13:59:36에 **비공개**로 전환됐다. `9871b8e8` 배포가 전환 이후 첫 배포이므로 Vercel의 비공개 소스 접근은 이때 처음 검증된다.
- `vercel` CLI는 homebrew node 25에 묶여 그냥 실행하면 죽는다. `/Users/son7/.nvm/versions/node/v24.14.1/bin/node /opt/homebrew/bin/vercel …` 형태로 실행할 것. PATH 교체로는 안 된다.

## B2. 인수 메모 (2026-09-19, son7-51)
- 커서 Fable 세션 종료 후 사용자 지시로 이 세션이 총괄 인수. 워크트리·브랜치·보드 그대로 사용.
- 중복 정리: 같은 날 별도로 만든 `~/Projects/tseng-law-globe-i18n-20260919`(번역가 핸드오프 chunk-001 기반 선택기 사전 11언어)는 이 레인의 `LANGUAGE_PICKER_COPY`(public-language-registry.ts)와 중복 → **폐기**. 번역가 레인 chunk 산출물이 더 오면 이 레인 레지스트리에 반영한다.
- 미배포: 이 브랜치는 origin/main 4152e1c6 기준이라 그 뒤 main 변경(여성형 정정·링크 패리티·반도체 등)을 흡수해야 릴리스 가능.

## C. 세션 로그
- 2026-09-18 15:0x · Fable 5.1 · 워크트리 생성, GOAL·WO-G1 작성, Grok 발주.
- 2026-09-19 09:0x · Opus 5(son7-51) · 레인 인수. G2-3 검증·커밋(7a138084)·정정(6bb3e839). 중복 워크트리 폐기.
- 2026-09-18 15:5x · Fable 5.1 · G1 커밋 8c365373·R1 d7aa7622(브라우저 QA 통과). WO-G2-1(fr·pt) Grok 발주, G1 Opus 검토 병행.
- 2026-09-19 13:2x · Grok 4.6 총괄 세션 · 사용자 지시로 Opus 5를 구현 워커로 병행. Cloud Terminal MCP는 로컬 세션에 없음 → cursor-agent Opus. G2-4(Grok) + G2-C-FR(Opus, 별도 워크트리) 발주.
- 2026-09-21 · Fable 5.1 총괄 · **전체 검수(/goal)**: 워커 병행분(ru·da·nb·fi·cs·hu·ro·uk·el·he 칼럼 + 선택기) 통합 후 재검. 결함 6종 정정(카테고리 정본 불일치 88파일 · zh-hans 자기병기 640건 · el/uk 서명 · 018 수사 · date_display 8언어 현지화+체커 월명 · sitemap 테스트 하드코딩). 체커 27/27 PASS, 마커 0, 한글 0, lint/tsc 0, build OK, vitest 1320/11994, 로컬 935 URL 200. 커밋 7becf2e2 → origin/main 푸시. 보고서 `reviews/AUDIT-20260921-FULL.md`. Vercel CLI는 분류기 차단 → 라이브 마커 폴링으로 배포 확인. **12:52 라이브** 935/935 200, IndexNow 935 HTTP 200.
- 2026-09-21 오후 · Fable 5.1 · 사용자 지적(「10개 언어 아니고 엄청 많은 언어」) → 범위 정정: 신규 언어 20개(9/18 6 + 9/19 14). 안내 팩 20개 언어 전수 스캔 긍정 주장 0. cs·hu·ro·uk·el·he 팩 계약 테스트 부재 발견 → content/routing 테스트 2파일 추가(통과). 보고서 §7.
