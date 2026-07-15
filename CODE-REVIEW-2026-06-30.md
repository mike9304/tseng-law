# Tseng-law Wix Builder 코드 리뷰 종합 보고서 (2026-06-30)

> 방식: 6개 영역 병렬 코드 리뷰(Opus 4.8, xhigh effort — Fable 5 가용불가로 대체) + 종합.
> 대상: Codex의 `~/Projects/tseng-law` 빌더. 활발한 개발 중 스냅샷.
> 발견: 총 39건 (critical 1 / high 3 / medium 19 / low 16).
> **수정 완료(8건): R1·R2·R3·R4·R5 + decompose 빈배열 clamp(R1 companion) + columns publish slug 패턴검증(path-traversal 하드닝) + captureBuilderError never-throws.**
> **R5 수정 (Claude loop, 2026-07-02):** `src/lib/builder/storage/blob-env-guard.ts` + `src/instrumentation.ts`(`experimental.instrumentationHook`) — 비production Vercel 배포(VERCEL_ENV=preview/development)에서 서버 시작 시 `BLOB_READ_WRITE_TOKEN`을 제거해 35개 storage 모듈 전부(및 같은 패턴을 복사할 미래 모듈)가 file backend로 폴백. `BUILDER_USE_BLOB_IN_PREVIEW=1` 옵트인 지원. 핵심 2개 파일(site/persistence.ts, columns/storage.ts)에는 `isBlobBlockedForDeployEnv()` 명시 게이트도 이중 추가. 검증: guard 단위테스트 5통과, VERCEL_ENV=preview + dummy token으로 띄운 dev 서버 startup 로그에서 strip 확인 + /ko 200 (file backend 정상 렌더).
> **추가 수정 (fable5-execution, 2026-06-30):**
> - decompose `createBulletListNodes`/`createParagraphStackNodes` 빈배열→height 0 컨테이너 → `Math.max(1,…)` clamp (decompose-page-shared.ts). 검증: decompose suite 30 통과.
> - columns publish 라우트 slug를 `columnSlugSchema.safeParse`(kebab-case 정규식)로 검증 → `buildLocalColumnPath` path-traversal 차단 (columns/[slug]/publish/route.ts). 검증: columns route 12 테스트 통과.
> - `captureBuilderError`가 circular/BigInt에서 `JSON.stringify` throw → `safeStringifyError`로 감싸 "never throws" 계약 복구 (errors/capture.ts). 검증: circular+BigInt 프로브 통과, 기존 capture 3 테스트 통과.

## 1. 총평
전반적으로 builder는 매우 견고하게 설계됨. `strict: true` TS에 production `any` 사실상 0, 테스트 커버리지 우수(src/lib/builder 371 + src/components/builder 129 테스트 파일), 보안 자세 강함(38개 mutating 핸들러 전부 guard 경유, path-traversal 방어, constant-time 인증). 다만 **데이터 무결성/영속성 계층에 실제 data-loss 경로 3건**이 집중되어 있고, 그중 normalize fallback은 이미 production 사고(F15)를 낸 바 있어 최우선. 치명적 crash나 무인증 mutation 취약점은 없음.

## 2. 🔴 즉시 수정 권장

### R1. normalize fallback이 단일 잘못된 필드로 페이지 전체를 기본 템플릿으로 덮어씀 (SAVE 경로) — ✅ **수정 완료 (2026-06-30)**
- **수정:** `normalizeCanvasDocument`의 실패 경로(types.ts)에 **node-level repair** 추가 — 전체 문서 parse 실패 시 sandbox로 덮어쓰기 전에 `repairCanvasDocumentByNode`로 **스키마-유효 노드만 보존하고 무효 노드만 drop**(+ 고아 노드 cascade drop). 유효 노드는 절대 변형하지 않음(coerce 아님, drop만). 살릴 노드가 0개일 때만 fallback. Codex의 `sanitizeCanvasDocumentInput`(responsive 정화) 훅과 공존.
- **검증:** 무효 노드 1개 주입 시 about 페이지 193노드 전부 보존+무효 1개만 drop(빈 템플릿 아님), 유효 문서는 그대로(success path 무변), typecheck 0, responsive-schema-lock(Codex)+decompose+normalize 37+46 테스트 통과(회귀 없음).
- **남은 보강(선택):** 빈 data array→height 0 컨테이너는 decomposer(`decompose-page-shared.ts`)에서 `Math.max(1,…)` clamp 권장(현재는 repair가 그 노드를 drop해 페이지는 보존됨).

#### (원본 finding)
- **무엇:** `normalizeCanvasDocument`가 `safeParse` 실패 시 전체 문서를 `createDefaultCanvasDocument`로 교체 → draft POST가 영속화 → 작은 위반 1개가 작업물 전체 소실(F15 실증).
- **무엇:** `normalizeCanvasDocument`가 `safeParse` 실패 시 전체 문서를 `createDefaultCanvasDocument`(placeholder sandbox)로 교체. **draft POST가 그 결과를 영속화** → fontSize<12 / width<=0 / unknown `kind` / >1000 노드 / version!=1 중 하나만 걸려도 사용자 작업 전체 소실. 사용자엔 console.warn뿐.
- **어디:** `src/lib/builder/canvas/types.ts:2225-2243`, 저장경로 `.../[pageId]/draft/route.ts:164`. 실증: F15(pricing fontSize 11 4개 → 빈 페이지).
- **수정방향:** 노드 단위 parse로 문제 노드만 drop/clamp(repair), 유효 노드+메타 보존. top-level 실패 시 sandbox가 아니라 **직전 영속 문서로 fallback하거나 save를 에러로 거부**(기존 콘텐츠 위에 fallback 영속화 절대 금지). document `version` 마이그레이션 경로 추가.
- **연관:** 빈 data array → 높이 0 컨테이너 → `canvasRectSchema.positive()` 위반 → 이 fallback 발동. `createBulletListNodes`/`createParagraphStackNodes`(`decompose-page-shared.ts:271-283,227-245`) `height: Math.max(1,…)` clamp 또는 빈 배열 시 컨테이너 미emit. (admin-editable 경로로 도달 가능: TeamMember/contact/LegalPageContent)

### R2. 페이지 캔버스 read가 parse/transient 에러를 "페이지 없음"으로 삼킴 → ✅ **수정 완료 (2026-06-30)**
- **수정:** `readPageCanvasPayload`(site/persistence.ts)에서 file backend=ENOENT만 null, blob=404/not-found만 null로 처리하고 **그 외(권한, 손상/half-written JSON.parse, transient)는 rethrow**. 호출부(draft GET/PUT 라우트)가 try/catch로 에러응답 처리 → 빈 record로 덮어쓰기 대신 abort(no clobber). R3(atomic write)와 결합해 손상-read 체인 차단.
- **검증:** typecheck 0, persistence/decompose/page-route read-path 59 테스트 통과(not-found→null 정상 유지).

### R3. 핵심 write가 crash-safe 아님 → ✅ **수정 완료 (2026-06-30)**
- **수정:** site/persistence.ts에 `writeFileAtomicLocal`(temp 파일 write → `rename` atomic) 추가하고 핵심 local writer 4곳(site.json + page draft/published payload) 전부 교체. crash/OOM 중 truncate 손상 방지.
- **검증:** typecheck 0, decompose+page route write→read 28 테스트 통과(atomic write 정상 동작).
- **참고:** collab(comments/presence/markers)의 `writeFileAtomic`도 동일 패턴으로 교체 권장(이번 범위 외).

### R4. dead ternary가 optimistic-concurrency 충돌 가드를 무력화 — ✅ **수정 완료 (2026-06-30)**
- **무엇:** `normalizeExpectedRevision`/`normalizeExpectedSavedAt`의 `return value === undefined ? null : null`(양쪽 arm null) → malformed expectation(NaN/음수/비숫자)이 "기대값 없음"으로 처리되어 충돌검사 우회 → garbage `expectedRevision`으로 동시편집 clobber 가능.
- **어디:** `src/lib/builder/persistence.ts:991,998` (사용처 258-272 snapshot, 356-372 publish).
- **수정:** `undefined`→null(스킵, 의도대로); **defined-but-malformed→throw**(거부). 호출부가 이미 thrown error를 라우트에서 처리하므로 안전. typecheck 0, persistence/conflict 테스트 17 통과.
- **TODO:** garbage expectedRevision → 409/에러 회귀 테스트 추가 권장.

### R5. Blob 저장소에 per-environment namespace 없음 — preview/branch 배포가 production 데이터 변조
- **무엇:** `BLOB_PREFIX='builder-site'`/`COLUMN_BLOB_PREFIX` 상수에 환경 식별자 없음 + `isBlobBackend()`가 NODE_ENV==='production'만으로 전환. Vercel preview/branch도 NODE_ENV=production이며 production 토큰 상속 → 동일 키 read/write(allowOverwrite). columns 테스트오염(DATA-1)의 일반화.
- **어디:** `src/lib/builder/site/persistence.ts:38,87-93`, `columns/storage.ts:18,20-26`.
- **수정방향:** VERCEL_ENV 기반 prefix 분기(비production은 `${PREFIX}-preview/${VERCEL_GIT_COMMIT_REF}`) 또는 환경별 토큰/store. 최소 blob 게이트를 `VERCEL_ENV==='production'`로.

## 3. 🟡 개선 권장 (medium 발췌)
**Canvas editor:** viewport-hidden 노드가 marquee/Cmd+A로 선택됨(render gate와 불일치); normalize가 thin 노드(divider h2→32) 강제확대해 영속화(geometry 손상); duplicate가 노드 id는 remap하나 intra-content 참조(form steps fieldNodeIds)·anchorName 미remap; drag 중 undo/redo 시 document↔history 불일치; 잠긴 descendant가 unlocked ancestor 통해 삭제; undo history 무제한 증가(cap 권장).
**Decompose(에디터 기하):** services accordion 40px body에 282px 콘텐츠→카드 overlap; 컨테이너 off-by(firm-intro+16/offices+4/hero-links+7); home FAQ collapsed answer overlap; home-prefix id가 contact/services로 누출; `as never`(insights:247).
**APIs/persist:** columns publish만 slug schema 검증 누락; in-process write queue가 serverless 인스턴스 간 미직렬화; `/api/builder` 미들웨어 인증 backstop 없음(CI 가드 권장); dead `publishPage`(persistence.ts:1161-1190)가 publish gate 우회+console.log 7개; draft PUT normalize가 try 밖→malformed 500.
**Component library:** Restore 버튼이 복원 불가 시 silent no-op; restore-review optimistic resync 중복구현 drift 위험; remap confirm target 변경 시 silent abort.
**Admin nav:** query-string-only nav(`/ops?tab=security`)는 usePathname이 query 제거해 active 안 됨; `activePageId`가 `initialPageId` prop 변경 미동기화(autosave가 OLD 페이지에 PUT footgun).
**Cross-cutting:** `captureBuilderError`가 stringify로 circular/BigInt에서 throw(계약 위반); editable 리스트 index-as-key.

## 4. 🟢 강점
- 불변성/구조적 공유(updateNodes/sortNodes unchanged 시 동일참조, WeakMap 시그니처 no-op 단락), transient vs commit 분리로 drag가 undo 미오염
- cycle-safe 트리순회 전반, 반응형 cascade 정확·문서화 우수
- decompose 무결성: home+10페이지×3로케일 schema 위반 0/중복id 0/orphan 0/음수rect 0, 과거버그(F10/F12/F14/F15) root-cause+주석
- 보안: 38 mutating 핸들러 전부 guard, path-traversal 방어, constant-time, HMAC 세션 fail-closed, optimistic concurrency(409/428)
- 타입/테스트: strict TS, prod any~0, @ts-ignore 없음, 광범위 커버리지
- component-library/i18n: pure-helper/state-hook/presentational 분리, zod safeParse, en/ko/zh-hant parity 테스트, exhaustive never diff

## 5. 다음 단계 추천
1. **데이터 손실 체인 우선 차단(R1–R3 묶음, 상호연동):** atomic write(R3)→read 에러구분(R2)→node-resilient normalize+직전문서 fallback(R1, 빈배열 height clamp 포함). 단일 작업 클러스터로.
2. ~~R4~~ ✅ 완료.
3. R5 환경격리(VERCEL_ENV prefix/토큰) — 배포검증에 "preview가 production blob 미변조" 포함.
4. 회귀테스트: 빈배열→schema통과, "descendant가 직접 부모 box에 fit", 모든 mutating route guard import CI 가드.
5. 에디터 정확성 일괄(viewport-hidden 선택제외 + thin-node clamp + clone 참조/anchor remap).
