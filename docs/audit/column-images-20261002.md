# Representative images for JA070, VI071 and TW072

2026-10-02. This authorized image-only follow-up replaces the default hero on three already published columns. The initial TW072 publication and Blender diagram are recorded in `tw-lane-change-20261002.md`. No reviewed legal body, title, summary, source, date, byline or Blender assumption was changed.

## Images and disclosure

The JA and VI topic images and the TW lane-change image were received through the authorized Library materialization helper with verified Library identity attributes. The integrator inspected the actual pixels on this Mac. All six website renditions are 1600×900; WebP is used for the hero and cards, JPEG for sharing. The TW JPEG is a format conversion of the received WebP. The generated images are editorial illustrations, not evidence, actual client documents or judgment reconstructions. The TW hero and Blender scene have different vehicle positions and are not described as the same scene.

The generation service was OpenAI's image generation tool; no undisclosed backend model name is claimed. The two locally generated alternate TW candidates are not used or published; the parent's designated Library image is used.

## Independent native text review

Existing local Claude Code, actual `claude-opus-5-5`, reviewed all three alt/caption pairs with the full editorial policy. Its first review approved VI and TW but found the JA caption could imply the generic product was prohibited. The exact recommended clarification was applied; a second real model pass approved all three. This was text review, not a claim that the reviewer inspected pixels or repeated the legal review.

JA before: AI生成のイメージです。実在の書類・事件や、台湾への持ち込みが認められた製品を示すものではありません。

JA after: AI生成のイメージです。実在の書類や事例を写したものではなく、特定の製品や、その製品を台湾に持ち込めることを示すものでもありません。

Preserved: AI disclosure, no actual documents/cases and no import-permission claim. No decorative bold was introduced. The approved first two paragraphs and prior-three comparisons remain exactly as recorded in the prior country/TW editorial audits, because the legal bodies are byte-identical.

## Implementation and checks

Optional file frontmatter carries native alt, visible caption and social rendition. Old columns without the fields keep their existing output; the placeholder file itself is unchanged. Alt survives list serialization and Open Graph/Twitter metadata. A meaningful regression test covers both native image descriptions and legacy/non-string fallback. The file-derived CMS reader initially dropped the new descriptions. It now backfills them only when the published and file images are identical, with a regression test for same/different images; CMS schemas remain unchanged. The VI070 image was obscured by the existing title overlay in the first real screenshot, so that article opts into a clear 16:9 photo below its existing dark title header. Other Vietnamese articles and other locale designs remain unchanged.

Full type/lint/unit/security/build and real desktop/mobile article, card, image HTTP/hash and social metadata checks are required before publication. Exact image identities and immutable body hashes are in the adjacent assets JSON. Local execution reports and full model runs are retained in `column-operations/image-replacement-20261002/` outside the repository. Safari/iOS hardware is not tested.

Final prepublication validation: typecheck, lint, security and production build passed. All 1,371 unit suites passed (13,518 tests passed, 14 skipped, 1 todo). Real Chromium 151 PC/mobile checks passed for all three articles, their cards, hero/caption geometry, Open Graph/Twitter native alt and JPEG URLs, Article JSON-LD, exact legal paragraphs and all six asset hashes. The integrator visually inspected the final screenshots. QA teardown confirmed canonical runtime/audit checksums unchanged; 129 protected paths remained unchanged. Public readback is recorded separately after deployment.
