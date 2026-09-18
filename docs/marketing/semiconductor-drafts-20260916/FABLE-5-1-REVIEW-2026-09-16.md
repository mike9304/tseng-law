# FABLE 5.1 REVIEW — 반도체 초안 패키지 등록 (2026-09-16)

검토자: Claude Fable 5.1 (독립 검토, 구현·커밋·푸시·배포 없음)
워크트리: `~/Projects/tseng-law-semiconductor-20260916`
브랜치: `seo/semiconductor-hub-20260916`
HEAD: `6b38e49e` (Layer 1 = `35389e95..6b38e49e`, Layer 2 = `0d6ee82e..35389e95`)
패키지 원본: `~/Downloads/tseng-law-semiconductor-2026-09-16`

## 결론 요약

- **공개 발행: NO-SHIP.** 법률 검수·소유자 승인이 없다는 패키지 상태 그대로다. 코드 쪽에 발행을 막는 결함은 없고, 발행을 막아야 하는 이유는 승인 부재다.
- **초안 구현을 로컬에 유지: 가능.** 유출·창작·기존 콘텐츠 훼손은 발견하지 못했다. 중간 2건(재실행 명령 무동작, 비-hermetic 테스트)은 CI·재현성 문제이지 유출 문제가 아니다.
- **치명 0 · 높음 0 · 중간 2 · 낮음 5.**

---

## 검증 기록 (명령·출력)

### 1. 바이트 동일성

```
$ shasum -a 256 ~/Downloads/tseng-law-semiconductor-2026-09-16/content/*.md
a94d9a6b300694ab693a5c785b40860f322d1408d564e74adb2d21033da8b744  00_semiconductor_service_page.ko.md
75e5a942aaf586f6a1b330c3599c7287c36b728d7af5e326d37818a78d2fde13  01_taiwan_semiconductor_market_entry.ko.md
4e9ba33c184835f80a7fe17c3ce1d052ca962abe062446abd63ee796901db706  02_taiwan_semiconductor_unpaid_invoices.ko.md
e4be58e4496f0b02833433d0812efd4f82731ef419e7aeb2e79a0aa8ec06d81c  03_taiwan_semiconductor_supply_contract.ko.md
$ shasum -a 256 src/content/semiconductor-drafts/*.md   → 4개 모두 동일
$ diff internal/manifest.json src/content/semiconductor-drafts/manifest.json                    → exit 0
$ diff internal/LEGAL_VERIFICATION_KO.md docs/.../LEGAL_VERIFICATION_KO.md                      → exit 0
$ diff internal/SOURCE_REGISTRY.json docs/.../SOURCE_REGISTRY.json                              → exit 0
```

manifest의 `sha256_body`·`body_characters`도 저장소 파일에서 재계산해 4건 모두 일치 (995 / 8781 / 10709 / 11280).
Layer 1 diff는 `src/app/globals.css` 수정 1건 외 전부 신규 추가(`A`)다. 기존 칼럼 삭제·수정 없음.

### 2. 공개 표면 유출

| 표면 | 근거 | 결과 |
|---|---|---|
| `getAllColumnPosts('ko')` | `src/lib/__tests__/semiconductor-drafts.test.ts:74-80` 통과 | 초안 slug 없음 |
| sitemap | `src/app/__tests__/sitemap.test.ts` 27건 통과, `semiconductor-drafts-public-surface.test.ts` 통과. `src/app/sitemap.ts` STATIC_PATHS에 초안 경로 없음 | 없음 |
| `/ko/columns/{slug}` | `src/app/[locale]/columns/[slug]/page.tsx:79-83` — `getColumnPost` 실패 시 `getAllColumnPostsIncludingBlob`로 폴백. 그 리더는 `.published.json`만 읽음 (`src/lib/consultation/columns-blob-reader.ts`, `publishedBlobs = ... endsWith('.published.json')`) | 404 |
| `/ko/services/semiconductor-companies` | `src/app/[locale]/services/[slug]/page.tsx:132,238` `getServiceArea` → undefined → `notFound()`. 테스트 `:81` 통과 | 404 |
| `listBlogPosts` | `src/lib/builder/blog/column-adapter.ts:72-81` published만 | 없음 |
| 공개 검색 인덱스 | `src/lib/builder/search/source-collector.ts:7,15,82,110` — `listBlogPosts` + `getAllColumnPosts`만 사용 | 없음 |
| `/api/builder/blog/posts?includeDrafts` | `route.ts:68-73` admin 권한 요구 | 인증 필요 |
| `/api/builder/columns` GET | `route.ts:47` `guardBuilderReadWithPermission(request,'edit-blog')` | 인증 필요 |
| RSS | `find src/app -iname '*rss*' -o -iname '*feed*'` → `api/consultation/feedback`만. RSS 라우트 자체가 없음 | 해당 없음 |
| 정적 산출물 | 미리보기 4개 페이지 모두 `dynamic = 'force-dynamic'` (+ design-preview는 `revalidate = 0`). `next build`는 실행하지 않음 (비용 문제, 아래 "미실행" 참조) | 정적 생성 대상 아님 |
| robots | `src/app/robots.ts:21-24` `/admin-builder` disallow. `/design-preview`는 disallow 없음 — 다만 production에서 404 (아래 4항) | — |

### 3. CMS 초안

```
runtime-data/consultation-columns/ko/
  taiwan-semiconductor-market-entry.json                draft=True revision=6 updatedBy=semiconductor-draft-import
  taiwan-semiconductor-supply-contract-checklist.json   draft=True revision=6
  taiwan-semiconductor-unpaid-invoices.json             draft=True revision=6
frontmatter keys = attorneyReviewStatus, blogCategory, category, featured, freshness, lastmod, seo, tags
author=None  publishedAt=None  attorneyReviewStatus=pending  seo.noIndex=True
bodyMarkdown 길이 = 8781 / 11280 / 10709 (원본과 동일)   bodyHtml에 <script> 없음
```

- `.published.json` 없음. `runtime-data/`는 `.gitignore:39`.
- 메인 체크아웃(`~/Projects/tseng-law/runtime-data/...`)에는 반도체 초안 없음 → 다른 세션 간섭 없음.
- `revision=6`은 아래 낮음-3 참조 (테스트가 실행마다 갱신).

### 4. 미리보기 게이팅

- design-preview: `src/lib/semiconductor-drafts.ts:232-234` `NODE_ENV !== 'production' || DESIGN_PREVIEW === '1'`. 기존 `src/app/(design-preview)/[locale]/design-preview/page.tsx:13`과 동일 규칙. `locale !== 'ko'` → `notFound()` (`semiconductor/page.tsx:27`, `columns/[slug]/page.tsx:33`). Vercel preview 배포도 `NODE_ENV=production`이므로 404.
- admin-builder: `src/app/(builder)/[locale]/admin-builder/layout.tsx:21-24` `requireBuilderAdminAuth` 실패·미설정 시 `notFound()`. `src/lib/builder/columns/auth.ts:80-85`는 misconfigured도 NextResponse 반환(fail-closed). `src/middleware.ts:297` matcher가 `/admin-builder/:path*` 포함.
- EN locale: design-preview는 404 확인(코드). admin은 낮음-4 참조.
- hreflang/alternates: 미리보기 4개 페이지 모두 `alternates` 없음. `src/app/layout.tsx`에도 없음.

### 5. 문의 경로

- `src/lib/consultation/public-contact.ts:3` `CONSULTATION_EMAIL = 'wei@hoveringlaw.com.tw'`. 새 수신처 없음.
- `semiconductorInquiryMailto()` 실행 결과: `mailto:wei@hoveringlaw.com.tw?subject=[tseng-law.com 상담문의] 반도체 기업 — 대금분쟁&body=(기존 공용 템플릿, 빈 항목 라벨만)`. 회사명·개인정보는 URL에 들어가지 않음.
- `/ko/contact`: `src/lib/public-route-policy.ts:8` + `src/app/[locale]/(legacy)/contact-legacy.tsx` 존재.
- 관련 링크 5개(`EXISTING_PUBLIC_RELATED_LINKS`, `semiconductor-drafts.ts:209-230`) 모두 실재: `taiwan-company-setup-lawyer/`, `taiwan-litigation-lawyer/`, `columns/004-taiwan-company-subsidiary-vs-branch.md`, `lawyers/[slug]` + `attorney-profiles.ts:8 primaryAttorneySlug='wei-tseng'`.
- 안내 페이지 "관련 글" 링크는 표시 시점 주입(`semiconductorServiceBodyWithDraftLinks`), 실행 결과 3개 주입 확인. 저장 파일 미변경.

### 6. 테스트

```
$ npx vitest run src/lib/__tests__/semiconductor-drafts.test.ts src/lib/__tests__/semiconductor-drafts-import.test.ts \
    src/lib/__tests__/semiconductor-drafts-public-surface.test.ts src/data/__tests__/intent-pages-semiconductor.test.ts \
    src/app/__tests__/sitemap.test.ts
 ✓ intent-pages-semiconductor.test.ts (21)  ✓ semiconductor-drafts.test.ts (3)  ✓ semiconductor-drafts-import.test.ts (1)
 ✓ semiconductor-drafts-public-surface.test.ts (1)  ✓ sitemap.test.ts (27)
 Test Files 5 passed · Tests 53 passed · exit=0
```

### 7. 타입체크

```
$ npx tsc --noEmit --pretty false --incremental false
exit=0  (21.7s)
```

### 8. 보안·비밀

- Layer 1 diff(PNG 제외)에서 `api_key|secret|password|token|BEGIN RSA|sk-...|vercel_blob_rw_` 패턴 검색 → 0건. 이메일 리터럴 0건(공식 이메일은 기존 모듈에서 import).
- 마크다운 렌더: 미리보기는 기존 `ColumnContent`(react-markdown + remark-gfm, HTML 통과 없음). CMS `bodyHtml`은 `sanitizeColumnBodyHtml` 통과 (`semiconductor-drafts-import.ts:86`).
- 메타데이터 창작 없음: `author/legal_reviewer/legal_reviewed_at/published_at`는 `readNullField`가 `null` 아니면 throw (`semiconductor-drafts.ts:88-94,148-151`). 배너는 "작성자 미기록 · 변호사 검수일 미기록 · 발행일 미기록"과 열람일(09-16)/정리 기준일(09-04)을 구분 표시 (`DraftStatusBanner.tsx:12-28`, 캡처 확인).

### 미실행

- `next build` 전체 빌드는 실행하지 않았다(수 분 소요). 정적 유출 판단은 `force-dynamic` 선언과 로더 코드로 대체했다.
- 외부 출처 URL 실시간 접속 검사, 법률 정확성 검토는 이 리뷰 범위 밖이다.

---

## 치명

없음.

## 높음

없음.

## 중간

### M-1. 보고서의 재실행 명령이 아무것도 하지 않는다

- 파일: `src/lib/semiconductor-drafts-import.ts:139`, `docs/marketing/semiconductor-drafts-20260916/IMPLEMENTATION-REPORT.md` "재실행:" 줄
- 근거: 자가실행 가드 `/semiconductor-drafts-import/.test(process.argv[1])`는 vite-node 아래에서 `argv[1]`이 vite-node 바이너리라 false다.

```
$ CONSULTATION_COLUMNS_DIR=/tmp/semi-import-check npx vite-node --root . --config vitest.config.ts src/lib/semiconductor-drafts-import.ts
exit=0   (출력 없음, /tmp/semi-import-check 에 파일 0개)
$ CONSULTATION_COLUMNS_DIR=/tmp/semi-import-check npx vite-node --root . --config vitest.config.ts scripts/import-semiconductor-drafts.ts
{ "imported": [ ...3건, duplicate:false ] }  exit=0
```

- 영향: 보고서대로 재실행하면 성공(exit 0)처럼 보이지만 초안이 갱신되지 않는다. 검수 후 원고를 바꿔 재등록하는 사람이 오해한다.
- 수정: 보고서 재실행 명령을 `scripts/import-semiconductor-drafts.ts`로 바꾸고, `semiconductor-drafts-import.ts:134-144`의 죽은 자가실행 블록을 제거.

### M-2. 바이트 동일성 테스트가 `~/Downloads`에 의존해 CI·타 머신에서 실패한다

- 파일: `src/lib/__tests__/semiconductor-drafts.test.ts:16-19, 32-34`
- 근거: `path.join(process.env.HOME, 'Downloads/tseng-law-semiconductor-2026-09-16')`를 `readFileSync`. 패키지 폴더가 없는 환경(GitHub Actions, 다른 워크트리 사용자)에서는 ENOENT로 suite 실패.
- CI 연결: `.github/workflows/builder-quality.yml:4-20`은 `src/**` 변경 PR에서 트리거, `:43` `npm run test:unit`(= `vitest run` 전체) 실행.
- 영향: 이 브랜치로 PR을 열면 CI 게이트가 깨진다. 유출 문제는 아니다.
- 수정: 원본 해시가 이미 `src/content/semiconductor-drafts/manifest.json`(패키지와 byte-identical)에 있으므로 그 `sha256_file`/`sha256_body`와 비교하도록 바꾸거나, 패키지 폴더가 없으면 `it.skip`.

## 낮음

### L-1. 관리자 미리보기가 `[locale]`을 무시한다

- 파일: `src/app/(builder)/[locale]/admin-builder/semiconductor-preview/page.tsx`, `.../columns/[slug]/page.tsx`
- 근거: 두 페이지 모두 `locale`을 읽지 않는다. `/en/admin-builder/semiconductor-preview`가 한국어 초안을 렌더한다(인증 뒤). design-preview 쪽은 `locale !== 'ko'` → 404로 처리.
- 수정: 같은 `notFound()` 가드 추가.

### L-2. 안내 페이지 미리보기에 H1이 두 개

- 파일: `src/components/semiconductor-drafts/SemiconductorGuideIndex.tsx:44`, `src/lib/semiconductor-drafts.ts:237-245`, `src/components/ColumnContent.tsx:105-127`
- 근거: 히어로가 `<h1>반도체 기업 법무</h1>`을 그리고, 본문 H1 "대만과 거래하는 반도체 기업을 위한 법무 안내"는 frontmatter `title`과 달라 `semiconductorDraftBodyWithoutLeadingTitle`가 제거하지 않는다. `ColumnContent`에는 `h1` 매핑이 없어 그대로 `<h1>`로 렌더. `preview-service-desktop.png`에서 확인.
- 영향: 미리보기 한정. 지시서 §5 "제목 계층" 항목과 어긋남.
- 수정: service kind는 선두 `# ` 줄을 무조건 제거하거나, 본문 H1을 히어로 제목으로 사용.

### L-3. import 테스트가 실행마다 실제 로컬 CMS 초안을 갱신한다

- 파일: `src/lib/__tests__/semiconductor-drafts-import.test.ts:8-9`, `src/lib/builder/columns/storage.ts:30-35`
- 근거: 테스트가 기본 경로 `runtime-data/consultation-columns/ko/`에 두 번 쓴다. 워크트리 초안의 `revision=6`이 그 결과다. gitignore라 유출은 아니지만 hermetic하지 않고, `BUILDER_USE_BLOB_IN_DEV=1` + 토큰 환경에서 테스트를 돌리면 Blob에 쓴다.
- 수정: 테스트에서 `process.env.CONSULTATION_COLUMNS_DIR`를 임시 디렉터리로 지정.

### L-4. 각주 섹션 제목이 영어 "Footnotes"로 표시된다

- 파일: `src/components/ColumnContent.tsx:104` (remark-gfm 기본 라벨)
- 근거: `preview-dispute-desktop.png` 하단. 기존 공개 칼럼 중 `[^n]` 각주를 쓰는 파일은 0개라 이번이 첫 사용 경로다.
- 영향: 미리보기 한정. 발행 시 한국어 페이지에 영어 제목이 남는다.
- 수정: react-markdown 10.x의 `remarkRehypeOptions={{ footnoteLabel: '각주' }}` 등으로 라벨 지정 (기존 칼럼 영향 없음).

### L-5. 캡처 PNG 8장 11 MB가 git에 들어갔다

- 파일: `docs/marketing/semiconductor-drafts-20260916/preview-*.png` (`du -ch` 11M)
- 영향: 기능 문제 없음. 저장소 크기만 커진다.
- 수정: 검토 증거로 남길 거면 축소본으로 교체하거나 저장소 밖 보관.

## 발행 시점 메모 (지금은 결함 아님, 발행 작업에서 확인)

- CMS 초안 frontmatter는 `category: 'legal'`, `blogCategory: 'semiconductor-practical-guide'` (`semiconductor-drafts-import.ts:92-93`). 공개 칼럼 화면은 `category`로 "법률정보" 라벨을 붙이고 새 `blogCategory`를 모른다. PUBLICATION-CHECKLIST가 "분류 노출은 별도 작업"이라고 이미 적어 둔 내용과 일치한다.
- CMS 발행 라우트(`src/app/api/builder/columns/[slug]/publish/route.ts:76-79`)는 `attorneyReviewStatus`를 검사하지 않고 `publishedAt = now`를 찍는다. 즉 관리자 클릭 한 번이 곧 발행이며, "변호사 검수 후"를 강제하는 기술 게이트는 없다. 소유자 승인 = 클릭이라는 설계이므로 결함으로 보지 않지만, 체크리스트 외 안전장치가 없다는 점은 인지해야 한다.
- 검수된 새 버전을 등록할 때는 `src/content/semiconductor-drafts/*.md`와 `manifest.json` 해시를 같이 갱신해야 `semiconductor-drafts.test.ts`가 통과한다(M-2 수정 후에도 동일).

---

## Layer 2 — 기존 허브 (`0d6ee82e..35389e95`)

Layer 1과 충돌·유출·창작이 있는지만 봤다.

- 초안 slug 3종, `/ko/services/semiconductor-companies`, `semiconductor-practical-guide`를 참조하는 곳: `src/ docs/ scripts/` 전체 grep에서 초안 코드 외 0건. 허브가 미등록 경로를 링크하지 않는다.
- 허브 `/taiwan-semiconductor-supplier-legal`은 공개·색인 대상(`src/app/sitemap.ts:27, 280-285`; `public-route-policy.ts:43` JA 전용 경로). 칼럼 카드 4개(`intent-pages.ts` `columnSlugs`)는 모두 `src/content/columns/`에 실재.
- "시간당 NT$3,000", "약 3개월"은 `0d6ee82e^` 시점 `intent-pages.ts`에 이미 있던 문구(`git grep` 확인). 이번 범위에서 새로 만든 수치가 아니다.
- 이전 리뷰(HUB-SEO-REVIEW) G6b(기존 법인설립 페이지에 반도체 키워드 삽입)는 HEAD에서 제거됨 — `taiwan-company-setup-lawyer` 블록 안 `반도체|semiconductor|半導體|半導体` 0건. `35389e95` 메시지대로 설치·보증·대표사무소 거래 주장도 삭제.
- 남은 것: HUB-SEO-REVIEW P0 "허브 `[NEW]` 문구의 변호사 승인 전 배포 금지"는 코드가 아니라 절차 게이트이며 상태 변화 없음. Layer 1 초안과 별개로, 이 브랜치를 배포하면 허브는 즉시 공개된다는 점만 재확인한다.

Layer 2에서 Layer 1과 모순되거나 새로 창작된 내용은 발견하지 못했다.

---

## 판정

- **공개 발행(PUBLICATION): NO-SHIP.** 이유는 코드 결함이 아니라 (1) 실제 대만 변호사의 원고 승인 기록 없음, (2) 사이트 소유자의 발행 승인 없음, (3) Layer 2 허브 문구의 변호사 승인 미완(이전 리뷰 P0). 발행 전 L-4(각주 라벨)와 분류 노출 작업이 필요하다.
- **초안 구현을 로컬에 유지: 가능.** 원고 4건 byte-identical, 메타데이터 창작 없음, 공개 표면 7종에서 유출 없음, 기존 칼럼 무변경, 비밀 없음. 유지하면서 M-1·M-2는 고치는 것을 권한다(둘 다 재현성·CI 문제이며 10줄 내외 수정).
