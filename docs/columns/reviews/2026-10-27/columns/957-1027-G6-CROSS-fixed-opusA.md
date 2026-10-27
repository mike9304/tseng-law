# CROSS-opusA — G6 중국 거래처와의 기술 공유·영업비밀·경제부 기술합작 허가 (검수자 opusA, 2026-10-27 10:14 KST)

판정: REQUEST_CHANGES (MUST 2, SHOULD 6, NIT 7)
대상: drafts/gap/G6/{ko,zh,ja,en,es}.md, slug.txt, images/G6-brief.txt·G6-hero.webp, reviews/self-G6.md, research/G6-angle.md·G6-facts.md
부모(opusA) 확인 10:16: M1 營業秘密法 제13조의1 제1항 본문 원문(「意圖為自己或第三人不法之利益，或損害營業秘密所有人之利益」)과 ko 29행·zh 39행·ja 39행·es 43행 문장을 직접 대조해 요건 누락을 확인.

검수자가 직접 확인한 것(검수자 사본: research/opusA-cross/G6/law/, G6-hero.png):
- law.moj.gov.tw LawSingle 원문을 10:04~10:11에 새로 받아 대조: 營業秘密法 2·7·11·12·13-1·13-2·13-3·13-4, 兩岸條例 2·9·35·86·91, 在大陸地區從事投資或技術合作許可辦法 4·6·7·8·10(LawAll 113-08-08), 國家安全法 3·8, 公司法 1. 형량·벌금 범위·배수(13-2 2~10배, 국안법 8 IV 2~10배), 13-3 고소 대상(13-1만), 13-4·국안법 8 VII 법인 벌금과 방지 노력 예외, 86 I·II·III, 9 IV ⑥·91 III, 허가판법 6 단서(개별 누적 투자액)·8 III(개시 후 6개월)·10 I(중지 후 2개월)·7 II(처분서 기재) — 아래 M1·S1·S6·N3·N4 외에는 다섯 판 모두 원문과 일치.
- 중국 상무부 통지(条法司, 2026-10-26 15:39, 마감 2026-11-24), 첨부 초안 전문(10조: 1조 근거 법률, 2조 적용범위, 3조 외국 실체·권리자, 5조 조치 6가지, 9조 거래 신청·동의, 10조 공포일 시행), 中央社 2026-10-26 20:46 기사, 상무부 대변인 답변(2026-10-20 21:57, 질문 문구에 10월 19일·《保护美国知识产权法》·5개 기업) — 다섯 판 모두 '초안/徵求意見稿/草案/draft/borrador'와 공고일·마감일로 기술, 확정법 표현 없음. 대만·홍콩·마카오 기업의 '외국 실체' 해당 여부를 '확인되지 않는다'고 쓴 것도 초안 문구와 일치.
- 18 U.S.C. §1831 govinfo(USCODE-2023) 원문 — en 서술은 N2 외 일치.
- variety_metrics FAIL 0(ko cv 0.547·short 0.086, zh 0.606·0.122, ja 0.54·0.08, en 0.638·0.219, es 0.592·0.16). zh 첫 문단 가상 장면 WARN은 배치 안 zh 장면형 오프닝이 G6 하나라 허용 범위.
- research/linkcheck.py: 링크 38개 non-200 0. 내부 링크 대상 제목을 src/content에서 확인(ko 116·134, zh 137·309, ja 117·273, en 170, es 646 — es 646은 S5).
- verify.sh 결과와 별도로 front matter 15개 키·faq 3개 JSON 파싱·published/lastmod 2026-10-27·featured_image "TBD"·audience·author 확인. 굵은 글씨·이모지·전화번호 0, H1 1개, 바이라인·AI 표시·'변호사 검토' 없음. 연락처: 이메일+타이베이 주소(1026 배포본과 같은 언어별 표기), en은 English-speaking lawyer in Taipei 포함. 사무소 이름 표기는 사이트 관례(ko 호정국제법률사무소(昊鼎國際法律事務所), ja 昊鼎国際法律事務所, en·es Hovering International Law Firm)와 같음.
- 대표 이미지(PNG 변환 후 열람): 빈 회의실, 통창 밖 고층 빌딩, 탁자 위 번호 자물쇠 금속 케이스·화면 흐린 노트북·흰 봉투·USB. 사람·로고·읽히는 글자 없음 — brief·alt와 일치(N5 표현 하나만).
- 중복: src/content 전체에서 許可辦法(Q0040001)·兩岸條例 35조 기술합작을 다룬 칼럼 0편. ko 116·zh 309가 13-1·13-2·9조 인원 허가를 일부 다루지만 G6의 독자 질문(중국 거래처에 넘길 때의 허가·회사 책임·초안)과 다름. ~/tseng-issues-1027은 G6와 겹치지 않게 ja 04를 DROP함(DROP 메모 확인).
- 판결 인용 없음(FJUD 오류 기록과 일치).

## MUST

### G6-M1 범죄 성립 요건 누락 — 營業秘密法 제13조의1 본문의 '의도' 요건
- 원문(조문): 제13조의1 제1항 본문 「意圖為自己或第三人不法之利益，或損害營業秘密所有人之利益，而有下列情形之一，處五年以下有期徒刑或拘役…」. 제13조의2는 「…而犯前條第一項各款之罪者」라서 이 의도 요건을 그대로 안고 갑니다.
- 원고(다섯 판 모두 요건 없이 행위만으로 죄가 된다고 씀):
  - ko 29행 "비밀유지 계약이 허락한 범위를 넘어 그 자료를 복제하거나 사용·누설하면 제13조의1 제1항 제2호의 죄가 됩니다." / 55행 "그 요구를 무시하고 자료를 남긴 행위는 제13조의1 제1항 제3호의 문제가 됩니다." / summary "제13조의2가 문제 되고 회사도 벌금 대상이 됩니다."
  - zh 39행「未經授權或逾越授權範圍重製、使用或洩漏他人的營業秘密，構成第13條之1第1項第2款。」/ 61행「對方仍不刪除或隱匿，就碰到第13條之1第1項第3款。」/ summary「公司也會被科罰金」
  - ja 39행「範囲を超えた複製・使用・漏えいは第13条の1第1項第2号の罪で」/ 55행「それに応じずに資料を残す行為は…第13条の1第1項第3号の問題になります」
  - en 29행 "Taiwan criminalizes use or disclosure "without authorization or beyond the scope of authorization" in Article 13-1…" / 61행 "Article 13-1, paragraph 1, item 3 punishes a holder who…"
  - es 43행 "Usarla o revelarla sin autorización o más allá de lo autorizado es delito con pena de hasta cinco años…" / summary "…y multa también a la empresa."
- 문제: 형사책임의 핵심 요건이 빠져 처벌 범위를 넓게 씁니다. 이 글의 장면(en 현장 엔지니어의 지원 요청 대응, ko 시제품 의뢰, zh 검수 때 원시코드 제공)에서는 바로 이 의도가 다툼의 중심입니다. 사이트 기존 ko 116도 "제13조의1의 행위·목적"을 나눠 씁니다. LESSONS 10(unsupported)·조건 보존 원칙 위반.
- 수정안: 다섯 판의 13-1 첫 서술에 요건을 넣습니다. ko 예: "자기나 제3자의 부당한 이익을 노리거나 고객(소유자)에게 손해를 입힐 의도로, 비밀유지 계약이 허락한 범위를 넘어 그 자료를 복제하거나 사용·누설하면 제13조의1 제1항 제2호의 죄가 됩니다." zh「意圖為自己或第三人不法之利益，或損害營業秘密所有人之利益，而未經授權…」, ja「自己や第三者の不法な利益を図り、または所有者に損害を与える意図で…」, en "with intent to obtain an unlawful benefit for oneself or a third party, or to harm the owner", es "con intención de obtener un beneficio ilícito para sí o para un tercero, o de perjudicar al titular". 3호(삭제 요구) 문장은 "…의 문제가 될 수 있습니다" 정도로 낮추거나 같은 요건을 짧게 다시 붙입니다. summary의 "회사도 벌금 대상이 됩니다 / 公司也會被科罰金 / multa también"은 "될 수 있습니다 / 也可能 / puede multar"로(13-4는 직원 범죄 성립과 방지 노력 예외를 전제).
- 의미 보존: 5년·100만~1,000만, 1~10년·300만~5,000만, 미수, 13-3·13-4 서술은 그대로.

### G6-M2 번역 금지 — 세 판 이상에 같은 예시·같은 문장 순서로 옮겨진 단락
- (a) 계약 단락: ko·ja·zh가 같은 세 요소를 같은 흐름으로 씁니다. ja는 ko 단락을 옮긴 것처럼 읽힙니다.
  - ko 55행 "각자 가져온 배경기술의 목록, 공동 성과의 귀속, 독자 개발을 보여 주는 기록은 나중에 중국 쪽이 상업비밀 침해를 주장할 때 반박 자료가 됩니다. … 계약이 끝날 때 삭제·폐기를 서면으로 요구해 두면 … 제13조의1 제1항 제3호의 문제가 됩니다. 경제부 허가를 계약 효력의 조건으로 적어 둘 수도 있습니다."
  - ja 55행「双方が持ち込んだ背景技術の一覧、共同成果の帰属、独自開発の記録を残しておく意味はここにもあります。中国側から侵害を主張されたときに反論の材料になるからです。契約終了時に削除・廃棄を書面で求めておけば…第13条の1第1項第3号の問題になります。経済部の許可取得を契約の効力発生条件にしておく書き方もありえます。」
  - zh 61행「合作結束時以書面要求刪除、銷燬…第13條之1第1項第3款。共同開發的部分，雙方各自帶進來的背景技術清單、共同成果的歸屬與獨立開發紀錄…都是證據。至於經濟部許可，也可以寫成合約生效的條件。」
  - en 61행·es 57행도 같은 '배경기술 목록 + 독자 개발 기록 + 허가를 인도 전 조건으로' 묶음을 씁니다(문장은 다름). 다섯 판 모두 같은 계약 조언 세트로 끝나는 셈입니다.
- (b) 인원 입경 허가 단락: ko 49행 "중국 공장에 기술 지원을 보낼 직원도 따져 볼 대상입니다", zh 49행「派去大陸裝機、教學的工程師也要過濾。」, ja 47행「中国の工場へ技術指導に出す社員にも別の確認があります。」 — 같은 예시, 같은 위치(국가안전법 단락 바로 뒤), 같은 9조→91조 두 문장.
- (c) '간접' 기술합작 결론: ko FAQ1 "계약 구조와 기술의 출처를 놓고 따로 판단해야 합니다", ja 27행「どこまでが対象かは、契約の当事者と技術の出どころを見て判断するしかありません。」, en 45행 "How far that word reaches depends on who contracts and where the technology came from." — 같은 예시(본사가 서명하고 노하우는 대만에서 개발)와 같은 결론 문장.
- 문제: 도입과 큰 순서는 판마다 다르지만, 위 세 군데는 예시와 문장 순서가 같아 게이트의 '번역처럼 읽히는 판' 기준(same examples, same paragraph order)에 걸립니다. 1026 G1-M1과 같은 유형입니다.
- 수정안: 계약 단락은 각 판의 장면에서 나온 조항 하나를 중심에 두고 나머지는 줄입니다. 예: ko → 고객 NDA가 허락한 공장·자료·기간과 중국 공장에서 자료를 회수·삭제받는 조항(ko 장면이 고객 도면이므로 공동개발 배경기술 목록은 빼거나 한 줄로), zh → 驗收 전에 원시코드 제공 범위(機台·期間)와 경제부 허가 순서, ja → 본사·자회사 간 許諾書(이미 마지막 문단의 주제)로 단락을 다시 짜고 배경기술 목록은 빼기, en·es는 현행 유지하되 '허가를 조건으로' 문장은 두 판 이하로. 인원 단락은 zh에 두고(대만 국적 엔지니어가 주 대상), ko·ja는 S1의 '臺灣地區人民' 한정을 반영하면서 '대만인 직원을 중국 공장에 보낼 때' 쪽으로 각도를 바꾸거나 위치·표현을 바꿉니다. (c)는 ko FAQ·ja 본문·en 본문 중 적어도 두 판의 결론 문장을 바꿉니다(예: ja는 허가판법 제4조 문언만 제시하고 판단 요소를 '契約上の許諾者は誰か'로, en은 "indirectly" 문언 자체에서 멈추기).
- 의미 보존: 13-1 I③, 營業秘密法 7, 許可辦法 4, 兩岸條例 9 IV⑥·91 III의 조문 번호와 숫자, '간접' 해당 여부를 단정하지 않는 단서는 모든 판에서 유지.

## SHOULD

### G6-S1 兩岸條例 제9조 제4항 제6호의 대상·기간 서술
- 원문: 제9조 제4항 본문「臺灣地區人民具有下列身分者，進入大陸地區應經申請，並經…審查會審查許可」, 제6호「受政府機關（構）委託、補助或出資達一定基準從事涉及國家核心關鍵技術業務之個人或法人、團體、其他機構之成員；受委託、補助、出資終止或離職未滿三年者，亦同。」, 제2조 제3호「臺灣地區人民：指在臺灣地區設有戶籍之人民」.
- 원고와 문제:
  - ko 49행·ja 47행: 한국·일본 기업 독자에게 "직원/社員"이라고만 써서 한국·일본 국적 파견자도 대상인 것처럼 읽힙니다. 이 조항은 대만에 호적이 있는 사람(臺灣地區人民)에게 적용됩니다. ko·ja는 '일정 기준 이상(達一定基準)'도 빠졌습니다(zh는 있음).
  - zh 49행「…的人員，離職或計畫終止未滿三年，進入大陸地區須經審查會許可」, ja 47행「…業務に就く人は、終了や離職から3年未満の間、大陸地区に入るには審査会の許可が必要です」: 퇴직·종료 후 3년 미만만 대상인 것처럼 읽힙니다. 원문은 현직자가 원칙이고 종료·퇴직 후 3년 미만도 같다(亦同)는 구조입니다. 이 단락의 예시(지금 파견할 엔지니어)는 현직자입니다.
- 수정안: ko "대만 국적(대만 호적이 있는) 직원 가운데 정부의 위탁·보조·출자가 일정 기준에 이른 국가핵심관건기술 업무를 맡는 사람은, 그 일을 하는 동안은 물론 끝나거나 퇴직한 뒤 3년이 지나기 전까지도…", zh「…從事國家核心關鍵技術業務的人員，在職期間進入大陸地區須經審查會許可，計畫終止或離職未滿三年者亦同」, ja「台湾籍（台湾に戸籍のある）社員で…業務に就いている人は、在任中も、終了・離職から3年未満の間も…」.
- 의미 보존: 3년, 200만~1,000만 과태료(91 III).

### G6-S2 ko 2문단의 과도한 일반화 — "지금 효력이 있는 규칙은 대만 쪽 법률"
- 원고(ko 23행): "대만에 법인을 두고 중국 거래처와 일하는 한국 기업에 지금 효력이 있는 규칙은 대만 쪽 법률입니다."
- 문제: 중국에서 상업비밀 침해를 다투는 현행 법률이 있고, 초안 제1조도 근거로 「《中华人民共和国对外贸易法》、《中华人民共和国反不正当竞争法》等有关法律法规」를 듭니다. 문장이 '중국 쪽에는 시행 중인 규칙이 없다'로 읽힙니다.
- 수정안: "초안과 달리, 이 글이 다루는 대만 쪽 조문은 지금 시행 중입니다." 또는 "…한국 기업이 대만에서 먼저 따져야 할 것은 이미 시행 중인 대만 법률입니다."
- 의미 보존: 초안 상태·마감일 문장은 그대로.

### G6-S3 출처 없는 일반화와 가상 표시 없는 장면
- 원고:
  - es 23행 "Muchas empresas con sede en España o en América Latina tienen en Taiwán una filial que diseña o adapta software para fábricas asiáticas. Un esquema frecuente es vender las licencias a un distribuidor de Hong Kong…" — 실태 주장('많은', '흔한 구조')에 출처가 없고, es 글 전체의 기본 장면인데 가상 표시가 없습니다.
  - en 27행 "Most U.S. groups run this through an intercompany license" — 출처 없는 '대부분'.
  - zh 37행「設備商手上的參數，常常是和台灣客戶一起調出來的。」 — 출처 없는 '常常'.
- 문제: TASK '사례·통계·수치 지어내기 금지', SPEC의 가상 표시 원칙(SENTENCE-VARIETY 2-4, LESSONS 11).
- 수정안: es "Pongamos la filial taiwanesa de un grupo español que adapta software para fábricas asiáticas y vende las licencias a un distribuidor de Hong Kong, que las coloca en plantas de Guangdong (un caso inventado)." en "Where the group uses an intercompany license — the parent owns the code, the Taiwan subsidiary may use it — Article 7…". zh「如果參數是和台灣客戶一起調出來的，客戶交付的配方、良率資料…」.
- 의미 보존: 장면의 구조(홍콩 유통사·광둥 공장, 부모 소유 코드)는 그대로.

### G6-S4 zh「錢的問題另外算。」 뒤에 금전 아닌 구제
- 원고(zh 43행):「錢的問題另外算。客戶可以依第11條請求排除侵害，有侵害之虞時請求防止，對侵害行為作成之物或專供侵害所用之物，也可以請求銷燬或為其他必要處置。」
- 문제: 第11條는 排除·防止·銷燬 청구로 금전 청구가 아닙니다. 손해배상은 第12條(「因故意或過失不法侵害他人之營業秘密者，負損害賠償責任」, 知有行為及賠償義務人時起二年·行為時起十年)입니다. 첫 문장과 근거 조문이 어긋납니다(LESSONS 3 wrong-citation 유형).
- 수정안: 첫 문장을「民事上，客戶還有另一條路。」로 바꾸거나, 금전을 말하려면 第12條를 링크로 추가하고 참고資料에도 넣습니다.

### G6-S5 es 내부 링크 설명이 대상 글과 맞지 않음
- 원고(es 59행): "Sobre cómo probar qué aportó cada parte en un contrato tecnológico, véase [este artículo](/es/columns/taiwan-mixed-technology-contract-source-contribution-evidence)."
- 대상 글(src/content/columns-es/646): 제목 "Una factura tecnológica desde España o Latinoamérica: qué justifica la retención en Taiwán", topic "tax", 라이선스+기술 용역 혼합 청구의 원천징수(소득 원천) 증빙을 다룹니다. 영업비밀·기여 입증 글이 아닙니다. 링크 문구도 "este artículo"로 막연합니다.
- 수정안: 설명을 실제 내용에 맞춥니다. 예: "Si la filial factura a la vez licencia y trabajo técnico, la retención en Taiwán se explica en [Una factura tecnológica desde España o Latinoamérica](…)." 맞지 않으면 링크를 뺍니다(es에 영업비밀 칼럼은 없음 — src/content/columns-es 검색 결과 0).

### G6-S6 es 보고 기한의 기산점이 흐림
- 원문: 許可辦法 제8조 제3항「應於開始實行後六個月內…報備技術合作開始日期」.
- 원고(es 35행): "Una vez concedido, la empresa comunica la fecha de inicio de la cooperación técnica dentro de los seis meses siguientes" — '허가 뒤 6개월'로 읽힙니다.
- 수정안: "…dentro de los seis meses siguientes al inicio de la cooperación técnica". (LESSONS 2: 기산점)

## NIT

- G6-N1 13-4·국안법 8 VII 예외의 강도: 원문「已盡力為防止行為」. en 33행 "unless its representative made efforts to prevent the offense", es 45행 "salvo que su representante se haya esforzado por impedirlo"는 '노력했다' 정도로 약합니다 → "made every effort to prevent it" / "haya hecho todo lo posible por impedirlo". (ko "힘을 다한", ja「力を尽くしていた」, zh「已盡力防止」는 그대로 좋음.)
- G6-N2 en 37행 §1831: "with fines up to $5 million or 15 years for individuals" → "a fine of up to $5 million, up to 15 years in prison, or both, for individuals"(원문 "fined not more than $5,000,000 or imprisoned not more than 15 years, or both"). 같은 단락 "Taiwan's Article 13-2 asks a narrower factual question" — 바로 뒤 "No state beneficiary is required"로 보면 적용 범위는 오히려 넓으므로 "a different factual question" 또는 "a simpler factual question".
- G6-N3 兩岸條例 86 II「處行為人二年以下有期徒刑、拘役或科或併科新臺幣二千五百萬元以下罰金」: en 49행 "up to two years in prison or a criminal fine of up to NT$25 million", es 37행 "hasta dos años de prisión o a una multa penal de hasta 25 millones"에 '또는 병과(or both / o ambas)'가 빠짐.
- G6-N4 ko 29행 "법정형은 5년 이하 징역이고" → 원문「五年以下有期徒刑或拘役」, "5년 이하 징역 또는 구역(拘役)".
- G6-N5 대표 이미지 alt·brief 표현: 이미지의 빌딩은 시점보다 높이 솟아 있어 '내려다보는' 구도가 아닙니다. ko 13행 "고층 빌딩이 내려다보이는" → "통창 밖으로 고층 빌딩이 보이는", zh 13행「俯瞰高樓群的」→「窗外是高樓群的」, en 13행 "overlooking high-rise towers" → "with high-rise towers beyond the windows", images/G6-brief.txt도 같이. (ja「望む」, es "con vistas a"는 그대로 좋음.)
- G6-N6 en 문단 시작: 23행 "Taiwan law sees two." 29행 "Taiwan criminalizes…" 39행 "Taiwan's version…" — 같은 단어로 시작하는 문단 3개(규칙 2-3은 2개까지, 도구는 Taiwan's를 따로 셈). 하나를 바꿉니다(예: 29행을 "Article 13-1, paragraph 1, item 2 makes it a crime…"처럼 조문을 주어로 시작).
- G6-N7 ko 59행 링크 설명 "영업비밀 소송 절차는 [영업비밀 분쟁의 민사·형사 책임]에 정리해 두었습니다" — 대상 ko 116은 민사·형사 책임 개관이므로 "영업비밀 침해의 민사·형사 책임은 …에서 다루었습니다"가 정확합니다.

## 확인했지만 지적하지 않은 것
- 각 판 오프닝 유형(ko 초안 조문 인용, zh 장면+질문(虛構情境 표시), ja 규범 사실, en 장면(an invented example), es 숫자 하나)과 전체 절 순서는 서로 다름. 배치 안 zh·en 장면형 오프닝은 G6 하나.
- en의 10/20 상무부 대변인 발언은 "in the ministry's account"로 출처 귀속하고 "Timing gives context, not proof of motive"로 인과를 주장하지 않음 — 원문 질문 문구와 일치.
- ja FAQ2의 許可弁法 제7조 제2항 서술, zh FAQ1의 '단순 전시' 질문 처리(個案判斷), es의 홍콩=13-2 목록 포함 서술은 원문과 일치.
- 公司法 제1조로 대만 설립 회사를 대만 법인으로 설명한 ja·en·es 서술은 조문 범위 안. 許可辦法에 외국인 투자 사업에 대한 별도 조항 없음(LawAll 확인).
