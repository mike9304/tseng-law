# 교통사고 게시판 스트리밍 hydration 검증

기준 커밋: `df6f57a972632cac9db425e41eb61a97e6c8a8e8`. 077 게시 후 운영 게시판의 일부 초기 로드에서 React 418이 관찰되었다. 글과 미디어는 정상 공개됐지만 당시 게시판 QA는 미해결로 기록했다.

## 재현과 변경

동일한 로컬 프로덕션 HTML을 변경 없이 2,048바이트씩 12ms 간격으로 전달하면 Firefox에서 재현된다. 새 회귀 스크립트의 수정 전 24회 탐색에서 오류 11건, 수정 후 같은 24회 탐색에서 0건이었다. 별도의 원본 React 번들 검사에서도 5회 중 5회 재현되어 계측으로 생긴 오류를 배제했다. 오류 시점은 HTML이 로딩 중인 상태이며 외부 래퍼를 기대하는 hydration 커서가 내부 JSON-LD/section에 위치했다. 일반 네트워크 지연 프로필 10개는 재현되지 않았다. 이는 이 페이지의 점진적 RSC 전달과 hydration 경합을 좁힌 증거이며 React 자체의 일반적인 결함을 확정하는 주장은 아니다.

서버 페이지가 CMS/파일 게시본 목록과 검색 조건·구조화 데이터를 먼저 완성하고, 순수한 데이터 props를 `TrafficPageView`에 전달한다. 이 컴포넌트는 기존 JSX를 서버와 브라우저에서 동일하게 렌더링한다. SSR 비활성화, 마운트 후에만 출력, 오류 억제, 원문/미디어 변경은 없다. 초안이나 본문은 목록 데이터에 포함하지 않는다. 첫 로드 JS는 이 빌드에서 145kB에서 165kB로 약 20kB 증가했다.

## 검증

- 새 회귀 검사: Chromium/Firefox 각 1440px·390px에서 초기 로드, 새로고침, 필터, 빈 검색, 뒤로가기, 해제 총 24회 탐색 오류 0. JavaScript 없는 가시적 목록·GET 검색·CollectionPage 포함 총 5/5 통과.
- 일반 로컬 게시판: Chromium/WebKit/Firefox, 4개 언어, 320/390/1440px, 접근성·관련글·목록 링크 등 15/15 통과.
- 수정 전후 4개 언어 × 기본/증거 필터/빈 검색 12페이지의 가시적 텍스트, 링크, 메타, canonical, JSON-LD, 목록 수 일치. 원래 JSX 렌더링 부분도 바이트 일치.
- 관련 단위 테스트 26개, lint, typecheck, builder route security, 프로덕션 빌드 통과.
- `src/content`와 `public` 변경 0. 076·077 사진/영상/프레임 30개가 인계 원본 SHA와 일치.

증거: 작업 폴더 `evidence/hydration-followup/`의 before/view-hydration-results.json, view-local-browser-results.json, ssr-equivalence.json, content-media-preservation.json, view-*.log. 운영 배포·검증 결과는 별도 HYDRATION-FIX-HANDOFF.md에 기록한다.

운영 Vercel의 403 Security Checkpoint 이후 원격 번들 계측을 재시도하거나 우회하지 않았다. 재현과 진단은 로컬에서 수행했다. 기존 의존성 취약점 13개(critical 1/high 9/moderate 3), 전체 단위 테스트의 기존 LocalJsonWriteConflictError 1건, 실제 iOS/Safari·스크린리더 미검증은 이번 변경으로 해결되지 않았다.
