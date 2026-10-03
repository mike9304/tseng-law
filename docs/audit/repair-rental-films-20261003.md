# Repair-cost and rental-period films

Two Traditional Chinese columns now have separate 80-second films. Each file joins eight distinct 10-second scenes, with synchronized explanations below the video. Five new Codex reference images were animated by Grok 4.7: an itemized estimate, a parts comparison, payment records, a rental counter and vehicle return. Appropriate previously reviewed scenes supply the remaining steps. No short scene is repeated within either film.

Both complete source articles were read and remain byte-for-byte unchanged. The repair-cost film distinguishes necessary repairs, replacement-part depreciation, labor/paint, actual work and the limits of an insurer's subrogated claim. The rental film distinguishes transport need, repair work and waiting, rental billing units, completion/pickup/return, actual payments and overlapping replacement transport. Neither film supplies a historical award or formula as a current universal standard.

Relevant sources checked: [Civil Code 196](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=196), [Civil Code 213](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=213), [Insurance Act 53](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0390002&flno=53), [Keelung 114 基小 1628](https://judgment.judicial.gov.tw/FJUD/printData.aspx?id=KLDV,114,%E5%9F%BA%E5%B0%8F,1628,20251128,1), [Chiayi 113 朴簡 210](https://judgment.judicial.gov.tw/FJUD/printData.aspx?id=CYEV,113,%E6%9C%B4%E7%B0%A1,210,20250306,1) and [Xindian 114 店簡 1142](https://judgment.judicial.gov.tw/FJUD/printData.aspx?id=STEV,114,%E5%BA%97%E7%B0%A1,1142,20260511,1). The relevant court passages concern actual expenses, case-specific repair periods, itemized depreciation and proof of rental expenditure; no new appeal/finality claim is made.

| Draft or visual | Problem | Final wording or treatment | Preserved meaning |
| --- | --- | --- | --- |
| Parts beside the workshop car. | A viewer might assume the illustrated part must be replaced on that car. | Disclosure expressly says the comparison is illustrative and does not prove replacement necessity. | Repair necessity and depreciation remain separate questions. |
| Days spent renting versus days recoverable. | A continuous rental could be read as automatic proof of the recoverable period. | Compare work, waiting, billing, completion and return with their reasons. | Actual expenses, necessity and accident connection still require evidence. |
| A rental website price without actual rental. | Could imply either automatic recovery or rejection of every possible loss-of-use theory. | State that an online quote is not paid rent and other loss-of-use issues require separate analysis. | The cited decision's rental-expense issue is not expanded into a universal rule. |

Copy follows the editorial-voice rules: concrete scene headings, no decorative bold, no promotional conclusion and explicit AI fictional-scene labels. Existing article introductions and sources remain unchanged. On-screen labels and the disclosure distinguish these illustrations from the cited cases and original records.

Local evidence is retained under `/Users/son7/tseng-law-traffic-films`. Five new source clips were visually sampled at 2 fps over their full duration, and both final eight-chapter sheets were read. Both files fully decoded as 1280×720, 24 fps, 1,920 frames and exactly 80 seconds. The new build `.next-repair-rental-films` passed, as did 322 tests in 24 relevant files.

Browser reports `qa/local-repair/report.json` and `qa/local-rental/report.json` passed all four 390px/1440px journeys. Each played the entire film at normal speed, started without a user gesture, preserved manual pause, allowed native seeking and synchronized all eight captions at a readable 16px size. No page errors or horizontal overflow occurred. Reduced-motion manual playback, complete-file SHA-256 and HTTP 206 byte ranges passed. Mobile/desktop screenshots were also visually read; native controls may temporarily cover the burned-in captions, while the external captions remain readable.

Repair-cost SHA-256: `adb8e53ca40d03f57e6090ca89b4885bfae9f2ee295c7c4ff4ac5d8aac33de83`.

Rental-period SHA-256: `e0a1e3be05959255d2c4dcf505ab6a6b503de235a520e44b2681b493afd6fca5`.

Codex performed the final local review. Production publication remains pending user approval after automatic approval review rejected a preceding production push; this local result does not claim deployment.
