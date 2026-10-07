# 401 증인 소환 칼럼 — 독립 검수 A, R1

판정: REQUEST_CHANGES

검수일: 2026-10-07. 검수 범위는 401의 ko/en/ja/zh-hant/vi 원고 5개입니다. 아래 세 가지 수정 요구를 반영하면 다시 확인할 수 있습니다. 다른 검수자의 결과는 열람하거나 교류하지 않았습니다. 이 보고서는 AI의 법률자료·언어·편집 검수이며 변호사 검토나 인간 원어민 검수라는 뜻이 아닙니다. 원고 파일은 수정하지 않았습니다.

작업트리: `/Users/son7/Projects/tseng-law-criminal-20261007`. 공통 파일명: `401-taiwan-criminal-witness-summons-refuse-testimony.md`.

| 디렉터리 | 검수한 파일 SHA256 |
| --- | --- |
| src/content/columns | 2fa54de808b2dcffbd9561cc95095992ea9cba14b1bc34e7ba05576cffcd7d70 |
| src/content/columns-en | dee7f011a14703a2939983964809e6cffd9a5ccac54f0ee509453d5db095bc47 |
| src/content/columns-ja | 11ef2de062a90c2505b031a6baa77bfce3115b42dd5b2fd15569e4bce1f41e2d |
| src/content/columns-zh | f38bf4ab32379092e23ebd99d507e1a81a4f3616b820093e0546906c4a53f7d8 |
| src/content/columns-vi | ce187fe1c1618dd3788142d71a71a673acf31163b64cb4f1d1a77d591bff9019 |

1. 수정 요구 — 제183조의 소명 대체 절차를 네 언어와 FAQ에도 보존

위치: ko 본문 35행, en/ja/vi 본문 37행, 모든 언어의 frontmatter FAQ 1(15행). zh 본문 37행에는 이 예외가 이미 있습니다.

원문:

- ko: “거부 사유는 밝혀야 합니다.” / “제183조에 따라 이를 소명하면”
- en: “Under Article 183, it must be substantiated”
- ja: “拒絶には理由の疎明が必要です。”
- vi: “Bạn cần làm rõ lý do từ chối.”
- zh FAQ: “依第183條，證人須釋明拒絕的原因”

이유: [현행 제183조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=183)는 이유 소명을 원칙으로 정하면서, 제181조의 경우에는 具結로 소명을 대신하도록 명할 수 있다는 단서를 둡니다. 자기부죄 우려가 이 글의 중심이므로, 소명만을 유일한 경로처럼 쓰지 않아야 합니다. zh 본문에 있는 실질적 예외가 다른 언어판에서는 빠졌고, zh FAQ도 본문의 단서를 반영하지 못했습니다.

수정안:

- ko: “거부 사유를 소명하는 것이 원칙입니다. 다만 제181조의 경우에는 소명 대신 선서·서약 절차(具結)를 명할 수 있습니다.” 뒤의 검사·재판장·수명법관 판단 문장은 보존합니다.
- en: “The reason normally has to be substantiated. For an Article 181 claim, an oath may be required in place of that substantiation.” 뒤의 판단 주체와 출석 의무 설명은 보존합니다.
- ja: “拒絶の理由は原則として疎明します。第181条の場合には、疎明に代えて宣誓等の手続（具結）を命じられることがあります。” 판단 주체는 원문대로 둡니다.
- vi: “Về nguyên tắc, người làm chứng phải làm rõ căn cứ từ chối. Trong trường hợp Điều 181, cơ quan có thẩm quyền có thể yêu cầu thực hiện thủ tục cam kết (具結) thay cho việc làm rõ căn cứ đó.” 이후 검사와 법관의 판단 구분은 유지합니다. 具結의 베트남어 설명은 중국어 원어를 함께 두어 일반 서류 제출이나 자동 면제로 읽히지 않게 합니다.
- FAQ는 본문과 같은 예외를 짧게 담거나 “법정 절차에 따라 거부 사유를 주장하고 담당 검사·법관의 판단을 받는다”는 문장으로 바꾸어 절대적 소명 의무를 피합니다. zh 예: “仍須依第183條主張拒絕事由並由檢察官或法官決定；第181條的情形，得命具結以代釋明。”

의미 보존: 출석과 증언거부가 별개라는 결론, 제181조 요건, 제183조 판단 주체는 유지하고 현재 빠진 절차상 예외만 회복합니다. 具結이 당사자의 선택만으로 자동 허용된다고 쓰지 않습니다.

2. 수정 요구 — 베트남어 自訴人 명칭

위치: vi 35행.

원문: “người bị buộc tội hoặc người tự truy tố”

이유: “người tự truy tố”는 대만 自訴人의 명칭을 불명확하게 만듭니다. [司法院 「法庭及訴訟程序常用法律詞彙」 베트남어판](https://www.judicial.gov.tw/tw/dl-58200-bcb04ecc13bc43e7926bf92cb97b1f7d.html) PDF 3쪽, 항목 67은 自訴人을 “Người tự tố”로 대조합니다. 같은 자료 항목 361은 自訴를 “Tự tố”로 표기합니다. 이 용어집을 직접 열어 확인했습니다.

수정안: “người bị buộc tội hoặc người tự tố (自訴人)”로 고칩니다. 낯선 제도를 설명할 필요가 있으면 “người đưa vụ án hình sự ra tòa theo thủ tục tự tố”처럼 짧게 풉니다.

의미 보존: 제180조가 피고인과 자소인 양쪽의 법정 관계를 다룬다는 범위를 유지합니다. 베트남 형사절차의 기소권 구조를 대만에 대입하지 않습니다.

3. 수정 요구 — ko/en 대표 이미지의 AI 고지 명시

위치: ko/en 14행 `featured_image_caption`.

원문:

- ko: “절차 설명을 위한 가상 이미지이며 실제 조사실이나 사건을 촬영한 사진이 아닙니다.”
- en: “Illustrative generated scene, not a photograph of an actual interview room or case.”

이유: 같은 대표 이미지에 대해 ja/zh/vi는 AI 생성임을 명시하지만 ko는 가상 이미지라고만, en은 generated라고만 씁니다. 정본 `docs/columns/EDITORIAL-VOICE.md`의 미디어 AI 고지 보존 기준에 맞춰 동일하게 드러내야 합니다. 내부 저자 필드와 공개 미디어 고지는 별개입니다.

수정안:

- ko: “절차 설명을 위해 AI로 생성한 이미지이며 실제 조사실이나 사건을 촬영한 사진이 아닙니다.”
- en: “AI-generated illustration, not a photograph of an actual interview room or case.”

의미 보존: 실제 사건·시설 사진이 아니라는 한계는 그대로 두고 생성 수단만 명확히 합니다. 새 이미지 생성은 필요하지 않습니다.

필수 수정과 구분한 편집 제안:

- vi 4·15행 등의 “từ chối lời khai”는 “từ chối cung cấp lời khai”로 다듬으면 ‘진술을 거절/배척한다’는 모호함이 줄어듭니다. FAQ 질문의 “được nghỉ buổi làm chứng”는 “có thể không đến theo giấy triệu tập”로 바꾸면 법적 출석 여부를 바로 묻습니다. 법정 요건과 출석 의무는 보존합니다.
- vi 41행 “khi ngôn ngữ không thông”는 중국어 직역에 가깝습니다. “khi người được hỏi không thể hiểu hoặc giao tiếp bằng ngôn ngữ đang được sử dụng”처럼 언어가 통하지 않는 주체와 상황을 쓰는 편이 명확합니다. 제99·192조 적용 범위는 유지합니다.
- en 37행 “Use Taiwan’s rules for the Taiwan proceeding rather than assuming a familiar American procedural label determines the answer.”는 독자가 제시하지 않은 가정을 반박합니다. 앞의 대만 법률 설명으로 관할은 충분히 분명하므로 삭제 가능합니다. 법적 요건·정보 손실이 없습니다.
- en 27행 “Ignoring a valid summons can have consequences.” 및 vi 27행 “Vắng mặt có thể dẫn đến xử lý.”는 뒤 문장이 구체적으로 설명하는 내용을 예고합니다. 삭제하거나 다음 문장에 합쳐도 사실은 줄지 않습니다. 짧은 문장 비율을 채우기 위한 완충문으로 남길 필요는 없습니다.
- vi SEO 제목 “đi hay xin hoãn?”는 출석과 연기를 자유로운 선택지처럼 나란히 보이게 합니다. “Giấy triệu tập làm chứng ở Đài Loan: nghĩa vụ có mặt và quyền từ chối khai báo”가 본문 전체에 더 잘 맞습니다. 현 본문·FAQ가 신청만으로 면제되지 않음을 설명하므로 이 제목만으로 법률 오류 판정을 내리지는 않았습니다.

문체·단조로움 검증:

공용 도구를 이 검수에서 직접 재실행했습니다. ko/en/ja/zh-hant 모두 exit 0, FAIL 0입니다. 길이 변동계수는 각각 0.452 / 0.525 / 0.457 / 0.527, 짧은 문장 비율은 0.208 / 0.257 / 0.154 / 0.179입니다. ko와 ja의 정중체 어미 비율 WARN은 있었으나, 어미 혼용을 요구하거나 그 경고 자체를 반려 사유로 삼지 않았습니다.

vi는 공용 도구가 지원하지 않으므로 자동 PASS라고 판정하지 않았습니다. 본문을 수기로 읽었고 보조적으로 링크를 벗겨 문장·문단을 분리했습니다. 참고값은 9문단·29문장, 공백 단위 길이 6–35, 변동계수 0.509입니다. 베트남어 공백 단위는 영어 단어와 같지 않으므로 다른 언어의 임계값과 비교하지 않습니다. 문단 시작은 Dòng / Điều / Vắng / Nếu / Người / Điều / Bạn / Biết / Khi로, 세 문단 연속 같은 시작은 없습니다.

MONOTONY: 공통 전개·짧은 완충문 — 다섯 판 모두 신분 확인 → 발행 주체 → 불출석 → 제181·180·183조 → 통역·준비 순서이고 “형사책임이 기준입니다 / The risk must concern criminal exposure / 問題になるのは刑事責任です”가 반복됩니다. 같은 법리를 전달하는 번역 세트라는 점을 고려해 이 사실만으로 반려하지 않았습니다. 위 편집 제안의 무정보 예고문을 정리하고, 후속 402–404까지 같은 문단 틀로 맞추지 않으면 됩니다. 현재 원고에는 자기 점검 2–7의 두 항목 이상 위반이나 도구 FAIL을 근거로 한 별도의 MONOTONY 반려는 없습니다.

자기 점검 5절 재확인: 정형 가상 예시로 시작하지 않습니다. 각 판에 짧은 문장이 두 개 이상 있고 긴 문장만 이어지지 않습니다. 같은 시작의 문단이 세 번 이어지지 않으며, 인용 없는 도입과 준비 문단이 있습니다. 대비 틀은 제한 이내이고, 마지막 본문은 기억과 전달 내용의 구분으로 끝납니다. ko 합니다체·ja です/ます체는 유지되며 굵은 강조 토큰은 5개 모두 0입니다. 실제 상담 경험·검토자 신분을 꾸민 문장은 없습니다. 직전 같은 언어 글 3편의 도입·소제목·끝맺음과도 대조했습니다(ko/en/ja/zh: 345·344·342, vi: 203·070·040). 기존 최근 글의 가상 사례·반박 도입이나 세무 관련 마무리를 복제하지 않았습니다.

첫 두 본문 문단의 삭제 시험에서는 證人의 신분 확인, 해외 체류·일정 충돌, 봉투 보관, 발행 주체, 제175조 문서 범위를 설명하는 문장을 삭제하면 정보가 줄었습니다. “이 글은 그 소환장을 다룹니다” 계열은 범용 전개 예고와 닮았지만, 경찰 연락과 검사·법원 소환장을 구별하는 실제 범위 제한이므로 허용했습니다.

법률·제목·독자 범위에서 확인한 사항:

- 제175조의 발행 주체, 제178조의 적법 소환·정당한 이유 없는 불출석·NT$30,000 상한·법원 과태료 결정은 현행 조문과 맞습니다. 경찰의 단순 연락에 제178조 제재를 직접 적용하지 않습니다.
- 제180조의 관계에 따른 거부와 제181조의 자기 또는 법정 관계인에 대한 형사책임 위험을 구별합니다. 제180조 제2항의 다수 당사자 예외도 남아 있습니다.
- 제99조와 제192조에 따른 증인 통역 근거는 맞고, 특정 국적이면 무조건 통역을 준다는 식으로 쓰지 않습니다.
- 한국·일본·미국·베트남 귀국 상황은 사실을 꾸민 사례가 아닌 조건형 안내입니다. zh는 현지 수령자, 외국인 동료의 통역 문제를 다룹니다. 체류자격 효과·영사 대리·무료 변호사를 보장하지 않습니다.
- 각 판의 제목과 FAQ는 본문 범위 안에 있습니다. 다만 제183조의 FAQ 예외는 위 1번 수정이 필요합니다.
- `author: legal-ai-assistant`, 각 locale의 audience, FAQ 2개, 확인일, 공식 링크가 있습니다. 대표 이미지 파일도 존재합니다. 실제 렌더·이미지 시각 검사·게시판 진입 동선·배포 검증은 이번 원고 검수에 포함하지 않았습니다.

출시 전 별도 확인: `topic: criminal`은 작성자가 미등록 placeholder라고 고지했습니다. 이 값은 현재 공개 taxonomy에 없으므로 그대로 배포하면 안 됩니다. `litigation`과 `criminal-litigation` 태그 기반 5개 언어 게시판을 채택하든 정식 topic을 등록하든, vi 실제 분류·라우팅까지 검증해야 합니다. 이 구현 대기 사항은 위 세 원고 수정 요구와 구분합니다.

직접 열어 대조한 공식 조문: [175](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=175), [178](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=178), [180](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=180), [181](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=181), [183](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=183), [99](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=99), [192](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=192). 위 법적 결론은 중국어 현행 조문을 기준으로 했습니다.
