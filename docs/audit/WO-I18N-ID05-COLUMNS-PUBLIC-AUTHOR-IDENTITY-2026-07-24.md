# WO-I18N-ID05 — 칼럼 공통 저자 UI·SEO 신원 교정

## 문제 증거

ID03/ID04에서 JA·ZH-Hant 칼럼 본문을 교정한 뒤 실브라우저에서 다음을 확인했다.

- `/ja/columns/taiwan-company-establishment-basics`: 본문은 `曾雋崴`, 공통 저자 배지는 `曾俊瑋弁護士`
- `/zh-hant/columns/taiwan-company-establishment-basics`: 본문은 `曾雋崴`, 공통 저자 배지는 `曾俊瑋律師`

즉 칼럼 본문과 공통 UI/JSON-LD가 서로 다른 인물을 표시한다.

## 목표

공개 칼럼 목록·상세·홈 archive의 JA/ZH-Hant 저자명과 Article JSON-LD 신원을 공식 `曾雋崴`로 교정한다.

## 허용 파일

- `src/components/ColumnsGrid.tsx`
- `src/components/InsightsArchiveSection.tsx`
- `src/app/[locale]/columns/page.tsx`
- `src/app/[locale]/columns/[slug]/page.tsx`
- `src/components/__tests__/insights-archive-image-fallback.test.tsx`

그 외 파일은 읽기만 허용하며 수정하지 않는다.

## 정확한 변경 계약

- ZH-Hant byline/author:
  - `曾雋崴律師`
  - 검수 표기 `曾雋崴律師審閱`
- JA byline/author:
  - `曾雋崴弁護士`
  - 검수 표기 `曾雋崴弁護士監修`
- Article JSON-LD:
  - `authorAlternateNames`의 한자를 `曾雋崴`로 교정
  - 개인 프로필 `sameAs` URL을 redirect 전 `/about-8`에서 canonical `/lawyertseng`로 교정
- KO/EN 문구와 나머지 JSON-LD 값은 변경하지 않는다.
- 현재 JA author profile link의 EN fallback 정책은 이 워크오더에서 변경하지 않는다. JA lawyer detail 공개 작업에서 별도 처리한다.

## 테스트 계약

기존 test에 다음을 추가한다.

1. `InsightsArchiveSection`을 JA/ZH-Hant로 렌더했을 때 공식 저자 검수 표기가 보인다.
2. 허용된 네 제품 파일에 `曾俊瑋`가 남아 있지 않다.
3. 상세 route source에 canonical `/lawyertseng`와 alternate `曾雋崴`가 존재한다.
4. 기존 image fallback 테스트는 유지된다.

## 불변 조건

- 칼럼 markdown, canonical profile, builder seed, storage, embeddings는 건드리지 않는다.
- locale routing, author profile link target, layout, 디자인은 변경하지 않는다.
- stage, commit, push, deploy, 서버 시작·종료를 하지 않는다.

## 검증

```bash
npx vitest run src/components/__tests__/insights-archive-image-fallback.test.tsx
npm run typecheck
npx eslint \
  src/components/ColumnsGrid.tsx \
  src/components/InsightsArchiveSection.tsx \
  src/app/[locale]/columns/page.tsx \
  src/app/[locale]/columns/[slug]/page.tsx \
  src/components/__tests__/insights-archive-image-fallback.test.tsx
git diff --check
git status --short
```

허용 범위 밖 변경이나 이름·URL 외 제품 diff가 있으면 즉시 중단하고 보고한다.
