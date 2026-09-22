# Simplified Chinese native review — round 2, part a (zh-hans)
reviewer: Grok 4.7 · date: 2026-09-22 · scope: zh-hans-guidance.txt (365 strings); columns-zh-hans/001-taiwan-company-establishment-basics.md, 002-withdraw-capital-taiwan-company.md, 003-taiwan-traffic-accident-procedure.md, 004-taiwan-company-subsidiary-vs-branch.md, 005-taiwan-company-establishment-advanced-2.md, 006-taiwan-massage-history-law.md, 007-taiwan-divorce-lawsuit-qna.md, 008-taiwan-labor-severance-law.md, 009-taiwan-voluntary-resignation-severance.md

## Verdict
naturalness (1 = machine, 5 = native professional): 4/5 for guidance pack, 3/5 for columns
variety used: Mainland Simplified Chinese, consistent. Traditional characters appear as Taiwan legal glosses in parentheses, in the name 曾雋崴, in the firm name 昊鼎國際法律事務所, and in the citation 民國112年憲判字第4號. Dates are mainland style (2025年9月13日). Amounts use the comma (500,000) and 万 (157万元). Decimal point in 0.5.
systemic patterns (max 6, each one line, with 1 example quote):
- Invisible blank lines (U+200B) still split 003 from Q16, plus 005, 006, 008 and 009, into one-sentence fragments: "Q16. 事故后，能否把一切都交给保险人处理？"
- Statute-flavored calques remain in client prose: "并取决于各该程序。" Also "沟通方式须待确认".
- Family-law words are Taiwan terms a mainland reader maps onto the wrong relationship: "对无过失配偶的赡养费（贍養費）" (elder support) beside "未成年子女扶养费" (mainland 抚养费). 会面交往 has no 探望 gloss.
- 008 and 009 still publish a Hangul slug in `url`. Those are live paths; do not rewrite the URL field.
- "使用一种语言" and the form option omit the speaker: "四种语言都无法使用 — 沟通方式须待确认".
- Equity pay is aimed at "机关", which a mainland reader reads as a government body or a corporate organ: "对机关与人员的股份报酬".

Gender of attorney Wei Tseng: no finding. The pack and bylines use 律师曾雋崴, 主任律师, 交换学生, with no 他/她. 006 林先生 and 008 B先生 / 他 are male third parties. Consultation lock stays negative (only four languages; no interpreter; no reply-time; no free first meeting; no result promise). 008 "业绩最好" describes Mr. B's sales rank in the case story, not the firm. 001, 002, and 003 Q1–Q15 are native professional legal Chinese apart from the rows below. 004 is the same register apart from the statute label and 机关. 007 is the same register apart from the family-law terms and one sentence. 005, 006, 008, 009, and 003 from Q16 are not yet client-page Chinese.

## Findings
| # | sev | cat | file | quote (≤120 chars, verbatim) | problem (English, one line) | suggested Simplified Chinese rewrite |
|---|-----|-----|------|------|------|------|
| 1 | P1 | A | zh-hans-guidance.txt | "本页没有紧急通道" | 紧急通道 is a fire exit or emergency lane; the sentence denies an expedited contact route. | 本页不设紧急联系方式，也不承诺回复时限 |
| 2 | P1 | A | columns-zh-hans/004-taiwan-company-subsidiary-vs-branch.md | "台湾法务部法规资料库 — 营业税法第10条" | The URL is pcode=G0340028&flno=3, the withholding-rate standard that column 001 labels as the non-resident dividend rate. Do not change the URL. | 各类所得扣缴率标准（各類所得扣繳率標準）第3条：给付非居住者股利的扣缴税率 |
| 3 | P1 | A | columns-zh-hans/004-taiwan-company-subsidiary-vs-branch.md | "也可安排对机关与人员的股份报酬" | English is equity compensation for officers and employees; 机关 is a government body or a corporate organ. Also "是否对机关与人员给予股份报酬". | 也可安排向董事、经理人及员工给予股权报酬 |
| 4 | P1 | A | columns-zh-hans/008-taiwan-labor-severance-law.md | "且因在受雇人离开前已发现求职机会" | English: he found that the company had already posted recruitment ads. This reads as B finding a job for himself. | 并且发现公司在受雇人离职前已经对外刊登招聘 |
| 5 | P2 | A | zh-hans-guidance.txt | "期限（包括法定起诉期间）" | Neither Taiwan 消灭时效 nor mainland 诉讼时效; 起诉期间 sounds like a court filing window. | 期限（包括诉讼时效／消灭时效，消滅時效） |
| 6 | P2 | A | columns-zh-hans/003-taiwan-traffic-accident-procedure.md | "先确保人身安全与警示号志。" | English is warning measures; 警示号志 means traffic signs. | 先确保人身安全，并采取警示措施。 |
| 7 | P2 | A | columns-zh-hans/006-taiwan-massage-history-law.md | "出现了仅保护视障者权利、过度限制非视障者工作权的意见。" | The grammar makes the opinions themselves do the protecting and restricting. | 逐渐有人认为，只保护视障者的权利，会过度限制非视障者的工作权。 |
| 8 | P2 | A | columns-zh-hans/008-taiwan-labor-severance-law.md | "公司会有困难，" | English is reported speech that the company was struggling; this states a future fact and drops the speaker. | 主管说公司经营有困难，要求B作出牺牲、给其他人做示范，接受降薪和降职。 |
| 9 | P2 | A | columns-zh-hans/008-taiwan-labor-severance-law.md | "订立劳动合同时为不实陈述" | Labor Standards Act Article 12 uses 虚伪意思表示; 不实陈述 is a different notion. Column 009 already uses the statutory term. | 订立劳动合同时为虚伪意思表示（虛偽意思表示），使雇主陷于错误，并使企业有受损害之虞 |
| 10 | P2 | A | columns-zh-hans/009-taiwan-voluntary-resignation-severance.md | "依谁先以充分事由终止契约，" | The party who terminates first may withhold or claim severance; the Chinese sentence has no actor. | 哪一方先以充分事由终止契约，该方就可以不给付资遣费，或请求资遣费。 |
| 11 | P2 | B | columns-zh-hans/003-taiwan-traffic-accident-procedure.md | "Q16. 事故后，能否把一切都交给保险人处理？" | Q1–Q15 are headings; Q16–Q20 and the close are body lines split by U+200B blanks. Same blank lines in 005, 006, 008 and 009. | ## Q16. 事故后，能否把一切都交给保险人处理？ |
| 12 | P2 | C | zh-hans-guidance.txt | "列表保持原文语言并打开相应语言页面" | Calque of "the list stays in the original language and opens the page". | 列表仍以原文语言显示，点开后进入相应语言的页面；内容不会被自动翻译。 |
| 13 | P2 | C | zh-hans-guidance.txt | "确定哪些属于工作、哪些不属于。" | "What belongs to the work" is not how a firm states scope. | 因此第一步始终是确定哪些事项属于工作范围、哪些不属于。 |
| 14 | P2 | C | zh-hans-guidance.txt | "并取决于各该程序。" | 各该 is statute diction. Also 004 "依各该法律所定责任主体与制裁进行。" | 这些与酬金分开，并视相应程序而定。 |
| 15 | P2 | C | zh-hans-guidance.txt | "四种语言都无法使用 — 沟通方式须待确认" | 须待 is redundant, and the option has no speaker, so the languages sound unavailable. Also the contact, FAQ and inquiry notices. | 我这四种语言都不会——沟通方式待确认 |
| 16 | P2 | C | zh-hans-guidance.txt | "本页并未说明第一次谈话不收取费用，任何部分都不应被如此理解。" | The double negative does not read as a sentence a client can finish. The negative (no free first meeting) must stay. | 本页没有把第一次谈话说成免费，任何表述都不应作此理解。 |
| 17 | P2 | C | zh-hans-guidance.txt | "存放在该服务的非公开对象存储中" | "Private object storage" is data-center jargon on a privacy page. Also "存放在非公开场所". | 您发送的内容存放在该服务不对外公开的存储空间中。 |
| 18 | P2 | C | zh-hans-guidance.txt | "若该通知尚未确认，您的文本仍会保存，不会丢失。" | A reader cannot tell who is supposed to confirm the notice. Also "事务所尚未确认通知". | 若事务所尚未确认已收到该通知，您的文本仍会保存，不会丢失。 |
| 19 | P2 | C | zh-hans-guidance.txt | "可用作概览，具体问题仍须就您的文件与律师讨论" | The clause has no subject after an imperative. | 文章只可作概览，具体问题仍须就您的文件与律师讨论；本页不是咨询步骤。 |
| 20 | P2 | C | zh-hans-guidance.txt | "正式咨询电子邮件" | Reads as a translated label, not a mailbox name. | 咨询专用电子邮箱 |
| 21 | P2 | C | zh-hans-guidance.txt | "此项目尚无本页语言的版本。" | 项目 is "item"; the page is talking about an article or entry. | 这篇内容尚无本页语言的版本。标明原文语言的链接会打开原文。 |
| 22 | P2 | C | zh-hans-guidance.txt | "它不承诺搜索排名、背书、推荐或必然展示。" | 必然展示 is not a phrase a reader uses for search visibility. The refusal of a guarantee must stay. | 本 llms.txt 文件只是公开页面的查找索引；它不承诺搜索排名、背书或推荐，也不保证一定会被展示。 |
| 23 | P2 | C | zh-hans-guidance.txt | "资本缴入、银行事项" | 资本缴入 is not the mainland term for paying in capital. | 缴纳出资、银行事项、营业场所审查以及行业特定要求 |
| 24 | P2 | C | zh-hans-guidance.txt | "并不表示某次咨询会以简体中文这一书面形式进行。" | "这一书面形式" is translated. The negative must stay. Also the FAQ answer and the llms.txt notice. | 阅读本简体中文页面，并不表示某次咨询会以简体中文书面进行。 |
| 25 | P2 | C | columns-zh-hans/001-taiwan-company-establishment-basics.md | "比较组织形态时，因此不仅要看责任范围" | 因此 is stranded inside the clause. | 因此，比较组织形态时，不仅要看责任范围，还须一并考虑资本结构与后续各项条件。 |
| 26 | P2 | C | columns-zh-hans/001-taiwan-company-establishment-basics.md | "台北市就辖内公司与商业登记，运营营业场所预先查询系统" | "运营……系统" calques "operates a system" and the word order does not hold. | 台北市针对辖内的公司与商业登记，设有营业场所预先查询系统（營業場所預先查詢）。 |
| 27 | P2 | C | columns-zh-hans/005-taiwan-company-establishment-advanced-2.md | "也可再看在台湾设立公司 — 深化篇2。" | The reader is already on part 2, and the page tells them to go read part 2. | 本文承接基础篇与深化篇1。 |
| 28 | P2 | C | columns-zh-hans/006-taiwan-massage-history-law.md | "在有无视觉障碍者的职业权利辩论中" | 有无视觉障碍者 reads as whether such people exist, not people with and without a visual impairment. | 在视障者与非视障者的职业权利争论中，出现许多相反意见。 |
| 29 | P2 | C | columns-zh-hans/007-taiwan-divorce-lawsuit-qna.md | "说明依当地法离婚在国外有效，或仅有一份外国离婚证明" | The opening has no noun; English is a statement or a certificate alone. | 仅说明依当地法律离婚已在国外生效，或仅持有一份外国离婚证明，并不能办完台湾所要求的全部程序。 |
| 30 | P2 | C | columns-zh-hans/008-taiwan-labor-severance-law.md | "新经营层上任后即开始，" | 即开始 has no verb; the purpose clause is left hanging. | 新经营层一上任，为了降低人事成本，就开始陆续约谈薪资较高、年资较深的受雇人。 |
| 31 | P2 | C | columns-zh-hans/008-taiwan-labor-severance-law.md | "**受雇人自行辞职**  **员工自请离职**" | Two labels for one column header. | 受雇人自行辞职 |
| 32 | P2 | C | columns-zh-hans/009-taiwan-voluntary-resignation-severance.md | "而不是让双方同时享有请求与不给付两项权利。" | A native sentence does not end on "两项权利" this way. | 台湾法是按过失在哪一方来分配这项权利，不是双方同时既能请求、又能拒绝给付。 |
| 33 | P2 | D | zh-hans-guidance.txt | "会面交往（會面交往）" | The gloss only changes script. Mainland family law says 探望权. Also throughout 007. | 会面交往（會面交往，即探望） |
| 34 | P2 | D | zh-hans-guidance.txt | "若您已收到检察机关、警方或法院的文书" | 检察机关 is the mainland procuratorate; the Taiwan body is 检察署. | 若您已收到检察署（檢察署）、警方或法院的文书，请尽早告知文书上的日期 |
| 35 | P2 | D | columns-zh-hans/003-taiwan-traffic-accident-procedure.md | "道路标线、号志及天气状况" | 号志 is the Taiwan word for traffic signals. | 记录车辆位置与损坏、道路标线、交通信号（號誌）及天气状况。 |
| 36 | P2 | D | columns-zh-hans/003-taiwan-traffic-accident-procedure.md | "上限、自负额、除外事项" | Mainland motor policies say 免赔额, not 自负额. | 实际保障因被保险人、保险金额上限、免赔额（自負額）、除外事项、过失及保单其他条件而不同 |
| 37 | P2 | D | columns-zh-hans/007-taiwan-divorce-lawsuit-qna.md | "对无过失配偶的赡养费（贍養費），以及未成年子女扶养费" | Mainland 赡养 is support for parents and 抚养 is for children; these two headwords are crossed. Also the later 配偶赡养费 lines. | 第1057条对无过失配偶的离婚后扶养费（贍養費），以及未成年子女抚养费 |
| 38 | P2 | G | columns-zh-hans/008-taiwan-labor-severance-law.md | "post/대만-노동법：대만에서-퇴직금-받기-어렵다고" | A Simplified Chinese article still opens on a Hangul slug. Also 009 `post/직원이-자발적으로-퇴사해도-퇴직금을-받을-수-있는-예외`. Live paths: do not edit `url`. | URL 字段不要改。 |
