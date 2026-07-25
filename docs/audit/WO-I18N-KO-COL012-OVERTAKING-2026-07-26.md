# WO-I18N-KO-COL012-OVERTAKING

Date: 2026-07-26 KST
Manager: Codex `/root`

## Goal

Rewrite Korean column 012 as a natural, current-law guide to Taiwan overtaking
accidents. The article must distinguish Article 101's same-lane signaling and
yielding sequence from prohibited overtaking conditions, and must describe the
firm's anonymized matter as a fact-specific appraisal result rather than a
universal fault rule or promised outcome.

Accepted legal/editorial reference:

- `src/content/columns-en/012-taiwan-overtaking-accident-liability.md`
- `docs/audit/WO-I18N-EN-COL012-OVERTAKING-LEGAL-COPY-2026-07-25.md`

## Current-law evidence

Use the current consolidated
[대만 도로교통안전규칙](https://laws.gov.taipei/Law/LawSearch/LawArticleContent/FL012455),
revised 2026-06-26, and accurately explain Article 101:

1. No overtaking on signed bends, steep slopes, narrow bridges, tunnels or
   intersections, or at railroad crossings and roadwork areas.
2. No overtaking where school, hospital or other no-overtaking signs or
   markings apply, when oncoming traffic is approaching, or when two or more
   vehicles travel continuously ahead.
3. To pass a vehicle in the same lane, first sound two short horn signals or
   flash the headlights once; do not repeat either signal densely to force the
   vehicle ahead to yield.
4. Pass only after the vehicle ahead slows and moves aside, or indicates
   yielding by hand signal or right turn signal.
5. Signal left, pass on the left with at least 0.5 metres of clearance,
   establish a safe distance, signal right and return to the original path.
6. The signaling/yielding sequence does not authorize overtaking in a
   prohibited location or condition.

Do not call the yielding indication universal "consent" or describe one
omitted signal as an automatic or universal cause of fault.

## Ownership

The writer may edit exactly:

- `src/content/columns/012-taiwan-overtaking-accident-liability.md`
- new `src/lib/__tests__/columns-ko-traffic-012.test.ts`

No archive, public card, sibling locale, loader, redirect, sitemap, embedding,
or other test may change. The writer must not stage or commit.

## Exact metadata and structure

- frontmatter title and H1:
  `대만 추월 사고의 책임은 어떻게 판단하나요?`
- source URL:
  `https://www.wei-wei-lawyer.com/post/taiwan-overtaking-accident-liability`
- `lastmod: "2026-07-26"`
- `date_display: "2025년 9월 13일"`
- category: `대만 법률정보`
- featured image:
  `../images/012-taiwan-overtaking-accident-liability/featured-01.jpg`
- calculate visible Korean eojeol after completion and use
  `Math.ceil(eojeolCount / 180)` as `${minutes}분 분량`
- use these H2 headings in order:
  1. `## 도로교통안전규칙 제101조가 정한 추월 요건`
  2. `## 사무소가 처리한 익명 사고 사례`
  3. `## 사고 책임을 판단할 때 확인할 사항`

The H1 is followed by the featured image with this exact alt:
`대만 추월 사고의 책임 판단과 안전한 추월 절차를 설명하는 이미지`.
Then add a short neutral introduction. Preserve the incident image
`../images/012-taiwan-overtaking-accident-liability/img-01.jpg` inside the
anonymized-case section with this exact alt:
`산길에서 오토바이와 앞선 차량 두 대의 추월 경로를 보여 주는 사고 도해`.

Remove `img-02.jpg`, the claim that the graphic was translated into Korean, the
visible Chinese supplementary-link label, and all decorative zero-width
characters.

## Case-account contract

Preserve the accepted anonymized facts:

- motorcyclist A carried passenger B on a mountain road;
- Vehicle 1 and Vehicle 2 traveled ahead, with Vehicle 1 moving slowly;
- A attempted to pass both cars, entered the oncoming lane and accelerated;
- Vehicle 2 entered the oncoming lane less than one second after signaling;
- the motorcycle could not stop in time and collided with Vehicle 2;
- B died from a severe head injury and A was taken to hospital;
- the families initially considered Vehicle 2's rapid lane change the primary
  cause;
- litigation and multiple accident appraisals followed;
- those appraisals found A primarily responsible in that matter.

Immediately qualify the result as case-specific. State that the appraisals
considered the combined circumstances: passing two vehicles traveling in a
line, oncoming-lane entry, speed and braking time, the prescribed signal,
Vehicle 2's movement, road/lane configuration and other available evidence.
State that one omitted signal does not always decide liability.

Remove unsupported insurance discussion, permanent emotional-consequence
claims, and any claim that compliance will prevent an accident or avoid an
excessive liability share.

## Links and ending

Use the official regulation URL once with a native Korean label.

Preserve the secondary URL once:
`https://gonews.com.tw/car/daily/21934/`
with the native label `추월 규정과 절차 도해` and explicitly identify it as
supplementary secondary reading; direct readers to the current official rule
for legal requirements.

End with these three internal links, once each and in this order:

1. `[대만 소송 변호사 안내](/ko/taiwan-litigation-lawyer)`
2. `[한국어 가능한 대만 변호사](/ko/korean-lawyer-in-taiwan)`
3. `[대만 교통사고 처리 절차](/ko/columns/taiwan-traffic-accident-procedure)`

Finish with this exact Korean disclaimer:

`이 글은 대만의 추월 규정과 사고 책임 판단에 관한 일반적인 법률정보이며, 특정 사건에 대한 법률자문이나 결과 보장이 아닙니다. 실제 책임은 사고 장소, 차량 움직임, 속도, 신호, 증거, 감정 및 최신 법령에 따라 달라질 수 있으므로 구체적인 사건은 관련 자료를 바탕으로 개별 검토해야 합니다.`

Do not promise a particular appraisal, settlement, liability allocation or
litigation result.

## Independent regression test

The new test must use independent literal expectations and verify:

1. exact frontmatter/H1, source URL, dates, category and featured image;
2. visible-Korean eojeol count and exact 180-eojeol reading-time formula;
3. exact three H2 headings and their order;
4. official URL and every Article 101 proposition above;
5. the anonymized facts, appraisal attribution, combined-factor language and
   express rejection of a universal one-signal fault rule;
6. `featured-01.jpg` and `img-01.jpg` with the exact Korean alts above;
7. no `img-02.jpg`, Korean-version claim, former Chinese link label,
   zero-width character, insurance, permanent-torment or liability-avoidance
   claims;
8. exact secondary and three internal links, each once;
9. canonical and `overtaking-accident` alias loader results have the accepted
   slug and title;
10. exact final disclaimer and no Han-script leakage in visible labels/prose
    after URLs and asset paths are excluded.

## Gates

1. Grok implements this KO unit only.
2. Terra independently reviews current law, Korean naturalness and test
   strength; the same Grok session corrects any finding.
3. Codex inspects the final diff and runs:

```sh
npx vitest run src/lib/__tests__/columns-ko-traffic-012.test.ts
npm run -s typecheck
npx eslint src/lib/__tests__/columns-ko-traffic-012.test.ts
git diff --check -- src/content/columns/012-taiwan-overtaking-accident-liability.md src/lib/__tests__/columns-ko-traffic-012.test.ts docs/audit/WO-I18N-KO-COL012-OVERTAKING-2026-07-26.md
npm run build
```

4. Browser QA uses
   `/ko/columns/taiwan-overtaking-accident-liability` at 1440×1000 and
   390×844. Both loads must return HTTP 200 with `lang="ko"`, the exact title,
   official regulation link, secondary link and three internal links. The
   rendered page must have no horizontal overflow, console errors or uncaught
   page errors.
5. Manager-owned local commit only. No push or deploy.
