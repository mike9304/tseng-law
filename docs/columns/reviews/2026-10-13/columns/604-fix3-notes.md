# C4 fix3 notes

Review: `reviews/C4/final-astra-r2.md` (FIX). Drafts edited in place. Frontmatter keys, slug, and `featured_image` path are unchanged. No bold, phone, street address, lawyer-review claim, or party names. Contact remains one firm-and-email sentence. Author stays `legal-ai-assistant`.

Sources opened before the legal edits: live `law.moj.gov.tw` pages for 租賃住宅市場發展及管理條例 Article 4 and Article 7; points 14, 18, 20 and prohibited term 8 from the official PDF text in `reviews/C4/evidence-astra-r2/terms.txt` (Executive Yuan file `https://www.ey.gov.tw/File/43BC094940995CFC?A=C`). Article 4 says 經營管理 for both the government/dedicated body and the cooperative. Article 7(2) returns the deposit when the lease has ended, the dwelling is returned, and lease debts are settled. Point 20 says the parties 得約定 email, SMS, or messaging-app text and prints boxes for that agreement. It does not say the printed box is the only way to agree.

Lint after this pass (`lint.py … <lang> taiwan-tenant-early-lease-termination-notice-penalty`):

- ko OK, 3498 chars
- ja OK, 4419 chars
- en OK, 1596 words (summary 155; seoTitle 39)
- zh-hant OK, 2700 chars

Variety (`variety_metrics.py check`): 0 FAIL on all four. KO/JA ending-share WARNs only (합니다체 / です・ます). Contrast 0. No stock hypothetical opener. Labels kept: 가상의 사례입니다 / 架空の例です / an invented example / 虛構情境. Openings stay quotation (ko, en, zh-hant) and question (ja).

KO, EN, and ZH bodies still have no question mark. The openings stay the official point 14 line, which is this column's opening type in the batch, and the three FAQs hold the reader questions. JA keeps the opening question. KO is at 3498/3500, ZH at 2700/2700, EN at 1596/1600, so a new body question was not added.

## L1 — EN Chinese-text priority

Changed. "The signed Chinese text controls." is gone. The opening sentence is labeled as an English translation of point 14's official line. No rule that a signed Chinese lease beats other wording or mandatory terms.

## L2 — ZH urgent-exception gloss

Changed. "修繕爭議不在免除範圍。" is now "並非所有修繕爭議都能免除先期通知；仍須符合第3款前段危及安全或健康且情況危急的要件。" The official quotation and the PDF link stay. KO/JA/EN already used the limited proposition and were left on that point.

## L3 — deposit return omits lease end

Changed in KO, JA, and EN. The return now needs the lease to have ended, the dwelling returned, and the lease debts settled, then full return or the balance after set-off, with the Article 7 link. ZH already had 契約消滅、返還住宅並清償租賃債務 and was not rewritten on this point.

## L4 — point 20 reduced to a checkbox

Changed in FAQ 3 and the body, all four languages. Email, SMS, and messaging-app text count when both parties agree to that method. The reader is told to check the agreement written in the contract, including any selected field. The printed box is not an exclusive validity test, and the text does not say an unagreed message is enough. Telephone-only notice stays a prohibited term.

## L5 — KO Article 4 drops 經營管理

Changed. The exclusion is housing operated or managed by the government or a dedicated legal person or institution it sets up, and housing operated or managed by a cooperative. Leisure/tourism and under-30-days stay, with the Article 4 link.

## C1 — immediate links, JA cap, EN summary

Changed. The point 14 set-off, shortfall, and prepaid-rent paragraph now links the Executive Yuan page in the same paragraph (ko, ja, en, zh-hant). The email/SMS/prohibited-term-8 paragraph links that page on point 20 and on prohibited term 8; the 存證信函 definition still links Postal Regulations Article 34. JA's opening answer now states the one-month cap for a point 14 「得」 contract ended without at least one month's notice, with the point 14 link in that paragraph. EN summary now says "at least one month" (155 characters).

## Voice

- KO "1년 주택에서" → "1년짜리 주택 임대차를 만기 전에 끝낼 때". The one-year application of Article 450(1) is in that article's sentence ("1년도"), not a second "1년 계약도 같습니다."
- KO "칸과 조례의 임차인 통지는 그대로입니다." → "임차인은 계약과 조례에서 정한 통지 의무를 따릅니다."
- KO recall: "임대차 기간이 다섯 달 남았을 때 본사가 주재원에게 서울 복귀를 명하면", with the fictional label and the lease not ending from the recall alone.
- JA point 9 paragraph 3: the paragraph now says it also requires advance notice for entry to repair, then the reasonable period and the no-refusal-without-justifiable-reason sentences.
- JA "状況が急" → "状況が切迫している" in FAQ 2, the point 18 paragraph, and the closing. Scope stays safety/health, item 3, first part.
- EN "Notice the tenant owes…" → "The tenant must still comply with the contractual and statutory notice requirements."
- EN Article 10 sentence now says Article 10 sets out the landlord's grounds and the required notice. The deposit-column pointer and the link stay.
- ZH "一年期走第1項。" → "一年期租約也適用第1項。"
- ZH "再寫一次" → "2025年4月18日修正的第18點也列有這些事由。" The date is the amendment date already in the column, not a claim about when each ground was first introduced.
- Closing keys, all four: no longer a universal rule that keys pass only after the joint check. The sentence is practical advice to note the keys on the handover record. Article 12 / point 15 joint check and the no-show deemed-completion stay in the handover paragraph. The closing still ties the example to notice (KO/JA/EN/ZH) or, in JA, to the leak's 30-day written notice.

JA "1年契約も同じです" and EN "A one-year lease is that case" stay. They are the Article 450(1) application, and the title line is about the checkbox, not that article.

## Length cuts that do not drop a condition

KO and ZH were at the ceiling. Removed only the transition after Article 4 ("아래는 그 밖의 주택 임대입니다" / "下面談的是其餘的住宅租賃"). The four exclusions remain in the previous sentence. ZH still says the 包租 paragraphs are outside this column.

The KO and EN closings no longer repeat that the one-month cap applies only to a skipped notice, or that 「不得」 states no figure. Those sentences remain in the 「得」 / 「不得」 sections and in FAQ 1. ZH's closing likewise no longer repeats the cap and the no-figure line; both remain in those sections and FAQ 1. JA's closing still names the cap as the separate point 14 route.

## Not changed, and why

Image REDO. `images/C4.webp` is still absent. The review asks the coordinator to export the WebP from the approved JPEG and says not to regenerate the scene. This pass was limited to the four drafts and this note.

Fact sheet. `drafts/C4/facts.md` was not rewritten. The review says to reconcile it after the legal corrections and not to copy removed claims back into the drafts. The sheet still describes older sentences. The drafts follow the statutes and the r2 findings, not that sheet.

No reviewer finding was rejected as legally wrong. The suggested fixes matched Article 4, Article 7(2), and points 14, 18, and 20.
