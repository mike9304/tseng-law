# ISSUE-20261017 — local editorial audit

Date: 2026-10-17 (Asia/Seoul). Scope: eight news-led drafts and their image disclosures. This records AI author/reviewer work, not human native-speaker or lawyer certification. The operator’s separate Claude Code shipping gate remains required. No commit, push or publication was performed.

The full EDITORIAL-VOICE.md was read by authors and independent locale reviewers. The records below summarize actual sentence deletion tests and comparisons in the lane’s `work/{locale}-locale-review.md`; source claims were checked against opened original news and MOJ LawSingle pages.

## Meaning and wording repairs

| Piece | Original wording / issue | Final correction and reason | Meaning treatment |
| --- | --- | --- | --- |
| ko-01 FAQ | “노동능력을 잃거나 줄고 생활상 필요한 지출이 늘어난 경우” | “노동능력을 잃거나 노동능력이 줄어든 경우, 또는 생활상 필요한 지출이 늘어난 경우” | Substantive correction: restores Civil Code 193 alternatives rather than cumulative conditions. |
| ko-01 opening | Graphic head-laceration wording | “남성이 머리를 다쳤다고” | Preserves injury, actor, place, date and source; unnecessary medical detail removed. |
| en-05 | Enterprise described as holding the securities | Enterprise decides to invest the fund; the fund holds the securities. | Substantive correction to Article 77’s actor and restricted period. |
| en-06 P2 | Three consecutive sentences repeated the absence of filing evidence. | One sentence retains both missing filing and disclosure records. | Preserves the limit on what the news establishes. |
| ja-04 ending | Setting a shipment date was said to make evidence unavailable. | Removed that unsupported causal claim; retained concrete species/collection-record requirements. | Removes an unsupported assertion without reducing statutory conditions. |
| vi-08 summary/body | “không làm nghĩa vụ này biến mất”; “chỉ đến” | “nghĩa vụ này vẫn áp dụng khi thẻ ARC còn hạn”; “dẫn đến” | Reviewer-proposed language-only edits; trigger, deadline and recipient unchanged. |
| ko/ja/en images | Frontmatter caption alone is not rendered in these issue-page locales. | Added one localized public AI-image disclosure in each body; retained caption metadata. | Fictional imagery is disclosed without adding a public AI-author footer. |

## First two paragraphs and recent same-language comparisons

### ko

Comparators: the actual opening two paragraphs, headings and last substantive paragraph were read.

- `src/content/issues/ko/ISSUE-20261016-02-taiwan-nicotine-free-e-cigarette-entry-ban.md` (2026-10-16).
- `src/content/issues/ko/ISSUE-20261016-01-taiwan-kuo-kuang-bus-cancellation-passenger-delay-claim.md` (2026-10-16).
- `src/content/issues/ko/ISSUE-20261015-02-taiwan-motorcycle-plate-angle-proposal-current-rules.md` (2026-10-15).

ko-01 — `src/content/issues/ko/ISSUE-20261017-01-taiwan-beitou-falling-facade-owner-liability.md`

Opening excerpt: “타이베이 베이터우구에서 10월 16일 주택 외벽의 타일이 떨어져 지나가던 남성이 머리를 다쳤다고 중앙통신사(CNA)가 보도했습니다. 시 건축…”

P1 identifies the dated Beitou injury and administrative fine. P2 distinguishes that fine from a Korean reader’s compensation claim and preserves the absence of a civil judgment. Each sentence adds an event fact, actor, amount or legal distinction.

Reviewed file SHA-256: `14a4d0a4a2db50bd57d3777f857e2e33827f55a1e737bef164310454cd2263f3`.

ko-02 — `src/content/issues/ko/ISSUE-20261017-02-taiwan-election-online-betting-foreign-residents.md`

Opening excerpt: “중앙통신사(CNA)는 10월 16일, 해외 예측 플랫폼에서 대만 지방선거 결과에 스테이블코인을 건 이용자를 난터우 검찰이 수사하고 있다고 보…”

P1 identifies the reported investigation, location of use and absence of conviction. P2 identifies the Korean reader’s Taiwan-presence condition and the statute’s conduct-based scope, without treating a platform name as decisive.

Reviewed file SHA-256: `65aece5fe441d63003d650b0d963c0c28030be57037c61ed2027a798f857f3d3`.

Comparison result: The bus comparator also distinguishes an administrative fine from a private claim, but the new article applies structure-owner liability and medical evidence rather than carrier delay. The betting piece uses territorial criminal jurisdiction rather than product classification or a draft traffic rule.

### ja

Comparators: the actual opening two paragraphs, headings and last substantive paragraph were read.

- `src/content/issues/ja/ISSUE-20261016-04-taiwan-ceatec-sale-by-sample-quality-japanese.md` (2026-10-16).
- `src/content/issues/ja/ISSUE-20261016-03-taiwan-forklift-road-permit-japanese-factories.md` (2026-10-16).
- `src/content/issues/ja/ISSUE-20261015-04-taiwan-public-procurement-software-origin-declarations-japanese.md` (2026-10-15).

ja-03 — `src/content/issues/ja/ISSUE-20261017-03-taiwan-food-tasting-samples-import-inspection.md`

Opening excerpt: “沖縄県は10月15日、台北のレストランで食材と工芸品を紹介する催しを開きました。フォーカス台湾の16日付報道によると、現地のシェフやバイヤーらが、沖縄の器に…”

P1 supplies the October 15 event, October 16 report and the limit of what it says about import procedures. P2 introduces the announced-product inspection rule and sample-import question. Neither paragraph promises a checklist or assumes noncompliance.

Reviewed file SHA-256: `d13136450bdbc1b3ca04d542588ef13d4ef1ce0594bdab217bdcb03864ed9716`.

ja-04 — `src/content/issues/ja/ISSUE-20261017-04-taiwan-museum-insect-specimens-import-permits.md`

Opening excerpt: “日本の昆虫収集家が、台中の国立自然科学博物館に2万5千点を超える標本を寄贈したと、フォーカス台湾が10月16日に報じました。15日には記念式典が開かれていま…”

P1 distinguishes the donation/ceremony dates from the unknown transport dates. P2 preserves the collection-data facts and the absence of species-by-species permit findings. These qualifications prevent an allegation about the donor.

Reviewed file SHA-256: `085425ad8ca50241cd5e25adf4e8f9e9d394bed0aa94e808f6b47e8704eefd64`.

Comparison result: The current articles concern food inspection exemptions and protected-specimen imports. Earlier pieces concern a forklift on public roads, quality promised by a display sample, and procurement origin statements. The news-first opening is retained, while the legal questions and endings differ.

### en

Comparators: the actual opening two paragraphs, headings and last substantive paragraph were read.

- `src/content/issues/en/ISSUE-20261016-06-taiwan-shares-offshore-collateral-pledge-creation.md` (2026-10-16).
- `src/content/issues/en/ISSUE-20261016-05-taiwan-3m-private-placement-share-resale-restrictions.md` (2026-10-16).
- `src/content/issues/en/ISSUE-20261015-06-taiwan-hiring-public-judgments-criminal-record-data.md` (2026-10-15).

en-05 — `src/content/issues/en/ISSUE-20261017-05-taiwan-fund-manager-personal-trades-reporting.md`

Opening excerpt: “Taiwan's Financial Supervisory Commission (FSC) is reviewing restrictions on i…”

P1 identifies an ongoing FSC review, with no adopted relaxation or commencement date. P2 connects that status to recruitment by an international Taiwan investment-trust employer and the distinct family-reporting scope.

Reviewed file SHA-256: `d9cdcdfba29b818af170e00b2df4c2ad578e63ac0445ee4a238e1996b76c46b1`.

en-06 — `src/content/issues/en/ISSUE-20261017-06-taiwan-techcrunch-demo-patent-grace-period.md`

Opening excerpt: “About fifteen Taiwan startups exhibited at TechCrunch Disrupt in San Francisco…”

P1 supplies the conference report and the US investor/Taiwan patent question. P2 was reduced from three repeated caveats to one sentence retaining the missing filing and disclosure records; removing it would imply the report determines exhibitors’ patent rights.

Reviewed file SHA-256: `7ebda5e4e448ae44253c73b68428829daf6153926b9fb9136ac020d5a1126d76`.

Comparison result: The comparison files concern securities collateral, resale restrictions and criminal-record data in hiring. The new conclusions concern fund decision recusals and technical support in a patent application. No shared imperative checklist or promotional ending was imposed.

### vi

Comparators: the actual opening two paragraphs, headings and last substantive paragraph were read.

- `src/content/issues/vi/ISSUE-20261016-08-taiwan-vietnam-remittance-license-cash-exchange-robbery.md` (2026-10-16).
- `src/content/issues/vi/ISSUE-20261016-07-taiwan-migrant-side-job-work-permit-penalty-proposal.md` (2026-10-16).
- `src/content/issues/vi/ISSUE-20261015-08-taiwan-unemployed-parents-student-living-assistance.md` (2026-10-15).

vi-07 — `src/content/issues/vi/ISSUE-20261017-07-taiwan-naturalized-residents-local-election-voter-eligibility.md`

Opening excerpt: “Bản tin ngày 15/10 của Cơ quan Di trú Đài Loan cho biết cơ quan này đã phối hợ…”

P1 identifies the NIA report and the specific mock-voting activities. P2 separates marriage/ARC from citizenship and citizenship from household-registration eligibility. This is neutral procedure, with no candidate or turnout persuasion.

Reviewed file SHA-256: `02653c28ada16e0ee38804a2d132621396b7819e95efb3de20208e7cb8ba768b`.

vi-08 — `src/content/issues/vi/ISSUE-20261017-08-taiwan-vietnamese-students-arc-address-change.md`

Opening excerpt: “Tại buổi hướng dẫn ở Đại học Quốc lập Đài Bắc ngày 14/10, Cơ quan Di trú nhắc …”

P1 distinguishes the October 14 session from the October 15 report and identifies the deadline/penalty. P2 identifies a student move despite an unexpired ARC and separates university records from NIA registration.

Reviewed file SHA-256: `f595c0a39102a003afa626e1d7a83f7e305f04aab9e5feba2f5f93c735afe943`.

Comparison result: Earlier pieces concern remittance providers, outside-work permits and parents’ student support. The new articles concern voter registration and a student’s own address duty, without copying proposal-versus-current-law framing or benefit application lists.

## Evidence limits and handoff

Detailed source, author and independent reviewer records are under `/Users/son7/tseng-air-1011/lanes/issues/20261017/work/`. `SOURCES.md`, `NOTES.md`, `queue.tsv` and `tests.txt` are outside the repository in the lane directory. Body lengths, asset hashes and final automated checks are recorded there. No judgments, consultations, human credentials or case outcomes were invented.

Generated images are fictional, contain no text/logos/identifiable people and were visually inspected before WebP/JPG conversion. The same image supplies each social rendition. Local development preview encountered the environment’s EMFILE watcher limit and was stopped; generated configuration changes were restored. No browser/rendered-page or production QA success is claimed.
