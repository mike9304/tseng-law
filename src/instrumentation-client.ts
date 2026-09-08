import { z } from 'zod';

// Next 15.5 evaluates this file via require-instrumentation-client before
// app-index/hydration. Zod object JIT otherwise probes `new Function("")`,
// which production CSP forbids (no unsafe-eval).
z.config({ jitless: true });
