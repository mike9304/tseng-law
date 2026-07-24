# WO-I18N-ID06 — 공통 SEO·LLM·칼럼 저장 원장의 신원 교정

## 문제 증거

`/zh-hant/columns/taiwan-company-establishment-basics`의 Article JSON-LD는 교정됐지만, layout의 공통 `LegalService.employee.name`은 `src/lib/seo.ts`에서 여전히 `曾俊瑋律師`를 출력했다.

같은 잘못된 이름이 builder record JSON-LD fallback, legacy column storage author, `/llms.txt`에도 남아 있다.

## 목표

공통 구조화 데이터, builder record 구조화 데이터, legacy column storage, LLM 안내의 대표 변호사 신원을 공식 이름 `曾雋崴`로 교정한다.

## 허용 파일

- `src/lib/seo.ts`
- `src/lib/builder/seo/record-jsonld.ts`
- `src/lib/builder/columns/storage.ts`
- `src/app/llms.txt/route.ts`
- `src/lib/__tests__/canonical-attorney-seo-identity.test.ts` (신규)
- `src/lib/builder/seo/__tests__/record-jsonld.test.ts`
- `src/app/llms.txt/__tests__/route.test.ts`

그 외 파일은 읽기만 허용하며 수정하지 않는다.

## 정확한 변경

- ZH-Hant 대표 변호사명 `曾俊瑋律師` → `曾雋崴律師`
- `/llms.txt` 한자 병기 `曾俊瑋` → `曾雋崴`
- KO `증준외`, EN `Wei Tseng` 및 다른 schema/문구는 변경하지 않는다.
- 함수 시그니처, locale 타입, 저장 로직, route URL은 변경하지 않는다.

## 테스트 계약

1. `buildLegalServiceJsonLd('zh-hant').employee.name`이 `曾雋崴律師`다.
2. KO/EN `employee.name`은 기존 이름을 유지한다.
3. ZH-Hant builder service-area record JSON-LD의 employee name이 `曾雋崴律師`다.
4. `/llms.txt`가 `曾雋崴律師`와 `증준외(曾雋崴)`를 포함하고 `曾俊瑋`를 포함하지 않는다.
5. 네 제품 source에 `曾俊瑋`가 남아 있지 않다.

## 불변 조건

- public component, route page, 칼럼 markdown, builder canvas seed, embeddings는 건드리지 않는다.
- 이름 외 SEO/schema/storage/LLM 내용을 변경하지 않는다.
- stage, commit, push, deploy, 서버 시작·종료를 하지 않는다.

## 검증

```bash
npx vitest run \
  src/lib/__tests__/canonical-attorney-seo-identity.test.ts \
  src/lib/builder/seo/__tests__/record-jsonld.test.ts \
  src/app/llms.txt/__tests__/route.test.ts
npm run typecheck
npx eslint \
  src/lib/seo.ts \
  src/lib/builder/seo/record-jsonld.ts \
  src/lib/builder/columns/storage.ts \
  src/app/llms.txt/route.ts \
  src/lib/__tests__/canonical-attorney-seo-identity.test.ts \
  src/lib/builder/seo/__tests__/record-jsonld.test.ts \
  src/app/llms.txt/__tests__/route.test.ts
git diff --check
git status --short
```

허용 범위 밖 변경이나 이름 외 제품 diff가 있으면 즉시 중단하고 보고한다.
