# Criminal columns: discovery fix

User report, 2026-10-07: “형사소송 어디에 올렸어 게시판에 안보이는데”.

The four Korean articles were already published, with the other four language versions, at `/[locale]/criminal-litigation` and their individual `/columns/[slug]` URLs. On the existing Korean columns archive, three appeared under recommendations and one under Litigation & disputes. There was no Criminal litigation topic. The shortcut to the dedicated board followed the complete archive: measured document Y=8,399 on desktop and Y=7,526 on mobile. The original release check clicked this link but did not evaluate its placement; that check missed the reported discovery problem.

## Change

- Add the Criminal litigation topic in Korean, Traditional Chinese, English, and Japanese. The Korean topic chip immediately follows All, including on phones.
- Set only the `topic` field of the 20 previously approved articles to `criminal`. Preserve every other byte, including legal text, dates, sources, FAQ, authorship metadata, and URLs.
- Render the dedicated-board shortcut inside the shared archive grid before its search form, so the published builder page and native routes use the same placement. Remove the old trailing and duplicate shortcuts. Vietnamese readers get the same shortcut above their existing category-based archive. Separate issue archives do not get this shortcut.
- Extend the existing Japanese topic glyph and locale-specific topic orders for the new topic.
- Include the displayed topic label in archive search. Searching for the Korean, Chinese, English, or Japanese criminal topic name now finds the four articles and continues to do so when the topic filter is selected. The four added regression cases first failed against the previous search behavior.

## Verification

The new regression suite first reproduced the missing topic and misplaced shortcut: 10 failed, 1 passed before implementation. It verifies all four article links and their count under the new topic in four core languages, shortcut placement in five languages, Korean chip order, and separation from the issue archive. Browser verification also exercises the published page, filtering, article navigation, Back, reset, and the dedicated board on desktop and mobile.

Baseline: `11f68f14896b5e31536cf1c5495f44a745491d7c`. Implementation uses the isolated criminal worktree after fast-forwarding all 14 intervening production commits. No uncommitted work from the shared project is included.

Evidence directory: `/Users/son7/tseng-criminal-20261007/`. Before screenshots/DOM: `discovery-before/`; content preservation: `discovery-content-preservation.json`; source hashes: `DISCOVERY-SHA.json`.

Final source manifest SHA256: `dc6e74f562bcd2db18441d74184ce5ef96748c70a62226d920b43d5c3658a471` (32 source/test files).

- Three independent GPT-6 Astra max reviewers approved this exact manifest; reports are in `reviews/discovery-astra-{a,b,c}-r1.md`.
- `npm run qa`: PASS, 1,409 test files, 14,078 passed / 14 skipped / 1 todo. Typecheck, lint, and route guard checks passed. One earlier font-subset failure was corrected by reusing the existing decorative glyph `訴`; the complete QA was rerun successfully afterward.
- Clean production build: PASS after the final topic-label search change.
- Production preview browser: PASS, five locales × desktop/mobile = ten discovery flows. Core-language checks include typing the visible topic name, selecting the criminal filter, all four correct detail links, article click, Back, reset, and dedicated-board navigation. Vietnamese checks cover the shortcut before search and the four local board articles. No page errors or horizontal overflow. Korean mobile shortcut measured Y390, with the criminal chip immediately after All and inside the viewport.
- `git diff --check`: PASS. Topic-only byte comparison: 20/20 approved articles preserved.

Local evidence: `discovery-final-qa.log`, `discovery-final-build.log`, `discovery-local/results.json` and screenshots. Production deployment and post-deploy evidence are recorded in the external evidence directory after the Git-integrated deployment becomes ready. The earlier release's source approval manifests remain historical records and are not overwritten by this metadata correction.
