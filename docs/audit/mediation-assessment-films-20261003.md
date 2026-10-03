# Mediation and assessment evidence films

Two separate Traditional Chinese films accompany the delayed-injury mediation and secondary-cause assessment columns. Each combines eight distinct 10-second scenes into one 80-second MP4. Six new Codex images were animated with Grok 4.7: comparing medical records, checking correspondence, separating document types, checking a road sketch, viewing street images and comparing an opinion with supporting material. Matching prior scenes complete each sequence without repeating a clip inside a film.

Both articles were read in full and their source hashes remain unchanged. The mediation film connects the earlier agreement, subsequent medical information, actual delivery of documents, procedural classification and proof of losses. It preserves the distinction between a material mistake not attributable to the declarant's own negligence and merely obtaining a new diagnosis. The assessment film separates qualitative main/secondary causes from a fixed percentage, and connects original evidence, road layout, reliable timing, specific objections and receipt dates.

The mediation captions were checked against [Civil Code 88](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=88), [738](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=738), [90](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=90), [Township Mediation Act 29](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=I0020003&flno=29), [Civil Procedure 380](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=380) and [416](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=416). The assessment captions were checked against [the assessment/review regulations, especially Articles 8, 10 and 11](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=K0040045), [Civil Code 217](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=217) and [Civil Procedure 222](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=222). The two cited judgments' HTML endpoints were unavailable in this pass; no new case-specific fact, medical diagnosis, speed, award, outcome or finality claim was introduced in either film.

| Wording or image reviewed | Issue | Final treatment | Meaning retained |
| --- | --- | --- | --- |
| “依第88條撤銷” in the initial caption. | The statute was implicit. | “依民法第88條撤銷”. | One year runs from the declaration and does not replace the delivery-based 30-day rule for approved township mediation. |
| Generic correspondence in both films. | Different procedures use different triggering events. | Mediation names delivery of the court-approved mediation document; assessment names the day after receipt of the assessment opinion, a single review and judicial referral when applicable. | These are not one interchangeable deadline. |
| Invented road sketches and monitor images. | They could be mistaken for original case evidence or calibrated measurements. | Explicit disclosure says they are invented and cannot establish speed, vehicle paths or liability. | The article's evidence-dependent analysis is preserved. |

Captions use concrete headings, no decorative bold and no promotional ending. The articles' existing opening paragraphs, legal conditions, amounts, quotations and source links are untouched. The on-screen AI labels and below-video disclosures remain visible parts of the player.

Evidence root: `/Users/son7/tseng-law-traffic-films`. All six new source clips were sampled visually at 2 fps across the full duration. Both final eight-chapter sheets were visually read, and both final files decoded fully: 1280×720, 24 fps, 1,920 frames, 80 seconds. The new `.next-mediation-assessment-films` production build passed, and 324 tests passed in 24 relevant files.

`qa/local-mediation/report.json` and `qa/local-assessment/report.json` record four successful 390px/1440px normal-speed whole-playback journeys. Autoplay needed no user gesture; native pause/seek, pause persistence, all eight synchronized 16px captions, reduced-motion manual playback, matching asset hashes and HTTP 206 ranges passed. No page errors or horizontal overflow occurred. Actual screenshots were also read. Native controls can temporarily obscure the burned-in caption; the separate caption remains readable.

Mediation SHA-256: `7efc63f0a5b00aaf2259ab398cba35835090ccdfede4d87835883e3f2b8a3736`.

Assessment SHA-256: `2e00f22b027b70dd9e05a7320fa05d8152c178f7ec8a3bafcd7c6071c7964df1`.

Codex completed local review. Production remains pending explicit user approval after the preceding production-push rejection; this document does not claim deployment.
