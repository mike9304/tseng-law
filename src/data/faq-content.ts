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
      question: '대만에서 근로계약이 종료되면 퇴직금(資遣費)을 항상 지급해야 하나요?',
      answer:
        '항상 그런 것은 아닙니다. 사용자가 대만 노동기준법 제11조, 제13조 단서 또는 제20조 등에 따라 근로계약을 종료하거나, 근로자가 제14조의 법정 사유에 따라 계약을 종료하는 경우에는 원칙적으로 퇴직금(資遣費)을 지급해야 합니다. 반면 제12조에 따른 징계해고에는 원칙적으로 퇴직금이 발생하지 않고, 통상적인 자진 퇴사도 곧바로 지급 대상이 되지는 않습니다. 종료 사유, 예고, 지급기한과 신제·구제 적용을 개별적으로 확인해야 합니다.'
    },
    {
      question: '대만 근로계약의 최소 근무기간 약정은 자동으로 무효인가요?',
      answer:
        '아닙니다. 대만 근로기준법 제15조의1에 따르면 사용자가 전문기술 훈련을 실시하고 비용을 부담했거나, 근로자가 최소 근무기간을 지키도록 합리적 보상을 제공한 경우에는 최소 근무기간 약정의 법정 요건을 충족할 수 있습니다. 두 요건을 모두 갖추어야 하는 것은 아니지만, 어느 한 요건이 있더라도 훈련 기간과 비용, 대체인력 가능성, 보상의 금액과 범위 등 전체 사정에 비추어 약정이 합리적 범위를 넘지 않아야 합니다.'
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
        '대만에서의 이혼은 ①협의이혼(서면 합의, 2명 이상의 증인 서명, 호정기관(戶政機關)에 이혼등기)과 ②재판이혼(조정 → 소송)으로 나뉩니다. 한국-대만 간 국제이혼의 경우 준거법, 관할 법원, 재산 분할, 양육권 문제가 복잡해지므로 양국 법률에 모두 익숙한 변호사와 상담하는 것이 중요합니다.'
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
        '대면 상담(타이베이 사무소) 또는 화상 상담(Zoom/Google Meet)이 가능합니다. 한국어·중국어·일본어 모두 상담 가능하며, 사전 예약 후 1시간 단위로 진행됩니다. 상담 전 관련 자료를 미리 보내주시면 더 구체적인 답변이 가능합니다.'
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
      question: '在台灣終止勞動契約時，一定要給付資遣費嗎？',
      answer:
        '不一定。雇主依《勞動基準法》第11條、第13條但書或第20條等規定終止契約，或勞工依第14條法定事由終止契約時，原則上應給付資遣費。依第12條懲戒解僱時原則上無須給付，通常的自願離職也不會當然產生資遣費。仍應就終止事由、預告、給付期限及新舊制年資分別確認。'
    },
    {
      question: '台灣勞動契約中的最低服務年限約定，是否一律無效？',
      answer:
        '不是。依《勞動基準法》第15條之1，雇主為勞工進行專業技術培訓並負擔其費用，或為使勞工遵守最低服務年限約定而提供合理補償時，約定才可能具備法定基礎。兩者不必同時具備；即使符合其中一項，仍須綜合培訓期間及成本、人力替補可能性、補償額度及範圍等因素，確認約定未逾合理範圍。'
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
        '台灣離婚分為①協議離婚（應以書面為之，經二人以上證人簽名，並向戶政機關辦理離婚登記）與②裁判離婚（調解→訴訟）。韓台跨國離婚涉及準據法、管轄法院、財產分割及親權等問題，建議諮詢熟悉兩國法律的律師。'
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
        '可選擇面談（台北事務所）或視訊諮詢（Zoom/Google Meet）。韓語、中文、日語皆可諮詢，須事先預約，以一小時為單位。若事先提供相關資料，可獲得更具體的建議。'
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
      question: 'Is severance always required when an employment contract ends in Taiwan?',
      answer:
        'Not always. Severance is generally required when an employer terminates under Article 11, the proviso to Article 13, Article 20, or another qualifying provision, and when a worker terminates on a statutory ground under Article 14. It is generally not required for a disciplinary termination under Article 12, and an ordinary voluntary resignation does not automatically trigger severance. The legal ground, notice, payment deadline, and service under the new and old systems must be reviewed separately.'
    },
    {
      question: 'Is a minimum-service-period clause in Taiwan automatically void?',
      answer:
        'No. Under Article 15-1 of Taiwan\'s Labor Standards Act, a clause may satisfy the statutory threshold if the employer either provides professional skills training at its own expense or provides reasonable compensation for the worker\'s commitment to the minimum service period. The two grounds are alternatives, not cumulative requirements. Even if one exists, the period and burden must remain within a reasonable scope under the four statutory factors.'
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
        'Divorce in Taiwan is either (1) by mutual consent, which must be in writing, signed by at least two witnesses, and registered with the household administration authority, or (2) judicial divorce (mediation then litigation). International divorce between Korea and Taiwan involves complex issues of applicable law, jurisdiction, property division, and custody, so consulting a lawyer familiar with both legal systems is essential.'
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
        'We offer in-person consultations (Taipei office) or video consultations (Zoom/Google Meet). Consultations are available in Korean, Chinese, and Japanese. Appointments are required and scheduled in one-hour units. Sending relevant documents in advance allows for more detailed advice.'
    },
    {
      question: 'Can you help with company setup for specialized industries like logistics or cosmetics?',
      answer:
        'Yes, but additional industry-specific permits are required—transport permits for logistics, PIF (Product Information File) registration and FDA notification for cosmetics, etc. Understanding industry regulations beforehand and processing them alongside incorporation saves time and cost.'
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
      question: '韓国人が台湾で離婚するには、どのような手続きが必要ですか？',
      answer:
        '台湾法が適用される合意離婚は、書面で行い、2名以上の証人が署名し、戸政機関で離婚登記をする必要があります。裁判による離婚は、原則として裁判前に家事調停を経ます。韓国・台湾間の国際離婚では、台湾で手続できるか、どの法が適用されるか、両地域での届出・承認、財産分与、未成年の子の親権・扶養を個別に確認してください。'
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
        '台北事務所での対面相談またはビデオ通話による相談に対応しており、韓国語・中国語・日本語で相談できます。一般法律相談は事前予約制で、現在の料金案内では1時間単位です。まずお問い合わせページから案件の概要と主な資料を送り、日程、相談方法、担当言語および費用をご確認ください。連絡はKakaoTalk、メールまたは電話から行えます。'
    },
    {
      question: '物流・化粧品などの規制業種でも台湾で会社を設立できますか？',
      answer:
        '会社を設立できるかと、当該事業を開始できるかは別に確認します。「物流」は広い概念で、倉庫・梱包・取次ぎなどと、自ら報酬を受けて貨物自動車で運送する「自動車貨物運送業」（汽車貨運業）では規制が異なります。自動車貨物運送業には、道路運送を所管する機関（公路主管機関）による設立準備許可（籌設許可）・営業免許等が必要です。化粧品は、対象となる製造・輸入業者が供給等の開始前に製品登録を行い、対象製品のPIFを作成・更新して法定の住所に保存します。PIFは当局へ登録・届出するものではありません。'
    }
  ]
};
