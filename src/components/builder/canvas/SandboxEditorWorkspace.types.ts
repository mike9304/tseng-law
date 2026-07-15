import type { CSSProperties, RefObject } from 'react';
import type { CanvasCollabCursor } from '@/components/builder/canvas/CanvasCollabCursorsLayer';
import type {
  ColumnPostsSummary,
  SandboxDrawerPanel,
} from '@/components/builder/canvas/SandboxEditorRail';
import type { ImageEditTab } from '@/components/builder/canvas/ImageEditDialog';
import type { PublicChromeCopy } from '@/components/builder/canvas/SandboxPublicChromePreview';
import type { SiteHeaderMemberNavPreview } from '@/components/builder/published/SiteHeader';
import type { BuilderRegisteredAppWidget } from '@/lib/builder/apps/widgets';
import type { BuilderCanvasDocument, BuilderCanvasNode } from '@/lib/builder/canvas/types';
import type { BuilderDataBindingPreviewTarget } from '@/lib/builder/datasets';
import type { BuilderFaqCategory, BuilderFaqItem } from '@/lib/builder/faq/faq-shared';
import type { ComponentDesignPresetKey } from '@/lib/builder/site/component-design-presets';
import type { BuilderNavItem, BuilderSiteSettings, BuilderTheme } from '@/lib/builder/site/types';
import type { ColumnPost } from '@/lib/columns';
import type { Locale } from '@/lib/locales';

export type SandboxEditorWorkspaceProps = {
  locale: Locale;
  siteId: string;
  activeDrawer: SandboxDrawerPanel | null;
  activePageId: string | null;
  clipboardCount: number;
  columnPostsSummary: ColumnPostsSummary;
  columnsPageLookupPending: boolean;
  document: BuilderCanvasDocument | null;
  nodesById: Map<string, BuilderCanvasNode>;
  selectedNode: BuilderCanvasNode | null;
  focusedNavItemId: string | null;
  addNavChildParentId: string | null;
  siteName?: string;
  siteSettings?: BuilderSiteSettings;
  siteTheme: BuilderTheme;
  headerNavItems: BuilderNavItem[];
  currentSlug: string;
  activeNavItemId: string | null;
  missingPageHref?: string | null;
  viewportWidth: number | null;
  canvasOuterStyle: CSSProperties;
  canvasWrapperStyle: CSSProperties;
  canvasColumnRef: RefObject<HTMLDivElement>;
  publicChromeCopy: PublicChromeCopy;
  collabCursors?: CanvasCollabCursor[];
  linkPickerLightboxes: Array<{ id: string; slug: string; name: string }>;
  linkPickerPopups: Array<{ id: string; slug: string; name: string }>;
  linkPickerSitePages: Array<{ path: string; title: string; slug: string }>;
  columnPosts?: ColumnPost[];
  faqCategories?: BuilderFaqCategory[];
  faqItems?: BuilderFaqItem[];
  datasetPreviewTargets?: BuilderDataBindingPreviewTarget[];
  appWidgets?: BuilderRegisteredAppWidget[];
  memberNavPreview?: SiteHeaderMemberNavPreview;
  onToggleDrawer: (panel: SandboxDrawerPanel) => void;
  onOpenColumnsPanel: () => void;
  onOpenColumnsPage: () => void;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  onApplyComponentDesignPreset: (presetKey: ComponentDesignPresetKey) => void;
  onSetActiveDrawer: (panel: SandboxDrawerPanel | null) => void;
  onSelectPage: (pageId: string, nextSlug?: string) => boolean | void | Promise<boolean | void>;
  onPagesChange: (pages: Array<{ pageId: string; slug: string; isHomePage?: boolean }>) => void;
  onMissingPageHandled?: () => void;
  onNavigationChange: (items: BuilderNavItem[]) => void;
  onNavFocusHandled: () => void;
  onNavAddChildHandled: () => void;
  onSelectNode: (nodeId: string | null) => void;
  onUpdateNodeContent: (nodeId: string, content: Record<string, unknown>) => void;
  onHeaderNavigate: (href: string) => void;
  onRequestEditNavItem: (itemId: string) => void;
  onRequestRenameNavItem: (itemId: string, labels: Record<Locale, string>) => Promise<boolean | void> | boolean | void;
  onRequestAddNavChild: (parentItemId: string) => void;
  onRequestMoveNavItem: (itemId: string, direction: 'up' | 'down') => void;
  onFooterLinkActivation: (event: {
    target: EventTarget | null;
    preventDefault: () => void;
    stopPropagation: () => void;
  }) => void;
  onRequestAssetLibrary: (nodeId: string | null) => void;
  onRequestImageEditor: (request: { nodeId: string; initialTab?: ImageEditTab } | null) => void;
  onRequestMoveToPage: (nodeIds: string[]) => void;
  onRequestSaveAsSection: (rootNodeId: string) => void;
  canDecomposeCurrentPage: boolean;
  onDecomposeCurrentPage: () => Promise<boolean>;
  onRequestInsertSavedSection: (
    sectionId: string,
    position: { x: number; y: number },
    parentNodeId: string | null,
  ) => void;
  onCanvasPageLink: (href: string) => void;
  onToast: (message: string, tone: 'success' | 'error') => void;
  onActivity: (message: string) => void;
};
