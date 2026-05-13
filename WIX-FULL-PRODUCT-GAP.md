# WIX-FULL-PRODUCT-GAP.md

Created: 2026-05-13

This file corrects the project scope from "W01-W225 editor parity" to "full Wix product parity." The previous W01-W225 plan remains valuable, but it covers only the visual editor, widget packs, forms, bookings subset, SEO/publish, and editor hardening. It is not enough to honestly claim full Wix.

## Source Baseline

Official Wix/Wix Studio surfaces checked on 2026-05-13:

- Wix Studio features: https://www.wix.com/studio/features
- Wix Studio editor overview: https://support.wix.com/en/article/wix-studio-about-the-studio-editor
- Wix Studio CMS: https://support.wix.com/en/article/wix-studio-using-the-cms
- Wix App Market: https://support.wix.com/en/article/about-the-wix-app-market
- Wix Stores: https://support.wix.com/en/article/wix-stores-an-overview-of-store-features
- Wix Bookings: https://support.wix.com/en/article/wix-bookings-about-wix-bookings
- Wix Multilingual: https://support.wix.com/en/article/wix-multilingual-an-overview
- Wix Studio developer platform: https://www.wix.com/studio/for-web-developers

## Corrected Completion Model

The active target is now two-layered:

1. **Wix Editor parity layer**: W01-W225, currently heavily implemented and refactoring/verification continuing.
2. **Full Wix product layer**: F01-F120, covering Wix Studio/CMS/App Market/Stores/AI/collaboration/developer/enterprise surfaces that W01-W225 did not include.

Full goal completion must not be declared until both are true:

- W01-W225: 203+ items green or explicitly waived by user.
- F01-F120: 96+ items green or explicitly waived by user.

Tracking file: `WIX-FULL-PRODUCT-CHECKPOINTS.md`.

## Full Wix Product Gap Map

| Area | F range | Wix surface | Current status | Required outcome |
| --- | --- | --- | --- | --- |
| Product benchmark | F01-F06 | Full Wix scope scoring | Seeded | Versioned scoring rubric, source links, recurring audit checklist |
| CMS foundations | F07-F16 | Collections, fields, CSV import, permissions | In progress | Collection CRUD, typed fields, import/export, content manager UI |
| Dynamic content | F17-F26 | Datasets, repeaters, dynamic pages | Partial page templates only | Dataset binding, repeater binding, dynamic URLs, SEO per item |
| Visitor data input | F27-F32 | User input to CMS | Partial forms only | Form-to-collection mapping, moderation, validation, spam/rate controls |
| App Market architecture | F33-F42 | 800+ apps ecosystem concept | Missing | Local app manifest, install/enable/disable, app settings, widget/runtime hooks |
| Native app packs | F43-F52 | Blog, Events, Members, FAQ, Chat, Portfolio | Partial FAQ/chat-like public bits | First-party app modules with dashboard + public widgets |
| Stores/eCommerce | F53-F66 | Products, storefront, cart, checkout, orders | Missing | Catalog, product pages, cart, checkout adapters, order admin, promos |
| Payments/business ops | F67-F74 | Payments, invoices, taxes, shipping | Partial booking payment only | Provider abstraction, tax/shipping rules, refunds, receipts |
| Bookings pro parity | F75-F84 | Services, staff, calendar, packages | Partial W196-W215 | Packages/memberships/resources/client portal/calendar depth |
| AI builder | F85-F94 | AI site/responsive/text/image/code | Mostly missing | Prompt-to-site flow, responsive AI suggestions, text/image/code assistants |
| Collaboration | F95-F104 | Real-time editing, comments, roles | Minimal comments/version history | Presence, comments on canvas, roles/permissions, conflict handling |
| Developer platform | F105-F112 | APIs, custom code, functions, IDE-like flows | Missing | Custom code slots, serverless functions, SDK/API docs surface, logs |
| Multilingual | F113-F120 | Translation manager, language variants | Partial locale pages | Translation dashboard, auto/manual translation adapters, per-language assets/menu/SEO |

## Milestone Extension

The new plan rows start at M157 so existing commits and documentation remain stable.

- M157: Full Wix benchmark and F01-F120 checkpoint seed.
- M158-M160: CMS collections, datasets, dynamic pages, and visitor input.
- M161-M162: App Market shell and native app pack foundations.
- M163-M164: Stores/eCommerce and payment/business operations.
- M165: Bookings pro parity beyond current W196-W215.
- M166-M167: AI builder, responsive AI, text/image/code assistants.
- M168-M169: Collaboration, comments, roles, branching/handoff.
- M170: Developer platform/custom code/serverless hooks.
- M171: Marketing/CRM/automation/integration layer.
- M172: Multilingual translation manager expansion.
- M173-M174: Enterprise workspace, account-level media/CMS/analytics, infrastructure/observability.
- M175: Full product UX polish and cross-surface navigation.
- M176: Full Wix release audit and score gate.

## Operating Rule

After M156, new work should prefer F-layer gaps over more cosmetic refactors unless a refactor directly unblocks an F-layer feature or protects existing builder stability.
