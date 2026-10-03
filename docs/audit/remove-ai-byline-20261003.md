# 공개 AI 작성자 표기 제거 — 2026-10-03

## 사용자 요청과 범위

사용자 요청: “tseng-law.com 의 모든 글에 ai 가 적은건 ai 법률 어시스턴트가 적었다고 적혀있는데, ai 법률 어시스턴트가 적었다는거 지우자 글은 그대로 두고”. 이 요청은 기존 AGENTS/EDITORIAL-VOICE의 AI 작성자 공개 표기 유지 지침보다 우선한다.

- 홈·칼럼 목록·칼럼 상세·이슈 목록/상세·교통사고 목록의 AI 작성자 이름·작성 헤딩·아바타를 제거했다.
- AI 작성 글의 Article JSON-LD author 및 목록 schema의 AI 작성자 꼬리말을 생략했다. 실제 변호사 작성 글의 이름·링크·Person schema는 유지했다.
- AI 작성자 상자에 있던 일반정보/개별 법률자문 아님 안내는 9개 언어와 기존 영어 fallback을 유지하는 평문 안내로 남겼다.
- 반도체 안내 소개문에서 AI 작성 및 글마다 작성자 표시 주장을 제거했다. 공개 자료를 바탕으로 한다는 설명은 유지했다.
- `author: legal-ai-assistant`, AI 작성 판별과 내부 provenance는 보존한다. AI 작성 글이 변호사 작성·검수로 대체 표기되지 않는다.
- 법률 본문·제목·요약·FAQ·출처·숫자·날짜·멀티미디어 AI 생성 캡션은 변경 대상이 아니다. 본문 안에 직접 삽입된 AI 작성자 문구는 별도 콘텐츠 레인의 한정 변경 대상이며, 주변 실질 내용과 면책은 그대로 보존한다.

## 원인과 수정

공개 표기는 공통 작성자 사전과 JSX/UI, Article JSON-LD에서 생성되었다. `isAiAuthoredColumn`을 유지하면서 해당 표시만 생략하고, 작성자 없는 Article은 author 속성을 생성하지 않도록 했다. 새 작성자·변호사 검수 주장은 추가하지 않았다.

구현 기준: `origin/main` `1475ad7e`의 격리 worktree. canonical dirty worktree는 변경하지 않았다. package-lock 바이트 일치 확인 후 기존 node_modules를 읽기용으로 연결했다.

## 검증

- 영향 테스트: `npx vitest run src/lib/__tests__/column-audience-and-ai-author-20260929.test.tsx 'src/app/[locale]/columns/[slug]/__tests__/column-view-visibility.test.tsx' src/lib/__tests__/canonical-attorney-seo-identity.test.ts src/lib/__tests__/issue-board-20261002.test.ts src/components/__tests__/columns-grid-guidance-labels.test.tsx` → 5 files / 140 tests PASS.
- 증거 로그: `/tmp/tseng-remove-ai-byline-20261003/`.
- TypeScript, lint, 전체 unit, production build 및 실제 화면 검증 결과는 아래에 추가한다. 배포 완료를 의미하지 않는다.
- `npm run typecheck` → exit 0 (route typegen + TypeScript).
- `npm run lint` → exit 0 (warnings 0).
- `npx vitest run 'src/app/[locale]/traffic-accidents/__tests__/traffic-board.test.tsx'` → 1 file / 7 tests PASS. 기존 AI 작성자 표시 존재 assertion을 부재 assertion으로 갱신했다.
- Clean production build: private `.next-build`를 제거한 후 `NEXT_TELEMETRY_DISABLED=1 npm run build` → exit 0, 2025/2025 static pages, BUILD_ID `TX56lLx90ID_mOmfXf4tX`. 기존 CSS 경고와 node_modules symlink의 `Projects/projects` 경로 casing 경고가 출력됐으나 빌드는 성공했다. 자동 변경된 `next-env.d.ts`는 원본으로 복구했다.
- 로컬 production preview `http://127.0.0.1:43873`, PID 71942. 대표 칼럼 `/ko/columns/taiwan-accident-police-records` HTTP 200. 실화면 검수는 주 에이전트가 담당한다.
- 최초 전체 `npm run test:unit`: 1400 files 중 1383 PASS / 17 FAIL; 13913 tests 중 13877 PASS / 21 FAIL / 14 skipped / 1 todo (697.15s). 전체 green으로 보고하지 않는다. 이 실행 도중 수정된 기대치의 이전 사본이 포함됐다.
  - AI 표시/마크업 기대치 2건: 최신 영향 테스트 147/147 PASS로 해소.
  - 원고 보존 SHA 12건: 콘텐츠 레인이 승인된 작성자 문구만 역복원해 원래 SHA를 검증하도록 수정. 원래 SHA 상수는 12/12 동일, 12 files / 26 tests PASS. 별도 내용 검수 기록 참조.
  - 무관 `useSandboxSiteState` 1건: 별도 HEAD `1475ad7e` source snapshot 76/76 PASS; 빌드 종료 후 현재 worktree 재실행도 76/76 PASS. 코드·테스트 변경 없이 통과했다.
  - 무관 production-stub registry 2건: 최초 동시 실행에서 30초 timeout; 빌드 종료 후 `npx vitest run src/lib/builder/audit/__tests__/production-stub-registry.test.ts -t 'leaves zero unmapped'` → 2 PASS (12.02s / 13.84s), 81건은 이름 필터로 미실행. 코드·timeout 변경 없음.
  - sitemap 최초 4건 및 빌드 중 재실행의 다른 4건: 5초 timeout. 최종 단독 재실행 결과는 아래 추가한다.
- 최종 sitemap 단독 재실행: `npx vitest run src/app/__tests__/sitemap.test.ts` → 35/35 PASS (16.05s). 코드·timeout 변경 없음. 최초 전체 실행의 모든 실패는 위 관련 기대치 수정 및 단독 재실행으로 해소했으며, 전체 1400 files를 다시 실행한 결과라고 표현하지 않는다.
- `git diff --check -- src ':!src/content'` → exit 0. 콘텐츠 범위의 기존 Markdown hard break 한 줄은 내용 레인 문서에 기록한 의도적 보존이다.

## 주 에이전트 실화면 검수

- 로컬 production `43873`: 한국어 칼럼 카드 25개에서 AI 작성자 표시 없음, 실제 변호사 작성자 유지. 첫 TSMC 카드를 실제 클릭해 올바른 상세 제목·출처일·면책을 확인했다.
- Desktop 1440×900 및 mobile 390×844 화면 캡처 확인: 가로 넘침 없음, AI hero/footer marker 0.
- 경찰자료 칼럼의 rendered `[data-column-content="markdown"]` 텍스트 SHA-256 `3e08001e976881fee402852a21039b8842b8c8c5665de2fae08acc0b00f58757` / 2629 bytes: 변경 전 live baseline과 동일. Article author 미지정 확인.
