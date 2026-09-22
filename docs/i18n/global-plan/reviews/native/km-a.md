# Khmer native review — part a (km)
reviewer: Grok 4.7 · date: 2026-09-22 · scope: docs/i18n/global-plan/reviews/native/input/km-guidance.txt; src/content/columns-km/001-taiwan-company-establishment-basics.md; 002-withdraw-capital-taiwan-company.md; 003-taiwan-traffic-accident-procedure.md; 004-taiwan-company-subsidiary-vs-branch.md; 005-taiwan-company-establishment-advanced-2.md; 006-taiwan-massage-history-law.md; 007-taiwan-divorce-lawsuit-qna.md; 008-taiwan-labor-severance-law.md; 009-taiwan-voluntary-resignation-severance.md

## Verdict
naturalness (1 = machine, 5 = native professional): 4/5 for guidance pack, 3/5 for columns
variety used: Standard Khmer (ភាសាខ្មែរស្តង់ដារ), one variety throughout. Orthography mixes ឱ with ឲ and coeng-ដ (្ដ) with coeng-ត (្ត). Guidance uses Khmer digits (៤, ៦); columns use Arabic digits and comma thousands (500,000), which Cambodian business writing accepts. Column dates are already day–month–year.

systemic patterns (max 6, each one line, with 1 example quote):
- ឧបត្ថម្ភ is used for “support” and for “local demand”, so a client reads financial patronage: "ដើម្បីឧបត្ថម្ភអតិថិជនក្នុងតំបន់"
- German template bones left in the Khmer: "ផ្នែកភាសាខ្មែរនេះ", "បញ្ជីទំព័រ", "ទទួលធ្វើជាក់ស្ដែង", "ក្នុងនីតិវិធីតែមួយ", "ឃ្លាំងវត្ថុ"
- "ប្រើមិនបានភាសា" calques “cannot use a language” through the contact page, the FAQ, and the form option
- Blog skeleton in 003 Q16–Q20, 005, 006, 008, and 009: one clause per line, blank spacers, "សួស្ដីលោកអ្នក នាងខ្ញុំគឺជា"
- Orthography is not held to one standard: "ពណ៌នាក្រុមនីមួយៗឲ្យលម្អិត" beside ឱ្យ, and "ឪពុកម្តាយ" / "ម្តងហើយម្តងទៀត" beside ្ដ
- Hangul source URLs remain in the frontmatter of 008 and 009; the 008 anecdote still has the Korean name blank "OOO"

Wei Tseng is មេធាវីស្ត្រី, លោកស្រី, និស្សិតស្រី, and នាងខ្ញុំ. លោកអ្នក is the reader. លោក B and លោក Lin are male third parties. No masculine form for her. The consultation lock stays negative and reads as intended: four languages only, no Khmer consultation, no interpreter, no reply-time promise, no free first meeting, no result guarantee. 001, 002, 004, and 007 are usable professional legal Khmer once the rows below are fixed. The Korea–Taiwan tax note in 001 and 004 is already limited to Korea. 003 Q1–Q15 matches that register; Q16–Q20 and 006, 008, 009 drop into blog lines. 005 is usable and already marked as a Korea bank example.

## Findings
| # | sev | cat | file | quote (≤120 chars, verbatim) | problem (English, one line) | suggested Khmer rewrite |
|---|-----|-----|------|------|------|------|
| 1 | P1 | A | km-guidance.txt | "សាខាពីងតុងបើកក្នុងឆ្នាំ 2017 ដើម្បីឧបត្ថម្ភអតិថិជនក្នុងតំបន់" | German “für den örtlichen Bedarf”; ឧបត្ថម្ភ means subsidizing or sponsoring the clients. | "សាខាពីងតុងបើកក្នុងឆ្នាំ 2017 ដើម្បីបម្រើតម្រូវការអតិថិជនក្នុងតំបន់។" |
| 2 | P1 | A | km-guidance.txt | "ការគាំទ្រ ការណែនាំដោយ AI ឬការបង្ហាញនៅទំព័រណាមួយ" | llms.txt must deny a recommendation and an advertisement; ការគាំទ្រ reads as “we do not support you”, and ការបង្ហាញ is “display”. | "វាមិនធានាលំដាប់ក្នុងលទ្ធផលស្វែងរក ការណែនាំឱ្យប្រើ ការណែនាំដោយ AI ឬការចុះផ្សាយពាណិជ្ជនៅទំព័រណាមួយឡើយ។" |
| 3 | P1 | A | columns-km/009-taiwan-voluntary-resignation-severance.md | "ច្បាប់តៃវ៉ាន់ មិនថាកំហុសនៅភាគីក្រុមហ៊ុន" | មិនថា means “regardless of who is at fault”; English gives the right to one side or the other depending on fault, and the next line then gives both parties both rights. | "ច្បាប់តៃវ៉ាន់ផ្ដល់សិទ្ធិទៅតាមភាគីដែលមានកំហុស៖ បើកំហុសនៅនិយោជក និយោជិតអាចទាមទារប្រាក់ឈប់ការងារតាមច្បាប់ ហើយបើកំហុសនៅនិយោជិត និយោជកអាចមិនបង់ប្រាក់នោះ។" |
| 4 | P1 | G | columns-km/008-taiwan-labor-severance-law.md | "https://www.wei-wei-lawyer.com/post/대만-노동법：대만에서-퇴직금-받기-어렵다고" | Reader-facing frontmatter URL is Hangul, with a fullwidth colon inside the 008 path; also the 009 url. Leave the stored source URL; do not show the Hangul path on the Khmer page. | "កុំបង្ហាញផ្លូវអក្សរកូរ៉េលើទំព័រខ្មែរ។ បើត្រូវមានតំណសាធារណៈ ប្រើស្លាកអង់គ្លេសដូច 001–007។" |
| 5 | P2 | A | km-guidance.txt | "គ្របដណ្ដប់ការឧបត្ថម្ភសំណុំរឿង" | Bios use ឧបត្ថម្ភ for professional case support (German Unterstützung); also the headings at lines 790, 805, and 817. | "ទទួលបន្ទុកជួយសំណុំរឿង" |
| 6 | P2 | A | km-guidance.txt | "ក្នុងនីតិវិធីតែមួយ" | German “in einem Ablauf” is one workflow; នីតិវិធី is a legal procedure. | "ក្នុងលំហូរការងារតែមួយ" |
| 7 | P2 | A | km-guidance.txt | "ការនាំទុនចូល" | Reads as importing capital; the German source is the capital contribution (Kapitaleinlage). | "ការដាក់ដើមទុន" |
| 8 | P2 | C | km-guidance.txt | "ការជ្រើសរូបភាពនីតិបុគ្គល" | Rechtsform calqued as “legal-person picture”; also “តាមរូបភាពនីតិបុគ្គល” in the same services block. | "ការជ្រើសទម្រង់នីតិបុគ្គល" |
| 9 | P2 | A | km-guidance.txt | "ដៃគូគណនេយ្យករ" | Partner CPA/auditor rendered as a general accountant; also the lawyers page title and the role label. | "គណនេយ្យករសាធារណៈដៃគូ" |
| 10 | P2 | A | columns-km/008-taiwan-labor-severance-law.md | "បទប្បញ្ញត្តិប្រាក់ចូលនិវត្តន៍ពលករ (勞工退休金條例)" | 條例 is a statute; បទប្បញ្ញត្តិ is a sub-statutory regulation, and the same sentence correctly calls the Labor Standards Act a ច្បាប់. Also the blockquote. | "ច្បាប់ប្រាក់ចូលនិវត្តន៍ពលករ (勞工退休金條例)" |
| 11 | P2 | A | columns-km/006-taiwan-massage-history-law.md | "ព្រឹទ្ធចៅក្រមរដ្ឋធម្មនុញ្ញ (大法官) បានប្រកាស" | Reads as one presiding judge announcing a result; 大法官 are the Constitutional Court justices, and they held the rule unconstitutional. | "គណៈចៅក្រមរដ្ឋធម្មនុញ្ញ (大法官) បានវិនិច្ឆ័យថា" |
| 12 | P2 | A | columns-km/009-taiwan-voluntary-resignation-severance.md | "ការធានារ៉ាប់រងពលកម្ម (勞工保險) ឬការធានារ៉ាប់រងសុខភាព (健保)" | Statutory labor insurance and national health insurance read as private policies. | "ធានារ៉ាប់រងពលកម្មតាមច្បាប់ (勞工保險) ឬធានារ៉ាប់រងសុខភាពជាតិ (健保)" |
| 13 | P2 | B | columns-km/002-withdraw-capital-taiwan-company.md | "ត្រូវបានការយល់ព្រមមិនតិចជាង 2/3" | Ungrammatical passive: the limited company “was an approval”. Also the body at the dissolution paragraph and step 2. | "ត្រូវមានការយល់ព្រមពីភាគទុនិកដែលមានសិទ្ធិបោះឆ្នោតមិនតិចជាង 2/3" |
| 14 | P2 | B | columns-km/007-taiwan-divorce-lawsuit-qna.md | "សាលដីការសាលារដ្ឋធម្មនុញ្ញតៃវ៉ាន់" | Judgment and court are fused; the phrase needs នៃ. Also the body of section 4. | "សាលដីកានៃសាលារដ្ឋធម្មនុញ្ញតៃវ៉ាន់" |
| 15 | P2 | B | km-guidance.txt | "ពណ៌នាក្រុមនីមួយៗឲ្យលម្អិត" | ឲ្យ beside ឱ្យ, and ្ត beside ្ដ: "ឪពុកម្តាយ" in the family-services line, "ម្តងហើយម្តងទៀត" in columns-km/001. | "ពណ៌នាក្រុមនីមួយៗឱ្យលម្អិត" / "ឪពុកម្ដាយ" / "ម្ដងហើយម្ដងទៀត" |
| 16 | P2 | B | km-guidance.txt | "នឹងកំណត់វិសាលភាពការងារជាមុន" | Fee answer has no subject. | "ការិយាល័យនឹងកំណត់វិសាលភាពការងារជាមុន" |
| 17 | P2 | B | columns-km/006-taiwan-massage-history-law.md | "ប៉ុន្តែពេលពេលវេលាផ្លាស់" | ពេល is doubled onto ពេលវេលា, so the clause does not parse. | "ប៉ុន្តែកាលពេលវេលាកន្លងទៅ និងទីផ្សារអ្នកប្រើប្រាស់ពង្រីក" |
| 18 | P2 | C | km-guidance.txt | "បញ្ជីទំព័រ" | Seitenverzeichnis calque; a Khmer site menu is ម៉ឺនុយ. | "ម៉ឺនុយ" |
| 19 | P2 | C | km-guidance.txt | "ផ្នែកភាសាខ្មែរនេះ" | “This Khmer section” copies “dieser deutsche Teil”; the footer already says the pages. | "ទំព័រភាសាខ្មែរទាំងនេះ" |
| 20 | P2 | C | km-guidance.txt | "ក្រុមការងារដែលយើងទទួលធ្វើជាក់ស្ដែង" | German “tatsächlich” left as an odd “actually we take on”. | "ក្រុមការងារដែលយើងទទួលធ្វើ" |
| 21 | P2 | C | km-guidance.txt | "បើលោកអ្នកប្រើមិនបានភាសាណាមួយ" | Calque of “cannot use a language”; also the contact heading, FAQ question, inquiry note, and form option "ប្រើមិនបានភាសាណាមួយ". | "បើលោកអ្នកមិនចេះភាសាណាមួយក្នុង ៤ ភាសានេះ" |
| 22 | P2 | C | km-guidance.txt | "ឃ្លាំងវត្ថុមិនបើកជាសាធារណៈ" | Objektspeicher rendered as a warehouse of physical objects. | "ឃ្លាំងផ្ទុកទិន្នន័យដែលមិនបើកជាសាធារណៈ" |
| 23 | P2 | C | km-guidance.txt | "ជំនួយការផ្លូវច្បាប់ដែលធ្វើជាជំនួយការផ្លូវច្បាប់ជាន់ខ្ពស់" | The role title is stated twice in one clause. | "ជំនួយការផ្លូវច្បាប់ជាន់ខ្ពស់នៅការិយាល័យមេធាវីច្រើនកន្លែង" |
| 24 | P2 | C | km-guidance.txt | "ការបដិសេធ" | Nav and page title read as a refusal; the page is a liability disclaimer. Also the page heading. | "សេចក្ដីបដិសេធទំនួលខុសត្រូវ" |
| 25 | P2 | C | columns-km/003-taiwan-traffic-accident-procedure.md | "Q16. បន្ទាប់ពីគ្រោះថ្នាក់ លោកអ្នកអាចប្រគល់រឿងទាំងអស់ឱ្យក្រុមហ៊ុនធានារ៉ាប់រងបានដែរឬទេ?" | Q16–Q20 drop the ## heading of Q1–Q15 and pad the body with blank lines; the same one-line blog layout runs through 005, 006, 008, and 009. | "សរសេរ Q16–Q20 ជា ## ដូច Q1–Q15 ហើយប្រមូលឃ្លាឱ្យជាកថាខណ្ឌ។" |
| 26 | P2 | C | columns-km/008-taiwan-labor-severance-law.md | "ភាគីនៃនាងខ្ញុំគឺលោក B" | Calque of 我方; a Khmer brief says the client, and លោក B stays. | "អតិថិជនរបស់នាងខ្ញុំគឺលោក B" |
| 27 | P2 | C | columns-km/009-taiwan-voluntary-resignation-severance.md | "«**ពេលវេលា**» មានសារៈសំខាន់ណាស់។" | Guillemets plus bold are a leftover of the source’s «**Zeit**» emphasis. | "**ពេលវេលា** មានសារៈសំខាន់ណាស់។" |
| 28 | P2 | C | columns-km/001-taiwan-company-establishment-basics.md | "នឹងឱ្យអង្គភាពទម្រង់ណាទទួលចំណូល" | Word order copies “will let which entity form receive the income”. | "ទម្រង់អង្គភាពណានឹងទទួលចំណូល" |
| 29 | P2 | D | km-guidance.txt | "TWD 1.57M" | “M” is an English million abbreviation; the judgment sentence itself is already correct. | "TWD 1.57 លាន" |
| 30 | P2 | D | columns-km/007-taiwan-divorce-lawsuit-qna.md | "ឆ្នាំ 112 ចំណុច 4 (112年憲判字第4號)" | ROC year 112 is left bare; a Cambodian reader counts in the common era. Also the body of section 4 and the source list. Keep the case number. | "ឆ្នាំ 112 (គ.ស. 2023) ចំណុច 4 (112年憲判字第4號)" |
| 31 | P2 | G | km-guidance.txt | "Ministry of Education, Legal Affairs Division" | English institution phrases left in the bios; also "Legal Aid Foundation, Taichung Branch" and "Institute of Finance, National Taiwan University". Firm names can stay. | "នាយកដ្ឋានកិច្ចការផ្លូវច្បាប់ ក្រសួងអប់រំ (Ministry of Education, Legal Affairs Division)" |
| 32 | P2 | G | columns-km/008-taiwan-labor-severance-law.md | "«ខ្ញុំ OOO សុខចិត្តបន្ថយតួនាទី និងប្រាក់ឈ្នួលដោយស្ម័គ្រចិត្ត»" | Korean ○○○ name blank left as Latin OOO inside the quoted statement. | "«ខ្ញុំ (ឈ្មោះ) សុខចិត្តបន្ថយតួនាទី និងប្រាក់ឈ្នួលដោយស្ម័គ្រចិត្ត»" |
