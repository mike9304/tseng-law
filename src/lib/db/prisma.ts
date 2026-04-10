// Compatibility stub for a missing Prisma client module.
// This preserves import/type resolution without pretending DB writes succeeded.

function createPrismaUnavailableError() {
  return new Error('Prisma client is not configured. Add the real src/lib/db/prisma.ts implementation.');
}

const modelProxy = new Proxy(
  {},
  {
    get() {
      return async () => {
        throw createPrismaUnavailableError();
      };
    },
  }
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const prisma: any = new Proxy(
  {},
  {
    get() {
      return modelProxy;
    },
  }
);
