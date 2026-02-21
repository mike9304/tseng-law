import type { Locale } from '@/lib/locales';

export type FAQItem = {
  question: string;
  answer: string;
};

export const faqContent: Record<Locale, FAQItem[]> = {
  ko: [
    // ── 법인설립 ──
    {
      question: '대만 법인설립은 어떤 절차로 진행되나요?',
      answer:
        '일반적으로 ①투자 허가 신청 → ②회사명 예비심사 → ③자본금 송금 및 심사보고서 → ④회사 등기 → ⑤사업자 등록 → ⑥은행 계좌 개설 순서로 진행됩니다. 업종, 자본금 규모, 주주 구성에 따라 절차가 달라질 수 있으며 사전 설계가 중요합니다.'
    },
    {
      question: '자회사와 지사(분공사) 중 어떤 형태가 유리한가요?',
      answer:
        '자회사(유한회사)는 대만 법인으로 독립 운영이 가능하고, 지사(분공사)는 본사의 연장선으로 별도 자본금이 필요하지만 본사가 직접 책임을 집니다. 세무 처리, 사업 범위, 향후 계획에 따라 적합한 형태가 다르므로 상담을 통해 결정하는 것을 권장합니다.'
    },
    {
      question: '법인설립 후 자본금은 어떻게 회수하나요?',
      answer:
        '사업을 더 이상 운영하지 않을 경우, 해산 및 청산 절차를 통해 잔여 자산을 본국으로 송금할 수 있습니다. 투자 허가 취소, 세무 청산, 은행 계좌 해지 등 순서가 정해져 있으므로 전문가와 함께 진행하는 것이 안전합니다.'
    },
    {
      question: '영업 장소(사무실) 없이도 법인 설립이 가능한가요?',
      answer:
        '회사 등기 시 영업 주소가 필요합니다. 자체 사무실 임대 외에도 공유오피스, 상업용 등기 주소 등의 방법이 있으며, 업종에 따라 실제 영업장 요건이 달라질 수 있습니다.'
    },
    // ── 노동법 ──
    {
      question: '대만에서 직원을 해고할 때 퇴직금(자산비)을 꼭 지급해야 하나요?',
      answer:
        '대만 노동기준법에 따라 해고 시 자산비(資遣費) 지급이 원칙입니다. 다만 자발적 퇴사의 경우에도 고용주 귀책 사유(급여 미지급, 계약 위반 등)가 있으면 퇴직금을 청구할 수 있는 예외가 있으므로 사전에 법적 검토가 필요합니다.'
    },
    {
      question: '의무재직 약정(최저근무기간)은 유효한가요?',
      answer:
        '대만 법원은 의무재직 약정의 유효성을 판단할 때 ①교육훈련 비용의 합리성, ②약정 기간의 적정성, ③위약금의 비례성 등을 종합적으로 검토합니다. 무조건 유효한 것이 아니므로 약정서 작성 시 법적 요건을 충족하도록 설계해야 합니다.'
    },
    // ── 민사·교통사고 ──
    {
      question: '대만에서 교통사고가 나면 어떻게 대응해야 하나요?',
      answer:
        '사고 현장에서 경찰 신고 후 사고 보고서를 받고, 의료기관에서 진단서를 확보하는 것이 우선입니다. 이후 과실 비율 판정, 보험 청구, 손해배상 협의 또는 소송 순서로 진행됩니다. 추월 중 사고 등 과실 판단이 복잡한 경우 전문가 조언이 중요합니다.'
    },
    {
      question: '헬스장이나 시설에서 부상을 당한 경우 손해배상을 청구할 수 있나요?',
      answer:
        '시설 관리자의 안전 관리 의무 위반이 입증되면 손해배상을 청구할 수 있습니다. 소비자보호법, 민법상 불법행위 등 복수의 법적 근거가 적용될 수 있으며, 증거 확보(CCTV, 진단서, 사진 등)가 핵심입니다.'
    },
    // ── 가사·이혼 ──
    {
      question: '한국인이 대만에서 이혼하려면 어떤 절차가 필요한가요?',
      answer:
        '대만에서의 이혼은 ①협의이혼(양측 합의 + 법원 공증)과 ②재판이혼(조정 → 소송)으로 나뉩니다. 한국-대만 간 국제이혼의 경우 준거법, 관할 법원, 재산 분할, 양육권 문제가 복잡해지므로 양국 법률에 모두 익숙한 변호사와 상담하는 것이 중요합니다.'
    },
    {
      question: '대만에서 양육권·친권은 어떻게 결정되나요?',
      answer:
        '대만 법원은 자녀의 최선의 이익을 기준으로 판단하며, 양육 환경, 부모의 경제적 능력, 자녀의 의사 등을 종합적으로 고려합니다. 국제 사건의 경우 자녀의 상거소지 등 국제사법 원칙도 함께 적용됩니다.'
    },
    // ── 형사 ──
    {
      question: '대만에서 형사 사건에 연루되면 어떻게 해야 하나요?',
      answer:
        '수사 단계에서부터 변호사 참여가 가능합니다. 경찰 조사 시 진술권, 묵비권 등 기본 권리를 이해하고, 초기에 법적 전략을 수립하는 것이 결과에 큰 영향을 미칩니다. 특히 외국인의 경우 출국금지, 구속 여부 등 추가 쟁점이 발생할 수 있습니다.'
    },
    // ── 상담·비용 ──
    {
      question: '상담은 어떤 방식으로 진행되나요?',
      answer:
        '대면 상담(타이베이 사무소) 또는 화상 상담(Zoom/Google Meet)이 가능합니다. 한국어와 중국어 모두 상담 가능하며, 사전 예약 후 1시간 단위로 진행됩니다. 상담 전 관련 자료를 미리 보내주시면 더 구체적인 답변이 가능합니다.'
    },
    {
      question: '물류업·화장품 등 특수 업종도 법인설립이 가능한가요?',
      answer:
        '가능합니다. 다만 물류업은 운송업 허가, 화장품은 PIF(제품정보파일) 등록 및 FDA 신고 등 업종별 추가 인허가가 필요합니다. 업종별 규제를 사전에 파악하고 설립 절차와 병행하여 진행해야 시간과 비용을 절약할 수 있습니다.'
    }
  ],
  'zh-hant': [
    // ── 公司設立 ──
    {
      question: '在台灣設立公司的流程是什麼？',
      answer:
        '一般流程為：①投資許可申請 → ②公司名稱預查 → ③資本額匯入及審計報告 → ④公司登記 → ⑤營業登記 → ⑥銀行開戶。依產業、資本規模及股東組成，流程可能有所不同，事前規劃非常重要。'
    },
    {
      question: '子公司與分公司哪種形式較有利？',
      answer:
        '子公司（有限公司）是獨立的台灣法人，可自主經營；分公司則為母公司的延伸，須設置營運資金但由母公司直接負責。稅務處理、業務範圍及未來規劃各有不同，建議透過諮詢決定最適方案。'
    },
    {
      question: '設立公司後，資本額如何回收？',
      answer:
        '若不再經營，可透過解散清算程序將剩餘資產匯回本國。投資許可撤銷、稅務清算、銀行帳戶結清等有既定順序，建議由專業人士協助辦理。'
    },
    {
      question: '沒有辦公室也能設立公司嗎？',
      answer:
        '公司登記需要營業地址。除自行承租辦公室外，也可使用共享辦公空間或商業登記地址，但依產業別可能需要實際營業場所。'
    },
    // ── 勞動法 ──
    {
      question: '在台灣資遣員工一定要付資遣費嗎？',
      answer:
        '依勞動基準法，資遣時原則上需支付資遣費。但即使是自願離職，若雇主有可歸責事由（如欠薪、違約等），勞工仍可請求資遣費，因此需事先進行法律檢視。'
    },
    {
      question: '最低服務年限約定是否有效？',
      answer:
        '台灣法院會綜合考量①教育訓練費用的合理性、②約定期間的適當性、③違約金的比例性來判斷效力。並非當然有效，約定書應在符合法律要件下設計。'
    },
    // ── 民事·交通事故 ──
    {
      question: '在台灣發生交通事故該如何處理？',
      answer:
        '首先在現場報警取得事故報告，並至醫療機構取得診斷證明。之後依序進行過失比例認定、保險理賠、和解或訴訟。超車事故等過失判斷複雜的案件，建議尋求專業協助。'
    },
    {
      question: '在健身房或場所設施受傷，可以請求損害賠償嗎？',
      answer:
        '若能證明設施管理者違反安全管理義務，即可請求損害賠償。消費者保護法、民法侵權行為等多項法律依據皆可能適用，蒐集證據（監視器畫面、診斷書、照片等）是關鍵。'
    },
    // ── 家事·離婚 ──
    {
      question: '韓國人在台灣離婚需要什麼程序？',
      answer:
        '台灣離婚分為①協議離婚（雙方合意＋法院公證）與②裁判離婚（調解→訴訟）。韓台跨國離婚涉及準據法、管轄法院、財產分割及親權等問題，建議諮詢熟悉兩國法律的律師。'
    },
    {
      question: '台灣的親權（監護權）如何判定？',
      answer:
        '台灣法院以子女最佳利益為原則，綜合考量養育環境、父母經濟能力、子女意願等因素。跨國案件還須適用國際私法中的慣常居所等原則。'
    },
    // ── 刑事 ──
    {
      question: '在台灣被牽涉刑事案件該怎麼辦？',
      answer:
        '偵查階段即可委任律師陪偵。了解警詢時的陳述權、緘默權等基本權利，並在初期建立法律策略，對結果有重大影響。外國人另需注意限制出境、羈押等議題。'
    },
    // ── 諮詢·費用 ──
    {
      question: '諮詢方式如何進行？',
      answer:
        '可選擇面談（台北事務所）或視訊諮詢（Zoom/Google Meet）。韓語與中文皆可諮詢，須事先預約，以一小時為單位。若事先提供相關資料，可獲得更具體的建議。'
    },
    {
      question: '物流業、化妝品等特殊產業也能設立公司嗎？',
      answer:
        '可以，但物流業需取得運輸許可，化妝品須完成 PIF（產品資訊檔案）登錄及 FDA 備查等產業別額外許可。事前掌握產業法規並與設立程序同步進行，可節省時間與成本。'
    }
  ],
  en: [
    // ── Company Setup ──
    {
      question: 'What is the process for setting up a company in Taiwan?',
      answer:
        'The general process is: (1) investment permit application, (2) company name pre-check, (3) capital remittance and audit report, (4) company registration, (5) business registration, and (6) bank account opening. Steps may vary depending on the industry, capital size, and shareholder structure, so planning ahead is important.'
    },
    {
      question: 'Which is better: a subsidiary or a branch office?',
      answer:
        'A subsidiary (limited company) operates as an independent Taiwanese entity, while a branch is an extension of the parent company with its own operating funds but direct parent liability. Tax treatment, business scope, and future plans differ for each, so we recommend consulting to determine the best fit.'
    },
    {
      question: 'How can I recover the invested capital after incorporation?',
      answer:
        'If you no longer wish to operate, the remaining assets can be remitted back to your home country through dissolution and liquidation procedures. There is a set sequence of investment permit cancellation, tax clearance, and bank account closure, so professional assistance is recommended.'
    },
    {
      question: 'Can I incorporate without having a physical office?',
      answer:
        'A business address is required for company registration. In addition to renting your own office, co-working spaces or commercial registered addresses are available, though some industries may require actual business premises.'
    },
    // ── Labor Law ──
    {
      question: 'Is severance pay mandatory when terminating an employee in Taiwan?',
      answer:
        'Under the Labor Standards Act, severance pay is generally required upon termination. Even in cases of voluntary resignation, if the employer is at fault (unpaid wages, contract violations, etc.), the employee may still claim severance, so prior legal review is advisable.'
    },
    {
      question: 'Are minimum service period agreements enforceable?',
      answer:
        'Taiwan courts evaluate enforceability based on (1) the reasonableness of training costs, (2) the appropriateness of the commitment period, and (3) the proportionality of penalties. These agreements are not automatically valid and should be carefully designed to meet legal requirements.'
    },
    // ── Civil / Traffic Accidents ──
    {
      question: 'What should I do if I have a traffic accident in Taiwan?',
      answer:
        'First, call the police at the scene and obtain an accident report, then secure a medical certificate from a hospital. Next steps include fault ratio assessment, insurance claims, and settlement negotiations or litigation. For complex cases such as overtaking accidents, professional guidance is important.'
    },
    {
      question: 'Can I claim damages for an injury at a gym or facility?',
      answer:
        'If the facility manager\'s breach of safety obligations can be proven, you may claim damages. Multiple legal bases including the Consumer Protection Act and tort liability under the Civil Code may apply. Evidence collection (CCTV, medical certificates, photos) is key.'
    },
    // ── Family / Divorce ──
    {
      question: 'What procedures does a Korean national need for divorce in Taiwan?',
      answer:
        'Divorce in Taiwan is either (1) by mutual agreement (both parties consent + court notarization) or (2) judicial divorce (mediation then litigation). International divorce between Korea and Taiwan involves complex issues of applicable law, jurisdiction, property division, and custody, so consulting a lawyer familiar with both legal systems is essential.'
    },
    {
      question: 'How is child custody determined in Taiwan?',
      answer:
        'Taiwan courts decide based on the best interests of the child, considering the parenting environment, parents\' financial capacity, and the child\'s wishes. In international cases, private international law principles such as habitual residence also apply.'
    },
    // ── Criminal ──
    {
      question: 'What should I do if involved in a criminal case in Taiwan?',
      answer:
        'You can have a lawyer present from the investigation stage. Understanding your basic rights during police questioning—such as the right to make statements and the right to remain silent—and establishing a legal strategy early can significantly affect the outcome. Foreign nationals should also be aware of potential travel bans and detention issues.'
    },
    // ── Consultation ──
    {
      question: 'How are consultations conducted?',
      answer:
        'We offer in-person consultations (Taipei office) or video consultations (Zoom/Google Meet). Both Korean and Chinese are available. Appointments are required and scheduled in one-hour units. Sending relevant documents in advance allows for more detailed advice.'
    },
    {
      question: 'Can you help with company setup for specialized industries like logistics or cosmetics?',
      answer:
        'Yes, but additional industry-specific permits are required—transport permits for logistics, PIF (Product Information File) registration and FDA notification for cosmetics, etc. Understanding industry regulations beforehand and processing them alongside incorporation saves time and cost.'
    }
  ]
};
