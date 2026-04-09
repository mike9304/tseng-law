import type { Locale } from '@/lib/locales';
import type { ConsultationCategory, ConsultationNextField, ConsultationRiskLevel } from '@/lib/consultation/types';

type ConsultationQuickAction = {
  label: string;
  message: string;
};

type ConsultationCopy = {
  sectionLabel: string;
  sectionTitle: string;
  sectionDescription: string;
  assistantTitle: string;
  assistantDescription: string;
  assistantInitialMessage: string;
  assistantFallbackError: string;
  assistantPendingLabel: string;
  quickActionsLabel: string;
  quickActions: ConsultationQuickAction[];
  channelsTitle: string;
  channelsDescription: string;
  attorneyReviewTitle: string;
  attorneyReviewDescription: string;
  attorneyEmailLabel: string;
  submitTitle: string;
  submitDescription: string;
  disclaimer: string;
  submitSuccess: string;
  submitFailure: string;
  sendLabel: string;
  sendingLabel: string;
  submitLabel: string;
  submittingLabel: string;
  humanReviewRecommended: string;
  formLabels: {
    name: string;
    email: string;
    phoneOrMessenger: string;
    category: string;
    urgency: string;
    summary: string;
    preferredContact: string;
    companyOrOrganization: string;
    countryOrResidence: string;
    preferredTime: string;
    hasDocuments: string;
    consent: string;
  };
  placeholders: {
    input: string;
    name: string;
    email: string;
    phoneOrMessenger: string;
    summary: string;
    companyOrOrganization: string;
    countryOrResidence: string;
    preferredTime: string;
    hasDocuments: string;
  };
  fieldPrompts: Record<Exclude<ConsultationNextField, 'none'>, string>;
  categoryLabels: Record<ConsultationCategory, string>;
  urgencyOptions: { value: string; label: string }[];
  preferredContactOptions: { value: string; label: string }[];
  riskLabels: Record<ConsultationRiskLevel, string>;
};

const consultationCopy: Record<Locale, ConsultationCopy> = {
  ko: {
    sectionLabel: 'AI CONSULTATION',
    sectionTitle: 'AI 상담 도우미',
    sectionDescription:
      '호정 칼럼과 상담 흐름을 바탕으로 기본 질문에 먼저 답하고, 사건이 구체적이거나 긴급하면 사람 상담으로 자연스럽게 넘깁니다.',
    assistantTitle: 'AI 초기 상담',
    assistantDescription:
      '일반 안내와 준비자료 정리에 적합합니다. 개별 사건의 최종 판단이나 승소 가능성은 AI가 확정하지 않습니다.',
    assistantInitialMessage:
      '안녕하세요. 호정 AI 상담 도우미입니다. 회사설립, 교통사고, 노동, 이혼·상속처럼 공개 칼럼으로 먼저 안내할 수 있는 질문은 간단히 정리해 드리고, 구체 사건은 사람 상담으로 연결해 드리겠습니다.',
    assistantFallbackError:
      '지금은 AI 응답 연결이 불안정합니다. 아래 상담 신청란을 이용하시거나 LINE / KakaoTalk / 이메일로 바로 문의해 주세요.',
    assistantPendingLabel: 'AI가 질문을 정리하고 있습니다.',
    quickActionsLabel: '자주 시작하는 질문',
    quickActions: [
      { label: '대만 회사설립 절차', message: '대만 회사설립 절차를 간단히 알려주세요.' },
      { label: '교통사고 직후 대응', message: '대만에서 교통사고가 났을 때 바로 무엇을 해야 하나요?' },
      { label: '퇴직금·해고 문의', message: '대만에서 퇴직금이나 해고 관련 기본 안내를 받을 수 있을까요?' },
      { label: '이혼·재산분할 문의', message: '대만 이혼과 재산분할 기본 흐름을 알려주세요.' },
    ],
    channelsTitle: '사람 상담으로 바로 전환',
    channelsDescription:
      '긴급하거나 사실관계가 복잡한 경우에는 AI 설명보다 LINE, KakaoTalk, 이메일, 전화가 더 적합합니다.',
    attorneyReviewTitle: '최종 판단은 대만 변호사 상담',
    attorneyReviewDescription:
      'AI 답변은 참고용이며 틀릴 수 있습니다. 구체 사건의 최종 판단과 대응 방향은 대만 변호사 검토가 필요합니다.',
    attorneyEmailLabel: '변호사 상담 이메일',
    submitTitle: '상담 신청 정보 남기기',
    submitDescription:
      '이름, 연락처, 사건 요약을 남기면 변호사 또는 실무팀이 이메일로 먼저 검토할 수 있게 전달합니다. 급한 경우에는 이메일 직접 문의도 함께 권장합니다.',
    disclaimer:
      '이 응답은 공개된 일반 정보와 사이트 내부 칼럼을 바탕으로 한 초기 안내입니다. AI는 틀릴 수 있으며, 개별 사건의 최종 판단은 대만 변호사 검토가 필요합니다.',
    submitSuccess:
      '상담 요청이 접수되었습니다. 담당 검토용 이메일로 전달했고, 접수 번호는',
    submitFailure:
      '지금은 자동 접수가 완료되지 않았습니다. LINE / KakaoTalk / 전화 또는 변호사 이메일로 바로 문의해 주세요.',
    sendLabel: '질문 보내기',
    sendingLabel: '질문 전송 중...',
    submitLabel: '상담 신청 보내기',
    submittingLabel: '상담 신청 전송 중...',
    humanReviewRecommended: '이 질문은 사람이 바로 검토하는 편이 안전합니다.',
    formLabels: {
      name: '이름',
      email: '이메일',
      phoneOrMessenger: '전화번호 또는 메신저 ID',
      category: '문의 유형',
      urgency: '긴급도',
      summary: '사건 요약',
      preferredContact: '선호 연락 방식',
      companyOrOrganization: '회사명 또는 소속',
      countryOrResidence: '국가 또는 거주지',
      preferredTime: '선호 연락 시간대',
      hasDocuments: '현재 보유 자료',
      consent: '상담 접수 목적의 개인정보 처리와 연락 전달에 동의합니다.',
    },
    placeholders: {
      input: '예: 대만 회사를 설립하려면 절차가 어떻게 되나요?',
      name: '홍길동',
      email: 'name@example.com',
      phoneOrMessenger: '전화번호, LINE ID, KakaoTalk ID 중 편한 방식',
      summary: '사건 배경, 현재 진행 상태, 가장 궁금한 점을 간단히 적어 주세요.',
      companyOrOrganization: '회사명 또는 소속이 있으면 적어 주세요.',
      countryOrResidence: '예: 한국 / 대만 / 일본',
      preferredTime: '예: 평일 오후, 한국시간 오전 등',
      hasDocuments: '계약서, 사진, 판결문, 메신저 기록 등이 있으면 적어 주세요.',
    },
    fieldPrompts: {
      name: '이름부터 알려주시면 접수 흐름을 이어갈 수 있습니다.',
      email: '연락받을 이메일을 알려주시면 좋습니다.',
      phone_or_messenger: '전화번호나 LINE / KakaoTalk ID 중 편한 연락 수단을 남겨 주세요.',
      category: '문의 유형을 선택해 주시면 담당 검토 방향을 더 빨리 정리할 수 있습니다.',
      urgency: '언제가 가장 급한지 긴급도를 알려 주세요.',
      summary: '지금 상황을 2~3문장으로 요약해 주시면 접수 품질이 좋아집니다.',
      preferred_contact: '선호 연락 방식을 적어 주시면 연결이 더 빠릅니다.',
      consent: '상담 접수 전 개인정보 처리 동의가 필요합니다.',
    },
    categoryLabels: {
      company_setup: '회사설립·투자',
      traffic_accident: '교통사고·손해배상',
      criminal_investigation: '경찰·검찰·체포 대응',
      labor: '노동·퇴직금·해고',
      divorce_family: '이혼·친권·가사',
      inheritance: '상속·유언',
      logistics: '물류업·운송업',
      cosmetics: '화장품 진출·등록',
      general: '일반 문의',
      unknown: '분류 전',
    },
    urgencyOptions: [
      { value: 'low', label: '일반 문의' },
      { value: 'medium', label: '조만간 확인 필요' },
      { value: 'high', label: '빠른 검토 필요' },
      { value: 'urgent', label: '오늘·내일 대응 필요' },
    ],
    preferredContactOptions: [
      { value: 'email', label: '이메일' },
      { value: 'phone', label: '전화' },
      { value: 'line', label: 'LINE' },
      { value: 'kakao', label: 'KakaoTalk' },
    ],
    riskLabels: {
      L1: '일반 안내 가능',
      L2: '추가 확인 필요',
      L3: '사람 상담 우선',
      L4: '긴급·위기 대응',
    },
  },
  'zh-hant': {
    sectionLabel: 'AI CONSULTATION',
    sectionTitle: 'AI 諮詢助手',
    sectionDescription:
      'AI 會先依昊鼎網站的文章與諮詢流程提供一般說明；若案件具體、敏感或緊急，則會引導至人工諮詢。',
    assistantTitle: 'AI 初步諮詢',
    assistantDescription:
      '適合先整理一般流程與準備資料。個別案件的最終法律判斷不會由 AI 直接下結論。',
    assistantInitialMessage:
      '您好，我是昊鼎 AI 諮詢助手。若是公司設立、車禍、勞動、離婚或繼承等已整理過的公開主題，我會先提供一般說明；若情況具體或緊急，會協助您轉人工諮詢。',
    assistantFallbackError:
      '目前 AI 回覆連線不穩定。請改用下方諮詢表單，或直接透過 LINE / KakaoTalk / Email 聯繫我們。',
    assistantPendingLabel: 'AI 正在整理您的問題。',
    quickActionsLabel: '常見起手問題',
    quickActions: [
      { label: '台灣公司設立流程', message: '請先簡單說明台灣公司設立流程。' },
      { label: '車禍當下怎麼處理', message: '在台灣發生車禍後，第一時間應該怎麼做？' },
      { label: '資遣與資遣費', message: '可以先說明台灣資遣與資遣費的基本概念嗎？' },
      { label: '離婚與財產分配', message: '請先說明台灣離婚與財產分配的基本流程。' },
    ],
    channelsTitle: '直接轉人工諮詢',
    channelsDescription:
      '若案件緊急、涉及期限，或事實關係複雜，LINE、KakaoTalk、Email、電話會比 AI 更合適。',
    attorneyReviewTitle: '最終判斷請交由台灣律師',
    attorneyReviewDescription:
      'AI 回覆僅供初步參考，仍可能有誤。具體案件的最終法律判斷與應對方向，應由台灣律師確認。',
    attorneyEmailLabel: '律師諮詢 Email',
    submitTitle: '留下諮詢資料',
    submitDescription:
      '留下姓名、聯絡方式與案件摘要後，我們會整理成 Email 供律師或實務團隊先行檢閱。若案件急迫，也建議直接寄信聯繫。',
    disclaimer:
      '本回覆僅根據公開資訊與網站文章提供初步說明。AI 仍可能有誤，個案的最終法律判斷應由台灣律師確認。',
    submitSuccess:
      '諮詢需求已送出，並已整理寄送給負責檢閱的信箱。受理編號為',
    submitFailure:
      '目前自動送件未完成，請改用 LINE / KakaoTalk / 電話，或直接使用律師 Email 聯繫我們。',
    sendLabel: '送出問題',
    sendingLabel: '送出中...',
    submitLabel: '送出諮詢',
    submittingLabel: '送件中...',
    humanReviewRecommended: '此問題較適合由人工直接確認。',
    formLabels: {
      name: '姓名',
      email: 'Email',
      phoneOrMessenger: '電話或即時通訊 ID',
      category: '問題類型',
      urgency: '急迫程度',
      summary: '案件摘要',
      preferredContact: '偏好聯絡方式',
      companyOrOrganization: '公司名稱或所屬',
      countryOrResidence: '國家或居住地',
      preferredTime: '希望聯絡時段',
      hasDocuments: '目前手上資料',
      consent: '我同意為了受理諮詢而處理個人資料並提供給承辦人員。',
    },
    placeholders: {
      input: '例如：如果要在台灣設立公司，大致流程是什麼？',
      name: '王小明',
      email: 'name@example.com',
      phoneOrMessenger: '電話、LINE ID、KakaoTalk ID 擇一即可',
      summary: '請簡單描述背景、目前進度與最想先確認的重點。',
      companyOrOrganization: '若有公司或單位，可一併填寫。',
      countryOrResidence: '例如：韓國 / 台灣 / 日本',
      preferredTime: '例如：平日下午、台灣時間上午',
      hasDocuments: '例如：契約、照片、判決、訊息紀錄等',
    },
    fieldPrompts: {
      name: '請先留下姓名，方便接續整理諮詢資料。',
      email: '若方便，請留下 Email。',
      phone_or_messenger: '請留下電話、LINE 或 KakaoTalk 中您方便聯繫的方式。',
      category: '請選擇問題類型，方便判斷承辦方向。',
      urgency: '請說明急迫程度。',
      summary: '請用 2 到 3 句簡要描述目前情況。',
      preferred_contact: '請告訴我們您希望的聯絡方式。',
      consent: '正式送件前需要您的個資處理同意。',
    },
    categoryLabels: {
      company_setup: '公司設立・投資',
      traffic_accident: '車禍・損害賠償',
      criminal_investigation: '警察・檢察・拘提應對',
      labor: '勞動・資遣・離職',
      divorce_family: '離婚・親權・家事',
      inheritance: '繼承・遺囑',
      logistics: '物流業・運輸業',
      cosmetics: '化妝品進入市場・登錄',
      general: '一般詢問',
      unknown: '尚未分類',
    },
    urgencyOptions: [
      { value: 'low', label: '一般詢問' },
      { value: 'medium', label: '近期需要確認' },
      { value: 'high', label: '需要儘快檢視' },
      { value: 'urgent', label: '今天或明天就要處理' },
    ],
    preferredContactOptions: [
      { value: 'email', label: 'Email' },
      { value: 'phone', label: '電話' },
      { value: 'line', label: 'LINE' },
      { value: 'kakao', label: 'KakaoTalk' },
    ],
    riskLabels: {
      L1: '可提供一般說明',
      L2: '需要補充確認',
      L3: '建議人工優先',
      L4: '緊急或高風險',
    },
  },
  en: {
    sectionLabel: 'AI CONSULTATION',
    sectionTitle: 'AI Consultation Assistant',
    sectionDescription:
      'The assistant uses Hovering’s public columns and consultation flow to answer basic questions first, then routes complex matters to a human review path.',
    assistantTitle: 'AI First Intake',
    assistantDescription:
      'Best for general guidance and preparation checklists. The AI does not give a final legal opinion on your specific case.',
    assistantInitialMessage:
      'Hello. I am Hovering’s AI consultation assistant. I can help with general guidance on company setup, traffic accidents, labor issues, divorce, inheritance, and other topics covered by the firm’s public columns, then move you into human review when the case becomes specific or urgent.',
    assistantFallbackError:
      'The AI connection is unstable right now. Please use the intake form below or contact the firm directly through LINE, KakaoTalk, or email.',
    assistantPendingLabel: 'The assistant is organizing your question.',
    quickActionsLabel: 'Common starting points',
    quickActions: [
      { label: 'Taiwan company setup', message: 'Can you explain the basic process for setting up a company in Taiwan?' },
      { label: 'Traffic accident steps', message: 'What should I do first after a traffic accident in Taiwan?' },
      { label: 'Severance and termination', message: 'Can you explain the basics of severance or termination issues in Taiwan?' },
      { label: 'Divorce and asset division', message: 'Can you explain the basic flow of divorce and asset division in Taiwan?' },
    ],
    channelsTitle: 'Move directly to human review',
    channelsDescription:
      'If the matter is urgent, deadline-driven, or fact-intensive, LINE, KakaoTalk, email, or phone will be more appropriate than AI guidance.',
    attorneyReviewTitle: 'Final judgment should come from a Taiwan lawyer',
    attorneyReviewDescription:
      'The AI response is only a first guide and can still be wrong. A Taiwan lawyer should review any case-specific decision or action plan.',
    attorneyEmailLabel: 'Lawyer review email',
    submitTitle: 'Leave your consultation details',
    submitDescription:
      'If you share your name, contact method, and case summary, the system will package it into an email for lawyer or operations review. For urgent matters, direct email contact is also recommended.',
    disclaimer:
      'This response is an initial general guide based on public information and the firm’s own columns. The AI can still be wrong, and the final judgment for your matter should come from a Taiwan lawyer.',
    submitSuccess:
      'Your consultation request has been received and forwarded by email for review. Your intake ID is',
    submitFailure:
      'Automatic intake is unavailable right now. Please contact the firm directly through LINE, KakaoTalk, phone, or the lawyer review email.',
    sendLabel: 'Send question',
    sendingLabel: 'Sending...',
    submitLabel: 'Send intake',
    submittingLabel: 'Submitting...',
    humanReviewRecommended: 'This question is better handled by a human reviewer.',
    formLabels: {
      name: 'Name',
      email: 'Email',
      phoneOrMessenger: 'Phone or messenger ID',
      category: 'Inquiry type',
      urgency: 'Urgency',
      summary: 'Case summary',
      preferredContact: 'Preferred contact method',
      companyOrOrganization: 'Company or organization',
      countryOrResidence: 'Country or residence',
      preferredTime: 'Preferred contact time',
      hasDocuments: 'Documents already available',
      consent: 'I agree to the processing of my information for consultation intake and follow-up contact.',
    },
    placeholders: {
      input: 'Example: What is the basic process for setting up a company in Taiwan?',
      name: 'Jane Doe',
      email: 'name@example.com',
      phoneOrMessenger: 'Phone number, LINE ID, or KakaoTalk ID',
      summary: 'Briefly describe the background, current stage, and the main point you want reviewed first.',
      companyOrOrganization: 'If relevant, include your company or organization.',
      countryOrResidence: 'Example: Korea / Taiwan / Japan',
      preferredTime: 'Example: weekday afternoon, Taipei morning',
      hasDocuments: 'Example: contract, photos, judgment, chat records',
    },
    fieldPrompts: {
      name: 'Please share your name first so the intake can move forward.',
      email: 'If possible, please leave an email address.',
      phone_or_messenger: 'Please leave the phone number or messenger ID that is easiest for you.',
      category: 'Please select the inquiry type so the review path can be triaged faster.',
      urgency: 'Please tell us how urgent the matter is.',
      summary: 'Please summarize the situation in two or three short sentences.',
      preferred_contact: 'Please tell us your preferred contact method.',
      consent: 'Consent is required before the intake can be sent.',
    },
    categoryLabels: {
      company_setup: 'Company Setup / Investment',
      traffic_accident: 'Traffic Accident / Damages',
      criminal_investigation: 'Police / Prosecutor / Detention',
      labor: 'Labor / Severance / Termination',
      divorce_family: 'Divorce / Custody / Family',
      inheritance: 'Inheritance / Wills',
      logistics: 'Logistics / Transport',
      cosmetics: 'Cosmetics / Market Entry',
      general: 'General Inquiry',
      unknown: 'Unclassified',
    },
    urgencyOptions: [
      { value: 'low', label: 'General' },
      { value: 'medium', label: 'Needs review soon' },
      { value: 'high', label: 'Needs quick review' },
      { value: 'urgent', label: 'Needs action today or tomorrow' },
    ],
    preferredContactOptions: [
      { value: 'email', label: 'Email' },
      { value: 'phone', label: 'Phone' },
      { value: 'line', label: 'LINE' },
      { value: 'kakao', label: 'KakaoTalk' },
    ],
    riskLabels: {
      L1: 'General guidance possible',
      L2: 'Needs more detail',
      L3: 'Human review recommended',
      L4: 'Urgent or high-risk',
    },
  },
};

export function getConsultationCopy(locale: Locale): ConsultationCopy {
  return consultationCopy[locale];
}

export function getConsultationFieldPrompt(locale: Locale, field: ConsultationNextField): string {
  if (field === 'none') return '';
  return consultationCopy[locale].fieldPrompts[field];
}

export function getConsultationCategoryLabel(locale: Locale, category: ConsultationCategory): string {
  return consultationCopy[locale].categoryLabels[category];
}

export function getConsultationRiskLabel(locale: Locale, risk: ConsultationRiskLevel): string {
  return consultationCopy[locale].riskLabels[risk];
}
