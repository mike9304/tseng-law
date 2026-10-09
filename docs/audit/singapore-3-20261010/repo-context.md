# Singapore column research: repository and firm context

Checked 9 October 2026 (Asia/Taipei). Read-only repository exploration; no repository files, Git state, services or releases were changed. This is a research report, not a task registry or publication approval.

## Repository state and protected lanes

- Canonical `/Users/son7/Projects/tseng-law` resolves to `/Users/son7/projects/tseng-law`. HEAD: `54b6d0e0` (`content(issues): replace 20261002 placeholder images with generated photos`). Its English content is behind the live corpus, ending at 069; do not use it alone for duplicate detection.
- Canonical dirty tracked files at inspection: `src/app/[locale]/columns/[slug]/ColumnDetail.module.css`, that route's `page.tsx`, `src/app/globals.css`, `src/components/ColumnsGrid.tsx`, `src/components/RecommendedForYou.tsx`, `src/components/semiconductor-drafts/SemiconductorGuidePublic.tsx`, `src/lib/builder/columns/storage.ts`, `src/lib/column-list-items.ts`, `src/lib/column-post.ts`, `src/lib/columns.ts`, `src/lib/consultation/columns-blob-reader.ts`, `src/lib/semiconductor-public.ts`, `src/lib/seo.ts`, `vitest.config.ts`. Untracked: `public/images/blog/semiconductor-v16/`, `src/components/__tests__/column-optional-image.test.tsx`, `src/lib/consultation/__tests__/columns-file-storage-integration.test.ts`. These belong to other work; preserve them.
- Current content comparison worktree: `/Users/son7/Documents/Codex/2026-10-08/new-chat/work/tseng-publication-20261008`, HEAD `6ada7c2304c01ca6a621a943d07c22144b763b55`, commit title `Publish 15 Taiwan AI and semiconductor law columns for four markets`. Clean at inspection. It contains 143 English articles.
- Current task is separate Singapore drafts only. Do not number/integrate/publish them against stale canonical content. Root coordinates unrelated active revision lanes.

## Editorial and metadata rules

Read full canonical `AGENTS.md` and `docs/columns/EDITORIAL-VOICE.md`, plus the current `tseng-law-editorial` skill. The publication worktree contains a newer editorial policy; its diff against canonical changes only public AI attribution policy, not voice standards.

- Lead with an actual fact, issue or legal distinction. Delete a dispensable opening sentence; test the first two paragraphs sentence by sentence. Do not force a scene, three-part checklist, FAQ or promotional ending on every article.
- No decorative bold: `**`, `__`, `<strong>`, `<b>` are prohibited in columns.
- Compare the opening, headings and ending with three recent English articles. Record actual edits, reasons and preserved legal meaning.
- Preserve legal strength, conditions, exceptions, numbers, dates and claim/source relationships. Do not manufacture cases, clients, victories, attorney experience or review credentials.
- Current public policy: preserve internal `author: "legal-ai-assistant"` and provenance; do not append public AI author/profile/footer text or invent an attorney byline. Preserve any required AI media notice. An AI editorial review is not a native-speaker or licensed-attorney certification.
- Wei Tseng is a Taiwan attorney and partner. No Singapore legal qualification, Singapore office or Singapore-law service was verified.
- Current English metadata commonly includes `title`, `seoTitle`, `summary`, `published`, `lastmod`, `date_display`, `read_time`, `categories: ["Taiwan Legal Information"]`, `topic`, `tags`, `audience: ["en"]`, `author: "legal-ai-assistant"`. Some files use explicit `slug`; others derive it from the numbered filename. `faq`, media metadata and a repeated H1 vary and are not mandatory. The most recent 493/494 omit media and body H1. New task deliverables should be clearly labelled unpublished drafts; use proposed metadata rather than asserting publication.
- Source/review dates and a tailored general-information disclaimer belong in the article. A source date does not imply publication.

## Three recent English comparators

Base directory for all three: `/Users/son7/Documents/Codex/2026-10-08/new-chat/work/tseng-publication-20261008/src/content/columns-en/`.

1. `494-us-buyer-taiwan-ai-chip-startup-investment-approval-closing.md`, 9 October 2026, “Buying a Taiwan AI-Chip Startup: Investor Status and the Closing Date.” Opening immediately states prior application for small private-company investments, then distinguishes incorporation from investor classification. Headings cover cap table/control, transaction matching, merger separation and agreement allocation. Ending asks for a brief nonconfidential Taiwan consultation and expressly separates US advice. This is a strong substantive overlap with the proposed Singapore investor-classification article.
2. `493-us-ai-chip-taiwan-packaging-capacity-prepayment-refund.md`, 9 October 2026, “Prepaying for Taiwan Advanced Packaging: Capacity, Delivery Dates and Refunds.” Opening distinguishes equipment time, production start and tested-chip delivery; second paragraph limits Taiwan-law conclusions to obligations governed by it. Headings follow capacity, payment allocation, delay and preserved records. Ending offers a restrained nonconfidential inquiry and arrangements for documents. Avoid mechanically reusing its four-section contract-checklist architecture.
3. `412-taiwan-short-sentence-fine-community-service-suspension.md`, 8 October 2026, “A short Taiwan prison sentence: payment, service or suspension.” Many 8 October articles tie for publication date; 412 is first among the criminal listings and the home page feature. Opening explains the precise judgment wording and prosecutorial decision, followed by judgment-versus-summons distinction. Headings follow conversion, execution office, community service and suspension. Ending gives a document-preservation action, without a promotional CTA.

Live evidence: `https://tseng-law.com/en/columns` opened successfully on 9 October and shows both 493/494 under Company setup & investment with 9 October dates, and 412 under Criminal litigation with 8 October date. The live home page also shows 412. Direct web-tool fetches of those three article-detail URLs timed out. Exact body comparisons therefore use the above published-worktree files, while live listing titles/dates are verified. Do not claim current live body parity from this limited check.

## Overlap map and topic implications

There is no Singapore-targeted English article in the current 143-file corpus. The only literal Singapore occurrence is an incidental export-diversion hypothetical in 136. Absence of a country-targeted title does not make generic legal content new.

| Candidate | Existing closest article | Implication |
|---|---|---|
| Taiwan supplier changed-bank payment fraud | `142-taiwan-supplier-bank-account-change-bec.md`, 3 October; live `https://tseng-law.com/en/columns/taiwan-supplier-bank-account-change-bec` read successfully | Already covers callback verification, Civil Code 309/310 discharge, second payment demand, bank recall, Taiwan report and original email evidence. Replacing US reporting channels with Singapore channels alone is a weak new article. Root paused/reconsidered this topic. |
| Singapore award / Taiwan assets | `351-enforcing-us-arbitral-award-in-taiwan.md`, 7 October | Already covers Arbitration Act 47–52, awards vs judgments, documents, reciprocity, due process and contract-stage forum choice. A new article should solve actual Singapore pre-signature clause/seat/SIAC decisions and Taiwan assets, not rebrand the US enforcement primer. |
| Singapore vehicle / Taiwan investor classification | `494-us-buyer-taiwan-ai-chip-startup-investment-approval-closing.md`, 9 October | Already covers >30% OR control, upstream chain, Ministry interpretations, documents, prior approval and separate merger filing. SG-specific ACRA records versus required upstream/control evidence and documentary preparation can differentiate; AI-chip acquisition/closing repetition cannot. |
| Singapore distributor termination | `353-terminating-taiwan-distributor-us-exporter.md`, 7 October | High overlap: unpaid invoices, notice, stock, warranty, customer data, trademark register and forum choice are all covered. |
| Singapore executor / grant of probate | `092-taiwan-bank-inheritance-us-power-of-attorney.md` and `234-us-living-trust-will-taiwan-property.md` | Moderate overlap: authority of executor/heir/beneficiary/agent, Taiwan bank release, will/executor disputes, authentication, tax and title already covered. A narrow, evidenced SG grant/authentication route may be new. |
| ASTEP preferences for Singapore exports into Taiwan | `381-taiwan-import-duty-business-tax-commodity-tax-foreign-supplier.md`, 382 customs valuation, 383 FTZ | Strongest topical gap among alternates. No ASTEP mention in current EN corpus. 381's trade-agreement discussion concerns the US initiative, not Singapore origin preferences. Must verify official origin rules and truthful Taiwan contract/service scope; do not imply the firm offers unverified customs-broker services. |

## Confirmed three-article selection

Root confirmed three unpublished Singapore articles: (1) pre-signature Singapore dispute-clause choices where Taiwan assets may be needed for recovery; (2) Singapore corporate records, upstream ownership and approval-aligned capital remittance for a new Taiwan subsidiary; (3) Singapore goods into Taiwan and ASTEP origin conditions. The existing payment-fraud topic was replaced before drafting with ASTEP; no fraud or probate article belongs in this package.

The distinction from articles 351 and 494 must remain substantive in the final texts: Singapore clause choices before a dispute, and establishment/funding records before remittance, respectively. ASTEP is the clearest new corpus topic. An absence of overlap is a content observation, not a traffic prediction.

## Current firm and consultation facts

Sources opened on 9 October 2026: `https://tseng-law.com/en`, `https://tseng-law.com/en/contact`, `https://tseng-law.com/en/services`.

- The live English pages identify Hovering International Law Firm and Attorney Wei Tseng as a Taiwan attorney/partner.
- Taiwan investment/company setup, civil contract disputes and unpaid invoices, employment, cross-border family/inheritance, criminal cases and IP/financial disputes are public service areas. The home also identifies residence and tax/accounting assistance. These support Taiwan-side legal analysis, not invented Singapore-law advice or customs brokerage.
- English consultations are offered in Taipei or via Zoom/Google Meet. The firm also lists Chinese, Korean and Japanese, but not guaranteed Malay or Tamil consultation service.
- Official contact email: `wei@hoveringlaw.com.tw`; public contact route: `https://tseng-law.com/en/contact`.
- The current contact page requests a brief issue overview, Taiwan connection, deadline and contact details for the initial inquiry, excluding sensitive information. Preferred CTA: briefly describe the issue/deadline, then agree with the attorney how documents should be provided. Do not copy older column CTAs that tell readers to send passports, cap tables or complete case files into the general form immediately.
- No promise of intake acceptance, outcome, recovery, automatic appointment or free case-specific advice is supported. Do not state Singapore office, Singapore-law licensure or Singapore client track record.

## Evidence limits

No search-console/analytics data was accessed; the user's Singapore exposure observation is treated as supplied context. Search results and corpus gaps do not establish search volume, ranking, demand or conversion. This report does not verify legal propositions in existing articles; writers and independent legal review must open current official sources. No repository integration, tests, build, deployment or publication was requested or performed for this research.

Memory quick pass used `MEMORY.md` lines 115–125 to locate the known preservation policy and canonical editorial rules, then verified current files and live services rather than relying on historical release claims. Relevant historical IDs: `01a0fd9e-4fb7-7710-a095-b3a75eae5929`, `01a10169-8632-72c2-aea0-63c905035c9f`.
