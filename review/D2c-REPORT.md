# WO-D2c — Header 모바일 토글 접근성 라벨 언어팩 배선

작업자: Grok 4.6 · 날짜: 2026-09-14 · 트리 `tseng-law-design-final-polish-20260914`  
커밋: 하지 않음 (`git add`만).

## 1. main-sync 확인 (`git show main-sync-20260914:src/components/Header.tsx`)

- `guidanceChromeLabels(locale)` → `menuLabel` / `skipLabel` 접근자 있음.
- 스킵 링크: `<a className="skip-link" href="#main">{skipLabel}</a>` (텍스트가 접근 이름).
- 모바일 토글: 보이는 텍스트 `{menuLabel}`, `aria-label={drawerOpen ? closeMenuLabel : openMenuLabel}`.
- `openMenuLabel` / `closeMenuLabel`은 ko/zh-hant/ja 사다리, 그 외 `'Open menu'` / `'Close menu'`.
- 안내 4언어(vi/id/th/fil)는 팩 `menuLabel`이 버튼 텍스트로만 쓰이고, 스크린리더 이름은 영어 열림/닫힘 문구로 덮였다.

팩 필드(`international-guidance-content.ts`)는 `skipLink`·`menuLabel`만 있고 열림/닫힘 전용 문장은 없다.

## 2. 디자인 Header에 한 일

허용 파일만 수정: `src/components/Header.tsx`, `src/components/__tests__/header-guidance-menu-label.test.tsx`.

- SVG 토글·`aria-expanded`·`aria-controls`·포커스/blur·메가메뉴 마크업은 유지.
- D2b `<span hidden>{menuLabel}</span>` 제거.
- `openMenuLabel` / `closeMenuLabel`을 스킵과 같은 사다리로 배선:
  - `guidanceLabels` 있으면 팩 `menuLabel` (열림·닫힘 모두; 팩에 상태 문구가 없음).
  - 없으면 기존 ko/zh-hant/ja/`Open menu`·`Close menu`.
- 버튼은 그대로 `aria-label={drawerOpen ? closeMenuLabel : openMenuLabel}`.
- 스킵 링크는 이미 `skipLabel`(팩 있으면 `guidanceLabels.skipLink`, 없으면 기존 사다리)을 링크 텍스트로 쓰고 있어 main-sync와 같다. 추가 `aria-label`은 넣지 않음.

## 3. 시험

명령:

```
npx vitest run \
  src/lib/__tests__/guidance-chrome-language.test.ts \
  src/components/__tests__/header-guidance-menu-label.test.tsx \
  src/components/__tests__/header-consultation-contact-links.test.tsx \
  src/components/__tests__/header-content-fit.test.ts \
  src/components/__tests__/header-next-panel-semantics.test.tsx \
  src/components/__tests__/header-null-blur.test.ts \
  src/components/__tests__/header-resize-offset.test.ts \
  src/components/__tests__/ja-desktop-header.test.tsx
```

결과: **8 files, 57 tests GREEN.**

추가 케이스 1개 (`header-guidance-menu-label.test.tsx`): `locale="vi"` 렌더 후

- `.mobile-toggle` `aria-label` = `guidanceContent.vi.menuLabel` (`Danh mục trang`)
- `"Open menu"` 아님
- 스킵 링크 텍스트 = `guidanceContent.vi.skipLink`
- hidden span 없음

## 4. lint / typecheck

- `npm run lint` — exit 0
- `npm run typecheck` — exit 0 (`Route types generated successfully`, tsc noEmit)
- 전체 스위트·build 실행하지 않음

## 5. git

`git add` 대상:

- `src/components/Header.tsx`
- `src/components/__tests__/header-guidance-menu-label.test.tsx`
- `review/D2c-REPORT.md`

커밋 없음.
