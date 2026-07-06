import type { Locale } from '@/lib/locales';

type ContactFieldKey = 'name' | 'email' | 'phone' | 'message' | 'company' | 'subject' | 'address' | 'preference';

export interface ConversionWidgetsCopy {
  contactForm: {
    defaultSubmitLabel: string;
    submittingLabel: string;
    successMessage: string;
    errorMessage: string;
    fieldsLabel: (count: number) => string;
    fieldLabels: Record<ContactFieldKey, string>;
    inspector: {
      submitLabel: string;
      actionUrl: string;
    };
  };
  ctaBanner: {
    empty: string;
    inspector: {
      title: string;
      description: string;
      buttonText: string;
      buttonLink: string;
      buttonLinkPlaceholder: string;
      backgroundColor: string;
      backgroundPlaceholder: string;
    };
  };
  customEmbed: {
    empty: string;
    iframeTitle: string;
    inspector: {
      htmlLabel: string;
      htmlPlaceholder: string;
      helper: string;
    };
  };
}

export const CONTACT_FORM_FIELDS: ContactFieldKey[] = [
  'name',
  'email',
  'phone',
  'message',
  'company',
  'subject',
  'address',
  'preference',
];

export const CONTACT_FORM_LEGACY_DEFAULTS: {
  fields: ContactFieldKey[];
  submitLabel: string;
  action: string;
} = {
  fields: ['name', 'email', 'phone', 'message'],
  submitLabel: 'Submit',
  action: '/api/consultation/submit',
};

export function localizedContactFormSubmitLabel(value: string | undefined, localized: string): string {
  const current = value ?? '';
  return current && current !== CONTACT_FORM_LEGACY_DEFAULTS.submitLabel ? current : localized;
}

export function getConversionWidgetsCopy(locale: Locale): ConversionWidgetsCopy {
  if (locale === 'zh-hant') {
    return {
      contactForm: {
        defaultSubmitLabel: '送出',
        submittingLabel: '送出中...',
        successMessage: '謝謝！您的訊息已送出。',
        errorMessage: '送出失敗，請再試一次。',
        fieldsLabel: (count) => `欄位 (${count})`,
        fieldLabels: {
          name: '姓名',
          email: '電子郵件',
          phone: '電話',
          message: '訊息',
          company: '公司',
          subject: '主旨',
          address: '地址',
          preference: '偏好',
        },
        inspector: {
          submitLabel: '送出按鈕標籤',
          actionUrl: '動作 URL',
        },
      },
      ctaBanner: {
        empty: 'CTA 橫幅',
        inspector: {
          title: '標題',
          description: '說明',
          buttonText: '按鈕文字',
          buttonLink: '按鈕連結',
          buttonLinkPlaceholder: '/zh-hant/contact',
          backgroundColor: '背景色',
          backgroundPlaceholder: '#0b3b2e 或 linear-gradient(...)',
        },
      },
      customEmbed: {
        empty: '自訂嵌入',
        iframeTitle: '自訂嵌入',
        inspector: {
          htmlLabel: 'HTML（沙盒）',
          htmlPlaceholder: '<iframe src="..." />',
          helper: '會以 iframe sandbox 方式呈現。可執行 script，但無法存取父頁面。',
        },
      },
    };
  }

  if (locale === 'en') {
    return {
      contactForm: {
        defaultSubmitLabel: 'Submit',
        submittingLabel: 'Sending...',
        successMessage: 'Thank you! Your message has been sent.',
        errorMessage: 'Failed to send. Please try again.',
        fieldsLabel: (count) => `Fields (${count})`,
        fieldLabels: {
          name: 'Name',
          email: 'Email',
          phone: 'Phone',
          message: 'Message',
          company: 'Company',
          subject: 'Subject',
          address: 'Address',
          preference: 'Preference',
        },
        inspector: {
          submitLabel: 'Submit button label',
          actionUrl: 'Action URL',
        },
      },
      ctaBanner: {
        empty: 'CTA Banner',
        inspector: {
          title: 'Title',
          description: 'Description',
          buttonText: 'Button text',
          buttonLink: 'Button link',
          buttonLinkPlaceholder: '/en/contact',
          backgroundColor: 'Background color',
          backgroundPlaceholder: '#0b3b2e or linear-gradient(...)',
        },
      },
      customEmbed: {
        empty: 'Custom Embed',
        iframeTitle: 'Custom embed',
        inspector: {
          htmlLabel: 'HTML (sandboxed)',
          htmlPlaceholder: '<iframe src="..." />',
          helper: 'Rendered in an iframe sandbox. Scripts can run, but parent-page access is blocked.',
        },
      },
    };
  }

  return {
    contactForm: {
      defaultSubmitLabel: '제출',
      submittingLabel: '전송 중...',
      successMessage: '감사합니다! 메시지가 전송되었습니다.',
      errorMessage: '전송에 실패했습니다. 다시 시도해 주세요.',
      fieldsLabel: (count) => `필드 (${count})`,
      fieldLabels: {
        name: '이름',
        email: '이메일',
        phone: '전화',
        message: '메시지',
        company: '회사',
        subject: '제목',
        address: '주소',
        preference: '선호',
      },
      inspector: {
        submitLabel: '제출 버튼 라벨',
        actionUrl: '액션 URL',
      },
    },
    ctaBanner: {
      empty: 'CTA 배너',
      inspector: {
        title: '제목',
        description: '설명',
        buttonText: '버튼 텍스트',
        buttonLink: '버튼 링크',
        buttonLinkPlaceholder: '/ko/contact',
        backgroundColor: '배경 색',
        backgroundPlaceholder: '#0b3b2e 또는 linear-gradient(...)',
      },
    },
    customEmbed: {
      empty: '사용자 정의 임베드',
      iframeTitle: '사용자 정의 임베드',
      inspector: {
        htmlLabel: 'HTML (sandboxed)',
        htmlPlaceholder: '<iframe src="..." />',
        helper: 'iframe sandbox로 렌더됩니다. script 실행 가능, 부모 접근 불가.',
      },
    },
  };
}
