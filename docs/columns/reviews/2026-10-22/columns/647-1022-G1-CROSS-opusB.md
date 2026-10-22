# CROSS-opusB — G1 (코인: 가상자산 거래소 계정의 사기 의심 통제·경시·圈存) 교차 검수

- 검수자: opusB (Claude Opus 5.5, 작성자 opusA와 별개 세션) · 2026-10-22 09:56 KST
- 대상: drafts/gap/G1/{ko,zh,ja,en,es}.md — WROTE-opusA에 적힌 sha256과 검수 시점 파일 해시 일치 확인(5개 모두).
- 판정: MAJOR 1 · MINOR 9 (MAJOR 0번은 10:02 KST 추가 — G3 검수 중 en↔es, ko↔ja를 문장 단위로 대조하다 같은 유형을 G1에서도 확인). 모두 반영한 뒤 READY를 만들 것.

## 검수자가 직접 확인한 것

- 조문(law.moj.gov.tw LawSingle, opusB가 2026-10-22 다시 조회, research/opusB/law/): 詐欺犯罪危害防制條例 8·9·12, 應遵循事項辦法(G0380271) 12·25·26·45·48·51·64·69, 洗錢防制法 6·22, 入出國及移民法 31. 14개 조문 모두 facts.md 발췌와 글자 단위로 같음. 본문의 조·항·호와 숫자(13개 기준, 20일, 48시간, 3년, 3개 이상)는 원문과 맞음.
- 개정 시점: LawAll 헤더 G0380271 修正 115-07-20, D0080226 修正 115-01-21, G0380131 修正 113-07-31. 沿革 페이지와 113-11-29 舊條文(LawOldVer)을 비교함. 舊 제12조는 9개 호이고 거류증 기준이 없음. 新 제12조는 13개 호이고 제9호가 거류증 기준임(115-07-20 條文對照表 PDF에도 '居留證' 신설 문구가 있음). 따라서 요약의 "2026년 7월 개정 규정이 판단 기준에 넣었다"는 맞음.
- 공식 영문(law.moj.gov.tw/ENG): 법령명 "Fraud Crime Hazard Prevention Act", "Regulations Governing Fraud Crime Hazard Prevention by Financial Institutions and Businesses or Personnel Providing Virtual Asset Services", "Money Laundering Control Act", "Immigration Act"가 en 표기와 같음. en 28행 인용 "exempted from the compensation responsibility"는 공식 영문 제12조 제2항 문구와 같음.
- 판결: 最高行政法院 114上388(2026-09-17, 案由 警示帳戶, 上訴駁回) 본문(evidence/TPAA-114-shang-388.txt)을 읽음. 회사 은행계좌 3개가 110년 8월 경시 지정됨 → 預防性不作為訴訟 → 원심이 "申請而未獲解除，自得提起訴願、撤銷訴訟或一般給付訴訟"이라 본 판단을 유지하고, 예방적 소송은 권리보호 필요가 없다고 봄. 다섯 판의 서술(은행 계좌 사건, 원심 유지, 상고 기각)이 맞음.
- 자동 검사(opusB가 직접 실행): variety_metrics FAIL 0 ×5(es는 en 모드와 es 보조 지표, es_fails=[]), 길이 OK ×5(ko 2,478자, zh 1,563자, ja 1,810자, en 892단어, es 893단어), hygiene OK ×5. 외부 링크 21개 중 non-200 0. 내부 링크 6개 라이브 200이고 링크 문구도 라이브 h1과 맞음. 굵은 글씨·이모지·저자줄·AI 표기 없음. 변호사명 曾雋崴(ko 증준외는 기존 ko 칼럼 표기와 같음), 두 주소 표기, 전화번호 없음. es는 la abogada(여성)로 맞음.
- 중복: ref 4개 언어, gapfill-1020, 1021, 이슈 1019/1020에서 '虛擬資產帳號/虛擬資產服務商/圈存'을 검색함. 결과는 피해자 쪽 칼럼(zh 236·247·042, ja 248·225), 은행 경시계좌(ja 272·064), S1 facts뿐임. 계정 보유자 쪽 가상자산 통제·거류증 기준을 다룬 글은 없음. 라이브 /es/columns에도 crypto 칼럼은 없음.
- 언어판 비교: 오프닝 유형(ko 사실 / zh 장면 / ja 질문 / en 공식 영문 인용 / es 숫자)은 판마다 다름. 그러나 문장 단위로 대조하면 es는 en을, ja는 ko(요약·FAQ)와 en(본문 순서)을 옮긴 문단이 대부분임(지적 0). zh는 독자적임(대만 독자 관점, 打工 계정 대여, 證期局 명단).

## 지적 (MAJOR)

0. MAJOR — es.md ↔ en.md, ja.md ↔ ko.md·en.md — 오프닝만 바꾸고 요약·FAQ·본문 문단은 같은 문장을 옮긴 형태
   - es ↔ en 근거:
     - 요약: en 4 = es 4. 네 문장이 같은 순서·같은 내용(거래소 통제와 7월 개정 거류증 기준 → 20일·침묵 시 계속 → 48시간 → 면책이라 해제·약관상 출금이 현실적).
     - FAQ: en 16–17 = es 16–17(기간), en 18–19 = es 20–21(가격 하락), en 20–21 = es 18–19(거류증). 답의 문장 구성도 같음.
     - 본문:
       - en 44 = es 36(9조 4항·45조).
       - en 48 = es 38(48시간).
       - en 54 = es 54. "Bring the transaction history, the source of the deposit in question, and the chat or contract showing what it paid for." = "Conviene llevar el historial de operaciones y los mensajes o contratos que expliquen de dónde vino el ingreso discutido."
       - en 56 = es 56(114上388).
       - en 58 = es 50(64·69조).
       - en 62 = es 60. "A warning designation is an investigative step… presumed innocent, and a first-instance judgment can be appealed." = "Una designación de alerta es una medida de investigación. Rige la presunción de inocencia, y una sentencia de primera instancia puede recurrirse."
       - en 68 = es 64. 변호사 업무 문장 "obtain and read the exchange's notice and the police document, confirm whether you face an Article 8 control, a warning designation or a hold…" = "obtener y leer la notificación del exchange y el oficio policial, determinar si se trata del control del artículo 8, de una alerta o de una retención…". 두 날짜 마무리도 같음.
     - es 고유 부분은 오프닝(28–30)과 44행 질문 문장뿐임.
   - ja ↔ ko·en 근거:
     - 요약: ja 4 = ko 4(같은 문장 순서, ja는 48시간 문장만 뺌).
     - FAQ: ja 16–21 = ko 16–21. 같은 세 질문이 같은 순서이고(기간 → 거류증 → 가격 하락) 답도 같음.
     - 본문 순서: ja는 en과 같음(면책 → 8조 → 12조·9호 → 31조 → 25·26조 → 경시 → 圈存 → 문의 → 행정소송 → 22조 → 링크 → 변호사). 인용 조문 순서 비교 0.92(research/opusB/tools/order.py).
     - 문장 짝:
       - ja 40 "第9号は外国人を対象にしています" = en 38 "Item 9 is written for foreigners."
       - ja 44 "自動では解けません。" = en 42 "Silence does not free the account." = ko 36 "기다린다고 풀리지는 않습니다."
       - ja 56 = ko 48 = en 54.
       - ja 62 마지막 세 문장 = ko 60 = en 62.
     - ja 고유 부분은 오프닝(28), 34행 첫 문장, 42행 끝 문장, 68행 "帰国後に日本から委任する場合も同じです"뿐임.
   - 이유: 2026-10-21 08:22 지시와 GATE-PROMPT는 번역처럼 읽히는 판을 FAIL로 정함. opusA가 G2 지적 12(es가 en 번역: "es 고유 부분은 가상 장면과 한 문장뿐이고 절 순서만 바꾼 형태")에 적용한 기준을 그대로 적용함.
   - 수정: zh·en은 그대로 둠. ja와 es를 그 독자 기준으로 다시 씀.
     - ja: 귀국 흐름에서 생기는 질문(일본 계좌로 옮기려다 막힘, 귀국 후 일본에서 문의·위임할 때 누구에게 무엇을 내는가, 출국 전 받아 둘 서류)을 순서로 삼아 요약·FAQ·절을 새로 구성함. ko와 같은 FAQ 세 개를 쓰지 않음.
     - es: 스페인어권 거주자의 질문 순서(예: '20일'에서 시작한 오프닝을 살려 그 뒤를 '누가 언제 무엇을 통지하나'의 시간 순서로)로 구성함. en의 요약·FAQ·문단 문장은 옮기지 않음.
     - ko는 ja를 고치면 FAQ 중복이 풀림. 그대로 두되, 지적 6·7·8은 반영함.
   - 보존: 조문·숫자(8·9·12조, 辦法 12조 9호·25·26·45·48·51·64·69조, 洗錢防制法 6·22조, 移民法 31조 4항, 20일·48시간·3년·3개 이상), 114上388 서술(은행 계좌 사건, 원심 유지, 상고 기각), 면책의 조건문, 무죄추정·상소 가능.

## 지적 (MINOR)

1. MINOR — zh.md:2·26·32·38, ja.md:38·48 — 제목과 소제목은 세 제한마다 기한이 있다고 예고하는데, 경시(警示)에는 기한 정보가 없음
   - 원문: zh 제목 "…疑似涉詐控管、警示與圈存，各要等多久", 소제목 "三種限制，時鐘不一樣". 그런데 38행 警示 문단에는 기간 이야기가 전혀 없음. ja 38 "止まり方は三つあり、それぞれ時計が違います" 뒤의 48행 警示 문단도 같음.
   - 이유: 독자는 '경시는 얼마나 가나'를 찾게 되는데 답이 없음. 검수자가 G0380271 전문(LawAll)의 가상자산 관련 절에서 '日內·小時·個月·營業日·期限'을 모두 찾아봄. 나온 것은 제26조(20일·5영업일), 제48조(48시간), 경찰 2시간 출동, 제66조(3개월, 발환 관련)뿐임. 경시 계정의 유지 기간이나 해제 회신 기한을 정한 조문은 없음. 제66조 제2항이 "經通報解除警示或警示期限屆滿"이라고만 씀.
   - 수정: zh 38 끝에 "警示沒有像第26條、第48條那樣的回覆期限，要等原通報的警察機關通知解除（辦法第66條第2項只提到「通報解除警示或警示期限屆滿」）。"처럼 한 문장을 더함. ja 48의 "全取引が止まります。"(바로 앞 절과 같은 말)를 지우고 같은 취지의 문장을 넣음. 예: "警示には第26条や第48条のような回答期限がなく、解除は通報した警察機関の通知を待つことになります（第66条第2項は「通報による警示解除または警示期限の満了」に触れるだけです）。" 다른 판에도 넣으면 좋지만 차단 사유는 아님(ko 제목은 '20일·48시간'이라 예고 문제는 없음).
   - 보존: 20일, 48시간, 제9조 제4항, 제45조.

2. MINOR — ja.md:38 — "それぞれ時計が違います"는 zh 32 소제목 "時鐘不一樣"을 옮긴 표현이고 일본어로 어색함
   - 이유: 일본어에서 '時計が違う'는 기한·시한이 다르다는 뜻으로 쓰지 않음. zh 소제목의 비유를 그대로 옮긴 흔적이라 2026-10-21 번역 금지 기준에도 걸림.
   - 수정: "止まり方は三つあり、解除までの期限の決まり方がそれぞれ違います。"
   - 보존: 세 가지 구분.

3. MINOR — ja.md:28 — 오프닝 두 문장이 보통체
   - 원문: "…日本の口座へ移そうとしたら止められた。理由を尋ねても「法令に基づく管理です」としか返ってこない。"
   - 이유: 규칙은 ja 본문을 です・ます체로 통일하라고 함(SENTENCE-VARIETY 3절, LESSONS 13). 도구는 이 문장들을 だ・である로 세지 않아 FAIL이 나지 않았을 뿐임.
   - 수정: "帰国前に、取引所に預けた台湾ドルの残高を日本の口座へ移そうとしたら、出金が止まりました。理由を尋ねても「法令に基づく管理です」という返事しかありません。この「法令」とは何で、いつまで続くのでしょうか。"
   - 보존: 질문형 오프닝, 귀국 전 송금 장면.

4. MINOR — ja.md:34 — 배상 문단 본문에서 조건이 빠짐
   - 원문: "凍結中の値下がりを取引所に負担させるのは難しいでしょう。"
   - 이유: 제12조 제2항은 '이 조례의 방사기 조치 또는 경찰 처리 협조'로 생긴 손해만 면책함. 같은 글 FAQ 21과 ko 54·zh 44·es 48은 '이 조치에 해당하면'이라는 조건을 붙였음. selfcheck의 '남은 위험'도 이 조건 표기를 전제로 함.
   - 수정: "凍結がこの条例に基づく措置であれば、値下がり分を取引所に負担させるのは難しいでしょう。"
   - 보존: 면책 조문, 해제 후 약관에 따른 반환이 현실적이라는 결론.

5. MINOR — ja.md:42 — 거류증 말소와 계정 정지를 인과관계로 단정함
   - 원문: "退職して帰国を準備する時期に止まるのは、この流れです。"
   - 이유: 제12조 제9호는 거래소가 통제'할 수 있는' 판단 기준일 뿐이고, 같은 글 FAQ 19도 "措置をとるかどうかは取引所の判断"이라고 씀. ko 30 "생길 수 있습니다", en 38 "can lead there", es 44 "puede encontrarse"는 가능성으로 썼음.
   - 수정: "退職して帰国を準備する時期にアカウントが止まることがあるのは、この流れによります。"
   - 보존: 移民法 31조 4항, 노동분쟁 소송 중 예외.

6. MINOR — ko.md:66, ja.md:68, en.md:68, es.md:64 — 네 판의 마지막 문장이 같음
   - 원문: ko "출국 날짜와 통제 통지를 받은 날짜를 먼저 맞춰 보는 것이 순서입니다." / ja "居留証の抹消日と、取引所から通知が届いた日。手元で最初に並べるのはこの二つの日付です。" / en "…the date your residence certificate was cancelled and the date of the exchange's notice are the two facts to line up first." / es "…la fecha en que se canceló su certificado y la fecha del aviso del exchange son los dos datos que hay que cuadrar primero."
   - 이유: 2026-10-21 08:22 지시와 GATE-PROMPT는 같은 도입·같은 예시·같은 마무리를 옮긴 판을 번역으로 봄. opusA가 G2 지적 11에서 적용한 기준과 같음. zh만 다른 마무리("客服那句「依法令辦理」…")를 씀.
   - 수정: 최소 두 판을 그 독자 상황과 본문 사실에 맞는 다른 문장으로 바꿀 것. 예: en "If you have already left Taiwan, the police unit named on the document is the one to write to (Articles 26(3) and 51)." / es "Si solo le retuvieron un importe, anote la hora exacta de la retención: desde ese momento corren las 48 horas (artículo 48)." ja의 두 날짜 문장은 귀국 흐름과 맞으니 그대로 둘 수 있음.
   - 보존: 각 판의 연락처 문장, 조문 내용.

7. MINOR — en.md:50, ko.md:44 — 근거 없는 일반화와 명령문
   - 원문: en "The notice you received usually shows which of these three you are facing. Read it before calling anyone." / ko "두 경우는 통지문에서 갈립니다."
   - 이유: 거래소가 고객에게 보내는 통지에 통제 근거를 적어야 한다는 조문은 확인되지 않음. 辦法은 경찰 통지에 따른 통제에 대해 고객이 거래소·경찰에 '물을 수 있다'고만 정함(제26조 제3항). 'usually'는 출처 없는 사실 주장이고, 'Read it before calling anyone'은 명령조임.
   - 수정: en "Whether the whole account stopped or only a set amount is held tells you which of these rules applies and whom to ask." / ko는 첫 문장을 지우고 "계정 전체가 멈췄는지, 특정 금액만 묶였는지에 따라 기다릴 시간과 물어볼 곳이 바뀝니다."만 남김.
   - 보존: 세 가지(또는 두 가지) 구분과 문의처의 차이.

8. MINOR — ko.md:21(FAQ), ko.md:54 — '방사기 조치'는 한국어가 아님
   - 원문: "사업자가 이 조례의 방사기 조치를 하거나…", "이 조례의 방사기 조치를 하거나 경찰 처리에 협조하다…"
   - 이유: 防詐(措施)를 한자음대로 읽은 말이라 한국 독자는 뜻을 알 수 없음(LESSONS 6: ko 번역투를 원어민 표현으로).
   - 수정: "이 조례에 따른 사기 방지 조치를 하거나 경찰의 처리에 협조하다가…" (FAQ·본문 두 곳).
   - 보존: 면책 범위(조치 실시 또는 경찰 협조), 조건문.

9. MINOR — zh.md:58 — 출처 없는 빈도 주장
   - 원문: "「幫忙買幣」「代操」的打工訊息常要求借用交易所帳號。"
   - 이유: '常'은 사기 유형의 빈도를 말하는 사실 주장인데 출처가 없음(LESSONS 11). 165 반사기 공지 같은 공식 출처를 찾아 달지 않을 거라면 단정을 낮춰야 함.
   - 수정: "有些打工訊息會以「幫忙買幣」「代操」為名，要求借用交易所帳號。" 또는 공식 출처를 달고 원문 그대로 인용.
   - 보존: 洗錢防制法 22조의 금지·예외·형벌 요건.


## 참고 의견 (차단 아님)

- es.md에는 내부 링크가 없음. opusA가 RESUME·G2 검수에서 밝힌 대로 라이브 200인 /es/services를 마무리에 한 번 거는 방법이 있음.
- ja 출처 목록에는 제64·69조와 洗錢防制法 6조가 없음. 그러나 ja 본문도 이 조문을 쓰지 않으므로 오류는 아님.
- en 56 "the fight moves to administrative court"는 訴願이 먼저라는 점이 바로 뒤 문장에 나오므로 그대로 둬도 됨.
