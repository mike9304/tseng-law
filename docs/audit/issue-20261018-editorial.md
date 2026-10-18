# ISSUE-20261018 editorial audit

Date: 2026-10-18, Asia/Seoul. Scope: eight issue-board manuscripts and their editorial images, four languages. Worktree: `/Users/son7/tseng-air-1011/issues`, branch `air/issues-20261018`. No commit, push or deployment was performed. This record is a local editorial handoff; the operator’s separate Claude Code review still gates shipping.

## Inputs and workflow

Read before drafting: Air `RULES.md`; full `EDITORIAL-VOICE.md` and `FRONTMATTER.md`; `AGENTS.md`; ISSUE-20261002 examples, test and `FINAL-CLAUDE-REAL.md`; issue loading and media mapping in `src/lib/columns.ts`. The initial worktree had no interrupted ISSUE-20261018 drafts. Existing issue and expertise columns were searched before selecting topics. No editorial-rule copy, runtime code or older batch was modified.

Four separate researchers prepared source briefs; four market writers authored the manuscripts; four fresh AI reviewers read their respective final-language drafts and three recent comparators. The root integrated images, tests, bounded repairs and this record. These are AI editorial checks, not a claim of human native-speaker, attorney or Claude review. Detailed evidence is outside the repository at `/Users/son7/tseng-air-1011/lanes/issues/20261018/work/`: `research-{ko,ja,en,vi}.md`, `draft-{ko,ja,en,vi}-notes.md`, `{ko,ja,en,vi}-locale-review.md`, and the separate `independent-final-review.md`. The latter records its own verdict and reviewed hashes.

## Final manuscripts

| Piece | Distinct reader question | Body length |
| --- | --- | --- |
| ko-01 | Animal possessor liability after a scooter–cat collision | 914 narrative characters including spaces |
| ko-02 | Advance medical decisions: consultation and family participation | 964 narrative characters including spaces |
| ja-03 | Who applies for a Japanese performer’s Taiwan work permission | 1,504 characters excluding whitespace; includes H2 text |
| ja-04 | Plans and approval for reuse of a designated monument | 1,522 characters excluding whitespace; includes H2 text |
| en-05 | US visitors investigated over protected sea-turtle contact | 519 narrative words |
| en-06 | A returning parent’s NHI enrollment after the senior-premium vote | 532 narrative words |
| vi-07 | Micro electric two-wheeler classification, plates and insurance | 542 whitespace-delimited narrative words |
| vi-08 | Election dinners and the benefit-for-vote boundary | 547 whitespace-delimited narrative words |

Counts exclude frontmatter/FAQ, H1, source lists, link destinations, image disclosures and final source-date/general-information lines. KO excludes all headings; JA includes H2 but excludes whitespace; EN/VI exclude headings and count whitespace-delimited visible words. Vietnamese counts therefore include separately spaced syllables. Counts are author/reviewer measurements, not a claim that all language units are equivalent.

| Piece | File | Reviewed SHA-256 |
| --- | --- | --- |
| ko-01 | `src/content/issues/ko/ISSUE-20261018-06-taiwan-cat-scooter-collision-animal-possessor-liability.md` | `1b69dd38231555bdc92460768ed0956672ef5ba23edb06412c42b7fec0a1fc8a` |
| ko-02 | `src/content/issues/ko/ISSUE-20261018-07-taiwan-advance-medical-decision-family-consultation-formalities.md` | `4bbd3ecbda2ac6992f279f63d0fc6bd8db008f16d286afb4cdfda6d7cb13d359` |
| ja-03 | `src/content/issues/ja/ISSUE-20261018-08-taiwan-japanese-performer-work-permit-applicant.md` | `27d6c4c23b5fde4046eea03a42926b57a63d6ca949f1dd60213c81df51bfe24a` |
| ja-04 | `src/content/issues/ja/ISSUE-20261018-09-taiwan-heritage-building-reuse-plan-approval.md` | `7804e88fc4c09552e98eeb1f80b83bce7f101c266864bc7a978a12747db9fbc5` |
| en-05 | `src/content/issues/en/ISSUE-20261018-05-taiwan-us-visitors-sea-turtle-harassment.md` | `abbb1b3bdc890cf37f5d213e9773ec44ee8221ce896074d3785fb4a225ec824e` |
| en-06 | `src/content/issues/en/ISSUE-20261018-10-taiwan-senior-nhi-subsidy-returning-parent-enrollment.md` | `96048530f755d2611663f479c73062a6c23726793719b9ad420ec427e84f7386` |
| vi-07 | `src/content/issues/vi/ISSUE-20261018-11-taiwan-micro-electric-two-wheeler-registration.md` | `baeefc848827af167705023451c1543f27c54df7f38fa721b4406e2fc768a2c5` |
| vi-08 | `src/content/issues/vi/ISSUE-20261018-12-taiwan-election-dinner-vote-buying-boundary.md` | `b20df51bb1ba1540d7935398e18a1f59621b63fe4b476dd0a885e9c15b8cda3a` |

All four locale reports are PASS for these hashes. Japanese review includes one nonblocking optional repetition note in ja-03; no legal repair was requested. It is retained as reviewed rather than represented as an applied change.

## Actual first two paragraphs and deletion checks

### ko-01

Actual first two paragraphs of the reviewed version:

> [중앙통신사(CNA)는 10월 17일](https://www.cna.com.tw/news/asoc/202610170061.aspx), 이틀 전 가오슝 구산구에서 오토바이 운전자가 고양이와 충돌해 넘어진 뒤 병원으로 옮겨졌으나 숨졌다고 보도했습니다. 경찰은 사망 원인을 밝히기 위해 검찰에 검시를 요청할 예정이라고 설명했습니다. 보도에는 고양이가 누구의 관리 아래 있었는지 나오지 않습니다.
>
> 대만에서 비슷한 사고를 당한 한국인이 배상을 청구할 때, 법이 책임 주체로 삼는 사람은 동물의 ‘점유자’입니다. [민법 제940조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=940)는 사실상 지배·관리할 힘을 가진 사람을 점유자로 정합니다. 소유자가 누구인지와 사고 당시 누가 실제로 동물을 관리했는지는 구분해서 살펴야 합니다.

Deletion and comparison result: Paragraph 1 retains the October 17 report, October 15 incident, pending cause inquiry and unknown animal controller. Removing its first sentence loses the news premise. Paragraph 2 identifies the Korean claimant’s specific decision and Civil Code Article 940’s actual-control definition. The owner/controller distinction is a legal condition, not a generic introduction. Compared with the previous facade article, this draft concentrates on the animal possessor and Article 190 defenses instead of repeating a general damages checklist.

### ko-02

Actual first two paragraphs of the reviewed version:

> 대만 보건 당국자가 10월 17일 타이베이의 세계 호스피스·완화의료의 날 관련 행사에서 앞으로 받을 의료에 관한 뜻을 가족과 미리 나누자고 당부했다고 [중앙통신사(CNA)가 전했습니다](https://www.cna.com.tw/news/ahel/202610170063.aspx).
>
> 대만에 사는 한국인이 이 결정을 작성하려면 [환자자기결정권법 시행세칙 제2조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=L0020199&flno=2)에 따라 완전한 행위능력이 있고, 대만 국민건강보험에 가입해 보험증을 가지고 있어야 합니다.

Deletion and comparison result: Paragraph 1 supplies the dated Taipei public event and the actual official message. Paragraph 2 immediately supplies the Korean resident’s capacity, NHI participation and credential conditions. Neither paragraph is a disposable preview. The actor-led opening differs from the recent Korean incident-first introductions; no mandatory two- or three-paragraph setup was added.

### ja-03

Actual first two paragraphs of the reviewed version:

> 米津玄師が12月26、27日に台北ドームで公演を行うと、[フォーカス台湾が10月16日に報じました](https://japan.focustaiwan.tw/entertainment-sport/202610160007)。ワールドツアーの台北公演として予定されているものです。記事は開催予定を伝えており、出演者や主催者の就労許可の状況を報じたものではありません。
>
> 台湾の[就業服務法第43条](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=43)は、同法に別段の定めがある場合を除き、外国人が台湾で働くには雇用主の申請による許可を要すると定めています。[第46条第1項第6号](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=46)は、雇用主が外国人を雇用できる仕事の区分に、宗教・芸術・芸能の仕事を挙げています。この区分に入ることと、実際に許可を得ていることは別です。

Deletion and comparison result: Paragraph 1 preserves the named performance, future dates, announcement date, tour context and the absence of any permit-status report. Paragraph 2 preserves Article 43’s general employer route and express exception, Article 46’s work category, and the distinction between that category and an actual permission grant. Each sentence was tested separately in the Japanese report. The food-import comparator also needs a no-violation caveat, but the new article moves straight into the employment rule and uses one substantive heading.

### ja-04

Actual first two paragraphs of the reviewed version:

> 日本統治時代に建てられ、国定古跡に指定されている台中州庁が、6年間の修復工事を終えて10月15日に再び公開されました。[同日付のフォーカス台湾](https://japan.focustaiwan.tw/travel/202610150005)は、元の姿の保存と現代の利用に必要な機能との両立が、修復上の課題だったと伝えています。
>
> 日本企業が台湾の古い建物を店舗や展示会場として使う場合、建築年代だけでは適用される手続は決まりません。台湾法上の「古蹟」に指定された建物には、修復と再利用に特有の規定があります。「歷史建築」など別の文化財区分と混同せず、その建物が何に指定・登録されているかによって検討の出発点が変わります。

Deletion and comparison result: Paragraph 1 supplies the building, national-monument designation, six-year restoration, reopening date and reported preservation/use issue. Paragraph 2 limits the Japanese business example to the building’s legal classification and distinguishes designated monuments from other heritage categories. Deleting the first sentence removes concrete news context. The two subject headings concern compatible use and plan approval, unlike the prior import and sale-by-sample stories.

### en-05

Actual first two paragraphs of the reviewed version:

> Two US visitors were referred to the Pingtung District Prosecutors Office after allegedly touching a sea turtle at Xiaoliuqiu's Vase Rock on October 15, [CNA reported on October 17, 2026](https://www.cna.com.tw/news/asoc/202610170038.aspx). According to the report, a member of the public filmed the incident and alerted the coast guard. Officers took the visitors to Taiwan's main island by patrol boat and referred them to prosecutors that evening. The report describes an investigation, without establishing that either visitor committed an offense.
>
> Green sea turtles appear on the Ocean Conservation Administration's [list of protected marine wildlife](https://www.oca.gov.tw/ch/home.jsp?id=42&parentpath=0%2C6). For US travelers planning to snorkel in Taiwan, that classification carries legal consequences even when an encounter causes no obvious injury. [Article 18 of the Wildlife Conservation Act](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=M0120001&flno=18) prohibits harassment, abuse, hunting, killing and other use of protected wildlife, subject to specified exceptions.

Deletion and comparison result: Paragraph 1 retains the incident/report dates, US connection, evidence source, referral sequence and investigation-only status. Paragraph 2 supplies the official protected-species classification and the injury-versus-interference issue. The opening is not a general travel introduction. Its two headings and evidence-focused ending differ from the prior patent, fund-manager and collateral pieces.

### en-06

Actual first two paragraphs of the reviewed version:

> Taiwan's legislature passed an amendment concerning National Health Insurance (NHI) premiums for income-qualified seniors on October 16, 2026, [CNA reported](https://www.cna.com.tw/news/aipl/202610160144.aspx). A family arranging an older parent's move back from the United States still needs to know when that parent's NHI enrollment will begin.
>
> For a parent who retains Republic of China nationality, household registration and insurance history determine which enrollment rule applies. An old NHI card does not show whether that parent's household registration or insurance enrollment remained in place during the years abroad. The legislative report does not establish any particular returnee's enrollment or entitlement to a premium subsidy.

Deletion and comparison result: Paragraph 1 reports passage only and identifies the family’s separate need for an enrollment date. Paragraph 2 limits the analysis to an ROC-national parent and explains household registration, insurance history and why possession of an old card does not prove enrollment. The new family opening avoids the previous fund-manager article’s “For a US or other international…” formula. The subsidy vote is not represented as a verified commencement or individual entitlement.

### vi-07

Actual first two paragraphs of the reviewed version:

> Cảnh sát Bắc Đẩu đến nhà máy Cheng Shin ở Khê Châu, Chương Hóa ngày 8/10 để phổ biến pháp luật cho lao động Việt Nam và Indonesia, theo [báo địa phương ngày 14/10/2026](https://twainews.com/changhua/news/lEsMZk1GHUcUoqU6bsVU). An toàn giao thông nằm trong nội dung của buổi này, cũng được [chính quyền huyện xác nhận](https://www.chcg.gov.tw/ch2/newsdetail.aspx?bull_id=439761). Các bản tin không nói riêng về đăng ký xe điện.
>
> Tên gọi quen thuộc “xe đạp điện” chưa cho biết xe thuộc nhóm pháp lý nào tại Đài Loan, trong khi yêu cầu về biển số khác nhau giữa các nhóm.

Deletion and comparison result: Paragraph 1 preserves the October 8 event, October 14 publication, Vietnamese/Indonesian audience and general traffic-safety content. Its final sentence prevents attributing registration instruction to the workshop. Paragraph 2 states the actual legal-classification consequence without an extra introductory sentence. Unlike the recent ARC address-change story, the practical decision is vehicle classification and registration.

### vi-08

Actual first two paragraphs of the reviewed version:

> Một người tại Đài Đông bị điều tra vì nghi tổ chức bữa ăn để vận động cho một ứng viên sau khi huy động tân di dân tham gia hoạt động ủng hộ, theo [CNA ngày 17/10/2026](https://www.cna.com.tw/news/asoc/202610170085.aspx). Ngày 16/10, cơ quan điều tra khám xét và lấy lời khai; sau đó tòa cho người này tại ngoại với tiền bảo đảm 150.000 Đài tệ. Đây là diễn biến điều tra, chưa phải bản án kết tội.
>
> Bản tin không nêu quốc tịch của nhóm tân di dân. Với người gốc Việt đã có quyền bỏ phiếu tại Đài Loan, câu hỏi pháp lý khi nhận lời mời ăn là lợi ích ấy có gắn với yêu cầu về lá phiếu hay không.

Deletion and comparison result: Paragraph 1 preserves the reported suspicion, October 16 questioning, October 17 report, bail and absence of conviction. Paragraph 2 states that participants’ nationalities were not reported and separately identifies Vietnamese-origin readers who have voting rights. This differs from the preceding voter-eligibility explainer: it addresses an alleged benefit-vote exchange, without repeating citizenship, registration-duration or roll rules.

## Three prior same-language articles

Authors and independent locale reviewers read these files in full. Dates below come from repository metadata; this audit does not certify their live publication. Detailed sentence-level and structural comparisons are in the locale reports, with the decisions summarized above.

### ko

- `src/content/issues/ko/ISSUE-20261017-01-taiwan-beitou-falling-facade-owner-liability.md` — metadata publication date 2026-10-17.
- `src/content/issues/ko/ISSUE-20261017-02-taiwan-election-online-betting-foreign-residents.md` — metadata publication date 2026-10-17.
- `src/content/issues/ko/ISSUE-20261016-02-taiwan-nicotine-free-e-cigarette-entry-ban.md` — metadata publication date 2026-10-16.

### ja

- `src/content/issues/ja/ISSUE-20261017-04-taiwan-museum-insect-specimens-import-permits.md` — metadata publication date 2026-10-17.
- `src/content/issues/ja/ISSUE-20261017-03-taiwan-food-tasting-samples-import-inspection.md` — metadata publication date 2026-10-17.
- `src/content/issues/ja/ISSUE-20261016-04-taiwan-ceatec-sale-by-sample-quality-japanese.md` — metadata publication date 2026-10-16.

### en

- `src/content/issues/en/ISSUE-20261017-06-taiwan-techcrunch-demo-patent-grace-period.md` — metadata publication date 2026-10-17.
- `src/content/issues/en/ISSUE-20261017-05-taiwan-fund-manager-personal-trades-reporting.md` — metadata publication date 2026-10-17.
- `src/content/issues/en/ISSUE-20261016-06-taiwan-shares-offshore-collateral-pledge-creation.md` — metadata publication date 2026-10-16.

### vi

- `src/content/issues/vi/ISSUE-20261017-08-taiwan-vietnamese-students-arc-address-change.md` — metadata publication date 2026-10-17.
- `src/content/issues/vi/ISSUE-20261017-07-taiwan-naturalized-residents-local-election-voter-eligibility.md` — metadata publication date 2026-10-17.
- `src/content/issues/vi/ISSUE-20261016-08-taiwan-vietnam-remittance-license-cash-exchange-robbery.md` — metadata publication date 2026-10-16.

## Actual changes, reasons and preservation of meaning

| Piece | Changed wording or passage | Reason and preservation of meaning |
| --- | --- | --- |
| ko-01 | Title now “대만에서 동물 때문에 다쳤을 때, 배상청구의 상대”; removed closing repetition of the opening’s uncertainty. | Focuses the distinct legal question on the animal possessor. Unknown control and pending cause inquiry remain explicit; no owner or liability is invented. |
| ko-01 | Deleted “둘 중 어느 하나에 해당하면 되는 구조이며, 사고가 났다는 사실만으로 예외까지 배제되지는 않습니다.” after independent review. | Repeated a formulation in the preceding Korean facade article. The preceding sentence still preserves the two Civil Code Article 190 defenses as alternatives. No condition, figure or source was removed. Reviewer reread the resulting hash and passed. |
| ko-02 | Removed a general preview contrasting family discussion with completed legal procedure; opened with the actual official’s dated statement. | Eliminates setup already explained by the following statutory requirements. Capacity, NHI eligibility, consultation, notarization OR witnesses and annotation remain. |
| ko-02 | Added the written withdrawal/change route to the medical institution, with Enforcement Rules Article 6. | Verified legal procedure, not an unsupported family-substitution or automatic Korea exemption claim. |
| ja-03 | Added the paragraph distinguishing “申請済み” from “許可取得済み”. | Explains a concrete status ambiguity without treating filing as permission or promising approval. The reviewer’s optional deletion of its final repetitive sentence was not applied. |
| ja-04 | “管理維護計画” became “管理・維持計画”. | Natural Japanese; statutory filing (備查) and approval (核准), responsible actors and timing remain distinct. |
| en-05 | “Article 42 provides…” became “Article 42’s basic penalty…”; removed a rhetorical holiday ending. | Preserves imprisonment, short-term detention and fine alternatives while avoiding an exhaustive claim about enhanced variants. The closing now addresses evidence and the harassment definition. |
| en-06 | Deleted “Those records matter to the coverage date.” and replaced writer-facing “The returnee rules discussed here concern…” with direct nationality/record conditions. | Removes repetition and internal exposition. ROC nationality, household registration, recent-insurance alternative and qualifying-employment category remain. |
| vi-07 | Deleted “Một vấn đề riêng với người đi làm bằng xe điện là loại xe được ghi trong hồ sơ.” | The next sentence already supplies the classification/plate issue. Worker context and all legal conditions remain. |
| vi-07 | “bị di chuyển và tạm giữ tại chỗ” became “bị đưa đi tạm giữ”. | Correctly conveys removal into custody; approved-vehicle custody and unapproved-vehicle confiscation remain separate. |
| vi-08 | Deleted “Có mặt trong một bữa ăn và đồng ý đổi lá phiếu lấy lợi ích là những tình tiết khác nhau.”; tightened FAQ 2 with improper benefit, voter status and abstention. | Avoids repeating the later Article 143 explanation and makes the FAQ match the body’s statutory conditions. |
| vi-08 | FAQ 1 “Điều 143 Bộ luật Hình sự yêu cầu người có quyền bỏ phiếu…” became “Điều 143 Bộ luật Hình sự quy định trách nhiệm hình sự đối với người có quyền bỏ phiếu…”. | Removes wording that could read as an instruction to demand a benefit. Criminal-liability elements are preserved. Independent reviewer reread and closed the finding. |
| vi-08 | “có thể bị phạt tù đến ba năm và kèm phạt tiền đến 300.000 Đài tệ” became “có thể bị phạt tù đến ba năm; tòa án còn có thể phạt tiền đến 300.000 Đài tệ”. | Explicitly preserves the discretionary additional fine in Article 143. Both maxima are unchanged. Independent reviewer reread and closed the finding. |

The bounded ko-01 and vi-08 reviewer repairs were checked by reversing only the authorized replacements and reproducing their prior hashes. No other passages changed in those repair steps. No decorative bold, internal production note, invented experience, public AI-author footer, new attorney credential or service promise appears in the public manuscripts. Internal `author: legal-ai-assistant` provenance is preserved.

## Sources and legal limits

The outside `SOURCES.md` lists every selected news and MOJ/judicial authority with its supported proposition. Original reports and decisive MOJ LawSingle articles were actually opened; several web-extractor failures were resolved with certificate-verified HTTPS retrieval of the same page. Search snippets or failed-only URLs are not treated as verification. No judgment or case number is asserted. News dates range from October 14 to 17; vi-07 expressly distinguishes an October 8 workshop from its October 14 report.

MOJ pages displayed an October 8 consolidation cutoff. Relevant amendment and commencement histories were checked. EN-06 reports the October 16 senior-premium vote only: the new subsidy’s promulgation, commencement and individual entitlement were not verified and are not asserted. Existing NHI enrollment provisions support its narrower analysis. Investigations, bail, planned concerts and reopenings are not promoted into convictions, permit findings or property-specific approvals.

## Images and wiring

Eight separate images were generated with the available image-generation tool and visually inspected: fictional quiet street/cat, empty consultation room, empty stage, invented heritage corridor, unaccompanied sea turtle, home travel paperwork, parked small electric vehicle, and empty dining room. No recognizable person, text or logo is depicted. These are editorial illustrations, not news photographs. Each image has a 1536 × 1024 WebP and matching JPEG, under the exact article-stem path. Original generated PNGs remain intact; prompts and conversion metadata are in `work/image-prompts.json`.

Localized alt and captions disclose the fictional generated scene. The existing issue detail component renders the caption field for vi only; ko/ja/en therefore also include a short visible body disclosure. The runtime component was not changed. Image files were inspected and their actual format/dimensions checked; no browser rendering or production display is claimed.

## Verification and shipping boundary

- Final requested Vitest run: three files, 80 tests passed (17 new batch + 17 October 2 + 46 September 30), exit 0. Command: `npx vitest run src/lib/__tests__/issue-board-20261018.test.ts src/lib/__tests__/issue-board-20261002.test.ts src/lib/__tests__/issue-board-20260930.test.ts --no-cache`. Raw output: outside `work/tests-final.log`. Cache disabled to avoid writing through the shared node_modules symlink.
- New test ESLint check passed with exit 0. Tests check batch membership, frontmatter, provenance, media files, issue-loader placement and absence from expertise-column lists; they do not certify legal correctness.
- The older tests were unchanged. No application build, browser/mobile QA, production verification, commit, push or deployment is claimed. The lane script and the operator’s separate Claude Code review retain their existing roles.

## Renumber note (2026-10-18 14:20 KST)

ISSUE-20261018-01..05 were already published from the Mac Studio batch, so this batch was renumbered: ko 01→06, ko 02→07, ja 03→08, ja 04→09, en 06→10, vi 07→11, vi 08→12. en-05 was withdrawn because ISSUE-20261018-03 (en) already covers the same Xiaoliuqiu sea-turtle story. File hashes above predate the renumber.

## ko-01 review repair r1 — 2026-10-18

This entry supersedes the earlier ko-01 wording, count and hash for the present repair only. The supplied review identified two MINOR findings: the Korean issue page does not render `featured_image_caption`, and the required sentence-variety check failed. Both findings were reproduced and accepted. No rebuttal was needed. The earlier image-wiring statement did not describe the pre-repair ko-01 body accurately: its visible disclosure was added in this round.

Article: `src/content/issues/ko/ISSUE-20261018-06-taiwan-cat-scooter-collision-animal-possessor-liability.md`. Before SHA-256: `b8cb01f8cf615c264d2ef663240332e4d7f3b5a55934f5ca0af683e9f146f9d5`. Repaired SHA-256: `c6ee8d2619305d63d71ca284f157efdf0d4dd995f24f8bb16d992c784b34c237`. Narrative length is 915 characters including normalized spaces, excluding headings, link destinations, disclosure and references; it is 976 including the disclosure.

### Exact changes and preservation of meaning

| Before | Applied wording | Reason and preserved meaning |
| --- | --- | --- |
| “병원으로 옮겨졌으나 숨졌다고 보도했습니다.” | “병원으로 옮겨졌다고 보도했습니다. 운전자는 숨졌습니다.” | Separates the reported death into a short sentence. Hospital transfer, death, the CNA attribution and pending inquiry into the cause remain. |
| “대만에서 비슷한 사고를 당한 한국인이 배상을 청구할 때, 법이 책임 주체로 삼는 사람은 동물의 ‘점유자’입니다.” | “대만에서 비슷한 사고를 당한 한국인은 누구에게 배상을 청구할 수 있을까요? 그 상대는 점유자입니다.” | Adds a direct reader question and short answer. The respondent remains the animal's possessor; the following Article 940 definition and owner/controller distinction are unchanged. |
| “다만 동물의 종류와 성질에 맞춰 상당한 주의를 기울여 통제한 경우, 또는 그렇게 통제했더라도 손해를 피할 수 없었던 경우에는 예외입니다.” | “예외는 두 가지입니다. 동물의 종류와 성질에 맞춰 상당한 주의를 기울여 통제했거나, 그렇게 통제했더라도 손해를 피할 수 없었던 경우입니다.” | Introduces the exceptions with a short sentence. Article 190's two defenses remain alternatives, with the animal's type/nature, due care and unavoidable harm conditions preserved. |
| “그러나 그 영상만으로 누가 점유자였는지까지 밝혀지는 것은 아닙니다. 사고 전 누가 어떤 방식으로 동물을 관리하고 통제했는지는 별도로 확인할 사실입니다.” | “그러나 그 영상만으로 누가 점유자였는지까지 밝혀지는 것은 아니므로, 사고 전 누가 어떤 방식으로 동물을 관리하고 통제했는지는 별도로 확인할 사실입니다.” | Connects the video's evidentiary limit to the need to establish actual control. No possessor, owner or responsibility for this accident is invented. |
| No visible body disclosure. | “대표 이미지는 가상의 골목 장면입니다. 가오슝 사고 현장이나 사고에 연루된 고양이를 촬영한 사진이 아닙니다.” immediately before `## 참고 자료`. | Makes the fictional-scene limitation part of the rendered body. Existing frontmatter caption, image pair and runtime component are unchanged. |

### Actual repaired opening and comparison

> [중앙통신사(CNA)는 10월 17일](https://www.cna.com.tw/news/asoc/202610170061.aspx), 이틀 전 가오슝 구산구에서 오토바이 운전자가 고양이와 충돌해 넘어진 뒤 병원으로 옮겨졌다고 보도했습니다. 운전자는 숨졌습니다. 경찰은 사망 원인을 밝히기 위해 검찰에 검시를 요청할 예정이라고 설명했습니다. 보도에는 고양이가 누구의 관리 아래 있었는지 나오지 않습니다.
>
> 대만에서 비슷한 사고를 당한 한국인은 누구에게 배상을 청구할 수 있을까요? 그 상대는 점유자입니다. [민법 제940조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=940)는 사실상 지배·관리할 힘을 가진 사람을 점유자로 정합니다. 소유자가 누구인지와 사고 당시 누가 실제로 동물을 관리했는지는 구분해서 살펴야 합니다.

Deletion check: the first paragraph's four sentences respectively supply the dated news event, death, pending cause inquiry and unknown animal controller. The second paragraph's four sentences identify the Korean claimant's question, the respondent, the statutory actual-control definition and the ownership/control distinction. Removing these loses the reported outcome, a legal condition, the reader's context or a material uncertainty; no generic preview was added.

The three Korean comparators listed above were reread. The October 17 facade article moves from an injury and administrative fine to ownership and damages; this repair instead asks who possessed the animal and explains Article 190's defenses. The October 17 online-betting article moves from an investigation to the Korean resident's conduct/location; this repair introduces a short question and answer without copying that sequence. The October 16 nicotine-free e-cigarette article separates product classification and penalties; this article retains one substantive heading and ends its legal discussion with causation and control. The shared dated-news opening is relevant source context, not a repeated promotional setup. Dates are repository metadata, not independently certified publication dates.

### Live sources and verification

On 2026-10-18, the following pages were opened and their text checked:

- [CNA, October 17 report](https://www.cna.com.tw/news/asoc/202610170061.aspx): October 15 collision in Kaohsiung, hospital treatment and death, with a planned prosecutorial examination to establish the cause. It does not identify the cat's possessor or adjudicate civil liability.
- [Civil Code Article 190](https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=190&pcode=B0000001): the possessor's liability and two alternative defenses match the revised wording.
- [Civil Code Article 940](https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=940&pcode=B0000001): possession rests on factual control, supporting the unchanged ownership/control distinction.
- [Animal Protection Act Article 7](https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=7&pcode=M0060027): the keeper must prevent unjustified injury to others' life, body, liberty or property. That duty alone does not identify this accident's civil defendant.

MOJ displayed a 2026-10-08 consolidation cutoff. The Civil Code page's pending-effect notice concerns Articles 166-1 and 1223, not the cited Articles 190 or 940. A failed Python TLS fetch was not counted as verification; the successful web reads exposed the actual statutory text.

- `python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check src/content/issues/ko/ISSUE-20261018-06-taiwan-cat-scooter-collision-animal-possessor-liability.md --lang ko`: exit 0, zero FAIL; 20 sentences, CV 0.454, short-sentence share 0.150. The nonblocking warning about 95% `니다.` endings remains; the required 합니다 register is preserved.
- `node node_modules/vitest/vitest.mjs run src/lib/__tests__/issue-board-20261018.test.ts --project unit --configLoader runner --no-cache`: 25/25 tests passed, exit 0. The test file was unchanged.
- An exact replacement comparison against baseline commit `1506f6d5ba13146d012b00df32cb79ca5d032994` confirmed only the four prescribed wording edits and disclosure addition in the manuscript. Frontmatter/FAQ, source URLs, source-date disclaimer and absence of bold were checked. Both original image formats were viewed, match the quiet alley/cat/scooter description and remain byte-identical to baseline.
- Caption visibility was checked in the issue renderer source: the caption remains vi-only, while the Korean disclosure is now in the content passed to `ColumnContent`. No fresh browser/mobile run, full application build or publication is claimed for this narrow repair. Only ko-01's manuscript and this audit were edited by this task; other lanes' concurrent manuscript changes were preserved. No staging, commit or push was performed.
- Fresh independent Korean AI reviewer `ko01_r1_locale_review` returned PASS at matching start/end SHA `c6ee8d2619305d63d71ca284f157efdf0d4dd995f24f8bb16d992c784b34c237`, with no material findings. The reviewer did not author or repair this article, read all three Korean comparators, assessed all eight opening sentences and independently reopened the four cited sources.
- Separate independent AI final reviewer `ko01_r1_final_review` returned PASS at the same end SHA, checked at 2026-10-18 14:29:56 KST. This reviewer did not author, repair or perform the locale review; it independently checked the news, statutory text and both law histories, reread the comparators and this repair entry, viewed both images and incorporated the separate locale PASS. Metrics and tests were parent evidence, not independently rerun by either reviewer. No material finding remains in this bounded repair; these AI reviews do not claim the operator's separate Claude Code re-review or authorize publication.
