import type { CampaignStatus } from '@/lib/builder/marketing/campaign-types';
import type { Locale } from '@/lib/locales';

type CampaignStatusLabels = Readonly<Record<CampaignStatus, string>>;

export type CampaignEditorCopy = {
  readonly settings: string;
  readonly subjectLabel: string;
  readonly bodyHtmlLabel: string;
  readonly bodyTextLabel: string;
  readonly campaignName: string;
  readonly fromName: string;
  readonly fromAddress: string;
  readonly segmentTags: string;
  readonly scheduledAt: string;
  readonly save: string;
  readonly saving: string;
  readonly saveSuccess: string;
  readonly requestFailed: string;
  readonly saveFailed: (reason: string) => string;
  readonly templateSection: string;
  readonly templateSelect: string;
  readonly templateHint: string;
  readonly templateApplyFailed: (reason: string) => string;
  readonly templateApplied: (name: string) => string;
  readonly statusLabel: string;
  readonly recipientsLabel: string;
  readonly opensLabel: string;
  readonly clicksLabel: string;
  readonly statusLabels: CampaignStatusLabels;
};

export const LOCALE_KEYS = ['ko', 'zh-hant', 'en'] as const satisfies readonly Locale[];

export const LOCALE_LABEL: Readonly<Record<Locale, string>> = {
  ko: '한국어',
  'zh-hant': '繁體中文',
  en: 'English',
};

export const CAMPAIGN_EDITOR_COPY: Readonly<Record<Locale, CampaignEditorCopy>> = {
  ko: {
    settings: '설정',
    subjectLabel: '제목',
    bodyHtmlLabel: '본문 HTML',
    bodyTextLabel: '본문 텍스트',
    campaignName: '캠페인 이름',
    fromName: '발신자 이름',
    fromAddress: '발신자 주소',
    segmentTags: '세그먼트 태그 (쉼표 구분; 비우면 전체)',
    scheduledAt: '예약 발송',
    save: '저장',
    saving: '저장 중...',
    saveSuccess: '저장 완료',
    requestFailed: '요청 실패',
    saveFailed: (reason) => `저장 실패: ${reason}`,
    templateSection: '템플릿 적용',
    templateSelect: '— 템플릿 선택 —',
    templateHint: '선택한 템플릿의 HTML/텍스트가 모든 로케일에 적용됩니다. 로케일별로 수정하세요.',
    templateApplyFailed: (reason) => `템플릿 적용 실패: ${reason}`,
    templateApplied: (name) => `템플릿 "${name}" 적용 — 로케일별 본문 수정 필요`,
    statusLabel: '상태',
    recipientsLabel: '수신',
    opensLabel: '오픈',
    clicksLabel: '클릭',
    statusLabels: {
      draft: '초안',
      scheduled: '예약',
      sending: '발송중',
      sent: '발송완료',
      failed: '실패',
    },
  },
  'zh-hant': {
    settings: '設定',
    subjectLabel: '主旨',
    bodyHtmlLabel: 'HTML 內文',
    bodyTextLabel: '純文字內文',
    campaignName: '活動名稱',
    fromName: '寄件者名稱',
    fromAddress: '寄件者地址',
    segmentTags: '區隔標籤（以逗號分隔；留空則全部）',
    scheduledAt: '排程發送',
    save: '儲存',
    saving: '儲存中...',
    saveSuccess: '儲存完成',
    requestFailed: '請求失敗',
    saveFailed: (reason) => `儲存失敗：${reason}`,
    templateSection: '套用範本',
    templateSelect: '— 選擇範本 —',
    templateHint: '所選範本的 HTML / 純文字會套用到所有語系。請依語系調整。',
    templateApplyFailed: (reason) => `範本套用失敗：${reason}`,
    templateApplied: (name) => `已套用範本「${name}」— 仍需依語系調整內文`,
    statusLabel: '狀態',
    recipientsLabel: '收件',
    opensLabel: '開啟',
    clicksLabel: '點擊',
    statusLabels: {
      draft: '草稿',
      scheduled: '排程',
      sending: '發送中',
      sent: '已發送',
      failed: '失敗',
    },
  },
  en: {
    settings: 'Settings',
    subjectLabel: 'Subject',
    bodyHtmlLabel: 'Body HTML',
    bodyTextLabel: 'Body text',
    campaignName: 'Campaign name',
    fromName: 'From name',
    fromAddress: 'From address',
    segmentTags: 'Segment tags (comma separated; leave empty for all)',
    scheduledAt: 'Scheduled send',
    save: 'Save',
    saving: 'Saving...',
    saveSuccess: 'Saved',
    requestFailed: 'Request failed',
    saveFailed: (reason) => `Save failed: ${reason}`,
    templateSection: 'Apply template',
    templateSelect: '— Choose a template —',
    templateHint: 'The selected template HTML/text applies to every locale. Edit per locale after applying.',
    templateApplyFailed: (reason) => `Template apply failed: ${reason}`,
    templateApplied: (name) => `Applied template "${name}" — locale-specific body edits still required`,
    statusLabel: 'Status',
    recipientsLabel: 'Recipients',
    opensLabel: 'Opens',
    clicksLabel: 'Clicks',
    statusLabels: {
      draft: 'Draft',
      scheduled: 'Scheduled',
      sending: 'Sending',
      sent: 'Sent',
      failed: 'Failed',
    },
  },
};
