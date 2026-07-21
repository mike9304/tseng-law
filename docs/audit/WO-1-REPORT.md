# WO-1 + WO-1b 완료 보고서

- 작업일: 2026-07-21
- 작업 방식: 중단된 WO-1 워킹트리를 보존한 채 항목별 diff를 재검수하고, 미완 부분과 WO-1b를 이어서 구현
- Git 조작: `git add`, `git commit`, `git push` 모두 실행하지 않음

## WO-1 상태

| 항목 | 상태 | 구현·판정 근거 |
|---|---|---|
| 1-1 | 완료 | 타이베이 전화는 `대표전화(타이중 본소)`로 명확히 표기하고, 가오슝은 `07-557-9797`을 유지했다. 3개 로케일 데이터 테스트 통과. |
| 1-2 | 완료 | 영문 통계, 대표 영상, 서비스 상세, 인사이트 키워드의 한국어 상속 잔존을 영문화했다. 영문 17개 인사이트 및 대상 영역 회귀 테스트 통과. |
| 1-3 | 완료 | 영문 FAQ 상담 언어 주장을 한국어·중국어로 제한했다. |
| 1-4 | 완료 | 손정민 이메일을 3개 로케일에서 비표시 처리하고 대표변호사 이메일은 유지했다. |
| 1-5 | 완료 | 미들웨어가 요청 pathname을 내부 헤더로 전달하고 루트 레이아웃이 SSR `<html lang>`을 `ko`/`zh-Hant`/`en`으로 결정한다. 공개·빌더 로케일 레이아웃의 `LocaleSetter` 삽입을 제거했다. 프로덕션 빌드 요청 핸들러에서 3개 로케일 모두 확인했다. |
| 1-6 | 완료 | 3개 로케일용 `[locale]/not-found.tsx`와 브랜드형 `global-error.tsx`를 추가하고 404 제목 중복을 피했다. |
| 1-7 | 완료 | `next/font` 로컬 변수를 적용하고 전역 Google Fonts 링크와 발행 페이지의 중복 폰트 링크를 제거했다. 금지 경로인 `public-page.tsx` 변경은 계획서가 허용한 폰트 링크 제거만 포함한다. |
| 1-8 | 완료 | `src/app/icon.png`를 128×128, 23,519 bytes로 최적화했다(32 KiB 이하). |
| 1-9 | 완료 | 푸터 법적·로케일 링크 명도 대비를 4.5:1 이상으로 조정하고 계산 테스트를 추가했다. |
| 1-10 | 완료 | 연말 팝업에 dialog semantics, 포커스 트랩·복원, 스크롤 잠금, 축소 상태를 구현했다. |
| 1-11 | 완료 | Floating AI Chat에 dialog/log/live region, 입력·전송 접근명, 오류 live region, 스크롤 잠금을 적용했다. |
| 1-12 | 완료 | 상담 섹션 입력 접근명, required/invalid/describedby, 제출 오류 live region을 적용했다. |
| 1-13 | 완료 | 데스크톱 mega-menu trigger/panel에 `aria-haspopup`, `aria-expanded`, `aria-controls`, 대응 panel id를 연결했다. |
| 1-14 | 완료 | 닫힌 FAQ 답변을 `hidden` 처리해 접근성 트리에서 제외했다. |
| 1-15 | 완료 | sticky header용 anchor scroll margin과 모바일 FAB/scroll-top 안전 스택을 적용했다. |
| 1-16 | 완료 | reduced-motion 환경에서 reveal/stagger 콘텐츠가 즉시 보이도록 lifecycle과 CSS를 보강했다. |

## WO-1b 상태

| 항목 | 상태 | 구현·판정 근거 |
|---|---|---|
| 1b-1 | 완료 | 장방우/張芳瑀/Chang Fang-Yu의 3개 로케일 프로필, 이메일, 사진, 소개, 학력, 경력을 `team-members.ts`에 추가하고 공개 팀 배열에서 손정민 다음에 삽입했다. Boin/Wuyang 음차 검수 대기 주석을 유지했다. 기존 빌더 고정 좌표 seed는 금지 경로를 건드리지 않도록 공개 렌더 helper에서 합성한다. |
| 1b-2 | 완료 | `sourceUrl` 데이터는 보존하면서 공개 프로필의 원문 페이지 링크·라벨을 제거했다. 빌드 응답에서 `원문 페이지` 비노출 확인. |
| 1b-3 | 완료 | lawyers 본문 중복 intro heading을 끄고, 페이지 root의 고정 높이와 마지막 카드 뒤 과대 여백을 축소했다. |
| 1b-4 | 완료 | 3개 로케일 사무소 순서를 타이베이→타이중→가오슝으로 통일했다. 지정 타이베이 지도 링크와 좌표 `25.0510767,121.5173077`을 적용했다. |
| 1b-5 | 완료 | 4번째 양주 탭을 3개 로케일로 추가했다. 한국 주소 카드, `+82-10-2992-9304`, 네이버 주소 검색 링크와 `네이버 지도에서 보기` 버튼을 제공하며 Google iframe은 렌더하지 않는다. |
| 1b-6 | 완료 | 데스크톱·모바일 헤더의 40×40 로고 마크를 정사각 인장 `/images/brand/hovering-seal-red-512.png`로 교체했다. |
| 1b-7 | 완료 | 주 내비 마지막 항목을 3개 로케일의 오시는길/交通位置/Directions와 `/{locale}/contact#offices`로 교체했다. `/reviews` 라우트는 삭제하지 않았다. 빌드 응답에서 오시는길 노출과 고객후기 주 내비 비노출을 확인했다. |
| 1b-8 | 완료 | `NEXT_PUBLIC_ENABLE_AI_CHAT === 'true'`일 때만 AI FAB을 렌더하도록 기본 비노출 처리하고 코드는 보존했다. 패널 폭은 `min(500px, 100vw)`와 viewport max-width로 제한했다. 히어로 검색 및 contact 상담 섹션은 유지했다. |

## 변경 파일

### 애플리케이션·스타일

- `src/app/layout.tsx`
- `src/app/fonts.ts` (신규)
- `src/app/global-error.tsx` (신규)
- `src/app/[locale]/not-found.tsx` (신규)
- `src/app/[locale]/layout.tsx`
- `src/app/(builder)/[locale]/layout.tsx`
- `src/app/[locale]/(legacy)/legacy-page-bodies.tsx`
- `src/app/globals.css`
- `src/app/icon.png`
- `src/lib/builder/site/public-page.tsx` (허용된 폰트 링크 제거만)
- `src/middleware.ts`

### 컴포넌트·데이터

- `src/components/AttorneyProfileSection.tsx`
- `src/components/FAQAccordion.tsx`
- `src/components/FloatingAiChat.tsx`
- `src/components/Header.tsx`
- `src/components/MobileNavDrawer.tsx`
- `src/components/OfficeMapTabs.tsx`
- `src/components/QuickContactWidget.tsx`
- `src/components/YearEndEventPopup.tsx`
- `src/components/consultation/AiConsultationSection.tsx`
- `src/data/faq-content.ts`
- `src/data/insights-archive.ts`
- `src/data/site-content.ts`
- `src/data/team-members.ts`

### 테스트·보고

- `src/middleware.test.ts`
- `src/components/__tests__/reveal-lifecycle.test.ts`
- `src/components/__tests__/site-remediation-a11y.test.tsx` (신규)
- `src/data/__tests__/site-remediation-content.test.ts` (신규)
- `docs/audit/WO-1-REPORT.md` (신규)

`public/images/team/chang-fang-yu.jpg`는 작업 시작 시 이미 존재하던 untracked 입력 자산으로 보존했다. `docs/audit/REMEDIATION-PLAN-2026-07-21.md`와 `docs/audit/SITE-AUDIT-2026-07-21.md`도 입력 문서로 보존하고 수정하지 않았다.

## 검증 결과

### 전체 QA

명령: `npm run qa`

- 종료 코드: `1`
- `typecheck`: 통과
- `lint`: 오류 0, 기존 경고만 출력
- Vitest: `870 passed / 1 failed` test files (`871` total)
- Tests: `6090 passed / 1 failed / 14 skipped` (`6105` total)
- 유일한 실패:
  - `src/lib/builder/security/__tests__/qa-runtime-attestation.test.ts`
  - `normalizes macOS-style ancestor aliases but rejects a symlink TMPDIR leaf`
  - 원문 요약: `QA runtime attestation: canonical audit root must be an existing real directory.`
- 위 실패는 계획서가 허용한 TMPDIR symlink 환경성 사전 실패와 정확히 일치한다. 그 외 신규 실패는 0이다.
- QA가 unit 단계에서 종료되어 연쇄 명령의 마지막 보안 검사는 별도 실행했다.

명령: `npm run security:builder-routes`

- 종료 코드: `0`
- 원문 요약: `Checked 279 builder route file(s); 273 mutation handler(s) have guard coverage.`
- 주석 allowlist mutation handler 경고: 4개

### 집중 회귀

명령:

```text
npx vitest run src/middleware.test.ts src/data/__tests__/site-remediation-content.test.ts src/components/__tests__/site-remediation-a11y.test.tsx src/components/__tests__/reveal-lifecycle.test.ts
```

- 종료 코드: `0`
- Test files: `4 passed`
- Tests: `44 passed`

장방우/양주 데이터를 빌더 고정 레이아웃과 분리한 뒤 관련 빌더 회귀 4개 파일도 별도 실행해 `41 passed`를 확인했다.

### 프로덕션 빌드

명령: `BLOB_READ_WRITE_TOKEN= npm run build`

- 종료 코드: `0`
- Next.js `14.2.35` optimized production build 성공
- 정적 페이지 생성: `427 / 427`
- 기존 lint/autoprefixer 경고는 남았으나 build error는 0이다.

### `<html lang>` 및 빌드 응답

일반 TCP 및 loopback start 시도:

```text
npm run start -- -p 43127
npm run start -- -H 127.0.0.1 -p 43127
```

두 시도 모두 이 실행 샌드박스의 socket listen 제한으로 `listen EPERM`이 발생했다. Unix socket도 같은 `EPERM`이어서 실제 `curl | grep`은 실행할 수 없었다.

대신 동일한 `.next-build` 프로덕션 Next 요청 핸들러에 Node HTTP mock request/response를 직접 주입해 응답 HTML을 검사했다. 결과:

```text
/ko status=200 html-lang=ko
/zh-hant status=200 html-lang=zh-Hant
/en status=200 html-lang=en
```

추가 응답 점검:

```text
/ko: 오시는길=true, 고객후기 주 내비=false, AI FAB=false
/ko/lawyers: 장방우=true, 원문 페이지=false
/ko/contact: 양주 사무실=true, 지정 타이베이 지도 링크=true
```

### 범위·워크트리

- `git diff --check`: 통과
- 금지 파일 변경 없음. 예외 허용된 `src/lib/builder/site/public-page.tsx`는 Google Fonts 중복 링크 제거만 포함한다.
- `src/middleware.ts`는 `x-tseng-pathname` request header 전달만 추가했으며 기존 인증·redirect 판단은 바꾸지 않았다.
- 브라우저 GUI/스크린샷 및 live production 검증은 이번 샌드박스에서 실행하지 않았다.
- staging, commit, push는 실행하지 않았다.
