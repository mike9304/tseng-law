# Batch 004 first-two image packaging QA

Recorded: 2026-10-03T23:09:18+09:00

Status: first two images ready. This is not completion of Batch 004. The parent selected seven topics; the remaining five topic images have not yet been generated as of this record.

The two selected source images were directly opened with view_image, then copied unchanged to images/. The original generation files and root-owned IMAGE-PROMPTS-01.json were preserved. No repository, draft or evidence files were edited.

## Metadata and provenance

IMAGE-MANIFEST.json stores each exact generation prompt from IMAGE-PROMPTS-01.json, source path, copied path, intended public path, PNG dimensions, byte size and SHA-256. A 16:9 composition was requested; the actual output dimensions below are reported without resizing.

| Slug | Dimensions | Bytes | SHA-256 |
| --- | --- | ---: | --- |
| home-leak-defect-notice-repair-evidence-taiwan | 1672 × 941 | 1899200 | `86a13f2c630a0125762aecd4f348a0b365beb758b67f3ddda4b4d8d321472cbb` |
| contractor-employee-status-control-work-taiwan | 1672 × 941 | 1873776 | `626ea5f8834b1895b64a1523b8883b0e005e841248e83a98cd1987507c063063` |

## Scene checks and suggestions for writers

These alt/caption strings are suggestions based on direct image viewing. They are not claims of human native-language review or legal approval. Both scenes are AI-generated fictional illustrations, not actual client, property, document or case photographs.

### home-leak-defect-notice-repair-evidence-taiwan

Writer: `/root/batch002_write_zh_property`

Source: `/Users/son7/.codex/generated_images/01a10169-8632-72c2-aea0-63c905035c9f/exec-6969c030-49fc-4e59-aa6b-f20bafa9b2a0.png`

Packaged: `images/home-leak-defect-notice-repair-evidence-taiwan.png`

Intended public path: `/images/columns/editorial-20261003-b04/home-leak-defect-notice-repair-evidence-taiwan.png`

Neutral description: A person holds a smartphone toward an irregular water-marked patch on the wall below a window. The glass has droplets, and a wooden side table with a plant and cup stands nearby. Only the person's hands, sleeves and part of the torso are visible.

Visual check: The wall has an irregular darker patch and thin vertical water trails. The phone shows a view of the window and wall without readable personal data. No face, property address, official document or readable timestamp is visible.

Interpretation limits: The image does not establish the origin, cause, age or legal responsibility for the water marks. Do not describe a plumbing defect, structural defect, mold diagnosis, intentional concealment or an actual disputed property.

Suggested alt (zh-hant): 一人拿著手機對準窗下帶有不規則水痕的牆面，旁邊的木桌上放著盆栽和杯子。

Suggested caption (zh-hant): AI生成的示意畫面，並非真實房屋、客戶或案件照片，也不表示已判定水痕的成因。

### contractor-employee-status-control-work-taiwan

Writer: `/root/review_fraud_zh`

Source: `/Users/son7/.codex/generated_images/01a10169-8632-72c2-aea0-63c905035c9f/exec-d48b9fa7-5cd9-452c-8c4e-cf09c92b94eb.png`

Packaged: `images/contractor-employee-status-control-work-taiwan.png`

Intended public path: `/images/columns/editorial-20261003-b04/contractor-employee-status-control-work-taiwan.png`

Neutral description: A person holds two papers at a wooden office desk: one with grey lines and one with a grid of muted grey and green blocks. A closed laptop, pen, notebook and blank card holder sit nearby, with a plant and another seated person in the background.

Visual check: The main person's hands and forearms are visible; no facial features are shown. The background person is seen from behind with the head outside the frame. The two sheets contain abstract lines and a schedule-like grid, with no readable names, dates, pay figures, signatures or identifiable company details.

Interpretation limits: The papers are fictional layouts, not authenticated contracts, work schedules or official findings. The grid alone does not establish employment status. Do not describe the image as a real labor dispute or a decision by a court or labor authority.

Suggested alt (zh-hant): 一人在辦公桌前拿著兩張紙，一張有灰色橫線，另一張是帶有灰綠色區塊的表格；桌上放著闔上的筆電、筆、筆記本和空白證件套。

Suggested caption (zh-hant): AI生成的概念示意圖，人物與文件均為虛構，並非真實勞資爭議或案件紀錄。

## Verification scope

The packaging command used Python pathlib, shutil.copyfile, hashlib.sha256 and PNG IHDR dimensions; it asserted source/output byte equality before writing records. A separate readback verifies both sources and copies, manifest hashes/sizes/dimensions, exact prompt text and public target paths. The executed results are reported to the parent.

Executed readback output:

```text
PASS 2/2: originals exist; source and copy byte-equal; SHA-256, byte size and PNG dimensions match.
PASS 2/2: exact generation prompts and B04 public paths match; alt/caption suggestions read back.
PASS: first-two-only status preserved; batch_complete=false; 5 remaining media not yet generated.
```

The metadata and alt/caption suggestions were delivered directly to the leak writer `/root/batch002_write_zh_property` and contractor writer `/root/review_fraud_zh`. Their draft/evidence files remain outside this worker's mutation scope.

This check does not cover the remaining five images, responsive page crops, writer-finalized alt/caption strings, repository integration or deployment.

---

# Batch 004 extension: all seven images ready

Recorded: 2026-10-03T23:22:16+09:00

Current media status: seven of seven selected images are ready. Five new images were directly inspected with view_image and copied unchanged. This completes image packaging only, not article review, integration or publication. The entire first-two record above is preserved verbatim as history.

## Preservation evidence

- First-two manifest SHA before extension: `e557a7d8a2db642f9ab63713f2a4528a90579c7800fae16724465c0caaac6f43`.
- Unchanged first-two QA prefix: 5595 bytes, SHA `855fb3a8273f0337f2e47bb763883acd82147044135077e8b5e2cb8f9742b1cb`.
- Canonical JSON SHA of the unchanged first two asset records: `9a704e4063fa1c9e0b82f085349bcaf015aab30052ac276846f7524e32d4d55a`.
- The two existing image source/output pairs retain their recorded SHA-256 values. No existing PNG was rewritten.
- IMAGE-MANIFEST.json retains the first_two_ready state in history and adds the seven-image state; it links both original prompt records without modifying either.

## Five added assets

| Slug | Locale | Dimensions | Bytes | SHA-256 |
| --- | --- | --- | ---: | --- |
| private-loan-joint-guarantor-first-demand-taiwan | zh-hant | 1672 × 941 | 1961519 | `bd06894bcd1ce3bd42c03173ebef7015ebe7b154a34c56513a6d8d8b688b0559` |
| parent-home-gift-care-obligation-evidence-taiwan | zh-hant | 1672 × 941 | 2004847 | `01f5dde2bbe15399674ab797b92a75e4b7e44bf7b18f382c5af27f63f300410d` |
| taiwan-hotel-luggage-loss-custody-japanese | ja | 1672 × 941 | 1926898 | `7a769a5dd4fd9493bb5afdefd13456940bc9b5110ee3245b6e9eb0069fb8cbca` |
| taiwan-landlord-entry-rental-home-repairs | en | 1672 × 941 | 1835988 | `c85fda0df1d4766ac83e63c4be451a861481a03b2ed792c9ada80945a1f4a5f1` |
| taiwan-unpaid-invoice-settlement-release-korean | ko | 1672 × 941 | 1746023 | `583778392ca2de359c18532a7e6ec367c48202fbe05292c0695cbf668c4c9f81` |

## Scene checks and writer suggestions

### private-loan-joint-guarantor-first-demand-taiwan

Writer: `/root/repair_semi_zh`

Source: `/Users/son7/.codex/generated_images/01a10169-8632-72c2-aea0-63c905035c9f/exec-b8525c18-0571-4c34-8b84-f1e456bf2dc7.png`

Packaged: `images/private-loan-joint-guarantor-first-demand-taiwan.png`

Intended public path: `/images/columns/editorial-20261003-b04/private-loan-joint-guarantor-first-demand-taiwan.png`

Neutral description: Two people sit at a wooden cafe table with a single paper between them. One points at its pale grey lines while the other holds a pen above it. Two cups and a closed notebook are on the table; faces are outside the frame.

Visual check: The paper contains abstract pale strokes without identifiable names or readable loan terms. The pen is held above the sheet and no completed signature is visible. No face, bank data or official seal is shown.

Interpretation limits: The scene does not establish an actual loan, guarantee, signature, debt or demand for payment. Do not identify the people as real borrowers, guarantors, creditors or lawyers.

Suggested alt (zh-hant): 兩人坐在木桌前查看一張帶有灰色線條的紙，一人指著紙面，另一人將筆停在紙上方；桌上放著兩個杯子和闔上的筆記本。

Suggested caption (zh-hant): AI生成的示意畫面，人物與文件均為虛構，並非真實借貸、保證契約或案件紀錄。

### parent-home-gift-care-obligation-evidence-taiwan

Writer: `/root/repair_semi_zh`

Source: `/Users/son7/.codex/generated_images/01a10169-8632-72c2-aea0-63c905035c9f/exec-7cabd26b-9bee-4e47-a01c-dcad02343b4a.png`

Packaged: `images/parent-home-gift-care-obligation-evidence-taiwan.png`

Intended public path: `/images/columns/editorial-20261003-b04/parent-home-gift-care-obligation-evidence-taiwan.png`

Neutral description: Two people sit at a dining table with an open planner, a sheet bearing a simple house icon and pale grey lines, and a key with a house-shaped keyring. One hand points at the planner while the other person holds a pen above the sheet; cups and a domestic doorway are nearby.

Visual check: The framing shows hands and torsos, with a small portion of neck or lower chin at the top edge rather than a full identifiable face. The planner is largely blank, and the sheet contains abstract marks and a decorative house icon. No signed deed, official seal or verified care record is shown.

Interpretation limits: Do not infer the people's actual family relationship, a completed home transfer, a binding care agreement, mistreatment or a medical condition. The key and house icon are scene elements, not proof of ownership.

Suggested alt (zh-hant): 兩人在餐桌前查看攤開的計畫本與一張帶有房屋圖示的紙，桌上放著鑰匙和杯子。

Suggested caption (zh-hant): AI生成的概念示意圖，人物與文件均為虛構，並非真實贈與契約、照護紀錄或案件照片。

### taiwan-hotel-luggage-loss-custody-japanese

Writer: `/root/review_fraud_ja_legal`

Source: `/Users/son7/.codex/generated_images/01a10169-8632-72c2-aea0-63c905035c9f/exec-00e45500-885a-4c22-aa7b-33b8492d8b30.png`

Packaged: `images/taiwan-hotel-luggage-loss-custody-japanese.png`

Intended public path: `/images/columns/editorial-20261003-b04/taiwan-hotel-luggage-loss-custody-japanese.png`

Neutral description: A hand holds a blank cream tag in front of a counter in a warm lobby-like setting. A green suitcase and a small bag stand behind the counter, with shelving, plants and other bags in the background.

Visual check: Only the hand and sleeve are visible. The tag has no readable name, room number, barcode or identifying text. No passport, staff face or named hotel is shown.

Interpretation limits: The tag is an illustrative blank tag, not an issued baggage receipt. The image does not prove that custody was accepted, a specific item was lost, theft occurred or a hotel accepted liability.

Suggested alt (ja): 無地のタグを持つ手の向こうに、緑色のスーツケースと小さなバッグが置かれたカウンターが見えます。

Suggested caption (ja): AI生成の架空の場面です。実在する宿泊施設、荷物の預かり証、紛失事故や相談事例を示す写真ではありません。

### taiwan-landlord-entry-rental-home-repairs

Writer: `/root/batch002_write_en`

Source: `/Users/son7/.codex/generated_images/01a10169-8632-72c2-aea0-63c905035c9f/exec-b4ebe108-ddcd-472a-a546-a2af21281401.png`

Packaged: `images/taiwan-landlord-entry-rental-home-repairs.png`

Intended public path: `/images/columns/editorial-20261003-b04/taiwan-landlord-entry-rental-home-repairs.png`

Neutral description: A person holds a phone showing colored calendar-like blocks inside a home facing a closed green entrance door. A desk calendar and keys sit on an entry table, with a closed toolbox beside the wall.

Visual check: No face or entering person is visible. The phone and paper calendar contain fictional grid layouts and small illustrative marks. The toolbox is closed, and the door remains shut; no completed repair or appointment is depicted.

Interpretation limits: Do not identify the person as an actual tenant or landlord, describe an intrusion, or claim that the calendar establishes permission, a legally required notice period or a confirmed repair appointment.

Suggested alt (en): A person holds a phone showing colored calendar-like blocks inside a home facing a closed green entrance door. A desk calendar, keys and a closed toolbox are nearby.

Suggested caption (en): AI-generated fictional scene. The room and calendar displays do not depict an actual rental dispute, entry incident or confirmed repair appointment.

### taiwan-unpaid-invoice-settlement-release-korean

Writer: `/root/repair_semi_ko_ja`

Source: `/Users/son7/.codex/generated_images/01a10169-8632-72c2-aea0-63c905035c9f/exec-76e09e31-0a62-4eaf-b0f1-bc9ff4dbe540.png`

Packaged: `images/taiwan-unpaid-invoice-settlement-release-korean.png`

Intended public path: `/images/columns/editorial-20261003-b04/taiwan-unpaid-invoice-settlement-release-korean.png`

Neutral description: Two people at an office desk compare a sheet of pale grey lines with a separate table-like sheet. One points at the first sheet, while a pen rests on the desk. Plain cartons and a softly blurred port view appear in the background.

Visual check: Hands and torsos are visible, with no face. The papers contain abstract lines and a table-like layout rather than readable company names, amounts, bank details or signed terms. The pen lies on the table, and no money transfer or signing is shown.

Interpretation limits: Do not call the papers an executed settlement or verified payment schedule, identify a real business or port, or imply completed payment, an effective release or a court decision.

Suggested alt (ko): 상자가 놓인 사무실 책상에서 두 사람이 회색 선이 있는 종이와 표 형태의 종이를 살펴보고 있습니다. 펜은 책상 위에 놓여 있습니다.

Suggested caption (ko): AI로 만든 가상의 설명용 이미지입니다. 실제 기업·거래·합의서·지급 내역이나 사건 사진이 아닙니다.

## Extension validation scope

The five new files were compared byte-for-byte with their selected original files. All seven image sources, outputs, SHA-256 values, dimensions, exact prompts and public paths are checked again during separate readback. The original two asset records and the complete first-two QA prefix are independently checked against their recorded hashes.

The native-language alt/caption strings are writer suggestions derived from the actual images. The scenes are AI-generated fictional illustrations, not real legal evidence, issued documents, actual clients or verified transactions. No human native-language review, legal approval, responsive page crop check or publication is asserted here.

Executed separate Python readback output:

```text
PASS 7/7: selected source/output bytes, SHA-256, byte size and PNG dimensions match.
PASS 7/7: exact prompt text, prompt-record hashes, intended B04 public paths and writer suggestions match.
PASS 2/2 preservation: existing PNG SHA values and complete original asset records are unchanged.
PASS history: first_two_ready status retained; original QA prefix byte hash unchanged; 7 images ready, 0 pending.
```

The five additions' metadata and alt/caption suggestions were delivered directly to `/root/repair_semi_zh` (two ZH images), `/root/review_fraud_ja_legal` (JA), `/root/batch002_write_en` (EN), and `/root/repair_semi_ko_ja` (KO). No writer file was edited by this packaging worker.
