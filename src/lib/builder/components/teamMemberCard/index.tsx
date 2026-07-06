import Image from 'next/image';
import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderTeamMemberCardCanvasNode } from '@/lib/builder/canvas/types';
import { safeHref } from '@/lib/builder/links';
import type { BuilderTheme } from '@/lib/builder/site/types';
import {
  CARD_VARIANTS,
  resolveCardVariantStyle,
} from '@/lib/builder/site/component-variants';
import type { Locale } from '@/lib/locales';
import {
  getMarketingWidgetsCopy,
  localizedTeamMemberContent,
  TEAM_MEMBER_CARD_LEGACY_DEFAULTS,
} from '../marketing-widgets-copy';
import styles from './TeamMemberCardInspector.module.css';

function TeamMemberCardRender({
  node,
  locale = 'ko',
  theme,
}: {
  node: BuilderTeamMemberCardCanvasNode;
  locale?: Locale;
  theme?: BuilderTheme;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const copy = getMarketingWidgetsCopy(locale).teamMemberCard;
  const c = localizedTeamMemberContent(node.content, copy.defaultContent);
  const variantStyle = resolveCardVariantStyle(c.variant, theme);
  return (
    <article
      className="builder-datadisplay-team-card"
      data-builder-datadisplay-widget="team-member-card"
      style={{
        background: variantStyle.background,
        border: variantStyle.border,
        borderRadius: variantStyle.borderRadius,
        boxShadow: variantStyle.boxShadow,
        backdropFilter: variantStyle.backdropFilter,
        WebkitBackdropFilter: variantStyle.WebkitBackdropFilter,
      }}
    >
      <div className="builder-datadisplay-team-avatar">
        {c.avatar ? (
          <Image src={c.avatar} alt={c.name} width={120} height={120} style={{ objectFit: 'cover', borderRadius: '50%' }} />
        ) : (
          <span aria-hidden="true">{c.name?.[0] ?? '·'}</span>
        )}
      </div>
      <strong>{c.name}</strong>
      {c.role ? <small>{c.role}</small> : null}
      {c.bio ? <p>{c.bio}</p> : null}
      {c.socialLinks.length > 0 ? (
        <ul>
          {c.socialLinks.map((link, idx) => {
            const href = safeHref(link.href);
            return (
              <li key={`${link.label}-${idx}`}>
                {href ? (
                  <a href={href} target="_blank" rel="noopener noreferrer">{link.label}</a>
                ) : (
                  <span>{link.label}</span>
                )}
              </li>
            );
          })}
        </ul>
      ) : null}
    </article>
  );
}

function socialToText(links: BuilderTeamMemberCardCanvasNode['content']['socialLinks']): string {
  return links.map((l) => `${l.label} | ${l.href}`).join('\n');
}

function parseSocial(value: string): BuilderTeamMemberCardCanvasNode['content']['socialLinks'] {
  const out: BuilderTeamMemberCardCanvasNode['content']['socialLinks'] = [];
  for (const raw of value.split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    const [label, href] = line.split('|').map((p) => p.trim());
    if (!label || !href) continue;
    out.push({ label: label.slice(0, 40), href: href.slice(0, 2000) });
  }
  return out.slice(0, 8);
}

function TeamMemberCardInspector({
  node,
  locale = 'ko',
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const tmNode = node as BuilderTeamMemberCardCanvasNode;
  const teamCopy = getMarketingWidgetsCopy(locale).teamMemberCard;
  const c = localizedTeamMemberContent(tmNode.content, teamCopy.defaultContent);
  const copy = teamCopy.inspector;
  return (
    <div className={styles.root} data-builder-team-member-card-inspector="true">
      <label className={styles.field}>
        <span className={styles.label}>{copy.name}</span>
        <input
          className={styles.control}
          type="text"
          value={c.name}
          disabled={disabled}
          onChange={(event) => onUpdate({ name: event.target.value })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.role}</span>
        <input
          className={styles.control}
          type="text"
          value={c.role}
          disabled={disabled}
          onChange={(event) => onUpdate({ role: event.target.value })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.bio}</span>
        <textarea
          className={`${styles.control} ${styles.textarea}`}
          rows={4}
          value={c.bio}
          disabled={disabled}
          onChange={(event) => onUpdate({ bio: event.target.value })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.avatarUrl}</span>
        <input
          className={styles.control}
          type="text"
          value={c.avatar}
          disabled={disabled}
          onChange={(event) => onUpdate({ avatar: event.target.value })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.socialLinks}</span>
        <textarea
          className={`${styles.control} ${styles.textarea}`}
          rows={3}
          value={socialToText(c.socialLinks)}
          disabled={disabled}
          onChange={(event) => onUpdate({ socialLinks: parseSocial(event.target.value) })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.cardStyle}</span>
        <select
          className={styles.control}
          value={c.variant ?? 'flat'}
          disabled={disabled}
          onChange={(event) => onUpdate({ variant: event.target.value })}
        >
          {CARD_VARIANTS.map((variant) => (
            <option key={variant.key} value={variant.key}>
              {copy.cardVariants[variant.key]}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export default defineComponent({
  kind: 'team-member-card',
  displayName: '팀원 카드',
  category: 'advanced',
  icon: '👤',
  defaultContent: {
    ...TEAM_MEMBER_CARD_LEGACY_DEFAULTS,
    socialLinks: TEAM_MEMBER_CARD_LEGACY_DEFAULTS.socialLinks.map((link) => ({ ...link })),
  },
  defaultStyle: {},
  defaultRect: { width: 280, height: 380 },
  Render: TeamMemberCardRender,
  Inspector: TeamMemberCardInspector,
});
