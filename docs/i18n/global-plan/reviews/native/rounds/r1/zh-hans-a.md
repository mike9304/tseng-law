# Simplified Chinese native review — round 1, part a (zh-hans)
reviewer: Grok 4.7 · date: 2026-09-22 · scope: zh-hans-guidance.txt (365 strings); columns-zh-hans/001-taiwan-company-establishment-basics.md, 002-withdraw-capital-taiwan-company.md, 003-taiwan-traffic-accident-procedure.md, 004-taiwan-company-subsidiary-vs-branch.md, 005-taiwan-company-establishment-advanced-2.md, 006-taiwan-massage-history-law.md, 007-taiwan-divorce-lawsuit-qna.md, 008-taiwan-labor-severance-law.md, 009-taiwan-voluntary-resignation-severance.md

## Verdict
naturalness (1 = machine, 5 = native professional): 4/5 for guidance pack, 4/5 for columns
variety used: Simplified Chinese, consistent 您. Taiwan statute terms keep a Traditional gloss in parentheses. The personal name 曾雋崴 keeps 雋. The guidance pack says 合同; the columns say 契约, which is the Taiwan Civil Code word and is readable in the mainland. Running dates are mainland style (2025年9月13日, 2023年12月27日). Column 003 still dates an insurance amendment as 2026-05-29 / 2026-07-01. Thousands use the comma (500,000), which mainland financial text also uses.
systemic patterns (max 6, each one line, with 1 example quote):
- 003 Q16–Q20, 005, 006, 008 and 009 still pad with U+200B blank lines and one-sentence paragraphs: "您是否经历过台湾早期传统理发厅的年代？"
- The third conjunct is not a place: "协助来自韩国、日本及其他国际委托人" (also the lawyers answer).
- English is left inside Chinese bios and one column: "Senior Paralegal, Boyin Law Firm"; "USD 500,000".
- 008 and 009 still publish a Hangul slug in `url`. Those are live paths; do not rewrite the URL field.
- The labor posts still use a Korean name blank and a blog close: "本人OOO自愿降低职位与薪资"; "公司当然应给付。"
- The sentence that keeps consultation out of a promised written form is opaque: "阅读本页并不等于某一次咨询将以某一种书面形式进行。"

Gender of attorney Wei Tseng: no finding. Bios and bylines use 律师 / 主任律师 / 曾雋崴 with no 他, 先生, or masculine title. 003 has no gendered pronoun for her. 006 林先生 and 008 B先生 are male third parties. Consultation lock stays negative (four languages only; no interpreter; no reply-time promise; no free first meeting; no result promise). 001, 002, 004 and 007 are native professional legal Chinese, including the Korea-treaty caveat for readers who are not Korean. 003 Q1–Q15 is the same register. 005 is short and usable except the foreign-employee count. 003 Q16–Q20, 006, 008 and 009 are still a personal blog.

## Findings
| # | sev | cat | file | quote (≤120 chars, verbatim) | problem (English, one line) | suggested Simplified Chinese rewrite |
|---|-----|-----|------|------|------|------|
| 1 | P1 | A | columns-zh-hans/005-taiwan-company-establishment-advanced-2.md | "雇用人数超过1人时" | English is more than one foreign national; Chinese counts every employee and triggers the specialized-work test too early. | 外国籍受雇人超过1人时，其学历与经历、平均薪资，以及公司资本额与营业额，依“专业性或技术性工作”（專門性或技術性工作）审查。 |
| 2 | P2 | A | zh-hans-guidance.txt | "通过文件系统与工作流程支持部门之间的往来。" | English is document and workflow systems; 文件系统 is a computer file system. | 具备信息科学背景，借助文档系统与工作流程，支持部门之间的协作。 |
| 3 | P2 | A | zh-hans-guidance.txt | "即亲权与抚养" | The Taiwan term is parental rights and duties; 抚养 adds child support, which is a different claim. | 未成年子女权利义务之行使或负担（未成年子女權利義務之行使或負擔，即亲权） |
| 4 | P2 | A | zh-hans-guidance.txt | "它不承诺搜索排名、背书、人工智能推荐或展示。" | English is endorsement, recommendation, and guaranteed visibility; 展示 drops “guaranteed”, and 人工智能 narrows “recommendation”. 检索地图 in the same sentence is not a native name for a discovery map. | 本 llms.txt 文件只是公开页面的查找索引；它不承诺搜索排名、背书、推荐或必然展示。 |
| 5 | P2 | A | columns-zh-hans/003-taiwan-traffic-accident-procedure.md | "选择因时效中断、被告范围、证据、保险及管辖而有不同。" | The subject is missing; English is which route is appropriate. | 应走哪一条途径，因时效是否中断、被告范围、证据、保险及管辖而有不同。 |
| 6 | P2 | E | columns-zh-hans/008-taiwan-labor-severance-law.md | "公司当然应给付。" | After a page of exceptions, 当然 reads as a promise that severance is always paid. | 在符合法定要件时，资遣费是受雇人可以依法主张的权利。 |
| 7 | P2 | E | columns-zh-hans/009-taiwan-voluntary-resignation-severance.md | "多数情形，事先做好准备的人，其权利较获保护。" | English is “better positioned”; Chinese states that the prepared party’s rights are protected. | 多数情形，事先做准备的一方更有条件维护自己的权利；这并不当然带来某一结果。 |
| 8 | P2 | G | zh-hans-guidance.txt | "Senior Paralegal, Boyin Law Firm" | A Simplified Chinese bio still gives the job title only in English. Also "Senior Paralegal, Muyang International Law Firm". | 资深律师助理，Boyin Law Firm |
| 9 | P2 | G | zh-hans-guidance.txt | "硕士（M.A.）会计，National Chengchi University" | The same university is 国立政治大学 in the intro; this education line is English only. Also the bachelor line. | 会计学硕士（M.A.），国立政治大学（National Chengchi University） |
| 10 | P2 | G | columns-zh-hans/001-taiwan-company-establishment-basics.md | "进出口实绩达 USD 500,000 以上" | The currency name is left in English. Also the FAQ and §4, including USD 200,000. | 进出口实绩达50万美元以上，或代理佣金达20万美元以上 |
| 11 | P2 | G | columns-zh-hans/008-taiwan-labor-severance-law.md | "本人OOO自愿降低职位与薪资" | OOO is a Korean name blank on a Simplified Chinese client page. | 本人［姓名］自愿降低职位与薪资 |
| 12 | P2 | G | columns-zh-hans/008-taiwan-labor-severance-law.md | "url: \"https://www.wei-wei-lawyer.com/post/대만-노동법：대만에서-퇴직금-받기-어렵다고\"" | A Hangul slug is the published URL. Also 009 `post/직원이-자발적으로-퇴사해도-퇴직금을-받을-수-있는-예외`. Live path; do not rewrite the field. | （url 不要改。）若页面会把该网址显示给读者，标题用简体中文，不要把韩文 slug 当作标题。 |
| 13 | P2 | B | zh-hans-guidance.txt | "若不清楚您的事项属于哪一组，联系页面" | The link label 联系 is inserted immediately after this, so the page reads 联系页面联系说明. | 若不清楚您的事项属于哪一组，联系页面说明如何撰写摘要，以便律师审阅。（“联系页面”作链接文字，后接“说明如何撰写摘要，以便律师审阅。”） |
| 14 | P2 | B | zh-hans-guidance.txt | "协助来自韩国、日本及其他国际委托人" | 来自 needs a place; 其他国际委托人 is not one. Also the lawyers answer. | 协助来自韩国、日本及其他国家的委托人 |
| 15 | P2 | B | zh-hans-guidance.txt | "仅提交表单本身，并不成立律师与委托人关系。" | 本身 attaches to the form, and the comma switches subject mid-sentence. | 它不是针对具体案件的法律意见。仅提交表单，本身并不成立律师与委托人关系。 |
| 16 | P2 | B | columns-zh-hans/002-withdraw-capital-taiwan-company.md | "偿还贷与公司的款项" | 贷与 is not a noun phrase; English is repayment of money lent to the company. | 偿还股东贷予公司的款项 |
| 17 | P2 | B | columns-zh-hans/008-taiwan-labor-severance-law.md | "**资遣** **员工(经济解雇)**" | Bold markers split 资遣员工, and the Traditional gloss is gone. The disciplinary header is split the same way. | 经济解雇（資遣員工，經濟解僱） |
| 18 | P2 | B | columns-zh-hans/003-taiwan-traffic-accident-procedure.md | "Q16. 事故后，能否把一切都交给保险人处理？" | Q1–Q15 are headings; Q16–Q20 are body lines split by U+200B blanks. Same blank lines in 005, 006, 008 and 009. | ## Q16. 事故后，能否把一切都交给保险人处理？ |
| 19 | P2 | C | zh-hans-guidance.txt | "咨询时使用的中文包括普通话与书面中文。" | A mainland reader cannot tell that the page’s simplified script is not a promised consultation form. Also "阅读本页并不等于某一次咨询将以某一种书面形式进行。" | 咨询使用的中文，指普通话与书面中文。阅读本简体中文页面，并不表示某次咨询会以简体中文这一书面形式进行。 |
| 20 | P2 | C | zh-hans-guidance.txt | "当事人往来书面通常是关键文件。" | 书面 is left as a bare noun; English is the parties’ correspondence. | 劳动合同、工作规则、薪资单以及双方往来函件通常是关键文件。 |
| 21 | P2 | C | zh-hans-guidance.txt | "完成国立政治大学会计学学士与硕士课程" | “Completed programs” is not how a Chinese bio states degrees. | 国立政治大学会计学学士、硕士，现主持一家会计师事务所。 |
| 22 | P2 | C | zh-hans-guidance.txt | "律师助理，多年在多家事务所担任资深律师助理" | The role is named twice, and 外资 is clipped. | 任律师助理多年，曾在多家事务所担任资深律师助理，负责诉讼辅助、公司法与外资事务。 |
| 23 | P2 | C | columns-zh-hans/002-withdraw-capital-taiwan-company.md | "以公司卡片支付的私人费用" | 公司卡片 reads as a membership or access card; English is a company payment card. | 以公司信用卡支付的私人费用 |
| 24 | P2 | C | columns-zh-hans/004-taiwan-company-subsidiary-vs-branch.md | "并澄清责任关系的装置。" | 装置 means a physical device; the sentence needs a legal arrangement. | 指定负责人并不是使分公司成为独立公司的程序，而是让外国公司得以在台湾执行业务、并厘清责任关系的安排。 |
| 25 | P2 | C | columns-zh-hans/005-taiwan-company-establishment-advanced-2.md | "在汇出资本金（资本金汇款）前" | 资本金 is a Korean/Japanese word; the parenthesis repeats it instead of glossing. | 汇出资本额之前，请先询问您在韩国的主要往来银行。 |
| 26 | P2 | C | columns-zh-hans/006-taiwan-massage-history-law.md | "您是否经历过台湾早期传统理发厅的年代？" | Personal-blog opening on a client page. 008 still opens "许多人已经知道。" and 009 closes on a one-line moral. | 台湾早期的传统理发厅，客人坐着剪发，同时接受洗发以及头皮、肩颈按摩。 |
| 27 | P2 | C | columns-zh-hans/009-taiwan-voluntary-resignation-severance.md | "都承认各方有不给付资遣费或请求资遣费的权利。" | Both parties seem to hold both rights; English splits withhold vs claim by who is at fault. | 过失在雇主一方时，受雇人可以请求资遣费；过失在受雇人一方时，雇主可以不给付资遣费。 |
| 28 | P2 | D | columns-zh-hans/003-taiwan-traffic-accident-procedure.md | "2026-05-29修正的给付标准" | Mainland legal prose does not date statutes as ISO numbers. Also 2026-07-01 in the same sentence. | 2026年5月29日修正的给付标准（強制汽車責任保險給付標準），适用于2026年7月1日以后发生的事故。 |
| 29 | P2 | D | columns-zh-hans/007-taiwan-divorce-lawsuit-qna.md | "台湾宪法法庭于112年宪判字第4号" | A mainland reader is not told that ROC year 112 is 2023. Also the FAQ, §4, and the source list. Keep the official citation. | 台湾宪法法庭于2023年作成的112年宪判字第4号（112年憲判字第4號） |
