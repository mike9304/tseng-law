import { promises as fs } from 'fs';
import path from 'path';
import { get, put } from '@vercel/blob';
import { z } from 'zod';

const BLOB_NAME = 'reviews.json';
const DEFAULT_REVIEWS_ROOT = path.join(process.cwd(), 'runtime-data', 'reviews');

const reviewSchema = z.object({
  id: z.string(),
  nickname: z.string(),
  rating: z.number(),
  service: z.string(),
  content: z.string(),
  createdAt: z.string(),
  status: z.enum(['approved', 'pending']).default('approved'),
});

const reviewsSchema = z.array(reviewSchema);

export type Review = z.infer<typeof reviewSchema>;

function reviewsRoot(): string {
  return process.env.REVIEWS_DATA_ROOT || DEFAULT_REVIEWS_ROOT;
}

function reviewsFilePath(): string {
  return path.join(reviewsRoot(), BLOB_NAME);
}

function shouldUseBlobBackend(): boolean {
  if (process.env.REVIEWS_BACKEND === 'local') return false;
  if (!process.env.BLOB_READ_WRITE_TOKEN) return false;
  if (process.env.NODE_ENV !== 'production' && process.env.BUILDER_USE_BLOB_IN_DEV !== '1') return false;
  return true;
}

function parseReviewsJson(raw: string): Review[] {
  return reviewsSchema.parse(JSON.parse(raw));
}

function isMissingFileError(error: unknown): boolean {
  return error instanceof Error && 'code' in error && error.code === 'ENOENT';
}

function logStorageError(operation: string, error: unknown): void {
  if (error instanceof Error) {
    console.error(`[Reviews] ${operation} error:`, error.message);
    return;
  }
  console.error(`[Reviews] ${operation} error:`, String(error));
}

async function readBlobReviews(): Promise<Review[]> {
  const result = await get(BLOB_NAME, { access: 'private', useCache: false });
  if (result?.statusCode !== 200 || !result.stream) return [];
  return parseReviewsJson(await new Response(result.stream).text());
}

async function writeBlobReviews(reviews: readonly Review[]): Promise<void> {
  await put(BLOB_NAME, JSON.stringify(reviews, null, 2), {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
  });
}

async function readFileReviewsForMutation(): Promise<Review[]> {
  try {
    return parseReviewsJson(await fs.readFile(reviewsFilePath(), 'utf8'));
  } catch (error) {
    if (isMissingFileError(error)) return [];
    throw error;
  }
}

async function readFileReviews(): Promise<Review[]> {
  try {
    return await readFileReviewsForMutation();
  } catch (error) {
    logStorageError('readFileReviews', error);
    return [];
  }
}

async function writeFileReviews(reviews: readonly Review[]): Promise<void> {
  const target = reviewsFilePath();
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, JSON.stringify(reviews, null, 2), 'utf8');
}

export async function readReviews(): Promise<Review[]> {
  try {
    return shouldUseBlobBackend() ? await readBlobReviews() : await readFileReviews();
  } catch (error) {
    logStorageError('readReviews', error);
    return [];
  }
}

export async function readReviewsForMutation(): Promise<Review[]> {
  return shouldUseBlobBackend() ? await readBlobReviews() : await readFileReviewsForMutation();
}

export async function writeReviews(reviews: readonly Review[]): Promise<void> {
  if (shouldUseBlobBackend()) {
    await writeBlobReviews(reviews);
    return;
  }
  await writeFileReviews(reviews);
}
