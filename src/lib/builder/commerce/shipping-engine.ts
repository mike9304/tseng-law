import { promises as fs } from 'fs';
import path from 'path';
import { get, put } from '@vercel/blob';
import {
  COMMERCE_SHIPPING_RULES_VERSION,
  normalizeShippingRules,
  type CommerceShippingRule,
} from './shipping-shared';

type CommerceBackend = 'blob' | 'file';

interface StoredShippingRules {
  version: typeof COMMERCE_SHIPPING_RULES_VERSION;
  updatedAt: string;
  rules: CommerceShippingRule[];
}

const SHIPPING_RULES_BLOB_PATH = 'builder-commerce/shipping-rules/rules.json';
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

function shippingRulesFilePath(): string {
  return path.join(commerceRoot(), 'shipping-rules', 'rules.json');
}

async function writeJson(data: unknown): Promise<void> {
  const body = JSON.stringify(data, null, 2);
  if (getBackend() === 'blob') {
    await put(SHIPPING_RULES_BLOB_PATH, body, {
      access: 'private',
      allowOverwrite: true,
      contentType: 'application/json',
    });
    return;
  }
  const filePath = shippingRulesFilePath();
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, body, 'utf8');
}

async function readJson<T>(): Promise<T | null> {
  try {
    if (getBackend() === 'blob') {
      const result = await get(SHIPPING_RULES_BLOB_PATH, { access: 'private', useCache: false });
      if (result?.statusCode === 200 && result.stream) {
        return JSON.parse(await new Response(result.stream).text()) as T;
      }
      return null;
    }
    return JSON.parse(await fs.readFile(shippingRulesFilePath(), 'utf8')) as T;
  } catch {
    return null;
  }
}

export async function loadShippingRules(): Promise<CommerceShippingRule[]> {
  const stored = await readJson<StoredShippingRules>();
  return normalizeShippingRules(stored?.rules);
}

export async function saveShippingRules(input: unknown, now = new Date().toISOString()): Promise<CommerceShippingRule[]> {
  const rules = normalizeShippingRules(input).map((rule) => ({ ...rule, updatedAt: now }));
  await writeJson({
    version: COMMERCE_SHIPPING_RULES_VERSION,
    updatedAt: now,
    rules,
  } satisfies StoredShippingRules);
  return rules;
}
