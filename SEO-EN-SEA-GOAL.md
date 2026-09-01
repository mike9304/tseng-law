# SEO-EN-SEA-GOAL — 영어권·동남아(영어 검색) 노출 확대

Updated: 2026-09-01 KST · Owner: Fable 5(인터랙티브, 이 워크트리 단독 작성자) · Worker: codex exec(gpt-5.6) 하청
Base: origin/main@22d43420 · Worktree: `~/Projects/tseng-law-seo-en-20260901` · Branch: `seo/en-sea-expansion-20260901`
사용자 /goal (2026-09-01): "사이트를 영어권 혹은 동남아 영어로 찾을 수 있는 국가들에 더 노출되고 싶어"

## 전제 사실 (2026-09-01 정찰 실측)

- EN 자산 이미 존재: EN 칼럼 17편(라이브 인덱스 17/17 링크 확인), 랜딩 4(taiwan-lawyer/taiwan-company-setup-lawyer/korean-lawyer-in-taiwan/taiwan-litigation-lawyer), 가이드(taiwan-company-setup), EN 홈 실콘텐츠+LegalService JSON-LD(areaServed:["Taiwan"]).
- 사이트맵 hreflang 4로케일+**x-default=/ko** (전환 검토 대상).
- 8/18 진단(코퍼스본): 병목 1위=권위(백링크 0)→크롤 수요→구글 색인 16/175. Bing Indexed 130. 테크니컬 9/10.
- 라이브 버그: `/en/korean-lawyer-in-taiwan` 타이틀 브랜드 2중 접미("| Hovering… | Hovering…").
- ⚠️ 멀티라이터: main 작업트리는 타 codex 세션 WIP 798파일(8/18 mtime) — **손대지 않는다**. visit-metrics 세션(9/1)이 `feat/visit-metrics`@682f3226 완성·배포 대기. 로컬 main HEAD 547cb673은 attorney-profiles/seo.ts 부분커밋 결함으로 typecheck·build 실패 보고 — 결함 원인 커밋이 eed2c55d(공통 조상 이전)면 이 워크트리 베이스도 실패 → D0.
- 대만 변호사 광고 규정 게이트(docs/seo/SEO-DIAGNOSIS-2026-08-18.md §2.0): 승소율 표시 절대 금지, 과거 사건 표시 원칙 금지, 제3자 게시물 廣告 표기+연락처+3년 보존.

## Done criteria (전부 검증 명령/관찰 포함)

- [x] **D0 베이스 그린(조건부)** ✅사이클 3: typecheck exit 0 · qa 8549 passed / **1 선재 실패**(`qa-runtime-attestation.test.ts` "symlink TMPDIR leaf" — 환경 의존, 클린 origin/main에서 변경 0으로 재현, 로그 /tmp/tseng-seo-qa.log:1595). attorney-profiles 결함은 이 계보에서 미재현. **이후 게이트 = "신규 실패 0"**(선재 1건 명단 고정).
- [x] **D1 EN/SEA 베이스라인 문서** ✅사이클 3 — `docs/seo/EN-SEA-BASELINE-2026-09-01.md`(인벤토리+콘솔 분모+미측정 4항).
- [x] **D2 x-default 정책** ✅사이클 6 — 전문가 찬성 판정(P0) 따라 /en 전환 구현·커밋(ead46e69): 공용 getLanguageAlternates+사이트맵(동일 함수)+빌더 hreflang(en 엔트리 우선 폴백체인). **검수 적발 결함 수리 포함**: EN-noindex 경로(/faq 등)는 x-default ko 폴백(en 누출 금지 설계 유지) — 명시 테스트로 계약화. 검증: seo-hreflang·sitemap·builder seo 테스트 그린 + 전체 qa 신규실패 0.
- [x] **D3 EN 인텐트 콘텐츠 보강** ✅사이클 6 — ① 타이틀 중복 4로케일 수정+브랜드 배제 회귀 테스트(ead46e69) ② 판정대로 신설 대신 기존 랜딩 2종 심화(5992ff98): 국제 분쟁·미수금 회수 인텐트+FAQ 6건(기게재 사실만 — 상담 NT$3,000/1h·설립 NT$50,000·화상 상담, 승소율·결과보장·창작 사실 0) ③ JSON-LD 신규 투자 없음(areaServed 레버 기각 판정 준수, FAQ는 가시 텍스트로만). 검증: 문안 diff 대조(발주문과 일치)+qa.
- [x] **D4 EN 발견 경로** ✅사이클 5 실측 — /en 홈 초기 HTML에 랜딩 3종 각 1링크+칼럼 인덱스 17/17, 사이트맵에 인텐트 페이지 포함(관련 URL 96 매치), 랜딩→칼럼·서비스·가이드는 columnSlugs/relatedResources로 연결. 신설 URL 없음(심화는 기존 URL 내).
- [x] **D5 EN 권위 아웃리치 팩** ✅사이클 4 — `docs/seo/EN-OUTREACH-PACK-2026-09.md`(판정 반영본: 실체 인용원 우선순위 5단+§7 게이트+문안 2종). 발송은 사용자(주 1건).
- [x] **D6 QA+커밋+배포 준비** ✅사이클 6 — qa 8551 passed/신규 실패 0(선재 attestation 1건만, 스토리지 2건은 재실행 그린=플레이키 판정), 커밋 3건(ead46e69 코드 / 5992ff98 콘텐츠 / 9687255d 문서), 프로덕션 빌드 실행. **병합·배포 전략**: 이 브랜치=origin/main(22d43420)+3커밋 → 사용자 승인 시 ① `git fetch origin`으로 main 불변 확인 ② `git push origin seo/en-sea-expansion-20260901`(브랜치 백업) ③ `git push origin seo/en-sea-expansion-20260901:main`(fast-forward, Vercel 자동 배포). 로컬 main의 doc 커밋 2건(3cd86c7c·547cb673)은 배포 후 별도 병합(내용 doc-only). visit-metrics 브랜치는 사용자 스킵 판정대로 보류(이후 새 main에 리베이스 가능). 로컬 main 워크트리 더티(타 세션 WIP)는 불변. **push/배포 = 사용자 1회 확인 대기.**
- [x] **D7 측정 설계** ✅사이클 4 — `docs/seo/EN-SEA-MEASUREMENT-2026-09.md`(주간 트래커 확장표+콘솔 라운드 6항+EN 질문세트 20문×6표면×7런+KPI 4종·12주 반증+9/15 Cloudflare 체크) + `EN-USER-ACTIONS-2026-09.md`(사용자 런북 A~E).

## Non-goals

- 네이버/한국 트랙(기존 캠페인 유지), ja 확장, 다음/카카오.
- llms.txt 보강(8/18 확정: 무용), FAQPage 스키마 확대(리치결과 종료).
- main 작업트리의 타 세션 WIP 처리(소유자 아님).
- 유료 디렉터리 등재(규정 확인 전 보류 유지).

## Progress

- [사이클 1 · 2026-09-01 14:2x] 정찰 완료(위 전제 사실). 워크트리 생성. seo-geo-expert 에이전트 기동(x-default/지역 hreflang/SEA 레버/EN GEO/광고규정 6문항, 코퍼스 근거 판정 요청). 다음: npm ci → D0 typecheck 재현.

- [사이클 2 · 2026-09-01 14:4x] **D0 절반 검증**: origin/main 베이스에서 `npm run typecheck` exit 0 (로컬 main 결함은 이 계보에 없음 — visit-metrics 세션의 "main 결함" 전제는 로컬 main 한정, origin/main 기반이면 배포 가능 → D6 조율 정보). 전체 qa 백그라운드 진행 중. **D1 완료**: `docs/seo/EN-SEA-BASELINE-2026-09-01.md` 작성(EN 인벤토리+콘솔 분모+미측정 4항목). 코드 정찰: 타이틀 중복 = `korean-lawyer-in-taiwan/content.ts` metaTitle 4로케일 전부 브랜드 포함 + 레이아웃 `%s | Brand` 템플릿 이중 적용(content.ts:32/109/186/263). x-default = `src/lib/seo.ts:209`(defaultLocale 파생) + `src/app/sitemap.ts` — 라우팅 defaultLocale과 분리된 hreflang 전용 상수 필요. 랜딩 신설 패턴 = korean-lawyer-in-taiwan 구조(page.tsx+content.ts 4로케일+tests). FAQPage 스키마는 8/18 비처방(신설 랜딩은 가시 Q&A만, 스키마 생략) — expert 판정 대기.

- [사이클 4 · 2026-09-01 15:1x] **전문가 판정 수신**(/tmp/seo-expert-en-sea-verdict-20260901.md, 코퍼스 11노트 부팅): x-default→/en 찬성[P0·한국 무영향 확정], en-SG 변형·areaServed 레버·SEA-Bing 가설 기각, P1=실체 있는 인용원(AmCham/ECCT·전문가 코멘트 플랫폼), P2=랜딩 fan-out 심화+가격·기간 본문 명시(6개월 게이트), P3=GBP 영어, 1차 전장=대만 내 expat. **D5·D7 문서 완료**(EN-OUTREACH-PACK 판정 반영본, EN-SEA-MEASUREMENT: 주간 트래커 확장+콘솔 라운드 6항+EN 질문세트 20문+12주 반증). **WO-EN-1 발주**(codex 워커, x-default 상수화+타이틀 중복+테스트 계약 갱신 — 산출점 getLanguageAlternates 단일 확인, 진행 중, 25분 정체킬 감시). WO-EN-2 작성 완료(intent-pages.ts en 랜딩 2종 심화, 문안 고정 — 기게재 사실만, EN-1 종료 후 순차 발주). 발견: /en/pricing 기존재(NT$3,000/1h·설립 NT$50,000 — 문안 출처로 사용), 가이드 EN은 이미 fan-out 완비 수준. **ASK 발송**(손빗): 영어 상담 가능 여부(pricing 언어 표기가 K/C/J뿐) — 답신 전 영어상담 주장 문구 금지 유지.

- [사이클 5 검수 적발 · 16:5x] **WO-EN-1 결함 1건**: EN-noindex 경로(/faq·/portfolio·/events·/store·미번역 칼럼)에서 x-default가 noindex인 /en URL을 가리킴(seo.ts getLanguageAlternates — 무조건 HREFLANG_X_DEFAULT_LOCALE 사용). 워커가 seo-hreflang-locales.test.ts:32 핀을 그 잘못된 값(en/faq)으로 갱신해 계약화 — seo-visibility의 "en alternate 누출 금지" 설계와 모순. **수리 사양(WO-EN-2 종료 후 Fable 외과 수습)**: x-default를 `isEnglishNoindexPath(path) ? defaultLocale : HREFLANG_X_DEFAULT_LOCALE`로, /faq 테스트 핀 ko 원복 + "noindex 경로 x-default는 en 금지" 명시 테스트. 빌더 쪽은 WO-EN-1b 사양이 이미 "en 엔트리 부재 시 폴백"이라 자동 정합.

- [사이클 6 · 2026-09-01 17:0x] WO-EN-2(+1b) 검수 통과(문안 발주문과 바이트 일치·빌더 폴백체인 정확). Fable 외과 수습: seo.ts x-default noindex 가드+테스트 계약 교정(/faq→ko)+sitemap 핀 교정. 전체 qa 8551 passed·신규 실패 0(스토리지 2건은 격리 재실행 그린=플레이키). 커밋 3건(ead46e69/5992ff98/9687255d). `npm run build` exit 0. 외부기억 갱신(볼트 SEO-작업-로그·인덱스·auto-memory).

## 완료 선언 (2026-09-01 17:0x)

**GOAL COMPLETE** — D0~D7 전부 충족(체크 증거 각 항목에 기재). 통제 가능한 레버는 전부 구현·검증·커밋됐다.
남은 것은 전부 **사용자 단계**: ① push/배포 1회 승인(D6 절차 — ff to main → Vercel) ② 영어 상담 가능 여부 답신(ASK-20260901-en-sea-claude.md) ③ 콘솔 라운드·GBP 영어·아웃리치 발송(EN-USER-ACTIONS-2026-09.md) ④ 12주 후 채점(EN-SEA-MEASUREMENT §4 반증 조건).
노출 자체(색인·순위·인용)는 배포+12주 관측 대상이며, 이 시점에 성과 주장은 하지 않는다.

- [사이클 7 · 종결] Stop hook 재촉에 따른 잔여 마찰 제거: 배포 원커맨드 스크립트 커밋(37711a79, 베이스 검증 안전장치), 브리지 ASK에 배포 승인 문항 정식 추가. **터미널 상태 = goal-loop 종료 조건 (b) 사람 결정 필요**: ① 배포 승인(스크립트 1회 실행 또는 "승인" 답신) ② 영어 상담 여부 ③ 콘솔·GBP·아웃리치는 계정 권한상 사용자만 가능. 에이전트 측에서 더 진행할 수 있는 항목 0 — 무단 푸시는 상시 규칙(최종푸시 1회 확인)+금일 손빗 중계(배포 승인 아님) 위반이라 하지 않음.

## Open

- GSC/Bing 콘솔의 EN 쿼리·국가 분포 = 미측정(사용자/손빗 콘솔 라운드 필요 — D1에 항목 명시).
- 로컬 main ahead 2(doc 커밋)·visit-metrics 브랜치와의 병합 순서 — D6에서 결정.
- "타 세션이 main 결함 수정중"(visit-metrics 메모) — 중복 수리 방지 위해 D0 착수 전 브리지/워크트리 재확인.
