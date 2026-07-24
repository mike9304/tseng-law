# WO-I18N-JA-COL015 — Correct Japanese Taipei business-location guidance

Date: 2026-07-24 KST
Owner: delegated implementation worker
Manager: Codex `/root`

## Goal

Rewrite the Japanese Taipei business-location column for the comprehensive
place-of-business prior-review system effective from 2023-01-01. Remove the
stale claim that only listed “active inquiry” industries must be checked.
Preserve the slug, source URL, publication date, category, featured image, and
`img-01.jpg`; remove the obsolete `img-02.jpg` reference. Embedding
regeneration remains deferred.

## Allowed files

1. `src/content/columns-ja/015-taiwan-company-setup-pitch-location.md`
2. `src/lib/__tests__/columns-ja-investment-015.test.ts` (new)

No other edits. Do not edit embeddings, stage, commit, push, deploy, or operate
the development server.

## Frontmatter

- Title: `台湾会社設立：営業場所の選び方と台北市の事前照会`
- Preserve source URL, publication/display date, category, and featured image.
- Set `lastmod` to `2026-07-24`.
- Set `read_time` to `約6分`.
- Add exactly five FAQ entries and repeat each exact answer as the immediate
  first paragraph of its matching numbered body section.

FAQ contracts:

1. `台北市では、特定の業種だけが営業場所の事前照会を行えばよいですか？`

   `いいえ。台北市の現行案内では、2023年1月1日から、会社・商業（分公司・分支機構を含む）の設立、所在地移転または営業項目追加の登記を申請する場合、営業場所と営業項目が土地使用分区および建築管理規定に適合するかを事前に照会し、適合する照会結果を登記申請に添付する運用です。旧来の「主動查詢」対象業種の一覧だけで要否を判断しないでください。`

2. `営業場所事前照会には、どの建物資料が必要ですか？`

   `台北市の現行システムでは、原則として発行後3か月以内の建物登記謄本（第二類を含む）または建物所有権状を提出し、住所、階数、面積等を確認できるようにします。建物用途が「住宅を主とし事務所を兼ねる」場合等には、誓約書や土地使用分区証明などの追加資料が必要となるため、物件と用途に応じた最新の必要書類を確認してください。`

3. `賃貸住所、借址登記、バーチャルオフィスを会社住所に使えますか？`

   `名称だけで一律に使用可否を判断することはできません。賃貸借契約書、所有者の同意と所有権資料等により住所を使用する権限を示し、公式通知を受け取れる実態を確保したうえで、台北市の営業場所事前照会と実際の使用状況に関する規制を確認します。登記住所と実際の営業場所が異なる場合も、実際の場所について土地使用、建築、消防、衛生その他の要件を別途満たす必要があります。`

4. `事前照会で適合となれば、その場所で直ちに営業できますか？`

   `いいえ。事前照会は、営業場所と営業項目について土地使用分区および建築管理規定への適合性を確認する手続です。賃貸人の権限・賃貸借条件、消防、衛生、環境、看板、食品事業者登録、業種別許認可その他の要件をすべて承認するものではありません。会社・商業登記と営業開始までに別途必要な手続を確認してください。`

5. `事前照会の処理期間と結果の有効期間はどのくらいですか？`

   `台北市の行政作業基準には、通常案件は5日（暦日）、外部機関への照会が必要な案件は11日（暦日）という処理目標がありますが、補正、申請件数その他の事情により変わり得るため完了日の保証ではありません。現行ポータルでは、照会結果は審査完了日から6か月間有効と案内されており、期間を過ぎた場合は再申請が必要です。`

## Body requirements

- Introduce Taipei restaurant use only as an example; distinguish other local
  governments and industry rules.
- Use current name `営業場所事前照会` / source term `營業場所預先查詢`.
- Explain the 2023-01-01 comprehensive prior review accurately.
- Explain that the current administrative rule still lists certain
  `随案主動查詢` items, including restaurant and other food-service categories,
  but that list does not restore the old rule that only listed industries need
  prior review.
- Explain current portal sequence:
  1. identify the exact address, floor, and planned business items;
  2. obtain current building documentation;
  3. submit the prior inquiry;
  4. attach a compliant result to establishment/relocation/business-item-addition
     registration;
  5. separately complete any industry permits and site preparations.
- Explain that if no result is attached, current Taipei guidance says the
  applicant will be asked by guidance letter to supplement it before the
  registration proceeds.
- State that an incompatible result requires changing the site or removing the
  incompatible business item as applicable; do not say registration is always
  automatically refused without qualification.
- Describe official transcript channels neutrally: Taipei land offices or
  convenience workstations, official online electronic transcript systems, and
  other current official channels. Do not require a lawyer or acquaintance.
- Explain that a single inquiry accepts up to five business items and that the
  current Taipei FAQ directs applicants to select their principal business
  items for review. Distinguish this guidance from the point-5
  `随案主動查詢` fallback; do not require every additional item to be filed in
  a separate inquiry without official support.
- Explain the `随案主動查詢` fallback: if a point-5 listed item appears in the
  registration but not in the submitted result, the Department of Commerce
  initiates the inquiry. Do not present the point-5 list as the only class that
  needs prior review.
- Explain lease/owner documentation and actual use:
  - LLC registration materials may use a lease copy or owner consent plus
    ownership proof;
  - that proves address-use authority, not legal suitability for every activity;
  - do not categorically approve or reject borrowed/virtual addresses;
  - an actual operating site must separately comply with zoning, building,
    fire, health, and industry requirements;
  - for `住宅を主とし事務所を兼ねる` cases, describe the additional declaration
    and zoning proof and current actual-use proportions (residential over
    three-fifths, office under two-fifths).
- Explain the official five-/eleven-calendar-day administrative targets with
  explicit non-guarantee language and the current six-month result validity.
- Preserve only these two image paths:
  - featured image
  - `img-01.jpg`
- Remove the obsolete, unreadable `img-02.jpg` body reference.
- Remove the broken fragment `後で`.
- Use `曾雋崴`.

## Sources and closing

Official links:

- current Taipei prior-inquiry portal:
  `https://www.businesslocationinfo.gov.taipei/BLBQS/Home/Notice`
- current Taipei operating directions:
  `https://laws.gov.taipei/Law/LawSearch/LawArticleContent/FL080687`
- Taipei comprehensive-review FAQ:
  `https://www.gov.taipei/News_Content.aspx?n=EEC70A4186D4C828&s=E70ACC80BEEC5910&sms=87415A8B9CE81B16`
- current administrative SOP:
  `https://laws.gov.taipei/Law/SOPSearch/DownloadFile?sop_no=P04020118.pdf`
- MOEA LLC address-document checklist:
  `https://gcis.nat.gov.tw/F/t70044_p`
- TFDA food-business registration announcement:
  `https://www.fda.gov.tw/tc/newsContent.aspx?id=11672`

Safe internal links:

- `/ja/services#investment`
- `/ja/columns/taiwan-company-establishment-advanced-1`
- `/ja/contact`

Use neutral educational disclaimer copy and no response-time promise.

## Forbidden

- `法人登記`
- claim that only `主動查詢対象業種` must inquire
- `会社登記時にすべての業種を照会する必要はありません`
- `主動查詢対象業種.*場合にのみ`
- old implication that inquiry is merely recommended for non-listed industries
- unconditional claim that an incompatible result always means registration is
  refused
- claim that prior inquiry alone authorizes restaurant operation
- required lawyer/acquaintance assistance
- categorical `バーチャルオフィスなら合法` or `借址登記なら営業できる`
- `郵便物を受け取れればよい`
- guaranteed completion in 5 or 11 days
- unqualified criminal-sounding `罰金`
- `後で`
- `/ko/`
- Hangul

Use `会社・商業登記` rather than `法人登記`, because the Taipei system also
covers commercial registrations, branches, and branch establishments.

## Required tests

- Parse raw and normalized Japanese post.
- Assert exact title/date/read time/URL/category, exactly five FAQs, and exact
  ordered heading/immediate-answer pairs.
- Assert 2023-01-01, comprehensive covered registration events, current
  documents, 5-/11-calendar-day non-guaranteed targets, six-month validity,
  supplemental-notice process, five-item submission limit, inquiry scope
  limitation, active-inquiry fallback, address-use documentation, actual-site
  distinction, and separate fire/health/food-registration checks.
- Assert official and safe JA links, `曾雋崴`, featured/img-01 preservation,
  and absence of the obsolete img-02 reference.
- Assert all forbidden claims/terms, Hangul, and wrong-locale links are absent.
- Assert substantial Japanese content and canonical/alias slug resolution.
- Run full Japanese-column corpus regression, typecheck, scoped ESLint, and
  diff checks.

Independent factual, Japanese editorial, browser, and manager gates are
required before commit.
