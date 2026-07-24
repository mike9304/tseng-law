# Column Editor Platform — 20-Round Adversarial Design Debate

- **Date**: 2026-07-24
- **Work order**: `/tmp/WO-COLUMN-EDITOR-PLATFORM-2026-07-24.md`
- **Base**: `origin/main` @ `23248805` (worktree `feat/column-editor-platform-20260724`)
- **Phase**: design-only (no source/schema/config/test modifications)
- **Method**: sequential adversarial rounds; each round must refute or refine the previous decision and ground claims in current code

## Code inventory (pre-round grounding)

| Area | Path | Observed fact |
|---|---|---|
| Editor | `src/components/builder/columns/ColumnEditor.tsx` | TipTap `StarterKit` (H1–H3) + `Image` + `Placeholder`; toolbar P/H1–H3/B/I/U/list/blockquote/codeBlock/hr/link/image; 1s debounce autosave; PATCH title/summary/bodyHtml/bodyMarkdown |
| Save/publish ops | `src/components/builder/columns/column-editor-ops.ts` | `InflightSaveCoordinator` serializes PATCH; publish = cancel debounce → ensureSaved → POST publish; 503/429 mapping from `020ca6c4` |
| Schema | `src/lib/builder/columns/types.ts` | `version: z.literal(1)`; no typography fields; `columnBodyHtmlSchema` max 1MB; locales via `z.enum(locales)` |
| Locales | `src/lib/locales.ts` | `['ko','zh-hant','en']` only — **no `ja`** |
| Storage | `src/lib/builder/columns/storage.ts` | draft/published variant files; blob/file backends; legacy markdown import; `normalizeColumnDocument` rejects non-v1 |
| Public page | `src/app/[locale]/columns/[slug]/page.tsx` | `<ColumnContent content={post.content} />` where content is markdown-ish |
| Public body | `src/components/ColumnContent.tsx` | `react-markdown` + `remark-gfm` (tables already supported on public markdown path) |
| Blob→post | `src/lib/consultation/columns-blob-reader.ts` | `content = bodyMarkdown \|\| stripHtml(bodyHtml) \|\| summary` |
| Frontmatter UI | `ColumnFrontmatterPanel.tsx` | featured/review/freshness/category/tags/author/image/SEO/noIndex/slug |
| List | `ColumnListView.tsx` | search + category + status filter; per-card publish/feature; no multi-select bulk |
| Locale link | `ColumnLocaleLinker.tsx` | `linkedSlugs` bidirectional PATCH on blur |
| Editor CSS | `src/app/column-editor.css` | root `font-family: system-ui...` — no font controls |
| Public fonts | `src/app/fonts.ts` + `globals.css` | Noto Sans/Serif KR for ko+en; TC for zh-Hant; tokens `--font-body`, `--font-body-zh`, heading variants |
| TipTap deps | `package.json` | image/link/placeholder/underline/react/starter-kit only — **no table/text-align/text-style** packages |
| Underline bug | `ColumnEditor.tsx` | toolbar calls `toggleUnderline()` but `Underline` extension is **not** registered in `useEditor` |
| HTML sanitizer | repo-wide | **no** DOMPurify / sanitizeHtml for column bodyHtml |
| Admin preview | edit page | `dangerouslySetInnerHTML={{ __html: column.bodyHtml }}` — SSR snapshot, not live editor state |
| Concurrency | PATCH route | revision increments only; **no If-Match / expectedRevision check** |
| Publish | publish route | read draft → `writePublishedColumn` overwrite; slug redirect optional |

---

## Round 1 — 현재 UX/기능 inventory와 사용자 가치

### 질문
변호사/편집자가 칼럼을 쓸 때, **지금 제품이 실제로 주는 가치**와 **가치 대비 깨지기 쉬운 자리**는 무엇인가?

### 찬성안
- **현재 가치 코어**: draft autosave + publish + frontmatter SEO/review + locale linking + asset image insert + public list/detail. 020ca6c4 이후 save/publish serialization이 신뢰성 축이다.
- **사용자 가치 확장**: (1) 안정성 회귀 방지, (2) ko/zh-hant/en 타이포 프리셋으로 “법무 에디토리얼” 톤 제어, (3) 편집 toolbar/마크 다양화는 그 위에 얹는다.
- **우선 순위 제안**: stability > document-level typography > formatting that survives public render > list/workflow sugar.

### 반대/위험
- toolbar에 버튼만 늘리면 “기능 있는 척” 함정. 공개 페이지는 markdown 경로라 editor HTML 전용 마크는 **작성자 미리보기와 라이브가 불일치**한다.
- 편집기 chrome이 `system-ui` 고정이라 작성 중 체감 글꼴 ≠ 공개 사이트 Noto 스택 → 타이포 작업 자체가 검증 불가.
- Underline 패키지는 설치됐지만 extension 미등록 → 이미 “깨진 버튼”이 존재. 새 기능 추가 전 재고 정리가 필요.

### 결정
**P0 사용자 가치 = (A) 기존 save/publish/list/frontmatter 회귀 0 + (B) 공개·편집 모두에서 보이는 locale typography presets + (C) 이미 깨진 underline 등 기본 마크 정합.**  
“위지윅 워드프로세서 풀세트”는 사용자 목표의 수단이지 1차 성공 기준이 아니다.

### 다음 검증
저장 계약·public render 경로를 문서화해, 어떤 기능이 markdown/HTML 어느 쪽에 살아야 하는지 확정한다 (Round 2–3).

---

## Round 2 — 기존 저장/발행 데이터 계약과 migration 전략

### 질문
`ColumnDocument.version: 1`과 draft/published variant를 깨지 않고 typography·편집 확장을 어떻게 넣는가?

### 찬성안
- **Additive v1**: `frontmatter.typography` optional 객체 + (필요 시) `bodyFormat: 'markdown' | 'html'` optional. `columnDocumentSchema`는 unknown field strip 없이 optional 추가만.
- **Normalize 경계**: `storage.normalizeColumnDocument`가 이미 safeParse 실패 시 null → legacy fallback. 신규 필드는 **optional + default 주입**으로 읽어 들이고, 옛 문서는 필드 부재 = 기본 프리셋.
- **발행 모델 유지**: draft write ≠ publish; publish는 draft 스냅샷을 published에 복사. 타이포 필드도 동일 복사로 따라간다.
- **Migration 정책**: 배치 마이그레이션 금지(blob 전체 rewrite 비용·위험). read-path defaulting + write-path re-emit.

### 반대/위험
- `version: z.literal(1)`을 2로 올리면 기존 blob JSON 전량이 parse 실패 → public/AI 칼럼 증발. **하드 버전 범프는 금지**.
- frontmatter에 raw CSS string을 넣으면 allowlist 우회 + XSS 표면.
- bodyHtml 1MB cap 유지; 타이포 마크가 HTML을 비대화시키면 autosave/blob 비용 상승.
- 상담 엔진 `columns-blob-reader`가 frontmatter typography를 모르고 content만 쓰므로, AI 쪽은 타이포 무시(의도적으로 OK). 단 schema 중복 인터페이스 `ColumnDocumentFromBlob` 동기화 누락 위험.

### 결정
**Schema stays `version: 1`. Additive optional `frontmatter.typography` (preset IDs only). No batch rewrite. Published remains a full document copy of draft at publish time.**  
별도 history store는 이번 계약에 넣지 않는다 (Round 15에서 우선순위 재평가).

### 다음 검증
TipTap 확장 후보가 schema/markdown과 충돌하는지 검토 (Round 3).

---

## Round 3 — TipTap extension 후보 및 markdown/html round-trip

### 질문
어떤 TipTap 확장을 켜도 **public `ColumnContent`(markdown)** 와 **admin preview(HTML)** 가 의미를 잃지 않는가?

### 찬성안
- **Public source of truth 재확인**: `columns-blob-reader` → `content = bodyMarkdown || stripHtml(bodyHtml)`. 페이지는 markdown 렌더. 따라서 **마크다운에 표현 가능한 것만 “공개 보장 기능”**으로 분류.
- **현 serializer** (`serializeEditorMarkdown`): paragraph/heading/image/lists/blockquote/codeBlock/hr/hardBreak + bold/italic/code/link. **underline, tables, align, font, color 미지원.**
- **후보 분류**:
  - *Safe now (P0)*: register `Underline` (package already present); fix serializer to `++text++` or HTML `<u>` passthrough strategy; bold/italic/link hygiene.
  - *GFM-aligned (P1)*: tables (public already has table component via remark-gfm) — needs TipTap Table packages + markdown serializer.
  - *Class-based only (P1)*: TextAlign as `text-align` style → **reject raw style**; use `data-align` / class mark that HTML sanitizer allowlists AND markdown custom directive **or** accept that align is HTML-only path.
  - *Defer (P2)*: Color, highlight, footnotes, custom font marks, file embeds.

### 반대/위험
- “bodyHtml을 public source of truth로 전환”하면 ReactMarkdown 경로·FAQ/SEO 안정성·AI stripMarkdown 계약이 흔들린다.
- dual-write(html+md)는 이미 있으나 **md가 빈약하면 public이 빈약** — HTML-only 개선은 가짜 완성.
- remark-gfm table은 markdown pipe table만 이해; TipTap complex tables(colspan)는 round-trip 실패.
- StarterKit History는 있으나 UI undo 버튼 없음 — extension 폭주 전에 기본 편집 안정성.

### 결정
**Keep dual fields; public remains markdown-primary for v1 extensions.**  
P0: fix mark registry + markdown serializer fidelity for existing toolbar marks.  
P1: only add extensions with explicit serializer + public renderer tests.  
**Do not switch public renderer to raw HTML without sanitizer + feature flag (Round 5/14).**

### 다음 검증
표/캡션/코드/인용/각주의 보안·복잡도 (Round 4).

---

## Round 4 — 표(table)·캡션·코드·인용·각주 기능의 안전성

### 질문
법률 칼럼에서 표·각주가 진짜 필요한가, 아니면 scope creep인가?

### 찬성안
- **인용/코드**: 이미 toolbar + StarterKit + serializer 존재. 안전성 이슈는 HTML 그대로 저장·admin preview 미새니타즈.
- **표**: public `ColumnContent`가 이미 GFM table wrapper를 가짐 → **콘텐츠 파이프는 준비됨**. 편집기만 못 만듦. 법률 비교표 수요 실재.
- **캡션**: image alt/title만 현재 지원; figure/figcaption은 schema/HTML 확장 필요.
- **각주**: 법률 문서 문법상 매력적이나 TipTap footnote + markdown 표준 불안정 → P2.

### 반대/위험
- Table extension bundle size + nested list-in-cell XSS vectors.
- 표 없는 상태로 markdown에 손으로 넣은 GFM table은 public에는 보이지만 editor re-open 시 깨질 수 있음(HTML paste path).
- 각주는 AI knowledge strip/FAQ extractor와 충돌 가능.
- caption을 frontmatter가 아닌 inline HTML로 넣으면 sanitize 목록 비대화.

### 결정
- **P0**: blockquote/codeBlock **회귀 테스트 + sanitizer** (기능 추가 아님).
- **P1**: GFM-compatible simple tables (no colspan/rowspan) + markdown serializer `|` tables + editor toolbar.
- **P2**: figure/figcaption polish, footnotes.
- **Out**: nested spreadsheet-like tables, Excel paste fidelity.

### 다음 검증
이미지/링크/파일 embed의 XSS/SSRF 경계 (Round 5).

---

## Round 5 — 이미지/링크/파일 embed와 XSS/SSRF 경계

### 질문
현재 insert path는 안전한가? 확장은 어디에 막아야 하는가?

### 찬성안
- **이미지**: `AssetLibraryModal` → `setImage({ src: asset.url })`. 자산 라이브러리 origin으로 제한하는 것이 옳다. 외부 URL 직접 입력 UI는 열지 않거나 allowlist(https + same-site/blob CDN).
- **링크**: `prompt()`로 임의 href. StarterKit link attrs에 `rel=noopener noreferrer nofollow`. **javascript:/data: 스킴 차단 필요** (server + client).
- **Public links**: `ColumnContent` anchors force `target=_blank` + rel — OK.
- **파일 embed / iframe / video**: 이번 릴리스 **금지**. SSRF·tracking·layout break.
- **Sanitizer 필수 위치**:
  1. PATCH/POST server: sanitize `bodyHtml` before write
  2. Admin preview: never trust stored HTML raw long-term
  3. If HTML public path ever enabled: same allowlist

### 반대/위험
- 현재 **서버 bodyHtml 무검증 저장** (`patch` just assigns). XSS는 admin preview `dangerouslySetInnerHTML`과 (미래) HTML public path에서 터짐.
- 작성자 본인이 피해자인 stored XSS도 운영상 사고(세션 쿠키 탈취 가능 여부 별도).
- Asset URL이 absolute https가 아니면 mixed content.
- markdown 이미지 `![](url)`도 public에서 `<img src>` — 악성 URL은 트래킹 픽셀 가능 → https + host allowlist 권장.

### 결정
**P0 security gate: server-side HTML allowlist sanitizer on write; link scheme allowlist (`http:`,`https:`,`mailto:`); image src allowlist (site/blob/asset hosts); no file/iframe embeds; no external @font-face URLs.**  
Client-only validation은 보조.

### 다음 검증
undo/history와 multi-tab draft conflict (Round 6).

---

## Round 6 — undo/redo·history·draft conflict 전략

### 질문
TipTap history와 문서 revision, 다중 탭 충돌을 어떻게 나눌 것인가?

### 찬성안
- **In-session undo/redo**: StarterKit History 이미 포함. UI에 Undo/Redo 버튼 + `Mod-z`/`Mod-Shift-z` 힌트만 노출 (P0 polish).
- **Document revision**: 서버가 매 PATCH마다 +1. **CAS 도입 후보**: client sends `baseRevision`; mismatch → 409 `draft_conflict`. 단순 last-write-wins 유지 시 탭 2개에서 교차 저장 손실.
- **Conflict UX (P1)**: 409 시 “서버 최신 불러오기 / 내 내용 강제 덮어쓰기” 모달. 강제 덮어쓰기는 명시 버튼.
- **Long-term version history store**: 별도 blob path `.../history/{rev}.json` — 비용·UI 큼 → Round 15.

### 반대/위험
- CAS 없으면 변호사 두 탭/폰+PC에서 조용한 데이터 손실.
- CAS만 넣고 UI 없으면 autosave가 에러 스팸.
- History extension depth 무제한 시 메모리 — 기본값 유지.
- “버전 복원”을 P0에 넣으면 publish 원자성 작업과 범위 충돌.

### 결정
**P0: expose TipTap undo/redo; keep last-write-wins but surface save errors clearly (already partial).**  
**P1: optional `baseRevision` CAS on PATCH with 409 + reload UX.**  
**P2: persistent version history / restore.**

### 다음 검증
autosave/offline/retry/publish transaction (Round 7) — 020ca6c4 회귀 금지 축.

---

## Round 7 — autosave·offline/retry·publish transaction 전략

### 질문
020ca6c4의 save/publish 신뢰성을 깨지 않고 typography 필드를 어디에 실을 것인가?

### 찬성안
- **유지 필수**:
  - `InflightSaveCoordinator` (동일 payload join, 이종 payload serialize)
  - `executeColumnPublish`: debounce cancel → save success required → single publish POST
  - `withPublishBusyLock`
  - 503 `rate_limit_unavailable` / 429 copy mapping + unit tests
- **Autosave debounce 1000ms** 유지; typography/frontmatter는 기존 FrontmatterPanel 1s debounce와 **독립 PATCH** — 충돌 시 revision race (Round 6 CAS로 완화).
- **Publish atomicity 현실**: Vercel Blob `put` overwrite는 단일 객체 원자적이나 draft+published 2객체 트랜잭션은 없음. **규칙**: publish 실패 시 draft 유지, published 불변. published write 성공 후 slug redirect/embeddings는 best-effort (현 코드와 동일).
- **Retry**: client exponential backoff for network/503 on save (P1); publish manual retry only (이중 publish side-effect: embeddings/search rebuild — 멱등에 가깝지만 비용).

### 반대/위험
- FrontmatterPanel과 ColumnEditor가 **각각 독립 PATCH** → 한 쪽 저장이 다른 쪽 unsaved body를 덮을 수 있음?  
  실제 PATCH는 partial merge (`patch.bodyHtml ?? base.bodyHtml`) 이므로 **body 없는 frontmatter PATCH는 body 보존**. 역도 성립. **revision만 경쟁 증가**.
- offline queue를 localStorage에 넣으면 XSS/민감 초안 유출 + multi-tab hell → **P2 이상, 이번 비목표**.
- “temp published then swap”은 blob rename 부재로 구현 어려움 — 현 overwrite 모델 유지.

### 결정
**Do not rewrite save/publish orchestration. Extend payloads only. Add retry/CAS as additive. Treat published overwrite as the atomic unit; never write published from partial editor state (always save draft first).**

### 다음 검증
locale별 글꼴 프리셋 — ko (Round 8).

---

## Round 8 — 한국어 typography presets와 fallback

### 질문
ko 칼럼의 본문/제목 글꼴을 사이트 토큰과 어떻게 맞출 것인가?

### 찬성안
- **Active stack (code)**: `fonts.ts` loads Noto Sans KR + Noto Serif KR; `globals.css`  
  - body: `--font-body` → Noto Sans KR + Apple SD Gothic Neo + Noto Sans KR + system  
  - heading: `--font-heading-ko` → Noto Serif KR + Nanum Myeongjo + Georgia
- **docs/typography-spec.md** mentions Pretendard/Nanum — **stale relative to fonts.ts**. 구현 근거는 **fonts.ts + globals.css**를 canonical로.
- **Presets (document-level)**:
  | presetId | role | family token | weight | size token | line-height |
  |---|---|---|---|---|---|
  | `ko-body-sans` | default body | `--font-body` | 400 | body `1.0625rem` | 1.75 |
  | `ko-body-readable` | long-form | same | 400 | `1.125rem` | 1.85 |
  | `ko-display-serif` | emphasis article | heading stack for h1–h2 | 600 | scale | 1.25 headings / 1.75 body |
  | `ko-compact` | dense FAQ-like | sans | 400 | `1rem` | 1.65 |

### 반대/위험
- 편집기에 system-ui만 쓰면 프리셋 선택이 무의미 → **editor body must apply same CSS variables**.
- Pretendard CDN 재도입은 외부 의존·FOIT·보안 정책 위반 소지 → **금지**, Noto only.
- weight 300 요청 시 next/font에 없음 → fallback fake bold/light.

### 결정
**ko presets map only to already-loaded Noto KR variables + documented system fallbacks. Default `ko-body-sans`. Editor chrome switches from system-ui to locale font class for the writing surface.**

### 다음 검증
繁中 프리셋 (Round 9).

---

## Round 9 — 繁體中文 typography presets와 fallback

### 질문
zh-hant는 TC 페어만 로드되는데 프리셋이 KR 스택을 참조하지 않는가?

### 찬성안
- `getLocaleFontClassName('zh-Hant')` → Noto Sans TC + Noto Serif TC only.
- `html[lang='zh-Hant'|'zh-hant']` rebinds `--font-body` to `--font-body-zh`.
- **Presets**:
  | presetId | family | weight | size | line-height | fallback |
  |---|---|---|---|---|---|
  | `zh-body-sans` | `--font-body-zh` | 400 | 1.0625rem | 1.8 | PingFang TC, Microsoft JhengHei, Noto Sans TC |
  | `zh-body-readable` | same | 400 | 1.125rem | 1.9 | same |
  | `zh-display-serif` | `--font-heading-zh` for headings | 600 | scale | 1.3 / 1.8 | Noto Serif TC, Songti TC |
  | `zh-compact` | sans | 400 | 1rem | 1.7 | same |

- CJK 줄간격은 라틴보다 넓게 (1.8–1.9).

### 반대/위험
- locale 필드가 `zh-hant`인데 fonts API는 `zh-Hant` — 매핑 실수 시 KR 폰트 로드 없음 + 글리프 tofu.
- Noto Sans TC weight 600 가용성은 환경 따라 다름 — 500/700 fallback 명시.
- 번체 전용 폰트를 en 문서에 적용하면 라틴 metrics 악화 → **preset locale-scoped**.

### 결정
**zh-hant presets only reference TC tokens; resolver maps `zh-hant` → DocumentLanguage `zh-Hant`. No cross-loading KR faces on zh pages.**

### 다음 검증
en 프리셋과 locale parity (Round 10).

---

## Round 10 — 영어 typography presets와 fallback 및 locale parity

### 질문
en은 KR 페어를 공유한다. 별도 라틴 디스플레이 폰트가 필요한가?

### 찬성안
- Code decision already: “EN intentionally shares the KR pair for visual cohesion” (`fonts.ts`).
- **Parity principle**: same preset *roles* across locales (`body-sans`, `body-readable`, `display-serif`, `compact`) with locale-specific family IDs.
- en presets:
  | presetId | family | weight | size | line-height | fallback |
  |---|---|---|---|---|---|
  | `en-body-sans` | `--font-body` (KR sans, Latin glyphs OK) | 400 | 1.0625rem | 1.7 | system-ui stack |
  | `en-body-readable` | same | 400 | 1.125rem | 1.8 | same |
  | `en-display-serif` | `--font-heading-en` (= KR serif) | 600 | scale | 1.25 / 1.7 | Georgia, Times |
  | `en-compact` | sans | 400 | 1rem | 1.6 | same |

- SEO note: en public columns currently `noindex` in generateMetadata — typography work must not accidentally index.

### 반대/위험
- 별도 Cormorant/Inter 추가는 font payload·layout shift·parity tests 증가. typography-spec 잔재와 혼동.
- en line-height를 CJK처럼 1.9로 잡으면 과도한 여백.
- “parity”를 픽셀 동일로 오해하면 CJK metrics 때문에 실패 — **role parity not pixel parity**.

### 결정
**Keep en on KR Noto pair. Provide role-parallel presets. Do not add new next/font families in this release.**  
`ja` is **not** in `locales` — explicitly out of scope; if discovered later, new locale is a separate program.

### 다음 검증
allowlist storage schema / CSS injection 방지 (Round 11).

---

## Round 11 — 사용자 지정 글꼴의 allowlist/저장 schema/CSS injection 방지

### 질문
스키마에 무엇을 저장하고, 무엇을 절대 저장하지 않는가?

### 찬성안
```ts
// conceptual — plan only
typography: {
  presetId: z.enum([...ALL_PRESET_IDS]), // required when object present
  // optional overrides from closed enums only:
  bodySize: z.enum(['sm','md','lg']).optional(),
  headingWeight: z.enum(['500','600','700']).optional(),
  lineHeight: z.enum(['tight','normal','relaxed']).optional(),
}
```
- **Resolver**: `presetId` → CSS class on `<article>` / editor root, e.g. `column-typo--ko-body-readable`.
- **Forbidden**: arbitrary `fontFamily` strings, `url(`, `@font-face`, base64 fonts, style attributes from user for family.
- **Inline mark fonts (if ever)**: mark attrs only store `presetToken` enum, never CSS.

### 반대/위험
- “custom font upload” 요청이 와도 blob font + font-face injection은 XSS/supply-chain — **영구 금지** unless separate security RFC.
- class name 동적 조립 시 `presetId` 검증 실패하면 drop to default.
- old docs without field → default per locale.

### 결정
**Closed enum presetId + optional closed override enums only. CSS maps live in code, not data. No user-supplied font URLs or CSS.**

### 다음 검증
size/weight/line-height/letter-spacing/align 편집 모델 (Round 12).

---

## Round 12 — font size/weight/line-height/letter-spacing/align 편집 모델

### 질문
문서 레벨 vs 인라인 마크, 어디를 P0로 두는가?

### 찬성안
- **P0 Document model** (frontmatter.typography): size/line-height/weight as enums → CSS variables on article.
- **P1 Block align**: paragraph/heading `text-align: left|center|right|justify` via TipTap TextAlign **but serialize as** `class="ce-align-center"` (not raw style) + sanitizer allow class prefix `ce-`.
- **P1 Inline emphasis only**: bold/italic/underline (already). **No** per-word font-size picker in P0 (Word-like UI = support burden).
- **letter-spacing**: document-level enum only (`default|wide-labels`) — body tracking 변경은 가독성 해침 → 기본 비활성.
- **Markdown impact**: document-level CSS **does not need markdown** — applies in public page wrapper even when body is markdown. **This is why document-level wins P0.**

### 반대/위험
- 인라인 font-size mark는 markdown round-trip 불가 → public 누락 (Round 3).
- justify + CJK 는 가독성 논쟁 — allow but default left/start.
- class-based align in HTML stored bodyHtml; public markdown path **drops align** unless:
  - (a) public switches to sanitized HTML for v-rich docs, or
  - (b) markdown custom container, or
  - (c) accept align editor-only until HTML public path.
- **Recommendation**: P1 align ships with **feature-flagged sanitized HTML public render when `frontmatter.renderMode === 'html'`**, default still markdown.

### 결정
**P0: document typography enums → CSS classes on public article + editor (works with markdown body).**  
**P1: block align + optional `renderMode: 'html'` flag with sanitizer; default markdown unchanged.**  
**P2: inline size/color.**

### 다음 검증
모바일/a11y/keyboard (Round 13).

---

## Round 13 — 모바일/반응형/접근성 키보드 UX

### 질문
편집기 toolbar·sticky topbar가 좁은 화면에서 쓰이는가?

### 찬성안
- `column-editor.css` sticky topbar/toolbar; grid writer mode single column — mobile admin exists but dense.
- **A11y P0**:
  - toolbar buttons: `type="button"`, `aria-pressed` for active marks, visible focus rings (`.column-focus` already)
  - keyboard: Ctrl/Cmd+B/I/U, undo/redo; Escape closes asset modal
  - save state not color-only (text already: saving/saved/error)
- **Responsive P1**: toolbar wrap + overflow scroll; touch targets ≥ 40px (many buttons already ~34px — bump).
- **Public typography**: rem-based scale + line-height; avoid px-fixed; respect `prefers-reduced-motion` (no new motion).

### 반대/위험
- prompt() for links is inaccessible and unvalidated — replace with dialog (P1).
- sticky double headers (page header + editor topbar) steal viewport on phone.
- screen reader: EditorContent needs labeled region.

### 결정
**P0 a11y fixes for existing controls + typography CSS rem scale.**  
**P1 toolbar overflow + link dialog.**  
No separate mobile-only editor app.

### 다음 검증
SEO/semantic/JSON-LD/public renderer (Round 14).

---

## Round 14 — SEO/semantic HTML/JSON-LD와 public renderer 영향

### 질문
타이포·HTML 렌더 변경이 Article JSON-LD·헤딩 위계를 깨는가?

### 찬성안
- Public page: hero `h1` = title; body should use **h2/h3 only** ideally. Editor allows H1 — risk of dual h1.
- JSON-LD `buildArticleJsonLd` uses title/summary/dates/author — typography irrelevant.
- FAQ JSON-LD only ko/zh-hant.
- **Semantic rules**:
  - Prefer body headings start at H2 in editor guidance (soft); optional schema normalize demote H1→H2 in body on publish (aggressive — maybe P2).
  - If HTML render mode: sanitize must keep `h1-h3,p,ul,ol,li,blockquote,pre,code,a,img,table,thead,tbody,tr,th,td,hr,br,strong,em,u`.
- **noIndex** frontmatter + en default noindex remain.

### 반대/위험
- HTML mode without heading control → a11y SEO noise.
- `dangerouslySetInnerHTML` public path without sanitizer = stored XSS indexed.
- Changing markdown components' class names can break blog CSS.

### 결정
**Default public path stays ReactMarkdown. Typography classes wrap `.blog-article` / `.blog-body`.**  
**HTML render mode only behind sanitizer + optional frontmatter flag; SEO metadata path unchanged.**  
Document heading guidance: avoid body H1.

### 다음 검증
preview/compare/version restore priority (Round 15).

---

## Round 15 — preview/compare/version restore 기능 우선순위

### 질문
고급 미리보기·버전 비교를 이번 릴리스에 넣을 것인가?

### 찬성안
- **Current preview**: edit page advanced shell shows **server-rendered initial** bodyHtml — not live. Misleading.
- **P0 fix**: live preview from editor state OR remove stale HTML preview label; at least note “saved snapshot”.
- **P1**: side-by-side draft vs published text diff (title/summary/bodyMarkdown).
- **P2**: revision history list + restore to draft (new storage paths).

### 반대/위험
- Live preview dual TipTap expensive; simpler: “Open public page” already exists + markdown preview component reusing `ColumnContent`.
- Version store doubles blob ops/cost.
- Compare UI scope creep vs typography goals.

### 결정
**P0: preview honesty — render live markdown via `ColumnContent` for draft bodyMarkdown in advanced panel (client) OR hide stale HTML.**  
**P1: draft vs published basic diff.**  
**P2: restore.** Not release-blocking for typography.

### 다음 검증
translation linking workflow (Round 16).

---

## Round 16 — translation linking/locale copy workflow

### 질문
`linkedSlugs`와 타이포 프리셋이 locale 복사 시 어떻게 동작해야 하는가?

### 찬성안
- `ColumnLocaleLinker` PATCHes linkedSlugs; reverse link best-effort.
- **Copy workflow (P1)**: “이 글을 zh-hant 초안으로 복제” → create new slug or same slug per locale storage key `(locale, slug)`; copy body; **reset typography preset to target locale default** (do not copy `ko-body-sans` onto zh doc).
- linkedSlugs keys only ko/zh-hant/en — matches schema.
- Translation status alert already in editor topbar.

### 반대/위험
- reverse link PATCH not awaited / error swallowed — link graph half-updated.
- same slug across locales is allowed by storage path design; copy UX must not assume global unique slug.
- Auto-translate via DeepL/OpenAI = provider QA pending — **out of scope**.

### 결정
**Keep manual linking. P1 optional “duplicate to locale” with preset remap. No MT. Fix reverse-link error handling when touching linker.**

### 다음 검증
list manager bulk/search/review (Round 17).

---

## Round 17 — list manager bulk actions/search/filter/review workflow

### 질문
리스트 UX를 어디까지 손대야 하는가?

### 찬성안
- **Existing**: search text, category sidebar, status filter (draft/published/scheduled/needs-review), feature star, per-card publish/delete-ish menu.
- **P0**: no bulk required for typography release.
- **P1**: bulk set review status / freshness; bulk open issues for “needs-revision”.
- **P2**: multi-select publish (dangerous — embeddings storm).

### 반대/위험
- bulk publish without per-item save guarantees = partial failure hell.
- filter by typography preset — low value.

### 결정
**List bulk is P2. P0 only: ensure list still works; optional badge if draft dirty. Review workflow remains per-doc frontmatter.**

### 다음 검증
perf/bundle/blob/observability (Round 18).

---

## Round 18 — 성능/번들/Blob 비용/관측성

### 질문
TipTap 확장·폰트·autosave가 비용을 어떻게 키우는가?

### 찬성안
- **Bundle**: Table + TextAlign + sanitizer library add weight to admin-builder chunk only if dynamically imported on edit route — prefer edit-page-only imports (already client components).
- **Fonts**: no new next/font families → no extra public payload. Editor reuses CSS variables already on layout.
- **Blob**: each autosave full JSON rewrite; larger bodyHtml increases put costs. Debounce 1s + coordinator already mitigates thrash.
- **Observability**: keep `recordColumnEvent` publish/save; add errorCode logs for sanitize strip counts (P1).
- **Public**: markdown path cheaper than large HTML parse if we avoid HTML mode default.

### 반대/위험
- isomorphic-dompurify / sanitize-html size on server is OK; on client bundle careful.
- History of every revision → cost explosion (already deferred).
- Embedding rebuild on every publish already fire-and-forget cost — bulk publish would multiply.

### 결정
**No new public fonts. Admin-only extension imports. Default markdown public. Monitor autosave payload size; keep 1MB bodyHtml cap.**

### 다음 검증
test matrix / failure injection (Round 19).

---

## Round 19 — 테스트 matrix와 실패 주입/운영 smoke

### 질문
무엇을 자동화하고, Codex 검증 게이트에 무엇을 넘기는가?

### 찬성안
| Layer | Tests | Command |
|---|---|---|
| Unit ops | existing column-editor-ops 503/429/publish serialization | `vitest` path |
| Unit schema | typography enum accept/reject; unknown font string reject | new |
| Unit sanitize | script/onerror/javascript: stripped | new |
| Unit markdown | underline/table/align serialization fixtures | new |
| API | PATCH merge preserves body when only typography; publish copies typography | extend route tests |
| Storage | legacy doc without typography still reads | storage tests |
| Component | editor registers Underline; preset class on root | vitest/react if present |
| e2e | save → publish → public shows class/font token | playwright admin flow |
| Failure inject | 503 on PATCH blocks publish (exists); network error copy | unit |
| a11y | toolbar aria-pressed smoke | axe optional |

- **Regression lock**: do not remove tests from `column-editor-ops.test.ts`.
- **Ops smoke**: `npm run qa` (typecheck/lint/unit/security routes); manual browser on `/admin-builder/columns`.

### 반대/위험
- Full playwright builder suite flaky/slow — scope column-specific smoke.
- Visual font screenshots brittle — assert computed `font-family` contains Noto token or class name presence.

### 결정
**Mandatory: unit schema+sanitize+ops+API; playwright one happy path per locale optional in P1. Codex final QA uses `npm run qa` + manual publish smoke.**

### 다음 검증
적대적 최종 review / scope cut / release gates (Round 20).

---

## Round 20 — 적대적 최종 review, scope cut, release gates

### 질문
이 설계가 과한가? 무엇을 잘라야 출시 가능한가?

### 찬성안 — Release slice (this program)

**P0 (must ship together)**  
1. Stability: no regression to save/publish coordinator, rate-limit copy, draft/published split.  
2. Security: server HTML + URL sanitizer on column write.  
3. Fix Underline extension registration + markdown serialize underline.  
4. Document-level `frontmatter.typography` allowlisted presets for ko/zh-hant/en; apply CSS on public article + editor writing surface (replace system-ui on editor body).  
5. Schema additive v1; legacy docs default presets.  
6. Tests for 2–5.  
7. Preview honesty (don’t claim live HTML if stale).

**P1**  
- Text align + optional `renderMode: 'html'` sanitized public path  
- GFM tables in editor  
- baseRevision CAS  
- link dialog replacing prompt  
- locale duplicate workflow  
- draft vs published diff  

**P2**  
- footnotes, inline color/size, version restore, bulk publish, offline queue, new font families, ja locale  

**Explicit non-goals**  
- External font URL / @font-face injection  
- Arbitrary CSS in stored fields  
- Replacing Wix builder canvas with column editor  
- Machine translation  
- Hard `version: 2` migration rewrite  

### 반대/위험 (final red team)
- If P0 includes both sanitizer + typography + underline but **skips public class wiring**, typography is admin-only placebo.  
- If HTML render mode sneaks into default, markdown legal columns may regress (GFM tables/footnotes in content files).  
- If editor font class applied globally to `.column-editor-page`, UI chrome may break layout — **scope class to `.column-editor-body` / article only**.  
- Concurrent FrontmatterPanel + Editor PATCH without CAS remains footgun — document operationally “one editor tab”.  
- User dirty WIP on main Mac Studio tree — implementation **must** stay on isolated worktree from `23248805`.

### 결정 (final)
**Ship the P0 slice only as first implementation PR series. P1 behind flags where risky (`renderMode=html`, tables). P2 backlog.**  
**Success metric**: lawyer can pick a locale typography preset, save/publish, see matching font stack on public page; existing columns unchanged; XSS payloads in bodyHtml cannot persist; publish still blocked when save fails.

### 다음 검증
Implementation plan document `docs/plans/column-editor-platform-plan-2026-07-24.md` with file-level design, preset tables, tests, rollback, commit plan. Implementation starts only after plan acceptance; coding by Grok in isolated worktree; Codex does final QA.

---

## Decision log (cross-round)

| ID | Decision | Origin rounds |
|---|---|---|
| D1 | Public body remains markdown-primary by default | 1,3,14,20 |
| D2 | Schema stays version 1; additive `frontmatter.typography` | 2,11 |
| D3 | Typography = closed preset enums → CSS classes, never raw CSS | 8–12 |
| D4 | No new next/font families; use Noto KR/TC pairs already loaded | 8–10,18 |
| D5 | en shares KR pair; no `ja` in scope | 10 |
| D6 | Preserve InflightSaveCoordinator + publish-after-save | 7,20 |
| D7 | Server-side sanitize bodyHtml + URL schemes on write | 5,14,20 |
| D8 | Fix Underline registration before new extensions | 1,3,20 |
| D9 | Tables/align/HTML mode/CAS = P1; history/bulk = P2 | 4,6,12,15,17,20 |
| D10 | Implementation only on isolated worktree from `23248805` | WO,20 |

## Open questions (do not block P0)

1. Should body H1 be auto-demoted on publish? (default: no, soft guidance only)
2. Exact asset host allowlist for images (derive from existing asset storage domains at implement time)
3. Whether P1 HTML render mode is worth the dual-path complexity after P0 ships — re-evaluate with lawyer feedback on align/tables

---

*End of 20-round debate transcript. No source code was modified in this phase.*
