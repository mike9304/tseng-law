# Column Editor Platform — Implementation Plan

- **Date**: 2026-07-24  
- **Debate**: `docs/plans/column-editor-platform-debate-2026-07-24.md`  
- **Work order**: `/tmp/WO-COLUMN-EDITOR-PLATFORM-2026-07-24.md`  
- **Base commit**: `origin/main` @ `23248805`  
- **Worktree branch**: `feat/column-editor-platform-20260724`  
- **Constraint**: design phase produced this plan; implementation must not touch the user’s dirty main worktree; no commit/push/deploy until Codex QA  

---

## 1. Problem definition and evidence

### 1.1 User goal
Stabilize the Wix-builder **column editor** and expand **ko / zh-hant / en** typography and editing so lawyers can control editorial type without breaking save/publish or public columns.

### 1.2 Evidence from current code

| Symptom / gap | Evidence |
|---|---|
| Public render ignores rich HTML styling | `ColumnContent` uses `react-markdown` on `post.content`; blob reader sets `content = bodyMarkdown \|\| stripHtml(bodyHtml)` |
| Editor preview can diverge from public | Edit page `dangerouslySetInnerHTML` on **initial** `bodyHtml`; public uses markdown |
| No typography controls | `columnFrontmatterSchema` has no font fields; `column-editor.css` fixes `system-ui` |
| Underline toolbar is broken | `toggleUnderline()` without `Underline` extension in `useEditor` despite `@tiptap/extension-underline` dependency |
| XSS surface | No DOMPurify/sanitize on column `bodyHtml`; admin preview injects HTML |
| Save/publish recently hardened | `column-editor-ops.ts` + tests from `020ca6c4` — must not regress |
| Locale set is three-way only | `src/lib/locales.ts`: `ko`, `zh-hant`, `en` — **no `ja`** |
| Fonts already locale-gated | `src/app/fonts.ts` Noto Sans/Serif KR (ko+en) / TC (zh-Hant); `globals.css` tokens |

### 1.3 Design principle (from debate)
**Document-level allowlisted typography presets** ship first because they apply as CSS classes around markdown bodies and do not require public HTML conversion. Inline Word-like font pickers are deferred until round-trip and sanitizer paths exist.

---

## 2. Scope

### 2.1 P0 — this release (required)

1. **Stability lock**: preserve `InflightSaveCoordinator`, publish-after-successful-save, 503/429 mapping, draft vs published split.  
2. **Server-side bodyHtml sanitizer + URL scheme allowlist** on create/PATCH (and publish inherits sanitized draft).  
3. **Register TipTap `Underline`**; extend markdown serializer for underline; toolbar `aria-pressed`.  
4. **Additive schema** `frontmatter.typography` (closed enums only).  
5. **Locale typography presets** (ko/zh-hant/en) → CSS classes on:
   - editor writing surface (`.column-editor-body`)
   - public article wrapper (`.blog-body` / new `column-typo--*`)
6. **Defaulting**: missing typography → locale default; legacy + v1 docs keep working.  
7. **Preview honesty**: advanced panel preview uses markdown (`ColumnContent`) for current saved/serialized md, or clearly labels snapshot limitations; stop implying live HTML fidelity if stale.  
8. **Tests** for schema, sanitizer, serializer, ops regression, API merge of typography.

### 2.2 P1 — next slice (feature-flag or follow-up PRs)

- Block text-align via class marks + optional `frontmatter.renderMode: 'markdown' | 'html'` (default `markdown`) with sanitized HTML public path  
- GFM tables in TipTap + markdown serializer  
- `baseRevision` CAS on PATCH (409 conflict UX)  
- Link dialog (replace `prompt`) with scheme validation  
- Duplicate-to-locale workflow (remap preset to target locale)  
- Draft vs published text diff  

### 2.3 P2 — backlog

- Footnotes, figure/figcaption polish  
- Inline font size/color marks  
- Persistent revision history + restore  
- List multi-select bulk publish  
- Offline save queue  
- New font families / self-host Pretendard  
- `ja` locale  

### 2.4 Explicit non-goals (this program)

- Arbitrary CSS or `@font-face` / external font URL storage  
- Hard `version: 2` forced rewrite of all blobs  
- Machine translation providers  
- Changing canvas Wix builder architecture  
- Modifying user’s dirty WIP tree outside this worktree  
- Commit/push/deploy before Codex verification  

---

## 3. Architecture overview

```
┌─────────────────────────────────────────────────────────────┐
│ Admin: ColumnEditor (TipTap) + FrontmatterPanel             │
│  - bodyHtml (sanitized on write) + bodyMarkdown (serialize) │
│  - frontmatter.typography.presetId (enum)                   │
└───────────────────────────┬─────────────────────────────────┘
                            │ PATCH/POST guardMutation
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ storage: draft JSON / published JSON (version: 1)           │
│  consultation-columns/{locale}/{slug}.json[.published]      │
└───────────────────────────┬─────────────────────────────────┘
                            │ publish copies draft → published
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ Public: getAllColumnPostsIncludingBlob                      │
│  content = bodyMarkdown (primary)                           │
│  page wraps ColumnContent with column-typo--{preset} class  │
│  CSS maps class → --font-* tokens already on <html>         │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Module / file design

### 4.1 Schema & types
**File**: `src/lib/builder/columns/types.ts`

- Keep `version: z.literal(1)`.  
- Extend `columnFrontmatterSchema`:

```ts
export const columnTypographyPresetIdSchema = z.enum([
  // ko
  'ko-body-sans', 'ko-body-readable', 'ko-display-serif', 'ko-compact',
  // zh-hant
  'zh-body-sans', 'zh-body-readable', 'zh-display-serif', 'zh-compact',
  // en
  'en-body-sans', 'en-body-readable', 'en-display-serif', 'en-compact',
]);

export const columnTypographySchema = z.object({
  presetId: columnTypographyPresetIdSchema,
  bodySize: z.enum(['sm', 'md', 'lg']).optional(),
  headingWeight: z.enum(['500', '600', '700']).optional(),
  lineHeight: z.enum(['tight', 'normal', 'relaxed']).optional(),
});

// inside columnFrontmatterSchema:
typography: columnTypographySchema.optional(),
// P1 only:
// renderMode: z.enum(['markdown', 'html']).optional(),
```

- `patchColumnInputSchema` / `createColumnInputSchema` frontmatter input: allow `typography: null` to clear → default.  
- **Reject** any string font family field — do not add.

### 4.2 Typography resolver (new)
**File**: `src/lib/builder/columns/typography.ts` (new)

Responsibilities:
- `defaultTypographyForLocale(locale): ColumnTypography`  
- `resolveTypography(doc): ResolvedTypography` → `{ className, cssVars }`  
- `assertPresetMatchesLocale(presetId, locale)` — if mismatch, coerce to locale default (data from wrong copy-paste)  
- Pure functions; unit-tested  

### 4.3 Sanitizer (new)
**File**: `src/lib/builder/columns/sanitize-body-html.ts` (new)

- Prefer lightweight allowlist sanitizer (server-side). Options at implement time:
  - `sanitize-html` dependency **or**
  - hand-rolled tag/attr allowlist if dependency policy blocks (prefer battle-tested lib for XSS).  
- Allow tags: `p,h1,h2,h3,strong,em,u,s,blockquote,pre,code,ul,ol,li,a,img,hr,br,span,table,thead,tbody,tr,th,td`  
- Allow attrs:
  - `a[href,rel,target,title]` — href scheme ∈ `http:|https:|mailto:`  
  - `img[src,alt,title]` — src host allowlist (same-origin, configured blob/asset hosts)  
  - `span/p/h*[class]` — class must match `/^ce-[a-z0-9-]+$/` or known typography hooks  
- Strip: `style`, `on*`, `script`, `iframe`, `object`, `form`, `svg`, `foreignObject`  
- Call from:
  - `src/app/api/builder/columns/route.ts` (POST create)
  - `src/app/api/builder/columns/[slug]/route.ts` (PATCH)

### 4.4 Markdown serializer
**File**: `src/components/builder/columns/ColumnEditor.tsx` (or extract `serialize-column-markdown.ts`)

- Extract serializer to `src/lib/builder/columns/serialize-markdown.ts` for testability.  
- Add underline → `++text++` **or** HTML `<u>` inside md (prefer `++` if remark plugin not present — **decision**: use `<u>text</u>` inline HTML which `react-markdown` may pass through depending on config; safer public path: map underline to HTML in serializer only if ColumnContent allows `u` via rehype-raw — **P0 simpler approach**: serialize underline as bold alternative? No.  
  **P0 concrete**: serialize underline as `++text++` and extend `ColumnContent` with a small remark plugin **or** accept underline as HTML-only in bodyHtml and document that public markdown path may drop underline until P1 HTML mode.  

  **Debate resolution for implementers**:  
  - **Preferred P0**: keep underline in bodyHtml; for markdown emit `++text++` and add `remark` handler **or** use GFM strikethrough-like; if too heavy, **public CSS cannot show underline from md** — then P0 acceptance is “underline works in editor + stored HTML; public optional”.  
  - **Stricter product P0**: switch public to render **sanitized bodyHtml when non-empty and equals editor export**, else markdown — too big.  

  **Plan mandate**: Implement underline mark correctly in editor; markdown serializer includes `<u>${text}</u>`; enable `rehype-raw` **only for trusted sanitized subset** is dangerous. Better: customize `ColumnContent` to preprocess `++underline++` syntax with a trivial replace to `<u>` via components — simplest custom syntax:

  `++text++` → component mapping in a preprocess step before ReactMarkdown.

### 4.5 Editor UI
**File**: `src/components/builder/columns/ColumnEditor.tsx`

- Import and register `Underline` from `@tiptap/extension-underline`.  
- Apply `className` / attributes on editor root: `column-editor-body column-typo--{presetId}`.  
- Preset state: load from initial frontmatter via new prop `initialTypography` **or** read-only class from parent; updates from FrontmatterPanel via shared callback/context.  

**Preferred state model (P0)**:
- `ColumnEditPage` passes `typography` into both `ColumnEditor` and `ColumnFrontmatterPanel`.  
- FrontmatterPanel owns preset select + PATCHes frontmatter.typography.  
- Editor listens to `typography` prop to update body class (no need to put typography in body autosave payload).

### 4.6 Frontmatter panel
**File**: `src/components/builder/columns/ColumnFrontmatterPanel.tsx`

- Add “Typography” fieldset: preset select (filtered by locale), optional bodySize / lineHeight selects.  
- Include in debounced frontmatter PATCH payload.  
- Copy strings in `column-edit-copy.ts` for ko/zh-hant/en.

### 4.7 Public page
**File**: `src/app/[locale]/columns/[slug]/page.tsx`  
**File**: `src/lib/consultation/columns-blob-reader.ts` (optional: plumb typography onto `ColumnPost`)

- Extend `ColumnPost` type in `src/lib/columns.ts` with optional `typographyPresetId?: string` (or full object).  
- Map from `doc.frontmatter.typography` in blob/builder converters.  
- Wrap `<div className={cx('blog-body', typographyClass)}>` around `ColumnContent`.  
- Do **not** change JSON-LD builders except if types require pass-through.

### 4.8 CSS
**Files**:
- `src/app/column-editor.css` — editor body uses `var(--font-body)` / typography modifiers; remove writing-surface dependency on pure system-ui (page chrome may keep system-ui).  
- `src/app/globals.css` or new `src/app/column-typography.css` imported from layout/public column path — define:

```css
.column-typo--ko-body-sans,
.column-typo--en-body-sans { font-family: var(--font-body); font-size: 1.0625rem; line-height: 1.75; }
.column-typo--ko-body-readable { font-size: 1.125rem; line-height: 1.85; }
/* ... */
.column-typo--zh-body-sans { font-family: var(--font-body-zh); line-height: 1.8; }
.column-typo--*-display-serif .blog-heading,
.column-typo--*-display-serif h2 { font-family: var(--font-heading-ko); /* locale variants */ }
```

Locale-specific heading token: zh classes use `--font-heading-zh`.

### 4.9 Storage / API
**Files**:
- `storage.ts` — no path change; schema parse gains optional typography automatically.  
- `mergeFrontmatter` in PATCH route — merge `typography` with null-clear semantics like other Phase 14 fields.  
- Publish route — no logic change; copies full draft including typography.  
- `columns-blob-reader.ts` interface `ColumnDocumentFromBlob` — add optional typography for type parity.

### 4.10 List / linker
- **P0**: no functional change required.  
- **P1**: duplicate-to-locale in list or linker.

### 4.11 Feature flags
**File**: env or `src/lib/builder/columns/flags.ts` (new, optional)

| Flag | Default | Purpose |
|---|---|---|
| `COLUMN_TYPOGRAPHY_ENABLED` | `true` after P0 | master switch for UI select (CSS classes still safe if data present) |
| `COLUMN_HTML_RENDER_MODE` | `false` | P1 sanitized HTML public path |
| `COLUMN_TABLE_EDITING` | `false` | P1 tables |

Flags read server-side for public render; client editor can use public env `NEXT_PUBLIC_COLUMN_*` mirrors if needed.

---

## 5. Schema / version / migration / backward compatibility

| Topic | Rule |
|---|---|
| Document version | Remains `1` |
| Missing typography | Treat as locale default at read/render time; do not rewrite blob |
| Invalid presetId | safeParse fails frontmatter → **prefer**: use `z.object({...}).catch` or preprocess strip invalid typography only — **must not** null entire document. Implement `typography` with `.optional()` and runtime coerce in `resolveTypography` if stored by hand |
| Legacy markdown columns | `legacyPostToColumnDocument` leaves typography undefined → defaults |
| Published vs draft | Independent files; publish overwrites published with draft snapshot |
| AI consultant | Continues to use markdown/text only; typography ignored (OK) |
| API clients | Old PATCH without typography unchanged |
| bodyHtml max | 1_000_000 chars unchanged |
| Locales | No `ja`; linker/schema stay three locales |

**Migration steps**: none batch. Deploy code → old content works → new edits write typography.

---

## 6. UI wire / state model

### 6.1 Edit page layout (unchanged skeleton)

```
[ return dock ]
[ header: title | open public ]
[ ColumnEditor
    topbar: slug | locale | saveState | translation | public | save | publish
    title input
    toolbar: P H1 H2 H3 B I U lists quote code hr link image | undo redo
    EditorContent.column-editor-body.column-typo--*
    summary details
]
[ advanced details
    FrontmatterPanel (incl. Typography select)
    LocaleLinker
    Preview (markdown ColumnContent)
]
```

### 6.2 State ownership

| State | Owner | Persist |
|---|---|---|
| title, summary, body | ColumnEditor | PATCH body fields, 1s debounce |
| frontmatter incl. typography | ColumnFrontmatterPanel | PATCH frontmatter, 1s debounce |
| linkedSlugs | ColumnLocaleLinker | PATCH on blur |
| saveStatus | each + optional lift | UI only |
| busy/publish lock | ColumnEditor | UI only |

### 6.3 Typography control UX

- Select label: “본문 글꼴 스타일” / “內文字體樣式” / “Body type style”  
- Options: 4 presets for active locale only  
- Helper text: “공개 페이지와 동일한 사이트 글꼴을 사용합니다. 임의 글꼴 URL은 사용할 수 없습니다.”  

### 6.4 Keyboard

| Shortcut | Action |
|---|---|
| Mod+B/I/U | marks |
| Mod+Z / Mod+Shift+Z | undo/redo |
| Mod+S | manual save (optional enhancement) |

---

## 7. Locale typography preset table

Canonical faces come from `src/app/fonts.ts` + `src/app/globals.css` (not stale `docs/typography-spec.md` CDN notes).

### 7.1 Shared role matrix

| Role | bodySize token | lineHeight token | headingWeight default | Intent |
|---|---|---|---|---|
| body-sans | md (1.0625rem) | normal | 600 | Default legal article |
| body-readable | lg (1.125rem) | relaxed | 600 | Long-form comfort |
| display-serif | md | normal | 700 | Serif headings emphasis |
| compact | sm (1rem) | tight | 600 | Dense explanatory posts |

### 7.2 Korean (`ko`)

| presetId | family (CSS) | fallback stack | weight body | size | line-height | heading family |
|---|---|---|---|---|---|---|
| `ko-body-sans` | `var(--font-body)` → Noto Sans KR | Apple SD Gothic Neo, Noto Sans KR, system-ui | 400 | 1.0625rem | 1.75 | `var(--font-heading-ko)` Noto Serif KR |
| `ko-body-readable` | same | same | 400 | 1.125rem | 1.85 | same |
| `ko-display-serif` | body sans; headings serif | Nanum Myeongjo, Georgia | 400 / 700 | 1.0625rem | 1.75 / 1.25 | Noto Serif KR |
| `ko-compact` | sans | same | 400 | 1rem | 1.65 | sans for h2/h3 |

**Default**: `ko-body-sans`

### 7.3 Traditional Chinese (`zh-hant`)

| presetId | family (CSS) | fallback stack | weight body | size | line-height | heading family |
|---|---|---|---|---|---|---|
| `zh-body-sans` | `var(--font-body-zh)` → Noto Sans TC | PingFang TC, Microsoft JhengHei, Noto Sans TC | 400 | 1.0625rem | 1.8 | `var(--font-heading-zh)` Noto Serif TC |
| `zh-body-readable` | same | same | 400 | 1.125rem | 1.9 | same |
| `zh-display-serif` | body sans; headings serif | Songti TC, PMingLiU | 400 / 700 | 1.0625rem | 1.8 / 1.3 | Noto Serif TC |
| `zh-compact` | sans | same | 400 | 1rem | 1.7 | sans |

**Default**: `zh-body-sans`  
**Note**: map locale key `zh-hant` → font language `zh-Hant` for any className helpers.

### 7.4 English (`en`)

| presetId | family (CSS) | fallback stack | weight body | size | line-height | heading family |
|---|---|---|---|---|---|---|
| `en-body-sans` | `var(--font-body)` (KR Noto Latin) | system-ui, Segoe UI, sans-serif | 400 | 1.0625rem | 1.7 | `var(--font-heading-en)` (= KR serif) |
| `en-body-readable` | same | same | 400 | 1.125rem | 1.8 | same |
| `en-display-serif` | body sans; headings serif | Georgia, Times New Roman | 400 / 700 | 1.0625rem | 1.7 / 1.25 | KR serif / Georgia |
| `en-compact` | sans | same | 400 | 1rem | 1.6 | sans |

**Default**: `en-body-sans`  
**Parity**: same four roles as ko/zh; not pixel-identical metrics.

### 7.5 Optional overrides (all locales)

| enum | sm/tight | md/normal | lg/relaxed |
|---|---|---|---|
| bodySize | 1rem | 1.0625rem | 1.125rem |
| lineHeight | 1.6 (en) / 1.65 (ko) / 1.7 (zh) | role default | role default + 0.1 |
| headingWeight | — | 500 / 600 / 700 only (loaded faces) | — |

### 7.6 `ja`
**Not in `locales`.** Out of scope. Future locale requires `locales.ts`, font pair, copy tables, linker keys, and SEO — separate project.

---

## 8. Security / accessibility / performance constraints

### 8.1 Security
- No stored arbitrary CSS.  
- No external font URLs / `@font-face` injection.  
- Sanitize HTML on write; never trust client.  
- Link schemes: `http`, `https`, `mailto` only.  
- Image src host allowlist.  
- Mutations stay behind `guardMutation` / admin auth.  
- Publish remains draft-read → published-write (no partial published body).  

### 8.2 Accessibility
- Toolbar buttons: `aria-pressed`, focus visible.  
- Typography select labeled.  
- Save state textual.  
- Public text contrast unchanged; adjustable size only within rem allowlist.  
- Avoid body H1 duplication guidance in UI help.  

### 8.3 Performance
- No new public `next/font` families.  
- Keep autosave debounce 1000ms + in-flight coordinator.  
- Admin TipTap extensions only on edit routes.  
- Prefer not enabling `rehype-raw` globally.  
- bodyHtml 1MB hard cap retained.  

---

## 9. Tests, commands, acceptance criteria

### 9.1 Test list

| ID | Area | Assertion |
|---|---|---|
| T1 | `column-editor-ops` | Existing 503/429/publish serialization tests still pass |
| T2 | typography schema | valid preset accepted; random `fontFamily` field not in schema; invalid preset rejected/coerced |
| T3 | sanitize-body-html | strips `<script>`, `onerror`, `javascript:` hrefs, `style=` |
| T4 | sanitize allow | keeps simple `<p><strong>`, safe https links, asset images |
| T5 | serialize markdown | underline + existing marks fixtures |
| T6 | mergeFrontmatter | typography patch merges; null clears; body-only patch preserves typography |
| T7 | publish API | published document includes typography from draft |
| T8 | storage normalize | legacy-shaped doc without typography still normalizes when other fields valid |
| T9 | resolver | locale mismatch preset remaps to default |
| T10 | Underline extension | editor config includes Underline (unit or shallow) |
| T11 | public class | helper builds `column-typo--ko-body-readable` from post |
| T12 | Playwright smoke (P0 or P1) | login → edit → set preset → save → publish → public HTML contains class |

### 9.2 Commands

```bash
# unit + type + lint + route guards
npm run qa

# focused
npx vitest run src/components/builder/columns/__tests__/column-editor-ops.test.ts
npx vitest run src/lib/builder/columns
npx vitest run src/app/api/builder/columns

# types
npm run typecheck

# optional browser
npm run test:builder-editor -- --grep column   # if tests exist / added
```

### 9.3 Acceptance criteria (P0)

1. Existing published columns render identically aside from optional default typography class that matches prior visual (Noto stacks already on site).  
2. Selecting a non-default preset, save, publish → public article root includes expected `column-typo--*` and computed font-family references locale Noto token or fallback stack.  
3. PATCH with `<img src=x onerror=alert(1)>` does not persist event handler.  
4. Publish still does not run when draft save returns 503.  
5. Underline toolbar toggles mark (isActive true) with extension registered.  
6. `version` remains `1`; documents without typography still load.  
7. No commit on user dirty tree; work only in isolation branch.  

---

## 10. Rollback / feature flag / deploy order

### 10.1 Rollback
- **Code rollback**: revert PR(s); old clients ignore unknown fields if any were written — actually old code uses zod strict object → **unknown keys stripped by zod default?** Zod object strips unknown by default — old code without typography field in schema **strips typography on next write** if old server deployed over new data.  
- **Mitigation**: once shipped, don’t roll back server without also accepting that typography may be dropped on save by old binary — prefer forward fix.  
- **Emergency flag**: `COLUMN_TYPOGRAPHY_ENABLED=0` hides UI; render resolver still applies safe defaults only (ignore stored preset if flag off) for fastest visual rollback without data loss.

### 10.2 Deploy order
1. Deploy schema-tolerant read + sanitizer + CSS classes (backward compatible).  
2. Deploy editor UI preset control.  
3. Verify production smoke on one ko/zh/en draft each.  
4. Enable any P1 flags later independently.  

### 10.3 Blob/data
- No migration job.  
- No delete of published variants.  

---

## 11. Implementation phases and commit plan

Commits are **proposed** for the implementation phase (not executed in design phase).

### Phase A — Foundations (P0 security + schema)
1. `feat(columns): add typography schema enums and resolver`  
   - `types.ts`, `typography.ts`, unit tests  
2. `feat(columns): sanitize bodyHtml on create/patch`  
   - `sanitize-body-html.ts`, wire routes, tests  
3. `test(columns): extend mergeFrontmatter/API tests for typography`

### Phase B — Editor correctness (P0)
4. `fix(columns): register TipTap Underline and extract markdown serializer`  
5. `feat(columns): typography controls in frontmatter panel + editor body class`  
6. `style(columns): column typography CSS for editor and public`  
7. `fix(columns): honest markdown preview in advanced panel`

### Phase C — Public wiring (P0)
8. `feat(columns): plumb typography preset to public column page`  
9. `test(columns): public class helper + ops regression green`  
10. `chore(columns): copy strings ko/zh-hant/en for typography UI`

### Phase D — Verification
11. Run `npm run qa`; fix fallout commits as needed.  
12. Manual browser checklist (below).  
13. Codex QA pass → only then commit final polish / push with user approval.

### Phase E — P1 follow-ups (separate PR train)
14. tables + TextAlign + renderMode flag  
15. baseRevision CAS  
16. link dialog + locale duplicate  

---

## 12. Manual browser / API QA checklist (Codex + human)

1. Open `/ko/admin-builder/columns` → edit existing → confirm autosave still “saved”.  
2. Inject underline + bold → save → reload editor → marks persist.  
3. Change typography preset → save → publish → open public `/ko/columns/{slug}` → class + font.  
4. Repeat for `zh-hant` and `en` new short drafts.  
5. API: PATCH body with script tag → GET draft → script absent.  
6. Simulate 503 (or unit) → publish aborted.  
7. Two sequential saves with coordinator — no lost title.  
8. Legacy column without blob typography still opens public.  

---

## 13. Risk register

| Risk | Mitigation |
|---|---|
| Public markdown drops some editor-only marks | P0 document-level CSS; P1 HTML mode |
| Zod strip on old servers after rollback | Feature flag; avoid rollback; forward fix |
| Sanitizer too aggressive breaks images | Allowlist asset hosts from existing asset module |
| Frontmatter vs body dual PATCH races | Document single-tab; P1 CAS |
| Bundle bloat from table packages | P1 only; dynamic import |
| Stale typography-spec.md confuses implementers | This plan supersedes for columns; optional doc fix later |

---

## 14. Key decisions (stable)

1. Markdown remains public default source of truth.  
2. Typography is document-level allowlisted presets → CSS classes.  
3. Schema stays version 1 additive.  
4. No external fonts; Noto KR/TC only.  
5. Sanitizer mandatory on write.  
6. Save/publish orchestration from `020ca6c4` is frozen behavior.  
7. `ja` out of scope.  
8. P0 slice only for first ship; P1+ flagged.

---

## 15. Handoff

| Role | Responsibility |
|---|---|
| Grok (implement) | Isolated worktree coding per phases A–C; no push |
| Codex | Final code review, `npm run qa`, browser/API/ops smoke |
| User | Approve plan; authorize push/deploy after Codex |

**Design phase exit criteria**: this file + debate transcript exist with all required sections — **met when both files are on disk**. Implementation must not start until user accepts this plan.

---

*Plan version 2026-07-24. Design-only; no application source modified.*
