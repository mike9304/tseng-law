# WO-I18N-EN-COL010-LEGAL-COPY — Complete and qualify the gym article

Date: 2026-07-25 KST
Owner: delegated implementation worker
Manager: Codex `/root`

## Goal

Complete the English localization of column 010 by translating the nine
Traditional Chinese media captions and image alt texts that are visibly
leaking into the public English route.

At the same time, correct the article's litigation stages and limitation
article, and replace categorical legal, evidence, insurance and
mandatory-litigation statements with precise, source-backed English.

The current worktree contains five uncommitted draft corrections in this
English markdown file from a factual-audit agent. They are not an approved
checkpoint. The implementation worker owns the file and must bring the entire
record to the exact final contract below.

## Allowed files

1. `src/content/columns-en/010-taiwan-gym-injury-lawsuit.md`
2. `src/lib/__tests__/columns-en-content.test.ts`

No other file may be modified.

## Exact content contract

Preserve frontmatter, the title, source URL, dates, category, every image path,
every linked media URL and the three internal `See also` links except for the
following exact reading-time correction and the visible prose replacements:

```yaml
read_time: "6 min read"
```

The body is approximately 1,100 English words; the old `3 min read` is stale.

### Neutral introduction

Replace the case-summary sentence before `img-01.jpg` with exactly:

```md
It is a case in which **a Korean university student sought damages from a fitness chain operated by a publicly listed company in Taiwan**.
```

Replace the visible prose from `Koreans are very fond...` through the
trainer-news paragraph with exactly:

```md
Many people use gyms regularly, and exercise-related injuries can occur in Taiwan as elsewhere.

Reported incidents have raised questions about supervision, equipment use, emergency response, and trainer-led instruction. Whether a gym operator is legally responsible depends on the facts, the applicable duties, causation, and the evidence.
```

Replace the three case-description paragraphs with exactly:

```md
In this matter, a Korean university student was injured while training under an instructor's supervision at a fitness chain operated by a publicly listed company in Taiwan.

I represented the student in a damages claim. The first-instance court awarded TWD 1,570,000 in damages. The parties later reached a settlement on appeal.

The case received substantial media coverage and online discussion in Taiwan.
```

### Nine media alt/caption pairs

For records 1–8 (`img-02.jpg` through `img-09.jpg`), replace the current
linked-image plus duplicate bold-caption construct with two valid Markdown
lines:

```md
![EXACT ENGLISH CAPTION](UNCHANGED IMAGE PATH)

[EXACT ENGLISH CAPTION](UNCHANGED EXTERNAL SOURCE URL)
```

Use the same exact English string as both image alt text and human-readable
link label. This is required because the public column loader removes inline
images; the current nested `[![...](image)](URL)` construct is left behind as
a bare percent-encoded URL and causes severe horizontal overflow.

For record 9 (`img-10.jpg`), which has no external source link, keep a
standalone image line followed by the same exact bold caption:

```md
![EXACT ENGLISH CAPTION](UNCHANGED IMAGE PATH)

**EXACT ENGLISH CAPTION**
```

Preserve every image path and external link target.

1. `img-02.jpg`

```text
Male university student suffers a ruptured disc after deadlifting 90 kg and seeks damages from gym
```

2. `img-03.jpg`

```text
Korean male university student ruptures a disc while deadlifting 90 kg and is awarded TWD 1.57 million at first instance; Fitness Factory confirms settlement on appeal
```

3. `img-04.jpg`

```text
Korean male university student injured while deadlifting 90 kg is awarded TWD 1.57 million at first instance; Fitness Factory settles on appeal
```

4. `img-05.jpg`

```text
Male university student suffers a ruptured disc after deadlifting 90 kg and seeks damages from gym
```

5. `img-06.jpg`

```text
PTT news: Korean male university student ruptures a disc while deadlifting 90 kg; Fitness Factory ordered to pay TWD 1.57 million at first instance
```

6. `img-07.jpg`

```text
Blog: A 70 kg Korean male university student deadlifts 90 kg and ruptures a disc—more than TWD 1 million in damages? Was the gym at fault? What was the exerciser's mindset?
```

7. `img-08.jpg`

```text
Legal commentary: Male university student ruptures a disc while deadlifting; well-known gym ordered to pay TWD 1.57 million at first instance
```

8. `img-09.jpg`

```text
Judgment review: Gym beginner asked to deadlift 90 kg, resulting in an acute disc rupture
```

9. `img-10.jpg`

```text
Did a Korean male university student rupture a disc after deadlifting 90 kg during a personal-training session?
```

Do not translate or rewrite the external publishers' URL paths.

### Neutral discussion framing

Replace the prose from `Because the case was reported...` through the two
numbered reasons with exactly:

```md
Because multiple Taiwanese outlets reported the matter, it attracted public attention.

Public discussion focused on two features:

1. **The case raised practical questions about consumer remedies and the evidence needed to pursue a gym-injury claim.**
2. **The defendant was a publicly listed company operating a large fitness chain, while the injured customer was a Korean university student.**
```

Immediately after `Here I will answer several frequently asked questions.`,
replace the existing advice sentence with:

```md
The following is general information, not legal advice for a particular case.
```

### Legal routes and periods

Replace FAQ items 1 and 2 with exactly:

```md
**1. What legal routes may be available after a gym injury in Taiwan?**

(1) A criminal complaint for negligent injury, if the legal elements are met

(2) A civil claim for damages

​

**2. What time limits may apply?**

(1) Under Criminal Code Article 287, negligent injury under Article 284 is an offense prosecutable only upon complaint. Under Code of Criminal Procedure Article 237, a person entitled to complain must file within six months after learning the offender's identity. ([Criminal Code Article 287](https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=287&pcode=C0000001); [Code of Criminal Procedure Article 237](https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=237&pcode=C0010001))

(2) Under Civil Code Article 197, a tort damages claim generally must be exercised within two years after the claimant learns of both the injury and the person liable. A ten-year longstop runs from the wrongful act. ([Civil Code Article 197](https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=197&pcode=B0000001))

Other possible claims, and rules affecting limitation or complaint periods, depend on the facts. Seek case-specific advice promptly.
```

Do not mention Civil Code Article 198.

### Evidence-preservation guidance

Replace FAQ item 3 in full with exactly:

```md
**3. How can evidence be preserved after an accident?**

A claimant generally needs evidence supporting liability, causation, and loss.

Relevant material may include CCTV footage, medical records, receipts, communications, witness accounts, and training records.

A gym may decline an informal request for CCTV. To reduce the risk that relevant footage is overwritten or otherwise becomes unavailable, consider taking the following practical steps promptly.

**​**

**(1) Send a formal written preservation request—by a content-certified letter or through counsel—identifying the relevant footage and asking the gym to preserve it.**

The request documents when and what you asked the gym to preserve. Any evidentiary consequence of lost or deleted footage is for the court to assess based on the circumstances.

​

**(2) If the facts may involve a criminal offense, report the matter promptly. The investigating authorities can then determine whether they have legal grounds to obtain or preserve the footage.​**

**​**
```

Do not promise that a letter will compel preservation, that missing evidence
will automatically create an adverse inference, or that police will obtain
the footage.

### Damages qualifications

Preserve items 1–3 in FAQ item 4. Replace items 4–7 with exactly:

```md
(4) Loss of earning capacity – If lasting impairment is established, the court may consider medical and other expert evidence, the degree of impairment, the claimant's occupation and earnings, and the expected remaining working life. An impairment rating does not automatically establish the amount recoverable.

(5) Lost earnings during recovery – Documented income lost during a period when the claimant could not work.

(6) Non-pecuniary damages – The court assesses the amount based on the severity of the injury, the parties' circumstances, and other case-specific factors.

(7) Punitive damages – In litigation brought under the Consumer Protection Act, Article 51 allows a consumer to claim punitive damages of up to five times actual damages for injury caused by a business operator's intentional misconduct, up to three times for gross negligence, and up to the amount of actual damages for negligence. Whether the Act applies, and whether any punitive damages are awarded, depends on the facts and the court's assessment. ([Consumer Protection Act Article 51](https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=51&pcode=J0170001))
```

### Insurance and closing

Replace FAQ item 5 with exactly:

```md
**5. If a gym has liability insurance, why might compensation still be disputed?**

Coverage limits, exclusions, causation, and the value of claimed losses may be disputed. Items such as loss of earning capacity and non-pecuniary damages often require medical, financial, or expert evidence. The insurer's and gym's positions depend on the policy and the facts; insurance does not determine liability or the amount of compensation by itself.
```

Replace the closing prose after the FAQ summary with exactly:

```md
That concludes this summary of frequently asked questions and answers.

If you are injured at a gym in Taiwan, seek appropriate medical care, preserve relevant evidence, and obtain timely advice about the specific facts.

Depending on the circumstances, options may include negotiation, a consumer complaint or mediation, a criminal complaint, or a civil claim.

Similar issues can arise after falls on business premises, food-related illness, or injury while receiving professional services. The available rights and remedies depend on the facts and the applicable law.
```

## Factual boundaries and official sources

- TWD 1.57 million is the first-instance damages ruling. The later disposition
  was a settlement on appeal; do not state or imply a settlement amount.
- Criminal Procedure Article 237 runs six months from knowledge of the
  offender for an offense prosecuted only upon complaint. Criminal Code
  Article 287 confirms negligent injury under Article 284 is such an offense.
- Civil Code Article 197 includes both the two-year knowledge-based period and
  the ten-year longstop.
- Consumer Protection Act Article 51 applies to litigation under that Act and
  provides the 5× / 3× / 1× maxima; applicability and award are not automatic.
- Evidence-preservation and police language is practical guidance, not a
  statutory guarantee.
- Do not promise recovery, describe a final win, stereotype Korean or
  Taiwanese people, assume every gym is insured, attribute motives to gyms or
  insurers, or direct every reader to litigate.

Primary sources:

- Criminal Code Article 287:
  `https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=287&pcode=C0000001`
- Code of Criminal Procedure Article 237:
  `https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=237&pcode=C0010001`
- Civil Code Article 197:
  `https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=197&pcode=B0000001`
- Consumer Protection Act Article 51:
  `https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=51&pcode=J0170001`
- First-party case article:
  `https://www.wei-wei-lawyer.com/post/taiwan-gym-injury-lawsuit`
- Official attorney profile:
  `https://www.hoveringlaw.com.tw/zh/wei.html`

## Regression requirements

Extend `columns-en-content.test.ts` with a focused column-010 contract that
proves:

1. the raw source and loaded public content contain no Han, Hangul, Hiragana
   or Katakana characters;
2. all nine exact English media captions occur twice in the raw markdown—once
   as alt text and once as a human-readable link label (records 1–8) or the
   following bold caption (record 9);
3. every `featured-01.jpg` and `img-01.jpg` through `img-10.jpg` path remains
   present with the same occurrence count as the pre-edit file;
4. all eight media source URLs and three internal `See also` links remain
   unchanged;
5. the source contains no nested linked-image construct beginning `[![` and
   no public media link uses a bare URL as its visible label;
6. the case paragraph contains `first-instance`, `TWD 1,570,000` and
   `settlement on appeal`, with no settlement amount;
7. the official Article 287, 237, 197 and 51 URLs and exact limitation
   triggers appear;
8. `read_time` is exactly `6 min read`;
9. the source excludes:
   - `Civil Code Article 198`;
   - the whole words `win`, `won`, `victory`, `guarantee` using a boundary
     aware regular expression such as `/\b(?:win|won|victory|guarantee)\b/i`
     so `following` does not create a false positive;
   - `Koreans are very fond`;
   - `Taiwanese consumers often have a weaker`;
   - `almost impossible`;
   - `gym will refuse`;
   - `prevent the gym from destroying`;
   - `police can obtain`;
   - `until the plaintiff's retirement`;
   - `Taiwan gyms are usually insured`;
   - `insurers are often unwilling`;
   - `Be sure to pursue litigation`.

Do not impose a no-Han rule on the entire English corpus: other English
articles intentionally include Chinese legal terms in parentheses.

## Forbidden scope

- Any other English, KO, ZH-Hant or JA column
- Frontmatter title, source URL, dates, category or featured-image path
- Media image files or linked publisher URLs
- Column loader, route, UI, SEO, JSON-LD, CSS or assets
- `column-embeddings.json`; regenerate embeddings only after all source-text
  corrections are complete
- Stage, commit, push, deploy or server operation by the worker

## Required automated gates

```bash
npx vitest run src/lib/__tests__/columns-en-content.test.ts
npm run -s typecheck
npx eslint src/lib/__tests__/columns-en-content.test.ts
git diff --check
git status --short
```

Independent legal-fact and native-English reviews are required before commit.

The manager owns Playwright verification of
`http://127.0.0.1:3765/en/columns/taiwan-gym-injury-lawsuit` at desktop
`1440 × 1000` and mobile `390 × 844`: HTTP 200, `lang=en`, exact
first-instance/appeal stages, all nine visible English captions, zero CJK
leakage in main text and image alts, official-law links, unchanged internal
links, no bare percent-encoded media URL labels, no page/console errors and no
horizontal overflow.
