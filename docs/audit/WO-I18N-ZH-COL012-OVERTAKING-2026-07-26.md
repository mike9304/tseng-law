# WO-I18N-ZH-COL012-OVERTAKING

Date: 2026-07-26 KST
Manager: Codex `/root`

## Goal and references

Rewrite Traditional Chinese column 012 as a native, current-law guide to
Taiwan overtaking accidents. The article must separate prohibited overtaking
conditions from Article 101's same-lane signaling/yielding sequence and must
present the anonymized accident as a fact-specific appraisal result.

Use:

- accepted `src/content/columns-en/012-taiwan-overtaking-accident-liability.md`;
- accepted `src/content/columns/012-taiwan-overtaking-accident-liability.md`
  only as a structure/fact reference, not as sentence-by-sentence source;
- current consolidated
  `https://laws.gov.taipei/Law/LawSearch/LawArticleContent/FL012455`, revised
  2026-06-26.

## Ownership

The writer may edit exactly:

- `src/content/columns-zh/012-taiwan-overtaking-accident-liability.md`
- new `src/lib/__tests__/columns-zh-traffic-012.test.ts`

No sibling locale, public card/archive, loader, redirect, sitemap, embedding or
other test may change. The writer must not stage or commit.

## Exact metadata, structure and localized fixed copy

- title and H1: `台灣超車事故的責任如何判斷？`
- source URL unchanged:
  `https://www.wei-wei-lawyer.com/post/taiwan-overtaking-accident-liability`
- `lastmod: "2026-07-26"`
- `date_display: "2025年9月13日"`
- category: `台灣法律資訊`
- featured image unchanged:
  `../images/012-taiwan-overtaking-accident-liability/featured-01.jpg`
- final visible Han-character count uses
  `Math.ceil(visibleHanCount / 400)` and read time
  `${minutes}分鐘閱讀`
- exact ordered H2s:
  1. `## 道路交通安全規則第101條的超車要件`
  2. `## 本所處理的匿名事故案例`
  3. `## 判斷超車事故責任時應確認的事項`

Use these exact image alts:

- featured: `說明台灣超車事故責任判斷與安全超車程序的圖片`
- incident `img-01.jpg`:
  `顯示山路上機車與前方兩輛汽車超車路徑的事故示意圖`

Remove `img-02.jpg`, the claim that a Chinese version was translated, generic
or empty alts, Korean script and decorative zero-width characters.

## Article 101 contract

Link the official consolidated rule once with label
`臺灣《道路交通安全規則》第101條` and state all of the following accurately:

1. No overtaking on road sections signed for bends, steep slopes, narrow
   bridges, tunnels or intersections, or at railroad crossings and roadwork.
2. No overtaking at school/hospital or other no-overtaking signs or markings,
   with oncoming traffic, or with two or more vehicles continuously ahead.
3. For passing a vehicle in the same lane, first use two short horn signals or
   one headlight flash; no repeated/dense signals to force yielding.
4. Pass only after the vehicle ahead slows and moves aside or indicates
   yielding by hand signal or right turn signal.
5. Signal left, pass on the left with at least 0.5 metres of clearance, reach a
   safe distance, signal right and return to the original path.
6. The same-lane signaling/yielding sequence never authorizes overtaking in a
   prohibited place or condition.

Use native terms such as `表示讓行` or `允讓`, not a universal `前車同意`.
Do not reduce Article 101 to a blanket right-side/double-yellow-line slogan.

## Anonymized case and non-guarantee contract

Preserve the accepted facts: A carried B on a motorcycle on a mountain road;
Vehicle 1 and Vehicle 2 were ahead; A tried to pass both, entered the oncoming
lane and accelerated; Vehicle 2 entered that lane less than one second after
signaling; the motorcycle lacked braking margin and collided; B died and A was
taken to hospital; the families initially attributed primary cause to Vehicle
2's rapid lane change; litigation and multiple accident appraisals followed;
those appraisals found A primarily responsible in that matter.

Immediately state that the result is limited to that matter. The appraisals
considered together the two continuously traveling vehicles, oncoming-lane
entry, speed/braking margin, prescribed signal, Vehicle 2 movement, road/lane
configuration and other evidence. State expressly that one omitted signal does
not always determine fault.

Remove the derogatory `龜速`, unsupported insurance/financial-loss discussion,
permanent-emotional-suffering narration, and any promise that compliance will
avoid an accident or excessive liability.

## Links and ending

Use the Gonews URL once:
`https://gonews.com.tw/car/daily/21934/`
with label `超車法規與步驟圖解`. Identify it as supplementary secondary
material and direct readers to the current official rule for legal
requirements.

End with these same-locale links once each and in order:

1. `[台灣訴訟律師指南](/zh-hant/taiwan-litigation-lawyer)`
2. `[台灣韓語律師服務](/zh-hant/korean-lawyer-in-taiwan)`
3. `[台灣交通事故處理程序](/zh-hant/columns/taiwan-traffic-accident-procedure)`

Finish with this exact disclaimer:

`本文僅提供台灣超車規則與事故責任判斷的一般法律資訊，不構成特定案件的法律意見或結果保證。實際責任可能因事故地點、車輛動態、速度、燈號、證據、鑑定結果及現行法規而異，具體案件仍應依相關資料個別分析。`

## Independent test

The new test must use independent literal expectations and verify:

1. exact metadata, title/H1, dates, category and source/featured paths;
2. exact visible-Han count and 400-character read-time formula;
3. exact three ordered H2s, official URL/label and every proposition group;
4. case facts, appraisal attribution, all combined factors and the express
   rejection of a universal one-signal fault rule;
5. exact two image paths/alts and absence of `img-02`, Korean script, translated
   Chinese-version claim, zero-width characters and stale unsafe copy;
6. exact secondary link/caveat and three internal links, once and in order;
7. exact final disclaimer;
8. canonical and `overtaking-accident` alias loaders resolve to the accepted
   slug/title.

## Gates

1. Grok implements only this ZH-Hant article/test unit.
2. Terra reviews current law, native Traditional Chinese and test strength;
   the same Grok session corrects findings.
3. Codex runs:

```sh
npx vitest run src/lib/__tests__/columns-zh-traffic-012.test.ts
npm run -s typecheck
npx eslint src/lib/__tests__/columns-zh-traffic-012.test.ts
git diff --check -- src/content/columns-zh/012-taiwan-overtaking-accident-liability.md src/lib/__tests__/columns-zh-traffic-012.test.ts docs/audit/WO-I18N-ZH-COL012-OVERTAKING-2026-07-26.md
npm run build
```

4. Browser QA on
   `/zh-hant/columns/taiwan-overtaking-accident-liability` at 1440×1000 and
   390×844 must return HTTP 200, use `lang="zh-Hant"`, show the exact title and
   required official/secondary/internal links, and have no horizontal overflow,
   console errors or uncaught page errors.
5. Manager-owned local commit only. No push or deploy.
