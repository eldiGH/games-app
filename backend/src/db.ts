import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export const testDBConnection = async () => {
	try {
		await prisma.$connect();
	} catch (e) {
		return e;
	}
	await prisma.$disconnect();
};
