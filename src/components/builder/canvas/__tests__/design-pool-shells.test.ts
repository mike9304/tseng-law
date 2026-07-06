import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from 'vitest';

const root = process.cwd();

function read(relativePath: string): string {
  return readFileSync(path.join(root, relativePath), 'utf8');
}

describe('D-POOL inspector and modal design contracts', () => {
  test('wires inspector tokens and primitive controls into inspector surfaces', () => {
    const layout = read('src/app/(builder)/[locale]/layout.tsx');
    const controls = read('src/components/builder/canvas/InspectorControls.tsx');
    const inspector = read('src/components/builder/canvas/SandboxInspectorPanel.tsx');
    const inspectorLayoutTab = read('src/components/builder/canvas/SandboxInspectorLayoutTab.tsx');
    const inspectorSurfaces = `${inspector}\n${inspectorLayoutTab}`;
    const a11yPanel = read('src/components/builder/canvas/A11yPanel.tsx');
    const a11yPanelCss = read('src/components/builder/canvas/A11yPanel.module.css');
    const styleTab = read('src/components/builder/editor/StyleTab.tsx');
    const contentTab = read('src/components/builder/editor/ContentTab.tsx');
    const css = read('src/components/builder/canvas/SandboxPage.module.css');

    expect(layout).toContain("inspector-tokens.css");
    for (const exportName of [
      'MixedValueIndicator',
      'LabeledRow',
      'NumberStepper',
      'SegmentedControl',
      'SwatchRow',
      'SliderRow',
      'ToggleRow',
      'AdvancedDisclosure',
    ]) {
      expect(controls, exportName).toContain(`function ${exportName}`);
    }

    expect(inspector).toContain("activeTab, setActiveTab] = useState<SandboxInspectorTabId>('layout')");
    expect(inspector).toContain('type SandboxInspectorTabId');
    expect(inspector).toContain('<MixedValueBadge />');
    // SegmentedControl usage is allowed in either the inspector shell or the
    // split layout tab, since the panel composes the layout tab.
    expect(inspectorSurfaces).toContain('<SegmentedControl');
    expect(styleTab).toContain("from '@/components/builder/canvas/InspectorControls'");
    expect(styleTab).toContain('<AdvancedDisclosure');
    expect(contentTab).toContain("data-inspector-content-adapter=\"true\"");
    expect(css).toContain(".inspectorFormStack[data-inspector-content-adapter='true']");
    expect(a11yPanel).toContain("import styles from './A11yPanel.module.css';");
    expect(a11yPanel).toContain('function countA11yIssues(issues: A11yIssue[]): A11yIssueCounts');
    expect(a11yPanel).not.toContain('React.CSSProperties');
    expect(a11yPanel).not.toContain('style=');
    for (const classHook of [
      'className={styles.root}',
      'className={styles.passCard}',
      'className={styles.passIcon}',
      'className={styles.summary}',
      'className={styles.issueList}',
      'className={styles.issueCard}',
      'className={styles.issueHeader}',
      'className={styles.severityIcon}',
      'className={styles.issueMessage}',
      'className={styles.suggestion}',
      'className={styles.nodeMeta}',
    ]) {
      expect(a11yPanel).toContain(classHook);
    }
    expect(a11yPanel).toContain('data-severity={issue.severity}');
    expect(a11yPanel).toContain('aria-disabled={!issue.nodeId}');
    expect(a11yPanel).toContain('aria-hidden');
    expect(a11yPanelCss).toContain('.passCard {');
    expect(a11yPanelCss).toContain('.passIcon::after');
    expect(a11yPanelCss).toContain(".issueCard[data-severity='error']");
    expect(a11yPanelCss).toContain(".issueCard[data-severity='warning']");
    expect(a11yPanelCss).toContain(".severityIcon[data-severity='error']");
    expect(a11yPanelCss).toContain('.issueCard:focus-visible');
  });

  test('keeps expanded context menu actions and submenu support', () => {
    const menu = read('src/components/builder/canvas/ContextMenu.tsx');
    const canvasMenu = [
      read('src/components/builder/canvas/CanvasContainer.tsx'),
      read('src/components/builder/canvas/CanvasContextMenuLayer.tsx'),
    ].join('\n');
    const css = read('src/components/builder/canvas/SandboxPage.module.css');

    expect(menu).toContain('children?: ContextMenuAction[]');
    expect(menu).toContain("event.key === 'ArrowRight'");
    expect(menu).toContain("event.key === 'ArrowLeft'");
    expect(css).toContain('.contextSubmenu');
    expect(css).toContain("[data-tone='danger']");

    const requiredActionKeys = [
      'edit-text',
      'replace-image',
      'edit-alt',
      'edit-link',
      'remove-link',
      'copy',
      'cut',
      'paste',
      'duplicate',
      'paste-style',
      'copy-style',
      'bring-front',
      'bring-forward',
      'send-backward',
      'send-back',
      'lock',
      'align-left',
      'align-center',
      'align-right',
      'align-top',
      'align-middle',
      'align-bottom',
      'distribute-horizontal',
      'distribute-vertical',
      'match-width',
      'match-height',
      'hide-on-viewport',
      'pin-to-screen',
      'anchor-link',
      'animations',
      'effects',
      'move-to-page',
      'save-as-section',
      'add-to-library',
      'convert-to-component',
      'style-override',
      'reset-style',
      'group',
      'ungroup',
      'delete',
    ];

    for (const key of requiredActionKeys) {
      expect(canvasMenu, key).toContain(`key: '${key}'`);
    }
  });

  test('uses ModalShell for target modals and removes legacy modal keyframes', () => {
    const modalShell = read('src/components/builder/canvas/ModalShell.tsx');
    const modalCss = read('src/components/builder/canvas/ModalShell.module.css');
    const preview = read('src/components/builder/canvas/PreviewModal.tsx');
    const previewCss = read('src/components/builder/canvas/PreviewModal.module.css');
    const publish = read('src/components/builder/canvas/PublishModal.tsx');
    const publishPreflight = read('src/components/builder/canvas/PublishModalPreflight.tsx');
    const publishCss = read('src/components/builder/canvas/PublishModal.module.css');
    // PublishModal was decomposed into PublishModal*/PublishTranslation* child
    // components; the CSS-module class hooks now live across that whole surface,
    // so assert the contract against the full publish-modal component bundle.
    const publishComponentBundle = readdirSync(path.join(root, 'src/components/builder/canvas'))
      .filter((file) => /^Publish.*\.tsx$/.test(file))
      .map((file) => read(`src/components/builder/canvas/${file}`))
      .join('\n');
    const seoPanel = read('src/components/builder/canvas/SeoPanel.tsx');
    const seoPanelCss = read('src/components/builder/canvas/SeoPanel.module.css');
    const seoBasics = read('src/components/builder/canvas/SeoPanelBasicsTab.tsx');
    const seoBasicsCss = read('src/components/builder/canvas/SeoPanelBasicsTab.module.css');
    const seoSocial = read('src/components/builder/canvas/SeoPanelSocialTab.tsx');
    const seoSocialCss = read('src/components/builder/canvas/SeoPanelSocialTab.module.css');
    const seoHreflang = read('src/components/builder/canvas/SeoPanelHreflangTab.tsx');
    const seoHreflangCss = read('src/components/builder/canvas/SeoPanelHreflangTab.module.css');
    const seoAdvanced = read('src/components/builder/canvas/SeoPanelAdvancedTab.tsx');
    const seoAdvancedCss = read('src/components/builder/canvas/SeoPanelAdvancedTab.module.css');
    const seoAssistant = read('src/components/builder/canvas/SeoPanelAssistantTab.tsx');
    const seoAssistantCss = read('src/components/builder/canvas/SeoPanelAssistantTab.module.css');
    const settings = read('src/components/builder/canvas/SiteSettingsModal.tsx');
    const settingsCss = read('src/components/builder/canvas/SiteSettingsModal.module.css');
    const settingsAdvanced = read('src/components/builder/canvas/SiteSettingsAdvancedTab.tsx');
    const settingsAdvancedCss = read('src/components/builder/canvas/SiteSettingsAdvancedTab.module.css');
    const settingsDarkMode = read('src/components/builder/canvas/SiteSettingsDarkModeTab.tsx');
    const settingsDarkModeCss = read('src/components/builder/canvas/SiteSettingsDarkModeTab.module.css');
    const settingsGeneral = read('src/components/builder/canvas/SiteSettingsGeneralTab.tsx');
    const settingsGeneralCss = read('src/components/builder/canvas/SiteSettingsGeneralTab.module.css');
    const settingsMobile = read('src/components/builder/canvas/SiteSettingsMobileTab.tsx');
    const settingsMobileCss = read('src/components/builder/canvas/SiteSettingsMobileTab.module.css');
    const settingsPresets = read('src/components/builder/canvas/SiteSettingsPresetsTab.tsx');
    const settingsPresetsCss = read('src/components/builder/canvas/SiteSettingsPresetsTab.module.css');
    const settingsTypography = read('src/components/builder/canvas/SiteSettingsTypographyTab.tsx');
    const settingsTypographyCss = read('src/components/builder/canvas/SiteSettingsTypographyTab.module.css');
    const gallery = read('src/components/builder/canvas/TemplateGalleryModal.tsx');
    const canvasDirFiles = [
      preview,
      publish,
      settings,
      gallery,
      read('src/components/builder/canvas/CropModal.tsx'),
    ].join('\n');

    expect(modalShell).toContain('createPortal');
    expect(modalShell).toContain('FOCUSABLE_SELECTOR');
    expect(modalShell).toContain("data-modal-shell=\"true\"");
    expect(modalShell).toContain('scrollLock.acquire');
    expect(modalCss).toContain('z-index: 9500');
    expect(modalCss).toContain('z-index: 9700');
    expect(publish).toContain('<ModalShell');
    expect(publish).toContain("import styles from './PublishModal.module.css';");
    expect(publishPreflight).toContain("import styles from './PublishModal.module.css';");
    expect(existsSync(path.join(root, 'src/components/builder/canvas/PublishModal.styles.ts'))).toBe(false);
    expect(publish).not.toContain("from './PublishModal.styles'");
    expect(publishPreflight).not.toContain("from './PublishModal.styles'");
    expect(publish).not.toContain('style=');
    expect(publishPreflight).not.toContain('style=');
    expect(publishComponentBundle).not.toContain('style=');
    for (const classHook of [
      'className={styles.checkingText}',
      'className={styles.sectionTitle}',
      'className={styles.checklistGrid}',
      'className={styles.checklistCard}',
      'className={styles.checklistLabel}',
      'className={styles.checklistStatus}',
      'className={styles.checklistDetail}',
      'className={styles.publishDiffPanel}',
      'className={styles.publishDiffStatRow}',
      'className={styles.publishDiffStat}',
      'className={styles.checklistDetailInline}',
      'className={styles.publishDiffList}',
      'className={styles.publishDiffItem}',
      'className={styles.issueList}',
      'className={styles.schedulePanel}',
      'className={styles.scheduleHeader}',
      'className={styles.scheduleRow}',
      'className={styles.scheduleInput}',
      'className={styles.scheduleButton}',
      'className={styles.scheduleHelp}',
      'className={styles.successBox}',
      'className={styles.successLink}',
      'className={styles.errorBox}',
      'className={styles.buttonRow}',
      'className={styles.cancelButton}',
      'className={styles.publishWarnButton}',
      'className={styles.publishButton}',
    ]) {
      expect(publishComponentBundle).toContain(classHook);
    }
    for (const classHook of [
      'className={styles.severityItem}',
      'className={styles.severityContent}',
      'className={styles.severityHeader}',
      'className={styles.severityIcon}',
      'className={styles.severityMessage}',
      'className={styles.fixHint}',
      'className={styles.fixButton}',
    ]) {
      expect(publishPreflight).toContain(classHook);
    }
    expect(publishComponentBundle).toContain('data-tone={item.tone}');
    expect(publishComponentBundle).toContain('data-tone="added"');
    expect(publishComponentBundle).toContain('data-enabled={canSubmitPublish ? \'true\' : \'false\'}');
    expect(publishPreflight).toContain('data-severity={result.severity}');
    expect(publishCss).toContain(".checklistCard[data-tone='blocker']");
    expect(publishCss).toContain(".sectionTitle[data-tone='warning']");
    expect(publishCss).toContain(".publishDiffStat[data-tone='modified']");
    expect(publishCss).toContain(".severityItem[data-severity='blocker']");
    expect(publishCss).toContain('.scheduleInput:focus-visible');
    expect(publishCss).toContain('.publishButton[data-enabled=\'true\']');
    expect(publishCss).toContain('@media (max-width: 760px)');
    expect(preview).toContain("import styles from './PreviewModal.module.css';");
    expect(preview).not.toContain('<style>');
    expect(preview).not.toContain('preview-device-btn');
    expect(preview).not.toContain('style={{');
    for (const classHook of [
      'className={styles.dialog}',
      'className={styles.header}',
      'className={styles.titleBar}',
      'className={styles.title}',
      'className={styles.urlPill}',
      'className={styles.deviceGroup}',
      'className={styles.deviceButton}',
      'className={styles.deviceIcon}',
      'className={styles.actionGroup}',
      'className={styles.actionButton}',
      'className={styles.closeButton}',
      'className={styles.stageBody}',
      'className={styles.stageShell}',
      'className={styles.previewFrame}',
      'className={styles.unpublished}',
      'className={styles.footer}',
      'className={styles.desktopFrame}',
      'className={styles.browserBar}',
      'className={styles.browserDot}',
      'className={styles.browserSpacer}',
      'className={styles.browserLabel}',
      'className={styles.desktopScreen}',
      'className={styles.deviceFrame}',
      'className={styles.notch}',
      'className={styles.deviceScreen}',
      'className={styles.homeIndicator}',
    ]) {
      expect(preview).toContain(classHook);
    }
    expect(preview).toContain('style={stageShellStyle(stageScale)}');
    expect(preview).toContain('style={deviceFrameStyle(spec)}');
    expect(preview).toContain("data-mode={spec.mode}");
    expect(preview).toContain("data-mode={mode}");
    expect(previewCss).toContain('.dialog {');
    expect(previewCss).toContain('@keyframes previewBackdropIn');
    expect(previewCss).toContain('@keyframes previewShellIn');
    expect(previewCss).toContain(".deviceButton[aria-pressed='true']");
    expect(previewCss).toContain('.actionButton:disabled');
    expect(previewCss).toContain(".browserDot[data-tone='red']");
    expect(previewCss).toContain('var(--preview-stage-scale)');
    expect(previewCss).toContain('var(--preview-device-width)');
    expect(previewCss).toContain('@media (max-width: 760px)');
    expect(settings).toContain('<ModalShell');
    expect(gallery).toContain('<ModalShell');
    expect(settings).toContain("const customThemeDefaultName = copy.modal.myThemeName('');");
    expect(settings).toContain('readCustomThemePresets(customThemeDefaultName)');
    expect(settings).toContain('}, [customThemeDefaultName, open]);');
    expect(settings).not.toContain('}, [copy.modal.myThemeName, open]);');
    expect(settings).toContain("import styles from './SiteSettingsModal.module.css';");
    expect(settings).not.toContain("from './SiteSettingsModal.styles'");
    expect(settings).not.toContain('style=');
    expect(settings).not.toContain('formStyle');
    expect(settings).toContain('className={styles.shell}');
    expect(settings).toContain('data-site-settings-modal-shell="true"');
    expect(settings).toContain('className={styles.tabRail}');
    expect(settings).toContain('className={styles.tabButton}');
    expect(settings).toContain("data-active={active ? 'true' : undefined}");
    expect(settings).toContain('className={styles.tabIndicator}');
    expect(settings).toContain('className={styles.tabIcon}');
    expect(settings).toContain('className={styles.tabLabel}');
    expect(settings).toContain('className={styles.content}');
    expect(settings).toContain('className={styles.loading}');
    expect(settings).toContain('className={styles.footerMessage}');
    expect(settingsCss).toContain('.shell {');
    expect(settingsCss).toContain('.tabRail {');
    expect(settingsCss).toContain(".tabButton[data-active='true']");
    expect(settingsCss).toContain(".footerMessage[data-tone='error']");
    expect(settingsCss).toContain("@media (max-width: 760px)");
    expect(seoPanel).toContain("import styles from './SeoPanel.module.css';");
    expect(existsSync(path.join(root, 'src/components/builder/canvas/SeoPanel.styles.ts'))).toBe(false);
    expect(seoPanel).not.toContain("from './SeoPanel.styles'");
    expect(seoPanel).not.toContain('style=');
    for (const classHook of [
      'className={styles.backdrop}',
      'className={styles.panel}',
      'className={styles.header}',
      'className={styles.headerText}',
      'className={styles.title}',
      'className={styles.helpText}',
      'className={styles.headerActions}',
      'className={styles.ghostButton}',
      'className={styles.tabBar}',
      'className={styles.tabButton}',
      'className={styles.form}',
      'className={styles.loading}',
      'className={styles.footer}',
      'className={styles.footerStatus}',
      'className={styles.errorText}',
      'className={styles.warningText}',
      'className={styles.footerActions}',
      'className={styles.primaryButton}',
    ]) {
      expect(seoPanel).toContain(classHook);
    }
    expect(seoPanel).toContain("data-active={activeTab === key ? 'true' : undefined}");
    expect(seoPanelCss).toContain('.backdrop {');
    expect(seoPanelCss).toContain('.panel {');
    expect(seoPanelCss).toContain(".tabButton[data-active='true']");
    expect(seoPanelCss).toContain('.primaryButton:disabled');
    expect(seoPanelCss).toContain('@media (max-width: 760px)');
    expect(seoBasics).toContain("import styles from './SeoPanelBasicsTab.module.css';");
    expect(seoBasics).not.toContain("from './SeoPanel.styles'");
    expect(seoBasics).not.toContain('style=');
    expect(seoBasics).not.toContain('counterColor');
    for (const classHook of [
      'className={styles.section}',
      'className={styles.sectionTitle}',
      'className={styles.twoColumn}',
      'className={styles.field}',
      'className={styles.label}',
      'className={styles.input}',
      'className={styles.helpText}',
      'className={styles.counterRow}',
      'className={styles.counterValue}',
      'className={styles.checkboxRow}',
      'className={styles.checkboxGrid}',
      'className={styles.previewCard}',
      'className={styles.previewUrl}',
      'className={styles.previewTitle}',
      'className={styles.previewDescription}',
    ]) {
      expect(seoBasics).toContain(classHook);
    }
    expect(seoBasics).toContain("data-active={active ? 'true' : 'false'}");
    expect(seoBasics).toContain('styles.textarea');
    expect(seoBasics).toContain('data-tone={counterTone(length, min, max)}');
    expect(seoBasicsCss).toContain(".section[data-active='false']");
    expect(seoBasicsCss).toContain('.input:focus-visible');
    expect(seoBasicsCss).toContain(".counterValue[data-tone='warning']");
    expect(seoBasicsCss).toContain('.previewTitle {');
    expect(seoSocial).toContain("import styles from './SeoPanelSocialTab.module.css';");
    expect(seoSocial).not.toContain("from './SeoPanel.styles'");
    expect(seoSocial).not.toContain('style=');
    for (const classHook of [
      'className={styles.section}',
      'className={styles.sectionTitle}',
      'className={styles.twoColumn}',
      'className={styles.field}',
      'className={styles.label}',
      'className={styles.input}',
      'className={`${styles.input} ${styles.textarea}`}',
      'className={styles.previewHeading}',
      'className={styles.previewCard}',
      'className={styles.socialPreviewGrid}',
      'className={styles.socialImageFrame}',
      'className={styles.socialImage}',
      'className={styles.socialPreviewCopy}',
      'className={styles.socialPreviewTitle}',
      'className={styles.helpText}',
    ]) {
      expect(seoSocial).toContain(classHook);
    }
    expect(seoSocial).toContain("data-active={active ? 'true' : 'false'}");
    expect(seoSocialCss).toContain(".section[data-active='false']");
    expect(seoSocialCss).toContain('.input:focus-visible');
    expect(seoSocialCss).toContain('.socialPreviewGrid {');
    expect(seoSocialCss).toContain('@media (max-width: 760px)');
    expect(seoHreflang).toContain("import styles from './SeoPanelHreflangTab.module.css';");
    expect(seoHreflang).not.toContain("from './SeoPanel.styles'");
    expect(seoHreflang).not.toContain('style=');
    for (const classHook of [
      'className={styles.section}',
      'className={styles.titleBlock}',
      'className={styles.sectionTitle}',
      'className={styles.helpText}',
      'className={`${styles.previewCard} ${styles.emptyCard}`}',
      'className={styles.list}',
      'className={`${styles.previewCard} ${styles.alternateRow}`}',
      'className={styles.hreflangCode}',
      'className={styles.rowUrl}',
      'className={`${styles.previewCard} ${styles.siblingRow}`}',
      'className={styles.siblingUrl}',
      'className={styles.indexStatus}',
      'className={`${styles.previewCard} ${styles.warningCard}`}',
      'className={`${styles.previewCard} ${styles.statusCard}`}',
      'className={styles.statusLabel}',
      'className={styles.statusHelp}',
    ]) {
      expect(seoHreflang).toContain(classHook);
    }
    expect(seoHreflang).toContain("data-active={active ? 'true' : 'false'}");
    expect(seoHreflang).toContain("data-default={alt.hreflang === 'x-default' ? 'true' : undefined}");
    expect(seoHreflang).toContain("data-tone={sibling.noIndex ? 'warning' : 'success'}");
    expect(seoHreflang).toContain("data-included={sitemapIncluded ? 'true' : 'false'}");
    expect(seoHreflangCss).toContain(".section[data-active='false']");
    expect(seoHreflangCss).toContain(".hreflangCode[data-default='true']");
    expect(seoHreflangCss).toContain(".indexStatus[data-tone='warning']");
    expect(seoHreflangCss).toContain(".statusCard[data-included='true']");
    expect(seoHreflangCss).toContain('@media (max-width: 760px)');
    expect(seoAdvanced).toContain("import styles from './SeoPanelAdvancedTab.module.css';");
    expect(seoAdvanced).not.toContain("from './SeoPanel.styles'");
    expect(seoAdvanced).not.toContain('style=');
    for (const classHook of [
      'className={styles.section}',
      'className={styles.sectionHeader}',
      'className={styles.titleBlock}',
      'className={styles.sectionTitle}',
      'className={styles.helpText}',
      'className={styles.ghostButton}',
      'className={`${styles.previewCard} ${styles.emptyCard}`}',
      'className={styles.metaList}',
      'className={styles.metaRow}',
      'className={styles.input}',
      'className={styles.checkboxGrid}',
      'className={styles.checkboxRow}',
      'className={styles.field}',
      'className={styles.label}',
      'className={styles.subTitle}',
      'className={styles.blockList}',
      'className={styles.previewCard}',
      'className={styles.twoColumn}',
      'className={`${styles.input} ${styles.textarea}`}',
      'className={styles.formActions}',
      'className={`${styles.checkboxRow} ${styles.useRow}`}',
      'className={styles.blockType}',
    ]) {
      expect(seoAdvanced).toContain(classHook);
    }
    expect(seoAdvanced).toContain("data-active={active ? 'true' : 'false'}");
    expect(seoAdvancedCss).toContain(".section[data-active='false']");
    expect(seoAdvancedCss).toContain('.input:focus-visible');
    expect(seoAdvancedCss).toContain('.ghostButton:focus-visible');
    expect(seoAdvancedCss).toContain('.metaRow {');
    expect(seoAdvancedCss).toContain('@media (max-width: 760px)');
    expect(seoAssistant).toContain("import styles from './SeoPanelAssistantTab.module.css';");
    expect(seoAssistant).not.toContain("from './SeoPanel.styles'");
    expect(seoAssistant).not.toContain('style=');
    expect(seoAssistant).not.toContain('CSSProperties');
    for (const classHook of [
      'className={styles.section}',
      'className={styles.sectionHeader}',
      'className={styles.titleBlock}',
      'className={styles.sectionTitle}',
      'className={styles.helpText}',
      'className={styles.ghostButton}',
      'className={styles.field}',
      'className={styles.label}',
      'className={styles.input}',
      'className={styles.statusText}',
      'className={`${styles.previewCard} ${styles.emptyCard}`}',
      'className={styles.list}',
      'className={styles.previewCard}',
      'className={styles.taskHeader}',
      'className={styles.taskTitle}',
      'className={`${styles.previewCard} ${styles.validationPass}`}',
      'className={styles.issueCard}',
    ]) {
      expect(seoAssistant).toContain(classHook);
    }
    expect(seoAssistant).toContain("data-active={active ? 'true' : 'false'}");
    expect(seoAssistant).toContain("data-tone={isFailure ? 'error' : 'success'}");
    expect(seoAssistant).toContain('data-tone={issueTone(issue)}');
    expect(seoAssistantCss).toContain(".section[data-active='false']");
    expect(seoAssistantCss).toContain(".statusText[data-tone='error']");
    expect(seoAssistantCss).toContain(".issueCard[data-tone='blocker']");
    expect(seoAssistantCss).toContain('.input:focus-visible');
    expect(seoAssistantCss).toContain('@media (max-width: 760px)');
    expect(settingsAdvanced).toContain("import styles from './SiteSettingsAdvancedTab.module.css';");
    expect(settingsAdvanced).not.toContain("from './SiteSettingsModal.styles'");
    expect(settingsAdvanced).not.toContain('style=');
    expect(settingsAdvanced).not.toContain('currentTarget.style');
    expect(settingsAdvanced).toContain('className={styles.root}');
    expect(settingsAdvanced).toContain('className={styles.sectionHeading}');
    expect(settingsAdvanced).toContain('className={styles.fieldGrid}');
    expect(settingsAdvanced).toContain('className={styles.field}');
    expect(settingsAdvanced).toContain('className={styles.label}');
    expect(settingsAdvanced).toContain('className={styles.input}');
    expect(settingsAdvanced).toContain('className={styles.colorRow}');
    expect(settingsAdvanced).toContain('className={styles.colorInput}');
    expect(settingsAdvancedCss).toContain('.input:focus-visible');
    expect(settingsAdvancedCss).toContain('.colorInput:focus-visible');
    expect(settingsAdvancedCss).toContain('.input:disabled');
    expect(settingsDarkMode).toContain("import styles from './SiteSettingsDarkModeTab.module.css';");
    expect(settingsDarkMode).not.toContain("from './SiteSettingsModal.styles'");
    expect(settingsDarkMode).not.toContain('style={{');
    expect(settingsDarkMode).not.toContain('currentTarget.style');
    expect(settingsDarkMode).toContain('className={styles.root}');
    expect(settingsDarkMode).toContain('className={styles.section}');
    expect(settingsDarkMode).toContain('className={styles.sectionHeading}');
    expect(settingsDarkMode).toContain('className={styles.field}');
    expect(settingsDarkMode).toContain('className={styles.label}');
    expect(settingsDarkMode).toContain('className={styles.input}');
    expect(settingsDarkMode).toContain('className={styles.checkboxLabel}');
    expect(settingsDarkMode).toContain('className={styles.previewGrid}');
    expect(settingsDarkMode).toContain('className={styles.previewCard}');
    expect(settingsDarkMode).toContain('className={styles.previewChip}');
    expect(settingsDarkMode).toContain('className={styles.colorRow}');
    expect(settingsDarkMode).toContain('className={styles.colorInput}');
    expect(settingsDarkMode).toContain('style={themePreviewStyle(theme, colors)}');
    expect(settingsDarkModeCss).toContain('.previewCard {');
    expect(settingsDarkModeCss).toContain('var(--site-dark-preview-bg');
    expect(settingsDarkModeCss).toContain(".previewChip[data-tone='primary']");
    expect(settingsDarkModeCss).toContain('.colorInput:focus-visible');
    expect(settingsGeneral).toContain("import styles from './SiteSettingsGeneralTab.module.css';");
    expect(settingsGeneral).not.toContain("from './SiteSettingsModal.styles'");
    expect(settingsGeneral).not.toContain('style=');
    expect(settingsGeneral).not.toContain('currentTarget.style');
    expect(settingsGeneral).toContain('className={styles.root}');
    expect(settingsGeneral).toContain('className={styles.sectionHeading}');
    expect(settingsGeneral).toContain('className={styles.field}');
    expect(settingsGeneral).toContain('className={styles.label}');
    expect(settingsGeneral).toContain('className={styles.input}');
    expect(settingsGeneralCss).toContain('.input:focus-visible');
    expect(settingsGeneralCss).toContain('box-shadow: 0 0 0 3px rgb(17 109 255 / 14%)');
    expect(settingsMobile).toContain("import styles from './SiteSettingsMobileTab.module.css';");
    expect(settingsMobile).not.toContain("from './SiteSettingsModal.styles'");
    expect(settingsMobile).not.toContain('style=');
    expect(settingsMobile).toContain('className={styles.root}');
    expect(settingsMobile).toContain('className={styles.sectionHeading}');
    expect(settingsMobile).toContain('className={styles.checkboxLabel}');
    expect(settingsMobile).toContain('className={styles.checkbox}');
    expect(settingsMobile).toContain('className={styles.field}');
    expect(settingsMobile).toContain('className={styles.label}');
    expect(settingsMobile).toContain('className={styles.input}');
    expect(settingsMobile).toContain('className={styles.actionCard}');
    expect(settingsMobile).toContain('className={styles.actionFieldsGrid}');
    expect(settingsMobileCss).toContain('.actionCard {');
    expect(settingsMobileCss).toContain('.input:focus-visible');
    expect(settingsMobileCss).toContain('@media (max-width: 760px)');
    expect(settingsPresets).toContain("import styles from './SiteSettingsPresetsTab.module.css';");
    expect(settingsPresets).not.toContain("from './SiteSettingsModal.styles'");
    expect(settingsPresets).not.toContain('style={{');
    for (const legacyName of [
      'presetButtonStyle',
      'presetCardStyle',
      'presetGridStyle',
      'sectionStyle',
    ]) {
      expect(settingsPresets).not.toContain(legacyName);
    }
    for (const classHook of [
      'className={styles.hiddenInput}',
      'className={styles.section}',
      'className={styles.sectionHeading}',
      'className={styles.grid}',
      'className={styles.card}',
      'className={styles.title}',
      'className={styles.description}',
      'className={styles.descriptionSmall}',
      'className={styles.metaBox}',
      'className={styles.button}',
      'className={styles.radiusPreview}',
      'className={styles.radiusSwatch}',
      'className={styles.shadowPreview}',
      'className={styles.shadowSwatch}',
      'className={styles.cardHeader}',
      'className={styles.paletteRow}',
      'className={styles.paletteSwatch}',
      'className={styles.themePreview}',
      'className={styles.pendingCard}',
    ]) {
      expect(settingsPresets).toContain(classHook);
    }
    for (const classToken of [
      'styles.buttonFull',
      'styles.buttonDanger',
      'styles.buttonPrimary',
      'styles.themePreviewTitle',
      'styles.themePreviewBody',
      'styles.emptyText',
      'styles.pendingTitle',
      'styles.pendingDescription',
    ]) {
      expect(settingsPresets).toContain(classToken);
    }
    expect(settingsPresets).toContain('style={metaBoxStyle(theme)}');
    expect(settingsPresets).toContain('style={radiusSwatchStyle(');
    expect(settingsPresets).toContain('style={shadowSwatchStyle(');
    expect(settingsPresets).toContain('style={swatchStyle(');
    expect(settingsPresets).toContain('style={builderThemePreviewStyle(preset.theme)}');
    expect(settingsPresets).toContain('style={siteThemePreviewStyle(preset)}');
    expect(settingsPresets).toContain('style={siteThemeTitleStyle(preset)}');
    expect(settingsPresetsCss).toContain(".card[data-active='true']");
    expect(settingsPresetsCss).toContain('.button:focus-visible');
    expect(settingsPresetsCss).toContain('.themePreview {');
    expect(settingsPresetsCss).toContain('.paletteSwatch {');
    expect(settingsPresetsCss).toContain('@media (max-width: 760px)');
    expect(settingsTypography).toContain("import styles from './SiteSettingsTypographyTab.module.css';");
    expect(settingsTypography).not.toContain("from './SiteSettingsModal.styles'");
    expect(settingsTypography).not.toContain('style={{');
    expect(settingsTypography).not.toContain('style={inputStyle}');
    expect(settingsTypography).not.toContain('style={fieldStyle}');
    expect(settingsTypography).toContain('className={styles.root}');
    expect(settingsTypography).toContain('className={styles.sectionHeading}');
    expect(settingsTypography).toContain('className={styles.fieldGrid}');
    expect(settingsTypography).toContain('className={styles.field}');
    expect(settingsTypography).toContain('className={styles.label}');
    expect(settingsTypography).toContain('className={styles.input}');
    expect(settingsTypography).toContain('className={styles.scalePreview}');
    expect(settingsTypography).toContain('className={styles.scalePreviewRow}');
    expect(settingsTypography).toContain('className={styles.scalePreviewSample}');
    expect(settingsTypography).toContain('className={styles.presetCard}');
    expect(settingsTypography).toContain('className={styles.presetPreview}');
    expect(settingsTypography).toContain('style={scalePreviewSampleStyle(theme, numericSize, isHeading)}');
    expect(settingsTypography).toContain('style={presetPreviewStyle(preset, theme)}');
    expect(settingsTypographyCss).toContain('.scalePreview {');
    expect(settingsTypographyCss).toContain('.scalePreviewSample {');
    expect(settingsTypographyCss).toContain('var(--site-typography-preview-family');
    expect(settingsTypographyCss).toContain('.presetCard {');
    expect(settingsTypographyCss).toContain('var(--site-typography-preset-family');

    for (const legacyName of [
      'publishBackdropIn',
      'publishModalIn',
      'cropBackdropIn',
      'cropModalIn',
      'templateGalleryFadeIn',
      'templateGalleryScaleIn',
    ]) {
      expect(canvasDirFiles, legacyName).not.toContain(legacyName);
    }
  });

  test('renders template thumbnails through the HTML renderer and bounded cache', () => {
    const renderer = read('src/components/builder/canvas/TemplateThumbnailRenderer.tsx');
    const placeholder = read('src/components/builder/canvas/TemplateThumbnailPlaceholder.tsx');
    const cache = read('src/components/builder/canvas/template-thumbnail-cache.ts');
    const gallery = read('src/components/builder/canvas/TemplateGalleryModal.tsx');

    expect(renderer).toContain('data-template-thumbnail-renderer="html-scaled-mock"');
    expect(renderer).toContain('IntersectionObserver');
    expect(renderer).toContain('MAX_RENDERED_NODES = 60');
    expect(placeholder).toContain('<TemplateThumbnailRenderer');
    expect(cache).toContain('WeakMap<PageTemplate');
    expect(cache).toContain('MAX_ENTRIES_PER_TEMPLATE = 6');
    expect(gallery).toContain('<TemplateThumbnailRenderer');
  });
});
