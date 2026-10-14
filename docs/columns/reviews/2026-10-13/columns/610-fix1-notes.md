# C2 fix1 notes

Voice source: `reviews/C2/voice-sol.md`. Statute check: `research/C2-statutes.md` (Company Act text on law.moj.gov.tw, checked 2026-10-13). Frontmatter keys, slug, and `featured_image` are unchanged. No bold, no phone, no street address. Contact remains wei@hoveringlaw.com.tw.

Lint (`lint.py … <lang> taiwan-subsidiary-annual-shareholders-meeting-director-term`): ko OK 3498/3500, ja OK 3918/4500, en OK 1598/1600, zh-hant OK 2700/2700.

Variety (`variety_metrics.py check <file> --lang <lang>`): all four `OK — no variety limit violated`. ko cv=0.453 short=0.117; ja cv=0.462 short=0.202; en cv=0.711 short=0.434; zh-hant cv=0.475 short=0.170. Contrast 0, caveat 0. Paragraph openers of the same word are at most 2 in each language. No stock hypothetical opener. Labels kept: 가상의 사례입니다, 架空の設例です, This is a hypothetical, 這是設例.

## ko

- “승인하는 자리는 회사 형태가 정합니다.” → “누가 결산을 승인하는지는 회사 형태에 따라 달라집니다.”
- “한 달은 보낸 뒤부터입니다.” → “이의 제기 기간 한 달은 결산 서류를 보낸 날부터 셉니다.”
- “날짜가 있어야 합니다.” → “이사회 결의에는 날짜를 남깁니다.” The date still belongs to the board resolution. 남겨야 합니다 would add two counted characters (3498/3500) and turn a short sentence into a longer one on a cv of 0.453. 합니다체 kept.
- “제20조는 남습니다.” → “제20조는 그대로 적용됩니다.” Not narrowed to 결산 승인, and not opened with 다만. Article 20 as a whole still applies to a one-shareholder company, including the CPA audit in paragraph 2 and the fine in paragraph 5. Narrowing it to the approval rule would drop those.
- Six-month AGM paragraph merged and the empty “기한은 6개월입니다.” removed. Frequency, six months, good-cause approval, and the Article 170 paragraphs 1–2 link stay.
- Duplicate “목록에 없습니다.” removed. Now: “[제108조] 제4항의 유한회사 이사 준용 조문에는 제195조가 없습니다.”
- “본사 일정표가 타이중의 빈 해를 채우지는 않습니다.” → “본사 총회 일정만으로 타이중의 설립 후 의사록 공백은 메워지지 않습니다.”
- Last sentence → “그 전까지는 회사 형태에 맞게 결산을 승인하고, 날짜가 적힌 의사록을 남깁니다.” Same timing, form, and dated minutes. 남겨야 was not used, for the same length reason as the board-resolution sentence.
- Length: the example no longer repeats “두 명이면 이사회 규정을 준용합니다.” The two-director analogy remains under Article 128-1 and Article 192. The example still has two directors, no minutes after incorporation, and both article links.
- cv: the Article 172 notice list now says the notice goes to each shareholder (각 주주에게 보내는), which matches 各股東. The parenthetical 法定盈餘公積 after 법정잉여적립금 was removed. The Korean term and the Article 237 link remain.

## ja

- Title and H1 → “株主が一人の台湾子会社、決算を誰が承認し、董事の任期はいつ終わるか”. seoTitle unchanged.
- Opening memo → “董事の任期が三年を過ぎれば翌日から退任扱いになる、と駐在員向けの人事メモに書かれている場合があります。” Then the statute point: automatic discharge is not the next day; it is when the authority’s deadline ends. 場合があります marks the memo as something that may be written, not a real record. 架空の設例です stays on the Tainan example.
- “承認する席は、会社の形が決めます。” → “決算を承認する機関は、会社の形態によって異なります。”
- “線引きの金額は…にあります” → “査核を要する金額の基準は[会計師の査核と記帳]にまとまっています（第20条第2項）.” ご覧ください was not used. It reads as an instruction to click. A later variety pass moved 基準 off the sentence start because the previous sentence already starts with 基準以上. The threshold, the link, and paragraph 2 stay.
- Date, not in the ja list: “その決議には日付を残します.” Same fact as the Korean board-resolution sentence, so the date is not a subjectless fragment.
- “一か月は、送ったあとからです。” → “異議を述べる期間の一か月は、決算書類を送った日から数えます.” The previous sentence already states the Article 110 paragraph 2 rule.
- “第20条は残ります。” → “第20条の規定は引き続き適用されます.” Not the narrower “決算承認に関する規定”, and not opened with ただし. Same whole-article reason as Korean.
- Duplicate “一覧にありません。” removed. Now the Article 108 paragraph 4 list does not include Article 195.
- “記載、二十日以内の分発…” → “この準用により、議事録の記載、二十日以内の配布、会社存続中の保存に関する規定が適用されます.” “誰に渡すかまでは書いてありません.” kept. Article 183 names 各株主 for a shareholders’ meeting and does not name the board-copy recipient.
- “本社の年間予定が、台南の空白の年を埋めるわけではありません。” → “本社の年間予定だけでは、台南の子会社に残る設立後の議事録の空白は埋まりません.”
- “期限は六か月です.” left. The ja review did not flag it. The example is one director, so the two-director analogy was not repeated there. It remains under Article 128-1 and Article 192.
- Variety, after the voice edits: three paragraph openers were 株主, and three sentence pairs started with the same two characters (基準, 通知, 有限). “有限公司の条文に、株主会を招集する規定はありません” is now “条文には、有限公司の株主会を招集する規定はありません.” The notice-list sentence now starts “主な内容を通知に書く事項は” with the same list. “有限公司の負責人にも” in the reserve paragraph is now “その負責人にも”, the antecedent being the limited company in the previous sentence. 董事 and 有限 each open two paragraphs, not three or four.

## en

- “The next morning does not clear the office. Form decides who approves the accounts.” → “A director whose three-year term has ended does not leave office the next day. The company's legal form determines who approves its accounts.” The “Three years.” opening stays.
- “Breaking paragraph 1 or paragraph 2 draws a fine…” was not changed to “can result”. Article 20 paragraph 5 is 各處, a fine on each responsible person, not a discretionary “can”. Current: “Each responsible person who violates paragraph 1 or paragraph 2 is fined.” The range and the 13 October 2026 check stay.
- Threshold fragment → “The threshold figures are set out in [CPA audits and tax certification] (Article 20, paragraph 2).”
- “Two directors bring the board rules in by analogy.” → “If the company has two directors, the board provisions apply by analogy.” under Article 128-1. The Article 192 sentence and the Hsinchu example now use “With two directors, the board rules apply by analogy.” Same condition and analogy, same word count in the example (1598/1600).
- The two-director foreign-parent sentence and “A date has to be on it.” are one sentence: “If a foreign parent is the sole shareholder and the company has two directors, each year's approval is a dated resolution of that board.” “Article 20 remains.” → “Article 20 still applies.” Not narrowed to the approval paragraph.
- Article 110 paragraph 2 is one sentence: send within six months; no objection within one month after sending; deemed approved. The follow-up “The month starts…” was dropped because the start is inside that sentence.
- “Convening sits with the board…” → “The board calls the meeting unless the Act provides otherwise ([Article 171]).”
- The AGM paragraph, including “Six months is the window.”, → “The company must hold an annual meeting at least once each year, within six months after the fiscal year ends. It may hold the meeting later for good cause if the authority approves ([Article 170], paragraphs 1 and 2).”
- “The list omits it.” removed. “Article 195 is not on that list.”
- “A parent's calendar does not fill an empty year in Hsinchu.” → “The parent's meeting calendar does not supply the Hsinchu company's missing minutes.” Not “for that year”: the example gap runs from incorporation in 2017, not one year. The foreign-law sentence names Korean commercial law, the Japanese Companies Act, and US state company laws separately. A shorter “Korean, Japanese, and US state company laws” was not used, because it can be read as state law for all three.
- Last paragraph: automatic discharge when the authority’s deadline ends; before that, an approval matched to the form and dated minutes.

## zh-hant

At 2700/2700, so several suggestions were applied in shorter wording. Facts below were not dropped to save characters.

- Bare “六個月。” removed. Opening: a company limited by shares with several shareholders holds the annual meeting within six months after year-end; a limited company sends the statements in the same period; a sole corporate or government shareholder is outside the meeting rules; who approves depends on the form (取決於組織形式). 公司 was not added before 組織形式. The one-shareholder exception, which the suggested sentence left out, stays. One 應 remains.
- “核對於2026年10月13日。” → “罰鍰核至2026年10月13日.” The previous sentence states the NT$10,000–50,000 fine. The longer “上述罰鍰金額核對日期為…” did not fit.
- The one-month start is inside the Article 110 sentence: send within six months, one month from sending, no objection, deemed approved. The previous sentence says the director sends the statements to each shareholder. A separate “股東提出異議的一個月…” sentence did not fit.
- “要有日期。[第170條]的六個月不適用。第20條還在。” → “每年的承認是載有日期的董事會決議。[第170條]的六個月不適用，第20條仍適用.” Not narrowed to 決算承認. Article 20 still includes the CPA audit and the fine. 但 was not added.
- Trailing “六個月。” removed from the annual-meeting paragraph. Frequency, six months, good cause plus authority approval, and the Article 170 link stay. 應/須/得 from the suggestion were not added.
- Duplicate “清單裡沒有。” removed. Article 195 is not in the Article 108 paragraph 4 list.
- “由此進來。受領人未寫明。” → “記載、二十日內分發與存續中的永久保存因此適用。分送給誰，條文沒有寫.” Both article links, the 20 days, retention for the life of the company, and the unnamed recipient stay.
- “母公司行事曆填不了高雄的空白年度。” → “母公司會議時程補不上高雄公司設立後缺的議事錄.” 子 in 子公司 did not fit. The company is the Kaohsiung subsidiary in the example.
- The example no longer repeats “二人準用董事會規定.” The analogy remains in the Article 128-1 paragraph, and Article 192 points to the same paragraph. The example still has two directors and no minutes after incorporation.
- Last paragraph: a director of a company limited by shares with no successor is discharged when the authority’s deadline ends. 股份有限公司 stays so a limited-company director is not pulled into Article 195. Before the deadline, approve the accounts in the form the company uses and keep dated minutes. 應 and 公司組織形式 did not fit.
