# B11 NL6 독립 표적 재확인 R2

확인 시각(UTC): 2026-10-26T12:47:48.071285+00:00

R1의 필수 M01–M03과 선택 O01–O03을 모두 닫는다. 추가된 920의 세 치환도 함께 읽었으며, 이번 변경 범위에서 남은 필수·선택 지적은 0건이다. 원고·저자·기존 R1 기록·R·공유 도구는 수정하지 않았다. 원어민 인간·변호사 감수 또는 공개 배포 승인을 뜻하지 않는다.

저자 R2 보고서와 세 수정 원장 전문, 실제 CLI 출력과 정확 SHA, 독립 R1 원본 6편을 대조했다. 최초 제안 6개는 R1 findings의 exact old/new 그대로다. 추가 3개까지 총9치환의 위치·중간 SHA를 따라 순방향 재현했고, 빈 문자열 삭제를 포함하여 역순 복원해 R1 사본 6/6과 일치했다. 915·916은 원고 전체가 R1과 동일하다.

## 지적별 종결

### M01 — 919 · 해소

현재 문장: Coördinatie kan plaatsvinden als de klager dat wenst.

신고인 의사 als de klager dat wenst가 조율 가능 kan plaatsvinden의 조건으로 직접 연결된다. 바로 뒤 Mislukt zij, dan moet het onderzoek doorgaan가 실패 시 조사 속행 의무를 유지한다.

의미 보존: 의사 AND 조율 가능(may), 불성립 → 조사 속행(must); 공정 조사·충분한 답변·이해관계 회피의 주변 문맥도 불변.

### M02 — 920 · 해소

현재 문장: Geeft een overheidssubsidie toestemming om in gemeenschappelijke delen te bouwen?

정본 보조금 FAQ가 정확 제안대로 복원됐다. 가오슝2026 공동주택 공용구역 선로 트레이, 지난9월30일 기한, 보조금이 공사 동의를 대신하지 않는다는 범위를 답변에 남긴다.

의미 보존: FAQ3개/배치17개, 나머지16문답 불변. 기존 허가 AND 안전검사 및 법11조/규약15조 구별은 본문에 유지. FAQ의 숫자15/11→2026/30 변경은 의도된 내용 복원이며 전체 메타 숫자 불변으로 주장하지 않는다.

### M03 — 918 · 해소

현재 문장: Op grond van die omstandigheden aanvaardde de rechter deze brief niet als een rechtsgeldige kennisgeving voor de overdracht.

은행 연락·진행 요청, 이후 수도/전기 연결, 7월 하자와 엘리베이터 설치 미완료를 법원 판단에 직접 잇는 하나의 문단으로 바뀌었다. 빈 서신제목 반박과 중복 결론을 삭제했다.

의미 보존: 2019년2월23일, 7월초 상태, 설치 미완료(완전 미설치 아님), 본건 서신 불인정이 보존된다. 앞의 상소불가·뒤의 매수자 입실 동의와 계약상 인도 구별도 불변. 문장수만 바뀌었다는 이유로 닫은 것이 아니다.

### O01 — 919 · 해소

현재 문장: De mogelijkheid om pas tijdens de heroverweging te reageren, herstelde in deze zaak het eerdere gebrek aan een behoorlijke gelegenheid tot verweer niet.

본건의 적절한 항변 기회 부족과 사후 복심 응답을 직접 연결한다. 일반적으로 모든 사후 절차로는 아무 결함도 보정할 수 없다는 명제로 넓히지 않는다.

의미 보존: 옆 문단의 보고서/징계의 사실 모순, 상소 가능·실제 복직 미확인은 불변. R1의 원문을 별도 필수 오역으로 재분류하지 않는다.

### O02 — 920 · 해소

현재 문장: Voor extra elektrische bedrading en leidingen vereiste artikel 15 van het complexreglement zowel toestemming van de beheerscommissie als een veiligheidscontrole door het elektriciteitsbedrijf.

Dat waren twee voorwaarden. 중복은 없어졌고 후속 문장 연결에서 zowel...als가 두 요건을 여전히 누적한다.

의미 보존: 관리위원회 허가와 전력회사 안전검사, 규약15조와 국가법11조의 구별. 삭제문 뒤 공백까지 위치기반 역복원 일치.

### O03 — 921 · 해소

현재 문장: Een tijdige aanvraag kan helpen te reconstrueren hoe het saldo op de laatste schermafbeelding tot stand kwam.

어색한 schermafbeeldingssaldo 합성어 대신 화면 잔액의 형성 경위를 설명한다.

의미 보존: kan helpen의 실무 권고 성격, 최소30일보관/접수후7일제공, 사업자 자료만의 증거제한 금지 주변 문맥 유지.

## 추가된 920 세 치환

규약15조와 허가·안전검사를 한 문장으로 연결한 수정은 `zowel toestemming van de beheerscommissie als een veiligheidscontrole door het elektriciteitsbedrijf`의 두 요건을 누적으로 보존한다. 앞의 국가법11조상 구분소유자회의와 뒤의 단지 규약 구별도 그대로다.

`Wie geeft hier toestemming?`는 추상적인 route 대신 결정 주체를 묻는다. 뒤에서 작업·권리·해당 규약을 비교하므로 관리위원회가 모든 경우의 구분소유자회의를 대신한다는 결론을 만들지 않는다.

`De niet-naleving bleef na de coördinatie voortduren. Daarom kon de commissie op grond van artikel 6, derde lid, de rechter inschakelen.`은 조율 후 불이행 사실과 법적 귀결을 두 문장으로 나누되 Daarom로 인과를 유지한다. kon은 청구 가능성이고 자동 철거나 재판 청구 의무가 아니다. 직전 문단의 위반·조율 시도와 다음의 제6조1항4호 불적용, 주민의 잠금 주장도 확인했다.

## 실제 경계·문체·구조

현재270문장 중262개 문자열·단위·순서가 R1과 동일하고 8개가 새로 바뀌었다. 변경7문단과 각각 앞뒤 문단을 직접 읽었다. 변한4편만 현재 함수로 재추출해 저자의 정확 SHA 실측 배열·지표와 일치함을 확인했다. 바뀌지 않은2편은 R1 배열과 실측을 동일 SHA로 재사용했다. 새 전수 CLI는 실행하지 않았다.

MONOTONY: 918 문단 경계·빈 반박 — “De titel van de brief kon de toenmalige toestand van het huis niet veranderen.”를 삭제하고 서신·주택 상태·법원 판단을 연결 — 해결. 숫자상 문단 형태가 달라졌다는 이유가 아니라 불필요한 반박을 없애고 근거가 이어지는 것을 확인했다. 920의 중복 두 조건 문장도 복원하지 않았고, 새로운 짧은 문장은 불이행 사실과 그 법적 귀결을 구분한다.

제5절의 기존 도입·제목·최근5편 비교·말미는 바이트 불변 범위에서 R1 검토를 재사용한다. 변경 문단 시작어와 주변 문장을 읽었고 현재 최대 시작어 반복은 각2회다. 날짜·금액·조문·URL 및 장단문 경계를 확인했다. 정확한 숫자·조건을 삭제하거나 도구 임계값을 바꾸지 않았다.

본문 숫자 순서와 전체 Markdown URL 순서는 모든6편에서 R1과 같다. 메타데이터는 920 FAQ 두 번째 질문·답변만 바뀌었고 다른 필드는 불변이다. FAQ 총17개와 나머지16문답을 보존했다. FAQ의 숫자15/11에서2026/30으로 바뀐 것은 보조금 주제를 복원한 의도된 변경으로 별도 기록하며, 메타데이터 숫자까지 불변이라고 하지 않는다.

영향4편의 실제 구조 검사는 오류0이고, 그 뒤920 추가 변경은 최종 SHA에 연결된 단독 구조 오류0이다. 자동 의미 상태는 REVIEW_REQUIRED로 보존한다. 현재 918·919·921은 첫 영향4편 구조 기록의 SHA와 같고, 920은 마지막 단독 기록의 SHA와 같다. 동일 구조 검사를 관성적으로 반복하지 않았다. R1에서 본문 SSR을 읽었으며 이번은 변경 텍스트·정확 diff·현행 구조 증거의 표적 재확인이다. 새 공개 화면·카드·피드·JSON-LD 확인은 주장하지 않는다.

## 실제 측정 이력

| 글 | 현재 문장 수 | 현재 CV | 현재 SHA와 연결된 실제 기록 |
|---|---:|---:|---|
| 915 | 48 | 0.476 | nl-variety-self-r4.json; 파일별 OK, aggregate exit 1 |
| 916 | 45 | 0.482 | nl-variety-self-r6.json; 파일별 OK, aggregate exit 0 |
| 918 | 43 | 0.469 | nl-variety-review-r2.json; 파일별 OK, aggregate exit 1 |
| 919 | 41 | 0.479 | nl-variety-review-r2.json; 파일별 OK, aggregate exit 1 |
| 920 | 42 | 0.454 | nl-variety-review-r2c.json; 파일별 OK, aggregate exit 0 |
| 921 | 51 | 0.467 | nl-variety-review-r2.json; 파일별 OK, aggregate exit 1 |

920은 첫 영향4편 검사와 다음 단독 검사에서 CV .442로 두 번 실패했다. 두 실제 출력·SHA를 보존한다. 마지막 920 단독 검사만 CV .454, exit0/FAIL0이다. 918·919·921의 현재 OK는 920이 실패했던 aggregate exit1 실행에 있으므로 그 실행 전체를 exit0로 바꾸지 않는다. 915·916은 정확 동일 원고의 과거 실행을 연결했다. 기계 통과와 의미·문체 종결은 별도로 판단했다.

## 기록 보존과 한계

시작과 끝에68바인딩을 확인해 모두 불변이었다. 현재6원고·R2저자/manifest·R1독립/저자 증거·백업·정본/규칙/최근글 및 NL 관련5도구를 포함한다. LESSONS21:06판 `482ae7afd3f0da90cf1379e345f15783ec4442f5406bde09e7e675b6ef2bdab8`은 R1에서 전문을 읽은 같은 판본이며, 과거19:05 해시 주장도 그대로 보존한다. 법률 근거와 실제 조회 한계는 동일 입력의 R1 기록을 재사용하며, 새 판결문 전체 네트워크 조회를 주장하지 않는다.

독립 검수 보조 래퍼에서 두 읽기 오류가 있었다. 첫 파일 열거는 디렉터리에 해시를 시도해 중단했고 파일만 거르는 방식으로 재개했다. 첫 배열 대조는 YAML을 제거하지 않고 body_blocks에 넘겨 거짓 불일치가 발생했으며 strip_fm 후 다시 대조해 실제 배열과 일치했다. 두 오류는 원고나 공유 도구를 바꾸지 않았고 실제 variety 실패와 구분해 wrapper-observations에 남겼다.

## 현재 원고 SHA256

| 파일 | SHA256 |
|---|---|
| 915-taiwan-public-contract-mediation-arbitration-same-claim.md | `73765c4d13843c06ca292f47907038fa45c6aa7125ae89f46d48258afe035a60` |
| 916-taiwan-parent-company-pollution-liability-us-investor.md | `7475d597e8b06dc6ccd2f4d732fb8f8d4dbe0621843cdc030f2c368e6ba105d8` |
| 918-taiwan-presale-mortgage-notice-handover-judgment.md | `daafd27d86f8e9f9698d76527bf6297876d675e0e316c1a01c2878a6bc96d0e5` |
| 919-taiwan-workplace-bullying-investigation-hearing-judgment.md | `caafa40bef2f15b7ae5bc4b7037d79faa2566539d5e8001ac793ae484b3efeca` |
| 920-taiwan-apartment-ev-charger-common-area-judgment.md | `ad6d7950727b7f3184b0d45f70bf0f33437481b4ed18afab608fee71dcfd5756` |
| 921-taiwan-online-game-coins-refund-judgment.md | `8cb644afa132e442b67a57f2ef8c80a00fd559396519b45f7a824c000a1d4f71` |

저자 R2 보고서: `3cb6cad4f2a95f3fb785302d8ed33fee06c34bdbca9334fc973b1c8cfb778e1a`. 저자 R2 최종 manifest: `5fb8219c81f6353b0fdc48e682bc06f8f7582573cead71d05f31590d08746c64`. 저자 proof: `167ead8e8e64eabdd01ce562e0426406ab780229ae3bc44644f322be6f61966d`.

독립 [verification](../checks/nl-independent-r2-verification.json)에 exact9치환·정역증명·현재 배열·diff·메타데이터/숫자/URL 대조가 있다. [closure](../checks/nl-independent-r2-closure.json)는 문장별 종결 이유와 추가920검토·실패/구조 기록, [start](../checks/nl-independent-r2-start.json)와 [end](../checks/nl-independent-r2-end.json)는 바이트 보존 범위다. 이번 보고서는 새 변화와 그 주변 조건의 표적 종결이며, R1 전문 대조를 대체하거나 더 넓은 검증을 한 것으로 표시하지 않는다.
