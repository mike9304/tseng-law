# CODEX 발주 — Wave 3 / D3 Audit Foundation

> **발행일**: 2026-05-01
> **선행**: Wave 2 D2 (guard coverage, bucket: mutation/publish/asset)
> **분담**: 엔지니어 4 (QA/Security/Release) 단독.
> **충돌 회피**: `src/lib/builder/audit/`는 **신규 디렉토리**. 다른 트랙과 충돌 없음. 기존 라우트에 1줄씩 audit 호출 추가만.

---

## 1. 목적

운영 가시성을 위한 **builder 이벤트 audit log foundation**. 누가 언제 어떤 페이지를 발행했는지, asset을 업로드/삭제했는지, column을 발행했는지 기록. 단 **민감 데이터는 절대 저장 안 함** (request body, credentials, 업로드 바이트, full webhook URL, form value).

체감 동작:
- 사용자가 publish → audit log에 `{ type: 'publish.success', siteId, pageId, revision, actorRef, at }` 한 줄
- publish blocker 발견 → `{ type: 'publish.blocked', siteId, pageId, blockerCount, at }`
- asset upload → `{ type: 'asset.upload', assetId, mime, size, at }` (파일 내용 X)
- column publish → `{ type: 'column.publish', slug, locale, at }`
- audit log는 append-only, 시간순. 일정 기간 후 rotate (이 PR은 rotate 미구현, 후속).

---

## 2. 작업 범위

### 2.1 audit 도메인

`src/lib/builder/audit/types.ts` (**신규**):

```ts
export type AuditEventType =
  | 'asset.upload' | 'asset.delete'
  | 'publish.success' | 'publish.blocked' | 'publish.failure'
  | 'page.rollback'
  | 'column.create' | 'column.update' | 'column.delete' | 'column.publish';

export interface AuditEventBase {
  type: AuditEventType;
  at: string;        // ISO
  actorRef?: string; // 'admin' or session id; never PII
  siteId?: string;
  pageId?: string;
}

export interface AssetUploadEvent extends AuditEventBase {
  type: 'asset.upload';
  assetId: string;
  mime: string;
  size: number;          // bytes
}
// ... per-type variants ...

export type AuditEvent = AssetUploadEvent | AssetDeleteEvent | PublishSuccessEvent | ...;

const FORBIDDEN_KEYS = new Set([
  'body', 'rawBody', 'request', 'response',
  'authorization', 'cookie', 'password', 'token', 'apiKey',
  'submission', 'formValue', 'webhook', 'webhookUrl',
  'fileBytes', 'imageBytes',
]);
```

### 2.2 store / write path

`src/lib/builder/audit/store.ts` (**신규**):

local file-based audit log:
```ts
const AUDIT_LOG_PATH = process.env.BUILDER_AUDIT_LOG_PATH ?? path.join(process.cwd(), 'data', 'audit', 'builder-audit.jsonl');

export async function writeAuditEvent(event: AuditEvent): Promise<void> {
  // 1. enforce schema (zod 또는 type guard)
  // 2. assert no FORBIDDEN_KEYS in event payload (deep)
  // 3. ensure dir exists
  // 4. append jsonl line
  // 5. fail-soft: console.warn on disk error, do NOT throw (audit failure shouldn't break business path)
}
```

JSONL append-only는 회전 없이도 안전. rotate는 별도.

### 2.3 high-level API

`src/lib/builder/audit/record.ts` (**신규**):

```ts
export async function recordAssetUpload(opts: { request: Request; assetId: string; mime: string; size: number }): Promise<void>;
export async function recordAssetDelete(opts: { request: Request; assetId: string }): Promise<void>;
export async function recordPublishSuccess(opts: { request: Request; siteId: string; pageId: string; revision: number; revisionId: string }): Promise<void>;
export async function recordPublishBlocked(opts: { request: Request; siteId: string; pageId: string; blockerCount: number }): Promise<void>;
export async function recordPublishFailure(opts: { request: Request; siteId: string; pageId: string; reason: string }): Promise<void>;
export async function recordPageRollback(opts: { ... }): Promise<void>;
export async function recordColumnEvent(opts: { request: Request; type: 'create'|'update'|'delete'|'publish'; slug: string; locale: string }): Promise<void>;
```

각 함수가 actorRef 추출 (Basic auth 헤더에서 'admin' 등 — credential은 저장 X), at = ISO now, fields 정제 후 writeAuditEvent 호출.

### 2.4 호출 추가 (1~2 라인씩)

기존 라우트 endpoint에서 success/blocked/failure 시점에 record* 호출:

- `src/app/api/builder/assets/route.ts` POST (upload) → `recordAssetUpload`
- `src/app/api/builder/assets/[id]/route.ts` DELETE → `recordAssetDelete`
- `src/app/api/builder/site/pages/[pageId]/publish/route.ts` POST → success/blocked/failure 분기 (A3 worker 결과와 통합)
- `src/app/api/builder/columns/route.ts` POST → `recordColumnEvent('create')`
- `src/app/api/builder/columns/[slug]/route.ts` PATCH/DELETE → `update`/`delete`
- `src/app/api/builder/columns/[slug]/publish/route.ts` POST → `publish`
- (페이지 rollback API가 있으면) `recordPageRollback`

### 2.5 admin 조회 route (선택)

`src/app/api/builder/site/audit/route.ts` (선택, 시간 충분하면):

```ts
export async function GET(request) {
  const auth = await guardBuilderRead(request);
  if (auth) return auth;
  // tail last 200 lines from JSONL
  // return { events: [...] }
}
```

UI는 이 PR 비범위 (D4 또는 audit dashboard 별도 트랙).

---

## 3. 파일

**신규**:
- `src/lib/builder/audit/types.ts`
- `src/lib/builder/audit/store.ts`
- `src/lib/builder/audit/record.ts`
- `src/app/api/builder/site/audit/route.ts` (선택)

**수정** (각각 1~3 라인 추가):
- `src/app/api/builder/assets/route.ts`
- `src/app/api/builder/assets/[id]/route.ts` (있으면)
- `src/app/api/builder/site/pages/[pageId]/publish/route.ts` (A3와 협력)
- `src/app/api/builder/columns/route.ts`
- `src/app/api/builder/columns/[slug]/route.ts`
- `src/app/api/builder/columns/[slug]/publish/route.ts`

**테스트**:
- `src/lib/builder/audit/__tests__/store.test.ts` — FORBIDDEN_KEYS rejection, JSONL append, fail-soft on dir error

---

## 4. 비범위

- audit log retention / rotate / archive (별도)
- audit log UI dashboard (D4 또는 별도)
- multi-tenant actorRef (지금은 admin 단일)
- audit event signing / tamper detection
- request rate metrics (다른 시스템)

---

## 5. 검증

### 자동
```bash
npm run typecheck
npm run lint
npm run test:unit              # audit/__tests__ 추가됨
npm run security:builder-routes
npm run build
BUILDER_SMOKE_TIMEOUT_MS=30000 npm run smoke:builder
```

`audit/__tests__/store.test.ts` 권장:
```ts
describe('writeAuditEvent', () => {
  it('appends event to JSONL', async () => { ... });
  it('rejects event with FORBIDDEN_KEYS', async () => {
    await expect(writeAuditEvent({ type: 'asset.upload', body: 'leak' } as any))
      .rejects.toThrow(/forbidden/i);
  });
  it('does not throw on disk error', async () => {
    // mock fs.appendFile to throw
    // → console.warn but no throw
  });
});
```

### Manual
1. asset upload → JSONL에 한 줄 (`type: asset.upload, assetId, mime, size`)
2. publish success → `publish.success`
3. publish blocker → `publish.blocked` + blockerCount, blocker 텍스트는 저장 X
4. `cat data/audit/builder-audit.jsonl | tail -10` → request body / authorization 헤더 / form value 등 절대 안 보여야 함

```bash
# 일부러 forbidden 데이터로 호출 시도 → console.warn + write skip
# (코드 단위 테스트로 커버)
```

### Inspection
```bash
# audit 호출 추가된 endpoint 모두 record* 호출하는지
rg -n 'record(Asset|Publish|Column|PageRollback)' src/app/api/builder/
```

---

## 6. 검증 통과 기준

- 자동 게이트 모두 ✅
- audit 단위 테스트 통과 (FORBIDDEN_KEYS rejection + JSONL append + fail-soft)
- Manual 1~3 모두 JSONL에 정확히 한 줄
- JSONL에 PII / credential / form value 0 건
- audit 쓰기 실패해도 business path (publish, asset upload) 안 깨짐 (fail-soft)

작업 끝나면 SESSION.md에 결과 한 줄.
