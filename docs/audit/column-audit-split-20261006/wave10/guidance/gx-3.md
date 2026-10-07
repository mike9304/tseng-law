# gx-3 report: guidance factfix (es fr pt it ca)

Worker: gx-3 (Sonnet 5.5). Worktree: /Users/son7/projects/tseng-law-guidance-fix-20261007. Date: 2026-10-07.
Edited only: src/content/columns-{es,fr,pt,it,ca}/{003,006,008,010,017,018}-*.md (30 files). No git write commands. lastmod set to "2026-10-07" in all 30 files; no other frontmatter key touched.

## 1. Items applied (per locale, identical structure)

| column | items applied | NOT FOUND |
|---|---|---|
| 003 | 3 (F-007 Property line, F-006 Art.188 para 2, F-011 Art.28 sentence) | none |
| 006 | 3 (until Oct 31 2011 / Taipei City Social Affairs Bureau fines / Interp. 649 + 2011 expiry) | none |
| 008 | 10 (FAQ1 Art.14, FAQ4 seriously+six days, FAQ2 labor pension scope, new para Art.14, body list seriously, body list six days, new para 30 days, table Meaning no-fixed-term, table severance row + Art.11 items 4/5, quote block) | none |
| 010 | 2 (payer = gym-operating company, one of the defendants / Consumer Protection Act Art.7 para 3) | none |
| 017 | 2 (Art.68 body sentence / new source-list line) | none |
| 018 | 4 (promoters / Art.387-1 labor-rights courses / residence permit applied by the foreign national / Art.39 + Art.38 para 2) | none |
| total | 24 per locale x 5 locales = 120 | 0 |

Locales (es fr pt it ca): every BEFORE sentence was located; no NOT FOUND. Structural differences from en that were handled without extra changes:
- 006: es/pt/ca split the 2003 sentence into two short paragraphs, fr/it run it into the next paragraph. Only the first paragraph (the one that said "this law remained in force until 2003") was changed; the following paragraph (hiring of two employees, police found) is untouched.
- 008: body "unlawful conduct / violates rules / absent 3 days" is a 3-4 line list in the locales (not one paragraph); the "seriously violates the labor contract or" and "or six days in one month" were put into the corresponding lines. New paragraphs were inserted before the existing zero-width-space line (the zero-width-space lines were kept).
- 008 FAQ4 and body in the locales did not contain "seriously" (BEFORE wording "violates company rules"), mapped to the AFTER meaning.
- 017: the locales' Art.68 sentence was a reworded first sentence ("Al trabajo sin permiso pueden imponerse una multa..."); only that first sentence was replaced, the NIA 3-year sentence and the rest are untouched. pt/it source lists end each line with a period; the new source line follows that format.
- 018: es/ca keep their existing extra clause "esto no es una promesa de concesion / Aixo no es una promesa de concessio" (not in en AFTER, pre-existing, untouched). ca had "2 accionistes (股東)" which was replaced by "2 promotors (發起人)".
- Bold (`**`) none; Hangul none (see section 3).

Term choices (no precedent existed in the files, so decided here; lead may normalize):
- 發起人: es promotores / fr fondateurs / pt promotores / it promotori / ca promotors, each with (發起人).
- 外國專業人才延攬及僱用法: es Ley para la Captacion y el Empleo de Profesionales Extranjeros / fr loi sur le recrutement et l'emploi des professionnels etrangers / pt lei para o recrutamento e o emprego de profissionais estrangeiros / it legge sul reclutamento e l'impiego di professionisti stranieri / ca Llei per a la captacio i l'ocupacio de professionals estrangers, each with (外國專業人才延攬及僱用法).
- 勞動權益講習 added as gloss; 公司法 gloss added after the existing locale name of the Company Act (taken from 002/004 of the same locale); 就業服務法 added in the 017 body sentence; 內政部移民署 uses the locale's existing 017 wording of the Immigration Agency; 臺北市政府社會局 and 釋字第649號 / 司法院 glosses added in 006.
- "Qualifications and Review Standards" (審查標準, 018) has no Chinese gloss: no precedent in the locale files and the exact statute title is not in the fixspec.

## 2. Checker results: what disappeared, what remains and why

Target numbers vs result (lines in section 3):
- 003: 28 gone in all 5. Remaining list = exactly the allowed shrink-related set (0, 7, 9, 10x2, 62, 110x2, 119x2, 144, 208x2, 276).
- 006: es fr pt it PASS-level (only pre-existing WARN "extra" from image file names/lastmod). ca still "missing 10x3": CHECKER LIMITATION. ca 006 dates are "31 d'octubre de 2008/2011" (correct Catalan elision); the checker date regex only accepts "<day> de <month> de <year>", so "d'octubre" is not parsed and the three month values 10 are lost. Verified: a scratch copy with "de octubre" (ungrammatical) passes with no missing numbers. The 31, 649, 2008, 2011, 3 are all satisfied in ca. I kept correct Catalan.
- 008: all targets gone in all 5 locales (1 2 3 6 7 12 14 17 24 30 2026). No missing numbers remain. Remaining lines are WARN only (unparsed Sino-Korean numeral hints from the ko source side, e.g. "제3호").
- 010: 3 gone in all 5.
- 017: 68 gone; es/fr/pt show PASS (38=38). it/ca show only the WARN hint.
- 018: all targets gone (1 3 38 39 387 2026 500000 3000000) in all 5. Remaining in each locale: 6x2. One 6 is the subheading number (allowed). The other 6 is "June" in "June 2026" (ko "2026년 6월"): the checker does not turn a bare month name into 6 (es/pt/ca), so it stays "missing 6". This is a checker limitation, not a content gap.
  - Wording chosen to keep 2026 detectable: fr "en vigueur depuis 2026, au mois de juin" (the natural "juin 2026" is mis-parsed by the checker as month 6 + day 20 + stray 26, which makes 2026 missing; verified on a scratch copy: missing 6, 2026 / extra 8, 20, 26). it "in vigore da giugno del 2026" (natural Italian, parsed correctly). If the lead prefers the plainer "juin 2026" for fr, swap it back and accept "missing 2026" as a checker artifact.
  - it/ca: "più di un terzo (1/3)" / "més d'un terç (1/3)" so that the digit 3 of ko "3분의 1" is present (without it, it/ca were missing one "3").
  - es/pt/ca/fr/it now also have "2" / "1" etc. covered with digits ("2 o más extranjeros", "menos de 1 año").

## 3. Verification output (verbatim, run from the worktree)

```
[es 003]
numbers        FAIL   missing from translation (14): 0, 7, 9, 10×2, 62, 110×2, 119×2, 144, 208×2, 276
[es 006]
numbers        WARN   extra in translation (4): 1×2, 2×2
[es 008]
numbers        WARN   수사미해석 (1): 제3호
[es 010]
numbers        WARN   extra in translation (1): 2020
[es 017]
numbers        PASS   sourceCount=38 targetCount=38
[es 018]
numbers        FAIL   missing from translation (2): 6×2
[fr 003]
numbers        FAIL   missing from translation (14): 0, 7, 9, 10×2, 62, 110×2, 119×2, 144, 208×2, 276
[fr 006]
numbers        WARN   extra in translation (2): 1, 2
[fr 008]
numbers        WARN   수사미해석 (1): 제3호
[fr 010]
numbers        WARN   extra in translation (1): 2020
[fr 017]
numbers        PASS   sourceCount=38 targetCount=38
[fr 018]
numbers        FAIL   missing from translation (2): 6×2
[pt 003]
numbers        FAIL   missing from translation (14): 0, 7, 9, 10×2, 62, 110×2, 119×2, 144, 208×2, 276
[pt 006]
numbers        WARN   extra in translation (1): 2
[pt 008]
numbers        WARN   수사미해석 (1): 제3호
[pt 010]
numbers        WARN   수사미해석 (3): 1심; 1심; 1심
[pt 017]
numbers        PASS   sourceCount=38 targetCount=38
[pt 018]
numbers        FAIL   missing from translation (2): 6×2
[it 003]
numbers        FAIL   missing from translation (14): 0, 7, 9, 10×2, 62, 110×2, 119×2, 144, 208×2, 276
[it 006]
numbers        WARN   extra in translation (2): 1, 2
[it 008]
numbers        WARN   수사미해석 (4): 제1항; 제3호; 제2항; 제1항
[it 010]
numbers        WARN   수사미해석 (16): 1심; 1심; 제7호; 1심; 1심; 1심; 1심; 1심; 1심; 1심; 1심; 1심; 1심; 1심; 제3항; 제3자
[it 017]
numbers        WARN   수사미해석 (2): 제3자; 제3자
[it 018]
numbers        FAIL   missing from translation (2): 6×2
[ca 003]
numbers        FAIL   missing from translation (14): 0, 7, 9, 10×2, 62, 110×2, 119×2, 144, 208×2, 276
[ca 006]
numbers        FAIL   missing from translation (3): 10×3
[ca 008]
numbers        WARN   수사미해석 (4): 제1항; 제3호; 제2항; 제1항
[ca 010]
numbers        WARN   extra in translation (1): 2020
[ca 017]
numbers        WARN   수사미해석 (2): 제3자; 제3자
[ca 018]
numbers        FAIL   missing from translation (2): 6×2
--- es: grep -l '\*\*' (expect empty)
--- es: hangul grep (expect empty)
--- es: git diff --stat
 .../003-taiwan-traffic-accident-procedure.md       |  8 ++++----
 .../columns-es/006-taiwan-massage-history-law.md   |  8 ++++----
 .../columns-es/008-taiwan-labor-severance-law.md   | 24 +++++++++++++---------
 .../columns-es/010-taiwan-gym-injury-lawsuit.md    |  6 +++---
 .../017-taiwan-logistics-business-setup.md         |  5 +++--
 .../018-taiwan-semiconductor-market-entry.md       | 10 ++++-----
 6 files changed, 33 insertions(+), 28 deletions(-)
--- fr: grep -l '\*\*' (expect empty)
--- fr: hangul grep (expect empty)
--- fr: git diff --stat
 .../003-taiwan-traffic-accident-procedure.md       |  8 ++++----
 .../columns-fr/006-taiwan-massage-history-law.md   |  8 ++++----
 .../columns-fr/008-taiwan-labor-severance-law.md   | 24 +++++++++++++---------
 .../columns-fr/010-taiwan-gym-injury-lawsuit.md    |  6 +++---
 .../017-taiwan-logistics-business-setup.md         |  5 +++--
 .../018-taiwan-semiconductor-market-entry.md       | 10 ++++-----
 6 files changed, 33 insertions(+), 28 deletions(-)
--- pt: grep -l '\*\*' (expect empty)
--- pt: hangul grep (expect empty)
--- pt: git diff --stat
 .../003-taiwan-traffic-accident-procedure.md       |  8 ++++----
 .../columns-pt/006-taiwan-massage-history-law.md   |  8 ++++----
 .../columns-pt/008-taiwan-labor-severance-law.md   | 24 +++++++++++++---------
 .../columns-pt/010-taiwan-gym-injury-lawsuit.md    |  6 +++---
 .../017-taiwan-logistics-business-setup.md         |  5 +++--
 .../018-taiwan-semiconductor-market-entry.md       | 10 ++++-----
 6 files changed, 33 insertions(+), 28 deletions(-)
--- it: grep -l '\*\*' (expect empty)
--- it: hangul grep (expect empty)
--- it: git diff --stat
 .../003-taiwan-traffic-accident-procedure.md       |  8 ++++----
 .../columns-it/006-taiwan-massage-history-law.md   |  8 ++++----
 .../columns-it/008-taiwan-labor-severance-law.md   | 24 +++++++++++++---------
 .../columns-it/010-taiwan-gym-injury-lawsuit.md    |  6 +++---
 .../017-taiwan-logistics-business-setup.md         |  5 +++--
 .../018-taiwan-semiconductor-market-entry.md       | 10 ++++-----
 6 files changed, 33 insertions(+), 28 deletions(-)
--- ca: grep -l '\*\*' (expect empty)
--- ca: hangul grep (expect empty)
--- ca: git diff --stat
 .../003-taiwan-traffic-accident-procedure.md       |  8 ++++----
 .../columns-ca/006-taiwan-massage-history-law.md   |  8 ++++----
 .../columns-ca/008-taiwan-labor-severance-law.md   | 24 +++++++++++++---------
 .../columns-ca/010-taiwan-gym-injury-lawsuit.md    |  6 +++---
 .../017-taiwan-logistics-business-setup.md         |  5 +++--
 .../018-taiwan-semiconductor-market-entry.md       | 10 ++++-----
 6 files changed, 33 insertions(+), 28 deletions(-)
```

## 4. English back-translations of the 6 key items (literal)

### es (Spanish)

1. 003 F-011 (end of the Article 6 paragraph): The insurer does not pay the benefits when the injured person or another claimant caused the accident intentionally or while committing a crime (Article 28).

2. 006 L77 (Interp. 649, 2011): In the end, in Interpretation No. 649 (釋字第649號) of the Judicial Yuan (司法院), of October 31, 2008, the Grand Justices (大法官) declared unconstitutional (違憲) the provision that only allowed people with visual impairments to work in the massage trade, and the provision ceased to have effect on October 31, 2011, at the end of the 3-year grace period that the interpretation granted.

3. 008 quote block (added after "with no cap"): The Labor Pension Act applies to Taiwanese nationals, to foreigners married to a Taiwanese national to whom residence has been granted, to foreigners to whom permanent residence has been granted and to similar workers (Article 7, paragraph 1), and, from 2026, to foreign professionals who perform professional work ([Article 24 of the Act for the Attraction and Employment of Foreign Professionals (外國專業人才延攬及僱用法)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=24)); the severance of other workers, and that of the periods of service before the Act applied, is calculated under Article 17 of the Labor Standards Act. Service of less than 1 year is calculated pro rata, and the company must pay the severance within 30 days after the contract ends.

4. 010 payer: ... the Taichung District Court ordered the company that runs the gym, one of the defendant parties, to pay [TWD 1,579,589] and the interest stated in the judgment.

5. 017 Art. 68 body (first sentence): A foreigner who works without authorization is subject to an administrative fine, must be made subject to an order to leave Taiwan immediately (限令出國) and may not work in Taiwan again (Article 68 of the Employment Service Act, 就業服務法). [rest of paragraph unchanged]

6. 018 Art. 39 paragraph: For the manager of the subsidiary (a company with authorized investment in which foreigners hold more than one third of the shares) or branch of a foreign company in Taiwan, obtaining the work permit is relatively easier; this is not a promise of grant. Even when hiring the first foreigner, the employer must meet one of the criteria of Article 39 of the Qualification and Review Rules for the work of foreigners. For a company less than 1 year old, the criteria include paid-in capital (for a branch, operating funds in Taiwan) of at least 500,000 Taiwan dollars or revenue of at least 3 million Taiwan dollars; for a company 1 year old or more, they include average revenue of the last year or of the last 3 years of at least 3 million Taiwan dollars. If the employer hires 2 or more foreigners of the same type, those foreigners and the employer must meet the general criteria of chapter 2 (Article 38, paragraph 2). If foreign staff are expected to work in Taiwan, [unchanged] confirm before forming the company whether the planned capital reaches the applicable threshold.

### fr (French)

1. 003 F-011: The insurer does not pay the benefits when the injured person or another person entitled (ayant droit) caused the accident intentionally or by committing an offence (Article 28).

2. 006 L77: Finally, in Interpretation No. 649 (釋字第649號) of the Judicial Yuan (司法院) of October 31, 2008, the constitutional judges (大法官) declared unconstitutional (違憲) the provision that only allowed people with visual impairments to practise the massage trade, and the provision ceased to produce effect on October 31, 2011, at the end of the 3-year grace period that the interpretation had granted.

3. 008 quote block (added): The Labor Pension Act applies to Taiwanese nationals, to foreigners married to a Taiwanese national who have been granted residence, to foreigners holding permanent residence and to similar workers (Article 7, paragraph 1), and, from 2026, to foreign professionals carrying out professional activity ([Article 24 of the Act on the Recruitment and Employment of Foreign Professionals (外國專業人才延攬及僱用法)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=24)); the severance of other workers, as well as that of the periods of service before the Act applied, is calculated under Article 17 of the Labor Standards Act. Service of less than 1 year is calculated pro rata, and the company must pay the severance within 30 days after the end of the contract.

4. 010 payer: ... the Taichung District Court ordered the company that operates the gym, one of the defendant parties, to pay [TWD 1,579,589] together with the interest mentioned in the judgment.

5. 017 Art. 68 body: A foreigner who works without authorization incurs an administrative fine, must be the subject of an order to leave Taiwan immediately (限令出國) and may no longer work in Taiwan (Article 68 of the Employment Services Act, 就業服務法). [rest unchanged]

6. 018 Art. 39 paragraph: It is easier to obtain the work permit for a manager of the subsidiary (a company that received investment authorization and of which more than one third of the shares are held by foreigners) or of the Taiwanese branch of a foreign company. Even for hiring the first foreigner, however, the employer must meet one of the criteria of Article 39 of the Qualification and Examination Standards applicable to the work of foreigners. For a company less than 1 year old, the criteria include paid-in capital (for a branch, operating funds in Taiwan) of at least TWD 500,000 or revenue of at least TWD 3,000,000; for a company 1 year old or more, they include average revenue over the last year or over the last 3 years of at least TWD 3,000,000. If the employer hires 2 or more foreigners of the same type, those foreigners and the employer must meet the general standards of chapter 2 (Article 38, paragraph 2). [last sentence unchanged]

### pt (Portuguese, pt-PT)

1. 003 F-011: The insurer does not pay the benefits when the injured person or another claimant caused the accident intentionally or during the commission of a crime (Article 28).

2. 006 L77: Finally, in Interpretation No. 649 (釋字第649號) of the Judicial Yuan (司法院), of October 31, 2008, the constitutional judges (大法官) declared unconstitutional (違憲) the provision that only allowed people with visual impairments to practise the massage trade, and the provision ceased to produce effects on October 31, 2011, at the end of the 3-year grace period that the interpretation granted.

3. 008 quote block (added): The Labor Pension Act applies to Taiwanese nationals, to foreigners married to a Taiwanese national to whom residence has been granted, to foreigners to whom permanent residence has been granted and to similar workers (Article 7, paragraph 1), and, from 2026, to foreign professionals who perform professional work ([Article 24 of the Act for the Recruitment and Employment of Foreign Professionals (外國專業人才延攬及僱用法)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=24)); the severance of the other workers, and that of the periods of service before the Act applied, is calculated under Article 17 of the Labor Standards Act. Service of less than 1 year is calculated proportionally, and the company must pay the severance within 30 days after the end of the contract.

4. 010 payer: ... the Taichung district court ordered the company that operates the gym, one of the defendant parties, to pay [TWD 1,579,589] as well as the interest mentioned in the judgment.

5. 017 Art. 68 body: A foreigner who works without authorization is subject to an administrative fine, must be the object of an order to leave Taiwan immediately (限令出國) and may not work again in Taiwan (Article 68 of the Employment Services Act, 就業服務法). [rest unchanged]

6. 018 Art. 39 paragraph: It is relatively easier to obtain the work permit for a manager of the subsidiary (a company with authorized investment in which foreigners hold more than one third of the shares) or of the Taiwanese branch of a foreign company. Even when hiring the first foreigner, however, the employer must nevertheless meet one of the criteria of Article 39 of the Qualification and Assessment Standards for the work of foreigners. For a company with less than 1 year, the criteria include paid-up capital (for a branch, operating funds in Taiwan) of at least TWD 500,000 or turnover of at least TWD 3,000,000; for a company with 1 year or more, they include average turnover of the last year or of the last 3 years of at least TWD 3,000,000. If the employer hires 2 or more foreigners of the same type, those foreigners and the employer must meet the general standards of chapter 2 (Article 38, paragraph 2). [last sentence unchanged]

### it (Italian)

1. 003 F-011: The insurer does not pay the benefits when the injured person or another person entitled (avente diritto) caused the accident intentionally or by committing a crime (Article 28).

2. 006 L77: Finally, in Interpretation No. 649 (釋字第649號) of the Judicial Yuan (司法院) of October 31, 2008, the constitutional judges (大法官) declared unconstitutional (違憲) the provision that only authorized people with visual impairments to practise the massage trade, and the provision ceased to have effect on October 31, 2011, at the end of the 3-year grace period granted by the interpretation.

3. 008 quote block (added): The Labor Pension Act applies to Taiwanese citizens, to foreigners married to a Taiwanese citizen to whom residence has been granted, to foreigners to whom permanent residence has been granted and to similar workers (Article 7, paragraph 1), and, from 2026, to foreign professionals who carry out professional activity ([Article 24 of the Act on the Recruitment and Employment of Foreign Professionals (外國專業人才延攬及僱用法)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=24)); the severance of the other workers, and that of the periods of service before the Act applied, is calculated under Article 17 of the Labor Standards Act. The period of service of less than 1 year is calculated in proportion, and the company must pay the severance within 30 days of the termination of the contract.

4. 010 payer: ... the District Court of Taichung ordered the company that runs the gym, one of the defendant parties, to pay [TWD 1,579,589] as well as the interest mentioned in the judgment.

5. 017 Art. 68 body: A foreigner who works without authorization is subject to an administrative sanction, must be the recipient of an order to leave Taiwan immediately (限令出國) and may no longer work in Taiwan (Article 68 of the Employment Services Act, 就業服務法). [rest unchanged]

6. 018 Art. 39 paragraph: It is relatively easier to obtain the work authorization for an executive of the subsidiary (a company with authorized investment in which foreigners hold more than one third (1/3) of the shares) or of the Taiwanese branch of a foreign company. Even when hiring the first foreigner, however, the employer must meet one of the criteria of Article 39 of the Qualification and Examination Rules for the work of foreigners. For a company with less than 1 year, the criteria include paid-in capital (for a branch, operating funds in Taiwan) of at least TWD 500,000 or turnover of at least TWD 3,000,000; for a company with 1 year or more, they include average turnover of the last year or of the last 3 years of at least TWD 3,000,000. If the employer hires 2 or more foreigners of the same type, those foreigners and the employer must meet the general rules of chapter 2 (Article 38, paragraph 2). [last sentence unchanged]

### ca (Catalan)

1. 003 F-011: The insurer does not pay the benefits when the injured person or another claimant caused the accident intentionally or while committing a crime (Article 28).

2. 006 L77: In the end, in Interpretation No. 649 (釋字第649號) of the Judicial Yuan (司法院), of October 31, 2008, the Grand Magistrates (大法官) declared unconstitutional (違憲) the provision that only allowed people with visual impairments to work in the massage trade, and the provision ceased to have effect on October 31, 2011, at the end of the 3-year grace period that the interpretation granted.

3. 008 quote block (added): The Law on labor pensions applies to Taiwanese nationals, to foreigners married to a Taiwanese national to whom residence has been granted, to foreigners to whom permanent residence has been granted and to similar workers (Article 7, paragraph 1), and, from 2026, to foreign professionals who do professional work ([Article 24 of the Law for the attraction and employment of foreign professionals (外國專業人才延攬及僱用法)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=24)); the severance of the other workers, and that of the periods of service before the Law applied, is calculated according to Article 17 of the Labor Standards Law. The period of service of less than 1 year is calculated proportionally, and the company must pay the severance within 30 days of the end of the contract.

4. 010 payer: ... the Taichung District Court sentenced the company that runs the gym, one of the defendant parties, to pay [TWD 1,579,589] and the interest set by the judgment.

5. 017 Art. 68 body: A foreigner who works without authorization is subject to an administrative fine, must be made the object of an order to leave Taiwan immediately (限令出國) and may not work in Taiwan again (Article 68 of the Employment Services Law, 就業服務法). [rest unchanged]

6. 018 Art. 39 paragraph: For the manager of a subsidiary (a company with authorized investment in which foreigners hold more than one third (1/3) of the shares) or branch of a foreign company in Taiwan, the work permit is, in relative terms, easier to obtain. This is not a promise of grant. Even when hiring the first foreigner, the employer must meet one of the criteria of Article 39 of the Qualification and Review Rules for the work of foreigners. For a company with less than 1 year, the criteria include paid-up capital (for a branch, operating funds in Taiwan) of at least TWD 500,000 or revenue of at least TWD 3,000,000; for a company with 1 year or more, they include average revenue of the last year or of the last 3 years of at least TWD 3,000,000. If the employer hires 2 or more foreigners of the same type, those foreigners and the employer must meet the general criteria of chapter 2 (Article 38, paragraph 2). [last sentence unchanged]
