import type { Locale } from '@/lib/locales';

export interface QuickReply {
  /** Short label shown on chip */
  label: string;
  /** Full message inserted as user bubble */
  question: string;
  /** Pre-written assistant response, served instantly without API call */
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
      '구체적인 사례 검토는 상담 접수하기 버튼을 눌러주시거나 wei@hoveringlaw.com.tw 로 문의해 주세요.',
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
      '📞 한국 직통: 010-2992-9304\n' +
      '📧 이메일: wei@hoveringlaw.com.tw\n\n' +
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
      '平均處理時間約 6 至 10 週。具體案例請透過「諮詢預約」按鈕或 wei@hoveringlaw.com.tw 聯繫。',
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
      'The process usually takes 6-10 weeks. For your specific case, click "Request consultation" or email wei@hoveringlaw.com.tw.',
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
