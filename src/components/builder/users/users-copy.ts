import type { BuilderRoleName } from '@/lib/builder/security/user-role-store';
import type { Locale } from '@/lib/locales';

export interface UsersAdminCopy {
  title: string;
  description: string;
  summaryLabel: string;
  eyebrowLabel: string;
  roleIntroLabel: string;
  addTitle: string;
  usernameLabel: string;
  usernamePlaceholder: string;
  roleLabel: string;
  addButtonLabel: string;
  addingButtonLabel: string;
  membersTitle: string;
  allLabel: string;
  addedHeaderLabel: string;
  lastSeenHeaderLabel: string;
  permissionMatrixTitle: string;
  permissionHeaderLabel: string;
  roleLabels: Record<BuilderRoleName, string>;
  yesLabel: string;
  noLabel: string;
  removeLabel: string;
  removingConfirm: (username: string) => string;
  createFailedLabel: string;
  updateFailedLabel: string;
  removeFailedLabel: string;
  addSuccessLabel: string;
  updateSuccessLabel: string;
  removeSuccessLabel: string;
  emptyLabel: string;
}

const USERS_COPY: Record<Locale, UsersAdminCopy> = {
  ko: {
    title: '사용자 및 역할',
    description: '빌더 작업공간의 사용자별 RBAC를 관리합니다.',
    summaryLabel: '사용자 요약',
    eyebrowLabel: '사용자 관리',
    roleIntroLabel: '기본 인증 위에 사용자별 RBAC를 겹쳐서 적용합니다. 현재 역할:',
    addTitle: '사용자 추가',
    usernameLabel: '사용자명',
    usernamePlaceholder: '최대 180자 · 예: attorney.kim',
    roleLabel: '역할',
    addButtonLabel: '추가',
    addingButtonLabel: '추가 중...',
    membersTitle: '사용자',
    allLabel: '전체',
    addedHeaderLabel: '추가일',
    lastSeenHeaderLabel: '최근 접속',
    permissionMatrixTitle: '권한 매트릭스',
    permissionHeaderLabel: '권한',
    roleLabels: {
      owner: '소유자',
      admin: '관리자',
      designer: '디자이너',
      editor: '편집자',
      client: '클라이언트',
    },
    yesLabel: '예',
    noLabel: '아니요',
    removeLabel: '삭제',
    removingConfirm: (username) => `${username} 사용자를 삭제할까요?`,
    createFailedLabel: '사용자를 추가하지 못했습니다.',
    updateFailedLabel: '사용자 역할을 업데이트하지 못했습니다.',
    removeFailedLabel: '사용자를 삭제하지 못했습니다.',
    addSuccessLabel: '사용자를 추가했습니다.',
    updateSuccessLabel: '사용자 역할을 업데이트했습니다.',
    removeSuccessLabel: '사용자를 삭제했습니다.',
    emptyLabel: '표시할 사용자가 없습니다.',
  },
  'zh-hant': {
    title: '使用者與角色',
    description: '管理建構器工作區的每位使用者 RBAC。',
    summaryLabel: '使用者摘要',
    eyebrowLabel: '使用者管理',
    roleIntroLabel: '在基本驗證之上套用每位使用者的 RBAC。當前角色：',
    addTitle: '新增使用者',
    usernameLabel: '使用者名稱',
    usernamePlaceholder: '最多 180 字 · 例：attorney.kim',
    roleLabel: '角色',
    addButtonLabel: '新增',
    addingButtonLabel: '新增中...',
    membersTitle: '使用者',
    allLabel: '全部',
    addedHeaderLabel: '新增日期',
    lastSeenHeaderLabel: '最近登入',
    permissionMatrixTitle: '權限矩陣',
    permissionHeaderLabel: '權限',
    roleLabels: {
      owner: '擁有者',
      admin: '管理員',
      designer: '設計師',
      editor: '編輯者',
      client: '客戶',
    },
    yesLabel: '是',
    noLabel: '否',
    removeLabel: '刪除',
    removingConfirm: (username) => `要刪除 ${username} 嗎？`,
    createFailedLabel: '無法新增使用者。',
    updateFailedLabel: '無法更新使用者角色。',
    removeFailedLabel: '無法刪除使用者。',
    addSuccessLabel: '已新增使用者。',
    updateSuccessLabel: '已更新使用者角色。',
    removeSuccessLabel: '已刪除使用者。',
    emptyLabel: '沒有可顯示的使用者。',
  },
  en: {
    title: 'Builder Users & Roles',
    description: 'Manage per-user RBAC for the builder workspace.',
    summaryLabel: 'User summary',
    eyebrowLabel: 'User admin',
    roleIntroLabel: 'Per-user RBAC overlay on top of basic auth. Acting role:',
    addTitle: 'Add user',
    usernameLabel: 'Username',
    usernamePlaceholder: 'Up to 180 chars · e.g. attorney.kim',
    roleLabel: 'Role',
    addButtonLabel: 'Add',
    addingButtonLabel: 'Adding...',
    membersTitle: 'Users',
    allLabel: 'All',
    addedHeaderLabel: 'Added',
    lastSeenHeaderLabel: 'Last seen',
    permissionMatrixTitle: 'Permission matrix',
    permissionHeaderLabel: 'Permission',
    roleLabels: {
      owner: 'Owner',
      admin: 'Admin',
      designer: 'Designer',
      editor: 'Editor',
      client: 'Client',
    },
    yesLabel: 'yes',
    noLabel: '-',
    removeLabel: 'Remove',
    removingConfirm: (username) => `Remove ${username}?`,
    createFailedLabel: 'Failed to add user.',
    updateFailedLabel: 'Failed to update role.',
    removeFailedLabel: 'Failed to remove user.',
    addSuccessLabel: 'User added.',
    updateSuccessLabel: 'Role updated.',
    removeSuccessLabel: 'User removed.',
    emptyLabel: 'No users to show.',
  },
};

export function getUsersAdminCopy(locale: Locale): UsersAdminCopy {
  return USERS_COPY[locale] ?? USERS_COPY.en;
}
