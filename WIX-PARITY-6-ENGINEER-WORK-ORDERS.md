# Wix Parity 6-Engineer Work Orders

> Date: 2026-04-30  
> Purpose: Six-engineer execution plan to turn the current builder into a Wix-class editor/platform.  
> Rule: Do not let multiple engineers edit the same high-risk files at the same time.

## Global Rules

- Work in small PRs. One PR should change one contract.
- Do not revert unrelated dirty work in the repo.
- Run at minimum: `npm run lint` and `npx tsc --noEmit --incremental false`.
- Add `npm run typecheck` as soon as Engineer 4 lands QA scripts.
- Treat editor behavior, persistence behavior, and published runtime behavior as one contract.
- If editor and published output diverge, stop and fix parity before adding more features.

High-risk shared files:

- `src/components/builder/canvas/CanvasContainer.tsx`
- `src/lib/builder/canvas/store.ts`
- `src/lib/builder/site/persistence.ts`
- `src/lib/builder/site/publish.ts`
- `src/lib/builder/site/public-page.tsx`
- `src/lib/builder/canvas/types.ts`

Only one engineer should edit each high-risk file in a given PR window.

## Engineer 1: Core Architecture / Persistence

Mission: stop silent data loss and make publish reliable.

### PR A1: Canonical Site ID + Public Read Purity

Goal:

- Stop mixing `default` and `tseng-law-main-site`.
- Public GET/metadata must not write builder data.

Files:

- `src/lib/builder/constants.ts`
- `src/lib/builder/site/identity.ts` new
- `src/lib/builder/site/types.ts`
- `src/lib/builder/site/persistence.ts`
- `src/lib/builder/canvas/seed-pages.ts`
- `src/app/[locale]/[[...slug]]/page.tsx`
- `src/lib/builder/site/public-page.tsx`
- `src/lib/builder/seo/redirects-edge.ts`
- `src/app/api/builder/site/seed/route.ts` new

Detailed instructions:

- Keep `DEFAULT_BUILDER_SITE_ID = 'tseng-law-main-site'`.
- Add `LEGACY_BUILDER_SITE_ID = 'default'`.
- Add `normalizeBuilderSiteId(input)`:
  - null/empty/`default` -> canonical id
  - canonical id -> canonical id
- Change `createDefaultSiteDocument(locale, siteId)` so new docs never default to `default`.
- Remove read-side write from `readSiteDocument()`.
- Add `ensureSiteDocument()` for admin/seed only.
- Remove `seedSitePages()` calls from public metadata/page render.
- Add guarded `POST /api/builder/site/seed`.
- Replace hard-coded `builder-site/default` paths.

Verification:

```bash
rg -n "seedSitePages\\(|builder-site/default|readSiteDocument\\('default'|writePageCanvas\\('default'|publishPage\\('default'|siteId: 'default'" src
npm run lint
npx tsc --noEmit --incremental false
```

### PR A2: Draft Save Revision / CAS

Goal:

- Two tabs must not silently overwrite one another.

Files:

- `src/lib/builder/site/persistence.ts`
- `src/app/api/builder/site/pages/[pageId]/draft/route.ts`
- `src/components/builder/canvas/SandboxPage.tsx`
- `src/components/builder/canvas/PublishModal.tsx`
- `src/components/builder/canvas/VersionHistoryPanel.tsx`

Detailed instructions:

- Do not put revision inside `BuilderCanvasDocument`.
- Add storage envelope:
  - `PageCanvasRecord`
  - `revision`
  - `savedAt`
  - `updatedBy`
  - `document`
- Read legacy raw canvas docs as `revision: 0`.
- `GET /draft` returns `{ draft: { revision, savedAt, updatedBy }, document }`.
- `PUT /draft` requires `expectedRevision` once draft exists.
- Return:
  - `200` on success
  - `409 draft_conflict` on stale write
  - `428 precondition_required` if caller omits expected revision
- `SandboxPage` must store `draftMeta`.
- On conflict: stop autosave, show conflict state, do not retry blind.

Verification:

- Send two PUTs with same expected revision; first returns `200`, second returns `409`.
- Reload editor after save; revision advances by one.

### PR A3: Publish Transaction / Revision Fail-Closed

Goal:

- Publish cannot succeed if revision recording fails.
- Public page should point to immutable published revision.

Files:

- `src/lib/builder/site/types.ts`
- `src/lib/builder/site/publish.ts`
- `src/lib/builder/site/persistence.ts`
- `src/lib/builder/site/public-page.tsx`
- `src/app/api/builder/site/pages/[pageId]/publish/route.ts`

Detailed instructions:

- Add page meta fields:
  - `publishedRevisionId`
  - `publishedRevision`
  - `publishedSavedAt`
  - `lastPublishedDraftRevision`
- Make `recordRevision()` throw on failure.
- Publish order:
  1. read draft record
  2. verify expected draft revision
  3. run publish checks
  4. write immutable revision
  5. update site page meta pointer
  6. write site document
  7. only then return success
- `published.json` can remain legacy/cache fallback, not source of truth.

Verification:

- Blocker -> `422`, no publish.
- Stale draft -> `409`, no publish.
- Revision write failure -> `500`, no publish success response.

## Engineer 2: Responsive Canvas / Editor Trust

Mission: mobile/tablet editing must not damage desktop layout.

### PR B1: Responsive Geometry Foundation

Files:

- `src/lib/builder/canvas/tree.ts`
- `src/lib/builder/canvas/store.ts`
- `src/lib/builder/canvas/responsive.ts`

Detailed instructions:

- Add `resolveCanvasNodeAbsoluteRectForViewport(node, nodesById, viewport)`.
- Add `cancelMutationSession()`.
- Add `updateNodeRectsForViewport(rectsById, viewport, mode)`.
- Desktop writes `node.rect`.
- Tablet/mobile writes `responsive.<viewport>.rect`.
- Canvas direct manipulation should save a full resolved local rect, not a partial override.

### PR B2: Canvas Pointer Drag/Resize Uses Viewport Rects

Files:

- `src/components/builder/canvas/CanvasContainer.tsx`
- `src/components/builder/canvas/SandboxPage.tsx`
- `src/components/builder/global/GlobalCanvasEditor.tsx`
- `src/components/builder/lightbox/LightboxEditor.tsx`

Detailed instructions:

- Interaction start stores active viewport.
- Hit-test, selection bbox, snap, clamp, drag ghost use viewport absolute rect.
- Tablet/mobile drag/resize updates responsive override, not base rect.
- Non-desktop drag into container is blocked in this PR.
- Autosave must pause while `mutationBaseDocument` exists.

### PR B3: Esc Cancel

Files:

- `src/components/builder/canvas/CanvasContainer.tsx`
- `src/components/builder/canvas/CanvasNode.tsx`
- `src/lib/builder/canvas/store.ts`
- `src/lib/builder/canvas/shortcuts.ts`

Detailed instructions:

- During drag/resize/rotate, `Esc` consumes event.
- Restore `mutationBaseDocument`.
- Clear interaction, guides, hover state.
- Do not fall through to deselect.

Manual verification:

1. Record desktop X/Y/W/H.
2. Switch mobile, drag node.
3. Return desktop; desktop rect unchanged.
4. Drag in mobile, press `Esc`; no override remains.
5. Commit mobile drag, undo/redo; desktop still unchanged.

## Engineer 3: Rich Text / Links / Content Editing

Mission: Wix-like content editing must persist after save/reload/publish.

### PR C1: Rich Text Schema and Renderer

Files:

- `src/lib/builder/canvas/types.ts`
- `src/lib/builder/components/text/index.ts`
- `src/lib/builder/components/heading/index.ts`
- `src/lib/builder/rich-text/types.ts` new
- `src/lib/builder/rich-text/sanitize.ts` new
- `src/lib/builder/rich-text/render.tsx` new

Decision:

- Store TipTap JSON as canonical.
- Keep `content.text` as plain-text fallback/search/translation field.
- Do not make raw HTML canonical.

New content field:

```ts
richText?: {
  format: 'tiptap-json';
  doc: unknown;
  plainText: string;
  html?: string;
}
```

Rules:

- `text` always mirrors `richText.plainText`.
- Legacy text-only nodes lazy-migrate to paragraph doc.
- Heading nodes should allow inline marks/link but not arbitrary block trees.

### PR C2: Inline Editor Persistence

Files:

- `src/components/builder/canvas/InlineTextEditor.tsx`
- `src/components/builder/canvas/CanvasNode.tsx`
- `src/components/builder/canvas/elements/TextElement.tsx`
- `src/lib/builder/components/heading/Element.tsx`

Detailed instructions:

- Change `onSave(html, plainText)` to `onSave({ richText, plainText })`.
- Stop discarding HTML/marks/links on blur.
- Render TipTap JSON with React elements, not `dangerouslySetInnerHTML`.
- Existing inspector textarea can either regenerate plain paragraph richText or clearly mark that plain edit clears formatting.

### PR C3: Shared LinkValue / LinkPicker

Files:

- `src/lib/builder/links.ts` new
- `src/components/builder/editor/LinkPicker.tsx` new
- button/image/container inspectors and renderers
- `SelectionToolbar.tsx`
- `CanvasContainer.tsx`
- `publish-gate/checks.ts`
- `a11y-checker.ts`
- `translations/sync.ts`

LinkValue:

```ts
{
  href: string;
  target?: '_self' | '_blank';
  rel?: string;
  title?: string;
  ariaLabel?: string;
}
```

Allow:

- `/...`
- `#anchor`
- `lightbox:slug`
- `https://`
- `http://`
- `mailto:`
- `tel:`

Block:

- `javascript:`
- `data:`
- `vbscript:`
- protocol-relative `//...`
- control characters

Verification:

- Text bold/underline/link survives save/reload/publish.
- Button/image/container use same picker.
- `javascript:alert(1)` is blocked.

## Engineer 4: QA / Security / Release

Mission: add gates so Wix work stops regressing.

### PR D1: Scripts and Test Harness

Files:

- `package.json`
- `vitest.config.ts` new
- `scripts/assert-builder-route-guards.mjs` new
- `scripts/smoke-builder-api.mjs` new

Add scripts:

```json
{
  "typecheck": "tsc -p tsconfig.json --noEmit --incremental false",
  "test:unit": "vitest run",
  "security:builder-routes": "node scripts/assert-builder-route-guards.mjs",
  "smoke:builder": "node scripts/smoke-builder-api.mjs",
  "qa": "npm run typecheck && npm run lint && npm run test:unit && npm run security:builder-routes"
}
```

Use `vitest` first. Add Playwright only after API smoke is stable.

### PR D2: Guard Coverage

Files:

- `src/lib/builder/security/guard.ts`
- `src/app/api/builder/columns/route.ts`
- `src/app/api/builder/columns/[slug]/route.ts`
- `src/app/api/builder/sandbox/draft/route.ts`
- `src/app/api/builder/assets/route.ts`

Detailed instructions:

- Add `guardBuilderRead()` for authenticated admin GET.
- Extend `guardMutation(request, { bucket })`.
- Buckets: `mutation`, `publish`, `asset`.
- Ensure all builder `POST|PUT|PATCH|DELETE` routes use `guardMutation`.
- Asset list is admin-only.
- Asset byte route can remain public-by-reference.

### PR D3: Audit Foundation

Files:

- `src/lib/builder/audit/types.ts` new
- `src/lib/builder/audit/store.ts` new
- `src/lib/builder/audit/record.ts` new

Events:

- asset upload/delete
- publish success/blocked/failure
- page rollback
- column create/update/delete/publish

Do not store raw request body, credentials, uploaded bytes, full webhook URLs, or sensitive form values.

Release gates:

- `npm run typecheck`
- `npm run lint`
- `npm run test:unit`
- `npm run security:builder-routes`
- dev server on `3000`, then `npm run smoke:builder`

## Engineer 5: Design System / Media

Mission: turn existing B3/B6/B7 implementation into product-grade design tooling.

### PR E1: Theme Linked/Detached Indicators

Files:

- `src/lib/builder/site/theme.ts`
- `src/lib/builder/site/theme-bindings.ts` new
- `ColorPicker.tsx`
- `ThemeTextPresetPicker.tsx`
- `StyleTab.tsx`
- `BackgroundEditor.tsx`
- text/heading inspectors

Detailed instructions:

- Token color object -> show "theme linked".
- Raw string color -> show "detached".
- `themePreset` present -> typography linked.
- Manual font/size/color override -> detached.
- Button variant plus manual style override -> "variant + custom override".
- Avoid schema changes for this PR; derive status from existing values.

### PR E2: Card/Form Variants

Files:

- `src/lib/builder/site/component-variants.ts`
- `src/lib/builder/canvas/types.ts`
- container/card-like/form component folders

Detailed instructions:

- Wire `CARD_VARIANTS` into container/card renderers and inspectors.
- Wire `FORM_INPUT_VARIANTS` into form input/select/textarea/date/file.
- Add defaults so `updateNodeContent` does not drop new keys.
- Preserve legacy `cardStyle` and form submit styles via adapter.

### PR E3: Brand Kit Assets and Dark Mode

Files:

- `src/lib/builder/site/theme.ts`
- `src/lib/builder/site/types.ts`
- `BrandKitPanel.tsx`
- `SiteSettingsModal.tsx`
- `brand-kit` and `settings` API routes
- `public-page.tsx`
- `DarkModeToggle.tsx`

Detailed instructions:

- Let brand kit pick logo/favicon/OG image from asset library.
- Preserve raw URL compatibility.
- Add `darkMode: { defaultMode, allowVisitorToggle }`.
- Add early inline script before CSS paint to set `data-theme`.
- Toggle reads current `document.documentElement.dataset.theme` on mount.
- If `allowVisitorToggle` is false, do not render toggle.

### PR E4: Media Validation / Crop / Focal Point

Files:

- `src/lib/builder/assets.ts`
- `src/lib/builder/canvas/upload-validation.ts`
- `src/app/api/builder/assets/route.ts`
- `src/lib/builder/canvas/types.ts`
- `src/lib/builder/canvas/crop.ts`
- image inspector/element/crop modal/asset library

Detailed instructions:

- Align client validation with server policy.
- Server policy currently: 8MB and jpeg/png/webp/gif/avif.
- Add magic-byte sniffing.
- Add image content fields:
  - `crop`
  - `focalPoint`
  - legacy `cropAspect`
- Publish gate checks missing alt, missing asset, locale mismatch, unsupported MIME, oversize.

## Engineer 6: Templates / Sections / Animations Runtime

Mission: make creation assets reliable and published animations consistent.

### PR F1: Template Registry Tests

Files:

- `package.json`
- `vitest.config.ts`
- `src/lib/builder/templates/__tests__/registry.test.ts`

Detailed instructions:

- `getAllTemplates()` returns 170.
- 17 active categories.
- 10 per category.
- No duplicate template IDs.
- Disk exports match registry.
- Every template document parses with `builderCanvasDocumentSchema`.
- Validate node ID uniqueness and parent references.

Coordinate with Engineer 4 on test setup.

### PR F2: Saved Section Normalization / SVG Safety

Files:

- `src/lib/builder/sections/normalize.ts` new
- `src/lib/builder/sections/thumbnail.ts` new
- `src/lib/builder/sections/insertSection.ts`
- `SaveSectionModal.tsx`
- `SavedSectionsPanel.tsx`
- section-library API routes

Detailed instructions:

- `normalizeSavedSectionSnapshot(nodes, rootNodeId)` stores root at `x:0, y:0`.
- Descendants keep parent-local coordinates.
- Insert root exactly at drop offset or cascade offset.
- Server regenerates thumbnail from normalized nodes.
- Do not trust client-provided raw SVG.
- Sanitize or reject `<script>`, event handlers, external hrefs.

### PR F3: Built-in Section Templates

Files:

- `src/lib/builder/sections/templates.ts` new
- `src/components/builder/sections/BuiltInSectionsPanel.tsx` new
- `src/components/builder/sections/SectionTemplateCard.tsx` optional
- `SandboxCatalogPanel.tsx`

Detailed instructions:

- Add at least 12 normalized section templates.
- Categories: hero, features, testimonials, CTA, footer, legal.
- Reuse same clone/id-remap path as saved sections.
- Place "Section templates" above "Saved sections" in Add panel.

### PR F4: Animation Runtime Coverage / Scroll Optimization

Files:

- `src/lib/builder/site/public-page.tsx`
- `src/components/builder/published/AnimationsRoot.tsx`
- `src/components/builder/published/LightboxOverlay.tsx`
- `src/lib/builder/site/published-node-frame.ts` optional

Detailed instructions:

- Extract common animation attr/style helper.
- Apply to page, global header/footer, and lightbox nodes.
- Use `data-builder-anim-node="true"` instead of relying only on `.builder-pub-node`.
- Add MutationObserver or refresh event so opened lightbox nodes are observed.
- Do not register scroll/resize listener when no scroll animation nodes exist.
- Respect `prefers-reduced-motion: reduce`.

## Execution Order

Do not start all six write tracks at once.

Recommended order:

1. Engineer 4 PR D1: scripts/test harness.
2. Engineer 1 PR A1: canonical site id and no public write path.
3. Engineer 4 PR D2: guard coverage.
4. Engineer 1 PR A2: draft CAS.
5. Engineer 2 PR B1/B2/B3: responsive canvas trust.
6. Engineer 3 PR C1/C2/C3: rich text and links.
7. Engineer 1 PR A3: publish fail-closed.
8. Engineer 6 PR F1/F2: template/section safety tests.
9. Engineer 5 PR E1/E2/E3/E4: design/media hardening.
10. Engineer 6 PR F3/F4: built-in sections and animation runtime coverage.

Reason:

- QA scripts first make every later PR safer.
- Site id/read purity must land before CAS/publish.
- Responsive editing should land before adding more visual components.
- Rich text/link persistence should land before translation/CMS work.

## Current Local Server

Expected dev URL:

```text
http://localhost:3000
```

Known verified route:

```text
/ko/admin-builder -> 200 OK
```

