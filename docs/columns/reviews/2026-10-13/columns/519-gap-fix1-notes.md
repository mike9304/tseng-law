# G5 fix1 notes — editor (Claude Opus), 2026-10-12

Slug: taiwan-non-prosecution-reconsideration-private-prosecution. Files edited: drafts/G5/{ko,ja,en,zh-hant}.md, drafts/G5/facts.md, research/G5-statutes.md (Part 4 appended), this file. Nothing else was touched: no repo edits, no git, nothing sent. No judgment is cited, so research/judgments/ is unchanged.

## MUST VERIFY (topics/G5.md)

- MUST VERIFY 1: CONFIRMED — https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=256 and https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=258-1 — the text must say 10 days (十日, not 七日) for reconsideration under Art. 256 ¶1, and 10 days plus a retained lawyer (委任律師) for the motion under Art. 258-1 ¶1. All four versions say so. Both rights are 得 (may); the versions now say "may apply" and keep the lawyer as the required means.
- MUST VERIFY 2: CONFIRMED — https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=I0030013&flno=3 and https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010020&flno=3 — Art. 3 item 3 of both standards: Asia 37 days; Europe, North America, South America, Oceania 44 days; Africa, Antarctica 72 days. All four versions now carry all three rows (ko and ja had no 72-day row; en had no Antarctica).
- MUST VERIFY 3: CONFIRMED, caveat kept as written — https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=66 and https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=55 — neither article nor the two standards says whether the travel days still apply when a Taiwan delivery agent receives service or a Taiwan lawyer files. The four caveat sentences are word for word the drafts' sentences ("확인하지 못했습니다. 10일을 기준으로 움직이는 편이 안전합니다." / 「確認できていません。基準は10日です。」 / "was not confirmed. Plan around ten days." / 「本文沒有查證，安排時仍以十日為準」). Not strengthened, not deleted.

## Final checks

Lint (python3 lint.py <file> <lang> taiwan-non-prosecution-reconsideration-private-prosecution), last run:

- ko: OK — 1,397 characters
- ja: OK — 1,398 characters
- en: OK — 781 words
- zh-hant: OK — 1,351 characters

Variety checker (python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <file>), last run, all "OK — no variety limit violated":

- ko: sentences=34 cv=0.501 short=0.235 run3=0.094 cite_end=0.206 contrast=0 q=1
- ja: sentences=31 cv=0.491 short=0.226 run3=0.034 cite_end=0.29 contrast=0 q=0
- en: sentences=45 cv=0.685 short=0.289 run3=0.0 cite_end=0.222 contrast=1 q=1
- zh-hant: sentences=36 cv=0.611 short=0.25 run3=0.0 cite_end=0.333 contrast=1 q=3

ko and ja sit 2–3 characters under the 1,400 cap. Any later addition to those two has to be paid for with a cut. The reviews/G5/lint-*.txt and variety-*.txt files are pipeline output from before this round and were left as they were.

## How the sources were checked

All on 2026-10-12, against law.moj.gov.tw.

- WebFetch on the single-article pages returned summaries for several articles instead of the full text, so I fetched the official LawAll pages with the lane's fetch-law.py and read the article bodies directly: 刑事訴訟法 30, 55, 65, 66, 252, 253, 253-1, 255, 256, 256-1, 257, 258, 258-1, 258-2, 258-3, 258-4, 319, 321, 323; 民法 120, 121, 122; both travel-period standards in full. Headers: 刑事訴訟法 修正日期 民國 115 年 05 月 13 日, 民法 民國 115 年 08 月 17 日.
- A script compared the sixteen Part 2 articles I re-fetched with research/G5-statutes.md Part 2: identical. 第376條 was not re-fetched; no version cites it any more.
- The two standards' Art. 3 single-article pages were also opened with WebFetch to confirm the URLs the column now links to show the overseas table.
- 沿革 (LawHistory) entries 45, 50, 52, 55 read: promulgation dates in the source lists are right. Entry 50 has no separate effective-date clause.
- The pre-amendment text was read on LawOldVer (version 民國 112 年 05 月 03 日): former Art. 258-1 ¶1 「聲請交付審判」, former Art. 258-3 ¶4 「法院為交付審判之裁定時，視為案件已提起公訴。」
- The official English translation page was read: header "Amended Date：2020-01-15", Articles 258-1 to 258-4 still in the old wording.
- A script checked that every Chinese quotation in facts.md is a substring of the fetched official text (44 quotations, 0 mismatches) and that every Korean sentence quoted in facts.md is in the final ko.md (22 rows, 0 mismatches).

New texts are in research/G5-statutes.md Part 4: Arts. 321, 323 (cited), 55, 256-1, 258-2, 30 (read only), Art. 1 and Art. 3 of both standards, the four history entries, the two old-version articles, and the two stale English articles.

## Grok check — FACTS items

1. 檢察總長 missing in ko/ja/en — fixed. Body and FAQ now name both addressees: 「검찰장이나 검찰총장」, 「検察長か検察総長」 (FAQ 「検察長または検察総長」), "the chief prosecutor of the directly superior prosecutors office or to the Prosecutor General".
2. 72-day row missing — fixed (see MUST VERIFY 2). Hong Kong, Macau and mainland China are not mentioned, so item 2 of Art. 3 is not used. The Korea/Japan sentence in zh-hant is unchanged; en gained "A complainant living in the United States is in the 44-day row" (北美洲 四十四日).
3. en "three forms / lighter offenses / probation period" paragraph — deleted. I chose deletion over the rewrite: the other three languages never had the paragraph, and the consent bar is the only place the column needs Arts. 253 and 253-1, which are now linked there. Arts. 252, 376 and Criminal Code Art. 57 are no longer cited. en keeps one clause that Art. 256 "applies to a deferred prosecution (緩起訴) as well as a non-prosecution".
4. Art. 258-1 is 得, not a duty — fixed in ko body, summary and FAQ (「신청할 수 있습니다」, then 「이번에는 변호사를 위임해 이유서를 내야 합니다」), ja FAQ and body (「申し立てられます」, 「今度は弁護士が必須で、委任して理由書を出します」), zh-hant body (「告訴人得在…聲請准許提起自訴。這一步少不了律師」). en already had it.
5. "From the day of receipt" against the next-day count — fixed. ko summary/FAQ/second period: 「받은 다음 날부터 10일 안에」. ja: 「受け取った翌日から数えて10日以内」, second period 「受け取った翌日から数え」. en FAQ: "counted from the day after…"; body: "a second ten days begins the day after that decision is received". zh-hant FAQ adds 「兩段期間都從收到處分書的次日起算」; body second period 「收到駁回處分書的次日起十日內」. Titles: ko 「받은 날부터 10일」 → 「받은 뒤 10일」; ja 「受け取ってから10日」 → 「受領から10日」 (also shorter, see length). The en title ("Ten Days After…") never said the count starts on receipt and is unchanged.
6. 紀念日 dropped — fixed: 「일요일·기념일 등 휴일」, 「日曜日や記念日などの休日」, "a Sunday, a memorial day or another rest day", 「星期日、紀念日或其他休息日」.
7. Art. 258 as a free choice in ko/en — fixed. Both now split incomplete investigation (personally, another prosecutor, or the original office continues) from complete investigation (order to indict). ja now names the three actors too. The Art. 256-1 branch is not in the column.
8. Art. 258-3 half-stated, three links on one sentence — fixed in all four: the court sits as a panel; dismissal if inadmissible or groundless; a grant sets a period; the defendant may appeal a grant; a dismissal cannot be appealed. Each link sits on its own claim (258-3 on the panel/appeal rules, 319 ¶2 on "through a lawyer", 258-4 on "cannot be privately prosecuted again"). The wider "cannot be challenged" wording (「불복할 수 없습니다」, 「不服を申し立てられません」) is now the statute's remedy only (항고 / 抗告).
9. Art. 258-1 ¶2 bar — added in all four, with the two exceptions and links to Arts. 321 and 323, and an explicit pointer to the second paragraph. Nothing tells the reader that an investigation under way or a spouse/ascendant defendant blocks the motion.
10. Art. 256 ¶3 ex officio reconsideration — added in all four, limited to the two situations in the paragraph. Not added: that the informant is notified in that case. It does not change what the informant can do, and ko/ja have no room.
11. Art. 257 skipped; facts.md "may" — added in all four with the statute's strength (must revoke and continue or indict; must send the file up at once; a late request is dismissed). facts.md G5-09 now quotes ¶1–¶3 and records that the old "may revoke" was wrong. ¶4 (the chief prosecutor of the original office may reinvestigate or review before the file goes up) is recorded in facts.md and not stated in the body: ko and ja are at the cap, and I kept the four versions on the same legal core. ¶3 does not name who dismisses, so the sentence is passive in every language.
12. 抄錄、重製、攝影 and 限制或禁止 — restored: 「열람·필사·복제·촬영」 and 「제한·금지될 수 있습니다」; "inspect… transcribe, reproduce or photograph… may be restricted or prohibited"; 「可能被限制或禁止」. ja keeps all four acts and both verbs in a shorter form (「閲覧・筆写・複製・撮影」, 「制限・禁止があり得ます」).
13. ja はずです — fixed: 「期間と申立先は、処分書の正本に書かれていなければなりません」.
14. zh-hant title 寄到 — fixed: 「收到不起訴處分書後的十日：…」.
15. Art. 255 ¶2 link for service on the informant — added next to the service claim in all four and to every source list.

Grok's "Kept" list: nothing there was changed in substance. The zh-hant internal link to column 236 stays zh-hant only.

## Grok check — VOICE items

- ko 緩起訴 unglossed — fixed with the reviewer's wording plus article links: 「직권 불기소(제253조)나 기소유예 처분(緩起訴, 제253조의1)에 동의한 고소인도 신청하지 못합니다」. FAQ: 「기소유예 처분(緩起訴)」. 기소유예 matches sister column G6.
- ko 「이 10일에 할 수 있는 일이 재의(再議)입니다」 — replaced with the reviewer's sentence, 「이 10일에 내는 서류가 재의(再議)입니다」.
- ja opening — the reviewer's first sentence is now the opening (「不起訴処分書を受け取った告訴人の期限は、10日です。」). Not taken from the suggestion: 「短い期限です。」. Deleting it loses no fact, and ja is at the cap. The 應記載 sentence is the reviewer's, shortened; the two addressees are named in the sentence before it.
- ja 緩起訴 — glossed with the reviewer's words (「起訴を一定期間猶予する処分」). The sentence ends 「…に同意した告訴人も同じです」 instead of 「も、再議はできません」; same meaning, seven characters fewer.
- en "What can be done in those ten days is called…" — replaced with the reviewer's sentence, "Those ten days are for reconsideration (再議)."
- en "Older English sources may call the court step 'referral to trial'" — rewritten, but not with the suggested "sometimes rendered 'referral to trial'". That phrase is still a claim about other people's writing that I could not source. The paragraph now states what I could open: as of October 2026 the English translation on the Ministry of Justice database still calls the step "setting the case for trial" (URL and date in the text and source list). The date, the deemed-indictment point and the current rule are kept.
- zh-hant — no voice rewrite, as the reviewer asked. Only the fact fixes above, one new reader question (「哪些人不能聲請？」), and 「網路上舊文章常說的」 → 「舊資料上的」 (see removed facts).

Two terminology changes in ja that no reviewer asked for, both to match the published ja column 403 and sister column G6: 検察庁 → 検察署 (the characters on the document the reader holds), and 却下 → 退ける/退けられる. 駁回 covers both 却下 and 棄却 in Japanese terms, and one neutral verb avoids labelling the wrong one.

## Best-of-2 judge notes (ko)

The verdict was a tie; I kept drafts/G5/ko.md (version Y) as the base and did not use drafts/G5/alt/ko.md. The gaps the judge listed for both versions are closed: Art. 257 is in, the Art. 258 split is in, the defendant's appeal against a grant is in, and Arts. 258-3, 258-4 and 319 each sit on their own claim. The 72-day row is in. Not added: a link to Civil Code Art. 121. The column makes no claim that needs it (it says which day is not counted and what happens when the last day is a rest day; Arts. 120 and 122). Version X's three question-and-answer pairs were not adopted; the judge read them as a template.

## Lint, variety, ingest

- Lint was OK before and is OK now. The work in this round was fitting the fact additions under the cap: ko went 959 → 1,397, ja 1,155 → 1,398, zh-hant 909 → 1,351, en 524 → 781.
- Variety: no FAIL before, none now. Citations now sit in four positions (statute as subject, 「제257조에 따라」, mid-sentence, closing parenthesis). The one checker WARN during editing (ko, 78% of sentences ending in 니다) is gone; one sentence ends 「아니지요」, an ending the variety rule lists for 합니다체.
- ja has no question in the body (q=0). The cap left no room, and Grok raised no monotony item. ko has one question, en one, zh-hant two (the third the checker counts is the title of the linked column).
- INGEST.md left nothing mechanical open. Frontmatter: published, lastmod and date_display now read 2026-10-12 to match the check date (integration resets them at ship). en read_time is 4 min for 781 words. topic and featured_image are unchanged. en summary is 159 characters; seoTitle lengths are ko 26, ja 20, zh-hant 16, en 42.

## Other changes

- Travel standards now link to the single-article pages (LawSingle …flno=3) instead of the whole-law pages.
- The old text of Art. 258-3 is linked inline (LawOldVer) and listed in the sources; the amendment date links to 沿革.
- en and zh-hant link once to published column 403 (taiwan-non-prosecution-reconsideration-deadline) for when a decision counts as received. The sentence makes no legal claim of its own. ko and ja have no room for it.
- Source-check date is 2026-10-12 in all four sources sections and closing lines.

## Facts removed as unverifiable or unsupported

- en: "The decision can take three forms…", "lighter offenses", "probation period of one to three years" — removed (FACTS item 3).
- en: that older English sources call the step "referral to trial" — removed; no official source uses that rendering.
- zh-hant: that online articles "often" say 聲請交付審判 — the frequency claim is gone.
- ja: 「裁判の結論はその先で決まります」 and 「短い期限です。」 — no legal content; cut for length.
- All four: the general "cannot be challenged" wording about a dismissal — narrowed to "no appeal (抗告)", which is all Art. 258-3 ¶5 says.

## For the final reviewer

- "An order to indict is not a conviction" and "a lawyer is not required for reconsideration" are readings of Arts. 258 and 256, not quoted rules. facts.md marks them that way (G5-11, G5-04).
- "10 days plus the travel days" (「10일에 그만큼이 더해집니다」, 「十日再加37日」) restates Art. 66's deduction as arithmetic. It was in the drafts and Grok kept it; the statute's own verb is 扣除.
- Scratch copies of the fetched pages are in /tmp (g5-live-*.md, g5-history.*, g5-oldver*.html, g5-eng.html). They are outside the work tree and can be deleted.
