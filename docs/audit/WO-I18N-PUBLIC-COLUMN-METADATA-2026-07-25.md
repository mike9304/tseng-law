# WO-I18N-PUBLIC-COLUMN-METADATA — 공개 칼럼 표시일·읽기시간 보존

Date: 2026-07-25 KST  
Manager: Codex `/root`

## 문제

`getAllColumnPostsIncludingBlob()`는 기존 마크다운 칼럼까지
`ColumnDocument`로 변환한 뒤 다시 `ColumnPost`로 만들면서 파일 frontmatter의
`date_display`와 `read_time`을 버린다. 그 결과 한국어 017 공개 페이지가
`2025년 9월 13일 · 9분 분량` 대신 `2026-07-25 · 38 min`을 표시한다.

## 목표

- 기존 파일 칼럼을 builder 저장소 경로로 읽어도 원문의 `date_display`와
  `read_time`을 그대로 보존한다.
- 실제 CMS 신규 글처럼 두 값이 없는 문서만 언어별 fallback을 사용한다.
- 한국어 fallback은 `N분 분량`, 번체중문은 `N分鐘閱讀`, 영어는
  `N min read` 형식으로 반환한다.
- slug 우선순위, 본문, FAQ backfill, 공개 필터링 동작은 변경하지 않는다.

## 허용 파일

1. `src/lib/builder/columns/types.ts`
2. `src/lib/builder/columns/storage.ts`
3. `src/lib/consultation/columns-blob-reader.ts`
4. `src/lib/builder/__tests__/columns-backend.test.ts`

작업자는 위 네 파일만 수정한다. stage, commit, push, deploy, 서버 조작을
하지 않는다.

## 구현 계약

- `ColumnDocument.frontmatter`에 optional `dateDisplay`, `readTime`을 추가한다.
- legacy 파일을 `ColumnDocument`로 변환할 때 `ColumnPost.dateDisplay`와
  `ColumnPost.readTime`을 두 필드에 복사한다.
- builder/Blob 문서를 `ColumnPost`로 변환할 때 값이 있으면 정확히
  보존하고, 없을 때만 locale-aware fallback을 계산한다.
- fallback 분량은 완성된 본문의 가시 텍스트를 기준으로 올림한다.
  - KO: 공백 기준 어절 수 / 180
  - ZH-Hant: 공백·Markdown 문법을 제외한 문자 수 / 400
  - EN: 공백 기준 단어 수 / 200
- 날짜 fallback은 기존 ISO `YYYY-MM-DD` 동작을 유지한다.
- schema 변경은 기존 저장 문서와 호환되는 optional additive 변경이어야 한다.

## 테스트 계약

- legacy KO 017이 public merged reader에서도 `2025년 9월 13일`과
  `9분 분량`을 반환한다.
- 실제 local runtime 문서에 metadata 값이 있으면 정확히 보존한다.
- metadata 값이 없는 KO/ZH-Hant/EN runtime 문서는 각각 현지화된 fallback
  형식을 반환하고 더 이상 bare `min`을 만들지 않는다.
- 기존 로컬 저장소 병합, 테스트 글 필터, Blob backend 테스트를 모두
  회귀 통과한다.

## 검증

1. `npx vitest run src/lib/builder/__tests__/columns-backend.test.ts src/lib/__tests__/columns-ko-investment-017.test.ts`
2. `npm run -s typecheck`
3. `npx eslint src/lib/builder/columns/types.ts src/lib/builder/columns/storage.ts src/lib/consultation/columns-blob-reader.ts src/lib/builder/__tests__/columns-backend.test.ts`
4. `git diff --check --` 허용 파일과 본 작업명세
5. manager Playwright에서 KO 017 데스크톱/모바일의
   `2025년 9월 13일 · 9분 분량`, locale flags, overflow/error 0 확인

