# CROSS-opusA — G2 (증권·투자) 교차 검수

- 검수자: opusA (Claude Opus 5.5, 작성자 opusB와 별개 세션) · 2026-10-22 09:45 KST
- 대상: drafts/gap/G2/{ko,zh,ja,en,es}.md — WROTE-opusB에 적힌 sha256과 검수 시점 파일 해시 일치 확인.
- 판정: MAJOR 1 · MINOR 11 (12번 MAJOR는 09:55 KST 추가 — G6 검수 중 en·es 대조에서 발견). 모두 반영한 뒤 READY를 만들 것.

## 검수자가 직접 확인한 것

- 조문(law.moj.gov.tw LawSingle, 2026-10-22 재조회, 사본 research/opusA/law/): 證券投資人及期貨交易人保護法 4·22·23·24·25-1·25-2·26·28, 金融消費者保護法 4·13·29·30, 保護機構調處委員會組織及調處辦法 13·13-1·13-2·13-3, 華僑及外國人投資證券管理辦法 3·4·10·16·17·19·21, 證券商負責人與業務人員管理規則 18, 民法 188·197·217. 본문의 조문 번호·항·내용은 아래 지적을 빼면 모두 맞음.
- 금관회 2022-03-18 金管法字第11101915421號(evidence/fsc-111.html): 120만 열거 14개 항목, 그 밖은 12만. 일반 상장주식 위탁매매는 열거 항목에 없음 → 12만 서술 맞음. FSC 최신법령 검색(키워드 '一定額度')에서 2022-03-18 공고가 가장 최근임을 확인(research/opusA/cross-G2/fsc-lawnew-search-一定額度-20261022.html).
- 판결: TPHV 111 重上 962 주문 2~4항(259만6,202 연대, 446만7,600 동시이행, 72만6,330 연대)·不爭執事項(11회, 424만5,640, 109-03-23 盜賣, 형 1년10월×2 확정)·판단 이유(營業時間·營業處所·客觀上 職務關聯, 188조 단서 立證 실패, 30% 과실상계, 직원 기배상 53만6,780) 원문 대조 일치. TPSV 112 台上 1631은 증권사 상고 부적법 각하 裁定(2024-05-22). TPHV 111 金上 3: 영업 전 永豐商銀 시절부터의 사적 위임, 開戶契約·對帳單·財富管理開戶同意書·密碼簽收單의 경고 문구, FSC 106-07-11 처분, 2심이며 GetJudHistory상 후속 기록 없음 — 일치.
- SFIPC 조처 안내(소액 100만 이하 흐름, 등기우편)·FAQ(工本費 1,000·환급, 申訴/調處/訴訟 先後 없음, 1심 변론종결 전 신청 가능) 일치.
- 자동 검사: variety_metrics FAIL 0 ×5(es는 en 모드+보조 지표), hygiene OK ×5, 외부 링크 29개 non-200 0, 내부 링크 ko·zh·ja·en 라이브 200(링크 문구도 라이브 h1과 일치). 굵은 글씨·이모지·저자줄·AI 표기·당사자 실명·증권사 상호 없음. front matter 구조·categories·topic은 1021 세트(ASTRA-PASS)와 같음.
- 중복: ref 4개 언어·라이브 /es/columns·gapfill-1020·이슈 1019/1020·1021 세트에 증권사 직원 비위·SFIPC 조처·金融評議를 다룬 칼럼 없음. ja 이슈 ISSUE-20261014-10(일본 투자자 등록제)은 등록 절차 자체가 주제라 각도가 다름(아래 참고 의견).
- 언어판 비교: 오프닝(ko 판결 질문 / zh 질문+"두 답" / ja 숫자 / en 2심 판결 / es 가상 장면)은 다섯 판이 다름. ko·zh·ja는 절 순서도 달라 번역으로 읽히지 않음. es는 오프닝 장면을 빼면 요약·FAQ·본문 대부분이 en 문장을 옮긴 것이라 지적 12(MAJOR). 지적 11의 두 문단은 다섯 판이 같은 모양.

## 지적 (MINOR)

1. MINOR — ko.md:4, ko.md:48, ja.md:4, ja.md:34 — 소액 조처안이 자동으로 나오는 것처럼 씀
   - 원문: ko 48 "증권사가 정당한 이유 없이 기일에 나오지 않으면 조처안이 나오고", ja 34 "証券会社が正当な理由なく来なければ調処案が示され". 요약(ko 4, ja 4)도 같음.
   - 이유: 投保法 25-1조 1항은 "調處委員得審酌情形…提出調處方案"으로 재량 규정임. 같은 글의 FAQ(ko 19 "나올 수 있습니다", ja 19 "出せます")와 zh·en·es 본문은 '할 수 있다'로 썼으니 언어판끼리도 법적 강도가 다름.
   - 수정: ko "…나오지 않으면 조정위원이 조정안을 낼 수 있고, 송달 후 10일 안에…" / ja "…来なければ、調処委員が調処案を出すことができ、送達から10日以内に…". 요약도 같은 강도로.
   - 보존: 100만 기준, 정당한 이유 없는 불출석, 10일 불변기간, 서면 이의, 성립 의제.

2. MINOR — ko.md 전체(2·3·4·17·18·19·26·44·48·50·52·63행) — '조처(調處)' 용어
   - 이유: 한국어 '조처'는 일상어로 措處(조치)라는 뜻이라 독자가 절차 이름으로 읽기 어려움. 사이트의 기존 ko 칼럼(065·254·604)은 調處를 '조정(調處)'으로 씀.
   - 수정: 제목·seoTitle·요약·tags·FAQ·본문·출처 목록의 '조처'를 '조정'으로 바꾸고, 처음 나올 때 '조정(調處)' 병기. 鄉鎮市 調解와 구분이 필요하면 첫 언급에 "투자자보호센터의 조정(調處)"처럼 기관을 붙임.
   - 보존: 절차 내용은 그대로.

3. MINOR — ko.md:40 — '매도대금 상당액 446만 7,600'
   - 이유: 판결상 446만7,600은 고객 계좌에 들어온 정산 매도대금 444만7,837에 1심이 연대 지급을 명한 수수료·거래세 1만9,763을 더한 금액임(TPHV 111 重上 962 六㈡⑷, 七). '매도대금 상당액'만으로는 숫자가 맞지 않음.
   - 수정: "고객이 이미 받은 매도대금과 1심에서 인정된 수수료·세금을 합한 446만 7,600 대만달러를 돌려주는 것과 맞바꿔" 또는 단순히 "고객이 446만 7,600 대만달러를 돌려주는 것과 맞바꿔".
   - 보존: 금액, 동시이행, 연대 반환.

4. MINOR — en.md:36, es.md:40, ja.md:42 — 259만6,202의 성격과 직원 기배상이 언어판마다 다름
   - 원문: en "The firm's share came to NT$2,596,202." / es "La sociedad debía pagar 2.596.202 dólares taiwaneses de ese daño y, solidariamente con el agente, devolver las acciones…" / ja "証券会社の負担は259万6,202台湾ドルでした".
   - 이유: 주문 2항은 증권사가 이 금액 범위에서 직원과 '연대' 책임을 진다는 것(ko·zh는 '함께/連帶'로 정확). en·es는 직원이 먼저 53만6,780을 갚아 남은 370만8,860의 70%라는 계산 근거도 빠져, 독자가 424만5,640×70%(297만1,948)와 맞지 않는 숫자를 보게 됨. es 문장은 연대가 주식 반환에만 걸리는 것처럼 읽힘.
   - 수정: en "After the broker's partial repayment, the firm was held jointly liable with the broker for NT$2,596,202, 70% of the remaining loss." / es "Descontado lo que el agente ya había devuelto, la sociedad respondía solidariamente con él por 2.596.202 dólares taiwaneses, el 70 % del daño restante; ambos debían además devolver las acciones…" / ja "…損害のうち、証券会社は259万6,202台湾ドルの範囲で担当者と連帯して責任を負いました。"
   - 보존: 30%, 259만6,202, 446만7,600, 72만6,330.

5. MINOR — ko.md:32, zh.md:48, ja.md:52, en.md:52, es.md:32 — 국외 외국인 신용거래 금지의 단서 누락
   - 이유: 管理辦法 21조 본문은 "除金管會另有規定外" 신용거래 금지. 금관회는 이 조문의 단서로 외국 투자자 관련 예외를 연 적이 있음(신대만달러 차입 매수 등 보도). 개인 신용거래 예외 여부는 검수자도 확인하지 못했으므로 단정은 위험.
   - 수정: ko "금융감독관리위원회가 따로 허용한 경우가 아니면 신용거래를 할 수 없습니다" / zh "除金管會另有規定外，不能從事融資融券" / ja "金融監督管理委員会の別段の定めがない限り、信用取引はできません" / en "margin trading is barred unless the FSC provides otherwise" / es "salvo que la Comisión disponga otra cosa, no puede operar a crédito".
   - 보존: 대리인·보관기관 지정(16·17조).

6. MINOR — 다섯 판 출처 목록(ko 62–63, zh 60–61, ja 60–61, en 60–61, es 61–62) — 調處辦法 누락
   - 이유: zh 42·ja 19·34·en 19·es 19·46의 '서면으로' 이의, zh 42·ja 34·en 44·es 46의 '중심이 바로 기일을 정함', ko 48의 '일반 사건은 상대방이 거부하면 불성립'은 投保法 25-2조가 아니라 證券投資人及期貨交易人保護機構調處委員會組織及調處辦法 13조(무응답=거부 의제)·13-1조(소액은 즉시 기일 지정)·13-2조(不同意는 書面)에 근거함. 근거 조문이 본문에도 목록에도 없음.
   - 수정: 다섯 판 출처 목록에 "[證券投資人及期貨交易人保護機構調處委員會組織及調處辦法](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=G0400055) 제13조, 제13조의1, 제13조의2"(언어별 표기)를 추가. 가능하면 '서면' 문장 뒤에 13-2조 링크.
   - 보존: 내용 변경 없음.

7. MINOR — zh.md:42, ko.md:48 — '사전 申訴 불필요' 문장의 근거
   - 원문: zh "投保中心的調處，不必先申訴（[…保護法第22條]）".
   - 이유: 22조는 조처 신청권만 정하고 申訴 선행 여부는 말하지 않음. 이 주장을 직접 뒷받침하는 것은 SFIPC FAQ "申訴或調處與訴訟等二種解決方式並無先後之分"과 金保法 13조 2항(評議만 申訴 선행)임. ko 48은 이 주장과 1심 변론종결 요건을 한 문장에 묶고 23조만 붙임.
   - 수정: zh "投保中心的調處（第22條）沒有先申訴的要件（[投保中心常見問答](https://www.sfipc.org.tw/News_Toggle.aspx?n=7559&sms=12331)）。" / ko 해당 문장 끝에 같은 FAQ 링크를 더하거나, 23조 인용을 1심 변론종결 부분에만 붙임.
   - 보존: 1심 변론종결 전 신청 가능(23조 1항 4호).

8. MINOR — ja.md:44, ja.md:54 — 판결 경고 문구를 「」로 인용, 對帳單 용어
   - 원문: ja 44 "契約書や取引報告書に「パスワードを社員に預けないように」と繰り返し書かれていた", ja 54 "月ごとの取引報告書".
   - 이유: 「」는 원문 인용으로 읽히는데 판결의 실제 문구는 "本人不得將現金、存摺、印章及網路密碼交由富邦證券及其負責人、受雇人保管" 등이라 일본어 요약을 인용처럼 보이게 함(인용문은 원문 그대로라는 규칙). 또 판결이 든 문서는 開戶契約·對帳單·財富管理開戶同意書·密碼簽收單이고, 일본에서 '取引報告書'는 매매 체결 통지라 對帳單(정기 잔고·거래 내역)과 다름.
   - 수정: ja 44 "口座開設契約や取引残高報告書（対帳単）などに、パスワードを社員に預けないよう繰り返し記載されていた" (괄호 「」 제거) / ja 54 "月ごとの取引残高報告書（対帳単）". featured_image_alt의 '取引報告書'도 '取引残高報告書'로 맞추면 좋음.
   - 보존: 경고가 여러 문서에 반복됐다는 사실.

9. MINOR — en.md:3, en.md:46 — 미국 독자에게 오해되는 약어·단어
   - 원문: seoTitle "…SFIPC Mediation and FOI for Foreigners"; 46 "NT$1.2 million for listed products such as trusts, derivatives…".
   - 이유: 미국 독자에게 FOI는 Freedom of Information으로 먼저 읽힘(본문에서 FOI 약어를 정의하지도 않음). "listed products"는 같은 문장의 "listed shares"와 겹쳐 '상장 상품'으로 읽힘 — 실제 뜻은 '공고에 열거된 상품'.
   - 수정: seoTitle "Taiwan Brokerage Disputes: SFIPC Mediation and the Financial Ombudsman" (또는 60자 안의 비슷한 문구) / 46 "NT$1.2 million for the products the notice names, such as trusts, derivatives and discretionary investment, and NT$120,000 for everything else, which covers ordinary brokerage of listed shares".
   - 보존: 120만·12만 구분, 공고 날짜.

10. MINOR — en.md:44 — 상투적 연결문
    - 원문: "Small claims are where it gets interesting."
    - 이유: 정보 없이 흥미를 예고하는 관용구(EDITORIAL-VOICE '추상적 강조·예고 문장'). 지워도 정보 손실 없음.
    - 수정: 문장을 지우고 다음 문장으로 시작하거나 "Claims of NT$1 million or less run on a faster track." 같이 사실을 담은 짧은 문장으로.
    - 보존: 다음 문장들의 절차 내용.

11. MINOR — 다섯 판 공통(ko 50·52, zh 44·50, ja 36·54, en 48·54, es 50·52) — 두 문단이 다섯 언어에서 같은 모양
    - 원문: 시효 문단이 모두 '시효 챙기라'는 한마디로 시작해 같은 순서(24조 중단·의제 → 민법 197조 2년 → 28조 단체소송 → 재무보고 칼럼 링크)로 이어짐("시효도 챙겨야 합니다." / "時效別忘了算。" / "時効にも注意が要ります。" / "Watch the clock." / "Ojo con los plazos."). 마무리 문단도 모두 같은 세 가지 증거(월별 명세서·직원과의 메시지·송금 기록)를 같은 순서로 나열한 뒤 변호사 업무로 넘어감.
    - 이유: 2026-10-21 08:22 지시(번역 금지) — 같은 도입·같은 예시·같은 문단 순서를 옮긴 판은 FAIL 대상. 글 전체는 각자 썼지만 이 두 문단은 번역 흔적으로 읽힐 수 있음.
    - 수정: 최소 두 판에서 모양을 바꿀 것. 예: en은 시효를 'Two routes' 절의 조처 설명 끝에 녹여 "Filing also stops the two-year tort clock (Civil Code Article 197), but only if the mediation does not fail or get withdrawn (Article 24)."처럼 쓰고 'Watch the clock.'을 뺌. ja는 숫자형 오프닝과 이어지게 "損害と賠償義務者を知ってから2年。…" 식으로 기한을 먼저 두기. 마무리 증거 목록은 판마다 그 독자 상황에 맞게(예: ja 帰任 전 원본 확보, es 사례 인물의 메시지 기록, en 미국에서 받는 전자 명세서) 하나씩만 다르게 해도 됨.
    - 보존: 24조 중단·의제, 197조 2년(기산점), 28조 20명 이상, 증거 종류.

12. MAJOR — es.md ↔ en.md — es가 en의 번역으로 읽힘 (09:55 KST 추가)
    - 근거(문장 단위 대응): 요약 en 4 = es 4(세 문장 같은 순서·같은 내용, "Taiwan courts have held a brokerage jointly liable … but rejected liability where the client handed a staff member the trading password" = "Los tribunales han condenado a una sociedad … y han absuelto a otra cuando el propio cliente entregó su contraseña a un empleado"); FAQ 세 개의 질문과 답 en 16–21 = es 16–21(예: "In an ordinary case, a firm that refuses to mediate ends the process. For small claims of NT$1 million or less, the SFIPC sets a session directly…" = "En un asunto ordinario, si la sociedad no acepta mediar, la mediación no prospera. En las reclamaciones de hasta un millón…, el SFIPC fija directamente la sesión…"); 본문 en 34 = es 38, en 36 = es 40("The acts happened during business hours, at the branch, and used services the firm itself offered" = "los hechos ocurrieron en horario laboral, en la sucursal y con servicios de la propia sociedad"), en 38 = es 34, en 42·44 = es 46, en 46 = es 48, en 48 = es 50, en 52 = es 32, en 54 = es 52. es 고유 부분은 28행 가상 장면과 52행 첫 문장뿐이고, 절 순서만 바꿔 놓은 형태.
    - 이유: 2026-10-21 08:22 지시(번역 금지)와 GATE-PROMPT — 번역처럼 읽히는 판은 FAIL. 오프닝 장면만으로는 피하기 어려움.
    - 수정: es를 스페인어권 거주자 기준으로 다시 씀. 요약·FAQ는 en과 다른 질문(예: 스페인어로 받은 안내가 없을 때 투자자보호센터 서면 통지·신청서 언어, 장면 속 인물의 메시지 기록 보존, 중남미에서 투자하는 '국외 외국인'의 대리인·보관기관)으로 바꾸고, 판결 두 건과 두 절차 설명은 en 문장을 옮기지 말고 장면 인물의 질문 순서대로 새로 구성. 지적 4(259만6,202 연대·기배상)·5(21조 단서)·11의 es 부분도 이때 함께 반영. 본국 제도 비교를 넣으려면 BOE 등 공식 출처를 열어 확인한 것만.
    - 보존: 조문·숫자·판결 서술(2심, 상고 기각 확정)은 그대로.

## 참고 의견 (차단 아님)

- es.md: 다른 4개 언어와 달리 내부 링크가 없음. TASK의 '관련 기존 칼럼·서비스 페이지 내부 링크'에 맞추려면 라이브 200을 확인한 [/es/services](https://tseng-law.com/es/services)(Litigios civiles y daños 포함)를 마무리 문단에 한 번 거는 방법이 있음. 1021 P-CIV es는 내부 링크 없이 게이트를 통과했으므로 차단 사유로 두지 않음. 같은 점이 opusA의 G1·G3·G5 es에도 있어 opusA도 같은 방식으로 맞출 예정.
- ja.md 52: 등록제 문장 뒤에 기존 이슈 칼럼(ISSUE-20261014-10, 일본 투자자 등록제)이 라이브에 있으면 링크를 거는 것도 고려할 만함. 이슈 URL은 검수자가 확인하지 않았으므로 걸 경우 라이브 200 확인 필요.
- 민법 197조의 '행위 시부터 10년' 장기 기간은 빠져 있으나 2년 기산점을 정확히 써서 오류는 아님.
