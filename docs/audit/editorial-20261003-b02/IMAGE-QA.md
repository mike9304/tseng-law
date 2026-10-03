# Batch 002 image packaging QA

Recorded: 2026-10-03T21:48:35+09:00

Scope: seven parent-selected PNGs copied byte-for-byte into this batch’s images directory. Original generation files are preserved. No resizing, cropping, retouching, repository integration or publication was performed during packaging.

The selected source of each image was opened with view_image before the recommendations below were written. File equality establishes that these observations apply to the packaged files. These are AI visual checks and locale-language wording recommendations; no human native-language review is asserted.

## Provenance and verification

- IMAGE-MANIFEST.json records the exact initial prompts from IMAGE-PROMPTS.json and all three exact edit prompts from IMAGE-EDITS.json.
- For the three edited images, edits[].path is recorded as the edit input, and the parent-selected file is recorded separately as the edit output. The input is not mistaken for the selected image.
- PNG dimensions were read from the IHDR bytes. SHA-256 and full byte equality were checked for all seven selected-source/output pairs.
- A 16:9 composition was requested in the prompts; the table reports actual PNG dimensions without resizing.
- Partial faces in the family-call, ticket and immigration scenes are explicitly recorded. No face-free claim is made for those images.
- The ticket phone screen has a QR-like pattern. No decoder or real ticketing service was used; validity, invalidity and scannability are untested. Prompt wording requesting an unscannable pattern is not treated as a test result.
- Paperwork, icons and phone/computer displays are illustrative. The recommendations do not identify them as issued documents, verified reservations, valid tickets or official websites.

| Slug | Locale | Dimensions | Bytes | SHA-256 |
| --- | --- | --- | ---: | --- |
| family-voice-impersonation-transfer-taiwan | zh-hant | 1672 × 941 | 1965352 | `fc2cd1fb67c5d9d6edbaae43fb7542f8cc200448a69dc9c77b9f4ec0f47faacc` |
| secondhand-concert-ticket-screenshot-taiwan | zh-hant | 1672 × 941 | 1907778 | `135b12737f54df79f34c8cca4d44aff3512234334ca1fc5090a293897aa354d2` |
| presale-home-payee-developer-agent-taiwan | zh-hant | 1672 × 941 | 1817172 | `80e5129460591aa556f0753cc92c249ec3923f40e38c0afb49e3199e20292775` |
| unordered-cash-on-delivery-parcel-taiwan | zh-hant | 1672 × 941 | 1973045 | `f1e0dc0c4bca419acc3cf95525470a39e512e04fb968116d137c03241295b13a` |
| taiwan-hotel-booking-extra-payment-phishing | ja | 1672 × 941 | 1831620 | `5b47d490ee11332688674afaf1f4b9157da348f79449ec21a28f6a00e9e7c1c9` |
| immigration-officer-impersonation-arc-taiwan | en | 1672 × 941 | 1792058 | `766c46e3f2c1ed9cfd64820287f73e9076ab94a19cada6ef0c6e0a7a9c9b0d35` |
| lost-korean-passport-taiwan-return-travel-documents | ko | 1672 × 941 | 2006842 | `ed8bf5f21d965305a877ccc7da7c2937009bc6007b7fac8ad837636e59830776` |

## Scene checks and wording for writers

### family-voice-impersonation-transfer-taiwan

Selected source: `/Users/son7/.codex/generated_images/01a10169-8632-72c2-aea0-63c905035c9f/exec-492b6bd9-79e5-4d6e-9c90-febdcd53593b.png`

Packaged image: `images/family-voice-impersonation-transfer-taiwan.png`

Intended public path: `/images/columns/editorial-20261003-b02/family-voice-impersonation-transfer-taiwan.png`

Visual check: A person holds a corded telephone receiver. A smartphone with a waveform, a mug and a blurred family-style photo frame are on the table. Part of the nose, mouth and chin is visible; this is not a fully face-free crop.

Recommended alt (zh-hant): 一人坐在木桌前拿起室內電話聽筒，桌上手機顯示波形，旁邊放著茶杯和模糊的相框。

Recommended caption (zh-hant): AI生成的示意畫面，並非真實人物、通話紀錄或案件影像。

### secondhand-concert-ticket-screenshot-taiwan

Selected source: `/Users/son7/.codex/generated_images/01a10169-8632-72c2-aea0-63c905035c9f/exec-972cbf8a-0e05-4828-a181-4bfa10c99845.png`

Packaged image: `images/secondhand-concert-ticket-screenshot-taiwan.png`

Intended public path: `/images/columns/editorial-20261003-b02/secondhand-concert-ticket-screenshot-taiwan.png`

Visual check: A person points at a ticket-like phone display with a QR-like square pattern. Two ticket-shaped paper slips, a pen and an envelope lie on the table; blurred colored lights are visible through the window. Mouth and chin are visible. No claim is made that the block pattern is valid, invalid, scannable or unscannable.

Recommended alt (zh-hant): 一人指向手機上帶有方塊圖樣的票券樣式畫面，桌上放著兩張票券樣式的紙張、筆和信封，窗外有模糊的舞台燈光。

Recommended caption (zh-hant): AI生成的示意畫面。畫面中的票券與手機介面為虛構，並非實際票券、購票憑證或案件證據。

### presale-home-payee-developer-agent-taiwan

Selected source: `/Users/son7/.codex/generated_images/01a10169-8632-72c2-aea0-63c905035c9f/exec-2cb3bae1-ea07-4a71-9445-7aad2b50642d.png`

Packaged image: `images/presale-home-payee-developer-agent-taiwan.png`

Intended public path: `/images/columns/editorial-20261003-b02/presale-home-payee-developer-agent-taiwan.png`

Visual check: Two people are shown as torsos and hands beside a neutral apartment model, folders, an architectural rendering and a floor plan. The foreground sheet with payment-flow icons and arrows has been removed in the selected edit; clean wooden tabletop remains there. The image does not establish a legally prescribed payment flow.

Recommended alt (zh-hant): 兩人坐在擺有公寓模型的木桌旁，一人握筆、另一人指著文件；桌上另有建築示意圖與平面圖。

Recommended caption (zh-hant): AI生成的示意畫面，並非真實建案、契約或付款指示，也不表示法定付款流程。

### unordered-cash-on-delivery-parcel-taiwan

Selected source: `/Users/son7/.codex/generated_images/01a10169-8632-72c2-aea0-63c905035c9f/exec-80a1af53-39bd-4657-a1ee-c367e7965156.png`

Packaged image: `images/unordered-cash-on-delivery-parcel-taiwan.png`

Intended public path: `/images/columns/editorial-20261003-b02/unordered-cash-on-delivery-parcel-taiwan.png`

Visual check: At a doorway, one hand rests on a closed wallet and another on a plain parcel with a blank label. A smartphone lies nearby. The selected edit crops both people below their faces. No cash exchange is visible and no person is identified as an offender.

Recommended alt (zh-hant): 玄關木桌上放著貼有空白標籤的紙箱、手機和闔上的皮夾；一人的手按著皮夾，另一人的手扶著紙箱。

Recommended caption (zh-hant): AI生成的示意畫面，人物與包裹均為虛構，並非真實物流業者、訂單或案件影像。

### taiwan-hotel-booking-extra-payment-phishing

Selected source: `/Users/son7/.codex/generated_images/01a10169-8632-72c2-aea0-63c905035c9f/exec-d2bd69e3-2ff5-4e8d-b287-1ad5dccf3ed8.png`

Packaged image: `images/taiwan-hotel-booking-extra-payment-phishing.png`

Intended public path: `/images/columns/editorial-20261003-b02/taiwan-hotel-booking-extra-payment-phishing.png`

Visual check: A torso and hands are visible in a hotel-like room. One hand holds a sheet with a room image while another points at the phone. A landline, cup, notepad and travel pouch sit on the desk, with luggage and a bed behind it. The selected edit contains no visible face or chin. The receiver is on the phone base, not being held; the alt follows the selected image rather than the initial prompt.

Recommended alt (ja): ベッドとスーツケースのある室内で、人物が部屋の写真を載せた紙を持ち、机上のスマートフォンを指しています。横に固定電話が置かれています。

Recommended caption (ja): AI生成の架空の場面です。実在する宿泊施設、予約確認書、決済画面や被害事例を示すものではありません。

### immigration-officer-impersonation-arc-taiwan

Selected source: `/Users/son7/.codex/generated_images/01a10169-8632-72c2-aea0-63c905035c9f/exec-b6bed0fe-c799-4132-b589-2e0ed97f7ffa.png`

Packaged image: `images/immigration-officer-impersonation-arc-taiwan.png`

Intended public path: `/images/columns/editorial-20261003-b02/immigration-officer-impersonation-arc-taiwan.png`

Visual check: A person with a partially visible chin holds a telephone receiver and a folder. The laptop contains a generic building icon and contact symbols. A closed card holder, notebook and mug sit on the desk. No actual ARC or passport is shown; the generic screen is not described as an official agency website.

Recommended alt (en): A person holds a telephone receiver and an open folder beside a laptop showing a building icon and generic contact symbols. A closed card holder rests on the desk.

Recommended caption (en): AI-generated illustrative scene. The person, documents and contact screen are fictional; this is not an official immigration website, identity document or record of an actual case.

### lost-korean-passport-taiwan-return-travel-documents

Selected source: `/Users/son7/.codex/generated_images/01a10169-8632-72c2-aea0-63c905035c9f/exec-46b90f33-8475-4ee7-af7c-3a6956e03297.png`

Packaged image: `images/lost-korean-passport-taiwan-return-travel-documents.png`

Intended public path: `/images/columns/editorial-20261003-b02/lost-korean-passport-taiwan-return-travel-documents.png`

Visual check: An adult torso and hands are visible at an airport-like counter, holding an empty dark-green passport sleeve. An open travel bag, blank papers and card-shaped slip, pen and smartphone sit nearby. No passport or travel document is represented as an issued or valid document.

Recommended alt (ko): 공항처럼 보이는 공간의 카운터에서 한 사람이 빈 초록색 여권 커버를 펼쳐 들고 있습니다. 옆에는 열린 여행 가방, 종이, 펜과 휴대전화가 놓여 있습니다.

Recommended caption (ko): AI로 만든 설명용 이미지입니다. 실제 인물·여권·항공권·여행증명서나 분실 사례를 촬영한 사진이 아닙니다.

## Verification command and outcome

The packaging command used Python pathlib, shutil.copyfile, hashlib.sha256 and struct.unpack on the PNG IHDR. It asserted each selected source and packaged file were byte-identical, then wrote the manifest and this QA record. The separate readback command below is the final evidence:

```text
python3: reload IMAGE-MANIFEST.json; assert 7 unique assets; for each asset verify source/output byte equality, SHA-256, PNG dimensions, exact source prompt, exact edit prompt and edit input/output provenance.
Result: 7/7 assets passed. Exact initial prompts: 7/7. Exact edit prompts and provenance: 3/3. Source originals preserved.
```

The checks cover local media packaging. Mobile page crops and published captions must be assessed at integration; this record does not claim a rendered-page or deployment check.
