# 형사소송 칼럼 배포 전 검증

2026-10-07, Node v24.14.1. 격리 작업트리 `tseng-law-criminal-20261007`, 기준 main `f1c13d5c458f3d4e5bbee7772fe98dc8a346b749`.

| 검사 | 결과 |
|---|---|
| 독립 원고 검수 | GPT-6 Astra max A·B·C 전원 APPROVE, 20편 SHA 일치 |
| 독립 게시판·서비스 코드 검수 | A·B·C 전원 APPROVE, 각 보고서에 코드 SHA·독립 테스트 기록 |
| 문장 다양성 | 지원 언어 16편 FAIL 0; VI 4편 수동 검수; 격식체 종결 WARN 8건 수동 확인 |
| `npm run qa` | PASS. typecheck, lint, 1408개 테스트 파일 / 14060개 테스트, builder route guard 검사 완료. 기존 skip 14 / todo 1 |
| 클린 `npm run build` | PASS. 기존 `.next-build` 제거 후 생성 |
| 빌드 후 `npm run typecheck` | PASS |
| `git diff HEAD --check` | PASS |
| 실제 공개 경로 검사 | 로컬 프로덕션 빌드에서 20개 상세 경로 HTTP 200, 제목·요약·canonical·5언어 alternate·FAQ 2개·이미지 표시 확인 |
| 연결 동작 | 5언어 일반 칼럼과 서비스 안내에서 게시판 링크 클릭, 각 4편 확인; VI→JA 게시판 언어 전환 확인 |
| sitemap·이미지 | 상세 20 URL 및 게시판 5 URL 포함, 대표 이미지 두 장 HTTP 200 image/webp |
| PC·모바일 | 1440px·390px 각각 5언어, 총 10화면. 4개 로컬 카드·H1 하나·가로 넘침 없음·pageerror 0. VI 상세 링크 클릭 확인 |

전체 QA 실행 로그: `/Users/son7/tseng-criminal-20261007/qa-final.log`. 클린 빌드 로그: `build-final.log`. 타입 검사 로그: `typecheck-final.log`. 공개 경로 결과: `local-production/public-verification.json`. PC·모바일 결과와 스크린샷: `local-production/browser-results.json`, `local-production/screenshots/`.

## 추가 빌더 smoke의 범위

`NEXT_DIST_DIR=.next-build SMOKE_PORT=4657 npm run test:builder-smoke`도 실행했으나 PASS로 기록하지 않는다. 새 작업트리에 없는 빈 `data/audit` 디렉터리를 준비한 뒤, 격리 harness가 정상 준비되고 `/ko/admin-builder`와 `/ko`가 HTTP 200을 반환했다. 테스트는 `tests/builder-editor/admin-builder.playwright.ts:440`의 공개 홈 HTML에 `hero-search-bar overlap` 문자열이 있어야 한다는 검사에서 실패했다. 이후 빌더 편집·발행 단계까지 실행된 것은 아니다.

배포 전의 실제 운영 사이트 `https://tseng-law.com/ko`도 HTTP 200이며 같은 문자열이 없고 `builder-pub-node`는 존재했다(2026-10-07T08:28:48Z 관측, `live-baseline-home.json`). 홈 구현·seed·이 smoke 검사는 이번 변경에서 수정하지 않았다. 홈과 관련된 Header diff는 형사 게시판 링크 추가다. 해당 smoke 실패를 형사 게시판 화면 검사 성공으로 덮지 않는다. 별도 범위 검토는 `reviews/smoke-scope-astra-a.md`를 참조한다.

격리 harness 종료 시 원본 runtime-data 및 audit 체크섬 불변 PASS를 확인했다. 증거는 `builder-smoke-final.log`와 해당 로그에 적힌 QA harness 경로에 남겼다. 운영 관리자 인증·외부 결제/메일 제공자까지 이번 콘텐츠 배포에서 새로 검증했다는 주장은 하지 않는다.

## 발행 조건

원고·코드 검수 버전과 위 검증 결과를 한 커밋으로 게시한다. 최신 원격 main과의 fast-forward 가능 여부를 게시 직전에 확인한다. 발행 완료 판정은 새 커밋의 Vercel Ready 및 실제 tseng-law.com 경로·본문·메타·연결 검사를 별도로 수행한 뒤 내린다. 이 파일 자체는 배포 완료 보고서가 아니다.
