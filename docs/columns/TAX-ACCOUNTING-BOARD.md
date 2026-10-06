# 세무·회계 게시판(/{locale}/tax-accounting) 등록 규칙

2026-10-06 작성. 대만에 자회사·지점을 두었거나 대만과 거래하는 외국 기업(미국·일본·한국·베트남 등)을 위한 세무·회계 칼럼 게시판이다. 판정 코드는 `src/lib/tax-accounting-board.ts`의 `selectTaxAccountingColumns`다.

## 새 글을 넣는 방법

칼럼 파일의 frontmatter에 아래 태그를 정확히 쓴다. 목록 파일을 고칠 필요는 없다.

```yaml
topic: "tax"
tags: ["tax-accounting"]
```

- `tags`는 문자열 배열이어야 한다. `tags: "tax-accounting"`처럼 문자열 하나만 쓰면 무시된다. 대소문자·앞뒤 공백은 정리된다.
- 제목·요약·본문의 단어나 `topic: "tax"`만으로는 게시판에 넣지 않는다. 세무 글이라도 태그가 없으면 나오지 않는다.
- 언어별 파일이 있는 언어에만 나온다. 다른 언어 글을 대신 보여 주지 않는다.
- 정렬은 게시일 최신순, 같은 날이면 파일 번호가 큰 글이 먼저다. 내부 테스트 글(`isInternalColumnPost`)은 나오지 않는다.
- 새 글을 추가하면 `src/lib/__tests__/tax-accounting-column-files.ts`의 언어별 파일 목록도 갱신한다. 게시판 테스트와 사이트맵 URL 수가 이 목록을 기준으로 검사한다.

## 게시판 이전 글(관련 칼럼)

게시판을 열기 전에 게시된 법인 세무 관련 칼럼은 `LEGACY_TAX_ACCOUNTING_SLUGS`에 slug로 등록해 "함께 읽을 기존 칼럼" 구역에 보여 준다. 이 글들의 frontmatter는 고치지 않는다(다른 레인의 수정과 충돌하지 않게). 레거시 글에 `tax-accounting` 태그를 달면 게시판 칼럼 구역으로 옮겨 간다.

## 집필 기준

- 독자: 대만에 자회사·지점을 둔 외국 기업의 재무·법무 담당자. 각 언어판은 그 언어 독자의 본국(ko=한국, ja=일본, en=미국 및 영어로 읽는 베트남 등 기업)에 맞춰 따로 쓴다. zh-hant는 외국계 기업의 대만 재무·회계 담당자를 독자로 한다.
- 세율·기준 금액·기한은 법령 원문과 재정부 공개 자료로 확인하고, 적용 연도와 자료 확인일을 적는다. 조세협정(취결·협정) 세율은 협정 원문 조항을 링크한다. 본국 세법은 일반적인 주의로만 쓴다.
- 문체와 형식은 `EDITORIAL-VOICE.md`, `FRONTMATTER.md`와 칼럼 레인의 공통 규칙(굵은 글씨 금지, 이메일만 연락처, 변호사 검토 표시 금지)을 따른다.
- 게시 전 최종 검수는 Claude Fable 5.1이 한다. 검수 기록은 `docs/columns/reviews/<날짜>/tax-accounting/`에 둔다.

## 검증

`npx vitest run src/lib/__tests__/tax-accounting-board.test.tsx src/app/__tests__/sitemap.test.ts src/lib/builder/site/__tests__/public-route-ownership.test.ts src/components/__tests__/ja-footer.test.tsx`
