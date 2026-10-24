# km author work note (Khmer, Cambodia) — 24 October 2026

Files (all in `drafts/km/`):

- `813-cambodian-spouse-marry-taiwanese-interview-list-registration.md` (L-MARRY)
- `814-cambodian-wife-divorce-taiwanese-husband-arc-children.md` (L-DIVORCE)
- `815-cambodian-widow-taiwanese-husband-death-inheritance-arc.md` (L-HEIR)

Images (IMAGE-MENU, one per article, none reused): 813 = I24 (marriage), 814 = I25 (divorce), 815 = I26 (inheritance documents). Alt text is a Khmer translation of the menu description; caption is the Khmer translation of the required caption pattern.

Limits of this work: the Khmer was drafted by an AI model and has not had native-speaker or lawyer review (the articles say nothing of the kind). `variety_metrics.py` does not support `km` (argparse rejects it), so the variety self-check below is manual. Spelling follows standard Khmer orthography (coeng-ta, e.g. ប្តី, សេចក្តី); the legacy km columns use coeng-da (ប្ដី, សេចក្ដី), which is a visual-variant difference only. Statute and institution names follow the legacy km columns where they exist (ក្រមរដ្ឋប្បវេណី, ច្បាប់បញ្ជីគ្រួសារ (戶籍法), ការិយាល័យបញ្ជីគ្រួសារ (戶政事務所), ច្បាប់ស្តីពីការអនុវត្តច្បាប់រដ្ឋប្បវេណីមានធាតុអន្តរជាតិ).

## Topic adjustment decided in this note (813)

ASSIGNMENTS recommended L-MARRY as "interview at the Taiwan office (if your country is on the list)". Checking the list showed the premise is out of date for Cambodia:

- BOCA, 特定國家配偶申請來臺依親手續說明, revised 115年8月24日 (https://www.boca.gov.tw/dl-5210-6c88eaff0b5449078bfca7b720878eb0.html): the 駐胡志明市辦事處 row reads 「越南蜆港以南地區」 only; the string 柬 does not occur anywhere in the PDF (pdftotext, 0 hits).
- The 107-12-10, 111-10-26 and 113-01-01 versions of the same document (copies on roc-taiwan.org) read 「駐胡志明市辦事處 越南蜆港以南地區、柬埔寨」.
- Yunlin County Huwei household registration office notice (publisher 虎尾戶政, citing MOI letter 台內戶字第1140251264號 of 114-05-26): 「自113年5月15日起，將「烏克蘭」、「柬埔寨」及「蒙古」3國自特定國家名單移除。其中「柬埔寨」先行試辦1年至114年5月14日…同意自114年5月22日起將柬國自「結婚依親境外人士面談特定國家名單」正式移除。」 (https://huweihousehold.yunlin.gov.tw/News_Content.aspx?n=18286&s=541907). The same MOI letter exists as `research/raw/marriage-removal-letter.pdf`; `research/country-facts.md` (rows S39, S48) independently reaches the same result.

So 813 is written as "the interview list no longer names Cambodia; what still applies is registration in Taiwan and the spouse visa", which is the question a Cambodian reader will actually meet when old guides say "go to Ho Chi Minh City".

## Article 813 — marrying a Taiwanese national

Reader and trigger: a Cambodian man or woman, or the Cambodian family, planning to marry a Taiwanese national and holding a guide, agent's advice or relative's story that says an interview in Ho Chi Minh City is compulsory.

Why this fits Cambodia (evidence): the Taiwanese list named Cambodia (served by the Ho Chi Minh City office) from at least the 2018 version until 2024 (three archived versions above), and was changed in 2024/2025; BOCA's country page says the Ho Chi Minh City office 「兼理柬埔寨」. Hypothesis (labelled): Cambodian spouses are the main readers searching this topic; no population figure is used.

Overlap and new angle: km 007 and 016 cover divorce and inheritance only; no existing km column covers marriage. English 022 is US-specific (affidavit/AIT); this column is built on the Cambodia-specific list history, the Ho Chi Minh City jurisdiction, the 2017 MOI note on Cambodian marital-status papers, and the 1 August 2026 withdrawal of Cambodian TAC/visa facilitation.

Claim → source table

| Claim in article | Source | Chinese text checked |
|---|---|---|
| Interview-country list revised 24 Aug 2026; Cambodia absent; Thailand, Indonesia, Philippines, Myanmar, Vietnam named | BOCA PDF dl-5210 | 「修訂日期：115年8月24日」「駐越南代表處 越南蜆港以北地區 駐胡志明市辦事處 越南蜆港以南地區 駐菲律賓代表處 菲律賓 駐緬甸代表處 緬甸」 |
| Version of 1 Jan 2024 listed Cambodia under the HCMC office | roc-taiwan.org PDF (sites/171) | 「修訂日期：113年1月1日」「駐胡志明市辦事處 越南蜆港以南地區、柬埔寨」 |
| Trial removal from 15 May 2024, formal removal 22 May 2025 | Yunlin Huwei household office notice | quoted above |
| MOFA sets and revises the list (point 2); documents/attendance duty for listed-country nationals (point 3) | BOCA 面談作業要點 | 2: 「外交部得衡酌國家利益…訂定特定國家名單及指定面談地點，並適時檢討修正」 3: 「特定國家國民與我國國民以結婚為由申請文件證明及來臺簽證者，應先檢附下列文件向我駐該國館處或指定地點登記安排面談」 |
| Missions may ask case by case for financial proof, purpose proof, guarantor letters or other documents | BOCA PDF dl-5210, (三)2 | 「駐外館處得視個案要求當事人提供財力證明、來臺目的證明、在臺關係人保證書或其他審核所需之文件」 |
| HCMC office covers Cambodia consular affairs | BOCA 駐館位置 (sp-foof-countrycp-02-9-6b662-1) | 「領務轄區越南南部地區(峴港以南)，兼理柬埔寨」 |
| Marriage: written, ≥2 witnesses, both parties register | Civil Code 982 | 「結婚應以書面為之，有二人以上證人之簽名，並應由雙方當事人向戶政機關為結婚之登記」 |
| Marriage must be registered; both parties apply (principle) | Household Registration Act 9, 33 | 9: 「結婚，應為結婚登記」 33: 「結婚登記，以雙方當事人為申請人。但於…九十七年五月二十二日以前…得以當事人之一方為申請人」 |
| Marriage concluded abroad: verified certificate; 「符合行為地法」 endorsement lets marital-status proof be omitted; otherwise verified status proof valid 6 months; Chinese-name declaration; verified/notarised Chinese translation | MOI 結婚登記須知 (ris 383) | 「加註「符合行為地法」字樣者，並得免附婚姻狀況證明文件」「婚姻狀況證明文件於原核發機關核發之日起6個月內有效」「外籍配偶取用中文姓名聲明書」「應另檢附經駐外館處驗證或國內公證人認證之中文譯本」 |
| Formation requirements follow each party's national law; form valid under either national law or place of celebration | Choice of Law Act 46 | 「婚姻之成立，依各該當事人之本國法。但結婚之方式依當事人一方之本國法或依舉行地法者，亦為有效」 |
| 2017 MOI instruction: non-standard documents (family-member certificate) may replace a Cambodian single-status certificate | MOI 106.09.22 台內戶字第10612034661號 (laws.gov.taipei FE302996) | 「如柬國人士無法取得辦理我國相關戶籍登記所需之柬國單身證明者，得以柬國戶籍證明書、家庭成員證明書或戶口證明書等非制式、載有婚姻狀況證明之文件代之」 (article tells the reader it is 9 years old and to ask whether it still applies) |
| Spouse visa documents (passport ≥6 months with blank pages, health check ≤3 months, police clearance ≤1 year, marriage certificate, household record ≤3 months) | BOCA cp-402-179 (updated 2026-06-09) | 「護照效期須為六個月以上且有空白頁」「最近3個月內…健康檢查合格證明」「申請人本國政府1年內所核發之無犯罪證明」「最近3個月內中華民國台灣地區新式戶口名簿或全戶戶籍謄本正本 已有結婚登記並載明外籍配偶之國籍及外文姓名」 |
| ARC application within 30 days of entry | same | 「應於入境次日或居留簽證簽發日起30日內，向居留地之內政部移民署各縣（市）服務站申請外僑居留證及重入國許可」 |
| Visa may be refused without reasons, fee not refunded | same | 「有權拒發簽證且無須說明原因，申請人所繳之簽證規費亦不退還」 |
| P-coded non-extendable visitor visa cannot be switched in Taiwan; landing-visa/visa-exempt entrants not covered | same | 「申請人持憑簽證註記代碼「P（觀光/探親/訪問）」事由不可延期之停留簽證入境者，不得在臺改辦居留簽證」「以落地簽證或免簽證方式入境者…均不適用」 |
| Residence for spouse of a national: stay ≥60 days, no non-extension restriction | Immigration Act 23(1) head and item 1 | 「持停留期限在六十日以上，且未經簽證核發機關加註限制不准延期或其他限制之有效簽證入國之外國人…一、配偶為現在在臺灣地區居住且設有戶籍…之我國國民」 |
| From 1 Aug 2026 TAC and 「觀宏專案」 stop for Cambodians; visa needed | MOFA press release no. 330, 2026-07-17 | 「決定自今（2026）年8月1日起停止目前柬埔寨國民適用有條件式免簽（TAC）及「觀宏專案」等各項入境我國的便利措施」「未來擬來台的柬國民眾均須向我國駐外館處申辦適當簽證」 |
| TAC approved before the date remains usable on inspection | NIA niaspeedy nia_southeast | 「若於115年8月1日以前申獲核准者仍可持憑有效核准證明及相關應備文件，經本署查驗許可後入境」 (EN page says "before or on August 1, 2026"; article says "before the date" without choosing a boundary day) |

First-two-paragraph deletion test (813):
- P1 sentence 1 (list revised 24 Aug 2026): kept, it is the answer.
- P1 sentence 2 (who publishes, countries named, no Cambodia): kept; deleting loses the finding.
- P2 sentence 1 (Jan 2024 version had Cambodia): kept; shows the change.
- P2 sentence 2 (trial 2024, formal 2025, with source): kept; gives dates.
- P2 sentence 3 (old guides): kept; tells the reader what to discount.
- P2 sentence 4 (「សូមមើលថ្ងៃកែ មុនជឿ」): deletable without losing a fact; kept as the one-line action for old guides and as a short sentence for rhythm.

## Article 814 — divorce from a Taiwanese husband

Reader and trigger: a Cambodian wife in Taiwan whose husband (or she) proposes divorce, holding a spouse-based ARC and often a minor child; she is handed a Chinese-language agreement and wonders what happens to her stay.

Why this fits Cambodia: the Cambodian-Taiwanese couple has no common nationality, so Choice of Law Act 50 turns on common domicile; the residence question is the practical fear. Labelled hypothesis: marriage-migrant wives are the typical reader; no statistic used.

Overlap and new angle: km 007 is a long general divorce Q&A (routes, property, custody). This column keeps to what changes for a foreign spouse: when the divorce takes effect, the legal basis of the ARC (Immigration Act 31(4)), child-based continued residence and naturalisation, and the money questions that depend on judgment vs agreement. It links to 007 for the general procedure.

Claim → source table

| Claim | Source | Chinese text checked |
|---|---|---|
| Agreement divorce: written, ≥2 witnesses, registration | Civil Code 1050 | 「兩願離婚，應以書面為之，有二人以上證人之簽名並應向戶政機關為離婚之登記」 |
| Effective only on registration; both parties apply; representative with justified reason and office approval | MOI 離婚登記須知 (ris 384) | 「兩願離婚，應向戶政機關為離婚之登記，始生效力」「兩願離婚：雙方當事人。受委託人：有正當理由並經戶政事務所核准者，得以書面委託他人辦理」 |
| Court judgment/mediation divorce: one party may apply | Household Registration Act 34 | 「但經法院裁判離婚確定、調解或和解離婚成立或其他離婚已生效者，得以當事人之一方為申請人」 |
| Grounds for court divorce exist | Civil Code 1052 | para 1 items 1–10, para 2 「有前項以外之重大事由，難以維持婚姻者」 |
| Governing law for divorce: common national law, then common domicile, then closest connection, at agreement or filing | Choice of Law Act 50 | 「離婚及其效力，依協議時或起訴時夫妻共同之本國法；無共同之本國法時，依共同之住所地法；無共同之住所地法時，依與夫妻婚姻關係最切地之法律」 |
| Spouse ARC basis | Immigration Act 23(1)(1) | quoted under 813 |
| Reason disappears → permit revoked, ARC cancelled; listed exceptions "may" continue: (2) divorce due to domestic violence, not remarried; (3) after divorce, minor child with household registration in Taiwan, care/exercise of rights/visitation; (9) remarry same person within 30 days | Immigration Act 31 para 4 (paragraph numbering checked in the raw HTML: para 4 = revocation and items) | 「移民署對於外國人於居留期間內，居留原因消失者，廢止其居留許可，並註銷其外僑居留證。但有下列各款情形之一者，得准予繼續居留」「二、外國人為居住臺灣地區設有戶籍國民之配偶，因遭受家庭暴力離婚，且未再婚」「三、外國人於離婚後對在臺灣地區已設有戶籍未成年子女，有撫育事實、行使負擔權利義務或會面交往」「九、…於離婚後三十日內與原依親對象再婚」 |
| Custody by agreement; court decides absent agreement; court may change agreement unfavourable to child; court sets visitation | Civil Code 1055 | paras 1, 2, 5 |
| Best-interests factors incl. age/health/wishes, parents' economic capacity (one factor), bonds, obstruction, cultural customs | Civil Code 1055-1 | items 1–7 |
| Naturalisation of parent of Taiwanese minor child: 183 days a year for 3 years plus Art. 3 items 2–5 | Nationality Act 4(1)(3), 3(1) | 「具備前條第一項第二款至第五款要件，於中華民國領域內，每年合計有一百八十三日以上合法居留之事實繼續三年以上…三、對無行為能力、或限制行為能力之中華民國國籍子女，有扶養事實、行使負擔權利義務或會面交往」 |
| Alimony only for judgment divorce, no-fault spouse in hardship | Civil Code 1057 | 「夫妻無過失之一方，因判決離婚而陷於生活困難者，他方縱無過失，亦應給與相當之贍養費」 |
| Surplus-property claim: equal split of difference after debts; exclusions; court adjustment; 2-year/5-year limits | Civil Code 1030-1 | paras 1, 2, 5 |
| Property regime law: written choice, then common nationality, domicile, closest; immovables may follow lex situs | Choice of Law Act 48 | paras 1–3 |

First-two-paragraph deletion test (814): the opening has two sentences. Sentence 1 (the reader's question) carries the reader's concern; sentence 2 names the two statutes that answer it, so deleting either removes the map of the article; both kept. In the first section, 「ការចុះហត្ថលេខាតែមួយ មិនទាន់បញ្ចប់អាពាហ៍ពិពាហ៍ទេ」 restates the preceding sentence; kept only as the direct answer to the heading's question and as a short sentence.

## Article 815 — death of a Taiwanese husband

Reader and trigger: a Cambodian wife (in Taiwan or Cambodia) and children after the husband's death; relatives in Cambodia asking what must be done and by when.

Why this fits Cambodia: relatives in Cambodia now need a visa to come (MOFA no. 330, from 1 Aug 2026); the deadlines run from different dates; the Land Act has special rules for foreign heirs. Labelled hypothesis: the surviving wife is the typical reader.

Overlap and new angle: km 016 is a general, long guide to inheritance and parental rights; 815 is a deadline-ordered guide for a foreign widow: death registration (30 days), who inherits, renunciation/inventory (3 months), land and estate tax (6 months), her ARC and naturalisation basis. It links to 016.

Claim → source table

| Claim | Source | Chinese text checked |
|---|---|---|
| Death registration: spouse/relatives may apply; 30 days; late filing still accepted | Household Registration Act 36, 48 | 36: 「死亡登記，以配偶、親屬、戶長、同居人、經理殮葬之人…為申請人」 48: 「戶籍登記之申請，應於事件發生或確定後三十日內為之」「逾期者，戶政事務所仍應受理」 |
| Visa for Cambodian relatives from 1 Aug 2026; earlier-approved TAC | MOFA no. 330; NIA | quoted under 813 |
| Inheritance follows decedent's national law at death | Choice of Law Act 58 | 「繼承，依被繼承人死亡時之本國法」 |
| Orders of heirs other than spouse; spouse's shares | Civil Code 1138, 1144 | 1138: 「除配偶外，依左列順序定之：一、直系血親卑親屬。二、父母。三、兄弟姊妹。四、祖父母」 1144 items 1–4 (equal share / 1/2 / 2/3 / all) |
| Hypothetical wife + 2 children = 1/3 each (labelled hypothetical in the sentence) | Civil Code 1141, 1144(1) | 「按人數平均繼承」「與…第一順序之繼承人同為繼承時，其應繼分與他繼承人平均」 |
| Surviving spouse's separate surplus-property claim, 2-year/5-year limits (conditional on Taiwan law governing the regime) | Civil Code 1030-1 para 5; Choice of Law Act 48 | 「二年間不行使而消滅。自法定財產制關係消滅時起，逾五年者，亦同」 |
| Renunciation: within 3 months of knowing, in writing to the court; notify next heirs; retroactive; no extension stated | Civil Code 1174, 1175 | 「應於知悉其得繼承之時起三個月內，以書面向法院為之」「拋棄繼承後，應以書面通知因其拋棄而應為繼承之人。但不能通知者，不在此限」「溯及於繼承開始時發生效力」 (the "no extension" sentence is a description of the text, which contains none) |
| Court: decedent's domicile | Family Act 127 | 「關於拋棄繼承事件」「專屬繼承開始時被繼承人住所地法院管轄」 |
| Liability limited to inherited estate; lost for serious concealment etc.; inventory within 3 months, extendable | Civil Code 1148(2), 1163, 1156 | 「以因繼承所得遺產為限，負清償責任」「隱匿遺產情節重大」「在遺產清冊為虛偽之記載情節重大」「意圖詐害被繼承人之債權人之權利而為遺產之處分」「三個月內開具遺產清冊陳報法院」「法院因繼承人之聲請，認為必要時，得延展之」 |
| Parents as legal representatives; special agent on conflict | Civil Code 1086 | 「父母之行為與未成年子女之利益相反，依法不得代理時，法院得…為子女選任特別代理人」 (the application to mother/child estate division is phrased as a question to ask, not a conclusion) |
| Land inheritance registration by any heir for all within 6 months from opening; does not affect others' renunciation; late fine 1x per month up to 20x | Land Act 73 | 「得由任何繼承人為全體繼承人聲請之。但其聲請，不影響他繼承人拋棄繼承或限定繼承之權利」「得自繼承開始之日起，六個月內為之。聲請逾期者，每逾一個月得處應納登記費額一倍之罰鍰。但最高不得超過二十倍」 |
| Foreign heirs: listed land types acquired by inheritance must be sold to nationals within 3 years after registration; other land under Arts. 18–20 | Land Act 17(2) | 「前項移轉，不包括因繼承而取得土地。但應於辦理繼承登記完畢之日起三年內出售與本國人」 |
| Estate tax return within 6 months of the day after death, at the tax office of household registration; extension by written application before deadline, up to 3 months, longer for force majeure/special reasons | Estate and Gift Tax Act 23, 26 | 23: 「納稅義務人應於被繼承人死亡之次日起算六個月內，向戶籍所在地主管稽徵機關辦理遺產稅申報」 26: 「應於本法規定申報期限屆滿前，以書面申請延長之」「申請延長期限以三個月為限。但因不可抗力或其他有特殊之事由者，得由稽徵機關視實際情形核定之」 |
| Continued residence after death of the person relied on ("may") | Immigration Act 31 para 4 item 1 | 「一、因依親對象死亡」 |
| Surviving spouse of a household-registered national with minor child registered in Taiwan may apply for residence; may apply for permanent residence without the para-1 residence period | Immigration Act 23(1)(9), 25 para 11 (paragraph numbering checked in raw HTML) | 23: 「九、配偶死亡時為居住臺灣地區設有戶籍國民，並對在臺灣地區已設有戶籍未成年子女，有撫育事實、行使負擔權利義務或會面交往」 25: 「外國人有第二十三條第一項第九款規定情形者，得於在我國合法居留期間，向移民署申請永久居留，不適用第一項有關在我國合法居留期間之規定」 |
| Naturalisation of a widowed spouse: 3 years × 183 days; not remarried; contact with deceased's relatives unless marriage ≥2 years | Nationality Act 4(1)(2) | 「其配偶死亡後未再婚且有事實足認與其亡故配偶之親屬仍有往來，但與其亡故配偶婚姻關係已存續二年以上者，不受與親屬仍有往來之限制」 |

First-two-paragraph deletion test (815): P1 sentence 1 (three deadlines) and sentence 2 (only the 3-month period counts from knowledge) kept: each carries a distinct fact. P2 sentence 1 (「ដំបូងគេគឺការចុះបញ្ជីមរណភាព」) is a connector with no new fact and is deletable; kept as a short sentence that opens the first deadline. P2 sentences 2–3 (registration rule and visa) each carry a source-backed fact.

## Law-version and date checks (as of 24 October 2026)

- `tools/law.py` prints the not-yet-in-force banner for the Civil Code (an amendment to Art. 1223, promulgated 2026-08-17, takes effect six months after promulgation). No Civil Code article cited here is 1223; the reserved portion (特留分) is not discussed.
- Estate and Gift Tax Act shows 修正日期 115-09-11 and its Art. 6 mentions an amendment of 115-08-21; no not-yet-in-force banner. Only Arts. 23 and 26 are cited and their text was read on 24 Oct 2026; other recently amended provisions (e.g., spouse-related rules in Art. 6) are not relied on.
- Immigration Act (last amended 2023-06-28), Nationality Act (2024-05-24), Land Act (2024-08-07), Family Act (2023-06-21): no banner.
- Household Registration Act pcode is D0030006 and Nationality Act D0030001; both confirmed by title from `tools/law.py`.

## Comparison with three existing km columns (008, 014, 016; 009 also read)

- Openings: 008/009/014/016 start by repeating the title's topic ("ដូចដែលនាងខ្ញុំបាននិយាយពីមុន…", a general frame paragraph). 813 opens with a dated fact (the list revision), 814 with the reader's question, 815 with the three deadlines as numbers. No stock hypothetical opener; no scene at all.
- Headings: 014/016 use numbered abstract headings ("1. … 8. …"), 008/009 none. 813: statement / noun-phrase headings; 814: one question heading then topic headings; 815: time-labelled headings. No numbering, no imperative headings.
- Endings: legacy columns end with an author line or a blockquote of internal links. Mine end with one contact paragraph (different wording in each) and then 「ប្រភព」; 815 ends the body on the one thing to keep (the message showing when the heir learned of the inheritance), 814 on keeping the agreement and its translation, 813 on keeping the list name/date and the office's written reply. No author footer, no summary paragraph.

## Counts and variety self-check (manual; `km` not supported by the tool)

| | Khmer characters in body (excl. URLs, Sources, frontmatter) | sentences | length CV (Khmer chars) | sentences ≤40 chars | similar-length triples (±25%) |
|---|---|---|---|---|---|
| 813 | 5,119 | 39 | 0.49 | 4 (10%) | 8 of 37 |
| 814 | 4,987 | 40 | 0.61 | 4 (10%) | 1 of 38 |
| 815 | 5,031 | 42 | 0.61 | 4 (10%) | 5 of 40 |

Whole files: 813 10.9k, 814 9.8k, 815 11.6k characters including links and Sources. Equivalent depth to the 700–900 English-word target is judged by claim count (each article carries 12–18 sourced claims), not by a character ratio. No bold, no H1, no author footer; 3–4 issue headings plus 「ប្រភព」; FAQ has 3 entries each; frontmatter fields in the brief's order; `audience: ["km"]`; date and read-time follow the legacy km pattern ("24 តុលា 2026", "អាន N នាទី"). Contrast frames (មិនមែន / មិនមានន័យថា): 813 ×1, 814 ×0, 815 ×3. Paragraphs begin with different words (no word starts two paragraphs in the same article).

Internal links: 813 → 814 and 815 (own slugs); 814 → km 007 `taiwan-divorce-lawsuit-qna` and 813; 815 → km 016 `taiwan-inheritance-custody-analysis` and 814. None of the Korean-reader columns (001, 004, 005, 006, 010) is linked. Every link in each body also appears in that article's 「ប្រភព」 list and vice versa (checked by script); all 44 distinct external URLs returned HTTP 200/206 on 24 Oct 2026.

## Statements dropped or not made because they could not be verified (or were stale / foreign law)

1. Any Cambodian-law requirement for marrying a foreigner (income threshold, age cap, recommendation letter, which ministry authenticates) — only found in an undated TECO Ho Chi Minh City announcement (taiwanembassy.org/vnsgn/post/1240) and in 2014–2017 MOJ letters; foreign law, possibly changed. The article says the Cambodian side follows Cambodian law and to ask Cambodian authorities.
2. The MOFA press release of 2005-08-24 that Cambodian marriage documents were "almost all forged" and that Cambodia did not authenticate marriage documents for Taiwanese — 21 years old; not used as current.
3. The Cambodian legal marriage age (MOI 2003 letter reproduced in the 旅外國人 notice) — old and foreign law.
4. Whether an individual Cambodian case can still be called to an interview or document scrutiny — the list says missions may ask for further documents case by case; whether interviews can still be scheduled for Cambodian nationals is not stated in any current official page; the article says to ask the Ho Chi Minh City office in writing.
5. How Cambodian documents are currently authenticated (route through Cambodia's ministry and the Cambodian consulate in Ho Chi Minh City, from a 2019 announcement now returning 404) — not stated.
6. Whether the 2017 MOI instruction on non-standard marital-status documents is still applied — stated only as a 2017 instruction, with a prompt to ask the office.
7. Land reciprocity for Cambodia: the research ledger records 非平等互惠 from a 2021 MOI table, but how reciprocity (Land Act 18) applies to land acquired by inheritance was not verified. The article therefore makes no claim about a Cambodian widow's right to inherit residential land; it cites only Art. 17 para 2 (listed land types, sell within 3 years) and says other land follows Arts. 18–20 and to ask the land office.
8. Cambodian rules on dual nationality / loss of Cambodian nationality for naturalisation (Nationality Act 9 requires a loss certificate within a year, with exceptions) — foreign law; omitted.
9. Whether ARC holders or spouses are exempt from the 1 Aug 2026 Cambodian visa measure — the press release is silent; the article does not claim an exemption (it mentions only the NIA statement about earlier-approved TAC).
10. Statistics on Cambodian spouses in Taiwan, success rates of interviews or timelines — none found in an official source; none used.
11. Immigration Act 23(1)(10) (former spouse with minor child) as an independent route — omitted from 814 because its head-of-paragraph visa condition makes the sentence hard to state exactly in a short column.
12. Compulsory portions (特留分) and wills in 815 — omitted (Art. 1223 amendment not yet in force; scope).
13. Death-registration documents, bank procedures and foreign-document authentication for heirs in Cambodia — no official source for Cambodia-specific steps was found; the article tells the reader to ask each office.
