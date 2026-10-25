# TR 704–706 독립 AI 검수

검수일: 2026-10-25 KST. 검수자: `column_existing_drafts`. TR 원고 작성자 `column_deploy`와 다른 에이전트가 검토했다. 이 검수자는 MS 원고 작성자이며 공통 조사 자료를 공유했다. 블라인드·인간 원어민·변호사 검토 또는 게시 승인을 주장하지 않는다. TR 원고는 읽기 전용으로 검토했고 수정하지 않았다.

판정: `REQUEST_CHANGES`. 아래 R1–R5의 국소 보완을 요청한다. F04의 초청자 논리 자체는 보존돼 있으므로 특정전문인재에게 대만 전문업무 종사를 일률적으로 추가해서는 안 된다. 정확한 EN 축약과 선택적인 상세 보완은 별도 표로 구분했다.

## 실제 검토 버전

기준 commit: `ef3b24e73d84968eea08ea9d58e991ccbbf83fa8`. TR704–706의 제목·요약·FAQ9개·본문·출처·이미지 문구 전문과 `tr-author.md`를 읽었다. 같은 세션에서 전문을 읽은 현재 EN/KO/ZH704–706, `source-refresh.md`, `final-core.md`, 이번 `arc-source-facts.md` F01–F23을 대조했다. AGENTS, 배치 BRIEF, 문체 정본, FRONTMATTER, 문장 다양성 규칙과 LESSONS를 적용했다.

| 대상 | SHA-256 |
|---|---|
| TR704 | `03599c5913d61d6820e20db26ebb42b8bd7b7c87ce7455c79ff5cafd7991ded8` |
| TR705 | `6477f3d55f8dfe7e04acb0a62888a4ff06b62709414a5846e8b838661150aac5` |
| TR706 | `9c6a51f45c55680bf0d072fada02772b4f996051e8e28918b9162e9facf94c95` |
| tr-author.md | `30c7b714500257051aacfb221be2968978cb0d869b1ca35e89004666ba6179ad` |
| 수정된 F04 및 F23을 포함한 arc-source-facts.md | `4776f60010172120e0812d8d552123aeb5c7cc0b467cb5306ca031a1e17c2145` |
| EN704 / EN705 / EN706 | `610343da1255e2e873956c6de54bd0f9c72c6731aae9343bd7bae9884efdd39f` / `87a4ab6e9a5e8b434a30de0dc111307fc58e878a7534cef793e2a3e27be38304` / `1ecf6acc92d181afb2820bb001d4e4d45cc4eeca823d2e32def25faebe119d71` |
| KO704 / KO705 / KO706 | `cbf6b07b2d41c3b136ceac099f8d32152ca125c18478321610ffa715c29476a1` / `727377648fcc7e2bd1d8ea8202bea5fb69f01174ce51a0ee422891126011d54a` / `4cd612086336cb1a3720111390ce7aca3f4eff5c7f96c5e92aea001fa7b8cfbc` |
| ZH704 / ZH705 / ZH706 | `0c00bc06bf3c3c1860a95af4dbcea9eaab981300860916856295e8b947244468` / `290a50047632ad830ea98c524ffef6ed91c2b4c8d555a1844689824c3ffea7a3` / `4d70e78b9a197f4a2b81d25d61b6fa862ee849a6392d5fd905e90bcf781e721c` |

행 번호는 위 해시의 각 파일에 해당한다. 아래 제안을 반영한 새 파일에 기존 판정을 자동으로 승계하지 않는다.

## 필수 보완: 실제 문장·문제·수정안

### R1 — TR706:85, 특정 온라인 신청 중 출국의 효과

현재 문장:

> Yenileme veya kayıp kart işlemi sürerken Tayvan’dan ayrılacaksanız NIA’dan kendi yolculuğunuza ilişkin talimatı alın. Başvurunun alındı belgesi, gerekli seyahat belgelerinin yerine geçtiği varsayılarak kullanılmamalıdır.

영수증을 여행서류로 보장하지 않는 설명은 맞다. 다만 최신 F23의 특정 전문인재·가족 온라인 신청 절차에서는 신청 중 출국 시 심사가 계속되지 않으며, 재입국 후 해당 자격을 갖춘 사람이 재신청할 수 있다. 현재 원고에는 그 효과와 공식 링크가 없다. 이것은 EN 문장을 반대로 번역한 오류가 아니라 이번 배치에서 추가 확인한 실용 절차 정보다.

[NIA 전문인재·가족 온라인 안내](https://www.immigration.gov.tw/5382/5385/7244/7250/7317/%E5%B1%85%E7%95%99/httpscoaimmigrationgovtwcoa-frontendforeign-white-collar/) 주의9를 이 검수자도 같은 세션에서 직접 읽었다. 다음 정도의 문단과 출처 목록 항목을 추가할 수 있다.

> NIA’nın yabancı profesyoneller ve aileleri için çevrim içi başvuru usulünde, başvuru sürerken Tayvan’dan ayrılan kişinin dosyası incelenmeye devam edilmez. Kişi yeniden giriş yaptıktan sonra ilgili usulün ikinci bölümündeki koşulları karşılıyorsa yeniden başvurabilir. Bu kural yalnızca söz konusu çevrim içi usule ilişkindir.

첫 구절에 공식 링크를 연결한다. 심사 중단은 단순 가능성으로 낮추지 않고, 후속 신청은 `koşulları karşılıyorsa … başvurabilir`라는 `may + if`로 둔다. 누구나 재입국하면 반드시 재신청해야 한다거나 모든 ARC 신청자의 출국이 금지된다는 문장을 만들지 않는다.

### R2 — TR705:67, 성년 자녀 부정문의 범위 명료화

현재 문장:

> Anne ve baba ile bütün yetişkin çocuklar bu hükmün aile kapsamına girmez.

바로 앞 문장은 장애 때문에 스스로 생활할 수 없는 성년 자녀를 정확히 포함한다. 그런데 `bütün yetişkin çocuklar … girmez`는 모든 성년 자녀가 제외된다는 읽기를 만들 수 있다. 문맥상 ‘성년 자녀 전원이 포함되지는 않는다’는 의도로도 이해되므로, 저자가 의도적으로 자격자를 배제했다고 단정하지 않는다. 법적 범위를 다루는 마무리 문장에서는 이 부정 범위를 모호하게 둘 필요가 없다.

제안:

> Anne ve baba ile bu koşulu taşımayan yetişkin çocuklar hükmün kapsamına girmez.

여기서 `bu koşulu`는 바로 앞의 신체·정신 장애로 자력생활이 불가능하다는 조건을 가리킨다. 부모와 그 조건을 갖추지 않은 다른 성년 자녀만 제외하며, 앞서 포함한 성년 자녀의 권한을 지우지 않는다. FAQ3는 모든 가족을 포함하지 않는다고 정확히 쓰고 있으므로 범위를 넓히는 FAQ 수정은 필요하지 않다.

### R3 — TR705:38, 통상 취업허가 신청 주체 보존

현재 첫 문장:

> Yabancıların çalışması için kural olarak gerekli iznin alınması gerekir.

이 문장은 허가 필요를 설명하지만 누가 신청하는지 말하지 않는다. 이어지는 법령의 설명도 신청 주체를 밝히지 않는다. 현재 EN은 외국 전문인재 고용 시 통상 고용주가 신청한다고 명시하며, [현행 인재법 제5조](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=A0030295)도 고용주를 행위 주체로 둔다. TR:34의 `İşverenin çalışma izni`만으로 독자가 신청 주체를 확정할 수는 없다.

첫 문장을 다음처럼 구체화할 수 있다.

> Yabancı bir profesyonelin istihdamı için çalışma izni başvurusunu kural olarak işveren yapar; kanuni istisnalar ile başvuruyu inceleyecek makam işin türüne göre değişir.

원래 있던 허가 OR 면제·직무별 담당 기관·제안서와 근로권의 구분은 뒤 문장에 유지한다. 모든 근로자·모든 면제자에게 고용주 신청을 새로 의무화하지 않는다. 이는 새 법률 세부 추가가 아니라 EN의 실제 행위 주체를 복원하는 요청이다.

### R4 — TR704:26, 유효 통합증명 소지자의 면제를 가능성으로 낮춤

현재 문장 일부:

> geçerli Gold Card gibi ARC işlevini zaten içeren birleşik belgeler için ayrıca ARC başvurusu gerekmeyebilir.

앞 구절에서 이미 유효한 ARC 기능 포함 통합증명으로 대상을 한정했다. 이 대상은 [이민법 제22조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=22)의 별도 신청 예외다. `gerekmeyebilir`는 신청이 필요하지 않을 수도 있다는 가능성을 남긴다. 정해진 예외의 강도는 아래처럼 표현하는 편이 정확하다.

> Geçerli Gold Card gibi ARC işlevini içeren birleşik belge sahiplerinin ayrıca ARC başvurusu yapması gerekmez.

유효성·통합 기능 조건을 그대로 둔 상태에서 법정 면제를 명시한다. 만료된 카드나 ARC 기능이 없는 문서까지 면제하지 않는다.

### R5 — TR704:78, 심사기간에서 제외하는 서류 반환을 발송으로 옮김

현재 문장 일부:

> Belgelerin gönderilmesi, eksiklerin tamamlanması ve görüşme için geçen süreler buna dahil değildir…

`gönderilmesi`는 문서 발송이다. EN과 [NIA0902](https://www.immigration.gov.tw/5475/5478/141465/141808/141970)의 10근무일 안내는 document return, supplementation, interview를 제외한다. 초기 발송이나 모든 송부 기간으로 범위를 흐리지 않도록 반환을 직접 표현해야 한다.

제안:

> Belgelerin iadesi, eksiklerin tamamlanması ve görüşme için geçen süreler buna dahil değildir; istenen belgeler tamamlanınca inceleme süresi yeniden hesaplanır.

10근무일, 보완·면담 제외, 보완 후 재기산, 발급일을 보장하지 않는 뒤 문장은 유지한다. 단순 문체 변경과 행정 시간 산정 의미의 보완을 구분한 항목이다.

## 선택 보완: 잘못된 법률 단정으로 처리하지 않은 항목

| 위치·실제 표현 | 판단과 선택 수정 |
|---|---|
| TR704:30 `Başvuru süresini giriş kaydıyla eşleştirin` | 단일 명령형 소제목이다. 반복적인 체크리스트 제목은 아니어서 법률 반려 사유로 올리지 않았다. 문체 정본에 더 맞추려면 `Başvuru süresinin başlangıcı` 등 사실형 제목을 쓸 수 있다. |
| TR704:66 `Başvuru tarihini saklayın.` | 날짜 자체를 보관한다는 결합은 기록·접수증 보관보다 덜 자연스럽다. `Başvuru kaydını saklayın.` 또는 `Başvuru tarihini kaydedin.`으로 다듬을 수 있다. 원래 문단의 접수 증거와 보완요청 날짜라는 실무 목적을 유지한다. |
| TR705:28 `Türkçe okumanız hangi pasaportu taşıdığınızı göstermez.` | 국적을 단정하지 않는 취지는 맞지만 작성상의 원칙을 독자에게 직접 말하는 느낌이다. 앞 문장의 실제 여권·국적 확인만으로 취지가 전달되므로 이 문장을 삭제해도 법률 조건은 사라지지 않는다. |
| TR704:74의 특정전문인재5년 | 적격 조건하 최장5년은 있고, 허가 다음 날 기산·가족 범위·금카드1–3년의 추가 세부는 없다. 현재 EN도 이 위치는 별도 상한 링크로 축약한다. 기산일을 잘못 서술하거나 모든 신청자에게5년을 약속한 것이 아니므로 추가 설명 여부는 편집 범위다. |
| TR704:72 僑生 감면 | 특정 신분에 한정하고 일반 국제학생으로 확대하지 않았다. 50% 수치는 없지만 EN도 생략한다. 수치 추가는 선택이다. |
| TR704:80 학생 수령 | 승인 후 납부5근무일·납부 후3근무일·칩카드/전자6개월 이하의 구분은 있다. 지정 서비스센터와 인쇄 영수증 지참을 EN처럼 명시하면 더 구체적이지만, 현재도 시스템이 알린 수령 방법을 따르도록 한다. 다른 수령 장소나 자동 우편배송을 약속한 것이 아니다. |
| TR706:53 초과거류 | `<30일 AND 원래 사유 존속 AND 처분 후`와 무면벌 유예를 정확히 썼다. 영주거류 산정1년 공제는 생략했으며 EN도 없다. 불이익 없는 유예라고 단정한 것으로 판정하지 않는다. |
| TR706:67 전문직 연장 | `bütün işler için otomatik çalışma yetkisi oluşturmaz`는 모든 일의 자동 근로권을 부정한다. 필요하면 기존 허가의 기간 자체도 자동 연장되지 않는다고 더 명시할 수 있으나, 현재 원고가 원래 취업권한의 자동 연장을 약속하지는 않는다. 바로 뒤 적격 졸업생 제12조 면제는 정확하다. |

## F04 정정과 핵심 법률 조건의 실제 대조

TR705:67의 초청자 문장은 다음과 같다.

> Tayvan’da profesyonel iş yapan yabancı profesyonelin veya özel uzmanlık sahibi yabancı profesyonelin ikameti ya da daimi ikameti NIA tarafından önceden onaylanmış olmalıdır.

일반 전문인재와 특정전문인재를 `veya`로 나누고 NIA의 선행 거류 OR 영주 허가를 공통으로 요구한다. 앞의 대만 전문업무는 일반 전문인재 명사구에 붙어 있다. 저자 기록도 이 범위를 명시한다. 적용해야 할 논리식은 `[(일반 외국전문인재 AND 대만 전문업무) OR 특정전문인재] AND (NIA 거류 OR 영주 허가)`다. 특정전문인재에게 대만 업무를 별도로 추가 요구하는 문장으로 고치지 않는다. R2는 이 초청자 문장과 다른 문제인 뒤의 성년 자녀 부정 범위다.

| 항목 | 직접 확인한 TR 표현과 의미 |
|---|---|
| F01–F02 최초 신청 | 704 도입·표·FAQ1은 oturma vizesi AND ikamet izni, 입국 다음 날부터30일, 국내 비자 발급일부터30일을 구분한다. 무비자 모두의30일 전환권은 :28에서 부정한다. 통합증명 예외의 modal만 R4로 요청했다. |
| F03 직접 NIA 신청 | 705:40은 전문인재 유형·직무·허가 OR 면제·무비자/방문비자·NIA 승인 후 ARC를 보존한다. 1 Ocak 2026은 시행일이고 게시일이 아니다. :42에 TAC/시범무비자/도착비자/ABTC/Working Holiday 제한과 다른 특별규정 검토가 있다. R3의 신청 주체만 보완해야 한다. |
| F04 가족 | 위 식과 선행 허가를 확인했다. 이어지는 문장은 배우자·미성년자·장애로 자립 불가 성년자녀를 포함한다. 가족의 무비자/방문비자 입국을 명시한다. R2는 그 뒤 부정문의 오독 방지다. |
| F05·F08 대만인 배우자 | 704:56 및 705:62에 대만 거주와 hane kaydı가 함께 있고, 첫 가족 신청·동행·대만 혼인등록·`bir yılı aşamaz` 최장1년이 있다. 705:65는 유효 방문비자60일 이상과 제한 주기 부재를 보존하며 혼인만으로 무비자 전환권을 만들지 않는다. |
| F06–F07 서류 | 704:44·50·51에 사진2년, 취업/재학1개월, 원본/사본·주소·관계 증명이 있다. :58은 인증 의무 `tasdik edilmelidir`와 중국어 번역 요구 가능 `isteyebilir`를 구분한다. Türkçe 문서라고 모두 Türkiye에서 발급됐다고 가정하지 않고 발급 장소 담당 공관을 말한다. |
| F09–F12 금액·처리 | NT$1.000/년·미만도1년·2.200추가·교체500은 EN과 같은 대만달러 금액이다. 일반10근무일, 학생5근무일·보완 후 재기산, 승인 후5근무일 납부, 납부 후3근무일, 전자6개월 이하를 구분했다. 일반 제외기간의 반환 표현은 R5다. |
| F13 유학·어학 | 705:48은 해외 공관과 유학 목적 방문비자 직접 경로를 구분한다. :50–52와 FAQ2는 인정된 대학 부설기관·4개월 이수 AND 최소 추가3개월, 월–금 주15시간, 휴가 포함 결석1/4 이하를 유지한다. 해당 일반 어학 경로의 제외 입국방식도 있다. |
| F14 근로 | 704FAQ3 및705:54·71, 706:47·59는 허가 OR 적용 면제와 직무를 유지한다. 대만 호적 국민과 혼인+거류승인인 외국인 배우자 면제와 특정/고급 전문인재 배우자의 제15조 직접허가 신청을 구분한다. 후자는 가족거류를 초과하지 않는 기간도 있다. |
| F15–F17 기한 | 706표에서 만료 전3개월, 주소/근무처 변경 다음 날30일, 제23-1조 사건일부터30일, 그 밖 사건일부터15일 BOCA 후NIA를 구분한다. :41에 사업 계속 적격 창업가4개월·중단 후 별도3개월·금카드4개월이 있다. |
| F18–F19 사유 소멸·초과거류 | 706:26의 취소 효과는 법정 계속거류 허용과 연결된다. :65는 사망·가정폭력·자녀·계속 중 노동쟁송·치료 중 산재에 각각 조건이 있음을 명시한다. 모든 이혼·분쟁이 자동권리나 자동출국이 아니다. :53의30일 미만과 원래사유 존속 조건은 맞다. |
| F20–F21 후속 거류 | 706:67은 만료 전 신청·승인·종전 만료 다음 날6개월·필요시 만료 전1회·총최장1년이다. :69는 졸업생1년+1회·총2년·만료 전·승인 조건과 어학 수료 차이를 명시한다. 대만 전문학사 이상+신졸업 상태+NIA의 해당 연장허가를 갖춘 사람의 제12조 취업허가 면제를 그 승인기간에 한정했다. |
| F22 재입국 | 706:83은 출국 전 재입국허가와 APRC 예외를 명시한다. 일반 ARC 기간·취소와 재입국허가가 연동된다. FAQ3·:79·85는 영수증/카드사진을 탑승·재입국 보장으로 만들지 않는다. |
| F23 온라인 출국 | 현재 원고에는 없으므로 R1으로 요청했다. 전반적인 출국 금지나 신청영수증 효력으로 대체할 수 없다. |
| 여권·분실 | 706:75는 정보갱신 필요만 말하고 모든 여권 변경에30일을 만들지 않는다. :77은 손상카드·분실진술·경찰자료 등 OR를 명시하며 모두 동시제출로 만들지 않는다.500NT$ 재발급과 기간연장은 별개다. |

FAQ9개를 모두 직접 읽었다. 본문보다 근로·직접신청·가족 범위를 넓게 보장하는 답변은 발견하지 못했다. R2의 가족 제외 문장과 같은 모호한 전칭도 FAQ에는 없다. 제목과 요약은 글의 실제 범주에 맞으며 Türkiye 국적·국내법을 보편적으로 적용하지 않는다. 근로·방문·거류권의 승인을 보장하거나 터키어 상담을 약속하지 않는다.

## 실질 결말·최근 글·§5

출처 확인일과 별도 법체계 고지문 바로 앞의 문단을 실질 결말로 평가했다.

- 704:82는 받은 카드의 정보와 실제 직무 permit/면제를 확인하고, 이후 갱신·주소변경 때 연결할 기존 기록의 사본으로 끝난다.
- 705:79는 학교·고용·가족 서류의 실제 대상과, 새 활동 시작이 기존 허가 만료보다 먼저 올 수 있다는 사실로 끝난다.
- 706:87은 가지고 갈 여권·거류·재입국 서류가 계획한 귀국일을 포괄하는지로 끝난다.

세 결말은 각 글의 사실에 연결되고 같은 판촉 문구를 복사하지 않았다. 고지문 자체를 독창적 결말로 계산하지 않았다. `kontrol edin`이 있다는 이유만으로 기계적 체크리스트로 반려하지 않았고, 서류와 날짜라는 구체적 대상을 확인했다.

기존 TR861–863의 첫 두 문단·전체 H2·끝 두 문단을 실제로 읽었다. 861은 표시된 대리석 미지급 가상사례, 862는 기계 인수시험·하자통지 질문, 863은 Türkiye 여권/eVisa의 국적별 조건으로 시작한다. 새704는 최초신청 기산,705는 대학입학 후 입국방식 질문,706은 사유소멸과 카드유효일로 시작한다. 이전 사례·국적·결말을 재사용하지 않았다.

§5 직접 점검:

1. 아래 공유 TR 검사에서 최종 해시3편 모두 FAIL0을 재현했다. 도구값만으로 법률 의미를 승인하지 않는다.
2. 배치 도입 유형이 기한 사실/입국방식 질문/거류사유 효과로 다르다. 첫 두 문단을 빼면 해당 법적 조건과 증거·입국 판단 정보가 사라진다. 이름을 붙인 허구 고객을 만들지 않았다.
3. 각 글의 짧은 문장은 실제 정보를 준다.704 `Adres de belgelenir.`·`Asıllar kontrolün ardından geri verilir.`;705 `NIA’nın ikamet onayı ayrıca gerekir.`·`Öğrencilik çalışma izni yerine geçmez.`;706 `Başvuru kaydını saklayın.`·`Süre dolmadan başvurulur.`를 확인했다.704 `Başvuru tarihini saklayın`은 정보 삭제가 아니라 선택 어휘 교정으로 올렸다.
4. 제목·표·목록을 뺀 문단 시작을 직접 추출했다.704 19문단,705 21문단,706 23문단이며 첫 단어 최대반복은 모두2회다.704의 옛 Genel3회는 현재2회로 줄었다.
5. 주장-조문-다만 문단이 세 번 연속하지 않는다. 주소증거, 서류보관, 요청기간을 포괄하는 자료 준비 등 인용 없는 실무 문단이 있다.
6. 자동 대비틀은704 0개·705/706 각1개다. 수동으로도 작업·입국·영수증의 실제 차이를 설명하는지 확인했으며 지어낸 독자 반박을 발견하지 못했다.
7. 실질 결말은 위 문단대로 평가했다. 세 편의 고지문은 별도 안내로 남겨두었다.
8. 터키어 siz 어조와 존칭 명령형이 일관된다. 장식bold·H1·가짜1인칭은 없다. 단일 명령형704 소제목은 선택 문체 제안이다.
9. 금액·기산·조문·적격 범위·URL을 대조했다. R1–R5를 남긴 상태를 의미검수 통과로 바꾸지 않는다. 원문에 없는 추가세부의 생략과 실제 행위주체/modal/범위 문제를 분리했다.

반려할 수준의 새 MONOTONY 패턴은 발견하지 못했다. 단조로움 반려를 만들기 위해 일반적으로 필요한 허가·신청 용어 반복을 삭제하지 않았다. R1 추가와 R2–R5 수정 뒤에는 문장 리듬도 다시 검사해야 한다.

## 실행 증거와 한계

```sh
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check src/content/columns-tr/704-taiwan-arc-first-application.md src/content/columns-tr/705-taiwan-visa-residence-work-study-family.md src/content/columns-tr/706-taiwan-arc-renewal-changes-reentry.md
```

이번 실행은 복구된 공유 설치본이 `[tr]`로 판정했다. exit0. 공유 metrics SHA-256은 `79b3e7826fa61e56f919f966d2c5f63ad47eab5f9c1a9a0122aa53c6fd942876`이며 검수자는 도구를 수정하지 않았다. 저자 보고서의 옛 KO 오분류는 과거 이력이다.

| 글 | 문장 | 평균 | CV | 짧은 문장 | 같은 길이3연속 | 결과 |
|---|---:|---:|---:|---:|---:|---|
| TR704 | 58 | 13.2 | .461 | .241 | .054 | FAIL0 |
| TR705 | 71 | 13.4 | .585 | .310 | .014 | FAIL0 |
| TR706 | 82 | 12.0 | .589 | .341 | .000 | FAIL0 |

```sh
/Users/son7/.nvm/versions/node/v24.14.1/bin/node docs/audit/all-locales-parity-20261025/tooling/content-audit.mjs --files 'src/content/columns-tr/70[456]-*.md' --source-locale en --publication-date 2026-10-25
```

자동 오류0, 3편 `AUTO_OK`, exit3, `semantic=REVIEW_REQUIRED`, `publicationReady=false`. 검토요청은6/5/5개다. 수치 토큰 차이는 otuz/üç/on beş 등 터키어 글자 표기와1.000/2.200의 천단위 표기, 추가 법정 조건·인용을 문맥으로 읽었다. 숫자 정규식만으로 기한 보존을 판단하지 않았다. 모든 EN 공식 URL과 실제TR시리즈 내부 링크, 동일 대표 이미지 경로,3FAQ·게시일·audience·내부author의 자동 검증을 확인했다.

이번 검수의 공식 근거는 이 세션에서 직접 연 인재법 현행 영문 제5·16·17조, 거류 규칙 제11·12조, NIA0902·0929, BOCA 어학 안내와 특정 전문인재 온라인 주의9의 실제 본문이다. 일부는 직전 MS/RU 검수에서 연 내용을 재사용했으며, TR검수만을 위해 모든 URL을 새로 열었다고 주장하지 않는다. 직접 열람하지 않은 세부 공지는 명시된 source-refresh·facts의 확인 기록에 의존했다.

TR 본문의 확인일25 Ekim2026은 저자가 기록한10월25일 핵심 공식자료 확인과 연결된다. 원문 EN의10월24일 조사와 전수 새 열람을 동일시하지 않는다. 이후 관보 전수조사·개별 허가 결과·실제 기관 신청을 수행하지 않았다.

이 보고서는 위 해시의 텍스트와 제한된 자동 검증에 한정된다. 원어민 선호, 실제 브라우저 렌더링·반응형 화면·FAQ/schema·공개작성자 비노출·canonical/hreflang·배포commit은 별도 검증 대상이다. 작성자가 R1–R5를 반영한 새 파일의 의미와 SHA를 재검수한 뒤 조정자가 통합·게시 여부를 판단해야 한다.
