const PUBLIC_EMAIL = 'wei@hoveringlaw.com.tw';

export type ContactFormLocalCopy = {
  consentLabel: string;
  consentRequired: string;
  jaUnsupported: string;
  misconfigured: string;
  inspectorMisconfigured: string;
  nameRequired: string;
  emailRequired: string;
  emailInvalid: string;
  messageRequired: string;
  networkError: string;
  error: string;
  sendingConfirmation: (intakeId: string) => string;
  alreadyReceived: (intakeId: string) => string;
  tooLong: (field: string, max: number) => string;
  summaryTooLong: (max: number) => string;
  summaryLabels: {
    subject: string;
    address: string;
  };
};

const COPY: Record<'ko' | 'en' | 'zh-hant' | 'ja', ContactFormLocalCopy> = {
  ko: {
    consentLabel: '개인정보 수집·이용 및 상담 안내에 동의합니다.',
    consentRequired: '동의를 선택해야 전송할 수 있습니다.',
    jaUnsupported: `이 양식의 자동 접수는 일본어에서 아직 지원되지 않습니다. ${PUBLIC_EMAIL}로 직접 메일을 보내 주세요.`,
    misconfigured: '이 양식은 이름, 이메일, 메시지가 있어야 상담 접수를 보낼 수 있습니다. 페이지 설정을 확인해 주세요.',
    inspectorMisconfigured: '기본 상담 주소에서는 이름, 이메일, 메시지 필드가 필요합니다. 저장은 가능하지만 방문자는 전송 대신 이 안내를 봅니다.',
    nameRequired: '이름을 입력해 주세요.',
    emailRequired: '이메일을 입력해 주세요.',
    emailInvalid: '올바른 이메일을 입력해 주세요.',
    messageRequired: '문의 내용을 입력해 주세요.',
    networkError: '네트워크 오류로 전송되지 않았습니다. 입력은 유지됩니다. 자동으로 다시 보내지 않습니다.',
    error: '전송에 실패했습니다. 입력은 유지됩니다.',
    sendingConfirmation: (intakeId) => `요청을 전송했습니다. 확인 번호: ${intakeId}`,
    alreadyReceived: (intakeId) => `이미 전송된 요청입니다. 확인 번호: ${intakeId}`,
    tooLong: (field, max) => `${field} 값이 너무 깁니다. ${max}자 이내로 줄여 주세요.`,
    summaryTooLong: (max) => `문의 내용이 너무 깁니다. ${max}자 이내로 줄여 주세요.`,
    summaryLabels: { subject: '제목', address: '주소' },
  },
  en: {
    consentLabel: 'I agree to the collection of my details for this consultation request.',
    consentRequired: 'Consent is required before this form can be sent.',
    jaUnsupported: `Automatic intake through this form is not available in Japanese yet. Please email ${PUBLIC_EMAIL} directly.`,
    misconfigured: 'This form needs name, email, and message fields before it can send a consultation request. Please check the page setup.',
    inspectorMisconfigured: 'The default consultation action needs name, email, and message. Saving is allowed, but visitors will see this notice instead of a working submit path.',
    nameRequired: 'Please enter your name.',
    emailRequired: 'Please enter your email.',
    emailInvalid: 'Please enter a valid email.',
    messageRequired: 'Please enter your message.',
    networkError: 'The request was not sent because of a network error. Your entries are kept. It will not resend automatically.',
    error: 'The request was not completed. Your entries are kept.',
    sendingConfirmation: (intakeId) => `Your request was sent. Reference: ${intakeId}`,
    alreadyReceived: (intakeId) => `This request was already received. Reference: ${intakeId}`,
    tooLong: (field, max) => `${field} is too long. Please use ${max} characters or fewer.`,
    summaryTooLong: (max) => `The message is too long. Please use ${max} characters or fewer.`,
    summaryLabels: { subject: 'Subject', address: 'Address' },
  },
  'zh-hant': {
    consentLabel: '我同意為本次諮詢蒐集並使用所填資料。',
    consentRequired: '送出前請先勾選同意。',
    jaUnsupported: `此表單的自動送件目前尚未支援日文。請直接寄信至 ${PUBLIC_EMAIL}。`,
    misconfigured: '此表單需要姓名、電子郵件與訊息欄位才能送出諮詢。請檢查頁面設定。',
    inspectorMisconfigured: '預設諮詢網址需要姓名、電子郵件與訊息欄位。仍可儲存，但訪客會看到此說明而無法送出。',
    nameRequired: '請輸入姓名。',
    emailRequired: '請輸入電子郵件。',
    emailInvalid: '請輸入有效的電子郵件。',
    messageRequired: '請輸入訊息。',
    networkError: '因網路錯誤未能送出。已保留您輸入的內容，系統不會自動重送。',
    error: '未能完成送出。已保留您輸入的內容。',
    sendingConfirmation: (intakeId) => `已送出請求。確認編號：${intakeId}`,
    alreadyReceived: (intakeId) => `此請求已送出過。確認編號：${intakeId}`,
    tooLong: (field, max) => `${field} 過長，請縮短為 ${max} 字以內。`,
    summaryTooLong: (max) => `訊息過長，請縮短為 ${max} 字以內。`,
    summaryLabels: { subject: '主旨', address: '地址' },
  },
  ja: {
    consentLabel: '相談のために入力内容を利用することに同意します。',
    consentRequired: '送信前に同意が必要です。',
    jaUnsupported: `このフォームからの自動受付は日本語ではまだ対応していません。 ${PUBLIC_EMAIL} へ直接メールしてください。`,
    misconfigured: 'このフォームは氏名・メール・メッセージが必要です。ページ設定を確認してください。',
    inspectorMisconfigured: '既定の相談送信先では氏名・メール・メッセージが必要です。保存はできますが、訪問者はこの案内を見ます。',
    nameRequired: 'お名前を入力してください。',
    emailRequired: 'メールアドレスを入力してください。',
    emailInvalid: '有効なメールアドレスを入力してください。',
    messageRequired: 'お問い合わせ内容を入力してください。',
    networkError: 'ネットワークエラーのため送信されませんでした。入力内容は保持され、自動再送信はしません。',
    error: '送信できませんでした。入力内容は保持されます。',
    sendingConfirmation: (intakeId) => `送信しました。確認番号: ${intakeId}`,
    alreadyReceived: (intakeId) => `このリクエストは既に送信済みです。確認番号: ${intakeId}`,
    tooLong: (field, max) => `${field} が長すぎます。${max} 文字以内にしてください。`,
    summaryTooLong: (max) => `本文が長すぎます。${max} 文字以内にしてください。`,
    summaryLabels: { subject: '件名', address: '住所' },
  },
};

export function getContactFormLocalCopy(locale: string): ContactFormLocalCopy {
  if (locale === 'en' || locale === 'zh-hant' || locale === 'ja') return COPY[locale];
  return COPY.ko;
}
