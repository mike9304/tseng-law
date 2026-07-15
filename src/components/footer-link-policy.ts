export type FooterLinkLike = {
  readonly label: string;
  readonly href: string;
};

export type FooterLinkColumnLike = {
  readonly title: string;
  readonly links: readonly FooterLinkLike[];
};

/** The production footer uses three concise links in every base column. */
export const BASE_FOOTER_LINK_LIMIT = 3;

export function getPublishedBaseFooterColumns(
  columns: readonly FooterLinkColumnLike[],
): FooterLinkColumnLike[] {
  return columns.map((column) => ({
    ...column,
    links: column.links.slice(0, BASE_FOOTER_LINK_LIMIT),
  }));
}
