# tseng-law.com 수리 계획서 (2026-07-21)

> 근거: `docs/audit/SITE-AUDIT-2026-07-21.md`
> 설계/검수: Claude Fable 5 · 구현: Codex gpt-5.6-sol (MCP, 맥북 `~/gh-harvest/tseng-law`)
> 원칙: 근본 원인 수리, 최소 변경, 스코프 밖 파일 금지, git add/commit은 검수 게이트 후 Fable이 수행

## 아키텍처 제약 (구현 전 필독)

1. **공개 페이지 전부가 빌더 발행 문서** — /ko, /contact, /lawyers, /pricing, /reviews 모두 `builder-pub-node` 527+개.
   콘텐츠(히어로 이미지·카피·연락 채널·변호사 카드)는 git 코드가 아니라 **빌더 문서(Blob/Postgres)**에 있음.
2. **맥북 클론에는 프로덕션 env 없음**(.env.example뿐) → 빌더 문서 변경은 "패치 스크립트 작성+dry-run"까지만.
   실행은 Studio(env 보유) 또는 사용자 승인 후. 전례: `scripts/align-page-to-live.mjs`, `scripts/apply-industry-homes.mjs`, `scripts/fix-proof-placeholder-copy.mjs`.
3. **Studio 미푸시 커밋 5개와 충돌 금지** — `src/app/sitemap.ts`, 검색엔진 verification 메타, 랜딩 타이틀, `docs/seo/**`, `content/columns*` 수정 금지.
4. QA 게이트: `npm run qa` (typecheck+lint+test:unit+security:builder-routes) + `BLOB_READ_WRITE_TOKEN= npm run build` (Blob 미접근 빌드 판정).

## WO-1: 코드 레벨 수리 패키지 (Codex, 즉시 구현)

**신뢰/정확성 (최우선)**
| # | 항목 | 근거 |
|---|---|---|
| 1-1 | 타이베이 사무소의 타이중 전화(04-2326-1862) 오게시 정정 — 사무소별 실번호가 데이터에 없으면 "대표전화(타이중 본소)"로 정확 라벨링, 타 사무소 번호 사칭 금지 | OfficeMapTabs.tsx:41,69 · site-content.ts:882,1611 |
| 1-2 | EN ko-상속 잔존 수리: 홈 통계 카운터·대표 영상 타이틀·서비스 details·인사이트 keywords 15건 영역 | site-content.ts:1866-1873,2199-2231,1993-2048 · insights-archive.ts:373-445 |
| 1-3 | en FAQ "영어 상담" 주장 → ko/zh와 일치("한국어·중국어")로 보수 정정 | faq-content.ts:220 |
| 1-4 | 손정민 중복 이메일(wei@) 노출 제거(실주소 확인 전까지 이메일 필드 비표시) | team-members.ts:72,144,216 |
| 1-5 | SSR `<html lang>` (ko/zh-Hant/en) — LocaleSetter 클라이언트 의존 제거 | app/layout.tsx:46 · LocaleSetter.tsx:8 |
| 1-6 | 로컬라이즈드 not-found.tsx(+global-error) — 브랜드 헤더/푸터, 3로케일, 404 title 중복 제거 | 라우트 트리 전체 |

**성능**
| # | 항목 | 근거 |
|---|---|---|
| 1-7 | next/font 전환(사용 패밀리/웨이트만, display swap) + 발행 페이지 이중 `<link>` 제거 | app/layout.tsx:50-53 · lib/builder/site/public-page.tsx:984-986 |
| 1-8 | favicon 최적화(169KB→≤32KB) | src/app/icon.png |

**a11y/UX**
| # | 항목 | 근거 |
|---|---|---|
| 1-9 | 푸터 링크 명도대비 4.5:1 이상 (Lighthouse 유일 실패) | 푸터 색 토큰 |
| 1-10 | YearEndEventPopup: 포커스 트랩/복원·aria-modal·스크롤락 + 콘텐츠 가림 완화(스크롤 시 축소 or 하단 고정) — MobileNavDrawer 패턴 참조 | YearEndEventPopup.tsx:137-178 |
| 1-11 | FloatingAiChat a11y: 라벨·접근명·라이브리전·aria-modal | FloatingAiChat.tsx:916,1036,1267-1341 |
| 1-12 | AiConsultationSection 폼 a11y: 라벨·required·aria-invalid·에러 공지 | AiConsultationSection.tsx:489,564-712 |
| 1-13 | 헤더 메가메뉴 aria-haspopup/expanded/controls | Header.tsx:495-519 |
| 1-14 | FAQAccordion 접힘 시 hidden (FaqPublicExplorer:235 방식) | FAQAccordion.tsx:65-72 |
| 1-15 | 전역 scroll-margin-top(스티키 헤더 가림) + 모바일 FAB/스크롤탑 스택 정리 | globals.css · ScrollTopButton.tsx |
| 1-16 | prefers-reduced-motion 리빌 폴백 | 리빌 유틸 |

허용 파일: 위 표의 명시 파일 + `src/app/**/not-found.tsx`(신규) + `src/app/**/global-error.tsx`(신규) + 폰트 설정 신규 파일 + `src/app/globals.css`(스코프 항목만) + 관련 신규/기존 테스트.
금지: `src/app/sitemap.ts`, verification 메타 코드, 랜딩 페이지 타이틀, `docs/seo/**`, `content/columns*`, `src/lib/builder/**`(1-7의 public-page.tsx 폰트 링크 제거 제외), `src/data/firm-introduction.ts`(변호사 검수 대기).

## WO-2: 발행 페이로드 다이어트 (Codex, 조사→구현)

- 증상: HTML ko 354KB / en 116KB / **zh-hant 1,692KB** (인라인 RSC 스크립트 846KB). 전 페이지 builder-pub-node 527+.
- **선행 조사 완료(Fable, flight 페이로드 디코드 분석)**:
  - **원인 1 — 칼럼 전문 임베드**: 홈 flight에 칼럼 아카이브 항목 34~48건의 메타(slug/summary/date/readTime...)와 **본문 전문**(단일 문자열 41KB/26KB/15KB/7KB…)이 실림. 캐러셀/아카이브 위젯이 발췌가 아닌 body 전체를 직렬화.
  - **원인 2 — zh-hant만 노드 트리가 클라이언트로 직렬화**: flight 내 `data-node-id` 노드 인스턴스 ko 9개 vs **zh-hant 420개**, style 키(width/height/minHeight/position...) 600~888회. zh 문서는 상위에서 클라이언트 컴포넌트 경계를 타서 서브트리 전체가 props로 flight에 실리는 구조(모션/인터랙티브 래퍼 의심). ko는 대부분 서버 렌더로 끝남.
  - 부차: 테마 CSS 26KB 문자열(T6766)이 flight에 인라인.
- 구현 방향: ① 칼럼류 위젯의 발행 데이터 매퍼에서 body/전문 필드 스트립(발췌+링크만) ② zh-hant 클라이언트 경계 하강(노드 트리를 서버에서 렌더하고 최소 props만 전달) ③ 인라인 CSS 중복 정리(여력 시).
- 성공 기준: zh-hant HTML < 400KB, ko < 200KB, **시각 회귀 0**(스크린샷 비교), `npm run qa` 그린.
- 주의: 빌더 데이터모델(BuilderCanvasNode)·발행 파이프라인 보존. 렌더 출력만 다이어트.

## WO-3: 빌더 문서 패치 스크립트 (Codex 작성 → Studio/사용자 실행)

단일 스크립트 `scripts/patch-live-content-2026-07-21.mjs` (전례 스타일, **--dry-run 기본**, 문서 백업 후 패치):
| # | 항목 | 감사서 | 패치 내용 |
|---|---|---|---|
| 3-1 | 상담 페이지 문의 수단 부재 | A1 | contact 문서에 채널 섹션 노드 삽입: KakaoTalk(`pf.kakao.com/_hojeong/chat`)·LINE(`lin.ee/hojeong`)·전화·이메일 버튼 (기존 `contact-page-content.ts` 값 재사용, 3로케일) |
| 3-2 | 히어로 모스크/성당 사진 | A3 | hero-bg 3장을 사용자 승인 이미지로 교체 (후보 목록 제시까지, 최종 선택=사용자) |
| 3-3 | 개발용 카피 노출 | C1 | 칼럼 섹션 부제 교체, "원문 페이지" 링크 노드 제거 |
| ~~3-4~~ | (WO-1 1-4로 이관: 손정민 이메일은 코드 데이터) | B1 | — |
| ~~3-5~~ | **철회** — 황승평 사진은 정상 렌더(lazy 캡처 아티팩트) | B1 | — |
| ~~3-6~~ | (WO-1b로 이관: lawyers 페이지는 코드 렌더) | C5/C6 | — |
| 3-7 | 홈 이미지 alt 5개 누락 | B5 | 문서 이미지 노드에 서술적 alt 주입 |
| 3-8 | EN 한국어 잔존 1,118자 | B2 | en 문서에서 한글 포함 텍스트 노드 추출→번역 대조표 생성(자동 번역 적용은 사용자 승인 후) |
| 3-9 | 이벤트 팝업 가림 | B7 | 팝업 위치/축소 동작 설정 변경(코드면 WO-1로 이동, 문서 설정이면 여기) |

## WO-1b: 팀 소개 후속 (Codex, WO-1 완료 직후 — 같은 작업트리 순차 실행)

[사용자 지시 2026-07-21] + 라이브 재검증 결과 반영:
| # | 항목 | 내용 |
|---|---|---|
| 1b-1 | **장방우 팀 등재** | `src/data/team-members.ts` 3로케일에 추가. ko: 장방우/법무전문원, zh-hant: 張芳瑀/法務專員, en: Chang Fang-Yu/Legal Specialist. email `fangyu@hoveringlaw.com.tw`, photo `/images/team/chang-fang-yu.jpg`(배치 완료), sourceUrl `https://www.wei-wei-lawyer.com/paralegalchang`. 소개: 여러 법률사무소 경력의 법무전문원, 소송 지원·기업 법무·외국인 투자 전담, 다수 한국 기업의 대만 법인설립·투자승인·행정절차 지원. 학력: 동해대학교(東海大學) 법학 학사. 경력: 보인 법률사무소 선임 법무전문원 → 무양국제 법률사무소 선임 법무전문원 → 법무법인 호정. 위치: 소속 변호사·직원 섹션 손정민 다음. zh/en 사무소명은 음차(Boin/Wuyang) 후 [변호사 검수 대기] 주석 |
| 1b-2 | "원문 페이지"(sourceUrl) 노출 제거 | lawyers 렌더 컴포넌트에서 sourceUrl 표시 제거(데이터 필드는 유지) |
| 1b-3 | lawyers 페이지 중복 헤딩·하단 과대 여백 | 히어로 밴드+본문 동일 제목 연속 2회 정리, 마지막 카드~푸터 공백 축소 |
| 1b-4 | [사용자 지시] **사무소 탭 순서 = 타이베이(메인) → 타이중 → 가오슝** + 타이베이 "지도에서 보기" 링크를 `https://maps.app.goo.gl/mULpyAnQGz3M1GoQ6` 로, 임베드 좌표는 25.0510767,121.5173077 (플레이스: 昊鼎國際法律事務所 台北所) | `OfficeMapTabs.tsx` + `site-content.ts` offices 배열(3로케일 전부), 홈/contact 공용 |
| 1b-6 | [사용자 지시] **헤더 로고 마크 오용 수정** — `Header.tsx:188`·`MobileNavDrawer.tsx:121`이 40×40 `.logo-mark` 박스에 가로형 락업(`hovering-logo-ko.png` 508×80, 인장+글자 통합)을 넣어 인장이 파비콘처럼 짓눌려 보임. 정사각 인장 `/images/brand/hovering-seal-red-512.png`(로케일 무관)으로 교체, 옆의 텍스트 브랜드명은 유지. width/height 속성 40×40 정합. (참고: 파비콘 파일 자체는 정상 인장 — icon.png는 WO-1 1-8 압축만) | `Header.tsx`, `MobileNavDrawer.tsx` |
| 1b-5 | [사용자 지시] **한국 사무실 추가(4번째 탭)** — 명칭 "대만 사업 컨설팅 사무실", 주소 "경기도 양주시 옥정동로 177 수현프라자 4층", 지도는 **네이버 지도 링크**(`https://map.naver.com/p/search/` + 인코딩 주소, 버튼 라벨 "네이버 지도에서 보기") — 구글 임베드 대신 주소 카드+네이버 링크. zh: 台灣商務諮詢辦公室(韓國·楊州), en: Taiwan Business Consulting Office (Yangju, Korea), 주소 로마자 "4F, Suhyeon Plaza, 177 Okjeongdong-ro, Yangju-si, Gyeonggi-do". 전화는 데이터에 한국 번호 존재 시(+82-10-2992-9304, contact-page-content.ts) 사용 | 동일 파일 |

| 1b-8 | [사용자 지시] **AI 상담 FAB 일단 제거(비노출)** — 근거: 모바일에서 `.floating-ai-chat` 패널이 **고정 500px 폭 흰 시트**로 열려 390px 뷰포트를 110px 초과("옆에 흰 페이지" 증상), FAB이 엄지 경로라 오탭 빈발. 구현: 플래그(예: `NEXT_PUBLIC_ENABLE_AI_CHAT`, 기본 false)로 FloatingAiChat FAB 렌더 차단 — 코드는 보존(재활성 대비). 함께 패널 폭 `min(500px, 100vw)` 클램프 수정. 히어로 AI 검색창·contact의 AiConsultationSection은 유지 | `FloatingAiChat.tsx` + 렌더 위치 |
| 1b-7 | [사용자 지시] **메인 내비 "고객후기" 탭 → "오시는길" 교체** — `site-content.ts:232`(ko)·`:955`(zh)·`:1687`(en)의 nav 항목을 오시는길(각 로케일 기존 상단바 라벨 재사용: 오시는 길/交通位置 계열/Directions)으로 교체, href는 `/{locale}/contact#offices`. `/reviews` 라우트·페이지 자체는 유지(내비에서만 제거), 푸터 링크 잔존 여부 확인 후 유지 | `site-content.ts` |

## 사용자 결정 대기 (구현 불가 항목)

1. 히어로 교체 이미지 최종 선택 (3-2) — Codex가 후보 나열, 결정은 사용자
2. 손정민 실제 이메일 주소 (3-4)
3. 변호사 4인 통일 사진 게시 — 별도 트랙(당사자 확인 대기, `~/Desktop/tseng-law-photo-samples-20260721/`)
4. zh-hant h1 "以韓語清楚說明台灣法律。" 포지셔닝 (C8)
5. Kakao 채널 `_hojeong` 실존/개설 여부 확인
6. git push — gh 재인증 필요 (Studio 미푸시 5커밋 포함 머지 순서 조율)
7. **대표변호사 한자 표기 혼용** — Google 비즈니스 "曾雋崴" vs 칼럼 본문 "曾俊瑋" vs firm-introduction.ts "王鼎翔"(별개 인물 기재 의심). 정본 확정 필요(변호사 확인)
8. 네이버 지도 **플레이스 신규 등록**(스마트플레이스, "대만 사업 컨설팅 사무실")은 사업자 인증 필요 — 사이트에는 검색 링크로 연결, 플레이스 등록은 사용자 작업

## 검수 게이트 (커밋 전, Fable)

① diff 리뷰(허용 파일 준수) ② `npm run qa` 그린 ③ `BLOB_READ_WRITE_TOKEN= npm run build` 성공 ④ WO-2는 로컬 렌더 스크린샷 vs 라이브 비교 ⑤ WO-3 스크립트는 dry-run 출력 검토만(실행 금지)
