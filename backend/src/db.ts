import { PrismaClient } from '@prisma/client';

export const db = new PrismaClient({ log: ['query'] });

export const testDBConnection = async () => {
  try {
    await db.$connect();
  } catch (e) {
    return e;
  }
  await db.$disconnect();
};
