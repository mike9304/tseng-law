# ACCEPTED-zh-hans — supervisor decisions (Fable 5.1, 2026-09-21)

Scope for the fixer: RULEBOOK-FIX.md (all rules) + every P1/P2 row of `zh-hans-a.md` and `zh-hans-b.md`, except as listed here. P3 rows: apply when cheap.

## Rows to SKIP in every locale (already fixed mechanically, or out of scope)
- Any row about `/ko/...` links, "Korean-speaking lawyer" related-link labels, or the Hangul/percent-encoded wei-wei-lawyer.com body links → already remapped and relabelled (R1). Only verify the new labels read naturally; if a label is awkward, you may reword it (it is the page title from the guidance pack — keep the target path).
- Any row about the frontmatter `url:` containing Hangul → skip (canonical source metadata, not rendered).
- Any row that would add statements about the law of the reader's country (e.g. "in Israel/Poland the rule is …") → apply the neutral generalization of R2 instead.
- Any row asking to delete the team-bio fact "first-instance judgment of TWD 1,570,000" → keep the fact; only fix the number format for the locale (R3).

## Locale-specific decisions (part a)
- Self-gloss rows (a#1–a#6, a#9, a#11–a#15, a#17): the supervisor already stripped `X（X）` self-glosses from the zh-hans columns; now ADD the Traditional gloss on first use of each Taiwan legal term listed in R8 and in these rows (e.g. 工作许可（工作許可）, 资遣费（資遣費）, 外侨居留证（外僑居留證，ARC）, 公司负责人（公司負責人）, 未分配盈余加征（未分配盈餘加徵）, 專門性或技術性工作). Common words (离婚/继承/商标/专利) get no gloss.
- Mainland register (systemic): 智慧财产 → 知识产权（智慧財產權）, 劳动契约 → 劳动合同（勞動契約）, 检视 → 审查, 声请 → 申请（聲請）, 税捐 → 税收, 影片 → 视频, 「」 → “ ”, 新台币 amounts as 新台币 500,000 元 (keep digits).
- a#16 赡养费/扶养: apply.
- a#18 table '难度：简单': apply the corrected wording.
- a#19–a#23: R3.
- Also apply the supervisor's own rows in zh-hans-supervisor.md.

## Part b
Apply every P1/P2 row of `zh-hans-b.md` under the same skip rules above. Additional (part b): self-gloss rows b#3–b#6, b#10–b#12, b#14–b#16 → Traditional gloss on first use (as in part a decisions), official names in Traditional (統一證號基本資料表, 營業場所預先查詢, 建物登記第二類謄本, 外僑居留證); b#7 号 → 款 (第7条第1项第7款); b#8 → official wording 弯道 etc. per reviewer; b#9 行为人 → 外国当事人/外方; b#13 → R7b; b#17 → 经营许可（經營許可, 汽车运输业）vs 营业执照 distinction per reviewer; b#18 认证 → 会计师查核签证（會計師查核簽證）; b#19/b#20 → R3/R7; 检视 → 审查/核对 (systemic); 第1审/第2审/第3人 → 一审/二审/第三人 (R11); amounts 新台币 2,500 万元 or 新台币 25,000,000 元 (keep digits; checker must parse); 「」 → “ ” (R6).
