# tseng-law.com 사이트 종합 감사서 (2026-07-21)

> 감사 주체: Claude Fable 5 (라이브 실측 + Lighthouse + DOM 검증 + 코드 대조)
> 대상: https://tseng-law.com (ko / zh-hant / en) — origin/main adc0c45 배포본
> 방법: Chrome DevTools 실브라우저 계측(1440px/390px), Lighthouse(mobile), fetch 전수 링크 체크, DOM/SSR HTML 분석
> 증거 스크린샷: `~/.cache/tseng-audit-20260721/` (맥북)

## 총평

디자인 시스템 자체는 상급(딥그린+골드+크림, 세리프 디스플레이, 에디토리얼 톤 — 법률 도메인에 적합).
SEO 기술층도 우수(Lighthouse SEO 100, BP 100, A11y 97 / canonical·hreflang 4종·JSON-LD 5종·칼럼 Article+FAQPage).
**치명 결함은 전환 퍼널과 성능 아키텍처에 있음**: 상담 페이지에 실제 문의 수단이 없고,
zh-hant 홈 HTML이 1.7MB이며, 히어로가 브랜드와 무관한 이스탄불 모스크 사진이다.

## 실측 지표

| 항목 | 측정값 | 기준 | 판정 |
|---|---|---|---|
| Lighthouse A11y / BP / SEO (mobile) | 97 / 100 / 100 | 90+ | ✅ (실패 1: 푸터 링크 명도대비) |
| HTML 문서 크기 ko / en / zh-hant | 354KB / 116KB / **1,692KB** | <100KB 권장 | 🔴 zh-hant 치명 |
| 홈 총 전송량 (데스크톱) | 2.46MB / 69요청 | <1.5MB | 🟡 |
| 히어로 배경 3장 | 609+250+153KB, next/image 미적용 원본 경로 | LCP<2.5s | 🔴 |
| Google Fonts CSS | 389KB 렌더블로킹 (IBM Plex Sans KR 5웨이트) | next/font 셀프호스트 | 🟡 |
| favicon icon.png | 166KB | <10KB | 🟡 |
| DOMContentLoaded / load (데스크톱 브로드밴드) | 3.1s / 3.5s | <2s | 🟡 |
| 내부 링크 상태 | 40/40 전수 200 OK | 깨진 링크 0 | ✅ |
| 404 처리 | status 404 + 전용 페이지 | | ✅ |

## 발견 사항 (심각도순)

### P0 — 전환·성능 치명

**A1. 상담 페이지(/ko/contact)에 실제 문의 수단이 없다.**
- 실측: form 0개, `mailto:` 0개, 카카오톡/LINE 링크 0개. `tel:` 1개뿐.
- 본문 텍스트는 "카카오톡, LINE, 이메일, 전화로 문의를 접수할 수 있습니다"라고 **안내만** 하고 버튼/링크/ID가 없음.
- 헤더 CTA "상담 문의"가 이 막다른 페이지로 연결 → 전 사이트의 전환 퍼널이 끊겨 있음.

**A2. zh-hant 홈 HTML 1.7MB — 빌더 발행 페이로드 비대.**
- 실측: 인라인 스크립트 846KB+173KB = RSC flight 데이터에 빌더 캔버스 노드 트리(`builder-pub-node`) 전체 직렬화.
- ko 354KB, en 116KB 대비 zh-hant 1,692KB (약 5~15배) — zh-hant 빌더 문서에 중복/과잉 노드 의심.
- 모바일 3G/4G에서 zh-hant 첫 로드 수 초~십수 초. ko도 354KB로 권장치 3배.

**A3. 히어로 배경이 브랜드와 무관한 종교 건축 스톡사진.**
- hero-bg 로테이션 3장: 이스탄불 모스크 외관(아랍어 캘리그라피 노출)·유럽 성당 돔 등.
- 대만 법률 서비스와 연관 0. 한국 고객 신뢰 관점에서 오인 소지. (푸터의 한국+대만 스카이라인 일러스트가 오히려 정확한 브랜드 방향)

### P1 — 신뢰·품질 주요 결함

**B1. 변호사소개(/ko/lawyers) 신뢰 요소 훼손.**
- 손정민(한국 사무장) 이메일이 증준외 대표와 동일한 `wei@hoveringlaw.com.tw` — 복붙 오류 의심 (확인 필요: 실제 주소).
- 사진 배경·조명·크롭 제각각 (통일 스튜디오컷 프로젝트 별도 진행 중 — 코드 범위 아님).
- ~~황승평 카드 사진 빈 박스~~ → **철회**: 실스크롤 검증 결과 정상 렌더(lazy-load + 풀페이지 캡처 아티팩트). 이미지 200 OK.
- 카드 img가 `w=3840` 요청(sizes 과대) — 마이크로 최적화 여지만 있음.
- [사용자 지시 2026-07-21] **장방우(張芳瑀, 법무전문원) 미등재** — wei-wei-lawyer.com/paralegalchang 프로필 기준 추가 필요. 본인 이메일 fangyu@hoveringlaw.com.tw 보유. 사진 확보·배치 완료(`public/images/team/chang-fang-yu.jpg`).

**B2. EN 페이지에 한국어 1,118자 잔존** — 미번역 문자열이 영어 페이지에 노출.

**B3. SSR `<html>`에 lang 속성 없음** — 하이드레이션 후에만 lang 설정됨. 스크린리더/SEO 초기 파싱 결함.

**B4. 푸터 링크 명도대비 WCAG AA 미달** — Lighthouse 유일 실패 항목 (privacy/disclaimer/accessibility/sitemap/언어 링크).

**B5. 홈 이미지 10개 중 5개 alt 없음.**

**B6. 웹폰트 전략** — Google Fonts 외부 CSS 389KB 렌더블로킹. next/font 셀프호스트 미적용 → FOUT/CLS 위험.

**B7. 이벤트 팝업("2026년 기념 리뷰 이벤트")이 스크롤 내내 콘텐츠를 덮음** — 칼럼 리스트 등 본문 가림. 모바일에서 더 치명적.

### P2 — 디자인 완성도

**C1. 개발용 문구가 고객 화면에 노출.**
- 홈 칼럼 섹션 부제: "실제 수집된 칼럼 본문과 이미지를 기반으로 주요 글을 바로 확인할 수 있습니다." (구현 설명문이지 마케팅 카피가 아님)
- 변호사 카드 내 "원문 페이지" 링크 — 내부 소스 참조 노출.

**C2. 히어로 CTA 위계 역전** — 히어로의 유일한 CTA가 "호정칼럼 보기"(정보성). 법률 사이트의 1차 CTA는 상담이어야 함. 모바일에서는 AI 검색창이 폴드에 반쯤 잘림.

**C3. 스티키 헤더가 앵커 이동 시 섹션 제목을 가림** — scroll-margin-top 미설정.

**C4. 모바일 플로팅 버튼 겹침** — "AI 상담" FAB + 스크롤탑 버튼이 본문 텍스트를 가림.

**C5. 변호사소개 페이지 제목 이중 표기** — 히어로 밴드와 본문에 "호정 한국·대만 업무팀" 연속 2회 + 마지막 카드~푸터 사이 대형 공백.

**C6. 상담 페이지 섹션 사이 과대 여백** (~600px 데드스페이스).

**C7. 404 페이지 title 중복** — "법무법인 호정 (昊鼎國際法律事務所) | 법무법인 호정".

**C8. zh-hant h1 "以韓語清楚說明台灣法律。"** — 중화권 방문자에게 "한국어로 설명" 가치제안이 적절한지 콘텐츠 재검토 필요 (자동 수정 금지, 사용자 판단).

### P3 — 견고성

**D1. 스크롤 리빌 애니메이션 의존** — IntersectionObserver 발화 전 opacity:0 (풀페이지 캡처/JS 실패 시 콘텐츠 비표시). prefers-reduced-motion 미대응 의심.

**D2. 공개 상단바에 "로그인" 노출** — /ko/login 200. 의도 여부 확인 (관리자 진입점이면 노출 불필요).

## 코드 감사 추가 발견 (파일:라인 — Explore 에이전트 교차검증)

### P0/P1 추가
- **E1. 타이베이 사무소가 타이중 전화번호(04-2326-1862)를 게시** — `src/components/OfficeMapTabs.tsx:41,69`, `src/data/site-content.ts:882,1611`. 04=타이중 지역번호, 타이베이=02. 방문자가 엉뚱한 사무소로 전화. (가오슝 07-557-9797은 정상)
- **E2. `<html lang>` SSR 누락의 원인** — `src/app/layout.tsx:46` + 클라이언트 `components/LocaleSetter.tsx:8`(useEffect)에서만 설정.
- **E3. EN 한국어 잔존의 근본원인 = `buildEnglishSiteContent` ko 자동상속** — en이 미정의 필드를 한국어로 상속: 홈 통계 카운터(`site-content.ts:1866-1873` — "년 경력/처리 사건/사무소/개국어 지원"), 대표 영상 타이틀(`:2199-2231`), 서비스 카드 details 전체 탈락(`:1993-2048`), 인사이트 keywords 15/18 한국어(`insights-archive.ts:373-445`).
- **E4. 발행 페이지가 Google Fonts `<link>` 이중 로드** — 루트 `app/layout.tsx:50-53`(7패밀리) + `lib/builder/site/public-page.tsx:984-986`.
- **E5. 공개 콘텐츠 16페이지 `force-dynamic`** — CDN/정적 캐시 전무, 매 히트 서버 렌더+Blob 읽기 → DCL 3.1s의 구조 원인.
- **E6. not-found/global-error 경계 부재** — 라우트 트리에 `not-found.tsx` 없음 (라이브 404는 브랜드 타이틀이 보이므로 폴백 경로 검증 후 명시적 로컬라이즈드 404 추가).
- **E7. FloatingAiChat a11y 다발** — 인테이크 입력 라벨 없음(`:1267-1286`), 메인 입력(`:1322`), 전송 버튼 접근명 없음(`:1341`), 에러 미공지(`:1295`), 메시지 로그 라이브리전 아님(`:1036`), dialog에 aria-modal/스크롤락 없음(`:916`).

### P2 추가
- 이벤트 팝업 = 코드 컴포넌트 `components/YearEndEventPopup.tsx:137-178` — 포커스 트랩/복원 없음, `aria-modal="false"`, 스크롤락 없음.
- 헤더 메가메뉴 트리거 aria-haspopup/expanded/controls 없음 — `components/Header.tsx:495-519`.
- FAQAccordion 접힌 답변이 hidden 아님(a11y 트리 잔존) — `components/FAQAccordion.tsx:65-72` (참조 구현: `faq/FaqPublicExplorer.tsx:235`).
- AiConsultationSection 폼 라벨/aria-invalid/에러 공지 누락 — `components/consultation/AiConsultationSection.tsx:489,564-712`.
- zh-hant 법인소개 문단 5개(ko/en 7개)+**다른 변호사명(王鼎翔) 기재** — `data/firm-introduction.ts:37-43` (변호사 검수 필요).
- en 로고가 한국어판 재사용 — `firm-introduction.ts:63`.
- 손정민 이메일 중복의 원천 — `data/team-members.ts:72,144,216`.
- en FAQ "한국어·중국어·영어 상담" vs ko/zh "한국어·중국어" 불일치 — `data/faq-content.ts:220` vs `:74,:147`.
- 준비중 상태 불일치(세미나/뉴스레터 en만 라이브 표시) — `site-content.ts:487-489,761-770,1948,2186-2194`.
- 타이중 주소 층수 표기 의심(號와 樓 사이 숫자 누락) — `OfficeMapTabs.tsx:23`.
- globals.css 22,502줄 단일 렌더블로킹 시트.
- sitemap에 /reviews 누락 — `app/sitemap.ts:13-31` (⚠️ Studio 미푸시와 충돌 — 이번 스코프 제외, Studio 머지 후 처리).

### 루브릭 대조 추가 갭 (전문가 기준 리서치)
- 모바일 스티키 클릭투콜/상담 바 부재 (법률 검색 60%+ 모바일)
- 응답시간 약속 문구("X시간 내 회신") 부재 — 최초 응답자가 수임 승자
- 인테이크 폼 자체 부재 (권장 3~5필드)
- INP<200ms 위험 — 페이지당 빌더 노드 527+ 하이드레이션 (WO-2에서 계측)

## 잘 되어 있는 것 (건드리지 말 것)

- 칼럼 상세: Article+FAQPage JSON-LD, 시맨틱 slug, 제목 구조 — SEO 캠페인 산출물 우수
- 구조화 데이터 전반(`lib/seo.ts`): WebSite/Organization/LegalService/Article/Person/ProfilePage/BreadcrumbList/CollectionPage/FAQPage/HowTo + hreflang/canonical 정확
- 상담 제출 API(`api/consultation/submit`): rate-limit·멱등성·단계 로깅·검증·이메일 실패 시 DB 보존 — 견고
- robots.ts 프리뷰 차단·noindex 수집, next/image 사실상 전면 적용, OG/Twitter 카드 정상
- MobileNavDrawer·SearchOverlay = 모달 a11y 모범 구현(팝업 수리 시 참조)
- 내부 링크 무결성 100%, 푸터 한국+대만 스카이라인 일러스트, 다크모드 토큰

## 부록: Studio 미푸시 커밋과의 스코프 경계

Studio 작업본(100.98.71.46)에 미푸시 커밋 5개(sitemap lastmod·검색엔진 메타태그 env·네이버 소유확인 파일·칼럼 C1~C4·SEO 보드) 존재.
**본 감사 후속 구현은 다음 파일을 건드리지 않는다**: `app/sitemap.ts`, 검색엔진 verification 메타 코드, 랜딩 타이틀, `docs/seo/**`, `content/columns*` 신규 추가.
(레이아웃 파일은 lang 속성 수정으로 접점 가능 — 머지 시 주의)
