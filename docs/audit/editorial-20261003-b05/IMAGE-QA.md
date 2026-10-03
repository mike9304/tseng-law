# Batch 005 provisional-six image packaging QA

Recorded: 2026-10-04T00:07:44+09:00

Status: six accepted images are ready for writer metadata review. Batch image packaging is not complete: the KO original was rejected by root, is preserved unused, and awaits an approved regenerated replacement. No seventh target image is packaged by this record.

All six accepted originals were directly opened with view_image, then copied without resizing, cropping or retouching. Root-owned prompt/results files, original images and writer draft/evidence files remain unchanged.

## Provenance and copy verification

The manifest records exact prompt strings from IMAGE-PROMPTS.json, accepted root decisions from IMAGE-GENERATION-RESULTS.json, source/output paths, intended public paths, actual PNG dimensions, sizes and SHA-256 values. The root results are snapshotted with their packaging-time hash because the retry result may be added later.

| Slug | Locale | Dimensions | Bytes | SHA-256 |
| --- | --- | --- | ---: | --- |
| annual-leave-dates-employer-scheduling-taiwan | zh-hant | 1672 × 941 | 1780466 | `72fa92b1d4ca86a014e4acf6a8c8caf2697a746303c3d70a04918d25d4d9e58e` |
| rental-electricity-average-price-bill-taiwan | zh-hant | 1672 × 941 | 1903905 | `658b7e09773e1c1bc6046160a39cbac719f3928cff09da89c939b1fd0280085d` |
| limited-company-shareholder-books-inspection-taiwan | zh-hant | 1672 × 941 | 1839796 | `03da51b7bb87859cdac0c864cfab7fdd4cac2655fe0ba46c478477e3c1f9052f` |
| handwritten-will-typed-print-signature-taiwan | zh-hant | 1672 × 941 | 1841222 | `15e78ec008d211ef2a0acb49f1ae632a6382cfa94ece1128f5923e703cbfbe44` |
| taiwan-hotel-typhoon-cancellation-refund-japanese | ja | 1672 × 941 | 2193598 | `9c1e5e0592d29f656e40d1f675fba7f7ff513af8128361af77fdd9c339761368` |
| taiwan-personal-data-access-copy-request | en | 1672 × 941 | 1874302 | `54c36b5614231c32dff235393524ecf146e84ec6e74fb58400fd4dcdcc3ef4cf` |

## Six scene checks and suggestions

These are AI visual observations and locale-language suggestions, not a claim of human native-language review. Writers decide their final alt/caption after viewing the actual image. The scenes must remain identified as fictional AI illustrations.

### annual-leave-dates-employer-scheduling-taiwan

Writer: `/root/review_fraud_zh`

Source: `/Users/son7/.codex/generated_images/01a10169-8632-72c2-aea0-63c905035c9f/exec-c70760a4-1bd1-438f-a478-a907045b4575.png`

Packaged: `images/annual-leave-dates-employer-scheduling-taiwan.png`

Intended public path: `/images/columns/editorial-20261003-b05/annual-leave-dates-employer-scheduling-taiwan.png`

Neutral description: A hand adjusts an orange paper tab on a blank calendar grid beside a green tab. A closed notebook, pen, plant and extra paper tabs sit on the desk.

Visual observations: The calendar has a grid without visible dates or weekday labels. One orange tab is held by the hand and a green tab rests on the grid. No person's face or actual leave form is visible.

Interpretation limits: The image does not establish leave dates, the number of leave days, an employer's order, a request or an approval.

Suggested alt (zh-hant): 一隻手在沒有日期文字的桌曆格線上調整橘色紙條，旁邊已有一張綠色紙條；桌上放著筆記本、筆與盆栽。

Suggested caption (zh-hant): AI生成的示意畫面，並非真實排班、請假申請或核准紀錄。

### rental-electricity-average-price-bill-taiwan

Writer: `/root/batch002_write_zh_property`

Source: `/Users/son7/.codex/generated_images/01a10169-8632-72c2-aea0-63c905035c9f/exec-22013d5e-72fc-4d77-b22f-a93a2706b881.png`

Packaged: `images/rental-electricity-average-price-bill-taiwan.png`

Intended public path: `/images/columns/editorial-20261003-b05/rental-electricity-average-price-bill-taiwan.png`

Neutral description: A person holds a folded sheet with pale grey and teal blocks in a hallway beside a wall-mounted electricity meter. Doors and plants appear along the hall.

Visual observations: The paper contains abstract rules, blocks and a chart-like pattern. The meter has a small display with faint digit-like marks; these are not a verified meter reading or amount. The scene shows no exposed wiring or electrical repair.

Interpretation limits: Do not describe the paper as an actual bill or infer electricity use, a tariff, an average price, a charge, overbilling or a legal calculation from the meter display or chart.

Suggested alt (zh-hant): 一人在走廊上拿著帶有灰綠色線條和區塊的摺頁紙張，旁邊牆上裝有電表，後方可見房門與盆栽。

Suggested caption (zh-hant): AI生成的示意畫面，紙張與電表顯示均為虛構，並非真實帳單、用電度數、電價或案件紀錄。

### limited-company-shareholder-books-inspection-taiwan

Writer: `/root/repair_semi_zh`

Source: `/Users/son7/.codex/generated_images/01a10169-8632-72c2-aea0-63c905035c9f/exec-133bffe2-075d-49ae-a1d5-147d327bce24.png`

Packaged: `images/limited-company-shareholder-books-inspection-taiwan.png`

Intended public path: `/images/columns/editorial-20261003-b05/limited-company-shareholder-books-inspection-taiwan.png`

Neutral description: Two people review open grid-like pages at a wooden table. One points with a pen while the other holds a loose sheet above the open book. A grey binder, notebook and cup sit nearby.

Visual observations: Only torsos and hands are visible. The open book and loose sheets contain faint abstract grid layouts, without identifiable company details or readable account figures. The image does not show removal of records, cash or a handshake.

Interpretation limits: The papers are not authenticated company books. Do not infer shareholder status, an authorized inspection, disclosure of confidential records, wrongdoing or an inspection outcome.

Suggested alt (zh-hant): 兩人在木桌前查看攤開的表格頁面，一人持筆指向紙面，桌上另有灰色資料夾和筆記本。

Suggested caption (zh-hant): AI生成的概念示意圖，人物與文件均為虛構，並非真實公司帳冊、股東查閱或案件紀錄。

### handwritten-will-typed-print-signature-taiwan

Writer: `/root/repair_semi_zh`

Source: `/Users/son7/.codex/generated_images/01a10169-8632-72c2-aea0-63c905035c9f/exec-90653534-ddd5-48c7-a3cd-47c7a6babdcf.png`

Packaged: `images/handwritten-will-typed-print-signature-taiwan.png`

Intended public path: `/images/columns/editorial-20261003-b05/handwritten-will-typed-print-signature-taiwan.png`

Neutral description: A hand rests near a fountain pen beside a cream sheet with soft landscape-like artwork and abstract lines. A closed laptop, books and a cup sit farther back on the wooden desk.

Visual observations: The cream sheet contains painterly landscape-like shapes and abstract strokes, not a written will. No writing or signing action, signature, date or will clause is visible on that sheet. The person's face is outside the frame.

Interpretation limits: Do not call the sheet a handwritten, typed, printed or executed will. The artwork and nearby pen do not establish testamentary intent, capacity, formal validity or a signature.

Suggested alt (zh-hant): 木桌上放著帶有淡色圖畫紋理的紙和鋼筆，一隻手停在筆旁，後方是闔上的筆電、書本和杯子。

Suggested caption (zh-hant): AI生成的概念示意圖，紙上的圖樣不是文字遺囑，並非真實遺囑、簽署紀錄或案件照片。

### taiwan-hotel-typhoon-cancellation-refund-japanese

Writer: `/root/review_fraud_ja_legal`

Source: `/Users/son7/.codex/generated_images/01a10169-8632-72c2-aea0-63c905035c9f/exec-2161a2fc-8625-40de-9c26-04f01e8aff35.png`

Packaged: `images/taiwan-hotel-typhoon-cancellation-refund-japanese.png`

Intended public path: `/images/columns/editorial-20261003-b05/taiwan-hotel-typhoon-cancellation-refund-japanese.png`

Neutral description: A seated person holds a sheet bearing a plane icon, abstract lines and a small landscape image beside a rain-speckled window. A suitcase stands nearby, with a blurred city skyline outside and a lamp and cup inside.

Visual observations: The plane icon is visible on the fictional paper, but there is no readable booking number, cancellation notice, flight status or refund approval. The person's face is outside the frame. Rain and the skyline are illustrative scene elements.

Interpretation limits: The paper and rainy window are not evidence of a real reservation, canceled flight, typhoon, transport disruption, hotel closure or entitlement to a refund.

Suggested alt (ja): 雨粒のついた窓のそばで、人物が飛行機のアイコンと抽象的な線がある紙を持っています。横にスーツケースが置かれています。

Suggested caption (ja): AI生成の架空の場面です。紙面や窓外の景色は実際の予約、欠航、台風被害や返金決定を示すものではありません。

### taiwan-personal-data-access-copy-request

Writer: `/root/batch002_write_en`

Source: `/Users/son7/.codex/generated_images/01a10169-8632-72c2-aea0-63c905035c9f/exec-57f9fba1-48f6-4e9c-a16b-3691d0cfdfa4.png`

Packaged: `images/taiwan-personal-data-access-copy-request.png`

Intended public path: `/images/columns/editorial-20261003-b05/taiwan-personal-data-access-copy-request.png`

Neutral description: A person holds a pen over an open notebook beside a laptop displaying abstract stacked panels. A plain folder lies on the desk, with books, a cup and plants nearby and a resting cat in the background.

Visual observations: Only the person's hands and torso are visible. The laptop screen contains abstract cards and lines over a scenic background, without readable account data or an identifiable service interface. No identity card, password or approval/deletion confirmation is shown.

Interpretation limits: Do not describe the screen as an official portal, actual personal-data record, submitted access request, completed disclosure or deletion result.

Suggested alt (en): A person holds a pen over an open notebook beside a laptop displaying abstract stacked panels, with a plain folder on the desk.

Suggested caption (en): AI-generated fictional illustration. The screen and papers are abstract and do not contain a real personal-data record, completed access request or official response.

## Excluded KO original — preserved, not used

Slug: `taiwan-trademark-nonuse-three-years-korean-brand`

Original: `/Users/son7/.codex/generated_images/01a10169-8632-72c2-aea0-63c905035c9f/exec-8abeaa12-d26a-4b2f-acfb-6a1aa040905c.png`

SHA-256: `d431a3b2bc19884aac765dfb0aea6c1ec709084a534260f9354900c3847a896d`; dimensions: 1672 × 941; bytes: 1961488.

Root decision: REJECTED_REGENERATE. Root reported that unrequested split-panel symbols/scales falsely suggested automatic legal outcomes. This packager did not visually review the rejected image or select it for use; only its file metadata was read. The source remains in place and no public-target copy is present.

An approved replacement must be directly viewed, checked and appended later with its own retry prompt and source provenance. The initial rejected image and this six-ready history must remain preserved.

## Verification scope

The packaging command asserts full source/output byte equality, reads PNG IHDR dimensions and calculates SHA-256. A separate readback checks the six source/output pairs, exact prompts, public paths, suggestions and exclusion of the rejected KO source. Its result is reported to root.

This stage does not claim seventh-image completion, writer-finalized metadata, responsive page crops, repository integration or publication.

Executed separate Python readback output:

```text
PASS 6/6: selected source/output bytes, SHA-256, byte size and PNG dimensions match (1672x941).
PASS 6/6: root accepted-selection snapshot, exact prompt strings, public paths and writer suggestions match.
PASS rejection: original KO source preserved with matching SHA; no rejected-source target copy exists.
PASS status: provisional_six_ready_ko_retry_pending; batch_complete=false; 1 replacement pending.
```

Writer handoff priorities: the will-topic sheet has abstract painterly imagery rather than will text; the Japanese travel sheet contains a plane icon without proving a flight cancellation; the electricity meter's tiny display is not evidence of real use, a price or an amount. The locale suggestions above follow those visible facts.

---

# Batch 005 extension: approved KO retry, all seven images ready

Recorded: 2026-10-04T00:19:09+09:00

Current status: all seven selected images are packaged. The approved KO retry has been added as the seventh image. Completion refers only to image packaging, not article review, integration or publication. The full provisional-six record above remains preserved as history.

## Preservation evidence

- Previous six-ready manifest SHA: `d6422549a04fa545ee6c12735b72b6724cdf39e2f3e4f92097532b408c3f8bee`.
- Preserved QA prefix: 12469 bytes, SHA `f4a6c3b763d65c22177931b696b1348170c5220b25382e50085a86992d4d9d01`.
- Canonical SHA of unchanged six asset records: `095fb8a266e6d76e4118d057e6d789d74525e84d496fd5d7a894b49a1f198e2e`.
- Canonical SHA of unchanged rejected-generation record: `c51cb83c676445bf525d59e48abd5709c227841f012e9435e17879091eff4c2a`.
- The six existing PNGs and all generated source originals retain their recorded hashes. The rejected source is preserved outside the package and has never been copied into the public-target file.
- The earlier unused-generation record retains its historical pending-replacement wording; retry_replacements and the appended history explicitly record the later approved resolution.

## Accepted retry metadata

Slug: `taiwan-trademark-nonuse-three-years-korean-brand`

Writer: `/root/repair_semi_ko_ja`

Selected original: `/Users/son7/.codex/generated_images/01a10169-8632-72c2-aea0-63c905035c9f/exec-07df2d69-ca0c-4123-9a7a-77fbd4ab166d.png`

Packaged image: `images/taiwan-trademark-nonuse-three-years-korean-brand.png`

Intended public path: `/images/columns/editorial-20261003-b05/taiwan-trademark-nonuse-three-years-korean-brand.png`

PNG: 1672 × 941; 1964305 bytes; SHA-256 `28018c48fa4e96b735fd975f8704ad78f2fcaf3a0c015275d6b46e86160c3297`.

Exact retry prompt source: `/Users/son7/tseng-fraud-editorial-20261003/batch-005/IMAGE-PROMPT-RETRY-KO.json`; SHA `ac321354b94ef39191dea64388c1b1e359908cc06ade8061a78d5cdeb711064d`.

Root-approved retry result: `/Users/son7/tseng-fraud-editorial-20261003/batch-005/IMAGE-GENERATION-KO-RETRY-RESULT.json`; SHA `70c9c3f5d1eba670ed316fa1bbcc1cad843d608ac76cbfeea4fa02308b0a3c25`.

Neutral description: A person holds a plain green box in one hand and a paper with faint grey lines in the other. Two more plain boxes, three blank hanging tags and a stack of abstract papers sit on a wooden table in one continuous scene.

Visual observations: Three packages are visible in total: two green and one cream, including the green package held by the person. The tags are blank and the papers show abstract grey lines. Only hands and part of the torso are visible. The image is a single tabletop scene without split panels, scales, arrows, check marks or approval graphics. The prompt requested two packages, but the description follows the three actually visible.

Interpretation limits: The packages, blank tags and abstract papers do not prove actual sales, trademark use, registration, non-use, cancellation or any legal result. Do not identify them as real business records, shipping evidence or a registration certificate.

Suggested alt (ko): 한 사람이 초록색 상자와 회색 선이 있는 종이를 들고 있습니다. 탁자 위에는 표시 없는 상자 두 개와 빈 태그, 종이 묶음이 놓여 있습니다.

Suggested caption (ko): AI로 만든 가상의 설명용 이미지입니다. 포장·태그·종이는 실제 상표 사용이나 판매 실적, 등록·취소 결정을 입증하는 자료가 아닙니다.

## Extension verification scope

The approved original and seventh copy were compared byte-for-byte. Separate readback checks all seven image pairs, metadata and exact prompts, verifies that the prior six asset records and rejected record are unchanged, and validates the preserved QA prefix. Root-owned prompt and result files were read only.

Writer-finalized Korean metadata, responsive page crops, article approval, repository integration and deployment are outside this packaging result.

Executed separate Python readback output:

```text
PASS 7/7: source/output byte equality, SHA-256, byte size, PNG dimensions and exact prompts.
PASS 6/6 preservation: original asset records and image hashes unchanged; provisional-six history and full QA prefix unchanged.
PASS rejected original: source and unused-generation record preserved; rejected SHA absent from all packaged assets.
PASS retry provenance: approved root result, exact retry prompt and seventh public target verified.
PASS root records: original prompts/results and retry prompts/results retain recorded SHA values.
```

The accepted KO source/copy metadata, exact SHA, actual three-box scene and alt/caption suggestions were delivered directly to `/root/repair_semi_ko_ja`. Full staging/source byte equality was separately confirmed to that writer. This worker did not edit any article or evidence file.
