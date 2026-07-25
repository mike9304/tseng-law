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
      ko: '법무법인 호정은 계약 분쟁, 손해배상, 소비자 피해 등 민사 사건 전반을 대응합니다. 한국 유학생 헬스장 부상 사건에서 1심 157만 TWD 손해배상 판결을 이끌어낸 실적이 있으며, 외국인 의뢰인의 대만 소송 절차를 한국어로 밀착 지원합니다.',
      'zh-hant': '昊鼎處理契約爭議、損害賠償及消費者權益等民事案件，曾代理韓國留學生健身房受傷案，於一審獲判新臺幣157萬元賠償，並以中韓雙語支援外國當事人在台灣的訴訟程序。',
      en: 'We handle civil disputes including breach of contract, tort, and consumer claims. In a Korean student gym injury case, we obtained a TWD 1.57 million first-instance damages award and provide multilingual support throughout Taiwan litigation.'
    },
    keyPoints: {
      ko: [
        '배상 항목에는 의료비, 필요한 간호·돌봄비와 교통비, 회복 기간 중 입증된 소득 상실, 지속적 장해와 자료가 확인되는 경우의 노동능력 상실, 개별 사정에 따라 산정되는 비재산적 손해가 포함될 수 있으며, 소비자보호법 제51조의 징벌적 손해배상은 해당 법률과 법정 요건이 적용되는 경우 법원의 판단에 따라 고의는 손해액의 최대 5배, 중과실은 최대 3배, 과실은 최대 1배 범위에서 청구할 수 있습니다.',
        'CCTV, 의무기록, 영수증, 대화 기록, 목격자 진술과 트레이닝 기록은 원본과 작성 시점을 확인할 수 있는 형태로 확보하는 것이 중요하며, 정식 서면 보전요청이나 변호사 명의의 요청서는 무엇을 언제 요청했는지 남기는 수단일 뿐 보전을 강제하거나 삭제를 막거나 자동으로 불리한 추정을 발생시키지 않고, 범죄 가능성이 있으면 신속한 신고를 통해 수사기관이 적법한 확보·보전 근거를 판단하게 할 수 있으나 경찰의 CCTV 확보를 단정할 수 없습니다.',
        '소비자보호법 제7조는 사업자가 서비스를 제공할 때 당시의 전문·기술 수준에서 합리적으로 기대되는 안전성을 갖추도록 요구하지만 모든 헬스장 부상이 곧바로 책임으로 이어지는 것은 아니며, 구체적 책임은 안전의무, 위반, 인과관계, 손해, 항변과 증거를 종합해 판단하고 초기분석이나 과실감정 의견도 최종 책임을 자동으로 결정하지 않습니다.',
        '형법 제287조에 따라 제284조의 과실상해는 고소가 있어야 공소를 제기할 수 있고 형사소송법 제237조상 고소는 원칙적으로 범인을 안 날부터 6개월 안에 해야 하며, 민법 제197조상 불법행위 손해배상청구권은 손해와 배상의무자를 안 날부터 2년 또는 불법행위 시점부터 10년이 지나면 원칙적으로 소멸하고, 다른 청구원인과 기간 규칙은 사실관계에 따라 달라지며 형사부대민사소송도 형사사건과 청구의 관련성 등 요건과 절차 단계가 맞는 경우에만 이용할 수 있어 비용 취급까지 개별 확인해야 합니다.',
        '화해 전에는 대상 청구, 권리포기 범위, 지급 조건과 불이행 시 조치를 확인해야 하며, 치료가 계속되거나 장래 손해가 아직 확정되지 않았다면 그 범위까지 검토해야 하고 서명 뒤에는 합의 내용을 번복하기 어려울 수 있습니다.',
        '대만 타이중지방법원 109年度消字第7號 판결은 트레이너의 지도로 데드리프트를 하던 한국인 유학생이 다친 사건에서 1심이 TWD 1,579,589의 배상을 명한 사례이고 공식 판결문에는 曾雋崴 변호사가 원고 소송대리인으로 기재되어 있으며, 이후 항소심에서 당사자들이 화해했다는 내용은 언론 보도에 따른 것입니다.',
      ],
      'zh-hant': [
        '可能主張的損害項目包括醫療費用、必要的看護或照護費用、必要交通費用、復原期間有證明的收入損失、持續性障礙及相關證據成立時的勞動能力減損，以及依個案情形酌定的非財產上損害；消費者保護法第51條的懲罰性賠償，則須以該法及法定要件適用為前提，並由法院依個案判斷，故意為損害額五倍以下、重大過失為三倍以下、過失為一倍以下。',
        'CCTV、病歷、收據、通訊紀錄、證人陳述及訓練紀錄宜以可確認原始來源與時間的形式保存；正式書面保全請求或律師函只能記錄請求內容與時間，不能強制對方保存、阻止刪除或當然產生不利推定，如事實可能涉及犯罪，及時報案可由偵查機關判斷是否具備合法調取或保全影像的依據，但不能斷定警方一定會取得CCTV。',
        '消費者保護法第7條要求提供服務的企業經營者確保其服務符合當時科技或專業水準可合理期待的安全性，但健身房發生受傷事故不當然成立責任，仍須綜合判斷安全義務、違反情形、因果關係、損害、抗辯與證據，初步研判或過失鑑定意見也不會自動決定最終責任。',
        '依刑法第287條，第284條過失傷害罪屬告訴乃論，刑事訴訟法第237條原則上要求告訴權人自知悉犯人時起六個月內提出告訴；依民法第197條，侵權行為損害賠償請求權原則上自知有損害及賠償義務人時起二年、最長自侵權行為時起十年不行使而消滅，其他請求權基礎與期間規則須依個案確認，而刑事附帶民事訴訟也僅能在與刑事案件的關聯性等法定要件及程序階段均符合時利用，費用效果亦應個別確認。',
        '和解前應確認納入的請求、權利拋棄範圍、付款條件及違約處理方式；如治療仍在進行或將來損害尚未明確，亦應一併評估，因簽署後可能難以推翻或另行主張已納入和解範圍的權利。',
        '臺灣臺中地方法院109年度消字第7號判決涉及一名韓國留學生在教練指導下進行硬舉訓練時受傷，一審判命賠償新臺幣1,579,589元，官方判決並記載曾雋崴律師為原告訴訟代理人；其後雙方於上訴程序成立和解之說法則僅依媒體報導。',
      ],
      en: [
        'Potential damages may include medical expenses, necessary nursing or care costs, necessary transportation, documented earnings lost during recovery, loss of earning capacity where lasting impairment and supporting evidence are established, and non-pecuniary loss assessed from the individual circumstances; punitive damages under Consumer Protection Act Article 51 require the Act and its statutory conditions to apply and remain subject to court assessment, with ceilings of five times the proven loss for intent, three times for gross negligence, and one time for negligence.',
        'CCTV, medical records, receipts, communications, witness accounts, and training records should be retained in a form that preserves their source and timing; a formal written preservation request or counsel’s letter records what was requested and when but does not compel preservation, prevent deletion, or automatically create an adverse inference, and although a prompt report of potentially criminal conduct allows investigators to assess whether lawful grounds exist to obtain or preserve footage, police acquisition of CCTV cannot be assumed.',
        'Consumer Protection Act Article 7 requires a business operator providing services to ensure that the service meets the safety reasonably expected under the professional or technical standard prevailing at the time, but a gym injury does not by itself establish liability, which depends on the applicable duty, breach, causation, damage, defenses, and evidence, while a preliminary assessment or fault-appraisal opinion does not automatically determine final responsibility.',
        'Under Criminal Code Article 287, negligent injury under Article 284 is prosecutable only upon complaint, and Code of Criminal Procedure Article 237 generally requires the complaint within six months after the entitled complainant learns the offender’s identity; under Civil Code Article 197, a tort claim generally expires two years after the claimant learns both of the injury and the person liable, subject to a ten-year longstop from the wrongful act, while other causes of action and timing rules remain fact-dependent and an ancillary civil action is available only when its relationship to the criminal case and other procedural requirements are satisfied, with its cost treatment requiring individual review.',
        'Before settling, the parties should identify the claims covered, the scope of any release, payment terms, and remedies for breach, and ongoing treatment or unresolved future loss should be considered because undoing the agreement or pursuing rights already released may be difficult after signature.',
        'In Taichung District Court case 109年度消字第7號, a Korean student was injured while performing a trainer-led deadlift, and the first-instance court awarded exactly TWD 1,579,589; the official judgment identifies Attorney 曾雋崴 as the plaintiff’s litigation representative, while the statement that the parties later settled on appeal is attributable only to media reports.',
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
        '대만 이혼은 민법 제1050조의 서면, 당사자 쌍방의 진정한 이혼 의사를 직접 확인한 2명 이상 증인의 서명, 호정기관 등기를 모두 갖추는 협의이혼과 법원 조정·화해에 의한 이혼, 재판이혼을 구분해 검토합니다.',
        '국제결혼·외국 이혼은 대만의 재판관할·행정권한, 준거법, 외국 신분행위·재판의 대만 내 승인과 효력, 대만 호적 절차, 다른 국가·지역의 절차를 각각 확인해야 합니다.',
        '특정 재산의 등기·소유권과 증여·차명등기·대여·반환 등 개별 청구는 민법 제1030조의1 잔여재산 차액분배와 구분하며, 해당 청구의 2년·5년 행사기간을 손해배상·이혼 후 부양·양육비 등에 일률 적용하지 않습니다.',
        '배우자는 다른 상속인이 있으면 대만 민법상 해당 순위의 상속인과 공동상속하고, 다른 상속인이 없으면 전부를 상속합니다. 상속분은 상속인 구성에 따라 달라지며, 상속과 배우자의 잔여재산 관련 청구는 별도로 계산합니다.',
        '미성년 자녀에 대한 권리·의무의 행사·부담과 면접교섭은 자녀의 최선의 이익을 기준으로 판단하며, 혼인 파탄 책임이나 한 가지 요소가 결과를 자동으로 정하지 않습니다.',
        '법원이 본인 출석을 명령한 경우 정당한 이유 없는 불출석에는 첫 과태료가 3만 대만달러 이하이고 강제구인할 수 없으며, 이혼판결 확정일 또는 법원 조정·화해 성립일부터 일반적으로 30일 안에 호적 신고하되 기간 후 신청도 수리되고 요건을 갖추면 서면 최고 후 호정기관이 직접 등기할 수 있습니다.',
      ],
      'zh-hant': [
        '台灣離婚應區分：依民法第1050條具備書面、兩名以上親自見聞並確認雙方真實離婚意思之證人簽名及戶政登記的協議離婚；法院調解或和解離婚；以及裁判離婚。',
        '跨國婚姻或外國離婚應分別確認台灣的司法管轄與行政權限、準據法、外國身分行為或裁判在台灣的承認及效力、台灣戶籍程序，以及其他國家或地區的程序。',
        '特定財產的登記與所有權，以及贈與、借名登記、借貸、返還等個別請求，應與民法第1030條之1夫妻剩餘財產差額分配分開分析；該請求的二年及五年期間不得一律套用於損害賠償、離婚後扶養或子女扶養費。',
        '配偶在有其他繼承人時，與民法所定相應順位的繼承人共同繼承；四個順序均無繼承人時，由配偶繼承全部遺產。應繼分依繼承人組成而異，繼承與配偶的剩餘財產相關請求也應分別計算。',
        '未成年子女權利義務之行使或負擔及會面交往，應以子女最佳利益判斷，不因婚姻破綻責任或單一因素而自動決定。',
        '法院命本人到場而無正當理由不到場時，首次罰鍰為新臺幣3萬元以下且不得拘提；離婚判決確定日或法院調解、和解成立日起一般應於30日內申請戶籍登記，逾期申請仍會受理，符合要件時戶政機關得於書面催告後逕為登記。',
      ],
      en: [
        'Taiwan divorce analysis must distinguish a mutual-consent divorce satisfying Civil Code Article 1050’s writing requirement, signatures by at least two witnesses who personally perceived and confirmed both spouses’ genuine intent to divorce, and household registration; divorce by court mediation or settlement; and judicial divorce.',
        'A cross-border marriage or foreign divorce requires separate analysis of Taiwan judicial jurisdiction and administrative authority, applicable law, Taiwan recognition and effect of the foreign status act or judgment, Taiwan household-registration procedure, and any procedure in another country or region.',
        'Registered title and ownership of a specific asset, and claims based on gift, nominee registration, loan, or restitution, must be separated from Civil Code Article 1030-1 residual-property distribution; its two-year and five-year periods do not apply wholesale to damages, post-divorce support, or child support.',
        'When other heirs exist, a spouse inherits concurrently with the heirs in the applicable Civil Code rank; if no heir exists in any of the four ranks, the spouse inherits the entire estate. The share varies with the composition of the heirs, and inheritance and the spouse’s separate residual-property claim must also be calculated separately.',
        'The exercise and assumption of rights and duties concerning a minor child, and contact or visitation, are determined under the child’s best interests rather than marital fault or any single automatic factor.',
        'When a court orders personal appearance, the first fine for unjustified nonappearance is up to NTD 30,000 and arrest is unavailable; household registration is generally sought within 30 days after a divorce judgment becomes final or court mediation or settlement is established, late applications remain accepted, and the office may register directly after written demand when statutory conditions are met.',
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
      ko: '대만의 퇴직금(資遣費) 제도는 한국과 적용 사유와 산정 방식이 다릅니다. 계약 종료의 법적 근거, 신제와 구제(舊制)가 적용되는 근속기간, 예고와 기간 제한을 구분해 검토해야 하며, 법무법인 호정은 한국 기업과 한국인 근로자 양측에 해고·퇴직금·근로계약 분쟁 자문을 제공합니다.',
      'zh-hant': '台灣資遣費制度與韓國在適用事由及計算方式上不同，應依契約終止的法定依據、新舊制年資、預告與期間限制分別檢視。昊鼎協助韓國企業及韓籍勞工處理解僱、資遣費與勞動契約爭議。',
      en: 'Taiwan’s severance rules differ from Korea’s in both qualifying grounds and calculation methods. The legal basis for ending the contract, service under the new and old systems, notice requirements, and statutory time limits must be reviewed separately. We advise Korean employers and employees on dismissal, severance, and employment-contract disputes in Taiwan.'
    },
    keyPoints: {
      ko: [
        '대만의 근로계약 종료는 경제해고·징계해고·자발적 퇴사라는 세 유형만으로 일률적으로 판단할 수 없습니다. 사용자가 예고하고 종료할 수 있는 노동기준법 제11조 사유, 예고 없이 종료할 수 있는 제12조 사유, 근로자가 예고 없이 종료할 수 있는 제14조 사유와 기간제 계약 만료 등을 구분하여 계약 형태·종료 원인·절차에 따른 예고, 퇴직금(資遣費), 증명서류를 개별적으로 확인해야 합니다.',
        '퇴직금은 신제·구제가 적용되는 근속기간에 따라 산정 방식이 다릅니다. 신제 적용기간은 법정 사유로 계약이 종료되면 원칙적으로 근속 1년당 평균임금 0.5개월분, 1년 미만은 비례 계산하고 평균임금 6개월분을 상한으로 하며, 구제 적용기간은 원칙적으로 근속 1년당 평균임금 1개월분을 기초로 합니다. 신·구제 근속기간이 섞인 경우에는 각 기간을 나누어 계산해야 합니다.',
        '노동기준법 제14조는 임금 미지급, 사용자 측의 폭행·중대한 모욕, 건강을 해칠 우려가 있는 업무에 필요한 개선을 하지 않은 경우, 사용자의 근로계약·노동법령 위반으로 근로자의 권익이 침해될 우려가 있는 경우 등 근로자가 예고 없이 계약을 종료할 수 있는 사유를 정합니다. 30일의 기간 제한은 제1항 제1호와 제6호에만 적용됩니다. 두 경우 모두 해당 사정을 안 날부터 30일 이내에 행사해야 하고, 제6호의 손해 결과가 발생한 경우에는 그 결과를 안 날부터 30일 이내에도 행사할 수 있으므로, 해당 호와 기산점을 따로 확인해야 합니다.',
        '최소 근무기간 약정은 노동기준법 제15조의1에 따라 사용자가 전문기술 훈련을 실시하고 비용을 부담했거나, 근로자가 약정을 지키도록 합리적 보상을 제공한 경우 중 하나에 해당해야 합니다. 그다음 훈련 기간·비용, 대체인력 가능성, 보상 금액·범위와 그 밖의 사정을 종합하여 합리적 범위를 별도로 심사하며, 이 요건을 위반한 약정은 무효입니다. 근로자에게 책임을 돌릴 수 없는 사유로 기간 만료 전에 계약이 종료되면 약정 위반 책임이나 훈련비 반환 책임을 부담하지 않습니다.',
        '증거는 근로계약서, 취업규칙, 급여명세·송금기록, 출퇴근·연장근로 기록, 평가자료, 배치·감봉·계약 종료 통지, 이메일과 메신저 원본을 날짜와 출처를 확인할 수 있도록 원본 형식으로 적법하게 보존하고 시간순으로 정리합니다. 녹음은 언제나 적법하거나 증거로 채택되는 것이 아니므로, 녹음자가 대화 당사자인지, 취득 방법, 사생활·통신비밀, 사내규정과 사용 목적을 개별적으로 검토하고 무단 계정 접근·기기 설치·자료 변조나 영업비밀·개인정보의 과도한 반출을 피해야 합니다.',
        '퇴사 예고기간은 최소 근무기간 약정의 효력이나 비용 반환책임과 별개의 쟁점입니다. 기간의 정함이 없는 계약은 노동기준법 제15조가 제16조 제1항을 준용하므로 근속 3개월 이상 1년 미만은 10일, 1년 이상 3년 미만은 20일, 3년 이상은 30일 전에 예고합니다. 근속 3개월 미만, 그 밖의 기간제 계약 또는 예고 없는 종료 사유는 계약 형태와 적용 조문을 따로 검토해야 합니다.',
      ],
      'zh-hant': [
        '台灣勞動契約的終止不能只概括為經濟性資遣、懲戒解僱與自願離職三類。應區分雇主依《勞動基準法》第11條預告終止、第12條不經預告終止、勞工依第14條不經預告終止，以及定期契約期滿等情形，並依契約類型、終止原因與程序，個別確認預告、資遣費及必要證明文件。',
        '資遣費的計算須依新制、舊制所適用的年資分別處理。新制年資因法定事由終止契約時，原則上每滿一年發給二分之一個月平均工資，未滿一年按比例計算，最高以六個月平均工資為限；舊制年資原則上以每滿一年發給一個月平均工資為基礎。新舊制年資並存時，應拆分各段年資計算。',
        '《勞動基準法》第14條列有工資未付、雇主一方施暴或重大侮辱、對有危害健康之虞的工作未為必要改善、雇主違反勞動契約或勞工法令而有損害勞工權益之虞等勞工得不經預告終止契約的事由。30日期間限制僅適用於第1項第1款及第6款。兩款均應自知悉該情形之日起30日內行使；第6款如損害結果已發生，另得自知悉該結果之日起30日內行使，因此須分別確認適用款次與起算點。',
        '最低服務年限約定須依《勞動基準法》第15條之1，符合雇主為勞工進行專業技術培訓並負擔費用，或為使勞工遵守約定而提供合理補償兩項法定基礎之一。其後仍須另依培訓期間及成本、人力替補可能性、補償額度及範圍等因素審查合理範圍；違反要件的約定無效。契約因不可歸責於勞工之事由於期間屆滿前終止時，勞工不負違反約定或返還培訓費用之責任。',
        '證據應將勞動契約、工作規則、薪資明細與匯款紀錄、出勤與加班紀錄、考核資料、調職、減薪或契約終止通知、電子郵件及通訊原始資料，以可辨識日期與來源的合法原始格式保存並按時序整理。錄音並非在任何情況都合法，也不必然獲採為證據；應個別確認錄音者是否參與談話、取得方式、隱私與通訊秘密、內部規範及使用目的，避免未經授權存取帳號、裝設設備、變造資料或過度攜出營業秘密及個人資料。',
        '離職預告期間與最低服務年限約定的效力、費用返還責任是不同問題。不定期契約依《勞動基準法》第15條準用第16條第1項，年資滿3個月未滿1年者應於10日前、滿1年未滿3年者於20日前、滿3年以上者於30日前預告。年資未滿3個月、其他定期契約或依法得不經預告終止的情形，須另依契約類型與適用法條審查。',
      ],
      en: [
        'Ending an employment contract in Taiwan cannot be reduced to three universal categories of economic dismissal, disciplinary dismissal, and voluntary resignation. Distinguish an employer termination with notice under Article 11 of the Labor Standards Act, a termination without notice under Article 12, a worker termination without notice under Article 14, and expiry of a fixed-term contract; the contract type, legal ground, and procedure determine notice, severance, and required documentation.',
        'Severance must be calculated separately for service covered by Taiwan’s new and old systems. For service under the new system, a contract ending on a statutory qualifying ground generally produces one-half month of average wage per year, prorated for partial years and capped at six months of average wage. Old-system service generally starts from one month of average wage per year, subject to its own partial-period rules. Mixed service requires each period to be identified and calculated under the applicable system.',
        'Article 14 permits a worker to terminate without notice on grounds including unpaid wages, violence or serious insult by the employer side, failure to make necessary improvements to work that may harm health, or an employer breach of the contract or labor law that may prejudice the worker’s rights. The 30-day limit applies only to paragraph 1, subparagraphs 1 and 6. In both cases, the period runs from knowledge of the relevant circumstances; for subparagraph 6, if a harmful result occurs, the worker may also terminate within 30 days after learning of that result. The applicable subparagraph and trigger date must therefore be identified.',
        'Under Article 15-1, a minimum-service-period clause needs one of two alternative statutory bases: employer-funded professional skills training or reasonable compensation for the worker’s commitment. A separate reasonable-scope review then considers training duration and cost, availability of replacement personnel, the amount and scope of compensation, and other circumstances; a clause that fails either stage is void. If employment ends early for a reason not attributable to the worker, the worker is not liable for breach of the clause or reimbursement of training expenses.',
        'Preserve employment contracts, work rules, pay statements and remittance records, attendance and overtime records, evaluations, transfer, pay-cut or termination notices, email, and chat data lawfully in their original form with verifiable dates and sources, then arrange them chronologically. Recording is not invariably lawful or admissible; participation in the conversation, acquisition method, privacy and communications secrecy, internal policies, and intended use require individual review. Avoid unauthorized account access or device placement, alteration of data, and excessive removal of trade secrets or personal data.',
        'Resignation notice is distinct from the validity of a minimum-service-period clause and from repayment liability. For an indefinite-term contract, Article 15 applies the notice periods in Article 16(1): 10 days’ notice for service of at least three months but less than one year, 20 days’ notice for service of at least one year but less than three years, and 30 days’ notice for service of at least three years. Service under three months, other fixed-term contracts, and statutory no-notice grounds require separate review of the contract type and governing provision.'
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
