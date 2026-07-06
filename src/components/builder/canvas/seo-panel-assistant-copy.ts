import type {
  BuilderSeoAssistantSeverity,
  BuilderSeoAssistantStatus,
} from '@/lib/builder/seo/assistant';
import type {
  BuilderSeoValidationField,
  BuilderSeoValidationSeverity,
} from '@/lib/builder/seo/validation';
import type { Locale } from '@/lib/locales';

type AssistantFieldLabelKey = BuilderSeoValidationField | 'content';

export interface SeoPanelAssistantCopy {
  title: string;
  description: string;
  save: string;
  focusKeyword: string;
  empty: string;
  validationTitle: string;
  validationPass: string;
  failureTokens: readonly string[];
  taskSeverity: Record<BuilderSeoAssistantSeverity, string>;
  taskStatus: Record<BuilderSeoAssistantStatus, string>;
  issueSeverity: Record<BuilderSeoValidationSeverity, string>;
  fieldLabels: Record<AssistantFieldLabelKey, string>;
}

export function getSeoPanelAssistantCopy(locale: Locale): SeoPanelAssistantCopy {
  if (locale === 'zh-hant') {
    return {
      title: 'SEO 助理',
      description: '管理焦點關鍵字與自動檢查項目。',
      save: '儲存關鍵字',
      focusKeyword: '焦點關鍵字',
      empty: '沒有 SEO 助理檢查項目。',
      validationTitle: '驗證',
      validationPass: 'SEO 檢查通過',
      failureTokens: ['失敗', 'failed', '실패'],
      taskSeverity: {
        critical: '嚴重',
        high: '高',
        medium: '中',
        low: '低',
      },
      taskStatus: {
        done: '完成',
        todo: '待處理',
      },
      issueSeverity: {
        blocker: '阻擋',
        warning: '警告',
        info: '資訊',
      },
      fieldLabels: {
        additionalMetaTags: '附加 meta tags',
        canonical: '標準 URL',
        content: '內容',
        description: '中繼描述',
        focusKeyword: '焦點關鍵字',
        ogImage: 'OG 圖片',
        robots: 'robots',
        slug: 'Slug',
        structuredData: '結構化資料',
        title: '標題',
        twitterImage: 'Twitter 圖片',
      },
    };
  }

  if (locale === 'en') {
    return {
      title: 'SEO Assistant',
      description: 'Manage the focus keyword and automated checks.',
      save: 'Save keyword',
      focusKeyword: 'Focus keyword',
      empty: 'No SEO Assistant checks yet.',
      validationTitle: 'Validation',
      validationPass: 'SEO checks passed',
      failureTokens: ['failed', '실패', '失敗'],
      taskSeverity: {
        critical: 'Critical',
        high: 'High',
        medium: 'Medium',
        low: 'Low',
      },
      taskStatus: {
        done: 'Done',
        todo: 'To do',
      },
      issueSeverity: {
        blocker: 'Blocker',
        warning: 'Warning',
        info: 'Info',
      },
      fieldLabels: {
        additionalMetaTags: 'Additional meta tags',
        canonical: 'Canonical URL',
        content: 'Content',
        description: 'Description',
        focusKeyword: 'Focus keyword',
        ogImage: 'OG image',
        robots: 'Robots',
        slug: 'Slug',
        structuredData: 'Structured data',
        title: 'Title',
        twitterImage: 'Twitter image',
      },
    };
  }

  return {
    title: 'SEO 도우미',
    description: '포커스 키워드와 자동 점검 항목을 관리합니다.',
    save: '키워드 저장',
    focusKeyword: '포커스 키워드',
    empty: 'SEO 도우미 점검 항목이 없습니다.',
    validationTitle: '검증',
    validationPass: 'SEO 검사 통과',
    failureTokens: ['실패', 'failed', '失敗'],
    taskSeverity: {
      critical: '긴급',
      high: '높음',
      medium: '보통',
      low: '낮음',
    },
    taskStatus: {
      done: '완료',
      todo: '할 일',
    },
    issueSeverity: {
      blocker: '차단',
      warning: '경고',
      info: '정보',
    },
    fieldLabels: {
      additionalMetaTags: '추가 메타 태그',
      canonical: '표준 URL',
      content: '콘텐츠',
      description: '설명',
      focusKeyword: '포커스 키워드',
      ogImage: 'OG 이미지',
      robots: 'robots',
      slug: '슬러그',
      structuredData: '구조화 데이터',
      title: '제목',
      twitterImage: 'Twitter 이미지',
    },
  };
}

export function isSeoPanelAssistantFailure(status: string, copy: SeoPanelAssistantCopy): boolean {
  return copy.failureTokens.some((token) => status.includes(token));
}

export function getSeoPanelAssistantFieldLabel(copy: SeoPanelAssistantCopy, field: string): string {
  return copy.fieldLabels[field as AssistantFieldLabelKey] ?? field;
}
