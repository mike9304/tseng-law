# gx-1 보고 — WO-GUIDANCE-FACTFIX (담당 locale: vi id ms fil th)

작업 공간: /Users/son7/projects/tseng-law-guidance-fix-20261007 (편집 파일은 `src/content/columns-{vi,id,ms,fil,th}/{003,006,008,010,017,018}-*.md` 30개뿐, git 쓰기 명령 미사용). 모든 파일 frontmatter `lastmod`만 `"2026-10-07"`로 변경(따옴표 형식 유지). 방법: 항목마다 en BEFORE에 해당하는 문장을 대상 파일에서 찾아 문자열 단위로 정확히 1회 매칭(assert count==1)되는 곳만 교체하는 스크립트로 적용했고, 그 문장 밖은 건드리지 않았다.

## 1. 적용 항목 수 (locale별 · 칼럼별)

| locale | 003 | 006 | 008 | 010 | 017 | 018 | 합계 |
|---|---|---|---|---|---|---|---|
| vi | 3/3 | 3/3 | 10/10 | 2/2 | 2/2 | 4/4 | 24/24 |
| id | 3/3 | 3/3 | 10/10 | 2/2 | 2/2 | 4/4 | 24/24 |
| ms | 3/3 | 3/3 | 10/10 | 2/2 | 2/2 | 4/4 | 24/24 |
| fil | 3/3 | 3/3 | 10/10 | 2/2 | 2/2 | 4/4 | 24/24 |
| th | 3/3 | 3/3 | 10/10 | 2/2 | 2/2 | 4/4 | 24/24 |

**NOT FOUND 항목: 없음** (24개 × 5 locale 전부 대상 문장을 찾아 적용).

### 구현 메모 (항목은 적용했으나 구조·부분 적용에 유의할 점)
- 006(전 locale): 린 씨 문장이 en과 달리 두 블록으로 쪼개져 있다(`...2003, ...이발소를 운영` / 다음 블록 `...두 명을 고용...`). 첫 블록만 고쳐 "2011-10-31까지 효력, 그 기간 중인 2003년"으로 만들었고 둘째 블록은 그대로다. 과태료 주체(臺北市社會局)는 파일에 이미 있던 `罰鍰`(행정 과태료) 표기를 유지한 채 주어만 넣었다.
- 008(전 locale): 새 문단 둘(Article 14 / §12② 30일)은 en과 같은 위치(자발적 퇴사 설명 바로 뒤, 징계해고 목록 바로 뒤)에 독립 문단으로 넣었고, 그 바로 뒤에 있던 `​`(zero-width) 줄은 지우지 않고 새 문단 **뒤**에 그대로 남겼다. 본문 목록(중대한 위반·6일)은 줄바꿈으로 쪼개진 원문 줄 단위로 고쳤다.
- 008 표 §11 4·5호(F-017⑤): 3번째 칸 "예외(Article 14)" 추가는 전 locale 적용. 조문 번역 자체는 vi·th는 이미 AFTER와 같은 뜻(4호 "업무성질 변경+감원 필요+배치할 적당한 직무 없음", 5호 "확실히 감당 불가")이라 **수정 불필요**로 두었고, id는 5호만(`secara memuaskan` 제거 → "jelas tidak mampu"), ms·fil은 4호("성질이 바뀌어")·5호 둘 다 고쳤다.
- 008 인용 블록(전 locale): AFTER와 같이 §7①·外專法 §24(링크 `https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=24`)·1년 미만 비례·30일 내 지급까지 한 번에 넣었다. FAQ②(frontmatter)에는 링크 없이 같은 뜻을 넣었다. 법명은 각 파일의 기존 표기(예: id `Peraturan Dana Pensiun Pekerja (勞工退休金條例)`, ms `peraturan pencen persaraan pekerja`)를 따랐고 外專法은 새로 `外國專業人才延攬及僱用法`를 병기했다.
- 010: 소비자보호법 §7③ 문장은 en과 같이 §7 문장 바로 뒤에 같은 문단으로 이었다.
- 017: §68 본문 문장 교체 + 출처 목록 한 줄 추가(기존 `Article 68` 항목 바로 아래, 그 파일의 항목 형식 그대로 + "(법령 데이터베이스)" 번역 병기).
- 018: ① 발기인(`發起人`) ② §387-1(`勞動權益講習`, `公司法` 병기)은 자회사 절차 문단 끝에 이어 붙임 ③ 거류증은 외국인 본인이 이민서에 신청 ④ §39·§38② 문단(자회사 괄호 정의 + 첫 1명부터 §39 + 일반 기준 §38②) 교체.

## 2. 검증 출력 (verbatim)

### 2-1. numbers 줄 (WO 검증 루프 그대로, 30개)
```
== vi 003
numbers        FAIL   missing from translation (14): 0, 7, 9, 10×2, 62, 110×2, 119×2, 144, 208×2, 276
== vi 006
numbers        WARN   extra in translation (5): 1×3, 2×2
== vi 008
numbers        WARN   수사미해석 (1): 제3호
== vi 010
numbers        WARN   extra in translation (1): 2020
== vi 017
numbers        PASS   sourceCount=38 targetCount=38
== vi 018
numbers        FAIL   missing from translation (1): 6
== id 003
numbers        FAIL   missing from translation (14): 0, 7, 9, 10×2, 62, 110×2, 119×2, 144, 208×2, 276
== id 006
numbers        WARN   extra in translation (3): 1×2, 2
== id 008
numbers        WARN   수사미해석 (3): 제1항; 제2항; 제1항
== id 010
numbers        WARN   extra in translation (1): 2020
== id 017
numbers        PASS   sourceCount=38 targetCount=38
== id 018
numbers        FAIL   missing from translation (2): 6×2
== ms 003
numbers        FAIL   missing from translation (14): 0, 7, 9, 10×2, 62, 110×2, 119×2, 144, 208×2, 276
== ms 006
numbers        WARN   extra in translation (2): 2×2
== ms 008
numbers        WARN   수사미해석 (4): 제1항; 제3호; 제2항; 제1항
== ms 010
numbers        WARN   extra in translation (1): 2020
== ms 017
numbers        WARN   수사미해석 (2): 제3자; 제3자
== ms 018
numbers        FAIL   missing from translation (2): 6×2
== fil 003
numbers        FAIL   missing from translation (14): 0, 7, 9, 10×2, 62, 110×2, 119×2, 144, 208×2, 276
== fil 006
numbers        WARN   extra in translation (7): 1×5, 2×2
== fil 008
numbers        WARN   수사미해석 (2): 제3호; 제2항
== fil 010
numbers        WARN   extra in translation (1): 2020
== fil 017
numbers        PASS   sourceCount=38 targetCount=38
== fil 018
numbers        FAIL   missing from translation (2): 6×2
== th 003
numbers        FAIL   missing from translation (14): 0, 7, 9, 10×2, 62, 110×2, 119×2, 144, 208×2, 276
== th 006
numbers        WARN   extra in translation (2): 2×2
== th 008
numbers        WARN   수사미해석 (1): 제3호
== th 010
numbers        WARN   extra in translation (1): 2020
== th 017
numbers        PASS   sourceCount=38 targetCount=38
== th 018
numbers        FAIL   missing from translation (2): 6×2
```

### 2-2. `**` / 한글 / diff --stat
```
### vi
$ grep -l '\*\*' src/content/columns-vi/{003,006,008,010,017,018}-*.md
(exit=1 ; no output above = pass)
$ grep -n '[가-힣]' ... | grep -v url:
(no output above = pass)
$ git diff --stat -- src/content/columns-vi/
 .../003-taiwan-traffic-accident-procedure.md       |  8 ++++----
 .../columns-vi/006-taiwan-massage-history-law.md   |  8 ++++----
 .../columns-vi/008-taiwan-labor-severance-law.md   | 22 +++++++++++++---------
 .../columns-vi/010-taiwan-gym-injury-lawsuit.md    |  6 +++---
 .../017-taiwan-logistics-business-setup.md         |  5 +++--
 .../018-taiwan-semiconductor-market-entry.md       | 10 +++++-----
 6 files changed, 32 insertions(+), 27 deletions(-)
### id
$ grep -l '\*\*' src/content/columns-id/{003,006,008,010,017,018}-*.md
(exit=1 ; no output above = pass)
$ grep -n '[가-힣]' ... | grep -v url:
(no output above = pass)
$ git diff --stat -- src/content/columns-id/
 .../003-taiwan-traffic-accident-procedure.md       |  8 ++++----
 .../columns-id/006-taiwan-massage-history-law.md   |  8 ++++----
 .../columns-id/008-taiwan-labor-severance-law.md   | 24 +++++++++++++---------
 .../columns-id/010-taiwan-gym-injury-lawsuit.md    |  6 +++---
 .../017-taiwan-logistics-business-setup.md         |  5 +++--
 .../018-taiwan-semiconductor-market-entry.md       | 10 ++++-----
 6 files changed, 33 insertions(+), 28 deletions(-)
### ms
$ grep -l '\*\*' src/content/columns-ms/{003,006,008,010,017,018}-*.md
(exit=1 ; no output above = pass)
$ grep -n '[가-힣]' ... | grep -v url:
(no output above = pass)
$ git diff --stat -- src/content/columns-ms/
 .../003-taiwan-traffic-accident-procedure.md       |  8 ++++----
 .../columns-ms/006-taiwan-massage-history-law.md   |  8 ++++----
 .../columns-ms/008-taiwan-labor-severance-law.md   | 24 +++++++++++++---------
 .../columns-ms/010-taiwan-gym-injury-lawsuit.md    |  6 +++---
 .../017-taiwan-logistics-business-setup.md         |  5 +++--
 .../018-taiwan-semiconductor-market-entry.md       | 10 ++++-----
 6 files changed, 33 insertions(+), 28 deletions(-)
### fil
$ grep -l '\*\*' src/content/columns-fil/{003,006,008,010,017,018}-*.md
(exit=1 ; no output above = pass)
$ grep -n '[가-힣]' ... | grep -v url:
(no output above = pass)
$ git diff --stat -- src/content/columns-fil/
 .../003-taiwan-traffic-accident-procedure.md       |  8 ++++----
 .../columns-fil/006-taiwan-massage-history-law.md  |  8 ++++----
 .../columns-fil/008-taiwan-labor-severance-law.md  | 24 +++++++++++++---------
 .../columns-fil/010-taiwan-gym-injury-lawsuit.md   |  6 +++---
 .../017-taiwan-logistics-business-setup.md         |  5 +++--
 .../018-taiwan-semiconductor-market-entry.md       | 10 ++++-----
 6 files changed, 33 insertions(+), 28 deletions(-)
### th
$ grep -l '\*\*' src/content/columns-th/{003,006,008,010,017,018}-*.md
(exit=1 ; no output above = pass)
$ grep -n '[가-힣]' ... | grep -v url:
(no output above = pass)
$ git diff --stat -- src/content/columns-th/
 .../003-taiwan-traffic-accident-procedure.md       |  8 ++++----
 .../columns-th/006-taiwan-massage-history-law.md   |  8 ++++----
 .../columns-th/008-taiwan-labor-severance-law.md   | 22 +++++++++++++---------
 .../columns-th/010-taiwan-gym-injury-lawsuit.md    |  6 +++---
 .../017-taiwan-logistics-business-setup.md         |  5 +++--
 .../018-taiwan-semiconductor-market-entry.md       | 10 +++++-----
 6 files changed, 32 insertions(+), 27 deletions(-)
```

### 2-3. 목표 숫자 대비 판정
- 003: 5개 locale 모두 `28`이 사라짐. 남은 것은 허용 목록(0·7·9·10×2·62·110×2·119×2·144·208×2·276)과 정확히 같다.
- 006: 5개 locale 모두 3·10·31·649·2008·2011 사라짐(FAIL → WARN, 남은 WARN은 HEAD에서도 있던 "extra" 숫자: vi 1×3·2×2, id 1×2·2, ms 2×2, fil 1×5·2×2, th 2×2 — `(1萬元)`·`(2萬元)` 등 기존 본문 때문이며 내 수정과 무관, HEAD 대조 확인).
- 008: 5개 locale 모두 missing 목록 자체가 사라짐(FAIL → WARN, 남은 것은 "수사미해석" 경고뿐: vi/th `제3호`, id `제1항·제2항·제1항`, ms `제1항·제3호·제2항·제1항`, fil `제3호·제2항`).
- 010: 5개 locale 모두 `3` 사라짐(남은 WARN은 HEAD에도 있던 extra `2020`).
- 017: vi·id·fil·th는 `PASS`(68 해소, `sourceCount=38 targetCount=38`), ms는 `WARN`(수사미해석 `제3자`×2, HEAD에도 있던 항목).
- 018: 목표 숫자 1·3·38·39·387·2026·500000·3000000 전부 사라짐. 남은 것: vi는 `6` 1개(소제목 번호 6, 허용), id·ms·fil·th는 `6×2` — 하나는 소제목 번호 6(허용), 다른 하나는 §387-1 시행 월 "6월"이다. 검증기의 날짜 파서가 "일 + 월명 + 연도" 형식만 날짜로 읽기 때문에 월명만 있는 표현(Thai `เดือนมิถุนายน ค.ศ. 2026`, id `bulan Juni tahun 2026`, ms `bulan Jun tahun 2026`, fil `Hunyo ng 2026`)에서는 6이 추출되지 않는다. vi는 `tháng 6 năm 2026` 형식이라 6이 잡혀 `6` 1개만 남는다. 그 밖의 숫자는 남지 않았다(th의 extra `3`·`8`은 아래 3번 참고).

## 3. 편차·특이사항 (리드 확인용)
1. **frontmatter 검사 FAIL은 HEAD 때부터 있던 것**: `check-column-translation.mjs`의 frontmatter 항목은 source(ko `lastmod: "2026-10-06"`)와 lastmod 바이트를 비교한다. HEAD의 안내 locale은 `"2026-09-10"` 등이라 이미 FAIL이었고(003은 `diagram`·`diagram_after` 키 부재로 FAIL), WO대로 `"2026-10-07"`을 쓴 지금도 ko(`"2026-10-06"`)와 바이트가 달라 FAIL 상태는 그대로다(4번 비교표에서 상태 변화 없음). ko 쪽 lastmod를 같은 날로 맞출지는 리드 판단 사항.
2. **검증기 날짜 파서 회피**: id·ms·fil의 "2026년 6월" 표현은 `Juni 2026`/`Jun 2026`/`Hunyo 2026` 형식이면 파서가 `Juni 20` + `26`으로 쪼개 2026이 missing·`20`,`26`이 extra로 나오는 오탐이 났다. 그래서 `bulan Juni tahun 2026`(id), `mulai bulan Jun tahun 2026`(ms), `Hunyo ng 2026`(fil)로 썼다(뜻은 같고 자연스러운 표현).
3. **숫자 표기 보정**: fil은 검증기가 `ikalawang talata`·`ikatlong talata`를 2·3으로 읽지 못해 `talata 2`(008 §12②)·`talata 3`(010 소비자보호법 §7③)로 숫자 표기했고, `higit sa isang ikatlo ng shares`(1/3)로 썼다. ms는 `melebihi 1/3`로 썼다(검증기 어휘에 `satu pertiga` 없음). th 018의 extra `3`은 th 018 68행(기존 문장, `30 ล้าน…100 คน` 부근)에서 HEAD 때부터 나오던 토큰이며, HEAD에서는 `3분의 1`·`3년` 누락과 상쇄되어 보이지 않았을 뿐이다(해당 줄은 발기인 단어 교체 외 변경 없음, 토큰 목록 HEAD와 동일).
4. **nationality 검사(th 018)**: 처음 `กระทรวงมหาดไทยไต้หวัน`으로 쓴 이민서 표기가 `ไทย`(태국) 때문에 nationality 검사를 FAIL시켜서 th 018에서만 `สำนักงานตรวจคนเข้าเมือง (內政部移民署)`로 바꿔 PASS를 확인했다(th 017의 기존 표기는 손대지 않음).
5. **용어 선택**: 發起人 → vi `người sáng lập`, id `pendiri`, ms `penaja`, fil `promoter`, th `ผู้เริ่มก่อการ`(모두 `(發起人)` 병기, 주주 아님). 罰鍰은 006 전 파일에 이미 있던 표기를 유지. 勞動權益講習 → vi `khóa tập huấn về quyền lợi lao động`, id `kursus hak-hak ketenagakerjaan`, ms `kursus hak buruh`, fil `kursong pang-karapatan sa paggawa`, th `หลักสูตรอบรมสิทธิแรงงาน`.
6. 새 서비스 주장·굵은 글씨·한글·`[변호사 검수 필요]`는 넣지 않았다(2-2 검증 참고). 소제목 번호·문단 삭제·축약 없음.

7. **리드 보충 지시 3건 확인**: ① 003 F-011 문장은 5개 locale 모두 `強制汽車責任保險法` 제6조를 언급한 문단(파일 174행) 맨 끝에 붙였다(문단 시작이 각각 Điều 6 / Pasal 6 / perkara 6 / Artikulo 6 / มาตรา 6). ② 018 §387-1은 "2026년 6월 시행"만 옮겼고 적용 대상·시점에 대한 해석 문구는 없다. ③ 포매터·git stash·커밋은 쓰지 않았다. 다만 이 지시를 받기 전에 **여러 파일을 한 번에 수정하는 파이썬 스크립트**(칼럼별 `e003.py` 등)를 썼음을 밝힌다: 정규식·일괄 패턴 치환이 아니라 파일별로 직접 쓴 정확 문자열 쌍을 `count==1`로 단언해 교체하는 방식이고(불일치 시 즉시 중단, 한 건도 실패 없이 통과), 스크립트는 전부 worktree 밖 `/private/tmp/claude-501/-Users-son7/560beab3-55a9-4675-9e09-8a5b94308f73/scratchpad/gx/`에 있으며 worktree에는 편집 대상 30개 `.md` 외에 아무것도 만들지 않았다.
8. th 006·th 017의 `nationality FAIL`은 HEAD에서도 있던 것이다(4번 비교표에서 변화 없음). 이번에 th 018에만 새로 생길 뻔한 것을 위 4번 항목대로 피했다.

## 4. 검사기 전체 항목 HEAD 대비 변화 (numbers 외 항목 회귀 확인)
각 파일을 HEAD 버전과 현재 버전에 대해 같은 검사기로 돌려 상태(PASS/WARN/FAIL)를 비교한 결과. `HEAD->now` 아래 diff가 비어 있으면 상태 변화 없음.
```
== vi 003  HEAD->now
   now non-PASS: frontmatter FAIL;blocks FAIL;links FAIL;numbers FAIL;
== vi 006  HEAD->now
11c11
< numbers FAIL
---
> numbers WARN
   now non-PASS: frontmatter FAIL;numbers WARN;
== vi 008  HEAD->now
5c5
< links FAIL
---
> links PASS
11c11
< numbers FAIL
---
> numbers WARN
   now non-PASS: frontmatter FAIL;blocks FAIL;numbers WARN;
== vi 010  HEAD->now
11c11
< numbers FAIL
---
> numbers WARN
   now non-PASS: frontmatter FAIL;numbers WARN;
== vi 017  HEAD->now
5c5
< links FAIL
---
> links PASS
11c11
< numbers FAIL
---
> numbers PASS
   now non-PASS: frontmatter FAIL;blocks FAIL;
== vi 018  HEAD->now
   now non-PASS: frontmatter FAIL;headings FAIL;blocks FAIL;numbers FAIL;
== id 003  HEAD->now
   now non-PASS: frontmatter FAIL;blocks FAIL;links FAIL;numbers FAIL;
== id 006  HEAD->now
11c11
< numbers FAIL
---
> numbers WARN
   now non-PASS: frontmatter FAIL;numbers WARN;
== id 008  HEAD->now
5c5
< links FAIL
---
> links PASS
11c11
< numbers FAIL
---
> numbers WARN
   now non-PASS: frontmatter FAIL;blocks FAIL;numbers WARN;
== id 010  HEAD->now
11c11
< numbers FAIL
---
> numbers WARN
   now non-PASS: frontmatter FAIL;numbers WARN;
== id 017  HEAD->now
5c5
< links FAIL
---
> links PASS
11c11
< numbers FAIL
---
> numbers PASS
   now non-PASS: frontmatter FAIL;blocks FAIL;
== id 018  HEAD->now
   now non-PASS: frontmatter FAIL;headings FAIL;blocks FAIL;numbers FAIL;
== ms 003  HEAD->now
   now non-PASS: frontmatter FAIL;blocks FAIL;links FAIL;numbers FAIL;
== ms 006  HEAD->now
11c11
< numbers FAIL
---
> numbers WARN
   now non-PASS: frontmatter FAIL;numbers WARN;
== ms 008  HEAD->now
5c5
< links FAIL
---
> links PASS
11c11
< numbers FAIL
---
> numbers WARN
   now non-PASS: frontmatter FAIL;blocks FAIL;numbers WARN;
== ms 010  HEAD->now
11c11
< numbers FAIL
---
> numbers WARN
   now non-PASS: frontmatter FAIL;numbers WARN;
== ms 017  HEAD->now
5c5
< links FAIL
---
> links PASS
11c11
< numbers FAIL
---
> numbers WARN
   now non-PASS: frontmatter FAIL;blocks FAIL;numbers WARN;
== ms 018  HEAD->now
   now non-PASS: frontmatter FAIL;headings FAIL;blocks FAIL;numbers FAIL;
== fil 003  HEAD->now
   now non-PASS: frontmatter FAIL;blocks FAIL;links FAIL;english WARN;numbers FAIL;
== fil 006  HEAD->now
11c11
< numbers FAIL
---
> numbers WARN
   now non-PASS: frontmatter FAIL;numbers WARN;
== fil 008  HEAD->now
5c5
< links FAIL
---
> links PASS
11c11
< numbers FAIL
---
> numbers WARN
   now non-PASS: frontmatter FAIL;blocks FAIL;numbers WARN;
== fil 010  HEAD->now
11c11
< numbers FAIL
---
> numbers WARN
   now non-PASS: frontmatter FAIL;english WARN;numbers WARN;
== fil 017  HEAD->now
5c5
< links FAIL
---
> links PASS
11c11
< numbers FAIL
---
> numbers PASS
   now non-PASS: frontmatter FAIL;blocks FAIL;english WARN;
== fil 018  HEAD->now
   now non-PASS: frontmatter FAIL;headings FAIL;blocks FAIL;english WARN;numbers FAIL;
== th 003  HEAD->now
   now non-PASS: frontmatter FAIL;blocks FAIL;links FAIL;numbers FAIL;
== th 006  HEAD->now
11c11
< numbers FAIL
---
> numbers WARN
   now non-PASS: frontmatter FAIL;numbers WARN;nationality FAIL;
== th 008  HEAD->now
5c5
< links FAIL
---
> links PASS
11c11
< numbers FAIL
---
> numbers WARN
   now non-PASS: frontmatter FAIL;blocks FAIL;numbers WARN;
== th 010  HEAD->now
   now non-PASS: frontmatter FAIL;numbers WARN;
== th 017  HEAD->now
5c5
< links FAIL
---
> links PASS
11c11
< numbers FAIL
---
> numbers PASS
   now non-PASS: frontmatter FAIL;blocks FAIL;nationality FAIL;
== th 018  HEAD->now
   now non-PASS: frontmatter FAIL;headings FAIL;blocks FAIL;numbers FAIL;
DONE
```

## 역번역 (영어 직역, locale별 핵심 6항목)

### vi
1. 003 F-011: "The insurance enterprise does not pay when the injured person or another person entitled to claim intentionally caused the accident or caused it while committing a criminal act (Article 28)."
2. 006 L77 (釋字649·2011): "Finally, in Interpretation No. 649 (釋字第649號) of the Judicial Yuan of October 31, 2008, the constitutional judges declared the provision allowing only visually impaired people to practice massage unconstitutional (違憲), and this provision lost effect on October 31, 2011, when the three-year transitional period allowed by the interpretation ended."
3. 008 인용 블록 (勞退 §7①·外專法 §24): "...no cap. The Labor Pension Act applies to Taiwanese citizens, foreigners married to a Taiwanese citizen and granted residence permission, foreigners granted permanent residence, and similar workers (Article 7, paragraph 1), and from 2026 also to foreign professionals doing professional work ([Article 24 of the Act for the Recruitment and Employment of Foreign Professionals (外國專業人才延攬及僱用法)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=24)); severance for other workers, and for service periods before this law applied, is calculated under Article 17 of the Labor Standards Act. Service of less than one year is calculated pro rata, and the company must pay the severance within 30 days after the contract ends."
4. 010 지급 의무자: "...the Taichung District Court ordered the company operating the gym, one of the defendants, to pay [NT$1,579,589] together with the interest stated in the judgment."
5. 017 §68 본문: "A foreign national who works without a permit is subject to an administrative fine, must be ordered to leave Taiwan immediately, and may not work in Taiwan again (Article 68 of the Employment Service Act, 就業服務法). [existing sentences follow unchanged]"
6. 018 §39 문단: "The manager of a Taiwan subsidiary of a foreign company (a company approved for investment in which foreigners hold more than one third of the shares) and of a Taiwan branch finds it easier to apply for a work permit. However, even when hiring the first foreign national, the employer must meet one of the criteria in Article 39 of the Qualification and Review Standards for foreign nationals' work. For a company established less than one year ago, the criteria include paid-in capital (for a branch, operating funds in Taiwan) of at least NT$500,000 or revenue of at least NT$3 million; for a company established one year or more ago, the criteria include average revenue over the most recent one year or three years of at least NT$3 million. If the employer hires two or more foreign nationals of the same type, those foreign nationals and the employer must meet the general standards of Chapter 2 (Article 38, paragraph 2). If you plan to have foreign staff work in Taiwan, confirm before forming the Taiwan company whether the capital level reaches the threshold."

### id
1. 003 F-011: "The insurer does not pay benefits if the injured person or another party entitled to claim caused the accident intentionally or while committing a criminal act (Article 28)."
2. 006 L77: "In the end, in Judicial Interpretation No. 649 (釋字第649號) dated October 31, 2008, the constitutional judges (大法官) declared that the statutory provision allowing only visually impaired persons to work in the massage business is contrary to the constitution (違憲), and that provision lost its force on October 31, 2011, that is, at the end of the three-year grace period given by the interpretation."
3. 008 인용 블록: "...without an upper limit. The Workers' Pension Regulation [file's name: Peraturan Dana Pensiun Pekerja] applies to Taiwanese citizens, foreign nationals married to a Taiwanese citizen who have obtained a residence permit, foreign nationals who have obtained a permanent residence permit, and similar workers (Article 7, paragraph (1)), and since 2026 also to foreign professionals doing professional work ([Article 24 of the Act on the Recruitment and Use of Foreign Professionals (外國專業人才延攬及僱用法)](...)); severance for other workers, and for service periods before that regulation applied, is calculated under Article 17 of the Labor Standards Act. Service of less than one year is calculated proportionally, and the company must pay the severance within 30 days after the employment agreement ends."
4. 010 지급 의무자: "...which ordered the company that manages the fitness center, one of the defendants, to pay [1,579,589 new Taiwan dollars] together with the interest stated in the judgment."
5. 017 §68 본문: "A foreign national who works without a permit is subject to an administrative fine and must immediately be ordered to leave Taiwan (限令出國), and may not work in Taiwan again (Article 68 of the Employment Services Act, 就業服務法). [existing sentences follow unchanged]"
6. 018 §39 문단: "A manager of a subsidiary (a company whose investment is approved and more than one third of whose shares are held by foreign nationals) or a Taiwan branch of a foreign company generally obtains a work permit more easily, but that is not a guarantee of approval. However, even when employing the first foreign national, the employer must meet one of the criteria in Article 39 of the Qualification and Review Standards for foreign nationals' work. For a company less than one year old, the criteria include paid-in capital (for a branch, operating funds in Taiwan) of at least TWD 500,000 or turnover of at least TWD 3 million; for a company one year old or more, the criteria include average turnover over the most recent one year or three years of at least TWD 3 million. If the employer employs two or more foreign nationals of the same type, those foreign nationals and the employer must meet the general standards of Chapter 2 (Article 38, paragraph (2)). If you plan to have foreign staff work in Taiwan, before forming the Taiwan company you must confirm whether the capital level reaches that threshold."

### ms
1. 003 F-011: "The insurer does not pay benefits if the injured person or another person entitled to claim caused the accident intentionally or while committing a crime (article 28)."
2. 006 L77: "Finally, in Judicial Yuan Interpretation No. 649 (釋字第649號) dated October 31, 2008, the constitutional judges (大法官) declared unconstitutional (違憲) the provision that only permits people with visual impairment to work in massage, and that provision ceased to be in force on October 31, 2011, at the end of the three-year deferral period allowed by the interpretation."
3. 008 인용 블록: "...without a ceiling. The workers' retirement pension regulation applies to Taiwanese citizens, foreigners married to a Taiwanese citizen and granted residence, foreigners granted permanent residence, and similar workers (article 7, paragraph 1), and from 2026 also to foreign professionals doing professional work ([article 24 of the act on the recruitment and employment of foreign professionals (外國專業人才延攬及僱用法)](...)); severance for other workers, and for seniority before that regulation applied, is calculated under article 17 of the labour standards act. Service of less than one year is calculated proportionally, and the company must pay severance within 30 days after the contract ends."
4. 010 지급 의무자: "...ordered the company that operates the fitness centre, being one of the defendants, to pay [1,579,589 TWD] together with the interest stated in the judgment."
5. 017 §68 본문: "A foreign national who works without a licence is subject to an administrative fine and must be immediately ordered to leave Taiwan (限令出國), and may not work in Taiwan again (article 68 of the employment services act, 就業服務法). [existing sentences follow unchanged]"
6. 018 §39 문단: "It is somewhat easier to obtain a work permit for a manager of a subsidiary (a company whose investment is approved and whose shares are held by foreigners above 1/3) or a Taiwan branch of a foreign company. However, even when taking on the first foreigner, the employer must meet one of the criteria in article 39 of the Qualification and Review Standards for foreigners' work. For a company less than one year old, the criteria include paid-up capital (for a branch, operating funds in Taiwan) of at least TWD 500,000 or revenue of at least TWD 3,000,000; for a company one year old or more, the criteria include average revenue over the latest one year or three years of at least TWD 3,000,000. If the employer takes on two or more foreigners of the same type, those foreigners and the employer must meet the general standards of Chapter 2 (article 38, paragraph 2). If you plan for foreign staff to work in Taiwan, it must be confirmed before forming the company whether the planned capital reaches the applicable threshold."

### fil
1. 003 F-011: "The insurance company does not pay benefits when the injured person or the other person entitled to claim is the one who caused the accident deliberately or while committing a crime (Article 28)."
2. 006 L77: "In the end, in Judicial Yuan Interpretation No. 649 (釋字第649號) of October 31, 2008, the Grand Justices (大法官) declared unconstitutional (違憲) the provision stating that only people with visual impairment may work in the massage industry, and the provision lost its effect on October 31, 2011, at the end of the three-year grace period allowed by the interpretation."
3. 008 인용 블록: "...without limit. The Labor Pension Act applies to citizens of Taiwan, to foreigners who have a spouse who is a citizen of Taiwan and have been granted residency, to foreigners who have been granted permanent residency, and to similar workers (Article 7, first paragraph), and from 2026 also applies to foreign professionals doing professional work ([Article 24 of the Act on Recruiting and Employing Foreign Professionals (外國專業人才延攬及僱用法)](...)); the separation pay of other workers, and for the period of service before it applied, is computed according to Article 17 of the Labor Standards Act. Service of less than one year is computed proportionally, and the company must pay the separation pay within 30 days after the contract ends."
4. 010 지급 의무자: "...the Taichung District Court ordered the company operating the gym, one of the respondents, to pay [TWD 1,579,589], together with the interest stated in the judgment."
5. 017 §68 본문: "A foreigner who works without permission is fined administratively and must be immediately ordered to leave Taiwan (限令出國), and may no longer work in Taiwan (Article 68 of the Employment Service Act, 就業服務法). [existing sentences follow unchanged]"
6. 018 §39 문단: "The manager of a subsidiary in Taiwan (a company whose investment is approved and in which foreigners hold more than one third of the shares) or of a branch more often meets the standard for a work permit; this is not a promise of approval. But even in hiring the first foreigner, the employer must meet one of the standards in Article 39 of the Qualification and Review Standards for the work of foreigners. For a company less than one year old, the standards include paid-up capital (for a branch, operating funds in Taiwan) of at least TWD 500,000 or revenue of at least TWD 3 million; for a company one year or more old, the standards include average revenue in the past one year or three years of at least TWD 3 million. If the employer hires two or more foreigners of the same type, those foreigners and the employer must meet the general standards of Chapter 2 (Article 38, second paragraph). If foreign personnel are planned to work in Taiwan, confirm before forming the company in Taiwan whether the planned capital meets the applicable threshold."

### th
1. 003 F-011: "The insurer does not pay benefits where the injured person or another person entitled to claim caused the accident intentionally or while committing a criminal offence (Section 28)."
2. 006 L77: "Finally, under Interpretation No. 649 (釋字第649號) of the Judicial Yuan dated October 31, 2008, the Constitutional Court justices (大法官) held that the statutory provision allowing only visually impaired persons to carry on the massage business is unconstitutional (違憲), and that provision ceased to have effect on October 31, 2011, being the end of the three-year grace period the interpretation gave."
3. 008 인용 블록: "...without a cap. The Labor Pension Act applies to persons of Taiwanese nationality, foreigners who are married to a Taiwanese national and have been permitted to reside, foreigners permitted to reside permanently, and workers of the same kind (Section 7, paragraph one), and from 2026 applies also to foreign experts working in their profession ([Section 24 of the Act on Recruitment and Employment of Foreign Professionals (外國專業人才延攬及僱用法)](...)); the severance of other workers, and of service periods before this Act applied, is calculated under Section 17 of the Labor Standards Act. Service of less than one year is calculated proportionally, and the company must pay the severance within 30 days from when the contract ends."
4. 010 지급 의무자: "...the Taichung court gave judgment... ordering the company operating the exercise facility, which is one of the defendants, to pay [1,579,589 new Taiwan dollars] together with the interest stated in the judgment."
5. 017 §68 본문: "A foreigner who works without permission must bear an administrative fine and must be ordered to leave the country immediately, and will not be able to work in Taiwan again (Section 68 of the Employment Service Act, 就業服務法). [existing sentences follow unchanged]"
6. 018 §39 문단: "The manager of a subsidiary (a company approved for investment in which foreigners hold more than one third of the shares) and branch in Taiwan of a foreign company can apply for a work permit more easily, but even when hiring the first foreigner the employer must meet one of the criteria in Section 39 of the Standards on Qualifications and Review of Foreigners' Work. For a company established less than one year, these criteria include paid-up capital (for a branch, operating funds in Taiwan) of not less than TWD 500,000 or revenue of not less than TWD 3 million; for a company established one year or more, they include average revenue over the latest one year or three years of not less than TWD 3 million. If the employer hires two or more foreigners of the same type, those foreigners and the employer must meet the general standards of Chapter 2 (Section 38, paragraph two). If you plan for foreign staff to work in Taiwan, before forming the Taiwan company you must confirm whether the capital fixed meets the threshold."
