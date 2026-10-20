# A5: note to the gate on Astra r1 finding 7 (judgment verification blocker)

All four judgments were re-opened live on 2026-10-20 at 20:21 KST through two official Judicial Yuan channels, and every description in ko/ja/en/zh was re-checked. Details and SHA-256 hashes are in facts.md under "Astra r1 fix log".
- printData (the cited URLs): all four texts are identical to the cached copies the reviewer read.
- Open-data PDFs, which need no session cookie:
  - https://data.judicial.gov.tw/opendl/JDocFile/TPSV/113%2C%E5%8F%B0%E4%B8%8A%2C101%2C20240131%2C1.pdf
  - https://data.judicial.gov.tw/opendl/JDocFile/TPHV/115%2C%E5%8B%9E%E4%B8%8A%2C39%2C20260818%2C1.pdf
  - https://data.judicial.gov.tw/opendl/JDocFile/KSHV/115%2C%E5%8B%9E%E4%B8%8A%E6%98%93%2C11%2C20261007%2C1.pdf
  - https://data.judicial.gov.tw/opendl/JDocFile/TPHV/115%2C%E5%8B%9E%E4%B8%8A%2C92%2C20260901%2C1.pdf

The two substantive points the reviewer raised from the transcripts were confirmed in the official text and are now in the drafts:
- The Kaohsiung court's finding on the driver's post-accident handling.
- The 11/26 oral notice and 12/12 written notice by 新北市環保局.

The reviewer could not open the pages because judgment.judicial.gov.tw serves a bot-defense page to requests without its session cookie, and the review ran read-only with no shell network and approval "never". The PDF links above work without a cookie.

## Astra r3 finding 1 (verification blocker): official PDFs now supplied in the draft folder

As requested ("Supply the official PDFs themselves"), the four official Judicial Yuan open-data PDFs are now in `sources/` inside this draft folder, so they can be read without network access:
- sources/TPSV-113-台上-101-20240131.pdf, sources/TPHV-115-勞上-39-20260818.pdf, sources/KSHV-115-勞上易-11-20261007.pdf, sources/TPHV-115-勞上-92-20260901.pdf
- each with a `pdftotext -layout` .txt next to it (reproducible with /opt/homebrew/bin/pdftotext; diff verified identical on 2026-10-21 before 01:16 KST)
- sources/README.md: download URL, byte size and SHA-256 per file, plus a line-by-line map from every judgment statement in ko/ja/en/zh to the supporting lines of the judgment text.

The files were downloaded on 2026-10-21 01:14 KST; byte sizes and SHA-256 are identical to the r1 download recorded in facts.md (2026-10-20 20:21 KST). Every judgment statement in the four drafts was re-checked against these files; no wording change was needed for finding 1.
