# General column streamed hydration, 2026-10-03

After publishing090/091/092 at bcc0332, the actual production Firefox390px visit to English092 raised React418. The other17 article conditions, all15 board conditions,25 previous Chinese titles, API search and content/metadata/hero comparisons passed. The original failed result is retained; it is not erased by a successful retry.

The route previously used the synchronous client-boundary view only for traffic columns. Other columns sent the same view as streamed server components. In a local production server, replaying unchanged full HTML in2048-byte chunks at12ms intervals reproduced the same React418 on Korean091 in2 of3 visits. English092 and the older English estate-tax article had no errors in their three local visits. This demonstrates a general-column streaming problem; it does not claim deterministic reproduction of the English production failure on every load.

All public columns now use the existing synchronous view from completed public data. TrafficColumnView is renamed PublicColumnView. The async route still decides public eligibility, body/hero/schema visibility and the exact allowed props. Server HTML remains available without JavaScript. No hydration-error suppression, client-only rendering, new body copy, media, URLs or SEO changes are introduced. Regression tests exercise hidden body/FAQ/schema behavior for traffic and general columns; explicitly published FAQ schema remains separate from hidden body text.

Validation before the fix commit:

-257 related tests in41files pass, including both categories' publication visibility and existing generated-video visibility. Production build/type/lint and route-guard security pass. Next's displayed column-route First Load JS remains262kB (route size13.8→13.7kB).
-53 local SSR comparisons across49 languages pass: all visible text, link sequences, canonical, metadata and JSON-LD are identical before/after. Includes each locale's001article, the three newly published articles, and an existing traffic article.
-The same nine slow-HTML initial visits pass after the change; the original before result remains7/9. scripts/verify-column-hydration.mjs stores this regression and exits nonzero on a page error, uses only a local HTTP upstream, and closes owned sockets.
-All18 final local article browser conditions pass: Chromium320/390/1440, WebKit390, Firefox390, Chromium390withoutJS per article. Body/caption/hero/AIbyline/table/metadata, axe scope, navigation and title checks retained. No article or image bytes changed.

The checked-in script's final execution and post-deployment verification are recorded in the publisher's evidence/columns-090-091 and final handoff. Prior unrelated full-suite failures, dependency findings and physical-device/screen-reader limits remain. No new legal review or generated-video semantic approval is claimed.
