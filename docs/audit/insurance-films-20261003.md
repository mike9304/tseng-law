# Passenger-insurance and uninsured-fund films

The Traditional Chinese passenger-insurance column receives one 80-second film with eight distinct scenes; the uninsured-fund column receives one 100-second film with ten distinct scenes. Four new reference images were animated by Grok 4.7: adults beside a parked scooter, checking a fictional policy, comparing a receipt with a transaction list, and comparing separate payment records. Relevant previously reviewed scenes complete each sequence. No clip repeats within either film.

Both complete source articles were read and remain byte-for-byte unchanged. The captions were checked against the relevant provisions of the [Compulsory Automobile Liability Insurance Act](https://law.fsc.gov.tw/LawContent.aspx?id=FL006889) and the [benefit standards](https://law.fsc.gov.tw/LawContent.aspx?id=FL006901). Official fund answers were also read and saved: [settlement excluding compulsory insurance](https://www.mvacf.org.tw/FAQ/More/7058beab1dd14011abe23d53f78d8bc7), [later compensation and property-loss allocation](https://www.mvacf.org.tw/FAQ/More/8080FE6826D54593BCD2ED0D027B5BCF), and [a driver's own single-vehicle injury](https://www.mvacf.org.tw/FAQ/More/3bc7800d62eb4a22a582af16520c16fc). Court decisions cited by the source articles were not independently opened for this batch. The films repeat no case-specific award or finding of finality.

| Reviewed material | Issue | Final treatment | Meaning preserved |
| --- | --- | --- | --- |
| Passenger benefits and unlicensed driving | A shortened caption could make payment or recourse automatic. | Retain other statutory conditions, insured status, policyholder consent, negligence/causation and the driver due-care exception. | Payment and recourse remain separate inquiries. |
| Receipt and policy images | Invented records might appear to prove payment, coverage or an actual award. | Label all scenes as AI illustrations; disclose that the documents establish none of those facts. | Lawful actual payment and the passenger's underlying claim both limit recourse principal. |
| Settlement wording | “Excluding compulsory insurance” could be treated as overriding fund deduction. | Distinguish the agreement exception in Article 31 from Article 43; compare agreement, actual receipt and subsequent applications. | No added insurer-consent condition for the Article 31 agreement; no imported fund exception. |
| Property loss and recourse | Relabeling a payment or merely obtaining fund consent could appear to avoid statutory rules. | Require genuine itemization, distinguish emotional damages, retain actual-payment limits, the two-year subrogation period and specified family exceptions. | Consent concerning impairment of subrogation is not a general waiver of deduction. |

The source articles' conditions, exceptions, dates, amounts, citations and approved attribution changes remain intact. The films do not turn historical disability awards into current fixed benefits. No decorative bold was added. Each film has on-screen and separate generated-scene disclosures; the parked-scooter illustration does not reconstruct the article's rainy-night fall.

Evidence root: `/Users/son7/tseng-law-traffic-films`. Each new source clip was visually sampled at 2 fps across its full ten seconds, not manually reviewed frame by frame. Both final chapter sheets and four actual browser screenshots were visually read. Complete final-file decoding passed: H.264, 1280×720, 24 fps, no audio, exactly 1,920 or 2,400 frames. All burned-in body text is 36 px.

363 tests passed in 28 files; the clean `.next-insurance-films` production build passed. The initial collection-test failure came from a five-item expected video list and was corrected to include the two newly registered compensation films. `qa/local-passenger-insurance/report.json` and `qa/local-uninsured-fund/report.json` each record successful 390px and 1440px full normal-speed playback, no-gesture autoplay, native pause/seek, pause persistence, every synchronized caption at 16 px or larger, zero page errors or horizontal overflow, reduced-motion manual playback, matching asset hashes and HTTP 206 ranges. Native controls can temporarily cover burned-in captions; the separate text remains readable. The pre-existing language suggestion toast can overlap the lower disclosure until dismissed.

| Film | Duration | Bytes | SHA-256 |
| --- | --- | --- | --- |
| passenger-insurance-film-v1-zh-hant | 80 s | 11,174,994 | `ccb300d1ed81d7ffe64c03bfa76074af97241a8e0033b42b9ce2330e87ac2ce3` |
| uninsured-fund-film-v1-zh-hant | 100 s | 14,508,578 | `da817f2fd821a1a1123214e49a1bbe9c7485e2ddc118145996019e7cf8fe811f` |

Codex completed local final review. These two films are not deployed. Explicit production approval remains pending after the earlier automatic-review rejection; no publication bypass was attempted.
