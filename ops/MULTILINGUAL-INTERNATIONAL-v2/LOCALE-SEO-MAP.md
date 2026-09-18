# LOCALE-SEO-MAP — MULTILINGUAL-INTERNATIONAL-v2

| URL | title/H1 language | canonical | hreflang | index |
|---|---|---|---|---|
| `/en` `/ja` `/ko` `/zh-hant` | matching locale | own locale home | existing public cluster | existing rules |
| `/{locale}/guides/taiwan-company-setup` | matching locale | `https://tseng-law.com/{locale}/guides/taiwan-company-setup` | existing siteLocales | indexable (existing guide) |
| `/{locale}/taiwan-debt-recovery-lawyer` en/ja/ko/zh-hant | matching locale | own URL; `noindex`; `alternateLocales: []` | none | `isGloballyNoindexPath` true |
| `/vi` `/id` `/th` `/fil` `/ar` | matching guidance language | own URL | existing guidance core alternates | existing |
| `/fil` tag | `fil` | not `tl` | `getLocaleLanguageTag('fil')==='fil'` | — |
| `/ja` tag | `ja` | not `jp` | `getLocaleLanguageTag('ja')==='ja'` | — |

Preview noindex on P07 is not written as a production-wide noindex of the site.
de/es: not on this branch HEAD (V2-17).
