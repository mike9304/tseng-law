# WO-I18N-H01 — Shared country-flag language switcher

## User requirement

Replace the public site's text-only locale controls with recognizable country
flag icons and short language codes. Clicking a control must open the
corresponding language:

- 🇰🇷 `KR` → Korean (`ko`)
- 🇯🇵 `JP` → Japanese (`ja`)
- 🇹🇼 `TW` → Traditional Chinese for Taiwan (`zh-hant`)
- 🇺🇸 `EN` → English (`en`)

The user explicitly requested KR/JP/TW. English remains required by the
four-language site contract, so it is represented by EN with a US flag.

## Required implementation

1. Create one reusable client component so Header, mobile drawer, and Footer
   cannot drift in order, labels, flags, targets, or accessibility.
2. Render the controls in this exact order everywhere: KR, JP, TW, EN.
3. Each link must contain:
   - a visible flag icon;
   - a visible two-letter code;
   - an accessible full language/country label;
   - `aria-current="page"` for the active locale.
4. Switching among KO/ZH-Hant/EN preserves the current public path.
5. Switching to JA must use the existing fail-closed
   `jaLanguageSwitchTarget()` policy. Do not expose an incomplete JA route by
   blindly replacing the locale segment.
6. Header:
   - replace the current `KO / 中文 / EN / JA` text links;
   - preserve the existing utility layout and active style.
7. Mobile drawer:
   - replace the current three text chips;
   - include all four flag controls;
   - close the drawer after a language choice;
   - keep touch targets at least 44 px high.
8. Footer:
   - replace the root-only KO/ZH/EN links;
   - include all four flag controls;
   - preserve the current-path behavior from the shared component.
9. Add focused tests that prove order, flag/code pairings, hrefs from a normal
   core route, JA safe fallback from an unsupported route, active state, and
   the mobile close callback.
10. Add only the minimal CSS needed for flag/code alignment, active state,
    focus visibility, wrapping, and mobile target size. Reuse existing
    `utility-lang`, `footer-locale-switch`, and `chip` styling where practical.

## Exact allowed files

- `src/components/LocaleFlagSwitcher.tsx` (new)
- `src/components/Header.tsx`
- `src/components/Footer.tsx`
- `src/components/MobileNavDrawer.tsx`
- `src/components/__tests__/locale-flag-switcher.test.tsx` (new)
- `src/app/globals.css`

`src/lib/public-route-policy.ts` and `src/lib/path-utils.ts` are read-only
dependencies for this work order. Do not modify them.

Do not change navigation IA, translation copy outside the switcher, member
logic, search behavior, page routing, SEO, or any unrelated styling. Do not
stage, commit, push, deploy, or modify runtime data.

## Verification

Run from `/Users/son7/Projects/tseng-law`:

```bash
npx vitest run src/components/__tests__/locale-flag-switcher.test.tsx
npm run typecheck
npx eslint \
  src/components/LocaleFlagSwitcher.tsx \
  src/components/Header.tsx \
  src/components/Footer.tsx \
  src/components/MobileNavDrawer.tsx \
  src/components/__tests__/locale-flag-switcher.test.tsx
git diff --check
git status --short
```

Report exact commands and results. If another file changes, stop and report the
scope violation instead of cleaning or reverting it.
