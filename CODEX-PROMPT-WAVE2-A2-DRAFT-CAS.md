# CODEX 발주 — Wave 2 / A2 Draft Save Revision (CAS)

> **발행일**: 2026-05-01
> **선행**: Wave 1 A1 (canonical site id, `ensureSiteDocument`)
> **분담**: 엔지니어 1 (Core/Persistence) 단독. 다른 worker와 파일 겹치지 않음.
> **충돌 회피**: `canvas/types.ts`는 **append-only**로만 수정 (E2 worker도 이 파일에 키 추가 중). `pages/[pageId]/draft/route.ts`는 이 트랙 단독 점유.

---

## 1. 목적

두 탭에서 동시에 저장 누를 때 **늦게 저장한 사람이 먼저 저장한 사람의 변경을 무성공으로 덮어쓰는 사고**를 막는다. HTTP 단계 CAS(Compare-And-Swap)를 도입해 stale write를 409로 거절한다.

체감 동작:
- 사용자 A가 탭 1에서 draft 저장 → revision 5 → 7
- 사용자 A가 탭 2에서 같은 페이지를 열어둔 상태로 저장 시도 → 409 conflict
- 빌더 UI는 conflict state로 진입, autosave 일시정지, 사용자 결정(merge 또는 reload) 대기

---

## 2. 작업 범위

### 2.1 storage envelope 도입

`BuilderCanvasDocument`는 그대로 두고, **저장 레이어 envelope**를 새로 만든다. revision은 envelope 메타에만 둔다.

```ts
// src/lib/builder/site/types.ts (append)
export interface PageCanvasRecord {
  revision: number;          // 0 부터 시작, 매 PUT 성공시 +1
  savedAt: string;           // ISO
  updatedBy?: string;        // 추후 audit용. 일단 'admin' 또는 undefined
  document: BuilderCanvasDocument;
}
```

### 2.2 persistence 레이어

`src/lib/builder/site/persistence.ts`:

- `readPageCanvasRecord(siteId, pageId): Promise<PageCanvasRecord | null>` 신규
- `writePageCanvasRecord(siteId, pageId, record): Promise<void>` 신규
- 기존 `readPageCanvas(siteId, pageId)` / `writePageCanvas(siteId, pageId, doc)`는 **legacy adapter**로 유지:
  - read는 record가 있으면 `record.document`, 없으면 raw 파일을 `revision: 0`으로 해석
  - write는 내부적으로 record로 wrap (revision auto-increment 옵션 추가)
- legacy raw 파일이 없을 때만 record 신규 생성

### 2.3 API 라우트

`src/app/api/builder/site/pages/[pageId]/draft/route.ts`:

**GET**: 응답 형태 변경
```jsonc
{
  "draft": { "revision": 7, "savedAt": "2026-05-01T...", "updatedBy": "admin" },
  "document": { /* BuilderCanvasDocument */ }
}
```
legacy raw 파일만 있으면 `revision: 0` 반환.

**PUT**: body
```jsonc
{
  "expectedRevision": 7,        // record가 이미 존재하면 필수
  "document": { /* canvas */ }
}
```
응답 코드:
- `200 OK` — `{ draft: { revision: 8, savedAt, ... }, document }`
- `409 draft_conflict` — `expectedRevision !== current.revision` → `{ error: 'draft_conflict', current: { revision, savedAt } }`
- `428 precondition_required` — record 존재하는데 `expectedRevision` 누락 → `{ error: 'expected_revision_required', current: { revision } }`
- `200 OK` — record 미존재(legacy or first save) + `expectedRevision === 0 || undefined` 허용

### 2.4 클라이언트

`src/components/builder/canvas/SandboxPage.tsx`:

- 신규 state: `draftMeta: { revision, savedAt } | null`
- 페이지 로드 후 `draftMeta` 저장
- 모든 PUT에 `expectedRevision: draftMeta?.revision`을 함께 보냄
- 응답 200이면 `draftMeta`를 응답값으로 갱신
- 응답 409:
  - `draftMeta`를 응답의 `current`로 갱신
  - autosave timer 중단
  - UI에 `Conflict — 다른 탭에서 저장됨. 새로고침해서 최신본을 가져오거나, 변경사항을 다른 곳에 백업한 뒤 reload 하세요.` 띄움
  - 사용자가 "새로고침" 버튼 클릭 → GET draft 재실행 → 빌더 doc 교체 → autosave 재개
- 응답 428: 즉시 GET draft 다시 호출해 `draftMeta` 채우고 PUT 재시도 (이건 blind retry 허용)

`src/components/builder/canvas/PublishModal.tsx`:

- publish 호출 직전 `draftMeta`를 함께 보내거나, 이 PR에선 publish는 안 건드리고 `draftMeta`만 표시 (revision N 기준 발행 예정)

`src/components/builder/canvas/VersionHistoryPanel.tsx`:

- revision 표시할 때 record envelope의 `revision`/`savedAt`을 우선 사용. legacy 파일은 `0`으로 표시.

---

## 3. 파일

**수정**:
- `src/lib/builder/site/types.ts` — `PageCanvasRecord` append (다른 export 건드리지 마)
- `src/lib/builder/site/persistence.ts` — `read/writePageCanvasRecord` 추가, 기존 `read/writePageCanvas` adapter화
- `src/app/api/builder/site/pages/[pageId]/draft/route.ts` — GET/PUT 형태 변경, 409/428 도입
- `src/components/builder/canvas/SandboxPage.tsx` — `draftMeta` state + autosave 흐름 + conflict UI
- `src/components/builder/canvas/PublishModal.tsx` — `draftMeta` 표시
- `src/components/builder/canvas/VersionHistoryPanel.tsx` — record envelope 우선

**신규**: 없음 (자료 구조만 추가)

---

## 4. 비범위 (이 PR에서 안 건드림)

- 사용자 인증 / `updatedBy` 실제 값 (audit 트랙 D3에서)
- publish CAS (A3에서)
- merge UI / 3-way merge — 이 PR은 "막기"만, "병합"은 후속

---

## 5. 검증

### 자동
```bash
npm run typecheck
npm run lint
npm run security:builder-routes   # /draft 라우트 guardMutation 유지 확인
npm run build
BUILDER_SMOKE_TIMEOUT_MS=30000 npm run smoke:builder
```

### 수동 (curl)
```bash
# 0. 현재 draft 읽기
curl -s -u admin:'local-review-2026!' \
  http://localhost:3000/api/builder/site/pages/home/draft | jq '.draft'

# 1. 첫 저장 (legacy 페이지였다면 expectedRevision 생략 OK)
curl -s -X PUT -u admin:'local-review-2026!' \
  -H 'Content-Type: application/json' \
  -d '{"expectedRevision": 0, "document": { ... }}' \
  http://localhost:3000/api/builder/site/pages/home/draft

# 2. stale write 시도 (같은 expectedRevision으로 다시)
# → 409 draft_conflict 받아야 함

# 3. expectedRevision 누락
curl -s -X PUT -u admin:'local-review-2026!' \
  -d '{"document": { ... }}' \
  http://localhost:3000/api/builder/site/pages/home/draft
# → 428 precondition_required
```

### 브라우저 manual
1. 탭 두 개로 같은 페이지 (`/ko/admin-builder` → home) 열기
2. 탭 A에서 텍스트 수정 → 저장 (autosave OK)
3. 탭 B에서 다른 텍스트 수정 → 저장 시도
4. 탭 B에 conflict 토스트/배너가 떠야 함
5. 탭 B 새로고침 → 탭 A의 변경사항이 보임

---

## 6. 검증 통과 기준

- 위 자동 게이트 모두 ✅
- curl 시나리오 1~3 모두 명시한 코드 반환
- 브라우저 manual 5단계 통과
- legacy 페이지(record 없는 raw json)는 GET이 `revision: 0`으로 응답
- 새 페이지 저장 시 record 자동 생성

작업 끝나면 SESSION.md "다음 웨이브" 섹션에 결과 한 줄 추가하고 종료.
