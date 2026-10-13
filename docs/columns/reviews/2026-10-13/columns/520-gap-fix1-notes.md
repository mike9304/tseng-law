# G6 fix 1 — Opus editor notes (2026-10-12)

Slug `taiwan-deferred-prosecution-conditions-complainant`. Files edited: `drafts/G6/{ko,ja,en,zh-hant}.md`, `drafts/G6/facts.md`, `research/G6-statutes.md` (Part 4 appended). Nothing else was touched; no git, no repo edits, nothing sent.

How the statutes were checked: every article was opened on law.moj.gov.tw on 2026-10-12. WebFetch returned summaries instead of verbatim text for the longer articles, so the verbatim text was read straight from the same single-article URLs (page footer 法規整編資料截止日：民國 115 年 10 月 02 日). 刑事訴訟法 header: 修正日期 民國 115 年 05 月 13 日; LawHistory entry 55 amends 第 101-1 條 only. Articles opened: 刑事訴訟法 65, 253-1, 253-2, 253-3, 255, 256, 256-1, 258-1, 258-3, 260, 319, 320, 323, 420; 民法 120, 122. The seven articles already in `research/G6-statutes.md` Part 2 match the live text.

## MUST VERIFY

MUST VERIFY 1: CONFIRMED — https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=253-2 — Paragraph 2 is a single paragraph: 「檢察官命被告遵守或履行前項第三款至第六款之事項，應得被告之同意；第三款、第四款並得為民事強制執行名義。」 The text must say that items 3 to 6 (victim compensation, treasury payment, community service, treatment) need the defendant's consent, and that items 3 and 4 may (得) serve as a civil enforcement title. All four versions say this. en no longer says "through a civil enforcement order".

MUST VERIFY 2: CONFIRMED — https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=253-3 — Paragraph 1 lists exactly three grounds and its chapeau reads 「檢察官得依職權或依告訴人之聲請撤銷原處分，繼續偵查或起訴」. Item 2 is 「緩起訴前，因故意犯他罪，而在緩起訴期間內受有期徒刑以上刑之宣告者」. The text must say: another offence committed intentionally before the deferral, with a sentence of imprisonment or heavier pronounced during the deferral period; and revocation on the prosecutor's own motion or on the complainant's application. All four versions say this, with "during the period" stated on ground 2 itself. Ground 1 now says the prosecutor has filed an indictment (提起公訴). No wording had to be removed under either item.

## Grok FACTS items

1. Start of the period — added in all four bodies and in the ko/ja/zh-hant summaries: the period runs from the day the disposition becomes final (其期間自緩起訴處分確定之日起算). The en summary does not state the period, so nothing was added there.
2. Counting the ten days — added in all four: the day of receipt is not counted, the count starts the next day, and a last day that is a Sunday, memorial day or other rest day moves to the next day (刑事訴訟法 65, 民法 120 II, 122, all linked and added to the sources list). The defendant's ten days under Art. 256-1 are described as "the same way/route". Art. 66 was not added, as Grok advised.
3. Written petition and route — added in all four: a written statement of reasons, filed through the original prosecutor, to the chief prosecutor of the immediately superior office or the Prosecutor General. Art. 256 para. 2 (period and addressee must be stated on the copy served on the complainant) is now in ko and ja too. en's consent bar is limited to the complainant.
4. Art. 256 para. 3 — added in all four as the statute words it: where nobody is entitled to seek reconsideration, the original prosecutor must send the case up ex officio. The text does not say that a consenting complainant's case falls under it; the article does not say so and I could not verify it.
5. 返還或賠償 — restored in all four (no claim for return and no claim for compensation).
6. en "probation period" / "stays closed" — replaced by "deferral period"; "stays closed" deleted. The Art. 260 effect is in the last section.
7. en civil enforcement — body and FAQ now say "may (also/each) serve as a civil enforcement title".
8. ko 공고 — now 국고(公庫) in summary, FAQ and body.
9. ko 의무 노역 — now 「검찰서가 지정한 기관·단체 등에서 하는 40시간 이상 240시간 이하의 의무노무(義務勞務)」. Grok's wording said "검사가 지정한"; the statute says 該管檢察署指定, so the text says 검찰서. ja now adds 「検察署が指定する機関・団体などでの」.
10. ja 治療の受講 — now 「依存症や精神・心理の治療・カウンセリングなどの処遇の完了」. Grok's sample used 戒癮, which is not a Japanese word; 依存症 is the Japanese rendering. Completion (完成) is kept.
11. Art. 260 — both grounds are now named in all four, plus the para. 2 definition in one clause. Art. 420 was opened and its text saved to `research/G6-statutes.md`; the column cites it by article, paragraph and item number only and does not describe the four items.
12. Art. 255 para. 2 — agencies, groups and communities added in all four.
13. Art. 253-1 para. 4 — one short paragraph added in all four: once a prosecutor has started investigating, 自訴 of the same case is barred (Art. 323 para. 1), and the proviso's exceptions do not apply during the deferral period. ko/ja/en add a one-clause description of 自訴 with Art. 319. The two routes are kept; they now sit in the section heading.
14. 提起公訴 — ground 1 now says the prosecutor filed the indictment (ko 검사가 공소를 제기한, ja 検察官に公訴を提起された, en a prosecutor files an indictment, zh 經檢察官提起公訴). 繼續偵查或起訴 is left as the statute has it.

## Grok VOICE items

ko
- Three paragraphs opening on 緩起訴 — fixed. Paragraph openers are now all different.
- 「이름은 불기소와 닮았지만 성격이 다른 처분입니다」 — deleted, no replacement contrast.
- 追訴權 시효 → 공소시효(追訴權 시효). 悔過書 → 반성문(悔過書). 공고 → 국고(公庫). 노역 → 의무노무(義務勞務).
- 「판결은 아닙니다.」 — Grok suggested keeping this as a reworded short sentence. I removed it instead in all four languages: no cited article says it, and it denies something the reader did not claim. Short sentences are supplied elsewhere (「기간은 처분 확정일부터 셉니다.」 「하나는 재의(再議)입니다.」).
- 「조문에는 취소 신청의 기한이 적혀 있지 않습니다.」 kept as written.

ja
- 追訴権 → 「公訴時効（条文では追訴権の時効）」.
- 治療の受講 → see FACTS 10.
- Contact sentence reworded so that it is not the same sentence as published column 259.

en — Grok: OK. Only the fact fixes were made, plus the added facts. Three paragraphs would have opened with "The" after the additions, so two were recast ("Revocation is the other door.", "Defendants have a remedy too.").

zh-hant
- 「名稱和不起訴相近，性質不同。」 — deleted.
- 「第一條／第二條」 — now 「一是再議。」 and 「二是聲請撤銷。」, each followed by shorter sentences; the three grounds sit in one sentence and the effect, 返還或賠償 and the missing deadline in three more.
- 「本文沒有查證」 — Grok proposed 「這次沒有查到」. I used a statement limited to the cited articles instead (「上面引用的條文沒有規定要通知告訴人」), which a reader can check and which does not describe the writing process. The same change was made in ko, ja and en.
- The opening no longer mirrors the Korean opening sentence.

## bestof-judge notes (ko)
- No inline 253-2 reference on the eight-item paragraph — the paragraph now ends with (제253조의2); the link is in the first paragraph.
- Vague second sentence — deleted (see above).
- Neither version stated the start of the period — added.
- 「수 있습니다」 eight times — now five in the body (명할/기소할/신청할 수 있습니다, 될 수 있습니다 twice).

## INGEST.md / frontmatter
- Titles: ko is now 「대만 기소유예(緩起訴)의 조건과 고소인의 재의·취소 신청」 and ja 「台湾の緩起訴の条件と、告訴人の再議・取消しの申立て」. The ko title and body use 기소유예(緩起訴) because a bare 緩起訴 is hard for Korean readers to read or search; published ko column 029 already renders 緩起訴 this way. This is my editorial call, not a reviewer item — the final reviewer may prefer the original title.
- seoTitle: ko 27, ja 19, zh-hant 18 characters; en 44 characters (required because the title is long). en summary 154 characters.
- read_time raised to match the longer body (ko 3분, ja 約3分, en 4 min, zh-hant 約3分鐘).
- published / lastmod / date_display left at the ingest values; the brief says integration sets them.
- One FAQ item per language, consistent with the body. topic and featured_image unchanged.
- Sources section last, check date 2026-10-12, one general-information line at the end. No bold, emoji, phone number, address or review claim.
- Two fact-stating `##` headings were added per language (the drafts had none before the sources section).
- No internal links. The closest column (403, non-prosecution reconsideration) is on origin/main but not in the lane worktree that lint checks, and G5 is unpublished.

## Other corrections made without a reviewer asking
- 「그 기간 동안 검사는 … 명할 수 있습니다」 / "During that period the prosecutor may order" (all four) — the order is made with the disposition and sets its own time, which may not exceed the deferral period (Art. 253-2 paras. 1 and 4). Reworded.
- ja 無期懲役 / 懲役以上 → 無期徒刑 / 有期徒刑以上の刑 (the statute's terms; 懲役 is no longer the Japanese term either). ko 징역형 이상 → 유기징역 이상의 형.
- en and zh-hant: "a victim who never filed a complaint may receive it" now says the victim connected with the conditions (Art. 255 para. 2).
- The contact sentence in all four is tied to this column (the noted conditions, time allowed and receipt date), since the draft sentence was identical to published column 259.

## Removed as unverifiable or unsupported
- 「이름은 불기소와 닮았지만 성격이 다른 처분입니다」 / 「名稱和不起訴相近，性質不同。」
- 「緩起訴는 판결이 아닙니다」 / 「緩起訴は判決ではありません」 / "A deferred prosecution is not a judgment." / 「緩起訴不是判決。」
- en "the case stays closed only if the period ends without revocation".
- 「…확인하지 못했습니다」 / 「確認できていません」 / "was not confirmed" / 「本文沒有查證」 — replaced by the bounded statement above. Whether another statute or administrative rule provides such notice was not checked and is not claimed.
- Cut for length, though true: en "the same 10-day application used after an ordinary non-prosecution".

## Final check output (2026-10-12)
- lint: ko OK (1398), ja OK (1398), en OK (759 words), zh-hant OK (1289).
- variety_metrics: all four "OK — no variety limit violated" (ko cv 0.557 short 0.133 contrast 0; ja cv 0.599 short 0.097; en cv 0.764 short 0.216; zh-hant cv 0.855 short 0.167).
- Self-check 2–9: no stock hypothetical opener (ko result-first, ja number, en question, zh-hant fact from the document); at least two very short sentences in each; no word opens three paragraphs; no claim-statute-caveat run and the last paragraph carries no citation; contrast templates 0; the last paragraph ends on the conditions, the time allowed and the receipt date; ko 합니다체 and ja です・ます throughout (ja has two 体言止め: 「1年以上3年以下。」 「1つは再議。」); no statute number, deadline or link was dropped.

## Limits
- ko and ja sit at 1,398 characters against the 1,400 cap, because the fourteen fact items all had to fit. Any later addition needs a matching cut.
- No judgment is cited, so nothing was saved under `research/judgments/`.
- Native-voice judgment here is a model's reading, not a native speaker's or a lawyer's review.
