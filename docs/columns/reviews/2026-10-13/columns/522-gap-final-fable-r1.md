# G8 final review r1 — Claude Fable 5.1 — taiwan-complaint-only-offense-settlement-withdrawal-deadline

Date: 2026-10-12 (Asia/Seoul). Reviewer: Claude Fable 5.1, a model. No lawyer or native-speaker review is claimed.

## Verdict

PASS — all four languages (ko, ja, en, zh-hant) publishable as they stand after one minor ja wording edit. Image OK.

## Scope checked

- Read in full: brief-BATCH.md, brief-EDITORIAL-VOICE.md, COLUMN-VOICE-RULE.md, THREADS-VIRAL-BRIEF-20261005.md, SENTENCE-VARIETY-RULE.md, LESSONS.md, topics/G8.md, drafts/G8/{ko,ja,en,zh-hant}.md, drafts/G8/facts.md, research/G8-statutes.md, reviews/G8/check-grok.md, reviews/G8/fix1-notes.md, images/G8.webp.
- No judgment is cited in any version; research/judgments/ is empty for G8 (nothing to check).
- Every cited article was re-opened on law.moj.gov.tw on 2026-10-12 (single-article pages): 刑法 277, 281, 284, 287; 刑事訴訟法 232, 233, 236-1, 237, 238, 239, 242, 252, 303; 鄉鎮市調解條例 1, 26, 27, 28, 31, 35; the three 沿革 pages; the English edition of I0020003 (title and Art. 26/28 wording). All texts match research/G8-statutes.md character for character. Database cutoff shown on the pages: 法規整編資料截止日 民國115年10月02日.
- Lint: ko OK (1388), ja OK (1398 after my edit), en OK (789 words), zh-hant OK (1350).
- variety_metrics.py check: OK, no FAIL, no WARN, in all four (ko cv 0.545 short 0.094 contrast 1 q 2; ja cv 0.545 short 0.133 contrast 1; en cv 0.603 short 0.227 contrast 0 q 2; zh-hant cv 0.696 short 0.222 contrast 0 caveat 1 q 3).
- Internal link /<lang>/columns/taiwan-criminal-settlement-withdraw-complaint: column 402 exists in ko, ja, en, zh-hant in the worktree; the zh-hant link text 〈和解金還沒付，可以先撤回刑事告訴嗎？〉 is that column's exact title.
- Format scan: no bold (**, __, <b>, <strong>), no emoji, no phone number, no street address, one email-only contact sentence per language, author legal-ai-assistant, no lawyer-review or native-review claim, no private-party name, no case story, no hypothetical at all (so no label needed), no statistics.

## MUST VERIFY

MUST VERIFY 1: CONFIRMED — https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0000001&flno=287 — 「第二百七十七條第一項、第二百八十一條及第二百八十四條之罪，須告訴乃論。但公務員於執行職務時，犯第二百七十七條第一項之罪者，不在此限。」 The text must list Art. 277 para. 1, Art. 281 and Art. 284 as complaint-only and limit the public-official proviso to Art. 277 para. 1. ko line 28, ja line 28, en line 28, zh-hant line 28 each name the three articles, say the column covers 277(1) and 284 only, and tie the single exception to a public official's 277(1) offence while on duty. All four add that 277(2) (death or serious injury) is outside the list and that negligent serious injury stays inside Art. 284 (checked against 277 and 284 texts). FAQ 2 in each language repeats this correctly.

MUST VERIFY 2: CONFIRMED — https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=I0020003&flno=28 — para. 2: 「告訴乃論之刑事事件於偵查中或第一審法院辯論終結前，調解成立，並於調解書上記載當事人同意撤回意旨，經法院核定者，視為於調解成立時撤回告訴或自訴。」 The text must require all four: complaint-only criminal matter; mediation during the investigation or before oral argument closes in the court of first instance; the 調解書 records consent to withdraw; court approval. ko line 46, ja line 46, en line 48, zh-hant line 46 list the four as four and give the effect (complaint or private prosecution deemed withdrawn at the time mediation succeeded). Summaries and FAQ 1 in all four carry the same conditions.

MUST VERIFY 3: CONFIRMED — https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=I0020003&flno=31 — 「告訴乃論之刑事事件由有告訴權之人聲請調解者，經調解不成立時，鄉、鎮、市公所依其向調解委員會提出之聲請，將調解事件移請該管檢察官偵查，並視為於聲請調解時已經告訴。」 The text must keep the sequence: complaint-only matter, the person entitled to complain applied, mediation failed, the office refers the matter to the competent prosecutor on that application, and only then is the complaint deemed made at the time of application. ko line 52, ja line 52, en line 54, zh-hant line 52 state the whole sequence in one sentence. The earlier wrong claim that the six-month period "moves" to the application date is gone from all four; the replacement sentence says only that the Art. 237 six-month test is applied to that deemed filing date, which follows from the two texts and does not shift the start point (知悉犯人之時).

## Law and facts, by language (all checked against the official pages)

ko: 287 list and proviso; 277(2) outside, 284 serious injury inside; 237 paras. 1–2 with 고소권자 as subject; 232; 233(1); 236-1 (위임장 to prosecutor or judicial police officer, 本人到場); 242(2) actors, "all or part", victim or other entitled person, when appearing to state, recorded; 238 paras. 1–2 (only the person who withdrew is barred); 239; 252 item 5 and 303 item 3 as the investigation/trial split with 不受理; 28(2) four conditions; 35(2); 27 paras. 1–2 (起訴、告訴或自訴; 金錢、代替物、有價證券 enforcement title); 31; amendment dates 2026-05-13 (Art. 101-1), 2026-07-22 (Art. 80), 2023-01-13 (Arts. 3, 6, 9, 32) match the 沿革 pages. No error found.

ja: same claims, same results. 不受理判決 used (not 公訴棄却). 第27条第1項 and 第2項 cited separately and correctly. No error found.

en: same claims plus Art. 281 described from its text ("violence against a lineal blood ascendant that causes no injury" = 施強暴於直系血親尊親屬，未成傷) and Art. 26 para. 1 (ten days, 調解書及卷證, 移付或管轄之法院). "Judgment that the case is not entertained (不受理)" matches the official English edition of Art. 303. Official act title "The Township and County-Administered City Mediation Act" matches the English edition. No error found.

zh-hant: same claims plus Art. 26 paras. 1 and 3 (ten days; non-approval grounds 牴觸法令、違背公共秩序或善良風俗或不能強制執行 and notice of reasons to the 公所). All statutory wording (得/應/須, 不受理判決, 執行名義, 核定) is the statute's own. No error found.

Cross-language: the four versions agree on every article number, deadline, condition and effect. Differences are omissions only (ko/ja do not carry Art. 26; ko/ja name Art. 281 by number only), not contradictions.

Arithmetic: none beyond "six months" and "ten days", both as in the statutes.

## Citations

- Every legal claim has an inline link immediately after it to the correct single-article URL (pcode and flno checked for all 19 articles in all four files).
- Sources sections are the last ## heading in each file, list every article used, include the three 沿革 pages (en also the English edition), and carry the check date in the page's date format (확인일: 2026년 10월 12일 / 確認日：2026年10月12日 / Checked: October 12, 2026 / 查核日期：2026年10月12日).
- ko and ja list Art. 1 in the sources without an inline link; it supports the phrase 향·진·시 조정위원회 / 郷・鎮・市の調解委員会. Acceptable.
- Time markers: 2026년 10월 현재 / 2026年10月時点 / as of October 2026 / 2026年10月的現行條文 present in body and FAQ 1 of each language.

## Rules

Hard rules 1–12 of brief-BATCH.md hold in all four. Frontmatter: exact keys; ko/ja/zh-hant seoTitle 18/17/16 chars and different from the title; en title + " | Hovering Law" = 88 chars so seoTitle required, present (37 chars, different from title); en summary 160 characters, no forbidden characters, no ellipsis; two FAQ items per language, each consistent with the body and the statute texts; audience = own language; author legal-ai-assistant; featured_image keeps the literal NNN; topic "litigation" as in topics/G8.md; published/lastmod 2026-10-12 with matching date_display.

## Voice, by language

ko: Calm 합니다체 throughout, two real reader questions (언제부터 셀까요? / 조정이 결렬되면 어떻게 될까요?), short sentences present, no generic intro, headings state the finding (취하는 1심 변론 종결 전까지 / 조정위원회에서 합의했다면). Title is a specific question-form noun phrase, not a catalog or imperative. Reads as Korean, not translated. Deletion test on the first paragraph: each of the three sentences carries something the others do not (two different acts / no article found / which act the Code attaches effects to, with the date).

ja: です・ます throughout, no だ・である. Headings 親告罪となる傷害 / 取下げの期限 / 調解が成立した場合. 「取下げの期限」 is a plain label rather than a stated fact; I left it because the ja body sits at 1,398 of 1,400 characters and the title already asks the same question. Not a defect. 調解 kept as the Taiwanese term with 調停 glossed once in the summary.

en: Plain, active English; no "it is important to note", no "navigate". Sentence openers varied (The ×2, A ×1, Who, Sometimes, In, After, Four, What). Headings are findings or questions specific to the column. Title is a direct question.

zh-hant: Taiwan Mandarin throughout (公所, 檢察官, 司法警察官, 地方 usage 法院核定, 和解書, 撤回告訴). No simplified characters, no mainland terms, no 官腔 beyond statutory 應/得. Opening 「還不一定。」 answers the title question at once. Three reader questions in the body.

## Sentence variety (SENTENCE-VARIETY-RULE sections 5–6)

Checker: 0 FAIL in all four (output above). Self-check: (2) no stock hypothetical opener — the column contains no hypothetical at all; opening type is a direct statement of the settlement/withdrawal split (zh-hant: an answer to the title question), which fix1-notes shows does not repeat the other G-batch openings. (3) very short sentences: ko 「고소 기간은 6개월입니다.」「언제부터 셀까요?」; ja 「告訴期間は6か月です。」; en "What if mediation fails?" "The complaint period is six months."; zh-hant 「還不一定。」「告訴期間是六個月。」「調解沒成立呢？」. (4) no word opens three paragraphs in any language (ko 합의/고소 twice each; en The twice). (5) checker caveat run 0 (zh-hant 1); the opening and contact paragraphs have no citation. (6) contrast templates ≤1 per language; none rebuts a claim the reader did not make. (7) last body paragraph names this column's own facts (settlement date, withdrawal wording in the 調解書, court approval) with the email, no copied disclaimer or sales line. (8) ko 합니다체 / ja です・ます consistent. No MONOTONY item.

## Issues

1. ja line 34 (minor, applied) — Original: 「委任状を検察官か司法警察官に提出し、両者は必要と認めれば本人に出頭を命じることができます」 → problem: 「両者」 after two alternatives joined by か can be read as "both parties" (agent and principal) instead of the prosecutor or judicial police officer who received the authorization; the statute's subject is 檢察官或司法警察官 → fix applied: 「…提出し、提出先は必要と認めれば本人に出頭を命じることができます」 → facts preserved: same actors (the office the authorization was filed with), same 得命本人到場, same Art. 236-1 link; ja length 1398, lint OK, variety OK.

No major issue. No fact, number, citation, condition or legal meaning was changed.

## Minor edits applied

- drafts/G8/ja.md line 34: 「両者は」 → 「提出先は」 (see issue 1). Re-ran lint (OK, 1398) and variety_metrics.py (OK).

## Image

images/G8.webp: a white ceramic pitcher and a sprig of green leaves on a bare wooden table, soft window light, curtain at the right. No faces, no text, no logos, no flags, no readable documents or screens, no identifiable place or person; nothing that depicts or recreates a real case; respectful and calm, consistent with the column's "settle and then withdraw" subject. Generic and fictional. Image verdict: OK.

## Limits

- Statutes only; no judgment was consulted, so nothing in the column or this review speaks to how courts fix 「知悉犯人之時」 or apply Art. 31 in practice. The column makes no such claim.
- Naturalness in all four languages was judged by a model, not a native speaker.

VERDICT: PASS
