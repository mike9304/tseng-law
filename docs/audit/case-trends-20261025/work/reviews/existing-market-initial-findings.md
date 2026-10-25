# Independent regression review — initial frozen findings

2026-10-25. Reviewer `/root/recheck_market_changes`, independent AI final editorial/legal-evidence reviewer. I did not author, repair or modify any assigned manuscript. Overall: REQUEST_CHANGES on the initial current state.

Scope: 23 body-edited non-Portuguese market articles since approved commit `a188e620ee7eebc3f2188829e2c318904802ef7d`, examined at HEAD `ef3b24e73d84968eea08ea9d58e991ccbbf83fa8`. Thai4, Indonesian1, Hindi5, French2, German3, Italian4, Spanish4. Portuguese and all public image-byte/readback work are assigned elsewhere. This is a bounded regression review, not a new legal audit of every unchanged assertion in 87 articles.

Actual shared variety CLI: 19 non-Thai initial files yielded 9 PASS and 10 FAIL. All 19 exact a188 baseline texts passed the same current checker, isolating a prose regression rather than a changed checker. Thai auto-discovery initially returned exit2, not PASS. I then read all four current bodies, froze independent current-SHA maps before viewing their scores, and reran the real CLI: all four failed. This gives initial 9 PASS and14 REQUEST_CHANGES. Exact commands, outputs, initial hashes and full snapshots are in `existing-market-evidence/manifest.json`, `variety-results.json`, `baseline-variety.json`, and `thai-current-variety.json`.

The rule is user-required: `SENTENCE-VARIETY-RULE.md` sections5–6 require zero HARD failures, with monotony reported as a defect. The findings below connect the numeric failures to actual changed prose; no filler or arbitrary Thai boundary changes are requested.

## Findings, initial sentence versions

### 659 — REQUEST_CHANGES

- Location: `src/content/columns-th/659-thai-worker-taiwan-payslip-deductions-unpaid-salary.md:34`. Initial SHA `7c3cfe13a5fc7fab736fce58f58429081931788138ce56d06f16f4f7851a6a51`.
- Exact span: สองเรื่องนี้ต้องพิสูจน์แยกกัน
- Reason: MONOTONY: CV .431; the later permit/expiry and language explanations have been merged into longer connected units.
- Proposed narrow repair: Keep the two legal/administrative actions distinct and remove advisory padding; preserve worker scope, statute, language limits and no automatic engagement.
- Legal meaning preserved: Yes; style only.

### 660 — REQUEST_CHANGES

- Location: `src/content/columns-th/660-thai-worker-taiwan-factory-closure-wage-fund.md:47`. Initial SHA `0c492a23e33a50c51ba5033e3b375dd74069a8b8d59f8135ab1e118f9d271aa3`.
- Exact span: เงินเดือนพื้นฐานในสลิปไม่ใช่ค่าจ้างเฉลี่ยเสมอไป
- Reason: MONOTONY: short share .074; contrast 4. A new negative contrast replaced a direct instruction and another short recovery qualification was absorbed.
- Proposed narrow repair: Express the average-wage calculation positively and keep the possibility of incomplete recovery as its own real information unit.
- Legal meaning preserved: Yes; preserve average-wage/fund/debt separation.

### 662 — REQUEST_CHANGES

- Location: `src/content/columns-th/662-thai-return-home-taiwan-traffic-injury-records.md:28`. Initial SHA `88f014c8e00251efff5435f77c02a4914bbccee7aca397976ed192d6e0aaaff2`.
- Exact span: หลักฐานแต่ละชิ้นควรจัดให้ตรงกับประเด็นที่จะใช้ คือการบาดเจ็บ การรับเงินประกัน และความรับผิดของคู่กรณี
- Reason: MONOTONY: short share .078 under independently frozen actual boundaries.
- Proposed narrow repair: Clarify a concrete record-handling action already present, in a short natural sentence; do not resplit the unchanged map for a score.
- Legal meaning preserved: Yes; preserve dates, document types and representation scope.

### 663 — REQUEST_CHANGES

- Location: `src/content/columns-th/663-thai-supplier-taiwan-buyer-unpaid-invoice.md:64`. Initial SHA `e12e07cd8ac507e5789a78200f9be0f2f58770fd473ebce2d923adc1d9a40336`.
- Exact span: อีเมลสอบถามยังไม่ใช่การรับงาน
- Reason: MONOTONY: contrast 4 after the new contact ending.
- Proposed narrow repair: State positively that acceptance/engagement is confirmed separately, keeping inquiry distinct from an engagement.
- Legal meaning preserved: Yes; same consultation and acceptance limits.

### 668 — REQUEST_CHANGES

- Location: `src/content/columns-id/668-indonesian-buyer-taiwan-machinery-defect-notice.md:42`. Initial SHA `a93789bd548ad3eec8923fc57ba384194b4f0a45d488b4a1f361e386ff11d709`.
- Exact span: Pemberitahuan awal dapat memuat nomor mesin, nomor pesanan, tanggal penerimaan dan penemuan, gejala, serta hasil uji yang sudah ada, dengan pengamatan dipisahkan dari dugaan.
- Reason: MONOTONY: CV .442. Observation versus inference is buried in a long contents list.
- Proposed narrow repair: Keep the complete list, then: Pisahkan hasil pengamatan dari dugaan.
- Legal meaning preserved: Yes; practical evidence instruction, no new statutory duty.

### 669 — REQUEST_CHANGES

- Location: `src/content/columns-hi/669-indian-supplier-unpaid-taiwan-invoice.md:35`. Initial SHA `2aedb05871c6f5c5d561e33786740a54e179932a6aaba9fb7dce9822e0efa48e`.
- Exact span: एक ही हिसाब में मूल कीमत, मिला हुआ भुगतान, credit note, विवादित कटौती और बची रकम दिखनी चाहिए, साथ में हर राशि की मुद्रा भी।
- Reason: MONOTONY: CV .435. Currency is absorbed into the combined balance fields; similar padding in the bank-record paragraph.
- Proposed narrow repair: Retain every balance field, then: हर राशि की मुद्रा भी लिखें।
- Legal meaning preserved: Yes; preserve amount/currency/uncertainty.

### 670 — REQUEST_CHANGES

- Location: `src/content/columns-hi/670-indian-buyer-taiwan-machinery-defect-notice.md:33`. Initial SHA `06a92c0a8939a853b7131b8f30e5797f29c2b61563852c858002dbf11e0f667d`.
- Exact span: कारण अभी साफ़ न हो तो यही लिखना बेहतर है; अनुमानित डिजाइन दोष को सिद्ध तथ्य की तरह पेश करना ठीक नहीं।
- Reason: MONOTONY: CV .354, short .04, repeated opener 3. The uncertainty qualification and complete-message action became long explanations.
- Proposed narrow repair: कारण अस्पष्ट हो तो बताएँ। अनुमानित डिजाइन दोष को तथ्य न बनाएँ। Move inspection to the start of the third धारा paragraph.
- Legal meaning preserved: Yes; no change to defect notice or deemed acceptance.

### 672 — REQUEST_CHANGES

- Location: `src/content/columns-hi/672-indian-resident-taiwan-rental-deposit-handover.md:57`. Initial SHA `e11b8bc0b1bef8ebd64907e0e9226823953ee1d0d544dcc281b126617f1d93f6`.
- Exact span: हिसाब छोटा ही रहे: जमा रकम में से सहमत बकाया घटाएँ, विवादित मदें अलग रखें और मूल रकम NT$ में लिखें।
- Reason: MONOTONY: CV .429. A writing-shape preface replaces the earlier concrete separate currency task.
- Proposed narrow repair: Remove the shape preface; keep agreed/disputed deductions together and give मूल रकम NT$ में लिखें। its own sentence.
- Legal meaning preserved: Yes; same deposit and currency fields.

### 673 — REQUEST_CHANGES

- Location: `src/content/columns-hi/673-indian-importer-taiwan-supplier-bank-change-fraud.md:41`. Initial SHA `40bf733c1bd926171ecd716e2b91246a34828e6dd9b8c77dad37344a264f0b37`.
- Exact span: असली और बदला हुआ, दोनों बिल अलग-अलग रहें, और हर संस्करण के साथ लिखा हो कि वह कहाँ से और कब मिला।
- Reason: MONOTONY: CV .387, repeated opener 3. The two invoice records, source/time and original-file preservation became uniformly long clauses.
- Proposed narrow repair: दोनों बिल अलग रखें। हर संस्करण के साथ उसका स्रोत और मिलने का समय दर्ज हो। पुरानी फ़ाइल को overwrite न करें।
- Legal meaning preserved: Yes; preserves evidence provenance.

### 679 — REQUEST_CHANGES

- Location: `src/content/columns-de/679-taiwan-maschinenlieferung-fat-sat-schlusszahlung.md:49`. Initial SHA `14a2b26871b37dc263fe02107bdaf956104f5d636ef01ef3b19809b8f957e763`.
- Exact span: Ein angekreuztes „bestanden“ oder „nicht bestanden“ reicht als Antwort nicht.
- Reason: MONOTONY: CV .434. The test paragraph lost the long configuration/abnormal-condition relationship and became similarly sized explanations.
- Proposed narrow repair: Das Kreuz im Ergebnisfeld genügt dafür nicht. Then connect protocol conditions with the corresponding abnormal utilities/materials, timing and source.
- Legal meaning preserved: Yes; no acceptance or payment trigger changed.

### 681 — REQUEST_CHANGES

- Location: `src/content/columns-de/681-taiwan-lieferant-werkzeuge-pruefvorrichtungen-herausgabe.md:29`. Initial SHA `44c842535b02a324c936740a93269b021aefd8c42301b8bdeaf3677550da888c`.
- Exact span: Hilfreich ist eine Liste, die für jeden Gegenstand Seriennummer, Standort und letzte bestätigte Zuordnung festhält, und zwar auch für Einsätze, Ersatzformen und Prüfvorrichtungen.
- Reason: MONOTONY: CV .402. Item identification and inclusion of inserts/spares/fixtures are buried in one generic helpful-list sentence.
- Proposed narrow repair: Restore the procurement department as actor, with Einsätze, Ersatzformen und Prüfvorrichtungen sind einzeln aufzuführen. as the separate inventory requirement.
- Legal meaning preserved: Yes; same object identity and evidence.

### 683 — REQUEST_CHANGES

- Location: `src/content/columns-de/683-deutsches-urteil-vermoegen-taiwan-vollstreckung.md:56`. Initial SHA `6295a415327948e02af62c68e1942273ba22f169fb811a9e2415992b35bff151`.
- Exact span: Für jedes Anerkennungshindernis sollte feststehen, welches Dokument es belegt.
- Reason: Legal-clarity blocker: literally asks which document proves a recognition obstacle. CPC402 sets nonrecognition grounds; this changes the prior neutral document-mapping instruction. Also CV .416 and consecutive starts 4.
- Proposed narrow repair: Für jeden Prüfungspunkt sollte feststehen, welche Unterlagen ihn betreffen und ob weitere Nachweise fehlen. Or restore the exact previously approved neutral body as a separately recorded fallback.
- Legal meaning preserved: Corrects unintended proof direction; does not change the statutory recognition grounds or impose a burden.

### 691 — REQUEST_CHANGES

- Location: `src/content/columns-es/691-spanish-judgment-taiwan-assets-enforcement.md:72`. Initial SHA `00cbca16a04f4f010325cfdab709e9fdf8060a3573783cdb49df29aff04e2129`.
- Exact span: La [consulta sobre el asunto taiwanés](/es/contact) puede empezar con un correo a [wei@hoveringlaw.com.tw](mailto:wei@hoveringlaw.com.tw); se atiende en inglés, chino, japonés o coreano, y el idioma se acuerda antes.
- Reason: MONOTONY: Repeated paragraph opener La 3.
- Proposed narrow repair: Puede iniciar la [consulta sobre el asunto taiwanés](/es/contact) escribiendo a [wei@hoveringlaw.com.tw](mailto:wei@hoveringlaw.com.tw); se atiende en inglés, chino, japonés o coreano, y el idioma se acuerda antes.
- Legal meaning preserved: Yes; optional contact and four languages preserved.

### 692 — REQUEST_CHANGES

- Location: `src/content/columns-es/692-return-spain-unpaid-taiwan-wages.md:60`. Initial SHA `dce7864d575ac514a051a48e499c12262551ded1686b6047d798bfb01427c1be`.
- Exact span: Una primera [consulta](/es/contact) puede hacerse por correo a [wei@hoveringlaw.com.tw](mailto:wei@hoveringlaw.com.tw); se atiende en inglés, chino, japonés o coreano, y el idioma se acuerda antes.
- Reason: MONOTONY: Repeated paragraph opener Una 3.
- Proposed narrow repair: Para una primera [consulta](/es/contact), puede escribir a [wei@hoveringlaw.com.tw](mailto:wei@hoveringlaw.com.tw); se atiende en inglés, chino, japonés o coreano, y el idioma se acuerda antes.
- Legal meaning preserved: Yes; optional contact and four languages preserved.

## Initial no-repair decisions

The initial body differences for HI671, FR674/678, IT685/686/687/688 and ES689/693 pass this bounded review. They preserve the statutory scope, deadlines, exceptions and actual consultation languages. IT688 keeps advance interpreter notice practical rather than a condition of the right. ES693’s new title properly distinguishes the conflict rules for divorce and matrimonial property. No bold, invented human review/byline, foreign licensure, guaranteed recovery or new mandatory legal obligation was introduced in these differences. Exact hashes are in the manifest; final decisions must refer to the later frozen-source table if any file changes.

## Official current sources opened

Opened the operative text on 2026-10-25, not merely a link or search snippet. MOJ pages display a consolidation cutoff of 2026-10-16. Civil Code’s pending-commencement banner concerns166-1/1223, not the operative provisions reviewed here. This narrow run does not re-announce unchanged text as newly researched across the entire corpus.

- [B0010001 §402](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=402): DE683/ES691: final foreign judgments and four nonrecognition grounds; neutral evidence mapping.
- [B0000001 §767](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=767): DE681: return against an unauthorized possessor, subject to possession entitlement.
- [B0010001 §523](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=523): HI669: inability/difficulty of later enforcement is the attachment threshold, including the foreign-enforcement statutory presumption.
- [B0010001 §509](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=509): HI669: unperformed counter-performance and foreign/public service bars; foreign creditor nationality is not itself a bar.
- [B0000001 §356](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=356): ID668/HI670: prompt ordinary inspection and notice, ordinary-inspection latent-defect exception, later notice and deemed acceptance.
- [N0030002 §7-3](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030002&flno=7-3): HI671: separate post-employment advance lump sum or monthly compensation arrangement; no change to the50%/other cumulative factors.
- [D0060125 §16](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0060125&flno=16): HI672: local-government residential-rental conciliation fee exemption, not all legal costs.
- [C0010001 §99](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=99): IT688: interpretation where language is not understood; advance notice is not a condition creating the right.
- [C0010001 §95](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=95): IT688: silence/counsel/favorable-evidence notice; legal-aid eligibility is qualified.
- [B0000007 §48](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=48): ES693: written matrimonial-property choice and fallback connections, with local immovable-property proviso.
- [B0000007 §50](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=50): ES693: divorce connection at agreement/filing time can differ from property rules.
- [N0030001 §14](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=14): TH659: contractual nonpayment can permit termination without notice; practical document check is not a newly invented prerequisite.
- [N0090001 §59](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=59): TH659: covered worker category, qualifying event and central approval for transfer; complaint is not a work permit.
- [N0030001 §2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=2): TH660/HI671: average wage is a statutory calculation, not merely basic salary.
- [B0000001 §130](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=130): HI669/TH663: demand-based interruption is conditional on action within six months.
- [B0000001 §761](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=761): DE681: delivery and alternatives; indirect possession and assignment of return claim stay alternatives, not cumulative requirements.
- [Current firm contact](https://tseng-law.com/en/contact): verified `wei@hoveringlaw.com.tw`; English, Chinese, Korean and Japanese consultations; other-language arrangements require confirmation and are not guaranteed. Initial inquiry excludes sensitive information. All23 keep those boundaries.

Reports are editorial results, not publication authority, a legal opinion on an individual case, human-native certification or proof of browser/public verification. Failed drafts must be preserved after two unsuccessful targeted passes; the orchestrator owns repairs and publication.
