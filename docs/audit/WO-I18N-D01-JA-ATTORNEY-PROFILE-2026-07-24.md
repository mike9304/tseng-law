# WO-I18N-D01 — Complete Japanese attorney profile data

## Problem

`attorney-profiles.ts` contains complete KO, ZH-Hant, and EN profiles for
Attorney Wei Tseng, but no Japanese record. The public Japanese lawyer detail
and media hub therefore cannot render the same biography, credentials,
representative matters, links, proof points, and FAQ as the other locales.

## Translation source and fidelity

Use the Korean record as the semantic source of truth and cross-check factual
names against the ZH-Hant and EN records. The Japanese record must preserve the
same information density; do not summarize or omit facts for speed.

Required Japanese identity:

- name: `曾俊瑋弁護士`
- role: `台湾弁護士・代表弁護士`
- firm: `昊鼎国際法律事務所`

Preserve these facts exactly:

- National Taiwan University finance master's degree;
- National Chengchi University double major in law and finance;
- exchange study at Kobe University and Waseda University;
- Trend Law Office, Hovering International Law Firm, and the Taichung branch
  of the Legal Aid Foundation;
- Korean student gym-injury matter with a TWD 1.57 million first-instance
  damages judgment;
- Korean, Chinese, and Japanese working languages;
- Taiwan company formation/investment, litigation/damages, IP, visas,
  family, and labor matters.

## Required implementation

1. Widen the public profile record and helper arguments from builder `Locale` to
   public `SiteLocale`.
2. Add a complete `ja['wei-tseng']` record with every field present in the KO,
   ZH-Hant, and EN records:
   - identity, role, title, description, image, email;
   - three summary paragraphs;
   - languages, practice areas, education, experience, notable matters;
   - six Japanese internal links using `/ja/...`;
   - four external profiles with Japanese labels;
   - sameAs;
   - keywords and search terms;
   - four proof points;
   - three FAQ items.
3. Use natural professional Japanese suitable for a Taiwanese law-firm site.
   Do not leave Korean or English sentences in visible Japanese copy. Proper
   names, `TWD`, `WEI Lawyer`, `YouTube`, `Naver Blog`, and alternate-name
   tokens are allowed.
4. Keep KO/ZH-Hant/EN records byte-for-byte unchanged except for the necessary
   type widening.
5. Add focused tests proving:
   - Japanese field/count parity with Korean;
   - required factual anchors and credentials;
   - all Japanese internal links begin with `/ja/`;
   - no unintended Hangul sentences or `/ko/` links;
   - `getAttorneyProfile('ja', 'wei-tseng')` and
     `getAttorneyProfilePath('ja')` work;
   - existing three locales still resolve.

## Exact allowed files

- `src/data/attorney-profiles.ts`
- `src/data/__tests__/attorney-profiles-ja.test.ts` (new)

All other files are read-only. Do not change routes, components, SEO, service
data, Header/Footer, or styling. Do not stage, commit, push, deploy, or modify
runtime data.

## Verification

Run from `/Users/son7/Projects/tseng-law`:

```bash
npx vitest run src/data/__tests__/attorney-profiles-ja.test.ts
npm run typecheck
npx eslint src/data/attorney-profiles.ts \
  src/data/__tests__/attorney-profiles-ja.test.ts
git diff --check
git status --short
```

Report exact commands and results. If another file changes, stop and report the
scope violation instead of cleaning or reverting it.
