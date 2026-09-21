/**
 * Guidance-route inquiry copy for the public languages.
 *
 * Guidance is published in the page language; actual consultations are handled
 * only in English, Chinese, Japanese and Korean. Every locale below is written
 * in its own language — no locale spreads or reuses another locale's strings.
 * No fee, response-time, interpreting or availability promise appears here.
 *
 * The locale union is intentionally local to this module: the public
 * `SiteLocale` union is still four languages, and this copy must not widen it.
 */

import { AR_PRIVACY_POLICY_LABEL, ID_PRIVACY_POLICY_LABEL } from '@/data/guidance-privacy-label';

export type InquiryCopyLocale =
  | 'ko'
  | 'zh-hant'
  | 'en'
  | 'ja'
  | 'vi'
  | 'id'
  | 'th'
  | 'fil'
  | 'ar'
  | 'de'
  | 'es'
  | 'fr'
  | 'pt'
  | 'zh-hans'
  | 'ms'
  | 'ru'
  | 'tr'
  | 'it'
  | 'nl'
  | 'pl'
  | 'hi'
  | 'sv'
  | 'da'
  | 'nb'
  | 'fi'
  | 'cs'
  | 'hu'
  | 'ro'
  | 'uk'
  | 'el'
  | 'he';

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
      'Consultations are handled in four languages: English, Chinese, Korean, and Japanese.',
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
      'Việc tư vấn chỉ được thực hiện bằng bốn ngôn ngữ: tiếng Anh, tiếng Trung (中文), tiếng Nhật và tiếng Hàn.',
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
      'Konsultasi hanya dilayani dalam empat bahasa: bahasa Inggris, bahasa Mandarin (中文), bahasa Jepang, dan bahasa Korea.',
    methodConfirmationNotice:
      'Jika tidak satu pun dari keempat bahasa itu dapat Anda gunakan, pilih “Perlu konfirmasi cara berkomunikasi”. Kami akan membalas untuk memastikan apakah ada cara berkomunikasi yang memungkinkan, tetapi layanan dalam bahasa lain tidak dijamin dan waktu balasan tidak dijanjikan.',
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
      'zh-hant': 'Mandarin (中文)',
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
      'การให้คำปรึกษาจริงดำเนินการเฉพาะ 4 ภาษา ได้แก่ ภาษาอังกฤษ ภาษาจีน (中文) ภาษาญี่ปุ่น และภาษาเกาหลี',
    methodConfirmationNotice:
      'หากท่านใช้ภาษาใดใน 4 ภาษานี้ไม่ได้ กรุณาเลือก “ต้องยืนยันวิธีติดต่อ” เราจะตอบกลับเพื่อยืนยันวิธีการสื่อสารที่เป็นไปได้ แต่ไม่รับประกันว่าจะรองรับภาษาอื่นได้ และไม่รับประกันระยะเวลาตอบกลับ',
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
      'Ang aktwal na konsultasyon ay isinasagawa lamang sa apat na wika: Ingles, Tsino, Hapon, at Koreano.',
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
      'Naitala na ang mensahe ninyo, ngunit hindi pa nakukumpirma ang abiso papunta sa opisina. Hindi nawala ang isinulat ninyo. Kung wala kayong matanggap na sagot, maaari rin kayong sumulat sa email address na nasa pahinang Makipag-ugnayan.',
    receiptIdLabel: 'Numero ng pagtanggap',
    failureMessage:
      'Hindi naipadala ang mensahe ninyo. Pakisubukan muli, o ipadala ito sa email address na nasa pahinang Makipag-ugnayan.',
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
  ar: {
    guidanceNotice:
      'هذه الصفحة مكتوبة بالعربية بوصفها إرشادًا عامًا. وهي ليست رأيًا قانونيًا في قضيتك بعينها.',
    consultationNotice:
      'الاستشارات تُقدَّم بالإنجليزية أو الصينية أو اليابانية أو الكورية.',
    methodConfirmationNotice:
      'إذا لم تكن تستخدم أيًّا من هذه اللغات الأربع، فاختر «يلزم تأكيد طريقة التواصل». يؤكّد المكتب طريقة التواصل برسالة رد عند وجود طريقة ممكنة؛ ولا يضمن تقديم الخدمة بأي لغة أخرى، ولا يلتزم بمدة للرد.',
    preparationNotice:
      'يمكنك كتابة ملخّص قضيتك بلغتك. ويُحفَظ النص الأصلي كما كتبته ولا يُترجَم ترجمة آلية.',
    heading: 'إرسال طلب استشارة',
    intro:
      'يُرجى وصف قضيتك باختصار. يراجع المحامي المحتوى ثم يوضّح الخطوة التالية.',
    submitLabel: 'إرسال الطلب',
    submittingLabel: 'جارٍ الإرسال…',
    successMessage:
      'وصلنا طلبك وهو بانتظار المراجعة. وهذا لا يعني أن الجلسة قد تمّت أو أن الموعد قد تأكّد.',
    savedNotificationPendingMessage:
      'حُفِظ طلبك، غير أن إشعار المكتب لم يتأكّد بعد. ولم يُفقَد ما كتبته. وإذا لم يصلك رد، فيمكنك أيضًا المراسلة على عنوان البريد الإلكتروني المذكور في صفحة التواصل.',
    receiptIdLabel: 'رقم الاستلام',
    failureMessage:
      'تعذّر إرسال طلبك. يُرجى المحاولة مرة أخرى، أو الإرسال إلى عنوان البريد الإلكتروني المذكور في صفحة التواصل.',
    originalLanguageLabel: 'اللغة التي تكتب بها',
    originalLanguagePlaceholder:
      'مثال: العربية أو الفرنسية أو الفارسية أو التركية أو لغة أخرى',
    preferredConsultationLanguageLabel: 'اللغة التي تفضّلها للاستشارة',
    originalTextLabel: 'ملخّص القضية (بلغتك)',
    originalTextPlaceholder:
      'اذكر ما الذي حدث، وما المساعدة التي تحتاج إليها، والموعد النهائي إن وُجد. ويُرجى عدم كتابة رقم جواز السفر أو رقم الهوية أو بيانات الحساب المصرفي.',
    nameLabel: 'الاسم',
    emailLabel: 'البريد الإلكتروني',
    consentLabel:
      'اطّلعتُ على سياسة الخصوصية وأوافق على إرسال هذا الطلب.',
    privacyLinkLabel: AR_PRIVACY_POLICY_LABEL,
    requiredMessage: 'هذا الحقل مطلوب.',
    invalidEmailMessage: 'يُرجى إدخال عنوان بريد إلكتروني صحيح.',
    tooLongMessage: 'النص طويل جدًا. يُرجى اختصاره ثم إعادة الإرسال.',
    sourceLanguageNotice:
      'هذا المقال متاح بـ{language} فقط، والرابط يفتح الصفحة الأصلية بتلك اللغة.',
    unavailableTranslationNotice:
      'هذا العنصر غير مترجَم بعد إلى لغة هذه الصفحة. اضغط الرابط الذي يذكر اللغة الأصلية لقراءة النص الأصلي.',
    unavailableLanguageNotice: 'هذه الصفحة غير متاحة بـ{language}.',
    languageOptions: {
      en: 'الإنجليزية (English)',
      'zh-hant': 'الصينية (中文)',
      ja: 'اليابانية (日本語)',
      ko: 'الكورية (한국어)',
      'needs-method-confirmation':
        'لا أستطيع استخدام أي من اللغات الأربع — يلزم تأكيد طريقة التواصل',
    },
  },
  de: {
    guidanceNotice:
      'Diese Seite ist auf Deutsch als allgemeine Orientierung geschrieben, nicht als Rechtsberatung für Ihren eigenen Fall.',
    consultationNotice:
      'Die Beratung erfolgt nur in vier Sprachen: Englisch, Chinesisch (中文), Japanisch und Koreanisch.',
    methodConfirmationNotice:
      'Wenn Sie keine der vier Sprachen nutzen können, wählen Sie „Kommunikationsweise muss bestätigt werden“. Wir antworten, um zu prüfen, ob ein praktikabler Kommunikationsweg besteht; eine Leistung in einer anderen Sprache wird nicht gewährleistet und eine Antwortfrist nicht zugesagt.',
    preparationNotice:
      'Sie dürfen die Zusammenfassung in Ihrer eigenen Sprache schreiben. Der Originaltext wird so gespeichert, wie Sie ihn geschrieben haben, und nicht automatisch übersetzt.',
    heading: 'Beratungsanfrage senden',
    intro:
      'Beschreiben Sie Ihren Fall kurz. Eine Anwältin oder ein Anwalt prüft den Inhalt, bevor der nächste Schritt besprochen wird.',
    submitLabel: 'Anfrage senden',
    submittingLabel: 'Wird gesendet…',
    successMessage:
      'Wir haben Ihre Anfrage erhalten; sie wartet auf Prüfung. Das bedeutet nicht, dass die Beratung stattgefunden hat oder ein Termin bestätigt ist.',
    savedNotificationPendingMessage:
      'Ihre Anfrage ist gespeichert, die Benachrichtigung an die Kanzlei ist aber noch nicht bestätigt. Was Sie geschrieben haben, geht nicht verloren. Wenn Sie keine Antwort erhalten, können Sie auch an die E-Mail-Adresse auf der Kontaktseite schreiben.',
    receiptIdLabel: 'Empfangsnummer',
    failureMessage:
      'Ihre Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut oder schreiben Sie an die E-Mail-Adresse auf der Kontaktseite.',
    originalLanguageLabel: 'Sprache, in der Sie schreiben',
    originalLanguagePlaceholder:
      'Zum Beispiel Deutsch, Spanisch, Französisch oder eine andere Sprache',
    preferredConsultationLanguageLabel: 'Sprache, die Sie für die Beratung wünschen',
    originalTextLabel: 'Kurzdarstellung des Falls (in Ihrer Sprache)',
    originalTextPlaceholder:
      'Nennen Sie, was geschehen ist, welche Hilfe Sie brauchen und die Frist, falls eine besteht. Bitte keine Passnummer, Ausweisnummer oder Kontodaten angeben.',
    nameLabel: 'Name',
    emailLabel: 'E-Mail',
    consentLabel:
      'Ich habe die Datenschutzerklärung gelesen und stimme dem Senden dieser Anfrage zu.',
    privacyLinkLabel: 'Datenschutz',
    requiredMessage: 'Dieses Feld ist erforderlich.',
    invalidEmailMessage: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
    tooLongMessage: 'Der Text ist zu lang. Bitte kürzen Sie ihn und senden Sie erneut.',
    sourceLanguageNotice:
      'Dieser Beitrag ist nur auf {language} veröffentlicht; der Link öffnet die Originalseite.',
    unavailableTranslationNotice:
      'Dieser Punkt liegt in der Sprache dieser Seite noch nicht vor. Ein Link mit der Originalsprache öffnet den Originaltext.',
    unavailableLanguageNotice: 'Diese Seite wird nicht auf {language} angeboten.',
    languageOptions: {
      en: 'Englisch (English)',
      'zh-hant': 'Chinesisch (中文)',
      ja: 'Japanisch (日本語)',
      ko: 'Koreanisch (한국어)',
      'needs-method-confirmation':
        'Ich spreche keine der vier Sprachen — die Kommunikationsweise muss bestätigt werden',
    },
  },
  es: {
    guidanceNotice:
      'Esta página está escrita en español como orientación general, no como asesoramiento jurídico para su propio caso.',
    consultationNotice:
      'La consulta se realiza únicamente en cuatro idiomas: inglés, chino (中文), japonés y coreano.',
    methodConfirmationNotice:
      'Si no puede usar ninguno de esos cuatro idiomas, elija «Hace falta confirmar la forma de comunicarse». Responderemos para comprobar si existe una vía posible de comunicación; no se garantiza el servicio en otro idioma y no se promete un plazo de respuesta.',
    preparationNotice:
      'Puede escribir el resumen de su asunto en su propio idioma. El texto original se guarda tal como lo escribe y no se traduce de forma automática.',
    heading: 'Enviar una solicitud de consulta',
    intro:
      'Describa su asunto de forma breve. Un abogado revisa el contenido antes de hablar del siguiente paso.',
    submitLabel: 'Enviar la solicitud',
    submittingLabel: 'Enviando…',
    successMessage:
      'Hemos recibido su solicitud y espera revisión. Esto no significa que la consulta haya tenido lugar ni que se haya confirmado una cita.',
    savedNotificationPendingMessage:
      'Su solicitud está guardada, pero el aviso al despacho aún no está confirmado. Lo que escribió no se pierde. Si no recibe respuesta, también puede escribir a la dirección de correo de la página de contacto.',
    receiptIdLabel: 'Número de recepción',
    failureMessage:
      'No se pudo enviar su solicitud. Inténtelo de nuevo o escriba a la dirección de correo de la página de contacto.',
    originalLanguageLabel: 'Idioma en que escribe',
    originalLanguagePlaceholder:
      'Por ejemplo: español, alemán, francés u otro idioma',
    preferredConsultationLanguageLabel: 'Idioma que prefiere para la consulta',
    originalTextLabel: 'Resumen del asunto (en su idioma)',
    originalTextPlaceholder:
      'Indique qué ocurrió, qué ayuda necesita y el plazo si existe. No escriba número de pasaporte, número de identidad ni datos de una cuenta bancaria.',
    nameLabel: 'Nombre',
    emailLabel: 'Correo electrónico',
    consentLabel:
      'He leído la política de privacidad y acepto enviar esta solicitud.',
    privacyLinkLabel: 'Privacidad',
    requiredMessage: 'Este campo es obligatorio.',
    invalidEmailMessage: 'Introduzca una dirección de correo válida.',
    tooLongMessage: 'El texto es demasiado largo. Acórtelo y vuelva a enviarlo.',
    sourceLanguageNotice:
      'Este artículo solo está publicado en {language}, y el enlace abre esa página original.',
    unavailableTranslationNotice:
      'Este elemento aún no está traducido al idioma de esta página. Un enlace que indica el idioma original abre el texto original.',
    unavailableLanguageNotice: 'Esta página no se ofrece en {language}.',
    languageOptions: {
      en: 'Inglés (English)',
      'zh-hant': 'Chino (中文)',
      ja: 'Japonés (日本語)',
      ko: 'Coreano (한국어)',
      'needs-method-confirmation':
        'No puedo usar ninguno de los cuatro idiomas — hace falta confirmar la forma de comunicarse',
    },
  },
  fr: {
    guidanceNotice:
      'Cette page est rédigée en français comme orientation générale, non comme avis juridique pour votre propre affaire.',
    consultationNotice:
      'La consultation a lieu seulement dans quatre langues : anglais, chinois (中文), japonais et coréen.',
    methodConfirmationNotice:
      'Si vous ne pouvez utiliser aucune des quatre langues, choisissez « La manière de communiquer doit être confirmée ». Nous répondons pour examiner une manière possible de communiquer lorsqu’il en existe une ; une prestation dans une autre langue n’est pas assurée et aucun délai de réponse n’est promis.',
    preparationNotice:
      'Vous pouvez rédiger le résumé de votre affaire dans votre propre langue. Le texte original est conservé tel que vous l’avez écrit et n’est pas traduit automatiquement.',
    heading: 'Envoyer une demande de consultation',
    intro:
      'Décrivez votre affaire brièvement. Une avocate ou un avocat examine le contenu avant que l’étape suivante soit discutée.',
    submitLabel: 'Envoyer la demande',
    submittingLabel: 'Envoi en cours…',
    successMessage:
      'Nous avons reçu votre demande ; elle attend un examen. Cela ne signifie pas que la consultation a eu lieu ni qu’un rendez-vous est confirmé.',
    savedNotificationPendingMessage:
      'Votre demande est conservée, mais l’avis au cabinet n’est pas encore confirmé. Ce que vous avez écrit n’est pas perdu. Si vous ne recevez pas de réponse, vous pouvez aussi écrire à l’adresse e-mail de la page de contact.',
    receiptIdLabel: 'Numéro de réception',
    failureMessage:
      'Votre demande n’a pas pu être envoyée. Veuillez réessayer ou écrire à l’adresse e-mail de la page de contact.',
    originalLanguageLabel: 'Langue dans laquelle vous écrivez',
    originalLanguagePlaceholder:
      'Par exemple : français, allemand, espagnol ou une autre langue',
    preferredConsultationLanguageLabel: 'Langue que vous souhaitez pour la consultation',
    originalTextLabel: 'Présentation courte de l’affaire (dans votre langue)',
    originalTextPlaceholder:
      'Indiquez ce qui s’est passé, l’aide dont vous avez besoin et le délai s’il en existe un. N’écrivez pas de numéro de passeport, de numéro d’identité ni de données de compte.',
    nameLabel: 'Nom',
    emailLabel: 'E-mail',
    consentLabel:
      'J’ai lu la page de confidentialité et j’accepte l’envoi de cette demande.',
    privacyLinkLabel: 'Confidentialité',
    requiredMessage: 'Ce champ est obligatoire.',
    invalidEmailMessage: 'Veuillez indiquer une adresse e-mail valable.',
    tooLongMessage: 'Le texte est trop long. Raccourcissez-le et renvoyez-le.',
    sourceLanguageNotice:
      'Cet article n’est publié qu’en {language} ; le lien ouvre la page d’origine.',
    unavailableTranslationNotice:
      'Cet élément n’est pas encore traduit dans la langue de cette page. Un lien qui indique la langue d’origine ouvre le texte original.',
    unavailableLanguageNotice: 'Cette page n’est pas proposée en {language}.',
    languageOptions: {
      en: 'Anglais (English)',
      'zh-hant': 'Chinois (中文)',
      ja: 'Japonais (日本語)',
      ko: 'Coréen (한국어)',
      'needs-method-confirmation':
        'Aucune des quatre langues n’est utilisable — la manière de communiquer doit être confirmée',
    },
  },
  pt: {
    guidanceNotice:
      'Esta página está escrita em português como orientação geral, não como parecer jurídico para o seu próprio caso.',
    consultationNotice:
      'A consulta realiza-se apenas em quatro línguas: inglês, chinês (中文), japonês e coreano.',
    methodConfirmationNotice:
      'Se não puder usar nenhuma dessas quatro línguas, escolha «É preciso confirmar a forma de comunicar». Responderemos para examinar uma via possível de comunicação quando existir uma forma possível; não se assegura o serviço noutra língua e não se promete um prazo de resposta.',
    preparationNotice:
      'Pode escrever o resumo do seu assunto na sua própria língua. O texto original é guardado tal como o escreve e não é traduzido de forma automática.',
    heading: 'Enviar um pedido de consulta',
    intro:
      'Descreva o seu assunto de forma breve. Uma advogada ou um advogado examina o conteúdo antes de se falar do passo seguinte.',
    submitLabel: 'Enviar o pedido',
    submittingLabel: 'A enviar…',
    successMessage:
      'Recebemos o seu pedido e este espera revisão. Isto não significa que a consulta tenha tido lugar nem que se tenha confirmado uma marcação.',
    savedNotificationPendingMessage:
      'O seu pedido está guardado, mas o aviso ao escritório ainda não está confirmado. O que escreveu não se perde. Se não receber resposta, também pode escrever para o endereço de correio da página de contacto.',
    receiptIdLabel: 'Número de receção',
    failureMessage:
      'Não foi possível enviar o seu pedido. Tente de novo ou escreva para o endereço de correio da página de contacto.',
    originalLanguageLabel: 'Língua em que escreve',
    originalLanguagePlaceholder:
      'Por exemplo: português, francês, espanhol ou outra língua',
    preferredConsultationLanguageLabel: 'Língua que prefere para a consulta',
    originalTextLabel: 'Resumo do assunto (na sua língua)',
    originalTextPlaceholder:
      'Indique o que ocorreu, que ajuda precisa e o prazo se existir. Não escreva número de passaporte, número de identidade nem dados de uma conta bancária.',
    nameLabel: 'Nome',
    emailLabel: 'Correio eletrónico',
    consentLabel:
      'Li a política de privacidade e aceito enviar este pedido.',
    privacyLinkLabel: 'Privacidade',
    requiredMessage: 'Este campo é obrigatório.',
    invalidEmailMessage: 'Introduza um endereço de correio válido.',
    tooLongMessage: 'O texto é demasiado longo. Encurte-o e volte a enviá-lo.',
    sourceLanguageNotice:
      'Este artigo só está publicado em {language}, e a ligação abre essa página original.',
    unavailableTranslationNotice:
      'Este elemento ainda não está traduzido para a língua desta página. Uma ligação que indica a língua original abre o texto original.',
    unavailableLanguageNotice: 'Esta página não está disponível em {language}.',
    languageOptions: {
      en: 'Inglês (English)',
      'zh-hant': 'Chinês (中文)',
      ja: 'Japonês (日本語)',
      ko: 'Coreano (한국어)',
      'needs-method-confirmation':
        'Não posso usar nenhuma das quatro línguas — é preciso confirmar a forma de comunicar',
    },
  },
  'zh-hans': {
    guidanceNotice:
      '本页面以简体中文撰写，作为一般说明，不是针对您本人案件的法律意见。',
    consultationNotice:
      '咨询以四种语言进行：英语、中文、日语和韩语。',
    methodConfirmationNotice:
      '若您无法使用这四种语言中的任何一种，请选择“沟通方式须待确认”。我们会回复，评估是否有可行的沟通安排；不以其他语言提供服务，也不承诺回复时限。',
    preparationNotice:
      '您可以用自己的语言撰写案情摘要。原文会按您写下的内容保存，不会被自动翻译。',
    heading: '提交咨询请求',
    intro:
      '请简要说明您的事项。律师会先审阅内容，再讨论下一步。',
    submitLabel: '发送请求',
    submittingLabel: '正在发送…',
    successMessage:
      '我们已收到您的请求，正在等待审阅。这并不表示咨询已经进行，也不表示预约已经确认。',
    savedNotificationPendingMessage:
      '您的请求已保存，但事务所尚未确认通知。您写下的内容没有丢失。若未收到回复，也可以写信至联系页的电子邮件地址。',
    receiptIdLabel: '收件编号',
    failureMessage:
      '您的请求未能发送。请再试一次，或写信至联系页的电子邮件地址。',
    originalLanguageLabel: '您书写所用的语言',
    originalLanguagePlaceholder:
      '例如：简体中文、英语、日语或其他语言',
    preferredConsultationLanguageLabel: '您希望用于咨询的语言',
    originalTextLabel: '事项的简短说明（用您的语言）',
    originalTextPlaceholder:
      '请说明发生了什么、您需要何种协助，以及期限（若有）。请勿写下护照号码、身份证件号码或银行账户信息。',
    nameLabel: '姓名',
    emailLabel: '电子邮件',
    consentLabel:
      '我已阅读隐私页面，并同意发送此请求。',
    privacyLinkLabel: '隐私',
    requiredMessage: '此栏为必填。',
    invalidEmailMessage: '请填写有效的电子邮件地址。',
    tooLongMessage: '文本过长。请缩短后再发送。',
    sourceLanguageNotice:
      '此文章仅以{language}发布，链接会打开该原文页面。',
    unavailableTranslationNotice:
      '此项目尚无本页语言的版本。标明原文语言的链接会打开原文。',
    unavailableLanguageNotice: '本页不以{language}提供。',
    languageOptions: {
      en: '英语（English）',
      'zh-hant': '中文',
      ja: '日语（日本語）',
      ko: '韩语（한국어）',
      'needs-method-confirmation':
        '四种语言都无法使用 — 沟通方式须待确认',
    },
  },
  ms: {
    guidanceNotice:
      'Halaman ini ditulis dalam bahasa Melayu sebagai maklumat am, bukan sebagai nasihat undang-undang bagi kes anda sendiri.',
    consultationNotice:
      'Perundingan hanya dijalankan dalam empat bahasa: Inggeris, Cina (中文), Jepun dan Korea.',
    methodConfirmationNotice:
      'Jika anda tidak dapat menggunakan mana-mana daripada empat bahasa itu, pilih “Cara berkomunikasi mesti disahkan”. Kami menjawab untuk meneliti sama ada terdapat cara berkomunikasi yang boleh digunakan; perkhidmatan dalam bahasa lain tidak dijanjikan dan tempoh jawapan tidak dijanjikan.',
    preparationNotice:
      'Anda boleh menulis ringkasan hal anda dalam bahasa anda sendiri. Teks asal disimpan sebagaimana anda menulisnya dan tidak diterjemah secara automatik.',
    heading: 'Hantar permintaan perundingan',
    intro:
      'Terangkan hal anda secara ringkas. Seorang peguam menyemak kandungan sebelum langkah seterusnya dibincangkan.',
    submitLabel: 'Hantar permintaan',
    submittingLabel: 'Sedang dihantar…',
    successMessage:
      'Kami telah menerima permintaan anda; ia menunggu semakan. Ini tidak bermakna perundingan telah berlaku atau janji temu telah disahkan.',
    savedNotificationPendingMessage:
      'Permintaan anda disimpan, tetapi pemberitahuan kepada firma belum disahkan. Apa yang anda tulis tidak hilang. Jika anda tidak menerima jawapan, anda juga boleh menulis ke alamat e-mel halaman hubungan.',
    receiptIdLabel: 'Nombor penerimaan',
    failureMessage:
      'Permintaan anda tidak dapat dihantar. Sila cuba lagi atau tulis ke alamat e-mel halaman hubungan.',
    originalLanguageLabel: 'Bahasa yang anda gunakan untuk menulis',
    originalLanguagePlaceholder:
      'Contoh: bahasa Melayu, Inggeris, Cina atau bahasa lain',
    preferredConsultationLanguageLabel: 'Bahasa yang anda inginkan untuk perundingan',
    originalTextLabel: 'Ringkasan ringkas hal (dalam bahasa anda)',
    originalTextPlaceholder:
      'Nyatakan apa yang berlaku, bantuan yang anda perlukan dan tempoh jika ada. Jangan tulis nombor pasport, nombor pengenalan atau data akaun bank.',
    nameLabel: 'Nama',
    emailLabel: 'E-mel',
    consentLabel:
      'Saya telah membaca halaman privasi dan bersetuju menghantar permintaan ini.',
    privacyLinkLabel: 'Privasi',
    requiredMessage: 'Medan ini wajib diisi.',
    invalidEmailMessage: 'Sila masukkan alamat e-mel yang sah.',
    tooLongMessage: 'Teks terlalu panjang. Pendekkan dan hantar semula.',
    sourceLanguageNotice:
      'Rencana ini hanya diterbitkan dalam {language}, dan pautan membuka halaman asal itu.',
    unavailableTranslationNotice:
      'Unsur ini belum diterjemah ke bahasa halaman ini. Pautan yang menyatakan bahasa asal membuka teks asal.',
    unavailableLanguageNotice: 'Halaman ini tidak ditawarkan dalam {language}.',
    languageOptions: {
      en: 'Inggeris (English)',
      'zh-hant': 'Cina (中文)',
      ja: 'Jepun (日本語)',
      ko: 'Korea (한국어)',
      'needs-method-confirmation':
        'Saya tidak dapat menggunakan mana-mana daripada empat bahasa — cara berkomunikasi mesti disahkan',
    },
  },
  ru: {
    guidanceNotice:
      'Эта страница написана на русском языке как общие сведения, а не как юридическая консультация по Вашему делу.',
    consultationNotice:
      'Консультация проводится только на четырёх языках: английском, китайском (中文), японском и корейском.',
    methodConfirmationNotice:
      'Если Вы не можете пользоваться ни одним из четырёх языков, выберите «Способ связи должен быть подтверждён». Мы отвечаем, чтобы рассмотреть возможный способ связи, если такой способ есть; услуга на другом языке не обеспечивается, и срок ответа не обещается.',
    preparationNotice:
      'Вы можете написать краткое изложение дела на своём языке. Исходный текст сохраняется так, как Вы его написали, и автоматически не переводится.',
    heading: 'Отправить запрос на консультацию',
    intro:
      'Кратко опишите Ваше дело. Адвокат рассматривает содержание до того, как обсуждается следующий шаг.',
    submitLabel: 'Отправить запрос',
    submittingLabel: 'Отправка…',
    successMessage:
      'Мы получили Ваш запрос; он ожидает рассмотрения. Это не означает, что консультация состоялась или что запись подтверждена.',
    savedNotificationPendingMessage:
      'Ваш запрос сохранён, но уведомление фирме ещё не подтверждено. Написанное Вами не теряется. Если ответа нет, Вы можете также написать на адрес электронной почты страницы контактов.',
    receiptIdLabel: 'Номер обращения',
    failureMessage:
      'Ваш запрос не удалось отправить. Повторите попытку или напишите на адрес электронной почты страницы контактов.',
    originalLanguageLabel: 'Язык, на котором Вы пишете',
    originalLanguagePlaceholder:
      'Например: русский, английский, китайский или другой язык',
    preferredConsultationLanguageLabel: 'Желаемый язык консультации',
    originalTextLabel: 'Краткое изложение дела (на Вашем языке)',
    originalTextPlaceholder:
      'Укажите, что произошло, какая помощь нужна и срок, если он есть. Не пишите номер паспорта, номер удостоверения или данные счёта.',
    nameLabel: 'Имя',
    emailLabel: 'Электронная почта',
    consentLabel:
      'Я прочитал(а) страницу о конфиденциальности и соглашаюсь отправить этот запрос.',
    privacyLinkLabel: 'Конфиденциальность',
    requiredMessage: 'Это поле обязательно.',
    invalidEmailMessage: 'Укажите действительный адрес электронной почты.',
    tooLongMessage: 'Текст слишком длинный. Сократите его и отправьте снова.',
    sourceLanguageNotice:
      'Этот материал опубликован только на языке {language}; ссылка открывает исходную страницу.',
    unavailableTranslationNotice:
      'Этот элемент ещё не переведён на язык этой страницы. Ссылка, указывающая язык оригинала, открывает исходный текст.',
    unavailableLanguageNotice: 'Эта страница не предлагается на языке {language}.',
    languageOptions: {
      en: 'Английский (English)',
      'zh-hant': 'Китайский (中文)',
      ja: 'Японский (日本語)',
      ko: 'Корейский (한국어)',
      'needs-method-confirmation':
        'Ни один из четырёх языков недоступен — способ связи должен быть подтверждён',
    },
  },
  tr: {
    guidanceNotice:
      'Bu sayfa genel bilgi olarak Türkçe yazılmıştır; sizin dosyanız için hukuki görüş değildir.',
    consultationNotice:
      'Görüşme yalnızca dört dilde yapılır: İngilizce, Çince (中文), Japonca ve Korece.',
    methodConfirmationNotice:
      'Dört dilden hiçbirini kullanamıyorsanız “İletişim yolunun doğrulanması gerekir” seçeneğini seçin. Kullanılabilir bir yol varsa, o yolu incelemek için yanıtlarız; başka dilde hizmet sağlanmaz ve yanıt süresi vaat edilmez.',
    preparationNotice:
      'İşinizin özetini kendi dilinizde yazabilirsiniz. Özgün metin yazdığınız gibi saklanır ve kendiliğinden çevrilmez.',
    heading: 'Görüşme talebi gönderin',
    intro:
      'İşinizi kısaca anlatın. Bir avukat, sonraki adım konuşulmadan önce içeriği inceler.',
    submitLabel: 'Talebi gönderin',
    submittingLabel: 'Gönderiliyor…',
    successMessage:
      'Talebinizi aldık; inceleme bekliyor. Bu, görüşmenin yapıldığı veya bir randevunun doğrulandığı anlamına gelmez.',
    savedNotificationPendingMessage:
      'Talebiniz saklandı, ancak büroya bildirim henüz doğrulanmadı. Yazdıklarınız kaybolmaz. Yanıt almazsanız iletişim sayfasındaki e-posta adresine de yazabilirsiniz.',
    receiptIdLabel: 'Alındı numarası',
    failureMessage:
      'Talebiniz gönderilemedi. Yeniden deneyin veya iletişim sayfasındaki e-posta adresine yazın.',
    originalLanguageLabel: 'Yazdığınız dil',
    originalLanguagePlaceholder:
      'Örneğin: Türkçe, İngilizce, Çince veya başka bir dil',
    preferredConsultationLanguageLabel: 'Görüşme için istediğiniz dil',
    originalTextLabel: 'İşin kısa özeti (kendi dilinizde)',
    originalTextPlaceholder:
      'Ne olduğunu, hangi konuda yardıma ihtiyaç duyduğunuzu ve varsa süreyi belirtin. Pasaport numarası, kimlik numarası veya hesap bilgisi yazmayın.',
    nameLabel: 'Ad',
    emailLabel: 'E-posta',
    consentLabel:
      'Gizlilik sayfasını okudum ve bu talebin gönderilmesini kabul ediyorum.',
    privacyLinkLabel: 'Gizlilik',
    requiredMessage: 'Bu alan zorunludur.',
    invalidEmailMessage: 'Geçerli bir e-posta adresi girin.',
    tooLongMessage: 'Metin çok uzun. Kısaltıp yeniden gönderin.',
    sourceLanguageNotice:
      'Bu yazı yalnızca {language} dilinde yayımlanmıştır ve bağlantı o özgün sayfayı açar.',
    unavailableTranslationNotice:
      'Bu öğe henüz bu sayfanın diline çevrilmemiştir. Özgün dili belirten bir bağlantı özgün metni açar.',
    unavailableLanguageNotice: 'Bu sayfa {language} dilinde sunulmaz.',
    languageOptions: {
      en: 'İngilizce (English)',
      'zh-hant': 'Çince (中文)',
      ja: 'Japonca (日本語)',
      ko: 'Korece (한국어)',
      'needs-method-confirmation':
        'Dört dilden hiçbirini kullanamıyorum — iletişim yolunun doğrulanması gerekir',
    },
  },
  it: {
    guidanceNotice:
      'Questa pagina è scritta in italiano come orientamento generale, non come consulenza legale per il Suo caso.',
    consultationNotice:
      'La consulenza si svolge soltanto in quattro lingue: inglese, cinese (中文), giapponese e coreano.',
    methodConfirmationNotice:
      'Se non può usare nessuna delle quattro lingue, scelga «Il canale di comunicazione deve essere confermato». Rispondiamo per esaminare un canale di comunicazione praticabile, se un canale del genere esiste; una prestazione in un’altra lingua non è garantita e un termine di risposta non è promesso.',
    preparationNotice:
      'Può scrivere il riassunto nella Sua lingua. Il testo originale viene conservato così come lo ha scritto e non viene tradotto automaticamente.',
    heading: 'Inviare una richiesta di consulenza',
    intro:
      'Descriva brevemente la Sua questione. Un’avvocata o un avvocato esamina il contenuto prima che si parli del passo successivo.',
    submitLabel: 'Inviare la richiesta',
    submittingLabel: 'Invio in corso…',
    successMessage:
      'Abbiamo ricevuto la Sua richiesta; attende l’esame. Ciò non significa che la consulenza abbia avuto luogo o che un appuntamento sia confermato.',
    savedNotificationPendingMessage:
      'La Sua richiesta è conservata, ma la notifica allo studio non è ancora confermata. Quanto ha scritto non va perduto. Se non riceve risposta, può anche scrivere all’indirizzo di posta elettronica della pagina di contatto.',
    receiptIdLabel: 'Numero di ricezione',
    failureMessage:
      'Non è stato possibile inviare la Sua richiesta. Riprovi o scriva all’indirizzo di posta elettronica della pagina di contatto.',
    originalLanguageLabel: 'Lingua in cui scrive',
    originalLanguagePlaceholder:
      'Ad esempio italiano, inglese, cinese o un’altra lingua',
    preferredConsultationLanguageLabel: 'Lingua che desidera per la consulenza',
    originalTextLabel: 'Breve esposizione della questione (nella Sua lingua)',
    originalTextPlaceholder:
      'Indichi che cosa è accaduto, di quale aiuto ha bisogno e il termine, se ve n’è uno. Non indichi il numero di passaporto, il numero di documento o i dati di un conto.',
    nameLabel: 'Nome',
    emailLabel: 'Posta elettronica',
    consentLabel:
      'Ho letto l’informativa sulla privacy e acconsento all’invio di questa richiesta.',
    privacyLinkLabel: 'Privacy',
    requiredMessage: 'Questo campo è obbligatorio.',
    invalidEmailMessage: 'Indichi un indirizzo di posta elettronica valido.',
    tooLongMessage: 'Il testo è troppo lungo. Lo accorci e invii di nuovo.',
    sourceLanguageNotice:
      'Questo articolo è pubblicato soltanto in {language}; il collegamento apre la pagina originale.',
    unavailableTranslationNotice:
      'Questo punto non è ancora disponibile nella lingua di questa pagina. Un collegamento con la lingua originale apre il testo originale.',
    unavailableLanguageNotice: 'Questa pagina non è offerta in {language}.',
    languageOptions: {
      en: 'Inglese (English)',
      'zh-hant': 'Cinese (中文)',
      ja: 'Giapponese (日本語)',
      ko: 'Coreano (한국어)',
      'needs-method-confirmation':
        'Nessuna delle quattro lingue è utilizzabile — il canale di comunicazione deve essere confermato',
    },
  },
  nl: {
    guidanceNotice:
      'Deze pagina is in het Nederlands geschreven als algemene oriëntatie, niet als juridisch advies voor uw eigen zaak.',
    consultationNotice:
      'De consultatie vindt alleen plaats in vier talen: Engels, Chinees (中文), Japans en Koreaans.',
    methodConfirmationNotice:
      'Als u geen van de vier talen kunt gebruiken, kies dan “Communicatiekanaal moet worden bevestigd”. Wij antwoorden om te onderzoeken of er een werkbare manier van communiceren bestaat; een dienst in een andere taal wordt niet gewaarborgd en een antwoordtermijn niet toegezegd.',
    preparationNotice:
      'U mag de samenvatting in uw eigen taal schrijven. De oorspronkelijke tekst wordt bewaard zoals u die hebt geschreven en niet automatisch vertaald.',
    heading: 'Een verzoek om advies sturen',
    intro:
      'Beschrijf uw zaak kort. Een advocaat beoordeelt de inhoud voordat de volgende stap wordt besproken.',
    submitLabel: 'Het verzoek sturen',
    submittingLabel: 'Wordt verzonden…',
    successMessage:
      'Wij hebben uw verzoek ontvangen; het wacht op beoordeling. Dit betekent niet dat de consultatie heeft plaatsgevonden of dat een afspraak is bevestigd.',
    savedNotificationPendingMessage:
      'Uw verzoek is bewaard, maar de kennisgeving aan het kantoor is nog niet bevestigd. Wat u hebt geschreven, gaat niet verloren. Als u geen antwoord ontvangt, kunt u ook schrijven naar het e-mailadres op de contactpagina.',
    receiptIdLabel: 'Ontvangstnummer',
    failureMessage:
      'Uw verzoek kon niet worden verzonden. Probeer het opnieuw of schrijf naar het e-mailadres op de contactpagina.',
    originalLanguageLabel: 'Taal waarin u schrijft',
    originalLanguagePlaceholder:
      'Bijvoorbeeld Nederlands, Engels, Chinees of een andere taal',
    preferredConsultationLanguageLabel: 'Taal die u voor de consultatie wenst',
    originalTextLabel: 'Korte beschrijving van de zaak (in uw taal)',
    originalTextPlaceholder:
      'Noem wat er is gebeurd, welke hulp u nodig hebt en de termijn, als er een is. Schrijf geen paspoortnummer, identiteitsnummer of rekeninggegevens.',
    nameLabel: 'Naam',
    emailLabel: 'E-mail',
    consentLabel:
      'Ik heb de privacypagina gelezen en stem in met het versturen van dit verzoek.',
    privacyLinkLabel: 'Privacy',
    requiredMessage: 'Dit veld is verplicht.',
    invalidEmailMessage: 'Geef een geldig e-mailadres op.',
    tooLongMessage: 'De tekst is te lang. Kort hem in en stuur opnieuw.',
    sourceLanguageNotice:
      'Dit artikel is alleen in het {language} gepubliceerd; de koppeling opent de oorspronkelijke pagina.',
    unavailableTranslationNotice:
      'Dit punt is in de taal van deze pagina nog niet beschikbaar. Een koppeling met de oorspronkelijke taal opent de oorspronkelijke tekst.',
    unavailableLanguageNotice: 'Deze pagina wordt niet in het {language} aangeboden.',
    languageOptions: {
      en: 'Engels (English)',
      'zh-hant': 'Chinees (中文)',
      ja: 'Japans (日本語)',
      ko: 'Koreaans (한국어)',
      'needs-method-confirmation':
        'Geen van de vier talen is bruikbaar — communicatiekanaal moet worden bevestigd',
    },
  },
  pl: {
    guidanceNotice:
      'Ta strona jest napisana po polsku jako ogólna orientacja, a nie jako porada prawna w Państwa sprawie.',
    consultationNotice:
      'Konsultacja odbywa się wyłącznie w czterech językach: angielskim, chińskim (中文), japońskim i koreańskim.',
    methodConfirmationNotice:
      'Jeśli nie można korzystać z żadnego z czterech języków, prosimy wybrać „Sposób komunikacji musi zostać potwierdzony”. Odpowiadamy, aby ustalić możliwy sposób komunikacji, jeśli taki sposób istnieje; nie świadczymy usług w innym języku i nie obiecujemy terminu odpowiedzi.',
    preparationNotice:
      'Można napisać streszczenie we własnym języku. Oryginalny tekst jest zapisywany tak, jak został napisany, i nie jest tłumaczony automatycznie.',
    heading: 'Wyślij wniosek o konsultację',
    intro:
      'Prosimy krótko opisać sprawę. Adwokat rozpatruje treść, zanim omawia się kolejny krok.',
    submitLabel: 'Wyślij wniosek',
    submittingLabel: 'Wysyłanie…',
    successMessage:
      'Otrzymaliśmy wniosek; czeka na rozpatrzenie. To nie oznacza, że konsultacja się odbyła ani że termin został potwierdzony.',
    savedNotificationPendingMessage:
      'Wniosek jest zapisany, ale powiadomienie kancelarii nie jest jeszcze potwierdzone. Treść wiadomości nie została utracona. Jeśli nie ma odpowiedzi, można też napisać na adres poczty elektronicznej strony kontaktu.',
    receiptIdLabel: 'Numer odbioru',
    failureMessage:
      'Nie udało się wysłać wniosku. Prosimy spróbować ponownie albo napisać na adres poczty elektronicznej strony kontaktu.',
    originalLanguageLabel: 'Język, w którym Państwo piszą',
    originalLanguagePlaceholder:
      'Na przykład polski, angielski, chiński lub inny język',
    preferredConsultationLanguageLabel: 'Język, którego Państwo życzą sobie do konsultacji',
    originalTextLabel: 'Krótki opis sprawy (we własnym języku)',
    originalTextPlaceholder:
      'Prosimy podać, co się stało, jakiej pomocy potrzeba i termin, jeśli istnieje. Prosimy nie wpisywać numeru paszportu, numeru dokumentu ani danych rachunku.',
    nameLabel: 'Imię i nazwisko',
    emailLabel: 'Poczta elektroniczna',
    consentLabel:
      'Przeczytałem(-am) stronę o prywatności i wyrażam zgodę na wysłanie tego wniosku.',
    privacyLinkLabel: 'Prywatność',
    requiredMessage: 'To pole jest wymagane.',
    invalidEmailMessage: 'Prosimy podać prawidłowy adres poczty elektronicznej.',
    tooLongMessage: 'Tekst jest zbyt długi. Prosimy skrócić i wysłać ponownie.',
    sourceLanguageNotice:
      'Ten artykuł jest opublikowany tylko w języku {language}; łącze otwiera stronę oryginalną.',
    unavailableTranslationNotice:
      'Ten punkt nie jest jeszcze dostępny w języku tej strony. Łącze z językiem oryginału otwiera tekst oryginalny.',
    unavailableLanguageNotice: 'Ta strona nie jest oferowana w języku {language}.',
    languageOptions: {
      en: 'Angielski (English)',
      'zh-hant': 'Chiński (中文)',
      ja: 'Japoński (日本語)',
      ko: 'Koreański (한국어)',
      'needs-method-confirmation':
        'Żaden z czterech języków nie jest dostępny — sposób komunikacji musi zostać potwierdzony',
    },
  },
  hi: {
    guidanceNotice:
      'यह पृष्ठ हिंदी में सामान्य जानकारी के रूप में लिखा गया है, आपके मामले की कानूनी राय के रूप में नहीं।',
    consultationNotice:
      'परामर्श चार भाषाओं में होता है: अंग्रेज़ी, चीनी (中文), जापानी और कोरियाई।',
    methodConfirmationNotice:
      'यदि आप चार भाषाओं में से किसी का उपयोग न कर सकें, तो “संचार मार्ग की पुष्टि आवश्यक है” चुनें। हम व्यवहार्य संचार मार्ग जाँचने के लिए उत्तर देते हैं, यदि ऐसा मार्ग हो; अन्य भाषा में सेवा सुनिश्चित नहीं है और उत्तर की समयसीमा का वादा नहीं है।',
    preparationNotice:
      'आप सार अपनी भाषा में लिख सकते हैं। मूल पाठ वैसे ही रखा जाता है जैसा आपने लिखा और स्वचालित रूप से अनुवाद नहीं किया जाता।',
    heading: 'परामर्श अनुरोध भेजें',
    intro:
      'अपने मामले का संक्षेप में वर्णन करें। अगले चरण की चर्चा से पहले अधिवक्ता सामग्री की जाँच करते हैं।',
    submitLabel: 'अनुरोध भेजें',
    submittingLabel: 'भेजा जा रहा है…',
    successMessage:
      'हमने आपका अनुरोध प्राप्त कर लिया; वह जाँच की प्रतीक्षा करता है। इसका अर्थ यह नहीं कि परामर्श हो चुका या नियुक्ति पुष्ट हुई।',
    savedNotificationPendingMessage:
      'आपका अनुरोध सुरक्षित है, लेकिन कार्यालय को सूचना अभी पुष्ट नहीं हुई। जो आपने लिखा वह नहीं खोता। यदि उत्तर न मिले, तो संपर्क पृष्ठ के ईमेल पते पर भी लिख सकते हैं।',
    receiptIdLabel: 'प्राप्ति संख्या',
    failureMessage:
      'आपका अनुरोध नहीं भेजा जा सका। पुनः प्रयास करें या संपर्क पृष्ठ के ईमेल पते पर लिखें।',
    originalLanguageLabel: 'जिस भाषा में आप लिखते हैं',
    originalLanguagePlaceholder:
      'उदाहरण के लिए हिंदी, अंग्रेज़ी, चीनी या कोई अन्य भाषा',
    preferredConsultationLanguageLabel: 'परामर्श के लिए इच्छित भाषा',
    originalTextLabel: 'मामले का संक्षिप्त विवरण (अपनी भाषा में)',
    originalTextPlaceholder:
      'बताएँ क्या हुआ, किस सहायता की आवश्यकता है और यदि हो तो समयसीमा। पासपोर्ट संख्या, पहचान संख्या या खाता विवरण न लिखें।',
    nameLabel: 'नाम',
    emailLabel: 'ईमेल',
    consentLabel:
      'मैंने गोपनीयता पृष्ठ पढ़ लिया है और इस अनुरोध को भेजने की सहमति देता/देती हूँ।',
    privacyLinkLabel: 'गोपनीयता',
    requiredMessage: 'यह फ़ील्ड आवश्यक है।',
    invalidEmailMessage: 'कृपया मान्य ईमेल पता दें।',
    tooLongMessage: 'पाठ बहुत लंबा है। उसे छोटा कर फिर भेजें।',
    sourceLanguageNotice:
      'यह लेख केवल {language} में प्रकाशित है; लिंक मूल पृष्ठ खोलता है।',
    unavailableTranslationNotice:
      'यह बिंदु इस पृष्ठ की भाषा में अभी उपलब्ध नहीं है। मूल भाषा का लिंक मूल पाठ खोलता है।',
    unavailableLanguageNotice: 'यह पृष्ठ {language} में उपलब्ध नहीं है।',
    languageOptions: {
      en: 'अंग्रेज़ी (English)',
      'zh-hant': 'चीनी (中文)',
      ja: 'जापानी (日本語)',
      ko: 'कोरियाई (한국어)',
      'needs-method-confirmation':
        'चार भाषाओं में से कोई उपयोगी नहीं — संचार मार्ग की पुष्टि आवश्यक है',
    },
  },
  sv: {
    guidanceNotice:
      'Den här sidan är skriven på svenska som allmän vägledning, inte som juridisk rådgivning för ditt ärende.',
    consultationNotice:
      'Rådgivningen sker endast på fyra språk: engelska, kinesiska (中文), japanska och koreanska.',
    methodConfirmationNotice:
      'Om du inte kan använda något av de fyra språken, välj ”Kommunikationsvägen måste bekräftas”. Vi hör av oss för att undersöka om det finns en användbar kommunikationsväg; rådgivning på ett annat språk utlovas inte och ingen svarstid lovas.',
    preparationNotice:
      'Du får skriva sammanfattningen på ditt eget språk. Originaltexten sparas som du har skrivit den och översätts inte automatiskt.',
    heading: 'Skicka en begäran om rådgivning',
    intro:
      'Beskriv ditt ärende kort. En advokat granskar innehållet innan nästa steg diskuteras.',
    submitLabel: 'Skicka begäran',
    submittingLabel: 'Skickas…',
    successMessage:
      'Vi har tagit emot din begäran; den väntar på granskning. Det betyder inte att rådgivningen har ägt rum eller att en tid är bekräftad.',
    savedNotificationPendingMessage:
      'Din begäran är sparad, men underrättelsen till byrån är ännu inte bekräftad. Det du har skrivit går inte förlorat. Om du inte får svar kan du också skriva till e-postadressen på kontaktsidan.',
    receiptIdLabel: 'Mottagningsnummer',
    failureMessage:
      'Din begäran kunde inte skickas. Försök igen eller skriv till e-postadressen på kontaktsidan.',
    originalLanguageLabel: 'Språk du skriver på',
    originalLanguagePlaceholder:
      'Till exempel svenska, engelska, kinesiska eller ett annat språk',
    preferredConsultationLanguageLabel: 'Språk du önskar för rådgivningen',
    originalTextLabel: 'Kort redogörelse för ärendet (på ditt språk)',
    originalTextPlaceholder:
      'Ange vad som har hänt, vilken hjälp du behöver och fristen, om det finns någon. Ange inte passnummer, identitetsnummer eller kontouppgifter.',
    nameLabel: 'Namn',
    emailLabel: 'E-post',
    consentLabel:
      'Jag har läst integritetssidan och samtycker till att begäran skickas.',
    privacyLinkLabel: 'Integritet',
    requiredMessage: 'Detta fält är obligatoriskt.',
    invalidEmailMessage: 'Ange en giltig e-postadress.',
    tooLongMessage: 'Texten är för lång. Korta den och skicka igen.',
    sourceLanguageNotice:
      'Den här artikeln är publicerad endast på {language}; länken öppnar originalsidan.',
    unavailableTranslationNotice:
      'Den här punkten är ännu inte tillgänglig på sidans språk. En länk med originalspråket öppnar originaltexten.',
    unavailableLanguageNotice: 'Den här sidan erbjuds inte på {language}.',
    languageOptions: {
      en: 'Engelska (English)',
      'zh-hant': 'Kinesiska (中文)',
      ja: 'Japanska (日本語)',
      ko: 'Koreanska (한국어)',
      'needs-method-confirmation':
        'Jag behärskar inte något av de fyra språken — kommunikationsvägen måste bekräftas',
    },
  },
  da: {
    guidanceNotice:
      'Denne side er skrevet på dansk som almindelig orientering, ikke som juridisk rådgivning for din sag.',
    consultationNotice:
      'Rådgivningen foregår kun på fire sprog: engelsk, kinesisk (中文), japansk og koreansk.',
    methodConfirmationNotice:
      'Hvis du ikke kan bruge noget af de fire sprog, skal du vælge »Kommunikationsvejen skal bekræftes«. Vi vender tilbage for at undersøge, om der findes en brugbar kommunikationsvej; rådgivning på et andet sprog loves ikke, og der loves ingen svartid.',
    preparationNotice:
      'Du må skrive resuméet på dit eget sprog. Originalteksten gemmes, som du har skrevet den, og oversættes ikke automatisk.',
    heading: 'Send en anmodning om rådgivning',
    intro:
      'Beskriv din sag kort. En advokat gennemgår indholdet, før det næste skridt drøftes.',
    submitLabel: 'Send anmodningen',
    submittingLabel: 'Sendes…',
    successMessage:
      'Vi har modtaget din anmodning; den venter på gennemgang. Det betyder ikke, at rådgivningen har fundet sted, eller at en tid er bekræftet.',
    savedNotificationPendingMessage:
      'Din anmodning er gemt, men underretningen til kontoret er endnu ikke bekræftet. Det, du har skrevet, går ikke tabt. Hvis du ikke får svar, kan du også skrive til e-mailadressen på kontaktsiden.',
    receiptIdLabel: 'Modtagelsesnummer',
    failureMessage:
      'Din anmodning kunne ikke sendes. Prøv igen, eller skriv til e-mailadressen på kontaktsiden.',
    originalLanguageLabel: 'Sprog, du skriver på',
    originalLanguagePlaceholder:
      'For eksempel dansk, engelsk, kinesisk eller et andet sprog',
    preferredConsultationLanguageLabel: 'Sprog, du ønsker til rådgivningen',
    originalTextLabel: 'Kort fremstilling af sagen (på dit sprog)',
    originalTextPlaceholder:
      'Angiv, hvad der er sket, hvilken hjælp du har brug for, og fristen, hvis der er en. Angiv ikke pasnummer, identitetsnummer eller kontooplysninger.',
    nameLabel: 'Navn',
    emailLabel: 'E-mail',
    consentLabel:
      'Jeg har læst privatlivssiden og samtykker i, at denne anmodning sendes.',
    privacyLinkLabel: 'Privatliv',
    requiredMessage: 'Dette felt er obligatorisk.',
    invalidEmailMessage: 'Angiv en gyldig e-mailadresse.',
    tooLongMessage: 'Teksten er for lang. Forkort den og send igen.',
    sourceLanguageNotice:
      'Denne artikel er kun offentliggjort på {language}; linket åbner originalsiden.',
    unavailableTranslationNotice:
      'Dette punkt er endnu ikke tilgængeligt på sidens sprog. Et link med originalsproget åbner originalteksten.',
    unavailableLanguageNotice: 'Denne side tilbydes ikke på {language}.',
    languageOptions: {
      en: 'Engelsk (English)',
      'zh-hant': 'Kinesisk (中文)',
      ja: 'Japansk (日本語)',
      ko: 'Koreansk (한국어)',
      'needs-method-confirmation':
        'Jeg behersker ikke noget af de fire sprog — kommunikationsvejen skal bekræftes',
    },
  },
  nb: {
    guidanceNotice:
      'Denne siden er skrevet på norsk som alminnelig orientering, ikke som juridisk rådgivning for Deres sak.',
    consultationNotice:
      'Rådgivningen foregår på fire språk: engelsk, kinesisk (中文), japansk og koreansk.',
    methodConfirmationNotice:
      'Hvis De ikke kan bruke noe av de fire språkene, velg «Kommunikasjonsveien må bekreftes». Vi svarer for å undersøke en brukbar kommunikasjonsvei, hvis en slik vei finnes; en ytelse på et annet språk sikres ikke, og en svartid loves ikke.',
    preparationNotice:
      'De kan skrive sammendraget på Deres eget språk. Originalteksten lagres slik De har skrevet den, og oversettes ikke automatisk.',
    heading: 'Send en forespørsel om rådgivning',
    intro:
      'Beskriv Deres sak kort. En advokat gjennomgår innholdet før neste skritt diskuteres.',
    submitLabel: 'Send forespørselen',
    submittingLabel: 'Sendes…',
    successMessage:
      'Vi har mottatt Deres forespørsel; den venter på gjennomgang. Det betyr ikke at rådgivningen har funnet sted, eller at en time er bekreftet.',
    savedNotificationPendingMessage:
      'Deres forespørsel er lagret, men underretningen til kontoret er ennå ikke bekreftet. Det De har skrevet, går ikke tapt. Hvis De ikke får svar, kan De også skrive til e-postadressen på kontaktsiden.',
    receiptIdLabel: 'Mottakelsesnummer',
    failureMessage:
      'Deres forespørsel kunne ikke sendes. Prøv igjen, eller skriv til e-postadressen på kontaktsiden.',
    originalLanguageLabel: 'Språk De skriver på',
    originalLanguagePlaceholder:
      'For eksempel norsk, engelsk, kinesisk eller et annet språk',
    preferredConsultationLanguageLabel: 'Språk De ønsker til rådgivningen',
    originalTextLabel: 'Kort fremstilling av saken (på Deres språk)',
    originalTextPlaceholder:
      'Oppgi hva som har skjedd, hvilken hjelp De trenger, og fristen hvis det finnes en. Oppgi ikke passnummer, identitetsnummer eller kontoopplysninger.',
    nameLabel: 'Navn',
    emailLabel: 'E-post',
    consentLabel:
      'Jeg har lest personvernsiden og samtykker i at denne forespørselen sendes.',
    privacyLinkLabel: 'Personvern',
    requiredMessage: 'Dette feltet er obligatorisk.',
    invalidEmailMessage: 'Oppgi en gyldig e-postadresse.',
    tooLongMessage: 'Teksten er for lang. Kort den ned og send på nytt.',
    sourceLanguageNotice:
      'Denne artikkelen er publisert bare på {language}; lenken åpner originalsiden.',
    unavailableTranslationNotice:
      'Dette punktet er ennå ikke tilgjengelig på sidens språk. En lenke med originalspråket åpner originalteksten.',
    unavailableLanguageNotice: 'Denne siden tilbys ikke på {language}.',
    languageOptions: {
      en: 'Engelsk (English)',
      'zh-hant': 'Kinesisk (中文)',
      ja: 'Japansk (日本語)',
      ko: 'Koreansk (한국어)',
      'needs-method-confirmation':
        'Ingen av de fire språkene er brukbare — kommunikasjonsveien må bekreftes',
    },
  },
  fi: {
    guidanceNotice:
      'Tämä sivu on kirjoitettu suomeksi yleiseksi taustatiedoksi, ei oikeudelliseksi neuvonnaksi asiassanne.',
    consultationNotice:
      'Neuvonta tapahtuu vain neljällä kielellä: englanniksi, kiinaksi (中文), japaniksi ja koreaksi.',
    methodConfirmationNotice:
      'Jos ette voi käyttää mitään neljästä kielestä, valitkaa ”Viestintätapa on vahvistettava”. Otamme yhteyttä selvittääksemme, onko käyttökelpoista viestintätapaa olemassa; neuvontaa muulla kielellä ei luvata eikä vastausaikaa luvata.',
    preparationNotice:
      'Voitte kirjoittaa yhteenvedon omalla kielellänne. Alkuperäinen teksti säilytetään sellaisena kuin olette sen kirjoittaneet, eikä sitä käännetä automaattisesti.',
    heading: 'Lähettäkää yhteydenottopyyntö',
    intro:
      'Kuvatkaa asianne lyhyesti. Asianajaja käy sisällön läpi, ennen kuin seuraavasta vaiheesta sovitaan.',
    submitLabel: 'Lähettäkää pyyntö',
    submittingLabel: 'Lähetetään…',
    successMessage:
      'Olemme vastaanottaneet pyyntönne; se odottaa tarkastusta. Tämä ei merkitse, että neuvonta olisi tapahtunut tai että tapaaminen olisi vahvistettu.',
    savedNotificationPendingMessage:
      'Pyyntönne on tallennettu, mutta ilmoitus toimistolle ei ole vielä vahvistettu. Kirjoittamanne ei katoa. Jos ette saa vastausta, voitte myös kirjoittaa yhteyssivun sähköpostiosoitteeseen.',
    receiptIdLabel: 'Vastaanotonumero',
    failureMessage:
      'Pyyntöänne ei voitu lähettää. Yrittäkää uudelleen tai kirjoittakaa yhteyssivun sähköpostiosoitteeseen.',
    originalLanguageLabel: 'Kieli, jolla kirjoitatte',
    originalLanguagePlaceholder:
      'Esimerkiksi suomi, englanti, kiina tai muu kieli',
    preferredConsultationLanguageLabel: 'Kieli, jota toivotte neuvontaan',
    originalTextLabel: 'Lyhyt kuvaus asiasta (omalla kielellänne)',
    originalTextPlaceholder:
      'Kertokaa, mitä on tapahtunut, millaista apua tarvitsette, ja määräaika, jos sellainen on. Älkää kirjoittako passinumeroa, henkilötunnusta älkääkä tilitietoja.',
    nameLabel: 'Nimi',
    emailLabel: 'Sähköposti',
    consentLabel:
      'Olen lukenut tietosuojasivun ja suostun tämän pyynnön lähettämiseen.',
    privacyLinkLabel: 'Tietosuoja',
    requiredMessage: 'Tämä kenttä on pakollinen.',
    invalidEmailMessage: 'Antakaa kelvollinen sähköpostiosoite.',
    tooLongMessage: 'Teksti on liian pitkä. Lyhentäkää se ja lähettäkää uudelleen.',
    sourceLanguageNotice:
      'Tämä artikkeli on julkaistu vain kielellä {language}; linkki avaa alkuperäisen sivun.',
    unavailableTranslationNotice:
      'Tämä kohta ei ole vielä saatavilla tämän sivun kielellä. Linkki alkuperäiskielellä avaa alkuperäisen tekstin.',
    unavailableLanguageNotice: 'Tätä sivua ei tarjota kielellä {language}.',
    languageOptions: {
      en: 'Englanti (English)',
      'zh-hant': 'Kiina (中文)',
      ja: 'Japani (日本語)',
      ko: 'Korea (한국어)',
      'needs-method-confirmation':
        'En osaa mitään neljästä kielestä — viestintätapa on vahvistettava',
    },
  },
  cs: {
    guidanceNotice:
      'Tato stránka je psána česky jako obecná orientace, nikoli jako právní rada ve Vaší věci.',
    consultationNotice:
      'Porada probíhá pouze ve čtyřech jazycích: anglicky, čínsky (中文), japonsky a korejsky.',
    methodConfirmationNotice:
      'Pokud neovládáte žádný ze čtyř jazyků konzultace, zvolte „Způsob komunikace je třeba potvrdit“. Odpovíme, abychom posoudili schůdný způsob komunikace, existuje-li takový; služba v jiném jazyce zaručena není a lhůta k odpovědi se neslibuje.',
    preparationNotice:
      'Shrnutí můžete napsat ve svém jazyce. Původní text se uchová tak, jak jste jej napsali, a automaticky se nepřekládá.',
    heading: 'Odeslat žádost o posouzení',
    intro:
      'Popište svou věc stručně. Advokátka nebo advokát posoudí obsah, než se přistoupí k dalšímu kroku.',
    submitLabel: 'Odeslat žádost',
    submittingLabel: 'Odesílá se…',
    successMessage:
      'Obdrželi jsme Vaši žádost; čeká na posouzení. Neznamená to, že porada proběhla nebo že byla potvrzena schůzka.',
    savedNotificationPendingMessage:
      'Vaše žádost byla uložena, ale oznámení kanceláři zatím není potvrzeno. Co jste napsali, se neztratí. Neobdržíte-li odpověď, můžete napsat i na e-mailovou adresu z kontaktní stránky.',
    receiptIdLabel: 'Číslo podání',
    failureMessage:
      'Vaši žádost se nepodařilo odeslat. Zkuste to znovu nebo napište na e-mailovou adresu z kontaktní stránky.',
    originalLanguageLabel: 'Jazyk, v němž píšete',
    originalLanguagePlaceholder:
      'Například čeština, angličtina, čínština nebo jiný jazyk',
    preferredConsultationLanguageLabel: 'Jazyk, který si přejete pro konzultaci',
    originalTextLabel: 'Krátký popis věci (ve Vašem jazyce)',
    originalTextPlaceholder:
      'Napište, co se stalo, jakou pomoc potřebujete a lhůtu, existuje-li. Nepište číslo pasu, číslo dokladu ani údaje o účtu.',
    nameLabel: 'Jméno',
    emailLabel: 'E-mail',
    consentLabel:
      'Přečetl(a) jsem stránku o soukromí a souhlasím s odesláním této žádosti.',
    privacyLinkLabel: 'Soukromí',
    requiredMessage: 'Toto pole je povinné.',
    invalidEmailMessage: 'Zadejte platnou e-mailovou adresu.',
    tooLongMessage: 'Text je příliš dlouhý. Zkraťte jej a odešlete znovu.',
    sourceLanguageNotice:
      'Tento článek je zveřejněn pouze v jazyce {language}; odkaz otevře původní stránku.',
    unavailableTranslationNotice:
      'Tato část zatím není k dispozici v jazyce této stránky. Odkaz v původním jazyce otevře původní text.',
    unavailableLanguageNotice: 'Tato stránka se v jazyce {language} nenabízí.',
    languageOptions: {
      en: 'Angličtina (English)',
      'zh-hant': 'Čínština (中文)',
      ja: 'Japonština (日本語)',
      ko: 'Korejština (한국어)',
      'needs-method-confirmation':
        'Žádný ze čtyř jazyků není použitelný — způsob komunikace je třeba potvrdit',
    },
  },
  hu: {
    guidanceNotice:
      'Ez az oldal magyarul készült általános tájékozódás céljából, nem az Ön ügyére szabott jogi tanácsadásként.',
    consultationNotice:
      'A tanácsadás kizárólag négy nyelven zajlik: angolul, kínaiul (中文), japánul és koreaiul.',
    methodConfirmationNotice:
      'Ha a négy nyelv egyikét sem tudja használni, válassza azt, hogy „A kommunikáció módját meg kell erősíteni”. Válaszolunk, hogy megvizsgáljuk a kommunikáció járható módját, ha van ilyen; más nyelvű szolgáltatás nem garantált, és válaszadási határidőt nem ígérünk.',
    preparationNotice:
      'Az összefoglalót a saját nyelvén írhatja. Az eredeti szöveget úgy őrizzük meg, ahogyan megírta, és nem fordítjuk le automatikusan.',
    heading: 'Megkeresés elküldése',
    intro:
      'Írja le röviden az ügyét. Egy ügyvéd megvizsgálja a tartalmat, mielőtt a következő lépésre kerülne sor.',
    submitLabel: 'Megkeresés elküldése',
    submittingLabel: 'Küldés folyamatban…',
    successMessage:
      'Megkaptuk a megkeresését; vizsgálatra vár. Ez nem jelenti azt, hogy a tanácsadás megtörtént vagy hogy időpontot erősítettünk meg.',
    savedNotificationPendingMessage:
      'A megkeresését elmentettük, de az irodának szóló értesítés még nincs megerősítve. Amit írt, nem vész el. Ha nem kap választ, a kapcsolatfelvételi oldal e-mail-címére is írhat.',
    receiptIdLabel: 'Iktatószám',
    failureMessage:
      'A megkeresését nem sikerült elküldeni. Próbálja újra, vagy írjon a kapcsolatfelvételi oldal e-mail-címére.',
    originalLanguageLabel: 'Az a nyelv, amelyen ír',
    originalLanguagePlaceholder:
      'Például magyar, angol, kínai vagy más nyelv',
    preferredConsultationLanguageLabel: 'A tanácsadáshoz kívánt nyelv',
    originalTextLabel: 'Az ügy rövid leírása (a saját nyelvén)',
    originalTextPlaceholder:
      'Írja le, mi történt, milyen segítségre van szüksége, és a határidőt, ha van. Ne írjon útlevélszámot, okmányszámot vagy számlaadatokat.',
    nameLabel: 'Név',
    emailLabel: 'E-mail',
    consentLabel:
      'Elolvastam az adatvédelmi oldalt, és hozzájárulok a megkeresés elküldéséhez.',
    privacyLinkLabel: 'Adatvédelem',
    requiredMessage: 'Ez a mező kötelező.',
    invalidEmailMessage: 'Adjon meg érvényes e-mail-címet.',
    tooLongMessage: 'A szöveg túl hosszú. Rövidítse le, és küldje el újra.',
    sourceLanguageNotice:
      'Ez a cikk csak {language} nyelven jelent meg; a hivatkozás az eredeti oldalt nyitja meg.',
    unavailableTranslationNotice:
      'Ez a rész még nem érhető el ennek az oldalnak a nyelvén. Az eredeti nyelvű hivatkozás az eredeti szöveget nyitja meg.',
    unavailableLanguageNotice: 'Ezt az oldalt nem kínáljuk {language} nyelven.',
    languageOptions: {
      en: 'Angol (English)',
      'zh-hant': 'Kínai (中文)',
      ja: 'Japán (日本語)',
      ko: 'Koreai (한국어)',
      'needs-method-confirmation':
        'A négy nyelv egyike sem használható — a kommunikáció módját meg kell erősíteni',
    },
  },
  ro: {
    guidanceNotice:
      'Această pagină este scrisă în limba română ca orientare generală, nu ca o consultanță juridică în cazul dumneavoastră.',
    consultationNotice:
      'Consultanța se desfășoară în patru limbi: engleză, chineză (中文), japoneză și coreeană.',
    methodConfirmationNotice:
      'Dacă nu puteți folosi niciuna dintre cele patru limbi, alegeți „Calea de comunicare trebuie confirmată”. Vă putem scrie pentru a vedea dacă există o cale de comunicare pe care o putem folosi; o prestație în altă limbă nu este garantată, iar un termen de răspuns nu se promite.',
    preparationNotice:
      'Puteți scrie rezumatul în limba dumneavoastră. Textul original se păstrează așa cum l-ați scris și nu este tradus automat.',
    heading: 'Trimiteți o solicitare',
    intro:
      'Descrieți pe scurt cazul dumneavoastră. Un avocat examinează conținutul înainte de a se trece la pasul următor.',
    submitLabel: 'Trimiteți solicitarea',
    submittingLabel: 'Se trimite…',
    successMessage:
      'Am primit solicitarea dumneavoastră; așteaptă examinarea. Aceasta nu înseamnă că a avut loc consultanța sau că a fost confirmată o programare.',
    savedNotificationPendingMessage:
      'Solicitarea dumneavoastră a fost salvată, dar notificarea către cabinet nu este încă confirmată. Ce ați scris nu se pierde. Dacă nu primiți răspuns, puteți scrie și la adresa de e-mail de pe pagina de contact.',
    receiptIdLabel: 'Număr de înregistrare',
    failureMessage:
      'Solicitarea dumneavoastră nu a putut fi trimisă. Încercați din nou sau scrieți la adresa de e-mail de pe pagina de contact.',
    originalLanguageLabel: 'Limba în care scrieți',
    originalLanguagePlaceholder:
      'De exemplu română, engleză, chineză sau altă limbă',
    preferredConsultationLanguageLabel: 'Limba dorită pentru consultanță',
    originalTextLabel: 'Scurtă descriere a cazului (în limba dumneavoastră)',
    originalTextPlaceholder:
      'Scrieți ce s-a întâmplat, de ce ajutor aveți nevoie și termenul, dacă există. Nu scrieți numărul de pașaport, numărul actului de identitate sau datele unui cont.',
    nameLabel: 'Nume',
    emailLabel: 'E-mail',
    consentLabel:
      'Am citit pagina privind datele personale și sunt de acord cu trimiterea acestei solicitări.',
    privacyLinkLabel: 'Date personale',
    requiredMessage: 'Acest câmp este obligatoriu.',
    invalidEmailMessage: 'Introduceți o adresă de e-mail validă.',
    tooLongMessage: 'Textul este prea lung. Scurtați-l și trimiteți din nou.',
    sourceLanguageNotice:
      'Acest articol este publicat numai în limba {language}; legătura deschide pagina originală.',
    unavailableTranslationNotice:
      'Această parte nu este încă disponibilă în limba acestei pagini. Legătura în limba originală deschide textul original.',
    unavailableLanguageNotice: 'Această pagină nu este oferită în limba {language}.',
    languageOptions: {
      en: 'Engleză (English)',
      'zh-hant': 'Chineză (中文)',
      ja: 'Japoneză (日本語)',
      ko: 'Coreeană (한국어)',
      'needs-method-confirmation':
        'Niciuna dintre cele patru limbi nu este utilizabilă — calea de comunicare trebuie confirmată',
    },
  },
  uk: {
    guidanceNotice:
      'Цю сторінку написано українською як загальний орієнтир, а не як юридичну консультацію у Вашій справі.',
    consultationNotice:
      'Консультація відбувається чотирма мовами: англійською, китайською (中文), японською та корейською.',
    methodConfirmationNotice:
      'Якщо Ви не можете скористатися жодною з чотирьох мов, оберіть «Спосіб спілкування потребує підтвердження». Ми відповідаємо, щоб розглянути придатний спосіб спілкування, якщо такий є; послуги іншою мовою не гарантовано, а строку відповіді не обіцяно.',
    preparationNotice:
      'Виклад справи можете написати своєю мовою. Первинний текст зберігається таким, яким Ви його написали, і не перекладається автоматично.',
    heading: 'Надіслати запит на розгляд',
    intro:
      'Стисло опишіть свою справу. Адвокат розгляне зміст, перш ніж переходити до наступного кроку.',
    submitLabel: 'Надіслати запит',
    submittingLabel: 'Надсилання…',
    successMessage:
      'Ми отримали Ваш запит; він очікує розгляду. Це не означає, що консультація відбулася або що зустріч підтверджено.',
    savedNotificationPendingMessage:
      'Ваш запит збережено, але сповіщення фірмі ще не підтверджено. Написане не втрачається. Якщо Ви не отримаєте відповіді, можете написати також на адресу електронної пошти зі сторінки контактів.',
    receiptIdLabel: 'Реєстраційний номер',
    failureMessage:
      'Ваш запит не вдалося надіслати. Спробуйте ще раз або напишіть на адресу електронної пошти зі сторінки контактів.',
    originalLanguageLabel: 'Мова, якою Ви пишете',
    originalLanguagePlaceholder:
      'Наприклад українська, англійська, китайська чи інша мова',
    preferredConsultationLanguageLabel: 'Бажана мова консультації',
    originalTextLabel: 'Стислий опис справи (Вашою мовою)',
    originalTextPlaceholder:
      'Напишіть, що сталося, якої допомоги потребуєте, і строк, якщо він є. Не пишіть номера паспорта, номера документа чи даних рахунку.',
    nameLabel: 'Ім’я',
    emailLabel: 'Електронна пошта',
    consentLabel:
      'Я прочитав(ла) сторінку про захист даних і погоджуюся на надсилання цього запиту.',
    privacyLinkLabel: 'Захист даних',
    requiredMessage: 'Це поле обов’язкове.',
    invalidEmailMessage: 'Введіть дійсну адресу електронної пошти.',
    tooLongMessage: 'Текст задовгий. Скоротіть його та надішліть ще раз.',
    sourceLanguageNotice:
      'Цю статтю оприлюднено лише мовою {language}; посилання відкриє первинну сторінку.',
    unavailableTranslationNotice:
      'Ця частина ще не доступна мовою цієї сторінки. Посилання мовою оригіналу відкриє первинний текст.',
    unavailableLanguageNotice: 'Ця сторінка не пропонується мовою {language}.',
    languageOptions: {
      en: 'Англійська (English)',
      'zh-hant': 'Китайська (中文)',
      ja: 'Японська (日本語)',
      ko: 'Корейська (한국어)',
      'needs-method-confirmation':
        'Жодна з чотирьох мов не підходить — спосіб спілкування потребує підтвердження',
    },
  },
  el: {
    guidanceNotice:
      'Η σελίδα αυτή είναι γραμμένη στα ελληνικά ως γενικός προσανατολισμός, όχι ως νομική συμβουλή στην υπόθεσή σας.',
    consultationNotice:
      'Η συμβουλευτική διεξάγεται σε τέσσερις γλώσσες: αγγλικά, κινεζικά (中文), ιαπωνικά και κορεατικά.',
    methodConfirmationNotice:
      'Αν δεν μπορείτε να χρησιμοποιήσετε καμία από τις τέσσερις γλώσσες, επιλέξτε «Ο τρόπος επικοινωνίας χρειάζεται επιβεβαίωση». Απαντούμε για να εξετάσουμε έναν εφικτό τρόπο επικοινωνίας, αν υπάρχει· υπηρεσία σε άλλη γλώσσα δεν είναι εγγυημένη, ούτε δίνεται υπόσχεση για προθεσμία απάντησης.',
    preparationNotice:
      'Μπορείτε να γράψετε την περίληψη στη γλώσσα σας. Το πρωτότυπο κείμενο διατηρείται όπως το γράψατε και δεν μεταφράζεται αυτόματα.',
    heading: 'Αποστολή αιτήματος για εξέταση',
    intro:
      'Περιγράψτε σύντομα την υπόθεσή σας. Δικηγόρος εξετάζει το περιεχόμενο πριν προχωρήσει το επόμενο βήμα.',
    submitLabel: 'Αποστολή αιτήματος',
    submittingLabel: 'Αποστολή…',
    successMessage:
      'Λάβαμε το αίτημά σας· αναμένει εξέταση. Αυτό δεν σημαίνει ότι έγινε η συμβουλευτική ή ότι επιβεβαιώθηκε ραντεβού.',
    savedNotificationPendingMessage:
      'Το αίτημά σας αποθηκεύτηκε, αλλά η ειδοποίηση προς το γραφείο δεν έχει ακόμη επιβεβαιωθεί. Ό,τι γράψατε δεν χάνεται. Αν δεν λάβετε απάντηση, μπορείτε να γράψετε και στη διεύθυνση ηλεκτρονικού ταχυδρομείου της σελίδας επικοινωνίας.',
    receiptIdLabel: 'Αριθμός πρωτοκόλλου',
    failureMessage:
      'Το αίτημά σας δεν στάλθηκε. Δοκιμάστε ξανά ή γράψτε στη διεύθυνση ηλεκτρονικού ταχυδρομείου της σελίδας επικοινωνίας.',
    originalLanguageLabel: 'Η γλώσσα στην οποία γράφετε',
    originalLanguagePlaceholder:
      'Για παράδειγμα ελληνικά, αγγλικά, κινεζικά ή άλλη γλώσσα',
    preferredConsultationLanguageLabel: 'Η γλώσσα που επιθυμείτε για τη συμβουλευτική',
    originalTextLabel: 'Σύντομη περιγραφή της υπόθεσης (στη γλώσσα σας)',
    originalTextPlaceholder:
      'Γράψτε τι συνέβη, ποια βοήθεια χρειάζεστε και την προθεσμία, αν υπάρχει. Μη γράφετε αριθμό διαβατηρίου, αριθμό ταυτότητας ή στοιχεία λογαριασμού.',
    nameLabel: 'Όνομα',
    emailLabel: 'Ηλεκτρονικό ταχυδρομείο',
    consentLabel:
      'Διάβασα τη σελίδα για το απόρρητο και συναινώ στην αποστολή αυτού του αιτήματος.',
    privacyLinkLabel: 'Απόρρητο',
    requiredMessage: 'Το πεδίο αυτό είναι υποχρεωτικό.',
    invalidEmailMessage: 'Δώστε έγκυρη διεύθυνση ηλεκτρονικού ταχυδρομείου.',
    tooLongMessage: 'Το κείμενο είναι πολύ μεγάλο. Συντομεύστε το και στείλτε ξανά.',
    sourceLanguageNotice:
      'Το άρθρο αυτό δημοσιεύτηκε μόνο στη γλώσσα {language}· ο σύνδεσμος ανοίγει την αρχική σελίδα.',
    unavailableTranslationNotice:
      'Το μέρος αυτό δεν είναι ακόμη διαθέσιμο στη γλώσσα αυτής της σελίδας. Ο σύνδεσμος στη γλώσσα του πρωτοτύπου ανοίγει το αρχικό κείμενο.',
    unavailableLanguageNotice: 'Η σελίδα αυτή δεν προσφέρεται στη γλώσσα {language}.',
    languageOptions: {
      en: 'Αγγλικά (English)',
      'zh-hant': 'Κινεζικά (中文)',
      ja: 'Ιαπωνικά (日本語)',
      ko: 'Κορεατικά (한국어)',
      'needs-method-confirmation':
        'Δεν μιλάω καμία από τις τέσσερις γλώσσες — ο τρόπος επικοινωνίας χρειάζεται επιβεβαίωση',
    },
  },
  he: {
    guidanceNotice:
      'עמוד זה כתוב בעברית כהתמצאות כללית, ולא כייעוץ משפטי בעניין שלכם.',
    consultationNotice:
      'הייעוץ מתקיים בארבע שפות: אנגלית, סינית (中文), יפנית וקוריאנית.',
    methodConfirmationNotice:
      'אם אינכם יכולים להשתמש באף אחת מארבע השפות, בחרו "יש לאשר את דרך התקשורת". אנו משיבים כדי לבחון דרך תקשורת מעשית, אם קיימת; שירות בשפה אחרת אינו מובטח ומועד למענה אינו מובטח.',
    preparationNotice:
      'אפשר לכתוב את התקציר בשפתכם. הטקסט המקורי נשמר כפי שכתבתם ואינו מתורגם אוטומטית.',
    heading: 'שליחת פנייה לבדיקה',
    intro:
      'תארו את עניינכם בקצרה. עורכת דין או עורך דין בודקים את התוכן לפני המעבר לשלב הבא.',
    submitLabel: 'שליחת פנייה',
    submittingLabel: 'שולח…',
    successMessage:
      'קיבלנו את פנייתכם; היא ממתינה לבדיקה. אין פירוש הדבר שהייעוץ התקיים או שאושרה פגישה.',
    savedNotificationPendingMessage:
      'פנייתכם נשמרה, אך ההודעה למשרד טרם אושרה. מה שכתבתם אינו אובד. אם לא תקבלו מענה, אפשר לכתוב גם לכתובת הדואר האלקטרוני שבעמוד יצירת הקשר.',
    receiptIdLabel: 'מספר קליטה',
    failureMessage:
      'לא ניתן היה לשלוח את פנייתכם. נסו שוב או כתבו לכתובת הדואר האלקטרוני שבעמוד יצירת הקשר.',
    originalLanguageLabel: 'השפה שבה אתם כותבים',
    originalLanguagePlaceholder:
      'למשל עברית, אנגלית, סינית או שפה אחרת',
    preferredConsultationLanguageLabel: 'השפה הרצויה לכם לייעוץ',
    originalTextLabel: 'תיאור קצר של העניין (בשפתכם)',
    originalTextPlaceholder:
      'כתבו מה קרה, לאיזו עזרה אתם זקוקים ואת המועד, אם קיים. אל תכתבו מספר דרכון, מספר תעודה או פרטי חשבון.',
    nameLabel: 'שם',
    emailLabel: 'דואר אלקטרוני',
    consentLabel:
      'קראתי את עמוד הפרטיות והסכמתי לשליחת פנייה זו.',
    privacyLinkLabel: 'פרטיות',
    requiredMessage: 'שדה זה הוא חובה.',
    invalidEmailMessage: 'הזינו כתובת דואר אלקטרוני תקינה.',
    tooLongMessage: 'הטקסט ארוך מדי. קצרו אותו ושלחו שוב.',
    sourceLanguageNotice:
      'מאמר זה פורסם רק בשפה {language}; הקישור פותח את העמוד המקורי.',
    unavailableTranslationNotice:
      'חלק זה אינו זמין עדיין בשפת עמוד זה. הקישור בשפת המקור פותח את הטקסט המקורי.',
    unavailableLanguageNotice: 'עמוד זה אינו מוצע בשפה {language}.',
    languageOptions: {
      en: 'אנגלית (English)',
      'zh-hant': 'סינית (中文)',
      ja: 'יפנית (日本語)',
      ko: 'קוריאנית (한국어)',
      'needs-method-confirmation':
        'אף אחת מארבע השפות אינה שמישה — יש לאשר את דרך התקשורת',
    },
  },
};
