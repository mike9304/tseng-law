# WO-I18N-ID04 — 번체중문 칼럼 6편의 변호사 이름 교정

## 목표

번체중문 칼럼 본문 6편에 남아 있는 잘못된 한자 이름 `曾俊瑋`를 공식 이름 `曾雋崴`로 교정한다. 이름 외 번역·문장·frontmatter·링크는 변경하지 않는다.

## 허용 파일

- `src/content/columns-zh/001-taiwan-company-establishment-basics.md`
- `src/content/columns-zh/003-taiwan-traffic-accident-procedure.md`
- `src/content/columns-zh/004-taiwan-company-subsidiary-vs-branch.md`
- `src/content/columns-zh/007-taiwan-divorce-lawsuit-qna.md`
- `src/content/columns-zh/008-taiwan-labor-severance-law.md`
- `src/content/columns-zh/010-taiwan-gym-injury-lawsuit.md`
- `src/lib/__tests__/columns-zh-content.test.ts` (신규)

그 외 파일은 읽기만 허용하며 수정하지 않는다.

## 정확한 변경

- 위 6개 markdown 파일의 `曾俊瑋` 9건을 모두 `曾雋崴`로 교정한다.
- 주변 번체중문 문장과 호칭 `律師`는 그대로 유지한다.
- frontmatter의 title, description, date, slug, URL은 변경하지 않는다.

## 테스트 요구

신규 테스트는 다음을 검증한다.

1. ZH-Hant 칼럼 파일 목록이 KO 칼럼 파일 목록과 동일하다.
2. `getAllColumnPosts('zh-hant')`가 기존 17개 전체 칼럼을 로드한다.
3. 번체중문 칼럼 전체 corpus에 `曾俊瑋`가 0건이다.
4. 대상 6개 파일 각각에 `曾雋崴`가 최소 1건 있다.

## 불변 조건

- 일본어/한국어/영문 칼럼은 건드리지 않는다.
- UI, canonical profile, SEO helper, builder seed, embeddings는 건드리지 않는다.
- stage, commit, push, deploy, 서버 시작·종료를 하지 않는다.

## 검증

```bash
npx vitest run src/lib/__tests__/columns-zh-content.test.ts
npm run typecheck
npx eslint src/lib/__tests__/columns-zh-content.test.ts
git diff --check
git status --short
```

이름 교정 외 diff가 보이면 즉시 중단하고 보고한다.
