# verify — fact-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide-2 (round 0, Claude Opus)

Retrieval date for every URL below: 2026-10-12. Pages were opened with WebFetch (no memory used). Scope: the single item in triage.md (TRIAGE: FACTUAL 1). This is a source link/label check, not a statute fact, so the official source is the Invest Taiwan portal itself (投資臺灣入口網, Ministry of Economic Affairs; footer names 經濟部投資促進司).

## Issue 1 — Invest Taiwan source link opens the Japanese-language page

### Claim as each language version states it (sources list, live text)

- ko (orig-ko.md line 125): `[Invest Taiwan 외국인투자 개요](https://investtaiwan.nat.gov.tw/showPage?lang=jpn&search=InvestmentStatus01)`
- ja (orig-ja.md line 120): `[Invest Taiwan：外国人投資の概要](https://investtaiwan.nat.gov.tw/showPage?lang=jpn&search=InvestmentStatus01)`
- en (orig-en.md line 131): `[Invest Taiwan Overview of Foreign Investment](https://investtaiwan.nat.gov.tw/showPage?lang=jpn&search=InvestmentStatus01)`
- zh-hant (orig-zh-hant.md line 129): `[投資台灣入口網外國人投資說明](https://investtaiwan.nat.gov.tw/showPage?lang=jpn&search=InvestmentStatus01)`

All four live versions carry the same URL with `lang=jpn`.

### What the official pages show (retrieved 2026-10-12)

1. https://investtaiwan.nat.gov.tw/showPage?lang=jpn&search=InvestmentStatus01
   - Page title: 「投資臺灣入口網 Invest Taiwan_投資の設立_投資のフローチャート_外国人の出資者」
   - Body language: Japanese. Breadcrumb: 「ホーム > 投資の設立 > 投資のフローチャート > 外国人の出資者」. Main heading: 「外国人の出資者」. Sections: 「ビジネスのタイプ」「投資申請プロセス」「ワンストップサービス」.
   - Text on the page: 「経済部商業発展署に対して公司名と営業事業の事前検索、および公司名の保留を申請します。」; the investment-permit step names 「經濟部投資審議司」.
2. https://investtaiwan.nat.gov.tw/showPage?lang=cht&search=InvestmentStatus01
   - Page title: 「投資臺灣入口網 Invest Taiwan_投資設立_投資程序_僑外商」
   - Body language: 正體中文. Breadcrumb: 「首頁 > 投資設立 > 投資程序 > 僑外商」. Main heading: 「僑外商」. Sections: 「經商型態」「公司、商業比較」「分公司、辦事處比較」「投資申辦流程」「設立公司」「設立商業」「設立分公司」「設立辦事處」「一站式線上申請」.
   - Text on the page (original Chinese): 「依公司法規定，以營利為目的，依公司法組織、登記、成立之社團法人，經主管機關核准登記後，方得成立公司。公司種類主要包含：有限公司、股份有限公司等。」; the investment application step reads 「向經濟部投資審議司提出申請」. Footer: 「經濟部投資促進司」, 「經濟部版權所有 © 2018 投資台灣入口網」.
3. https://investtaiwan.nat.gov.tw/showPage?lang=eng&search=InvestmentStatus01
   - Body language: English. Breadcrumb: "Home > Business in Taiwan > How to Invest > Overseas Chinese and Foreign Investment". Main heading: "Overseas Chinese and Foreign Investment". Sections: "Business Type" (incl. "Comparison of a Subsidiary, a Branch Office and a Representative Office"), "Investing Procedures", "One Stop Online Application".
   - Text on the page: "submit the Investment Application Form and relevant documents to the Department of Investment Review, MOEA".
4. Language versions the site offers: the header language switcher lists exactly three — 「正體中文」 (`./homePage?lang=cht`), 「English」 (`./homePage?lang=eng`), 「日文」 (`./homePage?lang=jpn`). There is no Korean version. Requesting https://investtaiwan.nat.gov.tw/showPage?lang=kor&search=InvestmentStatus01 returns the 正體中文 page (heading 「僑外商」, breadcrumb 「首頁 > 投資設立 > 投資程序 > 僑外商」), i.e. the site itself falls back to Chinese for an unsupported language code.

Label vs. page content: in every language the label is the column's own description ("overview of foreign investment" on Invest Taiwan), not a quoted page title. The page it describes — business forms for overseas Chinese and foreign investors (company / branch / representative office comparison) and the investment application procedure — is what the entry is cited for (the section on operating in Taiwan through a subsidiary or branch and the foreign-investment procedure). The labels therefore match the page; only the language version of the link is in question.

### Verdict — PARTLY (the link's language version is wrong in ko, en, zh-hant; the label is right everywhere; ja is right as it stands)

- ja — ORIGINAL-RIGHT. `lang=jpn` opens the Japanese page 「外国人の出資者」, which is the correct version for the Japanese column. Left unchanged.
- en — CONFIRMED-ERROR. An English label opens the Japanese-language page although the same page exists in English. Correct link: `lang=eng` ("Overseas Chinese and Foreign Investment").
- zh-hant — CONFIRMED-ERROR. A Chinese label 「投資台灣入口網外國人投資說明」 opens the Japanese-language page although the 正體中文 original exists. Correct link: `lang=cht` (「僑外商」).
- ko — CONFIRMED-ERROR. As reported: a Korean label opens the Japanese-language page. The site has no Korean version, so the link is pointed at the 正體中文 version (`lang=cht`): it is the portal's own-language original and the page the site serves for an unsupported language code; the other twelve entries of the ko sources list all open Chinese-language official pages (law.moj.gov.tw, fda.gov.tw/tc, mohw.gov.tw, moea.gov.tw); and that page prints 「經濟部投資審議司」 exactly as the ko body quotes it in parentheses. The English version (`lang=eng`) would be the alternative; Chinese was chosen for consistency with the rest of the list. The label is kept unchanged.

REMOVED-URL: https://investtaiwan.nat.gov.tw/showPage?lang=jpn&search=InvestmentStatus01 — replaced by https://investtaiwan.nat.gov.tw/showPage?lang=eng&search=InvestmentStatus01 — reason: en column; the old link opened the Japanese-language version of the page, the English version of the same page exists.
REMOVED-URL: https://investtaiwan.nat.gov.tw/showPage?lang=jpn&search=InvestmentStatus01 — replaced by https://investtaiwan.nat.gov.tw/showPage?lang=cht&search=InvestmentStatus01 — reason: zh-hant column; the old link opened the Japanese-language version of the page, the 正體中文 version of the same page exists.
REMOVED-URL: https://investtaiwan.nat.gov.tw/showPage?lang=jpn&search=InvestmentStatus01 — replaced by https://investtaiwan.nat.gov.tw/showPage?lang=cht&search=InvestmentStatus01 — reason: ko column; the old link opened the Japanese-language version of the page, the site has no Korean version (正體中文 / English / 日文 only), so the 正體中文 original is linked like the other entries of the list.

The ja draft keeps the `lang=jpn` URL (it is removed only from ko, en, zh-hant). No source entry was dropped in any language; the same page (InvestmentStatus01) is still cited in all four.

## Not in scope (issues.md items that triage did not mark as factual — untouched)

- read_time "9분 분량" vs. computed 8분; house format of the sources section; the closing disclaimer paragraph; legal numbers carried over without re-verification (3-year validity, 3-month window, 7-day notice, fine ranges, 5-year retention, article references). None of these were checked or edited in this job.
- Sentence-variety check (`variety_metrics.py check`, run 2026-10-12 because the house rule asks for it on every column edit): draft-ko passes (0 FAIL, one WARN on 「니다.」 endings). draft-en has 3 FAIL (len_cv=0.33, short_share=0.011, top_opener_n=5) and draft-zh-hant has 3 FAIL (len_cv=0.34, short_share=0.024, consec_same_start=4). orig-en and orig-zh-hant give exactly the same figures, so these are properties of the live text, not of this fix (which changes three URL characters and lastmod). They were left alone: correcting them means rewriting prose, which a fact fix must not do.

## Changes

- ko (draft-ko.md): sources list, Invest Taiwan entry — `…showPage?lang=jpn&search=InvestmentStatus01` → `…showPage?lang=cht&search=InvestmentStatus01`; label 「Invest Taiwan 외국인투자 개요」 unchanged. lastmod already "2026-10-12" in the live file, so it stays "2026-10-12". No other change.
- ja (draft-ja.md): no change (already correct). lastmod stays "2026-10-06".
- en (draft-en.md): sources list, Invest Taiwan entry — `…showPage?lang=jpn&search=InvestmentStatus01` → `…showPage?lang=eng&search=InvestmentStatus01`; label "Invest Taiwan Overview of Foreign Investment" unchanged. lastmod "2026-07-25" → "2026-10-12". No other change.
- zh-hant (draft-zh-hant.md): sources list, Invest Taiwan entry — `…showPage?lang=jpn&search=InvestmentStatus01` → `…showPage?lang=cht&search=InvestmentStatus01`; label 「投資台灣入口網外國人投資說明」 unchanged. lastmod "2026-07-25" → "2026-10-12". No other change.

No body prose, FAQ, summary, heading, number or article reference was changed in any language.
