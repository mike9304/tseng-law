# WO-I18N-ID03 — 일본어 칼럼 6편의 변호사 이름 교정

## 목표

일본어 칼럼 본문 6편에 남아 있는 잘못된 한자 이름 `曾俊瑋`를 공식 이름 `曾雋崴`로 교정한다. 이름 외 번역·문장·frontmatter·링크는 변경하지 않는다.

## 허용 파일

- `src/content/columns-ja/001-taiwan-company-establishment-basics.md`
- `src/content/columns-ja/003-taiwan-traffic-accident-procedure.md`
- `src/content/columns-ja/004-taiwan-company-subsidiary-vs-branch.md`
- `src/content/columns-ja/007-taiwan-divorce-lawsuit-qna.md`
- `src/content/columns-ja/008-taiwan-labor-severance-law.md`
- `src/content/columns-ja/010-taiwan-gym-injury-lawsuit.md`
- `src/lib/__tests__/columns-ja-content.test.ts`

그 외 파일은 읽기만 허용하며 수정하지 않는다.

## 정확한 변경

- 위 6개 markdown 파일의 `曾俊瑋`를 모두 `曾雋崴`로 교정한다.
- 주변 일본어 문장과 `Wei Tseng` 병기는 그대로 유지한다.
- frontmatter의 title, description, date, slug, URL은 변경하지 않는다.

## 테스트 요구

기존 `columns-ja-content.test.ts`에 다음 회귀 계약을 추가한다.

1. 일본어 칼럼 전체 corpus에 `曾俊瑋`가 0건이다.
2. 대상 6개 파일 각각에 `曾雋崴`가 최소 1건 있다.
3. 일본어 전체 칼럼 수와 기존 title/slug 계약은 유지된다.

## 불변 조건

- 번체중문/한국어/영문 칼럼은 건드리지 않는다.
- UI, canonical profile, SEO helper, builder seed, embeddings는 건드리지 않는다.
- stage, commit, push, deploy, 서버 시작·종료를 하지 않는다.

## 검증

```bash
npx vitest run src/lib/__tests__/columns-ja-content.test.ts
npm run typecheck
npx eslint src/lib/__tests__/columns-ja-content.test.ts
git diff --check
git status --short
```

이름 교정 외 diff가 보이면 즉시 중단하고 보고한다.
