# Semiconductor hub SEO/GEO review — 2026-09-16

Status: **technical SEO PASS with publish GATE**  
Scope: branch `seo/semiconductor-hub-20260916`, slug `taiwan-semiconductor-supplier-legal`  
Commits reviewed: `e9c37a2c` (footer), `92f474ad` (landing). Product code not edited.  
Live: `https://tseng-law.com/en/taiwan-semiconductor-supplier-legal` was 404 at copy-kit observation (2026-09-16) — **미확인 on this machine after that timestamp**.

**Verdict.** Four-locale hub wiring (route, sitemap, JA switch, footer `<a href>`, HTML hreflang, `x-default=en`) is reciprocal and does not clone extra locales. Do not ship as “done” until attorney review of `[NEW]` copy. Do not treat FAQPage, llms.txt, or title-length as ranking levers.

---

## 0. Review contract

| Item | Value |
|---|---|
| Task | Review the new hub; PASS/FAIL against SEO-GEO corpus + the listed gates |
| Product edits | None. No 1-line sitemap/hreflang bug was proven |
| GLM / push | None |
| Skill file | `~/agent-library/skills/seo-geo-expert/SKILL.md` is a **broken symlink** (2026-09-16). Procedure taken from `~/.claude/agents/seo-geo-expert.md` + vault MOC |
| Open worktree | `src/data/intent-pages.ts` is **dirty** (+64/−20) from another session. Committed hub is the review object. Dirty WIP is §8 only |

### Corpus boot (notes fully or substantially read)

- MOC: `🗺️ SEO-GEO-전문지식` (2026-08-24)
- `국제-다국어-SEO-현행-딥리서치-2026-08` + snapshot `국제-다국어-hreflang-현행-2026-08`
- `YMYL-법률-SEO-GEO-플레이북-딥리서치-2026-08`
- `구조화데이터-스키마-현행-딥리서치-2026-08`
- `사이트-아키텍처-내부링크-딥리서치-2026-08`
- `GEO-개념-학술연구-현황-딥리서치-2026-08`
- Supporting: `프로그램매틱-SEO`, `키워드-검색의도-토픽클러스터` (cannibalization SOP), `SEO-거부된-랭킹요인-폴클로어`, marketing `folklore-traps.md` / `diagnosis-playbook.md`
- Instance: `docs/seo/taiwan-lawyer-ad-rules-2026-08-18.md`, `docs/marketing/HUB-COPY-SEMICONDUCTOR-2026-09.md`

Folklore traps checked and **not prescribed**: llms.txt as a Google lever, FAQPage-as-ranking, 글자수, 200-factor tables, small-site crawl-budget fear, 9-locale doorway clones, “x-default missing = cluster dead”.

---

## 1. Diagnosis (Audience / Offer / Channel / Constraint)

| Lock | One line | evidence \| assumption |
|---|---|---|
| **Audience** | Overseas (EN/ZH) / Korean (KO) / Japanese (JA) materials-and-equipment suppliers who need a Taiwan subsidiary, branch, or representative office, then contracts, hiring, trademarks, and unpaid invoices. | evidence: four distinct locale objects; EN test forbids Korea/Hangul on the **committed** object. assumption: they search supplier-legal before generic company-setup — **미측정**. |
| **Offer** | Same published services (investment/civil/labor/ip) named for that supplier situation. Not a semiconductor-IP boutique, science-park, or export-control product. | evidence: `serviceSlugs`, HUB-COPY allowed-fact list, no TSMC/win-rate tokens in hub JSON. assumption: the firm will actually take these matters — attorney. |
| **Channel** | Owned hub, one slug × four public locales (`ko` / `zh-hant` / `en` / `ja`). Footer Popular Topics + intent relatedResources + service/column `<Link href>`. Paid held. | evidence: `siteLocales` length 4; `dynamicParams=false`; sitemap 1 URL per locale. |
| **Constraint** | Taiwan 律師推展業務規範 + Korean 변협 광고 규정 in parallel on KO; attorney-review-required; no invented park/export-control copy; inquiry ledger industry rows **미측정**. | evidence: ad-rules memo 2026-08-18; HUB-COPY §2; `INQUIRY-LEDGER.csv` called empty of industry rows in the copy kit. |

Offer one-liner (not a slogan): overseas suppliers use the already-published Taiwan setup / labor / collections / trademark work, in four languages, in person or by video, at the published fee table.

---

## 2. PASS / FAIL

Confidence tags: **[확정]** code/corpus 1차 · **[추정]** valid inference · **[미확인]** not measured here.

### 2.1 Required gates

| # | Gate | Result | Grade | Evidence |
|---|---|---|---|---|
| G1 | hreflang mutual refs for 4 locales | **PASS** | 확정 | Sitemap dump 2026-09-16: each of `/ko|/zh-hant|/en|/ja/taiwan-semiconductor-supplier-legal` appears **once** and lists `ko`, `zh-Hant`, `en`, `ja`, `x-default`. Self-ref present. `zh-hant` URL segment + `zh-Hant` hreflang code (ISO 15924), not `zh` / `zh-TW`. HTML `generateMetadata` passes `alternateLocales: siteLocales` → `getLanguageAlternates` (default 4 locales + `x-default`). JA language switch: `JA_DEDICATED_ROUTE_PATHS` includes the slug. |
| G2 | `x-default=en` | **PASS** | 확정 | `HREFLANG_X_DEFAULT_LOCALE = 'en'` in `src/lib/seo.ts`. All four sitemap entries set `x-default` to the **en** hub URL. Not an English-noindex path (`isEnglishNoindexPath` does not include this slug), so the `/faq` ko-fallback rule does not apply. |
| G3 | No 9-locale clone | **PASS** | 확정 | `siteLocales = ['ko','zh-hant','en','ja']`. `[locale]/layout.tsx` `generateStaticParams` emits those four; `dynamicParams = false` → other locale prefixes 404. `publicLocalesForPath` always returns the same four. No `zh-hans` / `ms` / `my`. Not a city/keyword fan-out template (프로그램매틱 노트: unique-value test, not locale count). |
| G4 | No FAQPage-as-ranking claim | **PASS** | 확정 | Visible `FAQAccordion` + JSON-LD `FAQPage` (same answers on screen — sd-policies 비가시 마크업 금지 충족). Review does **not** treat this as a ranking or AIO lever. FAQ rich result ended 2026-05-07; schema is not a ranking factor (구조화데이터 결론 10; Mueller 2025-04-15). Do not add more FAQ schema to “rank”. Do not strip it as a penalty (페널티 트리거는 비가시 마크업). |
| G5 | No llms.txt as Google lever | **PASS** | 확정 | Hub commits do not add or advertise `llms.txt`. Existing `src/app/llms.txt/route.ts` is sitewide and does **not** list this slug. Google Search ignores llms.txt (“neither harm nor help”, AI optimization guide 2026-07-10; changelog 2026-06-15). Do not add the hub URL to llms.txt for Google ranking/AIO. |
| G6 | No keyword stuffing of **existing titles** | **PASS** (titles) | 확정 | `92f474ad` title hunks are **only** the four new hub titles. Existing `taiwan-lawyer` / `taiwan-company-setup-lawyer` / `taiwan-litigation-lawyer` titles unchanged. |
| G6b | Semiconductor tokens on **existing company-setup body** | **FAIL (committed)** / **open WIP reverts** | 확정 | `92f474ad` inserted “반도체 소재·장비” / 半導體 / semiconductor / 半導体 into `taiwan-company-setup-lawyer` `idealFor` + `cautionPoints` in all four locales. That is keyword insertion on an existing page (spam-policies stuffing; 네이버 content-basic: 인기 검색어 삽입 불이익). **Not a title change.** Dirty worktree currently reverts those four-locale body edits — keep the revert. |
| G7 | YMYL — no win rate | **PASS** | 확정 | Hub JSON tests forbid `승소율`, `win rate`, `最高`, `전문 1위`, `TSMC counsel`, `1.57`, `gym`. 律師推展業務規範 §5①1 勝訴率 has **no exception**. Korean 변협 규정 제4조 2호·제9조 ② 최고·유일. Committed hub copy has none of these. |
| G8 | YMYL — identifiable attorney | **PASS** (on-page identity) | 확정 | `AttorneyAuthorityCard` + Person JSON-LD + relatedResource `lawyers/wei-tseng`. Canonical names: 증준외 변호사 / 曾雋崴律師 / Attorney Wei Tseng / 曾雋崴弁護士. KO role **「대만 변호사 · 대표 변호사」** (원자격국 병기 — 외국법자문사법 제27조 방향). QRG §5.5 책임주체; 台灣 推展業務規範 §2 성명·사무소 (사이트 크롬/푸터는 사이트와이드). |
| G9 | YMYL — attorney review before publish | **FAIL (publish GATE)** | 확정 | HUB-COPY header: `attorney-review-required · do not publish unreviewed`. Audience label “semiconductor supplier”, warranty/하자, representative-office trading limit, and locale audience splits are `[NEW]`. 推展業務規範 §4 歪曲·省略·誤認·過度期待. Do not treat the landing as production copy until the attorney marks HUB-COPY §3–§6 / §13. |

### 2.2 Implementation wiring (supporting)

| # | Check | Result | Grade | Evidence |
|---|---|---|---|---|
| W1 | Dedicated App Router page | **PASS** | 확정 | `src/app/[locale]/taiwan-semiconductor-supplier-legal/page.tsx` — same pattern as `taiwan-lawyer`. |
| W2 | Intent registry | **PASS** | 확정 | Fourth slug; test expects `intentPageSlugs` length 4. |
| W3 | Sitemap STATIC_PATHS + JA entry | **PASS** | 확정 | `src/app/sitemap.ts` STATIC_PATHS + dedicated JA `createEntry` with four `alternateLocales`. Vitest `sitemap.test.ts` publishes JA URL exactly once. |
| W4 | Reciprocal JA on KO/ZH/EN sitemap rows | **PASS** | 확정 | `addReciprocalJapaneseAlternates` adds `ja` after the 3-locale STATIC_PATHS loop. Dump shows all four members include `ja`. |
| W5 | Footer inbound (orphan rule) | **PASS** | 확정 | Popular Topics in ko/zh-hant/en/ja → `/{locale}/taiwan-semiconductor-supplier-legal`. Official minimum: “Every page you care about should have a link from at least one other page” (Link best practices). |
| W6 | Related resources (hub-spoke) | **PASS** | 확정 | Profile, company-setup lawyer, litigation lawyer, company-setup guide — real `<Link href>`. |
| W7 | JA Hangul / EN Korea residue (committed) | **PASS** | 확정 | Committed EN uses “four languages”, not “Korean”. Committed JA has no Hangul, no `/ko/`. Vitest on **dirty** tree currently **fails** EN residue because WIP names “Korean” as a language — see §8. |
| W8 | Four locales have semiconductor token | **PASS** | 확정 | ko 반도체 / zh-hant 半導體 / en semiconductor / ja 半導体. |
| W9 | Shared services/columns | **PASS** (reuse) / **WARN** (topic) | 확정 / 추정 | `investment, civil, labor, ip` + four existing setup columns including **cosmetics PIF** and **logistics**. Intentional (HUB-COPY: do not invent a semiconductor column). GEO topic-mismatch is a citation gatekeeper (What Gets Cited) — cosmetics on a semiconductor hub is a **topical WARN**, not a crawl bug. |
| W10 | English-noindex leak | **PASS** | 확정 | Slug is indexable in EN. Cluster does not point at `/en/faq`. |
| W11 | lastmod | **WARN** | 확정 | EN/JA sitemap `lastModified=2026-09-06` (`EN_JA_PUBLIC_LASTMOD`). Page did not exist that day (`92f474ad` is 2026-09-16). lastmod is meaningful only when accurate (아키텍처 노트). Stale-old is less harmful than rolling `now()`, but it is still wrong. Not a hreflang bug; not a 1-line fix without a per-path map. KO/ZH have no lastmod. |
| W12 | Dual HTML + sitemap hreflang | **WARN (drift)** | 추정 | Corpus: three methods are equivalent; two at once add drift, not ranking. Existing site pattern, not introduced uniquely — but this slug now depends on both staying in sync. |
| W13 | FAQ uniqueness vs company-setup | **WARN** | 추정 | Hub FAQs restated from company-setup (3 months; subsidiary/branch; registration not enough; fee). Unique overlay is supplier audience + collections. 키워드 노트: cannibalization = **same intent**, not similar keywords; no Google “similar page penalty”. Monitor GSC query↔URL swap; do not 301 yet. |
| W14 | Template CTA talks about family disputes | **WARN** | 확정 | `IntentLandingPage` `ctaText` is shared chrome (“family disputes”). Visible on a supplier hub. Topic mismatch for GEO; not a hreflang fail. |
| W15 | Meta `keywords` array | **N/A (ignored)** | 확정 | Google does not use keywords meta (folklore table). Harmless. Do not spend time on the array as a lever. |

No 1-line sitemap/hreflang bug was found that a test could prove. The semiconductor sitemap test is **weaker** than the About test (JA exists + has `ja`/`x-default`, not the full five-key object). The dump already shows the full matrix; tightening the test is P3 hygiene, not a production defect.

---

## 3. Surfaces (Korea + Google + AI)

Do not pick one engine.

| Surface | What this hub can do | What it cannot / must not |
|---|---|---|
| **Google Search** | Reciprocal hreflang + self canonical per locale; indexable EN; footer/internal `<a href>`; unique main content per locale (KO Korea-audience, EN overseas, JA Japan-audience, ZH overseas). | hreflang is **URL swapping**, not a ranking boost (국제 SEO 결론 1). GSC country targeting is gone (2022-09-22). |
| **네이버** | Korean URL `/ko/taiwan-semiconductor-supplier-legal` in sitemap + footer. Static href. SSR HTML. | 가이드 55편 hreflang/`x-default` **0건** (2026-08-22). **Do not depend on hreflang for Naver.** Representative URL = Korean page. 수집요청 ≠ 색인/노출. |
| **다음/카카오** | Same Korean URL if registered at site root. | 사이트등록 ≠ 웹문서 크롤. Not a hub-specific lever. |
| **Google AIO / AI Mode** | Eligibility = indexed + snippetable + Search tech + GSC Search generative AI `Include` (default). Visible facts: entity trio, ~3 months, NT$3,000, four languages, identifiable attorney. | No extra schema, no llms.txt, no FAQ-as-ranking, no AI-only rewrite. Non-commodity 1인칭 is the long lever — this hub is still a service overlay, not a case narrative. |
| **ChatGPT / Perplexity / others** | Third-party directories and consistent entity strings outperform law-firm self-pages on legal queries (YMYL 결론 8; percents are vendor — **direction only**). | Do not forecast citation %. Do not add the hub to llms.txt “for Google”. Other systems reading llms.txt is 미확인 and not this review’s lever. |

---

## 4. YMYL / advertising (조문 확인 후만 처방)

Confirmed before prescribing (instance + corpus):

| Rule | Source | Hub status |
|---|---|---|
| 勝訴率 표시 절대 금지 | 台灣 律師推展業務規範 §5①1 (예외 없음) | PASS — not in hub JSON |
| 과거 사건 / 의뢰인 | §5①2–4 (예외 있음) | Hub copy does not reuse gym award. Card uses `summary[0]` (practice line), not gym `summary[2]`. |
| 誇大·省略·誤認·過度期待 | §4 | GATE — “supplier legal” naming needs attorney |
| 공식 사이트는 「廣告」표기 면제, 성명·사무소·주소·전화는 필요 | §2 | Sitewide chrome; hub adds attorney card |
| 한국: 광고마다 성명 (단서 있음) | 변협 광고규정 제3조 제2항 (2025-02-06 PDF) | Card + profile link. 광고책임변호사 표기는 바이라인과 **별개** (YMYL 플레이북 A1 정정) — sitewide, not unique to this slug |
| 한국: 최고·유일 | 제9조 ② | PASS |
| 한국: 결과 예측 | 제4조 12호 | PASS — no outcome promise |
| 한국: 보수액 **견적·비교·최저·환불 등 표방** | 제4조 10호. **단순 금액 표시 문언 금지는 없음** (유권해석 미확인 → 고위험) | Committed: NT$3,000 as already published. Dirty WIP adds “NT$50,000부터” on this hub — closer to 최저 표방; do not land without attorney + pricing-page conditions |
| 외국 자격 표기 | 외국법자문사법 제27조; 변협 경고 | KO role keeps 「대만 변호사」 |
| 관할 고지 | 플레이북 A4: **법적 필수 아님**, 강력 권장 | Hub does not add “대만법 한정 / 한국법 자문 아님” on the template. **WARN / 권장**, not a statute FAIL |

This document is not legal advice. Final advertising judgment is the attorney’s.

---

## 5. Priority playbook

0원 / owned only. No paid in this document.

| P | Lever | Why (corpus) | Effort | Risk / gate |
|---|---|---|---|---|
| **P0** | Attorney accept / edit / delete of `[NEW]` lines (titles, supplier naming, 하자/warranty, rep-office trading limit). Do not deploy unreviewed. | YMYL + 推展業務規範 §4 | Attorney hours | Publish GATE |
| **P0** | Keep the dirty-tree **revert** of semiconductor tokens on existing company-setup `idealFor`/`cautionPoints`. Do not re-stuff existing pages. | Stuffing = spam; 네이버 인기검색어 삽입 불이익 | Already in WIP | If WIP is discarded, committed FAIL G6b returns |
| **P0** | If languages must be named in EN, change the residue test to allow `Korean` **as a language name** only, or say “four languages (EN/ZH/JA/KO)” without the substring the test bans. Do not ship EN copy that fails `intent-pages-semiconductor.test.ts`. | Locale residue gate is a product test, not folklore | 1 test + copy | Dirty WIP currently **fails** that test |
| **P1** | After attorney sign-off: deploy four URLs together (hreflang cluster must be 200 + indexable). Then GSC URL inspection on all four. Naver: Korean URL only (수집요청 보장 없음). | Return-link cluster; 네이버 ≠ hreflang | Deploy + consoles | Partial locale launch would break reciprocity **[추정: pair vs cluster ignore is 미확인]** |
| **P1** | Do not add science-park / export-control / TSMC / win-rate / “semiconductor specialist certification”. | §4·§5; HUB-COPY 미확인 practices | — | Hard ban |
| **P2** | After index: add **one** relatedResource on `taiwan-company-setup-lawyer` → this hub (descriptive anchor, not “semiconductor semiconductor”). Do not stuff the setup **title**. | Internal link coverage; supporting vs topical | Small | Cannibalization monitor |
| **P2** | Replace cosmetics/logistics column cards on this hub with setup + subsidiary-vs-branch only, **or** write a real supplier column after attorney (not a fan-out thin page). | GEO topic mismatch; 프로그램매틱 unique-value | Copy + attorney | Do not invent park/export-control |
| **P3** | Hub-specific `ctaText` (drop family-dispute chrome). Descriptive H2 that a supplier query would ask, first sentence answers. | SALT: subheading + first sentence; FAQ schema is 1.08% of AI Mode cites — don’t park answers only in FAQ | Template split | Not a ranking magic format |
| **P3** | Tighten sitemap test for this slug to the same five-key object as `/about` (prove G1 in CI). Optional per-path lastmod. | Drift guard | Test-only | lastmod map is more than 1 line |
| **P4** | Offsite entity consistency (TWBA/directory/Naver blog) — not this PR. | Legal AI cites directories more than firm sites (direction; no percents) | Earned | 변협 제2조 제1항 6호 if paid third-party posts |
| **Don’t** | llms.txt, extra FAQPage, schema-for-AIO, 9th locale, keyword-stuff setup titles, crawl-budget talk, IndexNow=indexed. | Folklore table | — | — |

---

## 6. Measurement (KPI · window · falsify)

분모 first. Inquiry industry field is **미측정** (HUB-COPY). Do not forecast traffic, share, or conversion %.

| Layer | KPI | Source | Window | Support | Falsify |
|---|---|---|---|---|---|
| Business | Inquiries tagged semiconductor / materials / equipment / supplier | `docs/marketing/INQUIRY-LEDGER.csv` | 12 weeks from first live 200 | ≥1 tagged inquiry with usable matter | 0 inquiries **and** sessions-only → rewrite CTA/scope, **do not add pages** |
| Leading (Google) | Four hub URLs in GSC (indexed or discovered) | GSC URL inspection / coverage | week 8 | ≥2/4 indexed | <2/4 → stop new copy; only internal links + inspection. 색인요청 쿼터 수치는 공식 비공개 |
| Leading (Google) | Existing setup URLs stay indexed; no title-stuff regression | GSC | weekly for 8 weeks | setup URL remains | setup drops or query↔URL swap with hub → revert G6b-class edits, do not 301 on day 1 |
| Leading (네이버) | Korean URL collected (not “ranked”) | Search Advisor URL 검사 | 1 day–several weeks after 수집요청 | 수집 기록 | 수집요청 ≠ 노출. Do not read hreflang as Naver success |
| GEO | Citation on 2–3 supplier prompts × **7 runs** | Manual / GSC generative AI impressions if eligible | 2–4 week rolling | Directional only | Jaccard of AI answers is 0.32–0.43; one screenshot is not a KPI |
| Compliance | Forbidden-token grep + semiconductor vitest | CI | every PR | green | Any 승소율/win rate/TSMC/最高/전문 1위 → block |

반증 0은 무반증이라 쓰지 않는다. “0 inquiries **and** sessions-only” is a compound condition.

---

## 7. Folklore / not used

| Claim | Disposition |
|---|---|
| llms.txt will help Google / AIO | 기각 (1차) |
| FAQPage schema will rank or restore FAQ rich results | 기각. Rich result ended 2026-05-07 |
| Add more locales (zh-hans, ms, my) for coverage | 기각 — thin locale clone / scaled |
| Stuff “반도체” into existing setup titles | 기각. Titles were not changed; do not start |
| x-default missing would kill hreflang | 기각 — recommended, not required; this hub has it anyway |
| Schema / Person JSON-LD = E-E-A-T score | 기각. Disambiguation only |
| Small-site crawl budget | 기각. This site is not the crawl-budget document’s target |
| 글자수 / 200 factors | 기각 |
| Cannibalization penalty because both pages mention 회사설립 | 미확인 as a penalty. Treat as same-intent **watch**, not an automatic merge |

---

## 8. Open worktree (not the reviewed commit)

`src/data/intent-pages.ts` is modified in the working tree (another session). Observed 2026-09-16:

- **Good:** reverts G6b semiconductor tokens on existing company-setup body (all four locales).
- **Bad for current tests:** EN copy names “Korean” as a consultation language → `intent-pages-semiconductor.test.ts` “keeps English copy free of Korea/Hangul” **FAIL** (vitest 2026-09-16, 1 failed / 45 passed in the hub+sitemap+hreflang set; sitemap + hreflang files passed).
- **YMYL watch:** adds “NT$50,000부터 / starts from NT$50,000” FAQs on this hub. Fact exists on pricing, but 변협 제4조 10호 최저 표방 근접 — attorney + keep conditions.

This review does not merge or revert that WIP.

---

## 9. Files read

- `src/data/intent-pages.ts` (new slug × 4 locales + committed setup-body edits)
- `src/app/[locale]/taiwan-semiconductor-supplier-legal/page.tsx`
- `src/app/sitemap.ts`, `src/app/__tests__/sitemap.test.ts`
- `src/lib/public-route-policy.ts`
- `src/data/__tests__/intent-pages-semiconductor.test.ts`
- `src/components/IntentLandingPage.tsx` (`relatedResources`)
- `src/lib/seo.ts` (`getLanguageAlternates`, `HREFLANG_X_DEFAULT_LOCALE`)
- `src/lib/locales.ts`, `src/lib/seo-visibility.ts`
- `src/app/[locale]/layout.tsx` (`siteLocales`, `dynamicParams`)
- `src/data/site-content.ts` (footer Popular Topics)
- `src/app/llms.txt/route.ts` (not updated — correct)
- `src/components/AttorneyAuthorityCard.tsx`, `src/data/attorney-profiles.ts` (identity)
- `docs/marketing/HUB-COPY-SEMICONDUCTOR-2026-09.md`

Sitemap matrix (script, 2026-09-16): four URLs, each with `ko` + `zh-Hant` + `en` + `ja` + `x-default=https://tseng-law.com/en/taiwan-semiconductor-supplier-legal`.
