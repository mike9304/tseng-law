import {
  aiIntakeExternalSubmitRequestSchema,
  aiIntakePreviewRequestSchema,
  aiIntakeRequirementsQuerySchema,
  type AiIntakeExternalSubmitRequest,
  type AiIntakePreviewRequest,
  type AiIntakeRequirementsQuery,
} from '@/lib/ai-intake/schemas';

export const aiIntakeMcpRequirementsInputSchema = aiIntakeRequirementsQuerySchema;

export const aiIntakeMcpPreviewInputSchema = aiIntakePreviewRequestSchema;

export const aiIntakeMcpSubmitInputSchema = aiIntakeExternalSubmitRequestSchema;

export type AiIntakeMcpRequirementsInput = AiIntakeRequirementsQuery;
export type AiIntakeMcpPreviewInput = AiIntakePreviewRequest;
export type AiIntakeMcpSubmitInput = AiIntakeExternalSubmitRequest;
