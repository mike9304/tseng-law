# Publication progress — 2026-10-25

First batch: 21 substantive columns in ru/ms/fil/tr/nl/zh-hans/sv are publicly deployed at commit `5e2d0f5df8c75eb4aca8304b7d9f5110ac422f90`. Public cache-busting build-info checks identified the same commit before and after verification. HTTP checks found all 951 body blocks and 63 FAQ entries, seven locale listings, 21-language ARC clusters and the 49-language home cluster. Images returned 200 and matched source bytes.

The isolated public Chromium check now has 53 unique passing scenarios: all21 articles on desktop and mobile, seven no-JavaScript article cases and four home/legacy navigation cases. Seven initial font-request aborts were kept in the evidence and diagnosed as navigation during outstanding font loads; waiting for article and then language-menu fonts resolved targeted reruns. No application error was ignored or production code changed to obtain the result. Root visually inspected the Swedish desktop hero and simplified-Chinese mobile/body desktop captures. Existing English sidebar copy is a prior template limitation. See `checks/live-batch01-browser-summary.json` and `checks/live-batch01-http-REPORT.md`.

Second batch: 21 more columns in da/nb/fi/pl/cs/ro/uk have been integrated and accepted by the recorded editorial checks; build and deployment verification are underway. Root personally authored SV and UK and edited Kimi ZH-HANS and NB drafts. Kimi BG drafts are now under review outside the release tree.

The overall target remains 286 substantive visible professional columns in each of all49 locales. These batches are progress, not completion.
