# CROSS-opusB — G5 형사·투자사기 회수 (검수자 opusB, 2026-10-27 KST)

판정: REQUEST_CHANGES (MUST 3, SHOULD 7, NIT 8)
대상: drafts/gap/G5/{ko,zh,ja,en,es}.md, facts.md, slug.txt, images/G5-brief.txt, images/G5-hero.webp, reviews/self-G5.md, research/G5-angle.md

검수자가 직접 확인한 것(사본: research/opusB-cross/G5/):
- law.moj.gov.tw LawSingle 원문 직접 GET: 防詐應遵循事項辦法(G0380271) 27·28·30·48·52·53, 存款帳戶管理辦法(G0380199) 3·5·9·10, 洗錢防制法 19·22, 國際刑事司法互助法 2·5·6·30, 詐欺犯罪危害防制條例 11·54·55, 刑法 38-1, 刑事訴訟法 473·487·488. 아래 M3·S1 외에는 번호·항·숫자(48시간, 2시간, 2년+1회 1년, 3년, 100만, 1/10, 확정 후 1년)가 다섯 판 모두 원문과 일치. 33·45·46조는 opusA LawAll 사본(115.07.20)에서 확인.
- 영문 법령명 4개(law.moj.gov.tw/ENG hlLawName) en 판 표기와 일치.
- 뉴스: CNA 202610260105 원문(마지막 단락 "打詐綱領2.0施行至今…起訴5萬6671件…定罪率達97.7％") — zh 도입과 일치. VnExpress 5136782 원문(10/25 공안부 발표, 88명+1명 khởi tố, 5~10% 소액 출금, 자금세탁 검증 핑계, 대만 피해 규모 없음) — en·es와 일치, 무죄추정·수사 진행 표시 있음.
- variety_metrics FAIL 0(5판, es는 --lang es). verify.sh: 프런트매터 키 누락 0, published 2026-10-27, featured_image "TBD", audience 각 로케일, author 내부 토큰, FAQ 3, 굵은 글씨·이모지 0, 출처 절 있음, 이메일·타이베이 주소 있음. phone 검출은 165 공공 신고번호와 이미지 속 스마트폰 단어뿐(연락처 규칙 위반 아님). H1 1개는 1026 배포본과 같은 형식.
- 링크 48개 라이브 200, 내부 링크 제목 대조(064·272·638·059·237·225·246·042·647·947, /es/services — /es/services/criminal은 404라 지금 링크가 맞음).
- 대표 이미지 직접 열람: brief·다섯 판 alt와 장면 일치(어두운 책상, 스탠드, 흐린 그래프 스마트폰, 안 읽히는 종이, 유리 찻잔). 인물·로고·읽히는 글자 없음.
- 중복: 042(zh)는 신고·경시·발환 일반론이고 圈存 상한·초기 출금·USDT·사법공조는 없음. 947·647·237·225·638·246과도 질문이 다름. 각도 판단(research/G5-angle.md)은 맞다고 봄.

## MUST

### G5-M1 번역 금지 — 같은 예시, 같은 모듈 순서, 같은 마무리
게이트 규칙("same opening, same examples, same paragraph order")에 걸릴 수 있습니다. 소제목 순서는 판마다 다르지만, 소제목 안의 문장 순서와 예시·마무리가 다섯 판에서 같습니다.
- (a) 같은 예시 뼈대: ko:23 "타이베이에 사는 한국인 직장인이 LINE에서 알게 된 사람의 권유로 외환 플랫폼에 가입했다고 해 봅시다(가상의 사례입니다). 대만 은행 계좌에서 세 번 입금했고, 처음 두 번은 수익금이라며 소액이…" / ja:27 "台北で働く日本人の会社員が、SNSで知り合った相手に勧められて…登録したとします（架空の例です）。…3回送り、途中で2回、少額の「利益」が…" / zh:27 "台南一位工程師…先後從台灣的銀行帳戶入金三次，中間平台讓他出金兩次". 세 판 모두 '입금 3회 + 소액 출금 2회 + 심사비 요구'이고, ko·ja는 '타이베이의 자국민 직장인, SNS 권유, ~했다고 하자' 문장 틀까지 같습니다.
- (b) 같은 마무리: ko:67 "앞의 직장인에게 지금 가장 값진 것은 심사비를 보내기 전의 대화 화면, 그리고 수익금 두 건이 들어온 날짜와 보낸 계좌 번호입니다." / zh:69 "台南那位工程師手上最值錢的，現在是那兩筆出金的入帳日期與撥款帳號，以及保證金匯出前和客服的對話截圖。" / ja:69 "台北の会社員がいま手元に残すべきなのは、保証金を求めた画面と、2回の「利益」が振り込まれた日付と振込元の口座番号です。" / es:61 "…lo que más pesa en el expediente son las fechas y las cuentas de origen de esos primeros retiros pequeños." / en:63 "…the two or three small payouts you received are the first things investigators will ask about." — 다섯 판이 같은 문장을 옮긴 형태입니다(self-G5의 '마지막 문장 모두 다름'은 어휘만 다름).
- (c) 같은 모듈 내부 순서(다섯 판 공통):
  - 받은 출금: '플랫폼 돈이 아닐 수 있음 → 27조 → 30조 → 48시간 → 경시 효과(3조 2호·5조) → 9조(2년·1회 1년·원통보기관) → 대화·입금 기록 보존' (ko:27-33, zh:41-47, ja:41-47, en:49-51, es:27-31).
  - 대리 수령: '요청 → 22조(금지·告誡·3요건·3년) → 19조 → "수사≠유죄, 그러나 방어가 먼저" → 638 링크' (ko:37-39, zh:51-53, ja:57-59, en:53, es:51). 마지막 문장은 다섯 판이 같은 문장입니다: "수사를 받는다고 유죄가 정해지는 것은 아니지만, 피해 회복보다 자기 방어가 먼저인 처지가 됩니다" / "偵查中不等於有罪，也可以為自己辯護" / "捜査を受けても有罪と決まったわけではありませんが、被害の回復より自分の防御が先になります" / "An investigation is not a finding of guilt, but defending yourself would come before recovering anything" / "Ser investigado no es ser culpable, pero la víctima pasa a tener que defenderse".
  - 사법공조: '2조 → 5조 → 6조 → 30조 → 피해자는 직접 못 냄 → TxID·주소 정리' (ko:55, zh:59, ja:35-37, en:43, es:41).
  - 판결 뒤: '487(또는 059 링크) → 조례 54 → 55 → 473/38-1 → 무죄추정·상소' (ko:61, zh:63, ja:63, en:57, es:55).
  - 상한: '30조 1항 상한 → 48조 같은 상한 → 한 줄씩 목록 → 28조 창구 2시간' (zh:33-37, ja:51-53, en:31-35, es:45-47).
- (d) en·es 도입: en:21과 es:21이 같은 VnExpress 사실을 거의 같은 순서로 옮기고, 같은 두 문장으로 닫습니다("investigation is continuing; charges are not convictions. The report gives no figure for victims in Taiwan" / "La investigación sigue abierta y los imputados no han sido juzgados. La noticia no dice cuántas víctimas hay en Taiwán."). 도입 유형(사실/숫자)은 다르지만 내용 순서가 같습니다.
- 수정안(사실은 그대로, 판마다 독자 질문에 맞춰 순서와 무게를 바꿈):
  - ko: 가상 사례를 다른 상황으로 바꿉니다. 예: 이미 '세금' 명목으로 한 번 보낸 뒤 두 번째 요구를 받은 사람(30조 상한이 바로 걸리는 장면), 또는 가상 사례 없이 '세 갈래 돈' 단언으로 시작. 마지막 문장은 ko 고유 사실(예: 圈存 48시간 안에 원통보 경찰에 낼 소명 자료, 33조)로.
  - ja: USDT 예시는 유지하되 '2회 소액 출금'을 빼고(ja는 받은 출금 단락을 짧게), 46조(가상자산 사업자 창구·고객센터 → 165)와 45조 3항(해외 계정으로 나간 사실을 사업자가 원통보 경찰에 회신)을 USDT 단락에 넣어 ja만의 순서로. 마무리는 송금 해시·주소 목록 쪽으로.
  - zh: 사례는 유지 가능. 대리 수령 단락을 대만 독자에게 더 실질적인 22조 5항(위반자의 기존·신규 계좌 기능 정지·폐쇄)부터 시작하거나, 판결 뒤 단락은 246·059 링크로 줄이고 순서를 바꿉니다. 마무리는 切結書 금액 쪽으로.
  - en: 대리 수령을 money mule 관점(19조 수사 위험 먼저, 22조 나중)으로, 판결 뒤 단락은 237 링크와 함께 '해외에 있는 피해자' 관점으로 재배열. 마무리 문장은 en 고유 사실로(예: 미국 계좌에서 보낸 경우와 대만 계좌에 도착한 경우의 차이 — M2와 연결).
  - es: 도입의 VnExpress 문단을 숫자(5~10%) + 한두 문장으로 줄이고 '수사 진행·대만 수치 없음' 두 문장은 다른 표현·위치로. 사법공조 단락은 '피해자가 줄 수 있는 자료'를 먼저. 마무리는 송금 출발지(스페인·중남미 계좌)와 도착지 구분(M2) 쪽으로.
  - 대리 수령 단락의 '수사≠유죄' 문장은 적어도 세 판에서 위치와 표현을 바꿉니다(예: 단락 첫머리 경고로, 또는 638 링크 문장과 합침).
- 의미 보존: 조문 번호·48시간·2시간·2년/1년·3년·1/10·1년, '수사·기소는 유죄가 아님', 대만 피해 규모 미확인 표시는 모든 판에서 유지.

### G5-M2 en·es — 송금 '출발지'와 '도착지'를 섞어 틀린 결론
- 원문:
  - en:45 "Money wired from a US bank account sits outside these Taiwan rules altogether."
  - es:14 FAQ2 q "Envié el dinero desde una cuenta en España o en América Latina. ¿Sirven las retenciones de Taiwán?" — a는 "Las retenciones… obligan a bancos… situados en Taiwán. Lo que esté fuera de Taiwán solo puede alcanzarse pidiendo ayuda al otro Estado…"
  - es:39 "Hay quien paga desde una cuenta en su país de origen, y quien compra USDT…" (출발지 이야기를 꺼낸 뒤 USDT만 설명)
- 문제: 防詐應遵循事項辦法 27·30조의 圈存·경시는 '받은 쪽' 대만 기관에 걸립니다. 미국·스페인 계좌에서 보낸 돈이라도 대만 계좌에 도착했다면 그 대만 계좌는 신고 후 경시·圈存 대상이 될 수 있습니다. en은 스스로 en:57에서 237("When Scam Money Lands in a Taiwan Account and You Are Overseas")을 링크해 이 경우를 인정하므로 본문끼리 모순입니다. es FAQ2 답은 출발지를 기준으로 답해 독자를 '대만 조치는 안 된다'로 오도합니다.
- 수정안:
  - en:45 → "Where the money started does not decide this; where it landed does. A wire from a US bank that ended up in a Taiwan account can still be held on the Taiwan side after a report (see [237]); a wire that went from a US bank to an account outside Taiwan never touches these rules." 미국 쪽 신고처(IC3 등)를 쓰려면 공식 출처(ic3.gov)를 출처 목록에 넣고, 아니면 쓰지 않습니다.
  - es FAQ2 a → "Depende de adónde llegó el dinero, no de dónde salió. Si llegó a una cuenta en Taiwán, esa cuenta puede retenerse o quedar en alerta tras la denuncia (artículos 27 y 30 del Reglamento). Si llegó a una cuenta o monedero fuera de Taiwán, …(사법공조)…" 마지막 문장 "conviene avisar también a ese banco y a la policía local"는 일반 조언이라 남겨도 되지만, 본국 제도를 구체적으로 쓰면 공식 출처가 필요합니다.
  - es:39 → "Hay quien paga desde una cuenta en su país de origen a una cuenta taiwanesa —esa cuenta sí entra en el sistema de retenciones— y quien compra USDT y lo envía…" (문법 lo envían → lo envía 함께).
- 의미 보존: 圈存·경시는 대만 기관에만 미친다는 결론은 그대로, 판단 기준을 도착지로 바로잡음.

### G5-M3 ja FAQ3 — 조문 인용 오류("同条第2項")
- 원문(ja:14): "…期限の前でも、通報した機関の解除通報があれば銀行は制限を解きます（同弁法第10条）。名義人に疑問があれば、その機関に問い合わせます（同条第2項）。"
- 문제: 바로 앞이 第10条라 "同条第2項"는 10조 2항으로 읽힙니다. 10조 2항은 衍生管制帳戶 등의 해제 규정이고, 명의인 의문 → 원통보기관은 9조 2항("警示帳戶之開戶人…如有疑義，由開戶人洽原通報機關處理")입니다.
- 수정안: "（同弁法第9条第2項）".
- 의미 보존: 내용은 그대로, 조문 번호만 정정.

## SHOULD

### G5-S1 ko — 53조 발환 계산 방향 누락
- 원문(ko:47): "이때 은행은 입금 순서대로 따져 아직 인출되지 않은 부분을 정합니다(제53조)."
- 원문(조문): 「依匯（轉）入時間順序逐筆認定其尚未被提領部分，由最後一筆金額往前推算至帳戶餘額為零止」
- 문제: '입금 순서대로'는 먼저 들어온 돈부터로 읽힙니다. 조문은 마지막 입금부터 거꾸로 잔액이 0이 될 때까지 셉니다. 이 글의 독자에게 마지막 송금은 대개 심사비라 의미가 있습니다.
- 수정안: "은행은 입금 시각 순으로 한 건씩 보되, 마지막 입금부터 거꾸로 계좌 잔액이 0이 될 때까지 아직 인출되지 않은 부분으로 셉니다(제53조)."

### G5-S2 근거 없는 일반화
- 원문: zh:33 "報案時，很多人只記得第一筆、最大的那一筆。", ja:51 "最初の大きな入金だけを伝える人は少なくありません。", en:31 "People tend to report the first deposit and forget the rest. That costs them."
- 문제: 신고 행태에 관한 통계·출처가 없습니다(LESSONS #10 unsupported).
- 수정안: 조건문으로. zh "如果報案時只講了第一筆，後面幾筆就少了圈存的依據。" / ja "最初の入金だけを届け出ると、その後の送金は保全の根拠を欠きます。" / en "Report only the first deposit, and the later transfers have nothing behind them." (es:45는 이미 조건문이라 그대로.)

### G5-S3 en 명령형 소제목
- 원문(en:29): "## Report every transfer, including the fee"
- 문제: 체크리스트형 명령 소제목(EDITORIAL-VOICE·LESSONS #8).
- 수정안: "## The amount in the report is the ceiling" 같은 사실형, 또는 "## Why the fee belongs in the report".

### G5-S4 ko — 상대 날짜와 메타 문장
- 원문(ko:57): "대만 수사가 진행되는 동안 해외 사업자에 대해 피해자가 따로 무엇을 할 수 있는지는 어제 다룬 [해외 FX 계정 해킹 글](…)의 관할 설명과 겹칩니다."
- 문제: '어제'는 게시 다음 날부터 틀린 말이 되고, '겹칩니다'는 독자에게 필요 없는 편집 메모입니다.
- 수정안: "해외 업체를 상대로 대만에서 고소하거나 청구할 때의 관할은 [대만에서 해킹당한 해외 FX 계좌](…)에서 다뤘습니다."

### G5-S5 USDT 경로의 가상자산 사업자 규정(45조 3항·46조) 누락
- 원문: ja:51-53 "届出の金額…" 단락과 ja:55 직전 창구 설명은 은행 창구(28조)만 씁니다. ja 예시는 '대만 거래소에서 USDT를 사서 보낸' 사람입니다. en:41·es:39·zh:57도 USDT 경로를 다룹니다.
- 원문(조문): 46조 1항 「受詐騙民眾於虛擬資產服務商營業時間，親自至任一家虛擬資產服務商告知遭受詐騙時…請民眾填寫切結書並撥打165電話。如受詐騙民眾透過虛擬資產服務商客服告知遭受詐騙時，虛擬資產服務商應轉介民眾撥打165電話。」 45조 3항 「轉入帳號之虛擬資產服務商如發現經通報之詐騙虛擬資產已遭提領或已轉出至境外虛擬資產帳號者，應回復原通報警示虛擬資產帳號之司法警察機關。」
- 수정안: 적어도 ja에는 46조(거래소 영업시간 직접 방문 → 切結書·165, 고객센터 연락 시 165 안내)를 넣고, 해외로 나간 경우 45조 3항(대만 사업자가 원통보 경찰에 회신 — 추적 기록은 남지만 圈存은 안 됨)을 사법공조 단락 앞에 둡니다. M1의 ja 순서 바꾸기와 함께 하면 됩니다. 출처 목록에 45·46조 추가.

### G5-S6 FAQ와 '변호사에게 맡길 수 있는 일'이 같은 묶음
- FAQ: '받은 출금으로 내 계좌가 묶이나'(ko1·zh2·ja2·es1), '심사비도 신고에 넣나'(ko2·zh1·en2), '해외 지갑 동결 가능한가'(ko3·ja1·en3·es2)가 같은 질문·같은 답 순서입니다.
- 변호사 단락: ko:65·zh:67·ja:67·en:61·es:59 모두 '경로별 피해 금액표·고소장 → 진술 동행 → 내 계좌 소명 → 잔액·몰수 발환 → 부대민사·가압류 → 해외 지갑 자료 정리'가 같은 순서입니다.
- 수정안: 판마다 FAQ 하나 이상을 그 독자 고유 질문으로 바꿉니다(예: ko '한국 계좌에서 보낸 돈', ja '日本の口座から送った分'(225 링크), en 'U.S. bank wire', es 'cuenta en España', zh '代收' 유지). 변호사 단락은 순서를 바꾸고 판마다 한두 항목을 그 독자 사정으로(ko 한국어 자료 번역, ja 일본에서의 위임, en 해외 체류 중 대리 237, es 중국어 고소장 — es는 이미 있음).

### G5-S7 zh 내부 링크 문구
- 원문(zh:45): "可以參考[台灣銀行帳戶被列為警示帳戶](/zh-hant/columns/taiwan-warning-account-foreigners)"
- 문제: 대만 독자에게 '台灣銀行帳戶'는 臺灣銀行(은행 이름) 계좌로 읽힙니다. 실제 글 제목은 「在台銀行帳戶被列為警示帳戶怎麼辦」.
- 수정안: "[在台銀行帳戶被列為警示帳戶怎麼辦](…)".

## NIT

- G5-N1 ko FAQ1(ko:14) "…원통보 경찰기관에 연락하게 됩니다"는 圈存 단계 규정인 防詐應遵循事項辦法 33조(「受圈存款項之存款帳戶開戶人對其款項受圈存如有疑義，應由開戶人洽原通報警示之司法警察機關處理」)가 근거입니다. 괄호 인용과 출처 목록에 33조 추가.
- G5-N2 ja:67 주소 "台北市大同区承徳路一段35号7F-2" — 1026 ja 배포본처럼 원문 표기 "（臺北市大同區承德路一段35號7樓之2）"를 함께 쓰고, 사무소명도 1026 ja 표기(昊鼎国際法律事務所)와 맞춥니다.
- G5-N3 es: es:39 "y quien compra USDT y lo envían" → "lo envía"; es:13 alt "un vaso de té" → 이미지는 손잡이 달린 유리 찻잔이라 "una taza de vidrio con té"; es:61 "Antes de pagar la tasa, …"는 낼 것을 전제로 읽힘 → "Si todavía no ha pagado la tasa, …".
- G5-N4 en:63 "…are the first things investigators will ask about." — 수사기관 행동 예측은 근거가 없습니다. "…are what the report should be built on." 정도로.
- G5-N5 ko:39 洗錢防制法 22조 3항 형사처벌 요건을 둘만 씀(대가, 3개 이상). 다른 네 판은 '告誡 후 5년 내 재범'까지 셋. "…세 개 이상의 계좌를 넘겼거나, 告誡를 받고 5년 안에 다시 넘겼다면"으로 맞춤.
- G5-N6 '심사비 납부 의무' 표현이 판마다 강도가 다름: ko:51 "대만 법령상 의무는 없습니다", ja:21 "義務はありません"(앞에 '見る限り') vs en:27·es:35 "we found no / No hemos encontrado". 확인 범위는 같으므로 ko도 "…내야 한다고 정한 대만 법령은 찾을 수 없습니다"로 맞추는 편이 안전합니다.
- G5-N7 ko:23 "…가입했다고 해 봅시다", ja:27 "…登録したとします" — SENTENCE-VARIETY 2-4의 고친 예처럼 서술형 + (가상) 표시로. M1(a)를 고치면 함께 해결.
- G5-N8 es:55 "varias víctimas con las mismas pretensiones" — 조례 55조 원문은 「所主張之主要攻擊或防禦方法相同者」라 "cuyas pretensiones se basan en los mismos medios principales de ataque o defensa"가 정확합니다. ko:61 "같은 주장을 하는 피해자들"도 "주요 공격·방어 방법이 같은 피해자들"로 맞출 수 있음.

## 반영 후 다시 볼 것
variety_metrics 5판 FAIL 0, verify.sh G5, links.py(45·46·33조 링크 추가분 포함), 다섯 판 조문·숫자 재대조, 마지막 문단·FAQ를 나란히 놓고 같은 문장 순서가 남았는지.
