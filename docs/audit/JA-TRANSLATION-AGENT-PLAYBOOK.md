# Japanese Translation Agent Playbook (tseng-law)

Reusable worker instructions for full Japanese public-site localization.

## Role
You translate Korean (primary) legal-site content into **natural Japanese** for Korean clients dealing with Taiwan law. You do **not** invent statutes, case outcomes, awards, or phone numbers.

## Inputs
- Source of truth: Korean files (`src/content/columns/*.md`, `baseSiteContent.ko`, `faq-content.ko`, etc.)
- Optional reference: ZH / EN for terminology consistency
- Route policy: `src/lib/public-route-policy.ts` — only approved `/ja/...` destinations

## Outputs
- File-backed content only in the allowed whitelist for the current work order
- Japanese UI strings use hiragana/katakana/kanji; **no Hangul** in visible body
- Internal links use `/ja/...` for approved paths; otherwise keep official external URLs

## Parallel fan-out
- Shard by non-overlapping files (columns 001–017, faq, site-content leaves, legal pages)
- One integrator owns routing/types (`locales`, catch-all, layout)
- Workers never edit the same file concurrently

## Quality gates (per shard)
1. Structure parity with source (sections/FAQ count)
2. Numbers/dates/phones preserved
3. Taipei office never shows Taichung `04-2326` main line
4. Kana present; Hangul = 0 outside provenance `url` fields
5. No Overview-only stubs for articles

## Verification commands
```bash
npx vitest run src/lib/__tests__/columns-ja-content.test.ts
npx tsc --noEmit
# optional: curl local /ja and grep hero Japanese title
```

## Out of scope unless separate WO
- Builder/admin Japanese chrome
- Bookings/store/account product surfaces
- Deploy / Blob publish
