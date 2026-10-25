# Content audit: ordinary todo versus unfinished markers

The previous case-insensitive TODO expression rejected ordinary Portuguese and Spanish words in titles and prose. A neutral regression fails before the change, while the existing ten checks and explicit-marker test pass (11/12). The candidate separates TODO into uppercase bare or explicit colon/bracket markers; the other placeholder expressions are unchanged. All12 tests pass after the change.

The frozen Portuguese six-article input was checked once with only the audit import changed: the3 false positives became0 errors, all6 remain visible, and semantic review remains required. The author read the diff independently and confirmed it contains no locale/manuscript allowlist. Existing failures are retained. No manuscript was rewritten to suppress the detector.

The candidate is under repo/ with read-only symlinks to runtime inputs and dependencies. It is not yet installed in the release checkout. Exact source/test/recheck hashes are in verification.json. This is a bounded heuristic correction, not complete natural-language placeholder recognition.
