/**
 * Phase 16 — Pricing Plans Module.
 *
 * PRC-01: Plan model (name, price, currency, interval, features, CTA)
 * PRC-02: Plan comparison (multiple plans side by side)
 * PRC-03: Contact-based pricing mode (법률사무소: "상담 후 결정")
 *
 * For law firm: consultation-based pricing, package plans,
 * and "contact us for pricing" fallback.
 */

import type { Locale } from '@/lib/locales';
import { get, put, list } from '@vercel/blob';

// ─── Plan Model ──────────────────────────────────────────────────

export type PricingInterval = 'monthly' | 'yearly' | 'one-time';

export type PricingMode = 'fixed' | 'contact';

export interface PricingFeature {
  text: string;
  included: boolean;
}

export interface PricingPlan {
  planId: string;
  name: string;
  description?: string;
  price: number;
  currency: string;           // KRW, TWD, USD, etc.
  interval: PricingInterval;
  mode: PricingMode;          // 'contact' = "상담 후 결정" mode
  features: string[];
  featuresDetailed?: PricingFeature[];
  highlighted: boolean;       // visually emphasized plan
  cta: string;                // call-to-action label
  ctaUrl?: string;            // link for the CTA button
  locale: Locale;
  order: number;              // display order
  createdAt: string;
  updatedAt: string;
}

export interface PricingConfig {
  configId: string;
  title: string;
  subtitle?: string;
  showToggle: boolean;        // monthly/yearly toggle
  contactMessage?: string;    // message for contact-based pricing
  locale: Locale;
}

// ─── Blob Prefixes ───────────────────────────────────────────────

const PLANS_PREFIX = 'builder-pricing/plans/';
const CONFIG_PREFIX = 'builder-pricing/config/';

// ─── Plan CRUD ───────────────────────────────────────────────────

export async function savePlan(plan: PricingPlan): Promise<void> {
  await put(`${PLANS_PREFIX}${plan.planId}.json`, JSON.stringify(plan), {
    access: 'private', allowOverwrite: true, contentType: 'application/json',
  });
}

export async function loadPlan(planId: string): Promise<PricingPlan | null> {
  try {
    const result = await get(`${PLANS_PREFIX}${planId}.json`, { access: 'private', useCache: false });
    if (result?.statusCode === 200 && result.stream) {
      return JSON.parse(await new Response(result.stream).text()) as PricingPlan;
    }
  } catch { /* empty */ }
  return null;
}

export async function listPlans(): Promise<PricingPlan[]> {
  try {
    const result = await list({ prefix: PLANS_PREFIX });
    const plans: PricingPlan[] = [];
    for (const blob of result.blobs) {
      try {
        const res = await get(blob.pathname, { access: 'private', useCache: false });
        if (res?.statusCode === 200 && res.stream) {
          plans.push(JSON.parse(await new Response(res.stream).text()) as PricingPlan);
        }
      } catch { /* skip */ }
    }
    return plans;
  } catch { return []; }
}

export async function deletePlan(planId: string): Promise<void> {
  await put(`${PLANS_PREFIX}${planId}.json`, JSON.stringify({ deleted: true }), {
    access: 'private', allowOverwrite: true, contentType: 'application/json',
  });
}

// ─── Config CRUD ─────────────────────────────────────────────────

export async function savePricingConfig(config: PricingConfig): Promise<void> {
  await put(`${CONFIG_PREFIX}${config.configId}.json`, JSON.stringify(config), {
    access: 'private', allowOverwrite: true, contentType: 'application/json',
  });
}

export async function loadPricingConfig(configId: string): Promise<PricingConfig | null> {
  try {
    const result = await get(`${CONFIG_PREFIX}${configId}.json`, { access: 'private', useCache: false });
    if (result?.statusCode === 200 && result.stream) {
      return JSON.parse(await new Response(result.stream).text()) as PricingConfig;
    }
  } catch { /* empty */ }
  return null;
}

// ─── Plan Comparison ─────────────────────────────────────────────

export interface PlanComparison {
  plans: PricingPlan[];
  allFeatures: string[];
  featureMatrix: Record<string, Record<string, boolean>>;  // planId -> feature -> included
}

export function buildPlanComparison(plans: PricingPlan[]): PlanComparison {
  const sorted = [...plans].sort((a, b) => a.order - b.order);

  // Collect all unique features across plans
  const featureSet = new Set<string>();
  for (const plan of sorted) {
    if (plan.featuresDetailed) {
      for (const f of plan.featuresDetailed) featureSet.add(f.text);
    } else {
      for (const f of plan.features) featureSet.add(f);
    }
  }
  const allFeatures = [...featureSet];

  // Build matrix
  const featureMatrix: Record<string, Record<string, boolean>> = {};
  for (const plan of sorted) {
    const map: Record<string, boolean> = {};
    if (plan.featuresDetailed) {
      for (const f of plan.featuresDetailed) map[f.text] = f.included;
      // Features not mentioned default to false
      for (const f of allFeatures) {
        if (!(f in map)) map[f] = false;
      }
    } else {
      for (const f of allFeatures) map[f] = plan.features.includes(f);
    }
    featureMatrix[plan.planId] = map;
  }

  return { plans: sorted, allFeatures, featureMatrix };
}

// ─── Sorting / Filtering ────────────────────────────────────────

export function sortPlansByPrice(plans: PricingPlan[], direction: 'asc' | 'desc' = 'asc'): PricingPlan[] {
  const sorted = [...plans];
  return sorted.sort((a, b) => direction === 'asc' ? a.price - b.price : b.price - a.price);
}

export function filterPlansByInterval(plans: PricingPlan[], interval: PricingInterval): PricingPlan[] {
  return plans.filter((p) => p.interval === interval);
}

export function filterPlansByLocale(plans: PricingPlan[], locale: Locale): PricingPlan[] {
  return plans.filter((p) => p.locale === locale);
}

// ─── Validation ──────────────────────────────────────────────────

export function validatePlan(plan: Partial<PricingPlan>): string[] {
  const errors: string[] = [];
  if (!plan.name?.trim()) errors.push('플랜 이름을 입력하세요.');
  if (plan.mode === 'fixed' && (plan.price == null || plan.price < 0)) {
    errors.push('가격은 0 이상이어야 합니다.');
  }
  if (!plan.currency?.trim()) errors.push('통화를 입력하세요.');
  if (!plan.interval) errors.push('결제 주기를 선택하세요.');
  if (!plan.cta?.trim()) errors.push('CTA 버튼 텍스트를 입력하세요.');
  return errors;
}

// ─── Default law-firm pricing plans ──────────────────────────────

export function createDefaultLawFirmPlans(): PricingPlan[] {
  const now = new Date().toISOString();
  return [
    {
      planId: 'plan-basic-consult',
      name: '기본 상담',
      description: '30분 전화/대면 법률 상담',
      price: 0,
      currency: 'KRW',
      interval: 'one-time',
      mode: 'contact',
      features: ['30분 법률 상담', '기본 법률 자문', '관련 서류 검토'],
      highlighted: false,
      cta: '상담 예약',
      locale: 'ko',
      order: 0,
      createdAt: now,
      updatedAt: now,
    },
    {
      planId: 'plan-standard',
      name: '표준 사건 수임',
      description: '일반 민사/형사 사건 수임',
      price: 0,
      currency: 'KRW',
      interval: 'one-time',
      mode: 'contact',
      features: ['사건 분석 및 전략 수립', '법률 서류 작성', '법원 출석 대리', '진행 상황 보고'],
      highlighted: true,
      cta: '상담 후 결정',
      locale: 'ko',
      order: 1,
      createdAt: now,
      updatedAt: now,
    },
    {
      planId: 'plan-premium',
      name: '종합 법률 자문',
      description: '기업/개인 종합 법률 자문 패키지',
      price: 0,
      currency: 'KRW',
      interval: 'monthly',
      mode: 'contact',
      features: ['월 정기 법률 자문', '계약서 검토 무제한', '우선 상담 예약', '긴급 법률 지원', '세미나 초대'],
      highlighted: false,
      cta: '문의하기',
      locale: 'ko',
      order: 2,
      createdAt: now,
      updatedAt: now,
    },
  ];
}
