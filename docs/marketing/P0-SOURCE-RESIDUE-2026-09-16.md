# P0 source residue — JA/EN public pages (2026-09-16)

Branch: `seo/semiconductor-hub-20260916` (based on `seo/en-ja-retarget`).
Scope: remaining Korea-first audience leaks that would still ship after this branch deploys. Product code was not edited in the explore pass.

## Verdict

Chrome this retarget already owns is largely clean: JA/EN intent landings, JA/EN home SEO, JA home/footer, JA/EN Taipei contact (no invented 02, no Taipei 04). After deploy, remaining “this site is for Korean clients” leaks are **columns + a few About/profile identity strings**, plus **related-article links that dump JA/EN readers onto `/ko/`**.

## KEEP (not defects)

- `son-jungmin` team bio (Korea operations manager).
- Dedicated `/korean-lawyer-in-taiwan`.
- All KO locale pages.
- Gym injury case on profile/home where the published-case disclaimer is present.

## Remaining leaks

### 1. JA/EN columns still address Korean readers as the default — P0

| File | Residue |
|---|---|
| `src/content/columns-en/001-taiwan-company-establishment-basics.md` | Opens with Korean companies and sole proprietors |
| `src/content/columns-ja/001-taiwan-company-establishment-basics.md` | 韓国企業や個人事業者 |
| `src/content/columns-en/004-taiwan-company-subsidiary-vs-branch.md` | parent company based in Korea |
| `src/content/columns-ja/004-taiwan-company-subsidiary-vs-branch.md` | 韓国の親会社が台湾に進出する場合 |
| `src/content/columns-en/005-taiwan-company-establishment-advanced-2.md` | Korea remittance / Korean nationals FAQ |
| `src/content/columns-ja/005-taiwan-company-establishment-advanced-2.md` | 韓国から送金 / 韓国人を従業員 |
| `src/content/columns-ja/008-taiwan-labor-severance-law.md` | 韓国とは異なり |
| cosmetics 011 EN/JA | Korean brands as default |

### 2. JA/EN column related links send readers to `/ko/` — P0

EN 005 and JA 008/009/013/015 related blocks point at `/ko/...`. Rewrite to same-locale paths.

### 3. JA attorney profile keywords still SEO-target Korean speakers — P1

`keywords` / `searchTerms` include `韓国語対応の台湾弁護士`. Leave that on the dedicated Korean landing.

### 4. Taipei phone — do not invent

`site-remediation-content.test.ts` 1-1 forbids Taipei `04-2326-1862` / `04-2326-1863`. Taipei cards are address-only. Public channel is email `wei@hoveringlaw.com.tw`. Other-office phones: Taichung 04-2326-1862, Kaohsiung 07-557-9797, Pingtung 08-739-1689.
