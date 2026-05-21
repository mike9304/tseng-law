# WIX-FULL-PRODUCT-CHECKPOINTS.md

Created: 2026-05-13

Status legend:
- 🔴 not started
- 🟡 in progress / partially verified
- 🟢 automated verification + Codex review passed
- ⚫ blocked / explicitly deferred

Completion gate:
- Full Wix product layer requires 96+ of F01-F120 to be 🟢, unless explicitly waived by the user.
- This is required in addition to the existing W01-W225 visual editor layer.

## M157 Benchmark And Scoring

| ID | Area | Checkpoint | Done when | Status |
| --- | --- | --- | --- | --- |
| F01 | Benchmark | Official Wix source manifest | `WIX-FULL-PRODUCT-GAP.md` lists official Wix/Wix Studio source URLs and date checked | 🟢 |
| F02 | Benchmark | Two-layer completion model | Goal requires both W-layer and F-layer gates | 🟢 |
| F03 | Benchmark | Current product gap inventory | Gap map covers CMS, apps, commerce, bookings, AI, collaboration, dev, multilingual, enterprise/ops | 🟢 |
| F04 | Benchmark | Priority milestone map | `WIX-PARITY-PLAN.md` includes M157-M176 with dependencies | 🟢 |
| F05 | Benchmark | Implementation manual extension | `WIX-PARITY-IMPLEMENT.md` defines M157-M176 | 🟢 |
| F06 | Benchmark | Master prompt gate update | `WIX-PARITY-PROMPT.md` and `CODEX-GOAL-WIX-FULL-BUILDER.md` prohibit completion on W01-W225 alone | 🟢 |

## M158 CMS Foundations

| ID | Area | Checkpoint | Done when | Status |
| --- | --- | --- | --- | --- |
| F07 | CMS | Collection schema model | Collections can define id, name, fields, permissions, timestamps, and indexes | 🟢 |
| F08 | CMS | Content manager UI | Admin can create, edit, duplicate, delete, search, and sort collection rows | 🟢 |
| F09 | CMS | Typed field coverage | Text, rich text, number, boolean, date, media, reference, tags, URL, email fields render and persist | 🟢 |
| F10 | CMS | Field validation/defaults | Required, unique, default values, min/max, regex, and help text are enforced | 🟢 |
| F11 | CMS | CSV import/export | Collection rows import/export with validation summary and rollback on failure | 🟢 |
| F12 | CMS | Collection permissions | Read/write/admin permissions are enforced for public, member, staff, and admin actors | 🟢 |
| F13 | CMS | Content revisions | Row history, restore, and author/time metadata are available | 🟢 |
| F14 | CMS | Media field integration | CMS media fields reuse the asset library and store alt text/focal metadata | 🟢 |
| F15 | CMS | Search/filter/sort | Content manager supports typed filters, saved views, and stable pagination | 🟢 |
| F16 | CMS | Guarded CMS APIs | Internal APIs validate schema, permissions, and typed payloads | 🟢 |

## M159 Dynamic Content

| ID | Area | Checkpoint | Done when | Status |
| --- | --- | --- | --- | --- |
| F17 | Dynamic | Dataset config | Editor can attach a dataset to a collection with mode, filters, sort, and item limit | 🟢 |
| F18 | Dynamic | Element field binding | Text, image, link, button, gallery, and repeater elements bind to dataset fields | 🟡 |
| F19 | Dynamic | Repeater component | Repeater renders collection rows with template editing and empty/loading states | 🟡 |
| F20 | Dynamic | Dynamic list pages | Admin can create list pages backed by a collection and dataset filters | 🟡 |
| F21 | Dynamic | Dynamic item routing | Item pages resolve by slug/id and render the correct record | 🟡 |
| F22 | Dynamic | URL slug fields | Slug field generation, conflict handling, redirect creation, redirect conflict warnings, and CMS record-slug redirects work | 🟡 |
| F23 | Dynamic | Per-item SEO | Dynamic pages can generate title, description, canonical, OG image, and schema from fields | 🟢 Published CMS dynamic item pages (columns/services/lawyers) now override page-template SEO with per-record fields: title, description, canonical (resolved to the absolute record route), OG/Twitter title/description/image, and noIndex are sourced from `findBuilderCollectionRecordSeo(collectionId, locale, recordSlug)` whenever `pageMeta.dynamicItem` and `dynamicItemRecordSlug` resolve. Each page also emits a per-record schema.org payload (`Article` for columns, `LegalService` for service-areas, `Attorney` for attorney-profiles) via `buildBuilderRecordJsonLd` with locale-correct URLs and language metadata. Unit coverage in `cms-record-seo.test.ts` and `record-jsonld.test.ts`; Playwright in `dynamic-item-pages-seo.playwright.ts` creates a CMS dynamic page, publishes it, and verifies two different record slugs return distinct titles/descriptions/canonical URLs plus distinct per-record `Article` JSON-LD. |
| F24 | Dynamic | Visitor filters/search | Public pages can expose safe search, filters, and sort controls for dataset content | 🔴 |
| F25 | Dynamic | Pagination/load more | Dataset pagination and load-more behavior preserve query state | 🟡 First slice on `/[locale]/columns`: `ColumnsGrid` paginates filtered posts into 12-item pages with a "더 보기 / Load more / 載入更多" button that exposes remaining count and resets when a filter chip changes. Playwright in `columns-load-more.playwright.ts` proves the visible count grows after click. URL-state preservation, SSR offset, user-created dynamic list page pagination, and prev/next style navigation remain. |
| F26 | Dynamic | Preview/publish pipeline | Draft CMS changes preview correctly and publish atomically with page changes | 🔴 |

## M160 Visitor Input To CMS

| ID | Area | Checkpoint | Done when | Status |
| --- | --- | --- | --- | --- |
| F27 | Input | Form-to-collection mapping | Form submissions can write to a selected collection with mapped fields | 🟢 |
| F28 | Input | Input field binding | Text, email, phone, checkbox, radio, select, date, upload, and consent fields bind to CMS fields | 🟢 |
| F29 | Input | Submit validation | Client and server validation return clear field-level errors | 🟢 |
| F30 | Input | Moderation queue | Visitor-created rows can enter pending/approved/rejected states | 🟢 |
| F31 | Input | Spam/rate controls | Honeypot, rate limit, and duplicate submission guards are enforced | 🟢 |
| F32 | Input | Visitor upload fields | Public uploads use asset validation, size limits, scan hooks, and CMS media references | 🟢 |

## M161 App Market Architecture

| ID | Area | Checkpoint | Done when | Status |
| --- | --- | --- | --- | --- |
| F33 | Apps | App manifest schema | Apps declare metadata, permissions, widgets, settings panels, routes, migrations, and translations | 🟢 |
| F34 | Apps | App discovery/catalog | Admin can browse/search/filter local app catalog entries | 🟢 |
| F35 | Apps | Lifecycle controls | Apps install, enable, disable, upgrade, and uninstall without orphaned state | 🟢 |
| F36 | Apps | App settings UI | Installed apps expose settings panels with validation and save/restore behavior | 🟢 |
| F37 | Apps | Widget registration | Apps can register editor widgets/components into the add panel | 🟢 |
| F38 | Apps | Public runtime loader | Published pages load app widgets with scoped data and no global collisions | 🟢 |
| F39 | Apps | App migrations | Versioned app data migrations run and report status | 🟢 |
| F40 | Apps | App permissions/scopes | Apps request and enforce scoped access to CMS, media, checkout, bookings, and members data | 🟢 |
| F41 | Apps | App version model | Installed app version, available update, compatibility, and rollback are tracked | 🟢 |
| F42 | Apps | Uninstall cleanup | App data removal is explicit, reversible when possible, and audited | 🟢 |

## M162 Native App Packs

| ID | Area | Checkpoint | Done when | Status |
| --- | --- | --- | --- | --- |
| F43 | Native apps | Blog data model/admin | Blog posts, authors, categories, tags, drafts, and scheduling exist | 🟢 |
| F44 | Native apps | Blog public widgets | Blog list, post, category, author, recent posts, and search widgets publish correctly | 🟢 |
| F45 | Native apps | Events app | Events admin, RSVP/ticket basics, event pages, and calendar/list widgets exist | 🟢 |
| F46 | Native apps | Members area | Member profile, login gating, account pages, and role-aware navigation exist | 🟢 |
| F47 | Native apps | FAQ app | FAQ categories, public widgets, schema output, and search/filter are app-backed | 🟢 |
| F48 | Native apps | Chat app | Chat inbox/settings widget and public launcher are app-backed | 🟢 |
| F49 | Native apps | Portfolio app | Portfolio projects, galleries, categories, and project detail pages exist | 🟢 |
| F50 | Native apps | Site search app | Indexable content model, search results page, and widget configuration exist | 🟢 |
| F51 | Native apps | App translation hooks | First-party apps participate in the multilingual manager | 🟢 |
| F52 | Native apps | Unified app dashboard | Installed native apps appear in a single manage/update/settings dashboard | 🟢 |

## M163 Stores And eCommerce

| ID | Area | Checkpoint | Done when | Status |
| --- | --- | --- | --- | --- |
| F53 | Stores | Product schema | Products support title, description, media, price, inventory, SKU, SEO, variants, and status | 🟢 |
| F54 | Stores | Product manager | Admin can create, duplicate, bulk edit, import/export, archive, and search products | 🟢 |
| F55 | Stores | Variants/options | Product options, variant prices, inventory, images, and availability render correctly | 🟢 |
| F56 | Stores | Categories/collections | Product categories drive navigation, galleries, and dynamic URLs | 🟢 |
| F57 | Stores | Product gallery widgets | Store galleries support filters, sort, pagination, quick view, and responsive layout | 🟢 |
| F58 | Stores | Product detail page | PDP supports gallery, variants, quantity, availability, related products, and SEO | 🟢 |
| F59 | Stores | Cart | Cart add/update/remove, coupon entry, totals, persisted state, and mini-cart work | 🟢 |
| F60 | Stores | Checkout adapter | Checkout flow supports address, shipping/tax/payment adapter, and order confirmation | 🟢 |
| F61 | Stores | Order creation | Orders persist line items, customer, payment state, fulfillment state, totals, and audit data | 🟢 |
| F62 | Stores | Order admin | Admin can view, search, filter, update fulfillment/payment state, and export orders | 🟢 |
| F63 | Stores | Discounts/coupons | Coupon and automatic discount rules apply safely to cart and checkout | 🟢 |
| F64 | Stores | Tax rules | Tax calculation rules are configurable and visible in checkout/order admin | 🟢 |
| F65 | Stores | Shipping/delivery | Shipping zones, rates, pickup/local delivery, and free shipping rules are supported | 🟢 |
| F66 | Stores | Abandoned cart/notifications | Cart recovery and order notification hooks exist | 🟢 |

## M164 Payments And Business Operations

| ID | Area | Checkpoint | Done when | Status |
| --- | --- | --- | --- | --- |
| F67 | Payments | Provider abstraction | Payment providers expose test-mode intents, captures, failures, and status mapping | 🟢 |
| F68 | Payments | Webhooks | Provider webhook verification, idempotency, and event replay are implemented | 🟢 |
| F69 | Payments | Refunds | Refunds and partial refunds update payment, order, and audit states | 🟢 Internal/manual refunds, Stripe refund execution for non-stub provider payments, provider-failure no-mutation guard, booking cancellation Stripe refunds, refund locks, audit, filters, and CSV visibility are verified |
| F70 | Ops | Invoices/receipts | Orders/bookings can generate receipt/invoice data and email/export it | 🟡 PDF/share/list/revoke/tracking, optional automatic issuance policy, auditable order/booking invoice/receipt number reservation ledger with local/file concurrency lock, void/supersede lifecycle, unpaid order/booking invoice payment-link create/renew/revoke lifecycle, Stripe Checkout hosted session creation, SCA-capable redirect flow, and paid webhook settlement into receipt automation added; distributed blob CAS hardening, production provider QA, template depth, bulk, and portal workflows remain |
| F71 | Payments | Manual payments | Offline/manual payment methods are represented consistently | 🟡 Order, booking, and central billing invoice views now have admin-only manual payment records, succeeded/pending/failed/canceled ledger statuses, partial-paid state, balance due tracking, successful-payment overpayment guard, idempotency keys, configurable order/booking offline payment instructions for public pay links and rendered invoices/PDFs, generic status/webhook locks only after successful manual payment entries, invoice balance refresh, stale order/booking pay-link revocation on successful balance movement, persisted stale-link reason/balance metadata, central billing renewal-needed status, per-document payment-link created/renewed/revoked activity history, idempotent customer payment-received outbox events for successful manual and hosted invoice settlements, payment-received workflow toggles for manual/hosted/receipt-overlap behavior, outbox payment summaries, booking hosted-settlement mismatch protection, CSV/search or analytics visibility, and full-payment receipt automation handoff; live email delivery/provider QA and richer branded email body previews remain |
| F72 | Payments | Multi-currency | Currency formatting, conversion placeholder, and checkout restrictions are explicit | 🟡 Checkout now has an explicit single-currency policy notice, raw mixed-currency cart rejection before product normalization, unsupported/disabled-currency validation, billing document/manual-payment currency chips, a guarded commerce currency settings page/API, base/enabled currency matrix, manual preview-rate metadata, checkout conversion-policy disclosure, and public invoice pay-page currency disclosure; actual conversion, provider currency QA, localized currency editing depth, and order/invoice converted amount workflows remain |
| F73 | Payments | Security audit | Checkout/payment paths pass permission, CSRF, validation, and logging checks | 🟡 Public invoice payment links now hide customer/payment details on invalid, expired, or revoked tokens, the payment-intents diagnostic endpoint is behind builder admin auth, CSRF, and mutation rate guards, production billing share/payment token generation now requires an explicit billing/NEXTAUTH secret instead of falling back to admin password or a fixed local secret, billing Stripe webhooks now persist a signed event ledger with duplicate no-op handling plus guarded admin list/replay APIs, central billing Activity now surfaces matched hosted webhook status/history/replay controls, unmatched failed/ignored hosted webhook exceptions appear in a compact central billing review panel, and commerce order DELETE now uses the same mutation guard/CSRF/rate limit path as other destructive commerce routes; broader payment security logging/admin visibility audit remains |
| F74 | Ops | Payment analytics | Revenue, conversion, refund, and failed payment summaries are available | 🟡 Cross-source order/booking payment analytics now has a shared aggregation helper plus `/admin-builder/commerce/payments` cards for net collected, attempts, conversion, failed payments, refunds, by-currency gross/refunded/net/outstanding totals, order-vs-booking source quality, and a compact central Billing analytics strip for collected/balance/refunded/review-needed document scope; deeper trend charts, funnel attribution, exports, provider fee analytics, and alerting remain |

## M165 Bookings Pro

| ID | Area | Checkpoint | Done when | Status |
| --- | --- | --- | --- | --- |
| F75 | Bookings | Resources/rooms | Services can require resources/rooms with availability constraints | 🟡 Resource/room records now exist with admin management, services can require one or more resources, resources can carry one-off blocked times, new bookings snapshot required resources, availability blocks cross-staff overlaps and resource blocked times for required rooms, and same-process resource/date locks reduce double-book races; recurring resource calendars, resource-specific buffers/pricing, richer capacity rules, and provider QA remain |
| F76 | Bookings | Packages/memberships | Service packages, session credits, memberships, and redemption rules exist | 🟡 Session package definitions, customer email credit grants, admin package/credit management, public paid-booking credit bypass, booking credit redemption snapshots, same-process credit locks, and cancel/save-failure credit restoration exist; automatic package purchase, recurring memberships/subscriptions, member-account portal redemption, proration/refunds, shared/team credits, and deeper audit reporting remain |
| F77 | Bookings | Deposits/varied pricing | Deposits, pay-later, staff/resource-specific pricing, and discounts are supported | 🟡 Services can now store an optional fixed deposit amount lower than the full price, public payment-intent creation charges only the due-now deposit while snapshotting total/balance metadata, booking creation verifies the Stripe amount/currency before accepting real intents, successful deposit webhooks mark bookings partially paid with online paid totals, billing/manual-payment balance math subtracts online deposits, and public/admin UI surfaces due-now, total, deposit, and balance amounts; pay-later mode, variable/staff/resource pricing, discounts, deposit-specific refunds, and provider QA remain |
| F78 | Bookings | Staff calendar depth | Staff calendar supports blocked time, overrides, recurring availability, and conflict checks | 🟡 Staff availability already supports weekly availability, one-off blocked dates, holiday calendars, and imported external busy blocks, while required resources now have one-off blocked times that close overlapping booking slots; richer override UI, recurring resource calendars, drag/drop calendar operations, and provider QA remain |
| F79 | Bookings | Client portal | Clients can see upcoming/past bookings and account details | 🟡 Member account now links to a read-only bookings portal, authenticated members can view upcoming/past bookings matched by normalized customer email, and the member bookings API returns safe DTOs without manage tokens, payment intents, manual payment ledgers, or billing documents; self-service account booking actions, portal payment/documents, richer profile linkage, and full member booking history workflows remain |
| F80 | Bookings | Cancel/reschedule policy | Policy windows, fees, and self-service reschedule/cancel flows exist | 🟡 Service cancellation policy IDs now drive refund decisions and customer self-service cancel/reschedule windows; signed manage links show policy/refund status, disable blocked actions, and both manage PATCH plus direct cancel API enforce the same policy before refund, credit restore, email, or webhook side effects; custom fee rules, richer admin policy authoring, member-portal actions, payment/document flows, and provider QA remain |
| F81 | Bookings | Waitlist | Full sessions can accept waitlist entries and promote clients | 🟡 Service capacity/remaining seats now suppress full group slots and expose waitlist entry when no capacity remains; promotion workflow exists from prior waitlist work, but broader full-session operations remain |
| F82 | Bookings | Reminders | Email/SMS-style reminder hooks and admin templates exist | 🟡 Email/SMS reminder windows now share service-specific schedule settings with admin 24h/1h/off controls; provider delivery QA and deeper per-channel policy remain |
| F83 | Bookings | Timezone/localization | Booking slots render correctly across site/admin/client timezones and locales | 🟡 Availability now converts staff local date/time through validated IANA timezones instead of a Seoul/Taipei offset shortcut, slot availability checks use the staff local date across UTC boundaries, public booking/manage/member/email surfaces format customer-facing times with explicit saved customer timezone, and long timezone labels have safer mobile wrapping; admin reschedule inputs, office/customer dual-time summaries in every admin view, Zoom timezone handoff, and broader locale copy remain |
| F84 | Bookings | Booking analytics | Utilization, no-show, revenue, staff, and service analytics are available | 🟡 Dashboard analytics existed and now has a Today/Needs Action operations queue for pending, unpaid, waitlist, no-show, and document-needed work; deeper utilization and export reporting remain |

## M166-M167 AI Builder And Assistants

| ID | Area | Checkpoint | Done when | Status |
| --- | --- | --- | --- | --- |
| F85 | AI | Prompt-to-site intake | AI builder captures business type, goals, pages, brand, tone, and constraints | 🟡 Expanded intake now captures industry, company, slogan, audience, goals, desired pages, brand keywords, constraints, visual direction, optional uploaded hero image asset, tone, and color preference with mobile-safe admin UI; recent prompt/draft history can save and restore the last 6 local generated drafts. Server-side prompt versioning, diff/compare, branches, and multi-user history remain |
| F86 | AI | Generated sitemap/pages | AI can generate a coherent page tree and initial content plan | 🟡 Draft now returns a deterministic sitemap, content plan, and brand brief preview before apply, and sitemap scope can create selected non-conflicting non-home draft pages from that page tree with optional Navigation insertion for actually-created pages only. Public runtime hides unpublished pageId-backed nav items, so draft menu entries do not leak before publish. Page-tree diff/reorder and publish controls remain |
| F87 | AI | Layout generation | AI can generate page sections from the design pool with editable nodes | 🟡 Existing apply route generates editable canvas sections from the draft with inline slug entry or selected sitemap-scope creation, invalid/reserved/duplicate slug guards, optional created-page Navigation insertion, draft-only creation, canvas-write rollback, no prompt dialog, UI draft discard, and initial SEO metadata seed; generated drafts now save as schema-valid canvas documents with container-based visible hero/proof/brand visual/content card/CTA primitives, a real hero media image frame, selected uploaded hero asset override, visual brief/prompt/treatment preview, first mobile overrides, mobile content CTA no-overlap placement, mobile-stacked hero proof cards, sitemap starter page cards, and first-slice design-pool template metadata/classes for services/faq/insights/offices. AI generated root sections can also be saved into Saved Sections and reinserted into the builder while preserving metadata/classes/mobile overrides. Remaining gaps: page-tree diff/reorder and publish controls; curated design-pool pixel matching; actual external AI image generation/import workflows; richer responsive AI breakpoint fixes with preview/undo; style suggestions; deeper section generator controls; server-side prompt versioning; broader review/diff transaction UX; F88-F94 assistants |
| F88 | AI | Responsive AI | AI can suggest and apply breakpoint/layout fixes with preview and undo | 🔴 |
| F89 | AI | Style/theme suggestions | AI can propose palette, typography, spacing, and component style changes | 🔴 |
| F90 | AI | Section generator | AI can insert a requested section with copy, assets, and structure | 🔴 |
| F91 | AI | Text assistant | AI can rewrite, expand, shorten, translate, and tone-adjust selected text | 🟡 Inline text editor now exposes an AI button that opens an action panel with rewrite/expand/shorten/translate/tone choices, custom prompt guidance, source vs result preview, and an undo/redo result history backed by `/api/builder/ai-generator/text` (guardMutation, gpt-4o-mini, schema-validated input, translate requires `targetLocale`, tone requires `tone`); unit coverage for the prompt builder and route happy/error paths, plus Playwright that mocks the endpoint, applies a rewrite to the canvas, and verifies translation forwards `targetLocale`. Deeper inline selection scoping, streaming responses, prompt versioning, undo-after-apply, and shared prompt history across collaborators remain. |
| F92 | AI | Image creator connector | Image generation/import flow can create assets with prompt metadata | 🟢 `/api/builder/ai-generator/image` calls Image 2.0 (`gpt-image-2`), validates returned bytes via shared image-upload validation, persists the result into the builder asset store via `uploadBuilderImageAsset`, and audits the upload. Generated hero image nodes retain visual direction, Image 2.0-ready generation prompt metadata, alt text, focal point, and deterministic filter treatment. The AI generator wizard intake step exposes prompt/size/quality/format options and can reuse uploaded hero assets. |
| F93 | AI | Image edit/replace | AI-assisted image replacement respects selected element, alt text, and focal point | 🟢 ImageEditDialog AI tab calls `/api/builder/ai-generator/image/edit` (Image 2.0 v1/images/edits, gpt-image-2) with preset mask areas, freeform brush mask drawing, Add/Erase modes, brush size/feather/edge controls, undo-last-stroke, original-vs-result review, generated edit selection history, before/after transaction review, and apply that swaps only `content.src` while preserving alt text, focal point, crop aspect, and filter state on the selected image node. |
| F94 | AI | Code assistant | Developer-facing assistant can explain/build code slots with reviewable diffs | 🔴 |

## M168-M169 Collaboration And Workflow

| ID | Area | Checkpoint | Done when | Status |
| --- | --- | --- | --- | --- |
| F95 | Collaboration | Presence/cursors | Multiple editors show active users, selected nodes, and cursor/location state | 🔴 |
| F96 | Collaboration | Conflict handling | Concurrent edits resolve deterministically with user-visible conflict feedback | 🔴 |
| F97 | Collaboration | Canvas comments | Comments can be attached to pages/elements/regions | 🔴 |
| F98 | Collaboration | Resolve/assign comments | Comments support assign, reply, resolve, reopen, and filter states | 🔴 |
| F99 | Collaboration | Roles/permissions | Owner/admin/designer/editor/client roles gate editor/admin actions | 🔴 |
| F100 | Collaboration | Client review mode | Clients can review/comment without full editor permissions | 🔴 |
| F101 | Workflow | Branches/variants | Site changes can be isolated in branches/variants and compared | 🔴 |
| F102 | Workflow | Approval workflow | Publish can require approval for selected roles/sites | 🔴 |
| F103 | Workflow | Audit log | Security, publish, app, CMS, commerce, and role changes are logged | 🔴 |
| F104 | Workflow | Notifications | Comment, approval, order, booking, app, and publish notifications have a shared model | 🔴 |

## M170 Developer Platform

| ID | Area | Checkpoint | Done when | Status |
| --- | --- | --- | --- | --- |
| F105 | Dev | Custom code slots | Page/site head/body/custom element code slots exist with validation and preview warnings | 🔴 |
| F106 | Dev | Serverless functions | Backend function route model, environment, and local execution harness exist | 🔴 |
| F107 | Dev | API/SDK surface | Internal SDK docs/types cover pages, CMS, media, apps, bookings, commerce, and publish | 🔴 |
| F108 | Dev | Data APIs | CMS and app data APIs support typed query/mutation with permissions | 🔴 |
| F109 | Dev | App extension hooks | Apps can hook editor, public runtime, checkout, bookings, and CMS lifecycle events | 🔴 |
| F110 | Dev | Logs/console | Admin can inspect function/app/webhook logs and errors | 🔴 |
| F111 | Dev | Local dev/deploy validation | Custom code/app functions pass typecheck, lint, smoke, and publish validation | 🔴 |
| F112 | Dev | Secrets manager | Site secrets can be stored, scoped, rotated, and referenced by server code | 🔴 |

## M171-M174 Cross-Cutting Milestones

M171-M174 are represented across the F-layer checkpoints above plus existing W-layer SEO/publish/admin gates. Do not mark those milestones complete unless their dependent F-items are green and a dedicated milestone memo links the relevant implementation/test evidence.

## M172 Multilingual

| ID | Area | Checkpoint | Done when | Status |
| --- | --- | --- | --- | --- |
| F113 | Multilingual | Translation manager dashboard | Admin sees language status across pages, CMS rows, app content, SEO, and media | 🔴 |
| F114 | Multilingual | Manual translations | Editors can edit per-language text/content without overwriting source language | 🔴 |
| F115 | Multilingual | Auto-translation adapter | Translation adapter can propose changes with review/apply/rollback behavior | 🔴 |
| F116 | Multilingual | Per-language menu/slug | Menus and slugs are configurable by language with redirects/canonical handling | 🔴 |
| F117 | Multilingual | Per-language SEO | SEO title, description, OG, structured data, and sitemap output vary by language | 🔴 |
| F118 | Multilingual | Per-language media/assets | Media replacement and alt text can vary by language | 🔴 |
| F119 | Multilingual | Translation status warnings | Publish warns on missing/stale translations and broken language routes | 🔴 |
| F120 | Multilingual | App translation compatibility | First-party/native apps expose translatable strings and content to the manager | 🔴 |
