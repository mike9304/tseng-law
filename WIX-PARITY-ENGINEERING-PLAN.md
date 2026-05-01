# Wix Parity Engineering Plan

> Date: 2026-04-30  
> Scope: Ho-jeong builder to Wix-class editor/platform parity  
> Basis: `WIX-PARITY-ROADMAP.md`, current code review, and 10-role agent analysis waves

## 0. Executive Decision

Wix cannot be recreated in one pass because it is not one feature. It is a product stack:

1. editor core: canvas, selection, responsive editing, layers, undo/redo, preview
2. content tools: rich text, links, media crop, forms, menus, page management
3. design system: site styles, tokens, variants, typography, brand kit, dark mode
4. templates: page templates, section templates, full-site templates, generated previews
5. runtime: published renderer, mobile behavior, animations, lightboxes, global header/footer
6. platform: persistence, revisions, publish transaction, permissions, multi-site, assets
7. apps: blog, CMS, forms, bookings, CRM, analytics, search, email, members, stores

The correct strategy is not "one huge Wix prompt". It is a company-style program with strict ownership, small PRs, and gates. Feature work should pause whenever core persistence, responsive editing, or published/runtime parity is broken.

## 1. Agent Capacity Reality

Requested model setup: 10 senior agents, `gpt-5.5`, `xhigh`.

Actual session result:

- 10 simultaneous agents are not available in this session.
- The collaboration runtime returned `agent thread limit reached (max 6)`.
- Existing open agents also count against that limit.
- Practical operating model: 10 roles, maximum 6 active at once, run in waves.

Recommended waves:

- Wave A: Architecture, Editor UX, Responsive, Content Editing, QA/Security, Design System
- Wave B: Templates/Sections, Animations, SEO/CMS/Multilingual, Assets/Media
- Wave C: Business Apps, Platform/Multi-site, Performance, Release hardening as needed

## 2. Current Scorecard

These scores are not praise scores. They are implementation-readiness scores against Wix-level expectations.

| Area | Score | Reason |
|---|---:|---|
| Canvas/editor shell | 6.4/10 | Freeform canvas, selection, layers, shortcuts exist; responsive and snap are not Wix-grade |
| Design system | 7.0/10 | B3/B6/B7 are implemented; tokens/variants/dark mode need product hardening |
| Templates/page gallery | 6.8/10 | 170 page templates exist; full-site templates and real previews missing |
| Section library | 5.8/10 | Saved sections exist; built-in sections/global sections/sanitization missing |
| Animations | 5.8/10 | C1 entrance/scroll/hover works; click/target/timeline/loop/Lottie missing |
| Content editing | 4.5/10 | Button links partially work; rich text links are not persisted |
| Responsive editing | 4.0/10 | Schema exists; drag/resize can still mutate base desktop rect |
| Platform/publish/revisions | 4.0/10 | Publish gate/revisions exist; transactions/CAS/site id consistency missing |
| Apps/CMS/business | 3.5/10 | Forms/blog/bookings pieces exist; not Wix app ecosystem yet |
| QA/security/release | 3.0/10 | Basic auth and lint/build exist; no serious test harness or role/audit model |

Overall: internal Wix-like MVP, not Wix-class platform.

## 3. Ten Engineering Roles

### 1. Architecture Lead

Owns site model, persistence, publish, revision, and multi-site direction.

First small PRs:

- unify canonical site id; stop mixing `default` and `tseng-law-main-site`
- add revision/CAS to current `/api/builder/site/pages/[pageId]/draft`
- remove public-route seed/write side effects from published page requests
- make publish fail if revision recording fails
- add explicit migration/seed command instead of read-path mutation

### 2. Canvas Editor Lead

Owns drag, resize, selection, snap, keyboard workflows, and editor shell behavior.

First small PRs:

- make tablet/mobile drag/resize write responsive overrides, not desktop base rect
- add Esc cancel for active drag/resize/rotate mutation
- wire real grid snap setting into `computeSnap`
- add resize snap and multi-selection snap
- complete layer row action menu: rename, duplicate, delete, front/back, group

### 3. Responsive Runtime Lead

Owns editor-preview/published parity across desktop/tablet/mobile.

First small PRs:

- extract one shared `resolveViewportNodeStyle` used by editor and published runtime
- extend responsive override beyond `rect/hidden/fontSize` to layout-critical style
- reduce generic mobile fallback that force-stacks all nodes
- include global header/footer/lightbox in responsive resolver
- add screenshot smoke for desktop/tablet/mobile published pages

### 4. Content Editing Lead

Owns text, links, media editing, menus, and forms editor UX.

First small PRs:

- add `html` or TipTap JSON persistence to text/heading content
- preserve selected text links and inline formatting after blur/save
- introduce shared `LinkValue`: url/page/anchor/email/phone/document/lightbox
- extend link toolbar beyond buttons to text, image, container
- turn navigation editor into tree editor that preserves `children` and `pageId`

### 5. Media/Asset Lead

Owns asset library, upload consistency, image editing, optimization.

First small PRs:

- align client upload validation with server validation
- add focal point, crop region, zoom, rotate, and flip to image content
- add image click action/link via shared `LinkValue`
- move asset library to folders/tags/search/sort
- migrate published images toward optimized responsive image rendering

### 6. Design System Lead

Owns tokens, variants, brand kit, typography, dark mode.

First small PRs:

- show whether colors/fonts are theme-linked or detached raw overrides
- connect `CARD_VARIANTS` and `FORM_INPUT_VARIANTS` to actual inspectors/renderers
- add button icon layout and state controls: hover/active/focus/disabled/error
- make brand kit logo use asset library rather than raw URL only
- make dark mode site-configurable and prevent initial theme flicker

### 7. Templates/Sections Lead

Owns page templates, section templates, saved sections, thumbnails, full-site templates.

First small PRs:

- add automated registry count check for 170 templates
- normalize saved section root coordinates before insert
- sanitize saved section SVG thumbnail before rendering
- add built-in section templates and wireframe section category
- add full-site template model: pages, navigation, theme, assets, SEO defaults

### 8. Animations/Interactions Lead

Owns entrance/scroll/hover, target interactions, preview parity, timeline future.

First small PRs:

- merge B6 hover style and C1 hover transform into one CSS-variable pipeline
- do not register scroll listener when no scroll animation nodes exist
- add animation attrs to global header/footer/lightbox renderers
- add click interaction schema
- add trigger-target interaction model: hover/click on A animates B

### 9. SEO/CMS/Multilingual Lead

Owns blog, generic CMS, translation sync, SEO maturity.

First small PRs:

- make translation sync run on normal draft autosave, not only translation manager
- integrate builder pages into sitemap generation
- add slug-change redirect creation and validation
- add generic CMS collection schema and item CRUD foundation
- add repeater binding MVP for dynamic collection rendering

### 10. QA/Security/Release Lead

Owns test harness, auth, rate limits, audit, production safety.

First small PRs:

- add scripts: `typecheck`, `smoke:builder`, `test:unit`
- add Playwright smoke for `/ko/admin-builder`: add, drag, resize, save, publish check
- apply `guardMutation` consistently to builder mutation routes
- protect admin asset listing or explicitly scope it
- add audit events for save, publish, rollback, asset upload, booking/form changes

## 4. Execution Order

### Phase 0: Stop Data Loss and Runtime Drift

Do first, before more visible Wix features.

- canonical site id
- draft save CAS/revision
- publish transaction and revision fail-closed
- public route no longer writes seed data
- basic smoke tests and `typecheck` script

Exit gate:

- two browser tabs editing same page cannot silently overwrite each other
- publish either fully succeeds with revision or fails cleanly
- public page GET does not mutate builder storage
- `npm run lint` and `npx tsc --noEmit --incremental false` pass

### Phase 1: Editor Trust

Make editing behavior predictable.

- viewport-aware drag/resize
- Esc cancel
- real grid snap
- resize/multiselect snap
- layer rename/action menu
- draft preview button

Exit gate:

- moving an element in mobile does not change desktop layout
- undo/redo works after drag/resize/snap
- layer actions do not corrupt parent/child or z-index

### Phase 2: Content Manipulation

Make user-facing editing feel Wix-like.

- rich text persistence
- text links
- shared link picker
- image crop/focal point/link
- navigation tree editor
- visual form field manager

Exit gate:

- selected text link survives save/reload/publish
- button/image/container links use the same picker
- nested navigation renders on desktop and mobile

### Phase 3: Design System Productization

Turn the design system from a token skeleton into a product tool.

- detached/theme-linked indicators
- card/form variants in real components
- button state controls and icon layout
- brand kit asset integration
- dark mode config, preview, no flicker
- typography responsive scale

Exit gate:

- theme changes visibly propagate only to linked values
- detached overrides are visible and reversible
- dark mode behaves the same in editor preview and published runtime

### Phase 4: Templates and Sections

Move from page starters to Wix-like creation flow.

- real thumbnail capture pipeline
- built-in section templates
- saved section management page
- full-site template installer
- automatic navigation/SEO defaults on template install

Exit gate:

- user can start from a full law-site package, not one page at a time
- created pages have sane title, slug, nav, SEO defaults
- saved sections insert at predictable coordinates

### Phase 5: CMS, Blog, Multilingual, SEO

Build content operations.

- generic CMS collections
- repeater widget
- dynamic item pages
- blog manager maturity
- translation sync on save
- sitemap/robots/redirect/hreflang checks

Exit gate:

- CMS collection can drive a repeater and a dynamic page
- translated content status updates when source changes
- SEO publish gate catches broken links, missing meta, hreflang issues

### Phase 6: Business Apps

Add Wix-like revenue/operations apps only after the editor is stable.

- Bookings: services, staff, availability, booking widget, slot locking, email
- Forms Plus: file upload, captcha strict mode, visual field builder
- CRM: contacts from form/booking submissions
- Analytics: page views, submissions, bookings, top pages
- Search: site search widget and search page

Exit gate:

- a visitor can book a consultation, submit a form with files, and appear in CRM
- admin can review submissions/bookings without editing JSON

### Phase 7: Platform Parity

This is Wix-as-platform, not just Wix-like editor.

- users, roles, permissions, audit log
- workspace/site model
- tenant-partitioned assets/forms/bookings/revisions
- custom domain flow
- backup/site versions
- app-market or extension boundary
- custom code/Velo-like sandbox only after security model exists

## 5. Immediate Next Sprint

Do not start with Bookings or AI features. Start with trust.

Sprint A:

- A1: canonical site id and no public write path
- A2: draft save revision/CAS
- A3: publish transaction/revision fail-closed
- A4: `typecheck` script and builder smoke command
- A5: viewport-aware drag/resize for tablet/mobile

Sprint B:

- B1: rich text `html`/TipTap JSON persistence
- B2: shared `LinkValue` and LinkPicker
- B3: text/button/image link persistence tests
- B4: grid/resize/multiselect snap
- B5: layer row actions

Sprint C:

- C1: image crop/focal point/link model
- C2: navigation tree editor
- C3: form visual field manager MVP
- C4: saved section coordinate normalization and SVG sanitizer
- C5: dark mode site setting and no-flicker boot script

## 6. Why One Prompt Fails

A single prompt tries to change too many contracts at once:

- schema
- editor state
- persistence
- published runtime
- mobile behavior
- tests
- migrations
- UI
- security

When these are changed together, the common failure mode is exactly what has already appeared: a feature looks present, but save/publish/runtime parity is incomplete. Examples from current code review:

- rich text editor exists, but HTML/link formatting is discarded on save
- responsive schema exists, but canvas drag/resize can still mutate desktop base rect
- templates exist, but full-site template install is missing
- animations exist, but global/lightbox surfaces do not share the same runtime coverage
- publish gate/revisions exist, but publish is not transactionally robust

The working method is small PRs with one contract per PR.

## 7. Operating Rules for Agents

- One agent owns one track and one write area.
- Explorers do read-only evidence; workers make bounded patches.
- No two agents edit `CanvasContainer.tsx`, `store.ts`, or `public-page.tsx` at the same time.
- Every patch must include one verification path: typecheck, lint, unit, smoke, or browser route.
- Feature PRs must state editor behavior, storage behavior, and published runtime behavior.
- If editor and published behavior diverge, that is a blocker, not a follow-up.

## 8. Current 3000 Status

Local dev server is expected to run on:

```text
http://localhost:3000
```

Current verified route:

```text
/ko/admin-builder -> 200 OK
```

Recent recovery work:

- stopped stale project dev servers occupying port 3000/3001
- added missing `src/lib/builder/components/blogFeed/BlogFeed.module.css`
- `npx tsc --noEmit --incremental false` passed
- `npm run lint` passed with existing `no-img-element` warnings

