import type { Locale } from '@/lib/locales';

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

export const legalPageContent: Record<Locale, Record<LegalPageKey, LegalPageContent>> = {
  ko: {
    privacy: {
      label: 'PRIVACY',
      title: '개인정보 처리방침',
      description: '문의, 상담 예약, 웹사이트 이용 과정에서 수집되는 정보와 처리 기준을 안내합니다.',
      effectiveDateLabel: '시행일',
      effectiveDate: '2026-03-10',
      sections: [
        {
          title: '수집하는 정보',
          paragraphs: [
            '법무법인 호정은 문의 및 상담 과정에서 이름, 연락처, 이메일, 회사명, 사건 개요, 첨부 자료와 같은 정보를 받을 수 있습니다.',
            '웹사이트 운영 과정에서는 접속 로그, 브라우저 정보, 검색어, 방문 경로 등 서비스 개선과 보안 대응에 필요한 기본 기술 정보가 수집될 수 있습니다.',
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
          title: '보관 및 제3자 제공',
          paragraphs: [
            '법적 의무가 있거나 사건 수행에 필요한 경우를 제외하고, 수집한 정보를 판매하지 않습니다.',
            '회계, 번역, 행정 처리 등 업무 수행상 필요한 경우에 한해 관련 전문가 또는 협력사와 필요한 범위 내에서만 공유할 수 있습니다.',
          ],
        },
        {
          title: '문의처',
          paragraphs: [
            '개인정보 관련 문의는 이메일 wei@hoveringlaw.com.tw 또는 대표 연락처를 통해 접수하실 수 있습니다.',
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
      effectiveDate: '2026-03-10',
      sections: [
        {
          title: '蒐集的資訊',
          paragraphs: [
            '昊鼎國際法律事務所在諮詢與聯絡過程中，可能蒐集姓名、聯絡方式、電子郵件、公司名稱、案件概要及相關附件資料。',
            '網站營運過程中，也可能蒐集連線紀錄、瀏覽器資訊、搜尋字詞與來源路徑等基本技術資訊，以利安全維護與服務優化。',
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
          title: '保存與提供',
          paragraphs: [
            '除法律義務或案件處理所必要者外，我們不會出售個人資料。',
            '若案件處理需要，資料可能於必要範圍內提供給合作的會計、翻譯或行政支援專業人員。',
          ],
        },
        {
          title: '聯絡方式',
          paragraphs: [
            '如有隱私相關問題，可透過 wei@hoveringlaw.com.tw 或聯絡頁面與我們聯繫。',
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
      effectiveDate: '2026-03-10',
      sections: [
        {
          title: 'Information we collect',
          paragraphs: [
            'We may receive your name, contact details, email address, company name, matter summary, and supporting documents when you contact the firm.',
            'For website operations, we may also collect basic technical information such as logs, browser details, search terms, and referral paths for security and service improvement.',
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
          title: 'Retention and sharing',
          paragraphs: [
            'We do not sell personal information. Data is shared only when legally required or reasonably necessary to handle a matter.',
            'Where needed, limited information may be shared with accountants, translators, or operational partners supporting the engagement.',
          ],
        },
        {
          title: 'Contact',
          paragraphs: [
            'For privacy-related questions, please contact us at wei@hoveringlaw.com.tw or through the contact page.',
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
};
