# Vietnamese measurement addition

Task scope: make the explicitly requested Vietnamese article checks meaningful under the existing shared CLI, with unchanged HARD limits. No target article metrics were inspected before the independent profile expectations were frozen.

- Profile author: `/root/vi_measure_profile`; frozen JSON SHA 3565e97c189498fc28f07a814d60b1548bb21e2e091d48ef1a926a7068be43df.
- Independent language review: `/root/vi_measure_review`, PASS, report SHA 4ee90621af930580a2f53bc95199ebe67c59898784d6639ea5d5b987d63d3f30.
- Root owns implementation and technical validation, not the independent language verdict. Candidate-only fixes address v.v./v. v. terminal boundaries, quotation reporting clauses, NFC/NFD matching and Điều citations. Original thirteen language branches and HARD remain unchanged.
- Initial fixture run exposed three issues (quote attribution, spaced abbreviation, NFD source heading); `fixture-tests-initial.json` preserves them. `fixture-tests.json` records the corrected 247 checks with zero errors. Expected language arrays were not edited to match code.
- `existing-regression.json` compares every supported non-VI article under the before and candidate tools; missing maps remain explicit unavailable inputs.
- `preimage.json` and `shared-before/` preserve the previous tool. Installation must fail if any preimage changed. No persistent network settings, permissions or external service state are altered.
- Remaining limitations are explicit in the method and independent language report. Article-level sentence extraction still requires editorial review. This is not a claim of a complete Vietnamese grammar parser or a human review.

Status before installation: candidate validated; shared-tool installation and actual target-article checks are separate evidence in `installation-receipt.json` and task checks.
