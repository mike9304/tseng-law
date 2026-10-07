# gx-4 보고 — WO-GUIDANCE-FACTFIX (ru uk bg sr mn), 2026-10-07

작업자 gx-4 (Sonnet 5.5). 대상: `src/content/columns-{ru,uk,bg,sr,mn}/{003,006,008,010,017,018}-*.md` 30개 파일만 수정. git 쓰기 명령 없음. 다른 locale·파일 미접촉.

## 1. 적용 항목 수 (locale별 · 칼럼별)

5개 locale 모두 동일: 003:3, 006:3, 008:10, 010:2, 017:2, 018:4 = 24항목 x 5 = 120항목 전부 적용. lastmod는 30개 파일 모두 "2026-10-07"로 변경(따옴표 유지, 다른 frontmatter 키 불변).

| locale | 003 | 006 | 008 | 010 | 017 | 018 | 합계 |
|---|---|---|---|---|---|---|---|
| ru | 3 | 3 | 10 | 2 | 2 | 4 | 24 |
| uk | 3 | 3 | 10 | 2 | 2 | 4 | 24 |
| bg | 3 | 3 | 10 | 2 | 2 | 4 | 24 |
| sr | 3 | 3 | 10 | 2 | 2 | 4 | 24 |
| mn | 3 | 3 | 10 | 2 | 2 | 4 | 24 |

NOT FOUND: 없음. 모든 BEFORE 문장이 5개 locale 전부에서 정확히 1회 발견되어 교체했다(편집은 정확 일치 + 유일성 단언 스크립트로 수행, 불일치·중복 시 중단).

새 문단 2건(008 §14 문단, 008 §12② 30일 문단)은 en과 같은 위치에서 `​` 줄 바로 앞에 독립 문단으로 넣었고 기존 `​` 줄은 지우지 않았다. 017 출처 줄은 기존 "§68" 줄 바로 뒤, 移民署 줄 앞(en 133번 줄 위치)에 추가했다.

## 2. 운용상 판단 및 보고 사항

- 006 "3": 원본(ko)이 "3년"이라 숫자 3이 검사 대상. ru는 "переходного срока в 3 года"처럼 아라비아 숫자로 썼다(기존 파일도 "3 дня" 등 숫자 선호). 5개 locale 모두 숫자 3으로 반영.
- 018 `6` 잔존: 검증 스크립트가 키릴·라틴 locale의 "월+연도(일 없음)" 형태를 일 단위 날짜 패턴으로 오인한다. 실측: ru "с июня 2026" -> 토큰 [6, 20, 26](2026 소실), uk "з червня 2026" 동일, bg "юни 2026" 동일, sr "od juna 2026" 동일. 반면 처격 "в июне 2026 года"/"у червні 2026 року"/"u junu 2026. godine"는 [2026]만 나온다. 목표 숫자 2026을 살리기 위해 처격/우회형을 택했다: ru "вступает в силу в июне 2026 года", uk "набирає чинності у червні 2026 року", sr "koji stupa na snagu u junu 2026. godine", bg "в сила през 2026 г., от юни". 그 결과 ru·uk·bg·sr의 018 `6×2`는 소제목 번호 6 + 6월의 6(검사기가 이 형태에서 6을 인식하지 못함)이다. 문장 내용은 정확하다(2026년 6월 시행). mn은 "2026 оны 6 дугаар сараас"로 2026·6 둘 다 인식되어 소제목 6 하나만 남는다.
- 018 §39 문단: 원본의 "1/3·1년 미만·1년 이상·1년 또는 3년"을 uk·bg·sr·mn에서는 숫자(1/3, 1 рік 등)로 썼다. uk에서 단어형(одного року, третиною)이 숫자 검사에 잡히지 않아 `1×4, 3×2`가 남았다가 숫자형으로 바꿔 해소.
- 018 §39 문단은 en AFTER가 "Ministry of Labor requires..." 문장을 삭제했으므로 대응하는 노동부(勞動部) 언급도 지웠다. 審查標準은 파일에 기존 번역명이 없어서 zh 판 표기대로 괄호에 工作資格及審查標準을 붙였다.
- 008 표 「의미」 셋째 칸: en AFTER가 "Under a contract with no fixed term, a worker is free..."이므로 기존 번역의 "в любое время(언제든지)"류 수식을 AFTER 뜻에 맞춰 뺐다(ru "в любое время", uk "у будь-який час", bg "по всяко време", sr "u svakom trenutku"). mn 원문에는 그 수식이 없어 "Хугацаа тогтоогоогүй гэрээний үед"만 앞에 붙였다.
- 006 `extra in translation`(bg 1 / sr 1,2 / mn 1,2,2)은 작업 전 HEAD 본문에서도 동일하게 나오는 기존 값이다(HEAD 대상 확인 완료, 이번 편집과 무관).
- 003 잔존 `0, 7, 9, 10x2, 62, 110x2, 119x2, 144, 208x2, 276`은 WO가 허용한 축약 관련 목록과 정확히 일치(28 소거).
- 017은 `68`이 하나도 남지 않았다(본문 문장 + 기존 §68 줄 + 새 줄로 ko의 두 출처 줄이 모두 대응).
- 모든 locale에서 5개 locale의 diff stat이 동일(33 insertions, 28 deletions)이라 항목 누락·중복 편집이 없음을 구조적으로도 확인.
- 용어 선택: 발기인 = ru учредители (發起人) / uk засновники (發起人) / bg учредители (發起人) / sr osnivači (發起人) / mn үүсгэн байгуулагч (發起人). 罰鍰은 모든 파일에 이미 있던 (罰鍰) 표기를 유지. 勞動權益講習은 5개 locale 모두 괄호 병기. 外國專業人才延攬及僱用法은 008의 본문 표·인용 블록·FAQ에서 첫 등장마다 괄호 병기.

## 3. 검증 출력 (그대로)

WO 검증 1번 (`check-column-translation.mjs ... | grep -E '^numbers'`, locale x 칼럼 30회). 각 블록 첫 줄이 `numbers` 줄이며, 이 grep은 첫 줄만 보여 주므로 `extra in translation` 같은 이어지는 줄은 출력되지 않는다.

```
[ru 003]
numbers        FAIL   missing from translation (14): 0, 7, 9, 10×2, 62, 110×2, 119×2, 144, 208×2, 276
[ru 006]
numbers        WARN   수사미해석 (1): 제649호
[ru 008]
numbers        WARN   수사미해석 (4): 제1항; 제3호; 제2항; 제1항
[ru 010]
numbers        WARN   extra in translation (1): 2020
[ru 017]
numbers        WARN   수사미해석 (2): 제3자; 제3자
[ru 018]
numbers        FAIL   missing from translation (2): 6×2
[uk 003]
numbers        FAIL   missing from translation (14): 0, 7, 9, 10×2, 62, 110×2, 119×2, 144, 208×2, 276
[uk 006]
numbers        WARN   수사미해석 (1): 제649호
[uk 008]
numbers        WARN   수사미해석 (4): 제1항; 제3호; 제2항; 제1항
[uk 010]
numbers        WARN   extra in translation (1): 2020
[uk 017]
numbers        WARN   수사미해석 (2): 제3자; 제3자
[uk 018]
numbers        FAIL   missing from translation (2): 6×2
[bg 003]
numbers        FAIL   missing from translation (14): 0, 7, 9, 10×2, 62, 110×2, 119×2, 144, 208×2, 276
[bg 006]
numbers        WARN   extra in translation (1): 1
[bg 008]
numbers        WARN   수사미해석 (4): 제1항; 제3호; 제2항; 제1항
[bg 010]
numbers        WARN   extra in translation (1): 2020
[bg 017]
numbers        WARN   수사미해석 (2): 제3자; 제3자
[bg 018]
numbers        FAIL   missing from translation (2): 6×2
[sr 003]
numbers        FAIL   missing from translation (14): 0, 7, 9, 10×2, 62, 110×2, 119×2, 144, 208×2, 276
[sr 006]
numbers        WARN   extra in translation (2): 1, 2
[sr 008]
numbers        WARN   수사미해석 (4): 제1항; 제3호; 제2항; 제1항
[sr 010]
numbers        WARN   수사미해석 (16): 1심; 1심; 제7호; 1심; 1심; 1심; 1심; 1심; 1심; 1심; 1심; 1심; 1심; 1심; 제3항; 제3자
[sr 017]
numbers        WARN   수사미해석 (2): 제3자; 제3자
[sr 018]
numbers        FAIL   missing from translation (2): 6×2
[mn 003]
numbers        FAIL   missing from translation (14): 0, 7, 9, 10×2, 62, 110×2, 119×2, 144, 208×2, 276
[mn 006]
numbers        WARN   extra in translation (3): 1, 2×2
[mn 008]
numbers        WARN   수사미해석 (4): 제1항; 제3호; 제2항; 제1항
[mn 010]
numbers        WARN   수사미해석 (16): 1심; 1심; 제7호; 1심; 1심; 1심; 1심; 1심; 1심; 1심; 1심; 1심; 1심; 1심; 제3항; 제3자
[mn 017]
numbers        WARN   수사미해석 (2): 제3자; 제3자
[mn 018]
numbers        FAIL   missing from translation (1): 6
```

WO 검증 2·3·4번 (locale별: 굵은 글씨 grep, 한글 grep, git diff --stat). 굵은 글씨·한글 grep은 5개 locale 모두 출력 없음(`(exit 1)`은 grep -l 이 일치 파일 없음으로 종료한 코드).

```
### ru
$ grep -l '\*\*' ... (expect empty)
(exit 1)
$ grep -n '[가-힣]' ... | grep -v url: (expect empty)
(done)
 .../003-taiwan-traffic-accident-procedure.md       |  8 ++++----
 .../columns-ru/006-taiwan-massage-history-law.md   |  8 ++++----
 .../columns-ru/008-taiwan-labor-severance-law.md   | 24 +++++++++++++---------
 .../columns-ru/010-taiwan-gym-injury-lawsuit.md    |  6 +++---
 .../017-taiwan-logistics-business-setup.md         |  5 +++--
 .../018-taiwan-semiconductor-market-entry.md       | 10 ++++-----
 6 files changed, 33 insertions(+), 28 deletions(-)
### uk
$ grep -l '\*\*' ... (expect empty)
(exit 1)
$ grep -n '[가-힣]' ... | grep -v url: (expect empty)
(done)
 .../003-taiwan-traffic-accident-procedure.md       |  8 ++++----
 .../columns-uk/006-taiwan-massage-history-law.md   |  8 ++++----
 .../columns-uk/008-taiwan-labor-severance-law.md   | 24 +++++++++++++---------
 .../columns-uk/010-taiwan-gym-injury-lawsuit.md    |  6 +++---
 .../017-taiwan-logistics-business-setup.md         |  5 +++--
 .../018-taiwan-semiconductor-market-entry.md       | 10 ++++-----
 6 files changed, 33 insertions(+), 28 deletions(-)
### bg
$ grep -l '\*\*' ... (expect empty)
(exit 1)
$ grep -n '[가-힣]' ... | grep -v url: (expect empty)
(done)
 .../003-taiwan-traffic-accident-procedure.md       |  8 ++++----
 .../columns-bg/006-taiwan-massage-history-law.md   |  8 ++++----
 .../columns-bg/008-taiwan-labor-severance-law.md   | 24 +++++++++++++---------
 .../columns-bg/010-taiwan-gym-injury-lawsuit.md    |  6 +++---
 .../017-taiwan-logistics-business-setup.md         |  5 +++--
 .../018-taiwan-semiconductor-market-entry.md       | 10 ++++-----
 6 files changed, 33 insertions(+), 28 deletions(-)
### sr
$ grep -l '\*\*' ... (expect empty)
(exit 1)
$ grep -n '[가-힣]' ... | grep -v url: (expect empty)
(done)
 .../003-taiwan-traffic-accident-procedure.md       |  8 ++++----
 .../columns-sr/006-taiwan-massage-history-law.md   |  8 ++++----
 .../columns-sr/008-taiwan-labor-severance-law.md   | 24 +++++++++++++---------
 .../columns-sr/010-taiwan-gym-injury-lawsuit.md    |  6 +++---
 .../017-taiwan-logistics-business-setup.md         |  5 +++--
 .../018-taiwan-semiconductor-market-entry.md       | 10 ++++-----
 6 files changed, 33 insertions(+), 28 deletions(-)
### mn
$ grep -l '\*\*' ... (expect empty)
(exit 1)
$ grep -n '[가-힣]' ... | grep -v url: (expect empty)
(done)
 .../003-taiwan-traffic-accident-procedure.md       |  8 ++++----
 .../columns-mn/006-taiwan-massage-history-law.md   |  8 ++++----
 .../columns-mn/008-taiwan-labor-severance-law.md   | 24 +++++++++++++---------
 .../columns-mn/010-taiwan-gym-injury-lawsuit.md    |  6 +++---
 .../017-taiwan-logistics-business-setup.md         |  5 +++--
 .../018-taiwan-semiconductor-market-entry.md       | 10 ++++-----
 6 files changed, 33 insertions(+), 28 deletions(-)
```

목표 대비 점검(작업 전 기준선 -> 현재):
- 003: 28 소거 확인(남은 목록은 허용 목록과 일치).
- 006: 3·10·31·649·2008·2011 전부 소거(5개 locale).
- 008: 1·2·3·6·7·12·14·17·24·30·2026 전부 소거(5개 locale; `numbers` 줄에 missing 항목 없음).
- 010: 3 소거(5개 locale; missing 항목 없음).
- 017: 68 소거(missing 항목 없음).
- 018: 1·3·38·39·387·2026·500000·3000000 전부 소거. 남은 숫자는 소제목 번호 6(및 ru·uk·bg·sr에서 6월의 6, 위 2번 항목 참고). 소제목 8은 `extra`로 표시되는 기존 값.

## 4. 역번역 (6개 핵심 항목, 새 문장을 영어로 직역)

### ru
- 003 F-011: "The insurer does not pay insurance benefits if the injured person or another person entitled to claim caused the accident intentionally or while committing a crime (Article 28)."
- 006 L77 (釋字649·2011): "In the end, the judges of the Constitutional Court (大法官), in Interpretation of the Judicial Yuan (司法院) No. 649 (釋字第649號) of October 31, 2008, declared unconstitutional (違憲) the rule under which only persons with visual impairments could engage in massage activity, and this rule ceased to have effect on October 31, 2011, upon expiry of the 3-year transitional period allowed by the interpretation."
- 008 인용 블록: "The Labor Pension Act applies to citizens of Taiwan, to foreigners married to a citizen of Taiwan who have obtained a residence permit, to foreigners who have obtained permanent residence, and to similar workers (paragraph 1 of Article 7), and from 2026 also to foreign professionals doing professional work (Article 24 of the Act for the Recruitment and Employment of Foreign Professionals, linked); severance for other workers, and for service before this Act applied, is calculated under Article 17 of the Labor Standards Act. Service of less than one year is calculated pro rata, and the company must pay the severance within 30 days after the contract ends."
- 010 지급 의무자: "the Taichung District Court ... obliged the company operating the fitness club (one of the defendants) to pay [TWD 1.579.589] and the interest stated in the judgment."
- 017 §68 본문: "A foreigner working without permission is subject to an administrative fine, must be immediately ordered to leave Taiwan (限令出國), and may not work in Taiwan again (Article 68 of the Employment Service Act, 就業服務法)." (이어지는 이민서 3년 문장은 불변)
- 018 §39 문단: "For the manager of a Taiwan subsidiary of a foreign company (a company with investment approval in which foreigners hold more than one-third of the shares) and of a branch, applying for a work permit is relatively easier. However, even when hiring the first foreigner, the employer must meet one of the criteria of Article 39 of the Standards for Qualifications and Review of Foreigners' Work (工作資格及審查標準). For a company less than one year old the criteria include paid-in capital (for a branch, operating funds in Taiwan) of at least TWD 500.000 or turnover of at least TWD 3.000.000; for a company one year old or more, average turnover for the last one year or three years of at least TWD 3.000.000. If the employer hires two or more foreigners of the same type, those foreigners and the employer must meet the general standards of Chapter 2 (Article 38, paragraph 2)."

### uk
- 003 F-011: "The insurer does not pay insurance benefits if the injured person or another person having the right of claim caused the accident intentionally or while committing a crime (Article 28)."
- 006 L77: "In the end the judges of the Constitutional Court (大法官), in the interpretation of the Judicial Yuan (司法院) No. 649 (釋字第649號) of October 31, 2008, declared unconstitutional (違憲) the rule that allowed only persons with visual impairments to engage in massage, and this rule lost effect on October 31, 2011, after the end of the 3-year transitional period granted by the interpretation."
- 008 인용 블록: "The Labor Pension Act applies to citizens of Taiwan, to foreigners married to a citizen of Taiwan who have obtained the right of residence, to foreigners who have obtained permanent residence, and to similar workers (Article 7, paragraph 1), and from 2026 also to foreign professionals performing professional work (Article 24 of the Act on Recruitment and Employment of Foreign Professionals, linked); severance of other workers, and for service before this Act applied, is calculated under Article 17 of the Labor Standards Act. Service of less than one year is calculated pro rata, and the company must pay severance within 30 days after the contract ends."
- 010 지급 의무자: "obliged the company that operates the fitness hall (one of the defendants) to pay [1.579.589 TWD] and the interest stated in the judgment."
- 017 §68 본문: "A foreigner who works without permission is subject to an administrative fine, must be immediately ordered to leave Taiwan (限令出國), and may not work in Taiwan again (Article 68 of the Employment Services Act, 就業服務法)."
- 018 §39 문단: "For the manager (經理人) of a Taiwan subsidiary of a foreign company (a company with investment approval in which foreigners hold more than 1/3 of the shares) and of a branch, the work-permit application is relatively easier. However, even when hiring the first foreigner the employer must meet one of the criteria of Article 39 of the Standards for Qualification and Review of Foreigners' Work (工作資格及審查標準). For a company younger than 1 year the criteria include paid-in capital (for a branch, operating funds in Taiwan) of at least 500.000 TWD or turnover of at least 3.000.000 TWD; for a company of 1 year or more, average turnover for the last 1 year or 3 years of at least 3.000.000 TWD. If the employer hires 2 or more foreigners of the same type, those foreigners and the employer must meet the general standards of Chapter 2 (Article 38, paragraph 2)."

### bg
- 003 F-011: "The insurer does not pay compensation if the injured person or another entitled person caused the accident intentionally or while committing a crime (Article 28)."
- 006 L77: "In the end the judges of the Constitutional Court (大法官), by interpretative decision No. 649 of the Judicial Yuan (司法院) (釋字第649號) of October 31, 2008, declared unconstitutional (違憲) the rule under which only persons with visual impairment could engage in massage activity, and the rule lost effect on October 31, 2011, after the expiry of the 3-year transitional period permitted by the interpretation."
- 008 인용 블록: "The Labor Pension Act applies to citizens of Taiwan, to foreigners married to a citizen of Taiwan who have obtained the right of residence, to foreigners who have obtained permanent residence, and to similar workers (Article 7, paragraph 1), and from 2026 also to foreign specialists doing professional work (Article 24 of the Act on Attracting and Employing Foreign Specialists, linked); the statutory severance of other workers, and for service before this Act applied, is calculated under Article 17 of the Labor Standards Act. Service under 1 year is calculated pro rata, and the company must pay the severance within 30 days after the contract is terminated."
- 010 지급 의무자: "obliged the company that operates the fitness hall (one of the defendants) to pay [1.579.589 TWD] and the interest stated in the decision."
- 017 §68 본문: "A foreigner who works without permission is subject to an administrative fine, must be immediately ordered to leave Taiwan (限令出國) and may not work in Taiwan again (Article 68 of the Employment Services Act, 就業服務法)."
- 018 §39 문단: "For the manager (經理人) of a Taiwan subsidiary of a foreign company (a company with investment permission in which foreigners hold more than 1/3 of the shares) and of a branch, the work-permit application is relatively easier. However, even when hiring the first foreigner the employer must meet one of the criteria of Article 39 of the Standards for Qualification and Review of Foreigners' Work (工作資格及審查標準). For a company under 1 year old the criteria include paid-in capital (for a branch, operating funds in Taiwan) of at least 500.000 TWD or turnover of at least 3.000.000 TWD; for a company 1 year old or more, average turnover for the last 1 year or last 3 years of at least 3.000.000 TWD. If the employer hires 2 or more foreigners of the same type, those foreigners and the employer must meet the general standards of Chapter 2 (Article 38, paragraph 2)."

### sr
- 003 F-011: "The insurer does not pay compensation if the injured person or another person with a claim caused the accident intentionally or while committing a criminal offense (Article 28)."
- 006 L77: "In the end the judges of the Judicial Yuan (大法官), in Interpretation No. 649 (釋字第649號) of October 31, 2008, declared that provision, which allowed only persons with visual impairment to work as masseurs, unconstitutional (違憲), and the provision ceased to apply on October 31, 2011, upon expiry of the 3-year transitional period the interpretation allowed."
- 008 인용 블록: "The Act on Pensions of Workers applies to Taiwanese citizens, to foreigners married to a Taiwanese citizen who have been granted residence, to foreigners who have been granted permanent residence and to similar workers (Article 7, paragraph 1), and from 2026 also to foreign professionals performing professional work (Article 24 of the Act on Attracting and Employing Foreign Professionals, linked); severance for other workers, as well as for service before the application of that Act, is calculated under Article 17 of the Labor Standards Act. Service shorter than 1 year is calculated proportionally, and the company must pay severance within 30 days after the contract ends."
- 010 지급 의무자: "ordered the company that operates the gym (one of the defendants) to pay [1.579.589 TWD] and the interest stated in the judgment."
- 017 §68 본문: "A foreigner who works without permission is subject to an administrative fine, must immediately be ordered to leave Taiwan (限令出國) and may not work in Taiwan again (Article 68 of the Employment Services Act, 就業服務法)."
- 018 §39 문단: "For a manager of a Taiwan subsidiary of a foreign company (a company with investment approval in which foreigners hold more than 1/3 of the shares) and of a branch, the work-permit application is relatively easier. However, even when hiring the first foreigner, the employer must meet one of the criteria of Article 39 of the Standards on Qualifications and Review of Foreigners' Work (工作資格及審查標準). For a company younger than 1 year the criteria include paid-in capital (for a branch, operating funds in Taiwan) of at least 500.000 TWD or revenue of at least 3.000.000 TWD; for a company 1 year old or older, average revenue for the last 1 year or last 3 years of at least 3.000.000 TWD. If the employer hires two or more foreigners of the same type, those foreigners and the employer must meet the general standards of Chapter 2 (Article 38, paragraph 2)."

### mn
- 003 F-011: "If the victim or another person entitled to claim caused the accident intentionally or while committing a crime, the insurer does not pay benefits (Article 28)."
- 006 L77: "In the end the judges of the Constitutional Court (大法官), in Interpretation No. 649 (釋字第649號) of the Judicial Yuan (司法院) dated October 31, 2008, declared unconstitutional (違憲) the provision that only visually impaired people may engage in massage work, and that provision ceased to be in force on October 31, 2011, when the 3-year transitional period allowed by the interpretation ended."
- 008 인용 블록: "The Labor Pension Act applies to Taiwanese citizens, to foreign nationals married to a Taiwanese citizen who have obtained residence rights, to foreign nationals who have obtained permanent residence rights, and to similar workers (Article 7, paragraph 1), and from 2026 to foreign professionals doing professional work (Article 24 of the Act for the Recruitment and Employment of Foreign Professionals, linked); severance for other workers, and for the service period before that Act took effect, is calculated under Article 17 of the Labor Standards Act. Service of less than 1 year is calculated proportionally, and the company must pay severance within 30 days after the contract ends."
- 010 지급 의무자: "the court obliged the company that operates the fitness hall, one of the defendants, to pay [TWD 1,579,589] and the interest stated in the judgment."
- 017 §68 본문: "A foreign national who worked without permission is subject to an administrative fine and must be immediately ordered to leave Taiwan (限令出國), and also may not work in Taiwan again (Article 68 of the Employment Services Act, 就業服務法)."
- 018 §39 문단: "For the Taiwan subsidiary of a foreign company (a company with investment approval in which foreign nationals own more than 1/3 of the shares) and for branch management, applying for a work permit is relatively easy. But even when employing the first foreign national, the employer must meet one of the criteria stated in Article 39 of the Standards of Qualification and Review of Foreign Nationals' Work (工作資格及審查標準). For a company under 1 year old, the criteria include paid-in capital (for a branch, operating funds in Taiwan) of at least TWD 500,000 or revenue of at least TWD 3,000,000; for a company 1 year old or more, average revenue over the last 1 year or 3 years of at least TWD 3,000,000. If the employer employs 2 or more foreign nationals of the same type, those foreign nationals and the employer must meet the general standards of Chapter 2 (Article 38, paragraph 2)."
