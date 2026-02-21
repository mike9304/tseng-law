import type { Locale } from '@/lib/locales';

export interface ServiceArea {
  slug: string;
  title: Record<Locale, string>;
  subtitle: Record<Locale, string>;
  intro: Record<Locale, string>;
  /** Synthesized key points from column articles */
  keyPoints: Record<Locale, string[]>;
  /** Column slugs that belong to this service area */
  columnSlugs: string[];
}

export const serviceAreas: ServiceArea[] = [
  {
    slug: 'investment',
    title: { ko: '투자·법인설립', 'zh-hant': '投資·公司設立', en: 'Investment & Company Setup' },
    subtitle: {
      ko: '한국 기업의 대만 진출을 위한 법인 설립 전 과정 지원',
      'zh-hant': '協助韓國企業在台落地的全流程法律服務',
      en: 'End-to-end legal support for Korean companies expanding into Taiwan'
    },
    intro: {
      ko: '법무법인 호정은 한국 기업의 대만 시장 진출을 위해 법인 형태 선택부터 투자심의위원회 승인, 자본금 송금, 은행 계좌 개설, 영업장소 확보, 업종별 인허가까지 전 과정을 한국어로 밀착 지원합니다.',
      'zh-hant': '昊鼎國際法律事務所協助韓國企業選擇公司型態、投審會審查、資本匯入、銀行開戶、營業場所確認及特殊行業許可，提供韓語全程對接服務。',
      en: 'Hovering supports Korean businesses across the full market-entry process in Taiwan, including entity structuring, investment approval, capital remittance, bank setup, business premises review, and industry-specific licensing.'
    },
    keyPoints: {
      ko: [
        '법인 형태는 자회사(주식/유한회사), 지점(Branch), 연락사무소 3가지이며, 세무 부담·정부조달 참여 여부 등에서 차이가 있습니다.',
        '법인 설립은 회사명 예약 → 위임장 공증 → 투자심의위 신청 → 은행계좌 → 자본금 송금 → 법인등기 → 세무등록 등 약 10단계, 3개월 소요됩니다.',
        '1인 주주 기준 취업허가 최소 자본금은 50만 TWD(약 2,000만 원)이며, 취업허가 유지를 위해 연 매출 300만 TWD 이상이 필요합니다.',
        '자본금 송금은 투자자 본인이 직접 한국 은행을 방문해야 하며(인터넷뱅킹·대리 불가), 해외직접투자신고도 동시에 필요합니다.',
        '영업장소는 타이베이시 "영업장소 사전 조회 시스템"으로 업종 적합성을 반드시 사전 확인해야 합니다.',
        '화장품 판매 시 PIF(Product Information File) 등록이 필수이며, 광고 위반 시 최대 500만 TWD 벌금이 부과됩니다.',
        '물류업 면허 취득에는 자본금 2,500만 TWD, 신차 화물차 20대 등의 요건이 있으며, 기존 회사 인수나 업무위탁도 대안입니다.',
        '법인을 더 이상 운영하지 않을 때는 반드시 해산·청산 절차를 거쳐야 하며, 자본금 무단 인출 시 최대 5년 징역에 처해질 수 있습니다.',
      ],
      'zh-hant': [
        '公司型態分為子公司（股份/有限公司）、分公司及聯絡處，在稅負與政府採購參與資格等方面有所差異。',
        '設立流程約10個步驟、耗時約3個月，包含公司名稱預查、委託書公證、投審會申請、銀行開戶、資本匯入、公司登記及稅籍登記等。',
        '單一股東取得工作許可之最低資本額為50萬TWD，維持工作許可須年營收達300萬TWD以上。',
        '資本匯入須由投資人親赴韓國銀行臨櫃辦理，同時須申報海外直接投資。',
        '營業場所須透過台北市「營業場所預查系統」確認業種適合性。',
        '化妝品銷售須完成PIF登記，廣告違規最高罰500萬TWD。',
        '物流業執照門檻包含資本額2,500萬TWD及20輛新車等要件。',
        '停止營運時須經解散清算程序，違法抽逃資金最高處5年有期徒刑。',
      ],
      en: [
        'Entity options include subsidiary, branch, and representative office, with different implications for tax, liability, and operations.',
        'Typical setup includes around 10 steps over roughly 3 months: name reservation, POA notarization, investment review filing, banking, capital remittance, company registration, and tax registration.',
        'For a single shareholder work permit case, practical minimum capital is often TWD 500,000, and maintaining work authorization may require annual revenue over TWD 3M.',
        'Capital remittance usually requires in-person processing by the investor at the Korean bank branch, together with outbound investment reporting.',
        'Business address compliance should be checked in advance through local zoning and use regulations.',
        'For cosmetics sales, PIF registration is mandatory, and advertising violations can trigger fines up to TWD 5M.',
        'Logistics licensing may require TWD 25M capital and vehicle requirements; acquisition or outsourcing can be alternatives.',
        'When closing operations, dissolution and liquidation are mandatory. Illegal capital withdrawal can lead to serious criminal penalties.'
      ]
    },
    columnSlugs: [
      'taiwan-company-establishment-basics',
      'taiwan-company-subsidiary-vs-branch',
      'taiwan-company-establishment-advanced-1',
      'taiwan-company-establishment-advanced-2',
      'taiwan-company-setup-pitch-location',
      'taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide',
      'taiwan-logistics-business-setup',
      'withdraw-capital-taiwan-company',
    ],
  },
  {
    slug: 'civil',
    title: { ko: '민사소송·손해배상', 'zh-hant': '民事訴訟·損害賠償', en: 'Civil Litigation & Damages' },
    subtitle: {
      ko: '계약 분쟁, 손해배상, 교통사고 등 민사 사건 전반 대응',
      'zh-hant': '契約糾紛、人身傷害、交通事故等民事案件',
      en: 'Comprehensive support for contract disputes, damages claims, and accident litigation'
    },
    intro: {
      ko: '법무법인 호정은 계약 분쟁, 손해배상, 소비자 피해 등 민사 사건 전반을 대응합니다. 한국 유학생 헬스장 부상 사건에서 157만 TWD 배상 판결을 이끌어낸 실적을 보유하고 있으며, 외국인 의뢰인의 대만 소송 절차를 한국어로 밀착 지원합니다.',
      'zh-hant': '昊鼎曾代理韓國留學生健身房受傷案，獲判新台幣157萬元賠償。以中韓雙語全程支援外國當事人之台灣訴訟程序。',
      en: 'We handle broad civil disputes including contract breach, tort, and consumer claims. We obtained a TWD 1.57M ruling in a Korean student gym injury case and provide close multilingual support throughout Taiwan litigation.'
    },
    keyPoints: {
      ko: [
        '손해배상 청구 항목: 의료비, 간호비, 교통비, 노동능력 상실(가장 큰 항목), 휴업 손해, 정신적 위자료, 소비자보호법상 징벌적 배상(최대 5배).',
        '교통사고 시 반드시 현장에 대기하고, 사진·영상·CCTV 등 증거를 즉시 확보해야 합니다. 뺑소니는 1~7년 징역.',
        '과실 판정은 4단계(초판표 → 차량사고감정위 → 감정복의위 → 학술기관 감정)로 진행되며, 학술기관 감정이 사실상 최종 판단입니다.',
        '형사 고소(기한 6개월)를 먼저 진행하면, "형사 부대 민사소송"으로 소송 인지대를 면제받을 수 있습니다.',
        '합의(화해)는 영구적이므로, 반드시 병원 감정이 완료된 후에 합의하는 것이 중요합니다.',
        '실제 사례: 한국 유학생이 대만 최대 헬스장에서 PT 중 추간판 탈출증을 입어 157만 TWD(약 6,500만 원) 배상 판결을 받았습니다.',
      ],
      'zh-hant': [
        '損害賠償項目：醫療費、看護費、交通費、勞動能力減損（最大項目）、休業損害、精神慰撫金、消保法懲罰性賠償（最高5倍）。',
        '交通事故須留在現場，立即確保照片、影片、CCTV等證據。肇事逃逸處1至7年有期徒刑。',
        '過失鑑定分4階段：初判表→車鑑會→覆議會→學術鑑定（實質上的最終判斷）。',
        '先提刑事告訴（期限6個月），再提「刑事附帶民事訴訟」可免繳民事裁判費。',
        '和解具永久效力，務必待醫院鑑定完成後再行和解。',
        '實際案例：韓國留學生於台灣最大健身房受傷，獲判157萬TWD賠償。',
      ],
      en: [
        'Damages categories include medical expenses, nursing, transportation, lost earning capacity, lost wages, emotional damages, and in some cases punitive damages under consumer law.',
        'After traffic accidents, preserve evidence immediately (photos, video, CCTV) and remain on site; hit-and-run carries severe criminal liability.',
        'Fault analysis can involve multiple stages, including formal accident appraisal and re-appraisal procedures.',
        'Filing a criminal complaint first (within deadline) may enable strategic benefits when pursuing related civil claims.',
        'Settlement terms are final. It is generally safer to settle after medical evaluation is sufficiently complete.',
        'Representative case: Korean student injury during PT at a major Taiwan gym resulted in a TWD 1.57M judgment.'
      ]
    },
    columnSlugs: [
      'taiwan-gym-injury-lawsuit',
      'taiwan-traffic-accident-procedure',
      'taiwan-overtaking-accident-liability',
      'taiwan-massage-history-law',
    ],
  },
  {
    slug: 'family',
    title: { ko: '가사소송', 'zh-hant': '家事訴訟', en: 'Family Litigation' },
    subtitle: {
      ko: '이혼, 재산분할, 친권, 상속 등 가사 사건 전략적 대응',
      'zh-hant': '離婚、財產分配、親權、繼承等家事案件',
      en: 'Strategic handling of divorce, property division, custody, and inheritance matters'
    },
    intro: {
      ko: '한국-대만 국제결혼 증가에 따라 이혼·친권·상속 관련 분쟁이 늘고 있습니다. 법무법인 호정은 대만 가사소송법과 국제사법을 함께 검토하여, 한국인 의뢰인에게 최적의 전략을 제공합니다.',
      'zh-hant': '因應韓台跨國婚姻增加，協助協議離婚、調解離婚、裁判離婚程序，以及法定繼承順位與剩餘財產分配請求。',
      en: 'As Korea-Taiwan marriages increase, disputes on divorce, custody, and inheritance are growing. We combine Taiwan family procedure and private international law analysis to build practical strategies for cross-border clients.'
    },
    keyPoints: {
      ko: [
        '이혼은 협의이혼(2인 증인 서명 → 호적사무소), 조정이혼(법원 조정), 재판이혼(소송) 3가지 방식이 있습니다.',
        '국제결혼의 경우, 대만에서 혼인 등록했으면 대만 절차가 적용되고, 해외 등록이면 대만에 혼인 등록 후 진행하거나 직접 법원 소송을 제기합니다.',
        '재산분할은 법정재산제가 기본이며, 혼인 후 재산이 적은 배우자가 차액의 1/2을 청구(잔여재산분배청구권)할 수 있고, 시효는 5년입니다.',
        '배우자는 절대적 상속인으로, 자녀와 함께 균등하게 상속합니다. 혼인 기간이 짧아도 상속권에는 영향이 없습니다.',
        '친권은 "최소변동원칙"에 따라 자녀의 기존 생활 환경을 유지하는 방향으로 판단되며, 면접교섭 방해 시 강제 집행을 신청할 수 있습니다.',
        '조정 불출석 시 최대 3,000 TWD 벌금, 판결 후 30일 이내에 호적 등록 필수.',
      ],
      'zh-hant': [
        '離婚分為協議離婚（2位證人簽名→戶政事務所）、調解離婚（法院調解）、裁判離婚（訴訟）三種。',
        '跨國婚姻在台登記者適用台灣程序；海外登記者須先在台辦理婚姻登記或直接向法院提訴。',
        '財產分配以法定財產制為基礎，婚後財產較少方可請求差額之1/2（剩餘財產分配請求權），時效5年。',
        '配偶為絕對繼承人，與子女均分繼承。婚姻長短不影響繼承權。',
        '親權依「最小變動原則」判斷，維持子女既有生活環境。妨礙探視可聲請強制執行。',
        '調解無故不到場罰3,000TWD，判決後30日內須辦理戶籍登記。',
      ],
      en: [
        'Divorce paths include consensual divorce registration, court mediation divorce, and court judgment divorce.',
        'In cross-border marriages, procedure depends on registration status and jurisdictional factors under Taiwan law.',
        'Property division typically follows statutory marital property rules, including residual property claims subject to limitation periods.',
        'A spouse is a core heir under Taiwan inheritance law and generally shares with children.',
        'Custody decisions prioritize the child’s best interests and stability of living environment.',
        'Procedural deadlines (including post-judgment registration) should be managed carefully to avoid penalties or delay.'
      ]
    },
    columnSlugs: [
      'taiwan-divorce-lawsuit-qna',
      'taiwan-inheritance-custody-analysis',
    ],
  },
  {
    slug: 'labor',
    title: { ko: '노동법·고용분쟁', 'zh-hant': '勞動法·僱傭爭議', en: 'Labor & Employment Disputes' },
    subtitle: {
      ko: '대만 노동기준법에 따른 해고·퇴직금·근로계약 분쟁 전문',
      'zh-hant': '台灣勞基法下的解僱、資遣費與勞動契約爭議',
      en: 'Specialized support for dismissal, severance, and employment contract disputes under Taiwan labor law'
    },
    intro: {
      ko: '대만의 퇴직금 제도는 한국과 근본적으로 다릅니다. 한국은 1년 이상 근무하면 자동으로 퇴직금이 발생하지만, 대만은 회사가 해고할 때(경제해고)만 퇴직금이 지급됩니다. 법무법인 호정은 한국 기업과 한국인 근로자 양측의 입장에서 대만 노동법 분쟁을 자문합니다.',
      'zh-hant': '台灣資遣費制度與韓國根本不同。韓國工作滿一年自動享有資遣費，台灣僅在公司資遣時才須支付。昊鼎以實務經驗協助韓國企業與勞工應對台灣勞動法規。',
      en: 'Taiwan severance rules differ significantly from Korea. We advise both Korean employers and employees on dismissal, severance, and employment contract disputes with practical litigation and compliance strategy.'
    },
    keyPoints: {
      ko: [
        '해고는 경제해고(퇴직금 + 사전통보), 징계해고(퇴직금 없음), 자발적 퇴사(원칙적으로 퇴직금 없음) 3가지 유형입니다.',
        '퇴직금 산정: 근속연수 × 0.5개월분 평균임금 (최대 6개월 상한). 예) 5년 근무, 월급 5만 TWD → 12.5만 TWD.',
        '자발적 퇴사라도 노동기준법 제14조 사유(임금 미지급, 폭행·모욕, 노동법 위반 등)가 있으면 퇴직금을 청구할 수 있으며, 사유 인지 후 30일 이내에 행사해야 합니다.',
        '의무재직 약정(최저복무기간)은 대만에서 거의 항상 무효이며, 유효하려면 전문 직업훈련 제공 + 합리적 보상 + 합리성·필요성을 모두 충족해야 합니다.',
        '회사 압박 면담 시 반드시 녹음하고, 출퇴근 기록·성과 평가·이메일 등 증거를 보존해야 합니다.',
        '2024년 대만 최저임금: 시급 183 TWD, 월급 27,470 TWD.',
      ],
      'zh-hant': [
        '解僱分為經濟性資遣（須付資遣費+預告）、懲戒解僱（無資遣費）、自願離職（原則無資遣費）三類。',
        '資遣費計算：年資×0.5個月平均工資（上限6個月）。',
        '即使自願離職，若符合勞基法第14條事由（欠薪、暴力侮辱、違反勞動法等），仍可請求資遣費，須於知悉後30日內行使。',
        '最低服務年限約定幾乎一律無效，除非同時滿足專業訓練、合理對價及合理必要性。',
        '遭公司施壓面談時務必錄音，並保存出勤紀錄、績效評估、郵件等證據。',
        '2024年台灣最低工資：時薪183TWD，月薪27,470TWD。',
      ],
      en: [
        'Dismissal scenarios are generally grouped into economic redundancy, disciplinary dismissal, and voluntary resignation, each with different severance implications.',
        'Severance is typically calculated based on years of service and average wage, with statutory caps.',
        'Even with voluntary resignation, severance may still be claimable when Labor Standards Act exceptions apply (e.g., non-payment of wages, abuse, major legal violations).',
        'Minimum service-period clauses are often unenforceable unless strict legal conditions are satisfied.',
        'In pressured termination situations, preserve evidence such as attendance records, evaluations, and email communications.',
        'Minimum wage and related labor thresholds should be reviewed against current regulations.'
      ]
    },
    columnSlugs: [
      'taiwan-labor-severance-law',
      'taiwan-voluntary-resignation-severance',
      'taiwan-mandatory-employment-period',
    ],
  },
  {
    slug: 'criminal',
    title: { ko: '형사소송', 'zh-hant': '刑事訴訟', en: 'Criminal Litigation' },
    subtitle: {
      ko: '대만 형사 절차 대응, 수사 단계 자문, 피해자·피의자 대리',
      'zh-hant': '刑事程序應對、偵查階段策略與代理',
      en: 'Investigation-stage strategy, defense, and victim representation in Taiwan criminal matters'
    },
    intro: {
      ko: '법무법인 호정은 대만 형사 절차에서 한국인 의뢰인의 권리를 보호합니다. 수사 단계 변호인 접견, 피해자 대리, 규제 위반에 따른 형사 리스크 사전 점검 등을 수행합니다.',
      'zh-hant': '昊鼎在台灣刑事程序中保障韓國當事人權益，提供偵查階段律師接見、被害人代理及法規違反風險預檢。',
      en: 'We protect client rights throughout Taiwan criminal procedure, including investigation response, attorney interviews, victim representation, and pre-risk checks for potential regulatory offenses.'
    },
    keyPoints: {
      ko: [
        '수사 단계 변호인 접견 및 진술 자문, 피해자 대리(고소·고발 절차), 외국인 피의자 한국어 통역 소송 지원.',
        '회사 자금 무단 인출: 회사법 제9조 — 최대 5년 징역 또는 50만~250만 TWD 벌금.',
        '뺑소니(교통사고 후 도주): 형법 제185조의4 — 1년 이상 7년 이하 징역.',
        '취업허가 없이 대만에서 근무하다 적발되면 3년간 입국 금지.',
        '형사 고소 기한은 6개월이며, 이 기한을 놓치면 민사만 가능하므로 사고 직후 빠른 상담이 중요합니다.',
      ],
      'zh-hant': [
        '偵查階段律師接見及陳述諮詢、被害人代理（告訴程序）、外籍被告韓語口譯訴訟支援。',
        '非法抽逃資金：公司法第9條——最高5年有期徒刑或50萬至250萬TWD罰金。',
        '肇事逃逸：刑法第185條之4——1年以上7年以下有期徒刑。',
        '無工作許可在台工作被查獲者，3年內禁止入境。',
        '刑事告訴期限為6個月，逾期僅能提起民事訴訟，故事故後應儘速諮詢律師。',
      ],
      en: [
        'Support includes investigation-stage attorney consultation, victim complaint procedure support, and multilingual communication assistance for foreign nationals.',
        'Unlawful withdrawal of company capital can trigger severe penalties under Taiwan company law.',
        'Hit-and-run and serious traffic offenses carry substantial criminal liability.',
        'Working without proper work authorization may cause immigration and criminal exposure.',
        'Criminal complaint deadlines are strict, so immediate legal review after an incident is essential.'
      ]
    },
    columnSlugs: [],
  },
  {
    slug: 'ip',
    title: { ko: '지적재산·금융분쟁', 'zh-hant': '智慧財產·金融爭議', en: 'IP & Financial Disputes' },
    subtitle: {
      ko: '상표·특허·저작권 보호 및 금융·투자 분쟁 대응',
      'zh-hant': '商標、專利、著作權保護與金融投資爭議處理',
      en: 'Trademark, patent, and copyright protection plus finance and investment dispute support'
    },
    intro: {
      ko: '대만에 진출하는 한국 기업의 브랜드 보호와 지적재산 관리, 금융·투자 관련 분쟁을 지원합니다.',
      'zh-hant': '協助在台韓國企業之品牌保護、智慧財產管理，以及金融投資相關爭議。',
      en: 'We support brand protection and IP management for Korean businesses entering Taiwan, as well as disputes involving financial products and investment contracts.'
    },
    keyPoints: {
      ko: [
        '대만은 선출원주의를 채택하여, 시장 진출 전 상표 선등록 확인이 필수입니다. 한국 등록 상표도 대만에서 별도 등록 필요.',
        '상표 출원·심사·등록 일괄 대행, 침해 시 경고장 발송·행정 구제·민형사 소송 대응.',
        '대만 진출 시 기술 보호를 위한 특허 출원 전략 자문 및 저작권 침해 모니터링.',
        '금융상품 분쟁의 사실관계 분석 및 소송 전략, 투자계약 위반 손해배상, 주주 간 경영권 분쟁 대응.',
      ],
      'zh-hant': [
        '台灣採先申請主義，進入市場前須確認商標是否已被註冊。韓國已註冊商標在台灣須另行申請。',
        '商標申請、審查、註冊一站式代辦；侵權時可發警告函、行政救濟或提起民刑事訴訟。',
        '協助台灣市場進入時的專利申請策略及著作權侵權監控。',
        '金融商品爭議事實分析與訴訟策略、投資契約違約損害賠償、股東間經營權爭議處理。',
      ],
      en: [
        'Taiwan follows a first-to-file system, so trademark availability and early filing are critical before launch.',
        'We support filing, examination response, registration, and post-registration enforcement options.',
        'We advise on patent and copyright protection strategy during Taiwan market entry.',
        'We handle investment and financial disputes including contract breach, damages claims, and shareholder conflicts.'
      ]
    },
    columnSlugs: [],
  },
];

export function getServiceArea(slug: string): ServiceArea | undefined {
  return serviceAreas.find((s) => s.slug === slug);
}

export function getServiceSlugs(): string[] {
  return serviceAreas.map((s) => s.slug);
}
