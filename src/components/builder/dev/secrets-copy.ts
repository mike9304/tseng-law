import type { Locale } from '@/lib/locales';

export interface SecretsAdminCopy {
  pageTitle: string;
  pageDescription: string;
  adminTitle: string;
  adminDescription: string;
  refreshLabel: string;
  listTitle: (count: number) => string;
  loadingLabel: string;
  emptyLabel: string;
  keyHeader: string;
  scopeHeader: string;
  allowedFunctionsHeader: string;
  rotatedHeader: string;
  actionsHeader: string;
  scopeSiteLabel: string;
  scopeFunctionLabel: string;
  createTitle: string;
  keyLabel: string;
  keyPlaceholder: string;
  scopeLabel: string;
  valueLabel: string;
  valuePlaceholder: string;
  allowedFunctionsLabel: string;
  allowedFunctionsPlaceholder: string;
  createButtonLabel: string;
  creatingButtonLabel: string;
  createValidationLabel: string;
  rotatePrompt: (key: string) => string;
  revokeConfirm: (key: string) => string;
  rotateButtonLabel: string;
  revokeButtonLabel: string;
  revealTitleCreated: string;
  revealTitleRotated: string;
  revealDescription: string;
  copyLabel: string;
  closeLabel: string;
  revealStatusCreated: string;
  revealStatusRotated: string;
  rowAllowedFunctionsEmpty: string;
  rowAllowedFunctionsUnknown: string;
  rowScopeSite: string;
  rowScopeFunction: string;
  rowSaveFailure: string;
  loadFailureLabel: string;
  unknownErrorLabel: string;
}

const SECRETS_COPY: Record<Locale, SecretsAdminCopy> = {
  ko: {
    pageTitle: '시크릿 관리',
    pageDescription: '서버리스 함수에서 사용하는 암호화된 시크릿을 관리합니다.',
    adminTitle: '시크릿',
    adminDescription: '서버리스 함수에 안전하게 노출할 수 있는 암호화된 환경 변수입니다. 플레인텍스트는 생성·교체 시 단 1회만 표시됩니다.',
    refreshLabel: '새로고침',
    listTitle: (count) => `저장된 시크릿 (${count})`,
    loadingLabel: '불러오는 중…',
    emptyLabel: '아직 등록된 시크릿이 없습니다.',
    keyHeader: '키',
    scopeHeader: '범위',
    allowedFunctionsHeader: '허용 함수',
    rotatedHeader: '최종 교체',
    actionsHeader: '작업',
    scopeSiteLabel: '사이트',
    scopeFunctionLabel: '함수',
    createTitle: '새 시크릿 추가',
    keyLabel: '키',
    keyPlaceholder: '최대 64자 · 관례상 대문자 스네이크 · 예: STRIPE_API_KEY',
    scopeLabel: '범위',
    valueLabel: '값',
    valuePlaceholder: '최대 8192자 · 저장 직후 1회만 표시됩니다',
    allowedFunctionsLabel: '허용 함수 slug (쉼표 구분)',
    allowedFunctionsPlaceholder: '함수 slug · 예: ai-helper, billing-webhook',
    createButtonLabel: '시크릿 추가',
    creatingButtonLabel: '저장 중…',
    createValidationLabel: 'Key와 value 모두 필요합니다.',
    rotatePrompt: (key) => `Rotate ${key} — 새 값을 입력하세요:`,
    revokeConfirm: (key) => `Revoke ${key}? 이 작업은 되돌릴 수 없습니다.`,
    rotateButtonLabel: '교체',
    revokeButtonLabel: '취소',
    revealTitleCreated: '시크릿이 생성되었습니다',
    revealTitleRotated: '시크릿이 교체되었습니다',
    revealDescription: '아래 값을 안전한 곳에 즉시 복사하세요. 이 창을 닫으면 다시 볼 수 없습니다.',
    copyLabel: '클립보드로 복사',
    closeLabel: '닫기',
    revealStatusCreated: '시크릿 생성 완료',
    revealStatusRotated: '시크릿 교체 완료',
    rowAllowedFunctionsEmpty: '—',
    rowAllowedFunctionsUnknown: '—',
    rowScopeSite: '사이트',
    rowScopeFunction: '함수',
    rowSaveFailure: '저장하지 못했습니다.',
    loadFailureLabel: '시크릿 목록을 불러오지 못했습니다.',
    unknownErrorLabel: '알 수 없는 오류가 발생했습니다.',
  },
  'zh-hant': {
    pageTitle: '密鑰管理',
    pageDescription: '管理供無伺服器函式使用的加密密鑰。',
    adminTitle: '密鑰',
    adminDescription: '可安全暴露給無伺服器函式的加密環境變數。明文只會在建立或更換時顯示一次。',
    refreshLabel: '重新整理',
    listTitle: (count) => `已儲存的密鑰（${count}）`,
    loadingLabel: '載入中…',
    emptyLabel: '尚未新增密鑰。',
    keyHeader: '金鑰',
    scopeHeader: '範圍',
    allowedFunctionsHeader: '允許函式',
    rotatedHeader: '最後更換',
    actionsHeader: '操作',
    scopeSiteLabel: '網站',
    scopeFunctionLabel: '函式',
    createTitle: '新增密鑰',
    keyLabel: '金鑰',
    keyPlaceholder: '最多 64 字 · 慣例為大寫蛇形 · 例：STRIPE_API_KEY',
    scopeLabel: '範圍',
    valueLabel: '值',
    valuePlaceholder: '最多 8192 字 · 儲存後只會顯示一次',
    allowedFunctionsLabel: '允許的函式 slug（以逗號分隔）',
    allowedFunctionsPlaceholder: '函式 slug · 例：ai-helper, billing-webhook',
    createButtonLabel: '新增密鑰',
    creatingButtonLabel: '儲存中…',
    createValidationLabel: '金鑰與值都必須填寫。',
    rotatePrompt: (key) => `Rotate ${key} — 請輸入新值：`,
    revokeConfirm: (key) => `要撤銷 ${key} 嗎？此操作無法復原。`,
    rotateButtonLabel: '更換',
    revokeButtonLabel: '撤銷',
    revealTitleCreated: '密鑰已建立',
    revealTitleRotated: '密鑰已更換',
    revealDescription: '請立即將下方內容複製到安全位置。關閉此視窗後將無法再次查看。',
    copyLabel: '複製到剪貼簿',
    closeLabel: '關閉',
    revealStatusCreated: '密鑰建立完成',
    revealStatusRotated: '密鑰更換完成',
    rowAllowedFunctionsEmpty: '—',
    rowAllowedFunctionsUnknown: '—',
    rowScopeSite: '網站',
    rowScopeFunction: '函式',
    rowSaveFailure: '儲存失敗。',
    loadFailureLabel: '無法載入密鑰清單。',
    unknownErrorLabel: '發生未知錯誤。',
  },
  en: {
    pageTitle: 'Secrets admin',
    pageDescription: 'Manage encrypted secrets used by serverless functions.',
    adminTitle: 'Secrets',
    adminDescription: 'Encrypted environment variables safe to expose to serverless functions. Plaintext is shown only once on create or rotate.',
    refreshLabel: 'Refresh',
    listTitle: (count) => `Saved secrets (${count})`,
    loadingLabel: 'Loading…',
    emptyLabel: 'No secrets have been added yet.',
    keyHeader: 'Key',
    scopeHeader: 'Scope',
    allowedFunctionsHeader: 'Allowed functions',
    rotatedHeader: 'Last rotated',
    actionsHeader: 'Actions',
    scopeSiteLabel: 'Site',
    scopeFunctionLabel: 'Function',
    createTitle: 'Add secret',
    keyLabel: 'Key',
    keyPlaceholder: 'Up to 64 chars · uppercase SNAKE_CASE by convention · e.g. STRIPE_API_KEY',
    scopeLabel: 'Scope',
    valueLabel: 'Value',
    valuePlaceholder: 'Up to 8192 chars · shown once right after saving',
    allowedFunctionsLabel: 'Allowed function slugs (comma-separated)',
    allowedFunctionsPlaceholder: 'Function slug · e.g. ai-helper, billing-webhook',
    createButtonLabel: 'Add secret',
    creatingButtonLabel: 'Saving…',
    createValidationLabel: 'Key and value are required.',
    rotatePrompt: (key) => `Rotate ${key} — enter new value:`,
    revokeConfirm: (key) => `Revoke ${key}? This cannot be undone.`,
    rotateButtonLabel: 'Rotate',
    revokeButtonLabel: 'Revoke',
    revealTitleCreated: 'Secret created',
    revealTitleRotated: 'Secret rotated',
    revealDescription: 'Copy the value to a safe place now. You will not be able to see it again after closing this dialog.',
    copyLabel: 'Copy to clipboard',
    closeLabel: 'Close',
    revealStatusCreated: 'Secret created',
    revealStatusRotated: 'Secret rotated',
    rowAllowedFunctionsEmpty: '—',
    rowAllowedFunctionsUnknown: '—',
    rowScopeSite: 'Site',
    rowScopeFunction: 'Function',
    rowSaveFailure: 'Failed to save.',
    loadFailureLabel: 'Failed to load secrets.',
    unknownErrorLabel: 'An unknown error occurred.',
  },
};

export function getSecretsAdminCopy(locale: Locale): SecretsAdminCopy {
  return SECRETS_COPY[locale] ?? SECRETS_COPY.en;
}
