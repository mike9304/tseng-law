# CONTENT-IMPORT-CHECK

패키지 원본: `~/Downloads/tseng-law-semiconductor-2026-09-16/content/`  
등록 원본: `src/content/semiconductor-drafts/`  
CMS 초안: `runtime-data/consultation-columns/ko/{slug}.json` (`draft: true`, `.published.json` 없음)

## 바이트·해시

네 파일 모두 패키지와 byte-identical. `sha256_file` / `sha256_body`는 패키지 `internal/manifest.json`과 일치.

| ID | body_characters | 각주 정의 | 표 | FAQ 섹션 | 공식 https 링크 |
|---|---:|---:|---|---|---|
| semi-service-ko | 995 | 0 | 없음 | 없음 | 0 |
| semi-ko-001 | 8781 | 9 | 있음 | 있음 | law.moj.gov.tw 등 보존 |
| semi-ko-002 | 10709 | 17 | 있음 | 있음 | 보존 |
| semi-ko-003 | 11280 | 16 | 있음 | 있음 | 보존 |

표시용으로 히어로와 겹치는 선두 H1만 화면에서 한 번 숨긴다. 저장본 `bodyMarkdown`은 H1부터 각주 끝까지 유지한다.

## 메타데이터

`author` / `legal_reviewer` / `legal_reviewed_at` / `published_at` = null  
`review_status` = NEEDS_LAWYER_REVIEW  
`publish` = false  
공식자료 열람일 2026-09-16을 검수일·발행일로 쓰지 않음.

## 중복 방지

같은 slug로 import를 두 번 실행하면 기존 draft만 갱신한다. 공개 `src/content/columns/`에는 파일을 만들지 않았다. 기존 17편 KO 칼럼과 JA 1:1 대응을 깨지 않는다.

## CMS HTML

CMS `bodyHtml`은 미리보기용 변환이다. 검수 화면의 정본은 `bodyMarkdown`이며 `ColumnContent`(remark-gfm)로 표·각주·링크를 렌더한다.
