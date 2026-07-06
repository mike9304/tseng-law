import { promises as fs } from 'node:fs';
import path from 'node:path';

type CleanupIds = {
  readonly staffId: string | null;
  readonly serviceId: string | null;
  readonly bookingId: string | null;
  readonly pageId: string | null;
};

const defaultSiteId = 'tseng-law-main-site';

export async function cleanupFiles(ids: CleanupIds): Promise<void> {
  const bookingsRoot = process.env.BUILDER_BOOKINGS_ROOT ?? path.join(process.cwd(), 'runtime-data', 'builder-bookings');
  if (ids.staffId) {
    await fs.rm(path.join(bookingsRoot, 'staff', `${ids.staffId}.json`), { force: true });
    await fs.rm(path.join(bookingsRoot, 'availability', `${ids.staffId}.json`), { force: true });
  }
  if (ids.serviceId) {
    await fs.rm(path.join(bookingsRoot, 'services', `${ids.serviceId}.json`), { force: true });
  }
  if (ids.bookingId) {
    await fs.rm(path.join(bookingsRoot, 'bookings', `${ids.bookingId}.json`), { force: true });
  }
  if (ids.pageId) {
    const siteRoot = process.env.BUILDER_SITE_ROOT ?? path.join(process.cwd(), 'runtime-data', 'builder-site');
    const pagesRoot = path.join(siteRoot, defaultSiteId, 'pages');
    await fs.rm(path.join(pagesRoot, `${ids.pageId}.draft.json`), { force: true });
    await fs.rm(path.join(pagesRoot, `${ids.pageId}.published.json`), { force: true });
  }
}
