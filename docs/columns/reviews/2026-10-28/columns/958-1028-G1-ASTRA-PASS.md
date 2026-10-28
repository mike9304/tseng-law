PASS (gate runner: Claude Code Opus 5.5, fresh session; Codex Astra usage-limited)

2026-10-28 11:58 KST — G1 플랫폼 판매자가 대만 실체·등록이 필요해지는 시점. MAJOR 0, MINOR 0.

검수 대상 SHA-256(READY 11:50 기록과 같음):
- 1ac6c7e009c98c15db121748dc2f1a725d1b97431020dfd2261be1b4119311d1 ko.md
- c4cb955a4fab6db3dcf2d61ec6850c39c4ae0239876fe77a9be26d5235c2567b zh.md
- 62a2a2fb2c9aa03c348ba1db5c6536fc017f92598f400b9d36d672638ab5c8aa ja.md
- c641debfa09d863d60da64288e164e9cf43d9cf9c0dea4067d9320facb33c5e7 en.md
- 9309dc12ee7b827510c2e525bd07edbd49e64a49ab1898c02a922208abc652cd es.md

## 이번 게이트 경과

같은 게이트 실행에서 11:48에 다섯 판 전체를 검수해 MINOR 2건으로 FAIL(ASTRA-FAIL-fixed-2.md)했고, 작성자가 11:50에 고친 뒤 READY를 다시 만들었다. research/opusA-astra2/G1/before/와 현재 파일을 diff로 대조했다. ko·zh·es는 바이트 단위로 같고(SHA 동일), 바뀐 곳은 en:65와 ja:41 각 한 문장뿐이다.
- en:65 → "If that person then does business in Taiwan in the name of a parent that has no registered branch, Article 371's penalty is aimed at them." 公司法 371① 「以外國公司名義在中華民國境內經營業務」 요건과 맞음.
- ja:41 → 「登記の後に負責人がその資金を本社へ戻したり、本社が引き揚げるのに任せたりすると、その負責人本人が5年以下の有期徒刑などの対象になります（同条第2項）。」 公司法 372② 처벌 주체(在中華民國境內之負責人)와 「發還…或任由外國公司收回」 둘 다 반영. 
- 바꾼 두 판 variety 재실행: ja cv 0.519, en cv 0.600, FAIL 0. 링크는 바뀌지 않음.

## 검수 범위와 결과(11:48 전체 검수, ASTRA-FAIL-fixed-2.md '확인했고 문제없던 것'과 같음)

- 2차 게이트(11:17) 지적 13건 모두 해소(zh 39–65 소비자 시점 재작성, zh:49 財政部 출처 범위, ko 면세·統一發票 예외, ko·zh summary, zh FAQ1, en 消保法 7조, ja 團購網, es inciso, ja 辦事處 단락, es 장치 잔여, ko 타오위안 암시, zh·es 지시형 문장).
- 조문(LawSingle 대조): 營業稅法 1·2·3③4·5·4①1·6(3·4款)·28·41, 公司法 371·372①~④·386, 外國人投資條例 4·8①③, 消保法 2(2·10款)·7·9·10-1·18·19①②③⑤·47, 勞工保險條例 6, 勞工退休金條例 6·7, 就業服務法 43·48①2.
- 財政部 稅務入口網 import-notice·import-case·notice·case 원문 대조(2,000元 면세와 예외, 6회 기준, 分開申報 금지, 5% 세액식, 快遞 5萬元 先行代繳, 실제 거래가격 기재 요구, 小玉·小王·小華 사례, 起徵點 10萬/5萬, 1%·5%, 營利所得·純益率, 團購網), 經濟部 gcis t70049(대륙 자본 30% 초과·지배력 회사만 지점 신청 전 投資許可), 글로벌이코노믹 10/27(ko 계기만, 계약 구조 추측 없음).
- 판 사이 번역형 없음: 다섯 판의 도입·예시·문단 순서가 각각 다르고 대만 조문·숫자는 같다.
- 본국 법 비교·판결 인용·투자 권유·초안 규정 없음.
- 형식: front matter·audience·published 2026-10-28·author 내부 토큰·featured_image "TBD"·featured_image_alt(images/G1-brief.txt와 일치, 가상 장면, 인물·로고·읽히는 글자 없음)·FAQ JSON 정상. 굵은 글씨·이모지·전화번호·AI 표시·바이라인·저자 줄·'검토 완료' 표기 없음. 이메일과 타이베이 주소 다섯 판, en "English-speaking lawyer in Taipei" 있음.
- variety 다섯 판 FAIL 0, 외부 링크 30개 200, 내부 링크 22개 live 200.
- 중복 없음(001·004·256·321·325·381·384, ja 348, zh 539, 011, ~/tseng-issues-1028).
- 비작성자 교차 검수 CROSS-opusB 존재(CROSS-fixed-opusB.md), 반영 확인.

한계: ja·en·es 문장의 자연스러움은 모델 판단이며 원어민 검수가 아니다.
