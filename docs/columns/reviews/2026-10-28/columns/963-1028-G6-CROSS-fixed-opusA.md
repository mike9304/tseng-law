# CROSS-opusA — G6 대만 법인 외국인 관리자와 제84조의1 책임제 (검수자 opusA, 2026-10-28 09:51 KST)

판정: REQUEST_CHANGES (MUST 7, SHOULD 3)
대상: drafts/gap/G6/{ko,zh,ja,en,es}.md(09:48:55 alt 수정본), slug.txt, images/G6-brief.txt, research/G6-angle.md·G6-facts.md, reviews/self-G6.md, research/opusB-parent/G6/
SHA256:
- 45637cceb4380d3ebcc5094e50b5a54b532c9c3ae5170735ddf7630351956bec ko.md
- c4e441d240ce3548268bb7408620a91b47959f34ffb08b480a80226f018b7384 zh.md
- c6f3add864b3dd449d888edb9af8dc34cc22223a9564adaa11df3232d3c95239 ja.md
- 10f77bfe8e849b0dd7dd35c3e164c5fbbf967d2be7affbf094a1e717d9cbac68 en.md
- 0da465c69dca35c2988914ba276441d5d11efda057ce11a8bd5858c3eadcbdf0 es.md
(09:48 수정은 다섯 판 featured_image_alt 한 줄뿐임을 research/opusB-parent/G6/before-alt/와 diff로 확인)

검수자가 직접 확인한 것(문제 없음):
- law.moj.gov.tw 원문 사본(research/law): 勞動基準法 2③·24①②·30①⑤⑥·32①②·79①②·84-1①②, 施行細則 50-1①②·50-2, 勞動事件法 38, 民法 126·128. 다섯 판의 배제 조문 목록(30·32·36·37·49, 24 없음), 50-1 정의, 50-2 기재 사항, 24 가산율(1/3·2/3, 휴식일 1⅓·1⅔), 79 금액(2만~100만, 30⑤ 위반 9만~45만)이 원문과 같다. 32조 동의 주체만 아래 M5.
- 勞動部 「現行勞動基準法第84條之1工作者」 PDF(G6-mol-841-list.txt): 86.7.11 첫 항목(029625號), 87.3.4 資訊服務業(004365號)·法律服務業(008724號), 87.4.4 廣告業, 108.5.23 勞動條3字第1080130514號, 마지막 113.11.14 — 본문 날짜·문호와 같다. 제조업·금융업 관리자 전용 항목 없음, 系統研發工程師與維護工程師는 資訊服務業 항목에만 있음(es 요약 'solo' 성립).
- 勞動部 2022-08-19 보도자료(G6-mol-54659.html): 첫 항목이 운전기사 항목이고 112-01-01부터 위탁 운전기사 적용 중지 — ko·zh·ja 서술과 같다.
- 勞動部 電子報 第46期(WebFetch 09:5x 재확인): 「本項經指定之適用範圍，必須同時符合「監督、管理人員」及「每月工資達新臺幣15萬元以上」兩項要件，缺一不可。」, 發布日期 2019-08-29.
- 臺北市政府公報 111年第236期 일람표(G6-taipei-841-list.txt 5~15행): 第一類 1번이 資訊服務業 系統研發工程師與維護工程師(第二款), 한도 10/12시간·4주 168·월 240·간격 11시간 — es 43행·FAQ2와 같다.
- 外國專業人才延攬及僱用法 전문(G6-yanlan-all.html): 「工作時間」 0건, 勞動基準法 언급은 第24條(退休金)뿐 — zh 57행·es 49행 성립.
- 연합뉴스 2026-10-27 18:46(G6-yna.html): 장관 답변 「그런 주장이 가능할 것 같다」, 이용우 의원 지적 문구, 법률/시행령 확답 없음 — ko 21행 인용 일치(맥락만 M6).
- DOL Fact Sheet #17A(WebFetch 09:5x): "Revised September 2019", $684 per week, 네 요건, "Job titles do not determine exempt status." — en 25행 일치(FAQ2 표현만 S1).
- 대표 이미지: G6-hero.webp를 png로 열어 봄(개방형 사무실, 스탠드 켜진 책상 하나, 노트북·종이·서류철, 왼쪽 벽시계, 통유리 밖 타이베이 야경, 사람·로고·읽히는 글자 없음). 09:48 수정한 alt 다섯 판과 brief가 실물과 맞는다.
- variety: ko·zh-hant·ja·en FAIL 0(ko·ja 어미 WARN만), es(tools/variety_metrics_es.py --lang es) FAIL 0. 굵은 글씨·__·<strong> 0, 이모지·전화번호·바이라인 없음.
- 링크: tools/links.py 외부 20개 중 non-200은 dol.gov 403 1개(봇 차단, WebFetch로 열림). 내부 링크는 curl로 라이브 확인 — /ja/columns/taiwan-overtime-pay-responsibility-system-japanese-managers·/ko/columns/korean-team-taiwan-after-hours-messages-overtime(도구는 MISSING 표시, 라이브 200), /{ko,zh-hant,ja,en}/services/labor 200, /es/services 200(/es/services/labor는 404라 es가 /es/services를 쓴 것이 맞음).
- front matter: main 952~957 배포본과 같은 키·형식(read_time·categories·topic·audience 단일 로케일·author "legal-ai-assistant"), published/lastmod 2026-10-28, featured_image "TBD", faq 3개.
- 중복: ja 716·zh 062·ko 908·en 221과 질문이 다르다는 angle 판단에 동의. ~/tseng-issues-1028/TASK.md 4행이 이슈 쪽에서 '한국 3(화이트칼라 예외=G6)'를 제외함.

## MUST

### G6-M1 번역형 단락 대응 — ko·zh·ja의 '공고 목록' 네 문단이 같은 순서·같은 주제문 (게이트 MAJOR 유형)
- 대응(문장 단위, 같은 순서):
  - (a) 목록 소개 → 관리자 항목은 대부분 업종별 → 정보서비스업(1998.3.4)·법률서비스업·광고업 經理級 → 제조업·금융업 항목 없음: ko:33(+37 첫 문장) = zh:27 「主管類的項目多半綁著行業：資訊服務業…（87年3月4日公告）、法律服務業…、廣告業…。表上沒有製造業或金融業主管的專屬項目。」 = ja:27 「…資訊服務業…、法律服務業…、広告業…というように、業種が先に書かれています。製造業や金融業の管理職だけを対象にした項目は、この表にありません。」 (en:33도 같은 세 업종·같은 순서·"no entry for managers in manufacturing or banking")
  - (b) 「업종을 묻지 않는 관리자 항목은 하나입니다」 → 첫 항목 1997.7.11 駕駛 → 2022.8.19 보도자료 → 2019.5.23 항목 → 전자보 46 '하나라도 빠지면 안 된다': ko:35 = zh:29 「不分行業的只有一項。表上第一項86年7月11日…對象是駕駛，勞動部111年8月19日新聞稿…主管專用而不分行業的，是108年5月23日…電子報第46期…缺一不可。」 = ja:29 「業種の限定がない管理職の項目は一つです。表の最初にある1997年7月11日…運転手の項目で…2022年8月19日の報道資料…2019年5月23日…電子報第46期…どちらも欠けてはならない」 — 여섯 문장이 같은 순서(부모 수정으로 駕駛 문장이 세 판에 같은 자리로 들어감).
  - (c) '제조업 → 남는 것은 이 항목': ko:37 「목록에는 제조업 관리자 항목이 따로 없으니 남는 것은 15만 대만달러 항목입니다」 = zh:31 「製造業子公司的外籍主管，表上能對應的就剩這一項。」 = ja:31 「日系の製造子会社の部長なら、たどり着くのはこの項目です。」(zh·ja는 같은 자리의 한 줄 문단)
  - (d) '15만을 넘어도 50-1① 결정권이 남는다' 주제문: ko:39 「월급이 15만 대만달러를 넘는 부장에게도 두 번째 조건이 남습니다」 = zh:35 「月薪過了15萬元，還要符合施行細則第50條之1第1款」 = ja:35 「月給の線を越えても、まだ半分です。」
- 수정: 사실(날짜·문호·항목명·缺一不可)은 그대로 두고 ko만 지금 순서를 유지한다. zh·ja는 아래처럼 출발점과 순서를 바꾼다.
  - zh(인사 담당자 관점, 회사 업종별 분기 + 첫 항목 오독 주의): zh:27~31을 다음 두 문단으로 바꾸고 zh:35 첫 문장을 '어느 항목이든 50-1①' 문장으로 바꾼다.
    - 「人資翻開勞動部的[《現行勞動基準法第84條之1工作者》](…PDF…)一覽表，最容易誤讀的是第一項。86年7月11日公告的「事業單位之首長、主管以及獲有配車人員之駕駛」，指的是替首長、主管和配車人員開車的駕駛，不是首長或主管本人；勞動部[111年8月19日新聞稿](https://www.mol.gov.tw/1607/1632/1633/54659/post)談的，也是這類駕駛委外能否適用。」
    - 「真正要對照的，是子公司所屬的行業。資訊服務業與法律服務業各有主管項目（都是87年3月4日公告），廣告業則是經理級以上人員；製造業、金融業的子公司在表上找不到行業別的主管項目，只能看108年5月23日勞動條3字第1080130514號公告的「事業單位僱用每月工資達新臺幣十五萬元以上之監督管理人員符合勞動基準法施行細則第五十條之一第一款規定者」。勞動部在[電子報第46期](https://www.mol.gov.tw/2578/21001/23126/)說明，「監督、管理人員」與「每月工資達新臺幣15萬元以上」缺一不可。」
    - zh:35 첫 문장 → 「不論對上哪一項，主管本人都要符合[施行細則第50條之1](…)第1款：…」(資訊服務業 항목도 第1款을 요구하므로 사실과 맞고, ko:39의 '15만을 넘어도' 틀과 달라진다).
  - ja(決定権 관점): 「## 採否を決めるのは誰か」(ja:33~39)를 목록 절보다 앞으로 옮기고, ja:35 첫 문장 「月給の線を越えても、まだ半分です。」를 「先に、台湾法の定義を見ておきます。」 같은 문장으로 바꾼다. 목록 절(ja:27~31)은 결론부터 쓰는 한 문단으로 줄인다. 예:
    - 「日系の製造子会社の部長が当たりうる項目は、勞動部の[一覧表](…PDF…)ではほぼ一つに絞られます。資訊服務業・法律服務業・広告業の管理職には業種ごとの項目がありますが、製造業や金融業の管理職だけを対象にした項目はなく、残るのは2019年5月23日の「事業単位が雇用する月給15万台湾ドル以上の監督管理人員で、施行細則第50条の1第1号に当たる者」（勞動條3字第1080130514號公告）です。勞動部は[電子報第46期](…)で、二つの要件はどちらも欠けてはならないと説明しています。なお表の冒頭の1997年7月11日「事業單位之首長、主管以及獲有配車人員之駕駛」は、首長や主管の車を運転する人の項目です（勞動部[2022年8月19日の報道資料](…)）。」
    - ja:31 한 줄 문단은 삭제(위 문단 첫 문장이 흡수).

### G6-M2 번역형 — es가 en의 도입 동작·'조건이 빠졌을 때' 절·마무리를 그대로 따름 (게이트 MAJOR 유형)
- 대응:
  - 도입: en:21 「Does that word carry any weight…? Not much. Taiwan's Labor Standards Act has no general exempt category, and the one route … runs through a government list, a signed agreement and an approval stamp.」 = es:21~23 「¿Basta esa palabra…? No basta. La Ley de Normas Laborales … no tiene una categoría general de trabajadores excluidos de la jornada. Lo que existe es un régimen especial, con tres condiciones.」(라벨 단어 → '그 말로 충분한가' 질문 → 부정 → '일반 예외 범주 없음' → 세 조건)
  - 절: en:43 「## When a gate is missing」 → 45(30조 8/40 → 32조 12시간·46시간 "base cap" → 24조) → 47(30⑤⑥ → 勞動事件法38 → 民法126 "generally treated") = es:51 「## Si falta alguna condición」 → 53(30조 → 32조 "como regla, 46" → 24조) → 55(30⑤⑥ → 38 → 126 "suele tratarse"). 같은 문단 순서·같은 완충어.
  - 마무리: en:53 「…then asks to see the list entry, the signed agreement and the approval letter.」 = es:59 「La lista del Ministerio, el acuerdo firmado y el sello de aprobación, sí.」
- 수정(es만 고치고 en은 유지):
  - es:23 → 「La respuesta depende menos de esa palabra que del sector de la empresa y del puesto. El único régimen que permite pactar una jornada al margen de las reglas comunes es el del artículo 84-1 de la [Ley de Normas Laborales (勞動基準法)](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=N0030001), y la primera pregunta para una ingeniera es si su puesto aparece en la lista del Ministerio de Trabajo.」
  - es:51~55 → 소제목을 「## Lo que cuenta el registro de asistencia」 같은 것으로 바꾸고 순서를 기록에서 시작: 출근기록 사본 요청(30⑤⑥) → 소송상 추정(38) → 그 기록으로 일반 한도(30①·32②)와 24조 가산을 계산 → 民法126 5년. 문장도 새로 쓴다(en:45의 "base cap" 대응어 «como regla» 삭제 등).
  - es:59 → es 각도의 사실로 끝낸다. 예: 「Y aun con todo en regla, para el grupo de esta ingeniera Taipéi revisa los acuerdos con un máximo de 12 horas al día y al menos 11 horas de descanso entre una jornada y la siguiente.」(G6-taipei-841-list.txt 5~15행)

### G6-M3 번역형 — '핵비 ≠ 무제한(타이베이 일람표) → 배제 목록에 24조 없음 → 약정 시간 초과분은 약정서로' 문장쌍이 다섯 판에 같은 순서 (게이트 MINOR~MAJOR 유형)
- 대응: ko:45 「핵비를 받았다고 근로시간에 끝이 없어지지도 않습니다. 타이베이시 정부는…」 = zh:45 「核備也不是讓工時無上限。臺北市政府在公報刊登的…」 = en:39 「It does not mean unlimited hours. Taipei City publishes a review table…」 = es:43 「Aprobar no significa jornada libre. El Gobierno de la Ciudad de Taipéi publicó…」. 이어서 ko:47 「연장근로임금을 정한 제24조는 거기에 없습니다. 약정한 시간을 넘겨 일한 부분을 어떻게 계산할지는 핵비받은 약정서의 근로시간 조항과 맞춰 보게 됩니다.」 = zh:47 「規定延長工時工資的第24條不在這份清單上，超過約定工時的部分怎麼計算，要回到核備的約定書條款來看。」 = en:41 「Article 24, the overtime-pay rule, is not on that list. How hours beyond the agreed schedule are counted goes back to the approved agreement itself.」(세 판 두 문장 그대로), ja:49→51·es:43→45도 '타이베이 일람표 → 24조' 같은 순서.
- 수정(en 유지, 나머지는 위치·주제문 변경. 24조 사실은 다섯 판 모두 남긴다):
  - ko: ko:47 둘째 문장 삭제(FAQ2 답과 중복). 첫 문장은 ko:41 과장 예시 문단 끝으로 옮겨 「…휴식일 근무는 …더합니다(제24조). 이 제24조는 책임제 약정이 핵비를 받아도 배제되는 조문에 들어 있지 않습니다.」처럼 쓴다. ko:45 둘째 문장 시작을 「회사가 타이베이시에 있다면 핵비 심사에서 근로시간 한도도 봅니다. 타이베이시 정부는…」로.
  - zh: zh:47을 zh:43 끝에 붙여 「…（施行細則第50條之2）。核備後可以不受第30條、第32條、第36條、第37條、第49條限制，但規定延長工時工資的第24條不在其中。」로 하고 '回到約定書條款' 문장은 삭제. zh:45 첫 문장 「核備也不是讓工時無上限。」 → 「公司設在臺北市的，核備時還要對照臺北市政府在公報刊登的…一覽表（111年第236期）…」.
  - ja: ja:51을 ja:49의 台北市 문장 앞으로 옮긴다(배제 조문 → 24조 → 台北市 일람표 순서).
  - es: es:43 첫 문장 「Aprobar no significa jornada libre.」 삭제, 숫자로 시작(「En Taipéi, para el grupo en el que figuran estos ingenieros, la tabla de revisión… fija…」). es:45 「Queda un detalle…」는 FAQ3 답 첫 문장으로 옮기거나 M2의 새 '기록' 절 안 24조 계산 대목에 붙인다.

### G6-M4 번역형 — ko·en summary와 ko·en·es 변호사 단락이 같은 틀 (게이트 MAJOR 유형, 1027 G1·G3과 같은 지적)
- summary: ko:4 [직함만으로 빠지는 일반 예외 없음 → 공고 직종이어야 → 업종 불문 항목은 2019.5.23 15만+결정권 하나 → 서면·핵비 → 24조 배제 안 됨] = en:4 [exempt 라벨 대응 없음 → 84-1(목록·서면·승인) → 유일한 업종 불문 항목 2019.5.23 15만+결정권 → 그래도 24조 배제 안 됨]. 문장 순서·주제문이 같다.
- 변호사 단락: ko:55 「서류 석 장…급여명세서의 월 임금, 책임제 약정서, 핵비 통지서 → 어느 항목·결정권 → 출근기록 사본 신청·계산표 → 노동국 조정·법원 노동조정 → 회사 쪽이라면 약정서·핵비」 = en:51 「read the U.S. offer letter, the Taiwan employment contract and any Article 84-1 agreement side by side → list·50-1 → approval letter → requesting attendance records, calculating, mediation at the labor bureau or court labor mediation → For a U.S. parent, … drafting the agreement and filing」 = es:57 「lo que la ingeniera tiene en el correo: el contrato, el acuerdo de 責任制…y los recibos de salario → lista·inciso 2·aprobación → calcula → conciliación」. '서류 세 가지' 장치와 단계 순서가 세 판 같다.
- 수정:
  - ko:4 → 「한국에서 고소득 전문직 근로시간 예외를 둘러싼 논쟁이 이어지는 동안, 대만은 노동기준법 제84조의1과 노동부 공고 목록으로 같은 문제를 다뤄 왔습니다. 대만 법인의 한국인 관리자가 들어갈 수 있는 항목은 정보서비스업·법률서비스업·광고업 같은 업종별 항목, 아니면 2019년 5월 23일 공고된 '월 임금 15만 대만달러 이상이면서 채용·해고·근로조건 결정권을 가진 감독·관리인원' 항목입니다. 어느 항목에도 들지 않으면 책임제 약정서에 서명했더라도 일반 근로시간 규정이 적용되고, 항목에 들어가 서면 약정과 핵비(核備)를 갖춰도 연장근로임금을 정한 제24조는 배제되지 않습니다.」(근거: 84-1 문언, 勞動部 2022-08-19 보도자료 마지막 단락 「…仍應依《勞動基準法》一般規定辦理」)
  - en:51 → 승인 문서 여부에서 시작하는 다른 순서로. 예: 「The first thing an English-speaking lawyer in Taipei will want to know is whether the local labor authority ever approved an Article 84-1 agreement for your job. If no approval letter exists, the ordinary rules apply, and the work moves to requesting your attendance records, calculating unpaid overtime and representing you in mediation at the labor bureau or in court labor mediation (see …). If one does exist, the lawyer checks your actual duties and pay against the list entry and the Article 50-1 definition. For a U.S. parent, the same check comes before drafting an agreement and filing it. …(연락처 문장 유지)」
  - es:57 → 기록 요청에서 시작. 예: 「Si la ingeniera decide reclamar, un abogado en Taiwán puede pedir por escrito a la empresa la copia del registro de asistencia, que el artículo 30 obliga a entregar, y calcular con ella las horas extra y sus recargos. Con el contrato y el acuerdo de 責任制, si existe, comprueba además si el sector de la empresa y el puesto encajan en la lista y en el inciso 2 y si el acuerdo llegó a aprobarse; si no hay arreglo, la representa en la conciliación de la oficina de trabajo o en la conciliación laboral del tribunal. …(연락처·España 링크 유지)」 ('correo'·'세 서류' 장치 삭제. es:59 마무리를 M2대로 바꾸면 'palabra de recursos humanos' 회귀도 함께 사라진다.)

### G6-M5 조문 문구 — 제32조 동의 주체를 '노조 또는 노사회의' 선택처럼 씀 (ko:41, zh:51)
- 원문(N0030001-32): ① 「雇主經工會同意，如事業單位無工會者，經勞資會議同意後，得將工作時間延長之。」 ② 但書 「雇主經工會同意，如事業單位無工會者，經勞資會議同意後，延長之工作時間，一個月不得超過五十四小時，每三個月不得超過一百三十八小時。」 — 노사회의는 노조가 없을 때만이다. en:45 「the consent of the union or, without one, the labor-management meeting」는 맞다.
- 원고: ko:41 「연장근로는 노동조합이나 노사회의의 동의를 받아」, zh:51 「（經工會或勞資會議同意可到54小時，每三個月不超過138小時）」
- 수정: ko:41 → 「연장근로는 노동조합의 동의(노동조합이 없으면 노사회의의 동의)를 받아」. zh:51 → 「（經工會同意，無工會者經勞資會議同意，可到54小時，每三個月不超過138小時）」.

### G6-M6 한국 보도 범위 — 특구법 맥락 누락과 결말 문장의 과장 (ko:21, ko:57)
- 원문(G6-yna.html): 「초광역특구법의 노동 특례 도입에 대해 "반드시 사회적 대화를 성사해야 한다"」, 「핵심 노동 특례인 고소득 전문직 주 52시간 예외 적용(화이트 칼라 이그젬션)과 기간제 사용기간 확대 등을 법률에 명시할지, 시행령에 담을지는 확답하지 않았다」, 「"현재 사회적 대화가 진행 중이기 때문에 그 결과에 따라 입법을 지원하겠다"고만 말했다」.
- 원고: ko:21은 이 예외가 초광역특구법 노동 특례라는 점을 빼서 전국 제도 논의처럼 읽힌다. ko:57 「한국은 아직 예외를 법률에 둘지 시행령에 둘지 정하지 못했습니다.」는 도입 자체는 정해졌고 위치만 남은 것처럼 단정한다(보도는 도입을 논의하는 노사정 사회적 대화가 진행 중이라고 함).
- 수정: ko:21 둘째 문장 → 「초광역특구법 노동 특례로 논의되는 고소득 전문직 주 52시간 예외(화이트 칼라 이그젬션)를 법률에 명시할지 시행령에 담을지도 확답하지 않았다고 [연합뉴스](…)는 전했습니다.」 ko:57 첫 문장 → 「한국에서는 이 특례를 들일지, 들인다면 법률과 시행령 중 어디에 담을지가 아직 노사정 사회적 대화에 걸려 있습니다.」

### G6-M7 ja 주소 표기 관례 (ja:55)
- 원고: 「昊鼎国際法律事務所の台北事務所は、103 臺北市大同區承德路一段35號7樓之2です。」 — 중국어 표기만 있음. main 952 ja 배포본과 오늘 G1·G3·G5 ja는 「台北市大同区承徳路一段35号7階の2（臺北市大同區承德路一段35號7樓之2）」(TASK '각 언어 관례 표기').
- 수정: 「昊鼎国際法律事務所の台北事務所は、台北市大同区承徳路一段35号7階の2（臺北市大同區承德路一段35號7樓之2）です。」

## SHOULD

### G6-S1 en FAQ2의 FLSA 금액을 현재 규칙처럼 씀 (en:14 FAQ2 질문)
- 「Does Taiwan have a pay threshold like the FLSA's $684 a week?」 — 근거인 Fact Sheet #17A는 "Revised September 2019"이고, 오늘 dol.gov rulemaking 페이지는 403이라 현재 집행 금액을 따로 확인하지 못했다(확인 필요). 본문 en:25는 "Fact Sheet #17A lists"로 출처에 붙여 써서 괜찮다.
- 수정: 「Does Taiwan have a pay threshold like the $684-a-week salary level in the Labor Department's Fact Sheet #17A?」

### G6-S2 '핵비 없으면 일반 규정'에 이미 출처 목록에 있는 노동부 보도자료 문장을 근거로 붙이기 (zh:14 FAQ3, en:43~45, es 해당 절, ko:41)
- 원문(G6-mol-54659.html 마지막 단락): 「勞動部重申，經公告不再適用…之工作者，或縱屬仍適用該條之工作者，惟未曾將勞雇間之約定以書面報請當地主管機關核備或當地主管機關未予核備者，仍應依《勞動基準法》一般規定辦理。」
- zh FAQ3은 지금 「公司很難主張已經排除這些規定」로 추론만 쓴다. 수정 예: 「…勞動部在111年8月19日新聞稿重申，仍適用該條的工作者，若未曾將書面約定報請當地主管機關核備，或未獲核備，仍應依勞動基準法一般規定辦理。核備前的延長工時，因此依第32條的上限與第24條的加給標準處理。」 다른 판도 '승인이 없으면 일반 규정' 문장에 같은 보도자료 링크를 붙이면 게이트의 근거 요구를 미리 막는다.

### G6-S3 en:21 「Not much.」
- 노동기준법은 offer letter 라벨에 아무 효과를 주지 않으므로 「Not much」는 애매하다. 수정 예: 「Not under Taiwan's labor law.」
