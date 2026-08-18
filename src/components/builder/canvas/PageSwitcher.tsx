'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { Locale } from '@/lib/locales';
import type { BuilderCanvasDocument, BuilderCanvasNodeStyle } from '@/lib/builder/canvas/types';
import { DECOMPOSABLE_PAGE_SLUGS } from '@/lib/builder/canvas/decomposable-slugs';
import type { BuilderMemberAccessMeta } from '@/lib/builder/site/types';
import TemplateGalleryModal from './TemplateGalleryModal';
import EditorChromeIcon from './EditorChromeIcon';
import {
  FOCUSABLE_SELECTOR,
  filterVisiblePageSwitcherPages,
  pageHasUnpublishedChanges,
  readPageResponseError,
} from './PageSwitcher.helpers';
import { getPageSwitcherCopy, type PageSwitcherCopy } from './page-switcher-copy';
import {
  addButtonStyle,
  clipboardPillStyle,
  columnsQuickActionsStyle,
  columnsQuickButtonStyle,
  columnsQuickCardStyle,
  columnsQuickMetaStyle,
  columnsQuickTitleStyle,
  containerStyle,
  editContainerStyle,
  editHintStyle,
  editInputStyle,
  emptyStateCopyStyle,
  emptyStateStyle,
  emptyStateTitleStyle,
  headerLabelStyle,
  headerStyle,
  homeBadgeStyle,
  menuItemStyle,
  menuGroupLabelStyle,
  memberAccessControlStyle,
  memberAccessBadgeStyle,
  memberAccessDialogActionsStyle,
  memberAccessDialogDescriptionStyle,
  memberAccessDialogHeaderStyle,
  memberAccessDialogOverlayStyle,
  memberAccessDialogPanelStyle,
  memberAccessDialogTitleStyle,
  memberAccessEmptyChoiceStyle,
  memberAccessFieldStyle,
  memberAccessHintStyle,
  memberAccessListboxStyle,
  memberAccessPageChoicePathStyle,
  memberAccessPageChoiceStyle,
  memberAccessPageChoiceTitleStyle,
  memberAccessPagePickerStyle,
  memberAccessPrimaryButtonStyle,
  menuStyle,
  missingPageActionStyle,
  missingPageCardStyle,
  missingPageCopyStyle,
  missingPageTitleStyle,
  pageButtonStyle,
  pageDragHandleStyle,
  pageMetaLineStyle,
  pageMoreButtonStyle,
  pagePrimaryLineStyle,
  pageRowControlIconStyle,
  pageRowStyle,
  slugPromptActionsStyle,
  slugPromptBackButtonStyle,
  slugPromptCancelButtonStyle,
  slugPromptCheckboxStyle,
  slugPromptCreateButtonStyle,
  slugPromptDescriptionStyle,
  slugPromptDialogStyle,
  slugPromptErrorStyle,
  slugPromptInputStyle,
  slugPromptNavigationHintStyle,
  slugPromptNavigationLabelStyle,
  slugPromptNavigationTextStyle,
  slugPromptOverlayStyle,
  slugPromptTitleStyle,
  slugStyle,
  statusDotStyle,
  statusMessageStyle,
  titleTextStyle,
  treeContainerStyle,
  treeLoadingStyle,
  unpublishedChangesBadgeStyle,
  warningMessageStyle,
} from './PageSwitcher.styles';

interface PageMeta {
  pageId: string;
  slug: string;
  locale: Locale;
  title: Record<string, string>;
  isHomePage?: boolean;
  updatedAt?: string;
  publishedAt?: string;
  publishedSavedAt?: string;
  lastPublishedDraftRevision?: number;
  draftSavedAt?: string;
  draftRevision?: number;
  hasUnpublishedChanges?: boolean;
  dynamicList?: {
    collectionId: string;
    targetId: string;
  };
  dynamicItem?: {
    collectionId: string;
    targetId: string;
    defaultRecordSlug: string;
  };
  memberAccess?: BuilderMemberAccessMeta;
}

interface RenamePageResponse {
  ok?: boolean;
  redirectCreated?: boolean;
  redirectWarnings?: Array<{
    from: string;
    to: string;
    message: string;
  }>;
}

type DynamicListPageCollectionId = 'columns' | 'service-areas' | 'attorney-profiles';
type DynamicItemPageCollectionId = DynamicListPageCollectionId | 'attorney-profiles';

interface ColumnQuickSummary {
  loading: boolean;
  total: number | null;
  posts: Array<{ slug: string; title: string }>;
  error: string | null;
}

function parentSlugOf(slug: string): string {
  const segments = slug.split('/').filter(Boolean);
  return segments.slice(0, -1).join('/');
}

function existingParentSlugOf(page: PageMeta, pageBySlug: Map<string, PageMeta>): string {
  const parentSlug = parentSlugOf(page.slug);
  return parentSlug && pageBySlug.has(parentSlug) ? parentSlug : '';
}

function missingPageSlugFromHref(href: string | null | undefined, locale: Locale): string | null {
  const trimmedHref = href?.trim() ?? '';
  if (!trimmedHref || /^(https?:|mailto:|tel:|#)/.test(trimmedHref)) return null;
  const cleanPath = (trimmedHref.split(/[?#]/)[0] ?? '').replace(/^\/+|\/+$/g, '');
  if (!cleanPath) return null;
  const segments = cleanPath.split('/').filter(Boolean);
  if (segments[0] === locale) segments.shift();
  return segments.join('/') || null;
}

function siteScopedQuery(locale: Locale | string, siteId: string): string {
  return new URLSearchParams({ locale, siteId }).toString();
}

const starterBaseStyle: BuilderCanvasNodeStyle = {
  backgroundColor: 'transparent',
  borderColor: '#cbd5e1',
  borderStyle: 'solid',
  borderWidth: 0,
  borderRadius: 14,
  shadowX: 0,
  shadowY: 0,
  shadowBlur: 0,
  shadowSpread: 0,
  shadowColor: 'rgba(15, 23, 42, 0.16)',
  opacity: 100,
};

function starterNodeStyle(overrides: Partial<BuilderCanvasNodeStyle> = {}): BuilderCanvasNodeStyle {
  return {
    ...starterBaseStyle,
    ...overrides,
  };
}

function createMissingMemberPageDocument(
  locale: Locale,
  slug: string,
  title: string,
): BuilderCanvasDocument | null {
  if (
    slug !== 'login'
    && slug !== 'account'
    && slug !== 'account/profile'
    && slug !== 'account/bookings'
    && slug !== 'account/premium'
  ) return null;

  const isLoginPage = slug === 'login';
  const isAccountPage = slug === 'account';
  const isProfilePage = slug === 'account/profile';
  const isBookingsPage = slug === 'account/bookings';
  const nodeSlug = slug.replace(/[^a-z0-9]+/gi, '-');
  const starterCopy = getPageSwitcherCopy(locale);
  const heroCopy = starterCopy.memberStarterHeroForSlug(slug);
  const widgetCopy = starterCopy.memberStarterWidgetCopy;
  const { heading, body, ctaLabel } = heroCopy;
  const sideTitle = starterCopy.memberStarterSetupTitle;
  const sideCopy = starterCopy.memberStarterSetupCopy;
  const hasStarterMemberWidget = isLoginPage || isAccountPage || isProfilePage || isBookingsPage;
  const memberWidgetSubtitle = widgetCopy.loginSubtitle;
  const accountWidgetSubtitle = widgetCopy.accountSubtitle;
  const profileWidgetTitle = widgetCopy.profileTitle;
  const profileWidgetSubtitle = widgetCopy.profileSubtitle;
  const bookingsWidgetSubtitle = widgetCopy.bookingsSubtitle;
  const setupCardRect = isAccountPage
    ? { x: 650, y: 600, width: 482, height: 214 }
    : hasStarterMemberWidget
    ? { x: 96, y: 600, width: 1036, height: 152 }
    : { x: 740, y: 120, width: 392, height: 272 };
  const setupTitleRect = isAccountPage
    ? { x: 686, y: 632, width: 240, height: 34 }
    : hasStarterMemberWidget
    ? { x: 132, y: 630, width: 320, height: 34 }
    : { x: 780, y: 160, width: 312, height: 36 };
  const setupCopyRect = isAccountPage
    ? { x: 686, y: 678, width: 370, height: 86 }
    : hasStarterMemberWidget
    ? { x: 132, y: 676, width: 850, height: 54 }
    : { x: 780, y: 214, width: 312, height: 118 };
  const stageHeight = isAccountPage ? 980 : hasStarterMemberWidget ? 840 : 760;

  return {
    version: 1,
    locale,
    updatedAt: new Date().toISOString(),
    updatedBy: 'member-page-starter',
    stageWidth: 1280,
    stageHeight,
    nodes: [
      {
        id: `${nodeSlug}-hero-bg`,
        kind: 'shape',
        rect: { x: 48, y: 48, width: 1184, height: hasStarterMemberWidget ? 500 : 420 },
        style: starterNodeStyle({
          borderRadius: 28,
          shadowY: 18,
          shadowBlur: 48,
          shadowColor: 'rgba(15, 23, 42, 0.12)',
        }),
        zIndex: 0,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          shape: 'square',
          fill: '#f8fafc',
          stroke: '#dbeafe',
          strokeWidth: 1,
        },
      },
      {
        id: `${nodeSlug}-eyebrow`,
        kind: 'text',
        rect: { x: 96, y: 102, width: 320, height: 32 },
        style: starterNodeStyle(),
        zIndex: 1,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          text: starterCopy.memberStarterEyebrow,
          fontSize: 15,
          color: '#116dff',
          fontWeight: 'bold',
          align: 'left',
          lineHeight: 1.2,
          letterSpacing: 1.6,
          fontFamily: 'system-ui',
        },
      },
      {
        id: `${nodeSlug}-headline`,
        kind: 'text',
        rect: { x: 96, y: 146, width: 520, height: 88 },
        style: starterNodeStyle(),
        zIndex: 2,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          text: heading,
          fontSize: 44,
          color: '#0f172a',
          fontWeight: 'bold',
          align: 'left',
          lineHeight: 1.08,
          letterSpacing: 0,
          fontFamily: 'system-ui',
        },
      },
      {
        id: `${nodeSlug}-body`,
        kind: 'text',
        rect: { x: 96, y: 252, width: 520, height: 86 },
        style: starterNodeStyle(),
        zIndex: 3,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          text: body,
          fontSize: 18,
          color: '#475569',
          fontWeight: 'regular',
          align: 'left',
          lineHeight: 1.45,
          letterSpacing: 0,
          fontFamily: 'system-ui',
        },
      },
      {
        id: `${nodeSlug}-cta`,
        kind: 'button',
        rect: { x: 96, y: 370, width: 220, height: 54 },
        style: starterNodeStyle({
          borderRadius: 999,
          shadowY: 14,
          shadowBlur: 30,
          shadowColor: 'rgba(17, 109, 255, 0.24)',
        }),
        zIndex: 4,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          label: ctaLabel,
          href: isLoginPage || isProfilePage || isBookingsPage ? `/${locale}/account` : `/${locale}/contact`,
          style: 'primary',
        },
      },
      ...(isLoginPage ? [{
        id: `${nodeSlug}-member-login-widget`,
        kind: 'member-login' as const,
        rect: { x: 720, y: 88, width: 430, height: 428 },
        style: starterNodeStyle({
          borderRadius: 24,
          shadowY: 16,
          shadowBlur: 44,
          shadowColor: 'rgba(15, 23, 42, 0.16)',
        }),
        zIndex: 5,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          title: heading,
          subtitle: memberWidgetSubtitle,
          defaultMode: 'login' as const,
          showSignup: false,
          nextPath: `/${locale}/account`,
          loginLabel: widgetCopy.loginLabel,
          signupLabel: '',
        },
      }] : []),
      ...(isAccountPage ? [{
        id: `${nodeSlug}-member-account-summary-widget`,
        kind: 'member-account-summary' as const,
        rect: { x: 720, y: 96, width: 430, height: 410 },
        style: starterNodeStyle({
          borderRadius: 24,
          shadowY: 16,
          shadowBlur: 44,
          shadowColor: 'rgba(15, 23, 42, 0.16)',
        }),
        zIndex: 5,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          title: heading,
          subtitle: accountWidgetSubtitle,
          profileLabel: widgetCopy.profileLabel,
          bookingsLabel: widgetCopy.bookingsLabel,
          premiumLabel: widgetCopy.premiumLabel,
          loginLabel: widgetCopy.loginLabel,
          profileHref: `/${locale}/account/profile`,
          bookingsHref: `/${locale}/account/bookings`,
          premiumHref: `/${locale}/account/premium`,
          loginHref: `/${locale}/login?next=/${locale}/account`,
          showBookings: true,
          showPremium: true,
        },
      }] : []),
      ...(isAccountPage || isProfilePage ? [{
        id: `${nodeSlug}-member-profile-form-widget`,
        kind: 'member-profile-form' as const,
        rect: isAccountPage
          ? { x: 96, y: 588, width: 500, height: 340 }
          : { x: 720, y: 88, width: 430, height: 428 },
        style: starterNodeStyle({
          borderRadius: 24,
          shadowY: 16,
          shadowBlur: 44,
          shadowColor: 'rgba(15, 23, 42, 0.16)',
        }),
        zIndex: 5,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          title: isProfilePage ? heading : profileWidgetTitle,
          subtitle: profileWidgetSubtitle,
          nameLabel: widgetCopy.nameLabel,
          phoneLabel: widgetCopy.phoneLabel,
          saveLabel: widgetCopy.saveProfileLabel,
          savingLabel: widgetCopy.savingLabel,
          savedLabel: widgetCopy.savedLabel,
          loginLabel: widgetCopy.loginLabel,
          loginHref: `/${locale}/login?next=/${locale}/${isProfilePage ? 'account/profile' : 'account'}`,
        },
      }] : []),
      ...(isBookingsPage ? [{
        id: `${nodeSlug}-member-bookings-list-widget`,
        kind: 'member-bookings-list' as const,
        rect: { x: 720, y: 88, width: 430, height: 428 },
        style: starterNodeStyle({
          borderRadius: 24,
          shadowY: 16,
          shadowBlur: 44,
          shadowColor: 'rgba(15, 23, 42, 0.16)',
        }),
        zIndex: 5,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          title: heading,
          subtitle: bookingsWidgetSubtitle,
          upcomingLabel: widgetCopy.upcomingBookingsLabel,
          pastLabel: widgetCopy.pastBookingsLabel,
          emptyUpcomingLabel: widgetCopy.emptyUpcomingBookingsLabel,
          emptyPastLabel: widgetCopy.emptyPastBookingsLabel,
          loginLabel: widgetCopy.loginLabel,
          loginHref: `/${locale}/login?next=/${locale}/account/bookings`,
          showPast: true,
        },
      }] : []),
      {
        id: `${nodeSlug}-setup-card`,
        kind: 'shape',
        rect: setupCardRect,
        style: starterNodeStyle({
          borderRadius: 24,
          shadowY: 12,
          shadowBlur: 34,
          shadowColor: 'rgba(15, 23, 42, 0.1)',
        }),
        zIndex: 5,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          shape: 'square',
          fill: '#ffffff',
          stroke: '#e2e8f0',
          strokeWidth: 1,
        },
      },
      {
        id: `${nodeSlug}-setup-title`,
        kind: 'text',
        rect: setupTitleRect,
        style: starterNodeStyle(),
        zIndex: 6,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          text: sideTitle,
          fontSize: 22,
          color: '#0f172a',
          fontWeight: 'bold',
          align: 'left',
          lineHeight: 1.2,
          letterSpacing: 0,
          fontFamily: 'system-ui',
        },
      },
      {
        id: `${nodeSlug}-setup-copy`,
        kind: 'text',
        rect: setupCopyRect,
        style: starterNodeStyle(),
        zIndex: 7,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          text: sideCopy,
          fontSize: 16,
          color: '#334155',
          fontWeight: 'regular',
          align: 'left',
          lineHeight: 1.48,
          letterSpacing: 0,
          fontFamily: 'system-ui',
        },
      },
      {
        id: `${nodeSlug}-page-label`,
        kind: 'text',
        rect: { x: 96, y: 516, width: 480, height: 42 },
        style: starterNodeStyle(),
        zIndex: 8,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          text: `/${slug} - ${title}`,
          fontSize: 18,
          color: '#64748b',
          fontWeight: 'medium',
          align: 'left',
          lineHeight: 1.25,
          letterSpacing: 0,
          fontFamily: 'system-ui',
        },
      },
    ],
  };
}

function memberAccessForMissingPage(slug: string): BuilderMemberAccessMeta | null {
  if (slug === 'account' || slug === 'account/profile' || slug === 'account/bookings') {
    return { requireLogin: true };
  }
  if (slug === 'account/premium') {
    return { requireLogin: true, allowedRoles: ['premium', 'admin'] };
  }
  return null;
}

type MemberAccessMode = 'public' | 'member' | 'premium';

function memberAccessModeForPage(page: PageMeta): MemberAccessMode {
  if (!page.memberAccess?.requireLogin) return 'public';
  const roles = page.memberAccess.allowedRoles ?? [];
  return roles.includes('premium') || roles.includes('admin') ? 'premium' : 'member';
}

function memberAccessLabelForMode(mode: MemberAccessMode, copy: PageSwitcherCopy): string | null {
  if (mode === 'member') return copy.memberAccessBadgeLabels.member;
  if (mode === 'premium') return copy.memberAccessBadgeLabels.premium;
  return null;
}

function memberAccessPayloadForMode(
  mode: MemberAccessMode,
  redirectPath = '',
): BuilderMemberAccessMeta | null {
  const trimmedRedirectPath = redirectPath.trim();
  const redirect = trimmedRedirectPath.startsWith('/') ? { redirectPath: trimmedRedirectPath } : {};
  if (mode === 'member') return { requireLogin: true, ...redirect };
  if (mode === 'premium') return { requireLogin: true, allowedRoles: ['premium', 'admin'], ...redirect };
  return null;
}

function buildMemberAccessRedirectOptions(locale: Locale, copy: PageSwitcherCopy): Array<{ value: string; label: string }> {
  return copy.memberAccessRedirectOptions(locale);
}

function pageRedirectPathForMemberAccess(page: PageMeta, locale: Locale): string {
  const slug = page.slug.trim().replace(/^\/+|\/+$/g, '');
  return slug ? `/${locale}/${slug}` : `/${locale}`;
}

function findDisplaySubtreeEnd(displayPages: PageMeta[], startIndex: number): number {
  const rootSlug = displayPages[startIndex]?.slug;
  if (!rootSlug) return startIndex;
  let endIndex = startIndex;
  while (
    endIndex + 1 < displayPages.length
    && displayPages[endIndex + 1].slug.startsWith(`${rootSlug}/`)
  ) {
    endIndex += 1;
  }
  return endIndex;
}

function reorderDisplayPages(
  displayPages: PageMeta[],
  pageId: string,
  direction: -1 | 1,
): PageMeta[] | null {
  const startIndex = displayPages.findIndex((page) => page.pageId === pageId);
  if (startIndex < 0) return null;
  const pageBySlug = new Map(displayPages.map((page) => [page.slug, page]));
  const selectedParentSlug = existingParentSlugOf(displayPages[startIndex], pageBySlug);
  const endIndex = findDisplaySubtreeEnd(displayPages, startIndex);

  if (direction < 0) {
    let previousStartIndex = -1;
    for (let index = startIndex - 1; index >= 0; index -= 1) {
      if (existingParentSlugOf(displayPages[index], pageBySlug) === selectedParentSlug) {
        previousStartIndex = index;
        break;
      }
    }
    if (previousStartIndex < 0) return null;
    const previousEndIndex = findDisplaySubtreeEnd(displayPages, previousStartIndex);
    if (previousEndIndex !== startIndex - 1) return null;
    return [
      ...displayPages.slice(0, previousStartIndex),
      ...displayPages.slice(startIndex, endIndex + 1),
      ...displayPages.slice(previousStartIndex, startIndex),
      ...displayPages.slice(endIndex + 1),
    ];
  }

  const nextStartIndex = endIndex + 1;
  if (nextStartIndex >= displayPages.length) return null;
  if (existingParentSlugOf(displayPages[nextStartIndex], pageBySlug) !== selectedParentSlug) return null;
  const nextEndIndex = findDisplaySubtreeEnd(displayPages, nextStartIndex);
  return [
    ...displayPages.slice(0, startIndex),
    ...displayPages.slice(nextStartIndex, nextEndIndex + 1),
    ...displayPages.slice(startIndex, endIndex + 1),
    ...displayPages.slice(nextEndIndex + 1),
  ];
}

function reorderDisplayPagesBeforeTarget(
  displayPages: PageMeta[],
  draggedPageId: string,
  targetPageId: string,
): PageMeta[] | null {
  if (draggedPageId === targetPageId) return null;
  const startIndex = displayPages.findIndex((page) => page.pageId === draggedPageId);
  const targetIndex = displayPages.findIndex((page) => page.pageId === targetPageId);
  if (startIndex < 0 || targetIndex < 0) return null;
  const endIndex = findDisplaySubtreeEnd(displayPages, startIndex);
  if (targetIndex >= startIndex && targetIndex <= endIndex) return null;

  const pageBySlug = new Map(displayPages.map((page) => [page.slug, page]));
  const draggedParentSlug = existingParentSlugOf(displayPages[startIndex], pageBySlug);
  const targetParentSlug = existingParentSlugOf(displayPages[targetIndex], pageBySlug);
  if (draggedParentSlug !== targetParentSlug) return null;

  const movingPages = displayPages.slice(startIndex, endIndex + 1);
  const remainingPages = [
    ...displayPages.slice(0, startIndex),
    ...displayPages.slice(endIndex + 1),
  ];
  const nextTargetIndex = remainingPages.findIndex((page) => page.pageId === targetPageId);
  if (nextTargetIndex < 0) return null;
  return [
    ...remainingPages.slice(0, nextTargetIndex),
    ...movingPages,
    ...remainingPages.slice(nextTargetIndex),
  ];
}

function sortPagesForDisplay(pages: PageMeta[]): PageMeta[] {
  const pageBySlug = new Map(pages.map((page) => [page.slug, page]));
  const childrenByParent = new Map<string, PageMeta[]>();
  const topLevelPages: PageMeta[] = [];

  for (const page of pages) {
    const parentSlug = parentSlugOf(page.slug);
    if (parentSlug && pageBySlug.has(parentSlug)) {
      const siblings = childrenByParent.get(parentSlug) ?? [];
      siblings.push(page);
      childrenByParent.set(parentSlug, siblings);
    } else {
      topLevelPages.push(page);
    }
  }

  const ordered: PageMeta[] = [];
  const visited = new Set<string>();
  const appendPage = (page: PageMeta) => {
    if (visited.has(page.pageId)) return;
    visited.add(page.pageId);
    ordered.push(page);
    for (const child of childrenByParent.get(page.slug) ?? []) {
      appendPage(child);
    }
  };

  for (const page of topLevelPages) appendPage(page);
  for (const page of pages) appendPage(page);
  return ordered;
}

export default function PageSwitcher({
  locale,
  siteId,
  activePageId,
  clipboardCount = 0,
  columnPostsSummary,
  templateGalleryInitialSearch = '',
  templateGalleryRequestId,
  missingPageHref,
  onSelectPage,
  onPagesChange,
  onMissingPageHandled,
  onToast,
}: {
  locale: Locale;
  siteId: string;
  activePageId: string | null;
  clipboardCount?: number;
  columnPostsSummary?: ColumnQuickSummary;
  templateGalleryInitialSearch?: string;
  templateGalleryRequestId?: number;
  missingPageHref?: string | null;
  onSelectPage: (pageId: string, nextSlug?: string) => void;
  onPagesChange?: (pages: PageMeta[]) => void;
  onMissingPageHandled?: () => void;
  onToast?: (message: string, tone: 'success' | 'error') => void;
}) {
  const [pages, setPages] = useState<PageMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [templateGalleryOpenSearch, setTemplateGalleryOpenSearch] = useState(templateGalleryInitialSearch.trim());
  const [templateGalleryLastSearch, setTemplateGalleryLastSearch] = useState(templateGalleryInitialSearch.trim());
  const [pendingTemplate, setPendingTemplate] = useState<BuilderCanvasDocument | null | undefined>(undefined);
  const [pendingTemplateName, setPendingTemplateName] = useState<string | null>(null);
  const [slugInput, setSlugInput] = useState('');
  const [addToNavigation, setAddToNavigation] = useState(true);
  const [showSlugPrompt, setShowSlugPrompt] = useState(false);
  const [hoveredPageId, setHoveredPageId] = useState<string | null>(null);
  const [openMenuPageId, setOpenMenuPageId] = useState<string | null>(null);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingSlug, setEditingSlug] = useState('');
  const [editingCreateRedirect, setEditingCreateRedirect] = useState(true);
  const [memberAccessEditingPageId, setMemberAccessEditingPageId] = useState<string | null>(null);
  const [memberAccessModeDraft, setMemberAccessModeDraft] = useState<MemberAccessMode>('public');
  const [memberAccessRedirectDraft, setMemberAccessRedirectDraft] = useState(`/${locale}/login`);
  const [memberAccessPageQuery, setMemberAccessPageQuery] = useState('');
  const [submittingPageId, setSubmittingPageId] = useState<string | null>(null);
  const [orderingPageId, setOrderingPageId] = useState<string | null>(null);
  const [draggingPageId, setDraggingPageId] = useState<string | null>(null);
  const [dragTargetPageId, setDragTargetPageId] = useState<string | null>(null);
  const [orderStatusMessage, setOrderStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const copy = useMemo(() => getPageSwitcherCopy(locale), [locale]);
  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const slugPromptRef = useRef<HTMLDivElement | null>(null);
  const slugPromptRestoreFocusRef = useRef<HTMLElement | null>(null);
  const slugPromptClosingRef = useRef(false);
  const pageOrderRequestInFlightRef = useRef(false);
  const columnsPage = pages.find((page) => page.slug === 'columns') ?? null;
  const visiblePages = useMemo(() => filterVisiblePageSwitcherPages(pages), [pages]);
  const displayPages = useMemo(() => sortPagesForDisplay(visiblePages), [visiblePages]);
  const memberAccessEditingPage = memberAccessEditingPageId
    ? pages.find((page) => page.pageId === memberAccessEditingPageId) ?? null
    : null;
  const memberAccessRedirectChoices = useMemo(
    () => buildMemberAccessRedirectOptions(locale, copy),
    [copy, locale],
  );
  const memberAccessPageChoices = useMemo(() => {
    const query = memberAccessPageQuery.trim().toLowerCase();
    return displayPages
      .filter((page) => page.pageId !== memberAccessEditingPageId)
      .filter((page) => {
        if (!query) return true;
        const title = page.title[page.locale] || page.title[locale] || page.title.ko || copy.untitled;
        const path = pageRedirectPathForMemberAccess(page, locale);
        return `${title} ${page.slug} ${path}`.toLowerCase().includes(query);
      })
      .slice(0, 6);
  }, [copy.untitled, displayPages, locale, memberAccessEditingPageId, memberAccessPageQuery]);
  const missingPageSlug = useMemo(
    () => missingPageSlugFromHref(missingPageHref, locale),
    [locale, missingPageHref],
  );
  const missingPageTitle = useMemo(
    () => (missingPageSlug ? copy.missingPageTitleForSlug(missingPageSlug) : null),
    [copy, missingPageSlug],
  );

  const fetchPages = useCallback(async (): Promise<PageMeta[]> => {
    try {
      const response = await fetch(`/api/builder/site/pages?${siteScopedQuery(locale, siteId)}`, {
        credentials: 'same-origin',
      });
      if (response.ok) {
        const data = (await response.json()) as { pages: PageMeta[] };
        setPages(data.pages);
        onPagesChange?.(data.pages);
        return data.pages;
      }
      setErrorMessage(copy.fetchPagesError);
      onToast?.(copy.networkErrorToast, 'error');
    } catch {
      setErrorMessage(copy.fetchPagesError);
      onToast?.(copy.networkErrorToast, 'error');
    } finally {
      setLoading(false);
    }
    return [];
  }, [copy.fetchPagesError, copy.networkErrorToast, locale, onPagesChange, onToast, siteId]);

  useEffect(() => {
    void fetchPages();
  }, [fetchPages]);

  useEffect(() => {
    if (!editingPageId) return;
    window.setTimeout(() => titleInputRef.current?.focus(), 0);
  }, [editingPageId]);

  const openTemplateGallery = useCallback((search = '') => {
    const normalizedSearch = search.trim();
    setTemplateGalleryOpenSearch(normalizedSearch);
    setTemplateGalleryLastSearch(normalizedSearch);
    setShowGallery(true);
  }, []);

  const openChildPagePrompt = useCallback((parentPage: PageMeta) => {
    const parentSlug = parentPage.slug.trim().replace(/^\/+|\/+$/g, '');
    if (!parentSlug) return;
    setPendingTemplate(undefined);
    setPendingTemplateName(null);
    setSlugInput(`${parentSlug}/child-page`);
    setAddToNavigation(false);
    setShowGallery(false);
    setShowSlugPrompt(true);
    setOpenMenuPageId(null);
    setErrorMessage(null);
    setWarningMessage(null);
  }, []);

  const handleTemplateGallerySearchChange = useCallback((query: string) => {
    setTemplateGalleryLastSearch(query.trim());
  }, []);

  useEffect(() => {
    if (!templateGalleryRequestId) return;
    openTemplateGallery(templateGalleryInitialSearch);
  }, [openTemplateGallery, templateGalleryInitialSearch, templateGalleryRequestId]);

  useEffect(() => {
    if (!openMenuPageId) return;
    const handleWindowClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-page-switcher-menu]')) {
        setOpenMenuPageId(null);
      }
    };
    window.addEventListener('click', handleWindowClick, true);
    return () => window.removeEventListener('click', handleWindowClick, true);
  }, [openMenuPageId]);

  const clearPendingTemplate = () => {
    setPendingTemplate(undefined);
    setPendingTemplateName(null);
  };

  const closeSlugPrompt = useCallback(() => {
    setShowSlugPrompt(false);
    clearPendingTemplate();
    setAddToNavigation(true);
  }, []);

  const handleTemplateSelect = (templateDocument: BuilderCanvasDocument | null, templateName?: string) => {
    setPendingTemplate(templateDocument);
    setPendingTemplateName(templateName?.trim() || null);
    setSlugInput('');
    setAddToNavigation(true);
    setShowGallery(false);
    setShowSlugPrompt(true);
  };

  useLayoutEffect(() => {
    if (!showSlugPrompt) return undefined;
    slugPromptClosingRef.current = false;
    slugPromptRestoreFocusRef.current = (document.activeElement as HTMLElement | null) ?? null;
    const dialog = slugPromptRef.current;
    if (dialog) {
      const focusables = dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      (focusables[0] ?? dialog).focus({ preventScroll: true });
    }
    return () => {
      slugPromptClosingRef.current = true;
      const previous = slugPromptRestoreFocusRef.current;
      if (!previous || typeof previous.focus !== 'function') return;
      try {
        previous.focus({ preventScroll: true });
      } catch {
        // Ignore detached focus targets.
      }
    };
  }, [showSlugPrompt]);

  useEffect(() => {
    if (!showSlugPrompt) return undefined;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        closeSlugPrompt();
        return;
      }
      if (event.key !== 'Tab') return;
      const dialog = slugPromptRef.current;
      if (!dialog) return;
      const focusables = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
        .filter((node) => !node.hasAttribute('disabled') && node.tabIndex !== -1);
      if (focusables.length === 0) {
        event.preventDefault();
        dialog.focus({ preventScroll: true });
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (event.shiftKey) {
        if (active === first || active === dialog) {
          event.preventDefault();
          last.focus({ preventScroll: true });
        }
        return;
      }
      if (active === last) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    }
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [closeSlugPrompt, showSlugPrompt]);

  useEffect(() => {
    if (!showSlugPrompt) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showSlugPrompt]);

  useEffect(() => {
    if (!showSlugPrompt) return undefined;
    function handleFocusIn(event: FocusEvent) {
      if (slugPromptClosingRef.current) return;
      const dialog = slugPromptRef.current;
      if (!dialog || !event.target || dialog.contains(event.target as Node)) return;
      event.preventDefault();
      event.stopPropagation();
      const focusables = dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      (focusables[0] ?? dialog).focus({ preventScroll: true });
    }
    document.addEventListener('focusin', handleFocusIn);
    return () => document.removeEventListener('focusin', handleFocusIn);
  }, [showSlugPrompt]);

  const handleCreatePage = async () => {
    if (creating) return;
    const slug = slugInput.trim().replace(/^\/+|\/+$/g, '') || `page-${Date.now().toString(36)}`;
    setCreating(true);
    setErrorMessage(null);
    try {
      const response = await fetch(`/api/builder/site/pages?${siteScopedQuery(locale, siteId)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          siteId,
          locale,
          slug,
          title: pendingTemplateName ?? slug,
          addToNavigation,
          ...(pendingTemplate ? { document: pendingTemplate } : { blank: true }),
        }),
      });
      if (response.ok) {
        const data = (await response.json()) as { pageId?: string; page?: PageMeta };
        const nextPageId = data.pageId ?? data.page?.pageId ?? null;
        if (!nextPageId) {
          setErrorMessage(copy.createPageError);
          setShowSlugPrompt(true);
          return;
        }
        await fetchPages();
        setShowSlugPrompt(false);
        clearPendingTemplate();
        setSlugInput('');
        setAddToNavigation(true);
        onSelectPage(nextPageId, data.page?.slug);
      } else {
        setErrorMessage(await readPageResponseError(response, copy.createPageError));
        setShowSlugPrompt(true);
      }
    } catch {
      setErrorMessage(copy.createPageError);
      setShowSlugPrompt(true);
    } finally {
      setCreating(false);
    }
  };

  const handleCreateMissingPage = async () => {
    if (creating || !missingPageSlug || !missingPageTitle) return;
    setCreating(true);
    setErrorMessage(null);
    const starterDocument = createMissingMemberPageDocument(locale, missingPageSlug, missingPageTitle);
    const memberAccess = memberAccessForMissingPage(missingPageSlug);
    try {
      const response = await fetch(`/api/builder/site/pages?${siteScopedQuery(locale, siteId)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          siteId,
          locale,
          slug: missingPageSlug,
          title: missingPageTitle,
          addToNavigation: false,
          ...(memberAccess ? { memberAccess } : {}),
          ...(starterDocument ? { document: starterDocument } : { blank: true }),
        }),
      });
      if (!response.ok) {
        setErrorMessage(await readPageResponseError(response, copy.createMissingPageError));
        return;
      }
      const data = (await response.json()) as { success?: boolean; pageId?: string; page?: PageMeta; error?: string };
      const nextPageId = data.pageId ?? data.page?.pageId ?? null;
      if (!data.success || !nextPageId) {
        setErrorMessage(data.error || copy.createMissingPageError);
        return;
      }
      await fetchPages();
      onMissingPageHandled?.();
      onSelectPage(nextPageId, data.page?.slug ?? missingPageSlug);
    } catch {
      setErrorMessage(copy.createMissingPageError);
    } finally {
      setCreating(false);
    }
  };

  const handleCreateDynamicListPage = async (collectionId: DynamicListPageCollectionId) => {
    if (creating) return;
    const token = Date.now().toString(36);
    const isColumns = collectionId === 'columns';
    const isLawyers = collectionId === 'attorney-profiles';
    const slug = `${isColumns ? 'columns-list' : isLawyers ? 'lawyers-list' : 'services-list'}-${token}`;
    setCreating(true);
    setErrorMessage(null);
    try {
      const response = await fetch(`/api/builder/site/pages?${siteScopedQuery(locale, siteId)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          siteId,
          locale,
          slug,
          title: copy.dynamicListPageTitle(collectionId, token),
          addToNavigation: false,
          dynamicListCollectionId: collectionId,
          dynamicListLimit: isColumns ? 4 : isLawyers ? 3 : 6,
        }),
      });
      if (!response.ok) {
        setErrorMessage(await readPageResponseError(response, copy.createDynamicListPageError));
        return;
      }
      const data = (await response.json()) as { success?: boolean; pageId?: string; page?: PageMeta; error?: string };
      const nextPageId = data.pageId ?? data.page?.pageId ?? null;
      if (!data.success || !nextPageId) {
        setErrorMessage(data.error || copy.createDynamicListPageError);
        return;
      }
      await fetchPages();
      onSelectPage(nextPageId, data.page?.slug ?? slug);
    } catch {
      setErrorMessage(copy.createDynamicListPageError);
    } finally {
      setCreating(false);
    }
  };

  const handleCreateDynamicItemPage = async (collectionId: DynamicItemPageCollectionId) => {
    if (creating) return;
    const token = Date.now().toString(36);
    const isColumns = collectionId === 'columns';
    const isLawyers = collectionId === 'attorney-profiles';
    const slug = `${isColumns ? 'columns-item' : isLawyers ? 'lawyers-item' : 'services-item'}-${token}`;
    setCreating(true);
    setErrorMessage(null);
    try {
      const response = await fetch(`/api/builder/site/pages?${siteScopedQuery(locale, siteId)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          siteId,
          locale,
          slug,
          title: copy.dynamicItemPageTitle(collectionId, token),
          addToNavigation: false,
          dynamicItemCollectionId: collectionId,
        }),
      });
      if (!response.ok) {
        setErrorMessage(await readPageResponseError(response, copy.createDynamicItemPageError));
        return;
      }
      const data = (await response.json()) as { success?: boolean; pageId?: string; page?: PageMeta; error?: string };
      const nextPageId = data.pageId ?? data.page?.pageId ?? null;
      if (!data.success || !nextPageId) {
        setErrorMessage(data.error || copy.createDynamicItemPageError);
        return;
      }
      await fetchPages();
      onSelectPage(nextPageId, data.page?.slug ?? slug);
    } catch {
      setErrorMessage(copy.createDynamicItemPageError);
    } finally {
      setCreating(false);
    }
  };

  const startRename = (page: PageMeta) => {
    setEditingPageId(page.pageId);
    setEditingTitle(page.title[page.locale] || page.title[locale] || page.title.ko || page.slug || '');
    setEditingSlug(page.slug);
    setEditingCreateRedirect(true);
    setOpenMenuPageId(null);
    setErrorMessage(null);
    setWarningMessage(null);
  };

  const cancelRename = () => {
    setEditingPageId(null);
    setEditingTitle('');
    setEditingSlug('');
    setEditingCreateRedirect(true);
  };

  const handleRename = async (page: PageMeta) => {
    const nextTitle = editingTitle.trim();
    const nextSlug = editingSlug.trim().replace(/^\/+|\/+$/g, '');
    if (!nextTitle) {
      setErrorMessage(copy.pageTitleRequiredError);
      return;
    }

    setSubmittingPageId(page.pageId);
    setErrorMessage(null);
    setWarningMessage(null);
    try {
      const response = await fetch(
        `/api/builder/site/pages/${page.pageId}?${siteScopedQuery(page.locale, siteId)}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({
            siteId,
            title: nextTitle,
            slug: nextSlug,
            createRedirect: !page.isHomePage && page.slug !== nextSlug && editingCreateRedirect,
          }),
        },
      );
      if (!response.ok) {
        setErrorMessage(await readPageResponseError(response, copy.savePageNameError));
        return;
      }
      const result = await response.json() as RenamePageResponse;

      await fetchPages();
      cancelRename();
      if (result.redirectWarnings?.length) {
        const warning = result.redirectWarnings[0];
        setWarningMessage(copy.redirectWarning(warning.from, warning.message));
      }
    } catch {
      setErrorMessage(copy.savePageNameError);
    } finally {
      setSubmittingPageId(null);
    }
  };

  // Standard pages seeded as live-reflecting `composite` nodes. "Decompose to
  // edit" swaps the page draft for its editable node tree via the decompose API
  // so the designer can edit it element-by-element.
  // Pages are seeded as live-matching `composite` nodes; "decompose to edit"
  // converts a page to an editable node tree when canvas editing is needed. The
  // slug list is shared with the server seed (STANDARD_PAGE_DECOMPOSERS) via
  // decomposable-slugs.ts to avoid drift.
  const DECOMPOSABLE_SLUGS = new Set<string>(DECOMPOSABLE_PAGE_SLUGS);

  const handleDecomposeToEdit = async (page: PageMeta) => {
    if (submittingPageId) return;
    const decomposeError =
      page.locale === 'zh-hant'
        ? '頁面拆解失敗。'
        : page.locale === 'en'
          ? 'Failed to decompose the page for editing.'
          : '페이지 분해에 실패했습니다.';
    setSubmittingPageId(page.pageId);
    setOpenMenuPageId(null);
    setErrorMessage(null);
    try {
      const response = await fetch(
        `/api/builder/site/pages/decompose?${siteScopedQuery(page.locale, siteId)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ siteId, slug: page.slug, locale: page.locale }),
        },
      );
      if (!response.ok) {
        setErrorMessage(await readPageResponseError(response, decomposeError));
        return;
      }
      await fetchPages();
      onSelectPage(page.pageId, page.slug);
    } catch {
      setErrorMessage(decomposeError);
    } finally {
      setSubmittingPageId(null);
    }
  };

  const handleDelete = async (page: PageMeta) => {
    if (page.isHomePage) return;
    const confirmed = window.confirm(copy.deleteConfirm);
    if (!confirmed) return;

    setSubmittingPageId(page.pageId);
    setOpenMenuPageId(null);
    setErrorMessage(null);
    try {
      const response = await fetch(
        `/api/builder/site/pages/${page.pageId}?${siteScopedQuery(page.locale, siteId)}`,
        {
          method: 'DELETE',
          credentials: 'same-origin',
        },
      );
      if (!response.ok) {
        setErrorMessage(await readPageResponseError(response, copy.deletePageError));
        return;
      }

      const nextPages = await fetchPages();
      if (page.pageId === activePageId && nextPages.length > 0) {
        onSelectPage(nextPages[0].pageId, nextPages[0].slug);
      }
    } catch {
      setErrorMessage(copy.deletePageError);
    } finally {
      setSubmittingPageId(null);
    }
  };

  const openMemberAccessSettings = (page: PageMeta) => {
    setMemberAccessEditingPageId(page.pageId);
    setMemberAccessModeDraft(memberAccessModeForPage(page));
    setMemberAccessRedirectDraft(page.memberAccess?.redirectPath || `/${locale}/login`);
    setMemberAccessPageQuery('');
    setOpenMenuPageId(null);
    setErrorMessage(null);
    setWarningMessage(null);
  };

  const closeMemberAccessSettings = () => {
    setMemberAccessEditingPageId(null);
    setMemberAccessModeDraft('public');
    setMemberAccessRedirectDraft(`/${locale}/login`);
    setMemberAccessPageQuery('');
  };

  const handleUpdateMemberAccess = async (
    page: PageMeta,
    mode: MemberAccessMode,
    redirectPath = page.memberAccess?.redirectPath ?? '',
  ) => {
    if (submittingPageId) return;
    setSubmittingPageId(page.pageId);
    setOpenMenuPageId(null);
    setErrorMessage(null);
    setWarningMessage(null);
    setOrderStatusMessage(null);
    try {
      const response = await fetch(
        `/api/builder/site/pages/${page.pageId}?${siteScopedQuery(page.locale, siteId)}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({
            siteId,
            title: page.title[page.locale] || page.title[locale] || page.title.ko || page.slug || copy.untitled,
            slug: page.slug,
            memberAccess: memberAccessPayloadForMode(mode, redirectPath),
          }),
        },
      );
      if (!response.ok) {
        setErrorMessage(await readPageResponseError(response, copy.saveMemberAccessError));
        return;
      }
      const data = (await response.json()) as { ok?: boolean; page?: PageMeta; error?: string };
      if (!data.ok) {
        setErrorMessage(data.error || copy.saveMemberAccessError);
        return;
      }
      await fetchPages();
      if (memberAccessEditingPageId === page.pageId) {
        closeMemberAccessSettings();
      }
      setOrderStatusMessage(copy.memberAccessSaved);
    } catch {
      setErrorMessage(copy.saveMemberAccessError);
    } finally {
      setSubmittingPageId(null);
    }
  };

  const handleSaveMemberAccessSettings = async () => {
    if (!memberAccessEditingPage) return;
    await handleUpdateMemberAccess(
      memberAccessEditingPage,
      memberAccessModeDraft,
      memberAccessModeDraft === 'public' ? '' : memberAccessRedirectDraft,
    );
  };

  const persistPageOrder = useCallback(async (nextDisplayPages: PageMeta[], affectedPageId: string) => {
    if (pageOrderRequestInFlightRef.current) return;
    pageOrderRequestInFlightRef.current = true;
    setOrderingPageId(affectedPageId);
    setOpenMenuPageId(null);
    setErrorMessage(null);
    setOrderStatusMessage(null);
    try {
      const response = await fetch(`/api/builder/site/pages/order?${siteScopedQuery(locale, siteId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          siteId,
          orderedPageIds: nextDisplayPages.map((entry) => entry.pageId),
        }),
      });
      if (!response.ok) {
        setErrorMessage(await readPageResponseError(response, copy.savePageOrderError));
        return;
      }
      const data = (await response.json()) as { ok?: boolean; pages?: PageMeta[]; error?: string };
      if (!data.ok) {
        setErrorMessage(data.error || copy.savePageOrderError);
        return;
      }
      if (data.pages) {
        setPages(data.pages);
        onPagesChange?.(data.pages);
      } else {
        await fetchPages();
      }
      setOrderStatusMessage(copy.pageOrderSaved);
    } catch {
      setErrorMessage(copy.savePageOrderError);
    } finally {
      pageOrderRequestInFlightRef.current = false;
      setOrderingPageId(null);
      setDraggingPageId(null);
      setDragTargetPageId(null);
    }
  }, [
    copy.pageOrderSaved,
    copy.savePageOrderError,
    fetchPages,
    locale,
    onPagesChange,
    siteId,
  ]);

  const handleMovePage = async (page: PageMeta, direction: -1 | 1) => {
    const nextDisplayPages = reorderDisplayPages(displayPages, page.pageId, direction);
    if (!nextDisplayPages) return;
    await persistPageOrder(nextDisplayPages, page.pageId);
  };

  useEffect(() => {
    const handleWindowKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const pageId = target.dataset.builderPageDragHandle;
      if (!pageId) return;
      const nextDisplayPages = reorderDisplayPages(
        displayPages,
        pageId,
        event.key === 'ArrowUp' ? -1 : 1,
      );
      if (!nextDisplayPages) return;
      event.preventDefault();
      event.stopPropagation();
      void persistPageOrder(nextDisplayPages, pageId);
    };
    window.addEventListener('keydown', handleWindowKeyDown, true);
    return () => window.removeEventListener('keydown', handleWindowKeyDown, true);
  }, [displayPages, persistPageOrder]);

  const handlePageHandleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    page: PageMeta,
  ) => {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
    event.preventDefault();
    void handleMovePage(page, event.key === 'ArrowUp' ? -1 : 1);
  };

  const handlePageDragOver = (
    event: React.DragEvent<HTMLDivElement>,
    targetPageId: string,
  ) => {
    const draggedPageId = event.dataTransfer.getData('application/x-builder-page-id') || draggingPageId;
    if (!draggedPageId || !reorderDisplayPagesBeforeTarget(displayPages, draggedPageId, targetPageId)) {
      setDragTargetPageId((current) => (current === targetPageId ? null : current));
      return;
    }
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    setDragTargetPageId(targetPageId);
  };

  const handlePageDrop = async (
    event: React.DragEvent<HTMLDivElement>,
    targetPageId: string,
  ) => {
    const draggedPageId = event.dataTransfer.getData('application/x-builder-page-id') || draggingPageId;
    if (!draggedPageId) return;
    const nextDisplayPages = reorderDisplayPagesBeforeTarget(displayPages, draggedPageId, targetPageId);
    if (!nextDisplayPages) return;
    event.preventDefault();
    await persistPageOrder(nextDisplayPages, draggedPageId);
  };

  const handleEditKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>,
    page: PageMeta,
  ) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      cancelRename();
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      await handleRename(page);
    }
  };

  return (
    <div style={containerStyle} data-page-switcher="true">
      <div style={headerStyle}>
        <span style={headerLabelStyle}>{copy.drawerTitle}</span>
        <button
          type="button"
          style={addButtonStyle}
          disabled={creating}
          onClick={() => openTemplateGallery()}
        >
          {creating ? copy.addPageBusyLabel : copy.addPageButtonLabel}
        </button>
      </div>
      {clipboardCount > 0 ? (
        <span style={clipboardPillStyle}>
          <span aria-hidden="true">⌘V</span>
          <span>{copy.clipboardCountLabel(clipboardCount)}</span>
        </span>
      ) : null}

      {!loading && missingPageSlug && missingPageTitle ? (
        <section
          style={missingPageCardStyle}
          data-builder-missing-page-card="true"
          data-builder-missing-page-slug={missingPageSlug}
          aria-label={copy.missingPageCardLabel}
        >
          <div style={missingPageTitleStyle}>
            <span>{copy.missingPageTitle}</span>
            <code>/{missingPageSlug}</code>
          </div>
          <p style={missingPageCopyStyle}>
            {copy.missingPageDescription}
          </p>
          <button
            type="button"
            style={missingPageActionStyle}
            disabled={creating}
            data-builder-create-missing-page="true"
            onClick={() => { void handleCreateMissingPage(); }}
          >
            {creating ? copy.creating : copy.missingPageCreateLabel(missingPageTitle)}
          </button>
        </section>
      ) : null}

      {errorMessage ? (
        <div style={statusMessageStyle} role="status" aria-live="polite">
          {errorMessage}
        </div>
      ) : null}

      {orderStatusMessage ? (
        <div
          style={{ ...statusMessageStyle, color: '#166534' }}
          role="status"
          aria-live="polite"
          data-builder-page-order-status="true"
        >
          {orderStatusMessage}
        </div>
      ) : null}

      {warningMessage ? (
        <div style={warningMessageStyle} role="status" aria-live="polite">
          {warningMessage}
        </div>
      ) : null}

      <div data-page-switcher-tree="true" style={treeContainerStyle}>
        {loading ? (
          <div style={treeLoadingStyle}>
            {copy.treeLoadingLabel}
          </div>
        ) : displayPages.length === 0 ? (
          <div style={emptyStateStyle}>
            <strong style={emptyStateTitleStyle}>{copy.emptyStateTitle}</strong>
            <span style={emptyStateCopyStyle}>{copy.emptyStateDescription}</span>
            <button
              type="button"
              style={{ ...addButtonStyle, width: 'fit-content', minHeight: 28 }}
              disabled={creating}
              onClick={() => openTemplateGallery()}
            >
              {copy.emptyStateCreateFirst}
            </button>
          </div>
        ) : (
          displayPages.map((page) => {
          const isActive = page.pageId === activePageId;
          const isEditing = page.pageId === editingPageId;
          const menuOpen = page.pageId === openMenuPageId;
          const showMoreButton = hoveredPageId === page.pageId || menuOpen;
          const isBusy = submittingPageId === page.pageId;
          const isDynamicItemPage = Boolean(page.dynamicItem);
          const isDynamicPage = Boolean(page.dynamicList || page.dynamicItem);
          const canMoveUp = Boolean(reorderDisplayPages(displayPages, page.pageId, -1));
          const canMoveDown = Boolean(reorderDisplayPages(displayPages, page.pageId, 1));
          const isDragTarget = dragTargetPageId === page.pageId;
          const slugSegments = page.slug.split('/').filter(Boolean);
          const nestedDepth = Math.max(0, slugSegments.length - 1);
          const parentSlug = slugSegments.slice(0, -1).join('/');
          const leafSlug = slugSegments[slugSegments.length - 1] ?? page.slug;
          const memberAccessMode = memberAccessModeForPage(page);
          const memberAccessLabel = memberAccessLabelForMode(memberAccessMode, copy);
          const hasUnpublishedChanges = pageHasUnpublishedChanges(page);

          return (
            <div
              key={page.pageId}
              data-builder-page-row={page.pageId}
              data-page-id={page.pageId}
              data-builder-page-slug={page.slug}
              data-builder-page-depth={nestedDepth}
              data-builder-page-parent-slug={parentSlug || undefined}
              data-builder-page-member-access={memberAccessMode}
              data-builder-page-unpublished-changes={hasUnpublishedChanges ? 'true' : undefined}
              style={{
                ...pageRowStyle(isActive),
                boxShadow: isDragTarget ? 'inset 0 0 0 2px #116dff' : undefined,
                paddingLeft: 6 + Math.min(nestedDepth, 3) * 14,
              }}
              data-builder-page-drop-target={isDragTarget ? 'true' : undefined}
              onDragOver={(event) => handlePageDragOver(event, page.pageId)}
              onDragLeave={() => setDragTargetPageId((current) => (current === page.pageId ? null : current))}
              onDrop={(event) => { void handlePageDrop(event, page.pageId); }}
              onMouseEnter={() => setHoveredPageId(page.pageId)}
              onMouseLeave={() => setHoveredPageId((current) => (current === page.pageId ? null : current))}
            >
              {isEditing ? (
                <div style={editContainerStyle}>
                  <input
                    ref={titleInputRef}
                    type="text"
                    aria-label={copy.renameTitleAriaLabel}
                    value={editingTitle}
                    placeholder={copy.renameTitlePlaceholder}
                    style={editInputStyle}
                    onChange={(event) => setEditingTitle(event.target.value)}
                    onKeyDown={(event) => { void handleEditKeyDown(event, page); }}
                  />
                  <input
                    type="text"
                    aria-label={copy.renameSlugAriaLabel}
                    value={editingSlug}
                    placeholder={copy.renameSlugPlaceholder}
                    style={editInputStyle}
                    onChange={(event) => setEditingSlug(event.target.value)}
                    onKeyDown={(event) => { void handleEditKeyDown(event, page); }}
                  />
                  {!page.isHomePage && page.slug !== editingSlug.trim() ? (
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 8,
                        padding: '7px 9px',
                        border: '1px solid #bfdbfe',
                        borderRadius: 8,
                        background: '#eff6ff',
                        color: '#1e3a8a',
                        fontSize: '0.72rem',
                        lineHeight: 1.35,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={editingCreateRedirect}
                        onChange={(event) => setEditingCreateRedirect(event.target.checked)}
                        style={{ marginTop: 2 }}
                      />
                      <span>
                        <strong>{copy.renameRedirectLabel}</strong><br />
                        {copy.renameRedirectDescription(`/${page.locale}/${page.slug}`)}
                        {isDynamicItemPage ? (
                          <>
                            <br />
                            {copy.renameDynamicRedirectDescription}
                          </>
                        ) : null}
                        <br />
                        {copy.renameRedirectConflictHint}
                      </span>
                    </label>
                  ) : null}
                  <div style={editHintStyle}>
                    {isBusy ? copy.renameBusyHint : copy.renameIdleHint}
                  </div>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    aria-label={copy.pageOrderAriaLabel}
                    aria-keyshortcuts="ArrowUp ArrowDown"
                    draggable
                    data-builder-page-drag-handle={page.pageId}
                    data-builder-page-can-move-up={canMoveUp ? 'true' : 'false'}
                    data-builder-page-can-move-down={canMoveDown ? 'true' : 'false'}
                    title={copy.pageOrderHandleTitle}
                    style={pageDragHandleStyle(draggingPageId === page.pageId)}
                    onDragStart={(event) => {
                      event.dataTransfer.effectAllowed = 'move';
                      event.dataTransfer.setData('application/x-builder-page-id', page.pageId);
                      event.dataTransfer.setData('text/plain', page.pageId);
                      setDraggingPageId(page.pageId);
                      setDragTargetPageId(null);
                    }}
                    onDragEnd={() => {
                      setDraggingPageId(null);
                      setDragTargetPageId(null);
                    }}
                    onKeyDownCapture={(event) => handlePageHandleKeyDown(event, page)}
                    onKeyDown={(event) => handlePageHandleKeyDown(event, page)}
                  >
                    <EditorChromeIcon name="dragHandle" style={pageRowControlIconStyle} />
                  </button>
                  <button
                    type="button"
                    style={pageButtonStyle(isActive)}
                    onClick={() => onSelectPage(page.pageId, page.slug)}
                  >
                    <span style={pagePrimaryLineStyle}>
                      <span style={statusDotStyle(!!page.publishedAt)} title={page.publishedAt ? copy.publishedTitle : copy.draftTitle} />
                      <span style={titleTextStyle}>{page.title[locale] || page.title[page.locale] || page.title.ko || page.slug || copy.untitled}</span>
                      {page.isHomePage ? <span style={homeBadgeStyle}>{copy.homeBadge}</span> : null}
                      {isDynamicPage ? <span style={homeBadgeStyle}>{copy.dynamicBadge}</span> : null}
                      {memberAccessLabel ? (
                        <span
                          style={memberAccessBadgeStyle}
                          data-builder-page-member-access-badge={memberAccessMode}
                        >
                          {memberAccessLabel}
                        </span>
                      ) : null}
                      {hasUnpublishedChanges ? (
                        <span
                          style={unpublishedChangesBadgeStyle}
                          title={copy.unpublishedChangesBadge}
                          data-builder-page-unpublished-changes="true"
                        >
                          {copy.unpublishedChangesBadge}
                        </span>
                      ) : null}
                    </span>
                    <span style={pageMetaLineStyle}>
                      {nestedDepth > 0 ? (
                        <span
                          style={{
                            flexShrink: 0,
                            padding: '1px 5px',
                            borderRadius: 5,
                            background: '#eef2ff',
                            color: '#3730a3',
                            fontSize: '0.6rem',
                            fontWeight: 800,
                          }}
                        >
                          {copy.nestedBadge}
                        </span>
                      ) : null}
                      <span style={slugStyle} title={`/${page.slug}`}>
                        {nestedDepth > 0 ? (
                          <>
                            /<span style={{ color: '#94a3b8' }}>{parentSlug}/</span>
                            <strong style={{ color: '#334155' }}>{leafSlug}</strong>
                          </>
                        ) : (
                          <>/{page.slug}</>
                        )}
                      </span>
                    </span>
                  </button>

                  <div style={{ position: 'relative' }} data-page-switcher-menu>
                    <button
                      type="button"
                      aria-label={copy.pageMenuAriaLabel}
                      data-page-menu-trigger={page.pageId}
                      style={pageMoreButtonStyle(showMoreButton, menuOpen)}
                      onClick={(event) => {
                        event.stopPropagation();
                        setOpenMenuPageId((current) => (current === page.pageId ? null : page.pageId));
                      }}
                    >
                      <EditorChromeIcon name="moreHorizontal" style={pageRowControlIconStyle} />
                    </button>

                    {menuOpen ? (
                      <div style={menuStyle}>
                        <button
                          type="button"
                          style={menuItemStyle()}
                          onClick={() => startRename(page)}
                        >
                          {copy.menuRename}
                        </button>
                        {DECOMPOSABLE_SLUGS.has(page.slug) ? (
                          <button
                            type="button"
                            style={menuItemStyle(false, Boolean(submittingPageId))}
                            disabled={Boolean(submittingPageId)}
                            data-builder-decompose-page={page.pageId}
                            onClick={() => { void handleDecomposeToEdit(page); }}
                          >
                            {locale === 'zh-hant'
                              ? '拆解以編輯（鏡像實際網站）'
                              : locale === 'en'
                                ? 'Decompose to edit (live mirror)'
                                : '편집용으로 분해 (라이브 반영본)'}
                          </button>
                        ) : null}
                        <button
                          type="button"
                          style={menuItemStyle(false, Boolean(page.isHomePage || !page.slug))}
                          disabled={page.isHomePage || !page.slug}
                          data-builder-add-child-page={page.pageId}
                          onClick={() => openChildPagePrompt(page)}
                        >
                          {copy.menuAddChild}
                        </button>
                        <button
                          type="button"
                          style={menuItemStyle(false, !canMoveUp || orderingPageId === page.pageId)}
                          disabled={!canMoveUp || orderingPageId === page.pageId}
                          data-builder-move-page-up={page.pageId}
                          onClick={() => { void handleMovePage(page, -1); }}
                        >
                          {copy.menuMoveUp}
                        </button>
                        <button
                          type="button"
                          style={menuItemStyle(false, !canMoveDown || orderingPageId === page.pageId)}
                          disabled={!canMoveDown || orderingPageId === page.pageId}
                          data-builder-move-page-down={page.pageId}
                          onClick={() => { void handleMovePage(page, 1); }}
                        >
                          {copy.menuMoveDown}
                        </button>
                        <div style={menuGroupLabelStyle}>{copy.memberAccessGroup}</div>
                        <button
                          type="button"
                          style={menuItemStyle(false, isBusy)}
                          disabled={isBusy}
                          data-builder-open-member-access-settings={page.pageId}
                          onClick={() => openMemberAccessSettings(page)}
                        >
                          {copy.memberAccessSettings}
                        </button>
                        <button
                          type="button"
                          style={menuItemStyle(false, memberAccessMode === 'public' || isBusy)}
                          disabled={memberAccessMode === 'public' || isBusy}
                          data-builder-set-member-access="public"
                          onClick={() => { void handleUpdateMemberAccess(page, 'public'); }}
                        >
                          {copy.memberAccessModeLabels.public}
                        </button>
                        <button
                          type="button"
                          style={menuItemStyle(false, memberAccessMode === 'member' || isBusy)}
                          disabled={memberAccessMode === 'member' || isBusy}
                          data-builder-set-member-access="member"
                          onClick={() => { void handleUpdateMemberAccess(page, 'member'); }}
                        >
                          {copy.memberAccessModeLabels.member}
                        </button>
                        <button
                          type="button"
                          style={menuItemStyle(false, memberAccessMode === 'premium' || isBusy)}
                          disabled={memberAccessMode === 'premium' || isBusy}
                          data-builder-set-member-access="premium"
                          onClick={() => { void handleUpdateMemberAccess(page, 'premium'); }}
                        >
                          {copy.memberAccessModeLabels.premium}
                        </button>
                        <button
                          type="button"
                          style={menuItemStyle(true, Boolean(page.isHomePage))}
                          disabled={page.isHomePage}
                          onClick={() => { void handleDelete(page); }}
                        >
                          {copy.menuDelete}
                        </button>
                      </div>
                    ) : null}
                  </div>
                </>
              )}
            </div>
          );
          })
        )}
      </div>

      {!loading && columnsPage ? (
        <section style={columnsQuickCardStyle} aria-label={copy.columnsQuickAriaLabel}>
          <div style={columnsQuickTitleStyle}>
            <span>{copy.columnsQuickTitle}</span>
            <span style={columnsQuickMetaStyle}>
              {columnPostsSummary?.loading
                ? copy.columnsQuickLoading
                : columnPostsSummary?.error
                  ? `/${columnsPage.slug}`
                  : copy.columnsQuickCountLabel(columnPostsSummary?.total ?? columnPostsSummary?.posts.length ?? 0)}
            </span>
          </div>
          {columnPostsSummary?.posts.length ? (
            <div style={{ display: 'grid', gap: 4 }}>
              {columnPostsSummary.posts.slice(0, 2).map((post) => (
                <a
                  key={post.slug}
                  href={`/${locale}/admin-builder/columns/${encodeURIComponent(post.slug)}/edit`}
                  style={{ ...columnsQuickMetaStyle, color: '#1d4ed8', textDecoration: 'none' }}
                  title={post.title}
                >
                  {copy.columnsQuickEditPostLabel(post.title)}
                </a>
              ))}
            </div>
          ) : null}
          <div style={columnsQuickActionsStyle}>
            <button
              type="button"
              style={columnsQuickButtonStyle}
              onClick={() => onSelectPage(columnsPage.pageId, columnsPage.slug)}
            >
              {copy.columnsQuickGoToPage}
            </button>
            <a
              href={`/${locale}/admin-builder/columns`}
              style={columnsQuickButtonStyle}
            >
              {copy.columnsQuickManage}
            </a>
            <a
              href={`/${locale}/admin-builder/columns?new=1`}
              style={{
                ...columnsQuickButtonStyle,
                gridColumn: '1 / -1',
                background: '#116dff',
                borderColor: '#116dff',
                color: '#fff',
              }}
            >
              {copy.columnsQuickNewPost}
            </a>
          </div>
        </section>
      ) : null}

      {!loading ? (
        <section
          style={columnsQuickCardStyle}
          aria-label={copy.dynamicQuickAriaLabel}
          data-page-switcher-quick-create="dynamic-list"
        >
          <div style={columnsQuickTitleStyle}>
            <span>{copy.dynamicQuickTitle}</span>
            <span style={columnsQuickMetaStyle}>{copy.dynamicQuickMeta}</span>
          </div>
          <div style={columnsQuickActionsStyle}>
            <button
              type="button"
              style={columnsQuickButtonStyle}
              disabled={creating}
              data-builder-create-dynamic-list-page="columns"
              onClick={() => { void handleCreateDynamicListPage('columns'); }}
            >
              {copy.dynamicQuickColumnList}
            </button>
            <button
              type="button"
              style={columnsQuickButtonStyle}
              disabled={creating}
              data-builder-create-dynamic-list-page="service-areas"
              onClick={() => { void handleCreateDynamicListPage('service-areas'); }}
            >
              {copy.dynamicQuickServiceList}
            </button>
            <button
              type="button"
              style={columnsQuickButtonStyle}
              disabled={creating}
              data-builder-create-dynamic-list-page="attorney-profiles"
              onClick={() => { void handleCreateDynamicListPage('attorney-profiles'); }}
            >
              {copy.dynamicQuickAttorneyList}
            </button>
            <button
              type="button"
              style={columnsQuickButtonStyle}
              disabled={creating}
              data-builder-create-dynamic-item-page="columns"
              onClick={() => { void handleCreateDynamicItemPage('columns'); }}
            >
              {copy.dynamicQuickColumnDetail}
            </button>
            <button
              type="button"
              style={columnsQuickButtonStyle}
              disabled={creating}
              data-builder-create-dynamic-item-page="service-areas"
              onClick={() => { void handleCreateDynamicItemPage('service-areas'); }}
            >
              {copy.dynamicQuickServiceDetail}
            </button>
            <button
              type="button"
              style={columnsQuickButtonStyle}
              disabled={creating}
              data-builder-create-dynamic-item-page="attorney-profiles"
              onClick={() => { void handleCreateDynamicItemPage('attorney-profiles'); }}
            >
              {copy.dynamicQuickAttorneyDetail}
            </button>
          </div>
        </section>
      ) : null}

      {showGallery ? (
        <TemplateGalleryModal
          locale={locale}
          initialSearch={templateGalleryOpenSearch}
          onSearchChange={handleTemplateGallerySearchChange}
          onSelect={(doc, templateName) => handleTemplateSelect(doc, templateName)}
          onClose={() => setShowGallery(false)}
        />
      ) : null}

      {memberAccessEditingPage ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={copy.memberAccessDialogLabel}
          data-builder-member-access-dialog="true"
          style={memberAccessDialogOverlayStyle}
          onClick={(event) => {
            if (event.target === event.currentTarget) closeMemberAccessSettings();
          }}
        >
          <div style={memberAccessDialogPanelStyle}>
            <div style={memberAccessDialogHeaderStyle}>
              <strong style={memberAccessDialogTitleStyle}>{copy.memberAccessDialogTitle}</strong>
              <span style={memberAccessDialogDescriptionStyle}>
                {copy.memberAccessDialogDescription(memberAccessEditingPage.slug || '')}
              </span>
            </div>
            <label style={memberAccessFieldStyle}>
              {copy.memberAccessModeLabel}
              <select
                value={memberAccessModeDraft}
                data-builder-member-access-mode="true"
                onChange={(event) => setMemberAccessModeDraft(event.currentTarget.value as MemberAccessMode)}
                style={editInputStyle}
              >
                <option value="public">{copy.memberAccessModeLabels.public}</option>
                <option value="member">{copy.memberAccessModeLabels.member}</option>
                <option value="premium">{copy.memberAccessModeLabels.premium}</option>
              </select>
            </label>
            <label style={memberAccessFieldStyle}>
              {copy.memberAccessRedirectLabel}
              <select
                value={memberAccessRedirectDraft}
                data-builder-member-access-redirect="true"
                disabled={memberAccessModeDraft === 'public'}
                onChange={(event) => setMemberAccessRedirectDraft(event.currentTarget.value)}
                style={memberAccessControlStyle(memberAccessModeDraft === 'public')}
              >
                {memberAccessRedirectChoices.some((choice) => choice.value === memberAccessRedirectDraft) ? null : (
                  <option value={memberAccessRedirectDraft}>{memberAccessRedirectDraft}</option>
                )}
                {memberAccessRedirectChoices.map((choice) => (
                  <option key={choice.value} value={choice.value}>{choice.label} ({choice.value})</option>
                ))}
              </select>
            </label>
            <label style={memberAccessFieldStyle}>
              {copy.memberAccessCustomRedirectLabel}
              <input
                type="text"
                value={memberAccessRedirectDraft}
                data-builder-member-access-custom-redirect="true"
                disabled={memberAccessModeDraft === 'public'}
                onChange={(event) => setMemberAccessRedirectDraft(event.currentTarget.value)}
                placeholder={`/${locale}/login?next=...`}
                style={memberAccessControlStyle(memberAccessModeDraft === 'public')}
              />
              <span style={memberAccessHintStyle}>
                {copy.memberAccessCustomRedirectHint}
              </span>
            </label>
            <div
              data-builder-member-access-page-picker="true"
              style={memberAccessPagePickerStyle}
            >
              <label style={memberAccessFieldStyle}>
                {copy.memberAccessPagePickerLabel}
                <input
                  type="search"
                  value={memberAccessPageQuery}
                  data-builder-member-access-page-search="true"
                  disabled={memberAccessModeDraft === 'public'}
                  onChange={(event) => setMemberAccessPageQuery(event.currentTarget.value)}
                  placeholder={copy.memberAccessPageSearchPlaceholder}
                  style={memberAccessControlStyle(memberAccessModeDraft === 'public')}
                />
              </label>
              <div
                role="listbox"
                aria-label={copy.memberAccessPageChoicesLabel}
                style={memberAccessListboxStyle(memberAccessModeDraft === 'public')}
              >
                {memberAccessPageChoices.length > 0 ? memberAccessPageChoices.map((pageChoice) => {
                  const choicePath = pageRedirectPathForMemberAccess(pageChoice, locale);
                  const title = pageChoice.title[pageChoice.locale] || pageChoice.title[locale] || pageChoice.title.ko || pageChoice.slug || copy.untitled;
                  const isSelected = memberAccessRedirectDraft === choicePath;
                  return (
                    <button
                      key={pageChoice.pageId}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      data-builder-member-access-page-choice={choicePath}
                      disabled={memberAccessModeDraft === 'public'}
                      onClick={() => setMemberAccessRedirectDraft(choicePath)}
                      style={memberAccessPageChoiceStyle(isSelected, memberAccessModeDraft === 'public')}
                    >
                      <span style={memberAccessPageChoiceTitleStyle}>{title}</span>
                      <span style={memberAccessPageChoicePathStyle}>{choicePath}</span>
                    </button>
                  );
                }) : (
                  <span style={memberAccessEmptyChoiceStyle}>
                    {copy.memberAccessNoMatchingPages}
                  </span>
                )}
              </div>
            </div>
            <div style={memberAccessDialogActionsStyle}>
              <button
                type="button"
                style={addButtonStyle}
                disabled={submittingPageId === memberAccessEditingPage.pageId}
                onClick={closeMemberAccessSettings}
              >
                {copy.cancel}
              </button>
              <button
                type="button"
                style={memberAccessPrimaryButtonStyle}
                disabled={submittingPageId === memberAccessEditingPage.pageId}
                data-builder-member-access-save="true"
                onClick={() => { void handleSaveMemberAccessSettings(); }}
              >
                {submittingPageId === memberAccessEditingPage.pageId ? copy.saving : copy.save}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showSlugPrompt ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={copy.slugPromptDialogLabel}
          style={slugPromptOverlayStyle}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeSlugPrompt();
            }
          }}
        >
          <div
            ref={slugPromptRef}
            tabIndex={-1}
            data-builder-slug-prompt-dialog="true"
            style={slugPromptDialogStyle}
          >
            <div style={slugPromptTitleStyle}>
              {copy.slugPromptTitle}
            </div>
            <div style={slugPromptDescriptionStyle}>
              {pendingTemplate ? copy.slugPromptTemplateDescription : copy.slugPromptBlankDescription}
            </div>
            {errorMessage ? (
              <div
                role="status"
                aria-live="polite"
                style={slugPromptErrorStyle}
              >
                {errorMessage}
              </div>
            ) : null}
            <input
              type="text"
              placeholder={copy.slugPromptPlaceholder}
              value={slugInput}
              onChange={(event) => setSlugInput(event.target.value)}
              onKeyDown={(event) => { if (event.key === 'Enter') void handleCreatePage(); }}
              autoFocus
              style={slugPromptInputStyle}
            />
            <label style={slugPromptNavigationLabelStyle}>
              <input
                type="checkbox"
                checked={addToNavigation}
                onChange={(event) => setAddToNavigation(event.target.checked)}
                style={slugPromptCheckboxStyle}
              />
              <span style={slugPromptNavigationTextStyle}>
                {copy.addToNavigationLabel}
                <span style={slugPromptNavigationHintStyle}>
                  {copy.addToNavigationHint}
                </span>
              </span>
            </label>
            <div style={slugPromptActionsStyle}>
              {pendingTemplate ? (
                <button
                  type="button"
                  data-builder-page-template-back="true"
                  onClick={() => {
                    setShowSlugPrompt(false);
                    clearPendingTemplate();
                    setTemplateGalleryOpenSearch(templateGalleryLastSearch);
                    setShowGallery(true);
                  }}
                  style={slugPromptBackButtonStyle}
                >
                  {copy.chooseAnotherTemplate}
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  closeSlugPrompt();
                }}
                style={slugPromptCancelButtonStyle}
              >
                {copy.cancel}
              </button>
              <button
                type="button"
                onClick={() => { void handleCreatePage(); }}
                disabled={creating}
                style={slugPromptCreateButtonStyle(creating)}
              >
                {creating ? copy.creating : copy.create}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
