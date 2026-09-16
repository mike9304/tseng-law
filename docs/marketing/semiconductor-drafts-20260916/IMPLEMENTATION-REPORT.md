# IMPLEMENTATION-REPORT

날짜: 2026-09-16  
워크트리: `~/Projects/tseng-law-semiconductor-20260916`  
브랜치: `seo/semiconductor-hub-20260916`  
권한: 이 워크트리는 쓰기다. 공개 배포·git push는 하지 않음.

## 구현 방식

실제 저장소는 Next.js App Router, 공개 칼럼은 `src/content/columns/*.md` + `getAllColumnPosts`, 업무분야는 `service-details.ts` / builder service source, CMS 초안은 `runtime-data/consultation-columns/{locale}/{slug}.json` (`draft: true`).

초안을 공개 칼럼 디렉터리에 넣으면 `/ko/columns`·사이트맵·JA 1:1 테스트가 깨지고 유출된다. 그래서:

1. 정본은 `src/content/semiconductor-drafts/` (git 추적, 공개 로더 미사용)
2. 미리보기는 `/ko/design-preview/semiconductor…` (로컬/`DESIGN_PREVIEW=1`)와 `/ko/admin-builder/semiconductor-preview…` (관리자 인증)
3. 칼럼 3편은 CMS draft로 등록. 안내 페이지는 서비스 목록에 넣지 않음.

분류 `반도체 기업 실무가이드`와 주제 태그 3종은 미리보기에서만 노출. 공개 호정칼럼 필터(법인설립/법률정보/소송사례)는 그대로.

## 초안 ID

| ID | 경로 | CMS |
|---|---|---|
| semi-service-ko | `src/content/semiconductor-drafts/00_semiconductor_service_page.ko.md` | 없음 (서비스 초안) |
| semi-ko-001 | 같은 폴더 `01_…md` | `taiwan-semiconductor-market-entry` draft |
| semi-ko-002 | `02_…md` | `taiwan-semiconductor-unpaid-invoices` draft |
| semi-ko-003 | `03_…md` | `taiwan-semiconductor-supply-contract-checklist` draft |

재실행: `npx vite-node --root . --config vitest.config.ts scripts/import-semiconductor-drafts.ts`

## 실행한 검증

| 명령 | 결과 |
|---|---|
| 패키지 `python3 checks/validate_package.py` | PASS |
| `npx vitest run` semiconductor-drafts* 3파일 | 5 passed |
| 공개 표면 테스트 (sitemap/blog/blob merge) | 초안 slug 없음 |
| `npx tsc --noEmit` | exit 0 |
| curl 공개 `/ko/services/semiconductor-companies` 및 3 칼럼 slug | 404 |
| curl 미리보기 4 URL | 200 + noindex |
| curl `/en/design-preview/semiconductor` | 404 |
| curl 기존 `/ko/columns` 및 기존 칼럼 | 200 |
| Playwright 1280/390 스크린샷 | 가로 넘침 0 |

## 제약

- git push / 배포 없음.
- 변호사 검수·소유자 공개 승인 없음.
- CMS draft JSON은 `runtime-data/`라 gitignore. 정본은 `src/content/semiconductor-drafts/`.
- 기존 공개 허브 `/taiwan-semiconductor-supplier-legal`은 이 패키지와 별개이며 건드리지 않음.
