# WO-I18N-EN-COL017 — Taiwan Logistics and Motor Freight Carrier Licensing

Date: 2026-07-25 KST  
Manager: Codex `/root`

## Objective

Replace the abbreviated and unsafe English version of column 017 with a
complete U.S.-English legal guide. Preserve the legal meaning, qualifications,
and information density of the independently reviewed Korean and Japanese
versions:

- `src/content/columns/017-taiwan-logistics-business-setup.md`
- `src/content/columns-ja/017-taiwan-logistics-business-setup.md`

Do not translate sentence by sentence. Produce natural professional prose for a
foreign investor or in-house counsel evaluating operations in Taiwan.

## Allowed files

1. `src/content/columns-en/017-taiwan-logistics-business-setup.md`
2. `src/lib/__tests__/columns-en-investment-017.test.ts` (new)

The worker may modify only these two files. Do not touch embeddings, assets,
other locales, or shared code. Do not stage, commit, push, deploy, or operate a
server.

## Frontmatter

- Title/H1:
  `Taiwan Logistics Businesses and Motor Freight Carrier Licensing: Formation, Acquisition, and Outsourcing`
- Preserve the source URL, `September 13, 2025`, category
  `Taiwan Company Formation`, and featured-image path.
- Set `lastmod: "2026-07-25"`.
- Calculate `read_time` from the final visible English body at 200 words per
  minute, rounded up, formatted exactly as `N min read`; lock the same formula
  in the test.
- Add the following four FAQ entries in order. Each answer must be repeated
  verbatim as the first paragraph immediately following its numbered heading.

### FAQ 1

- Heading:
  `## 1. When a Logistics Business Is a Regulated Motor Freight Carrier`
- Q:
  `Does every logistics-related business in Taiwan need a motor freight carrier license (汽車貨運業)?`
- A:
  `Not necessarily. “Logistics” is a broad business term, so a company’s name or registered business activities do not by themselves determine whether a license is required. A company may fall within Taiwan’s regulated motor freight carrier category if it transports other parties’ goods by motor vehicle for compensation. Warehousing, packing, systems operations, shipping one’s own goods, and freight forwarding or other transportation-intermediary services require a fact-specific analysis of the contracts, transportation responsibility, compensation structure, and actual vehicle operations.`

### FAQ 2

- Heading:
  `## 2. Forming a New Motor Freight Carrier Business`
- Q:
  `What capital, vehicle, and procedural requirements apply to a new general motor freight carrier business?`
- A:
  `As a general rule, a new motor freight carrier business must have at least NT$25 million in capital and at least 20 new freight trucks. A business limited to household-goods moving is subject to the separate thresholds of NT$10 million and at least eight new freight trucks. A carrier operating in Kinmen or Lienchiang (Matsu) is subject to the separate thresholds of NT$10 million and at least five new freight trucks, together with geographic operating restrictions. A narrowly defined individual small-truck carrier route has separate requirements, including one personally owned small truck no more than two years old, the appropriate occupational driver’s license, and household registration within the competent authority’s jurisdiction. Foreign-investment review, Ministry of Transportation and Communications approval, establishment-preparation approval (籌設許可), company or business registration, vehicle and facility preparation, the operating license, and trade-association membership must be analyzed as distinct requirements.`

### FAQ 3

- Heading:
  `## 3. Acquiring an Existing Carrier`
- Q:
  `Does acquiring a licensed company automatically transfer its motor freight carrier license to the buyer?`
- A:
  `No. In a share acquisition, the buyer does not acquire or receive a transfer of the license; the target company remains the same legal entity and continues to hold its license. In a business or asset acquisition, the target’s license does not automatically pass to the buyer. Counsel should verify the license’s validity and authorized scope, vehicles and commercial license plates, parking facilities, trade-association membership, violations and unpaid liabilities, insurance, liens, and change-of-control clauses, and should identify the required foreign-investment approvals and highway authority approvals or change filings.`

### FAQ 4

- Heading:
  `## 4. Outsourcing Transportation and Foreign-National Work Authorization`
- Q:
  `If our company outsources the actual transportation to a licensed Taiwanese carrier, do we avoid both carrier licensing and work-permit requirements?`
- A:
  `There is no categorical answer. The analysis depends on whether the outsourcing company is acting as the shipper or a transportation intermediary, or instead contracts as the carrier and receives the freight charge directly. Verify the contractor’s operating license and commercial vehicles, and align the contract with actual operations so the arrangement does not become license lending or unlicensed carriage. Shareholder or investor status also does not by itself authorize work in Taiwan. A foreign national who will work or manage operations in Taiwan should determine the applicable work-permit requirements and immigration status before beginning those activities.`

## Body contract

Localize all four numbered sections, subheadings, lists, official resources,
disclaimer, and author line from the corrected Korean source. The final body
must cover:

- A substance-over-form analysis based on contracts, compensation,
  transportation responsibility, dispatch, vehicles, and drivers; distinguish
  warehousing, packing, systems, forwarding, shipment of the company’s own
  goods, and compensated carriage of other parties’ goods.
- Under Highway Act Article 3, the central highway authority is the Ministry
  of Transportation and Communications (MOTC); the Directorate General of
  Highways and its offices provide application and administrative guidance.
- General carrier NT$25 million/20 new trucks, moving-only NT$10 million/eight,
  Kinmen-Matsu NT$10 million/five plus geographic limits, and the narrow
  individual small-truck route.
- State the one-year limitation narrowly:
  `For a newly established motor transportation enterprise, commercial vehicle plates issued to its vehicles may not be surrendered for deregistration (繳銷) or transferred through a change in registered vehicle ownership (過戶轉讓) during the first year after issuance.`
  Do not describe it as a total ban on selling or disposing of 20 trucks.
- A non-ROC national or legal entity investing in a motor freight carrier must
  first obtain MOTC approval under Highway Act Article 35.
- Use the current name `Department of Investment Review, Ministry of Economic
  Affairs (MOEA)`. Explain that listed or OTC securities, foreign-company
  branches, science or industrial parks, and Mainland Area investment may
  follow different routes.
- Sequence: define operations and investment route → foreign-investment and
  sector approvals → establishment-preparation approval → registrations and
  facilities/vehicles/insurance/organization → operating license,
  trade-association membership, and commencement.
- Require ownership or use-right evidence for the applicable approved parking
  facilities without claiming that every operator must lease a dedicated lot.
- Distinguish the general six-month preparation period, an additional extension
  of up to six months for special circumstances, and the general one-month
  commencement period after licensing. State that the operator submits the copy
  of a valid membership certificate issued by the relevant trade association to
  the competent highway authority.
- Distinguish share acquisitions from business or asset transfers. A remittance
  for shares is the purchase price, not paid-in capital. Separate investment
  amount verification (投資額審定), corporate changes, and highway-authority
  approvals or filings.
- Explain Motor Transportation Enterprise Regulations Article 23 approvals for
  a business transfer and changes to organization, name, address, responsible
  person, capital/assets, and parking facilities.
- Due diligence covers license, authorized scope, vehicles/plates, parking,
  association status, violations/unpaid liabilities, employment, insurance,
  liens, material contracts, and change-of-control clauses.
- Outsourcing terms cover license lending/unlicensed carriage, service levels,
  cargo loss, insurance, subcontracting, data, indemnity, and transition risks
  on termination.
- Separate investment approval, work authorization, and immigration status.
  Unauthorized work may lead to fines and an order to leave; current NIA
  directions generally provide a three-year entry-bar period but include waiver
  or shortening conditions. Do not imply that a report mechanically triggers
  the result.
- Preserve both images and the same 15 official URLs used in the Korean source.
- Use exactly these three internal links:
  - `/en/services#investment`
  - `/en/lawyers/wei-tseng`
  - `/en/contact`
- End with a neutral educational-purpose disclaimer and:
  `**Wei Tseng (曾雋崴), Taiwan Attorney**`

## Forbidden content

- `Coupang`
- `Investment Commission`
- `all foreign investment`
- `hold the 20 trucks for one year`
- `no concern about obtaining`
- `Remit capital`
- `company transfer`
- `outsourcing volume`
- `least investment and smallest risk`
- a direct causal claim from being reported to a three-year entry ban
- unsupported client, engagement, success, order, matching, or accounting claims
- Hangul, kana, `/ko/`, `/ja/`, `/zh-hant/`, or `曾俊瑋`
- translationese such as `automobile freight transport business`,
  `preparatory establishment permit official document`, or `apply for filing`

Traditional Chinese statutory terms in parentheses and official source labels
are permitted.

## Verification

The new test must assert the exact frontmatter; the four FAQs and corresponding
first body paragraphs; all required legal qualifications; 15 official URLs;
three internal links; two images; author; forbidden-string absence; sufficient
English length; canonical/alias slug; and the final 200-wpm read-time formula.

Manager gates:

1. Focused Vitest: new test + JA 017 + columns FAQ/content regressions
2. typecheck, scoped ESLint, diff-check
3. Playwright at 1440×1000 and 390×844: HTTP 200, `lang=en`, exact
   H1/canonical, four FAQ JSON-LD entries, flag links, no Hangul/kana leakage,
   no console/page errors, and no horizontal overflow

Regenerate embeddings only after all source-locale corrections are complete.

