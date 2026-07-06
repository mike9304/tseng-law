import type { Locale } from '@/lib/locales';

export type NotificationsCopy = {
  title: string;
  subtitle: string;
  nav: {
    products: string;
    orders: string;
    currency: string;
    shipping: string;
    webhooks: string;
  };
  statsLabel: string;
  settingsLabel: string;
  templatesLabel: string;
  outboxTitle: string;
  recoveriesTitle: string;
  enabled: string;
  sender: string;
  adminEmail: string;
  recoveryDelay: string;
  paymentRules: string;
  paymentRulesNotes: string[];
  paymentReceivedEnabled: string;
  paymentReceivedManual: string;
  paymentReceivedHosted: string;
  paymentReceivedSuppressOverlap: string;
  paymentReceivedVariables: string;
  balanceDuePrefix: string;
  paymentIdPrefix: string;
  skippedPrefix: string;
  templateLabels: Record<string, string>;
  refresh: string;
  save: string;
  saving: string;
  ready: string;
  notificationsSaved: string;
  notificationsRefreshed: string;
  notificationsRefreshFailed: string;
  notificationsSaveFailed: string;
};

const COPY: Record<Locale, NotificationsCopy> = {
  ko: {
    title: '커머스 알림',
    subtitle: '주문, 결제, 장바구니 복구 알림을 한곳에서 관리합니다.',
    nav: {
      products: '제품',
      orders: '주문',
      currency: '통화',
      shipping: '배송',
      webhooks: '웹훅',
    },
    statsLabel: '알림 통계',
    settingsLabel: '알림 설정',
    templatesLabel: '알림 템플릿',
    outboxTitle: '발송함',
    recoveriesTitle: '복구된 장바구니',
    enabled: '사용',
    sender: '발신자',
    adminEmail: '관리자 이메일',
    recoveryDelay: '복구 지연',
    paymentRules: '결제 규칙',
    paymentRulesNotes: [
      '수동 결제와 호스팅 결제는 같은 고객용 템플릿을 사용합니다.',
      '중복 발송을 피하기 위해 영수증 이메일 겹침은 건너뜁니다.',
      '부분 결제는 남은 잔액을 포함합니다.',
    ],
    paymentReceivedEnabled: '결제 완료 이메일 발송',
    paymentReceivedManual: '수동 결제에 발송',
    paymentReceivedHosted: '호스팅 결제 링크에 발송',
    paymentReceivedSuppressOverlap: '영수증 이메일이 대기 중이면 건너뜀',
    paymentReceivedVariables: '변수: customerName, customerEmail, documentNumber, amountLabel, balanceDueLabel, paymentMethodLabel, paymentDate, paymentStatus, sourceLabel',
    balanceDuePrefix: '잔액',
    paymentIdPrefix: '결제',
    skippedPrefix: '건너뜀',
    templateLabels: {
      'order.created.customer': '고객 주문 확인',
      'order.created.admin': '관리자 새 주문 알림',
      'order.updated.customer': '고객 주문 업데이트',
      'order.invoice.customer': '고객 청구서 이메일',
      'order.receipt.customer': '고객 영수증 이메일',
      'billing.payment_received.customer': '고객 결제 완료',
      'cart.abandoned.customer': '장바구니 복구',
    },
    refresh: '새로고침',
    save: '저장',
    saving: '저장 중...',
    ready: '준비됨',
    notificationsSaved: '알림이 저장되었습니다.',
    notificationsRefreshed: '알림이 새로고침되었습니다.',
    notificationsRefreshFailed: '알림 새로고침에 실패했습니다',
    notificationsSaveFailed: '알림 저장에 실패했습니다',
  },
  'zh-hant': {
    title: '商務通知',
    subtitle: '在同一處管理訂單、付款與購物車挽回通知。',
    nav: {
      products: '產品',
      orders: '訂單',
      currency: '幣別',
      shipping: '運送',
      webhooks: 'Webhook',
    },
    statsLabel: '通知統計',
    settingsLabel: '通知設定',
    templatesLabel: '通知範本',
    outboxTitle: '寄送佇列',
    recoveriesTitle: '挽回購物車',
    enabled: '啟用',
    sender: '寄件者',
    adminEmail: '管理員電子郵件',
    recoveryDelay: '挽回延遲',
    paymentRules: '付款規則',
    paymentRulesNotes: [
      '手動付款與託管付款使用相同的顧客範本。',
      '為避免重複寄送已付款郵件，會略過收據重疊。',
      '部分付款會包含剩餘餘額。',
    ],
    paymentReceivedEnabled: '寄送付款完成郵件',
    paymentReceivedManual: '手動付款時寄送',
    paymentReceivedHosted: '託管付款連結時寄送',
    paymentReceivedSuppressOverlap: '若收據郵件已排入佇列則略過',
    paymentReceivedVariables: '變數：customerName、customerEmail、documentNumber、amountLabel、balanceDueLabel、paymentMethodLabel、paymentDate、paymentStatus、sourceLabel',
    balanceDuePrefix: '餘額',
    paymentIdPrefix: '付款',
    skippedPrefix: '略過',
    templateLabels: {
      'order.created.customer': '顧客訂單確認',
      'order.created.admin': '管理員新訂單通知',
      'order.updated.customer': '顧客訂單更新',
      'order.invoice.customer': '顧客發票郵件',
      'order.receipt.customer': '顧客收據郵件',
      'billing.payment_received.customer': '顧客付款完成',
      'cart.abandoned.customer': '購物車挽回',
    },
    refresh: '重新整理',
    save: '儲存',
    saving: '儲存中...',
    ready: '就緒',
    notificationsSaved: '通知已儲存。',
    notificationsRefreshed: '通知已重新整理。',
    notificationsRefreshFailed: '通知重新整理失敗',
    notificationsSaveFailed: '通知儲存失敗',
  },
  en: {
    title: 'Commerce notifications',
    subtitle: 'Queue order, billing payment, and cart recovery notifications for the store workflow.',
    nav: {
      products: 'Products',
      orders: 'Orders',
      currency: 'Currency',
      shipping: 'Shipping',
      webhooks: 'Webhooks',
    },
    statsLabel: 'Notification stats',
    settingsLabel: 'Notification settings',
    templatesLabel: 'Notification templates',
    outboxTitle: 'Outbox',
    recoveriesTitle: 'Recovery carts',
    enabled: 'Enabled',
    sender: 'Sender',
    adminEmail: 'Admin email',
    recoveryDelay: 'Recovery delay',
    paymentRules: 'Payment rules',
    paymentRulesNotes: [
      'Manual and hosted payments use the same customer-facing template.',
      'Receipt overlap is skipped to avoid duplicate paid emails.',
      'Partial payments include the remaining balance.',
    ],
    paymentReceivedEnabled: 'Send payment received emails',
    paymentReceivedManual: 'Send for manual payments',
    paymentReceivedHosted: 'Send for hosted payment links',
    paymentReceivedSuppressOverlap: 'Skip when receipt email is queued',
    paymentReceivedVariables: 'Variables: customerName, customerEmail, documentNumber, amountLabel, balanceDueLabel, paymentMethodLabel, paymentDate, paymentStatus, sourceLabel',
    balanceDuePrefix: 'Balance',
    paymentIdPrefix: 'Payment',
    skippedPrefix: 'Skipped',
    templateLabels: {
      'order.created.customer': 'Customer order confirmation',
      'order.created.admin': 'Admin new order alert',
      'order.updated.customer': 'Customer order update',
      'order.invoice.customer': 'Customer invoice email',
      'order.receipt.customer': 'Customer receipt email',
      'billing.payment_received.customer': 'Customer payment received',
      'cart.abandoned.customer': 'Cart recovery',
    },
    refresh: 'Refresh',
    save: 'Save',
    saving: 'Saving notifications...',
    ready: 'Ready',
    notificationsSaved: 'Notifications saved.',
    notificationsRefreshed: 'Notifications refreshed.',
    notificationsRefreshFailed: 'Notifications refresh failed',
    notificationsSaveFailed: 'Notifications save failed',
  },
};

export function getNotificationsCopy(locale: Locale): NotificationsCopy {
  return COPY[locale] ?? COPY.en;
}
