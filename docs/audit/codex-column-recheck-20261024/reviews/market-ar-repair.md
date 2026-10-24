# Arabic market 700–703 bounded repair

Date: 2026-10-24. Repairer: `/root/market_review_ar/repair_ar_market`, an AI editing role. This is a repair record and self-check, not an independent review or publication claim. Only the four assigned manuscripts and this repair record/JSON were written. Article699, ARC704–706, images, shared checkers and reviewer reports were not edited. No commit or deployment was performed.

Read the full market brief, Arabic independent report, repository instructions, editorial voice, column voice pointer, sentence-variety rule, lessons, editorial skill and review criteria before editing. The initial changes below address R1–R8. A later final-review follow-up is recorded at the end and changes only701:48–50.

## Repaired passages

| Finding | Change | Preserved substance |
|---|---|---|
|R1 /700:40|Deleted `هذا السؤال يتطلب ملف تبليغ، لا جوابًا عامًا بأن «الجميع عرف بالقضية».` The actual notice/defense question leads directly into the evidence list.|Notice, opportunity to defend and all listed records remain.|
|R2 /700:50|Replaced the elaborate metaphor and regional-language rebuttal with `لا يُفترض توافر المعاملة بالمثل مع السعودية أو انتفاؤها. يتطلب تقييم هذا الشرط بحثًا قانونيًا محددًا، وقد يحتاج الملف إلى مواد رسمية أو شرح للقانون الأجنبي.`|Neither reciprocity nor its absence is asserted; specific legal research and possible foreign-law evidence remain.|
|R3 /701:34|Changed the instruction about what a lawyer should tell a client to `ويُفحص بند اختيار المحكمة ضمن هذه الوقائع، دون افتراض أنه يكفي وحده للاعتراف بالحكم في تايوان.`|Taiwan-law jurisdiction scrutiny and the absence of an automatic recognition guarantee remain.|
|R4 /701:40|Deleted `لهذه الصياغة حدود محددة.`|The complete default-service exception and the following geographical caution remain unchanged.|
|R5 /702:28|Replaced the language/religion and imagined regional-law rebuttals with `بالنسبة إلى الوارث المقيم في الإمارات أو السعودية، تُحدَّد الدولة والقواعد المنطبقة على المتوفى والعلاقة الأسرية من وثائق الجنسية والأسرة، قبل اقتراح توزيع للتركة.`|The overseas-heir perspective, relevant nationality/family inquiry and sequence before distribution remain. The residence-alone FAQ limitation is unchanged.|
|R6 /702:36|Replaced `وسلطتها التي أصدرتها` with `والجهة التي أصدرتها`.|The issuing-authority inquiry remains.|
|R7 /702:62|Replaced the clipped `لا وحده.` with the complete sentence `لا يكفي ذلك وحده.` following the independent reviewer's follow-up. The question already states that the assets are in Taiwan, so the answer need not repeat that whole phrase.|The next sentence on applicable law and the Taiwanese-heir protection under Article58 is unchanged.|
|R8 /703:28|Replaced the publication-does-not-promise paragraph with `تُقدَّم الاستشارات بالإنجليزية والصينية والكورية واليابانية. إذا كنت تفضّل التواصل بالعربية، فتُؤكَّد ترتيبات اللغة والترجمة قبل إرسال أصول المستندات أو تكليف مترجم بالملف كاملًا.`|Only the four actually offered consultation languages are stated. Arabic/interpreter arrangements still require confirmation; no Arabic service or interpreter supply is promised.|

These are meaning-preserving prose repairs. No legal condition, limitation period, amount, burden or substantive FAQ conclusion was changed. Every modified file has `lastmod: "2026-10-24"`; all other frontmatter, including published/date_display, author, FAQ and image metadata, is byte-identical. The original 23October2026 source-review date in each article remains.

## Opening deletion tests

- 700: The unchanged opening definition establishes whether Taiwan's foreign-award procedure applies; the next paragraph establishes recognition before enforcement. Removing either loses the procedural basis. R1/R2 do not alter the opening.
- 701: The unchanged opening starts from the creditor's enforcement question, immediately states the Taiwan permission-to-enforce requirement, then limits the article to final civil money judgments. Both paragraphs retain necessary scope.
- 702: The unchanged first paragraph states the decedent's national law at death and the Taiwanese-heir exception. Revised paragraph2 identifies the nationality/family records needed for the overseas heir's inquiry. The unnecessary rebuttals are gone; removing this replacement would remove the document-based next step.
- 703: The first paragraph connects special authority with concrete acts before signing. Revised paragraph2 supplies actual consultation-language availability and the timing for confirming translation arrangements. Neither function is supplied by the other paragraph.

## Actual variety checks and preservation

Command for each file:

`python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <absolute manuscript path> --lang ar`

|Article|Sentences|CV|Short fraction|Run3|Exit /FAIL|Latest SHA256|
|---|---:|---:|---:|---:|---|---|
|700|40|0.481|0.200|0.053|0 /0|`83f59b9e7226cb0fe1179e61ed7e21da2ca883b4ae72e6345080a6cb183671ec`|
|701|35|0.489|0.143|0.121|0 /0|`60ceafe3ad1a8501fbf4e0fb280aedf08d3342b8cb15450035e011497f1465f5`|
|702|42|0.452|0.167|0.050|0 /0|`ef2194e02154f5e4abb76df92e183ddd0a31f2a6777da032c705e422865a34de`|
|703|42|0.466|0.214|0.050|0 /0|`17a3d3093807398e25fe590ba983a90c956a0e63ca5f69479793204ff2a1ec3f`|

The first repair of702 repeated the full asset-location phrase in R7 and measured CV0.444/FAIL1. The reviewer supplied the shorter complete answer above to avoid repeating the question. No R5 expansion, filler sentence, unrelated sentence merger or alteration of other paragraphs was used. That initial output is retained in `market-ar-repair.json` under `variety_attempts`.

The JSON also stores each original full text, original/current hashes, exact CLI stdout/returncodes, and actual URL sequences. For all four files, comparisons confirm identical external/internal URL sequences, identical numerical-token sequence after excluding only lastmod, identical remaining frontmatter and unchanged source-review dates. No bold markup was found. `git diff --check -- <the four assigned files>` exited0 with no output.

## Section5 self-check

1. Actual CLI was run on the latest hashes: four files, FAIL0 each.
2. No stock hypothetical opening was added. The opening functions remain definition, enforcement question, applicable-law rule and agency wording; the independent report documents their comparison with the five-article batch.
3. Each file retains at least two meaningful very short sentences. Long legal statements remain connected to their respective conditions; no long sentence or artificial fragment was added for a metric.
4. Read the paragraph starts vertically: no new repeated opener pattern was introduced; CLI opener results remain within limits.
5. No three consecutive claim/citation/caveat paragraphs were introduced. Existing practical evidence and document paragraphs remain without unnecessary citations.
6. Removed the specific imagined reader rebuttals in R1/R2/R5; needed statutory exceptions and real service limitations remain. Contrast counts are1/0/0/0.
7. Closing paragraphs are unchanged and end with the specific judgment, inheritance or authority documents relevant to each article. No promotional close was added.
8. Arabic professional register remains consistent. No bold, invented first-person experience, human/native-review claim, public byline or imperative checklist heading was added. Korean/Japanese register checks do not apply.
9. Automated source/number/metadata comparisons and direct rereading found no lost statutory number, deadline, amount, source or hypothetical marker. Twenty-day and three-month calculations are unchanged.

## Source check and evidence limits

The repairer opened current official [ArbitrationAct49](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=I0020001&flno=49), [CPC402](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=402) and [choice-of-law Act58](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=58) on2026-10-24 to check the affected uncertainty/jurisdiction/inheritance statements. Other unchanged claims retain the independent report's current source review; this narrow repair does not claim to repeat that full legal audit.

The web tool could not retrieve the contact page. The repairer read the parent's current live curl artifact `market-ar-contact.html`, which explicitly names English, Chinese, Japanese and Korean consultations and requires confirmation for other communication arrangements. R8 stays within that evidence. No image or browser/mobile layout recheck was performed by the repairer; images and their metadata were not changed, and the parent review records their actual visual inspection.

Next: `/root/market_review_ar` independently rereads the repaired passages and affected FAQ/closing conclusions at the four latest hashes. This record does not certify an independent PASS.

## Final-review follow-up:701 reciprocity passage

Request: `/root/final_market_crossborder`, relayed by the independent Arabic reviewer `/root/market_review_ar`, identified two remaining self-referential/regional-rebuttal paragraphs at former lines48–50. Only this passage was changed. All other manuscripts remain frozen at the table hashes.

The replacement states the actual inquiry directly:

> يتطلب تقييم الاعتراف المتبادل في المادة 402 مصادر تخص النظام القانوني والمحكمة المعنيين، وقد يستدعي تقديم نصوص أو سوابق وشرح للقانون الأجنبي. وعند جمع مواد عن تنفيذ الأحكام الأجنبية داخل الإمارات، يلزم بيان صلتها بالاعتراف بالأحكام التايوانية. وتفصل المحكمة التايوانية في الطلب.

It retains the system/court-specific evidence inquiry and the Taiwan court's decision, without asserting either reciprocity or its absence, a treaty prerequisite or automatic enforcement. This is a prose repair; no other paragraph was changed to affect the metric. Exact URL and numeric sequences remain identical, including the one Article402 reference in this passage. All frontmatter is unchanged, with lastmod already2026-10-24. FAQ, images, source-review date, opening and closing are unchanged.

Latest actual CLI:35sentences, mean18.2, CV0.489, short0.143, run3 0.121, opener_rep0.133, cite_end0.0, cite_para0.4, contrast0, caveat0, q2; exit0, FAIL0. The table above is updated to the latest701 hash. The JSON retains the prior701 hash, full intermediate text, prior CLI and the exact new diff under `followups`.

Section5 self-check repeated for the affected passage: the opening is unchanged; five genuine short sentences remain; the evidence inquiry and related UAE-source explanation are logically connected; the paragraph starts and citation pattern remain varied; the imagined regional inference is gone; the article-specific closing is unchanged; no bold, invented experience, checklist heading, new legal number or lost source was added. No metric-padding sentence or unrelated merger was used. `git diff --check` on701 returns exit0 with no output.701 is frozen pending the parent's independent recheck; the repairer does not certify an independent PASS.
