# Technical + Design Debt Audit (2026-02-19)

## Resolved in this pass
- Hero media now supports 3-slot video rotation (`/videos/hero-1..3.mp4`) with poster fallback and crossfade.
- Header changed to fixed premium pattern with scroll shrink and content offset.
- Mobile drawer adjusted to full-screen white overlay behavior.
- Service cards upgraded with domain-specific SVG icons and stronger hover states.
- Scroll highlight text module added for philosophy copy (staggered reveal + keyword emphasis).
- Section/card stagger reveal behavior normalized across major modules.
- Footer structure refined to premium 4-column desktop grid (`2fr 1fr 1fr 1fr`) with responsive collapse.
- Purple overuse reduced in several high-area UI elements (hero tint, mega panel surface, active tabs, dots).

## Remaining debt (next pass)
- Replace placeholder SVG portrait and hero posters with real photography/video assets.
- Add full EN content set (currently `?lang=en` language mode only).
- Add office fax/contact data once confirmed (currently placeholder `-` where missing).
- Add Lighthouse baseline report artifact and regression budget tracking.
- Consolidate duplicate tab/list modules (`UpdatesTabs`, `FirmUpdatesSection`) into one shared primitive.

## Risk notes
- If `/public/videos/hero-*.mp4` files are not provided, hero uses poster fallback by design.
- External Google Maps/YouTube/Naver links depend on network and third-party availability.
