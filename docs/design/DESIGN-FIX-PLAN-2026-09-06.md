# tseng-law.com 디자인 수정 실행 계획 — 2026-09-06 (Fable 5.1, 세션 son7-df)

감사 정본: `DESIGN-AUDIT-2026-09-06.md`. 브랜치 `design/fable-audit-20260906`(base origin/main 3186ca60). 배포·push 없음(로컬 커밋까지).

## 설계 원칙
1. **한 가지 주색**: 행동 유도는 포레스트 그린(`--purple`=#16382d 계열) 하나. 네이비(#123b63)는 퇴출.
2. **문자 체계별 조판**: `keep-all`은 한국어 전용. 일본어·번체는 표준 줄바꿈 + `line-break: strict`, 제목은 `auto-phrase`(지원 브라우저).
3. **12px 바닥·AA 대비**: 본문 보조 텍스트 최소 12px, 대비 4.5:1 이상. 메타(날짜·읽기시간·전화)는 본문 산세리프 + tabular-nums.
4. **토큰 우선**: 새 리터럴 색 금지. 푸터·버튼·배지도 :root 토큰으로.
5. **타 레인 파일 회피**: `[[...slug]]/page.tsx`, `lib/builder/site/public-page.tsx`, guides/*, legal-pages.ts, ContactBlocks/HomeContactCta 구조는 건드리지 않음(CSS만). Header.tsx는 최소.
6. **점진적 향상**: JS 없이도 내용이 보여야 함(reveal).

## 워크아이템

| ID | 우선 | 제목 | 파일 | 배치 |
|---|---|---|---|---|
| WI-1 | P0 | JA/ZH 줄바꿈: `word-break: keep-all`을 ko 전용으로 스코프, ja/zh-hant는 `word-break:normal; line-break:strict; overflow-wrap:anywhere`(URL), 제목 `word-break:auto-phrase`(ja) | globals.css | 1 |
| WI-5 | P1 | 메타 대비·12px 바닥: `--text-caption`·`--gray-400` 텍스트 용도 토큰을 4.5:1 이상으로(새 `--text-meta`), 배지·날짜·읽기시간·브레드크럼·푸터 법적 링크 등 12px 미만 규칙을 12px 이상으로, `ui-monospace` 메타 → 본문 폰트+`font-variant-numeric: tabular-nums` | globals.css | 1 |
| WI-9 | P1 | 히어로 H1 굵기 4언어 통일(500~600)+영상 위 가독성 스크림/텍스트섀도, 죽은 `:root[data-locale]` 선택자 10개를 `.site[data-locale]`로 교정 | globals.css | 1 |
| WI-14 | P2 | 아이브로/섹션 라벨: CJK 로케일에서 letter-spacing 0.12em→0.04em, Hangul 자간 과다 제거 | globals.css | 1 |
| WI-2 | P1 | 주색 통일: `.hero-cta-primary`(L24350)·`.hero-media` 그라디언트(L1874)·푸터 이메일 링크(L4839·4864)·`.scroll-top` 네이비 → 토큰(`--purple`/`--purple-dark`/`--gold`) | globals.css | 2 |
| WI-8 | P1 | 홈 마감 CONTACT 밴드: 첫 버튼을 채움형 주 CTA, 나머지는 보조(고스트), 면책 문구 간격(`.home-contact-cta`, L4601~) | globals.css | 2 |
| WI-12 | P2 | 모바일: `.scroll-top` 토큰 색·본문 가림 완화(우하단 여백, 44px), 나타날 때 문서 높이 변화 제거, 유틸바 링크·FAQ 토글·푸터 법적 링크 탭 타깃 ≥40px | globals.css | 2 |
| WI-13 | P2 | reveal 점진적 향상: `.reveal{opacity:0}`를 `html.js .reveal`로 게이트, `<html>`에 beforeInteractive 인라인 스크립트로 `js` 클래스 부여, `@media print`에서 항상 표시 | globals.css, src/app/layout.tsx(또는 [locale]/layout.tsx) | 2 |
| WI-3 | P1 | 푸터 재스킨: 파치먼트 리터럴 → 미스트/포레스트 토큰, 링크 칼럼 제목-목록 간격(그리드 행 정렬) 정상화, 5열 줄바꿈 해결, 소셜 아이콘 aria-label·title, 법적 링크 탭 높이 | globals.css(.site-footer 블록), Footer.tsx(aria만) | 3 |
| WI-4 | P1 | 문의 페이지: `.messenger-card--email` 주 카드 스타일(면·테두리·이메일 강조·화살표 정렬), AI 접수 안내 박스 버튼을 보조 버튼 스타일로 정돈 | globals.css | 3 |
| WI-10 | P1 | 성장팀 `CorporateAdvisoryLink`(services 그리드 아래·pricing 리테이너 카드 안) 문단을 콜아웃 카드로 스타일(마크업 불변, CSS 훅은 부모 선택자로) | globals.css | 3 |
| WI-6 | P1 | 링크 어포던스: 본문/카드/프로필/미디어허브 안 `.link-underline`·기사 본문 a에 기본 밑줄(`text-decoration-color` 토큰)+호버 강화, 외부 링크 `target=_blank`에 시각 단서 | globals.css | 3 |
| WI-7 | P1 | 칼럼 본문 계층: H2 1.55rem/H3 1.2rem, 상단 여백 차등, 리스트·표 간격 | globals.css | 3 |
| WI-11 | P1 | 시네마틱 오프닝: 세션당 1회(sessionStorage), 눈에 보이는 '건너뛰기' 버튼(모바일 포함), 오프닝 중에도 헤더·skip-link를 a11y 트리에서 제거하지 않음 | CinematicOpening.tsx, cinematic-opening.test.tsx, globals.css(버튼) | 4 |

## 수용 기준 (로컬 빌드 + Playwright 프로브 `scripts/.fable-probe` 기준)
- WI-1: `/ja/services/investment`, `/zh-hant/services/investment` 본문 `p`의 computed `word-break`가 `keep-all`이 아님; `/ko/...`는 `keep-all` 유지. JA 본문 첫 8줄 중 `、・`로 끝나는 줄 비율 < 50%(캡처 비교).
- WI-5: `/en/columns`, `/en`(홈), `/ko/columns/*` 에서 가시 텍스트 최소 font-size ≥ 12px(facts 프로브 tinyTextCount=0), 메타 색 대비 ≥ 4.5:1(토큰 값 계산), `ui-monospace` 사용 요소 0.
- WI-9: 4언어 홈 `.hero-title` computed font-weight 동일(500 또는 600); globals.css에 `:root[data-locale` 0회.
- WI-2: `/ko`, `/en` `.hero-cta-primary` background가 헤더 CTA(`.header-cta` 등) background와 동일 토큰 색; globals.css `#123b63` 0회.
- WI-8: 홈 `.home-contact-cta` 첫 버튼이 채움형(배경≠투명), 나머지 고스트.
- WI-12: 390px에서 `.scroll-top` 크기 ≥ 44px, 표시 전후 `document.body.scrollHeight` 변화 0; 유틸바 링크 높이 ≥ 40px.
- WI-13: `curl` SSR HTML에 `html` 요소 `js` 클래스 부여 스크립트 존재, CSS에 `html.js .reveal`; JS 비활성 컨텍스트에서 `.reveal` opacity 1.
- WI-3: 푸터 링크 칼럼 제목 하단~첫 링크 상단 간격 ≤ 24px(1440), 5열이 브랜드 블록 아래로 줄바꿈되지 않음, 소셜 아이콘 `aria-label` 존재, globals.css `.site-footer` 블록 리터럴 색 ≤ 5.
- WI-4: `/en/contact` `.messenger-card--email` computed background ≠ transparent, border ≠ none.
- WI-10: `/en/services` 자문 문단 컨테이너 background ≠ transparent·padding ≥ 16px; `/en/pricing` 리테이너 카드 내 동일.
- WI-6: `/en/lawyers/wei-tseng` 채널 링크·`/en/columns/*` 본문 a의 `text-decoration-line`이 `underline`.
- WI-7: 칼럼 본문 H2 font-size > H3 font-size ≥ 1.15×본문.
- WI-11: 같은 컨텍스트에서 `/ko` 2회 방문 시 두 번째는 오프닝 미표시; 오프닝 중 `[data-skip]` 버튼 가시; `main`·`header`가 `aria-hidden`/`inert` 아님.
- 공통(M5): `npm run qa` 그린, `next build` 성공, 4언어×주요 페이지 수평 오버플로 0, 콘솔 오류 0.

## 보류·통보 (코드 범위 밖)
- 빌더 발행 KO/ZH: 섹션 min-height 빈 띠·375px 캔버스·8px 자동 축소·zh-hant 홈 발행본 노후 → DESIGN 레인(재발행) / 사용자.
- EN/JA privacy AI 초안 지시문 잔존 → 성장팀(legal-pages.ts 소유).
- About 배너 로고 타사명·초상 2종·309px 업스케일·미디어센터 영상 부재·칼럼 스톡 썸네일 → 자산/콘텐츠, 사용자 결정.
- 내비 IA(About/Contact 1차 메뉴 추가, 공개 'Log in' 숨김, 칼럼 명칭 통일) → 제품 결정+Header.tsx가 DESIGN 더티 파일이라 보류.
- 문의 페이지 동일 이메일 카드 4개·사무소 중복 블록 → ContactBlocks 구조(성장/기능 공유), 보류.
- ~9,000줄 관리자/스튜디오 CSS 공개 번들 포함·홈 영상 4개 15~17MB → 성능 리팩터, 별도 WO.
