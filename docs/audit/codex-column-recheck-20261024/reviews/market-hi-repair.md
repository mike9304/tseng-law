# Hindi market 670–673 — bounded author repair

Date: 2026-10-24. Role: `/root/market_review_hi/repair_hi_market`, AI Hindi author-repair role. This report is a self-check, not independent locale/legal approval and not publication evidence.

Scope: the four assigned manuscripts only. I did not change 669, ARC704–706, shared code, the variety checker, another agent's report, or any image file. No commit, push or deployment was performed.

Current handoff: H1–H10, final legal findings H-F1/H-F2 and the parent reviewer's final concise-ending repair are implemented. All four files now have actual CLI exit 0 / FAIL 0. This is author verification only; the independent locale and final legal reviewers must bind their decisions to the latest hashes below.

## Read material and bounds

Read all four complete manuscripts; `market-hi-independent.md` H1–H10 and its opening/comparison/source findings; `MARKET-REVIEW-BRIEF.md`; repository `AGENTS.md`; repository `docs/columns/EDITORIAL-VOICE.md`; `COLUMN-VOICE-RULE.md`; full `SENTENCE-VARIETY-RULE.md`; full `LESSONS.md`; `tseng-law-editorial/SKILL.md` and its review criteria. The home canonical voice path `/Users/son7/agent-library/knowledge/editorial-voice.md` is absent on this machine, so the repository copy was used as instructed. Historic Fable gates were not applied.

Before editing, all four files matched the exact hashes in the independent review. Their byte snapshots and before-hash receipt are in `market-hi-repair-support/`. The full diffs from those snapshots are saved as `670-repair.diff` through `673-repair.diff`.

## Repairs

| Finding | Applied repair and reason | Meaning/conditions retained |
|---|---|---|
| H1, 670 | Deleted the redundant instruction `सूचना में वास्तविक खराबी बताएँ।` after the measurements. The end now says `कारण अस्पष्ट हो तो बताएँ। अनुमानित डिजाइन दोष को सिद्ध तथ्य न बनाएँ।` | Serial number, order, delivery/test dates, agreed output/tolerance/speed, actual measurements, materials/settings/power and uncertainty-versus-proof distinction remain. The short sentences communicate actual facts; no warning was added to meet a metric. |
| H2, 670 | Deleted `सुरक्षा जरूरी है।`; the concrete instruction is now `प्रमाण के लिए खतरनाक मशीन न चलाएँ।` | Do not operate a dangerous machine to create evidence. Article 358's distance/agent conditions, temporary preservation duty and evidence presumption remain. |
| H3, 670 | Replaced the two abrupt closing commands with the actual proof/causation/contract connection: `पूरा नुकसान स्वतः मंजूर नहीं होता। उत्पादन ठप पड़ने, भारतीय ग्राहक के दावे या स्थानीय मरम्मत के खर्च की भरपाई माँगते समय नुकसान का प्रमाण, खराबी से उसका संबंध और अनुबंध की शर्तें देखनी होंगी।` | Article 360's warranty/intentional nondisclosure branches, no automatic recovery of all loss, production loss/customer claims/repair costs, loss evidence, causal connection and contract remain. |
| H4, 671 | Removed `ये तीन कसौटियाँ उसी नियम में हैं।` and `यहाँ किसी कर्मचारी की राशि नहीं निकाली गई है।` | All four scope dimensions, underlying rule links and Article 2 calculation factors/caveat remain. |
| H5, 671 | Connected the new job's location and non-confidential comparison details in one instruction: `नई नौकरी बेंगलुरु में हो या ताइवान में, स्थान के साथ उत्पाद, जिम्मेदारी और ग्राहक-समूह का गैर-गोपनीय विवरण दर्ज करें।` The existing industry-only caution is concise: `सिर्फ उद्योग देखकर निर्णय न लें।` | Bangalore/Taiwan, location recording, actual process-development versus technical-sales comparison, products/duties/customer group and no automatic title-change exemption remain. `employer` is no longer inserted unnecessarily. Business terms that identify actual work/documents remain. |
| H6, 672 | Deleted the invented India-practice rebuttal and article-drafting statement about not assuming an early-exit penalty. | Private residential scope, office article link, fixed-term rule, early termination clause, notice and landlord agreement remain. No fixed penalty is introduced. |
| H7, 672 | Deleted `यह परिणाम की गारंटी नहीं है।` from the local mediation paragraph. | The ability to seek mediation, process-fee exemption and evidence/amount/representation-dependent procedure remain; no recovery guarantee is created. |
| H8, 673 | Deleted `उपलब्ध स्थिति को उसी नाम से दर्ज करें।` | Immediate bank contact, reference/answer, Indian reporting route/date and no freeze/refund guarantee remain. |
| H9, 673 | Replaced the doubled locative/abstract effect wording with three connected sentences explaining Article 310: creditor approval is one among several grounds; outside the other specified grounds, effect is limited to the creditor's actual benefit. The display-name sentence now reads `Display name निर्णायक नहीं है।` | No exhaustive two-ground test is claimed. Other Article 310 grounds remain open; approval and actual-benefit branches are distinct. Article 309 and governing-law limits are untouched. |
| H10, 673 | Joined the screenshot explanation: `Screenshot पढ़ने में सहायक है, लेकिन उसमें ईमेल की पूरी तकनीकी जानकारी नहीं होती।` Removed the hypothetical statutory-guarantee rebuttal and vague urgency reminder. The verification section ends with `पुष्टि का समय और व्यक्ति दर्ज करें।` attached to the bank/recipient/invoice check. | Original export/headers/attachments, IT coordination, known-versus-unknown distinction, independent callback and concrete confirmation record remain. CIB wording continues to be advice, not a statutory mandate. |
| Parent follow-up, 670 ending | Changed `अभी के लिए परीक्षण में बदले गए पुर्जों की सूची बचाएँ।` to `परीक्षण में बदले पुर्जों की सूची बचाएँ।` after the parent read the current full article and identified the dispensable buffer. | The concrete instruction to retain the list of parts changed during testing is unchanged. This is one naturally concise factual sentence, not a new warning or punctuation split. |
| H-F1, 670 | Final legal reviewer requested a substantive modal-strength correction after H1–H10. Changed `माना जा सकता है` to automatic `माना जाता है`, expressly distinguishing ordinary-inspection defects and later-discovered hidden defects with an OR condition. Their shared consequence is stated once. | Article 356's two notice-failure branches and Article 357 intentional-concealment exception remain. This is a legal-strength correction, not merely style. |
| H-F2, 672 | Final legal reviewer authorized a narrow FAQ/body exception correction. Both occurrences of government-established institution now read `सरकार या इस काम के लिए उसके द्वारा स्थापित विशेष निकाय अथवा संस्था द्वारा संचालित`. | Expressly retains the dedicated-purpose body/institution limitation in Article 4(2), rather than all government-established institutions. Hostel/employer-housing classification still requires the operator and contract to be examined. This is a substantive scope clarification; it is the only FAQ change. |

## Direct official checks for affected legal passages

Opened these current official pages on 2026-10-24, in addition to reading the parent review's source record:

- [Civil Code Article 310](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=310): its first two numbered grounds are not reduced to creditor approval alone; the third ground limits effect to the creditor's actual benefit outside those earlier grounds. The revised text is illustrative, not exhaustive.
- [Civil Code Article 356](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=356): paragraph 2 deems acceptance for the specified ordinary-inspection notice failure, except defects not discoverable by ordinary inspection; paragraph 3 requires immediate notice upon later discovery and likewise deems acceptance on failure. The full-code pending-commencement banner names Articles 166-1 and 1223; it does not suspend Article 356.
- [Rental Housing Market Development and Regulation Act Article 4](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0060125&flno=4): subsection 2 expressly includes government or its established dedicated juridical bodies/institutions. This supports the narrowly authorized FAQ and body clarification.

Public source-check footers remain dated 23 October 2026; this narrow repair did not claim to repeat the entire source review. The parent and final reviewer retain their separate live-law audit responsibility.

## Preservation and actual commands

`checks-current.json` records exact latest hashes, full CLI output, parsed metrics and preservation comparisons. For every file:

- All Markdown destination URLs remain in the original sequence, including official sources and internal links.
- All body numeric tokens remain in the original sequence.
- Frontmatter is byte-for-byte preserved apart from `lastmod: "2026-10-24"` and the expressly authorized 672 FAQ Article 4(2) clarification. Thus published/date_display, title/summary, internal author, image path, alt and caption are preserved.
- Scoped `git diff --check -- <path>` exited 0 for all four manuscripts.

Actual variety command, run individually for every file:

```text
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-revision-20261024/repo/src/content/columns-hi/<assigned-file>.md
```

| ID | Sentences | CV | Short share | CLI outcome | SHA256 |
|---|---:|---:|---:|---|---|
| 670 | 53 | 0.454 | 0.151 | exit 0; FAIL 0 | `a8322aa20cc87e436e5aee929441d44c4cdffa04bbf32370b0df381259c87be3` |
| 671 | 48 | 0.451 | 0.250 | exit 0; FAIL 0 | `c9f7d8a3a90a1d533ebfaa5ad6f7b6ff0f23ad7430396de3a9532555f403712f` |
| 672 | 54 | 0.502 | 0.204 | exit 0; FAIL 0 | `44c8534add421222c5fa56d250f94b41820bcfb4d58e51d5d0395a33eed2b6f0` |
| 673 | 47 | 0.451 | 0.170 | exit 0; FAIL 0 | `af4d8bc235868b1bbef96be13b69383ea932d27e1ee1122e50b5258910f09acd` |

Earlier actual failed metric logs remain under `*-variety-r1.log`, `*-variety-r2.log`, `*-variety-r3.log` and `670-variety-before-last-concision.log`. They are not hidden or labeled independent review rounds. The shared metric code was not changed. At CV 0.447 the author reported the remaining failure to the parent rather than adding filler. The parent independently identified removable wording in the existing last action sentence (`अभी के लिए` and `गए`); applying that bounded edit produced CV 0.454 with the same substantive instruction.

## Section 5 author self-check

1. Actual CLI: all four files exit 0 / FAIL 0. These mechanical results are not independent prose or legal approval.
2. The repair preserves the four opening types and the useful scope facts. 670 opens with the notice decision; 671 with the salary/compensation rule; 672 with a labeled departure/deposit hypothetical; 673 with immediate bank action. H8 removes only the vague tail of paragraph two. The parent report supplies the five-article/three-prior-comparator review; I did not independently certify the untouched 669.
3. Each file retains at least two useful short sentences. No long sentence was created by merging unrelated points. H-F1 combines two statutory triggers sharing one result; H5 connects job location with the same comparison record. The longer 672 exception sentence enumerates one statute's scope and is followed by shorter classification instructions.
4. Existing paragraph openings were checked after the changes. No new repeated stock transition or instruction heading was added. Actual opener and consecutive-start checks remain clear.
5. Citation links are preserved; practical evidence/action paragraphs without citations remain. No three-paragraph claim/citation/caveat sequence was introduced.
6. Removed unsupported India-practice and hypothetical-guarantee rebuttals. Remaining contrasts carry relevant legal distinctions.
7. Topic-specific endings still identify changed test parts, signed non-compete/compensation due date, disputed deductions, and original/changed invoices. Firm language availability and sensitive-document boundaries remain truthful.
8. No bold, invented first-person/client experience, human reviewer/byline claim, new checklist heading, sales promise or fear language was introduced. Korean/Japanese register rules do not apply to these Hindi bodies.
9. Numeric values, dates, URLs and the hypothetical label were compared. H-F1/H-F2 are explicitly recorded as legal corrections; other modal strength and scope are preserved.

Next step: the independent locale reviewer and separate final legal reviewer re-read repaired passages and affected conclusions at these exact hashes. No independent PASS or publication is claimed by this author-repair role.
