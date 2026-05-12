'use client';

import type { ComponentProps } from 'react';
import AssetLibraryModal from '@/components/builder/editor/AssetLibraryModal';
import ImageEditDialog, { type ImageEditTab } from '@/components/builder/canvas/ImageEditDialog';
import MoveToPageModal from '@/components/builder/canvas/MoveToPageModal';
import PreviewModal from '@/components/builder/canvas/PreviewModal';
import PublishModal from '@/components/builder/canvas/PublishModal';
import SeoPanel from '@/components/builder/canvas/SeoPanel';
import ShortcutsHelpModal from '@/components/builder/canvas/ShortcutsHelpModal';
import SiteSettingsModal from '@/components/builder/canvas/SiteSettingsModal';
import VersionHistoryPanel from '@/components/builder/canvas/VersionHistoryPanel';
import SaveSectionModal, { type SaveSectionPayload } from '@/components/builder/sections/SaveSectionModal';
import type { BuilderCanvasDocument, BuilderCanvasNode } from '@/lib/builder/canvas/types';
import type {
  ComponentDesignPresetKey,
  ComponentDesignPresetPatchResult,
} from '@/lib/builder/site/component-design-presets';
import { buildSitePagePath } from '@/lib/builder/site/paths';
import type { BuilderSiteSettings, BuilderTheme, SavedSection } from '@/lib/builder/site/types';
import type { Locale } from '@/lib/locales';
import type { ViewportMode } from './SandboxTopBar';

type DraftMeta = {
  revision: number;
  savedAt: string;
  updatedBy?: string;
};

type ImageEditContent = Parameters<ComponentProps<typeof ImageEditDialog>['onApply']>[0];
export type ImageEditorRequest = { nodeId: string; initialTab?: ImageEditTab } | null;
export type MoveToPageResult = Parameters<ComponentProps<typeof MoveToPageModal>['onMoved']>[0];

type PageOption = {
  pageId: string;
  slug: string;
  isHomePage?: boolean;
};

type SandboxModalsRootProps = {
  locale: Locale;
  document: BuilderCanvasDocument | null;
  siteName?: string;
  currentSlug: string;
  viewport: ViewportMode;
  activePageId: string | null;
  draftMeta: DraftMeta | null;
  sitePages: PageOption[];
  assetLibraryNode: BuilderCanvasNode | null;
  imageEditorNode: BuilderCanvasNode | null;
  imageEditorRequest: ImageEditorRequest;
  publishOpen: boolean;
  seoOpen: boolean;
  settingsOpen: boolean;
  historyOpen: boolean;
  helpOpen: boolean;
  previewOpen: boolean;
  saveSectionPayload: SaveSectionPayload | null;
  movePickerNodeIds: string[] | null;
  onCloseAssetLibrary: () => void;
  onSelectAsset: (nodeId: string, url: string) => void;
  onCloseImageEditor: () => void;
  onApplyImageEdit: (nodeId: string, content: ImageEditContent) => void;
  onClosePublish: () => void;
  onDraftSaved: (nextDraftMeta: DraftMeta, savedDocument?: BuilderCanvasDocument) => void;
  onCloseSeo: () => void;
  onSeoSaved: (page: { pageId: string; slug: string }) => void;
  onCloseSettings: () => void;
  onSettingsSaved: (payload: { settings: BuilderSiteSettings; theme: BuilderTheme }) => void;
  onApplyComponentDesignPreset: (presetKey: ComponentDesignPresetKey) => ComponentDesignPresetPatchResult;
  onCloseHistory: () => void;
  onCloseHelp: () => void;
  onClosePreview: () => void;
  onCloseSaveSection: () => void;
  onSectionSaved: (section: SavedSection) => void;
  onCloseMovePicker: () => void;
  onMoveCompleted: (result: MoveToPageResult) => void;
  onToast: (message: string, tone: 'success' | 'error') => void;
};

export default function SandboxModalsRoot({
  locale,
  document,
  siteName,
  currentSlug,
  viewport,
  activePageId,
  draftMeta,
  sitePages,
  assetLibraryNode,
  imageEditorNode,
  imageEditorRequest,
  publishOpen,
  seoOpen,
  settingsOpen,
  historyOpen,
  helpOpen,
  previewOpen,
  saveSectionPayload,
  movePickerNodeIds,
  onCloseAssetLibrary,
  onSelectAsset,
  onCloseImageEditor,
  onApplyImageEdit,
  onClosePublish,
  onDraftSaved,
  onCloseSeo,
  onSeoSaved,
  onCloseSettings,
  onSettingsSaved,
  onApplyComponentDesignPreset,
  onCloseHistory,
  onCloseHelp,
  onClosePreview,
  onCloseSaveSection,
  onSectionSaved,
  onCloseMovePicker,
  onMoveCompleted,
  onToast,
}: SandboxModalsRootProps) {
  return (
    <>
      {assetLibraryNode?.kind === 'image' ? (
        <AssetLibraryModal
          open
          locale={locale}
          selectedUrl={assetLibraryNode.content.src}
          onClose={onCloseAssetLibrary}
          onSelect={(asset) => {
            onSelectAsset(assetLibraryNode.id, asset.url);
            onCloseAssetLibrary();
          }}
          onToast={onToast}
        />
      ) : null}

      {imageEditorNode?.kind === 'image' ? (
        <ImageEditDialog
          open
          imageSrc={String(imageEditorNode.content.src || '')}
          alt={String(imageEditorNode.content.alt || '')}
          cropAspect={typeof imageEditorNode.content.cropAspect === 'string' ? imageEditorNode.content.cropAspect : 'Free'}
          focalPoint={imageEditorNode.content.focalPoint}
          filters={imageEditorNode.content.filters}
          initialTab={imageEditorRequest?.initialTab}
          onClose={onCloseImageEditor}
          onApply={(content) => {
            onApplyImageEdit(imageEditorNode.id, content);
            onCloseImageEditor();
          }}
        />
      ) : null}

      <PublishModal
        open={publishOpen}
        document={document}
        locale={locale}
        activePageId={activePageId}
        draftMeta={draftMeta}
        onDraftSaved={onDraftSaved}
        onToast={onToast}
        onClose={onClosePublish}
      />

      <SeoPanel
        open={seoOpen}
        pageId={activePageId ?? ''}
        locale={locale}
        document={document ?? undefined}
        siteName={siteName}
        onSaved={onSeoSaved}
        onClose={onCloseSeo}
      />

      <SiteSettingsModal
        open={settingsOpen}
        locale={locale}
        onSaved={onSettingsSaved}
        onApplyComponentDesignPreset={onApplyComponentDesignPreset}
        onClose={onCloseSettings}
      />

      <VersionHistoryPanel
        open={historyOpen}
        pageId={activePageId ?? ''}
        siteId="default"
        draftMeta={draftMeta}
        onRestored={onDraftSaved}
        onClose={onCloseHistory}
      />

      {helpOpen ? <ShortcutsHelpModal onClose={onCloseHelp} /> : null}

      <PreviewModal
        open={previewOpen}
        onClose={onClosePreview}
        previewUrl={previewOpen ? buildSitePagePath(locale, currentSlug ?? '') : null}
        initialDevice={viewport === 'mobile' ? 'mobile' : viewport === 'tablet' ? 'tablet' : 'desktop'}
      />

      {saveSectionPayload ? (
        <SaveSectionModal
          payload={saveSectionPayload}
          locale={locale}
          onClose={onCloseSaveSection}
          onSaved={(section) => {
            onCloseSaveSection();
            onSectionSaved(section);
          }}
        />
      ) : null}

      {movePickerNodeIds && activePageId ? (
        <MoveToPageModal
          pages={sitePages}
          currentPageId={activePageId}
          sourceNodeIds={movePickerNodeIds}
          locale={locale}
          onClose={onCloseMovePicker}
          onMoved={(result) => {
            onCloseMovePicker();
            onMoveCompleted(result);
          }}
        />
      ) : null}
    </>
  );
}
