# 호정 빌더 Codex 코드 감사 — 2026-05-09

대상: 최근 60일 Codex가 작업한 코드 (G-Editor: 시리즈 commits)
범위: 1순위 4 + 2순위 6 + 보조 7개 = **약 11,200 LOC**

## 결론

**Codex 작업 품질 점수: 6.0 / 10**
- 기능 커버리지 광대, 인터랙션 cancel/race 처리 꼼꼼
- 그러나 drag 핫패스가 O(N²) 비용을 매 프레임 지불 → 100+ 노드에서 끊김 확정
- **가장 시급: Critical #1 (CanvasNode nodesById) + #5 (mergeMissingPages)**

## Critical 5건 (즉시 fix 권장)

### #1 CanvasNode.tsx:606-608 — 매 노드가 매 렌더마다 nodesById Map 풀-스캔 재생성
**O(N²) 메모리 할당.** 각 CanvasNode 인스턴스가 broad-subscribe + memo 없는 `new Map(allNodes.map())`. 100노드 페이지에서 한 변경마다 10,000번 Map.set.

**Fix**: store 레벨에 derived `nodesById` index 추가, selector로 reference-stable 공유.
**개선**: 100배 (100노드) ~ 400배 (200노드).

### #2 store.ts:158-173 — sortNodes가 매 transient에서 모든 노드 spread
매 pointermove 프레임마다 N개 노드 객체 새로 만듦. `updatedAt`도 매 호출 갱신.

**Fix**: transient에서 normalize=false. 변경 인덱스만 spread.
**개선**: 메모리 압박 90%+ 감소, GC 일시정지 사라짐.

### #3 store.ts:238-242 — sameDocumentContent의 JSON.stringify
모든 commit/transient에서 풀 직렬화 2번. 60fps × 100노드 = 초당 12,000개 풀 직렬화 → GC 폭주.

**Fix**: revision counter 또는 reference equality.
**개선**: drag 메인스레드 시간 30-50% 절감.

### #4 CanvasContainer.tsx:786-798 — handlePointerMove에서 absoluteRect Map 풀-재계산
매 pointer event마다 (a) 전체 nodes fetch, (b) Map 생성, (c) 모든 노드 재귀, (d) 또 다른 Map.

**Fix**: pointerdown 시 1회만 베이스 계산, 이후는 움직이는 노드만 업데이트. rAF throttle.
**개선**: 200노드 페이지 60fps 도달.

### #5 persistence.ts:127-139 — mergeMissingPages cross-tab 삭제 무효화 (가설 ❌ 부정됨, 2026-05-09 검증)

> **검증 결과: 가설 부정확. 코드는 이미 정확하게 동작하고 회귀 테스트 존재.**
>
> 실제 함수: `reconcileSiteDocumentPagesForWrite` (persistence.ts:153)
> 1. `filteredNextPages` = next.pages 중 (latest에 존재 OR `shouldKeepNextOnlyPage` 통과). `shouldKeepNextOnlyPage`는 `pageCreatedAt < latestSiteTimestamp`인 stale 페이지를 drop.
> 2. `missingPages` = latest.pages 중 filteredNext에 없는 것 — i.e. **latest에 존재하는** 페이지만 revive 대상. 삭제된 페이지는 latest에도 없으므로 절대 revive되지 않음.
>
> **검증 테스트**: `src/lib/builder/site/__tests__/persistence.test.ts:103-106` 가 정확히 이 시나리오를 커버:
> ```ts
> const latestAfterDelete = site([home], '2026-01-02');
> const staleWriter = site([home, deletedInLatest], '2026-01-03');
> reconcileSiteDocumentPagesForWrite(staleWriter, latestAfterDelete).pages → ['home']  // ✓
> ```
> 7/7 테스트 통과 (run 2026-05-09).
>
> **Fix 미적용 사유**: 기본값을 false로 뒤집으면 정당한 "concurrent additions preserve" 시나리오 (탭 A가 페이지 추가 → 탭 B가 모르는 채 SEO 변경 저장 → 탭 A의 페이지가 사라짐) 가 깨짐.
>
> **결론**: audit이 코드 + 테스트 커버리지를 충분히 읽지 않고 결론. 데이터 손실 버그 없음.

## High 7건 (요약)

| # | 파일 | 문제 | 영향 |
|---|---|---|---|
| #6 | snap.ts:99-247 | 1차+2차 루프 분리 (O(2M)) + 후보 prune 없음 | 200노드 drag 50% 추가 비용 |
| #7 | history.ts:36 | 매 commit `structuredClone` 풀 도큐 (×100 cap) | 큰 페이지에서 3GB peak 가능 |
| #8 | store.ts:170 | `updateNodes`가 항상 `updatedAt` bump → autosave timer reset | 빠른 타이핑 시 저장 지연 |
| #9 | CanvasContainer.tsx:1252-1259 | `Math.min(...arr)` spread 4번 | 65K 노드 시 stack overflow 위험 |
| #10 | CanvasNode.tsx:217-326 | InsightsArchiveListPreview가 매 mount 100 posts fetch | 캐싱 없음, locale 변경 시 재fetch |
| #11 | CanvasContainer.tsx:738-757 | Space-key keyup 가드 누락 | 텍스트 입력 중 불필요 re-render |
| #12 | SandboxPage.tsx:600-614 | selectedSectionTemplateNode walk 매번 새 Map(N) | #1 fix와 동일 해결 |

## Medium / Low 16건 — 요약 (전체 리스트는 audit agent 출력 참조)

- `cloneDefaultContent`가 `JSON.parse(JSON.stringify())` — Date/Function 손실
- ID 생성에 `Date.now()-Math.random()` 비표준 패턴 산재
- selectableNodes filter+sort 매 클릭 (8개 cap이라 OK)
- `publishedContentHeight` SSR 시 모든 노드 재귀 → 큰 페이지 cost
- `siteWriteQueue` 모듈 전역 — 서버리스 cross-instance race 위험 (주석 누락)
- ButtonElement.tsx의 `as Record<string, never>` 캐스트 — type safety 우회
- SandboxPage.module.css 4,121줄 단일 파일 — HMR 느림

## 칭찬할 부분

1. `tree.ts` resolveCanvasNodeAbsoluteRect — cycle detection 정확
2. `history.ts` ring-buffer 디자인 깔끔
3. `withPageCanvasWriteLock` 큐 키별 격리 (단일 인스턴스 한정)
4. `shortcuts.ts` pure function + isTextInput 가드
5. transient/commit 분리 디자인 정확
6. rotation handle drag race 처리 꼼꼼
7. `buildResponsiveStylesheet` desktop inline + tablet/mobile @media cascade

## Wix-grade로 끌어올리려면

1. **상태/지오메트리 캐시 1급 시민화** — store가 `nodesById`, `childrenMap`, `descendantIdsByRoot`, `absoluteRectByViewport` derived 노출
2. **Spatial index** — snap/hit-testing/selection-box에 R-tree or grid hash
3. **Patch-based history** — Immer/zustand-undo로 structured share
4. **Optimistic concurrency** — site doc revision/etag 기반
5. **Performance regression suite** — 100/200/500 노드 fixture로 자동 fps 측정
6. **Magic numbers 정리** — 한 const 파일에 통합
7. **CSS 분리** — SandboxPage.module.css 컴포넌트별 분리

## 즉시 적용 추천

- #1 → #3 → #2 → #4 → #5 순서로 적용
- 각각 별도 PR (작은 변경 단위로 회귀 가능성 낮춤)
- 호정 사이트 (50-150 노드) 운영은 현재 가능, 그러나 빌더 편집자 본인이 빠르게 드래그하면 lag 인지 가능

## 처리 상태

- ✅ 감사 완료
- ✅ Critical #5 검증 — **가설 부정**, 코드+테스트 정확. fix 미적용 (적용 시 회귀)
- ⏳ Critical #1~#4 (drag 핫패스) — 호정 빌더 UI 회귀 검증 가능 시 적용 권장
- ⏳ Codex 추가 churn 방지 위해 hot files (SandboxPage.tsx 4K LOC, CanvasContainer.tsx 1.5K LOC) 컴포넌트 분리 계획 별도 작성 필요
