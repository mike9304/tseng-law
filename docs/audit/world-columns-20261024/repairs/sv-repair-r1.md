# Swedish review repair r1

Reviewed on 24 October 2026 against `reviews/grok-sv-r1.md` and `briefs/BRIEF.md`.

Scope: the nine numbered review items (two MUST and seven SHOULD). Both MUST corrections and three small statutory SHOULD clarifications were accepted. Four conditional source-verification requests were also accepted: their official pages support the existing wording, so those passages were retained. No MUST item required a rebuttal.

Only drafts 837 and 839 needed changes; 838 remains byte-identical. Frontmatter field order, file names, titles, summaries, images, headings, contact paragraphs and source lists are preserved. The only frontmatter text change is 839's second FAQ answer. The summaries do not make the overbroad claims identified by the reviewer and need no change.

“ACCEPTED — retained” below means the reviewer's verification condition was fulfilled, not that the reviewer had asserted the original text was false. Old/new quotations reproduce visible article text; existing inline links are preserved in the files.

## 837 — swedish-company-taiwan-subsidiary-branch-office.md

### S1 — ACCEPTED

Verification: `python3 tools/law.py J0040002 9`, plus the live [official English Article 9](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=J0040002).

Statute: “其未實行之出資於期限屆滿時撤銷之。但有正當理由者，應於期限屆滿前，申請主管機關核准延展。” The official English text identifies the object of revocation as “the approval of the investor’s unimplemented investment”.

The proposed addition is correct, but “Kapital … återkallas” would obscure that it is the approval for the unimplemented investment which is revoked. The replacement specifies that object, the investor, justified grounds, the pre-expiry application and the authority's approval.

Old → new:

> Ett befogat behov av förlängning ska tas upp före fristens slut.

→

> Godkännandet återkallas för den del av kapitalet som inte har tillförts när fristen löper ut. Har investeraren befogade skäl ska ansökan om myndighetens godkännande av en förlängning lämnas före fristens slut.

The paragraph's existing Article 9 link remains. FAQ and summary do not discuss the capital-remittance deadline and are unaffected.

## 838 — swedish-professional-taiwan-work-permit-residence.md

### S1 — ACCEPTED — retained after official verification

The cited [BOCA visa-exempt-entry page](https://www.boca.gov.tw/fp-149-4486-7785a-1.html), published 17 July 2026 and opened for this repair, lists Sweden in the up-to-90-day group. Its Requirements section specifies at least six months' passport validity at entry, excludes temporary/emergency passports except for the stated exceptions (which do not include Swedish passports), and requires confirmed return/onward travel. Duration of stay, point 1, expressly says “starts from the day after arrival”; the passport condition says “at least six months”.

Old → unchanged:

> Tiden räknas från dagen efter inresan.

> Viseringsfri inresa förutsätter bland annat ett godtagbart pass med minst sex månaders återstående giltighet och bekräftad vidare- eller återresa. Provisoriska svenska pass omfattas inte av den vanliga viseringsfriheten.

FAQ 1's “Vistelsetiden räknas från dagen efter inresan.” is also retained. The source supports each questioned qualification; the article does not purport to give an exhaustive entry checklist.

### S2 — ACCEPTED — retained after official verification

The cited [official Gold Card presentation](https://goldcard.nat.gov.tw/en/about/) says “an open work permit”, “require neither pre-confirmed hiring by nor application through any employer”, and “freely change jobs”. The qualification paragraph separately says an already secured Taiwan job is unnecessary. These administrative descriptions support the three sentences; Article 9 was not used as their sole source.

Old → unchanged:

> Inget färdigt jobberbjudande krävs för Gold Card, enligt programmets officiella presentation. Arbetstillståndet är öppet. Det är inte knutet till en enda arbetsgivare.

No affected FAQ or summary correction.

### S3 — ACCEPTED — retained after official verification

Both cited NIA pages were opened live; each displays an update date of 14 April 2026.

[NIA 0915](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news), Required Documents point 4(8), requires “supporting documents related to the grounds for residency”. Notes point 7(1) lists excluded entry arrangements and preserves exceptions: “unless otherwise provided by relevant regulations”. This supports the deliberately general category/document and entry-route statement.

Old → unchanged:

> NIA:s anvisning för denna ansökan kräver underlag för den aktuella kategorin och anger begränsningar för vissa inreseformer.

[NIA 0902](https://www.immigration.gov.tw/5475/5478/141465/141808/141970), Required Documents point 3, states “Documents produced overseas must be authenticated”. For foreign-language documents it says the NIA “may request the applicant to provide a Chinese translation” and accepts translation verification by an overseas mission or notarization by a domestic notary.

Old → unchanged:

> NIA:s dokumentanvisning kräver bestyrkande av utomlands utfärdade handlingar och medger att myndigheten begär en bestyrkt eller notariserad kinesisk översättning.

The Swedish text preserves the mandatory authentication/discretionary translation distinction. No related FAQ or summary change.

## 839 — swedish-heir-taiwan-estate-deadlines-documents.md

### M1 — ACCEPTED

Verification: `python3 tools/law.py B0000001 1174`, cross-checked against live [Civil Code Article 1174](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1174).

Statute: “繼承人得拋棄其繼承權。前項拋棄，應於知悉其得繼承之時起三個月內，以書面向法院為之。”

The first sentence permits renunciation; the next imposes its form, recipient and deadline. The original opening could be read as requiring renunciation itself. The repair makes the choice explicit, while retaining the knowledge trigger and three-month limit.

Opening, old → new:

> När taiwanesisk arvsrätt gäller kräver civillagens artikel 1174 ett skriftligt avstående till domstolen inom tre månader från det att du fick kännedom om din arvsrätt.

→

> När taiwanesisk arvsrätt gäller får du enligt civillagens artikel 1174 avstå från arvet. Avståendet ska då göras skriftligen till domstolen inom tre månader från det att du fick kännedom om din arvsrätt.

FAQ 2, old → new:

> När artikel 1174 är tillämplig ska avståendet lämnas skriftligen till domstolen inom tre månader från kännedom om arvsrätten.

→

> Om du avstår och artikel 1174 är tillämplig ska avståendet lämnas skriftligen till domstolen inom tre månader från kännedom om arvsrätten.

The FAQ's following sentence about written notification and the impossibility exception remains unchanged. Summary unchanged: it mentions potentially different time limits, not a duty to renounce.

Effective-status check: both law.py and the live page flag pending Civil Code provisions, but the banner identifies Articles 166-1 and 1223, not Article 1174. Neither pending provision is used for this repair; the article retains its 24 October 2026 scope date.

### M2 — ACCEPTED

Verification: `python3 tools/law.py D0060001 17`, cross-checked against live [Land Act Article 17](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0060001&flno=17).

Statute: “左列土地不得移轉、設定負擔或租賃於外國人” and “前項移轉，不包括因繼承而取得土地。但應於辦理繼承登記完畢之日起三年內出售與本國人”.

The sale requirement concerns a foreign heir's acquisition of the listed land through inheritance. Its three-year clock starts on completion of inheritance registration.

Old → new:

> Markslag som omfattas av artikel 17 måste säljas till en taiwanesisk medborgare inom tre år efter arvsregistreringen.

→

> Om en utländsk arvinge ärver mark som omfattas av artikel 17 ska marken säljas till en taiwanesisk medborgare inom tre år från den dag då arvsregistreringen har slutförts.

The following public-sale consequence and the existing Article 17 link remain unchanged. Neither FAQ nor summary states this sale requirement.

### S1 — ACCEPTED

Verification: `python3 tools/law.py G0340072 23`, cross-checked against live [Estate and Gift Tax Act Article 23](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340072&flno=23).

Paragraph 1 specifies “向戶籍所在地主管稽徵機關”. Paragraph 2 reads: “被繼承人為經常居住中華民國境外之中華民國國民或非中華民國國民死亡時，在中華民國境內遺有財產者，應向中華民國中央政府所在地之主管稽徵機關辦理遺產稅申報。”

The review correctly identifies the two filing-authority rules. The addition preserves the alternative nationality/residence conditions and the requirement for property in Taiwan.

Old → new (insertion after the existing tax-deadline paragraph):

> [No filing-authority paragraph.]

→

> Enligt artikel 23 ska deklarationen normalt lämnas till skattemyndigheten på den avlidnes folkbokföringsort. Var den avlidne taiwanesisk medborgare med vanlig hemvist utomlands, eller saknade taiwanesiskt medborgarskap, och lämnade egendom i Taiwan, ska den lämnas till skattemyndigheten där centralregeringen har sitt säte.

The new reference links directly to Article 23, which was already in the source list. The complete existing six-month deadline, special starting points and extension paragraph is unchanged. No affected FAQ or summary claim.

### S2 — ACCEPTED

Verification: `python3 tools/law.py D0060001 73`, cross-checked against live [Land Act Article 73](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0060001&flno=73).

Statute: “其係繼承登記者，得自繼承開始之日起，六個月內為之。聲請逾期者，每逾一個月得處應納登記費額一倍之罰鍰。但最高不得超過二十倍。”

The original six-month statement was accurate. The suggested small clarification is useful: the statute contemplates late applications and a discretionary penalty, rather than automatic loss of the right to register. The replacement also states the monthly one-fee multiplier explicitly and calls the sanction a sanktionsavgift, preserving 罰鍰.

Old → new:

> Jordlagens artikel 73 anger sex månader från arvsöppningen för arvsregistreringen.

→

> Enligt jordlagens artikel 73 får arvsregistrering göras inom sex månader från arvsöppningen. En för sen ansökan kan medföra en sanktionsavgift motsvarande registreringsavgiften för varje månads dröjsmål, högst tjugo gånger registreringsavgiften.

The link, inheritance-opening trigger and following statement that one heir may apply for all are preserved. No affected FAQ or summary claim.

### S3 — ACCEPTED — retained after official verification

The cited [Ministry of Finance inheritance procedure/document page](https://www.etax.nat.gov.tw/etwmain/tax-info/house-land-transfer-taxtation-calculation-area/inheritance/file-process), updated 25 June 2026, was opened live. Step 3, items 2–5, lists proof of death, a family succession chart and heirs' current identity/household documents, authorization and the agent's identification when another person files, and documents proving estate property. Relevant labels include “被繼承人死亡證明資料”, “繼承系統表”, “委託他人申報者” and “遺產之相關證明文件”.

Old → unchanged:

> För skatteärendet visar finansministeriets förberedelseanvisning bland annat dödsfallsunderlag, släktöversikt, arvingarnas identitetsuppgifter, tillgångshandlingar och fullmakt när någon annan deklarerar.

The page supplies exactly these categories. “Bland annat” remains non-exhaustive, and the following privacy guidance remains intact.

## Verification and editorial limits

- All five statutory provisions involved in changed claims were read through law.py using existing cache files. Civil Code 1174, Land Act 17/73 and Estate and Gift Tax Act 23 were also opened live in Chinese. Investment Act 9 was cross-checked with its live official English text after the web tool could not open its LawSingle URL. No cache files were written.
- All five questioned administrative pages (BOCA, Gold Card, NIA 0915, NIA 0902 and MOF documents) were opened live. Each retained claim above is tied to the cited section.
- The current shared sentence-variety tool was run on all three files with `check <file> --lang sv`. Every invocation exits 2: Swedish is not a supported language. This is not an automated PASS or a claimed “FAIL 0” Swedish result.
- Section 5 manual check: the three openings remain a contract-party question, a 90-day fact, and a conditional inheritance rule. Each adds necessary facts; 839 now separates the right to renounce from its mandatory procedure. In the second paragraph, the message, death date, nationality and known assets each serve a distinct evidentiary or choice-of-law purpose, so none was deleted. The unchanged first two paragraphs of 837 and 838 retain their transaction, entry/work-permission and working-holiday distinctions.
- All three bodies have at least two short sentences, no paragraph with more than one sentence over 32 words under the supplemental count, and no paragraph-start word used more than twice. Citations remain varied in position, with practical uncited paragraphs between legal explanations. No new repetitive contrast formula, invented scene, bold formatting, checklist heading, promotional ending or public byline was introduced. The last body sentences still concern the first customer contract, planned work/stay dates and proof of the inheritance-knowledge date.
- Same-locale comparison: read snapshot columns 009, 013 and 015 in full (each `lastmod: 2026-09-10`, displayed date 13 September 2025). Their retrospective opening, numbered FAQ exposition and generic wrap-up were not introduced into the repaired articles. This is a bounded repair comparison, not a fresh live-corpus audit or human native-speaker review.
- Supplemental Swedish-aware diagnostics strip YAML, headings, source lists and link destinations, split sentences before Swedish uppercase letters, and count Unicode words. These are transparent local diagnostics, not a replacement for supported language validation. Body word counts below use whitespace-separated visible prose; character counts include spaces.

| Draft | Body words | Body characters | Sentences | Length CV | Short sentences ≤8 words | Same-length triple ratio | Maximum identical paragraph start |
|---|---:|---:|---:|---:|---:|---:|---:|
| 837 | 678 | 4980 | 53 | 0.503 | 15 (28.3%) | 0.020 | 2 |
| 838 | 677 | 5112 | 54 | 0.481 | 18 (33.3%) | 0.019 | 1 |
| 839 | 841 | 6208 | 61 | 0.501 | 14 (23.0%) | 0.000 | 2 |

Final preservation checks passed: comparison against the original in-session contents found exactly one replacement in 837, no change in 838, and five replacements in 839 (including FAQ 2 and the filing-authority insertion). No other text changed. Ruby YAML parsing confirmed the exact field order, three FAQs, required metadata and title/summary lengths. Inline source coverage, existing internal-link targets, four issue headings per article, unchanged source lists and the no-bold requirement passed.

Independent bounded AI recheck: PASS for all nine review dispositions and the exact versions below. The reviewer did not author or edit the drafts, independently checked the relevant statutes and live administrative pages, and read this repair log. No further repair was requested. This records an AI repair review, not lawyer or human native-speaker certification.

| Draft | Final SHA-256 |
|---|---|
| 837 | `7bc250364c8bb4c2b07d44a627172c01728ccaa691d5d8000b70155a883bac05` |
| 838 | `f4f39e384c845a706ea2e80729e914c357741c7849c4ca5127c1775c7b25989d` |
| 839 | `747f5070754ab79e43c6bf38264ef4d740f3ce34519a16edf950c7c85d027ce4` |

Only drafts 837, 839 and this repair log were written. No publication or integration is part of this repair.

