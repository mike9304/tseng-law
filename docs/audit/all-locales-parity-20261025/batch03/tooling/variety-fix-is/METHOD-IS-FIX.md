# Icelandic ordinal and terminal-abbreviation correction

The HR/HU correction was separately frozen and installed by root. Its 36 production files match shared and its installation receipt; this new isolated candidate copies them unchanged into `baseline35/`. The inherited 42 test methods pass. HR/HU files and results are not revised by this follow-up.

The engineer has seen root's reported IS target fragments: coordinated ordinal references and a real sentence after terminal `gr.`. No complete IS manuscript or its score was read for design. `/root/column_deploy` supplied ten newly authored neutral expected arrays, independently of target scores; four engineer-authored title/casing/quotation counterexamples extend them before code. These are AI engineering examples, not human native approval.

[Official Ritreglur](https://ritreglur.arnastofnun.is/), §§22.2–22.6, distinguishes ordinal/abbreviation dots from sentence stops, keeps a single dot when roles coincide, and also covers numeric grouping, dates and time. §1.2.1 distinguishes a new capitalized sentence from lowercase continuation, while §§1.2.5.2 and 26.1.1 cover capitalized acronym compounds. These rules motivate the neutral examples; they do not define a tokenization algorithm or a readability threshold.

Diagnosis: IS does not opt into the already-installed lowercase ordinal continuation behavior, so a number before `og` splits. `gr` is listed only as nonterminal, so its dot is masked even before an independent next sentence. Merely making `gr` terminal risks splitting a capitalized document compound inside the same reference.

Pre-code contract:

- IS may opt into the existing contextual dotted-numeral continuation branch. No other locale's flags or rules change.
- `gr.` may be terminal before a capitalized next sentence or end of input under the existing abbreviation heuristic. Quotes stay attached, lowercase reporting clauses stay together, and a semicolon remains nonterminal in this metric contract.
- A finite next-word continuation exception for `gr` preserves a hyphenated document-kind genitive such as a fictitious acronym plus `reglnanna`. The prefix is not a literal ABC/XYZ allow-list. A nominative form beginning the next sentence remains a separate sentence.
- NFC/NFD, Unicode horizontal spaces, decimals, grouped amounts, dates, times, genuine ordinal endings, quotations, source tails and actual Markdown preprocessing are tested with literal arrays.
- Words, source text, score, HARD and cutoffs remain unchanged. Freeze code before paired article measurements; retain any new FAIL results. Compare old28 and current35 same-byte inputs, separating staging and raw checker file counts from professional/publication counts.

Limits: abbreviation capitalization remains a heuristic; names/titles can be ambiguous. Only declared document-kind suffixes receive the exception, and an identically shaped phrase can itself start a new sentence. This is not full Icelandic parsing or a guarantee for every abbreviation. Root must review and install; this agent never modifies shared, R or manuscripts.
