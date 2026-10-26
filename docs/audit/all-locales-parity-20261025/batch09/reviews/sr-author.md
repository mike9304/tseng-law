# SR 915·916·918–921 저자 기록 — 2026-10-26

모델 직접 집필 및 자체 의미·문체 검수 기록이다. 현재 6편은 파일별 shared `--lang sr` FAIL 0, 선택 구조 검사 오류 0이며, FAQ 17개와 실제 ReactMarkdown 표시문단의 238개 문장 배열을 대조했다. 사람 원어민·변호사 검수나 공개 배포 완료를 뜻하지 않는다. 독립 검수에 넘기는 시점의 동결 기록이며 미해결 자체 필수 지적은 0건이다.

## 범위와 입력

소유 범위는 batch09의 columns-sr 6편, reviews/sr-author*, checks/sr-*다. R·공유 도구·다른 작업자의 원고와 기록은 수정하지 않았다. 커밋·게시·push·공개 상태 재조회는 하지 않았다. Serbian은 최근 SR704–706과 맞춘 라틴문자·에카비아식 문장으로 작성했다. 독자의 국적을 단정하거나 대만법을 세르비아법으로 바꾸지 않았다.

B9/B8/B7 BRIEF, R AGENTS, 최근 SR704·705·706 전문과 17:05 LESSONS 전문을 이번 단계에서 읽었다. B6 정본 EN915/916·ZH918/919/920/921, facts·source-register·source-freeze·contract 및 문체 규칙은 연속 작업에서 이미 전문을 읽은 동일 SHA를 재사용했다. 27개 입력의 경로·읽기 범위·SHA는 `checks/sr-inputs.json`에 있고 동결 직전 모두 같은 SHA임을 확인했다. 홈 공통문체 경로는 존재하지 않아 프로젝트 정본과 COLUMN-VOICE-RULE을 적용했다. 최신 LESSONS SHA는 `86710ef330b108a916a7bb92a75f1ffa62dea53412e8a75f38472d9fa9b33130`이다. 이전 배치의 역사적 읽기 기록을 덮어쓰지 않았다.

이번 SR 집필에서 새 공식 웹 조회는 하지 않았다. 동결된 공식 응답 및 정본의 확인일·출처 범위를 재사용했고, 전체 416쪽 판례집을 새로 읽었다고 주장하지 않는다. 원본 6개 이미지의 실제 장면 확인은 연속 B6 작업의 동일 이미지 바이트를 재사용했다. 이 단계에서는 경로·바이트 SHA 및 alt의 장면 대응을 확인했다.

## 원고와 실제 검사

| ID | 문장 | CV | 짧은 문장 비율 / 수 | 최대 같은 문단 시작 | 같은 문장 시작 연속 | 본문 질문 | 실제 근거 |
|---|---:|---:|---:|---:|---:|---:|---|
| 915 | 37 | 0.512 | 0.216 / 8 | 1 | 1 | 2 | 수정 5편 CLI exit 0 |
| 916 | 38 | 0.504 | 0.158 / 6 | 1 | 0 | 1 | 수정 5편 CLI exit 0 |
| 918 | 42 | 0.491 | 0.238 / 10 | 2 | 0 | 1 | 수정 5편 CLI exit 0 |
| 919 | 36 | 0.476 | 0.222 / 8 | 2 | 0 | 1 | 수정 5편 CLI exit 0 |
| 920 | 41 | 0.462 | 0.244 / 10 | 2 | 0 | 1 | 수정 5편 CLI exit 0 |
| 921 | 44 | 0.506 | 0.273 / 12 | 1 | 0 | 1 | 최초 CLI 내 해당 파일 OK; 배치 exit 1 |

최초 6편 CLI는 exit 1이었다. 918의 `top_opener_n=3`, 919의 `len_cv=.401`이 실제 실패였고 나머지 4편은 개별 OK였다. 최초 원고와 원로그는 그대로 보존했다. 이후 의미 명료화까지 포함하여 5편에 실제 7개 치환을 했고, 변경된 915·916·918·919·920만 다시 검사하여 exit 0을 받았다. 921은 최초와 현재 SHA가 같아 최초의 해당 파일 OK를 재사용했다. 921에 새 단독 exit 0이 있었다고 말하지 않는다. 실제 호출은 2회, 파일 측정은 11회다.

명령은 `PATH=/Users/son7/.nvm/versions/node/v24.14.1/bin:$PATH PYTHONDONTWRITEBYTECODE=1 python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <대상 파일들> --lang sr`였다. 단위는 `orthographic_words`, 경계 방식은 `unicode_punctuation_with_locale_abbreviations`다. SR을 다른 언어로 분류하거나 공백·정상 서수·법률 숫자를 점수 때문에 바꾸지 않았다. 도구·프로필·임계값은 변경하지 않았다. 초기/수정 로그에 정확한 명령, stdout, stderr, exit, 원고·도구 SHA와 실제 문장 배열이 있다.

| 도구 | SHA-256 |
|---|---|
| `variety_metrics.py` | `5abf02f52e35c45f921084106b6acf3c0caf0ca02f09649de1c1eb6977019b3e` |
| `variety_multilingual.py` | `4af341932757be7a6b83f84a56ea24792f963653c9c3d008aacade2b79a084de` |
| `variety_expansion.py` | `ea03abaa59249d7d914e1c98a5231a5c1636528dd1ecda326b0d4638edf17975` |
| `sr.json` | `b82eac56b6e35c4a08e8029317975be46ee3930f2366633a704dd487a69d0419` |

구조 검사 `sr-content-audit-final.json`은 실제 선택 6편·오류 0, `semanticStatus=REVIEW_REQUIRED`, `publicationReady=false`다. 이 기계 상태를 임의로 법률 승인 또는 공개 준비 완료로 바꾸지 않았다. ZH4/EN2를 분리하고 `sr:<slug>` sourceMap과 숫자 접두사를 유지한 동결 정본 별칭을 썼다. 구조 도구의 32개 REQUIRED 항목 중 이 단계에서 읽은 원고·메타·FAQ·출처·이미지·문체 범위는 아래 표에 기록하고, 전체 앱 카드·JSON-LD·피드·브라우저·공개 실응답은 후속 통합 검증 범위로 남긴다.

`sr-metadata-render.json`의 실제 ReactMarkdown+remarkGfm 출력은 915와 921에 각각 의도한 표 1개, 모든 원고에서 의도하지 않은 ordered list 0개였다. 이 출력의 `<p>` 표시텍스트를 shared 추출 배열과 대조하여 현재 238개 문장 및 길이, 문단 순서가 정확히 일치했다. 최초 240개 문장은 직접 읽었고 실제 7개 치환의 결과 문장을 다시 읽었다. 919의 의미 관계가 있는 문장 두 쌍을 연결하면서 38→36개가 되어 전체 240→238개가 됐다. 날짜, 금액의 점, 85-1·22-2, 중국어 사건번호가 잘못된 경계로 끊기거나 빠지지 않았다.

원 `sr-final-proof.json`의 `initial_human_read_count`는 생성한 필드명의 오류다. 실제 독자는 모델이며 사람 검수가 없었다. 원 증거 SHA를 보존하고 `sr-final-proof-current.json`에서 이 키만 `initial_model_read_count`로 정정했다. 수·배열·판정은 동일하고 새 CLI를 실행한 것이 아니다. 후속 검수에는 current 파일을 기준으로 쓴다.

## 실제 문장 수정과 의미 보존

### S01 · 915

수정 전:

> nabavke električne energije i mrežne opreme na Tajvanu

수정 후:

> nabavke za tajvanski elektroenergetski sektor i mrežu

이유: 발전·망 조달을 전력 상품 구매처럼 좁혀 읽지 않도록 대상 설명을 명확히 함

의미 보존: 예정된 대만 조달·미국 공급자·2026/2027·자격 미확정 보존

### S02 · 916

수정 전:

> Povoljan zaključak pregovora ne pokazuje sam po sebi šta je preduzeto povodom nalaza.

수정 후:

> Povoljan sažetak pri zaključenju posla sam ne pokazuje kako je odgovoreno na tehničke nalaze.

이유: 협상 결과라는 추상 문구를 정본의 거래 종결 요약자료와 기술적 발견에 대한 실제 대응으로 구체화

의미 보존: 새 문서 작성 의무나 결과 보장 없음

### S03 · 918

수정 전:

> U [rezultatima kontrole ugovora od 25. avgusta 2025.](https://www.ey.gov.tw/Page/F7408A6FCA4B0A8A/40ffbcf6-e255-47b2-a208-767af361bd11), potrošački organ je kao nedopuštenu označio klauzulu koja iz roka za obaveštenje izuzima vreme bankarske potvrde kredita i isplate.

수정 후:

> Potrošački organ je u [rezultatima kontrole ugovora objavljenim 25. avgusta 2025.](https://www.ey.gov.tw/Page/F7408A6FCA4B0A8A/40ffbcf6-e255-47b2-a208-767af361bd11) označio kao nedopuštenu klauzulu koja iz roka za obaveštenje izuzima vreme bankarske potvrde kredita i isplate.

이유: MONOTONY: U 문단 시작3회. 공고의 행위 주체를 앞세워 통지기간 제외조항을 지적한 주체를 직접 전달

의미 보존: 공고 날짜·URL·은행 확인/지급기간 제외 위법성·과거 판결과의 구분 보존

### S04 · 919

수정 전:

> Iz poništenja se ne može zaključiti da nije bilo nijednog prijavljenog postupka niti da je rukovodilac zaista vraćen na posao.

수정 후:

> Iz poništenja se ne može zaključiti da nije bilo zlostavljanja niti da je rukovodilac zaista vraćen na posao.

이유: postupka가 사건/절차로도 읽히므로 판결 취소가 괴롭힘 부재를 증명하지 않는다는 대상을 명시

의미 보존: 실제 복직 미확인·상소 가능·모든 비위 부재로 일반화 금지 보존

### S05 · 919

수정 전:

> Pre nego što je nadležna komisija razmatrala slučaj, rukovodilac organa javno je najavio dve teške disciplinske zabeleške. Zatim je o tome raspravljao nadređeni organ, pa tek onda komisija organizacije u kojoj je zaposleni radio. Sud je ocenio da je time narušena uloga komisije da zaista proceni slučaj.

수정 후:

> Rukovodilac organa javno je najavio dve teške disciplinske zabeleške pre rasprave nadležne komisije, a zatim je nadređeni organ razmatrao slučaj pre komisije organizacije u kojoj je zaposleni radio. Sud je u tom redosledu video narušavanje stvarne uloge komisije.

이유: MONOTONY: 같은 중간 길이의 시간순서 문장들을 실제 선후관계로 연결하고 법원 평가를 별도 결과문으로 둠

의미 보존: 사전 발표→상급기관 심의→소속기관 심의 및 법원 평가를 유지, 두 징계를 두 사건으로 바꾸지 않음

### S06 · 919

수정 전:

> [Član 22-2 tajvanskog Zakona o bezbednosti i zdravlju na radu](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0060001&flno=22-2) nalaže objektivnu, pravičnu i nepristrasnu istragu ili postupak usaglašavanja. Pri istrazi strane moraju dobiti odgovarajuću priliku za izjavu i odbranu, uz poštovanje pravila o izuzeću. Javno utvrđivanje krivice pre završetka tog postupka otežava ispunjenje tih zahteva.

수정 후:

> [Član 22-2 tajvanskog Zakona o bezbednosti i zdravlju na radu](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0060001&flno=22-2) nalaže objektivnu, pravičnu i nepristrasnu istragu ili postupak usaglašavanja; pri istrazi strane moraju dobiti odgovarajuću priliku za izjavu i odbranu, uz poštovanje pravila o izuzeću. Javno utvrđivanje odgovornosti pre završetka istrage otežava poštovanje tih pravila.

이유: MONOTONY: 한 조문이 정하는 기준과 그 조사 단계의 절차를 연결. 형사적 krivice 대신 책임 판단이라는 중립어로 정리

의미 보존: 조율/조사 공정성, 조사에서의 진술·방어·회피 의무 보존. 진술 의무를 조율 전체에 무조건 확장하지 않음

### S07 · 920

수정 전:

> Ugovor sa izvođačem može unapred urediti početak radova pre saglasnosti i raspodelu troškova ako zahtev za saglasnost ne bude prihvaćen.

수정 후:

> U ugovoru sa izvođačem može se jasno vezati početak radova za potrebnu saglasnost i odrediti ko snosi troškove ako zahtev ne bude prihvaćen.

이유: 동의 전 착공을 계약으로 허용할 수 있다는 오독을 막고 필요한 동의와 착공의 관계를 명시

의미 보존: 필수 동의 유지, 거절 시 비용분담은 실무 계약 조언이며 분쟁 방지 보장 없음

MONOTONY: 문단 시작 반복 — 918의 `U [rezultatima kontrole ugovora…]` — 소비자 당국을 주어로 세워 행위와 주체를 직접 연결했다. 같은 문단 시작 3→2로 닫았다.

MONOTONY: 중간 길이의 시간순서·조문 문장 반복 — 919 S05/S06의 세 문장 나열 — 실제 선후관계 및 동일 조문의 적용 범위를 연결하고 법원의 평가를 별도 결과문으로 유지했다. 919 CV .401→.476이며 사실을 삭제하거나 의미 없는 문장을 추가하지 않았다. 현재 자체 검토에서 미해결 MONOTONY 반려 사항은 없다.

`sr-self-edits.json`에는 각 치환의 상태 전후 SHA와 실제 diff가 있다. 현재 6편에서 치환을 역순으로 되돌리면 `sr-initial-manuscripts.json`의 원래 6편 바이트와 SHA가 모두 복원된다. 921은 그대로다. 전체 frontmatter·FAQ, URL 순서, 숫자 토큰은 6편 모두 초기값과 같다.

## 법률·독자 범위와 FAQ 직접 대조

| ID | 본문·제목·요약·FAQ에서 확인한 조건 |
|---|---|
| 915 | 제85-1조의 공사 또는 기술용역, 바로 그 분쟁에 관한 권고 또는 제안, 발주기관의 불동의로 조정 실패라는 결합 조건을 유지했다. 별도 중재합의가 있을 수 있으며 장비구매·모든 공공계약에 자동 적용하지 않는다. 이 사건의 시공사 상고 기각·중재판정 취소 확정, 시간 연장과 돈 청구의 대상 차이, 하급심 법령 설명 정정과 결론 유지가 남아 있다. 미국 공급자의 대만 전력·망 조달 기회와 예정된 2026/2027 일정을 설명하며 개별 입찰 개방·자격·수주를 보장하지 않는다. FAQ 2개를 보존했다. |
| 916 | 현행 회사법154조의 법인격 남용→특정 채무 발생→현저히 상환 곤란→중대하여 주주 책임이 필요한 사정이라는 누적 조건을 보존했다. 외국 주주 지위·미지급 채무·오염 자체만으로 책임이 생긴다고 쓰지 않았다. 246명 관련 파기환송과 262명 관련 상고 기각을 원청구 전부 배척으로 바꾸지 않았고, 현행154조만으로 과거 모든 행위의 법적 근거를 설명하지 않았다. 미국·대만 투자 의향, 미국 민간 파트너, 적용법 조건을 유지했다. 미국 정책을 세르비아 국민의 혜택·자격으로 치환하지 않았다. FAQ의 화학물질 노출 대상은 명시했다. |
| 918 | 미완공 분양주택, 물·전기·승강기 및 보수 미완료, 2019년2월23일 편지, 8월 출입과 실제 인도 구별, 11월5일 대출금/11월28일 보증서 등 사건 순서를 보존했다. 사용허가증을 기산점으로 하는 계약4개월·현행6개월 통지의무, 구매자의 별도 의무를 구분한다. 시행사 항소와 추가청구 불인용 및 상소불가를 설명하며 절차 허가 거절로 바꾸지 않았다. 2025년 계약검사·2026년9월18일 중앙은행 자료를 2022년 판결에 소급하지 않았다. 분원은 지리적 `ogranak`으로 표기했다. |
| 919 | 공무원 해직과 동시 두 중대 징계 기록의 원처분·복심결정 취소, 상소가능, 실제 복직 미확인과 괴롭힘 부재 단정 금지를 보존했다. 사전 발표→상급기관→소속기관 순서, 진술기회·보고서 모순·사후 답변의 치유 불가를 구분했다. 민간 고용주의 2026년7월1일 신제도는 별도 근거이며22-2조 조사 또는 조율의 공정성, 조사 시 진술·방어·회피, 신고 접수 시 재발방지 조치·필요에 따른 상담/지원/보호·조사, 신고인이 원하면 조율 가능/불성립 시 조사 계속을 유지했다. 재발 자체가 없을 결과를 보장하는 의무로 쓰지 않았다. |
| 920 | 공용 벽·천장·전기함과 세대계량기의 사용 관계를 설명하며 계량기 소유권 판단을 추가하지 않았다. 법11조 소유자 회의, 규약15조 관리위원회 동의 및 전력공사 안전조건을 구별한다.6조1항5호 위반과 조정 후 불이행에 따른6조3항 법원청구 가능,1항4호 적용 여부의 법원 판단을 당사자 주장과 바꾸지 않았다. 전원차단·잠금·열쇠 주장만으로 결론이 바뀌지 않는다.2026년5월29일 공용전선로 보조금과9월30일 종료일은 모든 충전기 승인·현재 신청 가능으로 확대하지 않았다. 필요한 동의와 착공을 연결하고 후속 확정 여부는 미확인으로 남겼다. |
| 921 | 243,548대만달러는 청구액이며 지급액이 아니다. 남은 금화의 대인게임 칩 기능과 미사용 유료포인트를 구별하며 전량 소진으로 바꾸지 않았다. 해당 게임의 현금 전환 조건을 일반 게임 불법성으로 확대하지 않는다. 원고가 계약 종료를 선택한 사건을 모든 운영자 정지 조치의 적법성으로 바꾸지 않는다. 미사용 조건은 유료포인트와 게임요금 양쪽에 적용하며 계약종료부터30일 또는 쌍방합의의 다른 처리, 서비스 개시 후7일 서면 무이유·무비용 해지와 미사용포인트 반환, 기록 최소30일 보존·요청 후7일 제공을 보존했다. 운영자 자료만을 독점 증거로 삼지 않는 것이 자료 배제는 아니다.2023년 약관과2021년 사건,2025년 최초민원2위/건수감소와2026년5월7일 발표를 구별했다. |

FAQ 17개 전체를 정본 질문 취지와 답변 조건에 대조했다. 본문을 보완하는 답변에서 의무·가능·기간을 새로 만들거나 줄이지 않았다. 각 원고의 공식 URL은 915/916/918/919/920/921 순서로 4/3/4/4/4/4개가 본문과 출처 꼬리에 각각 존재한다. 동일 URL의 문서 간 중복을 제외하지 않은 편별 합계는23개다. source-register의 공식자료 범위와 알려진 확정/상소 범위를 유지했다.

## 메타·이미지·연락 경로

모든 원고의 published/lastmod는2026-10-26, 표시 날짜는 `26. oktobra 2026.`, audience는 `["sr"]`, 내부 author는 `legal-ai-assistant`다. topic은915/918/920/921 litigation,916 company,919 labor다. 공개 본문에 내부 작성자명·AI 또는 변호사 감수 주장을 새로 노출하지 않았고 내부 AI 표기는 보존했다. 굵은 Markdown·HTML 우회 강조가 없으며 캡션은 정확히 `Izmišljeni prizor`다.

원본 이미지 `/images/columns/<ID>-case-trends-20261025.webp` 6개의 바이트 SHA와 alt를 실제 장면에 대조했다.915의 안전모·설계도·교량,916의 토양병·노트·접이식 탁자·공장,918의 서류·빈 봉투·상자,919의 원탁·무표지 파일·세 의자,920의 기둥·충전기·차량·상부 배선,921의 컨트롤러·게임토큰·노트를 설명한다. 실제 사건 사진·당사자 장면처럼 주장하지 않는다.

915/916의 `/en/contact`는 `kontakt stranice na engleskom`으로 표시했다.916의 기존 `/sr/columns/taiwan-company-subsidiary-vs-branch`는 R004에서 존재를 확인했다.918–921의 사무실 이메일은 원래 주소 그대로이며 무리한 서류·비밀번호 전송을 요구하지 않는다. 세르비아어 상담 가능 여부를 보장하지 않았다. 공용 연락처·본문 내부링크 존재의 구조 검사는 오류0이며 외부 링크의 새 실응답200을 주장하지 않는다.

## 규칙5절 자기 점검

| 항목 | 직접 확인 및 근거 |
|---|---|
| 1 실제 CLI FAIL0 | 현재6개 파일별0. 초기918/919 실패 보존, 수정5편 exit0, 동일921은 기존 개별OK 재사용. 도구 전체 exit를 숨기지 않았다. |
| 2 도입 다양성 | 915 독자의 질문,916 실사자료에 관한 사실,918 미완공 주택 장면,919 판결 결과,920 배선 경로 장면,921 청구액이다. 장면형은2/6 이하, 단일형은 절반을 넘지 않는다. 최근SR704의 날짜/첫ARC,705의 입국유형 질문,706의 체류근거 소멸 도입·제목·결말과 비교했고 같은 예고형/훈계형 틀을 붙이지 않았다. |
| 3 짧고 긴 문장 | 짧은 완결문은8/6/10/8/10/12개다. 긴 조건문은 문단당 최대1개이며 연속 긴 문장 없음. 915 `Odluka je kasnije poništena.`,916 `Uslovi se primenjuju zajedno.`,918 `Priključci su stigli kasnije.`,919 `Žalba je bila dopuštena.`,920 `Odatle je veza vodila do stanarevog brojila.`,921 `Zahtev nije usvojen.`처럼 실제 뜻을 가진 문장이다. |
| 4 시작어 | 실제 문단 시작 배열을 세로로 읽었다. 최대1/1/2/2/2/1회이고 같은 시작 연속은1/0/0/0/0/0회다. 초기918의 U3회는 주체를 직접 밝히는 수정으로 닫았다. |
| 5 인용 리듬 | 조문을 주어로 하는 조건문과 사건 결과·자료 흐름·독자의 질문을 섞었다. 문장 끝 괄호인용 비율0, 인용 없는 문단이 각 편 존재하며 주장→조문→다만을3문단 연속 복제하지 않았다. 출처 링크를 삭제하지 않았다. |
| 6 대비·반박 | 프로그램의 contrast0을 자연어 의미의 완전한 증명으로 삼지 않았다. 판결의 취소/무죄 판단, 환송/청구 기각, 청구액/지급액 등 정확성에 필요한 범위 구분은 유지하고 독자가 하지 않은 주장을 새로 만들어 반박하지 않았다. |
| 7 실질 결말 | 915의 시간·금전청구 문서 순서,916의 발견·대응·자산처분 연결,918의 세 종류 편지 구분,919의 통지·답변·증거 채택 이유,920의 동의·착공·비용분담,921의 입금·전환·사용 흐름으로 끝낸다. 그 뒤 확인일/적용범위/공식출처는 규칙의 필요한 구조 꼬리 예외로 보존했다. 판촉 보장이나 같은 결론 복사는 없다. |
| 8 문체·표기 | Serbian Latin script와 독자용 문장 유지. ko/ja 혼용 규칙은 해당 없음. 공개 굵은 강조·지어낸1인칭·명령형 체크리스트 제목·공개 저자소개 없음. 외국 기관 약어·정식 사건번호는 의미상 필요해 보존했다. |
| 9 손실 없음 | 실제7개 치환 전후 숫자 토큰/URL 순서/FM·FAQ가 모두 같고6개 원본 SHA 역복원 일치. 출처·법적조건·가상캡션 보존이 문체 수치보다 우선했다. |

## 최종 SHA와 한계

| 원고 | SHA-256 |
|---|---|
| `915-taiwan-public-contract-mediation-arbitration-same-claim.md` | `ddee0de08627d6fb79dcd96cf594cdd590962268d107c5c173ea8ce682017621` |
| `916-taiwan-parent-company-pollution-liability-us-investor.md` | `8784312ab5e99542024568fde997318bb6ab6b1bdada863a39c499d505fce6bb` |
| `918-taiwan-presale-mortgage-notice-handover-judgment.md` | `6c7510a2e0bc76125be434f3565c68a9ab2d1b074969de73f367b07a04b43801` |
| `919-taiwan-workplace-bullying-investigation-hearing-judgment.md` | `f408862fb5d8c925e4f88400bacc8dfd7d514bec78e17215bc62491983295487` |
| `920-taiwan-apartment-ev-charger-common-area-judgment.md` | `349fc3fcab177b5c4908c729e1ad84697d1379da74bac79c7d165065e7d7bf8e` |
| `921-taiwan-online-game-coins-refund-judgment.md` | `59dc73e80c5fa3dfd7d37bfbda4af66ceba80168ace8c48cbbdcd97d3cb0f8d4` |

원고는 위 SHA에서 동결했다. `sr-final-manifest.json`이 저자 기록·입력·원고·현재 증거를 바인딩한다. 실제 구조/문장 검사·모델 자체 의미 검수와 독립 검수·사람 원어민/법률 승인·공개 게시는 각각 별개다. 이 기록은 후자의 승인을 주장하지 않는다. 새 전체 테스트/빌드나 브라우저·JSON-LD·카드·피드 검증은 실행하지 않았으며 후속 통합 범위로 남긴다.

보조 읽기 명령에서 공용 구조 도구 경로를 `scripts/columns/content-audit-lib.mjs`로 잘못 추정해 FileNotFoundError가1회 났다. 실제 sr-audit.mjs import를 읽어 `docs/audit/all-locales-parity-20261025/tooling/content-audit.mjs`를 확인하고 SHA를 대조했다. 이미 수행한 실제 구조 검사에는 이 잘못된 경로를 사용하지 않았으며 해당 오류를 통과로 기록하지 않았다.

기록 생성 UTC: 2026-10-26T08:56:44.330395+00:00
