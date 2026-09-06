import type { SiteLocale } from '@/lib/locales';

export const AI_INTAKE_PAGE_SLUG = 'ai-intake';

export type AiIntakePageContent = {
  metaTitle: string;
  description: string;
  keywords: string[];
  heroLabel: string;
  title: string;
  lead: string[];
  questionsHeading: string;
  questions: string[];
  prohibitedHeading: string;
  prohibited: string[];
  sequenceHeading: string;
  sequence: string[];
  deliveryHeading: string;
  delivery: string[];
  limitsHeading: string;
  limits: string[];
  emergencyHeading: string;
  emergency: string;
  statusHeading: string;
  status: string[];
  linksHeading: string;
  privacyLabel: string;
  openapiLabel: string;
  contactLabel: string;
  mcpHeading: string;
  mcp: string[];
};

export const aiIntakePageContent: Record<SiteLocale, AiIntakePageContent> = {
  ko: {
    metaTitle: 'AI 상담 이메일 접수 안내',
    description:
      '외부 AI가 호정 법률사무소 상담 이메일을 만들기 전에 물어야 할 범위, 미리보기 확인, 개인정보 동의, 그리고 이 법률사무소에 특별히 연결된 서비스를 통해서만 접수할 수 있다는 조건.',
    keywords: ['AI 상담 접수', '상담 이메일', '미리보기 확인', '개인정보 처리 동의'],
    heroLabel: 'AI CONSULTATION EMAIL INTAKE',
    title: 'AI를 통한 상담 이메일 접수',
    lead: [
      '외부 AI는 처음에 정해진 범위의 질문만 합니다. 이 페이지는 설명용이며, 두 번째 접수 양식이 아닙니다.',
      '미리보기로 받은 제목과 본문을 그대로 보여 준 뒤, 이용자가 그 내용과 개인정보 처리에 명시적으로 동의한 다음에만 발송할 수 있습니다.',
      '도착지는 사무소 상담 수신함 이메일입니다. 캘린더 예약이 아닙니다.',
    ],
    questionsHeading: 'AI가 처음 물을 수 있는 것',
    questions: [
      '필수 질문은 성함, 회신 이메일, 그리고 핵심 사실과 지금까지의 일정을 담은 짧은 사실 개요입니다.',
      '선택 질문으로 회사·소속, 전화 또는 메신저, 문의 유형, 긴급도나 기한, 국가·거주지, 선호 언어·연락 방식·시간대, 가지고 있는 자료의 종류, 그리고 필요한 경우 상대방 이름만 물을 수 있습니다. 선택 질문을 매번 전부 묻지는 않습니다.',
      '화면 언어(로케일), 멱등 키, 확인 토큰은 초기 사실 질문이 아니라 시스템/프로토콜 값입니다. 선호 언어는 화면 언어와 다른 선택적 연락 선호입니다.',
      '반환된 제목과 본문을 그대로 보여 준 뒤에, 이용자는 그 정확한 내용 발송과 개인정보 처리에 반드시 명시적으로 동의해야 합니다. 이 동의는 필수이며, 사람에게 묻지 않는 항목이 아닙니다.',
      '문의 유형을 고르면 그 유형에 맞는 짧은 후속 질문이 하나 더해질 수 있습니다.',
      '자료는 종류만 알려 주세요. 문서 내용, 업로드, 첨부파일, 파일 URL, 대화 전체 기록은 보내지 마세요.',
      '상대방·관련 당사자 정보는 이름만입니다. 식별번호는 받지 않습니다.',
    ],
    prohibitedHeading: '받지 않는 정보',
    prohibited: [
      '주민등록번호, 여권, 은행·카드 정보, 업로드, 문서 내용, 파일 URL은 초기 접수에 넣지 마세요.',
      '대화 전체 기록이나 첨부파일을 이 흐름으로 보내지 마세요.',
    ],
    sequenceHeading: '확인 순서',
    sequence: [
      'AI가 접수 요건을 읽고 범위 안의 질문만 합니다.',
      '미리보기를 만듭니다.',
      'AI는 반환된 제목과 본문을 그대로 보여 줍니다. 이 내용이 실제로 발송됩니다.',
      '정확한 미리보기 제목과 본문을 확인한 뒤, 그 내용 발송과 개인정보 처리에 명시적으로 동의한 다음에만 제출합니다.',
    ],
    deliveryHeading: '전달 방식',
    delivery: [
      '제출은 사무소가 소유한 상담 수신함으로 이메일을 보냅니다.',
      '캘린더 예약, 화상 상담 슬롯, 자동 답변 약속을 만들지 않습니다.',
    ],
    limitsHeading: '법률·비밀 한계',
    limits: [
      'AI는 법률 자문을 하지 않으며 틀릴 수 있습니다.',
      '이 접수는 변호사-의뢰인 관계를 만들지 않고, 비밀유지·회신 기한·결과를 약속하지 않습니다.',
    ],
    emergencyHeading: '긴급 상황',
    emergency:
      '급박한 위험, 체포, 의료 위급이면 이 이메일이 아니라 현지 긴급 구조·수사 기관에 연락하세요. 이 안내는 관할별 전화번호를 제공하지 않습니다.',
    statusHeading: '이용 가능 여부',
    status: [
      'AI 상담 이메일 접수는 이 법률사무소에 특별히 연결된 서비스를 통해서만 이용할 수 있습니다.',
      '일반적인 ChatGPT, Grok, Gemini 대화에는 자동으로 접근 권한이 없습니다. 사용 중인 AI 서비스가 이 연결을 제공하지 않으면, 사무소 문의 페이지로 상담을 보내 주세요.',
    ],
    linksHeading: '관련 문서',
    privacyLabel: '개인정보 처리방침',
    openapiLabel: '공개 OpenAPI 문서',
    contactLabel: '일반 문의 페이지',
    mcpHeading: '기계 엔드포인트',
    mcp: [
      'MCP 엔드포인트는 /api/ai/mcp 입니다. 호스트된 AI 클라이언트가 쓰는 기계 인터페이스입니다.',
      '자격 증명은 사무소가 서버에 설정합니다. 채팅에 비밀 값을 붙여 넣지 마세요.',
    ],
  },
  'zh-hant': {
    metaTitle: 'AI 諮詢郵件受理說明',
    description:
      '外部 AI 在建立昊鼎諮詢郵件前應詢問的範圍、預覽確認、隱私同意，以及僅能透過已特別連接本事務所的服務受理。',
    keywords: ['AI 諮詢受理', '諮詢郵件', '預覽確認', '個人資料處理同意'],
    heroLabel: 'AI CONSULTATION EMAIL INTAKE',
    title: '透過 AI 受理諮詢郵件',
    lead: [
      '外部 AI 只詢問初始、有範圍的問題。本頁是說明頁，不是第二份表單。',
      '必須先完整顯示預覽主旨與本文，使用者明確同意該內容與個人資料處理後，才可送出。',
      '送達方式是事務所諮詢信箱的電子郵件，不是日曆預約。',
    ],
    questionsHeading: 'AI 一開始可以問什麼',
    questions: [
      '必填問題是姓名、回覆電子郵件，以及包含關鍵事實與目前時程的簡短事實摘要。',
      '可選問題可能包括公司或所屬機構、電話或即時通訊、諮詢類型、急迫程度或期限、國家或居住地、偏好語言／聯絡方式／時間、手邊文件的種類，以及必要時僅限姓名的相對人。並非每次都會問完全部可選問題。',
      '介面語系、冪等鍵、確認權杖是系統／協定值，不是一開始向人詢問的事實。偏好語言是另一項可選聯絡偏好，不是介面語系。',
      '必須先完整顯示回傳的主旨與本文，使用者再明確同意寄出該精確內容並同意隱私處理。這項同意是必要的，不是不問使用者的項目。',
      '選擇諮詢類型後，可能再加一題該類型的簡短追問。',
      '文件只說明種類。請勿傳送內容、上傳檔、附件、檔案 URL 或完整對話紀錄。',
      '相對人或關係人資料只收姓名。不收集身分證字號。',
    ],
    prohibitedHeading: '請勿提供的資料',
    prohibited: [
      '國民身分證字號、護照、銀行或卡片資料、上傳檔、文件內容、檔案 URL 都不要放進初次受理。',
      '請勿透過此流程傳送完整對話紀錄或附件。',
    ],
    sequenceHeading: '確認順序',
    sequence: [
      'AI 讀取受理要件，只問範圍內的問題。',
      '建立預覽。',
      'AI 必須顯示回傳的主旨與本文；那就是實際會寄出的內容。',
      '確認精確預覽主旨與本文後，只有在使用者明確同意寄出該內容並同意隱私處理後，才可提交。',
    ],
    deliveryHeading: '送達方式',
    delivery: [
      '提交後會寄到事務所擁有的諮詢信箱。',
      '不會建立日曆預約、視訊時段或自動回覆承諾。',
    ],
    limitsHeading: '法律與保密界限',
    limits: [
      'AI 不提供法律意見，且可能有誤。',
      '此次受理不成立律師與委託人關係，也不保證保密、回覆時間或結果。',
    ],
    emergencyHeading: '緊急情況',
    emergency:
      '如有急迫危險、逮捕或醫療緊急，請聯絡當地緊急救援或執法機關，不要依賴這封郵件。本說明不提供各管轄區電話號碼。',
    statusHeading: '使用條件',
    status: [
      'AI 諮詢郵件受理僅能透過已特別連接本事務所的服務使用。',
      '一般的 ChatGPT、Grok 與 Gemini 對話並不會自動取得權限。若您的 AI 服務未提供此連接，請改由事務所聯絡頁面送出詢問。',
    ],
    linksHeading: '相關文件',
    privacyLabel: '隱私權政策',
    openapiLabel: '公開 OpenAPI 文件',
    contactLabel: '一般聯絡頁面',
    mcpHeading: '機器端點',
    mcp: [
      'MCP 端點為 /api/ai/mcp，供託管 AI 客戶端使用的機器介面。',
      '憑證由事務所在伺服器設定。請不要把密鑰貼進聊天。',
    ],
  },
  en: {
    metaTitle: 'AI consultation email intake',
    description:
      'How an external AI may collect a bounded consultation email for the firm: preview the exact subject and body, obtain explicit approval, and that intake is available only through a service specifically connected to this law firm.',
    keywords: ['AI consultation intake', 'consultation email', 'preview confirmation', 'privacy consent'],
    heroLabel: 'AI CONSULTATION EMAIL INTAKE',
    title: 'AI consultation email intake',
    lead: [
      'An external AI asks only the initial bounded questions. This page explains the integration. It is not a second intake form.',
      'The exact preview subject and body must be shown first. Submit only after the user explicitly approves that exact content and privacy processing.',
      'Delivery is an email to the firm inbox, not a calendar reservation.',
    ],
    questionsHeading: 'What the AI may ask first',
    questions: [
      'Required questions are your name, a reply email, and a short factual summary that includes the key facts and timeline or history.',
      'Optional questions may cover company or organization, phone or messenger, matter category, urgency or deadline, country or residence, preferred language, contact method, or time, types of documents on hand, and related-party names only where relevant. Not every optional question is asked every time.',
      'Interface locale, the idempotency key, and the confirmation token are system or protocol values, not initial human facts. Preferred language is a separate optional contact preference, not the interface locale.',
      'After the exact returned subject and body are shown, the user must explicitly approve that content and give privacy consent. That privacy decision is mandatory. It is not a field that is never asked of the person.',
      'Selecting a matter category may add one narrow follow-up for that category.',
      'For documents, describe types only. Do not send contents, uploads, attachments, file URLs, or a full transcript.',
      'Related-party information is names only. Identity numbers are not collected.',
    ],
    prohibitedHeading: 'What not to send',
    prohibited: [
      'Do not include national ID, passport, bank or card details, uploads, document contents, or file URLs in this initial intake.',
      'Do not send full chat transcripts or attachments through this flow.',
    ],
    sequenceHeading: 'Confirmation sequence',
    sequence: [
      'The AI reads intake requirements and asks only the bounded questions.',
      'The AI creates a preview.',
      'The AI must display the exact returned subject and body. That is what will be emailed.',
      'Only after the exact preview subject and body are shown, and the user explicitly approves that content and privacy processing, may the AI submit.',
    ],
    deliveryHeading: 'Delivery',
    delivery: [
      'Submit sends an email to the server-owned firm consultation inbox.',
      'It does not book a calendar appointment, a video slot, or promise a reply.',
    ],
    limitsHeading: 'Legal and confidentiality limits',
    limits: [
      'The AI does not give legal advice and can be wrong.',
      'This intake does not create an attorney-client relationship and does not promise confidentiality, a response time, or an outcome.',
    ],
    emergencyHeading: 'Emergencies',
    emergency:
      'If there is immediate danger, arrest, or a medical emergency, contact local emergency or law-enforcement services instead of this email. This page does not list jurisdiction-specific numbers.',
    statusHeading: 'Availability',
    status: [
      'AI email intake is available only through a service specifically connected to this law firm.',
      'General ChatGPT, Grok and Gemini chats do not automatically have access. If your AI service does not offer this connection, use the firm\'s contact page to send an inquiry.',
    ],
    linksHeading: 'Related documents',
    privacyLabel: 'Privacy policy',
    openapiLabel: 'Public OpenAPI document',
    contactLabel: 'General contact page',
    mcpHeading: 'Machine endpoint',
    mcp: [
      'The MCP endpoint is /api/ai/mcp. It is a machine interface for hosted AI clients.',
      'Credentials are configured on the server by the firm. Do not paste secrets into a chat.',
    ],
  },
  ja: {
    metaTitle: 'AI相談メール受付の案内',
    description:
      '外部AIが相談メールを作る前に聞いてよい範囲、プレビュー確認、プライバシー同意、およびこの法律事務所に特別に接続されたサービスからのみ受付できるという条件。',
    keywords: ['AI相談受付', '相談メール', 'プレビュー確認', '個人情報の取扱い同意'],
    heroLabel: 'AI CONSULTATION EMAIL INTAKE',
    title: 'AIによる相談メール受付',
    lead: [
      '外部AIは最初に範囲の決まった質問だけをします。このページは説明用であり、二通目の受付フォームではありません。',
      'プレビューの件名と本文をそのまま示したうえで、利用者がその内容と個人情報の取扱いに明示的に同意したあとでのみ送信できます。',
      '到達先は事務所の相談受信箱へのメールです。カレンダー予約ではありません。',
    ],
    questionsHeading: 'AIが最初に聞いてよいこと',
    questions: [
      '必須の質問は氏名、返信メール、および重要な事実とこれまでの経緯を含む短い事実の概要です。',
      '任意の質問として、会社・所属、電話またはメッセンジャー、相談分野、緊急度や期限、国・居住地、希望する言語・連絡方法・時間帯、手元の資料の種類、必要な場合は相手方の氏名だけを聞くことがあります。任意の質問を毎回すべて聞くわけではありません。',
      '画面のロケール、冪等キー、確認トークンは初期の事実質問ではなく、システム／プロトコル値です。希望する言語は画面ロケールとは別の任意の連絡希望です。',
      '返された件名と本文をそのまま示したあと、利用者はその正確な内容の送信とプライバシー処理に必ず明示的に同意します。この同意は必須であり、人に聞かない項目ではありません。',
      '相談分野を選ぶと、その分野に応じた短い追加質問が一つ加わることがあります。',
      '資料は種類だけを書いてください。内容、アップロード、添付ファイル、ファイルURL、会話全体の記録は送らないでください。',
      '相手方・関係者の情報は氏名だけです。識別番号は集めません。',
    ],
    prohibitedHeading: '送らない情報',
    prohibited: [
      '国民ID、旅券、銀行・カード情報、アップロード、文書の内容、ファイルURLは初期受付に入れないでください。',
      '会話全体の記録や添付ファイルをこの流れで送らないでください。',
    ],
    sequenceHeading: '確認の順序',
    sequence: [
      'AIが受付要件を読み、範囲内の質問だけをします。',
      'プレビューを作ります。',
      'AIは返された件名と本文をそのまま示します。それが実際に送られる内容です。',
      '正確なプレビュー件名と本文を示したあと、その内容の送信とプライバシー処理に明示的に同意したあとでのみ提出します。',
    ],
    deliveryHeading: '到達方法',
    delivery: [
      '提出は事務所が管理する相談受信箱へメールを送ります。',
      'カレンダー予約、オンライン枠、返信約束は作りません。',
    ],
    limitsHeading: '法律と秘密の限界',
    limits: [
      'AIは法律助言を行わず、誤ることがあります。',
      'この受付は弁護士と依頼者の関係を成立させず、秘密保持、回答期限、結果を約束しません。',
    ],
    emergencyHeading: '緊急のとき',
    emergency:
      '急迫した危険、逮捕、医療上の緊急事態がある場合は、このメールではなく現地の緊急機関または当局に連絡してください。この案内は管轄ごとの電話番号を示しません。',
    statusHeading: '利用条件',
    status: [
      'AI相談メール受付は、この法律事務所に特別に接続されたサービスからのみ利用できます。',
      '一般のChatGPT、Grok、Geminiのチャットから自動的に利用できるわけではありません。ご利用のAIサービスがこの接続に対応していない場合は、事務所のお問い合わせページからご連絡ください。',
    ],
    linksHeading: '関連資料',
    privacyLabel: 'プライバシー方針',
    openapiLabel: '公開OpenAPI文書',
    contactLabel: '一般お問い合わせページ',
    mcpHeading: '機械向けエンドポイント',
    mcp: [
      'MCPエンドポイントは /api/ai/mcp です。ホストされたAIクライアント向けの機械インタフェースです。',
      '資格情報は事務所がサーバーで設定します。チャットに秘密を貼り付けないでください。',
    ],
  },
};
