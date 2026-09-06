import type { StandardSchemaWithJSON } from '@modelcontextprotocol/server';
import type { z } from 'zod';

/**
 * Advertises the strict Zod JSON Schema in `tools/list` while letting the SDK
 * pass the opaque arguments through. Validation happens in the tool callback
 * so unknown keys and PII never enter SDK error text.
 */
export function mcpPassThroughInputSchema(
  advertised: z.ZodType,
): StandardSchemaWithJSON<unknown, unknown> {
  const standard = (advertised as unknown as StandardSchemaWithJSON<unknown, unknown>)['~standard'];
  if (!standard.jsonSchema) {
    throw new Error('Advertised MCP tool schema must implement JSON Schema conversion.');
  }
  return {
    '~standard': {
      version: 1,
      vendor: 'tseng-law-ai-intake',
      jsonSchema: standard.jsonSchema,
      validate(value: unknown) {
        return { value };
      },
    },
  };
}
