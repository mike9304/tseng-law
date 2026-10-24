# ne repair, round 1 (response to reviews/codex-ne-r1.md)

Checked 24 October 2026. Every MUST was re-read against the current statute text with `python3 tools/law.py <PCODE> <art>`. All five MUSTs and one SHOULD are ACCEPTED; none is rebutted. Only drafts/ne/*.md and this file were edited. Frontmatter still parses (ruby YAML), no bold, body links and Sources lists still match one-to-one, and FAQ/summary were checked for conflicts (none: neither repeats the corrected sentences).

## 819

### M1 ACCEPTED: language-teaching exemption was broadened
Statute (Permit Regs Art. 51 para 2, pcode N0090027): 具語文專長，且有下列情形之一，並經教育部專案核准：（一）入學後於各大專校院附設語文中心或外國在華文教機構附設之語文中心兼任外國語文教師。（二）入學後協助各級學校語文專長相關教學活動。 The reviewer is right: my sentence dropped the two settings and "after enrolment".
- Old: "दुई, भाषा विशेषज्ञता भएको विद्यार्थीले शिक्षा मन्त्रालयको विशेष स्वीकृतिसहित भाषा शिक्षणमा संलग्न हुँदा।"
- New: "दुई, भाषा विशेषज्ञता भएको विद्यार्थीले भर्नापछि कलेज वा विश्वविद्यालयको भाषा केन्द्र वा ताइवानस्थित विदेशी सांस्कृतिक–शैक्षिक संस्थाको भाषा केन्द्रमा अंशकालीन विदेशी भाषा शिक्षकका रूपमा काम गर्दा, वा कुनै तहको विद्यालयमा आफ्नो भाषा विशेषज्ञतासँग सम्बन्धित शिक्षण गतिविधिमा सहयोग गर्दा, शिक्षा मन्त्रालयको विशेष स्वीकृति भए यो छुट लाग्छ।" (reviewer's wording, adopted unchanged)
- FAQ 1 only says the two exemptions in para 2 are free of the para 1 conditions; still true, not changed.

### S1 ACCEPTED (small, with the supporting provision named): who applies
Statute: Permit Regs Art. 2 para 1 item 4 第四類外國人：指依本法第五十條第一款或第二款規定從事工作之外國人 and Art. 53 第四類外國人申請工作許可，應備下列文件：一、申請書。二、審查費收據正本。三、其他經中央主管機關規定之文件。 So the applicant under Art. 53 is the student. The WDA student page also says students apply "入學後即可向機關申請".
- Old: "आवेदनमा फारम, शुल्कको रसिद र एजेन्सीले तोकेका अन्य कागजात लाग्छ ([धारा 53](…))।"
- New: "[नियमावलीको धारा 2](…flno=2) अनुसार चौथो वर्गका विदेशी भनेका ऐनको धारा 50 अन्तर्गत काम गर्ने विद्यार्थी हुन्, र [धारा 53](…) मा कार्य अनुमतिको आवेदक तिनै हुन्; अर्थात् विद्यार्थीले आफैँ आवेदन दिन्छन्। आवेदनमा फारम, शुल्कको रसिद र एजेन्सीले तोकेका अन्य कागजात लाग्छ।" Art. 53 link retained; Art. 2 link added to the body and to Sources.

### S2 (scope note, no text change requested)
Acknowledged. On reproducibility of the style check: with the same installation, `python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <file> --lang hi` runs here (python3 3.14.5 at /opt/homebrew/bin) and prints "OK — no variety limit violated" for all three files after this repair (819 cv=0.54 short=0.17; 820 cv=0.66 short=0.12; 821 cv=0.50 short=0.10). Without `--lang` it stops with "cannot infer language", as the reviewer observed. `hi` is only a Devanagari approximation because there is no `ne` profile; I did not claim more than that and the Nepali has no native-speaker review.

## 820

### M1 ACCEPTED: missing experience exemption in Foreign Professionals Act Art. 6
Statute (A0030295, flno=6): 外國人取得國內外大學之碩士以上學位，或教育部公告世界大學排名前一千五百名大學之學士以上學位者，受聘僱在我國從事就業服務法第四十六條第一項第一款專門性或技術性工作，除應取得執業資格、符合一定執業方式及條件者，及應符合中央目的事業主管機關所定之法令規定外，無須具備一定期間工作經驗。 Commencement checked in the law database history (https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=A0030295): 其餘條文，定自一百十五年一月一日施行 (only Art. 4 item 4 sub-item 4 latter part, Arts. 28 and 29 start 2026-06-30), so Art. 6 is in force since 1 January 2026.
- Old: the paragraph ended after the four Std. Art. 5 alternatives ("…वा तालिम वा स्वअध्ययनबाट 5 वर्ष वा बढी अनुभव र विशेष उपलब्धि।").
- New (appended): "तर [विदेशी पेशाकर्मी भर्ना तथा रोजगार ऐनको धारा 6](…flno=6) (2026 जनवरी 1 देखि लागू; [लागू मितिको इतिहास](…LawHistory…)) अनुसार ताइवान वा विदेशका विश्वविद्यालयबाट स्नातकोत्तर वा माथिको डिग्री, वा शिक्षा मन्त्रालयले घोषणा गरेको विश्वका पहिलो 1,500 विश्वविद्यालयमध्ये कुनैबाट स्नातक वा माथिको डिग्री पाएकालाई यस्तो पेशागत वा प्राविधिक काम गर्न निश्चित अवधिको कार्य अनुभव चाहिँदैन। पेशागत इजाजत, काम गर्ने तरिका तथा अन्य कानुनी शर्त भने पूरा गर्नुपर्छ।" The four general alternatives were kept. I did not add any statement about whether Art. 6 also lifts the "related department" wording of Std. Art. 5 item 2, because Art. 6 speaks only of work-experience periods.
- Sources: Art. 6 added next to Art. 12, plus the law-history page for the commencement date. FAQ and summary do not discuss the employer route, so no change.

### M2 ACCEPTED: "18 वर्ष नाघेका" excluded age 18
Statute (D0080129, Art. 11 para 1): 本人、其原經許可居留之配偶、未滿十八歲子女及年滿十八歲因身心障礙無法自理生活之子女. 年滿十八歲 includes age 18.
- Old: "…स्वतन्त्र जीवन चलाउन नसक्ने 18 वर्ष नाघेका सन्तान पनि यसमा पर्छन्।"
- New: "…स्वतन्त्र जीवन चलाउन नसक्ने 18 वर्ष पुगेका वा सोभन्दा माथिका सन्तान पनि यसमा पर्छन्।" The disability condition and "already permitted to reside" wording are kept.

## 821

### M1 ACCEPTED: NT$100,000,000 boundary
Statute (G0380131, Art. 19 para 1): 處三年以上十年以下有期徒刑，併科新臺幣一億元以下罰金。其洗錢之財物或財產上利益未達新臺幣一億元者，處六月以上五年以下有期徒刑，併科新臺幣五千萬元以下罰金。 Lower range only below NT$100,000,000; exactly that sum is the higher range; both fines are concurrent (併科).
- Old: "…NT$100,000,000 भन्दा कम भए 6 महिनादेखि 5 वर्षसम्म कैद र NT$50,000,000 सम्म जरिवाना सँगै हुन्छ। त्यसभन्दा बढी भए 3 देखि 10 वर्षसम्म कैद र NT$100,000,000 सम्म जरिवाना।"
- New: "…NT$100,000,000 भन्दा कम भए 6 महिनादेखि 5 वर्षसम्म कैद र NT$50,000,000 सम्म जरिवाना सँगै हुन्छ। रकम NT$100,000,000 वा बढी भए 3 देखि 10 वर्षसम्म कैद र NT$100,000,000 सम्म जरिवाना सँगै हुन्छ।"

### M2 ACCEPTED: lawful notification prerequisite in CCP Art. 71-1
Statute (C0010001, Art. 71-1 para 1): 經合法通知，無正當理由不到場者，得報請檢察官核發拘票。 "報請" is a report/request to the prosecutor, and the power is discretionary (得).
- Old: "उचित कारणबिना उपस्थित नभए प्रहरीले अभियोजकसँग पक्राउ पुर्जी (拘票) माग्न सक्छ।"
- New: "कानुनबमोजिम सूचना दिइएपछि उचित कारणबिना उपस्थित नभए प्रहरीले अभियोजकसँग पक्राउ पुर्जी (拘票) जारी गर्न अनुरोध गर्न सक्छ।" (I used "दिइएपछि" instead of the reviewer's "दिइएको भए पनि", which reads as a concession.)

### M3 ACCEPTED: CCP Art. 93-2 alternatives and exception
Statute (C0010001, Art. 93-2 para 1): 被告犯罪嫌疑重大，而有下列各款情形之一者，必要時檢察官或法官得逕行限制出境、出海。但所犯係最重本刑為拘役或專科罰金之案件，不得逕行限制之：一、無一定之住、居所者。二、有相當理由足認有逃亡之虞者。三、有相當理由足認有湮滅、偽造、變造證據或勾串共犯或證人之虞者。 Item 3 is destruction, forgery or alteration of evidence OR collusion with co-offenders or witnesses; my "नष्ट गर्ने तथा … मिलेर बयान बनाउने" turned alternatives into a conjunction and added "बयान बनाउने". The exception for offences whose heaviest penalty is detention or fine-only was also missing.
- Old: "संदेह गम्भीर भएको र तल लेखिएमध्ये कुनै एक अवस्था भएमा, आवश्यक ठानेमा, … सक्छन्: निश्चित बासस्थान नभएको, भाग्ने पर्याप्त कारण भएको, वा प्रमाण नष्ट गर्ने तथा सहअभियुक्त वा साक्षीसँग मिलेर बयान बनाउने डर भएको।"
- New: "अपराध गरेको गम्भीर शंका हुनुका साथै निश्चित बसोबास नहुनु, भाग्ने जोखिम छ भन्ने पर्याप्त आधार हुनु, वा प्रमाण नष्ट गर्ने, किर्ते गर्ने वा फेरबदल गर्ने अथवा सहअभियुक्त वा साक्षीसँग मिलेमतो गर्ने जोखिम छ भन्ने पर्याप्त आधार हुनु—यीमध्ये कुनै एक अवस्था भए आवश्यकताअनुसार अभियोजक वा न्यायाधीशले विदेश जान रोक (限制出境) लगाउन सक्छन्। अधिकतम मूल सजाय थुना (拘役) हुने वा केवल जरिवाना हुने मुद्दामा यस्तो प्रत्यक्ष रोक लगाउन मिल्दैन।" (reviewer's wording, adopted)

### M4 ACCEPTED: notice rule of CCP Art. 93-2 para 3
Statute (Art. 93-2 para 3): 除被告住、居所不明而不能通知者外，前項書面至遲應於為限制出境、出海後六個月內通知。但於通知前已訊問被告者，應當庭告知，並付與前項之書面。 (para 2 lists the contents: reasons and period, executing agency, remedy.)
- Old: "रोकिएपछि बढीमा छ महिनाभित्र कारण, अवधि र असन्तुष्टि जनाउने उपाय लेखिएको लिखित सूचना दिनुपर्छ।"
- New: "ठेगाना अज्ञात भएर सूचना दिन नसकिने अवस्थाबाहेक, कारण, अवधि र असन्तुष्टि जनाउने उपायसहितको लिखित सूचना रोक लगाएको छ महिनाभित्र दिनुपर्छ। तर त्यसअघि अभियोजक वा न्यायाधीशले अभियुक्तसँग सोधपुछ गरेमा सोही बेला रोकबारे बताएर त्यो लिखित सूचना दिनुपर्छ।" FAQ and summary of 821 do not mention Art. 93-2, so no change.

## After the repair
Body length (Nepali words before Sources): 819 about 782, 820 about 820, 821 about 876, all inside the 650-950 range. These replace the counts in work/ne-author.md. The claim tables in that file are otherwise unchanged. New table rows implied by this repair: Permit Regs Art. 2 and Art. 51(2) (819), Foreign Professionals Act Art. 6 with its commencement history (820), Residence Regs Art. 11 age wording (820), MLCA Art. 19 boundary (821), CCP Arts. 71-1 and 93-2 paras 1-3 (821), all quoted above.
