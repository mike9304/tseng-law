# WO-I18N-JA-COL014-INTRO-CLOSING-SYNC — 最低勤務期間ガイド導入部の結び

Date: 2026-07-26 KST
Manager: Codex `/root`
Locale: Japanese (`ja-JP`)
Micro-scope: column 014 introduction closing paragraph only

## Goal

確定済みの韓国語版column 014にある、導入部の四つの質問をまとめる
結びの一段落だけを日本語版へ忠実に翻訳して挿入する。

これは翻訳同期のみの作業である。新たな法的調査、法的レビュー、
事実確認、解釈の補強または助言の追加を行わない。

## Fixed translation source

唯一の翻訳元は次の確定韓国語ファイルと作業契約である。

1. `src/content/columns/014-taiwan-mandatory-employment-period.md`
   - finalized commit:
     `37cc887652402f2f9355c5147968d7a4a976081b`
   - four-question list immediately following the exact paragraph below
2. `docs/audit/WO-I18N-KO-COL014-MINIMUM-SERVICE-PERIOD-2026-07-25.md`
   - `### 도입` contract

Translate exactly this Korean paragraph:

> 같은 계약서에 이 네 문제가 함께 적혀 있어도 적용 조문과 필요한 증거는 다릅니다. 따라서 약정이 유효한지, 퇴사 의사표시가 언제 효력을 내는지, 선급성 급부나 훈련비를 돌려줄 책임이 있는지, 별도의 손해가 실제로 발생했는지를 각각 나누어 살펴보아야 합니다.

Do not use another locale, external material, or the implementer's legal
knowledge as a source.

## Owned implementation files

The implementation phase may modify only:

1. `src/lib/__tests__/columns-ja-labor-014-intro-closing-sync.test.ts` (new)
2. `src/content/columns-ja/014-taiwan-mandatory-employment-period.md`
   - only the one-paragraph insertion described below

Do not edit frontmatter, existing Japanese prose or list items, either
immutable boundary, existing tests, other locales, shared code, images,
archive/search data, or embeddings. Do not stage, add, commit, push, deploy,
publish, or operate shared servers.

## Exact byte boundary and structure

Preserve the current Japanese bytes `0..5281` exactly.

- immutable prefix: `5281` UTF-8 bytes
- SHA-256:
  `2fd069c0f3de2825c61b58227264811eedfbe9eacf6ebdd3a92d5c78bca87ed9`

This prefix ends after the existing four-question numbered list and its
current blank-line boundary. Insert the translation immediately after it.

Preserve the exact marker below and every byte from it through EOF:

`## 1. 最低勤務期間条項はいつ有効となり得るか`

- immutable tail: `26574` UTF-8 bytes
- SHA-256:
  `d66816f840cbcdc3b88f3316e9d09c6afcc9533d4b9b94e7dd58967d78ef5403`

The only mutable slice must be exactly:

`P1\n\n`

`P1` is one non-empty Japanese prose paragraph. It must be followed directly
by the immutable H2. Do not insert a heading, list, image, link, blockquote,
HTML, or additional paragraph.

## One-paragraph meaning contract

The Japanese paragraph must preserve all of the following meanings without
addition, omission, strengthening, or weakening:

1. Even when the four issues appear in the same contract, the applicable
   provisions and required evidence differ.
2. Each issue therefore requires a separate assessment:
   - whether the minimum-service clause is valid;
   - when the notice of resignation takes effect;
   - whether there is responsibility to return advance-type benefits or
     training costs; and
   - whether separate damage actually occurred.

Use concise, natural, professional Japanese. Preserve the distinction between
the clause's validity, the effect of the resignation notice, return
responsibility, and proof of separate damage. Do not turn the paragraph into
a conclusion about any particular case.

## Prohibited content

The inserted slice must contain no:

- new legal proposition, statute, deadline, amount, example, exception,
  recommendation, or marketing language;
- heading, list, image, link, blockquote, HTML, greeting, lawyer name,
  personal introduction, video notice, or call to action;
- Hangul;
- U+200B, U+FEFF, U+00A0, carriage return, trailing whitespace, or
  whitespace-only/invisible-only line.

## Deterministic RED/GREEN test

The new focused test must read the Japanese Markdown as raw bytes and use
independently declared constants. It must make no network calls and use no
snapshot, production-copy import, loader-derived expectation, or fixture
derived from the edited result.

1. Lock bytes `0..5281` to the prefix length and SHA-256 above.
2. Locate the exact immutable H2 and lock H2-to-EOF to the tail length and
   SHA-256 above.
3. Treat only the bytes between prefix offset `5281` and that H2 as mutable.
4. Assert that the mutable slice is exactly `P1\n\n`, with exactly one
   non-empty Japanese prose paragraph and no Markdown block element.
5. Assert all required semantic points independently with bounded Japanese
   literals or explicit alternatives: different applicable provisions,
   different required evidence, clause validity, effective timing of the
   resignation notice, return responsibility for advance-type benefits or
   training costs, and actual occurrence of separate damage.
6. Reject additions prohibited above, Hangul, U+200B, U+FEFF, U+00A0, CRLF
   or carriage return, trailing whitespace, and invisible-only content
   within the mutable slice.

RED must pass both immutable-boundary checks and fail only because the current
mutable slice is empty. GREEN must pass after inserting exactly the one
approved paragraph. Do not weaken the test to obtain GREEN.

## Execution and independent review gates

1. Terra writes and runs the focused test, proving deterministic RED.
2. Grok drafts only the one Japanese paragraph from the fixed Korean
   paragraph, performs no research, and edits no file.
3. Terra inserts only the approved paragraph and proves GREEN.
4. A Terra reviewer independent of the implementer compares Korean and
   Japanese point by point for omissions, additions, or altered legal force.
5. A Grok reviewer independent of the drafter checks concise, natural,
   professional Japanese and terminology consistency.
6. Codex reviews the scoped diff and reruns the focused test, existing
   `src/lib/__tests__/columns-ja-labor-014.test.ts`, typecheck, scoped lint,
   `git diff --check`, and a clean build in a unique dist directory.
7. Codex verifies the rendered Japanese route on desktop and mobile: HTTP
   200, exact one-paragraph insertion after the four-item list, unchanged H2
   and tail, no Hangul or prohibited copy, no console/page error, and no
   horizontal overflow.

Record the actual prefix/tail lengths and hashes during verification and
report command results exactly. No push or deploy.
