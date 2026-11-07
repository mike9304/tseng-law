import type { SiteLocale } from '@/lib/locales';

export type FAQItem = {
  question: string;
  answer: string;
};

export const faqContent: Record<SiteLocale, FAQItem[]> = {
  ko: [
    // ── 법인설립 ──
    {
      question: '대만 법인설립은 어떤 절차로 진행되나요?',
      answer:
        '일반적으로 회사명과 사업목적의 예비심사를 먼저 하고, 외국인 투자 승인 대상이면 승인을 신청합니다. 이어 설립준비 계좌를 개설해 자본금을 송금하고, 해당되는 투자금액 심사와 회계사의 자본금 확인을 거쳐 회사 등기를 진행합니다. 세무 등록과 정식 계좌 전환도 함께 준비합니다. 필요한 인허가와 실제 진행 순서는 주주 구성, 업종, 은행 심사에 따라 달라집니다.'
    },
    {
      question: '자회사와 지사(분공사) 중 어떤 형태가 유리한가요?',
      answer:
        '대만 자회사는 별도로 설립한 대만 법인이며, 유한회사나 주식회사 등의 형태를 선택할 수 있습니다. 대만 지점(분공사)은 외국 회사의 일부로, 별도 법인격이 없고 지점의 채무는 외국 본사가 부담합니다. 지점 설립 시에는 대만 영업에 사용할 전용 운영자금도 배정해야 합니다. 책임 범위, 세무, 자금 조달과 향후 사업 계획을 비교해 형태를 정합니다.'
    },
    {
      question: '법인설립 후 자본금은 어떻게 회수하나요?',
      answer:
        '회사에 납입한 자본금을 주주가 임의로 인출할 수는 없습니다. 투자에서 철수할 때는 지분 양도, 감자, 해산·청산 등 상황에 맞는 방법을 검토합니다. 사업을 종료한다면 통상 청산을 거쳐 채무와 세금을 정리한 뒤 남은 재산을 분배합니다. 외국인 투자자는 해당되는 투자 신고·승인과 해외 송금 절차도 확인해야 하며, 필요한 서류는 철수 방법에 따라 달라집니다.'
    },
    {
      question: '영업 장소(사무실) 없이도 법인 설립이 가능한가요?',
      answer:
        '회사 등기 시 영업 주소가 필요합니다. 자체 사무실 임대 외에도 공유오피스, 상업용 등기 주소 등의 방법이 있으며, 업종에 따라 실제 영업장 요건이 달라질 수 있습니다.'
    },
    // ── 노동법 ──
    {
      question: '대만에서 근로계약이 종료되면 퇴직금(資遣費)을 항상 지급해야 하나요?',
      answer:
        '항상 그런 것은 아닙니다. 사용자가 대만 노동기준법 제11조, 제13조 단서 또는 제20조 등에 따라 근로계약을 종료하거나, 근로자가 제14조의 법정 사유에 따라 계약을 종료하는 경우에는 원칙적으로 퇴직금(資遣費)을 지급해야 합니다. 반면 제12조에 따른 징계해고에는 원칙적으로 퇴직금이 발생하지 않고, 통상적인 자진 퇴사도 곧바로 지급 대상이 되지는 않습니다. 종료 사유, 예고, 지급기한과 신제·구제 적용을 개별적으로 확인해야 합니다.'
    },
    {
      question: '대만 근로계약의 최소 근무기간 약정은 자동으로 무효인가요?',
      answer:
        '아닙니다. 대만 근로기준법 제15조의1에 따르면 사용자가 전문기술 훈련을 실시하고 비용을 부담했거나, 근로자가 최소 근무기간을 지키도록 합리적 보상을 제공한 경우에는 최소 근무기간 약정의 법정 요건을 충족할 수 있습니다. 두 요건을 모두 갖추어야 하는 것은 아니지만, 어느 한 요건이 있더라도 훈련 기간과 비용, 대체인력 가능성, 보상의 금액과 범위 등 전체 사정에 비추어 약정이 합리적 범위를 넘지 않아야 합니다. 다만 근로자에게 책임을 물을 수 없는 사유로 약정 기간이 끝나기 전에 근로계약이 종료되면, 약정 위반이나 훈련비 반환에 대한 책임을 지지 않습니다.'
    },
    // ── 민사·교통사고 ──
    {
      question: '대만에서 교통사고가 나면 어떻게 대응해야 하나요?',
      answer:
        '먼저 현장의 안전을 확보하고 부상자에게 필요한 구호 조치를 한 뒤 경찰에 신고하세요. 안전한 범위에서 현장 사진·영상과 상대방 정보를 확보하고, 다쳤다면 진료를 받아 진단서와 영수증을 보관합니다. 보험사에도 사고를 알리고, 경찰 기록은 정해진 시기에 신청해 받습니다. 과실 판단, 보험 청구, 합의나 소송은 사고 상황에 따라 진행하며 반드시 같은 순서를 거치는 것은 아닙니다.'
    },
    {
      question: '헬스장이나 시설에서 부상을 당한 경우 손해배상을 청구할 수 있나요?',
      answer:
        '시설이나 서비스의 안전상 결함 또는 관리상 과실 때문에 부상과 손해가 발생했다면, 대만 소비자보호법이나 민법에 따른 배상 청구를 검토할 수 있습니다. 사고 원인, 손해, 인과관계와 책임 주체에 따라 적용할 법적 근거가 달라집니다. CCTV·현장 사진·진단서·영수증 등은 원본과 촬영·작성 시점을 확인할 수 있도록 보관해 두세요.'
    },
    // ── 가사·이혼 ──
    {
      question: '한국인이 대만에서 이혼하려면 어떤 절차가 필요한가요?',
      answer:
        '먼저 대만에서 이혼 절차를 진행할 수 있는지와 어느 나라 법이 적용되는지 확인해야 합니다. 대만 민법이 적용되는 협의이혼은 서면 합의, 증인 2명 이상의 서명, 호정기관(戶政機關)의 이혼등기가 필요하며 법원 공증은 요건이 아닙니다. 법원 조정·화해나 판결로 이혼이 성립할 수도 있고, 재판상 이혼은 원칙적으로 소송에 앞서 가사조정을 거칩니다. 한국에서도 이혼을 인정받고 신고하는 문제, 재산 분할과 자녀 문제는 별도로 확인합니다.'
    },
    {
      question: '대만에서 양육권·친권은 어떻게 결정되나요?',
      answer:
        '대만 민법이 적용되는 이혼에서는 부모가 미성년 자녀에 대한 권리·의무를 한쪽 또는 양쪽이 맡도록 협의할 수 있습니다. 협의가 되지 않거나 협의 내용이 자녀에게 불리하면 법원이 자녀의 최선의 이익을 기준으로 정합니다. 이때 양육 환경, 부모와 자녀의 관계, 자녀의 의사 등을 종합적으로 고려합니다. 국제 사건은 관할과 적용 법률을 따로 확인해야 하며, 대만 국제사법상 부모·자녀의 법률관계에는 원칙적으로 자녀의 국적법이 적용됩니다.'
    },
    // ── 형사 ──
    {
      question: '대만에서 형사 사건에 연루되면 어떻게 해야 하나요?',
      answer:
        '출석 통지를 받았다면 어떤 신분으로 언제, 어디에 출석해야 하는지 먼저 확인하세요. 피의자나 피고인은 수사 단계부터 변호인을 선임하고, 진술을 거부하거나 자신에게 유리한 증거의 조사를 요청할 수 있습니다. 언어가 통하지 않으면 통역의 도움을 받아야 합니다. 이미 체포·구속되었거나 출국이 제한되었다면 구제 절차와 기한도 확인해야 합니다.'
    },
    // ── 상담·비용 ──
    {
      question: '상담은 어떤 방식으로 진행되나요?',
      answer:
        '대면 상담(타이베이 사무소) 또는 화상 상담(Zoom/Google Meet)이 가능합니다. 한국어·중국어·일본어·영어 모두 상담 가능하며, 사전 예약 후 1시간 단위로 진행됩니다. 상담 자료는 변호사의 안내에 따라 준비해 주세요.'
    },
    {
      question: '물류업·화장품 등 특수 업종도 법인설립이 가능한가요?',
      answer:
        '설립 가능 여부와 필요한 인허가는 실제 사업 내용에 따라 확인해야 합니다. 예를 들어 직접 화물자동차 운송업을 하려면 설립 준비 승인과 영업허가가 필요하며, 외국인 투자자는 투자 제한도 확인해야 합니다. 창고 보관·포장·주선 등 모든 물류 서비스에 같은 운송업 허가가 필요한 것은 아닙니다. 법령상 대상인 화장품 제조·수입업자는 해당 제품의 공급·판매·증정·공개 진열·체험 제공 전에 제품등록(產品登錄)을 마쳐야 합니다. 제품정보파일(PIF)은 별도로 작성·갱신하여 제품에 표시된 주소에 보관하고 검사에 대비하며, PIF 자체를 당국에 등록하지는 않습니다. 공장등록이 면제되는 제조장소에서 생산한 고형 수제비누에는 제외 규정이 있습니다.'
    }
  ],
  'zh-hant': [
    // ── 公司設立 ──
    {
      question: '在台灣設立公司的流程是什麼？',
      answer:
        '一般先辦理公司名稱及所營事業預查；涉及僑外投資時，再依適用規定申請投資核准。接著開立公司籌備處帳戶、匯入資本，辦理適用的投資額審定及會計師資本額查核，再辦理公司登記，並配合完成稅籍及正式帳戶相關手續。特許行業另有許可要求，實際程序須依股東身分與營業項目確認。'
    },
    {
      question: '子公司與分公司哪種形式較有利？',
      answer:
        '在台子公司是另行設立的法人，常見形式包括有限公司與股份有限公司；外國公司的在台分公司則是其分支機構，不是另一個法人，責任由外國本公司承擔。選擇時可比較責任範圍、稅務、資金安排與日後營運計畫。外國公司設立在台分公司，另須撥付專用營運資金。'
    },
    {
      question: '設立公司後，資本額如何回收？',
      answer:
        '投入公司的資金不能在設立後任意取回。退出投資可依情況採股權轉讓、減資或解散清算等方式；若公司不再經營，通常須經清算，清償債務並處理稅務後，才能分配剩餘財產。外國投資人還須依適用規定辦理投資及款項匯出手續，所需文件會因退出方式而不同。'
    },
    {
      question: '沒有辦公室也能設立公司嗎？',
      answer:
        '公司登記需要營業地址。除自行承租辦公室外，也可使用共享辦公空間或商業登記地址，但依產業別可能需要實際營業場所。'
    },
    // ── 勞動法 ──
    {
      question: '在台灣終止勞動契約，一定要給付資遣費嗎？',
      answer:
        '不一定。雇主因歇業、業務緊縮等法定事由資遣員工時，原則上要給付；勞工因欠薪等事由依《勞動基準法》第14條合法終止契約，也可請求資遣費。一般自願離職，或雇主依第12條合法解僱，則不會當然產生資遣費。金額與給付期限仍須依終止事由、年資及適用的新舊制確認。'
    },
    {
      question: '最低服務年限約定是否有效？',
      answer:
        '要先看是否符合《勞動基準法》第15條之1：雇主須為勞工提供專業技術培訓並負擔費用，或為最低服務年限約定提供合理補償。即使符合其中一項，約定仍須在合理範圍內，並考量培訓期間及成本、人力替補可能性、補償內容等因素。若契約因不可歸責於勞工的原因而提前終止，勞工不負違反最低服務年限約定或返還訓練費用的責任。'
    },
    // ── 民事·交通事故 ──
    {
      question: '在台灣發生交通事故該如何處理？',
      answer:
        '先確保現場安全，有人受傷時優先聯絡119救護，並撥110報警。在安全情況下保留照片、行車紀錄器影像及目擊者資料，儘速通知保險公司；受傷者應就醫並保存診斷證明與費用單據。事故資料可事後向警方申請，再依證據與保險內容處理責任、理賠及和解；有爭議時可考慮調解或訴訟。'
    },
    {
      question: '在健身房或其他場所受傷，可以請求損害賠償嗎？',
      answer:
        '有可能，但須確認事故原因、損害及兩者的關聯。若設施或服務欠缺應有的安全性，或經營者、管理者有過失，可能依《消費者保護法》或民法請求賠償。請保留現場照片、監視器影像、診斷證明書及醫療費用單據，供判斷責任與賠償範圍。'
    },
    // ── 家事·離婚 ──
    {
      question: '韓國人在台灣離婚需要什麼程序？',
      answer:
        '須先確認離婚應適用哪一國法律；若向台灣法院提出請求，還須確認法院有無管轄權。適用台灣民法時，協議離婚須有書面、二人以上證人簽名，並向戶政機關辦理登記，並非必須經法院公證。另可透過法院調解、和解或判決離婚。跨國案件還須分別處理夫妻財產、未成年子女安排，以及另一國的承認與登記。'
    },
    {
      question: '台灣的親權（監護權）如何判定？',
      answer:
        '適用台灣法時，離婚父母可先協議由一方或雙方共同行使、負擔未成年子女的權利義務。協議不成或協議不利於子女時，法院會依子女最佳利益處理，考量照顧情形、親子關係、子女意願及父母的生活狀況等。涉外案件還須分別確認法院管轄與準據法；父母子女間的法律關係，原則上依子女的本國法。'
    },
    // ── 刑事 ──
    {
      question: '在台灣涉及刑事案件，該怎麼辦？',
      answer:
        '收到通知後，先確認應訊身分、時間與地點。若是被告或犯罪嫌疑人，可在警詢或偵查階段委任辯護律師，並依法行使緘默權、請求調查有利證據；語言不通時，應由通譯協助。若已遭逮捕、羈押或限制出境，須另行確認救濟程序及期限。'
    },
    // ── 諮詢·費用 ──
    {
      question: '有哪些諮詢方式？',
      answer:
        '可選擇面談（台北事務所）或視訊諮詢（Zoom/Google Meet）。可使用中文、韓文、日文或英文，須事先預約，以一小時為單位。諮詢前可依律師指示準備相關資料。'
    },
    {
      question: '物流業、化粧品等特殊產業也能設立公司嗎？',
      answer:
        '可申請設立，但須依實際營業項目確認資格與許可。例如經營汽車貨運，須取得籌備核准，並在領得營業執照後營業；外國投資人另須確認投資限制。化粧品製造或輸入業者，須在適用產品供應、販售、贈送、公開陳列或提供試用前完成產品登錄，並自行建立、更新及保存產品資訊檔案（PIF）供查核。免辦工廠登記的製造場所所生產的固態手工香皂，另有排除規定。'
    }
  ],
  en: [
    // ── Company Setup ──
    {
      question: 'What is the process for setting up a company in Taiwan?',
      answer:
        'Company setup usually starts with a name and business-activity pre-check, followed by foreign investment approval where required. A preparatory account is then opened for the capital remittance. The process includes any applicable investment-amount verification, CPA certification of capital, and company registration, alongside tax registration and conversion to an operating account. The permits, documents and timing depend on the investors, business activities and bank review.'
    },
    {
      question: 'Which is better: a subsidiary or a branch office?',
      answer:
        'A Taiwan subsidiary is a separate legal entity. Common forms include a limited company and a company limited by shares. A Taiwan branch forms part of the foreign company, which is responsible for the branch\'s debts; it does not have separate legal personality. The foreign company must also allocate funds specifically for the branch\'s Taiwan operations. Liability, tax, funding and future business plans all matter when choosing between them.'
    },
    {
      question: 'How can I recover the invested capital after incorporation?',
      answer:
        'Shareholders cannot freely withdraw paid-in capital after incorporation. Depending on the circumstances, an investor may exit through a share transfer, capital reduction, or dissolution and liquidation. If the business closes, debts and tax obligations normally need to be settled before the remaining assets can be distributed. Foreign investors must also complete the applicable investment and remittance procedures; the documents depend on the exit route.'
    },
    {
      question: 'Can I incorporate without having a physical office?',
      answer:
        'A business address is required for company registration. In addition to renting your own office, co-working spaces or commercial registered addresses are available, though some industries may require actual business premises.'
    },
    // ── Labor Law ──
    {
      question: 'Is severance always required when an employment contract ends in Taiwan?',
      answer:
        'Not always. Severance is generally required when an employer terminates under Article 11, the proviso to Article 13, Article 20, or another qualifying provision, and when a worker terminates on a statutory ground under Article 14. It is generally not required for a disciplinary termination under Article 12, and an ordinary voluntary resignation does not automatically trigger severance. The legal ground, notice, payment deadline, and service under the new and old systems must be reviewed separately.'
    },
    {
      question: 'Is a minimum-service-period clause in Taiwan automatically void?',
      answer:
        'No. Under Article 15-1 of Taiwan\'s Labor Standards Act, a clause may satisfy the statutory threshold if the employer either provides professional skills training at its own expense or provides reasonable compensation for the worker\'s commitment to the minimum service period. The two grounds are alternatives, not cumulative requirements. Even if one exists, the period and burden must remain within a reasonable scope under the four statutory factors. If the employment contract ends before the agreed period for a reason not attributable to the worker, the worker is not liable for breach of the commitment or repayment of training costs.'
    },
    // ── Civil / Traffic Accidents ──
    {
      question: 'What should I do if I have a traffic accident in Taiwan?',
      answer:
        'Make the scene safe, arrange help for anyone injured, and notify the police. Where safe, preserve photos, video and the other party\'s details. Get medical treatment for injuries and keep medical records and receipts. Notify your insurer and request police records when they become available. Fault assessment, insurance claims, settlement and litigation depend on the circumstances; they do not have to follow a single sequence.'
    },
    {
      question: 'Can I claim damages for an injury at a gym or facility?',
      answer:
        'A claim may be available under Taiwan\'s Consumer Protection Act or Civil Code if unsafe facilities or services, or negligent management, caused an injury and loss. The cause of the accident, the loss, the causal connection and the responsible parties determine which legal grounds apply. Preserve CCTV footage, photographs, medical records, receipts and relevant communications.'
    },
    // ── Family / Divorce ──
    {
      question: 'What is the process for a foreign national to divorce in Taiwan?',
      answer:
        'First establish whether the divorce can proceed in Taiwan and which law applies. If Taiwan\'s Civil Code applies, a consensual divorce requires a written agreement, signatures from at least two witnesses and registration with the household administration authority; court notarization is not required. Divorce can also result from court mediation, a court settlement or a judgment. A court divorce generally goes through family mediation first. Recognition or registration abroad, property division and arrangements for children need separate attention.'
    },
    {
      question: 'How is child custody determined in Taiwan?',
      answer:
        'Where Taiwan\'s Civil Code applies, divorcing parents may agree that one or both will exercise parental rights and responsibilities. If they cannot agree, or the agreement is harmful to the child, the court decides based on the child\'s best interests, including the care environment, family relationships and the child\'s wishes. International cases require separate checks of jurisdiction and applicable law. Under Taiwan\'s choice-of-law rules, the parent–child legal relationship is generally governed by the law of the child\'s nationality.'
    },
    // ── Criminal ──
    {
      question: 'What should I do if involved in a criminal case in Taiwan?',
      answer:
        'If you receive a summons or notice to attend, check your role in the case and the time and place. Suspects and defendants can appoint defense counsel during an investigation, remain silent and request the investigation of evidence in their favor. An interpreter should assist where there is a language barrier. If you have been arrested, detained or placed under an exit restriction, check the available remedies and their deadlines.'
    },
    // ── Consultation ──
    {
      question: 'How are consultations conducted?',
      answer:
        'We offer in-person consultations (Taipei office) or video consultations (Zoom/Google Meet). Consultations are available in English, Chinese, Korean, and Japanese. Appointments are required and scheduled in one-hour units. Start with a brief summary of the matter; other documents can follow after attorney instructions.'
    },
    {
      question: 'Can you help with company setup for specialized industries like logistics or cosmetics?',
      answer:
        'Eligibility and permits depend on the actual business activities. Road freight operations, for example, require preparation approval and an operating licence; foreign investors must also check investment restrictions. Warehousing, packaging and forwarding do not all fall under that same transport permit. For regulated cosmetics, covered manufacturers or importers must complete product notification before supply, sale, gifting, public display or trial use. They must separately create, update and retain the Product Information File (PIF) at the labelled address for inspection; the PIF itself is not filed with the authority. Solid handmade soap produced at premises exempt from factory registration is excluded from these notification and PIF requirements.'
    }
  ],
  ja: [
    // ── 会社設立 ──
    {
      question: '台湾での会社設立はどのような手続きで進みますか？',
      answer:
        '外国投資による台湾子会社では、一般に①会社の中国語名称・営業項目の予備審査、②該当する外国投資許可、③設立準備口座の開設と国外からの資金送金、④資本額の確認・投資額審定、⑤会社設立登記、⑥税籍登記、⑦口座の正式切替えを行います。業種別許認可、投資者の属性、銀行審査などにより順序や追加書類は変わるため、これはすべての案件に共通する固定的な順序ではありません。'
    },
    {
      question: '台湾子会社と台湾支店（分公司）は、どのように選べばよいですか？',
      answer:
        '台湾子会社は台湾法上の独立法人で、株主は原則として出資額を限度に責任を負います。台湾支店（分公司）は外国会社の一部で独立法人格を持たず、支店の債務は外国会社の債務となり、台湾での営業に用いる資金を本店から割り当て、その資金を台湾での営業にのみ使用する必要があります。税務、利益送金、共同出資、資金調達、許認可、撤退方法まで比較して選びます。'
    },
    {
      question: '会社設立後、資本金はどのように回収できますか？',
      answer:
        '払込済みの資本金を株主が自由に引き出すことはできません。会社を存続させる場合は、会社形態に応じた減資、適法な配当、実在する借入金の返済など、それぞれの法的・税務上の要件を確認します。持分譲渡による退出は、会社からの資本金返還とは別です。事業を恒久的に終了する場合は、原則として解散・清算を行い、債務と租税を処理した後の残余財産を株主へ分配し、外国投資・送金・銀行手続を別途確認します。'
    },
    {
      question: '専用オフィスがなくても台湾で会社を設立できますか？',
      answer:
        '会社登記には本店所在地が必要で、賃貸借契約書、所有者の使用同意書など、その住所を使用できることを示す資料が求められます。シェアオフィス等を利用できる場合もありますが、登記住所を借りただけで全ての事業を行えるわけではありません。土地使用分区、建築・消防、賃貸条件および業種別の実際の営業場所要件を事前に確認してください。台北市では対象となる登記について営業場所事前照会も必要です。'
    },
    // ── 労働法 ──
    {
      question: '台湾で従業員との労働契約を終了する場合、退職金（資遣費）は必ず必要ですか？',
      answer:
        '必ずではありません。雇用主が労働基準法第11条、第13条但書または第20条等に基づいて契約を終了する場合や、労働者が同法第14条の法定事由に基づいて契約を終了する場合は、資遣費が必要となります。一方、同法第12条の懲戒解雇では原則として資遣費は不要で、通常の自己都合退職も直ちに資遣費の対象にはなりません。終了理由、予告、支払期限および新旧退職金制度の適用を個別に確認してください。'
    },
    {
      question: '最低勤務期間（台湾法上の「最低服務年限」）の合意は有効ですか？',
      answer:
        '雇用主が専門技術訓練を行って費用を負担した場合、または勤務継続のための合理的な補償を提供した場合に限り、最低勤務期間を定めることができます。さらに、訓練の期間・費用、同種人材の代替可能性、補償の金額・範囲その他の事情から合理的な範囲内でなければならず、要件に反する合意は無効です。労働者の責めに帰すことのできない理由で期間満了前に契約が終了した場合、違約責任や訓練費返還責任は負いません。'
    },
    // ── 民事・交通事故 ──
    {
      question: '台湾で交通事故が起きたら、まず何をすべきですか？',
      answer:
        '安全の確保と負傷者の救護を優先し、警察へ通報して、法令に従って車両位置・現場痕跡・写真・映像・相手方情報を保全してください。負傷がある場合は医療機関を受診し、診断書や費用資料も保管します。警察資料は所定の時期に申請して取得し、保険会社への通知、事故鑑定、示談または訴訟は事故状況に応じて検討します。これらは常に一律の順序で進むわけではありません。'
    },
    {
      question: '台湾のジムや施設でけがをした場合、損害賠償を請求できますか？',
      answer:
        '施設が提供するサービスが合理的に期待される安全性を欠き、その欠陥または管理上の過失によって負傷・損害が生じた場合、消費者保護法や民法に基づく賠償請求を検討できます。責任の成否は、安全性の欠如・過失、因果関係、損害の立証などにより決まります。CCTV、現場写真、診断書、領収書、利用規約、当日の連絡記録を早めに保全してください。'
    },
    // ── 家事・離婚 ──
    {
      question: '外国籍の方が台湾で離婚する場合、どのような手続きが必要ですか？',
      answer:
        '台湾法が適用される合意離婚は、書面で行い、2名以上の証人が署名し、戸政機関で離婚登記をする必要があります。裁判による離婚は、原則として裁判前に家事調停を経ます。国際離婚では、台湾で手続できるか、どの法が適用されるか、関係する国・地域での届出・承認、財産分与、未成年の子の親権・扶養を個別に確認してください。'
    },
    {
      question: '台湾で未成年の子の親権・監護はどのように決まりますか？',
      answer:
        '台湾の裁判所は子の最善の利益を基準に、子の年齢・健康・意思・人格発達上の必要、父母の職業・健康・経済状況・養育の意思、親子関係、他方の親の関与を妨げる行為の有無など一切の事情を考慮します。経済力だけで決まるものではありません。国際案件では、準拠法、管轄、外国判決の承認・執行なども個別に確認します。'
    },
    // ── 刑事 ──
    {
      question: '台湾で刑事事件に関与した場合、どうすればよいですか？',
      answer:
        '被疑者（台湾法上の「犯罪嫌疑人」）は捜査段階から弁護人を選任できます。警察・検察の取調べ前には、被疑事実と罪名、黙秘できること、弁護人を選任できること、有利な証拠の調査を求められることが告知されます。言語が通じない場合は通訳の対象となります。出国・出海の制限（台湾法上の「限制出境・出海」）や勾留（同「羈押」）は、外国人であるだけで自動的に行われるものではなく、法定要件と個別の処分を要するため、早い段階で事実と証拠を整理してください。'
    },
    // ── 相談・費用 ──
    {
      question: '相談はどのような方式で行われますか？',
      answer:
        '台北事務所での対面相談またはビデオ通話による相談に対応しており、日本語・中国語・英語・韓国語で相談できます。一般法律相談は事前予約制で、現在の料金案内では1時間単位です。まずは案件の簡潔な概要をお送りください。その他の資料は弁護士の案内後にご提出ください。連絡はメールから行えます。'
    },
    {
      question: '物流・化粧品などの規制業種でも台湾で会社を設立できますか？',
      answer:
        '会社を設立できるかと、当該事業を開始できるかは別に確認します。「物流」は広い概念で、倉庫・梱包・取次ぎなどと、自ら報酬を受けて貨物自動車で運送する「自動車貨物運送業」（汽車貨運業）では規制が異なります。自動車貨物運送業には、道路運送を所管する機関（公路主管機関）による設立準備許可（籌設許可）・営業免許等が必要です。化粧品は、対象となる製造・輸入業者が供給等の開始前に製品登録を行い、対象製品のPIFを作成・更新して法定の住所に保存します。PIFは当局へ登録・届出するものではありません。'
    }
  ]
};
