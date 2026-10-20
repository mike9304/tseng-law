# A2: note to the gate on Astra r2 finding 4 (ruling verification blocker)

The finding reads: "115年度家暫字第205號 / 115年度家聲抗字第42號 — Independent public-source verification remains incomplete … Independently authenticate both official decisions and the quoted passage before publication. This is a verification blocker, not a finding that the cases were invented."

What the writer did (2026-10-20 20:08 KST):
- Both rulings were re-opened live on judgment.judicial.gov.tw/FJUD/printData.aspx, the URLs cited in the drafts. Every description in ko/ja/en/zh was re-checked against the text. The text matches the cached copies the reviewer read.
- The zh quotation 「如父母已於離婚時協議由一方單獨行使親權者，法院豈非均無限制子女出境之必要？」 appears verbatim in 115家聲抗42.
- One zh sentence was corrected during this re-read (the children had been questioned by the 原審 judge, not "in the main case"). No other description changed.
- Hashes, byte counts and the point-by-point list are in facts.md under "Astra r2 fix log".

Why the reviewer could not open the rulings: judgment.judicial.gov.tw serves a bot-defense page ("The requested URL was rejected by bot-defense") to any request that doesn't carry its session cookie. The r2 review ran read-only, with approval set to "never" and no shell network, so it had no way to get that cookie. The Judicial Yuan open-data PDF endpoint, which works without a cookie for ordinary civil judgments, returns "arguments error!" for these two family rulings. That leaves no cookieless official copy to point to.

The finding itself is correct: it asks for verification. The writer has done that verification but can't authenticate anything on the reviewer's behalf. The citations stay as they are because both are public Judicial Yuan rulings, and both were opened and checked.
