# Batch 002 EN·KO 독립 법률·출처 검수

검수자: `/root/repair_semi_zh`. 검수일: 2026-10-03 KST. 이 두 원고를 작성하지 않았다. 쓰기 범위는 이 파일 하나다. 원고·evidence·미디어·저장소·운영 큐·원격 드라이버는 수정하지 않았다.

읽은 규칙: `WRITER-WORKORDER.md`, 저장소 `AGENTS.md`, `docs/columns/EDITORIAL-VOICE.md`, `docs/columns/FRAUD-EDITORIAL-POLICY.md` 전문. 이 기록은 독립 AI 법률·출처 검수이며 변호사·원어민 검수, 이미지 실물 검수, 빌드·배포 승인 또는 실제 게시 증명이 아니다. 문체 전담 검수와 이미지·배포 게이트는 별도다.

## 판정과 정확한 수검 버전

| 원고 | 실제 전체 SHA-256 | 법률·출처 판정 |
| --- | --- | --- |
| `drafts/en-immigration-officer-impersonation-arc-taiwan.md` | `e56eec40ca7c2a5d78f30ee6ee9ca8eaf941ee07a510fd0f35d9d724bc8b3bfe` | PASS, 남은 MUST 0 |
| `drafts/ko-lost-korean-passport-taiwan-return-travel-documents.md` | `50da15dcf1614f7efa623c3c03e70d8cf57f1f6da78f996f76c5159934285d2e` | PASS, 남은 MUST 0 |

두 파일의 전체 본문·frontmatter·출처 목록을 직접 읽고 `hashlib.sha256` 및 Node crypto로 같은 SHA를 확인했다. KO의 이전 작업 중 버전 `18bf0b24…2d487`을 최종 판정 대상으로 사용하지 않았다. root가 전달한 50da 버전을 다시 전체 읽었다. EN·KO 작성자 evidence도 각각 전체 읽었다. KO evidence는 첫 조회 때 없었지만 작성자의 완료 회신 후 직접 열어 확인했으며 아래에 해시를 남겼다.

EN 도입의 ARC 연락 상황은 `Suppose`로 명시된 가상 예시다. 실제 ARC 사칭 사기의 유행·피해 규모·개별 사건이라고 주장하지 않는다. 일반 예방 공지를 특정 ARC 캠페인의 증거로 바꾸지 않았고, 모든 공적 전화가 사기라는 결론도 없다. 학생 신청 사례를 모든 ARC 보유자의 절차로 일반화하지 않는다.

KO는 한국 여권으로 대만에 입국한 여행자의 귀국 준비에 한정한다. 대만 이민서의 분실증명, 한국 대표부의 긴급여권, 별도 여행증명서, 대만 출국 심사 및 항공사 수속을 구별한다. 단기 체류자 모두에게 같은 출국허가서가 필요하다거나, 당일 출국·정해진 항공편 탑승·긴급 발급이 보장된다는 주장은 없다.

## 좁은 우려의 최신 버전 해소

KO `drafts/ko-lost-korean-passport-taiwan-return-travel-documents.md:69`의 작업 중 버전은 신고기관을 적지 않고 분실신고 후 사용 불가·즉시 무효라고 설명했다. 문서 앞부분의 대만 이민서·경찰 신고와 한국 여권법상 분실신고를 혼동할 수 있어 기관과 효력을 구별하는 수정이 필요했다.

현재 50da 버전 L69는 한국 여권기관 신고 후 무효·재사용 불가를 먼저 명시하고, 대만 경찰 신고 후 발견한 경우는 출입국 제한 가능성과 대표부 확인을 별도로 적었다. 이는 직접 연 [외교부 여권 분실·습득 안내](https://passport.go.kr/home/kor/contents.do?menuPos=26)의 신고 방법 및 유의사항과 일치한다. [현행 여권법 제13조](https://www.law.go.kr/LSW//lsSideInfoP.do?docCls=jo&joBrNo=00&joNo=0013&lsiSeq=283681&urlMode=lsScJoRltInfoR), 2026-08-28 시행 제1항 제3호도 법령에 따른 분실신고를 효력상실 요건으로 삼는다. 이 우려는 최신 수검본에서 해소됐다. 현재 열린 MUST로 계산하지 않는다.

## EN 주요 주장과 독립 확인

아래 6개 실제 인용 출처의 본문을 모두 직접 확인했다. 조회일은 모두 2026-10-03이다.

| 원고 위치 | 직접 연 1차 출처·일자·본문 위치 | 판단 및 경계 |
| --- | --- | --- |
| L22–24, L62 | [NIA 彰化縣服務站 예방 공지](https://servicestation.immigration.gov.tw/1477/1526/4747/4786/380913/), 2026-06-09, 첫 본문 문단 | 낯선 연락의 세부 사항 기록, 정규 경로 확인 또는 165 도움 요청을 뒷받침한다. ARC 연락 자체의 실제 사건·유행 증거로 사용하지 않는다. |
| L28, L36 | [NIA Service Center directory](https://www.immigration.gov.tw/5475/5478/141386/127061/127076/), 개별 게시일 없음, 실제 지역별 연락처 목록 | 명함·메시지에 적힌 번호 대신 별도로 공식 사무소 연락처를 찾는 안내가 성립한다. 모든 직원이 모든 사건을 즉시 확인해 준다는 보장은 없다. 이름·부서·번호를 적어 두는 것은 실무 제안이다. |
| L37, L40 | [NIA Foreigners in Taiwan Hotline 1990](https://www.immigration.gov.tw/5475/5478/6928/6940/204896/204917/), 2022-04-20, 1–4항 | 거류 등 생활 상담과 영어 24시간·주 7일 서비스를 확인했다. 대만 내 번호와 1990 영어 시간만 기술했으며 165의 언어·행정처분 권한·응답 보장으로 확장하지 않는다. |
| L30, L38, L64 | [內政部/警政署, 통화 중 165 입력 사칭 경고](https://www.moi.gov.tw/News_Content.aspx?n=4&s=323333&sms=9009), 2024-11-24 14:10, 사례 뒤 CIB 안내 | 기존 통화 중 165를 누르게 해 공범에게 연결한 수법과 먼저 끊은 뒤 확인하라는 권고를 직접 확인했다. 역사적 예방 공지의 날짜를 그대로 밝히며, 그 피해자가 ARC 보유자라고 하지 않는다. |
| L44, L65 | [NIA student residence guidelines 0929](https://www.immigration.gov.tw/5475/5478/141465/141808/417829/cp_news), 2026-08-28, 2항 대상·3항 여권·4항 업로드/납부·5항 수수료 | 합법적 신청에도 문서와 비용이 있을 수 있다는 한정적 예시를 뒷받침한다. 모든 ARC 신청에 하나의 비용·납기·자격·온라인 경로를 적용하지 않는다. |
| L48, L66 | [警政署 保安警察第三總隊 예방 공지](https://www.3spc.npa.gov.tw/ch/app/data/view?id=18710&module=govinfo&serno=e671597a-172b-4da1-b08a-bd0e77631fa9), 2025-03-10, 본문 이체·신분/금융 문서 요청 문장 | 이체나 신분·금융자료 요구 전 165/110으로 확인하는 안내를 뒷받침한다. 정상 기관 문서 제출 자체를 금지하지 않는다. 은행 비밀번호·코드 제공 금지는 원고의 안전 제안이며 NIA의 별도 법정 의무로 인용하지 않는다. |

L46의 구비서류·수신 경로·납부·영수증 확인 질문, L52의 실제 거류 절차를 계속 확인하라는 안내, L54의 원본 보존·은행 연락, L56의 초기 비식별 문의 제안은 실무상 권고로 읽힌다. 법정 신고의무·체류 자격 연장·송금 취소권·환급 보장으로 쓰이지 않는다. 홈페이지 링크 응답·법률사무소 수임 여부는 이 법률 검수에서 새로 인증하지 않는다.

## KO 주요 주장과 독립 확인

원고의 실제 인용 출처 9개와 추가 확인 법령 2개를 직접 열었다. 조회일은 모두 2026-10-03이다.

| 원고 위치 | 직접 연 1차 출처·일자·본문 위치 | 판단 및 경계 |
| --- | --- | --- |
| L22, L38–51, L73 | [주타이베이 대표부 긴급여권 안내](https://www.mofa.go.kr/tw-ko/brd/m_1437/view.do?seq=1346570), 2024-07-01 작성·2025-10-22 수정, 대상/구비서류/소요기간 및 공관 footer | 이민서 증명·항공권·양식·국내 신분증 또는 구여권 사본·사진·현금 준비, 게시된 당일 발급, 정확한 영사 접수 시간과 연락처를 확인했다. 수수료의 특정 오래된 금액을 보편적 현행 금액으로 단정하지 않고 방문 전 확인하도록 한다. |
| L28, L30, L47, L65 | [NIA 외국여권 분실기록증명](https://www.immigration.gov.tw/5385/7244/7250/7317/%E5%85%B6%E4%BB%96/389775/), 2008-08-20 게시·2025-03-31 갱신, 신청자/창구/서류/주의사항 | 본인 신청, 미성년자의 부모·후견인 대리, 각 지역 서비스센터·專勤隊·공항항만, 여권 외 신분증명과 2인치 사진 2장, 거류 외국인의 새 여권 정보 변경을 확인했다. 신분자료를 모두 잃은 경우의 대체 심사 결과나 처리 시간을 만들어 내지 않는다. |
| L30, L74 | [대표부 안전여행 길잡이](https://www.mofa.go.kr/tw-ko/brd/m_26953/view.do?seq=28), 2024-05-14 작성·2025-09-22 수정, 여권 분실 신고 및 재발급 부분 | 이민서 신고·증명 취득과 대표부 여권 신청이 별개임을 확인했다. 공항 이민서가 한국 긴급여권까지 발급한다는 오해를 막는다. 다른 주제 부분이나 오래된 금액을 이 원고의 근거로 옮기지 않았다. |
| L32, L76 | [대만 CIB 외국여권 분실 FAQ](https://www.cib.npa.gov.tw/ch/app/faq/view?id=18233&module=faq&serno=92807452-cc8d-474e-897e-b192bffcfdeb), 본문 2016-02-15 갱신, 첫 항목 | 외국여권으로 입국한 뒤 분실한 경우의 NIA 절차와, 대만 여권으로 입국한 사람의 외국여권 분실을 구별한다. 원고는 전자 범위다. 경찰 유실물 접수증만으로 대표부의 NIA 증명을 대체한다고 하지 않는다. |
| L24, L63, L77 | [入出國查驗及資料蒐集利用辦法](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080140), 2023-12-28 최종 개정 표시, 현행 제11조 | 새 여권 또는 다른 유효 여행서류와 출국 절차, 체류기간 및 제한·초과체류 처리 경계를 확인했다. 여권 재발급 자체를 체류 연장·출국제한 해제로 보지 않는다. 각 호의 구별을 보편적 동일 허가서·처리 시간으로 바꾸지 않는다. |
| L49, L55, L59 | [외교부 긴급여권](https://passport.go.kr/home/kor/contents.do?menuPos=14), 개별 갱신일 없음, 정의/발급 대상/유효기간/발급 불가/유의사항 | 비전자·1년 단수, 긴급 필요성 인정, 신원 확인 불가 및 5년 내 3회 이상 분실의 제한, 방문국별 인정 여부를 확인했다. 당일 발급 안내를 개인의 발급·탑승 보장으로 바꾸지 않는다. 경유·항공사 별도 확인은 실무 권고다. |
| L57 | [외교부 여행증명서](https://www.passport.go.kr/home/kor/contents.do?menuPos=21), 개별 갱신일 없음, 정의/발급 대상; [현행 여권법 제14조](https://www.law.go.kr/LSW//lsSideInfoP.do?docCls=jo&joBrNo=00&joNo=0014&lsiSeq=283681&urlMode=lsScJoRltInfoR), 2026-08-28 시행 | 여권을 갈음하는 별도 서류, 1년 이내와 목적 달성 시 효력 상실을 확인했다. 행정제재자의 편도 귀국용 1개월 이내는 외교부 안내에 정확히 귀속한다. 일반 분실자에게 자동 발급되는 서류라고 하지 않는다. |
| L67, L79 | [대한항공 키오스크 안내](https://www.koreanair.com/contents/plan-your-travel/check-in/self-check-in/kiosk), 개별 갱신일 없음, 여행 관련 서류 FAQ | 해외 발급 긴급·임시 여권은 직원 확인 뒤 수속하며 셀프 체크인 불가라는 항공사의 안내를 확인했다. 한국 출발 전 발급된 서류와 구별하는 원문에 반하지 않는다. 다른 항공사나 탑승 허가 보장으로 확장하지 않는다. |
| L69, L78 | [외교부 여권 분실·습득](https://passport.go.kr/home/kor/contents.do?menuPos=26), 개별 갱신일 없음, 신고 방법·유의사항; [현행 여권법 제13조](https://www.law.go.kr/LSW//lsSideInfoP.do?docCls=jo&joBrNo=00&joNo=0013&lsiSeq=283681&urlMode=lsScJoRltInfoR), 2026-08-28 시행 | 최신 L69의 한국 신고기관과 대만 경찰 신고의 효과 구별이 원문에 맞는다. 다시 찾은 여권을 그대로 사용하라고 안내하지 않으며 새 여권 예약정보 확인도 결과 보장이 아닌 권고다. |

## 접근 실패와 확인 한계

- EN의 MOI 2024-11-24 공지와 KO의 NIA 2025-03-31 안내는 web 도구 첫 열람이 timeout이었다. 이를 통과로 세지 않았다. 이후 인증서 검증을 유지한 `/usr/bin/curl -fsSL --max-time 35`로 동일한 공식 URL의 HTML을 직접 받아 본문 전체를 추출·읽었다. 두 출처의 인용 주장은 독립 확인 완료다.
- MOI 원문 취득: exit 0, 96,455 bytes, SHA `766025f9b825a4fbee665e1f0937e1bebe01da639718a4b456bb83b8cc077c6b`.
- NIA 분실증명 원문 취득: exit 0, 32,645 bytes, SHA `c52e16b23b49b45a9f26958340dd041deb62b2c88dc64e032ec3e080b788c98f`.
- 한국 여권법 제13·14조의 짧은 법령 URL은 처음에 navigation만 반환했다. 실제 `lawService` 링크를 열어 2026-08-28 시행 조문 본문을 확인했다. 검색 결과 요약으로 대체하지 않았다.
- 추가 탐색한 `https://www.law.go.kr/법령/여권법시행규칙/제11조`, `https://www.law.go.kr/법령/여권법시행령/제18조` 직접 URL은 web 도구에서 접근 실패 상태로 남았다. 그 조문을 확인했다고 주장하지 않으며 원고의 법률 결론 근거로 사용하지 않았다. 실제 인용된 MOFA 안내 및 별도로 확인한 현행 여권법 제13·14조가 위 검수 판단을 뒷받침한다.
- 인용된 15개 기관·항공사 페이지(EN 6, KO 9)의 필요한 본문은 모두 확보했다. 확인하지 못한 ARC 사칭 사건의 존재·빈도, 대만 모든 공항의 동일 처리 시간, 특정 여행자의 발급 가능 여부·탑승·거류 결정은 판단하지 않는다. 원고도 이를 확정하지 않는다.

## 후속 이미지 문구 변경을 위한 동일성 기준

현재 법률 PASS는 위 전체 SHA에 한정한다. 이미지 실물 검사 뒤 alt/caption만 수정된다면 전체 SHA를 새로 기록하고 아래 body 및 보호 frontmatter SHA와 비교해야 한다. 비교 전에는 새 전체 SHA를 승인본이라고 부르지 않는다.

| 원고 | `gray-matter`가 반환한 본문 content SHA | alt·caption 두 필드만 제외한 frontmatter SHA |
| --- | --- | --- |
| EN | `f0b713a973a97da30c06935064049f51a619eb88f3af7eaa7fedab2377a788b5` | `5ce4b4e7b0089cf777190f0efb67ba8ab2b222e62c50f6eae008c7d965310c9a` |
| KO | `243f373fab1c935389e3f59fc68cb6f0d9838ab04ca67936700a36334311e92f` | `3bb72a44541ab55087acb7d352de39bdac6704212951ce948a72341be9d7d75c` |

보호 frontmatter 산식: `gray-matter`로 data 파싱 → `featured_image_alt`, `featured_image_caption`만 제외 → key를 `localeCompare`로 정렬한 `Object.fromEntries` → `JSON.stringify`의 UTF-8 SHA-256. 이미지 경로와 title/summary/date/author 등 다른 metadata는 제외하지 않았다.

실행한 Node 검사 출력: 두 원고 모두 H1 1개, 장식 bold/HTML 우회 0, 내부 `author: legal-ai-assistant`, 해당 단일 audience 유지, exit 0. 이 형식 검사는 본문의 법률 검수를 대신하지 않는다. 원고 변경은 0이다.

## 후속 갱신 기록

1. 작성자 `/root/repair_semi_ko_ja`가 KO 50da 전체 SHA의 freeze와 L69 수정·evidence 완료를 회신했다. 최신 원고를 전체 다시 읽고 evidence 전체도 읽었다. 구비사진·신고기관 구별·기관별 처리 및 외교부 안내의 수수료 차이를 특정 금액으로 단정하지 않은 경계가 이번 독립 확인과 일치한다. 수수료의 개별 현재 금액 확인은 실제 신청 단계이며 이 글은 그 금액을 제시하지 않는다.
2. 최종 기록 직전 두 원고의 전체 SHA를 다시 계산해 판정표와 같음을 확인했다. 읽은 EN evidence SHA는 `8c8658575d505f4a09ab3cd1e622585e3d2449cc2c760d8379ce06f650d05a29`, KO evidence SHA는 `e9afbb5b26bef5096b86e08fda2ed5376a6f12d8e3b62ba7699c2ef0dfe88f14`다. 작성자 evidence의 자체 점검·별도 source 접근 실패는 독립 검수 완료와 혼동하지 않는다.
3. 남은 법률 MUST: EN 0, KO 0. 현재 원고의 공개 claims에 필요한 출처 접근 미해결: 0. 위에 별도로 적은 추가 법령 탐색 URL 두 개는 접근 미확인 상태이며 그 조문에 관한 판단을 하지 않았다. 이미지 alt/caption 실물 확인과 그 변경 후 새 전체 SHA의 동일성 검사, 문체 전담 검수·통합·게시 게이트는 후속 범위다.

## 최종 이미지 설명 변경분 검수 — 2026-10-03

root 및 두 작성자로부터 이미지 확인 후 동결본을 전달받고 실제 파일을 다시 읽었다. 최신 법률 판정은 아래 전체 SHA에 대한 APPROVE이며, 앞부분의 초기 승인 SHA에서 이어지는 검수다.

| 원고 | 최신 전체 SHA-256 | 최신 evidence SHA-256 | 최종 법률 판정 |
| --- | --- | --- | --- |
| EN | `b686efffeaec7f25e1f2d3567e57f14d67092eb4468754c5e146b9691c22ea37` | `11ed16ebd45aa98e101378d9af532b96b666068c71354a569417cd074fa06a2e` | APPROVE, MUST 0 |
| KO | `4e70b662751e4bc00258162d0cbfe23d78f4a738783d88099f68ba28895c1f14` | `b2f3be0a086c8d717ac9e9d1ca135aaff07737ee237c8bdea2cfd97fc007142c` | APPROVE, MUST 0 |

직접 실행한 Node/gray-matter/crypto 비교 결과는 두 파일 모두 `pass: true`, exit 0이었다.

- EN: `featured_image_alt`와 `featured_image_caption` 두 줄만 초기 승인 값으로 메모리에서 역치환했을 때 전체 SHA가 `e56eec40ca7c2a5d78f30ee6ee9ca8eaf941ee07a510fd0f35d9d724bc8b3bfe`로 정확히 복원됐다. 본문 content SHA `f0b713a973a97da30c06935064049f51a619eb88f3af7eaa7fedab2377a788b5` 및 보호 frontmatter SHA `5ce4b4e7b0089cf777190f0efb67ba8ab2b222e62c50f6eae008c7d965310c9a`도 초기 승인과 같다.
- KO: alt 한 줄만 초기 값으로 메모리에서 역치환했을 때 전체 SHA가 `50da15dcf1614f7efa623c3c03e70d8cf57f1f6da78f996f76c5159934285d2e`로 정확히 복원됐다. 본문 content SHA `243f373fab1c935389e3f59fc68cb6f0d9838ab04ca67936700a36334311e92f` 및 보호 frontmatter SHA `3bb72a44541ab55087acb7d352de39bdac6704212951ce948a72341be9d7d75c`도 초기 승인과 같다. 캡션과 이미지 경로는 변하지 않았다.
- 이 검수의 `gray-matter` content SHA와 작성자가 기록한 원시 구분자 뒤 본문 SHA는 추출하는 선행 줄바꿈 범위가 다르다. 여기서는 처음에 기록한 동일 산식끼리 비교했고, 전체 파일 역치환 SHA까지 일치하므로 본문·법률 주장·출처·그 밖의 metadata 불변을 별도로 입증한다. 파일 자체를 역치환해 저장하지 않았다.

새 EN alt는 전화 수화기·종이 폴더·일반 연락 아이콘이 있는 노트북을 설명한다. 새 캡션은 AI 생성 가상 장면임을 유지하고 인물·화면·종이를 실제 거주자, 정부 웹페이지, 신분증 또는 보도된 사건으로 표시하지 않는다. KO alt는 빈 여권 케이스와 주변 여행 물품을 설명하며 기존의 AI 생성·실제 사건 아님 고지를 유지한다. 두 변경에 새로운 법률 요건·사건·유행·성과·신원·기관 진정성 주장은 없다.

각 작성자의 실제 `view_image` 열람 기록과 최종 evidence의 변경 내역을 읽었다. 이 법률 검수자가 이미지를 직접 다시 보았다고 주장하지 않는다. 이미지 실물·렌더링·배포 확인은 담당자의 별도 증거에 따른다. 법률 본문이 그대로라 앞의 독립 1차 자료 확인을 유지하며 같은 출처를 불필요하게 재조회하지 않았다.

최종 수검본 기준 열린 법률 MUST 0. 이번 단계에서 쓴 파일은 이 검수 문서뿐이며 원고·evidence·미디어·저장소·원격 큐는 수정하지 않았다. 큐 반영은 root의 LIVE_CONFIRMED 전까지 계속 보류한다.

## EN SEO 제목 한 줄 최종 변경분 검수 — 2026-10-03

root의 순차 검수 요청에 따라 운영 장부 정정과 재열람을 마친 뒤 이 법률 검수만 별도로 수행했다. 이번 쓰기 범위는 이 검수 문서의 끝부분이며, 기존 EN·KO 검수 내용과 KO 판정을 보존했다.

최신 EN 법률·출처 판정은 APPROVE, 열린 MUST 0이다. 실제 수검 원고 전체 SHA는 `72074c977db099759425a3f4879e300e30caa8650e4ffd4fade4e5ba7216c256`, evidence SHA는 `a9b132bb09d70f366b6d50f9a505a5752576645cbcc44435004be4241865cf0d`이다. 두 실제 파일을 읽어 해시를 직접 계산했다.

변경은 `drafts/en-immigration-officer-impersonation-arc-taiwan.md:3`의 `seoTitle` 한 줄이다. 직전 법률 승인본의 `Taiwan ARC Scam Calls: Verify the Immigration Office`가 최종 `Taiwan ARC Scam Calls: Verify the Caller`로 바뀌었다. 본문이 구별하던 연락한 사람의 신원과 별도로 연락하는 실제 NIA의 구별을 유지한다. 새 사건·유행·법정 절차·기관 권한·보장 주장은 추가되지 않았다.

직접 실행한 Python hashlib 역치환 비교와 Node gray-matter/crypto 결과:

- 최종 SEO 한 줄을 메모리에서 직전 승인 값으로 되돌리면 전체 SHA가 `b686efffeaec7f25e1f2d3567e57f14d67092eb4468754c5e146b9691c22ea37`로 정확히 복원된다. 중간 문구 `Verify the NIA`로 역치환한 전체 SHA도 작성 이력의 `861612c9ddab4c12ef9ea1cfe75ce2bbb84ccdc198e97edbb6417645e173f6a7`과 같다. 실제 원고를 역치환해 저장하지 않았다.
- 원시 본문은 `s.split(b'---', 2)[2]` 산식으로 `3bc0ffdff2043874e48bad0d7b345fcaf5c918db6269ba737e5208df7e565dac`, 기존 gray-matter content 산식으로 `f0b713a973a97da30c06935064049f51a619eb88f3af7eaa7fedab2377a788b5`가 유지됐다. 두 산식은 닫는 구분자 다음 선행 줄바꿈 포함 범위가 다르다. 동일 산식끼리 비교했고 전체 파일 역치환까지 일치하므로 본문·공식 출처·공개 title·H1·미디어와 나머지 frontmatter는 그대로다.
- 최종 SEO 값 40자, 제공된 접미사 ` | Hovering Law` 포함 55자다. Python 결과 `PASS`, `onlySeoTitleChanged: true`, exit 0. Node content 비교도 `PASS`, exit 0. 이는 실제 repository SEO suite 재실행을 대신하지 않는다.
- KO 원고 전체 SHA `4e70b662751e4bc00258162d0cbfe23d78f4a738783d88099f68ba28895c1f14`와 evidence SHA `b2f3be0a086c8d717ac9e9d1ca135aaff07737ee237c8bdea2cfd97fc007142c`가 기존 승인값과 동일함을 다시 계산했다. KO 법률 APPROVE, MUST 0을 유지한다.

법률 본문과 출처가 바뀌지 않아 앞에서 직접 확인한 1차 자료 검수 결과를 이어받는다. 이번 좁은 변경분에서 새 법률 연구를 했다고 주장하지 않는다. 원고·evidence·저장소·이미지는 수정하지 않았다. 배포·빌드·SEO 통합 게이트의 완료 여부는 해당 담당자의 증거에 따른다.
