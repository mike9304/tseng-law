# Eight additional European locales: accident and overtaking films

Sixteen pages now have localized long films: Italian, Dutch, Catalan, Romanian, Swedish, Danish, Norwegian Bokmål and Finnish. Accident procedure is 80 seconds / eight scenes; overtaking is 100 seconds / ten scenes. Each page uses one MP4 composed of the already reviewed native ten-second Codex-reference/Grok 4.7 scenes, with translated burned-in captions and synchronized page text. No looping, slowing or still-frame padding.

All eight overtaking articles and the film-relevant general sections 1, 2, 5, 6, 7, 8 and 11 were read. General reference-link lists were omitted from the extracts. Copy was compared with the verified core films and prior primary-source review, including Article 101. Source hashes remained unchanged. This is Codex review, not certification by a native speaker or lawyer. Review scope and hashes: `qa/general-euro2-content-review.json` and `qa/overtaking-euro2-content-review.json` under `/Users/son7/tseng-law-traffic-films`.

| Copy | Issue | Revision | Meaning preserved |
| --- | --- | --- | --- |
| Dutch settlement | “opgegeven claims” could mean submitted claims. | “claims waarvan u afziet” explicitly means waived claims. | Payment timing, insurance, waivers, reserved claims and future treatment retained. |
| Dutch overtaking | “in rij” was awkward; “lichtsignaal” did not specify headlights. | “op een rij”; “tweemaal kort claxonneren of één koplampsignaal”. | Ahead in a line; two short horn signals OR one headlight signal. |
| Romanian warning | Plural name of the horn device was used as the signal. | “două semnale scurte de claxon”. | Two short signals, alternative headlight signal, yielding and no repeated compulsion. |
| Danish road comparison | Draft question used “Svarende”. | “Svarer nutidige fotos til forholdene, da ulykken skete?” | Present photos must be compared with conditions at the crash time. |
| Swedish prohibition | Redundant approaching/oncoming wording. | “Kör inte om vid mötande fordon eller minst två fordon i rad framför.” | Prohibition and two-or-more vehicles ahead retained. |
| General evidence | A short caption could overstate recovery or police authority. | Keep non-final police analysis, actual income loss, treatment necessity and causal linkage. | No fault or compensation guarantee. |
| Overtaking sequence and scope | Condensing could remove conditions or imply the fictional collision was the anonymous motorcycle case. | Retain same-lane warning and yielding, left signal/pass with at least 0.5 m, safe distance before right signal/return, and separate case disclosure. | Selected Article 101 requirements only; models uncalibrated, later parking photographs not original crash positions. |
| Titles, openings and endings | Generic introductory or promotional copy adds no content. | Direct titles, factual opening with evidentiary limitation, settlement/case-specific ending. | No decorative bold, invented facts or human-review claims. |

All 144 final chapter samples were inspected across sixteen contact sheets; the revised Dutch settlement frame was additionally inspected after re-rendering. General text is 36px throughout. Minimum overtaking body sizes: IT 36, NL 33, CA 32, RO 35, SV 36, DA 33, NB 36, FI 33px. Accents render correctly and captions stay inside the frame. Browser screenshots inspected: general IT mobile/ch5, NL desktop/ch8, CA mobile/ch7, RO desktop/ch4; overtaking SV mobile/ch2, DA desktop/ch7, NB mobile/ch3, FI desktop/ch10. Native controls while focused may cover burned-in captions; separate synchronized page captions remain readable at at least 16px. The existing language suggestion toast can overlap the lower disclosure.

All 433 tests in 29 files and clean `.next-euro2-films` build passed. Updated expectations cover these completed locales while retaining legacy checks for remaining locales. Thirty-two full normal-speed desktop/mobile journeys passed: automatic start without gesture, manual pause retained after scrolling, native seeking, all chapters, correct document language, no overflow/page errors, exact SHA-256 hashes and HTTP 206 ranges. Reduced-motion manual playback passed. Reports: `qa/local-general-euro2/report.json` and `qa/local-overtaking-euro2/report.json`.

Every asset fully decodes as silent 1280×720 H.264 at 24fps, with 1,920 / 2,400 frames. The 65 earlier registry entries and all source articles remain unchanged. Codex local final review passed. Production publication remains pending after automatic approval review rejected the main push; no publication is claimed.

| Film | Locale | Bytes | SHA-256 |
| --- | --- | ---: | --- |
| general | sv | 9371477 | `3296d648d1d86dbc645584ba820728597c14297b609d20abee70653c32f5d376` |
| general | da | 9383595 | `49198253529c9a6df3e16a3ec52d59bbab040767fa35d9bf36473e64fd423690` |
| general | nb | 9380036 | `f4182980c43719fec4b1e7cb659e0bbe653e83dfb88e545ff30619409da5b2d1` |
| general | fi | 9382001 | `f13da48256a3dc0c69dbac6db46080f73b77d73feb86ffc71e9a93b70674c14d` |
| general | it | 9377046 | `8da406e860b9893cb11f10df9e95c9633e8c8135b04214f5c2043c4a4ab0be82` |
| general | nl | 9389792 | `04ee2284a37bf2384189680302f5600090e211d8da5ceec91e274db16fb8a9ed` |
| general | ca | 9416235 | `672437f5ec41862843f7e9e31ed35e266b896b9eb7ea92d1a2fa51e2bc5d3075` |
| general | ro | 9377851 | `ff1fcf8fe848ccfba6b816ce2d29dd7752cd2b49750b1fadc27cc2566ead9081` |
| overtaking | nb | 10147339 | `f9b8d4d687e9ca9678d01b758c408fd8f58fa5c6a4a46c5ee5ced44d67dcb876` |
| overtaking | fi | 10107668 | `311b30311b4b873036fe2d087ca39a933de32991e323dfdef1034024a559cfd4` |
| overtaking | sv | 10137352 | `9cee2ba43110a03cdd3f0fb196a4621e3bd96d9c764de14523c29d49b430fbfc` |
| overtaking | da | 10153944 | `5307855cb40d4a981bdfb0950fa7e5df215d45e32ca3bef00aadcf4f9aa8b0b8` |
| overtaking | ca | 10204183 | `6b7ff7fbe3ff996fc831be101e84fe4af3663580297c2b3e3e009c92cfc1bae9` |
| overtaking | ro | 10121677 | `ce3d100791e59a9a91e4b04d73343aa97a7305fbb9abf9a937d64d2b52a9a866` |
| overtaking | it | 10107606 | `759ee37194799ddacb20d1b4e0ee2af089f6af4c6330921ac379e8cbff042024` |
| overtaking | nl | 10109381 | `a60287bd48c9ec465e9be919efd0d91bd8e312561b323aa777d43bbc9c7fb671` |
