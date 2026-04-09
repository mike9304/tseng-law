import { prisma } from '@/lib/db/prisma';
import type { Locale } from '@/lib/locales';
import type {
  ConsultationCategory,
  ConsultationCollectedFields,
  ConsultationRiskLevel,
  ConsultationTranscriptMessage,
} from '@/lib/consultation/types';

/** Map app locale string to Prisma Locale enum value */
function toPrismaLocale(locale: Locale): 'ko' | 'zh_hant' | 'en' {
  if (locale === 'zh-hant') return 'zh_hant';
  return locale as 'ko' | 'en';
}

/** Map risk level string to Prisma ConsultationRisk enum */
function toPrismaRisk(level: ConsultationRiskLevel) {
  return level as 'L1' | 'L2' | 'L3' | 'L4';
}

/**
 * Find or create a ConsultationSession for the given sessionToken.
 * Called on each chat request to keep the session row up to date.
 */
export async function upsertConsultationSession(input: {
  sessionToken: string;
  locale: Locale;
  classification?: ConsultationCategory;
  riskLevel?: ConsultationRiskLevel;
  shouldEscalate?: boolean;
  ipAddress?: string | null;
  userAgent?: string | null;
}) {
  return prisma.consultationSession.upsert({
    where: { sessionToken: input.sessionToken },
    create: {
      sessionToken: input.sessionToken,
      locale: toPrismaLocale(input.locale),
      classification: input.classification,
      riskLevel: input.riskLevel ? toPrismaRisk(input.riskLevel) : undefined,
      shouldEscalate: input.shouldEscalate ?? false,
      ipAddress: input.ipAddress ?? undefined,
      userAgent: input.userAgent ?? undefined,
      messageCount: 1,
    },
    update: {
      classification: input.classification,
      riskLevel: input.riskLevel ? toPrismaRisk(input.riskLevel) : undefined,
      shouldEscalate: input.shouldEscalate ?? undefined,
      messageCount: { increment: 1 },
    },
  });
}

/**
 * Append a message to the ConsultationMessage table.
 */
export async function saveConsultationMessage(input: {
  sessionId: string; // Prisma session.id (cuid)
  role: 'user' | 'assistant';
  text: string;
}) {
  return prisma.consultationMessage.create({
    data: {
      sessionId: input.sessionId,
      role: input.role,
      text: input.text.slice(0, 4000), // safety cap
    },
  });
}

/**
 * Save a ConsultationLead row when the user submits the intake form.
 * Also marks the session as "submitted".
 */
export async function saveConsultationLead(input: {
  sessionToken: string;
  intakeId: string;
  locale: Locale;
  classification?: ConsultationCategory;
  riskLevel?: ConsultationRiskLevel;
  collectedFields: ConsultationCollectedFields;
  referencedColumns: string[];
  transcript: ConsultationTranscriptMessage[];
  emailDeliveryState?: 'pending' | 'sent' | 'failed';
}) {
  const fields = input.collectedFields;
  const prismaLocale = toPrismaLocale(input.locale);

  // Ensure session exists
  const session = await prisma.consultationSession.upsert({
    where: { sessionToken: input.sessionToken },
    create: {
      sessionToken: input.sessionToken,
      locale: prismaLocale,
      status: 'submitted',
      classification: input.classification,
      riskLevel: input.riskLevel ? toPrismaRisk(input.riskLevel) : undefined,
    },
    update: {
      status: 'submitted',
      classification: input.classification,
      riskLevel: input.riskLevel ? toPrismaRisk(input.riskLevel) : undefined,
    },
  });

  return prisma.consultationLead.create({
    data: {
      sessionId: session.id,
      intakeId: input.intakeId,
      locale: prismaLocale,
      classification: input.classification,
      riskLevel: input.riskLevel ? toPrismaRisk(input.riskLevel) : undefined,
      name: fields.name || '',
      email: fields.email,
      phoneOrMessenger: fields.phoneOrMessenger,
      preferredContact: fields.preferredContact,
      companyOrOrganization: fields.companyOrOrganization,
      countryOrResidence: fields.countryOrResidence,
      preferredTime: fields.preferredTime,
      urgency: fields.urgency,
      summary: fields.summary || '',
      hasDocuments: fields.hasDocuments,
      consentGiven: fields.consent === true,
      referencedColumns: input.referencedColumns,
      emailDeliveryState: input.emailDeliveryState ?? 'pending',
      transcriptJson: JSON.parse(JSON.stringify(input.transcript.slice(-20))),
    },
  });
}

/**
 * Update the email delivery state of a lead after sending the email.
 */
export async function updateLeadEmailState(intakeId: string, state: 'sent' | 'failed') {
  return prisma.consultationLead.update({
    where: { intakeId },
    data: { emailDeliveryState: state },
  });
}
