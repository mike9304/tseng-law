import type { Locale } from '@/lib/locales';
import type { FormInputVariantKey } from '@/lib/builder/site/component-variants';

type ConditionKey = 'equals' | 'notEquals' | 'contains' | 'isEmpty' | 'isNotEmpty';
type FieldTypeKey = 'text' | 'email' | 'tel' | 'number' | 'url' | 'password' | 'date';

interface FormControlsCopy {
  formInspector: {
    formNameLabel: string;
    formNamePlaceholder: string;
    submitToLabel: string;
    storageLabel: string;
    emailLabel: string;
    webhookLabel: string;
    targetEmailLabel: string;
    targetEmailPlaceholder: string;
    webhookUrlLabel: string;
    webhookUrlPlaceholder: string;
    successMessageLabel: string;
    redirectUrlLabel: string;
    redirectUrlPlaceholder: string;
    captchaLabel: string;
    noneLabel: string;
    stepsJsonLabel: string;
    stepsJsonPlaceholder: string;
    autoReplyLabel: string;
    autoReplyTemplateLabel: string;
    layoutModeLabel: string;
    absoluteLabel: string;
    flexLabel: string;
    gridLabel: string;
    flexSettingsLabel: string;
    directionLabel: string;
    rowLabel: string;
    columnLabel: string;
    gapLabel: string;
    gridSettingsLabel: string;
    columnsLabel: string;
    rowGapLabel: string;
  };
  formDefaults: {
    successMessage: string;
    autoReplyTemplatePlaceholder: string;
  };
  fieldInspector: {
    fieldNameLabel: string;
    fieldNamePlaceholder: string;
    labelLabel: string;
    inputLabelPlaceholder: string;
    textareaLabelPlaceholder: string;
    typeLabel: string;
    inputVariantLabel: string;
    placeholderLabel: string;
    defaultValueLabel: string;
    requiredLabel: string;
    minLengthLabel: string;
    maxLengthLabel: string;
    patternLabel: string;
    patternPlaceholder: string;
    minimumLabel: string;
    maximumLabel: string;
    stepLabel: string;
    allowDecimalsLabel: string;
    showIfFieldLabel: string;
    conditionalFieldPlaceholder: string;
    conditionLabel: string;
    conditionValueLabel: string;
    customErrorLabel: string;
    optionsLabel: string;
    multipleLabel: string;
    rowsLabel: string;
    selectFallbackOptionLabel: string;
    typeOptions: Record<FieldTypeKey, string>;
    inputVariantLabels: Record<FormInputVariantKey, string>;
    conditionOptions: Record<ConditionKey, string>;
  };
  radioInspector: {
    fieldNameLabel: string;
    labelLabel: string;
    optionsLabel: string;
    defaultValueLabel: string;
    layoutLabel: string;
    verticalLabel: string;
    horizontalLabel: string;
    requiredLabel: string;
    showIfFieldLabel: string;
    conditionValueLabel: string;
    customErrorLabel: string;
    yesLabel: string;
    noLabel: string;
  };
  dateInspector: {
    fieldNameLabel: string;
    labelLabel: string;
    typeLabel: string;
    inputVariantLabel: string;
    defaultValueLabel: string;
    minLabel: string;
    maxLabel: string;
    requiredLabel: string;
    showIfFieldLabel: string;
    conditionValueLabel: string;
    customErrorLabel: string;
    typeOptions: Record<'date' | 'datetime-local' | 'time' | 'month', string>;
  };
  fileInspector: {
    fieldNameLabel: string;
    labelLabel: string;
    inputVariantLabel: string;
    acceptLabel: string;
    maxSizeLabel: string;
    multipleLabel: string;
    requiredLabel: string;
    showIfFieldLabel: string;
    conditionValueLabel: string;
    customErrorLabel: string;
  };
  submitInspector: {
    labelLabel: string;
    labelPlaceholder: string;
    styleLabel: string;
    loadingLabelLabel: string;
    loadingLabelPlaceholder: string;
    fullWidthLabel: string;
    styleOptions: Record<'primary' | 'secondary' | 'outline' | 'ghost', string>;
  };
  fieldDefaults: {
    inputLabel: string;
    textareaLabel: string;
    selectLabel: string;
    radioLabel: string;
    checkboxLabel: string;
    dateLabel: string;
    fileLabel: string;
    selectPlaceholder: string;
    selectOptionLabel: (index: number) => string;
    submitLabel: string;
    submitLoadingLabel: string;
  };
  checkboxInspector: {
    fieldNameLabel: string;
    labelLabel: string;
    optionsLabel: string;
    requiredLabel: string;
    defaultCheckedLabel: string;
    showIfFieldLabel: string;
    conditionValueLabel: string;
    customErrorLabel: string;
  };
  formRuntime: {
    previousLabel: string;
    nextLabel: string;
    emptyBadgeLabel: string;
    slowSubmissionError: string;
    captchaMissingError: string;
    submitFailedError: string;
    networkError: string;
    requiredError: string;
    emailTypeError: string;
    tooShortError: (minLength: number) => string;
    patternError: string;
    fallbackFieldLabel: string;
    fallbackInvalidError: (label: string) => string;
    fileTooLargeError: (maxSizeMb: number) => string;
    fileUploadFailedError: string;
    captchaPlaceholder: (provider: string) => string;
    captchaNotConfigured: (provider: string) => string;
  };
  paymentWidget: {
    defaults: {
      label: string;
      description: string;
    };
    loadingLabel: string;
    manualButtonLabel: string;
    stripeButtonLabel: string;
    securityNote: string;
    stripeError: string;
    inspector: {
      nameLabel: string;
      labelLabel: string;
      providerLabel: string;
      amountLabel: string;
      currencyLabel: string;
      descriptionLabel: string;
      successUrlLabel: string;
      cancelUrlLabel: string;
      showSecurityNoteLabel: string;
      manualProviderLabel: string;
      currencyOptions: Record<'KRW' | 'USD' | 'TWD' | 'JPY' | 'EUR', string>;
    };
  };
  signatureWidget: {
    defaults: {
      label: string;
      helpText: string;
    };
    clearButtonLabel: string;
    inspector: {
      nameLabel: string;
      labelLabel: string;
      helpTextLabel: string;
      strokeColorLabel: string;
      strokeWidthLabel: string;
      requiredLabel: string;
      showClearButtonLabel: string;
    };
  };
}

export const FORM_INPUT_KO_DEFAULTS = {
  label: '필드',
} as const;

export const FORM_TEXTAREA_KO_DEFAULTS = {
  label: '메시지',
} as const;

export const FORM_SELECT_KO_DEFAULTS = {
  label: '선택',
  placeholder: '선택하세요',
  optionLabelPrefix: '옵션 ',
} as const;

export const FORM_RADIO_KO_DEFAULTS = {
  label: '선택',
  optionLabelPrefix: '옵션 ',
} as const;

export const FORM_CHECKBOX_KO_DEFAULTS = {
  label: '동의합니다',
} as const;

export const FORM_DATE_KO_DEFAULTS = {
  label: '날짜',
} as const;

export const FORM_FILE_KO_DEFAULTS = {
  label: '첨부 파일',
} as const;

export const FORM_SUBMIT_KO_DEFAULTS = {
  label: '제출',
  loadingLabel: '전송 중...',
} as const;

export const FORM_PAYMENT_KO_DEFAULTS = {
  label: '결제',
  description: '상담 비용',
} as const;

export const FORM_SIGNATURE_KO_DEFAULTS = {
  label: '서명',
  helpText: '박스 안에 서명해 주세요',
} as const;

export const FORM_KO_DEFAULTS = {
  successMessage: '감사합니다. 곧 연락드리겠습니다.',
  autoReplyTemplatePlaceholder: '문의가 접수되었습니다. 곧 연락드리겠습니다.',
} as const;

export function localizedFormControlText(value: string | undefined, localized: string, legacyDefault: string): string {
  const current = value ?? '';
  return current === legacyDefault ? localized : current;
}

export function localizedFormSelectOptionLabel(label: string, localized: (index: number) => string): string {
  const match = /^옵션 ([1-9]\d*)$/.exec(label.trim());
  if (!match) return label;
  return localized(Number(match[1]));
}

function inputVariantLabels(locale: Locale): Record<FormInputVariantKey, string> {
  if (locale === 'ko') {
    return {
      default: '기본',
      underline: '밑줄',
      filled: '채움',
    };
  }
  if (locale === 'zh-hant') {
    return {
      default: '預設',
      underline: '底線',
      filled: '填滿',
    };
  }
  return {
    default: 'Default',
    underline: 'Underline',
    filled: 'Filled',
  };
}

function conditionOptions(locale: Locale): Record<ConditionKey, string> {
  if (locale === 'ko') {
    return {
      equals: '같음',
      notEquals: '같지 않음',
      contains: '포함',
      isEmpty: '비어 있음',
      isNotEmpty: '비어 있지 않음',
    };
  }
  if (locale === 'zh-hant') {
    return {
      equals: '等於',
      notEquals: '不等於',
      contains: '包含',
      isEmpty: '為空',
      isNotEmpty: '非空',
    };
  }
  return {
    equals: 'equals',
    notEquals: 'not equals',
    contains: 'contains',
    isEmpty: 'is empty',
    isNotEmpty: 'is not empty',
  };
}

function dateTypeOptions(locale: Locale): Record<'date' | 'datetime-local' | 'time' | 'month', string> {
  if (locale === 'ko') {
    return {
      date: '날짜',
      'datetime-local': '날짜 및 시간',
      time: '시간',
      month: '월',
    };
  }
  if (locale === 'zh-hant') {
    return {
      date: '日期',
      'datetime-local': '日期與時間',
      time: '時間',
      month: '月份',
    };
  }
  return {
    date: 'Date',
    'datetime-local': 'Date & time',
    time: 'Time',
    month: 'Month',
  };
}

function submitStyleOptions(locale: Locale): Record<'primary' | 'secondary' | 'outline' | 'ghost', string> {
  if (locale === 'ko') {
    return {
      primary: '기본',
      secondary: '보조',
      outline: '외곽선',
      ghost: '고스트',
    };
  }
  if (locale === 'zh-hant') {
    return {
      primary: '主要',
      secondary: '次要',
      outline: '外框',
      ghost: '幽靈',
    };
  }
  return {
    primary: 'Primary',
    secondary: 'Secondary',
    outline: 'Outline',
    ghost: 'Ghost',
  };
}

function typeOptions(locale: Locale): Record<FieldTypeKey, string> {
  if (locale === 'ko') {
    return {
      text: '텍스트',
      email: '이메일',
      tel: '전화',
      number: '숫자',
      url: 'URL',
      password: '비밀번호',
      date: '날짜',
    };
  }
  if (locale === 'zh-hant') {
    return {
      text: '文字',
      email: '電子郵件',
      tel: '電話',
      number: '數字',
      url: 'URL',
      password: '密碼',
      date: '日期',
    };
  }
  return {
    text: 'Text',
    email: 'Email',
    tel: 'Tel',
    number: 'Number',
    url: 'URL',
    password: 'Password',
    date: 'Date',
  };
}

export function getFormControlsCopy(locale: Locale): FormControlsCopy {
  const formInspector = locale === 'ko'
    ? {
        formNameLabel: '폼 이름 (식별자)',
        formNamePlaceholder: 'contact-form',
        submitToLabel: '제출 위치',
        storageLabel: '저장소',
        emailLabel: '이메일',
        webhookLabel: '웹훅',
        targetEmailLabel: '대상 이메일',
        targetEmailPlaceholder: 'contact@example.com',
        webhookUrlLabel: '웹훅 URL',
        webhookUrlPlaceholder: 'https://example.com/webhook',
        successMessageLabel: '성공 메시지',
        redirectUrlLabel: '리디렉션 URL (선택)',
        redirectUrlPlaceholder: '/thank-you',
        captchaLabel: '캡차',
        noneLabel: '없음',
        stepsJsonLabel: '단계 JSON (선택)',
        stepsJsonPlaceholder: '[{"id":"step-1","title":"Step 1","fieldNodeIds":["form-input-abc"]}]',
        autoReplyLabel: '자동 회신',
        autoReplyTemplateLabel: '자동 회신 템플릿',
        layoutModeLabel: '레이아웃 모드',
        absoluteLabel: '절대 배치',
        flexLabel: '플렉스',
        gridLabel: '그리드',
        flexSettingsLabel: '플렉스 설정',
        directionLabel: '방향',
        rowLabel: '행',
        columnLabel: '열',
        gapLabel: '간격',
        gridSettingsLabel: '그리드 설정',
        columnsLabel: '열',
        rowGapLabel: '행 간격',
      }
    : locale === 'zh-hant'
      ? {
          formNameLabel: '表單名稱（識別碼）',
          formNamePlaceholder: 'contact-form',
          submitToLabel: '提交到',
          storageLabel: '儲存',
          emailLabel: '電子郵件',
          webhookLabel: 'Webhook',
          targetEmailLabel: '目標電子郵件',
          targetEmailPlaceholder: 'contact@example.com',
          webhookUrlLabel: 'Webhook URL',
          webhookUrlPlaceholder: 'https://example.com/webhook',
          successMessageLabel: '成功訊息',
          redirectUrlLabel: '重新導向 URL（選填）',
          redirectUrlPlaceholder: '/thank-you',
          captchaLabel: '驗證碼',
          noneLabel: '無',
          stepsJsonLabel: '步驟 JSON（選填）',
          stepsJsonPlaceholder: '[{"id":"step-1","title":"步驟 1","fieldNodeIds":["form-input-abc"]}]',
          autoReplyLabel: '自動回覆',
          autoReplyTemplateLabel: '自動回覆範本',
          layoutModeLabel: '版面模式',
          absoluteLabel: '絕對定位',
          flexLabel: '彈性',
          gridLabel: '格狀',
          flexSettingsLabel: '彈性設定',
          directionLabel: '方向',
          rowLabel: '橫向',
          columnLabel: '直向',
          gapLabel: '間距',
          gridSettingsLabel: '格狀設定',
          columnsLabel: '欄數',
          rowGapLabel: '列間距',
        }
      : {
          formNameLabel: 'Form name (ID)',
          formNamePlaceholder: 'contact-form',
          submitToLabel: 'Submit to',
          storageLabel: 'Storage',
          emailLabel: 'Email',
          webhookLabel: 'Webhook',
          targetEmailLabel: 'Target email',
          targetEmailPlaceholder: 'contact@example.com',
          webhookUrlLabel: 'Webhook URL',
          webhookUrlPlaceholder: 'https://example.com/webhook',
          successMessageLabel: 'Success message',
          redirectUrlLabel: 'Redirect URL (optional)',
          redirectUrlPlaceholder: '/thank-you',
          captchaLabel: 'Captcha',
          noneLabel: 'None',
          stepsJsonLabel: 'Steps JSON (optional)',
          stepsJsonPlaceholder: '[{"id":"step-1","title":"Step 1","fieldNodeIds":["form-input-abc"]}]',
          autoReplyLabel: 'Auto reply',
          autoReplyTemplateLabel: 'Auto reply template',
          layoutModeLabel: 'Layout mode',
          absoluteLabel: 'Absolute',
          flexLabel: 'Flex',
          gridLabel: 'Grid',
          flexSettingsLabel: 'Flex settings',
          directionLabel: 'Direction',
          rowLabel: 'Row',
          columnLabel: 'Column',
          gapLabel: 'Gap',
          gridSettingsLabel: 'Grid settings',
          columnsLabel: 'Columns',
          rowGapLabel: 'Row gap',
        };

  const formDefaults = locale === 'ko'
    ? {
        successMessage: FORM_KO_DEFAULTS.successMessage,
        autoReplyTemplatePlaceholder: FORM_KO_DEFAULTS.autoReplyTemplatePlaceholder,
      }
    : locale === 'zh-hant'
      ? {
          successMessage: '謝謝。我們會盡快與您聯絡。',
          autoReplyTemplatePlaceholder: '您的詢問已收到。我們會盡快與您聯絡。',
        }
      : {
          successMessage: 'Thank you. We will contact you soon.',
          autoReplyTemplatePlaceholder: 'Your inquiry has been received. We will contact you soon.',
        };

  const fieldInspector = locale === 'ko'
    ? {
        fieldNameLabel: '필드 이름',
        fieldNamePlaceholder: 'email',
        labelLabel: '라벨',
        inputLabelPlaceholder: '이메일',
        textareaLabelPlaceholder: '문의 내용',
        typeLabel: '타입',
        inputVariantLabel: '입력 변형',
        placeholderLabel: '플레이스홀더',
        defaultValueLabel: '기본값',
        requiredLabel: '필수',
        minLengthLabel: '최소 길이',
        maxLengthLabel: '최대 길이',
        patternLabel: '패턴 (정규식)',
        patternPlaceholder: '^[a-zA-Z0-9]+$',
        minimumLabel: '최소',
        maximumLabel: '최대',
        stepLabel: '단계',
        allowDecimalsLabel: '소수 허용',
        showIfFieldLabel: '필드가 이 값일 때만 표시',
        conditionalFieldPlaceholder: 'caseType',
        conditionLabel: '조건',
        conditionValueLabel: '조건 값',
        customErrorLabel: '사용자 정의 오류',
        optionsLabel: '옵션 (행당 value|label)',
        multipleLabel: '다중 선택',
        rowsLabel: '행 수',
        selectFallbackOptionLabel: '옵션 1',
        typeOptions: typeOptions(locale),
        inputVariantLabels: inputVariantLabels(locale),
        conditionOptions: conditionOptions(locale),
      }
      : locale === 'zh-hant'
      ? {
          fieldNameLabel: '欄位名稱',
          fieldNamePlaceholder: 'email',
          labelLabel: '標籤',
          inputLabelPlaceholder: '電子郵件',
          textareaLabelPlaceholder: '詢問內容',
          typeLabel: '類型',
          inputVariantLabel: '輸入樣式',
          placeholderLabel: '預留文字',
          defaultValueLabel: '預設值',
          requiredLabel: '必填',
          minLengthLabel: '最小長度',
          maxLengthLabel: '最大長度',
          patternLabel: '規則（正則）',
          patternPlaceholder: '^[a-zA-Z0-9]+$',
          minimumLabel: '最小值',
          maximumLabel: '最大值',
          stepLabel: '步進',
          allowDecimalsLabel: '允許小數',
          showIfFieldLabel: '僅在欄位符合時顯示',
          conditionalFieldPlaceholder: 'caseType',
          conditionLabel: '條件',
          conditionValueLabel: '條件值',
          customErrorLabel: '自訂錯誤',
          optionsLabel: '選項（每行 value|label）',
          multipleLabel: '可多選',
          rowsLabel: '列數',
          selectFallbackOptionLabel: '選項 1',
          typeOptions: typeOptions(locale),
          inputVariantLabels: inputVariantLabels(locale),
          conditionOptions: conditionOptions(locale),
        }
      : {
          fieldNameLabel: 'Field name',
          fieldNamePlaceholder: 'email',
          labelLabel: 'Label',
          inputLabelPlaceholder: 'Email',
          textareaLabelPlaceholder: 'Message',
          typeLabel: 'Type',
          inputVariantLabel: 'Input variant',
          placeholderLabel: 'Placeholder',
          defaultValueLabel: 'Default value',
          requiredLabel: 'Required',
          minLengthLabel: 'Min length',
          maxLengthLabel: 'Max length',
          patternLabel: 'Pattern (regex)',
          patternPlaceholder: '^[a-zA-Z0-9]+$',
          minimumLabel: 'Minimum',
          maximumLabel: 'Maximum',
          stepLabel: 'Step',
          allowDecimalsLabel: 'Allow decimals',
          showIfFieldLabel: 'Show if field',
          conditionalFieldPlaceholder: 'caseType',
          conditionLabel: 'Condition',
          conditionValueLabel: 'Condition value',
          customErrorLabel: 'Custom error',
          optionsLabel: 'Options (value|label per line)',
          multipleLabel: 'Multiple',
          rowsLabel: 'Rows',
          selectFallbackOptionLabel: 'Option 1',
          typeOptions: typeOptions(locale),
          inputVariantLabels: inputVariantLabels(locale),
          conditionOptions: conditionOptions(locale),
      };

  const radioInspector = locale === 'ko'
    ? {
        fieldNameLabel: '필드 이름',
        labelLabel: '라벨',
        optionsLabel: '옵션 (행당 value|label)',
        defaultValueLabel: '기본값',
        layoutLabel: '레이아웃',
        verticalLabel: '세로',
        horizontalLabel: '가로',
        requiredLabel: '필수',
        showIfFieldLabel: '필드가 이 값일 때만 표시',
        conditionValueLabel: '조건 값',
        customErrorLabel: '사용자 정의 오류',
        yesLabel: '예',
        noLabel: '아니요',
      }
    : locale === 'zh-hant'
      ? {
          fieldNameLabel: '欄位名稱',
          labelLabel: '標籤',
          optionsLabel: '選項（每行 value|label）',
          defaultValueLabel: '預設值',
          layoutLabel: '版面',
          verticalLabel: '直向',
          horizontalLabel: '橫向',
          requiredLabel: '必填',
          showIfFieldLabel: '僅在欄位符合時顯示',
          conditionValueLabel: '條件值',
          customErrorLabel: '自訂錯誤',
          yesLabel: '是',
          noLabel: '否',
        }
      : {
          fieldNameLabel: 'Field name',
          labelLabel: 'Label',
          optionsLabel: 'Options (value|label per line)',
          defaultValueLabel: 'Default value',
          layoutLabel: 'Layout',
          verticalLabel: 'Vertical',
          horizontalLabel: 'Horizontal',
          requiredLabel: 'Required',
          showIfFieldLabel: 'Show if field',
          conditionValueLabel: 'Condition value',
          customErrorLabel: 'Custom error',
          yesLabel: 'Yes',
          noLabel: 'No',
        };

  const dateInspector = locale === 'ko'
    ? {
        fieldNameLabel: '필드 이름',
        labelLabel: '라벨',
        typeLabel: '타입',
        inputVariantLabel: '입력 변형',
        defaultValueLabel: '기본값',
        minLabel: '최소',
        maxLabel: '최대',
        requiredLabel: '필수',
        showIfFieldLabel: '필드가 이 값일 때만 표시',
        conditionValueLabel: '조건 값',
        customErrorLabel: '사용자 정의 오류',
        typeOptions: dateTypeOptions(locale),
      }
    : locale === 'zh-hant'
      ? {
          fieldNameLabel: '欄位名稱',
          labelLabel: '標籤',
          typeLabel: '類型',
          inputVariantLabel: '輸入樣式',
          defaultValueLabel: '預設值',
          minLabel: '最小值',
          maxLabel: '最大值',
          requiredLabel: '必填',
          showIfFieldLabel: '僅在欄位符合時顯示',
          conditionValueLabel: '條件值',
          customErrorLabel: '自訂錯誤',
          typeOptions: dateTypeOptions(locale),
        }
      : {
          fieldNameLabel: 'Field name',
          labelLabel: 'Label',
          typeLabel: 'Type',
          inputVariantLabel: 'Input variant',
          defaultValueLabel: 'Default value',
          minLabel: 'Min',
          maxLabel: 'Max',
          requiredLabel: 'Required',
          showIfFieldLabel: 'Show if field',
          conditionValueLabel: 'Condition value',
          customErrorLabel: 'Custom error',
          typeOptions: dateTypeOptions(locale),
        };

  const fileInspector = locale === 'ko'
    ? {
        fieldNameLabel: '필드 이름',
        labelLabel: '라벨',
        inputVariantLabel: '입력 변형',
        acceptLabel: '허용 형식',
        maxSizeLabel: '최대 크기 MB',
        multipleLabel: '다중 선택',
        requiredLabel: '필수',
        showIfFieldLabel: '필드가 이 값일 때만 표시',
        conditionValueLabel: '조건 값',
        customErrorLabel: '사용자 정의 오류',
      }
    : locale === 'zh-hant'
      ? {
          fieldNameLabel: '欄位名稱',
          labelLabel: '標籤',
          inputVariantLabel: '輸入樣式',
          acceptLabel: '接受格式',
          maxSizeLabel: '最大大小 MB',
          multipleLabel: '可多選',
          requiredLabel: '必填',
          showIfFieldLabel: '僅在欄位符合時顯示',
          conditionValueLabel: '條件值',
          customErrorLabel: '自訂錯誤',
        }
      : {
          fieldNameLabel: 'Field name',
          labelLabel: 'Label',
          inputVariantLabel: 'Input variant',
          acceptLabel: 'Accept',
          maxSizeLabel: 'Max size MB',
          multipleLabel: 'Multiple',
          requiredLabel: 'Required',
          showIfFieldLabel: 'Show if field',
          conditionValueLabel: 'Condition value',
          customErrorLabel: 'Custom error',
        };

  const submitInspector = locale === 'ko'
    ? {
        labelLabel: '라벨',
        labelPlaceholder: '제출',
        styleLabel: '스타일',
        loadingLabelLabel: '로딩 라벨',
        loadingLabelPlaceholder: '전송 중...',
        fullWidthLabel: '전체 폭',
        styleOptions: submitStyleOptions(locale),
      }
    : locale === 'zh-hant'
      ? {
          labelLabel: '標籤',
          labelPlaceholder: '送出',
          styleLabel: '樣式',
          loadingLabelLabel: '載入標籤',
          loadingLabelPlaceholder: '送出中...',
          fullWidthLabel: '全寬',
          styleOptions: submitStyleOptions(locale),
        }
      : {
          labelLabel: 'Label',
          labelPlaceholder: 'Submit',
          styleLabel: 'Style',
          loadingLabelLabel: 'Loading label',
          loadingLabelPlaceholder: 'Submitting...',
          fullWidthLabel: 'Full width',
          styleOptions: submitStyleOptions(locale),
        };

  const fieldDefaults = locale === 'ko'
    ? {
        inputLabel: '필드',
        textareaLabel: '메시지',
        selectLabel: '선택',
        radioLabel: '선택',
        checkboxLabel: '동의합니다',
        dateLabel: '날짜',
        fileLabel: '첨부 파일',
        selectPlaceholder: '선택하세요',
        selectOptionLabel: (index: number) => `옵션 ${index}`,
        submitLabel: '제출',
        submitLoadingLabel: '전송 중...',
      }
    : locale === 'zh-hant'
      ? {
          inputLabel: '欄位',
          textareaLabel: '訊息',
          selectLabel: '選擇',
          radioLabel: '選擇',
          checkboxLabel: '我同意',
          dateLabel: '日期',
          fileLabel: '附件檔案',
          selectPlaceholder: '請選擇',
          selectOptionLabel: (index: number) => `選項 ${index}`,
          submitLabel: '送出',
          submitLoadingLabel: '送出中...',
        }
      : {
          inputLabel: 'Field',
          textareaLabel: 'Message',
          selectLabel: 'Select',
          radioLabel: 'Select',
          checkboxLabel: 'I agree',
          dateLabel: 'Date',
          fileLabel: 'Attachment',
          selectPlaceholder: 'Choose an option',
          selectOptionLabel: (index: number) => `Option ${index}`,
          submitLabel: 'Submit',
          submitLoadingLabel: 'Submitting...',
        };

  const checkboxInspector = locale === 'ko'
    ? {
        fieldNameLabel: '필드 이름',
        labelLabel: '라벨',
        optionsLabel: '옵션 (선택, 행당 value|label)',
        requiredLabel: '필수',
        defaultCheckedLabel: '기본 선택',
        showIfFieldLabel: '필드가 이 값일 때만 표시',
        conditionValueLabel: '조건 값',
        customErrorLabel: '사용자 정의 오류',
      }
    : locale === 'zh-hant'
      ? {
          fieldNameLabel: '欄位名稱',
          labelLabel: '標籤',
          optionsLabel: '選項（選填，每行 value|label）',
          requiredLabel: '必填',
          defaultCheckedLabel: '預設勾選',
          showIfFieldLabel: '僅在欄位符合時顯示',
          conditionValueLabel: '條件值',
          customErrorLabel: '自訂錯誤',
        }
      : {
          fieldNameLabel: 'Field name',
          labelLabel: 'Label',
          optionsLabel: 'Options (optional, value|label per line)',
          requiredLabel: 'Required',
          defaultCheckedLabel: 'Default checked',
          showIfFieldLabel: 'Show if field',
          conditionValueLabel: 'Condition value',
          customErrorLabel: 'Custom error',
        };

  const formRuntime = locale === 'ko'
    ? {
        previousLabel: '이전',
        nextLabel: '다음',
        emptyBadgeLabel: '폼',
        slowSubmissionError: '잠시 후 다시 시도해 주세요.',
        captchaMissingError: 'Captcha가 켜져 있지만 사이트 키가 설정되지 않았습니다.',
        submitFailedError: '전송에 실패했습니다.',
        networkError: '네트워크 오류가 발생했습니다.',
        requiredError: '필수 입력 항목입니다.',
        emailTypeError: '유효한 이메일 형식이 아닙니다.',
        tooShortError: (minLength: number) => `최소 ${minLength}자 이상 입력하세요.`,
        patternError: '입력 형식이 올바르지 않습니다.',
        fallbackFieldLabel: '필드',
        fallbackInvalidError: (label: string) => `${label} 입력값을 확인해 주세요.`,
        fileTooLargeError: (maxSizeMb: number) => `파일은 ${maxSizeMb}MB 이하로 첨부해 주세요.`,
        fileUploadFailedError: '파일 업로드에 실패했습니다.',
        captchaPlaceholder: (provider: string) => `${provider} captcha placeholder`,
        captchaNotConfigured: (provider: string) => `${provider} captcha not configured`,
      }
    : locale === 'zh-hant'
      ? {
          previousLabel: '上一步',
          nextLabel: '下一步',
          emptyBadgeLabel: '表單',
          slowSubmissionError: '請稍後再試。',
          captchaMissingError: '已啟用 Captcha，但尚未設定網站金鑰。',
          submitFailedError: '提交失敗。',
          networkError: '發生網路錯誤。',
          requiredError: '此欄位為必填。',
          emailTypeError: '電子郵件格式無效。',
          tooShortError: (minLength: number) => `請至少輸入 ${minLength} 個字元。`,
          patternError: '輸入格式不正確。',
          fallbackFieldLabel: '欄位',
          fallbackInvalidError: (label: string) => `請檢查${label}的輸入值。`,
          fileTooLargeError: (maxSizeMb: number) => `檔案大小不可超過 ${maxSizeMb}MB。`,
          fileUploadFailedError: '檔案上傳失敗。',
          captchaPlaceholder: (provider: string) => `${provider} 驗證碼預留區`,
          captchaNotConfigured: (provider: string) => `${provider} 驗證碼尚未設定`,
        }
      : {
          previousLabel: 'Previous',
          nextLabel: 'Next',
          emptyBadgeLabel: 'Form',
          slowSubmissionError: 'Please try again in a moment.',
          captchaMissingError: 'Captcha is enabled but no site key is configured.',
          submitFailedError: 'Submission failed.',
          networkError: 'A network error occurred.',
          requiredError: 'This field is required.',
          emailTypeError: 'Enter a valid email address.',
          tooShortError: (minLength: number) => `Enter at least ${minLength} characters.`,
          patternError: 'The input format is invalid.',
          fallbackFieldLabel: 'Field',
          fallbackInvalidError: (label: string) => `Check the value for ${label}.`,
          fileTooLargeError: (maxSizeMb: number) => `Attach files up to ${maxSizeMb}MB.`,
          fileUploadFailedError: 'File upload failed.',
          captchaPlaceholder: (provider: string) => `${provider} captcha placeholder`,
          captchaNotConfigured: (provider: string) => `${provider} captcha not configured`,
        };

  const paymentWidget = locale === 'ko'
    ? {
        defaults: {
          label: FORM_PAYMENT_KO_DEFAULTS.label,
          description: FORM_PAYMENT_KO_DEFAULTS.description,
        },
        loadingLabel: '결제 준비 중...',
        manualButtonLabel: '계좌 안내 보기',
        stripeButtonLabel: 'Stripe로 결제 진행',
        securityNote: '결제는 외부 PG(Stripe)에서 안전하게 처리됩니다.',
        stripeError: 'Stripe 설정을 확인해 주세요.',
        inspector: {
          nameLabel: '이름 (name)',
          labelLabel: '라벨',
          providerLabel: '공급자',
          amountLabel: '금액 (최소 단위)',
          currencyLabel: '통화',
          descriptionLabel: '설명',
          successUrlLabel: '성공 URL',
          cancelUrlLabel: '취소 URL',
          showSecurityNoteLabel: '보안 안내 표시',
          manualProviderLabel: '계좌 안내 (수동)',
          currencyOptions: {
            KRW: 'KRW (원)',
            USD: 'USD ($)',
            TWD: 'TWD (NT$)',
            JPY: 'JPY (¥)',
            EUR: 'EUR (€)',
          },
        },
      }
    : locale === 'zh-hant'
      ? {
          defaults: {
            label: '付款',
            description: '諮詢費',
          },
          loadingLabel: '正在準備付款...',
          manualButtonLabel: '查看匯款資訊',
          stripeButtonLabel: '前往 Stripe 付款',
          securityNote: '付款會在外部付款服務 Stripe 中安全處理。',
          stripeError: '請檢查 Stripe 設定。',
          inspector: {
            nameLabel: '名稱 (name)',
            labelLabel: '標籤',
            providerLabel: '供應商',
            amountLabel: '金額（最小單位）',
            currencyLabel: '幣別',
            descriptionLabel: '說明',
            successUrlLabel: '成功 URL',
            cancelUrlLabel: '取消 URL',
            showSecurityNoteLabel: '顯示安全提示',
            manualProviderLabel: '匯款資訊（手動）',
            currencyOptions: {
              KRW: 'KRW (韓元)',
              USD: 'USD ($)',
              TWD: 'TWD (NT$)',
              JPY: 'JPY (¥)',
              EUR: 'EUR (€)',
            },
          },
        }
      : {
          defaults: {
            label: 'Payment',
            description: 'Consultation fee',
          },
          loadingLabel: 'Preparing payment...',
          manualButtonLabel: 'View bank transfer details',
          stripeButtonLabel: 'Continue to Stripe',
          securityNote: 'Payments are securely processed by the external provider Stripe.',
          stripeError: 'Check the Stripe configuration.',
          inspector: {
            nameLabel: 'Name (name)',
            labelLabel: 'Label',
            providerLabel: 'Provider',
            amountLabel: 'Amount (minor unit)',
            currencyLabel: 'Currency',
            descriptionLabel: 'Description',
            successUrlLabel: 'Success URL',
            cancelUrlLabel: 'Cancel URL',
            showSecurityNoteLabel: 'Show security note',
            manualProviderLabel: 'Bank transfer details (manual)',
            currencyOptions: {
              KRW: 'KRW (won)',
              USD: 'USD ($)',
              TWD: 'TWD (NT$)',
              JPY: 'JPY (¥)',
              EUR: 'EUR (€)',
            },
          },
        };

  const signatureWidget = locale === 'ko'
    ? {
        defaults: {
          label: FORM_SIGNATURE_KO_DEFAULTS.label,
          helpText: FORM_SIGNATURE_KO_DEFAULTS.helpText,
        },
        clearButtonLabel: '지우기',
        inspector: {
          nameLabel: '이름 (name)',
          labelLabel: '라벨',
          helpTextLabel: '안내',
          strokeColorLabel: '펜 색',
          strokeWidthLabel: '펜 두께',
          requiredLabel: '필수',
          showClearButtonLabel: '지우기 버튼',
        },
      }
    : locale === 'zh-hant'
      ? {
          defaults: {
            label: '簽名',
            helpText: '請在框內簽名',
          },
          clearButtonLabel: '清除',
          inspector: {
            nameLabel: '名稱 (name)',
            labelLabel: '標籤',
            helpTextLabel: '說明',
            strokeColorLabel: '筆跡顏色',
            strokeWidthLabel: '筆跡粗細',
            requiredLabel: '必填',
            showClearButtonLabel: '顯示清除按鈕',
          },
        }
      : {
          defaults: {
            label: 'Signature',
            helpText: 'Sign inside the box',
          },
          clearButtonLabel: 'Clear',
          inspector: {
            nameLabel: 'Name (name)',
            labelLabel: 'Label',
            helpTextLabel: 'Help text',
            strokeColorLabel: 'Pen color',
            strokeWidthLabel: 'Pen width',
            requiredLabel: 'Required',
            showClearButtonLabel: 'Show clear button',
          },
        };

  return {
    formInspector,
    formDefaults,
    fieldInspector,
    radioInspector,
    dateInspector,
    fileInspector,
    submitInspector,
    checkboxInspector,
    fieldDefaults,
    formRuntime,
    paymentWidget,
    signatureWidget,
  };
}
