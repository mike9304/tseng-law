# 18 manuscript link integrity audit

Status: PASS_EXACT_INPUT_LINK_VALIDATION
Completed UTC: 2026-10-28T23:16:45.320Z

All 18 inputs bind to their final manifests. The ID final manifest was added after the initial audit with identical six article SHAs; its targeted-review scope is retained and is not described as a new independent author-uninvolved review.

| Locale | Articles | FAQs | Exact captions | Official URLs in body / footer | Findings |
|---|---:|---:|---:|---:|---:|
| he | 6 | 17 | 6 | 23 / 23 | 0 |
| fil | 6 | 17 | 6 | 23 / 23 | 0 |
| id | 6 | 17 | 6 | 23 / 23 | 0 |

All 69 expected official URL occurrences by article are present in both body and source footer. Canonical and target FAQs contain zero links, with 17 nonempty question/answer entries per locale. Exact labels: HE “סצנה בדיונית”, FIL “Kathang-isip na eksena”, ID “Adegan fiksi”.

Seven internal links resolve: six explicitly labelled English contact links use /en/contact; HE916 links to the existing Hebrew subsidiary-versus-branch column. Twelve mailto links are syntactically valid. Markdown AST parsing found no malformed or unresolved link syntax.

Input SHA guards stable: true. Full paths, SHA-256 values, individual URLs, canonical bindings and route evidence are recorded in link-integrity.json.

| Locale | ID | SHA-256 | Result |
|---|---|---|---|
| he | 915 | 13686c0b8d093322fdb54c901113003f4b050d904bc230294e3bef4a0c1587ae | PASS |
| he | 916 | ee8f0e937503cf9479373428714d7253b1da4910e1ecddba0a234c6cea998ab5 | PASS |
| he | 918 | 33a2695bf2074426d050bd3d12d3f00bf469ce8b7d56ce8b47d1b30f84a41a6c | PASS |
| he | 919 | 65b2b5695d768c01cab21c4305e718c8fdbe0e00196ac7a1422bc9dbf5402cd1 | PASS |
| he | 920 | 3ae4321156061392f5ef5a6b246b58e630dc5311500c76ca5c51373b669ec539 | PASS |
| he | 921 | 91f41497e68765d909d49900d97eff1c717bee49a6bbfd0e60745bab6a977aff | PASS |
| fil | 915 | 81aa1d77010534d340d53c26da396d580b0aedd3b7f5f6c1f6aa19408ff756ae | PASS |
| fil | 916 | 989a52f2425466424fe606feabe9018ac9be07b4d86b2e5a3bac507e0c5c8f57 | PASS |
| fil | 918 | 3c4eea0816ea6c3b1cda1c0ff0d58a5a1cd5d382203b989f99a96409d9fc0e8a | PASS |
| fil | 919 | b90be403a02cfe7f224166829546a2da9bf5de8976fed0144c328013d974259c | PASS |
| fil | 920 | 73d56d56342b0c377e8f789ebf9760bdec501835cbb6de568354f10cae655fa4 | PASS |
| fil | 921 | d9a83048e594c305177b613ddbf56fe0b76d4d7f20d1f93bff95fbbd41f6d8bc | PASS |
| id | 915 | a9b7a3adf3318a545976f83b68bfba8d6833cdb825400a6d7a25f29817478e52 | PASS |
| id | 916 | ed39d707a02933886e7b4a86431d6d0da2cdb5663093ec6a116449f665515612 | PASS |
| id | 918 | fced102293a7a5cfd2be0195a41986398a4d7726da408101fca415ecb1448e70 | PASS |
| id | 919 | f697040f2030cc626d3224bd913a095f4683265de90dce9f5b8a0adf016a88aa | PASS |
| id | 920 | 16003130aff9de7b15d28937a457644baf976a603c2bf95f707f3ccdc7a093bf | PASS |
| id | 921 | 0f0810a705c9fa19062874540ed13a9358bc33bc8d075bf0cc4f89c152fbfe82 | PASS |

No network or source freshness/meaning review was performed. Existing semantic closures are not replaced. No manuscript or R file was edited.
