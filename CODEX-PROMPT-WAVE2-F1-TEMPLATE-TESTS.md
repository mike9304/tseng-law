# CODEX 발주 — Wave 2 / F1 Template Registry Tests

> **발행일**: 2026-05-01
> **선행**: D1 QA 하네스 (`vitest.config.ts`, `passWithNoTests: true`), D1 템플릿 갤러리 (170 templates)
> **분담**: 엔지니어 6 (Templates/Sections) 단독.
> **충돌 회피**: 신규 vitest 파일만 추가. 기존 소스 변경 거의 없음. D2 worker가 동시에 `vitest.config.ts`를 건드리지 않으므로 안전.

---

## 1. 목적

D1에서 `npm run test:unit`이 깔렸지만 **실제 테스트 파일이 0개**라서 `passWithNoTests: true`로 통과하고 있다. 이 PR은:

1. 첫 진짜 vitest 테스트로 **template registry 무결성**을 잠근다
2. 170 templates의 schema 적합성 / id 유일성 / parent 참조 정합성을 자동 검증
3. 향후 templates 변경(추가/삭제/수정) 시 회귀 잡기

체감 동작:
- `npm run test:unit` 실행 → "0 tests" 대신 진짜 test 케이스 통과 표시
- 누가 templates 폴더에 깨진 JSON을 추가하면 CI/로컬 테스트 즉시 실패
- `passWithNoTests`는 그대로 유지(향후 다른 트랙 테스트 미작성 시 fallback)

---

## 2. 작업 범위

### 2.1 vitest.config.ts 보강

`vitest.config.ts`:

기존 config는 그대로 두고 다음만 추가:
- `globals: true` — `describe/it/expect`를 import 없이 쓸 수 있게 (선택)
- `setupFiles: ['./tests/setup.ts']` — 추후 공통 setup용. 이 PR에선 빈 파일이라도 OK
- `coverage` 옵션은 **추가하지 마** (시간 비용 증가)

### 2.2 신규 테스트 파일

`src/lib/builder/templates/__tests__/registry.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { getAllTemplates, getTemplateCategories } from '@/lib/builder/templates/registry';
import { builderCanvasDocumentSchema } from '@/lib/builder/canvas/types';

describe('template registry', () => {
  const all = getAllTemplates();

  it('returns 170 active templates', () => {
    expect(all).toHaveLength(170);
  });

  it('has 17 active categories', () => {
    const cats = getTemplateCategories();
    expect(cats).toHaveLength(17);
  });

  it('has 10 templates per category', () => {
    const byCat = new Map<string, number>();
    for (const t of all) byCat.set(t.categoryId, (byCat.get(t.categoryId) ?? 0) + 1);
    for (const [cat, count] of byCat) {
      expect(count, `category ${cat}`).toBe(10);
    }
  });

  it('has unique template ids', () => {
    const ids = all.map(t => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('disk exports match registry', () => {
    // registry export count vs expected import count
    // (구체 구현은 registry.ts 내부 export shape에 맞춰 작성)
  });

  describe('per-template document validation', () => {
    for (const t of all) {
      it(`${t.id} canvas document parses`, () => {
        const result = builderCanvasDocumentSchema.safeParse(t.document);
        if (!result.success) {
          console.error(`Template ${t.id} validation errors:`, result.error.errors.slice(0, 3));
        }
        expect(result.success).toBe(true);
      });

      it(`${t.id} node ids unique + parent refs valid`, () => {
        const nodes = t.document.nodes;
        const ids = new Set<string>();
        const dupes: string[] = [];
        for (const n of nodes) {
          if (ids.has(n.id)) dupes.push(n.id);
          ids.add(n.id);
        }
        expect(dupes, `${t.id} duplicate ids`).toEqual([]);

        for (const n of nodes) {
          if (n.parentId) {
            expect(ids.has(n.parentId), `${t.id} node ${n.id} parent ${n.parentId} missing`).toBe(true);
          }
        }
      });
    }
  });
});
```

### 2.3 helper 보강 (필요 시)

`src/lib/builder/templates/registry.ts`에 다음이 없다면 추가 (export-only, 기존 동작 변경 없이):
- `getAllTemplates(): TemplateEntry[]`
- `getTemplateCategories(): TemplateCategory[]`
- `TemplateEntry` 타입에 `id`, `categoryId`, `document` 노출

이미 export 돼 있다면 건드리지 마.

### 2.4 선택: `tests/setup.ts`

빈 파일 OK:
```ts
// tests/setup.ts
// future shared setup for vitest unit tests
export {};
```

### 2.5 잘못된 템플릿 발견 시

이 PR을 작성하다 schema/id 위반 템플릿을 발견하면:
1. **고치지 마**. 일단 테스트가 빨갛게 떨어지게 두고
2. 어느 템플릿 어느 필드가 깨졌는지 SESSION.md에 기록
3. 그 템플릿 ID를 일시적으로 `XFAIL_TEMPLATES` 리스트로 빼고 테스트 통과시킨다 (선택, 우선순위 낮음)
4. 후속 PR에서 정리

---

## 3. 파일

**수정**:
- `vitest.config.ts` — `setupFiles` 추가 (선택)
- `src/lib/builder/templates/registry.ts` — `getAllTemplates`/`getTemplateCategories` export (이미 있으면 skip)

**신규**:
- `src/lib/builder/templates/__tests__/registry.test.ts` — 위 테스트
- `tests/setup.ts` — 빈 setup (선택)

---

## 4. 비범위

- Section template 테스트 (F3에서)
- Animation runtime 테스트 (F4에서)
- E2E / Playwright 테스트 (별도 트랙)
- Coverage 리포팅
- 다른 트랙(A1/B1/C1/D1/E1/F2) 단위 테스트 추가 — 각 트랙 후속 PR에서 별도

---

## 5. 검증

### 자동
```bash
npm run typecheck
npm run lint
npm run test:unit            # 핵심: "No test files found" 대신 진짜 결과
npm run security:builder-routes
npm run build
BUILDER_SMOKE_TIMEOUT_MS=30000 npm run smoke:builder
```

`test:unit` 출력이 다음과 비슷해야 함:
```
 ✓ src/lib/builder/templates/__tests__/registry.test.ts (175+ tests)
   ✓ template registry > returns 170 active templates
   ✓ template registry > has 17 active categories
   ✓ template registry > has 10 templates per category
   ✓ template registry > has unique template ids
   ✓ template registry > per-template document validation > <template-id-1> canvas document parses
   ... (각 템플릿당 2 tests × 170 = 340)

Test Files  1 passed (1)
     Tests  345+ passed (345+)
```

### 회귀 테스트 (선택)
```bash
# 일부러 깨진 템플릿 만들어서 빨갛게 뜨는지 확인
# 예: src/lib/builder/templates/<some-cat>/template-1.ts에서 한 노드 id 중복
npm run test:unit
# → 해당 template-id가 실패로 표시돼야 함
# 확인 후 원래대로 복원
```

---

## 6. 검증 통과 기준

- 자동 게이트 모두 ✅
- `test:unit`이 진짜 테스트 통과 (345+ cases)
- 170 templates 모두 schema 적합 + id 유일 + parent 참조 정합
- 회귀 시나리오에서 빨갛게 떨어짐 (선택 검증)
- D1의 빈 harness가 진짜 검증 layer로 격상됨

작업 끝나면 SESSION.md에 결과 한 줄 추가:
> "F1 template registry tests 완료. test:unit이 0 → 345+ 케이스 검증. D1 harness가 진짜 게이트로 동작."
