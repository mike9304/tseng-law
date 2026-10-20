# How these judgment copies were authenticated (for the Astra gate)

- Every judgment text in this folder was fetched directly from the Judicial Yuan's official FJUD system, https://judgment.judicial.gov.tw/FJUD/data.aspx?ty=JD&id=..., with curl and a browser User-Agent (FJUD rejects plain curl). Each response was HTTP 200.
- Each copy starts with: the Source URL (the same URL cited in the drafts), the retrieval time (KST), the HTTP status, and the SHA-256 of the official HTML exactly as retrieved. The raw HTML stays in the writer's local cache (research/fjud/), and is not pushed because it contains unmasked party names.
- Party and witness names are masked with ○ in these copies only. The drafts name no parties.
- judgment-history.txt holds the official 歷審裁判 (appeal history) for every cited judgment, from https://judgment.judicial.gov.tw/controls/GetJudHistory.ashx?jid=... (the endpoint behind the "歷審裁判" button on each FJUD page). The drafts' statements about appeals, withdrawals, settlements and finality come from that list and from the later-instance texts saved here.
- If judicial.gov.tw is unreachable from the gate's network, the GetJudHistory endpoint returns a small JSON response that can be checked from any network where FJUD loads, and the SHA-256 values let a reviewer compare a fresh download against these copies.
