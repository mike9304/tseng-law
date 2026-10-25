# Batch 02 public HTTP audit

Verdict: PASS. This verdict covers actual public HTTP content and metadata; browser rendering is separate.

Target commit: `3b4ea7900664b618746f7b5ce959515e124eefe8`. Live commit: `3b4ea7900664b618746f7b5ce959515e124eefe8` (exact_target).
Public build metadata reports builtAt `2026-10-25T14:35:16.940Z`. Before/after live commit agrees: `True`.
Audit completed: 2026-10-25 23:48:18 KST (2026-10-25T14:48:18.624387+00:00).
Manifest SHA-256: `a20ffb38dc16aa7d34d905c85efc25bd8f621e683c98e3e40abc21394594b253`. Source expectations came from immutable Git content at the target commit, not the working tree.

## Actual response results

| Check | Result |
|---|---|
| New localized article pages | 21/21 |
| Source body blocks present in actual column body | 957/957 |
| Visible FAQ questions/answers and matching FAQ JSON-LD | 63 FAQ entries; 21/21 pages |
| Language listings with all three local titles | 7/7 |
| Existing translated pages: local source identity + complete reciprocal metadata | 63/63 |
| Reciprocal graphs across all 28 locales | 3/3 ARC slugs |
| Home language links | 49 switcher links / 50 hreflang entries |
| Unique hero image HTTP/MIME/signature/source SHA | 3/3 |
| Captured response hashes re-read from disk | 98/98 |

## Local-language identity examples

Each new page is credited only after all of its own source body blocks, localized title and FAQ match the public column DOM. HTTP 200 alone is insufficient.

| Locale | Public example | Actual content-language | Matching source blocks for all three articles |
|---|---|---|---|
| da | [Dit første opholdskort i Taiwan: frist, bilag og udlevering](https://tseng-law.com/da/columns/taiwan-arc-first-application) | da | 147/147 |
| nb | [Første ARC i Taiwan: frister, dokumenter og utstedelse](https://tseng-law.com/nb/columns/taiwan-arc-first-application) | nb | 133/133 |
| fi | [Ensimmäinen ARC-oleskelukortti Taiwanissa](https://tseng-law.com/fi/columns/taiwan-arc-first-application) | fi | 137/137 |
| pl | [Pierwsza karta ARC na Tajwanie: termin, dokumenty i odbiór](https://tseng-law.com/pl/columns/taiwan-arc-first-application) | pl | 138/138 |
| cs | [První ARC na Tchaj-wanu: od kterého dne běží lhůta](https://tseng-law.com/cs/columns/taiwan-arc-first-application) | cs | 145/145 |
| ro | [Primul ARC în Taiwan: data cererii, actele și ridicarea cardului](https://tseng-law.com/ro/columns/taiwan-arc-first-application) | ro | 133/133 |
| uk | [Перша ARC на Тайвані: відлік 30 днів, документи та збір](https://tseng-law.com/uk/columns/taiwan-arc-first-application) | uk | 124/124 |

Every new article checks one canonical URL, the exact 28 locale switcher destinations, and 29 hreflang destinations including x-default. The existing 63 pages are fetched as well, so reciprocal links are checked in both directions for every locale, not inferred from one language.

No public author/AI byline is permitted by the new-page checks (visible markers, author DOM hooks, author metadata and JSON-LD author keys). The new column bodies also contain no strong/b emphasis.

## Evidence and limits

- Full machine result: `runs/20261025T144754194591Z/results.json`.
- Response integrity: `runs/20261025T144754194591Z/response-integrity.json`.
- The run retains actual HTML, image, robots and build-info responses with sanitized headers, request/completion times and body hashes.
- New article body comparison normalizes whitespace and Unicode NFC; it excludes script/style/noscript/template text and requires exactly one column body container.
- Existing reciprocal pages receive local title and first-two-paragraph checks, not a new full legal or prose review.
- HTTP presence does not establish rendered visibility, image decoding or layout. The parent performs isolated public-browser checks separately.
- No publish command, Air trigger, infrastructure change, logged-in browser, customer data, form submission or external message was used.
