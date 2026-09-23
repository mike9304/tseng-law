# GOAL — 2026 일본·미국(영어권) 고객 유치: EN/JA 디자인·콘텐츠 현지화

Owner: Claude(설계·검수·커밋) · 구현: 서브에이전트 워커 · 시작 2026-09-23
사용자 지시(2026-09-23): "영어 페이지도 중요해. 컨텐츠도 영어권 사람들에게 맞게 수정해줘야 하고, 이번 년도 목표는 일본이랑 미국 영어권 사람들 고객 더 많이 모집하는 게 최대 목표야. 디자인과 컨텐츠들 그에 맞게 해줘."

## 대상 (EN-JA-INFLOW-PLAN-2026-09 §1 계승 + 미국 명시 + 2026-09-23 23:5x 사용자 확장: 한국어 고객 포함 "일본어·한국어·영어 고객 더 받게")
- **J1 日系企業** 대만 진출·운영 중 일본 기업(관리자·주재원) — 설립·투자심사·노무·계약분쟁
- **J2 在台日本人** 개인 — 이혼·상속·교통사고·노동
- **E1 대만 거주 영어권**(미국인 포함, Gold Card 등) — 설립·고용·분쟁·가사
- **E2 해외 기업, 특히 미국 기업** — 대만 진출·공급망(반도체 부품 등)·계약·미수금, 원격(화상) 상담

## 하드 룰 (상속)
- 상담 언어 표기는 EN/ZH/JA/KO만(승인분). 대만 律師 광고 규정: 승소율·결과 보장·최고/유일 금지, 과거 사건 서술 절제.
- **새 법률 주장은 만들지 않는다.** 기존 변호사 검수 콘텐츠(ko/en/ja/zh-hant 원문)의 사실만 재구성·재배치. 새 주장이 필요하면 `[변호사 검수 필요]`로 남기고 공개 금지.
- 가격·연락처·자격 등 사실은 기존 데이터 원본(site-content, attorney-profiles, pricing)과 일치해야 함.
- 같은 워크트리 두 작성자 금지. 워커는 격리 worktree. push=배치 단위, 라이브 재측정 필수.

## Done criteria (검증 가능)
- [x] **G1 감사** ✅사이클1: EN·JA 주요 표면(홈·업무분야·서비스 상세·변호사·프로필·요금·문의·칼럼 목록/상세·FAQ·가이드/랜딩) 1440/390 라이브를 대상 페르소나 관점(디자인·카피·신뢰신호·전환경로·현지 관습)으로 감사 → `docs/design/EN-JA-AUDIT-2026-09-23.md` (결함마다 증거 URL·측정값·원인 file:line·우선순위).
- [ ] **G2 조판·디자인 결함 0**: EN/JA에서 DS1/DS2급 시각 결함(줄바꿈·정렬·빈 띠·잘림·오버플로·대비) 라이브 측정 0 — 측정 스크립트 결과 첨부.
- [x] **G3 EN 홈·핵심 랜딩 영어권 적합화** ✅사이클8(히어로 CTA 위계는 X3b로 추가 개선): 히어로·오퍼·신뢰 신호·CTA가 E1/E2(미국 포함) 기준 카피로, 한국 고객용 직역 흔적 0(자동 스캔: 한국/Korean client 전제 문구 0), 라이브 확인.
- [x] **G4 JA 홈·핵심 랜딩 일본어 사용자 적합화** ✅사이클9(잔여: /ja/services/investment 한국 송금 절차 J15 = 변호사 검수): J1/J2 기준 카피·구성(日本語で直接相談・料金明示・対応業務), EN 대비 정보 밀도 격차 해소(단어/문자 수·내부링크 수 측정), 한국 고객 전제 0, 라이브 확인.
- [ ] **G5 전환 경로**: EN/JA 문의(이메일·폼) 경로가 각 언어로 완결(안내·준비물·응답 언어·시간대 표기), 전 단계 문구 현지어, 라이브 E2E(발송 제외) 확인.
- [ ] **G6 미국·일본 기업 타깃 진입점**: E2(미국 기업)·J1(日系企業)용 진입 페이지/섹션이 기존 검수 콘텐츠로 구성되어 홈·내비에서 도달 가능, 새 법률 주장 0.
- [ ] **G7 EN/JA 기술 SEO**: title/description/OG/hreflang/구조화데이터 inLanguage가 현지 쿼리 기준으로 정합(자동 점검 결과 첨부).
- [ ] **G8 배포·기록**: 각 배치 main push→Vercel success→라이브 재측정, 볼트·이 파일 Progress 갱신.

## Non-goals
- 유료 광고 집행·외부 발송·계정 가입(사용자 결정), 신규 언어, 한국어 트랙 재작업(회귀 방지만).

## Progress
- [사이클 0 · 2026-09-23 14:xx] GOAL 생성. 선행 자산: EN-JA-INFLOW-PLAN/COPY-KIT/MARKET-FACTS(9/2), WO-JA-1 JA 랜딩 재타깃(라이브), DS1(히어로 경로 버튼 EN editorial 포함)·DS2(ko 전용) 배포 `de1ab68f`.
- [사이클 1 · 2026-09-23 21:0x] **G1 완료**: 감사 에이전트 2(EN·JA, 읽기 전용) — EN 46경로×2뷰포트 22건, JA 23표면×2뷰포트·링크 613 31건 → `docs/design/EN-JA-AUDIT-2026-09-23.md`. 공통 핵심: EN/JA가 한국 고객용 사이트의 번역으로 읽힘(사례·팀·FAQ·한국 사무소 +82·저자박스·SEO칩), 영어 상담 주체 불명확(EN-01), 연락·시간대·요금 통화 정보 부재. 양호: 한글 잔존 0, 오버플로 0, JA 폰트 JP 글리프 정상, JA 홈 정보량 EN 동등 이상. WO-X2(새 사실 불필요 결함: JA 제목 auto-phrase·CTA 대비·초안 링크·푸터 링크·JA 용어/통화 통일·架構·EN title 길이) 워커 발주.
- [사이클 2 · 2026-09-23 22:0x] **WO-X2 검수·커밋 `f7026d8c`, main 병합 `50142e1c`**(미푸시): JA 제목 auto-phrase(390 끊김 3→0), CTA 대비 1.0→14.48, draft 미수금 링크 0, 푸터 링크 정상화(4로케일), JA 용어·통화 통일(就労許可 15→0, 投審会 8→0, 連絡事務所 9→0, TWD 23→0, 架構 9→0), EN title 46p ≤60자. 검수: 테스트 단언 −23/+33(전부 새 기대값 교체, 약화 0), 소스 diff 범위 내. 워커 게이트 typecheck·lint·build 0, vitest 기존 2건만 실패. → WO-X1 발주.
- [사이클 3 · 2026-09-23 22:4x] **배치 1 배포**: main 게이트(tsc 0·lint 0·build OK·vitest 12,891 통과, 실패 2=origin 기존) → push `873dde6f` → Vercel success → 라이브 재측정(`.design-audit/x2-live-verify.mjs https://tseng-law.com`): JA 제목 auto-phrase 끊김 0(ko keep-all 유지), CTA 대비 14.48, debt 링크 0, 푸터 200·0높이 앵커 0, EN title ≤60(/en 81→57), 오버플로 0·콘솔 에러 0. WO-X1 워커 진행 중.
- [사이클 4 · 2026-09-23 23:5x] 사용자 지시 "fable5.1이랑 토론해서 더 어떻게 작업할지 정하고 계속 작업, 일본어·한국어·영어 고객 더 받게" → Fable 5.1 토론 R1 기동(입장서 `.design-audit/debate/R1-FABLE.md`). X1 워커 vitest 단계.
- [사이클 5 · 2026-09-24 00:3x] **Fable 5.1 토론 종결(R1~R3, `.design-audit/debate/`)** — 합의: ①분모(유입) 실측 부재가 최대 문제(9/6 GSC /en 1클릭·39노출, /ja 0·10, 9/19 국가별 표 빈칸), 폼 제출 성공이 계측 안 됨 → **WO-M0 최우선**(발주됨, 서버측 `inquiry_submitted`). ②신규 URL 대신 기존 EN/JA 허브를 홈·내비로. ③G2 추가 투입 중단. ④SEO 정합(areaServed에 미국 없음 seo.ts:547, /ja/faq hreflang en 누락). ⑤Bookings 공개·사례 금액(4로케일 공통)은 사용자/변호사 결정. **확정 순서**: M0 → X1 배포(+IndexNow) → X4 SEO 정합 → X3a 진입·신뢰 띠(레인 무관: 히어로 직후 신뢰 띠, 해외기업/日系企業 블록, 내비 허브, Contracts 카드) → X5 폼 v2 → X6 稟議 PDF·EN one-pager(변호사 검수 1회) → X7 Bookings 조사(코드 0) → X3b 히어로 CTA(레인 결정 후).
- [사이클 6 · 2026-09-24 00:5x] **WO-X4 커밋 `677fbab6`**(areaServed +United States, 상담 언어 페이지 로케일 우선, /ja/faq hreflang en 제외는 noindex 정책대로 유지) · **WO-M0 커밋 `379531b5`**(서버측 `inquiry_submitted` PII 0, 재전송 1회, 공개 collect 위조 불가, visit-report ⑪ 로케일별). main 게이트 tsc 0·lint 0·build OK·vitest 12,945 통과(실패 4 = origin 기존 2 + stub-registry 부하 타임아웃 2, 단독 83/83) → push `b23c127c` → **Vercel 빌드 실패**: 코드 아님, `generateStaticParams`(/[locale]/lawyers/[slug]) 중 `Vercel Blob: Failed to fetch blob: 500`(인프라 일시 오류, Studio `vercel inspect --logs`로 확인). 라이브는 직전 배포 유지. 재배포 트리거.
- [사이클 7 · 2026-09-24 01:0x] **배치 2 라이브**(재배포 `b18b5b9d` Vercel success): areaServed 3로케일 모두 Taiwan·United States·South Korea·Japan, knowsLanguage /en en 첫째·/ja ja 첫째·/ko 불변 — curl 라이브 JSON-LD 확인. M0 `inquiry_submitted`는 실제 문의 발생 시에만 기록(테스트 제출은 사무소 실메일 발송이라 미실시) → 첫 실문의 후 `visit-report ⑪`로 확인 필요. G7 부분 충족(Person knowsLanguage English·EN 프로필 description은 X1).
- [사이클 8 · 2026-09-24 05:3x] **WO-X1 배포**: 워커 2회 스트림 정체 → 규약대로 재개 중단, Claude가 검증 마무리(tsc 0·lint 0·전체 vitest 실패 16파일을 단독 재실행 → 14 통과, 잔여 2 = origin 기존). 커밋 `5d97ff58`, main 병합 후 겹침 테스트 5파일 69 통과·tsc 0·build OK → push `5738521a` → Vercel success. 라이브(`.design-audit/x1-live-verify.mjs`, en/ja/ko × 13경로): EN 한국 전제 문구 12/13 페이지 0(잔여 1 = 헬스장 사례 칼럼 본문 사실), EN/JA tel:+82 0(ko 유지), Person knowsLanguage EN "English,Chinese,Korean,Japanese"·JA 「日本語」 첫째, 오버플로 0. JA 잔여 「韓国」은 언어 목록·한국 사무소 한 줄·한국 사무소 담당 소개·폼 선택지 = 의도, 예외 /ja/services/investment 한국 송금 절차(J15 변호사 검수). **발견**: /ko 프로필 Person 언어에 영어 없음(한국어·중국어·일본어) → 후속.
- [사이클 9 · 2026-09-24 07:xx] **WO-X3(a+b) 배포** `a35e0068` Vercel success. 리뷰에서 EN 리드 "He also consults" → **"She"** 정정(대표 변호사 여성, 766363b). 라이브(1440·390): ko/en/ja 히어로 CTA 4개(이메일 primary 첫째·경로 2·가이드), 신뢰 띠(Google 5.0·17 출처 링크·대만 변호사·4사무소·언어 페이지 언어 첫째), JA H1 「台湾の会社設立・労務・紛争を、日本語で。」+J1/J2 리드, EN 리드 영어 직접 상담·타이베이 또는 화상, h1=1, 오버플로 0. ko/zh 프로필 언어 영어 추가. **zh-hant 홈은 빌더 발행 문서(구 granular 히어로)가 렌더 — h1=2·신뢰 띠 없음·리드 「具備韓國、日本跨境實務經驗」(HOME-02 기존, 빌더 재발행 필요, 이번 목표 대상 외).**

## Open
- zh-hant 홈 빌더 발행본 노후(h1 2개, 코드 히어로 미반영) — 빌더 재발행 필요(사용자/빌더 레인).
- 후속: ko(및 zh-hant) 변호사 프로필 언어에 영어 추가(사용자 확정 사실, 4로케일 정합) — 다음 WO에 포함.
- **사용자 결정(2026-09-24 00:0x)**: 1 交流協会 등재 = **발송**(사용자 직접, Fable이 발송 패킷 작성 중 → `docs/marketing/SEND-READY-KORYU-2026-09-24.md`) · 3 AIT = **문의**(사용자 직접, `SEND-READY-AIT-2026-09-24.md`) · 5 home-paths 레인 = **인수**(미커밋 diff patch 보관 `~/tseng-home-paths-uncommitted-20260924.patch` sha256 3fc25454…, Studio 원본 무변경 → X3b 착수 가능) · 7 사례 금액 = **변호사 확인 대기**(현행 유지). 미결: 2 GBP 소유권, 4 Taipei 전화, 6 律師公會, 8 Bookings(X7 후).
- **사용자 결정 확정(2026-09-23 21:1x)**: ①증준외 변호사 영어 직접 상담 가능 ②EN/JA 한국 사무실 한 줄 축소(+82 tel·네이버 버튼 제외) ③연락은 확인된 사실만(국제형 번호·시간대·회신 언어, 기한 수치 금지) ④요금 NT$ 기준 안내만(환산 숫자 금지). → WO-X1 작성 완료(`.design-audit/WO-X1-2026-09-23.md`), X2 병합 후 발주(동일 데이터 파일 충돌 회피). 변호사 확인 대기: 소속 律師公会·등록(EN-13·J22), 비밀유지 문구(EN-14), 일본 측 이혼·조세 특칙(J03·J15), 미수금 draft 페이지 본문(EN-02). 히어로 CTA 재구성(EN-09·J10·J11)은 home-paths 레인 조율 후.
- **레인 주의(2026-09-23 20:3x, Mac Studio 실측)**: `~/Projects/tseng-law-home-paths-20260923` 브랜치 `fix/home-paths-layout-20260923`에 히어로 경로 버튼 CSS(globals.css `.hero … .en-home-paths` 블록, DS1-C) 미커밋 수정이 있음(14:17 이후 정지, 주체 미상). → 이 블록은 그 레인 소유로 보고 WO에서 제외. Grok `tseng-law-grok-goal-proxy`는 오프라인 ops 읽기 전용 목표(소스 무관). `design-unify`는 main 반영 완료.
