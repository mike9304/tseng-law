# French, German, Spanish and Portuguese traffic films

Eight pages now have a language-specific long film: accident procedure at 80 seconds / eight scenes and overtaking at 100 seconds / ten scenes. These reuse the verified native ten-second Codex-reference/Grok 4.7 sequences, with localized burned-in captions and synchronized page text. No looping, slowing or still-frame padding. Existing core-language files and all source articles remain unchanged.

All four overtaking articles and the film-relevant general-article sections 1, 2, 5, 6, 7, 8 and 11 were checked. Translation was compared with the verified core films and their primary-source review. This is Codex review, not certification by a native speaker or lawyer. Source hashes and review scope: `qa/general-latin1-content-review.json` and `qa/overtaking-latin1-content-review.json` under `/Users/son7/tseng-law-traffic-films`.

| Copy reviewed | Issue | Final wording/treatment | Meaning preserved |
| --- | --- | --- | --- |
| Spanish medical causation | Draft “su nexo causal” left the link implicit. | “su vínculo con el accidente” names it. | Necessity and accident linkage both retained. |
| French overtaking prohibition | “face à un véhicule” was less explicit about approach. | “Interdit si un véhicule arrive en face…” | Prohibition, approaching traffic and at least two vehicles in line retained. |
| German warning repetition | “Dauersignale” could suggest only continuous signals. | “nicht mit wiederholten Signalen erzwingen” | Repeated compulsion prohibited; yielding still required. |
| General evidence | Police analysis, rest advice or receipts could guarantee recovery. | Preserve non-final police shares, actual income loss, treatment need and causal link. | No fault or compensation guarantee. |
| Overtaking conditions | Short captions could lose the warning or return sequence. | Two short horn sounds OR one headlight signal; wait for yielding; left signal/pass with at least 0.5 m clearance; safe distance before right signal/return. | Selected conditions only; complete Article 101 remains in article/official rule. |
| Scene identity | Fictional two-car impact could become the article's anonymous motorcycle case. | Localize full distinction, uncalibrated models and later parking-area damage photographs. | No reconstruction, compliance or measurement claim. |
| Titles and ends | Generic introductions or promotional endings would add no information. | Direct subject titles; retain factual first scene and evidentiary limitation, settlement scope or case-specific review at the end. | Each sentence adds content; no decorative bold or new promotional copy. |

All 72 final chapter samples were visually inspected. Browser screenshots reviewed: general FR mobile/ch7, ES desktop/ch8; overtaking DE mobile/ch3, PT desktop/ch2. Body text is 36px in all general films and at least 35/33/34/32px in FR/DE/ES/PT overtaking films. Accented characters render correctly. Native controls may cover burned-in captions while focused; separate page captions remain at least 16px. The existing language suggestion toast may overlap the lower disclosure.

All 425 tests in 29 files and clean `.next-latin1-films` build passed. Obsolete short-film expectations for these locales were replaced with long-film duration, chapter and disclosure checks; still-pending locales retain their legacy checks. Sixteen complete normal-speed desktop/mobile journeys passed: automatic start without gesture, every chapter, manual pause preserved after scrolling, native seeking, correct document language, no overflow/page errors, exact hashes and HTTP 206 ranges. Reduced-motion manual playback passed. Reports: `qa/local-general-latin1/report.json` and `qa/local-overtaking-latin1/report.json`; locale filtering and a four-slot queue were exercised by both.

All files fully decode as silent 1280×720 H.264 at 24 fps: 1,920 / 2,400 frames. Codex local final review passed. Production publication remains pending after automatic approval review rejected the main push; no publication is claimed.

| Film | Locale | Bytes | SHA-256 |
| --- | --- | ---: | --- |
| general | fr | 9378687 | `3d0f61ba2196c13c62add0026c88862608f55e35db47ed6633f6264b1be1ebd9` |
| general | de | 9388236 | `144113ec5cb76e5a5693e8801e0671cd3ddfa307fd782c23aece5faffa4b80b3` |
| general | es | 9393392 | `b7cb41566b1df5d0d199e18c22d7c3dfaba9195bf61d9a77aff42a505486de96` |
| general | pt | 9388838 | `21d052b698abc67428db154fb86533a4a1922982e545024692d46c2ec8caab69` |
| overtaking | fr | 10154230 | `99d0377edb1e5d848d7d2eb78a4b88701d8a84c642d35ea12bd04348ec3e860d` |
| overtaking | de | 10175463 | `8434910d998c854a5a7f13ed9fcf08b4b6aa17f63c98bb4e06dff6d5b5181649` |
| overtaking | es | 10196578 | `44e085c678cdf21c66bcd27d035e376f75ec3084495460d8c5d8bb34b9f4e8c0` |
| overtaking | pt | 10093711 | `e41f9bd354b316c2321f22f619213cc328eb2ac6456f41d56292b74bca5622a1` |
