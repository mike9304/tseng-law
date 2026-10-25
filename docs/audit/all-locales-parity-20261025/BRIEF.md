# All-language column parity — 2026-10-25

User goal: tseng-law.com의 모든 언어에 주요 언어들만큼 칼럼을 작성하고 배포한다. 가능한 에이전트를 최대한 활용하며 Kimi 3.1 Pro도 작업 에이전트로 참여시킨다.

## Baseline and completion

- Frozen initial main/live commit: `ef3b24e73d84968eea08ea9d58e991ccbbf83fa8`.
- Repository: `/Users/son7/Projects/tseng-law-all-locales-20261025`, branch `codex/all-language-columns-20261025`. Shared legacy checkout must not be reset, pulled or staged.
- 49 supported public locales. Initial file-backed professional columns: 1,976; separate issue articles: 125. Core counts: ko207, zh-hant286, en208, ja220. Most other locales have 21–46.
- Count benchmark: at least 286 substantive professional columns in each supported language, matching the largest initial primary-language collection. A source-language link, English fallback, duplicate topic or empty page is not a completed local column. Count and actual board visibility must both be checked.
- Use full slug and legal subject, never numeric prefix alone, to match translations. Core common topics can be a first milestone, not a reduced completion target.
- Maintain existing accurate articles. Translate/rewrite missing useful subjects with legal conditions intact, filling topic coverage before using counts as completion evidence. Existing issue articles remain part of the publication audit and must not regress.
- Complete means checked content is merged/pushed through the authorized deployment route and the resulting public commit, pages, language, navigation, canonical/hreflang and package limits are verified. Drafts, automated green checks alone and quantity alone are insufficient.

## Current batch: residence information

Source set: current EN/KO/ZH 704 `taiwan-arc-first-application`, 705 `taiwan-visa-residence-work-study-family`, 706 `taiwan-arc-renewal-changes-reentry`. Read the full source and current `docs/audit/codex-column-recheck-20261024/research/source-refresh.md`, ARC BRIEF and final review evidence. Authors must not use held/rejected drafts.

Initial release locales: Russian, Malay, Filipino, Turkish, Dutch, simplified Chinese and Swedish: 21 new articles. The primary Codex agent personally authored the three Swedish articles and revised the Kimi 3.1 Pro simplified Chinese drafts after source comparison and independent review. Additional batches follow the full inventory, without changing the overall target.

## Author contract

- Read repository AGENTS.md, docs/columns/EDITORIAL-VOICE.md, FRONTMATTER.md, `/Users/son7/tseng-col-0930-work/COLUMN-VOICE-RULE.md`, `/Users/son7/tseng-lanes-shared/SENTENCE-VARIETY-RULE.md` and LESSONS.md in full. Home editorial file is currently absent; the repository copy is available. Retired Fable role/gate mandates do not apply.
- Preserve Taiwan jurisdiction, legal actor, must/may, AND/OR, exception, date basis, deadline, amount, currency, source links and quoted statements. A language does not identify a nationality. Do not silently substitute a local country's law or consular practice.
- Write native prose, not a sentence-for-sentence mechanical copy. Do not invent scenes, private client experience, professional qualifications, successful outcomes or services in the translated language. Actual consultation languages remain EN/中文/JA/KO.
- Preserve internal `author: legal-ai-assistant`; add no public author/byline, fabricated review approval or decorative bold. No body H1. Use specific headings and a substantive ending. Do not add AI labels to translated captions when the current source has none; preserve current source media identity and factual caption.
- Frontmatter must be fully localized where appropriate, with `audience: [<locale>]` for this newly localized reader-facing guidance. Preserve source topic/category identifiers and image paths. `published`/`lastmod` date for these additions: 2026-10-25. Use existing actual same-language links only; known source-language links may remain explicitly identified if needed.
- Keep the source's FAQ legal conditions and all cited official sources. Legal sources are not replaced with model assertions. Report uncertainty for the coordinating reviewer.
- Compare opening/headings/ending with the previous three same-language articles. Record actual phrase → issue → edit → preserved meaning and §5 self-check in the assigned review file. MONOTONY findings must name the sentence and direction.
- Run the required shared variety command and report the actual result. The primary agent restored the verified 14-language baseline and installed independently tested profiles for these seven locales (checks/variety-installation.json), followed by da/nb/fi/pl/cs/ro/uk after 25 tests and an unchanged 21-locale regression (checks/variety-next7-installation.json). The shared path now supports 28 locales. Future locale profiles remain isolated until regression review. Never label an unknown locale as Korean/English or claim unsupported means PASS. Do not change the validator to fit your prose.
- You are not alone in this codebase. Edit only assigned language files and your review file; do not revert others. No git commit/push, deployment, infrastructure changes, credential access, external messages or sound playback by workers.

## Integration and publication

The primary agent handles shared manifests, inventory, meaning review, batch checks, commit/rebase and main push. Use the working Node runtime `/Users/son7/.nvm/versions/node/v24.14.1/bin/node`; the default Homebrew node currently fails on a missing dylib.

Deployment remains main push → MacBook Air automatic static build → existing Codex Site. No direct Sites/Vercel/wrangler deploy or domain/DNS/R2 configuration change. Read build reports rather than exit status alone, including missing references and package headroom. Actual public `/build-info.json` and delivered pages prove deployment.
