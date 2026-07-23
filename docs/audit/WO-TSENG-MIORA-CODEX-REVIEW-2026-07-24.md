# Codex Review — tseng-law.com Miora Editorial Assets

**Date:** 2026-07-24
**Implementation:** Grok 4.5
**Design debate / review / deployment:** Codex
**Branch:** `design/miora-editorial-assets-20260724`

## Decision

Approved for deployment after three browser-found defects were returned to Grok and corrected:

1. zh-Hant desktop still rendered decomposed legacy services/results nodes.
2. Later `.section` rules reintroduced 108px/48px padding around the editorial plate and mobile image letterboxing.
3. `min-height: inherit` could not resolve through an `auto`-height parity wrapper, leaving a 253px zh-Hant results gap.

The final design uses six code-native practice icons plus one Miora-generated editorial plate in the results section. No Miora icon bitmap/SVG wrapper was deployed.

## Source asset

- Miora project: `https://miora.design/file/706866779112463`
- Original: 2048×880 RGB PNG
- Original SHA-256: `8615cd1f9f02ae9e42d18f481931a4687326c6d757193792fdb04c1a8b154f01`
- Production WebP: 2048×880, 56,018 bytes
- Production SHA-256: `e97023029bd9bcdd4ab3133cad252488ad711a2bcfcf8ca8667d7840c2d53f40`
- Miora credits: 1,000 initial → 741.62 remaining (258.38 used)

## Independent gates

### Code

- Focused Vitest: 3 files, 10 tests — PASS
- `npm run typecheck` — PASS
- Modified-file `next lint` — 0 warnings/errors
- `git diff --check` — PASS
- Clean `next build` — PASS, 427 static pages generated
- Build warnings were pre-existing commerce CSS / legacy `<img>` / Hook warnings; modified files produced none.

### Browser matrix

Playwright production build, real published data:

| Locale | Viewport | Results | Icons | Overflow | Console |
|---|---:|---|---:|---:|---:|
| ko | 1440×1000 | 786px, media 784/784 | 0–5 | 0 | 0 |
| ko | 390×844 | media 180/180 | 0–5 | 0 | 0 |
| zh-Hant | 1440×1000 | wrapper/result 843/843, media 841/841, stats immediately follows | 0–5 | 0 | 0 |
| zh-Hant | 390×844 | media 180/180 | 0–5 | 0 | 0 |
| en | 1440×1000 | 786px, media 784/784 | 0–5 | 0 | 0 |
| en | 390×844 | media 180/180 | 0–5 | 0 | 0 |

- Practice card radius 4px, shadow `none`
- Accordion mouse/Enter expansion and collapse confirmed
- Targeted axe scan: serious/critical violations 0
- FAQ button weight remained 600 with Noto Sans KR stack
- Header seal remained `object-fit: contain`, 40×40 desktop / 34×34 mobile, no crop
- Results image lazy-load completed after scroll; optimized Next image rendered successfully

## Scope audit

- No published JSON, database, seed, locale copy, SEO, booking, header, footer, FAQ, or stats data changes
- zh-Hant desktop parity swap is limited to services and results on the home route
- No text overlay, hover zoom, generic legal clichés, bitmap icon wrappers, gradients, or glass treatment introduced
