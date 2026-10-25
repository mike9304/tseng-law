// The page renders the article title as its own H1. columns.ts:303 removes
// the optional duplicate leading Markdown H1 before rendering the body.
// Accept that removal only when the source H1 exactly matches frontmatter;
// verify-publication.py independently requires the visible page H1 to match.
export function bodyWithoutDuplicateTitle(content, title) {
  const trimmed = content.trimStart();
  const leading = /^#\s+([^\n]+)\n*/.exec(trimmed);
  if (!leading) return { content, titleMovedToPageH1: false };
  const normalize = value => String(value).normalize('NFC').replace(/\s+/g, ' ').trim();
  if (normalize(leading[1]) !== normalize(title)) {
    throw new Error('Leading Markdown H1 differs from frontmatter title');
  }
  return { content: trimmed.slice(leading[0].length), titleMovedToPageH1: true };
}
