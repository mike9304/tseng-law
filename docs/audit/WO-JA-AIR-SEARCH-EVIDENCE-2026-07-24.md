# JA translation search evidence (MacBook Air + Studio)

Date: 2026-07-24 KST  
Studio host: `son7s-Mac-Studio.local`  
Air host: `son7ui-MacBookAir.local` (Tailscale/LAN `100.93.15.89`)  
SSH: `~/.ssh/mac_studio_to_air` (default `id_ed25519` denied; dedicated key works)

## Air inventory (verified)

| Check | Result |
|-------|--------|
| Ping `100.93.15.89` | OK (~9ms) |
| SSH | OK with `mac_studio_to_air` |
| `~/gh-harvest/tseng-law` | Present (older clone) |
| `src/content/columns` | 17 KO |
| `src/content/columns-zh` | 17 ZH |
| `src/content/columns-en` | **0** (Air clone lacks Studio EN work) |
| `src/content/columns-ja` | **0 / does not exist** |
| `src/lib/locales.ts` | `ko \| zh-hant \| en` only — **no `ja`** |
| Runtime-data hiragana scan | **0 hits** |
| Desktop/Downloads/Documents `*ja*` / 일본 / 日本語 | **no law-column corpus** |
| Python walk for JP law markdown (hiragana + 台湾/会社/法律) under Projects/Desktop/Downloads/Documents/tseng-workorders/agent-library | **0 candidates** |
| `tseng-law-main.zip` | Exists; no `columns-ja` / `/ja/` content listing hits |
| Codex session with “일본어 통합” string | Obsidian vault note patch only — **not column translations** |

## Studio inventory (verified)

| Check | Result |
|-------|--------|
| `~/Projects/tseng-law/src/content/columns-ja` | Missing |
| `locales` | No `ja` |
| iCloud Obsidian `20-Projects/tseng-law` | No JA column files found in quick scan |
| Broad Projects/Desktop JP law md scan | **0 candidates** |

## Conclusion

**MacBook Air is reachable, but no Japanese full-column translation corpus was found to import.**  
There is nothing to “bring over and review for quality” as pre-existing JA article files.

## Recommended path (for Codex plan + implementation)

1. Treat JA as **net-new full translation work** (same quality bar as EN full columns).  
2. Add locale `ja` + `src/content/columns-ja/*.md` (17) from KO sources.  
3. Wire loader/sitemap/nav/site-content JA copy.  
4. Parallel-agent translation + integrity tests + Codex review.  
5. Lawyer review still required before public legal reliance.

## Explicit non-findings

- No Air path like `columns-ja/001-...md`  
- No DeepL/OpenAI export dump of 17 Japanese articles under home trees searched  
- “일본어 상담 가능” marketing copy is **not** a site locale or column body  
