import { describe, expect, it } from 'vitest';
import { getPageSwitcherCopy } from '../page-switcher-copy';

describe('page switcher copy', () => {
  it('returns localized ko strings', () => {
    const copy = getPageSwitcherCopy('ko');
    expect(copy.drawerTitle).toBe('페이지');
    expect(copy.addPageButtonLabel).toBe('+ 새 페이지');
    expect(copy.clipboardCountLabel(2)).toBe('2개 요소 클립보드');
    expect(copy.homeBadge).toBe('대표');
    expect(copy.publishedTitle).toBe('발행됨');
    expect(copy.draftTitle).toBe('초안');
    expect(copy.unpublishedChangesBadge).toBe('미발행 변경');
    expect(copy.untitled).toBe('제목 없음');
    expect(copy.nestedBadge).toBe('하위');
    expect(copy.pageOrderHandleTitle).toContain('순서를 바꾸세요');
    expect(copy.memberAccessGroup).toBe('회원 권한');
    expect(copy.memberAccessModeLabels.member).toBe('로그인 필요');
    expect(copy.memberAccessRedirectOptions('ko')[0]).toMatchObject({
      value: '/ko/login',
      label: '로그인 페이지',
    });
    expect(copy.slugPromptTitle).toBe('페이지 주소 입력');
    expect(copy.slugPromptTemplateDescription).toBe('선택한 템플릿으로 새 페이지를 생성합니다.');
    expect(copy.addToNavigationLabel).toBe('메뉴에 추가');
    expect(copy.chooseAnotherTemplate).toBe('다른 템플릿 선택');
    expect(copy.missingPageTitle).toBe('페이지 없음');
    expect(copy.missingPageCreateLabel('로그인')).toBe('로그인 페이지 만들기');
    expect(copy.missingPageTitleForSlug('account/profile')).toBe('회원 프로필');
    expect(copy.missingPageTitleForSlug('account/bookings')).toBe('내 예약');
    expect(copy.missingPageTitleForSlug('unknown')).toBe('제목 없음');
    expect(copy.memberStarterEyebrow).toBe('회원 영역');
    expect(copy.memberStarterHeroForSlug('login')).toMatchObject({
      heading: '회원 로그인',
      ctaLabel: '로그인 폼 연결',
    });
    expect(copy.memberStarterHeroForSlug('account/premium')).toMatchObject({
      heading: '프리미엄 멤버십',
      ctaLabel: '프리미엄 상담 연결',
    });
    expect(copy.memberStarterSetupTitle).toBe('다음 설정');
    expect(copy.memberStarterSetupCopy).toContain('멤버 로그인/계정 앱 위젯 배치');
    expect(copy.memberStarterWidgetCopy.loginSubtitle).toContain('로그인 또는 회원가입');
    expect(copy.memberStarterWidgetCopy.accountSubtitle).toContain('프리미엄 영역');
    expect(copy.memberStarterWidgetCopy.profileTitle).toBe('프로필 정보');
    expect(copy.memberStarterWidgetCopy.bookingsSubtitle).toContain('상담 예약');
    expect(copy.memberStarterWidgetCopy.loginLabel).toBe('로그인');
    expect(copy.memberStarterWidgetCopy.signupLabel).toBe('회원가입');
    expect(copy.memberStarterWidgetCopy.saveProfileLabel).toBe('프로필 저장');
    expect(copy.memberStarterWidgetCopy.emptyUpcomingBookingsLabel).toBe('예정된 예약이 없습니다.');
    expect(copy.columnsQuickCountLabel(3)).toBe('게시글 3개');
    expect(copy.columnsQuickEditPostLabel('이민 칼럼')).toBe('수정 · 이민 칼럼');
    expect(copy.dynamicQuickAttorneyDetail).toBe('변호사 상세');
    expect(copy.emptyStateCreateFirst).toBe('첫 페이지 만들기');
    expect(copy.renameRedirectDescription('/ko/old-slug')).toBe('저장 시 /ko/old-slug 에서 새 URL로 이동합니다.');
    expect(copy.redirectWarning('/ko/old', 'duplicate')).toContain('/ko/old redirect는 생성되지 않았습니다.');
    expect(copy.dynamicListPageTitle('attorney-profiles', 'abc')).toBe('변호사 동적 리스트 abc');
    expect(copy.dynamicItemPageTitle('service-areas', 'abc')).toBe('서비스 동적 상세 abc');
    expect(copy.pageOrderSaved).toBe('페이지 순서를 저장했습니다.');
  });

  it('returns localized zh-hant strings', () => {
    const copy = getPageSwitcherCopy('zh-hant');
    expect(copy.drawerTitle).toBe('頁面');
    expect(copy.addPageButtonLabel).toBe('+ 新增');
    expect(copy.clipboardCountLabel(2)).toBe('剪貼簿中有 2 個元素');
    expect(copy.homeBadge).toBe('主頁');
    expect(copy.publishedTitle).toBe('已發佈');
    expect(copy.draftTitle).toBe('草稿');
    expect(copy.unpublishedChangesBadge).toBe('未發佈變更');
    expect(copy.untitled).toBe('未命名');
    expect(copy.nestedBadge).toBe('子頁');
    expect(copy.pageOrderHandleTitle).toContain('調整順序');
    expect(copy.memberAccessGroup).toBe('會員權限');
    expect(copy.memberAccessModeLabels.member).toBe('需要登入');
    expect(copy.memberAccessRedirectOptions('zh-hant')[0]).toMatchObject({
      value: '/zh-hant/login',
      label: '登入頁面',
    });
    expect(copy.memberAccessNoMatchingPages).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/);
    expect(copy.slugPromptDialogLabel).toBe('輸入頁面 slug');
    expect(copy.slugPromptBlankDescription).toBe('建立空白頁面。子頁可使用 parent/child 格式。');
    expect(copy.addToNavigationHint).toBe('建立後立即連結到網站頂部選單。');
    expect(copy.chooseAnotherTemplate).toBe('選擇其他範本');
    expect(copy.missingPageTitle).toBe('找不到頁面');
    expect(copy.missingPageCreateLabel('登入')).toBe('建立「登入」頁面');
    expect(copy.missingPageTitleForSlug('account/profile')).toBe('會員個人資料');
    expect(copy.missingPageTitleForSlug('account/bookings')).toBe('我的預約');
    expect(copy.missingPageTitleForSlug('unknown')).toBe('未命名');
    expect(copy.memberStarterEyebrow).toBe('會員區');
    expect(copy.memberStarterHeroForSlug('account/profile')).toMatchObject({
      heading: '會員個人資料',
      ctaLabel: '連結帳戶儀表板',
    });
    expect(copy.memberStarterHeroForSlug('account/bookings').body).toBe('顯示符合會員信箱的即將到來與過去諮詢預約的起始版面。');
    expect(copy.memberStarterSetupTitle).toBe('下一步設定');
    expect(copy.memberStarterSetupCopy).toContain('會員登入/帳戶應用元件');
    expect(copy.memberStarterWidgetCopy.profileTitle).toBe('個人資料');
    expect(copy.memberStarterWidgetCopy.bookingsSubtitle).toContain('諮詢預約');
    expect(copy.memberStarterWidgetCopy.signupLabel).toBe('建立帳戶');
    expect(copy.memberStarterWidgetCopy.emptyPastBookingsLabel).toBe('目前沒有過去預約。');
    expect(copy.missingPageDescription).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/);
    expect(copy.columnsQuickCountLabel(2)).toBe('2 篇文章');
    expect(copy.columnsQuickEditPostLabel('移民專欄')).toBe('編輯 · 移民專欄');
    expect(copy.dynamicQuickAttorneyDetail).toBe('律師詳細');
    expect([
      copy.fetchPagesError,
      copy.unpublishedChangesBadge,
      copy.drawerTitle,
      copy.addPageButtonLabel,
      copy.pageOrderHandleTitle,
      copy.clipboardCountLabel(2),
      copy.missingPageTitleForSlug('account/profile'),
      copy.missingPageTitleForSlug('account/bookings'),
      copy.missingPageTitleForSlug('unknown'),
      copy.memberStarterEyebrow,
      copy.memberStarterHeroForSlug('account/profile').heading,
      copy.memberStarterHeroForSlug('account/profile').body,
      copy.memberStarterHeroForSlug('account/profile').ctaLabel,
      copy.memberStarterHeroForSlug('account/bookings').body,
      copy.memberStarterSetupTitle,
      copy.memberStarterSetupCopy,
      Object.values(copy.memberStarterWidgetCopy).join(' '),
      copy.renameTitlePlaceholder,
      copy.renameRedirectDescription('/zh-hant/old-slug'),
      copy.renameDynamicRedirectDescription,
      copy.redirectWarning('/zh-hant/old', 'duplicate'),
      copy.createDynamicListPageError,
      copy.dynamicListPageTitle('attorney-profiles', 'abc'),
      copy.dynamicItemPageTitle('service-areas', 'abc'),
      copy.columnsQuickAriaLabel,
      copy.columnsQuickLoading,
      copy.dynamicQuickTitle,
      copy.emptyStateDescription,
    ].join(' ')).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/);
  });

  it('returns localized en member access strings without CJK copy', () => {
    const copy = getPageSwitcherCopy('en');
    const cjk = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/;
    expect(copy.drawerTitle).toBe('Pages');
    expect(copy.addPageButtonLabel).toBe('+ New');
    expect(copy.unpublishedChangesBadge).toBe('Unpublished changes');
    expect(copy.clipboardCountLabel(2)).toBe('2 elements in clipboard');
    expect(copy.pageOrderHandleTitle).toBe('Drag or press ArrowUp/ArrowDown to reorder');
    expect(copy.memberAccessGroup).toBe('Member access');
    expect(copy.memberAccessSettings).toBe('Access settings');
    expect(copy.memberAccessModeLabels.public).toBe('Public');
    expect(copy.memberAccessModeLabels.member).toBe('Login required');
    expect(copy.memberAccessDialogDescription('account/premium')).toBe('Set visibility and failed-access redirect for /account/premium.');
    expect(copy.memberAccessRedirectOptions('en')[1]).toMatchObject({
      value: '/en/account',
      label: 'Account page',
    });
    expect(copy.memberAccessNoMatchingPages).not.toMatch(cjk);
    expect(copy.slugPromptTitle).toBe('Enter Page Path');
    expect(copy.slugPromptTemplateDescription).toBe('Create a new page from the selected template.');
    expect(copy.slugPromptBlankDescription).toBe('Create a blank page. Child pages can use the parent/child format.');
    expect(copy.addToNavigationHint).not.toMatch(cjk);
    expect(copy.creating).toBe('Creating...');
    expect(copy.missingPageTitle).toBe('Page missing');
    expect(copy.missingPageCreateLabel('Login')).toBe('Create Login page');
    expect(copy.missingPageTitleForSlug('account/profile')).toBe('Profile');
    expect(copy.missingPageTitleForSlug('account/bookings')).toBe('Bookings');
    expect(copy.missingPageTitleForSlug('unknown')).toBe('Untitled');
    expect(copy.memberStarterEyebrow).toBe('MEMBER AREA');
    expect(copy.memberStarterHeroForSlug('account/profile')).toMatchObject({
      heading: 'Member profile',
      ctaLabel: 'Connect account dashboard',
    });
    expect(copy.memberStarterHeroForSlug('account/premium')).toMatchObject({
      heading: 'Premium membership',
      ctaLabel: 'Connect premium consult',
    });
    expect(copy.memberStarterSetupTitle).toBe('Next setup');
    expect(copy.memberStarterSetupCopy).toContain('Place the member login/account app widget');
    expect(copy.memberStarterWidgetCopy.profileTitle).toBe('Profile details');
    expect(copy.memberStarterWidgetCopy.bookingsSubtitle).toContain('member email');
    expect(copy.memberStarterWidgetCopy.signupLabel).toBe('Create account');
    expect(copy.memberStarterWidgetCopy.emptyUpcomingBookingsLabel).toBe('No upcoming bookings.');
    expect(copy.missingPageDescription).not.toMatch(cjk);
    expect(copy.columnsQuickCountLabel(4)).toBe('4 posts');
    expect(copy.columnsQuickEditPostLabel('Immigration column')).toBe('Edit - Immigration column');
    expect(copy.dynamicQuickAttorneyDetail).toBe('Attorney detail');
    expect(copy.emptyStateCreateFirst).toBe('Create first page');
    expect([
      copy.fetchPagesError,
      copy.unpublishedChangesBadge,
      copy.drawerTitle,
      copy.addPageButtonLabel,
      copy.pageOrderHandleTitle,
      copy.clipboardCountLabel(2),
      copy.missingPageTitleForSlug('account/profile'),
      copy.missingPageTitleForSlug('account/bookings'),
      copy.missingPageTitleForSlug('unknown'),
      copy.memberStarterEyebrow,
      copy.memberStarterHeroForSlug('account/profile').heading,
      copy.memberStarterHeroForSlug('account/profile').body,
      copy.memberStarterHeroForSlug('account/profile').ctaLabel,
      copy.memberStarterHeroForSlug('account/premium').heading,
      copy.memberStarterSetupTitle,
      copy.memberStarterSetupCopy,
      Object.values(copy.memberStarterWidgetCopy).join(' '),
      copy.renameTitlePlaceholder,
      copy.renameRedirectDescription('/en/old-slug'),
      copy.renameDynamicRedirectDescription,
      copy.redirectWarning('/en/old', 'duplicate'),
      copy.createDynamicListPageError,
      copy.dynamicListPageTitle('attorney-profiles', 'abc'),
      copy.dynamicItemPageTitle('service-areas', 'abc'),
      copy.columnsQuickAriaLabel,
      copy.columnsQuickLoading,
      copy.dynamicQuickTitle,
      copy.dynamicQuickServiceDetail,
      copy.emptyStateDescription,
    ].join(' ')).not.toMatch(cjk);
  });
});
