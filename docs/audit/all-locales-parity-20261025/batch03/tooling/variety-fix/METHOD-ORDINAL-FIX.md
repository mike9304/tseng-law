# HR/HU ordinal boundary fix: diagnosis and pre-code contract

This follow-up starts after real HR/HU manuscript fragments were reported to the engineer. That exposure is disclosed in `BASELINE35-INSTALLATION.json`; the prior package's earlier no-target-reading record remains unchanged. No full new target article or target score has been used to design this fix. Article bytes and editorial thresholds will not be changed.

## Observations and primary sources

The installed 36-file candidate matches the root receipt and shared byte-for-byte. Its original 39 unittest methods pass. `diagnosis-baseline.json` reproduces extra sentence slices on independent library/manual examples: the finite ordinal-followers list misses ordinary adjectives, inflected nouns, coordinating conjunctions and a year followed by a continuing clause. It also misses postposed reference numbers before a capitalized document title.

[Hrvatski pravopis, Točka](https://pravopis.hr/pravilo/tocka/55/), by the Croatian language institute, distinguishes sentence-ending dots from Arabic/Roman ordinal dots and does not duplicate a final dot. It illustrates both year continuation and a single dot at a sentence end. These are orthographic reasons to disambiguate the context; the page does not specify a tokenizer algorithm. Official [Narodne novine text](https://narodne-novine.nn.hr/clanci/sluzbeni/2022_12_151_2343.html) independently demonstrates ordinary article/paragraph reference chains. Only its notation is relevant here; no Croatian legal rule is transferred to a Taiwan article.

[Hungarian AkH. 12, §§267 and 292](https://helyesiras.mta.hu/helyesiras/default/akh12#292) specifies dots after written ordinals, including before an attached-suffix hyphen. Maintaining dots in coordinated ordinals sharing a final noun is a grammatical application, not an algorithm stated in that source. §296's dash/slash-linked ranges are a distinct construction. No readability cutoff follows from these spelling rules.

## Neutral authors and expected behavior

HR author `/root/column_inventory` supplied seven original neutral positive pairs and four genuine-ending pairs before this implementation. HU author `/root/column_source_quality` supplied six positive pairs and four genuine-ending pairs. Their exact sentences are retained in `tests/fixtures-ordinal-fix.json`; additional neutral manual/newspaper/title/mixed-case examples broaden the contract without reproducing target numbers. The document titles in new examples are fictional notation examples, not claims about actual legislation. These are AI-authored linguistic checks, not human native certification.

Proposed narrow behavior, before implementation:

1. Only HR and HU opt into contextual dotted Arabic/Roman numerals followed by a whole lowercase word. Uppercase conjunctions and mixed-case tokens remain boundaries. NFC/NFD spelling and Unicode horizontal spaces must behave identically. Do not cross a paragraph/newline to infer continuation.
2. HR additionally recognizes a finite postposed reference-noun + ordinal chain + capitalized genitive document-kind context, such as an article/chapter/rule number followed by a manual or regulation title. It does not treat every capitalized word after a number as continuation. Selected inflected reference nouns and document kinds are explicit data.
3. Real numeric/ordinal/year sentence ends, uppercase next sentences, mixed-case next sentences, question marks and quoted endings must keep their boundaries. No source text, spelling or slices are rewritten; only the positions of segmentation boundaries change.
4. All other 33 locale profiles/behavior, word units, 8/32 edges, score and HARD rules remain unchanged. Prior 28-language snapshots must have zero metric differences. Existing and staged 35-language input effects are measured only after this neutral contract and fix are frozen, separately from the earlier regression set.

Limits: lowercase brands, intentionally lowercased sentence starts and a genitive document phrase beginning a fresh sentence can remain ambiguous. The chosen morphology/title contexts are finite. This is not general Croatian/Hungarian parsing, an all-Roman-numeral grammar, complete reference recognition or native/legal approval. A mechanical no-FAIL result cannot override incorrect extracted boundaries.
