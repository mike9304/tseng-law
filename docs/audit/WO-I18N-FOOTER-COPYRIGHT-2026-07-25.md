# WO-I18N-FOOTER-COPYRIGHT — Localize the public copyright line

Date: 2026-07-25 KST
Owner: delegated implementation worker
Manager: Codex `/root`

## Goal

Remove the untranslated English `All rights reserved.` suffix from the public
footer in KO, ZH-Hant and JA, and keep all four locales on the same minimal
`© + year + localized rights-holder name` contract.

This unit changes only the public copyright text and its focused regression
test. It must not change footer links, social links, language-switch targets,
flag icons, layout or builder templates.

## Allowed files

1. `src/data/site-content.ts`
2. `src/components/__tests__/ja-footer.test.tsx`

No other file may be modified.

## Exact four-language contract

Replace each locale's `footer.legal` with exactly:

```ts
{
  ko: '© 2026 법무법인 호정.',
  'zh-hant': '© 2026 昊鼎國際法律事務所。',
  en: '© 2026 Hovering International Law Firm.',
  ja: '© 2026 昊鼎国際法律事務所。',
}
```

The Korean and English records use `.`, while the Traditional Chinese and
Japanese records use the full-width `。`.

## Copy boundaries

- Preserve `©`, the year `2026`, and the current localized organization name.
- Do not add `all rights reserved`, a translation of that phrase,
  unauthorized-copying language, ownership claims or any new legal statement.
- Do not make the year dynamic in this unit.
- Do not change the organization names or punctuation beyond the exact
  contract.

## Regression requirements

Extend the existing footer test to prove:

1. server-rendered KO, ZH-Hant, EN and JA footers contain their exact reviewed
   copyright line;
2. the rendered footer and `siteContent[locale].footer.legal` exclude
   case-insensitive `All rights reserved`;
3. every record contains exactly one `©` and the exact year `2026`;
4. existing Japanese brand, office, legal, social, popular-topic and
   🇰🇷 KR / 🇯🇵 JP / 🇹🇼 TW / 🇺🇸 EN language-switch assertions remain
   unchanged and passing.

## Forbidden scope

- `src/components/Footer.tsx`
- `src/components/LocaleFlagSwitcher.tsx`
- Footer columns, office links, legal links, social links or aria labels
- Flag emoji, codes, locale paths or `aria-current`
- Builder templates, builder data or admin UI
- Header, service, column, homepage-section, SEO, JSON-LD, CSS or asset changes
- Stage, commit, push, deploy or server operation by the worker

## Required automated gates

```bash
npx vitest run \
  src/components/__tests__/ja-footer.test.tsx \
  src/components/__tests__/site-remediation-a11y.test.tsx
npm run -s typecheck
npx eslint \
  src/data/site-content.ts \
  src/components/__tests__/ja-footer.test.tsx
git diff --check
git status --short
```

The manager owns four-locale desktop and Japanese mobile browser verification,
including the exact bottom-bar text, unchanged four-flag switcher and absence
of page errors or horizontal overflow.

## Required manager browser gate

Use the project's Playwright fallback against the already-running local site.

Desktop viewport: `1440 × 1000`

```text
http://127.0.0.1:3765/ko
http://127.0.0.1:3765/zh-hant
http://127.0.0.1:3765/en
http://127.0.0.1:3765/ja
```

Japanese mobile viewport: `390 × 844`

```text
http://127.0.0.1:3765/ja
```

For every run assert:

1. HTTP 200 and the locale's exact `.footer-copyright-row` text from the
   reviewed contract;
2. no case-insensitive `All rights reserved` in the footer;
3. the footer switcher contains exactly `KR`, `JP`, `TW`, `EN` and the
   corresponding 🇰🇷, 🇯🇵, 🇹🇼, 🇺🇸 flags;
4. the active locale has `aria-current="page"` and each flag keeps its
   locale-home href;
5. no uncaught page errors or console errors;
6. `document.documentElement.scrollWidth <= window.innerWidth`.
