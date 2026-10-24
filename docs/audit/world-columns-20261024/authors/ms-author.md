# ms author work note (Bahasa Melayu, Malaysia) — 807–809

Date checked: 24 October 2026. Author: Claude (model-written draft; no lawyer review and no native-speaker review is claimed or implied).

Files
- `drafts/ms/807-malaysian-student-taiwan-part-time-work-permit.md` (P-STUDENT)
- `drafts/ms/808-malaysian-brand-taiwan-subsidiary-branch-first-shop.md` (B-SETUP)
- `drafts/ms/809-malaysian-rider-taiwan-scooter-accident-licence-insurance.md` (L-TRAFFIC)

Word counts (body only, Markdown link targets removed, `## Sumber` list excluded; the brief range is about 650–950 words)
- 807: 876 words
- 808: 854 words
- 809: 913 words

Frontmatter: field order as in the brief; `categories` uses the strings that exist in `columns-ms` ("Maklumat undang-undang Taiwan" for 807 and 809, "Penubuhan syarikat di Taiwan" for 808); `date_display` "24 Oktober 2026" (Malay month name, same day-month-year pattern as "13 September 2025" / "4 Februari 2026" in existing columns); `read_time` "5 minit bacaan" (existing pattern "N minit bacaan"). 809 uses `tags` `traffic-accidents`, `traffic-liability`, `traffic-compensation` as required by `docs/columns/FRONTMATTER.md` for the traffic board, plus `motosikal`; its `topic` is `litigation` (civil and criminal negligence mixed), as in the Thai traffic column 662.

Images (from `briefs/IMAGE-MENU.md`, all different): 807 = I13, 808 = I08, 809 = I22. Alt texts describe only what the menu lists.

Variety tool: `variety_metrics.py` does not list `ms`. I ran it with `--lang id` as a rough proxy only (not an `ms` pass): all three files returned "OK — no variety limit violated" (cv 0.49–0.56, short sentences 14–17%, no 3-run, no contrast pattern counted). I also checked by hand: no bold, no H1, 4–5 `##` headings per article, no paragraph-start word used more than twice, no "Katakan/Misalkan" stock opener, at least two very short sentences per article.

Status of research ledger: `research/country-facts.md` appeared while I worked. I used only rows I could re-verify myself against the official page: tax treaty (MOF page `https://www.mof.gov.tw/singlehtml/191?cntId=63930`, fetched myself). The ledger's driving-licence row for Malaysia is UNVERIFIED (Highway Bureau pages return an Imperva/hCaptcha wall; I did not try to bypass it). Nothing from the ledger's visa-free row was used in the articles.

---------------------------------------------------------------------

## 807 — Malaysian student, part-time work permit (P-STUDENT)

### Reader and trigger
A Malaysian student at a Taiwanese university or Mandarin centre who is offered a café, shop or tutoring shift and wonders whether the ARC (or the school's silence) is enough. Trigger: the offer arrives before any permit does.

### Why this topic fits Malaysia
Labelled hypothesis: the assignment table lists "Malaysian students, professionals, food and retail entrepreneurs" as readers; Malaysian students being a large group in Taiwan is not asserted in the article because I only found third-party news (not an official Ministry of Education table), which I did not rely on. What is firmly Malaysia-relevant and legal rather than demographic: a Malaysian student may sit under either the foreign-student rules (`外國學生來臺就學辦法`) or the overseas-Chinese-student (僑生) rules, and Employment Service Act art. 50 plus Regulation arts. 51/52 treat the two differently. The article makes that distinction its centre, without claiming which Malaysians belong to which group.

### Overlap with existing columns and new angle
- `columns-ms` has no student-work column (001–018 are company, labour, traffic, inheritance, etc.). 008/009 (severance) are linked only for the post-graduation employment point.
- Structural sources `columns-en/607` and `637`/`705` were read. 607 is the closest overlap (permit, 20-hour cap, fines, fresh-graduate extension). Differences: this draft is organised around the foreign-student / 僑生 split, uses the WDA's own pages, adds the school's role (arts. 23/24 of the foreign-student rules; art. 22-1 of the 僑生 rules), and omits the 637 court case (judgment database not reachable from here, so the "unpaid gig still counts" holding could not be re-verified; I wrote around it, see "Dropped").

### Claim → source table
| Claim in article | Source (all fetched 24 Oct 2026) | Chinese text checked |
|---|---|---|
| Foreigners may not work without a permit | Employment Service Act 就業服務法 art. 43, pcode N0090001 — https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=43 | 除本法另有規定外，外國人未經雇主申請許可，不得在中華民國境內工作。 |
| Student route: foreign students at public/registered private tertiary schools; 僑生 and other ethnic-Chinese students at senior-high level and above; not bound by art. 46(1); 20 h/week except winter/summer vacation | same act, art. 50 (…flno=50); art. 46 (…flno=46) | 雇主聘僱下列學生從事工作，得不受第四十六條第一項規定之限制；其工作時間除寒暑假外，每星期最長為二十小時：一、就讀於公立或已立案私立大專校院之外國留學生。二、就讀於公立或已立案私立高級中等以上學校之僑生及其他華裔學生。 |
| Foreign-student definition (foreign nationality, never ROC national, never studied as 僑生, not placed as 僑生 that year) | 外國學生來臺就學辦法 art. 2(1), pcode H0110001 — …pcode=H0110001&flno=2 | 具外國國籍且未曾具有中華民國國籍，符合下列規定者，得依本辦法規定申請入學：一、未曾以僑生身分在臺就學。二、未於申請入學當學年度依僑生回國就學及輔導辦法經海外聯合招生委員會分發。 |
| 僑生 status decided by the overseas-compatriot authority | 僑生回國就學及輔導辦法 art. 2(2), pcode H0100001 — …pcode=H0100001&flno=2 | 僑生身分認定，由僑務主管機關為之。 |
| Foreign students: formal enrolment or ≥6 months of language study; school determines financial need or unit need | 雇主聘僱外國人許可及管理辦法 art. 51(1), pcode N0090027 (title as printed on the page on 24 Oct 2026; amended 114-12-30) — …pcode=N0090027&flno=51 | 一、正式入學修習科、系、所課程，或學習語言課程六個月以上。二、經就讀學校認定具下列事實之一者：（一）其財力無法繼續維持其學業及生活，並能提出具體證明。（二）就讀學校之教學研究單位須外國留學生協助參與工作。 |
| 僑生: art. 52 asks only that they be 僑生 students under the 僑生 rules | same regulation, art. 52(1) | 本法第五十條第二款之僑生，應符合僑生回國就學及輔導辦法規定之學生。 |
| Permit ≤1 year; 20 h/week except vacations | same regulation, art. 54 | 第四類外國人之工作許可有效期間，最長為一年。前項許可工作之外國人，其工作時間除寒暑假外，每星期最長為二十小時。 |
| Formal-programme 僑生/HK-Macau/foreign students may apply after enrolment; language-course foreign students need 6 months | WDA page 在臺求學期間工讀 (updated 112-06-12), https://ezworktaiwan.wda.gov.tw/cp.aspx?n=99329239A3FBA2BB | 來臺正式入學修習科、系、所課程之僑生、港澳生及外國留學生，入學後即可向機關申請，惟來臺學習語言課程之外國留學生，則須修業6個月以上，方可提出申請。 |
| Application needs school review and consent | WDA documents page (updated 113-11-14), …&s=B87ABDBEA90DBADA | 申請許可須經學校審查同意。 |
| Student applies online ("僑外生工讀申請" account); permit lapses on suspension, withdrawal, graduation, end of language stage; exception for graduates who enrol in the next degree | WDA Q&A (updated 114-09-01), https://ezworktaiwan.wda.gov.tw/News_Content.aspx?n=77054B15FD1F5128&sms=2E02279676D3E77B&s=5C73DC0C790B04D9 | 請點選「僑外生工讀申請」，申請帳號後即可進行案件申請。／工作許可因休學、退學、畢業、語文學習或技術訓練階段性課程結束，失其效力。但畢業且取得學士、碩士或博士班錄取通知繼續就學且完成入學報到程序者，不在此限。 |
| School must notify consular affairs bureau and NIA service station when status changes | 外國學生來臺就學辦法 art. 24 | 外國學生有休學、退學或變更、喪失學生身分等情事，學校應通報外交部領事事務局及學校所在地之內政部移民署各服務站，並副知本部。 |
| School/authority must act on verified violations | same rules art. 23; 僑生回國就學及輔導辦法 art. 22-1 | 外國學生有違反就業服務法之規定經查證屬實者，學校或相關主管機關應即依規定處理。／僑生有違反就業服務法之規定經查證屬實者，學校或相關主管機關應即依規定處理。 |
| Fine NT$30,000–150,000 for breaching art. 43; ordered to leave and no further work | Employment Service Act art. 68(1), (3) | 違反第九條、第三十三條第一項、第四十一條、第四十三條…處新臺幣三萬元以上十五萬元以下罰鍰。／違反第四十三條規定之外國人，應即令其出國，不得再於中華民國境內工作。 |
| Employer hiring without permit: NT$150,000–750,000 | same act, arts. 57(1), 63(1) | 聘僱未經許可、許可失效或他人所申請聘僱之外國人。／違反第四十四條或第五十七條第一款、第二款規定者，處新臺幣十五萬元以上七十五萬元以下罰鍰。 |
| Fresh-graduate work without permit during NIA-approved extension | 外國專業人才延攬及僱用法 art. 12, pcode A0030295 | 外國人取得我國副學士以上學位者，以應屆畢業生之身分依法取得內政部移民署許可延期居留期間，在我國從事工作，得免申請工作許可。 |
| Extension: 1 year from the day after expiry; one further extension before it ends; max 2 years | 外國人停留居留及永久居留辦法 art. 11, pcode D0080129 | 其外僑居留證之有效期間自原居留期限屆滿之翌日起延期一年；延期屆滿前，有必要者，得再申請延期居留一次，總延期居留期間最長為二年。 |
| Any job type, max 2 years; professional licences still required; no weekly-hour figure on the page | WDA fresh-graduate page (updated 115-01-30), …cp.aspx?n=511766BD9E956242 | 從事工作類別無限制，最長2年。所從事的工作，若依其他法規，應先取得專業資格證明或執業登記始得從事(如醫師)… |

Law-version check: Employment Service Act last amended 114-01-20, no "not yet in force" banner. The regulation N0090027, A0030295, D0080129, H0110001, H0100001 printed no banner through `tools/law.py`.

### First-two-paragraph deletion test
Paragraph 1 (originally three sentences: "ARC proves residence. Work rights come from a permit. Art. 43 forbids…"): the middle sentence was cut because deleting it lost nothing (art. 43 sentence carries the rule); its content was folded into the first sentence ("…hak tinggal, bukan hak bekerja"). First sentence kept: it names the reader's object (the ARC) and the misconception. Third sentence kept: the rule and its source.
Paragraph 2: all three sentences kept; each adds a different element (the student route in art. 50; who may be hired and the exemption from art. 46; the weekly cap and the vacation exception). Deleting any one loses a legal condition.

### Comparison with three existing ms columns (008, 014, 016) and what changed
- 008 opens with a title-like question and answers in Q-and-A subheadings ("Q1…"); 014 and 016 use numbered/long explanatory headings and end on generic cautions. 807 opens with a statement of fact in the second sentence, uses four noun-phrase headings that name this article's own issues (including a Chinese-term heading), no numbering, no Q-and-A, and ends on a concrete action (check the dates printed on the permit) after the contact paragraph.
- Existing columns repeat "mesti dahulu… kemudian meneliti mengikut urutan" structures; 807 has no step list.

### Dropped (could not verify)
- The 2023 Taipei High Administrative Court holding that unpaid work is work (from `columns-en/637`): judgment site not reachable by curl; replaced by "the cited provisions do not say payment alone decides; ask first".
- Any Malaysia-specific population or admission-route figure for students (only third-party news seen).
- Fee (NT$100) and 2026 fee-standard change from `columns-en/607`: not needed and not re-checked.

---------------------------------------------------------------------

## 808 — Malaysian brand opening a Taiwan shop (B-SETUP)

### Reader and trigger
A Malaysian food or retail company (the assignment's "food and retail entrepreneurs") planning its first outlet in Taiwan and deciding between a Taiwan subsidiary and a branch, sending a Malaysian director, and moving profits home. Trigger: the lease and the capital transfer both need a named legal entity.

### Why this topic fits Malaysia
Verified and country-specific: Taiwan and Malaysia have a comprehensive income tax agreement in force (signed 23 Jul 1996; in force 26 Feb 1999; MOF list, page dated 2026-09-04), and the MOF withholding-rate list shows 12.5% on dividends to Malaysia against 21% for non-treaty countries. Labelled hypothesis: that Malaysian F&B/retail brands want Taiwan shops; no demand data was collected or stated, the example is flagged "contoh rekaan" in the sentence.

### Overlap with existing columns and new angle
- Existing ms 001/004/005 are Korea-oriented (not linked). 011 (cosmetics), 017 (logistics) and 018 (semiconductor) are sector-specific. 015 (restaurant premises check) and 002 (withdrawing capital) are linked as adjacent steps.
- Structural sources `columns-en/004`, `001`, `columns-es/656`, `507` were read (004 in full). This draft keeps their legal skeleton (Company Act arts. 1, 99, 371, 372) but replaces the Korea treaty section with the Malaysia treaty, adds foreign-investment approval (Foreign Nationals Investment Statute arts. 3–9), the work-permit route for a foreign manager (Qualification Standard arts. 38/39), and a trademark paragraph (Trademark Act arts. 19, 30).

### Claim → source table
| Claim | Source | Chinese text checked |
|---|---|---|
| Foreign company must register a branch before doing business in its own name; penalty up to 1 year / detention / fine up to NT$150,000 | Company Act 公司法 art. 371, pcode J0080001 — https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=371 | 外國公司非經辦理分公司登記，不得以外國公司名義在中華民國境內經營業務。違反前項規定者，行為人處一年以下有期徒刑、拘役或科或併科新臺幣十五萬元以下罰金… |
| Branch must set aside funds and appoint a responsible person in Taiwan | art. 372 | 外國公司在中華民國境內設立分公司者，應專撥其營業所用之資金，並指定代表為在中華民國境內之負責人。 |
| Branch has no separate personality; parent liable for branch liabilities | Gold Card Office (National Development Council) page, https://goldcard.nat.gov.tw/en/why-taiwan/foreign-startups-in-taiwan-3-options-for-foreign-corporate-entities-to-set-up-companies-in-taiwan/ (last changed 6 Jul 2022; general reference, not a statute) | "a branch office or representative office does not have an independent “corporate entity”… all the rights and obligations will belong to the foreign parent company" |
| Subsidiary is a separate company; limited-company shareholder liability limited to contribution, exception for serious abuse; capital paid in full, no instalments | Company Act arts. 1, 99, 100 | 本法所稱公司，謂以營利為目的，依照本法組織、登記、成立之社團法人。／各股東對於公司之責任，除第二項規定外，以其出資額為限。股東濫用公司之法人地位，致公司負擔特定債務且清償顯有困難，其情節重大而有必要者，該股東應負清償之責。／公司資本總額，應由各股東全部繳足，不得分期繳款或向外招募。 |
| Foreign legal persons are "foreign nationals"; nationality by law of incorporation | Foreign Nationals Investment Statute 外國人投資條例 art. 3, pcode J0040002 | 本條例所稱外國人包括外國法人。外國法人依其所據以成立之法律，定其國籍。 |
| Holding shares/capital in a Taiwan company is "investment" | art. 4(1) | 本條例所稱投資如下：一、持有中華民國公司之股份或出資額。… |
| Apply to MOEA; one month after complete file, two months if other authorities involved | arts. 2, 8 | 本條例所稱主管機關為經濟部。／投資人依本條例投資者，應填具投資申請書，檢附投資計畫及有關證件，向主管機關申請核准。… 應於其申請手續完備後一個月內核定之；牽涉到其他相關目的事業主管機關權限者，應於二個月內核定之。 |
| Capital must arrive within approved period; unperformed part cancelled; extension for good reason applied for before expiry | art. 9 | 投資人應將所核准之出資於核定期限內全部到達…其未實行之出資於期限屆滿時撤銷之。但有正當理由者，應於期限屆滿前，申請主管機關核准延展。 |
| Prohibited and restricted sectors; restricted sectors need sector authority's permission; list set by Executive Yuan | art. 7 | 下列事業禁止投資人投資…投資人申請投資於法律或基於法律授權訂定之命令而限制投資之事業，應取得目的事業主管機關之許可或同意。前項禁止及第二項限制投資之業別，由行政院定之… |
| A foreign person's work in Taiwan still needs a permit; "manager of an approved invested business" is an allowed job category | Employment Service Act arts. 43, 46(1)(2) | …二、華僑或外國人經政府核准投資或設立事業之主管。 |
| Eligible managers: manager of an approved company where foreign holding exceeds one third; manager of a foreign branch | Qualification Standard 外國人從事就業服務法第四十六條第一項第一款至第六款工作資格及審查標準 art. 38, pcode N0090031 (amended 113-08-01) | 一、依華僑回國投資條例或外國人投資條例核准投資之公司，其華僑或外國人持有所投資事業之股份或出資額，合計超過該事業之股份總數或資本總額三分之一之公司經理人。二、外國分公司經理人。… |
| Employer conditions, company under one year: one of paid-in capital or Taiwan operating funds ≥ NT$500,000, turnover ≥ NT$3,000,000, import/export ≥ US$500,000, commission ≥ US$200,000; other routes (rep office, special case) | art. 39 | 公司設立未滿一年者，實收資本額或在臺營運資金達新臺幣五十萬元以上、營業額達新臺幣三百萬元以上、進出口實績總額達美金五十萬元以上或代理佣金達美金二十萬元以上。… 三、經中央目的事業主管機關許可設立之外國公司代表人辦事處… 四、對國內經濟發展有實質貢獻，或因情況特殊，經中央主管機關會商中央目的事業主管機關專案認定。 |
| Taiwan–Malaysia comprehensive agreement signed 1996/07/23, in force 1999/02/26 | MOF 我國所得稅協定一覽表（全面性協定）, https://www.mof.gov.tw/singlehtml/191?cntId=63930 (updated 2026-09-04); also MOF open-data CSV via https://data.gov.tw/dataset/8403 | 馬來西亞 Malaysia * 1996/07/23(85 年) 1999/02/26(88 年) |
| Dividends to a company with head office outside Taiwan are subject to withholding at the prescribed rate | Income Tax Act 所得稅法 art. 88(1)(1), pcode G0340003 (banner concerns only art. 43-4) | 公司分配予非中華民國境內居住之個人及總機構在中華民國境外之營利事業之股利…應由扣繳義務人於給付時，依規定之扣繳率或扣繳辦法，扣取稅款… |
| 21% for non-treaty countries, 12.5% for Malaysia | MOF withholding-rate list (CSV), https://www.mof.gov.tw/download/159b9ab96804480f8f25ab1280f78b77 | 無租稅協定國家( Non-treaty Countries),21 … 馬來西亞(Malaysia),12.5,10,10, |
| Refusal of marks identical/similar to an earlier-filed mark (with consent exception); refusal of copy-minded filings by persons with a contract/geographic/business relationship (consent exception); filing date = date of application | Trademark Act 商標法 arts. 30(1)(10), 30(1)(12), 19(2), pcode J0070001 (banner concerns arts. 68, 70, 95–97 only) | 十、相同或近似於他人同一或類似商品或服務之註冊商標或申請在先之商標，有致相關消費者混淆誤認之虞者。但經該註冊商標或申請在先之商標所有人同意申請，且非顯屬不當者，不在此限。／十二、…知悉他人商標存在，意圖仿襲而申請註冊者。但經其同意申請註冊者，不在此限。／申請商標註冊，以提出前項申請書之日為申請日。 |

### First-two-paragraph deletion test
Paragraph 1 sentence 1 (the lease question): kept; it is the reader's decision and names the two entities. Sentence 2 (what the answer decides): kept; it states three consequences (debt, approval before money, profit route) that the headings then develop, so deleting it would lose the stakes.
Paragraph 2 sentence 1 (the Penang brand example, flagged invented): kept; it supplies the facts (who, where, a director being sent) the later work-permit section depends on. Sentence 2 ("Beberapa keputusan menanti: …") was cut: it only previewed the headings.

### Comparison with three existing ms columns (011, 017, 018) and what changed
- 011/017/018 open with a general statement ("Jenama kosmetik asing yang berhasrat…", "Apabila anda merancang…") and a second paragraph that announces the structure ("Berikut dijelaskan…", "Artikel ini membezakan 3 situasi"). 808 opens with a direct question about who signs the lease and has no announcing paragraph.
- Their headings are numbered ("1. Bentuk masuk…") or Q-and-A; 808 uses unnumbered statements ("Cawangan ialah syarikat Malaysia itu sendiri", "Dividen kembali ke Malaysia").
- They end on a generic caution; 808 ends on a fact tied to the example (the tenant named on the draft lease must be the approved or registered entity).

### Dropped (could not verify)
- Whether a branch needs foreign-investment approval. Statute art. 4(2) lists "branch" among investment forms, while the Gold Card Office page (2022) says IC approval is not required for a branch unless PRC-controlled. I could not reach the Investment Commission site (moeaic.gov.tw timed out) to settle it, so the article states approval only for the subsidiary route (art. 8) and does not compare branch approval.
- Time estimates (the Gold Card page's "two to three months") and the 5% surtax on retained earnings: not stated.
- Representative-office restrictions: left out (not needed for a shop).
- Corporate income tax rate (20%, Income Tax Act art. 5): checked but left out to keep the word budget.
- The conditions under which the 12.5% treaty dividend rate applies: not stated; the article says to check the agreement text and withholding procedure. The MOF list gives a single number with an empty remarks column.
- The ledger's visa-free (30 days) fact for Malaysians: verified on BOCA but not used.

---------------------------------------------------------------------

## 809 — Malaysian rider, scooter accident (L-TRAFFIC)

### Reader and trigger
A Malaysian student or visitor who rents a scooter in Taiwan, is hurt or hurts someone, and has a flight home. Trigger: the police have registered the accident; the person does not know whether the Malaysian licence counted, who pays treatment, or whether leaving is allowed.

### Why this topic fits Malaysia
Labelled hypothesis: Malaysians (students, tourists) ride rented scooters in Taiwan; no statistic collected or stated. The Malaysia link in the text is limited to the licence question and the home flight; Malaysia's reciprocity status could not be verified (see Dropped), and the article says so openly.

### Overlap with existing columns and new angle
- ms 003 (traffic accident Q&A) and 012 (overtaking) are linked, not repeated. Structural sources read: `columns-en/003`, `611`, `644`, `columns-th/662`. 662 (Thai) covers police-document timing and powers of attorney in depth; 809 keeps only the 7-day / 30-day dates (verified against the NPA FAQ) and adds what neither English nor Thai column states: the compulsory-insurance recourse against a rider without a valid licence (Act arts. 9(2), 29, 30), the licence framework (Safety Rules arts. 50, 55, 55-1), and the exit-restriction conditions (CPC 93-2/93-5).

### Claim → source table
| Claim | Source | Chinese text checked |
|---|---|---|
| In the Safety Rules 汽車 includes motorcycles unless a provision treats them separately | 道路交通安全規則 art. 2, pcode K0040013 — https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040013&flno=2 | 汽車：指在道路上不依軌道或電力架線而以原動機行駛之車輛（包括機車）。…前項第一款所指之汽車，如本規則同一條文或相關條文就機車另有規定者，係指除機車以外四輪以上之車輛。 |
| Foreign licences usable on reciprocity; MOTC announces details | art. 55-1 | 外國政府或地區所發有效之正式駕駛執照，得依平等互惠原則在我國使用，並准予在我國境內駕駛同等車類之汽車。前項互惠原則、使用方式、駕駛車類、有效期間及施行日期等事項，交通部應公告… |
| IDP from reciprocal country: up to 30 days without endorsement, longer needs endorsement | art. 55(1)(3) | 持有互惠國所發有效之國際駕駛執照，在我國境內作三十天以內之短期停留者，准予免辦簽證駕駛汽車；如停留超過三十天者，仍應向公路監理機關辦理簽證。 |
| Licence exchange without test on reciprocity, with ≥6 months' permitted stay/residence proof | art. 50(6) | 持有外國政府…所發有效之正式駕駛執照（證）並取得經許可停留或居留六個月以上之證明（件）者，得於入境之翌日起依平等互惠原則免考換發同等車類之普通駕駛執照。 |
| Fine NT$18,000–36,000 for motorcyclist without licence; vehicle impounded; 17 Aug 2026 amendment not in force | Road Traffic Management and Penalty Act 道路交通管理處罰條例 art. 21(1)(1), pcode K0040012 — …flno=21; amendment history https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=K0040012 and old-version page (in-force text of art. 21 compared) | 機車駕駛人處新臺幣一萬八千元以上三萬六千元以下罰鍰…並均當場移置保管該汽機車：一、未領有駕駛執照駕駛小型車或機車。／一百十五年八月十七日修正之第 21、21-1、35、67、73、85-2、85-3條施行日期，由行政院以命令定之 |
| Compulsory insurance covers motorcycles; owner must insure; renter with owner's consent is an insured | Compulsory Motor Vehicle Liability Insurance Act 強制汽車責任保險法 arts. 5, 49, 6, 9(2), pcode G0390060 | 第五條…第三十八條及第四十九條所稱之機車，亦為公路法第二條第十款所定義之汽車。／為機車者，處新臺幣一千五百元以上三千元以下罰鍰。／本法所稱被保險人，指經保險人承保之要保人及經該要保人同意使用或管理被保險汽車之人。 |
| No-fault claim against insurer; benefit items; payment within 10 working days after documents complete; claim period 2 years / 10 years | arts. 7, 27, 25(2), 14(1) | 不論加害人有無過失，請求權人得依本法規定向保險人請求保險給付…／傷害醫療費用給付。失能給付。死亡給付。／保險人應於被保險人或請求權人交齊相關證明文件之次日起十個工作日內給付之／自知有損害發生及保險人時起，二年間不行使而消滅。自汽車交通事故發生時起，逾十年者，亦同。 |
| Insurer still pays but may recover from an insured who breached art. 21; right lapses after 2 years from payment; settlement impairing recourse without insurer consent does not bind insurer | arts. 29(1)(5), 29(2), 30 | 五、違反道路交通管理處罰條例第二十一條或第二十一條之一規定而駕車。／前項保險人之代位權，自保險人為保險給付之日起，二年間不行使而消滅。／…有妨礙保險人依前條規定代位行使請求權人對於被保險人之請求權，而未經保險人同意者，保險人不受其拘束。 |
| Police documents: party registration form at scene; scene diagram/photos after 7 days; preliminary analysis form after 30 days; online application for injury/death accidents with pickup at chosen station | National Police Agency FAQ (updated 114-10-15), https://www.npa.gov.tw/ch/app/faq/view?id=2144&module=faq&serno=A1084129 | （二）於事故7日後得申請閱覽或提供「現場圖」、「現場照片」。（三）於事故30日後得申請提供「道路交通事故初步分析研判表」。… 並可指定就近分局或交通（大）隊取件 |
| Negligent injury penalties; complaint-based; complaint within 6 months | Criminal Code 刑法 arts. 284, 287 (C0000001); Code of Criminal Procedure 刑事訴訟法 art. 237 (C0010001) | 因過失傷害人者，處一年以下有期徒刑、拘役或十萬元以下罰金；致重傷者，處三年以下有期徒刑、拘役或三十萬元以下罰金。／須告訴乃論。／告訴乃論之罪，其告訴應自得為告訴之人知悉犯人之時起，於六個月內為之。 |
| Driver of a motor vehicle in use is liable unless due care taken; medical/earning-capacity loss; non-pecuniary damages; 2-year / 10-year limitation | Civil Code 民法 arts. 191-2, 193, 195, 197 (B0000001; banner concerns art. 166-1 and art. 1223 only) | 汽車、機車或其他非依軌道行駛之動力車輛，在使用中加損害於他人者，駕駛人應賠償因此所生之損害。但於防止損害之發生，已盡相當之注意者，不在此限。／自請求權人知有損害及賠償義務人時起，二年間不行使而消滅，自有侵權行為時起，逾十年者亦同。 |
| Exit restriction: strong suspicion plus one of three conditions; proviso for offences punishable only by detention or fine; change may be applied for | Code of Criminal Procedure arts. 93-2, 93-5 | 被告犯罪嫌疑重大，而有下列各款情形之一者，必要時檢察官或法官得逕行限制出境、出海。但所犯係最重本刑為拘役或專科罰金之案件，不得逕行限制之：一、無一定之住、居所者。二、有相當理由足認有逃亡之虞者。三、有相當理由足認有湮滅、偽造、變造證據或勾串共犯或證人之虞者。／被告及其辯護人得向檢察官或法院聲請撤銷或變更限制出境、出海。 |

### First-two-paragraph deletion test
Paragraph 1 sentence 1 (invented student, flight Friday, collision in Taichung; flagged "contoh rekaan" in the sentence): kept; it fixes the facts every later section uses. Sentence 2 ("Polis sudah mencatat kejadian itu."): kept; it establishes that a police record exists, which the document-timing section relies on.
Paragraph 2: the lead-in "Tiga soalan menunggu." was cut (no information); the three questions kept, they are the reader's actual questions and the sections answer them in order.

### Comparison with three existing ms columns (003, 012, 011) and what changed
- 003 is a Q1–Q10 FAQ-style column and opens with a general instruction to secure safety; 012 is a short liability explanation. 809 opens with an invented scene (flagged inside the sentence, not in the banned stock-formula form), uses four headings that name its own issues, and does not repeat scene-safety steps.
- 003 ends with a generic compensation reminder; 809 ends on three dates tied to the opening example (day 7, day 30, six months).
- Opening types across the three new articles differ: 807 fact/misconception, 808 reader question, 809 invented scene.

### Dropped (could not verify)
- Whether a Malaysian licence or IDP is accepted in Taiwan, for how long, and whether Malaysia is on the reciprocity list. Highway Bureau pages (thb.gov.tw cp.aspx?n=302, news download, tpcmv pages) return an Imperva/hCaptcha block; the ledger records the same failure (S04, S24). I did not attempt to bypass the CAPTCHA. A 2011 Sarawak government release (found by search) says Malaysia and Taiwan agreed to licence conversion on reciprocity from 1 Nov 2011; it is not an official Taiwanese source and may be outdated, so it is not used. The article states the legal framework and tells the reader to check the list.
- The "30 days" IDP rule is stated only as the rule for IDPs from reciprocal countries, not as applying to Malaysia.
- Highway Bureau name: the site title in search results is 公路局; I used that. Some pages call it 公路總局; not resolved.
- Scene-safety and evidence steps (covered in ms 003); property-damage-only accidents; the Special Compensation Fund for uninsured/hit-and-run vehicles (not verified against facts of the example, left out).
- Whether a rider injured in a one-vehicle accident is covered by his own compulsory policy: not stated.

---------------------------------------------------------------------

## Cross-article notes
- All inline statute links use `https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=<PCODE>&flno=<ARTICLE>`; I programmatically checked that every linked article number exists on the fetched `LawAll` page for its pcode (55 links, 0 missing) and that the other official links return HTTP 200 on 24 Oct 2026; internal links (`/ms/columns/...`, `/ms/contact`) exist in `columns-ms`.
- No phone numbers or addresses; contact paragraph follows the brief (email, contact page, language arrangement agreed first, non-sensitive first email, conflict-check name, no ID/bank/full documents, no lawyer–client relationship from an email).
- No claim of lawyer review or native-speaker review. Malay was model-written for Malaysian usage (kerja sambilan, tertanggung, pendakwa raya, Kanun Tatacara Jenayah, anak guam); no human Malay review.
- Pending statutory amendments encountered: Road Traffic Management and Penalty Act (115-08-17 amendment of arts. 21, 21-1, 35, 67, 73, 85-2, 85-3 not yet in force; the in-force art. 21 was compared via the old-versions page and the fine in para. 1 is the same in both); Highway Act and Trademark Act carry banners for provisions the articles do not cite; Income Tax Act banner concerns art. 43-4 only.
