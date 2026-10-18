# C5 cross-review and native-voice edit — 2026-10-16

Scope: the four C5 drafts and `facts.md`. I checked every rule against the fetched Chinese text of 公司法第205條 in `research/C5-statutes.md`, including 項 1–7 and the meaning of 應, 得 and 前二項. Official source for every legal fix below: https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=205 . The statute file gives the law-wide latest amendment header, not an amendment date for Article 205; no draft attributes that date to the article.

## ko

Legal fixes (original → new → source):
- FAQ answer's bare “제205조 제1항 … 제3항 … 제4항” → linked `제205조 제1항·제3항·제4항`, with the articles clause, another-director requirement, a written proxy for each meeting specifying authority by convened matter, and the one-principal cap together → official Article 205 URL above.
- FAQ's unlinked written-vote rule → a linked §§205(5)–(7) answer that keeps the articles clause, all-director consent, the particular meeting's proposals, no actual meeting, the conditional deeming effect and the publicly issued-share exclusion → official Article 205 URL above.
- Unlinked table rows → a separate Article 205 link in each row; the proxy and written-vote cells retain their full conditions → official Article 205 URL above.
- “두 이사에게 남는 길은 …” → “제205조상 …” so the final scenario describes the routes addressed by this fetched article, without deciding other board rules → official Article 205 URL above.

Main voice rewrites (original → new):
- “같은 조는 이 원칙 곁에 세 가지 방법을 둡니다 … 요건은 제각각입니다” → a direct account of what an overseas director can do if the board uses video, the articles authorize a proxy, or the articles and all directors permit written voting.
- “한국 그룹 계열의 … 하나를 떠올려 보겠습니다” → “한국 그룹의 대만 주식회사에 이사가 세 명 있다고 해 보겠습니다”, keeping the invented-example label and the Seoul/Singapore/Taipei roles.
- “가장 간단한 길은 화상회의입니다” → the meeting-and-participation condition first; “한도도 있습니다” → the one-principal rule followed by the two-overseas-director problem.
- “요건은 둘입니다 … 전원이라는 말 그대로입니다” → natural sentences explaining why the articles alone and the directors' agreement alone each fail.

## ja

Legal fixes (original → new → source):
- Three FAQ answers named Article 205 without an inline link → each now links the matching paragraph set and keeps the two video conditions, all four proxy conditions, or the full written-vote conditions and public-share exclusion → official Article 205 URL above.
- Unlinked table rows → Article 205 in each row, including the video meeting and video participation, proxy writing and cap, and written-vote consent and exclusion → official Article 205 URL above.
- The final “2人に残るのは … どちらか” → “同条の下では …”, narrowing the choice to Article 205 without asserting unfetched meeting rules → official Article 205 URL above.
- The mixed example now expressly makes the Taipei general manager another director of the same company, as paragraph 1 requires → official Article 205 URL above.

Main voice rewrites (original → new):
- “東京にいる董事が … 台北まで来なければならないのでしょうか” → the concrete video-meeting result, followed by the different conditions for proxy and written voting.
- “定款に定めがあっても、形式の要件が続きます” → “定款に代理の定めがあっても、それだけでは足りません”, then the meeting-specific proxy requirement.
- “要件は二つです … 文字どおりの全員です” → a sentence naming the three directors whose consent is required, followed by what one refusal or a missing articles clause changes.
- “上限もあります” → a sentence about the Taipei general manager receiving only one overseas director's proxy.

## en

Legal fixes (original → new → source):
- FAQ answers' unlinked Article 205 citations → paragraph-specific Article 205 links in every answer, with the video meeting and participation conditions, proxy authorization and cap, and the written-vote consent and public-share exclusion → official Article 205 URL above.
- An English summary saying the routes apply “each … on its own conditions” → a narrower 150–160 character summary that does not assert any route unconditionally; the FAQ gives the complete conditions → official Article 205 URL above.
- Unlinked table rows → an Article 205 link in each row; the full conditions remain in its cells → official Article 205 URL above.
- The final “can either fly … or take part by video” → “under Article 205” and an express video board meeting; the mixed example identifies the Taipei general manager as a director of the company → official Article 205 URL above.
- “the official English translation says ‘public company’” in the operative paragraph → the narrower Chinese statutory category, a company that has publicly issued shares; the English translation remains only a terminology reference in the source list → official Article 205 URL above.

Main voice rewrites (original → new):
- “'Deemed to have attended in person' … is the phrase that matters most” → the practical result when the subsidiary holds a video board meeting and its overseas director joins by video.
- “Article 205 … opens with the rule” → “When the board meets, directors must attend in person,” retaining the articles-based proxy exception.
- “Both conditions are needed … All means all” → the Taipei general manager and both directors abroad must consent; one refusal or a missing articles clause stops the written-vote route.
- “Paragraph 2 contains no requirement” → “A director joining by video does not need a video clause in the articles,” with the link and the meeting conditions nearby.

## zh-hant

Legal fixes (original → new → source):
- The three FAQ answers' unlinked paragraph references → direct Article 205 links in each answer, keeping video meeting plus participation, the full proxy requirements, and the written-vote conditions and publicly issued-share exclusion → official Article 205 URL above.
- Unlinked table rows → Article 205 in every row, with all relevant conditions in the cells → official Article 205 URL above.
- The mixed example now says the Taipei general manager is another director, and the last alternative is phrased as an Article 205 example rather than an exhaustive statement about other law → official Article 205 URL above.
- “公司章程訂明、並經全體董事同意時” → “公司章程訂明這種方式，且全體董事同意後,” with the same meeting's proposals and no actual gathering retained → official Article 205 URL above.

Main voice rewrites (original → new):
- “另外兩條路，都要先翻公司章程 … 三種方式的條件各不相同” → a direct opening about the Tokyo director's video participation and the actual articles-and-consent choices.
- “最簡單的是視訊” → the subsidiary's next video board meeting and the Tokyo director's participation, stated as a normal Taiwanese explanation.
- “第三種方式乾脆不開會” → “至於書面表決，公司可在章程訂明 …”, preserving the difference between no actual gathering and the deemed board meeting.
- “全體就是全體” → “少一人也不行”; “把三種方式依第205條各項並列如下” → a table introduction tied to these three directors.

No unresolved Article 205 issue remains in the fetched text. The actual company's articles, meeting record, and other board provisions would need case-specific review; these drafts do not decide a real resolution's validity. All four variety checks have zero FAIL and all four lint runs print OK. The Korean and Japanese variety checks show only register-ending WARNs; the prose stays in 합니다체 and です・ます体. This is a cross-review readiness opinion, with independent final review still to follow.

VOICE ko: OK
VOICE ja: OK
VOICE en: OK
VOICE zh-hant: OK
