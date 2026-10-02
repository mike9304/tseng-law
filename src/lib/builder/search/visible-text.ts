/** Extract readable content, never builder configuration, CSS or URL values. */
const TEXT_KEYS = new Set([
  'text', 'plainText', 'title', 'heading', 'description', 'summary', 'caption',
  'label', 'alt', 'question', 'answer', 'placeholder', 'helpText', 'submitLabel',
  'successMessage', 'errorMessage', 'name', 'quote', 'body', 'paragraphs', 'tags',
  'features', 'columns', 'values', 'feature', 'price', 'period', 'role', 'bio',
  'specialties', 'year', 'date', 'message', 'buttonLabel', 'ctaLabel', 'eyebrow',
  'caseSummaryLabel', 'attachmentLinksLabel', 'customFieldLabels', 'homeLabel', 'line1', 'line2',
  'cityRegion', 'postalCode', 'country', 'phone', 'address', 'day', 'hours',
  'timezone', 'note', 'prefix', 'suffix', 'subtitle', 'loadingLabel',
  'loginLabel', 'profileLabel', 'bookingsLabel', 'premiumLabel', 'nameLabel',
  'phoneLabel', 'saveLabel', 'savingLabel', 'savedLabel', 'upcomingLabel',
  'pastLabel', 'emptyUpcomingLabel', 'emptyPastLabel', 'expiredText',
]);
const STRUCTURE_KEYS = new Set([
  'items', 'layoutItems', 'slides', 'tabs', 'options', 'fields', 'children',
  'richText', 'blocks', 'runs', 'content', 'config', 'overrides', 'faqs', 'links',
  'plans', 'rows', 'locations', 'points', 'slices', 'socialLinks', 'steps',
  'images', 'hotspots', 'customFieldLabels',
]);
const DISPLAY_NAME_KINDS = new Set([
  'attorneyCard', 'team-member-card', 'testimonial-carousel', 'pricing-table', 'multi-location-map',
]);

export function extractVisibleNodeText(node: { kind?: string; content?: unknown }): string {
  const out: string[] = [];
  const visit = (value: unknown, key = '', root = false): void => {
    if (typeof value === 'string') {
      if (value.trim() && TEXT_KEYS.has(key)) out.push(value.trim());
    } else if (Array.isArray(value)) {
      for (const item of value) visit(item, key);
    } else if (value && typeof value === 'object') {
      if (key === 'overrides' || key === 'customFieldLabels') {
        for (const override of Object.values(value)) visit(override, 'text');
        return;
      }
      for (const [childKey, child] of Object.entries(value)) {
        if (root && childKey === 'label' && (node.kind === 'container' || node.kind === 'section')) continue;
        if (childKey === 'name' && !DISPLAY_NAME_KINDS.has(node.kind ?? '')) continue;
        if ((node.kind === 'codeBlock' && childKey === 'code')
          || (node.kind === 'social-embed' && (childKey === 'handle' || childKey === 'channelId'))) {
          visit(child, 'text');
          continue;
        }
        if (TEXT_KEYS.has(childKey) || STRUCTURE_KEYS.has(childKey)) visit(child, childKey);
      }
    }
  };
  visit(node.content, '', true);
  return [...new Set(out)].join('\n');
}
