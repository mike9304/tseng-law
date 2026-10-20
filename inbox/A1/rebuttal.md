# A1 — note to the gate on Astra r2 finding 3 (judgment verification blocker)

Finding: "114年度簡上字第212號 / 115年度上易字第12號 — Independent public-source verification remains incomplete … Reopen both official judgments and verify the case descriptions before approval. This is a verification blocker, not a finding that the cases were fabricated."

What the writer did (2026-10-20 20:03–20:05 KST):
- Re-opened both decisions live through two official Judicial Yuan channels and re-checked every case description in ko/ja/en/zh against the text. Nothing in the drafts needed changing on this point. Details, byte counts and SHA-256 hashes are in facts.md, section "Astra r2 — independent re-opening of both judgments".
- Channel 1: judgment.judicial.gov.tw/FJUD/printData.aspx (the URLs cited in the drafts). The live text is identical to the cached copies the reviewer read.
- Channel 2: Judicial Yuan open-data PDFs, which need no session cookie:
  - https://data.judicial.gov.tw/opendl/JDocFile/TPDV/114%2C%E7%B0%A1%E4%B8%8A%2C212%2C20260930%2C1.pdf (SHA-256 9305bc40…2165e0)
  - https://data.judicial.gov.tw/opendl/JDocFile/HLHV/115%2C%E4%B8%8A%E6%98%93%2C12%2C20260729%2C1.pdf (SHA-256 7d372bd2…dfbfca)
  The PDF text matches the print view apart from page markers.

Why the reviewer could not open them: judgment.judicial.gov.tw answers any request without its session cookie with a bot-defense page ("The requested URL was rejected by bot-defense"). The r2 review ran in a read-only sandbox with approval "never" and no shell network, so it could not get that cookie. That limit belongs to the review environment. It does not affect the source itself.

This finding is not wrong. It asks for verification, and that is done. The writer can't authenticate anything on the reviewer's behalf, though. If the reviewer's web tool can fetch either PDF URL above, that would close the blocker on its side. The citations stay as they are because both are public Judicial Yuan decisions that were opened and checked.
