import type { Locale } from '@/lib/locales';

export interface QuickReply {
  /** Short label shown on chip */
  label: string;
  /** Full message inserted as user bubble */
  question: string;
  /**
   * Legacy canned text retained only for older persisted clients.
   * The live FloatingAiChat sends `question` to /api/consultation/chat
   * so classification, logging, citations, and safety checks still run.
   */
  answer: string;
}

const KO_REPLIES: QuickReply[] = [
  {
    label: '🏢 회사설립 절차',
    question: '대만 회사설립 절차가 어떻게 되나요?',
    answer:
      '대만 회사설립은 일반적으로 아래 10단계로 진행됩니다.\n\n' +
      '1. 회사명 검색·신청 (중국어 명칭, 경제부 상사사 등기처)\n' +
      '2. 위임장 인증·공증\n' +
      '3. 경제부 투자심의위원회(投資審議司)에 외국인 투자 신청\n' +
      '4. 회사 예비계좌 개설\n' +
      '5. 자본금 송금 (해외직접투자신고 필요)\n' +
      '6. 자본금 감사 (회계사)\n' +
      '7. 법인 등기 (경제부 상사사)\n' +
      '8. 세무 등기 (국세국)\n' +
      '9. 임시계좌 → 정식계좌 전환\n' +
      '10. 수출입 등기 (필요 시)\n\n' +
      '평균 처리기간은 6~10주 정도입니다. 업종, 자본금 규모, 외국인 고용 여부에 따라 추가 허가가 필요할 수 있습니다.\n\n' +
      '구체적인 사례 검토는 상담 접수하기 버튼을 눌러주시거나 이메일로 문의해 주세요.',
  },
  {
    label: '🚗 교통사고 대응',
    question: '대만에서 교통사고가 났는데 어떻게 해야 하나요?',
    answer:
      '대만 교통사고 발생 시 가장 중요한 5가지를 순서대로 안내드립니다.\n\n' +
      '1. 안전 확보·부상 확인 — 2차 사고 방지가 최우선입니다.\n' +
      '2. 경찰 신고 (110) — 현장 정리 및 사고 조서 작성. 분쟁 가능성이 있다면 반드시 신고해 주세요.\n' +
      '3. 증거 보전 — 차량 위치, 파손 사진·영상, 상대방 신분·차량등록증, 목격자 연락처, 블랙박스를 모두 확보합니다.\n' +
      '4. 의료기록 — 통증이 미미해도 24시간 내에 진료를 받아 진료 기록을 남겨야 합니다.\n' +
      '5. 보험 통지 — 가해/피해 양측 모두 즉시 보험사에 통지합니다.\n\n' +
      '대만에서 과실치상죄(過失致傷)는 6개월 내에 형사 고소를 해야 하며, 민사 손해배상 청구는 사고일로부터 2년이 시효입니다.\n\n' +
      '사고가 방금 발생한 상황이라면 상담 접수하기 버튼으로 사건 요약과 연락처를 남겨 주세요. 변호사가 우선 검토해 드립니다.',
  },
  {
    label: '⚖️ 노동·해고',
    question: '대만에서 해고당했는데 퇴직금 받을 수 있나요?',
    answer:
      '대만 노동기준법상 해고는 크게 3가지 유형으로 나뉘며, 유형별로 퇴직금 지급 여부가 다릅니다.\n\n' +
      '1. 경영상 해고 (자감, 경영악화 등) — 신노제 기준 매년 0.5개월분 평균임금, 최대 6개월\n' +
      '2. 본인 귀책사유 없는 해고 — 위와 동일한 퇴직금 + 예고수당\n' +
      '3. 본인 귀책사유 있는 해고 (12조 1항) — 퇴직금 없음\n\n' +
      '회사 측이 일방적으로 "오늘부터 나오지 말라"고 한 경우, 통지 방식·서면 여부·이유 정당성을 변호사가 직접 검토해야 합니다. 서명 전에 받은 문서·메시지·이메일을 모두 보존해 주세요.\n\n' +
      '해고 통보를 받았다면 시간이 매우 중요합니다. 상담 접수하기 버튼으로 통지 상황과 보유 자료를 알려 주세요.',
  },
  {
    label: '💔 이혼·가사',
    question: '대만에서 이혼하려면 어떻게 해야 하나요?',
    answer:
      '대만 이혼은 크게 두 가지 방식이 있습니다.\n\n' +
      '1. 협의이혼 (兩願離婚) — 양 당사자 합의 + 증인 2명 + 호적 등기. 가장 빠르고 간단합니다.\n' +
      '2. 재판이혼 (裁判離婚) — 민법 1052조의 이혼 사유 10가지(예: 중혼, 외도, 학대, 유기, 회복불능 사유 등) 중 하나에 해당해야 합니다.\n\n' +
      '주요 검토 항목:\n' +
      '- 친권/양육권: 자녀의 복리를 최우선으로 판단\n' +
      '- 양육비: 부모 수입·자녀 수에 따라 산정 (시효 5년)\n' +
      '- 재산분할: 혼인 후 취득 재산 (잔여재산분배청구권)\n' +
      '- 위자료: 상대방 귀책 사유 인정 시\n\n' +
      '국제 이혼(한국-대만)이거나 분쟁이 심화된 경우에는 절차가 복잡해집니다. 상담 접수하기 버튼으로 현재 상황을 알려 주세요.',
  },
  {
    label: '📜 상속',
    question: '대만 상속 순위와 절차가 어떻게 되나요?',
    answer:
      '대만 민법상 상속 순위는 다음과 같습니다.\n\n' +
      '1순위: 직계비속 (자녀, 손자녀)\n' +
      '2순위: 부모\n' +
      '3순위: 형제자매\n' +
      '4순위: 조부모\n\n' +
      '배우자는 항상 공동 상속인이며, 1순위와는 균분, 2·3순위와는 1/2, 4순위와는 2/3을 받습니다.\n\n' +
      '주요 절차:\n' +
      '1. 사망 신고 (호적)\n' +
      '2. 상속재산 조사 (예금, 부동산, 주식, 채무)\n' +
      '3. 한정승인/포기 결정 — 사망일로부터 3개월 내\n' +
      '4. 상속세 신고 — 사망일로부터 6개월 내\n' +
      '5. 등기 이전 (부동산), 명의변경 (예금)\n\n' +
      '한국 국적 피상속인도 대만 내 재산에는 대만법이 적용될 수 있어 국제사법 검토가 필요합니다.\n\n' +
      '상속 사건은 시효가 짧으므로 상담 접수하기 버튼으로 현재 상황을 알려 주세요.',
  },
  {
    label: '💰 상담 비용·일정',
    question: '상담 비용과 일정이 어떻게 되나요?',
    answer:
      '호정국제법률사무소의 상담 안내입니다.\n\n' +
      '📞 전화 상담 가능\n' +
      '📧 이메일 문의 가능\n\n' +
      '🏢 대만 사무소:\n' +
      '- 타이베이: 承德路 35號 7樓之2\n' +
      '- 타이중: 04-2326-1862\n' +
      '- 가오슝: 07-557-9797\n\n' +
      '💼 상담 방식:\n' +
      '- 대면 상담 (3개 사무소)\n' +
      '- Google Meet / Zoom 화상 상담\n' +
      '- 한국어로 진행 가능\n\n' +
      '구체 비용은 사건 유형과 복잡도에 따라 다르므로 초기 상담 후 견적을 안내드립니다. 정식 상담 예약은 상담 접수하기 버튼으로 진행해 주세요.',
  },
];

const ZH_REPLIES: QuickReply[] = [
  {
    label: '🏢 公司設立',
    question: '在台灣設立公司的流程？',
    answer:
      '台灣公司設立通常包含以下 10 個步驟：\n\n' +
      '1. 公司名稱預查\n' +
      '2. 委任書認證\n' +
      '3. 投資審議司提出外人投資申請\n' +
      '4. 預備帳戶開設\n' +
      '5. 資本金匯入\n' +
      '6. 資本額查核 (會計師)\n' +
      '7. 公司登記\n' +
      '8. 稅籍登記\n' +
      '9. 預備帳戶轉正式帳戶\n' +
      '10. 進出口廠商登記 (如需要)\n\n' +
      '平均處理時間約 6 至 10 週。具體案例請透過「諮詢預約」按鈕或 Email 聯繫。',
  },
  {
    label: '🚗 車禍處理',
    question: '在台灣發生車禍該怎麼辦？',
    answer:
      '車禍發生後最重要的 5 個步驟：\n\n' +
      '1. 確保安全與檢查傷勢\n' +
      '2. 報警 (110)\n' +
      '3. 保留證據 (照片、對方資料、目擊者、行車記錄器)\n' +
      '4. 24 小時內就醫並保留病歷\n' +
      '5. 通知保險公司\n\n' +
      '過失致傷罪須在 6 個月內提出告訴，民事損害賠償時效為 2 年。\n\n' +
      '若需協助請點擊「諮詢預約」按鈕。',
  },
  {
    label: '⚖️ 勞動·資遣',
    question: '在台灣被解僱後可以拿到資遣費嗎？',
    answer:
      '依勞基法解僱可分三類：\n\n' +
      '1. 經濟性解僱 (歇業、轉讓、虧損等) — 新制每年 0.5 個月平均工資，最高 6 個月\n' +
      '2. 非可歸責於勞工之解僱 — 同上 + 預告工資\n' +
      '3. 第 12 條違紀解僱 — 無資遣費\n\n' +
      '若公司片面要求離職，請保留所有書面、訊息、電子郵件。簽名前請先諮詢律師。\n\n' +
      '請點擊「諮詢預約」按鈕說明情況。',
  },
];

const EN_REPLIES: QuickReply[] = [
  {
    label: '🏢 Company setup',
    question: 'How do I set up a company in Taiwan?',
    answer:
      'Setting up a company in Taiwan typically follows these 10 steps:\n\n' +
      '1. Company name search and reservation\n' +
      '2. Power of attorney authentication\n' +
      '3. Foreign investment approval (Investment Review Office)\n' +
      '4. Preparatory bank account\n' +
      '5. Capital remittance\n' +
      '6. Capital verification by CPA\n' +
      '7. Company registration\n' +
      '8. Tax registration\n' +
      '9. Convert preparatory account to formal account\n' +
      '10. Import/export registration (if needed)\n\n' +
      'The process usually takes 6-10 weeks. For your specific case, click "Request consultation" or email the firm.',
  },
  {
    label: '🚗 Traffic accident',
    question: 'What should I do after a traffic accident in Taiwan?',
    answer:
      'After a traffic accident, follow these 5 steps:\n\n' +
      '1. Ensure safety and check for injuries\n' +
      '2. Call police (110)\n' +
      '3. Preserve evidence (photos, other party info, witnesses, dashcam)\n' +
      '4. Get medical attention within 24 hours and keep records\n' +
      '5. Notify insurance company\n\n' +
      'Negligent injury complaints must be filed within 6 months; civil damages have a 2-year statute of limitations.\n\n' +
      'For assistance, click "Request consultation".',
  },
  {
    label: '⚖️ Labor / dismissal',
    question: 'Can I get severance after being dismissed in Taiwan?',
    answer:
      'Under the Labor Standards Act, dismissals fall into 3 categories:\n\n' +
      '1. Economic dismissal — 0.5 month average salary per year (new system), max 6 months\n' +
      '2. Non-fault dismissal — same severance + advance notice pay\n' +
      '3. Cause-based dismissal (Art. 12) — no severance\n\n' +
      'If your company unilaterally asks you to leave, preserve all written notices, messages, and emails. Consult a lawyer before signing anything.\n\n' +
      'Click "Request consultation" to share your situation.',
  },
];

export function getQuickReplies(locale: Locale): QuickReply[] {
  if (locale === 'ko') return KO_REPLIES;
  if (locale === 'zh-hant') return ZH_REPLIES;
  return EN_REPLIES;
}

/**
 * A context-aware follow-up suggestion the user can click AFTER receiving
 * an assistant response. Unlike QuickReply (which carries a pre-baked
 * answer), the follow-up text is sent to the real chat API so the LLM
 * can ground the answer in the user's actual conversation context.
 */
export interface FollowUpSuggestion {
  label: string;
  message: string;
}

type FollowUpKey =
  | 'company_setup'
  | 'traffic_accident'
  | 'criminal_investigation'
  | 'labor'
  | 'divorce_family'
  | 'inheritance'
  | 'logistics'
  | 'cosmetics'
  | 'general'
  | 'unknown';

const FOLLOW_UP_MAP_KO: Record<FollowUpKey, FollowUpSuggestion[]> = {
  company_setup: [
    { label: '최소 자본금', message: '외국인이 대만에서 회사를 세울 때 최소 자본금 요건이 어떻게 되나요?' },
    { label: '자회사 vs 지점', message: '대만에서 자회사와 지점의 차이는 무엇이고 어떤 경우에 어느 쪽이 유리한가요?' },
    { label: '취업허가', message: '법인을 세운 뒤 한국 직원을 채용하려면 취업허가 절차가 어떻게 되나요?' },
  ],
  traffic_accident: [
    { label: '합의 대응', message: '상대방이 합의를 먼저 요청해 왔는데 어떤 기준으로 받아야 하나요?' },
    { label: '보험 청구', message: '대만에서 교통사고 보험 청구 절차가 어떻게 되나요?' },
    { label: '과실 비율', message: '과실 비율은 어떻게 정해지며 이의를 제기할 수 있나요?' },
  ],
  criminal_investigation: [
    { label: '묵비권 행사', message: '경찰이나 검찰 조사에서 묵비권은 어떻게 행사하고 어떤 상황에 쓰는 것이 안전한가요?' },
    { label: '변호사 선임', message: '조사 전에 변호사 선임은 어느 시점이 좋고 비용은 대략 얼마 정도 되나요?' },
    { label: '구속 vs 불구속', message: '구속과 불구속 조사는 어떻게 결정되며 구속 가능성을 낮추려면 무엇을 해야 하나요?' },
  ],
  labor: [
    { label: '부당해고 구제', message: '부당해고라고 판단되면 어디에 어떻게 구제 신청을 해야 하나요?' },
    { label: '퇴직금 계산', message: '대만 노동기준법상 퇴직금은 신제도·구제도가 다르다고 들었는데 어떻게 계산하나요?' },
    { label: '권고사직 거부', message: '회사가 권고사직을 요구하지만 거부하고 싶은데 어떻게 대응해야 하나요?' },
  ],
  divorce_family: [
    { label: '친권·양육권', message: '친권과 양육권이 어떻게 다르고, 외국인 배우자일 때 결정 기준은 무엇인가요?' },
    { label: '재산분할', message: '혼인 중 취득 재산의 분할 청구는 언제까지 가능하고 한국 재산도 포함되나요?' },
    { label: '국제 이혼', message: '한국-대만 국제 이혼에서 관할법원과 준거법은 어떻게 정해지나요?' },
  ],
  inheritance: [
    { label: '유류분', message: '대만에도 유류분 제도가 있나요? 한국과 비교해 어떤 차이가 있나요?' },
    { label: '상속포기', message: '상속포기는 언제까지 어떻게 해야 하고 후순위에도 영향을 주나요?' },
    { label: '외국인 상속', message: '한국 국적자가 대만에 있는 부동산·예금을 상속받는 절차는 어떻게 되나요?' },
  ],
  logistics: [
    { label: '운송업 허가', message: '대만에서 운송업·물류업을 시작하려면 어떤 허가가 필요하고 자본금은 얼마 이상이어야 하나요?' },
    { label: '통관·검역', message: '한국에서 상품을 수입할 때 통관 검역은 얼마나 걸리고 비용은 어떻게 발생하나요?' },
    { label: '창고 임대', message: '대만에서 물류 창고를 임대하려고 하는데 계약 시 주의할 조항이 무엇인가요?' },
  ],
  cosmetics: [
    { label: 'PIF 등록', message: '대만 화장품 PIF 등록 절차와 기간, 필요 서류는 어떻게 되나요?' },
    { label: '광고 규제', message: '화장품 광고에서 효능·효과 표현은 어디까지 허용되고 금지되는 표현은 무엇인가요?' },
    { label: '라벨 표기', message: '제품 라벨에 한자·성분표·원산지 표기 요건은 어떻게 되나요?' },
  ],
  general: [
    { label: '상담 가능 분야', message: '호정국제는 어떤 법률 분야를 주로 다루고 있나요?' },
    { label: '상담 비용', message: '직접 변호사 상담 시 비용은 대략 어떻게 책정되나요?' },
    { label: '연락 방식', message: '이메일 외에 LINE, 카카오톡, 전화 등 어떤 방식으로 연락할 수 있나요?' },
  ],
  unknown: [
    { label: '질문 예시', message: '어떤 유형의 질문에 AI가 먼저 답해 줄 수 있나요?' },
    { label: '사람 상담 연결', message: '지금 바로 변호사와 직접 상담하려면 어떻게 해야 하나요?' },
  ],
};

const FOLLOW_UP_MAP_ZH: Record<FollowUpKey, FollowUpSuggestion[]> = {
  company_setup: [
    { label: '最低資本', message: '外國人在台灣設立公司的最低資本額大約是多少？' },
    { label: '子公司 vs 分公司', message: '子公司和分公司有什麼差別？哪種情況下比較有利？' },
    { label: '工作許可', message: '設立公司後要聘僱韓國員工，工作許可申請流程為何？' },
  ],
  traffic_accident: [
    { label: '和解應對', message: '對方主動提出和解要怎麼判斷金額是否合理？' },
    { label: '保險理賠', message: '台灣車禍保險理賠流程大致如何？' },
    { label: '過失比例', message: '過失比例如何認定？可以對鑑定結果提出異議嗎？' },
  ],
  criminal_investigation: [
    { label: '緘默權', message: '警詢或偵查時的緘默權該如何行使？什麼情況下適合？' },
    { label: '委任律師', message: '委任律師的時機與費用大致為何？' },
    { label: '羈押與交保', message: '羈押與交保如何決定？想降低羈押可能性應做什麼？' },
  ],
  labor: [
    { label: '不當解僱救濟', message: '若懷疑是不當解僱，應向哪個機關申請救濟？' },
    { label: '資遣費計算', message: '台灣勞基法新制與舊制資遣費如何計算？' },
    { label: '拒絕合意離職', message: '公司要求合意離職但我不願意，該如何應對？' },
  ],
  divorce_family: [
    { label: '親權與監護', message: '親權與監護權有何不同？外籍配偶情形下如何判斷？' },
    { label: '剩餘財產分配', message: '婚後取得的財產分配請求權何時可主張？境外財產是否納入？' },
    { label: '跨國離婚', message: '台韓跨國離婚時的管轄法院與準據法如何決定？' },
  ],
  inheritance: [
    { label: '特留分', message: '台灣是否有特留分制度？與韓國制度相比有何差異？' },
    { label: '拋棄繼承', message: '拋棄繼承的期限與程序為何？是否會影響次順位繼承人？' },
    { label: '外國人繼承', message: '韓國國籍人士繼承台灣不動產或存款的程序為何？' },
  ],
  logistics: [
    { label: '運輸業許可', message: '在台灣經營物流或運輸業需要哪些許可、資本額為何？' },
    { label: '通關檢驗', message: '從韓國進口商品時通關檢驗要多久？有哪些費用？' },
    { label: '倉儲租賃', message: '在台灣租賃物流倉庫時應注意的合約條款有哪些？' },
  ],
  cosmetics: [
    { label: 'PIF 登錄', message: '台灣化妝品 PIF 登錄流程、期程與必要文件為何？' },
    { label: '廣告規範', message: '化妝品廣告的功效表現能到哪個界線？哪些用詞禁止？' },
    { label: '標示要求', message: '產品標示在成分、原產地與中文標示上有何要求？' },
  ],
  general: [
    { label: '服務領域', message: '昊鼎國際法律事務所主要處理哪些法律領域？' },
    { label: '諮詢費用', message: '直接預約律師諮詢的費用大致如何計算？' },
    { label: '聯絡方式', message: '除了 Email 之外，還可以透過 LINE、KakaoTalk 或電話聯絡嗎？' },
  ],
  unknown: [
    { label: '可提問的問題', message: 'AI 可以先回答哪些類型的問題？' },
    { label: '轉人工諮詢', message: '想現在就與律師直接對談應該怎麼做？' },
  ],
};

const FOLLOW_UP_MAP_EN: Record<FollowUpKey, FollowUpSuggestion[]> = {
  company_setup: [
    { label: 'Minimum capital', message: 'What is the minimum capital requirement for a foreigner to set up a company in Taiwan?' },
    { label: 'Subsidiary vs branch', message: 'What are the practical differences between setting up a subsidiary and a branch office in Taiwan?' },
    { label: 'Work permits', message: 'After establishing a company, how do I sponsor Korean employees for work permits?' },
  ],
  traffic_accident: [
    { label: 'Settlement offer', message: 'The other party offered a private settlement — how should I evaluate whether to accept?' },
    { label: 'Insurance claim', message: 'What does the insurance claim process look like after a traffic accident in Taiwan?' },
    { label: 'Fault ratio', message: 'How is the fault ratio determined and can I dispute it?' },
  ],
  criminal_investigation: [
    { label: 'Right to silence', message: 'How do I exercise the right to silence during police or prosecutor questioning in Taiwan?' },
    { label: 'Retaining counsel', message: 'When should I retain a lawyer and what are the typical fees?' },
    { label: 'Detention vs bail', message: 'How do courts decide between detention and bail, and how can I reduce detention risk?' },
  ],
  labor: [
    { label: 'Wrongful termination', message: 'If I suspect wrongful termination, which agency handles the complaint in Taiwan?' },
    { label: 'Severance calculation', message: 'How is severance calculated under Taiwan\'s old vs new labor pension systems?' },
    { label: 'Refusing resignation', message: 'My employer is pressuring me to sign a resignation — how should I respond?' },
  ],
  divorce_family: [
    { label: 'Custody vs guardianship', message: 'What is the difference between parental rights and custody in Taiwan, especially with a foreign spouse?' },
    { label: 'Asset division', message: 'How and when can I claim division of marital assets, including assets held abroad?' },
    { label: 'Cross-border divorce', message: 'In a Korea-Taiwan divorce, how are jurisdiction and governing law decided?' },
  ],
  inheritance: [
    { label: 'Forced share', message: 'Does Taiwan have a forced heirship / legitime system? How does it compare to Korea?' },
    { label: 'Disclaiming inheritance', message: 'What is the deadline and procedure to disclaim an inheritance in Taiwan?' },
    { label: 'Foreign heirs', message: 'As a Korean citizen, how do I inherit property or bank accounts located in Taiwan?' },
  ],
  logistics: [
    { label: 'Licenses', message: 'What licenses and minimum capital are required to operate a logistics or transport business in Taiwan?' },
    { label: 'Customs clearance', message: 'How long does customs clearance take for goods imported from Korea and what costs apply?' },
    { label: 'Warehouse lease', message: 'What clauses should I watch out for when leasing a logistics warehouse in Taiwan?' },
  ],
  cosmetics: [
    { label: 'PIF registration', message: 'What is the PIF registration process for cosmetics in Taiwan, including timeline and required documents?' },
    { label: 'Advertising rules', message: 'What efficacy claims are allowed in cosmetics advertising, and what language is prohibited?' },
    { label: 'Labeling', message: 'What are the Chinese labeling, ingredient and origin requirements for imported cosmetics?' },
  ],
  general: [
    { label: 'Practice areas', message: 'What legal areas does Hovering International mainly handle?' },
    { label: 'Consultation fees', message: 'How are direct lawyer consultation fees typically calculated?' },
    { label: 'Contact channels', message: 'Besides email, can I reach the firm via LINE, KakaoTalk, or phone?' },
  ],
  unknown: [
    { label: 'Example questions', message: 'What kinds of questions can the AI answer first?' },
    { label: 'Speak to a lawyer', message: 'How can I speak to a lawyer directly right now?' },
  ],
};

function asFollowUpKey(raw: string): FollowUpKey {
  switch (raw) {
    case 'company_setup':
    case 'traffic_accident':
    case 'criminal_investigation':
    case 'labor':
    case 'divorce_family':
    case 'inheritance':
    case 'logistics':
    case 'cosmetics':
    case 'general':
    case 'unknown':
      return raw;
    default:
      return 'unknown';
  }
}

export function getFollowUpSuggestions(
  locale: Locale,
  classification: string,
): FollowUpSuggestion[] {
  const key = asFollowUpKey(classification);
  if (locale === 'ko') return FOLLOW_UP_MAP_KO[key];
  if (locale === 'zh-hant') return FOLLOW_UP_MAP_ZH[key];
  return FOLLOW_UP_MAP_EN[key];
}
