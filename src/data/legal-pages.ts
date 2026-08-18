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
            '상담 이벤트 및 피드백 로그를 삭제하는 코드에는 기본 90일 보관 기준이 구현되어 있습니다. 다만 운영 환경의 실제 삭제 작업 실행 일정과 상담 이메일·데이터베이스 사본의 보관기간은 코드만으로 확정할 수 없어 운영자 확인이 필요합니다.',
            '보관 목적이 끝나고 법령 또는 사건 수행상 보존할 필요가 없어진 정보는 복구가 어렵도록 삭제하는 것을 원칙으로 합니다. 백업본의 파기 주기와 종이 자료 파기 방식은 운영자 확인이 필요합니다.',
          ],
        },
        {
          title: '처리업체와 국외 처리',
          paragraphs: [
            '코드에서 확인되는 외부 서비스는 웹 호스팅 및 비공개 객체 저장소를 제공하는 Vercel과, 설정된 경우 AI 상담 답변 생성에 사용하는 OpenAI입니다. 이메일은 서버에 설정된 SMTP 전송 경로를 사용하지만 실제 SMTP 사업자명은 운영자 확인이 필요합니다.',
            '각 서비스의 실제 저장 지역, 국외 이전 국가, 계약상 보호조치와 보유기간은 배포 설정 및 계약서를 통해 운영자가 확인해야 합니다. 회계·번역 등 추가 처리업체의 실제 이용 여부와 명칭도 운영자 확인이 필요합니다.',
          ],
        },
        {
          title: '쿠키와 브라우저 저장소',
          paragraphs: [
            '팝업 표시 상태와 AI 답변 피드백 상태를 기억하기 위해 쿠키 또는 브라우저 localStorage를 사용할 수 있습니다. 분석 도구의 실제 활성화 여부, 사용 쿠키와 보유기간은 운영 배포 설정에서 확인이 필요합니다.',
          ],
        },
        {
          title: '정보주체의 권리와 문의',
          paragraphs: [
            '본인 정보의 열람, 정정, 삭제 또는 동의 철회를 요청하려면 공식 상담 이메일 wei@hoveringlaw.com.tw로 연락해 주세요. 법령상 보관 의무나 진행 중인 법률 업무 때문에 요청 범위가 제한되는 경우에는 그 사유를 안내합니다.',
            '개인정보 보호 담당자의 성명, 직책과 별도 연락처는 운영자 확인이 필요합니다. 현재 코드에서 확인되는 개인정보 문의 채널은 wei@hoveringlaw.com.tw입니다.',
          ],
        },
        {
          title: '민감한 사건자료, 미성년자와 마케팅',
          paragraphs: [
            '초기 문의에는 사건 또는 업무의 개요와 연락처만 보내주시기 바랍니다. 주민등록번호, 여권번호, 계좌번호, 신분증 원본 또는 증거자료 전체는 이메일이나 일반 문의 폼으로 보내지 말고, 담당 변호사의 별도 안내 후 안전한 방식으로 제출해 주세요.',
            '미성년자는 보호자와 함께 문의하고 민감정보를 보내지 않는 것을 권장합니다. 상담 정보는 별도의 동의 없이 마케팅 수신 목적으로 사용하지 않는 것을 원칙으로 하며, 실제 마케팅 동의·철회 운영 절차는 운영자 확인이 필요합니다.',
          ],
        },
        {
          title: '개인정보 유출 대응',
          paragraphs: [
            '개인정보 유출이 의심되면 접근 차단, 영향 범위 확인, 기록 보존과 필요한 통지를 진행해야 합니다. 구체적인 사고 대응 담당자, 통지 기준과 연락망은 운영자 확인이 필요합니다.',
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
            '程式碼中的諮詢事件與回饋紀錄刪除端點，預設以 90 日為保存基準；但正式環境是否定期執行，以及諮詢電子郵件與資料庫副本的保存期間，無法僅由程式碼確認，須由營運者確認。',
            '處理目的完成且無法律或案件處理上的保存必要時，原則上應以難以復原的方式刪除。備份與紙本資料的實際銷毀週期仍須由營運者確認。',
          ],
        },
        {
          title: '受託服務與境外處理',
          paragraphs: [
            '從程式碼可確認的外部服務包括提供網站託管與私有物件儲存的 Vercel，以及在完成設定時用於產生 AI 諮詢回覆的 OpenAI。電子郵件透過伺服器設定的 SMTP 路徑寄送，但實際 SMTP 服務商名稱須由營運者確認。',
            '各服務的實際儲存區域、境外處理國家、契約保護措施與保存期間，須由營運者依部署設定與契約確認。會計、翻譯等其他受託者是否實際使用及其名稱亦待確認。',
          ],
        },
        {
          title: 'Cookie 與瀏覽器儲存',
          paragraphs: [
            '網站可能使用 Cookie 或瀏覽器 localStorage，以記住彈出視窗顯示狀態及 AI 回覆的回饋狀態。分析工具是否實際啟用、使用哪些 Cookie 與保存期間，須於正式部署設定中確認。',
          ],
        },
        {
          title: '當事人權利與聯絡方式',
          paragraphs: [
            '如欲請求查閱、更正、刪除個人資料或撤回同意，請寄信至官方諮詢信箱 wei@hoveringlaw.com.tw。若因法律保存義務或進行中的法律業務而無法完整處理，將說明限制理由。',
            '個人資料保護負責人的姓名、職稱及專用聯絡方式仍待營運者確認；目前程式碼可確認的隱私聯絡管道為 wei@hoveringlaw.com.tw。',
          ],
        },
        {
          title: '敏感案件資料、未成年人與行銷',
          paragraphs: [
            '初次聯絡時，請僅提供案件或業務概要及聯絡方式。請勿透過電子郵件或一般諮詢表單傳送身分證字號、護照號碼、銀行帳戶資料、證件正本或完整證據資料；請待承辦律師指示後，再以安全方式提供。',
            '建議未成年人由監護人陪同聯絡，且不要傳送敏感資訊。原則上，未另行取得同意前，不會將諮詢資料用於行銷收件；實際的行銷同意與撤回流程須由營運者確認。',
          ],
        },
        {
          title: '個人資料事件處理',
          paragraphs: [
            '若疑似發生個人資料外洩，應採取阻斷存取、確認影響範圍、保存紀錄及依法進行必要通知等措施。實際事故負責人、通知標準與聯絡流程須由營運者確認。',
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
            'The consultation form collects a name or company name, reply email, inquiry type, matter summary, and consent to process the submission. A phone number is optional. If you use the AI consultation feature, conversation text, a session identifier, classification results, and feedback may also be processed.',
            'Basic technical records such as IP address, user-agent string, and request time may be generated for security and service operations.',
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
            'The code includes a deletion endpoint with a default 90-day retention threshold for consultation event and feedback logs. The production execution schedule and the retention periods for consultation email and database copies cannot be verified from code alone and require operator confirmation.',
            'When the processing purpose ends and no legal or matter-related retention obligation applies, information should be deleted in a manner intended to prevent recovery. Backup deletion schedules and paper-record destruction procedures require operator confirmation.',
          ],
        },
        {
          title: 'Service providers and international processing',
          paragraphs: [
            'Services confirmed in the code include Vercel for website hosting and private object storage, and OpenAI for AI consultation responses when that provider is configured. Email is sent through a server-configured SMTP transport; the actual SMTP provider name requires operator confirmation.',
            'The actual storage regions, countries of processing, contractual safeguards, and retention terms for these services must be confirmed by the operator against deployment settings and contracts. The use and identity of any additional accounting, translation, or other processors also require confirmation.',
          ],
        },
        {
          title: 'Cookies and browser storage',
          paragraphs: [
            'The site may use cookies or browser localStorage to remember popup visibility and AI-response feedback state. Whether analytics is enabled in production, the exact cookies used, and their retention periods require review of the live deployment settings.',
          ],
        },
        {
          title: 'Your choices and contact',
          paragraphs: [
            'To request access, correction, deletion, or withdrawal of consent, email the official consultation address at wei@hoveringlaw.com.tw. If a legal retention duty or an active legal matter limits the request, the reason for the limitation should be explained.',
            'The privacy contact person’s name, title, and any dedicated contact details require operator confirmation. The privacy contact channel confirmed in code is wei@hoveringlaw.com.tw.',
          ],
        },
        {
          title: 'Sensitive matter materials, minors, and marketing',
          paragraphs: [
            'For an initial inquiry, provide only a brief matter or business overview and your contact details. Do not send passport or identification numbers, bank account information, original identity documents, or a full evidence file by email or through the general inquiry form. Provide sensitive materials only through a secure method after receiving instructions from the attorney.',
            'Minors should contact the firm with a guardian and should not send sensitive information. Consultation information should not be used for marketing without separate consent; the live marketing-consent and withdrawal procedure requires operator confirmation.',
          ],
        },
        {
          title: 'Personal-data incident response',
          paragraphs: [
            'If a personal-data incident is suspected, access should be contained, the scope assessed, relevant records preserved, and required notices made. The assigned incident owner, notification thresholds, and contact plan require operator confirmation.',
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
            '相談フォームでは、氏名または会社名、返信用メールアドレス、ご相談分野、概要および個人情報処理への同意を取得します。電話番号は任意です。AI相談を利用した場合、会話内容、セッション識別子、分類結果およびフィードバックを処理することがあります。',
            'セキュリティおよびサービス運営のため、IPアドレス、ユーザーエージェント、リクエスト時刻などの基本的な技術記録が生成されることがあります。',
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
            '相談イベントおよびフィードバックログの削除用コードには、標準で90日間の保管基準が実装されています。ただし、本番環境での実行スケジュールならびに相談メールおよびデータベース上の複製の保管期間は、コードのみでは確認できないため、運営者による確認が必要です。',
            '利用目的が終了し、法令または案件対応上の保管義務がない情報は、復元が困難な方法で削除することを原則とします。バックアップおよび紙媒体の廃棄周期は運営者による確認が必要です。',
          ],
        },
        {
          title: '委託先および国外での処理',
          paragraphs: [
            'コードから確認できる外部サービスは、ウェブサイトのホスティングおよび非公開オブジェクトストレージを提供するVercelと、設定されている場合にAI相談の回答生成に使用するOpenAIです。メールはサーバーに設定されたSMTP経路で送信されますが、実際のSMTP事業者名は運営者による確認が必要です。',
            '各サービスの保存地域、国外処理国、契約上の保護措置および保管期間は、配備設定と契約に基づき運営者が確認する必要があります。会計、翻訳その他の委託先を実際に利用しているか、その名称も確認が必要です。',
          ],
        },
        {
          title: 'Cookieおよびブラウザストレージ',
          paragraphs: [
            'ポップアップの表示状態およびAI回答へのフィードバック状態を記憶するため、CookieまたはブラウザのlocalStorageを使用することがあります。分析ツールが本番環境で有効か、使用するCookieおよび保管期間については、配備設定の確認が必要です。',
          ],
        },
        {
          title: 'ご本人の権利およびお問い合わせ',
          paragraphs: [
            'ご本人の情報の開示、訂正、削除または同意の撤回をご希望の場合は、公式相談メール wei@hoveringlaw.com.tw までご連絡ください。法令上の保管義務または進行中の法律業務により対応範囲が制限される場合は、その理由をご案内します。',
            '個人情報保護担当者の氏名、役職および専用連絡先は運営者による確認が必要です。コードから確認できるプライバシーに関する連絡先は wei@hoveringlaw.com.tw です。',
          ],
        },
        {
          title: '機微な案件資料、未成年者およびマーケティング',
          paragraphs: [
            '初回のお問い合わせでは、案件または業務の概要と連絡先のみをお送りください。旅券番号、身分証番号、銀行口座情報、身分証明書の原本または証拠資料一式は、メールや一般のお問い合わせフォームで送信せず、担当弁護士からの案内後に安全な方法でご提出ください。',
            '未成年者は保護者とともに連絡し、機微情報を送らないことを推奨します。相談情報は、別途同意を得ることなくマーケティングに利用しないことを原則とし、実際の同意・撤回手続は運営者による確認が必要です。',
          ],
        },
        {
          title: '個人情報事故への対応',
          paragraphs: [
            '個人情報の漏えいが疑われる場合、アクセスの遮断、影響範囲の確認、記録の保全および必要な通知を行う必要があります。事故対応責任者、通知基準および連絡網は運営者による確認が必要です。',
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
