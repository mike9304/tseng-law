import Image from 'next/image';
import type { BuilderTeamMemberCardCanvasNode } from '@/lib/builder/canvas/types';
import { safeHref } from '@/lib/builder/links';
import type { BuilderTheme } from '@/lib/builder/site/types';
import { resolveCardVariantStyle } from '@/lib/builder/site/component-variants';
import type { Locale } from '@/lib/locales';
import { getMarketingWidgetsCopy, localizedTeamMemberContent } from '../marketing-widgets-copy';

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

export default TeamMemberCardRender;
