import { getSensitiveInformationWarning } from '@/lib/consultation/public-contact';
import { AI_INTAKE_REQUIREMENTS_VERSION } from '@/lib/ai-intake/constants';
import { getAiIntakePublicOrigin } from '@/lib/ai-intake/origin';
import type { AiIntakeCategory, AiIntakeFieldKey, AiIntakeLocale } from '@/lib/ai-intake/schemas';

export type { AiIntakeFieldKey };

type FieldSpec = {
  name: AiIntakeFieldKey;
  required: boolean;
  description: string;
  maxLength?: number;
};

type LocaleCopy = {
  localeLabel: string;
  categoryLabels: Record<AiIntakeCategory, string>;
  categoryDescriptions: Record<AiIntakeCategory, string>;
  fieldLabels: Record<AiIntakeFieldKey, string>;
  notProvided: string;
  confirmationInstruction: string;
  privacyNotice: string;
  aiLimitNotice: string;
  noRepresentationNotice: string;
  emergencyNotice: string;
  sensitiveWarning: string;
  sensitiveCorrective: string;
  emailGreeting: string;
  emailIntro: string;
  emailClosing: string;
  questions: string[];
  categoryQuestions: Partial<Record<AiIntakeCategory, string[]>>;
  duplicateMessage: string;
  sentMessage: string;
  sendingMessage: string;
  failedUnknownMessage: string;
  failedUnknownReplayMessage: string;
};

const CATEGORIES: AiIntakeCategory[] = [
  'company_setup',
  'traffic_accident',
  'criminal_investigation',
  'labor',
  'divorce_family',
  'inheritance',
  'logistics',
  'cosmetics',
  'general',
];

const COPY: Record<AiIntakeLocale, LocaleCopy> = {
  ko: {
    localeLabel: '한국어',
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
    },
    categoryDescriptions: {
      company_setup: '대만 회사 설립, 투자, 지점·자회사 관련 초기 문의',
      traffic_accident: '교통사고, 손해배상, 보험 관련 초기 문의',
      criminal_investigation: '수사, 검찰, 체포·구속 관련 초기 문의',
      labor: '근로계약, 퇴직금, 해고 관련 초기 문의',
      divorce_family: '이혼, 친권, 가사 관련 초기 문의',
      inheritance: '상속, 유언, 유류분 관련 초기 문의',
      logistics: '물류·운송업 규제 관련 초기 문의',
      cosmetics: '화장품 수입·등록·표시 관련 초기 문의',
      general: '위 분류에 해당하지 않는 대만 법률·기업 업무 초기 문의',
    },
    fieldLabels: {
      name: '이름',
      email: '이메일',
      summary: '사건 또는 업무 개요',
      locale: '언어',
      category: '문의 유형',
      phoneOrMessenger: '전화 또는 메신저',
      urgency: '긴급도 또는 기한',
      preferredContact: '선호 연락 방식',
      companyOrOrganization: '회사명 또는 소속',
      countryOrResidence: '국가 또는 거주지',
      preferredTime: '선호 연락 시간대',
      documentsAvailable: '보유 자료 종류',
      idempotencyKey: '멱등 키',
      confirmationToken: '확인 토큰',
      privacyConsent: '개인정보 처리 동의',
      userApprovedExactPreview: '정확한 미리보기 승인',
    },
    notProvided: '미기재',
    confirmationInstruction:
      '아래 제목과 본문은 서버가 법률사무소 상담 수신함으로 보낼 내용과 완전히 같습니다. 사용자에게 이 제목과 본문을 그대로 보여 주고, 사용자가 이 내용 발송을 명시한 뒤에만 동일한 필드, 동일한 idempotencyKey, confirmationToken, userApprovedExactPreview=true, privacyConsent=true 로 POST /api/ai/intake/submit 을 호출하세요.',
    privacyNotice:
      '이 접수는 상담 검토를 위해 이름, 연락처, 사건 개요를 처리합니다. 자세한 내용은 공개 개인정보 처리방침을 확인하세요. 민감식별정보·금융·여권 정보는 초기 접수에 포함하지 마세요.',
    aiLimitNotice:
      'AI는 법률 자문을 하지 않으며 틀릴 수 있습니다. 이 흐름은 상담 이메일 초안을 만들고, 사용자 확인 후에만 사무소 수신함으로 보냅니다.',
    noRepresentationNotice:
      '이 접수는 변호사-의뢰인 관계를 만들지 않고, 비밀유지·회신 기한·법적 결과를 보장하지 않습니다. 개별 사건의 판단은 변호사 검토가 필요합니다.',
    emergencyNotice:
      '급박한 위험, 체포, 의료 위급 상황이라면 이 이메일 대신 현지 긴급 구조·수사 기관에 연락하세요. 이 안내는 관할별 전화번호를 제공하지 않습니다.',
    sensitiveWarning: getSensitiveInformationWarning('ko'),
    sensitiveCorrective:
      '주민등록번호, 대만 신분증 번호, 여권번호, 카드번호, 계좌·IBAN 등 민감정보가 감지되어 미리보기를 만들지 않았습니다. 해당 값을 삭제한 뒤 개요만 다시 보내 주세요. 감지된 값은 반환하지 않습니다.',
    emailGreeting: '안녕하세요, 증준외 대만 변호사님.',
    emailIntro: '외부 AI 도구를 통한 상담 접수입니다. 아래는 이용자가 확인한 접수 내용입니다.',
    emailClosing:
      '이 메일은 초기 상담 접수입니다. 변호사-의뢰인 관계, 비밀유지, 회신 기한, 법적 결과를 보장하지 않습니다. 긴급 위험은 이 메일이 아니라 현지 긴급 기관에 연락해야 합니다.',
    questions: [
      '성함과, 해당되면 회사 또는 소속을 알려 주세요.',
      '회신 받을 이메일 주소를 알려 주세요. 전화나 메신저가 있으면 선택 사항으로 남겨 주세요.',
      '문의 유형을 선택해 주세요. 회사설립, 교통사고, 수사, 노동, 이혼·가사, 상속, 물류, 화장품, 일반 문의 중 하나입니다.',
      '핵심 사실과 지금까지의 일정을 짧게 적어 주세요. 초기 접수에는 자세한 증거 내용이 필요하지 않습니다.',
      '급한 기한이나 긴급도가 있으면 알려 주세요. 보장된 회신 시간은 없습니다.',
      '나중에 이해충돌 확인을 위해, 상대방·관련 당사자 이름은 사건 개요(summary)에만 선택적으로 적어 주세요. 식별번호는 요청하지 않으며 보내지도 마세요.',
      '현재 거주 국가 또는 지역을 알려 주세요.',
      '선호하는 언어, 연락 방식, 시간대를 알려 주세요.',
      '계약서, 사진, 판결문처럼 가지고 있는 자료의 종류만 적어 주세요. 내용, 첨부파일, URL 업로드는 보내지 마세요.',
      '주민등록번호, 여권번호, 은행·카드 번호, 신분증 원본은 절대 입력하지 마세요.',
    ],
    categoryQuestions: {
      company_setup: ['설립 또는 투자 단계에서 가장 먼저 확인하고 싶은 점을 한 문장으로 적어 주세요.'],
      traffic_accident: ['사고 발생일(대략)과 현재 상태(병원, 보험, 수사)만 짧게 적어 주세요. 진단서 내용은 보내지 마세요.'],
      criminal_investigation: ['수사 단계(조사 통지, 출석, 체포 등)만 짧게 적어 주세요. 사건번호나 신분증 번호는 보내지 마세요.'],
      labor: ['근로 관계의 현재 상태(재직, 해고 통지, 퇴직)만 짧게 적어 주세요.'],
      divorce_family: ['혼인·자녀 관련 현황을 이름 없이 역할만으로 짧게 적어 주세요.'],
      inheritance: ['피상속인과의 관계와 대만 재산 유무만 짧게 적어 주세요. 계좌번호는 보내지 마세요.'],
      logistics: ['사업 형태(운송, 창고, 포워딩)와 대만 내 활동 여부만 짧게 적어 주세요.'],
      cosmetics: ['제품 유형과 대만 수입·판매 계획 여부만 짧게 적어 주세요.'],
    },
    duplicateMessage: '같은 접수 키가 이미 처리되었습니다. 추가 이메일은 보내지 않았습니다.',
    sentMessage: '확인된 상담 이메일을 사무소 수신함으로 보냈습니다.',
    sendingMessage: '같은 접수가 현재 발송 중입니다. 추가 이메일은 보내지 않았습니다.',
    failedUnknownMessage:
      '발송 결과를 확인할 수 없습니다. 자동으로 다시 보내지 않습니다. 수신 여부를 확인하거나, 확인 후 새 미리보기와 새 키로 다시 시도해 주세요.',
    failedUnknownReplayMessage:
      '이전 발송 결과가 확인되지 않았습니다. 이 키로는 다시 보내지 않습니다. 수신함을 확인하거나 새 미리보기와 새 키를 사용하세요.',
  },
  'zh-hant': {
    localeLabel: '繁體中文',
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
    },
    categoryDescriptions: {
      company_setup: '台灣公司設立、投資、分公司或子公司的初步詢問',
      traffic_accident: '交通事故、損害賠償、保險的初步詢問',
      criminal_investigation: '調查、檢察、逮捕或羈押的初步詢問',
      labor: '勞動契約、退休金、解僱的初步詢問',
      divorce_family: '離婚、親權、家事的初步詢問',
      inheritance: '繼承、遺囑的初步詢問',
      logistics: '物流或運輸業法規的初步詢問',
      cosmetics: '化妝品進口、登錄或標示的初步詢問',
      general: '不屬於上述分類的台灣法律或企業業務初步詢問',
    },
    fieldLabels: {
      name: '姓名',
      email: '電子郵件',
      summary: '案件或業務概要',
      locale: '語言',
      category: '諮詢類型',
      phoneOrMessenger: '電話或即時通訊',
      urgency: '急迫程度或期限',
      preferredContact: '偏好聯絡方式',
      companyOrOrganization: '公司名稱或所屬',
      countryOrResidence: '國家或居住地',
      preferredTime: '希望聯絡時段',
      documentsAvailable: '目前持有的資料種類',
      idempotencyKey: '冪等鍵',
      confirmationToken: '確認權杖',
      privacyConsent: '個人資料處理同意',
      userApprovedExactPreview: '精確預覽核准',
    },
    notProvided: '未提供',
    confirmationInstruction:
      '下列主旨與本文就是伺服器將寄到事務所諮詢信箱的內容。請先完整顯示給使用者確認，只有在使用者明確同意寄出該內容後，才可用相同欄位、相同 idempotencyKey、confirmationToken、userApprovedExactPreview=true 以及 privacyConsent=true 呼叫 POST /api/ai/intake/submit。',
    privacyNotice:
      '此次受理會為諮詢檢閱處理姓名、聯絡方式與案件概要。詳情請見公開隱私權政策。請勿在初次受理中提供身分識別號碼、金融或護照資料。',
    aiLimitNotice:
      'AI 不能提供法律意見，且可能有誤。此流程只會草擬諮詢郵件，並在使用者確認後才寄到事務所信箱。',
    noRepresentationNotice:
      '此次受理不成立律師與委託人關係，也不保證保密、回覆時間或法律結果。個案判斷需由律師檢視。',
    emergencyNotice:
      '如有急迫危險、逮捕或醫療緊急情況，請改聯絡當地緊急救援或執法機關，不要依賴這封郵件。本說明不提供特定管轄區電話號碼。',
    sensitiveWarning: getSensitiveInformationWarning('zh-hant'),
    sensitiveCorrective:
      '偵測到身分證字號、護照號碼、信用卡號、帳戶或 IBAN 等敏感資料，因此未產生預覽。請刪除那些內容後只再送出概要。系統不會回傳被偵測到的值。',
    emailGreeting: '曾雋崴律師您好：',
    emailIntro: '這是經由外部 AI 工具確認後的諮詢受理內容。',
    emailClosing:
      '本郵件僅為初步諮詢受理，不成立律師與委託人關係，亦不保證保密、回覆期限或法律結果。如有緊急危險，應聯絡當地緊急機關，而非依賴本郵件。',
    questions: [
      '請提供您的姓名，以及（如適用）公司或所屬單位。',
      '請提供可回覆的電子郵件。電話或即時通訊為選填。',
      '請選擇諮詢類型：公司設立、車禍、刑事調查、勞動、離婚家事、繼承、物流、化妝品或一般詢問。',
      '請簡短說明關鍵事實與目前時程。初次受理不需要證據全文。',
      '如有期限或急迫性請說明。我們不保證回覆時間。',
      '為日後利益衝突檢查，可把相對人或相關當事人的姓名（僅姓名）寫在概要（summary）。請勿提供身分識別號碼；本受付也不要求提供。',
      '請說明目前居住國家或地區。',
      '請說明偏好語言、聯絡方式與時段。',
      '請只列出目前持有的文件種類（例如契約、照片、判決）。請勿傳送內容、附件或檔案網址。',
      '請勿提供身分證字號、護照號碼、銀行或信用卡資料。',
    ],
    categoryQuestions: {
      company_setup: ['請用一句話說明您最想先確認的設立或投資問題。'],
      traffic_accident: ['請只簡短說明事故大約日期與目前狀態（就醫、保險、調查）。請勿傳送病歷內容。'],
      criminal_investigation: ['請只簡短說明目前程序階段。請勿提供案號或身分證件號碼。'],
      labor: ['請只簡短說明目前勞動關係狀態（在職、資遣通知、離職）。'],
      divorce_family: ['請用角色而非完整身分資料，簡短說明婚姻或子女現況。'],
      inheritance: ['請只簡短說明與被繼承人之關係，以及是否涉及台灣財產。請勿提供帳號。'],
      logistics: ['請只簡短說明事業型態，以及是否在台灣營運。'],
      cosmetics: ['請只簡短說明產品類型，以及是否計畫進口或在台灣銷售。'],
    },
    duplicateMessage: '相同的受理鍵已處理過，因此沒有再次寄信。',
    sentMessage: '已將確認後的諮詢郵件寄到事務所信箱。',
    sendingMessage: '相同受理正在寄送中，因此沒有再次寄信。',
    failedUnknownMessage:
      '無法確認寄送結果，系統不會自動重寄。請確認是否已寄達，或在明確確認後使用新的預覽與新的鍵再試。',
    failedUnknownReplayMessage:
      '先前寄送結果仍無法確認。此鍵不會再次寄信。請檢查信箱，或改用新的預覽與新的鍵。',
  },
  en: {
    localeLabel: 'English',
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
    },
    categoryDescriptions: {
      company_setup: 'Initial inquiry about Taiwan company formation, investment, or a branch/subsidiary',
      traffic_accident: 'Initial inquiry about a traffic accident, damages, or insurance',
      criminal_investigation: 'Initial inquiry about an investigation, prosecution, arrest, or detention',
      labor: 'Initial inquiry about employment contracts, severance, or termination',
      divorce_family: 'Initial inquiry about divorce, parental rights, or family matters',
      inheritance: 'Initial inquiry about inheritance or wills',
      logistics: 'Initial inquiry about logistics or transport regulation',
      cosmetics: 'Initial inquiry about cosmetics import, registration, or labeling',
      general: 'Initial Taiwan legal or business inquiry that does not fit the other categories',
    },
    fieldLabels: {
      name: 'Name',
      email: 'Email',
      summary: 'Matter or business summary',
      locale: 'Language',
      category: 'Matter category',
      phoneOrMessenger: 'Phone or messenger',
      urgency: 'Urgency or deadline',
      preferredContact: 'Preferred contact method',
      companyOrOrganization: 'Company or organization',
      countryOrResidence: 'Country or residence',
      preferredTime: 'Preferred contact time',
      documentsAvailable: 'Types of documents on hand',
      idempotencyKey: 'Idempotency key',
      confirmationToken: 'Confirmation token',
      privacyConsent: 'Privacy consent',
      userApprovedExactPreview: 'Exact preview approval',
    },
    notProvided: 'Not provided',
    confirmationInstruction:
      'The subject and body below are exactly what the server will send to the firm consultation inbox. Show this exact subject and body to the user. Only after the user explicitly approves sending that exact content, call POST /api/ai/intake/submit with the same fields, the same idempotencyKey, the confirmationToken, userApprovedExactPreview=true, and separate privacyConsent=true.',
    privacyNotice:
      'This intake processes name, contact details, and a short matter summary so the firm can review a consultation request. See the public privacy policy. Do not include identity numbers, financial credentials, or passport details in this initial intake.',
    aiLimitNotice:
      'AI does not give legal advice and can be wrong. This flow only drafts a consultation email and sends it to the firm inbox after the user confirms the exact content.',
    noRepresentationNotice:
      'This intake does not create an attorney-client relationship and does not promise confidentiality, a response time, or a legal outcome. A lawyer must review the matter.',
    emergencyNotice:
      'If there is immediate danger, an arrest, or a medical emergency, contact local emergency services or authorities instead of this email. This notice does not list jurisdiction-specific numbers.',
    sensitiveWarning: getSensitiveInformationWarning('en'),
    sensitiveCorrective:
      'Sensitive data was detected (for example an ID number, passport number, payment card, bank account, or IBAN), so no preview was created. Remove those values and resend only a short summary. Detected values are never returned.',
    emailGreeting: 'Dear Attorney Tseng,',
    emailIntro: 'This is a consultation intake submitted through an external AI tool after the user confirmed the content below.',
    emailClosing:
      'This message is an initial intake only. It does not create an attorney-client relationship and does not guarantee confidentiality, a response deadline, or a legal outcome. For an emergency, contact local emergency authorities rather than relying on this email.',
    questions: [
      'What is your name, and if relevant your company or organization?',
      'What email should the firm use to reply? Phone or messenger is optional.',
      'Which matter category fits best: company setup, traffic accident, criminal investigation, labor, divorce/family, inheritance, logistics, cosmetics, or general?',
      'Please give a short account of the key facts and timeline. Full evidence is not needed for initial intake.',
      'Is there a deadline or urgency? No response time is guaranteed.',
      'Optionally, put names only of opposing or related parties in the summary field for later conflict screening. Never send identity numbers; this intake does not request them.',
      'What is your country or place of residence?',
      'What language, contact method, and time window do you prefer?',
      'What types of documents do you have (for example contract, photos, judgment)? Do not send contents, attachments, or file URLs.',
      'Do not provide national ID numbers, passport numbers, bank details, or payment-card credentials.',
    ],
    categoryQuestions: {
      company_setup: ['In one sentence, what is the first company-setup or investment point you want reviewed?'],
      traffic_accident: ['Briefly state the approximate accident date and current status (medical, insurance, investigation). Do not send medical-record contents.'],
      criminal_investigation: ['Briefly state the current procedural stage. Do not send case or identity numbers.'],
      labor: ['Briefly state the current employment status (employed, notice of termination, or departed).'],
      divorce_family: ['Briefly describe the family situation using roles rather than extra identity numbers.'],
      inheritance: ['Briefly state your relationship to the decedent and whether Taiwan assets may be involved. Do not send account numbers.'],
      logistics: ['Briefly state the business type and whether you operate in Taiwan.'],
      cosmetics: ['Briefly state the product type and whether you plan to import or sell in Taiwan.'],
    },
    duplicateMessage: 'This intake key was already processed. No additional email was sent.',
    sentMessage: 'The confirmed consultation email was sent to the firm inbox.',
    sendingMessage: 'The same intake is currently being sent. No additional email was sent.',
    failedUnknownMessage:
      'Delivery could not be confirmed. The server will not automatically resend. Check whether the message arrived, or after explicit confirmation create a new preview with a new idempotency key.',
    failedUnknownReplayMessage:
      'The earlier delivery result is still unconfirmed. This key will not send again. Check the inbox or use a new preview and a new key.',
  },
  ja: {
    localeLabel: '日本語',
    categoryLabels: {
      company_setup: '会社設立・投資',
      traffic_accident: '交通事故・損害賠償',
      criminal_investigation: '警察・検察・身柄拘束',
      labor: '労働・退職金・解雇',
      divorce_family: '離婚・親権・家事',
      inheritance: '相続・遺言',
      logistics: '物流・運送',
      cosmetics: '化粧品の市場参入・登録',
      general: '一般のご相談',
    },
    categoryDescriptions: {
      company_setup: '台湾での会社設立、投資、支店・子会社に関する初期相談',
      traffic_accident: '交通事故、損害賠償、保険に関する初期相談',
      criminal_investigation: '捜査、検察、逮捕・勾留に関する初期相談',
      labor: '労働契約、退職金、解雇に関する初期相談',
      divorce_family: '離婚、親権、家事に関する初期相談',
      inheritance: '相続、遺言に関する初期相談',
      logistics: '物流・運送業の規制に関する初期相談',
      cosmetics: '化粧品の輸入、登録、表示に関する初期相談',
      general: '他の分類に当てはまらない台湾の法律・企業業務の初期相談',
    },
    fieldLabels: {
      name: 'お名前',
      email: 'メールアドレス',
      summary: '案件または業務の概要',
      locale: '言語',
      category: 'ご相談分野',
      phoneOrMessenger: '電話またはメッセンジャー',
      urgency: '緊急度または期限',
      preferredContact: '希望する連絡方法',
      companyOrOrganization: '会社名または所属',
      countryOrResidence: '国または居住地',
      preferredTime: '希望する連絡時間帯',
      documentsAvailable: 'お手元の資料の種類',
      idempotencyKey: '冪等キー',
      confirmationToken: '確認トークン',
      privacyConsent: '個人情報の取扱いに関する同意',
      userApprovedExactPreview: '正確なプレビューの承認',
    },
    notProvided: '未記入',
    confirmationInstruction:
      '以下の件名と本文は、サーバーが法律事務所の相談受信箱へ送る内容と完全に同一です。利用者にこの件名と本文をそのまま提示し、利用者がその内容の送信を明示的に確認したあとでのみ、同じ欄、同じ idempotencyKey、confirmationToken、userApprovedExactPreview=true、privacyConsent=true で POST /api/ai/intake/submit を呼び出してください。',
    privacyNotice:
      'この受付は、相談検討のために氏名、連絡先、案件概要を取り扱います。詳細は公開プライバシー方針を確認してください。初期受付に識別番号、金融情報、旅券情報を含めないでください。',
    aiLimitNotice:
      'AIは法律助言を行わず、誤る場合があります。この流れは相談メール案を作成し、利用者がその内容を確認したあとでのみ事務所の受信箱へ送ります。',
    noRepresentationNotice:
      'この受付は弁護士と依頼者の関係を成立させず、秘密保持、回答期限、法律上の結果を保証しません。個別事案の判断には弁護士の検討が必要です。',
    emergencyNotice:
      '急迫した危険、逮捕、医療上の緊急事態がある場合は、このメールではなく現地の緊急機関または当局に連絡してください。この案内は管轄ごとの電話番号を示しません。',
    sensitiveWarning: getSensitiveInformationWarning('ja'),
    sensitiveCorrective:
      '旅券番号、身分証番号、カード番号、口座・IBANなどの機微情報が検出されたため、プレビューを作成しませんでした。それらの値を削除し、概要だけを再送してください。検出値は返しません。',
    emailGreeting: '曾雋崴弁護士様',
    emailIntro: '外部AIツール経由で、利用者が内容を確認した相談受付です。',
    emailClosing:
      '本メールは初期受付です。弁護士と依頼者の関係、秘密保持、回答期限、法律上の結果を保証するものではありません。緊急の危険がある場合は、このメールではなく現地の緊急機関に連絡してください。',
    questions: [
      'お名前と、該当する場合は会社名または所属を教えてください。',
      '返信先のメールアドレスを教えてください。電話やメッセンジャーは任意です。',
      'ご相談分野を選んでください。会社設立、交通事故、捜査、労働、離婚・家事、相続、物流、化粧品、一般相談のいずれかです。',
      '重要な事実とこれまでの経緯を短く書いてください。初期受付に証拠の全文は不要です。',
      '期限や緊急度があれば教えてください。回答時間の保証はありません。',
      '後日の利益相反確認のため、相手方や関係者の氏名だけを概要（summary）に任意で書いてください。識別番号は送らないでください。本受付は識別番号を求めません。',
      '現在の居住国または地域を教えてください。',
      '希望する言語、連絡方法、時間帯を教えてください。',
      '契約書、写真、判決など、お手元の資料の種類だけを書いてください。内容、添付、ファイルURLは送らないでください。',
      '旅券番号、身分証番号、銀行口座、カード情報は入力しないでください。',
    ],
    categoryQuestions: {
      company_setup: ['設立または投資について、最初に確認したい点を一文で書いてください。'],
      traffic_accident: ['事故のおよその日付と現在の状況（通院、保険、捜査）だけを短く書いてください。診療記録の内容は送らないでください。'],
      criminal_investigation: ['現在の手続段階だけを短く書いてください。事件番号や身分証番号は送らないでください。'],
      labor: ['現在の雇用関係（在職、解雇通知、退職）だけを短く書いてください。'],
      divorce_family: ['氏名以外の役割の説明で、婚姻や子の状況を短く書いてください。'],
      inheritance: ['被相続人との関係と、台湾財産の有無だけを短く書いてください。口座番号は送らないでください。'],
      logistics: ['事業の形態と、台湾での活動の有無だけを短く書いてください。'],
      cosmetics: ['製品の種類と、台湾への輸入・販売予定の有無だけを短く書いてください。'],
    },
    duplicateMessage: '同じ受付キーは既に処理済みです。追加のメールは送信していません。',
    sentMessage: '確認済みの相談メールを事務所の受信箱へ送信しました。',
    sendingMessage: '同じ受付は現在送信中です。追加のメールは送信していません。',
    failedUnknownMessage:
      '送信結果を確認できません。自動では再送しません。到着を確認するか、明示の確認後に新しいプレビューと新しいキーでやり直してください。',
    failedUnknownReplayMessage:
      '前回の送信結果は未確認のままです。このキーでは再送しません。受信箱を確認するか、新しいプレビューと新しいキーを使ってください。',
  },
};

export function getAiIntakeCopy(locale: AiIntakeLocale): LocaleCopy {
  return COPY[locale];
}

export function getAiIntakeCategoryLabel(locale: AiIntakeLocale, category?: AiIntakeCategory): string {
  const copy = COPY[locale];
  return category ? copy.categoryLabels[category] : copy.categoryLabels.general;
}

export function getAiIntakeFieldLabel(locale: AiIntakeLocale, field: AiIntakeFieldKey): string {
  return COPY[locale].fieldLabels[field];
}

export function getAiIntakeConfirmationInstruction(locale: AiIntakeLocale): string {
  return COPY[locale].confirmationInstruction;
}

export function getAiIntakeSensitiveCorrective(locale: AiIntakeLocale): string {
  return COPY[locale].sensitiveCorrective;
}

export function publicPrivacyUrl(locale: AiIntakeLocale): string {
  return `${getAiIntakePublicOrigin()}/${locale}/privacy`;
}

function fieldSpecs(locale: AiIntakeLocale): FieldSpec[] {
  const labels = COPY[locale].fieldLabels;
  return [
    { name: 'name', required: true, description: labels.name, maxLength: 120 },
    { name: 'email', required: true, description: labels.email, maxLength: 254 },
    { name: 'summary', required: true, description: labels.summary, maxLength: 4000 },
    { name: 'locale', required: true, description: labels.locale },
    { name: 'idempotencyKey', required: true, description: labels.idempotencyKey },
    { name: 'category', required: false, description: labels.category },
    { name: 'phoneOrMessenger', required: false, description: labels.phoneOrMessenger, maxLength: 120 },
    { name: 'urgency', required: false, description: labels.urgency, maxLength: 80 },
    { name: 'preferredContact', required: false, description: labels.preferredContact, maxLength: 80 },
    { name: 'companyOrOrganization', required: false, description: labels.companyOrOrganization, maxLength: 200 },
    { name: 'countryOrResidence', required: false, description: labels.countryOrResidence, maxLength: 120 },
    { name: 'preferredTime', required: false, description: labels.preferredTime, maxLength: 200 },
    { name: 'documentsAvailable', required: false, description: labels.documentsAvailable, maxLength: 1000 },
    { name: 'confirmationToken', required: false, description: `${labels.confirmationToken} (submit only)` },
    { name: 'privacyConsent', required: false, description: `${labels.privacyConsent} (submit only; must be true)` },
    {
      name: 'userApprovedExactPreview',
      required: false,
      description: `${labels.userApprovedExactPreview} (submit only; must be true; auditable attestation, not cryptographic proof)`,
    },
  ];
}

export function buildRequirementsPayload(locale: AiIntakeLocale, category?: AiIntakeCategory) {
  const copy = COPY[locale];
  const questions = [...copy.questions];
  if (category && copy.categoryQuestions[category]) {
    questions.push(...copy.categoryQuestions[category]!);
  }
  const specs = fieldSpecs(locale);
  return {
    ok: true as const,
    requirementsVersion: AI_INTAKE_REQUIREMENTS_VERSION,
    locale,
    categories: CATEGORIES.map((value) => ({
      value,
      label: copy.categoryLabels[value],
      description: copy.categoryDescriptions[value],
    })),
    fields: {
      required: specs.filter((field) => field.required),
      optional: specs.filter((field) => !field.required),
    },
    questions,
    sensitiveData: {
      prohibitedKinds: [
        'kr_resident_registration',
        'tw_national_id',
        'payment_card',
        'iban',
        'bank_account',
        'passport',
        'identity_number',
      ],
      warning: copy.sensitiveWarning,
    },
    notices: {
      privacy: copy.privacyNotice,
      aiLimit: copy.aiLimitNotice,
      noRepresentation: copy.noRepresentationNotice,
      emergency: copy.emergencyNotice,
    },
    confirmationInstruction: copy.confirmationInstruction,
    privacyUrl: publicPrivacyUrl(locale),
  };
}
