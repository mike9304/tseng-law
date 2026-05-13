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
import {
  fieldStyle,
  inputStyle,
  labelStyle,
  sectionHeadingStyle,
  sectionStyle,
  twoColumnStyle,
} from './SiteSettingsModal.styles';

interface SiteSettingsMobileTabProps {
  headerFooter: BuilderHeaderFooterConfig;
  mobileBottomBar: BuilderMobileBottomBar;
  settings: Partial<BuilderSiteSettings>;
  onChangeHeaderFooter: (next: BuilderHeaderFooterConfig) => void;
  onChangeMobileBottomBar: (next: BuilderMobileBottomBar) => void;
}

export function SiteSettingsMobileTab({
  headerFooter,
  mobileBottomBar,
  settings,
  onChangeHeaderFooter,
  onChangeMobileBottomBar,
}: SiteSettingsMobileTabProps) {
  const normalizedBottomBar = normalizeMobileBottomBar(mobileBottomBar, settings);

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
    <div style={sectionStyle}>
      <div style={sectionHeadingStyle}>Mobile header</div>
      <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', fontWeight: 800, color: '#334155' }}>
        <input
          type="checkbox"
          checked={headerFooter.mobileSticky === true}
          onChange={(event) => {
            onChangeHeaderFooter({
              ...normalizeHeaderFooterMobileConfig(headerFooter),
              mobileSticky: event.target.checked,
            });
          }}
        />
        Sticky mobile header
      </label>
      <div style={fieldStyle}>
        <label style={labelStyle}>Hamburger mode</label>
        <select
          value={headerFooter.mobileHamburger ?? 'auto'}
          style={inputStyle}
          onChange={(event) => {
            const value = event.target.value;
            onChangeHeaderFooter({
              ...normalizeHeaderFooterMobileConfig(headerFooter),
              mobileHamburger: value === 'off' || value === 'force' ? value : 'auto',
            });
          }}
        >
          <option value="auto">Auto</option>
          <option value="force">Force hamburger</option>
          <option value="off">Desktop menu on mobile</option>
        </select>
      </div>

      <div style={sectionHeadingStyle}>Mobile bottom CTA</div>
      <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', fontWeight: 800, color: '#334155' }}>
        <input
          type="checkbox"
          checked={mobileBottomBar.enabled}
          onChange={(event) => {
            onChangeMobileBottomBar({
              ...normalizedBottomBar,
              enabled: event.target.checked,
            });
          }}
        />
        Show fixed bottom action bar
      </label>
      {normalizedBottomBar.actions.map((action, index) => (
        <section
          key={action.id || index}
          style={{
            border: '1px solid #e2e8f0',
            borderRadius: 10,
            padding: 12,
            display: 'grid',
            gridTemplateColumns: '110px 1fr',
            gap: 10,
            alignItems: 'end',
          }}
        >
          <div style={fieldStyle}>
            <label style={labelStyle}>Type</label>
            <select
              value={action.kind}
              style={inputStyle}
              onChange={(event) => {
                const value = event.target.value;
                updateMobileBottomAction(index, {
                  kind: value === 'phone' || value === 'booking' ? value : 'custom',
                });
              }}
            >
              <option value="phone">Phone</option>
              <option value="booking">Booking</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <div style={twoColumnStyle}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Label</label>
              <input
                type="text"
                value={action.label}
                style={inputStyle}
                onChange={(event) => updateMobileBottomAction(index, { label: event.target.value })}
              />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Link</label>
              <input
                type="text"
                value={action.href}
                style={inputStyle}
                onChange={(event) => updateMobileBottomAction(index, { href: event.target.value })}
              />
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
