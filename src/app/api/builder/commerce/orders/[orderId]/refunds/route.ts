import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import { refundOrderPayment } from '@/lib/builder/commerce/orders-engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const refundSchema = z.object({
  amountCents: z.number().int().positive().max(100_000_000),
  reason: z.string().trim().max(500).optional(),
});

function validationError(error: ZodError): NextResponse {
  return NextResponse.json(
    { ok: false, error: 'validation_error', issues: error.flatten() },
    { status: 400 },
  );
}

export async function POST(
  request: NextRequest,
  { params }: { params: { orderId: string } },
) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  try {
    const input = refundSchema.parse(await request.json());
    const result = await refundOrderPayment(params.orderId, {
      amountCents: input.amountCents,
      reason: input.reason,
      actor: 'admin',
    });
    if (!result.order) return NextResponse.json({ ok: false, error: 'order_not_found' }, { status: 404 });
    if (!result.refund) {
      const status = result.error?.startsWith('refund_provider') || result.error === 'payment_reference_missing'
        ? 502
        : 400;
      return NextResponse.json({ ok: false, error: result.error ?? 'refund_failed', order: result.order }, { status });
    }
    return NextResponse.json({ ok: true, order: result.order, refund: result.refund });
  } catch (error) {
    if (error instanceof ZodError) return validationError(error);
    if (error instanceof SyntaxError) return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
    console.error('[builder/commerce/orders/:id/refunds] POST failed:', error);
    return NextResponse.json({ ok: false, error: 'refund_failed' }, { status: 500 });
  }
}
