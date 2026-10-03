# Fraud column image provenance — 2026-10-03

이 문서는 생성 자산의 복사·동일성 검증 기록이다. 페이지 통합, 브라우저 검수 또는 운영 배포 완료 기록은 아니다.

## 입력과 처리

- Generator: `built-in image_gen`; manifest generation date: `2026-10-03`.
- Manifest source: `/Users/son7/tseng-fraud-editorial-20261003/IMAGE-MANIFEST.json`.
- Manifest SHA-256: `321e3ae3d7f62fdfb7c90e44f186c31c3042d56f35513c43d0b049968786d9c5`.
- Prompt source: `/Users/son7/tseng-fraud-editorial-20261003/IMAGE-PROMPTS.md`.
- Prompt SHA-256: `8f8129b708ee5eaa8bc3a56611734c051fdff02d723c91ee9851b69dca8c97c5`.
- Copy verification time (UTC): `2026-10-03T11:24:06+00:00`.
- 원본 PNG를 `shutil.copy2`로 그대로 복사했다. 크기 변경, 재인코딩, 자르기, 시각 편집은 하지 않았다. 복사 전후 원본의 바이트와 수정 시각이 같고, 각 배포 사본의 바이트가 원본과 일치함을 확인했다.
- 실제 크기는 6개 모두 1672 × 941 px이다. 아래 16:9 표현은 생성 프롬프트의 요청이며, 이 표의 픽셀 수가 실제 파일 규격이다.
- 시각 검수 범위: 주 에이전트가 여섯 생성 이미지를 직접 열어 확인했다는 manifest 기록을 이관했다. 이 복사 작업의 자체 검증은 PNG 헤더, 파일 크기, 해시와 원본 보존이다.
- 그림은 연출된 개념 이미지이며 실제 사건·의뢰인·피고인·로펌 직원의 사진으로 설명하지 않는다. 각 언어 본문의 실제 장면에 맞는 alt/caption과 기존 AI 이미지 고지는 통합·화면 검수에서 확인한다.

## 배포 자산과 원본 대응

각 slug는 아래 원본 manifest 및 프롬프트 제목과 1:1로 연결된다. 공개 경로는 아래 repository path에서 `public`을 제외한 경로다.

| Slug | Repository path | Bytes | Dimensions | SHA-256 |
|---|---|---:|---|---|
| `cash-investment-courier-receipt-fraud-taiwan` | `public/images/columns/fraud-20261003/cash-investment-courier-receipt-fraud-taiwan.png` | 1875005 | 1672 × 941 | `82bb7dd0eaa41cc9671b4a731e612845c5dd3c40dc2fdad1443e3bfff8ecc0b9` |
| `land-registration-alert-property-fraud-taiwan` | `public/images/columns/fraud-20261003/land-registration-alert-property-fraud-taiwan.png` | 1831568 | 1672 × 941 | `2e447d13bc6d239783e9f299947d3ba8c3bc6a409507407edbd0a185f50eeb53` |
| `fake-lawyer-scam-recovery-fee-taiwan` | `public/images/columns/fraud-20261003/fake-lawyer-scam-recovery-fee-taiwan.png` | 2261985 | 1672 × 941 | `8bfd40e7de58b1409e2b7a8a65696b0b0864df575aae28ed9ca46ae1b8241d14` |
| `taiwan-rental-deposit-before-viewing-fraud` | `public/images/columns/fraud-20261003/taiwan-rental-deposit-before-viewing-fraud.png` | 1789969 | 1672 × 941 | `6a94893d88c44742b4058bef0d6e5c5765efa7cc7d13afbe8383f6b454e70be8` |
| `taiwan-supplier-bank-account-change-bec` | `public/images/columns/fraud-20261003/taiwan-supplier-bank-account-change-bec.png` | 1723929 | 1672 × 941 | `24468029d4f12cbc80b79b8290a743e9115f9299ea8f07274caa233c7b180e50` |
| `taiwan-unpaid-invoice-fraud-or-contract` | `public/images/columns/fraud-20261003/taiwan-unpaid-invoice-fraud-or-contract.png` | 1951437 | 1672 × 941 | `97697607095a2bff54802d1861934ae2441452be56437f7f36b90b6adf000a39` |

## 원본 manifest 전문

아래 JSON은 입력 파일의 원문이다. `inspection`은 생성·육안 검수 담당자가 남긴 관찰이며 신규 독립 검수로 바꾸어 기록하지 않았다.

```json
{
  "generator": "built-in image_gen",
  "date": "2026-10-03",
  "prompts": "IMAGE-PROMPTS.md",
  "inspection": "All six rendered images viewed in-tool. Staged conceptual scenes; no identified real client, defendant or law-firm personnel. Incidental generic book-spine words in the Korean image make no factual/legal claim. No alteration requested.",
  "images": [
    {"slug":"cash-investment-courier-receipt-fraud-taiwan","source":"/Users/son7/.codex/generated_images/01a10169-8632-72c2-aea0-63c905035c9f/exec-2e9238d5-0afb-4297-b803-1e19cd22d239.png"},
    {"slug":"land-registration-alert-property-fraud-taiwan","source":"/Users/son7/.codex/generated_images/01a10169-8632-72c2-aea0-63c905035c9f/exec-0308af4c-8f55-4b48-b933-42c36bf86f69.png"},
    {"slug":"fake-lawyer-scam-recovery-fee-taiwan","source":"/Users/son7/.codex/generated_images/01a10169-8632-72c2-aea0-63c905035c9f/exec-9deeb99b-e152-4900-bd5e-71320e0bd5a0.png"},
    {"slug":"taiwan-rental-deposit-before-viewing-fraud","source":"/Users/son7/.codex/generated_images/01a10169-8632-72c2-aea0-63c905035c9f/exec-e83d1074-2bab-434b-a8b4-e169c329def9.png"},
    {"slug":"taiwan-supplier-bank-account-change-bec","source":"/Users/son7/.codex/generated_images/01a10169-8632-72c2-aea0-63c905035c9f/exec-7faa49a9-5d36-4363-9967-8d2b744e265b.png"},
    {"slug":"taiwan-unpaid-invoice-fraud-or-contract","source":"/Users/son7/.codex/generated_images/01a10169-8632-72c2-aea0-63c905035c9f/exec-0c3f0de5-e0af-42c3-a35a-5e2f0dba9908.png"}
  ]
}
```

## 생성 프롬프트 전문

다음 내용은 `IMAGE-PROMPTS.md` 원문이다. 홈 디렉터리 파일을 사용할 수 없어도 각 그림의 생성 지시를 확인할 수 있도록 보존한다.

```markdown
# Fraud column imagery

Built-in image_gen. New editorial illustrations, no real case photography, no identifiable clients, no official insignia or fabricated document text. Each output will be copied into the release checkout and have an illustrative alt/caption. No existing assets replaced.

## cash-investment-courier-receipt-fraud-taiwan
Use case: photorealistic-natural. Horizontal 16:9 editorial still life for a Taiwanese law firm column about cash investment couriers and receipts. A plain cream cash envelope, an unsigned generic receipt turned at an angle with no readable writing, a muted unbranded smartphone and a pen on a small Taiwanese cafe table; an anonymous adult hand pauses before handing the envelope across. Natural soft afternoon window light, physically believable materials, quiet documentary composition, restrained cream, charcoal and dark green tones. Clearly staged conceptual image, not an actual criminal incident. No face, legible text, numbers, brand logo, police seal, gavel, scales, glowing cyber effects or warning overlay.

## land-registration-alert-property-fraud-taiwan
Use case: photorealistic-natural. Horizontal 16:9 editorial still life for a Taiwanese legal column about property-registration alerts. A set of modest apartment keys rests beside a closed plain document folder and a smartphone with one abstract, text-free notification shape; out-of-focus Taiwanese residential buildings through the window. Domestic desk, daylight, honest tactile paper and brushed metal, carefully composed negative space, subdued cream and deep green. The phone is an illustrative concept, not an imitation of a government service. No readable writing, fake land deed, official stamp, people, logos, scales, gavel, lock icon or sensational drama.

## fake-lawyer-scam-recovery-fee-taiwan
Use case: photorealistic-natural. Horizontal 16:9 editorial conceptual image for a Taiwanese law-firm column about fake lawyers promising to recover scam losses. Overhead view of a desk: one unbranded phone shows an abstract incoming chat interface without characters, a blank business card sits beside a second open address-book style notebook and a pen. A hand is checking the independent contact details rather than pressing the phone. Soft directional morning light, warm off-white paper, charcoal and muted green, believable understated objects, no facial identity. No readable text, government insignia, judge costume, badge, cash pile, gavel or scales; not an image of a real person or incident.

## taiwan-rental-deposit-before-viewing-fraud
Use case: photorealistic-natural. Horizontal 16:9 staged editorial photograph about inspecting a Taiwanese rental apartment before paying a deposit. A quiet empty modest Taipei apartment doorway, metal apartment keys and an unbranded phone held low by an anonymous adult hand in foreground, window daylight and tiled entryway. The phone screen has no readable interface; attention is on seeing the actual room. Restrained architectural photography, neutral warm tones with a subtle dark-green door detail. No identifiable person, readable text, logo, police imagery, gavel, giant warning symbols or exaggerated luxury.

## taiwan-supplier-bank-account-change-bec
Use case: photorealistic-natural. Horizontal 16:9 staged editorial photograph for an English-language legal article about supplier invoice bank-account changes. A business desk with two neatly aligned generic invoices with unreadable soft-focus grey lines, an open laptop with a text-free email layout, and a landline handset being lifted to independently verify a payment instruction. No actual account numbers or business identity. A small shipping carton in the background suggests international trade. Soft office daylight, refined understated composition, off-white, graphite and muted green. No hacker silhouette, digital padlock, glowing code, charts, readable words, logos, scales or gavel.

## taiwan-unpaid-invoice-fraud-or-contract
Use case: photorealistic-natural. Horizontal 16:9 conceptual editorial photograph about an unpaid Taiwan business invoice and the distinction between debt and fraud. Carefully arranged generic purchase order, delivery-note style sheet and a closed contract folder on a plain meeting-room table, with binder clips and a capped fountain pen; one ordinary shipping sample box nearby. All paperwork uses indistinct line textures without letters or numbers. Quiet, practical, natural late-morning light, warm ivory and muted dark green, no people or identity. No money stacks, fake legal stamps, courtroom, gavel, scales, red alarms or sensationalism.
```

## 재확인

복사 시 실행한 검증은 각 6개 파일에 대해 PNG signature/IHDR, 1672 × 941 크기, 배포 사본과 원본의 byte equality, SHA-256 및 원본의 size/mtime 불변을 확인했다. 모두 통과했다.

체크아웃에서 배포 파일 해시를 재확인할 수 있다:

```sh
shasum -a 256 public/images/columns/fraud-20261003/*.png
```
