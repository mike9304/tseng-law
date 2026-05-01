# CODEX 발주 — Wave 3 / A3 Publish Transaction (Revision Fail-Closed)

> **발행일**: 2026-05-01
> **선행**: Wave 2 A2 (PageCanvasRecord envelope, expectedRevision CAS, 200/409/428)
> **분담**: 엔지니어 1 (Core/Persistence) 단독.
> **충돌 회피**: `types.ts`는 **append-only** (E3 worker도 append 중). `public-page.tsx`는 publish revision pointer 분기만 추가 (E3는 head/dark mode만). `persistence.ts`는 이 트랙 단독 점유.

---

## 1. 목적

A2가 draft 단계 데이터 손실을 막았다면, A3는 **publish 단계 데이터 손실 + 부분 실패**를 막는다. publish는 5단계 트랜잭션으로 정의되고, 그 중 어느 한 단계가 실패하면 publish가 성공으로 보고되지 않는다 (fail-closed).

체감 동작:
- 사용자가 "Publish" 버튼 클릭
- publish-checks가 blocker 발견 → **422** + 명확한 메시지. 발행 안 됨.
- draft가 stale (다른 탭에서 이미 다른 revision으로 저장) → **409** + current revision 표시. 발행 안 됨.
- revision 파일 쓰기 실패 (디스크 full, 권한, etc.) → **500** + publish UI에 실패 표시. 공개 페이지는 이전 revision 유지.
- 모든 단계 성공 → **200** + site doc의 page meta가 `publishedRevisionId` 포인터를 immutable revision으로 업데이트.

---

## 2. 작업 범위

### 2.1 Page meta 필드 확장 (append-only)

`src/lib/builder/site/types.ts` — `BuilderPageMeta`에 4 필드 추가:

```ts
export interface BuilderPageMeta {
  // ... 기존 필드 그대로 ...
  publishedRevisionId?: string;       // immutable revision 파일 식별자
  publishedRevision?: number;          // 발행 시점의 revision 번호
  publishedSavedAt?: string;           // 발행 시점의 ISO 시각
  lastPublishedDraftRevision?: number; // 발행 시 사용된 draft revision (rollback 비교용)
}
```

기존 export는 **절대 수정 금지** (E3 worker가 append 중).

### 2.2 recordRevision throw on failure

`src/lib/builder/site/persistence.ts`:

기존 `recordRevision()` 또는 동등 함수가 silent failure(undefined return, swallow error)를 하고 있다면 **throw**로 격상.

```ts
export async function recordRevision(
  siteId: string,
  pageId: string,
  record: PageCanvasRecord,
): Promise<{ revisionId: string; revision: number }> {
  // 파일 쓰기 실패 → throw new Error('revision_write_failed')
  // 디렉토리 미존재 → ensure dir, then write
  // 성공 → return { revisionId, revision }
}
```

### 2.3 Publish 5단계 트랜잭션

`src/lib/builder/site/publish.ts`:

```ts
export async function publishPage(
  siteId: string,
  pageId: string,
  options: { expectedDraftRevision?: number },
): Promise<PublishResult> {
  // 1. read draft record
  const draftState = await readPageCanvasRecordState(siteId, pageId, 'draft');
  if (!draftState) throw new PublishError('draft_not_found', 404);

  // 2. verify expected draft revision (옵션 — UI에서 보내면 검증)
  if (options.expectedDraftRevision !== undefined &&
      options.expectedDraftRevision !== draftState.record.revision) {
    throw new PublishError('draft_stale', 409, {
      current: { revision: draftState.record.revision }
    });
  }

  // 3. run publish checks (publish-gate)
  const checks = await runPublishChecks(siteId, pageId, draftState.record.document);
  if (checks.blockers.length > 0) {
    throw new PublishError('publish_blocked', 422, { blockers: checks.blockers });
  }

  // 4. write immutable revision (실패 시 throw — fail-closed)
  const { revisionId, revision } = await recordRevision(siteId, pageId, draftState.record);

  // 5. update site page meta pointer + write site document
  const site = await ensureSiteDocument(siteId, draftState.record.document.locale);
  const page = site.pages.find((p) => p.pageId === pageId);
  if (!page) throw new PublishError('page_not_in_site', 500);
  page.publishedRevisionId = revisionId;
  page.publishedRevision = revision;
  page.publishedSavedAt = new Date().toISOString();
  page.lastPublishedDraftRevision = draftState.record.revision;
  await writeSiteDocument(siteId, site);

  return { ok: true, revisionId, revision, publishedSavedAt: page.publishedSavedAt };
}
```

`PublishError`는 새 클래스. `status` 코드 + `body` payload 포함.

### 2.4 Publish API route

`src/app/api/builder/site/pages/[pageId]/publish/route.ts`:

POST body:
```json
{ "expectedDraftRevision": 12 }
```

응답:
- `200` → `{ ok: true, publishedRevisionId, publishedRevision, publishedSavedAt }`
- `409 draft_stale` → `{ ok: false, error: 'draft_stale', current: { revision } }`
- `422 publish_blocked` → `{ ok: false, error: 'publish_blocked', blockers: [...] }`
- `404 draft_not_found` → `{ ok: false, error: 'draft_not_found' }`
- `500` → `{ ok: false, error: 'revision_write_failed' | ... }`

```ts
export async function POST(request, { params }) {
  const auth = guardMutation(request, { bucket: 'publish' });
  if (auth instanceof NextResponse) return auth;

  const body = await request.json().catch(() => ({}));
  try {
    const result = await publishPage(DEFAULT_BUILDER_SITE_ID, params.pageId, {
      expectedDraftRevision: body.expectedDraftRevision,
    });
    return NextResponse.json(result);
  } catch (e) {
    if (e instanceof PublishError) {
      return NextResponse.json({ ok: false, error: e.code, ...e.body }, { status: e.status });
    }
    return NextResponse.json({ ok: false, error: 'internal' }, { status: 500 });
  }
}
```

### 2.5 Public read path uses revision pointer

`src/lib/builder/site/public-page.tsx`:

기존 published.json read가 **legacy/cache fallback**으로 격상. 우선순위:
1. `page.publishedRevisionId` 있으면 immutable revision 파일 read
2. 없으면 (legacy 페이지) 기존 published.json fallback

이렇게 해야 publish 도중 실패가 공개 페이지를 깨뜨리지 않음. revision write가 fail-closed니까 page meta pointer가 업데이트 안 되면 public 페이지는 이전 revision을 계속 가리킴.

### 2.6 Publish UI 연동 (선택)

`src/components/builder/canvas/PublishModal.tsx`:

- publish 버튼 누르면 `expectedDraftRevision: draftMeta.revision` 첨부해서 POST
- 응답:
  - 422: blocker 리스트를 모달 안에 표시 (이미 `BlockerList` 컴포넌트 있음)
  - 409: "draft가 이미 다른 탭에서 발행됨. 새로고침" 토스트
  - 500: "발행 실패. 다시 시도" 토스트
  - 200: 성공 토스트 + 모달 닫기

### 2.7 PublishError 클래스

`src/lib/builder/site/publish.ts` 또는 `src/lib/builder/site/errors.ts` (선택 신규):

```ts
export class PublishError extends Error {
  constructor(
    public code: string,
    public status: number,
    public body: Record<string, unknown> = {},
  ) {
    super(code);
    this.name = 'PublishError';
  }
}
```

---

## 3. 파일

**수정**:
- `src/lib/builder/site/types.ts` — `BuilderPageMeta`에 publish meta 4 필드 append (다른 export 건드리지 마)
- `src/lib/builder/site/persistence.ts` — `recordRevision()` throw on failure
- `src/lib/builder/site/publish.ts` — 5단계 트랜잭션 + PublishError
- `src/lib/builder/site/public-page.tsx` — published.json fallback path (revision pointer 우선)
- `src/app/api/builder/site/pages/[pageId]/publish/route.ts` — body parse + PublishError → status code
- `src/components/builder/canvas/PublishModal.tsx` — 422/409 UI 분기

**신규**: 없음 (PublishError class는 publish.ts에 inline)

---

## 4. 비범위

- Rollback (lastPublishedDraftRevision은 메타로만, rollback 트랜잭션은 별도 트랙)
- Multi-page atomic publish (이 PR은 단일 페이지)
- CDN cache invalidation
- Audit log of publish events (D3에서)

---

## 5. 검증

### 자동
```bash
npm run typecheck
npm run lint
npm run test:unit
npm run security:builder-routes
npm run build
BUILDER_SMOKE_TIMEOUT_MS=30000 npm run smoke:builder
```

### 수동 (curl)
```bash
PAGE_ID="page-1777598531366-3"  # services
URL="http://localhost:3000/api/builder/site/pages/$PAGE_ID/publish"
AUTH=(-u admin:'local-review-2026!')

# 1. blocker 만들기 — 일부러 publish-gate 위반 doc로 draft 저장 → publish → 422
# (e.g., asset 누락, alt 누락 등)

# 2. stale draft revision 보내기 → 409
curl -i -X POST "${AUTH[@]}" -H 'Content-Type: application/json' \
  -d '{"expectedDraftRevision": 0}' "$URL"

# 3. 정상 publish → 200 + publishedRevisionId 응답
curl -s "${AUTH[@]}" "http://localhost:3000/api/builder/site/pages/$PAGE_ID/draft" | jq .draft
# draft.revision=N
curl -i -X POST "${AUTH[@]}" -H 'Content-Type: application/json' \
  -d "{\"expectedDraftRevision\": N}" "$URL"
# → 200 + publishedRevisionId
```

### Manual
1. 빌더에서 페이지 편집 → Publish 모달 → blocker 있을 때 422 → 모달에 blocker 리스트 표시
2. 다른 탭에서 publish 먼저 → 첫 탭 publish 시도 → 409 토스트
3. 정상 publish → 공개 페이지(`/ko`)가 새 revision 반영
4. site doc(`builder-site/<siteId>.json`)에 page.publishedRevisionId/Revision/SavedAt 들어옴

---

## 6. 검증 통과 기준

- 자동 게이트 모두 ✅
- curl 시나리오 1~3 모두 명시 코드 + body
- site doc 메타에 publish 4 필드 들어옴
- public 페이지가 immutable revision read (revision pointer 따라감)
- revision write 실패 (강제로 디스크 권한 테스트) → 500 + publish UI 실패 + 공개 페이지 유지

작업 끝나면 SESSION.md에 결과 한 줄.
