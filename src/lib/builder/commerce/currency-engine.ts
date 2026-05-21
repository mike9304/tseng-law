import { promises as fs } from 'fs';
import path from 'path';
import { get, put } from '@vercel/blob';
import {
  COMMERCE_CURRENCY_SETTINGS_VERSION,
  normalizeCurrencySettings,
  type CommerceCurrencySettings,
} from './currency-shared';

type CommerceBackend = 'blob' | 'file';

interface StoredCurrencySettings {
  version: typeof COMMERCE_CURRENCY_SETTINGS_VERSION;
  updatedAt: string;
  settings: CommerceCurrencySettings;
}

const CURRENCY_SETTINGS_BLOB_PATH = 'builder-commerce/currency-settings/settings.json';
const DEFAULT_COMMERCE_ROOT = path.join(process.cwd(), 'runtime-data', 'builder-commerce');

function getBackend(): CommerceBackend {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return 'file';
  if (process.env.CONSULTATION_LOG_BACKEND === 'local') return 'file';
  if (process.env.BUILDER_COMMERCE_BACKEND === 'local') return 'file';
  if (process.env.NODE_ENV !== 'production' && process.env.BUILDER_USE_BLOB_IN_DEV !== '1') return 'file';
  return 'blob';
}

function commerceRoot(): string {
  return process.env.BUILDER_COMMERCE_ROOT?.trim() || DEFAULT_COMMERCE_ROOT;
}

function currencySettingsFilePath(): string {
  return path.join(commerceRoot(), 'currency-settings', 'settings.json');
}

async function writeJson(data: unknown): Promise<void> {
  const body = JSON.stringify(data, null, 2);
  if (getBackend() === 'blob') {
    await put(CURRENCY_SETTINGS_BLOB_PATH, body, {
      access: 'private',
      allowOverwrite: true,
      contentType: 'application/json',
    });
    return;
  }
  const filePath = currencySettingsFilePath();
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, body, 'utf8');
}

async function readJson<T>(): Promise<T | null> {
  try {
    if (getBackend() === 'blob') {
      const result = await get(CURRENCY_SETTINGS_BLOB_PATH, { access: 'private', useCache: false });
      if (result?.statusCode === 200 && result.stream) {
        return JSON.parse(await new Response(result.stream).text()) as T;
      }
      return null;
    }
    return JSON.parse(await fs.readFile(currencySettingsFilePath(), 'utf8')) as T;
  } catch {
    return null;
  }
}

export async function loadCurrencySettings(): Promise<CommerceCurrencySettings> {
  const stored = await readJson<StoredCurrencySettings>();
  return normalizeCurrencySettings(stored?.settings, stored?.updatedAt);
}

export async function saveCurrencySettings(input: unknown, now = new Date().toISOString()): Promise<CommerceCurrencySettings> {
  const settings = normalizeCurrencySettings(input, now);
  await writeJson({
    version: COMMERCE_CURRENCY_SETTINGS_VERSION,
    updatedAt: now,
    settings,
  } satisfies StoredCurrencySettings);
  return settings;
}
