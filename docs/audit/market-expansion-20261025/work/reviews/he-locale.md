# Independent Hebrew locale review — PASS

Reviewer: `/root/expand_locale_he`, independent of the author. Both frozen manuscripts passed the source-level Hebrew, metadata, FAQ, actual image, first-two-paragraph deletion, three-comparator and §5 review. No material finding remains and no manuscript repair was requested. This is not a human native-speaker or lawyer certification.

| Article | Full source SHA-256 | Task-local measurement | Verdict |
|---|---|---|---|
| 932-israel-taiwan-pph-patent-claims-window.md | `514c395c3212ea39504ab710d7b3130ad5bd0e996169b0c5cab212ea1752b3c5` | 37 sentences, CV 0.465, exit 0 / no HARD failure | PASS |
| 933-israeli-taiwan-joint-patent-license-consent.md | `95da9c181636d91a8a2da1e7e237f29d08c77c159740301e9c87b0804139a898` | 43 sentences, CV 0.481, exit 0 / no HARD failure | PASS |

Original shared CLI: Hebrew unsupported, exit 2 for both. It is preserved separately and not treated as PASS. The exact independently reviewed task-local wrapper was then run on each current source, and all actual extracted sentences were read. The final approval binds the current sources, images and the following evidence.

- [Full independent review evidence](he-locale-evidence.md): complete opening tests, three actual October 24 Hebrew comparators, paragraph-level terminology/meaning checks, official-source spot checks, image inspection and §5.
- [Actual original and task-local commands/results](he-locale-measurements.json).
- [Actual measured sentences, all read](he-locale-extracted-sentences.json).
- [Independent method approval](../variety-review/review-final.json), SHA-256 `f0cfcfea6e841dd0ed59df3b2727fd74bb236604d0991e124b88bceb12c3659c`.

932 preserves both PPH window conditions and the lack of automatic grant. 933 preserves own-use versus third-party licence, unanimous consent, exclusivity/sublicensing, recordation and disposition of a share. Both identify the actual four consultation languages; neither invents patent-filing qualifications, a client case or a public byline.

This review covers source-level language and mixed-script punctuation, not browser RTL layout, interactions, deployment or public readback. The independent final legal reviewer will bind the current source hashes and this report. No publication was performed by this reviewer.

## Caption-only recheck

The integration change shortened both Hebrew captions to `סצנה בדיונית` (fictional scene), which is natural and preserves the illustrative status without an authorship claim. I inspected the actual one-line diffs, reconstructed each preceding source by restoring only its old caption, and verified that its SHA equals the source approved in the prior report. Thus body, title, summary, FAQs, alt, dates, links and all other source bytes are unchanged; both image hashes also remain identical. Prior reports are preserved with the `-before-caption` suffix.

The approved guarded CLI was run again against both new full-source hashes: exit 0 and unchanged CV .465/.481. The original shared checker was also rerun: Hebrew unsupported, exit 2, still separately recorded. Re-extracted sentence arrays are byte-for-byte identical to the 37/43 sentences already read. No substantive rereview or manuscript repair was needed. Exact pre/post hashes and displayed diffs are in `he-locale-caption-recheck.json`. This PASS now binds the caption-normalized source hashes above.
