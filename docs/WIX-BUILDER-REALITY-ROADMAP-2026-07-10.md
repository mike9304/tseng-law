# 윅스빌더 현실 기반 개선 로드맵 지시서

- 대상: `/Users/son7/Projects/tseng-law` — Visual CMS 2.0, 실제 고객 인도 대상
- 기준일: 2026-07-10 KST
- 문서 성격: 신규 기능 희망 목록이 아니라 **현재 구현·실데이터·테스트·운영 상태에 근거한 실행 지시서**
- 적용 우선순위: 이 문서의 P0 → P1 → P2 순서를 지킨다. 기존 체크포인트의 초록색 수만으로 우선순위를 바꾸지 않는다.
- 변경 원칙: 한 작업은 한 목적·한 소유 파일군·한 검수 증거·한 원자 커밋으로 끝낸다.

## 1. 한 줄 판정

이 빌더는 “없는 제품”이 아니다. 편집기, 컴포넌트, CMS, 게시, 반응형 오버라이드, 버전, 협업 UI까지 폭넓게 구현된 **대형 제품 후보**다. 그러나 현재 상태는 고객 인도 완료가 아니라 **기능 범위는 넓고, 검증의 진실성·데이터 안전·실서비스 연동·보안 기준이 뒤따라가야 하는 단계**다.

당장 더 많은 위젯을 추가하는 것보다 다음 네 가지를 먼저 해결해야 한다.

1. `225/225` 같은 문서상 완료 표시를 실제 실행 증거와 분리한다.
2. 운영 사이트 데이터와 테스트·샘플 데이터를 격리하고 복구 가능하게 만든다.
3. mock/stub/placeholder를 실서비스 성공으로 보고하지 못하게 한다.
4. 지원 종료 프레임워크와 고위험 의존성 문제를 해소한다.

## 2. 이번 진단에서 확인한 사실

### 2.1 이미 잘 갖춰진 부분

- 편집기/공개 렌더러, 페이지 전환, 드래그·리사이즈, 실행 취소·다시 실행, 게시·롤백, 컴포넌트 카탈로그가 존재한다.
- desktop/tablet/mobile 반응형 오버라이드 스키마와 편집 UI가 존재한다. “모바일 기능이 없다”가 아니라 **고정 3단계 이상의 커스텀 브레이크포인트와 전체 스타일 계층이 부족한 것**이 정확한 진단이다.
- CMS 컬렉션·동적 데이터 연결·번역·예약·결제·협업 댓글·presence·버전 이력 등 제품 범위가 넓다.
- `expectedRevision` 기반 충돌 감지와 클라이언트 충돌 처리의 기초가 있다.
- 단위 테스트와 Playwright 테스트 자산이 매우 많다. 현재 파일 기준으로 빌더 관련 소스가 2,300여 개이고 Playwright 스펙만 269개인 대형 코드베이스다.
- 직전 깨끗한 기준 커밋에서는 프로덕션 빌드가 통과한 기록이 있다.

### 2.2 즉시 고쳐야 할 현실성 문제

| 영역 | 확인된 사실 | 판정 |
|---|---|---|
| 완료율 | `scripts/run-w-checkpoint-audit.mjs`는 체크포인트 Markdown의 이모지 상태를 파싱한다. 실제 브라우저 동작을 225개 모두 재검증하지 않는다. | P0 |
| handoff | `.omo/evidence/handoff-blockers-latest.json`은 `ok:false`, open 8, warn 1이다. 운영 관리자 인증과 Stripe, Zoom, Calendar, 메일, 번역, 분산 rate limit 등이 열려 있다. | P0 |
| stub 진실성 | Instagram 계열 컴포넌트는 가짜 타일을 생성하고, 번역은 provider 미설정 시 원문을 `ok:true/mock`으로 반환하며, Zoom·결제에도 개발용 mock/stub 경로가 있다. | P0 |
| 보안 | Next.js 14 계열을 사용 중이다. 공식 지원 정책상 Next 14는 지원 종료 상태다. 운영 의존성 audit에서 총 14건(고위험 4, 중간 9, 낮음 1)이 확인됐다. | P0 |
| 데이터 | `runtime-data`가 약 212MB다. 기준 사이트의 활성 페이지 메타는 24개인데 페이지 저장 파일은 draft 7,844개, published 519개이고 동일 slug와 홈 페이지가 중복돼 있다. | P0 |
| 동시 편집 | revision 검사는 있으나 `canvas-mutex.ts`가 명시하듯 mutex는 프로세스 로컬이다. 다중 인스턴스에서 원자적 쓰기를 보장하지 않는다. | P0 |
| 테스트 정직성 | 40개 Playwright 스펙 파일에 `force: true` 상호작용이 있다. 핵심 사용자 흐름에서 overlay·hit-test 문제를 숨길 수 있다. | P0/P1 |
| 접근성 | axe 사용 범위가 일부 스모크에 치우쳐 있고 WCAG 2.2의 focus not obscured, target size, dragging alternative 같은 항목을 제품 수준으로 관리하지 않는다. | P1 |
| 성능 | 실측에서 `/ko` LCP 약 3.36초로 “개선 필요”였다. 현재 게이트는 주로 poor 경계만 막고 INP와 p75 good 목표를 강제하지 않는다. | P1 |
| 구조 | 10,000줄이 넘는 편집기 컴포넌트와 CSS, 6,000줄대 CMS 클라이언트 등이 있어 수정 영향 범위와 CSS cascade 위험이 크다. | P1/P2 |

### 2.3 “빌더가 흑백처럼 보임”이 드러낸 구조적 문제

원본 이미지의 색상이 없어진 것이 아니라 `src/app/globals.css`에 있는 hero 이미지의 `brightness(78%)` 처리와 뒤쪽의 짙은 `--ink-hero-overlay`가 겹쳐 채도 체감이 크게 낮아진다. 이 현상은 단순 색 취향 문제가 아니라 다음 제품 결함을 보여 준다.

- 최종 색을 만든 규칙이 편집기 속성 패널보다 전역 CSS cascade에 숨어 있다.
- 편집 화면에서 “원본 → 필터 → 오버레이 → 최종 결과”의 출처를 설명하지 못한다.
- 편집기와 공개 화면의 스타일 계산이 다르면 사용자는 저장 결과를 신뢰하기 어렵다.

따라서 해당 색상만 즉석에서 밝히는 것으로 끝내지 말고, P1의 “스타일 출처 표시기·편집/공개 parity·테마 토큰화” 작업으로 해결한다.

## 3. 외부 기준과의 차이

### 3.1 반응형 디자인

Wix Studio는 페이지 및 글로벌 섹션별 커스텀 브레이크포인트, 최대 6개 브레이크포인트, 상위 브레이크포인트에서의 cascading, breakpoint별 layout/design override, stretch·relative·scale 같은 반응형 동작을 제공한다. AI 반응형 기능도 결과를 먼저 보고 apply/discard할 수 있다.

현재 빌더는 고정 desktop/tablet/mobile과 일부 rect/font/hidden 오버라이드까지 구현돼 있다. 다음 단계는 “반응형 추가”가 아니라 아래의 성숙도 확장이다.

- 페이지/글로벌 섹션별 커스텀 브레이크포인트
- 전체 디자인 토큰과 레이아웃 속성의 breakpoint override
- px 고정 외에 relative/stretch/fluid/scale 동작
- AI 변경 전 diff preview, apply, discard, undo
- editor와 published 화면에서 동일한 geometry resolver 사용

참고: [Wix Studio 브레이크포인트 관리](https://support.wix.com/en/article/studio-editor-managing-breakpoints), [브레이크포인트별 디자인](https://support.wix.com/en/article/studio-editor-designing-across-breakpoints), [AI 반응형 섹션](https://support.wix.com/en/article/studio-editor-using-ai-to-make-sections-responsive)

### 3.2 CMS와 동적 페이지

Wix CMS의 기준은 collection에 연결된 list/item/manage 동적 페이지, dataset의 필터·정렬·표시 수, 동적 SEO, 권한과 데이터 백업이다. 현재 빌더에도 해당 기반이 있으므로 새 CMS를 다시 만드는 것이 아니라 다음을 증명해야 한다.

- collection schema 변경과 기존 페이지의 호환성
- list → item navigation 및 locale별 slug/SEO
- manage 페이지의 권한·validation·bulk operation
- 디자인 버전과 CMS 콘텐츠 백업의 분리
- 운영 데이터에서 테스트 seed가 절대 생성되지 않는 보장

참고: [Wix CMS 동적 페이지](https://support.wix.com/en/article/cms-about-dynamic-pages)

### 3.3 협업과 이력

Wix Studio는 동시 편집, presence, 권한, 페이지/요소/브레이크포인트별 댓글, 첨부, mention, 필터와 resolve 흐름을 제공한다. 현재 빌더의 댓글·presence는 좋은 출발점이나 다중 인스턴스 쓰기 안전과 댓글 문맥이 부족하다.

또한 Wix도 사이트 이력이 CMS 및 앱 데이터를 함께 복원하지 않는다고 명시한다. 이 빌더도 “사이트 디자인 롤백”과 “CMS/예약/결제 데이터 복구”를 하나의 버튼으로 모호하게 섞지 않아야 한다.

참고: [Wix Studio 협업](https://support.wix.com/en/article/studio-editor-collaborating-on-a-site), [사이트 댓글](https://support.wix.com/en/article/studio-editor-about-site-comments), [사이트 이력 복원 범위](https://support.wix.com/en/article/restoring-a-saved-version-of-your-site)

### 3.4 접근성과 성능

Wix 접근성 Wizard는 자동 감지와 수동 검토를 사이트/페이지 단위로 묶는다. 이 빌더도 단발성 axe 스모크보다 운영자가 수정 가능한 Wizard 흐름이 필요하다. 목표 표준은 WCAG 2.2 AA로 고정한다.

성능 게이트는 LCP·INP·CLS를 실제 방문자 p75 기준으로 다뤄야 한다. good 기준은 LCP 2.5초 이하, INP 200ms 이하, CLS 0.1 이하로 설정한다.

참고: [Wix 접근성 Wizard](https://support.wix.com/en/article/accessibility-using-the-accessibility-wizard?tabs=Studio-Editor), [WCAG 2.2](https://www.w3.org/TR/WCAG22/), [Core Web Vitals 임계값](https://web.dev/articles/defining-core-web-vitals-thresholds), [Wix Core Web Vitals](https://support.wix.com/en/article/site-performance-about-core-web-vitals)

### 3.5 플랫폼·보안 수명

Next.js 공식 정책상 16은 Active LTS, 15는 Maintenance LTS이며 14는 지원 종료다. 따라서 기능 개발과 별도로 격리 브랜치에서 지원 버전 전환을 수행해야 한다. Next 16은 Node.js 20.9+, React 19.2, Turbopack 및 middleware→proxy 등의 변경점이 있으므로 무검증 일괄 교체는 금지한다.

참고: [Next.js 지원 정책](https://nextjs.org/support-policy), [Next.js 16 업그레이드 가이드](https://nextjs.org/docs/app/guides/upgrading/version-16)

## 4. 완료 상태의 새 정의

기존의 단일 `🟢` 대신 모든 기능을 아래 다섯 상태 중 하나로 기록한다.

| 상태 | 의미 | 릴리스 허용 |
|---|---|---|
| `VERIFIED` | 브라우저 핵심 흐름, 저장 후 reload, published 결과, 필요한 provider smoke까지 증거가 있다. | 허용 |
| `LOCAL-VERIFIED` | 로컬 기능은 증명됐으나 운영 환경/provider 증거가 없다. | 내부 베타만 |
| `STUB` | 가짜 응답·placeholder·샘플 데이터다. UI에도 명시해야 한다. | 운영 성공으로 간주 금지 |
| `WAIVED` | 사용자가 범위 제외를 승인했고 이유·만료일·영향이 기록돼 있다. | 조건부 |
| `OPEN` | 미구현, 실패, 또는 증거가 없다. | 차단 |

`audit:w-checkpoints`는 문서를 읽는 요약 도구로 남길 수 있지만 release gate가 될 수 없다. 새 release manifest는 각 항목마다 다음 필드를 가져야 한다.

```json
{
  "id": "W210",
  "state": "LOCAL-VERIFIED",
  "evidence": [".omo/evidence/.../result.json"],
  "commit": "<sha>",
  "environment": "local",
  "verifiedAt": "<ISO-8601>",
  "expiresAt": "<ISO-8601>",
  "provider": "stripe|stub|none"
}
```

증거 파일이 없거나 commit/environment가 다르면 자동으로 `OPEN`으로 내려간다. `STUB`은 `VERIFIED`로 자동 승격할 수 없다.

## 5. 목표 제품의 경계

### 반드시 인도할 Golden Journey

1. 운영자가 로그인한다.
2. 사이트/페이지를 선택하고 텍스트·이미지·레이아웃을 수정한다.
3. `← 이전 작업`으로 한 단계 되돌리고 `다음 작업 →`으로 다시 앞으로 간다.
4. desktop/tablet/mobile 및 커스텀 breakpoint 결과를 확인한다.
5. 저장하고 reload해도 값이 유지된다.
6. preview와 published 화면이 동일하다.
7. CMS 콘텐츠를 추가·수정하고 동적 목록/상세에 반영한다.
8. 번역·SEO·접근성·성능 문제를 확인하고 수정한다.
9. 게시 전 validation을 통과한다.
10. 게시 후 실제 공개 URL에서 확인한다.
11. 문제가 있으면 사이트 디자인과 비즈니스 데이터를 올바른 범위로 복구한다.

### P0가 끝나기 전 만들지 않을 것

- 새 장식용 위젯과 템플릿 수 늘리기
- 실제 provider가 없는 integration의 초록 체크 추가
- 제품 요구가 확정되지 않은 full CRDT 편집기
- Wix App Market 전체를 모사하는 범용 마켓플레이스
- 검증되지 않은 AI 생성 기능 확대

## 6. 실행 로드맵

일정 숫자보다 exit gate를 우선한다. 예상 크기는 깨끗한 기준 브랜치에서 재산정한다.

### Phase 0 — 진실한 기준선 복구 · P0 · 2~4 작업일

#### R0-1. 작업 레인과 기준 커밋 고정

- 현재 dirty worktree의 변경 소유자를 분류한다.
- 새 worktree/브랜치에서 기준 SHA를 고정한다.
- 동일 파일에 두 worker가 동시에 쓰지 못하게 lane manifest를 만든다.
- 사용자의 미커밋 파일을 정리·되돌리거나 다른 작업에 섞지 않는다.

완료 조건:

- 기준 SHA, dirty 파일 목록, 소유자, 허용 파일 패턴이 `.omo/evidence/roadmap-baseline/`에 있다.
- 빌드 검수용 worktree는 clean이다.

#### R0-2. 체크포인트를 증거 manifest로 교체

- 문서 이모지 카운트를 release readiness와 분리한다.
- `VERIFIED/LOCAL-VERIFIED/STUB/WAIVED/OPEN` 상태 스키마를 구현한다.
- evidence 존재, commit 일치, 환경, 만료, provider 종류를 검증한다.
- 기존 225개 항목은 일괄 `LOCAL-VERIFIED`로 올리지 말고, 증거가 없는 것은 `OPEN`으로 시작한다.

완료 조건:

- stub만으로 성공하는 W108/W203/W204/W205/W210류 항목이 운영 `VERIFIED`가 되지 않는다.
- 결과 JSON과 사람이 읽는 Markdown report가 동시에 생성된다.

#### R0-3. 운영 stub 격리

- 모든 mock/stub/placeholder 경로를 registry로 수집한다.
- 개발 환경에서는 눈에 보이는 `DEMO/STUB` badge를 표시한다.
- production에서 provider가 없으면 `ok:true`가 아니라 명시적 `not_configured` 또는 기능 비활성 상태를 반환한다.
- Instagram placeholder는 “실제 피드”로 부르지 않는다. 실연동 또는 정직한 데모 카드 중 하나를 선택한다.

완료 조건:

- `rg` 기반 stub registry와 자동 테스트가 있다.
- production build에서 결제·번역·회의·메일 stub 성공 응답이 불가능하다.

#### R0-4. 데이터 구조 진단과 보호

- canonical 사이트를 먼저 snapshot하고 checksum을 저장한다.
- 활성 24페이지와 8,363개 draft/published 파일의 참조 관계를 조사한다.
- 중복 slug, 중복 home, orphan, test seed를 분류한다.
- 삭제하지 말고 먼저 quarantine manifest와 dry-run report를 만든다.

완료 조건:

- 백업 복구 rehearsal이 통과한다.
- 운영 데이터에 쓰는 테스트가 0개다.
- home 1개, locale별 slug uniqueness가 저장 계층에서 강제된다.

### Phase 1 — 보안과 플랫폼 수명 · P0 · 1~2주

#### R1-1. 긴급 의존성 보안 패치

- 별도 security lane에서 `npm audit --omit=dev`의 high 항목을 0으로 만든다.
- Nodemailer 안전 버전, Sentry 호환 patch, transitive OpenTelemetry 이슈를 검토한다.
- lockfile 변경 전후 audit 결과를 증거로 남긴다.
- 로컬 환경 파일·토큰은 커밋하지 않으며 인도 전 장기 자격증명 회전 여부를 확인한다.

#### R1-2. Next.js 지원 버전 전환

- 1안: 최신 Next 15 Maintenance LTS로 먼저 안정화 후 16으로 전환.
- 2안: 격리 worktree에서 16 direct migration을 spike하고 모든 gate가 통과하면 채택.
- 두 안을 같은 브랜치에서 섞지 않는다.
- Node/React, middleware/proxy, image, caching, route handler, Sentry, Playwright 호환성을 각각 검증한다.

완료 조건:

- 지원 중인 Next 버전을 사용한다.
- audit high 0, typecheck/lint/unit/security route/build/browser golden journey가 모두 통과한다.
- rollback 가능한 기존 lockfile과 migration note가 있다.

### Phase 2 — 데이터 안전과 일관성 · P0 · 4~8 작업일

#### R2-1. 저장소 invariant

- siteId/pageId/slug/locale의 canonical key를 정의한다.
- page metadata와 파일 스냅샷이 서로 어긋나지 않도록 transactional write 또는 journal을 도입한다.
- 중복 home, 중복 slug, 존재하지 않는 page 참조를 거부한다.
- 임시 파일 write → fsync/atomic rename 원칙을 적용한다.

#### R2-2. 데이터 lifecycle

- draft, published, revision, autosave, test fixture의 namespace를 분리한다.
- revision retention과 garbage collection 정책을 문서화한다.
- orphan 정리는 dry-run → quarantine → 사용자 승인 → delete의 4단계로만 진행한다.
- site 디자인, CMS, 예약, 결제/주문, 협업 댓글의 백업·복구 단위를 분리한다.

완료 조건:

- power-loss/중간 실패를 모사한 테스트에서 마지막 정상 revision이 복구된다.
- canonical root 파일 수가 다시 무한 증가하지 않는다.
- 테스트가 종료돼도 운영 namespace의 checksum이 동일하다.

### Phase 3 — 핵심 편집기 신뢰성 · P0/P1 · 1~2주

#### R3-1. 정직한 pointer test gate

- Golden Journey 테스트에서 `force:true`를 금지한다.
- 실제 pointer와 `elementFromPoint`를 사용해 hit target을 확인한다.
- drag 시작/이동/종료, overlay, sticky header, inspector가 click을 가리지 않는지 검사한다.
- force가 꼭 필요한 비사용자 surface는 예외 이유와 만료일을 코드에 남긴다.

#### R3-2. 저장·전환·복구

- 수정 → 페이지 전환 → 복귀 → reload → publish → public 검증을 하나의 흐름으로 만든다.
- 저장 중 페이지 전환, offline/timeout, 409 conflict, duplicate submit, 브라우저 종료를 다룬다.
- 실패 시 사용자의 로컬 편집 내용을 잃지 않고 복구 선택지를 보여 준다.

#### R3-3. 다중 인스턴스 원자성

- process-local mutex를 분산 conditional write/CAS 또는 distributed lock으로 교체한다.
- lock TTL, fencing token, idempotency key, retry/backoff를 정의한다.
- 서로 다른 프로세스에서 같은 revision을 동시에 저장하는 테스트를 만든다.
- 완전한 실시간 공동 편집이 필요하지 않다면 우선 “충돌 없는 안전한 단일 writer + 명확한 conflict UI”를 완성한다.

#### R3-4. `이전 작업 / 다음 작업` 버튼

현재 코드에는 `canUndo/canRedo`, workspace snapshot, 단축키, 별도 undo timeline이 이미 있다. 새 이력 엔진을 중복 구현하지 말고 이 기반을 하나의 명확한 사용자 컨트롤로 통합한다.

UI 계약:

- 상단 고정 toolbar에 `← 이전 작업`과 `다음 작업 →` 버튼을 항상 나란히 둔다.
- `이전 작업` 아래 또는 tooltip에 `텍스트 변경 취소`, `요소 이동 취소`, `이미지 교체 취소`처럼 **실제로 되돌릴 작업명**을 표시한다.
- 한 단계 이전으로 이동하면 `다음 작업 →`이 즉시 활성화되고 `텍스트 변경 다시 적용`처럼 다음 동작명을 표시한다.
- 더 이전/이후 이력이 없을 때는 버튼을 숨기지 않고 disabled 상태와 이유를 제공한다. 사용자가 기능의 존재를 계속 인지할 수 있어야 한다.
- 버튼 옆 chevron 또는 길게 누르기로 최근 작업 timeline을 열되, 기본 클릭은 정확히 한 단계만 이동한다.
- 한국어 UI는 `이전 작업/다음 작업`, 영문은 `Undo/Redo`, 번체중문은 해당 locale copy를 사용한다.
- 아이콘만 표시하지 말고 넓은 화면에서는 text label을 함께 보여 준다. 좁은 화면에서도 accessible name과 tooltip을 유지한다.

동작 계약:

- 대상은 텍스트·스타일·위치·크기·추가·삭제·복제·이미지·breakpoint override 등 **builder document mutation**이다.
- 페이지 방문 자체나 브라우저 history를 되돌리는 버튼으로 사용하지 않는다.
- 마지막 작업이 다른 페이지에서 발생했다면 `소개 페이지의 제목 변경을 되돌릴까요?`라고 문맥을 표시하고, 승인 시 해당 페이지로 이동해 되돌린다.
- `Cmd/Ctrl+Z`, `Cmd/Ctrl+Shift+Z`와 버튼이 동일한 command/history source를 사용한다.
- 이전으로 간 뒤 새 편집을 하면 기존 redo branch는 폐기한다. 폐기 직전에는 `이 작업을 하면 이후 작업 2개를 다시 적용할 수 없습니다`를 알린다.
- 저장 전후에도 draft history는 유지하되, **이미 published된 공개 사이트를 조용히 과거 상태로 되돌리지 않는다.** undo 결과는 새 draft가 되고 사용자가 다시 게시해야 한다.
- 결제, webhook, 이메일 발송, 예약 확정 같은 외부 side effect는 canvas undo로 취소하지 않는다. 해당 도메인의 명시적 취소/환불 흐름을 사용한다.
- 서버 revision conflict가 발생하면 이력 적용을 중단하고 현재 서버 버전과 내 변경을 선택하게 한다.
- page/site/user/revision이 다른 history를 섞지 않는다. reload 후 복구할 범위와 보존 기간을 명시한다.

필수 acceptance scenario:

1. 제목 `A → B → C` 변경 후 `이전 작업`을 누르면 B, `다음 작업`을 누르면 C가 된다.
2. 두 번 이전 후 한 번 다음으로 이동하면 history cursor와 버튼 label이 정확하다.
3. 이전 후 새 값 D를 입력하면 redo가 disabled되고 분기 폐기 안내가 남는다.
4. 요소 삭제 → 이전 작업 시 같은 parent/index와 breakpoint 속성으로 복원된다.
5. 페이지를 바꾼 뒤 이전 페이지 작업을 되돌릴 때 대상 페이지와 작업명을 먼저 보여 준다.
6. 저장·reload·publish 경계에서 draft/public 상태가 혼동되지 않는다.
7. 키보드, screen reader, mobile touch target에서 동일하게 사용할 수 있다.
8. undo/redo 100회 반복과 큰 document에서도 UI가 멈추지 않고 memory cap을 지킨다.

완료 조건:

- 핵심 20개 흐름의 forced interaction이 0이다.
- 2개 프로세스 경합에서 silent overwrite가 0이다.
- 브라우저 crash 후 마지막 로컬 변경의 복구 안내가 있다.
- `이전 작업 → 다음 작업` 왕복 후 document checksum이 원래 값과 일치한다.
- 버튼, 단축키, timeline이 하나의 history cursor를 공유하고 서로 다른 상태를 표시하지 않는다.

### Phase 4 — 반응형·레이아웃 성숙도 · P1 · 1~2주

#### R4-1. 커스텀 breakpoint 모델

- page와 global section의 breakpoint 목록을 분리한다.
- desktop base에서 좁은 breakpoint로 cascade하되, override와 reset의 출처가 보이게 한다.
- 최소 320/375/768/1024/1280 및 사용자 지정 너비를 검증한다.

#### R4-2. responsive behavior

- fixed px, relative %, stretch, hug/content, scale, min/max, grid/stack 동작을 명시적 schema로 만든다.
- 임의 CSS 문자열보다 typed resolver를 우선한다.
- editor, preview, published가 같은 resolver와 단위 변환을 사용한다.

#### R4-3. AI 제안 안전성

- AI가 바로 문서를 변경하지 않게 한다.
- 변경 전후 geometry/style diff, preview, apply/discard, undo를 제공한다.
- 잘못된 overlap/overflow/reading order를 validation이 차단한다.

완료 조건:

- breakpoint별 screenshot과 DOM geometry diff가 허용 오차 안에 있다.
- 한 breakpoint 수정이 의도하지 않은 상위 breakpoint를 바꾸지 않는다.

### Phase 5 — 스타일 출처와 편집/공개 parity · P1 · 1~2주

#### R5-1. style cascade inspector

- 최종 스타일을 theme token, global CSS, component default, page override, breakpoint override, inline override 순서로 설명한다.
- hidden filter/overlay를 속성 패널에서 확인하고 reset할 수 있게 한다.
- hero 흑백 체감 사례를 회귀 테스트 fixture로 사용한다.

#### R5-2. 공유 renderer/resolver

- 편집기와 공개 화면의 node → DOM/style 변환을 가능한 한 공유한다.
- 편집기 전용 selection chrome만 분리한다.
- node별 DOM snapshot, computed style, bounding box, screenshot diff를 동시에 비교한다.

#### R5-3. 전역 CSS 부채 축소

- 뒤에 append된 one-off override를 theme token과 component module로 이동한다.
- 10,000줄대 `SandboxPage.module.css`와 `BuilderInteractiveHomePreview.tsx`를 책임 단위로 분리한다.
- 분할 자체를 목표로 삼지 말고 contract test를 먼저 고정한다.

완료 조건:

- 편집기와 published 화면의 주요 노드 geometry/style 차이를 자동 report한다.
- hero 필터/오버레이 출처가 UI에서 설명되고 개별 reset된다.

### Phase 6 — CMS·다국어·SEO · P1 · 1~2주

- list/item/manage 동적 페이지의 create/edit/publish/delete 전체 흐름을 검증한다.
- dataset filter/sort/pagination/load limit와 empty/error state를 검증한다.
- locale별 slug, canonical, hreflang, metadata, structured data를 검증한다.
- 번역 provider가 없으면 원문을 성공 번역으로 기록하지 않는다.
- schema migration, reference field, media metadata, relation picker의 backward compatibility를 고정한다.
- CMS 데이터는 사이트 디자인 revision과 별도 backup/restore UI를 가진다.

완료 조건:

- ko/zh-hant/en의 list → item → edit → publish가 실제 브라우저에서 통과한다.
- SEO/a11y 검사가 공개 URL 기준으로 통과한다.
- CMS 복구가 사이트 디자인 롤백과 독립적으로 동작한다.

### Phase 7 — 실서비스 integration · P0/P1 · 자격증명 준비 후 1~3주

대상: Stripe, Google Calendar, Outlook, Zoom, 운영 메일, DeepL/번역, Upstash/분산 rate limit, Instagram 또는 선택한 소셜 provider.

각 provider는 같은 계약을 따른다.

1. 설정되지 않음: UI disabled + 설정 안내 + `not_configured`.
2. sandbox/test: provider가 발행한 실제 sandbox ID를 저장하고 webhook까지 검증.
3. production: 최소 권한 자격증명, health check, retry, idempotency, audit log.
4. 장애: 사용자에게 재시도/대체 흐름 제공, 가짜 성공 금지.

완료 조건:

- Stripe test payment → webhook → booking/order state 전이가 검증된다.
- Calendar/Zoom은 실제 provider event/meeting ID와 취소·재시도까지 검증된다.
- 메일은 provider message ID와 delivery failure를 기록한다.
- rate limit은 2개 이상의 프로세스에서 동일하게 동작한다.
- handoff blocker open이 0이거나 사용자가 서명한 `WAIVED`만 남는다.

### Phase 8 — 협업·버전·권한 · P1/P2 · 1~2주

- 댓글에 page/element/breakpoint 문맥, attachment, mention notification, resolve/filter를 추가한다.
- presence는 표시 기능과 데이터 안전 기능을 구분한다.
- role별 edit/publish/CMS/manage/integration 권한을 실제 API route에서 강제한다.
- site design, CMS, booking/commerce, comments를 선택 복구한다.
- revision diff에서 node 추가/삭제/이동/스타일/콘텐츠 변경을 사람이 이해할 수 있게 표시한다.

완료 조건:

- 두 운영자 동시 편집에서 overwrite 없이 conflict 또는 merge 선택지가 나온다.
- viewer가 API 호출로 publish할 수 없다.
- 각 데이터 도메인의 restore rehearsal이 통과한다.

### Phase 9 — 접근성·성능 제품화 · P1 · 1~2주

#### 접근성 Wizard

- 자동: contrast, alt, label, heading, landmark, duplicate id, focusable hidden content.
- 수동: 의미 있는 alt 품질, reading order, keyboard-only, focus not obscured, target size, dragging alternative, reduced motion.
- site 전체 issue와 page issue를 나누고, 클릭 시 해당 node를 선택한다.
- 수정, ignore 사유, 재검사, published 확인을 제공한다.

#### 성능

- lab만이 아니라 공개 URL의 RUM p75를 기록한다.
- LCP ≤2.5s, INP ≤200ms, CLS ≤0.1을 목표 gate로 둔다.
- editor bundle과 public bundle을 분리하고 admin-builder의 초기 JS를 줄인다.
- 이미지 preload/priority, font, third-party widget, hydration, long task 원인을 페이지별로 표시한다.

완료 조건:

- 핵심 공개 페이지와 builder Golden Journey가 WCAG 2.2 AA 자동 검사 및 수동 체크리스트를 통과한다.
- `/ko`를 포함한 핵심 공개 경로의 CWV가 good 목표에 도달하거나, 예외가 데이터와 만료일을 가진다.
- 접근성 및 성능 회귀가 CI를 차단한다.

### Phase 10 — 확장 플랫폼과 개발자 경험 · P2

- component kind 하나가 editor/public/inspector/catalog/serialize/a11y까지 빠짐없이 등록되는 단일 registry를 만든다.
- registry에서 contract test matrix와 문서를 자동 생성한다.
- 앱 확장은 site widget, dashboard page, backend extension을 각각 permission sandbox로 구분한다.
- plugin/app이 core 저장소를 직접 쓰지 못하고 versioned API를 사용하게 한다.
- 큰 모듈은 domain boundary와 contract test를 기준으로 분해한다.

Wix 수준 확장 모델의 참고 기준: [Wix 앱 확장 개요](https://dev.wix.com/docs/build-apps/get-started/overview/how-apps-extend-wix)

### Phase 11 — 고객 인도와 운영 · 최종 Gate

- clean worktree, atomic commits, 설치부터 clean build까지 재현한다.
- 운영 관리자 인증 smoke를 실제 배포 URL에서 통과한다.
- provider health와 webhook을 production/test 환경별로 증명한다.
- backup, restore, rollback, data migration runbook을 rehearsal한다.
- deploy 후 브라우저로 Golden Journey와 공개 핵심 경로를 다시 확인한다.
- 모니터링, alert, owner, 장애 연락 및 rollback 결정 기준을 남긴다.

인도 완료는 “빌드 성공”이 아니라 다음 조건을 모두 만족할 때만 선언한다.

- readiness manifest의 P0가 모두 `VERIFIED` 또는 승인된 `WAIVED`
- handoff blocker open/fail 0
- npm audit high 0
- 운영 namespace checksum 보존
- clean build와 핵심 browser gate 통과
- rollback rehearsal 성공
- 실제 공개 화면의 auth/provider/CWV/a11y 확인

## 7. 최초 실행 백로그

아래 순서를 바꾸지 않는다.

| ID | 우선순위 | 작업 | 주요 산출물 | 선행 조건 |
|---|---:|---|---|---|
| WB-R00 | P0 | 기준 SHA·dirty ownership·lane manifest | baseline JSON/MD | 없음 |
| WB-R01 | P0 | evidence 기반 readiness manifest | verifier + report | R00 |
| WB-R02 | P0 | stub/mock registry와 production fail-closed | registry + tests | R00 |
| WB-R03 | P0 | runtime-data snapshot/inventory/quarantine dry-run | checksum + report | R00 |
| WB-R04 | P0 | slug/home invariant 및 test namespace guard | storage tests | R03 |
| WB-R05 | P0 | dependency security patch | audit before/after | R00 |
| WB-R06 | P0 | Next 지원 버전 migration spike | decision record | R05 |
| WB-R07 | P0 | 핵심 20 journey에서 force 제거 | Playwright evidence | R00 |
| WB-R08 | P0 | 분산 CAS/lock 및 multi-process race test | concurrency evidence | R04 |
| WB-R09 | P0 | 저장·reload·publish·public end-to-end | Golden Journey | R07/R08 |
| WB-UX01 | P1 | `이전 작업/다음 작업` 버튼·label·timeline 통합 | browser + checksum evidence | R09 |
| WB-R10 | P1 | custom breakpoint + cascade schema | contract tests | R09 |
| WB-R11 | P1 | responsive behavior + AI preview/apply/discard | visual evidence | R10 |
| WB-R12 | P1 | shared style resolver + cascade inspector | parity report | R09 |
| WB-R13 | P1 | CMS list/item/manage, locale SEO | browser evidence | R04/R09 |
| WB-R14 | P0/P1 | provider별 real smoke와 stub 차단 | provider evidence | R02 |
| WB-R15 | P1 | WCAG 2.2 Accessibility Wizard | scan + manual report | R12/R13 |
| WB-R16 | P1 | RUM CWV와 bundle budget | p75 dashboard | R12 |
| WB-R17 | P1 | 협업 댓글 문맥·권한·restore domain | collaboration evidence | R08 |
| WB-R18 | P2 | 10k-line 모듈 분해 | contract-preserving refactor | R09/R12 |
| WB-R19 | 최종 | clean build/deploy/rollback rehearsal | handoff packet | 전부 |

## 8. 각 작업 지시서의 필수 형식

모든 worker에게 아래 항목이 없는 작업은 배정하지 않는다.

```md
# WB-Rxx — 작업명

## 문제와 사용자 영향
## 현재 근거 파일/증거
## 허용 파일 패턴
## 금지 파일 및 비목표
## 구현 계약
## 단위/API 테스트
## 실제 브라우저 Golden Path
## 실패/오버레이/모바일/다국어 경로
## 데이터 보존 확인
## 증거 저장 경로
## rollback 방법
## 완료 조건
## 원자 커밋 메시지
```

### 워커 운용 규칙

- 생각/판정/검수는 Codex가 맡고, 좁은 구현은 GLM 워커에게 파일 소유권을 명시해 하청한다.
- 한 worker는 한 작업과 한 파일군만 소유한다.
- 다른 worker와 겹치는 파일이 생기면 코딩을 멈추고 coordinator가 재배정한다.
- worker는 테스트 통과를 주장할 때 명령, exit code, 증거 경로를 함께 제출한다.
- Codex는 worker 보고를 그대로 승인하지 않고 diff·테스트·브라우저를 독립 검수한다.
- 사용자 변경과 다른 lane의 변경을 revert하거나 한 커밋에 섞지 않는다.

## 9. 공통 검수 게이트

### Gate A — 정적 검증

```bash
npm run typecheck
npm run lint
npm run security:builder-routes
```

### Gate B — 관련 테스트

```bash
npm run test:unit
npm run test:handoff-blockers
```

변경 영역의 focused test를 먼저 실행하고 전체 unit을 뒤에 실행한다. `npm run qa`는 Playwright를 포함하지 않으므로 이것만으로 완료 선언하지 않는다.

### Gate C — 실제 브라우저

```bash
npm run test:builder-editor -- --project=chromium-builder --workers=1
```

- 핵심 흐름은 `force:true` 없이 수행한다.
- desktop/mobile, overlay, 실패 경로, reload persistence, published 결과를 확인한다.
- screenshot만 찍고 완료하지 않는다. 입력·저장·재진입·공개 반영을 검증한다.

### Gate D — 데이터·보안·handoff

```bash
npm audit --omit=dev
npm run gate:handoff-blockers:json
```

- high vulnerability 0이 아니면 최종 인도를 막는다.
- 운영 provider가 필요한 항목은 실환경 증거 없이는 `LOCAL-VERIFIED` 이상이 될 수 없다.
- 테스트 전후 canonical data checksum을 비교한다.

### Gate E — clean build와 배포 후 검증

```bash
npm ci
npm run build
```

- 깨끗한 검수 worktree에서 실행한다.
- 빌드 중 dev server가 같은 `.next`를 사용하지 않게 한다.
- 배포 후 실제 URL에서 auth, Golden Journey, 공개 페이지, provider callback, rollback을 확인한다.

## 10. 장애 대응 플레이북

1. 즉시 영향 범위를 고정하고 신규 write를 줄인다.
2. 코드 장애와 데이터 장애를 분리한다.
3. 마지막 정상 commit, site revision, CMS/booking snapshot을 각각 식별한다.
4. 원본을 덮지 말고 별도 worktree 또는 복제 namespace에서 재현한다.
5. 코드 rollback이 데이터 rollback을 자동으로 의미하지 않게 한다.
6. 복구 후 checksum, revision, provider state, 공개 페이지를 검증한다.
7. 원인·감지 실패·재발 방지 테스트를 evidence에 남긴다.

## 11. 의사결정이 필요한 항목

다음 선택은 구현 도중 임의로 결정하지 말고 사용자 승인을 받는다.

1. 최종 목표가 “법무법인 운영에 최적화된 builder”인지 “범용 Wix 대체재”인지.
2. 같은 페이지를 여러 사람이 실시간 동시 편집해야 하는지, 안전한 충돌 감지만으로 충분한지.
3. Stripe/Zoom/Google/Outlook/메일/번역/소셜 중 실제 인도 범위와 비용을 승인할 provider는 무엇인지.
4. 기존 8천여 페이지 파일을 quarantine 뒤 보존할 기간과 최종 삭제 승인자는 누구인지.
5. Next 15 중간 안정화를 거칠지, 격리 검증 후 Next 16으로 바로 갈지.

## 12. 최종 성공 기준

성공은 “Wix와 같은 메뉴가 많다”가 아니다. 아래 사용자 약속이 지켜지는 상태다.

- 보이는 대로 게시된다.
- 저장한 데이터가 사라지거나 다른 페이지를 오염시키지 않는다.
- mock을 실서비스 성공으로 속이지 않는다.
- 두 사람이 작업해도 조용히 덮어쓰지 않는다.
- 모바일·키보드·다국어 환경에서도 편집과 공개 결과를 사용할 수 있다.
- 장애가 나도 디자인과 비즈니스 데이터를 올바른 범위로 복구할 수 있다.
- 완료 표시는 실행 증거와 정확히 일치한다.

이 기준이 충족된 뒤에야 컴포넌트 수, AI 기능, 앱 확장 범위를 늘린다.
