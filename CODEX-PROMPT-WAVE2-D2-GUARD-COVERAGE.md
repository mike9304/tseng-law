# CODEX 발주 — Wave 2 / D2 Guard Coverage

> **발행일**: 2026-05-01
> **선행**: Wave 1 D1 (`scripts/assert-builder-route-guards.mjs`, `npm run security:builder-routes`)
> **분담**: 엔지니어 4 (QA/Security) 단독.
> **충돌 회피**: 다른 worker와 mutation route 파일 겹침 없음. 이 트랙은 4개 mutation 라우트 + `security/guard.ts` 점유.

---

## 1. 목적

현재 보안 스캐너가 **64개 builder route 중 4개를 "auth-only guard" 경고로 통과**시키고 있다. 이건 임시 우회. 진짜 `guardMutation` 보호로 격상하고, asset 관리 route를 admin-only로 잠근다.

목표 상태:
- `npm run security:builder-routes` 출력에서 **"auth-only" 경고 0건**
- 64 routes / 60 mutation handlers / **모두 `guardMutation` 또는 명시적 admin guard로 보호**
- asset list (`GET /api/builder/assets`)는 admin-only, asset byte는 public-by-reference 유지

---

## 2. 작업 범위

### 2.1 guard.ts 확장

`src/lib/builder/security/guard.ts`:

기존 `guardMutation(request)`를 buckets로 확장:

```ts
type GuardBucket = 'mutation' | 'publish' | 'asset';

interface GuardOptions {
  bucket?: GuardBucket;       // default: 'mutation'
  allowReadOnly?: boolean;
}

export async function guardMutation(
  request: Request,
  options: GuardOptions = {}
): Promise<NextResponse | null> {
  // 1. Basic auth admin check (existing)
  // 2. CSRF/origin check (existing)
  // 3. rate limit per bucket
  // 4. return null on pass, NextResponse on block
}
```

bucket별 rate limit (메모리 또는 기존 throttle 어댑터):
- `mutation`: 60/min per ip
- `publish`: 6/min per ip
- `asset`: 30/min per ip

신규 helper:

```ts
export async function guardBuilderRead(
  request: Request
): Promise<NextResponse | null> {
  // admin Basic auth만 통과
  // 일반 GET API에 사용
}
```

### 2.2 4개 auth-only mutation을 guardMutation으로 격상

대상:
1. `src/app/api/builder/columns/[slug]/route.ts` — PATCH
2. `src/app/api/builder/columns/[slug]/route.ts` — DELETE
3. `src/app/api/builder/columns/route.ts` — POST
4. `src/app/api/builder/sandbox/draft/route.ts` — PUT

각 핸들러 첫 줄:
```ts
const blocked = await guardMutation(request, { bucket: 'mutation' });
if (blocked) return blocked;
```

기존에 있던 raw Basic auth 체크는 `guardMutation` 안에 흡수됐으니 제거.

### 2.3 asset list admin-only

`src/app/api/builder/assets/route.ts`:

- `GET /api/builder/assets` (목록): `guardBuilderRead(request)` 추가 → admin 외 401
- `POST /api/builder/assets` (업로드): `guardMutation(request, { bucket: 'asset' })`
- `DELETE /api/builder/assets/[id]`: `guardMutation(request, { bucket: 'asset' })` (이미 mutation guard 있으면 bucket만 'asset'으로 변경)

asset byte route(`/api/builder/assets/[id]/byte`)는 변경 없음 — public-by-reference 유지.

### 2.4 publish route bucket 정리

`src/app/api/builder/site/pages/[pageId]/publish/route.ts` 같은 publish 라우트는 `bucket: 'publish'`로 명시. 이미 guardMutation 쓰고 있다면 옵션만 추가.

### 2.5 스캐너 갱신 (필요 시)

`scripts/assert-builder-route-guards.mjs`:
- "auth-only equivalent" 우회 코드 제거 → fully guarded만 통과
- "auth-only" 경고 = 실패로 격상
- 출력에 bucket 정보 표시 (선택)

---

## 3. 파일

**수정**:
- `src/lib/builder/security/guard.ts` — bucket 옵션, `guardBuilderRead` 신규
- `src/app/api/builder/columns/route.ts` — POST guard
- `src/app/api/builder/columns/[slug]/route.ts` — PATCH/DELETE guard
- `src/app/api/builder/sandbox/draft/route.ts` — PUT guard
- `src/app/api/builder/assets/route.ts` — GET admin-only, POST asset bucket
- `src/app/api/builder/assets/[id]/route.ts` — DELETE asset bucket (있으면)
- 모든 `publish` 라우트 — `bucket: 'publish'` 명시
- `scripts/assert-builder-route-guards.mjs` — auth-only 경고를 실패로 격상

**신규**: 없음

---

## 4. 비범위

- 사용자별 권한 분기 (admin / editor / viewer 역할 시스템) — Audit/Auth 트랙에서 별도
- audit 로깅 (D3에서)
- CSRF token 강화 — guardMutation 내부에 이미 origin 체크 있다고 가정

---

## 5. 검증

### 자동
```bash
npm run typecheck
npm run lint
npm run security:builder-routes   # 출력에 "auth-only" 단어 0건
npm run build
BUILDER_SMOKE_TIMEOUT_MS=30000 npm run smoke:builder
```

### 수동 (curl)

미인증 mutation 시도:
```bash
# columns POST without auth → 401
curl -i -X POST http://localhost:3000/api/builder/columns \
  -H 'Content-Type: application/json' -d '{"slug":"x"}'

# sandbox draft PUT without auth → 401
curl -i -X PUT http://localhost:3000/api/builder/sandbox/draft \
  -H 'Content-Type: application/json' -d '{}'

# asset list without auth → 401
curl -i http://localhost:3000/api/builder/assets

# asset byte without auth → 200 (public reference 유지)
curl -i http://localhost:3000/api/builder/assets/<known-id>/byte
```

인증 시도 (모두 정상):
```bash
curl -u admin:'local-review-2026!' -X POST \
  http://localhost:3000/api/builder/columns \
  -H 'Content-Type: application/json' \
  -d '{"slug":"test-slug","locale":"ko","title":"t"}' -i
```

### rate-limit 확인 (선택)
```bash
# publish bucket: 7회 빠르게 → 마지막 요청 429
for i in {1..7}; do
  curl -s -o /dev/null -w "%{http_code}\n" \
    -X POST -u admin:'local-review-2026!' \
    http://localhost:3000/api/builder/site/pages/home/publish
done
```

---

## 6. 검증 통과 기준

- 자동 게이트 모두 ✅
- `security:builder-routes` 출력 "**auth-only**" 단어 0건
- 모든 builder mutation route가 `guardMutation` (또는 동등) 보호
- asset list가 401, asset byte는 200 유지 (curl 시나리오)
- publish/asset bucket은 별도 rate limit (선택, 시간 부족하면 mutation bucket과 같아도 OK)

작업 끝나면 SESSION.md에 결과 한 줄 추가:
> "D2 guard coverage 완료. 4 auth-only → 0. asset list admin-only. publish/asset bucket 분리."
