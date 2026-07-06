import type {
  BuilderHeaderFooterConfig,
  BuilderMobileBottomBar,
  BuilderMobileBottomBarAction,
  BuilderSiteSettings,
} from '@/lib/builder/site/types';
import {
  normalizeHeaderFooterMobileConfig,
  normalizeMobileBottomBar,
} from '@/lib/builder/site/mobile-schema';
import type { Locale } from '@/lib/locales';
import { getSiteSettingsCopy } from './site-settings-copy';
import styles from './SiteSettingsMobileTab.module.css';

interface SiteSettingsMobileTabProps {
  headerFooter: BuilderHeaderFooterConfig;
  mobileBottomBar: BuilderMobileBottomBar;
  settings: Partial<BuilderSiteSettings>;
  onChangeHeaderFooter: (next: BuilderHeaderFooterConfig) => void;
  onChangeMobileBottomBar: (next: BuilderMobileBottomBar) => void;
  locale: Locale;
}

export function SiteSettingsMobileTab({
  headerFooter,
  mobileBottomBar,
  settings,
  onChangeHeaderFooter,
  onChangeMobileBottomBar,
  locale,
}: SiteSettingsMobileTabProps) {
  const normalizedBottomBar = normalizeMobileBottomBar(mobileBottomBar, settings);
  const copy = getSiteSettingsCopy(locale);

  const updateMobileBottomAction = (
    index: number,
    patch: Partial<BuilderMobileBottomBarAction>,
  ) => {
    const actions = normalizedBottomBar.actions.map((action, actionIndex) => (
      actionIndex === index ? { ...action, ...patch } : action
    ));
    onChangeMobileBottomBar({ ...normalizedBottomBar, actions });
  };

  return (
    <div className={styles.root}>
      <div className={styles.sectionHeading}>{copy.mobile.headerHeading}</div>
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={headerFooter.mobileSticky === true}
          className={styles.checkbox}
          onChange={(event) => {
            onChangeHeaderFooter({
              ...normalizeHeaderFooterMobileConfig(headerFooter),
              mobileSticky: event.target.checked,
            });
          }}
        />
        {copy.mobile.stickyHeader}
      </label>
      <div className={styles.field}>
        <label className={styles.label}>{copy.mobile.hamburgerMode}</label>
        <select
          value={headerFooter.mobileHamburger ?? 'auto'}
          className={styles.input}
          onChange={(event) => {
            const value = event.target.value;
            onChangeHeaderFooter({
              ...normalizeHeaderFooterMobileConfig(headerFooter),
              mobileHamburger: value === 'off' || value === 'force' ? value : 'auto',
            });
          }}
        >
          <option value="auto">{copy.mobile.hamburgerAuto}</option>
          <option value="force">{copy.mobile.hamburgerForce}</option>
          <option value="off">{copy.mobile.hamburgerDesktop}</option>
        </select>
      </div>

      <div className={styles.sectionHeading}>{copy.mobile.bottomHeading}</div>
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={mobileBottomBar.enabled}
          className={styles.checkbox}
          onChange={(event) => {
            onChangeMobileBottomBar({
              ...normalizedBottomBar,
              enabled: event.target.checked,
            });
          }}
        />
        {copy.mobile.showBottomBar}
      </label>
      {normalizedBottomBar.actions.map((action, index) => (
        <section
          key={action.id || index}
          className={styles.actionCard}
        >
          <div className={styles.field}>
            <label className={styles.label}>{copy.mobile.type}</label>
            <select
              value={action.kind}
              className={styles.input}
              onChange={(event) => {
                const value = event.target.value;
                updateMobileBottomAction(index, {
                  kind: value === 'phone' || value === 'booking' ? value : 'custom',
                });
              }}
            >
              <option value="phone">{copy.mobile.phone}</option>
              <option value="booking">{copy.mobile.booking}</option>
              <option value="custom">{copy.mobile.custom}</option>
            </select>
          </div>
          <div className={styles.actionFieldsGrid}>
            <div className={styles.field}>
              <label className={styles.label}>{copy.mobile.label}</label>
              <input
                type="text"
                value={action.label}
                className={styles.input}
                onChange={(event) => updateMobileBottomAction(index, { label: event.target.value })}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>{copy.mobile.link}</label>
              <input
                type="text"
                value={action.href}
                className={styles.input}
                onChange={(event) => updateMobileBottomAction(index, { href: event.target.value })}
              />
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
