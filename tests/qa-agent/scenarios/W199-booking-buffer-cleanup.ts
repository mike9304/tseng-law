import { promises as fs } from 'node:fs';
import path from 'node:path';

type CleanupIds = {
  readonly staffId: string | null;
  readonly serviceId: string | null;
  readonly bookingId: string | null;
};

export async function cleanupFiles(ids: CleanupIds): Promise<void> {
  const root = process.env.BUILDER_BOOKINGS_ROOT ?? path.join(process.cwd(), 'runtime-data', 'builder-bookings');
  if (ids.staffId) {
    await fs.rm(path.join(root, 'staff', `${ids.staffId}.json`), { force: true });
    await fs.rm(path.join(root, 'availability', `${ids.staffId}.json`), { force: true });
  }
  if (ids.serviceId) {
    await fs.rm(path.join(root, 'services', `${ids.serviceId}.json`), { force: true });
  }
  if (ids.bookingId) {
    await fs.rm(path.join(root, 'bookings', `${ids.bookingId}.json`), { force: true });
  }
}
