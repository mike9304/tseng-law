import type { Locale } from '@/lib/locales';

export type CampaignAnalyticsPanelCopy = {
  readonly title: string;
  readonly loading: string;
  readonly unavailable: string;
  readonly recipients: string;
  readonly openRate: string;
  readonly clickRate: string;
  readonly unsubscribeRate: string;
  readonly funnel: string;
  readonly recentActivity: string;
  readonly noActivity: string;
  readonly sent: string;
  readonly opened: string;
  readonly clicked: string;
  readonly unsubscribed: string;
  readonly opens: string;
  readonly clicks: string;
  readonly unsubscribes: string;
  readonly bounces: string;
};

export const CAMPAIGN_ANALYTICS_PANEL_COPY: Readonly<Record<Locale, CampaignAnalyticsPanelCopy>> = {
  ko: {
    title: '성과 분석',
    loading: '성과를 불러오는 중...',
    unavailable: '성과를 불러오지 못했습니다.',
    recipients: '수신',
    openRate: '오픈율',
    clickRate: '클릭률',
    unsubscribeRate: '구독해지율',
    funnel: '전환 퍼널',
    recentActivity: '최근 활동',
    noActivity: '아직 추적된 활동이 없습니다.',
    sent: '발송',
    opened: '오픈',
    clicked: '클릭',
    unsubscribed: '구독해지',
    opens: '오픈',
    clicks: '클릭',
    unsubscribes: '구독해지',
    bounces: '반송',
  },
  'zh-hant': {
    title: '成效分析',
    loading: '正在載入成效...',
    unavailable: '無法載入成效。',
    recipients: '收件',
    openRate: '開啟率',
    clickRate: '點擊率',
    unsubscribeRate: '退訂率',
    funnel: '轉換漏斗',
    recentActivity: '近期活動',
    noActivity: '尚無追蹤活動。',
    sent: '已發送',
    opened: '開啟',
    clicked: '點擊',
    unsubscribed: '退訂',
    opens: '開啟',
    clicks: '點擊',
    unsubscribes: '退訂',
    bounces: '退信',
  },
  en: {
    title: 'Performance',
    loading: 'Loading performance...',
    unavailable: 'Unable to load performance.',
    recipients: 'Recipients',
    openRate: 'Open rate',
    clickRate: 'Click rate',
    unsubscribeRate: 'Unsubscribe rate',
    funnel: 'Funnel',
    recentActivity: 'Recent activity',
    noActivity: 'No tracked activity yet.',
    sent: 'Sent',
    opened: 'Opened',
    clicked: 'Clicked',
    unsubscribed: 'Unsubscribed',
    opens: 'Opens',
    clicks: 'Clicks',
    unsubscribes: 'Unsubscribes',
    bounces: 'Bounces',
  },
};
