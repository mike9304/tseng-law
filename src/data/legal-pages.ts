import type { SiteLocale } from '@/lib/locales';

export type LegalPageKey = 'privacy' | 'disclaimer' | 'accessibility';

type LegalPageSection = {
  title: string;
  paragraphs: string[];
  items?: string[];
};

export type LegalPageContent = {
  label: string;
  title: string;
  description: string;
  effectiveDateLabel: string;
  effectiveDate: string;
  sections: LegalPageSection[];
};

export const legalPageContent: Record<SiteLocale, Record<LegalPageKey, LegalPageContent>> = {
  ko: {
    privacy: {
      label: 'PRIVACY',
      title: '개인정보 처리방침',
      description: '문의, 상담 예약, 웹사이트 이용 과정에서 수집되는 정보와 처리 기준을 안내합니다.',
      effectiveDateLabel: '시행일',
      effectiveDate: '2026-07-30',
      sections: [
        {
          title: '수집하는 정보',
          paragraphs: [
            '상담 폼에서는 이름 또는 회사명, 회신 이메일, 문의 분야, 문의 개요, 개인정보 처리 동의를 받고 전화번호는 선택 사항입니다. AI 상담을 이용하면 대화 내용, 세션 식별자, 분류 결과와 피드백도 처리될 수 있습니다.',
            '보안과 서비스 운영을 위해 IP 주소, 사용자 에이전트, 요청 시각과 같은 기본 기술 기록이 생성될 수 있습니다.',
          ],
        },
        {
          title: '이용 목적',
          paragraphs: [
            '수집한 정보는 상담 요청 확인, 회신, 예약 조율, 사건 적합성 검토, 웹사이트 품질 개선, 보안 유지 목적에 한해 사용합니다.',
          ],
          items: [
            '문의 및 상담 요청 회신',
            '대면·화상 상담 일정 조율',
            '서비스 운영, 보안, 품질 개선',
          ],
        },
        {
          title: '보관기간과 파기',
          paragraphs: [
            '상담 이벤트 및 피드백 로그는 90일 보관 기준에 따라 삭제합니다. 상담 이메일과 데이터베이스 사본은 문의 회신과 사건 처리에 필요한 기간 동안만 보관합니다.',
            '보관 목적이 달성되면 지체 없이 파기하며, 법령상 보존 의무가 있는 정보는 해당 기간 동안 보관합니다. 백업본과 종이 자료도 같은 기준에 따라 복구가 어려운 방법으로 파기합니다.',
          ],
        },
        {
          title: '처리업체와 국외 처리',
          paragraphs: [
            '웹사이트 호스팅과 비공개 객체 저장소는 Vercel을 이용하며, AI 상담 기능이 설정된 경우 답변 생성에 OpenAI를 이용합니다. 이메일은 사무소가 이용하는 메일 서비스 경로로 전송됩니다.',
            '일부 서비스 제공자의 서버는 대만 외 지역에 소재할 수 있으며, 이 경우 개인정보가 해당 지역에서 저장·처리될 수 있습니다. 사무소는 처리업체와 개인정보 보호에 필요한 계약상 조치를 두고, 처리 목적에 필요한 범위에서만 정보를 제공합니다.',
          ],
        },
        {
          title: '쿠키와 브라우저 저장소',
          paragraphs: [
            '팝업 표시 상태와 AI 답변 피드백 상태를 기억하기 위해 쿠키 또는 브라우저 localStorage를 사용합니다. 분석 도구를 사용하는 경우 그 내용을 이 방침에 반영합니다.',
          ],
        },
        {
          title: '정보주체의 권리와 문의',
          paragraphs: [
            '본인 정보의 열람, 정정, 삭제 또는 동의 철회를 요청하려면 공식 상담 이메일 wei@hoveringlaw.com.tw로 연락해 주세요. 법령상 보관 의무나 진행 중인 법률 업무 때문에 요청 범위가 제한되는 경우에는 그 사유를 안내합니다.',
            '개인정보 관련 요청과 문의는 wei@hoveringlaw.com.tw로 접수하며, 접수한 순서에 따라 처리 결과를 회신합니다.',
          ],
        },
        {
          title: '민감한 사건자료, 미성년자와 마케팅',
          paragraphs: [
            '초기 문의에는 사건 또는 업무의 개요와 연락처만 보내주시기 바랍니다. 주민등록번호, 여권번호, 계좌번호, 신분증 원본 또는 증거자료 전체는 이메일이나 일반 문의 폼으로 보내지 말고, 담당 변호사의 별도 안내 후 안전한 방식으로 제출해 주세요.',
            '미성년자는 보호자와 함께 문의하고 민감정보를 보내지 않는 것을 권장합니다. 상담 정보는 별도의 동의 없이 마케팅 수신 목적으로 사용하지 않으며, 동의하신 경우에도 wei@hoveringlaw.com.tw로 언제든지 수신을 철회하실 수 있습니다.',
          ],
        },
        {
          title: '개인정보 유출 대응',
          paragraphs: [
            '개인정보 유출이 의심되면 즉시 접근을 차단하고 영향 범위를 확인하며, 관련 기록을 보존한 뒤 법령에 따라 필요한 통지를 진행합니다.',
          ],
        },
      ],
    },
    disclaimer: {
      label: 'DISCLAIMER',
      title: '면책 고지',
      description: '웹사이트에 게시된 일반 정보의 성격과 상담·수임 관계에 관한 기준을 안내합니다.',
      effectiveDateLabel: '시행일',
      effectiveDate: '2026-03-10',
      sections: [
        {
          title: '일반 정보 제공',
          paragraphs: [
            '이 웹사이트의 글, 영상, 설명은 일반적인 정보 제공을 위한 것이며 개별 사안에 대한 법률 자문을 대체하지 않습니다.',
            '사실관계, 적용 법률, 시점에 따라 결론이 달라질 수 있으므로 실제 사건은 반드시 별도 상담을 통해 검토해야 합니다.',
          ],
        },
        {
          title: '상담 및 수임 관계',
          paragraphs: [
            '웹사이트 방문, 이메일 발송, 메신저 문의만으로 변호사-의뢰인 관계가 성립하지 않습니다.',
            '정식 자문 또는 수임은 별도의 검토와 동의 절차가 완료된 경우에만 성립합니다.',
          ],
        },
        {
          title: '외부 링크와 결과 보장',
          paragraphs: [
            '외부 사이트 링크는 편의를 위해 제공되며, 링크된 콘텐츠의 정확성이나 최신성은 본 사이트가 보증하지 않습니다.',
            '과거 사례, 승소 실적, 후기 등은 향후 동일한 결과를 보장하지 않습니다.',
          ],
        },
      ],
    },
    accessibility: {
      label: 'ACCESSIBILITY',
      title: '웹 접근성 안내',
      description: '모든 방문자가 주요 정보를 이해하고 이용할 수 있도록 접근성 개선 기준을 안내합니다.',
      effectiveDateLabel: '시행일',
      effectiveDate: '2026-03-10',
      sections: [
        {
          title: '접근성 원칙',
          paragraphs: [
            '법무법인 호정은 키보드 탐색, 명확한 제목 구조, 충분한 대비, 읽기 쉬운 문장 구성을 중심으로 접근성을 개선하고 있습니다.',
          ],
          items: [
            '주요 페이지 제목과 섹션 구조 명확화',
            '모바일 및 데스크톱에서 읽기 쉬운 레이아웃 유지',
            '이미지, 버튼, 링크에 대한 의미 전달 강화',
          ],
        },
        {
          title: '개선 요청',
          paragraphs: [
            '이용 중 접근성 문제를 발견하시면 이메일 또는 연락 페이지를 통해 알려주시면 우선순위를 두고 검토하겠습니다.',
          ],
        },
      ],
    },
  },
  'zh-hant': {
    privacy: {
      label: 'PRIVACY',
      title: '隱私權政策',
      description: '說明諮詢、預約與網站使用過程中可能蒐集的資訊及其使用方式。',
      effectiveDateLabel: '生效日期',
      effectiveDate: '2026-07-30',
      sections: [
        {
          title: '蒐集的資訊',
          paragraphs: [
            '諮詢表單會蒐集姓名或公司名稱、回覆用電子郵件、諮詢類型、事項概要及個人資料處理同意；電話為選填。使用 AI 諮詢時，亦可能處理對話內容、工作階段識別碼、分類結果與回饋。',
            '為維護安全與服務營運，系統可能產生 IP 位址、使用者代理字串及請求時間等基本技術紀錄。',
          ],
        },
        {
          title: '使用目的',
          paragraphs: [
            '蒐集之資訊僅用於回覆諮詢、安排會議、評估案件需求、維持網站安全與改善服務品質。',
          ],
          items: [
            '回覆詢問與預約需求',
            '安排面談或視訊諮詢',
            '網站安全、營運與體驗優化',
          ],
        },
        {
          title: '保存期間與刪除',
          paragraphs: [
            '諮詢事件與回饋紀錄以 90 日為保存基準予以刪除。諮詢電子郵件與資料庫副本，僅於回覆諮詢及處理案件所需的期間內保存。',
            '保存目的達成後即不遲延銷毀，並以難以復原的方式為之；依法令負有保存義務者，於該期間內保存。備份與紙本資料亦依相同標準銷毀。',
          ],
        },
        {
          title: '受託服務與境外處理',
          paragraphs: [
            '網站託管與私有物件儲存使用 Vercel；於已完成設定時，AI 諮詢回覆的產生使用 OpenAI。電子郵件則透過本所所使用的郵件服務路徑寄送。',
            '部分服務提供者的伺服器可能位於臺灣以外地區，個人資料於該情形下可能在當地儲存及處理。本所與受託者訂有個人資料保護所需的契約措施，並僅在處理目的必要範圍內提供資料。',
          ],
        },
        {
          title: 'Cookie 與瀏覽器儲存',
          paragraphs: [
            '網站使用 Cookie 或瀏覽器 localStorage，以記住彈出視窗顯示狀態及 AI 回覆的回饋狀態。如使用分析工具，將於本政策中一併說明。',
          ],
        },
        {
          title: '當事人權利與聯絡方式',
          paragraphs: [
            '如欲請求查閱、更正、刪除個人資料或撤回同意，請寄信至官方諮詢信箱 wei@hoveringlaw.com.tw。若因法律保存義務或進行中的法律業務而無法完整處理，將說明限制理由。',
            '與個人資料有關的請求與詢問，請寄至 wei@hoveringlaw.com.tw 提出，本所將依收件順序回覆處理結果。',
          ],
        },
        {
          title: '敏感案件資料、未成年人與行銷',
          paragraphs: [
            '初次聯絡時，請僅提供案件或業務概要及聯絡方式。請勿透過電子郵件或一般諮詢表單傳送身分證字號、護照號碼、銀行帳戶資料、證件正本或完整證據資料；請待承辦律師指示後，再以安全方式提供。',
            '建議未成年人由監護人陪同聯絡，且不要傳送敏感資訊。未另行取得同意前，不會將諮詢資料用於行銷收件；縱已同意，亦可隨時寄信至 wei@hoveringlaw.com.tw 撤回。',
          ],
        },
        {
          title: '個人資料事件處理',
          paragraphs: [
            '若疑似發生個人資料外洩，本所將立即阻斷存取、確認影響範圍、保存相關紀錄，並依法進行必要之通知。',
          ],
        },
      ],
    },
    disclaimer: {
      label: 'DISCLAIMER',
      title: '免責聲明',
      description: '說明本站一般資訊內容之性質，以及諮詢與委任關係成立的條件。',
      effectiveDateLabel: '生效日期',
      effectiveDate: '2026-03-10',
      sections: [
        {
          title: '一般資訊性質',
          paragraphs: [
            '本站文章、影片與說明內容僅供一般資訊參考，不構成個別案件的法律意見或正式法律服務。',
            '案件結論會因事實、適用法規及時間點不同而改變，具體案件仍應經個別諮詢後判斷。',
          ],
        },
        {
          title: '諮詢與委任關係',
          paragraphs: [
            '僅因瀏覽網站、寄送電子郵件或傳送即時訊息，並不會當然成立律師與當事人之委任關係。',
            '正式法律服務須經案件檢視與雙方確認程序後，始得成立。',
          ],
        },
        {
          title: '外部連結與成果案例',
          paragraphs: [
            '本站提供之外部連結僅為便利性用途，對第三方內容之正確性或即時性不負保證責任。',
            '過往案例、客戶評價或成果資訊不代表未來案件必然取得相同結果。',
          ],
        },
      ],
    },
    accessibility: {
      label: 'ACCESSIBILITY',
      title: '無障礙聲明',
      description: '說明本站為提升不同使用者瀏覽體驗而持續進行的可近用性改善方向。',
      effectiveDateLabel: '生效日期',
      effectiveDate: '2026-03-10',
      sections: [
        {
          title: '改善方向',
          paragraphs: [
            '昊鼎國際法律事務所持續改善鍵盤操作、標題層級、閱讀對比與版面可讀性，讓主要資訊更容易被理解與使用。',
          ],
          items: [
            '清楚的頁面標題與段落結構',
            '適合手機與桌機的閱讀版面',
            '強化圖片、按鈕與連結的語意表達',
          ],
        },
        {
          title: '回饋管道',
          paragraphs: [
            '若您在使用本站時遇到無障礙問題，歡迎透過電子郵件或聯絡頁面提出，我們會優先檢視。',
          ],
        },
      ],
    },
  },
  en: {
    privacy: {
      label: 'PRIVACY',
      title: 'Privacy Policy',
      description: 'How we handle inquiry details, consultation requests, and basic website usage information.',
      effectiveDateLabel: 'Effective date',
      effectiveDate: '2026-07-30',
      sections: [
        {
          title: 'Information we collect',
          paragraphs: [
            'If you use a consultation form, it collects a name or company name, reply email, inquiry type, matter summary, and consent to process the submission. A phone number is optional. Where AI consultation is available, using it may also involve processing conversation text, a session identifier, classification results, and feedback.',
            'Basic technical records such as IP address, user-agent string, and request time may be generated for security and service operations.',
            'You can contact the firm at wei@hoveringlaw.com.tw. Selecting an email link may open your email application. The click alone does not send your draft, submit a consultation request, or give consent to process the inquiry. When your email reaches us, we receive your sending address and the information and attachments you include.',
          ],
        },
        {
          title: 'How we use it',
          paragraphs: [
            'Collected information is used only to review inquiries, respond to potential clients, schedule consultations, improve service quality, and maintain website security.',
          ],
          items: [
            'Responding to inquiries and consultation requests',
            'Scheduling in-person or video consultations',
            'Improving site operations, quality, and security',
          ],
        },
        {
          title: 'Retention and deletion',
          paragraphs: [
            'Consultation event and feedback logs are deleted on a 90-day retention basis. Consultation email and database copies are kept only for as long as answering the inquiry or handling the matter requires.',
            'Once the retention purpose has been met, information is destroyed without undue delay and in a manner intended to prevent recovery; where a legal duty requires retention, the information is kept for that period. Backups and paper records are destroyed under the same standard.',
          ],
        },
        {
          title: 'Service providers and international processing',
          paragraphs: [
            'Vercel provides website hosting and private object storage, and OpenAI is used to generate AI consultation responses where that feature is configured. Email is sent through the mail service the firm uses.',
            'Some service providers’ servers may be located outside Taiwan, in which case personal information may be stored and processed there. The firm keeps the contractual protections its processors require for personal information and shares information only to the extent the stated purposes need.',
          ],
        },
        {
          title: 'Cookies and browser storage',
          paragraphs: [
            'The site uses cookies or browser localStorage to remember popup visibility and AI-response feedback state. Where analytics tools are used, this policy describes them.',
            'The website uses visit records to understand how its pages and contact links are used. These records may include a browser-session identifier, pages viewed, referral source, language, time spent on a page, scroll depth, and selection of an email inquiry link. Browser session storage may hold the identifier used to associate these records. Selecting an email link is recorded separately from receiving an inquiry; the email draft and attachments are not included in that selection record. IP addresses are not stored in these visitor-analytics events, although they may be used separately for security and request limits.',
          ],
        },
        {
          title: 'Your choices and contact',
          paragraphs: [
            'To request access, correction, deletion, or withdrawal of consent, email the official consultation address at wei@hoveringlaw.com.tw. If a legal retention duty or an active legal matter limits the request, the reason for the limitation should be explained.',
            'Privacy questions and requests concerning your personal information are received at wei@hoveringlaw.com.tw, and we reply with the outcome in the order requests arrive.',
          ],
        },
        {
          title: 'Sensitive matter materials, minors, and marketing',
          paragraphs: [
            'For your first email, provide a brief description of the matter or business, its connection to Taiwan, any relevant deadline, your preferred language, and contact details. Please wait for the attorney’s instructions before sending passport or identification numbers, bank account details, medical records, original identity documents, or a complete evidence file. Submit sensitive materials only by a secure method in accordance with the attorney’s instructions.',
            'Minors should contact the firm with a guardian and should not send sensitive information. Consultation information is not used for marketing without separate consent, and where consent has been given it can be withdrawn at any time at wei@hoveringlaw.com.tw.',
          ],
        },
        {
          title: 'Personal-data incident response',
          paragraphs: [
            'If a personal-data incident is suspected, the firm contains access, assesses the scope, preserves the relevant records, and makes the notices required by applicable law.',
          ],
        },
      ],
    },
    disclaimer: {
      label: 'DISCLAIMER',
      title: 'Disclaimer',
      description: 'The scope of the website content and the limits of legal information published on the site.',
      effectiveDateLabel: 'Effective date',
      effectiveDate: '2026-03-10',
      sections: [
        {
          title: 'General information only',
          paragraphs: [
            'Website articles, videos, and summaries are provided for general information and do not replace advice on your specific facts.',
            'Legal outcomes depend on the facts, applicable law, and timing of the matter, so any real case should be reviewed separately.',
          ],
        },
        {
          title: 'No attorney-client relationship',
          paragraphs: [
            'Browsing the site, sending email, or contacting us through messaging platforms does not by itself create an attorney-client relationship.',
            'A formal engagement begins only after matter review and mutual confirmation of representation.',
          ],
        },
        {
          title: 'External links and past results',
          paragraphs: [
            'External links are provided for convenience. We do not guarantee the accuracy or currency of third-party content.',
            'Past case results, testimonials, and examples do not guarantee similar outcomes in future matters.',
          ],
        },
      ],
    },
    accessibility: {
      label: 'ACCESSIBILITY',
      title: 'Accessibility Statement',
      description: 'Our current approach to making key legal information easier to access across devices and browsing methods.',
      effectiveDateLabel: 'Effective date',
      effectiveDate: '2026-03-10',
      sections: [
        {
          title: 'Accessibility focus',
          paragraphs: [
            'We continue to improve keyboard navigation, heading structure, readable contrast, and page clarity so visitors can understand important information more easily.',
          ],
          items: [
            'Clear page titles and section hierarchy',
            'Readable layouts on desktop and mobile',
            'Stronger text alternatives and link meaning',
          ],
        },
        {
          title: 'Feedback',
          paragraphs: [
            'If you encounter an accessibility issue on the site, please let us know through email or the contact page so we can review it promptly.',
          ],
        },
      ],
    },
  },
  ja: {
    privacy: {
      label: 'PRIVACY',
      title: 'プライバシーポリシー',
      description:
        'お問い合わせ、相談予約および本ウェブサイトのご利用に際して収集することのある情報と、その利用方法について説明します。',
      effectiveDateLabel: '施行日',
      effectiveDate: '2026-07-30',
      sections: [
        {
          title: '収集する情報',
          paragraphs: [
            '相談フォームをご利用の場合は、氏名または会社名、返信用メールアドレス、ご相談分野、概要および個人情報処理への同意を取得します。電話番号は任意です。AI相談が提供されている場合、ご利用に伴い会話内容、セッション識別子、分類結果およびフィードバックを処理することがあります。',
            'セキュリティおよびサービス運営のため、IPアドレス、ユーザーエージェント、リクエスト時刻などの基本的な技術記録が生成されることがあります。',
            '当事務所へのお問い合わせは、wei@hoveringlaw.com.tw までお送りいただけます。メールリンクを選択すると、ご利用のメールアプリが開く場合があります。リンクの選択だけでは、下書きの送信、相談の申し込み、相談内容の個人情報処理への同意は行われません。メールが当事務所に届くと、送信元のメールアドレスと、本文や添付ファイルに含まれる情報を受け取ります。',
          ],
        },
        {
          title: '利用目的',
          paragraphs: [
            '収集した情報は、お問い合わせへの回答、相談日程の調整、案件に関するご要望の確認、ウェブサイトのセキュリティ維持およびサービス品質の改善に限って利用します。',
          ],
          items: [
            'お問い合わせおよび相談予約への回答',
            '対面またはビデオ通話による相談日程の調整',
            'ウェブサイトの安全性、運営および利用体験の改善',
          ],
        },
        {
          title: '保管期間および削除',
          paragraphs: [
            '相談イベントおよびフィードバックログは、90日間の保管基準に従って削除します。相談メールおよびデータベース上の複製は、お問い合わせへの回答および案件対応に必要な期間に限り保管します。',
            '保管の目的を達した情報は遅滞なく、復元が困難な方法で廃棄します。法令上の保存義務がある情報は、当該期間中保管します。バックアップおよび紙媒体も同じ基準で廃棄します。',
          ],
        },
        {
          title: '委託先および国外での処理',
          paragraphs: [
            'ウェブサイトのホスティングおよび非公開オブジェクトストレージにはVercelを利用し、AI相談機能が設定されている場合は回答の生成にOpenAIを利用します。メールは、当事務所が利用するメールサービスの経路で送信されます。',
            '一部のサービス提供者のサーバーは台湾外の地域に所在する場合があり、その場合、個人情報が当該地域で保存および処理されることがあります。当事務所は委託先との間で個人情報の保護に必要な契約上の措置を定め、処理目的に必要な範囲でのみ情報を提供します。',
          ],
        },
        {
          title: 'Cookieおよびブラウザストレージ',
          paragraphs: [
            'ポップアップの表示状態およびAI回答へのフィードバック状態を記憶するため、CookieまたはブラウザのlocalStorageを使用します。分析ツールを利用する場合は、その内容を本ポリシーに記載します。',
            '当ウェブサイトでは、ページや連絡用リンクの利用状況を把握するため、訪問記録を利用しています。記録には、ブラウザのセッション識別子、閲覧ページ、参照元、言語、ページ滞在時間、スクロール位置、相談用メールリンクの選択が含まれる場合があります。記録を関連付ける識別子をブラウザのセッションストレージに保存する場合があります。メールリンクの選択と、お問い合わせの受信は別の記録です。リンクの選択記録に、メールの下書きや添付ファイルは含まれません。これらの訪問分析イベントにはIPアドレスを保存しませんが、セキュリティやリクエスト数の制限のため、別途利用する場合があります。',
          ],
        },
        {
          title: 'ご本人の権利およびお問い合わせ',
          paragraphs: [
            'ご本人の情報の開示、訂正、削除または同意の撤回をご希望の場合は、公式相談メール wei@hoveringlaw.com.tw までご連絡ください。法令上の保管義務または進行中の法律業務により対応範囲が制限される場合は、その理由をご案内します。',
            '個人情報の取扱いに関するご質問およびご本人の情報に関する請求は、wei@hoveringlaw.com.tw で受け付け、受付順に対応結果をご回答します。',
          ],
        },
        {
          title: '機微な案件資料、未成年者およびマーケティング',
          paragraphs: [
            '初回メールには、案件や事業の簡潔な概要、台湾との関係、関係する期限、ご希望の言語、連絡先をご記載ください。旅券番号、身分証番号、銀行口座情報、医療記録、身分証明書の原本、証拠資料一式は、弁護士からの案内を受けるまで送らないでください。機微な資料は、弁護士の案内に従い、安全な方法でご提出ください。',
            '未成年者は保護者とともに連絡し、機微情報を送らないことを推奨します。相談情報は、別途の同意なくマーケティングに利用することはなく、同意をいただいた場合も wei@hoveringlaw.com.tw からいつでも撤回いただけます。',
          ],
        },
        {
          title: '個人情報事故への対応',
          paragraphs: [
            '個人情報の漏えいが疑われる場合、当事務所はアクセスの遮断、影響範囲の確認、関係記録の保全を行い、法令に従って必要な通知を実施します。',
          ],
        },
      ],
    },
    disclaimer: {
      label: 'DISCLAIMER',
      title: '免責事項',
      description:
        '当ウェブサイトに掲載する一般情報の性質と、ご相談および委任関係が成立する条件について説明します。',
      effectiveDateLabel: '施行日',
      effectiveDate: '2026-03-10',
      sections: [
        {
          title: '一般情報について',
          paragraphs: [
            '当ウェブサイトの記事、動画および解説は一般的な情報提供を目的とするものであり、個別の案件に対する法律上の助言または正式な法律サービスを構成するものではありません。',
            '案件の結論は、事実関係、適用される法令および時期によって異なるため、具体的な案件については個別のご相談を通じて検討する必要があります。',
          ],
        },
        {
          title: 'ご相談および委任関係',
          paragraphs: [
            '当ウェブサイトの閲覧、メールの送信またはメッセージサービスを通じたお問い合わせのみをもって、弁護士と依頼者との委任関係が成立するものではありません。',
            '正式な法律サービスは、案件の確認を経て、当事務所とご依頼者の双方が委任関係の成立を確認した場合に限り開始されます。',
          ],
        },
        {
          title: '外部リンクおよび結果の非保証',
          paragraphs: [
            '外部サイトへのリンクは利便性のために提供するものであり、第三者が提供する情報の正確性または最新性を保証するものではありません。',
            '過去の事例、レビューまたは実績に関する情報は、将来の案件において同様の結果が得られることを保証するものではありません。',
          ],
        },
      ],
    },
    accessibility: {
      label: 'ACCESSIBILITY',
      title: 'アクセシビリティについて',
      description:
        'さまざまな利用者が主要な情報を利用しやすくなるよう、当ウェブサイトが継続して取り組むアクセシビリティ改善の方針について説明します。',
      effectiveDateLabel: '施行日',
      effectiveDate: '2026-03-10',
      sections: [
        {
          title: 'アクセシビリティへの取り組み',
          paragraphs: [
            '昊鼎国際法律事務所は、主要な情報をより理解しやすく、利用しやすくするため、キーボード操作、見出し構造、文字と背景のコントラストおよびページの読みやすさの改善に継続して取り組んでいます。',
          ],
          items: [
            '明確なページタイトルとセクション構造',
            'モバイルおよびデスクトップで読みやすいレイアウト',
            '画像、ボタンおよびリンクの意味が伝わる表現の強化',
          ],
        },
        {
          title: '改善のご要望',
          paragraphs: [
            '当ウェブサイトの利用中にアクセシビリティ上の問題がございましたら、メールまたはお問い合わせページからお知らせください。優先して確認いたします。',
          ],
        },
      ],
    },
  },
};
