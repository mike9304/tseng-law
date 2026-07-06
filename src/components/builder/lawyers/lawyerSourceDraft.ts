import type { AttorneyProfileSourceRecord } from '@/lib/builder/lawyers/source';

export type LawyerSourceDraft = {
  readonly slug: string;
  readonly name: string;
  readonly role: string;
  readonly title: string;
  readonly description: string;
  readonly summary: string;
  readonly languages: string;
  readonly practiceAreas: string;
  readonly internalLinks: string;
  readonly email: string;
  readonly image: string;
  readonly imageAltText: string;
  readonly imageFocalX: string;
  readonly imageFocalY: string;
};

export type InternalLinksDraft =
  | { readonly ok: true; readonly links: readonly { readonly label: string; readonly href: string }[] }
  | { readonly ok: false; readonly message: string };

export function formStateFromRecord(record: AttorneyProfileSourceRecord | undefined): LawyerSourceDraft {
  return {
    slug: record?.slug ?? '',
    name: record?.name ?? '',
    role: record?.role ?? '',
    title: record?.title ?? '',
    description: record?.description ?? '',
    summary: record?.summary.join('\n') ?? '',
    languages: record?.languages.join('\n') ?? '',
    practiceAreas: record?.practiceAreas.join('\n') ?? '',
    internalLinks: record?.internalLinks.map((link) => `${link.label} | ${link.href}`).join('\n') ?? '',
    email: record?.email ?? '',
    image: record?.image ?? '',
    imageAltText: record?.imageAltText ?? '',
    imageFocalX: String(record?.imageFocalPoint.x ?? 0.5),
    imageFocalY: String(record?.imageFocalPoint.y ?? 0.5),
  };
}

export function splitSummary(value: string): string[] | undefined {
  const items = readListDraft(value);
  return items.length ? items : undefined;
}

export function splitList(value: string): string[] | undefined {
  const items = readListDraft(value);
  return items.length ? items : undefined;
}

export function readInternalLinksDraft(value: string): InternalLinksDraft {
  const links: { readonly label: string; readonly href: string }[] = [];
  for (const line of readListDraft(value)) {
    const separatorIndex = line.indexOf('|');
    if (separatorIndex < 0) return { ok: false, message: 'Internal links must use "Label | /path" lines.' };
    const label = line.slice(0, separatorIndex).trim();
    const href = line.slice(separatorIndex + 1).trim();
    if (!label || !href) return { ok: false, message: 'Internal link label and URL are required.' };
    links.push({ label, href });
  }
  return { ok: true, links };
}

export function readFocalDraft(value: string): number {
  const focal = Number(value);
  if (!Number.isFinite(focal)) return 0.5;
  if (focal < 0) return 0;
  if (focal > 1) return 1;
  return Number(focal.toFixed(3));
}

function readListDraft(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}
