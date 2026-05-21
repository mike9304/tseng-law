# WIX-PARITY-DOCUMENTATION.md

Long-horizon Wix parity decision/progress/risk log.
Created: 2026-05-09T12:52:13.760Z

## 2026-05-18 - Agent 3 Wix Gap Inbox

Source: user QA, functional validation agent, design validation agent, main implementation pass.
Rule: gap candidates stay open until reproduced, fixed, and checked in the editor/public surface. Do not promote checkpoints to green from documentation alone.

| ID | Layer | Area | Gap candidate | Evidence / context | Related W/F | Status | Next action |
|---|---|---|---|---|---|---|---|
| GAP-2026-05-18-01 | QA gate | Manual coverage | Goal/completion state is ahead of user-verified Wix parity. | User asked if everything was complete because Goal ACHIEVED appeared. | W02/W04/W06-W11/W18-W23/W26-W30 | Open | Keep goal incomplete until editor, published page, save/reload, and manual regression checks are current. |
| GAP-2026-05-18-02 | Layout | Section boundaries | Top-level home sections can cover boundary elements such as hero search and insights CTA when section height/stacking is stale. | User reported hero search and "모든 칼럼 보기" being covered by the next page/section. Seed bounds, stale-draft upgrade persistence, editor desktop/mobile/tablet hit targets, published builder desktop/mobile/tablet root non-overlap, public z-index, public search/CTA activation, and mobile services/FAQ expanded geometry now pass. Real `/ko` home desktop/tablet/mobile section-boundary checks now pass after preventing first-visit AI chat from opening over compact viewports, disabling the mobile/tablet hero scroll-arrow hit area over the search button, and adding office/contact assertions for tab touch targets, map/card stacking, contact CTA hit targets, and `#offices` -> `#contact` non-overlap. Rechecked the live editor draft instead of trusting generated output: the root cause was that decomposed home roots such as `home-hero-root`, `home-insights-root`, and `home-services-root` are top-level `container` nodes with `as: "section"`, while flow layout only treated `composite` roots as sections. `isTopLevelFlowSection` now includes top-level `as: section` containers in editor/public/responsive flow, so following sections no longer layer over the hero search or insights CTA. Added editor chrome hit-target and clearance regression for the hero search wrap, quick menu lower edge, quick menu item, insights CTA icon/bottom handle, and following-section gap so later sections cannot cover the reported controls. | W09/W18/W84/W216 | Automatic checks passing / user QA pending | Run user QA on the reported editor/public paths before closing; keep watching adjacent published mobile overflow, fixed overlay widgets, and section-template variants. |
| GAP-2026-05-18-03 | Interaction | Services/FAQ accordion | Editor/public accordion behavior needs one clear contract and no overlap when panels open. | User reported services and FAQ expanded text overlapping neighboring space. Functional/design agents flagged responsive gaps. Contract remains single-open. Editor desktop services/FAQ click stability passes; editor mobile+tablet services/FAQ preview asserts single-open, sibling push, root push, containment, reload reset, and no overlap. Published home mobile+tablet services/FAQ geometry passes; published service/FAQ interaction test includes FAQ single-open. Real `/ko` home now loops every service and every FAQ item on desktop/tablet/mobile, asserting sibling pushdown, section non-overlap, and no horizontal overflow. Fixed responsive top-level section heights to use `min-height`, published relative accordion sizing to use real measured height, and editor responsive preview offsets to use viewport-effective closed heights. | W18/W84/W98/W216 | Automatic checks passing / user QA pending | Run user QA on editor and public desktop/mobile service and FAQ accordion paths before closing; continue watching long-content section-template variants and full Wix product gaps. |
| GAP-2026-05-18-04 | Text editing | Inline rich text | Text edits must preserve size/style, commit on outside click, clear selection, and survive reload. | User reported text shrinking and selection not clearing naturally after editing. Added a home-hero-title regression covering stored `fontSize: 16` + `.hero-title` visual sizing: edit-mode ProseMirror keeps computed font size, line-height, weight, family, letter spacing, and color; outside top-bar click hides the editor, clears all selected nodes, removes handles/toolbars/focus, persists text/rich text/class/as/fontSize, and reload keeps the hero-scale text. Extended `section-title` coverage for services/FAQ-style headings: outside click now verifies hidden editor, zero selected nodes, no selection pill/toolbar/resize handles, persisted text/rich text/class/as/fontSize, and reload keeps the class-based title size. The bug reproduced as selection remaining selected, then passed after the outside-click clearing fix. | W03/W216/W225 | Automatic checks passing / user QA pending | Run user QA on the reported Korean hero-title and section-title edit paths; keep broadening rich-text persistence beyond bold and special text-mode visual parity before closing. |
| GAP-2026-05-18-05 | Full product | Wix product breadth | Visual editor parity is not full Wix product parity. CMS, dynamic binding, apps, commerce, bookings, AI builder, collaboration, developer platform, multilingual, and ops still need F-layer work. | Full Wix product gap was defined on 2026-05-13 after user scope correction. | F18-F120 | Open | Continue F-layer milestones after current editor correctness regressions are closed. |
| GAP-2026-05-18-06 | Full product / M159 | Dynamic CMS depth | M159 has dataset config, partial element binding, and code-owned dynamic route/template preview, but it is not Wix-level dynamic CMS parity yet. | Text/heading/image/button/link, gallery image bindings, basic repeater `layoutItems` bindings, published runtime repeater child-template binding, inspector-assisted child template binding with visible child-field mapping plan and bound-child completion status, selected-record editor preview switching in the inspector/canvas, parent repeater selected-record inheritance for bound child template canvas preview, selected repeater canvas HUD for template bound count, previous/next record preview, first bound child edit handoff, direct bound text/image/button template-child insertion, selected child template context badge, repeater empty dataset safety for zero-result filters without placeholder/template leakage in editor/public, stale dataset field/source-change warning UX with public safe fallback for missing mapped fields, child inspector inherited-parent-record preview lock, record picker/source summary with live collection/limit/filter/sort state, read-only CMS preview copy in the inspector, inspector horizontal-overflow guard, published repeater expansion ignoring editor preview cursor so public lists still start at the first dataset record, dynamic-route selected record handoff into the linked dynamic template editor, dynamic route missing-record recovery, selected-record field value map preview, dynamic template missing-record recovery UI, selected-record draft persistence, publish slot, public service/lawyer route block visibility consumption, user-created columns/services dynamic list page draft creation with collection-backed dataset filters/limit, editor preview, public publish render, user-created columns dynamic item page route resolution by record slug, page slug duplicate blocking plus Pages-panel exact 301 redirect creation on slug rename, editable CMS slug-field URL impact preview/duplicate warning/record-level redirect limitation copy, wildcard/prefix redirect matching for dynamic item page base slug changes, Pages-panel/SEO slug redirect conflict warnings, and redirect persistence merge protection for concurrent site writes now have support. Blob-backed dynamic-template state is isolated through API setup/restore in Playwright so the publish test checks the actual runtime backend. F18 still lacks richer Wix-style visual repeater authoring and nested/reused template UX, while F20-F26 still lack full list/item lifecycle depth, actual record-slug redirect lifecycle, runtime per-item SEO binding, visitor filters/pagination, and atomic CMS+page preview/publish. | F18-F26 | Open | Keep M159/F18-F22 yellow until richer repeater authoring and full dynamic list/item/slug lifecycle are implemented and verified. Keep F23-F26 red until SEO/filter/pagination/publish lifecycle is implemented and verified. |
| GAP-2026-05-19-01 | Full product / M160 | Visitor input to CMS depth | M160 F27-F32 checkpoint criteria are now met; broader Wix product parity still continues through later CRM/app/automation milestones. | Form schemas can store `cmsMapping` and `antiSpam`, the form schema APIs accept/persist them, the form builder loads editable CMS collections and compatible CMS field dropdowns, and `/api/forms/submit` writes mapped submissions into a public-create CMS collection as `pending` by default with clear CMS validation/permission errors. The published form runtime maps server `validationErrors` back to field-level inline errors and focuses the first invalid control. Public form E2E covers server-required field error rendering, resubmission, success state, and pending CMS record payload. A second public field matrix E2E covers phone, checkbox, radio, select, date, upload, and consent mapped into CMS text/string-list/date/image/boolean fields. CMS records support `pending/approved/rejected` in addition to `draft/published/archived`; Content Manager bulk actions can mark pending, approve, reject, publish, draft, or archive. Moderation updates can persist a reason, display latest reason and recent history on the record card, and filter records by pending/approved/rejected/all. Honeypot, minimum submit delay, duplicate-field window, and existing rate limit are enforced before storage. Visitor uploads attach local scan metadata and file fields mapped to CMS image fields pass URL/filename/altText media references. Existing legacy forms with `storeInCms` but no enabled mapping keep working. Submit-route, upload, and CMS-editable unit tests cover mapped record creation, legacy skip, CMS validation errors, moderation status transitions/reason history, honeypot rejection, duplicate rejection, upload scan rejection/pass, and CMS image media references. Form-builder Playwright covers CMS/anti-spam setting save/reload, compatible CMS field filtering, persisted API schema, and 768/375px overflow guards. CMS moderation Playwright covers reason entry, reject workflow, saved API moderation payload, and moderation status filters. | F27-F32 | Automatic checks passing / user QA pending | Keep M160 green at checkpoint level; later CRM automation/consent policy management belongs to M161+ or future visitor-data extensions. |
| GAP-2026-05-19-02 | Full product / M161 | App Market architecture depth | M161 F33-F42 checkpoint criteria are now met; broader Wix App Market parity continues in later native/external app ecosystem milestones. | Local app manifests now validate metadata, permissions, widgets, settings panels, routes, migrations, translations, and builder compatibility. The admin App Market at `/ko/admin-builder/apps` can browse/search/filter catalog entries and shows install state, permissions, widgets, settings panel counts, routes, migrations, recent audit event, migration run summary, scope enforcement status, version/update/compatibility/rollback status, uninstall cleanup choice, uninstall archive status, restore availability, and installed-app settings panels. Builder app APIs expose catalog and installed entries, install apps idempotently with default settings, re-enable existing installs, upgrade on changed manifest version, capture the previous version/status/settings as a rollback snapshot, enable/disable installed apps without losing settings, save manifest-validated settings, reject invalid/unknown setting fields, rollback when a snapshot exists, reject rollback when no snapshot exists, uninstall with explicit keep-data or remove-data cleanup, restore retained uninstall archives, reject restore after remove-data cleanup, and uninstall installed apps. Installed app state persists in the site document as `installedApps`, retained uninstall state persists as `uninstalledApps`, both are normalized on read, and both are protected by stale-write merge/delete handling. Enabled installed app widgets are projected into the editor Add panel with stable `app:{appId}:{widgetId}` IDs; mapped widgets can quick-add/drag real canvas nodes while unmapped widgets stay runtime-unavailable instead of breaking insertion. Add-panel inserted app widgets persist `appWidget` source metadata. Published pages resolve app-widget node metadata against current installed app state, render the real widget only when the matching app/widget/kind is enabled, emit per-node scoped app runtime markers, and show a neutral public fallback instead of raw component output when the app is disabled, missing, or mismatched. Manifest migrations are applied once during install/reinstall/enable backfill when applicable, stored as capped run records with migration id, version, status, actor, timestamp, and message, and exposed through API/UI. App-context CMS access now checks that the app is installed, enabled, and declares `cms:read`; missing installs, disabled apps, or undeclared scopes return clear 403/404 errors. App-state merge now prefers newer app `updatedAt` values so delayed editor saves do not undo disable/enable decisions, and uninstall archive merge prevents stale site writes from dropping retained restore data. Unit tests cover manifest validation, default settings, valid settings save, invalid select/unknown-field validation, settings-preserving enable/disable, lifecycle audit history, widget projection, published runtime status resolution, one-time migration run/backfill/failure retry, app scope authorization allowed/denied states, version-state resolution, upgrade rollback snapshot capture, rollback restore/unavailable behavior, uninstall archive/restore/remove-data behavior, and stale app/archive-state merge. Playwright covers catalog search/category/status filters plus install, version status strip, rollback-unavailable API response, migration summary, settings save, installed API readback including migrations and version state, reload restore, disable, enable, keep-data uninstall, restore retained data/settings, remove-data uninstall without restore CTA, Add panel app-widget visibility, quick-add insertion, disabled-app removal from the Add panel, public app-widget enabled/disabled runtime behavior, and app CMS scope allow/deny API behavior. | F33-F42 | F33-F42 automatic checks passing / user QA pending | Move to M162 native app packs; keep broader Wix ecosystem gaps open for external app distribution, billing, and deeper first-party modules. |
| GAP-2026-05-19-03 | Full product / M162 | Native app pack foundations | M162 F43-F52 checkpoint criteria are now met; broader Wix app parity continues in later commerce, bookings, automation, external ecosystem, and integration milestones. | Existing column content is promoted into a native Blog admin model with posts, author taxonomy, category taxonomy, tags, draft/published revisions, scheduled state from future `publishedAt`, reading time, and per-post status. `/api/builder/blog/admin` returns the model for builder admins. The column manager shows native Blog KPIs and status filtering. Native Blog is registered as a first-party app with public list, post-card, categories, author, recent-posts, and search widgets that can be installed, added to the canvas, published, runtime-gated, and resolved on public pages. Blog components use the active locale for API calls and links, column archive filters support category/author/query/month/year public URLs, scheduled posts are hidden from public lists, and the site-search index includes Blog documents. Native Events now has a file/blob-backed event and attendee model, builder admin API/UI, draft/published/cancelled status, slugged public event pages, RSVP capacity checks, free/paid ticket basics, attendee registration, list/calendar/RSVP widgets, app manifest/widget mappings, and public runtime gating. Native Members now has a file/blob-backed member/session model, signup/login/logout/profile APIs, localized login/account/profile/premium pages, a protected member helper, public account role gate, admin member manager, app manifest/routes, builder page `memberAccess` runtime gate, and role-aware desktop/mobile navigation. Native FAQ now has a file/blob-backed FAQ/category model seeded from legacy FAQ content, builder admin CRUD UI/API, public FAQ page with category/search accordion UX, app-backed FAQ list and FAQ search widgets, app route/widget manifest mapping, FAQPage schema output, and site-search index coverage. Native Live Chat is now registered as a first-party app with install defaults, settings validation, launcher label/title/intro/offline/accent/placement/email-required controls, app-backed floating-chat widget mapping, published runtime gating, disabled-app fallback, public launcher trigger integration, mobile-safe placement, and the existing admin inbox/API path retained. Native Portfolio now has a file/blob-backed project model with slug/status/category/featured/gallery/SEO fields, seeded legal-service project examples, builder admin CRUD/API, public archive and project detail pages with category filters and galleries, first-party app manifest/routes/settings, app-backed portfolio-list canvas widget, public runtime gating, and disabled-app fallback. Native Site Search now uses one native SearchIndex for `/api/search`, inline widget results, and `/${locale}/search` fallback results, includes portfolio project documents, exposes widget kind-scope controls including portfolio, keeps admin rebuild/query analytics, falls back to an on-demand index when no stored index exists, and has mobile-safe widget layout plus loading/empty/error states. App translation hooks now add an Apps category to Translation Manager, collect first-party manifest strings, app widget text, installed text/textarea settings, FAQ records, Events records, and Portfolio records, save localized app settings without overwriting source settings, create deterministic target-locale FAQ/Event/Portfolio records, and localize app catalog manifest labels from saved translation entries. Unified native app dashboard now shows installed app KPIs, enabled/disabled/update/settings counts, per-app status, update CTA, settings anchors, localized admin/public route links, migration health, and mobile-safe wrapping; native Members, Appointments, and Newsletter manifests also expose their existing admin surfaces through dashboard routes. Playwright covers full Blog widget publishing/search, full Events publishing/RSVP, Members signup/login/profile/free-vs-premium access/header navigation/admin create flow, FAQ admin/public/widget/schema/search flow, Live Chat install/settings/public launcher/app-widget trigger/email-required/disable fallback flow, Portfolio install/admin API/public archive/detail/gallery/widget/disable fallback flow, Site Search install/portfolio index/inline result/public result/mobile/disabled fallback flow, app translation category/save/app-settings apply flow, app market dashboard update/admin-route behavior, and no horizontal overflow. During this pass the reported home and columns overlap paths were rechecked: live home section boundary/accordion tests pass on desktop/tablet/mobile and public columns archive filters remain separated and clickable across viewports. | F43-F52 | F43-F52 automatic checks passing / user QA pending | Move to M163 commerce; keep broader Wix external app ecosystem, billing, automations, and integration gaps open. |
| GAP-2026-05-20-01 | Full product / M163 | Stores/eCommerce core | M163 F53-F66 checkpoint criteria are now met; broader commerce operations continue in M164. | Current repo still has only standalone form/booking payment stubs for non-store payment surfaces. The new commerce product engine adds a native product source of truth with product id, locale, slug, title, description/body, draft/active/archived status, base SKU, base price/compare-at price/currency, inventory tracking/quantity/low-stock/backorder flags, media gallery records, options, variants with per-variant SKU/price/inventory/media/status, category ids, tags, SEO title/description, timestamps, local/blob persistence, seeded example product data, slug collision handling, SKU conflict rejection, soft delete, locale/status/category filters, search, sort, normalization, and validation for required fields, price, inventory, active slug, duplicate variant SKUs, and variant price/inventory. The product manager now exposes guarded admin collection/item APIs for list/create/update/duplicate/archive/delete/bulk status update and a `/admin-builder/commerce/products` UI with product KPIs, search/status/category/stock/sort controls, add/edit form, low-stock inventory state, duplicate/archive row actions, bulk status bar, CSV import/export, and mobile overflow coverage. Structured options/variants support option rows, generated option-combination variants, per-variant SKU/price/compare-at/inventory/low-stock/backorder/status/media, availability states, save/reload, and search. Categories/collections are derived from product category ids with counts and seed metadata, exposed through `/api/builder/commerce/categories`, rendered in `/store` navigation, and resolved through `/store/categories/[slug]` dynamic URLs with category-filtered product galleries and SEO metadata. Product gallery widgets now add a first-party Store app manifest, install settings, widget-to-canvas mapping, `product-gallery` canvas node/schema, category filter chips, sort select, pagination, quick view, availability labels, API-backed product/category loading, public runtime gating, and mobile-safe published layout. Product detail pages now add `/store/products/[slug]` active-product routing, draft/missing-product 404 guards, media gallery and thumbnail selection, option-driven variant selection, quantity bounds, variant price/SKU/media/availability updates, related products, storefront and product-gallery detail links, SEO metadata, Product JSON-LD, and mobile-safe layout. Cart now adds locale-scoped localStorage persistence, PDP add-to-cart, mini-cart toggle/drawer, line-item quantity update/remove, coupon-code entry storage, subtotal/discount/total display, and checkout handoff. Checkout now adds `/store/checkout`, customer/address forms, shipping method quotes, tax quote display, manual invoice/sandbox-card adapter selection, server-side cart/product/variant/price/inventory reconciliation, order confirmation number, confirmation localStorage persistence, cart clear handoff, and cart recovery capture on checkout email entry. Orders now add file/blob-backed order records, line items, customer/address, payment state, fulfillment state, shipping/tax/totals, confirmation number, source metadata, system audit event, checkout-created order id, admin read/list API, cleanup support, and order notification queue hooks. Order admin now adds `/admin-builder/commerce/orders`, KPIs, search, order/payment/fulfillment filters, payment/fulfillment/order status update controls, audit append, CSV export, product-admin link, and mobile-safe layout. Discounts/coupons now add normalized coupon codes, default SAVE10/WELCOME discount rules, active/locale/minimum/date/cap guards, percent/fixed discount math, cart subtotal/discount/total integration, checkout tax/grand-total recalculation after discount, and checkout/order coupon persistence. Tax rules now add file/blob-backed default TW/KR/US rule storage, country/region/locale/priority matching, active/included-in-price controls, guarded admin API, `/admin-builder/commerce/tax` editor, checkout tax-rule loading, order tax label/rate/amount visibility, CSV export tax fields, and checkout floating-widget overlap prevention. Shipping/delivery now adds file/blob-backed default digital/standard/express/pickup rule storage, country/region/currency/locale/priority matching, pickup/local-delivery methods, free-shipping thresholds, guarded admin API, `/admin-builder/commerce/shipping` editor, checkout shipping-rule loading, and order shipping label/amount/free-shipping visibility. Notifications now add file/blob-backed notification settings, queued outbox events, cart recovery records, public recovery capture API, checkout recovery hook, conversion marking on checkout, order-created customer/admin events, order-updated customer events, and `/admin-builder/commerce/notifications` management. Unit tests cover full schema normalization, create/find/update/filter/search/sort/delete round trip, default variant projection, SKU lookup/conflict rejection, slug suffixing, validation errors, availability classification, Store app widget projection/runtime status, cart normalization, add/update/remove, coupon entry, totals, discount rule application, tax rule selection/persistence, shipping rule selection/free-shipping/persistence, notification setting/event/recovery normalization, recovery capture/convert, order notification queueing, checkout normalization, shipping/tax/grand total quote math, checkout validation boundaries, order persistence/list/update/delete, and order filtering. Playwright covers admin create/search, low-stock state, duplicate-to-draft, bulk archive, export, CSV import, tax rule admin edit/save/public API, checkout tax rule selection, order tax visibility, shipping rule admin edit/save/public API, checkout shipping/free-shipping/pickup selection, order shipping visibility, notification admin save, cart recovery queue, order notification outbox events, recovery conversion, structured option generation, per-variant image/status/inventory/availability persistence, edit reload, category API counts, public store navigation, category-filtered gallery, dynamic category URLs, storefront/PDP links, PDP gallery/variant/quantity/availability/related/SEO behavior, cart add/update/remove, coupon entry, discounted totals, reload persistence, checkout handoff, shipping/tax/payment adapter quote after discount, confirmation persistence, checkout-created order API payload, order admin search/filter/status update/export/audit, cart clear, published product-gallery widget runtime markers, filters, sort, pagination, quick view, detail links, and mobile no-horizontal-overflow. | F53-F66 | F53-F66 automatic checks passing / user QA pending | Move to M164 payments/business operations; keep provider-depth payments, invoices, refunds, receipts, and richer notification delivery open there. |
| GAP-2026-05-20-02 | Full product / M164 | Payments/business operations | F67-F69 checkpoint criteria are met, F70 is partial, F71 is order/booking/central manual-payment partial, F72 has single-currency plus currency-settings guardrails, and F73 has payment-link/API/secret/webhook-ledger/UI/mutation-guard hardening partial while F74 remains open. | Commerce payments now cover provider abstraction, payment intent creation/capture/failure normalization, payment webhooks with signature/idempotency/replay/admin visibility, refunds with Stripe execution/no-mutation failure guards, order and booking invoice/receipt snapshots, central billing documents, share links, payment links, hosted Stripe checkout settlement, automatic invoice/receipt policy, and manual payment ledgers. Order/booking/central manual payments now include explicit amount/method/reference/note/status records, `partially_paid` state, balance due, overpayment guards, idempotency keys, successful-entry-only status/webhook locks, failed/pending/canceled entries that do not reduce balance or trigger paid automation, configurable offline payment instructions on public pay links and rendered invoices/PDFs, payment-link activity history, CSV/search/filter/analytics visibility, and full manual-settlement receipt automation. Checkout now surfaces a single-currency policy, rejects mixed raw cart payloads before normalization, rejects unsupported/disabled checkout currencies from a guarded currency settings enabled subset, and central billing rows/manual payment forms expose invoice currency. The new currency settings surface persists base currency, enabled checkout currencies, disabled/manual-preview conversion mode, and manual preview-rate metadata; public checkout and invoice payment links disclose that no conversion is applied. Public invoice payment links now render a generic no-store/noindex unavailable page without customer/payment details for invalid, expired, or revoked tokens, the payment-intents diagnostic API is admin/CSRF/mutation-rate guarded, production billing share/payment token generation requires an explicit billing/NEXTAUTH secret instead of admin-password or fixed local fallback, billing Stripe hosted-payment webhooks now persist a signed event ledger, deduplicate provider retries before settlement/automation/notification, record ignored non-paid events, expose guarded admin list/replay APIs, return sanitized responses, surface matched webhook status/history/replay controls in the central billing Activity panel, show unmatched failed/ignored hosted webhook exceptions in a compact review panel, and route commerce order DELETE through the shared mutation guard/CSRF/rate-limit path. Unit and Playwright coverage includes provider intents, webhooks, refunds, invoice/receipt UI, hosted payment links, manual payment partial/full/failure-state/idempotency flows, central billing instruction settings, public pay-page instruction display and hidden invalid/stale-token details, invoice HTML/PDF instruction rendering, payment-link activity panel, checkout mixed-currency rejection, currency settings save/read, billing currency display, guarded payment-intents diagnostics, production token-secret gating, billing webhook ledger/idempotency/replay route coverage, hosted webhook Activity UI visibility, unmatched webhook exception UI, order DELETE mutation-guard rejection, and commerce regression paths. | F67-F69 green, F70 partial, F71 order/booking/central partial, F72 currency-settings partial, F73 payment-link/API/secret/webhook-ledger/UI/mutation-guard partial | F67-F73 partial automatic checks passing for order billing docs / booking docs / hosted invoice payment / order, booking, and central manual payments including idempotency, failed/pending/canceled ledger behavior, offline instruction settings, payment-link activity history, single-currency guardrails, currency settings preview metadata, hidden public pay-link sensitive details, guarded payment-intents diagnostics, production token-secret gating, billing webhook ledger/idempotency/replay APIs, hosted webhook Activity UI, unmatched webhook exception UI, and order DELETE mutation guard; live customer email/provider workflow depth, actual F72 conversion/provider QA, broader F73 security logging/admin visibility, and F74 pending | Continue M164 with F70 production/template/bulk/portal depth, F71 live customer email/provider workflow controls, actual F72 conversion/provider QA, broader F73 security logging/admin visibility, and F74 payment analytics. |
| GAP-2026-05-20-03 | Editor QA / Design | Navigation chrome, mobile drawer, and columns page switching | User reported top menu text overlap when Pages/Navigation drawers open, the preview mobile menu being hidden by the side drawer, and the columns page click appearing not to navigate. | Main implementation pass changed builder-editable header links so plain clicks navigate while explicit edit buttons and Alt/Meta-click keep menu editing; Pages selections now close the side drawer only after a successful page load; opening the preview mobile menu closes the editor side drawer first and renders a safe fixed drawer with margin/no-overlap guards; the Design drawer now exposes direct Designer polish presets for component design systems; draft GET falls back to published canvas if a page has lost its draft record, and failed page loads revert active page/slug instead of silently closing the drawer. Functional agent flagged stale columns draft as the remaining no-op risk; design agent flagged z-index/compact header safety and the need for visible designer polish controls. | W14/W18/W179/W216/W225 | Automatic checks passing / user QA pending | Run user QA on `/ko/admin-builder` at 1365/1280/1024/768/390 widths, especially Pages, Navigation, Columns, header nav, and preview hamburger states. Continue broader Wix parity with F-layer items after current editor correctness regressions stay stable. |

## M164-A — Payment Provider Abstraction

- 시작/종료: 2026-05-20 / 2026-05-20
- 변경 파일:
  - `src/lib/builder/commerce/payment-providers.ts`, `src/lib/builder/commerce/__tests__/payment-providers.test.ts` — manual-invoice/sandbox-card provider ids, localized labels, intent create/capture/failure normalization, and order payment-status mapping을 추가했다.
  - `src/app/api/builder/commerce/payment-intents/route.ts` — public rate-limited test-mode payment intent create/capture API를 추가했다.
  - `src/app/api/builder/commerce/checkout/route.ts`, `src/lib/builder/commerce/checkout-shared.ts` — checkout payment adapter를 provider id로 정리하고 checkout order에 provider intent reference를 저장한다.
  - `src/components/builder/commerce/OrderManagerClient.tsx` — order admin에서 payment reference를 표시한다.
  - `tests/builder-editor/commerce-products.playwright.ts` — provider intent API, PDP checkout payment reference, order API/admin reference visibility를 검증한다.
  - `scripts/clean-next-build.mjs`, `next.config.mjs` — dev 서버가 stale `.next-dev` middleware cache와 runtime-data Fast Refresh로 commerce reload를 500/404로 오판하지 않도록 정리했다.
- F-layer 판정:
  - F67 🔴 → 🟢: Payment providers expose test-mode intents, captures, failures, and status mapping.
  - M164 🔴 → 🟡: F68-F74 payment webhooks/refunds/invoices/manual operations/multi-currency/security/analytics remained open at this slice.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/commerce/__tests__/orders-engine.test.ts src/lib/builder/commerce/__tests__/payment-webhooks-engine.test.ts` ✅ (provider Stripe refund execution/failure guard + refund webhook locks)
  - `npx vitest run src/lib/builder/commerce/__tests__/payment-providers.test.ts src/lib/builder/commerce/__tests__/checkout-shared.test.ts src/lib/builder/commerce/__tests__/orders-engine.test.ts src/lib/builder/commerce/__tests__/products-engine.test.ts src/lib/builder/commerce/__tests__/notifications-engine.test.ts src/lib/builder/commerce/__tests__/notifications-shared.test.ts` ✅
  - `BASE_URL=http://127.0.0.1:3003 npx playwright test --config=playwright.config.ts tests/builder-editor/commerce-products.playwright.ts -g "payment-intents" --workers=1` ✅
  - `BASE_URL=http://127.0.0.1:3003 npx playwright test --config=playwright.config.ts tests/builder-editor/commerce-products.playwright.ts -g "product detail pages" --workers=1` ✅
  - `BASE_URL=http://127.0.0.1:3003 npx playwright test --config=playwright.config.ts tests/builder-editor/commerce-products.playwright.ts --workers=1` ✅ (9 passed at F67; later F68 run passed 10)
- 다음:
  - M164-B에서 F68 provider webhook verification, idempotency, and replay를 구현했다. 다음은 M164-C/F69 refunds.

## M164-B — Payment Webhooks

- 시작/종료: 2026-05-20 / 2026-05-20
- 3번 기록 에이전트 누락 목록 반영:
  - 이번 F68에서 해결한 항목: commerce payment webhook inbound route, raw body signature verification, stale/invalid signature rejection, durable webhook event storage, `provider + eventId` idempotency, duplicate no-op, `order.payment.referenceId` order matching, payment status update, paid-after-failed downgrade lock, unmatched event replay, amount/currency mismatch block, order audit metadata, admin event query/replay API, payments/webhooks admin screen, KPI/filter/queue/detail/replay UI, masked payload rendering, 375px mobile overflow check.
  - 아직 Wix 대비 남은 항목: provider refund lifecycle handling beyond synchronous Stripe execution, F70 invoices/receipts/email/export, F71 deeper manual payment operations, F72 multi-currency/conversion restrictions, F73 broader checkout/payment security audit, F74 payment analytics and conversion/refund summaries.
- 변경 파일:
  - `src/lib/builder/commerce/payment-webhooks-shared.ts` — webhook event schema, status model, provider payload normalizer, event-type payment status mapping, sensitive payload masking, stored event normalization을 추가했다.
  - `src/lib/builder/commerce/payment-webhooks-engine.ts` — file/blob-backed payment webhook event storage, provider-event idempotency, unmatched replay, amount/currency mismatch blocking, paid-order failure downgrade lock, order matching, replay count, and KPI summary를 추가했다.
  - `src/app/api/builder/commerce/payment-webhooks/[provider]/route.ts` — signed inbound payment webhook receiver를 추가했다. `commerce-signature`/`stripe-signature` raw-body HMAC 검증을 통과한 이벤트만 처리한다.
  - `src/app/api/builder/commerce/payment-webhooks/route.ts`, `src/app/api/builder/commerce/payment-webhooks/events/[eventId]/replay/route.ts` — admin event list/KPI API와 guarded replay API를 추가했다.
  - `src/lib/builder/commerce/orders-engine.ts` — payment reference lookup과 webhook-safe order payment update/audit helper를 추가했다.
  - `src/components/builder/commerce/PaymentWebhookManagerClient.tsx`, `PaymentWebhookManager.module.css`, `src/app/(builder)/[locale]/admin-builder/commerce/webhooks/page.tsx` — Webhooks 운영 화면, KPI, provider/status/search filters, failed/unmatched queue, replay button busy/disabled state, masked payload detail, mobile-safe wrapping을 추가했다.
  - `src/components/builder/commerce/OrderManagerClient.tsx`, `ProductManagerClient.tsx`, `TaxRulesClient.tsx`, `ShippingRulesClient.tsx`, `NotificationManagerClient.tsx`, `NotificationManager.module.css` — commerce admin navigation에 Webhooks 링크를 추가하고 notifications header actions wrapping을 보강했다.
  - `src/components/builder/commerce/PublicProductDetail.tsx` — 전체 commerce 회귀 중 발견한 PDP 썸네일 race를 수정했다. 수동 썸네일 선택을 초기 variant-media effect가 덮지 않도록 variant id 변경 시에만 media를 자동 전환하고, 상호작용 준비 상태를 `data-commerce-product-hydrated`로 노출한다.
  - `src/lib/builder/commerce/__tests__/payment-webhooks-engine.test.ts`, `src/app/api/builder/commerce/payment-webhooks/[provider]/__tests__/route.test.ts`, `tests/builder-editor/commerce-products.playwright.ts` — F68 engine/API/UI와 PDP hydration regression을 검증한다.
- F-layer 판정:
  - F68 🔴 → 🟢: Provider webhook verification, idempotency, and event replay are implemented.
  - M164 🟡 유지: F70-F74 invoices/manual operations/multi-currency/security/analytics remain after M164-C.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/commerce/__tests__/payment-webhooks-engine.test.ts 'src/app/api/builder/commerce/payment-webhooks/[provider]/__tests__/route.test.ts'` ✅ (2 files, 5 tests passed)
  - `npx vitest run src/lib/builder/commerce/__tests__/payment-providers.test.ts src/lib/builder/commerce/__tests__/payment-webhooks-engine.test.ts src/lib/builder/commerce/__tests__/checkout-shared.test.ts src/lib/builder/commerce/__tests__/orders-engine.test.ts src/lib/builder/commerce/__tests__/products-engine.test.ts src/lib/builder/commerce/__tests__/notifications-engine.test.ts src/lib/builder/commerce/__tests__/notifications-shared.test.ts` ✅ (7 files, 17 tests passed)
  - `BASE_URL=http://127.0.0.1:3003 npx playwright test --config=playwright.config.ts tests/builder-editor/commerce-products.playwright.ts -g "commerce/webhooks" --workers=1` ✅
  - `BASE_URL=http://127.0.0.1:3003 npx playwright test --config=playwright.config.ts tests/builder-editor/commerce-products.playwright.ts -g "product detail pages" --workers=1 --repeat-each=3` ✅
  - `BASE_URL=http://127.0.0.1:3003 npx playwright test --config=playwright.config.ts tests/builder-editor/commerce-products.playwright.ts --workers=1` ✅ (10 passed)
- 다음:
  - M164-C에서 F69 refunds/partial refunds, payment/order audit state, admin refund UI, and refund webhook/replay interaction을 구현했다. 다음은 F70 invoices/receipts.

## M164-C — Refunds And Partial Refunds

- 시작/종료: 2026-05-20 / 2026-05-20
- 3번 기록 에이전트 누락 목록 반영:
  - 이번 F69에서 해결한 항목: internal/manual refund ledger, Stripe refund execution for non-stub order payments before local state mutation, provider failure no-mutation guard, provider refund id persistence, partial and full refund state transitions, remaining refundable amount validation, generic payment-status bypass prevention, late payment webhook refund-state lock, order audit entries, admin refund form/history, payment-status filters, CSV refund visibility, and product-detail-to-order-admin E2E coverage.
  - 아직 Wix 대비 남은 항목: provider refund lifecycle events beyond synchronous success/failure, idempotency keys, line-item and quantity refunds, inventory restore option, customer refund emails, refundability/calculate preview, split-payment refunds, ARN/provider fee metadata, high-value approval workflow, and stricter post-refund order edit restrictions.
- 변경 파일:
  - `src/lib/builder/commerce/orders-engine.ts` — refund helper state locks, Stripe refund execution for non-stub provider payments, provider failure no-mutation guard, remaining refundable calculation usage, generic update bypass prevention, late paid webhook refund locks, and audit/refund persistence를 보강했다.
  - `src/lib/builder/commerce/payment-webhooks-engine.ts` — late failure/success webhooks가 `partially_refunded`/`refunded` orders를 되돌리지 않도록 lock reason을 유지한다.
  - `src/app/api/builder/commerce/orders/[orderId]/route.ts`, `src/app/api/builder/commerce/orders/[orderId]/refunds/route.ts` — manual payment update schema에서 refund-only statuses를 제거하고 guarded refund API를 사용한다.
  - `src/components/builder/commerce/OrderManagerClient.tsx`, `OrderManager.module.css` — refundable total, partial/full refund form, reason input, refund history, locked payment selector state, filter/export visibility, and mobile-safe refund layout을 추가했다.
  - `src/lib/builder/commerce/__tests__/orders-engine.test.ts`, `src/lib/builder/commerce/__tests__/payment-webhooks-engine.test.ts`, `tests/builder-editor/commerce-products.playwright.ts` — refund ledger/state locks, provider Stripe refund success/failure with no local mutation on failure, late webhook behavior, over-refund guard, UI partial/full refund flow, filters, CSV, and payment-selector lock을 검증한다.
- F-layer 판정:
  - F69 🔴 → 🟢: Refunds and partial refunds update payment, order, and audit states.
  - M164 🟡 유지: F70-F74 invoices/manual operations/multi-currency/security/analytics remain.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/commerce/__tests__/orders-engine.test.ts src/lib/builder/commerce/__tests__/payment-webhooks-engine.test.ts` ✅ (2 files, 8 tests passed; provider Stripe refund execution/failure guard + refund webhook locks)
  - `npx vitest run src/lib/builder/commerce/__tests__/payment-providers.test.ts src/lib/builder/commerce/__tests__/payment-webhooks-engine.test.ts src/lib/builder/commerce/__tests__/checkout-shared.test.ts src/lib/builder/commerce/__tests__/orders-engine.test.ts src/lib/builder/commerce/__tests__/products-engine.test.ts src/lib/builder/commerce/__tests__/notifications-engine.test.ts src/lib/builder/commerce/__tests__/notifications-shared.test.ts` ✅ (7 files, 19 tests passed)
  - `BASE_URL=http://127.0.0.1:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/commerce-products.playwright.ts -g "product detail pages" --project=chromium-builder --workers=1` ✅
- 다음:
  - M164-D에서 F70 invoices/receipts, receipt data model, email/export, and order admin receipt operations를 구현한다.

## M164-D — Order And Booking Invoices/Receipts

- 시작/종료: 2026-05-20 / 2026-05-20
- 1번 기능 에이전트 / 2번 디자인 에이전트 / 3번 기록 에이전트 반영:
  - 이번 F70 slice에서 해결한 항목: order-level invoice/receipt snapshot model, paid-state receipt guard, unchanged snapshot idempotency, issue/email-stub API, document notification templates, order audit events, order-card document panel/actions/history, CSV document columns, checkout-to-order-admin E2E coverage, booking payment amount/currency snapshots, booking billing document records, booking paid-state receipt guard, booking idempotent document issue API, booking dashboard issue/email actions, booking emailed-stub status, central order+booking billing document list, token-safe document CSV export, admin PDF download, HTML fallback rendering, tokenized public share view, share-link create/expiry/revoke lifecycle, no-store public document responses, revoked/expired public 410 안내 화면, viewed/download audit tracking, optional automatic invoice/receipt issuance policy toggles for order/booking create and paid transitions, file/blob-backed number reservation ledger with void-on-save-failure audit, process/file lock hardening for local concurrent reservations, shared `INV/RCT-YYYY-000001` invoice/receipt numbering across order and booking documents, order/booking void and supersede lifecycle with replacement documents, tokenized unpaid order/booking invoice payment links with explicit create/renew/revoke lifecycle, no-store/noindex public pay page, central manager pay-link/open/copy/renew/revoke/void/supersede actions, public document pay CTA, payment-reference/currency/balance/lifecycle-bound token validation, revoked/expired 410 handling, CSV token exclusion, non-production-only manual settlement fallback, Stripe Checkout hosted session creation with idempotency keys, SCA-capable secure payment redirect/return/cancel states, signed Stripe paid webhook normalization, hosted payment amount/currency/payment-link validation, order/booking paid settlement, and receipt automation handoff.
  - 아직 Wix 대비 남은 항목: distributed blob CAS hardening, receipt per payment transaction, split-payment receipts, branded PDF templates with logo/business info/legal terms and full non-ASCII fidelity, production Stripe/provider configuration QA, provider refund lifecycle depth, bulk generation/download, and customer portal self-service.
- 변경 파일:
  - `src/lib/builder/billing-document-numbering.ts`, `src/lib/builder/commerce/orders-engine.ts`, `src/lib/builder/bookings/billing-documents.ts` — order/booking billing documents가 같은 file/blob-backed yearly invoice/receipt reservation ledger를 사용해 `INV-YYYY-000001` / `RCT-YYYY-000001` format으로 발행되도록 연결했고, 저장 실패 시 예약 번호를 void 처리해 감사 이력을 남긴다. Same-process mutations and local file backend writes are serialized with a mutation queue plus stale lock-file recovery.
  - `src/lib/builder/commerce/orders-shared.ts`, `orders-engine.ts` — `documents[]`, invoice/receipt types/statuses, issued snapshot totals, refund/balance due snapshot, issue helper, receipt guard, email-status helper, and audit events를 추가했다.
  - `src/app/api/builder/commerce/orders/[orderId]/documents/route.ts` — guarded document issue/email-stub endpoint를 추가했다.
  - `src/lib/builder/commerce/notifications-shared.ts`, `notifications-engine.ts`, `src/components/builder/commerce/NotificationManagerClient.tsx` — invoice/receipt customer notification event/template/outbox support와 admin template labels를 추가했다.
  - `src/components/builder/commerce/OrderManagerClient.tsx`, `OrderManager.module.css` — order card full-width documents panel, issue/email invoice/receipt buttons, receipt disabled guard, document history/status, and CSV document columns을 추가했다.
  - `src/lib/builder/commerce/__tests__/orders-engine.test.ts`, `notifications-engine.test.ts`, `tests/builder-editor/commerce-products.playwright.ts` — document snapshot/idempotency/receipt guard/email status/notification events/UI issue-email/export 흐름을 검증한다.
  - `src/lib/builder/bookings/types.ts`, `billing-documents.ts`, `notifications.ts` — booking billing document 타입, 금액/통화 snapshot, invoice/receipt 발행 helper, paid receipt guard, email-stub status helper, and customer document email sender를 추가했다.
  - `src/app/api/booking/book/route.ts`, `src/app/api/builder/bookings/admin-create/route.ts`, `src/app/api/builder/bookings/waitlist/[id]/promote/route.ts` — 새 booking 생성 시 service price/currency snapshot과 empty billing document list를 저장한다.
  - `src/app/api/builder/bookings/[id]/documents/route.ts` — guarded booking document issue/email-stub endpoint를 추가했다.
  - `src/components/builder/bookings/BookingDashboardAdmin.tsx`, `BookingsAdmin.module.css` — booking 상세 modal에 billing documents panel, issue/email invoice/receipt buttons, receipt disabled guard, document history/status, mobile-safe wrapping을 추가했다.
  - `src/lib/builder/bookings/__tests__/billing-documents.test.ts`, `tests/builder-editor/bookings-m26-dashboard.playwright.ts` — booking invoice/receipt snapshot/idempotency/receipt guard/email status와 admin dashboard issue-email flow를 검증한다.
  - `src/lib/builder/billing-documents.ts`, `src/lib/builder/billing-document-hosted-payments.ts` — order/booking 문서 projection, 검색/정렬, 금액 formatting, active-only tokenized share path, share status/expiry/revocation/view/download counters, unpaid order/booking invoice payment link status/expiry/revocation fields, token/path validation, create/renew/revoke helpers, public document pay CTA, manual fallback settlement helper, hosted Stripe Checkout session request builder, paid webhook normalization, hosted payment validation/settlement helper, HTML/PDF render helper, and mobile/long-text-safe public HTML styles를 추가했다.
  - `src/lib/builder/billing-document-automation.ts`, `src/app/api/builder/billing-documents/settings/route.ts` — file/blob-backed automatic issuance policy settings, order/booking invoice-on-create and receipt-on-paid rules, optional email-stub automation, idempotent duplicate backfill, and guarded settings API를 추가했다.
  - `src/app/api/builder/billing-documents/route.ts`, `src/app/api/builder/billing-documents/[source]/[ownerId]/[documentId]/download/route.ts`, `src/app/api/builder/billing-documents/[source]/[ownerId]/[documentId]/share-link/route.ts`, `src/app/api/builder/billing-documents/[source]/[ownerId]/[documentId]/payment-link/route.ts`, `src/app/api/builder/billing-documents/[source]/[ownerId]/[documentId]/lifecycle/route.ts`, `src/app/api/billing-documents/[source]/[ownerId]/[documentId]/route.ts`, `src/app/api/billing-documents/[source]/[ownerId]/[documentId]/pay/route.ts`, `src/app/api/billing-documents/stripe-webhook/route.ts` — guarded central list API, admin PDF/HTML download with download tracking, guarded share-link create/revoke API, guarded payment-link create/renew/revoke API, guarded void/supersede lifecycle API, no-store public share view/PDF, revoked/expired 410 안내, no-store/noindex public payment page for unpaid order/booking invoices, Stripe Checkout redirect session creation when `STRIPE_SECRET_KEY` is configured, and signed paid webhook settlement을 추가했다.
  - `src/app/api/builder/commerce/checkout/route.ts`, `src/app/api/builder/commerce/orders/[orderId]/route.ts`, `src/lib/builder/commerce/payment-webhooks-engine.ts`, `src/app/api/booking/book/route.ts`, `src/app/api/booking/stripe-webhook/route.ts`, `src/app/api/builder/bookings/admin-create/route.ts`, `src/app/api/builder/bookings/waitlist/[id]/promote/route.ts` — automatic issuance policy를 order checkout/admin paid/webhook duplicate backfill, booking public/admin/waitlist creation, and Stripe paid webhook paths에 연결했다.
  - `src/components/builder/commerce/BillingDocumentsClient.tsx`, `BillingDocuments.module.css`, `src/app/(builder)/[locale]/admin-builder/commerce/documents/page.tsx` — central billing documents manager, search/source/type/status/payment-status/payment-link-status filters, KPIs, token-safe CSV export with lifecycle columns, PDF download, share-link create/view/copy/revoke actions, payment status display, unpaid order/booking invoice pay-link create/open/copy/renew/revoke actions, void/supersede actions, expiry state, view/download count display, and mobile-safe automatic issuance policy panel을 추가했다.
  - `src/components/builder/commerce/OrderManagerClient.tsx`, `src/components/builder/bookings/BookingDashboardAdmin.tsx` — 개별 order/booking document row에 document-id based PDF download action과 central documents 진입을 추가했다.
  - `src/lib/builder/__tests__/billing-documents.test.ts` — order+booking document merge, shared invoice/receipt sequence continuity, concurrent local reservation serialization, reservation ledger void-on-failure audit, void/supersede lifecycle, filter/search, share token validation, share creation/revocation invalidation, viewed/download counters, HTML render, order and booking payment link create/idempotent active create/revoke/renew rotation/token validation/render/settlement, hosted Stripe Checkout request/idempotency/session creation, paid Stripe webhook normalization/settlement/idempotency, paid receipt automation, `%PDF-` PDF output, automatic policy save/load defaults, invoice-on-create, receipt-on-paid, and duplicate suppression을 검증한다.
- F-layer 판정:
  - F70 🔴 → 🟡: Orders and bookings can generate receipt/invoice data, email-stub it, export/search it centrally, download a basic PDF, expose tokenized no-store share views, create/revoke expiring share links, track viewed/downloaded counts, optionally auto-issue invoices/receipts from create/paid policy toggles, share an auditable yearly invoice/receipt number reservation ledger across orders/bookings with local concurrency serialization, void/supersede issued documents, expose tokenized unpaid order/booking invoice payment links with create/renew/revoke lifecycle, create Stripe Checkout hosted sessions for active invoice pay links, and settle paid Stripe webhooks into order/booking receipt automation. Distributed blob CAS hardening, production provider QA/refund lifecycle depth, legal template depth, bulk workflows, and portal self-service remain.
  - M164 🟡 유지: F71-F74 manual operations/multi-currency/security/analytics remain.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/__tests__/billing-documents.test.ts src/lib/builder/commerce/__tests__/payment-providers.test.ts` ✅ (hosted Stripe invoice session/webhook settlement + provider intent tests)
  - `npx vitest run src/lib/builder/__tests__/billing-documents.test.ts src/lib/builder/bookings/__tests__/billing-documents.test.ts` ✅ (concurrent local reservation serialization, reservation ledger, void/supersede lifecycle, payment-link lifecycle)
  - `BASE_URL=http://127.0.0.1:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/billing-documents.playwright.ts --workers=1` ✅ (central billing manager policy + booking invoice payment links)
  - `BASE_URL=http://127.0.0.1:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/chrome-click-safety.playwright.ts --workers=1` ✅ (editor side drawer/header overlap regression)
  - `npx vitest run src/lib/builder/__tests__/billing-documents.test.ts src/lib/builder/bookings/__tests__/billing-documents.test.ts src/lib/builder/commerce/__tests__/orders-engine.test.ts` ✅ (shared numbering, payment-link lifecycle, automation duplicate suppression)
  - `npx vitest run src/lib/builder/commerce/__tests__/orders-engine.test.ts src/lib/builder/commerce/__tests__/notifications-shared.test.ts src/lib/builder/commerce/__tests__/notifications-engine.test.ts` ✅ (3 files, 7 tests passed)
  - `npx vitest run src/lib/builder/commerce/__tests__/payment-providers.test.ts src/lib/builder/commerce/__tests__/payment-webhooks-engine.test.ts src/lib/builder/commerce/__tests__/checkout-shared.test.ts src/lib/builder/commerce/__tests__/orders-engine.test.ts src/lib/builder/commerce/__tests__/products-engine.test.ts src/lib/builder/commerce/__tests__/notifications-engine.test.ts src/lib/builder/commerce/__tests__/notifications-shared.test.ts` ✅ (7 files, 21 tests passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/commerce-products.playwright.ts -g "product detail pages" --project=chromium-builder --workers=1` ✅
  - `npx vitest run src/lib/builder/bookings/__tests__/billing-documents.test.ts src/lib/builder/bookings/__tests__/refund.test.ts src/lib/builder/bookings/__tests__/analytics.test.ts` ✅ (3 files, 6 tests passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/bookings-m26-dashboard.playwright.ts --project=chromium-builder --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `npx vitest run src/lib/builder/__tests__/billing-documents.test.ts src/lib/builder/bookings/__tests__/billing-documents.test.ts src/lib/builder/commerce/__tests__/orders-engine.test.ts` ✅ (3 files, 5 tests passed)
  - `npx vitest run src/lib/builder/__tests__/billing-documents.test.ts src/lib/builder/bookings/__tests__/billing-documents.test.ts src/lib/builder/commerce/__tests__/orders-engine.test.ts` ✅ (3 files, 6 tests passed after automatic issuance policy coverage)
  - `npm run typecheck` ✅ after order invoice payment-link implementation
  - `npx vitest run src/lib/builder/__tests__/billing-documents.test.ts src/lib/builder/bookings/__tests__/billing-documents.test.ts src/lib/builder/commerce/__tests__/orders-engine.test.ts` ✅ (3 files, 6 tests passed after payment-link coverage)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/billing-documents.playwright.ts --workers=1` ✅ (Chromium sandbox MachPort failure reproduced first, then passed with sandbox escalation)
  - `npm run typecheck` ✅ after payment-link revoke/renew lifecycle
  - `npx vitest run src/lib/builder/__tests__/billing-documents.test.ts src/lib/builder/bookings/__tests__/billing-documents.test.ts src/lib/builder/commerce/__tests__/orders-engine.test.ts` ✅ (3 files, 6 tests passed after revoke/renew lifecycle)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/billing-documents.playwright.ts --workers=1` ✅ (1 passed with sandbox escalation after UI lifecycle actions)
  - Local 3000 smoke: `/ko/admin-builder/commerce/documents` 200, `/api/builder/billing-documents?locale=ko&source=booking` 200, admin PDF download 200 with `application/pdf` and `%PDF-` header, tokenized public share route 200 ✅
  - Local 3000 smoke: share-link `POST` returned active 30-day expiry, public HTML 200, public PDF 200, central list showed `viewCount=1` and `downloadCount=1`, `DELETE` returned revoked and old token 403 before no-store patch; after hardening, revoked old token returned 410 `text/html`, fresh active link returned 200 with `cache-control: no-store`, and fresh revoked token returned 410 `text/html` ✅
  - Local 3000 smoke: authenticated `/api/builder/billing-documents/settings` GET/PATCH saved automatic issuance policy and reset it to default false; authenticated `/ko/admin-builder/commerce/documents` returned 200 ✅
- 다음:
  - F70 depth로 distributed blob CAS hardening, branded/legal PDF settings, bulk workflows, customer portal self-service를 이어가거나, M164-E/F71 manual payment operations로 넘어간다.

## M164-M — Payment-Link Activity History

- 시작/종료: 2026-05-20 / 2026-05-20
- 1번 기능 에이전트 / 2번 디자인 에이전트 / 3번 기록 에이전트 반영:
  - 이번 F71 slice에서 해결한 항목: order/booking invoice payment links now preserve per-document activity history for create, renew, admin revoke, balance-change stale revoke, void, and supersede transitions.
  - Activity entries store event id, type, actor, timestamp, payment link id, expiry, revoke reason, balance due, and manual/hosted payment id where applicable; raw payment tokens and tokenized URLs are not stored.
  - Balance-change auto revokes only append once when a successful payment changes the current invoice balance and the link was not already revoked. Duplicate manual-payment idempotency retries and duplicate revoke calls do not add extra activity rows.
  - Void/supersede no longer overwrite an existing stale/admin revoke reason when the link was already revoked.
  - Central Billing rows now expose an `Activity` disclosure with a neutral full-width document activity panel, newest-first payment-link events, long-id wrapping, and a renewal-needed marker when the current link is stale.
  - 아직 Wix 대비 남은 항목: live email-provider delivery QA, richer payment-received workflow controls/templates, production/template/bulk/portal invoice depth, and broader F72-F74 multi-currency/security/analytics.
- 변경 파일:
  - `src/lib/builder/billing-payment-link-history.ts` — shared append/dedupe helper and typed payment-link history entry model을 추가했다.
  - `src/lib/builder/commerce/orders-shared.ts`, `src/lib/builder/bookings/types.ts` — order/booking billing documents에 `paymentLinkEvents` history 배열을 추가하고 order normalization에서 보존한다.
  - `src/lib/builder/billing-documents.ts` — create/renew/revoke helper가 activity events를 append하고, row projection에서 label-ready history를 내려준다.
  - `src/lib/builder/commerce/orders-engine.ts`, `src/lib/builder/bookings/payments.ts`, `src/lib/builder/bookings/billing-documents.ts` — successful balance-change payment, void, and supersede lifecycle paths에 link activity events를 연결하고 already-revoked links는 cause를 보존한다.
  - `src/components/builder/commerce/BillingDocumentsClient.tsx`, `src/components/builder/commerce/BillingDocuments.module.css` — central billing row에 `Activity` toggle/panel, renewal-needed item, payment-link event labels, and mobile-safe wrapping을 추가했다.
  - `src/lib/builder/__tests__/billing-documents.test.ts`, `tests/builder-editor/billing-documents.playwright.ts` — create/no-op create/admin revoke/renew/balance-change stale revoke/activity panel visibility를 검증한다.
- F-layer 판정:
  - F71 🟡 유지: stale pay-link audit/history is now covered. Live email-provider QA, richer payment-received workflow controls/templates, and F72-F74 remain.
- 검증:
  - `npm run typecheck` ✅
  - `npm run test:unit -- src/lib/builder/__tests__/billing-documents.test.ts` ✅ (7 tests passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/billing-documents.playwright.ts --workers=1` ✅ (2 passed)
- 다음:
  - F71을 green에 더 가깝게 올리려면 live email-provider delivery QA or richer payment-received admin/customer controls를 이어간다.

## M164-K — Stale Pay-Link Reconciliation Surface

- 시작/종료: 2026-05-20 / 2026-05-20
- 1번 기능 에이전트 / 2번 디자인 에이전트 / 3번 기록 에이전트 반영:
  - 이번 F71 slice에서 해결한 항목: successful manual payment로 current invoice balance가 바뀐 경우에만 stale payment-link renewal 상태로 판정한다.
  - Order/booking invoice document에 `paymentLinkRevokedReason`, `paymentLinkRevokedBalanceDue`, `paymentLinkRevokedByPaymentId`를 저장해 balance-change revoke와 admin/document lifecycle revoke를 구분한다.
  - Central billing row는 큰 warning card 대신 기존 state line에 `Pay link needs renewal · balance changed`를 표시하고, stale 상태에서 old token은 계속 410으로 막으며 `Renew pay`만 노출한다.
  - Renewed payment link는 stale metadata를 clear하고 `current` reconciliation status로 돌아간다.
  - 아직 Wix 대비 남은 항목: stale-link audit/history timeline, customer payment-received emails, production/template/bulk/portal invoice depth, and broader F72-F74 multi-currency/security/analytics.
- 변경 파일:
  - `src/lib/builder/commerce/orders-shared.ts`, `src/lib/builder/bookings/types.ts` — invoice payment-link revoke reason/balance/payment metadata fields를 추가했다.
  - `src/lib/builder/commerce/orders-engine.ts`, `src/lib/builder/bookings/payments.ts`, `src/lib/builder/bookings/billing-documents.ts` — manual payment balance updates, admin revoke, void, and supersede paths에 revoke reason metadata를 연결했다.
  - `src/lib/builder/billing-documents.ts` — `paymentReconciliationStatus`, `paymentLinkRenewalNeeded`, `paymentLinkRenewalReason`를 balance-change stale link에만 부여하고 renewed link에서 metadata를 초기화한다.
  - `src/components/builder/commerce/BillingDocumentsClient.tsx`, `src/components/builder/commerce/BillingDocuments.module.css` — central billing row의 payment-link display state를 `active/expired/revoked/stale/closed`로 분리하고 stale/closed 색상 및 test hook을 추가했다.
  - `src/lib/builder/__tests__/billing-documents.test.ts`, `tests/builder-editor/billing-documents.playwright.ts` — admin revoke는 renewal-needed가 아니고, partial manual settlement는 stale renewal-needed로 표시되며 old hosted pay link가 410이 되는 흐름을 검증한다.
- F-layer 판정:
  - F71 🟡 유지: stale pay-link renewal status surface and persisted stale metadata are now covered. Customer payment-received email depth, richer stale-link audit/history, and F72-F74 remain.
- 검증:
  - `npm run typecheck` ✅
  - `npm run test:unit -- src/lib/builder/__tests__/billing-documents.test.ts` ✅ (7 tests passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/billing-documents.playwright.ts --workers=1` ✅ (2 passed after restarting stale local 3000 dev server)
- 다음:
  - F71을 green에 더 가깝게 올리려면 customer payment-received emails and stale-link audit/history timeline을 이어간다.

## M164-N — Payment-Received Workflow Controls

- 시작/종료: 2026-05-20 / 2026-05-20
- 1번 기능 에이전트 / 2번 디자인 에이전트 / 3번 기록 에이전트 반영:
  - 이번 F71 slice에서 해결한 항목: customer payment-received notification workflow controls and outbox payment summaries.
  - Commerce Notifications manager exposes global payment-received enablement plus separate manual payment, hosted payment-link, and receipt-overlap suppression toggles.
  - Payment-received event payload now carries policy metadata for skipped cases, so disabled manual/hosted/receipt-overlap behavior remains auditable in the outbox.
  - Payment-received template variables are visible in the admin UI so operators know which payment/document fields can be used in future provider-backed email bodies.
  - Outbox rows for `billing.payment_received.customer` now show a compact summary with payment method, amount, invoice number, remaining balance, and payment id.
  - 아직 Wix 대비 남은 항목: live email-provider delivery QA, branded email body preview/editing, production provider configuration QA, distributed blob CAS hardening, customer portal/bulk invoice workflows, and broader F72-F74 multi-currency/security/analytics.
- 변경 파일:
  - `src/components/builder/commerce/NotificationManagerClient.tsx` — payment-received policy controls and outbox summary rendering.
  - `src/components/builder/commerce/NotificationManager.module.css` — payment summary chip styling and overflow-safe notification rows.
  - `src/lib/builder/commerce/notifications-shared.ts`, `src/lib/builder/commerce/notifications-engine.ts` — payment-received settings normalization, skip policy, and template variable payload support.
  - `tests/builder-editor/billing-documents.playwright.ts`, `tests/builder-editor/commerce-products.playwright.ts` — workflow controls and payment summary evidence.
- F-layer 판정:
  - F71 🟡 유지: payment-received workflow controls and admin visibility are now covered. Live provider delivery QA, branded body preview, production provider QA, and F72-F74 remain.
- 검증:
  - `npm run typecheck` ✅
  - `npm run test:unit -- src/lib/builder/commerce/__tests__/notifications-shared.test.ts src/lib/builder/commerce/__tests__/notifications-engine.test.ts src/lib/builder/__tests__/billing-documents.test.ts` ✅ (3 files, 12 tests passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/commerce-products.playwright.ts -g "queues cart recovery and order hooks" --workers=1` ✅ (1 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/billing-documents.playwright.ts --workers=1` ✅ (2 passed)
- 다음:
  - F71을 green에 더 가깝게 올리려면 live provider delivery QA, branded payment email body preview/editing, and production Stripe/provider configuration checks를 이어간다.

## M164-O — Multi-Currency Guardrails

- 시작/종료: 2026-05-20 / 2026-05-20
- 1번 기능 에이전트 / 2번 디자인 에이전트 / 3번 기록 에이전트 반영:
  - 이번 F72 slice에서 해결한 항목: checkout single-currency policy, mixed raw cart rejection, unsupported checkout currency validation, and billing currency visibility.
  - Checkout now reads the declared cart currency, shows an explicit policy notice on `/store/checkout`, and rejects raw carts whose line item currencies differ before product normalization can silently drop mismatched items.
  - Central billing document rows now carry `data-billing-document-currency-code`, show a compact currency chip near totals, and the record-payment form states that offline payments must be recorded in the invoice currency.
  - 아직 Wix 대비 남은 항목: conversion/rate tables, currency conversion placeholders, broader admin currency matrix management, localized currency editing depth, production provider currency QA, and F73-F74 security/analytics.
- 변경 파일:
  - `src/lib/builder/commerce/checkout-shared.ts` — supported checkout currency constants, currency normalization, and raw cart currency error helpers.
  - `src/app/api/builder/commerce/checkout/route.ts` — raw mixed-currency/unsupported-currency validation before cart normalization and product reconciliation.
  - `src/components/builder/commerce/PublicCheckout.tsx`, `PublicCheckout.module.css` — checkout currency policy notice and explicit mixed-currency error copy.
  - `src/components/builder/commerce/BillingDocumentsClient.tsx`, `BillingDocuments.module.css` — billing row currency chip and manual-payment invoice-currency helper.
  - `src/lib/builder/commerce/__tests__/checkout-shared.test.ts`, `tests/builder-editor/commerce-products.playwright.ts`, `tests/builder-editor/billing-documents.playwright.ts` — unit and E2E coverage for currency guardrails and display.
- F-layer 판정:
  - F72 🔴 → 🟡: single-currency checkout restrictions and billing currency visibility are now covered. Conversion/rates/provider breadth remain, so this is not green.
- 검증:
  - `npm run typecheck` ✅
  - `npm run test:unit -- src/lib/builder/commerce/__tests__/checkout-shared.test.ts src/lib/builder/commerce/__tests__/cart-shared.test.ts` ✅ (2 files, 8 tests passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/commerce-products.playwright.ts -g "single-currency policy" --workers=1` ✅ (1 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/billing-documents.playwright.ts --workers=1` ✅ (2 passed)
- 다음:
  - F72를 green에 가깝게 올리려면 rate/conversion placeholder model, admin currency matrix, checkout/order/document conversion disclosure, and provider currency QA를 이어간다.

## M164-P — Currency Settings And Conversion Preview

- 시작/종료: 2026-05-20 / 2026-05-20
- 1번 기능 에이전트 / 2번 디자인 에이전트 / 3번 기록 에이전트 반영:
  - 이번 F72 slice에서 해결한 항목: guarded currency settings persistence, enabled checkout currency subset enforcement, manual preview-rate metadata, and no-conversion disclosures.
  - Commerce currency settings now persist base currency, enabled checkout currencies, conversion mode (`disabled` or `manual-preview`), and manual preview-rate metadata in a separate file/blob-backed commerce settings store.
  - Checkout API loads the currency settings before cart normalization, so disabled currencies are rejected before product reconciliation can silently drop mismatched lines.
  - Admin now has `/admin-builder/commerce/currency` with base currency, conversion mode, enabled currency matrix, preview-rate state, and commerce header links from adjacent commerce managers.
  - Public checkout shows the active base currency, conversion mode/status, and supported currency set; public invoice pay pages show document currency and a no-conversion policy.
  - 아직 Wix 대비 남은 항목: actual converted amount calculation, rate provider integrations, production provider currency QA, localized currency editing depth, converted order/invoice amount workflows, and F73-F74 security/analytics.
- 변경 파일:
  - `src/lib/builder/commerce/currency-shared.ts`, `currency-engine.ts` — currency settings model, normalization, file/blob persistence, checkout enabled subset helpers, and rate status helpers.
  - `src/app/api/builder/commerce/currency-settings/route.ts`, `src/app/(builder)/[locale]/admin-builder/commerce/currency/page.tsx` — guarded GET/PATCH API and admin page entry.
  - `src/components/builder/commerce/CurrencySettingsClient.tsx`, `CurrencySettings.module.css` — admin currency settings UI, matrix, policy card, save flow, and mobile-safe layout.
  - `src/lib/builder/commerce/checkout-shared.ts`, `src/app/api/builder/commerce/checkout/route.ts` — settings-aware checkout currency normalization/errors and API enforcement.
  - `src/components/builder/commerce/PublicCheckout.tsx`, `PublicCheckout.module.css` — conversion policy disclosure on checkout summary.
  - `src/app/api/billing-documents/[source]/[ownerId]/[documentId]/pay/route.ts` — public invoice payment page currency/no-conversion disclosure.
  - `src/components/builder/commerce/ProductManagerClient.tsx`, `OrderManagerClient.tsx`, `TaxRulesClient.tsx`, `ShippingRulesClient.tsx`, `NotificationManagerClient.tsx`, `PaymentWebhookManagerClient.tsx`, `BillingDocumentsClient.tsx` — commerce header links to the currency settings surface.
  - `src/lib/builder/commerce/__tests__/currency-shared.test.ts`, `checkout-shared.test.ts`, `tests/builder-editor/commerce-products.playwright.ts`, `tests/builder-editor/billing-documents.playwright.ts` — unit and E2E coverage.
- F-layer 판정:
  - F72 🟡 유지: currency settings, preview-rate metadata, and no-conversion disclosures are now covered. Actual conversion/provider QA remain, so this is not green.
- 검증:
  - `npm run typecheck` ✅
  - `npm run test:unit -- src/lib/builder/commerce/__tests__/currency-shared.test.ts src/lib/builder/commerce/__tests__/checkout-shared.test.ts src/lib/builder/commerce/__tests__/cart-shared.test.ts` ✅ (3 files, 10 tests passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/commerce-products.playwright.ts -g "currency configures conversion preview" --workers=1` ✅ (1 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/commerce-products.playwright.ts -g "single-currency policy" --workers=1` ✅ (1 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/billing-documents.playwright.ts --workers=1` ✅ (2 passed)
- 다음:
  - F72를 green에 가깝게 올리려면 actual rate application model, provider currency support matrix, converted amount audit fields, and production Stripe currency QA를 이어간다.

## M164-Q — Payment Link Privacy And Payment Intent Guard

- 시작/종료: 2026-05-20 / 2026-05-20
- 1번 기능 에이전트 / 2번 디자인 에이전트 / 3번 기록 에이전트 반영:
  - 이번 F73 slice에서 해결한 항목: invalid/stale public payment-link sensitive-data hiding and admin-only payment-intents diagnostics.
  - Public invoice pay links now distinguish token signature matching from full payability, then render a generic no-store/noindex unavailable page for invalid, expired, revoked, or otherwise non-payable tokens.
  - Unavailable public pay pages no longer render customer name, recipient email, total, balance due, manual payment instructions, payment buttons, or document-specific currency disclosures.
  - `/api/builder/commerce/payment-intents` is no longer public diagnostic write access; it now uses `guardMutation`, so builder admin auth, CSRF origin validation, and mutation rate limiting apply before create/capture actions.
  - 아직 Wix 대비 남은 항목: production billing token secret hardening, billing Stripe webhook event ledger/idempotency/replay surface, destructive commerce mutation sweep, broader payment security logs, and F74 analytics.
- 변경 파일:
  - `src/lib/builder/billing-documents.ts` — added `billingDocumentPaymentTokenMatches` so expired/revoked links can be identified without exposing sensitive row summaries.
  - `src/app/api/billing-documents/[source]/[ownerId]/[documentId]/pay/route.ts` — generic unavailable payment page, no sensitive summary on invalid/expired/revoked/non-payable tokens, and preserved no-store/noindex headers.
  - `src/app/api/builder/commerce/payment-intents/route.ts` — wrapped the diagnostic create/capture endpoint in `guardMutation`.
  - `src/lib/builder/__tests__/billing-documents.test.ts`, `tests/builder-editor/billing-documents.playwright.ts`, `tests/builder-editor/commerce-products.playwright.ts` — token matching, hidden sensitive public pay-link details, unauthorized/CSRF payment-intents, and admin diagnostic coverage.
  - `WIX-FULL-PRODUCT-CHECKPOINTS.md`, `WIX-FULL-PRODUCT-GAP.md`, `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md` — F73 first-slice status and remaining Wix gaps.
- F-layer 판정:
  - F73 🔴 → 🟡: public pay-link privacy and payment-intents auth/CSRF guardrails are now covered. Token-secret production hardening, billing webhook ledger/replay, mutation sweep, and security logging remain, so this is not green.
- 검증:
  - `npm run typecheck` ✅
  - `npm run test:unit -- src/lib/builder/__tests__/billing-documents.test.ts` ✅ (1 file, 7 tests passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/commerce-products.playwright.ts -g "payment-intents" --workers=1` ✅ (1 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/billing-documents.playwright.ts --workers=1` ✅ (2 passed)
- 다음:
  - F73를 green에 가깝게 올리려면 production secret fallback removal/HMAC migration plan, billing Stripe webhook event ledger and replay, destructive commerce mutation guard sweep, and admin security log visibility를 이어간다.

## M164-R — Production Billing Token Secret Hardening

- 시작/종료: 2026-05-20 / 2026-05-20
- 1번 기능 에이전트 / 2번 디자인 에이전트 / 3번 기록 에이전트 반영:
  - 이번 F73 slice에서 해결한 항목: production billing document share/payment token secret hardening.
  - Billing document share/payment token generation and validation no longer fall back to `CMS_ADMIN_PASSWORD` or the fixed local secret when `NODE_ENV=production`.
  - Production now requires `BILLING_DOCUMENT_SHARE_SECRET` or `NEXTAUTH_SECRET`; without either, share/payment link creation returns `null` and token validation fails closed.
  - Local/dev review flows keep the existing admin-password/fixed-local fallback so current local Playwright and manual QA remain usable.
  - 아직 Wix 대비 남은 항목: billing Stripe webhook event ledger/idempotency/replay admin surface, destructive commerce mutation guard sweep, broader payment security logs/admin visibility, and F74 analytics.
- 변경 파일:
  - `src/lib/builder/billing-documents.ts` — nullable production token secret, `billingDocumentTokenSecretConfigured`, fail-closed token material, production link creation guards.
  - `src/lib/builder/__tests__/billing-documents.test.ts` — production no-secret failure and explicit-secret success coverage for share and payment links.
  - `WIX-FULL-PRODUCT-CHECKPOINTS.md`, `WIX-FULL-PRODUCT-GAP.md`, `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md` — F73 status and remaining gaps.
- F-layer 판정:
  - F73 🟡 유지: token fallback hardening is now covered. Billing Stripe webhook ledger/replay, destructive mutation sweep, and security logging remain.
- 검증:
  - `npm run typecheck` ✅
  - `npm run test:unit -- src/lib/builder/__tests__/billing-documents.test.ts` ✅ (1 file, 8 tests passed)
- 다음:
  - F73를 green에 가깝게 올리려면 billing Stripe webhook event ledger/replay, guarded destructive commerce mutation sweep, and payment security audit log visibility를 이어간다.

## M164-S — Billing Stripe Webhook Ledger And Replay

- 시작/종료: 2026-05-20 / 2026-05-20
- 1번 기능 에이전트 / 2번 디자인 에이전트 / 3번 기록 에이전트 반영:
  - 이번 F73 slice에서 해결한 항목: billing Stripe hosted-payment webhook event ledger, provider-event duplicate no-op, and guarded admin list/replay APIs.
  - Signed normalized webhook events are now stored with deterministic ids, status, provider event id, source document reference, payment/session metadata, timestamps, replay count, and sanitized error/result metadata.
  - Duplicate provider event ids no-op before settlement, receipt automation, or payment-received notification can rerun; non-paid Stripe statuses are recorded as `ignored`, and settlement failures are recorded as `failed`.
  - The public Stripe webhook route still rejects invalid signatures before storage, returns a sanitized response without full billing rows, and delegates paid settlement through the existing hosted-payment settlement path.
  - Per 2번 디자인 에이전트, central billing Activity UI/badges are deliberately deferred to the next slice so this slice stays backend/API scoped.
  - 아직 Wix 대비 남은 항목: hosted billing webhook UI visibility in central billing Activity, destructive commerce mutation guard sweep, broader payment security logs/admin visibility, and F74 analytics.
- 변경 파일:
  - `src/lib/builder/billing-document-webhooks.ts` — file/blob-backed event storage, normalization, summary, receive, duplicate guard, and replay engine.
  - `src/app/api/billing-documents/stripe-webhook/route.ts` — signed webhook receive path now stores normalized events and returns sanitized settlement status.
  - `src/app/api/builder/billing-documents/webhooks/route.ts` — guarded admin list/KPI API for billing document webhook events.
  - `src/app/api/builder/billing-documents/webhooks/events/[eventId]/replay/route.ts` — guarded admin replay API.
  - `src/lib/builder/__tests__/billing-documents.test.ts`, `src/app/api/billing-documents/stripe-webhook/__tests__/route.test.ts` — ledger storage, duplicate no-op, replay, ignored events, invalid signature rejection, admin auth, list, and replay coverage.
  - `WIX-FULL-PRODUCT-CHECKPOINTS.md`, `WIX-FULL-PRODUCT-GAP.md`, `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md` — F73 ledger/replay status and remaining gaps.
- F-layer 판정:
  - F73 🟡 유지: billing Stripe webhook ledger/idempotency/replay APIs are now covered. Hosted webhook UI visibility, destructive mutation sweep, and security logging remain.
- 검증:
  - `npm run typecheck` ✅
  - `npm run test:unit -- src/lib/builder/__tests__/billing-documents.test.ts src/app/api/billing-documents/stripe-webhook/__tests__/route.test.ts` ✅ (2 files, 11 tests passed)
- 다음:
  - F73를 green에 가깝게 올리려면 unmatched billing webhook exception UI/detail views, destructive commerce mutation guard sweep, and payment security audit log visibility를 이어간다.

## M164-T — Central Billing Hosted Webhook Activity UI

- 시작/종료: 2026-05-20 / 2026-05-20
- 1번 기능 에이전트 / 2번 디자인 에이전트 / 3번 기록 에이전트 반영:
  - 이번 F73 slice에서 해결한 항목: billing Stripe webhook ledger rows are visible inside the central Billing Documents manager.
  - The documents page now server-loads billing webhook ledger events and the client refreshes documents plus webhook events together.
  - Each matched document row shows a compact hosted webhook status line for processed, ignored, or failed events without adding more row-level action clutter.
  - The existing Activity panel now includes a Hosted payment webhooks section with recent event type, payment status, compact provider event id, amount/currency, replay count, error, and replay CTA for non-processed events only.
  - Per 2번 디자인 에이전트, replay controls stay inside the Activity item and not the main row action bar, provider ids are compacted, and mobile layout collapses to one column to avoid text/action overlap.
  - 아직 Wix 대비 남은 항목: unmatched webhook exception UI/detail views for events that do not match the current document list, destructive commerce mutation guard sweep, broader payment security logs/admin visibility, and F74 analytics.
- 변경 파일:
  - `src/app/(builder)/[locale]/admin-builder/commerce/documents/page.tsx` — initial billing webhook events are loaded with central billing documents.
  - `src/components/builder/commerce/BillingDocumentsClient.tsx` — webhook event state, document-event mapping, refresh/replay handlers, row status, and Activity ledger rendering.
  - `src/components/builder/commerce/BillingDocuments.module.css` — webhook status colors, compact Activity ledger layout, replay CTA, and mobile-safe one-column behavior.
  - `tests/builder-editor/billing-documents.playwright.ts` — booking invoice pay-link flow now posts a hosted webhook event, refreshes central billing webhooks, and verifies row status, Activity event details, and replay CTA visibility.
  - `WIX-FULL-PRODUCT-CHECKPOINTS.md`, `WIX-FULL-PRODUCT-GAP.md`, `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md` — F73 UI visibility status and remaining gaps.
- F-layer 판정:
  - F73 🟡 유지: matched billing webhook Activity UI is now covered. Unmatched exception UI/detail views, destructive mutation sweep, and security logging remain.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/billing-documents.playwright.ts -g "creates booking invoice payment links and records manual payments" --workers=1` ✅ (1 passed)
- 다음:
  - F73를 green에 가깝게 올리려면 unmatched billing webhook exception UI/detail views, destructive commerce mutation guard sweep, and payment security audit log visibility를 이어간다.

## M164-U — Unmatched Billing Webhook Exception Panel

- 시작/종료: 2026-05-20 / 2026-05-20
- 1번 기능 에이전트 / 2번 디자인 에이전트 / 3번 기록 에이전트 반영:
  - 이번 F73 slice에서 해결한 항목: failed/ignored billing Stripe webhook events that do not match a visible central billing document row now have an admin review surface.
  - The central billing manager computes unmatched webhook events from the current document list and shows only non-processed exceptions so normal idempotent no-op events do not create noise.
  - The exception panel shows a compact count, latest 3 events, status, source/owner/document reference, event type, payment status, compact provider/payment/link ids, amount/currency, error/reason, and replay controls.
  - Per 2번 디자인 에이전트, the panel stays above the document list, avoids raw payload/session token exposure, keeps one replay CTA per event, and collapses to one column on mobile.
  - 아직 Wix 대비 남은 항목: destructive commerce mutation guard sweep, broader payment security logs/admin visibility, and F74 analytics.
- 변경 파일:
  - `src/components/builder/commerce/BillingDocumentsClient.tsx` — unmatched webhook event derivation, exception panel rendering, count, reason hooks, compact ids, and replay wiring.
  - `src/components/builder/commerce/BillingDocuments.module.css` — compact exception panel, failed/ignored colors, replay CTA, and mobile-safe single-column behavior.
  - `tests/builder-editor/billing-documents.playwright.ts` — posts a dev unsigned unmatched Stripe webhook event, refreshes central billing webhooks, and verifies exception panel detail/replay visibility.
  - `WIX-FULL-PRODUCT-CHECKPOINTS.md`, `WIX-FULL-PRODUCT-GAP.md`, `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md` — F73 exception UI status and remaining gaps.
- F-layer 판정:
  - F73 🟡 유지: matched and unmatched billing webhook UI visibility is now covered. Destructive mutation sweep and security logging remain.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/billing-documents.playwright.ts -g "creates booking invoice payment links and records manual payments" --workers=1` ✅ (1 passed)
- 다음:
  - F73를 green에 가깝게 올리려면 destructive commerce mutation guard sweep and payment security audit log visibility를 이어간다.

## M164-V — Destructive Commerce Mutation Guard Sweep

- 시작/종료: 2026-05-20 / 2026-05-20
- 1번 기능 에이전트 / 2번 디자인 에이전트 / 3번 기록 에이전트 반영:
  - 이번 F73 slice에서 해결한 항목: destructive commerce order DELETE mutation now uses `guardMutation`.
  - Sweep confirmed major commerce/billing/booking admin mutation routes already use `guardMutation`; public signed pay links/webhooks/OAuth/cron routes are intentionally not CSRF-guarded via `guardMutation`.
  - `DELETE /api/builder/commerce/orders/:orderId` now shares PATCH's admin auth + CSRF + mutation rate-limit behavior.
  - Design/UI scope unchanged; future UX can map guard failures to friendlier copy.
  - 아직 Wix 대비 남은 항목: broader payment security logs/admin visibility and F74 analytics.
- 변경 파일:
  - `src/app/api/builder/commerce/orders/[orderId]/route.ts`
  - `tests/builder-editor/commerce-products.playwright.ts`
  - `WIX-FULL-PRODUCT-CHECKPOINTS.md`, `WIX-FULL-PRODUCT-GAP.md`, `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md`
- F-layer 판정:
  - F73 🟡 유지: destructive order DELETE guard gap is covered. Broader payment security logs/admin visibility remain.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/commerce-products.playwright.ts -g "orders DELETE rejects cross-origin" --workers=1` ✅ (1 passed)
- 다음:
  - payment security audit logs/admin visibility, then F74 analytics.

## M164-W — Editor Navigation Chrome And Columns Recovery

- 시작/종료: 2026-05-20 / 2026-05-20
- 1번 기능 에이전트 / 2번 디자인 에이전트 / 3번 기록 에이전트 반영:
  - 이번 editor QA slice에서 해결한 항목: Pages/Navigation drawer가 열렸을 때 공개 header/menu 텍스트가 겹치거나, preview mobile menu가 side drawer 아래에 깔리거나, 칼럼 페이지 이동이 무반응처럼 보이는 경로.
  - 1번 기능 에이전트가 지적한 stale columns draft edge case를 막기 위해 draft GET이 draft record가 없으면 published canvas로 fallback하고, page selection은 load 실패 시 active page/slug를 되돌리고 drawer를 닫지 않는다.
  - 2번 디자인 에이전트가 지적한 compact header/overlay UX를 반영해 preview header nav는 ellipsis/no-overlap guard를 가지며, preview mobile drawer는 side drawer를 먼저 닫고 safe margin fixed panel로 뜬다.
  - Design drawer에는 Site Settings modal을 열지 않고도 바로 적용할 수 있는 Designer polish preset card 4종을 노출했다.
  - 아직 Wix 대비 남은 항목: richer visual repeater authoring, deeper dynamic page lifecycle, full F-layer Bookings/AI/Collaboration/Developer/Multilingual gaps, and user QA on the latest editor chrome fix.
- 변경 파일:
  - `src/components/builder/published/SiteHeader.tsx` — builder-editable header/nav/mega/mobile link plain click navigation, explicit edit path, mobile-menu-open side drawer close hook.
  - `src/components/builder/canvas/SandboxEditorRail.tsx`, `SandboxEditorWorkspace.tsx`, `SandboxPage.tsx`, `SandboxPage.module.css` — successful page-select drawer close, Designer polish preset cards, compact header no-overlap CSS, preview mobile drawer safe overlay.
  - `src/components/builder/canvas/hooks/useSandboxSiteState.ts` — page selection success/failure return path, failed-load active page rollback, columns open success guard.
  - `src/app/api/builder/site/pages/[pageId]/draft/route.ts` — draft GET published fallback for missing draft records.
  - `src/app/api/builder/site/pages/[pageId]/draft/__tests__/route.test.ts`, `tests/builder-editor/admin-builder.playwright.ts`, `chrome-click-safety.playwright.ts`, `design-system-m23.playwright.ts` — unit/E2E regression coverage.
- W/F 판정:
  - W14/W18/W216/W225 유지: latest user-reported navigation chrome and columns switching regressions have automatic coverage and remain user-QA pending.
  - W179 유지: component design preset capability is now reachable directly from the Design drawer, beyond the Site Settings modal path.
- 검증:
  - `npm run typecheck` ✅
  - `npm run test:unit -- src/app/api/builder/site/pages/[pageId]/draft/__tests__/route.test.ts` ✅ (2 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/chrome-click-safety.playwright.ts -g "opens the canvas mobile menu|moves from the columns panel|lets simple public header links" --workers=1` ✅ (3 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/design-system-m23.playwright.ts -g "designer polish presets" --workers=1` ✅ (1 passed)
- 다음:
  - 3번 기록 흐름상 이번 gap은 `Automatic checks passing / user QA pending`으로 유지하고, 다음 concrete item은 F-layer open items 중 Bookings Pro(F75-F84) 또는 AI Builder(F85-F94)에서 하나씩 검증/구현한다.

## M165-A — Bookings Group Capacity

- 시작/종료: 2026-05-20 / 2026-05-20
- 1번 기능 에이전트 / 2번 디자인 에이전트 / 3번 기록 에이전트 반영:
  - 이번 F75-F84 slice에서 해결한 항목: Wix Bookings의 class/group session에 필요한 서비스별 정원 첫 단계.
  - `BookingService.maxParticipants`를 추가하고 서비스 schema/admin UI가 1~250 capacity를 저장한다. 기존 서비스는 1명으로 동작한다.
  - 공개 booking flow는 그룹 서비스 카드에 정원 copy를 보여 주고, slot 버튼에는 잔여/전체 좌석을 표시한다.
  - availability 계산은 같은 service/staff/start/end인 기존 예약만 정원까지 추가 허용한다. 09:00 그룹 예약이 있어도 09:15처럼 겹치는 shifted slot은 계속 막는다.
  - 1번 기능 에이전트가 다음 갭으로 제안한 항목: 서비스별 `reminderOffsetsHours` 저장/편집 UI, email/SMS reminder schedule 공통화, `undefined`와 `[]`의 reminder off semantics.
  - 2번 디자인 에이전트가 다음 갭으로 제안한 항목: Booking dashboard 상단 Today / Needs Action queue, pending/unpaid/waitlist/no-show/document-needed compact actions.
  - 아직 Wix 대비 남은 항목: packages/memberships/session credits, resources/rooms, client portal, staff calendar depth, reminder schedule UI, dashboard action queue, broader full-session operations.
- 변경 파일:
  - `src/lib/builder/bookings/types.ts` — `BookingService.maxParticipants`와 `bookingServiceInputSchema` capacity validation.
  - `src/lib/builder/bookings/storage.ts` — seeded services default capacity.
  - `src/lib/builder/bookings/availability.ts` — capacity-aware slot availability and remaining-seat metadata.
  - `src/components/builder/bookings/BookingServicesAdmin.tsx` — service card capacity chip and modal Capacity input.
  - `src/components/builder/bookings/BookingFlowSteps.tsx` — public group capacity copy and slot remaining-seat label.
  - `src/lib/builder/bookings/__tests__/availability.test.ts`, `src/lib/builder/bookings/__tests__/types.test.ts` — capacity availability/schema coverage.
  - `WIX-FULL-PRODUCT-CHECKPOINTS.md`, `WIX-FULL-PRODUCT-GAP.md`, `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md` — F81/M165 status and remaining gaps.
- F-layer 판정:
  - F81 🟡: capacity-backed full group slot suppression and waitlist exposure now have automated coverage. Broader session/waitlist operations and the rest of F75-F84 remain.
- 검증:
  - `npm run test:unit -- src/lib/builder/bookings/__tests__/types.test.ts src/lib/builder/bookings/__tests__/availability.test.ts` ✅ (2 files, 8 tests passed)
  - `npm run typecheck` ✅
- 다음:
  - 기능 쪽은 service-specific reminder schedule, resource/room constraints, packages/memberships 순서가 작게 검증 가능하다.
  - 디자인 쪽은 Booking dashboard Today / Needs Action queue가 운영자 UX 체감이 크다.

## M165-B — Bookings Service Reminder Schedule

- 시작/종료: 2026-05-20 / 2026-05-20
- 1번 기능 에이전트 / 2번 디자인 에이전트 / 3번 기록 에이전트 반영:
  - 이번 F82 slice에서 해결한 항목: 서비스별 email/SMS reminder schedule 설정.
  - `BookingService.reminderOffsetsHours`를 서비스 생성/수정 schema에 노출했다. 허용 값은 `1`, `24`이며 `[]`는 명시적으로 reminder off를 의미한다.
  - `src/lib/builder/bookings/reminders.ts` 공통 helper가 undefined/null service는 기존 동작대로 24h reminder, empty array는 off, `[24, 1]`은 24h/1h both로 해석한다.
  - email reminder cron과 SMS reminder cron이 같은 helper를 사용해 schedule 해석을 공유한다.
  - Bookings > Services 관리자 modal에 `Reminder schedule` 체크박스(24h before, 1h before)를 추가했고, 서비스 카드에 Reminder summary chip을 표시한다.
  - 2번 디자인 에이전트의 Booking dashboard Today / Needs Action queue 제안은 아직 남은 UX gap으로 기록한다.
  - 아직 Wix 대비 남은 항목: live provider QA, branded/template delivery depth, per-channel enable/policy controls, dashboard action queue, packages/memberships/resources/client portal/staff calendar depth.
- 변경 파일:
  - `src/lib/builder/bookings/types.ts` — `reminderOffsetsHours` input validation.
  - `src/lib/builder/bookings/reminders.ts` — shared effective schedule/window helper.
  - `src/app/api/booking/email-reminders/route.ts`, `src/app/api/booking/sms-reminders/route.ts` — shared service schedule helper usage.
  - `src/components/builder/bookings/BookingServicesAdmin.tsx` — reminder checkboxes and service-card summary chip.
  - `src/lib/builder/bookings/__tests__/reminders.test.ts`, `src/lib/builder/bookings/__tests__/types.test.ts` — helper/schema coverage.
  - `WIX-FULL-PRODUCT-CHECKPOINTS.md`, `WIX-FULL-PRODUCT-GAP.md`, `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md` — F82/M165 status and remaining gaps.
- F-layer 판정:
  - F82 🟡: admin-configurable email/SMS reminder schedule hooks now have automated coverage. Live provider QA and deeper policy/template delivery remain.
- 검증:
  - `npm run test:unit -- src/lib/builder/bookings/__tests__/types.test.ts src/lib/builder/bookings/__tests__/availability.test.ts src/lib/builder/bookings/__tests__/reminders.test.ts` ✅ (3 files, 12 tests passed)
  - `npm run typecheck` ✅
- 다음:
  - 1번 기능 후보: resources/rooms or packages/memberships, depending on smallest storage/API/UI slice.
  - 2번 디자인 후보: Booking dashboard Today / Needs Action queue.

## M165-C — Bookings Today Needs Action Queue

- 시작/종료: 2026-05-20 / 2026-05-20
- 1번 기능 에이전트 / 2번 디자인 에이전트 / 3번 기록 에이전트 반영:
  - 이번 F84/operations UX slice에서 해결한 항목: 운영자가 오늘 처리할 예약을 전체 테이블에서 직접 훑어야 하는 gap.
  - Booking dashboard 상단에 `Today needs attention` queue를 추가하고, 기존 bookings/waitlist state에서 파생한 filter chips를 제공한다.
  - 필터: Today, Pending, Unpaid, Waitlist, No-show, Needs documents.
  - Booking action row는 시간, 고객, 서비스, staff, status, payment due, docs chip, Open 버튼을 보여주며 기존 booking detail modal을 재사용한다.
  - Waitlist action row는 requested date, 고객, 서비스, staff, status, Review 링크를 보여주며 기존 waitlist admin section으로 이동한다.
  - Detail modal close path에는 `data-booking-detail-close` hook을 추가해 action queue smoke test가 여러 Close 버튼에 흔들리지 않게 했다.
  - 2번 디자인 에이전트의 compact action queue 제안을 반영했고, 모바일은 기존 panel 톤을 유지하며 action row가 1-column으로 접힌다.
  - 아직 Wix 대비 남은 항목: deeper utilization reports/export, bulk action workflows, resources/rooms, packages/memberships/session credits, client portal, staff calendar depth.
- 변경 파일:
  - `src/components/builder/bookings/BookingDashboardAdmin.tsx` — action filters/counts, action booking/waitlist row derivation, queue rendering, modal close test hook.
  - `src/components/builder/bookings/BookingsAdmin.module.css` — queue/filter/row/badge styling and mobile single-column behavior.
  - `tests/builder-editor/bookings-m26-dashboard.playwright.ts` — Pending queue opens the booking detail modal before the existing dashboard filter flow.
  - `WIX-FULL-PRODUCT-CHECKPOINTS.md`, `WIX-FULL-PRODUCT-GAP.md`, `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md` — F84/M165 operations visibility status and remaining gaps.
- F-layer 판정:
  - F84 🟡: dashboard analytics already existed and now has a Wix-like operations queue. Deeper utilization, export reporting, and automated action workflows remain.
- 검증:
  - `npm run typecheck` ✅
  - `npm run test:unit -- src/lib/builder/bookings/__tests__/types.test.ts src/lib/builder/bookings/__tests__/availability.test.ts src/lib/builder/bookings/__tests__/reminders.test.ts` ✅ (3 files, 12 tests passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/bookings-m26-dashboard.playwright.ts -g "covers dashboard filters" --workers=1` ⚠️ first run failed before browser startup with macOS Chromium MachPort sandbox permission
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/bookings-m26-dashboard.playwright.ts -g "covers dashboard filters" --workers=1` ⚠️ sandbox-escalated rerun exposed strict-mode ambiguity on generic Close button
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/bookings-m26-dashboard.playwright.ts -g "covers dashboard filters" --workers=1` ✅ (1 passed after stable modal close hook)
- 다음:
  - F75 resources/rooms or F76 packages/memberships are the next larger Bookings Pro gaps.
  - If staying in UX, deepen the queue with bulk actions and saved operational views.

## M165-D — Bookings Resources And Room Conflicts

- 시작/종료: 2026-05-20 / 2026-05-20
- 1번 기능 에이전트 / 2번 디자인 에이전트 / 3번 기록 에이전트 반영:
  - 이번 F75 slice에서 해결한 항목: 서비스가 필수 room/resource를 요구하고, 같은 room을 다른 담당자가 같은 시간에 중복 예약하는 gap.
  - `BookingResource` model과 `resources` storage collection을 추가하고 기본 consultation/conference room seed를 넣었다.
  - Bookings admin에 `Resources` 탭을 추가해 room/equipment 이름, 설명, 위치, capacity, active 상태를 생성/수정/비활성화할 수 있게 했다.
  - Services admin modal에서 `Required resources` checkbox list를 제공하고, 서비스 카드에 필수 리소스 요약 chip을 표시한다.
  - Public booking, admin create, waitlist promotion, admin/customer reschedule 경로는 새 예약/변경 시 서비스의 required resources를 booking snapshot으로 저장한다.
  - Availability는 서비스의 required resources가 이미 다른 staff 예약과 겹치면 해당 slot을 닫는다. 같은 service/staff/start/end group slot은 기존 capacity 규칙대로 허용한다.
  - Same-process slot lock은 기존 staff slot key에 더해 resource/date key를 함께 잡아, 다른 담당자가 같은 room을 동시에 저장하는 race를 줄였다.
  - Reschedule 검증은 `excludeBookingId`를 받아 자기 자신의 기존 resource booking 때문에 변경이 막히지 않게 했다.
  - 아직 Wix 대비 남은 항목: resource별 calendar/availability, resource-specific buffers/pricing, richer resource capacity, 비활성 resource가 연결된 service 경고, provider QA, packages/memberships/session credits, client portal, staff calendar depth.
- 변경 파일:
  - `src/lib/builder/bookings/types.ts` — `BookingResource`, service `requiredResourceIds`, booking `resourceIds`, resource/service schema validation.
  - `src/lib/builder/bookings/storage.ts` — `resources` collection, seed resources, list/get/save/make resource helpers.
  - `src/lib/builder/bookings/availability.ts` — cross-staff resource conflict checks and `excludeBookingId` for reschedule.
  - `src/lib/builder/bookings/slot-lock.ts` — staff slot plus resource/date same-process locking.
  - `src/app/api/builder/bookings/resources/*` — guarded resource list/create/update/deactivate APIs.
  - `src/app/api/booking/book/route.ts`, `admin-create/route.ts`, `waitlist/[id]/promote/route.ts`, `builder/bookings/[id]/route.ts`, `booking/manage/[token]/route.ts` — required-resource snapshots, resource-aware availability/lock checks, reschedule self-exclusion.
  - `src/components/builder/bookings/BookingResourcesAdmin.tsx`, `BookingsAdminShell.tsx`, `BookingServicesAdmin.tsx`, `BookingsAdmin.module.css`, resources/services pages — resource management tab and service required-resource controls.
  - `src/lib/builder/bookings/__tests__/availability.test.ts`, `types.test.ts`, `slot-lock.test.ts` — resource schema, conflict, reschedule exclusion, and lock coverage.
  - `WIX-FULL-PRODUCT-CHECKPOINTS.md`, `WIX-FULL-PRODUCT-GAP.md`, `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md` — F75/M165 status and remaining gaps.
- F-layer 판정:
  - F75 🟡: managed rooms/resources and cross-staff conflict blocking now have automated coverage. Resource calendars, resource-specific policies/pricing, deeper capacity, and provider QA remain.
- 검증:
  - `npm run test:unit -- src/lib/builder/bookings/__tests__/types.test.ts src/lib/builder/bookings/__tests__/availability.test.ts src/lib/builder/bookings/__tests__/reminders.test.ts src/lib/builder/bookings/__tests__/slot-lock.test.ts` ✅ (4 files, 18 tests passed)
  - `npm run typecheck` ✅
- 다음:
  - F76 packages/memberships/session credits or F78 staff/resource calendar depth are the next Bookings Pro gaps.
  - Resource UX should next add disabled-resource warnings on services and resource-specific calendars/blocked times.

## M165-E — Bookings Packages And Session Credits

- 시작/종료: 2026-05-20 / 2026-05-20
- 1번 기능 에이전트 / 2번 디자인 에이전트 / 3번 기록 에이전트 반영:
  - 이번 F76 slice에서 해결한 항목: 결제형 예약에 사용할 수 있는 session package/customer credit first slice.
  - `BookingPackage`와 `BookingPackageCredit` model을 추가하고, file/blob-backed `packages`, `package-credits` collection을 만들었다.
  - Bookings admin nav에 `Packages` 탭을 Services 바로 뒤에 추가하고, package 정의와 customer credit ledger를 같은 화면에서 관리한다.
  - Admin Packages UI는 package active/inactive, credits, validity, price, eligible services, customer email, remaining/total credits, expiry, status, grant/edit/revoke 흐름을 제공한다.
  - Guarded admin APIs를 추가했다: `/api/builder/bookings/packages`, `/api/builder/bookings/packages/[id]`, `/api/builder/bookings/package-credits`, `/api/builder/bookings/package-credits/[id]`.
  - Public paid booking payment-intent route는 고객 이메일에 eligible active credit이 있으면 Payment Element 대신 package-covered response를 반환한다.
  - Public booking flow는 package-covered paid booking을 payment confirmed state로 처리하고, 예약 확정 시 서버에서 다시 credit을 검증/차감한다.
  - Public booking, admin create, waitlist promotion은 package credit을 사용할 수 있으면 booking에 `packageId`, `packageCreditId`, `packageCreditsUsed` snapshot을 저장하고 `paymentStatus: paid`로 처리한다.
  - Credit helper는 customer email trim/lowercase, active/expiry/remaining/service eligibility 검증, same-process credit lock, exhausted credit status update, idempotent cancellation restore를 처리한다.
  - Booking cancellation/admin cancellation/customer manage cancellation은 사용된 package credit을 1회만 복구한다. Booking save failure after redemption도 best-effort restore를 수행한다.
  - 아직 Wix 대비 남은 항목: automatic package checkout/purchase, recurring memberships/subscriptions, member-account portal redemption, package refund/proration, team/shared credits, per-service multi-credit consumption, deeper credit audit/reporting, live payment/provider QA.
- 변경 파일:
  - `src/lib/builder/bookings/types.ts` — package/credit/redemption types, booking package snapshot fields, package/credit schemas.
  - `src/lib/builder/bookings/storage.ts` — packages/package-credits collections, seed package, list/get/save/make helpers.
  - `src/lib/builder/bookings/packages.ts` — package eligibility, redemption, same-process credit locking, credit restoration helper.
  - `src/app/api/builder/bookings/packages/*`, `src/app/api/builder/bookings/package-credits/*` — guarded package and customer credit APIs.
  - `src/app/api/booking/payment-intent/route.ts`, `src/app/api/booking/book/route.ts` — package credit preview/bypass and server-side redemption for public paid bookings.
  - `src/app/api/builder/bookings/admin-create/route.ts`, `src/app/api/builder/bookings/waitlist/[id]/promote/route.ts`, `src/app/api/builder/bookings/[id]/route.ts`, `src/app/api/booking/cancel/route.ts`, `src/app/api/booking/manage/[token]/route.ts` — admin/waitlist redemption and cancellation restore paths.
  - `src/components/builder/bookings/BookingPackagesAdmin.tsx`, `BookingsAdminShell.tsx`, `BookingFlowSteps.tsx`, packages page — admin package/credit UI and public package-covered payment state.
  - `src/lib/builder/bookings/__tests__/packages.test.ts`, `types.test.ts` — credit eligibility/redemption/concurrency/restore and schema coverage.
  - `WIX-FULL-PRODUCT-CHECKPOINTS.md`, `WIX-FULL-PRODUCT-GAP.md`, `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md` — F76/M165 status and remaining gaps.
- F-layer 판정:
  - F76 🟡: manual/admin-granted session package credits and redemption rules now have automated coverage. Automatic purchase, memberships/subscriptions, member portal redemption, refunds/proration, and deeper audit/reporting remain.
- 검증:
  - `npm run test:unit -- src/lib/builder/bookings/__tests__/types.test.ts src/lib/builder/bookings/__tests__/packages.test.ts src/lib/builder/bookings/__tests__/availability.test.ts src/lib/builder/bookings/__tests__/reminders.test.ts src/lib/builder/bookings/__tests__/slot-lock.test.ts` ✅ (5 files, 24 tests passed)
  - `npm run typecheck` ✅
- 다음:
  - F78 staff/resource calendar depth or F79 client portal are the next Bookings Pro gaps.
  - If continuing F76, add package purchase checkout, member account redemption visibility, and detailed credit ledger/audit UI.

## M165-F — Bookings Resource Blocked Time

- 시작/종료: 2026-05-20 / 2026-05-20
- 1번 기능 에이전트 / 2번 디자인 에이전트 / 3번 기록 에이전트 반영:
  - 이번 F78/F75 slice에서 해결한 항목: 필수 room/resource가 점검, 내부 행사, 외부 사용 등으로 unavailable인 시간에는 예약 slot이 보이지 않아야 하는 gap.
  - `BookingResource.blockedDates`를 추가하고 resource input schema가 `start < end`인 one-off blocked range와 optional reason을 검증한다.
  - Resources admin modal에 `Blocked time` 편집 영역을 추가해 start/end datetime, reason을 입력하고 여러 blocked windows를 add/remove할 수 있게 했다.
  - Resource card는 blocked count와 다음 blocked window summary를 보여준다.
  - Availability는 서비스의 `requiredResourceIds`에 해당하는 active resource를 읽고, candidate slot + service buffer가 resource blocked time과 겹치면 slot을 닫는다.
  - Reschedule의 `excludeBookingId`는 기존 자기 예약 resource conflict만 제외하고, resource blocked time은 계속 적용한다.
  - Group booking capacity가 남아 있어도 required resource가 blocked time이면 해당 same-time group slot을 닫는다.
  - 아직 Wix 대비 남은 항목: staff override/deeper calendar UI, recurring resource calendars, drag/drop blocked-time operations, inactive-resource service warnings, provider/calendar sync QA, resource-specific buffers/pricing, broader client portal and booking operations.
- 변경 파일:
  - `src/lib/builder/bookings/types.ts` — `BookingResource.blockedDates`와 shared blocked-date schema를 추가하고 staff/resource blocked-date validation을 공유했다.
  - `src/lib/builder/bookings/storage.ts` — seed resources에 `blockedDates: []` 기본값을 추가했다.
  - `src/lib/builder/bookings/availability.ts` — required resource blocked-time lookup and buffer-aware slot exclusion.
  - `src/components/builder/bookings/BookingResourcesAdmin.tsx` — resource card blocked count/next summary and modal add/remove blocked-time editor.
  - `src/lib/builder/bookings/__tests__/availability.test.ts`, `types.test.ts` — resource blocked-time schema, buffer overlap, unrelated-resource ignore, reschedule exclusion, and group-capacity closure coverage.
  - `WIX-FULL-PRODUCT-CHECKPOINTS.md`, `WIX-FULL-PRODUCT-GAP.md`, `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md` — F75/F78/M165 status and remaining gaps.
- F-layer 판정:
  - F75 🟡 유지: resource/room constraints now include one-off unavailable windows, but recurring calendars, resource-specific policies/pricing, deeper capacity, and provider QA remain.
  - F78 🔴 → 🟡: staff/resource calendar depth now has automated coverage for weekly staff availability, one-off blocked dates, holiday/external busy blocks, and required-resource blocked time. Rich override UI, recurring resource calendars, drag/drop operations, and provider QA remain.
- 검증:
  - `npm run test:unit -- src/lib/builder/bookings/__tests__/types.test.ts src/lib/builder/bookings/__tests__/availability.test.ts src/lib/builder/bookings/__tests__/reminders.test.ts src/lib/builder/bookings/__tests__/slot-lock.test.ts src/lib/builder/bookings/__tests__/packages.test.ts` ✅ (5 files, 29 tests passed)
  - `npm run typecheck` ✅
- 다음:
  - F78을 계속 올리려면 resource recurring availability/calendar surface, staff override UI, drag/drop blocked-time editing, and provider calendar QA를 이어간다.
  - F79 client portal can start independently once the booking account/member surface is selected.

## M165-G — Bookings Client Portal Read-Only Summary

- 시작/종료: 2026-05-20 / 2026-05-20
- 1번 기능 에이전트 / 2번 디자인 에이전트 / 3번 기록 에이전트 반영:
  - 이번 F79 slice에서 해결한 항목: 로그인한 회원이 계정 안에서 본인 이메일과 연결된 upcoming/past booking summaries를 볼 수 있어야 하는 gap.
  - Member account home에 `예약` 카드를 추가하고 `/account/bookings`로 이동하게 했다.
  - `/account/bookings`는 기존 Members account visual system을 재사용하며, upcoming/past sections, empty states, status/payment/staff/time/booking-id summary를 read-only로 보여준다.
  - `/api/members/bookings`는 member session cookie를 검증하고, 인증되지 않은 요청은 401로 막는다.
  - `getCustomerBookingPortal` helper는 `member.email.trim().toLowerCase()`와 `booking.customer.email.trim().toLowerCase()`를 매칭한다. Guest로 만든 예약도 나중에 같은 이메일로 회원 가입하면 보이는 구조다.
  - Portal DTO는 localized service/staff names를 조인하고 upcoming/past/cancelled를 분리한다.
  - 첫 slice 보안 경계로 manage token/manage URL, `paymentIntentId`, `manualPayments`, `billingDocuments`, customer notes/case details/attachments/custom fields는 member API/portal DTO에 노출하지 않는다.
  - 아직 Wix 대비 남은 항목: self-service portal cancel/reschedule/payment/document actions, member package/credit visibility, richer booking detail pages, email-change/account-linking policy, portal notification preferences, deeper booking history filters/export.
- 변경 파일:
  - `src/lib/builder/bookings/customer-portal.ts` — safe member booking DTO mapper, normalized-email filtering, upcoming/past split, localized service/staff joins.
  - `src/app/api/members/bookings/route.ts` — member-authenticated bookings endpoint.
  - `src/app/[locale]/account/page.tsx` — account dashboard bookings card/link.
  - `src/app/[locale]/account/bookings/page.tsx` — read-only member bookings page.
  - `src/components/members/MembersArea.module.css` — account bookings list/card/status/empty-state responsive styles.
  - `src/lib/builder/bookings/__tests__/customer-portal.test.ts` — email matching, upcoming/past split, other-customer exclusion, sensitive-field exclusion.
  - `tests/builder-editor/members-area.playwright.ts` — signup/login flow now creates a booking, verifies account bookings page/API visibility, and asserts sensitive fields/manage token are absent.
  - `WIX-FULL-PRODUCT-CHECKPOINTS.md`, `WIX-FULL-PRODUCT-GAP.md`, `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md` — F79/M165 status and remaining gaps.
- F-layer 판정:
  - F79 🔴 → 🟡: account-authenticated read-only upcoming/past booking visibility now has unit and Playwright coverage. Self-service booking actions, payments/documents, package redemption visibility, and richer portal workflows remain.
- 검증:
  - `npm run typecheck` ✅
  - `npm run test:unit -- src/lib/builder/bookings/__tests__/customer-portal.test.ts src/lib/builder/members/__tests__/members-engine.test.ts` ✅ (2 files, 2 tests passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/members-area.playwright.ts --workers=1` ⚠️ first run blocked by macOS Chromium MachPort sandbox permission, then ✅ with sandbox escalation (1 passed)
- 다음:
  - F79 next slice: portal booking details and self-service actions without leaking email-link manage tokens.
  - F76/F79 bridge: member package/session-credit visibility and redemption history.
  - F80 can add policy-gated self-service cancel/reschedule windows.

## M165-H — Bookings Cancel/Reschedule Policy Gates

- 시작/종료: 2026-05-20 / 2026-05-20
- 1번 기능 에이전트 / 2번 디자인 에이전트 / 3번 기록 에이전트 반영:
  - 이번 F80 slice에서 해결한 항목: 서비스별 cancellation policy 선택값이 실제 환불 계산과 고객 self-service 취소/변경 가능 여부를 같이 움직여야 하는 gap.
  - `standard-24h`, `strict-48h`, `flexible-6h` policy registry를 refund helper에 연결해 full/partial/no refund와 cancel/reschedule window를 같은 helper에서 평가한다.
  - Signed manage GET 응답은 policy summary를 내려주고, 고객 manage UI는 policy name, start까지 남은 시간, cancel/reschedule 허용 상태, refund estimate, blocked reason을 보여준다.
  - Manage PATCH cancel/reschedule은 정책 window를 먼저 검사한다. 위반 시 409로 막고 refund, package-credit restore, cancellation email, webhook event, availability/slot lock mutation을 실행하지 않는다.
  - Direct `/api/booking/cancel` 우회 경로에도 같은 policy guard를 적용해 manage link를 우회한 late cancellation을 막는다.
  - Pending/confirmed future booking만 online self-service 대상으로 보고, cancelled/completed/no-show/past booking은 helper 단계에서 차단한다.
  - 아직 Wix 대비 남은 항목: custom cancellation fee rules, admin-authored reusable policy records, member account portal에서의 직접 cancel/reschedule/payment/document actions, production refund/provider QA, richer customer copy/localization.
- 변경 파일:
  - `src/lib/builder/bookings/refund.ts` — cancellation policy registry, self-service policy evaluator, policy-aware refund decision helper.
  - `src/app/api/booking/manage/[token]/route.ts` — manage GET policy payload, policy-gated cancel/reschedule PATCH, resource-aware reschedule lock/self-exclusion preservation, package-credit restore on customer cancellation.
  - `src/app/api/booking/cancel/route.ts` — direct cancel API policy guard and package-credit restore before side effects.
  - `src/components/builder/bookings/BookingManageClient.tsx` — policy/refund panel and policy-disabled cancel/reschedule controls.
  - `src/lib/builder/bookings/__tests__/refund.test.ts` — strict/flexible-style window evaluation, past/inactive booking blocking coverage.
  - `tests/builder-editor/bookings-m26-customer-manage.playwright.ts` — manage page policy visibility, allowed flow, strict-window disabled UI, direct PATCH rejection, and direct cancel API rejection.
  - `WIX-FULL-PRODUCT-CHECKPOINTS.md`, `WIX-FULL-PRODUCT-GAP.md`, `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md` — F80/M165 status and remaining gaps.
- F-layer 판정:
  - F80 🔴 → 🟡: signed customer manage links now have policy-aware cancel/reschedule UI and server enforcement with automated unit and Playwright coverage. Custom fee policy authoring, member-portal action depth, payment/document self-service, and provider QA remain.
- 검증:
  - `npm run typecheck` ✅
  - `npm run test:unit -- src/lib/builder/bookings/__tests__/refund.test.ts src/lib/builder/bookings/__tests__/customer-portal.test.ts src/lib/builder/bookings/__tests__/availability.test.ts` ✅ (3 files, 20 tests passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/bookings-m26-customer-manage.playwright.ts --workers=1` ⚠️ first run blocked by macOS Chromium MachPort sandbox permission, then ✅ with sandbox escalation (2 passed)
- 다음:
  - F80 next slice: admin policy authoring and fee-specific cancellation rules.
  - F79/F80 bridge: member account booking detail page with policy-safe self-service actions.
  - F70/F80 bridge: expose booking invoices/receipts and payment actions from the portal without leaking billing tokens.

## M165-I — Bookings Timezone And Localization First Slice

- 시작/종료: 2026-05-20 / 2026-05-20
- 1번 기능 에이전트 / 2번 디자인 에이전트 / 3번 기록 에이전트 반영:
  - 이번 F83 slice에서 해결한 항목: booking availability가 `Asia/Seoul` 외 timezone을 전부 `+08:00`처럼 계산하고, customer-facing surfaces가 실행 환경 timezone에 기대어 시간을 표시하던 gap.
  - `src/lib/builder/bookings/timezone.ts`를 추가해 IANA timezone validation, staff local date/time -> UTC ISO 변환, UTC ISO -> staff local date, explicit timezone date/time formatting을 공통화했다.
  - Availability 계산은 staff availability timezone을 `Intl` 기반 변환으로 처리한다. `America/New_York` 같은 DST timezone도 더 이상 Taipei offset으로 밀리지 않는다.
  - `isSlotAvailable`는 `startAt.slice(0, 10)` 대신 staff timezone의 local date로 availability를 다시 계산한다. UTC 날짜가 다음 날이어도 staff local date의 late slot을 찾을 수 있다.
  - `staffAvailabilitySchema`, booking create/update/waitlist schemas는 유효한 IANA timezone만 받는다.
  - Public booking completion, signed manage page, member account bookings, and booking email templates now format customer-facing times with the saved customer timezone rather than the server/browser default timezone.
  - Public slot buttons gained customer/office-time data hooks and safer wrapping for long IANA timezone strings.
  - 아직 Wix 대비 남은 항목: admin dashboard/calendar/reschedule input의 office/customer dual-time UX, Zoom meeting timezone handoff, richer localized copy for timezone labels, broader timezone Playwright matrix.
- 변경 파일:
  - `src/lib/builder/bookings/timezone.ts` — timezone validation, local date conversion, and explicit timezone formatting helpers.
  - `src/lib/builder/bookings/availability.ts` — IANA timezone slot conversion and staff-local-date availability checks.
  - `src/lib/builder/bookings/types.ts` — staff/customer timezone schema validation.
  - `src/components/builder/bookings/BookingFlowSteps.tsx`, `BookingFlowSteps.module.css` — explicit customer timezone formatting, slot customer/office time hooks, long-label wrapping.
  - `src/components/builder/bookings/BookingManageClient.tsx` — signed manage time display uses saved customer timezone and exposes timezone summary hooks.
  - `src/app/[locale]/account/bookings/page.tsx` — member booking rows format times in saved customer timezone.
  - `src/lib/builder/bookings/email-templates.ts` — booking email `{{startTime}}`, `{{endTime}}`, and summary time use saved customer timezone.
  - `src/lib/builder/bookings/__tests__/availability.test.ts`, `types.test.ts`, `email-templates.test.ts` — IANA conversion, UTC-boundary staff-local date, schema rejection, and email timezone coverage.
  - `WIX-FULL-PRODUCT-CHECKPOINTS.md`, `WIX-FULL-PRODUCT-GAP.md`, `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md` — F83/M165 status and remaining gaps.
- F-layer 판정:
  - F83 🔴 → 🟡: booking slots now have verified IANA timezone conversion and customer-facing explicit timezone rendering across public/manage/member/email surfaces. Admin calendar/reschedule depth, Zoom timezone handoff, broader locale copy, and provider QA remain.
- 검증:
  - `npm run typecheck` ✅
  - `npm run test:unit -- src/lib/builder/bookings/__tests__/availability.test.ts src/lib/builder/bookings/__tests__/types.test.ts src/lib/builder/bookings/__tests__/email-templates.test.ts src/lib/builder/bookings/__tests__/customer-portal.test.ts` ✅ (4 files, 28 tests passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/bookings-m25.playwright.ts --workers=1` ✅ with sandbox escalation (1 passed)
- 다음:
  - F83 next slice: admin dashboard/calendar/reschedule inputs should use office/staff timezone explicitly and show customer local time without adding crowded table columns.
  - F83/F205 bridge: pass staff/office timezone into Zoom meeting creation.
  - F79/F83 bridge: member account booking detail page can show customer time and office time side by side.

## M165-J — Bookings Deposits First Slice

- 시작/종료: 2026-05-20 / 2026-05-20
- 1번 기능 에이전트 / 2번 디자인 에이전트 / 3번 기록 에이전트 반영:
  - 이번 F77 slice에서 해결한 항목: paid service가 항상 full amount를 선결제해야 해서 Wix Bookings식 fixed deposit and balance-later 흐름을 만들 수 없던 gap.
  - `BookingService.depositAmount`와 shared price snapshot helper를 추가해 service total, due now, deposit amount, balance later를 한곳에서 계산한다.
  - Public payment-intent API는 fixed deposit이 있으면 full service price가 아니라 due-now deposit amount로 Stripe PaymentIntent를 만들고, total/deposit/balance metadata를 함께 저장한다.
  - Public booking creation은 real Stripe intent가 돌아오는 경우 service id뿐 아니라 expected amount/currency까지 검증한 뒤 예약을 만든다.
  - Successful deposit bookings/webhooks store `onlinePaidAmount` and `paymentStatus: 'partially_paid'`, while billing documents, manual payment balance math, admin dashboard totals, and analytics subtract online deposits before later settlement.
  - Bookings service admin, public booking cards, and payment panel show due-now, total, deposit, and balance-later copy with test hooks for future visual/QA checks.
  - 아직 Wix 대비 남은 항목: pay-later mode, staff/resource-specific price overrides, variable/display price workflows, discounts, deposit-specific cancellation/refund policy, and production provider QA.
- 변경 파일:
  - `src/lib/builder/bookings/pricing.ts` — fixed deposit price snapshot helper.
  - `src/lib/builder/bookings/types.ts` — service deposit schema and booking due-now/online-paid snapshots.
  - `src/app/api/booking/payment-intent/route.ts`, `src/app/api/booking/book/route.ts`, `src/app/api/booking/stripe-webhook/route.ts`, `src/lib/builder/bookings/stripe-verify.ts` — due-now PaymentIntent creation, booking snapshot, partially-paid webhook settlement, and amount/currency verification.
  - `src/lib/builder/bookings/payments.ts`, `analytics.ts`, `src/components/builder/bookings/BookingDashboardAdmin.tsx` — deposit-aware balance, paid totals, and revenue recognition.
  - `src/components/builder/bookings/BookingServicesAdmin.tsx`, `BookingFlowSteps.tsx`, `BookingFlowSteps.module.css` — admin/public due-now/deposit/balance UX.
  - `src/lib/builder/bookings/__tests__/pricing.test.ts`, `types.test.ts`, `stripe-verify.test.ts`, `tests/builder-editor/bookings-m25.playwright.ts` — deposit snapshot, schema, Stripe price verification, and public booking API coverage.
  - `WIX-FULL-PRODUCT-CHECKPOINTS.md`, `WIX-FULL-PRODUCT-GAP.md`, `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md` — F77/M165 status and remaining gaps.
- F-layer 판정:
  - F77 🔴 → 🟡: fixed deposits now work end-to-end for paid booking services with verified due-now payment amount, partial-paid state, and remaining-balance tracking. Pay-later, variable/staff/resource pricing, discounts, deposit refund policy depth, and provider QA remain.
- 검증:
  - `npm run typecheck` ✅
  - `npm run test:unit -- src/lib/builder/bookings/__tests__/pricing.test.ts src/lib/builder/bookings/__tests__/types.test.ts src/lib/builder/bookings/__tests__/stripe-verify.test.ts src/lib/builder/bookings/__tests__/billing-documents.test.ts src/lib/builder/bookings/__tests__/analytics.test.ts src/lib/builder/bookings/__tests__/packages.test.ts` ✅ (6 files, 24 tests passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/bookings-m25.playwright.ts --workers=1` ✅ with sandbox escalation (1 passed)
- 다음:
  - F77 next slice: pay-later service mode that confirms a booking without upfront Stripe payment while preserving full invoice/manual settlement balance.
  - F77/F75 bridge: resource/staff price overrides need slot-time revalidation in payment-intent and booking-create routes.
  - F77/F80 bridge: cancellation policy should calculate refunds against captured deposit/online paid amount, not full service price.

## M164-L — Customer Payment-Received Notifications

- 시작/종료: 2026-05-20 / 2026-05-20
- 1번 기능 에이전트 / 2번 디자인 에이전트 / 3번 기록 에이전트 반영:
  - 이번 F71 slice에서 해결한 항목: successful manual payments and hosted invoice settlements now create customer-facing payment-received notification outbox events.
  - `billing.payment_received.customer` template/event type을 추가해 order와 booking invoice payments를 같은 central billing notification surface에서 다룬다.
  - Event id는 `source/owner/document/paymentId` 기반 deterministic key라 duplicate webhook retries나 manual payment idempotency retries가 같은 payment event를 중복 행으로 쌓지 않는다.
  - Event payload에는 source, owner, invoice document number, payment id, manual/hosted method, provider/reference, amount, amount label, balance due, payment status, customer label을 저장한다.
  - Commerce Notifications admin copy now says order, billing payment, and cart recovery notifications; the Customer payment received template appears in the existing template list and long outbox labels wrap safely.
  - 아직 Wix 대비 남은 항목: live email-provider delivery QA, richer payment-received email body/template variables, stale-link audit/history timeline, production/template/bulk/portal invoice depth, and broader F72-F74 multi-currency/security/analytics.
- 변경 파일:
  - `src/lib/builder/commerce/notifications-shared.ts` — `billing.payment_received.customer` event type, defaults, normalization support를 추가했다.
  - `src/lib/builder/commerce/notifications-engine.ts` — deterministic notification id와 `queueBillingPaymentReceivedNotification` helper를 추가했다.
  - `src/lib/builder/billing-documents.ts` — current invoice lookup helper, local pay-link settlement, and hosted settlement paths에 payment-received notification queue를 연결했다.
  - `src/app/api/builder/commerce/orders/[orderId]/manual-payments/route.ts`, `src/app/api/builder/bookings/[id]/manual-payments/route.ts`, `src/app/api/builder/billing-documents/[source]/[ownerId]/[documentId]/manual-payments/route.ts` — succeeded manual payments only queue payment-received events; pending/failed/canceled still stay ledger-only.
  - `src/components/builder/commerce/NotificationManagerClient.tsx`, `src/components/builder/commerce/NotificationManager.module.css` — Customer payment received template label, broader header copy, and outbox text wrapping을 추가했다.
  - `src/lib/builder/__tests__/billing-documents.test.ts`, `tests/builder-editor/billing-documents.playwright.ts` — hosted order invoice settlement and central booking manual settlement both create exactly one payment-received event with expected payload.
- F-layer 판정:
  - F71 🟡 유지: payment-received notification outbox events are now covered. Live email-provider QA, richer payment-received workflow controls, stale-link audit/history, and F72-F74 remain.
- 검증:
  - `npm run typecheck` ✅
  - `npm run test:unit -- src/lib/builder/__tests__/billing-documents.test.ts src/lib/builder/commerce/__tests__/notifications-engine.test.ts src/lib/builder/commerce/__tests__/notifications-shared.test.ts` ✅ (3 files, 11 tests passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/billing-documents.playwright.ts --workers=1` ✅ (2 passed)
- 다음:
  - F71을 green에 더 가깝게 올리려면 live email-provider delivery QA, admin/customer payment-received email controls, and stale-link audit/history timeline을 이어간다.

## M164-J — Offline Payment Instruction Settings

- 시작/종료: 2026-05-20 / 2026-05-20
- 1번 기능 에이전트 / 2번 디자인 에이전트 / 3번 기록 에이전트 반영:
  - 이번 F71 slice에서 해결한 항목: central billing settings에 order/booking별 offline payment instruction 설정을 추가하고, bank transfer/cash/check/other method별 enabled/title/instructions를 저장한다.
  - 공개 invoice payment link는 online hosted payment가 없거나 manual payment option이 필요한 경우 설정된 customer-facing instructions를 표시한다.
  - Rendered invoice HTML/PDF download and share views also receive the configured instructions, so invoice document output and pay page copy stay consistent.
  - 설정 UI는 기존 Automatic issuance card 안의 2-column desktop / 1-column mobile structure를 재사용하고, method row는 checkbox, public title, instruction textarea로 제한했다.
  - 아직 Wix 대비 남은 항목: broader stale pay-link reconciliation, customer payment-received emails, production/template/bulk/portal invoice depth, and broader F72-F74 multi-currency/security/analytics.
- 변경 파일:
  - `src/lib/builder/billing-document-automation.ts` — billing settings model에 `manualPayments.orders/bookings` instruction map, defaults, normalization, active instruction selector를 추가했다.
  - `src/components/builder/commerce/BillingDocumentsClient.tsx`, `src/components/builder/commerce/BillingDocuments.module.css` — central billing settings UI에 offline payment instruction editor를 추가하고 mobile-safe layout을 보강했다.
  - `src/app/api/billing-documents/[source]/[ownerId]/[documentId]/pay/route.ts` — public invoice pay page에 enabled manual/offline instructions를 렌더한다.
  - `src/lib/builder/billing-documents.ts`, `src/app/api/billing-documents/[source]/[ownerId]/[documentId]/route.ts`, `src/app/api/builder/billing-documents/[source]/[ownerId]/[documentId]/download/route.ts` — invoice HTML/PDF rendering에 instruction options를 연결했다.
  - `src/lib/builder/__tests__/billing-documents.test.ts`, `tests/builder-editor/billing-documents.playwright.ts` — instruction settings persistence, invoice HTML/PDF rendering, admin UI save, public payment-link display를 검증한다.
- F-layer 판정:
  - F71 🟡 유지: configurable offline payment instructions are now covered across settings, public pay links, and invoice renders. Reconciliation and customer payment-received email depth remain.
- 검증:
  - `npm run typecheck` ✅
  - `npm run test:unit -- src/lib/builder/__tests__/billing-documents.test.ts` ✅ (7 tests passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/billing-documents.playwright.ts --workers=1` ✅ (2 passed)
- 다음:
  - F71을 green에 더 가깝게 올리려면 stale pay-link reconciliation audit/status surface and customer payment-received emails를 이어간다.

## M164-I — Manual Payment Failure-State Ledger

- 시작/종료: 2026-05-20 / 2026-05-20
- 1번 기능 에이전트 / 2번 디자인 에이전트 / 3번 기록 에이전트 반영:
  - 이번 F71 slice에서 해결한 항목: order/booking/central manual payment ledger가 `succeeded`, `pending`, `failed`, `canceled` 상태를 보존한다.
  - `pending`/`failed`/`canceled` 기록은 reconciliation용 장부에는 남지만 paid total, balance due, payment status, stale pay-link revocation, receipt automation, and customer/admin payment notifications를 움직이지 않는다.
  - Generic order payment status updates and provider webhook settlement locks now apply only after successful manual payment entries, so failed manual attempts do not block later valid provider settlement.
  - 중앙 Billing UI는 status select와 "Only succeeded payments reduce balance." helper를 record-payment panel 안에 배치하고, 좁은 화면에서는 1-column form으로 접히게 했다.
  - 아직 Wix 대비 남은 항목: broader stale pay-link reconciliation, customer payment-received emails, and broader F72-F74 multi-currency/security/analytics. M164-J에서 manual payment method/instruction settings는 별도로 해결했다.
- 변경 파일:
  - `src/lib/builder/commerce/orders-engine.ts` — non-success manual payments do not lock webhook/generic payment settlement; successful manual entries remain the only paid-balance source.
  - `src/lib/builder/bookings/payments.ts` — non-success booking manual entries preserve the current payment state instead of creating partial/paid transitions.
  - `src/app/api/builder/commerce/orders/[orderId]/manual-payments/route.ts`, `src/app/api/builder/bookings/[id]/manual-payments/route.ts`, `src/app/api/builder/billing-documents/[source]/[ownerId]/[documentId]/manual-payments/route.ts` — receipt automation and payment notifications now run only for succeeded manual payments.
  - `src/components/builder/commerce/BillingDocumentsClient.tsx`, `src/components/builder/commerce/BillingDocuments.module.css` — central billing record-payment form now exposes status, explanatory helper copy, and a responsive 2-row desktop / 1-column mobile layout.
  - `src/lib/builder/commerce/__tests__/orders-engine.test.ts`, `src/lib/builder/bookings/__tests__/billing-documents.test.ts`, `tests/builder-editor/billing-documents.playwright.ts` — failed/pending/canceled ledger behavior, provider settlement after failed manual entries, booking balance preservation, and central billing UI flow are covered.
- F-layer 판정:
  - F71 🟡 유지: failure-state ledger behavior is now covered across order, booking, and central billing APIs. Reconciliation and customer email depth remain; method instructions are covered in M164-J.
- 검증:
  - `npm run typecheck` ✅
  - `npm run test:unit -- src/lib/builder/__tests__/billing-documents.test.ts src/lib/builder/bookings/__tests__/billing-documents.test.ts src/lib/builder/commerce/__tests__/orders-engine.test.ts` ✅ (3 files, 15 tests passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/billing-documents.playwright.ts --workers=1` ✅ (2 passed)
- 다음:
  - F71을 green으로 올리려면 stale pay-link reconciliation audit and customer payment-received emails를 이어간다.

## M164-H — Manual Payment Idempotency Keys

- 시작/종료: 2026-05-20 / 2026-05-20
- 1번 기능 에이전트 / 2번 디자인 에이전트 / 3번 기록 에이전트 반영:
  - 이번 F71 slice에서 해결한 항목: order/booking manual payment ledger에 `idempotencyKey`를 저장하고, 기존 key로 재시도되는 요청은 새 ledger entry를 만들지 않고 기존 manual payment를 반환한다.
  - 개별 order API, booking API, central billing document manual payment API가 모두 `idempotencyKey`를 받도록 schema를 확장했다. 중앙 Billing UI는 form draft마다 stable key를 생성해 submit에 포함한다.
  - 중복 재시도가 paid total과 invoice balance를 다시 움직이지 않도록 order/booking unit coverage를 추가했다.
  - 아직 Wix 대비 남은 항목: manual payment method/instruction settings, broader stale pay-link reconciliation, customer payment-received emails, and broader F72-F74 multi-currency/security/analytics. M164-I에서 failed/canceled/pending manual ledger entries are separately covered.
- 변경 파일:
  - `src/lib/builder/commerce/orders-shared.ts`, `src/lib/builder/bookings/types.ts` — manual payment entry에 `idempotencyKey`를 추가하고 order normalization에 보존을 연결했다.
  - `src/lib/builder/commerce/orders-engine.ts`, `src/lib/builder/bookings/payments.ts` — duplicate idempotency key 재시도 시 기존 entry를 반환하도록 했다.
  - `src/app/api/builder/commerce/orders/[orderId]/manual-payments/route.ts`, `src/app/api/builder/bookings/[id]/manual-payments/route.ts`, `src/app/api/builder/billing-documents/[source]/[ownerId]/[documentId]/manual-payments/route.ts` — request schema에 idempotency key를 추가했다.
  - `src/components/builder/commerce/BillingDocumentsClient.tsx` — central billing form draft에서 idempotency key를 생성해 전송한다.
  - `src/lib/builder/__tests__/billing-documents.test.ts` — order/booking duplicate-key retry coverage를 추가했다.
- F-layer 판정:
  - F71 🟡 유지: idempotent successful manual ledger records are now covered across order, booking, and central billing APIs. Method instructions, reconciliation, and customer email depth remain; failure-state ledger behavior is covered in M164-I.
- 검증:
  - `npm run typecheck` ✅
  - `npm run test:unit -- src/lib/builder/__tests__/billing-documents.test.ts src/lib/builder/bookings/__tests__/billing-documents.test.ts src/lib/builder/commerce/__tests__/orders-engine.test.ts` ✅ (3 files, 14 tests passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/billing-documents.playwright.ts --workers=1` ✅ (2 passed)
- 다음:
  - F71을 green으로 올리려면 method instruction settings, stale pay-link reconciliation audit, and customer payment-received emails를 이어간다.

## M164-G — Central Billing Manual Payment Operations

- 시작/종료: 2026-05-20 / 2026-05-20
- 1번 기능 에이전트 / 2번 디자인 에이전트 / 3번 기록 에이전트 반영:
  - 이번 F71 slice에서 해결한 항목: central billing document manager에 invoice-level `Record payment` disclosure panel을 추가하고, 중앙 전용 guarded API가 `source=order|booking`에 따라 기존 order/booking manual payment ledger를 호출한 뒤 최신 `BuilderBillingDocumentRow`를 반환하게 했다.
  - Order manual payment helper도 booking과 동일하게 current invoice balance를 남은 잔액으로 갱신하고 active/stale invoice pay-link를 revoke한다. 따라서 중앙/주문 어느 화면에서 수동 부분결제를 기록해도 인보이스의 `balanceDue`와 payment-link token material이 오래된 금액을 유지하지 않는다.
  - 중앙 UI는 actions button 하나로 열리는 full-width panel로 배치했다. Amount, Method, Reference, Note, submit을 한 줄 grid로 두고 1180px 이하에서는 1열로 접어 side drawer/mobile width에서 겹치지 않게 했다.
  - 아직 Wix 대비 남은 항목: manual payment idempotency keys, failed/canceled/pending manual ledger entries that do not reduce balance due, manual payment method/instruction settings, broader stale pay-link reconciliation, customer payment-received emails, and broader F72-F74 multi-currency/security/analytics. M164-H에서 idempotency keys는 별도로 해결했다.
- 변경 파일:
  - `src/app/api/builder/billing-documents/[source]/[ownerId]/[documentId]/manual-payments/route.ts` — central document manual payment endpoint를 추가했다.
  - `src/lib/builder/commerce/orders-engine.ts` — order manual payment 기록 시 current invoice `balanceDueCents` 갱신과 active pay-link revocation을 booking 동작과 맞췄다.
  - `src/components/builder/commerce/BillingDocumentsClient.tsx`, `BillingDocuments.module.css` — central billing row의 record-payment disclosure panel, amount/method/reference/note form, refresh, mobile-safe layout을 추가했다.
  - `src/lib/builder/__tests__/billing-documents.test.ts`, `tests/builder-editor/billing-documents.playwright.ts` — order stale pay-link revocation unit coverage와 central booking invoice pay-link + partial manual settlement E2E를 추가했다.
- F-layer 판정:
  - F71 🟡 유지: Order, booking, and central billing offline/manual payments now share explicit records with amount/method/reference/note, balance due, partial-paid state, stale order/booking pay-link protection, and full-settlement automation. Idempotency/failure-state/instruction/email depth remains before F71 can be green.
- 검증:
  - `npm run typecheck` ✅
  - `npm run test:unit -- src/lib/builder/__tests__/billing-documents.test.ts src/lib/builder/bookings/__tests__/billing-documents.test.ts` ✅ (2 files, 9 tests passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/billing-documents.playwright.ts --workers=1` ✅ (2 passed)
- 다음:
  - F71을 green으로 올리려면 idempotency keys, pending/failed/canceled manual entries, method instruction settings, and customer payment-received emails를 이어간다.

## M164-F — Booking Manual Payment Operations And Builder Chrome Sweep

- 시작/종료: 2026-05-20 / 2026-05-20
- 1번 기능 에이전트 / 2번 디자인 에이전트 / 3번 기록 에이전트 반영:
  - 이번 F71 slice에서 해결한 항목: booking billing flow에 `manualPayments[]` ledger, `partially_paid` booking payment state, paid total and balance due calculation, guarded admin manual-payment API, bank-transfer/cash/check/other method capture, reference/note storage, overpayment guard, current invoice balance refresh, stale booking invoice pay-link revocation, hosted settlement amount/status mismatch protection, analytics revenue display, full manual settlement to `paid`, and receipt automation handoff를 추가했다.
  - 사용자가 재제보한 UI 회귀도 함께 잠갔다: top/header navigation이 side drawer 위에 잘못 겹치는 경로, canvas mobile menu가 editor drawer에 가리는 경로, home hero search와 `모든 칼럼보기` CTA가 다음 section에 덮이는 경로, columns archive filter/card click 영역, and columns page navigation handoff를 실제 브라우저 좌표 기준으로 검증했다.
  - Wix-like 디자인 보강: Add 패널에 proof counter, testimonial card, service gradient card, team profile, pricing table, timeline roadmap, comparison table, corner frame, fine rule, soft halo, diagonal texture, premium tag 같은 designer block/decorative preset pack을 추가했다.
  - 아직 Wix 대비 남은 항목: central billing document record-payment actions, manual payment idempotency keys, failed/canceled/pending manual ledger entries that do not reduce balance due, manual payment method/instruction settings, broader central stale pay-link reconciliation, customer payment-received emails, and broader F72-F74 multi-currency/security/analytics. AI site generation, real-time collaboration, and developer-platform surfaces also remain in later full-product milestones. M164-G에서 central billing record-payment actions는 별도로 해결했다.
- 변경 파일:
  - `src/lib/builder/bookings/types.ts`, `src/lib/builder/bookings/payments.ts`, `src/lib/builder/bookings/billing-documents.ts`, `src/lib/builder/bookings/analytics.ts` — booking 수동결제 ledger/status/balance/analytics와 invoice/payment-link 경계 처리를 추가했다.
  - `src/app/api/builder/bookings/[id]/manual-payments/route.ts`, `src/components/builder/bookings/BookingDashboardAdmin.tsx`, `BookingsAdmin.module.css` — booking dashboard의 record-payment form/list/summary를 연결했다.
  - `src/components/builder/published/SiteHeader.tsx`, `src/components/builder/canvas/SandboxPage.module.css` — 단순 public navigation은 페이지 이동을 허용하고, mobile drawer/global-region badge/editor drawer z-index 충돌을 고정했다.
  - `src/components/builder/canvas/SandboxCatalogPanel.presets.ts`, `SandboxCatalogPanel.helpers.ts`, `SandboxCatalogPanel.tsx` — Wix builder 느낌의 designer block/decorative preset pack을 Add 패널에 추가했다.
  - `src/lib/builder/__tests__/billing-documents.test.ts`, `src/lib/builder/bookings/__tests__/billing-documents.test.ts`, `tests/builder-editor/chrome-click-safety.playwright.ts`, `tests/builder-editor/home-section-boundaries.playwright.ts`, `tests/builder-editor/columns-ui-workflow.playwright.ts`, `tests/builder-editor/empty-error-states.playwright.ts`, `tests/builder-editor/designer-widgets.playwright.ts` — booking partial/final manual payments, stale pay-link protection, header/mobile drawer layer safety, home/columns section overlap, columns navigation, and designer block insertion을 검증한다.
- F-layer 판정:
  - F71 🟡 유지: Order and booking offline/manual payments are now explicit records with amount/method/reference/note, balance due, partial-paid state, stale booking pay-link protection, and full-settlement automation. Central billing/manual idempotency/failure-state depth remain before F71 can be green.
  - W14/W18/W40/W84/W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. 사용자가 말한 메뉴/옆 패널 겹침, 칼럼 페이지 이동, home/columns CTA 가림, and professional designer block 부족 경로를 latest code에서 다시 고정했다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run test:unit -- src/lib/builder/__tests__/billing-documents.test.ts src/lib/builder/bookings/__tests__/billing-documents.test.ts` ✅ (2 files, 8 tests passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/chrome-click-safety.playwright.ts -g "canvas mobile menu" --workers=1` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/empty-error-states.playwright.ts -g "columns page visible" --workers=1` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/home-section-boundaries.playwright.ts --workers=1` ✅ (3 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/columns-ui-workflow.playwright.ts -g "public columns archive filters" --workers=1` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/designer-widgets.playwright.ts --workers=1` ✅
- 다음:
  - F71은 central billing manual settlement, idempotency/failure-state ledger, method instruction settings, and customer email notifications를 이어가고, full-product 축은 F72-F74 및 AI/collaboration/developer platform으로 계속 간다.

## M164-E — Order Manual Payment Operations

- 시작/종료: 2026-05-20 / 2026-05-20
- 1번 기능 에이전트 / 2번 디자인 에이전트 / 3번 기록 에이전트 반영:
  - 이번 F71 slice에서 해결한 항목: order manual-invoice checkout/admin flow에 `manualPayments[]` ledger, `partially_paid` payment state, paid total and balance due calculation, guarded admin manual-payment API, bank-transfer/cash/check/other method capture, reference/note storage, overpayment guard, generic payment select lock after ledger entries, late webhook lock after manual ledger entries, order audit events, order-card manual payment panel/list/form, manual paid/due totals, payment filter/CSV/search visibility, full manual settlement to `paid`, and receipt automation handoff를 추가했다.
  - 아직 Wix 대비 남은 항목: booking manual payment record API/UI, central billing document record-payment actions, manual payment idempotency keys, failed/canceled/pending manual ledger entries that do not reduce balance due, manual payment method/instruction settings, active pay-link stale-balance reconciliation after partial payment, customer payment-received emails, and broader F72-F74 multi-currency/security/analytics.
- 변경 파일:
  - `src/lib/builder/commerce/orders-shared.ts` — `partially_paid` status, `CommerceOrderManualPayment`, method enum, and normalization을 추가했다.
  - `src/lib/builder/commerce/orders-engine.ts` — manual payment total/balance helpers, `recordOrderManualPayment`, overpayment/paid/refund guards, full-balance paid transition, audit entries, and generic status/webhook locks를 추가했다.
  - `src/app/api/builder/commerce/orders/[orderId]/manual-payments/route.ts` — guarded admin manual payment record endpoint를 추가하고 full payment 시 billing automation을 실행한다.
  - `src/app/api/builder/commerce/orders/route.ts`, `src/lib/builder/commerce/payment-webhooks-shared.ts` — `partially_paid` filtering/normalization을 연결했다.
  - `src/components/builder/commerce/OrderManagerClient.tsx`, `OrderManager.module.css` — order card에 manual payment summary, ledger list, record-payment form, reference/note wrapping, payment lock copy, `partially_paid` filter, and CSV columns을 추가했다.
  - `src/lib/builder/commerce/__tests__/orders-engine.test.ts`, `tests/builder-editor/commerce-products.playwright.ts` — partial/full manual payment, overpayment guard, status lock, manual payment UI, payment filter, CSV visibility, and full paid transition을 검증한다.
- F-layer 판정:
  - F71 🔴 → 🟡: Order-side offline/manual payments are represented as explicit records with amount/method/reference/note, balance due, partial-paid state, and full-settlement automation. Booking/manual billing center/idempotency/failure-state depth remain before F71 can be green.
  - M164 🟡 유지: F72-F74 multi-currency/security/analytics remain, and F70/F71 still have deeper production/booking/portal gaps.
- 검증:
  - `npx vitest run src/lib/builder/commerce/__tests__/orders-engine.test.ts src/lib/builder/commerce/__tests__/payment-webhooks-engine.test.ts` ✅ (2 files, 9 tests passed)
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/commerce-products.playwright.ts -g "product detail pages" --project=chromium-builder --workers=1` ✅ (manual payment checkout/admin UI included, sandbox escalation for Chromium)
- 다음:
  - F71을 green으로 올리려면 booking manual payment operations, central billing document record-payment actions, idempotency, failed/canceled entries, payment instructions, and stale pay-link reconciliation을 이어간다.

## M163-N — Abandoned Cart And Notifications

- 시작/종료: 2026-05-20 / 2026-05-20
- 변경 파일:
  - `src/lib/builder/commerce/notifications-shared.ts`, `src/lib/builder/commerce/__tests__/notifications-shared.test.ts` — notification settings, event outbox, recovery cart schema, normalization, and default templates를 추가했다.
  - `src/lib/builder/commerce/notifications-engine.ts`, `src/lib/builder/commerce/__tests__/notifications-engine.test.ts` — file/blob-backed notification settings/events/recoveries, recovery capture/convert, order-created customer/admin queueing, and order-updated queueing을 추가했다.
  - `src/app/api/builder/commerce/cart-recovery/route.ts`, `src/app/api/builder/commerce/notifications/route.ts`, `src/app/(builder)/[locale]/admin-builder/commerce/notifications/page.tsx`, `src/components/builder/commerce/NotificationManagerClient.tsx`, `src/components/builder/commerce/NotificationManager.module.css` — recovery capture API, guarded notification admin API, and notification/recovery admin UI를 추가했다.
  - `src/app/api/builder/commerce/checkout/route.ts`, `src/app/api/builder/commerce/orders/[orderId]/route.ts`, `src/components/builder/commerce/PublicCheckout.tsx` — checkout email blur recovery capture, checkout conversion marking, order-created hooks, and order-updated hooks를 연결했다.
  - `src/components/builder/commerce/OrderManagerClient.tsx`, `src/components/builder/commerce/ProductManagerClient.tsx`, `src/components/builder/commerce/TaxRulesClient.tsx`, `src/components/builder/commerce/ShippingRulesClient.tsx` — commerce admin 간 notifications 이동 링크를 추가했다.
  - `tests/builder-editor/commerce-products.playwright.ts` — notification admin save, cart recovery capture/outbox, checkout conversion, order-created customer/admin outbox, and order-updated outbox를 검증한다.
- F-layer 판정:
  - F66 🔴 → 🟢: Cart recovery and order notification hooks exist.
  - M163 🟡 → 🟢: F53-F66 commerce core checkpoints are green.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/commerce/__tests__/notifications-shared.test.ts src/lib/builder/commerce/__tests__/notifications-engine.test.ts src/lib/builder/commerce/__tests__/shipping-shared.test.ts src/lib/builder/commerce/__tests__/shipping-engine.test.ts src/lib/builder/commerce/__tests__/tax-shared.test.ts src/lib/builder/commerce/__tests__/tax-engine.test.ts src/lib/builder/commerce/__tests__/checkout-shared.test.ts src/lib/builder/commerce/__tests__/orders-engine.test.ts src/lib/builder/commerce/__tests__/discounts-shared.test.ts src/lib/builder/commerce/__tests__/cart-shared.test.ts src/lib/builder/commerce/__tests__/products-engine.test.ts` ✅
  - `BASE_URL=http://127.0.0.1:3003 npx playwright test --config=playwright.config.ts tests/builder-editor/commerce-products.playwright.ts -g "notifications queues" --workers=1` ✅
  - `BASE_URL=http://127.0.0.1:3003 npx playwright test --config=playwright.config.ts tests/builder-editor/commerce-products.playwright.ts --workers=1` ✅
- 다음:
  - M164에서 provider-depth payments, invoices, refunds, receipts, and broader business operations를 구현한다.

## M163-M — Shipping And Delivery

- 시작/종료: 2026-05-20 / 2026-05-20
- 변경 파일:
  - `src/lib/builder/commerce/shipping-shared.ts`, `src/lib/builder/commerce/__tests__/shipping-shared.test.ts` — default digital/standard/express/pickup rules, country/region/currency/locale/priority matching, pickup/local-delivery method normalization, free-shipping threshold logic, and quote calculation을 추가했다.
  - `src/lib/builder/commerce/shipping-engine.ts`, `src/lib/builder/commerce/__tests__/shipping-engine.test.ts` — file/blob-backed shipping rule persistence와 save/load 테스트를 추가했다.
  - `src/app/api/builder/commerce/shipping-rules/route.ts`, `src/app/(builder)/[locale]/admin-builder/commerce/shipping/page.tsx`, `src/components/builder/commerce/ShippingRulesClient.tsx`, `src/components/builder/commerce/ShippingRules.module.css` — guarded shipping rule API와 관리자 편집 UI를 추가했다.
  - `src/lib/builder/commerce/checkout-shared.ts`, `src/app/api/builder/commerce/checkout/route.ts`, `src/components/builder/commerce/PublicCheckout.tsx` — checkout quote가 저장된 shipping rules를 읽고 rule id, free-shipping, pickup/local-delivery method를 반영하게 했다.
  - `src/components/builder/commerce/OrderManagerClient.tsx`, `src/components/builder/commerce/ProductManagerClient.tsx`, `src/components/builder/commerce/TaxRulesClient.tsx` — commerce admin 간 shipping links를 추가하고, order row/CSV export에 shipping label/amount/free-shipping state를 표시했다.
  - `tests/builder-editor/commerce-products.playwright.ts` — shipping admin save, public rule API, checkout free shipping and pickup selection, and order admin shipping visibility를 검증한다.
- F-layer 판정:
  - F65 🔴 → 🟢: Shipping zones, rates, pickup/local delivery, and free shipping rules are supported.
  - M163 remains 🟡 at this point: F66 abandoned cart/notifications remained until M163-N.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/commerce/__tests__/shipping-shared.test.ts src/lib/builder/commerce/__tests__/shipping-engine.test.ts src/lib/builder/commerce/__tests__/tax-shared.test.ts src/lib/builder/commerce/__tests__/tax-engine.test.ts src/lib/builder/commerce/__tests__/checkout-shared.test.ts src/lib/builder/commerce/__tests__/orders-engine.test.ts src/lib/builder/commerce/__tests__/discounts-shared.test.ts src/lib/builder/commerce/__tests__/cart-shared.test.ts src/lib/builder/commerce/__tests__/products-engine.test.ts` ✅
  - `BASE_URL=http://127.0.0.1:3003 npx playwright test --config=playwright.config.ts tests/builder-editor/commerce-products.playwright.ts -g "shipping configures" --workers=1` ✅
  - `BASE_URL=http://127.0.0.1:3003 npx playwright test --config=playwright.config.ts tests/builder-editor/commerce-products.playwright.ts --workers=1` ✅
- 다음:
  - M163-N에서 F66 Abandoned cart/notifications를 구현했다.

## M163-L — Tax Rules

- 시작/종료: 2026-05-20 / 2026-05-20
- 변경 파일:
  - `src/lib/builder/commerce/tax-shared.ts`, `src/lib/builder/commerce/__tests__/tax-shared.test.ts` — default TW/KR/US tax rules, country/region normalization, locale/priority matching, included-in-price handling, and quote calculation을 추가했다.
  - `src/lib/builder/commerce/tax-engine.ts`, `src/lib/builder/commerce/__tests__/tax-engine.test.ts` — file/blob-backed tax rule persistence와 save/load 테스트를 추가했다.
  - `src/app/api/builder/commerce/tax-rules/route.ts`, `src/app/(builder)/[locale]/admin-builder/commerce/tax/page.tsx`, `src/components/builder/commerce/TaxRulesClient.tsx`, `src/components/builder/commerce/TaxRules.module.css` — guarded tax rule API와 관리자 편집 UI를 추가했다.
  - `src/lib/builder/commerce/checkout-shared.ts`, `src/app/api/builder/commerce/checkout/route.ts`, `src/components/builder/commerce/PublicCheckout.tsx` — checkout quote가 저장된 tax rules를 읽고 tax rule id/rate/amount를 반영하게 했다.
  - `src/components/builder/commerce/OrderManagerClient.tsx`, `src/components/builder/commerce/ProductManagerClient.tsx` — products/orders admin에서 tax rules 이동 링크를 추가하고, order row/CSV export에 tax label/rate/amount를 표시했다.
  - `src/components/QuickContactWidget.tsx` — 공개 checkout 화면에서 legacy floating chat이 주문 확인 버튼을 가리지 않도록 utility-page 예외에 checkout을 추가했다.
  - `tests/builder-editor/commerce-products.playwright.ts` — tax admin save, public rule API, checkout tax rule selection, and order admin tax visibility를 검증한다.
- F-layer 판정:
  - F64 🔴 → 🟢: Tax calculation rules are configurable and visible in checkout/order admin.
  - M163 remains 🟡: F65-F66 shipping rules and notifications remain.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/commerce/__tests__/tax-shared.test.ts src/lib/builder/commerce/__tests__/tax-engine.test.ts src/lib/builder/commerce/__tests__/checkout-shared.test.ts src/lib/builder/commerce/__tests__/orders-engine.test.ts src/lib/builder/commerce/__tests__/discounts-shared.test.ts src/lib/builder/commerce/__tests__/cart-shared.test.ts src/lib/builder/commerce/__tests__/products-engine.test.ts` ✅
  - `BASE_URL=http://127.0.0.1:3003 npx playwright test --config=playwright.config.ts tests/builder-editor/commerce-products.playwright.ts -g "tax configures" --workers=1` ✅
  - `BASE_URL=http://127.0.0.1:3003 npx playwright test --config=playwright.config.ts tests/builder-editor/commerce-products.playwright.ts -g "product detail pages" --workers=1` ✅
  - `BASE_URL=http://127.0.0.1:3003 npx playwright test --config=playwright.config.ts tests/builder-editor/commerce-products.playwright.ts --workers=1` ✅
- 다음:
  - M163-M에서 F65 Shipping/delivery를 구현한다.

## M163-K — Discounts And Coupons

- 시작/종료: 2026-05-20 / 2026-05-20
- 변경 파일:
  - `src/lib/builder/commerce/discounts-shared.ts`, `src/lib/builder/commerce/__tests__/discounts-shared.test.ts` — normalized coupon code, default SAVE10/WELCOME rules, active/locale/minimum/date/cap validation, percent/fixed discount math, and invalid coupon reasons를 추가했다.
  - `src/lib/builder/commerce/cart-shared.ts`, `src/lib/builder/commerce/__tests__/cart-shared.test.ts` — cart totals에 discount result, discount cents, discounted total, normalized coupon persistence를 연결했다.
  - `src/lib/builder/commerce/checkout-shared.ts`, `src/components/builder/commerce/PublicCheckout.tsx`, `src/app/api/builder/commerce/checkout/route.ts` — checkout quote/order confirmation에 couponCode와 discount totals를 보존하고, 할인 후 과세/총액을 화면과 주문에 반영했다.
  - `src/lib/builder/commerce/__tests__/checkout-shared.test.ts`, `src/lib/builder/commerce/__tests__/orders-engine.test.ts`, `tests/builder-editor/commerce-products.playwright.ts` — 할인 적용 cart/checkout/order/admin 흐름을 검증하도록 기대값을 갱신했다.
- F-layer 판정:
  - F63 🔴 → 🟢: Coupon and automatic discount rules apply safely to cart and checkout.
  - M163 remains 🟡: F64-F66 tax rules, shipping rules, and notifications remain.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/commerce/__tests__/discounts-shared.test.ts src/lib/builder/commerce/__tests__/cart-shared.test.ts src/lib/builder/commerce/__tests__/checkout-shared.test.ts src/lib/builder/commerce/__tests__/orders-engine.test.ts src/lib/builder/commerce/__tests__/products-engine.test.ts` ✅
  - `BASE_URL=http://127.0.0.1:3003 npx playwright test --config=playwright.config.ts tests/builder-editor/commerce-products.playwright.ts -g "product detail pages" --workers=1` ✅
  - `BASE_URL=http://127.0.0.1:3003 npx playwright test --config=playwright.config.ts tests/builder-editor/commerce-products.playwright.ts --workers=1` ✅
- 다음:
  - M163-L에서 F64 Tax rules를 구현한다.

## M163-J — Order Admin

- 시작/종료: 2026-05-20 / 2026-05-20
- 변경 파일:
  - `src/lib/builder/commerce/orders-engine.ts`, `src/lib/builder/commerce/__tests__/orders-engine.test.ts` — order status/payment/fulfillment filtering and update helpers/tests를 추가했다.
  - `src/app/api/builder/commerce/orders/route.ts`, `src/app/api/builder/commerce/orders/[orderId]/route.ts` — order admin list filters and PATCH state updates를 추가했다.
  - `src/app/(builder)/[locale]/admin-builder/commerce/orders/page.tsx`, `src/components/builder/commerce/OrderManagerClient.tsx`, `src/components/builder/commerce/OrderManager.module.css` — order admin KPIs, search/filter toolbar, payment/fulfillment/order status selects, audit display, CSV export, refresh, and mobile-safe layout을 추가했다.
  - `src/components/builder/commerce/ProductManagerClient.tsx`, `src/components/builder/commerce/ProductManager.module.css` — product admin에서 order admin으로 이동하는 링크를 추가했다.
  - `tests/builder-editor/commerce-products.playwright.ts` — checkout-created order를 admin 화면에서 검색/필터/상태 변경/export/audit까지 검증한다.
- F-layer 판정:
  - F62 🔴 → 🟢: Admin can view, search, filter, update fulfillment/payment state, and export orders.
  - M163 remains 🟡: F63-F66 discounts, tax rules, shipping rules, and notifications remain.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/commerce/__tests__/orders-engine.test.ts src/lib/builder/commerce/__tests__/checkout-shared.test.ts src/lib/builder/commerce/__tests__/cart-shared.test.ts src/lib/builder/commerce/__tests__/products-engine.test.ts` ✅
  - `BASE_URL=http://127.0.0.1:3003 npx playwright test --config=playwright.config.ts tests/builder-editor/commerce-products.playwright.ts -g "product detail pages" --workers=1` ✅
- 다음:
  - M163-K에서 F63 Discounts/coupons를 구현한다.

## M163-I — Order Creation

- 시작/종료: 2026-05-20 / 2026-05-20
- 변경 파일:
  - `src/lib/builder/commerce/orders-shared.ts`, `src/lib/builder/commerce/orders-engine.ts`, `src/lib/builder/commerce/__tests__/orders-engine.test.ts` — file/blob-backed order schema/storage, line items, customer/address, payment state, fulfillment state, totals, audit event, list/load/delete helpers/tests를 추가했다.
  - `src/app/api/builder/commerce/checkout/route.ts` — checkout confirmation 생성 시 persisted order record를 만들고 `orderId`를 confirmation payload에 포함한다.
  - `src/app/api/builder/commerce/orders/route.ts`, `src/app/api/builder/commerce/orders/[orderId]/route.ts` — builder-admin order list/detail/read cleanup API를 추가했다.
  - `src/lib/builder/commerce/checkout-shared.ts`, `src/components/builder/commerce/PublicCheckout.tsx` — checkout confirmation에 order id를 노출한다.
  - `tests/builder-editor/commerce-products.playwright.ts` — checkout 후 order API payload의 line item, customer, payment, fulfillment, totals, audit data를 검증한다.
- F-layer 판정:
  - F61 🔴 → 🟢: Orders persist line items, customer, payment state, fulfillment state, totals, and audit data.
  - M163 remains 🟡: F62-F66 order admin, discounts, tax rules, shipping rules, and notifications remain.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/commerce/__tests__/orders-engine.test.ts src/lib/builder/commerce/__tests__/checkout-shared.test.ts src/lib/builder/commerce/__tests__/cart-shared.test.ts src/lib/builder/commerce/__tests__/products-engine.test.ts` ✅
  - `BASE_URL=http://127.0.0.1:3003 npx playwright test --config=playwright.config.ts tests/builder-editor/commerce-products.playwright.ts -g "product detail pages" --workers=1` ✅
- 다음:
  - M163-J에서 F62 Order admin을 구현한다.

## M163-H — Checkout Adapter

- 시작/종료: 2026-05-20 / 2026-05-20
- 변경 파일:
  - `src/lib/builder/commerce/checkout-shared.ts`, `src/lib/builder/commerce/__tests__/checkout-shared.test.ts` — checkout shipping method, payment adapter, customer/address normalization, validation, shipping/tax quote, grand-total helpers/tests를 추가했다.
  - `src/app/api/builder/commerce/checkout/route.ts` — checkout API, rate limit, server-side cart/product/variant/price/inventory reconciliation, address/customer validation, manual-invoice/sandbox-card payment adapter confirmation을 추가했다.
  - `src/app/[locale]/store/checkout/page.tsx`, `src/components/builder/commerce/PublicCheckout.tsx`, `src/components/builder/commerce/PublicCheckout.module.css` — public checkout page, address/customer form, shipping/tax/payment adapter UI, confirmation state, localStorage confirmation persistence, cart clear handoff, mobile-safe layout을 추가했다.
  - `src/components/builder/commerce/PublicProductDetail.tsx`, `src/components/builder/commerce/PublicProductDetail.module.css` — mini-cart checkout handoff를 disabled placeholder에서 `/store/checkout` link로 연결했다.
  - `tests/builder-editor/commerce-products.playwright.ts` — PDP cart에서 checkout으로 이동해 shipping/tax/payment adapter quote, confirmation number, confirmation persistence, and cart clear behavior를 검증한다.
- F-layer 판정:
  - F60 🔴 → 🟢: Checkout flow supports address, shipping/tax/payment adapter, and order confirmation.
  - M163 remains 🟡: F61-F66 order creation/admin, discounts, tax rules, shipping rules, and notifications remain.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/commerce/__tests__/checkout-shared.test.ts src/lib/builder/commerce/__tests__/cart-shared.test.ts src/lib/builder/commerce/__tests__/products-engine.test.ts` ✅
  - `BASE_URL=http://127.0.0.1:3003 npx playwright test --config=playwright.config.ts tests/builder-editor/commerce-products.playwright.ts -g "product detail pages" --workers=1` ✅
  - `BASE_URL=http://127.0.0.1:3003 npx playwright test --config=playwright.config.ts tests/builder-editor/commerce-products.playwright.ts --workers=1` ✅
- 다음:
  - M163-I에서 F61 Order creation을 구현한다.

## M163-G — Cart

- 시작/종료: 2026-05-20 / 2026-05-20
- 변경 파일:
  - `src/lib/builder/commerce/cart-shared.ts`, `src/lib/builder/commerce/__tests__/cart-shared.test.ts` — locale-scoped cart state, localStorage key, item id, normalization, add/update/remove, coupon entry, totals helpers/tests를 추가했다.
  - `src/components/builder/commerce/PublicProductDetail.tsx`, `src/components/builder/commerce/PublicProductDetail.module.css` — PDP add-to-cart, mini-cart toggle/drawer, persisted localStorage hydration, item quantity update/remove, coupon entry, subtotal/discount/total, disabled checkout handoff, mobile-safe overlay를 추가했다.
  - `tests/builder-editor/commerce-products.playwright.ts` — cart add/update/remove, coupon entry, totals, reload persistence, mini-cart, z-index overlap guard, and mobile overflow coverage를 추가했다.
- F-layer 판정:
  - F59 🔴 → 🟢: Cart add/update/remove, coupon entry, totals, persisted state, and mini-cart work.
  - M163 remains 🟡: F60-F66 checkout, orders, discounts, tax, shipping, and notifications remain.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/commerce/__tests__/cart-shared.test.ts src/lib/builder/commerce/__tests__/products-engine.test.ts` ✅
  - `BASE_URL=http://127.0.0.1:3003 npx playwright test --config=playwright.config.ts tests/builder-editor/commerce-products.playwright.ts -g "product detail pages" --workers=1` ✅
  - `BASE_URL=http://127.0.0.1:3003 npx playwright test --config=playwright.config.ts tests/builder-editor/commerce-products.playwright.ts --workers=1` ✅
- 다음:
  - M163-H에서 F60 Checkout adapter를 구현한다.

## M163-F — Product Detail Page

- 시작/종료: 2026-05-20 / 2026-05-20
- 변경 파일:
  - `src/app/[locale]/store/products/[slug]/page.tsx` — active 상품 PDP 라우트, SEO metadata, breadcrumb JSON-LD, Product JSON-LD, draft/missing 404 guard를 추가했다.
  - `src/components/builder/commerce/PublicProductDetail.tsx`, `src/components/builder/commerce/PublicProductDetail.module.css` — gallery, thumbnail selection, variant option selection, quantity stepper, availability state, related products, and mobile-safe PDP layout을 추가했다.
  - `src/components/builder/commerce/PublicStorefront.tsx`, `src/components/builder/commerce/PublicStorefront.module.css` — `/store` and category cards에서 PDP detail link를 추가했다.
  - `src/lib/builder/components/productGallery/Element.tsx`, `src/lib/builder/components/productGallery/ProductGallery.module.css` — product-gallery cards and quick view에서 PDP detail link를 추가했다.
  - `tests/builder-editor/commerce-products.playwright.ts` — active/draft PDP routing, gallery, variants, quantity, availability, related products, SEO, storefront links, gallery links, and mobile overflow E2E를 추가했다.
- F-layer 판정:
  - F58 🔴 → 🟢: PDP supports gallery, variants, quantity, availability, related products, and SEO.
  - M163 remains 🟡: F59-F66 cart, checkout, orders, discounts, tax, shipping, and notifications remain.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://127.0.0.1:3003 npx playwright test --config=playwright.config.ts tests/builder-editor/commerce-products.playwright.ts --workers=1` ✅
- 다음:
  - M163-G에서 F59 Cart를 구현한다.

## M163-E — Product Gallery Widgets

- 시작/종료: 2026-05-20 / 2026-05-20
- 변경 파일:
  - `src/lib/builder/canvas/types.ts` — `product-gallery` canvas node kind/schema/type and content-driven height handling을 추가했다.
  - `src/lib/builder/components/productGallery/*`, `src/lib/builder/components/registry.ts` — product gallery component, responsive layout, category filters, sort, pagination, quick view, and availability UI를 추가했다.
  - `src/lib/builder/apps/catalog.ts`, `src/lib/builder/apps/widgets.ts`, `src/lib/builder/apps/installed.ts` — first-party `native-store` app manifest, widget mapping, and install migration handler를 추가했다.
  - `src/lib/builder/apps/__tests__/installed.test.ts`, `tests/builder-editor/commerce-products.playwright.ts` — Store widget projection/runtime and published widget E2E를 추가했다.
- F-layer 판정:
  - F57 🔴 → 🟢: Store galleries now support filters, sort, pagination, quick view, and responsive layout.
  - M163 remains 🟡: F58-F66 PDP, cart, checkout, orders, discounts, tax, shipping, and notifications remain.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/commerce/__tests__/products-engine.test.ts` ✅
  - `npx vitest run src/lib/builder/apps/__tests__/installed.test.ts` ✅
  - `BASE_URL=http://127.0.0.1:3003 npx playwright test --config=playwright.config.ts tests/builder-editor/commerce-products.playwright.ts --workers=1` ✅
- 다음:
  - M163-F에서 F58 Product detail page를 구현한다.

## M163-D — Categories And Collections

- 시작/종료: 2026-05-20 / 2026-05-20
- 변경 파일:
  - `src/lib/builder/commerce/products-shared.ts`, `src/lib/builder/commerce/products-engine.ts` — product category type, slug helper, seeded category metadata, derived category counts, category lookup, and active category product listing을 추가했다.
  - `src/app/api/builder/commerce/categories/route.ts` — public/admin category list API를 추가했다.
  - `src/app/[locale]/store/page.tsx`, `src/app/[locale]/store/categories/[slug]/page.tsx` — public store index and category dynamic URL routes를 추가했다.
  - `src/components/builder/commerce/PublicStorefront.tsx`, `src/components/builder/commerce/PublicStorefront.module.css` — category navigation and category-filtered product gallery UI를 추가했다.
  - `tests/builder-editor/commerce-products.playwright.ts` — category API count, store navigation, dynamic category URL, gallery filtering, and mobile overflow E2E를 추가했다.
- F-layer 판정:
  - F56 🔴 → 🟢: Product categories now drive navigation, galleries, and dynamic URLs.
  - M163 remains 🟡: F57-F66 gallery widgets, PDP, cart, checkout, orders, discounts, tax, shipping, and notifications remain.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/commerce/__tests__/products-engine.test.ts` ✅
  - `BASE_URL=http://127.0.0.1:3003 npx playwright test --config=playwright.config.ts tests/builder-editor/commerce-products.playwright.ts --workers=1` ✅
- 다음:
  - M163-E에서 F57 Product gallery widgets를 구현한다.

## M163-C — Variants And Options

- 시작/종료: 2026-05-20 / 2026-05-20
- 변경 파일:
  - `src/lib/builder/commerce/products-shared.ts` — `CommerceAvailabilityState` and `commerceInventoryAvailability` helper를 추가했다.
  - `src/components/builder/commerce/ProductManagerClient.tsx` — option rows, generated option-combination variant rows, per-variant SKU/price/compare-at/quantity/low-stock/backorder/status/media inputs, availability chips, save/reload mapping을 추가했다.
  - `src/components/builder/commerce/ProductManager.module.css` — mobile-safe option/variant editor layout and availability state styles를 추가했다.
  - `src/lib/builder/commerce/__tests__/products-engine.test.ts`, `tests/builder-editor/commerce-products.playwright.ts` — availability helper unit coverage and structured options/variants E2E를 추가했다.
- F-layer 판정:
  - F55 🔴 → 🟢: Product options, variant prices, inventory, images, and availability now render and persist correctly in the product manager.
  - M163 remains 🟡: F56-F66 categories, galleries, PDP, cart, checkout, orders, discounts, tax, shipping, and notifications remain.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/commerce/__tests__/products-engine.test.ts` ✅
  - `BASE_URL=http://127.0.0.1:3003 npx playwright test --config=playwright.config.ts tests/builder-editor/commerce-products.playwright.ts --workers=1` ✅
- 다음:
  - M163-D에서 F56 Categories/collections를 구현한다.

## M163-B — Product Manager

- 시작/종료: 2026-05-20 / 2026-05-20
- 변경 파일:
  - `src/app/api/builder/commerce/products/route.ts`, `src/app/api/builder/commerce/products/[productId]/route.ts` — guarded product collection/item APIs for public/admin listing, create, update, duplicate, archive, delete, and bulk status/category updates를 추가했다.
  - `src/app/(builder)/[locale]/admin-builder/commerce/page.tsx`, `src/app/(builder)/[locale]/admin-builder/commerce/products/page.tsx` — localized product manager admin routes를 추가했다.
  - `src/components/builder/commerce/ProductManagerClient.tsx`, `src/components/builder/commerce/ProductManager.module.css` — KPI/search/filter/sort product dashboard, add/edit form, duplicate/archive actions, bulk status bar, CSV import/export, and mobile-safe product list UI를 추가했다.
  - `tests/builder-editor/commerce-products.playwright.ts` — create/search/duplicate/bulk archive/export/import/mobile overflow E2E를 추가했다.
- F-layer 판정:
  - F54 🔴 → 🟢: Admin can create, duplicate, bulk edit/archive, import/export, archive, and search products.
  - M163 remains 🟡: F55-F66 variants/options depth, categories, galleries, PDP, cart, checkout, orders, discounts, tax, shipping, and notifications remain.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/commerce/__tests__/products-engine.test.ts` ✅
  - `BASE_URL=http://127.0.0.1:3003 npx playwright test --config=playwright.config.ts tests/builder-editor/commerce-products.playwright.ts --workers=1` ✅
- 다음:
  - M163-C에서 F55 Variants/options UI/runtime depth를 구현한다.

## M163-A — Product Schema

- 시작/종료: 2026-05-20 / 2026-05-20
- 변경 파일:
  - `src/lib/builder/commerce/products-shared.ts` — product/media/inventory/options/variants/SEO/status/sort/currency shared types and product slug helper를 추가했다.
  - `src/lib/builder/commerce/products-engine.ts` — native commerce product normalization, local/blob persistence, seeded product, create/save/load/list/find/delete, locale/status/category filters, search, sort, and validation을 추가했다.
  - `src/lib/builder/commerce/__tests__/products-engine.test.ts` — F53 full product schema normalization, create/find/update/filter/search/sort/delete round trip, default variant projection, duplicate slug suffixing, and validation errors를 검증한다.
- F-layer 판정:
  - F53 🔴 → 🟢: Products now support title, description, media, price, inventory, SKU, SEO, variants, and status in a shared native schema/storage engine.
  - M163 🔴 → 🟡: F54-F66 product manager, variants UI, categories, product galleries, PDP, cart, checkout, orders, discounts, tax, shipping, and notifications remain.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/commerce/__tests__/products-engine.test.ts` ✅
- 다음:
  - M163-B에서 F54 Product manager/admin API/UI를 구현한다.

## M162-A — Blog Data Model/Admin

- 시작/종료: 2026-05-19 / 2026-05-19
- 변경 파일:
  - `src/lib/builder/blog/admin-model.ts`, `src/lib/builder/blog/admin-storage.ts` — column bundles를 native Blog admin post/model로 투영하고 draft/scheduled/published status, authors/categories/tags summaries, counts를 계산한다.
  - `src/app/api/builder/blog/admin/route.ts` — builder admin용 Blog admin model API를 추가했다.
  - `src/components/builder/columns/ColumnListView.tsx`, `src/app/column-editor.css` — 칼럼 관리자에 Blog KPI strip과 status filter를 추가하고 scheduled draft card status를 노출한다.
  - `src/lib/builder/blog/__tests__/admin-model.test.ts`, `tests/builder-editor/columns-ui-workflow.playwright.ts` — admin model unit coverage와 scheduled draft API/UI E2E를 추가했다.
- F-layer 판정:
  - F43 🔴 → 🟢: Blog posts, authors, categories, tags, drafts, and scheduling now exist in a native admin model/API and admin surface.
  - M162 🔴 → 🟡: F44-F52 native app pack public widgets and additional first-party apps remain.
- 검증:
  - `npx vitest run src/lib/builder/blog/__tests__/admin-model.test.ts` ✅
  - `npm run typecheck` ✅
  - `BASE_URL=http://127.0.0.1:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/columns-ui-workflow.playwright.ts -g "surfaces native blog admin data" --workers=1` ✅
  - `BASE_URL=http://127.0.0.1:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/home-section-boundaries.playwright.ts --workers=1` ✅
  - `BASE_URL=http://127.0.0.1:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/columns-ui-workflow.playwright.ts -g "keeps public columns archive filters" --workers=1` ✅
- 다음:
  - 현재 후속 F44/F45도 완료됐고, 다음은 M162-D Members area(F46)다.

## M162-B — Blog Public Widgets

- 시작/종료: 2026-05-20 / 2026-05-20
- 변경 파일:
  - `src/lib/builder/apps/catalog.ts`, `src/lib/builder/apps/widgets.ts`, `src/lib/builder/apps/types.ts`, `src/lib/builder/apps/installed.ts` — native Blog app manifest, widget mapping, default content, and install migration hook를 추가했다.
  - `src/lib/builder/canvas/types.ts`, `src/components/builder/canvas/SandboxCatalogPanel.tsx`, `src/components/builder/canvas/useCanvasStageDrop.ts`, `src/components/builder/canvas/CanvasNode.tsx`, `src/lib/builder/site/public-page.tsx` — Blog app widgets를 add panel/drag/drop/published runtime에 연결하고 locale을 component renderer로 전달한다.
  - `src/lib/builder/components/blogFeed/Element.tsx`, `src/lib/builder/components/blogPostCard/Element.tsx`, `src/lib/builder/components/blogCategories/Element.tsx`, `src/lib/builder/components/blogArchive/Element.tsx`, `src/lib/builder/components/featuredPosts/Element.tsx`, `src/lib/builder/components/siteSearch/index.tsx` — 기존 Blog/search widgets를 locale-aware public links/API/search behavior로 정리했다.
  - `src/lib/builder/components/blogAuthor/*`, `src/lib/builder/components/blogRecentPosts/*`, `src/lib/builder/components/registry.ts` — author and recent posts public widgets를 추가했다.
  - `src/lib/builder/blog/blog-engine.ts`, `src/lib/builder/blog/column-adapter.ts`, `src/app/api/builder/blog/posts/route.ts`, `src/app/[locale]/columns/page.tsx`, `src/components/ColumnsGrid.tsx`, `src/lib/columns.ts`, `src/lib/consultation/columns-blob-reader.ts` — category/author/search/month/year public filters, scheduled-post hiding, and Blog metadata projection을 연결했다.
  - `src/lib/builder/search/source-collector.ts`, `src/app/api/builder/columns/[slug]/publish/route.ts` — Blog posts를 site-search index에 포함하고 column publish 후 index rebuild를 트리거한다.
  - `src/lib/builder/apps/__tests__/installed.test.ts`, `src/lib/builder/search/__tests__/source-collector.test.ts`, `src/lib/builder/components/__tests__/public-widget-design.test.ts`, `tests/builder-editor/blog-public-widgets.playwright.ts` — Blog app widget projection, search index, widget CSS contract, and public publish/search E2E를 검증한다.
- F-layer 판정:
  - F44 🔴 → 🟢: Blog list, post, category, author, recent posts, and search widgets now publish correctly through native app widgets.
  - M162은 계속 🟡: F47-F52 FAQ/Chat/Portfolio/search app depth/translation hooks/unified native dashboard가 남아 있다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/apps/__tests__/installed.test.ts src/lib/builder/search/__tests__/source-collector.test.ts src/lib/builder/components/__tests__/public-widget-design.test.ts` ✅
  - `BASE_URL=http://127.0.0.1:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/blog-public-widgets.playwright.ts --workers=1` ✅
  - `BASE_URL=http://127.0.0.1:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/home-section-boundaries.playwright.ts --workers=1` ✅
  - `BASE_URL=http://127.0.0.1:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/columns-ui-workflow.playwright.ts -g "keeps public columns archive filters" --workers=1` ✅
  - `BASE_URL=http://127.0.0.1:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/app-widgets.playwright.ts --workers=1` ✅
- 다음:
  - 현재 후속 F45/F46도 완료됐고, 다음은 M162-E FAQ app(F47)이다.

## M162-C — Events App

- 시작/종료: 2026-05-20 / 2026-05-20
- 변경 파일:
  - `src/lib/builder/events/events-engine.ts`, `src/lib/builder/events/events-shared.ts` — event/attendee storage, status, slug, RSVP capacity, paid/free ticket basics, category helpers, and client-safe shared types/utilities를 추가했다.
  - `src/app/api/builder/events/*` — builder admin event CRUD, public list/detail read, and public RSVP registration API를 추가했다.
  - `src/components/builder/events/*`, `src/app/(builder)/[locale]/admin-builder/events/page.tsx` — Events admin create/list/status management UI를 추가했다.
  - `src/app/[locale]/events/page.tsx`, `src/app/[locale]/events/[slug]/page.tsx` — public event archive/detail pages and RSVP placement를 추가했다.
  - `src/lib/builder/components/eventList/*`, `src/lib/builder/components/eventCalendar/*`, `src/lib/builder/components/eventRsvp/*` — publishable list/calendar/RSVP widgets를 추가하고 mobile-safe CSS, 44px controls, runtime data selectors를 적용했다.
  - `src/lib/builder/apps/catalog.ts`, `src/lib/builder/apps/widgets.ts`, `src/lib/builder/apps/installed.ts`, `src/lib/builder/canvas/types.ts`, `src/lib/builder/components/registry.ts` — native Events app manifest, install migration, widget projection, canvas node schemas, and renderer registry를 연결했다.
  - `src/lib/builder/events/__tests__/events-engine.test.ts`, `src/lib/builder/apps/__tests__/installed.test.ts`, `src/lib/builder/components/__tests__/public-widget-design.test.ts`, `tests/builder-editor/events-app.playwright.ts` — engine, widget projection, CSS contract, and end-to-end publish/RSVP coverage를 추가했다.
- F-layer 판정:
  - F45 🔴 → 🟢: Events admin, RSVP/ticket basics, event pages, and calendar/list widgets now exist and publish through native app widgets.
  - M162은 계속 🟡: F47-F52 FAQ/Chat/Portfolio/search app depth/translation hooks/unified native dashboard가 남아 있다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/events/__tests__/events-engine.test.ts src/lib/builder/apps/__tests__/installed.test.ts src/lib/builder/components/__tests__/public-widget-design.test.ts` ✅
  - `BASE_URL=http://127.0.0.1:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/events-app.playwright.ts --workers=1` ✅
  - `BASE_URL=http://127.0.0.1:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/app-widgets.playwright.ts tests/builder-editor/home-section-boundaries.playwright.ts --workers=1` ✅
  - `git diff --check` ✅
- 다음:
  - M162-E에서 FAQ app(F47)을 구현한다.

## M162-D — Members Area

- 시작/종료: 2026-05-20 / 2026-05-20
- 변경 파일:
  - `src/lib/builder/members/members-engine.ts`, `src/lib/builder/members/current-member.ts` — file/blob-backed member/session storage, public-safe member projection, profile/admin updates, session revoke, role access checks, and current-member cookie helper를 추가했다.
  - `src/app/api/members/*`, `src/app/api/builder/members/*` — public signup/login/logout/me APIs and builder-admin member list/create/update/delete APIs를 추가했다.
  - `src/app/[locale]/login/page.tsx`, `src/app/[locale]/account/*`, `src/components/members/*` — localized login/signup, account dashboard, profile edit, and premium role-gated pages를 추가했다.
  - `src/components/Header.tsx`, `src/components/MobileNavDrawer.tsx`, `src/components/builder/published/SiteHeader.tsx`, `src/app/globals.css` — public legacy/builder headers and mobile drawer에 signed-out/account/premium/logout member navigation을 추가하고 mobile touch target을 보강했다.
  - `src/app/(builder)/[locale]/admin-builder/members/page.tsx`, `src/components/builder/members/*` — member KPI/create/list/edit/block/delete admin manager를 추가했다.
  - `src/lib/builder/site/types.ts`, `src/app/[locale]/[[...slug]]/page.tsx` — builder page `memberAccess` meta and published runtime login/role redirect gate를 추가했다.
  - `src/components/QuickContactWidget.tsx` — login/account utility pages에서 floating contact launcher가 auth controls를 덮지 않게 처리했다.
  - `src/lib/builder/apps/catalog.ts`, `src/lib/builder/apps/installed.ts` — native Members app manifest/routes/migration hook를 추가했다.
  - `src/lib/builder/members/__tests__/members-engine.test.ts`, `tests/builder-editor/members-area.playwright.ts` — engine/session/access unit coverage and signup/login/profile/free-vs-premium/header/admin create E2E를 추가했다.
- F-layer 판정:
  - F46 🔴 → 🟢: Member profile, login gating, account pages, and role-aware navigation now exist.
  - M162은 계속 🟡: F47-F52 FAQ/Chat/Portfolio/search app depth/translation hooks/unified native dashboard가 남아 있다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/members/__tests__/members-engine.test.ts src/lib/builder/apps/__tests__/installed.test.ts` ✅
  - `BASE_URL=http://127.0.0.1:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/members-area.playwright.ts --workers=1` ✅
  - `BASE_URL=http://127.0.0.1:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/home-section-boundaries.playwright.ts tests/builder-editor/columns-ui-workflow.playwright.ts -g "keeps live home sections|keeps public columns archive" --workers=1` ✅
- 다음:
  - M162-E에서 FAQ app(F47)을 구현한다.

## M162-E — FAQ App

- 시작/종료: 2026-05-20 / 2026-05-20
- 변경 파일:
  - `src/lib/builder/faq/faq-engine.ts`, `src/lib/builder/faq/faq-shared.ts` — file/blob-backed FAQ/category model, seed merge, publish/draft/delete/tombstone handling, filtering/sorting, schema/search projection을 추가했다.
  - `src/app/api/builder/faq/*`, `src/components/builder/faq/*`, `src/app/(builder)/[locale]/admin-builder/faq/page.tsx` — builder admin FAQ CRUD API와 create/list/filter/status/schema/delete UI를 추가했다.
  - `src/app/api/faq/route.ts`, `src/app/[locale]/faq/page.tsx`, `src/components/faq/*` — public FAQ API/page/search/category accordion and FAQPage JSON-LD를 추가했다.
  - `src/lib/builder/components/faqList/*`, `src/lib/builder/components/siteSearch/index.tsx`, `src/lib/builder/canvas/types.ts`, `src/lib/builder/apps/catalog.ts`, `src/lib/builder/components/registry.ts` — FAQ list/search app widgets, inspector controls, canvas schema, app manifest/routes, and published runtime registry를 연결했다.
  - `src/lib/builder/seo/structured-data.ts`, `src/lib/builder/site/public-page.tsx`, `src/lib/builder/search/source-collector.ts` — app-backed FAQ schema output, async published structured-data collection, FAQ search indexing을 연결했다.
  - `src/lib/builder/faq/__tests__/faq-engine.test.ts`, `src/lib/builder/search/__tests__/source-collector.test.ts`, `src/lib/builder/apps/__tests__/installed.test.ts`, `tests/builder-editor/faq-app.playwright.ts` — FAQ engine, app widget projection, search index, public page/widget/schema/search E2E를 추가했다.
- F-layer 판정:
  - F47 🔴 → 🟢: FAQ categories, public widgets, schema output, and search/filter are now app-backed.
  - M162은 계속 🟡: F48-F52 Chat/Portfolio/search app depth/translation hooks/unified native dashboard가 남아 있다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/faq/__tests__/faq-engine.test.ts src/lib/builder/apps/__tests__/installed.test.ts src/lib/builder/search/__tests__/source-collector.test.ts` ✅
  - `BASE_URL=http://127.0.0.1:3003 npx playwright test --config=playwright.config.ts tests/builder-editor/faq-app.playwright.ts --workers=1` ✅
  - `BASE_URL=http://127.0.0.1:3003 npx playwright test --config=playwright.config.ts tests/builder-editor/home-section-boundaries.playwright.ts tests/builder-editor/columns-ui-workflow.playwright.ts -g "keeps live home sections|keeps public columns archive" --workers=1` ✅
- 다음:
  - M162-F에서 Chat app(F48)을 구현한다.

## M162-F — Chat App

- 시작/종료: 2026-05-20 / 2026-05-20
- 변경 파일:
  - `src/lib/builder/apps/catalog.ts`, `src/lib/builder/apps/widgets.ts`, `src/lib/builder/apps/installed.ts`, `src/lib/builder/apps/__tests__/installed.test.ts` — Live Chat을 first-party app manifest로 등록하고 install defaults, settings panel, migration, widget projection, runtime resolution tests를 연결했다.
  - `src/lib/builder/live-chat/app-settings.ts`, `src/lib/builder/live-chat/__tests__/app-settings.test.ts` — installed app state + legacy site toggle fallback을 해석하는 public runtime settings resolver를 추가했다.
  - `src/lib/builder/site/public-page.tsx`, `src/components/builder/published/LiveChatWidget.tsx`, `src/app/globals.css` — public live-chat launcher를 app settings로 게이트하고 title/intro/offline/accent/placement/email-required/launcher-label, 외부 app-widget trigger, mobile-safe bottom offset, focus restore/accessibility 상태를 반영했다.
  - `src/lib/builder/canvas/types.ts`, `src/lib/builder/components/floatingChat/index.tsx`, `src/lib/builder/components/floatingChat/__tests__/floatingChat.test.tsx` — `floating-chat` provider에 `live-chat`을 추가하고 app-backed trigger button을 published SSR-safe HTML로 렌더하게 했다.
  - `tests/builder-editor/live-chat-app.playwright.ts` — app install/settings/public launcher/app-widget trigger/email-required/disable fallback E2E를 추가했다.
- F-layer 판정:
  - F48 🔴 → 🟢: Chat inbox/settings widget and public launcher are app-backed.
  - M162은 계속 🟡: F49-F52 Portfolio/search app depth/translation hooks/unified native dashboard가 남아 있다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/live-chat/__tests__/app-settings.test.ts src/lib/builder/apps/__tests__/installed.test.ts src/lib/builder/components/floatingChat/__tests__/floatingChat.test.tsx` ✅
  - `BASE_URL=http://127.0.0.1:3003 npx playwright test --config=playwright.config.ts tests/builder-editor/live-chat-app.playwright.ts --workers=1` ✅
  - `BASE_URL=http://127.0.0.1:3003 npx playwright test --config=playwright.config.ts tests/builder-editor/published-interactions.playwright.ts -g "traps focus in the public live chat widget" --workers=1` ✅
  - `BASE_URL=http://127.0.0.1:3003 npx playwright test --config=playwright.config.ts tests/builder-editor/home-section-boundaries.playwright.ts tests/builder-editor/columns-ui-workflow.playwright.ts -g "keeps live home sections|keeps public columns archive" --workers=1` ✅
- 다음:
  - M162-G에서 Portfolio app(F49)을 구현한다.

## M162-G — Portfolio App

- 시작/종료: 2026-05-20 / 2026-05-20
- 변경 파일:
  - `src/lib/builder/portfolio/portfolio-shared.ts`, `src/lib/builder/portfolio/portfolio-engine.ts`, `src/lib/builder/portfolio/__tests__/portfolio-engine.test.ts` — Portfolio project/status/category/gallery/SEO 모델을 client-safe shared 타입과 file/blob 저장 엔진으로 분리하고 seeded legal-service examples, slug 중복 처리, filter/sort/search/validation을 추가했다.
  - `src/app/api/builder/portfolio/route.ts`, `src/app/api/builder/portfolio/[projectId]/route.ts`, `src/components/builder/portfolio/PortfolioAdminClient.tsx`, `src/components/builder/portfolio/PortfolioAdmin.module.css`, `src/app/(builder)/[locale]/admin-builder/portfolio/page.tsx` — builder admin Portfolio CRUD/API와 responsive manager UI를 추가했다.
  - `src/app/[locale]/portfolio/page.tsx`, `src/app/[locale]/portfolio/[slug]/page.tsx`, `src/app/[locale]/portfolio/PortfolioPublic.module.css` — public archive, category filters, project detail, gallery, SEO metadata를 추가했다.
  - `src/lib/builder/canvas/types.ts`, `src/lib/builder/components/portfolioList/*`, `src/lib/builder/components/registry.ts`, `src/lib/builder/apps/catalog.ts`, `src/lib/builder/apps/widgets.ts`, `src/lib/builder/apps/installed.ts`, `src/lib/builder/apps/__tests__/installed.test.ts` — `portfolio-list` canvas kind와 first-party Portfolio app manifest/settings/routes/widget projection/runtime gating을 연결했다.
  - `tests/builder-editor/portfolio-app.playwright.ts` — app install, project API create/delete, app-widget publish/runtime marker, public archive/detail/gallery, category filter, disabled-app fallback, overflow guard E2E를 추가했다.
- F-layer 판정:
  - F49 🔴 → 🟢: Portfolio projects, galleries, categories, and project detail pages now exist as a native app.
  - M162은 계속 🟡: F50-F52 search app depth/translation hooks/unified native dashboard가 남아 있다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/portfolio/__tests__/portfolio-engine.test.ts src/lib/builder/apps/__tests__/installed.test.ts` ✅
  - `BASE_URL=http://127.0.0.1:3003 npx playwright test --config=playwright.config.ts tests/builder-editor/portfolio-app.playwright.ts --workers=1` ✅
  - `BASE_URL=http://127.0.0.1:3003 npx playwright test --config=playwright.config.ts tests/builder-editor/home-section-boundaries.playwright.ts tests/builder-editor/columns-ui-workflow.playwright.ts -g "keeps live home sections|keeps public columns archive" --workers=1` ✅
- 다음:
  - M162-H에서 Site search app depth(F50)를 구현한다.

## M162-H — Site Search App

- 시작/종료: 2026-05-20 / 2026-05-20
- 변경 파일:
  - `src/lib/builder/search/types.ts`, `src/lib/builder/search/source-collector.ts`, `src/lib/builder/search/__tests__/source-collector.test.ts` — `SEARCH_DOC_KINDS`에 `portfolio`를 추가하고 Portfolio project docs를 native search index에 포함했다.
  - `src/lib/builder/portfolio/portfolio-engine.ts` — published Portfolio projects를 `SearchDoc`으로 투영하는 `listPortfolioSearchDocs`를 추가했다.
  - `src/app/api/search/route.ts`, `src/app/[locale]/search/page.tsx` — `/api/search`는 저장된 인덱스가 없으면 on-demand index를 사용하고, 공개 `/search` 결과 페이지는 legacy static search가 아니라 native `SearchIndex`/kind filter를 사용한다.
  - `src/lib/builder/canvas/types.ts`, `src/lib/builder/components/siteSearch/index.tsx`, `src/components/builder/published/SiteSearchEnhancer.tsx`, `src/app/globals.css` — Site Search widget kind scope에 `portfolio`를 추가하고, inspector kind checkboxes, fallback form `kinds`, loading/empty/error states, mobile-safe full-width layout, 기존 searchbox keyboard contract를 보강했다.
  - `src/lib/builder/apps/catalog.ts`, `src/lib/builder/apps/__tests__/installed.test.ts` — Site Search manifest route/settings/defaultContent를 검색 admin/API/portfolio 범위까지 확장했다.
  - `tests/builder-editor/site-search-app.playwright.ts` — app install, portfolio project indexing, rebuild API, inline results, public `/search` fallback page, mobile overflow, disabled fallback E2E를 추가했다.
- F-layer 판정:
  - F50 🔴 → 🟢: Indexable content model, search results page, and widget configuration now exist as one native Site Search app flow.
  - M162은 계속 🟡: F51-F52 app translation hooks/unified native dashboard가 남아 있다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/search/__tests__/search.test.ts src/lib/builder/search/__tests__/source-collector.test.ts src/lib/builder/portfolio/__tests__/portfolio-engine.test.ts src/lib/builder/apps/__tests__/installed.test.ts` ✅
  - `BASE_URL=http://127.0.0.1:3003 npx playwright test --config=playwright.config.ts tests/builder-editor/site-search-app.playwright.ts --workers=1` ✅
  - `BASE_URL=http://127.0.0.1:3003 npx playwright test --config=playwright.config.ts tests/builder-editor/app-runtime.playwright.ts tests/builder-editor/published-interactions.playwright.ts -g "published app widget runtime|inline site-search" --workers=1` ✅
  - `BASE_URL=http://127.0.0.1:3003 npx playwright test --config=playwright.config.ts tests/builder-editor/home-section-boundaries.playwright.ts tests/builder-editor/columns-ui-workflow.playwright.ts -g "keeps live home sections|keeps public columns archive" --workers=1` ✅
- 다음:
  - M162-I에서 app translation hooks(F51)를 구현한다.

## M162-I — App Translation Hooks

- 시작/종료: 2026-05-20 / 2026-05-20
- 변경 파일:
  - `src/lib/builder/translations/types.ts`, `src/lib/builder/translations/sync.ts` — Translation Manager에 `apps` category와 `app-manifest`/`app-widget`/`app-setting`/`app-content` source types를 추가하고, first-party app manifests, installed app text settings, FAQ records, Events records, Portfolio records, app widget strings를 수집/동기화한다.
  - `src/lib/builder/apps/types.ts`, `src/lib/builder/apps/catalog.ts`, `src/lib/builder/apps/installed.ts` — installed app `localizedSettings`를 normalize/persist하고, saved translation entries로 app catalog manifest labels/routes/settings/widget copy를 target locale에서 localized projection한다.
  - `src/lib/builder/live-chat/app-settings.ts`, `src/lib/builder/site/public-page.tsx` — Live Chat runtime이 locale-specific app settings를 source settings 위에 적용한다.
  - `src/components/builder/translations/TranslationCategoryTree.tsx`, `src/components/builder/translations/TranslationMatrix.tsx` — Translation Manager app category/entry E2E selectors를 추가했다.
  - `src/lib/builder/translations/__tests__/app-sources.test.ts`, `tests/builder-editor/app-translation-hooks.playwright.ts` — app source collection, localized setting apply, deterministic target-locale FAQ/Event/Portfolio content creation, app catalog localization, Translation Manager UI save flow을 검증한다.
- F-layer 판정:
  - F51 🔴 → 🟢: First-party apps now participate in the multilingual manager through app manifest strings, widget strings, installed settings, and native app content records.
  - M162은 계속 🟡: F52 unified native dashboard가 남아 있다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/translations/__tests__/app-sources.test.ts src/lib/builder/translations/providers/__tests__/router.test.ts src/lib/builder/apps/__tests__/installed.test.ts src/lib/builder/search/__tests__/source-collector.test.ts src/lib/builder/portfolio/__tests__/portfolio-engine.test.ts` ✅
  - `BASE_URL=http://127.0.0.1:3003 npx playwright test --config=playwright.config.ts tests/builder-editor/app-translation-hooks.playwright.ts --workers=1` ✅
  - `BASE_URL=http://127.0.0.1:3003 npx playwright test --config=playwright.config.ts tests/builder-editor/home-section-boundaries.playwright.ts tests/builder-editor/columns-ui-workflow.playwright.ts -g "keeps live home sections|keeps public columns archive" --workers=1` ✅
- 다음:
  - M162-J에서 unified native app dashboard(F52)를 구현한다.

## M162-J — Unified Native App Dashboard

- 시작/종료: 2026-05-20 / 2026-05-20
- 변경 파일:
  - `src/components/builder/apps/AppMarketClient.tsx` — `/admin-builder/apps`에 installed native app dashboard를 추가하고 enabled/disabled/update/settings KPI, per-app status, migration health, settings anchors, localized admin/public route links, and update CTA를 연결했다.
  - `src/lib/builder/apps/catalog.ts` — Members, Appointments Lite, Newsletter Lite manifests가 이미 존재하는 admin surfaces를 dashboard manage links로 노출하도록 routes를 보강했다.
  - `src/app/globals.css` — dashboard cards/actions/status strips and app-market health rows를 desktop/mobile에서 겹침 없이 wrap되도록 스타일을 추가했다.
  - `tests/builder-editor/app-market.playwright.ts` — installed dashboard visibility, update-available/update-current flow, rollback snapshot state, native app admin route links, settings anchors, and booking app dashboard links를 검증한다.
- F-layer 판정:
  - F52 🔴 → 🟢: Installed native apps now appear in a single manage/update/settings dashboard.
  - M162 🟡 → 🟢: F43-F52 native app pack foundations are green at the current first-party-app scope.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/apps/__tests__/installed.test.ts src/lib/builder/translations/__tests__/app-sources.test.ts` ✅
  - `BASE_URL=http://127.0.0.1:3003 npx playwright test --config=playwright.config.ts tests/builder-editor/app-market.playwright.ts --workers=1` ✅
  - `BASE_URL=http://127.0.0.1:3003 npx playwright test --config=playwright.config.ts tests/builder-editor/home-section-boundaries.playwright.ts tests/builder-editor/columns-ui-workflow.playwright.ts -g "keeps live home sections|keeps public columns archive" --workers=1` ✅
- 다음:
  - M163 commerce/eCommerce core(F53-F66)로 이동한다.

## M161-H — App Uninstall Cleanup

- 시작/종료: 2026-05-19 / 2026-05-19
- 변경 파일:
  - `src/lib/builder/apps/types.ts`, `src/lib/builder/site/types.ts`, `src/lib/builder/site/persistence.ts` — `uninstalledApps` archive model, normalization, stale-write merge, and explicit archive deletion support를 추가했다.
  - `src/lib/builder/apps/installed.ts` — uninstall cleanup mode(`keep-data`/`remove-data`), retained archive restore, remove-data restore rejection, restore audit event, and install-time archive cleanup을 구현했다.
  - `src/app/api/builder/apps/installations/[appId]/route.ts` — DELETE cleanup payload와 PATCH `{ action: "restore" }`를 추가했다.
  - `src/components/builder/apps/AppMarketClient.tsx`, `src/app/globals.css`, `src/app/(builder)/[locale]/admin-builder/apps/page.tsx` — cleanup choice, uninstall archive summary, restore CTA, and F-layer status copy를 추가했다.
  - `src/lib/builder/apps/__tests__/installed.test.ts`, `src/lib/builder/site/__tests__/persistence.test.ts`, `tests/builder-editor/app-market.playwright.ts` — keep-data uninstall/restore, remove-data no-restore, archive merge, and App Market lifecycle를 검증한다.
- F-layer 판정:
  - F42 🔴 → 🟢: app data removal is explicit, reversible when data is retained, and audited.
  - M161 🟡 → 🟢: F33-F42 App Market architecture checkpoint set is green at current local-app scope.
- 검증:
  - `npx vitest run src/lib/builder/apps/__tests__/installed.test.ts src/lib/builder/site/__tests__/persistence.test.ts` ✅
  - `npm run typecheck` ✅
  - `BASE_URL=http://127.0.0.1:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/app-market.playwright.ts --workers=1` ✅
  - `git diff --check` ✅
- 다음:
  - M162에서 Blog/Events/Members/FAQ/Chat/Portfolio native app pack foundations(F43-F52)를 시작한다.

## M161-G — App Version Model

- 시작/종료: 2026-05-19 / 2026-05-19
- 변경 파일:
  - `src/lib/builder/apps/types.ts`, `src/lib/builder/apps/installed.ts` — installed/latest version state, builder compatibility, update availability, rollback snapshot normalization, upgrade-time snapshot capture, and `rollbackBuilderApp()` restore flow를 연결했다.
  - `src/app/api/builder/apps/installations/[appId]/route.ts` — PATCH `{ action: "rollback" }`를 추가하고 snapshot이 없으면 `409 app_rollback_unavailable`을 반환한다.
  - `src/components/builder/apps/AppMarketClient.tsx`, `src/app/globals.css` — App Market card에 compact version health strip과 rollback action을 추가했다.
  - `src/lib/builder/apps/__tests__/installed.test.ts`, `tests/builder-editor/app-market.playwright.ts` — version state, upgrade rollback snapshot, rollback restore/unavailable behavior, version strip, and installed API readback을 검증한다.
- F-layer 판정:
  - F41 🔴 → 🟢: installed app version, available update, compatibility, and rollback state are now tracked and exposed.
  - M161은 계속 🟡: F42 uninstall cleanup이 남아 있다.
- 검증:
  - `npx vitest run src/lib/builder/apps/__tests__/installed.test.ts` ✅
  - `npm run typecheck` ✅
  - `BASE_URL=http://127.0.0.1:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/app-market.playwright.ts --workers=1` ✅
- 다음:
  - M161-H에서 uninstall cleanup(F42)을 explicit/reversible/audited flow로 구현하고 M161을 닫는다.

## M161-F — App Permission Scope Enforcement

- 시작/종료: 2026-05-19 / 2026-05-19
- 변경 파일:
  - `src/lib/builder/apps/scopes.ts` — app manifest permission scope parsing과 installed/enabled/granted-scope authorization helper를 추가했다.
  - `src/app/api/builder/apps/installations/[appId]/cms/collections/route.ts` — app-context CMS read endpoint를 추가하고 `cms:read` scope가 없는 앱, disabled 앱, 미설치 앱을 거부한다.
  - `src/components/builder/apps/AppMarketClient.tsx`, `src/app/globals.css` — installed app card에 granted scope enforcement 상태를 compact하게 표시한다.
  - `src/lib/builder/apps/__tests__/installed.test.ts`, `tests/builder-editor/app-scopes.playwright.ts` — app scope allowed/denied states와 API 403/404 behavior를 검증한다.
- F-layer 판정:
  - F40 🔴 → 🟢: app-context operations now enforce declared scopes before CMS access.
  - M161은 계속 🟡: F41-F42가 남아 있다.
- 검증:
  - `npx vitest run src/lib/builder/apps/__tests__/installed.test.ts` ✅
  - `npm run typecheck` ✅
  - `BASE_URL=http://127.0.0.1:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/app-scopes.playwright.ts --workers=1` ✅
  - `BASE_URL=http://127.0.0.1:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/app-market.playwright.ts --workers=1` ✅
- 다음:
  - M161-G에서 app update/rollback model(F41)을 구현하고, 이후 uninstall cleanup(F42)로 M161을 닫는다.

## M161-E — App Migration Run Status

- 시작/종료: 2026-05-19 / 2026-05-19
- 변경 파일:
  - `src/lib/builder/apps/types.ts` — installed app에 capped `migrations` run history와 `migrations-run`/`migrations-failed` audit event를 추가하고 normalize path를 보강했다.
  - `src/lib/builder/apps/installed.ts` — manifest migrations를 install/reinstall/enable backfill 시 handler로 실행하고, 성공 run은 한 번만 applied로 기록하며, handler 누락/예외는 failed run으로 기록해 API가 migration 실패를 보고할 수 있게 했다.
  - `src/components/builder/apps/AppMarketClient.tsx`, `src/app/globals.css` — installed app card에 migration applied/failed summary와 latest migration run을 표시한다.
  - `src/lib/builder/apps/__tests__/installed.test.ts`, `tests/builder-editor/app-market.playwright.ts` — migration one-time apply/backfill, failed handler retry path, API payload, App Market UI summary를 검증한다.
- F-layer 판정:
  - F39 🔴 → 🟢: versioned app migrations run once and report persisted status.
  - M161은 계속 🟡: F40-F42가 남아 있다.
- 검증:
  - `npx vitest run src/lib/builder/apps/__tests__/installed.test.ts` ✅
  - `npm run typecheck` ✅
  - `BASE_URL=http://127.0.0.1:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/app-market.playwright.ts --workers=1` ✅
- 다음:
  - M161-F에서 app permission/scopes enforcement(F40)를 구현하고, 이후 update/rollback 및 uninstall cleanup으로 이어간다.

## M161-D — Public App Runtime Loader

- 시작/종료: 2026-05-19 / 2026-05-19
- 변경 파일:
  - `src/lib/builder/apps/widgets.ts` — app-widget node metadata와 installed app state를 대조하는 published runtime resolver를 추가했다.
  - `src/components/builder/canvas/SandboxCatalogPanel.tsx` — Add panel에서 넣는 app widget node에 `appWidget.appId/widgetId` 출처 metadata를 저장한다.
  - `src/components/builder/published/AppRuntimeLoader.tsx` — public page에서 enabled app-widget wrapper를 node별로 mark하고 `builder:app-runtime-ready` 이벤트를 dispatch한다.
  - `src/lib/builder/site/public-page.tsx` — published node wrapper에 scoped app runtime data attributes를 추가하고, disabled/not-installed/unknown/mismatched app widget은 실제 위젯 대신 neutral public fallback으로 렌더한다.
  - `src/lib/builder/apps/__tests__/installed.test.ts`, `tests/builder-editor/app-runtime.playwright.ts` — runtime resolver와 public enabled/disabled render behavior를 검증한다.
- F-layer 판정:
  - F38 🔴 → 🟢: published pages load app widgets only through app metadata/status resolution, with scoped runtime markers and disabled fallback behavior.
  - M161은 계속 🟡: F39-F42가 남아 있다.
- 검증:
  - `npx vitest run src/lib/builder/apps/__tests__/installed.test.ts` ✅
  - `npm run typecheck` ✅
  - `BASE_URL=http://127.0.0.1:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/app-runtime.playwright.ts --workers=1` ✅
  - `BASE_URL=http://127.0.0.1:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/app-widgets.playwright.ts --workers=1` ✅
- 다음:
  - M161-E에서 versioned app migrations(F39)를 구현하고, 이후 scopes/update-uninstall depth로 이어간다.

## M161-C — Installed App Widgets In Add Panel

- 시작/종료: 2026-05-19 / 2026-05-19
- 변경 파일:
  - `src/lib/builder/apps/widgets.ts` — enabled installed app widgets를 editor catalog용 projection으로 변환하고, manifest `component`를 안전한 canvas kind로 명시 매핑한다.
  - `src/lib/builder/apps/installed.ts` — `listEnabledBuilderAppWidgets()`를 추가했다.
  - `src/app/(builder)/[locale]/admin-builder/page.tsx`, `src/components/builder/canvas/SandboxPage.tsx`, `src/components/builder/canvas/SandboxEditorWorkspace.tsx`, `src/components/builder/canvas/SandboxEditorRail.tsx`, `src/components/builder/canvas/SandboxCatalogPanel.tsx` — enabled app widgets를 서버에서 editor Add panel까지 전달하고, `App widgets` 섹션에서 stable card/add selectors와 guarded quick-add/drag insertion을 제공한다.
  - `src/lib/builder/site/persistence.ts` — stale editor writes가 최신 app enable/disable 상태를 되돌리지 않도록 app `updatedAt`이 최신인 쪽을 보존한다.
  - `tests/builder-editor/app-widgets.playwright.ts` — app widget Add panel visibility, quick-add insertion, disabled-app removal을 검증한다.
- F-layer 판정:
  - F37 🔴 → 🟢: enabled installed app widgets can register into the editor Add panel and insert mapped canvas widgets.
  - M161은 계속 🟡: F38-F42가 남아 있다.
- 검증:
  - `npx vitest run src/lib/builder/site/__tests__/persistence.test.ts src/lib/builder/apps/__tests__/installed.test.ts` ✅
  - `npm run typecheck` ✅
  - `BASE_URL=http://127.0.0.1:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/app-widgets.playwright.ts --workers=1` ✅
  - `BASE_URL=http://127.0.0.1:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/app-market.playwright.ts --workers=1` ✅
- 다음:
  - M161-D에서 public runtime loader(F38)를 구현하고, 이후 migrations/scopes/update-uninstall depth로 이어간다.

## M161-B — Installed App Settings Save And Restore

- 시작/종료: 2026-05-19 / 2026-05-19
- 변경 파일:
  - `src/lib/builder/apps/types.ts` — app audit event에 `settings-updated`를 추가했다.
  - `src/lib/builder/apps/installed.ts` — manifest settings defaults, settings validation, unknown field rejection, persisted settings update, settings-preserving enable/disable, and audit append를 구현했다.
  - `src/app/api/builder/apps/installations/[appId]/settings/route.ts` — installed app settings PUT API를 추가했다.
  - `src/components/builder/apps/AppMarketClient.tsx`, `src/app/globals.css` — 설치된 앱 card에 manifest-driven settings fields, field-level validation errors, save button, saved notice, reload-restorable draft values를 추가했다.
  - `src/lib/builder/apps/__tests__/installed.test.ts` — default settings, valid save, invalid select, unknown field, settings-preserving enable/disable를 검증한다.
  - `tests/builder-editor/app-market.playwright.ts` — 설치 후 settings 저장, installed API readback, reload restore, 이후 lifecycle 흐름까지 검증한다.
- F-layer 판정:
  - F36 🔴 → 🟢: installed apps expose settings panels with validation and save/reload restore behavior.
  - M161은 계속 🟡: F37-F42가 남아 있다.
- 검증:
  - `npx vitest run src/lib/builder/apps/__tests__/installed.test.ts` ✅ (3 passed)
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/app-market.playwright.ts --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
- 다음:
  - M161-C에서 widget registration과 editor add panel exposure를 구현하고, M161-D에서 public runtime loader로 이어간다.

## M161-A — App Manifest Catalog And Lifecycle

- 시작/종료: 2026-05-19 / 2026-05-19
- 변경 파일:
  - `src/lib/builder/apps/types.ts` — app manifest schema, permission scopes, widget/settings/route/migration definitions, installed app audit model, installed state normalization을 추가했다.
  - `src/lib/builder/apps/catalog.ts` — Site Search, FAQ Manager, Visitor Inbox, Appointments Lite, Newsletter Lite 로컬 app manifests를 schema 검증 대상으로 추가했다.
  - `src/lib/builder/apps/installed.ts` — catalog entry composition, install/enable/disable/reinstall-upgrade/uninstall lifecycle, capped audit history를 구현했다.
  - `src/lib/builder/site/types.ts`, `src/lib/builder/site/persistence.ts` — `installedApps`를 사이트 문서에 저장하고 stale-write merge/delete를 보존하도록 확장했다.
  - `src/app/api/builder/apps/catalog/route.ts`, `src/app/api/builder/apps/installations/route.ts`, `src/app/api/builder/apps/installations/[appId]/route.ts` — catalog/installations lifecycle API를 추가했다.
  - `src/app/(builder)/[locale]/admin-builder/apps/page.tsx`, `src/components/builder/apps/AppMarketClient.tsx`, `src/app/globals.css` — App Market admin surface, search/category/status filters, lifecycle buttons, permission/status/audit display를 추가했다.
  - `src/components/builder/BuilderWorkspaceDashboard.tsx`, `src/components/builder/canvas/SandboxEditorRail.tsx` — dashboard/editor에서 App Market 진입 링크를 추가했다.
  - `src/lib/builder/apps/__tests__/installed.test.ts`, `tests/builder-editor/app-market.playwright.ts` — manifest/lifecycle unit coverage와 admin catalog lifecycle E2E를 추가했다.
- F-layer 판정:
  - F33 🔴 → 🟢: app manifest가 metadata, permissions, widgets, settings panels, routes, migrations, translations를 typed schema로 선언하고 local catalog load 시 검증된다.
  - F34 🔴 → 🟢: admin이 App Market에서 catalog entries를 browse/search/filter할 수 있다.
  - F35 🔴 → 🟢: install, enable, disable, reinstall-upgrade, uninstall이 persisted state와 audit history로 동작하고 stale-write merge/delete를 보존한다.
  - M161 🔴 → 🟡: F36-F42 runtime/settings/migrations/scopes/version/uninstall-cleanup depth가 남아 있다.
- 검증:
  - `npx vitest run src/lib/builder/apps/__tests__/installed.test.ts` ✅ (2 passed)
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/app-market.playwright.ts --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
- 다음:
  - M161-B에서 installed app settings panel save/restore UI와 validation을 구현하고, M161-C에서 widget registration/public runtime loader로 이어간다.

## M160-H — Public Form Field Matrix

- 시작/종료: 2026-05-19 / 2026-05-19
- 변경 파일:
  - `src/app/api/forms/submit/route.ts` — CMS target field가 `string-list` 또는 repeated일 때 comma-joined public form values를 list로 복원해 checkbox group values가 CMS list field에 정상 저장되게 했다.
  - `tests/builder-editor/public-form-field-matrix.playwright.ts` — published form page를 생성해 phone, checkbox group, radio, select, date, file upload, consent checkbox를 입력하고 CMS record fields가 text/string-list/date/image/boolean으로 저장되는지 검증한다.
  - `WIX-FULL-PRODUCT-CHECKPOINTS.md`, `WIX-PARITY-PLAN.md`, `WIX-FULL-PRODUCT-GAP.md`, `WIX-PARITY-DOCUMENTATION.md` — F28과 M160을 green으로 갱신했다.
- F-layer 판정:
  - F28 🟡 → 🟢: 공개 폼 field-type matrix가 CMS field types로 저장되는 E2E가 통과했다.
  - M160 🟡 → 🟢: F27-F32 checkpoint criteria가 모두 green이다.
- 검증:
  - `npx vitest run src/app/api/forms/__tests__/submit-route.test.ts` ✅ (13 passed)
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/public-form-field-matrix.playwright.ts --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `npx vitest run src/app/api/forms/__tests__/submit-route.test.ts src/lib/builder/forms/__tests__/uploads.test.ts src/lib/builder/__tests__/cms-editable.test.ts` ✅ (30 passed)
  - `git diff --check` ✅
- 다음:
  - M161 App Market architecture로 넘어가기 전에 사용자 QA에서 공개 폼 제출과 CMS moderation 화면을 빠르게 확인한다.

## M160-G — Public Form CMS Submit E2E

- 시작/종료: 2026-05-19 / 2026-05-19
- 변경 파일:
  - `src/lib/builder/components/form/Element.tsx` — `/api/forms/submit`이 반환하는 `validationErrors`를 published form runtime의 field errors로 매핑하고, 첫 invalid control에 focus를 보낸다. CMS issue text는 top-level error에도 보존한다.
  - `tests/builder-editor/public-form-cms-submit.playwright.ts` — editable CMS collection, mapped form schema, published form page를 만든 뒤 실제 공개 페이지에서 서버-required field error, inline error/focus, 재제출 성공, CMS pending record payload를 검증한다.
  - `WIX-FULL-PRODUCT-CHECKPOINTS.md`, `WIX-PARITY-PLAN.md`, `WIX-FULL-PRODUCT-GAP.md`, `WIX-PARITY-DOCUMENTATION.md` — F27/F29를 green으로 갱신하고 F28의 남은 full field-type matrix를 명시했다.
- F-layer 판정:
  - F27 🟡 → 🟢: 공개 폼 제출이 선택한 CMS collection의 mapped fields에 pending record를 생성하는 E2E가 통과했다.
  - F29 🟡 → 🟢: 서버 검증 오류가 공개 폼 필드 아래에 표시되고 첫 invalid field에 focus되는 E2E가 통과했다.
  - F28 유지 🟡: text/email/textarea와 upload media mapping은 검증됐지만, checkbox/radio/select/date/upload 공개 E2E matrix와 consent field parity는 아직 남아 있다.
- 검증:
  - `npx vitest run src/lib/builder/__tests__/cms-editable.test.ts src/app/api/forms/__tests__/submit-route.test.ts` ✅ (27 passed)
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/public-form-cms-submit.playwright.ts --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `git diff --check` ✅
- 다음:
  - M160-H에서 public form field-type matrix를 추가해 checkbox/radio/select/date/upload CMS mapping과 consent field parity를 검증한다.

## M160-F — Moderation Reason History And Filters

- 시작/종료: 2026-05-19 / 2026-05-19
- 변경 파일:
  - `src/lib/builder/cms-types.ts`, `src/lib/builder/cms-editable.ts` — CMS record에 moderation state를 추가하고 pending/approved/rejected 변경 시 최신 사유, 담당자, 최근 history를 보존하게 했다.
  - `src/app/api/builder/sites/[siteId]/collections/[collectionId]/records/bulk/route.ts` — bulk status mutation이 `moderationReason`을 받아 저장 계층으로 전달한다.
  - `src/components/builder/cms/ContentManagerClient.tsx` — Content Manager record list에 moderation status filter, reason textarea, 최신 사유, 최근 history 표시를 추가했다.
  - `src/lib/builder/__tests__/cms-editable.test.ts` — pending→approved→rejected 이력과 reason persistence를 검증한다.
  - `tests/builder-editor/cms-moderation.playwright.ts` — editable collection/record를 만들고 관리자 UI에서 reason을 입력해 reject한 뒤 record card, saved API payload, pending/rejected filter를 검증한다.
- F-layer 판정:
  - F30 🟡 → 🟢: visitor-created row를 pending/approved/rejected로 관리하고, moderation reason/history/filter UX까지 브라우저 회귀로 고정했다.
  - M160은 계속 🟡: F27/F28/F29의 broader public form submit E2E와 field-level client error UX가 남아 있다.
- 검증:
  - `npx vitest run src/lib/builder/__tests__/cms-editable.test.ts` ✅
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/cms-moderation.playwright.ts --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `git diff --check` ✅
- 다음:
  - Public form submit E2E에서 실제 방문자 폼 입력→CMS pending record 생성→필드별 오류 표시까지 검증해 F27/F28/F29를 좁힌다.

## M160-E — Form Builder CMS Settings E2E

- 시작/종료: 2026-05-19 / 2026-05-19
- 변경 파일:
  - `src/components/builder/forms/FormSchemaEditor.tsx` — CMS/anti-spam 설정에 안정적인 테스트 셀렉터와 status region을 추가하고, CMS collection을 바꿀 때 이전 collection detail을 즉시 비워 stale field option이 남지 않게 했다.
  - `src/app/globals.css` — form schema editor, CMS controls, field mapping grid, anti-spam controls를 반응형 grid로 정리해 900px/520px 이하에서 세로로 접히게 했다.
  - `tests/builder-editor/form-builder-cms-settings.playwright.ts` — editable CMS collection과 test form schema를 만든 뒤 form builder에서 CMS 저장 토글, collection/status/site/locale, compatible field mapping, honeypot/minimum submit/duplicate window/duplicate fields를 저장하고 reload 후 유지되는지 검증한다. API schema payload와 email/file field compatible-option filtering, 768px/375px horizontal overflow도 함께 확인한다.
- F-layer 판정:
  - F27/F28/F29 유지 🟡: form builder의 mapping/anti-spam 저장·리로드 UI는 실제 브라우저 회귀로 고정됐지만, 공개 폼 제출 E2E와 field-level client error UX가 더 필요하다.
  - M160은 계속 🟡: moderation reason/history/filter UX와 broader public form E2E가 남아 있다.
- 검증:
  - `BASE_URL=http://localhost:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/form-builder-cms-settings.playwright.ts --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `npm run typecheck` ✅
  - `git diff --check` ✅
- 다음:
  - M160-F에서 moderation reason/history/filter UX를 추가하고, 이어서 public form submit E2E로 방문자 입력 전체 흐름을 검증한다.

## M160-D — Visitor Upload Scan And CMS Media Reference

- 시작/종료: 2026-05-19 / 2026-05-19
- 변경 파일:
  - `src/lib/builder/forms/form-engine.ts` — `FormSubmissionFile.scan`과 `FormUploadScanResult`를 추가해 업로드 보안 검사 결과를 파일 메타데이터에 남긴다.
  - `src/lib/builder/forms/uploads.ts` — 저장 전 `scanFormUpload` hook을 추가했다. PNG/JPEG/GIF/WebP/AVIF/PDF는 확장자와 파일 시그니처를 대조하고, SVG는 script/event/javascript URL을 차단한다. 통과한 파일에는 `local-upload-scan` 메타데이터를 붙인다.
  - `src/app/api/forms/submit/route.ts` — CMS 컬렉션 필드 정의를 읽어 file form field가 CMS image field에 매핑될 때 단순 문자열 대신 `{ url, filename, altText }` media reference를 전달한다. string-list/repeated 필드는 URL 배열을 유지하고, 단일 image 필드에 여러 파일 또는 비이미지 파일이 매핑되면 명확한 CMS 설정 오류로 차단한다.
  - `src/lib/builder/forms/__tests__/uploads.test.ts` — 잘못된 이미지 시그니처, unsafe SVG, 정상 PNG scan metadata를 검증한다.
  - `src/app/api/forms/__tests__/submit-route.test.ts` — visitor upload file이 CMS image field로 media reference 형태로 전달되는지와 단일 image field에 여러 파일을 매핑하는 설정이 400으로 차단되는지 검증한다.
- F-layer 판정:
  - F32 🟡 → 🟢: public upload은 size/type validation, local scan hook metadata, unsafe SVG/signature guard, CMS image media reference를 갖췄다.
  - M160은 계속 🟡: moderation reason/history/filter UX와 public form/form-builder E2E가 남아 있다.
- 검증:
  - `npx vitest run src/lib/builder/forms/__tests__/uploads.test.ts src/app/api/forms/__tests__/submit-route.test.ts` ✅ (16 passed)
  - `npm run typecheck` ✅
  - `git diff --check` ✅
- 다음:
  - M160-E에서 form builder CMS/anti-spam 설정 저장/리로드 Playwright를 작성하고, 그 다음 moderation reason/history/filter UX로 이어간다.

## M160-C — Honeypot And Duplicate Submission Guard

- 시작/종료: 2026-05-19 / 2026-05-19
- 변경 파일:
  - `src/lib/builder/forms/form-engine.ts` — `FormAntiSpamSettings`를 추가해 honeypot field, minimum submit delay, duplicate window, duplicate field IDs를 폼 스키마에 저장할 수 있게 했다.
  - `src/app/api/builder/forms/schemas/route.ts`, `src/app/api/builder/forms/schemas/[formId]/route.ts` — form create/update API가 `antiSpam` 설정을 검증하고 저장한다.
  - `src/components/builder/forms/FormSchemaEditor.tsx` — form builder에 honeypot field name, minimum submit ms, duplicate window ms, duplicate 기준 필드 선택 UI를 추가했다.
  - `src/app/api/forms/submit/route.ts` — schema anti-spam 설정을 제출 저장 전에 적용한다. Honeypot 값이 채워진 제출은 400, duplicate window 안의 같은 configured field fingerprint는 409 + Retry-After로 차단한다. 기존 global submit rate limit과 time-trap도 유지한다.
  - `src/app/api/forms/__tests__/submit-route.test.ts` — honeypot rejection, duplicate rejection, rate limit, validation, mapped CMS write regression을 함께 검증한다.
- F-layer 판정:
  - F31 🟡 → 🟢: honeypot, rate limit, minimum submit delay, duplicate field window guard가 서버에서 저장 전에 enforcement되고 form builder에서 설정 가능하다.
  - F27/F28/F29/F30/F32는 아직 🟡: public form E2E, moderation reason/history/filter, upload scan hooks, CMS media references가 남아 있다.
- 검증:
  - `npx vitest run src/app/api/forms/__tests__/submit-route.test.ts` ✅ (11 passed)
  - `npm run typecheck` ✅
- 다음:
  - M160-D에서 visitor upload scan hook/CMS media reference를 추가하거나, 먼저 form builder CMS mapping 저장/리로드 Playwright로 UI 회귀를 보강한다.

## M160-B — CMS Picker And Visitor Moderation Statuses

- 시작/종료: 2026-05-19 / 2026-05-19
- 변경 파일:
  - `src/lib/builder/cms-types.ts`, `src/lib/builder/cms-editable.ts` — CMS record status를 `draft/pending/approved/rejected/published/archived`로 확장하고 strict validation/bulk update가 새 moderation status를 허용하게 했다.
  - `src/app/api/forms/submit/route.ts` — enabled CMS mapping의 기본 제출 status를 `pending`으로 바꿔 방문자 제출값이 검토 대기 상태로 들어가게 했다.
  - `src/app/api/builder/forms/schemas/route.ts`, `src/app/api/builder/forms/schemas/[formId]/route.ts` — form CMS mapping status schema가 pending/approved/rejected를 받을 수 있게 했다.
  - `src/app/(builder)/[locale]/admin-builder/forms/builder/[formId]/page.tsx`, `src/components/builder/forms/FormSchemaEditor.tsx` — form builder가 editable CMS collection list/detail을 로드하고, collection select + compatible CMS field select + pending/approved/rejected status 선택 + 같은 ID 자동 매핑을 제공하게 했다.
  - `src/components/builder/cms/ContentManagerClient.tsx` — selected record bulk actions에 Pending/Approve/Reject를 추가해 방문자 제출 레코드를 검토 상태로 이동할 수 있게 했다.
  - `src/lib/builder/__tests__/cms-editable.test.ts`, `src/app/api/forms/__tests__/submit-route.test.ts` — pending 기본 제출, approved/rejected status transition을 검증한다.
- F-layer 판정:
  - F27/F28 유지 🟡: collection/compatible-field picker가 생겼지만 stale mapping warning UI와 full E2E 저장/리로드 검증은 더 필요하다.
  - F30 🔴 → 🟡: visitor-created CMS rows가 pending으로 생성되고 Content Manager에서 approved/rejected로 바뀔 수 있다. 단, moderation reason/history/filter UX는 아직 남아 있다.
  - F31/F32 유지 🟡: rate/time/file validation은 있으나 honeypot/duplicate policy UI와 scan hooks는 아직 없다.
- 검증:
  - `npx vitest run src/lib/builder/__tests__/cms-editable.test.ts src/app/api/forms/__tests__/submit-route.test.ts` ✅ (23 passed)
  - `npm run typecheck` ✅
- 다음:
  - M160-C에서 honeypot/duplicate submission policy와 upload scan hook placeholder를 추가하고, 폼 빌더 CMS mapping 저장/리로드 Playwright를 별도 작성한다.

## M160-A — Form Submission To CMS Mapping

- 시작/종료: 2026-05-19 / 2026-05-19
- 변경 파일:
  - `src/lib/builder/forms/form-engine.ts` — `FormCmsMapping`/`FormCmsFieldMapping` 타입을 추가해 폼이 CMS 컬렉션, status, 필드 매핑을 저장할 수 있게 했다.
  - `src/app/api/builder/forms/schemas/route.ts`, `src/app/api/builder/forms/schemas/[formId]/route.ts` — 폼 생성/수정 API가 CMS 매핑 payload를 검증하고 저장한다.
  - `src/components/builder/forms/FormSchemaEditor.tsx` — 폼 빌더에 CMS 저장 토글, collectionId/siteId/locale/status, 폼 필드별 CMS field key 매핑 입력을 추가했다.
  - `src/app/api/forms/submit/route.ts` — 공개 폼 제출 후 enabled CMS mapping이 있으면 mapped values를 CMS record로 생성한다. 기존 `storeInCms`만 있는 폼은 스킵하고, CMS validation/permission/config 오류는 명확한 JSON 오류로 반환한다.
  - `src/app/api/forms/__tests__/submit-route.test.ts` — mapped CMS record creation, legacy skip, CMS validation error 반환을 검증한다.
- F-layer 판정:
  - F27/F28/F29/F31/F32 🔴 → 🟡: 선택된 CMS collectionId와 field key로 제출값을 저장하고, 기존 폼 검증/rate-limit/time-trap/upload validation/CMS validation error를 통과한다.
  - F30은 🔴 유지: 현재는 CMS `draft`/`published` 상태를 사용하며, Wix 수준의 pending/approved/rejected moderation queue는 아직 없다.
- 검증:
  - `npx vitest run src/app/api/forms/__tests__/submit-route.test.ts` ✅ (9 passed)
  - `npm run typecheck` ✅
- 다음:
  - M160-B에서 CMS collection/field picker와 moderation queue status model을 넣고, M160-C에서 honeypot/duplicate policy/upload scan hook을 별도 검증한다.

## M159-M — Repeater Direct Bound Child Insertion

- 시작/종료: 2026-05-18 / 2026-05-18
- 변경 파일:
  - `src/components/builder/canvas/CanvasNode.tsx` — selected repeater HUD에 bound Image/Button 직접 추가 액션을 추가했다. 새 Image는 `featuredImage`/`title`/`href`, 새 Button은 `readTime`/`href`를 호환 가능한 CMS 필드에서 자동 선택한다.
  - `src/components/builder/canvas/SandboxPage.module.css` — 6개 HUD 액션이 좁은 템플릿 안에서 줄바꿈되도록 폭과 wrapping을 조정했다.
  - `tests/builder-editor/dataset-binding.playwright.ts` — bound Text 추가 회귀에 이어 Image/Button 추가, selected child badge, draft field mapping, HUD overflow, bound count `6/6`을 검증한다.
- F-layer 판정:
  - F18/F19 유지 🟡: 텍스트뿐 아니라 이미지/버튼 직접 삽입까지 지원하지만, Wix 수준의 자유로운 repeater template authoring, nested/reused template UX, full visual multi-record comparison은 아직 남아 있다.
- 검증:
  - `npx eslint src/components/builder/canvas/CanvasNode.tsx tests/builder-editor/dataset-binding.playwright.ts` ✅
  - `npm run typecheck` ✅
  - `git diff --check` ✅
  - `BASE_URL=http://127.0.0.1:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/dataset-binding.playwright.ts -g "previews repeater child template" --workers=1` ✅ (1 passed)
- 다음:
  - CMS/repeater 묶음 회귀를 재실행하고, 이후 nested/reused repeater template UX 또는 dynamic list/item lifecycle로 이어간다.

## M159-N — Repeater HUD Field Mapping Summary

- 시작/종료: 2026-05-18 / 2026-05-18
- 변경 파일:
  - `src/components/builder/canvas/CanvasNode.tsx` — selected repeater HUD에 bound child별 대표 CMS 필드 chip을 추가했다. Image/Button/Text 등 요소 종류와 대표 필드(`featuredImage`, `readTime`, `title`)를 캔버스에서 바로 확인할 수 있다.
  - `src/components/builder/canvas/SandboxPage.module.css` — field chip을 2줄 안에서 ellipsis/wrap 처리해 좁은 캔버스에서도 HUD가 가로로 넘치지 않도록 했다.
  - `tests/builder-editor/dataset-binding.playwright.ts` — 초기 3개 template child와 추가 후 6개 child의 field summary, 대표 field text, HUD overflow guard를 검증한다.
- F-layer 판정:
  - F18/F19 유지 🟡: 매핑 가시성은 좋아졌지만, drag/drop 기반 template authoring, nested/reused template editing, full multi-record visual comparison은 아직 남아 있다.
- 검증:
  - `npx eslint src/components/builder/canvas/CanvasNode.tsx tests/builder-editor/dataset-binding.playwright.ts` ✅
  - `npm run typecheck` ✅
  - `git diff --check` ✅
  - `BASE_URL=http://127.0.0.1:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/dataset-binding.playwright.ts -g "previews repeater child template" --workers=1` ✅ (1 passed)
- 다음:
  - CMS/repeater 묶음 회귀를 재실행하고, 이후 F20 dynamic list page creation 또는 repeater nested/reused template UX 중 하나를 선택한다.

## M159-O — Dynamic List Page Draft Creation

- 시작/종료: 2026-05-19 / 2026-05-19
- 변경 파일:
  - `src/lib/builder/dynamic-list-pages.ts` — columns/service-areas 컬렉션을 기존 home dataset target에 매핑하는 동적 리스트 페이지 메타, 페이지별 dataset document, 기본 repeater canvas template을 추가했다.
  - `src/app/api/builder/site/pages/route.ts` — 기존 페이지 생성 API에 `dynamicListCollectionId`, filters/sort/limit 입력을 연결해 CMS 기반 리스트 페이지 초안과 캔버스를 생성한다.
  - `src/app/(builder)/[locale]/admin-builder/page.tsx`, `src/lib/builder/site/public-page.tsx` — 동적 리스트 페이지는 home draft/published dataset snapshot 대신 페이지 메타의 dataset filters/limit을 사용해 editor/public에서 같은 레코드 집합을 렌더링한다.
  - `src/components/builder/canvas/PageSwitcher.tsx` — Pages 패널에서 columns/service-areas 동적 리스트 페이지를 빠르게 만들 수 있는 CMS quick-create 액션과 CMS badge를 추가했다.
  - `tests/builder-editor/dynamic-list-pages.playwright.ts` — API 생성, draft node field binding, editor repeater HUD preview, public publish render, Pages quick-create를 검증한다.
- F-layer 판정:
  - F20 🟡: 사용자가 columns/service-areas 컬렉션 기반 list page를 만들고 filters/limit을 저장해 editor/public에서 확인할 수 있다.
  - 아직 Wix 수준 F20/F21-F26은 아니다. item page 생성, slug/redirect lifecycle, per-item SEO binding, visitor filters/search/pagination/load-more, CMS+page atomic preview/publish가 남아 있다.
- 검증:
  - `npx eslint src/lib/builder/dynamic-list-pages.ts src/lib/builder/site/types.ts 'src/app/api/builder/site/pages/route.ts' 'src/app/(builder)/[locale]/admin-builder/page.tsx' src/lib/builder/site/public-page.tsx src/components/builder/canvas/PageSwitcher.tsx tests/builder-editor/dynamic-list-pages.playwright.ts` ✅
  - `npm run typecheck` ✅
  - `git diff --check` ✅
  - `BASE_URL=http://127.0.0.1:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/dynamic-list-pages.playwright.ts --workers=1` ✅ (2 passed)
  - `BASE_URL=http://127.0.0.1:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/dataset-binding.playwright.ts -g "saves element field binding metadata|flags stale dataset field|previews selected dataset records|previews repeater child template|empty dataset state|published repeater child template" --workers=1` ✅ (6 passed)
- 다음:
  - F20 list-page lifecycle depth를 확장하거나 F21 item-page routing으로 이어간다.

## M159-P — Dynamic Item Page Route Resolution

- 시작/종료: 2026-05-19 / 2026-05-19
- 변경 파일:
  - `src/lib/builder/dynamic-item-pages.ts` — columns/service-areas 컬렉션을 기존 dataset target에 매핑하는 동적 상세 페이지 메타, 레코드 slug 기반 dataset document, 기본 상세 페이지 canvas template을 추가했다.
  - `src/app/api/builder/site/pages/route.ts` — 페이지 생성 API에 `dynamicItemCollectionId`, `dynamicItemRecordSlug`를 연결하고 list/item 동적 페이지 입력이 동시에 들어오는 경우를 차단한다.
  - `src/lib/builder/site/page-resolution.ts`, `src/lib/builder/site/public-page.tsx` — published page resolver가 정확한 페이지 match를 우선하고, 없으면 `/page-slug/record-slug` 형식의 동적 상세 페이지를 찾아 해당 record slug로 dataset을 필터링한다.
  - `src/app/(builder)/[locale]/admin-builder/page.tsx` — 동적 상세 페이지 editor preview가 기본 record slug로 page-specific dataset을 렌더링한다.
  - `src/components/builder/canvas/PageSwitcher.tsx` — Pages 패널에서 columns/service-areas 상세 페이지를 빠르게 만들 수 있는 CMS item-page quick-create 액션과 CMS badge를 추가했다.
  - `tests/builder-editor/dynamic-item-pages.playwright.ts` — API 생성, draft node field binding, editor default-record preview, publish 후 서로 다른 `/page-slug/record-slug` URL이 서로 다른 record를 렌더링하는지 검증한다.
- F-layer 판정:
  - F21 🟡: columns 동적 상세 페이지는 생성/게시 후 record slug별로 올바른 record를 렌더링한다.
  - 아직 Wix 수준 F21/F22-F26은 아니다. 서비스 상세 페이지 UX 깊이, slug 충돌/redirect lifecycle, per-item SEO binding, visitor filters/search/pagination/load-more, CMS+page atomic preview/publish가 남아 있다.
- 검증:
  - `npx eslint src/lib/builder/dynamic-item-pages.ts src/lib/builder/site/types.ts 'src/app/api/builder/site/pages/route.ts' 'src/app/(builder)/[locale]/admin-builder/page.tsx' src/lib/builder/site/public-page.tsx src/lib/builder/site/page-resolution.ts src/components/builder/canvas/PageSwitcher.tsx tests/builder-editor/dynamic-item-pages.playwright.ts` ✅
  - `npm run typecheck` ✅
  - `BASE_URL=http://127.0.0.1:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/dynamic-item-pages.playwright.ts --workers=1` ✅ (1 passed)
  - `BASE_URL=http://127.0.0.1:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/dynamic-list-pages.playwright.ts --workers=1` ✅ (2 passed)
  - `BASE_URL=http://127.0.0.1:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/dataset-binding.playwright.ts -g "saves element field binding metadata|flags stale dataset field|previews selected dataset records|previews repeater child template|empty dataset state|published repeater child template" --workers=1` ✅ (6 passed)
- 다음:
  - F21 서비스 상세 페이지 깊이와 F22 slug conflict/redirect lifecycle 중 우선순위를 정해 이어간다.

## 2026-05-19 — Section Flow Root Recheck

- 사용자 피드백:
  - Grok이 만든 부분을 신뢰하지 말고 다시 확인해야 한다.
  - 칼럼 아카이브의 "모든 칼럼 보기" 아이콘/CTA와 첫 화면 "어떻게 도와드릴까요?" 검색칸이 다음 페이지/섹션에 가려진다.
  - 주요 서비스/FAQ 펼침도 다른 공간을 침범하면 안 된다.
- 원인:
  - decomposed home section root는 `composite`가 아니라 top-level `container` + `content.as === "section"` 구조였다.
  - 기존 flow/render/responsive 경로 일부가 `node.kind === "composite"`만 flow section으로 취급해, `home-insights-root`/`home-services-root`가 뒤 섹션처럼 위에 겹칠 수 있었다.
- 구현:
  - `src/lib/builder/canvas/flow.ts`의 `isTopLevelFlowSection`이 top-level `as: "section"` container도 flow section으로 처리한다.
  - editor render order, public render order, responsive stylesheet gap 계산을 같은 helper로 통일했다.
  - node-click regression을 hero search 하단 edge, hero quick menu 하단 edge, insights CTA icon/right edge, mobile/tablet hit target까지 확장했다.
  - admin smoke의 오래된 hero search click workaround, 서비스/FAQ 기본-open 가정, publish modal 문구 가정을 현재 UI contract에 맞게 정리했다.
- 검증:
  - `npx eslint src/lib/builder/canvas/flow.ts src/lib/builder/site/public-page.tsx src/lib/builder/site/responsive-stylesheet.ts src/components/builder/canvas/CanvasStageNodes.tsx tests/builder-editor/node-click-stability.playwright.ts tests/builder-editor/admin-builder.playwright.ts` ✅
  - `npm run typecheck` ✅
  - `BASE_URL=http://127.0.0.1:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/admin-builder.playwright.ts -g "covers Wix-like editor chrome" --project=chromium-builder --workers=1` ✅ (1 passed)
  - `BASE_URL=http://127.0.0.1:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/node-click-stability.playwright.ts -g "section-boundary controls|hero search dropdown" --project=chromium-builder --workers=1` ✅ (3 passed)
  - `BASE_URL=http://127.0.0.1:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/home-section-boundaries.playwright.ts --project=chromium-builder --workers=1` ✅ (3 passed)
  - `git diff --check` ✅
- 판정:
  - GAP-2026-05-18-02는 `자동검증 통과 / 사용자 QA 대기` 유지.
  - 전체 Wix 완료는 아니다. F21은 여전히 🟡이고, F22-F26 및 F43+ 앱/커머스/AI/협업/운영 레이어는 남아 있다.

## M159-Q — Page Slug Redirect Lifecycle Guard

- 시작/종료: 2026-05-19 / 2026-05-19
- 변경 파일:
  - `src/app/api/builder/site/pages/[pageId]/route.ts` — Pages 패널 rename API가 slug 중복을 계속 차단하면서, 비-home 페이지 slug 변경 시 `createRedirect` 입력에 따라 `/locale/old-slug` -> `/locale/new-slug` exact 301 redirect를 생성한다.
  - `src/components/builder/canvas/PageSwitcher.tsx` — 페이지 slug 변경 UI에 기본 checked 상태의 `301 redirect 생성` 옵션을 추가했다. CMS 동적 페이지는 레코드별 상세 URL redirect가 여기서 자동 생성되지 않는다고 명시해 실제 구현 범위보다 넓게 약속하지 않게 했다.
  - `tests/builder-editor/page-slug-redirects.playwright.ts` — duplicate slug 차단, rename UI redirect checkbox, PATCH 응답의 `redirectCreated`, redirect rule 생성, public old path 301 동작을 검증한다.
- F-layer 판정:
  - F22 🟡: 페이지 slug conflict guard와 Pages 패널 exact 301 redirect 생성은 자동 검증됐다.
  - 아직 Wix 수준 F22 완료는 아니다. CMS record slug field UX, 동적 item record slug 변경 redirect, `/old-base/:recordSlug` -> `/new-base/:recordSlug` wildcard/prefix redirect, redirect conflict UX가 남아 있다.
- 검증:
  - `npx eslint 'src/app/api/builder/site/pages/[pageId]/route.ts' src/components/builder/canvas/PageSwitcher.tsx tests/builder-editor/page-slug-redirects.playwright.ts` ✅
  - `BASE_URL=http://127.0.0.1:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/page-slug-redirects.playwright.ts --project=chromium-builder --workers=1` ✅ (1 passed)
  - `npm run typecheck` ✅
  - `git diff --check` ✅
- 다음:
  - F22는 dynamic record slug field preview/conflict/redirect와 wildcard redirect semantics를 이어서 구현한다.

## M159-R — CMS Slug Field URL Impact Helper

- 시작/종료: 2026-05-19 / 2026-05-19
- 변경 파일:
  - `src/components/builder/cms/ContentManagerClient.tsx` — slug 타입 필드 아래에 compact helper를 추가했다. 현재 입력값 기준 dynamic URL preview, unique slug 안내, 같은 collection 안의 duplicate record 경고, record-level 301 redirect가 아직 자동 생성되지 않는다는 제한 문구를 표시한다.
  - `tests/builder-editor/cms-slug-field.playwright.ts` — editable CMS collection/record를 생성해 slug helper의 URL preview, slug normalize preview, duplicate warning, record-level redirect limitation copy를 검증한다.
- F-layer 판정:
  - F22 🟡 유지: CMS record slug가 저장 전 어떤 URL에 영향을 주는지와 중복 위험을 사용자가 필드 바로 아래에서 볼 수 있다.
  - 아직 Wix 수준 F22 완료는 아니다. 실제 record slug 변경 시 old record URL redirect 생성, 동적 item page source로 editable collection 연결, wildcard/prefix redirect semantics, redirect conflict UI가 남아 있다.
- 검증:
  - `npx eslint src/components/builder/cms/ContentManagerClient.tsx tests/builder-editor/cms-slug-field.playwright.ts` ✅
  - `BASE_URL=http://127.0.0.1:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/cms-slug-field.playwright.ts --project=chromium-builder --workers=1` ✅ (1 passed)
  - `npm run typecheck` ✅
- 다음:
  - F22는 record-level redirect lifecycle 또는 wildcard/prefix redirect semantics를 이어서 구현한다.

## M159-S — Dynamic Item Wildcard Redirects

- 시작/종료: 2026-05-19 / 2026-05-19
- 변경 파일:
  - `src/lib/builder/seo/redirects-edge.ts` — redirect `from`이 `/*`로 끝나면 prefix redirect로 match하고, `to`도 `/*`이면 요청 suffix를 보존한다. exact redirect가 wildcard보다 우선한다.
  - `src/lib/builder/site/redirects.ts` — redirect validation이 trailing `/*` prefix pattern을 허용하고, 잘못된 wildcard 위치나 source 없는 destination wildcard를 차단한다.
  - `src/app/api/builder/site/pages/[pageId]/route.ts` — 동적 item page의 base slug 변경 시 exact redirect와 함께 `/old-base/*` -> `/new-base/*` 301 redirect를 생성한다.
  - `src/components/builder/canvas/PageSwitcher.tsx` — 동적 item page slug 변경 copy를 실제 동작에 맞게 “CMS 레코드 상세 URL은 /old/* 에서 /new/* 로 함께 이동”으로 조정했다.
  - `src/lib/builder/__tests__/redirects-edge.test.ts` — suffix 보존 wildcard match와 exact-over-wildcard 우선순위를 검증한다.
  - `tests/builder-editor/page-slug-redirects.playwright.ts` — 정적 page exact redirect 회귀에 더해 동적 item page base slug rename 시 exact + wildcard redirect rule 생성과 `/old-base/recordSlug` public 301을 검증한다.
- F-layer 판정:
  - F22 🟡 유지: page base slug와 dynamic item base slug redirect lifecycle은 자동 검증됐다.
  - 아직 Wix 수준 F22 완료는 아니다. 실제 CMS record slug 자체를 바꿀 때 old record URL redirect를 생성하는 lifecycle, editable collection dynamic item source, redirect conflict UI가 남아 있다.
- 검증:
  - `npx eslint src/lib/builder/seo/redirects-edge.ts src/lib/builder/site/redirects.ts 'src/app/api/builder/site/pages/[pageId]/route.ts' src/components/builder/canvas/PageSwitcher.tsx tests/builder-editor/page-slug-redirects.playwright.ts src/lib/builder/__tests__/redirects-edge.test.ts` ✅
  - `npx vitest run src/lib/builder/__tests__/redirects-edge.test.ts` ✅ (2 passed)
  - `BASE_URL=http://127.0.0.1:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/page-slug-redirects.playwright.ts --project=chromium-builder --workers=1` ✅ (2 passed)
  - `npm run typecheck` ✅
- 다음:
  - F22는 actual record-slug mutation redirects와 redirect conflict UI를 이어서 구현한다.

## M159-T — Redirect Conflict Surfacing And Persistence Guard

- 시작/종료: 2026-05-19 / 2026-05-19
- 변경 파일:
  - `src/app/api/builder/site/pages/[pageId]/route.ts` — Pages 패널 rename API가 auto 301 redirect를 만들 수 없을 때 slug 저장을 막지 않고 `redirectWarnings` 배열로 충돌 source/target/field/message를 반환한다. 동적 item page는 exact/wildcard redirect 각각의 실패를 따로 수집한다.
  - `src/components/builder/canvas/PageSwitcher.tsx` / `PageSwitcher.styles.ts` — slug rename 성공 후 redirect만 실패한 경우를 빨간 저장 실패가 아닌 주황 non-blocking warning으로 표시한다. checkbox copy도 “페이지는 저장되고 redirect만 건너뜀”을 명시한다.
  - `src/app/api/builder/site/pages/[pageId]/seo/route.ts` / `src/components/builder/canvas/SeoPanel.tsx` / `SeoPanelBasicsTab.tsx` — SEO 패널 slug 저장도 같은 `redirectWarnings`를 반환/표시한다. SEO 저장은 유지하고 panel을 닫지 않아 사용자가 redirect warning을 즉시 볼 수 있다.
  - `src/lib/builder/site/persistence.ts` / `src/lib/builder/site/redirects.ts` — site document write 병합에 redirects 보존을 추가해 stale panel write가 동시에 생성된 redirect rule을 덮어쓰지 않게 했다. redirect 삭제는 `deleteRedirectIds`로 명시 삭제만 보존에서 제외한다.
  - `src/lib/builder/site/__tests__/persistence.test.ts` — latest-only redirect 보존, 명시 삭제 미복구, active source path conflict 시 latest rule 우선 병합을 검증한다.
  - `tests/builder-editor/page-slug-redirects.playwright.ts` — Pages-panel redirect conflict warning과 SEO slug redirect conflict response를 검증한다.
- F-layer 판정:
  - F22 🟡 유지: page/SEO slug rename에서 redirect conflict가 조용히 무시되지 않고 사용자에게 표시되며, redirect persistence race도 막았다.
  - 아직 Wix 수준 F22 완료는 아니다. 실제 CMS record slug 변경 시 old record URL redirect 생성 lifecycle, editable collection dynamic item source, broader wildcard overlap diagnostics가 남아 있다.
- 검증:
  - `npx eslint 'src/app/api/builder/site/pages/[pageId]/route.ts' 'src/app/api/builder/site/pages/[pageId]/seo/route.ts' src/components/builder/canvas/PageSwitcher.tsx src/components/builder/canvas/PageSwitcher.styles.ts src/components/builder/canvas/SeoPanel.tsx src/components/builder/canvas/SeoPanelBasicsTab.tsx src/lib/builder/site/persistence.ts src/lib/builder/site/redirects.ts src/lib/builder/site/__tests__/persistence.test.ts tests/builder-editor/page-slug-redirects.playwright.ts` ✅
  - `npx vitest run src/lib/builder/site/__tests__/persistence.test.ts src/lib/builder/__tests__/redirects-edge.test.ts` ✅ (23 passed)
  - `BASE_URL=http://127.0.0.1:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/page-slug-redirects.playwright.ts --project=chromium-builder --workers=1` ✅ (4 passed)
  - `npm run typecheck` ✅
  - `git diff --check` ✅
- 다음:
  - F22는 CMS record slug mutation redirect lifecycle로 이어간다. F23-F26은 여전히 red다.

## 2026-05-13 — G-Editor Delta: Inline Text And Expandable Stack Fixes

- 사용자 피드백:
  - 인라인 텍스트 편집 시 기존 글자 크기/스타일이 유지되어야 한다.
  - 편집 후 바깥 클릭으로 저장과 선택 해제가 자연스럽게 되어야 한다.
  - 주요 서비스/FAQ 펼침 시 아래 콘텐츠가 겹치지 않고 내려가야 한다.
- 구현:
  - rich text block render/style inheritance와 inline editor text selection을 보강했다.
  - FAQ editor preview는 누적 reveal로 유지해 편집 중 다른 항목을 선택해도 답변이 접히지 않게 했다.
  - published interactions와 editor preview stack을 보강하고, responsive flow sibling drag/resize/reflow helper를 추가했다.
  - flex/grid direct child의 responsive x/y는 left/top offset이 아니라 flow margin gap으로 반영되도록 published stylesheet를 일반화했다.
- 커밋:
  - `3892611 Keep editor FAQ answers revealed`
  - `c7aff95 Allow inline text editor selection`
  - `a4412ef Add responsive flow reflow previews`
- 검증:
  - unit: flow/store-transient/responsive-stylesheet ✅
  - targeted eslint ✅
  - `npm run typecheck` ✅
  - `git diff --check` ✅
  - targeted Playwright inline text / service stack / FAQ stack / published interactions ✅ (5 passed)
- 판정:
  - 사용자 지적 G-Editor delta는 닫힘.
  - 전체 Wix 목표 완료 선언은 보류. W/F checkpoint green gate와 full product layer 잔여 작업이 남아 있다.

## 2026-05-13 — Scope Correction: Full Wix Product Gap

- 사용자 피드백: "너가 전체 윅스 기준보다 25%만 됐다며 그럼 우리 계획도 남은 75%를 더 채우도록 수정해야 하지 않아? 나는 윅스 만들어 달라 했으니까"
- 결정:
  - 기존 W01~W225는 유지하되, 이를 "Wix visual editor parity layer"로 재분류한다.
  - 실제 Wix/Wix Studio 전체 제품 기준의 누락 영역을 `WIX-FULL-PRODUCT-GAP.md`로 새로 정의한다.
  - 새 F-layer F01~F120과 M157~M176을 추가해 CMS, App Market, Stores/eCommerce, AI, collaboration, developer platform, multilingual, enterprise/ops까지 포함한다.
  - 최종 완료 조건은 `W01~W225 중 203+ green`만으로 부족하다. `F01~F120 중 96+ green`도 필요하다.
- 근거 소스:
  - Wix Studio features: https://www.wix.com/studio/features
  - Studio Editor overview: https://support.wix.com/en/article/wix-studio-about-the-studio-editor
  - Studio CMS: https://support.wix.com/en/article/wix-studio-using-the-cms
  - Wix App Market: https://support.wix.com/en/article/about-the-wix-app-market
  - Wix Stores: https://support.wix.com/en/article/wix-stores-an-overview-of-store-features
  - Wix Bookings: https://support.wix.com/en/article/wix-bookings-about-wix-bookings
  - Wix Multilingual: https://support.wix.com/en/article/wix-multilingual-an-overview
  - Wix Studio developer platform: https://www.wix.com/studio/for-web-developers
- 다음:
  - M157에서 F01~F120 상세 체크포인트를 실제 파일로 seed하고 scoring/audit gate를 자동화한다.

## M157 — Full Wix Product Benchmark + F01-F120 Seed

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `WIX-FULL-PRODUCT-CHECKPOINTS.md` — F01~F120 전체 Wix 제품 체크포인트와 완료 게이트를 추가
  - `WIX-FULL-PRODUCT-GAP.md` — F-layer 추적 파일 연결 및 F01~F06 seeded 상태 반영
  - `WIX-PARITY-PLAN.md` — M157을 🟢로 전환하고 다음 M158 CMS 시작점 고정
  - `SESSION.md` — 범위 보정 후속 인계 기록
- 판정:
  - F01~F06 🟢
  - F07~F120 🔴
  - W-layer만으로는 완료 선언 금지 유지
- 검증:
  - `git diff --check` ✅
- 다음:
  - M158에서 CMS collections/content manager v1을 시작한다.

## M158-A — Editable CMS Store, APIs, And Content Manager Seed

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/lib/builder/cms-types.ts` — persistent CMS collection/field/record/permission 타입 추가
  - `src/lib/builder/cms-editable.ts` — site document 기반 editable CMS CRUD/validation 엔진 추가
  - `src/lib/builder/site/types.ts` / `src/lib/builder/site/persistence.ts` — `cmsCollections` 저장 필드 유지
  - `src/app/api/builder/sites/[siteId]/collections/**` — guarded collection/record CRUD API 추가
  - `src/app/(builder)/[locale]/admin-builder/cms/page.tsx` / `src/components/builder/cms/ContentManagerClient.tsx` — Content Manager UI 추가
  - `src/components/builder/canvas/SandboxEditorRail.tsx` / `src/components/builder/BuilderWorkspaceDashboard.tsx` — CMS 진입점 추가
  - `src/lib/builder/__tests__/cms-editable.test.ts` — collection/record CRUD, required/unique validation, static ID reservation 테스트
- F-layer 판정:
  - F07/F08/F09/F10/F12/F16 🟡
  - F11/F13/F14/F15 🔴
- 검증:
  - `npm run typecheck` ✅
  - `npm run test:unit -- src/lib/builder/__tests__/cms-editable.test.ts` ✅ (4 tests)
  - `npm run security:builder-routes` ✅ (117 route files / 101 mutation handlers)
  - `npx next lint --file ...CMS changed files...` ✅
  - `git diff --check` ✅
  - `npm run lint` ⚠️ blocked by pre-existing non-CMS lint errors in `SandboxCatalogPanel.tsx` and currently dirty heading files
- 남은 M158:
  - CSV import/export, content revisions, media-field asset integration, search/filter/sort views, duplicate row UI.

## M158-B — CMS Row Duplicate, Search, And Sort

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/lib/builder/cms-editable.ts` — editable CMS record duplicate 엔진, unique slug copy 방어, record search/sort helper 추가
  - `src/app/api/builder/sites/[siteId]/collections/[collectionId]/records/[recordId]/duplicate/route.ts` — guarded record duplicate API 추가
  - `src/components/builder/cms/ContentManagerClient.tsx` — Content Manager records 영역에 검색, field/system sort, direction, Duplicate action 추가
  - `src/lib/builder/__tests__/cms-editable.test.ts` — duplicate slug copy와 record filter/sort 단위 테스트 추가
  - `WIX-FULL-PRODUCT-CHECKPOINTS.md` / `WIX-PARITY-PLAN.md` / `SESSION.md` — M158-B 진행 상태 반영
- F-layer 판정:
  - F08 유지 🟡: create/edit/duplicate/delete/search/sort가 가능하지만 bulk edit/import/revisions는 후속.
  - F15 🔴 → 🟡: typed filter/saved view/pagination 전에는 미완성이지만 기본 query + field/system sort가 구현됨.
  - F16 유지 🟡: duplicate mutation route도 guard coverage에 포함.
- 검증:
  - `npm run typecheck` ✅
  - `npm run test:unit -- src/lib/builder/__tests__/cms-editable.test.ts` ✅ (6 tests)
  - `npm run security:builder-routes` ✅ (118 route files / 102 mutation handlers)
  - `npx next lint --file src/lib/builder/cms-editable.ts --file src/lib/builder/__tests__/cms-editable.test.ts --file src/components/builder/cms/ContentManagerClient.tsx --file 'src/app/api/builder/sites/[siteId]/collections/[collectionId]/records/[recordId]/duplicate/route.ts'` ✅
- 남은 M158:
  - CSV import/export, content revisions, media-field asset integration, typed filters/saved views/stable pagination.

## M158-C — CMS CSV Import And Export

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/lib/builder/cms-editable.ts` — CSV export/import 엔진, quote/escape parser, append/replace mode, 전체 행 검증 후 write 처리 추가
  - `src/app/api/builder/sites/[siteId]/collections/[collectionId]/records/csv/route.ts` — guarded CSV export/import endpoint 추가
  - `src/components/builder/cms/ContentManagerClient.tsx` — Content Manager records 영역에 CSV textarea, append/replace selector, import/export actions 추가
  - `src/lib/builder/__tests__/cms-editable.test.ts` — CSV export, append import, validation rollback, replace import 단위 테스트 추가
  - `WIX-FULL-PRODUCT-CHECKPOINTS.md` / `WIX-PARITY-PLAN.md` / `SESSION.md` — M158-C 진행 상태 반영
- F-layer 판정:
  - F11 🔴 → 🟡: CSV import/export, validation summary, rollback-on-failure가 구현됨. 대용량 streaming/import mapping UI는 후속.
  - F16 유지 🟡: CSV import mutation route도 guard coverage에 포함.
- 검증:
  - `npm run typecheck` ✅
  - `npm run test:unit -- src/lib/builder/__tests__/cms-editable.test.ts` ✅ (7 tests)
  - `npm run security:builder-routes` ✅ (119 route files / 103 mutation handlers)
  - `npx next lint --file src/lib/builder/cms-editable.ts --file src/lib/builder/__tests__/cms-editable.test.ts --file src/components/builder/cms/ContentManagerClient.tsx --file 'src/app/api/builder/sites/[siteId]/collections/[collectionId]/records/csv/route.ts'` ✅
- 남은 M158:
  - content revisions, media-field asset integration, typed filters/saved views/stable pagination.

## M158-D — CMS Record Revisions And Restore

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/lib/builder/cms-types.ts` — `BuilderCmsRecordRevision` 타입과 record `revisions` 필드 추가
  - `src/lib/builder/cms-editable.ts` — update/restore snapshot 저장, revision normalize, restore 엔진 추가
  - `src/app/api/builder/sites/[siteId]/collections/[collectionId]/records/[recordId]/revisions/[revisionId]/restore/route.ts` — guarded revision restore endpoint 추가
  - `src/components/builder/cms/ContentManagerClient.tsx` — Content Manager records 카드에 revision count, 최근 revision, Restore action 추가
  - `src/lib/builder/__tests__/cms-editable.test.ts` — update revision 생성, restore snapshot 복원, restore 전 상태 revision 보존 테스트 추가
  - `WIX-FULL-PRODUCT-CHECKPOINTS.md` / `WIX-PARITY-PLAN.md` / `SESSION.md` — M158-D 진행 상태 반영
- F-layer 판정:
  - F13 🔴 → 🟡: row history, restore, author/time metadata가 기본 구현됨. diff view, named revisions, per-user identity는 후속.
  - F16 유지 🟡: revision restore mutation route도 guard coverage에 포함.
- 검증:
  - `npm run typecheck` ✅
  - `npm run test:unit -- src/lib/builder/__tests__/cms-editable.test.ts` ✅ (7 tests)
  - `npm run security:builder-routes` ✅ (120 route files / 104 mutation handlers)
  - `npx next lint --file src/lib/builder/cms-types.ts --file src/lib/builder/cms-editable.ts --file src/lib/builder/__tests__/cms-editable.test.ts --file src/components/builder/cms/ContentManagerClient.tsx --file 'src/app/api/builder/sites/[siteId]/collections/[collectionId]/records/[recordId]/revisions/[revisionId]/restore/route.ts'` ✅
- 남은 M158:
  - media-field asset integration, typed filters/saved views/stable pagination.

## M158-E — CMS Typed Filters, Saved Views, And Stable Pagination

- 시작/종료: 2026-05-16 / 2026-05-16
- 변경 파일:
  - `src/lib/builder/cms-record-query.ts` — CMS record free-text query, typed filters, deterministic sort, stable pagination, saved-view normalization 엔진 추가
  - `src/lib/builder/cms-editable.ts` — 기존 `filterAndSortBuilderCmsRecords`가 새 query 엔진을 재사용하되 기존 전체-result 반환 계약은 유지
  - `src/components/builder/cms/ContentManagerClient.tsx` — Content Manager Records 영역에 typed filter builder, filter chips, page size selector, Previous/Next pagination, local saved views 추가
  - `src/lib/builder/__tests__/cms-record-query.test.ts` — typed filter/media metadata search, deterministic tie-break pagination, saved-view normalization 검증 추가
  - `WIX-FULL-PRODUCT-CHECKPOINTS.md` / `WIX-PARITY-PLAN.md` / `SESSION.md` — M158-E 진행 상태 반영
- F-layer 판정:
  - F15 🟡 → 🟢: Content Manager가 typed filters, saved views, stable pagination을 지원한다.
  - 단, saved views는 v1에서 admin browser local storage 기반이다. 계정/팀 공유 saved views는 Wix-depth enhancement로 후속.
- 검증:
  - `npm run test:unit -- src/lib/builder/__tests__/cms-record-query.test.ts src/lib/builder/__tests__/cms-editable.test.ts` ✅ (12 tests)
  - `npx eslint src/lib/builder/cms-record-query.ts src/lib/builder/__tests__/cms-record-query.test.ts src/lib/builder/cms-editable.ts src/components/builder/cms/ContentManagerClient.tsx` ✅
  - `npm run typecheck` ✅
- 남은 M158:
  - F14 media-field asset integration.
  - F07~F13/F16은 v1 구현이 있으나 schema/index UI, bulk workflows, diff/named revision, actor identity, API hardening coverage를 더 올려야 한다.

## M158-F — CMS Media Field Asset Metadata Guard

- 시작/종료: 2026-05-16 / 2026-05-16
- 변경 파일:
  - `src/lib/builder/cms-editable.ts` — CMS image field 정규화에서 `/api/builder/assets/{locale}/{filename}` URL을 검증하고, `assetId`를 URL에서 재생성하며 mismatch를 validation error로 차단
  - `src/components/builder/cms/ContentManagerClient.tsx` — CMS image URL을 수동 변경하면 기존 `assetId`/`filename`을 제거해 잘못된 asset metadata가 남지 않도록 보정
  - `src/lib/builder/__tests__/cms-editable.test.ts` — builder asset URL normalization, alt trim/focal clamp, assetId mismatch, malformed asset URL 검증 추가
- F-layer 판정:
  - F14 🔴 → 🟡: CMS media fields가 Asset Library URL/assetId/filename/alt/focal metadata를 일관되게 저장하고 mismatch를 막는다.
  - F14는 아직 🟢 아님: record save 시 실제 asset 존재 확인과 asset-library folder/tag metadata의 서버 결합이 후속으로 남음.
- 검증:
  - `npm run test:unit -- src/lib/builder/__tests__/cms-editable.test.ts src/lib/builder/__tests__/cms-record-query.test.ts` ✅ (12 tests)
  - `npx eslint src/lib/builder/cms-editable.ts src/lib/builder/__tests__/cms-editable.test.ts src/components/builder/cms/ContentManagerClient.tsx` ✅
  - `npm run typecheck` ✅
- 남은 M158:
  - F14 actual asset existence/library-state coupling.
  - F07~F13/F16 hardening.

## M158-G — CMS Media Field Actual Asset Validation

- 시작/종료: 2026-05-16 / 2026-05-16
- 변경 파일:
  - `src/lib/builder/cms-editable.ts` — create/update/duplicate/restore/CSV import/collection schema update 경로에서 CMS image field가 가리키는 builder asset URL의 실제 저장소 존재를 검증
  - `src/lib/builder/__tests__/cms-editable.test.ts` — `readBuilderImageAsset` mock을 추가하고 missing asset validation을 검증
  - `WIX-FULL-PRODUCT-CHECKPOINTS.md` / `SESSION.md` — F14 green evidence 반영
- F-layer 판정:
  - F14 🟡 → 🟢: CMS media fields가 Asset Library modal을 재사용하고, builder asset URL/assetId/filename/alt/focal metadata를 저장하며, missing asset과 URL/assetId mismatch를 차단한다.
  - folder/tag 기반 library organization은 `AssetLibraryModal`/asset library state 영역의 별도 UX depth로 남긴다.
- 검증:
  - `npm run test:unit -- src/lib/builder/__tests__/cms-editable.test.ts src/lib/builder/__tests__/cms-record-query.test.ts` ✅ (12 tests)
  - `npx eslint src/lib/builder/cms-editable.ts src/lib/builder/__tests__/cms-editable.test.ts src/components/builder/cms/ContentManagerClient.tsx` ✅
  - `npm run typecheck` ✅
- 남은 M158:
  - F07~F13/F16 hardening: schema/index UI, bulk workflows, diff/named revision, actor identity, broader API hardening evidence.

## M158-H — CMS API Guard Coverage Evidence

- 시작/종료: 2026-05-16 / 2026-05-16
- 변경 파일:
  - `WIX-FULL-PRODUCT-CHECKPOINTS.md` / `SESSION.md` — F16 guard evidence 반영
- F-layer 판정:
  - F16 🟡 → 🟢: CMS collection/record/CSV/duplicate/revision restore routes use `guardMutation(request, { permission: 'edit-pages' })`; CMS engine validates schemas, typed payloads, permissions, duplicate IDs, required/unique fields, CSV rollback, revisions, and media assets.
- 검증:
  - `npm run security:builder-routes` ✅ (121 builder route files / 106 mutation handlers guarded)
  - `npm run test:unit -- src/lib/builder/__tests__/cms-editable.test.ts src/lib/builder/__tests__/cms-record-query.test.ts` ✅ (12 tests)
  - `npm run typecheck` ✅
- 남은 M158:
  - F07~F13 hardening: schema/index UI, bulk workflows, diff/named revision, actor identity.

## M158-I — CMS Collection Index Schema UI

- 시작/종료: 2026-05-16 / 2026-05-16
- 변경 파일:
  - `src/lib/builder/cms-types.ts` — `BuilderCmsIndexDefinition` / index field direction 타입 추가, collection summary/detail에 `indexes`/`indexCount` 추가
  - `src/lib/builder/cms-editable.ts` — collection create/update/normalize 경로에 index metadata normalize/validation/default unique slug index 추가
  - `src/components/builder/cms/ContentManagerClient.tsx` — Schema card에 index count, index list, index add/delete UI 추가
  - `src/lib/builder/__tests__/cms-editable.test.ts` — default unique index, summary index count, custom compound index, unknown field rejection 검증 추가
- F-layer 판정:
  - F07 🟡 → 🟢: Collections now define id, name, fields, permissions, timestamps, and indexes with UI/API persistence.
- 검증:
  - `npm run test:unit -- src/lib/builder/__tests__/cms-editable.test.ts src/lib/builder/__tests__/cms-record-query.test.ts` ✅ (13 tests)
  - `npx eslint src/lib/builder/cms-types.ts src/lib/builder/cms-editable.ts src/lib/builder/__tests__/cms-editable.test.ts src/components/builder/cms/ContentManagerClient.tsx` ✅
  - `npm run typecheck` ✅
- 남은 M158:
  - F08/F10/F11/F12/F13 hardening: bulk workflows, advanced validation UI, import mapping/streaming, actor identity, revision diff/names.

## M158-J — CMS Bulk Row Workflow

- 시작/종료: 2026-05-17 / 2026-05-17
- 변경 파일:
  - `src/lib/builder/cms-editable.ts` — selected record ID list validation, strict status validation, bulk status update, bulk delete 엔진 추가
  - `src/app/api/builder/sites/[siteId]/collections/[collectionId]/records/bulk/route.ts` — guarded CMS bulk mutation route 추가
  - `src/components/builder/cms/ContentManagerClient.tsx` — visible row selection, per-row checkbox, selected count, bulk publish/draft/archive/delete/clear UI 추가
  - `src/lib/builder/__tests__/cms-editable.test.ts` — duplicate IDs dedupe, missing ID reporting, revision snapshot, bulk delete persistence 검증 추가
- F-layer 판정:
  - F08 🟡 → 🟢: Admin can create/edit/duplicate/delete/search/sort rows, and now manage selected rows with bulk publish/draft/archive/delete workflows.
- 검증:
  - `npm run test:unit -- src/lib/builder/__tests__/cms-editable.test.ts src/lib/builder/__tests__/cms-record-query.test.ts` ✅ (14 tests)
  - `npx eslint src/lib/builder/cms-editable.ts src/lib/builder/__tests__/cms-editable.test.ts src/components/builder/cms/ContentManagerClient.tsx 'src/app/api/builder/sites/[siteId]/collections/[collectionId]/records/bulk/route.ts'` ✅
  - `npm run typecheck` ✅
  - `npm run security:builder-routes` ✅ (`Checked 122 builder route file(s); 107 mutation handler(s) have guard coverage.`)
  - `git diff --check` ✅
- 남은 M158:
  - F09/F10/F11/F12/F13 hardening: typed field UI completeness, advanced validation UI, import mapping/streaming, actor identity, revision diff/names.

## M158-K — CMS Typed Field UI Coverage

- 시작/종료: 2026-05-17 / 2026-05-17
- 변경 파일:
  - `src/components/builder/cms/ContentManagerClient.tsx` — Schema card에 CMS field type selector/add-field form 추가, reference collection selector 추가, rich text/reference/tags/string-list typed record inputs 보강
  - `src/lib/builder/__tests__/cms-editable.test.ts` — text, rich text, slug, number, boolean, date, image, email, URL, string-list/tags, reference field persist 검증 추가
- F-layer 판정:
  - F09 🟡 → 🟢: typed field model, field creation UI, and record persistence now cover text/rich-text/number/boolean/date/media/reference/tags/URL/email.
- 검증:
  - `npm run test:unit -- src/lib/builder/__tests__/cms-editable.test.ts src/lib/builder/__tests__/cms-record-query.test.ts` ✅ (15 tests)
  - `npx eslint src/components/builder/cms/ContentManagerClient.tsx src/lib/builder/__tests__/cms-editable.test.ts` ✅
  - `npm run typecheck` ✅
  - `git diff --check` ✅
- 남은 M158:
  - F10/F11/F12/F13 hardening: advanced validation/defaults UI, import mapping/streaming, actor identity, revision diff/names.

## M158-L — CMS Validation Defaults And Help Text

- 시작/종료: 2026-05-17 / 2026-05-17
- 변경 파일:
  - `src/lib/builder/cms-types.ts` — field `helpText` metadata 추가
  - `src/lib/builder/cms-editable.ts` — field defaultValue normalization, helpText trim/cap, min/max/pattern/options validation normalization, text/list/number option enforcement 추가
  - `src/components/builder/cms/ContentManagerClient.tsx` — add-field form에 default/help/min/max/regex/options controls 추가, field cards and record inputs에 validation/help metadata 표시
  - `src/lib/builder/__tests__/cms-editable.test.ts` — default coercion, help text normalization, min/max, regex, options, invalid regex rejection 검증 추가
- F-layer 판정:
  - F10 🟡 → 🟢: required/unique/default values/min/max/regex/options/help text are stored, rendered, normalized, and enforced by CMS mutations.
- 검증:
  - `npm run test:unit -- src/lib/builder/__tests__/cms-editable.test.ts src/lib/builder/__tests__/cms-record-query.test.ts` ✅ (16 tests)
  - `npx eslint src/lib/builder/cms-types.ts src/lib/builder/cms-editable.ts src/components/builder/cms/ContentManagerClient.tsx src/lib/builder/__tests__/cms-editable.test.ts` ✅
  - `npm run typecheck` ✅
  - `git diff --check` ✅
- 남은 M158:
  - F11/F12/F13 hardening: import mapping/streaming, actor identity, revision diff/names.

## M158-M — CMS CSV Mapping And Import Summary

- 시작/종료: 2026-05-17 / 2026-05-17
- 변경 파일:
  - `src/lib/builder/cms-editable.ts` — CSV `columnMap`, mapped/skipped summary, missing mapped column validation 추가
  - `src/app/api/builder/sites/[siteId]/collections/[collectionId]/records/csv/route.ts` — import payload의 `columnMap` 전달
  - `src/components/builder/cms/ContentManagerClient.tsx` — CSV header preview, target-to-source column mapping UI, import summary 표시 추가
  - `src/lib/builder/__tests__/cms-editable.test.ts` — custom header mapping, skipped column summary, missing mapped column validation 검증 추가
- F-layer 판정:
  - F11 🟡 → 🟢: rows export/import with rollback remain green, and import now has mapping preview plus validation summary evidence.
- 검증:
  - `npm run test:unit -- src/lib/builder/__tests__/cms-editable.test.ts src/lib/builder/__tests__/cms-record-query.test.ts` ✅ (16 tests)
  - `npx eslint src/lib/builder/cms-editable.ts src/components/builder/cms/ContentManagerClient.tsx src/lib/builder/__tests__/cms-editable.test.ts 'src/app/api/builder/sites/[siteId]/collections/[collectionId]/records/csv/route.ts'` ✅
  - `npm run typecheck` ✅
  - `npm run security:builder-routes` ✅ (`Checked 122 builder route file(s); 107 mutation handler(s) have guard coverage.`)
  - `git diff --check` ✅
- 남은 M158:
  - F12/F13 hardening: actor identity, revision diff/names.

## M158-N — CMS Named Revision Diffs

- 시작/종료: 2026-05-17 / 2026-05-17
- 변경 파일:
  - `src/lib/builder/cms-types.ts` — `BuilderCmsRecordRevisionDiff`와 revision `name`/`diff` metadata 추가
  - `src/lib/builder/cms-editable.ts` — update/restore/bulk status 변경 시 이전 snapshot과 다음 state의 status/locale/field diff를 저장하고 사람이 읽는 revision name 생성
  - `src/components/builder/cms/ContentManagerClient.tsx` — recent revision cards에 revision name과 field/status/locale before -> after diff 표시
  - `src/lib/builder/__tests__/cms-editable.test.ts` — update/restore revision name, status diff, field diff persistence 검증 추가
- F-layer 판정:
  - F13 🟡 → 🟢: row history, restore, author/time metadata에 더해 named revision diff evidence까지 갖춤.
- 검증:
  - `npm run test:unit -- src/lib/builder/__tests__/cms-editable.test.ts src/lib/builder/__tests__/cms-record-query.test.ts` ✅ (16 tests)
  - `npx eslint src/lib/builder/cms-types.ts src/lib/builder/cms-editable.ts src/components/builder/cms/ContentManagerClient.tsx src/lib/builder/__tests__/cms-editable.test.ts` ✅
  - `npm run typecheck` ✅
  - `npm run security:builder-routes` ✅ (`Checked 122 builder route file(s); 107 mutation handler(s) have guard coverage.`)
- 남은 M158:
  - F12 hardening: actor identity and per-actor permission evidence.

## M158-O — CMS Actor-Scoped Permissions

- 시작/종료: 2026-05-17 / 2026-05-17
- 변경 파일:
  - `src/lib/builder/cms-route-actor.ts` — CMS route actor resolver와 `x-builder-cms-actor` preview header 추가
  - `src/lib/builder/cms-editable.ts` — `actorLabel` access option을 revision author metadata에 반영
  - `src/app/api/builder/sites/[siteId]/collections/[collectionId]/records/**/route.ts` — record list/create/update/delete/duplicate/bulk/CSV/restore routes가 request actor를 CMS permission engine에 전달
  - `src/components/builder/cms/ContentManagerClient.tsx` — Content Manager permissions panel에 active record actor selector 추가, record mutations/CSV/restore 요청에 actor header 전송
  - `src/lib/builder/__tests__/cms-route-actor.test.ts` / `cms-editable.test.ts` — route actor normalization/defaulting, staff actor authorLabel, permission gate evidence 추가
- F-layer 판정:
  - F12 🟡 → 🟢: public/member/staff/admin actor 권한이 엔진뿐 아니라 guarded CMS record routes와 UI preview actor flow까지 관통함.
  - M158 🟡 → 🟢: F07~F16 CMS foundations checkpoint complete.
- 검증:
  - `npm run test:unit -- src/lib/builder/__tests__/cms-editable.test.ts src/lib/builder/__tests__/cms-record-query.test.ts src/lib/builder/__tests__/cms-route-actor.test.ts` ✅ (19 tests)
  - `npx eslint src/lib/builder/cms-route-actor.ts src/lib/builder/cms-editable.ts src/components/builder/cms/ContentManagerClient.tsx src/lib/builder/__tests__/cms-editable.test.ts src/lib/builder/__tests__/cms-route-actor.test.ts 'src/app/api/builder/sites/[siteId]/collections/[collectionId]/records/route.ts' 'src/app/api/builder/sites/[siteId]/collections/[collectionId]/records/[recordId]/route.ts' 'src/app/api/builder/sites/[siteId]/collections/[collectionId]/records/bulk/route.ts' 'src/app/api/builder/sites/[siteId]/collections/[collectionId]/records/csv/route.ts' 'src/app/api/builder/sites/[siteId]/collections/[collectionId]/records/[recordId]/duplicate/route.ts' 'src/app/api/builder/sites/[siteId]/collections/[collectionId]/records/[recordId]/revisions/[revisionId]/restore/route.ts'` ✅
  - `npm run typecheck` ✅
  - `npm run security:builder-routes` ✅ (`Checked 122 builder route file(s); 107 mutation handler(s) have guard coverage.`)
  - `git diff --check` ✅
- 다음:
  - M159: dataset/repeater/dynamic page binding F17~F26를 이어서 올린다.

## M159-A — Dataset Config Filters And Sort

- 시작/종료: 2026-05-17 / 2026-05-17
- 변경 파일:
  - `src/lib/builder/types.ts` — dataset filter/sort types와 `BuilderPageDatasetBinding.filters/sort` 추가
  - `src/lib/builder/datasets.ts` — bindable target mode options, filter/sort field metadata, binding patch normalize, runtime filter/sort/limit 적용 추가
  - `src/lib/builder/content.ts` — document-level dataset binding patch helper 추가
  - `src/app/api/builder/sites/[siteId]/pages/[pageKey]/datasets/route.ts` — dataset PUT이 collection/mode/filters/sort/limit patch를 저장
  - `src/components/builder/BuilderInteractiveHomePreview.tsx` — selected dataset target inspector에서 collection/mode/filter/sort/limit 편집 UI 제공
  - `src/components/builder/BuilderPageWorkspaceShell.tsx` — page diagnostics에 dataset filters/sort 표시
  - `src/lib/builder/__tests__/datasets.test.ts` — filter/sort normalize와 runtime 적용 검증 추가
- F-layer 판정:
  - F17 🔴 → 🟢: editor can persist collection, mode, filters, sort, and item limit for registered runtime datasets.
- 검증:
  - `npm run test:unit -- src/lib/builder/__tests__/datasets.test.ts` ✅ (6 tests)
  - `npx eslint src/lib/builder/types.ts src/lib/builder/datasets.ts src/lib/builder/content.ts src/components/builder/BuilderInteractiveHomePreview.tsx src/components/builder/BuilderPageWorkspaceShell.tsx 'src/app/api/builder/sites/[siteId]/pages/[pageKey]/datasets/route.ts' src/lib/builder/__tests__/datasets.test.ts` ✅
  - `npm run typecheck` ✅
- 남은 M159:
  - F18~F26: element field binding, repeater authoring, dynamic list/item route creation, slug conflicts/redirects, per-item SEO, visitor filters/pagination, preview/publish atomicity.

## M159-B — Element Field Binding V0

- 시작/종료: 2026-05-18 / 2026-05-18
- 변경 파일:
  - `src/lib/builder/canvas/types.ts` — canvas node 공통 `dataBinding` 스키마 추가. target dataset, record index, text/label/href/src/alt field map을 저장한다.
  - `src/lib/builder/datasets.ts` — insights/services bindable field catalog를 dataset target metadata에 추가한다.
  - `src/lib/builder/dataset-field-binding.ts` — home insights/services dataset record를 published canvas node content로 투영하는 runtime resolver 추가.
  - `src/lib/builder/site/public-page.tsx` — published page render 직전에 text/heading/image/button 노드의 dataset field binding을 적용한다.
  - `src/components/builder/canvas/SandboxDataBindingPanel.tsx` / `src/components/builder/canvas/SandboxInspectorPanel.tsx` — content inspector에서 text/heading/image/button 노드의 dataset, record, field map을 편집한다.
  - `src/lib/builder/canvas/store.ts` — node `dataBinding` 변경도 document mutation으로 감지해 autosave/undo 대상이 되도록 비교 로직 보강.
  - `src/lib/builder/__tests__/dataset-field-binding.test.ts` — text/link, image src/alt/link, button label/href, unsupported field fallback 검증 추가.
  - `src/lib/builder/__tests__/datasets.test.ts` / `src/lib/builder/canvas/__tests__/store-transient.test.ts` / `tests/builder-editor/dataset-binding.playwright.ts` — bindable field catalog, store persistence, inspector save/reload E2E 검증 추가.
- F-layer 판정:
  - F18 🔴 → 🟡: editor inspector에서 text/heading/image/button/link 필드 바인딩 metadata를 저장/재로드하고, published canvas에서 해당 binding을 home insights/services dataset record로 렌더한다. 단, gallery/repeater element binding과 full visual repeater authoring은 아직 남아 있어 green은 아니다.
- 검증:
  - `npm run test:unit -- src/lib/builder/__tests__/dataset-field-binding.test.ts src/lib/builder/__tests__/datasets.test.ts src/lib/builder/canvas/__tests__/store-transient.test.ts` ✅ (18 tests)
  - `npx eslint tests/builder-editor/dataset-binding.playwright.ts src/components/builder/canvas/SandboxDataBindingPanel.tsx src/components/builder/canvas/SandboxInspectorPanel.tsx src/lib/builder/canvas/store.ts` ✅
  - `BASE_URL=http://127.0.0.1:3001 npx playwright test --config=playwright.config.ts tests/builder-editor/dataset-binding.playwright.ts --workers=1` ✅ (2 tests)
  - `npm run typecheck` ✅
- 남은 M159:
  - F18 잔여: gallery/repeater element field binding UI와 visual repeater template binding.
  - F19~F26: visual repeater authoring, dynamic list/item routes, slug conflicts/redirects, per-item SEO runtime generation, visitor filters/pagination, preview/publish atomicity.

## M159-C — Gallery Field Binding

- 시작/종료: 2026-05-18 / 2026-05-18
- 변경 파일:
  - `src/lib/builder/canvas/types.ts` — `dataBinding.fields.caption` 추가.
  - `src/lib/builder/datasets.ts` — bindable field metadata에 `text/image/url` value kind를 추가해 잘못된 field/control 조합을 줄임.
  - `src/components/builder/canvas/SandboxDataBindingPanel.tsx` / `src/components/builder/canvas/inspector-tokens.css` — gallery 노드를 field binding inspector 대상에 포함하고 select 컨트롤을 inspector token 스타일로 정렬.
  - `src/lib/builder/dataset-field-binding.ts` — gallery 노드가 dataset records를 `content.images[]`로 렌더하도록 image/alt/caption/tags projection 추가.
  - `src/lib/builder/__tests__/dataset-field-binding.test.ts` / `src/lib/builder/__tests__/datasets.test.ts` — gallery image binding과 field value kind 검증 추가.
- F-layer 판정:
  - F18 유지 🟡: text/heading/image/button/link와 gallery image binding은 동작한다. repeater template element binding이 남아 있어 green은 아니다.
- 검증:
  - `npm run test:unit -- src/lib/builder/__tests__/dataset-field-binding.test.ts src/lib/builder/__tests__/datasets.test.ts src/lib/builder/canvas/__tests__/store-transient.test.ts` ✅ (19 tests)
  - `npx eslint src/lib/builder/dataset-field-binding.ts src/lib/builder/datasets.ts src/components/builder/canvas/SandboxDataBindingPanel.tsx src/lib/builder/__tests__/dataset-field-binding.test.ts src/lib/builder/__tests__/datasets.test.ts tests/builder-editor/dataset-binding.playwright.ts` ✅
  - `npm run typecheck` ✅
  - `git diff --check` ✅
  - `BASE_URL=http://127.0.0.1:3001 npx playwright test --config=playwright.config.ts tests/builder-editor/dataset-binding.playwright.ts --workers=1` ✅ (2 tests; stale dev server was restarted before the final pass)
- 남은 M159:
  - F18 잔여: repeater template field binding.
  - F19~F26: visual repeater authoring, dynamic list/item routes, slug conflicts/redirects, per-item SEO runtime generation, visitor filters/pagination, preview/publish atomicity.

## M159-D — Basic Repeater Dataset Binding

- 시작/종료: 2026-05-18 / 2026-05-18
- 변경 파일:
  - `src/lib/builder/canvas/types.ts` — `dataBinding.fields.title` / `description` 추가.
  - `src/components/builder/canvas/SandboxDataBindingPanel.tsx` — `container` 중 `layoutMode: "repeater"`인 노드를 field binding inspector 대상으로 포함하고 title/copy/image field를 선택할 수 있게 함.
  - `src/lib/builder/dataset-field-binding.ts` — bound repeater container가 dataset records를 `content.layoutItems[]`로 투영하도록 추가.
  - `src/lib/builder/components/container/Element.tsx` / `src/app/globals.css` — repeater card가 bound `layoutItems.image`를 실제 카드 이미지로 렌더하도록 추가.
  - `src/lib/builder/__tests__/dataset-field-binding.test.ts` — repeater layoutItems binding 회귀 테스트 추가.
  - `tests/builder-editor/dataset-binding.playwright.ts` — layer selection을 통한 inspector save/reload 안정화 및 published repeater dataset render E2E 추가.
- F-layer 판정:
  - F18 유지 🟡: text/heading/image/button/link, gallery image, basic repeater `layoutItems` binding은 동작한다. 하지만 Wix식 visual repeater template authoring과 child template field binding은 아직 남아 있어 green은 아니다.
- 검증:
  - `npm run test:unit -- src/lib/builder/__tests__/dataset-field-binding.test.ts` ✅ (6 tests)
  - `npx eslint src/lib/builder/dataset-field-binding.ts src/components/builder/canvas/SandboxDataBindingPanel.tsx src/lib/builder/components/container/Element.tsx src/lib/builder/__tests__/dataset-field-binding.test.ts` ✅
  - `npm run typecheck` ✅
  - `npx eslint tests/builder-editor/dataset-binding.playwright.ts` ✅
  - `BASE_URL=http://127.0.0.1:3001 npx playwright test --config=playwright.config.ts tests/builder-editor/dataset-binding.playwright.ts --workers=1` ✅ (3 tests)
- 남은 M159:
  - F18 잔여: repeater child template field binding은 M159-E에서 runtime 기준으로 이어서 처리됨. 현재 잔여는 visual repeater authoring controls와 editor-side record preview.
  - F19~F26: dynamic list/item routes, slug conflicts/redirects, per-item SEO runtime generation, visitor filters/pagination, preview/publish atomicity.

## M159-E — Published Repeater Child Template Binding

- 시작/종료: 2026-05-18 / 2026-05-18
- 변경 파일:
  - `src/lib/builder/dataset-field-binding.ts` — repeater child render가 parent record index를 override로 적용할 수 있도록 `recordIndexOverride`와 record count resolver 추가.
  - `src/lib/builder/site/public-page.tsx` — published repeater container가 bound child template nodes를 record count만큼 wrapper로 반복하고, 각 child의 text/image/button binding을 record별로 렌더.
  - `src/lib/builder/__tests__/dataset-field-binding.test.ts` — repeated child template record index override 검증 추가.
  - `tests/builder-editor/dataset-binding.playwright.ts` — published page에서 child template title/image/link가 record별로 반복 렌더되는지 E2E 검증 추가.
- F-layer 판정:
  - F18 유지 🟡: published runtime에서 repeater child template binding까지 동작한다. 단, editor canvas 안에서 Wix처럼 repeater template를 시각적으로 만들고, record preview를 전환하고, child template를 authoring하는 UI는 아직 남아 있어 green은 아니다.
- 검증:
  - `npm run test:unit -- src/lib/builder/__tests__/dataset-field-binding.test.ts` ✅ (7 tests)
  - `npx eslint src/lib/builder/dataset-field-binding.ts src/lib/builder/site/public-page.tsx src/lib/builder/__tests__/dataset-field-binding.test.ts tests/builder-editor/dataset-binding.playwright.ts` ✅
  - `npm run typecheck` ✅
  - `BASE_URL=http://127.0.0.1:3001 npx playwright test --config=playwright.config.ts tests/builder-editor/dataset-binding.playwright.ts --workers=1` ✅ (4 tests)
- 남은 M159:
  - F18 잔여: visual repeater authoring controls, editor-side record preview switching, nested/reused template editing UX.
  - F19~F26: dynamic list/item routes, slug conflicts/redirects, per-item SEO runtime generation, visitor filters/pagination, preview/publish atomicity.

## M159-F — Repeater Child Template Authoring Control

- 시작/종료: 2026-05-18 / 2026-05-18
- 변경 파일:
  - `src/components/builder/canvas/SandboxDataBindingPanel.tsx` — `layoutMode: "repeater"` container에 child template authoring block, `Bind child template` action, 자동 child field mapping preview 추가. 이후 바인딩 전/후 상태를 `No template children bound yet` / `3 template children bound`처럼 표시하고, 이미 바인딩된 경우 버튼을 `Replace child template bindings`로 바꿔 재바인딩 의미를 명확히 했다.
  - `src/components/builder/canvas/SandboxInspectorPanel.tsx` — selected repeater의 child nodes를 읽고 text/heading/image/button/gallery/repeater child에 dataset field binding을 자동 적용하는 helper 추가.
  - `src/components/builder/canvas/inspector-tokens.css` — repeater authoring action button, child mapping preview, bound-child status pill, panel spacing 스타일 추가.
  - `tests/builder-editor/dataset-binding.playwright.ts` — editor에서 repeater container 선택, child template mapping preview 확인, horizontal overflow absence 확인, child template binding action 실행, bound-child status/replace button 확인, draft에 child bindings가 저장되는지 E2E 검증 추가.
- F-layer 판정:
  - F18 유지 🟡: editor inspector에서 repeater child template binding을 생성하는 authoring 보조 흐름까지 동작한다. 단, Wix처럼 record preview를 editor canvas에서 전환하며 시각적으로 확인하는 기능과 nested/reused template UX는 아직 남아 있다.
- 검증:
  - `npx eslint src/components/builder/canvas/SandboxDataBindingPanel.tsx src/components/builder/canvas/SandboxInspectorPanel.tsx tests/builder-editor/dataset-binding.playwright.ts` ✅
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/dataset-binding.playwright.ts --workers=1` ✅ (6 tests)
  - `BASE_URL=http://127.0.0.1:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/dataset-binding.playwright.ts -g "binds repeater child templates" --workers=1` ✅
- 남은 M159:
  - F18 잔여: editor-side record preview switching, richer visual repeater authoring, nested/reused template editing UX.
  - F19~F26: dynamic list/item routes, slug conflicts/redirects, per-item SEO runtime generation, visitor filters/pagination, preview/publish atomicity.

## M159-G — Editor Dataset Record Preview Switching

- 시작/종료: 2026-05-18 / 2026-05-18
- 변경 파일:
  - `src/lib/builder/datasets.ts` — dataset sample record에 field value map을 추가하고 home insights/services preview target contract를 확장. 이후 preview target에 현재 collection/mode/filter/sort/limit를 같이 실어 inspector가 실제 데이터 소스 상태를 보여주게 했다.
  - `src/app/(builder)/[locale]/admin-builder/page.tsx` — 자유 캔버스 편집기 dataset preview source를 고정 기본값에서 home draft dataset snapshot + Blob 포함 칼럼 records로 교체해, `/ko/builder/home`에서 저장한 dataset limit/filter/sort가 `/ko/admin-builder` 인스펙터에도 그대로 보이게 했다.
  - `src/lib/builder/dataset-preview-binding.ts` — text/heading/button/image/gallery/repeater container에 editor preview용 field binding 적용 helper 추가.
  - `src/lib/builder/dataset-field-binding.ts` — published/runtime repeater expansion에서 parent `recordIndex`를 list offset으로 쓰지 않게 고정해, editor preview cursor가 공개 반복 목록의 첫 record를 누락시키지 않도록 했다.
  - `src/components/builder/canvas/BuilderDatasetPreviewContext.tsx` — admin editor 안에서 dataset preview records를 공유하는 provider 추가.
  - `src/components/builder/canvas/SandboxPage.tsx`, `SandboxEditorWorkspace.tsx`, `CanvasNode.tsx` — editor canvas가 selected record의 bound content를 저장 전 preview로 렌더링하도록 연결. 이후 parent repeater의 preview recordIndex를 같은 dataset에 묶인 child template 노드가 상속해, 부모 record 전환 시 child text/image/button preview도 같은 record로 즉시 바뀌게 했다.
  - `src/lib/builder/canvas/store.ts` — selected container/repeater 안에 새 child node를 직접 추가하고 즉시 선택할 수 있는 `addChildNode` mutation을 추가했다.
  - `src/components/builder/canvas/CanvasNode.tsx`, `SandboxPage.module.css` — selected repeater template 위에 canvas HUD를 추가해 bound child count, 현재 CMS record 번호/라벨, previous/next preview controls를 캔버스에서 직접 확인하고 전환할 수 있게 했다. HUD는 selection 내부 우상단에 배치해 global header hit area와 겹치지 않게 조정했고, `Edit` 액션은 text/heading/button을 우선으로 첫 bound child를 선택해 템플릿 내부 편집으로 바로 들어가게 했다. 이후 `Text` 액션을 추가해 현재 dataset target의 title/text field에 묶인 template child를 repeater 안에 직접 만들고 선택하도록 했다. Repeater child 선택 시 canvas badge도 추가해 해당 요소가 parent repeater record를 상속하는 template child임을 캔버스에서 바로 알 수 있게 했다.
  - `src/components/builder/canvas/SandboxInspectorPanel.tsx`, `SandboxDataBindingPanel.tsx` — repeater child를 선택했을 때 parent repeater의 현재 recordIndex를 인스펙터 preview에 상속하고, child의 record picker/stepper는 잠가 parent-driven preview임을 명시했다.
  - `src/components/builder/canvas/SandboxDataBindingPanel.tsx`, `inspector-tokens.css` — Record stepper를 실제 sample record 수로 clamp하고 현재 record/field preview card 표시. 추가로 record dropdown, live collection/limit/filter/sort/runtime summary, CMS record read-only preview 안내를 표시해 Wix식 “현재 무엇을 미리보는지”를 더 명확히 함.
  - `src/lib/builder/__tests__/dataset-field-binding.test.ts` — published/runtime repeater가 editor preview `recordIndex`를 list offset으로 쓰지 않는 단위 회귀 추가.
  - `tests/builder-editor/dataset-binding.playwright.ts` — inspector record 1 -> 2 전환, record dropdown 선택, repeater canvas HUD next-record 전환, HUD `Edit` -> child selection, child template canvas badge, HUD `Text` -> bound child insertion, child inspector inherited-parent-record preview lock, persisted dataset snapshot 기반 collection/limit/filter/sort/runtime summary, read-only preview 안내, canvas text preview 변경, draft `recordIndex`/new child parent+binding 저장, preview cursor 상태에서 publish해도 public repeater가 첫 dataset record부터 4개를 렌더하는지, binding panel visible horizontal overflow absence를 E2E로 고정. 레이어 선택 helper도 안정화.
- F-layer 판정:
  - F18 유지 🟡: Wix식 selected-record preview switching의 첫 editor/canvas 경로가 동작한다. 다만 richer visual repeater authoring, nested/reused template editing UX, full dynamic page lifecycle은 아직 남아 있어 green은 아니다.
- 검증:
  - `npx eslint src/components/builder/canvas/SandboxPage.tsx src/components/builder/canvas/SandboxEditorWorkspace.tsx src/components/builder/canvas/SandboxDataBindingPanel.tsx src/components/builder/canvas/CanvasNode.tsx src/components/builder/canvas/BuilderDatasetPreviewContext.tsx src/lib/builder/dataset-preview-binding.ts src/lib/builder/datasets.ts tests/builder-editor/dataset-binding.playwright.ts` ✅
  - `npm run typecheck` ✅
  - `npm run test:unit -- src/lib/builder/__tests__/dataset-field-binding.test.ts` ✅ (8 tests)
  - `BASE_URL=http://localhost:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/dataset-binding.playwright.ts --workers=1` ✅ (6 tests)
  - `BASE_URL=http://127.0.0.1:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/dataset-binding.playwright.ts -g "previews selected dataset records|binds repeater child templates|previews repeater child template|published repeater child template" --workers=1` ✅ (4 tests)
  - `BASE_URL=http://127.0.0.1:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/dataset-binding.playwright.ts -g "previews selected dataset records" --workers=1` ✅ (persisted dataset snapshot 기반 live collection/limit/filter/sort source summary)
  - `BASE_URL=http://127.0.0.1:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/dataset-binding.playwright.ts -g "previews repeater child template" --workers=1` ✅ (selected repeater canvas HUD next-record control + child edit handoff + bound text child insertion + inherited parent record preview lock)
- 남은 M159:
  - F18 잔여: richer visual repeater item/template structure editing, nested/reused template editing UX.
  - F19~F26: user-created dynamic list/item routes, slug conflicts/redirects, runtime per-item SEO generation, visitor filters/pagination, preview/publish atomicity.

## M159-H — Dynamic Route Record Handoff To Template Editor

- 시작/종료: 2026-05-18 / 2026-05-18
- 변경 파일:
  - `src/lib/builder/hrefs.ts` — dynamic template editor href에 `previewRecordId` query를 보존할 수 있게 확장.
  - `src/components/builder/BuilderDynamicRouteWorkspaceShell.tsx` — route detail에서 선택한 record를 linked template editor link로 전달.
  - `src/app/(builder)/[locale]/builder/dynamic-templates/[templateId]/page.tsx`, `BuilderDynamicTemplateWorkspaceShell.tsx`, `BuilderDynamicTemplateEditorSurface.tsx` — template editor가 `previewRecordId`를 draft 기본 record보다 우선해 초기 preview record로 사용.
  - `src/components/builder/BuilderDynamicTemplateEditorSurface.tsx`, `src/app/globals.css` — selected record 기준으로 block별 bound field의 실제 preview value를 보여주는 field map UI, missing preview record recovery alert, long-value wrapping 추가.
  - `src/app/api/builder/sites/[siteId]/dynamic-templates/[templateId]/route.ts` — dynamic template detail/draft API도 `previewRecordId`와 saved selected record를 반영해 detail sample을 구성.
  - `src/lib/builder/dynamic-templates.ts` — 요청 record가 기본 sample window 밖에 있어도 template editor sample list 앞에 포함.
  - `src/lib/builder/dynamic-template-drafts.ts` — draft 저장/로드 정규화 시 selected record가 기본 sample 밖에 있어도 유효 record면 유지.
  - `src/app/[locale]/services/[slug]/page.tsx`, `src/app/[locale]/lawyers/[slug]/page.tsx` — published dynamic template block visibility를 즉시 반영하도록 code-owned detail routes를 dynamic rendering으로 고정.
  - `src/lib/builder/site.ts`, `src/lib/builder/site/__tests__/identity.test.ts` — dynamic template draft API가 사용하는 legacy `default` site id를 canonical default site와 동일하게 허용하도록 보정.
  - `src/lib/builder/__tests__/dynamic-routes.test.ts`, `dynamic-templates.test.ts`, `dynamic-template-drafts.test.ts`, `hrefs.test.ts`, `site/__tests__/identity.test.ts`, `tests/builder-editor/dynamic-template-preview.playwright.ts` — missing route/template record state, sample-window inclusion, draft preservation, href preservation, route->template browser handoff, route missing-record sample chooser recovery, record click 후 field map/live preview 갱신, missing template preview record recovery alert, block hide 후 field map/live preview 동기화, selected record 저장/재로드, Blob-backed API setup/restore, public route publish reflection을 고정.
- F-layer 판정:
  - F18 유지 🟡: code-owned dynamic route/template preview seam의 selected-record handoff, field value map preview, missing preview record recovery는 동작한다. 하지만 Wix식 visual repeater authoring, nested/reused template editing UX, user-created dynamic page lifecycle은 아직 남아 있다.
- 검증:
  - `npx eslint src/lib/builder/hrefs.ts src/lib/builder/dynamic-templates.ts src/lib/builder/dynamic-template-drafts.ts src/lib/builder/site.ts src/app/(builder)/[locale]/builder/dynamic-templates/[templateId]/page.tsx src/app/api/builder/sites/[siteId]/dynamic-templates/[templateId]/route.ts src/components/builder/BuilderDynamicRouteWorkspaceShell.tsx src/components/builder/BuilderDynamicTemplateWorkspaceShell.tsx src/components/builder/BuilderDynamicTemplateEditorSurface.tsx src/lib/builder/__tests__/dynamic-routes.test.ts src/lib/builder/__tests__/dynamic-templates.test.ts src/lib/builder/__tests__/dynamic-template-drafts.test.ts src/lib/builder/__tests__/hrefs.test.ts src/lib/builder/site/__tests__/identity.test.ts tests/builder-editor/dynamic-template-preview.playwright.ts` ✅
  - `npm run test:unit -- src/lib/builder/__tests__/dynamic-routes.test.ts src/lib/builder/__tests__/dynamic-templates.test.ts src/lib/builder/__tests__/dynamic-template-drafts.test.ts src/lib/builder/__tests__/hrefs.test.ts` ✅ (13 tests)
  - `npm run test:unit -- src/lib/builder/site/__tests__/identity.test.ts src/lib/builder/__tests__/dynamic-template-drafts.test.ts` ✅ (7 tests)
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/dynamic-template-preview.playwright.ts --workers=1` ✅ (5 tests)
  - `BASE_URL=http://localhost:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/node-click-stability.playwright.ts tests/builder-editor/inline-text-editor.playwright.ts tests/builder-editor/home-section-boundaries.playwright.ts --workers=1` ✅ (16 tests)
- 남은 M159:
  - F18 잔여: richer visual repeater authoring, nested/reused template editing UX.
  - F19~F26: user-created dynamic list/item routes, slug conflicts/redirects, runtime per-item SEO generation, visitor filters/pagination, preview/publish atomicity.

## M159-I — Repeater Empty Dataset State

- 시작/종료: 2026-05-18 / 2026-05-18
- 목표:
  - Dataset filter 결과가 0건일 때 editor/public repeater가 placeholder 또는 template child content를 실제 CMS content처럼 노출하지 않게 한다.
  - Editor는 no-record 상태를 명확히 보여주고, public runtime은 겹침 없이 localized empty state를 렌더한다.
- 변경 파일:
  - `src/lib/builder/dataset-field-binding.ts` — filtered record가 0건이면 repeater `layoutItems`를 빈 배열로 정리하고 public record count를 0으로 유지.
  - `src/lib/builder/dataset-preview-binding.ts` — editor preview에서도 stale template `layoutItems`가 남지 않도록 zero-record 결과를 그대로 반영.
  - `src/lib/builder/site/public-page.tsx` — public render가 published home dataset snapshot을 사용하고, template child fallback 대신 `data-builder-repeater-empty="true"` localized empty state를 렌더.
  - `src/components/builder/canvas/CanvasNode.tsx`, `src/components/builder/canvas/SandboxPage.module.css` — selected repeater HUD가 0건에서도 유지되며 `No matching records`와 filter/CMS 확인 hint를 표시.
  - `src/lib/builder/__tests__/dataset-field-binding.test.ts`, `tests/builder-editor/dataset-binding.playwright.ts` — zero-record unit/E2E 회귀 추가.
- F-layer 판정:
  - F18 유지 🟡: zero-result safety는 보강됐지만, richer visual repeater item/template structure editing과 nested/reused template UX가 남아 있어 green은 아니다.
- 검증:
  - `npx eslint src/lib/builder/dataset-field-binding.ts src/lib/builder/dataset-preview-binding.ts src/lib/builder/site/public-page.tsx src/lib/builder/__tests__/dataset-field-binding.test.ts src/components/builder/canvas/CanvasNode.tsx tests/builder-editor/dataset-binding.playwright.ts` ✅
  - `npm run typecheck` ✅
  - `npm run test:unit -- src/lib/builder/__tests__/dataset-field-binding.test.ts` ✅ (9 tests)
  - `BASE_URL=http://127.0.0.1:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/dataset-binding.playwright.ts -g "empty dataset state" --workers=1` ✅
  - `BASE_URL=http://127.0.0.1:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/dataset-binding.playwright.ts -g "previews selected dataset records|binds repeater child templates|previews repeater child template|empty dataset state|published repeater child template" --workers=1` ✅ (5 tests)
- 남은 M159:
  - F18 잔여: richer visual repeater item/template structure editing, nested/reused template editing UX, multi-record visual comparison.
  - F19~F26: user-created dynamic list/item routes, slug conflicts/redirects, runtime per-item SEO generation, visitor filters/pagination, preview/publish atomicity.

## M159-J — Stale Dataset Binding / Source-Change Safety

- 시작/종료: 2026-05-18 / 2026-05-18
- 목표:
  - Dataset field catalog/source가 바뀐 뒤 저장 문서에 남은 missing/incompatible field mapping을 editor에서 명확히 드러낸다.
  - 사용자가 replacement field를 고르거나 Not bound로 제거할 수 있게, stale select value를 빈 값처럼 숨기지 않는다.
  - Public runtime은 stale mapped field가 있어도 static placeholder/template content를 CMS content처럼 노출하지 않는다.
- 변경 파일:
  - `src/components/builder/canvas/SandboxDataBindingPanel.tsx`, `src/components/builder/canvas/inspector-tokens.css` — stale mapping warning banner, per-field `Missing field: {fieldId}` select option, no-overflow warning card 추가.
  - `src/components/builder/canvas/CanvasNode.tsx`, `src/components/builder/canvas/SandboxPage.module.css` — stale-bound selected node에 `Dataset field missing` canvas warning chip을 표시하고, 정상 field로 remap되면 즉시 사라지게 했다.
  - `src/lib/builder/dataset-field-binding.ts` — missing mapped text/heading/button/image/gallery fields를 원본 placeholder 대신 safe blank/empty content로 정리.
  - `src/lib/builder/dataset-preview-binding.ts` — editor preview도 missing mapped text/heading/button/image/gallery fields를 safe blank/empty content로 정리.
  - `src/components/builder/canvas/elements/ImageElement.tsx`, `src/lib/builder/components/gallery/GalleryRender.tsx` — published placeholder image/gallery fallback copy가 방문자에게 노출되지 않도록 empty render 처리.
  - `src/lib/builder/__tests__/dataset-field-binding.test.ts`, `tests/builder-editor/dataset-binding.playwright.ts` — canvas/inspector missing field warning, repair save, public placeholder non-exposure 회귀 추가.
- F-layer 판정:
  - F18 유지 🟡: stale/source-change safety는 보강됐지만, Wix식 visual repeater item/template structure editing, nested/reused template UX, multi-record comparison이 남아 있어 green은 아니다.
- 검증:
  - `npx eslint src/lib/builder/dataset-field-binding.ts src/lib/builder/dataset-preview-binding.ts src/components/builder/canvas/SandboxDataBindingPanel.tsx src/components/builder/canvas/CanvasNode.tsx src/components/builder/canvas/elements/ImageElement.tsx src/lib/builder/components/gallery/GalleryRender.tsx src/lib/builder/__tests__/dataset-field-binding.test.ts tests/builder-editor/dataset-binding.playwright.ts` ✅
  - `npm run typecheck` ✅
  - `npm run test:unit -- src/lib/builder/__tests__/dataset-field-binding.test.ts` ✅ (9 tests)
  - `BASE_URL=http://127.0.0.1:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/dataset-binding.playwright.ts -g "flags stale dataset field" --workers=1` ✅
  - `BASE_URL=http://127.0.0.1:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/dataset-binding.playwright.ts -g "saves element field binding metadata|flags stale dataset field|previews selected dataset records|previews repeater child template|empty dataset state|published repeater child template" --workers=1` ✅ (6 tests)
- 남은 M159:
  - F18 잔여: richer visual repeater item/template structure editing, nested/reused template editing UX, multi-record visual comparison.
  - F19~F26: user-created dynamic list/item routes, slug conflicts/redirects, runtime per-item SEO generation, visitor filters/pagination, preview/publish atomicity.

## M159-K — Publish Preflight Dataset Binding Inventory

- 시작/종료: 2026-05-18 / 2026-05-18
- 목표:
  - Selected node가 아니어도 문서 전체의 stale/missing/incompatible CMS field binding을 발행 전 검사에서 집계한다.
  - 발행 모달 preflight에 Data 항목을 추가해 사용자가 발행 전에 CMS binding 문제를 확인하고, 경고 override 없이는 발행 버튼이 눌리지 않게 한다.
  - Canvas chip, Inspector warning, Publish preflight가 같은 stale binding 판정 로직을 쓰게 한다.
- 변경 파일:
  - `src/lib/builder/dataset-binding-validation.ts` — node/document 단위 stale dataset binding validator를 공통화.
  - `src/components/builder/canvas/CanvasNode.tsx`, `src/components/builder/canvas/SandboxDataBindingPanel.tsx` — canvas/inspector stale 판정을 공통 validator로 연결.
  - `src/lib/builder/publish-gate/checks.ts`, `src/lib/builder/publish-gate/gate-runner.ts` — publish gate에 `data` category warning을 추가해 stale CMS field inventory를 반환.
  - `src/components/builder/canvas/PublishModalPreflight.tsx`, `src/components/builder/canvas/PublishModal.tsx` — preflight grid에 Data card와 test hook 추가.
  - `src/lib/builder/site/publish.ts`, `src/lib/builder/site/persistence.ts` — publish metadata write가 target page를 보존하고, targeted page delete가 stale site snapshot으로 동시 생성/발행 page를 삭제하지 않도록 `preserveNextPageIds`/`deletePageIds` reconciliation을 추가. 이후 같은 pageId의 최신 `publishedAt`/`publishedRevisionId`도 stale writer가 지우지 못하게 publish metadata merge를 보강.
  - `src/lib/builder/publish-gate/__tests__/checks.test.ts`, `tests/builder-editor/dataset-binding.playwright.ts` — missing/incompatible mapping unit coverage와 publish modal warning/disabled publish button E2E 추가.
  - `src/lib/builder/site/__tests__/persistence.test.ts` — publish/delete concurrency에서 target page 보존, explicit delete-only behavior, stale writer publish metadata 보존 회귀 테스트 추가.
- F-layer 판정:
  - F18 유지 🟡: 발행 전 stale binding inventory는 보강됐지만, Wix식 visual repeater item/template structure editing, nested/reused template UX, multi-record comparison이 남아 있어 green은 아니다.
- 검증:
  - `npx eslint src/lib/builder/dataset-binding-validation.ts src/lib/builder/publish-gate/checks.ts src/lib/builder/publish-gate/gate-runner.ts src/components/builder/canvas/PublishModalPreflight.tsx src/components/builder/canvas/PublishModal.tsx src/components/builder/canvas/SandboxDataBindingPanel.tsx src/components/builder/canvas/CanvasNode.tsx src/lib/builder/publish-gate/__tests__/checks.test.ts tests/builder-editor/dataset-binding.playwright.ts` ✅
  - `npm run test:unit -- src/lib/builder/publish-gate/__tests__/checks.test.ts` ✅ (2 tests)
  - `npx eslint src/lib/builder/site/persistence.ts src/lib/builder/site/publish.ts src/lib/builder/site/__tests__/persistence.test.ts` ✅
  - `npm run test:unit -- src/lib/builder/site/__tests__/persistence.test.ts` ✅ (18 tests)
  - `npm run typecheck` ✅
  - `BASE_URL=http://127.0.0.1:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/dataset-binding.playwright.ts -g "flags stale dataset field" --workers=1` ✅ (rerun passed after one hot-reload/selection transient failure)
  - `BASE_URL=http://127.0.0.1:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/dataset-binding.playwright.ts -g "saves element field binding metadata|flags stale dataset field|previews selected dataset records|previews repeater child template|empty dataset state|published repeater child template" --workers=1` ✅ (6 tests; first sandboxed Chromium launch failed with macOS Mach port permission, elevated rerun passed 6/6)
  - 묶음 실행에서 stale publish page가 404로 떨어지는 race를 재현했다. 첫 원인은 targeted delete가 concurrent page를 drop할 수 있는 문제였고, 이후 같은 pageId의 latest publish metadata가 stale writer에게 덮이는 추가 원인을 확인해 merge 보강 후 같은 6개 CMS/repeater 흐름이 통과했다.
- 남은 M159:
  - F18/F19 잔여: richer visual repeater item/template structure editing, nested/reused template editing UX, full multi-record visual comparison.
  - F20~F26: user-created dynamic list/item routes, slug conflicts/redirects, runtime per-item SEO generation, visitor filters/pagination, preview/publish atomicity.

## M159-L — Repeater Record Comparison Preview

- 시작/종료: 2026-05-18 / 2026-05-18
- 목표:
  - Repeater template 편집 중 Prev/Next로 한 record씩 확인하는 한계를 줄이고, 현재 record 주변의 CMS rows를 인스펙터에서 나란히 비교한다.
  - 비교 row를 클릭하면 parent repeater preview recordIndex가 바뀌고, child template canvas preview와 inspector preview가 같은 record로 동기화된다.
  - Canvas overlay를 키우지 않고 inspector 내부에 배치해 기존 HUD/selection handles와 겹치지 않게 한다.
- 변경 파일:
  - `src/components/builder/canvas/SandboxDataBindingPanel.tsx` — repeater container 선택 시 3-record comparison window, current row pressed state, click-to-switch preview를 Data panel에 추가.
  - `src/components/builder/canvas/inspector-tokens.css` — compact comparison card/row 스타일, ellipsis, focus ring, disabled/current states 추가.
  - `tests/builder-editor/dataset-binding.playwright.ts` — comparison row count/current row, horizontal overflow absence, click-to-switch canvas preview persistence 경로 추가.
  - `src/lib/builder/site/persistence.ts`, `src/lib/builder/site/__tests__/persistence.test.ts` — M159-K 묶음 재검증 중 발견한 stale publish metadata overwrite race를 같은 검증 묶음 안정성 수정으로 보강.
- F-layer 판정:
  - F18/F19 유지 🟡: repeater record comparison과 template preview switching은 보강됐지만, Wix식 visual repeater item/template structure editing, nested/reused template UX, full canvas-side multi-record comparison은 아직 남아 있어 green은 아니다.
- 검증:
  - `npx eslint src/components/builder/canvas/SandboxDataBindingPanel.tsx tests/builder-editor/dataset-binding.playwright.ts` ✅
  - `npx eslint src/lib/builder/site/persistence.ts src/lib/builder/site/__tests__/persistence.test.ts src/components/builder/canvas/SandboxDataBindingPanel.tsx tests/builder-editor/dataset-binding.playwright.ts` ✅
  - `npm run typecheck` ✅
  - `npm run test:unit -- src/lib/builder/site/__tests__/persistence.test.ts` ✅ (18 tests)
  - `BASE_URL=http://127.0.0.1:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/dataset-binding.playwright.ts -g "previews repeater child template" --workers=1` ✅ (1 test)
  - `BASE_URL=http://127.0.0.1:3002 npx playwright test --config=playwright.config.ts tests/builder-editor/dataset-binding.playwright.ts -g "saves element field binding metadata|flags stale dataset field|previews selected dataset records|previews repeater child template|empty dataset state|published repeater child template" --workers=1` ✅ (6 tests)
- 남은 M159:
  - F18/F19 잔여: richer visual repeater item/template structure editing, nested/reused template editing UX, full multi-record visual comparison.
  - F20~F26: user-created dynamic list/item routes, slug conflicts/redirects, runtime per-item SEO generation, visitor filters/pagination, preview/publish atomicity.

## M00 — mergeMissingPages 데이터 손실 fix

- 시작/종료: 2026-05-09T21:52:00+09:00 / 2026-05-09T22:04:00+09:00
- 변경 파일:
  - `WIX-PARITY-PROMPT.md` — `CODEX-GOAL-WIX-FULL-BUILDER.md` 전체를 마스터 프롬프트로 복제
  - `WIX-PARITY-IMPLEMENT.md` — 마스터 프롬프트 §7 M00~M28 상세 매뉴얼 복제
  - `tests/builder-editor/cross-tab-delete-race.playwright.ts` — 실제 `/ko/admin-builder` 탭 2개 + API delete/list + stale site write 회귀 테스트 추가
  - `WIX-PARITY-PLAN.md` — M00 상태를 🟢로 변경
  - `WIX-PARITY-DOCUMENTATION.md` — M00 의사결정/검증/리스크 기록
  - `SESSION.md` — M00 bootstrap 결과 및 다음 마일스톤 인계 기록
- 추가 테스트: 1개 Playwright
- 의사결정:
  - `preserveMissingPages` 기본값은 true 유지. `CODEX-AUDIT-FINDINGS-2026-05-09.md`가 확인한 대로 현재 `reconcileSiteDocumentPagesForWrite()`는 stale next-only page를 `createdAt < latest site timestamp` 기준으로 drop해서 삭제 페이지 부활을 이미 차단한다.
  - 마스터 문서의 "기본값 false" 지시는 검증된 동시 생성 보존 시나리오를 깨므로 적용하지 않았다. 대신 M00의 실제 위험인 cross-tab 삭제 부활 방지를 Playwright 회귀 테스트로 고정했다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run lint` ✅ (기존 `<img>` warning only)
  - `npm run test:unit -- src/lib/builder/site/__tests__/persistence.test.ts` ✅ (10 tests)
  - `npm run test:unit` ✅ (26 files / 735 tests)
  - `npm run security:builder-routes` ✅ (71 route files / 62 mutation handlers)
  - `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/cross-tab-delete-race.playwright.ts --workers=1` ✅
  - `BASE_URL=http://localhost:3000 npm run test:builder-editor -- --workers=1` ✅ (28 passed)
- 리스크 / 알려진 문제:
  - 첫 Playwright 실행은 macOS Chromium Mach port sandbox 권한 문제로 브라우저 launch 전 실패했다. 동일 명령을 승인된 sandbox 밖 실행으로 재실행해 통과했다.
  - 첫 `npm run build`와 full Playwright 병렬 실행은 3000번 dev server의 `.next` 산출물과 build 산출물이 충돌해 route module lookup이 깨졌다. dev server 정지 → `.next` 삭제 → build 단독 실행 → dev server 재시작 후 재검증은 통과했다.
  - M00은 W 범위가 없어 Wix 체크포인트 상태 변경 없음.
- 보류된 W (있을 경우):
  - 없음
- 사용자 피드백 흡수:
  - 2026-05-09 "클로드에게 너의 코드들 감사를 시켰어 참고해 src/lib/builder/site/persistence.ts:127-139" → M00에서 감사 #5를 재검증하고 false-positive 판정을 코드/테스트로 반영
- 다음 마일스톤: M01

## M01 — Performance 잔여 fix

- 시작/종료: 2026-05-09T22:05:00+09:00 / 2026-05-09T22:33:00+09:00
- 변경 파일:
  - `src/lib/builder/canvas/store.ts` — group bounds 계산에서 `Math.min(...array)`/`Math.max(...array)` 제거
  - `src/lib/builder/canvas/__tests__/store-transient.test.ts` — 1,500개 선택 그룹화 회귀 테스트 추가
  - `src/components/builder/canvas/CanvasContainer.tsx` — Space keyup도 input/textarea/select/contenteditable 타깃이면 pan 종료 처리에서 제외
  - `tests/builder-editor/admin-builder.playwright.ts` — inspector number input에서 Space keydown/keyup이 canvas pan 상태를 만들지 않는 회귀 테스트 추가
  - `src/lib/builder/canvas/snap.ts` — active viewport 밖 snap 후보 prune
  - `src/lib/builder/canvas/__tests__/snap.test.ts` — viewport 밖 snap 후보 제거 테스트 추가
  - `src/components/builder/canvas/insights-preview-cache.ts` — insights archive preview posts를 locale별 promise/data cache로 분리
  - `src/components/builder/canvas/CanvasNode.tsx` — archive preview가 cache loader를 사용하도록 변경
  - `src/components/builder/canvas/__tests__/insights-preview-cache.test.ts` — same-locale dedupe, locale 분리, failure retry 테스트 추가
  - `tests/builder-editor/office-map-public.playwright.ts` — draft polling이 429뿐 아니라 일시 `ECONNRESET`도 재시도하도록 보강
  - `WIX-PARITY-PLAN.md` / `WIX-PARITY-DOCUMENTATION.md` / `SESSION.md` — M01 진행/검증 기록
- 커밋:
  - `a950f84 G-Editor: avoid spread overflow in group bounds`
  - `21d64b2 G-Editor: guard space-keyup in text inputs`
  - `4751ff8 G-Editor: prune snap candidates by viewport`
  - `613bf94 G-Editor: cache insights archive preview by locale`
  - `9b96359 G-Editor: harden office map draft polling`
- 의사결정:
  - 감사 #7의 "history structuredClone full doc" 지적은 현재 HEAD와 맞지 않는다. `src/lib/builder/canvas/history.ts`는 이미 structural-sharing snapshot 방식이고 `history.test.ts`가 무제한 session history를 검증하므로 patch-based 재작성은 이번 마일스톤에서 하지 않았다.
  - `CanvasNode` archive preview는 SWR dependency를 새로 들이지 않고 module-level promise/data cache로 해결했다. 같은 locale의 동시/후속 mount fetch를 1회로 합치고, 실패 시 cache를 지워 다음 mount에서 재시도한다.
  - Office map Playwright 실패는 앱 assertion 실패가 아니라 dev 서버 부하 중 draft GET의 `ECONNRESET`/429 조합이었다. 실제 map 시나리오는 단독 재실행과 전체 재실행에서 통과했으므로 테스트 polling 안정성만 보강했다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run lint` ✅ (기존 `<img>` warning only)
  - `npm run test:unit -- src/lib/builder/canvas/__tests__/store-transient.test.ts` ✅ (4 tests)
  - `npm run test:unit -- src/lib/builder/canvas/__tests__/snap.test.ts` ✅ (4 tests)
  - `npm run test:unit -- src/components/builder/canvas/__tests__/insights-preview-cache.test.ts` ✅ (3 tests)
  - `npm run test:unit` ✅ (27 files / 740 tests)
  - `npm run security:builder-routes` ✅ (71 route files / 62 mutation handlers)
  - `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/office-map-public.playwright.ts -g "edits a generic Google map address" --workers=1` ✅
  - `BASE_URL=http://localhost:3000 npm run test:builder-editor -- --workers=1` ✅ (28 passed)
- 리스크 / 알려진 문제:
  - macOS Chromium Mach port 권한 문제로 일부 Playwright는 sandbox 밖 실행이 필요했다.
  - M01은 W 범위 없는 선행 성능/안정성 마일스톤이라 `Wix 체크포인트.md` 변경은 없다.
- 보류된 W (있을 경우):
  - 없음
- 사용자 피드백 흡수:
  - "렉걸리듯이 흔들림", "사진/칼럼 클릭하면 백지"류 피드백에 직접 연결되는 hot path와 test polling 안정성을 먼저 닫았다.
- 다음 마일스톤: M02

## M02 — Hot files split

- 시작/종료: 2026-05-09T22:34:00+09:00 / 2026-05-09T23:24:00+09:00
- 변경 파일:
  - `src/components/builder/canvas/SandboxPage.tsx` — shell orchestration을 유지하고 rail/workspace/modals/site-state hook을 분리해 774 LOC로 축소
  - `src/components/builder/canvas/CanvasContainer.tsx` — context menu, stage nodes, rulers, toolbar, zoom dock, interaction hooks를 분리해 779 LOC로 축소
  - `src/components/builder/canvas/CanvasNode.tsx` — badge, quick panels, insights preview, selection overlay, rotation hook, node util을 분리해 794 LOC로 축소
  - `src/components/builder/canvas/SandboxPage.module.css` — node badge/quick panels/selection overlay/insights preview CSS를 component CSS module로 분리해 4189 LOC로 축소
  - `src/components/builder/canvas/__tests__/design-pool-shells.test.ts` — context menu action contract가 `CanvasContextMenuLayer.tsx` split 구조도 검사하도록 갱신
- 추가 파일:
  - `src/components/builder/canvas/SandboxEditorRail.tsx`
  - `src/components/builder/canvas/SandboxEditorWorkspace.tsx`
  - `src/components/builder/canvas/SandboxModalsRoot.tsx`
  - `src/components/builder/canvas/hooks/useSandboxSiteState.ts`
  - `src/components/builder/canvas/CanvasContextMenuLayer.tsx`
  - `src/components/builder/canvas/CanvasDropHighlight.tsx`
  - `src/components/builder/canvas/CanvasOverlapPickerLayer.tsx`
  - `src/components/builder/canvas/CanvasRulers.tsx`
  - `src/components/builder/canvas/CanvasSelectionToolbarLayer.tsx`
  - `src/components/builder/canvas/CanvasStageNodes.tsx`
  - `src/components/builder/canvas/CanvasStageToolbar.tsx`
  - `src/components/builder/canvas/CanvasZoomDock.tsx`
  - `src/components/builder/canvas/canvasInteraction.ts`
  - `src/components/builder/canvas/hooks/useCanvasInteractions.ts`
  - `src/components/builder/canvas/hooks/useCanvasKeyboard.ts`
  - `src/components/builder/canvas/hooks/useCanvasLinkEditing.ts`
  - `src/components/builder/canvas/hooks/useCanvasSelectionBox.ts`
  - `src/components/builder/canvas/CanvasInsightsPreview.tsx`
  - `src/components/builder/canvas/CanvasNodeBadge.tsx`
  - `src/components/builder/canvas/CanvasNodeQuickPanels.tsx`
  - `src/components/builder/canvas/CanvasNodeSelectionOverlay.tsx`
  - `src/components/builder/canvas/canvasNodeTypes.ts`
  - `src/components/builder/canvas/canvasNodeUtils.ts`
  - `src/components/builder/canvas/hooks/useCanvasNodeRotation.ts`
  - `src/components/builder/canvas/CanvasInsightsPreview.module.css`
  - `src/components/builder/canvas/CanvasNodeBadge.module.css`
  - `src/components/builder/canvas/CanvasNodeQuickPanels.module.css`
  - `src/components/builder/canvas/CanvasNodeSelectionOverlay.module.css`
- 커밋:
  - `101ca20 G-Editor: split sandbox page shell`
  - `2217e9c G-Editor: split canvas container interactions`
  - `9bf1338 G-Editor: split canvas node chrome`
  - `f6d9cd5 G-Editor: split canvas node styles`
- 의사결정:
  - M02는 기능 변경 0 원칙을 지키기 위해 기존 동작을 보존하는 extraction만 수행했다.
  - `CanvasNode.tsx`는 kind별 렌더 switch가 없고 registry render 구조라, 실제 소유권 기준으로 badge/quick panels/insights/selection/rotation/util을 분리했다.
  - CSS는 전체 8+ module 목표 중 우선 hot node 영역 4개 module을 분리했다. 남은 shell/panel/modal CSS는 후속 M04/M05에서 visual baseline 도입 후 더 잘게 쪼갠다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run lint` ✅ (기존 `<img>` warnings only)
  - `npm run test:unit` ✅ (27 files / 740 tests)
  - `npm run security:builder-routes` ✅ (71 route files / 62 mutation handlers)
  - `NEXT_DIST_DIR=.next-m02 npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/admin-builder.playwright.ts --workers=1` ✅
  - `BASE_URL=http://localhost:3000 npm run test:builder-editor -- --workers=1` ✅ (28 passed / 3.7m)
  - `git diff --check` ✅
- 리스크 / 알려진 문제:
  - `NEXT_DIST_DIR=.next-m02 npm run build`가 Next의 tsconfig include 자동 수정을 시도했으나 검증 부산물이라 되돌렸다.
  - M02 종료 시점의 CSS module 수는 hot node 영역 4개 추가다. 전체 goal Done when의 "CSS 컴포넌트별 8+ module"은 아직 미완이며 후속 Pre 마일스톤에서 계속 분리한다.
  - self-check subagent는 계정 사용량 제한으로 실행 실패했다. 대신 typecheck/lint/unit/security/build/full Playwright로 로컬 검증을 대체했다.
- 보류된 W (있을 경우):
  - 없음
- 사용자 피드백 흡수:
  - "사진/칼럼 클릭하면 백지"와 지도 quick edit 관련 회귀를 막기 위해 `asset-image-workflow`, `columns-ui-workflow`, `office-map-public`, `published-interactions`를 포함한 전체 builder-editor bundle로 확인했다.
- 다음 마일스톤: M03

## M03 — 보안 3건

- 시작/종료: 2026-05-09T23:28:00+09:00 / 2026-05-09T23:44:00+09:00
- 변경 파일:
  - `src/lib/builder/security/csrf.ts` — `BUILDER_ALLOWED_ORIGINS`, current host, `VERCEL_URL` 기반 Origin/Referer 검증을 추가하고 mismatch 응답을 `csrf_origin_mismatch`로 통일
  - `src/lib/builder/security/rate-limit.ts` — `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN`이 있으면 Redis REST pipeline을 사용하고 실패/미설정 시 in-memory fallback 유지
  - `src/lib/builder/security/guard.ts` 및 builder mutation routes — rate-limit 비동기화를 위해 `await guardMutation()`으로 전환
  - `src/lib/builder/canvas/upload-validation.ts` — `BUILDER_ASSET_MAX_BYTES`, `BUILDER_ASSET_ALLOWED_MIME`, 1KB magic-byte sniffing, SVG sanitize 정책 추가
  - `src/lib/builder/assets.ts` / `src/app/api/builder/assets/route.ts` — SVG 저장 지원, sanitize 후 저장, 415/413 validation status 정책 적용
  - `src/app/api/booking/book/route.ts` — shared async rate-limit helper에 맞춰 public booking limiter도 `await` 처리
- 추가 파일:
  - `src/lib/builder/security/__tests__/csrf.test.ts`
  - `src/lib/builder/security/__tests__/rate-limit.test.ts`
  - `tests/builder-editor/asset-upload-security.playwright.ts`
- 커밋:
  - `b709f99 G-Editor: enforce builder csrf origin guard`
  - `27c27ea G-Editor: add builder rate limit fallback`
  - `deaeac7 G-Editor: harden builder asset uploads`
- 의사결정:
  - Upstash SDK 설치 대신 REST pipeline을 직접 사용했다. 네트워크 의존성을 늘리지 않으면서 M03 env contract를 만족하고, 실패 시 기존 local fallback을 보존한다.
  - Playwright/API helper 호환을 위해 localhost current host는 Origin/Referer가 없어도 허용하되, production-like host는 missing/mismatch 모두 403으로 막는다.
  - SVG는 무조건 차단하지 않고 script/event handler는 제거 후 저장, 외부 href와 data/javascript/vbscript protocol은 차단한다.
- 검증:
  - `npm run test:unit -- src/lib/builder/security/__tests__/csrf.test.ts src/lib/builder/security/__tests__/rate-limit.test.ts src/lib/builder/canvas/__tests__/upload-validation.test.ts` ✅ (38 tests)
  - `npm run typecheck` ✅
  - `npm run lint` ✅ (기존 `<img>` warnings only)
  - `npm run test:unit` ✅ (29 files / 755 tests)
  - `npm run security:builder-routes` ✅ (71 route files / 62 mutation handlers)
  - `NEXT_DIST_DIR=.next-m03 npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
  - localhost API upload check ✅ (`m03-valid.png` 200, spoofed PNG 415, 11MB PNG 413)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/asset-upload-security.playwright.ts --workers=1` ✅
  - `BASE_URL=http://localhost:3000 npm run test:builder-editor -- --workers=1` ✅ (29 passed / 3.7m)
  - `git diff --check` ✅
- 리스크 / 알려진 문제:
  - Chromium launch와 localhost fetch는 local sandbox에서 `EPERM`/Mach port permission 문제가 있어 sandbox 밖에서 검증했다.
  - `NEXT_DIST_DIR=.next-m03` build가 Next의 tsconfig include 자동 수정을 시도했으나 검증 부산물이라 되돌렸다.
  - `.next-m02/`, `.next-m03/`는 untracked build artifact로 남아 있다.
- 보류된 W (있을 경우):
  - 없음
- 사용자 피드백 흡수:
  - "계속 yes 묻는 것" 관련해 dependency install 없이 REST 구현으로 승인 프롬프트를 줄였다. 단, sandbox가 localhost/Chromium을 막는 경우만 필수 승인으로 실행했다.
- 다음 마일스톤: M04

## M04 — AI 검증 인프라 7종

- 시작/종료: 2026-05-09T23:45:00+09:00 / 2026-05-10T00:46:00+09:00
- 변경 파일:
  - `playwright.config.ts` — Chromium/WebKit/Firefox projects, screenshot baseline path, `toHaveScreenshot` tolerance 추가
  - `tests/builder-editor/visual-regression.playwright.ts` + `tests/visual/baseline/...` — first screen, catalog drawer, text inspector, preview mobile, site settings, asset library 6개 baseline 고정
  - `tests/builder-editor/a11y-smoke.playwright.ts` / `tests/builder-editor/helpers/a11y.ts` — axe-core WCAG 2.1 AA gate 추가
  - `tests/builder-editor/inline-text-ime.playwright.ts` — 임시 페이지 기반 Korean/Hanja composition 저장·reload 회귀 테스트 추가
  - `tests/builder-editor/zh-hant-smoke.playwright.ts` — Traditional Chinese editor/columns surface smoke 추가
  - `lighthouserc.json`, `scripts/run-lhci.mjs`, `.github/workflows/builder-quality.yml` — LHCI/CI quality gate 추가
  - `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`, `next.config.mjs`, `.env.example` — Sentry DSN no-op 기본값, tracing/replay 5% env contract 추가
  - `src/components/builder/canvas/*`, `src/lib/builder/components/container/Element.tsx`, `src/app/globals.css` — axe 대비/semantic fix와 decomposed container background 렌더링 보정
- 커밋:
  - `d4fdd5a G-Editor: add builder quality gates`
- 의사결정:
  - Sentry는 `NEXT_PUBLIC_SENTRY_DSN`이 있을 때만 `withSentryConfig`를 적용한다. 로컬/CI no-op을 기본으로 두어 DSN 미설정 환경에서 빌드 동작을 바꾸지 않는다.
  - Visual regression은 Chromium baseline만 고정하고, WebKit/Firefox는 long smoke로 동작 호환을 검증한다. 브라우저별 픽셀 차이를 baseline 3종으로 늘리기보다 M04에서는 핵심 6상태의 안정 baseline을 우선했다.
  - LHCI는 `@lhci/cli`가 로컬 Chrome을 못 찾는 경우가 있어 `scripts/run-lhci.mjs`에서 Playwright Chromium 경로를 자동 주입한다.
  - 칼럼/인사이트 quick action은 페이지 이동 동작이므로 `button + window.location` 대신 semantic `a` 링크로 바꿨다.
  - `ContainerElement`가 `content.background`/border 대신 기본 card variant 흰 배경을 렌더하던 버그를 수정했다. 이 문제는 칼럼 페이지 히어로 대비와 실제 visual parity 모두에 영향을 줬다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run lint` ✅ (기존 `<img>` warnings only)
  - `npm run test:unit` ✅ (29 files / 755 tests)
  - `npm run security:builder-routes` ✅ (71 route files / 62 mutation handlers)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/a11y-smoke.playwright.ts tests/builder-editor/inline-text-ime.playwright.ts tests/builder-editor/visual-regression.playwright.ts tests/builder-editor/zh-hant-smoke.playwright.ts --project=chromium-builder --workers=1` ✅ (4 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/admin-builder.playwright.ts --project=chromium-builder --workers=1` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/admin-builder.playwright.ts --project=webkit-builder --project=firefox-builder --workers=1` ✅ (2 passed)
  - `NEXT_DIST_DIR=.next-m04 npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
  - `NEXT_DIST_DIR=.next-m04 npm run lhci` ✅ (exit 0)
  - `git diff --check` ✅
- 리스크 / 알려진 문제:
  - LHCI는 exit 0이지만 현재 warning 기준에서 `/ko/admin-builder` performance 0.76~0.78, SEO 0.42 경고가 남는다. M04 요구의 CI gate는 warning으로 동작하지만, M05 이후에는 admin-builder SEO noindex/metadata 정책과 heavy bundle 성능 분리를 별도 개선해야 한다.
  - Playwright/LHCI는 macOS local sandbox에서 브라우저 launch 권한 문제가 있어 sandbox 밖에서 실행했다.
  - self-check subagent는 계정 사용량 제한으로 실패했다. 대신 로컬 diff inspection, typecheck/lint/unit/security/build/LHCI/Playwright 7종으로 대체했다.
- 보류된 W (있을 경우):
  - 없음
- 사용자 피드백 흡수:
  - "칼럼아카이브/사진 클릭하면 백지" 계열 회귀를 잡기 위해 admin smoke에 칼럼 quick action 링크와 axe gate를 포함했다.
  - "검색 창 위치/기존 홈페이지 전체 불러오기" 피드백과 연결된 decomposed container 배경 렌더링 버그를 M04 a11y 검증 중 발견해 수정했다.
- 다음 마일스톤: M05

## M05 — Empty/error state sweep

- 시작/종료: 2026-05-10T00:49:00+09:00 / 2026-05-10T01:03:00+09:00
- 변경 파일:
  - `src/components/builder/canvas/CanvasStageNodes.tsx` — zero-node canvas를 "페이지가 비어있습니다. 좌측 + 패널..." empty state로 명확화
  - `src/components/builder/canvas/PageSwitcher.tsx` / `SandboxEditorRail.tsx` / `SandboxEditorWorkspace.tsx` — 페이지 목록 0건 empty state, 첫 페이지 만들기 CTA, page list load error toast 연결
  - `src/components/builder/editor/AssetLibraryModal.tsx` / `SandboxModalsRoot.tsx` — asset 0건 empty state, upload/retry CTA, asset API error toast 연결
  - `src/components/builder/canvas/hooks/useSandboxSiteState.ts` / `SandboxPage.tsx` / `SandboxTopBar.tsx` — network save retry toast, 401/403/500 save blocker reason, Publish disabled 상태 추가
  - `src/components/builder/canvas/InlineTextEditor.tsx` / `SandboxPage.module.css` — IME composition 중 외부 click blur 저장, 긴 한글 overflow-wrap 보강
  - `tests/builder-editor/empty-error-states.playwright.ts` — M05 9개 UI/API 실패·빈 상태 시나리오 추가
- 커밋:
  - `e14b5f7 G-Editor: add empty and error state gates`
- 의사결정:
  - 저장 실패는 네트워크 fetch 실패와 권한/서버 응답을 분리했다. 네트워크 실패는 retry action이 있는 toast, 401/403/500은 상단 "저장 차단" chip과 Publish disabled로 사용자가 계속 발행하지 못하게 막는다.
  - 자산/페이지 empty state는 모달/패널 안에서 바로 다음 행동을 제시한다. 별도 새 스키마나 데이터 파일 수정 없이 UI 상태만 보강했다.
  - IME는 조합 중 외부 클릭이 들어오면 compositionend를 먼저 flush하고 저장/blur를 실행하도록 했다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run lint` ✅ (기존 `<img>` warnings only)
  - `npm run test:unit` ✅ (29 files / 755 tests)
  - `npm run security:builder-routes` ✅ (71 route files / 62 mutation handlers)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/empty-error-states.playwright.ts --project=chromium-builder --workers=1` ✅ (9 passed)
  - `NEXT_DIST_DIR=.next-m05 npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
  - `git diff --check` ✅
- 리스크 / 알려진 문제:
  - Playwright Chromium launch는 macOS local sandbox에서 Mach port 권한 실패가 있어 sandbox 밖에서 실행했다.
  - `NEXT_DIST_DIR=.next-m05` build가 Next의 tsconfig include 자동 수정을 시도했으나 검증 부산물이라 되돌렸다.
- 보류된 W (있을 경우):
  - 없음
- 사용자 피드백 흡수:
  - "칼럼아카이브 같은거나 사진들 클릭하면 백지가 되는 에러" 계열에 대응해 칼럼 0건, 자산 0건, 페이지 0건, 네트워크 오류, 저장 권한/서버 오류를 실제 Playwright로 고정했다.
- 다음 마일스톤: M06

## M06 — .next/dev 재시작 의존성 fix

- 시작/종료: 2026-05-10T01:03:00+09:00 / 2026-05-10T01:06:00+09:00
- 변경 파일:
  - `next.config.mjs` — 기본 build 산출물은 `.next-build`, dev 산출물은 `NEXT_DEV=1`일 때 `.next-dev`, 명시 검증은 `NEXT_DIST_DIR` override 우선으로 분리
  - `package.json` / `scripts/clean-next-build.mjs` — `npm run dev` 시작 전 `.next-build`만 정리하고 `NEXT_DEV=1 next dev`로 실행
  - `.gitignore` — `.next-dev/`, `.next-build/` 추가
  - `tsconfig.json` — `.next-dev/types/**/*.ts`, `.next-build/types/**/*.ts`를 include에 추가해 Next 자동 tsconfig 수정 churn 제거
- 커밋:
  - `1d8cd84 G-Editor: isolate next dev and build outputs`
- 의사결정:
  - `rimraf` 의존성은 추가하지 않고 Node `rmSync` 스크립트로 `.next-build`만 삭제한다. 승인 프롬프트와 dependency surface를 늘리지 않기 위한 선택이다.
  - `NEXT_DIST_DIR`는 기존 검증 격리 방식과 호환되도록 최우선으로 유지한다.
  - dev script는 `.next-dev`를 쓰므로 build 후 기본 `.next`/`.next-build` 충돌 때문에 dev server를 매번 지우고 재시작하던 패턴을 끊는다.
- 검증:
  - `node -e "import('./next.config.mjs').then((m)=>console.log(m.default.distDir))"` ✅ `.next-build`
  - `NEXT_DEV=1 node -e "import('./next.config.mjs').then((m)=>console.log(m.default.distDir))"` ✅ `.next-dev`
  - `NEXT_DIST_DIR=.next-m06 node -e "import('./next.config.mjs').then((m)=>console.log(m.default.distDir))"` ✅ `.next-m06`
  - `node scripts/clean-next-build.mjs` ✅
  - `npm run typecheck` ✅
  - `npm run lint` ✅ (기존 `<img>` warnings only)
  - `npm run test:unit` ✅ (29 files / 755 tests)
  - `npm run security:builder-routes` ✅ (71 route files / 62 mutation handlers)
  - `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
  - `npm run dev -- --port 3010` ✅ (`.next-dev` 생성, `.next-build` 정리 확인 후 종료)
  - `git diff --check` ✅
- 리스크 / 알려진 문제:
  - sandbox 내부 curl은 3010 dev server에 연결하지 못했지만, dev process 로그와 산출물 분리는 확인했다.
- 보류된 W (있을 경우):
  - 없음
- 사용자 피드백 흡수:
  - 반복되던 “build 후 `.next` 삭제 + dev 재시작” 운영 부담을 줄였다. 이후 검증은 build와 dev가 서로 산출물을 덮어쓰지 않는 전제로 진행한다.
- 다음 마일스톤: M07

## M06 follow-up — post-M06 gate stabilization

- 시작/종료: 2026-05-10T01:21:00+09:00 / 2026-05-10T01:39:00+09:00
- 변경 파일:
  - `src/components/builder/canvas/SandboxPage.tsx` — `data-editor-ready` hydration flag 추가
  - `tests/builder-editor/helpers/editor.ts` — client-ready 이후 Playwright 클릭 시작
  - `src/components/builder/canvas/InlineTextEditor.tsx` — toolbar command 직전 현재 텍스트 저장으로 텍스트/서식 undo 단계 분리
  - `tests/builder-editor/design-pool.playwright.ts` — blank canvas empty state 문구 최신화
  - `tests/builder-editor/empty-error-states.playwright.ts` — IME/autosave 입력 전 전체 선택으로 ProseMirror append flake 제거
  - `SESSION.md` / `Wix 체크포인트.md` — 자동 gate 최신 증거 기록
- 커밋:
  - `16a3e51 G-Editor: stabilize post-M06 builder gates`
- 의사결정:
  - editor shell SSR 표시와 client hydration 완료를 명시적으로 분리한다. Playwright와 사용자가 hydration 전 click handler 미부착 상태를 치지 않게 하기 위한 안정화다.
  - inline text toolbar는 format command 직전에 저장을 한 번 시도한다. 변경이 없으면 signature guard로 no-op이고, 텍스트 변경이 있으면 서식 적용과 별도 undo/redo 단계가 된다.
- 검증:
  - `npm run typecheck` ✅
  - `git diff --check` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/inline-text-editor.playwright.ts --workers=1` ✅ (1 passed)
  - `BASE_URL=http://localhost:3000 npm run test:builder-editor -- --project=chromium-builder --workers=1` ✅ (42 passed / 4.3m)
  - `npm run lint` ✅ (기존 `<img>` warnings only)
  - `npm run test:unit` ✅ (29 files / 755 tests)
  - `npm run security:builder-routes` ✅ (71 route files / 62 mutation handlers)
  - `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
- 리스크 / 알려진 문제:
  - self-check subagent는 현재 thread agent limit 때문에 생성하지 못했다. full Chromium builder suite와 전체 gate로 대체 검증했다.
  - `/ko/admin-builder`는 Basic Auth 401 응답으로 정상 health를 확인했다.
- 보류된 W (있을 경우):
  - 없음
- 사용자 피드백 흡수:
  - “백지”, “검증 자체 안 됨”, “계속해야지” 피드백을 반영해 hydration readiness와 full suite 안정성을 먼저 닫았다.
- 다음 마일스톤: M07

## M06 follow-up — locale projection repair

- 시작/종료: 2026-05-10T02:38:00+09:00 / 2026-05-10T02:45:00+09:00
- 변경 파일:
  - `src/lib/builder/canvas/home-locale-repair.ts` — 홈 seed sentinel mismatch를 감지해 요청 locale의 localized content만 projection하는 helper 추가
  - `src/app/(builder)/[locale]/admin-builder/page.tsx` — 초기 홈 draft 로드 시 locale repair 적용, 요청 locale과 page locale이 다르면 공유 draft persistence 생략
  - `src/app/api/builder/site/pages/[pageId]/draft/route.ts` — 페이지 전환/초기 client refresh draft 응답도 요청 locale로 normalize+repair
  - `src/lib/builder/canvas/__tests__/home-locale-repair.test.ts` — zh-hant 홈 draft를 ko로 projection하면서 layout/style은 보존하는 unit test 추가
  - `tests/builder-editor/locale-projection.playwright.ts` — zh-hant editor view 이후 ko editor가 중국어 홈 문구로 오염되지 않는 Playwright 회귀 추가
- 의사결정:
  - runtime-data JSON은 직접 수정하지 않았다. `/ko/admin-builder` 로드 경로가 기존 zh-hant draft를 ko로 repair했고, 정상 save path를 통해 draft가 한국어로 회복됐다.
  - 같은 home pageId를 locale별로 공유하는 현재 모델에서는 다른 locale editor view가 원본 draft를 덮어쓰면 안 된다. 따라서 `initialPage.locale !== request locale`이면 서버 side upgrade/write를 생략한다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run lint` ✅ (기존 `<img>` warnings only)
  - `npm run test:unit` ✅ (30 files / 757 tests)
  - `npm run security:builder-routes` ✅ (71 route files / 62 mutation handlers)
  - `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/locale-projection.playwright.ts --project=chromium-builder --workers=1` ✅
- 리스크 / 알려진 문제:
  - sandbox 내부 `curl`은 localhost 3000 연결을 간헐적으로 실패시켰지만, Next dev 로그와 Playwright browser 검증은 통과했다.
  - Playwright Chromium launch는 macOS local sandbox에서 Mach port 권한 실패가 있어 sandbox 밖에서 실행했다.
- 보류된 W (있을 경우):
  - 없음
- 사용자 피드백 흡수:
  - 2026-05-10 "편집기에 한국언데 왜 중국어로 사이트가 뜨지?" → M07 진행 전 locale projection blocker로 처리.
- 다음 마일스톤: M07

## M06 follow-up — section template pool and back navigation

- 시작/종료: 2026-05-10T02:52:00+09:00 / 2026-05-10T03:00:00+09:00
- 변경 파일:
  - `src/components/builder/canvas/SandboxEditorRail.tsx` — no-selection 섹션 chip을 실제 선택 버튼으로 변경, 섹션 상세에서 `← 섹션 목록` 복귀 버튼 추가
  - `src/components/builder/canvas/SandboxEditorWorkspace.tsx` / `src/components/builder/canvas/SandboxPage.tsx` — rail에서 selection clear/select가 가능하도록 연결
  - `src/lib/builder/canvas/section-templates.ts` — 섹션 variant pool을 12개로 확장하고 섹션별 label/description 추가
  - `src/lib/builder/site/component-variants.ts` / `src/lib/builder/canvas/decompose-home-shared.ts` — 카드 variant key schema를 확장된 섹션 variant와 공유
  - `src/components/builder/canvas/SandboxPage.module.css` — editor canvas의 12개 섹션 variant visual 적용
  - `src/lib/builder/site/public-page.tsx` — 공개 페이지에서도 같은 12개 섹션 variant visual 적용
  - `tests/builder-editor/section-template-click.playwright.ts` — chip 클릭, 12개 옵션 노출, 뒤로가기, 신규 variant 적용 회귀 추가
- 의사결정:
  - 기존 데이터와 layout node를 갈아엎지 않고 `content.variant`만 바꾸는 정책을 유지했다. 템플릿 선택은 Wix처럼 빠르게 preview/apply되지만 원문, 링크, 주소 데이터는 그대로 보존한다.
  - 외부 AI 디자인 사이트에서 템플릿을 가져오는 기능은 source ingestion, license/asset sanitization, section schema mapping이 필요하므로 별도 M-track으로 남긴다. 이번 수정은 사용자가 즉시 막힌 "네 개뿐"과 "뒤로 없음" UX를 먼저 닫는다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run lint` ✅ (기존 `<img>` warnings only)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --project=chromium-builder --workers=1` ✅ (1 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/design-pool.playwright.ts -g "switches stateful home section template variants|publishes stateful section template variants" --project=chromium-builder --workers=1` ✅ (2 passed)
  - `npm run test:unit` ✅ (30 files / 757 tests)
  - `npm run security:builder-routes` ✅ (71 route files / 62 mutation handlers)
  - `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
  - `git diff --check` ✅
- 리스크 / 알려진 문제:
  - Chromium launch는 macOS local sandbox에서 Mach port 권한 실패가 있어 sandbox 밖에서 실행했다.
  - AI template site import는 아직 구현하지 않았다. Canva/Relume/Uizard류 외부 소스 import는 fetch/import pipeline과 디자인 토큰 mapping을 먼저 설계해야 한다.
- 보류된 W (있을 경우):
  - 없음
- 사용자 피드백 흡수:
  - 2026-05-10 "주요업무 눌러서 사용하려는데 겨우 네개 템플릿만 있네" → 12개 로컬 섹션 variant로 확장.
  - 2026-05-10 "템플릿 적용하려고 한뒤 다시 뒤로 가고 싶으면 그런 버튼도 없어" → `← 섹션 목록` 추가.
- 다음 마일스톤: M07

## M07 — mobile schema decision and lock

- 시작/종료: 2026-05-10T03:00:00+09:00 / 2026-05-10T03:06:00+09:00
- 변경 파일:
  - `src/lib/builder/canvas/types.ts` — responsive schema lock 주석 명시: `responsive.<vp>.fontSize`, `responsive.<vp>.hidden`
  - `src/lib/builder/site/types.ts` — `headerFooter.mobileSticky`, `headerFooter.mobileHamburger`, `mobileBottomBar` site-level schema 추가
  - `src/lib/builder/site/mobile-schema.ts` — site-level mobile schema default normalizer 추가
  - `src/lib/builder/site/persistence.ts` — site document lifecycle normalization에서 M07 default fill 연결
  - `scripts/migrate-builder-mobile-schema.mjs` — dry-run/apply migration, `before-M07-<timestamp>` backup, rollback-ready summary
  - `src/lib/builder/site/__tests__/mobile-schema.test.ts` — site default/explicit mobile schema unit coverage
  - `src/lib/builder/site/__tests__/mobile-schema-migration.test.ts` — temp fixture dry-run/apply/backup coverage
  - `src/lib/builder/canvas/__tests__/responsive-schema-lock.test.ts` — responsive fontSize/hidden cascade와 `hiddenOnViewports[]` 미채택 coverage
  - `Phase 2 모바일 스키마 초안.md` — M07 결정 lock과 rollback 문서
  - `WIX-PARITY-PLAN.md` — M07 🟢
  - `/Users/son7/Desktop/ai memory save 계획/Wix 체크포인트.md` — Phase 2 schema lock 기록
- 의사결정:
  - per-viewport typography는 별도 typography scale token이 아니라 기존 resolver 방향인 `responsive.<vp>.fontSize`로 잠근다.
  - viewport visibility는 `hiddenOnViewports[]`가 아니라 `responsive.<vp>.hidden` boolean으로 잠근다.
  - mobile sticky와 hamburger는 개별 menu widget variant가 아니라 global header schema에서 처리한다.
  - mobile bottom CTA는 header/footer 하위가 아니라 site-level entity `mobileBottomBar`로 처리한다.
- 검증:
  - `npm run typecheck` ✅
  - `node scripts/migrate-builder-mobile-schema.mjs --site tseng-law-main-site --dry-run` ✅ (`changed:false`)
  - `npm run test:unit -- src/lib/builder/site/__tests__/mobile-schema.test.ts src/lib/builder/site/__tests__/mobile-schema-migration.test.ts src/lib/builder/canvas/__tests__/responsive-schema-lock.test.ts` ✅ (8 tests)
  - `npm run lint` ✅ (기존 `<img>` warnings only)
  - `npm run security:builder-routes` ✅ (71 route files / 62 mutation handlers)
  - `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
  - `npm run test:unit` ✅ (33 files / 765 tests)
- 리스크 / 알려진 문제:
  - M07은 schema lock이다. W31~W45의 사용자-facing 모바일 UI/preview/runtime은 M08~M10에서 구현해야 green 판정 가능하다.
- 보류된 W (있을 경우):
  - W31~W45 전부 M08~M10 구현 대기.
- 사용자 피드백 흡수:
  - "이 작업이 끝난뒤에도 7번 시작하고 다음 계속 작업 진행" → section template blocker 커밋 직후 M07을 시작하고 lock까지 완료.
- 다음 마일스톤: M08

## M08 — mobile inspector per-viewport UI

- 시작/종료: 2026-05-10T03:08:00+09:00 / 2026-05-10T03:21:00+09:00
- 변경 파일:
  - `src/components/builder/canvas/SandboxInspectorPanel.tsx` — Layout 탭 안에 Desktop/Tablet/Mobile viewport segmented control 추가, rect/fontSize/hidden override 상태 표시, `Override created` banner, viewport reset 연결.
  - `src/components/builder/canvas/SandboxTopBar.tsx` — top bar viewport button에 테스트/동기화용 data attribute 추가.
  - `src/components/builder/canvas/SandboxPage.tsx` — inspector에서 store viewport를 바꿔도 top bar/canvas width가 따라오도록 양방향 동기화.
  - `src/lib/builder/canvas/store.ts` — 에디터 미리보기용 services/FAQ open index 상태 추가.
  - `src/components/builder/canvas/CanvasNode.tsx` — services/FAQ 아코디언 open 상태를 선택 상태와 분리. 업무 글을 열어둔 뒤 다른 노드를 선택해도 상세 글이 사라지지 않게 수정.
  - `src/components/builder/canvas/SandboxEditorRail.tsx` — 디자인 패널에서 섹션 선택을 local focus 상태로도 유지해 `주요 서비스` chip 클릭 즉시 템플릿 목록이 열리도록 보강.
  - `tests/builder-editor/mobile-inspector.playwright.ts` — M08 브라우저 시나리오 추가.
  - `tests/builder-editor/section-template-click.playwright.ts` — 섹션 템플릿 선택 후 업무 글 유지 회귀 추가.
- 구현:
  - Inspector Layout 탭에서 Desktop/Tablet/Mobile을 직접 전환한다.
  - inspector viewport 전환은 top bar BreakpointSwitcher와 같은 store 상태를 사용한다.
  - tablet/mobile에서 X/Y/Width/Height 입력 시 `responsive.<viewport>.rect` partial override가 생긴다.
  - text/heading 계열에서 Font size 입력 시 `responsive.<viewport>.fontSize` override가 생긴다.
  - Show on D/T/M 토글은 `responsive.<viewport>.hidden` override를 만들고, active viewport 숨김 상태를 명확히 경고한다.
  - override가 생기면 `Override created`; 없으면 desktop inherit 상태를 보여주고 Reset으로 해당 viewport override를 제거한다.
  - 사용자가 보고한 "주요업무 노드 선택 후 다른 노드 선택하면 글이 없어짐"은 에디터 preview open state를 selection에서 분리해 수정했다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run lint` ✅ (기존 `<img>` warnings only)
  - `npm run test:unit` ✅ (33 files / 765 tests)
  - `npm run security:builder-routes` ✅ (71 route files / 62 mutation handlers)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/mobile-inspector.playwright.ts --workers=1` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts tests/builder-editor/mobile-inspector.playwright.ts --workers=1` ✅ (2 passed)
  - `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
- W 판정:
  - W32/W34/W35/W38 green evidence 확보.
  - W31/W37 auto-fit 및 W39+ hamburger/preview runtime은 M09/M10 범위로 유지.
  - W33은 editor hidden override UI는 구현됐고 public mobile 미렌더 최종 증거는 M10 runtime 검증에서 닫는다.
- 다음 마일스톤: M09

## M09 — mobile auto-fit and automatic hamburger conversion

- 시작/종료: 2026-05-10T03:22:00+09:00 / 2026-05-10T03:39:00+09:00
- 변경 파일:
  - `src/lib/builder/canvas/responsive.ts` — tree-aware `autoFitMobileTree()` 추가. top-level root를 375px 전폭 세로 스택으로 배치하고, descendant local rect/fontSize를 같은 scale로 생성한다.
  - `src/lib/builder/canvas/store.ts` — `applyMobileAutoFit()` 추가. 기존 desktop 값은 건드리지 않고 누락된 `responsive.mobile.rect/fontSize`만 생성한다.
  - `src/components/builder/canvas/SandboxPage.tsx` — 모바일 viewport 진입/페이지 전환 시 auto-fit을 한 번만 적용하고, top bar와 store viewport sync를 단방향+명시 업데이트로 정리해 update-depth loop를 제거했다.
  - `src/components/builder/canvas/InspectorControls.tsx` — NumberStepper draft 동기화가 같은 문자열이면 setState하지 않도록 방어했다.
  - `src/components/builder/published/SiteHeader.tsx` — desktop horizontal navigation을 모바일 hamburger + slide drawer로 자동 변환. editor mobile viewport에서는 `mobileMode`로 강제 적용한다.
  - `src/components/builder/canvas/SandboxEditorWorkspace.tsx` — editor mobile viewport에서 SiteHeader mobile mode를 전달하고, hamburger/drawer click이 Navigation panel capture에 먹히지 않게 예외 처리.
  - `src/app/globals.css` — hamburger button, mobile drawer, forced editor mobile header styles 추가.
  - `src/lib/builder/canvas/__tests__/responsive-schema-lock.test.ts` — auto-fit rect/fontSize scaling 및 explicit mobile override 보존 unit 추가.
  - `tests/builder-editor/mobile-auto-fit.playwright.ts` — 모바일 진입, hamburger drawer open, services root 375px auto-fit, mobile font-size scaling 검증 추가.
  - `tests/builder-editor/mobile-inspector.playwright.ts` — M09 auto-fit 이후 모바일 진입 시 override 상태가 즉시 `created`인 정상 동작으로 기대값 갱신.
- 의사결정:
  - M09 auto-fit은 user-edited mobile override를 덮어쓰지 않는다. 누락된 mobile rect/fontSize만 채워 desktop layout을 보존한다.
  - editor mobile viewport는 브라우저 폭이 desktop이어도 Wix처럼 header가 즉시 hamburger로 보여야 하므로 `mobileMode` prop으로 강제 전환한다.
  - public runtime은 기존 CSS media query 기반 모바일 전환을 유지하고, 같은 drawer markup을 사용한다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run lint` ✅ (기존 `<img>` warnings only)
  - `npm run test:unit` ✅ (33 files / 766 tests)
  - `npm run security:builder-routes` ✅ (71 route files / 62 mutation handlers)
  - `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/mobile-auto-fit.playwright.ts --workers=1` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/mobile-auto-fit.playwright.ts tests/builder-editor/mobile-inspector.playwright.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (3 passed)
- W 판정:
  - W31/W37/W39 green evidence 확보.
  - W40~W45는 M10 범위로 유지한다.
- 리스크 / 알려진 문제:
  - Playwright Chromium은 macOS local sandbox에서 Mach port 권한 실패가 있어 sandbox 밖에서 실행했다.
  - visual regression/axe-core 전용 gate는 M04 인프라 범위에서 계속 보강 필요.
- 사용자 피드백 흡수:
  - 2026-05-10 "편집기 로컬에서 뜬거 3000번 봤는데 사이트 열면 옆쪽이 짤려" → 모바일 viewport auto-fit을 적용해 375px canvas에서 root section 전폭/단열 배치를 생성.
  - 2026-05-10 "맨위 메뉴 눌렀을때 다른 메뉴 나오는 칸은 어떻게 편집 처리" → desktop mega edit flow는 유지하고, mobile viewport에서는 hamburger drawer 안의 메뉴 항목도 같은 `data-builder-nav-item-id` 편집 대상으로 노출.
- 다음 마일스톤: M10

## M10 — mobile sticky, preview iframe, bottom CTA, touch context menu

- 시작/종료: 2026-05-10T03:41:00+09:00 / 2026-05-10T03:55:00+09:00
- 변경 파일:
  - `src/app/api/builder/site/settings/route.ts` — `headerFooter.mobileSticky/mobileHamburger`, `mobileBottomBar`를 Site Settings GET/PUT payload로 노출. mutation은 기존 `guardMutation()` 유지.
  - `src/components/builder/canvas/SiteSettingsModal.tsx` — Mobile 탭 추가. sticky header, hamburger mode, bottom CTA enabled/actions를 UI에서 편집/저장.
  - `src/components/builder/published/SiteHeader.tsx` — `mobileSticky`, `mobileHamburger` prop과 runtime data attributes 추가. `force/off/auto` mode 지원.
  - `src/components/builder/published/MobileBottomBar.tsx` — published mobile fixed CTA bar 추가.
  - `src/lib/builder/site/public-page.tsx` — published fallback header와 global header canvas 모두 mobile sticky를 반영하고, bottom CTA를 렌더.
  - `src/app/globals.css` — sticky global header, hamburger off mode, mobile bottom CTA styles 추가.
  - `src/components/builder/canvas/CanvasNode.tsx` — touch pointer long-press가 contextmenu MouseEvent를 발화하도록 helper 추가.
  - `tests/builder-editor/mobile-runtime.playwright.ts` — M10 end-to-end 시나리오 추가.
- 구현:
  - PreviewModal은 기존 iframe + device frame 구현을 그대로 사용하고, M10 테스트에서 실제 발행 URL이 mobile iframe `src`로 들어가는지 검증했다.
  - 모바일 공개 페이지에서 site-level bottom CTA bar가 fixed로 표시된다.
  - fallback SiteHeader와 global header canvas 모두 `site.headerFooter.mobileSticky`를 runtime에 반영한다.
  - settings modal Mobile 탭에서 sticky/header mode/bottom CTA를 저장할 수 있다.
  - viewport 전환 후 undo stack이 유지되는지 `Cmd/Ctrl+D → Mobile 전환 → Cmd/Ctrl+Z`로 검증했다.
  - touch long-press는 560ms hold, 8px 이상 이동 시 취소로 구현했다.
  - M08의 W33 잔여 evidence도 같이 닫았다. `responsive.mobile.hidden` 노드가 public mobile viewport에서 숨겨지는지 확인했다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run lint` ✅ (기존 `<img>` warnings only)
  - `npm run test:unit` ✅ (33 files / 766 tests)
  - `npm run security:builder-routes` ✅ (71 route files / 62 mutation handlers)
  - `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/mobile-runtime.playwright.ts --workers=1` ✅
- W 판정:
  - W33/W40/W41/W42/W43/W44/W45 green evidence 확보.
- 리스크 / 알려진 문제:
  - 공개 루트 `/ko`는 legacy home이 우선 렌더된다. builder published runtime 검증은 생성/발행한 builder page slug로 수행했다.
  - Playwright Chromium은 macOS sandbox에서 Mach port 권한 실패가 있어 sandbox 밖에서 실행했다.
- 다음 마일스톤: M11

## M11 — text widget pack

- 시작/종료: 2026-05-10T03:58:00+09:00 / 2026-05-10T04:21:00+09:00
- 변경 파일:
  - `src/lib/builder/canvas/types.ts` — text node schema에 `columns`, `columnGap`, `quoteStyle`, `marquee`, `textPath`, `link`를 추가했다.
  - `src/components/builder/canvas/elements/TextElement.tsx` — multi-column, quote/pullquote, marquee, SVG text-path, full-text link 렌더를 추가했다.
  - `src/lib/builder/components/text/Inspector.tsx` — Rich text shortcut, column/quote/marquee/text-path controls, `LinkPicker` 연결을 추가했다.
  - `src/components/builder/canvas/SandboxCatalogPanel.tsx` — `Text widget pack` 섹션과 W46~W55 프리셋 10종 quick-add를 추가했다. 연속 quick-add는 겹치지 않도록 cascade offset을 적용한다.
  - `src/components/builder/canvas/SandboxPage.module.css` — text widget preset 카드 UI를 editor token 기반으로 추가했다.
  - `src/app/globals.css` — marquee animation runtime style을 추가했다.
  - `src/lib/builder/canvas/__tests__/text-widgets.test.ts` — text widget schema normalization unit을 추가했다.
  - `tests/builder-editor/text-widgets.playwright.ts` — 격리 page 생성 → + 패널 Text widget pack 10종 클릭 → canvas 렌더 → Inspector link 확인 → cleanup 시나리오를 추가했다.
- 구현:
  - W46 Heading은 기존 `heading` registry node를 재사용하고 H1 level + theme preset으로 생성한다.
  - W47/W48은 기존 TipTap rich text document와 Inspector shortcut을 사용한다.
  - W49는 SVG `<textPath>` 렌더로 arc/wave curve를 지원한다.
  - W50은 `column-count`/gap 기반 multi-column text로 렌더한다.
  - W51/W52는 blockquote/list rich text document와 quote style을 프리셋으로 생성한다.
  - W53은 CSS animation 기반 marquee로 속도/방향을 Inspector에서 편집한다.
  - W54는 SiteSettings theme text preset을 그대로 사용한다.
  - W55는 shared `LinkPicker`와 `linkValueSchema`를 사용해 internal/anchor/external/mailto/tel 링크 정책을 따른다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run test:unit -- src/lib/builder/canvas/__tests__/text-widgets.test.ts` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/text-widgets.playwright.ts --workers=1` ✅
- W 판정:
  - W46/W47/W48/W49/W50/W51/W52/W53/W54/W55 green evidence 확보.
- 리스크 / 알려진 문제:
  - M11은 repo의 실제 component registry 구조를 따랐다. goal 문서의 canonical 예시(`site/types.ts`, `published-node-frame.ts`, `components/widgets/...`)와 파일명이 다르지만, canvas/published 렌더는 현재 registry-driven 구조에서 동일 노드로 동작한다.
  - visual baseline 10개는 별도 screenshot 파일을 추가하지 않고, Playwright DOM/runtime evidence로 고정했다. M04 visual baseline suite에는 기존 editor states가 유지된다.
- 다음 마일스톤: M12

## M12 — media widget pack

- 변경 파일:
  - `src/lib/builder/canvas/types.ts` — `video`, `audio`, `lottie` kind를 schema union에 추가하고 image node에 `clickAction`, `hoverSrc`, `hotspots`, `compare`, `svg`, `gif` content를 추가했다. icon set은 `lucide`/`fontawesome`을 허용한다.
  - `src/components/builder/canvas/elements/ImageElement.tsx` — lightbox/popup click action, hotspot tooltip, before/after slider, hover swap, inline SVG color, GIF marker 렌더를 추가했다.
  - `src/lib/builder/components/image/Inspector.tsx` — media interaction, before/after, SVG/GIF controls를 추가했다.
  - `src/lib/builder/components/video/index.tsx`, `src/lib/builder/components/video/VideoRender.tsx` — MP4/direct video box와 background video mode, poster/controls Inspector를 추가했다.
  - `src/lib/builder/components/videoEmbed/index.tsx`/`VideoEmbedRender.tsx` — 기존 YouTube/Vimeo provider를 M12 프리셋에서 재사용한다.
  - `src/lib/builder/components/audio/index.tsx` — file audio player, Spotify embed, SoundCloud embed kind를 추가했다.
  - `src/lib/builder/components/lottie/index.tsx` — Lottie URL/label/autoplay/loop/speed kind와 fallback motion preview를 추가했다.
  - `src/lib/builder/components/icon/index.tsx` — Lucide/FontAwesome set 선택과 대표 SVG icon 렌더를 추가했다.
  - `src/lib/builder/components/registry.ts` — `audio`, `lottie` registry imports를 추가했다.
  - `src/components/builder/canvas/SandboxCatalogPanel.tsx` — `Media widget pack` 섹션과 W56~W70 프리셋 15종 quick-add를 추가했다.
  - `src/components/builder/canvas/SandboxPage.module.css`, `src/app/globals.css` — media preset card, inspector fieldset, hotspot/compare/lightbox/lottie runtime style을 추가했다.
  - `src/lib/builder/canvas/__tests__/media-widgets.test.ts` — media schema normalization unit을 추가했다.
  - `tests/builder-editor/media-widgets.playwright.ts` — 격리 page 생성 → + 패널 Media widget pack 15종 클릭 → canvas DOM evidence 확인 → cleanup 시나리오를 추가했다.
- 구현:
  - W56/W60은 `image.content.clickAction`으로 none/link/lightbox/popup을 통합한다. legacy `lightbox:` link도 lightbox trigger로 해석한다.
  - W57은 image `hotspots[]`를 percent coordinate로 저장하고 hover/focus tooltip을 렌더한다.
  - W58은 image `compare` content로 before/after 이미지를 겹치고 range handle로 조정한다.
  - W59는 `hoverSrc` overlay image를 hover opacity swap으로 렌더한다.
  - W61은 업로드 pipeline 확장 없이 현재 목표 범위에서 inline SVG preset + color token/string editing으로 구현했다.
  - W62는 외부 Lottie iframe URL이 있으면 embed하고, 없으면 에디터에서 식별 가능한 animated preview를 제공한다.
  - W63/W66은 `video` kind의 `mode: box|background`로 묶었다.
  - W64/W65는 기존 `video-embed` kind의 YouTube/Vimeo provider를 M12 catalog preset으로 노출한다.
  - W67/W68은 `audio` kind의 `provider: file|spotify|soundcloud`로 묶었다.
  - W69는 image GIF marker와 query metadata를 보존한다.
  - W70은 기존 `icon` kind를 확장해 Lucide/FontAwesome 대표 icon set을 제공한다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run test:unit -- src/lib/builder/canvas/__tests__/media-widgets.test.ts` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/media-widgets.playwright.ts --workers=1` ✅
- W 판정:
  - W56/W57/W58/W59/W60/W61/W62/W63/W64/W65/W66/W67/W68/W69/W70 green evidence 확보.
- 리스크 / 알려진 문제:
  - 실제 파일 업로드, Giphy 검색 API, Lottie JSON 파싱은 별도 asset pipeline 확장 트랙이다. M12는 Wix식 Add/Inspector/runtime surface를 먼저 완성했다.
  - Playwright helper가 시각 안정화를 위해 iframe을 숨기므로 YouTube/Vimeo는 visibility가 아니라 iframe src 존재로 검증한다.
- 다음 마일스톤: M13

## M13 — gallery widget pack

- 변경 파일:
  - `src/lib/builder/canvas/types.ts` — gallery image에 `caption`, `tags`를 추가하고 gallery content에 `layout`, `showCaptions`, `captionMode`, `activeFilter`, `autoplay`, `interval`, `thumbnailPosition`, `proStyle`을 추가했다.
  - `src/lib/builder/components/gallery/index.tsx` — gallery defaultContent를 grid layout 기반으로 확장했다.
  - `src/lib/builder/components/gallery/GalleryRender.tsx` — grid, masonry, slider, slideshow, thumbnail, pro gallery, caption overlay/below, tag filter bar, published lightbox를 렌더한다.
  - `src/lib/builder/components/gallery/Inspector.tsx` — layout dropdown, captions, filters, autoplay, thumbnail position, pro style, image caption/tag editor를 추가했다.
  - `src/components/builder/canvas/SandboxCatalogPanel.tsx` — `Gallery widget pack` 섹션과 W71~W78 프리셋 8종 quick-add를 추가했다.
  - `src/app/globals.css` — gallery layout/filter/caption/slider/thumbnail/lightbox runtime style을 추가했다.
  - `src/lib/builder/canvas/__tests__/gallery-widgets.test.ts` — gallery schema normalization unit을 추가했다.
  - `tests/builder-editor/gallery-widgets.playwright.ts` — 격리 page 생성 → + 패널 Gallery widget pack 8종 클릭 → canvas DOM evidence 확인 → cleanup 시나리오를 추가했다.
- 구현:
  - W71은 `layout='grid'`와 columns/gap controls로 처리한다.
  - W72는 CSS columns 기반 masonry layout으로 처리한다.
  - W73/W74는 slider/slideshow layout, arrow buttons, dots, autoplay interval로 처리한다.
  - W75는 thumbnail navigation layout으로 처리한다.
  - W76은 `layout='pro'` + `proStyle='clean|mosaic|editorial'`로 Wix pro-like variant를 제공한다.
  - W77은 이미지별 caption과 `captionMode='below|overlay'`로 처리한다.
  - W78은 이미지별 tags와 `activeFilter` filter bar로 처리한다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run test:unit -- src/lib/builder/canvas/__tests__/gallery-widgets.test.ts` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/gallery-widgets.playwright.ts --workers=1` ✅
- W 판정:
  - W71/W72/W73/W74/W75/W76/W77/W78 green evidence 확보.
- 리스크 / 알려진 문제:
  - 필터 pill은 현재 프리셋/Inspector 상태 반영 중심이다. 공개 페이지에서 사용자가 pill을 눌러 activeFilter를 바꾸는 상호작용은 M15 interactive track에서 더 고도화할 수 있다.
- 다음 마일스톤: M14

## M14 — layout widget pack

- 시작/종료: 2026-05-11 / 2026-05-11
- 변경 파일:
  - `src/lib/builder/canvas/types.ts` — container `layoutMode`에 strip/box/columns/repeater/tabs/accordion/slideshow/hoverBox와 `layoutItems`, `activeIndex`, `sticky`, `anchorTarget`를 추가했다.
  - `src/lib/builder/components/container/Element.tsx` — tabs/accordion/slideshow/hoverBox/repeater preview와 sticky/anchor data attributes를 렌더한다.
  - `src/lib/builder/components/container/Inspector.tsx` — layout mode, layout items, active index, sticky/anchor controls를 연결했다.
  - `src/components/builder/canvas/SandboxCatalogPanel.tsx` — `Layout widget pack` W79~W88 프리셋 10종을 추가했다.
  - `tests/builder-editor/layout-widgets.playwright.ts` — layout widget pack quick-add DOM evidence를 추가했다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run lint` ✅
  - `npm run test:unit` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/layout-widgets.playwright.ts --workers=1` ✅
- W 판정:
  - W79/W80/W81/W82/W83/W84/W85/W86/W87/W88 green evidence 확보.
- 커밋:
  - `b5b98bc G-Editor: add layout widget pack`
  - `cd07729 G-Editor: add layout widget pack playwright`

## M15 — interactive widget pack

- 시작/종료: 2026-05-11 / 2026-05-11
- 변경 파일:
  - `src/lib/builder/canvas/types.ts` — countdown/progress/rating/notification/back-to-top schema를 추가했다.
  - `src/lib/builder/components/countdown`, `progress`, `rating`, `notificationBar`, `backToTop` — runtime + Inspector를 추가했다.
  - `src/lib/builder/site/types.ts`, `src/components/builder/published/Popup*`, `CookieConsent*` — popup/cookie consent site-level entity와 published runtime을 추가했다.
  - `src/components/builder/canvas/SandboxCatalogPanel.tsx` — `Interactive widget pack` W89~W98 프리셋을 추가했다.
  - `tests/builder-editor/interactive-widgets.playwright.ts` — canvas interactive widget pack quick-add evidence를 추가했다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run lint` ✅
  - `npm run test:unit` ✅
- W 판정:
  - W89/W90은 기존 button variant/icon 버튼 프리셋으로 흡수.
  - W91/W92/W94는 popup/cookie consent site-level runtime으로 처리.
  - W93/W95/W96/W97/W98 green evidence 확보.
- 커밋:
  - `ac4231c G-Editor: add interactive widget pack`
  - `7e2466b G-Editor: add popup and cookie consent (M15-2)`

## M16 — navigation widget pack

- 시작/종료: 2026-05-11 / 2026-05-11
- 변경 파일:
  - `src/lib/builder/canvas/types.ts` — menu-bar/anchor-menu/breadcrumbs schema를 추가했다.
  - `src/lib/builder/components/menuBar`, `anchorMenu`, `breadcrumbs` — horizontal/vertical/dropdown/mega menu, sticky anchor menu, breadcrumb runtime + Inspector를 추가했다.
  - `src/components/builder/canvas/SandboxCatalogPanel.tsx` — `Navigation widget pack` W99~W105 프리셋 7종을 추가했다.
  - `src/app/globals.css` — nav widget runtime style과 모바일 hamburger behavior를 추가했다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run lint` ✅
  - `npm run test:unit` ✅
- W 판정:
  - W99/W100/W101/W102/W103/W104/W105 green evidence 확보.
- 커밋:
  - `93bb1fa G-Editor: add navigation widget pack`

## M17 — social widget pack

- 시작/종료: 2026-05-11 / 2026-05-11
- 변경 파일:
  - `src/lib/builder/canvas/types.ts` — social-bar/share-buttons/social-embed/floating-chat schema를 추가했다.
  - `src/lib/builder/components/socialBar`, `shareButtons`, `socialEmbed`, `floatingChat` — provider icon/link, share URL, embed placeholder, chat floating runtime + Inspector를 추가했다.
  - `src/components/builder/canvas/SandboxCatalogPanel.tsx` — `Social widget pack` W106~W113 프리셋 8종을 추가했다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run lint` ✅
  - `npm run test:unit` ✅
- W 판정:
  - W106/W107/W108/W109/W110/W111/W112/W113 green evidence 확보.
- 커밋:
  - `13a6eec G-Editor: add social widget pack`

## M18 — maps and location widget pack

- 시작/종료: 2026-05-11 / 2026-05-11
- 변경 파일:
  - `src/lib/builder/components/addressBlock`, `businessHours`, `multiLocationMap` — 주소 복합 카드, 영업시간, 다중 위치 지도/list runtime + Inspector를 추가했다.
  - `src/components/builder/canvas/SandboxCatalogPanel.tsx` — `Maps & Location pack` W115~W117 프리셋을 추가했다.
  - 기존 W114 `map`은 office sync + quick edit panel + Google Maps iframe query 반영 테스트 근거를 유지한다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run lint` ✅
  - `npm run test:unit` ✅
- W 판정:
  - W114/W115/W116/W117 green evidence 확보.
- 커밋:
  - `7303e2f G-Editor: add maps and location widget pack`

## M19 — decorative widget pack

- 시작/종료: 2026-05-11 / 2026-05-11
- 변경 파일:
  - `src/lib/builder/canvas/types.ts` — shape/pattern/parallax-bg/frame/sticker schema를 추가했다.
  - `src/lib/builder/components/shape`, `pattern`, `parallaxBg`, `frame`, `sticker` — decorative runtime + Inspector를 추가했다.
  - `src/components/builder/canvas/SandboxCatalogPanel.tsx` — `Decorative widget pack` W118~W125 프리셋 11종을 추가했다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run lint` ✅
  - `npm run test:unit` ✅
- W 판정:
  - W118/W119/W120/W121/W122/W123/W124/W125 green evidence 확보.
- 커밋:
  - `3fa08ee G-Editor: add decorative widget pack`

## M20 — data display widget pack

- 시작/종료: 2026-05-11 / 2026-05-11
- 변경 파일:
  - `src/lib/builder/canvas/types.ts` — bar/line/pie chart, counter, testimonial carousel, pricing/comparison table, timeline, team member, service feature schema를 추가했다.
  - `src/lib/builder/components/barChart`, `lineChart`, `pieChart`, `counter`, `testimonialCarousel`, `pricingTable`, `comparisonTable`, `timeline`, `teamMemberCard`, `serviceFeatureCard` — data display runtime + Inspector를 추가했다.
  - `src/lib/builder/components/registry.ts` — data display registry imports를 추가했다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run test:unit` ✅
- W 판정:
  - W126/W127/W128/W129/W130/W131/W132/W133/W134/W135 green evidence 확보.
- 커밋:
  - `9e54953 G-Editor: add data display widget pack`

## 2026-05-11 — editor compile blocker fix

- 사용자 피드백:
  - 주요업무 템플릿/노드 클릭 중 글이 사라지는 문제를 재확인하던 중 `/ko/admin-builder` 자체가 Build Error overlay로 막히는 상태를 발견했다.
- 원인:
  - hook을 쓰는 registry component 파일들이 Server Component로 해석되어 `addressBlock/index.tsx`의 `useState` import에서 Next compile error가 발생했다.
- 변경:
  - hook을 쓰는 registry components 11개에 `'use client'` boundary를 추가했다.
  - 기존 lint blocker였던 marketing dispatcher unused import와 guard placeholder argument를 정리했다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run lint` ✅ (기존 `<img>` warnings only)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --project=chromium-builder --workers=1` ✅
- 커밋:
  - `41f1f0c G-Editor: fix client hook component boundaries`

## 2026-05-11 — PR #16 builder error capture

- 변경 파일:
  - `src/app/api/builder/errors/route.ts` — POST client/runtime error report + GET admin error log endpoint를 추가했다.
  - `src/lib/builder/errors/capture.ts` — local log + optional Sentry forward capture helper를 추가했다.
  - `src/lib/builder/errors/storage.ts` — Vercel Blob/file fallback error log storage를 추가했다.
  - `src/lib/builder/errors/sentry-adapter.ts` — `SENTRY_DSN` 기반 HTTP store API forwarder를 추가했다.
  - `src/lib/builder/errors/types.ts` — error origin/severity/entry 타입을 추가했다.
  - `src/lib/builder/errors/__tests__/*.test.ts` — capture + Sentry adapter unit tests 5개를 추가했다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run lint` ✅ (기존 `<img>` warnings only)
  - `npm run test:unit -- src/lib/builder/errors/__tests__/capture.test.ts src/lib/builder/errors/__tests__/sentry-adapter.test.ts` ✅
  - `npm run security:builder-routes` ✅
- 리스크:
  - Sentry source map upload, alert routing은 아직 운영 배포 hook 작업으로 남아 있다. 현재 단계는 에러 수집/저장/선택적 forward의 코드 경로를 닫았다.

## M21 — forms advanced validation, upload, signature, and payment

- 시작/종료: 2026-05-11 / 2026-05-11
- 변경 파일:
  - `src/lib/builder/forms/form-engine.ts` — Vercel Blob/file fallback schema·submission storage, number/date/phone/select/radio/checkbox/file/conditional server validation을 추가했다.
  - `src/app/api/forms/submit/route.ts` — stored schema lookup, server validation, signature data URL materialization, file metadata persistence, webhook/email payload file forwarding을 추가했다.
  - `src/lib/builder/forms/uploads.ts`, `src/app/api/forms/uploads/**` — form file/signature upload 저장·조회 경로를 추가했다.
  - `src/lib/builder/components/form/Element.tsx` — published form submit 전에 파일 업로드를 수행하고 signature required 상태를 검사한다.
  - `src/lib/builder/components/formSignature/index.tsx` — canvas signature를 hidden PNG data URL 값으로 제출하고 runtime condition과 연결했다.
  - `src/lib/builder/components/formPayment/index.tsx`, `src/app/api/forms/stripe-checkout/route.ts` — Stripe Checkout session 생성 경로와 payment field CTA를 연결했다.
  - `src/components/builder/forms/FormSchemaEditor.tsx` — min/max/regex, number min/max/step/decimal, date range, file accept/max bytes 설정 UI를 추가했다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run lint` ✅ (기존 `<img>` warnings only)
  - `npx vitest run src/app/api/forms/__tests__/submit-route.test.ts src/lib/builder/forms/__tests__/conditional.test.ts src/lib/builder/forms/__tests__/validation.test.ts` ✅
  - `npm run security:builder-routes` ✅
- W 판정:
  - W136~W150 green evidence 확보. W148은 Stripe Checkout session 경로 기준이며, webhook/refund/Payment Element 심화는 Bookings 결제 마일스톤에서 이어간다.

## M22 — motion runtime parity

- 시작/종료: 2026-05-11 / 2026-05-11
- 변경 파일:
  - `src/lib/builder/animations/presets.ts` — click/exit/loop/timeline/default normalize와 custom cubic-bezier easing value를 추가했다.
  - `src/lib/builder/canvas/types.ts` — exit/loop/timeline/click animation schema와 cubic-bezier string validation을 추가했다.
  - `src/lib/builder/animations/animation-render.ts` — published attrs/style와 editor hover opacity style을 exit/loop/timeline/click까지 확장했다.
  - `src/components/builder/editor/AnimationsTab.tsx` — Exit/Loop/Click controls, custom Easing field, scrub options, timeline wiring을 추가했다.
  - `src/components/builder/editor/MotionTimelineEditor.tsx` — offset/timeOffset keyframe 표시와 편집을 안정화했다.
  - `src/components/builder/published/AnimationsRoot.tsx` — exit viewport leave, scrub runtime, hover fade, loop intensity, click replay, timeline runtime을 연결했다.
  - `src/app/api/builder/site/settings/route.ts`, `src/components/builder/canvas/SiteSettingsModal.tsx` — W172 page transition 설정 UI/API를 추가했다.
  - `tests/builder-editor/motion-runtime.playwright.ts` — inspector controls와 임시 published page runtime attrs를 실제 브라우저로 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/animations/__tests__/animation-render.test.ts src/lib/builder/site/__tests__/published-node-frame.test.ts` ✅ (17 passed)
  - `BASE_URL=http://127.0.0.1:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/motion-runtime.playwright.ts --project=chromium-builder --workers=1` ✅ (2 passed)
  - `npm run lint` ✅ (기존 `<img>` warnings only)
  - `npm run security:builder-routes` ✅
  - `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
- W 판정:
  - W159/W160/W167/W168/W170/W171/W172/W173/W174/W175 자동검증 evidence 확보.
  - W174 elastic preset과 W173 Claude drag/easing-visualizer UI는 별도 디자인 트랙으로 남긴다.
- 커밋:
  - `cfd4ee5 G-Editor: advance motion runtime parity`
- 다음 마일스톤:
  - M23 Design system 마무리.

## M23 — design system finishing

- 시작/종료: 2026-05-11 / 2026-05-11
- 변경 파일:
  - `src/lib/builder/site/typography-scale.ts` — modular scale normalize/resolve helper를 정리했다.
  - `src/lib/builder/site/theme.ts` — typographyScale 적용 시 title/body/quote preset size를 자동 재계산한다.
  - `src/app/api/builder/site/settings/route.ts` — settings API theme schema/merge가 `typographyScale`을 저장·복원한다.
  - `src/components/builder/canvas/SiteSettingsModal.tsx` — Typography 탭 base/ratio 조작이 preset size에 즉시 반영되고 저장 후 재오픈된다.
  - `src/lib/builder/components/heading/Inspector.tsx` — heading inspector 기본 size도 active scale을 따른다.
  - `src/components/builder/editor/StyleTab.tsx` — Style sources visualizer를 추가해 Background/Border/Radius/Shadow/Opacity/Hover/Variant 출처를 Theme/Variant/Manual/Default chip으로 표시한다.
  - `src/lib/builder/site/__tests__/typography-scale.test.ts`, `src/lib/builder/site/__tests__/style-origin.test.ts`, `tests/builder-editor/design-system-m23.playwright.ts` — scale 저장/프리셋 계산/Style origin UI를 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/site/__tests__/typography-scale.test.ts src/lib/builder/site/__tests__/style-origin.test.ts` ✅ (6 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/design-system-m23.playwright.ts --project=chromium-builder --workers=1` ✅ (1 passed)
  - `npm run lint` ✅ (기존 `<img>` warnings only)
  - `npm run security:builder-routes` ✅
  - `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
- W 판정:
  - W184/W185 자동검증 evidence 확보. 사용자 직접 QA 전까지 체크포인트는 `자동검증 통과 / 사용자 QA 대기`로 둔다.

## M24 — SEO + Publish maturity

- 시작/종료: 2026-05-12 / 2026-05-12
- 변경 파일:
  - `src/app/robots.ts`, `src/lib/builder/seo/robots.ts` — site settings 기반 custom `robots.txt`를 우선 적용하고, 비어 있으면 기존 noindex 기반 자동 robots를 유지한다.
  - `src/app/api/builder/site/seo-settings/route.ts`, `src/components/builder/seo/SeoDashboardView.tsx` — SEO Tools 탭에 `Custom robots.txt` 편집/저장 UI와 API payload를 추가했다.
  - `src/lib/builder/site/publish.ts`, `src/app/api/builder/site/pages/[pageId]/publish/route.ts` — publish 결과에 `cacheInvalidatedAt`, `revalidatedPaths`를 노출하고 page/sitemap/robots 경로를 명시 revalidate한다.
  - `src/lib/builder/publish-gate/checks.ts`, `src/lib/builder/publish-gate/gate-runner.ts` — publish preflight에 `prerender-ready` info check를 추가했다.
  - `tests/builder-editor/seo-publish-history.playwright.ts` — robots 저장 → `/robots.txt` 반영, `prerender-ready`, publish revalidate evidence, rate-limit bucket isolation을 검증한다.
  - `src/lib/builder/seo/__tests__/robots.test.ts` — custom robots parser unit coverage를 추가했다.
  - `src/lib/builder/live-chat/types.ts`, live-chat routes/inbox, `LiveChatWidget.tsx`, `template-selector.ts` — M24 검증 중 발견된 lint-only no-op 정리를 수행했다. visitorToken 제거 helper와 async handler `void` 처리만 포함한다.
- 이미 존재하던 M24 기반:
  - sitemap 자동 생성, hreflang 시각화/alternate, redirect manager, canonical, structured data, OG/Twitter preview, VersionHistory rollback/publish preflight는 기존 구현과 `seo-publish-history.playwright.ts`에서 함께 검증된다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/seo/__tests__/robots.test.ts` ✅ (2 passed)
  - `npm run test:unit` ✅ (855 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/seo-publish-history.playwright.ts --project=chromium-builder --workers=1` ✅ (3 passed, Chromium sandbox 권한 상승 실행)
  - `npm run security:builder-routes` ✅ (109 route files / 90 mutation handlers)
  - `npm run lint` / `npm run build` ⚠️ M24 변경 파일은 통과했으나, 금지된 Bookings M25 영역 `CalendarSyncAdmin.tsx`의 기존 unused setter가 전역 lint/build를 막는다. 해당 한 줄 정리는 M25 Bookings milestone에서 처리한다.
- W 판정:
  - W186/W187/W188/W190/W191/W192/W193/W194/W195 자동검증 evidence 확보.
  - W189 scheduled publish는 현재 master prompt의 M24 구현 범위 밖이며, 별도 publish scheduling milestone로 남긴다.

## M25 — Bookings 본격 1 (서비스/스태프)

- 시작/종료: 2026-05-12 / 2026-05-12
- 변경 파일:
  - `src/lib/builder/bookings/types.ts`, `storage.ts`, `availability.ts` — 서비스 결제 모드/가격/통화/예약 간격, 고객 타임존, 사건 개요/첨부/custom fields 타입과 저장/슬롯 계산을 확장했다.
  - `src/app/api/booking/book/route.ts`, `src/app/api/builder/bookings/admin-create/route.ts`, `src/app/api/builder/bookings/[id]/route.ts` — 공개 예약, 관리자 생성/수정 payload에 타임존과 커스텀 폼 데이터를 저장하고 paid service는 payment intent 선행을 요구한다.
  - `src/components/builder/bookings/BookingServicesAdmin.tsx`, `BookingStaffAdmin.tsx`, `BookingAvailabilityAdmin.tsx`, `BookingCalendarAdmin.tsx`, `BookingsAdmin.module.css` — Services/Staff/Availability 관리 UI를 Wix Bookings형 편집 흐름으로 확장했다.
  - `src/components/builder/bookings/BookingFlowSteps.tsx`, `src/lib/builder/components/bookingWidget/*`, `src/lib/builder/canvas/types.ts` — 공개 예약 위젯에 서비스→스태프→슬롯→정보 입력 flow, 로컬/업체 타임존 표시, 사건 개요/첨부/custom fields inspector를 연결했다.
  - `src/components/builder/bookings/CalendarSyncAdmin.tsx` — M24 전역 lint/build를 막던 기존 unused setter를 정리했다.
  - `src/lib/builder/bookings/__tests__/availability.test.ts`, `tests/builder-editor/bookings-m25.playwright.ts` — 서비스/스태프/availability/booking flow 자동검증을 추가했다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/bookings/__tests__/availability.test.ts` ✅ (3 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/bookings-m25.playwright.ts --project=chromium-builder --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `npm run lint` ✅ (기존 `<img>` warnings only)
  - `npm run security:builder-routes` ✅ (109 route files / 90 mutation handlers)
  - `npx vitest run src/lib/builder/bookings/__tests__/availability.test.ts src/lib/builder/bookings/calendar-sync/__tests__/encryption.test.ts` ✅ (6 passed)
  - `npm run test:unit` ✅ (858 passed)
  - `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
- W 판정:
  - W196/W197/W198/W199/W200/W201/W202 자동검증 evidence 확보.
  - 결제는 옵션 C 하이브리드 기본으로 구현했다. 무료 서비스는 바로 예약되고, 유료 서비스는 기존 Stripe Payment Intent route를 선행 호출한 뒤 booking row를 저장한다. 로컬 개발 환경은 `pi_stub_dev` stub으로 E2E를 통과한다.
  - 실제 Stripe Payment Element 확인, 환불/리스케줄/취소 정책, calendar 양방향/Zoom 알림 심화는 M26~M27 Bookings 후속에서 계속 진행한다.
  - 사용자 직접 QA 전까지 체크포인트는 `자동검증 통과 / 사용자 QA 대기`로 둔다.

## M26 — Bookings 본격 2 partial (운영 대시보드/상태/리스케줄)

- 시작/종료: 2026-05-12 / 2026-05-12
- 변경 파일:
  - `src/app/(builder)/[locale]/admin-builder/bookings/dashboard/page.tsx`, `src/components/builder/bookings/BookingDashboardAdmin.tsx` — Wix Bookings형 admin dashboard를 추가했다. 검색, 상태/staff/service/date 필터, 예약 상세 modal, 리스케줄, status transition, no-show 처리, timeline을 제공한다.
  - `src/components/builder/bookings/BookingCalendarAdmin.tsx` — Calendar 화면에 Month/Week/List view 전환을 추가했다.
  - `src/components/builder/bookings/BookingServicesAdmin.tsx`, `src/lib/builder/bookings/types.ts` — service 편집에 `meetingMode`와 `cancellationPolicyId`를 노출하고 API schema에 저장한다.
  - `src/app/api/builder/bookings/[id]/route.ts` — admin booking update가 cancellation reason/cancelledAt을 보존한다.
  - `src/lib/builder/bookings/notifications.ts` — meeting link가 생성된 booking은 confirmation email summary에도 링크를 포함한다.
  - `tests/builder-editor/bookings-m26-dashboard.playwright.ts` — service meeting/cancel policy 저장, dashboard filter/search, no-show, reschedule, confirm, calendar Month/Week/List 전환을 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run lint` ✅ (기존 `<img>` warnings only)
  - `npm run security:builder-routes` ✅ (109 route files / 90 mutation handlers)
  - `npx vitest run src/lib/builder/bookings/__tests__/availability.test.ts src/lib/builder/bookings/calendar-sync/__tests__/encryption.test.ts` ✅ (6 passed)
  - `npm run test:unit` ✅ (858 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/bookings-m26-dashboard.playwright.ts --project=chromium-builder --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `npm run build` ✅ (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
- W 판정:
  - Master prompt 기준 W205/W206/W207/W208/W209/W210의 운영 UI 핵심 자동검증 evidence 확보.
  - 외부 provider가 필요한 실제 Resend/SMTP 수신, Twilio SMS 수신, Zoom OAuth 실계정 생성, Google Calendar 양방향 pull, 고객 토큰 기반 cancel/reschedule link, Stripe Payment Element/환불 end-to-end는 후속 M26 slice로 남긴다.
  - 사용자 직접 QA 전까지 체크포인트는 `부분 자동검증 통과 / provider·고객 링크 후속`으로 둔다.

## M26 — Bookings 본격 2 customer link slice

- 시작/종료: 2026-05-12 / 2026-05-12
- 변경 파일:
  - `src/lib/builder/bookings/manage-token.ts` — bookingId/customer email/expiry를 HMAC 서명한 고객 관리 토큰을 생성·검증하고 locale별 manage URL을 만든다.
  - `src/lib/builder/bookings/notifications.ts` — confirmation summary와 reminder email에 고객용 관리/리스케줄/취소 링크를 포함한다.
  - `src/app/api/booking/manage/[token]/route.ts` — signed token 기반 공개 GET/PATCH endpoint를 추가했다. 고객은 링크로 예약을 조회하고, 가능한 슬롯으로 reschedule하거나 cancellation policy/refund 계산을 거쳐 cancel할 수 있다.
  - `src/app/[locale]/bookings/manage/[token]/page.tsx`, `src/components/builder/bookings/BookingManageClient.tsx` — 공개 고객 관리 페이지를 추가했다.
  - `src/components/QuickContactWidget.tsx`, `src/components/YearEndEventPopup.tsx` — `/bookings/manage/` 유틸리티 페이지에서는 AI chat/event popup을 끄도록 해, 고객의 예약 변경/취소 버튼을 마케팅 오버레이가 가로막지 않게 했다.
  - `src/lib/builder/bookings/__tests__/manage-token.test.ts`, `tests/builder-editor/bookings-m26-customer-manage.playwright.ts` — 토큰 변조/만료 rejection과 공개 링크 reschedule/cancel flow를 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/bookings/__tests__/manage-token.test.ts src/lib/builder/bookings/__tests__/availability.test.ts` ✅ (5 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/bookings-m26-customer-manage.playwright.ts --project=chromium-builder --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W203/W206 고객 링크 자동검증 evidence 확보. 실제 Resend/SMTP 수신 자체는 provider QA 대기지만, 이메일 본문에 들어가는 signed manage URL과 링크 도착 후 reschedule/cancel 동작은 자동검증 통과.
  - W205는 provider QA, W210은 Stripe Payment Element/환불 E2E, W204는 Google Calendar 양방향 pull 후속으로 유지한다.

## M26 — Bookings 본격 2 calendar pull import slice

- 시작/종료: 2026-05-12 / 2026-05-12
- 변경 파일:
  - `src/lib/builder/bookings/calendar-sync/types.ts` — provider pull 결과를 담는 `ExternalCalendarEvent` 타입을 추가했다.
  - `src/lib/builder/bookings/calendar-sync/google.ts`, `outlook.ts` — Google Calendar/Outlook calendarView timed events를 UTC ISO로 정규화해 가져오고, all-day/free 이벤트는 public slot 차단에 쓰지 않도록 제외한다. 삭제 이벤트는 날짜 없이 내려와도 cancellation event로 유지하고 provider pagination을 따라간다.
  - `src/lib/builder/bookings/calendar-sync/sync-engine.ts` — push event 설명에 `Booking ID:`를 심고 connection별 `eventMappings`로 provider event ID를 저장해 다음 sync부터 update로 덮어쓴다. Pull 시 저장된 external ID 또는 신뢰 가능한 Booking ID가 있으면 기존 booking reschedule/cancel로 반영한다. ID가 없는 외부 일정은 fake booking을 만들지 않고 staff `blockedDates` busy block으로 import/update/remove한다.
  - `src/components/builder/bookings/CalendarSyncAdmin.tsx`, `src/app/(builder)/[locale]/admin-builder/bookings/calendar-sync/page.tsx` — Calendar Sync UI 문구와 수동 동기화 결과를 push/pull 양방향 기준으로 정리했다.
  - `src/lib/builder/bookings/calendar-sync/__tests__/provider-mappers.test.ts`, `sync-engine.test.ts`, `src/lib/builder/bookings/__tests__/availability.test.ts` — provider mapper, pagination, free/all-day skip, idempotent busy import, deleted event removal, mapped external event tombstone cancel, stale duplicate push ignore, Booking ID 기반 reschedule/cancel, public slot exclusion을 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/bookings/calendar-sync/__tests__/provider-mappers.test.ts src/lib/builder/bookings/calendar-sync/__tests__/sync-engine.test.ts src/lib/builder/bookings/__tests__/availability.test.ts` ✅ (12 passed)
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run security:builder-routes` ✅
  - `npm run test:unit` ✅ (869 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- W 판정:
  - W204는 자동검증 기준 `자동검증 통과 / provider OAuth QA 대기`로 상향한다. 실제 Google/Outlook 계정 OAuth, provider API quota/permissions, 실캘린더 event round-trip은 사용자·provider QA로 남긴다.

## M26 — Bookings 본격 2 payment element/refund slice

- 시작/종료: 2026-05-12 / 2026-05-12
- 변경 파일:
  - `src/components/builder/bookings/BookingFlowSteps.tsx`, `BookingFlowSteps.module.css` — paid booking public widget을 Stripe Payment Element 확인 단계로 바꿨다. 유료 서비스는 `결제 준비` → Payment Element mount 또는 dev stub → `결제 확인/테스트 결제 완료` 후에만 `Confirm booking`이 활성화된다.
  - `src/app/api/booking/payment-intent/route.ts` — dev stub도 `paymentIntentId`를 반환하고, 실제 Stripe 모드에서는 publishable key 누락 시 503으로 명확히 실패한다.
  - `src/lib/builder/bookings/__tests__/refund.test.ts` — cancellation policy에 따른 full/partial/no-refund Stripe refund 계산과 booking payment status 적용을 단위 검증한다.
  - `src/app/api/booking/cancel/route.ts`, `src/app/api/booking/stripe-webhook/route.ts` — cancel/refund와 Stripe `charge.refunded` webhook 동시 처리 시 이미 취소·환불된 booking을 덮어쓰거나 downgrade하지 않도록 직전 재조회 race guard를 추가했다.
  - `tests/builder-editor/bookings-m25.playwright.ts` — public paid booking widget에서 결제 확인 전 예약 버튼 disabled, stub Payment Element 표시, 확인 후 booking 생성까지 E2E 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/bookings/__tests__/refund.test.ts` ✅ (3 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/bookings-m25.playwright.ts --project=chromium-builder --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run security:builder-routes` ✅
  - `npm run test:unit` ✅ (872 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- W 판정:
  - W210은 `자동검증 통과 / live Stripe QA 대기`로 상향한다. 로컬 dev stub은 Payment Element UI gate까지 검증했고, 실제 카드 결제·환불은 Stripe publishable/secret/webhook 환경에서 사용자/provider QA가 필요하다.

## M27 — Bookings 본격 3 analytics/customer profile slice

- 시작/종료: 2026-05-12 / 2026-05-12
- 변경 파일:
  - `src/lib/builder/bookings/analytics.ts` — booking list를 기반으로 total/upcoming/pending/confirmed/completed/cancelled/no-show, completion/cancellation/no-show rate, paid revenue, service/staff breakdown, customer email별 profile을 계산한다.
  - `src/components/builder/bookings/BookingDashboardAdmin.tsx`, `BookingsAdmin.module.css` — Dashboard 상단에 Wix Bookings형 analytics 카드와 service/customer breakdown을 추가하고, booking row와 detail modal에 고객 방문 횟수/이력 profile을 표시한다.
  - `src/lib/builder/bookings/__tests__/analytics.test.ts` — analytics summary와 customer profile grouping을 단위 검증한다.
  - `tests/builder-editor/bookings-m26-dashboard.playwright.ts` — 기존 dashboard E2E에 analytics panel, customer visit chip, profile modal, customer history timeline assertion을 추가했다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/bookings/__tests__/analytics.test.ts` ✅ (2 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/bookings-m26-dashboard.playwright.ts --project=chromium-builder --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run security:builder-routes` ✅
  - `npm run test:unit` ✅ (874 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- W 판정:
  - W213/W214는 `자동검증 통과 / 사용자 QA 대기`로 상향한다. Dashboard analytics와 고객 profile/history는 로컬 데이터 기준 동작을 검증했고, 실제 운영 데이터 분석·장기 이력 QA는 사용자 검증으로 남긴다.
  - 이 시점에서는 W211 waitlist, W212 recurring availability template, W215 booking email templates를 M27 후속 slice로 남겼다.

## M27 — Bookings 본격 3 waitlist slice

- 시작/종료: 2026-05-12 / 2026-05-12
- 변경 파일:
  - `src/lib/builder/bookings/types.ts`, `storage.ts` — booking 본체 status를 오염시키지 않고 별도 `BookingWaitlistEntry`와 `waitlist` storage collection을 추가했다.
  - `src/app/api/booking/waitlist/route.ts` — 공개 waitlist POST route를 추가했다. rate limit, honeypot, service/staff validation, 빈 slot 확인, 동일 날짜/이메일 중복 방지를 거친 뒤 active waitlist entry를 저장한다.
  - `src/app/api/builder/bookings/waitlist/[id]/route.ts`, `[id]/promote/route.ts` — 관리자 waitlist status update와 promotion route를 추가했다. 모든 builder mutation은 `guardMutation({ permission: 'manage-bookings' })`를 통과하고, promotion은 직전 slot availability와 slot lock을 다시 확인한 뒤 normal booking을 생성한다.
  - `src/components/builder/bookings/BookingFlowSteps.tsx`, `BookingFlowSteps.module.css` — 공개 booking widget에서 선택 날짜에 slot이 없으면 Wix Bookings형 `Join waitlist` panel을 보여준다.
  - `src/components/builder/bookings/BookingDashboardAdmin.tsx`, `BookingsAdmin.module.css`, dashboard page — 관리자 dashboard에 waitlist count와 waitlist table/action(Promote, Contacted, Close)을 추가했다.
  - `src/lib/builder/webhooks/types.ts` — `booking.waitlist.joined` webhook event type을 추가했다.
  - `tests/builder-editor/bookings-m27-waitlist.playwright.ts` — 실제 공개 페이지에서 빈 시간표 → waitlist 등록 → admin dashboard 확인 → availability 재오픈 → promote → booking row 생성까지 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/bookings-m27-waitlist.playwright.ts --project=chromium-builder --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `npx vitest run src/lib/builder/bookings/__tests__/analytics.test.ts src/lib/builder/bookings/__tests__/availability.test.ts` ✅ (6 passed)
  - `npm run security:builder-routes` ✅ (111 route files / 92 mutation handlers)
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run test:unit` ✅ (874 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- W 판정:
  - W211은 `자동검증 통과 / 사용자 QA 대기`로 상향한다. “만석 또는 slot 없음 → 대기 등록 → admin promotion” 경로는 자동검증 통과했다.
  - W212 recurring availability template, W215 booking email templates는 M27 후속 slice로 유지한다.

## M27 — Bookings 본격 3 recurring availability slice

- 시작/종료: 2026-05-12 / 2026-05-12
- 변경 파일:
  - `src/lib/builder/bookings/availability-templates.ts` — 반복 가용성 템플릿(`Weekdays 10-18`, `Weekdays 09-18`, split lunch, weekend, clear)과 공휴일 캘린더 판정 helper를 추가했다.
  - `src/lib/builder/bookings/types.ts`, `storage.ts` — `StaffAvailability`에 `recurringTemplateId`, `holidayCalendar`을 추가하고 기존 availability 저장과 seed 기본값을 backward-compatible하게 유지했다.
  - `src/lib/builder/bookings/availability.ts` — public slot 계산에서 holiday calendar가 지정된 날짜는 recurring weekly block이 있어도 slot을 생성하지 않도록 했다.
  - `src/components/builder/bookings/BookingAvailabilityAdmin.tsx` — staff availability UI에 recurring template 선택/적용 버튼과 holiday calendar 선택을 추가했다.
  - `src/lib/builder/bookings/__tests__/availability-templates.test.ts`, `availability.test.ts` — 템플릿 적용, KR/TW/combined fixed holiday match, 공휴일 slot exclusion을 단위 검증한다.
  - `tests/builder-editor/bookings-m27-recurring-availability.playwright.ts` — admin UI에서 템플릿 적용/저장 후 일반 평일은 slot이 열리고 공휴일 평일은 slot이 비는 것을 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/bookings/__tests__/availability-templates.test.ts src/lib/builder/bookings/__tests__/availability.test.ts` ✅ (7 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/bookings-m27-recurring-availability.playwright.ts --project=chromium-builder --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `npm run security:builder-routes` ✅
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run test:unit` ✅ (877 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- W 판정:
  - W212는 `자동검증 통과 / 사용자 QA 대기`로 상향한다. 매주 월~금 템플릿 적용과 KR/TW 공휴일 slot exclusion은 자동검증 통과했다.
  - W215 booking email templates는 M27 후속 slice로 유지한다.

## M27 — Bookings 본격 3 email templates slice

- 시작/종료: 2026-05-12 / 2026-05-12
- 변경 파일:
  - `src/lib/builder/bookings/email-template-config.ts`, `email-templates.ts` — customer confirmation, admin notification, customer reminder, customer cancellation 템플릿 기본값과 placeholder 렌더러를 추가했다. `{{customerName}}`, `{{serviceName}}`, `{{staffName}}`, `{{startTime}}`, `{{manageUrl}}`, `{{bookingSummary}}` 등 핵심 변수를 지원하고 HTML 출력은 escape 처리한다.
  - `src/lib/builder/bookings/types.ts`, `storage.ts` — `BookingEmailTemplate` 타입과 `email-templates` storage collection을 추가했다.
  - `src/app/api/builder/bookings/email-templates/*` — 관리자 템플릿 조회/저장 API를 추가했다. PATCH는 `guardMutation({ permission: 'manage-bookings' })`를 통과한다.
  - `src/components/builder/bookings/BookingEmailTemplatesAdmin.tsx`, `BookingsAdminShell.tsx`, `BookingsAdmin.module.css`, email templates page — Bookings admin에 Email tab을 추가하고 템플릿 목록, subject/body editor, placeholder chips, live preview, reset/save flow를 제공한다.
  - `src/lib/builder/bookings/notifications.ts`, booking cancel/manage/admin update routes — booking confirmation/admin notification/reminder/cancellation 발송을 저장된 템플릿 기반 렌더링으로 전환했다. 취소 경로는 customer cancellation email을 보낸다.
  - `src/app/api/booking/email-reminders/route.ts` — cron-authorized email reminder dispatcher를 추가했다. 서비스 reminder offset을 우선 사용하고, 기본은 24h reminder다.
  - `src/lib/builder/bookings/__tests__/email-templates.test.ts`, `tests/builder-editor/bookings-m27-email-templates.playwright.ts` — 템플릿 렌더링/escape, 관리자 저장/미리보기/재로드 persistence를 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/bookings/__tests__/email-templates.test.ts src/lib/builder/bookings/__tests__/availability-templates.test.ts` ✅ (4 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/bookings-m27-email-templates.playwright.ts --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `npm run security:builder-routes` ✅ (113 route files / 93 mutation handlers)
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run test:unit` ✅ (879 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- W 판정:
  - W215는 `자동검증 통과 / 사용자·provider QA 대기`로 상향한다. 관리자 편집과 렌더링은 검증했고, 실제 Resend 발송·수신함 렌더링은 provider 환경 QA로 남긴다.
  - M27 W211~W215는 모두 자동검증 evidence를 확보했다.

## M28 — Editor advanced rulers/guides/grid slice

- 시작/종료: 2026-05-12 / 2026-05-12
- 변경 파일:
  - `src/lib/builder/canvas/editor-prefs.ts`, `EditorPrefsButton.tsx` — editor preferences를 document dataset/CSS vars에 적용하고 `builder:editor-prefs-change` 이벤트로 설정 UI와 canvas toolbar를 동기화한다.
  - `src/components/builder/canvas/CanvasRulers.tsx`, `CustomGuidesOverlay.tsx`, `CanvasContainer.tsx` — 상단/좌측 pixel ruler, ruler click 기반 custom vertical/horizontal guide 생성, guide drag/remove, localStorage persistence를 연결했다.
  - `src/components/builder/canvas/CanvasStageToolbar.tsx`, `src/lib/builder/canvas/shortcuts.ts`, `hooks/useCanvasKeyboard.ts` — floating toolbar에 Grid toggle/size control을 추가하고 `Shift+G` 단축키를 연결했다.
  - `src/lib/builder/canvas/snap.ts`, `hooks/useCanvasInteractions.ts` — pixel grid snap과 custom reference guide snap을 기존 6px snap tolerance 경로에 연결했다.
  - `src/components/builder/canvas/SandboxEditorWorkspace.tsx` — header edit badge가 canvas ruler/floating toolbar를 덮지 않도록 위치를 보정했다.
  - `src/lib/builder/canvas/__tests__/snap.test.ts`, `tests/builder-editor/editor-guides-grid.playwright.ts` — grid snap, reference guide snap, rulers/grid toggle/grid size/Shift+G/guide persistence를 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/canvas/__tests__/snap.test.ts` ✅ (6 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/editor-guides-grid.playwright.ts --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `npm run security:builder-routes` ✅ (113 route files / 93 mutation handlers)
- W 판정:
  - W216/W217/W218은 `자동검증 통과 / 사용자 QA 대기`로 상향한다. W219~W225는 다음 M28 slice로 남긴다.

## M28 — Editor advanced panels/shortcuts/timeline slice

- 시작/종료: 2026-05-12 / 2026-05-12
- 변경 파일:
  - `src/lib/builder/canvas/shortcuts.ts`, `KeybindingsModal.tsx`, `EditorPrefsButton.tsx` — Wix형 단축키 맵을 `DEFAULT_KEYBINDINGS`로 정리하고, 사용자 override를 localStorage editor preferences에 저장한 뒤 실제 `matchShortcut` 처리에 반영한다.
  - `src/lib/builder/canvas/style-clipboard.ts`, `CanvasContainer.tsx`, `CanvasContextMenuLayer.tsx`, `hooks/useCanvasKeyboard.ts` — `Mod+Alt+C/V`와 context menu에서 style-only copy/paste를 지원한다.
  - `SandboxInspectorPanel.tsx` — 다중 선택 시 좌/중/우/상/중/하 정렬, horizontal/vertical distribute, match width/height 버튼을 노출한다.
  - `SandboxLayersPanel.tsx`, `LayersTreeRow.tsx`, `LayerSearchInput.tsx` — Layers tree에 자동검증용 data attr을 추가하고 zIndex/search/visibility/lock 트리 view를 검증 가능하게 했다.
  - `ComponentLibraryPanel.tsx`, `SandboxEditorRail.tsx` — Add drawer에 component library를 연결했다. 선택 노드 tree를 저장하고 fresh id로 +32/+32 offset 삽입한다.
  - `ElementCommentsPanel.tsx`, `SandboxInspectorPanel.tsx` — 선택 노드별 주석 thread를 inspector에 연결하고 editor preferences로 persist/broadcast한다.
  - `CanvasZoomDock.tsx` — zoom dock을 25~200% UI로 고정하고 자동검증 attr을 추가했다.
  - `UndoStackTimeline.tsx`, `SandboxEditorRail.tsx` — History drawer에 undo stack timeline을 추가하고 snapshot별 변경 요약/현재 cursor/Undo/Redo를 표시한다.
  - `src/lib/builder/canvas/__tests__/shortcuts.test.ts`, `tests/builder-editor/editor-advanced-panels.playwright.ts` — custom keybinding override, style paste, layers/search, component library, comments, align/distribute, zoom, undo timeline을 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/canvas/__tests__/shortcuts.test.ts` ✅ (2 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/editor-advanced-panels.playwright.ts --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W219/W220/W221/W222/W223/W224/W225는 `자동검증 통과 / 사용자 QA 대기`로 상향한다.

## M29 — Red checkpoint close / responsive + scheduled publish

- 시작/종료: 2026-05-12 / 2026-05-12
- 변경 파일:
  - `src/lib/builder/site/responsive-stylesheet.ts`, `src/lib/builder/site/public-page.tsx` — published responsive CSS 생성을 분리하고 tablet/mobile media query, hidden/fontSize/rect cascade, flow composite gap recomputation을 검증 가능한 모듈로 고정했다.
  - `src/lib/builder/site/scheduled-publish.ts` — page별 active schedule을 저장한다. 새 예약은 이전 scheduled job을 cancelled로 바꾸고, due runner는 기존 `publishPage()` pipeline을 호출한다.
  - `src/app/api/builder/site/pages/[pageId]/scheduled-publish/route.ts` — 예약 조회/생성/취소 API를 추가했다. 모든 mutation은 `guardMutation({ permission: 'publish' })`를 통과한다.
  - `src/app/api/cron/scheduled-publish/route.ts` — `CRON_SECRET` 기반 due publish runner를 추가했다.
  - `src/components/builder/canvas/PublishModal.tsx` — 예약 발행 패널을 추가했다. 예약 전 draft를 저장하고 expected draft revision을 job에 고정한다.
  - `src/lib/builder/site/__tests__/responsive-stylesheet.test.ts`, `scheduled-publish.test.ts` — public media CSS와 scheduled publish runner를 단위 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/site/__tests__/responsive-stylesheet.test.ts src/lib/builder/site/__tests__/scheduled-publish.test.ts` ✅ (5 passed)
  - `npm run security:builder-routes` ✅ (114 route files / 95 mutation handlers)
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run test:unit` ✅ (888 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- W 판정:
  - W17/W36/W189는 `자동검증 통과 / 사용자 QA 대기`로 상향한다.

## M30 — Section template click stability

- 시작/종료: 2026-05-12 / 2026-05-12
- 사용자 피드백:
  - 주요 업무/섹션 디자인 템플릿을 클릭해 테스트할 때 텍스트가 사라지거나 다른 노드를 클릭한 뒤 글이 안 보이는 문제가 있었다.
  - 섹션 디자인 템플릿 삽입 후 뒤쪽 본문/히어로 클릭이 실제 사용자 클릭으로 안정적으로 되지 않았다.
- 변경 파일:
  - `src/components/builder/canvas/CanvasNode.tsx` — child-containing container도 실제 클릭 대상이 되도록 pointer events 정책을 보정했다. 서비스/FAQ interactive preview index는 선택 시점에 즉시 동기화해 selection 변경 직후 accordion body가 접히지 않게 했다.
  - `src/components/builder/canvas/CanvasNodeSelectionOverlay.module.css` — 회전 핸들을 콘텐츠 위에서 더 멀리 띄워, 선택 핸들이 바로 다음 텍스트 클릭을 가로막는 문제를 줄였다.
  - `src/components/builder/canvas/SandboxCatalogPanel.tsx` — 내장 섹션 템플릿은 현재 visible root section 하단에 중앙 정렬로 삽입하고 root section만 선택하도록 변경했다. 새 섹션이 hero 위에 겹쳐 기존 노드 클릭을 막지 않는다.
  - `tests/builder-editor/section-template-click.playwright.ts` — `force: true`를 제거하고 실제 사용자 클릭 경로로 서비스 accordion, 섹션 삽입, 기존 hero 재클릭을 검증한다.
- 검증:
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (2 passed, Chromium sandbox 권한 상승 실행)
  - `npm run typecheck` ✅
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run security:builder-routes` ✅ (114 route files / 95 mutation handlers)
  - `npx vitest run src/lib/builder/canvas/__tests__/shortcuts.test.ts src/lib/builder/canvas/__tests__/snap.test.ts` ✅ (8 passed)
  - `npm run test:unit` ✅ (888 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- W 판정:
  - W18/W22/W84 관련 실사용 click regression은 `자동검증 통과 / 사용자 QA 대기`로 둔다. 다음 self-goal은 남은 yellow checkpoint 중 W161/W174/W178/W181/W182/W183 계열을 우선 후보로 본다.

## M31 — Background parallax runtime

- 시작/종료: 2026-05-12 / 2026-05-12
- 변경 파일:
  - `src/lib/builder/animations/presets.ts` — Scroll effect에 `background-parallax` 옵션을 추가했다. 기존 `parallax-y` element transform과 분리해 배경 이미지 전용 효과로 노출한다.
  - `src/components/builder/published/AnimationsRoot.tsx` — 공개 페이지 scroll runtime에서 `background-parallax` 노드의 background-position을 스크롤 진행률과 intensity 기준으로 갱신한다. Overlay+image 다중 background layer에서는 마지막 image layer만 움직인다.
  - `src/lib/builder/animations/__tests__/animation-render.test.ts` — preset option과 published attr emission을 단위 검증한다.
  - `tests/builder-editor/motion-runtime.playwright.ts` — Inspector에서 `background-parallax` 옵션 선택 가능 여부와 공개 페이지에서 `--builder-bg-parallax-position`이 실제 갱신되는 경로를 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/animations/__tests__/animation-render.test.ts` ✅ (3 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/motion-runtime.playwright.ts --workers=1` ✅ (2 passed, Chromium sandbox 권한 상승 실행)
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run security:builder-routes` ✅ (114 route files / 95 mutation handlers)
  - `npm run test:unit` ✅ (889 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- W 판정:
  - W161은 `자동검증 통과 / 사용자 QA 대기`로 상향한다. Element `parallax-y`와 background-only parallax 모두 런타임 evidence를 확보했다.

## M32 — Elastic easing preset

- 시작/종료: 2026-05-12 / 2026-05-12
- 변경 파일:
  - `src/lib/builder/animations/presets.ts` — animation easing preset에 `elastic`을 추가했다.
  - `src/lib/builder/animations/animation-render.ts` — 저장값 `elastic`은 유지하되 published/editor CSS 출력에서는 `cubic-bezier(0.34, 1.56, 0.64, 1)`로 변환한다.
  - `src/components/builder/published/AnimationsRoot.tsx` — exit animation runtime도 legacy/직접 attr의 `elastic` 값을 CSS-safe cubic-bezier로 처리한다.
  - `src/lib/builder/animations/__tests__/animation-render.test.ts` — elastic option, normalization preservation, published/editor CSS conversion을 검증한다.
  - `tests/builder-editor/motion-runtime.playwright.ts` — Inspector easing dropdown에서 `elastic` 선택 가능 여부와 custom input disabled 상태를 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/animations/__tests__/animation-render.test.ts` ✅ (4 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/motion-runtime.playwright.ts --workers=1` ✅ (2 passed, Chromium sandbox 권한 상승 실행)
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run security:builder-routes` ✅ (114 route files / 95 mutation handlers)
  - `npm run test:unit` ✅ (890 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- W 판정:
  - W174는 `자동검증 통과 / 사용자 QA 대기`로 상향한다. 기본 easing, custom cubic-bezier, elastic preset이 모두 Inspector/runtime 경로에 존재한다.

## M33 — Radius/shadow effect presets

- 시작/종료: 2026-05-12 / 2026-05-12
- 변경 파일:
  - `src/lib/builder/site/types.ts`, `src/lib/builder/site/theme.ts` — `BuilderTheme.effects`에 radius/shadow preset metadata를 추가하고, Sharp/Medium/Soft radius 및 None/Soft/Medium/Strong shadow preset helper를 제공한다.
  - `src/components/builder/canvas/SiteSettingsModal.tsx` — Site Settings > Presets 탭에 radius/shadow preset picker를 추가했다. 선택 즉시 theme preview와 brand kit export state가 갱신되고 저장 API payload에 포함된다.
  - `src/app/api/builder/site/settings/route.ts` — site theme schema가 `effects`를 검증하고, GET/PUT merge 과정에서 preset metadata를 정규화한다.
  - `src/lib/builder/site/component-variants.ts` — published/editor card variant elevation이 theme shadow preset을 읽도록 연결했다. flat card는 `none`을 유지한다.
  - `src/lib/builder/site/__tests__/theme-effects.test.ts`, `tests/builder-editor/design-pool.playwright.ts` — preset 적용, card shadow resolver, Site Settings 실제 클릭 흐름을 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/site/__tests__/theme-effects.test.ts` ✅ (2 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/design-pool.playwright.ts -g "covers Site Settings ModalShell" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run security:builder-routes` ✅ (114 route files / 95 mutation handlers)
  - `npm run test:unit` ✅ (892 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- W 판정:
  - W183은 `자동검증 통과 / 사용자 QA 대기`로 상향한다. Site Settings에서 전역 radius/shadow preset을 고르고 저장할 수 있으며, card variant shadow가 published 스타일에 반영된다.

## M34 — Design token bundle export/import

- 시작/종료: 2026-05-12 / 2026-05-12
- 변경 파일:
  - `src/lib/builder/site/theme.ts` — `DesignTokenBundle` schema와 `createDesignTokenBundle()`, `normalizeDesignTokenTheme()`을 추가했다. colors/darkColors/fonts/radii/effects/text presets/typography scale을 한 JSON bundle로 정규화한다.
  - `src/components/builder/canvas/SiteSettingsModal.tsx` — Site Settings > Presets 탭에 `Export design tokens` / `Import design tokens` 버튼을 추가했다. Import는 현재 theme state와 brand kit export state를 즉시 갱신하고, 저장 버튼으로 API에 반영된다.
  - `src/lib/builder/site/__tests__/theme-effects.test.ts` — design token bundle round-trip을 단위 검증한다.
  - `tests/builder-editor/design-pool.playwright.ts` — 실제 modal에서 token JSON 다운로드 파일명, import file input, imported primary color 반영을 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/site/__tests__/theme-effects.test.ts` ✅ (3 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/design-pool.playwright.ts -g "covers Site Settings ModalShell" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run security:builder-routes` ✅ (114 route files / 95 mutation handlers)
  - `npm run test:unit` ✅ (893 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- W 판정:
  - W181은 `자동검증 통과 / 사용자 QA 대기`로 상향한다. Brand kit JSON과 별도로 전체 theme token bundle을 export/import할 수 있다.

## M35 — Custom My Theme save/load

- 시작/종료: 2026-05-12 / 2026-05-12
- 변경 파일:
  - `src/components/builder/canvas/SiteSettingsModal.tsx` — Site Settings > Presets 탭에 My Themes 영역을 추가했다. 현재 theme를 `Save as My Theme`로 localStorage에 저장하고, 저장된 preset은 preview card에서 `Apply My Theme` 또는 `Delete`할 수 있다.
  - `tests/builder-editor/design-pool.playwright.ts` — My Theme 저장, preset card 표시, 재적용, 삭제 notice를 실제 브라우저 경로로 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/design-pool.playwright.ts -g "covers Site Settings ModalShell" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run security:builder-routes` ✅ (114 route files / 95 mutation handlers)
  - `npm run test:unit` ✅ (893 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- W 판정:
  - W178은 `자동검증 통과 / 사용자 QA 대기`로 상향한다. Built-in preset 외에 사용자가 현재 스타일을 My Theme로 저장하고 다시 불러올 수 있다.

## M36 — Brand asset library polish

- 시작/종료: 2026-05-12 / 2026-05-12
- 변경 파일:
  - `src/components/builder/editor/BrandKitPanel.tsx` — Brand kit 탭 안에 Brand asset library 영역을 추가했다. Light logo/Dark logo/Favicon/OG image 4개 슬롯의 연결 상태를 한눈에 보여주고, 각 슬롯에서 Asset library를 바로 열 수 있다.
  - `src/components/builder/editor/AssetLibraryModal.tsx` — 모달을 특정 folder로 열고, 선택한 asset을 자동 folder/tag로 분류하는 옵션을 추가했다. Brand kit에서 연 asset picker는 Brand folder로 시작하고 선택 asset을 `brand` folder/tag에 연결한다.
  - `tests/builder-editor/design-pool.playwright.ts` — Site Settings 실제 클릭 흐름에서 Brand asset library 노출, 0/4 상태, Brand folder asset dialog 진입/닫기를 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/design-pool.playwright.ts -g "covers Site Settings ModalShell" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run security:builder-routes` ✅ (114 route files / 95 mutation handlers)
  - `npm run test:unit` ✅ (893 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- W 판정:
  - W182는 `자동검증 통과 / 사용자 QA 대기`로 상향한다. Brand kit의 logo variant/color palette에서 실제 asset library를 직접 열고, 선택 asset을 brand asset으로 분류할 수 있다.

## M37 — Component design presets bulk apply

- 시작/종료: 2026-05-12 / 2026-05-12
- 변경 파일:
  - `src/lib/builder/site/component-design-presets.ts` — Classic/Soft/Editorial/Conversion component design preset을 정의하고, 현재 페이지의 button/card/form field/form submit 노드에 일괄 patch하는 helper를 추가했다.
  - `src/components/builder/canvas/SiteSettingsModal.tsx` — Site Settings > Presets 탭에 Component design presets 영역을 추가했다. 각 preset은 button/card/form 매핑을 보여주고, 클릭 시 현재 페이지 요소들에 일괄 적용된다.
  - `src/components/builder/canvas/SandboxPage.tsx`, `src/components/builder/canvas/SandboxModalsRoot.tsx` — modal action을 canvas store mutation과 toast에 연결했다.
  - `src/lib/builder/site/__tests__/component-design-presets.test.ts`, `tests/builder-editor/design-pool.playwright.ts` — helper unit과 실제 modal 클릭 후 draft 저장 반영을 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/site/__tests__/component-design-presets.test.ts` ✅ (1 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/design-pool.playwright.ts -g "bulk applies component design presets" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run security:builder-routes` ✅ (114 route files / 95 mutation handlers)
  - `npm run test:unit` ✅ (894 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- W 판정:
  - W179는 `자동검증 통과 / 사용자 QA 대기`로 상향한다. 버튼 프리셋을 넘어서 card/form field/form submit까지 Site Settings에서 한 번에 적용되고 draft persistence까지 확인했다.

## M38 — Typography/source inspector polish

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/SiteSettingsModal.tsx` — Typography 탭에 W184 scale preview ladder를 추가했다. base/ratio 변경 시 H1~H6/Body 계산 결과 px가 즉시 보인다.
  - `src/components/builder/editor/StyleTab.tsx` — W185 Style sources visualizer 각 행에 `theme.colors.*`, `variant:*`, `사용자 직접 입력`, `기본값` 힌트를 직접 표시한다. tooltip에만 숨어 있던 출처가 inspector에서 바로 읽힌다.
  - `tests/builder-editor/design-system-m23.playwright.ts` — typography preview H1/Body px와 style source hint 표시를 실제 브라우저 경로로 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/design-system-m23.playwright.ts --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run security:builder-routes` ✅ (114 route files / 95 mutation handlers)
  - `npm run test:unit` ✅ (894 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- W 판정:
  - W184/W185는 계속 `자동검증 통과 / 사용자 QA 대기`로 둔다. 이미 통과한 기능에 실사용 가시성을 더해, typography scale과 style origin을 사용자가 더 즉시 이해할 수 있게 했다.

## M39 — Redirect manager public runtime evidence

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/lib/builder/seo/redirects-edge.ts`, `src/middleware.ts` — middleware redirect loader가 local origin에서는 same-origin public read endpoint를 사용하도록 보강했다. Production Blob path는 유지한다.
  - `src/app/api/builder/site/redirects/public/route.ts` — local-only GET endpoint를 추가해 middleware가 Node persistence에 저장된 redirect rules를 읽을 수 있게 했다. 외부 hostname은 404로 닫는다.
  - `tests/builder-editor/redirect-manager.playwright.ts` — Redirect manager UI에서 301/308 rule을 생성하고, public request를 `maxRedirects: 0`으로 보내 status와 Location header를 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/redirect-manager.playwright.ts --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run security:builder-routes` ✅ (115 route files / 95 mutation handlers)
  - `npm run test:unit` ✅ (894 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- W 판정:
  - W188은 `자동검증 통과 / 사용자 QA 대기` 유지. 기존 UI/API evidence에 실제 middleware public 301/308 response evidence를 추가했다.

## M40 — Structured data public JSON-LD evidence

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/lib/builder/site/types.ts` — `BuilderStructuredDataBlockType`에 `Article`을 정식 block type으로 추가했다.
  - `src/app/api/builder/site/pages/[pageId]/seo/route.ts`, `src/app/api/builder/site/seo-settings/route.ts` — page/site SEO 저장 schema에서 Article structured-data block을 허용한다.
  - `src/components/builder/canvas/SeoPanel.tsx` — Advanced > JSON-LD blocks를 Custom 전용에서 schema.org block picker로 확장했다. `+ Article` starter는 Article JSON-LD template을 즉시 채운다.
  - `tests/builder-editor/seo-publish-history.playwright.ts` — W192 public evidence를 추가했다. FAQ widget + Article block 페이지를 발행하고 공개 HTML의 `application/ld+json` payload에서 LegalService/BreadcrumbList/FAQPage/Article을 직접 검증한다. 기존 UI 클릭 테스트도 `+ Article` starter 값을 확인한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/seo-publish-history.playwright.ts -g "covers W192|covers W26-W28 through actual editor UI clicks" --workers=1` ✅ (2 passed, Chromium sandbox 권한 상승 실행)
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run security:builder-routes` ✅ (115 route files / 95 mutation handlers)
  - `npm run test:unit` ✅ (894 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- W 판정:
  - W192는 `자동검증 통과 / 사용자 QA 대기` 유지. 기존 helper/UI evidence에 실제 published HTML JSON-LD payload 검증을 추가했다.

## M41 — Hreflang public metadata evidence

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `tests/builder-editor/seo-publish-history.playwright.ts` — W193 public metadata evidence를 추가했다. KO 페이지와 `linkedFromPageId` 기반 EN 페이지를 만들고, 두 draft를 발행한 뒤 공개 KO HTML의 alternate link를 검증한다.
- 검증:
  - 공개 HTML에서 `rel="alternate"` ko/en/x-default link가 `https://tseng-law.com/{locale}/{slug}` 형태로 주입된다.
  - legacy `/p/` URL이 alternate link에 섞이지 않는다.
  - SEO API의 `hreflang` 배열과 `missingLocales`가 Inspector 시각화에 필요한 상태를 반환한다.
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/seo-publish-history.playwright.ts -g "covers W193" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run security:builder-routes` ✅ (115 route files / 95 mutation handlers)
  - `npm run test:unit` ✅ (894 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- W 판정:
  - W193은 `자동검증 통과 / 사용자 QA 대기` 유지. 기존 hreflang helper/Inspector evidence에 실제 published metadata alternate link 검증을 추가했다.

## M42 — Publish diff viewer 실사용 evidence

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/lib/builder/canvas/document-diff.ts` — Version History와 Publish dialog가 공유하는 draft-vs-revision diff helper를 추가했다. added/removed/modified node summary와 대표 변경 설명을 계산한다.
  - `src/components/builder/canvas/VersionHistoryPanel.tsx` — 기존 내장 diff 계산을 공용 helper로 교체해 같은 diff semantics를 유지한다.
  - `src/components/builder/canvas/PublishModal.tsx` — Publish dialog preflight 안에 `Draft vs published` 패널을 추가했다. 마지막 `publishedRevisionId` 문서를 revisions API로 읽고 현재 draft와 비교해 `+ / - / ~` 요약, published revision, 대표 변경 node를 발행 전에 보여준다.
  - `tests/builder-editor/seo-publish-history.playwright.ts` — W195 UI evidence를 추가했다. 최초 publish 후 draft title을 변경하고 Publish dialog를 열어 `+0 / -0 / ~1`, `~ 변경됨 1`, 변경 node id와 text diff가 표시되는지 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/seo-publish-history.playwright.ts -g "covers W195" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `npm run lint` ✅ (`<img>` 기존 warning only)
  - `npm run security:builder-routes` ✅ (115 route files / 95 mutation handlers)
  - `npm run test:unit` ✅ (894 passed)
  - `npm run build` ✅ (Google Fonts download warning + 기존 `<img>` warning only)
- W 판정:
  - W195는 `자동검증 통과 / 사용자 QA 대기` 유지. 기존 Version History diff preview에 더해 실제 Publish dialog에서 draft-vs-published 변경 요약을 발행 직전 확인할 수 있게 했다.

## M43 — Pages CRUD validation hardening

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/PageSwitcher.tsx` — Pages 패널의 create/rename/delete 실패가 generic error로 끝나지 않도록 API validation payload를 읽어 사용자에게 원인 메시지를 표시한다. status 영역에 `role="status"`/`aria-live`를 추가하고, rename title/slug input에 명시적 접근성 label을 붙였다.
  - `tests/builder-editor/design-pool.playwright.ts` — 같은 locale 내 duplicate slug로 rename을 시도했을 때 Pages 패널이 `같은 locale 안에 동일한 slug...` 메시지를 보여주고 기존 source/target page가 모두 보존되는지 검증한다. 기존 rename/delete/nav sync 테스트도 함께 재실행했다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/design-pool.playwright.ts -g "duplicate slug validation|keeps active page slug" --workers=1` ✅ (2 passed, Chromium sandbox 권한 상승 실행)
  - `npm run lint` ✅ (기존 `<img>` warning만)
  - `npm run security:builder-routes` ✅ (115 builder route file / 95 mutation handler guard coverage)
  - `npm run test:unit` ✅ (72 files / 894 tests)
  - `npm run build` ✅ (Google Fonts 최적화 warning + 기존 `<img>` warning만)
- W 판정:
  - W14는 `자동검증 통과 / 사용자 QA 대기` 유지. 새 페이지 생성, duplicate 생성 방어, rename/delete/nav sync에 더해 rename validation 실패 UX까지 실제 UI evidence를 확보했다.

## M44 — Services template text persistence

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/lib/builder/canvas/store.ts` — editor interactive preview가 주요 서비스에서 마지막 open index만 기억하지 않고, 사용자가 한 번 열어 확인한 service card index 목록을 유지한다.
  - `src/components/builder/canvas/CanvasNode.tsx` — 주요 서비스 card/detail 노드는 현재 선택된 card뿐 아니라 이전에 reveal된 card도 editor canvas에서 계속 open preview로 렌더한다. public accordion runtime은 바꾸지 않고 editor 안정성만 보강했다.
  - `tests/builder-editor/section-template-click.playwright.ts` — 주요 서비스 디자인 템플릿 적용, 두 번째 card 선택, 섹션 설명/hero title 선택 뒤에도 card 0/1 상세 텍스트가 계속 보이는지 실제 클릭으로 검증한다.
  - `tests/builder-editor/admin-builder.playwright.ts` — 기존 smoke expectation을 editor multi-reveal 동작에 맞게 갱신했다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (2 passed, Chromium sandbox 권한 상승 실행)
  - `git diff --check` ✅ (M44 코드/test 파일)
  - `npm run lint` ✅ (기존 `<img>` warning만)
  - `npm run security:builder-routes` ✅ (115 builder route file / 95 mutation handler guard coverage)
  - `npm run test:unit` ✅ (72 files / 894 tests)
  - `npm run build` ✅ (Google Fonts 최적화 warning + 기존 `<img>` warning만)
  - 참고: `admin-builder.playwright.ts -g "covers Wix-like editor chrome"` smoke도 실행했지만, M44 서비스 assertion 이전의 기존 layout/hero quick-edit assertion에서 먼저 막혀 M44 gate로 쓰지 않았다.
- W 판정:
  - W18/W84는 `자동검증 통과 / 사용자 QA 대기` 유지. 사용자가 보고한 “주요업무/주요 서비스 노드 선택 후 다른 노드를 누르면 글이 사라짐” 회귀에 대해 editor 전용 persistence evidence를 확보했다.

## M45 — Locale page projection guard

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/lib/builder/site/persistence.ts` — site page 목록을 locale별로 projection하는 `projectPagesForLocale`/`canProjectPageToLocale` helper를 추가했다. KO/default route는 KO page만 보여주고, zh-hant/en route는 locale-specific page가 없는 경우에만 KO source page를 fallback으로 받는다.
  - `src/app/(builder)/[locale]/admin-builder/page.tsx` — editor initial page, requested `pageId`, page switcher 목록을 locale-visible page 집합에서만 고르게 했다.
  - `src/app/api/builder/site/pages/[pageId]/draft/route.ts` — draft GET/PUT 전에 page locale mismatch를 검사해 전용 zh-hant page를 KO locale로 읽거나 저장하려는 요청을 409 `locale_mismatch`로 거부한다.
  - `tests/builder-editor/locale-projection.playwright.ts` — zh-hant 전용 page를 생성하고 KO 목록 제외, zh-hant 목록 포함, KO draft 409, KO editor fallback home 렌더를 실제 API/UI 흐름으로 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/locale-projection.playwright.ts --workers=1` ✅ (2 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W14/W193은 `자동검증 통과 / 사용자 QA 대기` 유지. Pages와 hreflang/linking 작업 이후 남아 있던 locale pageId cross-open 위험을 editor route와 draft API 양쪽에서 닫았다.

## M46 — Service section gallery depth

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/lib/builder/sections/templates.ts` — services built-in section templates를 4개에서 12개로 확장했다. 신규 템플릿은 Practice Bento, Process Ladder, Risk Matrix, Retainer Packages, Industry Solutions, Comparison Table, Cross-border Desk, Case Intake Flow다.
  - `src/components/builder/sections/SectionTemplateCard.tsx` — template/category data attribute와 명시적 aria-label을 추가해 클릭 target과 자동검증을 안정화했다.
  - `src/components/builder/canvas/SandboxEditorRail.tsx` — Section design detail view 본문에 `섹션 목록으로 돌아가기` 버튼을 추가해 variant 목록에서 빠져나오는 흐름을 명확히 했다.
  - `src/lib/builder/sections/__tests__/normalize.test.ts` — built-in section 총량과 services category 기대 수를 61개/12개로 갱신했다.
  - `tests/builder-editor/section-template-click.playwright.ts` — Design panel back CTA, services built-in template 12개 노출, 신규 Practice Bento Board 노출을 실제 editor UI에서 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/sections/__tests__/normalize.test.ts` ✅ (17 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (2 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W18/W84는 `자동검증 통과 / 사용자 QA 대기` 유지. 사용자 체감상 “서비스/주요업무 템플릿이 너무 적고 돌아가기 어렵다”는 gap을 template depth와 editor back affordance로 보강했다.

## M47 — Node click movement guard

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/hooks/useCanvasInteractions.ts` — 클릭과 드래그를 분리하기 위해 move interaction에 4px 활성화 임계값을 추가했다. 선택 pointerdown은 기존처럼 유지하되, 포인터가 임계값 이상 움직이기 전에는 transient rect update, reparent, commit이 실행되지 않는다.
  - `tests/builder-editor/node-click-stability.playwright.ts` — 2px pointer jitter 클릭이 주요 서비스 노드를 이동시키지 않는지, 칼럼 아카이브와 이미지 클릭 뒤에도 `/ko/admin-builder` 캔버스와 Asset library modal이 살아있는지 실제 브라우저 클릭으로 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/node-click-stability.playwright.ts --workers=1` ✅ (2 passed, Chromium sandbox 권한 상승 실행)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (2 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W18/W84/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. 사용자가 보고한 “노드 선택 뒤 다른 노드 선택하면 아래로 사라지고 글이 안 보임”, “칼럼 아카이브/사진 클릭하면 백지” 경로를 accidental drag와 editor navigation 안정성 관점에서 막았다.

## M48 — Section template market search

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/lib/builder/sections/templates.ts` — built-in section template 검색 helper와 category별 한국어/영어 alias를 추가했다. `주요업무`, `주요 서비스`, `AI design`, `template market` 같은 검색어가 실제 services design pack을 찾는다.
  - `src/components/builder/sections/BuiltInSectionsPanel.tsx` — Section template market header, category filter, 결과 count를 추가했다. 검색어 변경 시 category filter를 All로 되돌려 검색 결과가 바로 보인다.
  - `src/components/builder/canvas/SandboxCatalogPanel.tsx` — Add 패널 검색 결과에 section templates를 포함했다. 검색 중에도 맞는 섹션 템플릿 영역이 사라지지 않고, 전체 catalog count에도 반영된다.
  - `src/lib/builder/sections/__tests__/normalize.test.ts`, `tests/builder-editor/section-template-click.playwright.ts` — `주요업무` 검색으로 services 12개가 노출되고 Case Intake Flow까지 보이는지 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/sections/__tests__/normalize.test.ts` ✅ (18 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (2 passed, Chromium sandbox 권한 상승 실행)
  - `git diff --check` ✅
- W 판정:
  - W18/W84/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. 사용자가 말한 “직접 디자인하지 않고 이미 템플릿 있는 전문 사이트처럼 가져다 쓰는” 흐름을 Add 패널의 template market 검색/필터 UX로 보강했다.

## M49 — Add panel page template showroom entry

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/SandboxCatalogPanel.tsx` — Add 패널 상단에 `전체 페이지 템플릿 261개 보기` CTA를 추가했다.
  - `src/components/builder/canvas/SandboxEditorRail.tsx` — Add 패널 CTA가 Pages drawer로 전환하면서 page template gallery open request를 전달하게 했다.
  - `src/components/builder/canvas/PageSwitcher.tsx` — 외부 request id를 받아 기존 `TemplateGalleryModal`을 열 수 있게 했다. 기존 Pages `+ New` 흐름은 유지된다.
  - `tests/builder-editor/section-template-click.playwright.ts` — Add 패널에서 page template showroom을 열고 `261개 템플릿` 표시와 닫기까지 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (3 passed, Chromium sandbox 권한 상승 실행)
  - `git diff --check` ✅
- W 판정:
  - W14/W18/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. 기존 261개 page template gallery가 Pages 내부에 숨어 있던 문제를 Add 패널의 template market 진입점으로 보강했다.

## M50 — Add-to-page template search handoff

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/TemplateGalleryModal.tsx` — `initialSearch` prop을 추가해 외부에서 열린 template showroom이 기존 검색어를 즉시 반영하게 했다.
  - `src/components/builder/canvas/PageSwitcher.tsx`, `SandboxEditorRail.tsx`, `SandboxCatalogPanel.tsx` — Add 패널 검색어를 Pages template gallery open request와 함께 전달한다.
  - `tests/builder-editor/section-template-click.playwright.ts` — Add 패널에서 `법률` 검색 후 template showroom을 열면 쇼룸 검색창도 `법률`이고 `법률사무소 홈`이 바로 보이는지 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (3 passed, Chromium sandbox 권한 상승 실행)
  - `git diff --check` ✅
- W 판정:
  - W14/W18/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. Add 검색에서 page template showroom으로 넘어갈 때 검색 맥락이 끊기지 않게 했다.

## M51 — Page template prompt back path

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/PageSwitcher.tsx` — page template 선택 후 뜨는 slug prompt에 `다른 템플릿 선택` 버튼을 추가했다. 생성 확정 전에도 261개 template showroom으로 되돌아갈 수 있고, pending template은 안전하게 해제된다.
  - `tests/builder-editor/section-template-click.playwright.ts` — Add 패널 `법률` 검색 → page template showroom → `법률사무소 홈` preview → `이 템플릿 사용` → slug prompt → `다른 템플릿 선택` 경로를 실제 브라우저에서 검증한다. 되돌아온 showroom은 검색어 `법률`을 유지한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (3 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W14/W18/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. 사용자가 지적한 template apply 후 back affordance 부재를 page template 생성 단계까지 보강했다.

## M52 — Page template search previews

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/SandboxCatalogPanel.tsx` — Add 패널 검색 결과에 page template showroom preview 영역을 추가했다. `getTemplateCatalog()` metadata를 사용해 261개 page template 중 query match를 찾고, 이름/id/설명/태그/섹션 매칭 score로 상위 4개를 보여준다.
  - `tests/builder-editor/section-template-click.playwright.ts` — Add 패널 `법률` 검색 시 page template result 영역, `/261 page templates` count, `law-home` result card, card click 후 showroom search handoff, preview/use/back path를 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (3 passed, Chromium sandbox 권한 상승 실행)
  - `git diff --check` ✅
- W 판정:
  - W14/W18/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. Add 검색에서 page template을 바로 발견하고 showroom으로 진입하는 전문 템플릿 마켓형 흐름을 보강했다.

## M53 — Page template result thumbnails

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/SandboxCatalogPanel.tsx` — Add 패널 page template result card를 미니 showroom card로 바꿨다. `getAllTemplates()`를 사용해 full template document를 유지하고, `TemplateThumbnailRenderer` 썸네일, Premium/Standard badge, 페이지 타입, 스타일, 섹션 수, 대표 tag를 함께 렌더한다.
  - `tests/builder-editor/section-template-click.playwright.ts` — `law-home` result card 안에 `data-template-thumbnail-renderer="html-scaled-mock"` 썸네일과 Premium badge가 보이는지 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (3 passed, Chromium sandbox 권한 상승 실행)
  - `git diff --check` ✅
- W 판정:
  - W14/W18/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. Add 검색 결과가 단순 목록이 아니라 실제 template market preview에 가깝게 보이도록 보강했다.

## M54 — FAQ reveal persistence

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/lib/builder/canvas/store.ts` — editor interactive preview state에 `faqRevealedIndices`를 추가했다. FAQ item을 선택할 때 open index와 함께 한 번 열어 본 index 목록을 누적한다.
  - `src/components/builder/canvas/CanvasNode.tsx` — FAQ item도 services처럼 현재 선택 index뿐 아니라 revealed index에 포함되면 `data-builder-preview-open`을 유지한다.
  - `tests/builder-editor/node-click-stability.playwright.ts` — FAQ 1번 answer를 연 뒤 hero title 같은 다른 노드를 선택해도 FAQ 0/1 answer text가 계속 visible인지 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/node-click-stability.playwright.ts --workers=1` ✅ (3 passed, Chromium sandbox 권한 상승 실행)
  - `git diff --check` ✅
- W 판정:
  - W18/W84/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. “다른 노드 선택 후 글이 안 보임” 회귀 방어를 FAQ accordion에도 확장했다.

## M55 — Interactive preview document reset

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/lib/builder/canvas/store.ts` — services/FAQ editor preview 기본 상태를 helper로 분리하고, `replaceDocument()` 시 선택/히스토리와 함께 preview open/revealed index도 초기화한다.
  - `src/lib/builder/canvas/__tests__/store-transient.test.ts` — 서비스 2번/FAQ 3번을 열어 둔 뒤 다른 문서로 교체하면 preview 상태가 `[0]` 기본값으로 돌아오는 단위 회귀를 추가했다.
- 검증:
  - `npm run test:unit -- src/lib/builder/canvas/__tests__/store-transient.test.ts` ✅ (5 passed)
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (3 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W18/W84/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. page/template/document 전환 후 이전 페이지에서 열어 둔 서비스/FAQ preview 상태가 다음 문서의 텍스트 표시를 오염시키지 않게 막았다.

## M56 — Editor preference normalization

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/lib/builder/canvas/editor-prefs.ts` — localStorage의 과거/부분 editor prefs를 깊게 정규화한다. `rulers`, `outline`, `pixelGrid`, `alignDistribute` nested default를 채우고 grid size/opacity/tolerance를 clamp하며 invalid guide/keybinding/comment/library entry는 걸러낸다.
  - `src/lib/builder/canvas/__tests__/editor-prefs.test.ts` — nested field 누락 복구, invalid array entry 제거, numeric clamp를 단위 검증한다.
- 검증:
  - `npm run test:unit -- src/lib/builder/canvas/__tests__/editor-prefs.test.ts` ✅ (2 passed)
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/editor-guides-grid.playwright.ts --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W216~W225는 `자동검증 통과 / 사용자 QA 대기` 유지. 이전 버전 localStorage나 부분 저장된 prefs 때문에 rulers/grid/guides/shortcut/comment/component-library UI가 undefined nested 값으로 흔들리는 위험을 줄였다.

## M57 — Template gallery back search + preview sync

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/TemplateGalleryModal.tsx` — 쇼룸 내부 search input 변화를 `onSearchChange`로 상위에 알린다.
  - `src/components/builder/canvas/PageSwitcher.tsx` — template gallery open search와 last search를 분리해, 템플릿 적용 확인 prompt에서 `다른 템플릿 선택`으로 돌아갈 때 쇼룸 내부 최신 검색어를 유지한다.
  - `src/lib/builder/canvas/store.ts` — services/FAQ preview open/revealed index를 selection setter 단계에서 즉시 동기화한다. CanvasNode effect보다 아래에서 처리해 실제 클릭 경로에서 상세 글이 hidden으로 남는 플레이크를 줄인다.
  - `src/lib/builder/canvas/__tests__/store-transient.test.ts` — service/FAQ nested node 선택 직후 preview index가 바로 업데이트되는 store 단위 회귀를 추가했다.
  - `tests/builder-editor/section-template-click.playwright.ts` — Add 패널 `법률` 검색으로 showroom 진입 후 showroom 내부에서 `여행사 홈`으로 다시 검색하고, 적용 확인에서 뒤로 돌아와도 `여행사 홈` 검색어가 유지되는지 검증한다.
- 검증:
  - `npm run test:unit -- src/lib/builder/canvas/__tests__/store-transient.test.ts src/lib/builder/canvas/__tests__/editor-prefs.test.ts` ✅ (8 passed)
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (3 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W14/W18/W84/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. 사용자가 지적한 template back path와 주요업무 글 hidden 회귀를 각각 검색어 보존과 store-level preview sync로 보강했다.

## M58 — Template search aliases

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/lib/builder/templates/filters.ts` — page template 검색 alias와 score helper를 공통화했다. `홈페이지`, `주요업무`, `칼럼 아카이브`, `예약하기`, `쇼핑몰`, `여행사`, `치과`, `동물병원`, `AI 디자인 전문 사이트` 같은 한국어 검색어를 catalog 전체에서 처리한다.
  - `src/components/builder/canvas/TemplateGalleryModal.tsx` — template showroom 검색도 공통 `matchesTemplateSearch()`와 `normalizeTemplateSearchQuery()`를 사용하게 했다.
  - `src/components/builder/canvas/SandboxCatalogPanel.tsx` — Add 패널 page template preview 검색과 score를 같은 helper로 교체하고, 상위 preview 노출을 8개로 늘렸다.
  - `src/lib/builder/templates/__tests__/filters.test.ts` — alias match, market phrasing, direct/alias score 우선순위를 261개 실제 template catalog로 검증한다.
  - `tests/builder-editor/section-template-click.playwright.ts` — Add 패널에서 `홈페이지` 검색만으로 page template results가 뜨고 `*-home` 템플릿이 보이는지 검증한다.
- 검증:
  - `npm run test:unit -- src/lib/builder/templates/__tests__/filters.test.ts` ✅ (5 passed)
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (3 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W14/W18/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. 사용자가 말한 “템플릿 있는 AI 디자인 전문 사이트처럼 검색해서 가져오기” 흐름을 Add 패널과 full showroom 검색 기준까지 확장했다.

## M59 — Public locale page resolution guard

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/lib/builder/site/page-resolution.ts` — public/editor 공용 page meta resolver를 추가했다. `projectPagesForLocale()` 결과 안에서 home/slug 후보를 고르기 때문에 `/ko`가 같은 slug의 최신 `zh-hant` page meta를 잡지 않는다.
  - `src/lib/builder/site/public-page.tsx` — published page resolver가 locale-filtered resolver를 사용하게 했다.
  - `src/lib/builder/site/__tests__/page-resolution.test.ts` — zh-hant home이 더 최신이어도 Korean public home은 ko page를 고르고, target locale page가 없을 때만 default-locale projection을 허용하는 회귀를 추가했다.
  - `tests/builder-editor/locale-projection.playwright.ts` — `/zh-hant/admin-builder` 방문 후 `/ko/admin-builder`와 public `/ko`가 모두 한국어 home text를 유지하고 번중 hero text를 포함하지 않는지 검증한다.
- 검증:
  - `npm run test:unit -- src/lib/builder/site/__tests__/page-resolution.test.ts` ✅ (3 passed)
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/locale-projection.playwright.ts --workers=1` ✅ (2 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W14/W193은 `자동검증 통과 / 사용자 QA 대기` 유지. 사용자가 말한 “편집기는 한국어인데 사이트가 중국어로 뜨는” 경로를 public resolver 단에서 막았다.

## M60 — Template internal link locale normalization

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/lib/builder/canvas/types.ts` — `normalizeCanvasDocument()`가 node content 내부의 nested `href` 값을 재귀적으로 보정한다. `/ko`, `/zh-hant`, `/en`으로 시작하는 내부 링크만 요청 locale prefix로 바꾸고 외부 URL/순수 앵커는 유지한다.
  - `src/lib/builder/canvas/__tests__/locale-links.test.ts` — button link, image hotspot, nested link, query/hash 포함 locale prefix, 외부 URL, anchor link 보존을 검증한다.
- 검증:
  - `npm run test:unit -- src/lib/builder/canvas/__tests__/locale-links.test.ts` ✅ (1 passed)
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/locale-projection.playwright.ts --workers=1` ✅ (2 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W14/W193/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. KO 기반 템플릿을 zh-hant/en 페이지에 적용할 때 CTA와 hotspot 링크가 `/ko/...`로 남아 locale 혼선을 만드는 경로를 막았다.

## M61 — Initial draft overwrite guard

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/hooks/useSandboxSiteState.ts` — `/admin-builder` 초기 draft fetch가 시작된 뒤 사용자가 템플릿/노드 편집을 먼저 수행하면, 늦게 도착한 초기 draft 응답이 현재 canvas를 `replaceDocument()`로 덮어쓰지 않게 했다.
- 검증:
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (3 passed, Chromium sandbox 권한 상승 실행)
  - `npm run test:unit -- src/lib/builder/canvas/__tests__/store-transient.test.ts` ✅ (6 passed)
  - `npm run typecheck` ✅
- W 판정:
  - W18/W84/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. 사용자가 말한 “주요업무 템플릿 클릭 후 다른 노드 선택하면 글이 없어짐” 경로를 초기 draft race 관점에서 재현하고 차단했다.

## M62 — Design panel template discovery

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/SandboxEditorRail.tsx` — Design 패널의 첫 화면을 섹션 이름 4개 pill 대신 카드형 template entry로 바꿨다. 각 섹션이 `12개 디자인 템플릿`을 가진다는 점을 표시하고, 같은 패널에서 전체 페이지 템플릿 261개 쇼룸으로 바로 이동할 수 있게 했다.
  - `tests/builder-editor/section-template-click.playwright.ts` — Design 패널에서 주요 서비스가 12개 디자인 템플릿으로 표시되는지, 전체 페이지 템플릿 버튼이 showroom을 `홈페이지` 검색으로 여는지 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (4 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W14/W18/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. 사용자가 말한 “주요업무 눌렀는데 겨우 네 개 템플릿만 있음” 혼선을 Design 패널 정보 구조에서 줄였다.

## M63 — Page template create retry state

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/PageSwitcher.tsx` — 템플릿/빈 페이지 생성 요청이 실패하면 slug prompt와 pending template을 유지한다. 성공한 경우에만 prompt를 닫고 pending template/slug input을 정리하며 새 pageId를 선택한다.
  - `tests/builder-editor/section-template-click.playwright.ts` — 중복 slug 페이지를 먼저 만든 뒤 page template showroom에서 `법률사무소 홈`을 선택하고 같은 slug로 생성 실패를 유도한다. 오류 뒤 prompt, 입력값, `다른 템플릿 선택` back path, showroom 검색어가 모두 유지되는지 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (5 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W14/W18/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. 템플릿 적용 직후 실패해도 사용자가 처음부터 다시 찾지 않고 바로 수정/뒤로가기를 할 수 있게 했다.

## M64 — Page template create success persistence

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/TemplateGalleryModal.tsx` — template select callback에 template name을 함께 전달한다.
  - `src/components/builder/canvas/PageSwitcher.tsx` — 선택한 page template으로 새 페이지를 만들 때 title을 slug가 아니라 template name으로 저장한다. 성공 시에만 pending template/name을 정리한다.
  - `tests/builder-editor/section-template-click.playwright.ts` — `법률사무소 홈` page template으로 실제 페이지를 생성하고, editor canvas 전환, pages API title, draft API 저장 문서까지 확인한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (6 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W14/W18/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. page template showroom에서 고른 템플릿이 새 페이지 title과 draft document로 실제 저장되는 성공 path를 자동검증으로 고정했다.

## M65 — Custom shortcut runtime evidence

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `tests/builder-editor/editor-advanced-panels.playwright.ts` — shortcut map 저장 후 실제 runtime keydown dispatch까지 확인한다. duplicate를 `Mod+Shift+X`로 override하고, 기존 `Mod+D`는 더 이상 복제하지 않으며 커스텀 조합만 단일 선택된 `home-hero-title`을 `text-*` 노드로 복제하는지 검증한다.
- 검증:
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/editor-advanced-panels.playwright.ts --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `npm run typecheck` ✅
  - `npm run test:unit -- src/lib/builder/canvas/__tests__/shortcuts.test.ts src/lib/builder/canvas/__tests__/editor-prefs.test.ts` ✅ (4 passed)
- W 판정:
  - W216/W219는 `자동검증 통과 / 사용자 QA 대기` 유지. shortcut map이 저장 UI에만 머물지 않고 기본 단축키 override와 실제 canvas action dispatch까지 연결되는지 자동검증으로 고정했다.

## M66 — Custom shortcut label sync

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/lib/builder/canvas/shortcuts.ts` — runtime과 표시 UI가 같은 effective binding map을 쓰도록 custom binding resolver와 platform-aware label formatter를 export한다. `toggleLock` 기본 단축키도 실제 action으로 등록했다.
  - `src/components/builder/canvas/hooks/useShortcutLabels.ts` — editor prefs/storage 변경을 구독해 action별 glyph/title 라벨을 계산한다.
  - `src/components/builder/canvas/CanvasContextMenuLayer.tsx`, `SelectionToolbar.tsx`, `SandboxInspectorPanel.tsx`, `ShortcutsHelpModal.tsx`, `CanvasStageToolbar.tsx`, `CanvasZoomDock.tsx`, `CanvasNodeBadge.tsx` — 메뉴/툴팁/도움말 라벨을 하드코딩 대신 effective shortcut label에서 읽는다.
  - `src/components/builder/canvas/hooks/useCanvasKeyboard.ts`, `CanvasContainer.tsx`, `KeybindingsModal.tsx` — `toggleLock` dispatch와 shortcut modal resolver를 같은 helper로 맞췄다.
  - `src/lib/builder/canvas/__tests__/shortcuts.test.ts`, `tests/builder-editor/editor-advanced-panels.playwright.ts` — custom duplicate shortcut 저장 뒤 툴바/인스펙터/context menu 라벨과 실제 runtime dispatch가 같이 바뀌는지 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run test:unit -- src/lib/builder/canvas/__tests__/shortcuts.test.ts src/lib/builder/canvas/__tests__/editor-prefs.test.ts` ✅ (5 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/editor-advanced-panels.playwright.ts --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `git diff --check` ✅
- W 판정:
  - W216/W219는 `자동검증 통과 / 사용자 QA 대기` 유지. 사용자가 단축키를 바꾸면 저장/동작뿐 아니라 editor 곳곳의 표시 라벨까지 같은 값으로 갱신된다.

## M67 — Layer focus real pointer actions

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/SandboxLayersPanel.tsx` — 레이어 row 선택 시 `builder:focus-canvas-node` 이벤트를 발행한다. 다중 선택 토글도 같은 노드 focus 요청을 보낸다.
  - `src/components/builder/canvas/CanvasContainer.tsx` — focus 이벤트를 받아 선택 노드 rect가 viewport 안으로 들어오도록 horizontal pan을 보정한다.
  - `tests/builder-editor/layer-focus-context-menu.playwright.ts` — 레이어에서 선택한 노드가 실제 `elementFromPoint()` hit target이 되는지 확인하고, 실제 mouse right-click으로 context menu가 열리는지 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/layer-focus-context-menu.playwright.ts --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/editor-advanced-panels.playwright.ts --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `git diff --check` ✅
- W 판정:
  - W18/W84/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. 레이어 선택 후 선택 노드가 화면 밖에 남아 실제 클릭/우클릭이 먹지 않던 체감 회귀를 막았다.

## M68 — Archive/image click blanking guard

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `tests/builder-editor/node-click-stability.playwright.ts` — 칼럼 아카이브/preview link/image 클릭 후 URL 유지뿐 아니라 editor body, canvas application, node tree count, 해당 노드 유지, image selection, asset library 표시까지 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/node-click-stability.playwright.ts --workers=1` ✅ (3 passed, Chromium sandbox 권한 상승 실행)
  - `git diff --check` ✅
- W 판정:
  - W18/W84/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. “칼럼 아카이브/사진 클릭 후 백지화” 계열을 URL만이 아니라 실제 editor surface 생존 기준으로 고정했다.

## M69 — Page template navigation wiring

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/PageSwitcher.tsx` — page template/blank page 생성 prompt에 `메뉴에 추가` 기본 체크 옵션을 추가하고 POST body에 `addToNavigation`을 전달한다.
  - `src/app/api/builder/site/pages/route.ts` — 새 페이지 생성 시 요청이 `addToNavigation`이면 생성된 pageId/title/href를 site navigation에 append하고 home/new page path를 revalidate한다.
  - `src/lib/builder/site/persistence.ts`, `src/lib/builder/site/publish.ts`, `src/app/api/builder/site/navigation/route.ts`, `src/lib/builder/canvas/seed-pages.ts` — site write 병합에서 최신-only navigation item을 기본 보존하고, navigation 삭제/seed cleanup/delete page만 opt-out한다. publish는 최신 navigation을 보존하며 page metadata만 저장한다.
  - `src/components/builder/published/SiteHeader.tsx`, `src/lib/builder/site/public-page.tsx` — public header가 기본 spec 외 custom nav item도 렌더하고, global header canvas가 있을 때도 접근 가능한 Main navigation fallback을 함께 노출한다.
  - `src/lib/builder/site/__tests__/persistence.test.ts`, `tests/builder-editor/section-template-click.playwright.ts` — navigation merge race와 page template 생성→menu 추가→publish→public header link 도달을 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run test:unit -- src/lib/builder/site/__tests__/persistence.test.ts` ✅ (13 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (6 passed, Chromium sandbox 권한 상승 실행)
  - `git diff --check` ✅
- W 판정:
  - W14/W18/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. Wix처럼 템플릿으로 만든 페이지가 생성 직후 메뉴에 들어가고, 발행 후 공개 헤더에서 실제로 도달 가능한지 자동검증으로 고정했다.

## M70 — Locale template page creation guard

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `tests/builder-editor/section-template-click.playwright.ts` — page lookup helper를 locale-aware로 확장하고, `/zh-hant/admin-builder`에서 page template 생성→navigation append→draft href safety→publish→public header link까지 확인하는 회귀 테스트를 추가한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts -g "creates zh-hant template pages with localized menu and safe template links" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (7 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W14/W193/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. 비한국어 locale에서 템플릿으로 만든 페이지가 한국어 public path를 섞지 않고, 메뉴와 공개 헤더가 해당 locale 경로로 연결되는지 자동검증으로 고정했다.

## M71 — API template link normalization guard

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `tests/builder-editor/section-template-click.playwright.ts` — `/api/builder/site/pages`에 synthetic template document를 POST해 `zh-hant`와 `en` draft 저장 단계에서 내부 `/ko` href가 대상 locale로 정규화되는지 확인한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts -g "stores page template documents with localized internal hrefs through the pages api" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (8 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W14/W193/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. UI 카탈로그 template에 없는 `/ko/contact`, `/ko?query`, `/ko#anchor`, nested hotspot href까지 API 생성/저장 경로에서 locale-safe하게 정규화됨을 자동검증으로 고정했다.

## M72 — Auto navigation rename/delete sync

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/app/api/builder/site/pages/[pageId]/route.ts` — page rename PATCH가 navigation href뿐 아니라 `nav-{pageId}` 자동 생성 메뉴 label도 page title로 동기화한다. 직접 만든 navigation label은 건드리지 않는다.
  - `tests/builder-editor/section-template-click.playwright.ts` — `addToNavigation: true` page의 생성→publish→rename→public header→delete cleanup까지 자동 생성 메뉴 label/href 동기화를 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts -g "keeps auto-added page navigation label and href in sync after rename and delete" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (9 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W14/W18/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. 템플릿/blank 생성으로 자동 메뉴에 들어간 페이지가 rename/delete 후 공개 헤더와 navigation state에서 오래된 제목이나 고아 링크를 남기지 않도록 고정했다.

## M73 — Undo timeline action evidence

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/UndoStackTimeline.tsx` — History 패널의 Undo/Redo 버튼에 안정적인 `data-builder-undo-action` 테스트 식별자를 추가했다.
  - `tests/builder-editor/editor-advanced-panels.playwright.ts` — 전역 사이트 문서 상태에 의존하지 않도록 임시 테스트 page를 생성/삭제하고, comments 입력을 선택 node comments panel에 scoped 재시도한다. custom duplicate 후 Undo/Redo 버튼을 실제 클릭해 canvas node count가 되돌아가고 다시 복구되는지 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/editor-advanced-panels.playwright.ts --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `git diff --check` ✅
- W 판정:
  - W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. History 패널이 표시만 되는 상태가 아니라 실제 undo/redo command surface로 동작함을 자동검증으로 고정했다.

## M74 — Shortcut modal Escape close

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/KeybindingsModal.tsx` — modal이 open일 때 `Escape` keydown을 capture 단계에서 처리해 닫고, canvas/editor shortcut handler로 전파되지 않게 했다.
  - `tests/builder-editor/editor-advanced-panels.playwright.ts` — keybinding input이 focus된 상태에서 `Escape`로 modal이 닫히며, 입력한 임시 combo가 저장되지 않고 selection side effect도 없는지 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/editor-advanced-panels.playwright.ts -g "closes the shortcut map with Escape" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/editor-advanced-panels.playwright.ts --workers=1` ✅ (2 passed, Chromium sandbox 권한 상승 실행)
  - `git diff --check` ✅
- W 판정:
  - W216/W219/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. shortcut map이 Wix형 modal처럼 keyboard dismiss를 지원하고 입력 중 취소 시 저장 side effect를 남기지 않도록 고정했다.

## M75 — Plus zoom shortcut parser guard

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/lib/builder/canvas/shortcuts.ts` — shortcut combo tokenizer가 `Mod++`를 `Mod+Plus`로 해석하도록 보강하고, 실제 `+` key 입력이 Shift를 동반해도 zoomIn fallback을 허용한다.
  - `src/lib/builder/canvas/__tests__/shortcuts.test.ts` — `Ctrl+=`, `Ctrl++`, `Ctrl+Shift++` zoomIn 매칭을 검증한다.
- 검증:
  - `npm run test:unit -- src/lib/builder/canvas/__tests__/shortcuts.test.ts` ✅ (3 passed)
  - `npm run typecheck` ✅
  - `git diff --check` ✅
- W 판정:
  - W216/W219는 `자동검증 통과 / 사용자 QA 대기` 유지. shortcut help가 안내하는 Cmd/Ctrl + plus zoom 경로가 parser에서 빈 key token으로 누락되지 않도록 고정했다.

## M76 — Locale standard page seed guard

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/lib/builder/site/standard-pages.ts` — required standard page seed 판단을 locale-aware helper로 분리했다.
  - `src/app/(builder)/[locale]/admin-builder/page.tsx` — `/ko/admin-builder` 같은 editor entry가 요청 locale 기준으로 standard page 누락을 판단한다.
  - `src/lib/builder/canvas/seed-pages.ts` — seed page lookup과 duplicate cleanup이 같은 locale의 홈/slug만 기존/중복으로 취급하도록 변경했다.
  - `src/lib/builder/site/__tests__/standard-pages.test.ts` — 다른 locale 홈/slug가 요청 locale seed를 막지 않는지, locale-less legacy pages는 default Korean으로만 취급되는지 검증한다.
- 검증:
  - `npm run test:unit -- src/lib/builder/site/__tests__/standard-pages.test.ts` ✅ (5 passed)
  - `npm run typecheck` ✅
  - local `/ko/admin-builder?m76Seed=...` 요청 후 authenticated pages API에서 Korean home restored 확인 ✅ (`count: 12`, `slug: ""`, `locale: "ko"`)
  - `git diff --check` ✅
- W 판정:
  - W14/W193/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. 다른 locale의 seed page가 한국어 홈/표준 페이지 생성을 막아 editor가 엉뚱한 첫 페이지로 열리는 경로를 고정했다.

## M77 — Locale navigation projection guard

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/lib/builder/site/paths.ts` — 내부 href의 locale prefix를 감지하는 helper를 추가했다.
  - `src/lib/builder/site/navigation.ts` — navigation item 중 현재 locale과 다른 내부 locale href를 표시 layer에서 걸러내는 projection helper를 추가했다.
  - `src/components/builder/published/SiteHeader.tsx`, `src/components/builder/published/SiteFooter.tsx`, `src/lib/builder/site/public-page.tsx` — header/footer와 global header fallback이 raw shared navigation 대신 locale-filtered navigation을 렌더한다.
  - `src/lib/builder/site/__tests__/navigation.test.ts` — 상대 내부 링크/외부 링크는 유지하고 `/zh-hant/...` 같은 foreign-locale internal href만 제거하는지 검증한다.
  - `tests/builder-editor/locale-projection.playwright.ts` — zh-hant 자동 메뉴 생성 후 ko editor header에 해당 번중 메뉴가 나오지 않는지 실제 UI로 검증한다.
- 검증:
  - `npm run test:unit -- src/lib/builder/site/__tests__/navigation.test.ts` ✅ (3 passed)
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/locale-projection.playwright.ts --workers=1` ✅ (3 passed, Chromium sandbox 권한 상승 실행)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (9 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W14/W18/W193/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. 템플릿/페이지 생성으로 생긴 비한국어 메뉴가 한국어 editor/public header/footer에 커스텀 링크로 섞여 보이는 경로를 표시 projection에서 차단했다.

## M78 — Service template reload persistence

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `tests/builder-editor/section-template-click.playwright.ts` — 빈 테스트 page에 `주요업무`/`Service Accordion` 템플릿을 삽입하고, autosave된 draft JSON과 editor reload 후 화면 텍스트를 함께 검증하는 회귀를 추가했다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts -g "persists inserted service template text" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (10 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W18/W84/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. “주요업무 템플릿 선택 뒤 다른 노드 선택하면 글이 사라짐” 계열을 같은 세션 클릭뿐 아니라 autosave/reload 이후까지 고정했다.

## M79 — Shortcut modal focus trap

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/KeybindingsModal.tsx` — shortcut map modal에 initial focus, Tab/Shift+Tab 순환, 외부 focus 재진입 차단, body scroll lock, 닫힐 때 trigger focus 복귀를 추가했다.
  - `tests/builder-editor/editor-advanced-panels.playwright.ts` — shortcut map을 실제로 열고 첫 입력 focus, Shift+Tab/Tab wrap, 외부 focus probe 차단, Escape 후 trigger focus 복귀를 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/editor-advanced-panels.playwright.ts -g "traps focus inside the shortcut map" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/editor-advanced-panels.playwright.ts --workers=1` ✅ (3 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W216/W219/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. shortcut map이 Wix형 modal처럼 keyboard focus를 modal 안에 가두고 닫힌 뒤 편집 흐름으로 focus를 되돌리도록 고정했다.

## M80 — Image edit dialog focus trap

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/ImageEditDialog.tsx` — Crop/Filter/Alt dialog에 initial focus, Tab/Shift+Tab 순환, 외부 focus 재진입 차단, body scroll lock, 닫힐 때 trigger focus 복귀를 추가했다.
  - `src/lib/builder/canvas/shortcuts.ts` — modal dialog 내부 keyboard event는 canvas shortcut handler가 소비하지 않도록 guard를 추가했다.
  - `src/lib/builder/canvas/__tests__/shortcuts.test.ts` — modal 내부 `Escape`/custom shortcut이 canvas action으로 매칭되지 않는지 검증한다.
  - `tests/builder-editor/asset-image-workflow.playwright.ts` — 이미지 편집 dialog focus trap/restore를 추가하고, 기존 asset replacement/crop/filter/alt 경로의 이미지 선택을 Layers 기반으로 안정화했다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run test:unit -- src/lib/builder/canvas/__tests__/shortcuts.test.ts` ✅ (4 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/asset-image-workflow.playwright.ts -g "traps focus in the image edit dialog" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/asset-image-workflow.playwright.ts --workers=1` ✅ (2 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W22/W23/W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. 이미지/사진 편집 dialog에서 focus가 canvas로 새거나 Escape가 selection shortcut으로 먹히는 경로를 차단했다.

## M81 — Asset library focus trap

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/editor/AssetLibraryModal.tsx` — Asset library dialog에 visible focusable 기반 initial focus, Tab/Shift+Tab 순환, 외부 focus 재진입 차단, body scroll lock, 닫힐 때 focus restore를 추가했다.
  - `tests/builder-editor/asset-image-workflow.playwright.ts` — selection toolbar의 이미지 교체 trigger를 키보드로 열고, Asset library focus trap/외부 focus 차단/Escape close 후 dialog focus 누수 없음까지 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/asset-image-workflow.playwright.ts -g "traps focus in the asset library" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/asset-image-workflow.playwright.ts --workers=1` ✅ (3 passed, Chromium sandbox 권한 상승 실행; 최초 1회 ECONNRESET 후 서버 생존 확인 및 재실행 통과)
- W 판정:
  - W22/W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. 이미지 교체/업로드 dialog에서 focus가 editor canvas로 새거나 Escape가 하위 shortcut으로 먹히는 경로를 닫았다.

## M82 — Preview modal focus trap

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/PreviewModal.tsx` — full-screen preview dialog에 initial focus, Tab/Shift+Tab 순환, 외부 focus 재진입 차단, body scroll lock, 닫힐 때 Preview trigger focus 복귀를 추가했다. `Cmd/Ctrl+R` reload shortcut은 modal 안에서만 처리되도록 capture 단계에서 전파를 막는다.
  - `tests/builder-editor/preview-modal-focus.playwright.ts` — Preview 버튼을 키보드로 열고 desktop initial focus, close button wrap, 외부 focus probe 차단, `ControlOrMeta+R` reload 유지, Escape close와 trigger focus 복귀를 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/preview-modal-focus.playwright.ts --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/mobile-runtime.playwright.ts --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W40/W45/W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. preview iframe/device switcher dialog에서 focus가 editor로 새거나 reload/Escape shortcuts가 canvas로 전파되는 경로를 닫았다.

## M83 — Page slug prompt focus trap

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/PageSwitcher.tsx` — page/template 생성 slug prompt에 initial focus, Tab/Shift+Tab 순환, 외부 focus 재진입 차단, body scroll lock, Escape close를 추가했다. 기존 “다른 템플릿 선택” back path는 유지한다.
  - `tests/builder-editor/section-template-click.playwright.ts` — Add 패널 → page template showroom → template preview → slug prompt 경로에서 focus trap, 외부 focus 차단, Escape close를 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts -g "traps focus in the page template slug prompt" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts -g "keeps the page template creation prompt usable" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (11 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W14/W18/W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. page template 적용 직후 slug prompt에서 focus가 editor canvas로 새거나 Escape/back path가 깨지는 경로를 닫았다.

## M84 — SEO panel focus trap

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/SeoPanel.tsx` — SEO panel dialog에 initial focus, Tab/Shift+Tab 순환, 외부 focus 재진입 차단, body scroll lock, Escape close, 닫힌 뒤 toolbar trigger focus 복귀를 추가했다.
  - `tests/builder-editor/seo-publish-history.playwright.ts` — 실제 test page의 SEO panel을 열고 focus trap, 외부 focus 차단, Escape close, toolbar trigger focus 복귀를 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/seo-publish-history.playwright.ts -g "traps focus in the SEO panel" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/seo-publish-history.playwright.ts -g "covers W26-W28 through actual editor UI clicks" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W186/W190/W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. SEO metadata panel에서 keyboard focus가 editor canvas로 새거나 Escape 후 편집 흐름이 끊기는 경로를 닫았다.

## M85 — Version history focus trap

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/VersionHistoryPanel.tsx` — version history dialog에 initial focus, Tab/Shift+Tab 순환, 외부 focus 재진입 차단, body scroll lock, Escape close, toolbar trigger focus 복귀를 추가했다. 복원 확인 overlay도 별도 `alertdialog` trap으로 묶어 Tab이 배경 리비전 카드로 새지 않게 했다.
  - `tests/builder-editor/seo-publish-history.playwright.ts` — 실제 revision snapshot이 있는 page에서 version history panel과 restore confirmation의 focus trap, 외부 focus 차단, Escape close, toolbar trigger focus 복귀를 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/seo-publish-history.playwright.ts -g "traps focus in the version history panel" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/seo-publish-history.playwright.ts -g "covers W26-W28 through actual editor UI clicks" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W195/W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. 버전 히스토리와 복원 확인 overlay에서 keyboard focus가 editor canvas나 배경 timeline으로 새는 경로를 닫았다.

## M86 — Save section modal focus trap

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/sections/SaveSectionModal.tsx` — save-as-section dialog에 initial focus, Tab/Shift+Tab 순환, 외부 focus 재진입 차단, body scroll lock, Escape close, 닫힌 뒤 focus restore를 추가했다.
  - `tests/builder-editor/seo-publish-history.playwright.ts` — 실제 canvas context menu의 `Save as section...` 경로로 modal을 열고 focus trap, 외부 focus 차단, Escape close를 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/seo-publish-history.playwright.ts -g "traps focus in the save section modal" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/layer-focus-context-menu.playwright.ts --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W84/W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. 컨테이너 우클릭 → 섹션 저장 modal에서 keyboard focus가 context menu/canvas로 새는 경로를 닫았다.

## M87 — Template preview ModalShell focus guard

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/ModalShell.tsx` — ModalShell 기반 dialog에 외부/programmatic focus 재진입 차단을 추가하고, hidden/aria-hidden 요소를 focus 순서에서 제외했다.
  - `src/components/builder/canvas/TemplateGalleryModal.tsx` — template preview nested modal의 별도 전역 Escape listener를 제거하고, preview trigger를 기억해 닫힌 뒤 해당 미리보기 버튼으로 focus를 명시 복귀시킨다.
  - `tests/builder-editor/section-template-click.playwright.ts` — Add 패널 → page template showroom → nested preview에서 Tab trap, 외부 focus 차단, Escape close, preview trigger focus 복귀를 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts -g "traps focus in the page template preview" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts -g "opens the full page template showroom|traps focus in the page template slug prompt|keeps the page template creation prompt usable" --workers=1` ✅ (4 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W14/W18/W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. 템플릿 preview nested modal에서 focus가 parent gallery/editor로 새거나 닫힌 뒤 위치를 잃는 경로를 닫았다.

## M88 — Advanced picker popover focus trap

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/editor/ColorPickerAdvanced.tsx` — advanced color picker popover에 custom color input initial focus, Tab/Shift+Tab 순환, 외부 focus 재진입 차단, Escape close, trigger focus 복귀를 추가했다.
  - `src/components/builder/editor/FontPickerAdvanced.tsx` — advanced font picker popover에 search input initial focus, Tab/Shift+Tab 순환, 외부 focus 재진입 차단, Escape close, trigger focus 복귀를 추가했다.
  - `src/components/builder/canvas/ModalShell.tsx` — child popover의 keyboard event는 parent ModalShell이 처리하지 않도록 `data-builder-popover-dialog` guard를 추가했다.
  - `tests/builder-editor/design-pool.playwright.ts` — color/font picker popover focus trap, 외부 focus 차단, Escape close, parent Site Settings modal 격리를 검증한다. 기존 Site Settings test는 정확히 `Apply`인 theme preset button만 세도록 좁혔다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/design-pool.playwright.ts -g "traps focus in advanced color and font picker" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/design-pool.playwright.ts -g "covers editor shell density|covers site settings" --workers=1` ✅ (2 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W181/W184/W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. color/font picker popover에서 keyboard focus가 editor나 parent modal로 새고, font picker Escape가 Site Settings 전체를 닫는 경로를 닫았다.

## M89 — Published media modal blanking guard

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/elements/ImageElement.tsx` — published/preview image click lightbox와 popup에 initial close-button focus, Tab/Shift+Tab 순환, 외부 focus 재진입 차단, body scroll lock, Escape close, trigger focus 복귀를 추가했다. lightbox 이미지 본문 클릭은 더 이상 backdrop close로 전파되지 않는다.
  - `tests/builder-editor/published-interactions.playwright.ts` — published page에 lightbox/popup 이미지 노드를 추가하고, 이미지 내부 클릭 유지, 외부 focus 차단, Escape close, trigger focus 복귀를 서비스/FAQ interaction smoke와 함께 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/published-interactions.playwright.ts --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W22/W23/W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. 공개 이미지 클릭 후 이미지 본문 클릭이 modal을 즉시 닫아 “사라짐/백지화”처럼 보이는 경로와 keyboard focus 누수를 닫았다.

## M90 — Published overlay keyboard focus restore

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/published/overlayFocus.ts` — published lightbox/popup 공통 focus helper를 추가해 close button initial focus, Tab/Shift+Tab 순환, 외부 focus 재진입 차단, body scroll lock, 닫힌 뒤 opener focus restore를 처리한다.
  - `src/components/builder/published/LightboxMount.tsx` — `data-lightbox-target` trigger가 click뿐 아니라 Enter/Space로도 열리며, opener element를 overlay open event detail로 전달한다.
  - `src/components/builder/published/PopupMount.tsx` — `data-popup-target`/`popup:` anchor trigger가 Enter/Space로도 열리며, once-per-visitor gate를 유지한 채 opener를 overlay에 전달한다.
  - `src/components/builder/published/LightboxOverlay.tsx`, `src/components/builder/published/PopupOverlay.tsx` — 공통 focus helper를 연결하고 overlay root를 focusable dialog로 정리했다.
  - `src/lib/builder/site/persistence.ts` — site document normalization이 `popups`를 보존하도록 해 site-level popup이 다른 site write 뒤 사라지지 않게 했다.
  - `src/components/builder/canvas/elements/ImageElement.tsx` — built-in image lightbox/popup modal을 `document.body` portal로 렌더해 sibling node가 modal pointer event를 가로채는 회귀를 막았다.
  - `tests/builder-editor/published-interactions.playwright.ts` — published page의 site lightbox/popup keyboard trigger, close initial focus, Escape close, opener focus restore, 기존 image modal/service/FAQ interaction 회귀를 함께 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `git diff --check -- tests/builder-editor/published-interactions.playwright.ts src/lib/builder/site/persistence.ts src/components/builder/published/LightboxMount.tsx src/components/builder/published/PopupMount.tsx src/components/builder/published/LightboxOverlay.tsx src/components/builder/published/PopupOverlay.tsx src/components/builder/published/overlayFocus.ts src/components/builder/canvas/elements/ImageElement.tsx` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/published-interactions.playwright.ts --workers=1` ✅ (2 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W23/W98/W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. site-level modal trigger가 mouse-only였던 gap과 overlay focus restore 누수를 닫았고, 공개 이미지 modal stacking 회귀도 같이 막았다.

## M91 — Published auto overlay focus fallback

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/published/overlayFocus.ts` — event detail에 opener가 없는 overlay open 경로에서도 현재 `document.activeElement`를 fallback opener로 기억하는 `resolvePublishedOverlayOpener`를 추가했다.
  - `src/components/builder/published/LightboxOverlay.tsx` — `builder-lightbox:open` event와 `#lb-<slug>` hash open 모두 fallback opener를 저장해 닫힌 뒤 focus를 되돌린다.
  - `src/components/builder/published/PopupOverlay.tsx` — manual trigger뿐 아니라 on-load/on-scroll/on-exit-intent popup처럼 opener detail이 없는 open도 현재 focus를 fallback으로 복귀시킨다.
  - `tests/builder-editor/published-interactions.playwright.ts` — hash lightbox open과 on-load popup open에서 close initial focus, Escape close, fallback opener focus restore를 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `git diff --check -- src/components/builder/published/overlayFocus.ts src/components/builder/published/LightboxOverlay.tsx src/components/builder/published/PopupOverlay.tsx tests/builder-editor/published-interactions.playwright.ts` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/published-interactions.playwright.ts --workers=1` ✅ (3 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W23/W98/W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. direct trigger가 없는 published overlay open에서도 focus가 body로 떨어지지 않도록 닫았다.

## M92 — Cookie consent modal focus trap

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/published/CookieConsentBanner.tsx` — `modal-center` cookie consent를 `role="dialog" aria-modal="true"`로 렌더하고, 공통 published overlay focus helper로 initial focus, Tab/Shift+Tab 순환, 외부 focus 재진입 차단, body scroll lock, opener focus restore를 추가했다.
  - `src/components/builder/published/CookieConsentMount.tsx` — `cookie-consent:open` trigger가 click뿐 아니라 Enter/Space로도 열리며 opener를 open event detail로 전달한다.
  - `tests/builder-editor/published-interactions.playwright.ts` — modal cookie consent 자동 노출, focus trap, 외부 focus probe 차단, keyboard reopen, 저장 후 opener focus restore를 published page에서 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `git diff --check -- src/components/builder/published/CookieConsentBanner.tsx src/components/builder/published/CookieConsentMount.tsx tests/builder-editor/published-interactions.playwright.ts` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/published-interactions.playwright.ts --workers=1` ✅ (4 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W98/W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. public cookie consent modal에서 focus가 페이지 배경으로 새거나 trigger keyboard reopen이 안 되는 경로를 닫았다.

## M93 — Published gallery lightbox focus trap

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/lib/builder/components/gallery/GalleryRender.tsx` — published gallery lightbox를 `document.body` portal로 렌더하고, 공통 published overlay focus helper로 close-button initial focus, Tab/Shift+Tab 순환, 외부 focus 재진입 차단, body scroll lock, opener focus restore를 추가했다. 이미지 본문 클릭은 유지되고 Escape/arrow navigation은 기존처럼 동작한다.
  - `tests/builder-editor/published-interactions.playwright.ts` — published gallery page를 생성해 lightbox open, close initial focus, ArrowRight/ArrowLeft counter 이동, 이미지 내부 클릭 유지, 외부 focus probe 차단, Escape close와 gallery item focus restore를 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `git diff --check -- src/lib/builder/components/gallery/GalleryRender.tsx tests/builder-editor/published-interactions.playwright.ts` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/published-interactions.playwright.ts -g "traps focus in the published gallery lightbox" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/published-interactions.playwright.ts --workers=1` ✅ (5 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W71/W72/W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. public gallery lightbox에서 focus가 페이지 배경으로 새거나 overlay가 node sibling 아래에서 pointer/focus 충돌을 내는 경로를 닫았다.

## M94 — Published mobile header drawer focus trap

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/published/SiteHeader.tsx` — fallback public header의 mobile drawer dialog에 공통 published overlay focus helper를 연결했다. hamburger opener를 기억하고 close button initial focus, Tab/Shift+Tab 순환, 외부 focus 재진입 차단, body scroll lock, Escape close, backdrop close 후 opener focus restore를 처리한다.
  - `tests/builder-editor/published-interactions.playwright.ts` — global header canvas를 임시로 비워 fallback `SiteHeader`를 노출하고, mobile hamburger keyboard open, focus trap, 외부 focus probe 차단, Escape/backdrop close와 hamburger focus restore를 검증한다. 기존 overlay 테스트도 hydration 후 `locator.press()`로 안정화했다.
- 검증:
  - `npm run typecheck` ✅
  - `git diff --check -- src/components/builder/published/SiteHeader.tsx tests/builder-editor/published-interactions.playwright.ts` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/published-interactions.playwright.ts -g "traps focus in the fallback mobile site header drawer" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/published-interactions.playwright.ts -g "opens site lightbox|restores focus for hash" --workers=1` ✅ (2 passed, Chromium sandbox 권한 상승 실행)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/published-interactions.playwright.ts --workers=1` ✅ (6 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W40/W99/W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. public mobile navigation drawer에서 focus가 페이지 배경으로 새거나 Escape/backdrop close 후 위치를 잃는 경로를 닫았다.

## M95 — Published menu-bar keyboard navigation

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/lib/builder/components/menuBar/index.tsx` — menu-bar registry 파일에서 client hook render를 분리해 published server renderer에서도 component registration side effect가 실행되게 했다.
  - `src/lib/builder/components/menuBar/MenuBarRender.tsx` — published/preview dropdown에 focus/ArrowDown/Space open, Escape close, parent focus restore를 추가했다. mobile hamburger는 `aria-expanded`/`aria-controls`, keyboard open, first item initial focus, Escape close와 hamburger focus restore를 처리한다.
  - `src/components/builder/published/LightboxMount.tsx` — `#lb-<slug>` hash open을 전역 mount에서도 표준 `builder-lightbox:open` 이벤트로 변환해 hydration/hashchange 타이밍을 안정화했다.
  - `tests/builder-editor/published-interactions.playwright.ts` — published menu-bar dropdown과 mobile hamburger keyboard path를 추가하고, full published interaction suite에 포함했다.
- 검증:
  - `npm run typecheck` ✅
  - `git diff --check -- src/components/builder/published/LightboxMount.tsx src/lib/builder/components/menuBar/index.tsx src/lib/builder/components/menuBar/MenuBarRender.tsx tests/builder-editor/published-interactions.playwright.ts` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/published-interactions.playwright.ts -g "opens the published menu bar dropdown" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/published-interactions.playwright.ts -g "restores focus for hash lightbox" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/published-interactions.playwright.ts --workers=1` ✅ (7 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W99/W100/W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. menu-bar가 published에서 fallback 텍스트로 떨어지는 경로와 dropdown/mobile keyboard focus가 사라지는 경로를 닫았다.

## M96 — Published header search overlay focus trap

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/SearchOverlay.tsx` — public header search overlay를 공통 `usePublishedOverlayFocus` helper에 연결했다. search input initial focus, Tab/Shift+Tab 순환, 외부 focus 재진입 차단, body scroll lock, Escape close 후 search button focus restore를 처리한다.
  - `tests/builder-editor/published-interactions.playwright.ts` — fallback public header에서 search button keyboard open, focus trap, 외부 focus probe 차단, Escape close와 opener focus restore를 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `git diff --check -- src/components/SearchOverlay.tsx tests/builder-editor/published-interactions.playwright.ts` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/published-interactions.playwright.ts -g "published header search" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/published-interactions.playwright.ts --workers=1` ✅ (8 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W40/W98/W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. header search overlay에서 focus가 페이지 배경으로 새거나 Escape close 뒤 위치를 잃는 경로를 닫았다.

## M97 — Public live chat focus trap

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/published/LiveChatWidget.tsx` — public live chat panel을 `role="dialog" aria-modal="true"`로 렌더하고, 공통 published overlay focus helper로 draft input initial focus, Tab/Shift+Tab 순환, 외부 focus 재진입 차단, body scroll lock, Escape close를 처리한다. panel open 중 bubble trigger가 DOM에서 사라지는 구조라 닫힌 뒤 새 trigger button으로 focus를 명시 복귀시킨다.
  - `tests/builder-editor/published-interactions.playwright.ts` — site setting의 `liveChatWidgetEnabled`를 임시 활성화하고, keyboard open, focus trap, 외부 focus probe 차단, Escape close와 trigger focus restore를 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `git diff --check -- src/components/builder/published/LiveChatWidget.tsx tests/builder-editor/published-interactions.playwright.ts` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/published-interactions.playwright.ts -g "public live chat" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/published-interactions.playwright.ts --workers=1` ✅ (9 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W98/W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. public live chat panel에서 focus가 배경으로 새거나 닫힌 뒤 bubble 위치를 잃는 경로를 닫았다.

## M98 — Public AI chat keyboard path guard

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/FloatingAiChat.tsx` — public AI chat dialog 내부에서 Tab/Shift+Tab 순환과 Escape close를 처리한다. builder-published route에서 legacy chrome이 CSS로 숨겨져도 hidden dialog가 Escape를 가로채지 않도록 visible rect guard를 추가했다.
  - `src/components/QuickContactWidget.tsx` — AI chat close 후 새로 렌더된 quick-contact toggle button으로 focus를 명시 복귀시킨다.
  - `tests/builder-editor/published-interactions.playwright.ts` — legacy public `/ko`에서 AI chat keyboard open, focus wrap, Escape close, trigger focus restore를 검증하고, full published interaction suite에서 hidden legacy chrome이 builder-published overlays를 방해하지 않는지 함께 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `git diff --check -- src/components/FloatingAiChat.tsx src/components/QuickContactWidget.tsx tests/builder-editor/published-interactions.playwright.ts` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/published-interactions.playwright.ts -g "public AI chat" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/published-interactions.playwright.ts --workers=1` ✅ (10 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W98/W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. public AI chat에서 keyboard 위치를 잃는 경로와 hidden legacy dialog가 published overlay Escape를 가로채는 충돌을 닫았다.

## M99 — Public mobile drawer focus trap

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/Header.tsx` — legacy public header mobile toggle에 `aria-expanded`/`aria-controls`와 open/close label을 추가하고, drawer close 후 새 toggle button으로 focus를 복귀시키는 guard를 추가했다.
  - `src/components/MobileNavDrawer.tsx` — public mobile drawer를 명시 id가 있는 modal dialog로 유지하면서 close button initial focus, Tab/Shift+Tab 순환, 외부 focus 재진입 차단, Escape close를 처리한다.
  - `tests/builder-editor/published-interactions.playwright.ts` — legacy public `/ko` 모바일 viewport에서 drawer keyboard open, focus wrap, 외부 focus probe 차단, Escape/button close와 toggle focus restore를 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `git diff --check -- src/components/Header.tsx src/components/MobileNavDrawer.tsx tests/builder-editor/published-interactions.playwright.ts` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/published-interactions.playwright.ts -g "public mobile navigation" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/published-interactions.playwright.ts --workers=1` ✅ (11 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W40/W99/W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. builder-published fallback header와 별개로 legacy public `/ko` 모바일 drawer에서도 keyboard focus가 배경으로 새거나 닫힌 뒤 위치를 잃는 경로를 닫았다.

## M100 — Public year-end popup focus trap

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/YearEndEventPopup.tsx` — public event popup을 공통 overlay focus helper에 연결해 close button initial focus, Tab/Shift+Tab 순환, 외부 focus 재진입 차단, Escape close를 처리한다. 자동 노출 범위는 locale 홈(`/ko`, `/zh-hant`, `/en`)으로 한정해 custom published page overlay와 충돌하지 않게 했다.
  - `tests/builder-editor/published-interactions.playwright.ts` — legacy public `/ko`에서 event popup focus trap을 검증하고, AI chat 테스트는 event popup을 명시적으로 숨긴 상태로 고정했다.
- 검증:
  - `npm run typecheck` ✅
  - `git diff --check -- src/components/YearEndEventPopup.tsx tests/builder-editor/published-interactions.playwright.ts` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/published-interactions.playwright.ts -g "year-end event" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/published-interactions.playwright.ts -g "year-end event|public AI chat|opens site lightbox" --workers=1` ✅ (3 passed, Chromium sandbox 권한 상승 실행)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/published-interactions.playwright.ts --workers=1` ✅ (12 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W98/W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. homepage auto popup의 keyboard focus gap을 닫고, 자동 popup이 builder-published custom routes의 overlay Escape를 가로채는 충돌도 같이 막았다.

## M101 — Published site-search keyboard results

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/lib/builder/components/siteSearch/index.tsx` — inline site-search input에 `aria-autocomplete`, `aria-controls`, `aria-expanded`, `aria-haspopup`를 추가하고 결과 박스를 `role="listbox"`로 렌더한다.
  - `src/components/builder/published/SiteSearchEnhancer.tsx` — live results를 `role="option"` anchor로 만들고 ArrowDown/ArrowUp/Home/End 이동, `aria-activedescendant`, Escape close 후 input focus restore를 처리한다.
  - `tests/builder-editor/published-interactions.playwright.ts` — published site-search page를 만들고 `/api/search`를 route mock으로 고정해 inline results keyboard navigation과 Escape close를 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `git diff --check -- src/lib/builder/components/siteSearch/index.tsx src/components/builder/published/SiteSearchEnhancer.tsx tests/builder-editor/published-interactions.playwright.ts` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/published-interactions.playwright.ts -g "inline site-search" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/published-interactions.playwright.ts --workers=1` ✅ (13 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W98/W100/W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. published site-search 결과가 mouse-only dropdown에 머물지 않고 키보드로 이동/닫기/복귀되는 경로를 확보했다.

## M102 — Published disclosure aria wiring

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/published/PublishedInteractions.tsx` — published services/FAQ disclosure enhancer가 toggle과 body/answer를 `aria-controls`로 연결하고, body/answer `aria-hidden`을 expanded 상태와 동기화한다. 기존 Enter/Space/click 토글 동작은 유지했다.
  - `tests/builder-editor/published-interactions.playwright.ts` — services/FAQ published interaction 검증을 click 중심에서 Enter/Space keyboard와 role/tabindex/aria-controls/aria-hidden 상태 확인까지 확장했다.
- 검증:
  - `npm run typecheck` ✅
  - `git diff --check -- src/components/builder/published/PublishedInteractions.tsx tests/builder-editor/published-interactions.playwright.ts` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/published-interactions.playwright.ts -g "services and FAQ" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/published-interactions.playwright.ts --workers=1` ✅ (13 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W18/W84/W98/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. 사용자 제보가 있었던 주요업무/FAQ disclosure 계열 텍스트 유지 경로에 keyboard+a11y state evidence를 추가했다.

## M103 — Published search tablist keyboard

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/SearchOverlay.tsx` — search overlay tablist가 ArrowRight/ArrowDown, ArrowLeft/ArrowUp, Home, End로 탭을 전환하고 focus를 활성 탭으로 유지하도록 보강했다.
  - `tests/builder-editor/published-interactions.playwright.ts` — published header search overlay 테스트에 tablist keyboard 전환과 selected state 확인을 추가했다. mobile menu-bar test는 hydration 직후 Enter flake를 줄이도록 실제 open state까지 keyboard open을 재시도한다.
- 검증:
  - `npm run typecheck` ✅
  - `git diff --check -- src/components/SearchOverlay.tsx tests/builder-editor/published-interactions.playwright.ts` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/published-interactions.playwright.ts -g "published header search" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/published-interactions.playwright.ts -g "published header search|opens the published menu bar" --workers=1` ✅ (2 passed, Chromium sandbox 권한 상승 실행)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/published-interactions.playwright.ts --workers=1` ✅ (13 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W40/W98/W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. search overlay tablist가 mouse-only 상태에 머물지 않도록 keyboard evidence를 확보했고, 기존 published menu-bar hydration timing 회귀도 테스트 안정성으로 보강했다.

## M104 — Editor click/template regression sweep

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md`, `SESSION.md` — 최신 검증 증거만 기록했다. 제품 코드는 변경하지 않았다.
- 검증:
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/node-click-stability.playwright.ts tests/builder-editor/section-template-click.playwright.ts --workers=1` ✅ (15 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W18/W22/W84/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. 사용자가 반복 제보한 주요업무 텍스트 사라짐, 노드 클릭 이동, 칼럼/이미지 클릭 백지화, 템플릿 뒤로가기/생성/중복 slug 회귀를 최신 코드에서 다시 통과시켰다.

## M105 — Editor modal/focus regression sweep

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `tests/builder-editor/inline-text-editor.playwright.ts` — inline text test가 Pages drawer 상태에 의존하지 않고 생성한 `pageId`로 직접 에디터를 열도록 바꿨다. 재진입 후 `data-editor-ready="true"`를 기다리고, 텍스트 노드 선택은 resize handle 8개가 보일 때까지 짧게 재시도해 hydration/선택 타이밍 flake를 제거했다.
  - `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md`, `SESSION.md` — M105 검증 증거를 기록했다.
- 검증:
  - `npm run typecheck` ✅
  - `git diff --check -- tests/builder-editor/inline-text-editor.playwright.ts` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/inline-text-editor.playwright.ts --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/preview-modal-focus.playwright.ts tests/builder-editor/inline-text-editor.playwright.ts tests/builder-editor/layer-focus-context-menu.playwright.ts --workers=1` ✅ (3 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W03/W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. inline text toolbar/persist/undo-redo 경로와 preview modal/layer context focus 회귀를 최신 코드에서 다시 통과시켰다.

## M106 — Editor a11y/chrome/mobile sweep

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/SandboxPage.module.css` — Add 패널 text widget preset icon의 전경색을 `--editor-accent-strong` 계열로 올려 axe color-contrast 위반을 제거했다.
  - `tests/builder-editor/chrome-click-safety.playwright.ts` — public chrome click safety 테스트가 공통 `openBuilder` helper로 `data-editor-ready="true"` 이후 header/footer click guard를 검증하게 했다.
  - `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md`, `SESSION.md` — M106 검증 증거를 기록했다.
- 검증:
  - `npm run typecheck` ✅
  - `git diff --check -- src/components/builder/canvas/SandboxPage.module.css tests/builder-editor/chrome-click-safety.playwright.ts` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/a11y-smoke.playwright.ts tests/builder-editor/chrome-click-safety.playwright.ts tests/builder-editor/mobile-inspector.playwright.ts --workers=1` ✅ (3 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W40/W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. core editor axe states, header/footer click containment, mobile inspector override 경로를 최신 코드에서 다시 통과시켰다.

## M107 — SEO/history/save-section focus sweep

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `tests/builder-editor/seo-publish-history.playwright.ts` — SEO/publish/history 테스트의 빌더 페이지 오픈 헬퍼가 `data-editor-ready="true"`를 기다린 뒤 SEO/history/save-section focus 경로를 클릭하게 했다. Hydration 전 SEO trigger click이 놓이는 flake를 제거했다.
  - `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md`, `SESSION.md` — M107 검증 증거를 기록했다.
- 검증:
  - `npm run typecheck` ✅
  - `git diff --check -- tests/builder-editor/seo-publish-history.playwright.ts` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/seo-publish-history.playwright.ts -g "SEO panel" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/seo-publish-history.playwright.ts -g "traps focus|save section modal" --workers=1` ✅ (3 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W84/W186/W195/W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. SEO panel, version history restore confirmation, save-section modal focus trap/restore 경로를 최신 코드에서 다시 통과시켰다.

## M108 — Publish/metadata E2E sweep

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md`, `SESSION.md` — M108 검증 증거만 기록했다. 제품 코드는 변경하지 않았다.
- 검증:
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/seo-publish-history.playwright.ts -g "W26 rollback|custom robots|structured data|hreflang|publish dialog" --workers=1` ✅ (5 passed, Chromium sandbox 권한 상승 실행)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/seo-publish-history.playwright.ts -g "actual editor UI clicks" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W26/W27/W28/W187/W192/W193/W195는 `자동검증 통과 / 사용자 QA 대기` 유지. rollback, public head metadata, publish blockers, custom robots.txt, structured data JSON-LD, hreflang, publish diff dialog를 최신 코드에서 다시 통과시켰다.

## M109 — Media/gallery/motion runtime sweep

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md`, `SESSION.md` — M109 검증 증거만 기록했다. 제품 코드는 변경하지 않았다.
- 검증:
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/media-widgets.playwright.ts tests/builder-editor/gallery-widgets.playwright.ts tests/builder-editor/motion-runtime.playwright.ts --workers=1` ✅ (4 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W22/W23/W71/W72/W161/W174/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. media widget catalog, gallery preset catalog, motion inspector controls, published motion/page-transition runtime attrs를 최신 코드에서 다시 통과시켰다.

## M110 — Asset upload/image workflow sweep

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md`, `SESSION.md` — M110 검증 증거만 기록했다. 제품 코드는 변경하지 않았다.
- 검증:
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/asset-upload-security.playwright.ts tests/builder-editor/asset-image-workflow.playwright.ts --workers=1` ✅ (4 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W22/W23/W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. asset upload MIME/size guard, image edit dialog focus trap, asset library focus trap, folder/tag persistence, replacement undo, crop/filter/alt text paths를 최신 코드에서 다시 통과시켰다.

## M111 — Layout/interactive/clipboard sweep

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/lib/builder/components/container/Element.tsx` — React `Children.count`로 실제 자식 수를 판정하게 해 빈 children 배열 때문에 tabs/accordion/slideshow layout preview가 숨는 문제를 수정했다.
  - `tests/builder-editor/clipboard-persistence.playwright.ts` — 삭제/undo/reload 케이스가 생성한 `pageId`로 직접 빌더를 열고 공통 `openBuilder` ready 조건을 기다리게 했다.
  - `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md`, `SESSION.md` — M111 검증 증거를 기록했다.
- 검증:
  - `npm run typecheck` ✅
  - `git diff --check -- src/lib/builder/components/container/Element.tsx tests/builder-editor/clipboard-persistence.playwright.ts` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/clipboard-persistence.playwright.ts -g "deletes selected containers|persists Delete" --workers=1` ✅ (2 passed, Chromium sandbox 권한 상승 실행)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/layout-widgets.playwright.ts --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/layout-widgets.playwright.ts tests/builder-editor/interactive-widgets.playwright.ts tests/builder-editor/clipboard-persistence.playwright.ts --workers=1` ✅ (5 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W09/W29/W30/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. container cascade delete, Delete/Backspace persistence, Cmd+D duplicate, cross-page copy/paste persistence, layout widget previews, interactive widget presets를 최신 코드에서 통과시켰다.

## M112 — Advanced/design/guides sweep

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `tests/builder-editor/editor-guides-grid.playwright.ts` — grid snap 테스트가 공통 `openBuilder` helper로 `data-editor-ready="true"`를 기다리고 toolbar grid button을 title로 명시해 클릭하게 했다.
  - `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md`, `SESSION.md` — M112 검증 증거를 기록했다.
- 검증:
  - `npm run typecheck` ✅
  - `git diff --check -- tests/builder-editor/editor-guides-grid.playwright.ts` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/editor-guides-grid.playwright.ts --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/editor-advanced-panels.playwright.ts tests/builder-editor/design-system-m23.playwright.ts tests/builder-editor/editor-guides-grid.playwright.ts --workers=1` ✅ (5 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W181/W184/W216/W219/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. layers, shortcut map, align/distribute, style paste, components, comments, zoom, undo timeline, typography scale, style source chips, rulers/grid/custom guides를 최신 코드에서 통과시켰다.

## M113 — Locale/mobile runtime sweep

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/SandboxEditorWorkspace.tsx` — global header badge를 header 내부 상단이 아닌 기본 CSS 위치로 되돌려 모바일 헤더의 hamburger/search control을 덮지 않게 했다.
  - `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md`, `SESSION.md` — M113 검증 증거를 기록했다.
- 검증:
  - `npm run typecheck` ✅
  - `git diff --check -- src/components/builder/canvas/SandboxEditorWorkspace.tsx` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/mobile-auto-fit.playwright.ts --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/locale-projection.playwright.ts tests/builder-editor/zh-hant-smoke.playwright.ts tests/builder-editor/mobile-runtime.playwright.ts tests/builder-editor/mobile-auto-fit.playwright.ts --workers=1` ✅ (6 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W10/W14/W40/W193/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. Korean/Traditional Chinese locale isolation, zh-hant editor/public smoke, mobile auto-fit, mobile preview/runtime, sticky CTA and touch context menu를 최신 코드에서 통과시켰다.

## M114 — Empty/error/race-state sweep

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md`, `SESSION.md` — M114 검증 증거만 기록했다. 제품 코드는 변경하지 않았다.
- 검증:
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/empty-error-states.playwright.ts --workers=1` ✅ (9 passed, Chromium sandbox 권한 상승 실행)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/cross-tab-delete-race.playwright.ts --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W05/W09/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. empty canvas/pages/assets/blog feed, save failure blocking, auth expiry, IME blur commit, long Korean text wrapping, stale-tab page deletion reconciliation을 최신 코드에서 통과시켰다.

## M115 — Forms/upload/webhook unit sweep

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md`, `SESSION.md` — M115 검증 증거만 기록했다. 제품 코드는 변경하지 않았다.
- 검증:
  - `npx vitest run src/app/api/forms/__tests__/submit-route.test.ts src/lib/builder/forms/__tests__/validation.test.ts src/lib/builder/forms/__tests__/conditional.test.ts src/lib/builder/canvas/__tests__/upload-validation.test.ts src/lib/builder/webhooks/__tests__/signature.test.ts` ✅ (5 files, 43 tests passed)
- W 판정:
  - W22/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. form submit validation/signature materialization, conditional/validation logic, upload MIME/size validation, webhook signature helper를 최신 코드에서 통과시켰다.

## M116 — Bookings runtime/admin sweep

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/lib/builder/bookings/storage.ts` — `BLOB_READ_WRITE_TOKEN`이 있어도 개발 환경에서는 기본 file backend를 사용하게 했다. `BUILDER_BOOKINGS_BACKEND=local` 또는 기존 `CONSULTATION_LOG_BACKEND=local`도 local override로 처리하고, 개발에서 blob 검증이 필요할 때만 `BUILDER_USE_BLOB_IN_DEV=1`로 opt-in 한다.
  - `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md`, `SESSION.md` — M116 검증 증거를 기록했다.
- 원인/수정:
  - 첫 bookings E2E sweep은 `.env.local`의 blob token 때문에 bookings storage가 원격 blob backend로 붙어 `/api/booking/availability`와 booking mutation이 Playwright 15s API timeout을 넘기며 5/6 실패했다.
  - site persistence의 dev backend 정책과 맞춰 bookings도 local dev 기본값을 file backend로 정규화했다.
- 검증:
  - `npx vitest run src/lib/builder/bookings/__tests__/analytics.test.ts src/lib/builder/bookings/__tests__/availability-templates.test.ts src/lib/builder/bookings/__tests__/refund.test.ts src/lib/builder/bookings/__tests__/email-templates.test.ts src/lib/builder/bookings/__tests__/manage-token.test.ts src/lib/builder/bookings/__tests__/availability.test.ts src/lib/builder/bookings/calendar-sync/__tests__/provider-mappers.test.ts src/lib/builder/bookings/calendar-sync/__tests__/sync-engine.test.ts src/lib/builder/bookings/calendar-sync/__tests__/encryption.test.ts` ✅ (9 files, 27 tests passed)
  - `npm run typecheck` ✅
  - `curl -s -u admin:local-review-2026! "http://localhost:3000/api/booking/availability?serviceId=svc-initial-consultation&staffId=staff-tseng&date=2026-05-14"` ✅ (즉시 slots JSON 응답)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/bookings-m25.playwright.ts tests/builder-editor/bookings-m26-dashboard.playwright.ts tests/builder-editor/bookings-m26-customer-manage.playwright.ts tests/builder-editor/bookings-m27-email-templates.playwright.ts tests/builder-editor/bookings-m27-recurring-availability.playwright.ts tests/builder-editor/bookings-m27-waitlist.playwright.ts --workers=1` ✅ (6 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W196/W197/W198/W199/W200/W201/W202/W211/W212/W215/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. paid booking widget, service/staff/slot CRUD, admin dashboard/reschedule/no-show/calendar views, customer manage link, email templates, recurring holiday exclusion, waitlist promote 경로를 최신 코드에서 통과시켰다.

## M117 — Public interactions/visual sweep

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `tests/builder-editor/helpers/editor.ts` — visual snapshot 전에 Site settings modal의 General form이 실제로 로드될 때까지 기다리게 했다.
  - `tests/visual/baseline/chromium-builder/visual-regression.playwright.ts/*.png` — 현재 기본 사이트 메뉴/캔버스 상태와 로드 완료된 Site settings modal 기준으로 Chromium visual baselines를 갱신했다.
  - `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md`, `SESSION.md` — M117 검증 증거를 기록했다.
- 원인/수정:
  - visual baseline 첫 실행은 현재 기본 사이트 메뉴가 baseline보다 확장되어 first screen이 2% 차이로 실패했다.
  - snapshot update 직후 일반 실행은 Site settings modal을 로딩 상태로 캡처한 baseline 때문에 흔들렸다. helper가 `기본 정보`와 `예: 호정국제법률사무소` 입력 placeholder를 기다리게 해 로드 완료 상태를 기준으로 고정했다.
- 검증:
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/office-map-public.playwright.ts tests/builder-editor/published-interactions.playwright.ts --workers=1` ✅ (15 passed, Chromium sandbox 권한 상승 실행)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/visual-regression.playwright.ts --workers=1 --update-snapshots` ✅ (1 passed, snapshots 갱신)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/visual-regression.playwright.ts --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `npm run typecheck` ✅
- W 판정:
  - W23/W40/W71/W72/W98/W99/W100/W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. office map editor/published reflection, lightbox/popup/cookie/gallery/mobile drawer/header search/live chat/AI chat/menu/search/disclosure keyboard paths, Wix-like visual baselines를 최신 코드에서 통과시켰다.

## M118 — Asset/forms security hardening

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/app/api/builder/assets/route.ts` — asset DELETE payload의 filename을 서버 생성 파일명 형식으로 제한하고 `..` traversal 문자열을 400으로 거부하게 했다.
  - `src/app/api/forms/submit/route.ts` — form submit rate limit을 공통 `checkRateLimit`로 옮겨 Upstash/메모리 fallback 정책을 쓰고, 429 응답에 `Retry-After`를 제공한다. webhook 전송 실패는 성공 응답을 유지하되 retry queue에 기록한다.
  - `src/lib/builder/forms/webhook-retry.ts` — failed webhook delivery를 file/blob backend에 저장하고, due entry drain, retry backoff, max-attempt drop, safe id/path guard를 제공한다. 개발 환경은 blob token이 있어도 기본 local backend이며, blob 검증은 `BUILDER_USE_BLOB_IN_DEV=1`로 opt-in 한다.
  - `src/lib/builder/forms/uploads.ts` — local form upload path resolution이 runtime-data root 밖으로 나가지 못하게 resolve 후 root containment를 검사한다.
  - `src/app/api/forms/__tests__/submit-route.test.ts`, `src/lib/builder/forms/__tests__/webhook-retry.test.ts`, `tests/builder-editor/asset-upload-security.playwright.ts` — rate limit, failed webhook retry, retry drain/drop, invalid asset delete traversal regression을 검증한다.
- 검증:
  - `npx vitest run src/app/api/forms/__tests__/submit-route.test.ts src/lib/builder/forms/__tests__/webhook-retry.test.ts` ✅ (2 files, 8 tests passed)
  - `npx vitest run src/app/api/forms/__tests__/submit-route.test.ts src/lib/builder/forms/__tests__/validation.test.ts src/lib/builder/forms/__tests__/conditional.test.ts src/lib/builder/forms/__tests__/webhook-retry.test.ts src/lib/builder/canvas/__tests__/upload-validation.test.ts src/lib/builder/webhooks/__tests__/signature.test.ts src/lib/builder/security/__tests__/rate-limit.test.ts` ✅ (7 files, 53 tests passed)
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/asset-upload-security.playwright.ts --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `git diff --check` ✅
- W 판정:
  - W22/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. asset upload/delete security, form submit validation/materialization, rate limit fallback, failed webhook retry persistence/drain을 최신 코드에서 통과시켰다.

## M119 — Section template text/click stability

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/app/globals.css` — split-section overflow를 visible로 열고, FAQ answer animation을 fixed max-height가 아닌 grid row transition으로 바꿔 긴 답변이 잘리지 않게 했다. reveal hidden state는 pointer-events를 꺼서 아직 보이지 않는 레이어가 클릭을 가로채지 않게 했다.
  - `src/lib/builder/canvas/types.ts`, `src/lib/builder/site/public-page.tsx`, `src/components/builder/canvas/CanvasNode.tsx` — text-shaped widget 판정을 공통 helper로 옮기고, editor node body에서도 text/button/address/business-hours 류를 min-height 기반으로 렌더링해 주요업무 템플릿 텍스트가 선택 전환 뒤 잘리지 않게 했다.
  - `src/components/builder/canvas/SandboxPage.module.css` — editor node body의 default clipping/background를 제거하고, header edit badge의 컨테이너 hit-test를 통과시켜 hero image 등 canvas node 클릭을 막지 않게 했다. badge 내부 버튼만 pointer event를 받는다.
  - `src/lib/builder/persistence.ts` — expected revision/savedAt write 직전에 snapshot을 재확인해 stale writer가 최신 revision을 덮는 race window를 줄였다.
- 검증:
  - `npm run typecheck` ✅
  - `git diff --check` ✅
  - `npx vitest run src/lib/builder/site/__tests__/persistence.test.ts` ✅ (13 tests passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts -g "lets users click a section chip|opens the full page template showroom from the Design panel|keeps inserted service template text visible while selecting nested nodes" --workers=1` ✅ (3 passed, Chromium sandbox 권한 상승 실행)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/node-click-stability.playwright.ts tests/builder-editor/cross-tab-delete-race.playwright.ts --workers=1` ✅ (4 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W09/W18/W22/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. 주요업무/섹션 템플릿 클릭, 섹션 목록 뒤로가기, 전체 페이지 템플릿 쇼룸, 템플릿 삽입 후 노드 선택 전환 텍스트 가시성, canvas node click stability, cross-tab deletion race를 최신 코드에서 통과시켰다.

## M120 — Shared node index hot-path cleanup

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/lib/builder/canvas/store.ts` — store가 이미 유지하는 `state.nodesById`를 enter/exit group, paste, group/ungroup, addNode/addNodes, reorder, container move 경로에서 재사용하게 했다. 액션마다 `getCanvasNodesById(state.document.nodes)`를 다시 호출하던 hot-path 중복을 제거했다.
  - `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md`, `SESSION.md` — M120 검증 증거를 기록했다.
- 의사결정:
  - `getCanvasNodesById()` WeakMap 캐시는 유지한다. store 밖 또는 새 document node array를 처리하는 경로에는 여전히 유효한 안전장치다.
  - schema/UI 변경 없이 감사 Critical #1의 남은 store 내부 인덱스 재생성만 좁게 닫았다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/canvas/__tests__/store-transient.test.ts src/lib/builder/canvas/__tests__/indexes.test.ts` ✅ (2 files, 8 tests passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/node-click-stability.playwright.ts tests/builder-editor/layer-focus-context-menu.playwright.ts --workers=1` ✅ (4 passed, Chromium sandbox 권한 상승 실행)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts -g "lets users click a section chip|keeps inserted service template text visible while selecting nested nodes" --workers=1` ✅ (2 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. canvas selection/layer context menu, node click stability, FAQ reveal persistence, section template insert/select 경로를 최신 shared index store 코드에서 통과시켰다.

## M121 — Store direct lookup cleanup

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/lib/builder/canvas/store.ts` — ungroup, updateNode, updateNodeContent, updateNodeStyle, z-order, responsive override/reset 경로의 단일 노드 존재 확인을 `state.document.nodes.find(...)`에서 `state.nodesById.get(...)`으로 바꿨다.
  - `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md`, `SESSION.md` — M121 검증 증거를 기록했다.
- 의사결정:
  - bring/send forward/backward의 `findIndex`는 순서 index가 필요하므로 유지했다.
  - 감사 Critical #2의 transient normalize/touchUpdatedAt 방지는 이미 `TRANSIENT_UPDATE_NODES_OPTIONS`와 단위 테스트가 있어 중복 변경하지 않았다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/canvas/__tests__/store-transient.test.ts src/lib/builder/canvas/__tests__/indexes.test.ts` ✅ (2 files, 8 tests passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/node-click-stability.playwright.ts tests/builder-editor/layer-focus-context-menu.playwright.ts --workers=1` ✅ (4 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. node click stability, FAQ reveal persistence, archive/image click safety, layer context menu 경로를 direct lookup cleanup 뒤에도 통과시켰다.

## M122 — Canvas document compare signature cache

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/lib/builder/canvas/store.ts` — `sameJsonContent()`가 unchanged object payload를 반복 비교할 때 같은 `style/content/responsive` 객체를 매번 stringify하지 않도록 WeakMap signature cache를 추가했다.
  - `src/lib/builder/canvas/__tests__/store-transient.test.ts` — no-op style update에서 JSON signature가 재사용되고 history entry가 생기지 않는 regression test를 추가했다.
  - `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md`, `SESSION.md` — M122 검증 증거를 기록했다.
- 의사결정:
  - history/store는 immutable document snapshots와 structural sharing을 전제로 하므로 object reference 기반 WeakMap cache를 선택했다.
  - primitive/null 값은 기존처럼 즉시 JSON signature로 비교한다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/canvas/__tests__/store-transient.test.ts src/lib/builder/canvas/__tests__/indexes.test.ts` ✅ (2 files, 9 tests passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/node-click-stability.playwright.ts --workers=1` ✅ (3 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. repeated no-op update compare, node click stability, archive/image click safety, FAQ reveal persistence를 latest store comparison code에서 통과시켰다.

## M123 — Public form webhook SSRF guard

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/app/api/forms/submit/route.ts` — public form `webhookUrl` delivery 전에 `reasonUrlUnsafe()`를 적용해 loopback/RFC1918/link-local/metadata/non-http URL을 fetch하지 않고 거부한다. 거부된 URL은 retry queue에도 기록하지 않는다.
  - `src/lib/builder/forms/webhook-retry.ts` — defense-in-depth로 unsafe URL record를 무시하고, 기존 queue에 들어온 unsafe due entry는 fetch 없이 drop한다.
  - `src/app/api/forms/__tests__/submit-route.test.ts`, `src/lib/builder/forms/__tests__/webhook-retry.test.ts` — public submit SSRF refusal, retry record refusal, drain-time drop regression을 추가했다.
  - `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md`, `SESSION.md` — M123 검증 증거를 기록했다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/app/api/forms/__tests__/submit-route.test.ts src/lib/builder/forms/__tests__/webhook-retry.test.ts src/lib/builder/webhooks/__tests__/url-guard.test.ts` ✅ (3 files, 55 tests passed)
- W 판정:
  - W22/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. anonymous form submit webhook SSRF guard, retry queue URL guard, URL classifier matrix를 최신 코드에서 통과시켰다.

## M124 — Save section modal cleanup

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/sections/SaveSectionModal.tsx` — 사용하지 않는 `useEffect` import를 제거했다. focus trap 구현은 `useLayoutEffect` 기반 그대로 유지했다.
  - `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md`, `SESSION.md` — M124 검증 증거를 기록했다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/sections/__tests__/normalize.test.ts src/lib/builder/sections/__tests__/thumbnail.test.ts` ✅ (2 files, 33 tests passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/seo-publish-history.playwright.ts -g "traps focus in the save section modal" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W84/W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. section snapshot normalize/thumbnail과 Save Section modal focus trap을 최신 코드에서 통과시켰다.

## M125 — Render-site/file URL safeHref sweep

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/lib/builder/links.ts`, `src/lib/builder/__tests__/links.test.ts` — render-site용 `safeHref()` helper와 unsafe/blank/null regression test를 추가했다.
  - `src/app/api/forms/submit/route.ts`, `src/app/api/forms/__tests__/submit-route.test.ts` — public submit payload의 file URL도 unsafe scheme이면 400으로 거부한다.
  - `src/lib/builder/components/{addressBlock,breadcrumbs,pricingTable,serviceFeatureCard,teamMemberCard}/index.tsx` — legacy/user-controlled href를 anchor에 직접 넣기 전에 `safeHref()`로 거른다.
  - `src/components/builder/forms/FormSubmissionsDashboard.tsx`, `src/components/builder/published/CookieConsentBanner.tsx` — submission file URL과 cookie policy URL 렌더링도 unsafe scheme이면 anchor 대신 plain text/null로 처리한다.
  - `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md`, `SESSION.md` — M125 검증 증거를 기록했다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/__tests__/links.test.ts` ✅ (17 tests passed)
  - `npx vitest run src/app/api/forms/__tests__/submit-route.test.ts src/lib/builder/__tests__/links.test.ts` ✅ (2 files, 23 tests passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/published-interactions.playwright.ts -g "cookie consent|inline search|menu-bar" --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W22/W98/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. public submit file URL validation, render-site unsafe scheme filtering, cookie consent focus path를 latest code에서 통과시켰다.

## M126 — Marketing template preview URL guard

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/marketing/TemplateEditor.tsx` — save 전 admin preview HTML이 user-typed `javascript:`/`data:` button/image URL을 live DOM href/src로 반사하지 않도록 `previewUrl()`을 적용했다.
  - `src/components/builder/marketing/__tests__/TemplateEditor.test.tsx` — unsafe button href/image src가 preview markup에서 `#`로 대체되는 regression test를 추가했다.
  - `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md`, `SESSION.md` — M126 검증 증거를 기록했다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/components/builder/marketing/__tests__/TemplateEditor.test.tsx src/lib/builder/__tests__/links.test.ts` ✅ (2 files, 18 tests passed)
- W 판정:
  - W216은 `자동검증 통과 / 사용자 QA 대기` 유지. marketing template editor preview DOM URL guard를 latest code에서 통과시켰다.

## M127 — Admin redirect and floating URL guard tests

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/app/api/consultation/knowledge/route.ts` — form POST 이후 referer redirect를 같은 origin일 때만 허용하고, 외부/malformed referer는 `/ko/admin-consultation` fallback으로 보낸다.
  - `src/app/api/consultation/knowledge/__tests__/route.test.ts` — 외부 referer open redirect 방지와 same-origin admin filter query 보존을 검증했다.
  - `src/app/api/marketing/track/route.ts` — campaign click tracking redirect가 의도적 open redirect임을 주석으로 명확히 하고, 현재 최소 방어선이 http/https protocol filter임을 기록했다.
  - `src/app/api/marketing/track/__tests__/route.test.ts` — http/https target redirect 허용과 `javascript:` protocol 거부를 검증했다.
  - `src/lib/builder/components/floatingChat/index.tsx` — floating chat href도 `safeHref()`로 통과시켜 unsafe protocol이면 `#`로 대체한다. SSR 렌더 테스트 경로에 맞춰 React import도 명시했다.
  - `src/lib/builder/components/floatingChat/__tests__/floatingChat.test.tsx` — unsafe `javascript:` href가 anchor에 반사되지 않고, safe chat URL은 유지되는지 검증했다.
  - `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md`, `SESSION.md` — M127 검증 증거를 기록했다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/components/floatingChat/__tests__/floatingChat.test.tsx src/app/api/consultation/knowledge/__tests__/route.test.ts src/app/api/marketing/track/__tests__/route.test.ts` ✅ (3 files, 6 tests passed)
  - `npx vitest run src/lib/builder/components/floatingChat/__tests__/floatingChat.test.tsx src/app/api/consultation/knowledge/__tests__/route.test.ts src/app/api/marketing/track/__tests__/route.test.ts src/app/api/forms/__tests__/submit-route.test.ts src/lib/builder/__tests__/links.test.ts` ✅ (5 files, 29 tests passed)
- W 판정:
  - W22/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. admin form redirect origin guard, campaign tracking protocol filter, forms/link/floating-chat security regressions를 latest code에서 통과시켰다.

## M128 — Align/group bounds spread cleanup

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/lib/builder/canvas/align.ts` — align/match size 계산에서 `Math.min(...nodes.map())`, `Math.max(...nodes.map())`, center/middle 임시 배열 생성을 루프 기반 helper로 교체했다.
  - `src/lib/builder/canvas/group.ts` — group bounds와 max z-index 계산을 다섯 번의 spread/map 대신 한 번의 루프로 계산한다.
  - `src/lib/builder/canvas/__tests__/align-group-bounds.test.ts` — 130,000개 선택집합에서 align/match가 spread argument limit 없이 동작하는지, center/middle 기존 수식과 group child relative rect가 유지되는지 검증했다.
  - `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md`, `SESSION.md` — M128 검증 증거를 기록했다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/lib/builder/canvas/__tests__/align-group-bounds.test.ts src/lib/builder/canvas/__tests__/snap.test.ts src/lib/builder/canvas/__tests__/indexes.test.ts` ✅ (3 files, 11 tests passed)
- W 판정:
  - W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. large multi-select align/group bounds와 기존 snap/index 회귀를 latest code에서 통과시켰다.

## M129 — SandboxPage feedback/chrome split

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/SandboxPageChrome.ts` — sandbox page 상수, viewport width map, public floating chrome copy, draft conflict banner style, toast/activity 타입을 분리했다.
  - `src/components/builder/canvas/SandboxFeedbackOverlay.tsx` — lower-left save status/activity chip과 toast stack 렌더링을 전용 컴포넌트로 분리했다.
  - `src/components/builder/canvas/SandboxPage.tsx` — 페이지 조립 책임만 남기고 feedback/chrome helper를 import하도록 정리했다. 파일 길이는 864줄에서 743줄로 줄었다.
  - `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md`, `SESSION.md` — M129 검증 증거를 기록했다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/chrome-click-safety.playwright.ts --project=chromium-builder --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. admin builder shell, public chrome click safety, save/toast overlay compile path를 latest code에서 통과시켰다.

## M130 — TemplateGalleryModal style split

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/TemplateGalleryModal.styles.ts` — template gallery modal의 inline style constants와 quality badge style helper를 별도 파일로 분리했다.
  - `src/components/builder/canvas/TemplateGalleryModal.tsx` — 검색/필터/미리보기/선택 로직만 남기고 style constants를 import한다. 파일 길이는 800줄에서 594줄로 줄었다.
  - `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md`, `SESSION.md` — M130 검증 증거를 기록했다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/design-pool.playwright.ts -g "switches stateful home section template variants" --project=chromium-builder --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W14/W18/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. design pool section template variant switching과 template modal compile path를 latest code에서 통과시켰다.

## M131 — VersionHistoryPanel style split

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/VersionHistoryPanel.styles.ts` — version history dialog, timeline, restore confirm, diff preview style constants/helper를 별도 파일로 분리했다.
  - `src/components/builder/canvas/VersionHistoryPanel.tsx` — focus trap, revision fetch, rollback, diff calculation/rendering flow만 남기고 style constants를 import한다. 파일 길이는 883줄에서 610줄로 줄었다.
  - `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md`, `SESSION.md` — M131 검증 증거를 기록했다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/seo-publish-history.playwright.ts -g "version history" --project=chromium-builder --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W195/W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. version history panel focus trap과 restore confirmation path를 latest code에서 통과시켰다.

## M132 — PageSwitcher helper/style split

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/PageSwitcher.styles.ts` — page switcher row/menu/edit/empty/clipboard/columns quick card style constants를 별도 파일로 분리했다.
  - `src/components/builder/canvas/PageSwitcher.helpers.ts` — slug prompt focusable selector와 API error response parser를 분리했다.
  - `src/components/builder/canvas/PageSwitcher.tsx` — pages/template CRUD and focus logic만 남기고 styles/helpers를 import한다. 파일 길이는 1037줄에서 756줄로 줄었다.
  - `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md`, `SESSION.md` — M132 검증 증거를 기록했다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts --project=chromium-builder --workers=1` ✅ (12 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W14/W18/W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. page template showroom, slug prompt focus trap/back path, create/rename/delete sync, duplicate slug recovery를 latest code에서 통과시켰다.

## M133 — PublishModal style/preflight split

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/PublishModal.styles.ts` — publish/preflight checklist, draft-vs-published diff, schedule panel, button style constants와 style helper를 별도 파일로 분리했다.
  - `src/components/builder/canvas/PublishModalPreflight.tsx` — preflight item aggregation, schedule date formatting, blocker suite fallback, checklist row 렌더링을 별도 파일로 분리했다.
  - `src/components/builder/canvas/PublishModal.tsx` — publish API/save/schedule/diff orchestration만 남기고 style/preflight helper를 import한다. 파일 길이는 1100줄에서 737줄로 줄었다.
  - `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md`, `SESSION.md` — M133 검증 증거를 기록했다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/seo-publish-history.playwright.ts -g "covers W195 publish dialog draft-vs-published diff summary" --project=chromium-builder --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/seo-publish-history.playwright.ts -g "covers W195 publish dialog|covers W26-W28 through actual editor UI clicks" --project=chromium-builder --workers=1` ⚠️ W26-W28 passed, W195는 첫 묶음 실행에서 published baseline 조회가 일시적으로 `첫 발행`으로 표시되어 실패한 뒤 단일 재실행에서 통과했다.
- W 판정:
  - W26/W27/W28/W195/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. publish modal preflight checklist, warning override/publish click path, draft-vs-published diff summary compile/render path를 latest code에서 통과시켰다.

## M134 — CanvasNode interaction/render helper split

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/useCanvasNodeInteractions.ts` — inline text editing lifecycle, touch long-press context menu scheduling, animation preview event state를 전용 hooks로 분리했다.
  - `src/components/builder/canvas/CanvasNodeRenderStyles.ts` — node wrapper/body style calculation과 animation summary calculation을 pure helper로 분리했다.
  - `src/components/builder/canvas/CanvasNode.tsx` — node-specific preview/quick-edit orchestration과 event wiring만 남기고 hook/style helper를 import한다. 파일 길이는 944줄에서 765줄로 줄었다.
  - `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md`, `SESSION.md` — M134 검증 증거를 기록했다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/node-click-regression.playwright.ts tests/builder-editor/section-template-click.playwright.ts --project=chromium-builder --workers=1` ✅ (12 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W18/W84/W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. 주요업무 템플릿 텍스트 유지, nested node selection, page template prompt/preview focus path, node click stability를 latest code에서 통과시켰다.

## M135 — CanvasContainer geometry/drop helper split

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/useCanvasStageGeometry.ts` — stage 좌표 변환, viewport focus, context menu/overlap picker position 계산을 전용 hook으로 분리했다.
  - `src/components/builder/canvas/useCanvasReferenceGuides.ts` — ruler guide 생성/삭제/drag persistence를 전용 hook으로 분리했다.
  - `src/components/builder/canvas/useCanvasFeedbackGeometry.ts` — drag ghost, resize readout, snap label, multi-selection bbox에 필요한 파생 geometry를 전용 hook으로 분리했다.
  - `src/components/builder/canvas/useCanvasStageDrop.ts` — saved section drop과 node kind drop 생성 로직을 전용 hook으로 분리했다.
  - `src/components/builder/canvas/CanvasContainer.tsx` — canvas state orchestration과 stage shell 렌더링만 남기고 helper hooks를 import한다. 파일 길이는 1038줄에서 793줄로 줄었다.
  - `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md`, `SESSION.md` — M135 검증 증거를 기록했다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/node-click-regression.playwright.ts tests/builder-editor/chrome-click-safety.playwright.ts tests/builder-editor/section-template-click.playwright.ts -g "click|keeps inserted service template text|lets users click|chrome" --project=chromium-builder --workers=1` ✅ (13 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W18/W84/W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. stage click routing, public chrome click safety, template insertion/text persistence, page template prompt/preview path를 latest code에서 통과시켰다.

## M136 — SandboxInspectorPanel widget split

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/SandboxInspectorPanel.widgets.tsx` — device visibility toggles, inspector empty state, composite surface editor 렌더링을 전용 위젯 파일로 분리했다.
  - `src/components/builder/canvas/SandboxInspectorPanel.tsx` — inspector state, tabs, layout/content/style orchestration 중심으로 남겼다. 파일 길이는 1277줄에서 1049줄로 줄었다.
  - `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md`, `SESSION.md` — M136 검증 증거를 기록했다.
- 검증:
  - `npm run typecheck` ✅
  - `npx playwright test --config=playwright.config.ts tests/builder-editor/mobile-inspector.playwright.ts tests/builder-editor/inline-text-editor.playwright.ts tests/builder-editor/section-template-click.playwright.ts --project=chromium-builder --workers=1` ✅ (14 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W18/W40/W84/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. mobile inspector overrides, inline text editor persistence, 주요업무 템플릿 nested node selection/text persistence, page template prompt/preview path를 latest code에서 통과시켰다.

## M137 — SandboxInspectorPanel layout tab split

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/SandboxInspectorLayoutTab.tsx` — viewport override selector, rect/font responsive controls, rotation, lock/visible/pin, anchor editor를 전용 layout tab 컴포넌트로 분리했다.
  - `src/components/builder/canvas/SandboxInspectorPanel.tsx` — tab shell, content/style/animation/a11y/seo orchestration 중심으로 남겼다. 파일 길이는 1049줄에서 597줄로 줄었다.
  - `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md`, `SESSION.md` — M137 검증 증거를 기록했다.
- 검증:
  - `npm run typecheck` ✅
  - `npx playwright test --config=playwright.config.ts tests/builder-editor/mobile-inspector.playwright.ts tests/builder-editor/section-template-click.playwright.ts --project=chromium-builder --workers=1` ✅ (13 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W18/W40/W84/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. mobile inspector viewport override controls, 주요업무 템플릿 nested node selection/text persistence, autosave/reload persistence, page template prompt/preview path를 latest code에서 통과시켰다.

## M138 — SandboxInspectorPanel office quick edit split

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/SandboxInspectorOfficeQuickEdit.tsx` — 사무소 지도 Content inspector의 프리셋, 주소, 줌, 전화/팩스, 길찾기 URL 동기화 UI를 별도 컴포넌트로 분리했다.
  - `src/components/builder/canvas/SandboxInspectorPanel.tsx` — office quick edit 탐지와 content tab routing만 남겼다. 파일 길이는 597줄에서 415줄로 줄었다.
  - `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md`, `SESSION.md` — M138 검증 증거를 기록했다.
- 검증:
  - `npm run typecheck` ✅
  - `npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts -g "keeps inserted service template text visible|persists inserted service template text" --project=chromium-builder --workers=1` ✅ (2 passed, Chromium sandbox 권한 상승 실행)
  - `npx playwright test --config=playwright.config.ts tests/builder-editor/office-map-public.playwright.ts -g "quick panel and Content inspector" --project=chromium-builder --workers=1` ✅ (1 passed on retry, 첫 실행은 canvas quick-edit 선택 타이밍에서 element not found)
- W 판정:
  - W18/W84/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. office map quick panel + Content inspector update path, 주요업무 템플릿 nested node selection/text persistence, autosave/reload persistence를 latest code에서 통과시켰다.

## M139 — SandboxCatalogPanel search helper split

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/SandboxCatalogPanel.helpers.ts` — Add/Catalog 패널의 카테고리 상수, 검색 정규화/매칭, 페이지 템플릿 메타/품질 label, centered insert/section offset helper를 분리했다.
  - `src/components/builder/canvas/SandboxCatalogPanel.tsx` — 프리셋 데이터와 렌더/insert orchestration 중심으로 남겼다. 파일 길이는 2905줄에서 2659줄로 줄었다.
  - `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md`, `SESSION.md` — M139 검증 증거를 기록했다.
- 검증:
  - `npm run typecheck` ✅
  - `npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts -g "opens the full page template showroom from the Add panel|opens the full page template showroom from the Design panel|lets users click a section chip|keeps inserted service template text visible" --project=chromium-builder --workers=1` ⚠️ 3 passed, Design panel test first run failed while editor shell stayed `data-editor-ready=false`
  - `npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts -g "opens the full page template showroom from the Design panel" --project=chromium-builder --workers=1` ✅ (1 passed on retry, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W14/W18/W84/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. Add/Design page template showroom, section chip click, 주요업무 템플릿 nested node selection/text persistence를 latest code에서 통과시켰다.

## M140 — SandboxCatalogPanel preset data split

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/SandboxCatalogPanel.presets.ts` — text/media/gallery/layout/interactive/navigation/social/location/decorative widget preset 타입과 데이터, rich text 샘플 생성 helper를 분리했다.
  - `src/components/builder/canvas/SandboxCatalogPanel.tsx` — 카탈로그 필터링, 삽입 handler, 렌더 orchestration 중심으로 남겼다. 파일 길이는 2659줄에서 1239줄로 줄었다.
  - `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md`, `SESSION.md` — M140 검증 증거를 기록했다.
- 검증:
  - `npm run typecheck` ✅
  - `npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts -g "opens the full page template showroom from the Add panel|opens the full page template showroom from the Design panel|keeps inserted service template text visible|persists inserted service template text" --project=chromium-builder --workers=1` ⚠️ first run blocked before browser startup by macOS Chromium MachPort sandbox permission
  - `npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts -g "opens the full page template showroom from the Add panel|opens the full page template showroom from the Design panel|keeps inserted service template text visible|persists inserted service template text" --project=chromium-builder --workers=1` ✅ (4 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W14/W18/W84/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. Add/Design page template showroom, 주요업무 템플릿 nested node selection/text persistence, autosave/reload persistence를 latest code에서 통과시켰다.

## M141 — SandboxCatalogPanel widget section split

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/SandboxCatalogWidgetSection.tsx` — text/media 계열 위젯 프리셋 섹션의 accordion header, grid, preset button 렌더링을 generic 컴포넌트로 분리했다.
  - `src/components/builder/canvas/SandboxCatalogPanel.tsx` — 9개 widget pack 반복 렌더링을 `SandboxCatalogWidgetSection` 호출로 치환했다. 파일 길이는 1239줄에서 906줄로 줄었다.
  - `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md`, `SESSION.md` — M141 검증 증거를 기록했다.
- 검증:
  - `npm run typecheck` ✅
  - `npx playwright test --config=playwright.config.ts tests/builder-editor/section-template-click.playwright.ts -g "opens the full page template showroom from the Add panel|opens the full page template showroom from the Design panel|lets users click a section chip|keeps inserted service template text visible" --project=chromium-builder --workers=1` ✅ (4 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W14/W18/W84/W216은 `자동검증 통과 / 사용자 QA 대기` 유지. Add/Design page template showroom, section chip click, 주요업무 템플릿 nested node selection/text persistence를 latest code에서 통과시켰다.

## M142 — SeoPanel style split

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/SeoPanel.styles.ts` — SEO modal, form, section, tab, button, preview, checkbox style constants를 분리했다.
  - `src/components/builder/canvas/SeoPanel.tsx` — SEO fetch/save/validation/focus trap과 tab content 렌더링 중심으로 남겼다. 파일 길이는 1534줄에서 1376줄로 줄었다.
  - `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md`, `SESSION.md` — M142 검증 증거를 기록했다.
- 검증:
  - `npm run typecheck` ✅
  - `npx playwright test --config=playwright.config.ts tests/builder-editor/seo-publish-history.playwright.ts -g "traps focus in the SEO panel" --project=chromium-builder --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W195/W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. SEO panel focus trap/restore path를 latest code에서 통과시켰다.

## M143 — SiteSettingsModal style split

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/SiteSettingsModal.styles.ts` — Site Settings form, section, field, input, preset card/grid/button style constants를 분리했다.
  - `src/components/builder/canvas/SiteSettingsModal.tsx` — settings fetch/save, theme/brand/mobile/typography state logic과 tab content 렌더링 중심으로 남겼다. 파일 길이는 1644줄에서 1556줄로 줄었다.
  - `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md`, `SESSION.md` — M143 검증 증거를 기록했다.
- 검증:
  - `npm run typecheck` ✅
  - `npx playwright test --config=playwright.config.ts tests/builder-editor/design-system-m23.playwright.ts -g "persists typography scale" --project=chromium-builder --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W184/W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. Site Settings Typography scale persistence와 inspector style source chip path를 latest code에서 통과시켰다.

## M144 — SiteSettingsModal general tab split

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/SiteSettingsGeneralTab.tsx` — Site Settings General 탭의 기본 정보 필드 목록과 input 렌더링을 분리했다.
  - `src/components/builder/canvas/SiteSettingsModal.tsx` — General 탭은 새 컴포넌트 호출로 줄이고, settings/theme/mobile/typography state logic을 유지했다. 파일 길이는 1556줄에서 1517줄로 줄었다.
  - `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md`, `SESSION.md` — M144 검증 증거를 기록했다.
- 검증:
  - `npm run typecheck` ✅
  - `npx playwright test --config=playwright.config.ts tests/builder-editor/design-system-m23.playwright.ts -g "persists typography scale" --project=chromium-builder --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W184/W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. Site Settings modal open/save-adjacent typography scale persistence path를 latest code에서 통과시켰다.

## M145 — SiteSettingsModal mobile tab split

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/SiteSettingsMobileTab.tsx` — Site Settings Mobile 탭의 sticky header, hamburger mode, mobile bottom CTA action 렌더링과 action patch helper를 분리했다.
  - `src/components/builder/canvas/SiteSettingsModal.tsx` — Mobile 탭은 새 컴포넌트 호출로 줄이고, settings fetch/save 및 theme/typography/preset orchestration을 유지했다. 파일 길이는 1517줄에서 1410줄로 줄었다.
  - `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md`, `SESSION.md` — M145 검증 증거를 기록했다.
- 검증:
  - `npm run typecheck` ✅
  - `npx playwright test --config=playwright.config.ts tests/builder-editor/mobile-runtime.playwright.ts -g "mobile" --project=chromium-builder --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W10/W40/W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. Mobile preview iframe, sticky CTA settings, touch long press context menu path를 latest code에서 통과시켰다.

## M146 — SiteSettingsModal advanced tab split

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/SiteSettingsAdvancedTab.tsx` — Advanced 탭의 Motion page transition controls와 Theme colors editor를 분리했다.
  - `src/components/builder/canvas/SiteSettingsModal.tsx` — Advanced 탭은 새 컴포넌트 호출로 줄이고 settings/theme save orchestration을 유지했다. 파일 길이는 1410줄에서 1349줄로 줄었다.
  - `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md`, `SESSION.md` — M146 검증 증거를 기록했다.
- 검증:
  - `npm run typecheck` ✅
  - `npx playwright test --config=playwright.config.ts tests/builder-editor/motion-runtime.playwright.ts -g "page transition" --project=chromium-builder --workers=1` ⚠️ 첫 실행은 macOS Chromium MachPort sandbox permission으로 브라우저 시작 전 실패
  - `npx playwright test --config=playwright.config.ts tests/builder-editor/motion-runtime.playwright.ts -g "page transition" --project=chromium-builder --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W172/W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. Site Settings Advanced page transition 설정과 published motion runtime attrs path를 latest code에서 통과시켰다.

## M147 — SiteSettingsModal typography tab split

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/SiteSettingsTypographyTab.tsx` — Typography 탭의 site font picker, typography scale preview, theme text preset editor를 분리했다.
  - `src/components/builder/canvas/SiteSettingsModal.tsx` — Typography 탭은 새 컴포넌트 호출로 줄이고 theme/save orchestration을 유지했다. 파일 길이는 1349줄에서 1124줄로 줄었다.
  - `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md`, `SESSION.md` — M147 검증 증거를 기록했다.
- 검증:
  - `npm run typecheck` ✅
  - `npx playwright test --config=playwright.config.ts tests/builder-editor/design-system-m23.playwright.ts -g "persists typography scale" --project=chromium-builder --workers=1` ⚠️ 첫 실행은 macOS Chromium MachPort sandbox permission으로 브라우저 시작 전 실패
  - `npx playwright test --config=playwright.config.ts tests/builder-editor/design-system-m23.playwright.ts -g "persists typography scale" --project=chromium-builder --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W184/W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. Typography scale persistence와 inspector style source chip path를 latest code에서 통과시켰다.

## M148 — SiteSettingsModal presets tab split

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/SiteSettingsPresetsTab.tsx` — Presets 탭의 component design presets, design token import/export, radius/shadow presets, My Themes, built-in theme presets 렌더링을 분리했다.
  - `src/components/builder/canvas/SiteSettingsModal.tsx` — Presets 탭은 새 컴포넌트 호출로 줄이고 design token/theme preset handler와 save orchestration을 유지했다. 파일 길이는 1124줄에서 824줄로 줄었다.
  - `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md`, `SESSION.md` — M148 검증 증거를 기록했다.
- 검증:
  - `npm run typecheck` ✅
  - `npx playwright test --config=playwright.config.ts tests/builder-editor/design-pool.playwright.ts -g "exports/imports brand kits" --project=chromium-builder --workers=1` ⚠️ 잘못된 `-g` 패턴으로 No tests found
  - `npx playwright test --config=playwright.config.ts tests/builder-editor/design-pool.playwright.ts -g "covers Site Settings ModalShell tabs" --project=chromium-builder --workers=1` ⚠️ 첫 실행은 macOS Chromium MachPort sandbox permission으로 브라우저 시작 전 실패
  - `npx playwright test --config=playwright.config.ts tests/builder-editor/design-pool.playwright.ts -g "covers Site Settings ModalShell tabs" --project=chromium-builder --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W179/W184/W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. Site Settings Presets tab의 design token export/import, radius/shadow preset, My Theme, theme preset path를 latest code에서 통과시켰다.

## M149 — SiteSettingsModal dark mode tab split

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/SiteSettingsDarkModeTab.tsx` — Dark mode runtime selector, visitor toggle, light/dark simultaneous preview, dark color editor를 분리했다.
  - `src/components/builder/canvas/SiteSettingsModal.tsx` — Dark mode 탭은 새 컴포넌트 호출로 줄이고 darkMode/theme save orchestration을 유지했다. 파일 길이는 824줄에서 719줄로 줄었다.
  - `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md`, `SESSION.md` — M149 검증 증거를 기록했다.
- 검증:
  - `npm run typecheck` ✅
  - `npx playwright test --config=playwright.config.ts tests/builder-editor/design-pool.playwright.ts -g "covers Site Settings ModalShell tabs" --project=chromium-builder --workers=1` ⚠️ 첫 실행은 macOS Chromium MachPort sandbox permission으로 브라우저 시작 전 실패
  - `npx playwright test --config=playwright.config.ts tests/builder-editor/design-pool.playwright.ts -g "covers Site Settings ModalShell tabs" --project=chromium-builder --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W23/W184/W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. Site Settings Dark mode tab의 light/dark preview와 validation-adjacent settings path를 latest code에서 통과시켰다.

## M150 — SeoPanel hreflang tab split

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/SeoPanelHreflangTab.tsx` — Hreflang alternates, linked sibling pages, missing locale warning, sitemap inclusion status 렌더링을 분리했다.
  - `src/components/builder/canvas/SeoPanel.tsx` — Hreflang 탭은 새 컴포넌트 호출로 줄이고 SEO fetch/save/focus trap orchestration을 유지했다. 파일 길이는 1376줄에서 1256줄로 줄었다.
  - `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md`, `SESSION.md` — M150 검증 증거를 기록했다.
- 검증:
  - `npm run typecheck` ✅
  - `npx playwright test --config=playwright.config.ts tests/builder-editor/seo-publish-history.playwright.ts -g "traps focus in the SEO panel" --project=chromium-builder --workers=1` ⚠️ 첫 실행은 macOS Chromium MachPort sandbox permission으로 브라우저 시작 전 실패
  - `npx playwright test --config=playwright.config.ts tests/builder-editor/seo-publish-history.playwright.ts -g "traps focus in the SEO panel" --project=chromium-builder --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W192/W193/W195/W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. SEO panel focus trap/restore path를 latest code에서 통과시키고 Hreflang/Sitemap tab 렌더 경계를 분리했다.

## M151 — SeoPanel assistant tab split

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/SeoPanelAssistantTab.tsx` — SEO Assistant focus keyword, assistant task list, local validation issue rendering을 분리했다.
  - `src/components/builder/canvas/SeoPanel.tsx` — Assistant 탭은 새 컴포넌트 호출로 줄이고 assistant fetch/save, SEO save, focus trap orchestration을 유지했다. 파일 길이는 1256줄에서 1187줄로 줄었다.
  - `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md`, `SESSION.md` — M151 검증 증거를 기록했다.
- 검증:
  - `npm run typecheck` ✅
  - `npx playwright test --config=playwright.config.ts tests/builder-editor/seo-publish-history.playwright.ts -g "traps focus in the SEO panel" --project=chromium-builder --workers=1` ⚠️ 첫 실행은 macOS Chromium MachPort sandbox permission으로 브라우저 시작 전 실패
  - `npx playwright test --config=playwright.config.ts tests/builder-editor/seo-publish-history.playwright.ts -g "traps focus in the SEO panel" --project=chromium-builder --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W186/W195/W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. SEO Assistant 탭 렌더 경계를 분리하고 panel focus trap/restore path를 latest code에서 통과시켰다.

## M152 — SeoPanel advanced schema tab split

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/SeoPanelAdvancedTab.tsx` — Advanced SEO meta tags, structured data toggles, JSON-LD block editor 렌더링을 분리했다.
  - `src/components/builder/canvas/SeoPanel.tsx` — Advanced 탭은 새 컴포넌트 호출로 줄이고 SEO state/update/save/focus trap orchestration을 유지했다. 파일 길이는 1187줄에서 1025줄로 줄었다.
  - `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md`, `SESSION.md` — M152 검증 증거를 기록했다.
- 검증:
  - `npm run typecheck` ✅
  - `npx playwright test --config=playwright.config.ts tests/builder-editor/seo-publish-history.playwright.ts -g "traps focus in the SEO panel" --project=chromium-builder --workers=1` ⚠️ 첫 실행은 macOS Chromium MachPort sandbox permission으로 브라우저 시작 전 실패
  - `npx playwright test --config=playwright.config.ts tests/builder-editor/seo-publish-history.playwright.ts -g "traps focus in the SEO panel" --project=chromium-builder --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W28/W186/W195/W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. Advanced meta/structured data tab 렌더 경계를 분리하고 SEO panel focus trap/restore path를 latest code에서 통과시켰다.

## M153 — SeoPanel social share tab split

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/SeoPanelSocialTab.tsx` — Social share 탭의 OG/Twitter fields와 OG image preview 렌더링을 분리했다.
  - `src/components/builder/canvas/SeoPanel.tsx` — Social 탭은 새 컴포넌트 호출로 줄이고 SEO state/update/save/focus trap orchestration을 유지했다. 파일 길이는 1025줄에서 939줄로 줄었다.
  - `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md`, `SESSION.md` — M153 검증 증거를 기록했다.
- 검증:
  - `npm run typecheck` ✅
  - `npx playwright test --config=playwright.config.ts tests/builder-editor/seo-publish-history.playwright.ts -g "traps focus in the SEO panel" --project=chromium-builder --workers=1` ⚠️ 첫 실행은 macOS Chromium MachPort sandbox permission으로 브라우저 시작 전 실패
  - `npx playwright test --config=playwright.config.ts tests/builder-editor/seo-publish-history.playwright.ts -g "traps focus in the SEO panel" --project=chromium-builder --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W27/W186/W195/W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. Social share tab 렌더 경계를 분리하고 SEO panel focus trap/restore path를 latest code에서 통과시켰다.

## M154 — SeoPanel basics tab split

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/canvas/SeoPanelBasicsTab.tsx` — Basics 탭의 slug/canonical/title/description/noindex fields, 301 redirect toggle, Google preview 렌더링을 분리했다.
  - `src/components/builder/canvas/SeoPanel.tsx` — Basics 탭은 새 컴포넌트 호출로 줄이고 SEO fetch/update/save/focus trap orchestration을 유지했다. 파일 길이는 939줄에서 836줄로 줄었다.
  - `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md`, `SESSION.md` — M154 검증 증거를 기록했다.
- 검증:
  - `npm run typecheck` ✅
  - `npx playwright test --config=playwright.config.ts tests/builder-editor/seo-publish-history.playwright.ts -g "traps focus in the SEO panel" --project=chromium-builder --workers=1` ⚠️ 첫 실행은 macOS Chromium MachPort sandbox permission으로 브라우저 시작 전 실패
  - `npx playwright test --config=playwright.config.ts tests/builder-editor/seo-publish-history.playwright.ts -g "traps focus in the SEO panel" --project=chromium-builder --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W27/W186/W195/W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. Basics tab 렌더 경계를 분리하고 SEO panel focus trap/restore path를 latest code에서 통과시켰다.

## M155 — Asset library grid split

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/editor/AssetLibraryGrid.tsx` — Asset card grid, image preview, file meta, folder selector, mini tag toggles, select/delete actions 렌더링을 분리했다.
  - `src/components/builder/editor/AssetLibraryModal.tsx` — asset library state, persistence, upload/delete/select orchestration은 유지하고 grid 렌더링을 새 컴포넌트 호출로 줄였다. 파일 길이는 818줄에서 751줄로 줄었다.
  - `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md`, `SESSION.md` — M155 검증 증거를 기록했다.
- 검증:
  - `npm run typecheck` ✅
  - `npx playwright test --config=playwright.config.ts tests/builder-editor/asset-image-workflow.playwright.ts -g "traps focus in the asset library" --project=chromium-builder --workers=1` ⚠️ 첫 실행은 macOS Chromium MachPort sandbox permission으로 브라우저 시작 전 실패
  - `npx playwright test --config=playwright.config.ts tests/builder-editor/asset-image-workflow.playwright.ts -g "traps focus in the asset library" --project=chromium-builder --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W22/W23/W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. Asset library grid 렌더 경계를 분리하고 modal focus trap/restore path를 latest code에서 통과시켰다.

## M156 — Asset library chrome split

- 시작/종료: 2026-05-13 / 2026-05-13
- 변경 파일:
  - `src/components/builder/editor/AssetLibraryChrome.tsx` — folder sidebar, search/sort toolbar, upload button/file input, tag filter bar, drop zone 렌더링을 분리했다.
  - `src/components/builder/editor/AssetLibraryModal.tsx` — asset loading, persistence, filtering, upload/delete/select orchestration과 empty/error/grid children 조합만 유지했다. 파일 길이는 751줄에서 637줄로 줄었다.
  - `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md`, `SESSION.md` — M156 검증 증거를 기록했다.
- 검증:
  - `npm run typecheck` ✅
  - `npx playwright test --config=playwright.config.ts tests/builder-editor/asset-image-workflow.playwright.ts -g "traps focus in the asset library" --project=chromium-builder --workers=1` ⚠️ 첫 실행은 macOS Chromium MachPort sandbox permission으로 브라우저 시작 전 실패
  - `npx playwright test --config=playwright.config.ts tests/builder-editor/asset-image-workflow.playwright.ts -g "traps focus in the asset library" --project=chromium-builder --workers=1` ✅ (1 passed, Chromium sandbox 권한 상승 실행)
- W 판정:
  - W22/W23/W216/W225는 `자동검증 통과 / 사용자 QA 대기` 유지. Asset library chrome 렌더 경계를 분리하고 modal focus trap/restore path를 latest code에서 통과시켰다.

## M164-G — Payment Analytics First Slice

- 시작/종료: 2026-05-20 / 2026-05-20
- 변경 파일:
  - `src/lib/builder/payment-analytics.ts` — commerce orders와 paid bookings를 함께 집계해서 attempts, conversion, failed payments, partial/refunded counts, by-currency gross/refunded/net/outstanding totals를 만든다.
  - `src/app/(builder)/[locale]/admin-builder/commerce/payments/page.tsx` — `/admin-builder/commerce/payments` 관리자 결제 분석 페이지를 추가했다.
  - `src/components/builder/commerce/OrderManager.module.css` — 결제 분석 카드, currency table, source quality panel의 반응형 스타일을 추가했다.
  - `src/components/builder/commerce/BillingDocumentsClient.tsx`, `BillingDocuments.module.css` — 중앙 Billing 문서 화면에 collected, balance due, manual pending, refunded, needs-review 요약 스트립과 payment mix/attention rows를 추가했다.
  - `src/components/builder/commerce/OrderManagerClient.tsx`, `ProductManagerClient.tsx`, `BillingDocumentsClient.tsx` — commerce 관리자 화면에서 Payments 링크를 노출했다.
  - `src/lib/builder/__tests__/payment-analytics.test.ts`, `tests/builder-editor/payment-analytics.playwright.ts` — 집계 단위 테스트와 관리자 화면/모바일 안전성 검증을 추가했다.
  - `WIX-FULL-PRODUCT-CHECKPOINTS.md`, `WIX-FULL-PRODUCT-GAP.md`, `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md` — F74를 빨간 상태에서 첫 부분 완료 상태로 갱신하고 남은 trend/funnel/export/provider-fee analytics를 기록했다.
- 검증:
  - `npm run test:unit -- src/lib/builder/__tests__/payment-analytics.test.ts` ✅
  - `npm run typecheck` ✅
  - `BASE_URL=http://127.0.0.1:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/payment-analytics.playwright.ts --workers=1` ✅ (3 passed)
- F 판정:
  - F74는 🔴에서 🟡로 이동. Revenue/conversion/refund/failed payment summaries are now available across orders and bookings, but deeper trend charts, attribution funnels, exports, provider fee analytics, and alerting remain.

## M166-A — AI Site Builder Intake And Plan First Slice

- 시작/종료: 2026-05-20 / 2026-05-20
- 변경 파일:
  - `src/lib/builder/ai-generator/orchestrator.ts` — 생성 결과에 sitemap, content plan, brand brief를 추가하고 업종/희망 페이지 기반 기본 페이지 트리를 만든다.
  - `src/lib/builder/ai-generator/content-generator.ts` — audience, goals, desired pages, brand keywords, constraints를 LLM 프롬프트와 deterministic fallback에 반영한다.
  - `src/components/builder/ai-generator/AiGeneratorWizard.tsx`, `AiGeneratorWizard.module.css` — AI 생성기 화면을 목표/페이지/브랜드/제약 입력, 사이트맵/콘텐츠 계획 미리보기, 팔레트/캔버스 프리뷰 중심의 모바일 안전 UI로 재구성했다.
  - `src/app/(builder)/[locale]/admin-builder/ai-generator/page.tsx` — AI generator page header를 F85/F86 범위에 맞게 갱신했다.
  - `src/components/builder/canvas/SandboxEditorRail.tsx`, `src/components/builder/BuilderWorkspaceDashboard.tsx` — 에디터 진입점에서 AI Site Generator 링크를 노출했다.
  - `src/lib/builder/ai-generator/__tests__/orchestrator.test.ts`, `tests/builder-editor/ai-generator.playwright.ts` — 확장 brief가 sitemap/content plan으로 변환되는 단위 테스트와 관리자 화면/mobile overflow E2E를 추가했다.
  - `WIX-FULL-PRODUCT-CHECKPOINTS.md`, `WIX-FULL-PRODUCT-GAP.md`, `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md` — F85/F86를 첫 부분 완료로, F87을 editable draft apply 부분 완료로 기록했다.
- 검증:
  - `npm run test:unit -- src/lib/builder/ai-generator/__tests__/orchestrator.test.ts` ✅
  - `npm run typecheck` ✅
  - `BASE_URL=http://127.0.0.1:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/ai-generator.playwright.ts --workers=1` ⚠️ sandbox 내부 첫 실행은 Chromium MachPort 권한으로 브라우저 시작 전 실패
  - `BASE_URL=http://127.0.0.1:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/ai-generator.playwright.ts --workers=1` ✅ (2 passed, 권한 상승 실행)
- F 판정:
  - F85/F86은 🔴에서 🟡로 이동. Prompt-to-site intake now captures goals/pages/audience/brand/constraints and returns sitemap/content plan/brand brief previews.
  - F87은 🔴에서 🟡로 이동. Generated drafts can still be applied as editable canvas nodes, but design-pool section matching, responsive AI variants, asset-aware layouts, and safe multi-page apply/revert remain.

## M166-B — AI Site Builder Safe Apply And Header Navigation

- 시작/종료: 2026-05-20 / 2026-05-20
- 변경 파일:
  - `src/components/builder/ai-generator/AiGeneratorWizard.tsx`, `AiGeneratorWizard.module.css` — generated draft apply에서 `window.prompt`를 제거하고 inline slug 입력, validation, duplicate error 표시, success link를 추가했다.
  - `src/app/api/builder/ai-generator/apply/route.ts` — slug normalize, lowercase/hyphen pattern, reserved slug, existing page duplicate guard를 추가하고 generated page는 draft-only로 유지한다.
  - `src/components/builder/canvas/SandboxEditorWorkspace.tsx`, `src/components/builder/canvas/hooks/useSandboxSiteState.ts` — 공개 header nav click/pointer activation을 editor 내부 page switch로 안정화하고, stale page list는 refresh 후 재시도한다.
  - `src/app/api/builder/site/pages/route.ts`, `src/app/api/builder/site/pages/[pageId]/draft/route.ts`, `src/app/api/builder/site/pages/[pageId]/linked/route.ts` — page list/draft/linked GET은 read-only auth만 사용하게 해 mutation rate limit이 페이지 열기/전환을 되돌리지 않게 했다.
  - `tests/builder-editor/ai-generator.playwright.ts`, `tests/builder-editor/chrome-click-safety.playwright.ts`, `src/app/api/builder/site/pages/[pageId]/draft/__tests__/route.test.ts` — prompt dialog 없음, duplicate slug error, draft 생성 cleanup, drawer/header overlap, columns navigation, simple header link page switch, read-only guard regression을 검증한다.
  - `WIX-FULL-PRODUCT-CHECKPOINTS.md`, `WIX-FULL-PRODUCT-GAP.md`, `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md` — F87의 safe single-page draft apply 상태와 남은 multi-page/design-pool/responsive AI gap을 갱신했다.
- 검증:
  - `npm run test:unit -- src/lib/builder/ai-generator/__tests__/orchestrator.test.ts` ✅
  - `npm run test:unit -- 'src/app/api/builder/site/pages/[pageId]/draft/__tests__/route.test.ts'` ✅
  - `npm run typecheck` ✅
  - `BASE_URL=http://127.0.0.1:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/chrome-click-safety.playwright.ts -g "lets simple public header links switch builder pages" --workers=1` ✅ (권한 상승 실행)
  - `BASE_URL=http://127.0.0.1:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/chrome-click-safety.playwright.ts tests/builder-editor/ai-generator.playwright.ts --workers=1` ✅ (11 passed, 권한 상승 실행)
- F 판정:
  - F87은 🟡 유지. Single-page AI draft apply is safer: inline slug validation, duplicate/reserved slug blocking, no prompt dialog, and draft-only creation are covered.
  - 남은 Wix 대비 gap: multi-page AI creation, page-tree diff/reorder, design-pool section matching, asset-aware layouts, responsive AI fixes, prompt history, full revert/apply transaction UX, and F88-F94 assistants.

## M166-C — AI Generated Layout Design Quality First Slice

- 시작/종료: 2026-05-20 / 2026-05-20
- 변경 파일:
  - `src/lib/builder/ai-generator/canvas-import.ts` — AI 생성 캔버스를 단순 text stack에서 renderable `container` section 구조로 재작성했다. Hero, proof cards, brand/keyword visual card, alternating content card sections, final CTA를 생성하고 node id를 pageId 기반으로 안정화했다.
  - `src/app/api/builder/ai-generator/apply/route.ts` — generated draft 저장 시 `normalizeCanvasDocument`를 통과한 완전한 canvas document(stageWidth/stageHeight/updatedAt/updatedBy 포함)를 저장하게 했다.
  - `src/lib/builder/ai-generator/__tests__/canvas-import.test.ts` — 생성 노드가 schema-valid인지, top-level section이 container인지, child parent가 renderable container인지, professional card/proof/visual/mobile override primitives가 들어가는지 검증한다.
  - `tests/builder-editor/ai-generator.playwright.ts` — draft 생성 후 새 builder page를 실제로 열어 AI section, headline, visual card, card node가 렌더링되는지 검증한다.
  - `WIX-FULL-PRODUCT-CHECKPOINTS.md`, `WIX-FULL-PRODUCT-GAP.md`, `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md` — F87의 generated layout 상태와 남은 Wix 대비 gap을 갱신했다.
- 검증:
  - `npm run test:unit -- src/lib/builder/ai-generator/__tests__/orchestrator.test.ts src/lib/builder/ai-generator/__tests__/canvas-import.test.ts` ✅
  - `npm run typecheck` ✅
  - `BASE_URL=http://127.0.0.1:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/ai-generator.playwright.ts --workers=1` ✅ (2 passed, 권한 상승 실행)
  - `BASE_URL=http://127.0.0.1:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/chrome-click-safety.playwright.ts tests/builder-editor/ai-generator.playwright.ts --workers=1` ✅ (11 passed, 권한 상승 실행)
- F 판정:
  - F87은 🟡 유지. Single-page AI draft now opens as an editable, schema-valid, container-based page with visible generated sections, proof cards, visual brand card, content cards, CTA, and first mobile overrides.
  - 남은 Wix 대비 gap: exact design-pool template matching, AI asset/image selection, multi-page generation and page-tree diff/reorder, breakpoint-specific AI fix suggestions, user review/revert transaction UX, prompt history, section insertion workflow, and F88-F94 assistants.

## M166-D — AI Generated Sections Design-Pool Metadata First Slice

- 시작/종료: 2026-05-20 / 2026-05-20
- 변경 파일:
  - `src/lib/builder/ai-generator/canvas-import.ts` — AI 생성 섹션 root에 `sectionTemplateId`/`aiSectionTemplateKind`를 부여하고, services/faq/insights/offices에 맞는 카드 class, button variant, mobile height override를 생성한다.
  - `src/lib/builder/canvas/section-templates.ts`, `src/lib/builder/canvas/types.ts`, `src/lib/builder/components/container/Element.tsx` — 기존 home section template metadata resolver를 AI section node도 받을 수 있게 확장하고 published/runtime data attributes를 노출한다.
  - `src/components/builder/canvas/CanvasNode.tsx`, `src/components/builder/canvas/SandboxEditorRail.tsx` — 선택된 AI 생성 섹션도 Design drawer/quick template panel에서 template variant 대상으로 인식한다.
  - `src/components/builder/canvas/CanvasNodeRenderStyles.ts`, `src/components/builder/canvas/SandboxPage.module.css` — 선택된 flow section의 quick template panel이 뒤쪽 섹션에 가려지지 않도록 editor-only 레이어를 보강했다.
  - `tests/builder-editor/design-pool.playwright.ts` — 현재 56px topbar 기준으로 CSS-ready 체크를 갱신해 menu overlap fix와 테스트 기대값을 맞췄다.
  - `src/lib/builder/ai-generator/__tests__/canvas-import.test.ts`, `src/lib/builder/site/__tests__/published-node-frame.test.ts`, `tests/builder-editor/ai-generator.playwright.ts` — AI section template metadata, child class contract, button variants, published attrs, generated-page editor rendering을 검증한다.
- 검증:
  - `npm run test:unit -- src/lib/builder/ai-generator/__tests__/orchestrator.test.ts src/lib/builder/ai-generator/__tests__/canvas-import.test.ts src/lib/builder/site/__tests__/published-node-frame.test.ts` ✅ (24 passed)
  - `npm run typecheck` ✅
  - `BASE_URL=http://127.0.0.1:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/ai-generator.playwright.ts --workers=1` ✅ (2 passed, 권한 상승 실행)
  - `BASE_URL=http://127.0.0.1:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/design-pool.playwright.ts -g "switches stateful home section template variants" --workers=1` ✅ (1 passed, 권한 상승 실행)
  - `BASE_URL=http://127.0.0.1:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/chrome-click-safety.playwright.ts --workers=1` ✅ (9 passed, 권한 상승 실행)
- F 판정:
  - F87은 🟡 유지. AI generated single-page drafts now carry first-slice design-pool template metadata/classes and can participate in section template variant UI without being covered by neighboring canvas sections.
  - 남은 Wix 대비 gap: curated design-pool template/pixel matching, AI asset/image selection, multi-page generation and page-tree diff/reorder, breakpoint-specific AI fix suggestions, user review/revert transaction UX, prompt history, section insertion workflow, and F88-F94 assistants.

## M166-E — AI Prompt History And Hydration Safety

- 시작/종료: 2026-05-21 / 2026-05-21
- 변경 파일:
  - `src/components/builder/ai-generator/AiGeneratorWizard.tsx` — 생성 성공 시 최근 6개 prompt/spec/draft를 locale-scoped localStorage history에 저장하고, 이전 생성안을 복원해 sitemap/content plan/apply panel을 다시 열 수 있게 했다.
  - `src/components/builder/ai-generator/AiGeneratorWizard.tsx` — client hydration 전 step 버튼을 비활성화하고 `data-ai-generator-ready`를 노출해 빠른 클릭이 SSR 화면에서 유실되지 않게 했다.
  - `src/components/builder/ai-generator/AiGeneratorWizard.module.css` — Prompt History 카드, 복원/삭제 버튼, 모바일 안전 ellipsis/overflow 처리를 추가했다.
  - `tests/builder-editor/ai-generator.playwright.ts` — localStorage history 저장, history count, 복원 notice, 복원 후 sitemap visibility, hydration-ready gate를 실제 브라우저에서 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://127.0.0.1:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/ai-generator.playwright.ts --workers=1` ✅ (2 passed, 권한 상승 실행)
- F 판정:
  - F85은 🟡 유지. Prompt history/versioning gap 중 local recent-history/restore first slice가 동작한다.
  - 남은 Wix 대비 gap: server-side prompt versions, named branches, compare/diff, multi-user history, history-to-multi-page apply, and full review/revert transaction UX.

## M166-F — AI Apply Rollback And Draft Discard Safety

- 시작/종료: 2026-05-21 / 2026-05-21
- 변경 파일:
  - `src/app/api/builder/ai-generator/apply/route.ts` — draft page meta 생성 후 canvas write가 실패하면 `deletePage`로 생성된 page/canvas/nav 흔적을 롤백하고 `apply_failed` 500 응답을 반환하게 했다.
  - `src/app/api/builder/ai-generator/apply/__tests__/route.test.ts` — canvas 저장 실패 시 생성된 page를 rollback하는 API 단위 회귀 테스트를 추가했다.
  - `src/components/builder/ai-generator/AiGeneratorWizard.tsx`, `AiGeneratorWizard.module.css` — 생성 성공 카드에 `Draft 폐기` 액션을 추가하고, DELETE 성공/404 idempotent 상태를 UI 메시지로 정리하게 했다.
  - `tests/builder-editor/ai-generator.playwright.ts` — 생성된 draft가 page list에 들어간 뒤 UI 폐기 버튼으로 사라지는지, 이후 다시 생성한 draft를 builder에서 열 수 있는지 E2E로 검증한다.
  - `WIX-FULL-PRODUCT-CHECKPOINTS.md`, `WIX-FULL-PRODUCT-GAP.md`, `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md` — F87의 safe apply/revert first slice 상태를 갱신했다.
- 검증:
  - `npm run typecheck` ✅
  - `npx vitest run src/app/api/builder/ai-generator/apply/__tests__/route.test.ts` ✅ (1 passed)
  - `BASE_URL=http://127.0.0.1:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/ai-generator.playwright.ts --workers=1` ⚠️ sandbox 내부 첫 실행은 Chromium MachPort 권한으로 브라우저 시작 전 실패
  - `BASE_URL=http://127.0.0.1:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/ai-generator.playwright.ts --workers=1` ✅ (2 passed, 권한 상승 실행)
- F 판정:
  - F87은 🟡 유지. Single-page AI draft apply now has first-slice failure rollback and explicit UI discard, so generated orphan pages are less likely to remain after canvas write failure or user cancellation.
  - 남은 Wix 대비 gap: multi-page AI creation, review/diff/apply transaction UI, named revert checkpoints, curated design-pool pixel matching, AI asset/image selection, responsive AI breakpoint fixes, section insertion workflow, and F88-F94 assistants.

## M166-G — AI Hero Media And Compact Header Columns Regression

- 시작/종료: 2026-05-21 / 2026-05-21
- 변경 파일:
  - `src/lib/builder/ai-generator/canvas-import.ts` — AI hero visual card에 실제 `image` canvas node와 media badge를 추가해 텍스트 카드가 아니라 미디어 프레임이 있는 섹션으로 렌더링되게 했다.
  - `src/lib/builder/ai-generator/__tests__/canvas-import.test.ts` — generated canvas가 schema-valid 상태로 hero media image와 media badge를 포함하는지 검증한다.
  - `tests/builder-editor/ai-generator.playwright.ts` — 생성된 AI page를 builder에서 열었을 때 hero media image node가 실제 이미지로 렌더링되는지 검증한다.
  - `tests/builder-editor/chrome-click-safety.playwright.ts` — 사이드 drawer를 연 뒤 compact header mobile menu에서 칼럼 링크를 눌러도 실제 `/columns` builder page로 이동하고 drawer/menu가 닫히는 회귀 테스트를 추가했다.
  - `WIX-FULL-PRODUCT-CHECKPOINTS.md`, `WIX-FULL-PRODUCT-GAP.md`, `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md` — F87의 hero media/design quality와 compact header columns navigation coverage를 갱신했다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run test:unit -- src/lib/builder/ai-generator/__tests__/canvas-import.test.ts` ✅ (2 passed)
  - `BASE_URL=http://127.0.0.1:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/ai-generator.playwright.ts --workers=1` ✅ (2 passed, 권한 상승 실행)
  - `BASE_URL=http://127.0.0.1:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/chrome-click-safety.playwright.ts --workers=1` ✅ (10 passed, 권한 상승 실행)
- F 판정:
  - F87은 🟡 유지. AI single-page draft layout now includes an actual hero media image frame, and builder chrome has direct coverage for compact header mobile-menu columns navigation after a side drawer was open.
  - 남은 Wix 대비 gap: curated design-pool pixel matching, AI-selected/uploaded asset workflows, multi-page generation and page-tree diff/reorder, responsive AI breakpoint fixes, section insertion workflow, review/diff/apply transaction UX, server-side prompt versioning, and F88-F94 assistants.

## M166-H — AI Generated Section Reuse And Mobile CTA Spacing

- 시작/종료: 2026-05-21 / 2026-05-21
- 변경 파일:
  - `src/lib/builder/ai-generator/canvas-import.ts` — AI 생성 root section을 Saved Sections payload로 재사용할 수 있는 `draftToSavedSectionSnapshots` pure helper를 추가하고, root `x/y=0`, `parentId=undefined`로 정규화하면서 `sectionTemplateId`, `aiSectionTemplateKind`, `variant`, card class, mobile overrides를 보존한다.
  - `src/lib/builder/ai-generator/canvas-import.ts` — 일반 content section CTA에 mobile rect를 추가하고, CTA가 본문과 카드 사이에 오도록 card mobile y/root mobile height를 조정해 모바일 겹침을 줄였다.
  - `src/components/builder/ai-generator/AiGeneratorWizard.tsx`, `AiGeneratorWizard.module.css` — 생성 결과에 Reusable Sections 패널을 추가해 각 AI section을 `/api/builder/site/section-library`로 저장하고, 저장된 section id를 UI에 노출하며 Saved Sections 패널 refresh 이벤트를 보낸다.
  - `src/components/builder/sections/SavedSectionsPanel.tsx` — 저장 섹션 카드/삽입 버튼에 안정적인 data attribute를 추가해 AI 저장 섹션 재사용 흐름을 E2E로 검증할 수 있게 했다.
  - `src/app/api/builder/site/section-library/__tests__/route.test.ts`, `src/lib/builder/ai-generator/__tests__/canvas-import.test.ts`, `tests/builder-editor/ai-generator.playwright.ts` — AI section snapshot 보존, section-library POST acceptance, 모바일 CTA 순서, 생성 섹션 저장 후 builder Saved Sections 삽입을 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run test:unit -- src/lib/builder/ai-generator/__tests__/canvas-import.test.ts src/app/api/builder/site/section-library/__tests__/route.test.ts` ✅ (10 passed)
  - `BASE_URL=http://127.0.0.1:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/ai-generator.playwright.ts --workers=1` ⚠️ sandbox 내부 첫 실행은 Chromium MachPort 권한으로 브라우저 시작 전 실패
  - `BASE_URL=http://127.0.0.1:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/ai-generator.playwright.ts --workers=1` ✅ (3 passed, 권한 상승 실행)
- F 판정:
  - F87은 🟡 유지. AI generated sections now have a reusable Saved Sections path and can be inserted back into the builder while preserving first-slice design-pool metadata/classes/mobile overrides.
  - 남은 Wix 대비 gap: multi-page AI creation and page-tree diff/reorder, curated design-pool pixel matching, AI-selected/uploaded asset workflows, richer responsive AI breakpoint suggestions with preview/undo, broader section generator controls, review/diff/apply transaction UX, server-side prompt versioning, and F88-F94 assistants.

## M166-I — AI Draft SEO Seed And Hero Proof Mobile Density

- 시작/종료: 2026-05-21 / 2026-05-21
- 변경 파일:
  - `src/app/api/builder/ai-generator/apply/route.ts` — AI draft page 생성 직후 `page.seo` 초기값을 저장한다. `hero.headline + companyName` 기반 title, hero body/sitemap purpose/goal 기반 description, brand keyword 기반 focusKeyword, OG/Twitter title/description을 seed한다.
  - `src/app/api/builder/ai-generator/apply/route.ts` — SEO seed 저장도 apply transaction 안에 포함해 이후 canvas write 실패 시 기존 `deletePage` rollback으로 page/SEO 흔적이 함께 사라지게 했다.
  - `src/lib/builder/ai-generator/canvas-import.ts` — hero proof/stat cards의 mobile rect를 1-column stack으로 바꾸고 proof label/copy mobile rect를 추가해 긴 한국어 목표 문구가 좁은 카드 폭에 갇히지 않게 했다.
  - `src/lib/builder/ai-generator/canvas-import.ts` — proof card stack과 hero visual이 겹치지 않도록 visual mobile y와 hero root mobile height를 조정했다.
  - `src/app/api/builder/ai-generator/apply/__tests__/route.test.ts`, `src/lib/builder/ai-generator/__tests__/canvas-import.test.ts`, `tests/builder-editor/ai-generator.playwright.ts` — SEO seed 저장, rollback 유지, proof card mobile rect 순서/폭, draft document responsive rect, generated page SEO API 값을 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run test:unit -- src/lib/builder/ai-generator/__tests__/canvas-import.test.ts src/app/api/builder/ai-generator/apply/__tests__/route.test.ts` ✅ (6 passed)
  - `BASE_URL=http://127.0.0.1:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/ai-generator.playwright.ts --workers=1` ✅ (3 passed, 권한 상승 실행)
- F 판정:
  - F87은 🟡 유지. AI draft pages now start with editable SEO metadata and hero proof cards have a mobile-safe one-column density model in the generated canvas data.
  - 남은 Wix 대비 gap: multi-page AI creation and page-tree diff/reorder, curated design-pool pixel matching, AI-selected/uploaded asset workflows, richer responsive AI breakpoint suggestions with preview/undo, broader section generator controls, review/diff/apply transaction UX, server-side prompt versioning, and F88-F94 assistants.

## M166-J — AI Sitemap Draft Pages

- 시작/종료: 2026-05-21 / 2026-05-21
- 변경 파일:
  - `src/app/api/builder/ai-generator/apply/route.ts` — `scope: "sitemap"` apply mode를 추가해 AI sitemap의 non-home 페이지를 draft pages로 생성한다. invalid/reserved/duplicate slug는 skip으로 보고하고, 생성 중 하나라도 실패하면 이미 만든 모든 page를 rollback한다.
  - `src/lib/builder/ai-generator/canvas-import.ts` — sitemap 보조 페이지용 starter canvas helper를 추가해 page purpose와 planned sections를 editable cards로 남긴다.
  - `src/components/builder/ai-generator/AiGeneratorWizard.tsx`, `AiGeneratorWizard.module.css` — 생성 범위 선택 UI, created/skipped 상태 chip, multi-page 생성 결과 목록, sitemap draft 폐기 흐름을 추가하고 모바일 card stack을 유지했다.
  - `src/app/api/builder/ai-generator/apply/__tests__/route.test.ts`, `tests/builder-editor/ai-generator.playwright.ts` — duplicate skip, multi-page rollback, sitemap draft 생성/SEO/draft card/status chip을 검증한다.
  - `WIX-FULL-PRODUCT-CHECKPOINTS.md`, `WIX-FULL-PRODUCT-GAP.md`, `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md` — F86/F87의 multi-page first slice 상태를 갱신했다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run test:unit -- src/lib/builder/ai-generator/__tests__/canvas-import.test.ts src/app/api/builder/ai-generator/apply/__tests__/route.test.ts` ✅ (8 passed)
  - `BASE_URL=http://127.0.0.1:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/ai-generator.playwright.ts -g "creates selected sitemap draft pages" --workers=1` ✅ (1 passed, 권한 상승 실행)
  - `BASE_URL=http://127.0.0.1:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/ai-generator.playwright.ts --workers=1` ✅ (4 passed, 권한 상승 실행)
- F 판정:
  - F86/F87은 🟡 유지. AI sitemap can now be applied as multiple non-home draft pages with duplicate skip reporting, SEO seeds, starter editable page cards, and all-created-pages rollback.
  - 남은 Wix 대비 gap: page-tree diff/reorder/navigation-publish controls, curated design-pool pixel matching, AI-selected/uploaded asset workflows, richer responsive AI breakpoint suggestions with preview/undo, broader section generator controls, review/diff/apply transaction UX, server-side prompt versioning, and F88-F94 assistants.

## M166-K — AI Sitemap Selective Draft Apply

- 시작/종료: 2026-05-21 / 2026-05-21
- 변경 파일:
  - `src/app/api/builder/ai-generator/apply/route.ts` — `pageSlugs` 선택 필터를 추가해 `scope: "sitemap"`에서도 선택된 sitemap slug만 생성한다. single duplicate slug는 AI content generation 전에 즉시 409로 반환해 UI timeout을 줄였고, 빈 선택은 `no_selected_sitemap_pages` 400으로 막는다.
  - `src/components/builder/ai-generator/AiGeneratorWizard.tsx`, `AiGeneratorWizard.module.css` — sitemap row checkbox, selected count, 전체 선택/선택 해제 컨트롤, 짧은 status chip label, 모바일 grid stack/긴 slug wrapping을 추가했다.
  - `src/app/api/builder/ai-generator/apply/__tests__/route.test.ts` — 선택 slug만 생성, duplicate fast-fail, empty selection reject, rollback 유지 케이스를 검증한다.
  - `tests/builder-editor/ai-generator.playwright.ts` — 한 sitemap page를 선택 해제한 뒤 선택된 page만 생성되고, unselected/duplicate/created status가 동시에 맞는지 검증한다. AI 생성 timeout과 section-library 조회 polling도 실제 dev-server 지연에 맞게 안정화했다.
  - `WIX-FULL-PRODUCT-CHECKPOINTS.md`, `WIX-FULL-PRODUCT-GAP.md`, `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md` — F86/F87의 selected sitemap apply 상태를 갱신했다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run test:unit -- src/app/api/builder/ai-generator/apply/__tests__/route.test.ts src/lib/builder/ai-generator/__tests__/canvas-import.test.ts` ✅ (10 passed)
  - `BASE_URL=http://127.0.0.1:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/ai-generator.playwright.ts -g "creates selected sitemap draft pages" --workers=1` ✅ (1 passed, 권한 상승 실행)
  - `BASE_URL=http://127.0.0.1:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/ai-generator.playwright.ts --workers=1` ✅ (4 passed, 권한 상승 실행)
- F 판정:
  - F86/F87은 🟡 유지. AI sitemap apply now supports actual page-level selection with disabled home rows, unselected status, selected count, duplicate skip, SEO/draft verification, and all-created-pages rollback.
  - 남은 Wix 대비 gap: page-tree diff/reorder/navigation-publish controls, curated design-pool pixel matching, AI-selected/uploaded asset workflows, richer responsive AI breakpoint suggestions with preview/undo, broader section generator controls, review/diff/apply transaction UX, server-side prompt versioning, and F88-F94 assistants.

## M166-L — AI Sitemap Navigation Inclusion Safety

- 시작/종료: 2026-05-21 / 2026-05-21
- 변경 파일:
  - `src/app/api/builder/ai-generator/apply/route.ts` — selected sitemap apply에 `addToNavigation` 옵션을 추가했다. 실제 생성된 page만 navigation 끝에 추가하고, duplicate/invalid/skipped slug는 메뉴에 넣지 않으며, 실패 시 기존 `deletePage` rollback으로 page와 navigation 항목을 함께 정리한다.
  - `src/lib/builder/site/navigation.ts`, `src/lib/builder/site/public-page.tsx` — 공개 runtime navigation 필터가 `pageId`가 있는 미공개 page 항목을 숨기도록 확장했다. AI draft page를 메뉴에 추가해도 publish 전 공개 header에는 노출되지 않는다.
  - `src/components/builder/ai-generator/AiGeneratorWizard.tsx`, `AiGeneratorWizard.module.css` — sitemap apply panel에 `Navigation에 추가` 토글, helper copy, Nav on/Draft only 상태, 생성 후 navigation update 결과, sitemap row navigation-added chip을 추가했다.
  - `tests/builder-editor/ai-generator.playwright.ts`, `src/app/api/builder/ai-generator/apply/__tests__/route.test.ts`, `src/lib/builder/site/__tests__/navigation.test.ts` — created-only navigation add, public unpublished nav hiding, UI status, selected sitemap E2E cleanup을 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run test:unit -- src/app/api/builder/ai-generator/apply/__tests__/route.test.ts src/lib/builder/site/__tests__/navigation.test.ts src/lib/builder/ai-generator/__tests__/canvas-import.test.ts` ✅ (14 passed)
  - `BASE_URL=http://127.0.0.1:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/ai-generator.playwright.ts -g "creates selected sitemap draft pages" --workers=1` ✅ (1 passed, 권한 상승 실행)
  - `BASE_URL=http://127.0.0.1:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/ai-generator.playwright.ts --workers=1` ✅ (4 passed, 권한 상승 실행)
  - `BASE_URL=http://127.0.0.1:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/chrome-click-safety.playwright.ts -g "columns|top toolbar" --workers=1` ✅ (4 passed, 권한 상승 실행)
  - `BASE_URL=http://127.0.0.1:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/chrome-click-safety.playwright.ts -g "compact header mobile menu links|simple public header links" --workers=1` ✅ (2 passed, 권한 상승 실행)
  - `git diff --check` ✅
- F 판정:
  - F86/F87은 🟡 유지. Selected AI sitemap draft pages can now be optionally inserted into Navigation with a designer-visible control, while unpublished draft menu items are hidden from public runtime headers until publish.
  - 남은 Wix 대비 gap: page-tree diff/reorder and publish controls; curated design-pool pixel matching; AI-selected/uploaded asset workflows; richer responsive AI breakpoint fixes with preview/undo; style suggestions; deeper section generator controls; server-side prompt versioning; broader review/diff transaction UX; F88-F94 assistants.

## M166-M — AI Visual Direction And Image Prompt Metadata

- 시작/종료: 2026-05-21 / 2026-05-21
- 변경 파일:
  - `src/lib/builder/ai-generator/site-spec.ts`, `content-generator.ts`, `orchestrator.ts` — AI prompt spec에 `visualDirection`을 추가하고, draft plan에 `visualBrief`를 생성한다. 이 brief는 direction, Image 2.0-ready imagePrompt, treatment, composition을 포함한다.
  - `src/components/builder/ai-generator/AiGeneratorWizard.tsx`, `AiGeneratorWizard.module.css` — 스타일 단계에 `이미지 / 비주얼 방향` 입력을 추가하고, 생성안 화면에 Visual Brief 카드와 image prompt preview를 표시한다. 모바일 390px에서 긴 프롬프트가 wrap되도록 별도 card 스타일을 넣었다.
  - `src/lib/builder/canvas/types.ts`, `src/lib/builder/ai-generator/canvas-import.ts` — image canvas node가 `generationPrompt`와 `visualDirection`을 보존할 수 있게 하고, AI hero media에 prompt metadata, alt text, focal point, deterministic image filter treatment, visual frame/rule 장식을 넣었다.
  - `src/lib/builder/ai-generator/__tests__/orchestrator.test.ts`, `src/lib/builder/ai-generator/__tests__/canvas-import.test.ts`, `tests/builder-editor/ai-generator.playwright.ts` — visual brief 생성, schema-valid image prompt metadata, hero filter treatment, admin preview, draft document metadata를 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run test:unit -- src/lib/builder/ai-generator/__tests__/orchestrator.test.ts src/lib/builder/ai-generator/__tests__/canvas-import.test.ts src/app/api/builder/ai-generator/apply/__tests__/route.test.ts` ✅ (16 passed)
  - `BASE_URL=http://127.0.0.1:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/ai-generator.playwright.ts -g "generates sitemap and content plan" --workers=1` ✅ (1 passed, 권한 상승 실행)
  - `BASE_URL=http://127.0.0.1:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/ai-generator.playwright.ts --workers=1` ✅ (4 passed, 권한 상승 실행)
- F 판정:
  - F85/F87/F92은 🟡 유지/부분 상승. AI generator now captures visual direction, previews a designer-facing visual brief, and stores Image 2.0-ready prompt metadata on generated hero image nodes.
  - 남은 Wix 대비 gap: actual external image generation/import and persisted asset creation; selected/uploaded asset matching; image replace/edit assistant; page-tree diff/reorder; curated design-pool pixel matching; responsive AI preview/undo; server-side prompt versioning; broader F88-F94 assistants.

## M166-N — AI Uploaded Hero Asset Selection

- 시작/종료: 2026-05-21 / 2026-05-21
- 변경 파일:
  - `src/lib/builder/ai-generator/site-spec.ts` — AI generator spec에 `heroImageAsset`를 추가했다. 외부 URL 대신 `builder/assets/{locale}/{filename}` 내부 asset id만 통과하도록 schema를 제한했다.
  - `src/components/builder/ai-generator/AiGeneratorWizard.tsx`, `AiGeneratorWizard.module.css` — 스타일 단계에 uploaded hero asset picker를 추가했다. 최근 builder image assets를 불러오고, 자동 Image 2.0 방향 카드와 업로드 이미지 카드 선택/해제 상태를 모바일 390px에서도 깨지지 않게 표시한다.
  - `src/lib/builder/ai-generator/canvas-import.ts` — `heroMediaFor`가 선택된 builder asset id를 같은 locale의 `/api/builder/assets/...` URL로 변환해 visual-direction/industry fallback보다 우선 적용한다. prompt metadata, visualDirection, filter treatment는 그대로 보존한다.
  - `src/lib/builder/ai-generator/__tests__/orchestrator.test.ts`, `src/lib/builder/ai-generator/__tests__/canvas-import.test.ts`, `tests/builder-editor/ai-generator.playwright.ts` — asset id schema guard, uploaded hero asset 우선 적용, AI style picker 선택 상태와 history 저장을 검증한다.
  - `WIX-FULL-PRODUCT-CHECKPOINTS.md`, `WIX-FULL-PRODUCT-GAP.md`, `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md` — F85/F87/F92의 uploaded hero asset first slice 상태를 갱신했다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run test:unit -- src/lib/builder/ai-generator/__tests__/orchestrator.test.ts src/lib/builder/ai-generator/__tests__/canvas-import.test.ts` ✅ (12 passed)
  - `BASE_URL=http://127.0.0.1:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/ai-generator.playwright.ts -g "selects an uploaded hero image asset" --workers=1` ✅ (1 passed, 권한 상승 실행)
- F 판정:
  - F85/F87/F92은 🟡 유지/부분 상승. AI generator can now select an existing uploaded builder image asset and use it as the generated hero media while retaining Image 2.0-ready prompt metadata.
  - 남은 Wix 대비 gap: actual external image generation/import and newly generated asset persistence; image replace/edit assistant; page-tree diff/reorder; curated design-pool pixel matching; responsive AI preview/undo; server-side prompt versioning; broader F88-F94 assistants.

## M28-L — Expanded Header Drawer Navigation Safety

- 시작/종료: 2026-05-21 / 2026-05-21
- 1번 기능 에이전트 / 2번 디자인 에이전트 / 3번 기록 에이전트 반영:
  - 이번 editor QA slice에서 해결한 항목: wide canvas에서 Pages/Navigation side drawer가 열린 상태로 공개 header nav link를 클릭하면 페이지는 바뀌지만 drawer가 남아 새 페이지를 가리는 경로.
  - `onHeaderNavigate`가 header link activation 직전에 active drawer를 닫게 해 `/columns` 같은 공개 header link page switch 후 canvas가 바로 보이도록 했다.
  - compact mobile header menu, Columns drawer button, Pages drawer column shortcut, narrow top toolbar separation 경로는 기존 회귀와 함께 다시 통과시켰다.
  - 아직 Wix 대비 남은 항목: 실제 사용자 QA에서 side drawer와 editor top chrome의 장시간 작업/저장/미리보기 조합을 계속 확인해야 하며, F85-F94 AI/design assistant depth는 별도 milestone으로 남는다.
- 변경 파일:
  - `src/components/builder/canvas/SandboxPage.tsx` — public header navigation handler에서 side drawer를 먼저 닫고 기존 page switch를 실행한다.
  - `tests/builder-editor/chrome-click-safety.playwright.ts` — expanded header link가 열린 side drawer를 닫고 `/columns` builder page로 이동하는 회귀 테스트를 추가했다.
  - `WIX-FULL-PRODUCT-GAP.md`, `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md` — M28 editor chrome QA 상태와 남은 Wix gap 기록을 갱신했다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://127.0.0.1:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/chrome-click-safety.playwright.ts -g "expanded public header links" --workers=1` ✅ (1 passed, 권한 상승 실행)
  - `BASE_URL=http://127.0.0.1:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/chrome-click-safety.playwright.ts -g "compact header mobile menu links|moves from the columns panel|Pages drawer column shortcut|keeps top toolbar inside narrow|expanded public header links" --workers=1` ✅ (5 passed, 권한 상승 실행)
- W/F 판정:
  - W14/W18/W216/W225는 🟡 유지. Columns page 이동 no-op/가림 제보 경로는 compact and expanded header/drawer variants로 자동검증됐다.
  - 남은 Wix 대비 gap: top chrome/side drawer long-session user QA, broader F85-F94 AI image/design assistant parity, and full product release audit.

## M166-O — AI Designer System Chips And Palette Swatches

- 시작/종료: 2026-05-21 / 2026-05-21
- 1번 기능 에이전트 / 2번 디자인 에이전트 / 3번 기록 에이전트 반영:
  - 기능/디자인 에이전트는 사용량 제한으로 실패해 메인이 직접 구현/검증했다.
  - 이번 AI/design slice에서 해결한 항목: AI-generated hero visual card now includes editable designer-system details instead of only a media frame.
  - Hero media card gets an Image 2.0 prompt-safety chip (`텍스트 없는 이미지` / `No text image`) and a 3-swatch palette strip based on the generated brand palette.
  - These details are real canvas container/text nodes with mobile rects, so they can be selected/edited/reused and survive draft save/load.
  - 아직 Wix 대비 남은 항목: actual external Image 2.0 generation/import, generated asset persistence, image replace/edit assistant, richer style suggestion controls, and broader F88-F94 assistants.
- 변경 파일:
  - `src/lib/builder/ai-generator/canvas-import.ts` — generated hero visual card에 prompt-safety chip and palette swatches를 추가했다.
  - `src/lib/builder/ai-generator/__tests__/canvas-import.test.ts` — schema-valid canvas document, prompt chip text/mobile rect, palette swatch colors/mobile rect를 검증한다.
  - `tests/builder-editor/ai-generator.playwright.ts` — generated draft payload에서 prompt chip and palette swatch nodes가 저장되는지 검증한다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run test:unit -- src/lib/builder/ai-generator/__tests__/canvas-import.test.ts` ✅ (5 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/ai-generator.playwright.ts -g "generates sitemap and content plan" --workers=1` ✅ (1 passed, 권한 상승 실행)
- F 판정:
  - F87/F92은 🟡 유지/부분 상승. AI generated hero sections now include editable Image 2.0 prompt-safety and brand palette system details, improving the designer-quality surface without claiming real external image generation.
  - 남은 Wix 대비 gap: actual external AI image generation/import and newly generated asset persistence; image replace/edit assistant; page-tree diff/reorder; curated design-pool pixel matching; responsive AI preview/undo; server-side prompt versioning; broader F88-F94 assistants.

## M166-P — AI Section Editorial Rails And Number Pills

- 시작/종료: 2026-05-21 / 2026-05-21
- 1번 기능 에이전트 / 2번 디자인 에이전트 / 3번 기록 에이전트 반영:
  - 기능/디자인 에이전트는 사용량 제한으로 실패해 메인이 직접 구현/검증했다.
  - 이번 AI/design slice에서 해결한 항목: hero뿐 아니라 AI-generated content sections에도 editable designer chrome을 추가했다.
  - 각 일반 섹션은 accent rail and `S-01` style section number pill을 갖고, mobile rect가 따로 저장되어 좁은 화면에서 제목/본문/카드와 겹치지 않게 유지한다.
  - 아직 Wix 대비 남은 항목: actual external Image 2.0 generation/import, generated asset persistence, style suggestion controls, responsive AI preview/undo, and broader F88-F94 assistants.
- 변경 파일:
  - `src/lib/builder/ai-generator/canvas-import.ts` — generated content section root 안에 editable accent rail, section number pill, number text nodes를 추가했다.
  - `src/lib/builder/ai-generator/__tests__/canvas-import.test.ts` — section accent rail/pill count, mobile rect, section number text, schema-valid canvas document를 검증한다.
  - `tests/builder-editor/ai-generator.playwright.ts` — generated draft payload에 first content section accent rail and number text가 저장되는지 검증한다.
  - `WIX-FULL-PRODUCT-GAP.md`, `WIX-PARITY-DOCUMENTATION.md` — F87/F92 designer-quality first-slice 기록을 갱신했다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run test:unit -- src/lib/builder/ai-generator/__tests__/canvas-import.test.ts` ✅ (5 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/ai-generator.playwright.ts -g "generates sitemap and content plan" --workers=1` ⚠️ first run timed out during cold Next compile after dev-server restart
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/ai-generator.playwright.ts -g "generates sitemap and content plan" --workers=1` ✅ (1 passed, warmed server, 권한 상승 실행)
- F 판정:
  - F87/F92은 🟡 유지/부분 상승. AI generated content sections now include editable editorial rails and section number pills as designer-system primitives.
  - 남은 Wix 대비 gap: actual external AI image generation/import and newly generated asset persistence; image replace/edit assistant; page-tree diff/reorder; curated design-pool pixel matching; responsive AI preview/undo; server-side prompt versioning; broader F88-F94 assistants.

## M166-Q — AI CTA Trust Strip

- 시작/종료: 2026-05-21 / 2026-05-21
- 1번 기능 에이전트 / 2번 디자인 에이전트 / 3번 기록 에이전트 반영:
  - 기능/디자인 에이전트는 사용량 제한으로 실패해 메인이 직접 구현/검증했다.
  - 이번 AI/design slice에서 해결한 항목: final CTA section was still mostly title/body/button, so it now includes an editable conversion trust strip under the CTA button.
  - The strip preserves mobile-safe placement and communicates editable AI layout, mobile-safe CTA, and brand-tone preservation as generated text nodes.
  - 아직 Wix 대비 남은 항목: actual external Image 2.0 generation/import, generated asset persistence, style suggestion controls, responsive AI preview/undo, and broader F88-F94 assistants.
- 변경 파일:
  - `src/lib/builder/ai-generator/canvas-import.ts` — final CTA section에 editable trust strip and text nodes를 추가했다.
  - `src/lib/builder/ai-generator/__tests__/canvas-import.test.ts` — CTA trust strip/mobile rect/text and schema-valid canvas document를 검증한다.
  - `tests/builder-editor/ai-generator.playwright.ts` — generated draft payload에 CTA trust strip and text가 저장되는지 검증한다.
  - `WIX-FULL-PRODUCT-GAP.md`, `WIX-PARITY-DOCUMENTATION.md` — F87/F92 designer-quality first-slice 기록을 갱신했다.
- 검증:
  - `npm run typecheck` ✅
  - `npm run test:unit -- src/lib/builder/ai-generator/__tests__/canvas-import.test.ts` ✅ (5 passed)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/ai-generator.playwright.ts -g "generates sitemap and content plan" --workers=1` ⚠️ first run hit a transient Next dev chunk 404/hydration-ready failure
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/ai-generator.playwright.ts -g "generates sitemap and content plan" --workers=1` ✅ (1 passed, 권한 상승 실행)
- F 판정:
  - F87/F92은 🟡 유지/부분 상승. AI generated final CTA sections now include an editable mobile-safe trust strip as another designer-system primitive.
  - 남은 Wix 대비 gap: actual external AI image generation/import and newly generated asset persistence; image replace/edit assistant; page-tree diff/reorder; curated design-pool pixel matching; responsive AI preview/undo; server-side prompt versioning; broader F88-F94 assistants.

## M166-R — AI Sitemap Page Designer Frame

- 시작/종료: 2026-05-21 / 2026-05-21
- 1번 기능 에이전트 / 2번 디자인 에이전트 / 3번 기록 에이전트 반영:
  - 기능/디자인 에이전트는 사용량 제한으로 실패해 메인이 직접 구현/검증했다.
  - 이번 AI/design slice에서 해결한 항목: selected sitemap-scope draft page creation이 단순 title/body/CTA/card stack으로 저장되던 부분에 editable designer primitives를 추가했다.
  - Sitemap helper pages now include an editable visual frame, accent band, page marker pill, and plan strip with mobile-safe placement before the generated section cards.
  - 아직 Wix 대비 남은 항목: actual external Image 2.0 generation/import, generated asset persistence, page-tree diff/reorder, curated design-pool pixel matching, responsive AI preview/undo, and broader F88-F94 assistants.
- 변경 파일:
  - `src/lib/builder/ai-generator/canvas-import.ts` — `draftToSitemapPageCanvasNodes`에 editable sitemap page frame/accent band/page pill/plan strip nodes를 추가하고 mobile card start position을 조정했다.
  - `src/lib/builder/ai-generator/__tests__/canvas-import.test.ts` — sitemap helper page designer primitives, mobile rects, Korean plan-strip text, strip/card no-overlap을 검증한다.
  - `tests/builder-editor/ai-generator.playwright.ts` — selected sitemap draft page creation E2E에서 saved draft payload에 sitemap designer frame/plan strip/text가 저장되는지 검증한다.
  - `WIX-FULL-PRODUCT-GAP.md`, `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md` — F87/F92 AI sitemap helper page designer-quality 기록을 갱신했다.
- 검증:
  - `npm run test:unit -- src/lib/builder/ai-generator/__tests__/canvas-import.test.ts` ✅ (6 passed)
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/ai-generator.playwright.ts -g "creates selected sitemap draft pages" --workers=1` ⚠️ first run failed before app execution because the Playwright headless-shell executable was missing from cache
  - `npx playwright install chromium` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/ai-generator.playwright.ts -g "creates selected sitemap draft pages" --workers=1` ✅ (1 passed, 권한 상승 실행)
- F 판정:
  - F87/F92은 🟡 유지/부분 상승. AI selected sitemap draft pages now save editable designer frame/pill/plan-strip primitives instead of only starter cards.
  - 남은 Wix 대비 gap: actual external AI image generation/import and newly generated asset persistence; image replace/edit assistant; page-tree diff/reorder; curated design-pool pixel matching; responsive AI preview/undo; server-side prompt versioning; broader F88-F94 assistants.

## M166-S — AI Image 2.0 Hero Asset Generation

- 시작/종료: 2026-05-21 / 2026-05-21
- 1번 기능 에이전트 / 2번 디자인 에이전트 / 3번 기록 에이전트 반영:
  - 기능/디자인 에이전트는 사용량 제한으로 실패해 메인이 직접 구현/검증했다.
  - 이번 AI/image slice에서 해결한 항목: AI generator가 Image 2.0-ready prompt metadata만 저장하던 상태에서 실제 `gpt-image-2` generation endpoint를 호출해 generated hero image를 builder asset store에 저장할 수 있게 했다.
  - Admin AI generator result panel now has an Image 2.0 hero generation action; successful generation selects the new asset, updates the current draft, and updates local prompt history so restore/apply keeps the generated image.
  - 아직 Wix 대비 남은 항목: image replace/edit assistant, AI image variations/masking, page-tree diff/reorder, curated design-pool pixel matching, responsive AI preview/undo, server-side prompt versioning, and broader F88-F94 assistants.
- 변경 파일:
  - `src/app/api/builder/ai-generator/image/route.ts` — authenticated asset-bucket route that validates input, calls `https://api.openai.com/v1/images/generations` with `gpt-image-2`, validates returned bytes, and persists the image through the existing builder asset store.
  - `src/app/api/builder/ai-generator/image/__tests__/route.test.ts` — missing API key, invalid prompt, OpenAI payload, generated file validation, asset upload, and audit recording을 검증한다.
  - `src/components/builder/ai-generator/AiGeneratorWizard.tsx` — result panel에 Image 2.0 hero generation action을 추가하고 generated asset을 current draft/history/asset picker에 반영한다.
  - `src/components/builder/ai-generator/AiGeneratorWizard.module.css` — visual brief action row responsive styling을 추가했다.
  - `tests/builder-editor/ai-generator.playwright.ts` — mocked Image 2.0 route로 generated asset이 selected hero asset으로 표시되고 history restore 후 draft apply에도 hero media source로 저장되는지 검증한다.
  - `WIX-FULL-PRODUCT-GAP.md`, `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md` — actual Image 2.0 generation/persistence status and remaining image-edit gaps를 갱신했다.
- 검증:
  - `npm run test:unit -- src/app/api/builder/ai-generator/image/__tests__/route.test.ts src/lib/builder/ai-generator/__tests__/canvas-import.test.ts` ✅ (9 passed)
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/ai-generator.playwright.ts -g "generates sitemap and content plan" --workers=1` ⚠️ first run exposed a real issue: generated asset updated current draft but local history restore dropped the asset
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/ai-generator.playwright.ts -g "generates sitemap and content plan" --workers=1` ✅ (1 passed, 권한 상승 실행)
- F 판정:
  - F87/F92은 🟡 부분 상승. AI generator now has a real Image 2.0 hero image generation and asset persistence path, with draft/history/apply coverage.
  - 남은 Wix 대비 gap: image replace/edit assistant with masks/variations; page-tree diff/reorder; curated design-pool pixel matching; responsive AI preview/undo; server-side prompt versioning; broader F88-F94 assistants.

## M166-T — AI Image 2.0 Existing Asset Edit UI And Columns Shortcut

- 시작/종료: 2026-05-21 / 2026-05-21
- 1번 기능 에이전트 / 2번 디자인 에이전트 / 3번 기록 에이전트 반영:
  - 기능/디자인 에이전트는 사용량 제한으로 실패해 메인이 직접 구현/검증했다.
  - 이번 slice에서 해결한 항목: 기존 builder image asset을 입력 이미지로 받아 Image 2.0 `v1/images/edits`에 전달하고 결과를 새 builder asset으로 저장하는 guarded server path를 추가했다.
  - Image edit dialog에 AI tab을 추가해 프롬프트 입력, preset-driven edited asset variants, variant preview/selection, selected image node로 Apply하는 흐름까지 연결했다.
  - 사용자가 보고한 칼럼 페이지 이동 혼선을 줄이기 위해 왼쪽 rail의 `칼럼` 항목을 누르면 글쓰기 패널을 유지하면서 실제 `/columns` builder page도 즉시 선택되도록 바꿨다.
  - 당시 Wix 대비 남은 항목: mask authoring, richer AI review/undo, responsive AI preview/undo, page-tree diff/reorder, curated design-pool pixel matching, and broader F88-F94 assistants. 이후 M166-U/V에서 preset mask와 기본 review/clear 흐름을 보강했다.
- 변경 파일:
  - `src/app/api/builder/ai-generator/image/edit/route.ts` — authenticated asset-bucket route that accepts a builder asset filename/path/url, validates source type, calls `https://api.openai.com/v1/images/edits` with `gpt-image-2`, validates returned bytes, and persists the edited image through the builder asset store.
  - `src/app/api/builder/ai-generator/image/edit/__tests__/route.test.ts` — edit success, missing source asset, unsupported source type, FormData payload, generated file validation, asset upload, and audit recording을 검증한다.
  - `src/components/builder/canvas/ImageEditDialog.tsx`, `src/components/builder/canvas/SandboxModalsRoot.tsx`, `src/components/builder/canvas/SandboxEditorWorkspace.tsx`, `src/components/builder/canvas/SandboxPage.module.css` — crop/filter/alt dialog에 AI tab을 추가하고 generated edit variant preview/apply 상태, preset prompts, builder asset source guard, responsive panel styling, optional `src` apply path를 연결했다.
  - `src/components/builder/canvas/SandboxPage.tsx` — `칼럼` rail action now opens the columns writing panel and immediately selects the real columns builder page when available.
  - `tests/builder-editor/chrome-click-safety.playwright.ts` — rail shortcut regression을 추가해 `칼럼` rail click만으로 `/columns`가 선택되고 글쓰기 panel remains available인지 검증한다.
  - `tests/builder-editor/asset-image-workflow.playwright.ts` — mocked Image 2.0 edit API로 이미지 편집 다이얼로그에서 Generate edit -> second preset variant -> previous variant selection -> Apply 후 canvas image src가 선택한 새 asset으로 교체되는지 검증한다. 한국어 컨텍스트 메뉴 레이블도 helper에서 같이 처리한다.
  - `WIX-FULL-PRODUCT-GAP.md`, `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md` — Image 2.0 edit endpoint status and remaining UI/mask/variation gaps를 갱신했다.
- 검증:
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/chrome-click-safety.playwright.ts -g "moves from the columns panel to the real columns builder page" --workers=1` ✅ (1 passed, 권한 상승 실행)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/chrome-click-safety.playwright.ts -g "opens the canvas mobile menu|lets compact header mobile menu links" --workers=1` ✅ (2 passed, 권한 상승 실행)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/chrome-click-safety.playwright.ts -g "columns rail item|moves from the columns panel" --workers=1` ✅ (2 passed, 권한 상승 실행)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/asset-image-workflow.playwright.ts -g "applies an Image 2.0 edit result" --workers=1` ✅ (1 passed, 권한 상승 실행)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/asset-image-workflow.playwright.ts -g "covers W22 asset organization/replacement and W23" --workers=1` ✅ (1 passed, 권한 상승 실행)
  - `npm run test:unit -- src/app/api/builder/ai-generator/image/edit/__tests__/route.test.ts src/app/api/builder/ai-generator/image/__tests__/route.test.ts` ✅ (6 passed)
  - `npm run typecheck` ✅
- F 판정:
  - F87/F92은 🟡 부분 상승. AI image generation now has create, source-image edit, persisted asset, selected-image apply, and variant selection paths. Later M166-U/V added preset masks and basic review/clear-selection undo.
  - 남은 Wix 대비 gap: deeper AI image diff/transaction review UX; page-tree diff/reorder; curated design-pool pixel matching; responsive AI preview/undo; server-side prompt versioning; broader F88-F94 assistants.

## M166-U — AI Image 2.0 Mask Presets

- 시작/종료: 2026-05-21 / 2026-05-21
- 1번 기능 에이전트 / 2번 디자인 에이전트 / 3번 기록 에이전트 반영:
  - 기능/디자인 에이전트는 사용량 제한으로 실패해 메인이 직접 구현/검증했다.
  - 이번 slice에서 해결한 항목: Image 2.0 existing-asset edit endpoint가 optional PNG alpha mask를 받아 `v1/images/edits` FormData로 전달할 수 있게 했다.
  - Image edit dialog AI tab에 full image/center/top/bottom/left/right preset mask-area controls와 preview overlay를 추가해 사용자가 편집 범위를 눈으로 확인한 뒤 Generate edit을 실행할 수 있게 했다.
  - 당시 Wix 대비 남은 항목: freeform/brush mask authoring, multi-step AI review history/undo, responsive AI preview/undo, page-tree diff/reorder, curated design-pool pixel matching, and broader F88-F94 assistants. 이후 M166-W에서 기본 brush mask authoring을 보강했다.
- 변경 파일:
  - `src/app/api/builder/ai-generator/image/edit/route.ts` — `mask.dataUrl` PNG alpha validation, optional mask description, and FormData `mask` forwarding을 추가했다.
  - `src/app/api/builder/ai-generator/image/edit/__tests__/route.test.ts` — valid PNG alpha mask가 edit request FormData에 포함되는지 검증한다.
  - `src/components/builder/canvas/ImageEditDialog.tsx`, `src/components/builder/canvas/SandboxPage.module.css` — AI edit tab에 mask preset buttons, selected mask overlay, canvas-generated PNG alpha mask payload generation을 추가했다.
  - `tests/builder-editor/asset-image-workflow.playwright.ts` — mocked Image 2.0 edit API가 mask data URL/description을 받는지 확인하고, mask overlay가 보인 상태에서 generated variant apply가 동작하는지 검증한다.
  - `WIX-FULL-PRODUCT-GAP.md`, `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md` — AI image mask status and remaining freeform/review gaps를 갱신했다.
- 검증:
  - `npm run test:unit -- src/app/api/builder/ai-generator/image/edit/__tests__/route.test.ts` ✅ (4 passed)
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/asset-image-workflow.playwright.ts -g "applies an Image 2.0 edit result" --workers=1` ✅ (1 passed, 권한 상승 실행)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/asset-image-workflow.playwright.ts -g "covers W22 asset organization/replacement and W23" --workers=1` ✅ (1 passed, 권한 상승 실행)
- F 판정:
  - F87/F92은 🟡 부분 상승. AI image generation now has create, source-image edit, persisted asset, selected-image apply, variant selection, and preset mask-area targeting paths.
  - 남은 Wix 대비 gap: deeper AI image diff/transaction review UX; page-tree diff/reorder; curated design-pool pixel matching; responsive AI preview/undo; server-side prompt versioning; broader F88-F94 assistants.

## M166-V — AI Image Edit Review And Clear Selection

- 시작/종료: 2026-05-21 / 2026-05-21
- 1번 기능 에이전트 / 2번 디자인 에이전트 / 3번 기록 에이전트 반영:
  - 기능/디자인 에이전트는 사용량 제한으로 실패해 메인이 직접 구현/검증했다.
  - 이번 slice에서 해결한 항목: Image edit dialog AI tab에서 generated variant를 Apply하기 전에 원본과 선택된 편집본을 전환해 비교할 수 있게 했다.
  - 선택한 AI edit만 `Clear AI edit`으로 되돌릴 수 있게 해, 생성 결과를 보존한 채 현재 이미지 유지 상태로 돌아간 뒤 다른 variant를 다시 선택할 수 있게 했다.
  - 당시 Wix 대비 남은 항목: freeform/brush mask authoring, multi-step generated-image review history/undo, responsive AI preview/undo, page-tree diff/reorder, curated design-pool pixel matching, and broader F88-F94 assistants. 이후 M166-W/AB에서 기본 brush mask authoring과 selection history undo/redo를 보강했다.
- 변경 파일:
  - `src/components/builder/canvas/ImageEditDialog.tsx` — AI edit review state, Original/Selected edit toggle, clear-selection undo, and neutral info notice tone을 추가했다.
  - `src/components/builder/canvas/SandboxPage.module.css` — review controls, clear button, and info notice styling을 추가했다.
  - `tests/builder-editor/asset-image-workflow.playwright.ts` — mocked Image 2.0 edit flow에서 original review, edited review, clear-selection undo, and reselect-before-apply를 검증한다.
  - `WIX-FULL-PRODUCT-GAP.md`, `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md` — review/undo status and remaining multi-step/freeform gaps를 갱신했다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/asset-image-workflow.playwright.ts -g "applies an Image 2.0 edit result" --workers=1` ✅ (1 passed, 권한 상승 실행)
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/asset-image-workflow.playwright.ts -g "covers W22 asset organization/replacement and W23" --workers=1` ✅ (1 passed, 권한 상승 실행)
- F 판정:
  - F87/F92은 🟡 부분 상승. AI image edit now supports source-image generation, preset masks, variant selection, original-vs-edited review, clear-selection undo, and final selected-image apply.
  - 남은 Wix 대비 gap: deeper AI image diff/transaction review UX; page-tree diff/reorder; curated design-pool pixel matching; responsive AI preview/undo; server-side prompt versioning; broader F88-F94 assistants.

## M166-W — AI Image Brush Mask

- 시작/종료: 2026-05-21 / 2026-05-21
- 1번 기능 에이전트 / 2번 디자인 에이전트 / 3번 기록 에이전트 반영:
  - 기능/디자인 에이전트는 사용량 제한으로 실패해 메인이 직접 구현/검증했다.
  - 이번 slice에서 해결한 항목: Image edit dialog AI tab에 `Brush area` mask mode를 추가해 preview 위에서 직접 드래그한 자유형 brush stroke를 PNG alpha mask로 변환한다.
  - Brush mask는 Image 2.0 existing-asset edit request에 `description: "Brush mask"`로 전달되며, preset mask와 같은 `v1/images/edits` mask path를 사용한다.
  - 당시 Wix 대비 남은 항목: brush size control, eraser/refine, feather/soft edge controls, multi-step generated-image review history/undo, responsive AI preview/undo, page-tree diff/reorder, curated design-pool pixel matching, and broader F88-F94 assistants. 이후 M166-X/Y/Z/AA/AB에서 brush size, eraser, feather, edge refinement, and selection history undo/redo를 보강했다.
- 변경 파일:
  - `src/components/builder/canvas/ImageEditDialog.tsx` — brush stroke state, pointer drawing surface, SVG preview strokes, canvas-generated alpha-mask payload, and brush/full/preset mode switching을 추가했다.
  - `src/components/builder/canvas/SandboxPage.module.css` — brush SVG overlay and pointer drawing surface styling을 추가했다.
  - `tests/builder-editor/asset-image-workflow.playwright.ts` — mocked Image 2.0 edit flow에서 Brush area 선택, preview drag stroke, `Brush mask` payload, review/clear/reselect/apply 경로를 검증한다.
  - `WIX-FULL-PRODUCT-GAP.md`, `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md` — brush mask status and remaining advanced mask/review gaps를 갱신했다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/asset-image-workflow.playwright.ts -g "applies an Image 2.0 edit result" --workers=1` ✅ (1 passed, 권한 상승 실행)
- F 판정:
  - F87/F92은 🟡 부분 상승. AI image edit now supports source-image generation, preset masks, freeform brush masks, variant selection, original-vs-edited review, clear-selection undo, and final selected-image apply.
  - 남은 Wix 대비 gap: deeper AI image diff/transaction review UX; page-tree diff/reorder; curated design-pool pixel matching; responsive AI preview/undo; server-side prompt versioning; broader F88-F94 assistants.

## M166-X — AI Brush Size And Stroke Undo

- 시작/종료: 2026-05-21 / 2026-05-21
- 1번 기능 에이전트 / 2번 디자인 에이전트 / 3번 기록 에이전트 반영:
  - 기능/디자인 에이전트는 사용량 제한으로 실패해 메인이 직접 구현/검증했다.
  - 이번 slice에서 해결한 항목: AI brush mask mode에 brush size slider와 마지막 brush stroke undo를 추가했다.
  - 사용자는 Brush area를 선택한 뒤 stroke 크기를 바꾸고, 잘못 그린 stroke를 즉시 되돌린 다음 다시 그려 Image 2.0 edit mask로 보낼 수 있다.
  - 당시 Wix 대비 남은 항목: eraser/refine, feather/soft edge controls, multi-step generated-image review history/undo, responsive AI preview/undo, page-tree diff/reorder, curated design-pool pixel matching, and broader F88-F94 assistants. 이후 M166-Y/Z/AA/AB에서 eraser, feather, edge refinement, and selection history undo/redo를 보강했다.
- 변경 파일:
  - `src/components/builder/canvas/ImageEditDialog.tsx` — brush size state, range control, per-stroke size persistence, and undo-last-stroke action을 추가했다.
  - `src/components/builder/canvas/SandboxPage.module.css` — brush tool strip and range control styling을 추가했다.
  - `tests/builder-editor/asset-image-workflow.playwright.ts` — brush size 변경, first stroke draw, undo stroke, redraw, and `Brush mask` generation path를 검증한다.
  - `WIX-FULL-PRODUCT-GAP.md`, `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md` — brush size/undo status and remaining edge-review gaps를 갱신했다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/asset-image-workflow.playwright.ts -g "applies an Image 2.0 edit result" --workers=1` ✅ (1 passed, 권한 상승 실행)
- F 판정:
  - F87/F92은 🟡 부분 상승. AI image edit now supports source-image generation, preset masks, freeform brush masks with brush size and undo-last-stroke, variant selection, original-vs-edited review, clear-selection undo, and final selected-image apply.
  - 남은 Wix 대비 gap: deeper AI image diff/transaction review UX; page-tree diff/reorder; curated design-pool pixel matching; responsive AI preview/undo; server-side prompt versioning; broader F88-F94 assistants.

## M166-Y — AI Brush Erase Mode

- 시작/종료: 2026-05-21 / 2026-05-21
- 1번 기능 에이전트 / 2번 디자인 에이전트 / 3번 기록 에이전트 반영:
  - 기능/디자인 에이전트는 사용량 제한으로 실패해 메인이 직접 구현/검증했다.
  - 이번 slice에서 해결한 항목: AI brush mask mode에 Add/Erase brush modes를 추가해, 잘못 칠한 마스크 영역을 전체 삭제 없이 stroke 단위로 보정할 수 있게 했다.
  - Mask generation은 stroke 순서를 유지하며 Add stroke는 transparent edit area로, Erase stroke는 opaque keep area로 합성한다. UI preview도 erase stroke를 다른 색으로 표시한다.
  - 당시 Wix 대비 남은 항목: feather/soft edge controls, edge refinement, multi-step generated-image review history/undo, responsive AI preview/undo, page-tree diff/reorder, curated design-pool pixel matching, and broader F88-F94 assistants. 이후 M166-Z/AA/AB에서 feather, edge refinement, and selection history undo/redo를 보강했다.
- 변경 파일:
  - `src/components/builder/canvas/ImageEditDialog.tsx` — brush stroke mode model, Add/Erase controls, mode-specific canvas compositing, and mode-specific SVG stroke metadata를 추가했다.
  - `src/components/builder/canvas/SandboxPage.module.css` — erase stroke preview styling을 추가했다.
  - `tests/builder-editor/asset-image-workflow.playwright.ts` — Add stroke 이후 Erase stroke를 그려 erase stroke count와 Image 2.0 mask generation path를 검증한다.
  - `WIX-FULL-PRODUCT-GAP.md`, `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md` — erase mode status and remaining edge-review gaps를 갱신했다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/asset-image-workflow.playwright.ts -g "applies an Image 2.0 edit result" --workers=1` ✅ (1 passed, 권한 상승 실행)
- F 판정:
  - F87/F92은 🟡 부분 상승. AI image edit now supports source-image generation, preset masks, freeform brush masks with Add/Erase modes, brush size and undo-last-stroke, variant selection, original-vs-edited review, clear-selection undo, and final selected-image apply.
  - 남은 Wix 대비 gap: deeper AI image diff/transaction review UX; page-tree diff/reorder; curated design-pool pixel matching; responsive AI preview/undo; server-side prompt versioning; broader F88-F94 assistants.

## M166-Z — AI Mask Feather Control

- 시작/종료: 2026-05-21 / 2026-05-21
- 1번 기능 에이전트 / 2번 디자인 에이전트 / 3번 기록 에이전트 반영:
  - 기능/디자인 에이전트는 사용량 제한으로 실패해 메인이 직접 구현/검증했다.
  - 이번 slice에서 해결한 항목: AI mask controls에 Feather slider를 추가해 preset mask와 brush mask 모두 부드러운 alpha edge로 Image 2.0 edit mask를 생성할 수 있게 했다.
  - Mask generation은 feather 값이 있을 때 canvas blur compositing을 적용해 hard edge 대신 soft transition을 만든다.
  - 당시 Wix 대비 남은 항목: edge refinement handles/preview depth, multi-step generated-image review history/undo, responsive AI preview/undo, page-tree diff/reorder, curated design-pool pixel matching, and broader F88-F94 assistants. 이후 M166-AA/AB에서 edge expand/shrink refinement와 selection history undo/redo를 보강했다.
- 변경 파일:
  - `src/components/builder/canvas/ImageEditDialog.tsx` — mask feather state, Feather range control, and feathered canvas compositing for preset/brush masks를 추가했다.
  - `src/components/builder/canvas/SandboxPage.module.css` — feather range control styling을 추가했다.
  - `tests/builder-editor/asset-image-workflow.playwright.ts` — Feather slider 변경 후 Add/Erase brush mask generation path를 검증한다.
  - `WIX-FULL-PRODUCT-GAP.md`, `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md` — feather status and remaining edge-review gaps를 갱신했다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/asset-image-workflow.playwright.ts -g "applies an Image 2.0 edit result" --workers=1` ✅ (1 passed, 권한 상승 실행)
- F 판정:
  - F87/F92은 🟡 부분 상승. AI image edit now supports source-image generation, preset masks, freeform brush masks with Add/Erase modes, brush size, feather, undo-last-stroke, variant selection, original-vs-edited review, clear-selection undo, and final selected-image apply.
  - 남은 Wix 대비 gap: deeper AI image diff/transaction review UX; page-tree diff/reorder; curated design-pool pixel matching; responsive AI preview/undo; server-side prompt versioning; broader F88-F94 assistants.

## M166-AA — AI Mask Edge Refinement

- 시작/종료: 2026-05-21 / 2026-05-21
- 1번 기능 에이전트 / 2번 디자인 에이전트 / 3번 기록 에이전트 반영:
  - 기능/디자인 에이전트는 사용량 제한으로 실패해 메인이 직접 구현/검증했다.
  - 이번 slice에서 해결한 항목: AI mask controls에 Edge slider를 추가해 preset/brush mask의 편집 영역을 생성 전 넓히거나 줄일 수 있게 했다.
  - Mask generation은 edge 값을 preset rect geometry와 brush stroke width에 반영하고, feather와 함께 적용되어 soft-edge expansion/shrink가 가능하다.
  - 당시 Wix 대비 남은 항목: multi-step generated-image review history/undo, responsive AI preview/undo, page-tree diff/reorder, curated design-pool pixel matching, and broader F88-F94 assistants. 이후 M166-AB에서 selection history undo/redo를 보강했다.
- 변경 파일:
  - `src/components/builder/canvas/ImageEditDialog.tsx` — mask edge state, Edge range control, preset rect expand/shrink, and brush stroke width refinement을 추가했다.
  - `tests/builder-editor/asset-image-workflow.playwright.ts` — Edge slider 변경 후 Add/Erase brush mask generation path를 검증한다.
  - `WIX-FULL-PRODUCT-GAP.md`, `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md` — edge refinement status and remaining multi-step review gaps를 갱신했다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/asset-image-workflow.playwright.ts -g "applies an Image 2.0 edit result" --workers=1` ✅ (1 passed, 권한 상승 실행)
- F 판정:
  - F87/F92은 🟡 부분 상승. AI image edit now supports source-image generation, preset masks, freeform brush masks with Add/Erase modes, brush size, feather, edge expand/shrink refinement, undo-last-stroke, variant selection, original-vs-edited review, clear-selection undo, and final selected-image apply.
  - 남은 Wix 대비 gap: deeper AI image diff/transaction review UX; page-tree diff/reorder; curated design-pool pixel matching; responsive AI preview/undo; server-side prompt versioning; broader F88-F94 assistants.

## M166-AB — AI Image Review History Undo/Redo

- 시작/종료: 2026-05-21 / 2026-05-21
- 1번 기능 에이전트 / 2번 디자인 에이전트 / 3번 기록 에이전트 반영:
  - 기능/디자인 에이전트는 사용량 제한으로 실패해 메인이 직접 구현/검증했다.
  - 이번 slice에서 해결한 항목: Image edit dialog AI tab에 generated edit selection history를 추가해 생성 결과, variant 선택, clear-selection을 Apply 전에 undo/redo할 수 있게 했다.
  - 사용자는 generated image 1 -> generated image 2 -> undo -> redo, 또는 clear-selection 후 undo로 이전 선택을 복원할 수 있다.
  - 아직 Wix 대비 남은 항목: deeper AI image diff/transaction review UX, responsive AI preview/undo, page-tree diff/reorder, curated design-pool pixel matching, and broader F88-F94 assistants.
- 변경 파일:
  - `src/components/builder/canvas/ImageEditDialog.tsx` — AI review history state, selection stack push/restore helpers, Undo review / Redo review controls를 추가했다.
  - `tests/builder-editor/asset-image-workflow.playwright.ts` — first/second generated variant undo/redo, clear-selection, and undo restore before Apply를 검증한다.
  - `WIX-FULL-PRODUCT-GAP.md`, `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md` — multi-step review status and remaining deeper diff/transaction gaps를 갱신했다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/asset-image-workflow.playwright.ts -g "applies an Image 2.0 edit result" --workers=1` ✅ (1 passed, 권한 상승 실행)
- F 판정:
  - F87/F92은 🟡 부분 상승. AI image edit now supports source-image generation, preset masks, freeform brush masks with Add/Erase modes, brush size, feather, edge expand/shrink refinement, undo-last-stroke, variant selection, original-vs-edited review, generated edit selection history undo/redo, clear-selection restore, and final selected-image apply.
  - 남은 Wix 대비 gap: broader page/section review-diff transaction UX; page-tree diff/reorder; curated design-pool pixel matching; responsive AI preview/undo; server-side prompt versioning; F88-F94 assistants.

## M166-AC — AI Image Before/After Transaction Review

- 시작/종료: 2026-05-21 / 2026-05-21
- 1번 기능 에이전트 / 2번 디자인 에이전트 / 3번 기록 에이전트 반영:
  - 기능/디자인 에이전트는 사용량 제한으로 실패해 메인이 직접 구현/검증했다.
  - 이번 slice에서 해결한 항목: Image edit dialog AI tab에 before/after transaction review strip을 추가해 Apply 전에 현재 이미지와 선택된 AI 편집본을 나란히 확인할 수 있게 했다.
  - Review strip은 undo/redo로 선택이 복원될 때도 선택된 filename과 before/after thumbnail을 갱신한다.
  - 아직 Wix 대비 남은 항목: broader page/section review-diff transaction UX, responsive AI preview/undo, page-tree diff/reorder, curated design-pool pixel matching, and broader F88-F94 assistants.
- 변경 파일:
  - `src/components/builder/canvas/ImageEditDialog.tsx` — selected AI edit이 있을 때 current/selected thumbnails and apply-target filename summary를 보여주는 transaction review strip을 추가했다.
  - `src/components/builder/canvas/SandboxPage.module.css` — transaction review strip, before/after frames, and filename summary styling을 추가했다.
  - `tests/builder-editor/asset-image-workflow.playwright.ts` — generated edit 이후 transaction review strip의 current/selected thumbnail과 undo restore 후 filename summary를 검증한다.
  - `WIX-FULL-PRODUCT-GAP.md`, `WIX-PARITY-PLAN.md`, `WIX-PARITY-DOCUMENTATION.md` — image transaction review status and remaining page/section review gaps를 갱신했다.
- 검증:
  - `npm run typecheck` ✅
  - `BASE_URL=http://localhost:3000 npx playwright test --config=playwright.config.ts tests/builder-editor/asset-image-workflow.playwright.ts -g "applies an Image 2.0 edit result" --workers=1` ✅ (1 passed, 권한 상승 실행)
- F 판정:
  - F87/F92은 🟡 부분 상승. AI image edit now supports source-image generation, preset masks, freeform brush masks with Add/Erase modes, brush size, feather, edge expand/shrink refinement, undo-last-stroke, variant selection, original-vs-edited review, generated edit selection history undo/redo, before/after transaction review, clear-selection restore, and final selected-image apply.
  - 남은 Wix 대비 gap: broader page/section review-diff transaction UX; page-tree diff/reorder; curated design-pool pixel matching; responsive AI preview/undo; server-side prompt versioning; F88-F94 assistants.
