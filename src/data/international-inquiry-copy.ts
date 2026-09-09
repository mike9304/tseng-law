/**
 * Guidance-route inquiry copy for the eight public languages.
 *
 * Guidance is published in the page language; actual consultations are handled
 * only in English, Chinese, Japanese and Korean. Every locale below is written
 * in its own language — no locale spreads or reuses another locale's strings.
 * No fee, response-time, interpreting or availability promise appears here.
 *
 * The locale union is intentionally local to this module: the public
 * `SiteLocale` union is still four languages, and this copy must not widen it.
 */

import { ID_PRIVACY_POLICY_LABEL } from '@/data/guidance-privacy-label';

export type InquiryCopyLocale =
  | 'ko'
  | 'zh-hant'
  | 'en'
  | 'ja'
  | 'vi'
  | 'id'
  | 'th'
  | 'fil';

export interface InternationalInquiryCopy {
  /** The page language is guidance only. */
  guidanceNotice: string;
  /** The exact four consultation languages. */
  consultationNotice: string;
  /** What happens when none of the four works. Never promises availability. */
  methodConfirmationNotice: string;
  /** The visitor may write the summary in their own language. */
  preparationNotice: string;
  heading: string;
  intro: string;
  submitLabel: string;
  submittingLabel: string;
  /** Received for review. Never a completed consultation or a confirmed appointment. */
  successMessage: string;
  /** Stored, notification not yet confirmed. Never reported as total failure. */
  savedNotificationPendingMessage: string;
  /**
   * Label shown with the stored inquiry's receipt identifier after a saved
   * response. It identifies the record only — never a confirmed consultation
   * or appointment.
   */
  receiptIdLabel: string;
  failureMessage: string;
  originalLanguageLabel: string;
  originalLanguagePlaceholder: string;
  preferredConsultationLanguageLabel: string;
  originalTextLabel: string;
  originalTextPlaceholder: string;
  nameLabel: string;
  emailLabel: string;
  consentLabel: string;
  privacyLinkLabel: string;
  requiredMessage: string;
  invalidEmailMessage: string;
  tooLongMessage: string;
  /** Contains the literal {language} placeholder for the source-language name. */
  sourceLanguageNotice: string;
  /** An item on this page has no version in this page's language. */
  unavailableTranslationNotice: string;
  /**
   * Shown in the current page language when the visitor picks a language this
   * page does not exist in. Contains the literal {language} placeholder for the
   * requested target language. Promises no translation and no later version.
   */
  unavailableLanguageNotice: string;
  languageOptions: {
    en: string;
    'zh-hant': string;
    ja: string;
    ko: string;
    'needs-method-confirmation': string;
  };
}

export const internationalInquiryCopy: Record<InquiryCopyLocale, InternationalInquiryCopy> = {
  ko: {
    guidanceNotice:
      '이 페이지는 한국어로 제공되는 일반 안내입니다. 개별 사건에 대한 법률 자문이 아닙니다.',
    consultationNotice:
      '실제 상담은 영어·중국어·일본어·한국어 네 가지 언어로 진행됩니다.',
    methodConfirmationNotice:
      '네 언어 모두 사용하기 어려우시면 “연락 방법 확인 필요”를 선택해 주세요. 어떻게 소통할지는 회신으로 확인해 드리며, 다른 언어의 대응 가능 여부는 보장하지 않습니다.',
    preparationNotice:
      '사건 개요는 편하신 언어로 작성하셔도 됩니다. 작성하신 원문은 그대로 보관되며, 자동으로 번역하지 않습니다.',
    heading: '상담 문의 보내기',
    intro:
      '사건 개요를 간단히 적어 주세요. 담당 변호사가 내용을 검토한 뒤 진행 방법을 안내드립니다.',
    submitLabel: '문의 보내기',
    submittingLabel: '보내는 중…',
    successMessage:
      '문의가 접수되어 검토를 기다리고 있습니다. 상담이 끝났거나 예약이 확정된 것은 아닙니다.',
    savedNotificationPendingMessage:
      '문의는 저장되었습니다. 다만 사무소로의 알림 전달은 아직 확인되지 않았습니다. 보내신 내용이 사라진 것은 아니며, 회신이 없을 경우 연락처 페이지의 이메일로도 문의하실 수 있습니다.',
    receiptIdLabel: '접수 번호',
    failureMessage:
      '문의를 보내지 못했습니다. 잠시 후 다시 시도하시거나, 연락처 페이지의 이메일로 보내 주세요.',
    originalLanguageLabel: '작성하시는 언어',
    originalLanguagePlaceholder: '예: 베트남어, 인도네시아어, 태국어, 필리핀어 등',
    preferredConsultationLanguageLabel: '희망하시는 상담 언어',
    originalTextLabel: '사건 개요 (편하신 언어로 작성)',
    originalTextPlaceholder:
      '무슨 일이 있었는지, 무엇이 필요하신지, 기한이 있다면 함께 적어 주세요. 주민등록번호, 여권번호, 계좌번호 등 민감정보는 적지 말아 주세요.',
    nameLabel: '이름',
    emailLabel: '이메일',
    consentLabel: '개인정보처리방침을 확인했으며, 이 문의를 보내는 데 동의합니다.',
    privacyLinkLabel: '개인정보처리방침',
    requiredMessage: '필수 입력 항목입니다.',
    invalidEmailMessage: '올바른 이메일 주소를 입력해 주세요.',
    tooLongMessage: '입력하신 내용이 너무 깁니다. 길이를 줄여 다시 보내 주세요.',
    sourceLanguageNotice:
      '이 글은 {language}로만 제공되며, 링크를 누르면 해당 원문 페이지로 이동합니다.',
    unavailableTranslationNotice:
      '이 항목은 아직 이 페이지 언어로 번역되어 있지 않습니다. 원문 언어가 표시된 링크를 누르시면 원문을 보실 수 있습니다.',
    unavailableLanguageNotice: '이 페이지는 {language}로 제공되지 않습니다.',
    languageOptions: {
      en: '영어 (English)',
      'zh-hant': '중국어 (中文)',
      ja: '일본어 (日本語)',
      ko: '한국어',
      'needs-method-confirmation': '네 언어 모두 어렵습니다 — 연락 방법 확인 필요',
    },
  },
  'zh-hant': {
    guidanceNotice: '本頁以中文提供一般說明，並非針對個案的法律意見。',
    consultationNotice: '實際諮詢以英文、中文、日文、韓文四種語言進行。',
    methodConfirmationNotice:
      '若這四種語言都不方便，請選擇「需確認聯絡方式」。我們會以回信確認可行的溝通方式，但無法保證能以其他語言提供服務。',
    preparationNotice:
      '案件摘要可以用您慣用的語言書寫。您寫下的原文會原樣保留，我們不會自動翻譯。',
    heading: '送出諮詢',
    intro: '請簡要說明您的情況。律師確認內容後，會再說明後續進行方式。',
    submitLabel: '送出諮詢',
    submittingLabel: '傳送中…',
    successMessage:
      '您的諮詢已收到，正等待律師檢視。這並不代表諮詢已完成或預約已確認。',
    savedNotificationPendingMessage:
      '您的諮詢已保存，但通知事務所的程序尚未確認完成。您填寫的內容並未遺失；若遲未收到回覆，也可透過聯絡頁面的電子郵件與我們聯繫。',
    receiptIdLabel: '受理編號',
    failureMessage:
      '諮詢未能送出。請稍後再試，或改以聯絡頁面的電子郵件寄送。',
    originalLanguageLabel: '您書寫時使用的語言',
    originalLanguagePlaceholder: '例如：越南文、印尼文、泰文、菲律賓文等',
    preferredConsultationLanguageLabel: '希望使用的諮詢語言',
    originalTextLabel: '案件摘要（可用您慣用的語言書寫）',
    originalTextPlaceholder:
      '請說明發生了什麼事、希望我們協助什麼，以及是否有期限。請勿填寫身分證字號、護照號碼或銀行帳戶資料等敏感資訊。',
    nameLabel: '姓名',
    emailLabel: '電子郵件',
    consentLabel: '我已閱讀隱私權政策，並同意送出這則諮詢。',
    privacyLinkLabel: '隱私權政策',
    requiredMessage: '此欄為必填。',
    invalidEmailMessage: '請輸入有效的電子郵件地址。',
    tooLongMessage: '內容過長，請縮短後再送出。',
    sourceLanguageNotice: '本文僅提供{language}版本，點擊連結將前往該原文頁面。',
    unavailableTranslationNotice:
      '此項目尚未翻譯成本頁語言。點擊標示原文語言的連結，即可閱讀原文。',
    unavailableLanguageNotice: '本頁沒有{language}版本。',
    languageOptions: {
      en: '英文（English）',
      'zh-hant': '中文',
      ja: '日文（日本語）',
      ko: '韓文（한국어）',
      'needs-method-confirmation': '四種語言都不方便——需確認聯絡方式',
    },
  },
  en: {
    guidanceNotice:
      'This page is written in English as general guidance. It is not advice on your specific matter.',
    consultationNotice:
      'Consultations are handled in four languages: English, Chinese, Japanese, and Korean.',
    methodConfirmationNotice:
      'If none of those four languages works for you, choose “Contact method needs to be confirmed”. We will reply to confirm how we can communicate; service in any other language is not guaranteed.',
    preparationNotice:
      'You may write the summary of your matter in your own language. Your original text is kept exactly as you wrote it and is not translated automatically.',
    heading: 'Send your inquiry',
    intro:
      'Describe your matter briefly. An attorney reviews what you send before the next step is discussed.',
    submitLabel: 'Send inquiry',
    submittingLabel: 'Sending…',
    successMessage:
      'Your inquiry has been received and is waiting for review. This does not mean a consultation has taken place or that an appointment is confirmed.',
    savedNotificationPendingMessage:
      'Your inquiry has been saved, but the notification to the office has not been confirmed yet. Nothing you wrote was lost. If you do not hear back, you can also write to the email address on the contact page.',
    receiptIdLabel: 'Reference number',
    failureMessage:
      'Your inquiry could not be sent. Please try again, or send it to the email address on the contact page.',
    originalLanguageLabel: 'Language you are writing in',
    originalLanguagePlaceholder:
      'For example: Vietnamese, Indonesian, Thai, Filipino, or another language',
    preferredConsultationLanguageLabel: 'Preferred consultation language',
    originalTextLabel: 'Summary of your matter (in your own language)',
    originalTextPlaceholder:
      'Tell us what happened, what you need help with, and any deadline you know of. Please do not include passport numbers, identification numbers, or bank account details.',
    nameLabel: 'Name',
    emailLabel: 'Email',
    consentLabel: 'I have read the privacy policy and agree to send this inquiry.',
    privacyLinkLabel: 'Privacy policy',
    requiredMessage: 'This field is required.',
    invalidEmailMessage: 'Enter a valid email address.',
    tooLongMessage: 'This text is too long. Please shorten it and send it again.',
    sourceLanguageNotice:
      'This article is available only in {language}, and the link opens that original page.',
    unavailableTranslationNotice:
      'This item has not been translated into the language of this page. A clearly labelled link opens the original in its source language.',
    unavailableLanguageNotice: 'This page is not available in {language}.',
    languageOptions: {
      en: 'English',
      'zh-hant': 'Chinese (中文)',
      ja: 'Japanese (日本語)',
      ko: 'Korean (한국어)',
      'needs-method-confirmation':
        'None of these four — contact method needs to be confirmed',
    },
  },
  ja: {
    guidanceNotice:
      'このページは日本語による一般的なご案内です。個別の案件に対する法的助言ではありません。',
    consultationNotice:
      '実際のご相談は、英語・中国語・日本語・韓国語の4言語で承ります。',
    methodConfirmationNotice:
      '4言語のいずれも難しい場合は、「連絡方法の確認が必要」をお選びください。どのように連絡を取れるかは返信でご確認いたします。他の言語での対応可否は保証できません。',
    preparationNotice:
      '案件の概要は、お使いになりやすい言語でご記入いただけます。ご記入いただいた原文はそのまま保存し、自動翻訳は行いません。',
    heading: 'ご相談を送る',
    intro:
      '案件の概要を簡単にお知らせください。弁護士が内容を確認したうえで、進め方をご案内します。',
    submitLabel: '相談を送信',
    submittingLabel: '送信中…',
    successMessage:
      'お問い合わせを受け付け、確認をお待ちいただいている状態です。ご相談が完了した、またはご予約が確定したことを意味するものではありません。',
    savedNotificationPendingMessage:
      'お問い合わせは保存されました。ただし、事務所への通知は完了が確認できていません。ご記入いただいた内容が失われたわけではありません。返信がない場合は、お問い合わせページのメールアドレスからもご連絡いただけます。',
    receiptIdLabel: '受付番号',
    failureMessage:
      'お問い合わせを送信できませんでした。時間をおいて再度お試しいただくか、お問い合わせページのメールアドレスへお送りください。',
    originalLanguageLabel: 'ご記入に使う言語',
    originalLanguagePlaceholder:
      '例：ベトナム語、インドネシア語、タイ語、フィリピン語など',
    preferredConsultationLanguageLabel: 'ご希望の相談言語',
    originalTextLabel: '案件の概要（お使いの言語でご記入ください）',
    originalTextPlaceholder:
      '何が起きたか、どのような支援が必要か、期限があればその点もご記入ください。旅券番号、身分証番号、銀行口座情報などの機微情報は記載しないでください。',
    nameLabel: 'お名前',
    emailLabel: 'メールアドレス',
    consentLabel:
      'プライバシーポリシーを確認し、この内容を送信することに同意します。',
    privacyLinkLabel: 'プライバシーポリシー',
    requiredMessage: '必須項目です。',
    invalidEmailMessage: '有効なメールアドレスをご入力ください。',
    tooLongMessage: '文字数が上限を超えています。短くしてから送信してください。',
    sourceLanguageNotice:
      'この記事は{language}のみで公開されており、リンク先はその原文ページです。',
    unavailableTranslationNotice:
      'この項目は、このページの言語にはまだ翻訳されていません。原文の言語を明示したリンクから、原文をご覧いただけます。',
    unavailableLanguageNotice: 'このページは{language}では提供していません。',
    languageOptions: {
      en: '英語（English）',
      'zh-hant': '中国語（中文）',
      ja: '日本語',
      ko: '韓国語（한국어）',
      'needs-method-confirmation': '4言語とも難しい — 連絡方法の確認が必要',
    },
  },
  vi: {
    guidanceNotice:
      'Trang này được viết bằng tiếng Việt để cung cấp thông tin hướng dẫn chung, không phải ý kiến pháp lý cho vụ việc cụ thể của quý vị.',
    consultationNotice:
      'Việc tư vấn được thực hiện bằng bốn ngôn ngữ: tiếng Anh, tiếng Trung, tiếng Nhật và tiếng Hàn.',
    methodConfirmationNotice:
      'Nếu quý vị không dùng được ngôn ngữ nào trong bốn ngôn ngữ đó, hãy chọn “Cần xác nhận cách liên hệ”. Văn phòng xác nhận phương thức trao đổi bằng thư trả lời khi có phương thức khả thi; không bảo đảm hỗ trợ bằng ngôn ngữ khác và không cam kết thời gian phản hồi.',
    preparationNotice:
      'Quý vị có thể viết tóm tắt vụ việc bằng ngôn ngữ của mình. Phần nội dung gốc quý vị viết được giữ nguyên và không được dịch tự động.',
    heading: 'Gửi yêu cầu tư vấn',
    intro:
      'Vui lòng mô tả ngắn gọn vụ việc của quý vị. Luật sư sẽ xem xét nội dung trước khi trao đổi về bước tiếp theo.',
    submitLabel: 'Gửi yêu cầu',
    submittingLabel: 'Đang gửi…',
    successMessage:
      'Chúng tôi đã nhận được yêu cầu của quý vị và đang chờ xem xét. Điều này không có nghĩa là buổi tư vấn đã diễn ra hay lịch hẹn đã được xác nhận.',
    savedNotificationPendingMessage:
      'Yêu cầu của quý vị đã được lưu, nhưng chưa xác nhận được thông báo gửi tới văn phòng. Nội dung quý vị viết không bị mất. Nếu chưa nhận được phản hồi, quý vị cũng có thể gửi thư tới địa chỉ email trên trang liên hệ.',
    receiptIdLabel: 'Mã tiếp nhận',
    failureMessage:
      'Không gửi được yêu cầu của quý vị. Vui lòng thử lại, hoặc gửi tới địa chỉ email trên trang liên hệ.',
    originalLanguageLabel: 'Ngôn ngữ quý vị dùng để viết',
    originalLanguagePlaceholder:
      'Ví dụ: tiếng Việt, tiếng Indonesia, tiếng Thái, tiếng Filipino hoặc ngôn ngữ khác',
    preferredConsultationLanguageLabel: 'Ngôn ngữ quý vị muốn dùng khi tư vấn',
    originalTextLabel: 'Tóm tắt vụ việc (bằng ngôn ngữ của quý vị)',
    originalTextPlaceholder:
      'Hãy cho biết chuyện gì đã xảy ra, quý vị cần hỗ trợ điều gì và thời hạn nếu có. Xin đừng ghi số hộ chiếu, số giấy tờ tùy thân hoặc thông tin tài khoản ngân hàng.',
    nameLabel: 'Tên',
    emailLabel: 'Thư điện tử',
    consentLabel:
      'Tôi đã đọc chính sách quyền riêng tư và đồng ý gửi yêu cầu này.',
    privacyLinkLabel: 'Chính sách quyền riêng tư',
    requiredMessage: 'Mục này là bắt buộc.',
    invalidEmailMessage: 'Vui lòng nhập địa chỉ email hợp lệ.',
    tooLongMessage: 'Nội dung quá dài. Vui lòng rút ngắn rồi gửi lại.',
    sourceLanguageNotice:
      'Bài viết này chỉ có bằng {language}, và liên kết sẽ mở trang gốc đó.',
    unavailableTranslationNotice:
      'Bài viết này chưa được dịch sang ngôn ngữ của trang này. Một liên kết có ghi rõ ngôn ngữ gốc sẽ mở bài viết gốc.',
    unavailableLanguageNotice: 'Trang này không được cung cấp bằng {language}.',
    languageOptions: {
      en: 'Tiếng Anh (English)',
      'zh-hant': 'Tiếng Trung (中文)',
      ja: 'Tiếng Nhật (日本語)',
      ko: 'Tiếng Hàn (한국어)',
      'needs-method-confirmation':
        'Không dùng được bốn ngôn ngữ trên — cần xác nhận cách liên hệ',
    },
  },
  id: {
    guidanceNotice:
      'Halaman ini ditulis dalam bahasa Indonesia sebagai panduan umum, bukan nasihat hukum untuk perkara Anda sendiri.',
    consultationNotice:
      'Konsultasi dilayani dalam empat bahasa: bahasa Inggris, bahasa Tionghoa (中文), bahasa Jepang, dan bahasa Korea.',
    methodConfirmationNotice:
      'Jika tidak satu pun dari keempat bahasa itu dapat Anda gunakan, pilih “Perlu konfirmasi cara berkomunikasi”. Kami akan membalas untuk memastikan cara berkomunikasi jika ada cara yang memungkinkan, tetapi layanan dalam bahasa lain tidak dijamin dan waktu balasan tidak dijanjikan.',
    preparationNotice:
      'Anda boleh menulis ringkasan perkara dalam bahasa Anda sendiri. Teks asli yang Anda tulis disimpan apa adanya dan tidak diterjemahkan secara otomatis.',
    heading: 'Kirim permintaan konsultasi',
    intro:
      'Jelaskan perkara Anda secara singkat. Advokat meninjau isi pesan Anda sebelum langkah berikutnya dibicarakan.',
    submitLabel: 'Kirim permintaan konsultasi',
    submittingLabel: 'Mengirim…',
    successMessage:
      'Permintaan Anda telah kami terima dan menunggu ditinjau. Ini tidak berarti konsultasi sudah berlangsung atau janji temu sudah dipastikan.',
    savedNotificationPendingMessage:
      'Permintaan Anda sudah tersimpan, tetapi notifikasi ke kantor belum terkonfirmasi. Isi yang Anda tulis tidak hilang. Jika belum ada balasan, Anda juga dapat menulis ke alamat email pada halaman kontak.',
    receiptIdLabel: 'Nomor penerimaan',
    failureMessage:
      'Permintaan Anda tidak terkirim. Silakan coba lagi, atau kirim ke alamat email pada halaman kontak.',
    originalLanguageLabel: 'Bahasa yang Anda pakai untuk menulis',
    originalLanguagePlaceholder:
      'Misalnya: bahasa Indonesia, bahasa Vietnam, bahasa Thai, bahasa Filipino, atau bahasa lain',
    preferredConsultationLanguageLabel: 'Bahasa konsultasi yang Anda inginkan',
    originalTextLabel: 'Ringkasan perkara (dalam bahasa Anda sendiri)',
    originalTextPlaceholder:
      'Ceritakan apa yang terjadi, bantuan apa yang Anda perlukan, dan tenggat waktu jika ada. Mohon jangan menuliskan nomor paspor, nomor identitas, atau data rekening bank.',
    nameLabel: 'Nama',
    emailLabel: 'Email',
    consentLabel:
      'Saya sudah membaca kebijakan privasi dan setuju untuk mengirim permintaan ini.',
    privacyLinkLabel: ID_PRIVACY_POLICY_LABEL,
    requiredMessage: 'Kolom ini wajib diisi.',
    invalidEmailMessage: 'Masukkan alamat email yang valid.',
    tooLongMessage: 'Teks ini terlalu panjang. Persingkat lalu kirim lagi.',
    sourceLanguageNotice:
      'Artikel ini hanya tersedia dalam {language}, dan tautannya membuka halaman asli tersebut.',
    unavailableTranslationNotice:
      'Tulisan ini belum diterjemahkan ke bahasa halaman ini. Tautan yang mencantumkan bahasa aslinya akan membuka teks asli tersebut.',
    unavailableLanguageNotice: 'Halaman ini tidak tersedia dalam {language}.',
    languageOptions: {
      en: 'Inggris (English)',
      'zh-hant': 'Tionghoa (中文)',
      ja: 'Jepang (日本語)',
      ko: 'Korea (한국어)',
      'needs-method-confirmation':
        'Keempat bahasa itu tidak dapat saya gunakan — perlu konfirmasi cara berkomunikasi',
    },
  },
  th: {
    guidanceNotice:
      'หน้านี้จัดทำเป็นภาษาไทยเพื่อเป็นข้อมูลแนะนำทั่วไป ไม่ใช่ความเห็นทางกฎหมายสำหรับเรื่องเฉพาะของท่าน',
    consultationNotice:
      'การให้คำปรึกษาจริงดำเนินการใน 4 ภาษา ได้แก่ ภาษาอังกฤษ ภาษาจีน ภาษาญี่ปุ่น และภาษาเกาหลี',
    methodConfirmationNotice:
      'หากท่านไม่สะดวกทั้ง 4 ภาษา กรุณาเลือก “ต้องยืนยันวิธีติดต่อ” เราจะตอบกลับเพื่อยืนยันวิธีการสื่อสารที่เป็นไปได้ แต่ไม่รับประกันว่าจะรองรับภาษาอื่นได้ และไม่รับประกันระยะเวลาตอบกลับ',
    preparationNotice:
      'ท่านเขียนสรุปเรื่องด้วยภาษาของท่านเองได้ ข้อความต้นฉบับที่ท่านเขียนจะถูกเก็บไว้ตามเดิม และไม่มีการแปลโดยอัตโนมัติ',
    heading: 'ส่งเรื่องเพื่อขอคำปรึกษา',
    intro:
      'กรุณาอธิบายเรื่องของท่านโดยย่อ ทนายความจะตรวจสอบเนื้อหาก่อนแจ้งขั้นตอนต่อไป',
    submitLabel: 'ส่งเรื่อง',
    submittingLabel: 'กำลังส่ง…',
    successMessage:
      'เราได้รับเรื่องของท่านไว้และอยู่ระหว่างรอการตรวจสอบ ทั้งนี้ไม่ได้หมายความว่าการปรึกษาเสร็จสิ้นแล้วหรือมีการยืนยันนัดหมายแล้ว',
    savedNotificationPendingMessage:
      'เรื่องของท่านถูกบันทึกไว้แล้ว แต่ยังยืนยันไม่ได้ว่าการแจ้งเตือนไปถึงสำนักงานแล้วหรือไม่ ข้อความที่ท่านเขียนไม่ได้สูญหาย หากยังไม่ได้รับการติดต่อกลับ ท่านสามารถส่งอีเมลตามที่อยู่ในหน้าติดต่อได้เช่นกัน',
    receiptIdLabel: 'หมายเลขรับเรื่อง',
    failureMessage:
      'ส่งเรื่องของท่านไม่สำเร็จ กรุณาลองใหม่อีกครั้ง หรือส่งอีเมลตามที่อยู่ในหน้าติดต่อ',
    originalLanguageLabel: 'ภาษาที่ท่านใช้เขียน',
    originalLanguagePlaceholder:
      'เช่น ภาษาไทย ภาษาเวียดนาม ภาษาอินโดนีเซีย ภาษาฟิลิปิโน หรือภาษาอื่น',
    preferredConsultationLanguageLabel: 'ภาษาที่ท่านต้องการใช้ในการปรึกษา',
    originalTextLabel: 'สรุปเรื่องของท่าน (เขียนด้วยภาษาของท่านเองได้)',
    originalTextPlaceholder:
      'กรุณาระบุว่าเกิดอะไรขึ้น ท่านต้องการความช่วยเหลือด้านใด และมีกำหนดเวลาหรือไม่ กรุณาอย่าระบุเลขหนังสือเดินทาง เลขบัตรประจำตัว หรือข้อมูลบัญชีธนาคาร',
    nameLabel: 'ชื่อ',
    emailLabel: 'อีเมล',
    consentLabel:
      'ข้าพเจ้าได้อ่านนโยบายความเป็นส่วนตัวแล้ว และยินยอมส่งเรื่องนี้',
    privacyLinkLabel: 'นโยบายความเป็นส่วนตัว',
    requiredMessage: 'กรุณากรอกช่องนี้',
    invalidEmailMessage: 'กรุณากรอกที่อยู่อีเมลให้ถูกต้อง',
    tooLongMessage: 'ข้อความยาวเกินไป กรุณาย่อให้สั้นลงแล้วส่งใหม่',
    sourceLanguageNotice:
      'บทความนี้มีเฉพาะภาษา {language} เท่านั้น และลิงก์จะเปิดหน้าต้นฉบับนั้น',
    unavailableTranslationNotice:
      'บทความนี้ยังไม่ได้แปลเป็นภาษาของหน้านี้ ลิงก์ที่ระบุภาษาต้นฉบับไว้ชัดเจนจะเปิดหน้าต้นฉบับให้ท่านอ่าน',
    unavailableLanguageNotice: 'หน้านี้ไม่มีให้บริการเป็นภาษา {language}',
    languageOptions: {
      en: 'ภาษาอังกฤษ (English)',
      'zh-hant': 'ภาษาจีน (中文)',
      ja: 'ภาษาญี่ปุ่น (日本語)',
      ko: 'ภาษาเกาหลี (한국어)',
      'needs-method-confirmation': 'ใช้ภาษาใดใน 4 ภาษานี้ไม่ได้ — ต้องยืนยันวิธีติดต่อ',
    },
  },
  fil: {
    guidanceNotice:
      'Nakasulat sa Filipino ang pahinang ito bilang pangkalahatang gabay. Hindi ito legal na payo para sa tiyak na usapin ninyo.',
    consultationNotice:
      'Ang aktwal na konsultasyon ay isinasagawa sa apat na wika: Ingles, Tsino, Hapon, at Koreano.',
    methodConfirmationNotice:
      'Kung wala sa apat na wikang iyon ang kaya ninyong gamitin, piliin ang “Kailangang kumpirmahin ang paraan ng pakikipag-ugnayan”. Sasagot kami upang kumpirmahin kung paano tayo makakapag-usap kung may posibleng paraan, ngunit hindi garantisado ang serbisyo sa ibang wika at walang pangako sa panahon ng pagsagot.',
    preparationNotice:
      'Maaari ninyong isulat ang buod ng usapin ninyo sa sarili ninyong wika. Iniingatan ang orihinal ninyong teksto gaya ng pagkakasulat ninyo, at hindi ito awtomatikong isinasalin.',
    heading: 'Ipadala ang inyong katanungan',
    intro:
      'Ipaliwanag nang maikli ang usapin ninyo. Sinusuri ito ng abogado bago pag-usapan ang susunod na hakbang.',
    submitLabel: 'Ipadala ang katanungan',
    submittingLabel: 'Ipinapadala…',
    successMessage:
      'Natanggap namin ang mensahe ninyo at naghihintay ito ng pagsusuri. Hindi ito nangangahulugang naganap na ang konsultasyon o kumpirmado na ang appointment.',
    savedNotificationPendingMessage:
      'Naitala na ang mensahe ninyo, ngunit hindi pa nakukumpirma ang abiso papunta sa opisina. Hindi nawala ang isinulat ninyo. Kung wala kayong matanggap na sagot, maaari rin kayong sumulat sa email address na nasa pahina ng kontak.',
    receiptIdLabel: 'Numero ng pagtanggap (reference number)',
    failureMessage:
      'Hindi naipadala ang mensahe ninyo. Pakisubukan muli, o ipadala ito sa email address na nasa pahina ng kontak.',
    originalLanguageLabel: 'Wikang ginagamit ninyo sa pagsulat',
    originalLanguagePlaceholder:
      'Halimbawa: Filipino, Vietnamese, Indonesian, Thai, o ibang wika',
    preferredConsultationLanguageLabel: 'Wikang nais ninyo para sa konsultasyon',
    originalTextLabel: 'Buod ng usapin ninyo (sa sarili ninyong wika)',
    originalTextPlaceholder:
      'Isulat kung ano ang nangyari, anong tulong ang kailangan ninyo, at kung may takdang petsa. Huwag ilagay ang numero ng pasaporte, numero ng ID, o detalye ng bank account.',
    nameLabel: 'Pangalan',
    emailLabel: 'Email',
    consentLabel:
      'Nabasa ko ang patakaran sa pribasiya at pumapayag akong ipadala ang mensaheng ito.',
    privacyLinkLabel: 'Patakaran sa pribasiya',
    requiredMessage: 'Kailangang punan ang bahaging ito.',
    invalidEmailMessage: 'Maglagay ng wastong email address.',
    tooLongMessage: 'Masyadong mahaba ang tekstong ito. Paikliin ninyo ito at ipadala muli.',
    sourceLanguageNotice:
      'Ang artikulong ito ay makukuha lamang sa {language}, at bubuksan ng link ang orihinal na pahinang iyon.',
    unavailableTranslationNotice:
      'Hindi pa naisasalin ang bahaging ito sa wika ng pahinang ito. May link na malinaw na nagsasaad ng wikang pinagmulan; bubuksan nito ang orihinal na teksto.',
    unavailableLanguageNotice: 'Hindi makukuha ang pahinang ito sa {language}.',
    languageOptions: {
      en: 'Ingles (English)',
      'zh-hant': 'Tsino (中文)',
      ja: 'Hapon (日本語)',
      ko: 'Koreano (한국어)',
      'needs-method-confirmation':
        'Wala sa apat na wika — kailangang kumpirmahin ang paraan ng pakikipag-ugnayan',
    },
  },
};
