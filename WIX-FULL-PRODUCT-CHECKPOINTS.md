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
| F07 | CMS | Collection schema model | Collections can define id, name, fields, permissions, timestamps, and indexes | 🟡 |
| F08 | CMS | Content manager UI | Admin can create, edit, duplicate, delete, search, and sort collection rows | 🟡 |
| F09 | CMS | Typed field coverage | Text, rich text, number, boolean, date, media, reference, tags, URL, email fields render and persist | 🟡 |
| F10 | CMS | Field validation/defaults | Required, unique, default values, min/max, regex, and help text are enforced | 🟡 |
| F11 | CMS | CSV import/export | Collection rows import/export with validation summary and rollback on failure | 🟡 |
| F12 | CMS | Collection permissions | Read/write/admin permissions are enforced for public, member, staff, and admin actors | 🟡 |
| F13 | CMS | Content revisions | Row history, restore, and author/time metadata are available | 🟡 |
| F14 | CMS | Media field integration | CMS media fields reuse the asset library and store alt text/focal metadata | 🟡 |
| F15 | CMS | Search/filter/sort | Content manager supports typed filters, saved views, and stable pagination | 🟢 |
| F16 | CMS | Guarded CMS APIs | Internal APIs validate schema, permissions, and typed payloads | 🟡 |

## M159 Dynamic Content

| ID | Area | Checkpoint | Done when | Status |
| --- | --- | --- | --- | --- |
| F17 | Dynamic | Dataset config | Editor can attach a dataset to a collection with mode, filters, sort, and item limit | 🔴 |
| F18 | Dynamic | Element field binding | Text, image, link, button, gallery, and repeater elements bind to dataset fields | 🔴 |
| F19 | Dynamic | Repeater component | Repeater renders collection rows with template editing and empty/loading states | 🔴 |
| F20 | Dynamic | Dynamic list pages | Admin can create list pages backed by a collection and dataset filters | 🔴 |
| F21 | Dynamic | Dynamic item routing | Item pages resolve by slug/id and render the correct record | 🔴 |
| F22 | Dynamic | URL slug fields | Slug field generation, conflict handling, and redirects work | 🔴 |
| F23 | Dynamic | Per-item SEO | Dynamic pages can generate title, description, canonical, OG image, and schema from fields | 🔴 |
| F24 | Dynamic | Visitor filters/search | Public pages can expose safe search, filters, and sort controls for dataset content | 🔴 |
| F25 | Dynamic | Pagination/load more | Dataset pagination and load-more behavior preserve query state | 🔴 |
| F26 | Dynamic | Preview/publish pipeline | Draft CMS changes preview correctly and publish atomically with page changes | 🔴 |

## M160 Visitor Input To CMS

| ID | Area | Checkpoint | Done when | Status |
| --- | --- | --- | --- | --- |
| F27 | Input | Form-to-collection mapping | Form submissions can write to a selected collection with mapped fields | 🔴 |
| F28 | Input | Input field binding | Text, email, phone, checkbox, radio, select, date, upload, and consent fields bind to CMS fields | 🔴 |
| F29 | Input | Submit validation | Client and server validation return clear field-level errors | 🔴 |
| F30 | Input | Moderation queue | Visitor-created rows can enter pending/approved/rejected states | 🔴 |
| F31 | Input | Spam/rate controls | Honeypot, rate limit, and duplicate submission guards are enforced | 🔴 |
| F32 | Input | Visitor upload fields | Public uploads use asset validation, size limits, scan hooks, and CMS media references | 🔴 |

## M161 App Market Architecture

| ID | Area | Checkpoint | Done when | Status |
| --- | --- | --- | --- | --- |
| F33 | Apps | App manifest schema | Apps declare metadata, permissions, widgets, settings panels, routes, migrations, and translations | 🔴 |
| F34 | Apps | App discovery/catalog | Admin can browse/search/filter local app catalog entries | 🔴 |
| F35 | Apps | Lifecycle controls | Apps install, enable, disable, upgrade, and uninstall without orphaned state | 🔴 |
| F36 | Apps | App settings UI | Installed apps expose settings panels with validation and save/restore behavior | 🔴 |
| F37 | Apps | Widget registration | Apps can register editor widgets/components into the add panel | 🔴 |
| F38 | Apps | Public runtime loader | Published pages load app widgets with scoped data and no global collisions | 🔴 |
| F39 | Apps | App migrations | Versioned app data migrations run and report status | 🔴 |
| F40 | Apps | App permissions/scopes | Apps request and enforce scoped access to CMS, media, checkout, bookings, and members data | 🔴 |
| F41 | Apps | App version model | Installed app version, available update, compatibility, and rollback are tracked | 🔴 |
| F42 | Apps | Uninstall cleanup | App data removal is explicit, reversible when possible, and audited | 🔴 |

## M162 Native App Packs

| ID | Area | Checkpoint | Done when | Status |
| --- | --- | --- | --- | --- |
| F43 | Native apps | Blog data model/admin | Blog posts, authors, categories, tags, drafts, and scheduling exist | 🔴 |
| F44 | Native apps | Blog public widgets | Blog list, post, category, author, recent posts, and search widgets publish correctly | 🔴 |
| F45 | Native apps | Events app | Events admin, RSVP/ticket basics, event pages, and calendar/list widgets exist | 🔴 |
| F46 | Native apps | Members area | Member profile, login gating, account pages, and role-aware navigation exist | 🔴 |
| F47 | Native apps | FAQ app | FAQ categories, public widgets, schema output, and search/filter are app-backed | 🔴 |
| F48 | Native apps | Chat app | Chat inbox/settings widget and public launcher are app-backed | 🔴 |
| F49 | Native apps | Portfolio app | Portfolio projects, galleries, categories, and project detail pages exist | 🔴 |
| F50 | Native apps | Site search app | Indexable content model, search results page, and widget configuration exist | 🔴 |
| F51 | Native apps | App translation hooks | First-party apps participate in the multilingual manager | 🔴 |
| F52 | Native apps | Unified app dashboard | Installed native apps appear in a single manage/update/settings dashboard | 🔴 |

## M163 Stores And eCommerce

| ID | Area | Checkpoint | Done when | Status |
| --- | --- | --- | --- | --- |
| F53 | Stores | Product schema | Products support title, description, media, price, inventory, SKU, SEO, variants, and status | 🔴 |
| F54 | Stores | Product manager | Admin can create, duplicate, bulk edit, import/export, archive, and search products | 🔴 |
| F55 | Stores | Variants/options | Product options, variant prices, inventory, images, and availability render correctly | 🔴 |
| F56 | Stores | Categories/collections | Product categories drive navigation, galleries, and dynamic URLs | 🔴 |
| F57 | Stores | Product gallery widgets | Store galleries support filters, sort, pagination, quick view, and responsive layout | 🔴 |
| F58 | Stores | Product detail page | PDP supports gallery, variants, quantity, availability, related products, and SEO | 🔴 |
| F59 | Stores | Cart | Cart add/update/remove, coupon entry, totals, persisted state, and mini-cart work | 🔴 |
| F60 | Stores | Checkout adapter | Checkout flow supports address, shipping/tax/payment adapter, and order confirmation | 🔴 |
| F61 | Stores | Order creation | Orders persist line items, customer, payment state, fulfillment state, totals, and audit data | 🔴 |
| F62 | Stores | Order admin | Admin can view, search, filter, update fulfillment/payment state, and export orders | 🔴 |
| F63 | Stores | Discounts/coupons | Coupon and automatic discount rules apply safely to cart and checkout | 🔴 |
| F64 | Stores | Tax rules | Tax calculation rules are configurable and visible in checkout/order admin | 🔴 |
| F65 | Stores | Shipping/delivery | Shipping zones, rates, pickup/local delivery, and free shipping rules are supported | 🔴 |
| F66 | Stores | Abandoned cart/notifications | Cart recovery and order notification hooks exist | 🔴 |

## M164 Payments And Business Operations

| ID | Area | Checkpoint | Done when | Status |
| --- | --- | --- | --- | --- |
| F67 | Payments | Provider abstraction | Payment providers expose test-mode intents, captures, failures, and status mapping | 🔴 |
| F68 | Payments | Webhooks | Provider webhook verification, idempotency, and event replay are implemented | 🔴 |
| F69 | Payments | Refunds | Refunds and partial refunds update payment, order, and audit states | 🔴 |
| F70 | Ops | Invoices/receipts | Orders/bookings can generate receipt/invoice data and email/export it | 🔴 |
| F71 | Payments | Manual payments | Offline/manual payment methods are represented consistently | 🔴 |
| F72 | Payments | Multi-currency | Currency formatting, conversion placeholder, and checkout restrictions are explicit | 🔴 |
| F73 | Payments | Security audit | Checkout/payment paths pass permission, CSRF, validation, and logging checks | 🔴 |
| F74 | Ops | Payment analytics | Revenue, conversion, refund, and failed payment summaries are available | 🔴 |

## M165 Bookings Pro

| ID | Area | Checkpoint | Done when | Status |
| --- | --- | --- | --- | --- |
| F75 | Bookings | Resources/rooms | Services can require resources/rooms with availability constraints | 🔴 |
| F76 | Bookings | Packages/memberships | Service packages, session credits, memberships, and redemption rules exist | 🔴 |
| F77 | Bookings | Deposits/varied pricing | Deposits, pay-later, staff/resource-specific pricing, and discounts are supported | 🔴 |
| F78 | Bookings | Staff calendar depth | Staff calendar supports blocked time, overrides, recurring availability, and conflict checks | 🔴 |
| F79 | Bookings | Client portal | Clients can see upcoming/past bookings and account details | 🔴 |
| F80 | Bookings | Cancel/reschedule policy | Policy windows, fees, and self-service reschedule/cancel flows exist | 🔴 |
| F81 | Bookings | Waitlist | Full sessions can accept waitlist entries and promote clients | 🔴 |
| F82 | Bookings | Reminders | Email/SMS-style reminder hooks and admin templates exist | 🔴 |
| F83 | Bookings | Timezone/localization | Booking slots render correctly across site/admin/client timezones and locales | 🔴 |
| F84 | Bookings | Booking analytics | Utilization, no-show, revenue, staff, and service analytics are available | 🔴 |

## M166-M167 AI Builder And Assistants

| ID | Area | Checkpoint | Done when | Status |
| --- | --- | --- | --- | --- |
| F85 | AI | Prompt-to-site intake | AI builder captures business type, goals, pages, brand, tone, and constraints | 🔴 |
| F86 | AI | Generated sitemap/pages | AI can generate a coherent page tree and initial content plan | 🔴 |
| F87 | AI | Layout generation | AI can generate page sections from the design pool with editable nodes | 🔴 |
| F88 | AI | Responsive AI | AI can suggest and apply breakpoint/layout fixes with preview and undo | 🔴 |
| F89 | AI | Style/theme suggestions | AI can propose palette, typography, spacing, and component style changes | 🔴 |
| F90 | AI | Section generator | AI can insert a requested section with copy, assets, and structure | 🔴 |
| F91 | AI | Text assistant | AI can rewrite, expand, shorten, translate, and tone-adjust selected text | 🔴 |
| F92 | AI | Image creator connector | Image generation/import flow can create assets with prompt metadata | 🔴 |
| F93 | AI | Image edit/replace | AI-assisted image replacement respects selected element, alt text, and focal point | 🔴 |
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
